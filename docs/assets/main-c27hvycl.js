(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(s){if(s.ep)return;s.ep=!0;const i=t(s);fetch(s.href,i)}})();function rm(n){const e=(n.sippDraw||0)+(n.other||0)+(n.statePension||0),t=e*12,r=n.pa||12570,s=n.brl||50270,i=n.hrl||125140;let a=0;t>r&&(t<=s?a=(t-r)*.2:t<=i?a=(s-r)*.2+(t-s)*.4:a=(s-r)*.2+(i-s)*.4+(t-i)*.45);const l=a/12,c=e-l+(n.isaDraw||0);return{date:n.date,taxYear:n.taxYear,yearNum:n.yearNumber,equity:n.equity,bond:n.bond,cash:n.cash,total:n.equity+n.bond+n.cash,adjEquity:n.adjEquityMin,adjBond:n.adjBondMin,adjCash:n.adjCashTarget,source:n.source,dEquity:n.drawFromEquity||0,dBond:n.drawFromBond||0,dCash:n.drawFromCash||0,sipp:n.sippDraw,stdSipp:n.stdSipp||n.sippDraw,isa:n.isaDraw,other:n.other,state:n.statePension,pa:r,brl:s,monthlyTax:l,monthlyNet:c,mode:n.taxEfficient?"Tax-Efficient":"Standard",inProtection:n.inProtection,reason:n.protectionReason||"",consecutiveDraws:n.consecutiveCashDraws||0,boostAmount:n.boostAmount,boostEligible:n.boostEligible||!1,rebal:n.rebalanceActions?n.rebalanceActions.join("; "):"",yearlyIsaSavingsAllocation:n.yearlyIsaSavingsAllocation||0,isaSavingsUsedThisMonth:n.isaDraw||0,cumulativeIsaSavingsUsed:n.cumulativeIsaSavingsUsed||0,taxPaidMonthly:l,taxPaidYTD:n.taxPaidYTD||l,taxProjectedAnnual:n.taxProjectedAnnual||a,taxSavedMonthly:n.taxSavedMonthly||0,taxSavedYTD:n.taxSavedYTD||0,taxSavedProjectedAnnual:n.taxSavedProjectedAnnual||0,isTaxEfficientYear:n.isTaxEfficientYear??!0,protectionInducedTaxEfficiency:n.protectionInducedTaxEfficiency||!1,remainingMonths:n.remainingMonths||12}}const Ci={INFO:"info",WARNING:"warning",DANGER:"danger",SUCCESS:"success"},Ad="6.0.0",ze={PERSONAL_ALLOWANCE:12570,BASIC_RATE_LIMIT:50270,HIGHER_RATE_LIMIT:125140,BASIC_RATE:.2,HIGHER_RATE:.4,ADDITIONAL_RATE:.45,PA_TAPER_THRESHOLD:1e5,PA_TAPER_RATE:.5},sl={ASSUMED_CPI:.025,OTHER_INCOME_CAP:.04},Dt={RETURN:.03,MIN:0,DRAWDOWN_STRATEGY:"minimiseEarlyTax"},de={BASE_SALARY:3e4,EQUITY_MIN:25e4,BOND_MIN:2e5,CASH_TARGET:5e4,DURATION_YEARS:35,PROTECTION_FACTOR:20,RECOVERY_BUFFER:15e3,CONSECUTIVE_LIMIT:3},dr={PROTECTION_MULTIPLIER:.8,HODL_ENABLED:!1,HODL_VALUE:25e3},$s={1928:.4781,1929:-.172,1930:-.338,1931:-.527,1932:-.231,1933:.669,1934:.041,1935:.3879,1936:.2492,1937:-.3839,1938:.2846,1939:-.0278,1940:-.1278,1941:-.1552,1942:.0782,1943:.1382,1944:.1226,1945:.2665,1946:-.0818,1947:.0225,1948:-.0246,1949:.1279,1950:.1787,1951:.1463,1952:.0837,1953:-.0377,1954:.4399,1955:.2084,1956:.0262,1957:-.1278,1958:.3396,1959:.1612,1960:-.0912,1961:.1889,1962:-.1081,1963:.1715,1964:.1478,1965:.1058,1966:-.1858,1967:.1506,1968:.0457,1969:-.1524,1970:.0482,1971:.0627,1972:.1476,1973:-.1652,1974:-.2777,1975:.3815,1976:.1774,1977:-.1271,1978:-.0303,1979:.0414,1980:.1493,1981:-.0909,1982:.1976,1983:.2027,1984:-.0365,1985:.2778,1986:.2278,1987:.0227,1988:.1185,1989:.2697,1990:-.0456,1991:.2013,1992:.044,1993:.1372,1994:.0218,1995:.3345,1996:.2601,1997:.2264,1998:.1627,1999:.2516,2e3:-.0617,2001:-.0727,2002:-.1679,2003:.2525,2004:.0333,2005:-.0061,2006:.1618,2007:.0648,2008:-.3355,2009:.1882,2010:.1102,2011:.0556,2012:.0728,2013:.2665,2014:.0775,2015:-.023,2016:.1342,2017:.2511,2018:-.0583,2019:.2234,2020:.0726,2021:.1873,2022:-.0878,2023:.1399,2024:.1299},il={1928:-.012,1929:.002,1930:-.06,1931:-.094,1932:-.103,1933:.005,1934:.021,1935:.03,1936:.014,1937:.028,1938:-.02,1939:-.014,1940:.01,1941:.099,1942:.09,1943:.03,1944:.023,1945:.023,1946:.186,1947:.087,1948:.03,1949:-.02,1950:.059,1951:.06,1952:.009,1953:.006,1954:-.007,1955:.004,1956:.03,1957:.028,1958:.017,1959:.015,1960:.014,1961:.007,1962:.013,1963:.017,1964:.01,1965:.019,1966:.034,1967:.028,1968:.046,1969:.062,1970:.055,1971:.033,1972:.034,1973:.087,1974:.124,1975:.069,1976:.048,1977:.067,1978:.09,1979:.133,1980:.125,1981:.089,1982:.038,1983:.038,1984:.04,1985:.038,1986:.011,1987:.044,1988:.044,1989:.046,1990:.061,1991:.03,1992:.029,1993:.027,1994:.026,1995:.025,1996:.034,1997:.017,1998:.016,1999:.027,2e3:.034,2001:.016,2002:.024,2003:.019,2004:.033,2005:.034,2006:.025,2007:.041,2008:.001,2009:.027,2010:.015,2011:.03,2012:.017,2013:.015,2014:.008,2015:.007,2016:.021,2017:.021,2018:.019,2019:.023,2020:.012,2021:.07,2022:.065,2023:.032,2024:.029},sm={GREAT_DEPRESSION:{name:"Great Depression",equity:[-.17,-.34,-.53,-.23,.67,.04,.39,.25,-.38,.28],inflation:[0,-.06,-.09,-.1,.01,.02,.03,.01,.03,-.02],color:"#e74c3c"},STAGFLATION_70S:{name:"Stagflation 70s",equity:[-.17,-.28,.38,.18,-.13,-.03,.04,.15,-.09,.2],inflation:[.09,.12,.07,.05,.07,.09,.13,.13,.09,.04],color:"#e67e22"},LOST_DECADE_2000S:{name:"Lost Decade 2000s",equity:[-.06,-.07,-.17,.25,.03,-.01,.16,.06,-.34,.19],inflation:[.03,.02,.02,.02,.03,.03,.03,.04,0,.03],color:"#9b59b6"},CRISIS_2008:{name:"2008 Crisis",equity:[-.34,.19,.11,.06,.07,.27,.08,-.02,.13,.25],inflation:[0,.03,.02,.03,.02,.02,.01,.01,.02,.02],color:"#3498db"},SYNTHETIC_WORST:{name:"Synthetic Worst",equity:[-.4,.1,.1,.1,-.35,.1,.1,.1,.1,-.3],inflation:[.08,.05,.05,.05,.08,.05,.05,.05,.05,.08],color:"#1abc9c"}},zt={START_MONTH:4,START_DAY:6};function Wi(n,e,t,r=ze.HIGHER_RATE_LIMIT){if(n<=0)return 0;let s=e;if(n>ze.PA_TAPER_THRESHOLD){const f=(n-ze.PA_TAPER_THRESHOLD)*ze.PA_TAPER_RATE;s=Math.max(0,e-f)}const i=Math.max(0,n-s),a=Math.max(0,t-s),l=r-t;let c=0;const d=Math.min(i,a);if(c+=d*ze.BASIC_RATE,i>a){const f=Math.min(i-a,l);c+=f*ze.HIGHER_RATE}if(i>a+l){const f=i-a-l;c+=f*ze.ADDITIONAL_RATE}return c}function On(n,e,t,r=ze.HIGHER_RATE_LIMIT){return n-Wi(n,e,t,r)}function im(n,e,t,r=ze.HIGHER_RATE_LIMIT){if(n<=0)return 0;let s=n,i=n+1;for(;On(i,e,t,r)<n&&i<1e12;)i*=2;for(let a=0;a<60;a++){const l=(s+i)/2;On(l,e,t,r)<n?s=l:i=l}return(s+i)/2}function vo(n){const e=typeof n=="string"?new Date(n):n,t=e.getFullYear(),r=e.getMonth()+1,s=e.getDate();if(r<zt.START_MONTH||r===zt.START_MONTH&&s<zt.START_DAY){const i=t-1;return`${String(i).slice(-2)}/${String(t).slice(-2)}`}return`${String(t).slice(-2)}/${String(t+1).slice(-2)}`}function fa(n){const e=parseInt(n.split("/")[0]),t=e<50?2e3+e:1900+e;return new Date(t,zt.START_MONTH-1,zt.START_DAY)}function om(n){const e=parseInt(n.split("/")[1]),t=e<50?2e3+e:1900+e;return new Date(t,zt.START_MONTH-1,zt.START_DAY-1)}function am(){const n=new Date;return`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`}function ol(n){const[e,t]=n.split("-").map(Number);return new Date(e,t-1,15)}function lm(n){const t=(typeof n=="string"?new Date(n):n).getMonth()+1;return t>=zt.START_MONTH?12-(t-zt.START_MONTH):zt.START_MONTH-t}const cm=sl.ASSUMED_CPI,um=sl.OTHER_INCOME_CAP;function xd(n,e,t=um){let r=n;for(const s of e)r*=1+Math.min(s,t);return r}function dm(n){const{baseSalary:e,cumulativeInflation:t,yearlyInflation:r=[],other:s=0,statePension:i=0,statePensionYear:a=12,yearNumber:l=0,pa:c,brl:d,hrl:f,taxMode:m="inflates"}=n,g=m==="frozen"?c:c*t,b=m==="frozen"?d:d*t,S=m==="frozen"?f:f*t,I=e*t,R=xd(s,r),C=l>=a?i*t:0,M=R+C,V=Math.max(0,b-M),$=Math.max(0,I-M),H=Math.min(V,$);return{pa:g,brl:b,hrl:S,targetGross:I,other:R,statePension:C,fixedIncome:M,annualSippDraw:H,monthlySippDraw:H/12,sippPlusfixedAtBRL:V+M===b}}function hm(n,e,t=.025){const r=[],s=[];for(let i=0;i<=e;i++){i>0&&s.push(t);const a=Math.pow(1+t,i),l=dm({baseSalary:n.baseSalary,cumulativeInflation:a,yearlyInflation:[...s],other:n.other,statePension:n.statePension,statePensionYear:n.statePensionYear,yearNumber:i,pa:n.pa,brl:n.brl,hrl:n.hrl,taxMode:n.taxMode}),c=l.annualSippDraw+l.other+l.statePension,d=Wi(c,l.pa,l.brl,l.hrl);r.push({year:i,brl:l.brl,other:l.other,statePension:l.statePension,sippDraw:l.annualSippDraw,totalTaxable:c,tax:d,netIncome:c-d})}return r}function un(n,e,t,r,s){if(s){const i=Math.max(0,1-e/t);return n*r*i}return n*r}function fm(n,e,t){const r=un(n.equityMin,e,n.duration,t,!0),s=un(n.bondMin,e,n.duration,t,!0),i=un(n.cashTarget,e,n.duration,t,!1);return{equity:r,bond:s,cash:i,totalGrowth:r+s,total:r+s+i}}function pm(n,e=sl.ASSUMED_CPI){const t=[];for(let r=0;r<=n.duration;r++){const s=Math.pow(1+e,r),i=fm(n,r,s);t.push({year:r,cumulativeInflation:s,equityMin:i.equity,bondMin:i.bond,cashTarget:i.cash,totalMin:i.total})}return t}const mm="modulepreload",gm=function(n,e){return new URL(n,e).href},tu={},nu=function(e,t,r){let s=Promise.resolve();if(t&&t.length>0){const a=document.getElementsByTagName("link"),l=document.querySelector("meta[property=csp-nonce]"),c=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));s=Promise.allSettled(t.map(d=>{if(d=gm(d,r),d in tu)return;tu[d]=!0;const f=d.endsWith(".css"),m=f?'[rel="stylesheet"]':"";if(!!r)for(let S=a.length-1;S>=0;S--){const I=a[S];if(I.href===d&&(!f||I.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${d}"]${m}`))return;const b=document.createElement("link");if(b.rel=f?"stylesheet":mm,f||(b.as="script"),b.crossOrigin="",b.href=d,c&&b.setAttribute("nonce",c),document.head.appendChild(b),f)return new Promise((S,I)=>{b.addEventListener("load",S),b.addEventListener("error",()=>I(new Error(`Unable to preload CSS for ${d}`)))})}))}function i(a){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=a,window.dispatchEvent(l),!l.defaultPrevented)throw a}return s.then(a=>{for(const l of a||[])l.status==="rejected"&&i(l.reason);return e().catch(i)})};function al(n){let e=n;return function(){return e=Math.sin(e)*1e4,e-Math.floor(e)}}function Ts(n,e,t){const r=Math.max(t(),1e-12),s=t();let i=Math.sqrt(-2*Math.log(r))*Math.cos(2*Math.PI*s);return i=Math.max(-4,Math.min(4,i)),n+e*i}function ll(n){const e=JSON.stringify(n);let t=0;for(let r=0;r<e.length;r++){const s=e.charCodeAt(r);t=(t<<5)-t+s,t=t&t}return t.toString(16)}var ru={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rd=function(n){const e=[];let t=0;for(let r=0;r<n.length;r++){let s=n.charCodeAt(r);s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(s=65536+((s&1023)<<10)+(n.charCodeAt(++r)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},ym=function(n){const e=[];let t=0,r=0;for(;t<n.length;){const s=n[t++];if(s<128)e[r++]=String.fromCharCode(s);else if(s>191&&s<224){const i=n[t++];e[r++]=String.fromCharCode((s&31)<<6|i&63)}else if(s>239&&s<365){const i=n[t++],a=n[t++],l=n[t++],c=((s&7)<<18|(i&63)<<12|(a&63)<<6|l&63)-65536;e[r++]=String.fromCharCode(55296+(c>>10)),e[r++]=String.fromCharCode(56320+(c&1023))}else{const i=n[t++],a=n[t++];e[r++]=String.fromCharCode((s&15)<<12|(i&63)<<6|a&63)}}return e.join("")},Pd={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<n.length;s+=3){const i=n[s],a=s+1<n.length,l=a?n[s+1]:0,c=s+2<n.length,d=c?n[s+2]:0,f=i>>2,m=(i&3)<<4|l>>4;let g=(l&15)<<2|d>>6,b=d&63;c||(b=64,a||(g=64)),r.push(t[f],t[m],t[g],t[b])}return r.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(Rd(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):ym(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let s=0;s<n.length;){const i=t[n.charAt(s++)],l=s<n.length?t[n.charAt(s)]:0;++s;const d=s<n.length?t[n.charAt(s)]:64;++s;const m=s<n.length?t[n.charAt(s)]:64;if(++s,i==null||l==null||d==null||m==null)throw new vm;const g=i<<2|l>>4;if(r.push(g),d!==64){const b=l<<4&240|d>>2;if(r.push(b),m!==64){const S=d<<6&192|m;r.push(S)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class vm extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const wm=function(n){const e=Rd(n);return Pd.encodeByteArray(e,!0)},Gi=function(n){return wm(n).replace(/\./g,"")},Cd=function(n){try{return Pd.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function _m(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const bm=()=>_m().__FIREBASE_DEFAULTS__,Em=()=>{if(typeof process>"u"||typeof ru>"u")return;const n=ru.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},Tm=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&Cd(n[1]);return e&&JSON.parse(e)},wo=()=>{try{return bm()||Em()||Tm()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},kd=n=>{var e,t;return(t=(e=wo())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[n]},Im=n=>{const e=kd(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),r]:[e.substring(0,t),r]},Md=()=>{var n;return(n=wo())===null||n===void 0?void 0:n.config},Dd=n=>{var e;return(e=wo())===null||e===void 0?void 0:e[`_${n}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sm{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,r))}}}/**
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
 */function Am(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},r=e||"demo-project",s=n.iat||0,i=n.sub||n.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const a=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:s,exp:s+3600,auth_time:s,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}}},n);return[Gi(JSON.stringify(t)),Gi(JSON.stringify(a)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function et(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function xm(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(et())}function Rm(){var n;const e=(n=wo())===null||n===void 0?void 0:n.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Pm(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Cm(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function km(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Mm(){const n=et();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function Dm(){return!Rm()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Nm(){try{return typeof indexedDB=="object"}catch{return!1}}function Lm(){return new Promise((n,e)=>{try{let t=!0;const r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),t||self.indexedDB.deleteDatabase(r),n(!0)},s.onupgradeneeded=()=>{t=!1},s.onerror=()=>{var i;e(((i=s.error)===null||i===void 0?void 0:i.message)||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Om="FirebaseError";class vn extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name=Om,Object.setPrototypeOf(this,vn.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,ei.prototype.create)}}class ei{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){const r=t[0]||{},s=`${this.service}/${e}`,i=this.errors[e],a=i?Bm(i,r):"Error",l=`${this.serviceName}: ${a} (${s}).`;return new vn(s,l,r)}}function Bm(n,e){return n.replace(Vm,(t,r)=>{const s=e[r];return s!=null?String(s):`<${r}?>`})}const Vm=/\{\$([^}]+)}/g;function Fm(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function Ki(n,e){if(n===e)return!0;const t=Object.keys(n),r=Object.keys(e);for(const s of t){if(!r.includes(s))return!1;const i=n[s],a=e[s];if(su(i)&&su(a)){if(!Ki(i,a))return!1}else if(i!==a)return!1}for(const s of r)if(!t.includes(s))return!1;return!0}function su(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ti(n){const e=[];for(const[t,r]of Object.entries(n))Array.isArray(r)?r.forEach(s=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function As(n){const e={};return n.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[s,i]=r.split("=");e[decodeURIComponent(s)]=decodeURIComponent(i)}}),e}function xs(n){const e=n.indexOf("?");if(!e)return"";const t=n.indexOf("#",e);return n.substring(e,t>0?t:void 0)}function $m(n,e){const t=new zm(n,e);return t.subscribe.bind(t)}class zm{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,r){let s;if(e===void 0&&t===void 0&&r===void 0)throw new Error("Missing Observer.");Um(e,["next","error","complete"])?s=e:s={next:e,error:t,complete:r},s.next===void 0&&(s.next=pa),s.error===void 0&&(s.error=pa),s.complete===void 0&&(s.complete=pa);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Um(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function pa(){}/**
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
 */function Ne(n){return n&&n._delegate?n._delegate:n}class pr{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const or="[DEFAULT]";/**
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
 */class qm{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const r=new Sm;if(this.instancesDeferred.set(t,r),this.isInitialized(t)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:t});s&&r.resolve(s)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const r=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),s=(t=e==null?void 0:e.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(i){if(s)return null;throw i}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(jm(e))try{this.getOrInitializeService({instanceIdentifier:or})}catch{}for(const[t,r]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(t);try{const i=this.getOrInitializeService({instanceIdentifier:s});r.resolve(i)}catch{}}}}clearInstance(e=or){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=or){return this.instances.has(e)}getOptions(e=or){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:r,options:t});for(const[i,a]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(i);r===l&&a.resolve(s)}return s}onInit(e,t){var r;const s=this.normalizeInstanceIdentifier(t),i=(r=this.onInitCallbacks.get(s))!==null&&r!==void 0?r:new Set;i.add(e),this.onInitCallbacks.set(s,i);const a=this.instances.get(s);return a&&e(a,s),()=>{i.delete(e)}}invokeOnInitCallbacks(e,t){const r=this.onInitCallbacks.get(t);if(r)for(const s of r)try{s(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Hm(e),options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=or){return this.component?this.component.multipleInstances?e:or:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Hm(n){return n===or?void 0:n}function jm(n){return n.instantiationMode==="EAGER"}/**
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
 */class Ym{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new qm(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var se;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(se||(se={}));const Wm={debug:se.DEBUG,verbose:se.VERBOSE,info:se.INFO,warn:se.WARN,error:se.ERROR,silent:se.SILENT},Gm=se.INFO,Km={[se.DEBUG]:"log",[se.VERBOSE]:"log",[se.INFO]:"info",[se.WARN]:"warn",[se.ERROR]:"error"},Qm=(n,e,...t)=>{if(e<n.logLevel)return;const r=new Date().toISOString(),s=Km[e];if(s)console[s](`[${r}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class cl{constructor(e){this.name=e,this._logLevel=Gm,this._logHandler=Qm,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in se))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Wm[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,se.DEBUG,...e),this._logHandler(this,se.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,se.VERBOSE,...e),this._logHandler(this,se.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,se.INFO,...e),this._logHandler(this,se.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,se.WARN,...e),this._logHandler(this,se.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,se.ERROR,...e),this._logHandler(this,se.ERROR,...e)}}const Jm=(n,e)=>e.some(t=>n instanceof t);let iu,ou;function Xm(){return iu||(iu=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Zm(){return ou||(ou=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Nd=new WeakMap,ka=new WeakMap,Ld=new WeakMap,ma=new WeakMap,ul=new WeakMap;function eg(n){const e=new Promise((t,r)=>{const s=()=>{n.removeEventListener("success",i),n.removeEventListener("error",a)},i=()=>{t(Bn(n.result)),s()},a=()=>{r(n.error),s()};n.addEventListener("success",i),n.addEventListener("error",a)});return e.then(t=>{t instanceof IDBCursor&&Nd.set(t,n)}).catch(()=>{}),ul.set(e,n),e}function tg(n){if(ka.has(n))return;const e=new Promise((t,r)=>{const s=()=>{n.removeEventListener("complete",i),n.removeEventListener("error",a),n.removeEventListener("abort",a)},i=()=>{t(),s()},a=()=>{r(n.error||new DOMException("AbortError","AbortError")),s()};n.addEventListener("complete",i),n.addEventListener("error",a),n.addEventListener("abort",a)});ka.set(n,e)}let Ma={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return ka.get(n);if(e==="objectStoreNames")return n.objectStoreNames||Ld.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return Bn(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function ng(n){Ma=n(Ma)}function rg(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const r=n.call(ga(this),e,...t);return Ld.set(r,e.sort?e.sort():[e]),Bn(r)}:Zm().includes(n)?function(...e){return n.apply(ga(this),e),Bn(Nd.get(this))}:function(...e){return Bn(n.apply(ga(this),e))}}function sg(n){return typeof n=="function"?rg(n):(n instanceof IDBTransaction&&tg(n),Jm(n,Xm())?new Proxy(n,Ma):n)}function Bn(n){if(n instanceof IDBRequest)return eg(n);if(ma.has(n))return ma.get(n);const e=sg(n);return e!==n&&(ma.set(n,e),ul.set(e,n)),e}const ga=n=>ul.get(n);function ig(n,e,{blocked:t,upgrade:r,blocking:s,terminated:i}={}){const a=indexedDB.open(n,e),l=Bn(a);return r&&a.addEventListener("upgradeneeded",c=>{r(Bn(a.result),c.oldVersion,c.newVersion,Bn(a.transaction),c)}),t&&a.addEventListener("blocked",c=>t(c.oldVersion,c.newVersion,c)),l.then(c=>{i&&c.addEventListener("close",()=>i()),s&&c.addEventListener("versionchange",d=>s(d.oldVersion,d.newVersion,d))}).catch(()=>{}),l}const og=["get","getKey","getAll","getAllKeys","count"],ag=["put","add","delete","clear"],ya=new Map;function au(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(ya.get(e))return ya.get(e);const t=e.replace(/FromIndex$/,""),r=e!==t,s=ag.includes(t);if(!(t in(r?IDBIndex:IDBObjectStore).prototype)||!(s||og.includes(t)))return;const i=async function(a,...l){const c=this.transaction(a,s?"readwrite":"readonly");let d=c.store;return r&&(d=d.index(l.shift())),(await Promise.all([d[t](...l),s&&c.done]))[0]};return ya.set(e,i),i}ng(n=>({...n,get:(e,t,r)=>au(e,t)||n.get(e,t,r),has:(e,t)=>!!au(e,t)||n.has(e,t)}));/**
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
 */class lg{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(cg(t)){const r=t.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(t=>t).join(" ")}}function cg(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Da="@firebase/app",lu="0.10.13";/**
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
 */const fn=new cl("@firebase/app"),ug="@firebase/app-compat",dg="@firebase/analytics-compat",hg="@firebase/analytics",fg="@firebase/app-check-compat",pg="@firebase/app-check",mg="@firebase/auth",gg="@firebase/auth-compat",yg="@firebase/database",vg="@firebase/data-connect",wg="@firebase/database-compat",_g="@firebase/functions",bg="@firebase/functions-compat",Eg="@firebase/installations",Tg="@firebase/installations-compat",Ig="@firebase/messaging",Sg="@firebase/messaging-compat",Ag="@firebase/performance",xg="@firebase/performance-compat",Rg="@firebase/remote-config",Pg="@firebase/remote-config-compat",Cg="@firebase/storage",kg="@firebase/storage-compat",Mg="@firebase/firestore",Dg="@firebase/vertexai-preview",Ng="@firebase/firestore-compat",Lg="firebase",Og="10.14.1";/**
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
 */const Na="[DEFAULT]",Bg={[Da]:"fire-core",[ug]:"fire-core-compat",[hg]:"fire-analytics",[dg]:"fire-analytics-compat",[pg]:"fire-app-check",[fg]:"fire-app-check-compat",[mg]:"fire-auth",[gg]:"fire-auth-compat",[yg]:"fire-rtdb",[vg]:"fire-data-connect",[wg]:"fire-rtdb-compat",[_g]:"fire-fn",[bg]:"fire-fn-compat",[Eg]:"fire-iid",[Tg]:"fire-iid-compat",[Ig]:"fire-fcm",[Sg]:"fire-fcm-compat",[Ag]:"fire-perf",[xg]:"fire-perf-compat",[Rg]:"fire-rc",[Pg]:"fire-rc-compat",[Cg]:"fire-gcs",[kg]:"fire-gcs-compat",[Mg]:"fire-fst",[Ng]:"fire-fst-compat",[Dg]:"fire-vertex","fire-js":"fire-js",[Lg]:"fire-js-all"};/**
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
 */const Qi=new Map,Vg=new Map,La=new Map;function cu(n,e){try{n.container.addComponent(e)}catch(t){fn.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function Wr(n){const e=n.name;if(La.has(e))return fn.debug(`There were multiple attempts to register component ${e}.`),!1;La.set(e,n);for(const t of Qi.values())cu(t,n);for(const t of Vg.values())cu(t,n);return!0}function dl(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function Mt(n){return n.settings!==void 0}/**
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
 */const Fg={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Vn=new ei("app","Firebase",Fg);/**
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
 */class $g{constructor(e,t,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new pr("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Vn.create("app-deleted",{appName:this._name})}}/**
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
 */const ss=Og;function Od(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const r=Object.assign({name:Na,automaticDataCollectionEnabled:!1},e),s=r.name;if(typeof s!="string"||!s)throw Vn.create("bad-app-name",{appName:String(s)});if(t||(t=Md()),!t)throw Vn.create("no-options");const i=Qi.get(s);if(i){if(Ki(t,i.options)&&Ki(r,i.config))return i;throw Vn.create("duplicate-app",{appName:s})}const a=new Ym(s);for(const c of La.values())a.addComponent(c);const l=new $g(t,r,a);return Qi.set(s,l),l}function Bd(n=Na){const e=Qi.get(n);if(!e&&n===Na&&Md())return Od();if(!e)throw Vn.create("no-app",{appName:n});return e}function Fn(n,e,t){var r;let s=(r=Bg[n])!==null&&r!==void 0?r:n;t&&(s+=`-${t}`);const i=s.match(/\s|\//),a=e.match(/\s|\//);if(i||a){const l=[`Unable to register library "${s}" with version "${e}":`];i&&l.push(`library name "${s}" contains illegal characters (whitespace or "/")`),i&&a&&l.push("and"),a&&l.push(`version name "${e}" contains illegal characters (whitespace or "/")`),fn.warn(l.join(" "));return}Wr(new pr(`${s}-version`,()=>({library:s,version:e}),"VERSION"))}/**
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
 */const zg="firebase-heartbeat-database",Ug=1,zs="firebase-heartbeat-store";let va=null;function Vd(){return va||(va=ig(zg,Ug,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(zs)}catch(t){console.warn(t)}}}}).catch(n=>{throw Vn.create("idb-open",{originalErrorMessage:n.message})})),va}async function qg(n){try{const t=(await Vd()).transaction(zs),r=await t.objectStore(zs).get(Fd(n));return await t.done,r}catch(e){if(e instanceof vn)fn.warn(e.message);else{const t=Vn.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});fn.warn(t.message)}}}async function uu(n,e){try{const r=(await Vd()).transaction(zs,"readwrite");await r.objectStore(zs).put(e,Fd(n)),await r.done}catch(t){if(t instanceof vn)fn.warn(t.message);else{const r=Vn.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});fn.warn(r.message)}}}function Fd(n){return`${n.name}!${n.options.appId}`}/**
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
 */const Hg=1024,jg=30*24*60*60*1e3;class Yg{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new Gg(t),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,t;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=du();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(a=>a.date===i)?void 0:(this._heartbeatsCache.heartbeats.push({date:i,agent:s}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(a=>{const l=new Date(a.date).valueOf();return Date.now()-l<=jg}),this._storage.overwrite(this._heartbeatsCache))}catch(r){fn.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=du(),{heartbeatsToSend:r,unsentEntries:s}=Wg(this._heartbeatsCache.heartbeats),i=Gi(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=t,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(t){return fn.warn(t),""}}}function du(){return new Date().toISOString().substring(0,10)}function Wg(n,e=Hg){const t=[];let r=n.slice();for(const s of n){const i=t.find(a=>a.agent===s.agent);if(i){if(i.dates.push(s.date),hu(t)>e){i.dates.pop();break}}else if(t.push({agent:s.agent,dates:[s.date]}),hu(t)>e){t.pop();break}r=r.slice(1)}return{heartbeatsToSend:t,unsentEntries:r}}class Gg{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Nm()?Lm().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await qg(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const s=await this.read();return uu(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:s.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const s=await this.read();return uu(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...e.heartbeats]})}else return}}function hu(n){return Gi(JSON.stringify({version:2,heartbeats:n})).length}/**
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
 */function Kg(n){Wr(new pr("platform-logger",e=>new lg(e),"PRIVATE")),Wr(new pr("heartbeat",e=>new Yg(e),"PRIVATE")),Fn(Da,lu,n),Fn(Da,lu,"esm2017"),Fn("fire-js","")}Kg("");var Qg="firebase",Jg="10.14.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Fn(Qg,Jg,"app");function hl(n,e){var t={};for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&e.indexOf(r)<0&&(t[r]=n[r]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var s=0,r=Object.getOwnPropertySymbols(n);s<r.length;s++)e.indexOf(r[s])<0&&Object.prototype.propertyIsEnumerable.call(n,r[s])&&(t[r[s]]=n[r[s]]);return t}function $d(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Xg=$d,zd=new ei("auth","Firebase",$d());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ji=new cl("@firebase/auth");function Zg(n,...e){Ji.logLevel<=se.WARN&&Ji.warn(`Auth (${ss}): ${n}`,...e)}function Oi(n,...e){Ji.logLevel<=se.ERROR&&Ji.error(`Auth (${ss}): ${n}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Tt(n,...e){throw pl(n,...e)}function Nt(n,...e){return pl(n,...e)}function fl(n,e,t){const r=Object.assign(Object.assign({},Xg()),{[e]:t});return new ei("auth","Firebase",r).create(e,{appName:n.name})}function dn(n){return fl(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function ey(n,e,t){const r=t;if(!(e instanceof r))throw r.name!==e.constructor.name&&Tt(n,"argument-error"),fl(n,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function pl(n,...e){if(typeof n!="string"){const t=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=n.name),n._errorFactory.create(t,...r)}return zd.create(n,...e)}function Y(n,e,...t){if(!n)throw pl(e,...t)}function on(n){const e="INTERNAL ASSERTION FAILED: "+n;throw Oi(e),new Error(e)}function pn(n,e){n||on(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Oa(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.href)||""}function ty(){return fu()==="http:"||fu()==="https:"}function fu(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ny(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(ty()||Cm()||"connection"in navigator)?navigator.onLine:!0}function ry(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ni{constructor(e,t){this.shortDelay=e,this.longDelay=t,pn(t>e,"Short delay should be less than long delay!"),this.isMobile=xm()||km()}get(){return ny()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ml(n,e){pn(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ud{static initialize(e,t,r){this.fetchImpl=e,t&&(this.headersImpl=t),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;on("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;on("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;on("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sy={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const iy=new ni(3e4,6e4);function wn(n,e){return n.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:n.tenantId}):e}async function Gt(n,e,t,r,s={}){return qd(n,s,async()=>{let i={},a={};r&&(e==="GET"?a=r:i={body:JSON.stringify(r)});const l=ti(Object.assign({key:n.config.apiKey},a)).slice(1),c=await n._getAdditionalHeaders();c["Content-Type"]="application/json",n.languageCode&&(c["X-Firebase-Locale"]=n.languageCode);const d=Object.assign({method:e,headers:c},i);return Pm()||(d.referrerPolicy="no-referrer"),Ud.fetch()(Hd(n,n.config.apiHost,t,l),d)})}async function qd(n,e,t){n._canInitEmulator=!1;const r=Object.assign(Object.assign({},sy),e);try{const s=new ay(n),i=await Promise.race([t(),s.promise]);s.clearNetworkTimeout();const a=await i.json();if("needConfirmation"in a)throw ki(n,"account-exists-with-different-credential",a);if(i.ok&&!("errorMessage"in a))return a;{const l=i.ok?a.errorMessage:a.error.message,[c,d]=l.split(" : ");if(c==="FEDERATED_USER_ID_ALREADY_LINKED")throw ki(n,"credential-already-in-use",a);if(c==="EMAIL_EXISTS")throw ki(n,"email-already-in-use",a);if(c==="USER_DISABLED")throw ki(n,"user-disabled",a);const f=r[c]||c.toLowerCase().replace(/[_\s]+/g,"-");if(d)throw fl(n,f,d);Tt(n,f)}}catch(s){if(s instanceof vn)throw s;Tt(n,"network-request-failed",{message:String(s)})}}async function ri(n,e,t,r,s={}){const i=await Gt(n,e,t,r,s);return"mfaPendingCredential"in i&&Tt(n,"multi-factor-auth-required",{_serverResponse:i}),i}function Hd(n,e,t,r){const s=`${e}${t}?${r}`;return n.config.emulator?ml(n.config,s):`${n.config.apiScheme}://${s}`}function oy(n){switch(n){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class ay{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,r)=>{this.timer=setTimeout(()=>r(Nt(this.auth,"network-request-failed")),iy.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function ki(n,e,t){const r={appName:n.name};t.email&&(r.email=t.email),t.phoneNumber&&(r.phoneNumber=t.phoneNumber);const s=Nt(n,e,r);return s.customData._tokenResponse=t,s}function pu(n){return n!==void 0&&n.enterprise!==void 0}class ly{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return oy(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}}async function cy(n,e){return Gt(n,"GET","/v2/recaptchaConfig",wn(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function uy(n,e){return Gt(n,"POST","/v1/accounts:delete",e)}async function jd(n,e){return Gt(n,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ds(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function dy(n,e=!1){const t=Ne(n),r=await t.getIdToken(e),s=gl(r);Y(s&&s.exp&&s.auth_time&&s.iat,t.auth,"internal-error");const i=typeof s.firebase=="object"?s.firebase:void 0,a=i==null?void 0:i.sign_in_provider;return{claims:s,token:r,authTime:Ds(wa(s.auth_time)),issuedAtTime:Ds(wa(s.iat)),expirationTime:Ds(wa(s.exp)),signInProvider:a||null,signInSecondFactor:(i==null?void 0:i.sign_in_second_factor)||null}}function wa(n){return Number(n)*1e3}function gl(n){const[e,t,r]=n.split(".");if(e===void 0||t===void 0||r===void 0)return Oi("JWT malformed, contained fewer than 3 sections"),null;try{const s=Cd(t);return s?JSON.parse(s):(Oi("Failed to decode base64 JWT payload"),null)}catch(s){return Oi("Caught error parsing JWT payload as JSON",s==null?void 0:s.toString()),null}}function mu(n){const e=gl(n);return Y(e,"internal-error"),Y(typeof e.exp<"u","internal-error"),Y(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Gr(n,e,t=!1){if(t)return e;try{return await e}catch(r){throw r instanceof vn&&hy(r)&&n.auth.currentUser===n&&await n.auth.signOut(),r}}function hy({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fy{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const r=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),r}else{this.errorBackoff=3e4;const s=((t=this.user.stsTokenManager.expirationTime)!==null&&t!==void 0?t:0)-Date.now()-3e5;return Math.max(0,s)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ba{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=Ds(this.lastLoginAt),this.creationTime=Ds(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function Xi(n){var e;const t=n.auth,r=await n.getIdToken(),s=await Gr(n,jd(t,{idToken:r}));Y(s==null?void 0:s.users.length,t,"internal-error");const i=s.users[0];n._notifyReloadListener(i);const a=!((e=i.providerUserInfo)===null||e===void 0)&&e.length?Yd(i.providerUserInfo):[],l=my(n.providerData,a),c=n.isAnonymous,d=!(n.email&&i.passwordHash)&&!(l!=null&&l.length),f=c?d:!1,m={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:l,metadata:new Ba(i.createdAt,i.lastLoginAt),isAnonymous:f};Object.assign(n,m)}async function py(n){const e=Ne(n);await Xi(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function my(n,e){return[...n.filter(r=>!e.some(s=>s.providerId===r.providerId)),...e]}function Yd(n){return n.map(e=>{var{providerId:t}=e,r=hl(e,["providerId"]);return{providerId:t,uid:r.rawId||"",displayName:r.displayName||null,email:r.email||null,phoneNumber:r.phoneNumber||null,photoURL:r.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function gy(n,e){const t=await qd(n,{},async()=>{const r=ti({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:i}=n.config,a=Hd(n,s,"/v1/token",`key=${i}`),l=await n._getAdditionalHeaders();return l["Content-Type"]="application/x-www-form-urlencoded",Ud.fetch()(a,{method:"POST",headers:l,body:r})});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function yy(n,e){return Gt(n,"POST","/v2/accounts:revokeToken",wn(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $r{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){Y(e.idToken,"internal-error"),Y(typeof e.idToken<"u","internal-error"),Y(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):mu(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){Y(e.length!==0,"internal-error");const t=mu(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(Y(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:r,refreshToken:s,expiresIn:i}=await gy(e,t);this.updateTokensAndExpiration(r,s,Number(i))}updateTokensAndExpiration(e,t,r){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,t){const{refreshToken:r,accessToken:s,expirationTime:i}=t,a=new $r;return r&&(Y(typeof r=="string","internal-error",{appName:e}),a.refreshToken=r),s&&(Y(typeof s=="string","internal-error",{appName:e}),a.accessToken=s),i&&(Y(typeof i=="number","internal-error",{appName:e}),a.expirationTime=i),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new $r,this.toJSON())}_performRefresh(){return on("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xn(n,e){Y(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class an{constructor(e){var{uid:t,auth:r,stsTokenManager:s}=e,i=hl(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new fy(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=r,this.stsTokenManager=s,this.accessToken=s.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new Ba(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const t=await Gr(this,this.stsTokenManager.getToken(this.auth,e));return Y(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return dy(this,e)}reload(){return py(this)}_assign(e){this!==e&&(Y(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new an(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){Y(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),t&&await Xi(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Mt(this.auth.app))return Promise.reject(dn(this.auth));const e=await this.getIdToken();return await Gr(this,uy(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var r,s,i,a,l,c,d,f;const m=(r=t.displayName)!==null&&r!==void 0?r:void 0,g=(s=t.email)!==null&&s!==void 0?s:void 0,b=(i=t.phoneNumber)!==null&&i!==void 0?i:void 0,S=(a=t.photoURL)!==null&&a!==void 0?a:void 0,I=(l=t.tenantId)!==null&&l!==void 0?l:void 0,R=(c=t._redirectEventId)!==null&&c!==void 0?c:void 0,C=(d=t.createdAt)!==null&&d!==void 0?d:void 0,M=(f=t.lastLoginAt)!==null&&f!==void 0?f:void 0,{uid:O,emailVerified:V,isAnonymous:$,providerData:H,stsTokenManager:T}=t;Y(O&&T,e,"internal-error");const v=$r.fromJSON(this.name,T);Y(typeof O=="string",e,"internal-error"),xn(m,e.name),xn(g,e.name),Y(typeof V=="boolean",e,"internal-error"),Y(typeof $=="boolean",e,"internal-error"),xn(b,e.name),xn(S,e.name),xn(I,e.name),xn(R,e.name),xn(C,e.name),xn(M,e.name);const y=new an({uid:O,auth:e,email:g,emailVerified:V,displayName:m,isAnonymous:$,photoURL:S,phoneNumber:b,tenantId:I,stsTokenManager:v,createdAt:C,lastLoginAt:M});return H&&Array.isArray(H)&&(y.providerData=H.map(_=>Object.assign({},_))),R&&(y._redirectEventId=R),y}static async _fromIdTokenResponse(e,t,r=!1){const s=new $r;s.updateFromServerResponse(t);const i=new an({uid:t.localId,auth:e,stsTokenManager:s,isAnonymous:r});return await Xi(i),i}static async _fromGetAccountInfoResponse(e,t,r){const s=t.users[0];Y(s.localId!==void 0,"internal-error");const i=s.providerUserInfo!==void 0?Yd(s.providerUserInfo):[],a=!(s.email&&s.passwordHash)&&!(i!=null&&i.length),l=new $r;l.updateFromIdToken(r);const c=new an({uid:s.localId,auth:e,stsTokenManager:l,isAnonymous:a}),d={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:i,metadata:new Ba(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!(i!=null&&i.length)};return Object.assign(c,d),c}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gu=new Map;function ln(n){pn(n instanceof Function,"Expected a class definition");let e=gu.get(n);return e?(pn(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,gu.set(n,e),e)}/**
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
 */class Wd{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}Wd.type="NONE";const yu=Wd;/**
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
 */function Bi(n,e,t){return`firebase:${n}:${e}:${t}`}class zr{constructor(e,t,r){this.persistence=e,this.auth=t,this.userKey=r;const{config:s,name:i}=this.auth;this.fullUserKey=Bi(this.userKey,s.apiKey,i),this.fullPersistenceKey=Bi("persistence",s.apiKey,i),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?an._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,r="authUser"){if(!t.length)return new zr(ln(yu),e,r);const s=(await Promise.all(t.map(async d=>{if(await d._isAvailable())return d}))).filter(d=>d);let i=s[0]||ln(yu);const a=Bi(r,e.config.apiKey,e.name);let l=null;for(const d of t)try{const f=await d._get(a);if(f){const m=an._fromJSON(e,f);d!==i&&(l=m),i=d;break}}catch{}const c=s.filter(d=>d._shouldAllowMigration);return!i._shouldAllowMigration||!c.length?new zr(i,e,r):(i=c[0],l&&await i._set(a,l.toJSON()),await Promise.all(t.map(async d=>{if(d!==i)try{await d._remove(a)}catch{}})),new zr(i,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vu(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Jd(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Gd(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Zd(e))return"Blackberry";if(eh(e))return"Webos";if(Kd(e))return"Safari";if((e.includes("chrome/")||Qd(e))&&!e.includes("edge/"))return"Chrome";if(Xd(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=n.match(t);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function Gd(n=et()){return/firefox\//i.test(n)}function Kd(n=et()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Qd(n=et()){return/crios\//i.test(n)}function Jd(n=et()){return/iemobile/i.test(n)}function Xd(n=et()){return/android/i.test(n)}function Zd(n=et()){return/blackberry/i.test(n)}function eh(n=et()){return/webos/i.test(n)}function yl(n=et()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function vy(n=et()){var e;return yl(n)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function wy(){return Mm()&&document.documentMode===10}function th(n=et()){return yl(n)||Xd(n)||eh(n)||Zd(n)||/windows phone/i.test(n)||Jd(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nh(n,e=[]){let t;switch(n){case"Browser":t=vu(et());break;case"Worker":t=`${vu(et())}-${n}`;break;default:t=n}const r=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${ss}/${r}`}/**
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
 */class _y{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const r=i=>new Promise((a,l)=>{try{const c=e(i);a(c)}catch(c){l(c)}});r.onAbort=t,this.queue.push(r);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const r of this.queue)await r(e),r.onAbort&&t.push(r.onAbort)}catch(r){t.reverse();for(const s of t)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
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
 */async function by(n,e={}){return Gt(n,"GET","/v2/passwordPolicy",wn(n,e))}/**
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
 */const Ey=6;class Ty{constructor(e){var t,r,s,i;const a=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(t=a.minPasswordLength)!==null&&t!==void 0?t:Ey,a.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=a.maxPasswordLength),a.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=a.containsLowercaseCharacter),a.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=a.containsUppercaseCharacter),a.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=a.containsNumericCharacter),a.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=a.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(s=(r=e.allowedNonAlphanumericCharacters)===null||r===void 0?void 0:r.join(""))!==null&&s!==void 0?s:"",this.forceUpgradeOnSignin=(i=e.forceUpgradeOnSignin)!==null&&i!==void 0?i:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,r,s,i,a,l;const c={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,c),this.validatePasswordCharacterOptions(e,c),c.isValid&&(c.isValid=(t=c.meetsMinPasswordLength)!==null&&t!==void 0?t:!0),c.isValid&&(c.isValid=(r=c.meetsMaxPasswordLength)!==null&&r!==void 0?r:!0),c.isValid&&(c.isValid=(s=c.containsLowercaseLetter)!==null&&s!==void 0?s:!0),c.isValid&&(c.isValid=(i=c.containsUppercaseLetter)!==null&&i!==void 0?i:!0),c.isValid&&(c.isValid=(a=c.containsNumericCharacter)!==null&&a!==void 0?a:!0),c.isValid&&(c.isValid=(l=c.containsNonAlphanumericCharacter)!==null&&l!==void 0?l:!0),c}validatePasswordLengthOptions(e,t){const r=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;r&&(t.meetsMinPasswordLength=e.length>=r),s&&(t.meetsMaxPasswordLength=e.length<=s)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let r;for(let s=0;s<e.length;s++)r=e.charAt(s),this.updatePasswordCharacterOptionsStatuses(t,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,t,r,s,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Iy{constructor(e,t,r,s){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=r,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new wu(this),this.idTokenSubscription=new wu(this),this.beforeStateQueue=new _y(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=zd,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=s.sdkClientVersion}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=ln(t)),this._initializationPromise=this.queue(async()=>{var r,s;if(!this._deleted&&(this.persistenceManager=await zr.create(this,e),!this._deleted)){if(!((r=this._popupRedirectResolver)===null||r===void 0)&&r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((s=this.currentUser)===null||s===void 0?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await jd(this,{idToken:e}),r=await an._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(r)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(Mt(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(l=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(l,l))}):this.directlySetCurrentUser(null)}const r=await this.assertedPersistence.getCurrentUser();let s=r,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,l=s==null?void 0:s._redirectEventId,c=await this.tryRedirectSignIn(e);(!a||a===l)&&(c!=null&&c.user)&&(s=c.user,i=!0)}if(!s)return this.directlySetCurrentUser(null);if(!s._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(s)}catch(a){s=r,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return s?this.reloadAndSetCurrentUserOrClear(s):this.directlySetCurrentUser(null)}return Y(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===s._redirectEventId?this.directlySetCurrentUser(s):this.reloadAndSetCurrentUserOrClear(s)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Xi(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=ry()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Mt(this.app))return Promise.reject(dn(this));const t=e?Ne(e):null;return t&&Y(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&Y(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Mt(this.app)?Promise.reject(dn(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Mt(this.app)?Promise.reject(dn(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(ln(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await by(this),t=new Ty(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new ei("auth","Firebase",e())}onAuthStateChanged(e,t,r){return this.registerStateListener(this.authStateSubscription,e,t,r)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,r){return this.registerStateListener(this.idTokenSubscription,e,t,r)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(r.tenantId=this.tenantId),await yy(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){const r=await this.getOrInitRedirectPersistenceManager(t);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&ln(e)||this._popupRedirectResolver;Y(t,this,"argument-error"),this.redirectPersistenceManager=await zr.create(this,[ln(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,r;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((r=this.redirectUser)===null||r===void 0?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const r=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==r&&(this.lastNotifiedUid=r,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,r,s){if(this._deleted)return()=>{};const i=typeof t=="function"?t:t.next.bind(t);let a=!1;const l=this._isInitialized?Promise.resolve():this._initializationPromise;if(Y(l,this,"internal-error"),l.then(()=>{a||i(this.currentUser)}),typeof t=="function"){const c=e.addObserver(t,r,s);return()=>{a=!0,c()}}else{const c=e.addObserver(t);return()=>{a=!0,c()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return Y(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=nh(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const r=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());r&&(t["X-Firebase-Client"]=r);const s=await this._getAppCheckToken();return s&&(t["X-Firebase-AppCheck"]=s),t}async _getAppCheckToken(){var e;const t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t!=null&&t.error&&Zg(`Error while retrieving App Check token: ${t.error}`),t==null?void 0:t.token}}function _n(n){return Ne(n)}class wu{constructor(e){this.auth=e,this.observer=null,this.addObserver=$m(t=>this.observer=t)}get next(){return Y(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let _o={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Sy(n){_o=n}function rh(n){return _o.loadJS(n)}function Ay(){return _o.recaptchaEnterpriseScript}function xy(){return _o.gapiScript}function Ry(n){return`__${n}${Math.floor(Math.random()*1e6)}`}const Py="recaptcha-enterprise",Cy="NO_RECAPTCHA";class ky{constructor(e){this.type=Py,this.auth=_n(e)}async verify(e="verify",t=!1){async function r(i){if(!t){if(i.tenantId==null&&i._agentRecaptchaConfig!=null)return i._agentRecaptchaConfig.siteKey;if(i.tenantId!=null&&i._tenantRecaptchaConfigs[i.tenantId]!==void 0)return i._tenantRecaptchaConfigs[i.tenantId].siteKey}return new Promise(async(a,l)=>{cy(i,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(c=>{if(c.recaptchaKey===void 0)l(new Error("recaptcha Enterprise site key undefined"));else{const d=new ly(c);return i.tenantId==null?i._agentRecaptchaConfig=d:i._tenantRecaptchaConfigs[i.tenantId]=d,a(d.siteKey)}}).catch(c=>{l(c)})})}function s(i,a,l){const c=window.grecaptcha;pu(c)?c.enterprise.ready(()=>{c.enterprise.execute(i,{action:e}).then(d=>{a(d)}).catch(()=>{a(Cy)})}):l(Error("No reCAPTCHA enterprise script loaded."))}return new Promise((i,a)=>{r(this.auth).then(l=>{if(!t&&pu(window.grecaptcha))s(l,i,a);else{if(typeof window>"u"){a(new Error("RecaptchaVerifier is only supported in browser"));return}let c=Ay();c.length!==0&&(c+=l),rh(c).then(()=>{s(l,i,a)}).catch(d=>{a(d)})}}).catch(l=>{a(l)})})}}async function _u(n,e,t,r=!1){const s=new ky(n);let i;try{i=await s.verify(t)}catch{i=await s.verify(t,!0)}const a=Object.assign({},e);return r?Object.assign(a,{captchaResp:i}):Object.assign(a,{captchaResponse:i}),Object.assign(a,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(a,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),a}async function Zi(n,e,t,r){var s;if(!((s=n._getRecaptchaConfig())===null||s===void 0)&&s.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const i=await _u(n,e,t,t==="getOobCode");return r(n,i)}else return r(n,e).catch(async i=>{if(i.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const a=await _u(n,e,t,t==="getOobCode");return r(n,a)}else return Promise.reject(i)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function My(n,e){const t=dl(n,"auth");if(t.isInitialized()){const s=t.getImmediate(),i=t.getOptions();if(Ki(i,e??{}))return s;Tt(s,"already-initialized")}return t.initialize({options:e})}function Dy(n,e){const t=(e==null?void 0:e.persistence)||[],r=(Array.isArray(t)?t:[t]).map(ln);e!=null&&e.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function Ny(n,e,t){const r=_n(n);Y(r._canInitEmulator,r,"emulator-config-failed"),Y(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const s=!1,i=sh(e),{host:a,port:l}=Ly(e),c=l===null?"":`:${l}`;r.config.emulator={url:`${i}//${a}${c}/`},r.settings.appVerificationDisabledForTesting=!0,r.emulatorConfig=Object.freeze({host:a,port:l,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:s})}),Oy()}function sh(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function Ly(n){const e=sh(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const r=t[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(r);if(s){const i=s[1];return{host:i,port:bu(r.substr(i.length+1))}}else{const[i,a]=r.split(":");return{host:i,port:bu(a)}}}function bu(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function Oy(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vl{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return on("not implemented")}_getIdTokenResponse(e){return on("not implemented")}_linkToIdToken(e,t){return on("not implemented")}_getReauthenticationResolver(e){return on("not implemented")}}async function By(n,e){return Gt(n,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Vy(n,e){return ri(n,"POST","/v1/accounts:signInWithPassword",wn(n,e))}async function Fy(n,e){return Gt(n,"POST","/v1/accounts:sendOobCode",wn(n,e))}async function $y(n,e){return Fy(n,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function zy(n,e){return ri(n,"POST","/v1/accounts:signInWithEmailLink",wn(n,e))}async function Uy(n,e){return ri(n,"POST","/v1/accounts:signInWithEmailLink",wn(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Us extends vl{constructor(e,t,r,s=null){super("password",r),this._email=e,this._password=t,this._tenantId=s}static _fromEmailAndPassword(e,t){return new Us(e,t,"password")}static _fromEmailAndCode(e,t,r=null){return new Us(e,t,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;if(t!=null&&t.email&&(t!=null&&t.password)){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Zi(e,t,"signInWithPassword",Vy);case"emailLink":return zy(e,{email:this._email,oobCode:this._password});default:Tt(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":const r={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Zi(e,r,"signUpPassword",By);case"emailLink":return Uy(e,{idToken:t,email:this._email,oobCode:this._password});default:Tt(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ur(n,e){return ri(n,"POST","/v1/accounts:signInWithIdp",wn(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qy="http://localhost";class mr extends vl{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new mr(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):Tt("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:s}=t,i=hl(t,["providerId","signInMethod"]);if(!r||!s)return null;const a=new mr(r,s);return a.idToken=i.idToken||void 0,a.accessToken=i.accessToken||void 0,a.secret=i.secret,a.nonce=i.nonce,a.pendingToken=i.pendingToken||null,a}_getIdTokenResponse(e){const t=this.buildRequest();return Ur(e,t)}_linkToIdToken(e,t){const r=this.buildRequest();return r.idToken=t,Ur(e,r)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,Ur(e,t)}buildRequest(){const e={requestUri:qy,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=ti(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hy(n){switch(n){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function jy(n){const e=As(xs(n)).link,t=e?As(xs(e)).deep_link_id:null,r=As(xs(n)).deep_link_id;return(r?As(xs(r)).link:null)||r||t||e||n}class wl{constructor(e){var t,r,s,i,a,l;const c=As(xs(e)),d=(t=c.apiKey)!==null&&t!==void 0?t:null,f=(r=c.oobCode)!==null&&r!==void 0?r:null,m=Hy((s=c.mode)!==null&&s!==void 0?s:null);Y(d&&f&&m,"argument-error"),this.apiKey=d,this.operation=m,this.code=f,this.continueUrl=(i=c.continueUrl)!==null&&i!==void 0?i:null,this.languageCode=(a=c.languageCode)!==null&&a!==void 0?a:null,this.tenantId=(l=c.tenantId)!==null&&l!==void 0?l:null}static parseLink(e){const t=jy(e);try{return new wl(t)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class is{constructor(){this.providerId=is.PROVIDER_ID}static credential(e,t){return Us._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const r=wl.parseLink(t);return Y(r,"argument-error"),Us._fromEmailAndCode(e,r.code,r.tenantId)}}is.PROVIDER_ID="password";is.EMAIL_PASSWORD_SIGN_IN_METHOD="password";is.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _l{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
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
 */class si extends _l{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cn extends si{constructor(){super("facebook.com")}static credential(e){return mr._fromParams({providerId:Cn.PROVIDER_ID,signInMethod:Cn.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Cn.credentialFromTaggedObject(e)}static credentialFromError(e){return Cn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Cn.credential(e.oauthAccessToken)}catch{return null}}}Cn.FACEBOOK_SIGN_IN_METHOD="facebook.com";Cn.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sn extends si{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return mr._fromParams({providerId:sn.PROVIDER_ID,signInMethod:sn.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return sn.credentialFromTaggedObject(e)}static credentialFromError(e){return sn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:r}=e;if(!t&&!r)return null;try{return sn.credential(t,r)}catch{return null}}}sn.GOOGLE_SIGN_IN_METHOD="google.com";sn.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kn extends si{constructor(){super("github.com")}static credential(e){return mr._fromParams({providerId:kn.PROVIDER_ID,signInMethod:kn.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return kn.credentialFromTaggedObject(e)}static credentialFromError(e){return kn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return kn.credential(e.oauthAccessToken)}catch{return null}}}kn.GITHUB_SIGN_IN_METHOD="github.com";kn.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mn extends si{constructor(){super("twitter.com")}static credential(e,t){return mr._fromParams({providerId:Mn.PROVIDER_ID,signInMethod:Mn.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return Mn.credentialFromTaggedObject(e)}static credentialFromError(e){return Mn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:r}=e;if(!t||!r)return null;try{return Mn.credential(t,r)}catch{return null}}}Mn.TWITTER_SIGN_IN_METHOD="twitter.com";Mn.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Yy(n,e){return ri(n,"POST","/v1/accounts:signUp",wn(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gr{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,r,s=!1){const i=await an._fromIdTokenResponse(e,r,s),a=Eu(r);return new gr({user:i,providerId:a,_tokenResponse:r,operationType:t})}static async _forOperation(e,t,r){await e._updateTokensIfNecessary(r,!0);const s=Eu(r);return new gr({user:e,providerId:s,_tokenResponse:r,operationType:t})}}function Eu(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eo extends vn{constructor(e,t,r,s){var i;super(t.code,t.message),this.operationType=r,this.user=s,Object.setPrototypeOf(this,eo.prototype),this.customData={appName:e.name,tenantId:(i=e.tenantId)!==null&&i!==void 0?i:void 0,_serverResponse:t.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,t,r,s){return new eo(e,t,r,s)}}function ih(n,e,t,r){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(i=>{throw i.code==="auth/multi-factor-auth-required"?eo._fromErrorAndOperation(n,i,e,r):i})}async function Wy(n,e,t=!1){const r=await Gr(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return gr._forOperation(n,"link",r)}/**
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
 */async function Gy(n,e,t=!1){const{auth:r}=n;if(Mt(r.app))return Promise.reject(dn(r));const s="reauthenticate";try{const i=await Gr(n,ih(r,s,e,n),t);Y(i.idToken,r,"internal-error");const a=gl(i.idToken);Y(a,r,"internal-error");const{sub:l}=a;return Y(n.uid===l,r,"user-mismatch"),gr._forOperation(n,s,i)}catch(i){throw(i==null?void 0:i.code)==="auth/user-not-found"&&Tt(r,"user-mismatch"),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function oh(n,e,t=!1){if(Mt(n.app))return Promise.reject(dn(n));const r="signIn",s=await ih(n,r,e),i=await gr._fromIdTokenResponse(n,r,s);return t||await n._updateCurrentUser(i.user),i}async function Ky(n,e){return oh(_n(n),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ah(n){const e=_n(n);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function Qy(n,e,t){const r=_n(n);await Zi(r,{requestType:"PASSWORD_RESET",email:e,clientType:"CLIENT_TYPE_WEB"},"getOobCode",$y)}async function Jy(n,e,t){if(Mt(n.app))return Promise.reject(dn(n));const r=_n(n),a=await Zi(r,{returnSecureToken:!0,email:e,password:t,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",Yy).catch(c=>{throw c.code==="auth/password-does-not-meet-requirements"&&ah(n),c}),l=await gr._fromIdTokenResponse(r,"signIn",a);return await r._updateCurrentUser(l.user),l}function Xy(n,e,t){return Mt(n.app)?Promise.reject(dn(n)):Ky(Ne(n),is.credential(e,t)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&ah(n),r})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Zy(n,e){return Gt(n,"POST","/v1/accounts:update",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ev(n,{displayName:e,photoURL:t}){if(e===void 0&&t===void 0)return;const r=Ne(n),i={idToken:await r.getIdToken(),displayName:e,photoUrl:t,returnSecureToken:!0},a=await Gr(r,Zy(r.auth,i));r.displayName=a.displayName||null,r.photoURL=a.photoUrl||null;const l=r.providerData.find(({providerId:c})=>c==="password");l&&(l.displayName=r.displayName,l.photoURL=r.photoURL),await r._updateTokensIfNecessary(a)}function tv(n,e,t,r){return Ne(n).onIdTokenChanged(e,t,r)}function nv(n,e,t){return Ne(n).beforeAuthStateChanged(e,t)}function rv(n,e,t,r){return Ne(n).onAuthStateChanged(e,t,r)}function sv(n){return Ne(n).signOut()}const to="__sak";/**
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
 */class lh{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(to,"1"),this.storage.removeItem(to),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const iv=1e3,ov=10;class ch extends lh{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=th(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const r=this.storage.getItem(t),s=this.localCache[t];r!==s&&e(t,s,r)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((a,l,c)=>{this.notifyListeners(a,c)});return}const r=e.key;t?this.detachListener():this.stopPolling();const s=()=>{const a=this.storage.getItem(r);!t&&this.localCache[r]===a||this.notifyListeners(r,a)},i=this.storage.getItem(r);wy()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(s,ov):s()}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:r}),!0)})},iv)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}ch.type="LOCAL";const av=ch;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uh extends lh{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}uh.type="SESSION";const dh=uh;/**
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
 */function lv(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
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
 */class bo{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(s=>s.isListeningto(e));if(t)return t;const r=new bo(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:r,eventType:s,data:i}=t.data,a=this.handlersMap[s];if(!(a!=null&&a.size))return;t.ports[0].postMessage({status:"ack",eventId:r,eventType:s});const l=Array.from(a).map(async d=>d(t.origin,i)),c=await lv(l);t.ports[0].postMessage({status:"done",eventId:r,eventType:s,response:c})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}bo.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bl(n="",e=10){let t="";for(let r=0;r<e;r++)t+=Math.floor(Math.random()*10);return n+t}/**
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
 */class cv{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,r=50){const s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let i,a;return new Promise((l,c)=>{const d=bl("",20);s.port1.start();const f=setTimeout(()=>{c(new Error("unsupported_event"))},r);a={messageChannel:s,onMessage(m){const g=m;if(g.data.eventId===d)switch(g.data.status){case"ack":clearTimeout(f),i=setTimeout(()=>{c(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),l(g.data.response);break;default:clearTimeout(f),clearTimeout(i),c(new Error("invalid_response"));break}}},this.handlers.add(a),s.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:d,data:t},[s.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ut(){return window}function uv(n){Ut().location.href=n}/**
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
 */function hh(){return typeof Ut().WorkerGlobalScope<"u"&&typeof Ut().importScripts=="function"}async function dv(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function hv(){var n;return((n=navigator==null?void 0:navigator.serviceWorker)===null||n===void 0?void 0:n.controller)||null}function fv(){return hh()?self:null}/**
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
 */const fh="firebaseLocalStorageDb",pv=1,no="firebaseLocalStorage",ph="fbase_key";class ii{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function Eo(n,e){return n.transaction([no],e?"readwrite":"readonly").objectStore(no)}function mv(){const n=indexedDB.deleteDatabase(fh);return new ii(n).toPromise()}function Va(){const n=indexedDB.open(fh,pv);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const r=n.result;try{r.createObjectStore(no,{keyPath:ph})}catch(s){t(s)}}),n.addEventListener("success",async()=>{const r=n.result;r.objectStoreNames.contains(no)?e(r):(r.close(),await mv(),e(await Va()))})})}async function Tu(n,e,t){const r=Eo(n,!0).put({[ph]:e,value:t});return new ii(r).toPromise()}async function gv(n,e){const t=Eo(n,!1).get(e),r=await new ii(t).toPromise();return r===void 0?null:r.value}function Iu(n,e){const t=Eo(n,!0).delete(e);return new ii(t).toPromise()}const yv=800,vv=3;class mh{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await Va(),this.db)}async _withRetries(e){let t=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(t++>vv)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return hh()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=bo._getInstance(fv()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await dv(),!this.activeServiceWorker)return;this.sender=new cv(this.activeServiceWorker);const r=await this.sender._send("ping",{},800);r&&!((e=r[0])===null||e===void 0)&&e.fulfilled&&!((t=r[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||hv()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await Va();return await Tu(e,to,"1"),await Iu(e,to),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(r=>Tu(r,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(r=>gv(r,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>Iu(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(s=>{const i=Eo(s,!1).getAll();return new ii(i).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],r=new Set;if(e.length!==0)for(const{fbase_key:s,value:i}of e)r.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(i)&&(this.notifyListeners(s,i),t.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!r.has(s)&&(this.notifyListeners(s,null),t.push(s));return t}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),yv)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}mh.type="LOCAL";const wv=mh;new ni(3e4,6e4);/**
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
 */function gh(n,e){return e?ln(e):(Y(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
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
 */class El extends vl{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Ur(e,this._buildIdpRequest())}_linkToIdToken(e,t){return Ur(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return Ur(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function _v(n){return oh(n.auth,new El(n),n.bypassAuthState)}function bv(n){const{auth:e,user:t}=n;return Y(t,e,"internal-error"),Gy(t,new El(n),n.bypassAuthState)}async function Ev(n){const{auth:e,user:t}=n;return Y(t,e,"internal-error"),Wy(t,new El(n),n.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yh{constructor(e,t,r,s,i=!1){this.auth=e,this.resolver=r,this.user=s,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:r,postBody:s,tenantId:i,error:a,type:l}=e;if(a){this.reject(a);return}const c={auth:this.auth,requestUri:t,sessionId:r,tenantId:i||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(l)(c))}catch(d){this.reject(d)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return _v;case"linkViaPopup":case"linkViaRedirect":return Ev;case"reauthViaPopup":case"reauthViaRedirect":return bv;default:Tt(this.auth,"internal-error")}}resolve(e){pn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){pn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tv=new ni(2e3,1e4);async function Iv(n,e,t){if(Mt(n.app))return Promise.reject(Nt(n,"operation-not-supported-in-this-environment"));const r=_n(n);ey(n,e,_l);const s=gh(r,t);return new lr(r,"signInViaPopup",e,s).executeNotNull()}class lr extends yh{constructor(e,t,r,s,i){super(e,t,s,i),this.provider=r,this.authWindow=null,this.pollId=null,lr.currentPopupAction&&lr.currentPopupAction.cancel(),lr.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return Y(e,this.auth,"internal-error"),e}async onExecution(){pn(this.filter.length===1,"Popup operations only handle one event");const e=bl();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(Nt(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(Nt(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,lr.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,r;if(!((r=(t=this.authWindow)===null||t===void 0?void 0:t.window)===null||r===void 0)&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Nt(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,Tv.get())};e()}}lr.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sv="pendingRedirect",Vi=new Map;class Av extends yh{constructor(e,t,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,r),this.eventId=null}async execute(){let e=Vi.get(this.auth._key());if(!e){try{const r=await xv(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(t){e=()=>Promise.reject(t)}Vi.set(this.auth._key(),e)}return this.bypassAuthState||Vi.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function xv(n,e){const t=Cv(e),r=Pv(n);if(!await r._isAvailable())return!1;const s=await r._get(t)==="true";return await r._remove(t),s}function Rv(n,e){Vi.set(n._key(),e)}function Pv(n){return ln(n._redirectPersistence)}function Cv(n){return Bi(Sv,n.config.apiKey,n.name)}async function kv(n,e,t=!1){if(Mt(n.app))return Promise.reject(dn(n));const r=_n(n),s=gh(r,e),a=await new Av(r,s,t).execute();return a&&!t&&(delete a.user._redirectEventId,await r._persistUserIfCurrent(a.user),await r._setRedirectUser(null,e)),a}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mv=10*60*1e3;class Dv{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(t=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Nv(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var r;if(e.error&&!vh(e)){const s=((r=e.error.code)===null||r===void 0?void 0:r.split("auth/")[1])||"internal-error";t.onError(Nt(this.auth,s))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const r=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Mv&&this.cachedEventUids.clear(),this.cachedEventUids.has(Su(e))}saveEventToCache(e){this.cachedEventUids.add(Su(e)),this.lastProcessedEventTime=Date.now()}}function Su(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function vh({type:n,error:e}){return n==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Nv(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return vh(n);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Lv(n,e={}){return Gt(n,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ov=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Bv=/^https?/;async function Vv(n){if(n.config.emulator)return;const{authorizedDomains:e}=await Lv(n);for(const t of e)try{if(Fv(t))return}catch{}Tt(n,"unauthorized-domain")}function Fv(n){const e=Oa(),{protocol:t,hostname:r}=new URL(e);if(n.startsWith("chrome-extension://")){const a=new URL(n);return a.hostname===""&&r===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&a.hostname===r}if(!Bv.test(t))return!1;if(Ov.test(n))return r===n;const s=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(r)}/**
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
 */const $v=new ni(3e4,6e4);function Au(){const n=Ut().___jsl;if(n!=null&&n.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function zv(n){return new Promise((e,t)=>{var r,s,i;function a(){Au(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Au(),t(Nt(n,"network-request-failed"))},timeout:$v.get()})}if(!((s=(r=Ut().gapi)===null||r===void 0?void 0:r.iframes)===null||s===void 0)&&s.Iframe)e(gapi.iframes.getContext());else if(!((i=Ut().gapi)===null||i===void 0)&&i.load)a();else{const l=Ry("iframefcb");return Ut()[l]=()=>{gapi.load?a():t(Nt(n,"network-request-failed"))},rh(`${xy()}?onload=${l}`).catch(c=>t(c))}}).catch(e=>{throw Fi=null,e})}let Fi=null;function Uv(n){return Fi=Fi||zv(n),Fi}/**
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
 */const qv=new ni(5e3,15e3),Hv="__/auth/iframe",jv="emulator/auth/iframe",Yv={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Wv=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Gv(n){const e=n.config;Y(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?ml(e,jv):`https://${n.config.authDomain}/${Hv}`,r={apiKey:e.apiKey,appName:n.name,v:ss},s=Wv.get(n.config.apiHost);s&&(r.eid=s);const i=n._getFrameworks();return i.length&&(r.fw=i.join(",")),`${t}?${ti(r).slice(1)}`}async function Kv(n){const e=await Uv(n),t=Ut().gapi;return Y(t,n,"internal-error"),e.open({where:document.body,url:Gv(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Yv,dontclear:!0},r=>new Promise(async(s,i)=>{await r.restyle({setHideOnLeave:!1});const a=Nt(n,"network-request-failed"),l=Ut().setTimeout(()=>{i(a)},qv.get());function c(){Ut().clearTimeout(l),s(r)}r.ping(c).then(c,()=>{i(a)})}))}/**
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
 */const Qv={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Jv=500,Xv=600,Zv="_blank",e0="http://localhost";class xu{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function t0(n,e,t,r=Jv,s=Xv){const i=Math.max((window.screen.availHeight-s)/2,0).toString(),a=Math.max((window.screen.availWidth-r)/2,0).toString();let l="";const c=Object.assign(Object.assign({},Qv),{width:r.toString(),height:s.toString(),top:i,left:a}),d=et().toLowerCase();t&&(l=Qd(d)?Zv:t),Gd(d)&&(e=e||e0,c.scrollbars="yes");const f=Object.entries(c).reduce((g,[b,S])=>`${g}${b}=${S},`,"");if(vy(d)&&l!=="_self")return n0(e||"",l),new xu(null);const m=window.open(e||"",l,f);Y(m,n,"popup-blocked");try{m.focus()}catch{}return new xu(m)}function n0(n,e){const t=document.createElement("a");t.href=n,t.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(r)}/**
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
 */const r0="__/auth/handler",s0="emulator/auth/handler",i0=encodeURIComponent("fac");async function Ru(n,e,t,r,s,i){Y(n.config.authDomain,n,"auth-domain-config-required"),Y(n.config.apiKey,n,"invalid-api-key");const a={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:r,v:ss,eventId:s};if(e instanceof _l){e.setDefaultLanguage(n.languageCode),a.providerId=e.providerId||"",Fm(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(const[f,m]of Object.entries({}))a[f]=m}if(e instanceof si){const f=e.getScopes().filter(m=>m!=="");f.length>0&&(a.scopes=f.join(","))}n.tenantId&&(a.tid=n.tenantId);const l=a;for(const f of Object.keys(l))l[f]===void 0&&delete l[f];const c=await n._getAppCheckToken(),d=c?`#${i0}=${encodeURIComponent(c)}`:"";return`${o0(n)}?${ti(l).slice(1)}${d}`}function o0({config:n}){return n.emulator?ml(n,s0):`https://${n.authDomain}/${r0}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _a="webStorageSupport";class a0{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=dh,this._completeRedirectFn=kv,this._overrideRedirectResult=Rv}async _openPopup(e,t,r,s){var i;pn((i=this.eventManagers[e._key()])===null||i===void 0?void 0:i.manager,"_initialize() not called before _openPopup()");const a=await Ru(e,t,r,Oa(),s);return t0(e,a,bl())}async _openRedirect(e,t,r,s){await this._originValidation(e);const i=await Ru(e,t,r,Oa(),s);return uv(i),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:s,promise:i}=this.eventManagers[t];return s?Promise.resolve(s):(pn(i,"If manager is not set, promise should be"),i)}const r=this.initAndGetManager(e);return this.eventManagers[t]={promise:r},r.catch(()=>{delete this.eventManagers[t]}),r}async initAndGetManager(e){const t=await Kv(e),r=new Dv(e);return t.register("authEvent",s=>(Y(s==null?void 0:s.authEvent,e,"invalid-auth-event"),{status:r.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=t,r}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(_a,{type:_a},s=>{var i;const a=(i=s==null?void 0:s[0])===null||i===void 0?void 0:i[_a];a!==void 0&&t(!!a),Tt(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=Vv(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return th()||Kd()||yl()}}const l0=a0;var Pu="@firebase/auth",Cu="1.7.9";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class c0{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){Y(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function u0(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function d0(n){Wr(new pr("auth",(e,{options:t})=>{const r=e.getProvider("app").getImmediate(),s=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:a,authDomain:l}=r.options;Y(a&&!a.includes(":"),"invalid-api-key",{appName:r.name});const c={apiKey:a,authDomain:l,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:nh(n)},d=new Iy(r,s,i,c);return Dy(d,t),d},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,r)=>{e.getProvider("auth-internal").initialize()})),Wr(new pr("auth-internal",e=>{const t=_n(e.getProvider("auth").getImmediate());return(r=>new c0(r))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),Fn(Pu,Cu,u0(n)),Fn(Pu,Cu,"esm2017")}/**
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
 */const h0=5*60,f0=Dd("authIdTokenMaxAge")||h0;let ku=null;const p0=n=>async e=>{const t=e&&await e.getIdTokenResult(),r=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(r&&r>f0)return;const s=t==null?void 0:t.token;ku!==s&&(ku=s,await fetch(n,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function m0(n=Bd()){const e=dl(n,"auth");if(e.isInitialized())return e.getImmediate();const t=My(n,{popupRedirectResolver:l0,persistence:[wv,av,dh]}),r=Dd("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const i=new URL(r,location.origin);if(location.origin===i.origin){const a=p0(i.toString());nv(t,a,()=>a(t.currentUser)),tv(t,l=>a(l))}}const s=kd("auth");return s&&Ny(t,`http://${s}`),t}function g0(){var n,e;return(e=(n=document.getElementsByTagName("head"))===null||n===void 0?void 0:n[0])!==null&&e!==void 0?e:document}Sy({loadJS(n){return new Promise((e,t)=>{const r=document.createElement("script");r.setAttribute("src",n),r.onload=e,r.onerror=s=>{const i=Nt("internal-error");i.customData=s,t(i)},r.type="text/javascript",r.charset="UTF-8",g0().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});d0("Browser");var Mu=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var hr,wh;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(T,v){function y(){}y.prototype=v.prototype,T.D=v.prototype,T.prototype=new y,T.prototype.constructor=T,T.C=function(_,E,A){for(var w=Array(arguments.length-2),X=2;X<arguments.length;X++)w[X-2]=arguments[X];return v.prototype[E].apply(_,w)}}function t(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(r,t),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(T,v,y){y||(y=0);var _=Array(16);if(typeof v=="string")for(var E=0;16>E;++E)_[E]=v.charCodeAt(y++)|v.charCodeAt(y++)<<8|v.charCodeAt(y++)<<16|v.charCodeAt(y++)<<24;else for(E=0;16>E;++E)_[E]=v[y++]|v[y++]<<8|v[y++]<<16|v[y++]<<24;v=T.g[0],y=T.g[1],E=T.g[2];var A=T.g[3],w=v+(A^y&(E^A))+_[0]+3614090360&4294967295;v=y+(w<<7&4294967295|w>>>25),w=A+(E^v&(y^E))+_[1]+3905402710&4294967295,A=v+(w<<12&4294967295|w>>>20),w=E+(y^A&(v^y))+_[2]+606105819&4294967295,E=A+(w<<17&4294967295|w>>>15),w=y+(v^E&(A^v))+_[3]+3250441966&4294967295,y=E+(w<<22&4294967295|w>>>10),w=v+(A^y&(E^A))+_[4]+4118548399&4294967295,v=y+(w<<7&4294967295|w>>>25),w=A+(E^v&(y^E))+_[5]+1200080426&4294967295,A=v+(w<<12&4294967295|w>>>20),w=E+(y^A&(v^y))+_[6]+2821735955&4294967295,E=A+(w<<17&4294967295|w>>>15),w=y+(v^E&(A^v))+_[7]+4249261313&4294967295,y=E+(w<<22&4294967295|w>>>10),w=v+(A^y&(E^A))+_[8]+1770035416&4294967295,v=y+(w<<7&4294967295|w>>>25),w=A+(E^v&(y^E))+_[9]+2336552879&4294967295,A=v+(w<<12&4294967295|w>>>20),w=E+(y^A&(v^y))+_[10]+4294925233&4294967295,E=A+(w<<17&4294967295|w>>>15),w=y+(v^E&(A^v))+_[11]+2304563134&4294967295,y=E+(w<<22&4294967295|w>>>10),w=v+(A^y&(E^A))+_[12]+1804603682&4294967295,v=y+(w<<7&4294967295|w>>>25),w=A+(E^v&(y^E))+_[13]+4254626195&4294967295,A=v+(w<<12&4294967295|w>>>20),w=E+(y^A&(v^y))+_[14]+2792965006&4294967295,E=A+(w<<17&4294967295|w>>>15),w=y+(v^E&(A^v))+_[15]+1236535329&4294967295,y=E+(w<<22&4294967295|w>>>10),w=v+(E^A&(y^E))+_[1]+4129170786&4294967295,v=y+(w<<5&4294967295|w>>>27),w=A+(y^E&(v^y))+_[6]+3225465664&4294967295,A=v+(w<<9&4294967295|w>>>23),w=E+(v^y&(A^v))+_[11]+643717713&4294967295,E=A+(w<<14&4294967295|w>>>18),w=y+(A^v&(E^A))+_[0]+3921069994&4294967295,y=E+(w<<20&4294967295|w>>>12),w=v+(E^A&(y^E))+_[5]+3593408605&4294967295,v=y+(w<<5&4294967295|w>>>27),w=A+(y^E&(v^y))+_[10]+38016083&4294967295,A=v+(w<<9&4294967295|w>>>23),w=E+(v^y&(A^v))+_[15]+3634488961&4294967295,E=A+(w<<14&4294967295|w>>>18),w=y+(A^v&(E^A))+_[4]+3889429448&4294967295,y=E+(w<<20&4294967295|w>>>12),w=v+(E^A&(y^E))+_[9]+568446438&4294967295,v=y+(w<<5&4294967295|w>>>27),w=A+(y^E&(v^y))+_[14]+3275163606&4294967295,A=v+(w<<9&4294967295|w>>>23),w=E+(v^y&(A^v))+_[3]+4107603335&4294967295,E=A+(w<<14&4294967295|w>>>18),w=y+(A^v&(E^A))+_[8]+1163531501&4294967295,y=E+(w<<20&4294967295|w>>>12),w=v+(E^A&(y^E))+_[13]+2850285829&4294967295,v=y+(w<<5&4294967295|w>>>27),w=A+(y^E&(v^y))+_[2]+4243563512&4294967295,A=v+(w<<9&4294967295|w>>>23),w=E+(v^y&(A^v))+_[7]+1735328473&4294967295,E=A+(w<<14&4294967295|w>>>18),w=y+(A^v&(E^A))+_[12]+2368359562&4294967295,y=E+(w<<20&4294967295|w>>>12),w=v+(y^E^A)+_[5]+4294588738&4294967295,v=y+(w<<4&4294967295|w>>>28),w=A+(v^y^E)+_[8]+2272392833&4294967295,A=v+(w<<11&4294967295|w>>>21),w=E+(A^v^y)+_[11]+1839030562&4294967295,E=A+(w<<16&4294967295|w>>>16),w=y+(E^A^v)+_[14]+4259657740&4294967295,y=E+(w<<23&4294967295|w>>>9),w=v+(y^E^A)+_[1]+2763975236&4294967295,v=y+(w<<4&4294967295|w>>>28),w=A+(v^y^E)+_[4]+1272893353&4294967295,A=v+(w<<11&4294967295|w>>>21),w=E+(A^v^y)+_[7]+4139469664&4294967295,E=A+(w<<16&4294967295|w>>>16),w=y+(E^A^v)+_[10]+3200236656&4294967295,y=E+(w<<23&4294967295|w>>>9),w=v+(y^E^A)+_[13]+681279174&4294967295,v=y+(w<<4&4294967295|w>>>28),w=A+(v^y^E)+_[0]+3936430074&4294967295,A=v+(w<<11&4294967295|w>>>21),w=E+(A^v^y)+_[3]+3572445317&4294967295,E=A+(w<<16&4294967295|w>>>16),w=y+(E^A^v)+_[6]+76029189&4294967295,y=E+(w<<23&4294967295|w>>>9),w=v+(y^E^A)+_[9]+3654602809&4294967295,v=y+(w<<4&4294967295|w>>>28),w=A+(v^y^E)+_[12]+3873151461&4294967295,A=v+(w<<11&4294967295|w>>>21),w=E+(A^v^y)+_[15]+530742520&4294967295,E=A+(w<<16&4294967295|w>>>16),w=y+(E^A^v)+_[2]+3299628645&4294967295,y=E+(w<<23&4294967295|w>>>9),w=v+(E^(y|~A))+_[0]+4096336452&4294967295,v=y+(w<<6&4294967295|w>>>26),w=A+(y^(v|~E))+_[7]+1126891415&4294967295,A=v+(w<<10&4294967295|w>>>22),w=E+(v^(A|~y))+_[14]+2878612391&4294967295,E=A+(w<<15&4294967295|w>>>17),w=y+(A^(E|~v))+_[5]+4237533241&4294967295,y=E+(w<<21&4294967295|w>>>11),w=v+(E^(y|~A))+_[12]+1700485571&4294967295,v=y+(w<<6&4294967295|w>>>26),w=A+(y^(v|~E))+_[3]+2399980690&4294967295,A=v+(w<<10&4294967295|w>>>22),w=E+(v^(A|~y))+_[10]+4293915773&4294967295,E=A+(w<<15&4294967295|w>>>17),w=y+(A^(E|~v))+_[1]+2240044497&4294967295,y=E+(w<<21&4294967295|w>>>11),w=v+(E^(y|~A))+_[8]+1873313359&4294967295,v=y+(w<<6&4294967295|w>>>26),w=A+(y^(v|~E))+_[15]+4264355552&4294967295,A=v+(w<<10&4294967295|w>>>22),w=E+(v^(A|~y))+_[6]+2734768916&4294967295,E=A+(w<<15&4294967295|w>>>17),w=y+(A^(E|~v))+_[13]+1309151649&4294967295,y=E+(w<<21&4294967295|w>>>11),w=v+(E^(y|~A))+_[4]+4149444226&4294967295,v=y+(w<<6&4294967295|w>>>26),w=A+(y^(v|~E))+_[11]+3174756917&4294967295,A=v+(w<<10&4294967295|w>>>22),w=E+(v^(A|~y))+_[2]+718787259&4294967295,E=A+(w<<15&4294967295|w>>>17),w=y+(A^(E|~v))+_[9]+3951481745&4294967295,T.g[0]=T.g[0]+v&4294967295,T.g[1]=T.g[1]+(E+(w<<21&4294967295|w>>>11))&4294967295,T.g[2]=T.g[2]+E&4294967295,T.g[3]=T.g[3]+A&4294967295}r.prototype.u=function(T,v){v===void 0&&(v=T.length);for(var y=v-this.blockSize,_=this.B,E=this.h,A=0;A<v;){if(E==0)for(;A<=y;)s(this,T,A),A+=this.blockSize;if(typeof T=="string"){for(;A<v;)if(_[E++]=T.charCodeAt(A++),E==this.blockSize){s(this,_),E=0;break}}else for(;A<v;)if(_[E++]=T[A++],E==this.blockSize){s(this,_),E=0;break}}this.h=E,this.o+=v},r.prototype.v=function(){var T=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);T[0]=128;for(var v=1;v<T.length-8;++v)T[v]=0;var y=8*this.o;for(v=T.length-8;v<T.length;++v)T[v]=y&255,y/=256;for(this.u(T),T=Array(16),v=y=0;4>v;++v)for(var _=0;32>_;_+=8)T[y++]=this.g[v]>>>_&255;return T};function i(T,v){var y=l;return Object.prototype.hasOwnProperty.call(y,T)?y[T]:y[T]=v(T)}function a(T,v){this.h=v;for(var y=[],_=!0,E=T.length-1;0<=E;E--){var A=T[E]|0;_&&A==v||(y[E]=A,_=!1)}this.g=y}var l={};function c(T){return-128<=T&&128>T?i(T,function(v){return new a([v|0],0>v?-1:0)}):new a([T|0],0>T?-1:0)}function d(T){if(isNaN(T)||!isFinite(T))return m;if(0>T)return R(d(-T));for(var v=[],y=1,_=0;T>=y;_++)v[_]=T/y|0,y*=4294967296;return new a(v,0)}function f(T,v){if(T.length==0)throw Error("number format error: empty string");if(v=v||10,2>v||36<v)throw Error("radix out of range: "+v);if(T.charAt(0)=="-")return R(f(T.substring(1),v));if(0<=T.indexOf("-"))throw Error('number format error: interior "-" character');for(var y=d(Math.pow(v,8)),_=m,E=0;E<T.length;E+=8){var A=Math.min(8,T.length-E),w=parseInt(T.substring(E,E+A),v);8>A?(A=d(Math.pow(v,A)),_=_.j(A).add(d(w))):(_=_.j(y),_=_.add(d(w)))}return _}var m=c(0),g=c(1),b=c(16777216);n=a.prototype,n.m=function(){if(I(this))return-R(this).m();for(var T=0,v=1,y=0;y<this.g.length;y++){var _=this.i(y);T+=(0<=_?_:4294967296+_)*v,v*=4294967296}return T},n.toString=function(T){if(T=T||10,2>T||36<T)throw Error("radix out of range: "+T);if(S(this))return"0";if(I(this))return"-"+R(this).toString(T);for(var v=d(Math.pow(T,6)),y=this,_="";;){var E=V(y,v).g;y=C(y,E.j(v));var A=((0<y.g.length?y.g[0]:y.h)>>>0).toString(T);if(y=E,S(y))return A+_;for(;6>A.length;)A="0"+A;_=A+_}},n.i=function(T){return 0>T?0:T<this.g.length?this.g[T]:this.h};function S(T){if(T.h!=0)return!1;for(var v=0;v<T.g.length;v++)if(T.g[v]!=0)return!1;return!0}function I(T){return T.h==-1}n.l=function(T){return T=C(this,T),I(T)?-1:S(T)?0:1};function R(T){for(var v=T.g.length,y=[],_=0;_<v;_++)y[_]=~T.g[_];return new a(y,~T.h).add(g)}n.abs=function(){return I(this)?R(this):this},n.add=function(T){for(var v=Math.max(this.g.length,T.g.length),y=[],_=0,E=0;E<=v;E++){var A=_+(this.i(E)&65535)+(T.i(E)&65535),w=(A>>>16)+(this.i(E)>>>16)+(T.i(E)>>>16);_=w>>>16,A&=65535,w&=65535,y[E]=w<<16|A}return new a(y,y[y.length-1]&-2147483648?-1:0)};function C(T,v){return T.add(R(v))}n.j=function(T){if(S(this)||S(T))return m;if(I(this))return I(T)?R(this).j(R(T)):R(R(this).j(T));if(I(T))return R(this.j(R(T)));if(0>this.l(b)&&0>T.l(b))return d(this.m()*T.m());for(var v=this.g.length+T.g.length,y=[],_=0;_<2*v;_++)y[_]=0;for(_=0;_<this.g.length;_++)for(var E=0;E<T.g.length;E++){var A=this.i(_)>>>16,w=this.i(_)&65535,X=T.i(E)>>>16,we=T.i(E)&65535;y[2*_+2*E]+=w*we,M(y,2*_+2*E),y[2*_+2*E+1]+=A*we,M(y,2*_+2*E+1),y[2*_+2*E+1]+=w*X,M(y,2*_+2*E+1),y[2*_+2*E+2]+=A*X,M(y,2*_+2*E+2)}for(_=0;_<v;_++)y[_]=y[2*_+1]<<16|y[2*_];for(_=v;_<2*v;_++)y[_]=0;return new a(y,0)};function M(T,v){for(;(T[v]&65535)!=T[v];)T[v+1]+=T[v]>>>16,T[v]&=65535,v++}function O(T,v){this.g=T,this.h=v}function V(T,v){if(S(v))throw Error("division by zero");if(S(T))return new O(m,m);if(I(T))return v=V(R(T),v),new O(R(v.g),R(v.h));if(I(v))return v=V(T,R(v)),new O(R(v.g),v.h);if(30<T.g.length){if(I(T)||I(v))throw Error("slowDivide_ only works with positive integers.");for(var y=g,_=v;0>=_.l(T);)y=$(y),_=$(_);var E=H(y,1),A=H(_,1);for(_=H(_,2),y=H(y,2);!S(_);){var w=A.add(_);0>=w.l(T)&&(E=E.add(y),A=w),_=H(_,1),y=H(y,1)}return v=C(T,E.j(v)),new O(E,v)}for(E=m;0<=T.l(v);){for(y=Math.max(1,Math.floor(T.m()/v.m())),_=Math.ceil(Math.log(y)/Math.LN2),_=48>=_?1:Math.pow(2,_-48),A=d(y),w=A.j(v);I(w)||0<w.l(T);)y-=_,A=d(y),w=A.j(v);S(A)&&(A=g),E=E.add(A),T=C(T,w)}return new O(E,T)}n.A=function(T){return V(this,T).h},n.and=function(T){for(var v=Math.max(this.g.length,T.g.length),y=[],_=0;_<v;_++)y[_]=this.i(_)&T.i(_);return new a(y,this.h&T.h)},n.or=function(T){for(var v=Math.max(this.g.length,T.g.length),y=[],_=0;_<v;_++)y[_]=this.i(_)|T.i(_);return new a(y,this.h|T.h)},n.xor=function(T){for(var v=Math.max(this.g.length,T.g.length),y=[],_=0;_<v;_++)y[_]=this.i(_)^T.i(_);return new a(y,this.h^T.h)};function $(T){for(var v=T.g.length+1,y=[],_=0;_<v;_++)y[_]=T.i(_)<<1|T.i(_-1)>>>31;return new a(y,T.h)}function H(T,v){var y=v>>5;v%=32;for(var _=T.g.length-y,E=[],A=0;A<_;A++)E[A]=0<v?T.i(A+y)>>>v|T.i(A+y+1)<<32-v:T.i(A+y);return new a(E,T.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,wh=r,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.A,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=d,a.fromString=f,hr=a}).apply(typeof Mu<"u"?Mu:typeof self<"u"?self:typeof window<"u"?window:{});var Mi=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var _h,Rs,bh,$i,Fa,Eh,Th,Ih;(function(){var n,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(o,u,h){return o==Array.prototype||o==Object.prototype||(o[u]=h.value),o};function t(o){o=[typeof globalThis=="object"&&globalThis,o,typeof window=="object"&&window,typeof self=="object"&&self,typeof Mi=="object"&&Mi];for(var u=0;u<o.length;++u){var h=o[u];if(h&&h.Math==Math)return h}throw Error("Cannot find global object")}var r=t(this);function s(o,u){if(u)e:{var h=r;o=o.split(".");for(var p=0;p<o.length-1;p++){var x=o[p];if(!(x in h))break e;h=h[x]}o=o[o.length-1],p=h[o],u=u(p),u!=p&&u!=null&&e(h,o,{configurable:!0,writable:!0,value:u})}}function i(o,u){o instanceof String&&(o+="");var h=0,p=!1,x={next:function(){if(!p&&h<o.length){var P=h++;return{value:u(P,o[P]),done:!1}}return p=!0,{done:!0,value:void 0}}};return x[Symbol.iterator]=function(){return x},x}s("Array.prototype.values",function(o){return o||function(){return i(this,function(u,h){return h})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var a=a||{},l=this||self;function c(o){var u=typeof o;return u=u!="object"?u:o?Array.isArray(o)?"array":u:"null",u=="array"||u=="object"&&typeof o.length=="number"}function d(o){var u=typeof o;return u=="object"&&o!=null||u=="function"}function f(o,u,h){return o.call.apply(o.bind,arguments)}function m(o,u,h){if(!o)throw Error();if(2<arguments.length){var p=Array.prototype.slice.call(arguments,2);return function(){var x=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(x,p),o.apply(u,x)}}return function(){return o.apply(u,arguments)}}function g(o,u,h){return g=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?f:m,g.apply(null,arguments)}function b(o,u){var h=Array.prototype.slice.call(arguments,1);return function(){var p=h.slice();return p.push.apply(p,arguments),o.apply(this,p)}}function S(o,u){function h(){}h.prototype=u.prototype,o.aa=u.prototype,o.prototype=new h,o.prototype.constructor=o,o.Qb=function(p,x,P){for(var N=Array(arguments.length-2),he=2;he<arguments.length;he++)N[he-2]=arguments[he];return u.prototype[x].apply(p,N)}}function I(o){const u=o.length;if(0<u){const h=Array(u);for(let p=0;p<u;p++)h[p]=o[p];return h}return[]}function R(o,u){for(let h=1;h<arguments.length;h++){const p=arguments[h];if(c(p)){const x=o.length||0,P=p.length||0;o.length=x+P;for(let N=0;N<P;N++)o[x+N]=p[N]}else o.push(p)}}class C{constructor(u,h){this.i=u,this.j=h,this.h=0,this.g=null}get(){let u;return 0<this.h?(this.h--,u=this.g,this.g=u.next,u.next=null):u=this.i(),u}}function M(o){return/^[\s\xa0]*$/.test(o)}function O(){var o=l.navigator;return o&&(o=o.userAgent)?o:""}function V(o){return V[" "](o),o}V[" "]=function(){};var $=O().indexOf("Gecko")!=-1&&!(O().toLowerCase().indexOf("webkit")!=-1&&O().indexOf("Edge")==-1)&&!(O().indexOf("Trident")!=-1||O().indexOf("MSIE")!=-1)&&O().indexOf("Edge")==-1;function H(o,u,h){for(const p in o)u.call(h,o[p],p,o)}function T(o,u){for(const h in o)u.call(void 0,o[h],h,o)}function v(o){const u={};for(const h in o)u[h]=o[h];return u}const y="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function _(o,u){let h,p;for(let x=1;x<arguments.length;x++){p=arguments[x];for(h in p)o[h]=p[h];for(let P=0;P<y.length;P++)h=y[P],Object.prototype.hasOwnProperty.call(p,h)&&(o[h]=p[h])}}function E(o){var u=1;o=o.split(":");const h=[];for(;0<u&&o.length;)h.push(o.shift()),u--;return o.length&&h.push(o.join(":")),h}function A(o){l.setTimeout(()=>{throw o},0)}function w(){var o=Ue;let u=null;return o.g&&(u=o.g,o.g=o.g.next,o.g||(o.h=null),u.next=null),u}class X{constructor(){this.h=this.g=null}add(u,h){const p=we.get();p.set(u,h),this.h?this.h.next=p:this.g=p,this.h=p}}var we=new C(()=>new j,o=>o.reset());class j{constructor(){this.next=this.g=this.h=null}set(u,h){this.h=u,this.g=h,this.next=null}reset(){this.next=this.g=this.h=null}}let Z,oe=!1,Ue=new X,fe=()=>{const o=l.Promise.resolve(void 0);Z=()=>{o.then(te)}};var te=()=>{for(var o;o=w();){try{o.h.call(o.g)}catch(h){A(h)}var u=we;u.j(o),100>u.h&&(u.h++,o.next=u.g,u.g=o)}oe=!1};function ne(){this.s=this.s,this.C=this.C}ne.prototype.s=!1,ne.prototype.ma=function(){this.s||(this.s=!0,this.N())},ne.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function F(o,u){this.type=o,this.g=this.target=u,this.defaultPrevented=!1}F.prototype.h=function(){this.defaultPrevented=!0};var Re=function(){if(!l.addEventListener||!Object.defineProperty)return!1;var o=!1,u=Object.defineProperty({},"passive",{get:function(){o=!0}});try{const h=()=>{};l.addEventListener("test",h,u),l.removeEventListener("test",h,u)}catch{}return o}();function ce(o,u){if(F.call(this,o?o.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,o){var h=this.type=o.type,p=o.changedTouches&&o.changedTouches.length?o.changedTouches[0]:null;if(this.target=o.target||o.srcElement,this.g=u,u=o.relatedTarget){if($){e:{try{V(u.nodeName);var x=!0;break e}catch{}x=!1}x||(u=null)}}else h=="mouseover"?u=o.fromElement:h=="mouseout"&&(u=o.toElement);this.relatedTarget=u,p?(this.clientX=p.clientX!==void 0?p.clientX:p.pageX,this.clientY=p.clientY!==void 0?p.clientY:p.pageY,this.screenX=p.screenX||0,this.screenY=p.screenY||0):(this.clientX=o.clientX!==void 0?o.clientX:o.pageX,this.clientY=o.clientY!==void 0?o.clientY:o.pageY,this.screenX=o.screenX||0,this.screenY=o.screenY||0),this.button=o.button,this.key=o.key||"",this.ctrlKey=o.ctrlKey,this.altKey=o.altKey,this.shiftKey=o.shiftKey,this.metaKey=o.metaKey,this.pointerId=o.pointerId||0,this.pointerType=typeof o.pointerType=="string"?o.pointerType:Jt[o.pointerType]||"",this.state=o.state,this.i=o,o.defaultPrevented&&ce.aa.h.call(this)}}S(ce,F);var Jt={2:"touch",3:"pen",4:"mouse"};ce.prototype.h=function(){ce.aa.h.call(this);var o=this.i;o.preventDefault?o.preventDefault():o.returnValue=!1};var Se="closure_listenable_"+(1e6*Math.random()|0),Xt=0;function Zt(o,u,h,p,x){this.listener=o,this.proxy=null,this.src=u,this.type=h,this.capture=!!p,this.ha=x,this.key=++Xt,this.da=this.fa=!1}function en(o){o.da=!0,o.listener=null,o.proxy=null,o.src=null,o.ha=null}function St(o){this.src=o,this.g={},this.h=0}St.prototype.add=function(o,u,h,p,x){var P=o.toString();o=this.g[P],o||(o=this.g[P]=[],this.h++);var N=vt(o,u,p,x);return-1<N?(u=o[N],h||(u.fa=!1)):(u=new Zt(u,this.src,P,!!p,x),u.fa=h,o.push(u)),u};function At(o,u){var h=u.type;if(h in o.g){var p=o.g[h],x=Array.prototype.indexOf.call(p,u,void 0),P;(P=0<=x)&&Array.prototype.splice.call(p,x,1),P&&(en(u),o.g[h].length==0&&(delete o.g[h],o.h--))}}function vt(o,u,h,p){for(var x=0;x<o.length;++x){var P=o[x];if(!P.da&&P.listener==u&&P.capture==!!h&&P.ha==p)return x}return-1}var tn="closure_lm_"+(1e6*Math.random()|0),Vt={};function Tn(o,u,h,p,x){if(Array.isArray(u)){for(var P=0;P<u.length;P++)Tn(o,u[P],h,p,x);return null}return h=er(h),o&&o[Se]?o.K(u,h,d(p)?!!p.capture:!1,x):Jn(o,u,h,!1,p,x)}function Jn(o,u,h,p,x,P){if(!u)throw Error("Invalid event type");var N=d(x)?!!x.capture:!!x,he=tt(o);if(he||(o[tn]=he=new St(o)),h=he.add(u,h,p,N,P),h.proxy)return h;if(p=ht(),h.proxy=p,p.src=o,p.listener=h,o.addEventListener)Re||(x=N),x===void 0&&(x=!1),o.addEventListener(u.toString(),p,x);else if(o.attachEvent)o.attachEvent(ke(u.toString()),p);else if(o.addListener&&o.removeListener)o.addListener(p);else throw Error("addEventListener and attachEvent are unavailable.");return h}function ht(){function o(h){return u.call(o.src,o.listener,h)}const u=Xn;return o}function xt(o,u,h,p,x){if(Array.isArray(u))for(var P=0;P<u.length;P++)xt(o,u[P],h,p,x);else p=d(p)?!!p.capture:!!p,h=er(h),o&&o[Se]?(o=o.i,u=String(u).toString(),u in o.g&&(P=o.g[u],h=vt(P,h,p,x),-1<h&&(en(P[h]),Array.prototype.splice.call(P,h,1),P.length==0&&(delete o.g[u],o.h--)))):o&&(o=tt(o))&&(u=o.g[u.toString()],o=-1,u&&(o=vt(u,h,p,x)),(h=-1<o?u[o]:null)&&Rt(h))}function Rt(o){if(typeof o!="number"&&o&&!o.da){var u=o.src;if(u&&u[Se])At(u.i,o);else{var h=o.type,p=o.proxy;u.removeEventListener?u.removeEventListener(h,p,o.capture):u.detachEvent?u.detachEvent(ke(h),p):u.addListener&&u.removeListener&&u.removeListener(p),(h=tt(u))?(At(h,o),h.h==0&&(h.src=null,u[tn]=null)):en(o)}}}function ke(o){return o in Vt?Vt[o]:Vt[o]="on"+o}function Xn(o,u){if(o.da)o=!0;else{u=new ce(u,this);var h=o.listener,p=o.ha||o.src;o.fa&&Rt(o),o=h.call(p,u)}return o}function tt(o){return o=o[tn],o instanceof St?o:null}var Zn="__closure_events_fn_"+(1e9*Math.random()>>>0);function er(o){return typeof o=="function"?o:(o[Zn]||(o[Zn]=function(u){return o.handleEvent(u)}),o[Zn])}function be(){ne.call(this),this.i=new St(this),this.M=this,this.F=null}S(be,ne),be.prototype[Se]=!0,be.prototype.removeEventListener=function(o,u,h,p){xt(this,o,u,h,p)};function Ee(o,u){var h,p=o.F;if(p)for(h=[];p;p=p.F)h.push(p);if(o=o.M,p=u.type||u,typeof u=="string")u=new F(u,o);else if(u instanceof F)u.target=u.target||o;else{var x=u;u=new F(p,o),_(u,x)}if(x=!0,h)for(var P=h.length-1;0<=P;P--){var N=u.g=h[P];x=ft(N,p,!0,u)&&x}if(N=u.g=o,x=ft(N,p,!0,u)&&x,x=ft(N,p,!1,u)&&x,h)for(P=0;P<h.length;P++)N=u.g=h[P],x=ft(N,p,!1,u)&&x}be.prototype.N=function(){if(be.aa.N.call(this),this.i){var o=this.i,u;for(u in o.g){for(var h=o.g[u],p=0;p<h.length;p++)en(h[p]);delete o.g[u],o.h--}}this.F=null},be.prototype.K=function(o,u,h,p){return this.i.add(String(o),u,!1,h,p)},be.prototype.L=function(o,u,h,p){return this.i.add(String(o),u,!0,h,p)};function ft(o,u,h,p){if(u=o.i.g[String(u)],!u)return!0;u=u.concat();for(var x=!0,P=0;P<u.length;++P){var N=u[P];if(N&&!N.da&&N.capture==h){var he=N.listener,He=N.ha||N.src;N.fa&&At(o.i,N),x=he.call(He,p)!==!1&&x}}return x&&!p.defaultPrevented}function pt(o,u,h){if(typeof o=="function")h&&(o=g(o,h));else if(o&&typeof o.handleEvent=="function")o=g(o.handleEvent,o);else throw Error("Invalid listener argument");return 2147483647<Number(u)?-1:l.setTimeout(o,u||0)}function ge(o){o.g=pt(()=>{o.g=null,o.i&&(o.i=!1,ge(o))},o.l);const u=o.h;o.h=null,o.m.apply(null,u)}class wt extends ne{constructor(u,h){super(),this.m=u,this.l=h,this.h=null,this.i=!1,this.g=null}j(u){this.h=arguments,this.g?this.i=!0:ge(this)}N(){super.N(),this.g&&(l.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Fe(o){ne.call(this),this.h=o,this.g={}}S(Fe,ne);var _t=[];function Pt(o){H(o.g,function(u,h){this.g.hasOwnProperty(h)&&Rt(u)},o),o.g={}}Fe.prototype.N=function(){Fe.aa.N.call(this),Pt(this)},Fe.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var xr=l.JSON.stringify,Zo=l.JSON.parse,ea=class{stringify(o){return l.JSON.stringify(o,void 0)}parse(o){return l.JSON.parse(o,void 0)}};function ds(){}ds.prototype.h=null;function gi(o){return o.h||(o.h=o.i())}function Rr(){}var tr={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function Pr(){F.call(this,"d")}S(Pr,F);function Cr(){F.call(this,"c")}S(Cr,F);var Ft={},hs=null;function ee(){return hs=hs||new be}Ft.La="serverreachability";function Le(o){F.call(this,Ft.La,o)}S(Le,F);function Ae(o){const u=ee();Ee(u,new Le(u))}Ft.STAT_EVENT="statevent";function nt(o,u){F.call(this,Ft.STAT_EVENT,o),this.stat=u}S(nt,F);function ye(o){const u=ee();Ee(u,new nt(u,o))}Ft.Ma="timingevent";function Pe(o,u){F.call(this,Ft.Ma,o),this.size=u}S(Pe,F);function rt(o,u){if(typeof o!="function")throw Error("Fn must not be null and must be a function");return l.setTimeout(function(){o()},u)}function pe(){this.g=!0}pe.prototype.xa=function(){this.g=!1};function qe(o,u,h,p,x,P){o.info(function(){if(o.g)if(P)for(var N="",he=P.split("&"),He=0;He<he.length;He++){var ae=he[He].split("=");if(1<ae.length){var Ke=ae[0];ae=ae[1];var Qe=Ke.split("_");N=2<=Qe.length&&Qe[1]=="type"?N+(Ke+"="+ae+"&"):N+(Ke+"=redacted&")}}else N=null;else N=P;return"XMLHTTP REQ ("+p+") [attempt "+x+"]: "+u+`
`+h+`
`+N})}function st(o,u,h,p,x,P,N){o.info(function(){return"XMLHTTP RESP ("+p+") [ attempt "+x+"]: "+u+`
`+h+`
`+P+" "+N})}function me(o,u,h,p){o.info(function(){return"XMLHTTP TEXT ("+u+"): "+fs(o,h)+(p?" "+p:"")})}function nr(o,u){o.info(function(){return"TIMEOUT: "+u})}pe.prototype.info=function(){};function fs(o,u){if(!o.g)return u;if(!u)return null;try{var h=JSON.parse(u);if(h){for(o=0;o<h.length;o++)if(Array.isArray(h[o])){var p=h[o];if(!(2>p.length)){var x=p[1];if(Array.isArray(x)&&!(1>x.length)){var P=x[0];if(P!="noop"&&P!="stop"&&P!="close")for(var N=1;N<x.length;N++)x[N]=""}}}}return xr(h)}catch{return u}}var ps={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},gc={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},ta;function yi(){}S(yi,ds),yi.prototype.g=function(){return new XMLHttpRequest},yi.prototype.i=function(){return{}},ta=new yi;function In(o,u,h,p){this.j=o,this.i=u,this.l=h,this.R=p||1,this.U=new Fe(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new yc}function yc(){this.i=null,this.g="",this.h=!1}var vc={},na={};function ra(o,u,h){o.L=1,o.v=bi(nn(u)),o.m=h,o.P=!0,wc(o,null)}function wc(o,u){o.F=Date.now(),vi(o),o.A=nn(o.v);var h=o.A,p=o.R;Array.isArray(p)||(p=[String(p)]),Dc(h.i,"t",p),o.C=0,h=o.j.J,o.h=new yc,o.g=Jc(o.j,h?u:null,!o.m),0<o.O&&(o.M=new wt(g(o.Y,o,o.g),o.O)),u=o.U,h=o.g,p=o.ca;var x="readystatechange";Array.isArray(x)||(x&&(_t[0]=x.toString()),x=_t);for(var P=0;P<x.length;P++){var N=Tn(h,x[P],p||u.handleEvent,!1,u.h||u);if(!N)break;u.g[N.key]=N}u=o.H?v(o.H):{},o.m?(o.u||(o.u="POST"),u["Content-Type"]="application/x-www-form-urlencoded",o.g.ea(o.A,o.u,o.m,u)):(o.u="GET",o.g.ea(o.A,o.u,null,u)),Ae(),qe(o.i,o.u,o.A,o.l,o.R,o.m)}In.prototype.ca=function(o){o=o.target;const u=this.M;u&&rn(o)==3?u.j():this.Y(o)},In.prototype.Y=function(o){try{if(o==this.g)e:{const Qe=rn(this.g);var u=this.g.Ba();const Dr=this.g.Z();if(!(3>Qe)&&(Qe!=3||this.g&&(this.h.h||this.g.oa()||$c(this.g)))){this.J||Qe!=4||u==7||(u==8||0>=Dr?Ae(3):Ae(2)),sa(this);var h=this.g.Z();this.X=h;t:if(_c(this)){var p=$c(this.g);o="";var x=p.length,P=rn(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){rr(this),ms(this);var N="";break t}this.h.i=new l.TextDecoder}for(u=0;u<x;u++)this.h.h=!0,o+=this.h.i.decode(p[u],{stream:!(P&&u==x-1)});p.length=0,this.h.g+=o,this.C=0,N=this.h.g}else N=this.g.oa();if(this.o=h==200,st(this.i,this.u,this.A,this.l,this.R,Qe,h),this.o){if(this.T&&!this.K){t:{if(this.g){var he,He=this.g;if((he=He.g?He.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!M(he)){var ae=he;break t}}ae=null}if(h=ae)me(this.i,this.l,h,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,ia(this,h);else{this.o=!1,this.s=3,ye(12),rr(this),ms(this);break e}}if(this.P){h=!0;let Ct;for(;!this.J&&this.C<N.length;)if(Ct=Vp(this,N),Ct==na){Qe==4&&(this.s=4,ye(14),h=!1),me(this.i,this.l,null,"[Incomplete Response]");break}else if(Ct==vc){this.s=4,ye(15),me(this.i,this.l,N,"[Invalid Chunk]"),h=!1;break}else me(this.i,this.l,Ct,null),ia(this,Ct);if(_c(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),Qe!=4||N.length!=0||this.h.h||(this.s=1,ye(16),h=!1),this.o=this.o&&h,!h)me(this.i,this.l,N,"[Invalid Chunked Response]"),rr(this),ms(this);else if(0<N.length&&!this.W){this.W=!0;var Ke=this.j;Ke.g==this&&Ke.ba&&!Ke.M&&(Ke.j.info("Great, no buffering proxy detected. Bytes received: "+N.length),da(Ke),Ke.M=!0,ye(11))}}else me(this.i,this.l,N,null),ia(this,N);Qe==4&&rr(this),this.o&&!this.J&&(Qe==4?Wc(this.j,this):(this.o=!1,vi(this)))}else tm(this.g),h==400&&0<N.indexOf("Unknown SID")?(this.s=3,ye(12)):(this.s=0,ye(13)),rr(this),ms(this)}}}catch{}finally{}};function _c(o){return o.g?o.u=="GET"&&o.L!=2&&o.j.Ca:!1}function Vp(o,u){var h=o.C,p=u.indexOf(`
`,h);return p==-1?na:(h=Number(u.substring(h,p)),isNaN(h)?vc:(p+=1,p+h>u.length?na:(u=u.slice(p,p+h),o.C=p+h,u)))}In.prototype.cancel=function(){this.J=!0,rr(this)};function vi(o){o.S=Date.now()+o.I,bc(o,o.I)}function bc(o,u){if(o.B!=null)throw Error("WatchDog timer not null");o.B=rt(g(o.ba,o),u)}function sa(o){o.B&&(l.clearTimeout(o.B),o.B=null)}In.prototype.ba=function(){this.B=null;const o=Date.now();0<=o-this.S?(nr(this.i,this.A),this.L!=2&&(Ae(),ye(17)),rr(this),this.s=2,ms(this)):bc(this,this.S-o)};function ms(o){o.j.G==0||o.J||Wc(o.j,o)}function rr(o){sa(o);var u=o.M;u&&typeof u.ma=="function"&&u.ma(),o.M=null,Pt(o.U),o.g&&(u=o.g,o.g=null,u.abort(),u.ma())}function ia(o,u){try{var h=o.j;if(h.G!=0&&(h.g==o||oa(h.h,o))){if(!o.K&&oa(h.h,o)&&h.G==3){try{var p=h.Da.g.parse(u)}catch{p=null}if(Array.isArray(p)&&p.length==3){var x=p;if(x[0]==0){e:if(!h.u){if(h.g)if(h.g.F+3e3<o.F)xi(h),Si(h);else break e;ua(h),ye(18)}}else h.za=x[1],0<h.za-h.T&&37500>x[2]&&h.F&&h.v==0&&!h.C&&(h.C=rt(g(h.Za,h),6e3));if(1>=Ic(h.h)&&h.ca){try{h.ca()}catch{}h.ca=void 0}}else ir(h,11)}else if((o.K||h.g==o)&&xi(h),!M(u))for(x=h.Da.g.parse(u),u=0;u<x.length;u++){let ae=x[u];if(h.T=ae[0],ae=ae[1],h.G==2)if(ae[0]=="c"){h.K=ae[1],h.ia=ae[2];const Ke=ae[3];Ke!=null&&(h.la=Ke,h.j.info("VER="+h.la));const Qe=ae[4];Qe!=null&&(h.Aa=Qe,h.j.info("SVER="+h.Aa));const Dr=ae[5];Dr!=null&&typeof Dr=="number"&&0<Dr&&(p=1.5*Dr,h.L=p,h.j.info("backChannelRequestTimeoutMs_="+p)),p=h;const Ct=o.g;if(Ct){const Pi=Ct.g?Ct.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Pi){var P=p.h;P.g||Pi.indexOf("spdy")==-1&&Pi.indexOf("quic")==-1&&Pi.indexOf("h2")==-1||(P.j=P.l,P.g=new Set,P.h&&(aa(P,P.h),P.h=null))}if(p.D){const ha=Ct.g?Ct.g.getResponseHeader("X-HTTP-Session-Id"):null;ha&&(p.ya=ha,ve(p.I,p.D,ha))}}h.G=3,h.l&&h.l.ua(),h.ba&&(h.R=Date.now()-o.F,h.j.info("Handshake RTT: "+h.R+"ms")),p=h;var N=o;if(p.qa=Qc(p,p.J?p.ia:null,p.W),N.K){Sc(p.h,N);var he=N,He=p.L;He&&(he.I=He),he.B&&(sa(he),vi(he)),p.g=N}else jc(p);0<h.i.length&&Ai(h)}else ae[0]!="stop"&&ae[0]!="close"||ir(h,7);else h.G==3&&(ae[0]=="stop"||ae[0]=="close"?ae[0]=="stop"?ir(h,7):ca(h):ae[0]!="noop"&&h.l&&h.l.ta(ae),h.v=0)}}Ae(4)}catch{}}var Fp=class{constructor(o,u){this.g=o,this.map=u}};function Ec(o){this.l=o||10,l.PerformanceNavigationTiming?(o=l.performance.getEntriesByType("navigation"),o=0<o.length&&(o[0].nextHopProtocol=="hq"||o[0].nextHopProtocol=="h2")):o=!!(l.chrome&&l.chrome.loadTimes&&l.chrome.loadTimes()&&l.chrome.loadTimes().wasFetchedViaSpdy),this.j=o?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function Tc(o){return o.h?!0:o.g?o.g.size>=o.j:!1}function Ic(o){return o.h?1:o.g?o.g.size:0}function oa(o,u){return o.h?o.h==u:o.g?o.g.has(u):!1}function aa(o,u){o.g?o.g.add(u):o.h=u}function Sc(o,u){o.h&&o.h==u?o.h=null:o.g&&o.g.has(u)&&o.g.delete(u)}Ec.prototype.cancel=function(){if(this.i=Ac(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const o of this.g.values())o.cancel();this.g.clear()}};function Ac(o){if(o.h!=null)return o.i.concat(o.h.D);if(o.g!=null&&o.g.size!==0){let u=o.i;for(const h of o.g.values())u=u.concat(h.D);return u}return I(o.i)}function $p(o){if(o.V&&typeof o.V=="function")return o.V();if(typeof Map<"u"&&o instanceof Map||typeof Set<"u"&&o instanceof Set)return Array.from(o.values());if(typeof o=="string")return o.split("");if(c(o)){for(var u=[],h=o.length,p=0;p<h;p++)u.push(o[p]);return u}u=[],h=0;for(p in o)u[h++]=o[p];return u}function zp(o){if(o.na&&typeof o.na=="function")return o.na();if(!o.V||typeof o.V!="function"){if(typeof Map<"u"&&o instanceof Map)return Array.from(o.keys());if(!(typeof Set<"u"&&o instanceof Set)){if(c(o)||typeof o=="string"){var u=[];o=o.length;for(var h=0;h<o;h++)u.push(h);return u}u=[],h=0;for(const p in o)u[h++]=p;return u}}}function xc(o,u){if(o.forEach&&typeof o.forEach=="function")o.forEach(u,void 0);else if(c(o)||typeof o=="string")Array.prototype.forEach.call(o,u,void 0);else for(var h=zp(o),p=$p(o),x=p.length,P=0;P<x;P++)u.call(void 0,p[P],h&&h[P],o)}var Rc=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Up(o,u){if(o){o=o.split("&");for(var h=0;h<o.length;h++){var p=o[h].indexOf("="),x=null;if(0<=p){var P=o[h].substring(0,p);x=o[h].substring(p+1)}else P=o[h];u(P,x?decodeURIComponent(x.replace(/\+/g," ")):"")}}}function sr(o){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,o instanceof sr){this.h=o.h,wi(this,o.j),this.o=o.o,this.g=o.g,_i(this,o.s),this.l=o.l;var u=o.i,h=new vs;h.i=u.i,u.g&&(h.g=new Map(u.g),h.h=u.h),Pc(this,h),this.m=o.m}else o&&(u=String(o).match(Rc))?(this.h=!1,wi(this,u[1]||"",!0),this.o=gs(u[2]||""),this.g=gs(u[3]||"",!0),_i(this,u[4]),this.l=gs(u[5]||"",!0),Pc(this,u[6]||"",!0),this.m=gs(u[7]||"")):(this.h=!1,this.i=new vs(null,this.h))}sr.prototype.toString=function(){var o=[],u=this.j;u&&o.push(ys(u,Cc,!0),":");var h=this.g;return(h||u=="file")&&(o.push("//"),(u=this.o)&&o.push(ys(u,Cc,!0),"@"),o.push(encodeURIComponent(String(h)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),h=this.s,h!=null&&o.push(":",String(h))),(h=this.l)&&(this.g&&h.charAt(0)!="/"&&o.push("/"),o.push(ys(h,h.charAt(0)=="/"?jp:Hp,!0))),(h=this.i.toString())&&o.push("?",h),(h=this.m)&&o.push("#",ys(h,Wp)),o.join("")};function nn(o){return new sr(o)}function wi(o,u,h){o.j=h?gs(u,!0):u,o.j&&(o.j=o.j.replace(/:$/,""))}function _i(o,u){if(u){if(u=Number(u),isNaN(u)||0>u)throw Error("Bad port number "+u);o.s=u}else o.s=null}function Pc(o,u,h){u instanceof vs?(o.i=u,Gp(o.i,o.h)):(h||(u=ys(u,Yp)),o.i=new vs(u,o.h))}function ve(o,u,h){o.i.set(u,h)}function bi(o){return ve(o,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),o}function gs(o,u){return o?u?decodeURI(o.replace(/%25/g,"%2525")):decodeURIComponent(o):""}function ys(o,u,h){return typeof o=="string"?(o=encodeURI(o).replace(u,qp),h&&(o=o.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),o):null}function qp(o){return o=o.charCodeAt(0),"%"+(o>>4&15).toString(16)+(o&15).toString(16)}var Cc=/[#\/\?@]/g,Hp=/[#\?:]/g,jp=/[#\?]/g,Yp=/[#\?@]/g,Wp=/#/g;function vs(o,u){this.h=this.g=null,this.i=o||null,this.j=!!u}function Sn(o){o.g||(o.g=new Map,o.h=0,o.i&&Up(o.i,function(u,h){o.add(decodeURIComponent(u.replace(/\+/g," ")),h)}))}n=vs.prototype,n.add=function(o,u){Sn(this),this.i=null,o=kr(this,o);var h=this.g.get(o);return h||this.g.set(o,h=[]),h.push(u),this.h+=1,this};function kc(o,u){Sn(o),u=kr(o,u),o.g.has(u)&&(o.i=null,o.h-=o.g.get(u).length,o.g.delete(u))}function Mc(o,u){return Sn(o),u=kr(o,u),o.g.has(u)}n.forEach=function(o,u){Sn(this),this.g.forEach(function(h,p){h.forEach(function(x){o.call(u,x,p,this)},this)},this)},n.na=function(){Sn(this);const o=Array.from(this.g.values()),u=Array.from(this.g.keys()),h=[];for(let p=0;p<u.length;p++){const x=o[p];for(let P=0;P<x.length;P++)h.push(u[p])}return h},n.V=function(o){Sn(this);let u=[];if(typeof o=="string")Mc(this,o)&&(u=u.concat(this.g.get(kr(this,o))));else{o=Array.from(this.g.values());for(let h=0;h<o.length;h++)u=u.concat(o[h])}return u},n.set=function(o,u){return Sn(this),this.i=null,o=kr(this,o),Mc(this,o)&&(this.h-=this.g.get(o).length),this.g.set(o,[u]),this.h+=1,this},n.get=function(o,u){return o?(o=this.V(o),0<o.length?String(o[0]):u):u};function Dc(o,u,h){kc(o,u),0<h.length&&(o.i=null,o.g.set(kr(o,u),I(h)),o.h+=h.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const o=[],u=Array.from(this.g.keys());for(var h=0;h<u.length;h++){var p=u[h];const P=encodeURIComponent(String(p)),N=this.V(p);for(p=0;p<N.length;p++){var x=P;N[p]!==""&&(x+="="+encodeURIComponent(String(N[p]))),o.push(x)}}return this.i=o.join("&")};function kr(o,u){return u=String(u),o.j&&(u=u.toLowerCase()),u}function Gp(o,u){u&&!o.j&&(Sn(o),o.i=null,o.g.forEach(function(h,p){var x=p.toLowerCase();p!=x&&(kc(this,p),Dc(this,x,h))},o)),o.j=u}function Kp(o,u){const h=new pe;if(l.Image){const p=new Image;p.onload=b(An,h,"TestLoadImage: loaded",!0,u,p),p.onerror=b(An,h,"TestLoadImage: error",!1,u,p),p.onabort=b(An,h,"TestLoadImage: abort",!1,u,p),p.ontimeout=b(An,h,"TestLoadImage: timeout",!1,u,p),l.setTimeout(function(){p.ontimeout&&p.ontimeout()},1e4),p.src=o}else u(!1)}function Qp(o,u){const h=new pe,p=new AbortController,x=setTimeout(()=>{p.abort(),An(h,"TestPingServer: timeout",!1,u)},1e4);fetch(o,{signal:p.signal}).then(P=>{clearTimeout(x),P.ok?An(h,"TestPingServer: ok",!0,u):An(h,"TestPingServer: server error",!1,u)}).catch(()=>{clearTimeout(x),An(h,"TestPingServer: error",!1,u)})}function An(o,u,h,p,x){try{x&&(x.onload=null,x.onerror=null,x.onabort=null,x.ontimeout=null),p(h)}catch{}}function Jp(){this.g=new ea}function Xp(o,u,h){const p=h||"";try{xc(o,function(x,P){let N=x;d(x)&&(N=xr(x)),u.push(p+P+"="+encodeURIComponent(N))})}catch(x){throw u.push(p+"type="+encodeURIComponent("_badmap")),x}}function Ei(o){this.l=o.Ub||null,this.j=o.eb||!1}S(Ei,ds),Ei.prototype.g=function(){return new Ti(this.l,this.j)},Ei.prototype.i=function(o){return function(){return o}}({});function Ti(o,u){be.call(this),this.D=o,this.o=u,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}S(Ti,be),n=Ti.prototype,n.open=function(o,u){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=o,this.A=u,this.readyState=1,_s(this)},n.send=function(o){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const u={headers:this.u,method:this.B,credentials:this.m,cache:void 0};o&&(u.body=o),(this.D||l).fetch(new Request(this.A,u)).then(this.Sa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,ws(this)),this.readyState=0},n.Sa=function(o){if(this.g&&(this.l=o,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=o.headers,this.readyState=2,_s(this)),this.g&&(this.readyState=3,_s(this),this.g)))if(this.responseType==="arraybuffer")o.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof l.ReadableStream<"u"&&"body"in o){if(this.j=o.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;Nc(this)}else o.text().then(this.Ra.bind(this),this.ga.bind(this))};function Nc(o){o.j.read().then(o.Pa.bind(o)).catch(o.ga.bind(o))}n.Pa=function(o){if(this.g){if(this.o&&o.value)this.response.push(o.value);else if(!this.o){var u=o.value?o.value:new Uint8Array(0);(u=this.v.decode(u,{stream:!o.done}))&&(this.response=this.responseText+=u)}o.done?ws(this):_s(this),this.readyState==3&&Nc(this)}},n.Ra=function(o){this.g&&(this.response=this.responseText=o,ws(this))},n.Qa=function(o){this.g&&(this.response=o,ws(this))},n.ga=function(){this.g&&ws(this)};function ws(o){o.readyState=4,o.l=null,o.j=null,o.v=null,_s(o)}n.setRequestHeader=function(o,u){this.u.append(o,u)},n.getResponseHeader=function(o){return this.h&&this.h.get(o.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const o=[],u=this.h.entries();for(var h=u.next();!h.done;)h=h.value,o.push(h[0]+": "+h[1]),h=u.next();return o.join(`\r
`)};function _s(o){o.onreadystatechange&&o.onreadystatechange.call(o)}Object.defineProperty(Ti.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(o){this.m=o?"include":"same-origin"}});function Lc(o){let u="";return H(o,function(h,p){u+=p,u+=":",u+=h,u+=`\r
`}),u}function la(o,u,h){e:{for(p in h){var p=!1;break e}p=!0}p||(h=Lc(h),typeof o=="string"?h!=null&&encodeURIComponent(String(h)):ve(o,u,h))}function xe(o){be.call(this),this.headers=new Map,this.o=o||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}S(xe,be);var Zp=/^https?$/i,em=["POST","PUT"];n=xe.prototype,n.Ha=function(o){this.J=o},n.ea=function(o,u,h,p){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+o);u=u?u.toUpperCase():"GET",this.D=o,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():ta.g(),this.v=this.o?gi(this.o):gi(ta),this.g.onreadystatechange=g(this.Ea,this);try{this.B=!0,this.g.open(u,String(o),!0),this.B=!1}catch(P){Oc(this,P);return}if(o=h||"",h=new Map(this.headers),p)if(Object.getPrototypeOf(p)===Object.prototype)for(var x in p)h.set(x,p[x]);else if(typeof p.keys=="function"&&typeof p.get=="function")for(const P of p.keys())h.set(P,p.get(P));else throw Error("Unknown input type for opt_headers: "+String(p));p=Array.from(h.keys()).find(P=>P.toLowerCase()=="content-type"),x=l.FormData&&o instanceof l.FormData,!(0<=Array.prototype.indexOf.call(em,u,void 0))||p||x||h.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[P,N]of h)this.g.setRequestHeader(P,N);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{Fc(this),this.u=!0,this.g.send(o),this.u=!1}catch(P){Oc(this,P)}};function Oc(o,u){o.h=!1,o.g&&(o.j=!0,o.g.abort(),o.j=!1),o.l=u,o.m=5,Bc(o),Ii(o)}function Bc(o){o.A||(o.A=!0,Ee(o,"complete"),Ee(o,"error"))}n.abort=function(o){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=o||7,Ee(this,"complete"),Ee(this,"abort"),Ii(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Ii(this,!0)),xe.aa.N.call(this)},n.Ea=function(){this.s||(this.B||this.u||this.j?Vc(this):this.bb())},n.bb=function(){Vc(this)};function Vc(o){if(o.h&&typeof a<"u"&&(!o.v[1]||rn(o)!=4||o.Z()!=2)){if(o.u&&rn(o)==4)pt(o.Ea,0,o);else if(Ee(o,"readystatechange"),rn(o)==4){o.h=!1;try{const N=o.Z();e:switch(N){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var u=!0;break e;default:u=!1}var h;if(!(h=u)){var p;if(p=N===0){var x=String(o.D).match(Rc)[1]||null;!x&&l.self&&l.self.location&&(x=l.self.location.protocol.slice(0,-1)),p=!Zp.test(x?x.toLowerCase():"")}h=p}if(h)Ee(o,"complete"),Ee(o,"success");else{o.m=6;try{var P=2<rn(o)?o.g.statusText:""}catch{P=""}o.l=P+" ["+o.Z()+"]",Bc(o)}}finally{Ii(o)}}}}function Ii(o,u){if(o.g){Fc(o);const h=o.g,p=o.v[0]?()=>{}:null;o.g=null,o.v=null,u||Ee(o,"ready");try{h.onreadystatechange=p}catch{}}}function Fc(o){o.I&&(l.clearTimeout(o.I),o.I=null)}n.isActive=function(){return!!this.g};function rn(o){return o.g?o.g.readyState:0}n.Z=function(){try{return 2<rn(this)?this.g.status:-1}catch{return-1}},n.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.Oa=function(o){if(this.g){var u=this.g.responseText;return o&&u.indexOf(o)==0&&(u=u.substring(o.length)),Zo(u)}};function $c(o){try{if(!o.g)return null;if("response"in o.g)return o.g.response;switch(o.H){case"":case"text":return o.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in o.g)return o.g.mozResponseArrayBuffer}return null}catch{return null}}function tm(o){const u={};o=(o.g&&2<=rn(o)&&o.g.getAllResponseHeaders()||"").split(`\r
`);for(let p=0;p<o.length;p++){if(M(o[p]))continue;var h=E(o[p]);const x=h[0];if(h=h[1],typeof h!="string")continue;h=h.trim();const P=u[x]||[];u[x]=P,P.push(h)}T(u,function(p){return p.join(", ")})}n.Ba=function(){return this.m},n.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function bs(o,u,h){return h&&h.internalChannelParams&&h.internalChannelParams[o]||u}function zc(o){this.Aa=0,this.i=[],this.j=new pe,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=bs("failFast",!1,o),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=bs("baseRetryDelayMs",5e3,o),this.cb=bs("retryDelaySeedMs",1e4,o),this.Wa=bs("forwardChannelMaxRetries",2,o),this.wa=bs("forwardChannelRequestTimeoutMs",2e4,o),this.pa=o&&o.xmlHttpFactory||void 0,this.Xa=o&&o.Tb||void 0,this.Ca=o&&o.useFetchStreams||!1,this.L=void 0,this.J=o&&o.supportsCrossDomainXhr||!1,this.K="",this.h=new Ec(o&&o.concurrentRequestLimit),this.Da=new Jp,this.P=o&&o.fastHandshake||!1,this.O=o&&o.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=o&&o.Rb||!1,o&&o.xa&&this.j.xa(),o&&o.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&o&&o.detectBufferingProxy||!1,this.ja=void 0,o&&o.longPollingTimeout&&0<o.longPollingTimeout&&(this.ja=o.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}n=zc.prototype,n.la=8,n.G=1,n.connect=function(o,u,h,p){ye(0),this.W=o,this.H=u||{},h&&p!==void 0&&(this.H.OSID=h,this.H.OAID=p),this.F=this.X,this.I=Qc(this,null,this.W),Ai(this)};function ca(o){if(Uc(o),o.G==3){var u=o.U++,h=nn(o.I);if(ve(h,"SID",o.K),ve(h,"RID",u),ve(h,"TYPE","terminate"),Es(o,h),u=new In(o,o.j,u),u.L=2,u.v=bi(nn(h)),h=!1,l.navigator&&l.navigator.sendBeacon)try{h=l.navigator.sendBeacon(u.v.toString(),"")}catch{}!h&&l.Image&&(new Image().src=u.v,h=!0),h||(u.g=Jc(u.j,null),u.g.ea(u.v)),u.F=Date.now(),vi(u)}Kc(o)}function Si(o){o.g&&(da(o),o.g.cancel(),o.g=null)}function Uc(o){Si(o),o.u&&(l.clearTimeout(o.u),o.u=null),xi(o),o.h.cancel(),o.s&&(typeof o.s=="number"&&l.clearTimeout(o.s),o.s=null)}function Ai(o){if(!Tc(o.h)&&!o.s){o.s=!0;var u=o.Ga;Z||fe(),oe||(Z(),oe=!0),Ue.add(u,o),o.B=0}}function nm(o,u){return Ic(o.h)>=o.h.j-(o.s?1:0)?!1:o.s?(o.i=u.D.concat(o.i),!0):o.G==1||o.G==2||o.B>=(o.Va?0:o.Wa)?!1:(o.s=rt(g(o.Ga,o,u),Gc(o,o.B)),o.B++,!0)}n.Ga=function(o){if(this.s)if(this.s=null,this.G==1){if(!o){this.U=Math.floor(1e5*Math.random()),o=this.U++;const x=new In(this,this.j,o);let P=this.o;if(this.S&&(P?(P=v(P),_(P,this.S)):P=this.S),this.m!==null||this.O||(x.H=P,P=null),this.P)e:{for(var u=0,h=0;h<this.i.length;h++){t:{var p=this.i[h];if("__data__"in p.map&&(p=p.map.__data__,typeof p=="string")){p=p.length;break t}p=void 0}if(p===void 0)break;if(u+=p,4096<u){u=h;break e}if(u===4096||h===this.i.length-1){u=h+1;break e}}u=1e3}else u=1e3;u=Hc(this,x,u),h=nn(this.I),ve(h,"RID",o),ve(h,"CVER",22),this.D&&ve(h,"X-HTTP-Session-Id",this.D),Es(this,h),P&&(this.O?u="headers="+encodeURIComponent(String(Lc(P)))+"&"+u:this.m&&la(h,this.m,P)),aa(this.h,x),this.Ua&&ve(h,"TYPE","init"),this.P?(ve(h,"$req",u),ve(h,"SID","null"),x.T=!0,ra(x,h,null)):ra(x,h,u),this.G=2}}else this.G==3&&(o?qc(this,o):this.i.length==0||Tc(this.h)||qc(this))};function qc(o,u){var h;u?h=u.l:h=o.U++;const p=nn(o.I);ve(p,"SID",o.K),ve(p,"RID",h),ve(p,"AID",o.T),Es(o,p),o.m&&o.o&&la(p,o.m,o.o),h=new In(o,o.j,h,o.B+1),o.m===null&&(h.H=o.o),u&&(o.i=u.D.concat(o.i)),u=Hc(o,h,1e3),h.I=Math.round(.5*o.wa)+Math.round(.5*o.wa*Math.random()),aa(o.h,h),ra(h,p,u)}function Es(o,u){o.H&&H(o.H,function(h,p){ve(u,p,h)}),o.l&&xc({},function(h,p){ve(u,p,h)})}function Hc(o,u,h){h=Math.min(o.i.length,h);var p=o.l?g(o.l.Na,o.l,o):null;e:{var x=o.i;let P=-1;for(;;){const N=["count="+h];P==-1?0<h?(P=x[0].g,N.push("ofs="+P)):P=0:N.push("ofs="+P);let he=!0;for(let He=0;He<h;He++){let ae=x[He].g;const Ke=x[He].map;if(ae-=P,0>ae)P=Math.max(0,x[He].g-100),he=!1;else try{Xp(Ke,N,"req"+ae+"_")}catch{p&&p(Ke)}}if(he){p=N.join("&");break e}}}return o=o.i.splice(0,h),u.D=o,p}function jc(o){if(!o.g&&!o.u){o.Y=1;var u=o.Fa;Z||fe(),oe||(Z(),oe=!0),Ue.add(u,o),o.v=0}}function ua(o){return o.g||o.u||3<=o.v?!1:(o.Y++,o.u=rt(g(o.Fa,o),Gc(o,o.v)),o.v++,!0)}n.Fa=function(){if(this.u=null,Yc(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var o=2*this.R;this.j.info("BP detection timer enabled: "+o),this.A=rt(g(this.ab,this),o)}},n.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,ye(10),Si(this),Yc(this))};function da(o){o.A!=null&&(l.clearTimeout(o.A),o.A=null)}function Yc(o){o.g=new In(o,o.j,"rpc",o.Y),o.m===null&&(o.g.H=o.o),o.g.O=0;var u=nn(o.qa);ve(u,"RID","rpc"),ve(u,"SID",o.K),ve(u,"AID",o.T),ve(u,"CI",o.F?"0":"1"),!o.F&&o.ja&&ve(u,"TO",o.ja),ve(u,"TYPE","xmlhttp"),Es(o,u),o.m&&o.o&&la(u,o.m,o.o),o.L&&(o.g.I=o.L);var h=o.g;o=o.ia,h.L=1,h.v=bi(nn(u)),h.m=null,h.P=!0,wc(h,o)}n.Za=function(){this.C!=null&&(this.C=null,Si(this),ua(this),ye(19))};function xi(o){o.C!=null&&(l.clearTimeout(o.C),o.C=null)}function Wc(o,u){var h=null;if(o.g==u){xi(o),da(o),o.g=null;var p=2}else if(oa(o.h,u))h=u.D,Sc(o.h,u),p=1;else return;if(o.G!=0){if(u.o)if(p==1){h=u.m?u.m.length:0,u=Date.now()-u.F;var x=o.B;p=ee(),Ee(p,new Pe(p,h)),Ai(o)}else jc(o);else if(x=u.s,x==3||x==0&&0<u.X||!(p==1&&nm(o,u)||p==2&&ua(o)))switch(h&&0<h.length&&(u=o.h,u.i=u.i.concat(h)),x){case 1:ir(o,5);break;case 4:ir(o,10);break;case 3:ir(o,6);break;default:ir(o,2)}}}function Gc(o,u){let h=o.Ta+Math.floor(Math.random()*o.cb);return o.isActive()||(h*=2),h*u}function ir(o,u){if(o.j.info("Error code "+u),u==2){var h=g(o.fb,o),p=o.Xa;const x=!p;p=new sr(p||"//www.google.com/images/cleardot.gif"),l.location&&l.location.protocol=="http"||wi(p,"https"),bi(p),x?Kp(p.toString(),h):Qp(p.toString(),h)}else ye(2);o.G=0,o.l&&o.l.sa(u),Kc(o),Uc(o)}n.fb=function(o){o?(this.j.info("Successfully pinged google.com"),ye(2)):(this.j.info("Failed to ping google.com"),ye(1))};function Kc(o){if(o.G=0,o.ka=[],o.l){const u=Ac(o.h);(u.length!=0||o.i.length!=0)&&(R(o.ka,u),R(o.ka,o.i),o.h.i.length=0,I(o.i),o.i.length=0),o.l.ra()}}function Qc(o,u,h){var p=h instanceof sr?nn(h):new sr(h);if(p.g!="")u&&(p.g=u+"."+p.g),_i(p,p.s);else{var x=l.location;p=x.protocol,u=u?u+"."+x.hostname:x.hostname,x=+x.port;var P=new sr(null);p&&wi(P,p),u&&(P.g=u),x&&_i(P,x),h&&(P.l=h),p=P}return h=o.D,u=o.ya,h&&u&&ve(p,h,u),ve(p,"VER",o.la),Es(o,p),p}function Jc(o,u,h){if(u&&!o.J)throw Error("Can't create secondary domain capable XhrIo object.");return u=o.Ca&&!o.pa?new xe(new Ei({eb:h})):new xe(o.pa),u.Ha(o.J),u}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function Xc(){}n=Xc.prototype,n.ua=function(){},n.ta=function(){},n.sa=function(){},n.ra=function(){},n.isActive=function(){return!0},n.Na=function(){};function Ri(){}Ri.prototype.g=function(o,u){return new mt(o,u)};function mt(o,u){be.call(this),this.g=new zc(u),this.l=o,this.h=u&&u.messageUrlParams||null,o=u&&u.messageHeaders||null,u&&u.clientProtocolHeaderRequired&&(o?o["X-Client-Protocol"]="webchannel":o={"X-Client-Protocol":"webchannel"}),this.g.o=o,o=u&&u.initMessageHeaders||null,u&&u.messageContentType&&(o?o["X-WebChannel-Content-Type"]=u.messageContentType:o={"X-WebChannel-Content-Type":u.messageContentType}),u&&u.va&&(o?o["X-WebChannel-Client-Profile"]=u.va:o={"X-WebChannel-Client-Profile":u.va}),this.g.S=o,(o=u&&u.Sb)&&!M(o)&&(this.g.m=o),this.v=u&&u.supportsCrossDomainXhr||!1,this.u=u&&u.sendRawJson||!1,(u=u&&u.httpSessionIdParam)&&!M(u)&&(this.g.D=u,o=this.h,o!==null&&u in o&&(o=this.h,u in o&&delete o[u])),this.j=new Mr(this)}S(mt,be),mt.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},mt.prototype.close=function(){ca(this.g)},mt.prototype.o=function(o){var u=this.g;if(typeof o=="string"){var h={};h.__data__=o,o=h}else this.u&&(h={},h.__data__=xr(o),o=h);u.i.push(new Fp(u.Ya++,o)),u.G==3&&Ai(u)},mt.prototype.N=function(){this.g.l=null,delete this.j,ca(this.g),delete this.g,mt.aa.N.call(this)};function Zc(o){Pr.call(this),o.__headers__&&(this.headers=o.__headers__,this.statusCode=o.__status__,delete o.__headers__,delete o.__status__);var u=o.__sm__;if(u){e:{for(const h in u){o=h;break e}o=void 0}(this.i=o)&&(o=this.i,u=u!==null&&o in u?u[o]:void 0),this.data=u}else this.data=o}S(Zc,Pr);function eu(){Cr.call(this),this.status=1}S(eu,Cr);function Mr(o){this.g=o}S(Mr,Xc),Mr.prototype.ua=function(){Ee(this.g,"a")},Mr.prototype.ta=function(o){Ee(this.g,new Zc(o))},Mr.prototype.sa=function(o){Ee(this.g,new eu)},Mr.prototype.ra=function(){Ee(this.g,"b")},Ri.prototype.createWebChannel=Ri.prototype.g,mt.prototype.send=mt.prototype.o,mt.prototype.open=mt.prototype.m,mt.prototype.close=mt.prototype.close,Ih=function(){return new Ri},Th=function(){return ee()},Eh=Ft,Fa={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},ps.NO_ERROR=0,ps.TIMEOUT=8,ps.HTTP_ERROR=6,$i=ps,gc.COMPLETE="complete",bh=gc,Rr.EventType=tr,tr.OPEN="a",tr.CLOSE="b",tr.ERROR="c",tr.MESSAGE="d",be.prototype.listen=be.prototype.K,Rs=Rr,xe.prototype.listenOnce=xe.prototype.L,xe.prototype.getLastError=xe.prototype.Ka,xe.prototype.getLastErrorCode=xe.prototype.Ba,xe.prototype.getStatus=xe.prototype.Z,xe.prototype.getResponseJson=xe.prototype.Oa,xe.prototype.getResponseText=xe.prototype.oa,xe.prototype.send=xe.prototype.ea,xe.prototype.setWithCredentials=xe.prototype.Ha,_h=xe}).apply(typeof Mi<"u"?Mi:typeof self<"u"?self:typeof window<"u"?window:{});const Du="@firebase/firestore";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xe{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Xe.UNAUTHENTICATED=new Xe(null),Xe.GOOGLE_CREDENTIALS=new Xe("google-credentials-uid"),Xe.FIRST_PARTY=new Xe("first-party-uid"),Xe.MOCK_USER=new Xe("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let os="10.14.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yr=new cl("@firebase/firestore");function Is(){return yr.logLevel}function z(n,...e){if(yr.logLevel<=se.DEBUG){const t=e.map(Tl);yr.debug(`Firestore (${os}): ${n}`,...t)}}function mn(n,...e){if(yr.logLevel<=se.ERROR){const t=e.map(Tl);yr.error(`Firestore (${os}): ${n}`,...t)}}function Kr(n,...e){if(yr.logLevel<=se.WARN){const t=e.map(Tl);yr.warn(`Firestore (${os}): ${n}`,...t)}}function Tl(n){if(typeof n=="string")return n;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
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
 */function W(n="Unexpected state"){const e=`FIRESTORE (${os}) INTERNAL ASSERTION FAILED: `+n;throw mn(e),new Error(e)}function ue(n,e){n||W()}function K(n,e){return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const k={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class U extends vn{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hn{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sh{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class y0{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(Xe.UNAUTHENTICATED))}shutdown(){}}class v0{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class w0{constructor(e){this.t=e,this.currentUser=Xe.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){ue(this.o===void 0);let r=this.i;const s=c=>this.i!==r?(r=this.i,t(c)):Promise.resolve();let i=new hn;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new hn,e.enqueueRetryable(()=>s(this.currentUser))};const a=()=>{const c=i;e.enqueueRetryable(async()=>{await c.promise,await s(this.currentUser)})},l=c=>{z("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=c,this.o&&(this.auth.addAuthTokenListener(this.o),a())};this.t.onInit(c=>l(c)),setTimeout(()=>{if(!this.auth){const c=this.t.getImmediate({optional:!0});c?l(c):(z("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new hn)}},0),a()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(r=>this.i!==e?(z("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(ue(typeof r.accessToken=="string"),new Sh(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return ue(e===null||typeof e=="string"),new Xe(e)}}class _0{constructor(e,t,r){this.l=e,this.h=t,this.P=r,this.type="FirstParty",this.user=Xe.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class b0{constructor(e,t,r){this.l=e,this.h=t,this.P=r}getToken(){return Promise.resolve(new _0(this.l,this.h,this.P))}start(e,t){e.enqueueRetryable(()=>t(Xe.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class E0{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class T0{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,t){ue(this.o===void 0);const r=i=>{i.error!=null&&z("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const a=i.token!==this.R;return this.R=i.token,z("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?t(i.token):Promise.resolve()};this.o=i=>{e.enqueueRetryable(()=>r(i))};const s=i=>{z("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(i=>s(i)),setTimeout(()=>{if(!this.appCheck){const i=this.A.getImmediate({optional:!0});i?s(i):z("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(t=>t?(ue(typeof t.token=="string"),this.R=t.token,new E0(t.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function I0(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let r=0;r<n;r++)t[r]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ah{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=Math.floor(256/e.length)*e.length;let r="";for(;r.length<20;){const s=I0(40);for(let i=0;i<s.length;++i)r.length<20&&s[i]<t&&(r+=e.charAt(s[i]%e.length))}return r}}function le(n,e){return n<e?-1:n>e?1:0}function Qr(n,e,t){return n.length===e.length&&n.every((r,s)=>t(r,e[s]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Be{constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new U(k.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new U(k.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<-62135596800)throw new U(k.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new U(k.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return Be.fromMillis(Date.now())}static fromDate(e){return Be.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),r=Math.floor(1e6*(e-1e3*t));return new Be(t,r)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?le(this.nanoseconds,e.nanoseconds):le(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class G{constructor(e){this.timestamp=e}static fromTimestamp(e){return new G(e)}static min(){return new G(new Be(0,0))}static max(){return new G(new Be(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qs{constructor(e,t,r){t===void 0?t=0:t>e.length&&W(),r===void 0?r=e.length-t:r>e.length-t&&W(),this.segments=e,this.offset=t,this.len=r}get length(){return this.len}isEqual(e){return qs.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof qs?e.forEach(r=>{t.push(r)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,r=this.limit();t<r;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const r=Math.min(e.length,t.length);for(let s=0;s<r;s++){const i=e.get(s),a=t.get(s);if(i<a)return-1;if(i>a)return 1}return e.length<t.length?-1:e.length>t.length?1:0}}class _e extends qs{construct(e,t,r){return new _e(e,t,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const r of e){if(r.indexOf("//")>=0)throw new U(k.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);t.push(...r.split("/").filter(s=>s.length>0))}return new _e(t)}static emptyPath(){return new _e([])}}const S0=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Ye extends qs{construct(e,t,r){return new Ye(e,t,r)}static isValidIdentifier(e){return S0.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Ye.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new Ye(["__name__"])}static fromServerFormat(e){const t=[];let r="",s=0;const i=()=>{if(r.length===0)throw new U(k.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(r),r=""};let a=!1;for(;s<e.length;){const l=e[s];if(l==="\\"){if(s+1===e.length)throw new U(k.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const c=e[s+1];if(c!=="\\"&&c!=="."&&c!=="`")throw new U(k.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=c,s+=2}else l==="`"?(a=!a,s++):l!=="."||a?(r+=l,s++):(i(),s++)}if(i(),a)throw new U(k.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new Ye(t)}static emptyPath(){return new Ye([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class q{constructor(e){this.path=e}static fromPath(e){return new q(_e.fromString(e))}static fromName(e){return new q(_e.fromString(e).popFirst(5))}static empty(){return new q(_e.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&_e.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return _e.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new q(new _e(e.slice()))}}function A0(n,e){const t=n.toTimestamp().seconds,r=n.toTimestamp().nanoseconds+1,s=G.fromTimestamp(r===1e9?new Be(t+1,0):new Be(t,r));return new qn(s,q.empty(),e)}function x0(n){return new qn(n.readTime,n.key,-1)}class qn{constructor(e,t,r){this.readTime=e,this.documentKey=t,this.largestBatchId=r}static min(){return new qn(G.min(),q.empty(),-1)}static max(){return new qn(G.max(),q.empty(),-1)}}function R0(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=q.comparator(n.documentKey,e.documentKey),t!==0?t:le(n.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const P0="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class C0{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function oi(n){if(n.code!==k.FAILED_PRECONDITION||n.message!==P0)throw n;z("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class D{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)},t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&W(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new D((r,s)=>{this.nextCallback=i=>{this.wrapSuccess(e,i).next(r,s)},this.catchCallback=i=>{this.wrapFailure(t,i).next(r,s)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{const t=e();return t instanceof D?t:D.resolve(t)}catch(t){return D.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):D.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):D.reject(t)}static resolve(e){return new D((t,r)=>{t(e)})}static reject(e){return new D((t,r)=>{r(e)})}static waitFor(e){return new D((t,r)=>{let s=0,i=0,a=!1;e.forEach(l=>{++s,l.next(()=>{++i,a&&i===s&&t()},c=>r(c))}),a=!0,i===s&&t()})}static or(e){let t=D.resolve(!1);for(const r of e)t=t.next(s=>s?D.resolve(s):r());return t}static forEach(e,t){const r=[];return e.forEach((s,i)=>{r.push(t.call(this,s,i))}),this.waitFor(r)}static mapArray(e,t){return new D((r,s)=>{const i=e.length,a=new Array(i);let l=0;for(let c=0;c<i;c++){const d=c;t(e[d]).next(f=>{a[d]=f,++l,l===i&&r(a)},f=>s(f))}})}static doWhile(e,t){return new D((r,s)=>{const i=()=>{e()===!0?t().next(()=>{i()},s):r()};i()})}}function k0(n){const e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function ai(n){return n.name==="IndexedDbTransactionError"}/**
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
 */class Il{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=r=>this.ie(r),this.se=r=>t.writeSequenceNumber(r))}ie(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.se&&this.se(e),e}}Il.oe=-1;function To(n){return n==null}function ro(n){return n===0&&1/n==-1/0}function M0(n){return typeof n=="number"&&Number.isInteger(n)&&!ro(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Nu(n){let e=0;for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function Er(n,e){for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function xh(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ie{constructor(e,t){this.comparator=e,this.root=t||je.EMPTY}insert(e,t){return new Ie(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,je.BLACK,null,null))}remove(e){return new Ie(this.comparator,this.root.remove(e,this.comparator).copy(null,null,je.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const r=this.comparator(e,t.key);if(r===0)return t.value;r<0?t=t.left:r>0&&(t=t.right)}return null}indexOf(e){let t=0,r=this.root;for(;!r.isEmpty();){const s=this.comparator(e,r.key);if(s===0)return t+r.left.size;s<0?r=r.left:(t+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,r)=>(e(t,r),!1))}toString(){const e=[];return this.inorderTraversal((t,r)=>(e.push(`${t}:${r}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Di(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Di(this.root,e,this.comparator,!1)}getReverseIterator(){return new Di(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Di(this.root,e,this.comparator,!0)}}class Di{constructor(e,t,r,s){this.isReverse=s,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?r(e.key,t):1,t&&s&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class je{constructor(e,t,r,s,i){this.key=e,this.value=t,this.color=r??je.RED,this.left=s??je.EMPTY,this.right=i??je.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,r,s,i){return new je(e??this.key,t??this.value,r??this.color,s??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,r){let s=this;const i=r(e,s.key);return s=i<0?s.copy(null,null,null,s.left.insert(e,t,r),null):i===0?s.copy(null,t,null,null,null):s.copy(null,null,null,null,s.right.insert(e,t,r)),s.fixUp()}removeMin(){if(this.left.isEmpty())return je.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let r,s=this;if(t(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),t(e,s.key)===0){if(s.right.isEmpty())return je.EMPTY;r=s.right.min(),s=s.copy(r.key,r.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,je.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,je.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw W();const e=this.left.check();if(e!==this.right.check())throw W();return e+(this.isRed()?0:1)}}je.EMPTY=null,je.RED=!0,je.BLACK=!1;je.EMPTY=new class{constructor(){this.size=0}get key(){throw W()}get value(){throw W()}get color(){throw W()}get left(){throw W()}get right(){throw W()}copy(e,t,r,s,i){return this}insert(e,t,r){return new je(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class We{constructor(e){this.comparator=e,this.data=new Ie(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,r)=>(e(t),!1))}forEachInRange(e,t){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const s=r.getNext();if(this.comparator(s.key,e[1])>=0)return;t(s.key)}}forEachWhile(e,t){let r;for(r=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Lu(this.data.getIterator())}getIteratorFrom(e){return new Lu(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(r=>{t=t.add(r)}),t}isEqual(e){if(!(e instanceof We)||this.size!==e.size)return!1;const t=this.data.getIterator(),r=e.data.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=r.getNext().key;if(this.comparator(s,i)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(t=>{e.push(t)}),e}toString(){const e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){const t=new We(this.comparator);return t.data=e,t}}class Lu{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gt{constructor(e){this.fields=e,e.sort(Ye.comparator)}static empty(){return new gt([])}unionWith(e){let t=new We(Ye.comparator);for(const r of this.fields)t=t.add(r);for(const r of e)t=t.add(r);return new gt(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Qr(this.fields,e.fields,(t,r)=>t.isEqual(r))}}/**
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
 */class Rh extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ge{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(s){try{return atob(s)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new Rh("Invalid base64 string: "+i):i}}(e);return new Ge(t)}static fromUint8Array(e){const t=function(s){let i="";for(let a=0;a<s.length;++a)i+=String.fromCharCode(s[a]);return i}(e);return new Ge(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(t){return btoa(t)}(this.binaryString)}toUint8Array(){return function(t){const r=new Uint8Array(t.length);for(let s=0;s<t.length;s++)r[s]=t.charCodeAt(s);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return le(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}Ge.EMPTY_BYTE_STRING=new Ge("");const D0=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Hn(n){if(ue(!!n),typeof n=="string"){let e=0;const t=D0.exec(n);if(ue(!!t),t[1]){let s=t[1];s=(s+"000000000").substr(0,9),e=Number(s)}const r=new Date(n);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:Ce(n.seconds),nanos:Ce(n.nanos)}}function Ce(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function vr(n){return typeof n=="string"?Ge.fromBase64String(n):Ge.fromUint8Array(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sl(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="server_timestamp"}function Al(n){const e=n.mapValue.fields.__previous_value__;return Sl(e)?Al(e):e}function Hs(n){const e=Hn(n.mapValue.fields.__local_write_time__.timestampValue);return new Be(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class N0{constructor(e,t,r,s,i,a,l,c,d){this.databaseId=e,this.appId=t,this.persistenceKey=r,this.host=s,this.ssl=i,this.forceLongPolling=a,this.autoDetectLongPolling=l,this.longPollingOptions=c,this.useFetchStreams=d}}class js{constructor(e,t){this.projectId=e,this.database=t||"(default)"}static empty(){return new js("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof js&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ni={mapValue:{}};function wr(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?Sl(n)?4:O0(n)?9007199254740991:L0(n)?10:11:W()}function jt(n,e){if(n===e)return!0;const t=wr(n);if(t!==wr(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return Hs(n).isEqual(Hs(e));case 3:return function(s,i){if(typeof s.timestampValue=="string"&&typeof i.timestampValue=="string"&&s.timestampValue.length===i.timestampValue.length)return s.timestampValue===i.timestampValue;const a=Hn(s.timestampValue),l=Hn(i.timestampValue);return a.seconds===l.seconds&&a.nanos===l.nanos}(n,e);case 5:return n.stringValue===e.stringValue;case 6:return function(s,i){return vr(s.bytesValue).isEqual(vr(i.bytesValue))}(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return function(s,i){return Ce(s.geoPointValue.latitude)===Ce(i.geoPointValue.latitude)&&Ce(s.geoPointValue.longitude)===Ce(i.geoPointValue.longitude)}(n,e);case 2:return function(s,i){if("integerValue"in s&&"integerValue"in i)return Ce(s.integerValue)===Ce(i.integerValue);if("doubleValue"in s&&"doubleValue"in i){const a=Ce(s.doubleValue),l=Ce(i.doubleValue);return a===l?ro(a)===ro(l):isNaN(a)&&isNaN(l)}return!1}(n,e);case 9:return Qr(n.arrayValue.values||[],e.arrayValue.values||[],jt);case 10:case 11:return function(s,i){const a=s.mapValue.fields||{},l=i.mapValue.fields||{};if(Nu(a)!==Nu(l))return!1;for(const c in a)if(a.hasOwnProperty(c)&&(l[c]===void 0||!jt(a[c],l[c])))return!1;return!0}(n,e);default:return W()}}function Ys(n,e){return(n.values||[]).find(t=>jt(t,e))!==void 0}function Jr(n,e){if(n===e)return 0;const t=wr(n),r=wr(e);if(t!==r)return le(t,r);switch(t){case 0:case 9007199254740991:return 0;case 1:return le(n.booleanValue,e.booleanValue);case 2:return function(i,a){const l=Ce(i.integerValue||i.doubleValue),c=Ce(a.integerValue||a.doubleValue);return l<c?-1:l>c?1:l===c?0:isNaN(l)?isNaN(c)?0:-1:1}(n,e);case 3:return Ou(n.timestampValue,e.timestampValue);case 4:return Ou(Hs(n),Hs(e));case 5:return le(n.stringValue,e.stringValue);case 6:return function(i,a){const l=vr(i),c=vr(a);return l.compareTo(c)}(n.bytesValue,e.bytesValue);case 7:return function(i,a){const l=i.split("/"),c=a.split("/");for(let d=0;d<l.length&&d<c.length;d++){const f=le(l[d],c[d]);if(f!==0)return f}return le(l.length,c.length)}(n.referenceValue,e.referenceValue);case 8:return function(i,a){const l=le(Ce(i.latitude),Ce(a.latitude));return l!==0?l:le(Ce(i.longitude),Ce(a.longitude))}(n.geoPointValue,e.geoPointValue);case 9:return Bu(n.arrayValue,e.arrayValue);case 10:return function(i,a){var l,c,d,f;const m=i.fields||{},g=a.fields||{},b=(l=m.value)===null||l===void 0?void 0:l.arrayValue,S=(c=g.value)===null||c===void 0?void 0:c.arrayValue,I=le(((d=b==null?void 0:b.values)===null||d===void 0?void 0:d.length)||0,((f=S==null?void 0:S.values)===null||f===void 0?void 0:f.length)||0);return I!==0?I:Bu(b,S)}(n.mapValue,e.mapValue);case 11:return function(i,a){if(i===Ni.mapValue&&a===Ni.mapValue)return 0;if(i===Ni.mapValue)return 1;if(a===Ni.mapValue)return-1;const l=i.fields||{},c=Object.keys(l),d=a.fields||{},f=Object.keys(d);c.sort(),f.sort();for(let m=0;m<c.length&&m<f.length;++m){const g=le(c[m],f[m]);if(g!==0)return g;const b=Jr(l[c[m]],d[f[m]]);if(b!==0)return b}return le(c.length,f.length)}(n.mapValue,e.mapValue);default:throw W()}}function Ou(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return le(n,e);const t=Hn(n),r=Hn(e),s=le(t.seconds,r.seconds);return s!==0?s:le(t.nanos,r.nanos)}function Bu(n,e){const t=n.values||[],r=e.values||[];for(let s=0;s<t.length&&s<r.length;++s){const i=Jr(t[s],r[s]);if(i)return i}return le(t.length,r.length)}function Xr(n){return $a(n)}function $a(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?function(t){const r=Hn(t);return`time(${r.seconds},${r.nanos})`}(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?function(t){return vr(t).toBase64()}(n.bytesValue):"referenceValue"in n?function(t){return q.fromName(t).toString()}(n.referenceValue):"geoPointValue"in n?function(t){return`geo(${t.latitude},${t.longitude})`}(n.geoPointValue):"arrayValue"in n?function(t){let r="[",s=!0;for(const i of t.values||[])s?s=!1:r+=",",r+=$a(i);return r+"]"}(n.arrayValue):"mapValue"in n?function(t){const r=Object.keys(t.fields||{}).sort();let s="{",i=!0;for(const a of r)i?i=!1:s+=",",s+=`${a}:${$a(t.fields[a])}`;return s+"}"}(n.mapValue):W()}function za(n){return!!n&&"integerValue"in n}function xl(n){return!!n&&"arrayValue"in n}function Vu(n){return!!n&&"nullValue"in n}function Fu(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function zi(n){return!!n&&"mapValue"in n}function L0(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="__vector__"}function Ns(n){if(n.geoPointValue)return{geoPointValue:Object.assign({},n.geoPointValue)};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:Object.assign({},n.timestampValue)};if(n.mapValue){const e={mapValue:{fields:{}}};return Er(n.mapValue.fields,(t,r)=>e.mapValue.fields[t]=Ns(r)),e}if(n.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Ns(n.arrayValue.values[t]);return e}return Object.assign({},n)}function O0(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class at{constructor(e){this.value=e}static empty(){return new at({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let r=0;r<e.length-1;++r)if(t=(t.mapValue.fields||{})[e.get(r)],!zi(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Ns(t)}setAll(e){let t=Ye.emptyPath(),r={},s=[];e.forEach((a,l)=>{if(!t.isImmediateParentOf(l)){const c=this.getFieldsMap(t);this.applyChanges(c,r,s),r={},s=[],t=l.popLast()}a?r[l.lastSegment()]=Ns(a):s.push(l.lastSegment())});const i=this.getFieldsMap(t);this.applyChanges(i,r,s)}delete(e){const t=this.field(e.popLast());zi(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return jt(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let r=0;r<e.length;++r){let s=t.mapValue.fields[e.get(r)];zi(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},t.mapValue.fields[e.get(r)]=s),t=s}return t.mapValue.fields}applyChanges(e,t,r){Er(t,(s,i)=>e[s]=i);for(const s of r)delete e[s]}clone(){return new at(Ns(this.value))}}function Ph(n){const e=[];return Er(n.fields,(t,r)=>{const s=new Ye([t]);if(zi(r)){const i=Ph(r.mapValue).fields;if(i.length===0)e.push(s);else for(const a of i)e.push(s.child(a))}else e.push(s)}),new gt(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ze{constructor(e,t,r,s,i,a,l){this.key=e,this.documentType=t,this.version=r,this.readTime=s,this.createTime=i,this.data=a,this.documentState=l}static newInvalidDocument(e){return new Ze(e,0,G.min(),G.min(),G.min(),at.empty(),0)}static newFoundDocument(e,t,r,s){return new Ze(e,1,t,G.min(),r,s,0)}static newNoDocument(e,t){return new Ze(e,2,t,G.min(),G.min(),at.empty(),0)}static newUnknownDocument(e,t){return new Ze(e,3,t,G.min(),G.min(),at.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(G.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=at.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=at.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=G.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof Ze&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Ze(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class so{constructor(e,t){this.position=e,this.inclusive=t}}function $u(n,e,t){let r=0;for(let s=0;s<n.position.length;s++){const i=e[s],a=n.position[s];if(i.field.isKeyField()?r=q.comparator(q.fromName(a.referenceValue),t.key):r=Jr(a,t.data.field(i.field)),i.dir==="desc"&&(r*=-1),r!==0)break}return r}function zu(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!jt(n.position[t],e.position[t]))return!1;return!0}/**
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
 */class io{constructor(e,t="asc"){this.field=e,this.dir=t}}function B0(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}/**
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
 */class Ch{}class Oe extends Ch{constructor(e,t,r){super(),this.field=e,this.op=t,this.value=r}static create(e,t,r){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,r):new F0(e,t,r):t==="array-contains"?new U0(e,r):t==="in"?new q0(e,r):t==="not-in"?new H0(e,r):t==="array-contains-any"?new j0(e,r):new Oe(e,t,r)}static createKeyFieldInFilter(e,t,r){return t==="in"?new $0(e,r):new z0(e,r)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&this.matchesComparison(Jr(t,this.value)):t!==null&&wr(this.value)===wr(t)&&this.matchesComparison(Jr(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return W()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Yt extends Ch{constructor(e,t){super(),this.filters=e,this.op=t,this.ae=null}static create(e,t){return new Yt(e,t)}matches(e){return kh(this)?this.filters.find(t=>!t.matches(e))===void 0:this.filters.find(t=>t.matches(e))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function kh(n){return n.op==="and"}function Mh(n){return V0(n)&&kh(n)}function V0(n){for(const e of n.filters)if(e instanceof Yt)return!1;return!0}function Ua(n){if(n instanceof Oe)return n.field.canonicalString()+n.op.toString()+Xr(n.value);if(Mh(n))return n.filters.map(e=>Ua(e)).join(",");{const e=n.filters.map(t=>Ua(t)).join(",");return`${n.op}(${e})`}}function Dh(n,e){return n instanceof Oe?function(r,s){return s instanceof Oe&&r.op===s.op&&r.field.isEqual(s.field)&&jt(r.value,s.value)}(n,e):n instanceof Yt?function(r,s){return s instanceof Yt&&r.op===s.op&&r.filters.length===s.filters.length?r.filters.reduce((i,a,l)=>i&&Dh(a,s.filters[l]),!0):!1}(n,e):void W()}function Nh(n){return n instanceof Oe?function(t){return`${t.field.canonicalString()} ${t.op} ${Xr(t.value)}`}(n):n instanceof Yt?function(t){return t.op.toString()+" {"+t.getFilters().map(Nh).join(" ,")+"}"}(n):"Filter"}class F0 extends Oe{constructor(e,t,r){super(e,t,r),this.key=q.fromName(r.referenceValue)}matches(e){const t=q.comparator(e.key,this.key);return this.matchesComparison(t)}}class $0 extends Oe{constructor(e,t){super(e,"in",t),this.keys=Lh("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class z0 extends Oe{constructor(e,t){super(e,"not-in",t),this.keys=Lh("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function Lh(n,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map(r=>q.fromName(r.referenceValue))}class U0 extends Oe{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return xl(t)&&Ys(t.arrayValue,this.value)}}class q0 extends Oe{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&Ys(this.value.arrayValue,t)}}class H0 extends Oe{constructor(e,t){super(e,"not-in",t)}matches(e){if(Ys(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&!Ys(this.value.arrayValue,t)}}class j0 extends Oe{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!xl(t)||!t.arrayValue.values)&&t.arrayValue.values.some(r=>Ys(this.value.arrayValue,r))}}/**
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
 */class Y0{constructor(e,t=null,r=[],s=[],i=null,a=null,l=null){this.path=e,this.collectionGroup=t,this.orderBy=r,this.filters=s,this.limit=i,this.startAt=a,this.endAt=l,this.ue=null}}function Uu(n,e=null,t=[],r=[],s=null,i=null,a=null){return new Y0(n,e,t,r,s,i,a)}function Rl(n){const e=K(n);if(e.ue===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map(r=>Ua(r)).join(","),t+="|ob:",t+=e.orderBy.map(r=>function(i){return i.field.canonicalString()+i.dir}(r)).join(","),To(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map(r=>Xr(r)).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map(r=>Xr(r)).join(",")),e.ue=t}return e.ue}function Pl(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!B0(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!Dh(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!zu(n.startAt,e.startAt)&&zu(n.endAt,e.endAt)}function qa(n){return q.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Io{constructor(e,t=null,r=[],s=[],i=null,a="F",l=null,c=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=r,this.filters=s,this.limit=i,this.limitType=a,this.startAt=l,this.endAt=c,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function W0(n,e,t,r,s,i,a,l){return new Io(n,e,t,r,s,i,a,l)}function Cl(n){return new Io(n)}function qu(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function G0(n){return n.collectionGroup!==null}function Ls(n){const e=K(n);if(e.ce===null){e.ce=[];const t=new Set;for(const i of e.explicitOrderBy)e.ce.push(i),t.add(i.field.canonicalString());const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(a){let l=new We(Ye.comparator);return a.filters.forEach(c=>{c.getFlattenedFilters().forEach(d=>{d.isInequality()&&(l=l.add(d.field))})}),l})(e).forEach(i=>{t.has(i.canonicalString())||i.isKeyField()||e.ce.push(new io(i,r))}),t.has(Ye.keyField().canonicalString())||e.ce.push(new io(Ye.keyField(),r))}return e.ce}function qt(n){const e=K(n);return e.le||(e.le=K0(e,Ls(n))),e.le}function K0(n,e){if(n.limitType==="F")return Uu(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map(s=>{const i=s.dir==="desc"?"asc":"desc";return new io(s.field,i)});const t=n.endAt?new so(n.endAt.position,n.endAt.inclusive):null,r=n.startAt?new so(n.startAt.position,n.startAt.inclusive):null;return Uu(n.path,n.collectionGroup,e,n.filters,n.limit,t,r)}}function Ha(n,e,t){return new Io(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function So(n,e){return Pl(qt(n),qt(e))&&n.limitType===e.limitType}function Oh(n){return`${Rl(qt(n))}|lt:${n.limitType}`}function Lr(n){return`Query(target=${function(t){let r=t.path.canonicalString();return t.collectionGroup!==null&&(r+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(r+=`, filters: [${t.filters.map(s=>Nh(s)).join(", ")}]`),To(t.limit)||(r+=", limit: "+t.limit),t.orderBy.length>0&&(r+=`, orderBy: [${t.orderBy.map(s=>function(a){return`${a.field.canonicalString()} (${a.dir})`}(s)).join(", ")}]`),t.startAt&&(r+=", startAt: ",r+=t.startAt.inclusive?"b:":"a:",r+=t.startAt.position.map(s=>Xr(s)).join(",")),t.endAt&&(r+=", endAt: ",r+=t.endAt.inclusive?"a:":"b:",r+=t.endAt.position.map(s=>Xr(s)).join(",")),`Target(${r})`}(qt(n))}; limitType=${n.limitType})`}function Ao(n,e){return e.isFoundDocument()&&function(r,s){const i=s.key.path;return r.collectionGroup!==null?s.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(i):q.isDocumentKey(r.path)?r.path.isEqual(i):r.path.isImmediateParentOf(i)}(n,e)&&function(r,s){for(const i of Ls(r))if(!i.field.isKeyField()&&s.data.field(i.field)===null)return!1;return!0}(n,e)&&function(r,s){for(const i of r.filters)if(!i.matches(s))return!1;return!0}(n,e)&&function(r,s){return!(r.startAt&&!function(a,l,c){const d=$u(a,l,c);return a.inclusive?d<=0:d<0}(r.startAt,Ls(r),s)||r.endAt&&!function(a,l,c){const d=$u(a,l,c);return a.inclusive?d>=0:d>0}(r.endAt,Ls(r),s))}(n,e)}function Q0(n){return n.collectionGroup||(n.path.length%2==1?n.path.lastSegment():n.path.get(n.path.length-2))}function Bh(n){return(e,t)=>{let r=!1;for(const s of Ls(n)){const i=J0(s,e,t);if(i!==0)return i;r=r||s.field.isKeyField()}return 0}}function J0(n,e,t){const r=n.field.isKeyField()?q.comparator(e.key,t.key):function(i,a,l){const c=a.data.field(i),d=l.data.field(i);return c!==null&&d!==null?Jr(c,d):W()}(n.field,e,t);switch(n.dir){case"asc":return r;case"desc":return-1*r;default:return W()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class as{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r!==void 0){for(const[s,i]of r)if(this.equalsFn(s,e))return i}}has(e){return this.get(e)!==void 0}set(e,t){const r=this.mapKeyFn(e),s=this.inner[r];if(s===void 0)return this.inner[r]=[[e,t]],void this.innerSize++;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],e))return void(s[i]=[e,t]);s.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r===void 0)return!1;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],e))return r.length===1?delete this.inner[t]:r.splice(s,1),this.innerSize--,!0;return!1}forEach(e){Er(this.inner,(t,r)=>{for(const[s,i]of r)e(s,i)})}isEmpty(){return xh(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const X0=new Ie(q.comparator);function gn(){return X0}const Vh=new Ie(q.comparator);function Ps(...n){let e=Vh;for(const t of n)e=e.insert(t.key,t);return e}function Fh(n){let e=Vh;return n.forEach((t,r)=>e=e.insert(t,r.overlayedDocument)),e}function cr(){return Os()}function $h(){return Os()}function Os(){return new as(n=>n.toString(),(n,e)=>n.isEqual(e))}const Z0=new Ie(q.comparator),ew=new We(q.comparator);function re(...n){let e=ew;for(const t of n)e=e.add(t);return e}const tw=new We(le);function nw(){return tw}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kl(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:ro(e)?"-0":e}}function zh(n){return{integerValue:""+n}}function rw(n,e){return M0(e)?zh(e):kl(n,e)}/**
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
 */class xo{constructor(){this._=void 0}}function sw(n,e,t){return n instanceof oo?function(s,i){const a={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return i&&Sl(i)&&(i=Al(i)),i&&(a.fields.__previous_value__=i),{mapValue:a}}(t,e):n instanceof Ws?qh(n,e):n instanceof Gs?Hh(n,e):function(s,i){const a=Uh(s,i),l=Hu(a)+Hu(s.Pe);return za(a)&&za(s.Pe)?zh(l):kl(s.serializer,l)}(n,e)}function iw(n,e,t){return n instanceof Ws?qh(n,e):n instanceof Gs?Hh(n,e):t}function Uh(n,e){return n instanceof ao?function(r){return za(r)||function(i){return!!i&&"doubleValue"in i}(r)}(e)?e:{integerValue:0}:null}class oo extends xo{}class Ws extends xo{constructor(e){super(),this.elements=e}}function qh(n,e){const t=jh(e);for(const r of n.elements)t.some(s=>jt(s,r))||t.push(r);return{arrayValue:{values:t}}}class Gs extends xo{constructor(e){super(),this.elements=e}}function Hh(n,e){let t=jh(e);for(const r of n.elements)t=t.filter(s=>!jt(s,r));return{arrayValue:{values:t}}}class ao extends xo{constructor(e,t){super(),this.serializer=e,this.Pe=t}}function Hu(n){return Ce(n.integerValue||n.doubleValue)}function jh(n){return xl(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}function ow(n,e){return n.field.isEqual(e.field)&&function(r,s){return r instanceof Ws&&s instanceof Ws||r instanceof Gs&&s instanceof Gs?Qr(r.elements,s.elements,jt):r instanceof ao&&s instanceof ao?jt(r.Pe,s.Pe):r instanceof oo&&s instanceof oo}(n.transform,e.transform)}class aw{constructor(e,t){this.version=e,this.transformResults=t}}class ot{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new ot}static exists(e){return new ot(void 0,e)}static updateTime(e){return new ot(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Ui(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}class Ro{}function Yh(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new Po(n.key,ot.none()):new li(n.key,n.data,ot.none());{const t=n.data,r=at.empty();let s=new We(Ye.comparator);for(let i of e.fields)if(!s.has(i)){let a=t.field(i);a===null&&i.length>1&&(i=i.popLast(),a=t.field(i)),a===null?r.delete(i):r.set(i,a),s=s.add(i)}return new Wn(n.key,r,new gt(s.toArray()),ot.none())}}function lw(n,e,t){n instanceof li?function(s,i,a){const l=s.value.clone(),c=Yu(s.fieldTransforms,i,a.transformResults);l.setAll(c),i.convertToFoundDocument(a.version,l).setHasCommittedMutations()}(n,e,t):n instanceof Wn?function(s,i,a){if(!Ui(s.precondition,i))return void i.convertToUnknownDocument(a.version);const l=Yu(s.fieldTransforms,i,a.transformResults),c=i.data;c.setAll(Wh(s)),c.setAll(l),i.convertToFoundDocument(a.version,c).setHasCommittedMutations()}(n,e,t):function(s,i,a){i.convertToNoDocument(a.version).setHasCommittedMutations()}(0,e,t)}function Bs(n,e,t,r){return n instanceof li?function(i,a,l,c){if(!Ui(i.precondition,a))return l;const d=i.value.clone(),f=Wu(i.fieldTransforms,c,a);return d.setAll(f),a.convertToFoundDocument(a.version,d).setHasLocalMutations(),null}(n,e,t,r):n instanceof Wn?function(i,a,l,c){if(!Ui(i.precondition,a))return l;const d=Wu(i.fieldTransforms,c,a),f=a.data;return f.setAll(Wh(i)),f.setAll(d),a.convertToFoundDocument(a.version,f).setHasLocalMutations(),l===null?null:l.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map(m=>m.field))}(n,e,t,r):function(i,a,l){return Ui(i.precondition,a)?(a.convertToNoDocument(a.version).setHasLocalMutations(),null):l}(n,e,t)}function cw(n,e){let t=null;for(const r of n.fieldTransforms){const s=e.data.field(r.field),i=Uh(r.transform,s||null);i!=null&&(t===null&&(t=at.empty()),t.set(r.field,i))}return t||null}function ju(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!function(r,s){return r===void 0&&s===void 0||!(!r||!s)&&Qr(r,s,(i,a)=>ow(i,a))}(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}class li extends Ro{constructor(e,t,r,s=[]){super(),this.key=e,this.value=t,this.precondition=r,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class Wn extends Ro{constructor(e,t,r,s,i=[]){super(),this.key=e,this.data=t,this.fieldMask=r,this.precondition=s,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function Wh(n){const e=new Map;return n.fieldMask.fields.forEach(t=>{if(!t.isEmpty()){const r=n.data.field(t);e.set(t,r)}}),e}function Yu(n,e,t){const r=new Map;ue(n.length===t.length);for(let s=0;s<t.length;s++){const i=n[s],a=i.transform,l=e.data.field(i.field);r.set(i.field,iw(a,l,t[s]))}return r}function Wu(n,e,t){const r=new Map;for(const s of n){const i=s.transform,a=t.data.field(s.field);r.set(s.field,sw(i,a,e))}return r}class Po extends Ro{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class uw extends Ro{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dw{constructor(e,t,r,s){this.batchId=e,this.localWriteTime=t,this.baseMutations=r,this.mutations=s}applyToRemoteDocument(e,t){const r=t.mutationResults;for(let s=0;s<this.mutations.length;s++){const i=this.mutations[s];i.key.isEqual(e.key)&&lw(i,e,r[s])}}applyToLocalView(e,t){for(const r of this.baseMutations)r.key.isEqual(e.key)&&(t=Bs(r,e,t,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(e.key)&&(t=Bs(r,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const r=$h();return this.mutations.forEach(s=>{const i=e.get(s.key),a=i.overlayedDocument;let l=this.applyToLocalView(a,i.mutatedFields);l=t.has(s.key)?null:l;const c=Yh(a,l);c!==null&&r.set(s.key,c),a.isValidDocument()||a.convertToNoDocument(G.min())}),r}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),re())}isEqual(e){return this.batchId===e.batchId&&Qr(this.mutations,e.mutations,(t,r)=>ju(t,r))&&Qr(this.baseMutations,e.baseMutations,(t,r)=>ju(t,r))}}class Ml{constructor(e,t,r,s){this.batch=e,this.commitVersion=t,this.mutationResults=r,this.docVersions=s}static from(e,t,r){ue(e.mutations.length===r.length);let s=function(){return Z0}();const i=e.mutations;for(let a=0;a<i.length;a++)s=s.insert(i[a].key,r[a].version);return new Ml(e,t,r,s)}}/**
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
 */class hw{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
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
 */class fw{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Me,ie;function pw(n){switch(n){default:return W();case k.CANCELLED:case k.UNKNOWN:case k.DEADLINE_EXCEEDED:case k.RESOURCE_EXHAUSTED:case k.INTERNAL:case k.UNAVAILABLE:case k.UNAUTHENTICATED:return!1;case k.INVALID_ARGUMENT:case k.NOT_FOUND:case k.ALREADY_EXISTS:case k.PERMISSION_DENIED:case k.FAILED_PRECONDITION:case k.ABORTED:case k.OUT_OF_RANGE:case k.UNIMPLEMENTED:case k.DATA_LOSS:return!0}}function Gh(n){if(n===void 0)return mn("GRPC error has no .code"),k.UNKNOWN;switch(n){case Me.OK:return k.OK;case Me.CANCELLED:return k.CANCELLED;case Me.UNKNOWN:return k.UNKNOWN;case Me.DEADLINE_EXCEEDED:return k.DEADLINE_EXCEEDED;case Me.RESOURCE_EXHAUSTED:return k.RESOURCE_EXHAUSTED;case Me.INTERNAL:return k.INTERNAL;case Me.UNAVAILABLE:return k.UNAVAILABLE;case Me.UNAUTHENTICATED:return k.UNAUTHENTICATED;case Me.INVALID_ARGUMENT:return k.INVALID_ARGUMENT;case Me.NOT_FOUND:return k.NOT_FOUND;case Me.ALREADY_EXISTS:return k.ALREADY_EXISTS;case Me.PERMISSION_DENIED:return k.PERMISSION_DENIED;case Me.FAILED_PRECONDITION:return k.FAILED_PRECONDITION;case Me.ABORTED:return k.ABORTED;case Me.OUT_OF_RANGE:return k.OUT_OF_RANGE;case Me.UNIMPLEMENTED:return k.UNIMPLEMENTED;case Me.DATA_LOSS:return k.DATA_LOSS;default:return W()}}(ie=Me||(Me={}))[ie.OK=0]="OK",ie[ie.CANCELLED=1]="CANCELLED",ie[ie.UNKNOWN=2]="UNKNOWN",ie[ie.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",ie[ie.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",ie[ie.NOT_FOUND=5]="NOT_FOUND",ie[ie.ALREADY_EXISTS=6]="ALREADY_EXISTS",ie[ie.PERMISSION_DENIED=7]="PERMISSION_DENIED",ie[ie.UNAUTHENTICATED=16]="UNAUTHENTICATED",ie[ie.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",ie[ie.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",ie[ie.ABORTED=10]="ABORTED",ie[ie.OUT_OF_RANGE=11]="OUT_OF_RANGE",ie[ie.UNIMPLEMENTED=12]="UNIMPLEMENTED",ie[ie.INTERNAL=13]="INTERNAL",ie[ie.UNAVAILABLE=14]="UNAVAILABLE",ie[ie.DATA_LOSS=15]="DATA_LOSS";/**
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
 */function mw(){return new TextEncoder}/**
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
 */const gw=new hr([4294967295,4294967295],0);function Gu(n){const e=mw().encode(n),t=new wh;return t.update(e),new Uint8Array(t.digest())}function Ku(n){const e=new DataView(n.buffer),t=e.getUint32(0,!0),r=e.getUint32(4,!0),s=e.getUint32(8,!0),i=e.getUint32(12,!0);return[new hr([t,r],0),new hr([s,i],0)]}class Dl{constructor(e,t,r){if(this.bitmap=e,this.padding=t,this.hashCount=r,t<0||t>=8)throw new Cs(`Invalid padding: ${t}`);if(r<0)throw new Cs(`Invalid hash count: ${r}`);if(e.length>0&&this.hashCount===0)throw new Cs(`Invalid hash count: ${r}`);if(e.length===0&&t!==0)throw new Cs(`Invalid padding when bitmap length is 0: ${t}`);this.Ie=8*e.length-t,this.Te=hr.fromNumber(this.Ie)}Ee(e,t,r){let s=e.add(t.multiply(hr.fromNumber(r)));return s.compare(gw)===1&&(s=new hr([s.getBits(0),s.getBits(1)],0)),s.modulo(this.Te).toNumber()}de(e){return(this.bitmap[Math.floor(e/8)]&1<<e%8)!=0}mightContain(e){if(this.Ie===0)return!1;const t=Gu(e),[r,s]=Ku(t);for(let i=0;i<this.hashCount;i++){const a=this.Ee(r,s,i);if(!this.de(a))return!1}return!0}static create(e,t,r){const s=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),a=new Dl(i,s,t);return r.forEach(l=>a.insert(l)),a}insert(e){if(this.Ie===0)return;const t=Gu(e),[r,s]=Ku(t);for(let i=0;i<this.hashCount;i++){const a=this.Ee(r,s,i);this.Ae(a)}}Ae(e){const t=Math.floor(e/8),r=e%8;this.bitmap[t]|=1<<r}}class Cs extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Co{constructor(e,t,r,s,i){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=r,this.documentUpdates=s,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(e,t,r){const s=new Map;return s.set(e,ci.createSynthesizedTargetChangeForCurrentChange(e,t,r)),new Co(G.min(),s,new Ie(le),gn(),re())}}class ci{constructor(e,t,r,s,i){this.resumeToken=e,this.current=t,this.addedDocuments=r,this.modifiedDocuments=s,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,t,r){return new ci(r,t,re(),re(),re())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qi{constructor(e,t,r,s){this.Re=e,this.removedTargetIds=t,this.key=r,this.Ve=s}}class Kh{constructor(e,t){this.targetId=e,this.me=t}}class Qh{constructor(e,t,r=Ge.EMPTY_BYTE_STRING,s=null){this.state=e,this.targetIds=t,this.resumeToken=r,this.cause=s}}class Qu{constructor(){this.fe=0,this.ge=Xu(),this.pe=Ge.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return this.fe!==0}get be(){return this.we}De(e){e.approximateByteSize()>0&&(this.we=!0,this.pe=e)}ve(){let e=re(),t=re(),r=re();return this.ge.forEach((s,i)=>{switch(i){case 0:e=e.add(s);break;case 2:t=t.add(s);break;case 1:r=r.add(s);break;default:W()}}),new ci(this.pe,this.ye,e,t,r)}Ce(){this.we=!1,this.ge=Xu()}Fe(e,t){this.we=!0,this.ge=this.ge.insert(e,t)}Me(e){this.we=!0,this.ge=this.ge.remove(e)}xe(){this.fe+=1}Oe(){this.fe-=1,ue(this.fe>=0)}Ne(){this.we=!0,this.ye=!0}}class yw{constructor(e){this.Le=e,this.Be=new Map,this.ke=gn(),this.qe=Ju(),this.Qe=new Ie(le)}Ke(e){for(const t of e.Re)e.Ve&&e.Ve.isFoundDocument()?this.$e(t,e.Ve):this.Ue(t,e.key,e.Ve);for(const t of e.removedTargetIds)this.Ue(t,e.key,e.Ve)}We(e){this.forEachTarget(e,t=>{const r=this.Ge(t);switch(e.state){case 0:this.ze(t)&&r.De(e.resumeToken);break;case 1:r.Oe(),r.Se||r.Ce(),r.De(e.resumeToken);break;case 2:r.Oe(),r.Se||this.removeTarget(t);break;case 3:this.ze(t)&&(r.Ne(),r.De(e.resumeToken));break;case 4:this.ze(t)&&(this.je(t),r.De(e.resumeToken));break;default:W()}})}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Be.forEach((r,s)=>{this.ze(s)&&t(s)})}He(e){const t=e.targetId,r=e.me.count,s=this.Je(t);if(s){const i=s.target;if(qa(i))if(r===0){const a=new q(i.path);this.Ue(t,a,Ze.newNoDocument(a,G.min()))}else ue(r===1);else{const a=this.Ye(t);if(a!==r){const l=this.Ze(e),c=l?this.Xe(l,e,a):1;if(c!==0){this.je(t);const d=c===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Qe=this.Qe.insert(t,d)}}}}}Ze(e){const t=e.me.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:r="",padding:s=0},hashCount:i=0}=t;let a,l;try{a=vr(r).toUint8Array()}catch(c){if(c instanceof Rh)return Kr("Decoding the base64 bloom filter in existence filter failed ("+c.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw c}try{l=new Dl(a,s,i)}catch(c){return Kr(c instanceof Cs?"BloomFilter error: ":"Applying bloom filter failed: ",c),null}return l.Ie===0?null:l}Xe(e,t,r){return t.me.count===r-this.nt(e,t.targetId)?0:2}nt(e,t){const r=this.Le.getRemoteKeysForTarget(t);let s=0;return r.forEach(i=>{const a=this.Le.tt(),l=`projects/${a.projectId}/databases/${a.database}/documents/${i.path.canonicalString()}`;e.mightContain(l)||(this.Ue(t,i,null),s++)}),s}rt(e){const t=new Map;this.Be.forEach((i,a)=>{const l=this.Je(a);if(l){if(i.current&&qa(l.target)){const c=new q(l.target.path);this.ke.get(c)!==null||this.it(a,c)||this.Ue(a,c,Ze.newNoDocument(c,e))}i.be&&(t.set(a,i.ve()),i.Ce())}});let r=re();this.qe.forEach((i,a)=>{let l=!0;a.forEachWhile(c=>{const d=this.Je(c);return!d||d.purpose==="TargetPurposeLimboResolution"||(l=!1,!1)}),l&&(r=r.add(i))}),this.ke.forEach((i,a)=>a.setReadTime(e));const s=new Co(e,t,this.Qe,this.ke,r);return this.ke=gn(),this.qe=Ju(),this.Qe=new Ie(le),s}$e(e,t){if(!this.ze(e))return;const r=this.it(e,t.key)?2:0;this.Ge(e).Fe(t.key,r),this.ke=this.ke.insert(t.key,t),this.qe=this.qe.insert(t.key,this.st(t.key).add(e))}Ue(e,t,r){if(!this.ze(e))return;const s=this.Ge(e);this.it(e,t)?s.Fe(t,1):s.Me(t),this.qe=this.qe.insert(t,this.st(t).delete(e)),r&&(this.ke=this.ke.insert(t,r))}removeTarget(e){this.Be.delete(e)}Ye(e){const t=this.Ge(e).ve();return this.Le.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}xe(e){this.Ge(e).xe()}Ge(e){let t=this.Be.get(e);return t||(t=new Qu,this.Be.set(e,t)),t}st(e){let t=this.qe.get(e);return t||(t=new We(le),this.qe=this.qe.insert(e,t)),t}ze(e){const t=this.Je(e)!==null;return t||z("WatchChangeAggregator","Detected inactive target",e),t}Je(e){const t=this.Be.get(e);return t&&t.Se?null:this.Le.ot(e)}je(e){this.Be.set(e,new Qu),this.Le.getRemoteKeysForTarget(e).forEach(t=>{this.Ue(e,t,null)})}it(e,t){return this.Le.getRemoteKeysForTarget(e).has(t)}}function Ju(){return new Ie(q.comparator)}function Xu(){return new Ie(q.comparator)}const vw={asc:"ASCENDING",desc:"DESCENDING"},ww={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},_w={and:"AND",or:"OR"};class bw{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function ja(n,e){return n.useProto3Json||To(e)?e:{value:e}}function lo(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Jh(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function Ew(n,e){return lo(n,e.toTimestamp())}function Ht(n){return ue(!!n),G.fromTimestamp(function(t){const r=Hn(t);return new Be(r.seconds,r.nanos)}(n))}function Nl(n,e){return Ya(n,e).canonicalString()}function Ya(n,e){const t=function(s){return new _e(["projects",s.projectId,"databases",s.database])}(n).child("documents");return e===void 0?t:t.child(e)}function Xh(n){const e=_e.fromString(n);return ue(rf(e)),e}function Wa(n,e){return Nl(n.databaseId,e.path)}function ba(n,e){const t=Xh(e);if(t.get(1)!==n.databaseId.projectId)throw new U(k.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new U(k.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new q(ef(t))}function Zh(n,e){return Nl(n.databaseId,e)}function Tw(n){const e=Xh(n);return e.length===4?_e.emptyPath():ef(e)}function Ga(n){return new _e(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function ef(n){return ue(n.length>4&&n.get(4)==="documents"),n.popFirst(5)}function Zu(n,e,t){return{name:Wa(n,e),fields:t.value.mapValue.fields}}function Iw(n,e){let t;if("targetChange"in e){e.targetChange;const r=function(d){return d==="NO_CHANGE"?0:d==="ADD"?1:d==="REMOVE"?2:d==="CURRENT"?3:d==="RESET"?4:W()}(e.targetChange.targetChangeType||"NO_CHANGE"),s=e.targetChange.targetIds||[],i=function(d,f){return d.useProto3Json?(ue(f===void 0||typeof f=="string"),Ge.fromBase64String(f||"")):(ue(f===void 0||f instanceof Buffer||f instanceof Uint8Array),Ge.fromUint8Array(f||new Uint8Array))}(n,e.targetChange.resumeToken),a=e.targetChange.cause,l=a&&function(d){const f=d.code===void 0?k.UNKNOWN:Gh(d.code);return new U(f,d.message||"")}(a);t=new Qh(r,s,i,l||null)}else if("documentChange"in e){e.documentChange;const r=e.documentChange;r.document,r.document.name,r.document.updateTime;const s=ba(n,r.document.name),i=Ht(r.document.updateTime),a=r.document.createTime?Ht(r.document.createTime):G.min(),l=new at({mapValue:{fields:r.document.fields}}),c=Ze.newFoundDocument(s,i,a,l),d=r.targetIds||[],f=r.removedTargetIds||[];t=new qi(d,f,c.key,c)}else if("documentDelete"in e){e.documentDelete;const r=e.documentDelete;r.document;const s=ba(n,r.document),i=r.readTime?Ht(r.readTime):G.min(),a=Ze.newNoDocument(s,i),l=r.removedTargetIds||[];t=new qi([],l,a.key,a)}else if("documentRemove"in e){e.documentRemove;const r=e.documentRemove;r.document;const s=ba(n,r.document),i=r.removedTargetIds||[];t=new qi([],i,s,null)}else{if(!("filter"in e))return W();{e.filter;const r=e.filter;r.targetId;const{count:s=0,unchangedNames:i}=r,a=new fw(s,i),l=r.targetId;t=new Kh(l,a)}}return t}function Sw(n,e){let t;if(e instanceof li)t={update:Zu(n,e.key,e.value)};else if(e instanceof Po)t={delete:Wa(n,e.key)};else if(e instanceof Wn)t={update:Zu(n,e.key,e.data),updateMask:Nw(e.fieldMask)};else{if(!(e instanceof uw))return W();t={verify:Wa(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map(r=>function(i,a){const l=a.transform;if(l instanceof oo)return{fieldPath:a.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(l instanceof Ws)return{fieldPath:a.field.canonicalString(),appendMissingElements:{values:l.elements}};if(l instanceof Gs)return{fieldPath:a.field.canonicalString(),removeAllFromArray:{values:l.elements}};if(l instanceof ao)return{fieldPath:a.field.canonicalString(),increment:l.Pe};throw W()}(0,r))),e.precondition.isNone||(t.currentDocument=function(s,i){return i.updateTime!==void 0?{updateTime:Ew(s,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:W()}(n,e.precondition)),t}function Aw(n,e){return n&&n.length>0?(ue(e!==void 0),n.map(t=>function(s,i){let a=s.updateTime?Ht(s.updateTime):Ht(i);return a.isEqual(G.min())&&(a=Ht(i)),new aw(a,s.transformResults||[])}(t,e))):[]}function xw(n,e){return{documents:[Zh(n,e.path)]}}function Rw(n,e){const t={structuredQuery:{}},r=e.path;let s;e.collectionGroup!==null?(s=r,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(s=r.popLast(),t.structuredQuery.from=[{collectionId:r.lastSegment()}]),t.parent=Zh(n,s);const i=function(d){if(d.length!==0)return nf(Yt.create(d,"and"))}(e.filters);i&&(t.structuredQuery.where=i);const a=function(d){if(d.length!==0)return d.map(f=>function(g){return{field:Or(g.field),direction:kw(g.dir)}}(f))}(e.orderBy);a&&(t.structuredQuery.orderBy=a);const l=ja(n,e.limit);return l!==null&&(t.structuredQuery.limit=l),e.startAt&&(t.structuredQuery.startAt=function(d){return{before:d.inclusive,values:d.position}}(e.startAt)),e.endAt&&(t.structuredQuery.endAt=function(d){return{before:!d.inclusive,values:d.position}}(e.endAt)),{_t:t,parent:s}}function Pw(n){let e=Tw(n.parent);const t=n.structuredQuery,r=t.from?t.from.length:0;let s=null;if(r>0){ue(r===1);const f=t.from[0];f.allDescendants?s=f.collectionId:e=e.child(f.collectionId)}let i=[];t.where&&(i=function(m){const g=tf(m);return g instanceof Yt&&Mh(g)?g.getFilters():[g]}(t.where));let a=[];t.orderBy&&(a=function(m){return m.map(g=>function(S){return new io(Br(S.field),function(R){switch(R){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(S.direction))}(g))}(t.orderBy));let l=null;t.limit&&(l=function(m){let g;return g=typeof m=="object"?m.value:m,To(g)?null:g}(t.limit));let c=null;t.startAt&&(c=function(m){const g=!!m.before,b=m.values||[];return new so(b,g)}(t.startAt));let d=null;return t.endAt&&(d=function(m){const g=!m.before,b=m.values||[];return new so(b,g)}(t.endAt)),W0(e,s,a,i,l,"F",c,d)}function Cw(n,e){const t=function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return W()}}(e.purpose);return t==null?null:{"goog-listen-tags":t}}function tf(n){return n.unaryFilter!==void 0?function(t){switch(t.unaryFilter.op){case"IS_NAN":const r=Br(t.unaryFilter.field);return Oe.create(r,"==",{doubleValue:NaN});case"IS_NULL":const s=Br(t.unaryFilter.field);return Oe.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=Br(t.unaryFilter.field);return Oe.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const a=Br(t.unaryFilter.field);return Oe.create(a,"!=",{nullValue:"NULL_VALUE"});default:return W()}}(n):n.fieldFilter!==void 0?function(t){return Oe.create(Br(t.fieldFilter.field),function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return W()}}(t.fieldFilter.op),t.fieldFilter.value)}(n):n.compositeFilter!==void 0?function(t){return Yt.create(t.compositeFilter.filters.map(r=>tf(r)),function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return W()}}(t.compositeFilter.op))}(n):W()}function kw(n){return vw[n]}function Mw(n){return ww[n]}function Dw(n){return _w[n]}function Or(n){return{fieldPath:n.canonicalString()}}function Br(n){return Ye.fromServerFormat(n.fieldPath)}function nf(n){return n instanceof Oe?function(t){if(t.op==="=="){if(Fu(t.value))return{unaryFilter:{field:Or(t.field),op:"IS_NAN"}};if(Vu(t.value))return{unaryFilter:{field:Or(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(Fu(t.value))return{unaryFilter:{field:Or(t.field),op:"IS_NOT_NAN"}};if(Vu(t.value))return{unaryFilter:{field:Or(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Or(t.field),op:Mw(t.op),value:t.value}}}(n):n instanceof Yt?function(t){const r=t.getFilters().map(s=>nf(s));return r.length===1?r[0]:{compositeFilter:{op:Dw(t.op),filters:r}}}(n):W()}function Nw(n){const e=[];return n.fields.forEach(t=>e.push(t.canonicalString())),{fieldPaths:e}}function rf(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nn{constructor(e,t,r,s,i=G.min(),a=G.min(),l=Ge.EMPTY_BYTE_STRING,c=null){this.target=e,this.targetId=t,this.purpose=r,this.sequenceNumber=s,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=a,this.resumeToken=l,this.expectedCount=c}withSequenceNumber(e){return new Nn(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new Nn(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new Nn(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new Nn(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lw{constructor(e){this.ct=e}}function Ow(n){const e=Pw({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?Ha(e,e.limit,"L"):e}/**
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
 */class Bw{constructor(){this.un=new Vw}addToCollectionParentIndex(e,t){return this.un.add(t),D.resolve()}getCollectionParents(e,t){return D.resolve(this.un.getEntries(t))}addFieldIndex(e,t){return D.resolve()}deleteFieldIndex(e,t){return D.resolve()}deleteAllFieldIndexes(e){return D.resolve()}createTargetIndexes(e,t){return D.resolve()}getDocumentsMatchingTarget(e,t){return D.resolve(null)}getIndexType(e,t){return D.resolve(0)}getFieldIndexes(e,t){return D.resolve([])}getNextCollectionGroupToUpdate(e){return D.resolve(null)}getMinOffset(e,t){return D.resolve(qn.min())}getMinOffsetFromCollectionGroup(e,t){return D.resolve(qn.min())}updateCollectionGroup(e,t,r){return D.resolve()}updateIndexEntries(e,t){return D.resolve()}}class Vw{constructor(){this.index={}}add(e){const t=e.lastSegment(),r=e.popLast(),s=this.index[t]||new We(_e.comparator),i=!s.has(r);return this.index[t]=s.add(r),i}has(e){const t=e.lastSegment(),r=e.popLast(),s=this.index[t];return s&&s.has(r)}getEntries(e){return(this.index[e]||new We(_e.comparator)).toArray()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zr{constructor(e){this.Ln=e}next(){return this.Ln+=2,this.Ln}static Bn(){return new Zr(0)}static kn(){return new Zr(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fw{constructor(){this.changes=new as(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,Ze.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const r=this.changes.get(t);return r!==void 0?D.resolve(r):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class $w{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zw{constructor(e,t,r,s){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=r,this.indexManager=s}getDocument(e,t){let r=null;return this.documentOverlayCache.getOverlay(e,t).next(s=>(r=s,this.remoteDocumentCache.getEntry(e,t))).next(s=>(r!==null&&Bs(r.mutation,s,gt.empty(),Be.now()),s))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(r=>this.getLocalViewOfDocuments(e,r,re()).next(()=>r))}getLocalViewOfDocuments(e,t,r=re()){const s=cr();return this.populateOverlays(e,s,t).next(()=>this.computeViews(e,t,s,r).next(i=>{let a=Ps();return i.forEach((l,c)=>{a=a.insert(l,c.overlayedDocument)}),a}))}getOverlayedDocuments(e,t){const r=cr();return this.populateOverlays(e,r,t).next(()=>this.computeViews(e,t,r,re()))}populateOverlays(e,t,r){const s=[];return r.forEach(i=>{t.has(i)||s.push(i)}),this.documentOverlayCache.getOverlays(e,s).next(i=>{i.forEach((a,l)=>{t.set(a,l)})})}computeViews(e,t,r,s){let i=gn();const a=Os(),l=function(){return Os()}();return t.forEach((c,d)=>{const f=r.get(d.key);s.has(d.key)&&(f===void 0||f.mutation instanceof Wn)?i=i.insert(d.key,d):f!==void 0?(a.set(d.key,f.mutation.getFieldMask()),Bs(f.mutation,d,f.mutation.getFieldMask(),Be.now())):a.set(d.key,gt.empty())}),this.recalculateAndSaveOverlays(e,i).next(c=>(c.forEach((d,f)=>a.set(d,f)),t.forEach((d,f)=>{var m;return l.set(d,new $w(f,(m=a.get(d))!==null&&m!==void 0?m:null))}),l))}recalculateAndSaveOverlays(e,t){const r=Os();let s=new Ie((a,l)=>a-l),i=re();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(a=>{for(const l of a)l.keys().forEach(c=>{const d=t.get(c);if(d===null)return;let f=r.get(c)||gt.empty();f=l.applyToLocalView(d,f),r.set(c,f);const m=(s.get(l.batchId)||re()).add(c);s=s.insert(l.batchId,m)})}).next(()=>{const a=[],l=s.getReverseIterator();for(;l.hasNext();){const c=l.getNext(),d=c.key,f=c.value,m=$h();f.forEach(g=>{if(!i.has(g)){const b=Yh(t.get(g),r.get(g));b!==null&&m.set(g,b),i=i.add(g)}}),a.push(this.documentOverlayCache.saveOverlays(e,d,m))}return D.waitFor(a)}).next(()=>r)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(r=>this.recalculateAndSaveOverlays(e,r))}getDocumentsMatchingQuery(e,t,r,s){return function(a){return q.isDocumentKey(a.path)&&a.collectionGroup===null&&a.filters.length===0}(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):G0(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,r,s):this.getDocumentsMatchingCollectionQuery(e,t,r,s)}getNextDocuments(e,t,r,s){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,r,s).next(i=>{const a=s-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,r.largestBatchId,s-i.size):D.resolve(cr());let l=-1,c=i;return a.next(d=>D.forEach(d,(f,m)=>(l<m.largestBatchId&&(l=m.largestBatchId),i.get(f)?D.resolve():this.remoteDocumentCache.getEntry(e,f).next(g=>{c=c.insert(f,g)}))).next(()=>this.populateOverlays(e,d,i)).next(()=>this.computeViews(e,c,d,re())).next(f=>({batchId:l,changes:Fh(f)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new q(t)).next(r=>{let s=Ps();return r.isFoundDocument()&&(s=s.insert(r.key,r)),s})}getDocumentsMatchingCollectionGroupQuery(e,t,r,s){const i=t.collectionGroup;let a=Ps();return this.indexManager.getCollectionParents(e,i).next(l=>D.forEach(l,c=>{const d=function(m,g){return new Io(g,null,m.explicitOrderBy.slice(),m.filters.slice(),m.limit,m.limitType,m.startAt,m.endAt)}(t,c.child(i));return this.getDocumentsMatchingCollectionQuery(e,d,r,s).next(f=>{f.forEach((m,g)=>{a=a.insert(m,g)})})}).next(()=>a))}getDocumentsMatchingCollectionQuery(e,t,r,s){let i;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,r.largestBatchId).next(a=>(i=a,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,r,i,s))).next(a=>{i.forEach((c,d)=>{const f=d.getKey();a.get(f)===null&&(a=a.insert(f,Ze.newInvalidDocument(f)))});let l=Ps();return a.forEach((c,d)=>{const f=i.get(c);f!==void 0&&Bs(f.mutation,d,gt.empty(),Be.now()),Ao(t,d)&&(l=l.insert(c,d))}),l})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uw{constructor(e){this.serializer=e,this.hr=new Map,this.Pr=new Map}getBundleMetadata(e,t){return D.resolve(this.hr.get(t))}saveBundleMetadata(e,t){return this.hr.set(t.id,function(s){return{id:s.id,version:s.version,createTime:Ht(s.createTime)}}(t)),D.resolve()}getNamedQuery(e,t){return D.resolve(this.Pr.get(t))}saveNamedQuery(e,t){return this.Pr.set(t.name,function(s){return{name:s.name,query:Ow(s.bundledQuery),readTime:Ht(s.readTime)}}(t)),D.resolve()}}/**
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
 */class qw{constructor(){this.overlays=new Ie(q.comparator),this.Ir=new Map}getOverlay(e,t){return D.resolve(this.overlays.get(t))}getOverlays(e,t){const r=cr();return D.forEach(t,s=>this.getOverlay(e,s).next(i=>{i!==null&&r.set(s,i)})).next(()=>r)}saveOverlays(e,t,r){return r.forEach((s,i)=>{this.ht(e,t,i)}),D.resolve()}removeOverlaysForBatchId(e,t,r){const s=this.Ir.get(r);return s!==void 0&&(s.forEach(i=>this.overlays=this.overlays.remove(i)),this.Ir.delete(r)),D.resolve()}getOverlaysForCollection(e,t,r){const s=cr(),i=t.length+1,a=new q(t.child("")),l=this.overlays.getIteratorFrom(a);for(;l.hasNext();){const c=l.getNext().value,d=c.getKey();if(!t.isPrefixOf(d.path))break;d.path.length===i&&c.largestBatchId>r&&s.set(c.getKey(),c)}return D.resolve(s)}getOverlaysForCollectionGroup(e,t,r,s){let i=new Ie((d,f)=>d-f);const a=this.overlays.getIterator();for(;a.hasNext();){const d=a.getNext().value;if(d.getKey().getCollectionGroup()===t&&d.largestBatchId>r){let f=i.get(d.largestBatchId);f===null&&(f=cr(),i=i.insert(d.largestBatchId,f)),f.set(d.getKey(),d)}}const l=cr(),c=i.getIterator();for(;c.hasNext()&&(c.getNext().value.forEach((d,f)=>l.set(d,f)),!(l.size()>=s)););return D.resolve(l)}ht(e,t,r){const s=this.overlays.get(r.key);if(s!==null){const a=this.Ir.get(s.largestBatchId).delete(r.key);this.Ir.set(s.largestBatchId,a)}this.overlays=this.overlays.insert(r.key,new hw(t,r));let i=this.Ir.get(t);i===void 0&&(i=re(),this.Ir.set(t,i)),this.Ir.set(t,i.add(r.key))}}/**
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
 */class Hw{constructor(){this.sessionToken=Ge.EMPTY_BYTE_STRING}getSessionToken(e){return D.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,D.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ll{constructor(){this.Tr=new We($e.Er),this.dr=new We($e.Ar)}isEmpty(){return this.Tr.isEmpty()}addReference(e,t){const r=new $e(e,t);this.Tr=this.Tr.add(r),this.dr=this.dr.add(r)}Rr(e,t){e.forEach(r=>this.addReference(r,t))}removeReference(e,t){this.Vr(new $e(e,t))}mr(e,t){e.forEach(r=>this.removeReference(r,t))}gr(e){const t=new q(new _e([])),r=new $e(t,e),s=new $e(t,e+1),i=[];return this.dr.forEachInRange([r,s],a=>{this.Vr(a),i.push(a.key)}),i}pr(){this.Tr.forEach(e=>this.Vr(e))}Vr(e){this.Tr=this.Tr.delete(e),this.dr=this.dr.delete(e)}yr(e){const t=new q(new _e([])),r=new $e(t,e),s=new $e(t,e+1);let i=re();return this.dr.forEachInRange([r,s],a=>{i=i.add(a.key)}),i}containsKey(e){const t=new $e(e,0),r=this.Tr.firstAfterOrEqual(t);return r!==null&&e.isEqual(r.key)}}class $e{constructor(e,t){this.key=e,this.wr=t}static Er(e,t){return q.comparator(e.key,t.key)||le(e.wr,t.wr)}static Ar(e,t){return le(e.wr,t.wr)||q.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jw{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Sr=1,this.br=new We($e.Er)}checkEmpty(e){return D.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,r,s){const i=this.Sr;this.Sr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const a=new dw(i,t,r,s);this.mutationQueue.push(a);for(const l of s)this.br=this.br.add(new $e(l.key,i)),this.indexManager.addToCollectionParentIndex(e,l.key.path.popLast());return D.resolve(a)}lookupMutationBatch(e,t){return D.resolve(this.Dr(t))}getNextMutationBatchAfterBatchId(e,t){const r=t+1,s=this.vr(r),i=s<0?0:s;return D.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return D.resolve(this.mutationQueue.length===0?-1:this.Sr-1)}getAllMutationBatches(e){return D.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const r=new $e(t,0),s=new $e(t,Number.POSITIVE_INFINITY),i=[];return this.br.forEachInRange([r,s],a=>{const l=this.Dr(a.wr);i.push(l)}),D.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let r=new We(le);return t.forEach(s=>{const i=new $e(s,0),a=new $e(s,Number.POSITIVE_INFINITY);this.br.forEachInRange([i,a],l=>{r=r.add(l.wr)})}),D.resolve(this.Cr(r))}getAllMutationBatchesAffectingQuery(e,t){const r=t.path,s=r.length+1;let i=r;q.isDocumentKey(i)||(i=i.child(""));const a=new $e(new q(i),0);let l=new We(le);return this.br.forEachWhile(c=>{const d=c.key.path;return!!r.isPrefixOf(d)&&(d.length===s&&(l=l.add(c.wr)),!0)},a),D.resolve(this.Cr(l))}Cr(e){const t=[];return e.forEach(r=>{const s=this.Dr(r);s!==null&&t.push(s)}),t}removeMutationBatch(e,t){ue(this.Fr(t.batchId,"removed")===0),this.mutationQueue.shift();let r=this.br;return D.forEach(t.mutations,s=>{const i=new $e(s.key,t.batchId);return r=r.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)}).next(()=>{this.br=r})}On(e){}containsKey(e,t){const r=new $e(t,0),s=this.br.firstAfterOrEqual(r);return D.resolve(t.isEqual(s&&s.key))}performConsistencyCheck(e){return this.mutationQueue.length,D.resolve()}Fr(e,t){return this.vr(e)}vr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Dr(e){const t=this.vr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yw{constructor(e){this.Mr=e,this.docs=function(){return new Ie(q.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const r=t.key,s=this.docs.get(r),i=s?s.size:0,a=this.Mr(t);return this.docs=this.docs.insert(r,{document:t.mutableCopy(),size:a}),this.size+=a-i,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const r=this.docs.get(t);return D.resolve(r?r.document.mutableCopy():Ze.newInvalidDocument(t))}getEntries(e,t){let r=gn();return t.forEach(s=>{const i=this.docs.get(s);r=r.insert(s,i?i.document.mutableCopy():Ze.newInvalidDocument(s))}),D.resolve(r)}getDocumentsMatchingQuery(e,t,r,s){let i=gn();const a=t.path,l=new q(a.child("")),c=this.docs.getIteratorFrom(l);for(;c.hasNext();){const{key:d,value:{document:f}}=c.getNext();if(!a.isPrefixOf(d.path))break;d.path.length>a.length+1||R0(x0(f),r)<=0||(s.has(f.key)||Ao(t,f))&&(i=i.insert(f.key,f.mutableCopy()))}return D.resolve(i)}getAllFromCollectionGroup(e,t,r,s){W()}Or(e,t){return D.forEach(this.docs,r=>t(r))}newChangeBuffer(e){return new Ww(this)}getSize(e){return D.resolve(this.size)}}class Ww extends Fw{constructor(e){super(),this.cr=e}applyChanges(e){const t=[];return this.changes.forEach((r,s)=>{s.isValidDocument()?t.push(this.cr.addEntry(e,s)):this.cr.removeEntry(r)}),D.waitFor(t)}getFromCache(e,t){return this.cr.getEntry(e,t)}getAllFromCache(e,t){return this.cr.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gw{constructor(e){this.persistence=e,this.Nr=new as(t=>Rl(t),Pl),this.lastRemoteSnapshotVersion=G.min(),this.highestTargetId=0,this.Lr=0,this.Br=new Ll,this.targetCount=0,this.kr=Zr.Bn()}forEachTarget(e,t){return this.Nr.forEach((r,s)=>t(s)),D.resolve()}getLastRemoteSnapshotVersion(e){return D.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return D.resolve(this.Lr)}allocateTargetId(e){return this.highestTargetId=this.kr.next(),D.resolve(this.highestTargetId)}setTargetsMetadata(e,t,r){return r&&(this.lastRemoteSnapshotVersion=r),t>this.Lr&&(this.Lr=t),D.resolve()}Kn(e){this.Nr.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.kr=new Zr(t),this.highestTargetId=t),e.sequenceNumber>this.Lr&&(this.Lr=e.sequenceNumber)}addTargetData(e,t){return this.Kn(t),this.targetCount+=1,D.resolve()}updateTargetData(e,t){return this.Kn(t),D.resolve()}removeTargetData(e,t){return this.Nr.delete(t.target),this.Br.gr(t.targetId),this.targetCount-=1,D.resolve()}removeTargets(e,t,r){let s=0;const i=[];return this.Nr.forEach((a,l)=>{l.sequenceNumber<=t&&r.get(l.targetId)===null&&(this.Nr.delete(a),i.push(this.removeMatchingKeysForTargetId(e,l.targetId)),s++)}),D.waitFor(i).next(()=>s)}getTargetCount(e){return D.resolve(this.targetCount)}getTargetData(e,t){const r=this.Nr.get(t)||null;return D.resolve(r)}addMatchingKeys(e,t,r){return this.Br.Rr(t,r),D.resolve()}removeMatchingKeys(e,t,r){this.Br.mr(t,r);const s=this.persistence.referenceDelegate,i=[];return s&&t.forEach(a=>{i.push(s.markPotentiallyOrphaned(e,a))}),D.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this.Br.gr(t),D.resolve()}getMatchingKeysForTargetId(e,t){const r=this.Br.yr(t);return D.resolve(r)}containsKey(e,t){return D.resolve(this.Br.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kw{constructor(e,t){this.qr={},this.overlays={},this.Qr=new Il(0),this.Kr=!1,this.Kr=!0,this.$r=new Hw,this.referenceDelegate=e(this),this.Ur=new Gw(this),this.indexManager=new Bw,this.remoteDocumentCache=function(s){return new Yw(s)}(r=>this.referenceDelegate.Wr(r)),this.serializer=new Lw(t),this.Gr=new Uw(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Kr=!1,Promise.resolve()}get started(){return this.Kr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new qw,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let r=this.qr[e.toKey()];return r||(r=new jw(t,this.referenceDelegate),this.qr[e.toKey()]=r),r}getGlobalsCache(){return this.$r}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Gr}runTransaction(e,t,r){z("MemoryPersistence","Starting transaction:",e);const s=new Qw(this.Qr.next());return this.referenceDelegate.zr(),r(s).next(i=>this.referenceDelegate.jr(s).next(()=>i)).toPromise().then(i=>(s.raiseOnCommittedEvent(),i))}Hr(e,t){return D.or(Object.values(this.qr).map(r=>()=>r.containsKey(e,t)))}}class Qw extends C0{constructor(e){super(),this.currentSequenceNumber=e}}class Ol{constructor(e){this.persistence=e,this.Jr=new Ll,this.Yr=null}static Zr(e){return new Ol(e)}get Xr(){if(this.Yr)return this.Yr;throw W()}addReference(e,t,r){return this.Jr.addReference(r,t),this.Xr.delete(r.toString()),D.resolve()}removeReference(e,t,r){return this.Jr.removeReference(r,t),this.Xr.add(r.toString()),D.resolve()}markPotentiallyOrphaned(e,t){return this.Xr.add(t.toString()),D.resolve()}removeTarget(e,t){this.Jr.gr(t.targetId).forEach(s=>this.Xr.add(s.toString()));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,t.targetId).next(s=>{s.forEach(i=>this.Xr.add(i.toString()))}).next(()=>r.removeTargetData(e,t))}zr(){this.Yr=new Set}jr(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return D.forEach(this.Xr,r=>{const s=q.fromPath(r);return this.ei(e,s).next(i=>{i||t.removeEntry(s,G.min())})}).next(()=>(this.Yr=null,t.apply(e)))}updateLimboDocument(e,t){return this.ei(e,t).next(r=>{r?this.Xr.delete(t.toString()):this.Xr.add(t.toString())})}Wr(e){return 0}ei(e,t){return D.or([()=>D.resolve(this.Jr.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Hr(e,t)])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bl{constructor(e,t,r,s){this.targetId=e,this.fromCache=t,this.$i=r,this.Ui=s}static Wi(e,t){let r=re(),s=re();for(const i of t.docChanges)switch(i.type){case 0:r=r.add(i.doc.key);break;case 1:s=s.add(i.doc.key)}return new Bl(e,t.fromCache,r,s)}}/**
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
 */class Jw{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
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
 */class Xw{constructor(){this.Gi=!1,this.zi=!1,this.ji=100,this.Hi=function(){return Dm()?8:k0(et())>0?6:4}()}initialize(e,t){this.Ji=e,this.indexManager=t,this.Gi=!0}getDocumentsMatchingQuery(e,t,r,s){const i={result:null};return this.Yi(e,t).next(a=>{i.result=a}).next(()=>{if(!i.result)return this.Zi(e,t,s,r).next(a=>{i.result=a})}).next(()=>{if(i.result)return;const a=new Jw;return this.Xi(e,t,a).next(l=>{if(i.result=l,this.zi)return this.es(e,t,a,l.size)})}).next(()=>i.result)}es(e,t,r,s){return r.documentReadCount<this.ji?(Is()<=se.DEBUG&&z("QueryEngine","SDK will not create cache indexes for query:",Lr(t),"since it only creates cache indexes for collection contains","more than or equal to",this.ji,"documents"),D.resolve()):(Is()<=se.DEBUG&&z("QueryEngine","Query:",Lr(t),"scans",r.documentReadCount,"local documents and returns",s,"documents as results."),r.documentReadCount>this.Hi*s?(Is()<=se.DEBUG&&z("QueryEngine","The SDK decides to create cache indexes for query:",Lr(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,qt(t))):D.resolve())}Yi(e,t){if(qu(t))return D.resolve(null);let r=qt(t);return this.indexManager.getIndexType(e,r).next(s=>s===0?null:(t.limit!==null&&s===1&&(t=Ha(t,null,"F"),r=qt(t)),this.indexManager.getDocumentsMatchingTarget(e,r).next(i=>{const a=re(...i);return this.Ji.getDocuments(e,a).next(l=>this.indexManager.getMinOffset(e,r).next(c=>{const d=this.ts(t,l);return this.ns(t,d,a,c.readTime)?this.Yi(e,Ha(t,null,"F")):this.rs(e,d,t,c)}))})))}Zi(e,t,r,s){return qu(t)||s.isEqual(G.min())?D.resolve(null):this.Ji.getDocuments(e,r).next(i=>{const a=this.ts(t,i);return this.ns(t,a,r,s)?D.resolve(null):(Is()<=se.DEBUG&&z("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),Lr(t)),this.rs(e,a,t,A0(s,-1)).next(l=>l))})}ts(e,t){let r=new We(Bh(e));return t.forEach((s,i)=>{Ao(e,i)&&(r=r.add(i))}),r}ns(e,t,r,s){if(e.limit===null)return!1;if(r.size!==t.size)return!0;const i=e.limitType==="F"?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(s)>0)}Xi(e,t,r){return Is()<=se.DEBUG&&z("QueryEngine","Using full collection scan to execute query:",Lr(t)),this.Ji.getDocumentsMatchingQuery(e,t,qn.min(),r)}rs(e,t,r,s){return this.Ji.getDocumentsMatchingQuery(e,r,s).next(i=>(t.forEach(a=>{i=i.insert(a.key,a)}),i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zw{constructor(e,t,r,s){this.persistence=e,this.ss=t,this.serializer=s,this.os=new Ie(le),this._s=new as(i=>Rl(i),Pl),this.us=new Map,this.cs=e.getRemoteDocumentCache(),this.Ur=e.getTargetCache(),this.Gr=e.getBundleCache(),this.ls(r)}ls(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new zw(this.cs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.cs.setIndexManager(this.indexManager),this.ss.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.os))}}function e_(n,e,t,r){return new Zw(n,e,t,r)}async function sf(n,e){const t=K(n);return await t.persistence.runTransaction("Handle user change","readonly",r=>{let s;return t.mutationQueue.getAllMutationBatches(r).next(i=>(s=i,t.ls(e),t.mutationQueue.getAllMutationBatches(r))).next(i=>{const a=[],l=[];let c=re();for(const d of s){a.push(d.batchId);for(const f of d.mutations)c=c.add(f.key)}for(const d of i){l.push(d.batchId);for(const f of d.mutations)c=c.add(f.key)}return t.localDocuments.getDocuments(r,c).next(d=>({hs:d,removedBatchIds:a,addedBatchIds:l}))})})}function t_(n,e){const t=K(n);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",r=>{const s=e.batch.keys(),i=t.cs.newChangeBuffer({trackRemovals:!0});return function(l,c,d,f){const m=d.batch,g=m.keys();let b=D.resolve();return g.forEach(S=>{b=b.next(()=>f.getEntry(c,S)).next(I=>{const R=d.docVersions.get(S);ue(R!==null),I.version.compareTo(R)<0&&(m.applyToRemoteDocument(I,d),I.isValidDocument()&&(I.setReadTime(d.commitVersion),f.addEntry(I)))})}),b.next(()=>l.mutationQueue.removeMutationBatch(c,m))}(t,r,e,i).next(()=>i.apply(r)).next(()=>t.mutationQueue.performConsistencyCheck(r)).next(()=>t.documentOverlayCache.removeOverlaysForBatchId(r,s,e.batch.batchId)).next(()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,function(l){let c=re();for(let d=0;d<l.mutationResults.length;++d)l.mutationResults[d].transformResults.length>0&&(c=c.add(l.batch.mutations[d].key));return c}(e))).next(()=>t.localDocuments.getDocuments(r,s))})}function of(n){const e=K(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",t=>e.Ur.getLastRemoteSnapshotVersion(t))}function n_(n,e){const t=K(n),r=e.snapshotVersion;let s=t.os;return t.persistence.runTransaction("Apply remote event","readwrite-primary",i=>{const a=t.cs.newChangeBuffer({trackRemovals:!0});s=t.os;const l=[];e.targetChanges.forEach((f,m)=>{const g=s.get(m);if(!g)return;l.push(t.Ur.removeMatchingKeys(i,f.removedDocuments,m).next(()=>t.Ur.addMatchingKeys(i,f.addedDocuments,m)));let b=g.withSequenceNumber(i.currentSequenceNumber);e.targetMismatches.get(m)!==null?b=b.withResumeToken(Ge.EMPTY_BYTE_STRING,G.min()).withLastLimboFreeSnapshotVersion(G.min()):f.resumeToken.approximateByteSize()>0&&(b=b.withResumeToken(f.resumeToken,r)),s=s.insert(m,b),function(I,R,C){return I.resumeToken.approximateByteSize()===0||R.snapshotVersion.toMicroseconds()-I.snapshotVersion.toMicroseconds()>=3e8?!0:C.addedDocuments.size+C.modifiedDocuments.size+C.removedDocuments.size>0}(g,b,f)&&l.push(t.Ur.updateTargetData(i,b))});let c=gn(),d=re();if(e.documentUpdates.forEach(f=>{e.resolvedLimboDocuments.has(f)&&l.push(t.persistence.referenceDelegate.updateLimboDocument(i,f))}),l.push(r_(i,a,e.documentUpdates).next(f=>{c=f.Ps,d=f.Is})),!r.isEqual(G.min())){const f=t.Ur.getLastRemoteSnapshotVersion(i).next(m=>t.Ur.setTargetsMetadata(i,i.currentSequenceNumber,r));l.push(f)}return D.waitFor(l).next(()=>a.apply(i)).next(()=>t.localDocuments.getLocalViewOfDocuments(i,c,d)).next(()=>c)}).then(i=>(t.os=s,i))}function r_(n,e,t){let r=re(),s=re();return t.forEach(i=>r=r.add(i)),e.getEntries(n,r).next(i=>{let a=gn();return t.forEach((l,c)=>{const d=i.get(l);c.isFoundDocument()!==d.isFoundDocument()&&(s=s.add(l)),c.isNoDocument()&&c.version.isEqual(G.min())?(e.removeEntry(l,c.readTime),a=a.insert(l,c)):!d.isValidDocument()||c.version.compareTo(d.version)>0||c.version.compareTo(d.version)===0&&d.hasPendingWrites?(e.addEntry(c),a=a.insert(l,c)):z("LocalStore","Ignoring outdated watch update for ",l,". Current version:",d.version," Watch version:",c.version)}),{Ps:a,Is:s}})}function s_(n,e){const t=K(n);return t.persistence.runTransaction("Get next mutation batch","readonly",r=>(e===void 0&&(e=-1),t.mutationQueue.getNextMutationBatchAfterBatchId(r,e)))}function i_(n,e){const t=K(n);return t.persistence.runTransaction("Allocate target","readwrite",r=>{let s;return t.Ur.getTargetData(r,e).next(i=>i?(s=i,D.resolve(s)):t.Ur.allocateTargetId(r).next(a=>(s=new Nn(e,a,"TargetPurposeListen",r.currentSequenceNumber),t.Ur.addTargetData(r,s).next(()=>s))))}).then(r=>{const s=t.os.get(r.targetId);return(s===null||r.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(t.os=t.os.insert(r.targetId,r),t._s.set(e,r.targetId)),r})}async function Ka(n,e,t){const r=K(n),s=r.os.get(e),i=t?"readwrite":"readwrite-primary";try{t||await r.persistence.runTransaction("Release target",i,a=>r.persistence.referenceDelegate.removeTarget(a,s))}catch(a){if(!ai(a))throw a;z("LocalStore",`Failed to update sequence numbers for target ${e}: ${a}`)}r.os=r.os.remove(e),r._s.delete(s.target)}function ed(n,e,t){const r=K(n);let s=G.min(),i=re();return r.persistence.runTransaction("Execute query","readwrite",a=>function(c,d,f){const m=K(c),g=m._s.get(f);return g!==void 0?D.resolve(m.os.get(g)):m.Ur.getTargetData(d,f)}(r,a,qt(e)).next(l=>{if(l)return s=l.lastLimboFreeSnapshotVersion,r.Ur.getMatchingKeysForTargetId(a,l.targetId).next(c=>{i=c})}).next(()=>r.ss.getDocumentsMatchingQuery(a,e,t?s:G.min(),t?i:re())).next(l=>(o_(r,Q0(e),l),{documents:l,Ts:i})))}function o_(n,e,t){let r=n.us.get(e)||G.min();t.forEach((s,i)=>{i.readTime.compareTo(r)>0&&(r=i.readTime)}),n.us.set(e,r)}class td{constructor(){this.activeTargetIds=nw()}fs(e){this.activeTargetIds=this.activeTargetIds.add(e)}gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Vs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class a_{constructor(){this.so=new td,this.oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,r){}addLocalQueryTarget(e,t=!0){return t&&this.so.fs(e),this.oo[e]||"not-current"}updateQueryState(e,t,r){this.oo[e]=t}removeLocalQueryTarget(e){this.so.gs(e)}isLocalQueryTarget(e){return this.so.activeTargetIds.has(e)}clearQueryState(e){delete this.oo[e]}getAllActiveQueryTargets(){return this.so.activeTargetIds}isActiveQueryTarget(e){return this.so.activeTargetIds.has(e)}start(){return this.so=new td,Promise.resolve()}handleUserChange(e,t,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
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
 */class l_{_o(e){}shutdown(){}}/**
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
 */class nd{constructor(){this.ao=()=>this.uo(),this.co=()=>this.lo(),this.ho=[],this.Po()}_o(e){this.ho.push(e)}shutdown(){window.removeEventListener("online",this.ao),window.removeEventListener("offline",this.co)}Po(){window.addEventListener("online",this.ao),window.addEventListener("offline",this.co)}uo(){z("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const e of this.ho)e(0)}lo(){z("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const e of this.ho)e(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
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
 */let Li=null;function Ea(){return Li===null?Li=function(){return 268435456+Math.round(2147483648*Math.random())}():Li++,"0x"+Li.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const c_={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class u_{constructor(e){this.Io=e.Io,this.To=e.To}Eo(e){this.Ao=e}Ro(e){this.Vo=e}mo(e){this.fo=e}onMessage(e){this.po=e}close(){this.To()}send(e){this.Io(e)}yo(){this.Ao()}wo(){this.Vo()}So(e){this.fo(e)}bo(e){this.po(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Je="WebChannelConnection";class d_ extends class{constructor(t){this.databaseInfo=t,this.databaseId=t.databaseId;const r=t.ssl?"https":"http",s=encodeURIComponent(this.databaseId.projectId),i=encodeURIComponent(this.databaseId.database);this.Do=r+"://"+t.host,this.vo=`projects/${s}/databases/${i}`,this.Co=this.databaseId.database==="(default)"?`project_id=${s}`:`project_id=${s}&database_id=${i}`}get Fo(){return!1}Mo(t,r,s,i,a){const l=Ea(),c=this.xo(t,r.toUriEncodedString());z("RestConnection",`Sending RPC '${t}' ${l}:`,c,s);const d={"google-cloud-resource-prefix":this.vo,"x-goog-request-params":this.Co};return this.Oo(d,i,a),this.No(t,c,d,s).then(f=>(z("RestConnection",`Received RPC '${t}' ${l}: `,f),f),f=>{throw Kr("RestConnection",`RPC '${t}' ${l} failed with error: `,f,"url: ",c,"request:",s),f})}Lo(t,r,s,i,a,l){return this.Mo(t,r,s,i,a)}Oo(t,r,s){t["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+os}(),t["Content-Type"]="text/plain",this.databaseInfo.appId&&(t["X-Firebase-GMPID"]=this.databaseInfo.appId),r&&r.headers.forEach((i,a)=>t[a]=i),s&&s.headers.forEach((i,a)=>t[a]=i)}xo(t,r){const s=c_[t];return`${this.Do}/v1/${r}:${s}`}terminate(){}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}No(e,t,r,s){const i=Ea();return new Promise((a,l)=>{const c=new _h;c.setWithCredentials(!0),c.listenOnce(bh.COMPLETE,()=>{try{switch(c.getLastErrorCode()){case $i.NO_ERROR:const f=c.getResponseJson();z(Je,`XHR for RPC '${e}' ${i} received:`,JSON.stringify(f)),a(f);break;case $i.TIMEOUT:z(Je,`RPC '${e}' ${i} timed out`),l(new U(k.DEADLINE_EXCEEDED,"Request time out"));break;case $i.HTTP_ERROR:const m=c.getStatus();if(z(Je,`RPC '${e}' ${i} failed with status:`,m,"response text:",c.getResponseText()),m>0){let g=c.getResponseJson();Array.isArray(g)&&(g=g[0]);const b=g==null?void 0:g.error;if(b&&b.status&&b.message){const S=function(R){const C=R.toLowerCase().replace(/_/g,"-");return Object.values(k).indexOf(C)>=0?C:k.UNKNOWN}(b.status);l(new U(S,b.message))}else l(new U(k.UNKNOWN,"Server responded with status "+c.getStatus()))}else l(new U(k.UNAVAILABLE,"Connection failed."));break;default:W()}}finally{z(Je,`RPC '${e}' ${i} completed.`)}});const d=JSON.stringify(s);z(Je,`RPC '${e}' ${i} sending request:`,s),c.send(t,"POST",d,r,15)})}Bo(e,t,r){const s=Ea(),i=[this.Do,"/","google.firestore.v1.Firestore","/",e,"/channel"],a=Ih(),l=Th(),c={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},d=this.longPollingOptions.timeoutSeconds;d!==void 0&&(c.longPollingTimeout=Math.round(1e3*d)),this.useFetchStreams&&(c.useFetchStreams=!0),this.Oo(c.initMessageHeaders,t,r),c.encodeInitMessageHeaders=!0;const f=i.join("");z(Je,`Creating RPC '${e}' stream ${s}: ${f}`,c);const m=a.createWebChannel(f,c);let g=!1,b=!1;const S=new u_({Io:R=>{b?z(Je,`Not sending because RPC '${e}' stream ${s} is closed:`,R):(g||(z(Je,`Opening RPC '${e}' stream ${s} transport.`),m.open(),g=!0),z(Je,`RPC '${e}' stream ${s} sending:`,R),m.send(R))},To:()=>m.close()}),I=(R,C,M)=>{R.listen(C,O=>{try{M(O)}catch(V){setTimeout(()=>{throw V},0)}})};return I(m,Rs.EventType.OPEN,()=>{b||(z(Je,`RPC '${e}' stream ${s} transport opened.`),S.yo())}),I(m,Rs.EventType.CLOSE,()=>{b||(b=!0,z(Je,`RPC '${e}' stream ${s} transport closed`),S.So())}),I(m,Rs.EventType.ERROR,R=>{b||(b=!0,Kr(Je,`RPC '${e}' stream ${s} transport errored:`,R),S.So(new U(k.UNAVAILABLE,"The operation could not be completed")))}),I(m,Rs.EventType.MESSAGE,R=>{var C;if(!b){const M=R.data[0];ue(!!M);const O=M,V=O.error||((C=O[0])===null||C===void 0?void 0:C.error);if(V){z(Je,`RPC '${e}' stream ${s} received error:`,V);const $=V.status;let H=function(y){const _=Me[y];if(_!==void 0)return Gh(_)}($),T=V.message;H===void 0&&(H=k.INTERNAL,T="Unknown error status: "+$+" with message "+V.message),b=!0,S.So(new U(H,T)),m.close()}else z(Je,`RPC '${e}' stream ${s} received:`,M),S.bo(M)}}),I(l,Eh.STAT_EVENT,R=>{R.stat===Fa.PROXY?z(Je,`RPC '${e}' stream ${s} detected buffering proxy`):R.stat===Fa.NOPROXY&&z(Je,`RPC '${e}' stream ${s} detected no buffering proxy`)}),setTimeout(()=>{S.wo()},0),S}}function Ta(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ko(n){return new bw(n,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class af{constructor(e,t,r=1e3,s=1.5,i=6e4){this.ui=e,this.timerId=t,this.ko=r,this.qo=s,this.Qo=i,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(e){this.cancel();const t=Math.floor(this.Ko+this.zo()),r=Math.max(0,Date.now()-this.Uo),s=Math.max(0,t-r);s>0&&z("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.Ko} ms, delay with jitter: ${t} ms, last attempt: ${r} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,s,()=>(this.Uo=Date.now(),e())),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){this.$o!==null&&(this.$o.skipDelay(),this.$o=null)}cancel(){this.$o!==null&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lf{constructor(e,t,r,s,i,a,l,c){this.ui=e,this.Ho=r,this.Jo=s,this.connection=i,this.authCredentialsProvider=a,this.appCheckCredentialsProvider=l,this.listener=c,this.state=0,this.Yo=0,this.Zo=null,this.Xo=null,this.stream=null,this.e_=0,this.t_=new af(e,t)}n_(){return this.state===1||this.state===5||this.r_()}r_(){return this.state===2||this.state===3}start(){this.e_=0,this.state!==4?this.auth():this.i_()}async stop(){this.n_()&&await this.close(0)}s_(){this.state=0,this.t_.reset()}o_(){this.r_()&&this.Zo===null&&(this.Zo=this.ui.enqueueAfterDelay(this.Ho,6e4,()=>this.__()))}a_(e){this.u_(),this.stream.send(e)}async __(){if(this.r_())return this.close(0)}u_(){this.Zo&&(this.Zo.cancel(),this.Zo=null)}c_(){this.Xo&&(this.Xo.cancel(),this.Xo=null)}async close(e,t){this.u_(),this.c_(),this.t_.cancel(),this.Yo++,e!==4?this.t_.reset():t&&t.code===k.RESOURCE_EXHAUSTED?(mn(t.toString()),mn("Using maximum backoff delay to prevent overloading the backend."),this.t_.Wo()):t&&t.code===k.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.l_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.mo(t)}l_(){}auth(){this.state=1;const e=this.h_(this.Yo),t=this.Yo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([r,s])=>{this.Yo===t&&this.P_(r,s)},r=>{e(()=>{const s=new U(k.UNKNOWN,"Fetching auth token failed: "+r.message);return this.I_(s)})})}P_(e,t){const r=this.h_(this.Yo);this.stream=this.T_(e,t),this.stream.Eo(()=>{r(()=>this.listener.Eo())}),this.stream.Ro(()=>{r(()=>(this.state=2,this.Xo=this.ui.enqueueAfterDelay(this.Jo,1e4,()=>(this.r_()&&(this.state=3),Promise.resolve())),this.listener.Ro()))}),this.stream.mo(s=>{r(()=>this.I_(s))}),this.stream.onMessage(s=>{r(()=>++this.e_==1?this.E_(s):this.onNext(s))})}i_(){this.state=5,this.t_.Go(async()=>{this.state=0,this.start()})}I_(e){return z("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}h_(e){return t=>{this.ui.enqueueAndForget(()=>this.Yo===e?t():(z("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class h_ extends lf{constructor(e,t,r,s,i,a){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,r,s,a),this.serializer=i}T_(e,t){return this.connection.Bo("Listen",e,t)}E_(e){return this.onNext(e)}onNext(e){this.t_.reset();const t=Iw(this.serializer,e),r=function(i){if(!("targetChange"in i))return G.min();const a=i.targetChange;return a.targetIds&&a.targetIds.length?G.min():a.readTime?Ht(a.readTime):G.min()}(e);return this.listener.d_(t,r)}A_(e){const t={};t.database=Ga(this.serializer),t.addTarget=function(i,a){let l;const c=a.target;if(l=qa(c)?{documents:xw(i,c)}:{query:Rw(i,c)._t},l.targetId=a.targetId,a.resumeToken.approximateByteSize()>0){l.resumeToken=Jh(i,a.resumeToken);const d=ja(i,a.expectedCount);d!==null&&(l.expectedCount=d)}else if(a.snapshotVersion.compareTo(G.min())>0){l.readTime=lo(i,a.snapshotVersion.toTimestamp());const d=ja(i,a.expectedCount);d!==null&&(l.expectedCount=d)}return l}(this.serializer,e);const r=Cw(this.serializer,e);r&&(t.labels=r),this.a_(t)}R_(e){const t={};t.database=Ga(this.serializer),t.removeTarget=e,this.a_(t)}}class f_ extends lf{constructor(e,t,r,s,i,a){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,r,s,a),this.serializer=i}get V_(){return this.e_>0}start(){this.lastStreamToken=void 0,super.start()}l_(){this.V_&&this.m_([])}T_(e,t){return this.connection.Bo("Write",e,t)}E_(e){return ue(!!e.streamToken),this.lastStreamToken=e.streamToken,ue(!e.writeResults||e.writeResults.length===0),this.listener.f_()}onNext(e){ue(!!e.streamToken),this.lastStreamToken=e.streamToken,this.t_.reset();const t=Aw(e.writeResults,e.commitTime),r=Ht(e.commitTime);return this.listener.g_(r,t)}p_(){const e={};e.database=Ga(this.serializer),this.a_(e)}m_(e){const t={streamToken:this.lastStreamToken,writes:e.map(r=>Sw(this.serializer,r))};this.a_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class p_ extends class{}{constructor(e,t,r,s){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=r,this.serializer=s,this.y_=!1}w_(){if(this.y_)throw new U(k.FAILED_PRECONDITION,"The client has already been terminated.")}Mo(e,t,r,s){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([i,a])=>this.connection.Mo(e,Ya(t,r),s,i,a)).catch(i=>{throw i.name==="FirebaseError"?(i.code===k.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new U(k.UNKNOWN,i.toString())})}Lo(e,t,r,s,i){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([a,l])=>this.connection.Lo(e,Ya(t,r),s,a,l,i)).catch(a=>{throw a.name==="FirebaseError"?(a.code===k.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new U(k.UNKNOWN,a.toString())})}terminate(){this.y_=!0,this.connection.terminate()}}class m_{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.S_=0,this.b_=null,this.D_=!0}v_(){this.S_===0&&(this.C_("Unknown"),this.b_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.b_=null,this.F_("Backend didn't respond within 10 seconds."),this.C_("Offline"),Promise.resolve())))}M_(e){this.state==="Online"?this.C_("Unknown"):(this.S_++,this.S_>=1&&(this.x_(),this.F_(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.C_("Offline")))}set(e){this.x_(),this.S_=0,e==="Online"&&(this.D_=!1),this.C_(e)}C_(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}F_(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.D_?(mn(t),this.D_=!1):z("OnlineStateTracker",t)}x_(){this.b_!==null&&(this.b_.cancel(),this.b_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class g_{constructor(e,t,r,s,i){this.localStore=e,this.datastore=t,this.asyncQueue=r,this.remoteSyncer={},this.O_=[],this.N_=new Map,this.L_=new Set,this.B_=[],this.k_=i,this.k_._o(a=>{r.enqueueAndForget(async()=>{Tr(this)&&(z("RemoteStore","Restarting streams for network reachability change."),await async function(c){const d=K(c);d.L_.add(4),await ui(d),d.q_.set("Unknown"),d.L_.delete(4),await Mo(d)}(this))})}),this.q_=new m_(r,s)}}async function Mo(n){if(Tr(n))for(const e of n.B_)await e(!0)}async function ui(n){for(const e of n.B_)await e(!1)}function cf(n,e){const t=K(n);t.N_.has(e.targetId)||(t.N_.set(e.targetId,e),zl(t)?$l(t):ls(t).r_()&&Fl(t,e))}function Vl(n,e){const t=K(n),r=ls(t);t.N_.delete(e),r.r_()&&uf(t,e),t.N_.size===0&&(r.r_()?r.o_():Tr(t)&&t.q_.set("Unknown"))}function Fl(n,e){if(n.Q_.xe(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(G.min())>0){const t=n.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}ls(n).A_(e)}function uf(n,e){n.Q_.xe(e),ls(n).R_(e)}function $l(n){n.Q_=new yw({getRemoteKeysForTarget:e=>n.remoteSyncer.getRemoteKeysForTarget(e),ot:e=>n.N_.get(e)||null,tt:()=>n.datastore.serializer.databaseId}),ls(n).start(),n.q_.v_()}function zl(n){return Tr(n)&&!ls(n).n_()&&n.N_.size>0}function Tr(n){return K(n).L_.size===0}function df(n){n.Q_=void 0}async function y_(n){n.q_.set("Online")}async function v_(n){n.N_.forEach((e,t)=>{Fl(n,e)})}async function w_(n,e){df(n),zl(n)?(n.q_.M_(e),$l(n)):n.q_.set("Unknown")}async function __(n,e,t){if(n.q_.set("Online"),e instanceof Qh&&e.state===2&&e.cause)try{await async function(s,i){const a=i.cause;for(const l of i.targetIds)s.N_.has(l)&&(await s.remoteSyncer.rejectListen(l,a),s.N_.delete(l),s.Q_.removeTarget(l))}(n,e)}catch(r){z("RemoteStore","Failed to remove targets %s: %s ",e.targetIds.join(","),r),await co(n,r)}else if(e instanceof qi?n.Q_.Ke(e):e instanceof Kh?n.Q_.He(e):n.Q_.We(e),!t.isEqual(G.min()))try{const r=await of(n.localStore);t.compareTo(r)>=0&&await function(i,a){const l=i.Q_.rt(a);return l.targetChanges.forEach((c,d)=>{if(c.resumeToken.approximateByteSize()>0){const f=i.N_.get(d);f&&i.N_.set(d,f.withResumeToken(c.resumeToken,a))}}),l.targetMismatches.forEach((c,d)=>{const f=i.N_.get(c);if(!f)return;i.N_.set(c,f.withResumeToken(Ge.EMPTY_BYTE_STRING,f.snapshotVersion)),uf(i,c);const m=new Nn(f.target,c,d,f.sequenceNumber);Fl(i,m)}),i.remoteSyncer.applyRemoteEvent(l)}(n,t)}catch(r){z("RemoteStore","Failed to raise snapshot:",r),await co(n,r)}}async function co(n,e,t){if(!ai(e))throw e;n.L_.add(1),await ui(n),n.q_.set("Offline"),t||(t=()=>of(n.localStore)),n.asyncQueue.enqueueRetryable(async()=>{z("RemoteStore","Retrying IndexedDB access"),await t(),n.L_.delete(1),await Mo(n)})}function hf(n,e){return e().catch(t=>co(n,t,e))}async function Do(n){const e=K(n),t=jn(e);let r=e.O_.length>0?e.O_[e.O_.length-1].batchId:-1;for(;b_(e);)try{const s=await s_(e.localStore,r);if(s===null){e.O_.length===0&&t.o_();break}r=s.batchId,E_(e,s)}catch(s){await co(e,s)}ff(e)&&pf(e)}function b_(n){return Tr(n)&&n.O_.length<10}function E_(n,e){n.O_.push(e);const t=jn(n);t.r_()&&t.V_&&t.m_(e.mutations)}function ff(n){return Tr(n)&&!jn(n).n_()&&n.O_.length>0}function pf(n){jn(n).start()}async function T_(n){jn(n).p_()}async function I_(n){const e=jn(n);for(const t of n.O_)e.m_(t.mutations)}async function S_(n,e,t){const r=n.O_.shift(),s=Ml.from(r,e,t);await hf(n,()=>n.remoteSyncer.applySuccessfulWrite(s)),await Do(n)}async function A_(n,e){e&&jn(n).V_&&await async function(r,s){if(function(a){return pw(a)&&a!==k.ABORTED}(s.code)){const i=r.O_.shift();jn(r).s_(),await hf(r,()=>r.remoteSyncer.rejectFailedWrite(i.batchId,s)),await Do(r)}}(n,e),ff(n)&&pf(n)}async function rd(n,e){const t=K(n);t.asyncQueue.verifyOperationInProgress(),z("RemoteStore","RemoteStore received new credentials");const r=Tr(t);t.L_.add(3),await ui(t),r&&t.q_.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.L_.delete(3),await Mo(t)}async function x_(n,e){const t=K(n);e?(t.L_.delete(2),await Mo(t)):e||(t.L_.add(2),await ui(t),t.q_.set("Unknown"))}function ls(n){return n.K_||(n.K_=function(t,r,s){const i=K(t);return i.w_(),new h_(r,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)}(n.datastore,n.asyncQueue,{Eo:y_.bind(null,n),Ro:v_.bind(null,n),mo:w_.bind(null,n),d_:__.bind(null,n)}),n.B_.push(async e=>{e?(n.K_.s_(),zl(n)?$l(n):n.q_.set("Unknown")):(await n.K_.stop(),df(n))})),n.K_}function jn(n){return n.U_||(n.U_=function(t,r,s){const i=K(t);return i.w_(),new f_(r,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)}(n.datastore,n.asyncQueue,{Eo:()=>Promise.resolve(),Ro:T_.bind(null,n),mo:A_.bind(null,n),f_:I_.bind(null,n),g_:S_.bind(null,n)}),n.B_.push(async e=>{e?(n.U_.s_(),await Do(n)):(await n.U_.stop(),n.O_.length>0&&(z("RemoteStore",`Stopping write stream with ${n.O_.length} pending writes`),n.O_=[]))})),n.U_}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ul{constructor(e,t,r,s,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=r,this.op=s,this.removalCallback=i,this.deferred=new hn,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(a=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,r,s,i){const a=Date.now()+r,l=new Ul(e,t,a,s,i);return l.start(r),l}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new U(k.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function ql(n,e){if(mn("AsyncQueue",`${e}: ${n}`),ai(n))return new U(k.UNAVAILABLE,`${e}: ${n}`);throw n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qr{constructor(e){this.comparator=e?(t,r)=>e(t,r)||q.comparator(t.key,r.key):(t,r)=>q.comparator(t.key,r.key),this.keyedMap=Ps(),this.sortedSet=new Ie(this.comparator)}static emptySet(e){return new qr(e.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((t,r)=>(e(t),!1))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof qr)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),r=e.sortedSet.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=r.getNext().key;if(!s.isEqual(i))return!1}return!0}toString(){const e=[];return this.forEach(t=>{e.push(t.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const r=new qr;return r.comparator=this.comparator,r.keyedMap=e,r.sortedSet=t,r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sd{constructor(){this.W_=new Ie(q.comparator)}track(e){const t=e.doc.key,r=this.W_.get(t);r?e.type!==0&&r.type===3?this.W_=this.W_.insert(t,e):e.type===3&&r.type!==1?this.W_=this.W_.insert(t,{type:r.type,doc:e.doc}):e.type===2&&r.type===2?this.W_=this.W_.insert(t,{type:2,doc:e.doc}):e.type===2&&r.type===0?this.W_=this.W_.insert(t,{type:0,doc:e.doc}):e.type===1&&r.type===0?this.W_=this.W_.remove(t):e.type===1&&r.type===2?this.W_=this.W_.insert(t,{type:1,doc:r.doc}):e.type===0&&r.type===1?this.W_=this.W_.insert(t,{type:2,doc:e.doc}):W():this.W_=this.W_.insert(t,e)}G_(){const e=[];return this.W_.inorderTraversal((t,r)=>{e.push(r)}),e}}class es{constructor(e,t,r,s,i,a,l,c,d){this.query=e,this.docs=t,this.oldDocs=r,this.docChanges=s,this.mutatedKeys=i,this.fromCache=a,this.syncStateChanged=l,this.excludesMetadataChanges=c,this.hasCachedResults=d}static fromInitialDocuments(e,t,r,s,i){const a=[];return t.forEach(l=>{a.push({type:0,doc:l})}),new es(e,t,qr.emptySet(t),a,r,s,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&So(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,r=e.docChanges;if(t.length!==r.length)return!1;for(let s=0;s<t.length;s++)if(t[s].type!==r[s].type||!t[s].doc.isEqual(r[s].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class R_{constructor(){this.z_=void 0,this.j_=[]}H_(){return this.j_.some(e=>e.J_())}}class P_{constructor(){this.queries=id(),this.onlineState="Unknown",this.Y_=new Set}terminate(){(function(t,r){const s=K(t),i=s.queries;s.queries=id(),i.forEach((a,l)=>{for(const c of l.j_)c.onError(r)})})(this,new U(k.ABORTED,"Firestore shutting down"))}}function id(){return new as(n=>Oh(n),So)}async function mf(n,e){const t=K(n);let r=3;const s=e.query;let i=t.queries.get(s);i?!i.H_()&&e.J_()&&(r=2):(i=new R_,r=e.J_()?0:1);try{switch(r){case 0:i.z_=await t.onListen(s,!0);break;case 1:i.z_=await t.onListen(s,!1);break;case 2:await t.onFirstRemoteStoreListen(s)}}catch(a){const l=ql(a,`Initialization of query '${Lr(e.query)}' failed`);return void e.onError(l)}t.queries.set(s,i),i.j_.push(e),e.Z_(t.onlineState),i.z_&&e.X_(i.z_)&&Hl(t)}async function gf(n,e){const t=K(n),r=e.query;let s=3;const i=t.queries.get(r);if(i){const a=i.j_.indexOf(e);a>=0&&(i.j_.splice(a,1),i.j_.length===0?s=e.J_()?0:1:!i.H_()&&e.J_()&&(s=2))}switch(s){case 0:return t.queries.delete(r),t.onUnlisten(r,!0);case 1:return t.queries.delete(r),t.onUnlisten(r,!1);case 2:return t.onLastRemoteStoreUnlisten(r);default:return}}function C_(n,e){const t=K(n);let r=!1;for(const s of e){const i=s.query,a=t.queries.get(i);if(a){for(const l of a.j_)l.X_(s)&&(r=!0);a.z_=s}}r&&Hl(t)}function k_(n,e,t){const r=K(n),s=r.queries.get(e);if(s)for(const i of s.j_)i.onError(t);r.queries.delete(e)}function Hl(n){n.Y_.forEach(e=>{e.next()})}var Qa,od;(od=Qa||(Qa={})).ea="default",od.Cache="cache";class yf{constructor(e,t,r){this.query=e,this.ta=t,this.na=!1,this.ra=null,this.onlineState="Unknown",this.options=r||{}}X_(e){if(!this.options.includeMetadataChanges){const r=[];for(const s of e.docChanges)s.type!==3&&r.push(s);e=new es(e.query,e.docs,e.oldDocs,r,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.na?this.ia(e)&&(this.ta.next(e),t=!0):this.sa(e,this.onlineState)&&(this.oa(e),t=!0),this.ra=e,t}onError(e){this.ta.error(e)}Z_(e){this.onlineState=e;let t=!1;return this.ra&&!this.na&&this.sa(this.ra,e)&&(this.oa(this.ra),t=!0),t}sa(e,t){if(!e.fromCache||!this.J_())return!0;const r=t!=="Offline";return(!this.options._a||!r)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}ia(e){if(e.docChanges.length>0)return!0;const t=this.ra&&this.ra.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}oa(e){e=es.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.na=!0,this.ta.next(e)}J_(){return this.options.source!==Qa.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vf{constructor(e){this.key=e}}class wf{constructor(e){this.key=e}}class M_{constructor(e,t){this.query=e,this.Ta=t,this.Ea=null,this.hasCachedResults=!1,this.current=!1,this.da=re(),this.mutatedKeys=re(),this.Aa=Bh(e),this.Ra=new qr(this.Aa)}get Va(){return this.Ta}ma(e,t){const r=t?t.fa:new sd,s=t?t.Ra:this.Ra;let i=t?t.mutatedKeys:this.mutatedKeys,a=s,l=!1;const c=this.query.limitType==="F"&&s.size===this.query.limit?s.last():null,d=this.query.limitType==="L"&&s.size===this.query.limit?s.first():null;if(e.inorderTraversal((f,m)=>{const g=s.get(f),b=Ao(this.query,m)?m:null,S=!!g&&this.mutatedKeys.has(g.key),I=!!b&&(b.hasLocalMutations||this.mutatedKeys.has(b.key)&&b.hasCommittedMutations);let R=!1;g&&b?g.data.isEqual(b.data)?S!==I&&(r.track({type:3,doc:b}),R=!0):this.ga(g,b)||(r.track({type:2,doc:b}),R=!0,(c&&this.Aa(b,c)>0||d&&this.Aa(b,d)<0)&&(l=!0)):!g&&b?(r.track({type:0,doc:b}),R=!0):g&&!b&&(r.track({type:1,doc:g}),R=!0,(c||d)&&(l=!0)),R&&(b?(a=a.add(b),i=I?i.add(f):i.delete(f)):(a=a.delete(f),i=i.delete(f)))}),this.query.limit!==null)for(;a.size>this.query.limit;){const f=this.query.limitType==="F"?a.last():a.first();a=a.delete(f.key),i=i.delete(f.key),r.track({type:1,doc:f})}return{Ra:a,fa:r,ns:l,mutatedKeys:i}}ga(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,r,s){const i=this.Ra;this.Ra=e.Ra,this.mutatedKeys=e.mutatedKeys;const a=e.fa.G_();a.sort((f,m)=>function(b,S){const I=R=>{switch(R){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return W()}};return I(b)-I(S)}(f.type,m.type)||this.Aa(f.doc,m.doc)),this.pa(r),s=s!=null&&s;const l=t&&!s?this.ya():[],c=this.da.size===0&&this.current&&!s?1:0,d=c!==this.Ea;return this.Ea=c,a.length!==0||d?{snapshot:new es(this.query,e.Ra,i,a,e.mutatedKeys,c===0,d,!1,!!r&&r.resumeToken.approximateByteSize()>0),wa:l}:{wa:l}}Z_(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Ra:this.Ra,fa:new sd,mutatedKeys:this.mutatedKeys,ns:!1},!1)):{wa:[]}}Sa(e){return!this.Ta.has(e)&&!!this.Ra.has(e)&&!this.Ra.get(e).hasLocalMutations}pa(e){e&&(e.addedDocuments.forEach(t=>this.Ta=this.Ta.add(t)),e.modifiedDocuments.forEach(t=>{}),e.removedDocuments.forEach(t=>this.Ta=this.Ta.delete(t)),this.current=e.current)}ya(){if(!this.current)return[];const e=this.da;this.da=re(),this.Ra.forEach(r=>{this.Sa(r.key)&&(this.da=this.da.add(r.key))});const t=[];return e.forEach(r=>{this.da.has(r)||t.push(new wf(r))}),this.da.forEach(r=>{e.has(r)||t.push(new vf(r))}),t}ba(e){this.Ta=e.Ts,this.da=re();const t=this.ma(e.documents);return this.applyChanges(t,!0)}Da(){return es.fromInitialDocuments(this.query,this.Ra,this.mutatedKeys,this.Ea===0,this.hasCachedResults)}}class D_{constructor(e,t,r){this.query=e,this.targetId=t,this.view=r}}class N_{constructor(e){this.key=e,this.va=!1}}class L_{constructor(e,t,r,s,i,a){this.localStore=e,this.remoteStore=t,this.eventManager=r,this.sharedClientState=s,this.currentUser=i,this.maxConcurrentLimboResolutions=a,this.Ca={},this.Fa=new as(l=>Oh(l),So),this.Ma=new Map,this.xa=new Set,this.Oa=new Ie(q.comparator),this.Na=new Map,this.La=new Ll,this.Ba={},this.ka=new Map,this.qa=Zr.kn(),this.onlineState="Unknown",this.Qa=void 0}get isPrimaryClient(){return this.Qa===!0}}async function O_(n,e,t=!0){const r=Sf(n);let s;const i=r.Fa.get(e);return i?(r.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.Da()):s=await _f(r,e,t,!0),s}async function B_(n,e){const t=Sf(n);await _f(t,e,!0,!1)}async function _f(n,e,t,r){const s=await i_(n.localStore,qt(e)),i=s.targetId,a=n.sharedClientState.addLocalQueryTarget(i,t);let l;return r&&(l=await V_(n,e,i,a==="current",s.resumeToken)),n.isPrimaryClient&&t&&cf(n.remoteStore,s),l}async function V_(n,e,t,r,s){n.Ka=(m,g,b)=>async function(I,R,C,M){let O=R.view.ma(C);O.ns&&(O=await ed(I.localStore,R.query,!1).then(({documents:T})=>R.view.ma(T,O)));const V=M&&M.targetChanges.get(R.targetId),$=M&&M.targetMismatches.get(R.targetId)!=null,H=R.view.applyChanges(O,I.isPrimaryClient,V,$);return ld(I,R.targetId,H.wa),H.snapshot}(n,m,g,b);const i=await ed(n.localStore,e,!0),a=new M_(e,i.Ts),l=a.ma(i.documents),c=ci.createSynthesizedTargetChangeForCurrentChange(t,r&&n.onlineState!=="Offline",s),d=a.applyChanges(l,n.isPrimaryClient,c);ld(n,t,d.wa);const f=new D_(e,t,a);return n.Fa.set(e,f),n.Ma.has(t)?n.Ma.get(t).push(e):n.Ma.set(t,[e]),d.snapshot}async function F_(n,e,t){const r=K(n),s=r.Fa.get(e),i=r.Ma.get(s.targetId);if(i.length>1)return r.Ma.set(s.targetId,i.filter(a=>!So(a,e))),void r.Fa.delete(e);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(s.targetId),r.sharedClientState.isActiveQueryTarget(s.targetId)||await Ka(r.localStore,s.targetId,!1).then(()=>{r.sharedClientState.clearQueryState(s.targetId),t&&Vl(r.remoteStore,s.targetId),Ja(r,s.targetId)}).catch(oi)):(Ja(r,s.targetId),await Ka(r.localStore,s.targetId,!0))}async function $_(n,e){const t=K(n),r=t.Fa.get(e),s=t.Ma.get(r.targetId);t.isPrimaryClient&&s.length===1&&(t.sharedClientState.removeLocalQueryTarget(r.targetId),Vl(t.remoteStore,r.targetId))}async function z_(n,e,t){const r=G_(n);try{const s=await function(a,l){const c=K(a),d=Be.now(),f=l.reduce((b,S)=>b.add(S.key),re());let m,g;return c.persistence.runTransaction("Locally write mutations","readwrite",b=>{let S=gn(),I=re();return c.cs.getEntries(b,f).next(R=>{S=R,S.forEach((C,M)=>{M.isValidDocument()||(I=I.add(C))})}).next(()=>c.localDocuments.getOverlayedDocuments(b,S)).next(R=>{m=R;const C=[];for(const M of l){const O=cw(M,m.get(M.key).overlayedDocument);O!=null&&C.push(new Wn(M.key,O,Ph(O.value.mapValue),ot.exists(!0)))}return c.mutationQueue.addMutationBatch(b,d,C,l)}).next(R=>{g=R;const C=R.applyToLocalDocumentSet(m,I);return c.documentOverlayCache.saveOverlays(b,R.batchId,C)})}).then(()=>({batchId:g.batchId,changes:Fh(m)}))}(r.localStore,e);r.sharedClientState.addPendingMutation(s.batchId),function(a,l,c){let d=a.Ba[a.currentUser.toKey()];d||(d=new Ie(le)),d=d.insert(l,c),a.Ba[a.currentUser.toKey()]=d}(r,s.batchId,t),await di(r,s.changes),await Do(r.remoteStore)}catch(s){const i=ql(s,"Failed to persist write");t.reject(i)}}async function bf(n,e){const t=K(n);try{const r=await n_(t.localStore,e);e.targetChanges.forEach((s,i)=>{const a=t.Na.get(i);a&&(ue(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1),s.addedDocuments.size>0?a.va=!0:s.modifiedDocuments.size>0?ue(a.va):s.removedDocuments.size>0&&(ue(a.va),a.va=!1))}),await di(t,r,e)}catch(r){await oi(r)}}function ad(n,e,t){const r=K(n);if(r.isPrimaryClient&&t===0||!r.isPrimaryClient&&t===1){const s=[];r.Fa.forEach((i,a)=>{const l=a.view.Z_(e);l.snapshot&&s.push(l.snapshot)}),function(a,l){const c=K(a);c.onlineState=l;let d=!1;c.queries.forEach((f,m)=>{for(const g of m.j_)g.Z_(l)&&(d=!0)}),d&&Hl(c)}(r.eventManager,e),s.length&&r.Ca.d_(s),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function U_(n,e,t){const r=K(n);r.sharedClientState.updateQueryState(e,"rejected",t);const s=r.Na.get(e),i=s&&s.key;if(i){let a=new Ie(q.comparator);a=a.insert(i,Ze.newNoDocument(i,G.min()));const l=re().add(i),c=new Co(G.min(),new Map,new Ie(le),a,l);await bf(r,c),r.Oa=r.Oa.remove(i),r.Na.delete(e),jl(r)}else await Ka(r.localStore,e,!1).then(()=>Ja(r,e,t)).catch(oi)}async function q_(n,e){const t=K(n),r=e.batch.batchId;try{const s=await t_(t.localStore,e);Tf(t,r,null),Ef(t,r),t.sharedClientState.updateMutationState(r,"acknowledged"),await di(t,s)}catch(s){await oi(s)}}async function H_(n,e,t){const r=K(n);try{const s=await function(a,l){const c=K(a);return c.persistence.runTransaction("Reject batch","readwrite-primary",d=>{let f;return c.mutationQueue.lookupMutationBatch(d,l).next(m=>(ue(m!==null),f=m.keys(),c.mutationQueue.removeMutationBatch(d,m))).next(()=>c.mutationQueue.performConsistencyCheck(d)).next(()=>c.documentOverlayCache.removeOverlaysForBatchId(d,f,l)).next(()=>c.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(d,f)).next(()=>c.localDocuments.getDocuments(d,f))})}(r.localStore,e);Tf(r,e,t),Ef(r,e),r.sharedClientState.updateMutationState(e,"rejected",t),await di(r,s)}catch(s){await oi(s)}}function Ef(n,e){(n.ka.get(e)||[]).forEach(t=>{t.resolve()}),n.ka.delete(e)}function Tf(n,e,t){const r=K(n);let s=r.Ba[r.currentUser.toKey()];if(s){const i=s.get(e);i&&(t?i.reject(t):i.resolve(),s=s.remove(e)),r.Ba[r.currentUser.toKey()]=s}}function Ja(n,e,t=null){n.sharedClientState.removeLocalQueryTarget(e);for(const r of n.Ma.get(e))n.Fa.delete(r),t&&n.Ca.$a(r,t);n.Ma.delete(e),n.isPrimaryClient&&n.La.gr(e).forEach(r=>{n.La.containsKey(r)||If(n,r)})}function If(n,e){n.xa.delete(e.path.canonicalString());const t=n.Oa.get(e);t!==null&&(Vl(n.remoteStore,t),n.Oa=n.Oa.remove(e),n.Na.delete(t),jl(n))}function ld(n,e,t){for(const r of t)r instanceof vf?(n.La.addReference(r.key,e),j_(n,r)):r instanceof wf?(z("SyncEngine","Document no longer in limbo: "+r.key),n.La.removeReference(r.key,e),n.La.containsKey(r.key)||If(n,r.key)):W()}function j_(n,e){const t=e.key,r=t.path.canonicalString();n.Oa.get(t)||n.xa.has(r)||(z("SyncEngine","New document in limbo: "+t),n.xa.add(r),jl(n))}function jl(n){for(;n.xa.size>0&&n.Oa.size<n.maxConcurrentLimboResolutions;){const e=n.xa.values().next().value;n.xa.delete(e);const t=new q(_e.fromString(e)),r=n.qa.next();n.Na.set(r,new N_(t)),n.Oa=n.Oa.insert(t,r),cf(n.remoteStore,new Nn(qt(Cl(t.path)),r,"TargetPurposeLimboResolution",Il.oe))}}async function di(n,e,t){const r=K(n),s=[],i=[],a=[];r.Fa.isEmpty()||(r.Fa.forEach((l,c)=>{a.push(r.Ka(c,e,t).then(d=>{var f;if((d||t)&&r.isPrimaryClient){const m=d?!d.fromCache:(f=t==null?void 0:t.targetChanges.get(c.targetId))===null||f===void 0?void 0:f.current;r.sharedClientState.updateQueryState(c.targetId,m?"current":"not-current")}if(d){s.push(d);const m=Bl.Wi(c.targetId,d);i.push(m)}}))}),await Promise.all(a),r.Ca.d_(s),await async function(c,d){const f=K(c);try{await f.persistence.runTransaction("notifyLocalViewChanges","readwrite",m=>D.forEach(d,g=>D.forEach(g.$i,b=>f.persistence.referenceDelegate.addReference(m,g.targetId,b)).next(()=>D.forEach(g.Ui,b=>f.persistence.referenceDelegate.removeReference(m,g.targetId,b)))))}catch(m){if(!ai(m))throw m;z("LocalStore","Failed to update sequence numbers: "+m)}for(const m of d){const g=m.targetId;if(!m.fromCache){const b=f.os.get(g),S=b.snapshotVersion,I=b.withLastLimboFreeSnapshotVersion(S);f.os=f.os.insert(g,I)}}}(r.localStore,i))}async function Y_(n,e){const t=K(n);if(!t.currentUser.isEqual(e)){z("SyncEngine","User change. New user:",e.toKey());const r=await sf(t.localStore,e);t.currentUser=e,function(i,a){i.ka.forEach(l=>{l.forEach(c=>{c.reject(new U(k.CANCELLED,a))})}),i.ka.clear()}(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await di(t,r.hs)}}function W_(n,e){const t=K(n),r=t.Na.get(e);if(r&&r.va)return re().add(r.key);{let s=re();const i=t.Ma.get(e);if(!i)return s;for(const a of i){const l=t.Fa.get(a);s=s.unionWith(l.view.Va)}return s}}function Sf(n){const e=K(n);return e.remoteStore.remoteSyncer.applyRemoteEvent=bf.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=W_.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=U_.bind(null,e),e.Ca.d_=C_.bind(null,e.eventManager),e.Ca.$a=k_.bind(null,e.eventManager),e}function G_(n){const e=K(n);return e.remoteStore.remoteSyncer.applySuccessfulWrite=q_.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=H_.bind(null,e),e}class uo{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=ko(e.databaseInfo.databaseId),this.sharedClientState=this.Wa(e),this.persistence=this.Ga(e),await this.persistence.start(),this.localStore=this.za(e),this.gcScheduler=this.ja(e,this.localStore),this.indexBackfillerScheduler=this.Ha(e,this.localStore)}ja(e,t){return null}Ha(e,t){return null}za(e){return e_(this.persistence,new Xw,e.initialUser,this.serializer)}Ga(e){return new Kw(Ol.Zr,this.serializer)}Wa(e){return new a_}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}uo.provider={build:()=>new uo};class Xa{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>ad(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=Y_.bind(null,this.syncEngine),await x_(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new P_}()}createDatastore(e){const t=ko(e.databaseInfo.databaseId),r=function(i){return new d_(i)}(e.databaseInfo);return function(i,a,l,c){return new p_(i,a,l,c)}(e.authCredentials,e.appCheckCredentials,r,t)}createRemoteStore(e){return function(r,s,i,a,l){return new g_(r,s,i,a,l)}(this.localStore,this.datastore,e.asyncQueue,t=>ad(this.syncEngine,t,0),function(){return nd.D()?new nd:new l_}())}createSyncEngine(e,t){return function(s,i,a,l,c,d,f){const m=new L_(s,i,a,l,c,d);return f&&(m.Qa=!0),m}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await async function(s){const i=K(s);z("RemoteStore","RemoteStore shutting down."),i.L_.add(5),await ui(i),i.k_.shutdown(),i.q_.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}}Xa.provider={build:()=>new Xa};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class Af{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ya(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ya(this.observer.error,e):mn("Uncaught Error in snapshot listener:",e.toString()))}Za(){this.muted=!0}Ya(e,t){setTimeout(()=>{this.muted||e(t)},0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class K_{constructor(e,t,r,s,i){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=r,this.databaseInfo=s,this.user=Xe.UNAUTHENTICATED,this.clientId=Ah.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(r,async a=>{z("FirestoreClient","Received user=",a.uid),await this.authCredentialListener(a),this.user=a}),this.appCheckCredentials.start(r,a=>(z("FirestoreClient","Received new app check token=",a),this.appCheckCredentialListener(a,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new hn;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const r=ql(t,"Failed to shutdown persistence");e.reject(r)}}),e.promise}}async function Ia(n,e){n.asyncQueue.verifyOperationInProgress(),z("FirestoreClient","Initializing OfflineComponentProvider");const t=n.configuration;await e.initialize(t);let r=t.initialUser;n.setCredentialChangeListener(async s=>{r.isEqual(s)||(await sf(e.localStore,s),r=s)}),e.persistence.setDatabaseDeletedListener(()=>n.terminate()),n._offlineComponents=e}async function cd(n,e){n.asyncQueue.verifyOperationInProgress();const t=await Q_(n);z("FirestoreClient","Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener(r=>rd(e.remoteStore,r)),n.setAppCheckTokenChangeListener((r,s)=>rd(e.remoteStore,s)),n._onlineComponents=e}async function Q_(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){z("FirestoreClient","Using user provided OfflineComponentProvider");try{await Ia(n,n._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!function(s){return s.name==="FirebaseError"?s.code===k.FAILED_PRECONDITION||s.code===k.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11}(t))throw t;Kr("Error using user provided cache. Falling back to memory cache: "+t),await Ia(n,new uo)}}else z("FirestoreClient","Using default OfflineComponentProvider"),await Ia(n,new uo);return n._offlineComponents}async function xf(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(z("FirestoreClient","Using user provided OnlineComponentProvider"),await cd(n,n._uninitializedComponentsProvider._online)):(z("FirestoreClient","Using default OnlineComponentProvider"),await cd(n,new Xa))),n._onlineComponents}function J_(n){return xf(n).then(e=>e.syncEngine)}async function Rf(n){const e=await xf(n),t=e.eventManager;return t.onListen=O_.bind(null,e.syncEngine),t.onUnlisten=F_.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=B_.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=$_.bind(null,e.syncEngine),t}function X_(n,e,t={}){const r=new hn;return n.asyncQueue.enqueueAndForget(async()=>function(i,a,l,c,d){const f=new Af({next:g=>{f.Za(),a.enqueueAndForget(()=>gf(i,m));const b=g.docs.has(l);!b&&g.fromCache?d.reject(new U(k.UNAVAILABLE,"Failed to get document because the client is offline.")):b&&g.fromCache&&c&&c.source==="server"?d.reject(new U(k.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):d.resolve(g)},error:g=>d.reject(g)}),m=new yf(Cl(l.path),f,{includeMetadataChanges:!0,_a:!0});return mf(i,m)}(await Rf(n),n.asyncQueue,e,t,r)),r.promise}function Z_(n,e,t={}){const r=new hn;return n.asyncQueue.enqueueAndForget(async()=>function(i,a,l,c,d){const f=new Af({next:g=>{f.Za(),a.enqueueAndForget(()=>gf(i,m)),g.fromCache&&c.source==="server"?d.reject(new U(k.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):d.resolve(g)},error:g=>d.reject(g)}),m=new yf(l,f,{includeMetadataChanges:!0,_a:!0});return mf(i,m)}(await Rf(n),n.asyncQueue,e,t,r)),r.promise}/**
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
 */function Pf(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ud=new Map;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Cf(n,e,t){if(!t)throw new U(k.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function eb(n,e,t,r){if(e===!0&&r===!0)throw new U(k.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function dd(n){if(!q.isDocumentKey(n))throw new U(k.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function hd(n){if(q.isDocumentKey(n))throw new U(k.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function Yl(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=function(r){return r.constructor?r.constructor.name:null}(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":W()}function It(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new U(k.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Yl(n);throw new U(k.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fd{constructor(e){var t,r;if(e.host===void 0){if(e.ssl!==void 0)throw new U(k.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(t=e.ssl)===null||t===void 0||t;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new U(k.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}eb("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Pf((r=e.experimentalLongPollingOptions)!==null&&r!==void 0?r:{}),function(i){if(i.timeoutSeconds!==void 0){if(isNaN(i.timeoutSeconds))throw new U(k.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (must not be NaN)`);if(i.timeoutSeconds<5)throw new U(k.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (minimum allowed value is 5)`);if(i.timeoutSeconds>30)throw new U(k.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(r,s){return r.timeoutSeconds===s.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class No{constructor(e,t,r,s){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=r,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new fd({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new U(k.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new U(k.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new fd(e),e.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new y0;switch(r.type){case"firstParty":return new b0(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new U(k.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(t){const r=ud.get(t);r&&(z("ComponentProvider","Removing Datastore"),ud.delete(t),r.terminate())}(this),Promise.resolve()}}function tb(n,e,t,r={}){var s;const i=(n=It(n,No))._getSettings(),a=`${e}:${t}`;if(i.host!=="firestore.googleapis.com"&&i.host!==a&&Kr("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),n._setSettings(Object.assign(Object.assign({},i),{host:a,ssl:!1})),r.mockUserToken){let l,c;if(typeof r.mockUserToken=="string")l=r.mockUserToken,c=Xe.MOCK_USER;else{l=Am(r.mockUserToken,(s=n._app)===null||s===void 0?void 0:s.options.projectId);const d=r.mockUserToken.sub||r.mockUserToken.user_id;if(!d)throw new U(k.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");c=new Xe(d)}n._authCredentials=new v0(new Sh(l,c))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lo{constructor(e,t,r){this.converter=t,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new Lo(this.firestore,e,this._query)}}class ct{constructor(e,t,r){this.converter=t,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new $n(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new ct(this.firestore,e,this._key)}}class $n extends Lo{constructor(e,t,r){super(e,t,Cl(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new ct(this.firestore,null,new q(e))}withConverter(e){return new $n(this.firestore,e,this._path)}}function nb(n,e,...t){if(n=Ne(n),Cf("collection","path",e),n instanceof No){const r=_e.fromString(e,...t);return hd(r),new $n(n,null,r)}{if(!(n instanceof ct||n instanceof $n))throw new U(k.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(_e.fromString(e,...t));return hd(r),new $n(n.firestore,null,r)}}function ts(n,e,...t){if(n=Ne(n),arguments.length===1&&(e=Ah.newId()),Cf("doc","path",e),n instanceof No){const r=_e.fromString(e,...t);return dd(r),new ct(n,null,new q(r))}{if(!(n instanceof ct||n instanceof $n))throw new U(k.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(_e.fromString(e,...t));return dd(r),new ct(n.firestore,n instanceof $n?n.converter:null,new q(r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pd{constructor(e=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new af(this,"async_queue_retry"),this.Vu=()=>{const r=Ta();r&&z("AsyncQueue","Visibility state changed to "+r.visibilityState),this.t_.jo()},this.mu=e;const t=Ta();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.fu(),this.gu(e)}enterRestrictedMode(e){if(!this.Iu){this.Iu=!0,this.Au=e||!1;const t=Ta();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.Vu)}}enqueue(e){if(this.fu(),this.Iu)return new Promise(()=>{});const t=new hn;return this.gu(()=>this.Iu&&this.Au?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Pu.push(e),this.pu()))}async pu(){if(this.Pu.length!==0){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(e){if(!ai(e))throw e;z("AsyncQueue","Operation failed with retryable error: "+e)}this.Pu.length>0&&this.t_.Go(()=>this.pu())}}gu(e){const t=this.mu.then(()=>(this.du=!0,e().catch(r=>{this.Eu=r,this.du=!1;const s=function(a){let l=a.message||"";return a.stack&&(l=a.stack.includes(a.message)?a.stack:a.message+`
`+a.stack),l}(r);throw mn("INTERNAL UNHANDLED ERROR: ",s),r}).then(r=>(this.du=!1,r))));return this.mu=t,t}enqueueAfterDelay(e,t,r){this.fu(),this.Ru.indexOf(e)>-1&&(t=0);const s=Ul.createAndSchedule(this,e,t,r,i=>this.yu(i));return this.Tu.push(s),s}fu(){this.Eu&&W()}verifyOperationInProgress(){}async wu(){let e;do e=this.mu,await e;while(e!==this.mu)}Su(e){for(const t of this.Tu)if(t.timerId===e)return!0;return!1}bu(e){return this.wu().then(()=>{this.Tu.sort((t,r)=>t.targetTimeMs-r.targetTimeMs);for(const t of this.Tu)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.wu()})}Du(e){this.Ru.push(e)}yu(e){const t=this.Tu.indexOf(e);this.Tu.splice(t,1)}}class Gn extends No{constructor(e,t,r,s){super(e,t,r,s),this.type="firestore",this._queue=new pd,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new pd(e),this._firestoreClient=void 0,await e}}}function rb(n,e){const t=typeof n=="object"?n:Bd(),r=typeof n=="string"?n:"(default)",s=dl(t,"firestore").getImmediate({identifier:r});if(!s._initialized){const i=Im("firestore");i&&tb(s,...i)}return s}function Oo(n){if(n._terminated)throw new U(k.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||sb(n),n._firestoreClient}function sb(n){var e,t,r;const s=n._freezeSettings(),i=function(l,c,d,f){return new N0(l,c,d,f.host,f.ssl,f.experimentalForceLongPolling,f.experimentalAutoDetectLongPolling,Pf(f.experimentalLongPollingOptions),f.useFetchStreams)}(n._databaseId,((e=n._app)===null||e===void 0?void 0:e.options.appId)||"",n._persistenceKey,s);n._componentsProvider||!((t=s.localCache)===null||t===void 0)&&t._offlineComponentProvider&&(!((r=s.localCache)===null||r===void 0)&&r._onlineComponentProvider)&&(n._componentsProvider={_offline:s.localCache._offlineComponentProvider,_online:s.localCache._onlineComponentProvider}),n._firestoreClient=new K_(n._authCredentials,n._appCheckCredentials,n._queue,i,n._componentsProvider&&function(l){const c=l==null?void 0:l._online.build();return{_offline:l==null?void 0:l._offline.build(c),_online:c}}(n._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ns{constructor(e){this._byteString=e}static fromBase64String(e){try{return new ns(Ge.fromBase64String(e))}catch(t){throw new U(k.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new ns(Ge.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hi{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new U(k.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Ye(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wl{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gl{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new U(k.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new U(k.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return le(this._lat,e._lat)||le(this._long,e._long)}}/**
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
 */class Kl{constructor(e){this._values=(e||[]).map(t=>t)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(r,s){if(r.length!==s.length)return!1;for(let i=0;i<r.length;++i)if(r[i]!==s[i])return!1;return!0}(this._values,e._values)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ib=/^__.*__$/;class ob{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return this.fieldMask!==null?new Wn(e,this.data,this.fieldMask,t,this.fieldTransforms):new li(e,this.data,t,this.fieldTransforms)}}class kf{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return new Wn(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function Mf(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw W()}}class Ql{constructor(e,t,r,s,i,a){this.settings=e,this.databaseId=t,this.serializer=r,this.ignoreUndefinedProperties=s,i===void 0&&this.vu(),this.fieldTransforms=i||[],this.fieldMask=a||[]}get path(){return this.settings.path}get Cu(){return this.settings.Cu}Fu(e){return new Ql(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Mu(e){var t;const r=(t=this.path)===null||t===void 0?void 0:t.child(e),s=this.Fu({path:r,xu:!1});return s.Ou(e),s}Nu(e){var t;const r=(t=this.path)===null||t===void 0?void 0:t.child(e),s=this.Fu({path:r,xu:!1});return s.vu(),s}Lu(e){return this.Fu({path:void 0,xu:!0})}Bu(e){return ho(e,this.settings.methodName,this.settings.ku||!1,this.path,this.settings.qu)}contains(e){return this.fieldMask.find(t=>e.isPrefixOf(t))!==void 0||this.fieldTransforms.find(t=>e.isPrefixOf(t.field))!==void 0}vu(){if(this.path)for(let e=0;e<this.path.length;e++)this.Ou(this.path.get(e))}Ou(e){if(e.length===0)throw this.Bu("Document fields must not be empty");if(Mf(this.Cu)&&ib.test(e))throw this.Bu('Document fields cannot begin and end with "__"')}}class ab{constructor(e,t,r){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=r||ko(e)}Qu(e,t,r,s=!1){return new Ql({Cu:e,methodName:t,qu:r,path:Ye.emptyPath(),xu:!1,ku:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Bo(n){const e=n._freezeSettings(),t=ko(n._databaseId);return new ab(n._databaseId,!!e.ignoreUndefinedProperties,t)}function Jl(n,e,t,r,s,i={}){const a=n.Qu(i.merge||i.mergeFields?2:0,e,t,s);Xl("Data must be an object, but it was:",a,r);const l=Lf(r,a);let c,d;if(i.merge)c=new gt(a.fieldMask),d=a.fieldTransforms;else if(i.mergeFields){const f=[];for(const m of i.mergeFields){const g=Za(e,m,t);if(!a.contains(g))throw new U(k.INVALID_ARGUMENT,`Field '${g}' is specified in your field mask but missing from your input data.`);Bf(f,g)||f.push(g)}c=new gt(f),d=a.fieldTransforms.filter(m=>c.covers(m.field))}else c=null,d=a.fieldTransforms;return new ob(new at(l),c,d)}class Vo extends Wl{_toFieldTransform(e){if(e.Cu!==2)throw e.Cu===1?e.Bu(`${this._methodName}() can only appear at the top level of your update data`):e.Bu(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof Vo}}function Df(n,e,t,r){const s=n.Qu(1,e,t);Xl("Data must be an object, but it was:",s,r);const i=[],a=at.empty();Er(r,(c,d)=>{const f=Zl(e,c,t);d=Ne(d);const m=s.Nu(f);if(d instanceof Vo)i.push(f);else{const g=Fo(d,m);g!=null&&(i.push(f),a.set(f,g))}});const l=new gt(i);return new kf(a,l,s.fieldTransforms)}function Nf(n,e,t,r,s,i){const a=n.Qu(1,e,t),l=[Za(e,r,t)],c=[s];if(i.length%2!=0)throw new U(k.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let g=0;g<i.length;g+=2)l.push(Za(e,i[g])),c.push(i[g+1]);const d=[],f=at.empty();for(let g=l.length-1;g>=0;--g)if(!Bf(d,l[g])){const b=l[g];let S=c[g];S=Ne(S);const I=a.Nu(b);if(S instanceof Vo)d.push(b);else{const R=Fo(S,I);R!=null&&(d.push(b),f.set(b,R))}}const m=new gt(d);return new kf(f,m,a.fieldTransforms)}function Fo(n,e){if(Of(n=Ne(n)))return Xl("Unsupported field value:",e,n),Lf(n,e);if(n instanceof Wl)return function(r,s){if(!Mf(s.Cu))throw s.Bu(`${r._methodName}() can only be used with update() and set()`);if(!s.path)throw s.Bu(`${r._methodName}() is not currently supported inside arrays`);const i=r._toFieldTransform(s);i&&s.fieldTransforms.push(i)}(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.xu&&e.Cu!==4)throw e.Bu("Nested arrays are not supported");return function(r,s){const i=[];let a=0;for(const l of r){let c=Fo(l,s.Lu(a));c==null&&(c={nullValue:"NULL_VALUE"}),i.push(c),a++}return{arrayValue:{values:i}}}(n,e)}return function(r,s){if((r=Ne(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return rw(s.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const i=Be.fromDate(r);return{timestampValue:lo(s.serializer,i)}}if(r instanceof Be){const i=new Be(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:lo(s.serializer,i)}}if(r instanceof Gl)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof ns)return{bytesValue:Jh(s.serializer,r._byteString)};if(r instanceof ct){const i=s.databaseId,a=r.firestore._databaseId;if(!a.isEqual(i))throw s.Bu(`Document reference is for database ${a.projectId}/${a.database} but should be for database ${i.projectId}/${i.database}`);return{referenceValue:Nl(r.firestore._databaseId||s.databaseId,r._key.path)}}if(r instanceof Kl)return function(a,l){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:a.toArray().map(c=>{if(typeof c!="number")throw l.Bu("VectorValues must only contain numeric values.");return kl(l.serializer,c)})}}}}}}(r,s);throw s.Bu(`Unsupported field value: ${Yl(r)}`)}(n,e)}function Lf(n,e){const t={};return xh(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Er(n,(r,s)=>{const i=Fo(s,e.Mu(r));i!=null&&(t[r]=i)}),{mapValue:{fields:t}}}function Of(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof Be||n instanceof Gl||n instanceof ns||n instanceof ct||n instanceof Wl||n instanceof Kl)}function Xl(n,e,t){if(!Of(t)||!function(s){return typeof s=="object"&&s!==null&&(Object.getPrototypeOf(s)===Object.prototype||Object.getPrototypeOf(s)===null)}(t)){const r=Yl(t);throw r==="an object"?e.Bu(n+" a custom object"):e.Bu(n+" "+r)}}function Za(n,e,t){if((e=Ne(e))instanceof hi)return e._internalPath;if(typeof e=="string")return Zl(n,e);throw ho("Field path arguments must be of type string or ",n,!1,void 0,t)}const lb=new RegExp("[~\\*/\\[\\]]");function Zl(n,e,t){if(e.search(lb)>=0)throw ho(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new hi(...e.split("."))._internalPath}catch{throw ho(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function ho(n,e,t,r,s){const i=r&&!r.isEmpty(),a=s!==void 0;let l=`Function ${e}() called with invalid data`;t&&(l+=" (via `toFirestore()`)"),l+=". ";let c="";return(i||a)&&(c+=" (found",i&&(c+=` in field ${r}`),a&&(c+=` in document ${s}`),c+=")"),new U(k.INVALID_ARGUMENT,l+n+c)}function Bf(n,e){return n.some(t=>t.isEqual(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vf{constructor(e,t,r,s,i){this._firestore=e,this._userDataWriter=t,this._key=r,this._document=s,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new ct(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new cb(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(Ff("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class cb extends Vf{data(){return super.data()}}function Ff(n,e){return typeof e=="string"?Zl(n,e):e instanceof hi?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ub(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new U(k.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class db{convertValue(e,t="none"){switch(wr(e)){case 0:return null;case 1:return e.booleanValue;case 2:return Ce(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(vr(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw W()}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const r={};return Er(e,(s,i)=>{r[s]=this.convertValue(i,t)}),r}convertVectorValue(e){var t,r,s;const i=(s=(r=(t=e.fields)===null||t===void 0?void 0:t.value.arrayValue)===null||r===void 0?void 0:r.values)===null||s===void 0?void 0:s.map(a=>Ce(a.doubleValue));return new Kl(i)}convertGeoPoint(e){return new Gl(Ce(e.latitude),Ce(e.longitude))}convertArray(e,t){return(e.values||[]).map(r=>this.convertValue(r,t))}convertServerTimestamp(e,t){switch(t){case"previous":const r=Al(e);return r==null?null:this.convertValue(r,t);case"estimate":return this.convertTimestamp(Hs(e));default:return null}}convertTimestamp(e){const t=Hn(e);return new Be(t.seconds,t.nanos)}convertDocumentKey(e,t){const r=_e.fromString(e);ue(rf(r));const s=new js(r.get(1),r.get(3)),i=new q(r.popFirst(5));return s.isEqual(t)||mn(`Document ${i} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class ks{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class $f extends Vf{constructor(e,t,r,s,i,a){super(e,t,r,s,a),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new Hi(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const r=this._document.data.field(Ff("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,t.serverTimestamps)}}}class Hi extends $f{data(e={}){return super.data(e)}}class hb{constructor(e,t,r,s){this._firestore=e,this._userDataWriter=t,this._snapshot=s,this.metadata=new ks(s.hasPendingWrites,s.fromCache),this.query=r}get docs(){const e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach(r=>{e.call(t,new Hi(this._firestore,this._userDataWriter,r.key,r,new ks(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new U(k.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(s,i){if(s._snapshot.oldDocs.isEmpty()){let a=0;return s._snapshot.docChanges.map(l=>{const c=new Hi(s._firestore,s._userDataWriter,l.doc.key,l.doc,new ks(s._snapshot.mutatedKeys.has(l.doc.key),s._snapshot.fromCache),s.query.converter);return l.doc,{type:"added",doc:c,oldIndex:-1,newIndex:a++}})}{let a=s._snapshot.oldDocs;return s._snapshot.docChanges.filter(l=>i||l.type!==3).map(l=>{const c=new Hi(s._firestore,s._userDataWriter,l.doc.key,l.doc,new ks(s._snapshot.mutatedKeys.has(l.doc.key),s._snapshot.fromCache),s.query.converter);let d=-1,f=-1;return l.type!==0&&(d=a.indexOf(l.doc.key),a=a.delete(l.doc.key)),l.type!==1&&(a=a.add(l.doc),f=a.indexOf(l.doc.key)),{type:fb(l.type),doc:c,oldIndex:d,newIndex:f}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}}function fb(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return W()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pb(n){n=It(n,ct);const e=It(n.firestore,Gn);return X_(Oo(e),n._key).then(t=>_b(e,n,t))}class zf extends db{constructor(e){super(),this.firestore=e}convertBytes(e){return new ns(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new ct(this.firestore,null,t)}}function mb(n){n=It(n,Lo);const e=It(n.firestore,Gn),t=Oo(e),r=new zf(e);return ub(n._query),Z_(t,n._query).then(s=>new hb(e,r,n,s))}function gb(n,e,t){n=It(n,ct);const r=It(n.firestore,Gn),s=ec(n.converter,e,t);return fi(r,[Jl(Bo(r),"setDoc",n._key,s,n.converter!==null,t).toMutation(n._key,ot.none())])}function yb(n,e,t,...r){n=It(n,ct);const s=It(n.firestore,Gn),i=Bo(s);let a;return a=typeof(e=Ne(e))=="string"||e instanceof hi?Nf(i,"updateDoc",n._key,e,t,r):Df(i,"updateDoc",n._key,e),fi(s,[a.toMutation(n._key,ot.exists(!0))])}function vb(n){return fi(It(n.firestore,Gn),[new Po(n._key,ot.none())])}function wb(n,e){const t=It(n.firestore,Gn),r=ts(n),s=ec(n.converter,e);return fi(t,[Jl(Bo(n.firestore),"addDoc",r._key,s,n.converter!==null,{}).toMutation(r._key,ot.exists(!1))]).then(()=>r)}function fi(n,e){return function(r,s){const i=new hn;return r.asyncQueue.enqueueAndForget(async()=>z_(await J_(r),s,i)),i.promise}(Oo(n),e)}function _b(n,e,t){const r=t.docs.get(e._key),s=new zf(n);return new $f(n,s,e._key,r,new ks(t.hasPendingWrites,t.fromCache),e.converter)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bb{constructor(e,t){this._firestore=e,this._commitHandler=t,this._mutations=[],this._committed=!1,this._dataReader=Bo(e)}set(e,t,r){this._verifyNotCommitted();const s=Sa(e,this._firestore),i=ec(s.converter,t,r),a=Jl(this._dataReader,"WriteBatch.set",s._key,i,s.converter!==null,r);return this._mutations.push(a.toMutation(s._key,ot.none())),this}update(e,t,r,...s){this._verifyNotCommitted();const i=Sa(e,this._firestore);let a;return a=typeof(t=Ne(t))=="string"||t instanceof hi?Nf(this._dataReader,"WriteBatch.update",i._key,t,r,s):Df(this._dataReader,"WriteBatch.update",i._key,t),this._mutations.push(a.toMutation(i._key,ot.exists(!0))),this}delete(e){this._verifyNotCommitted();const t=Sa(e,this._firestore);return this._mutations=this._mutations.concat(new Po(t._key,ot.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new U(k.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function Sa(n,e){if((n=Ne(n)).firestore!==e)throw new U(k.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Uf(n){return Oo(n=It(n,Gn)),new bb(n,e=>fi(n,e))}(function(e,t=!0){(function(s){os=s})(ss),Wr(new pr("firestore",(r,{instanceIdentifier:s,options:i})=>{const a=r.getProvider("app").getImmediate(),l=new Gn(new w0(r.getProvider("auth-internal")),new T0(r.getProvider("app-check-internal")),function(d,f){if(!Object.prototype.hasOwnProperty.apply(d.options,["projectId"]))throw new U(k.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new js(d.options.projectId,f)}(a,s),a);return i=Object.assign({useFetchStreams:t},i),l._setSettings(i),l},"PUBLIC").setMultipleInstances(!0)),Fn(Du,"4.7.3",e),Fn(Du,"4.7.3","esm2017")})();const qf={apiKey:"AIzaSyBdbve0H70D-Ch69WlaxEly7PVBFVRB5p0",authDomain:"pensiontools-4b237.firebaseapp.com",projectId:"pensiontools-4b237",storageBucket:"pensiontools-4b237.firebasestorage.app",messagingSenderId:"760877353696",appId:"1:760877353696:web:2d6f7173c8d7fab6fd9e85",measurementId:"G-80XX542QZE"};function Ve(){return qf.apiKey!=="YOUR_API_KEY"}let Aa=null,yt=null,lt=null;try{Ve()?(Aa=Od(qf),yt=m0(Aa),lt=rb(Aa)):console.warn("Firebase not configured. Login required to save data.")}catch(n){console.error("Firebase initialization error:",n)}const Eb=new sn;let Dn=null,Vs=[];function Tb(){if(!Ve()||!yt){console.warn("Firebase not configured - auth disabled");return}rv(yt,n=>{console.log("onAuthStateChanged fired:",n?n.email:"null"),Dn=n,console.log("Notifying",Vs.length,"listeners"),Vs.forEach(e=>e(n))})}function Ib(n){return console.log("onAuthStateChange: adding listener, currentUser is:",Dn&&Dn.email),Vs.push(n),Dn&&(console.log("onAuthStateChange: immediately calling listener with user"),n(Dn)),()=>{Vs=Vs.filter(e=>e!==n)}}function Ir(){return Dn}function dt(){return Dn!==null}async function Sb(n,e,t=null){if(!Ve()||!yt)throw new Error("Firebase not configured");const r=await Jy(yt,n,e);return t&&r.user&&await ev(r.user,{displayName:t}),r}async function Ab(n,e){if(!Ve()||!yt)throw new Error("Firebase not configured");return Xy(yt,n,e)}async function xb(){if(!Ve()||!yt)throw new Error("Firebase not configured");console.log("Initiating Google sign-in popup...");try{const n=await Iv(yt,Eb);return console.log("Google sign-in successful:",n.user.email),n}catch(n){throw console.error("signInWithPopup error:",n.code,n.message),n}}async function Hf(){if(!Ve()||!yt)throw new Error("Firebase not configured");return sv(yt)}async function Rb(n){if(!Ve()||!yt)throw new Error("Firebase not configured");return Qy(yt,n)}Tb();function Nr(...n){return n.find(e=>e!==void 0)}function Pb(n){if(!n||typeof n!="object")return{scenario:n,migrated:!1};const e=Object.keys(n).filter(c=>c.includes(".")),t="decisionSettings"in n||"stressSettings"in n||"name"in n||"description"in n||"taxYears"in n;if(!(e.length>0||t))return{scenario:n,migrated:!1};const s=n.decisionTool||{},i=n.stressTool||{},a=n.planDetails||{},l={isActive:n.isActive??!1,enabledTools:n.enabledTools||["stress","decision"],planDetails:{name:Nr(n["planDetails.name"],a.name,n.name)??"My Plan",description:Nr(n["planDetails.description"],a.description,n.description)??""},decisionTool:{settings:Nr(n["decisionTool.settings"],s.settings,n.decisionSettings)??{},history:Nr(n["decisionTool.history"],s.history)??[],taxYears:Nr(n["decisionTool.taxYears"],s.taxYears,n.taxYears)??{}},stressTool:{settings:Nr(n["stressTool.settings"],i.settings,n.stressSettings)??{}}};return n.id!==void 0&&(l.id=n.id),n.createdAt!==void 0&&(l.createdAt=n.createdAt),n.lastModified!==void 0&&(l.lastModified=n.lastModified),{scenario:l,migrated:!0}}function tc(n,e="settings"){const t=Ir();return!t||!lt?null:ts(lt,"users",t.uid,n,e)}function jf(n){const e=Ir();return!e||!lt?null:nb(lt,"users",e.uid,n)}async function Yf(n){const{scenario:e,migrated:t}=Pb(n);if(t){const r=Ir();if(r&&lt)try{const{id:s,...i}=e;await gb(ts(lt,"users",r.uid,"scenarios",s),i)}catch(s){console.error("Scenario migration write failed:",s)}}return e}async function $o(){if(!Ve())return[];const n=jf("scenarios");if(!n)return[];try{const e=await mb(n),t=[];return e.forEach(r=>{t.push({id:r.id,...r.data()})}),Promise.all(t.map(r=>Yf(r)))}catch(e){return console.error("Error loading scenarios:",e),[]}}async function Cb(n){if(!Ve())return null;const e=tc("scenarios",n);if(!e)return null;try{const t=await pb(e);return t.exists()?Yf({id:t.id,...t.data()}):null}catch(t){return console.error("Error loading scenario:",t),null}}async function Sr(n,e){if(!Ve())return;const t=tc("scenarios",n);if(t)try{await yb(t,{...e,lastModified:new Date().toISOString()})}catch(r){throw console.error("Error saving scenario:",r),r}}async function Wf(n){if(!Ve())return null;const e=jf("scenarios");if(!e)return null;try{return(await wb(e,{...n,createdAt:new Date().toISOString(),lastModified:new Date().toISOString()})).id}catch(t){throw console.error("Error creating scenario:",t),t}}async function kb(n){if(!Ve())return;const e=tc("scenarios",n);if(e)try{await vb(e)}catch(t){throw console.error("Error deleting scenario:",t),t}}async function nc(n){if(!Ve())return;const e=Ir();if(!(!e||!lt))try{const t=await $o(),r=Uf(lt);for(const s of t){const i=ts(lt,"users",e.uid,"scenarios",s.id);s.id===n?r.update(i,{isActive:!0}):s.isActive&&r.update(i,{isActive:!1})}await r.commit()}catch(t){throw console.error("Error setting active scenario:",t),t}}async function Mb(){if(!Ve())return;const n=Ir();if(!(!n||!lt))try{const e=await $o(),t=Uf(lt);for(const r of e)t.delete(ts(lt,"users",n.uid,"scenarios",r.id));t.delete(ts(lt,"users",n.uid,"profile","settings")),await t.commit(),console.log("All user data wiped successfully")}catch(e){throw console.error("Error wiping user data:",e),e}}async function Db(){return Ve()?(await $o()).length>0:!1}let Hr=null,De=null;function Kn(){return Ve()&&dt()}function bn(){Hr=null,De=null}function rc(){return{equityMin:de.EQUITY_MIN,bondMin:de.BOND_MIN,cashTarget:de.CASH_TARGET,duration:de.DURATION_YEARS,baseSalary:de.BASE_SALARY,other:0,statePension:12e3,statePensionYear:12,pa:ze.PERSONAL_ALLOWANCE,brl:ze.BASIC_RATE_LIMIT,hrl:ze.HIGHER_RATE_LIMIT,taxMode:"inflates",protectionMult:dr.PROTECTION_MULTIPLIER,consecutiveLimit:de.CONSECUTIVE_LIMIT,disableProtection:!1,hodlEnabled:dr.HODL_ENABLED,hodlValue:dr.HODL_VALUE,isaBalance:0,isaReturn:Dt.RETURN,isaMin:Dt.MIN,isaDrawdownStrategy:Dt.DRAWDOWN_STRATEGY}}function Gf(){return{equityMin:de.EQUITY_MIN,bondMin:de.BOND_MIN,cashTarget:de.CASH_TARGET,duration:de.DURATION_YEARS,baseSalary:de.BASE_SALARY,protectionFactor:de.PROTECTION_FACTOR,recoveryBuffer:de.RECOVERY_BUFFER,consecutiveLimit:de.CONSECUTIVE_LIMIT,spStartDate:null,spWeeklyAmount:0,statePension:0,statePensionYear:0,isaBalance:0,isaReturn:Dt.RETURN,isaMin:Dt.MIN,isaDrawdownStrategy:Dt.DRAWDOWN_STRATEGY}}function Nb(n,e={},t=new Date().toISOString()){const r=n||{};return{...rc(),...e,equityMin:r.equityMin,bondMin:r.bondMin,cashTarget:r.cashTarget,duration:r.duration,baseSalary:r.baseSalary,spStartDate:r.spStartDate??e.spStartDate??null,spWeeklyAmount:r.spWeeklyAmount??e.spWeeklyAmount??0,consecutiveLimit:r.consecutiveLimit,recoveryBuffer:r.recoveryBuffer,protectionMult:r.protectionFactor!=null?1-r.protectionFactor/100:e.protectionMult??dr.PROTECTION_MULTIPLIER,isaBalance:r.isaBalance??0,isaReturn:r.isaReturn??Dt.RETURN,isaMin:r.isaMin??Dt.MIN,isaDrawdownStrategy:r.isaDrawdownStrategy??Dt.DRAWDOWN_STRATEGY,seededFrom:"decision",seededAt:t,decisionChecksum:ll(r)}}function Kf(){return{}}function Lb(n="My Plan",e="",t=["stress","decision"]){return{planDetails:{name:n,description:e},enabledTools:t,isActive:!0,decisionTool:{settings:Gf(),history:[],taxYears:Kf()},stressTool:{settings:rc()}}}async function sc(){if(Hr)return Hr;if(!Kn())return[];try{const n=await $o();return Hr=n,n}catch(n){return console.error("Error listing scenarios:",n),[]}}async function Bt(){if(De)return De;if(!Kn())return null;try{const e=(await sc()).find(t=>t.isActive);return e?(De=e,e):null}catch(n){return console.error("Error getting active scenario:",n),null}}async function Ob(n,e,t,r={},s=!0){if(!Kn())throw new Error("Must be logged in to create scenarios");const i=Lb(n,e,t);if(r.stressSettings&&(i.stressTool.settings={...i.stressTool.settings,...r.stressSettings}),r.decisionSettings&&(i.decisionTool.settings={...i.decisionTool.settings,...r.decisionSettings}),r.taxYears&&(i.decisionTool.taxYears=r.taxYears),i.isActive=s,s&&Hr){const l=Hr.find(c=>c.isActive);l&&(await nc(null),await Sr(l.id,{isActive:!1}))}const a=await Wf(i);return bn(),a}async function Bb(n){if(!Kn())throw new Error("Must be logged in to switch scenarios");await nc(n),bn()}async function Vb(n,e){if(!Kn())throw new Error("Must be logged in to duplicate scenarios");const t=await Cb(n);if(!t)throw new Error("Source scenario not found");const{id:r,createdAt:s,lastModified:i,...a}=t;a.planDetails={...a.planDetails,name:e},a.isActive=!1;const l=await Wf(a);return bn(),l}async function Fb(n,e){if(!Kn())throw new Error("Must be logged in to rename scenarios");await Sr(n,{"planDetails.name":e}),bn()}async function $b(n,e){if(!Kn())throw new Error("Must be logged in to update scenarios");await Sr(n,{enabledTools:e}),bn()}async function zb(n){if(!Kn())throw new Error("Must be logged in to delete scenarios");const e=await sc();if(e.length<=1)throw new Error("Cannot delete the last scenario");const t=e.find(r=>r.id===n);if(t!=null&&t.isActive){const r=e.find(s=>s.id!==n);r&&await nc(r.id)}await kb(n),bn()}async function Ub(){var e;const n=await Bt();return((e=n==null?void 0:n.stressTool)==null?void 0:e.settings)||rc()}async function Qf(n){const e=await Bt();if(!e)throw new Error("No active scenario");await Sr(e.id,{"stressTool.settings":n}),De&&(De.stressTool||(De.stressTool={}),De.stressTool.settings=n)}async function qb(){var e;const n=await Bt();return((e=n==null?void 0:n.decisionTool)==null?void 0:e.settings)||Gf()}async function Hb(n){const e=await Bt();if(!e)throw new Error("No active scenario");await Sr(e.id,{"decisionTool.settings":n}),De&&(De.decisionTool||(De.decisionTool={}),De.decisionTool.settings=n)}async function jb(){var e;const n=await Bt();return((e=n==null?void 0:n.decisionTool)==null?void 0:e.taxYears)||Kf()}async function Yb(n){const e=await Bt();if(!e)throw new Error("No active scenario");await Sr(e.id,{"decisionTool.taxYears":n}),De&&(De.decisionTool||(De.decisionTool={}),De.decisionTool.taxYears=n)}async function Wb(){var e;const n=await Bt();return((e=n==null?void 0:n.decisionTool)==null?void 0:e.history)||[]}async function Jf(n){const e=await Bt();if(!e)throw new Error("No active scenario");await Sr(e.id,{"decisionTool.history":n}),De&&(De.decisionTool||(De.decisionTool={}),De.decisionTool.history=n)}async function Xf(){const n=await Bt();return(n==null?void 0:n.enabledTools)||["stress","decision"]}let zn=null;function ji(){return{settings:{equityMin:de.EQUITY_MIN,bondMin:de.BOND_MIN,cashTarget:de.CASH_TARGET,duration:de.DURATION_YEARS,baseSalary:de.BASE_SALARY,protectionFactor:de.PROTECTION_FACTOR,recoveryBuffer:de.RECOVERY_BUFFER,consecutiveLimit:de.CONSECUTIVE_LIMIT,startDate:null,spStartDate:null,spWeeklyAmount:0,statePension:0,statePensionYear:0},taxYears:{},history:[],lastModified:null,checksum:null}}function zo(){return Ve()&&dt()}function _r(){zn=null}function Zf(){return zn||ji()}async function Kt(){if(zn)return zn;if(!zo())return console.warn("Firebase not available - returning defaults"),ji();try{const[n,e,t]=await Promise.all([qb(),jb(),Wb()]),r={settings:n||ji().settings,taxYears:e||{},history:t||[],lastModified:new Date().toISOString(),checksum:null};return r.checksum=ep(r),zn=r,r}catch(n){console.error("Error loading decision data:",n)}return ji()}async function Uo(n){if(!zo())throw new Error("Must be logged in to save data");try{n.lastModified=new Date().toISOString(),n.checksum=ep(n),await Promise.all([Hb(n.settings),Yb(n.taxYears)]),zn=n}catch(e){throw console.error("Error saving decision data:",e),new Error("Failed to save decision data")}}function ep(n){const e={settings:n.settings,taxYears:n.taxYears,historyCount:n.history.length,lastHistoryDate:n.history.length>0?n.history[n.history.length-1].date:null};return ll(e)}async function En(){return(await Kt()).settings}async function ic(n){const e=await Kt();e.settings={...e.settings,...n},await Uo(e)}function oc(){return{pa:ze.PERSONAL_ALLOWANCE,brl:ze.BASIC_RATE_LIMIT,hrl:ze.HIGHER_RATE_LIMIT,cpi:.04,other:0,isaSavingsAllocation:0,isaSavingsUsed:0,isaContribution:0,isTaxEfficient:!0,taxEfficiencyChoice:null,grossIncomeToDate:0,startMonth:4,yearSetupComplete:!1,confirmedSalary:null}}function Gb(n){const t=Zf().taxYears[n];return t||oc()}async function qo(n){const t=(await Kt()).taxYears[n];return t||oc()}async function Ar(n,e){console.log(`saveTaxYearConfig: Saving tax year ${n}`,e);const t=await Kt();t.taxYears[n]={...Gb(n),...e},await Uo(t),console.log(`saveTaxYearConfig: Saved tax year ${n}, yearSetupComplete=${t.taxYears[n].yearSetupComplete}`)}async function Kb(n){const e=zn||await Kt(),t=(e.history||[]).filter(s=>s.taxYear===n),r=t.reduce((s,i)=>s+(i.isa||0),0);return console.log(`recalculateIsaSavingsUsed: Tax year ${n}, found ${t.length} records, total ISA used: ${r}`),console.log("recalculateIsaSavingsUsed: History records:",t.map(s=>({date:s.date,isa:s.isa}))),e.taxYears[n]||(console.log(`recalculateIsaSavingsUsed: No existing config for ${n}, creating default`),e.taxYears[n]=oc()),console.log(`recalculateIsaSavingsUsed: Before update, isaSavingsUsed=${e.taxYears[n].isaSavingsUsed}`),e.taxYears[n].isaSavingsUsed=r,console.log(`recalculateIsaSavingsUsed: After update, isaSavingsUsed=${e.taxYears[n].isaSavingsUsed}`),await Uo(e),console.log("recalculateIsaSavingsUsed: Saved to Firebase"),r}async function Qb(n){const e=await qo(n),t=e.yearSetupComplete===!0;return console.log(`isYearSetupComplete: Tax year ${n}, yearSetupComplete=${e.yearSetupComplete}, result=${t}`),t}async function Qn(){return(await Kt()).taxYears}function Jb(n={}){let t=[...Zf().history];return n.taxYear&&(t=t.filter(r=>r.taxYear===n.taxYear)),n.startDate&&(t=t.filter(r=>r.date>=n.startDate)),n.endDate&&(t=t.filter(r=>r.date<=n.endDate)),n.sortDesc?t.sort((r,s)=>s.date.localeCompare(r.date)):t.sort((r,s)=>r.date.localeCompare(s.date)),n.limit&&(t=t.slice(0,n.limit)),t}async function cs(n={}){return await Kt(),Jb(n)}async function Xb(n){if(!zo())throw new Error("Must be logged in to save history");const e=await Kt(),t=e.history.findIndex(r=>r.date===n.date);t>=0?e.history[t]=n:e.history.push(n),e.history.sort((r,s)=>r.date.localeCompare(s.date)),await Jf(e.history)}async function tp(n){if(!zo())throw new Error("Must be logged in to delete history");const e=await Kt();e.history=e.history.filter(t=>t.date!==n),await Jf(e.history)}async function ac(n){const e=await En(),t=await Qn(),r=e.spStartDate,s=e.spWeeklyAmount||0;if(!r||!s){let f=null;if(r){const{formatStatePensionDate:m}=await nu(async()=>{const{formatStatePensionDate:g}=await Promise.resolve().then(()=>gd);return{formatStatePensionDate:g}},void 0,import.meta.url);f=m(r)}return{amount:0,monthly:0,yearsUntil:0,isReceiving:!1,isFirstYear:!1,startDate:f}}const{calculateStatePensionForTaxYear:i,getTimeUntilStatePension:a,parseStatePensionDate:l}=await nu(async()=>{const{calculateStatePensionForTaxYear:f,getTimeUntilStatePension:m,parseStatePensionDate:g}=await Promise.resolve().then(()=>gd);return{calculateStatePensionForTaxYear:f,getTimeUntilStatePension:m,parseStatePensionDate:g}},void 0,import.meta.url),c=i({taxYear:n,spStartDate:r,weeklyAmount:s,taxYearConfigs:t}),d=a(r);return{amount:c.annual,monthly:c.monthly,yearsUntil:d.years,monthsUntil:d.months,isReceiving:c.isReceiving,isFirstYear:c.isFirstYear,weeksInYear:c.weeksInYear,startDate:c.startDate}}async function Zb(n){const e=rm(n);e.stdSipp=n.stdSipp||n.sippDraw,await Xb(e),n.taxYear&&await Kb(n.taxYear)}const md={TAX_EFFICIENT:"minimiseEarlyTax",LONGEVITY:"maximiseLongevity"};function eE(n,e){return n<=0?n:n*Math.pow(1+e,1/12)}function np({targetGross:n,fixedIncome:e=0,pa:t,brl:r,hrl:s,isaBalance:i=0,strategy:a=md.TAX_EFFICIENT,yearsUntilSp:l=0}){const c=On(n,t,r,s),d=Math.max(0,Math.min(r,n)-e),f=On(d+e,t,r,s),m=Math.max(0,c-f),g=a===md.LONGEVITY&&l>0?i/l:1/0,b=Math.max(0,Math.min(m,Math.max(0,i),g)),S=i-b,I=m-b;let R=d;if(I>0){const O=im(f+I,t,r,s);R=Math.max(d,O-e)}const C=R+e,M=On(C,t,r,s);return{sippGross:R,isaDraw:b,remainingIsa:S,taxable:C,tax:C-M,net:M+b}}const el={CONSECUTIVE_LIMIT:3,RECOVERY_BUFFER:1e4};function rp({totalGrowth:n,minGrowth:e,consecCashDraws:t,wasInProtection:r,consecutiveLimit:s=el.CONSECUTIVE_LIMIT,recoveryBuffer:i=el.RECOVERY_BUFFER}){let a=!1;return r&&(a=n<=e+i),!a&&n<e&&t+1>=s&&(a=!0),a}const fo={MAX_FRACTION:.5,MIN_BOOST:50,SURPLUS_BUFFER:15e3};function sp({shortfall:n,standardMonthly:e,remainingMonths:t,surplus:r,brlHeadroom:s=1/0,maxFraction:i=fo.MAX_FRACTION,minBoost:a=fo.MIN_BOOST}){if(!(n>0)||!(r>0)||t<1)return 0;const l=[n/t,r/t];if(Number.isFinite(s)){if(s<=0)return 0;l.push(s/t)}l.push(e*i);const c=Math.min(...l);return c>a?c:0}const tE=-.01,nE=5;function ip(n){return Math.max(0,n+tE)}function Ho(n,e,t=0){const r=al(t);let s=n.equityStart,i=n.bondStart,a=n.cashStart,l=n.hodlEnabled?n.hodlStart!==void 0?n.hodlStart:n.hodlValue:0,c=0,d=n.isaBalance||0,f=null;const m=n.isaBalance||0;let g=null,b=0,S=0;const I=new Array(n.years+1).fill(null),R=new Array(n.years+1).fill(null);let C=0,M=0,O=0,V=0,$=!1,H=!1,T=null,v=0,y=0,_=-1;const E=[],A=n.trace?[]:null,w=[];let X=1;E.push({year:0,month:0,equity:s,bond:i,cash:a,hodl:l,total:s+i+a,draw:0,source:"None",inProtection:!1,equityMin:n.equityMin,bondMin:n.bondMin,cashMax:n.cashTarget});for(let te=0;te<n.years*12;te++){const ne=Math.floor(te/12),F=te%12,Re=ne;if(Re!==_&&(v=0,y=0,_=Re),te>0&&te%12===0){const ge=e.inflation[ne]||.025;w.push(ge),X*=1+ge}const ce=e.equity[ne]||0,Jt=e.inflation[ne]||.025,Se=ne>0?e.inflation[ne-1]||.025:Jt,Xt=un(n.equityMin,ne,n.duration,X,!0),Zt=un(n.bondMin,ne,n.duration,X,!0),en=un(n.cashTarget,ne,n.duration,X,!1),St=Xt+Zt,At=$;$=n.disableProtection?!1:rp({totalGrowth:s+i,minGrowth:St,consecCashDraws:V,wasInProtection:At,consecutiveLimit:n.consecutiveLimit,recoveryBuffer:n.recoveryBuffer??el.RECOVERY_BUFFER}),$?(C++,O++):(M=Math.max(M,O),O=0);const{sippMonthly:vt,isaMonthly:tn,planInputs:Vt,taxAnnual:Tn,higherRate:Jn}=iE(n,ne,X,w,d);F===0&&(I[ne]=d/X,R[ne]=(s+i+a)/X),S+=Tn/12/X,Jn&&b++;const ht=vt,xt=ht;let Rt=$?ht*n.protectionMult:ht,ke=Rt;const Xn=tn,tt=A?{month:te,year:ne,monthInYear:F,cumInf:X,equityStart:s,bondStart:i,cashStart:a,isaStart:d,sippMonthly:vt,isaMonthly:tn,effectiveSipp:Rt,effectiveIsa:Xn,boostAmount:0,inProtection:$,planInputs:Vt}:null;tt&&A.push(tt),$&&(v+=xt-ke);const Zn=rE(Jt,ce,Se,r),er=ip(Se),be=ge=>Math.pow(1+(Number.isFinite(ge)?Math.max(-.99,ge):-.99),1/12);if(s*=be(ce),i*=be(Zn),a*=be(er),d=eE(d,n.isaReturn||Dt.RETURN),l>0){const Fe=(r()-.5)*2*.06;let _t=0;ce<-.1?_t=Math.min(.15,Math.abs(ce)*.4):ce<-.05&&(_t=Math.abs(ce)*.2);let Pt=.069+Fe+_t;Pt=Math.max(-.08,Math.min(.18,Pt)),l*=be(Pt)}const Ee=s+i;let ft=0;if(!$){const ge=12-F,wt=y+xt*ge+Vt.fixed;ft=sp({shortfall:v,standardMonthly:xt,remainingMonths:ge,surplus:Ee-St-fo.SURPLUS_BUFFER,brlHeadroom:Vt.brl-wt}),ft>50&&(ke+=ft,v-=ft)}y+=ke,tt&&(tt.effectiveSipp=ke,tt.boostAmount=ft>50?ft:0);let pt="Growth";if(!$&&Ee>=St+ke){const ge=Math.max(0,s-Xt),wt=Math.max(0,i-Zt),Fe=ge+wt;if(Fe>0){if(s-=ke*ge/Fe,i-=ke*wt/Fe,pt="Growth",a<en){const _t=Ee-St-ke;if(_t>5e3){const Pt=Math.min((en-a)*.3,_t*.5);s-=Pt*ge/Fe,i-=Pt*wt/Fe,a+=Pt}}}else a-=ke,pt="Cash"}else if(a>=ke)a-=ke,pt="Cash";else{const ge=ke-a;a=0,i>ge?(i-=ge,pt="Bond"):s>ge?(s-=ge,pt="Equity"):l>ge?(l-=ge,c+=ge,f===null&&(f=te),pt="HODL"):(H=!0,T=te)}if(V=pt==="Growth"?0:V+1,d=Math.max(0,d-Math.min(Xn,d)),g===null&&m>0&&d<=0&&(g=te),s=Math.max(0,s),i=Math.max(0,i),a=Math.max(0,a),(F===0||te===n.years*12-1||H)&&E.push({year:ne+F/12,month:te,equity:s,bond:i,cash:a,hodl:l,total:s+i+a,draw:ke,boostAmount:ft,source:pt,inProtection:$,equityMin:Xt,bondMin:Zt,cashMax:en}),H)break}if(M=Math.max(M,O),!H)I[n.years]=d/(X||1),R[n.years]=(s+i+a)/(X||1);else for(let te=Math.floor(T/12)+1;te<=n.years;te++)R[te]=0;let we=0,j=0,Z=0,oe=0,Ue=1;for(let te=0;te<n.years;te++){const ne=e.inflation[te]??.025;we+=ne,Ue*=1+ne,j+=e.equity[te]??0,te<5&&(Z+=e.equity[te]??0,oe++)}const fe=s+i+a;return{failed:H,duration:n.years,years:H?T/12:n.years,failMonth:T,avgInflation:we/n.years,avgEquityReturn:j/n.years,earlyEquityReturn:oe?Z/oe:0,cumInflation:Ue,finalReal:fe/Ue,final:fe,finalEquity:s,finalBond:i,finalCash:a,finalHodl:l,protMonths:C,maxConsec:M,hodlUsed:c,hodlUsedMonth:f,startIsa:m,finalIsa:d,isaDepletedMonth:g,isaLastedYears:g===null?n.years:g/12,higherRateYears:b/12,totalTaxReal:S,isaByYear:I,potByYear:R,hist:E,trace:A,seed:t}}function rE(n,e,t,r){let s=.15,i=.3,a=.2,l=.1,c=.1,d=.15;const f=t!==void 0?t:n,m=f>.045,g=f>.07;if(m){const O=r()>.3?1:.5;g?(s=.15+.35*O,i=.3-.2*O,d=.15-.1*O,l=.1+.05*O):(s=.15+.2*O,i=.3-.1*O,d=.15-.05*O)}m&&r()<.15&&(s=.2,i=.25,d=.12);const b=n+.005+Ts(0,.03,r),S=.04-(n>.04?(n-.04)*.5:0)+Ts(0,.05,r),I=.03+n*.3+Ts(0,.08,r),R=n*.8+Ts(0,.15,r),C=ip(t),M=e*.5+Ts(0,.02,r);return s*b+i*S+a*I+l*R+c*C+d*M}function sE(n,e){return n.spStartYear!==void 0?Math.max(0,n.spStartYear-e):n.statePensionYear!==void 0?Math.max(0,n.statePensionYear-e):0}function iE(n,e,t,r,s=0){const i=n.taxMode==="frozen"?n.pa:n.pa*t,a=n.taxMode==="frozen"?n.brl:n.brl*t,l=n.taxMode==="frozen"?n.hrl:(n.hrl||125140)*t,c=n.baseSalary*t,d=xd(n.other,r);let f=0;if(n.spStartYear!==void 0){if(e>=n.spStartYear&&n.spWeeklyAmount>0){const S=n.spWeeklyAmount*52;e===n.spStartYear&&n.spFirstYearRatio!==void 0?f=S*n.spFirstYearRatio*t:f=S*t}}else n.statePensionYear!==void 0&&(f=e>=n.statePensionYear?(n.statePension||0)*t:0);const m=d+f,g=sE(n,e),b=np({targetGross:c,fixedIncome:m,pa:i,brl:a,hrl:l,isaBalance:s,strategy:n.isaDrawdownStrategy||Dt.DRAWDOWN_STRATEGY,yearsUntilSp:g});return{sippMonthly:b.sippGross/12,isaMonthly:b.isaDraw/12,taxAnnual:b.tax,higherRate:b.taxable>a+1,planInputs:{target:c,other:d,statePension:f,fixed:m,pa:i,brl:a,hrl:l,yearsUntilSp:g}}}function op(n,e=1e3){const t=[];for(let r=0;r<e;r++)t.push(Ho(n,ap(n,r),r));return t}function ap(n,e){const t=Object.keys($s).map(Number).sort((c,d)=>c-d),r=t.length,s=al(e*12345),i={equity:{},inflation:{}},a=n.blockYears||nE;let l=0;for(;l<n.years;){const c=Math.floor(s()*r);for(let d=0;d<a&&l<n.years;d++,l++){const f=t[(c+d)%r];i.equity[l]=$s[f],i.inflation[l]=il[f]||.025}}return i}function lp(n){const e=Object.keys($s).map(Number).sort((s,i)=>s-i),t=Math.max(...e),r=[];for(const s of e){if(s+n.years-1>t)continue;const i={equity:{},inflation:{}};for(let l=0;l<n.years;l++)i.equity[l]=$s[s+l]||0,i.inflation[l]=il[s+l]||.025;const a=Ho(n,i,s);a.startYear=s,r.push(a)}return r}function oE(n,e){const t={equity:{},inflation:{}};for(let r=0;r<n.years;r++)t.equity[r]=e.equity[r%e.equity.length],t.inflation[r]=e.inflation[r%e.inflation.length];return Ho(n,t,999)}function aE(n){const e=n.filter(t=>t.failed).length;return(n.length-e)/n.length*100}function lE(n){if(!n||n.failCount===0)return"No failures: every run funded the full plan.";const e=i=>(i*100).toFixed(1)+"%",t=`Most failures are late — median failure at year ${Math.round(n.medianFailYear)} of ${n.duration}; ${Math.round(n.pctNearMiss)}% of failures last past year ${Math.round(n.duration*.85)} (near-misses).`,r=[{mag:n.succEarlyEq-n.failEarlyEq,text:`poor early-market returns (sequence-of-returns risk) — failing runs averaged ${e(n.failEarlyEq)} equity in the first 5 years vs ${e(n.succEarlyEq)} for survivors`},{mag:n.succAvgEq-n.failAvgEq,text:`weaker markets over the whole plan — ${e(n.failAvgEq)} average equity return vs ${e(n.succAvgEq)} for survivors`},{mag:n.failAvgInf-n.succAvgInf,text:`higher inflation — ${e(n.failAvgInf)} average vs ${e(n.succAvgInf)} for survivors`}].filter(i=>i.mag>.005).sort((i,a)=>a.mag-i.mag);if(!r.length)return`${t} No single market driver stands out — failures look like broad bad luck across returns and inflation.`;let s=`Failures are driven mainly by ${r[0].text}`;return r[1]&&r[1].mag>r[0].mag*.5&&(s+=`; a secondary factor is ${r[1].text}`),`${t} ${s}.`}function cp(n){const e=n.filter(l=>!l.failed),t=n.filter(l=>l.failed),r=n.map(l=>l.years).sort((l,c)=>l-c),s=e.map(l=>l.final).sort((l,c)=>l-c),i=n.map(l=>l.protMonths).sort((l,c)=>l-c),a=(l,c)=>l[Math.floor(l.length*c)]||0;return{total:n.length,successCount:e.length,failCount:t.length,successRate:aE(n),survival:{p5:a(r,.05),p10:a(r,.1),p25:a(r,.25),p50:a(r,.5),p75:a(r,.75),p90:a(r,.9),p95:a(r,.95),min:r[0],max:r[r.length-1]},finalValue:{p5:a(s,.05),p10:a(s,.1),p25:a(s,.25),p50:a(s,.5),p75:a(s,.75),p90:a(s,.9),p95:a(s,.95),min:s[0]||0,max:s[s.length-1]||0,avg:e.reduce((l,c)=>l+c.final,0)/(e.length||1)},minYears:r[0],p10Years:a(r,.1),medianYears:a(r,.5),medianFinal:a(s,.5),p10Final:a(s,.1),p90Final:a(s,.9),avgFinal:e.reduce((l,c)=>l+c.final,0)/(e.length||1),protection:{runsWithProtection:n.filter(l=>l.protMonths>0).length,pctWithProtection:n.filter(l=>l.protMonths>0).length/n.length*100,avgMonths:i.reduce((l,c)=>l+c,0)/n.length,maxMonths:Math.max(...i),maxConsecutive:Math.max(...n.map(l=>l.maxConsec)),avgConsecutive:n.reduce((l,c)=>l+c.maxConsec,0)/n.length,p50Months:a(i,.5),p90Months:a(i,.9),p95Months:a(i,.95)},runsWithProtection:n.filter(l=>l.protMonths>0).length,avgProtMonths:i.reduce((l,c)=>l+c,0)/n.length,maxProtMonths:Math.max(...i),maxConsecutive:Math.max(...n.map(l=>l.maxConsec)),avgConsecutive:n.reduce((l,c)=>l+c.maxConsec,0)/n.length,hodl:{runsUsingHodl:n.filter(l=>l.hodlUsed>0).length,pctUsingHodl:n.filter(l=>l.hodlUsed>0).length/n.length*100,avgUsed:n.filter(l=>l.hodlUsed>0).length>0?n.filter(l=>l.hodlUsed>0).reduce((l,c)=>l+c.hodlUsed,0)/n.filter(l=>l.hodlUsed>0).length:0,maxUsed:Math.max(...n.map(l=>l.hodlUsed||0))},runsUsingHodl:n.filter(l=>l.hodlUsed>0).length,avgHodlUsed:n.filter(l=>l.hodlUsed>0).length>0?n.filter(l=>l.hodlUsed>0).reduce((l,c)=>l+c.hodlUsed,0)/n.filter(l=>l.hodlUsed>0).length:0,maxHodlUsed:Math.max(...n.map(l=>l.hodlUsed||0)),severity:(()=>{const l=Math.max(...n.map(I=>I.duration||I.years),1),c=n.filter(I=>I.failed),d=n.filter(I=>!I.failed),f=c.map(I=>I.years).sort((I,R)=>I-R),m=l*.85,g=(I,R)=>I.length?I.reduce((C,M)=>C+(M[R]||0),0)/I.length:0,b={duration:l,coverage:n.reduce((I,R)=>I+Math.min(1,(R.years||0)/l),0)/n.length*100,failCount:c.length,medianFailYear:f.length?a(f,.5):0,pctNearMiss:c.length?c.filter(I=>I.years>=m).length/c.length*100:0,failEarlyEq:g(c,"earlyEquityReturn"),succEarlyEq:g(d,"earlyEquityReturn"),failAvgEq:g(c,"avgEquityReturn"),succAvgEq:g(d,"avgEquityReturn"),failAvgInf:g(c,"avgInflation"),succAvgInf:g(d,"avgInflation")};b.diagnosis=lE(b);const S=[{k:"sequence",m:b.succEarlyEq-b.failEarlyEq},{k:"market",m:b.succAvgEq-b.failAvgEq},{k:"inflation",m:b.failAvgInf-b.succAvgInf}].filter(I=>I.m>.005).sort((I,R)=>R.m-I.m);return b.primaryDriver=b.failCount>0&&S.length?S[0].k:null,b})(),finalReal:(()=>{const l=n.map(c=>c.failed?0:c.finalReal||0).sort((c,d)=>c-d);return{p5:a(l,.05),p10:a(l,.1),p25:a(l,.25),p50:a(l,.5),p75:a(l,.75),p90:a(l,.9),p95:a(l,.95),min:l[0]||0,max:l[l.length-1]||0}})(),chartData:(()=>{const l=Math.max(...n.map(m=>m.duration||m.years),1),c=l+1,d={p10:[],p25:[],p50:[],p75:[],p90:[]},f=[];for(let m=0;m<c;m++){const g=n.map(S=>S.potByYear&&S.potByYear[m]!=null?S.potByYear[m]:0).sort((S,I)=>S-I);d.p10.push(a(g,.1)),d.p25.push(a(g,.25)),d.p50.push(a(g,.5)),d.p75.push(a(g,.75)),d.p90.push(a(g,.9));const b=n.filter(S=>(S.failed?S.failMonth/12:l)>=m).length;f.push(n.length?b/n.length*100:0)}return{years:c,potBand:d,solvency:f}})(),isa:(()=>{const l=n.filter(I=>(I.startIsa||0)>0);if(!l.length)return{funded:!1};const c=l.map(I=>I.isaLastedYears).sort((I,R)=>I-R),d=l.map(I=>I.finalIsa).sort((I,R)=>I-R),f=l.map(I=>I.higherRateYears),m=l.map(I=>I.totalTaxReal).sort((I,R)=>I-R),g=Math.max(...l.map(I=>(I.isaByYear||[]).length)),b=[],S=[];for(let I=0;I<g;I++){const R=l.filter(M=>M.isaByYear&&M.isaByYear[I]>0).length;b.push(l.length?R/l.length*100:0);const C=l.filter(M=>M.isaByYear&&M.isaByYear[I]!=null).map(M=>M.isaByYear[I]).sort((M,O)=>M-O);S.push(C.length?C[Math.floor(C.length/2)]:0)}return{funded:!0,runs:l.length,startBalance:l[0].startIsa,medianLastedYears:a(c,.5),minLastedYears:c[0],pctSurviveFullTerm:l.filter(I=>I.isaDepletedMonth===null).length/l.length*100,finalBalance:{p10:a(d,.1),p50:a(d,.5),p90:a(d,.9)},avgHigherRateYears:f.reduce((I,R)=>I+R,0)/l.length,maxHigherRateYears:Math.max(...f),pctEverHigherRate:l.filter(I=>I.higherRateYears>0).length/l.length*100,medianTotalTax:a(m,.5),p90TotalTax:a(m,.9),pctHoldingByYear:b,medianAliveByYear:S}})(),failures:t.map(l=>({seed:l.seed,startYear:l.startYear,years:l.years,failMonth:l.failMonth,protMonths:l.protMonths}))}}function us(n){if(!n)return null;const e={january:0,jan:0,february:1,feb:1,march:2,mar:2,april:3,apr:3,may:4,june:5,jun:5,july:6,jul:6,august:7,aug:7,september:8,sep:8,sept:8,october:9,oct:9,november:10,nov:10,december:11,dec:11},t=n.trim().replace(/\s+/g," ");if(/^\d{4}-\d{2}-\d{2}$/.test(t)){const s=new Date(t);if(!isNaN(s.getTime()))return s}if(/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(t)){const[s,i,a]=t.split("/").map(Number);return new Date(a,i-1,s)}if(/^\d{1,2}-\d{1,2}-\d{4}$/.test(t)){const[s,i,a]=t.split("-").map(Number);return new Date(a,i-1,s)}let r=t.match(/^(\d{1,2})\s+(\w+)\s+(\d{4})$/i);if(r){const s=parseInt(r[1]),i=e[r[2].toLowerCase()],a=parseInt(r[3]);if(i!==void 0)return new Date(a,i,s)}if(r=t.match(/^(\w+)\s+(\d{1,2})\s+(\d{4})$/i),r){const s=e[r[1].toLowerCase()],i=parseInt(r[2]),a=parseInt(r[3]);if(s!==void 0)return new Date(a,s,i)}if(r=t.match(/^(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})$/i),r){const s=e[r[1].toLowerCase()],i=parseInt(r[2]),a=parseInt(r[3]);if(s!==void 0)return new Date(a,s,i)}if(r=t.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+(\w+),?\s+(\d{4})$/i),r){const s=parseInt(r[1]),i=e[r[2].toLowerCase()],a=parseInt(r[3]);if(i!==void 0)return new Date(a,i,s)}return null}function Yi(n){const e=typeof n=="string"?us(n):n;if(!e||isNaN(e.getTime()))return"";const t=["January","February","March","April","May","June","July","August","September","October","November","December"];return`${e.getDate()} ${t[e.getMonth()]} ${e.getFullYear()}`}function cE(n){const{taxYear:e,spStartDate:t,weeklyAmount:r,taxYearConfigs:s={}}=n;if(!t||!r||r<=0)return{annual:0,monthly:0,isReceiving:!1,isFirstYear:!1,weeksInYear:0,startDate:null};const i=typeof t=="string"?us(t):t;if(!i||isNaN(i.getTime()))return{annual:0,monthly:0,isReceiving:!1,isFirstYear:!1,weeksInYear:0,startDate:null};const a=vo(i);fa(e);const l=om(e),c=[...new Set([a,e,...Object.keys(s)])].sort((I,R)=>fa(I).getTime()-fa(R).getTime()),d=c.indexOf(a),f=c.indexOf(e);if(f<d)return{annual:0,monthly:0,isReceiving:!1,isFirstYear:!1,weeksInYear:0,startDate:Yi(i)};let m=1;for(let I=d;I<f;I++){const R=c[I],C=s[R],M=(C==null?void 0:C.cpi)||.025;m*=1+M}const g=r*m;if(e===a){const R=Math.max(0,(l.getTime()-i.getTime())/6048e5),C=g*R;return{annual:C,monthly:C/12,isReceiving:!0,isFirstYear:!0,weeksInYear:Math.round(R*10)/10,startDate:Yi(i)}}const S=g*52;return{annual:S,monthly:S/12,isReceiving:!0,isFirstYear:!1,weeksInYear:52,startDate:Yi(i)}}function uE(n,e=new Date){const t=typeof n=="string"?us(n):n;if(!t||isNaN(t.getTime()))return{years:0,months:0,totalMonths:0,isPast:!1};const r=t.getTime()-e.getTime(),s=r<=0;if(s)return{years:0,months:0,totalMonths:0,isPast:!0};const i=Math.floor(r/(30.44*24*60*60*1e3)),a=Math.floor(i/12),l=i%12;return{years:a,months:l,totalMonths:i,isPast:s}}const up=2016;function jo(n,{now:e=new Date}={}){if(!n||!String(n).trim())return{valid:!0,error:null,warning:null,date:null};const t=us(n);if(!t||isNaN(t.getTime()))return{valid:!1,error:'Could not read that date. Try a format like "6 May 2040".',warning:null,date:null};const r=t.getFullYear();return r<up?{valid:!1,error:`That looks like a date of birth (${r}), not a State Pension start date. Enter the date your State Pension begins — check gov.uk/check-your-state-pension.`,warning:null,date:t}:t.getTime()<e.getTime()?{valid:!0,error:null,warning:`This date is in the past — State Pension will be treated as already in payment from ${r}.`,date:t}:{valid:!0,error:null,warning:null,date:t}}const gd=Object.freeze(Object.defineProperty({__proto__:null,MIN_SP_START_YEAR:up,calculateStatePensionForTaxYear:cE,formatStatePensionDate:Yi,getTimeUntilStatePension:uE,parseStatePensionDate:us,validateStatePensionDate:jo},Symbol.toStringTag,{value:"Module"}));let Ln=null;function Ks(){return{settings:{equityMin:de.EQUITY_MIN,bondMin:de.BOND_MIN,cashTarget:de.CASH_TARGET,duration:de.DURATION_YEARS,baseSalary:de.BASE_SALARY,other:0,statePension:12e3,statePensionYear:12,pa:ze.PERSONAL_ALLOWANCE,brl:ze.BASIC_RATE_LIMIT,hrl:ze.HIGHER_RATE_LIMIT,taxMode:"inflates",protectionMult:dr.PROTECTION_MULTIPLIER,consecutiveLimit:de.CONSECUTIVE_LIMIT,disableProtection:!1,hodlEnabled:dr.HODL_ENABLED,hodlValue:dr.HODL_VALUE},lastModified:null,checksum:null}}function lc(){return Ve()&&dt()}function Yn(){Ln=null}function dE(){return Ln||Ks()}async function dp(){if(Ln)return Ln;if(!lc())return console.warn("Firebase not available - returning defaults"),Ks();try{const n=await Ub();if(n){const e={settings:n,lastModified:new Date().toISOString(),checksum:null};return Ln=pE(e),Ln}}catch(n){console.error("Error loading stress data:",n)}return Ks()}async function hE(n){if(!lc())throw new Error("Must be logged in to save data");try{n.lastModified=new Date().toISOString(),n.checksum=fE(n),await Qf(n.settings),Ln=n}catch(e){throw console.error("Error saving stress data:",e),new Error("Failed to save stress data")}}function fE(n){return ll(n.settings)}function pE(n){const e={...Ks()};return n.settings&&(e.settings={...e.settings,...n.settings},n.settings.pacwMin!==void 0&&n.settings.equityMin===void 0&&(e.settings.equityMin=n.settings.pacwMin),n.settings.cgtMin!==void 0&&n.settings.bondMin===void 0&&(e.settings.bondMin=n.settings.cgtMin),n.settings.csh2Target!==void 0&&n.settings.cashTarget===void 0&&(e.settings.cashTarget=n.settings.csh2Target),e.settings.hodlEnabled===void 0&&(e.settings.hodlEnabled=!1),e.settings.hodlValue===void 0&&(e.settings.hodlValue=25e3)),e.lastModified=n.lastModified,e.checksum=n.checksum,e}function mE(){return dE().settings}async function Qt(){return(await dp()).settings}async function Yo(n){const e=await dp();e.settings={...e.settings,...n},await hE(e)}async function gE(){if(!lc())throw new Error("Must be logged in to reset settings");const n=Ks();await Qf(n.settings),Yn()}function yE(n){if(!n.spStartDate||!n.spWeeklyAmount)return null;const e=us(n.spStartDate);if(!e)return console.warn("Could not parse spStartDate:",n.spStartDate),null;const t=new Date,r=365.25*24*60*60*1e3,s=Math.max(0,(e.getTime()-t.getTime())/r),i=Math.floor(s),a=365,l=Math.floor((e-new Date(e.getFullYear(),0,0))/(24*60*60*1e3)),d=(a-l)/a;return{spStartYear:i,spWeeklyAmount:n.spWeeklyAmount,spFirstYearRatio:d}}function Wo(n={},e=null){const t=e||mE(),r=yE(t),s=r?{spStartYear:r.spStartYear,spWeeklyAmount:r.spWeeklyAmount,spFirstYearRatio:r.spFirstYearRatio}:{statePension:t.statePension||0,statePensionYear:t.statePensionYear??999};return{equityStart:n.equityStart??t.equityMin,bondStart:n.bondStart??t.bondMin,cashStart:n.cashStart??t.cashTarget,equityMin:t.equityMin,bondMin:t.bondMin,cashTarget:t.cashTarget,years:n.years??t.duration,duration:t.duration,baseSalary:t.baseSalary,other:t.other,...s,pa:t.pa,brl:t.brl,hrl:t.hrl,taxMode:t.taxMode,protectionMult:t.protectionMult,consecutiveLimit:t.consecutiveLimit,disableProtection:t.disableProtection,hodlEnabled:t.hodlEnabled,hodlValue:t.hodlValue,isaBalance:t.isaBalance||0,isaReturn:t.isaReturn,isaDrawdownStrategy:t.isaDrawdownStrategy}}function Q(n,e=null){const t=Math.abs(n),r=e!==null?e:t<100,s=Math.abs(n).toLocaleString("en-GB",{minimumFractionDigits:r?2:0,maximumFractionDigits:r?2:0});return n<0?`-£${s}`:`£${s}`}function yd(n,e){const t=vE(n);e.innerHTML=t}function vE(n){var E,A,w,X,we;const e=n,t=e.calculationDetails||{};let r="";const s=e.isTaxEfficientYear??e.taxEfficient,i=e.protectionInducedTaxEfficiency||!1,a=e.boostAmount>0;let l,c,d;if(e.inProtection?(l="warning",c="Protection Mode",d="⚡"):a?(l="boost",c="Tax Boost (Catch-up)",d="↑"):i?(l="info",c="Protection-Induced Tax Efficiency",d="↑"):s?(l="success",c="Tax-Efficient Year",d="✓"):(l="warning",c="Tax-Inefficient Year",d="!"),r+=`<div class="decision-mode ${l}">
    <span class="mode-icon">${d}</span>
    <span class="mode-label">${c}</span>
  </div>`,s&&e.yearlyIsaSavingsAllocation>0){const j=e.cumulativeIsaSavingsUsed||0,Z=e.yearlyIsaSavingsAllocation,oe=Math.max(0,Z-j),Ue=Z>0?j/Z*100:0;r+=`<div class="isa-progress-card">
      <h4>ISA/Savings Allocation</h4>
      <div class="isa-progress-bar">
        <div class="isa-progress-fill" style="width: ${Math.min(Ue,100)}%"></div>
      </div>
      <div class="isa-progress-stats">
        <span>Used: ${Q(j)} of ${Q(Z)}</span>
        <span>Remaining: ${Q(oe)}</span>
      </div>
    </div>`}if(e.alerts&&e.alerts.length>0){r+='<div class="alerts">';for(const j of e.alerts){const Z=wE(j.severity);r+=`<div class="alert ${Z}">${j.message}</div>`}r+="</div>"}r+='<div class="recommendation-card">',r+="<h3>Monthly Recommendation</h3>",r+='<div class="draw-row primary">',r+='<span class="label">SIPP Withdrawal</span>',r+=`<span class="value">${Q(e.sippDraw)}</span>`,r+="</div>",e.isaDraw>0&&(r+='<div class="draw-row">',r+='<span class="label">ISA Top-up</span>',r+=`<span class="value">${Q(e.isaDraw)}</span>`,r+="</div>"),e.other>0&&(r+='<div class="draw-row muted">',r+='<span class="label">Other Pension</span>',r+=`<span class="value">${Q(e.other)}</span>`,r+="</div>"),e.statePension>0&&(r+='<div class="draw-row muted">',r+='<span class="label">State Pension</span>',r+=`<span class="value">${Q(e.statePension)}</span>`,r+="</div>"),r+='<div class="divider"></div>';const f=e.sippDraw+e.other+e.statePension,m=f*12,g=e.pa||12570,b=e.brl||50270;let S=0;m>g&&(m<=b?S=(m-g)*.2:S=(b-g)*.2+(m-b)*.4);const I=f-S/12+e.isaDraw;r+='<div class="draw-row total">',r+='<span class="label">Total Monthly Income</span>',r+=`<span class="value">${Q(I)}</span>`,r+="</div>",e.boostAmount>0&&(r+='<div class="boost-indicator">',r+='<span class="boost-label">Includes Tax Boost:</span>',r+=`<span class="boost-value">+${Q(e.boostAmount)}</span>`,r+="</div>"),r+="</div>",r+='<div class="source-card">',r+="<h4>Withdraw From</h4>",r+=`<div class="source-label ${e.source.toLowerCase()}">${e.source}</div>`,e.source==="Growth"&&(e.drawFromEquity>0||e.drawFromBond>0)&&(r+='<div class="source-breakdown">',e.drawFromEquity>0&&(r+=`<div class="source-item">Equity: ${Q(e.drawFromEquity)}</div>`),e.drawFromBond>0&&(r+=`<div class="source-item">Bond: ${Q(e.drawFromBond)}</div>`),r+="</div>"),r+="</div>",r+='<div class="fund-status">',r+="<h4>Fund Status</h4>";const R=e.equity+e.bond+e.cash,C=e.adjEquityMin+e.adjBondMin+e.adjCashTarget,M=R-C,O=C>0?M/C*100:0;r+='<div class="fund-grid">';const V=e.equity-e.adjEquityMin;r+=xa("Equity",e.equity,e.adjEquityMin,V);const $=e.bond-e.adjBondMin;r+=xa("Bond",e.bond,e.adjBondMin,$);const H=e.cash-e.adjCashTarget;r+=xa("Cash",e.cash,e.adjCashTarget,H),r+="</div>";const T=M>=0?"healthy":"warning";r+=`<div class="overall-status ${T}">`,r+=`<span>Total Surplus: ${Q(M)}</span>`,r+=`<span>(${O.toFixed(1)}% above target)</span>`,r+="</div>",r+="</div>",r+='<div class="tax-info">',r+="<h4>Tax Summary</h4>",r+='<div class="tax-thresholds">',r+=`<div class="tax-threshold-item"><span class="label">PA:</span><span>${Q(e.pa)}</span></div>`,r+=`<div class="tax-threshold-item"><span class="label">BRL:</span><span>${Q(e.brl)}</span></div>`,t.taxInfo&&(r+=`<div class="tax-threshold-item"><span class="label">Headroom:</span><span class="${t.taxInfo.headroomToBRL>0?"success":"warning"}">${Q(t.taxInfo.headroomToBRL)}</span></div>`),r+="</div>",r+='<div class="tax-comparison">',r+='<div class="tax-comparison-header">',r+="<div></div><div>Monthly</div><div>YTD</div><div>Projected</div>",r+="</div>";const v=((E=t.taxInfo)==null?void 0:E.monthlyTax)||S/12,y=e.taxPaidYTD||v,_=e.taxProjectedAnnual||((A=t.taxInfo)==null?void 0:A.annualTax)||S;if(r+='<div class="tax-comparison-row">',r+='<div class="label">Tax Paid</div>',r+=`<div>${Q(v)}</div>`,r+=`<div>${Q(y)}</div>`,r+=`<div>${Q(_)}</div>`,r+="</div>",s||((w=t.taxInfo)==null?void 0:w.taxSavedAnnual)>0){const j=e.taxSavedMonthly||((X=t.taxInfo)==null?void 0:X.taxSavedMonthly)||0,Z=e.taxSavedYTD||j,oe=e.taxSavedProjectedAnnual||((we=t.taxInfo)==null?void 0:we.taxSavedAnnual)||0;oe>0&&(r+='<div class="tax-comparison-row saved">',r+='<div class="label">Tax Saved</div>',r+=`<div class="success">-${Q(j)}</div>`,r+=`<div class="success">-${Q(Z)}</div>`,r+=`<div class="success">-${Q(oe)}</div>`,r+="</div>")}if(r+="</div>",t.taxInfo&&typeof t.taxInfo.effectiveRate=="number"&&!isNaN(t.taxInfo.effectiveRate)){const j=t.taxInfo.effectiveRate*100;r+=`<div class="effective-rate">
      <span>Effective Tax Rate:</span>
      <span class="${j<=20?"success":j<=40?"warning":"danger"}">${j.toFixed(1)}%</span>
    </div>`}else if(t.taxInfo&&t.taxInfo.annualTaxable>0&&t.taxInfo.annualTax>=0){const j=t.taxInfo.annualTax/t.taxInfo.annualTaxable*100;r+=`<div class="effective-rate">
      <span>Effective Tax Rate:</span>
      <span class="${j<=20?"success":j<=40?"warning":"danger"}">${j.toFixed(1)}%</span>
    </div>`}if(r+="</div>",e.rebalanceNeeded&&e.rebalanceActions.length>0){r+='<div class="rebalance-card">',r+="<h4>Rebalancing Suggestions</h4>",r+="<ul>";for(const j of e.rebalanceActions)r+=`<li>${j}</li>`;r+="</ul>",r+="</div>"}return r+='<div class="mode-explanation">',r+="<h4>Why This Recommendation?</h4>",r+=`<p>${t.reason||"Standard calculation based on your settings."}</p>`,!t.hasSufficientIsa&&t.isaNeededMonthly>0&&(r+=`<p class="isa-warning">To enable tax-efficient mode, you need ${Q(t.totalIsaNeeded)} in your ISA (${e.remainingMonths} months remaining in tax year).</p>`),r+="</div>",r+='<details class="debug-section">',r+="<summary>Calculation Details</summary>",r+="<pre>"+JSON.stringify(t,null,2)+"</pre>",r+="</details>",r}function xa(n,e,t,r){return`<div class="fund-cell ${r>=0?"healthy":"deficit"}">
    <div class="fund-name">${n}</div>
    <div class="fund-current">${Q(e)}</div>
    <div class="fund-min">Min: ${Q(t)}</div>
    <div class="fund-surplus">${r>=0?"+":""}${Q(r)}</div>
  </div>`}function wE(n){switch(n){case Ci.DANGER:return"alert-danger";case Ci.WARNING:return"alert-warning";case Ci.SUCCESS:return"alert-success";case Ci.INFO:default:return"alert-info"}}function _E(){return`
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
  `}async function bE(n){const e=ol(n),t=vo(e),r=e.getMonth()+1;return await Qb(t)?{showWizard:!1,taxYear:t,isApril:r===4,reason:"Year setup already complete"}:{showWizard:!0,taxYear:t,isApril:r===4,reason:`Tax year ${t} has not been set up`}}function EE(n,e){return n*(1+e)}function TE(n){const{targetAnnualGross:e,brl:t,pa:r=12570,remainingMonths:s,grossIncomeToDate:i=0}=n,a=S=>S<=r?0:S<=t?(S-r)*.2:(t-r)*.2+(S-t)*.4,l=Math.max(0,t-i);if(l<=0)return{isaNeeded:0,brlExhausted:!0,remainingBrlHeadroom:0,maxTaxEfficientSalary:t,reducedSalaryOption:t,canBeTaxEfficient:!1,reason:"BRL already exhausted by prior income"};if(e<=t)return{isaNeeded:0,brlExhausted:!1,remainingBrlHeadroom:l,maxTaxEfficientSalary:t,reducedSalaryOption:t,canBeTaxEfficient:!0,targetAchievableAtBrl:!0,reason:"Target achievable at BRL without ISA"};const c=a(e),d=e-c,f=a(t),m=t-f,g=Math.max(0,d-m),b=g/12*s;return{isaNeeded:b,isaNeededAnnual:g,brlExhausted:!1,remainingBrlHeadroom:l,maxTaxEfficientSalary:t,reducedSalaryOption:t,canBeTaxEfficient:!0,targetAchievableAtBrl:!1,netAtTarget:d,netAtBrl:m,taxAtTarget:c,taxAtBrl:f,reason:`Need £${Math.round(b).toLocaleString()} ISA/Savings for tax efficiency`}}function IE(n,e,t){return t?{sufficient:!1,isBrlExhausted:!0,options:[{key:"reduced",label:"Reduce salary to BRL",description:"Accept lower income to stay tax-efficient"},{key:"inefficient",label:"Accept tax-inefficient year",description:"Draw full SIPP, pay 40% on excess"}]}:n>=e?{sufficient:!0,isBrlExhausted:!1,options:[]}:{sufficient:!1,isBrlExhausted:!1,shortfall:e-n,options:[{key:"increase",label:`Increase ISA to £${Math.round(e).toLocaleString()}`,description:"Provide enough ISA for tax efficiency"},{key:"reduced",label:"Reduce salary to BRL",description:"Keep ISA to grow, accept lower income"},{key:"inefficient",label:"Accept tax-inefficient year",description:"Draw full SIPP, ISA stays untouched"}]}}async function SE(n){const e=ol(n),t=vo(e),s=e.getMonth()+1===4,i=lm(e),a=await En(),l=await qo(t),c=await Qn(),d=Object.keys(c).sort(),f=d.indexOf(t)-1,m=f>=0?c[d[f]]:null,g=await ac(t),b=(m==null?void 0:m.cpi)||.025,S=EE(a.baseSalary,b);return{taxYear:t,selectedMonth:n,isApril:s,remainingMonths:i,baseSalary:a.baseSalary,suggestedSalary:S,defaults:{pa:(m==null?void 0:m.pa)||l.pa,brl:(m==null?void 0:m.brl)||l.brl,hrl:(m==null?void 0:m.hrl)||l.hrl,cpi:b,other:(m==null?void 0:m.other)||0},statePension:g,existingConfig:l.yearSetupComplete?l:null}}function hp(n){const{targetSalary:e,brl:t,pa:r=12570,other:s=0,statePension:i=0,isaSavingsAllocation:a=0,remainingMonths:l,grossIncomeToDate:c=0,isTaxEfficient:d=!0}=n,f=A=>A<=r?0:A<=t?(A-r)*.2:(t-r)*.2+(A-t)*.4,m=s/12,g=i/12,b=m+g;let S,I;if(!d)S=e/12-b,I=0;else{const A=Math.max(0,t-c),w=Math.max(0,A/l-b);S=Math.min(e/12-b,w),I=a/l}const R=(S+b)*12,M=f(R)/12,O=S+b,V=O>0?M/O:0,$=S*V,H=m*V,T=g*V,v=S-$,y=m-H,_=g-T,E=v+y+_+I;return{sipp:{gross:S,tax:$,net:v},other:{gross:m,tax:H,net:y},statePension:{gross:g,tax:T,net:_},isa:{gross:I,tax:0,net:I},totalGross:S+m+g+I,totalTax:M,totalNet:E,mode:d?"tax-efficient":"tax-inefficient",monthlySipp:S,monthlyIsa:I,monthlyOther:m,monthlyStatePension:g,monthlyTotal:E}}function AE(n){var I,R,C,M,O,V,$,H,T,v,y;const{pa:e,brl:t,hrl:r,cpi:s,other:i,isaSavingsAllocation:a,isTaxEfficient:l,taxEfficiencyChoice:c,grossIncomeToDate:d,startMonth:f,confirmedSalary:m,remainingMonths:g,statePension:b,monthlyBreakdown:S}=n;return{pa:e,brl:t,hrl:r,cpi:s,other:i,isaSavingsAllocation:l?a:0,isaSavingsUsed:0,isTaxEfficient:l,taxEfficiencyChoice:c,grossIncomeToDate:d||0,startMonth:f||4,remainingMonths:g||12,yearSetupComplete:!0,confirmedSalary:m,statePension:b||0,expectedMonthly:S?{sipp:{gross:((I=S.sipp)==null?void 0:I.gross)||0,tax:((R=S.sipp)==null?void 0:R.tax)||0,net:((C=S.sipp)==null?void 0:C.net)||0},other:{gross:((M=S.other)==null?void 0:M.gross)||0,tax:((O=S.other)==null?void 0:O.tax)||0,net:((V=S.other)==null?void 0:V.net)||0},statePension:{gross:(($=S.statePension)==null?void 0:$.gross)||0,tax:((H=S.statePension)==null?void 0:H.tax)||0,net:((T=S.statePension)==null?void 0:T.net)||0},isa:{gross:((v=S.isa)==null?void 0:v.gross)||0,tax:0,net:((y=S.isa)==null?void 0:y.net)||0},totalGross:S.totalGross||0,totalTax:S.totalTax||0,totalNet:S.totalNet||0}:null}}let fr=null,Qs=null,Et=1,J=null,L={};async function xE(n,e,t){fr=n,Qs=t,Et=1,L={},J=await SE(e),L={pa:J.defaults.pa,brl:J.defaults.brl,hrl:J.defaults.hrl,cpi:J.defaults.cpi,other:J.defaults.other,grossIncomeToDate:0,confirmedSalary:J.suggestedSalary,isaSavingsAllocation:0,isTaxEfficient:!0,taxEfficiencyChoice:null},Fs()}async function RE(n){return await bE(n)}function Fs(){if(!fr||!J)return;const n=J.isApril?6:7;fr.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Tax Year ${J.taxYear} Setup</div>
        <div class="wizard-subtitle">
          ${J.isApril?"Setting up for the full tax year":`Starting in ${cc(J.selectedMonth)} - ${J.remainingMonths} months remaining`}
        </div>

        <div class="wizard-progress">
          ${kE(n,Et)}
        </div>

        ${PE()}
      </div>
    </div>
  `,ME()}function PE(){if(J.isApril,J.isApril)switch(Et){case 1:return vd();case 2:return wd();case 3:return _d();case 4:return bd();case 5:return Ed();case 6:return Td();default:return""}else switch(Et){case 1:return vd();case 2:return CE();case 3:return wd();case 4:return _d();case 5:return bd();case 6:return Ed();case 7:return Td();default:return""}}function vd(){return`
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
            <input type="number" id="wizPA" value="${L.pa}">
          </div>
        </div>
        <div class="wizard-grid-item">
          <label>Basic Rate Limit</label>
          <div class="wizard-input">
            <span class="wizard-unit">£</span>
            <input type="number" id="wizBRL" value="${L.brl}">
          </div>
        </div>
        <div class="wizard-grid-item">
          <label>Higher Rate Limit</label>
          <div class="wizard-input">
            <span class="wizard-unit">£</span>
            <input type="number" id="wizHRL" value="${L.hrl}">
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
  `}function CE(){const n=cc(J.selectedMonth),e=OE(J.selectedMonth);return`
    <div class="wizard-step">
      <div class="wizard-step-title">Income Before Starting Pension</div>
      <div class="wizard-step-desc">
        You're starting your pension drawdown in ${n}. Enter any taxable income you've already received this tax year (April to ${e}).
      </div>

      <div class="wizard-input">
        <span class="wizard-unit">£</span>
        <input type="number" id="wizIncomeToDate" value="${L.grossIncomeToDate}" placeholder="0">
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
  `}function wd(){const n=L.cpi!==void 0?L.cpi:J.defaults.cpi,e=(n*100).toFixed(1),t=J.baseSalary,r=Math.round(t*(1+n));return`
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
        <input type="number" id="wizSalary" value="${Math.round(L.confirmedSalary||r)}">
        <span class="wizard-unit">per year</span>
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="back">Back</button>
        <button class="wizard-btn primary" data-action="next">Next</button>
      </div>
    </div>
  `}function _d(){const n=J.statePension,e=n.isReceiving?`<span style="color: var(--success);">Receiving £${Math.round(n.amount).toLocaleString()}/year</span>`:`<span style="color: var(--text-muted);">${n.yearsUntil} years until state pension</span>`;return`
    <div class="wizard-step">
      <div class="wizard-step-title">Other Taxable Income</div>
      <div class="wizard-step-desc">
        Enter any other taxable income you'll receive this tax year (annual amount).
      </div>

      <div class="wizard-input">
        <span class="wizard-unit">£</span>
        <input type="number" id="wizOther" value="${L.other}">
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
  `}function bd(){pi();const n=TE({targetAnnualGross:L.confirmedSalary,brl:L.brl,pa:L.pa,other:L.other,statePension:J.statePension.amount,remainingMonths:J.remainingMonths,grossIncomeToDate:L.grossIncomeToDate});return L._isaCalc=n,n.brlExhausted?`
      <div class="wizard-step">
        <div class="wizard-step-title">BRL Already Exhausted</div>

        <div class="wizard-info-box" style="background: rgba(231, 76, 60, 0.2); border: 1px solid var(--danger);">
          <p style="color: var(--danger); font-weight: 500;">
            Your income to date (£${L.grossIncomeToDate.toLocaleString()}) has already exceeded the BRL (£${L.brl.toLocaleString()}).
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
            Your target salary of £${Math.round(L.confirmedSalary).toLocaleString()} is achievable within the BRL.
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
          £${Math.round(n.isaNeeded).toLocaleString()}
        </p>
        <p>from ISA/Savings</p>
        <p style="font-size: 12px; color: var(--text-muted); margin-top: 8px;">
          This keeps your SIPP draw at the BRL (£${L.brl.toLocaleString()}) while reaching your target salary.
        </p>
      </div>

      <div class="wizard-step-desc" style="margin-top: 16px;">
        How much ISA/Savings can you allocate this tax year?
      </div>

      <div class="wizard-input">
        <span class="wizard-unit">£</span>
        <input type="number" id="wizISA" value="${L.isaSavingsAllocation||Math.round(n.isaNeeded)}">
      </div>

      <div class="wizard-example">
        <strong>Tip:</strong> This is money you'll withdraw tax-free from ISA or savings to supplement your SIPP income.
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="back">Back</button>
        <button class="wizard-btn primary" data-action="next">Next</button>
      </div>
    </div>
  `}function Ed(){pi();const n=L._isaCalc,e=IE(L.isaSavingsAllocation,(n==null?void 0:n.isaNeeded)||0,(n==null?void 0:n.brlExhausted)||!1);if(e.sufficient&&!e.isBrlExhausted)return L.isTaxEfficient=!0,L.taxEfficiencyChoice="efficient",setTimeout(()=>{Et++,Fs()},0),`
      <div class="wizard-step">
        <div class="wizard-step-title">Setting Up Tax Efficiency...</div>
        <div class="wizard-info-box">
          <p>Your ISA allocation is sufficient for tax efficiency.</p>
        </div>
      </div>
    `;const t=e.shortfall>0?`You entered £${L.isaSavingsAllocation.toLocaleString()} but need £${Math.round(n.isaNeeded).toLocaleString()}.`:"";return`
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
            <input type="radio" name="taxChoice" value="increase" ${L.taxEfficiencyChoice==="increase"?"checked":""}>
            <div class="wizard-option-content">
              <strong>Increase ISA to £${Math.round(n.isaNeeded).toLocaleString()}</strong>
              <p>Provide enough ISA/Savings for tax efficiency</p>
            </div>
          </label>
        `}

        <label class="wizard-option">
          <input type="radio" name="taxChoice" value="reduced" ${L.taxEfficiencyChoice==="reduced"?"checked":""}>
          <div class="wizard-option-content">
            <strong>Reduce salary to BRL (£${L.brl.toLocaleString()})</strong>
            <p>Keep ISA/Savings to grow, accept lower income this year</p>
          </div>
        </label>

        <label class="wizard-option">
          <input type="radio" name="taxChoice" value="inefficient" ${L.taxEfficiencyChoice==="inefficient"?"checked":""}>
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
  `}function Td(){pi();const n=hp({targetSalary:L.confirmedSalary,brl:L.brl,pa:L.pa,other:L.other,statePension:J.statePension.amount,isaSavingsAllocation:L.isaSavingsAllocation,remainingMonths:J.remainingMonths,grossIncomeToDate:L.grossIncomeToDate,isTaxEfficient:L.isTaxEfficient}),e=L.isTaxEfficient?"Tax-Efficient":"Tax-Inefficient",t=L.isTaxEfficient?"success":"warning",r=s=>`£${Math.round(s).toLocaleString()}`;return`
    <div class="wizard-step">
      <div class="wizard-step-title">Confirm Tax Year Setup</div>

      <div class="wizard-summary">
        <div class="wizard-summary-row">
          <span>Tax Year:</span>
          <span>${J.taxYear}</span>
        </div>
        <div class="wizard-summary-row">
          <span>Starting Month:</span>
          <span>${cc(J.selectedMonth)}</span>
        </div>
        <div class="wizard-summary-row">
          <span>Remaining Months:</span>
          <span>${J.remainingMonths}</span>
        </div>
        ${L.grossIncomeToDate>0?`
          <div class="wizard-summary-row">
            <span>Income to Date:</span>
            <span>${r(L.grossIncomeToDate)}</span>
          </div>
        `:""}
        <div class="wizard-summary-row">
          <span>Target Salary:</span>
          <span>${r(L.confirmedSalary)}/year</span>
        </div>
        <div class="wizard-summary-row">
          <span>Tax Mode:</span>
          <span class="${t}">${e}</span>
        </div>
        <div class="wizard-summary-row">
          <span>ISA Allocation:</span>
          <span>${r(L.isaSavingsAllocation)}</span>
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
  `}function kE(n,e){let t="";for(let r=1;r<=n;r++){const s=r<e?"done":r===e?"active":"";t+=`<div class="wizard-dot ${s}"></div>`}return t}function ME(){fr.querySelectorAll("[data-action]").forEach(e=>{e.addEventListener("click",()=>DE(e.dataset.action))}),window._updateWizardSalary=function(){const e=document.getElementById("wizCPI"),t=document.getElementById("wizSalary"),r=document.getElementById("cpiDisplay"),s=document.getElementById("suggestedSalaryDisplay");if(e&&t&&r&&s){const i=parseFloat(e.value)||0,a=i/100,l=J.baseSalary,c=Math.round(l*(1+a));r.textContent=i.toFixed(1),s.textContent=c.toLocaleString(),t.value=c,L.cpi=a,L.confirmedSalary=c}}}function DE(n){pi();const e=J.isApril?6:7;switch(n){case"cancel":fp(),Qs&&Qs({completed:!1,cancelled:!0});break;case"next":Et<e&&(Et++,Fs());break;case"back":Et>1&&(Et--,Fs());break;case"apply-choice":NE(),Et++,Fs();break;case"finish":LE();break}}function NE(){var e;const n=(e=document.querySelector('input[name="taxChoice"]:checked'))==null?void 0:e.value;switch(L.taxEfficiencyChoice=n,n){case"increase":L.isaSavingsAllocation=L._isaCalc.isaNeeded,L.isTaxEfficient=!0;break;case"reduced":L.confirmedSalary=L.brl,L.isaSavingsAllocation=0,L.isTaxEfficient=!0;break;case"inefficient":L.isaSavingsAllocation=0,L.isTaxEfficient=!1;break}}function pi(){const n=document.getElementById("wizPA");n&&(L.pa=parseFloat(n.value)||12570);const e=document.getElementById("wizBRL");e&&(L.brl=parseFloat(e.value)||50270);const t=document.getElementById("wizHRL");t&&(L.hrl=parseFloat(t.value)||125140);const r=document.getElementById("wizCPI");r&&(L.cpi=(parseFloat(r.value)||4)/100);const s=document.getElementById("wizSalary");s&&(L.confirmedSalary=parseFloat(s.value)||3e4);const i=document.getElementById("wizOther");i&&(L.other=parseFloat(i.value)||0);const a=document.getElementById("wizISA");a&&(L.isaSavingsAllocation=parseFloat(a.value)||0);const l=document.getElementById("wizIncomeToDate");l&&(L.grossIncomeToDate=parseFloat(l.value)||0)}async function LE(){pi();const n=hp({targetSalary:L.confirmedSalary,brl:L.brl,pa:L.pa,other:L.other,statePension:J.statePension.amount,isaSavingsAllocation:L.isaSavingsAllocation,remainingMonths:J.remainingMonths,grossIncomeToDate:L.grossIncomeToDate,isTaxEfficient:L.isTaxEfficient}),e=AE({pa:L.pa,brl:L.brl,hrl:L.hrl,cpi:L.cpi,other:L.other,isaSavingsAllocation:L.isaSavingsAllocation,isTaxEfficient:L.isTaxEfficient,taxEfficiencyChoice:L.taxEfficiencyChoice,grossIncomeToDate:L.grossIncomeToDate,startMonth:parseInt(J.selectedMonth.split("-")[1]),confirmedSalary:L.confirmedSalary,remainingMonths:J.remainingMonths,statePension:J.statePension.amount,monthlyBreakdown:n});console.log(`Tax Year Wizard: Saving config for ${J.taxYear}`,e);try{await Ar(J.taxYear,e),console.log(`Tax Year Wizard: Successfully saved config for ${J.taxYear}`)}catch(t){console.error(`Tax Year Wizard: Failed to save config for ${J.taxYear}`,t),typeof window.showToast=="function"&&window.showToast(`Error saving tax year configuration: ${t.message}`,"error");return}fp(),Qs&&Qs({completed:!0,taxYear:J.taxYear,config:e,wizardInputs:L})}function fp(){fr&&(fr.innerHTML="",fr.style.display="none")}function cc(n){const[e,t]=n.split("-").map(Number);return new Date(e,t-1,1).toLocaleString("default",{month:"long",year:"numeric"})}function OE(n){const[e,t]=n.split("-").map(Number);return new Date(e,t-2,1).toLocaleString("default",{month:"long"})}function BE(){return`
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
  `}function VE(n={},e=null){const t=Wo(n,e),r=op(t),s=cp(r);return{results:r,stats:s,config:t}}function FE(n={},e=null){const t=Wo(n,e),r=lp(t),s=cp(r);return{results:r,stats:s,config:t}}function $E(n={}){const e=Wo(n),t={};for(const[r,s]of Object.entries(sm))t[r]={...s,result:oE(e,s)};return t}function pp(n){return vo(ol(n))}function zE(n){const[e,t]=n.split("-").map(Number);return Math.max(0,(t>=4?e:e-1)-2026)}async function UE(n,e,t,r,s){var Pr,Cr,Ft,hs;const i=s.settings,a=s.history,l=s.allTaxYears,c=pp(n),d=zE(n),[f,m]=n.split("-").map(Number);if(!l[c])throw new Error(`Tax year ${c} is not configured. Please add it in the Settings tab before calculating.`);const g=l[c],b=g.pa||12570,S=g.brl||50270,I=g.hrl||125140,R=g.other||0,C=g.isTaxEfficient!==!1,M=g.isaSavingsAllocation||0,O=g.grossIncomeToDate||0,V=g.confirmedSalary||i.baseSalary,$=a.find(ee=>ee.date===n),H=($==null?void 0:$.isa)||0,T=Math.max(0,(g.isaSavingsUsed||0)-H),y=s.spInfo.amount||0;let _=1;for(let ee=0;ee<d;ee++){const Le=String((26+ee)%100).padStart(2,"0")+"/"+String((27+ee)%100).padStart(2,"0"),Ae=(l[Le]||{}).cpi||cm;_*=1+Ae}const E=Math.round(un(i.equityMin,d,i.duration,_,!0)),A=Math.round(un(i.bondMin,d,i.duration,_,!0)),w=Math.round(un(i.cashTarget,d,i.duration,_,!1)),X=e+t,we=E+A;let j=0;const Z=a.filter(ee=>ee.date<n);for(let ee=Z.length-1;ee>=0&&Z[ee].source==="Cash";ee--)j++;const oe=rp({totalGrowth:X,minGrowth:we,consecCashDraws:j,wasInProtection:Z.length>0&&Z[Z.length-1].inProtection,consecutiveLimit:i.consecutiveLimit||3,recoveryBuffer:i.recoveryBuffer||1e4}),Ue=m>=4?16-m:4-m,fe=Math.max(1,Ue),te=V*_,ne=R+y;On(te,b,S,I);let F,Re,ce,Jt=0,Se=0,Xt=!1,Zt=0;const St=Math.max(0,M-T)/fe;if(C){const ee=ne/12;a.filter(Pe=>Pe.taxYear===c&&Pe.date<n);const Le=te/12,Ae=s.isaBalance||0;let nt,ye;if(Ae>0){const Pe=np({targetGross:te,fixedIncome:ne,pa:b,brl:S,hrl:I,isaBalance:Ae,strategy:i.isaDrawdownStrategy||"minimiseEarlyTax",yearsUntilSp:0});nt=Pe.sippGross/12,ye=Pe.isaDraw/12}else{if(((Cr=(Pr=g.expectedMonthly)==null?void 0:Pr.sipp)==null?void 0:Cr.gross)>0)nt=g.expectedMonthly.sipp.gross;else{const me=Math.max(0,S-O-ne)/12;nt=Math.min(Le-ee,me)}const Pe=On(te,b,S,I)/12,rt=Math.min(te,S),pe=On(rt,b,S,I)/12,qe=Math.max(0,Pe-pe);ye=Math.min(qe,St)}if(Zt=ye,Jt=nt,oe){const Pe=(i.protectionFactor||20)/100;F=nt*(1-Pe),Re=ye,ce="Protection"}else{F=nt,Re=ye,ce="Tax-Efficient";const Pe=m>=4?f:f-1,rt=Z.filter(me=>{const[nr,fs]=me.date.split("-").map(Number);return(fs>=4?nr:nr-1)===Pe});let pe=0,qe=0;rt.forEach(me=>{qe+=me.sipp||0,me.inProtection&&me.stdSipp&&(pe+=me.stdSipp-me.sipp),me.boostAmount>0&&(pe-=me.boostAmount)});const st=qe+F*fe+ne;Se=sp({shortfall:pe,standardMonthly:nt,remainingMonths:fe,surplus:X-we-fo.SURPLUS_BUFFER,brlHeadroom:S-st}),Se>50&&(F+=Se,ce="Tax Boost")}}else{const ee=te/12,Le=ne/12;let Ae;if(((hs=(Ft=g.expectedMonthly)==null?void 0:Ft.sipp)==null?void 0:hs.gross)>0?Ae=g.expectedMonthly.sipp.gross:Ae=Math.max(0,ee-Le),Jt=Ae,Re=0,oe){const nt=(i.protectionFactor||20)/100;F=Ae*(1-nt),ce="Protection";const ye=m>=4?f:f-1,Pe=Z.filter(qe=>{const[st,me]=qe.date.split("-").map(Number);return(me>=4?st:st-1)===ye});let rt=0;Pe.forEach(qe=>{rt+=qe.sipp||0});const pe=rt+F*fe+ne;if(pe<S){const st=(S-pe)/fe,me=X-we-(i.recoveryBuffer||1e4);me>0&&st>50&&(Se=Math.min(st,me/fe),Se>50&&(F+=Se,Xt=!0,ce="Protection-Induced Efficiency"))}}else{F=Ae,ce="Tax-Inefficient";const nt=m>=4?f:f-1,ye=Z.filter(pe=>{const[qe,st]=pe.date.split("-").map(Number);return(st>=4?qe:qe-1)===nt});let Pe=0,rt=0;if(ye.forEach(pe=>{rt+=pe.sipp||0,pe.inProtection&&pe.stdSipp&&(Pe+=pe.stdSipp-pe.sipp),pe.boostAmount>0&&(Pe-=pe.boostAmount)}),Pe>0){const pe=rt+F*fe+ne,qe=S-pe,st=X-we-(i.recoveryBuffer||1e4);if(qe>0&&st>0){const me=qe/fe,nr=Pe/fe,fs=st/fe;Se=Math.min(nr,me,fs),Se>50&&(F+=Se,ce="Tax Boost")}}}}let At,vt,tn=0,Vt=0,Tn=0,Jn="";if(!oe&&X>=we+F){At="Growth";const ee=Math.max(0,e-E),Le=Math.max(0,t-A),Ae=ee+Le;Ae>0?(tn=F*ee/Ae,Vt=F*Le/Ae,vt="Healthy"):(At="Cash",Tn=F,vt="At min")}else At="Cash",Tn=F,vt=oe?"Protection":"Below min",r<F&&(Jn="Cash low!");let ht="";const xt=e-E,Rt=t-A;if(xt>5e3&&Rt<-5e3){const ee=Math.floor(Math.min(xt,-Rt)/1e3)*1e3;ee>=5e3&&(ht=`Move £${ee.toLocaleString()} Equity→Bond`)}else if(Rt>5e3&&xt<-5e3){const ee=Math.floor(Math.min(Rt,-xt)/1e3)*1e3;ee>=5e3&&(ht=`Move £${ee.toLocaleString()} Bond→Equity`)}let ke="";const Xn=w-r;if(Xn>5e3&&At==="Growth"&&!oe){const ee=X-we-F;if(ee>1e4){const Le=Math.floor(Math.min(Xn*.3,ee*.5)/1e3)*1e3;Le>=5e3&&(ke=`Replenish Cash: Move £${Le.toLocaleString()} from growth funds`)}}const tt=[];Jn&&tt.push({message:Jn,severity:"danger",type:"low-cash"}),Se>50&&tt.push({message:`Tax Boost: +£${Math.round(Se).toLocaleString()}/mo catch-up from protection shortfall`,severity:"success",type:"tax-boost"}),ht&&tt.push({message:ht,severity:"warning",type:"rebalance"}),ke&&tt.push({message:ke,severity:"info",type:"cash-replenish"});const Zn=m>=4?f:f-1,er=Z.filter(ee=>{const[Le,Ae]=ee.date.split("-").map(Number);return(Ae>=4?Le:Le-1)===Zn}),be=er.reduce((ee,Le)=>ee+(Le.sipp||0),0),Ee=er.length+1,pt=Math.max(0,12-Ee)*Jt,wt=be+F+pt+R+y,Fe=Wi(wt,b,S,I),_t=Fe/12,xr=F+R/12+y/12-_t+Re,Zo=_t*Ee,ea=Fe,ds=te/12,gi=Wi(ds*12,b,S,I),Rr=Math.max(0,gi/12-Fe/12),tr=T+Zt;return{date:n,taxYear:c,yearNumber:d,remainingMonths:fe,equity:e,bond:t,cash:r,isa:0,adjEquityMin:E,adjBondMin:A,adjCashTarget:w,pa:b,brl:S,other:R/12,statePension:y/12,sippDraw:F,stdSipp:Jt,isaDraw:Re,totalMonthlyNet:xr,isTaxEfficientYear:C,yearlyIsaSavingsAllocation:M,cumulativeIsaSavingsUsed:tr,isaSavingsUsedThisMonth:Zt,taxPaidYTD:Zo,taxProjectedAnnual:ea,taxSavedMonthly:Rr,taxSavedYTD:Rr*Ee,taxSavedProjectedAnnual:Rr*12,taxEfficient:C&&!Xt,inProtection:oe,protectionReason:oe?vt:null,consecutiveCashDraws:j,protectionInducedTaxEfficiency:Xt,boostAmount:Se>50?Se:0,boostEligible:Se>50,source:At,drawFromEquity:tn,drawFromBond:Vt,drawFromCash:Tn,rebalanceNeeded:ht!=="",rebalanceActions:ht?[ht]:[],alerts:tt,calculationDetails:{mode:ce,reason:`${vt} | ${ce}`,totalGrowth:X,minGrowth:we,consec:j,stdSipp:F,inputs:{baseSalary:i.baseSalary,confirmedSalary:V,targetGross:te,cumInf:_,yearNum:d,taxYear:c,OTHER:R,STATE:y,PA:b,BRL:S,isTaxEfficientYear:C,yearlyIsaSavingsAllocation:M,grossIncomeToDate:O},taxInfo:{annualTaxable:wt,headroomToBRL:S-wt,annualTax:Fe,monthlyNet:xr}}}}let Js=null;function qE(n,e){Js=n,HE(e)}function HE({onGetStarted:n,onSignIn:e}){Js&&(Js.innerHTML=`
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
  `,document.getElementById("landingGetStarted").addEventListener("click",n),document.getElementById("landingSignIn").addEventListener("click",e))}function Xs(){Js&&(Js.style.display="none")}function jE(){return`
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
  `}let ut=null,Ra=null,Vr=!1;function YE(n,e){console.log("initAuthScreen: initializing"),ut=n,Ra=e,Vr=!1,Ib(t=>{console.log("AuthScreen: auth state change received:",t?t.email:"null","processed:",Vr),t&&Ra&&!Vr?(console.log("AuthScreen: calling onAuthSuccessCallback"),Vr=!0,XE(),Ra(t)):t?console.log("AuthScreen: skipping callback, already processed or no callback"):(Vr=!1,console.log("AuthScreen: user signed out, reset authProcessed"))}),mp(),console.log("initAuthScreen: complete")}function mp(){if(ut){if(!Ve()){ut.innerHTML=`
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
    `;return}ut.innerHTML=`
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
  `,WE()}}function WE(){const n=ut.querySelectorAll(".auth-screen-tab");n.forEach(i=>{i.addEventListener("click",()=>{n.forEach(c=>c.classList.remove("active")),i.classList.add("active");const a=document.getElementById("signinForm"),l=document.getElementById("signupForm");i.dataset.tab==="signin"?(a.style.display="block",l.style.display="none"):(a.style.display="none",l.style.display="block"),mi()})}),document.getElementById("signinForm").addEventListener("submit",GE),document.getElementById("signupForm").addEventListener("submit",KE),document.getElementById("forgotPasswordBtn").addEventListener("click",QE),document.getElementById("googleSigninBtn").addEventListener("click",JE)}function Un(n){const e=document.getElementById("authScreenError");e&&(e.textContent=n,e.style.display="block")}function mi(){const n=document.getElementById("authScreenError");n&&(n.style.display="none")}async function GE(n){n.preventDefault(),mi();const e=document.getElementById("signinEmail").value.trim(),t=document.getElementById("signinPassword").value;if(!e||!t){Un("Please enter email and password");return}try{await Ab(e,t)}catch(r){console.error("Sign in error:",r),Un(Go(r.code))}}async function KE(n){n.preventDefault(),mi();const e=document.getElementById("signupName").value.trim(),t=document.getElementById("signupEmail").value.trim(),r=document.getElementById("signupPassword").value;if(!e||!t||!r){Un("Please fill in all fields");return}if(r.length<6){Un("Password must be at least 6 characters");return}try{await Sb(t,r,e)}catch(s){console.error("Sign up error:",s),Un(Go(s.code))}}async function QE(){mi();const n=document.getElementById("signinEmail").value.trim();if(!n){Un("Please enter your email address first");return}try{await Rb(n),typeof window.showToast=="function"&&window.showToast("Password reset email sent. Check your inbox.","success",5e3)}catch(e){console.error("Reset password error:",e),Un(Go(e.code))}}async function JE(){mi();try{await xb()}catch(n){console.error("Google sign in error:",n),Un(Go(n.code))}}function Go(n){return{"auth/invalid-email":"Invalid email address","auth/user-disabled":"This account has been disabled","auth/user-not-found":"No account found with this email","auth/wrong-password":"Incorrect password","auth/email-already-in-use":"An account already exists with this email","auth/weak-password":"Password is too weak","auth/operation-not-allowed":"Sign in method not enabled","auth/popup-closed-by-user":"Sign in cancelled","auth/popup-blocked":"Sign in popup was blocked","auth/too-many-requests":"Too many attempts. Please try again later.","auth/invalid-credential":"Invalid email or password"}[n]||"An error occurred. Please try again."}function XE(){ut&&(ut.innerHTML=`
      <div class="auth-screen">
        <div class="auth-screen-box" style="text-align: center;">
          <div class="auth-screen-header">
            <h1>Pension Planner</h1>
            <p>Signing in...</p>
          </div>
        </div>
      </div>
    `)}function gp(){console.log("hideAuthScreen: hiding auth screen, element=",!!ut),ut&&(ut.style.display="none",console.log("hideAuthScreen: set display to none"))}function ZE(){Vr=!1,ut&&(ut.style.display="block",mp())}function po(n="signin"){ZE(),ut.querySelectorAll(".auth-screen-tab").forEach(i=>i.classList.remove("active"));const t=ut.querySelector(`.auth-screen-tab[data-tab="${n}"]`);t&&t.classList.add("active");const r=document.getElementById("signinForm"),s=document.getElementById("signupForm");r&&s&&(r.style.display=n==="signin"?"block":"none",s.style.display=n==="signup"?"block":"none")}function eT(){return`
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
  `}let Zs=null;function tT(n,e,t){Zs=n,nT(e,t)}function nT(n,e){if(!Zs)return;const t=n||"there";Zs.innerHTML=`
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
  `,document.getElementById("onboardingStartWizard").addEventListener("click",e)}function Ko(){Zs&&(Zs.style.display="none")}function rT(){return`
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
  `}let yn=null,mo=null,B={scenarioName:"My Plan",scenarioDescription:"",enabledTools:["stress","decision"],introDone:!1,baseSalary:3e4,otherIncome:0,spStartDate:"",spWeeklyAmount:0,equityMin:25e4,bondMin:2e5,cashTarget:5e4,isaBalance:0,duration:35,taxMode:"inflates",decisionSalary:3e4,decisionEquity:25e4,decisionBond:2e5,decisionCash:5e4,decisionIsaBalance:0,decisionDuration:35},it="scenario",Te=1;function yp(){it="scenario",Te=1,B={scenarioName:"My Plan",scenarioDescription:"",enabledTools:["stress","decision"],introDone:!1,baseSalary:3e4,otherIncome:0,spStartDate:"",spWeeklyAmount:0,equityMin:25e4,bondMin:2e5,cashTarget:5e4,isaBalance:0,duration:35,taxMode:"inflates",decisionSalary:3e4,decisionEquity:25e4,decisionBond:2e5,decisionCash:5e4,decisionIsaBalance:0,decisionDuration:35}}function vp(n,e){yn=n,mo=e,yp(),kt()}function kt(){yn&&(it==="scenario"?sT():it==="stress"?aT():it==="decision"&&cT())}function sT(){yn.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Welcome to Pension Planner</div>
        <div class="wizard-subtitle">Let's create your first plan</div>

        <div class="wizard-progress">
          ${uc(2,Te)}
        </div>

        ${Te===1?iT():oT()}
      </div>
    </div>
  `,dc()}function iT(){return`
    <div class="wizard-step">
      <div class="wizard-step-title">Name your plan</div>
      <div class="wizard-step-desc">
        Give your plan a name. You can create multiple plans later for different scenarios
        (e.g. "Retire at 57", "Conservative at 60").
      </div>

      <div class="wizard-input" style="margin-bottom: 16px;">
        <input type="text" id="wizScenarioName" value="${B.scenarioName}" placeholder="e.g. My Retirement Plan" style="max-width: 300px;">
      </div>

      <div class="wizard-step-desc" style="margin-bottom: 8px;">
        Add an optional description:
      </div>

      <div class="wizard-input">
        <input type="text" id="wizScenarioDesc" value="${B.scenarioDescription}" placeholder="e.g. Based on retiring at age 57" style="max-width: 400px;">
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="skip-all">Skip Setup</button>
        <button class="wizard-btn primary" data-action="next">Next</button>
      </div>
    </div>
  `}function oT(){const n=B.enabledTools.includes("stress"),e=B.enabledTools.includes("decision");return`
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
  `}function aT(){yn.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Stress Tester Setup</div>
        <div class="wizard-subtitle">Let's set up your pension simulation in a few simple steps.</div>

        <div class="wizard-progress">
          ${uc(6,Te)}
        </div>

        ${lT(Te)}
      </div>
    </div>
  `,dc()}function lT(n){switch(n){case 1:return`
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
          <div class="wizard-step-title">How big are your pension funds?</div>
          <div class="wizard-step-desc">
            Enter the minimum amount you want to keep in each type of investment at the start of retirement.
          </div>

          <div class="wizard-grid">
            <div class="wizard-grid-item">
              <label>Stocks/Shares (Higher Risk)</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizEquityMin" value="${B.equityMin}">
              </div>
            </div>
            <div class="wizard-grid-item">
              <label>Bonds (Medium Risk)</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizBondMin" value="${B.bondMin}">
              </div>
            </div>
            <div class="wizard-grid-item">
              <label>Cash (Low Risk)</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizCashTarget" value="${B.cashTarget}">
              </div>
            </div>
            <div class="wizard-grid-item">
              <label>ISA Balance (Tax-Free)</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizIsaBalance" min="0" value="${B.isaBalance}">
              </div>
            </div>
          </div>

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
      `;default:return""}}function cT(){yn.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Decision Tool Setup</div>
        <div class="wizard-subtitle">Now let's set up the tool you'll use each month once you're retired.</div>

        <div class="wizard-progress">
          ${uc(4,Te)}
        </div>

        ${uT(Te)}
      </div>
    </div>
  `,dc()}function uT(n){switch(n){case 1:return`
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
              <label>Stocks/Shares</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizDEquityMin" value="${B.decisionEquity}">
              </div>
            </div>
            <div class="wizard-grid-item">
              <label>Bonds</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizDBondMin" value="${B.decisionBond}">
              </div>
            </div>
            <div class="wizard-grid-item">
              <label>Cash</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizDCashTarget" value="${B.decisionCash}">
              </div>
            </div>
            <div class="wizard-grid-item">
              <label>ISA Balance (Tax-Free)</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizDIsaBalance" min="0" value="${B.decisionIsaBalance}">
              </div>
            </div>
          </div>

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
      `;default:return""}}function uc(n,e){let t="";for(let r=1;r<=n;r++){const s=r<e?"done":r===e?"active":"";t+=`<div class="wizard-dot ${s}"></div>`}return t}function dc(){yn.querySelectorAll("[data-action]").forEach(e=>{e.addEventListener("click",()=>dT(e.dataset.action))})}function dT(n){switch(wp(),n){case"skip-all":jr();break;case"next":{const e=jo(B.spStartDate);if(!e.valid){typeof window.showToast=="function"&&window.showToast(e.error,"error");return}it==="scenario"?Te<2&&(Te++,kt()):it==="stress"?Te<6&&(Te++,kt()):it==="decision"&&Te<4&&(Te++,kt());break}case"back":(it==="scenario"&&Te>1||it==="stress"&&Te>1||it==="decision"&&Te>1)&&(Te--,kt());break;case"start-tools":if(!B.enabledTools||B.enabledTools.length===0){typeof window.showToast=="function"&&window.showToast("Please select at least one tool","error");return}Pa("scenario");break;case"skip-stress":Pa("stress");break;case"finish-stress":B.decisionSalary=B.baseSalary,B.decisionEquity=B.equityMin,B.decisionBond=B.bondMin,B.decisionCash=B.cashTarget,B.decisionIsaBalance=B.isaBalance,B.decisionDuration=B.duration,Pa("stress");break;case"skip-decision":jr();break;case"finish":jr();break}}function Pa(n){const e=B.enabledTools.includes("stress"),t=B.enabledTools.includes("decision");n==="scenario"?e?(it="stress",Te=1,kt()):t?(it="decision",Te=1,kt()):jr():n==="stress"&&t?(it="decision",Te=1,kt()):jr()}function wp(){const n=document.getElementById("wizScenarioName");n&&(B.scenarioName=n.value.trim()||"My Plan");const e=document.getElementById("wizScenarioDesc");e&&(B.scenarioDescription=e.value.trim()||"");const t=document.getElementById("wizToolStress"),r=document.getElementById("wizToolDecision");if(t!==null||r!==null){const V=[];t&&t.checked&&V.push("stress"),r&&r.checked&&V.push("decision"),B.enabledTools=V}const s=document.getElementById("wizBaseSalary");s&&(B.baseSalary=parseFloat(s.value)||3e4);const i=document.getElementById("wizOther");i&&(B.otherIncome=parseFloat(i.value)||0);const a=document.getElementById("wizSpStartDate");a&&(B.spStartDate=a.value.trim()||"");const l=document.getElementById("wizSpWeeklyAmount");l&&(B.spWeeklyAmount=parseFloat(l.value)||0);const c=document.getElementById("wizEquityMin");c&&(B.equityMin=parseFloat(c.value)||25e4);const d=document.getElementById("wizBondMin");d&&(B.bondMin=parseFloat(d.value)||2e5);const f=document.getElementById("wizCashTarget");f&&(B.cashTarget=parseFloat(f.value)||5e4);const m=document.getElementById("wizIsaBalance");m&&(B.isaBalance=parseFloat(m.value)||0);const g=document.getElementById("wizDuration");g&&(B.duration=parseInt(g.value)||35);const b=document.getElementById("wizTaxMode");b&&(B.taxMode=b.value);const S=document.getElementById("wizDBaseSalary");S&&(B.decisionSalary=parseFloat(S.value)||3e4);const I=document.getElementById("wizDEquityMin");I&&(B.decisionEquity=parseFloat(I.value)||25e4);const R=document.getElementById("wizDBondMin");R&&(B.decisionBond=parseFloat(R.value)||2e5);const C=document.getElementById("wizDCashTarget");C&&(B.decisionCash=parseFloat(C.value)||5e4);const M=document.getElementById("wizDIsaBalance");M&&(B.decisionIsaBalance=parseFloat(M.value)||0);const O=document.getElementById("wizDDuration");O&&(B.decisionDuration=parseInt(O.value)||35)}function jr(){wp(),mo&&mo(B)}function Qo(){yn&&(yn.style.display="none")}function hT(n,e,t,r){if(yn=n,mo=t,yp(),B.enabledTools=e,r&&(e.includes("stress")&&r.source==="decision"&&(B.baseSalary=r.baseSalary||3e4,B.equityMin=r.equityMin||25e4,B.bondMin=r.bondMin||2e5,B.cashTarget=r.cashTarget||5e4,B.isaBalance=r.isaBalance||0,B.duration=r.duration||35,B.spStartDate=r.spStartDate||"",B.spWeeklyAmount=r.spWeeklyAmount||0),e.includes("decision")&&r.source==="stress"&&(B.decisionSalary=r.baseSalary||3e4,B.decisionEquity=r.equityMin||25e4,B.decisionBond=r.bondMin||2e5,B.decisionCash=r.cashTarget||5e4,B.decisionIsaBalance=r.isaBalance||0,B.decisionDuration=r.duration||35)),e.includes("stress"))it="stress";else if(e.includes("decision"))it="decision";else{t&&t(B);return}Te=1,kt()}function fT(){return`
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
  `}function pT(){const e=getComputedStyle(document.documentElement).getPropertyValue("--bg").trim()==="#0d1117"||document.documentElement.classList.contains("dark")||window.matchMedia("(prefers-color-scheme: dark)").matches;return{primary:"#f0c674",success:"#2ea043",warning:"#e1b12c",danger:"#f85149",muted:"#8b8b9b",grid:"rgba(255,255,255,0.1)",bg:e?"rgba(15,15,26,1)":"#ffffff",text:e?"#c9d1d9":"#1f2937",cardBg:e?"#21262d":"#ffffff",cone:"rgba(240,198,116,0.15)",coneMid:"rgba(240,198,116,0.2)",coneInner:"rgba(240,198,116,0.35)",coneBorder:"rgba(240,198,116,0.4)",trajectory:"rgba(46,160,67,0.25)",trajectoryFailed:"rgba(248,81,73,0.8)",trajectoryHover:"#5fdd7b",trajectoryFailedHover:"#ff6b6b",glidepath:"#7eb8da",zeroLine:"#f85149"}}function mT(n,e,t={}){const r=pT(),s=n.getContext("2d"),{width:i,height:a}=n,l={top:50,right:180,bottom:60,left:80},c=i-l.left-l.right,d=a-l.top-l.bottom;s.fillStyle=r.bg,s.fillRect(0,0,i,a);const f=Object.keys(e),m=t.years||35;let g=0;f.forEach(R=>{const C=e[R].result;C&&C.hist&&C.hist.forEach(M=>{M.total>g&&(g=M.total)})}),g*=1.1;const b=R=>l.left+R/m*c,S=R=>l.top+d-R/g*d;gT(s,l,c,d,m,g,t.title||"Scenario Comparison",r);const I=["#6366f1","#22c55e","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#ec4899","#84cc16"];f.forEach((R,C)=>{const M=e[R].result;if(!M||!M.hist)return;s.beginPath(),s.strokeStyle=I[C%I.length],s.lineWidth=2.5,M.hist.forEach((V,$)=>{const H=b(V.year),T=S(V.total);$===0?s.moveTo(H,T):s.lineTo(H,T)}),s.stroke();const O=l.top+15+C*24;s.fillStyle=I[C%I.length],s.fillRect(i-l.right+15,O,20,4),s.font="11px system-ui, sans-serif",s.fillStyle=r.text,s.textAlign="left",s.fillText(e[R].name||R,i-l.right+40,O+5),M.final/1e3,s.fillStyle=r.muted,s.fillText(`${_p(M.final)}`,i-l.right+40,O+18)})}function gT(n,e,t,r,s,i,a,l){n.font="bold 14px system-ui, sans-serif",n.fillStyle=l.text,n.textAlign="center",n.fillText(a,e.left+t/2,e.top-20),n.strokeStyle=l.grid,n.lineWidth=1;for(let c=0;c<=5;c++){const d=e.top+r*c/5;n.beginPath(),n.moveTo(e.left,d),n.lineTo(e.left+t,d),n.stroke();const f=i*(5-c)/5;n.font="11px system-ui, sans-serif",n.fillStyle=l.muted,n.textAlign="right",n.fillText(_p(f),e.left-10,d+4)}for(let c=0;c<=s;c+=5){const d=e.left+c/s*t;n.beginPath(),n.moveTo(d,e.top),n.lineTo(d,e.top+r),n.stroke(),n.textAlign="center",n.fillText(`Y${c}`,d,e.top+r+20)}n.font="12px system-ui, sans-serif",n.textAlign="center",n.fillText("Years",e.left+t/2,e.top+r+45),n.save(),n.translate(20,e.top+r/2),n.rotate(-Math.PI/2),n.fillText("Fund Value",0,0),n.restore()}function _p(n){return n>=1e6?`£${(n/1e6).toFixed(1)}M`:n>=1e3?`£${(n/1e3).toFixed(0)}k`:`£${n.toFixed(0)}`}function yT(){return`
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
  `}window._simEngine={runMonteCarlo:op,runHistorical:lp,simulate:Ho,monteCarloReturns:ap};window._constants={EQUITY_RETURNS:$s,INFLATION:il};window._mathUtils={seededRng:al};let bp=null,Ep=null;function Tp(){bp=null,Ep=null;const n=document.getElementById("mcResults"),e=document.getElementById("histResults");n&&(n.innerHTML=""),e&&(e.innerHTML="");const t=document.getElementById("optimiseResultsMC"),r=document.getElementById("optimiseResultsHist");t&&(t.innerHTML=""),r&&(r.innerHTML="")}function Ip(){document.querySelectorAll(".sub-tab[data-stresstab]").forEach(t=>t.classList.remove("active"));const n=document.querySelector('.sub-tab[data-stresstab="montecarlo"]');n&&n.classList.add("active"),document.querySelectorAll(".stress-subtab").forEach(t=>t.classList.add("hidden"));const e=document.getElementById("stress-montecarlo");e&&e.classList.remove("hidden")}function Sp(){document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(t=>t.classList.remove("active"));const n=document.querySelector('.sub-tab[data-decisiontab="entry"]');n&&n.classList.add("active"),document.querySelectorAll(".decision-subtab").forEach(t=>t.classList.add("hidden"));const e=document.getElementById("decision-entry");e&&e.classList.remove("hidden")}const Ap=document.createElement("style");Ap.textContent=_E()+jE()+eT()+rT()+fT()+BE()+yT();document.head.appendChild(Ap);const hc=document.getElementById("globalLoadingOverlay"),vT=hc.querySelector(".loading-text");function Lt(n="Loading..."){vT.textContent=n,hc.classList.add("active")}function Ot(){hc.classList.remove("active")}window.showToast=function(e,t="info",r=3e3){const s=document.querySelector(".toast-notification");s&&s.remove();const i=document.createElement("div");i.className=`toast-notification ${t}`,i.innerHTML=`
        <span class="toast-icon">${t==="success"?"✓":t==="error"?"!":"ℹ"}</span>
        <span class="toast-message">${e}</span>
      `,document.body.appendChild(i),requestAnimationFrame(()=>i.classList.add("show")),setTimeout(()=>{i.classList.remove("show"),setTimeout(()=>i.remove(),300)},r)};document.getElementById("versionDisplay").textContent=`v${Ad}`;document.getElementById("entryMonth").value=am();function go(n){const e=document.getElementById(n+"SpWeeklyAmount"),t=document.getElementById(n+"SpAnnualAmount");if(!e||!t)return;const r=parseFloat(e.value)||0,s=r*52;r>0?t.value="£"+s.toLocaleString("en-GB",{maximumFractionDigits:2}):t.value=""}["ds","ss"].forEach(n=>{const e=document.getElementById(n+"SpWeeklyAmount");e&&e.addEventListener("input",()=>go(n))});function wT(n){const e=parseFloat(n);return isNaN(e)?"":e.toString().replace(/\B(?=(\d{3})+(?!\d))/g," ")}function xp(){document.querySelectorAll('input[type="number"]').forEach(e=>{e.value,e.addEventListener("focus",function(t){setTimeout(()=>{this.select()},0)}),e.addEventListener("click",function(t){!t.shiftKey&&!t.ctrlKey&&!t.metaKey&&this.select()})})}function Rp(){document.querySelectorAll('input[type="number"]').forEach(e=>{if(e.dataset.formatted)return;e.dataset.formatted="true";const t=e.closest(".input-with-unit")||e.parentElement,r=e.closest(".input-with-unit")!==null,s=document.createElement("span");s.className="number-format-overlay";const i=r?"34px":"14px";s.style.cssText=`
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
        `,getComputedStyle(t).position==="static"&&(t.style.position="relative");function a(){const l=parseFloat(e.value);!isNaN(l)&&l>=1e3&&document.activeElement!==e?(s.textContent=wT(l),s.style.display="block",e.style.color="transparent"):(s.style.display="none",e.style.color="")}e._updateOverlay=a,e.addEventListener("focus",()=>{s.style.display="none",e.style.color=""}),e.addEventListener("blur",a),e.addEventListener("input",()=>{document.activeElement===e&&(s.style.display="none",e.style.color="")}),t.appendChild(s),a()})}function Jo(){document.querySelectorAll('input[type="number"]').forEach(n=>{n._updateOverlay&&n._updateOverlay()})}setTimeout(()=>{xp(),Rp()},100);const _T=new MutationObserver(n=>{let e=!1;n.forEach(t=>{t.addedNodes.forEach(r=>{var s,i;r.nodeType===1&&((s=r.matches)!=null&&s.call(r,'input[type="number"]')||(i=r.querySelector)!=null&&i.call(r,'input[type="number"]'))&&(e=!0)})}),e&&setTimeout(()=>{xp(),Rp()},50)});_T.observe(document.body,{childList:!0,subtree:!0});let Fr=null;async function fc(n,e=null){Xs(),gp(),Ko(),Qo(),document.getElementById("mainApp").classList.remove("hidden"),document.getElementById("userEmail").textContent=n.email,await Yr();const t=await Xf();pc(t),await Wt(),await br(),tl(),Ip(),Sp(),Tp();const r=e||(t.includes("decision")?"decision":"stress");document.querySelectorAll(".tab").forEach(a=>a.classList.remove("active"));const s=document.querySelector(`.tab[data-tab="${r}"]`);s&&s.classList.add("active"),document.querySelectorAll(".tab-content").forEach(a=>a.classList.remove("active"));const i=document.getElementById(`${r}-content`);i&&i.classList.add("active")}function pc(n){const e={decision:["decision"],stress:["stress"]};document.querySelectorAll(".tab").forEach(r=>{const s=r.dataset.tab;let i=!1;for(const[a,l]of Object.entries(e))if(l.includes(s)){i=n.includes(a);break}Object.values(e).flat().includes(s)||(i=!0),r.style.display=i?"":"none"})}async function tl(){try{const n=await Qt(),e=await En();document.getElementById("entryEquity").value=e.equityMin||25e4,document.getElementById("entryBond").value=e.bondMin||2e5,document.getElementById("entryCash").value=e.cashTarget||5e4,document.getElementById("entryIsa").value=e.isaBalance||0,document.getElementById("dsEquityMin").value=e.equityMin||25e4,document.getElementById("dsBondMin").value=e.bondMin||2e5,document.getElementById("dsCashTarget").value=e.cashTarget||5e4,document.getElementById("dsDuration").value=e.duration||35,document.getElementById("dsBaseSalary").value=e.baseSalary||3e4,document.getElementById("dsSpStartDate").value=e.spStartDate||"",document.getElementById("dsSpWeeklyAmount").value=e.spWeeklyAmount||"",go("ds"),document.getElementById("dsProtectionFactor").value=e.protectionFactor||20,document.getElementById("dsRecoveryBuffer").value=e.recoveryBuffer||1e4,document.getElementById("dsConsecutiveLimit").value=e.consecutiveLimit||3,kp(n),document.getElementById("ssBaseSalary").value=n.baseSalary,document.getElementById("ssEquityMin").value=n.equityMin,document.getElementById("ssBondMin").value=n.bondMin,document.getElementById("ssCashTarget").value=n.cashTarget,document.getElementById("ssDuration").value=n.duration,document.getElementById("ssPA").value=n.pa,document.getElementById("ssBRL").value=n.brl,document.getElementById("ssHRL").value=n.hrl,document.getElementById("ssTaxMode").value=n.taxMode||"inflates",document.getElementById("ssOther").value=n.other||0,document.getElementById("ssSpStartDate").value=n.spStartDate||"",document.getElementById("ssSpWeeklyAmount").value=n.spWeeklyAmount||"",go("ss"),document.getElementById("ssConsecutiveLimit").value=n.consecutiveLimit||3,document.getElementById("ssProtectionMult").value=n.protectionMult||.8,document.getElementById("ssDisableProtection").checked=n.disableProtection||!1,document.getElementById("ssHodlEnabled").checked=n.hodlEnabled||!1,document.getElementById("ssHodlValue").value=n.hodlValue||25e3,document.getElementById("ssIsaBalance").value=n.isaBalance||0;const t=document.getElementById("ssSeedNote");t&&(t.textContent=n.seededFrom==="decision"&&n.seededAt?"Seeded from Decision Tool "+new Date(n.seededAt).toLocaleDateString():""),Jo(),console.log("All inputs initialized from stored settings")}catch(n){console.error("Error initializing inputs from settings:",n)}}async function Pp(n){console.log("Wizard completed with data:",n);try{const r={baseSalary:n.baseSalary,other:n.otherIncome,spStartDate:n.spStartDate,spWeeklyAmount:n.spWeeklyAmount,equityMin:n.equityMin,bondMin:n.bondMin,cashTarget:n.cashTarget,isaBalance:n.isaBalance||0,duration:n.duration,taxMode:n.taxMode},s={baseSalary:n.decisionSalary,equityMin:n.decisionEquity,bondMin:n.decisionBond,cashTarget:n.decisionCash,isaBalance:n.decisionIsaBalance||0,duration:n.decisionDuration,spStartDate:n.spStartDate,spWeeklyAmount:n.spWeeklyAmount};await Ob(n.scenarioName||"My Plan",n.scenarioDescription||"",n.enabledTools||["stress","decision"],{stressSettings:r,decisionSettings:s},!0),_r(),Yn()}catch(r){console.error("Error creating scenario from wizard:",r)}const e=Ir(),t=n.enabledTools.includes("stress")?"stress":"decision";fc(e,t)}function nl(n){Xs(),gp();const e=n.displayName||n.email.split("@")[0];document.getElementById("onboardingPage").style.display="block",tT(document.getElementById("onboardingPage"),e,()=>{Ko(),document.getElementById("setupWizard").style.display="block",vp(document.getElementById("setupWizard"),Pp)})}YE(document.getElementById("authScreen"),async n=>{console.log("Auth success callback triggered for:",n.email);try{console.log("Checking for existing cloud data...");const e=await Db();console.log("Has cloud data:",e),e?(console.log("Existing user - showing main app"),Xs(),fc(n)):(console.log("New user - showing onboarding page"),nl(n))}catch(e){console.error("Error in auth callback:",e),nl(n)}});qE(document.getElementById("landingPage"),{onGetStarted:()=>{Xs(),po("signup")},onSignIn:()=>{Xs(),po("signin")}});document.getElementById("logoutBtn").addEventListener("click",async()=>{try{_r(),Yn(),bn(),await Hf(),document.getElementById("mainApp").classList.add("hidden"),Ko(),Qo(),po("signin")}catch(n){console.error("Logout error:",n)}});async function Yr(){var s;const n=await sc(),e=n.find(i=>i.isActive),t=document.getElementById("scenarioActiveName");t&&(t.textContent=e&&(((s=e.planDetails)==null?void 0:s.name)||e.name)||"No Plan");const r=document.getElementById("scenarioList");if(r){if(n.length===0){r.innerHTML='<div class="scenario-dropdown-item" style="color:var(--text-muted);cursor:default;">No plans yet</div>';return}r.innerHTML=n.map(i=>{var c,d;const a=((c=i.planDetails)==null?void 0:c.name)||i.name||"Unnamed Plan",l=((d=i.planDetails)==null?void 0:d.description)||i.description||"";return`
        <div class="scenario-dropdown-item ${i.isActive?"active":""}" data-scenario-id="${i.id}">
          <div>
            <div class="scenario-item-name">${a}</div>
            ${l?`<div class="scenario-item-desc">${l}</div>`:""}
          </div>
          <div class="scenario-item-actions">
            ${i.isActive?`<button class="scenario-tools-btn" data-id="${i.id}" data-tools="${(i.enabledTools||["stress","decision"]).join(",")}" title="Edit Tools">&#9881;</button>`:""}
            <button class="scenario-rename-btn" data-id="${i.id}" data-name="${a}" title="Rename">&#9998;</button>
            ${n.length>1?`<button class="scenario-delete-btn" data-id="${i.id}" data-name="${a}" title="Delete">&times;</button>`:""}
          </div>
        </div>
      `}).join(""),r.querySelectorAll(".scenario-dropdown-item").forEach(i=>{i.addEventListener("click",async a=>{if(a.target.closest(".scenario-item-actions"))return;const l=i.dataset.scenarioId;if(!l)return;const c=n.find(d=>d.isActive);if(c&&c.id===l){document.getElementById("scenarioDropdown").classList.remove("open");return}try{await Bb(l),_r(),Yn(),document.getElementById("scenarioDropdown").classList.remove("open"),Tp(),Ip(),Sp();const d=await Xf();pc(d);const f=document.querySelector(".tab.active");if(f&&f.style.display==="none"){const m=document.querySelector('.tab:not([style*="display: none"])');if(m){document.querySelectorAll(".tab").forEach(S=>S.classList.remove("active")),m.classList.add("active"),document.querySelectorAll(".tab-content").forEach(S=>S.classList.remove("active"));const g=m.dataset.tab+"-content",b=document.getElementById(g);b&&b.classList.add("active")}}await Wt(),await br(),await tl(),await Yr()}catch(d){console.error("Error switching scenario:",d),showToast("Failed to switch plan: "+d.message,"error")}})}),r.querySelectorAll(".scenario-rename-btn").forEach(i=>{i.addEventListener("click",async a=>{a.stopPropagation();const l=i.dataset.id,c=i.dataset.name,d=prompt("Rename plan:",c);if(d&&d.trim()&&d.trim()!==c)try{await Fb(l,d.trim()),await Yr()}catch(f){console.error("Error renaming scenario:",f),showToast("Failed to rename plan: "+f.message,"error")}})}),r.querySelectorAll(".scenario-tools-btn").forEach(i=>{i.addEventListener("click",async a=>{a.stopPropagation();const l=i.dataset.id,c=(i.dataset.tools||"stress,decision").split(",");document.getElementById("scenarioDropdown").classList.remove("open"),bT(l,c)})}),r.querySelectorAll(".scenario-delete-btn").forEach(i=>{i.addEventListener("click",async a=>{a.stopPropagation();const l=i.dataset.id,c=i.dataset.name;if(confirm(`Delete plan "${c}"? This cannot be undone.`))try{await zb(l),_r(),Yn(),await Wt(),await br(),await tl(),await Yr()}catch(d){console.error("Error deleting scenario:",d),showToast("Failed to delete plan: "+d.message,"error")}})})}}document.getElementById("scenarioActiveBtn").addEventListener("click",n=>{n.stopPropagation(),document.getElementById("scenarioDropdown").classList.toggle("open")});document.addEventListener("click",n=>{const e=document.getElementById("scenarioSelector");e&&!e.contains(n.target)&&document.getElementById("scenarioDropdown").classList.remove("open")});document.getElementById("scenarioNewBtn").addEventListener("click",async()=>{document.getElementById("scenarioDropdown").classList.remove("open"),document.getElementById("mainApp").classList.add("hidden"),document.getElementById("setupWizard").style.display="block",vp(document.getElementById("setupWizard"),Pp)});document.getElementById("scenarioDuplicateBtn").addEventListener("click",async()=>{var r;document.getElementById("scenarioDropdown").classList.remove("open");const n=await Bt();if(!n){showToast("No active plan to duplicate.","error");return}const e=((r=n.planDetails)==null?void 0:r.name)||n.name||"My Plan",t=prompt("Name for the copy:",e+" (copy)");if(!(!t||!t.trim()))try{await Vb(n.id,t.trim()),await Yr()}catch(s){console.error("Error duplicating scenario:",s),showToast("Failed to duplicate plan: "+s.message,"error")}});function bT(n,e){const t=document.getElementById("editToolsModal");t&&t.remove();const r=e.includes("stress"),s=e.includes("decision"),i=document.createElement("div");i.id="editToolsModal",i.className="edit-tools-overlay",i.innerHTML=`
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
      `,document.body.appendChild(i),document.getElementById("editToolsCancel").addEventListener("click",()=>i.remove()),i.addEventListener("click",a=>{a.target===i&&i.remove()}),document.getElementById("editToolsSave").addEventListener("click",async()=>{const a=[];if(document.getElementById("editToolStress").checked&&a.push("stress"),document.getElementById("editToolDecision").checked&&a.push("decision"),a.length===0){showToast("Please select at least one tool","error");return}const l=a.filter(c=>!e.includes(c));try{await $b(n,a);const c=await Bt();if(c&&c.id===n){pc(a);const d=document.querySelector(".tab.active");if(d&&d.style.display==="none"){const f=document.querySelector('.tab:not([style*="display: none"])');if(f){document.querySelectorAll(".tab").forEach(b=>b.classList.remove("active")),f.classList.add("active"),document.querySelectorAll(".tab-content").forEach(b=>b.classList.remove("active"));const m=f.dataset.tab+"-content",g=document.getElementById(m);g&&g.classList.add("active")}}}if(await Yr(),i.remove(),l.length>0){let d=null;try{if(l.includes("stress")&&e.includes("decision")){const g=await En();g&&(d={source:"decision",...g})}else if(l.includes("decision")&&e.includes("stress")){const g=await Qt();g&&(d={source:"stress",...g})}}catch(g){console.warn("Could not load existing settings for pre-fill:",g)}const f=document.getElementById("setupWizard");f.style.display="block",document.getElementById("mainApp").style.display="none",hT(f,l,async g=>{Qo();try{l.includes("stress")&&(await Yo({equityMin:g.equityMin,bondMin:g.bondMin,cashTarget:g.cashTarget,isaBalance:g.isaBalance||0,duration:g.duration,baseSalary:g.baseSalary,other:g.otherIncome||0,taxMode:g.taxMode||"inflates"}),Yn()),l.includes("decision")&&(await ic({equityMin:g.decisionEquity,bondMin:g.decisionBond,cashTarget:g.decisionCash,isaBalance:g.decisionIsaBalance||0,duration:g.decisionDuration,baseSalary:g.decisionSalary,spStartDate:g.spStartDate||null,spWeeklyAmount:g.spWeeklyAmount||0}),_r())}catch(b){console.error("Error saving new tool settings:",b)}await fc(),showToast("New tool configured successfully","success")},d)}else showToast("Tools updated","success")}catch(c){console.error("Error updating scenario tools:",c),showToast("Failed to update tools: "+c.message,"error")}})}const ET=60*60*1e3;let Ca=null;function Cp(){Ca&&clearTimeout(Ca),dt()&&(Ca=setTimeout(async()=>{if(dt()){showToast("You have been logged out due to inactivity (1 hour).","info",5e3);try{_r(),Yn(),bn(),await Hf(),document.getElementById("mainApp").classList.add("hidden"),Ko(),Qo(),po("signin")}catch(n){console.error("Auto-logout error:",n)}}},ET))}const TT=["mousedown","mousemove","keydown","scroll","touchstart","click"];TT.forEach(n=>{document.addEventListener(n,()=>{Cp()},{passive:!0})});Cp();document.getElementById("resetBtn").addEventListener("click",async()=>{if(!(!confirm(`⚠️ WARNING: This will permanently delete ALL your data including:

• All saved settings
• All decision history
• All tax year configurations

This action cannot be undone.

Are you sure you want to reset and start over?`)||!confirm(`Are you ABSOLUTELY sure?

Type OK to confirm deletion of all your data.`)))try{console.log("Wiping all user data..."),await Mb(),console.log("Data wiped successfully"),_r(),Yn(),bn(),localStorage.clear(),document.getElementById("mainApp").classList.add("hidden");const t=Ir();nl(t),showToast("All data has been deleted. Set up a new plan to start fresh.","success",4e3)}catch(t){console.error("Reset error:",t),showToast("Error resetting data: "+t.message,"error")}});document.querySelectorAll(".tab").forEach(n=>{n.addEventListener("click",async()=>{if(n.dataset.tab!=="stress"){IT();const e=document.getElementById("optimiseResultsMC"),t=document.getElementById("optimiseResultsHist");e&&(e.innerHTML=""),t&&(t.innerHTML="")}document.querySelectorAll(".tab").forEach(e=>e.classList.remove("active")),n.classList.add("active"),document.querySelectorAll(".tab-content").forEach(e=>e.classList.remove("active")),document.getElementById(`${n.dataset.tab}-content`).classList.add("active"),n.dataset.tab==="stress"&&await Xo()})});const Ss=document.querySelector(".tabs"),Id=document.querySelector(".tabs-wrapper");if(Ss&&Id){const n=()=>{const e=Ss.scrollLeft+Ss.clientWidth>=Ss.scrollWidth-10;Id.classList.toggle("scrolled-end",e)};Ss.addEventListener("scroll",n),n()}document.querySelectorAll(".sub-tab[data-stresstab]").forEach(n=>{n.addEventListener("click",async()=>{document.querySelectorAll(".sub-tab[data-stresstab]").forEach(e=>e.classList.remove("active")),n.classList.add("active"),document.querySelectorAll(".stress-subtab").forEach(e=>e.classList.add("hidden")),document.getElementById(`stress-${n.dataset.stresstab}`).classList.remove("hidden"),n.dataset.stresstab==="stresssettings"&&await Xo()})});document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(n=>{n.addEventListener("click",async()=>{document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(e=>e.classList.remove("active")),n.classList.add("active"),document.querySelectorAll(".decision-subtab").forEach(e=>e.classList.add("hidden")),document.getElementById(`decision-${n.dataset.decisiontab}`).classList.remove("hidden"),n.dataset.decisiontab==="decisionsettings"&&await Lp(),n.dataset.decisiontab==="history"&&await Wt(),n.dataset.decisiontab==="taxyears"&&await br()})});async function Sd(n,e,t,r){var s;return UE(n,e,t,r,{settings:await En(),history:await cs(),allTaxYears:await Qn(),spInfo:await ac(pp(n)),isaBalance:parseFloat((s=document.getElementById("entryIsa"))==null?void 0:s.value)||0})}function mc(n,e,t){if(n<1e4&&e<1e4&&t<1e4&&n+e+t>0){const s=i=>"£"+Math.round(i||0).toLocaleString();return confirm(`These fund values look low — Equity ${s(n)}, Bond ${s(e)}, Cash ${s(t)}.

Enter absolute amounts in pounds, to the single pound (e.g. 250000, not 250).

Continue anyway?`)}return!0}window.handleDecisionSubmit=async function(n){n.preventDefault();const e=document.getElementById("entryMonth").value,t=parseFloat(document.getElementById("entryEquity").value)||0,r=parseFloat(document.getElementById("entryBond").value)||0,s=parseFloat(document.getElementById("entryCash").value)||0,i=[];if(e||i.push("Month"),!t&&t!==0&&i.push("Equity Fund"),!r&&r!==0&&i.push("Bond Balance"),!s&&s!==0&&i.push("Cash Balance"),i.length>0){showToast("Missing: "+i.join(", "),"error",4e3);return}if(!mc(t,r,s))return;if((await cs({limit:1e3})).find(c=>c.date===e)){showToast(`${rs(e)} already has a saved decision. Delete it from the History tab first to recalculate.`,"error",5e3);return}try{if((await RE(e)).showWizard){const f=document.getElementById("taxYearWizard");f.style.display="block",window._pendingDecisionForm={dateStr:e,equity:t,bond:r,cash:s},xE(f,e,async m=>{if(f.style.display="none",m&&m.completed)try{Fr=await Sd(e,t,r,s);const g=document.getElementById("decisionOutput");yd(Fr,g),document.getElementById("saveBtn").disabled=!1}catch(g){console.error("Decision error after wizard:",g),showToast("Error: "+g.message,"error")}});return}Fr=await Sd(e,t,r,s);const d=document.getElementById("decisionOutput");yd(Fr,d),document.getElementById("saveBtn").disabled=!1}catch(c){console.error("Decision error:",c),showToast("Error: "+c.message,"error")}};window.saveCurrentDecision=async function(){const n=document.getElementById("saveBtn");if(!Fr){showToast("No decision to save","error");return}if(!dt()){showToast("Please sign in to save decisions","error");return}n.classList.add("loading"),n.disabled=!0;try{await Zb(Fr),showToast("Decision saved to history","success"),await Wt()}catch(e){console.error("Save error:",e),showToast("Error saving: "+e.message,"error"),n.disabled=!1}finally{n.classList.remove("loading")}};function kp(n){const e=r=>"£"+Math.round(r||0).toLocaleString(),t=`Starting balances come from your <strong>Settings</strong> (Fund Minimums): Equity ${e(n.equityMin)} · Bond ${e(n.bondMin)} · Cash ${e(n.cashTarget)}. Edit them in the Settings tab.`;["mcStartSummary","histStartSummary","scenStartSummary"].forEach(r=>{const s=document.getElementById(r);s&&(s.innerHTML=t)}),["mcYears","histYears"].forEach(r=>{const s=document.getElementById(r);s&&(s.value=n.duration)})}window.runMonteCarloUI=async function(){const n=await Qt(),e={years:parseInt(document.getElementById("mcYears").value)||n.duration},t=document.getElementById("optimiseResultsMC");t&&(t.innerHTML=""),document.getElementById("mcResults").innerHTML='<div class="loading"><div class="spinner"></div>Running simulation...</div>',setTimeout(()=>{try{const{results:r,stats:s}=VE(e);bp=r,Np(s,r,"Monte Carlo (1000 runs)","mcResults",e.years)}catch(r){console.error("Simulation error:",r),document.getElementById("mcResults").innerHTML=`<div class="alert alert-danger">Error: ${r.message}</div>`}},50)};window.runHistoricalUI=async function(){const n=await Qt(),e={years:parseInt(document.getElementById("histYears").value)||n.duration},t=document.getElementById("optimiseResultsHist");t&&(t.innerHTML=""),document.getElementById("histResults").innerHTML='<div class="loading"><div class="spinner"></div>Running simulation...</div>',setTimeout(()=>{try{const{results:r,stats:s}=FE(e);Ep=r,Np(s,r,"Historical Analysis","histResults",e.years)}catch(r){console.error("Simulation error:",r),document.getElementById("histResults").innerHTML=`<div class="alert alert-danger">Error: ${r.message}</div>`}},50)};window.runScenariosUI=async function(){await Qt();const n={};document.getElementById("scenResults").innerHTML='<div class="loading"><div class="spinner"></div>Running scenarios...</div>',setTimeout(()=>{try{const e=$E(n);MT(e,"scenResults")}catch(e){console.error("Scenario error:",e),document.getElementById("scenResults").innerHTML=`<div class="alert alert-danger">Error: ${e.message}</div>`}},50)};let Rn=!1,Ms=0;function IT(){Ms++}window.runOptimisationUI=async function(n){if(Rn)return;Rn=!0;const e=++Ms,t=document.getElementById("optimiseBtn"+n),r=document.getElementById("optimiseResults"+n);t&&(t.disabled=!0),t&&(t.textContent="Optimising..."),r.innerHTML='<div class="loading"><div class="spinner"></div>Preparing optimisation...</div>';const s=await Qt(),i=JSON.parse(JSON.stringify(s)),a=document.getElementById(n==="MC"?"mcYears":"histYears"),l=parseInt(a&&a.value)||i.duration,c=(i.equityMin||0)+(i.bondMin||0)+(i.cashTarget||0);if(e!==Ms){Rn=!1,t&&(t.disabled=!1,t.textContent="Optimise Allocation");return}const d=[];for(let _=5;_<=90;_+=5)for(let E=5;E<=95-_;E+=5){const A=100-_-E;A>=0&&d.push({equity:Math.round(c*E/100),bond:Math.round(c*A/100),cash:Math.round(c*_/100)})}const{EQUITY_RETURNS:f,INFLATION:m}=window._constants,{simulate:g,monteCarloReturns:b}=window._simEngine,S=Object.keys(f).map(Number).sort((_,E)=>_-E),I=Math.max(...S),R=_=>{const E={...i,equityMin:_.equity,bondMin:_.bond,cashTarget:_.cash},A=Wo({years:l},E),w=[];if(n==="MC")for(let F=0;F<1e3;F++)w.push(g(A,b(A,F),F));else S.forEach(F=>{if(F+l-1>I)return;const Re={equity:{},inflation:{}};for(let ce=0;ce<l;ce++)Re.equity[ce]=f[F+ce]||0,Re.inflation[ce]=m[F+ce]||.025;w.push(g(A,Re,F))});const X=w.filter(F=>F.failed);w.filter(F=>!F.failed);const we=(w.length-X.length)/w.length*100,j=w.reduce((F,Re)=>F+Math.min(1,(Re.years||0)/(Re.duration||l)),0)/w.length*100,oe=w.map(F=>F.protMonths).reduce((F,Re)=>F+Re,0)/w.length,Ue=w.filter(F=>F.protMonths>0).length,fe=w.map(F=>F.failed?0:F.finalReal||0).sort((F,Re)=>F-Re),te=fe.length?fe[Math.floor(fe.length*.5)]:0,ne=fe.length?fe[Math.floor(fe.length*.9)]:0;return{equity:_.equity,bond:_.bond,cash:_.cash,rate:we,coverage:j,avgProt:oe,withProt:Ue,totalRuns:w.length,medianFinal:te,p90Final:ne}};let C;try{const _={equity:i.equityMin||0,bond:i.bondMin||0,cash:i.cashTarget||0},E=R(_);C={..._,...E}}catch(_){console.error("Optimisation error (original):",_),r.innerHTML='<div class="alert alert-danger">Error: '+_.message+"</div>",Rn=!1,t&&(t.disabled=!1,t.textContent="Optimise Allocation");return}const M=10;let O=0;const V=[];let $=null;function H(_){const E=Math.max(..._.map(w=>w.coverage)),A=_.filter(w=>w.coverage>=E-.5);return A.sort((w,X)=>w.avgProt-X.avgProt||X.medianFinal-w.medianFinal),A[0]}function T(_,E){return Math.round(_.equity)===Math.round(E.equity)&&Math.round(_.bond)===Math.round(E.bond)&&Math.round(_.cash)===Math.round(E.cash)}function v(){if(e!==Ms){Rn=!1,t&&(t.disabled=!1,t.textContent="Optimise Allocation"),r.innerHTML="";return}try{const _=Math.min(O+M,d.length);for(;O<_;O++)V.push(R(d[O]));r.innerHTML='<div class="loading"><div class="spinner"></div>Testing allocations... '+O+"/"+d.length+"</div>",O<d.length?setTimeout(v,0):($=H([...V,C]),y())}catch(_){console.error("Optimisation error:",_),r.innerHTML='<div class="alert alert-danger">Error: '+_.message+"</div>",Rn=!1,t&&(t.disabled=!1,t.textContent="Optimise Allocation")}}function y(){if(e!==Ms){Rn=!1,t&&(t.disabled=!1,t.textContent="Optimise Allocation"),r.innerHTML="";return}const _=c>0?C.cash/c*100:0,E=c>0?C.equity/c*100:0,w=_>90||_<5||E<5?'<div class="alert alert-info" style="margin-bottom:16px;font-size:13px;">Your current split is outside the range the optimiser sweeps, but it was included in this comparison.</div>':"",X=$&&!T($,C)&&($.coverage>C.coverage+.5||$.coverage>=C.coverage-.01&&$.avgProt<C.avgProt-3),we=(Z,oe)=>{const Ue=fe=>Math.round(fe/c*100);return'<div style="padding:16px;border-radius:8px;'+(oe?"background:rgba(46,160,67,0.1);border:1px solid var(--success);":"background:rgba(0,0,0,0.2);")+'"><div style="font-weight:500;margin-bottom:10px;color:var(--'+(oe?"success":"text-muted")+');">'+(oe?"Optimised split":"Your current split")+'</div><div style="font-size:26px;font-weight:700;color:var(--'+(oe?"success":"warning")+');">'+Z.coverage.toFixed(0)+'%</div><div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">of retirement years funded'+(oe?" ("+($.coverage-C.coverage>=0?"+":"")+($.coverage-C.coverage).toFixed(0)+"%)":"")+'</div><div style="font-size:13px;">Equity '+Ue(Z.equity)+"% · Bonds "+Ue(Z.bond)+"% · Cash "+Ue(Z.cash)+'%</div><div style="font-size:12px;color:var(--text-muted);margin-top:8px;">'+Z.rate.toFixed(0)+"% never run out · "+Q(Z.medianFinal)+" typically left</div></div>"};let j="";if(X){const Z=$.medianFinal-C.medianFinal,oe=C.medianFinal>0?Z/C.medianFinal*100:0;j+='<div class="card" style="margin-top:20px;border-color:var(--success);">',j+='<h3 style="color:var(--success);margin-top:0;">A better fund split</h3>',j+='<p style="color:var(--text-muted);margin-bottom:16px;">This split funds more of your retirement (higher coverage). Coverage credits a plan for every year it pays for, so it prefers splits that fall short late over ones that fail early.</p>',j+=w,j+='<div class="grid-2" style="gap:20px;margin-bottom:20px;">'+we(C,!1)+we($,!0)+"</div>",Z<0?j+='<div class="alert alert-warning" style="margin-bottom:16px;"><strong>Trade-off:</strong> it typically leaves '+Math.abs(oe).toFixed(0)+"% less at the end (usually less equity) — more safety, a bit less upside.</div>":Z>0&&(j+='<div class="alert alert-info" style="margin-bottom:16px;"><strong>Bonus:</strong> it also typically leaves '+oe.toFixed(0)+"% more at the end.</div>"),j+='<button onclick="applyOptimisedAllocationUI('+$.equity+","+$.bond+","+$.cash+')" style="width:100%;">Apply this split to your Settings</button>',j+="</div>"}else j+='<div class="card" style="margin-top:20px;border-color:var(--primary);">',j+='<h3 style="color:var(--primary);margin-top:0;">Your split is already about as good as it gets</h3>',j+=w,j+='<p style="color:var(--text-muted);">We tested '+d.length+" fund splits. Yours funds "+C.coverage.toFixed(0)+"% of retirement years — the best, or within 0.5% of it, with no clearly better low-protection alternative.</p>",j+='<p style="font-size:13px;color:var(--text-muted);">Your split — Equity '+Math.round(E)+"% · Bonds "+Math.round(C.bond/c*100)+"% · Cash "+Math.round(_)+"% · "+C.rate.toFixed(0)+"% never run out.</p>",j+="</div>";r.innerHTML=j,Rn=!1,t&&(t.disabled=!1,t.textContent="Optimise Allocation")}setTimeout(v,0)};window.applyOptimisedAllocationUI=async function(n,e,t){if(document.getElementById("ssEquityMin").value=n,document.getElementById("ssBondMin").value=e,document.getElementById("ssCashTarget").value=t,document.getElementById("dsEquityMin").value=n,document.getElementById("dsBondMin").value=e,document.getElementById("dsCashTarget").value=t,kp({equityMin:n,bondMin:e,cashTarget:t,duration:parseInt(document.getElementById("ssDuration").value)||35}),Jo(),dt())try{await Yo({equityMin:n,bondMin:e,cashTarget:t})}catch(r){console.error("Error saving optimised settings:",r)}showToast("Optimised allocation applied to settings and starting values. Scroll up to re-run.","success",4e3)};const ST={1929:"Wall Street Crash / Great Depression",1930:"Great Depression",1931:"Great Depression",1932:"Great Depression",1937:"Recession of 1937",1968:"Late 1960s stagflation",1969:"Late 1960s recession",1973:"Oil Crisis / 1973-74 crash",1974:"1973-74 bear market",2e3:"Dot-com bubble burst",2001:"Dot-com bust / 9/11",2007:"Global Financial Crisis",2008:"Global Financial Crisis",2022:"Post-COVID inflation / rate hikes"};function AT(n){if(!n||n.length===0)return"";const e=n.filter(i=>i.failed).sort((i,a)=>i.years-a.years),t=n.filter(i=>i.protMonths>0).sort((i,a)=>a.protMonths-i.protMonths),r=e.length>0?e.slice(0,5):t.slice(0,5);if(r.length===0)return"";let s=`
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
      `;return r.forEach(i=>{const a=i.startYear||i.seed,l=ST[a]||"-",c=i.failed?"danger":"success";s+=`
          <tr>
            <td>${a}</td>
            <td style="font-size: 12px;">${l}</td>
            <td>${i.years.toFixed(1)}</td>
            <td>${i.protMonths}</td>
            <td>${Q(i.final)}</td>
            <td style="color: var(--${c});">${i.failed?"FAILED":"OK"}</td>
          </tr>
        `}),s+=`
              </tbody>
            </table>
          </div>
        </details>
      `,s}function cn(n){return`<span class="hlp" tabindex="0" data-tip="${String(n).replace(/"/g,"&quot;")}">?</span>`}function xT(){if(window.__helpTipInit)return;window.__helpTipInit=!0;const n=document.createElement("div");n.className="help-tip",n.style.display="none",document.body.appendChild(n);let e=null;const t=s=>{const i=s.getAttribute("data-tip");if(!i)return;clearTimeout(e),n.textContent=i,n.style.display="block";const a=s.getBoundingClientRect(),l=Math.min(260,window.innerWidth-24);n.style.width=l+"px";let c=a.left+a.width/2-l/2+window.scrollX;c=Math.max(12+window.scrollX,Math.min(c,window.scrollX+window.innerWidth-l-12)),n.style.left=c+"px";const d=n.offsetHeight;let f=a.top+window.scrollY-d-8;a.top<d+12&&(f=a.bottom+window.scrollY+8),n.style.top=f+"px"},r=()=>{e=setTimeout(()=>{n.style.display="none"},80)};document.addEventListener("mouseover",s=>{const i=s.target.closest&&s.target.closest("[data-tip]");i&&t(i)}),document.addEventListener("mouseout",s=>{s.target.closest&&s.target.closest("[data-tip]")&&r()}),document.addEventListener("focusin",s=>{const i=s.target.closest&&s.target.closest("[data-tip]");i&&t(i)}),document.addEventListener("focusout",s=>{s.target.closest&&s.target.closest("[data-tip]")&&r()}),document.addEventListener("click",s=>{const i=s.target.closest&&s.target.closest("[data-tip]");i&&(n.style.display==="block"?r():t(i))})}const ur=n=>"£"+Math.round(n).toLocaleString();function Mp(n,e,t){return`<svg viewBox="0 0 ${e} ${t}" width="100%" style="max-width:${e}px;overflow:visible" role="img">${n}</svg>`}function Dp(n,{max:e,valueFmt:t=ur,tip:r,pct:s=!1}={}){const m=n.length;if(m<2)return"";const g=e??(s?100:Math.max(1,...n)),b=V=>56+V/(m-1)*590,S=V=>174-Math.max(0,Math.min(s?100:1/0,V))/g*160,I=n.map((V,$)=>`${b($).toFixed(1)},${S(V).toFixed(1)}`).join(" "),R=`56,${174 .toFixed(1)} ${I} ${b(m-1).toFixed(1)},${174 .toFixed(1)}`,C=s?[0,50,100]:[0,g/2,g],M=[0,Math.floor((m-1)/2),m-1],O=r||((V,$)=>`Year ${$}: ${t(V)}`);return Mp(C.map(V=>`<line x1="56" y1="${S(V).toFixed(1)}" x2="646" y2="${S(V).toFixed(1)}" stroke="var(--border,#8883)" opacity=".45"/><text x="50" y="${(S(V)+3).toFixed(1)}" text-anchor="end" font-size="10" fill="var(--text-muted,#999)">${t(V)}</text>`).join("")+`<polygon points="${R}" fill="rgba(96,165,250,.13)"/><polyline points="${I}" fill="none" stroke="#60a5fa" stroke-width="2.5"/>`+n.map((V,$)=>`<circle cx="${b($).toFixed(1)}" cy="${S(V).toFixed(1)}" r="8" fill="transparent" data-tip="${O(V,$).replace(/"/g,"&quot;")}"></circle>`).join("")+M.map(V=>`<text x="${b(V).toFixed(1)}" y="192" text-anchor="middle" font-size="10" fill="var(--text-muted,#999)">Year ${V}</text>`).join(""),660,200)}function RT(n){const l=n.p50.length;if(l<2)return"";const c=Math.max(1,...n.p90),d=I=>60+I/(l-1)*606,f=I=>222-Math.max(0,I)/c*208,m=(I,R)=>I.map((C,M)=>`${d(M).toFixed(1)},${f(C).toFixed(1)}`).concat(R.map((C,M)=>`${d(l-1-M).toFixed(1)},${f(R[l-1-M]).toFixed(1)}`)).join(" "),g=I=>I.map((R,C)=>`${d(C).toFixed(1)},${f(R).toFixed(1)}`).join(" "),b=[0,c/4,c/2,3*c/4,c],S=[0,Math.floor((l-1)/2),l-1];return Mp(b.map(I=>`<line x1="60" y1="${f(I).toFixed(1)}" x2="666" y2="${f(I).toFixed(1)}" stroke="var(--border,#8883)" opacity=".4"/><text x="54" y="${(f(I)+3).toFixed(1)}" text-anchor="end" font-size="10" fill="var(--text-muted,#999)">${ur(I)}</text>`).join("")+`<polygon points="${m(n.p90,n.p10)}" fill="rgba(96,165,250,.12)"/><polygon points="${m(n.p75,n.p25)}" fill="rgba(96,165,250,.22)"/><polyline points="${g(n.p50)}" fill="none" stroke="#60a5fa" stroke-width="2.5"/>`+n.p50.map((I,R)=>`<circle cx="${d(R).toFixed(1)}" cy="${f(I).toFixed(1)}" r="8" fill="transparent" data-tip="Year ${R}: middle ${ur(I)}; likely range ${ur(n.p10[R])} to ${ur(n.p90[R])}"></circle>`).join("")+S.map(I=>`<text x="${d(I).toFixed(1)}" y="242" text-anchor="middle" font-size="10" fill="var(--text-muted,#999)">Year ${I}</text>`).join(""),680,250)}function PT(n){if(!n||!n.funded)return"";const e=s=>(s||0).toFixed(s>=10?0:1),t=n.pctSurviveFullTerm>=80?"success":n.pctSurviveFullTerm>=50?"warning":"danger",r=n.avgHigherRateYears<1?"success":n.avgHigherRateYears<4?"warning":"danger";return`
        <h3 style="margin:24px 0 4px;">Your tax-free ISA bridge</h3>
        <p style="color:var(--text-muted);font-size:12px;margin:0 0 12px;">
          The ISA (starting at ${Q(n.startBalance)}) is drawn tax-free to top your income up, keeping you out of higher-rate tax. Modelled as a steady money-market fund.
        </p>
        <div class="keynums">
          <div class="keynum ${t}">
            <div class="kn-val">${n.pctSurviveFullTerm.toFixed(0)}%</div>
            <div class="kn-label">of futures the ISA lasts the whole plan ${cn("The tax-free ISA still has money at the end. When it runs out, income has to come from the taxable pension instead.")}</div>
          </div>
          <div class="keynum">
            <div class="kn-val">${e(n.medianLastedYears)} yrs</div>
            <div class="kn-label">the ISA typically lasts before running out ${cn("Median across all simulated futures.")}</div>
          </div>
          <div class="keynum ${r}">
            <div class="kn-val">${e(n.avgHigherRateYears)} yrs</div>
            <div class="kn-label">typically paying 40% (higher-rate) tax ${cn("Years you pay higher-rate income tax because the ISA has run out and income must come from the taxable pension above the basic-rate limit. A bigger ISA reduces these.")}</div>
          </div>
          <div class="keynum">
            <div class="kn-val">${Q(n.medianTotalTax)}</div>
            <div class="kn-label">typical lifetime income tax, today's money ${cn("Median total income tax paid over the whole plan, in present-day spending power.")}</div>
          </div>
        </div>
        <div style="margin-bottom:8px;">
          <div class="chart-caption">Typical ISA balance still to hand, year by year (today's money — hover a point for the figure). A slow, steady fall means it's being drawn as intended; a flat line means it's barely touched (larger than this plan needs); a drop to £0 marks when it typically runs out.</div>
          ${Dp(n.medianAliveByYear,{valueFmt:ur,tip:(s,i)=>`Year ${i}: typically ${ur(s)} of ISA left`})}
        </div>`}function CT(n){return n==="sequence"?"The failing futures were sunk by a bad first few years of markets. Holding a bigger cash/bond buffer for the early years, or starting with a slightly lower withdrawal, would let the plan ride out an early slump.":n==="inflation"?"The failing futures were driven by high inflation eroding your spending power. More inflation protection (e.g. index-linked gilts) and less plain cash would help — cash loses to inflation over time.":n==="market"?"The failing futures simply had weak markets throughout. A slightly lower withdrawal rate, or more growth assets (equities) accepting more short-term ups and downs, gives more headroom.":"Lowering your target income, delaying the start, or a larger starting pot would all raise the odds."}function kT(n,e){const t=n.severity||{},r=n.successRate,s=r>=90?{t:"Very likely to last",c:"success"}:r>=75?{t:"Likely to last — with some risk",c:"success"}:r>=50?{t:"At real risk of running out",c:"warning"}:{t:"Unlikely to last as planned",c:"danger"};let i=`<div class="verdict verdict-${s.c}">
        <div class="verdict-title">Will your money last? — ${s.t}</div>
        <div class="verdict-heroes">
          <div><span class="hero">${r.toFixed(0)}%</span>
            <span class="hero-sub">chance your money lasts the whole plan ${cn("Out of "+e+", the share where your pot never runs out before the end of the plan. Higher is better.")}</span></div>
          <div><span class="hero" style="font-size:30px;">${(t.coverage||0).toFixed(0)}%</span>
            <span class="hero-sub">of retirement years fully paid for ${cn("Averaged over every simulated future — a plan that funds 34 of 35 years scores 97%, so a late shortfall counts far less than an early one.")}</span></div>
        </div>
        <div class="verdict-basis">Based on ${e}. Pot and income values are shown in today's money.</div>
      </div>`;return t.failCount>0&&(i+=`<div class="callout">
          <div class="callout-title">Why it might fall short</div>
          <p>${t.diagnosis}</p>
          <p class="lever"><strong>What could help:</strong> ${CT(t.primaryDriver)}</p>
        </div>`),i}function Np(n,e,t,r,s){xT();const i=n.survival||{},a=n.finalReal||{},l=n.protection||{},c=l.pctWithProtection!=null?l.pctWithProtection:(l.runsWithProtection||0)/(e.length||1)*100,d=r==="mcResults",f=d?`${e.length.toLocaleString()} simulated futures`:`${e.length} historical periods since 1928`;let m=`
        <div class="card">
          <h2>${t}</h2>

          ${kT(n,f)}

          <div class="keynums">
            <div class="keynum">
              <div class="kn-val">${(i.p10||0).toFixed(0)} yrs</div>
              <div class="kn-label">worst case, your money still lasts at least ${cn("In the unluckiest 1-in-10 futures, the money still lasts at least this many years.")}</div>
            </div>
            <div class="keynum">
              <div class="kn-val">${Q(a.p50||0)}</div>
              <div class="kn-label">typically left at the end, today's money ${cn("The middle outcome for the pension pot left at the end, in present-day spending power. Futures that ran out count as £0, so this is not flattered by only the lucky runs.")}</div>
            </div>
            <div class="keynum">
              <div class="kn-val">${c.toFixed(0)} in 100</div>
              <div class="kn-label">futures where the plan had to cut back spending ${cn("To ride out a market slump the plan temporarily reduces withdrawals. This is how often that safety response was needed.")}</div>
            </div>
          </div>

          <h3 style="margin:8px 0 4px;">How your pot changes over time (today's money)</h3>
          <div class="chart-caption">The blue line is the middle outcome; the darker band is the middle half of futures, the lighter band the 10th–90th. Futures that ran out count as £0, so a sinking band means real risk. Hover any point for the figures.</div>
          ${RT(n.chartData.potBand)}

          <h3 style="margin:22px 0 4px;">Chance your plan is still going, year by year</h3>
          <div class="chart-caption">Share of futures in which the money hasn't run out yet — starts at 100% and dips where plans tend to fail. A late dip means most shortfalls happen late.</div>
          ${Dp(n.chartData.solvency,{pct:!0,valueFmt:g=>g.toFixed(0)+"%",tip:(g,b)=>`Year ${b}: ${g.toFixed(0)}% of plans still going`})}

          ${PT(n.isa)}

          <details style="margin-top:22px;">
            <summary style="cursor:pointer;font-weight:600;color:var(--primary);">More detail — worst historical periods &amp; full statistics</summary>
            <div style="margin-top:16px;">
              ${r==="histResults"?AT(e):""}

              <h4 style="margin:20px 0 8px;">Pot left at the end — full range (today's money)</h4>
              <div class="grid-7" style="display:grid;grid-template-columns:repeat(7,1fr);gap:10px;">
                ${[["p5","unluckiest 5%"],["p10","10%"],["p25","25%"],["p50","middle"],["p75","75%"],["p90","90%"],["p95","luckiest 5%"]].map(([g,b])=>`
                  <div class="stat-box mini">
                    <div class="stat-value" style="font-size:13px;">${Q(a[g]||0)}</div>
                    <div class="stat-label" style="font-size:10px;">${b}</div>
                  </div>`).join("")}
              </div>
              <p style="font-size:12px;color:var(--text-muted);margin-top:14px;line-height:1.6;">
                Based on ${f}. ${d?"Monte Carlo builds each future by stitching together random 5-year blocks of real history (1928–2024), so market slumps and inflation spikes arrive in realistic sustained runs rather than one-off years.":"Each run replays an actual stretch of history in its real order, capturing the true sequence of good and bad years."}
                A future "runs out" when the pension/cash pots hit zero before the plan ends.
              </p>
            </div>
          </details>
        </div>
      `;document.getElementById(r).innerHTML=m}function MT(n,e){let t='<div class="card"><h2>Scenario Analysis</h2>';t+=`
        <div class="chart-container" style="margin-bottom: 24px;">
          <canvas id="scenCompChart" width="900" height="400"></canvas>
        </div>
      `,t+='<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">';for(const[r,s]of Object.entries(n)){const i=s.result,a=i.failed?"danger":"success";t+=`
          <div class="history-item" style="border-left: 4px solid ${s.color};">
            <div>
              <div class="history-date">${s.name}</div>
              <div class="history-details">
                Protection: ${i.protMonths} mo | Max streak: ${i.maxConsec} mo
                ${i.hodlUsed>0?` | HODL used: ${Q(i.hodlUsed)}`:""}
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 24px; color: var(--${a});">${i.years.toFixed(1)} yrs</div>
              <div style="font-size: 12px; color: var(--${a});">${i.failed?"FAILED":"OK"}</div>
              <div style="font-size: 11px; color: var(--text-muted);">Final: ${Q(i.final)}</div>
            </div>
          </div>
        `}t+="</div></div>",document.getElementById(e).innerHTML=t,setTimeout(()=>{const r=document.getElementById("scenCompChart");r&&n&&mT(r,n,{years:35,title:"Scenario Comparison"})},50)}async function Xo(){Lt("Loading settings...");try{const n=await Qt();document.getElementById("ssBaseSalary").value=n.baseSalary,document.getElementById("ssEquityMin").value=n.equityMin,document.getElementById("ssBondMin").value=n.bondMin,document.getElementById("ssCashTarget").value=n.cashTarget,document.getElementById("ssDuration").value=n.duration,document.getElementById("ssPA").value=n.pa,document.getElementById("ssBRL").value=n.brl,document.getElementById("ssHRL").value=n.hrl,document.getElementById("ssTaxMode").value=n.taxMode||"inflates",document.getElementById("ssOther").value=n.other||0,document.getElementById("ssSpStartDate").value=n.spStartDate||"",document.getElementById("ssSpWeeklyAmount").value=n.spWeeklyAmount||"",go("ss"),document.getElementById("ssConsecutiveLimit").value=n.consecutiveLimit||3,document.getElementById("ssProtectionMult").value=n.protectionMult||.8,document.getElementById("ssDisableProtection").checked=n.disableProtection||!1,document.getElementById("ssHodlEnabled").checked=n.hodlEnabled||!1,document.getElementById("ssHodlValue").value=n.hodlValue||25e3,document.getElementById("ssIsaBalance").value=n.isaBalance||0;const e=document.getElementById("ssSeedNote");e&&(e.textContent=n.seededFrom==="decision"&&n.seededAt?"Seeded from Decision Tool "+new Date(n.seededAt).toLocaleDateString():""),Jo()}catch(n){console.error("Error loading stress settings:",n)}finally{Ot()}}window.saveStressSettingsUI=async function(){if(!dt()){showToast("Please sign in to save settings","error");return}const n=jo(document.getElementById("ssSpStartDate").value.trim());if(!n.valid){showToast(n.error,"error");return}if(n.warning&&showToast(n.warning,"warning"),!!mc(+document.getElementById("ssEquityMin").value,+document.getElementById("ssBondMin").value,+document.getElementById("ssCashTarget").value)){Lt("Saving settings...");try{await Yo({baseSalary:+document.getElementById("ssBaseSalary").value,equityMin:+document.getElementById("ssEquityMin").value,bondMin:+document.getElementById("ssBondMin").value,cashTarget:+document.getElementById("ssCashTarget").value,duration:+document.getElementById("ssDuration").value,pa:+document.getElementById("ssPA").value,brl:+document.getElementById("ssBRL").value,hrl:+document.getElementById("ssHRL").value,taxMode:document.getElementById("ssTaxMode").value,other:+document.getElementById("ssOther").value,spStartDate:document.getElementById("ssSpStartDate").value.trim()||null,spWeeklyAmount:+document.getElementById("ssSpWeeklyAmount").value||0,consecutiveLimit:+document.getElementById("ssConsecutiveLimit").value,protectionMult:+document.getElementById("ssProtectionMult").value,disableProtection:document.getElementById("ssDisableProtection").checked,hodlEnabled:document.getElementById("ssHodlEnabled").checked,hodlValue:+document.getElementById("ssHodlValue").value,isaBalance:+document.getElementById("ssIsaBalance").value||0}),showToast("Settings saved successfully","success")}catch(e){console.error("Error saving stress settings:",e),showToast("Error saving: "+e.message,"error")}finally{Ot()}}};window.copyStressFromDecisionUI=async function(){if(!dt()){showToast("Please sign in first","error");return}if(confirm("Copy your Decision Tool plan basics (funds, income, State Pension, ISA, protection) into the Stress Tester? Your Stress-specific what-ifs (tax mode, HODL) are kept.")){Lt("Copying from Decision...");try{const n=await En(),e=await Qt(),t=Nb(n,e);await Yo(t),await Xo(),showToast("Stress Tester seeded from your Decision plan","success")}catch(n){console.error("Error copying from decision:",n),showToast("Error copying: "+n.message,"error")}finally{Ot()}}};window.resetStressSettingsUI=async function(){if(confirm("Reset all stress settings to defaults?")){Lt("Resetting settings...");try{await gE(),await Xo(),showToast("Settings reset to defaults","success")}catch(n){console.error("Error resetting settings:",n),showToast("Error resetting: "+n.message,"error")}finally{Ot()}}};async function Lp(){Lt("Loading settings...");try{const n=await En();document.getElementById("dsEquityMin").value=n.equityMin||25e4,document.getElementById("dsBondMin").value=n.bondMin||2e5,document.getElementById("dsCashTarget").value=n.cashTarget||5e4,document.getElementById("dsDuration").value=n.duration||35,document.getElementById("dsBaseSalary").value=n.baseSalary||3e4,document.getElementById("dsProtectionFactor").value=n.protectionFactor||20,document.getElementById("dsRecoveryBuffer").value=n.recoveryBuffer||15e3,document.getElementById("dsConsecutiveLimit").value=n.consecutiveLimit||3,document.getElementById("dsIsaBalance").value=n.isaBalance||0,document.getElementById("entryEquity").value=n.equityMin||25e4,document.getElementById("entryBond").value=n.bondMin||2e5,document.getElementById("entryCash").value=n.cashTarget||5e4,document.getElementById("entryIsa").value=n.isaBalance||0,Jo()}catch(n){console.error("Error loading decision settings:",n)}finally{Ot()}}window.saveDecisionSettingsUI=async function(){if(!dt()){showToast("Please sign in to save settings","error");return}const n=jo(document.getElementById("dsSpStartDate").value.trim());if(!n.valid){showToast(n.error,"error");return}if(n.warning&&showToast(n.warning,"warning"),!!mc(+document.getElementById("dsEquityMin").value,+document.getElementById("dsBondMin").value,+document.getElementById("dsCashTarget").value)){Lt("Saving settings...");try{await ic({equityMin:+document.getElementById("dsEquityMin").value,bondMin:+document.getElementById("dsBondMin").value,cashTarget:+document.getElementById("dsCashTarget").value,duration:+document.getElementById("dsDuration").value,baseSalary:+document.getElementById("dsBaseSalary").value,spStartDate:document.getElementById("dsSpStartDate").value.trim()||null,spWeeklyAmount:+document.getElementById("dsSpWeeklyAmount").value||0,protectionFactor:+document.getElementById("dsProtectionFactor").value,recoveryBuffer:+document.getElementById("dsRecoveryBuffer").value,consecutiveLimit:+document.getElementById("dsConsecutiveLimit").value,isaBalance:+document.getElementById("dsIsaBalance").value||0}),showToast("Settings saved successfully","success")}catch(e){console.error("Error saving decision settings:",e),showToast("Error saving: "+e.message,"error")}finally{Ot()}}};window.resetDecisionSettingsUI=async function(){if(confirm("Reset all decision settings to defaults?")){Lt("Resetting settings...");try{await ic({equityMin:25e4,bondMin:2e5,cashTarget:5e4,duration:35,baseSalary:3e4,protectionFactor:20,recoveryBuffer:15e3,consecutiveLimit:3}),await Lp(),showToast("Settings reset to defaults","success")}catch(n){console.error("Error resetting settings:",n),showToast("Error resetting: "+n.message,"error")}finally{Ot()}}};window.showDrawdownScheduleUI=async function(){const n=parseFloat(document.getElementById("ddInflation").value)/100||.025,e=parseInt(document.getElementById("ddDuration").value)||35;try{const t=await Qt();t.duration=e;const r=hm(t,e,n);let s='<div class="card"><h2>Projected SIPP Drawdown Schedule</h2>';s+='<div style="overflow-x: auto;"><table>',s+="<thead><tr><th>Year</th><th>BRL</th><th>Other</th><th>State</th><th>SIPP Draw</th><th>Tax</th><th>Net</th></tr></thead>",s+="<tbody>";for(const i of r)s+=`<tr>
            <td>${i.year}</td>
            <td>${Q(i.brl)}</td>
            <td>${Q(i.other)}</td>
            <td>${Q(i.statePension)}</td>
            <td style="color: var(--primary); font-weight: 600;">${Q(i.sippDraw)}</td>
            <td style="color: var(--danger);">-${Q(i.tax)}</td>
            <td style="color: var(--success);">${Q(i.netIncome)}</td>
          </tr>`;s+="</tbody></table></div></div>",document.getElementById("drawdownResults").innerHTML=s}catch(t){console.error("Drawdown error:",t),document.getElementById("drawdownResults").innerHTML=`<div class="alert alert-danger">Error: ${t.message}</div>`}};window.showGlidepathUI=async function(){const n=parseFloat(document.getElementById("gpInflation").value)/100||.025,e=parseInt(document.getElementById("gpDuration").value)||35;try{const t=await Qt();t.duration=e;const r=pm(t,n);let s='<div class="card"><h2>Fund Glidepath (Inflation-Adjusted Minimums)</h2>';s+='<div class="alert alert-info" style="margin-bottom: 20px;">',s+="<strong>Glidepath Logic:</strong> Equity & Bond minimums inflate with CPI but deplete linearly to £0. Cash inflates only (maintains real value).",s+="</div>",s+='<div style="overflow-x: auto;"><table>',s+="<thead><tr><th>Year</th><th>Cum Inflation</th><th>Equity Min</th><th>Bond Min</th><th>Cash Target</th><th>Total Min</th></tr></thead>",s+="<tbody>";for(const i of r)s+=`<tr>
            <td>${i.year}</td>
            <td>${(i.cumulativeInflation*100-100).toFixed(1)}%</td>
            <td style="color: var(--success);">${Q(i.equityMin)}</td>
            <td style="color: var(--info);">${Q(i.bondMin)}</td>
            <td style="color: var(--warning);">${Q(i.cashTarget)}</td>
            <td style="font-weight: 600;">${Q(i.totalMin)}</td>
          </tr>`;s+="</tbody></table></div></div>",document.getElementById("glidepathResults").innerHTML=s}catch(t){console.error("Glidepath error:",t),document.getElementById("glidepathResults").innerHTML=`<div class="alert alert-danger">Error: ${t.message}</div>`}};let bt=null,Pn=[],$t="all";async function Wt(){const n=document.getElementById("historyTabs"),e=document.getElementById("historyDetail"),t=document.getElementById("historyYearFilter"),r=document.getElementById("deleteAllHistoryBtn"),s=document.getElementById("deleteYearBtn");if(!n||!e)return;if(n.innerHTML='<span class="loading">Loading...</span>',Pn=await cs({sortDesc:!1,limit:500}),r&&(r.style.display=Pn.length>0?"":"none"),s&&(s.style.display="none"),Pn.length===0){n.innerHTML="",t&&(t.innerHTML='<option value="all">No entries</option>'),e.innerHTML=`
          <div class="no-history-message">
            <h3>No History Entries</h3>
            <p>Save decisions from the Decision Tool to build your history.</p>
          </div>
        `;return}const i=[...new Set(Pn.map(d=>d.date.split("-")[0]))].sort().reverse();if(t){let d='<option value="all">All Years</option>';i.forEach(f=>{d+=`<option value="${f}">${f}</option>`}),t.innerHTML=d,t.value=$t}s&&(s.style.display=$t!=="all"&&Pn.length>0?"":"none");const a=$t==="all"?Pn:Pn.filter(d=>d.date.startsWith($t));if(a.length===0){n.innerHTML="",e.innerHTML=`
          <div class="no-history-message">
            <h3>No entries for ${$t}</h3>
            <p>Select a different year or "All Years".</p>
          </div>
        `;return}let l="";a.forEach(d=>{const f=d.date===bt,m=["history-tab"];f&&m.push("active"),d.inProtection&&m.push("protection");const[g,b]=d.date.split("-").map(Number),S=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],I=$t==="all"?`${S[b-1]} ${g}`:S[b-1];l+=`<button class="${m.join(" ")}" onclick="selectHistoryEntry('${d.date}')">${I}</button>`}),n.innerHTML=l;const c=document.getElementById("historyMobileSelector");if(c){let d="";a.forEach(f=>{const m=rs(f.date),g=f.inProtection?" (Protection)":"";d+=`<option value="${f.date}">${m}${g}</option>`}),c.innerHTML=d}(!bt||!a.find(d=>d.date===bt))&&(bt=a[a.length-1].date),c&&(c.value=bt),Op(bt),setTimeout(()=>{const d=n.querySelector(".history-tab.active");d&&d.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})},100)}window.filterHistoryByYear=function(n){$t=n,bt=null,Wt()};function rs(n){const[e,t]=n.split("-").map(Number);return`${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][t-1]} ${e}`}function Op(n){const e=document.getElementById("historyDetail"),t=Pn.find(d=>d.date===n);if(!t){e.innerHTML='<div class="no-history-message"><h3>Entry not found</h3></div>';return}const r=d=>d!=null?"£"+Math.round(d).toLocaleString():"—",s=t.isTaxEfficientYear!==!1&&t.mode==="Tax-Efficient",i=t.inProtection?"warning":s?"efficient":"inefficient",a=t.inProtection?`Protection${t.protectionInducedTaxEfficiency?" (Tax-Efficient)":""}`:s?"Tax-Efficient":"Standard";let l=t.source||"Unknown";t.source==="Growth"&&(t.dEquity>0||t.dBond>0)?l=`Growth (Equity: ${r(t.dEquity||0)}, Bond: ${r(t.dBond||0)})`:t.source==="Cash"&&(l=`Cash (${r(t.dCash||t.sipp||0)})`);let c=`
        <!-- Header with date and mode -->
        <div class="history-detail-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <div>
              <h3 style="margin:0;">${rs(t.date)}</h3>
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
      `;e.innerHTML=c,document.querySelectorAll(".history-tab").forEach(d=>{d.classList.toggle("active",d.textContent===rs(n))})}window.selectHistoryEntry=function(n){bt=n,Op(n);const e=document.getElementById("historyMobileSelector");e&&(e.value=n);const r=document.getElementById("historyTabs").querySelector(".history-tab.active");r&&r.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})};window.scrollHistoryTabs=function(n){const e=document.getElementById("historyTabs"),t=200;n==="left"?e.scrollLeft-=t:e.scrollLeft+=t};function yo(n){const[e,t]=n.split("-").map(Number);return t>=4?`${e%100}/${(e+1)%100}`:`${(e-1)%100}/${e%100}`}async function rl(n){const e={};for(const r of n){const s=r.taxYear||yo(r.date);e[s]||(e[s]=0),e[s]+=r.isaSavingsUsedThisMonth||r.isa||0}for(const r of n)await tp(r.date);const t=await Qn();for(const[r,s]of Object.entries(e))if(t[r]){const i=t[r].isaSavingsUsed||0,a=Math.max(0,i-s);await Ar(r,{...t[r],isaSavingsUsed:a})}}window.deleteHistoryEntry=async function(n){if(!dt()){showToast("Please sign in to delete entries","error");return}const e=await cs({sortDesc:!1,limit:1e3}),t=yo(n),s=e.filter(c=>(c.taxYear||yo(c.date))===t).sort((c,d)=>c.date.localeCompare(d.date)),i=s.findIndex(c=>c.date===n);if(i===-1){showToast("Entry not found","error");return}const a=i===s.length-1,l=rs(n);if(a){if(!confirm(`Delete entry for ${l}?`))return;Lt("Deleting entry...");try{await rl([s[i]]),showToast(`Deleted ${l}`,"success"),bt=null,await Wt()}catch(c){console.error("Delete error:",c),showToast("Error deleting: "+c.message,"error")}finally{Ot()}}else{const c=s.slice(i),d=rs(c[c.length-1].date);if(!confirm(`This will delete ${c.length} entries from ${l} to ${d} in tax year ${t}.

Continue?`))return;Lt(`Deleting ${c.length} entries...`);try{await rl(c),showToast(`Deleted ${c.length} entries`,"success"),bt=null,await Wt()}catch(f){console.error("Delete error:",f),showToast("Error deleting: "+f.message,"error")}finally{Ot()}}};window.deleteHistoryForTaxYear=async function(n){if(!dt()){showToast("Please sign in to delete entries","error");return}const t=(await cs({sortDesc:!1,limit:1e3})).filter(r=>(r.taxYear||yo(r.date))===n);if(t.length===0){showToast(`No history entries for tax year ${n}`,"info");return}if(confirm(`Delete all ${t.length} history entries for tax year ${n}?`)){Lt(`Deleting tax year ${n}...`);try{await rl(t);const r=await Qn();r[n]&&await Ar(n,{...r[n],isaSavingsUsed:0}),showToast(`Deleted all entries for ${n}`,"success"),bt=null,await Wt()}catch(r){console.error("Delete error:",r),showToast("Error deleting: "+r.message,"error")}finally{Ot()}}};window.deleteHistoryForSelectedYear=async function(){if($t==="all"){showToast("Select a specific year first","error");return}const n=`${parseInt($t)%100}/${(parseInt($t)+1)%100}`;await deleteHistoryForTaxYear(n)};window.deleteAllHistory=async function(){if(confirm("Delete ALL history entries? This cannot be undone.")&&confirm("Are you ABSOLUTELY sure? All decision history will be permanently deleted.")){if(!dt()){showToast("Please sign in to delete entries","error");return}Lt("Deleting all history...");try{const n=await cs({limit:1e3});for(const t of n)await tp(t.date);const e=await Qn();for(const[t,r]of Object.entries(e))r.isaSavingsUsed>0&&await Ar(t,{...r,isaSavingsUsed:0});showToast(`Deleted ${n.length} entries`,"success"),bt=null,await Wt()}catch(n){console.error("Delete all error:",n),showToast("Error deleting: "+n.message,"error")}finally{Ot()}}};let ar=null;async function br(){const n=document.getElementById("taxYearTabs"),e=document.getElementById("taxYearDetail");if(!n||!e)return;n.innerHTML='<span class="loading">Loading...</span>';const t=await Qn();await En();const r=Object.keys(t).sort(),s=DT(),i=NT(r,s,40);let a="";i.forEach(d=>{const f=t[d],m=f&&f.yearSetupComplete,g=d===ar,b=["tax-year-tab"];g&&b.push("active"),m||b.push("not-setup"),a+=`<button class="${b.join(" ")}" onclick="selectTaxYear('${d}')">${d}</button>`}),n.innerHTML=a;const l=document.getElementById("taxYearMobileSelector");if(l){let d="";i.forEach(f=>{const m=t[f],b=m&&m.yearSetupComplete?f:`${f} (not set up)`;d+=`<option value="${f}">${b}</option>`}),l.innerHTML=d}if(!ar){const d=r.filter(f=>{var m;return(m=t[f])==null?void 0:m.yearSetupComplete});ar=d.length>0?d[d.length-1]:s}l&&(l.value=ar),await Bp(ar,t);const c=n.querySelector(".tax-year-tab.active");c&&c.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})}function DT(){const n=new Date,e=n.getFullYear(),t=n.getMonth()+1;return t<4||t===4&&n.getDate()<6?`${String(e-1).slice(-2)}/${String(e).slice(-2)}`:`${String(e).slice(-2)}/${String(e+1).slice(-2)}`}function NT(n,e,t){const r=new Set(n),[s]=e.split("/").map(Number),i=s<50?2e3+s:1900+s;for(let a=0;a<t&&r.size<t;a++){const l=i+a,c=l+1;r.add(`${String(l).slice(-2)}/${String(c).slice(-2)}`)}return Array.from(r).sort()}async function Bp(n,e,t){var m,g,b,S,I,R,C,M,O,V,$,H,T,v;const r=document.getElementById("taxYearDetail"),s=e[n];if(!s||!s.yearSetupComplete){r.innerHTML=`
          <div class="not-configured-message">
            <h3>Tax Year ${n} Not Configured</h3>
            <p>This tax year hasn't been set up yet. Use the Decision Tool to calculate a decision for a month in this tax year to trigger the setup wizard.</p>
            <button class="btn primary" onclick="triggerWizardForYear('${n}')">Set Up ${n}</button>
          </div>
        `;return}const i=await ac(n),a=Math.round(i.amount||0),l=i.startDate||"Not configured",c=i.isReceiving;i.yearsUntil;const d=y=>y!=null?"£"+Math.round(y).toLocaleString():"—";let f=`
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
              <span class="value">${LT(s.startMonth||4)}</span>
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
                  <td class="tax-col">-${d((g=y.sipp)==null?void 0:g.tax)}</td>
                  <td class="net-col">${d((b=y.sipp)==null?void 0:b.net)}</td>
                </tr>
                ${((S=y.other)==null?void 0:S.gross)>0?`
                <tr>
                  <td class="source-name">Other Income</td>
                  <td>${d((I=y.other)==null?void 0:I.gross)}</td>
                  <td class="tax-col">-${d((R=y.other)==null?void 0:R.tax)}</td>
                  <td class="net-col">${d((C=y.other)==null?void 0:C.net)}</td>
                </tr>
                `:""}
                ${((M=y.statePension)==null?void 0:M.gross)>0?`
                <tr>
                  <td class="source-name">State Pension</td>
                  <td>${d((O=y.statePension)==null?void 0:O.gross)}</td>
                  <td class="tax-col">-${d((V=y.statePension)==null?void 0:V.tax)}</td>
                  <td class="net-col">${d(($=y.statePension)==null?void 0:$.net)}</td>
                </tr>
                `:""}
                ${((H=y.isa)==null?void 0:H.net)>0?`
                <tr>
                  <td class="source-name">ISA <span style="color:var(--success);font-size:11px;">(tax-free)</span></td>
                  <td>${d((T=y.isa)==null?void 0:T.gross)}</td>
                  <td style="color:var(--success);">£0</td>
                  <td class="net-col">${d((v=y.isa)==null?void 0:v.net)}</td>
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
      `,r.innerHTML=f,document.querySelectorAll(".tax-year-tab").forEach(y=>{y.classList.toggle("active",y.textContent===n)})}window.selectTaxYear=async function(n){ar=n;const e=await Qn();await En(),await Bp(n,e),document.querySelectorAll(".tax-year-tab").forEach(i=>{i.classList.toggle("active",i.textContent===n)});const t=document.getElementById("taxYearMobileSelector");t&&(t.value=n);const s=document.getElementById("taxYearTabs").querySelector(`.tax-year-tab[onclick="selectTaxYear('${n}')"]`);s&&s.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})};window.scrollTaxYearTabs=function(n){const e=document.getElementById("taxYearTabs"),t=200;n==="left"?e.scrollLeft-=t:e.scrollLeft+=t};function LT(n){return["January","February","March","April","May","June","July","August","September","October","November","December"][(n-1)%12]||"April"}window.triggerWizardForYear=async function(n){const[e]=n.split("/").map(Number),t=e<50?2e3+e:1900+e,r=`${t}-04`,s=document.getElementById("selectedMonth");s&&(s.value=r),document.querySelectorAll(".tab").forEach(i=>i.classList.remove("active")),document.querySelector('.tab[data-tab="decision"]').classList.add("active"),document.querySelectorAll(".tab-content").forEach(i=>i.classList.remove("active")),document.getElementById("decision-content").classList.add("active"),document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(i=>i.classList.remove("active")),document.querySelector('.sub-tab[data-decisiontab="entry"]').classList.add("active"),document.querySelectorAll(".decision-subtab").forEach(i=>i.classList.add("hidden")),document.getElementById("decision-entry").classList.remove("hidden"),showToast(`Please click "Calculate" with April ${t} selected to set up tax year ${n}`,"info",5e3)};window.reconfigureTaxYear=async function(n){if(confirm(`This will allow you to reconfigure tax year ${n}. The setup wizard will be triggered when you next calculate a decision for this year. Continue?`))try{const e=await qo(n);e.yearSetupComplete=!1,await Ar(n,e),await br(),showToast(`Tax year ${n} marked for reconfiguration. Calculate a decision for this year to run the wizard again.`,"success",5e3)}catch(e){console.error("Error:",e),showToast("Error: "+e.message,"error")}};window.updateTaxYear=async function(n,e,t){try{const r=await qo(n);r[e]=parseFloat(t),await Ar(n,r)}catch(r){console.error("Error updating tax year:",r),showToast("Error saving: "+r.message,"error")}};window.deleteTaxYear=async function(n){if(confirm("Delete tax year "+n+"? This will remove all configuration for this year."))try{const e=await Kt();delete e.taxYears[n],await Uo(e),ar=null,await br()}catch(e){console.error("Error deleting tax year:",e),showToast("Error deleting: "+e.message,"error")}};window.addTaxYear=async function(){if(!dt()){showToast("Please sign in to add tax years","error");return}const n=prompt("Enter tax year (e.g., 25/26):");if(!n||!/^\d{2}\/\d{2}$/.test(n)){showToast("Invalid format. Use YY/YY (e.g., 25/26)","error");return}try{await Ar(n,{}),await br()}catch(e){console.error("Save error:",e),showToast("Error saving: "+e.message,"error")}};console.log("Pension Planner v"+Ad+" loaded");
