(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(s){if(s.ep)return;s.ep=!0;const i=t(s);fetch(s.href,i)}})();function Yp(n){const e=(n.sippDraw||0)+(n.other||0)+(n.statePension||0),t=e*12,r=n.pa||12570,s=n.brl||50270,i=n.hrl||125140;let a=0;t>r&&(t<=s?a=(t-r)*.2:t<=i?a=(s-r)*.2+(t-s)*.4:a=(s-r)*.2+(i-s)*.4+(t-i)*.45);const l=a/12,c=e-l+(n.isaDraw||0);return{date:n.date,taxYear:n.taxYear,yearNum:n.yearNumber,equity:n.equity,bond:n.bond,cash:n.cash,total:n.equity+n.bond+n.cash,adjEquity:n.adjEquityMin,adjBond:n.adjBondMin,adjCash:n.adjCashTarget,source:n.source,dEquity:n.drawFromEquity||0,dBond:n.drawFromBond||0,dCash:n.drawFromCash||0,sipp:n.sippDraw,stdSipp:n.stdSipp||n.sippDraw,isa:n.isaDraw,other:n.other,state:n.statePension,pa:r,brl:s,monthlyTax:l,monthlyNet:c,mode:n.taxEfficient?"Tax-Efficient":"Standard",inProtection:n.inProtection,reason:n.protectionReason||"",consecutiveDraws:n.consecutiveCashDraws||0,boostAmount:n.boostAmount,boostEligible:n.boostEligible||!1,rebal:n.rebalanceActions?n.rebalanceActions.join("; "):"",yearlyIsaSavingsAllocation:n.yearlyIsaSavingsAllocation||0,isaSavingsUsedThisMonth:n.isaDraw||0,cumulativeIsaSavingsUsed:n.cumulativeIsaSavingsUsed||0,taxPaidMonthly:l,taxPaidYTD:n.taxPaidYTD||l,taxProjectedAnnual:n.taxProjectedAnnual||a,taxSavedMonthly:n.taxSavedMonthly||0,taxSavedYTD:n.taxSavedYTD||0,taxSavedProjectedAnnual:n.taxSavedProjectedAnnual||0,isTaxEfficientYear:n.isTaxEfficientYear??!0,protectionInducedTaxEfficiency:n.protectionInducedTaxEfficiency||!1,remainingMonths:n.remainingMonths||12}}const Li={INFO:"info",WARNING:"warning",DANGER:"danger",SUCCESS:"success"},Pd="6.0.0",Xe={PERSONAL_ALLOWANCE:12570,BASIC_RATE_LIMIT:50270,HIGHER_RATE_LIMIT:125140,BASIC_RATE:.2,HIGHER_RATE:.4,ADDITIONAL_RATE:.45,PA_TAPER_THRESHOLD:1e5,PA_TAPER_RATE:.5},Cd={ASSUMED_CPI:.025,OTHER_INCOME_CAP:.04},ce={BASE_SALARY:3e4,EQUITY_MIN:25e4,BOND_MIN:2e5,CASH_TARGET:5e4,DURATION_YEARS:35,PROTECTION_FACTOR:20,RECOVERY_BUFFER:15e3,CONSECUTIVE_LIMIT:3},Mr={PROTECTION_MULTIPLIER:.8,HODL_ENABLED:!1,HODL_VALUE:25e3},zs={1928:.4781,1929:-.172,1930:-.338,1931:-.527,1932:-.231,1933:.669,1934:.041,1935:.3879,1936:.2492,1937:-.3839,1938:.2846,1939:-.0278,1940:-.1278,1941:-.1552,1942:.0782,1943:.1382,1944:.1226,1945:.2665,1946:-.0818,1947:.0225,1948:-.0246,1949:.1279,1950:.1787,1951:.1463,1952:.0837,1953:-.0377,1954:.4399,1955:.2084,1956:.0262,1957:-.1278,1958:.3396,1959:.1612,1960:-.0912,1961:.1889,1962:-.1081,1963:.1715,1964:.1478,1965:.1058,1966:-.1858,1967:.1506,1968:.0457,1969:-.1524,1970:.0482,1971:.0627,1972:.1476,1973:-.1652,1974:-.2777,1975:.3815,1976:.1774,1977:-.1271,1978:-.0303,1979:.0414,1980:.1493,1981:-.0909,1982:.1976,1983:.2027,1984:-.0365,1985:.2778,1986:.2278,1987:.0227,1988:.1185,1989:.2697,1990:-.0456,1991:.2013,1992:.044,1993:.1372,1994:.0218,1995:.3345,1996:.2601,1997:.2264,1998:.1627,1999:.2516,2e3:-.0617,2001:-.0727,2002:-.1679,2003:.2525,2004:.0333,2005:-.0061,2006:.1618,2007:.0648,2008:-.3355,2009:.1882,2010:.1102,2011:.0556,2012:.0728,2013:.2665,2014:.0775,2015:-.023,2016:.1342,2017:.2511,2018:-.0583,2019:.2234,2020:.0726,2021:.1873,2022:-.0878,2023:.1399,2024:.1299},tl={1928:-.012,1929:.002,1930:-.06,1931:-.094,1932:-.103,1933:.005,1934:.021,1935:.03,1936:.014,1937:.028,1938:-.02,1939:-.014,1940:.01,1941:.099,1942:.09,1943:.03,1944:.023,1945:.023,1946:.186,1947:.087,1948:.03,1949:-.02,1950:.059,1951:.06,1952:.009,1953:.006,1954:-.007,1955:.004,1956:.03,1957:.028,1958:.017,1959:.015,1960:.014,1961:.007,1962:.013,1963:.017,1964:.01,1965:.019,1966:.034,1967:.028,1968:.046,1969:.062,1970:.055,1971:.033,1972:.034,1973:.087,1974:.124,1975:.069,1976:.048,1977:.067,1978:.09,1979:.133,1980:.125,1981:.089,1982:.038,1983:.038,1984:.04,1985:.038,1986:.011,1987:.044,1988:.044,1989:.046,1990:.061,1991:.03,1992:.029,1993:.027,1994:.026,1995:.025,1996:.034,1997:.017,1998:.016,1999:.027,2e3:.034,2001:.016,2002:.024,2003:.019,2004:.033,2005:.034,2006:.025,2007:.041,2008:.001,2009:.027,2010:.015,2011:.03,2012:.017,2013:.015,2014:.008,2015:.007,2016:.021,2017:.021,2018:.019,2019:.023,2020:.012,2021:.07,2022:.065,2023:.032,2024:.029},Gp={GREAT_DEPRESSION:{name:"Great Depression",equity:[-.17,-.34,-.53,-.23,.67,.04,.39,.25,-.38,.28],inflation:[0,-.06,-.09,-.1,.01,.02,.03,.01,.03,-.02],color:"#e74c3c"},STAGFLATION_70S:{name:"Stagflation 70s",equity:[-.17,-.28,.38,.18,-.13,-.03,.04,.15,-.09,.2],inflation:[.09,.12,.07,.05,.07,.09,.13,.13,.09,.04],color:"#e67e22"},LOST_DECADE_2000S:{name:"Lost Decade 2000s",equity:[-.06,-.07,-.17,.25,.03,-.01,.16,.06,-.34,.19],inflation:[.03,.02,.02,.02,.03,.03,.03,.04,0,.03],color:"#9b59b6"},CRISIS_2008:{name:"2008 Crisis",equity:[-.34,.19,.11,.06,.07,.27,.08,-.02,.13,.25],inflation:[0,.03,.02,.03,.02,.02,.01,.01,.02,.02],color:"#3498db"},SYNTHETIC_WORST:{name:"Synthetic Worst",equity:[-.4,.1,.1,.1,-.35,.1,.1,.1,.1,-.3],inflation:[.08,.05,.05,.05,.08,.05,.05,.05,.05,.08],color:"#1abc9c"}},Rt={START_MONTH:4,START_DAY:6};function Kp(n,e,t,r=Xe.HIGHER_RATE_LIMIT){if(n<=0)return 0;let s=e;if(n>Xe.PA_TAPER_THRESHOLD){const f=(n-Xe.PA_TAPER_THRESHOLD)*Xe.PA_TAPER_RATE;s=Math.max(0,e-f)}const i=Math.max(0,n-s),a=Math.max(0,t-s),l=r-t;let c=0;const d=Math.min(i,a);if(c+=d*Xe.BASIC_RATE,i>a){const f=Math.min(i-a,l);c+=f*Xe.HIGHER_RATE}if(i>a+l){const f=i-a-l;c+=f*Xe.ADDITIONAL_RATE}return c}function nl(n){const e=typeof n=="string"?new Date(n):n,t=e.getFullYear(),r=e.getMonth()+1,s=e.getDate();if(r<Rt.START_MONTH||r===Rt.START_MONTH&&s<Rt.START_DAY){const i=t-1;return`${String(i).slice(-2)}/${String(t).slice(-2)}`}return`${String(t).slice(-2)}/${String(t+1).slice(-2)}`}function Qp(n){const e=parseInt(n.split("/")[0]),t=e<50?2e3+e:1900+e;return new Date(t,Rt.START_MONTH-1,Rt.START_DAY)}function Jp(n){const e=parseInt(n.split("/")[1]),t=e<50?2e3+e:1900+e;return new Date(t,Rt.START_MONTH-1,Rt.START_DAY-1)}function Xp(){const n=new Date;return`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`}function kd(n){const[e,t]=n.split("-").map(Number);return new Date(e,t-1,15)}function Zp(n){const t=(typeof n=="string"?new Date(n):n).getMonth()+1;return t>=Rt.START_MONTH?12-(t-Rt.START_MONTH):Rt.START_MONTH-t}function em(n){const{baseSalary:e,cumulativeInflation:t,yearlyInflation:r=[],other:s=0,statePension:i=0,statePensionYear:a=12,yearNumber:l=0,pa:c,brl:d,hrl:f,taxMode:m="inflates"}=n,v=m==="frozen"?c:c*t,E=m==="frozen"?d:d*t,T=m==="frozen"?f:f*t,x=e*t,R=tm(s,r),A=l>=a?i*t:0,D=R+A,C=Math.max(0,E-D),O=Math.max(0,x-D),V=Math.min(C,O);return{pa:v,brl:E,hrl:T,targetGross:x,other:R,statePension:A,fixedIncome:D,annualSippDraw:V,monthlySippDraw:V/12,sippPlusfixedAtBRL:C+D===E}}function tm(n,e,t=Cd.OTHER_INCOME_CAP){let r=n;for(const s of e)r*=1+Math.min(s,t);return r}function nm(n,e,t=.025){const r=[],s=[];for(let i=0;i<=e;i++){i>0&&s.push(t);const a=Math.pow(1+t,i),l=em({baseSalary:n.baseSalary,cumulativeInflation:a,yearlyInflation:[...s],other:n.other,statePension:n.statePension,statePensionYear:n.statePensionYear,yearNumber:i,pa:n.pa,brl:n.brl,hrl:n.hrl,taxMode:n.taxMode}),c=l.annualSippDraw+l.other+l.statePension,d=Kp(c,l.pa,l.brl,l.hrl);r.push({year:i,brl:l.brl,other:l.other,statePension:l.statePension,sippDraw:l.annualSippDraw,totalTaxable:c,tax:d,netIncome:c-d})}return r}function Nr(n,e,t,r,s){if(s){const i=Math.max(0,1-e/t);return n*r*i}return n*r}function rm(n,e,t){const r=Nr(n.equityMin,e,n.duration,t,!0),s=Nr(n.bondMin,e,n.duration,t,!0),i=Nr(n.cashTarget,e,n.duration,t,!1);return{equity:r,bond:s,cash:i,totalGrowth:r+s,total:r+s+i}}function sm(n,e=Cd.ASSUMED_CPI){const t=[];for(let r=0;r<=n.duration;r++){const s=Math.pow(1+e,r),i=rm(n,r,s);t.push({year:r,cumulativeInflation:s,equityMin:i.equity,bondMin:i.bond,cashTarget:i.cash,totalMin:i.total})}return t}const im="modulepreload",om=function(n,e){return new URL(n,e).href},Zc={},eu=function(e,t,r){let s=Promise.resolve();if(t&&t.length>0){const a=document.getElementsByTagName("link"),l=document.querySelector("meta[property=csp-nonce]"),c=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));s=Promise.allSettled(t.map(d=>{if(d=om(d,r),d in Zc)return;Zc[d]=!0;const f=d.endsWith(".css"),m=f?'[rel="stylesheet"]':"";if(!!r)for(let T=a.length-1;T>=0;T--){const x=a[T];if(x.href===d&&(!f||x.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${d}"]${m}`))return;const E=document.createElement("link");if(E.rel=f?"stylesheet":im,f||(E.as="script"),E.crossOrigin="",E.href=d,c&&E.setAttribute("nonce",c),document.head.appendChild(E),f)return new Promise((T,x)=>{E.addEventListener("load",T),E.addEventListener("error",()=>x(new Error(`Unable to preload CSS for ${d}`)))})}))}function i(a){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=a,window.dispatchEvent(l),!l.defaultPrevented)throw a}return s.then(a=>{for(const l of a||[])l.status==="rejected"&&i(l.reason);return e().catch(i)})};function rl(n){let e=n;return function(){return e=Math.sin(e)*1e4,e-Math.floor(e)}}function bs(n,e,t){const r=t(),s=t(),i=Math.sqrt(-2*Math.log(r))*Math.cos(2*Math.PI*s);return n+e*i}function Dd(n){const e=JSON.stringify(n);let t=0;for(let r=0;r<e.length;r++){const s=e.charCodeAt(r);t=(t<<5)-t+s,t=t&t}return t.toString(16)}var tu={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Md=function(n){const e=[];let t=0;for(let r=0;r<n.length;r++){let s=n.charCodeAt(r);s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(s=65536+((s&1023)<<10)+(n.charCodeAt(++r)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},am=function(n){const e=[];let t=0,r=0;for(;t<n.length;){const s=n[t++];if(s<128)e[r++]=String.fromCharCode(s);else if(s>191&&s<224){const i=n[t++];e[r++]=String.fromCharCode((s&31)<<6|i&63)}else if(s>239&&s<365){const i=n[t++],a=n[t++],l=n[t++],c=((s&7)<<18|(i&63)<<12|(a&63)<<6|l&63)-65536;e[r++]=String.fromCharCode(55296+(c>>10)),e[r++]=String.fromCharCode(56320+(c&1023))}else{const i=n[t++],a=n[t++];e[r++]=String.fromCharCode((s&15)<<12|(i&63)<<6|a&63)}}return e.join("")},Nd={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<n.length;s+=3){const i=n[s],a=s+1<n.length,l=a?n[s+1]:0,c=s+2<n.length,d=c?n[s+2]:0,f=i>>2,m=(i&3)<<4|l>>4;let v=(l&15)<<2|d>>6,E=d&63;c||(E=64,a||(v=64)),r.push(t[f],t[m],t[v],t[E])}return r.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(Md(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):am(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let s=0;s<n.length;){const i=t[n.charAt(s++)],l=s<n.length?t[n.charAt(s)]:0;++s;const d=s<n.length?t[n.charAt(s)]:64;++s;const m=s<n.length?t[n.charAt(s)]:64;if(++s,i==null||l==null||d==null||m==null)throw new lm;const v=i<<2|l>>4;if(r.push(v),d!==64){const E=l<<4&240|d>>2;if(r.push(E),m!==64){const T=d<<6&192|m;r.push(T)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class lm extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const cm=function(n){const e=Md(n);return Nd.encodeByteArray(e,!0)},Xi=function(n){return cm(n).replace(/\./g,"")},Ld=function(n){try{return Nd.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function um(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const dm=()=>um().__FIREBASE_DEFAULTS__,hm=()=>{if(typeof process>"u"||typeof tu>"u")return;const n=tu.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},fm=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&Ld(n[1]);return e&&JSON.parse(e)},Eo=()=>{try{return dm()||hm()||fm()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},Od=n=>{var e,t;return(t=(e=Eo())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[n]},pm=n=>{const e=Od(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),r]:[e.substring(0,t),r]},Vd=()=>{var n;return(n=Eo())===null||n===void 0?void 0:n.config},Bd=n=>{var e;return(e=Eo())===null||e===void 0?void 0:e[`_${n}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mm{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,r))}}}/**
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
 */function gm(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},r=e||"demo-project",s=n.iat||0,i=n.sub||n.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const a=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:s,exp:s+3600,auth_time:s,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}}},n);return[Xi(JSON.stringify(t)),Xi(JSON.stringify(a)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tt(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function ym(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(tt())}function vm(){var n;const e=(n=Eo())===null||n===void 0?void 0:n.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function _m(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function wm(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function Em(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function bm(){const n=tt();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function Tm(){return!vm()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Im(){try{return typeof indexedDB=="object"}catch{return!1}}function Sm(){return new Promise((n,e)=>{try{let t=!0;const r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),t||self.indexedDB.deleteDatabase(r),n(!0)},s.onupgradeneeded=()=>{t=!1},s.onerror=()=>{var i;e(((i=s.error)===null||i===void 0?void 0:i.message)||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Am="FirebaseError";class en extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name=Am,Object.setPrototypeOf(this,en.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Zs.prototype.create)}}class Zs{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){const r=t[0]||{},s=`${this.service}/${e}`,i=this.errors[e],a=i?xm(i,r):"Error",l=`${this.serviceName}: ${a} (${s}).`;return new en(s,l,r)}}function xm(n,e){return n.replace(Rm,(t,r)=>{const s=e[r];return s!=null?String(s):`<${r}?>`})}const Rm=/\{\$([^}]+)}/g;function Pm(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function Zi(n,e){if(n===e)return!0;const t=Object.keys(n),r=Object.keys(e);for(const s of t){if(!r.includes(s))return!1;const i=n[s],a=e[s];if(nu(i)&&nu(a)){if(!Zi(i,a))return!1}else if(i!==a)return!1}for(const s of r)if(!t.includes(s))return!1;return!0}function nu(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ei(n){const e=[];for(const[t,r]of Object.entries(n))Array.isArray(r)?r.forEach(s=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function Ss(n){const e={};return n.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[s,i]=r.split("=");e[decodeURIComponent(s)]=decodeURIComponent(i)}}),e}function As(n){const e=n.indexOf("?");if(!e)return"";const t=n.indexOf("#",e);return n.substring(e,t>0?t:void 0)}function Cm(n,e){const t=new km(n,e);return t.subscribe.bind(t)}class km{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,r){let s;if(e===void 0&&t===void 0&&r===void 0)throw new Error("Missing Observer.");Dm(e,["next","error","complete"])?s=e:s={next:e,error:t,complete:r},s.next===void 0&&(s.next=la),s.error===void 0&&(s.error=la),s.complete===void 0&&(s.complete=la);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Dm(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function la(){}/**
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
 */function De(n){return n&&n._delegate?n._delegate:n}class Gn{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const $n="[DEFAULT]";/**
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
 */class Mm{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const r=new mm;if(this.instancesDeferred.set(t,r),this.isInitialized(t)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:t});s&&r.resolve(s)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const r=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),s=(t=e==null?void 0:e.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(i){if(s)return null;throw i}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Lm(e))try{this.getOrInitializeService({instanceIdentifier:$n})}catch{}for(const[t,r]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(t);try{const i=this.getOrInitializeService({instanceIdentifier:s});r.resolve(i)}catch{}}}}clearInstance(e=$n){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=$n){return this.instances.has(e)}getOptions(e=$n){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:r,options:t});for(const[i,a]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(i);r===l&&a.resolve(s)}return s}onInit(e,t){var r;const s=this.normalizeInstanceIdentifier(t),i=(r=this.onInitCallbacks.get(s))!==null&&r!==void 0?r:new Set;i.add(e),this.onInitCallbacks.set(s,i);const a=this.instances.get(s);return a&&e(a,s),()=>{i.delete(e)}}invokeOnInitCallbacks(e,t){const r=this.onInitCallbacks.get(t);if(r)for(const s of r)try{s(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Nm(e),options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=$n){return this.component?this.component.multipleInstances?e:$n:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Nm(n){return n===$n?void 0:n}function Lm(n){return n.instantiationMode==="EAGER"}/**
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
 */class Om{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new Mm(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var te;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(te||(te={}));const Vm={debug:te.DEBUG,verbose:te.VERBOSE,info:te.INFO,warn:te.WARN,error:te.ERROR,silent:te.SILENT},Bm=te.INFO,Fm={[te.DEBUG]:"log",[te.VERBOSE]:"log",[te.INFO]:"info",[te.WARN]:"warn",[te.ERROR]:"error"},zm=(n,e,...t)=>{if(e<n.logLevel)return;const r=new Date().toISOString(),s=Fm[e];if(s)console[s](`[${r}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class sl{constructor(e){this.name=e,this._logLevel=Bm,this._logHandler=zm,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in te))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Vm[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,te.DEBUG,...e),this._logHandler(this,te.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,te.VERBOSE,...e),this._logHandler(this,te.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,te.INFO,...e),this._logHandler(this,te.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,te.WARN,...e),this._logHandler(this,te.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,te.ERROR,...e),this._logHandler(this,te.ERROR,...e)}}const $m=(n,e)=>e.some(t=>n instanceof t);let ru,su;function Um(){return ru||(ru=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function qm(){return su||(su=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Fd=new WeakMap,Ra=new WeakMap,zd=new WeakMap,ca=new WeakMap,il=new WeakMap;function jm(n){const e=new Promise((t,r)=>{const s=()=>{n.removeEventListener("success",i),n.removeEventListener("error",a)},i=()=>{t(yn(n.result)),s()},a=()=>{r(n.error),s()};n.addEventListener("success",i),n.addEventListener("error",a)});return e.then(t=>{t instanceof IDBCursor&&Fd.set(t,n)}).catch(()=>{}),il.set(e,n),e}function Hm(n){if(Ra.has(n))return;const e=new Promise((t,r)=>{const s=()=>{n.removeEventListener("complete",i),n.removeEventListener("error",a),n.removeEventListener("abort",a)},i=()=>{t(),s()},a=()=>{r(n.error||new DOMException("AbortError","AbortError")),s()};n.addEventListener("complete",i),n.addEventListener("error",a),n.addEventListener("abort",a)});Ra.set(n,e)}let Pa={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return Ra.get(n);if(e==="objectStoreNames")return n.objectStoreNames||zd.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return yn(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function Wm(n){Pa=n(Pa)}function Ym(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const r=n.call(ua(this),e,...t);return zd.set(r,e.sort?e.sort():[e]),yn(r)}:qm().includes(n)?function(...e){return n.apply(ua(this),e),yn(Fd.get(this))}:function(...e){return yn(n.apply(ua(this),e))}}function Gm(n){return typeof n=="function"?Ym(n):(n instanceof IDBTransaction&&Hm(n),$m(n,Um())?new Proxy(n,Pa):n)}function yn(n){if(n instanceof IDBRequest)return jm(n);if(ca.has(n))return ca.get(n);const e=Gm(n);return e!==n&&(ca.set(n,e),il.set(e,n)),e}const ua=n=>il.get(n);function Km(n,e,{blocked:t,upgrade:r,blocking:s,terminated:i}={}){const a=indexedDB.open(n,e),l=yn(a);return r&&a.addEventListener("upgradeneeded",c=>{r(yn(a.result),c.oldVersion,c.newVersion,yn(a.transaction),c)}),t&&a.addEventListener("blocked",c=>t(c.oldVersion,c.newVersion,c)),l.then(c=>{i&&c.addEventListener("close",()=>i()),s&&c.addEventListener("versionchange",d=>s(d.oldVersion,d.newVersion,d))}).catch(()=>{}),l}const Qm=["get","getKey","getAll","getAllKeys","count"],Jm=["put","add","delete","clear"],da=new Map;function iu(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(da.get(e))return da.get(e);const t=e.replace(/FromIndex$/,""),r=e!==t,s=Jm.includes(t);if(!(t in(r?IDBIndex:IDBObjectStore).prototype)||!(s||Qm.includes(t)))return;const i=async function(a,...l){const c=this.transaction(a,s?"readwrite":"readonly");let d=c.store;return r&&(d=d.index(l.shift())),(await Promise.all([d[t](...l),s&&c.done]))[0]};return da.set(e,i),i}Wm(n=>({...n,get:(e,t,r)=>iu(e,t)||n.get(e,t,r),has:(e,t)=>!!iu(e,t)||n.has(e,t)}));/**
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
 */class Xm{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(Zm(t)){const r=t.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(t=>t).join(" ")}}function Zm(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Ca="@firebase/app",ou="0.10.13";/**
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
 */const Qt=new sl("@firebase/app"),eg="@firebase/app-compat",tg="@firebase/analytics-compat",ng="@firebase/analytics",rg="@firebase/app-check-compat",sg="@firebase/app-check",ig="@firebase/auth",og="@firebase/auth-compat",ag="@firebase/database",lg="@firebase/data-connect",cg="@firebase/database-compat",ug="@firebase/functions",dg="@firebase/functions-compat",hg="@firebase/installations",fg="@firebase/installations-compat",pg="@firebase/messaging",mg="@firebase/messaging-compat",gg="@firebase/performance",yg="@firebase/performance-compat",vg="@firebase/remote-config",_g="@firebase/remote-config-compat",wg="@firebase/storage",Eg="@firebase/storage-compat",bg="@firebase/firestore",Tg="@firebase/vertexai-preview",Ig="@firebase/firestore-compat",Sg="firebase",Ag="10.14.1";/**
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
 */const ka="[DEFAULT]",xg={[Ca]:"fire-core",[eg]:"fire-core-compat",[ng]:"fire-analytics",[tg]:"fire-analytics-compat",[sg]:"fire-app-check",[rg]:"fire-app-check-compat",[ig]:"fire-auth",[og]:"fire-auth-compat",[ag]:"fire-rtdb",[lg]:"fire-data-connect",[cg]:"fire-rtdb-compat",[ug]:"fire-fn",[dg]:"fire-fn-compat",[hg]:"fire-iid",[fg]:"fire-iid-compat",[pg]:"fire-fcm",[mg]:"fire-fcm-compat",[gg]:"fire-perf",[yg]:"fire-perf-compat",[vg]:"fire-rc",[_g]:"fire-rc-compat",[wg]:"fire-gcs",[Eg]:"fire-gcs-compat",[bg]:"fire-fst",[Ig]:"fire-fst-compat",[Tg]:"fire-vertex","fire-js":"fire-js",[Sg]:"fire-js-all"};/**
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
 */const eo=new Map,Rg=new Map,Da=new Map;function au(n,e){try{n.container.addComponent(e)}catch(t){Qt.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function $r(n){const e=n.name;if(Da.has(e))return Qt.debug(`There were multiple attempts to register component ${e}.`),!1;Da.set(e,n);for(const t of eo.values())au(t,n);for(const t of Rg.values())au(t,n);return!0}function ol(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function Et(n){return n.settings!==void 0}/**
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
 */const Pg={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},vn=new Zs("app","Firebase",Pg);/**
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
 */class Cg{constructor(e,t,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new Gn("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw vn.create("app-deleted",{appName:this._name})}}/**
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
 */const Xr=Ag;function $d(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const r=Object.assign({name:ka,automaticDataCollectionEnabled:!1},e),s=r.name;if(typeof s!="string"||!s)throw vn.create("bad-app-name",{appName:String(s)});if(t||(t=Vd()),!t)throw vn.create("no-options");const i=eo.get(s);if(i){if(Zi(t,i.options)&&Zi(r,i.config))return i;throw vn.create("duplicate-app",{appName:s})}const a=new Om(s);for(const c of Da.values())a.addComponent(c);const l=new Cg(t,r,a);return eo.set(s,l),l}function Ud(n=ka){const e=eo.get(n);if(!e&&n===ka&&Vd())return $d();if(!e)throw vn.create("no-app",{appName:n});return e}function _n(n,e,t){var r;let s=(r=xg[n])!==null&&r!==void 0?r:n;t&&(s+=`-${t}`);const i=s.match(/\s|\//),a=e.match(/\s|\//);if(i||a){const l=[`Unable to register library "${s}" with version "${e}":`];i&&l.push(`library name "${s}" contains illegal characters (whitespace or "/")`),i&&a&&l.push("and"),a&&l.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Qt.warn(l.join(" "));return}$r(new Gn(`${s}-version`,()=>({library:s,version:e}),"VERSION"))}/**
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
 */const kg="firebase-heartbeat-database",Dg=1,$s="firebase-heartbeat-store";let ha=null;function qd(){return ha||(ha=Km(kg,Dg,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore($s)}catch(t){console.warn(t)}}}}).catch(n=>{throw vn.create("idb-open",{originalErrorMessage:n.message})})),ha}async function Mg(n){try{const t=(await qd()).transaction($s),r=await t.objectStore($s).get(jd(n));return await t.done,r}catch(e){if(e instanceof en)Qt.warn(e.message);else{const t=vn.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Qt.warn(t.message)}}}async function lu(n,e){try{const r=(await qd()).transaction($s,"readwrite");await r.objectStore($s).put(e,jd(n)),await r.done}catch(t){if(t instanceof en)Qt.warn(t.message);else{const r=vn.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});Qt.warn(r.message)}}}function jd(n){return`${n.name}!${n.options.appId}`}/**
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
 */const Ng=1024,Lg=30*24*60*60*1e3;class Og{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new Bg(t),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,t;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=cu();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(a=>a.date===i)?void 0:(this._heartbeatsCache.heartbeats.push({date:i,agent:s}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(a=>{const l=new Date(a.date).valueOf();return Date.now()-l<=Lg}),this._storage.overwrite(this._heartbeatsCache))}catch(r){Qt.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=cu(),{heartbeatsToSend:r,unsentEntries:s}=Vg(this._heartbeatsCache.heartbeats),i=Xi(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=t,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(t){return Qt.warn(t),""}}}function cu(){return new Date().toISOString().substring(0,10)}function Vg(n,e=Ng){const t=[];let r=n.slice();for(const s of n){const i=t.find(a=>a.agent===s.agent);if(i){if(i.dates.push(s.date),uu(t)>e){i.dates.pop();break}}else if(t.push({agent:s.agent,dates:[s.date]}),uu(t)>e){t.pop();break}r=r.slice(1)}return{heartbeatsToSend:t,unsentEntries:r}}class Bg{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Im()?Sm().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await Mg(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const s=await this.read();return lu(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:s.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const s=await this.read();return lu(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...e.heartbeats]})}else return}}function uu(n){return Xi(JSON.stringify({version:2,heartbeats:n})).length}/**
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
 */function Fg(n){$r(new Gn("platform-logger",e=>new Xm(e),"PRIVATE")),$r(new Gn("heartbeat",e=>new Og(e),"PRIVATE")),_n(Ca,ou,n),_n(Ca,ou,"esm2017"),_n("fire-js","")}Fg("");var zg="firebase",$g="10.14.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */_n(zg,$g,"app");function al(n,e){var t={};for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&e.indexOf(r)<0&&(t[r]=n[r]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var s=0,r=Object.getOwnPropertySymbols(n);s<r.length;s++)e.indexOf(r[s])<0&&Object.prototype.propertyIsEnumerable.call(n,r[s])&&(t[r[s]]=n[r[s]]);return t}function Hd(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Ug=Hd,Wd=new Zs("auth","Firebase",Hd());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const to=new sl("@firebase/auth");function qg(n,...e){to.logLevel<=te.WARN&&to.warn(`Auth (${Xr}): ${n}`,...e)}function $i(n,...e){to.logLevel<=te.ERROR&&to.error(`Auth (${Xr}): ${n}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yt(n,...e){throw cl(n,...e)}function bt(n,...e){return cl(n,...e)}function ll(n,e,t){const r=Object.assign(Object.assign({},Ug()),{[e]:t});return new Zs("auth","Firebase",r).create(e,{appName:n.name})}function Gt(n){return ll(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function jg(n,e,t){const r=t;if(!(e instanceof r))throw r.name!==e.constructor.name&&yt(n,"argument-error"),ll(n,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function cl(n,...e){if(typeof n!="string"){const t=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=n.name),n._errorFactory.create(t,...r)}return Wd.create(n,...e)}function W(n,e,...t){if(!n)throw cl(e,...t)}function Ht(n){const e="INTERNAL ASSERTION FAILED: "+n;throw $i(e),new Error(e)}function Jt(n,e){n||Ht(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ma(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.href)||""}function Hg(){return du()==="http:"||du()==="https:"}function du(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wg(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Hg()||wm()||"connection"in navigator)?navigator.onLine:!0}function Yg(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ti{constructor(e,t){this.shortDelay=e,this.longDelay=t,Jt(t>e,"Short delay should be less than long delay!"),this.isMobile=ym()||Em()}get(){return Wg()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ul(n,e){Jt(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yd{static initialize(e,t,r){this.fetchImpl=e,t&&(this.headersImpl=t),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Ht("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Ht("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Ht("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gg={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kg=new ti(3e4,6e4);function tn(n,e){return n.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:n.tenantId}):e}async function Bt(n,e,t,r,s={}){return Gd(n,s,async()=>{let i={},a={};r&&(e==="GET"?a=r:i={body:JSON.stringify(r)});const l=ei(Object.assign({key:n.config.apiKey},a)).slice(1),c=await n._getAdditionalHeaders();c["Content-Type"]="application/json",n.languageCode&&(c["X-Firebase-Locale"]=n.languageCode);const d=Object.assign({method:e,headers:c},i);return _m()||(d.referrerPolicy="no-referrer"),Yd.fetch()(Kd(n,n.config.apiHost,t,l),d)})}async function Gd(n,e,t){n._canInitEmulator=!1;const r=Object.assign(Object.assign({},Gg),e);try{const s=new Jg(n),i=await Promise.race([t(),s.promise]);s.clearNetworkTimeout();const a=await i.json();if("needConfirmation"in a)throw Oi(n,"account-exists-with-different-credential",a);if(i.ok&&!("errorMessage"in a))return a;{const l=i.ok?a.errorMessage:a.error.message,[c,d]=l.split(" : ");if(c==="FEDERATED_USER_ID_ALREADY_LINKED")throw Oi(n,"credential-already-in-use",a);if(c==="EMAIL_EXISTS")throw Oi(n,"email-already-in-use",a);if(c==="USER_DISABLED")throw Oi(n,"user-disabled",a);const f=r[c]||c.toLowerCase().replace(/[_\s]+/g,"-");if(d)throw ll(n,f,d);yt(n,f)}}catch(s){if(s instanceof en)throw s;yt(n,"network-request-failed",{message:String(s)})}}async function ni(n,e,t,r,s={}){const i=await Bt(n,e,t,r,s);return"mfaPendingCredential"in i&&yt(n,"multi-factor-auth-required",{_serverResponse:i}),i}function Kd(n,e,t,r){const s=`${e}${t}?${r}`;return n.config.emulator?ul(n.config,s):`${n.config.apiScheme}://${s}`}function Qg(n){switch(n){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class Jg{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,r)=>{this.timer=setTimeout(()=>r(bt(this.auth,"network-request-failed")),Kg.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function Oi(n,e,t){const r={appName:n.name};t.email&&(r.email=t.email),t.phoneNumber&&(r.phoneNumber=t.phoneNumber);const s=bt(n,e,r);return s.customData._tokenResponse=t,s}function hu(n){return n!==void 0&&n.enterprise!==void 0}class Xg{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return Qg(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}}async function Zg(n,e){return Bt(n,"GET","/v2/recaptchaConfig",tn(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ey(n,e){return Bt(n,"POST","/v1/accounts:delete",e)}async function Qd(n,e){return Bt(n,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ks(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function ty(n,e=!1){const t=De(n),r=await t.getIdToken(e),s=dl(r);W(s&&s.exp&&s.auth_time&&s.iat,t.auth,"internal-error");const i=typeof s.firebase=="object"?s.firebase:void 0,a=i==null?void 0:i.sign_in_provider;return{claims:s,token:r,authTime:ks(fa(s.auth_time)),issuedAtTime:ks(fa(s.iat)),expirationTime:ks(fa(s.exp)),signInProvider:a||null,signInSecondFactor:(i==null?void 0:i.sign_in_second_factor)||null}}function fa(n){return Number(n)*1e3}function dl(n){const[e,t,r]=n.split(".");if(e===void 0||t===void 0||r===void 0)return $i("JWT malformed, contained fewer than 3 sections"),null;try{const s=Ld(t);return s?JSON.parse(s):($i("Failed to decode base64 JWT payload"),null)}catch(s){return $i("Caught error parsing JWT payload as JSON",s==null?void 0:s.toString()),null}}function fu(n){const e=dl(n);return W(e,"internal-error"),W(typeof e.exp<"u","internal-error"),W(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ur(n,e,t=!1){if(t)return e;try{return await e}catch(r){throw r instanceof en&&ny(r)&&n.auth.currentUser===n&&await n.auth.signOut(),r}}function ny({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ry{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const r=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),r}else{this.errorBackoff=3e4;const s=((t=this.user.stsTokenManager.expirationTime)!==null&&t!==void 0?t:0)-Date.now()-3e5;return Math.max(0,s)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Na{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=ks(this.lastLoginAt),this.creationTime=ks(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function no(n){var e;const t=n.auth,r=await n.getIdToken(),s=await Ur(n,Qd(t,{idToken:r}));W(s==null?void 0:s.users.length,t,"internal-error");const i=s.users[0];n._notifyReloadListener(i);const a=!((e=i.providerUserInfo)===null||e===void 0)&&e.length?Jd(i.providerUserInfo):[],l=iy(n.providerData,a),c=n.isAnonymous,d=!(n.email&&i.passwordHash)&&!(l!=null&&l.length),f=c?d:!1,m={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:l,metadata:new Na(i.createdAt,i.lastLoginAt),isAnonymous:f};Object.assign(n,m)}async function sy(n){const e=De(n);await no(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function iy(n,e){return[...n.filter(r=>!e.some(s=>s.providerId===r.providerId)),...e]}function Jd(n){return n.map(e=>{var{providerId:t}=e,r=al(e,["providerId"]);return{providerId:t,uid:r.rawId||"",displayName:r.displayName||null,email:r.email||null,phoneNumber:r.phoneNumber||null,photoURL:r.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function oy(n,e){const t=await Gd(n,{},async()=>{const r=ei({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:i}=n.config,a=Kd(n,s,"/v1/token",`key=${i}`),l=await n._getAdditionalHeaders();return l["Content-Type"]="application/x-www-form-urlencoded",Yd.fetch()(a,{method:"POST",headers:l,body:r})});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function ay(n,e){return Bt(n,"POST","/v2/accounts:revokeToken",tn(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lr{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){W(e.idToken,"internal-error"),W(typeof e.idToken<"u","internal-error"),W(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):fu(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){W(e.length!==0,"internal-error");const t=fu(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(W(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:r,refreshToken:s,expiresIn:i}=await oy(e,t);this.updateTokensAndExpiration(r,s,Number(i))}updateTokensAndExpiration(e,t,r){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,t){const{refreshToken:r,accessToken:s,expirationTime:i}=t,a=new Lr;return r&&(W(typeof r=="string","internal-error",{appName:e}),a.refreshToken=r),s&&(W(typeof s=="string","internal-error",{appName:e}),a.accessToken=s),i&&(W(typeof i=="number","internal-error",{appName:e}),a.expirationTime=i),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Lr,this.toJSON())}_performRefresh(){return Ht("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cn(n,e){W(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class Wt{constructor(e){var{uid:t,auth:r,stsTokenManager:s}=e,i=al(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new ry(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=r,this.stsTokenManager=s,this.accessToken=s.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new Na(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const t=await Ur(this,this.stsTokenManager.getToken(this.auth,e));return W(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return ty(this,e)}reload(){return sy(this)}_assign(e){this!==e&&(W(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new Wt(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){W(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),t&&await no(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Et(this.auth.app))return Promise.reject(Gt(this.auth));const e=await this.getIdToken();return await Ur(this,ey(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var r,s,i,a,l,c,d,f;const m=(r=t.displayName)!==null&&r!==void 0?r:void 0,v=(s=t.email)!==null&&s!==void 0?s:void 0,E=(i=t.phoneNumber)!==null&&i!==void 0?i:void 0,T=(a=t.photoURL)!==null&&a!==void 0?a:void 0,x=(l=t.tenantId)!==null&&l!==void 0?l:void 0,R=(c=t._redirectEventId)!==null&&c!==void 0?c:void 0,A=(d=t.createdAt)!==null&&d!==void 0?d:void 0,D=(f=t.lastLoginAt)!==null&&f!==void 0?f:void 0,{uid:N,emailVerified:C,isAnonymous:O,providerData:V,stsTokenManager:b}=t;W(N&&b,e,"internal-error");const g=Lr.fromJSON(this.name,b);W(typeof N=="string",e,"internal-error"),cn(m,e.name),cn(v,e.name),W(typeof C=="boolean",e,"internal-error"),W(typeof O=="boolean",e,"internal-error"),cn(E,e.name),cn(T,e.name),cn(x,e.name),cn(R,e.name),cn(A,e.name),cn(D,e.name);const y=new Wt({uid:N,auth:e,email:v,emailVerified:C,displayName:m,isAnonymous:O,photoURL:T,phoneNumber:E,tenantId:x,stsTokenManager:g,createdAt:A,lastLoginAt:D});return V&&Array.isArray(V)&&(y.providerData=V.map(_=>Object.assign({},_))),R&&(y._redirectEventId=R),y}static async _fromIdTokenResponse(e,t,r=!1){const s=new Lr;s.updateFromServerResponse(t);const i=new Wt({uid:t.localId,auth:e,stsTokenManager:s,isAnonymous:r});return await no(i),i}static async _fromGetAccountInfoResponse(e,t,r){const s=t.users[0];W(s.localId!==void 0,"internal-error");const i=s.providerUserInfo!==void 0?Jd(s.providerUserInfo):[],a=!(s.email&&s.passwordHash)&&!(i!=null&&i.length),l=new Lr;l.updateFromIdToken(r);const c=new Wt({uid:s.localId,auth:e,stsTokenManager:l,isAnonymous:a}),d={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:i,metadata:new Na(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!(i!=null&&i.length)};return Object.assign(c,d),c}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pu=new Map;function Yt(n){Jt(n instanceof Function,"Expected a class definition");let e=pu.get(n);return e?(Jt(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,pu.set(n,e),e)}/**
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
 */class Xd{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}Xd.type="NONE";const mu=Xd;/**
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
 */function Ui(n,e,t){return`firebase:${n}:${e}:${t}`}class Or{constructor(e,t,r){this.persistence=e,this.auth=t,this.userKey=r;const{config:s,name:i}=this.auth;this.fullUserKey=Ui(this.userKey,s.apiKey,i),this.fullPersistenceKey=Ui("persistence",s.apiKey,i),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?Wt._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,r="authUser"){if(!t.length)return new Or(Yt(mu),e,r);const s=(await Promise.all(t.map(async d=>{if(await d._isAvailable())return d}))).filter(d=>d);let i=s[0]||Yt(mu);const a=Ui(r,e.config.apiKey,e.name);let l=null;for(const d of t)try{const f=await d._get(a);if(f){const m=Wt._fromJSON(e,f);d!==i&&(l=m),i=d;break}}catch{}const c=s.filter(d=>d._shouldAllowMigration);return!i._shouldAllowMigration||!c.length?new Or(i,e,r):(i=c[0],l&&await i._set(a,l.toJSON()),await Promise.all(t.map(async d=>{if(d!==i)try{await d._remove(a)}catch{}})),new Or(i,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gu(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(nh(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Zd(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(sh(e))return"Blackberry";if(ih(e))return"Webos";if(eh(e))return"Safari";if((e.includes("chrome/")||th(e))&&!e.includes("edge/"))return"Chrome";if(rh(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=n.match(t);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function Zd(n=tt()){return/firefox\//i.test(n)}function eh(n=tt()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function th(n=tt()){return/crios\//i.test(n)}function nh(n=tt()){return/iemobile/i.test(n)}function rh(n=tt()){return/android/i.test(n)}function sh(n=tt()){return/blackberry/i.test(n)}function ih(n=tt()){return/webos/i.test(n)}function hl(n=tt()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function ly(n=tt()){var e;return hl(n)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function cy(){return bm()&&document.documentMode===10}function oh(n=tt()){return hl(n)||rh(n)||ih(n)||sh(n)||/windows phone/i.test(n)||nh(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ah(n,e=[]){let t;switch(n){case"Browser":t=gu(tt());break;case"Worker":t=`${gu(tt())}-${n}`;break;default:t=n}const r=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${Xr}/${r}`}/**
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
 */class uy{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const r=i=>new Promise((a,l)=>{try{const c=e(i);a(c)}catch(c){l(c)}});r.onAbort=t,this.queue.push(r);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const r of this.queue)await r(e),r.onAbort&&t.push(r.onAbort)}catch(r){t.reverse();for(const s of t)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
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
 */async function dy(n,e={}){return Bt(n,"GET","/v2/passwordPolicy",tn(n,e))}/**
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
 */const hy=6;class fy{constructor(e){var t,r,s,i;const a=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(t=a.minPasswordLength)!==null&&t!==void 0?t:hy,a.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=a.maxPasswordLength),a.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=a.containsLowercaseCharacter),a.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=a.containsUppercaseCharacter),a.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=a.containsNumericCharacter),a.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=a.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(s=(r=e.allowedNonAlphanumericCharacters)===null||r===void 0?void 0:r.join(""))!==null&&s!==void 0?s:"",this.forceUpgradeOnSignin=(i=e.forceUpgradeOnSignin)!==null&&i!==void 0?i:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,r,s,i,a,l;const c={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,c),this.validatePasswordCharacterOptions(e,c),c.isValid&&(c.isValid=(t=c.meetsMinPasswordLength)!==null&&t!==void 0?t:!0),c.isValid&&(c.isValid=(r=c.meetsMaxPasswordLength)!==null&&r!==void 0?r:!0),c.isValid&&(c.isValid=(s=c.containsLowercaseLetter)!==null&&s!==void 0?s:!0),c.isValid&&(c.isValid=(i=c.containsUppercaseLetter)!==null&&i!==void 0?i:!0),c.isValid&&(c.isValid=(a=c.containsNumericCharacter)!==null&&a!==void 0?a:!0),c.isValid&&(c.isValid=(l=c.containsNonAlphanumericCharacter)!==null&&l!==void 0?l:!0),c}validatePasswordLengthOptions(e,t){const r=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;r&&(t.meetsMinPasswordLength=e.length>=r),s&&(t.meetsMaxPasswordLength=e.length<=s)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let r;for(let s=0;s<e.length;s++)r=e.charAt(s),this.updatePasswordCharacterOptionsStatuses(t,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,t,r,s,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class py{constructor(e,t,r,s){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=r,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new yu(this),this.idTokenSubscription=new yu(this),this.beforeStateQueue=new uy(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Wd,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=s.sdkClientVersion}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Yt(t)),this._initializationPromise=this.queue(async()=>{var r,s;if(!this._deleted&&(this.persistenceManager=await Or.create(this,e),!this._deleted)){if(!((r=this._popupRedirectResolver)===null||r===void 0)&&r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((s=this.currentUser)===null||s===void 0?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await Qd(this,{idToken:e}),r=await Wt._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(r)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(Et(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(l=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(l,l))}):this.directlySetCurrentUser(null)}const r=await this.assertedPersistence.getCurrentUser();let s=r,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,l=s==null?void 0:s._redirectEventId,c=await this.tryRedirectSignIn(e);(!a||a===l)&&(c!=null&&c.user)&&(s=c.user,i=!0)}if(!s)return this.directlySetCurrentUser(null);if(!s._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(s)}catch(a){s=r,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return s?this.reloadAndSetCurrentUserOrClear(s):this.directlySetCurrentUser(null)}return W(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===s._redirectEventId?this.directlySetCurrentUser(s):this.reloadAndSetCurrentUserOrClear(s)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await no(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=Yg()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Et(this.app))return Promise.reject(Gt(this));const t=e?De(e):null;return t&&W(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&W(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Et(this.app)?Promise.reject(Gt(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Et(this.app)?Promise.reject(Gt(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Yt(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await dy(this),t=new fy(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new Zs("auth","Firebase",e())}onAuthStateChanged(e,t,r){return this.registerStateListener(this.authStateSubscription,e,t,r)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,r){return this.registerStateListener(this.idTokenSubscription,e,t,r)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(r.tenantId=this.tenantId),await ay(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){const r=await this.getOrInitRedirectPersistenceManager(t);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&Yt(e)||this._popupRedirectResolver;W(t,this,"argument-error"),this.redirectPersistenceManager=await Or.create(this,[Yt(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,r;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((r=this.redirectUser)===null||r===void 0?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const r=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==r&&(this.lastNotifiedUid=r,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,r,s){if(this._deleted)return()=>{};const i=typeof t=="function"?t:t.next.bind(t);let a=!1;const l=this._isInitialized?Promise.resolve():this._initializationPromise;if(W(l,this,"internal-error"),l.then(()=>{a||i(this.currentUser)}),typeof t=="function"){const c=e.addObserver(t,r,s);return()=>{a=!0,c()}}else{const c=e.addObserver(t);return()=>{a=!0,c()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return W(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=ah(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const r=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());r&&(t["X-Firebase-Client"]=r);const s=await this._getAppCheckToken();return s&&(t["X-Firebase-AppCheck"]=s),t}async _getAppCheckToken(){var e;const t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t!=null&&t.error&&qg(`Error while retrieving App Check token: ${t.error}`),t==null?void 0:t.token}}function nn(n){return De(n)}class yu{constructor(e){this.auth=e,this.observer=null,this.addObserver=Cm(t=>this.observer=t)}get next(){return W(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let bo={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function my(n){bo=n}function lh(n){return bo.loadJS(n)}function gy(){return bo.recaptchaEnterpriseScript}function yy(){return bo.gapiScript}function vy(n){return`__${n}${Math.floor(Math.random()*1e6)}`}const _y="recaptcha-enterprise",wy="NO_RECAPTCHA";class Ey{constructor(e){this.type=_y,this.auth=nn(e)}async verify(e="verify",t=!1){async function r(i){if(!t){if(i.tenantId==null&&i._agentRecaptchaConfig!=null)return i._agentRecaptchaConfig.siteKey;if(i.tenantId!=null&&i._tenantRecaptchaConfigs[i.tenantId]!==void 0)return i._tenantRecaptchaConfigs[i.tenantId].siteKey}return new Promise(async(a,l)=>{Zg(i,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(c=>{if(c.recaptchaKey===void 0)l(new Error("recaptcha Enterprise site key undefined"));else{const d=new Xg(c);return i.tenantId==null?i._agentRecaptchaConfig=d:i._tenantRecaptchaConfigs[i.tenantId]=d,a(d.siteKey)}}).catch(c=>{l(c)})})}function s(i,a,l){const c=window.grecaptcha;hu(c)?c.enterprise.ready(()=>{c.enterprise.execute(i,{action:e}).then(d=>{a(d)}).catch(()=>{a(wy)})}):l(Error("No reCAPTCHA enterprise script loaded."))}return new Promise((i,a)=>{r(this.auth).then(l=>{if(!t&&hu(window.grecaptcha))s(l,i,a);else{if(typeof window>"u"){a(new Error("RecaptchaVerifier is only supported in browser"));return}let c=gy();c.length!==0&&(c+=l),lh(c).then(()=>{s(l,i,a)}).catch(d=>{a(d)})}}).catch(l=>{a(l)})})}}async function vu(n,e,t,r=!1){const s=new Ey(n);let i;try{i=await s.verify(t)}catch{i=await s.verify(t,!0)}const a=Object.assign({},e);return r?Object.assign(a,{captchaResp:i}):Object.assign(a,{captchaResponse:i}),Object.assign(a,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(a,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),a}async function ro(n,e,t,r){var s;if(!((s=n._getRecaptchaConfig())===null||s===void 0)&&s.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const i=await vu(n,e,t,t==="getOobCode");return r(n,i)}else return r(n,e).catch(async i=>{if(i.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const a=await vu(n,e,t,t==="getOobCode");return r(n,a)}else return Promise.reject(i)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function by(n,e){const t=ol(n,"auth");if(t.isInitialized()){const s=t.getImmediate(),i=t.getOptions();if(Zi(i,e??{}))return s;yt(s,"already-initialized")}return t.initialize({options:e})}function Ty(n,e){const t=(e==null?void 0:e.persistence)||[],r=(Array.isArray(t)?t:[t]).map(Yt);e!=null&&e.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function Iy(n,e,t){const r=nn(n);W(r._canInitEmulator,r,"emulator-config-failed"),W(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const s=!1,i=ch(e),{host:a,port:l}=Sy(e),c=l===null?"":`:${l}`;r.config.emulator={url:`${i}//${a}${c}/`},r.settings.appVerificationDisabledForTesting=!0,r.emulatorConfig=Object.freeze({host:a,port:l,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:s})}),Ay()}function ch(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function Sy(n){const e=ch(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const r=t[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(r);if(s){const i=s[1];return{host:i,port:_u(r.substr(i.length+1))}}else{const[i,a]=r.split(":");return{host:i,port:_u(a)}}}function _u(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function Ay(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fl{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Ht("not implemented")}_getIdTokenResponse(e){return Ht("not implemented")}_linkToIdToken(e,t){return Ht("not implemented")}_getReauthenticationResolver(e){return Ht("not implemented")}}async function xy(n,e){return Bt(n,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ry(n,e){return ni(n,"POST","/v1/accounts:signInWithPassword",tn(n,e))}async function Py(n,e){return Bt(n,"POST","/v1/accounts:sendOobCode",tn(n,e))}async function Cy(n,e){return Py(n,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ky(n,e){return ni(n,"POST","/v1/accounts:signInWithEmailLink",tn(n,e))}async function Dy(n,e){return ni(n,"POST","/v1/accounts:signInWithEmailLink",tn(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Us extends fl{constructor(e,t,r,s=null){super("password",r),this._email=e,this._password=t,this._tenantId=s}static _fromEmailAndPassword(e,t){return new Us(e,t,"password")}static _fromEmailAndCode(e,t,r=null){return new Us(e,t,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;if(t!=null&&t.email&&(t!=null&&t.password)){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return ro(e,t,"signInWithPassword",Ry);case"emailLink":return ky(e,{email:this._email,oobCode:this._password});default:yt(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":const r={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return ro(e,r,"signUpPassword",xy);case"emailLink":return Dy(e,{idToken:t,email:this._email,oobCode:this._password});default:yt(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Vr(n,e){return ni(n,"POST","/v1/accounts:signInWithIdp",tn(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const My="http://localhost";class Kn extends fl{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new Kn(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):yt("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:s}=t,i=al(t,["providerId","signInMethod"]);if(!r||!s)return null;const a=new Kn(r,s);return a.idToken=i.idToken||void 0,a.accessToken=i.accessToken||void 0,a.secret=i.secret,a.nonce=i.nonce,a.pendingToken=i.pendingToken||null,a}_getIdTokenResponse(e){const t=this.buildRequest();return Vr(e,t)}_linkToIdToken(e,t){const r=this.buildRequest();return r.idToken=t,Vr(e,r)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,Vr(e,t)}buildRequest(){const e={requestUri:My,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=ei(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ny(n){switch(n){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function Ly(n){const e=Ss(As(n)).link,t=e?Ss(As(e)).deep_link_id:null,r=Ss(As(n)).deep_link_id;return(r?Ss(As(r)).link:null)||r||t||e||n}class pl{constructor(e){var t,r,s,i,a,l;const c=Ss(As(e)),d=(t=c.apiKey)!==null&&t!==void 0?t:null,f=(r=c.oobCode)!==null&&r!==void 0?r:null,m=Ny((s=c.mode)!==null&&s!==void 0?s:null);W(d&&f&&m,"argument-error"),this.apiKey=d,this.operation=m,this.code=f,this.continueUrl=(i=c.continueUrl)!==null&&i!==void 0?i:null,this.languageCode=(a=c.languageCode)!==null&&a!==void 0?a:null,this.tenantId=(l=c.tenantId)!==null&&l!==void 0?l:null}static parseLink(e){const t=Ly(e);try{return new pl(t)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zr{constructor(){this.providerId=Zr.PROVIDER_ID}static credential(e,t){return Us._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const r=pl.parseLink(t);return W(r,"argument-error"),Us._fromEmailAndCode(e,r.code,r.tenantId)}}Zr.PROVIDER_ID="password";Zr.EMAIL_PASSWORD_SIGN_IN_METHOD="password";Zr.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ml{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
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
 */class ri extends ml{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dn extends ri{constructor(){super("facebook.com")}static credential(e){return Kn._fromParams({providerId:dn.PROVIDER_ID,signInMethod:dn.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return dn.credentialFromTaggedObject(e)}static credentialFromError(e){return dn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return dn.credential(e.oauthAccessToken)}catch{return null}}}dn.FACEBOOK_SIGN_IN_METHOD="facebook.com";dn.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jt extends ri{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return Kn._fromParams({providerId:jt.PROVIDER_ID,signInMethod:jt.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return jt.credentialFromTaggedObject(e)}static credentialFromError(e){return jt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:r}=e;if(!t&&!r)return null;try{return jt.credential(t,r)}catch{return null}}}jt.GOOGLE_SIGN_IN_METHOD="google.com";jt.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hn extends ri{constructor(){super("github.com")}static credential(e){return Kn._fromParams({providerId:hn.PROVIDER_ID,signInMethod:hn.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return hn.credentialFromTaggedObject(e)}static credentialFromError(e){return hn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return hn.credential(e.oauthAccessToken)}catch{return null}}}hn.GITHUB_SIGN_IN_METHOD="github.com";hn.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fn extends ri{constructor(){super("twitter.com")}static credential(e,t){return Kn._fromParams({providerId:fn.PROVIDER_ID,signInMethod:fn.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return fn.credentialFromTaggedObject(e)}static credentialFromError(e){return fn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:r}=e;if(!t||!r)return null;try{return fn.credential(t,r)}catch{return null}}}fn.TWITTER_SIGN_IN_METHOD="twitter.com";fn.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Oy(n,e){return ni(n,"POST","/v1/accounts:signUp",tn(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qn{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,r,s=!1){const i=await Wt._fromIdTokenResponse(e,r,s),a=wu(r);return new Qn({user:i,providerId:a,_tokenResponse:r,operationType:t})}static async _forOperation(e,t,r){await e._updateTokensIfNecessary(r,!0);const s=wu(r);return new Qn({user:e,providerId:s,_tokenResponse:r,operationType:t})}}function wu(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class so extends en{constructor(e,t,r,s){var i;super(t.code,t.message),this.operationType=r,this.user=s,Object.setPrototypeOf(this,so.prototype),this.customData={appName:e.name,tenantId:(i=e.tenantId)!==null&&i!==void 0?i:void 0,_serverResponse:t.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,t,r,s){return new so(e,t,r,s)}}function uh(n,e,t,r){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(i=>{throw i.code==="auth/multi-factor-auth-required"?so._fromErrorAndOperation(n,i,e,r):i})}async function Vy(n,e,t=!1){const r=await Ur(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return Qn._forOperation(n,"link",r)}/**
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
 */async function By(n,e,t=!1){const{auth:r}=n;if(Et(r.app))return Promise.reject(Gt(r));const s="reauthenticate";try{const i=await Ur(n,uh(r,s,e,n),t);W(i.idToken,r,"internal-error");const a=dl(i.idToken);W(a,r,"internal-error");const{sub:l}=a;return W(n.uid===l,r,"user-mismatch"),Qn._forOperation(n,s,i)}catch(i){throw(i==null?void 0:i.code)==="auth/user-not-found"&&yt(r,"user-mismatch"),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function dh(n,e,t=!1){if(Et(n.app))return Promise.reject(Gt(n));const r="signIn",s=await uh(n,r,e),i=await Qn._fromIdTokenResponse(n,r,s);return t||await n._updateCurrentUser(i.user),i}async function Fy(n,e){return dh(nn(n),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function hh(n){const e=nn(n);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function zy(n,e,t){const r=nn(n);await ro(r,{requestType:"PASSWORD_RESET",email:e,clientType:"CLIENT_TYPE_WEB"},"getOobCode",Cy)}async function $y(n,e,t){if(Et(n.app))return Promise.reject(Gt(n));const r=nn(n),a=await ro(r,{returnSecureToken:!0,email:e,password:t,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",Oy).catch(c=>{throw c.code==="auth/password-does-not-meet-requirements"&&hh(n),c}),l=await Qn._fromIdTokenResponse(r,"signIn",a);return await r._updateCurrentUser(l.user),l}function Uy(n,e,t){return Et(n.app)?Promise.reject(Gt(n)):Fy(De(n),Zr.credential(e,t)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&hh(n),r})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function qy(n,e){return Bt(n,"POST","/v1/accounts:update",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function jy(n,{displayName:e,photoURL:t}){if(e===void 0&&t===void 0)return;const r=De(n),i={idToken:await r.getIdToken(),displayName:e,photoUrl:t,returnSecureToken:!0},a=await Ur(r,qy(r.auth,i));r.displayName=a.displayName||null,r.photoURL=a.photoUrl||null;const l=r.providerData.find(({providerId:c})=>c==="password");l&&(l.displayName=r.displayName,l.photoURL=r.photoURL),await r._updateTokensIfNecessary(a)}function Hy(n,e,t,r){return De(n).onIdTokenChanged(e,t,r)}function Wy(n,e,t){return De(n).beforeAuthStateChanged(e,t)}function Yy(n,e,t,r){return De(n).onAuthStateChanged(e,t,r)}function Gy(n){return De(n).signOut()}const io="__sak";/**
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
 */class fh{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(io,"1"),this.storage.removeItem(io),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ky=1e3,Qy=10;class ph extends fh{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=oh(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const r=this.storage.getItem(t),s=this.localCache[t];r!==s&&e(t,s,r)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((a,l,c)=>{this.notifyListeners(a,c)});return}const r=e.key;t?this.detachListener():this.stopPolling();const s=()=>{const a=this.storage.getItem(r);!t&&this.localCache[r]===a||this.notifyListeners(r,a)},i=this.storage.getItem(r);cy()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(s,Qy):s()}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:r}),!0)})},Ky)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}ph.type="LOCAL";const Jy=ph;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mh extends fh{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}mh.type="SESSION";const gh=mh;/**
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
 */function Xy(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
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
 */class To{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(s=>s.isListeningto(e));if(t)return t;const r=new To(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:r,eventType:s,data:i}=t.data,a=this.handlersMap[s];if(!(a!=null&&a.size))return;t.ports[0].postMessage({status:"ack",eventId:r,eventType:s});const l=Array.from(a).map(async d=>d(t.origin,i)),c=await Xy(l);t.ports[0].postMessage({status:"done",eventId:r,eventType:s,response:c})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}To.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gl(n="",e=10){let t="";for(let r=0;r<e;r++)t+=Math.floor(Math.random()*10);return n+t}/**
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
 */class Zy{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,r=50){const s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let i,a;return new Promise((l,c)=>{const d=gl("",20);s.port1.start();const f=setTimeout(()=>{c(new Error("unsupported_event"))},r);a={messageChannel:s,onMessage(m){const v=m;if(v.data.eventId===d)switch(v.data.status){case"ack":clearTimeout(f),i=setTimeout(()=>{c(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),l(v.data.response);break;default:clearTimeout(f),clearTimeout(i),c(new Error("invalid_response"));break}}},this.handlers.add(a),s.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:d,data:t},[s.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pt(){return window}function ev(n){Pt().location.href=n}/**
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
 */function yh(){return typeof Pt().WorkerGlobalScope<"u"&&typeof Pt().importScripts=="function"}async function tv(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function nv(){var n;return((n=navigator==null?void 0:navigator.serviceWorker)===null||n===void 0?void 0:n.controller)||null}function rv(){return yh()?self:null}/**
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
 */const vh="firebaseLocalStorageDb",sv=1,oo="firebaseLocalStorage",_h="fbase_key";class si{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function Io(n,e){return n.transaction([oo],e?"readwrite":"readonly").objectStore(oo)}function iv(){const n=indexedDB.deleteDatabase(vh);return new si(n).toPromise()}function La(){const n=indexedDB.open(vh,sv);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const r=n.result;try{r.createObjectStore(oo,{keyPath:_h})}catch(s){t(s)}}),n.addEventListener("success",async()=>{const r=n.result;r.objectStoreNames.contains(oo)?e(r):(r.close(),await iv(),e(await La()))})})}async function Eu(n,e,t){const r=Io(n,!0).put({[_h]:e,value:t});return new si(r).toPromise()}async function ov(n,e){const t=Io(n,!1).get(e),r=await new si(t).toPromise();return r===void 0?null:r.value}function bu(n,e){const t=Io(n,!0).delete(e);return new si(t).toPromise()}const av=800,lv=3;class wh{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await La(),this.db)}async _withRetries(e){let t=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(t++>lv)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return yh()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=To._getInstance(rv()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await tv(),!this.activeServiceWorker)return;this.sender=new Zy(this.activeServiceWorker);const r=await this.sender._send("ping",{},800);r&&!((e=r[0])===null||e===void 0)&&e.fulfilled&&!((t=r[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||nv()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await La();return await Eu(e,io,"1"),await bu(e,io),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(r=>Eu(r,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(r=>ov(r,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>bu(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(s=>{const i=Io(s,!1).getAll();return new si(i).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],r=new Set;if(e.length!==0)for(const{fbase_key:s,value:i}of e)r.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(i)&&(this.notifyListeners(s,i),t.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!r.has(s)&&(this.notifyListeners(s,null),t.push(s));return t}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),av)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}wh.type="LOCAL";const cv=wh;new ti(3e4,6e4);/**
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
 */function Eh(n,e){return e?Yt(e):(W(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
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
 */class yl extends fl{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Vr(e,this._buildIdpRequest())}_linkToIdToken(e,t){return Vr(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return Vr(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function uv(n){return dh(n.auth,new yl(n),n.bypassAuthState)}function dv(n){const{auth:e,user:t}=n;return W(t,e,"internal-error"),By(t,new yl(n),n.bypassAuthState)}async function hv(n){const{auth:e,user:t}=n;return W(t,e,"internal-error"),Vy(t,new yl(n),n.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bh{constructor(e,t,r,s,i=!1){this.auth=e,this.resolver=r,this.user=s,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:r,postBody:s,tenantId:i,error:a,type:l}=e;if(a){this.reject(a);return}const c={auth:this.auth,requestUri:t,sessionId:r,tenantId:i||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(l)(c))}catch(d){this.reject(d)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return uv;case"linkViaPopup":case"linkViaRedirect":return hv;case"reauthViaPopup":case"reauthViaRedirect":return dv;default:yt(this.auth,"internal-error")}}resolve(e){Jt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Jt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fv=new ti(2e3,1e4);async function pv(n,e,t){if(Et(n.app))return Promise.reject(bt(n,"operation-not-supported-in-this-environment"));const r=nn(n);jg(n,e,ml);const s=Eh(r,t);return new qn(r,"signInViaPopup",e,s).executeNotNull()}class qn extends bh{constructor(e,t,r,s,i){super(e,t,s,i),this.provider=r,this.authWindow=null,this.pollId=null,qn.currentPopupAction&&qn.currentPopupAction.cancel(),qn.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return W(e,this.auth,"internal-error"),e}async onExecution(){Jt(this.filter.length===1,"Popup operations only handle one event");const e=gl();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(bt(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(bt(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,qn.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,r;if(!((r=(t=this.authWindow)===null||t===void 0?void 0:t.window)===null||r===void 0)&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(bt(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,fv.get())};e()}}qn.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mv="pendingRedirect",qi=new Map;class gv extends bh{constructor(e,t,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,r),this.eventId=null}async execute(){let e=qi.get(this.auth._key());if(!e){try{const r=await yv(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(t){e=()=>Promise.reject(t)}qi.set(this.auth._key(),e)}return this.bypassAuthState||qi.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function yv(n,e){const t=wv(e),r=_v(n);if(!await r._isAvailable())return!1;const s=await r._get(t)==="true";return await r._remove(t),s}function vv(n,e){qi.set(n._key(),e)}function _v(n){return Yt(n._redirectPersistence)}function wv(n){return Ui(mv,n.config.apiKey,n.name)}async function Ev(n,e,t=!1){if(Et(n.app))return Promise.reject(Gt(n));const r=nn(n),s=Eh(r,e),a=await new gv(r,s,t).execute();return a&&!t&&(delete a.user._redirectEventId,await r._persistUserIfCurrent(a.user),await r._setRedirectUser(null,e)),a}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bv=10*60*1e3;class Tv{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(t=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Iv(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var r;if(e.error&&!Th(e)){const s=((r=e.error.code)===null||r===void 0?void 0:r.split("auth/")[1])||"internal-error";t.onError(bt(this.auth,s))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const r=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=bv&&this.cachedEventUids.clear(),this.cachedEventUids.has(Tu(e))}saveEventToCache(e){this.cachedEventUids.add(Tu(e)),this.lastProcessedEventTime=Date.now()}}function Tu(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function Th({type:n,error:e}){return n==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Iv(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Th(n);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Sv(n,e={}){return Bt(n,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Av=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,xv=/^https?/;async function Rv(n){if(n.config.emulator)return;const{authorizedDomains:e}=await Sv(n);for(const t of e)try{if(Pv(t))return}catch{}yt(n,"unauthorized-domain")}function Pv(n){const e=Ma(),{protocol:t,hostname:r}=new URL(e);if(n.startsWith("chrome-extension://")){const a=new URL(n);return a.hostname===""&&r===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&a.hostname===r}if(!xv.test(t))return!1;if(Av.test(n))return r===n;const s=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(r)}/**
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
 */const Cv=new ti(3e4,6e4);function Iu(){const n=Pt().___jsl;if(n!=null&&n.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function kv(n){return new Promise((e,t)=>{var r,s,i;function a(){Iu(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Iu(),t(bt(n,"network-request-failed"))},timeout:Cv.get()})}if(!((s=(r=Pt().gapi)===null||r===void 0?void 0:r.iframes)===null||s===void 0)&&s.Iframe)e(gapi.iframes.getContext());else if(!((i=Pt().gapi)===null||i===void 0)&&i.load)a();else{const l=vy("iframefcb");return Pt()[l]=()=>{gapi.load?a():t(bt(n,"network-request-failed"))},lh(`${yy()}?onload=${l}`).catch(c=>t(c))}}).catch(e=>{throw ji=null,e})}let ji=null;function Dv(n){return ji=ji||kv(n),ji}/**
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
 */const Mv=new ti(5e3,15e3),Nv="__/auth/iframe",Lv="emulator/auth/iframe",Ov={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Vv=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Bv(n){const e=n.config;W(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?ul(e,Lv):`https://${n.config.authDomain}/${Nv}`,r={apiKey:e.apiKey,appName:n.name,v:Xr},s=Vv.get(n.config.apiHost);s&&(r.eid=s);const i=n._getFrameworks();return i.length&&(r.fw=i.join(",")),`${t}?${ei(r).slice(1)}`}async function Fv(n){const e=await Dv(n),t=Pt().gapi;return W(t,n,"internal-error"),e.open({where:document.body,url:Bv(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Ov,dontclear:!0},r=>new Promise(async(s,i)=>{await r.restyle({setHideOnLeave:!1});const a=bt(n,"network-request-failed"),l=Pt().setTimeout(()=>{i(a)},Mv.get());function c(){Pt().clearTimeout(l),s(r)}r.ping(c).then(c,()=>{i(a)})}))}/**
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
 */const zv={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},$v=500,Uv=600,qv="_blank",jv="http://localhost";class Su{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Hv(n,e,t,r=$v,s=Uv){const i=Math.max((window.screen.availHeight-s)/2,0).toString(),a=Math.max((window.screen.availWidth-r)/2,0).toString();let l="";const c=Object.assign(Object.assign({},zv),{width:r.toString(),height:s.toString(),top:i,left:a}),d=tt().toLowerCase();t&&(l=th(d)?qv:t),Zd(d)&&(e=e||jv,c.scrollbars="yes");const f=Object.entries(c).reduce((v,[E,T])=>`${v}${E}=${T},`,"");if(ly(d)&&l!=="_self")return Wv(e||"",l),new Su(null);const m=window.open(e||"",l,f);W(m,n,"popup-blocked");try{m.focus()}catch{}return new Su(m)}function Wv(n,e){const t=document.createElement("a");t.href=n,t.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(r)}/**
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
 */const Yv="__/auth/handler",Gv="emulator/auth/handler",Kv=encodeURIComponent("fac");async function Au(n,e,t,r,s,i){W(n.config.authDomain,n,"auth-domain-config-required"),W(n.config.apiKey,n,"invalid-api-key");const a={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:r,v:Xr,eventId:s};if(e instanceof ml){e.setDefaultLanguage(n.languageCode),a.providerId=e.providerId||"",Pm(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(const[f,m]of Object.entries({}))a[f]=m}if(e instanceof ri){const f=e.getScopes().filter(m=>m!=="");f.length>0&&(a.scopes=f.join(","))}n.tenantId&&(a.tid=n.tenantId);const l=a;for(const f of Object.keys(l))l[f]===void 0&&delete l[f];const c=await n._getAppCheckToken(),d=c?`#${Kv}=${encodeURIComponent(c)}`:"";return`${Qv(n)}?${ei(l).slice(1)}${d}`}function Qv({config:n}){return n.emulator?ul(n,Gv):`https://${n.authDomain}/${Yv}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pa="webStorageSupport";class Jv{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=gh,this._completeRedirectFn=Ev,this._overrideRedirectResult=vv}async _openPopup(e,t,r,s){var i;Jt((i=this.eventManagers[e._key()])===null||i===void 0?void 0:i.manager,"_initialize() not called before _openPopup()");const a=await Au(e,t,r,Ma(),s);return Hv(e,a,gl())}async _openRedirect(e,t,r,s){await this._originValidation(e);const i=await Au(e,t,r,Ma(),s);return ev(i),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:s,promise:i}=this.eventManagers[t];return s?Promise.resolve(s):(Jt(i,"If manager is not set, promise should be"),i)}const r=this.initAndGetManager(e);return this.eventManagers[t]={promise:r},r.catch(()=>{delete this.eventManagers[t]}),r}async initAndGetManager(e){const t=await Fv(e),r=new Tv(e);return t.register("authEvent",s=>(W(s==null?void 0:s.authEvent,e,"invalid-auth-event"),{status:r.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=t,r}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(pa,{type:pa},s=>{var i;const a=(i=s==null?void 0:s[0])===null||i===void 0?void 0:i[pa];a!==void 0&&t(!!a),yt(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=Rv(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return oh()||eh()||hl()}}const Xv=Jv;var xu="@firebase/auth",Ru="1.7.9";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zv{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){W(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function e0(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function t0(n){$r(new Gn("auth",(e,{options:t})=>{const r=e.getProvider("app").getImmediate(),s=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:a,authDomain:l}=r.options;W(a&&!a.includes(":"),"invalid-api-key",{appName:r.name});const c={apiKey:a,authDomain:l,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:ah(n)},d=new py(r,s,i,c);return Ty(d,t),d},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,r)=>{e.getProvider("auth-internal").initialize()})),$r(new Gn("auth-internal",e=>{const t=nn(e.getProvider("auth").getImmediate());return(r=>new Zv(r))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),_n(xu,Ru,e0(n)),_n(xu,Ru,"esm2017")}/**
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
 */const n0=5*60,r0=Bd("authIdTokenMaxAge")||n0;let Pu=null;const s0=n=>async e=>{const t=e&&await e.getIdTokenResult(),r=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(r&&r>r0)return;const s=t==null?void 0:t.token;Pu!==s&&(Pu=s,await fetch(n,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function i0(n=Ud()){const e=ol(n,"auth");if(e.isInitialized())return e.getImmediate();const t=by(n,{popupRedirectResolver:Xv,persistence:[cv,Jy,gh]}),r=Bd("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const i=new URL(r,location.origin);if(location.origin===i.origin){const a=s0(i.toString());Wy(t,a,()=>a(t.currentUser)),Hy(t,l=>a(l))}}const s=Od("auth");return s&&Iy(t,`http://${s}`),t}function o0(){var n,e;return(e=(n=document.getElementsByTagName("head"))===null||n===void 0?void 0:n[0])!==null&&e!==void 0?e:document}my({loadJS(n){return new Promise((e,t)=>{const r=document.createElement("script");r.setAttribute("src",n),r.onload=e,r.onerror=s=>{const i=bt("internal-error");i.customData=s,t(i)},r.type="text/javascript",r.charset="UTF-8",o0().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});t0("Browser");var Cu=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Hn,Ih;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(b,g){function y(){}y.prototype=g.prototype,b.D=g.prototype,b.prototype=new y,b.prototype.constructor=b,b.C=function(_,I,S){for(var w=Array(arguments.length-2),ae=2;ae<arguments.length;ae++)w[ae-2]=arguments[ae];return g.prototype[I].apply(_,w)}}function t(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(r,t),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(b,g,y){y||(y=0);var _=Array(16);if(typeof g=="string")for(var I=0;16>I;++I)_[I]=g.charCodeAt(y++)|g.charCodeAt(y++)<<8|g.charCodeAt(y++)<<16|g.charCodeAt(y++)<<24;else for(I=0;16>I;++I)_[I]=g[y++]|g[y++]<<8|g[y++]<<16|g[y++]<<24;g=b.g[0],y=b.g[1],I=b.g[2];var S=b.g[3],w=g+(S^y&(I^S))+_[0]+3614090360&4294967295;g=y+(w<<7&4294967295|w>>>25),w=S+(I^g&(y^I))+_[1]+3905402710&4294967295,S=g+(w<<12&4294967295|w>>>20),w=I+(y^S&(g^y))+_[2]+606105819&4294967295,I=S+(w<<17&4294967295|w>>>15),w=y+(g^I&(S^g))+_[3]+3250441966&4294967295,y=I+(w<<22&4294967295|w>>>10),w=g+(S^y&(I^S))+_[4]+4118548399&4294967295,g=y+(w<<7&4294967295|w>>>25),w=S+(I^g&(y^I))+_[5]+1200080426&4294967295,S=g+(w<<12&4294967295|w>>>20),w=I+(y^S&(g^y))+_[6]+2821735955&4294967295,I=S+(w<<17&4294967295|w>>>15),w=y+(g^I&(S^g))+_[7]+4249261313&4294967295,y=I+(w<<22&4294967295|w>>>10),w=g+(S^y&(I^S))+_[8]+1770035416&4294967295,g=y+(w<<7&4294967295|w>>>25),w=S+(I^g&(y^I))+_[9]+2336552879&4294967295,S=g+(w<<12&4294967295|w>>>20),w=I+(y^S&(g^y))+_[10]+4294925233&4294967295,I=S+(w<<17&4294967295|w>>>15),w=y+(g^I&(S^g))+_[11]+2304563134&4294967295,y=I+(w<<22&4294967295|w>>>10),w=g+(S^y&(I^S))+_[12]+1804603682&4294967295,g=y+(w<<7&4294967295|w>>>25),w=S+(I^g&(y^I))+_[13]+4254626195&4294967295,S=g+(w<<12&4294967295|w>>>20),w=I+(y^S&(g^y))+_[14]+2792965006&4294967295,I=S+(w<<17&4294967295|w>>>15),w=y+(g^I&(S^g))+_[15]+1236535329&4294967295,y=I+(w<<22&4294967295|w>>>10),w=g+(I^S&(y^I))+_[1]+4129170786&4294967295,g=y+(w<<5&4294967295|w>>>27),w=S+(y^I&(g^y))+_[6]+3225465664&4294967295,S=g+(w<<9&4294967295|w>>>23),w=I+(g^y&(S^g))+_[11]+643717713&4294967295,I=S+(w<<14&4294967295|w>>>18),w=y+(S^g&(I^S))+_[0]+3921069994&4294967295,y=I+(w<<20&4294967295|w>>>12),w=g+(I^S&(y^I))+_[5]+3593408605&4294967295,g=y+(w<<5&4294967295|w>>>27),w=S+(y^I&(g^y))+_[10]+38016083&4294967295,S=g+(w<<9&4294967295|w>>>23),w=I+(g^y&(S^g))+_[15]+3634488961&4294967295,I=S+(w<<14&4294967295|w>>>18),w=y+(S^g&(I^S))+_[4]+3889429448&4294967295,y=I+(w<<20&4294967295|w>>>12),w=g+(I^S&(y^I))+_[9]+568446438&4294967295,g=y+(w<<5&4294967295|w>>>27),w=S+(y^I&(g^y))+_[14]+3275163606&4294967295,S=g+(w<<9&4294967295|w>>>23),w=I+(g^y&(S^g))+_[3]+4107603335&4294967295,I=S+(w<<14&4294967295|w>>>18),w=y+(S^g&(I^S))+_[8]+1163531501&4294967295,y=I+(w<<20&4294967295|w>>>12),w=g+(I^S&(y^I))+_[13]+2850285829&4294967295,g=y+(w<<5&4294967295|w>>>27),w=S+(y^I&(g^y))+_[2]+4243563512&4294967295,S=g+(w<<9&4294967295|w>>>23),w=I+(g^y&(S^g))+_[7]+1735328473&4294967295,I=S+(w<<14&4294967295|w>>>18),w=y+(S^g&(I^S))+_[12]+2368359562&4294967295,y=I+(w<<20&4294967295|w>>>12),w=g+(y^I^S)+_[5]+4294588738&4294967295,g=y+(w<<4&4294967295|w>>>28),w=S+(g^y^I)+_[8]+2272392833&4294967295,S=g+(w<<11&4294967295|w>>>21),w=I+(S^g^y)+_[11]+1839030562&4294967295,I=S+(w<<16&4294967295|w>>>16),w=y+(I^S^g)+_[14]+4259657740&4294967295,y=I+(w<<23&4294967295|w>>>9),w=g+(y^I^S)+_[1]+2763975236&4294967295,g=y+(w<<4&4294967295|w>>>28),w=S+(g^y^I)+_[4]+1272893353&4294967295,S=g+(w<<11&4294967295|w>>>21),w=I+(S^g^y)+_[7]+4139469664&4294967295,I=S+(w<<16&4294967295|w>>>16),w=y+(I^S^g)+_[10]+3200236656&4294967295,y=I+(w<<23&4294967295|w>>>9),w=g+(y^I^S)+_[13]+681279174&4294967295,g=y+(w<<4&4294967295|w>>>28),w=S+(g^y^I)+_[0]+3936430074&4294967295,S=g+(w<<11&4294967295|w>>>21),w=I+(S^g^y)+_[3]+3572445317&4294967295,I=S+(w<<16&4294967295|w>>>16),w=y+(I^S^g)+_[6]+76029189&4294967295,y=I+(w<<23&4294967295|w>>>9),w=g+(y^I^S)+_[9]+3654602809&4294967295,g=y+(w<<4&4294967295|w>>>28),w=S+(g^y^I)+_[12]+3873151461&4294967295,S=g+(w<<11&4294967295|w>>>21),w=I+(S^g^y)+_[15]+530742520&4294967295,I=S+(w<<16&4294967295|w>>>16),w=y+(I^S^g)+_[2]+3299628645&4294967295,y=I+(w<<23&4294967295|w>>>9),w=g+(I^(y|~S))+_[0]+4096336452&4294967295,g=y+(w<<6&4294967295|w>>>26),w=S+(y^(g|~I))+_[7]+1126891415&4294967295,S=g+(w<<10&4294967295|w>>>22),w=I+(g^(S|~y))+_[14]+2878612391&4294967295,I=S+(w<<15&4294967295|w>>>17),w=y+(S^(I|~g))+_[5]+4237533241&4294967295,y=I+(w<<21&4294967295|w>>>11),w=g+(I^(y|~S))+_[12]+1700485571&4294967295,g=y+(w<<6&4294967295|w>>>26),w=S+(y^(g|~I))+_[3]+2399980690&4294967295,S=g+(w<<10&4294967295|w>>>22),w=I+(g^(S|~y))+_[10]+4293915773&4294967295,I=S+(w<<15&4294967295|w>>>17),w=y+(S^(I|~g))+_[1]+2240044497&4294967295,y=I+(w<<21&4294967295|w>>>11),w=g+(I^(y|~S))+_[8]+1873313359&4294967295,g=y+(w<<6&4294967295|w>>>26),w=S+(y^(g|~I))+_[15]+4264355552&4294967295,S=g+(w<<10&4294967295|w>>>22),w=I+(g^(S|~y))+_[6]+2734768916&4294967295,I=S+(w<<15&4294967295|w>>>17),w=y+(S^(I|~g))+_[13]+1309151649&4294967295,y=I+(w<<21&4294967295|w>>>11),w=g+(I^(y|~S))+_[4]+4149444226&4294967295,g=y+(w<<6&4294967295|w>>>26),w=S+(y^(g|~I))+_[11]+3174756917&4294967295,S=g+(w<<10&4294967295|w>>>22),w=I+(g^(S|~y))+_[2]+718787259&4294967295,I=S+(w<<15&4294967295|w>>>17),w=y+(S^(I|~g))+_[9]+3951481745&4294967295,b.g[0]=b.g[0]+g&4294967295,b.g[1]=b.g[1]+(I+(w<<21&4294967295|w>>>11))&4294967295,b.g[2]=b.g[2]+I&4294967295,b.g[3]=b.g[3]+S&4294967295}r.prototype.u=function(b,g){g===void 0&&(g=b.length);for(var y=g-this.blockSize,_=this.B,I=this.h,S=0;S<g;){if(I==0)for(;S<=y;)s(this,b,S),S+=this.blockSize;if(typeof b=="string"){for(;S<g;)if(_[I++]=b.charCodeAt(S++),I==this.blockSize){s(this,_),I=0;break}}else for(;S<g;)if(_[I++]=b[S++],I==this.blockSize){s(this,_),I=0;break}}this.h=I,this.o+=g},r.prototype.v=function(){var b=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);b[0]=128;for(var g=1;g<b.length-8;++g)b[g]=0;var y=8*this.o;for(g=b.length-8;g<b.length;++g)b[g]=y&255,y/=256;for(this.u(b),b=Array(16),g=y=0;4>g;++g)for(var _=0;32>_;_+=8)b[y++]=this.g[g]>>>_&255;return b};function i(b,g){var y=l;return Object.prototype.hasOwnProperty.call(y,b)?y[b]:y[b]=g(b)}function a(b,g){this.h=g;for(var y=[],_=!0,I=b.length-1;0<=I;I--){var S=b[I]|0;_&&S==g||(y[I]=S,_=!1)}this.g=y}var l={};function c(b){return-128<=b&&128>b?i(b,function(g){return new a([g|0],0>g?-1:0)}):new a([b|0],0>b?-1:0)}function d(b){if(isNaN(b)||!isFinite(b))return m;if(0>b)return R(d(-b));for(var g=[],y=1,_=0;b>=y;_++)g[_]=b/y|0,y*=4294967296;return new a(g,0)}function f(b,g){if(b.length==0)throw Error("number format error: empty string");if(g=g||10,2>g||36<g)throw Error("radix out of range: "+g);if(b.charAt(0)=="-")return R(f(b.substring(1),g));if(0<=b.indexOf("-"))throw Error('number format error: interior "-" character');for(var y=d(Math.pow(g,8)),_=m,I=0;I<b.length;I+=8){var S=Math.min(8,b.length-I),w=parseInt(b.substring(I,I+S),g);8>S?(S=d(Math.pow(g,S)),_=_.j(S).add(d(w))):(_=_.j(y),_=_.add(d(w)))}return _}var m=c(0),v=c(1),E=c(16777216);n=a.prototype,n.m=function(){if(x(this))return-R(this).m();for(var b=0,g=1,y=0;y<this.g.length;y++){var _=this.i(y);b+=(0<=_?_:4294967296+_)*g,g*=4294967296}return b},n.toString=function(b){if(b=b||10,2>b||36<b)throw Error("radix out of range: "+b);if(T(this))return"0";if(x(this))return"-"+R(this).toString(b);for(var g=d(Math.pow(b,6)),y=this,_="";;){var I=C(y,g).g;y=A(y,I.j(g));var S=((0<y.g.length?y.g[0]:y.h)>>>0).toString(b);if(y=I,T(y))return S+_;for(;6>S.length;)S="0"+S;_=S+_}},n.i=function(b){return 0>b?0:b<this.g.length?this.g[b]:this.h};function T(b){if(b.h!=0)return!1;for(var g=0;g<b.g.length;g++)if(b.g[g]!=0)return!1;return!0}function x(b){return b.h==-1}n.l=function(b){return b=A(this,b),x(b)?-1:T(b)?0:1};function R(b){for(var g=b.g.length,y=[],_=0;_<g;_++)y[_]=~b.g[_];return new a(y,~b.h).add(v)}n.abs=function(){return x(this)?R(this):this},n.add=function(b){for(var g=Math.max(this.g.length,b.g.length),y=[],_=0,I=0;I<=g;I++){var S=_+(this.i(I)&65535)+(b.i(I)&65535),w=(S>>>16)+(this.i(I)>>>16)+(b.i(I)>>>16);_=w>>>16,S&=65535,w&=65535,y[I]=w<<16|S}return new a(y,y[y.length-1]&-2147483648?-1:0)};function A(b,g){return b.add(R(g))}n.j=function(b){if(T(this)||T(b))return m;if(x(this))return x(b)?R(this).j(R(b)):R(R(this).j(b));if(x(b))return R(this.j(R(b)));if(0>this.l(E)&&0>b.l(E))return d(this.m()*b.m());for(var g=this.g.length+b.g.length,y=[],_=0;_<2*g;_++)y[_]=0;for(_=0;_<this.g.length;_++)for(var I=0;I<b.g.length;I++){var S=this.i(_)>>>16,w=this.i(_)&65535,ae=b.i(I)>>>16,Me=b.i(I)&65535;y[2*_+2*I]+=w*Me,D(y,2*_+2*I),y[2*_+2*I+1]+=S*Me,D(y,2*_+2*I+1),y[2*_+2*I+1]+=w*ae,D(y,2*_+2*I+1),y[2*_+2*I+2]+=S*ae,D(y,2*_+2*I+2)}for(_=0;_<g;_++)y[_]=y[2*_+1]<<16|y[2*_];for(_=g;_<2*g;_++)y[_]=0;return new a(y,0)};function D(b,g){for(;(b[g]&65535)!=b[g];)b[g+1]+=b[g]>>>16,b[g]&=65535,g++}function N(b,g){this.g=b,this.h=g}function C(b,g){if(T(g))throw Error("division by zero");if(T(b))return new N(m,m);if(x(b))return g=C(R(b),g),new N(R(g.g),R(g.h));if(x(g))return g=C(b,R(g)),new N(R(g.g),g.h);if(30<b.g.length){if(x(b)||x(g))throw Error("slowDivide_ only works with positive integers.");for(var y=v,_=g;0>=_.l(b);)y=O(y),_=O(_);var I=V(y,1),S=V(_,1);for(_=V(_,2),y=V(y,2);!T(_);){var w=S.add(_);0>=w.l(b)&&(I=I.add(y),S=w),_=V(_,1),y=V(y,1)}return g=A(b,I.j(g)),new N(I,g)}for(I=m;0<=b.l(g);){for(y=Math.max(1,Math.floor(b.m()/g.m())),_=Math.ceil(Math.log(y)/Math.LN2),_=48>=_?1:Math.pow(2,_-48),S=d(y),w=S.j(g);x(w)||0<w.l(b);)y-=_,S=d(y),w=S.j(g);T(S)&&(S=v),I=I.add(S),b=A(b,w)}return new N(I,b)}n.A=function(b){return C(this,b).h},n.and=function(b){for(var g=Math.max(this.g.length,b.g.length),y=[],_=0;_<g;_++)y[_]=this.i(_)&b.i(_);return new a(y,this.h&b.h)},n.or=function(b){for(var g=Math.max(this.g.length,b.g.length),y=[],_=0;_<g;_++)y[_]=this.i(_)|b.i(_);return new a(y,this.h|b.h)},n.xor=function(b){for(var g=Math.max(this.g.length,b.g.length),y=[],_=0;_<g;_++)y[_]=this.i(_)^b.i(_);return new a(y,this.h^b.h)};function O(b){for(var g=b.g.length+1,y=[],_=0;_<g;_++)y[_]=b.i(_)<<1|b.i(_-1)>>>31;return new a(y,b.h)}function V(b,g){var y=g>>5;g%=32;for(var _=b.g.length-y,I=[],S=0;S<_;S++)I[S]=0<g?b.i(S+y)>>>g|b.i(S+y+1)<<32-g:b.i(S+y);return new a(I,b.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,Ih=r,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.A,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=d,a.fromString=f,Hn=a}).apply(typeof Cu<"u"?Cu:typeof self<"u"?self:typeof window<"u"?window:{});var Vi=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Sh,xs,Ah,Hi,Oa,xh,Rh,Ph;(function(){var n,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(o,u,h){return o==Array.prototype||o==Object.prototype||(o[u]=h.value),o};function t(o){o=[typeof globalThis=="object"&&globalThis,o,typeof window=="object"&&window,typeof self=="object"&&self,typeof Vi=="object"&&Vi];for(var u=0;u<o.length;++u){var h=o[u];if(h&&h.Math==Math)return h}throw Error("Cannot find global object")}var r=t(this);function s(o,u){if(u)e:{var h=r;o=o.split(".");for(var p=0;p<o.length-1;p++){var P=o[p];if(!(P in h))break e;h=h[P]}o=o[o.length-1],p=h[o],u=u(p),u!=p&&u!=null&&e(h,o,{configurable:!0,writable:!0,value:u})}}function i(o,u){o instanceof String&&(o+="");var h=0,p=!1,P={next:function(){if(!p&&h<o.length){var k=h++;return{value:u(k,o[k]),done:!1}}return p=!0,{done:!0,value:void 0}}};return P[Symbol.iterator]=function(){return P},P}s("Array.prototype.values",function(o){return o||function(){return i(this,function(u,h){return h})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var a=a||{},l=this||self;function c(o){var u=typeof o;return u=u!="object"?u:o?Array.isArray(o)?"array":u:"null",u=="array"||u=="object"&&typeof o.length=="number"}function d(o){var u=typeof o;return u=="object"&&o!=null||u=="function"}function f(o,u,h){return o.call.apply(o.bind,arguments)}function m(o,u,h){if(!o)throw Error();if(2<arguments.length){var p=Array.prototype.slice.call(arguments,2);return function(){var P=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(P,p),o.apply(u,P)}}return function(){return o.apply(u,arguments)}}function v(o,u,h){return v=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?f:m,v.apply(null,arguments)}function E(o,u){var h=Array.prototype.slice.call(arguments,1);return function(){var p=h.slice();return p.push.apply(p,arguments),o.apply(this,p)}}function T(o,u){function h(){}h.prototype=u.prototype,o.aa=u.prototype,o.prototype=new h,o.prototype.constructor=o,o.Qb=function(p,P,k){for(var B=Array(arguments.length-2),he=2;he<arguments.length;he++)B[he-2]=arguments[he];return u.prototype[P].apply(p,B)}}function x(o){const u=o.length;if(0<u){const h=Array(u);for(let p=0;p<u;p++)h[p]=o[p];return h}return[]}function R(o,u){for(let h=1;h<arguments.length;h++){const p=arguments[h];if(c(p)){const P=o.length||0,k=p.length||0;o.length=P+k;for(let B=0;B<k;B++)o[P+B]=p[B]}else o.push(p)}}class A{constructor(u,h){this.i=u,this.j=h,this.h=0,this.g=null}get(){let u;return 0<this.h?(this.h--,u=this.g,this.g=u.next,u.next=null):u=this.i(),u}}function D(o){return/^[\s\xa0]*$/.test(o)}function N(){var o=l.navigator;return o&&(o=o.userAgent)?o:""}function C(o){return C[" "](o),o}C[" "]=function(){};var O=N().indexOf("Gecko")!=-1&&!(N().toLowerCase().indexOf("webkit")!=-1&&N().indexOf("Edge")==-1)&&!(N().indexOf("Trident")!=-1||N().indexOf("MSIE")!=-1)&&N().indexOf("Edge")==-1;function V(o,u,h){for(const p in o)u.call(h,o[p],p,o)}function b(o,u){for(const h in o)u.call(void 0,o[h],h,o)}function g(o){const u={};for(const h in o)u[h]=o[h];return u}const y="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function _(o,u){let h,p;for(let P=1;P<arguments.length;P++){p=arguments[P];for(h in p)o[h]=p[h];for(let k=0;k<y.length;k++)h=y[k],Object.prototype.hasOwnProperty.call(p,h)&&(o[h]=p[h])}}function I(o){var u=1;o=o.split(":");const h=[];for(;0<u&&o.length;)h.push(o.shift()),u--;return o.length&&h.push(o.join(":")),h}function S(o){l.setTimeout(()=>{throw o},0)}function w(){var o=fe;let u=null;return o.g&&(u=o.g,o.g=o.g.next,o.g||(o.h=null),u.next=null),u}class ae{constructor(){this.h=this.g=null}add(u,h){const p=Me.get();p.set(u,h),this.h?this.h.next=p:this.g=p,this.h=p}}var Me=new A(()=>new Z,o=>o.reset());class Z{constructor(){this.next=this.g=this.h=null}set(u,h){this.h=u,this.g=h,this.next=null}reset(){this.next=this.g=this.h=null}}let xe,ue=!1,fe=new ae,Oe=()=>{const o=l.Promise.resolve(void 0);xe=()=>{o.then(de)}};var de=()=>{for(var o;o=w();){try{o.h.call(o.g)}catch(h){S(h)}var u=Me;u.j(o),100>u.h&&(u.h++,o.next=u.g,u.g=o)}ue=!1};function Ee(){this.s=this.s,this.C=this.C}Ee.prototype.s=!1,Ee.prototype.ma=function(){this.s||(this.s=!0,this.N())},Ee.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function U(o,u){this.type=o,this.g=this.target=u,this.defaultPrevented=!1}U.prototype.h=function(){this.defaultPrevented=!0};var be=function(){if(!l.addEventListener||!Object.defineProperty)return!1;var o=!1,u=Object.defineProperty({},"passive",{get:function(){o=!0}});try{const h=()=>{};l.addEventListener("test",h,u),l.removeEventListener("test",h,u)}catch{}return o}();function X(o,u){if(U.call(this,o?o.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,o){var h=this.type=o.type,p=o.changedTouches&&o.changedTouches.length?o.changedTouches[0]:null;if(this.target=o.target||o.srcElement,this.g=u,u=o.relatedTarget){if(O){e:{try{C(u.nodeName);var P=!0;break e}catch{}P=!1}P||(u=null)}}else h=="mouseover"?u=o.fromElement:h=="mouseout"&&(u=o.toElement);this.relatedTarget=u,p?(this.clientX=p.clientX!==void 0?p.clientX:p.pageX,this.clientY=p.clientY!==void 0?p.clientY:p.pageY,this.screenX=p.screenX||0,this.screenY=p.screenY||0):(this.clientX=o.clientX!==void 0?o.clientX:o.pageX,this.clientY=o.clientY!==void 0?o.clientY:o.pageY,this.screenX=o.screenX||0,this.screenY=o.screenY||0),this.button=o.button,this.key=o.key||"",this.ctrlKey=o.ctrlKey,this.altKey=o.altKey,this.shiftKey=o.shiftKey,this.metaKey=o.metaKey,this.pointerId=o.pointerId||0,this.pointerType=typeof o.pointerType=="string"?o.pointerType:oe[o.pointerType]||"",this.state=o.state,this.i=o,o.defaultPrevented&&X.aa.h.call(this)}}T(X,U);var oe={2:"touch",3:"pen",4:"mouse"};X.prototype.h=function(){X.aa.h.call(this);var o=this.i;o.preventDefault?o.preventDefault():o.returnValue=!1};var Ve="closure_listenable_"+(1e6*Math.random()|0),dt=0;function ht(o,u,h,p,P){this.listener=o,this.proxy=null,this.src=u,this.type=h,this.capture=!!p,this.ha=P,this.key=++dt,this.da=this.fa=!1}function Be(o){o.da=!0,o.listener=null,o.proxy=null,o.src=null,o.ha=null}function It(o){this.src=o,this.g={},this.h=0}It.prototype.add=function(o,u,h,p,P){var k=o.toString();o=this.g[k],o||(o=this.g[k]=[],this.h++);var B=hr(o,u,p,P);return-1<B?(u=o[B],h||(u.fa=!1)):(u=new ht(u,this.src,k,!!p,P),u.fa=h,o.push(u)),u};function dr(o,u){var h=u.type;if(h in o.g){var p=o.g[h],P=Array.prototype.indexOf.call(p,u,void 0),k;(k=0<=P)&&Array.prototype.splice.call(p,P,1),k&&(Be(u),o.g[h].length==0&&(delete o.g[h],o.h--))}}function hr(o,u,h,p){for(var P=0;P<o.length;++P){var k=o[P];if(!k.da&&k.listener==u&&k.capture==!!h&&k.ha==p)return P}return-1}var Dn="closure_lm_"+(1e6*Math.random()|0),Mn={};function St(o,u,h,p,P){if(Array.isArray(u)){for(var k=0;k<u.length;k++)St(o,u[k],h,p,P);return null}return h=vr(h),o&&o[Ve]?o.K(u,h,d(p)?!!p.capture:!1,P):fr(o,u,h,!1,p,P)}function fr(o,u,h,p,P,k){if(!u)throw Error("Invalid event type");var B=d(P)?!!P.capture:!!P,he=yr(o);if(he||(o[Dn]=he=new It(o)),h=he.add(u,h,p,B,k),h.proxy)return h;if(p=pr(),h.proxy=p,p.src=o,p.listener=h,o.addEventListener)be||(P=B),P===void 0&&(P=!1),o.addEventListener(u.toString(),p,P);else if(o.attachEvent)o.attachEvent(rn(u.toString()),p);else if(o.addListener&&o.removeListener)o.addListener(p);else throw Error("addEventListener and attachEvent are unavailable.");return h}function pr(){function o(h){return u.call(o.src,o.listener,h)}const u=Qo;return o}function mr(o,u,h,p,P){if(Array.isArray(u))for(var k=0;k<u.length;k++)mr(o,u[k],h,p,P);else p=d(p)?!!p.capture:!!p,h=vr(h),o&&o[Ve]?(o=o.i,u=String(u).toString(),u in o.g&&(k=o.g[u],h=hr(k,h,p,P),-1<h&&(Be(k[h]),Array.prototype.splice.call(k,h,1),k.length==0&&(delete o.g[u],o.h--)))):o&&(o=yr(o))&&(u=o.g[u.toString()],o=-1,u&&(o=hr(u,h,p,P)),(h=-1<o?u[o]:null)&&gr(h))}function gr(o){if(typeof o!="number"&&o&&!o.da){var u=o.src;if(u&&u[Ve])dr(u.i,o);else{var h=o.type,p=o.proxy;u.removeEventListener?u.removeEventListener(h,p,o.capture):u.detachEvent?u.detachEvent(rn(h),p):u.addListener&&u.removeListener&&u.removeListener(p),(h=yr(u))?(dr(h,o),h.h==0&&(h.src=null,u[Dn]=null)):Be(o)}}}function rn(o){return o in Mn?Mn[o]:Mn[o]="on"+o}function Qo(o,u){if(o.da)o=!0;else{u=new X(u,this);var h=o.listener,p=o.ha||o.src;o.fa&&gr(o),o=h.call(p,u)}return o}function yr(o){return o=o[Dn],o instanceof It?o:null}var as="__closure_events_fn_"+(1e9*Math.random()>>>0);function vr(o){return typeof o=="function"?o:(o[as]||(o[as]=function(u){return o.handleEvent(u)}),o[as])}function ze(){Ee.call(this),this.i=new It(this),this.M=this,this.F=null}T(ze,Ee),ze.prototype[Ve]=!0,ze.prototype.removeEventListener=function(o,u,h,p){mr(this,o,u,h,p)};function $e(o,u){var h,p=o.F;if(p)for(h=[];p;p=p.F)h.push(p);if(o=o.M,p=u.type||u,typeof u=="string")u=new U(u,o);else if(u instanceof U)u.target=u.target||o;else{var P=u;u=new U(p,o),_(u,P)}if(P=!0,h)for(var k=h.length-1;0<=k;k--){var B=u.g=h[k];P=ls(B,p,!0,u)&&P}if(B=u.g=o,P=ls(B,p,!0,u)&&P,P=ls(B,p,!1,u)&&P,h)for(k=0;k<h.length;k++)B=u.g=h[k],P=ls(B,p,!1,u)&&P}ze.prototype.N=function(){if(ze.aa.N.call(this),this.i){var o=this.i,u;for(u in o.g){for(var h=o.g[u],p=0;p<h.length;p++)Be(h[p]);delete o.g[u],o.h--}}this.F=null},ze.prototype.K=function(o,u,h,p){return this.i.add(String(o),u,!1,h,p)},ze.prototype.L=function(o,u,h,p){return this.i.add(String(o),u,!0,h,p)};function ls(o,u,h,p){if(u=o.i.g[String(u)],!u)return!0;u=u.concat();for(var P=!0,k=0;k<u.length;++k){var B=u[k];if(B&&!B.da&&B.capture==h){var he=B.listener,Ue=B.ha||B.src;B.fa&&dr(o.i,B),P=he.call(Ue,p)!==!1&&P}}return P&&!p.defaultPrevented}function Ft(o,u,h){if(typeof o=="function")h&&(o=v(o,h));else if(o&&typeof o.handleEvent=="function")o=v(o.handleEvent,o);else throw Error("Invalid listener argument");return 2147483647<Number(u)?-1:l.setTimeout(o,u||0)}function zt(o){o.g=Ft(()=>{o.g=null,o.i&&(o.i=!1,zt(o))},o.l);const u=o.h;o.h=null,o.m.apply(null,u)}class vi extends Ee{constructor(u,h){super(),this.m=u,this.l=h,this.h=null,this.i=!1,this.g=null}j(u){this.h=arguments,this.g?this.i=!0:zt(this)}N(){super.N(),this.g&&(l.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function _r(o){Ee.call(this),this.h=o,this.g={}}T(_r,Ee);var cs=[];function _i(o){V(o.g,function(u,h){this.g.hasOwnProperty(h)&&gr(u)},o),o.g={}}_r.prototype.N=function(){_r.aa.N.call(this),_i(this)},_r.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var us=l.JSON.stringify,wr=l.JSON.parse,ds=class{stringify(o){return l.JSON.stringify(o,void 0)}parse(o){return l.JSON.parse(o,void 0)}};function Nn(){}Nn.prototype.h=null;function wi(o){return o.h||(o.h=o.i())}function hs(){}var sn={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function Er(){U.call(this,"d")}T(Er,U);function br(){U.call(this,"c")}T(br,U);var J={},Ne=null;function ge(){return Ne=Ne||new ze}J.La="serverreachability";function $t(o){U.call(this,J.La,o)}T($t,U);function vt(o){const u=ge();$e(u,new $t(u))}J.STAT_EVENT="statevent";function _t(o,u){U.call(this,J.STAT_EVENT,o),this.stat=u}T(_t,U);function ve(o){const u=ge();$e(u,new _t(u,o))}J.Ma="timingevent";function Se(o,u){U.call(this,J.Ma,o),this.size=u}T(Se,U);function ye(o,u){if(typeof o!="function")throw Error("Fn must not be null and must be a function");return l.setTimeout(function(){o()},u)}function Re(){this.g=!0}Re.prototype.xa=function(){this.g=!1};function nt(o,u,h,p,P,k){o.info(function(){if(o.g)if(k)for(var B="",he=k.split("&"),Ue=0;Ue<he.length;Ue++){var re=he[Ue].split("=");if(1<re.length){var Ge=re[0];re=re[1];var Ke=Ge.split("_");B=2<=Ke.length&&Ke[1]=="type"?B+(Ge+"="+re+"&"):B+(Ge+"=redacted&")}}else B=null;else B=k;return"XMLHTTP REQ ("+p+") [attempt "+P+"]: "+u+`
`+h+`
`+B})}function Ln(o,u,h,p,P,k,B){o.info(function(){return"XMLHTTP RESP ("+p+") [ attempt "+P+"]: "+u+`
`+h+`
`+k+" "+B})}function Pe(o,u,h,p){o.info(function(){return"XMLHTTP TEXT ("+u+"): "+Tr(o,h)+(p?" "+p:"")})}function On(o,u){o.info(function(){return"TIMEOUT: "+u})}Re.prototype.info=function(){};function Tr(o,u){if(!o.g)return u;if(!u)return null;try{var h=JSON.parse(u);if(h){for(o=0;o<h.length;o++)if(Array.isArray(h[o])){var p=h[o];if(!(2>p.length)){var P=p[1];if(Array.isArray(P)&&!(1>P.length)){var k=P[0];if(k!="noop"&&k!="stop"&&k!="close")for(var B=1;B<P.length;B++)P[B]=""}}}}return us(h)}catch{return u}}var Vn={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},Ei={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},fs;function bi(){}T(bi,Nn),bi.prototype.g=function(){return new XMLHttpRequest},bi.prototype.i=function(){return{}},fs=new bi;function on(o,u,h,p){this.j=o,this.i=u,this.l=h,this.R=p||1,this.U=new _r(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new mc}function mc(){this.i=null,this.g="",this.h=!1}var gc={},Jo={};function Xo(o,u,h){o.L=1,o.v=Ai(Ut(u)),o.m=h,o.P=!0,yc(o,null)}function yc(o,u){o.F=Date.now(),Ti(o),o.A=Ut(o.v);var h=o.A,p=o.R;Array.isArray(p)||(p=[String(p)]),kc(h.i,"t",p),o.C=0,h=o.j.J,o.h=new mc,o.g=Kc(o.j,h?u:null,!o.m),0<o.O&&(o.M=new vi(v(o.Y,o,o.g),o.O)),u=o.U,h=o.g,p=o.ca;var P="readystatechange";Array.isArray(P)||(P&&(cs[0]=P.toString()),P=cs);for(var k=0;k<P.length;k++){var B=St(h,P[k],p||u.handleEvent,!1,u.h||u);if(!B)break;u.g[B.key]=B}u=o.H?g(o.H):{},o.m?(o.u||(o.u="POST"),u["Content-Type"]="application/x-www-form-urlencoded",o.g.ea(o.A,o.u,o.m,u)):(o.u="GET",o.g.ea(o.A,o.u,null,u)),vt(),nt(o.i,o.u,o.A,o.l,o.R,o.m)}on.prototype.ca=function(o){o=o.target;const u=this.M;u&&qt(o)==3?u.j():this.Y(o)},on.prototype.Y=function(o){try{if(o==this.g)e:{const Ke=qt(this.g);var u=this.g.Ba();const Ar=this.g.Z();if(!(3>Ke)&&(Ke!=3||this.g&&(this.h.h||this.g.oa()||Bc(this.g)))){this.J||Ke!=4||u==7||(u==8||0>=Ar?vt(3):vt(2)),Zo(this);var h=this.g.Z();this.X=h;t:if(vc(this)){var p=Bc(this.g);o="";var P=p.length,k=qt(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){Bn(this),ps(this);var B="";break t}this.h.i=new l.TextDecoder}for(u=0;u<P;u++)this.h.h=!0,o+=this.h.i.decode(p[u],{stream:!(k&&u==P-1)});p.length=0,this.h.g+=o,this.C=0,B=this.h.g}else B=this.g.oa();if(this.o=h==200,Ln(this.i,this.u,this.A,this.l,this.R,Ke,h),this.o){if(this.T&&!this.K){t:{if(this.g){var he,Ue=this.g;if((he=Ue.g?Ue.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!D(he)){var re=he;break t}}re=null}if(h=re)Pe(this.i,this.l,h,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,ea(this,h);else{this.o=!1,this.s=3,ve(12),Bn(this),ps(this);break e}}if(this.P){h=!0;let wt;for(;!this.J&&this.C<B.length;)if(wt=Rp(this,B),wt==Jo){Ke==4&&(this.s=4,ve(14),h=!1),Pe(this.i,this.l,null,"[Incomplete Response]");break}else if(wt==gc){this.s=4,ve(15),Pe(this.i,this.l,B,"[Invalid Chunk]"),h=!1;break}else Pe(this.i,this.l,wt,null),ea(this,wt);if(vc(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),Ke!=4||B.length!=0||this.h.h||(this.s=1,ve(16),h=!1),this.o=this.o&&h,!h)Pe(this.i,this.l,B,"[Invalid Chunked Response]"),Bn(this),ps(this);else if(0<B.length&&!this.W){this.W=!0;var Ge=this.j;Ge.g==this&&Ge.ba&&!Ge.M&&(Ge.j.info("Great, no buffering proxy detected. Bytes received: "+B.length),oa(Ge),Ge.M=!0,ve(11))}}else Pe(this.i,this.l,B,null),ea(this,B);Ke==4&&Bn(this),this.o&&!this.J&&(Ke==4?Hc(this.j,this):(this.o=!1,Ti(this)))}else Hp(this.g),h==400&&0<B.indexOf("Unknown SID")?(this.s=3,ve(12)):(this.s=0,ve(13)),Bn(this),ps(this)}}}catch{}finally{}};function vc(o){return o.g?o.u=="GET"&&o.L!=2&&o.j.Ca:!1}function Rp(o,u){var h=o.C,p=u.indexOf(`
`,h);return p==-1?Jo:(h=Number(u.substring(h,p)),isNaN(h)?gc:(p+=1,p+h>u.length?Jo:(u=u.slice(p,p+h),o.C=p+h,u)))}on.prototype.cancel=function(){this.J=!0,Bn(this)};function Ti(o){o.S=Date.now()+o.I,_c(o,o.I)}function _c(o,u){if(o.B!=null)throw Error("WatchDog timer not null");o.B=ye(v(o.ba,o),u)}function Zo(o){o.B&&(l.clearTimeout(o.B),o.B=null)}on.prototype.ba=function(){this.B=null;const o=Date.now();0<=o-this.S?(On(this.i,this.A),this.L!=2&&(vt(),ve(17)),Bn(this),this.s=2,ps(this)):_c(this,this.S-o)};function ps(o){o.j.G==0||o.J||Hc(o.j,o)}function Bn(o){Zo(o);var u=o.M;u&&typeof u.ma=="function"&&u.ma(),o.M=null,_i(o.U),o.g&&(u=o.g,o.g=null,u.abort(),u.ma())}function ea(o,u){try{var h=o.j;if(h.G!=0&&(h.g==o||ta(h.h,o))){if(!o.K&&ta(h.h,o)&&h.G==3){try{var p=h.Da.g.parse(u)}catch{p=null}if(Array.isArray(p)&&p.length==3){var P=p;if(P[0]==0){e:if(!h.u){if(h.g)if(h.g.F+3e3<o.F)Di(h),Ci(h);else break e;ia(h),ve(18)}}else h.za=P[1],0<h.za-h.T&&37500>P[2]&&h.F&&h.v==0&&!h.C&&(h.C=ye(v(h.Za,h),6e3));if(1>=bc(h.h)&&h.ca){try{h.ca()}catch{}h.ca=void 0}}else zn(h,11)}else if((o.K||h.g==o)&&Di(h),!D(u))for(P=h.Da.g.parse(u),u=0;u<P.length;u++){let re=P[u];if(h.T=re[0],re=re[1],h.G==2)if(re[0]=="c"){h.K=re[1],h.ia=re[2];const Ge=re[3];Ge!=null&&(h.la=Ge,h.j.info("VER="+h.la));const Ke=re[4];Ke!=null&&(h.Aa=Ke,h.j.info("SVER="+h.Aa));const Ar=re[5];Ar!=null&&typeof Ar=="number"&&0<Ar&&(p=1.5*Ar,h.L=p,h.j.info("backChannelRequestTimeoutMs_="+p)),p=h;const wt=o.g;if(wt){const Ni=wt.g?wt.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Ni){var k=p.h;k.g||Ni.indexOf("spdy")==-1&&Ni.indexOf("quic")==-1&&Ni.indexOf("h2")==-1||(k.j=k.l,k.g=new Set,k.h&&(na(k,k.h),k.h=null))}if(p.D){const aa=wt.g?wt.g.getResponseHeader("X-HTTP-Session-Id"):null;aa&&(p.ya=aa,pe(p.I,p.D,aa))}}h.G=3,h.l&&h.l.ua(),h.ba&&(h.R=Date.now()-o.F,h.j.info("Handshake RTT: "+h.R+"ms")),p=h;var B=o;if(p.qa=Gc(p,p.J?p.ia:null,p.W),B.K){Tc(p.h,B);var he=B,Ue=p.L;Ue&&(he.I=Ue),he.B&&(Zo(he),Ti(he)),p.g=B}else qc(p);0<h.i.length&&ki(h)}else re[0]!="stop"&&re[0]!="close"||zn(h,7);else h.G==3&&(re[0]=="stop"||re[0]=="close"?re[0]=="stop"?zn(h,7):sa(h):re[0]!="noop"&&h.l&&h.l.ta(re),h.v=0)}}vt(4)}catch{}}var Pp=class{constructor(o,u){this.g=o,this.map=u}};function wc(o){this.l=o||10,l.PerformanceNavigationTiming?(o=l.performance.getEntriesByType("navigation"),o=0<o.length&&(o[0].nextHopProtocol=="hq"||o[0].nextHopProtocol=="h2")):o=!!(l.chrome&&l.chrome.loadTimes&&l.chrome.loadTimes()&&l.chrome.loadTimes().wasFetchedViaSpdy),this.j=o?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function Ec(o){return o.h?!0:o.g?o.g.size>=o.j:!1}function bc(o){return o.h?1:o.g?o.g.size:0}function ta(o,u){return o.h?o.h==u:o.g?o.g.has(u):!1}function na(o,u){o.g?o.g.add(u):o.h=u}function Tc(o,u){o.h&&o.h==u?o.h=null:o.g&&o.g.has(u)&&o.g.delete(u)}wc.prototype.cancel=function(){if(this.i=Ic(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const o of this.g.values())o.cancel();this.g.clear()}};function Ic(o){if(o.h!=null)return o.i.concat(o.h.D);if(o.g!=null&&o.g.size!==0){let u=o.i;for(const h of o.g.values())u=u.concat(h.D);return u}return x(o.i)}function Cp(o){if(o.V&&typeof o.V=="function")return o.V();if(typeof Map<"u"&&o instanceof Map||typeof Set<"u"&&o instanceof Set)return Array.from(o.values());if(typeof o=="string")return o.split("");if(c(o)){for(var u=[],h=o.length,p=0;p<h;p++)u.push(o[p]);return u}u=[],h=0;for(p in o)u[h++]=o[p];return u}function kp(o){if(o.na&&typeof o.na=="function")return o.na();if(!o.V||typeof o.V!="function"){if(typeof Map<"u"&&o instanceof Map)return Array.from(o.keys());if(!(typeof Set<"u"&&o instanceof Set)){if(c(o)||typeof o=="string"){var u=[];o=o.length;for(var h=0;h<o;h++)u.push(h);return u}u=[],h=0;for(const p in o)u[h++]=p;return u}}}function Sc(o,u){if(o.forEach&&typeof o.forEach=="function")o.forEach(u,void 0);else if(c(o)||typeof o=="string")Array.prototype.forEach.call(o,u,void 0);else for(var h=kp(o),p=Cp(o),P=p.length,k=0;k<P;k++)u.call(void 0,p[k],h&&h[k],o)}var Ac=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Dp(o,u){if(o){o=o.split("&");for(var h=0;h<o.length;h++){var p=o[h].indexOf("="),P=null;if(0<=p){var k=o[h].substring(0,p);P=o[h].substring(p+1)}else k=o[h];u(k,P?decodeURIComponent(P.replace(/\+/g," ")):"")}}}function Fn(o){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,o instanceof Fn){this.h=o.h,Ii(this,o.j),this.o=o.o,this.g=o.g,Si(this,o.s),this.l=o.l;var u=o.i,h=new ys;h.i=u.i,u.g&&(h.g=new Map(u.g),h.h=u.h),xc(this,h),this.m=o.m}else o&&(u=String(o).match(Ac))?(this.h=!1,Ii(this,u[1]||"",!0),this.o=ms(u[2]||""),this.g=ms(u[3]||"",!0),Si(this,u[4]),this.l=ms(u[5]||"",!0),xc(this,u[6]||"",!0),this.m=ms(u[7]||"")):(this.h=!1,this.i=new ys(null,this.h))}Fn.prototype.toString=function(){var o=[],u=this.j;u&&o.push(gs(u,Rc,!0),":");var h=this.g;return(h||u=="file")&&(o.push("//"),(u=this.o)&&o.push(gs(u,Rc,!0),"@"),o.push(encodeURIComponent(String(h)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),h=this.s,h!=null&&o.push(":",String(h))),(h=this.l)&&(this.g&&h.charAt(0)!="/"&&o.push("/"),o.push(gs(h,h.charAt(0)=="/"?Lp:Np,!0))),(h=this.i.toString())&&o.push("?",h),(h=this.m)&&o.push("#",gs(h,Vp)),o.join("")};function Ut(o){return new Fn(o)}function Ii(o,u,h){o.j=h?ms(u,!0):u,o.j&&(o.j=o.j.replace(/:$/,""))}function Si(o,u){if(u){if(u=Number(u),isNaN(u)||0>u)throw Error("Bad port number "+u);o.s=u}else o.s=null}function xc(o,u,h){u instanceof ys?(o.i=u,Bp(o.i,o.h)):(h||(u=gs(u,Op)),o.i=new ys(u,o.h))}function pe(o,u,h){o.i.set(u,h)}function Ai(o){return pe(o,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),o}function ms(o,u){return o?u?decodeURI(o.replace(/%25/g,"%2525")):decodeURIComponent(o):""}function gs(o,u,h){return typeof o=="string"?(o=encodeURI(o).replace(u,Mp),h&&(o=o.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),o):null}function Mp(o){return o=o.charCodeAt(0),"%"+(o>>4&15).toString(16)+(o&15).toString(16)}var Rc=/[#\/\?@]/g,Np=/[#\?:]/g,Lp=/[#\?]/g,Op=/[#\?@]/g,Vp=/#/g;function ys(o,u){this.h=this.g=null,this.i=o||null,this.j=!!u}function an(o){o.g||(o.g=new Map,o.h=0,o.i&&Dp(o.i,function(u,h){o.add(decodeURIComponent(u.replace(/\+/g," ")),h)}))}n=ys.prototype,n.add=function(o,u){an(this),this.i=null,o=Ir(this,o);var h=this.g.get(o);return h||this.g.set(o,h=[]),h.push(u),this.h+=1,this};function Pc(o,u){an(o),u=Ir(o,u),o.g.has(u)&&(o.i=null,o.h-=o.g.get(u).length,o.g.delete(u))}function Cc(o,u){return an(o),u=Ir(o,u),o.g.has(u)}n.forEach=function(o,u){an(this),this.g.forEach(function(h,p){h.forEach(function(P){o.call(u,P,p,this)},this)},this)},n.na=function(){an(this);const o=Array.from(this.g.values()),u=Array.from(this.g.keys()),h=[];for(let p=0;p<u.length;p++){const P=o[p];for(let k=0;k<P.length;k++)h.push(u[p])}return h},n.V=function(o){an(this);let u=[];if(typeof o=="string")Cc(this,o)&&(u=u.concat(this.g.get(Ir(this,o))));else{o=Array.from(this.g.values());for(let h=0;h<o.length;h++)u=u.concat(o[h])}return u},n.set=function(o,u){return an(this),this.i=null,o=Ir(this,o),Cc(this,o)&&(this.h-=this.g.get(o).length),this.g.set(o,[u]),this.h+=1,this},n.get=function(o,u){return o?(o=this.V(o),0<o.length?String(o[0]):u):u};function kc(o,u,h){Pc(o,u),0<h.length&&(o.i=null,o.g.set(Ir(o,u),x(h)),o.h+=h.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const o=[],u=Array.from(this.g.keys());for(var h=0;h<u.length;h++){var p=u[h];const k=encodeURIComponent(String(p)),B=this.V(p);for(p=0;p<B.length;p++){var P=k;B[p]!==""&&(P+="="+encodeURIComponent(String(B[p]))),o.push(P)}}return this.i=o.join("&")};function Ir(o,u){return u=String(u),o.j&&(u=u.toLowerCase()),u}function Bp(o,u){u&&!o.j&&(an(o),o.i=null,o.g.forEach(function(h,p){var P=p.toLowerCase();p!=P&&(Pc(this,p),kc(this,P,h))},o)),o.j=u}function Fp(o,u){const h=new Re;if(l.Image){const p=new Image;p.onload=E(ln,h,"TestLoadImage: loaded",!0,u,p),p.onerror=E(ln,h,"TestLoadImage: error",!1,u,p),p.onabort=E(ln,h,"TestLoadImage: abort",!1,u,p),p.ontimeout=E(ln,h,"TestLoadImage: timeout",!1,u,p),l.setTimeout(function(){p.ontimeout&&p.ontimeout()},1e4),p.src=o}else u(!1)}function zp(o,u){const h=new Re,p=new AbortController,P=setTimeout(()=>{p.abort(),ln(h,"TestPingServer: timeout",!1,u)},1e4);fetch(o,{signal:p.signal}).then(k=>{clearTimeout(P),k.ok?ln(h,"TestPingServer: ok",!0,u):ln(h,"TestPingServer: server error",!1,u)}).catch(()=>{clearTimeout(P),ln(h,"TestPingServer: error",!1,u)})}function ln(o,u,h,p,P){try{P&&(P.onload=null,P.onerror=null,P.onabort=null,P.ontimeout=null),p(h)}catch{}}function $p(){this.g=new ds}function Up(o,u,h){const p=h||"";try{Sc(o,function(P,k){let B=P;d(P)&&(B=us(P)),u.push(p+k+"="+encodeURIComponent(B))})}catch(P){throw u.push(p+"type="+encodeURIComponent("_badmap")),P}}function xi(o){this.l=o.Ub||null,this.j=o.eb||!1}T(xi,Nn),xi.prototype.g=function(){return new Ri(this.l,this.j)},xi.prototype.i=function(o){return function(){return o}}({});function Ri(o,u){ze.call(this),this.D=o,this.o=u,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}T(Ri,ze),n=Ri.prototype,n.open=function(o,u){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=o,this.A=u,this.readyState=1,_s(this)},n.send=function(o){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const u={headers:this.u,method:this.B,credentials:this.m,cache:void 0};o&&(u.body=o),(this.D||l).fetch(new Request(this.A,u)).then(this.Sa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,vs(this)),this.readyState=0},n.Sa=function(o){if(this.g&&(this.l=o,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=o.headers,this.readyState=2,_s(this)),this.g&&(this.readyState=3,_s(this),this.g)))if(this.responseType==="arraybuffer")o.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof l.ReadableStream<"u"&&"body"in o){if(this.j=o.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;Dc(this)}else o.text().then(this.Ra.bind(this),this.ga.bind(this))};function Dc(o){o.j.read().then(o.Pa.bind(o)).catch(o.ga.bind(o))}n.Pa=function(o){if(this.g){if(this.o&&o.value)this.response.push(o.value);else if(!this.o){var u=o.value?o.value:new Uint8Array(0);(u=this.v.decode(u,{stream:!o.done}))&&(this.response=this.responseText+=u)}o.done?vs(this):_s(this),this.readyState==3&&Dc(this)}},n.Ra=function(o){this.g&&(this.response=this.responseText=o,vs(this))},n.Qa=function(o){this.g&&(this.response=o,vs(this))},n.ga=function(){this.g&&vs(this)};function vs(o){o.readyState=4,o.l=null,o.j=null,o.v=null,_s(o)}n.setRequestHeader=function(o,u){this.u.append(o,u)},n.getResponseHeader=function(o){return this.h&&this.h.get(o.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const o=[],u=this.h.entries();for(var h=u.next();!h.done;)h=h.value,o.push(h[0]+": "+h[1]),h=u.next();return o.join(`\r
`)};function _s(o){o.onreadystatechange&&o.onreadystatechange.call(o)}Object.defineProperty(Ri.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(o){this.m=o?"include":"same-origin"}});function Mc(o){let u="";return V(o,function(h,p){u+=p,u+=":",u+=h,u+=`\r
`}),u}function ra(o,u,h){e:{for(p in h){var p=!1;break e}p=!0}p||(h=Mc(h),typeof o=="string"?h!=null&&encodeURIComponent(String(h)):pe(o,u,h))}function Te(o){ze.call(this),this.headers=new Map,this.o=o||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}T(Te,ze);var qp=/^https?$/i,jp=["POST","PUT"];n=Te.prototype,n.Ha=function(o){this.J=o},n.ea=function(o,u,h,p){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+o);u=u?u.toUpperCase():"GET",this.D=o,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():fs.g(),this.v=this.o?wi(this.o):wi(fs),this.g.onreadystatechange=v(this.Ea,this);try{this.B=!0,this.g.open(u,String(o),!0),this.B=!1}catch(k){Nc(this,k);return}if(o=h||"",h=new Map(this.headers),p)if(Object.getPrototypeOf(p)===Object.prototype)for(var P in p)h.set(P,p[P]);else if(typeof p.keys=="function"&&typeof p.get=="function")for(const k of p.keys())h.set(k,p.get(k));else throw Error("Unknown input type for opt_headers: "+String(p));p=Array.from(h.keys()).find(k=>k.toLowerCase()=="content-type"),P=l.FormData&&o instanceof l.FormData,!(0<=Array.prototype.indexOf.call(jp,u,void 0))||p||P||h.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[k,B]of h)this.g.setRequestHeader(k,B);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{Vc(this),this.u=!0,this.g.send(o),this.u=!1}catch(k){Nc(this,k)}};function Nc(o,u){o.h=!1,o.g&&(o.j=!0,o.g.abort(),o.j=!1),o.l=u,o.m=5,Lc(o),Pi(o)}function Lc(o){o.A||(o.A=!0,$e(o,"complete"),$e(o,"error"))}n.abort=function(o){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=o||7,$e(this,"complete"),$e(this,"abort"),Pi(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Pi(this,!0)),Te.aa.N.call(this)},n.Ea=function(){this.s||(this.B||this.u||this.j?Oc(this):this.bb())},n.bb=function(){Oc(this)};function Oc(o){if(o.h&&typeof a<"u"&&(!o.v[1]||qt(o)!=4||o.Z()!=2)){if(o.u&&qt(o)==4)Ft(o.Ea,0,o);else if($e(o,"readystatechange"),qt(o)==4){o.h=!1;try{const B=o.Z();e:switch(B){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var u=!0;break e;default:u=!1}var h;if(!(h=u)){var p;if(p=B===0){var P=String(o.D).match(Ac)[1]||null;!P&&l.self&&l.self.location&&(P=l.self.location.protocol.slice(0,-1)),p=!qp.test(P?P.toLowerCase():"")}h=p}if(h)$e(o,"complete"),$e(o,"success");else{o.m=6;try{var k=2<qt(o)?o.g.statusText:""}catch{k=""}o.l=k+" ["+o.Z()+"]",Lc(o)}}finally{Pi(o)}}}}function Pi(o,u){if(o.g){Vc(o);const h=o.g,p=o.v[0]?()=>{}:null;o.g=null,o.v=null,u||$e(o,"ready");try{h.onreadystatechange=p}catch{}}}function Vc(o){o.I&&(l.clearTimeout(o.I),o.I=null)}n.isActive=function(){return!!this.g};function qt(o){return o.g?o.g.readyState:0}n.Z=function(){try{return 2<qt(this)?this.g.status:-1}catch{return-1}},n.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.Oa=function(o){if(this.g){var u=this.g.responseText;return o&&u.indexOf(o)==0&&(u=u.substring(o.length)),wr(u)}};function Bc(o){try{if(!o.g)return null;if("response"in o.g)return o.g.response;switch(o.H){case"":case"text":return o.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in o.g)return o.g.mozResponseArrayBuffer}return null}catch{return null}}function Hp(o){const u={};o=(o.g&&2<=qt(o)&&o.g.getAllResponseHeaders()||"").split(`\r
`);for(let p=0;p<o.length;p++){if(D(o[p]))continue;var h=I(o[p]);const P=h[0];if(h=h[1],typeof h!="string")continue;h=h.trim();const k=u[P]||[];u[P]=k,k.push(h)}b(u,function(p){return p.join(", ")})}n.Ba=function(){return this.m},n.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function ws(o,u,h){return h&&h.internalChannelParams&&h.internalChannelParams[o]||u}function Fc(o){this.Aa=0,this.i=[],this.j=new Re,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=ws("failFast",!1,o),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=ws("baseRetryDelayMs",5e3,o),this.cb=ws("retryDelaySeedMs",1e4,o),this.Wa=ws("forwardChannelMaxRetries",2,o),this.wa=ws("forwardChannelRequestTimeoutMs",2e4,o),this.pa=o&&o.xmlHttpFactory||void 0,this.Xa=o&&o.Tb||void 0,this.Ca=o&&o.useFetchStreams||!1,this.L=void 0,this.J=o&&o.supportsCrossDomainXhr||!1,this.K="",this.h=new wc(o&&o.concurrentRequestLimit),this.Da=new $p,this.P=o&&o.fastHandshake||!1,this.O=o&&o.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=o&&o.Rb||!1,o&&o.xa&&this.j.xa(),o&&o.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&o&&o.detectBufferingProxy||!1,this.ja=void 0,o&&o.longPollingTimeout&&0<o.longPollingTimeout&&(this.ja=o.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}n=Fc.prototype,n.la=8,n.G=1,n.connect=function(o,u,h,p){ve(0),this.W=o,this.H=u||{},h&&p!==void 0&&(this.H.OSID=h,this.H.OAID=p),this.F=this.X,this.I=Gc(this,null,this.W),ki(this)};function sa(o){if(zc(o),o.G==3){var u=o.U++,h=Ut(o.I);if(pe(h,"SID",o.K),pe(h,"RID",u),pe(h,"TYPE","terminate"),Es(o,h),u=new on(o,o.j,u),u.L=2,u.v=Ai(Ut(h)),h=!1,l.navigator&&l.navigator.sendBeacon)try{h=l.navigator.sendBeacon(u.v.toString(),"")}catch{}!h&&l.Image&&(new Image().src=u.v,h=!0),h||(u.g=Kc(u.j,null),u.g.ea(u.v)),u.F=Date.now(),Ti(u)}Yc(o)}function Ci(o){o.g&&(oa(o),o.g.cancel(),o.g=null)}function zc(o){Ci(o),o.u&&(l.clearTimeout(o.u),o.u=null),Di(o),o.h.cancel(),o.s&&(typeof o.s=="number"&&l.clearTimeout(o.s),o.s=null)}function ki(o){if(!Ec(o.h)&&!o.s){o.s=!0;var u=o.Ga;xe||Oe(),ue||(xe(),ue=!0),fe.add(u,o),o.B=0}}function Wp(o,u){return bc(o.h)>=o.h.j-(o.s?1:0)?!1:o.s?(o.i=u.D.concat(o.i),!0):o.G==1||o.G==2||o.B>=(o.Va?0:o.Wa)?!1:(o.s=ye(v(o.Ga,o,u),Wc(o,o.B)),o.B++,!0)}n.Ga=function(o){if(this.s)if(this.s=null,this.G==1){if(!o){this.U=Math.floor(1e5*Math.random()),o=this.U++;const P=new on(this,this.j,o);let k=this.o;if(this.S&&(k?(k=g(k),_(k,this.S)):k=this.S),this.m!==null||this.O||(P.H=k,k=null),this.P)e:{for(var u=0,h=0;h<this.i.length;h++){t:{var p=this.i[h];if("__data__"in p.map&&(p=p.map.__data__,typeof p=="string")){p=p.length;break t}p=void 0}if(p===void 0)break;if(u+=p,4096<u){u=h;break e}if(u===4096||h===this.i.length-1){u=h+1;break e}}u=1e3}else u=1e3;u=Uc(this,P,u),h=Ut(this.I),pe(h,"RID",o),pe(h,"CVER",22),this.D&&pe(h,"X-HTTP-Session-Id",this.D),Es(this,h),k&&(this.O?u="headers="+encodeURIComponent(String(Mc(k)))+"&"+u:this.m&&ra(h,this.m,k)),na(this.h,P),this.Ua&&pe(h,"TYPE","init"),this.P?(pe(h,"$req",u),pe(h,"SID","null"),P.T=!0,Xo(P,h,null)):Xo(P,h,u),this.G=2}}else this.G==3&&(o?$c(this,o):this.i.length==0||Ec(this.h)||$c(this))};function $c(o,u){var h;u?h=u.l:h=o.U++;const p=Ut(o.I);pe(p,"SID",o.K),pe(p,"RID",h),pe(p,"AID",o.T),Es(o,p),o.m&&o.o&&ra(p,o.m,o.o),h=new on(o,o.j,h,o.B+1),o.m===null&&(h.H=o.o),u&&(o.i=u.D.concat(o.i)),u=Uc(o,h,1e3),h.I=Math.round(.5*o.wa)+Math.round(.5*o.wa*Math.random()),na(o.h,h),Xo(h,p,u)}function Es(o,u){o.H&&V(o.H,function(h,p){pe(u,p,h)}),o.l&&Sc({},function(h,p){pe(u,p,h)})}function Uc(o,u,h){h=Math.min(o.i.length,h);var p=o.l?v(o.l.Na,o.l,o):null;e:{var P=o.i;let k=-1;for(;;){const B=["count="+h];k==-1?0<h?(k=P[0].g,B.push("ofs="+k)):k=0:B.push("ofs="+k);let he=!0;for(let Ue=0;Ue<h;Ue++){let re=P[Ue].g;const Ge=P[Ue].map;if(re-=k,0>re)k=Math.max(0,P[Ue].g-100),he=!1;else try{Up(Ge,B,"req"+re+"_")}catch{p&&p(Ge)}}if(he){p=B.join("&");break e}}}return o=o.i.splice(0,h),u.D=o,p}function qc(o){if(!o.g&&!o.u){o.Y=1;var u=o.Fa;xe||Oe(),ue||(xe(),ue=!0),fe.add(u,o),o.v=0}}function ia(o){return o.g||o.u||3<=o.v?!1:(o.Y++,o.u=ye(v(o.Fa,o),Wc(o,o.v)),o.v++,!0)}n.Fa=function(){if(this.u=null,jc(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var o=2*this.R;this.j.info("BP detection timer enabled: "+o),this.A=ye(v(this.ab,this),o)}},n.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,ve(10),Ci(this),jc(this))};function oa(o){o.A!=null&&(l.clearTimeout(o.A),o.A=null)}function jc(o){o.g=new on(o,o.j,"rpc",o.Y),o.m===null&&(o.g.H=o.o),o.g.O=0;var u=Ut(o.qa);pe(u,"RID","rpc"),pe(u,"SID",o.K),pe(u,"AID",o.T),pe(u,"CI",o.F?"0":"1"),!o.F&&o.ja&&pe(u,"TO",o.ja),pe(u,"TYPE","xmlhttp"),Es(o,u),o.m&&o.o&&ra(u,o.m,o.o),o.L&&(o.g.I=o.L);var h=o.g;o=o.ia,h.L=1,h.v=Ai(Ut(u)),h.m=null,h.P=!0,yc(h,o)}n.Za=function(){this.C!=null&&(this.C=null,Ci(this),ia(this),ve(19))};function Di(o){o.C!=null&&(l.clearTimeout(o.C),o.C=null)}function Hc(o,u){var h=null;if(o.g==u){Di(o),oa(o),o.g=null;var p=2}else if(ta(o.h,u))h=u.D,Tc(o.h,u),p=1;else return;if(o.G!=0){if(u.o)if(p==1){h=u.m?u.m.length:0,u=Date.now()-u.F;var P=o.B;p=ge(),$e(p,new Se(p,h)),ki(o)}else qc(o);else if(P=u.s,P==3||P==0&&0<u.X||!(p==1&&Wp(o,u)||p==2&&ia(o)))switch(h&&0<h.length&&(u=o.h,u.i=u.i.concat(h)),P){case 1:zn(o,5);break;case 4:zn(o,10);break;case 3:zn(o,6);break;default:zn(o,2)}}}function Wc(o,u){let h=o.Ta+Math.floor(Math.random()*o.cb);return o.isActive()||(h*=2),h*u}function zn(o,u){if(o.j.info("Error code "+u),u==2){var h=v(o.fb,o),p=o.Xa;const P=!p;p=new Fn(p||"//www.google.com/images/cleardot.gif"),l.location&&l.location.protocol=="http"||Ii(p,"https"),Ai(p),P?Fp(p.toString(),h):zp(p.toString(),h)}else ve(2);o.G=0,o.l&&o.l.sa(u),Yc(o),zc(o)}n.fb=function(o){o?(this.j.info("Successfully pinged google.com"),ve(2)):(this.j.info("Failed to ping google.com"),ve(1))};function Yc(o){if(o.G=0,o.ka=[],o.l){const u=Ic(o.h);(u.length!=0||o.i.length!=0)&&(R(o.ka,u),R(o.ka,o.i),o.h.i.length=0,x(o.i),o.i.length=0),o.l.ra()}}function Gc(o,u,h){var p=h instanceof Fn?Ut(h):new Fn(h);if(p.g!="")u&&(p.g=u+"."+p.g),Si(p,p.s);else{var P=l.location;p=P.protocol,u=u?u+"."+P.hostname:P.hostname,P=+P.port;var k=new Fn(null);p&&Ii(k,p),u&&(k.g=u),P&&Si(k,P),h&&(k.l=h),p=k}return h=o.D,u=o.ya,h&&u&&pe(p,h,u),pe(p,"VER",o.la),Es(o,p),p}function Kc(o,u,h){if(u&&!o.J)throw Error("Can't create secondary domain capable XhrIo object.");return u=o.Ca&&!o.pa?new Te(new xi({eb:h})):new Te(o.pa),u.Ha(o.J),u}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function Qc(){}n=Qc.prototype,n.ua=function(){},n.ta=function(){},n.sa=function(){},n.ra=function(){},n.isActive=function(){return!0},n.Na=function(){};function Mi(){}Mi.prototype.g=function(o,u){return new ot(o,u)};function ot(o,u){ze.call(this),this.g=new Fc(u),this.l=o,this.h=u&&u.messageUrlParams||null,o=u&&u.messageHeaders||null,u&&u.clientProtocolHeaderRequired&&(o?o["X-Client-Protocol"]="webchannel":o={"X-Client-Protocol":"webchannel"}),this.g.o=o,o=u&&u.initMessageHeaders||null,u&&u.messageContentType&&(o?o["X-WebChannel-Content-Type"]=u.messageContentType:o={"X-WebChannel-Content-Type":u.messageContentType}),u&&u.va&&(o?o["X-WebChannel-Client-Profile"]=u.va:o={"X-WebChannel-Client-Profile":u.va}),this.g.S=o,(o=u&&u.Sb)&&!D(o)&&(this.g.m=o),this.v=u&&u.supportsCrossDomainXhr||!1,this.u=u&&u.sendRawJson||!1,(u=u&&u.httpSessionIdParam)&&!D(u)&&(this.g.D=u,o=this.h,o!==null&&u in o&&(o=this.h,u in o&&delete o[u])),this.j=new Sr(this)}T(ot,ze),ot.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},ot.prototype.close=function(){sa(this.g)},ot.prototype.o=function(o){var u=this.g;if(typeof o=="string"){var h={};h.__data__=o,o=h}else this.u&&(h={},h.__data__=us(o),o=h);u.i.push(new Pp(u.Ya++,o)),u.G==3&&ki(u)},ot.prototype.N=function(){this.g.l=null,delete this.j,sa(this.g),delete this.g,ot.aa.N.call(this)};function Jc(o){Er.call(this),o.__headers__&&(this.headers=o.__headers__,this.statusCode=o.__status__,delete o.__headers__,delete o.__status__);var u=o.__sm__;if(u){e:{for(const h in u){o=h;break e}o=void 0}(this.i=o)&&(o=this.i,u=u!==null&&o in u?u[o]:void 0),this.data=u}else this.data=o}T(Jc,Er);function Xc(){br.call(this),this.status=1}T(Xc,br);function Sr(o){this.g=o}T(Sr,Qc),Sr.prototype.ua=function(){$e(this.g,"a")},Sr.prototype.ta=function(o){$e(this.g,new Jc(o))},Sr.prototype.sa=function(o){$e(this.g,new Xc)},Sr.prototype.ra=function(){$e(this.g,"b")},Mi.prototype.createWebChannel=Mi.prototype.g,ot.prototype.send=ot.prototype.o,ot.prototype.open=ot.prototype.m,ot.prototype.close=ot.prototype.close,Ph=function(){return new Mi},Rh=function(){return ge()},xh=J,Oa={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},Vn.NO_ERROR=0,Vn.TIMEOUT=8,Vn.HTTP_ERROR=6,Hi=Vn,Ei.COMPLETE="complete",Ah=Ei,hs.EventType=sn,sn.OPEN="a",sn.CLOSE="b",sn.ERROR="c",sn.MESSAGE="d",ze.prototype.listen=ze.prototype.K,xs=hs,Te.prototype.listenOnce=Te.prototype.L,Te.prototype.getLastError=Te.prototype.Ka,Te.prototype.getLastErrorCode=Te.prototype.Ba,Te.prototype.getStatus=Te.prototype.Z,Te.prototype.getResponseJson=Te.prototype.Oa,Te.prototype.getResponseText=Te.prototype.oa,Te.prototype.send=Te.prototype.ea,Te.prototype.setWithCredentials=Te.prototype.Ha,Sh=Te}).apply(typeof Vi<"u"?Vi:typeof self<"u"?self:typeof window<"u"?window:{});const ku="@firebase/firestore";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Je{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Je.UNAUTHENTICATED=new Je(null),Je.GOOGLE_CREDENTIALS=new Je("google-credentials-uid"),Je.FIRST_PARTY=new Je("first-party-uid"),Je.MOCK_USER=new Je("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let es="10.14.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jn=new sl("@firebase/firestore");function Ts(){return Jn.logLevel}function $(n,...e){if(Jn.logLevel<=te.DEBUG){const t=e.map(vl);Jn.debug(`Firestore (${es}): ${n}`,...t)}}function Xt(n,...e){if(Jn.logLevel<=te.ERROR){const t=e.map(vl);Jn.error(`Firestore (${es}): ${n}`,...t)}}function qr(n,...e){if(Jn.logLevel<=te.WARN){const t=e.map(vl);Jn.warn(`Firestore (${es}): ${n}`,...t)}}function vl(n){if(typeof n=="string")return n;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
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
 */function Y(n="Unexpected state"){const e=`FIRESTORE (${es}) INTERNAL ASSERTION FAILED: `+n;throw Xt(e),new Error(e)}function le(n,e){n||Y()}function K(n,e){return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const M={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class z extends en{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class Ch{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class a0{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(Je.UNAUTHENTICATED))}shutdown(){}}class l0{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class c0{constructor(e){this.t=e,this.currentUser=Je.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){le(this.o===void 0);let r=this.i;const s=c=>this.i!==r?(r=this.i,t(c)):Promise.resolve();let i=new Kt;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new Kt,e.enqueueRetryable(()=>s(this.currentUser))};const a=()=>{const c=i;e.enqueueRetryable(async()=>{await c.promise,await s(this.currentUser)})},l=c=>{$("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=c,this.o&&(this.auth.addAuthTokenListener(this.o),a())};this.t.onInit(c=>l(c)),setTimeout(()=>{if(!this.auth){const c=this.t.getImmediate({optional:!0});c?l(c):($("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new Kt)}},0),a()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(r=>this.i!==e?($("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(le(typeof r.accessToken=="string"),new Ch(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return le(e===null||typeof e=="string"),new Je(e)}}class u0{constructor(e,t,r){this.l=e,this.h=t,this.P=r,this.type="FirstParty",this.user=Je.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class d0{constructor(e,t,r){this.l=e,this.h=t,this.P=r}getToken(){return Promise.resolve(new u0(this.l,this.h,this.P))}start(e,t){e.enqueueRetryable(()=>t(Je.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class h0{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class f0{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,t){le(this.o===void 0);const r=i=>{i.error!=null&&$("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const a=i.token!==this.R;return this.R=i.token,$("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?t(i.token):Promise.resolve()};this.o=i=>{e.enqueueRetryable(()=>r(i))};const s=i=>{$("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(i=>s(i)),setTimeout(()=>{if(!this.appCheck){const i=this.A.getImmediate({optional:!0});i?s(i):$("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(t=>t?(le(typeof t.token=="string"),this.R=t.token,new h0(t.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function p0(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let r=0;r<n;r++)t[r]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kh{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=Math.floor(256/e.length)*e.length;let r="";for(;r.length<20;){const s=p0(40);for(let i=0;i<s.length;++i)r.length<20&&s[i]<t&&(r+=e.charAt(s[i]%e.length))}return r}}function se(n,e){return n<e?-1:n>e?1:0}function jr(n,e,t){return n.length===e.length&&n.every((r,s)=>t(r,e[s]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Le{constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new z(M.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new z(M.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<-62135596800)throw new z(M.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new z(M.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return Le.fromMillis(Date.now())}static fromDate(e){return Le.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),r=Math.floor(1e6*(e-1e3*t));return new Le(t,r)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?se(this.nanoseconds,e.nanoseconds):se(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class G{constructor(e){this.timestamp=e}static fromTimestamp(e){return new G(e)}static min(){return new G(new Le(0,0))}static max(){return new G(new Le(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qs{constructor(e,t,r){t===void 0?t=0:t>e.length&&Y(),r===void 0?r=e.length-t:r>e.length-t&&Y(),this.segments=e,this.offset=t,this.len=r}get length(){return this.len}isEqual(e){return qs.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof qs?e.forEach(r=>{t.push(r)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,r=this.limit();t<r;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const r=Math.min(e.length,t.length);for(let s=0;s<r;s++){const i=e.get(s),a=t.get(s);if(i<a)return-1;if(i>a)return 1}return e.length<t.length?-1:e.length>t.length?1:0}}class me extends qs{construct(e,t,r){return new me(e,t,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const r of e){if(r.indexOf("//")>=0)throw new z(M.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);t.push(...r.split("/").filter(s=>s.length>0))}return new me(t)}static emptyPath(){return new me([])}}const m0=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class je extends qs{construct(e,t,r){return new je(e,t,r)}static isValidIdentifier(e){return m0.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),je.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new je(["__name__"])}static fromServerFormat(e){const t=[];let r="",s=0;const i=()=>{if(r.length===0)throw new z(M.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(r),r=""};let a=!1;for(;s<e.length;){const l=e[s];if(l==="\\"){if(s+1===e.length)throw new z(M.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const c=e[s+1];if(c!=="\\"&&c!=="."&&c!=="`")throw new z(M.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=c,s+=2}else l==="`"?(a=!a,s++):l!=="."||a?(r+=l,s++):(i(),s++)}if(i(),a)throw new z(M.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new je(t)}static emptyPath(){return new je([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class q{constructor(e){this.path=e}static fromPath(e){return new q(me.fromString(e))}static fromName(e){return new q(me.fromString(e).popFirst(5))}static empty(){return new q(me.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&me.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return me.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new q(new me(e.slice()))}}function g0(n,e){const t=n.toTimestamp().seconds,r=n.toTimestamp().nanoseconds+1,s=G.fromTimestamp(r===1e9?new Le(t+1,0):new Le(t,r));return new Tn(s,q.empty(),e)}function y0(n){return new Tn(n.readTime,n.key,-1)}class Tn{constructor(e,t,r){this.readTime=e,this.documentKey=t,this.largestBatchId=r}static min(){return new Tn(G.min(),q.empty(),-1)}static max(){return new Tn(G.max(),q.empty(),-1)}}function v0(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=q.comparator(n.documentKey,e.documentKey),t!==0?t:se(n.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _0="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class w0{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ii(n){if(n.code!==M.FAILED_PRECONDITION||n.message!==_0)throw n;$("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class L{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)},t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&Y(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new L((r,s)=>{this.nextCallback=i=>{this.wrapSuccess(e,i).next(r,s)},this.catchCallback=i=>{this.wrapFailure(t,i).next(r,s)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{const t=e();return t instanceof L?t:L.resolve(t)}catch(t){return L.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):L.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):L.reject(t)}static resolve(e){return new L((t,r)=>{t(e)})}static reject(e){return new L((t,r)=>{r(e)})}static waitFor(e){return new L((t,r)=>{let s=0,i=0,a=!1;e.forEach(l=>{++s,l.next(()=>{++i,a&&i===s&&t()},c=>r(c))}),a=!0,i===s&&t()})}static or(e){let t=L.resolve(!1);for(const r of e)t=t.next(s=>s?L.resolve(s):r());return t}static forEach(e,t){const r=[];return e.forEach((s,i)=>{r.push(t.call(this,s,i))}),this.waitFor(r)}static mapArray(e,t){return new L((r,s)=>{const i=e.length,a=new Array(i);let l=0;for(let c=0;c<i;c++){const d=c;t(e[d]).next(f=>{a[d]=f,++l,l===i&&r(a)},f=>s(f))}})}static doWhile(e,t){return new L((r,s)=>{const i=()=>{e()===!0?t().next(()=>{i()},s):r()};i()})}}function E0(n){const e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function oi(n){return n.name==="IndexedDbTransactionError"}/**
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
 */class _l{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=r=>this.ie(r),this.se=r=>t.writeSequenceNumber(r))}ie(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.se&&this.se(e),e}}_l.oe=-1;function So(n){return n==null}function ao(n){return n===0&&1/n==-1/0}function b0(n){return typeof n=="number"&&Number.isInteger(n)&&!ao(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Du(n){let e=0;for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function rr(n,e){for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function Dh(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _e{constructor(e,t){this.comparator=e,this.root=t||qe.EMPTY}insert(e,t){return new _e(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,qe.BLACK,null,null))}remove(e){return new _e(this.comparator,this.root.remove(e,this.comparator).copy(null,null,qe.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const r=this.comparator(e,t.key);if(r===0)return t.value;r<0?t=t.left:r>0&&(t=t.right)}return null}indexOf(e){let t=0,r=this.root;for(;!r.isEmpty();){const s=this.comparator(e,r.key);if(s===0)return t+r.left.size;s<0?r=r.left:(t+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,r)=>(e(t,r),!1))}toString(){const e=[];return this.inorderTraversal((t,r)=>(e.push(`${t}:${r}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Bi(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Bi(this.root,e,this.comparator,!1)}getReverseIterator(){return new Bi(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Bi(this.root,e,this.comparator,!0)}}class Bi{constructor(e,t,r,s){this.isReverse=s,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?r(e.key,t):1,t&&s&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class qe{constructor(e,t,r,s,i){this.key=e,this.value=t,this.color=r??qe.RED,this.left=s??qe.EMPTY,this.right=i??qe.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,r,s,i){return new qe(e??this.key,t??this.value,r??this.color,s??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,r){let s=this;const i=r(e,s.key);return s=i<0?s.copy(null,null,null,s.left.insert(e,t,r),null):i===0?s.copy(null,t,null,null,null):s.copy(null,null,null,null,s.right.insert(e,t,r)),s.fixUp()}removeMin(){if(this.left.isEmpty())return qe.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let r,s=this;if(t(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),t(e,s.key)===0){if(s.right.isEmpty())return qe.EMPTY;r=s.right.min(),s=s.copy(r.key,r.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,qe.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,qe.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw Y();const e=this.left.check();if(e!==this.right.check())throw Y();return e+(this.isRed()?0:1)}}qe.EMPTY=null,qe.RED=!0,qe.BLACK=!1;qe.EMPTY=new class{constructor(){this.size=0}get key(){throw Y()}get value(){throw Y()}get color(){throw Y()}get left(){throw Y()}get right(){throw Y()}copy(e,t,r,s,i){return this}insert(e,t,r){return new qe(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class We{constructor(e){this.comparator=e,this.data=new _e(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,r)=>(e(t),!1))}forEachInRange(e,t){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const s=r.getNext();if(this.comparator(s.key,e[1])>=0)return;t(s.key)}}forEachWhile(e,t){let r;for(r=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Mu(this.data.getIterator())}getIteratorFrom(e){return new Mu(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(r=>{t=t.add(r)}),t}isEqual(e){if(!(e instanceof We)||this.size!==e.size)return!1;const t=this.data.getIterator(),r=e.data.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=r.getNext().key;if(this.comparator(s,i)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(t=>{e.push(t)}),e}toString(){const e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){const t=new We(this.comparator);return t.data=e,t}}class Mu{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lt{constructor(e){this.fields=e,e.sort(je.comparator)}static empty(){return new lt([])}unionWith(e){let t=new We(je.comparator);for(const r of this.fields)t=t.add(r);for(const r of e)t=t.add(r);return new lt(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return jr(this.fields,e.fields,(t,r)=>t.isEqual(r))}}/**
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
 */class Mh extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ye{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(s){try{return atob(s)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new Mh("Invalid base64 string: "+i):i}}(e);return new Ye(t)}static fromUint8Array(e){const t=function(s){let i="";for(let a=0;a<s.length;++a)i+=String.fromCharCode(s[a]);return i}(e);return new Ye(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(t){return btoa(t)}(this.binaryString)}toUint8Array(){return function(t){const r=new Uint8Array(t.length);for(let s=0;s<t.length;s++)r[s]=t.charCodeAt(s);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return se(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}Ye.EMPTY_BYTE_STRING=new Ye("");const T0=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function In(n){if(le(!!n),typeof n=="string"){let e=0;const t=T0.exec(n);if(le(!!t),t[1]){let s=t[1];s=(s+"000000000").substr(0,9),e=Number(s)}const r=new Date(n);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:Ae(n.seconds),nanos:Ae(n.nanos)}}function Ae(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function Xn(n){return typeof n=="string"?Ye.fromBase64String(n):Ye.fromUint8Array(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wl(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="server_timestamp"}function El(n){const e=n.mapValue.fields.__previous_value__;return wl(e)?El(e):e}function js(n){const e=In(n.mapValue.fields.__local_write_time__.timestampValue);return new Le(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class I0{constructor(e,t,r,s,i,a,l,c,d){this.databaseId=e,this.appId=t,this.persistenceKey=r,this.host=s,this.ssl=i,this.forceLongPolling=a,this.autoDetectLongPolling=l,this.longPollingOptions=c,this.useFetchStreams=d}}class Hs{constructor(e,t){this.projectId=e,this.database=t||"(default)"}static empty(){return new Hs("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof Hs&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fi={mapValue:{}};function Zn(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?wl(n)?4:A0(n)?9007199254740991:S0(n)?10:11:Y()}function Mt(n,e){if(n===e)return!0;const t=Zn(n);if(t!==Zn(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return js(n).isEqual(js(e));case 3:return function(s,i){if(typeof s.timestampValue=="string"&&typeof i.timestampValue=="string"&&s.timestampValue.length===i.timestampValue.length)return s.timestampValue===i.timestampValue;const a=In(s.timestampValue),l=In(i.timestampValue);return a.seconds===l.seconds&&a.nanos===l.nanos}(n,e);case 5:return n.stringValue===e.stringValue;case 6:return function(s,i){return Xn(s.bytesValue).isEqual(Xn(i.bytesValue))}(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return function(s,i){return Ae(s.geoPointValue.latitude)===Ae(i.geoPointValue.latitude)&&Ae(s.geoPointValue.longitude)===Ae(i.geoPointValue.longitude)}(n,e);case 2:return function(s,i){if("integerValue"in s&&"integerValue"in i)return Ae(s.integerValue)===Ae(i.integerValue);if("doubleValue"in s&&"doubleValue"in i){const a=Ae(s.doubleValue),l=Ae(i.doubleValue);return a===l?ao(a)===ao(l):isNaN(a)&&isNaN(l)}return!1}(n,e);case 9:return jr(n.arrayValue.values||[],e.arrayValue.values||[],Mt);case 10:case 11:return function(s,i){const a=s.mapValue.fields||{},l=i.mapValue.fields||{};if(Du(a)!==Du(l))return!1;for(const c in a)if(a.hasOwnProperty(c)&&(l[c]===void 0||!Mt(a[c],l[c])))return!1;return!0}(n,e);default:return Y()}}function Ws(n,e){return(n.values||[]).find(t=>Mt(t,e))!==void 0}function Hr(n,e){if(n===e)return 0;const t=Zn(n),r=Zn(e);if(t!==r)return se(t,r);switch(t){case 0:case 9007199254740991:return 0;case 1:return se(n.booleanValue,e.booleanValue);case 2:return function(i,a){const l=Ae(i.integerValue||i.doubleValue),c=Ae(a.integerValue||a.doubleValue);return l<c?-1:l>c?1:l===c?0:isNaN(l)?isNaN(c)?0:-1:1}(n,e);case 3:return Nu(n.timestampValue,e.timestampValue);case 4:return Nu(js(n),js(e));case 5:return se(n.stringValue,e.stringValue);case 6:return function(i,a){const l=Xn(i),c=Xn(a);return l.compareTo(c)}(n.bytesValue,e.bytesValue);case 7:return function(i,a){const l=i.split("/"),c=a.split("/");for(let d=0;d<l.length&&d<c.length;d++){const f=se(l[d],c[d]);if(f!==0)return f}return se(l.length,c.length)}(n.referenceValue,e.referenceValue);case 8:return function(i,a){const l=se(Ae(i.latitude),Ae(a.latitude));return l!==0?l:se(Ae(i.longitude),Ae(a.longitude))}(n.geoPointValue,e.geoPointValue);case 9:return Lu(n.arrayValue,e.arrayValue);case 10:return function(i,a){var l,c,d,f;const m=i.fields||{},v=a.fields||{},E=(l=m.value)===null||l===void 0?void 0:l.arrayValue,T=(c=v.value)===null||c===void 0?void 0:c.arrayValue,x=se(((d=E==null?void 0:E.values)===null||d===void 0?void 0:d.length)||0,((f=T==null?void 0:T.values)===null||f===void 0?void 0:f.length)||0);return x!==0?x:Lu(E,T)}(n.mapValue,e.mapValue);case 11:return function(i,a){if(i===Fi.mapValue&&a===Fi.mapValue)return 0;if(i===Fi.mapValue)return 1;if(a===Fi.mapValue)return-1;const l=i.fields||{},c=Object.keys(l),d=a.fields||{},f=Object.keys(d);c.sort(),f.sort();for(let m=0;m<c.length&&m<f.length;++m){const v=se(c[m],f[m]);if(v!==0)return v;const E=Hr(l[c[m]],d[f[m]]);if(E!==0)return E}return se(c.length,f.length)}(n.mapValue,e.mapValue);default:throw Y()}}function Nu(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return se(n,e);const t=In(n),r=In(e),s=se(t.seconds,r.seconds);return s!==0?s:se(t.nanos,r.nanos)}function Lu(n,e){const t=n.values||[],r=e.values||[];for(let s=0;s<t.length&&s<r.length;++s){const i=Hr(t[s],r[s]);if(i)return i}return se(t.length,r.length)}function Wr(n){return Va(n)}function Va(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?function(t){const r=In(t);return`time(${r.seconds},${r.nanos})`}(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?function(t){return Xn(t).toBase64()}(n.bytesValue):"referenceValue"in n?function(t){return q.fromName(t).toString()}(n.referenceValue):"geoPointValue"in n?function(t){return`geo(${t.latitude},${t.longitude})`}(n.geoPointValue):"arrayValue"in n?function(t){let r="[",s=!0;for(const i of t.values||[])s?s=!1:r+=",",r+=Va(i);return r+"]"}(n.arrayValue):"mapValue"in n?function(t){const r=Object.keys(t.fields||{}).sort();let s="{",i=!0;for(const a of r)i?i=!1:s+=",",s+=`${a}:${Va(t.fields[a])}`;return s+"}"}(n.mapValue):Y()}function Ou(n,e){return{referenceValue:`projects/${n.projectId}/databases/${n.database}/documents/${e.path.canonicalString()}`}}function Ba(n){return!!n&&"integerValue"in n}function bl(n){return!!n&&"arrayValue"in n}function Vu(n){return!!n&&"nullValue"in n}function Bu(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function Wi(n){return!!n&&"mapValue"in n}function S0(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="__vector__"}function Ds(n){if(n.geoPointValue)return{geoPointValue:Object.assign({},n.geoPointValue)};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:Object.assign({},n.timestampValue)};if(n.mapValue){const e={mapValue:{fields:{}}};return rr(n.mapValue.fields,(t,r)=>e.mapValue.fields[t]=Ds(r)),e}if(n.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Ds(n.arrayValue.values[t]);return e}return Object.assign({},n)}function A0(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rt{constructor(e){this.value=e}static empty(){return new rt({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let r=0;r<e.length-1;++r)if(t=(t.mapValue.fields||{})[e.get(r)],!Wi(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Ds(t)}setAll(e){let t=je.emptyPath(),r={},s=[];e.forEach((a,l)=>{if(!t.isImmediateParentOf(l)){const c=this.getFieldsMap(t);this.applyChanges(c,r,s),r={},s=[],t=l.popLast()}a?r[l.lastSegment()]=Ds(a):s.push(l.lastSegment())});const i=this.getFieldsMap(t);this.applyChanges(i,r,s)}delete(e){const t=this.field(e.popLast());Wi(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return Mt(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let r=0;r<e.length;++r){let s=t.mapValue.fields[e.get(r)];Wi(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},t.mapValue.fields[e.get(r)]=s),t=s}return t.mapValue.fields}applyChanges(e,t,r){rr(t,(s,i)=>e[s]=i);for(const s of r)delete e[s]}clone(){return new rt(Ds(this.value))}}function Nh(n){const e=[];return rr(n.fields,(t,r)=>{const s=new je([t]);if(Wi(r)){const i=Nh(r.mapValue).fields;if(i.length===0)e.push(s);else for(const a of i)e.push(s.child(a))}else e.push(s)}),new lt(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ze{constructor(e,t,r,s,i,a,l){this.key=e,this.documentType=t,this.version=r,this.readTime=s,this.createTime=i,this.data=a,this.documentState=l}static newInvalidDocument(e){return new Ze(e,0,G.min(),G.min(),G.min(),rt.empty(),0)}static newFoundDocument(e,t,r,s){return new Ze(e,1,t,G.min(),r,s,0)}static newNoDocument(e,t){return new Ze(e,2,t,G.min(),G.min(),rt.empty(),0)}static newUnknownDocument(e,t){return new Ze(e,3,t,G.min(),G.min(),rt.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(G.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=rt.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=rt.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=G.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof Ze&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Ze(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class lo{constructor(e,t){this.position=e,this.inclusive=t}}function Fu(n,e,t){let r=0;for(let s=0;s<n.position.length;s++){const i=e[s],a=n.position[s];if(i.field.isKeyField()?r=q.comparator(q.fromName(a.referenceValue),t.key):r=Hr(a,t.data.field(i.field)),i.dir==="desc"&&(r*=-1),r!==0)break}return r}function zu(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!Mt(n.position[t],e.position[t]))return!1;return!0}/**
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
 */class Ys{constructor(e,t="asc"){this.field=e,this.dir=t}}function x0(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}/**
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
 */class Lh{}class ke extends Lh{constructor(e,t,r){super(),this.field=e,this.op=t,this.value=r}static create(e,t,r){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,r):new P0(e,t,r):t==="array-contains"?new D0(e,r):t==="in"?new M0(e,r):t==="not-in"?new N0(e,r):t==="array-contains-any"?new L0(e,r):new ke(e,t,r)}static createKeyFieldInFilter(e,t,r){return t==="in"?new C0(e,r):new k0(e,r)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&this.matchesComparison(Hr(t,this.value)):t!==null&&Zn(this.value)===Zn(t)&&this.matchesComparison(Hr(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return Y()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Tt extends Lh{constructor(e,t){super(),this.filters=e,this.op=t,this.ae=null}static create(e,t){return new Tt(e,t)}matches(e){return Oh(this)?this.filters.find(t=>!t.matches(e))===void 0:this.filters.find(t=>t.matches(e))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function Oh(n){return n.op==="and"}function Vh(n){return R0(n)&&Oh(n)}function R0(n){for(const e of n.filters)if(e instanceof Tt)return!1;return!0}function Fa(n){if(n instanceof ke)return n.field.canonicalString()+n.op.toString()+Wr(n.value);if(Vh(n))return n.filters.map(e=>Fa(e)).join(",");{const e=n.filters.map(t=>Fa(t)).join(",");return`${n.op}(${e})`}}function Bh(n,e){return n instanceof ke?function(r,s){return s instanceof ke&&r.op===s.op&&r.field.isEqual(s.field)&&Mt(r.value,s.value)}(n,e):n instanceof Tt?function(r,s){return s instanceof Tt&&r.op===s.op&&r.filters.length===s.filters.length?r.filters.reduce((i,a,l)=>i&&Bh(a,s.filters[l]),!0):!1}(n,e):void Y()}function Fh(n){return n instanceof ke?function(t){return`${t.field.canonicalString()} ${t.op} ${Wr(t.value)}`}(n):n instanceof Tt?function(t){return t.op.toString()+" {"+t.getFilters().map(Fh).join(" ,")+"}"}(n):"Filter"}class P0 extends ke{constructor(e,t,r){super(e,t,r),this.key=q.fromName(r.referenceValue)}matches(e){const t=q.comparator(e.key,this.key);return this.matchesComparison(t)}}class C0 extends ke{constructor(e,t){super(e,"in",t),this.keys=zh("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class k0 extends ke{constructor(e,t){super(e,"not-in",t),this.keys=zh("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function zh(n,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map(r=>q.fromName(r.referenceValue))}class D0 extends ke{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return bl(t)&&Ws(t.arrayValue,this.value)}}class M0 extends ke{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&Ws(this.value.arrayValue,t)}}class N0 extends ke{constructor(e,t){super(e,"not-in",t)}matches(e){if(Ws(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&!Ws(this.value.arrayValue,t)}}class L0 extends ke{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!bl(t)||!t.arrayValue.values)&&t.arrayValue.values.some(r=>Ws(this.value.arrayValue,r))}}/**
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
 */class O0{constructor(e,t=null,r=[],s=[],i=null,a=null,l=null){this.path=e,this.collectionGroup=t,this.orderBy=r,this.filters=s,this.limit=i,this.startAt=a,this.endAt=l,this.ue=null}}function $u(n,e=null,t=[],r=[],s=null,i=null,a=null){return new O0(n,e,t,r,s,i,a)}function Tl(n){const e=K(n);if(e.ue===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map(r=>Fa(r)).join(","),t+="|ob:",t+=e.orderBy.map(r=>function(i){return i.field.canonicalString()+i.dir}(r)).join(","),So(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map(r=>Wr(r)).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map(r=>Wr(r)).join(",")),e.ue=t}return e.ue}function Il(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!x0(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!Bh(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!zu(n.startAt,e.startAt)&&zu(n.endAt,e.endAt)}function za(n){return q.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ts{constructor(e,t=null,r=[],s=[],i=null,a="F",l=null,c=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=r,this.filters=s,this.limit=i,this.limitType=a,this.startAt=l,this.endAt=c,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function V0(n,e,t,r,s,i,a,l){return new ts(n,e,t,r,s,i,a,l)}function Sl(n){return new ts(n)}function Uu(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function $h(n){return n.collectionGroup!==null}function Ms(n){const e=K(n);if(e.ce===null){e.ce=[];const t=new Set;for(const i of e.explicitOrderBy)e.ce.push(i),t.add(i.field.canonicalString());const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(a){let l=new We(je.comparator);return a.filters.forEach(c=>{c.getFlattenedFilters().forEach(d=>{d.isInequality()&&(l=l.add(d.field))})}),l})(e).forEach(i=>{t.has(i.canonicalString())||i.isKeyField()||e.ce.push(new Ys(i,r))}),t.has(je.keyField().canonicalString())||e.ce.push(new Ys(je.keyField(),r))}return e.ce}function Ct(n){const e=K(n);return e.le||(e.le=B0(e,Ms(n))),e.le}function B0(n,e){if(n.limitType==="F")return $u(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map(s=>{const i=s.dir==="desc"?"asc":"desc";return new Ys(s.field,i)});const t=n.endAt?new lo(n.endAt.position,n.endAt.inclusive):null,r=n.startAt?new lo(n.startAt.position,n.startAt.inclusive):null;return $u(n.path,n.collectionGroup,e,n.filters,n.limit,t,r)}}function $a(n,e){const t=n.filters.concat([e]);return new ts(n.path,n.collectionGroup,n.explicitOrderBy.slice(),t,n.limit,n.limitType,n.startAt,n.endAt)}function co(n,e,t){return new ts(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function Ao(n,e){return Il(Ct(n),Ct(e))&&n.limitType===e.limitType}function Uh(n){return`${Tl(Ct(n))}|lt:${n.limitType}`}function Rr(n){return`Query(target=${function(t){let r=t.path.canonicalString();return t.collectionGroup!==null&&(r+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(r+=`, filters: [${t.filters.map(s=>Fh(s)).join(", ")}]`),So(t.limit)||(r+=", limit: "+t.limit),t.orderBy.length>0&&(r+=`, orderBy: [${t.orderBy.map(s=>function(a){return`${a.field.canonicalString()} (${a.dir})`}(s)).join(", ")}]`),t.startAt&&(r+=", startAt: ",r+=t.startAt.inclusive?"b:":"a:",r+=t.startAt.position.map(s=>Wr(s)).join(",")),t.endAt&&(r+=", endAt: ",r+=t.endAt.inclusive?"a:":"b:",r+=t.endAt.position.map(s=>Wr(s)).join(",")),`Target(${r})`}(Ct(n))}; limitType=${n.limitType})`}function xo(n,e){return e.isFoundDocument()&&function(r,s){const i=s.key.path;return r.collectionGroup!==null?s.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(i):q.isDocumentKey(r.path)?r.path.isEqual(i):r.path.isImmediateParentOf(i)}(n,e)&&function(r,s){for(const i of Ms(r))if(!i.field.isKeyField()&&s.data.field(i.field)===null)return!1;return!0}(n,e)&&function(r,s){for(const i of r.filters)if(!i.matches(s))return!1;return!0}(n,e)&&function(r,s){return!(r.startAt&&!function(a,l,c){const d=Fu(a,l,c);return a.inclusive?d<=0:d<0}(r.startAt,Ms(r),s)||r.endAt&&!function(a,l,c){const d=Fu(a,l,c);return a.inclusive?d>=0:d>0}(r.endAt,Ms(r),s))}(n,e)}function F0(n){return n.collectionGroup||(n.path.length%2==1?n.path.lastSegment():n.path.get(n.path.length-2))}function qh(n){return(e,t)=>{let r=!1;for(const s of Ms(n)){const i=z0(s,e,t);if(i!==0)return i;r=r||s.field.isKeyField()}return 0}}function z0(n,e,t){const r=n.field.isKeyField()?q.comparator(e.key,t.key):function(i,a,l){const c=a.data.field(i),d=l.data.field(i);return c!==null&&d!==null?Hr(c,d):Y()}(n.field,e,t);switch(n.dir){case"asc":return r;case"desc":return-1*r;default:return Y()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ns{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r!==void 0){for(const[s,i]of r)if(this.equalsFn(s,e))return i}}has(e){return this.get(e)!==void 0}set(e,t){const r=this.mapKeyFn(e),s=this.inner[r];if(s===void 0)return this.inner[r]=[[e,t]],void this.innerSize++;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],e))return void(s[i]=[e,t]);s.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r===void 0)return!1;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],e))return r.length===1?delete this.inner[t]:r.splice(s,1),this.innerSize--,!0;return!1}forEach(e){rr(this.inner,(t,r)=>{for(const[s,i]of r)e(s,i)})}isEmpty(){return Dh(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $0=new _e(q.comparator);function Zt(){return $0}const jh=new _e(q.comparator);function Rs(...n){let e=jh;for(const t of n)e=e.insert(t.key,t);return e}function Hh(n){let e=jh;return n.forEach((t,r)=>e=e.insert(t,r.overlayedDocument)),e}function jn(){return Ns()}function Wh(){return Ns()}function Ns(){return new ns(n=>n.toString(),(n,e)=>n.isEqual(e))}const U0=new _e(q.comparator),q0=new We(q.comparator);function ee(...n){let e=q0;for(const t of n)e=e.add(t);return e}const j0=new We(se);function H0(){return j0}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Al(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:ao(e)?"-0":e}}function Yh(n){return{integerValue:""+n}}function W0(n,e){return b0(e)?Yh(e):Al(n,e)}/**
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
 */class Ro{constructor(){this._=void 0}}function Y0(n,e,t){return n instanceof uo?function(s,i){const a={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return i&&wl(i)&&(i=El(i)),i&&(a.fields.__previous_value__=i),{mapValue:a}}(t,e):n instanceof Gs?Kh(n,e):n instanceof Ks?Qh(n,e):function(s,i){const a=Gh(s,i),l=qu(a)+qu(s.Pe);return Ba(a)&&Ba(s.Pe)?Yh(l):Al(s.serializer,l)}(n,e)}function G0(n,e,t){return n instanceof Gs?Kh(n,e):n instanceof Ks?Qh(n,e):t}function Gh(n,e){return n instanceof ho?function(r){return Ba(r)||function(i){return!!i&&"doubleValue"in i}(r)}(e)?e:{integerValue:0}:null}class uo extends Ro{}class Gs extends Ro{constructor(e){super(),this.elements=e}}function Kh(n,e){const t=Jh(e);for(const r of n.elements)t.some(s=>Mt(s,r))||t.push(r);return{arrayValue:{values:t}}}class Ks extends Ro{constructor(e){super(),this.elements=e}}function Qh(n,e){let t=Jh(e);for(const r of n.elements)t=t.filter(s=>!Mt(s,r));return{arrayValue:{values:t}}}class ho extends Ro{constructor(e,t){super(),this.serializer=e,this.Pe=t}}function qu(n){return Ae(n.integerValue||n.doubleValue)}function Jh(n){return bl(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}function K0(n,e){return n.field.isEqual(e.field)&&function(r,s){return r instanceof Gs&&s instanceof Gs||r instanceof Ks&&s instanceof Ks?jr(r.elements,s.elements,Mt):r instanceof ho&&s instanceof ho?Mt(r.Pe,s.Pe):r instanceof uo&&s instanceof uo}(n.transform,e.transform)}class Q0{constructor(e,t){this.version=e,this.transformResults=t}}class st{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new st}static exists(e){return new st(void 0,e)}static updateTime(e){return new st(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Yi(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}class Po{}function Xh(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new Co(n.key,st.none()):new ai(n.key,n.data,st.none());{const t=n.data,r=rt.empty();let s=new We(je.comparator);for(let i of e.fields)if(!s.has(i)){let a=t.field(i);a===null&&i.length>1&&(i=i.popLast(),a=t.field(i)),a===null?r.delete(i):r.set(i,a),s=s.add(i)}return new xn(n.key,r,new lt(s.toArray()),st.none())}}function J0(n,e,t){n instanceof ai?function(s,i,a){const l=s.value.clone(),c=Hu(s.fieldTransforms,i,a.transformResults);l.setAll(c),i.convertToFoundDocument(a.version,l).setHasCommittedMutations()}(n,e,t):n instanceof xn?function(s,i,a){if(!Yi(s.precondition,i))return void i.convertToUnknownDocument(a.version);const l=Hu(s.fieldTransforms,i,a.transformResults),c=i.data;c.setAll(Zh(s)),c.setAll(l),i.convertToFoundDocument(a.version,c).setHasCommittedMutations()}(n,e,t):function(s,i,a){i.convertToNoDocument(a.version).setHasCommittedMutations()}(0,e,t)}function Ls(n,e,t,r){return n instanceof ai?function(i,a,l,c){if(!Yi(i.precondition,a))return l;const d=i.value.clone(),f=Wu(i.fieldTransforms,c,a);return d.setAll(f),a.convertToFoundDocument(a.version,d).setHasLocalMutations(),null}(n,e,t,r):n instanceof xn?function(i,a,l,c){if(!Yi(i.precondition,a))return l;const d=Wu(i.fieldTransforms,c,a),f=a.data;return f.setAll(Zh(i)),f.setAll(d),a.convertToFoundDocument(a.version,f).setHasLocalMutations(),l===null?null:l.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map(m=>m.field))}(n,e,t,r):function(i,a,l){return Yi(i.precondition,a)?(a.convertToNoDocument(a.version).setHasLocalMutations(),null):l}(n,e,t)}function X0(n,e){let t=null;for(const r of n.fieldTransforms){const s=e.data.field(r.field),i=Gh(r.transform,s||null);i!=null&&(t===null&&(t=rt.empty()),t.set(r.field,i))}return t||null}function ju(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!function(r,s){return r===void 0&&s===void 0||!(!r||!s)&&jr(r,s,(i,a)=>K0(i,a))}(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}class ai extends Po{constructor(e,t,r,s=[]){super(),this.key=e,this.value=t,this.precondition=r,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class xn extends Po{constructor(e,t,r,s,i=[]){super(),this.key=e,this.data=t,this.fieldMask=r,this.precondition=s,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function Zh(n){const e=new Map;return n.fieldMask.fields.forEach(t=>{if(!t.isEmpty()){const r=n.data.field(t);e.set(t,r)}}),e}function Hu(n,e,t){const r=new Map;le(n.length===t.length);for(let s=0;s<t.length;s++){const i=n[s],a=i.transform,l=e.data.field(i.field);r.set(i.field,G0(a,l,t[s]))}return r}function Wu(n,e,t){const r=new Map;for(const s of n){const i=s.transform,a=t.data.field(s.field);r.set(s.field,Y0(i,a,e))}return r}class Co extends Po{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class Z0 extends Po{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class e_{constructor(e,t,r,s){this.batchId=e,this.localWriteTime=t,this.baseMutations=r,this.mutations=s}applyToRemoteDocument(e,t){const r=t.mutationResults;for(let s=0;s<this.mutations.length;s++){const i=this.mutations[s];i.key.isEqual(e.key)&&J0(i,e,r[s])}}applyToLocalView(e,t){for(const r of this.baseMutations)r.key.isEqual(e.key)&&(t=Ls(r,e,t,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(e.key)&&(t=Ls(r,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const r=Wh();return this.mutations.forEach(s=>{const i=e.get(s.key),a=i.overlayedDocument;let l=this.applyToLocalView(a,i.mutatedFields);l=t.has(s.key)?null:l;const c=Xh(a,l);c!==null&&r.set(s.key,c),a.isValidDocument()||a.convertToNoDocument(G.min())}),r}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),ee())}isEqual(e){return this.batchId===e.batchId&&jr(this.mutations,e.mutations,(t,r)=>ju(t,r))&&jr(this.baseMutations,e.baseMutations,(t,r)=>ju(t,r))}}class xl{constructor(e,t,r,s){this.batch=e,this.commitVersion=t,this.mutationResults=r,this.docVersions=s}static from(e,t,r){le(e.mutations.length===r.length);let s=function(){return U0}();const i=e.mutations;for(let a=0;a<i.length;a++)s=s.insert(i[a].key,r[a].version);return new xl(e,t,r,s)}}/**
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
 */class t_{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
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
 */class n_{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ce,ne;function r_(n){switch(n){default:return Y();case M.CANCELLED:case M.UNKNOWN:case M.DEADLINE_EXCEEDED:case M.RESOURCE_EXHAUSTED:case M.INTERNAL:case M.UNAVAILABLE:case M.UNAUTHENTICATED:return!1;case M.INVALID_ARGUMENT:case M.NOT_FOUND:case M.ALREADY_EXISTS:case M.PERMISSION_DENIED:case M.FAILED_PRECONDITION:case M.ABORTED:case M.OUT_OF_RANGE:case M.UNIMPLEMENTED:case M.DATA_LOSS:return!0}}function ef(n){if(n===void 0)return Xt("GRPC error has no .code"),M.UNKNOWN;switch(n){case Ce.OK:return M.OK;case Ce.CANCELLED:return M.CANCELLED;case Ce.UNKNOWN:return M.UNKNOWN;case Ce.DEADLINE_EXCEEDED:return M.DEADLINE_EXCEEDED;case Ce.RESOURCE_EXHAUSTED:return M.RESOURCE_EXHAUSTED;case Ce.INTERNAL:return M.INTERNAL;case Ce.UNAVAILABLE:return M.UNAVAILABLE;case Ce.UNAUTHENTICATED:return M.UNAUTHENTICATED;case Ce.INVALID_ARGUMENT:return M.INVALID_ARGUMENT;case Ce.NOT_FOUND:return M.NOT_FOUND;case Ce.ALREADY_EXISTS:return M.ALREADY_EXISTS;case Ce.PERMISSION_DENIED:return M.PERMISSION_DENIED;case Ce.FAILED_PRECONDITION:return M.FAILED_PRECONDITION;case Ce.ABORTED:return M.ABORTED;case Ce.OUT_OF_RANGE:return M.OUT_OF_RANGE;case Ce.UNIMPLEMENTED:return M.UNIMPLEMENTED;case Ce.DATA_LOSS:return M.DATA_LOSS;default:return Y()}}(ne=Ce||(Ce={}))[ne.OK=0]="OK",ne[ne.CANCELLED=1]="CANCELLED",ne[ne.UNKNOWN=2]="UNKNOWN",ne[ne.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",ne[ne.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",ne[ne.NOT_FOUND=5]="NOT_FOUND",ne[ne.ALREADY_EXISTS=6]="ALREADY_EXISTS",ne[ne.PERMISSION_DENIED=7]="PERMISSION_DENIED",ne[ne.UNAUTHENTICATED=16]="UNAUTHENTICATED",ne[ne.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",ne[ne.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",ne[ne.ABORTED=10]="ABORTED",ne[ne.OUT_OF_RANGE=11]="OUT_OF_RANGE",ne[ne.UNIMPLEMENTED=12]="UNIMPLEMENTED",ne[ne.INTERNAL=13]="INTERNAL",ne[ne.UNAVAILABLE=14]="UNAVAILABLE",ne[ne.DATA_LOSS=15]="DATA_LOSS";/**
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
 */function s_(){return new TextEncoder}/**
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
 */const i_=new Hn([4294967295,4294967295],0);function Yu(n){const e=s_().encode(n),t=new Ih;return t.update(e),new Uint8Array(t.digest())}function Gu(n){const e=new DataView(n.buffer),t=e.getUint32(0,!0),r=e.getUint32(4,!0),s=e.getUint32(8,!0),i=e.getUint32(12,!0);return[new Hn([t,r],0),new Hn([s,i],0)]}class Rl{constructor(e,t,r){if(this.bitmap=e,this.padding=t,this.hashCount=r,t<0||t>=8)throw new Ps(`Invalid padding: ${t}`);if(r<0)throw new Ps(`Invalid hash count: ${r}`);if(e.length>0&&this.hashCount===0)throw new Ps(`Invalid hash count: ${r}`);if(e.length===0&&t!==0)throw new Ps(`Invalid padding when bitmap length is 0: ${t}`);this.Ie=8*e.length-t,this.Te=Hn.fromNumber(this.Ie)}Ee(e,t,r){let s=e.add(t.multiply(Hn.fromNumber(r)));return s.compare(i_)===1&&(s=new Hn([s.getBits(0),s.getBits(1)],0)),s.modulo(this.Te).toNumber()}de(e){return(this.bitmap[Math.floor(e/8)]&1<<e%8)!=0}mightContain(e){if(this.Ie===0)return!1;const t=Yu(e),[r,s]=Gu(t);for(let i=0;i<this.hashCount;i++){const a=this.Ee(r,s,i);if(!this.de(a))return!1}return!0}static create(e,t,r){const s=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),a=new Rl(i,s,t);return r.forEach(l=>a.insert(l)),a}insert(e){if(this.Ie===0)return;const t=Yu(e),[r,s]=Gu(t);for(let i=0;i<this.hashCount;i++){const a=this.Ee(r,s,i);this.Ae(a)}}Ae(e){const t=Math.floor(e/8),r=e%8;this.bitmap[t]|=1<<r}}class Ps extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ko{constructor(e,t,r,s,i){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=r,this.documentUpdates=s,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(e,t,r){const s=new Map;return s.set(e,li.createSynthesizedTargetChangeForCurrentChange(e,t,r)),new ko(G.min(),s,new _e(se),Zt(),ee())}}class li{constructor(e,t,r,s,i){this.resumeToken=e,this.current=t,this.addedDocuments=r,this.modifiedDocuments=s,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,t,r){return new li(r,t,ee(),ee(),ee())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gi{constructor(e,t,r,s){this.Re=e,this.removedTargetIds=t,this.key=r,this.Ve=s}}class tf{constructor(e,t){this.targetId=e,this.me=t}}class nf{constructor(e,t,r=Ye.EMPTY_BYTE_STRING,s=null){this.state=e,this.targetIds=t,this.resumeToken=r,this.cause=s}}class Ku{constructor(){this.fe=0,this.ge=Ju(),this.pe=Ye.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return this.fe!==0}get be(){return this.we}De(e){e.approximateByteSize()>0&&(this.we=!0,this.pe=e)}ve(){let e=ee(),t=ee(),r=ee();return this.ge.forEach((s,i)=>{switch(i){case 0:e=e.add(s);break;case 2:t=t.add(s);break;case 1:r=r.add(s);break;default:Y()}}),new li(this.pe,this.ye,e,t,r)}Ce(){this.we=!1,this.ge=Ju()}Fe(e,t){this.we=!0,this.ge=this.ge.insert(e,t)}Me(e){this.we=!0,this.ge=this.ge.remove(e)}xe(){this.fe+=1}Oe(){this.fe-=1,le(this.fe>=0)}Ne(){this.we=!0,this.ye=!0}}class o_{constructor(e){this.Le=e,this.Be=new Map,this.ke=Zt(),this.qe=Qu(),this.Qe=new _e(se)}Ke(e){for(const t of e.Re)e.Ve&&e.Ve.isFoundDocument()?this.$e(t,e.Ve):this.Ue(t,e.key,e.Ve);for(const t of e.removedTargetIds)this.Ue(t,e.key,e.Ve)}We(e){this.forEachTarget(e,t=>{const r=this.Ge(t);switch(e.state){case 0:this.ze(t)&&r.De(e.resumeToken);break;case 1:r.Oe(),r.Se||r.Ce(),r.De(e.resumeToken);break;case 2:r.Oe(),r.Se||this.removeTarget(t);break;case 3:this.ze(t)&&(r.Ne(),r.De(e.resumeToken));break;case 4:this.ze(t)&&(this.je(t),r.De(e.resumeToken));break;default:Y()}})}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Be.forEach((r,s)=>{this.ze(s)&&t(s)})}He(e){const t=e.targetId,r=e.me.count,s=this.Je(t);if(s){const i=s.target;if(za(i))if(r===0){const a=new q(i.path);this.Ue(t,a,Ze.newNoDocument(a,G.min()))}else le(r===1);else{const a=this.Ye(t);if(a!==r){const l=this.Ze(e),c=l?this.Xe(l,e,a):1;if(c!==0){this.je(t);const d=c===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Qe=this.Qe.insert(t,d)}}}}}Ze(e){const t=e.me.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:r="",padding:s=0},hashCount:i=0}=t;let a,l;try{a=Xn(r).toUint8Array()}catch(c){if(c instanceof Mh)return qr("Decoding the base64 bloom filter in existence filter failed ("+c.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw c}try{l=new Rl(a,s,i)}catch(c){return qr(c instanceof Ps?"BloomFilter error: ":"Applying bloom filter failed: ",c),null}return l.Ie===0?null:l}Xe(e,t,r){return t.me.count===r-this.nt(e,t.targetId)?0:2}nt(e,t){const r=this.Le.getRemoteKeysForTarget(t);let s=0;return r.forEach(i=>{const a=this.Le.tt(),l=`projects/${a.projectId}/databases/${a.database}/documents/${i.path.canonicalString()}`;e.mightContain(l)||(this.Ue(t,i,null),s++)}),s}rt(e){const t=new Map;this.Be.forEach((i,a)=>{const l=this.Je(a);if(l){if(i.current&&za(l.target)){const c=new q(l.target.path);this.ke.get(c)!==null||this.it(a,c)||this.Ue(a,c,Ze.newNoDocument(c,e))}i.be&&(t.set(a,i.ve()),i.Ce())}});let r=ee();this.qe.forEach((i,a)=>{let l=!0;a.forEachWhile(c=>{const d=this.Je(c);return!d||d.purpose==="TargetPurposeLimboResolution"||(l=!1,!1)}),l&&(r=r.add(i))}),this.ke.forEach((i,a)=>a.setReadTime(e));const s=new ko(e,t,this.Qe,this.ke,r);return this.ke=Zt(),this.qe=Qu(),this.Qe=new _e(se),s}$e(e,t){if(!this.ze(e))return;const r=this.it(e,t.key)?2:0;this.Ge(e).Fe(t.key,r),this.ke=this.ke.insert(t.key,t),this.qe=this.qe.insert(t.key,this.st(t.key).add(e))}Ue(e,t,r){if(!this.ze(e))return;const s=this.Ge(e);this.it(e,t)?s.Fe(t,1):s.Me(t),this.qe=this.qe.insert(t,this.st(t).delete(e)),r&&(this.ke=this.ke.insert(t,r))}removeTarget(e){this.Be.delete(e)}Ye(e){const t=this.Ge(e).ve();return this.Le.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}xe(e){this.Ge(e).xe()}Ge(e){let t=this.Be.get(e);return t||(t=new Ku,this.Be.set(e,t)),t}st(e){let t=this.qe.get(e);return t||(t=new We(se),this.qe=this.qe.insert(e,t)),t}ze(e){const t=this.Je(e)!==null;return t||$("WatchChangeAggregator","Detected inactive target",e),t}Je(e){const t=this.Be.get(e);return t&&t.Se?null:this.Le.ot(e)}je(e){this.Be.set(e,new Ku),this.Le.getRemoteKeysForTarget(e).forEach(t=>{this.Ue(e,t,null)})}it(e,t){return this.Le.getRemoteKeysForTarget(e).has(t)}}function Qu(){return new _e(q.comparator)}function Ju(){return new _e(q.comparator)}const a_={asc:"ASCENDING",desc:"DESCENDING"},l_={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},c_={and:"AND",or:"OR"};class u_{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function Ua(n,e){return n.useProto3Json||So(e)?e:{value:e}}function fo(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function rf(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function d_(n,e){return fo(n,e.toTimestamp())}function kt(n){return le(!!n),G.fromTimestamp(function(t){const r=In(t);return new Le(r.seconds,r.nanos)}(n))}function Pl(n,e){return qa(n,e).canonicalString()}function qa(n,e){const t=function(s){return new me(["projects",s.projectId,"databases",s.database])}(n).child("documents");return e===void 0?t:t.child(e)}function sf(n){const e=me.fromString(n);return le(uf(e)),e}function ja(n,e){return Pl(n.databaseId,e.path)}function ma(n,e){const t=sf(e);if(t.get(1)!==n.databaseId.projectId)throw new z(M.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new z(M.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new q(af(t))}function of(n,e){return Pl(n.databaseId,e)}function h_(n){const e=sf(n);return e.length===4?me.emptyPath():af(e)}function Ha(n){return new me(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function af(n){return le(n.length>4&&n.get(4)==="documents"),n.popFirst(5)}function Xu(n,e,t){return{name:ja(n,e),fields:t.value.mapValue.fields}}function f_(n,e){let t;if("targetChange"in e){e.targetChange;const r=function(d){return d==="NO_CHANGE"?0:d==="ADD"?1:d==="REMOVE"?2:d==="CURRENT"?3:d==="RESET"?4:Y()}(e.targetChange.targetChangeType||"NO_CHANGE"),s=e.targetChange.targetIds||[],i=function(d,f){return d.useProto3Json?(le(f===void 0||typeof f=="string"),Ye.fromBase64String(f||"")):(le(f===void 0||f instanceof Buffer||f instanceof Uint8Array),Ye.fromUint8Array(f||new Uint8Array))}(n,e.targetChange.resumeToken),a=e.targetChange.cause,l=a&&function(d){const f=d.code===void 0?M.UNKNOWN:ef(d.code);return new z(f,d.message||"")}(a);t=new nf(r,s,i,l||null)}else if("documentChange"in e){e.documentChange;const r=e.documentChange;r.document,r.document.name,r.document.updateTime;const s=ma(n,r.document.name),i=kt(r.document.updateTime),a=r.document.createTime?kt(r.document.createTime):G.min(),l=new rt({mapValue:{fields:r.document.fields}}),c=Ze.newFoundDocument(s,i,a,l),d=r.targetIds||[],f=r.removedTargetIds||[];t=new Gi(d,f,c.key,c)}else if("documentDelete"in e){e.documentDelete;const r=e.documentDelete;r.document;const s=ma(n,r.document),i=r.readTime?kt(r.readTime):G.min(),a=Ze.newNoDocument(s,i),l=r.removedTargetIds||[];t=new Gi([],l,a.key,a)}else if("documentRemove"in e){e.documentRemove;const r=e.documentRemove;r.document;const s=ma(n,r.document),i=r.removedTargetIds||[];t=new Gi([],i,s,null)}else{if(!("filter"in e))return Y();{e.filter;const r=e.filter;r.targetId;const{count:s=0,unchangedNames:i}=r,a=new n_(s,i),l=r.targetId;t=new tf(l,a)}}return t}function p_(n,e){let t;if(e instanceof ai)t={update:Xu(n,e.key,e.value)};else if(e instanceof Co)t={delete:ja(n,e.key)};else if(e instanceof xn)t={update:Xu(n,e.key,e.data),updateMask:T_(e.fieldMask)};else{if(!(e instanceof Z0))return Y();t={verify:ja(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map(r=>function(i,a){const l=a.transform;if(l instanceof uo)return{fieldPath:a.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(l instanceof Gs)return{fieldPath:a.field.canonicalString(),appendMissingElements:{values:l.elements}};if(l instanceof Ks)return{fieldPath:a.field.canonicalString(),removeAllFromArray:{values:l.elements}};if(l instanceof ho)return{fieldPath:a.field.canonicalString(),increment:l.Pe};throw Y()}(0,r))),e.precondition.isNone||(t.currentDocument=function(s,i){return i.updateTime!==void 0?{updateTime:d_(s,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:Y()}(n,e.precondition)),t}function m_(n,e){return n&&n.length>0?(le(e!==void 0),n.map(t=>function(s,i){let a=s.updateTime?kt(s.updateTime):kt(i);return a.isEqual(G.min())&&(a=kt(i)),new Q0(a,s.transformResults||[])}(t,e))):[]}function g_(n,e){return{documents:[of(n,e.path)]}}function y_(n,e){const t={structuredQuery:{}},r=e.path;let s;e.collectionGroup!==null?(s=r,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(s=r.popLast(),t.structuredQuery.from=[{collectionId:r.lastSegment()}]),t.parent=of(n,s);const i=function(d){if(d.length!==0)return cf(Tt.create(d,"and"))}(e.filters);i&&(t.structuredQuery.where=i);const a=function(d){if(d.length!==0)return d.map(f=>function(v){return{field:Pr(v.field),direction:w_(v.dir)}}(f))}(e.orderBy);a&&(t.structuredQuery.orderBy=a);const l=Ua(n,e.limit);return l!==null&&(t.structuredQuery.limit=l),e.startAt&&(t.structuredQuery.startAt=function(d){return{before:d.inclusive,values:d.position}}(e.startAt)),e.endAt&&(t.structuredQuery.endAt=function(d){return{before:!d.inclusive,values:d.position}}(e.endAt)),{_t:t,parent:s}}function v_(n){let e=h_(n.parent);const t=n.structuredQuery,r=t.from?t.from.length:0;let s=null;if(r>0){le(r===1);const f=t.from[0];f.allDescendants?s=f.collectionId:e=e.child(f.collectionId)}let i=[];t.where&&(i=function(m){const v=lf(m);return v instanceof Tt&&Vh(v)?v.getFilters():[v]}(t.where));let a=[];t.orderBy&&(a=function(m){return m.map(v=>function(T){return new Ys(Cr(T.field),function(R){switch(R){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(T.direction))}(v))}(t.orderBy));let l=null;t.limit&&(l=function(m){let v;return v=typeof m=="object"?m.value:m,So(v)?null:v}(t.limit));let c=null;t.startAt&&(c=function(m){const v=!!m.before,E=m.values||[];return new lo(E,v)}(t.startAt));let d=null;return t.endAt&&(d=function(m){const v=!m.before,E=m.values||[];return new lo(E,v)}(t.endAt)),V0(e,s,a,i,l,"F",c,d)}function __(n,e){const t=function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return Y()}}(e.purpose);return t==null?null:{"goog-listen-tags":t}}function lf(n){return n.unaryFilter!==void 0?function(t){switch(t.unaryFilter.op){case"IS_NAN":const r=Cr(t.unaryFilter.field);return ke.create(r,"==",{doubleValue:NaN});case"IS_NULL":const s=Cr(t.unaryFilter.field);return ke.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=Cr(t.unaryFilter.field);return ke.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const a=Cr(t.unaryFilter.field);return ke.create(a,"!=",{nullValue:"NULL_VALUE"});default:return Y()}}(n):n.fieldFilter!==void 0?function(t){return ke.create(Cr(t.fieldFilter.field),function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return Y()}}(t.fieldFilter.op),t.fieldFilter.value)}(n):n.compositeFilter!==void 0?function(t){return Tt.create(t.compositeFilter.filters.map(r=>lf(r)),function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return Y()}}(t.compositeFilter.op))}(n):Y()}function w_(n){return a_[n]}function E_(n){return l_[n]}function b_(n){return c_[n]}function Pr(n){return{fieldPath:n.canonicalString()}}function Cr(n){return je.fromServerFormat(n.fieldPath)}function cf(n){return n instanceof ke?function(t){if(t.op==="=="){if(Bu(t.value))return{unaryFilter:{field:Pr(t.field),op:"IS_NAN"}};if(Vu(t.value))return{unaryFilter:{field:Pr(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(Bu(t.value))return{unaryFilter:{field:Pr(t.field),op:"IS_NOT_NAN"}};if(Vu(t.value))return{unaryFilter:{field:Pr(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Pr(t.field),op:E_(t.op),value:t.value}}}(n):n instanceof Tt?function(t){const r=t.getFilters().map(s=>cf(s));return r.length===1?r[0]:{compositeFilter:{op:b_(t.op),filters:r}}}(n):Y()}function T_(n){const e=[];return n.fields.forEach(t=>e.push(t.canonicalString())),{fieldPaths:e}}function uf(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mn{constructor(e,t,r,s,i=G.min(),a=G.min(),l=Ye.EMPTY_BYTE_STRING,c=null){this.target=e,this.targetId=t,this.purpose=r,this.sequenceNumber=s,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=a,this.resumeToken=l,this.expectedCount=c}withSequenceNumber(e){return new mn(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new mn(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new mn(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new mn(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class I_{constructor(e){this.ct=e}}function S_(n){const e=v_({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?co(e,e.limit,"L"):e}/**
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
 */class A_{constructor(){this.un=new x_}addToCollectionParentIndex(e,t){return this.un.add(t),L.resolve()}getCollectionParents(e,t){return L.resolve(this.un.getEntries(t))}addFieldIndex(e,t){return L.resolve()}deleteFieldIndex(e,t){return L.resolve()}deleteAllFieldIndexes(e){return L.resolve()}createTargetIndexes(e,t){return L.resolve()}getDocumentsMatchingTarget(e,t){return L.resolve(null)}getIndexType(e,t){return L.resolve(0)}getFieldIndexes(e,t){return L.resolve([])}getNextCollectionGroupToUpdate(e){return L.resolve(null)}getMinOffset(e,t){return L.resolve(Tn.min())}getMinOffsetFromCollectionGroup(e,t){return L.resolve(Tn.min())}updateCollectionGroup(e,t,r){return L.resolve()}updateIndexEntries(e,t){return L.resolve()}}class x_{constructor(){this.index={}}add(e){const t=e.lastSegment(),r=e.popLast(),s=this.index[t]||new We(me.comparator),i=!s.has(r);return this.index[t]=s.add(r),i}has(e){const t=e.lastSegment(),r=e.popLast(),s=this.index[t];return s&&s.has(r)}getEntries(e){return(this.index[e]||new We(me.comparator)).toArray()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class R_{constructor(){this.changes=new ns(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,Ze.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const r=this.changes.get(t);return r!==void 0?L.resolve(r):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class P_{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class C_{constructor(e,t,r,s){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=r,this.indexManager=s}getDocument(e,t){let r=null;return this.documentOverlayCache.getOverlay(e,t).next(s=>(r=s,this.remoteDocumentCache.getEntry(e,t))).next(s=>(r!==null&&Ls(r.mutation,s,lt.empty(),Le.now()),s))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(r=>this.getLocalViewOfDocuments(e,r,ee()).next(()=>r))}getLocalViewOfDocuments(e,t,r=ee()){const s=jn();return this.populateOverlays(e,s,t).next(()=>this.computeViews(e,t,s,r).next(i=>{let a=Rs();return i.forEach((l,c)=>{a=a.insert(l,c.overlayedDocument)}),a}))}getOverlayedDocuments(e,t){const r=jn();return this.populateOverlays(e,r,t).next(()=>this.computeViews(e,t,r,ee()))}populateOverlays(e,t,r){const s=[];return r.forEach(i=>{t.has(i)||s.push(i)}),this.documentOverlayCache.getOverlays(e,s).next(i=>{i.forEach((a,l)=>{t.set(a,l)})})}computeViews(e,t,r,s){let i=Zt();const a=Ns(),l=function(){return Ns()}();return t.forEach((c,d)=>{const f=r.get(d.key);s.has(d.key)&&(f===void 0||f.mutation instanceof xn)?i=i.insert(d.key,d):f!==void 0?(a.set(d.key,f.mutation.getFieldMask()),Ls(f.mutation,d,f.mutation.getFieldMask(),Le.now())):a.set(d.key,lt.empty())}),this.recalculateAndSaveOverlays(e,i).next(c=>(c.forEach((d,f)=>a.set(d,f)),t.forEach((d,f)=>{var m;return l.set(d,new P_(f,(m=a.get(d))!==null&&m!==void 0?m:null))}),l))}recalculateAndSaveOverlays(e,t){const r=Ns();let s=new _e((a,l)=>a-l),i=ee();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(a=>{for(const l of a)l.keys().forEach(c=>{const d=t.get(c);if(d===null)return;let f=r.get(c)||lt.empty();f=l.applyToLocalView(d,f),r.set(c,f);const m=(s.get(l.batchId)||ee()).add(c);s=s.insert(l.batchId,m)})}).next(()=>{const a=[],l=s.getReverseIterator();for(;l.hasNext();){const c=l.getNext(),d=c.key,f=c.value,m=Wh();f.forEach(v=>{if(!i.has(v)){const E=Xh(t.get(v),r.get(v));E!==null&&m.set(v,E),i=i.add(v)}}),a.push(this.documentOverlayCache.saveOverlays(e,d,m))}return L.waitFor(a)}).next(()=>r)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(r=>this.recalculateAndSaveOverlays(e,r))}getDocumentsMatchingQuery(e,t,r,s){return function(a){return q.isDocumentKey(a.path)&&a.collectionGroup===null&&a.filters.length===0}(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):$h(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,r,s):this.getDocumentsMatchingCollectionQuery(e,t,r,s)}getNextDocuments(e,t,r,s){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,r,s).next(i=>{const a=s-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,r.largestBatchId,s-i.size):L.resolve(jn());let l=-1,c=i;return a.next(d=>L.forEach(d,(f,m)=>(l<m.largestBatchId&&(l=m.largestBatchId),i.get(f)?L.resolve():this.remoteDocumentCache.getEntry(e,f).next(v=>{c=c.insert(f,v)}))).next(()=>this.populateOverlays(e,d,i)).next(()=>this.computeViews(e,c,d,ee())).next(f=>({batchId:l,changes:Hh(f)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new q(t)).next(r=>{let s=Rs();return r.isFoundDocument()&&(s=s.insert(r.key,r)),s})}getDocumentsMatchingCollectionGroupQuery(e,t,r,s){const i=t.collectionGroup;let a=Rs();return this.indexManager.getCollectionParents(e,i).next(l=>L.forEach(l,c=>{const d=function(m,v){return new ts(v,null,m.explicitOrderBy.slice(),m.filters.slice(),m.limit,m.limitType,m.startAt,m.endAt)}(t,c.child(i));return this.getDocumentsMatchingCollectionQuery(e,d,r,s).next(f=>{f.forEach((m,v)=>{a=a.insert(m,v)})})}).next(()=>a))}getDocumentsMatchingCollectionQuery(e,t,r,s){let i;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,r.largestBatchId).next(a=>(i=a,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,r,i,s))).next(a=>{i.forEach((c,d)=>{const f=d.getKey();a.get(f)===null&&(a=a.insert(f,Ze.newInvalidDocument(f)))});let l=Rs();return a.forEach((c,d)=>{const f=i.get(c);f!==void 0&&Ls(f.mutation,d,lt.empty(),Le.now()),xo(t,d)&&(l=l.insert(c,d))}),l})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class k_{constructor(e){this.serializer=e,this.hr=new Map,this.Pr=new Map}getBundleMetadata(e,t){return L.resolve(this.hr.get(t))}saveBundleMetadata(e,t){return this.hr.set(t.id,function(s){return{id:s.id,version:s.version,createTime:kt(s.createTime)}}(t)),L.resolve()}getNamedQuery(e,t){return L.resolve(this.Pr.get(t))}saveNamedQuery(e,t){return this.Pr.set(t.name,function(s){return{name:s.name,query:S_(s.bundledQuery),readTime:kt(s.readTime)}}(t)),L.resolve()}}/**
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
 */class D_{constructor(){this.overlays=new _e(q.comparator),this.Ir=new Map}getOverlay(e,t){return L.resolve(this.overlays.get(t))}getOverlays(e,t){const r=jn();return L.forEach(t,s=>this.getOverlay(e,s).next(i=>{i!==null&&r.set(s,i)})).next(()=>r)}saveOverlays(e,t,r){return r.forEach((s,i)=>{this.ht(e,t,i)}),L.resolve()}removeOverlaysForBatchId(e,t,r){const s=this.Ir.get(r);return s!==void 0&&(s.forEach(i=>this.overlays=this.overlays.remove(i)),this.Ir.delete(r)),L.resolve()}getOverlaysForCollection(e,t,r){const s=jn(),i=t.length+1,a=new q(t.child("")),l=this.overlays.getIteratorFrom(a);for(;l.hasNext();){const c=l.getNext().value,d=c.getKey();if(!t.isPrefixOf(d.path))break;d.path.length===i&&c.largestBatchId>r&&s.set(c.getKey(),c)}return L.resolve(s)}getOverlaysForCollectionGroup(e,t,r,s){let i=new _e((d,f)=>d-f);const a=this.overlays.getIterator();for(;a.hasNext();){const d=a.getNext().value;if(d.getKey().getCollectionGroup()===t&&d.largestBatchId>r){let f=i.get(d.largestBatchId);f===null&&(f=jn(),i=i.insert(d.largestBatchId,f)),f.set(d.getKey(),d)}}const l=jn(),c=i.getIterator();for(;c.hasNext()&&(c.getNext().value.forEach((d,f)=>l.set(d,f)),!(l.size()>=s)););return L.resolve(l)}ht(e,t,r){const s=this.overlays.get(r.key);if(s!==null){const a=this.Ir.get(s.largestBatchId).delete(r.key);this.Ir.set(s.largestBatchId,a)}this.overlays=this.overlays.insert(r.key,new t_(t,r));let i=this.Ir.get(t);i===void 0&&(i=ee(),this.Ir.set(t,i)),this.Ir.set(t,i.add(r.key))}}/**
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
 */class M_{constructor(){this.sessionToken=Ye.EMPTY_BYTE_STRING}getSessionToken(e){return L.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,L.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cl{constructor(){this.Tr=new We(Fe.Er),this.dr=new We(Fe.Ar)}isEmpty(){return this.Tr.isEmpty()}addReference(e,t){const r=new Fe(e,t);this.Tr=this.Tr.add(r),this.dr=this.dr.add(r)}Rr(e,t){e.forEach(r=>this.addReference(r,t))}removeReference(e,t){this.Vr(new Fe(e,t))}mr(e,t){e.forEach(r=>this.removeReference(r,t))}gr(e){const t=new q(new me([])),r=new Fe(t,e),s=new Fe(t,e+1),i=[];return this.dr.forEachInRange([r,s],a=>{this.Vr(a),i.push(a.key)}),i}pr(){this.Tr.forEach(e=>this.Vr(e))}Vr(e){this.Tr=this.Tr.delete(e),this.dr=this.dr.delete(e)}yr(e){const t=new q(new me([])),r=new Fe(t,e),s=new Fe(t,e+1);let i=ee();return this.dr.forEachInRange([r,s],a=>{i=i.add(a.key)}),i}containsKey(e){const t=new Fe(e,0),r=this.Tr.firstAfterOrEqual(t);return r!==null&&e.isEqual(r.key)}}class Fe{constructor(e,t){this.key=e,this.wr=t}static Er(e,t){return q.comparator(e.key,t.key)||se(e.wr,t.wr)}static Ar(e,t){return se(e.wr,t.wr)||q.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class N_{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Sr=1,this.br=new We(Fe.Er)}checkEmpty(e){return L.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,r,s){const i=this.Sr;this.Sr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const a=new e_(i,t,r,s);this.mutationQueue.push(a);for(const l of s)this.br=this.br.add(new Fe(l.key,i)),this.indexManager.addToCollectionParentIndex(e,l.key.path.popLast());return L.resolve(a)}lookupMutationBatch(e,t){return L.resolve(this.Dr(t))}getNextMutationBatchAfterBatchId(e,t){const r=t+1,s=this.vr(r),i=s<0?0:s;return L.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return L.resolve(this.mutationQueue.length===0?-1:this.Sr-1)}getAllMutationBatches(e){return L.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const r=new Fe(t,0),s=new Fe(t,Number.POSITIVE_INFINITY),i=[];return this.br.forEachInRange([r,s],a=>{const l=this.Dr(a.wr);i.push(l)}),L.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let r=new We(se);return t.forEach(s=>{const i=new Fe(s,0),a=new Fe(s,Number.POSITIVE_INFINITY);this.br.forEachInRange([i,a],l=>{r=r.add(l.wr)})}),L.resolve(this.Cr(r))}getAllMutationBatchesAffectingQuery(e,t){const r=t.path,s=r.length+1;let i=r;q.isDocumentKey(i)||(i=i.child(""));const a=new Fe(new q(i),0);let l=new We(se);return this.br.forEachWhile(c=>{const d=c.key.path;return!!r.isPrefixOf(d)&&(d.length===s&&(l=l.add(c.wr)),!0)},a),L.resolve(this.Cr(l))}Cr(e){const t=[];return e.forEach(r=>{const s=this.Dr(r);s!==null&&t.push(s)}),t}removeMutationBatch(e,t){le(this.Fr(t.batchId,"removed")===0),this.mutationQueue.shift();let r=this.br;return L.forEach(t.mutations,s=>{const i=new Fe(s.key,t.batchId);return r=r.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)}).next(()=>{this.br=r})}On(e){}containsKey(e,t){const r=new Fe(t,0),s=this.br.firstAfterOrEqual(r);return L.resolve(t.isEqual(s&&s.key))}performConsistencyCheck(e){return this.mutationQueue.length,L.resolve()}Fr(e,t){return this.vr(e)}vr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Dr(e){const t=this.vr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class L_{constructor(e){this.Mr=e,this.docs=function(){return new _e(q.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const r=t.key,s=this.docs.get(r),i=s?s.size:0,a=this.Mr(t);return this.docs=this.docs.insert(r,{document:t.mutableCopy(),size:a}),this.size+=a-i,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const r=this.docs.get(t);return L.resolve(r?r.document.mutableCopy():Ze.newInvalidDocument(t))}getEntries(e,t){let r=Zt();return t.forEach(s=>{const i=this.docs.get(s);r=r.insert(s,i?i.document.mutableCopy():Ze.newInvalidDocument(s))}),L.resolve(r)}getDocumentsMatchingQuery(e,t,r,s){let i=Zt();const a=t.path,l=new q(a.child("")),c=this.docs.getIteratorFrom(l);for(;c.hasNext();){const{key:d,value:{document:f}}=c.getNext();if(!a.isPrefixOf(d.path))break;d.path.length>a.length+1||v0(y0(f),r)<=0||(s.has(f.key)||xo(t,f))&&(i=i.insert(f.key,f.mutableCopy()))}return L.resolve(i)}getAllFromCollectionGroup(e,t,r,s){Y()}Or(e,t){return L.forEach(this.docs,r=>t(r))}newChangeBuffer(e){return new O_(this)}getSize(e){return L.resolve(this.size)}}class O_ extends R_{constructor(e){super(),this.cr=e}applyChanges(e){const t=[];return this.changes.forEach((r,s)=>{s.isValidDocument()?t.push(this.cr.addEntry(e,s)):this.cr.removeEntry(r)}),L.waitFor(t)}getFromCache(e,t){return this.cr.getEntry(e,t)}getAllFromCache(e,t){return this.cr.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class V_{constructor(e){this.persistence=e,this.Nr=new ns(t=>Tl(t),Il),this.lastRemoteSnapshotVersion=G.min(),this.highestTargetId=0,this.Lr=0,this.Br=new Cl,this.targetCount=0,this.kr=Yr.Bn()}forEachTarget(e,t){return this.Nr.forEach((r,s)=>t(s)),L.resolve()}getLastRemoteSnapshotVersion(e){return L.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return L.resolve(this.Lr)}allocateTargetId(e){return this.highestTargetId=this.kr.next(),L.resolve(this.highestTargetId)}setTargetsMetadata(e,t,r){return r&&(this.lastRemoteSnapshotVersion=r),t>this.Lr&&(this.Lr=t),L.resolve()}Kn(e){this.Nr.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.kr=new Yr(t),this.highestTargetId=t),e.sequenceNumber>this.Lr&&(this.Lr=e.sequenceNumber)}addTargetData(e,t){return this.Kn(t),this.targetCount+=1,L.resolve()}updateTargetData(e,t){return this.Kn(t),L.resolve()}removeTargetData(e,t){return this.Nr.delete(t.target),this.Br.gr(t.targetId),this.targetCount-=1,L.resolve()}removeTargets(e,t,r){let s=0;const i=[];return this.Nr.forEach((a,l)=>{l.sequenceNumber<=t&&r.get(l.targetId)===null&&(this.Nr.delete(a),i.push(this.removeMatchingKeysForTargetId(e,l.targetId)),s++)}),L.waitFor(i).next(()=>s)}getTargetCount(e){return L.resolve(this.targetCount)}getTargetData(e,t){const r=this.Nr.get(t)||null;return L.resolve(r)}addMatchingKeys(e,t,r){return this.Br.Rr(t,r),L.resolve()}removeMatchingKeys(e,t,r){this.Br.mr(t,r);const s=this.persistence.referenceDelegate,i=[];return s&&t.forEach(a=>{i.push(s.markPotentiallyOrphaned(e,a))}),L.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this.Br.gr(t),L.resolve()}getMatchingKeysForTargetId(e,t){const r=this.Br.yr(t);return L.resolve(r)}containsKey(e,t){return L.resolve(this.Br.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class B_{constructor(e,t){this.qr={},this.overlays={},this.Qr=new _l(0),this.Kr=!1,this.Kr=!0,this.$r=new M_,this.referenceDelegate=e(this),this.Ur=new V_(this),this.indexManager=new A_,this.remoteDocumentCache=function(s){return new L_(s)}(r=>this.referenceDelegate.Wr(r)),this.serializer=new I_(t),this.Gr=new k_(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Kr=!1,Promise.resolve()}get started(){return this.Kr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new D_,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let r=this.qr[e.toKey()];return r||(r=new N_(t,this.referenceDelegate),this.qr[e.toKey()]=r),r}getGlobalsCache(){return this.$r}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Gr}runTransaction(e,t,r){$("MemoryPersistence","Starting transaction:",e);const s=new F_(this.Qr.next());return this.referenceDelegate.zr(),r(s).next(i=>this.referenceDelegate.jr(s).next(()=>i)).toPromise().then(i=>(s.raiseOnCommittedEvent(),i))}Hr(e,t){return L.or(Object.values(this.qr).map(r=>()=>r.containsKey(e,t)))}}class F_ extends w0{constructor(e){super(),this.currentSequenceNumber=e}}class kl{constructor(e){this.persistence=e,this.Jr=new Cl,this.Yr=null}static Zr(e){return new kl(e)}get Xr(){if(this.Yr)return this.Yr;throw Y()}addReference(e,t,r){return this.Jr.addReference(r,t),this.Xr.delete(r.toString()),L.resolve()}removeReference(e,t,r){return this.Jr.removeReference(r,t),this.Xr.add(r.toString()),L.resolve()}markPotentiallyOrphaned(e,t){return this.Xr.add(t.toString()),L.resolve()}removeTarget(e,t){this.Jr.gr(t.targetId).forEach(s=>this.Xr.add(s.toString()));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,t.targetId).next(s=>{s.forEach(i=>this.Xr.add(i.toString()))}).next(()=>r.removeTargetData(e,t))}zr(){this.Yr=new Set}jr(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return L.forEach(this.Xr,r=>{const s=q.fromPath(r);return this.ei(e,s).next(i=>{i||t.removeEntry(s,G.min())})}).next(()=>(this.Yr=null,t.apply(e)))}updateLimboDocument(e,t){return this.ei(e,t).next(r=>{r?this.Xr.delete(t.toString()):this.Xr.add(t.toString())})}Wr(e){return 0}ei(e,t){return L.or([()=>L.resolve(this.Jr.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Hr(e,t)])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dl{constructor(e,t,r,s){this.targetId=e,this.fromCache=t,this.$i=r,this.Ui=s}static Wi(e,t){let r=ee(),s=ee();for(const i of t.docChanges)switch(i.type){case 0:r=r.add(i.doc.key);break;case 1:s=s.add(i.doc.key)}return new Dl(e,t.fromCache,r,s)}}/**
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
 */class z_{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
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
 */class $_{constructor(){this.Gi=!1,this.zi=!1,this.ji=100,this.Hi=function(){return Tm()?8:E0(tt())>0?6:4}()}initialize(e,t){this.Ji=e,this.indexManager=t,this.Gi=!0}getDocumentsMatchingQuery(e,t,r,s){const i={result:null};return this.Yi(e,t).next(a=>{i.result=a}).next(()=>{if(!i.result)return this.Zi(e,t,s,r).next(a=>{i.result=a})}).next(()=>{if(i.result)return;const a=new z_;return this.Xi(e,t,a).next(l=>{if(i.result=l,this.zi)return this.es(e,t,a,l.size)})}).next(()=>i.result)}es(e,t,r,s){return r.documentReadCount<this.ji?(Ts()<=te.DEBUG&&$("QueryEngine","SDK will not create cache indexes for query:",Rr(t),"since it only creates cache indexes for collection contains","more than or equal to",this.ji,"documents"),L.resolve()):(Ts()<=te.DEBUG&&$("QueryEngine","Query:",Rr(t),"scans",r.documentReadCount,"local documents and returns",s,"documents as results."),r.documentReadCount>this.Hi*s?(Ts()<=te.DEBUG&&$("QueryEngine","The SDK decides to create cache indexes for query:",Rr(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,Ct(t))):L.resolve())}Yi(e,t){if(Uu(t))return L.resolve(null);let r=Ct(t);return this.indexManager.getIndexType(e,r).next(s=>s===0?null:(t.limit!==null&&s===1&&(t=co(t,null,"F"),r=Ct(t)),this.indexManager.getDocumentsMatchingTarget(e,r).next(i=>{const a=ee(...i);return this.Ji.getDocuments(e,a).next(l=>this.indexManager.getMinOffset(e,r).next(c=>{const d=this.ts(t,l);return this.ns(t,d,a,c.readTime)?this.Yi(e,co(t,null,"F")):this.rs(e,d,t,c)}))})))}Zi(e,t,r,s){return Uu(t)||s.isEqual(G.min())?L.resolve(null):this.Ji.getDocuments(e,r).next(i=>{const a=this.ts(t,i);return this.ns(t,a,r,s)?L.resolve(null):(Ts()<=te.DEBUG&&$("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),Rr(t)),this.rs(e,a,t,g0(s,-1)).next(l=>l))})}ts(e,t){let r=new We(qh(e));return t.forEach((s,i)=>{xo(e,i)&&(r=r.add(i))}),r}ns(e,t,r,s){if(e.limit===null)return!1;if(r.size!==t.size)return!0;const i=e.limitType==="F"?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(s)>0)}Xi(e,t,r){return Ts()<=te.DEBUG&&$("QueryEngine","Using full collection scan to execute query:",Rr(t)),this.Ji.getDocumentsMatchingQuery(e,t,Tn.min(),r)}rs(e,t,r,s){return this.Ji.getDocumentsMatchingQuery(e,r,s).next(i=>(t.forEach(a=>{i=i.insert(a.key,a)}),i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class U_{constructor(e,t,r,s){this.persistence=e,this.ss=t,this.serializer=s,this.os=new _e(se),this._s=new ns(i=>Tl(i),Il),this.us=new Map,this.cs=e.getRemoteDocumentCache(),this.Ur=e.getTargetCache(),this.Gr=e.getBundleCache(),this.ls(r)}ls(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new C_(this.cs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.cs.setIndexManager(this.indexManager),this.ss.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.os))}}function q_(n,e,t,r){return new U_(n,e,t,r)}async function df(n,e){const t=K(n);return await t.persistence.runTransaction("Handle user change","readonly",r=>{let s;return t.mutationQueue.getAllMutationBatches(r).next(i=>(s=i,t.ls(e),t.mutationQueue.getAllMutationBatches(r))).next(i=>{const a=[],l=[];let c=ee();for(const d of s){a.push(d.batchId);for(const f of d.mutations)c=c.add(f.key)}for(const d of i){l.push(d.batchId);for(const f of d.mutations)c=c.add(f.key)}return t.localDocuments.getDocuments(r,c).next(d=>({hs:d,removedBatchIds:a,addedBatchIds:l}))})})}function j_(n,e){const t=K(n);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",r=>{const s=e.batch.keys(),i=t.cs.newChangeBuffer({trackRemovals:!0});return function(l,c,d,f){const m=d.batch,v=m.keys();let E=L.resolve();return v.forEach(T=>{E=E.next(()=>f.getEntry(c,T)).next(x=>{const R=d.docVersions.get(T);le(R!==null),x.version.compareTo(R)<0&&(m.applyToRemoteDocument(x,d),x.isValidDocument()&&(x.setReadTime(d.commitVersion),f.addEntry(x)))})}),E.next(()=>l.mutationQueue.removeMutationBatch(c,m))}(t,r,e,i).next(()=>i.apply(r)).next(()=>t.mutationQueue.performConsistencyCheck(r)).next(()=>t.documentOverlayCache.removeOverlaysForBatchId(r,s,e.batch.batchId)).next(()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,function(l){let c=ee();for(let d=0;d<l.mutationResults.length;++d)l.mutationResults[d].transformResults.length>0&&(c=c.add(l.batch.mutations[d].key));return c}(e))).next(()=>t.localDocuments.getDocuments(r,s))})}function hf(n){const e=K(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",t=>e.Ur.getLastRemoteSnapshotVersion(t))}function H_(n,e){const t=K(n),r=e.snapshotVersion;let s=t.os;return t.persistence.runTransaction("Apply remote event","readwrite-primary",i=>{const a=t.cs.newChangeBuffer({trackRemovals:!0});s=t.os;const l=[];e.targetChanges.forEach((f,m)=>{const v=s.get(m);if(!v)return;l.push(t.Ur.removeMatchingKeys(i,f.removedDocuments,m).next(()=>t.Ur.addMatchingKeys(i,f.addedDocuments,m)));let E=v.withSequenceNumber(i.currentSequenceNumber);e.targetMismatches.get(m)!==null?E=E.withResumeToken(Ye.EMPTY_BYTE_STRING,G.min()).withLastLimboFreeSnapshotVersion(G.min()):f.resumeToken.approximateByteSize()>0&&(E=E.withResumeToken(f.resumeToken,r)),s=s.insert(m,E),function(x,R,A){return x.resumeToken.approximateByteSize()===0||R.snapshotVersion.toMicroseconds()-x.snapshotVersion.toMicroseconds()>=3e8?!0:A.addedDocuments.size+A.modifiedDocuments.size+A.removedDocuments.size>0}(v,E,f)&&l.push(t.Ur.updateTargetData(i,E))});let c=Zt(),d=ee();if(e.documentUpdates.forEach(f=>{e.resolvedLimboDocuments.has(f)&&l.push(t.persistence.referenceDelegate.updateLimboDocument(i,f))}),l.push(W_(i,a,e.documentUpdates).next(f=>{c=f.Ps,d=f.Is})),!r.isEqual(G.min())){const f=t.Ur.getLastRemoteSnapshotVersion(i).next(m=>t.Ur.setTargetsMetadata(i,i.currentSequenceNumber,r));l.push(f)}return L.waitFor(l).next(()=>a.apply(i)).next(()=>t.localDocuments.getLocalViewOfDocuments(i,c,d)).next(()=>c)}).then(i=>(t.os=s,i))}function W_(n,e,t){let r=ee(),s=ee();return t.forEach(i=>r=r.add(i)),e.getEntries(n,r).next(i=>{let a=Zt();return t.forEach((l,c)=>{const d=i.get(l);c.isFoundDocument()!==d.isFoundDocument()&&(s=s.add(l)),c.isNoDocument()&&c.version.isEqual(G.min())?(e.removeEntry(l,c.readTime),a=a.insert(l,c)):!d.isValidDocument()||c.version.compareTo(d.version)>0||c.version.compareTo(d.version)===0&&d.hasPendingWrites?(e.addEntry(c),a=a.insert(l,c)):$("LocalStore","Ignoring outdated watch update for ",l,". Current version:",d.version," Watch version:",c.version)}),{Ps:a,Is:s}})}function Y_(n,e){const t=K(n);return t.persistence.runTransaction("Get next mutation batch","readonly",r=>(e===void 0&&(e=-1),t.mutationQueue.getNextMutationBatchAfterBatchId(r,e)))}function G_(n,e){const t=K(n);return t.persistence.runTransaction("Allocate target","readwrite",r=>{let s;return t.Ur.getTargetData(r,e).next(i=>i?(s=i,L.resolve(s)):t.Ur.allocateTargetId(r).next(a=>(s=new mn(e,a,"TargetPurposeListen",r.currentSequenceNumber),t.Ur.addTargetData(r,s).next(()=>s))))}).then(r=>{const s=t.os.get(r.targetId);return(s===null||r.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(t.os=t.os.insert(r.targetId,r),t._s.set(e,r.targetId)),r})}async function Wa(n,e,t){const r=K(n),s=r.os.get(e),i=t?"readwrite":"readwrite-primary";try{t||await r.persistence.runTransaction("Release target",i,a=>r.persistence.referenceDelegate.removeTarget(a,s))}catch(a){if(!oi(a))throw a;$("LocalStore",`Failed to update sequence numbers for target ${e}: ${a}`)}r.os=r.os.remove(e),r._s.delete(s.target)}function Zu(n,e,t){const r=K(n);let s=G.min(),i=ee();return r.persistence.runTransaction("Execute query","readwrite",a=>function(c,d,f){const m=K(c),v=m._s.get(f);return v!==void 0?L.resolve(m.os.get(v)):m.Ur.getTargetData(d,f)}(r,a,Ct(e)).next(l=>{if(l)return s=l.lastLimboFreeSnapshotVersion,r.Ur.getMatchingKeysForTargetId(a,l.targetId).next(c=>{i=c})}).next(()=>r.ss.getDocumentsMatchingQuery(a,e,t?s:G.min(),t?i:ee())).next(l=>(K_(r,F0(e),l),{documents:l,Ts:i})))}function K_(n,e,t){let r=n.us.get(e)||G.min();t.forEach((s,i)=>{i.readTime.compareTo(r)>0&&(r=i.readTime)}),n.us.set(e,r)}class ed{constructor(){this.activeTargetIds=H0()}fs(e){this.activeTargetIds=this.activeTargetIds.add(e)}gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Vs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class Q_{constructor(){this.so=new ed,this.oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,r){}addLocalQueryTarget(e,t=!0){return t&&this.so.fs(e),this.oo[e]||"not-current"}updateQueryState(e,t,r){this.oo[e]=t}removeLocalQueryTarget(e){this.so.gs(e)}isLocalQueryTarget(e){return this.so.activeTargetIds.has(e)}clearQueryState(e){delete this.oo[e]}getAllActiveQueryTargets(){return this.so.activeTargetIds}isActiveQueryTarget(e){return this.so.activeTargetIds.has(e)}start(){return this.so=new ed,Promise.resolve()}handleUserChange(e,t,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
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
 */class J_{_o(e){}shutdown(){}}/**
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
 */class td{constructor(){this.ao=()=>this.uo(),this.co=()=>this.lo(),this.ho=[],this.Po()}_o(e){this.ho.push(e)}shutdown(){window.removeEventListener("online",this.ao),window.removeEventListener("offline",this.co)}Po(){window.addEventListener("online",this.ao),window.addEventListener("offline",this.co)}uo(){$("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const e of this.ho)e(0)}lo(){$("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const e of this.ho)e(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
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
 */let zi=null;function ga(){return zi===null?zi=function(){return 268435456+Math.round(2147483648*Math.random())}():zi++,"0x"+zi.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const X_={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Z_{constructor(e){this.Io=e.Io,this.To=e.To}Eo(e){this.Ao=e}Ro(e){this.Vo=e}mo(e){this.fo=e}onMessage(e){this.po=e}close(){this.To()}send(e){this.Io(e)}yo(){this.Ao()}wo(){this.Vo()}So(e){this.fo(e)}bo(e){this.po(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qe="WebChannelConnection";class ew extends class{constructor(t){this.databaseInfo=t,this.databaseId=t.databaseId;const r=t.ssl?"https":"http",s=encodeURIComponent(this.databaseId.projectId),i=encodeURIComponent(this.databaseId.database);this.Do=r+"://"+t.host,this.vo=`projects/${s}/databases/${i}`,this.Co=this.databaseId.database==="(default)"?`project_id=${s}`:`project_id=${s}&database_id=${i}`}get Fo(){return!1}Mo(t,r,s,i,a){const l=ga(),c=this.xo(t,r.toUriEncodedString());$("RestConnection",`Sending RPC '${t}' ${l}:`,c,s);const d={"google-cloud-resource-prefix":this.vo,"x-goog-request-params":this.Co};return this.Oo(d,i,a),this.No(t,c,d,s).then(f=>($("RestConnection",`Received RPC '${t}' ${l}: `,f),f),f=>{throw qr("RestConnection",`RPC '${t}' ${l} failed with error: `,f,"url: ",c,"request:",s),f})}Lo(t,r,s,i,a,l){return this.Mo(t,r,s,i,a)}Oo(t,r,s){t["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+es}(),t["Content-Type"]="text/plain",this.databaseInfo.appId&&(t["X-Firebase-GMPID"]=this.databaseInfo.appId),r&&r.headers.forEach((i,a)=>t[a]=i),s&&s.headers.forEach((i,a)=>t[a]=i)}xo(t,r){const s=X_[t];return`${this.Do}/v1/${r}:${s}`}terminate(){}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}No(e,t,r,s){const i=ga();return new Promise((a,l)=>{const c=new Sh;c.setWithCredentials(!0),c.listenOnce(Ah.COMPLETE,()=>{try{switch(c.getLastErrorCode()){case Hi.NO_ERROR:const f=c.getResponseJson();$(Qe,`XHR for RPC '${e}' ${i} received:`,JSON.stringify(f)),a(f);break;case Hi.TIMEOUT:$(Qe,`RPC '${e}' ${i} timed out`),l(new z(M.DEADLINE_EXCEEDED,"Request time out"));break;case Hi.HTTP_ERROR:const m=c.getStatus();if($(Qe,`RPC '${e}' ${i} failed with status:`,m,"response text:",c.getResponseText()),m>0){let v=c.getResponseJson();Array.isArray(v)&&(v=v[0]);const E=v==null?void 0:v.error;if(E&&E.status&&E.message){const T=function(R){const A=R.toLowerCase().replace(/_/g,"-");return Object.values(M).indexOf(A)>=0?A:M.UNKNOWN}(E.status);l(new z(T,E.message))}else l(new z(M.UNKNOWN,"Server responded with status "+c.getStatus()))}else l(new z(M.UNAVAILABLE,"Connection failed."));break;default:Y()}}finally{$(Qe,`RPC '${e}' ${i} completed.`)}});const d=JSON.stringify(s);$(Qe,`RPC '${e}' ${i} sending request:`,s),c.send(t,"POST",d,r,15)})}Bo(e,t,r){const s=ga(),i=[this.Do,"/","google.firestore.v1.Firestore","/",e,"/channel"],a=Ph(),l=Rh(),c={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},d=this.longPollingOptions.timeoutSeconds;d!==void 0&&(c.longPollingTimeout=Math.round(1e3*d)),this.useFetchStreams&&(c.useFetchStreams=!0),this.Oo(c.initMessageHeaders,t,r),c.encodeInitMessageHeaders=!0;const f=i.join("");$(Qe,`Creating RPC '${e}' stream ${s}: ${f}`,c);const m=a.createWebChannel(f,c);let v=!1,E=!1;const T=new Z_({Io:R=>{E?$(Qe,`Not sending because RPC '${e}' stream ${s} is closed:`,R):(v||($(Qe,`Opening RPC '${e}' stream ${s} transport.`),m.open(),v=!0),$(Qe,`RPC '${e}' stream ${s} sending:`,R),m.send(R))},To:()=>m.close()}),x=(R,A,D)=>{R.listen(A,N=>{try{D(N)}catch(C){setTimeout(()=>{throw C},0)}})};return x(m,xs.EventType.OPEN,()=>{E||($(Qe,`RPC '${e}' stream ${s} transport opened.`),T.yo())}),x(m,xs.EventType.CLOSE,()=>{E||(E=!0,$(Qe,`RPC '${e}' stream ${s} transport closed`),T.So())}),x(m,xs.EventType.ERROR,R=>{E||(E=!0,qr(Qe,`RPC '${e}' stream ${s} transport errored:`,R),T.So(new z(M.UNAVAILABLE,"The operation could not be completed")))}),x(m,xs.EventType.MESSAGE,R=>{var A;if(!E){const D=R.data[0];le(!!D);const N=D,C=N.error||((A=N[0])===null||A===void 0?void 0:A.error);if(C){$(Qe,`RPC '${e}' stream ${s} received error:`,C);const O=C.status;let V=function(y){const _=Ce[y];if(_!==void 0)return ef(_)}(O),b=C.message;V===void 0&&(V=M.INTERNAL,b="Unknown error status: "+O+" with message "+C.message),E=!0,T.So(new z(V,b)),m.close()}else $(Qe,`RPC '${e}' stream ${s} received:`,D),T.bo(D)}}),x(l,xh.STAT_EVENT,R=>{R.stat===Oa.PROXY?$(Qe,`RPC '${e}' stream ${s} detected buffering proxy`):R.stat===Oa.NOPROXY&&$(Qe,`RPC '${e}' stream ${s} detected no buffering proxy`)}),setTimeout(()=>{T.wo()},0),T}}function ya(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Do(n){return new u_(n,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ff{constructor(e,t,r=1e3,s=1.5,i=6e4){this.ui=e,this.timerId=t,this.ko=r,this.qo=s,this.Qo=i,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(e){this.cancel();const t=Math.floor(this.Ko+this.zo()),r=Math.max(0,Date.now()-this.Uo),s=Math.max(0,t-r);s>0&&$("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.Ko} ms, delay with jitter: ${t} ms, last attempt: ${r} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,s,()=>(this.Uo=Date.now(),e())),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){this.$o!==null&&(this.$o.skipDelay(),this.$o=null)}cancel(){this.$o!==null&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pf{constructor(e,t,r,s,i,a,l,c){this.ui=e,this.Ho=r,this.Jo=s,this.connection=i,this.authCredentialsProvider=a,this.appCheckCredentialsProvider=l,this.listener=c,this.state=0,this.Yo=0,this.Zo=null,this.Xo=null,this.stream=null,this.e_=0,this.t_=new ff(e,t)}n_(){return this.state===1||this.state===5||this.r_()}r_(){return this.state===2||this.state===3}start(){this.e_=0,this.state!==4?this.auth():this.i_()}async stop(){this.n_()&&await this.close(0)}s_(){this.state=0,this.t_.reset()}o_(){this.r_()&&this.Zo===null&&(this.Zo=this.ui.enqueueAfterDelay(this.Ho,6e4,()=>this.__()))}a_(e){this.u_(),this.stream.send(e)}async __(){if(this.r_())return this.close(0)}u_(){this.Zo&&(this.Zo.cancel(),this.Zo=null)}c_(){this.Xo&&(this.Xo.cancel(),this.Xo=null)}async close(e,t){this.u_(),this.c_(),this.t_.cancel(),this.Yo++,e!==4?this.t_.reset():t&&t.code===M.RESOURCE_EXHAUSTED?(Xt(t.toString()),Xt("Using maximum backoff delay to prevent overloading the backend."),this.t_.Wo()):t&&t.code===M.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.l_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.mo(t)}l_(){}auth(){this.state=1;const e=this.h_(this.Yo),t=this.Yo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([r,s])=>{this.Yo===t&&this.P_(r,s)},r=>{e(()=>{const s=new z(M.UNKNOWN,"Fetching auth token failed: "+r.message);return this.I_(s)})})}P_(e,t){const r=this.h_(this.Yo);this.stream=this.T_(e,t),this.stream.Eo(()=>{r(()=>this.listener.Eo())}),this.stream.Ro(()=>{r(()=>(this.state=2,this.Xo=this.ui.enqueueAfterDelay(this.Jo,1e4,()=>(this.r_()&&(this.state=3),Promise.resolve())),this.listener.Ro()))}),this.stream.mo(s=>{r(()=>this.I_(s))}),this.stream.onMessage(s=>{r(()=>++this.e_==1?this.E_(s):this.onNext(s))})}i_(){this.state=5,this.t_.Go(async()=>{this.state=0,this.start()})}I_(e){return $("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}h_(e){return t=>{this.ui.enqueueAndForget(()=>this.Yo===e?t():($("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class tw extends pf{constructor(e,t,r,s,i,a){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,r,s,a),this.serializer=i}T_(e,t){return this.connection.Bo("Listen",e,t)}E_(e){return this.onNext(e)}onNext(e){this.t_.reset();const t=f_(this.serializer,e),r=function(i){if(!("targetChange"in i))return G.min();const a=i.targetChange;return a.targetIds&&a.targetIds.length?G.min():a.readTime?kt(a.readTime):G.min()}(e);return this.listener.d_(t,r)}A_(e){const t={};t.database=Ha(this.serializer),t.addTarget=function(i,a){let l;const c=a.target;if(l=za(c)?{documents:g_(i,c)}:{query:y_(i,c)._t},l.targetId=a.targetId,a.resumeToken.approximateByteSize()>0){l.resumeToken=rf(i,a.resumeToken);const d=Ua(i,a.expectedCount);d!==null&&(l.expectedCount=d)}else if(a.snapshotVersion.compareTo(G.min())>0){l.readTime=fo(i,a.snapshotVersion.toTimestamp());const d=Ua(i,a.expectedCount);d!==null&&(l.expectedCount=d)}return l}(this.serializer,e);const r=__(this.serializer,e);r&&(t.labels=r),this.a_(t)}R_(e){const t={};t.database=Ha(this.serializer),t.removeTarget=e,this.a_(t)}}class nw extends pf{constructor(e,t,r,s,i,a){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,r,s,a),this.serializer=i}get V_(){return this.e_>0}start(){this.lastStreamToken=void 0,super.start()}l_(){this.V_&&this.m_([])}T_(e,t){return this.connection.Bo("Write",e,t)}E_(e){return le(!!e.streamToken),this.lastStreamToken=e.streamToken,le(!e.writeResults||e.writeResults.length===0),this.listener.f_()}onNext(e){le(!!e.streamToken),this.lastStreamToken=e.streamToken,this.t_.reset();const t=m_(e.writeResults,e.commitTime),r=kt(e.commitTime);return this.listener.g_(r,t)}p_(){const e={};e.database=Ha(this.serializer),this.a_(e)}m_(e){const t={streamToken:this.lastStreamToken,writes:e.map(r=>p_(this.serializer,r))};this.a_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rw extends class{}{constructor(e,t,r,s){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=r,this.serializer=s,this.y_=!1}w_(){if(this.y_)throw new z(M.FAILED_PRECONDITION,"The client has already been terminated.")}Mo(e,t,r,s){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([i,a])=>this.connection.Mo(e,qa(t,r),s,i,a)).catch(i=>{throw i.name==="FirebaseError"?(i.code===M.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new z(M.UNKNOWN,i.toString())})}Lo(e,t,r,s,i){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([a,l])=>this.connection.Lo(e,qa(t,r),s,a,l,i)).catch(a=>{throw a.name==="FirebaseError"?(a.code===M.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new z(M.UNKNOWN,a.toString())})}terminate(){this.y_=!0,this.connection.terminate()}}class sw{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.S_=0,this.b_=null,this.D_=!0}v_(){this.S_===0&&(this.C_("Unknown"),this.b_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.b_=null,this.F_("Backend didn't respond within 10 seconds."),this.C_("Offline"),Promise.resolve())))}M_(e){this.state==="Online"?this.C_("Unknown"):(this.S_++,this.S_>=1&&(this.x_(),this.F_(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.C_("Offline")))}set(e){this.x_(),this.S_=0,e==="Online"&&(this.D_=!1),this.C_(e)}C_(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}F_(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.D_?(Xt(t),this.D_=!1):$("OnlineStateTracker",t)}x_(){this.b_!==null&&(this.b_.cancel(),this.b_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iw{constructor(e,t,r,s,i){this.localStore=e,this.datastore=t,this.asyncQueue=r,this.remoteSyncer={},this.O_=[],this.N_=new Map,this.L_=new Set,this.B_=[],this.k_=i,this.k_._o(a=>{r.enqueueAndForget(async()=>{sr(this)&&($("RemoteStore","Restarting streams for network reachability change."),await async function(c){const d=K(c);d.L_.add(4),await ci(d),d.q_.set("Unknown"),d.L_.delete(4),await Mo(d)}(this))})}),this.q_=new sw(r,s)}}async function Mo(n){if(sr(n))for(const e of n.B_)await e(!0)}async function ci(n){for(const e of n.B_)await e(!1)}function mf(n,e){const t=K(n);t.N_.has(e.targetId)||(t.N_.set(e.targetId,e),Ol(t)?Ll(t):rs(t).r_()&&Nl(t,e))}function Ml(n,e){const t=K(n),r=rs(t);t.N_.delete(e),r.r_()&&gf(t,e),t.N_.size===0&&(r.r_()?r.o_():sr(t)&&t.q_.set("Unknown"))}function Nl(n,e){if(n.Q_.xe(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(G.min())>0){const t=n.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}rs(n).A_(e)}function gf(n,e){n.Q_.xe(e),rs(n).R_(e)}function Ll(n){n.Q_=new o_({getRemoteKeysForTarget:e=>n.remoteSyncer.getRemoteKeysForTarget(e),ot:e=>n.N_.get(e)||null,tt:()=>n.datastore.serializer.databaseId}),rs(n).start(),n.q_.v_()}function Ol(n){return sr(n)&&!rs(n).n_()&&n.N_.size>0}function sr(n){return K(n).L_.size===0}function yf(n){n.Q_=void 0}async function ow(n){n.q_.set("Online")}async function aw(n){n.N_.forEach((e,t)=>{Nl(n,e)})}async function lw(n,e){yf(n),Ol(n)?(n.q_.M_(e),Ll(n)):n.q_.set("Unknown")}async function cw(n,e,t){if(n.q_.set("Online"),e instanceof nf&&e.state===2&&e.cause)try{await async function(s,i){const a=i.cause;for(const l of i.targetIds)s.N_.has(l)&&(await s.remoteSyncer.rejectListen(l,a),s.N_.delete(l),s.Q_.removeTarget(l))}(n,e)}catch(r){$("RemoteStore","Failed to remove targets %s: %s ",e.targetIds.join(","),r),await po(n,r)}else if(e instanceof Gi?n.Q_.Ke(e):e instanceof tf?n.Q_.He(e):n.Q_.We(e),!t.isEqual(G.min()))try{const r=await hf(n.localStore);t.compareTo(r)>=0&&await function(i,a){const l=i.Q_.rt(a);return l.targetChanges.forEach((c,d)=>{if(c.resumeToken.approximateByteSize()>0){const f=i.N_.get(d);f&&i.N_.set(d,f.withResumeToken(c.resumeToken,a))}}),l.targetMismatches.forEach((c,d)=>{const f=i.N_.get(c);if(!f)return;i.N_.set(c,f.withResumeToken(Ye.EMPTY_BYTE_STRING,f.snapshotVersion)),gf(i,c);const m=new mn(f.target,c,d,f.sequenceNumber);Nl(i,m)}),i.remoteSyncer.applyRemoteEvent(l)}(n,t)}catch(r){$("RemoteStore","Failed to raise snapshot:",r),await po(n,r)}}async function po(n,e,t){if(!oi(e))throw e;n.L_.add(1),await ci(n),n.q_.set("Offline"),t||(t=()=>hf(n.localStore)),n.asyncQueue.enqueueRetryable(async()=>{$("RemoteStore","Retrying IndexedDB access"),await t(),n.L_.delete(1),await Mo(n)})}function vf(n,e){return e().catch(t=>po(n,t,e))}async function No(n){const e=K(n),t=Sn(e);let r=e.O_.length>0?e.O_[e.O_.length-1].batchId:-1;for(;uw(e);)try{const s=await Y_(e.localStore,r);if(s===null){e.O_.length===0&&t.o_();break}r=s.batchId,dw(e,s)}catch(s){await po(e,s)}_f(e)&&wf(e)}function uw(n){return sr(n)&&n.O_.length<10}function dw(n,e){n.O_.push(e);const t=Sn(n);t.r_()&&t.V_&&t.m_(e.mutations)}function _f(n){return sr(n)&&!Sn(n).n_()&&n.O_.length>0}function wf(n){Sn(n).start()}async function hw(n){Sn(n).p_()}async function fw(n){const e=Sn(n);for(const t of n.O_)e.m_(t.mutations)}async function pw(n,e,t){const r=n.O_.shift(),s=xl.from(r,e,t);await vf(n,()=>n.remoteSyncer.applySuccessfulWrite(s)),await No(n)}async function mw(n,e){e&&Sn(n).V_&&await async function(r,s){if(function(a){return r_(a)&&a!==M.ABORTED}(s.code)){const i=r.O_.shift();Sn(r).s_(),await vf(r,()=>r.remoteSyncer.rejectFailedWrite(i.batchId,s)),await No(r)}}(n,e),_f(n)&&wf(n)}async function nd(n,e){const t=K(n);t.asyncQueue.verifyOperationInProgress(),$("RemoteStore","RemoteStore received new credentials");const r=sr(t);t.L_.add(3),await ci(t),r&&t.q_.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.L_.delete(3),await Mo(t)}async function gw(n,e){const t=K(n);e?(t.L_.delete(2),await Mo(t)):e||(t.L_.add(2),await ci(t),t.q_.set("Unknown"))}function rs(n){return n.K_||(n.K_=function(t,r,s){const i=K(t);return i.w_(),new tw(r,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)}(n.datastore,n.asyncQueue,{Eo:ow.bind(null,n),Ro:aw.bind(null,n),mo:lw.bind(null,n),d_:cw.bind(null,n)}),n.B_.push(async e=>{e?(n.K_.s_(),Ol(n)?Ll(n):n.q_.set("Unknown")):(await n.K_.stop(),yf(n))})),n.K_}function Sn(n){return n.U_||(n.U_=function(t,r,s){const i=K(t);return i.w_(),new nw(r,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)}(n.datastore,n.asyncQueue,{Eo:()=>Promise.resolve(),Ro:hw.bind(null,n),mo:mw.bind(null,n),f_:fw.bind(null,n),g_:pw.bind(null,n)}),n.B_.push(async e=>{e?(n.U_.s_(),await No(n)):(await n.U_.stop(),n.O_.length>0&&($("RemoteStore",`Stopping write stream with ${n.O_.length} pending writes`),n.O_=[]))})),n.U_}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vl{constructor(e,t,r,s,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=r,this.op=s,this.removalCallback=i,this.deferred=new Kt,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(a=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,r,s,i){const a=Date.now()+r,l=new Vl(e,t,a,s,i);return l.start(r),l}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new z(M.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Bl(n,e){if(Xt("AsyncQueue",`${e}: ${n}`),oi(n))return new z(M.UNAVAILABLE,`${e}: ${n}`);throw n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Br{constructor(e){this.comparator=e?(t,r)=>e(t,r)||q.comparator(t.key,r.key):(t,r)=>q.comparator(t.key,r.key),this.keyedMap=Rs(),this.sortedSet=new _e(this.comparator)}static emptySet(e){return new Br(e.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((t,r)=>(e(t),!1))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof Br)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),r=e.sortedSet.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=r.getNext().key;if(!s.isEqual(i))return!1}return!0}toString(){const e=[];return this.forEach(t=>{e.push(t.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const r=new Br;return r.comparator=this.comparator,r.keyedMap=e,r.sortedSet=t,r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rd{constructor(){this.W_=new _e(q.comparator)}track(e){const t=e.doc.key,r=this.W_.get(t);r?e.type!==0&&r.type===3?this.W_=this.W_.insert(t,e):e.type===3&&r.type!==1?this.W_=this.W_.insert(t,{type:r.type,doc:e.doc}):e.type===2&&r.type===2?this.W_=this.W_.insert(t,{type:2,doc:e.doc}):e.type===2&&r.type===0?this.W_=this.W_.insert(t,{type:0,doc:e.doc}):e.type===1&&r.type===0?this.W_=this.W_.remove(t):e.type===1&&r.type===2?this.W_=this.W_.insert(t,{type:1,doc:r.doc}):e.type===0&&r.type===1?this.W_=this.W_.insert(t,{type:2,doc:e.doc}):Y():this.W_=this.W_.insert(t,e)}G_(){const e=[];return this.W_.inorderTraversal((t,r)=>{e.push(r)}),e}}class Gr{constructor(e,t,r,s,i,a,l,c,d){this.query=e,this.docs=t,this.oldDocs=r,this.docChanges=s,this.mutatedKeys=i,this.fromCache=a,this.syncStateChanged=l,this.excludesMetadataChanges=c,this.hasCachedResults=d}static fromInitialDocuments(e,t,r,s,i){const a=[];return t.forEach(l=>{a.push({type:0,doc:l})}),new Gr(e,t,Br.emptySet(t),a,r,s,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Ao(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,r=e.docChanges;if(t.length!==r.length)return!1;for(let s=0;s<t.length;s++)if(t[s].type!==r[s].type||!t[s].doc.isEqual(r[s].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yw{constructor(){this.z_=void 0,this.j_=[]}H_(){return this.j_.some(e=>e.J_())}}class vw{constructor(){this.queries=sd(),this.onlineState="Unknown",this.Y_=new Set}terminate(){(function(t,r){const s=K(t),i=s.queries;s.queries=sd(),i.forEach((a,l)=>{for(const c of l.j_)c.onError(r)})})(this,new z(M.ABORTED,"Firestore shutting down"))}}function sd(){return new ns(n=>Uh(n),Ao)}async function Ef(n,e){const t=K(n);let r=3;const s=e.query;let i=t.queries.get(s);i?!i.H_()&&e.J_()&&(r=2):(i=new yw,r=e.J_()?0:1);try{switch(r){case 0:i.z_=await t.onListen(s,!0);break;case 1:i.z_=await t.onListen(s,!1);break;case 2:await t.onFirstRemoteStoreListen(s)}}catch(a){const l=Bl(a,`Initialization of query '${Rr(e.query)}' failed`);return void e.onError(l)}t.queries.set(s,i),i.j_.push(e),e.Z_(t.onlineState),i.z_&&e.X_(i.z_)&&Fl(t)}async function bf(n,e){const t=K(n),r=e.query;let s=3;const i=t.queries.get(r);if(i){const a=i.j_.indexOf(e);a>=0&&(i.j_.splice(a,1),i.j_.length===0?s=e.J_()?0:1:!i.H_()&&e.J_()&&(s=2))}switch(s){case 0:return t.queries.delete(r),t.onUnlisten(r,!0);case 1:return t.queries.delete(r),t.onUnlisten(r,!1);case 2:return t.onLastRemoteStoreUnlisten(r);default:return}}function _w(n,e){const t=K(n);let r=!1;for(const s of e){const i=s.query,a=t.queries.get(i);if(a){for(const l of a.j_)l.X_(s)&&(r=!0);a.z_=s}}r&&Fl(t)}function ww(n,e,t){const r=K(n),s=r.queries.get(e);if(s)for(const i of s.j_)i.onError(t);r.queries.delete(e)}function Fl(n){n.Y_.forEach(e=>{e.next()})}var Ya,id;(id=Ya||(Ya={})).ea="default",id.Cache="cache";class Tf{constructor(e,t,r){this.query=e,this.ta=t,this.na=!1,this.ra=null,this.onlineState="Unknown",this.options=r||{}}X_(e){if(!this.options.includeMetadataChanges){const r=[];for(const s of e.docChanges)s.type!==3&&r.push(s);e=new Gr(e.query,e.docs,e.oldDocs,r,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.na?this.ia(e)&&(this.ta.next(e),t=!0):this.sa(e,this.onlineState)&&(this.oa(e),t=!0),this.ra=e,t}onError(e){this.ta.error(e)}Z_(e){this.onlineState=e;let t=!1;return this.ra&&!this.na&&this.sa(this.ra,e)&&(this.oa(this.ra),t=!0),t}sa(e,t){if(!e.fromCache||!this.J_())return!0;const r=t!=="Offline";return(!this.options._a||!r)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}ia(e){if(e.docChanges.length>0)return!0;const t=this.ra&&this.ra.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}oa(e){e=Gr.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.na=!0,this.ta.next(e)}J_(){return this.options.source!==Ya.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class If{constructor(e){this.key=e}}class Sf{constructor(e){this.key=e}}class Ew{constructor(e,t){this.query=e,this.Ta=t,this.Ea=null,this.hasCachedResults=!1,this.current=!1,this.da=ee(),this.mutatedKeys=ee(),this.Aa=qh(e),this.Ra=new Br(this.Aa)}get Va(){return this.Ta}ma(e,t){const r=t?t.fa:new rd,s=t?t.Ra:this.Ra;let i=t?t.mutatedKeys:this.mutatedKeys,a=s,l=!1;const c=this.query.limitType==="F"&&s.size===this.query.limit?s.last():null,d=this.query.limitType==="L"&&s.size===this.query.limit?s.first():null;if(e.inorderTraversal((f,m)=>{const v=s.get(f),E=xo(this.query,m)?m:null,T=!!v&&this.mutatedKeys.has(v.key),x=!!E&&(E.hasLocalMutations||this.mutatedKeys.has(E.key)&&E.hasCommittedMutations);let R=!1;v&&E?v.data.isEqual(E.data)?T!==x&&(r.track({type:3,doc:E}),R=!0):this.ga(v,E)||(r.track({type:2,doc:E}),R=!0,(c&&this.Aa(E,c)>0||d&&this.Aa(E,d)<0)&&(l=!0)):!v&&E?(r.track({type:0,doc:E}),R=!0):v&&!E&&(r.track({type:1,doc:v}),R=!0,(c||d)&&(l=!0)),R&&(E?(a=a.add(E),i=x?i.add(f):i.delete(f)):(a=a.delete(f),i=i.delete(f)))}),this.query.limit!==null)for(;a.size>this.query.limit;){const f=this.query.limitType==="F"?a.last():a.first();a=a.delete(f.key),i=i.delete(f.key),r.track({type:1,doc:f})}return{Ra:a,fa:r,ns:l,mutatedKeys:i}}ga(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,r,s){const i=this.Ra;this.Ra=e.Ra,this.mutatedKeys=e.mutatedKeys;const a=e.fa.G_();a.sort((f,m)=>function(E,T){const x=R=>{switch(R){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return Y()}};return x(E)-x(T)}(f.type,m.type)||this.Aa(f.doc,m.doc)),this.pa(r),s=s!=null&&s;const l=t&&!s?this.ya():[],c=this.da.size===0&&this.current&&!s?1:0,d=c!==this.Ea;return this.Ea=c,a.length!==0||d?{snapshot:new Gr(this.query,e.Ra,i,a,e.mutatedKeys,c===0,d,!1,!!r&&r.resumeToken.approximateByteSize()>0),wa:l}:{wa:l}}Z_(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Ra:this.Ra,fa:new rd,mutatedKeys:this.mutatedKeys,ns:!1},!1)):{wa:[]}}Sa(e){return!this.Ta.has(e)&&!!this.Ra.has(e)&&!this.Ra.get(e).hasLocalMutations}pa(e){e&&(e.addedDocuments.forEach(t=>this.Ta=this.Ta.add(t)),e.modifiedDocuments.forEach(t=>{}),e.removedDocuments.forEach(t=>this.Ta=this.Ta.delete(t)),this.current=e.current)}ya(){if(!this.current)return[];const e=this.da;this.da=ee(),this.Ra.forEach(r=>{this.Sa(r.key)&&(this.da=this.da.add(r.key))});const t=[];return e.forEach(r=>{this.da.has(r)||t.push(new Sf(r))}),this.da.forEach(r=>{e.has(r)||t.push(new If(r))}),t}ba(e){this.Ta=e.Ts,this.da=ee();const t=this.ma(e.documents);return this.applyChanges(t,!0)}Da(){return Gr.fromInitialDocuments(this.query,this.Ra,this.mutatedKeys,this.Ea===0,this.hasCachedResults)}}class bw{constructor(e,t,r){this.query=e,this.targetId=t,this.view=r}}class Tw{constructor(e){this.key=e,this.va=!1}}class Iw{constructor(e,t,r,s,i,a){this.localStore=e,this.remoteStore=t,this.eventManager=r,this.sharedClientState=s,this.currentUser=i,this.maxConcurrentLimboResolutions=a,this.Ca={},this.Fa=new ns(l=>Uh(l),Ao),this.Ma=new Map,this.xa=new Set,this.Oa=new _e(q.comparator),this.Na=new Map,this.La=new Cl,this.Ba={},this.ka=new Map,this.qa=Yr.kn(),this.onlineState="Unknown",this.Qa=void 0}get isPrimaryClient(){return this.Qa===!0}}async function Sw(n,e,t=!0){const r=kf(n);let s;const i=r.Fa.get(e);return i?(r.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.Da()):s=await Af(r,e,t,!0),s}async function Aw(n,e){const t=kf(n);await Af(t,e,!0,!1)}async function Af(n,e,t,r){const s=await G_(n.localStore,Ct(e)),i=s.targetId,a=n.sharedClientState.addLocalQueryTarget(i,t);let l;return r&&(l=await xw(n,e,i,a==="current",s.resumeToken)),n.isPrimaryClient&&t&&mf(n.remoteStore,s),l}async function xw(n,e,t,r,s){n.Ka=(m,v,E)=>async function(x,R,A,D){let N=R.view.ma(A);N.ns&&(N=await Zu(x.localStore,R.query,!1).then(({documents:b})=>R.view.ma(b,N)));const C=D&&D.targetChanges.get(R.targetId),O=D&&D.targetMismatches.get(R.targetId)!=null,V=R.view.applyChanges(N,x.isPrimaryClient,C,O);return ad(x,R.targetId,V.wa),V.snapshot}(n,m,v,E);const i=await Zu(n.localStore,e,!0),a=new Ew(e,i.Ts),l=a.ma(i.documents),c=li.createSynthesizedTargetChangeForCurrentChange(t,r&&n.onlineState!=="Offline",s),d=a.applyChanges(l,n.isPrimaryClient,c);ad(n,t,d.wa);const f=new bw(e,t,a);return n.Fa.set(e,f),n.Ma.has(t)?n.Ma.get(t).push(e):n.Ma.set(t,[e]),d.snapshot}async function Rw(n,e,t){const r=K(n),s=r.Fa.get(e),i=r.Ma.get(s.targetId);if(i.length>1)return r.Ma.set(s.targetId,i.filter(a=>!Ao(a,e))),void r.Fa.delete(e);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(s.targetId),r.sharedClientState.isActiveQueryTarget(s.targetId)||await Wa(r.localStore,s.targetId,!1).then(()=>{r.sharedClientState.clearQueryState(s.targetId),t&&Ml(r.remoteStore,s.targetId),Ga(r,s.targetId)}).catch(ii)):(Ga(r,s.targetId),await Wa(r.localStore,s.targetId,!0))}async function Pw(n,e){const t=K(n),r=t.Fa.get(e),s=t.Ma.get(r.targetId);t.isPrimaryClient&&s.length===1&&(t.sharedClientState.removeLocalQueryTarget(r.targetId),Ml(t.remoteStore,r.targetId))}async function Cw(n,e,t){const r=Vw(n);try{const s=await function(a,l){const c=K(a),d=Le.now(),f=l.reduce((E,T)=>E.add(T.key),ee());let m,v;return c.persistence.runTransaction("Locally write mutations","readwrite",E=>{let T=Zt(),x=ee();return c.cs.getEntries(E,f).next(R=>{T=R,T.forEach((A,D)=>{D.isValidDocument()||(x=x.add(A))})}).next(()=>c.localDocuments.getOverlayedDocuments(E,T)).next(R=>{m=R;const A=[];for(const D of l){const N=X0(D,m.get(D.key).overlayedDocument);N!=null&&A.push(new xn(D.key,N,Nh(N.value.mapValue),st.exists(!0)))}return c.mutationQueue.addMutationBatch(E,d,A,l)}).next(R=>{v=R;const A=R.applyToLocalDocumentSet(m,x);return c.documentOverlayCache.saveOverlays(E,R.batchId,A)})}).then(()=>({batchId:v.batchId,changes:Hh(m)}))}(r.localStore,e);r.sharedClientState.addPendingMutation(s.batchId),function(a,l,c){let d=a.Ba[a.currentUser.toKey()];d||(d=new _e(se)),d=d.insert(l,c),a.Ba[a.currentUser.toKey()]=d}(r,s.batchId,t),await ui(r,s.changes),await No(r.remoteStore)}catch(s){const i=Bl(s,"Failed to persist write");t.reject(i)}}async function xf(n,e){const t=K(n);try{const r=await H_(t.localStore,e);e.targetChanges.forEach((s,i)=>{const a=t.Na.get(i);a&&(le(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1),s.addedDocuments.size>0?a.va=!0:s.modifiedDocuments.size>0?le(a.va):s.removedDocuments.size>0&&(le(a.va),a.va=!1))}),await ui(t,r,e)}catch(r){await ii(r)}}function od(n,e,t){const r=K(n);if(r.isPrimaryClient&&t===0||!r.isPrimaryClient&&t===1){const s=[];r.Fa.forEach((i,a)=>{const l=a.view.Z_(e);l.snapshot&&s.push(l.snapshot)}),function(a,l){const c=K(a);c.onlineState=l;let d=!1;c.queries.forEach((f,m)=>{for(const v of m.j_)v.Z_(l)&&(d=!0)}),d&&Fl(c)}(r.eventManager,e),s.length&&r.Ca.d_(s),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function kw(n,e,t){const r=K(n);r.sharedClientState.updateQueryState(e,"rejected",t);const s=r.Na.get(e),i=s&&s.key;if(i){let a=new _e(q.comparator);a=a.insert(i,Ze.newNoDocument(i,G.min()));const l=ee().add(i),c=new ko(G.min(),new Map,new _e(se),a,l);await xf(r,c),r.Oa=r.Oa.remove(i),r.Na.delete(e),zl(r)}else await Wa(r.localStore,e,!1).then(()=>Ga(r,e,t)).catch(ii)}async function Dw(n,e){const t=K(n),r=e.batch.batchId;try{const s=await j_(t.localStore,e);Pf(t,r,null),Rf(t,r),t.sharedClientState.updateMutationState(r,"acknowledged"),await ui(t,s)}catch(s){await ii(s)}}async function Mw(n,e,t){const r=K(n);try{const s=await function(a,l){const c=K(a);return c.persistence.runTransaction("Reject batch","readwrite-primary",d=>{let f;return c.mutationQueue.lookupMutationBatch(d,l).next(m=>(le(m!==null),f=m.keys(),c.mutationQueue.removeMutationBatch(d,m))).next(()=>c.mutationQueue.performConsistencyCheck(d)).next(()=>c.documentOverlayCache.removeOverlaysForBatchId(d,f,l)).next(()=>c.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(d,f)).next(()=>c.localDocuments.getDocuments(d,f))})}(r.localStore,e);Pf(r,e,t),Rf(r,e),r.sharedClientState.updateMutationState(e,"rejected",t),await ui(r,s)}catch(s){await ii(s)}}function Rf(n,e){(n.ka.get(e)||[]).forEach(t=>{t.resolve()}),n.ka.delete(e)}function Pf(n,e,t){const r=K(n);let s=r.Ba[r.currentUser.toKey()];if(s){const i=s.get(e);i&&(t?i.reject(t):i.resolve(),s=s.remove(e)),r.Ba[r.currentUser.toKey()]=s}}function Ga(n,e,t=null){n.sharedClientState.removeLocalQueryTarget(e);for(const r of n.Ma.get(e))n.Fa.delete(r),t&&n.Ca.$a(r,t);n.Ma.delete(e),n.isPrimaryClient&&n.La.gr(e).forEach(r=>{n.La.containsKey(r)||Cf(n,r)})}function Cf(n,e){n.xa.delete(e.path.canonicalString());const t=n.Oa.get(e);t!==null&&(Ml(n.remoteStore,t),n.Oa=n.Oa.remove(e),n.Na.delete(t),zl(n))}function ad(n,e,t){for(const r of t)r instanceof If?(n.La.addReference(r.key,e),Nw(n,r)):r instanceof Sf?($("SyncEngine","Document no longer in limbo: "+r.key),n.La.removeReference(r.key,e),n.La.containsKey(r.key)||Cf(n,r.key)):Y()}function Nw(n,e){const t=e.key,r=t.path.canonicalString();n.Oa.get(t)||n.xa.has(r)||($("SyncEngine","New document in limbo: "+t),n.xa.add(r),zl(n))}function zl(n){for(;n.xa.size>0&&n.Oa.size<n.maxConcurrentLimboResolutions;){const e=n.xa.values().next().value;n.xa.delete(e);const t=new q(me.fromString(e)),r=n.qa.next();n.Na.set(r,new Tw(t)),n.Oa=n.Oa.insert(t,r),mf(n.remoteStore,new mn(Ct(Sl(t.path)),r,"TargetPurposeLimboResolution",_l.oe))}}async function ui(n,e,t){const r=K(n),s=[],i=[],a=[];r.Fa.isEmpty()||(r.Fa.forEach((l,c)=>{a.push(r.Ka(c,e,t).then(d=>{var f;if((d||t)&&r.isPrimaryClient){const m=d?!d.fromCache:(f=t==null?void 0:t.targetChanges.get(c.targetId))===null||f===void 0?void 0:f.current;r.sharedClientState.updateQueryState(c.targetId,m?"current":"not-current")}if(d){s.push(d);const m=Dl.Wi(c.targetId,d);i.push(m)}}))}),await Promise.all(a),r.Ca.d_(s),await async function(c,d){const f=K(c);try{await f.persistence.runTransaction("notifyLocalViewChanges","readwrite",m=>L.forEach(d,v=>L.forEach(v.$i,E=>f.persistence.referenceDelegate.addReference(m,v.targetId,E)).next(()=>L.forEach(v.Ui,E=>f.persistence.referenceDelegate.removeReference(m,v.targetId,E)))))}catch(m){if(!oi(m))throw m;$("LocalStore","Failed to update sequence numbers: "+m)}for(const m of d){const v=m.targetId;if(!m.fromCache){const E=f.os.get(v),T=E.snapshotVersion,x=E.withLastLimboFreeSnapshotVersion(T);f.os=f.os.insert(v,x)}}}(r.localStore,i))}async function Lw(n,e){const t=K(n);if(!t.currentUser.isEqual(e)){$("SyncEngine","User change. New user:",e.toKey());const r=await df(t.localStore,e);t.currentUser=e,function(i,a){i.ka.forEach(l=>{l.forEach(c=>{c.reject(new z(M.CANCELLED,a))})}),i.ka.clear()}(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await ui(t,r.hs)}}function Ow(n,e){const t=K(n),r=t.Na.get(e);if(r&&r.va)return ee().add(r.key);{let s=ee();const i=t.Ma.get(e);if(!i)return s;for(const a of i){const l=t.Fa.get(a);s=s.unionWith(l.view.Va)}return s}}function kf(n){const e=K(n);return e.remoteStore.remoteSyncer.applyRemoteEvent=xf.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=Ow.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=kw.bind(null,e),e.Ca.d_=_w.bind(null,e.eventManager),e.Ca.$a=ww.bind(null,e.eventManager),e}function Vw(n){const e=K(n);return e.remoteStore.remoteSyncer.applySuccessfulWrite=Dw.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=Mw.bind(null,e),e}class mo{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=Do(e.databaseInfo.databaseId),this.sharedClientState=this.Wa(e),this.persistence=this.Ga(e),await this.persistence.start(),this.localStore=this.za(e),this.gcScheduler=this.ja(e,this.localStore),this.indexBackfillerScheduler=this.Ha(e,this.localStore)}ja(e,t){return null}Ha(e,t){return null}za(e){return q_(this.persistence,new $_,e.initialUser,this.serializer)}Ga(e){return new B_(kl.Zr,this.serializer)}Wa(e){return new Q_}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}mo.provider={build:()=>new mo};class Ka{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>od(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=Lw.bind(null,this.syncEngine),await gw(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new vw}()}createDatastore(e){const t=Do(e.databaseInfo.databaseId),r=function(i){return new ew(i)}(e.databaseInfo);return function(i,a,l,c){return new rw(i,a,l,c)}(e.authCredentials,e.appCheckCredentials,r,t)}createRemoteStore(e){return function(r,s,i,a,l){return new iw(r,s,i,a,l)}(this.localStore,this.datastore,e.asyncQueue,t=>od(this.syncEngine,t,0),function(){return td.D()?new td:new J_}())}createSyncEngine(e,t){return function(s,i,a,l,c,d,f){const m=new Iw(s,i,a,l,c,d);return f&&(m.Qa=!0),m}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await async function(s){const i=K(s);$("RemoteStore","RemoteStore shutting down."),i.L_.add(5),await ci(i),i.k_.shutdown(),i.q_.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}}Ka.provider={build:()=>new Ka};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class Df{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ya(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ya(this.observer.error,e):Xt("Uncaught Error in snapshot listener:",e.toString()))}Za(){this.muted=!0}Ya(e,t){setTimeout(()=>{this.muted||e(t)},0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bw{constructor(e,t,r,s,i){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=r,this.databaseInfo=s,this.user=Je.UNAUTHENTICATED,this.clientId=kh.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(r,async a=>{$("FirestoreClient","Received user=",a.uid),await this.authCredentialListener(a),this.user=a}),this.appCheckCredentials.start(r,a=>($("FirestoreClient","Received new app check token=",a),this.appCheckCredentialListener(a,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new Kt;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const r=Bl(t,"Failed to shutdown persistence");e.reject(r)}}),e.promise}}async function va(n,e){n.asyncQueue.verifyOperationInProgress(),$("FirestoreClient","Initializing OfflineComponentProvider");const t=n.configuration;await e.initialize(t);let r=t.initialUser;n.setCredentialChangeListener(async s=>{r.isEqual(s)||(await df(e.localStore,s),r=s)}),e.persistence.setDatabaseDeletedListener(()=>n.terminate()),n._offlineComponents=e}async function ld(n,e){n.asyncQueue.verifyOperationInProgress();const t=await Fw(n);$("FirestoreClient","Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener(r=>nd(e.remoteStore,r)),n.setAppCheckTokenChangeListener((r,s)=>nd(e.remoteStore,s)),n._onlineComponents=e}async function Fw(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){$("FirestoreClient","Using user provided OfflineComponentProvider");try{await va(n,n._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!function(s){return s.name==="FirebaseError"?s.code===M.FAILED_PRECONDITION||s.code===M.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11}(t))throw t;qr("Error using user provided cache. Falling back to memory cache: "+t),await va(n,new mo)}}else $("FirestoreClient","Using default OfflineComponentProvider"),await va(n,new mo);return n._offlineComponents}async function Mf(n){return n._onlineComponents||(n._uninitializedComponentsProvider?($("FirestoreClient","Using user provided OnlineComponentProvider"),await ld(n,n._uninitializedComponentsProvider._online)):($("FirestoreClient","Using default OnlineComponentProvider"),await ld(n,new Ka))),n._onlineComponents}function zw(n){return Mf(n).then(e=>e.syncEngine)}async function Nf(n){const e=await Mf(n),t=e.eventManager;return t.onListen=Sw.bind(null,e.syncEngine),t.onUnlisten=Rw.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=Aw.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=Pw.bind(null,e.syncEngine),t}function $w(n,e,t={}){const r=new Kt;return n.asyncQueue.enqueueAndForget(async()=>function(i,a,l,c,d){const f=new Df({next:v=>{f.Za(),a.enqueueAndForget(()=>bf(i,m));const E=v.docs.has(l);!E&&v.fromCache?d.reject(new z(M.UNAVAILABLE,"Failed to get document because the client is offline.")):E&&v.fromCache&&c&&c.source==="server"?d.reject(new z(M.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):d.resolve(v)},error:v=>d.reject(v)}),m=new Tf(Sl(l.path),f,{includeMetadataChanges:!0,_a:!0});return Ef(i,m)}(await Nf(n),n.asyncQueue,e,t,r)),r.promise}function Uw(n,e,t={}){const r=new Kt;return n.asyncQueue.enqueueAndForget(async()=>function(i,a,l,c,d){const f=new Df({next:v=>{f.Za(),a.enqueueAndForget(()=>bf(i,m)),v.fromCache&&c.source==="server"?d.reject(new z(M.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):d.resolve(v)},error:v=>d.reject(v)}),m=new Tf(l,f,{includeMetadataChanges:!0,_a:!0});return Ef(i,m)}(await Nf(n),n.asyncQueue,e,t,r)),r.promise}/**
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
 */function Lf(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cd=new Map;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Of(n,e,t){if(!t)throw new z(M.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function qw(n,e,t,r){if(e===!0&&r===!0)throw new z(M.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function ud(n){if(!q.isDocumentKey(n))throw new z(M.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function dd(n){if(q.isDocumentKey(n))throw new z(M.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function Lo(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=function(r){return r.constructor?r.constructor.name:null}(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":Y()}function Nt(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new z(M.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Lo(n);throw new z(M.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}function jw(n,e){if(e<=0)throw new z(M.INVALID_ARGUMENT,`Function ${n}() requires a positive number, but it was: ${e}.`)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hd{constructor(e){var t,r;if(e.host===void 0){if(e.ssl!==void 0)throw new z(M.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(t=e.ssl)===null||t===void 0||t;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new z(M.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}qw("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Lf((r=e.experimentalLongPollingOptions)!==null&&r!==void 0?r:{}),function(i){if(i.timeoutSeconds!==void 0){if(isNaN(i.timeoutSeconds))throw new z(M.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (must not be NaN)`);if(i.timeoutSeconds<5)throw new z(M.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (minimum allowed value is 5)`);if(i.timeoutSeconds>30)throw new z(M.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(r,s){return r.timeoutSeconds===s.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Oo{constructor(e,t,r,s){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=r,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new hd({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new z(M.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new z(M.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new hd(e),e.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new a0;switch(r.type){case"firstParty":return new d0(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new z(M.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(t){const r=cd.get(t);r&&($("ComponentProvider","Removing Datastore"),cd.delete(t),r.terminate())}(this),Promise.resolve()}}function Hw(n,e,t,r={}){var s;const i=(n=Nt(n,Oo))._getSettings(),a=`${e}:${t}`;if(i.host!=="firestore.googleapis.com"&&i.host!==a&&qr("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),n._setSettings(Object.assign(Object.assign({},i),{host:a,ssl:!1})),r.mockUserToken){let l,c;if(typeof r.mockUserToken=="string")l=r.mockUserToken,c=Je.MOCK_USER;else{l=gm(r.mockUserToken,(s=n._app)===null||s===void 0?void 0:s.options.projectId);const d=r.mockUserToken.sub||r.mockUserToken.user_id;if(!d)throw new z(M.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");c=new Je(d)}n._authCredentials=new l0(new Ch(l,c))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rn{constructor(e,t,r){this.converter=t,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new Rn(this.firestore,e,this._query)}}class it{constructor(e,t,r){this.converter=t,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new wn(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new it(this.firestore,e,this._key)}}class wn extends Rn{constructor(e,t,r){super(e,t,Sl(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new it(this.firestore,null,new q(e))}withConverter(e){return new wn(this.firestore,e,this._path)}}function Ww(n,e,...t){if(n=De(n),Of("collection","path",e),n instanceof Oo){const r=me.fromString(e,...t);return dd(r),new wn(n,null,r)}{if(!(n instanceof it||n instanceof wn))throw new z(M.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(me.fromString(e,...t));return dd(r),new wn(n.firestore,null,r)}}function Wn(n,e,...t){if(n=De(n),arguments.length===1&&(e=kh.newId()),Of("doc","path",e),n instanceof Oo){const r=me.fromString(e,...t);return ud(r),new it(n,null,new q(r))}{if(!(n instanceof it||n instanceof wn))throw new z(M.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(me.fromString(e,...t));return ud(r),new it(n.firestore,n instanceof wn?n.converter:null,new q(r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fd{constructor(e=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new ff(this,"async_queue_retry"),this.Vu=()=>{const r=ya();r&&$("AsyncQueue","Visibility state changed to "+r.visibilityState),this.t_.jo()},this.mu=e;const t=ya();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.fu(),this.gu(e)}enterRestrictedMode(e){if(!this.Iu){this.Iu=!0,this.Au=e||!1;const t=ya();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.Vu)}}enqueue(e){if(this.fu(),this.Iu)return new Promise(()=>{});const t=new Kt;return this.gu(()=>this.Iu&&this.Au?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Pu.push(e),this.pu()))}async pu(){if(this.Pu.length!==0){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(e){if(!oi(e))throw e;$("AsyncQueue","Operation failed with retryable error: "+e)}this.Pu.length>0&&this.t_.Go(()=>this.pu())}}gu(e){const t=this.mu.then(()=>(this.du=!0,e().catch(r=>{this.Eu=r,this.du=!1;const s=function(a){let l=a.message||"";return a.stack&&(l=a.stack.includes(a.message)?a.stack:a.message+`
`+a.stack),l}(r);throw Xt("INTERNAL UNHANDLED ERROR: ",s),r}).then(r=>(this.du=!1,r))));return this.mu=t,t}enqueueAfterDelay(e,t,r){this.fu(),this.Ru.indexOf(e)>-1&&(t=0);const s=Vl.createAndSchedule(this,e,t,r,i=>this.yu(i));return this.Tu.push(s),s}fu(){this.Eu&&Y()}verifyOperationInProgress(){}async wu(){let e;do e=this.mu,await e;while(e!==this.mu)}Su(e){for(const t of this.Tu)if(t.timerId===e)return!0;return!1}bu(e){return this.wu().then(()=>{this.Tu.sort((t,r)=>t.targetTimeMs-r.targetTimeMs);for(const t of this.Tu)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.wu()})}Du(e){this.Ru.push(e)}yu(e){const t=this.Tu.indexOf(e);this.Tu.splice(t,1)}}class ir extends Oo{constructor(e,t,r,s){super(e,t,r,s),this.type="firestore",this._queue=new fd,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new fd(e),this._firestoreClient=void 0,await e}}}function Yw(n,e){const t=typeof n=="object"?n:Ud(),r=typeof n=="string"?n:"(default)",s=ol(t,"firestore").getImmediate({identifier:r});if(!s._initialized){const i=pm("firestore");i&&Hw(s,...i)}return s}function Vo(n){if(n._terminated)throw new z(M.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||Gw(n),n._firestoreClient}function Gw(n){var e,t,r;const s=n._freezeSettings(),i=function(l,c,d,f){return new I0(l,c,d,f.host,f.ssl,f.experimentalForceLongPolling,f.experimentalAutoDetectLongPolling,Lf(f.experimentalLongPollingOptions),f.useFetchStreams)}(n._databaseId,((e=n._app)===null||e===void 0?void 0:e.options.appId)||"",n._persistenceKey,s);n._componentsProvider||!((t=s.localCache)===null||t===void 0)&&t._offlineComponentProvider&&(!((r=s.localCache)===null||r===void 0)&&r._onlineComponentProvider)&&(n._componentsProvider={_offline:s.localCache._offlineComponentProvider,_online:s.localCache._onlineComponentProvider}),n._firestoreClient=new Bw(n._authCredentials,n._appCheckCredentials,n._queue,i,n._componentsProvider&&function(l){const c=l==null?void 0:l._online.build();return{_offline:l==null?void 0:l._offline.build(c),_online:c}}(n._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kr{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Kr(Ye.fromBase64String(e))}catch(t){throw new z(M.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new Kr(Ye.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bo{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new z(M.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new je(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $l{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ul{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new z(M.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new z(M.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return se(this._lat,e._lat)||se(this._long,e._long)}}/**
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
 */class ql{constructor(e){this._values=(e||[]).map(t=>t)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(r,s){if(r.length!==s.length)return!1;for(let i=0;i<r.length;++i)if(r[i]!==s[i])return!1;return!0}(this._values,e._values)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kw=/^__.*__$/;class Qw{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return this.fieldMask!==null?new xn(e,this.data,this.fieldMask,t,this.fieldTransforms):new ai(e,this.data,t,this.fieldTransforms)}}class Vf{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return new xn(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function Bf(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw Y()}}class jl{constructor(e,t,r,s,i,a){this.settings=e,this.databaseId=t,this.serializer=r,this.ignoreUndefinedProperties=s,i===void 0&&this.vu(),this.fieldTransforms=i||[],this.fieldMask=a||[]}get path(){return this.settings.path}get Cu(){return this.settings.Cu}Fu(e){return new jl(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Mu(e){var t;const r=(t=this.path)===null||t===void 0?void 0:t.child(e),s=this.Fu({path:r,xu:!1});return s.Ou(e),s}Nu(e){var t;const r=(t=this.path)===null||t===void 0?void 0:t.child(e),s=this.Fu({path:r,xu:!1});return s.vu(),s}Lu(e){return this.Fu({path:void 0,xu:!0})}Bu(e){return go(e,this.settings.methodName,this.settings.ku||!1,this.path,this.settings.qu)}contains(e){return this.fieldMask.find(t=>e.isPrefixOf(t))!==void 0||this.fieldTransforms.find(t=>e.isPrefixOf(t.field))!==void 0}vu(){if(this.path)for(let e=0;e<this.path.length;e++)this.Ou(this.path.get(e))}Ou(e){if(e.length===0)throw this.Bu("Document fields must not be empty");if(Bf(this.Cu)&&Kw.test(e))throw this.Bu('Document fields cannot begin and end with "__"')}}class Jw{constructor(e,t,r){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=r||Do(e)}Qu(e,t,r,s=!1){return new jl({Cu:e,methodName:t,qu:r,path:je.emptyPath(),xu:!1,ku:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Fo(n){const e=n._freezeSettings(),t=Do(n._databaseId);return new Jw(n._databaseId,!!e.ignoreUndefinedProperties,t)}function Hl(n,e,t,r,s,i={}){const a=n.Qu(i.merge||i.mergeFields?2:0,e,t,s);Wl("Data must be an object, but it was:",a,r);const l=Ff(r,a);let c,d;if(i.merge)c=new lt(a.fieldMask),d=a.fieldTransforms;else if(i.mergeFields){const f=[];for(const m of i.mergeFields){const v=Qa(e,m,t);if(!a.contains(v))throw new z(M.INVALID_ARGUMENT,`Field '${v}' is specified in your field mask but missing from your input data.`);$f(f,v)||f.push(v)}c=new lt(f),d=a.fieldTransforms.filter(m=>c.covers(m.field))}else c=null,d=a.fieldTransforms;return new Qw(new rt(l),c,d)}class zo extends $l{_toFieldTransform(e){if(e.Cu!==2)throw e.Cu===1?e.Bu(`${this._methodName}() can only appear at the top level of your update data`):e.Bu(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof zo}}function Xw(n,e,t,r){const s=n.Qu(1,e,t);Wl("Data must be an object, but it was:",s,r);const i=[],a=rt.empty();rr(r,(c,d)=>{const f=Yl(e,c,t);d=De(d);const m=s.Nu(f);if(d instanceof zo)i.push(f);else{const v=di(d,m);v!=null&&(i.push(f),a.set(f,v))}});const l=new lt(i);return new Vf(a,l,s.fieldTransforms)}function Zw(n,e,t,r,s,i){const a=n.Qu(1,e,t),l=[Qa(e,r,t)],c=[s];if(i.length%2!=0)throw new z(M.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let v=0;v<i.length;v+=2)l.push(Qa(e,i[v])),c.push(i[v+1]);const d=[],f=rt.empty();for(let v=l.length-1;v>=0;--v)if(!$f(d,l[v])){const E=l[v];let T=c[v];T=De(T);const x=a.Nu(E);if(T instanceof zo)d.push(E);else{const R=di(T,x);R!=null&&(d.push(E),f.set(E,R))}}const m=new lt(d);return new Vf(f,m,a.fieldTransforms)}function eE(n,e,t,r=!1){return di(t,n.Qu(r?4:3,e))}function di(n,e){if(zf(n=De(n)))return Wl("Unsupported field value:",e,n),Ff(n,e);if(n instanceof $l)return function(r,s){if(!Bf(s.Cu))throw s.Bu(`${r._methodName}() can only be used with update() and set()`);if(!s.path)throw s.Bu(`${r._methodName}() is not currently supported inside arrays`);const i=r._toFieldTransform(s);i&&s.fieldTransforms.push(i)}(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.xu&&e.Cu!==4)throw e.Bu("Nested arrays are not supported");return function(r,s){const i=[];let a=0;for(const l of r){let c=di(l,s.Lu(a));c==null&&(c={nullValue:"NULL_VALUE"}),i.push(c),a++}return{arrayValue:{values:i}}}(n,e)}return function(r,s){if((r=De(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return W0(s.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const i=Le.fromDate(r);return{timestampValue:fo(s.serializer,i)}}if(r instanceof Le){const i=new Le(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:fo(s.serializer,i)}}if(r instanceof Ul)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof Kr)return{bytesValue:rf(s.serializer,r._byteString)};if(r instanceof it){const i=s.databaseId,a=r.firestore._databaseId;if(!a.isEqual(i))throw s.Bu(`Document reference is for database ${a.projectId}/${a.database} but should be for database ${i.projectId}/${i.database}`);return{referenceValue:Pl(r.firestore._databaseId||s.databaseId,r._key.path)}}if(r instanceof ql)return function(a,l){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:a.toArray().map(c=>{if(typeof c!="number")throw l.Bu("VectorValues must only contain numeric values.");return Al(l.serializer,c)})}}}}}}(r,s);throw s.Bu(`Unsupported field value: ${Lo(r)}`)}(n,e)}function Ff(n,e){const t={};return Dh(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):rr(n,(r,s)=>{const i=di(s,e.Mu(r));i!=null&&(t[r]=i)}),{mapValue:{fields:t}}}function zf(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof Le||n instanceof Ul||n instanceof Kr||n instanceof it||n instanceof $l||n instanceof ql)}function Wl(n,e,t){if(!zf(t)||!function(s){return typeof s=="object"&&s!==null&&(Object.getPrototypeOf(s)===Object.prototype||Object.getPrototypeOf(s)===null)}(t)){const r=Lo(t);throw r==="an object"?e.Bu(n+" a custom object"):e.Bu(n+" "+r)}}function Qa(n,e,t){if((e=De(e))instanceof Bo)return e._internalPath;if(typeof e=="string")return Yl(n,e);throw go("Field path arguments must be of type string or ",n,!1,void 0,t)}const tE=new RegExp("[~\\*/\\[\\]]");function Yl(n,e,t){if(e.search(tE)>=0)throw go(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new Bo(...e.split("."))._internalPath}catch{throw go(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function go(n,e,t,r,s){const i=r&&!r.isEmpty(),a=s!==void 0;let l=`Function ${e}() called with invalid data`;t&&(l+=" (via `toFirestore()`)"),l+=". ";let c="";return(i||a)&&(c+=" (found",i&&(c+=` in field ${r}`),a&&(c+=` in document ${s}`),c+=")"),new z(M.INVALID_ARGUMENT,l+n+c)}function $f(n,e){return n.some(t=>t.isEqual(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uf{constructor(e,t,r,s,i){this._firestore=e,this._userDataWriter=t,this._key=r,this._document=s,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new it(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new nE(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field($o("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class nE extends Uf{data(){return super.data()}}function $o(n,e){return typeof e=="string"?Yl(n,e):e instanceof Bo?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rE(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new z(M.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Gl{}class Kl extends Gl{}function Os(n,e,...t){let r=[];e instanceof Gl&&r.push(e),r=r.concat(t),function(i){const a=i.filter(c=>c instanceof Jl).length,l=i.filter(c=>c instanceof Uo).length;if(a>1||a>0&&l>0)throw new z(M.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(r);for(const s of r)n=s._apply(n);return n}class Uo extends Kl{constructor(e,t,r){super(),this._field=e,this._op=t,this._value=r,this.type="where"}static _create(e,t,r){return new Uo(e,t,r)}_apply(e){const t=this._parse(e);return qf(e._query,t),new Rn(e.firestore,e.converter,$a(e._query,t))}_parse(e){const t=Fo(e.firestore);return function(i,a,l,c,d,f,m){let v;if(d.isKeyField()){if(f==="array-contains"||f==="array-contains-any")throw new z(M.INVALID_ARGUMENT,`Invalid Query. You can't perform '${f}' queries on documentId().`);if(f==="in"||f==="not-in"){gd(m,f);const E=[];for(const T of m)E.push(md(c,i,T));v={arrayValue:{values:E}}}else v=md(c,i,m)}else f!=="in"&&f!=="not-in"&&f!=="array-contains-any"||gd(m,f),v=eE(l,a,m,f==="in"||f==="not-in");return ke.create(d,f,v)}(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function Ql(n,e,t){const r=e,s=$o("where",n);return Uo._create(s,r,t)}class Jl extends Gl{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new Jl(e,t)}_parse(e){const t=this._queryConstraints.map(r=>r._parse(e)).filter(r=>r.getFilters().length>0);return t.length===1?t[0]:Tt.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:(function(s,i){let a=s;const l=i.getFlattenedFilters();for(const c of l)qf(a,c),a=$a(a,c)}(e._query,t),new Rn(e.firestore,e.converter,$a(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class Xl extends Kl{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new Xl(e,t)}_apply(e){const t=function(s,i,a){if(s.startAt!==null)throw new z(M.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(s.endAt!==null)throw new z(M.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new Ys(i,a)}(e._query,this._field,this._direction);return new Rn(e.firestore,e.converter,function(s,i){const a=s.explicitOrderBy.concat([i]);return new ts(s.path,s.collectionGroup,a,s.filters.slice(),s.limit,s.limitType,s.startAt,s.endAt)}(e._query,t))}}function pd(n,e="asc"){const t=e,r=$o("orderBy",n);return Xl._create(r,t)}class Zl extends Kl{constructor(e,t,r){super(),this.type=e,this._limit=t,this._limitType=r}static _create(e,t,r){return new Zl(e,t,r)}_apply(e){return new Rn(e.firestore,e.converter,co(e._query,this._limit,this._limitType))}}function sE(n){return jw("limit",n),Zl._create("limit",n,"F")}function md(n,e,t){if(typeof(t=De(t))=="string"){if(t==="")throw new z(M.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!$h(e)&&t.indexOf("/")!==-1)throw new z(M.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const r=e.path.child(me.fromString(t));if(!q.isDocumentKey(r))throw new z(M.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return Ou(n,new q(r))}if(t instanceof it)return Ou(n,t._key);throw new z(M.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Lo(t)}.`)}function gd(n,e){if(!Array.isArray(n)||n.length===0)throw new z(M.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function qf(n,e){const t=function(s,i){for(const a of s)for(const l of a.getFlattenedFilters())if(i.indexOf(l.op)>=0)return l.op;return null}(n.filters,function(s){switch(s){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(e.op));if(t!==null)throw t===e.op?new z(M.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new z(M.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}class iE{convertValue(e,t="none"){switch(Zn(e)){case 0:return null;case 1:return e.booleanValue;case 2:return Ae(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(Xn(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw Y()}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const r={};return rr(e,(s,i)=>{r[s]=this.convertValue(i,t)}),r}convertVectorValue(e){var t,r,s;const i=(s=(r=(t=e.fields)===null||t===void 0?void 0:t.value.arrayValue)===null||r===void 0?void 0:r.values)===null||s===void 0?void 0:s.map(a=>Ae(a.doubleValue));return new ql(i)}convertGeoPoint(e){return new Ul(Ae(e.latitude),Ae(e.longitude))}convertArray(e,t){return(e.values||[]).map(r=>this.convertValue(r,t))}convertServerTimestamp(e,t){switch(t){case"previous":const r=El(e);return r==null?null:this.convertValue(r,t);case"estimate":return this.convertTimestamp(js(e));default:return null}}convertTimestamp(e){const t=In(e);return new Le(t.seconds,t.nanos)}convertDocumentKey(e,t){const r=me.fromString(e);le(uf(r));const s=new Hs(r.get(1),r.get(3)),i=new q(r.popFirst(5));return s.isEqual(t)||Xt(`Document ${i} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ec(n,e,t){let r;return r=n?t&&(t.merge||t.mergeFields)?n.toFirestore(e,t):n.toFirestore(e):e,r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cs{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class jf extends Uf{constructor(e,t,r,s,i,a){super(e,t,r,s,a),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new Ki(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const r=this._document.data.field($o("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,t.serverTimestamps)}}}class Ki extends jf{data(e={}){return super.data(e)}}class oE{constructor(e,t,r,s){this._firestore=e,this._userDataWriter=t,this._snapshot=s,this.metadata=new Cs(s.hasPendingWrites,s.fromCache),this.query=r}get docs(){const e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach(r=>{e.call(t,new Ki(this._firestore,this._userDataWriter,r.key,r,new Cs(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new z(M.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(s,i){if(s._snapshot.oldDocs.isEmpty()){let a=0;return s._snapshot.docChanges.map(l=>{const c=new Ki(s._firestore,s._userDataWriter,l.doc.key,l.doc,new Cs(s._snapshot.mutatedKeys.has(l.doc.key),s._snapshot.fromCache),s.query.converter);return l.doc,{type:"added",doc:c,oldIndex:-1,newIndex:a++}})}{let a=s._snapshot.oldDocs;return s._snapshot.docChanges.filter(l=>i||l.type!==3).map(l=>{const c=new Ki(s._firestore,s._userDataWriter,l.doc.key,l.doc,new Cs(s._snapshot.mutatedKeys.has(l.doc.key),s._snapshot.fromCache),s.query.converter);let d=-1,f=-1;return l.type!==0&&(d=a.indexOf(l.doc.key),a=a.delete(l.doc.key)),l.type!==1&&(a=a.add(l.doc),f=a.indexOf(l.doc.key)),{type:aE(l.type),doc:c,oldIndex:d,newIndex:f}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}}function aE(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return Y()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lE(n){n=Nt(n,it);const e=Nt(n.firestore,ir);return $w(Vo(e),n._key).then(t=>cE(e,n,t))}class Hf extends iE{constructor(e){super(),this.firestore=e}convertBytes(e){return new Kr(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new it(this.firestore,null,t)}}function hi(n){n=Nt(n,Rn);const e=Nt(n.firestore,ir),t=Vo(e),r=new Hf(e);return rE(n._query),Uw(t,n._query).then(s=>new oE(e,r,n,s))}function Wf(n,e,t){n=Nt(n,it);const r=Nt(n.firestore,ir),s=ec(n.converter,e,t);return qo(r,[Hl(Fo(r),"setDoc",n._key,s,n.converter!==null,t).toMutation(n._key,st.none())])}function Yf(n){return qo(Nt(n.firestore,ir),[new Co(n._key,st.none())])}function Gf(n,e){const t=Nt(n.firestore,ir),r=Wn(n),s=ec(n.converter,e);return qo(t,[Hl(Fo(n.firestore),"addDoc",r._key,s,n.converter!==null,{}).toMutation(r._key,st.exists(!1))]).then(()=>r)}function qo(n,e){return function(r,s){const i=new Kt;return r.asyncQueue.enqueueAndForget(async()=>Cw(await zw(r),s,i)),i.promise}(Vo(n),e)}function cE(n,e,t){const r=t.docs.get(e._key),s=new Hf(n);return new jf(n,s,e._key,r,new Cs(t.hasPendingWrites,t.fromCache),e.converter)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uE{constructor(e,t){this._firestore=e,this._commitHandler=t,this._mutations=[],this._committed=!1,this._dataReader=Fo(e)}set(e,t,r){this._verifyNotCommitted();const s=_a(e,this._firestore),i=ec(s.converter,t,r),a=Hl(this._dataReader,"WriteBatch.set",s._key,i,s.converter!==null,r);return this._mutations.push(a.toMutation(s._key,st.none())),this}update(e,t,r,...s){this._verifyNotCommitted();const i=_a(e,this._firestore);let a;return a=typeof(t=De(t))=="string"||t instanceof Bo?Zw(this._dataReader,"WriteBatch.update",i._key,t,r,s):Xw(this._dataReader,"WriteBatch.update",i._key,t),this._mutations.push(a.toMutation(i._key,st.exists(!0))),this}delete(e){this._verifyNotCommitted();const t=_a(e,this._firestore);return this._mutations=this._mutations.concat(new Co(t._key,st.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new z(M.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function _a(n,e){if((n=De(n)).firestore!==e)throw new z(M.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qs(n){return Vo(n=Nt(n,ir)),new uE(n,e=>qo(n,e))}(function(e,t=!0){(function(s){es=s})(Xr),$r(new Gn("firestore",(r,{instanceIdentifier:s,options:i})=>{const a=r.getProvider("app").getImmediate(),l=new ir(new c0(r.getProvider("auth-internal")),new f0(r.getProvider("app-check-internal")),function(d,f){if(!Object.prototype.hasOwnProperty.apply(d.options,["projectId"]))throw new z(M.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Hs(d.options.projectId,f)}(a,s),a);return i=Object.assign({useFetchStreams:t},i),l._setSettings(i),l},"PUBLIC").setMultipleInstances(!0)),_n(ku,"4.7.3",e),_n(ku,"4.7.3","esm2017")})();const Kf={apiKey:"AIzaSyBdbve0H70D-Ch69WlaxEly7PVBFVRB5p0",authDomain:"pensiontools-4b237.firebaseapp.com",projectId:"pensiontools-4b237",storageBucket:"pensiontools-4b237.firebasestorage.app",messagingSenderId:"760877353696",appId:"1:760877353696:web:2d6f7173c8d7fab6fd9e85",measurementId:"G-80XX542QZE"};function we(){return Kf.apiKey!=="YOUR_API_KEY"}let wa=null,ct=null,He=null;try{we()?(wa=$d(Kf),ct=i0(wa),He=Yw(wa)):console.warn("Firebase not configured. Login required to save data.")}catch(n){console.error("Firebase initialization error:",n)}const dE=new jt;let pn=null,Vs=[];function hE(){if(!we()||!ct){console.warn("Firebase not configured - auth disabled");return}Yy(ct,n=>{console.log("onAuthStateChanged fired:",n?n.email:"null"),pn=n,console.log("Notifying",Vs.length,"listeners"),Vs.forEach(e=>e(n))})}function fE(n){return console.log("onAuthStateChange: adding listener, currentUser is:",pn&&pn.email),Vs.push(n),pn&&(console.log("onAuthStateChange: immediately calling listener with user"),n(pn)),()=>{Vs=Vs.filter(e=>e!==n)}}function ss(){return pn}function ut(){return pn!==null}async function pE(n,e,t=null){if(!we()||!ct)throw new Error("Firebase not configured");const r=await $y(ct,n,e);return t&&r.user&&await jy(r.user,{displayName:t}),r}async function mE(n,e){if(!we()||!ct)throw new Error("Firebase not configured");return Uy(ct,n,e)}async function gE(){if(!we()||!ct)throw new Error("Firebase not configured");console.log("Initiating Google sign-in popup...");try{const n=await pv(ct,dE);return console.log("Google sign-in successful:",n.user.email),n}catch(n){throw console.error("signInWithPopup error:",n.code,n.message),n}}async function Qf(){if(!we()||!ct)throw new Error("Firebase not configured");return Gy(ct)}async function yE(n){if(!we()||!ct)throw new Error("Firebase not configured");return zy(ct,n)}hE();function tc(n,e="settings"){const t=ss();return!t||!He?null:Wn(He,"users",t.uid,n,e)}function is(n){const e=ss();return!e||!He?null:Ww(He,"users",e.uid,n)}async function jo(){if(!we())return[];const n=is("scenarios");if(!n)return[];try{const e=await hi(n),t=[];return e.forEach(r=>{t.push({id:r.id,...r.data()})}),t}catch(e){return console.error("Error loading scenarios:",e),[]}}async function vE(n){if(!we())return null;const e=tc("scenarios",n);if(!e)return null;try{const t=await lE(e);return t.exists()?{id:t.id,...t.data()}:null}catch(t){return console.error("Error loading scenario:",t),null}}async function fi(n,e){if(!we())return;const t=tc("scenarios",n);if(t)try{await Wf(t,{...e,lastModified:new Date().toISOString()},{merge:!0})}catch(r){throw console.error("Error saving scenario:",r),r}}async function Jf(n){if(!we())return null;const e=is("scenarios");if(!e)return null;try{return(await Gf(e,{...n,createdAt:new Date().toISOString(),lastModified:new Date().toISOString()})).id}catch(t){throw console.error("Error creating scenario:",t),t}}async function _E(n){if(!we())return;const e=tc("scenarios",n);if(e)try{await Yf(e)}catch(t){throw console.error("Error deleting scenario:",t),t}}async function nc(n){if(!we())return;const e=ss();if(!(!e||!He))try{const t=await jo(),r=Qs(He);for(const s of t){const i=Wn(He,"users",e.uid,"scenarios",s.id);s.id===n?r.update(i,{isActive:!0}):s.isActive&&r.update(i,{isActive:!1})}await r.commit()}catch(t){throw console.error("Error setting active scenario:",t),t}}async function Xf(n={}){if(!we())return[];const e=is("history");if(!e)return[];try{let t=Os(e,pd("date",n.sortDesc?"desc":"asc"));n.taxYear&&(t=Os(e,Ql("taxYear","==",n.taxYear),pd("date",n.sortDesc?"desc":"asc"))),n.limit&&(t=Os(t,sE(n.limit)));const r=await hi(t),s=[];return r.forEach(i=>{s.push({id:i.id,...i.data()})}),s}catch(t){return console.error("Error loading decision history:",t),[]}}async function wE(n){if(!we())return null;const e=is("history");if(!e)return null;try{const t=Os(e,Ql("date","==",n.date)),r=await hi(t);if(!r.empty){const i=r.docs[0].id;return await Wf(Wn(He,"users",ss().uid,"history",i),{...n,updatedAt:new Date().toISOString()}),i}return(await Gf(e,{...n,createdAt:new Date().toISOString()})).id}catch(t){throw console.error("Error adding history record:",t),t}}async function EE(n){if(!we())return;const e=is("history");if(e)try{const t=Os(e,Ql("date","==",n)),r=await hi(t),s=Qs(He);r.forEach(i=>{s.delete(i.ref)}),await s.commit()}catch(t){throw console.error("Error deleting history record:",t),t}}async function bE(){if(!we())return;const n=is("history");if(n)try{const e=await hi(n),t=500,r=[];let s=Qs(He),i=0;e.forEach(a=>{s.delete(a.ref),i++,i>=t&&(r.push(s),s=Qs(He),i=0)}),i>0&&r.push(s),await Promise.all(r.map(a=>a.commit()))}catch(e){throw console.error("Error clearing history:",e),e}}async function TE(){if(!we())return;const n=ss();if(!(!n||!He))try{await bE();const e=await jo();if(e.length>0){const t=Qs(He);for(const r of e)t.delete(Wn(He,"users",n.uid,"scenarios",r.id));t.delete(Wn(He,"users",n.uid,"profile","settings")),await t.commit()}else await Yf(Wn(He,"users",n.uid,"profile","settings"));console.log("All user data wiped successfully")}catch(e){throw console.error("Error wiping user data:",e),e}}async function IE(){return we()?(await jo()).length>0:!1}let Fr=null,Dt=null;function or(){return we()&&ut()}function ar(){Fr=null,Dt=null}function Zf(){return{equityMin:ce.EQUITY_MIN,bondMin:ce.BOND_MIN,cashTarget:ce.CASH_TARGET,duration:ce.DURATION_YEARS,baseSalary:ce.BASE_SALARY,other:0,statePension:12e3,statePensionYear:12,pa:Xe.PERSONAL_ALLOWANCE,brl:Xe.BASIC_RATE_LIMIT,hrl:Xe.HIGHER_RATE_LIMIT,taxMode:"inflates",protectionMult:Mr.PROTECTION_MULTIPLIER,consecutiveLimit:ce.CONSECUTIVE_LIMIT,disableProtection:!1,hodlEnabled:Mr.HODL_ENABLED,hodlValue:Mr.HODL_VALUE}}function ep(){return{equityMin:ce.EQUITY_MIN,bondMin:ce.BOND_MIN,cashTarget:ce.CASH_TARGET,duration:ce.DURATION_YEARS,baseSalary:ce.BASE_SALARY,protectionFactor:ce.PROTECTION_FACTOR,recoveryBuffer:ce.RECOVERY_BUFFER,consecutiveLimit:ce.CONSECUTIVE_LIMIT,spStartDate:null,spWeeklyAmount:0,statePension:0,statePensionYear:0}}function tp(){return{}}function SE(n="My Plan",e="",t=["stress","decision"]){return{name:n,description:e,enabledTools:t,isActive:!0,stressSettings:Zf(),decisionSettings:ep(),taxYears:tp()}}async function rc(){if(Fr)return Fr;if(!or())return[];try{const n=await jo();return Fr=n,n}catch(n){return console.error("Error listing scenarios:",n),[]}}async function Pn(){if(Dt)return Dt;if(!or())return null;try{const e=(await rc()).find(t=>t.isActive);return e?(Dt=e,e):null}catch(n){return console.error("Error getting active scenario:",n),null}}async function AE(n,e,t,r={},s=!0){if(!or())throw new Error("Must be logged in to create scenarios");const i=SE(n,e,t);if(r.stressSettings&&(i.stressSettings={...i.stressSettings,...r.stressSettings}),r.decisionSettings&&(i.decisionSettings={...i.decisionSettings,...r.decisionSettings}),r.taxYears&&(i.taxYears=r.taxYears),i.isActive=s,s&&Fr){const l=Fr.find(c=>c.isActive);l&&(await nc(null),await fi(l.id,{isActive:!1}))}const a=await Jf(i);return ar(),a}async function xE(n){if(!or())throw new Error("Must be logged in to switch scenarios");await nc(n),ar()}async function RE(n,e){if(!or())throw new Error("Must be logged in to duplicate scenarios");const t=await vE(n);if(!t)throw new Error("Source scenario not found");const{id:r,createdAt:s,lastModified:i,...a}=t;a.name=e,a.isActive=!1;const l=await Jf(a);return ar(),l}async function PE(n,e){if(!or())throw new Error("Must be logged in to rename scenarios");await fi(n,{name:e}),ar()}async function CE(n){if(!or())throw new Error("Must be logged in to delete scenarios");const e=await rc();if(e.length<=1)throw new Error("Cannot delete the last scenario");const t=e.find(r=>r.id===n);if(t!=null&&t.isActive){const r=e.find(s=>s.id!==n);r&&await nc(r.id)}await _E(n),ar()}async function kE(){const n=await Pn();return(n==null?void 0:n.stressSettings)||Zf()}async function np(n){const e=await Pn();if(!e)throw new Error("No active scenario");await fi(e.id,{stressSettings:n}),Dt&&(Dt.stressSettings=n)}async function DE(){const n=await Pn();return(n==null?void 0:n.decisionSettings)||ep()}async function ME(n){const e=await Pn();if(!e)throw new Error("No active scenario");await fi(e.id,{decisionSettings:n}),Dt&&(Dt.decisionSettings=n)}async function NE(){const n=await Pn();return(n==null?void 0:n.taxYears)||tp()}async function LE(n){const e=await Pn();if(!e)throw new Error("No active scenario");await fi(e.id,{taxYears:n}),Dt&&(Dt.taxYears=n)}async function rp(){const n=await Pn();return(n==null?void 0:n.enabledTools)||["stress","decision"]}let et=null;function Qi(){return{settings:{equityMin:ce.EQUITY_MIN,bondMin:ce.BOND_MIN,cashTarget:ce.CASH_TARGET,duration:ce.DURATION_YEARS,baseSalary:ce.BASE_SALARY,protectionFactor:ce.PROTECTION_FACTOR,recoveryBuffer:ce.RECOVERY_BUFFER,consecutiveLimit:ce.CONSECUTIVE_LIMIT,startDate:null,spStartDate:null,spWeeklyAmount:0,statePension:0,statePensionYear:0},taxYears:{},history:[],lastModified:null,checksum:null}}function pi(){return we()&&ut()}function Qr(){et=null}function sp(){return et||Qi()}async function lr(){if(et)return et;if(!pi())return console.warn("Firebase not available - returning defaults"),Qi();try{const[n,e,t]=await Promise.all([DE(),NE(),Xf()]),r={settings:n||Qi().settings,taxYears:e||{},history:t||[],lastModified:new Date().toISOString(),checksum:null};return r.checksum=ip(r),et=r,r}catch(n){console.error("Error loading decision data:",n)}return Qi()}async function Ho(n){if(!pi())throw new Error("Must be logged in to save data");try{n.lastModified=new Date().toISOString(),n.checksum=ip(n),await Promise.all([ME(n.settings),LE(n.taxYears)]),et=n}catch(e){throw console.error("Error saving decision data:",e),new Error("Failed to save decision data")}}function ip(n){const e={settings:n.settings,taxYears:n.taxYears,historyCount:n.history.length,lastHistoryDate:n.history.length>0?n.history[n.history.length-1].date:null};return Dd(e)}async function cr(){return(await lr()).settings}async function op(n){const e=await lr();e.settings={...e.settings,...n},await Ho(e)}function sc(){return{pa:Xe.PERSONAL_ALLOWANCE,brl:Xe.BASIC_RATE_LIMIT,hrl:Xe.HIGHER_RATE_LIMIT,cpi:.04,other:0,isaSavingsAllocation:0,isaSavingsUsed:0,isTaxEfficient:!0,taxEfficiencyChoice:null,grossIncomeToDate:0,startMonth:4,yearSetupComplete:!1,confirmedSalary:null}}function OE(n){const t=sp().taxYears[n];return t||sc()}async function Wo(n){const t=(await lr()).taxYears[n];return t||sc()}async function ur(n,e){console.log(`saveTaxYearConfig: Saving tax year ${n}`,e);const t=await lr();t.taxYears[n]={...OE(n),...e},await Ho(t),console.log(`saveTaxYearConfig: Saved tax year ${n}, yearSetupComplete=${t.taxYears[n].yearSetupComplete}`)}async function VE(n){const e=et||await lr(),t=(e.history||[]).filter(s=>s.taxYear===n),r=t.reduce((s,i)=>s+(i.isa||0),0);return console.log(`recalculateIsaSavingsUsed: Tax year ${n}, found ${t.length} records, total ISA used: ${r}`),console.log("recalculateIsaSavingsUsed: History records:",t.map(s=>({date:s.date,isa:s.isa}))),e.taxYears[n]||(console.log(`recalculateIsaSavingsUsed: No existing config for ${n}, creating default`),e.taxYears[n]=sc()),console.log(`recalculateIsaSavingsUsed: Before update, isaSavingsUsed=${e.taxYears[n].isaSavingsUsed}`),e.taxYears[n].isaSavingsUsed=r,console.log(`recalculateIsaSavingsUsed: After update, isaSavingsUsed=${e.taxYears[n].isaSavingsUsed}`),await Ho(e),console.log("recalculateIsaSavingsUsed: Saved to Firebase"),r}async function BE(n){const e=await Wo(n),t=e.yearSetupComplete===!0;return console.log(`isYearSetupComplete: Tax year ${n}, yearSetupComplete=${e.yearSetupComplete}, result=${t}`),t}async function Cn(){return(await lr()).taxYears}function FE(n={}){let t=[...sp().history];return n.taxYear&&(t=t.filter(r=>r.taxYear===n.taxYear)),n.startDate&&(t=t.filter(r=>r.date>=n.startDate)),n.endDate&&(t=t.filter(r=>r.date<=n.endDate)),n.sortDesc?t.sort((r,s)=>s.date.localeCompare(r.date)):t.sort((r,s)=>r.date.localeCompare(s.date)),n.limit&&(t=t.slice(0,n.limit)),t}async function os(n={}){if(pi())try{return await Xf(n)}catch(e){console.error("Error loading history from Firebase:",e)}return FE(n)}async function zE(n){if(!pi())throw new Error("Must be logged in to save history");if(await wE(n),et){const e=et.history.findIndex(t=>t.date===n.date);e>=0?et.history[e]=n:et.history.push(n),et.history.sort((t,r)=>t.date.localeCompare(r.date))}}async function ap(n){if(!pi())throw new Error("Must be logged in to delete history");await EE(n),et&&(et.history=et.history.filter(e=>e.date!==n))}async function ic(n){const e=await cr(),t=await Cn(),r=e.spStartDate,s=e.spWeeklyAmount||0;if(!r||!s){let f=null;if(r){const{formatStatePensionDate:m}=await eu(async()=>{const{formatStatePensionDate:v}=await Promise.resolve().then(()=>yd);return{formatStatePensionDate:v}},void 0,import.meta.url);f=m(r)}return{amount:0,monthly:0,yearsUntil:0,isReceiving:!1,isFirstYear:!1,startDate:f}}const{calculateStatePensionForTaxYear:i,getTimeUntilStatePension:a,parseStatePensionDate:l}=await eu(async()=>{const{calculateStatePensionForTaxYear:f,getTimeUntilStatePension:m,parseStatePensionDate:v}=await Promise.resolve().then(()=>yd);return{calculateStatePensionForTaxYear:f,getTimeUntilStatePension:m,parseStatePensionDate:v}},void 0,import.meta.url),c=i({taxYear:n,spStartDate:r,weeklyAmount:s,taxYearConfigs:t}),d=a(r);return{amount:c.annual,monthly:c.monthly,yearsUntil:d.years,monthsUntil:d.months,isReceiving:c.isReceiving,isFirstYear:c.isFirstYear,weeksInYear:c.weeksInYear,startDate:c.startDate}}async function $E(n){const e=Yp(n);e.stdSipp=n.stdSipp||n.sippDraw,await zE(e),n.taxYear&&await VE(n.taxYear)}function Yo(n,e,t=0){const r=rl(t);let s=n.equityStart,i=n.bondStart,a=n.cashStart,l=n.hodlEnabled?n.hodlStart!==void 0?n.hodlStart:n.hodlValue:0,c=0,d=null,f=0,m=0,v=0,E=0,T=!1,x=!1,R=null,A=0,D=-1;const N=[],C=[];let O=1;N.push({year:0,month:0,equity:s,bond:i,cash:a,hodl:l,total:s+i+a,draw:0,source:"None",inProtection:!1,equityMin:n.equityMin,bondMin:n.bondMin,cashMax:n.cashTarget});for(let V=0;V<n.years*12;V++){const b=Math.floor(V/12),g=V%12,y=g>=3?b:b-1;if(y!==D&&(A=0,D=y),V>0&&V%12===0){const oe=e.inflation[b]||.025;C.push(oe),O*=1+oe}const _=e.equity[b]||0,I=e.inflation[b]||.025,S=b>0?e.inflation[b-1]||.025:I,w=Nr(n.equityMin,b,n.duration,O,!0),ae=Nr(n.bondMin,b,n.duration,O,!0),Me=Nr(n.cashTarget,b,n.duration,O,!1),Z=qE(n,b,O,C),xe=Z;let fe=T?Z*n.protectionMult:Z;T&&(A+=xe-fe);const Oe=UE(I,_,S,r),de=Math.max(.005,I+.012);if(s*=1+Math.pow(1+_,1/12)-1,i*=1+Math.pow(1+Oe,1/12)-1,a*=1+Math.pow(1+de,1/12)-1,l>0){const dt=(r()-.5)*2*.06;let ht=0;_<-.1?ht=Math.min(.15,Math.abs(_)*.4):_<-.05&&(ht=Math.abs(_)*.2);let Be=.069+dt+ht;Be=Math.max(-.08,Math.min(.18,Be)),l*=1+Math.pow(1+Be,1/12)-1}const Ee=s+i,U=w+ae;T&&Ee>U+5e3&&(T=!1,E=0,m=Math.max(m,v),v=0),T&&(f++,v++);let be=0;if(!T&&A>0&&Ee>U+15e3){let oe=g>=3?15-g:3-g;oe<1&&(oe=1);const Ve=Ee-U-15e3,dt=Math.min(A/oe,Ve/oe),ht=xe*.5;be=Math.min(dt,ht),be>50&&(fe+=be,A-=be)}let X="Growth";if(!T&&Ee>=U+fe){const oe=Math.max(0,s-w),Ve=Math.max(0,i-ae),dt=oe+Ve;if(dt>0){if(s-=fe*oe/dt,i-=fe*Ve/dt,E=0,X="Growth",a<Me){const ht=Ee-U-fe;if(ht>5e3){const Be=Math.min((Me-a)*.3,ht*.5);s-=Be*oe/dt,i-=Be*Ve/dt,a+=Be}}}else a-=fe,X="Cash"}else if(a>=fe)a-=fe,E++,X="Cash",!n.disableProtection&&E>=n.consecutiveLimit&&(T=!0);else{const oe=fe-a;a=0,i>oe?(i-=oe,X="Bond"):s>oe?(s-=oe,X="Equity"):l>oe?(l-=oe,c+=oe,d===null&&(d=V),X="HODL"):(x=!0,R=V)}if(s=Math.max(0,s),i=Math.max(0,i),a=Math.max(0,a),(g===0||V===n.years*12-1||x)&&N.push({year:b+g/12,month:V,equity:s,bond:i,cash:a,hodl:l,total:s+i+a,draw:fe,boostAmount:be,source:X,inProtection:T,equityMin:w,bondMin:ae,cashMax:Me}),x)break}return m=Math.max(m,v),{failed:x,years:x?R/12:n.years,failMonth:R,final:s+i+a,finalEquity:s,finalBond:i,finalCash:a,finalHodl:l,protMonths:f,maxConsec:m,hodlUsed:c,hodlUsedMonth:d,hist:N,seed:t}}function UE(n,e,t,r){let s=.15,i=.3,a=.2,l=.1,c=.1,d=.15;const f=t!==void 0?t:n,m=f>.045,v=f>.07;if(m){const N=r()>.3?1:.5;v?(s=.15+.35*N,i=.3-.2*N,d=.15-.1*N,l=.1+.05*N):(s=.15+.2*N,i=.3-.1*N,d=.15-.05*N)}m&&r()<.15&&(s=.2,i=.25,d=.12);const E=n+.005+bs(0,.03,r),T=.04-(n>.04?(n-.04)*.5:0)+bs(0,.05,r),x=.03+n*.3+bs(0,.08,r),R=n*.8+bs(0,.15,r),A=Math.max(.005,n+.005),D=e*.5+bs(0,.02,r);return s*E+i*T+a*x+l*R+c*A+d*D}function qE(n,e,t,r){n.taxMode==="frozen"?n.pa:n.pa*t;const s=n.taxMode==="frozen"?n.brl:n.brl*t,i=n.baseSalary*t;let a=n.other;for(const f of r)a*=1+Math.min(f,.04);let l=0;if(n.spStartYear!==void 0){if(e>=n.spStartYear&&n.spWeeklyAmount>0){const f=n.spWeeklyAmount*52;e===n.spStartYear&&n.spFirstYearRatio!==void 0?l=f*n.spFirstYearRatio*t:l=f*t}}else n.statePensionYear!==void 0&&(l=e>=n.statePensionYear?(n.statePension||0)*t:0);const c=a+l;return Math.max(0,Math.min(s,i)-c)/12}function lp(n,e=1e3){const t=Object.keys(zs).map(Number).sort((s,i)=>s-i),r=[];for(let s=0;s<e;s++){const i=rl(s*12345),a={equity:{},inflation:{}};for(let l=0;l<n.years;l++){const c=t[Math.floor(i()*t.length)];a.equity[l]=zs[c],a.inflation[l]=tl[c]||.025}r.push(Yo(n,a,s))}return r}function cp(n){const e=Object.keys(zs).map(Number).sort((s,i)=>s-i),t=Math.max(...e),r=[];for(const s of e){if(s+n.years-1>t)continue;const i={equity:{},inflation:{}};for(let l=0;l<n.years;l++)i.equity[l]=zs[s+l]||0,i.inflation[l]=tl[s+l]||.025;const a=Yo(n,i,s);a.startYear=s,r.push(a)}return r}function jE(n,e){const t={equity:{},inflation:{}};for(let r=0;r<n.years;r++)t.equity[r]=e.equity[r%e.equity.length],t.inflation[r]=e.inflation[r%e.inflation.length];return Yo(n,t,999)}function HE(n){const e=n.filter(t=>t.failed).length;return(n.length-e)/n.length*100}function up(n){const e=n.filter(l=>!l.failed),t=n.filter(l=>l.failed),r=n.map(l=>l.years).sort((l,c)=>l-c),s=e.map(l=>l.final).sort((l,c)=>l-c),i=n.map(l=>l.protMonths).sort((l,c)=>l-c),a=(l,c)=>l[Math.floor(l.length*c)]||0;return{total:n.length,successCount:e.length,failCount:t.length,successRate:HE(n),survival:{p5:a(r,.05),p10:a(r,.1),p25:a(r,.25),p50:a(r,.5),p75:a(r,.75),p90:a(r,.9),p95:a(r,.95),min:r[0],max:r[r.length-1]},finalValue:{p5:a(s,.05),p10:a(s,.1),p25:a(s,.25),p50:a(s,.5),p75:a(s,.75),p90:a(s,.9),p95:a(s,.95),min:s[0]||0,max:s[s.length-1]||0,avg:e.reduce((l,c)=>l+c.final,0)/(e.length||1)},minYears:r[0],p10Years:a(r,.1),medianYears:a(r,.5),medianFinal:a(s,.5),p10Final:a(s,.1),p90Final:a(s,.9),avgFinal:e.reduce((l,c)=>l+c.final,0)/(e.length||1),protection:{runsWithProtection:n.filter(l=>l.protMonths>0).length,pctWithProtection:n.filter(l=>l.protMonths>0).length/n.length*100,avgMonths:i.reduce((l,c)=>l+c,0)/n.length,maxMonths:Math.max(...i),maxConsecutive:Math.max(...n.map(l=>l.maxConsec)),avgConsecutive:n.reduce((l,c)=>l+c.maxConsec,0)/n.length,p50Months:a(i,.5),p90Months:a(i,.9),p95Months:a(i,.95)},runsWithProtection:n.filter(l=>l.protMonths>0).length,avgProtMonths:i.reduce((l,c)=>l+c,0)/n.length,maxProtMonths:Math.max(...i),maxConsecutive:Math.max(...n.map(l=>l.maxConsec)),avgConsecutive:n.reduce((l,c)=>l+c.maxConsec,0)/n.length,hodl:{runsUsingHodl:n.filter(l=>l.hodlUsed>0).length,pctUsingHodl:n.filter(l=>l.hodlUsed>0).length/n.length*100,avgUsed:n.filter(l=>l.hodlUsed>0).length>0?n.filter(l=>l.hodlUsed>0).reduce((l,c)=>l+c.hodlUsed,0)/n.filter(l=>l.hodlUsed>0).length:0,maxUsed:Math.max(...n.map(l=>l.hodlUsed||0))},runsUsingHodl:n.filter(l=>l.hodlUsed>0).length,avgHodlUsed:n.filter(l=>l.hodlUsed>0).length>0?n.filter(l=>l.hodlUsed>0).reduce((l,c)=>l+c.hodlUsed,0)/n.filter(l=>l.hodlUsed>0).length:0,maxHodlUsed:Math.max(...n.map(l=>l.hodlUsed||0)),failures:t.map(l=>({seed:l.seed,startYear:l.startYear,years:l.years,failMonth:l.failMonth,protMonths:l.protMonths}))}}function mi(n){if(!n)return null;const e={january:0,jan:0,february:1,feb:1,march:2,mar:2,april:3,apr:3,may:4,june:5,jun:5,july:6,jul:6,august:7,aug:7,september:8,sep:8,sept:8,october:9,oct:9,november:10,nov:10,december:11,dec:11},t=n.trim().replace(/\s+/g," ");if(/^\d{4}-\d{2}-\d{2}$/.test(t)){const s=new Date(t);if(!isNaN(s.getTime()))return s}if(/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(t)){const[s,i,a]=t.split("/").map(Number);return new Date(a,i-1,s)}if(/^\d{1,2}-\d{1,2}-\d{4}$/.test(t)){const[s,i,a]=t.split("-").map(Number);return new Date(a,i-1,s)}let r=t.match(/^(\d{1,2})\s+(\w+)\s+(\d{4})$/i);if(r){const s=parseInt(r[1]),i=e[r[2].toLowerCase()],a=parseInt(r[3]);if(i!==void 0)return new Date(a,i,s)}if(r=t.match(/^(\w+)\s+(\d{1,2})\s+(\d{4})$/i),r){const s=e[r[1].toLowerCase()],i=parseInt(r[2]),a=parseInt(r[3]);if(s!==void 0)return new Date(a,s,i)}if(r=t.match(/^(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})$/i),r){const s=e[r[1].toLowerCase()],i=parseInt(r[2]),a=parseInt(r[3]);if(s!==void 0)return new Date(a,s,i)}if(r=t.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+(\w+),?\s+(\d{4})$/i),r){const s=parseInt(r[1]),i=e[r[2].toLowerCase()],a=parseInt(r[3]);if(i!==void 0)return new Date(a,i,s)}return null}function Ji(n){const e=typeof n=="string"?mi(n):n;if(!e||isNaN(e.getTime()))return"";const t=["January","February","March","April","May","June","July","August","September","October","November","December"];return`${e.getDate()} ${t[e.getMonth()]} ${e.getFullYear()}`}function WE(n){const{taxYear:e,spStartDate:t,weeklyAmount:r,taxYearConfigs:s={}}=n;if(!t||!r||r<=0)return{annual:0,monthly:0,isReceiving:!1,isFirstYear:!1,weeksInYear:0,startDate:null};const i=typeof t=="string"?mi(t):t;if(!i||isNaN(i.getTime()))return{annual:0,monthly:0,isReceiving:!1,isFirstYear:!1,weeksInYear:0,startDate:null};const a=nl(i);Qp(e);const l=Jp(e),c=[...new Set([a,e,...Object.keys(s)])].sort(),d=c.indexOf(a),f=c.indexOf(e);if(f<d)return{annual:0,monthly:0,isReceiving:!1,isFirstYear:!1,weeksInYear:0,startDate:Ji(i)};let m=1;for(let x=d;x<f;x++){const R=c[x],A=s[R],D=(A==null?void 0:A.cpi)||.025;m*=1+D}const v=r*m;if(e===a){const R=Math.max(0,(l.getTime()-i.getTime())/6048e5),A=v*R;return{annual:A,monthly:A/12,isReceiving:!0,isFirstYear:!0,weeksInYear:Math.round(R*10)/10,startDate:Ji(i)}}const T=v*52;return{annual:T,monthly:T/12,isReceiving:!0,isFirstYear:!1,weeksInYear:52,startDate:Ji(i)}}function YE(n,e=new Date){const t=typeof n=="string"?mi(n):n;if(!t||isNaN(t.getTime()))return{years:0,months:0,totalMonths:0,isPast:!1};const r=t.getTime()-e.getTime(),s=r<=0;if(s)return{years:0,months:0,totalMonths:0,isPast:!0};const i=Math.floor(r/(30.44*24*60*60*1e3)),a=Math.floor(i/12),l=i%12;return{years:a,months:l,totalMonths:i,isPast:s}}const yd=Object.freeze(Object.defineProperty({__proto__:null,calculateStatePensionForTaxYear:WE,formatStatePensionDate:Ji,getTimeUntilStatePension:YE,parseStatePensionDate:mi},Symbol.toStringTag,{value:"Module"}));let gn=null;function Js(){return{settings:{equityMin:ce.EQUITY_MIN,bondMin:ce.BOND_MIN,cashTarget:ce.CASH_TARGET,duration:ce.DURATION_YEARS,baseSalary:ce.BASE_SALARY,other:0,statePension:12e3,statePensionYear:12,pa:Xe.PERSONAL_ALLOWANCE,brl:Xe.BASIC_RATE_LIMIT,hrl:Xe.HIGHER_RATE_LIMIT,taxMode:"inflates",protectionMult:Mr.PROTECTION_MULTIPLIER,consecutiveLimit:ce.CONSECUTIVE_LIMIT,disableProtection:!1,hodlEnabled:Mr.HODL_ENABLED,hodlValue:Mr.HODL_VALUE},lastModified:null,checksum:null}}function oc(){return we()&&ut()}function er(){gn=null}function GE(){return gn||Js()}async function dp(){if(gn)return gn;if(!oc())return console.warn("Firebase not available - returning defaults"),Js();try{const n=await kE();if(n){const e={settings:n,lastModified:new Date().toISOString(),checksum:null};return gn=JE(e),gn}}catch(n){console.error("Error loading stress data:",n)}return Js()}async function KE(n){if(!oc())throw new Error("Must be logged in to save data");try{n.lastModified=new Date().toISOString(),n.checksum=QE(n),await np(n.settings),gn=n}catch(e){throw console.error("Error saving stress data:",e),new Error("Failed to save stress data")}}function QE(n){return Dd(n.settings)}function JE(n){const e={...Js()};return n.settings&&(e.settings={...e.settings,...n.settings},n.settings.pacwMin!==void 0&&n.settings.equityMin===void 0&&(e.settings.equityMin=n.settings.pacwMin),n.settings.cgtMin!==void 0&&n.settings.bondMin===void 0&&(e.settings.bondMin=n.settings.cgtMin),n.settings.csh2Target!==void 0&&n.settings.cashTarget===void 0&&(e.settings.cashTarget=n.settings.csh2Target),e.settings.hodlEnabled===void 0&&(e.settings.hodlEnabled=!1),e.settings.hodlValue===void 0&&(e.settings.hodlValue=25e3)),e.lastModified=n.lastModified,e.checksum=n.checksum,e}function XE(){return GE().settings}async function kn(){return(await dp()).settings}async function hp(n){const e=await dp();e.settings={...e.settings,...n},await KE(e)}async function ZE(){if(!oc())throw new Error("Must be logged in to reset settings");const n=Js();await np(n.settings),er()}function eb(n){if(!n.spStartDate||!n.spWeeklyAmount)return{spStartYear:999,spWeeklyAmount:0,spFirstYearRatio:1};const e=mi(n.spStartDate);if(!e)return console.warn("Could not parse spStartDate:",n.spStartDate),{spStartYear:999,spWeeklyAmount:0,spFirstYearRatio:1};const t=new Date,r=365.25*24*60*60*1e3,s=Math.max(0,(e.getTime()-t.getTime())/r),i=Math.floor(s),a=365,l=Math.floor((e-new Date(e.getFullYear(),0,0))/(24*60*60*1e3)),d=(a-l)/a;return{spStartYear:i,spWeeklyAmount:n.spWeeklyAmount,spFirstYearRatio:d}}function ac(n={},e=null){const t=e||XE(),r=eb(t);return{equityStart:n.equityStart??t.equityMin,bondStart:n.bondStart??t.bondMin,cashStart:n.cashStart??t.cashTarget,equityMin:t.equityMin,bondMin:t.bondMin,cashTarget:t.cashTarget,years:n.years??t.duration,duration:t.duration,baseSalary:t.baseSalary,other:t.other,spStartYear:r.spStartYear,spWeeklyAmount:r.spWeeklyAmount,spFirstYearRatio:r.spFirstYearRatio,pa:t.pa,brl:t.brl,hrl:t.hrl,taxMode:t.taxMode,protectionMult:t.protectionMult,consecutiveLimit:t.consecutiveLimit,disableProtection:t.disableProtection,hodlEnabled:t.hodlEnabled,hodlValue:t.hodlValue}}function H(n,e=null){const t=Math.abs(n),r=e!==null?e:t<100,s=Math.abs(n).toLocaleString("en-GB",{minimumFractionDigits:r?2:0,maximumFractionDigits:r?2:0});return n<0?`-£${s}`:`£${s}`}function vd(n,e){const t=tb(n);e.innerHTML=t}function tb(n){var I,S,w,ae,Me;const e=n,t=e.calculationDetails||{};let r="";const s=e.isTaxEfficientYear??e.taxEfficient,i=e.protectionInducedTaxEfficiency||!1,a=e.boostAmount>0;let l,c,d;if(e.inProtection?(l="warning",c="Protection Mode",d="⚡"):a?(l="boost",c="Tax Boost (Catch-up)",d="↑"):i?(l="info",c="Protection-Induced Tax Efficiency",d="↑"):s?(l="success",c="Tax-Efficient Year",d="✓"):(l="warning",c="Tax-Inefficient Year",d="!"),r+=`<div class="decision-mode ${l}">
    <span class="mode-icon">${d}</span>
    <span class="mode-label">${c}</span>
  </div>`,s&&e.yearlyIsaSavingsAllocation>0){const Z=e.cumulativeIsaSavingsUsed||0,xe=e.yearlyIsaSavingsAllocation,ue=Math.max(0,xe-Z),fe=xe>0?Z/xe*100:0;r+=`<div class="isa-progress-card">
      <h4>ISA/Savings Allocation</h4>
      <div class="isa-progress-bar">
        <div class="isa-progress-fill" style="width: ${Math.min(fe,100)}%"></div>
      </div>
      <div class="isa-progress-stats">
        <span>Used: ${H(Z)} of ${H(xe)}</span>
        <span>Remaining: ${H(ue)}</span>
      </div>
    </div>`}if(e.alerts&&e.alerts.length>0){r+='<div class="alerts">';for(const Z of e.alerts){const xe=nb(Z.severity);r+=`<div class="alert ${xe}">${Z.message}</div>`}r+="</div>"}r+='<div class="recommendation-card">',r+="<h3>Monthly Recommendation</h3>",r+='<div class="draw-row primary">',r+='<span class="label">SIPP Withdrawal</span>',r+=`<span class="value">${H(e.sippDraw)}</span>`,r+="</div>",e.isaDraw>0&&(r+='<div class="draw-row">',r+='<span class="label">ISA Top-up</span>',r+=`<span class="value">${H(e.isaDraw)}</span>`,r+="</div>"),e.other>0&&(r+='<div class="draw-row muted">',r+='<span class="label">Other Pension</span>',r+=`<span class="value">${H(e.other)}</span>`,r+="</div>"),e.statePension>0&&(r+='<div class="draw-row muted">',r+='<span class="label">State Pension</span>',r+=`<span class="value">${H(e.statePension)}</span>`,r+="</div>"),r+='<div class="divider"></div>';const f=e.sippDraw+e.other+e.statePension,m=f*12,v=e.pa||12570,E=e.brl||50270;let T=0;m>v&&(m<=E?T=(m-v)*.2:T=(E-v)*.2+(m-E)*.4);const x=f-T/12+e.isaDraw;r+='<div class="draw-row total">',r+='<span class="label">Total Monthly Income</span>',r+=`<span class="value">${H(x)}</span>`,r+="</div>",e.boostAmount>0&&(r+='<div class="boost-indicator">',r+='<span class="boost-label">Includes Tax Boost:</span>',r+=`<span class="boost-value">+${H(e.boostAmount)}</span>`,r+="</div>"),r+="</div>",r+='<div class="source-card">',r+="<h4>Withdraw From</h4>",r+=`<div class="source-label ${e.source.toLowerCase()}">${e.source}</div>`,e.source==="Growth"&&(e.drawFromEquity>0||e.drawFromBond>0)&&(r+='<div class="source-breakdown">',e.drawFromEquity>0&&(r+=`<div class="source-item">Equity: ${H(e.drawFromEquity)}</div>`),e.drawFromBond>0&&(r+=`<div class="source-item">Bond: ${H(e.drawFromBond)}</div>`),r+="</div>"),r+="</div>",r+='<div class="fund-status">',r+="<h4>Fund Status</h4>";const R=e.equity+e.bond+e.cash,A=e.adjEquityMin+e.adjBondMin+e.adjCashTarget,D=R-A,N=A>0?D/A*100:0;r+='<div class="fund-grid">';const C=e.equity-e.adjEquityMin;r+=Ea("Equity",e.equity,e.adjEquityMin,C);const O=e.bond-e.adjBondMin;r+=Ea("Bond",e.bond,e.adjBondMin,O);const V=e.cash-e.adjCashTarget;r+=Ea("Cash",e.cash,e.adjCashTarget,V),r+="</div>";const b=D>=0?"healthy":"warning";r+=`<div class="overall-status ${b}">`,r+=`<span>Total Surplus: ${H(D)}</span>`,r+=`<span>(${N.toFixed(1)}% above target)</span>`,r+="</div>",r+="</div>",r+='<div class="tax-info">',r+="<h4>Tax Summary</h4>",r+='<div class="tax-thresholds">',r+=`<div class="tax-threshold-item"><span class="label">PA:</span><span>${H(e.pa)}</span></div>`,r+=`<div class="tax-threshold-item"><span class="label">BRL:</span><span>${H(e.brl)}</span></div>`,t.taxInfo&&(r+=`<div class="tax-threshold-item"><span class="label">Headroom:</span><span class="${t.taxInfo.headroomToBRL>0?"success":"warning"}">${H(t.taxInfo.headroomToBRL)}</span></div>`),r+="</div>",r+='<div class="tax-comparison">',r+='<div class="tax-comparison-header">',r+="<div></div><div>Monthly</div><div>YTD</div><div>Projected</div>",r+="</div>";const g=((I=t.taxInfo)==null?void 0:I.monthlyTax)||T/12,y=e.taxPaidYTD||g,_=e.taxProjectedAnnual||((S=t.taxInfo)==null?void 0:S.annualTax)||T;if(r+='<div class="tax-comparison-row">',r+='<div class="label">Tax Paid</div>',r+=`<div>${H(g)}</div>`,r+=`<div>${H(y)}</div>`,r+=`<div>${H(_)}</div>`,r+="</div>",s||((w=t.taxInfo)==null?void 0:w.taxSavedAnnual)>0){const Z=e.taxSavedMonthly||((ae=t.taxInfo)==null?void 0:ae.taxSavedMonthly)||0,xe=e.taxSavedYTD||Z,ue=e.taxSavedProjectedAnnual||((Me=t.taxInfo)==null?void 0:Me.taxSavedAnnual)||0;ue>0&&(r+='<div class="tax-comparison-row saved">',r+='<div class="label">Tax Saved</div>',r+=`<div class="success">-${H(Z)}</div>`,r+=`<div class="success">-${H(xe)}</div>`,r+=`<div class="success">-${H(ue)}</div>`,r+="</div>")}if(r+="</div>",t.taxInfo&&typeof t.taxInfo.effectiveRate=="number"&&!isNaN(t.taxInfo.effectiveRate)){const Z=t.taxInfo.effectiveRate*100;r+=`<div class="effective-rate">
      <span>Effective Tax Rate:</span>
      <span class="${Z<=20?"success":Z<=40?"warning":"danger"}">${Z.toFixed(1)}%</span>
    </div>`}else if(t.taxInfo&&t.taxInfo.annualTaxable>0&&t.taxInfo.annualTax>=0){const Z=t.taxInfo.annualTax/t.taxInfo.annualTaxable*100;r+=`<div class="effective-rate">
      <span>Effective Tax Rate:</span>
      <span class="${Z<=20?"success":Z<=40?"warning":"danger"}">${Z.toFixed(1)}%</span>
    </div>`}if(r+="</div>",e.rebalanceNeeded&&e.rebalanceActions.length>0){r+='<div class="rebalance-card">',r+="<h4>Rebalancing Suggestions</h4>",r+="<ul>";for(const Z of e.rebalanceActions)r+=`<li>${Z}</li>`;r+="</ul>",r+="</div>"}return r+='<div class="mode-explanation">',r+="<h4>Why This Recommendation?</h4>",r+=`<p>${t.reason||"Standard calculation based on your settings."}</p>`,!t.hasSufficientIsa&&t.isaNeededMonthly>0&&(r+=`<p class="isa-warning">To enable tax-efficient mode, you need ${H(t.totalIsaNeeded)} in your ISA (${e.remainingMonths} months remaining in tax year).</p>`),r+="</div>",r+='<details class="debug-section">',r+="<summary>Calculation Details</summary>",r+="<pre>"+JSON.stringify(t,null,2)+"</pre>",r+="</details>",r}function Ea(n,e,t,r){return`<div class="fund-cell ${r>=0?"healthy":"deficit"}">
    <div class="fund-name">${n}</div>
    <div class="fund-current">${H(e)}</div>
    <div class="fund-min">Min: ${H(t)}</div>
    <div class="fund-surplus">${r>=0?"+":""}${H(r)}</div>
  </div>`}function nb(n){switch(n){case Li.DANGER:return"alert-danger";case Li.WARNING:return"alert-warning";case Li.SUCCESS:return"alert-success";case Li.INFO:default:return"alert-info"}}function rb(){return`
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
  `}async function sb(n){const e=kd(n),t=nl(e),r=e.getMonth()+1;return await BE(t)?{showWizard:!1,taxYear:t,isApril:r===4,reason:"Year setup already complete"}:{showWizard:!0,taxYear:t,isApril:r===4,reason:`Tax year ${t} has not been set up`}}function ib(n,e){return n*(1+e)}function ob(n){const{targetAnnualGross:e,brl:t,pa:r=12570,remainingMonths:s,grossIncomeToDate:i=0}=n,a=T=>T<=r?0:T<=t?(T-r)*.2:(t-r)*.2+(T-t)*.4,l=Math.max(0,t-i);if(l<=0)return{isaNeeded:0,brlExhausted:!0,remainingBrlHeadroom:0,maxTaxEfficientSalary:t,reducedSalaryOption:t,canBeTaxEfficient:!1,reason:"BRL already exhausted by prior income"};if(e<=t)return{isaNeeded:0,brlExhausted:!1,remainingBrlHeadroom:l,maxTaxEfficientSalary:t,reducedSalaryOption:t,canBeTaxEfficient:!0,targetAchievableAtBrl:!0,reason:"Target achievable at BRL without ISA"};const c=a(e),d=e-c,f=a(t),m=t-f,v=Math.max(0,d-m),E=v/12*s;return{isaNeeded:E,isaNeededAnnual:v,brlExhausted:!1,remainingBrlHeadroom:l,maxTaxEfficientSalary:t,reducedSalaryOption:t,canBeTaxEfficient:!0,targetAchievableAtBrl:!1,netAtTarget:d,netAtBrl:m,taxAtTarget:c,taxAtBrl:f,reason:`Need £${Math.round(E).toLocaleString()} ISA/Savings for tax efficiency`}}function ab(n,e,t){return t?{sufficient:!1,isBrlExhausted:!0,options:[{key:"reduced",label:"Reduce salary to BRL",description:"Accept lower income to stay tax-efficient"},{key:"inefficient",label:"Accept tax-inefficient year",description:"Draw full SIPP, pay 40% on excess"}]}:n>=e?{sufficient:!0,isBrlExhausted:!1,options:[]}:{sufficient:!1,isBrlExhausted:!1,shortfall:e-n,options:[{key:"increase",label:`Increase ISA to £${Math.round(e).toLocaleString()}`,description:"Provide enough ISA for tax efficiency"},{key:"reduced",label:"Reduce salary to BRL",description:"Keep ISA to grow, accept lower income"},{key:"inefficient",label:"Accept tax-inefficient year",description:"Draw full SIPP, ISA stays untouched"}]}}async function lb(n){const e=kd(n),t=nl(e),s=e.getMonth()+1===4,i=Zp(e),a=await cr(),l=await Wo(t),c=await Cn(),d=Object.keys(c).sort(),f=d.indexOf(t)-1,m=f>=0?c[d[f]]:null,v=await ic(t),E=(m==null?void 0:m.cpi)||.025,T=ib(a.baseSalary,E);return{taxYear:t,selectedMonth:n,isApril:s,remainingMonths:i,baseSalary:a.baseSalary,suggestedSalary:T,defaults:{pa:(m==null?void 0:m.pa)||l.pa,brl:(m==null?void 0:m.brl)||l.brl,hrl:(m==null?void 0:m.hrl)||l.hrl,cpi:E,other:(m==null?void 0:m.other)||0},statePension:v,existingConfig:l.yearSetupComplete?l:null}}function fp(n){const{targetSalary:e,brl:t,pa:r=12570,other:s=0,statePension:i=0,isaSavingsAllocation:a=0,remainingMonths:l,grossIncomeToDate:c=0,isTaxEfficient:d=!0}=n,f=S=>S<=r?0:S<=t?(S-r)*.2:(t-r)*.2+(S-t)*.4,m=s/12,v=i/12,E=m+v;let T,x;if(!d)T=e/12-E,x=0;else{const S=Math.max(0,t-c),w=Math.max(0,S/l-E);T=Math.min(e/12-E,w),x=a/l}const R=(T+E)*12,D=f(R)/12,N=T+E,C=N>0?D/N:0,O=T*C,V=m*C,b=v*C,g=T-O,y=m-V,_=v-b,I=g+y+_+x;return{sipp:{gross:T,tax:O,net:g},other:{gross:m,tax:V,net:y},statePension:{gross:v,tax:b,net:_},isa:{gross:x,tax:0,net:x},totalGross:T+m+v+x,totalTax:D,totalNet:I,mode:d?"tax-efficient":"tax-inefficient",monthlySipp:T,monthlyIsa:x,monthlyOther:m,monthlyStatePension:v,monthlyTotal:I}}function cb(n){var x,R,A,D,N,C,O,V,b,g,y;const{pa:e,brl:t,hrl:r,cpi:s,other:i,isaSavingsAllocation:a,isTaxEfficient:l,taxEfficiencyChoice:c,grossIncomeToDate:d,startMonth:f,confirmedSalary:m,remainingMonths:v,statePension:E,monthlyBreakdown:T}=n;return{pa:e,brl:t,hrl:r,cpi:s,other:i,isaSavingsAllocation:l?a:0,isaSavingsUsed:0,isTaxEfficient:l,taxEfficiencyChoice:c,grossIncomeToDate:d||0,startMonth:f||4,remainingMonths:v||12,yearSetupComplete:!0,confirmedSalary:m,statePension:E||0,expectedMonthly:T?{sipp:{gross:((x=T.sipp)==null?void 0:x.gross)||0,tax:((R=T.sipp)==null?void 0:R.tax)||0,net:((A=T.sipp)==null?void 0:A.net)||0},other:{gross:((D=T.other)==null?void 0:D.gross)||0,tax:((N=T.other)==null?void 0:N.tax)||0,net:((C=T.other)==null?void 0:C.net)||0},statePension:{gross:((O=T.statePension)==null?void 0:O.gross)||0,tax:((V=T.statePension)==null?void 0:V.tax)||0,net:((b=T.statePension)==null?void 0:b.net)||0},isa:{gross:((g=T.isa)==null?void 0:g.gross)||0,tax:0,net:((y=T.isa)==null?void 0:y.net)||0},totalGross:T.totalGross||0,totalTax:T.totalTax||0,totalNet:T.totalNet||0}:null}}let Yn=null,Xs=null,mt=1,Q=null,F={};async function ub(n,e,t){Yn=n,Xs=t,mt=1,F={},Q=await lb(e),F={pa:Q.defaults.pa,brl:Q.defaults.brl,hrl:Q.defaults.hrl,cpi:Q.defaults.cpi,other:Q.defaults.other,grossIncomeToDate:0,confirmedSalary:Q.suggestedSalary,isaSavingsAllocation:0,isTaxEfficient:!0,taxEfficiencyChoice:null},Bs()}async function db(n){return await sb(n)}function Bs(){if(!Yn||!Q)return;const n=Q.isApril?6:7;Yn.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Tax Year ${Q.taxYear} Setup</div>
        <div class="wizard-subtitle">
          ${Q.isApril?"Setting up for the full tax year":`Starting in ${lc(Q.selectedMonth)} - ${Q.remainingMonths} months remaining`}
        </div>

        <div class="wizard-progress">
          ${pb(n,mt)}
        </div>

        ${hb()}
      </div>
    </div>
  `,mb()}function hb(){if(Q.isApril,Q.isApril)switch(mt){case 1:return _d();case 2:return wd();case 3:return Ed();case 4:return bd();case 5:return Td();case 6:return Id();default:return""}else switch(mt){case 1:return _d();case 2:return fb();case 3:return wd();case 4:return Ed();case 5:return bd();case 6:return Td();case 7:return Id();default:return""}}function _d(){return`
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
  `}function fb(){const n=lc(Q.selectedMonth),e=_b(Q.selectedMonth);return`
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
  `}function wd(){const n=F.cpi!==void 0?F.cpi:Q.defaults.cpi,e=(n*100).toFixed(1),t=Q.baseSalary,r=Math.round(t*(1+n));return`
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
  `}function Ed(){const n=Q.statePension,e=n.isReceiving?`<span style="color: var(--success);">Receiving £${Math.round(n.amount).toLocaleString()}/year</span>`:`<span style="color: var(--text-muted);">${n.yearsUntil} years until state pension</span>`;return`
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
  `}function bd(){gi();const n=ob({targetAnnualGross:F.confirmedSalary,brl:F.brl,pa:F.pa,other:F.other,statePension:Q.statePension.amount,remainingMonths:Q.remainingMonths,grossIncomeToDate:F.grossIncomeToDate});return F._isaCalc=n,n.brlExhausted?`
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
  `}function Td(){gi();const n=F._isaCalc,e=ab(F.isaSavingsAllocation,(n==null?void 0:n.isaNeeded)||0,(n==null?void 0:n.brlExhausted)||!1);if(e.sufficient&&!e.isBrlExhausted)return F.isTaxEfficient=!0,F.taxEfficiencyChoice="efficient",setTimeout(()=>{mt++,Bs()},0),`
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
  `}function Id(){gi();const n=fp({targetSalary:F.confirmedSalary,brl:F.brl,pa:F.pa,other:F.other,statePension:Q.statePension.amount,isaSavingsAllocation:F.isaSavingsAllocation,remainingMonths:Q.remainingMonths,grossIncomeToDate:F.grossIncomeToDate,isTaxEfficient:F.isTaxEfficient}),e=F.isTaxEfficient?"Tax-Efficient":"Tax-Inefficient",t=F.isTaxEfficient?"success":"warning",r=s=>`£${Math.round(s).toLocaleString()}`;return`
    <div class="wizard-step">
      <div class="wizard-step-title">Confirm Tax Year Setup</div>

      <div class="wizard-summary">
        <div class="wizard-summary-row">
          <span>Tax Year:</span>
          <span>${Q.taxYear}</span>
        </div>
        <div class="wizard-summary-row">
          <span>Starting Month:</span>
          <span>${lc(Q.selectedMonth)}</span>
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
  `}function pb(n,e){let t="";for(let r=1;r<=n;r++){const s=r<e?"done":r===e?"active":"";t+=`<div class="wizard-dot ${s}"></div>`}return t}function mb(){Yn.querySelectorAll("[data-action]").forEach(e=>{e.addEventListener("click",()=>gb(e.dataset.action))}),window._updateWizardSalary=function(){const e=document.getElementById("wizCPI"),t=document.getElementById("wizSalary"),r=document.getElementById("cpiDisplay"),s=document.getElementById("suggestedSalaryDisplay");if(e&&t&&r&&s){const i=parseFloat(e.value)||0,a=i/100,l=Q.baseSalary,c=Math.round(l*(1+a));r.textContent=i.toFixed(1),s.textContent=c.toLocaleString(),t.value=c,F.cpi=a,F.confirmedSalary=c}}}function gb(n){gi();const e=Q.isApril?6:7;switch(n){case"cancel":pp(),Xs&&Xs({completed:!1,cancelled:!0});break;case"next":mt<e&&(mt++,Bs());break;case"back":mt>1&&(mt--,Bs());break;case"apply-choice":yb(),mt++,Bs();break;case"finish":vb();break}}function yb(){var e;const n=(e=document.querySelector('input[name="taxChoice"]:checked'))==null?void 0:e.value;switch(F.taxEfficiencyChoice=n,n){case"increase":F.isaSavingsAllocation=F._isaCalc.isaNeeded,F.isTaxEfficient=!0;break;case"reduced":F.confirmedSalary=F.brl,F.isaSavingsAllocation=0,F.isTaxEfficient=!0;break;case"inefficient":F.isaSavingsAllocation=0,F.isTaxEfficient=!1;break}}function gi(){const n=document.getElementById("wizPA");n&&(F.pa=parseFloat(n.value)||12570);const e=document.getElementById("wizBRL");e&&(F.brl=parseFloat(e.value)||50270);const t=document.getElementById("wizHRL");t&&(F.hrl=parseFloat(t.value)||125140);const r=document.getElementById("wizCPI");r&&(F.cpi=(parseFloat(r.value)||4)/100);const s=document.getElementById("wizSalary");s&&(F.confirmedSalary=parseFloat(s.value)||3e4);const i=document.getElementById("wizOther");i&&(F.other=parseFloat(i.value)||0);const a=document.getElementById("wizISA");a&&(F.isaSavingsAllocation=parseFloat(a.value)||0);const l=document.getElementById("wizIncomeToDate");l&&(F.grossIncomeToDate=parseFloat(l.value)||0)}async function vb(){gi();const n=fp({targetSalary:F.confirmedSalary,brl:F.brl,pa:F.pa,other:F.other,statePension:Q.statePension.amount,isaSavingsAllocation:F.isaSavingsAllocation,remainingMonths:Q.remainingMonths,grossIncomeToDate:F.grossIncomeToDate,isTaxEfficient:F.isTaxEfficient}),e=cb({pa:F.pa,brl:F.brl,hrl:F.hrl,cpi:F.cpi,other:F.other,isaSavingsAllocation:F.isaSavingsAllocation,isTaxEfficient:F.isTaxEfficient,taxEfficiencyChoice:F.taxEfficiencyChoice,grossIncomeToDate:F.grossIncomeToDate,startMonth:parseInt(Q.selectedMonth.split("-")[1]),confirmedSalary:F.confirmedSalary,remainingMonths:Q.remainingMonths,statePension:Q.statePension.amount,monthlyBreakdown:n});console.log(`Tax Year Wizard: Saving config for ${Q.taxYear}`,e);try{await ur(Q.taxYear,e),console.log(`Tax Year Wizard: Successfully saved config for ${Q.taxYear}`)}catch(t){console.error(`Tax Year Wizard: Failed to save config for ${Q.taxYear}`,t),alert(`Error saving tax year configuration: ${t.message}`);return}pp(),Xs&&Xs({completed:!0,taxYear:Q.taxYear,config:e,wizardInputs:F})}function pp(){Yn&&(Yn.innerHTML="",Yn.style.display="none")}function lc(n){const[e,t]=n.split("-").map(Number);return new Date(e,t-1,1).toLocaleString("default",{month:"long",year:"numeric"})}function _b(n){const[e,t]=n.split("-").map(Number);return new Date(e,t-2,1).toLocaleString("default",{month:"long"})}function wb(){return`
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
  `}function Eb(n={},e=null){const t=ac(n,e),r=lp(t),s=up(r);return{results:r,stats:s,config:t}}function bb(n={},e=null){const t=ac(n,e),r=cp(t),s=up(r);return{results:r,stats:s,config:t}}function Tb(n={}){const e=ac(n),t={};for(const[r,s]of Object.entries(Gp))t[r]={...s,result:jE(e,s)};return t}let gt=null,ba=null,kr=!1;function Ib(n,e){console.log("initAuthScreen: initializing"),gt=n,ba=e,kr=!1,fE(t=>{console.log("AuthScreen: auth state change received:",t?t.email:"null","processed:",kr),t&&ba&&!kr?(console.log("AuthScreen: calling onAuthSuccessCallback"),kr=!0,Cb(),ba(t)):t?console.log("AuthScreen: skipping callback, already processed or no callback"):(kr=!1,console.log("AuthScreen: user signed out, reset authProcessed"))}),mp(),console.log("initAuthScreen: complete")}function mp(){if(gt){if(!we()){gt.innerHTML=`
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
    `;return}gt.innerHTML=`
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
  `,Sb()}}function Sb(){const n=gt.querySelectorAll(".auth-screen-tab");n.forEach(i=>{i.addEventListener("click",()=>{n.forEach(c=>c.classList.remove("active")),i.classList.add("active");const a=document.getElementById("signinForm"),l=document.getElementById("signupForm");i.dataset.tab==="signin"?(a.style.display="block",l.style.display="none"):(a.style.display="none",l.style.display="block"),yi()})}),document.getElementById("signinForm").addEventListener("submit",Ab),document.getElementById("signupForm").addEventListener("submit",xb),document.getElementById("forgotPasswordBtn").addEventListener("click",Rb),document.getElementById("googleSigninBtn").addEventListener("click",Pb)}function En(n){const e=document.getElementById("authScreenError");e&&(e.textContent=n,e.style.display="block")}function yi(){const n=document.getElementById("authScreenError");n&&(n.style.display="none")}async function Ab(n){n.preventDefault(),yi();const e=document.getElementById("signinEmail").value.trim(),t=document.getElementById("signinPassword").value;if(!e||!t){En("Please enter email and password");return}try{await mE(e,t)}catch(r){console.error("Sign in error:",r),En(Go(r.code))}}async function xb(n){n.preventDefault(),yi();const e=document.getElementById("signupName").value.trim(),t=document.getElementById("signupEmail").value.trim(),r=document.getElementById("signupPassword").value;if(!e||!t||!r){En("Please fill in all fields");return}if(r.length<6){En("Password must be at least 6 characters");return}try{await pE(t,r,e)}catch(s){console.error("Sign up error:",s),En(Go(s.code))}}async function Rb(){yi();const n=document.getElementById("signinEmail").value.trim();if(!n){En("Please enter your email address first");return}try{await yE(n),alert("Password reset email sent. Check your inbox.")}catch(e){console.error("Reset password error:",e),En(Go(e.code))}}async function Pb(){yi();try{await gE()}catch(n){console.error("Google sign in error:",n),En(Go(n.code))}}function Go(n){return{"auth/invalid-email":"Invalid email address","auth/user-disabled":"This account has been disabled","auth/user-not-found":"No account found with this email","auth/wrong-password":"Incorrect password","auth/email-already-in-use":"An account already exists with this email","auth/weak-password":"Password is too weak","auth/operation-not-allowed":"Sign in method not enabled","auth/popup-closed-by-user":"Sign in cancelled","auth/popup-blocked":"Sign in popup was blocked","auth/too-many-requests":"Too many attempts. Please try again later.","auth/invalid-credential":"Invalid email or password"}[n]||"An error occurred. Please try again."}function Cb(){gt&&(gt.innerHTML=`
      <div class="auth-screen">
        <div class="auth-screen-box" style="text-align: center;">
          <div class="auth-screen-header">
            <h1>Pension Planner</h1>
            <p>Signing in...</p>
          </div>
        </div>
      </div>
    `)}function Ja(){console.log("hideAuthScreen: hiding auth screen, element=",!!gt),gt&&(gt.style.display="none",console.log("hideAuthScreen: set display to none"))}function gp(){kr=!1,gt&&(gt.style.display="block",mp())}function kb(){return`
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
  `}let An=null,Xa=null,j={scenarioName:"My Plan",scenarioDescription:"",enabledTools:["stress","decision"],introDone:!1,baseSalary:3e4,otherIncome:0,spStartDate:"",spWeeklyAmount:0,equityMin:25e4,bondMin:2e5,cashTarget:5e4,duration:35,taxMode:"inflates",decisionSalary:3e4,decisionEquity:25e4,decisionBond:2e5,decisionCash:5e4,decisionDuration:35},at="scenario",Ie=1;function Db(){at="scenario",Ie=1,j={scenarioName:"My Plan",scenarioDescription:"",enabledTools:["stress","decision"],introDone:!1,baseSalary:3e4,otherIncome:0,spStartDate:"",spWeeklyAmount:0,equityMin:25e4,bondMin:2e5,cashTarget:5e4,duration:35,taxMode:"inflates",decisionSalary:3e4,decisionEquity:25e4,decisionBond:2e5,decisionCash:5e4,decisionDuration:35}}function yo(n,e){An=n,Xa=e,Db(),At()}function At(){An&&(at==="scenario"?Mb():at==="stress"?Ob():at==="decision"&&Bb())}function Mb(){An.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Welcome to Pension Planner</div>
        <div class="wizard-subtitle">Let's create your first plan</div>

        <div class="wizard-progress">
          ${cc(2,Ie)}
        </div>

        ${Ie===1?Nb():Lb()}
      </div>
    </div>
  `,uc()}function Nb(){return`
    <div class="wizard-step">
      <div class="wizard-step-title">Name your plan</div>
      <div class="wizard-step-desc">
        Give your plan a name. You can create multiple plans later for different scenarios
        (e.g. "Retire at 57", "Conservative at 60").
      </div>

      <div class="wizard-input" style="margin-bottom: 16px;">
        <input type="text" id="wizScenarioName" value="${j.scenarioName}" placeholder="e.g. My Retirement Plan" style="max-width: 300px;">
      </div>

      <div class="wizard-step-desc" style="margin-bottom: 8px;">
        Add an optional description:
      </div>

      <div class="wizard-input">
        <input type="text" id="wizScenarioDesc" value="${j.scenarioDescription}" placeholder="e.g. Based on retiring at age 57" style="max-width: 400px;">
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="skip-all">Skip Setup</button>
        <button class="wizard-btn primary" data-action="next">Next</button>
      </div>
    </div>
  `}function Lb(){const n=j.enabledTools.includes("stress"),e=j.enabledTools.includes("decision");return`
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
  `}function Ob(){An.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Stress Tester Setup</div>
        <div class="wizard-subtitle">Let's set up your pension simulation in a few simple steps.</div>

        <div class="wizard-progress">
          ${cc(6,Ie)}
        </div>

        ${Vb(Ie)}
      </div>
    </div>
  `,uc()}function Vb(n){switch(n){case 1:return`
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
            <button class="wizard-btn primary" data-action="finish-stress">${j.enabledTools.includes("decision")?"Continue to Decision Tool":"Finish Setup"}</button>
          </div>
        </div>
      `;default:return""}}function Bb(){An.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Decision Tool Setup</div>
        <div class="wizard-subtitle">Now let's set up the tool you'll use each month once you're retired.</div>

        <div class="wizard-progress">
          ${cc(4,Ie)}
        </div>

        ${Fb(Ie)}
      </div>
    </div>
  `,uc()}function Fb(n){switch(n){case 1:return`
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
      `;default:return""}}function cc(n,e){let t="";for(let r=1;r<=n;r++){const s=r<e?"done":r===e?"active":"";t+=`<div class="wizard-dot ${s}"></div>`}return t}function uc(){An.querySelectorAll("[data-action]").forEach(e=>{e.addEventListener("click",()=>zb(e.dataset.action))})}function zb(n){switch(yp(),n){case"skip-all":zr();break;case"next":at==="scenario"?Ie<2&&(Ie++,At()):at==="stress"?Ie<6&&(Ie++,At()):at==="decision"&&Ie<4&&(Ie++,At());break;case"back":(at==="scenario"&&Ie>1||at==="stress"&&Ie>1||at==="decision"&&Ie>1)&&(Ie--,At());break;case"start-tools":Ta("scenario");break;case"skip-stress":Ta("stress");break;case"finish-stress":j.decisionSalary=j.baseSalary,j.decisionEquity=j.equityMin,j.decisionBond=j.bondMin,j.decisionCash=j.cashTarget,j.decisionDuration=j.duration,Ta("stress");break;case"skip-decision":zr();break;case"finish":zr();break}}function Ta(n){const e=j.enabledTools.includes("stress"),t=j.enabledTools.includes("decision");n==="scenario"?e?(at="stress",Ie=1,At()):t?(at="decision",Ie=1,At()):zr():n==="stress"&&t?(at="decision",Ie=1,At()):zr()}function yp(){const n=document.getElementById("wizScenarioName");n&&(j.scenarioName=n.value.trim()||"My Plan");const e=document.getElementById("wizScenarioDesc");e&&(j.scenarioDescription=e.value.trim()||"");const t=document.getElementById("wizToolStress"),r=document.getElementById("wizToolDecision");if(t!==null||r!==null){const D=[];t&&t.checked&&D.push("stress"),r&&r.checked&&D.push("decision"),j.enabledTools=D}const s=document.getElementById("wizBaseSalary");s&&(j.baseSalary=parseFloat(s.value)||3e4);const i=document.getElementById("wizOther");i&&(j.otherIncome=parseFloat(i.value)||0);const a=document.getElementById("wizSpStartDate");a&&(j.spStartDate=a.value.trim()||"");const l=document.getElementById("wizSpWeeklyAmount");l&&(j.spWeeklyAmount=parseFloat(l.value)||0);const c=document.getElementById("wizEquityMin");c&&(j.equityMin=parseFloat(c.value)||25e4);const d=document.getElementById("wizBondMin");d&&(j.bondMin=parseFloat(d.value)||2e5);const f=document.getElementById("wizCashTarget");f&&(j.cashTarget=parseFloat(f.value)||5e4);const m=document.getElementById("wizDuration");m&&(j.duration=parseInt(m.value)||35);const v=document.getElementById("wizTaxMode");v&&(j.taxMode=v.value);const E=document.getElementById("wizDBaseSalary");E&&(j.decisionSalary=parseFloat(E.value)||3e4);const T=document.getElementById("wizDEquityMin");T&&(j.decisionEquity=parseFloat(T.value)||25e4);const x=document.getElementById("wizDBondMin");x&&(j.decisionBond=parseFloat(x.value)||2e5);const R=document.getElementById("wizDCashTarget");R&&(j.decisionCash=parseFloat(R.value)||5e4);const A=document.getElementById("wizDDuration");A&&(j.decisionDuration=parseInt(A.value)||35)}function zr(){yp(),Xa&&Xa(j)}function $b(){An&&(An.style.display="none")}function Ub(){return`
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
  `}function Ko(){const e=getComputedStyle(document.documentElement).getPropertyValue("--bg").trim()==="#0d1117"||document.documentElement.classList.contains("dark")||window.matchMedia("(prefers-color-scheme: dark)").matches;return{primary:"#f0c674",success:"#2ea043",warning:"#e1b12c",danger:"#f85149",muted:"#8b8b9b",grid:"rgba(255,255,255,0.1)",bg:e?"rgba(15,15,26,1)":"#ffffff",text:e?"#c9d1d9":"#1f2937",cardBg:e?"#21262d":"#ffffff",cone:"rgba(240,198,116,0.15)",coneMid:"rgba(240,198,116,0.2)",coneInner:"rgba(240,198,116,0.35)",coneBorder:"rgba(240,198,116,0.4)",trajectory:"rgba(46,160,67,0.25)",trajectoryFailed:"rgba(248,81,73,0.8)",trajectoryHover:"#5fdd7b",trajectoryFailedHover:"#ff6b6b",glidepath:"#7eb8da",zeroLine:"#f85149"}}const tr=new Map;let xr=-1;function Sd(n,e,t,r,s,i){const a=s-t,l=i-r,c=a*a+l*l;if(c===0)return Math.sqrt((n-t)*(n-t)+(e-r)*(e-r));const d=Math.max(0,Math.min(1,((n-t)*a+(e-r)*l)/c)),f=t+d*a,m=r+d*l;return Math.sqrt((n-f)*(n-f)+(e-m)*(e-m))}function qb(n,e,t={}){const r=Ko(),s=n.getContext("2d"),{width:i,height:a}=n,l={top:45,right:40,bottom:50,left:80},c=i-l.left-l.right,d=a-l.top-l.bottom;s.fillStyle="rgba(0,0,0,0.2)",s.fillRect(0,0,i,a);const f=t.title||"Fund Value Projections (Percentile Bands)";s.font="bold 14px system-ui, sans-serif",s.fillStyle=r.text,s.textAlign="center",s.fillText(f,l.left+c/2,22);const m=t.years||35,v={};for(let A=0;A<=m;A++)v[A]=[];e.forEach(A=>{A.hist.forEach(D=>{const N=Math.floor(D.year);v[N]!==void 0&&v[N].push(D.total)})});const E=[];for(let A=0;A<=m;A++){const D=v[A].sort((C,O)=>C-O);if(D.length===0)continue;const N=C=>D[Math.floor(D.length*C)]||0;E.push({year:A,p5:N(.05),p10:N(.1),p25:N(.25),p50:N(.5),p75:N(.75),p90:N(.9),p95:N(.95)})}if(E.length===0)return;const T=Math.max(...E.map(A=>A.p90))*1.15,x=A=>l.left+A/m*c,R=A=>a-l.bottom-A/T*d;s.strokeStyle=r.grid,s.lineWidth=1;for(let A=0;A<=5;A++){const D=l.top+A/5*d;s.beginPath(),s.moveTo(l.left,D),s.lineTo(i-l.right,D),s.stroke()}s.fillStyle=r.cone,s.beginPath(),E.forEach((A,D)=>{const N=x(A.year);D===0?s.moveTo(N,R(A.p95)):s.lineTo(N,R(A.p95))});for(let A=E.length-1;A>=0;A--)s.lineTo(x(E[A].year),R(E[A].p5));s.closePath(),s.fill(),s.fillStyle=r.coneMid,s.beginPath(),E.forEach((A,D)=>{const N=x(A.year);D===0?s.moveTo(N,R(A.p90)):s.lineTo(N,R(A.p90))});for(let A=E.length-1;A>=0;A--)s.lineTo(x(E[A].year),R(E[A].p10));s.closePath(),s.fill(),s.fillStyle=r.coneInner,s.beginPath(),E.forEach((A,D)=>{const N=x(A.year);D===0?s.moveTo(N,R(A.p75)):s.lineTo(N,R(A.p75))});for(let A=E.length-1;A>=0;A--)s.lineTo(x(E[A].year),R(E[A].p25));s.closePath(),s.fill(),t.glide&&t.glide.length>0&&(s.strokeStyle=r.glidepath,s.lineWidth=2,s.setLineDash([6,3]),s.beginPath(),t.glide.forEach((A,D)=>{const N=x(A.year),C=R(A.min);D===0?s.moveTo(N,C):s.lineTo(N,C)}),s.stroke(),s.setLineDash([])),s.strokeStyle=r.primary,s.lineWidth=3,s.beginPath(),E.forEach((A,D)=>{const N=x(A.year),C=R(A.p50);D===0?s.moveTo(N,C):s.lineTo(N,C)}),s.stroke(),s.strokeStyle="rgba(248,81,73,0.6)",s.lineWidth=1.5,s.setLineDash([4,2]),s.beginPath(),E.forEach((A,D)=>{const N=x(A.year);D===0?s.moveTo(N,R(A.p10)):s.lineTo(N,R(A.p10))}),s.stroke(),s.setLineDash([]),s.strokeStyle=r.zeroLine,s.lineWidth=2,s.setLineDash([5,5]),s.beginPath(),s.moveTo(l.left,R(0)),s.lineTo(i-l.right,R(0)),s.stroke(),s.setLineDash([]),s.fillStyle=r.muted,s.font="11px sans-serif",s.textAlign="right";for(let A=0;A<=5;A++){const D=T*(1-A/5);s.fillText(ft(D),l.left-10,l.top+A/5*d+4)}s.textAlign="center";for(let A=0;A<=m;A+=5)s.fillText(`Yr ${A}`,x(A),a-l.bottom+20);tr.set(n.id,{percentiles:E,xScale:x,yScale:R,padding:l,chartWidth:c,chartHeight:d,years:m,maxValue:T,type:"cone"}),Gb(n)}function jb(n,e,t={}){const r=Ko(),s=n.getContext("2d"),{width:i,height:a}=n,l={top:45,right:40,bottom:50,left:80},c=i-l.left-l.right,d=a-l.top-l.bottom;s.fillStyle="rgba(0,0,0,0.2)",s.fillRect(0,0,i,a);const f=t.title||"Sample Trajectories (Green=Success, Red=Failed)";s.font="bold 14px system-ui, sans-serif",s.fillStyle=r.text,s.textAlign="center",s.fillText(f,l.left+c/2,22);const m=t.years||35,v=t.startValue||1e6,E=e.slice(0,100),T=E.filter(C=>C.failed),x=E.filter(C=>!C.failed);let R;if(T.length>0)R=v*2;else{const C=x.map(V=>V.final).sort((V,b)=>V-b),O=C[Math.floor(C.length*.5)]||v;R=Math.max(O*1.3,v*1.5)}const A=C=>l.left+C/m*c,D=C=>a-l.bottom-Math.min(C,R)/R*d;s.strokeStyle=r.grid,s.lineWidth=1;for(let C=0;C<=5;C++){const O=l.top+C/5*d;s.beginPath(),s.moveTo(l.left,O),s.lineTo(i-l.right,O),s.stroke()}s.fillStyle=r.muted,s.font="11px sans-serif",s.textAlign="right";for(let C=0;C<=5;C++){const O=R*(1-C/5);s.fillText(ft(O),l.left-10,l.top+C/5*d+4)}s.textAlign="center";for(let C=0;C<=m;C+=5)s.fillText(`Yr ${C}`,A(C),a-l.bottom+20);const N=[];t.glide&&t.glide.length>0&&(s.strokeStyle=r.glidepath,s.lineWidth=3,s.setLineDash([8,4]),s.beginPath(),t.glide.forEach((C,O)=>{const V=A(C.year),b=D(C.min);O===0?s.moveTo(V,b):s.lineTo(V,b)}),s.stroke(),s.setLineDash([])),x.forEach((C,O)=>{const V=C.hist.map(b=>({x:A(b.year),y:D(b.total)}));N.push({run:C,pts:V,failed:!1,idx:O}),s.strokeStyle=r.trajectory,s.lineWidth=.5,s.beginPath(),V.forEach((b,g)=>{g===0?s.moveTo(b.x,b.y):s.lineTo(b.x,b.y)}),s.stroke()}),T.forEach((C,O)=>{const V=C.hist.map(b=>({x:A(b.year),y:D(b.total)}));N.push({run:C,pts:V,failed:!0,idx:x.length+O}),s.strokeStyle=r.trajectoryFailed,s.lineWidth=2,s.beginPath(),V.forEach((b,g)=>{g===0?s.moveTo(b.x,b.y):s.lineTo(b.x,b.y)}),s.stroke()}),s.strokeStyle=r.zeroLine,s.lineWidth=2,s.setLineDash([5,5]),s.beginPath(),s.moveTo(l.left,D(0)),s.lineTo(i-l.right,D(0)),s.stroke(),s.setLineDash([]),tr.set(n.id,{results:E,paths:N,xScale:A,yScale:D,padding:l,chartWidth:c,chartHeight:d,years:m,maxValue:R,glide:t.glide,type:"trajectory"}),Kb(n,r)}function Hb(n,e,t={}){const r=Ko(),s=n.getContext("2d"),{width:i,height:a}=n,l={top:50,right:20,bottom:55,left:60},c=i-l.left-l.right,d=a-l.top-l.bottom;s.fillStyle="rgba(0,0,0,0.2)",s.fillRect(0,0,i,a);const f=t.title||"Protection Months Distribution";s.font="bold 14px system-ui, sans-serif",s.fillStyle=r.text,s.textAlign="center",s.fillText(f,l.left+c/2,22);const m=e.map(C=>C.protMonths),v=m.length,E=Math.max(...m),T=Math.max(1,Math.ceil(E/15)),x={};m.forEach(C=>{const O=Math.floor(C/T)*T;x[O]=(x[O]||0)+1});const R=Object.keys(x).map(Number).sort((C,O)=>C-O),A=Math.max(...Object.values(x)),D=c/(R.length||1),N=[];s.strokeStyle=r.grid,s.lineWidth=1,s.fillStyle=r.muted,s.font="10px sans-serif",s.textAlign="right";for(let C=0;C<=4;C++){const O=l.top+C/4*d;s.beginPath(),s.moveTo(l.left,O),s.lineTo(i-l.right,O),s.stroke();const V=Math.round(A*(1-C/4));s.fillText(`${V} runs`,l.left-5,O+4)}R.forEach((C,O)=>{const V=x[C],b=V/A*d,g=l.left+O*D+2,y=a-l.bottom-b,_=D-4;s.fillStyle=C===0?r.success:r.warning,s.fillRect(g,y,_,b),N.push({x:g,y,w:_,h:b,months:C,monthsEnd:C+T-1,count:V,pct:(V/v*100).toFixed(1)})}),s.fillStyle=r.muted,s.font="10px sans-serif",s.textAlign="center",R.forEach((C,O)=>{if(O%2===0||R.length<12){const V=T>1?`${C}-${C+T-1}`:C.toString();s.fillText(V,l.left+O*D+D/2,a-l.bottom+15)}}),s.fillText("Protection Months",i/2,a-5),s.save(),s.translate(12,a/2),s.rotate(-Math.PI/2),s.textAlign="center",s.fillText("Number of Runs",0,0),s.restore(),tr.set(n.id,{bars:N,totalRuns:v,type:"histogram"}),Qb(n)}function Wb(n,e,t={}){const r=Ko(),s=n.getContext("2d"),{width:i,height:a}=n,l={top:50,right:180,bottom:60,left:80},c=i-l.left-l.right,d=a-l.top-l.bottom;s.fillStyle=r.bg,s.fillRect(0,0,i,a);const f=Object.keys(e),m=t.years||35;let v=0;f.forEach(R=>{const A=e[R].result;A&&A.hist&&A.hist.forEach(D=>{D.total>v&&(v=D.total)})}),v*=1.1;const E=R=>l.left+R/m*c,T=R=>l.top+d-R/v*d;Yb(s,l,c,d,m,v,t.title||"Scenario Comparison",r);const x=["#6366f1","#22c55e","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#ec4899","#84cc16"];f.forEach((R,A)=>{const D=e[R].result;if(!D||!D.hist)return;s.beginPath(),s.strokeStyle=x[A%x.length],s.lineWidth=2.5,D.hist.forEach((C,O)=>{const V=E(C.year),b=T(C.total);O===0?s.moveTo(V,b):s.lineTo(V,b)}),s.stroke();const N=l.top+15+A*24;s.fillStyle=x[A%x.length],s.fillRect(i-l.right+15,N,20,4),s.font="11px system-ui, sans-serif",s.fillStyle=r.text,s.textAlign="left",s.fillText(e[R].name||R,i-l.right+40,N+5),D.final/1e3,s.fillStyle=r.muted,s.fillText(`${ft(D.final)}`,i-l.right+40,N+18)})}function Yb(n,e,t,r,s,i,a,l){n.font="bold 14px system-ui, sans-serif",n.fillStyle=l.text,n.textAlign="center",n.fillText(a,e.left+t/2,e.top-20),n.strokeStyle=l.grid,n.lineWidth=1;for(let c=0;c<=5;c++){const d=e.top+r*c/5;n.beginPath(),n.moveTo(e.left,d),n.lineTo(e.left+t,d),n.stroke();const f=i*(5-c)/5;n.font="11px system-ui, sans-serif",n.fillStyle=l.muted,n.textAlign="right",n.fillText(ft(f),e.left-10,d+4)}for(let c=0;c<=s;c+=5){const d=e.left+c/s*t;n.beginPath(),n.moveTo(d,e.top),n.lineTo(d,e.top+r),n.stroke(),n.textAlign="center",n.fillText(`Y${c}`,d,e.top+r+20)}n.font="12px system-ui, sans-serif",n.textAlign="center",n.fillText("Years",e.left+t/2,e.top+r+45),n.save(),n.translate(20,e.top+r/2),n.rotate(-Math.PI/2),n.fillText("Fund Value",0,0),n.restore()}function ft(n){return n>=1e6?`£${(n/1e6).toFixed(1)}M`:n>=1e3?`£${(n/1e3).toFixed(0)}k`:`£${n.toFixed(0)}`}function Gb(n,e){const t=n._coneHoverListener;t&&n.removeEventListener("mousemove",t);const r=s=>{const i=tr.get(n.id);if(!i||i.type!=="cone")return;const a=n.getBoundingClientRect(),l=n.width/a.width,c=(s.clientX-a.left)*l,{percentiles:d,padding:f,chartWidth:m,years:v}=i,E=(c-f.left)/m*v,T=Math.round(E);if(T<0||T>v){bn();return}const x=d.find(A=>A.year===T);if(!x){bn();return}const R=`
      <div style="border-bottom:1px solid #555;padding-bottom:6px;margin-bottom:6px;">
        <strong style="color:#f0c674;">Year ${T}</strong>
      </div>
      <div style="display:grid;grid-template-columns:auto auto;gap:4px 16px;">
        <span style="color:#8b8b9b;">95th percentile:</span><span>${ft(x.p95)}</span>
        <span style="color:#8b8b9b;">75th percentile:</span><span>${ft(x.p75)}</span>
        <span style="color:#8b8b9b;">Median (50th):</span><span style="color:#f0c674;font-weight:bold;">${ft(x.p50)}</span>
        <span style="color:#8b8b9b;">25th percentile:</span><span>${ft(x.p25)}</span>
        <span style="color:#8b8b9b;">10th percentile:</span><span style="color:#f85149;">${ft(x.p10)}</span>
        <span style="color:#8b8b9b;">5th percentile:</span><span>${ft(x.p5)}</span>
      </div>
    `;dc(s.clientX,s.clientY,R)};n._coneHoverListener=r,n.addEventListener("mousemove",r),n.addEventListener("mouseleave",bn)}function Kb(n,e){const t=n._trajHoverListener;t&&n.removeEventListener("mousemove",t);const r=n._trajLeaveListener;r&&n.removeEventListener("mouseleave",r);const s=a=>{const l=tr.get(n.id);if(!l||l.type!=="trajectory")return;const c=n.getBoundingClientRect(),d=n.width/c.width,f=n.height/c.height,m=(a.clientX-c.left)*d,v=(a.clientY-c.top)*f,{paths:E,padding:T,chartWidth:x,chartHeight:R}=l;if(m<T.left||m>T.left+x||v<T.top||v>T.top+R){bn(),xr!==-1&&(xr=-1,Ia(n,l,e,null));return}let A=null,D=12*d;E.filter(C=>C.failed).forEach(C=>{for(let O=0;O<C.pts.length-1;O++){const V=Sd(m,v,C.pts[O].x,C.pts[O].y,C.pts[O+1].x,C.pts[O+1].y);V<D&&(D=V,A=C)}}),A||E.filter(C=>!C.failed).forEach(C=>{for(let O=0;O<C.pts.length-1;O++){const V=Sd(m,v,C.pts[O].x,C.pts[O].y,C.pts[O+1].x,C.pts[O+1].y);V<D&&(D=V,A=C)}});const N=A?A.idx:-1;if(N!==xr&&(xr=N,Ia(n,l,e,A)),A){const C=A.run,O=A.failed?"#f85149":"#2ea043",V=A.failed?"❌":"✅",b=A.failed?"FAILED":"SUCCESS";let g=`
        <div style="border-bottom:1px solid #555;padding-bottom:6px;margin-bottom:6px;">
          <strong style="color:${O};">${V} ${b}</strong>
          <span style="float:right;color:#8b8b9b;font-size:11px;">Run #${A.idx+1}</span>
        </div>
        <div style="display:grid;grid-template-columns:auto auto;gap:4px 16px;">
      `;C.startYear&&(g+=`<span style="color:#8b8b9b;">Start year:</span><span>${C.startYear}</span>`),g+=`<span style="color:#8b8b9b;">Duration:</span><span>${C.years.toFixed(1)} years</span>`,g+=`<span style="color:#8b8b9b;">Final balance:</span><span>${ft(C.final)}</span>`,g+=`<span style="color:#8b8b9b;">Protection months:</span><span>${C.protMonths}</span>`,g+=`<span style="color:#8b8b9b;">Longest streak:</span><span>${C.maxConsec} months</span>`,C.hodlUsed>0&&(g+=`<span style="color:#8b8b9b;">HODL used:</span><span>${ft(C.hodlUsed)}</span>`),g+="</div>",A.failed&&C.failMonth&&(g+=`<div style="margin-top:8px;padding-top:8px;border-top:1px solid #555;color:#f0c674;">💀 Depleted at year ${(C.failMonth/12).toFixed(1)}</div>`),dc(a.clientX,a.clientY,g)}else bn()},i=()=>{if(bn(),xr!==-1){xr=-1;const a=tr.get(n.id);a&&Ia(n,a,e,null)}};n._trajHoverListener=s,n._trajLeaveListener=i,n.addEventListener("mousemove",s),n.addEventListener("mouseleave",i)}function Qb(n,e){const t=n._histHoverListener;t&&n.removeEventListener("mousemove",t);const r=s=>{const i=tr.get(n.id);if(!i||i.type!=="histogram")return;const a=n.getBoundingClientRect(),l=n.width/a.width,c=n.height/a.height,d=(s.clientX-a.left)*l,f=(s.clientY-a.top)*c,{bars:m,totalRuns:v}=i;let E=null;if(m.forEach(T=>{d>=T.x&&d<=T.x+T.w&&f>=T.y&&f<=T.y+T.h&&(E=T)}),E){const T=E.months===0,x=T?"#2ea043":"#e1b12c",R=T?"🟢":"🟡",A=T?"No Protection":`${E.months}${E.monthsEnd>E.months?`-${E.monthsEnd}`:""} months`,D=`
        <div style="border-bottom:1px solid #555;padding-bottom:6px;margin-bottom:6px;">
          <strong style="color:${x};">${R} ${A}</strong>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 12px;">
          <span style="color:#8b8b9b;">Runs:</span><span>${E.count} of ${v}</span>
          <span style="color:#8b8b9b;">Percentage:</span><span>${E.pct}%</span>
        </div>
      `;dc(s.clientX,s.clientY,D)}else bn()};n._histHoverListener=r,n.addEventListener("mousemove",r),n.addEventListener("mouseleave",bn)}function Ia(n,e,t,r){const s=n.getContext("2d"),{width:i,height:a}=n,{paths:l,xScale:c,yScale:d,padding:f,chartWidth:m,chartHeight:v,years:E,maxValue:T,glide:x}=e;s.fillStyle="rgba(15,15,26,1)",s.fillRect(f.left,f.top,m,v),s.strokeStyle=t.grid,s.lineWidth=1;for(let R=0;R<=5;R++){const A=f.top+R/5*v;s.beginPath(),s.moveTo(f.left,A),s.lineTo(i-f.right,A),s.stroke()}x&&x.length>0&&(s.strokeStyle=t.glidepath,s.lineWidth=1.5,s.setLineDash([4,2]),s.beginPath(),x.forEach((R,A)=>{const D=c(R.year),N=d(R.min);A===0?s.moveTo(D,N):s.lineTo(D,N)}),s.stroke(),s.setLineDash([])),l.forEach(R=>{if(r&&R.idx===r.idx)return;const A=r?.15:R.failed?.8:.25;s.strokeStyle=R.failed?`rgba(248,81,73,${A})`:`rgba(46,160,67,${A})`,s.lineWidth=R.failed?2:.5,s.beginPath(),R.pts.forEach((D,N)=>{N===0?s.moveTo(D.x,D.y):s.lineTo(D.x,D.y)}),s.stroke()}),r&&(s.strokeStyle=r.failed?t.trajectoryFailedHover:t.trajectoryHover,s.lineWidth=4,s.shadowColor=r.failed?t.trajectoryFailedHover:t.trajectoryHover,s.shadowBlur=8,s.beginPath(),r.pts.forEach((R,A)=>{A===0?s.moveTo(R.x,R.y):s.lineTo(R.x,R.y)}),s.stroke(),s.shadowBlur=0),s.strokeStyle=t.zeroLine,s.lineWidth=2,s.setLineDash([5,5]),s.beginPath(),s.moveTo(f.left,d(0)),s.lineTo(i-f.right,d(0)),s.stroke(),s.setLineDash([])}function dc(n,e,t){let r=document.getElementById("chartTooltip");r||(r=document.createElement("div"),r.id="chartTooltip",document.body.appendChild(r)),r.innerHTML=t,r.style.display="block",r.style.left=n+15+"px",r.style.top=e-10+"px"}function bn(){const n=document.getElementById("chartTooltip");n&&(n.style.display="none")}function Jb(){return`
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
  `}window._simEngine={runMonteCarlo:lp,runHistorical:cp,simulate:Yo};window._constants={EQUITY_RETURNS:zs,INFLATION:tl};window._mathUtils={seededRng:rl};let Xb=null,Zb=null;const vp=document.createElement("style");vp.textContent=rb()+kb()+Ub()+wb()+Jb();document.head.appendChild(vp);const hc=document.getElementById("globalLoadingOverlay"),eT=hc.querySelector(".loading-text");function Lt(n="Loading..."){eT.textContent=n,hc.classList.add("active")}function Ot(){hc.classList.remove("active")}function ie(n,e="info",t=3e3){const r=document.querySelector(".toast-notification");r&&r.remove();const s=document.createElement("div");s.className=`toast-notification ${e}`,s.innerHTML=`
        <span class="toast-icon">${e==="success"?"✓":e==="error"?"!":"ℹ"}</span>
        <span class="toast-message">${n}</span>
      `,document.body.appendChild(s),requestAnimationFrame(()=>s.classList.add("show")),setTimeout(()=>{s.classList.remove("show"),setTimeout(()=>s.remove(),300)},t)}document.getElementById("versionDisplay").textContent=`v${Pd}`;document.getElementById("entryMonth").value=Xp();function vo(n){const e=document.getElementById(n+"SpWeeklyAmount"),t=document.getElementById(n+"SpAnnualAmount");if(!e||!t)return;const r=parseFloat(e.value)||0,s=r*52;r>0?t.value="£"+s.toLocaleString("en-GB",{maximumFractionDigits:2}):t.value=""}["ds","ss"].forEach(n=>{const e=document.getElementById(n+"SpWeeklyAmount");e&&e.addEventListener("input",()=>vo(n))});function tT(n){const e=parseFloat(n);return isNaN(e)?"":e.toString().replace(/\B(?=(\d{3})+(?!\d))/g," ")}function _p(){document.querySelectorAll('input[type="number"]').forEach(e=>{e.value,e.addEventListener("focus",function(t){setTimeout(()=>{this.select()},0)}),e.addEventListener("click",function(t){!t.shiftKey&&!t.ctrlKey&&!t.metaKey&&this.select()})})}function wp(){document.querySelectorAll('input[type="number"]').forEach(e=>{if(e.dataset.formatted)return;e.dataset.formatted="true";const t=e.closest(".input-with-unit")||e.parentElement,r=e.closest(".input-with-unit")!==null,s=document.createElement("span");s.className="number-format-overlay";const i=r?"34px":"14px";s.style.cssText=`
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
        `,getComputedStyle(t).position==="static"&&(t.style.position="relative");function a(){const l=parseFloat(e.value);!isNaN(l)&&l>=1e3&&document.activeElement!==e?(s.textContent=tT(l),s.style.display="block",e.style.color="transparent"):(s.style.display="none",e.style.color="")}e._updateOverlay=a,e.addEventListener("focus",()=>{s.style.display="none",e.style.color=""}),e.addEventListener("blur",a),e.addEventListener("input",()=>{document.activeElement===e&&(s.style.display="none",e.style.color="")}),t.appendChild(s),a()})}function fc(){document.querySelectorAll('input[type="number"]').forEach(n=>{n._updateOverlay&&n._updateOverlay()})}setTimeout(()=>{_p(),wp()},100);const nT=new MutationObserver(n=>{let e=!1;n.forEach(t=>{t.addedNodes.forEach(r=>{var s,i;r.nodeType===1&&((s=r.matches)!=null&&s.call(r,'input[type="number"]')||(i=r.querySelector)!=null&&i.call(r,'input[type="number"]'))&&(e=!0)})}),e&&setTimeout(()=>{_p(),wp()},50)});nT.observe(document.body,{childList:!0,subtree:!0});let Dr=null;async function Ep(n,e=null){Ja(),$b(),document.getElementById("mainApp").classList.remove("hidden"),document.getElementById("userEmail").textContent=n.email,await Fs();const t=await rp();bp(t),await Vt(),await nr(),Za();const r=e||(t.includes("decision")?"decision":"stress");document.querySelectorAll(".tab").forEach(a=>a.classList.remove("active"));const s=document.querySelector(`.tab[data-tab="${r}"]`);s&&s.classList.add("active"),document.querySelectorAll(".tab-content").forEach(a=>a.classList.remove("active"));const i=document.getElementById(`${r}-content`);i&&i.classList.add("active")}function bp(n){const e={decision:["decision","history","taxYears"],stress:["stress"]};document.querySelectorAll(".tab").forEach(r=>{const s=r.dataset.tab;let i=!1;for(const[a,l]of Object.entries(e))if(l.includes(s)){i=n.includes(a);break}Object.values(e).flat().includes(s)||(i=!0),r.style.display=i?"":"none"})}async function Za(){try{const n=await kn(),e=await cr();document.getElementById("entryEquity").value=e.equityMin||25e4,document.getElementById("entryBond").value=e.bondMin||2e5,document.getElementById("entryCash").value=e.cashTarget||5e4,document.getElementById("dsEquityMin").value=e.equityMin||25e4,document.getElementById("dsBondMin").value=e.bondMin||2e5,document.getElementById("dsCashTarget").value=e.cashTarget||5e4,document.getElementById("dsDuration").value=e.duration||35,document.getElementById("dsBaseSalary").value=e.baseSalary||3e4,document.getElementById("dsSpStartDate").value=e.spStartDate||"",document.getElementById("dsSpWeeklyAmount").value=e.spWeeklyAmount||"",vo("ds"),document.getElementById("dsProtectionFactor").value=e.protectionFactor||20,document.getElementById("dsRecoveryBuffer").value=e.recoveryBuffer||1e4,document.getElementById("dsConsecutiveLimit").value=e.consecutiveLimit||3,["mc","hist","scen"].forEach(t=>{const r=document.getElementById(t+"Equity"),s=document.getElementById(t+"Bond"),i=document.getElementById(t+"Cash"),a=document.getElementById(t+"Years");r&&(r.value=n.equityMin),s&&(s.value=n.bondMin),i&&(i.value=n.cashTarget),a&&(a.value=n.duration)}),document.getElementById("ssBaseSalary").value=n.baseSalary,document.getElementById("ssEquityMin").value=n.equityMin,document.getElementById("ssBondMin").value=n.bondMin,document.getElementById("ssCashTarget").value=n.cashTarget,document.getElementById("ssDuration").value=n.duration,document.getElementById("ssPA").value=n.pa,document.getElementById("ssBRL").value=n.brl,document.getElementById("ssHRL").value=n.hrl,document.getElementById("ssTaxMode").value=n.taxMode||"inflates",document.getElementById("ssOther").value=n.other||0,document.getElementById("ssSpStartDate").value=n.spStartDate||"",document.getElementById("ssSpWeeklyAmount").value=n.spWeeklyAmount||"",vo("ss"),document.getElementById("ssConsecutiveLimit").value=n.consecutiveLimit||3,document.getElementById("ssProtectionMult").value=n.protectionMult||.8,document.getElementById("ssDisableProtection").checked=n.disableProtection||!1,document.getElementById("ssHodlEnabled").checked=n.hodlEnabled||!1,document.getElementById("ssHodlValue").value=n.hodlValue||25e3,fc(),console.log("All inputs initialized from stored settings")}catch(n){console.error("Error initializing inputs from settings:",n)}}async function _o(n){console.log("Wizard completed with data:",n);try{const r={baseSalary:n.baseSalary,other:n.otherIncome,spStartDate:n.spStartDate,spWeeklyAmount:n.spWeeklyAmount,equityMin:n.equityMin,bondMin:n.bondMin,cashTarget:n.cashTarget,duration:n.duration,taxMode:n.taxMode},s={baseSalary:n.decisionSalary,equityMin:n.decisionEquity,bondMin:n.decisionBond,cashTarget:n.decisionCash,duration:n.decisionDuration,spStartDate:n.spStartDate,spWeeklyAmount:n.spWeeklyAmount};await AE(n.scenarioName||"My Plan",n.scenarioDescription||"",n.enabledTools||["stress","decision"],{stressSettings:r,decisionSettings:s},!0),Qr(),er()}catch(r){console.error("Error creating scenario from wizard:",r)}const e=ss(),t=n.enabledTools.includes("stress")?"stress":"decision";Ep(e,t)}Ib(document.getElementById("authScreen"),async n=>{console.log("Auth success callback triggered for:",n.email);try{console.log("Checking for existing cloud data...");const e=await IE();console.log("Has cloud data:",e),e?(console.log("Existing user - showing main app"),Ep(n)):(console.log("New user - showing setup wizard"),Ja(),document.getElementById("setupWizard").style.display="block",yo(document.getElementById("setupWizard"),_o))}catch(e){console.error("Error in auth callback:",e),Ja(),document.getElementById("setupWizard").style.display="block",yo(document.getElementById("setupWizard"),_o)}});document.getElementById("logoutBtn").addEventListener("click",async()=>{try{Qr(),er(),ar(),await Qf(),document.getElementById("mainApp").classList.add("hidden"),gp()}catch(n){console.error("Logout error:",n)}});async function Fs(){const n=await rc(),e=n.find(s=>s.isActive),t=document.getElementById("scenarioActiveName");t&&(t.textContent=e?e.name:"No Plan");const r=document.getElementById("scenarioList");if(r){if(n.length===0){r.innerHTML='<div class="scenario-dropdown-item" style="color:var(--text-muted);cursor:default;">No plans yet</div>';return}r.innerHTML=n.map(s=>`
        <div class="scenario-dropdown-item ${s.isActive?"active":""}" data-scenario-id="${s.id}">
          <div>
            <div class="scenario-item-name">${s.name}</div>
            ${s.description?`<div class="scenario-item-desc">${s.description}</div>`:""}
          </div>
          <div class="scenario-item-actions">
            <button class="scenario-rename-btn" data-id="${s.id}" data-name="${s.name}" title="Rename">&#9998;</button>
            ${n.length>1?`<button class="scenario-delete-btn" data-id="${s.id}" data-name="${s.name}" title="Delete">&times;</button>`:""}
          </div>
        </div>
      `).join(""),r.querySelectorAll(".scenario-dropdown-item").forEach(s=>{s.addEventListener("click",async i=>{if(i.target.closest(".scenario-item-actions"))return;const a=s.dataset.scenarioId;if(!a)return;const l=n.find(c=>c.isActive);if(l&&l.id===a){document.getElementById("scenarioDropdown").classList.remove("open");return}try{await xE(a),Qr(),er(),document.getElementById("scenarioDropdown").classList.remove("open");const c=await rp();bp(c);const d=document.querySelector(".tab.active");if(d&&d.style.display==="none"){const f=document.querySelector('.tab:not([style*="display: none"])');if(f){document.querySelectorAll(".tab").forEach(E=>E.classList.remove("active")),f.classList.add("active"),document.querySelectorAll(".tab-content").forEach(E=>E.classList.remove("active"));const m=f.dataset.tab+"-content",v=document.getElementById(m);v&&v.classList.add("active")}}await Vt(),await nr(),await Za(),await Fs()}catch(c){console.error("Error switching scenario:",c),alert("Failed to switch plan: "+c.message)}})}),r.querySelectorAll(".scenario-rename-btn").forEach(s=>{s.addEventListener("click",async i=>{i.stopPropagation();const a=s.dataset.id,l=s.dataset.name,c=prompt("Rename plan:",l);if(c&&c.trim()&&c.trim()!==l)try{await PE(a,c.trim()),await Fs()}catch(d){console.error("Error renaming scenario:",d),alert("Failed to rename plan: "+d.message)}})}),r.querySelectorAll(".scenario-delete-btn").forEach(s=>{s.addEventListener("click",async i=>{i.stopPropagation();const a=s.dataset.id,l=s.dataset.name;if(confirm(`Delete plan "${l}"? This cannot be undone.`))try{await CE(a),Qr(),er(),await Vt(),await nr(),await Za(),await Fs()}catch(c){console.error("Error deleting scenario:",c),alert("Failed to delete plan: "+c.message)}})})}}document.getElementById("scenarioActiveBtn").addEventListener("click",n=>{n.stopPropagation(),document.getElementById("scenarioDropdown").classList.toggle("open")});document.addEventListener("click",n=>{const e=document.getElementById("scenarioSelector");e&&!e.contains(n.target)&&document.getElementById("scenarioDropdown").classList.remove("open")});document.getElementById("scenarioNewBtn").addEventListener("click",async()=>{document.getElementById("scenarioDropdown").classList.remove("open"),document.getElementById("mainApp").classList.add("hidden"),document.getElementById("setupWizard").style.display="block",yo(document.getElementById("setupWizard"),_o)});document.getElementById("scenarioDuplicateBtn").addEventListener("click",async()=>{document.getElementById("scenarioDropdown").classList.remove("open");const n=await Pn();if(!n){alert("No active plan to duplicate.");return}const e=prompt("Name for the copy:",n.name+" (copy)");if(!(!e||!e.trim()))try{await RE(n.id,e.trim()),await Fs()}catch(t){console.error("Error duplicating scenario:",t),alert("Failed to duplicate plan: "+t.message)}});const rT=60*60*1e3;let Sa=null;function Tp(){Sa&&clearTimeout(Sa),ut()&&(Sa=setTimeout(async()=>{if(ut()){alert("You have been logged out due to inactivity (1 hour).");try{Qr(),er(),await Qf(),document.getElementById("mainApp").classList.add("hidden"),gp()}catch(n){console.error("Auto-logout error:",n)}}},rT))}const sT=["mousedown","mousemove","keydown","scroll","touchstart","click"];sT.forEach(n=>{document.addEventListener(n,()=>{Tp()},{passive:!0})});Tp();document.getElementById("resetBtn").addEventListener("click",async()=>{if(!(!confirm(`⚠️ WARNING: This will permanently delete ALL your data including:

• All saved settings
• All decision history
• All tax year configurations

This action cannot be undone.

Are you sure you want to reset and start over?`)||!confirm(`Are you ABSOLUTELY sure?

Type OK to confirm deletion of all your data.`)))try{console.log("Wiping all user data..."),await TE(),console.log("Data wiped successfully"),Qr(),er(),ar(),localStorage.clear(),document.getElementById("mainApp").classList.add("hidden"),document.getElementById("setupWizard").style.display="block",yo(document.getElementById("setupWizard"),_o),alert("All data has been deleted. Please complete the setup wizard to start fresh.")}catch(t){console.error("Reset error:",t),alert("Error resetting data: "+t.message)}});document.querySelectorAll(".tab").forEach(n=>{n.addEventListener("click",async()=>{document.querySelectorAll(".tab").forEach(e=>e.classList.remove("active")),n.classList.add("active"),document.querySelectorAll(".tab-content").forEach(e=>e.classList.remove("active")),document.getElementById(`${n.dataset.tab}-content`).classList.add("active"),n.dataset.tab==="history"&&await Vt(),n.dataset.tab==="taxyears"&&await nr(),n.dataset.tab==="stress"&&await pc()})});const Is=document.querySelector(".tabs"),Ad=document.querySelector(".tabs-wrapper");if(Is&&Ad){const n=()=>{const e=Is.scrollLeft+Is.clientWidth>=Is.scrollWidth-10;Ad.classList.toggle("scrolled-end",e)};Is.addEventListener("scroll",n),n()}document.querySelectorAll(".sub-tab[data-stresstab]").forEach(n=>{n.addEventListener("click",async()=>{document.querySelectorAll(".sub-tab[data-stresstab]").forEach(e=>e.classList.remove("active")),n.classList.add("active"),document.querySelectorAll(".stress-subtab").forEach(e=>e.classList.add("hidden")),document.getElementById(`stress-${n.dataset.stresstab}`).classList.remove("hidden"),n.dataset.stresstab==="stresssettings"&&await pc()})});document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(n=>{n.addEventListener("click",async()=>{document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(e=>e.classList.remove("active")),n.classList.add("active"),document.querySelectorAll(".decision-subtab").forEach(e=>e.classList.add("hidden")),document.getElementById(`decision-${n.dataset.decisiontab}`).classList.remove("hidden"),n.dataset.decisiontab==="decisionsettings"&&await Sp()})});function iT(n){const[e,t]=n.split("-").map(Number);return t>=4?e%100+"/"+(e+1)%100:(e-1)%100+"/"+e%100}function oT(n){const[e,t]=n.split("-").map(Number);return Math.max(0,(t>=4?e:e-1)-2026)}function Aa(n,e,t,r,s){if(s){const i=Math.max(0,1-e/t);return n*r*i}return n*r}function xd(n,e,t){return n<=e?n:n<=t?e+(n-e)*.8:e+(t-e)*.8+(n-t)*.6}async function Rd(n,e,t,r){var hs,sn,Er,br;const s=await cr(),i=await os(),a=await Cn(),l=iT(n),c=oT(n),[d,f]=n.split("-").map(Number);if(!a[l])throw new Error(`Tax year ${l} is not configured. Please add it in the Settings tab before calculating.`);const m=a[l],v=m.pa||12570,E=m.brl||50270,T=m.other||0,x=m.isTaxEfficient!==!1,R=m.isaSavingsAllocation||0,A=m.grossIncomeToDate||0,D=m.confirmedSalary||s.baseSalary,N=i.find(J=>J.date===n),C=(N==null?void 0:N.isa)||0,O=Math.max(0,(m.isaSavingsUsed||0)-C),b=(await ic(l)).amount||0;let g=1;for(let J=0;J<c;J++){const Ne=String((26+J)%100).padStart(2,"0")+"/"+String((27+J)%100).padStart(2,"0"),ge=(a[Ne]||{}).cpi||.04;g*=1+ge}const y=Math.round(Aa(s.equityMin,c,s.duration,g,!0)),_=Math.round(Aa(s.bondMin,c,s.duration,g,!0)),I=Math.round(Aa(s.cashTarget,c,s.duration,g,!1)),S=e+t,w=y+_;let ae=!1,Me=0;const Z=i.filter(J=>J.date<n);for(let J=Z.length-1;J>=0&&Z[J].source==="Cash";J--)Me++;Z.length&&Z[Z.length-1].inProtection&&(ae=S<=w+(s.recoveryBuffer||1e4)),!ae&&S<w&&Me+1>=(s.consecutiveLimit||3)&&(ae=!0);const xe=f>=4?16-f:4-f,ue=Math.max(1,xe),fe=D*g,Oe=T+b;let de,Ee,U,be=0,X=0,oe=!1,Ve=0;const ht=Math.max(0,R-O)/ue;if(x){const J=Oe/12;i.filter(ye=>ye.taxYear===l&&ye.date<n);const Ne=fe/12;let ge;if(((sn=(hs=m.expectedMonthly)==null?void 0:hs.sipp)==null?void 0:sn.gross)>0)ge=m.expectedMonthly.sipp.gross;else{const Re=Math.max(0,E-A-Oe)/12;ge=Math.min(Ne-J,Re)}const $t=xd(fe,v,E)/12,vt=Math.min(fe,E),_t=xd(vt,v,E)/12,ve=Math.max(0,$t-_t),Se=Math.min(ve,ht);if(Ve=Se,be=ge,ae){const ye=(s.protectionFactor||20)/100;de=ge*(1-ye),Ee=Se,U="Protection"}else{de=ge,Ee=Se,U="Tax-Efficient";const ye=f>=4?d:d-1,Re=Z.filter(Pe=>{const[On,Tr]=Pe.date.split("-").map(Number);return(Tr>=4?On:On-1)===ye});let nt=0,Ln=0;if(Re.forEach(Pe=>{Ln+=Pe.sipp||0,Pe.inProtection&&Pe.stdSipp&&(nt+=Pe.stdSipp-Pe.sipp),Pe.boostAmount>0&&(nt-=Pe.boostAmount)}),nt>0){const Pe=Ln+de*ue+Oe,On=E-Pe,Tr=S-w-(s.recoveryBuffer||1e4);if(On>0&&Tr>0){const Vn=On/ue,Ei=nt/ue,fs=Tr/ue;X=Math.min(Ei,Vn,fs),X>50&&(de+=X,U="Tax Boost")}}}}else{const J=fe/12,Ne=Oe/12;let ge;if(((br=(Er=m.expectedMonthly)==null?void 0:Er.sipp)==null?void 0:br.gross)>0?ge=m.expectedMonthly.sipp.gross:ge=Math.max(0,J-Ne),be=ge,Ee=0,ae){const $t=(s.protectionFactor||20)/100;de=ge*(1-$t),U="Protection";const vt=f>=4?d:d-1,_t=Z.filter(ye=>{const[Re,nt]=ye.date.split("-").map(Number);return(nt>=4?Re:Re-1)===vt});let ve=0;_t.forEach(ye=>{ve+=ye.sipp||0});const Se=ve+de*ue+Oe;if(Se<E){const Re=(E-Se)/ue,nt=S-w-(s.recoveryBuffer||1e4);nt>0&&Re>50&&(X=Math.min(Re,nt/ue),X>50&&(de+=X,oe=!0,U="Protection-Induced Efficiency"))}}else{de=ge,U="Tax-Inefficient";const $t=f>=4?d:d-1,vt=Z.filter(Se=>{const[ye,Re]=Se.date.split("-").map(Number);return(Re>=4?ye:ye-1)===$t});let _t=0,ve=0;if(vt.forEach(Se=>{ve+=Se.sipp||0,Se.inProtection&&Se.stdSipp&&(_t+=Se.stdSipp-Se.sipp),Se.boostAmount>0&&(_t-=Se.boostAmount)}),_t>0){const Se=ve+de*ue+Oe,ye=E-Se,Re=S-w-(s.recoveryBuffer||1e4);if(ye>0&&Re>0){const nt=ye/ue,Ln=_t/ue,Pe=Re/ue;X=Math.min(Ln,nt,Pe),X>50&&(de+=X,U="Tax Boost")}}}}let Be,It,dr=0,hr=0,Dn=0,Mn="";if(!ae&&S>=w+de){Be="Growth";const J=Math.max(0,e-y),Ne=Math.max(0,t-_),ge=J+Ne;ge>0?(dr=de*J/ge,hr=de*Ne/ge,It="Healthy"):(Be="Cash",Dn=de,It="At min")}else Be="Cash",Dn=de,It=ae?"Protection":"Below min",r<de&&(Mn="Cash low!");let St="";const fr=e-y,pr=t-_;if(fr>5e3&&pr<-5e3){const J=Math.floor(Math.min(fr,-pr)/1e3)*1e3;J>=5e3&&(St=`Move £${J.toLocaleString()} Equity→Bond`)}else if(pr>5e3&&fr<-5e3){const J=Math.floor(Math.min(pr,-fr)/1e3)*1e3;J>=5e3&&(St=`Move £${J.toLocaleString()} Bond→Equity`)}let mr="";const gr=I-r;if(gr>5e3&&Be==="Growth"&&!ae){const J=S-w-de;if(J>1e4){const Ne=Math.floor(Math.min(gr*.3,J*.5)/1e3)*1e3;Ne>=5e3&&(mr=`Replenish Cash: Move £${Ne.toLocaleString()} from growth funds`)}}const rn=[];Mn&&rn.push({message:Mn,severity:"danger",type:"low-cash"}),X>50&&rn.push({message:`Tax Boost: +£${Math.round(X).toLocaleString()}/mo catch-up from protection shortfall`,severity:"success",type:"tax-boost"}),St&&rn.push({message:St,severity:"warning",type:"rebalance"}),mr&&rn.push({message:mr,severity:"info",type:"cash-replenish"});const Qo=f>=4?d:d-1,yr=Z.filter(J=>{const[Ne,ge]=J.date.split("-").map(Number);return(ge>=4?Ne:Ne-1)===Qo}),as=yr.reduce((J,Ne)=>J+(Ne.sipp||0),0),vr=yr.length+1,$e=Math.max(0,12-vr)*be,Ft=as+de+$e+T+b;let zt=0;Ft>v&&(Ft<=E?zt=(Ft-v)*.2:zt=(E-v)*.2+(Ft-E)*.4);const vi=zt/12,cs=de+T/12+b/12-vi+Ee,_i=vi*vr,us=zt,wr=fe/12;let ds=0;wr*12>v&&(wr*12<=E?ds=(wr*12-v)*.2:ds=(E-v)*.2+(wr*12-E)*.4);const Nn=Math.max(0,ds/12-zt/12),wi=O+Ve;return{date:n,taxYear:l,yearNumber:c,remainingMonths:ue,equity:e,bond:t,cash:r,isa:0,adjEquityMin:y,adjBondMin:_,adjCashTarget:I,pa:v,brl:E,other:T/12,statePension:b/12,sippDraw:de,stdSipp:be,isaDraw:Ee,totalMonthlyNet:cs,isTaxEfficientYear:x,yearlyIsaSavingsAllocation:R,cumulativeIsaSavingsUsed:wi,isaSavingsUsedThisMonth:Ve,taxPaidYTD:_i,taxProjectedAnnual:us,taxSavedMonthly:Nn,taxSavedYTD:Nn*vr,taxSavedProjectedAnnual:Nn*12,taxEfficient:x&&!oe,inProtection:ae,protectionReason:ae?It:null,consecutiveCashDraws:Me,protectionInducedTaxEfficiency:oe,boostAmount:X>50?X:0,boostEligible:X>50,source:Be,drawFromEquity:dr,drawFromBond:hr,drawFromCash:Dn,rebalanceNeeded:St!=="",rebalanceActions:St?[St]:[],alerts:rn,calculationDetails:{mode:U,reason:`${It} | ${U}`,totalGrowth:S,minGrowth:w,consec:Me,stdSipp:de,inputs:{baseSalary:s.baseSalary,confirmedSalary:D,targetGross:fe,cumInf:g,yearNum:c,taxYear:l,OTHER:T,STATE:b,PA:v,BRL:E,isTaxEfficientYear:x,yearlyIsaSavingsAllocation:R,grossIncomeToDate:A},taxInfo:{annualTaxable:Ft,headroomToBRL:E-Ft,annualTax:zt,monthlyNet:cs}}}}window.handleDecisionSubmit=async function(n){n.preventDefault();const e=document.getElementById("entryMonth").value,t=parseFloat(document.getElementById("entryEquity").value)||0,r=parseFloat(document.getElementById("entryBond").value)||0,s=parseFloat(document.getElementById("entryCash").value)||0,i=[];if(e||i.push("Month"),!t&&t!==0&&i.push("Equity Fund"),!r&&r!==0&&i.push("Bond Balance"),!s&&s!==0&&i.push("Cash Balance"),i.length>0){ie("Missing: "+i.join(", "),"error",4e3);return}if((await os({limit:1e3})).find(c=>c.date===e)){ie(`${Jr(e)} already has a saved decision. Delete it from the History tab first to recalculate.`,"error",5e3);return}try{if((await db(e)).showWizard){const f=document.getElementById("taxYearWizard");f.style.display="block",window._pendingDecisionForm={dateStr:e,equity:t,bond:r,cash:s},ub(f,e,async m=>{if(f.style.display="none",m&&m.completed)try{Dr=await Rd(e,t,r,s);const v=document.getElementById("decisionOutput");vd(Dr,v),document.getElementById("saveBtn").disabled=!1}catch(v){console.error("Decision error after wizard:",v),ie("Error: "+v.message,"error")}});return}Dr=await Rd(e,t,r,s);const d=document.getElementById("decisionOutput");vd(Dr,d),document.getElementById("saveBtn").disabled=!1}catch(c){console.error("Decision error:",c),ie("Error: "+c.message,"error")}};window.saveCurrentDecision=async function(){const n=document.getElementById("saveBtn");if(!Dr){ie("No decision to save","error");return}if(!ut()){ie("Please sign in to save decisions","error");return}n.classList.add("loading"),n.disabled=!0;try{await $E(Dr),ie("Decision saved to history","success"),await Vt()}catch(e){console.error("Save error:",e),ie("Error saving: "+e.message,"error"),n.disabled=!1}finally{n.classList.remove("loading")}};window.runMonteCarloUI=async function(){const n={equityStart:parseFloat(document.getElementById("mcEquity").value)||25e4,bondStart:parseFloat(document.getElementById("mcBond").value)||2e5,cashStart:parseFloat(document.getElementById("mcCash").value)||5e4,years:parseInt(document.getElementById("mcYears").value)||35};document.getElementById("mcResults").innerHTML='<div class="loading"><div class="spinner"></div>Running simulation...</div>',await kn(),setTimeout(()=>{try{const{results:e,stats:t}=Eb(n);Xb=e,Ip(t,e,"Monte Carlo (1000 runs)","mcResults",n.years)}catch(e){console.error("Simulation error:",e),document.getElementById("mcResults").innerHTML=`<div class="alert alert-danger">Error: ${e.message}</div>`}},50)};window.runHistoricalUI=async function(){const n={equityStart:parseFloat(document.getElementById("histEquity").value)||25e4,bondStart:parseFloat(document.getElementById("histBond").value)||2e5,cashStart:parseFloat(document.getElementById("histCash").value)||5e4,years:parseInt(document.getElementById("histYears").value)||35};document.getElementById("histResults").innerHTML='<div class="loading"><div class="spinner"></div>Running simulation...</div>',await kn(),setTimeout(()=>{try{const{results:e,stats:t}=bb(n);Zb=e,Ip(t,e,"Historical Analysis","histResults",n.years)}catch(e){console.error("Simulation error:",e),document.getElementById("histResults").innerHTML=`<div class="alert alert-danger">Error: ${e.message}</div>`}},50)};window.runScenariosUI=async function(){const n={equityStart:parseFloat(document.getElementById("scenEquity").value)||25e4,bondStart:parseFloat(document.getElementById("scenBond").value)||2e5,cashStart:parseFloat(document.getElementById("scenCash").value)||5e4,years:35};document.getElementById("scenResults").innerHTML='<div class="loading"><div class="spinner"></div>Running scenarios...</div>',await kn(),setTimeout(()=>{try{const e=Tb(n);dT(e,"scenResults")}catch(e){console.error("Scenario error:",e),document.getElementById("scenResults").innerHTML=`<div class="alert alert-danger">Error: ${e.message}</div>`}},50)};function aT(n){if(!n.spStartDate||!n.spWeeklyAmount)return console.warn("State Pension not configured - spStartDate or spWeeklyAmount missing"),{spStartYear:999,spWeeklyAmount:0,spFirstYearRatio:1};const e=lT(n.spStartDate);if(!e)return console.warn("Could not parse spStartDate:",n.spStartDate),{spStartYear:999,spWeeklyAmount:0,spFirstYearRatio:1};const t=new Date,r=365.25*24*60*60*1e3,s=Math.max(0,(e.getTime()-t.getTime())/r),i=Math.floor(s);e.getMonth(),e.getDate();const a=365,l=Math.floor((e-new Date(e.getFullYear(),0,0))/(24*60*60*1e3)),d=(a-l)/a;return{spStartYear:i,spWeeklyAmount:n.spWeeklyAmount,spFirstYearRatio:d}}function lT(n){if(!n)return null;if(/^\d{4}-\d{2}-\d{2}$/.test(n))return new Date(n);if(/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(n)){const[r,s,i]=n.split("/").map(Number);return new Date(i,s-1,r)}const e={january:0,february:1,march:2,april:3,may:4,june:5,july:6,august:7,september:8,october:9,november:10,december:11};let t=n.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+(\w+)\s+(\d{4})$/i);if(t){const r=parseInt(t[1]),s=e[t[2].toLowerCase()],i=parseInt(t[3]);if(s!==void 0)return new Date(i,s,r)}if(t=n.match(/^(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?\s+(\d{4})$/i),t){const r=e[t[1].toLowerCase()],s=parseInt(t[2]),i=parseInt(t[3]);if(r!==void 0)return new Date(i,r,s)}return null}let xa=!1;window.runOptimisationUI=async function(n){if(xa)return;xa=!0;const e=document.getElementById("optimiseBtn"+n),t=document.getElementById("optimiseResults"+n);e&&(e.disabled=!0),e&&(e.textContent="Optimising...");let r,s,i,a;n==="MC"?(r=document.getElementById("mcEquity"),s=document.getElementById("mcBond"),i=document.getElementById("mcCash"),a=document.getElementById("mcYears")):(r=document.getElementById("histEquity"),s=document.getElementById("histBond"),i=document.getElementById("histCash"),a=document.getElementById("histYears"));const l=+r.value,c=+s.value,d=+i.value,f=+a.value,m=l+c+d;t.innerHTML='<div class="loading"><div class="spinner"></div>Testing allocations...</div>';const v=await kn(),E=JSON.parse(JSON.stringify(v));setTimeout(()=>{try{let T=null,x={equity:l,bond:c,cash:d,rate:0,avgProt:0,withProt:0,totalRuns:0};const R=[];for(let I=5;I<=30;I+=5)for(let S=20;S<=95-I;S+=5){const w=100-I-S;w>=0&&R.push({equity:Math.round(m*S/100),bond:Math.round(m*w/100),cash:Math.round(m*I/100)})}const{EQUITY_RETURNS:A,INFLATION:D}=window._constants,{simulate:N}=window._simEngine,{seededRng:C}=window._mathUtils,O=Object.keys(A).map(Number).sort((I,S)=>I-S),V=Math.max(...O),b=I=>{const S={equityStart:I.equity,bondStart:I.bond,cashStart:I.cash,years:f,equityMin:E.equityMin,bondMin:E.bondMin,cashTarget:E.cashTarget,duration:E.duration,baseSalary:E.baseSalary,other:E.other,...aT(E),pa:E.pa,brl:E.brl,hrl:E.hrl,taxMode:E.taxMode,protectionMult:E.protectionMult,consecutiveLimit:E.consecutiveLimit,disableProtection:E.disableProtection,hodlEnabled:E.hodlEnabled,hodlValue:E.hodlValue},w=[];if(n==="MC")for(let U=0;U<1e3;U++){const be=C(U*12345),X={equity:{},inflation:{}};for(let oe=0;oe<f;oe++){const Ve=O[Math.floor(be()*O.length)];X.equity[oe]=A[Ve],X.inflation[oe]=D[Ve]||.025}w.push(N(S,X,U))}else O.forEach(U=>{if(U+f-1>V)return;const be={equity:{},inflation:{}};for(let X=0;X<f;X++)be.equity[X]=A[U+X]||0,be.inflation[X]=D[U+X]||.025;w.push(N(S,be,U))});const ae=w.filter(U=>U.failed),Me=w.filter(U=>!U.failed),Z=(w.length-ae.length)/w.length*100,ue=w.map(U=>U.protMonths).reduce((U,be)=>U+be,0)/w.length,fe=w.filter(U=>U.protMonths>0).length,Oe=Me.map(U=>U.final).sort((U,be)=>U-be),de=Oe.length>0?Oe[Math.floor(Oe.length*.5)]:0,Ee=Oe.length>0?Oe[Math.floor(Oe.length*.9)]:0;return{equity:I.equity,bond:I.bond,cash:I.cash,rate:Z,avgProt:ue,withProt:fe,totalRuns:w.length,medianFinal:de,p90Final:Ee}},y=b({equity:l,bond:c,cash:d});x.avgProt=y.avgProt,x.withProt=y.withProt,x.totalRuns=y.totalRuns,x.rate=y.rate,x.medianFinal=y.medianFinal,x.p90Final=y.p90Final,R.forEach(I=>{const S=b(I);S.avgProt<=x.avgProt&&(!T||S.rate>T.rate)&&(T=S)});let _="";if(T&&T.rate>x.rate){const I=T.medianFinal-x.medianFinal,S=x.medianFinal>0?I/x.medianFinal*100:0;_+='<div class="card" style="margin-top:20px;border-color:var(--success);">',_+='<h3 style="color:var(--success);margin-top:0;">Better Allocation Found</h3>',_+='<p style="color:var(--text-muted);margin-bottom:16px;">A different fund split could improve your success rate without increasing protection usage:</p>',_+='<div class="grid-2" style="gap:20px;margin-bottom:20px;">',_+='<div style="padding:16px;background:rgba(0,0,0,0.2);border-radius:8px;">',_+='<div style="font-weight:500;margin-bottom:12px;color:var(--text-muted);">Your Current Split</div>',_+='<div style="font-size:24px;font-weight:600;color:var(--warning);">'+x.rate.toFixed(1)+"%</div>",_+='<div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">Success Rate</div>',_+='<div style="font-size:13px;">Equity: '+H(x.equity)+" ("+Math.round(x.equity/m*100)+"%)</div>",_+='<div style="font-size:13px;">Bonds: '+H(x.bond)+" ("+Math.round(x.bond/m*100)+"%)</div>",_+='<div style="font-size:13px;">Cash: '+H(x.cash)+" ("+Math.round(x.cash/m*100)+"%)</div>",_+='<div style="font-size:12px;color:var(--text-muted);margin-top:8px;">Avg protection: '+x.avgProt.toFixed(0)+" mo | Median final: "+H(x.medianFinal)+"</div>",_+="</div>",_+='<div style="padding:16px;background:rgba(46,160,67,0.1);border-radius:8px;border:1px solid var(--success);">',_+='<div style="font-weight:500;margin-bottom:12px;color:var(--success);">Optimised Split</div>',_+='<div style="font-size:24px;font-weight:600;color:var(--success);">'+T.rate.toFixed(1)+"%</div>",_+='<div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">Success Rate (+'+(T.rate-x.rate).toFixed(1)+"%)</div>",_+='<div style="font-size:13px;">Equity: '+H(T.equity)+" ("+Math.round(T.equity/m*100)+"%)</div>",_+='<div style="font-size:13px;">Bonds: '+H(T.bond)+" ("+Math.round(T.bond/m*100)+"%)</div>",_+='<div style="font-size:13px;">Cash: '+H(T.cash)+" ("+Math.round(T.cash/m*100)+"%)</div>",_+='<div style="font-size:12px;color:var(--text-muted);margin-top:8px;">Avg protection: '+T.avgProt.toFixed(0)+" mo | Median final: "+H(T.medianFinal)+"</div>",_+="</div>",_+="</div>",I<0?(_+='<div class="alert alert-warning" style="margin-bottom:16px;">',_+="<strong>Trade-off:</strong> The optimised allocation has a "+Math.abs(S).toFixed(0)+"% lower median final value. ",_+="This is because it likely has less equity exposure. You gain safety but may sacrifice some upside.",_+="</div>"):I>0&&(_+='<div class="alert alert-info" style="margin-bottom:16px;">',_+="<strong>Bonus:</strong> The optimised allocation also has a "+S.toFixed(0)+"% higher median final value!",_+="</div>"),_+='<div class="alert alert-info" style="margin-bottom:16px;">',_+="<strong>To apply this allocation:</strong> Click the button below to update your Settings with these new fund minimums.",_+="</div>",_+='<button onclick="applyOptimisedAllocationUI('+T.equity+","+T.bond+","+T.cash+')" style="width:100%;">Apply Optimised Allocation to Settings</button>',_+="</div>"}else _+='<div class="card" style="margin-top:20px;border-color:var(--primary);">',_+='<h3 style="color:var(--primary);margin-top:0;">Your Allocation is Already Optimal</h3>',_+='<p style="color:var(--text-muted);">We tested '+R.length+" different fund splits. Your current allocation achieves the best success rate ("+x.rate.toFixed(1)+"%) without increasing protection usage.</p>",_+='<p style="font-size:13px;color:var(--text-muted);">Your protection: '+x.avgProt.toFixed(0)+" months average</p>",_+="</div>";t.innerHTML=_}catch(T){console.error("Optimisation error:",T),t.innerHTML='<div class="alert alert-danger">Error: '+T.message+"</div>"}finally{xa=!1,e&&(e.disabled=!1,e.textContent="Optimise Allocation")}},50)};window.applyOptimisedAllocationUI=async function(n,e,t){if(document.getElementById("ssEquityMin").value=n,document.getElementById("ssBondMin").value=e,document.getElementById("ssCashTarget").value=t,document.getElementById("dsEquityMin").value=n,document.getElementById("dsBondMin").value=e,document.getElementById("dsCashTarget").value=t,document.getElementById("mcEquity").value=n,document.getElementById("mcBond").value=e,document.getElementById("mcCash").value=t,document.getElementById("histEquity").value=n,document.getElementById("histBond").value=e,document.getElementById("histCash").value=t,document.getElementById("scenEquity").value=n,document.getElementById("scenBond").value=e,document.getElementById("scenCash").value=t,ut())try{await hp({equityMin:n,bondMin:e,cashTarget:t})}catch(r){console.error("Error saving optimised settings:",r)}alert("Settings updated! Run the test again to see the full results with your new allocation.")};const cT={1929:"Wall Street Crash / Great Depression",1930:"Great Depression",1931:"Great Depression",1932:"Great Depression",1937:"Recession of 1937",1968:"Late 1960s stagflation",1969:"Late 1960s recession",1973:"Oil Crisis / 1973-74 crash",1974:"1973-74 bear market",2e3:"Dot-com bubble burst",2001:"Dot-com bust / 9/11",2007:"Global Financial Crisis",2008:"Global Financial Crisis",2022:"Post-COVID inflation / rate hikes"};function uT(n){if(!n||n.length===0)return"";const e=n.filter(i=>i.failed).sort((i,a)=>i.years-a.years),t=n.filter(i=>i.protMonths>0).sort((i,a)=>a.protMonths-i.protMonths),r=e.length>0?e.slice(0,5):t.slice(0,5);if(r.length===0)return"";let s=`
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
      `;return r.forEach(i=>{const a=i.startYear||i.seed,l=cT[a]||"-",c=i.failed?"danger":"success";s+=`
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
      `,s}function Ip(n,e,t,r,s){const i=n.successRate>=90?"success":n.successRate>=80?"warning":"danger",a=r.replace("Results",""),l=n.survival||{},c=n.finalValue||{},d=n.protection||{};let f=`
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
          ${r==="histResults"?uT(e):""}

          <!-- Result Summary -->
          <div class="alert ${i==="success"?"alert-success":i==="warning"?"alert-warning":"alert-danger"}" style="margin-top: 24px;">
            ${n.successRate>=90?"Excellent! Very high probability of success.":n.successRate>=80?"Good but some downside risk. Consider adjustments.":"Warning: Significant risk of depletion."}
          </div>
        </div>
      `;document.getElementById(r).innerHTML=f,setTimeout(()=>{const m=document.getElementById(`${a}ConeChart`),v=document.getElementById(`${a}TrajChart`),E=document.getElementById(`${a}HistChart`);m&&e&&e.length>0&&qb(m,e,{years:s,title:"Cone of Uncertainty (5th-95th Percentile)"}),v&&e&&e.length>0&&jb(v,e,{years:s,title:"Sample Trajectories (100 runs)"}),E&&e&&e.length>0&&Hb(E,e,{title:"Protection Months Distribution"})},50)}function dT(n,e){let t='<div class="card"><h2>Scenario Analysis</h2>';t+=`
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
        `}t+="</div></div>",document.getElementById(e).innerHTML=t,setTimeout(()=>{const r=document.getElementById("scenCompChart");r&&n&&Wb(r,n,{years:35,title:"Scenario Comparison"})},50)}async function pc(){Lt("Loading settings...");try{const n=await kn();document.getElementById("ssBaseSalary").value=n.baseSalary,document.getElementById("ssEquityMin").value=n.equityMin,document.getElementById("ssBondMin").value=n.bondMin,document.getElementById("ssCashTarget").value=n.cashTarget,document.getElementById("ssDuration").value=n.duration,document.getElementById("ssPA").value=n.pa,document.getElementById("ssBRL").value=n.brl,document.getElementById("ssHRL").value=n.hrl,document.getElementById("ssTaxMode").value=n.taxMode||"inflates",document.getElementById("ssOther").value=n.other||0,document.getElementById("ssSpStartDate").value=n.spStartDate||"",document.getElementById("ssSpWeeklyAmount").value=n.spWeeklyAmount||"",vo("ss"),document.getElementById("ssConsecutiveLimit").value=n.consecutiveLimit||3,document.getElementById("ssProtectionMult").value=n.protectionMult||.8,document.getElementById("ssDisableProtection").checked=n.disableProtection||!1,document.getElementById("ssHodlEnabled").checked=n.hodlEnabled||!1,document.getElementById("ssHodlValue").value=n.hodlValue||25e3,fc()}catch(n){console.error("Error loading stress settings:",n)}finally{Ot()}}window.saveStressSettingsUI=async function(){if(!ut()){ie("Please sign in to save settings","error");return}Lt("Saving settings...");try{await hp({baseSalary:+document.getElementById("ssBaseSalary").value,equityMin:+document.getElementById("ssEquityMin").value,bondMin:+document.getElementById("ssBondMin").value,cashTarget:+document.getElementById("ssCashTarget").value,duration:+document.getElementById("ssDuration").value,pa:+document.getElementById("ssPA").value,brl:+document.getElementById("ssBRL").value,hrl:+document.getElementById("ssHRL").value,taxMode:document.getElementById("ssTaxMode").value,other:+document.getElementById("ssOther").value,spStartDate:document.getElementById("ssSpStartDate").value.trim()||null,spWeeklyAmount:+document.getElementById("ssSpWeeklyAmount").value||0,consecutiveLimit:+document.getElementById("ssConsecutiveLimit").value,protectionMult:+document.getElementById("ssProtectionMult").value,disableProtection:document.getElementById("ssDisableProtection").checked,hodlEnabled:document.getElementById("ssHodlEnabled").checked,hodlValue:+document.getElementById("ssHodlValue").value}),ie("Settings saved successfully","success")}catch(n){console.error("Error saving stress settings:",n),ie("Error saving: "+n.message,"error")}finally{Ot()}};window.resetStressSettingsUI=async function(){if(confirm("Reset all stress settings to defaults?")){Lt("Resetting settings...");try{await ZE(),await pc(),ie("Settings reset to defaults","success")}catch(n){console.error("Error resetting settings:",n),ie("Error resetting: "+n.message,"error")}finally{Ot()}}};async function Sp(){Lt("Loading settings...");try{const n=await cr();document.getElementById("dsEquityMin").value=n.equityMin||25e4,document.getElementById("dsBondMin").value=n.bondMin||2e5,document.getElementById("dsCashTarget").value=n.cashTarget||5e4,document.getElementById("dsDuration").value=n.duration||35,document.getElementById("dsBaseSalary").value=n.baseSalary||3e4,document.getElementById("dsProtectionFactor").value=n.protectionFactor||20,document.getElementById("dsRecoveryBuffer").value=n.recoveryBuffer||15e3,document.getElementById("dsConsecutiveLimit").value=n.consecutiveLimit||3,document.getElementById("entryEquity").value=n.equityMin||25e4,document.getElementById("entryBond").value=n.bondMin||2e5,document.getElementById("entryCash").value=n.cashTarget||5e4,fc()}catch(n){console.error("Error loading decision settings:",n)}finally{Ot()}}window.saveDecisionSettingsUI=async function(){if(!ut()){ie("Please sign in to save settings","error");return}Lt("Saving settings...");try{await op({equityMin:+document.getElementById("dsEquityMin").value,bondMin:+document.getElementById("dsBondMin").value,cashTarget:+document.getElementById("dsCashTarget").value,duration:+document.getElementById("dsDuration").value,baseSalary:+document.getElementById("dsBaseSalary").value,spStartDate:document.getElementById("dsSpStartDate").value.trim()||null,spWeeklyAmount:+document.getElementById("dsSpWeeklyAmount").value||0,protectionFactor:+document.getElementById("dsProtectionFactor").value,recoveryBuffer:+document.getElementById("dsRecoveryBuffer").value,consecutiveLimit:+document.getElementById("dsConsecutiveLimit").value}),ie("Settings saved successfully","success")}catch(n){console.error("Error saving decision settings:",n),ie("Error saving: "+n.message,"error")}finally{Ot()}};window.resetDecisionSettingsUI=async function(){if(confirm("Reset all decision settings to defaults?")){Lt("Resetting settings...");try{await op({equityMin:25e4,bondMin:2e5,cashTarget:5e4,duration:35,baseSalary:3e4,protectionFactor:20,recoveryBuffer:15e3,consecutiveLimit:3}),await Sp(),ie("Settings reset to defaults","success")}catch(n){console.error("Error resetting settings:",n),ie("Error resetting: "+n.message,"error")}finally{Ot()}}};window.showDrawdownScheduleUI=async function(){const n=parseFloat(document.getElementById("ddInflation").value)/100||.025,e=parseInt(document.getElementById("ddDuration").value)||35;try{const t=await kn();t.duration=e;const r=nm(t,e,n);let s='<div class="card"><h2>Projected SIPP Drawdown Schedule</h2>';s+='<div style="overflow-x: auto;"><table>',s+="<thead><tr><th>Year</th><th>BRL</th><th>Other</th><th>State</th><th>SIPP Draw</th><th>Tax</th><th>Net</th></tr></thead>",s+="<tbody>";for(const i of r)s+=`<tr>
            <td>${i.year}</td>
            <td>${H(i.brl)}</td>
            <td>${H(i.other)}</td>
            <td>${H(i.statePension)}</td>
            <td style="color: var(--primary); font-weight: 600;">${H(i.sippDraw)}</td>
            <td style="color: var(--danger);">-${H(i.tax)}</td>
            <td style="color: var(--success);">${H(i.netIncome)}</td>
          </tr>`;s+="</tbody></table></div></div>",document.getElementById("drawdownResults").innerHTML=s}catch(t){console.error("Drawdown error:",t),document.getElementById("drawdownResults").innerHTML=`<div class="alert alert-danger">Error: ${t.message}</div>`}};window.showGlidepathUI=async function(){const n=parseFloat(document.getElementById("gpInflation").value)/100||.025,e=parseInt(document.getElementById("gpDuration").value)||35;try{const t=await kn();t.duration=e;const r=sm(t,n);let s='<div class="card"><h2>Fund Glidepath (Inflation-Adjusted Minimums)</h2>';s+='<div class="alert alert-info" style="margin-bottom: 20px;">',s+="<strong>Glidepath Logic:</strong> Equity & Bond minimums inflate with CPI but deplete linearly to £0. Cash inflates only (maintains real value).",s+="</div>",s+='<div style="overflow-x: auto;"><table>',s+="<thead><tr><th>Year</th><th>Cum Inflation</th><th>Equity Min</th><th>Bond Min</th><th>Cash Target</th><th>Total Min</th></tr></thead>",s+="<tbody>";for(const i of r)s+=`<tr>
            <td>${i.year}</td>
            <td>${(i.cumulativeInflation*100-100).toFixed(1)}%</td>
            <td style="color: var(--success);">${H(i.equityMin)}</td>
            <td style="color: var(--info);">${H(i.bondMin)}</td>
            <td style="color: var(--warning);">${H(i.cashTarget)}</td>
            <td style="font-weight: 600;">${H(i.totalMin)}</td>
          </tr>`;s+="</tbody></table></div></div>",document.getElementById("glidepathResults").innerHTML=s}catch(t){console.error("Glidepath error:",t),document.getElementById("glidepathResults").innerHTML=`<div class="alert alert-danger">Error: ${t.message}</div>`}};let pt=null,un=[],xt="all";async function Vt(){const n=document.getElementById("historyTabs"),e=document.getElementById("historyDetail"),t=document.getElementById("historyYearFilter"),r=document.getElementById("deleteAllHistoryBtn"),s=document.getElementById("deleteYearBtn");if(!n||!e)return;if(n.innerHTML='<span class="loading">Loading...</span>',un=await os({sortDesc:!1,limit:500}),r&&(r.style.display=un.length>0?"":"none"),s&&(s.style.display="none"),un.length===0){n.innerHTML="",t&&(t.innerHTML='<option value="all">No entries</option>'),e.innerHTML=`
          <div class="no-history-message">
            <h3>No History Entries</h3>
            <p>Save decisions from the Decision Tool to build your history.</p>
          </div>
        `;return}const i=[...new Set(un.map(d=>d.date.split("-")[0]))].sort().reverse();if(t){let d='<option value="all">All Years</option>';i.forEach(f=>{d+=`<option value="${f}">${f}</option>`}),t.innerHTML=d,t.value=xt}s&&(s.style.display=xt!=="all"&&un.length>0?"":"none");const a=xt==="all"?un:un.filter(d=>d.date.startsWith(xt));if(a.length===0){n.innerHTML="",e.innerHTML=`
          <div class="no-history-message">
            <h3>No entries for ${xt}</h3>
            <p>Select a different year or "All Years".</p>
          </div>
        `;return}let l="";a.forEach(d=>{const f=d.date===pt,m=["history-tab"];f&&m.push("active"),d.inProtection&&m.push("protection");const[v,E]=d.date.split("-").map(Number),T=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],x=xt==="all"?`${T[E-1]} ${v}`:T[E-1];l+=`<button class="${m.join(" ")}" onclick="selectHistoryEntry('${d.date}')">${x}</button>`}),n.innerHTML=l;const c=document.getElementById("historyMobileSelector");if(c){let d="";a.forEach(f=>{const m=Jr(f.date),v=f.inProtection?" (Protection)":"";d+=`<option value="${f.date}">${m}${v}</option>`}),c.innerHTML=d}(!pt||!a.find(d=>d.date===pt))&&(pt=a[a.length-1].date),c&&(c.value=pt),Ap(pt),setTimeout(()=>{const d=n.querySelector(".history-tab.active");d&&d.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})},100)}window.filterHistoryByYear=function(n){xt=n,pt=null,Vt()};function Jr(n){const[e,t]=n.split("-").map(Number);return`${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][t-1]} ${e}`}function Ap(n){const e=document.getElementById("historyDetail"),t=un.find(d=>d.date===n);if(!t){e.innerHTML='<div class="no-history-message"><h3>Entry not found</h3></div>';return}const r=d=>d!=null?"£"+Math.round(d).toLocaleString():"—",s=t.isTaxEfficientYear!==!1&&t.mode==="Tax-Efficient",i=t.inProtection?"warning":s?"efficient":"inefficient",a=t.inProtection?`Protection${t.protectionInducedTaxEfficiency?" (Tax-Efficient)":""}`:s?"Tax-Efficient":"Standard";let l=t.source||"Unknown";t.source==="Growth"&&(t.dEquity>0||t.dBond>0)?l=`Growth (Equity: ${r(t.dEquity||0)}, Bond: ${r(t.dBond||0)})`:t.source==="Cash"&&(l=`Cash (${r(t.dCash||t.sipp||0)})`);let c=`
        <!-- Header with date and mode -->
        <div class="history-detail-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <div>
              <h3 style="margin:0;">${Jr(t.date)}</h3>
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
      `;e.innerHTML=c,document.querySelectorAll(".history-tab").forEach(d=>{d.classList.toggle("active",d.textContent===Jr(n))})}window.selectHistoryEntry=function(n){pt=n,Ap(n);const e=document.getElementById("historyMobileSelector");e&&(e.value=n);const r=document.getElementById("historyTabs").querySelector(".history-tab.active");r&&r.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})};window.scrollHistoryTabs=function(n){const e=document.getElementById("historyTabs"),t=200;n==="left"?e.scrollLeft-=t:e.scrollLeft+=t};function wo(n){const[e,t]=n.split("-").map(Number);return t>=4?`${e%100}/${(e+1)%100}`:`${(e-1)%100}/${e%100}`}async function el(n){const e={};for(const r of n){const s=r.taxYear||wo(r.date);e[s]||(e[s]=0),e[s]+=r.isaSavingsUsedThisMonth||r.isa||0}for(const r of n)await ap(r.date);const t=await Cn();for(const[r,s]of Object.entries(e))if(t[r]){const i=t[r].isaSavingsUsed||0,a=Math.max(0,i-s);await ur(r,{...t[r],isaSavingsUsed:a})}}window.deleteHistoryEntry=async function(n){if(!ut()){ie("Please sign in to delete entries","error");return}const e=await os({sortDesc:!1,limit:1e3}),t=wo(n),s=e.filter(c=>(c.taxYear||wo(c.date))===t).sort((c,d)=>c.date.localeCompare(d.date)),i=s.findIndex(c=>c.date===n);if(i===-1){ie("Entry not found","error");return}const a=i===s.length-1,l=Jr(n);if(a){if(!confirm(`Delete entry for ${l}?`))return;Lt("Deleting entry...");try{await el([s[i]]),ie(`Deleted ${l}`,"success"),pt=null,await Vt()}catch(c){console.error("Delete error:",c),ie("Error deleting: "+c.message,"error")}finally{Ot()}}else{const c=s.slice(i),d=Jr(c[c.length-1].date);if(!confirm(`This will delete ${c.length} entries from ${l} to ${d} in tax year ${t}.

Continue?`))return;Lt(`Deleting ${c.length} entries...`);try{await el(c),ie(`Deleted ${c.length} entries`,"success"),pt=null,await Vt()}catch(f){console.error("Delete error:",f),ie("Error deleting: "+f.message,"error")}finally{Ot()}}};window.deleteHistoryForTaxYear=async function(n){if(!ut()){ie("Please sign in to delete entries","error");return}const t=(await os({sortDesc:!1,limit:1e3})).filter(r=>(r.taxYear||wo(r.date))===n);if(t.length===0){ie(`No history entries for tax year ${n}`,"info");return}if(confirm(`Delete all ${t.length} history entries for tax year ${n}?`)){Lt(`Deleting tax year ${n}...`);try{await el(t);const r=await Cn();r[n]&&await ur(n,{...r[n],isaSavingsUsed:0}),ie(`Deleted all entries for ${n}`,"success"),pt=null,await Vt()}catch(r){console.error("Delete error:",r),ie("Error deleting: "+r.message,"error")}finally{Ot()}}};window.deleteHistoryForSelectedYear=async function(){if(xt==="all"){ie("Select a specific year first","error");return}const n=`${parseInt(xt)%100}/${(parseInt(xt)+1)%100}`;await deleteHistoryForTaxYear(n)};window.deleteAllHistory=async function(){if(confirm("Delete ALL history entries? This cannot be undone.")&&confirm("Are you ABSOLUTELY sure? All decision history will be permanently deleted.")){if(!ut()){ie("Please sign in to delete entries","error");return}Lt("Deleting all history...");try{const n=await os({limit:1e3});for(const t of n)await ap(t.date);const e=await Cn();for(const[t,r]of Object.entries(e))r.isaSavingsUsed>0&&await ur(t,{...r,isaSavingsUsed:0});ie(`Deleted ${n.length} entries`,"success"),pt=null,await Vt()}catch(n){console.error("Delete all error:",n),ie("Error deleting: "+n.message,"error")}finally{Ot()}}};let Un=null;async function nr(){const n=document.getElementById("taxYearTabs"),e=document.getElementById("taxYearDetail");if(!n||!e)return;n.innerHTML='<span class="loading">Loading...</span>';const t=await Cn();await cr();const r=Object.keys(t).sort(),s=hT(),i=fT(r,s,40);let a="";i.forEach(d=>{const f=t[d],m=f&&f.yearSetupComplete,v=d===Un,E=["tax-year-tab"];v&&E.push("active"),m||E.push("not-setup"),a+=`<button class="${E.join(" ")}" onclick="selectTaxYear('${d}')">${d}</button>`}),n.innerHTML=a;const l=document.getElementById("taxYearMobileSelector");if(l){let d="";i.forEach(f=>{const m=t[f],E=m&&m.yearSetupComplete?f:`${f} (not set up)`;d+=`<option value="${f}">${E}</option>`}),l.innerHTML=d}if(!Un){const d=r.filter(f=>{var m;return(m=t[f])==null?void 0:m.yearSetupComplete});Un=d.length>0?d[d.length-1]:s}l&&(l.value=Un),await xp(Un,t);const c=n.querySelector(".tax-year-tab.active");c&&c.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})}function hT(){const n=new Date,e=n.getFullYear(),t=n.getMonth()+1;return t<4||t===4&&n.getDate()<6?`${String(e-1).slice(-2)}/${String(e).slice(-2)}`:`${String(e).slice(-2)}/${String(e+1).slice(-2)}`}function fT(n,e,t){const r=new Set(n),[s]=e.split("/").map(Number),i=s<50?2e3+s:1900+s;for(let a=0;a<t&&r.size<t;a++){const l=i+a,c=l+1;r.add(`${String(l).slice(-2)}/${String(c).slice(-2)}`)}return Array.from(r).sort()}async function xp(n,e,t){var m,v,E,T,x,R,A,D,N,C,O,V,b,g;const r=document.getElementById("taxYearDetail"),s=e[n];if(!s||!s.yearSetupComplete){r.innerHTML=`
          <div class="not-configured-message">
            <h3>Tax Year ${n} Not Configured</h3>
            <p>This tax year hasn't been set up yet. Use the Decision Tool to calculate a decision for a month in this tax year to trigger the setup wizard.</p>
            <button class="btn primary" onclick="triggerWizardForYear('${n}')">Set Up ${n}</button>
          </div>
        `;return}const i=await ic(n),a=Math.round(i.amount||0),l=i.startDate||"Not configured",c=i.isReceiving;i.yearsUntil;const d=y=>y!=null?"£"+Math.round(y).toLocaleString():"—";let f=`
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
              <span class="value">${pT(s.startMonth||4)}</span>
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
                  <td class="net-col">${d((O=y.statePension)==null?void 0:O.net)}</td>
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
      `,r.innerHTML=f,document.querySelectorAll(".tax-year-tab").forEach(y=>{y.classList.toggle("active",y.textContent===n)})}window.selectTaxYear=async function(n){Un=n;const e=await Cn();await cr(),await xp(n,e),document.querySelectorAll(".tax-year-tab").forEach(i=>{i.classList.toggle("active",i.textContent===n)});const t=document.getElementById("taxYearMobileSelector");t&&(t.value=n);const s=document.getElementById("taxYearTabs").querySelector(`.tax-year-tab[onclick="selectTaxYear('${n}')"]`);s&&s.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})};window.scrollTaxYearTabs=function(n){const e=document.getElementById("taxYearTabs"),t=200;n==="left"?e.scrollLeft-=t:e.scrollLeft+=t};function pT(n){return["January","February","March","April","May","June","July","August","September","October","November","December"][(n-1)%12]||"April"}window.triggerWizardForYear=async function(n){const[e]=n.split("/").map(Number),t=e<50?2e3+e:1900+e,r=`${t}-04`,s=document.getElementById("selectedMonth");s&&(s.value=r),document.querySelectorAll(".tab").forEach(i=>i.classList.remove("active")),document.querySelector('.tab[data-tab="decision"]').classList.add("active"),document.querySelectorAll(".tab-content").forEach(i=>i.classList.remove("active")),document.getElementById("decision-content").classList.add("active"),document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(i=>i.classList.remove("active")),document.querySelector('.sub-tab[data-decisiontab="entry"]').classList.add("active"),document.querySelectorAll(".decision-subtab").forEach(i=>i.classList.add("hidden")),document.getElementById("decision-entry").classList.remove("hidden"),alert(`Please click "Calculate" with April ${t} selected to set up tax year ${n}`)};window.reconfigureTaxYear=async function(n){if(confirm(`This will allow you to reconfigure tax year ${n}. The setup wizard will be triggered when you next calculate a decision for this year. Continue?`))try{const e=await Wo(n);e.yearSetupComplete=!1,await ur(n,e),await nr(),alert(`Tax year ${n} has been marked for reconfiguration. Calculate a decision for this year to run the wizard again.`)}catch(e){console.error("Error:",e),alert("Error: "+e.message)}};window.updateTaxYear=async function(n,e,t){try{const r=await Wo(n);r[e]=parseFloat(t),await ur(n,r)}catch(r){console.error("Error updating tax year:",r),alert("Error saving: "+r.message)}};window.deleteTaxYear=async function(n){if(confirm("Delete tax year "+n+"? This will remove all configuration for this year."))try{const e=await lr();delete e.taxYears[n],await Ho(e),Un=null,await nr()}catch(e){console.error("Error deleting tax year:",e),alert("Error deleting: "+e.message)}};window.addTaxYear=async function(){if(!ut()){alert("Please sign in to add tax years");return}const n=prompt("Enter tax year (e.g., 25/26):");if(!n||!/^\d{2}\/\d{2}$/.test(n)){alert("Invalid format. Use YY/YY (e.g., 25/26)");return}try{await ur(n,{}),await nr()}catch(e){console.error("Save error:",e),alert("Error saving: "+e.message)}};console.log("Pension Planner v"+Pd+" loaded");
