(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function t(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(r){if(r.ep)return;r.ep=!0;const i=t(r);fetch(r.href,i)}})();function rm(n){const e=(n.sippDraw||0)+(n.other||0)+(n.statePension||0),t=e*12,s=n.pa||12570,r=n.brl||50270,i=n.hrl||125140;let a=0;t>s&&(t<=r?a=(t-s)*.2:t<=i?a=(r-s)*.2+(t-r)*.4:a=(r-s)*.2+(i-r)*.4+(t-i)*.45);const l=a/12,c=e-l+(n.isaDraw||0);return{date:n.date,taxYear:n.taxYear,yearNum:n.yearNumber,equity:n.equity,bond:n.bond,cash:n.cash,total:n.equity+n.bond+n.cash,adjEquity:n.adjEquityMin,adjBond:n.adjBondMin,adjCash:n.adjCashTarget,source:n.source,dEquity:n.drawFromEquity||0,dBond:n.drawFromBond||0,dCash:n.drawFromCash||0,sipp:n.sippDraw,stdSipp:n.stdSipp||n.sippDraw,isa:n.isaDraw,other:n.other,state:n.statePension,pa:s,brl:r,monthlyTax:l,monthlyNet:c,mode:n.taxEfficient?"Tax-Efficient":"Standard",inProtection:n.inProtection,reason:n.protectionReason||"",consecutiveDraws:n.consecutiveCashDraws||0,boostAmount:n.boostAmount,boostEligible:n.boostEligible||!1,rebal:n.rebalanceActions?n.rebalanceActions.join("; "):"",yearlyIsaSavingsAllocation:n.yearlyIsaSavingsAllocation||0,isaSavingsUsedThisMonth:n.isaDraw||0,cumulativeIsaSavingsUsed:n.cumulativeIsaSavingsUsed||0,taxPaidMonthly:l,taxPaidYTD:n.taxPaidYTD||l,taxProjectedAnnual:n.taxProjectedAnnual||a,taxSavedMonthly:n.taxSavedMonthly||0,taxSavedYTD:n.taxSavedYTD||0,taxSavedProjectedAnnual:n.taxSavedProjectedAnnual||0,isTaxEfficientYear:n.isTaxEfficientYear??!0,protectionInducedTaxEfficiency:n.protectionInducedTaxEfficiency||!1,remainingMonths:n.remainingMonths||12}}const Ci={INFO:"info",WARNING:"warning",DANGER:"danger",SUCCESS:"success"},Md="6.0.0",Fe={PERSONAL_ALLOWANCE:12570,BASIC_RATE_LIMIT:50270,HIGHER_RATE_LIMIT:125140,BASIC_RATE:.2,HIGHER_RATE:.4,ADDITIONAL_RATE:.45,PA_TAPER_THRESHOLD:1e5,PA_TAPER_RATE:.5},ll={ASSUMED_CPI:.025,OTHER_INCOME_CAP:.04},Pt={RETURN:.03,MIN:0,DRAWDOWN_STRATEGY:"minimiseEarlyTax"},ce={BASE_SALARY:3e4,EQUITY_MIN:25e4,BOND_MIN:2e5,CASH_TARGET:5e4,DURATION_YEARS:35,PROTECTION_FACTOR:20,RECOVERY_BUFFER:15e3,CONSECUTIVE_LIMIT:3},ts={PROTECTION_MULTIPLIER:.8,HODL_ENABLED:!1,HODL_VALUE:25e3},Br={1928:.4781,1929:-.172,1930:-.338,1931:-.527,1932:-.231,1933:.669,1934:.041,1935:.3879,1936:.2492,1937:-.3839,1938:.2846,1939:-.0278,1940:-.1278,1941:-.1552,1942:.0782,1943:.1382,1944:.1226,1945:.2665,1946:-.0818,1947:.0225,1948:-.0246,1949:.1279,1950:.1787,1951:.1463,1952:.0837,1953:-.0377,1954:.4399,1955:.2084,1956:.0262,1957:-.1278,1958:.3396,1959:.1612,1960:-.0912,1961:.1889,1962:-.1081,1963:.1715,1964:.1478,1965:.1058,1966:-.1858,1967:.1506,1968:.0457,1969:-.1524,1970:.0482,1971:.0627,1972:.1476,1973:-.1652,1974:-.2777,1975:.3815,1976:.1774,1977:-.1271,1978:-.0303,1979:.0414,1980:.1493,1981:-.0909,1982:.1976,1983:.2027,1984:-.0365,1985:.2778,1986:.2278,1987:.0227,1988:.1185,1989:.2697,1990:-.0456,1991:.2013,1992:.044,1993:.1372,1994:.0218,1995:.3345,1996:.2601,1997:.2264,1998:.1627,1999:.2516,2e3:-.0617,2001:-.0727,2002:-.1679,2003:.2525,2004:.0333,2005:-.0061,2006:.1618,2007:.0648,2008:-.3355,2009:.1882,2010:.1102,2011:.0556,2012:.0728,2013:.2665,2014:.0775,2015:-.023,2016:.1342,2017:.2511,2018:-.0583,2019:.2234,2020:.0726,2021:.1873,2022:-.0878,2023:.1399,2024:.1299},cl={1928:-.012,1929:.002,1930:-.06,1931:-.094,1932:-.103,1933:.005,1934:.021,1935:.03,1936:.014,1937:.028,1938:-.02,1939:-.014,1940:.01,1941:.099,1942:.09,1943:.03,1944:.023,1945:.023,1946:.186,1947:.087,1948:.03,1949:-.02,1950:.059,1951:.06,1952:.009,1953:.006,1954:-.007,1955:.004,1956:.03,1957:.028,1958:.017,1959:.015,1960:.014,1961:.007,1962:.013,1963:.017,1964:.01,1965:.019,1966:.034,1967:.028,1968:.046,1969:.062,1970:.055,1971:.033,1972:.034,1973:.087,1974:.124,1975:.069,1976:.048,1977:.067,1978:.09,1979:.133,1980:.125,1981:.089,1982:.038,1983:.038,1984:.04,1985:.038,1986:.011,1987:.044,1988:.044,1989:.046,1990:.061,1991:.03,1992:.029,1993:.027,1994:.026,1995:.025,1996:.034,1997:.017,1998:.016,1999:.027,2e3:.034,2001:.016,2002:.024,2003:.019,2004:.033,2005:.034,2006:.025,2007:.041,2008:.001,2009:.027,2010:.015,2011:.03,2012:.017,2013:.015,2014:.008,2015:.007,2016:.021,2017:.021,2018:.019,2019:.023,2020:.012,2021:.07,2022:.065,2023:.032,2024:.029},im={GREAT_DEPRESSION:{name:"Great Depression",equity:[-.17,-.34,-.53,-.23,.67,.04,.39,.25,-.38,.28],inflation:[0,-.06,-.09,-.1,.01,.02,.03,.01,.03,-.02],color:"#e74c3c"},STAGFLATION_70S:{name:"Stagflation 70s",equity:[-.17,-.28,.38,.18,-.13,-.03,.04,.15,-.09,.2],inflation:[.09,.12,.07,.05,.07,.09,.13,.13,.09,.04],color:"#e67e22"},LOST_DECADE_2000S:{name:"Lost Decade 2000s",equity:[-.06,-.07,-.17,.25,.03,-.01,.16,.06,-.34,.19],inflation:[.03,.02,.02,.02,.03,.03,.03,.04,0,.03],color:"#9b59b6"},CRISIS_2008:{name:"2008 Crisis",equity:[-.34,.19,.11,.06,.07,.27,.08,-.02,.13,.25],inflation:[0,.03,.02,.03,.02,.02,.01,.01,.02,.02],color:"#3498db"},SYNTHETIC_WORST:{name:"Synthetic Worst",equity:[-.4,.1,.1,.1,-.35,.1,.1,.1,.1,-.3],inflation:[.08,.05,.05,.05,.08,.05,.05,.05,.05,.08],color:"#1abc9c"}},Vt={START_MONTH:4,START_DAY:6};function Yi(n,e,t,s=Fe.HIGHER_RATE_LIMIT){if(n<=0)return 0;let r=e;if(n>Fe.PA_TAPER_THRESHOLD){const f=(n-Fe.PA_TAPER_THRESHOLD)*Fe.PA_TAPER_RATE;r=Math.max(0,e-f)}const i=Math.max(0,n-r),a=Math.max(0,t-r),l=s-t;let c=0;const d=Math.min(i,a);if(c+=d*Fe.BASIC_RATE,i>a){const f=Math.min(i-a,l);c+=f*Fe.HIGHER_RATE}if(i>a+l){const f=i-a-l;c+=f*Fe.ADDITIONAL_RATE}return c}function Pn(n,e,t,s=Fe.HIGHER_RATE_LIMIT){return n-Yi(n,e,t,s)}function om(n,e,t,s=Fe.HIGHER_RATE_LIMIT){if(n<=0)return 0;let r=n,i=n+1;for(;Pn(i,e,t,s)<n&&i<1e12;)i*=2;for(let a=0;a<60;a++){const l=(r+i)/2;Pn(l,e,t,s)<n?r=l:i=l}return(r+i)/2}function vo(n){const e=typeof n=="string"?new Date(n):n,t=e.getFullYear(),s=e.getMonth()+1,r=e.getDate();if(s<Vt.START_MONTH||s===Vt.START_MONTH&&r<Vt.START_DAY){const i=t-1;return`${String(i).slice(-2)}/${String(t).slice(-2)}`}return`${String(t).slice(-2)}/${String(t+1).slice(-2)}`}function ga(n){const e=parseInt(n.split("/")[0]),t=e<50?2e3+e:1900+e;return new Date(t,Vt.START_MONTH-1,Vt.START_DAY)}function am(n){const e=parseInt(n.split("/")[1]),t=e<50?2e3+e:1900+e;return new Date(t,Vt.START_MONTH-1,Vt.START_DAY-1)}function lm(){const n=new Date;return`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`}function ul(n){const[e,t]=n.split("-").map(Number);return new Date(e,t-1,15)}function cm(n){const t=(typeof n=="string"?new Date(n):n).getMonth()+1;return t>=Vt.START_MONTH?12-(t-Vt.START_MONTH):Vt.START_MONTH-t}const um=ll.ASSUMED_CPI,dm=ll.OTHER_INCOME_CAP;function Dd(n,e,t=dm){let s=n;for(const r of e)s*=1+Math.min(r,t);return s}function hm(n){const{baseSalary:e,cumulativeInflation:t,yearlyInflation:s=[],other:r=0,statePension:i=0,statePensionYear:a=12,yearNumber:l=0,pa:c,brl:d,hrl:f,taxMode:m="inflates"}=n,_=m==="frozen"?c:c*t,w=m==="frozen"?d:d*t,T=m==="frozen"?f:f*t,C=e*t,x=Dd(r,s),I=l>=a?i*t:0,M=x+I,P=Math.max(0,w-M),O=Math.max(0,C-M),z=Math.min(P,O);return{pa:_,brl:w,hrl:T,targetGross:C,other:x,statePension:I,fixedIncome:M,annualSippDraw:z,monthlySippDraw:z/12,sippPlusfixedAtBRL:P+M===w}}function fm(n,e,t=.025){const s=[],r=[];for(let i=0;i<=e;i++){i>0&&r.push(t);const a=Math.pow(1+t,i),l=hm({baseSalary:n.baseSalary,cumulativeInflation:a,yearlyInflation:[...r],other:n.other,statePension:n.statePension,statePensionYear:n.statePensionYear,yearNumber:i,pa:n.pa,brl:n.brl,hrl:n.hrl,taxMode:n.taxMode}),c=l.annualSippDraw+l.other+l.statePension,d=Yi(c,l.pa,l.brl,l.hrl);s.push({year:i,brl:l.brl,other:l.other,statePension:l.statePension,sippDraw:l.annualSippDraw,totalTaxable:c,tax:d,netIncome:c-d})}return s}function tn(n,e,t,s,r){if(r){const i=Math.max(0,1-e/t);return n*s*i}return n*s}function pm(n,e,t){const s=tn(n.equityMin,e,n.duration,t,!0),r=tn(n.bondMin,e,n.duration,t,!0),i=tn(n.cashTarget,e,n.duration,t,!1);return{equity:s,bond:r,cash:i,totalGrowth:s+r,total:s+r+i}}function mm(n,e=ll.ASSUMED_CPI){const t=[];for(let s=0;s<=n.duration;s++){const r=Math.pow(1+e,s),i=pm(n,s,r);t.push({year:s,cumulativeInflation:r,equityMin:i.equity,bondMin:i.bond,cashTarget:i.cash,totalMin:i.total})}return t}const gm="modulepreload",ym=function(n,e){return new URL(n,e).href},ou={},au=function(e,t,s){let r=Promise.resolve();if(t&&t.length>0){const a=document.getElementsByTagName("link"),l=document.querySelector("meta[property=csp-nonce]"),c=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));r=Promise.allSettled(t.map(d=>{if(d=ym(d,s),d in ou)return;ou[d]=!0;const f=d.endsWith(".css"),m=f?'[rel="stylesheet"]':"";if(!!s)for(let T=a.length-1;T>=0;T--){const C=a[T];if(C.href===d&&(!f||C.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${d}"]${m}`))return;const w=document.createElement("link");if(w.rel=f?"stylesheet":gm,f||(w.as="script"),w.crossOrigin="",w.href=d,c&&w.setAttribute("nonce",c),document.head.appendChild(w),f)return new Promise((T,C)=>{w.addEventListener("load",T),w.addEventListener("error",()=>C(new Error(`Unable to preload CSS for ${d}`)))})}))}function i(a){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=a,window.dispatchEvent(l),!l.defaultPrevented)throw a}return r.then(a=>{for(const l of a||[])l.status==="rejected"&&i(l.reason);return e().catch(i)})};function dl(n){let e=n;return function(){return e=Math.sin(e)*1e4,e-Math.floor(e)}}function br(n,e,t){const s=Math.max(t(),1e-12),r=t();let i=Math.sqrt(-2*Math.log(s))*Math.cos(2*Math.PI*r);return i=Math.max(-4,Math.min(4,i)),n+e*i}function hl(n){const e=JSON.stringify(n);let t=0;for(let s=0;s<e.length;s++){const r=e.charCodeAt(s);t=(t<<5)-t+r,t=t&t}return t.toString(16)}var lu={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nd=function(n){const e=[];let t=0;for(let s=0;s<n.length;s++){let r=n.charCodeAt(s);r<128?e[t++]=r:r<2048?(e[t++]=r>>6|192,e[t++]=r&63|128):(r&64512)===55296&&s+1<n.length&&(n.charCodeAt(s+1)&64512)===56320?(r=65536+((r&1023)<<10)+(n.charCodeAt(++s)&1023),e[t++]=r>>18|240,e[t++]=r>>12&63|128,e[t++]=r>>6&63|128,e[t++]=r&63|128):(e[t++]=r>>12|224,e[t++]=r>>6&63|128,e[t++]=r&63|128)}return e},vm=function(n){const e=[];let t=0,s=0;for(;t<n.length;){const r=n[t++];if(r<128)e[s++]=String.fromCharCode(r);else if(r>191&&r<224){const i=n[t++];e[s++]=String.fromCharCode((r&31)<<6|i&63)}else if(r>239&&r<365){const i=n[t++],a=n[t++],l=n[t++],c=((r&7)<<18|(i&63)<<12|(a&63)<<6|l&63)-65536;e[s++]=String.fromCharCode(55296+(c>>10)),e[s++]=String.fromCharCode(56320+(c&1023))}else{const i=n[t++],a=n[t++];e[s++]=String.fromCharCode((r&15)<<12|(i&63)<<6|a&63)}}return e.join("")},Ld={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let r=0;r<n.length;r+=3){const i=n[r],a=r+1<n.length,l=a?n[r+1]:0,c=r+2<n.length,d=c?n[r+2]:0,f=i>>2,m=(i&3)<<4|l>>4;let _=(l&15)<<2|d>>6,w=d&63;c||(w=64,a||(_=64)),s.push(t[f],t[m],t[_],t[w])}return s.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(Nd(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):vm(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let r=0;r<n.length;){const i=t[n.charAt(r++)],l=r<n.length?t[n.charAt(r)]:0;++r;const d=r<n.length?t[n.charAt(r)]:64;++r;const m=r<n.length?t[n.charAt(r)]:64;if(++r,i==null||l==null||d==null||m==null)throw new _m;const _=i<<2|l>>4;if(s.push(_),d!==64){const w=l<<4&240|d>>2;if(s.push(w),m!==64){const T=d<<6&192|m;s.push(T)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class _m extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const wm=function(n){const e=Nd(n);return Ld.encodeByteArray(e,!0)},Gi=function(n){return wm(n).replace(/\./g,"")},Od=function(n){try{return Ld.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function bm(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const Em=()=>bm().__FIREBASE_DEFAULTS__,Tm=()=>{if(typeof process>"u"||typeof lu>"u")return;const n=lu.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},Im=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&Od(n[1]);return e&&JSON.parse(e)},_o=()=>{try{return Em()||Tm()||Im()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},Vd=n=>{var e,t;return(t=(e=_o())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[n]},Sm=n=>{const e=Vd(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const s=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),s]:[e.substring(0,t),s]},Bd=()=>{var n;return(n=_o())===null||n===void 0?void 0:n.config},Fd=n=>{var e;return(e=_o())===null||e===void 0?void 0:e[`_${n}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xm{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,s)=>{t?this.reject(t):this.resolve(s),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,s))}}}/**
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
 */function Am(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},s=e||"demo-project",r=n.iat||0,i=n.sub||n.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const a=Object.assign({iss:`https://securetoken.google.com/${s}`,aud:s,iat:r,exp:r+3600,auth_time:r,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}}},n);return[Gi(JSON.stringify(t)),Gi(JSON.stringify(a)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ze(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Rm(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Ze())}function Pm(){var n;const e=(n=_o())===null||n===void 0?void 0:n.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Cm(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function km(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function Mm(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Dm(){const n=Ze();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function Nm(){return!Pm()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Lm(){try{return typeof indexedDB=="object"}catch{return!1}}function Om(){return new Promise((n,e)=>{try{let t=!0;const s="validate-browser-context-for-indexeddb-analytics-module",r=self.indexedDB.open(s);r.onsuccess=()=>{r.result.close(),t||self.indexedDB.deleteDatabase(s),n(!0)},r.onupgradeneeded=()=>{t=!1},r.onerror=()=>{var i;e(((i=r.error)===null||i===void 0?void 0:i.message)||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vm="FirebaseError";class un extends Error{constructor(e,t,s){super(t),this.code=e,this.customData=s,this.name=Vm,Object.setPrototypeOf(this,un.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Xr.prototype.create)}}class Xr{constructor(e,t,s){this.service=e,this.serviceName=t,this.errors=s}create(e,...t){const s=t[0]||{},r=`${this.service}/${e}`,i=this.errors[e],a=i?Bm(i,s):"Error",l=`${this.serviceName}: ${a} (${r}).`;return new un(r,l,s)}}function Bm(n,e){return n.replace(Fm,(t,s)=>{const r=e[s];return r!=null?String(r):`<${s}?>`})}const Fm=/\{\$([^}]+)}/g;function zm(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function Ki(n,e){if(n===e)return!0;const t=Object.keys(n),s=Object.keys(e);for(const r of t){if(!s.includes(r))return!1;const i=n[r],a=e[r];if(cu(i)&&cu(a)){if(!Ki(i,a))return!1}else if(i!==a)return!1}for(const r of s)if(!t.includes(r))return!1;return!0}function cu(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zr(n){const e=[];for(const[t,s]of Object.entries(n))Array.isArray(s)?s.forEach(r=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(r))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(s));return e.length?"&"+e.join("&"):""}function Ir(n){const e={};return n.replace(/^\?/,"").split("&").forEach(s=>{if(s){const[r,i]=s.split("=");e[decodeURIComponent(r)]=decodeURIComponent(i)}}),e}function Sr(n){const e=n.indexOf("?");if(!e)return"";const t=n.indexOf("#",e);return n.substring(e,t>0?t:void 0)}function Um(n,e){const t=new $m(n,e);return t.subscribe.bind(t)}class $m{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(s=>{this.error(s)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,s){let r;if(e===void 0&&t===void 0&&s===void 0)throw new Error("Missing Observer.");qm(e,["next","error","complete"])?r=e:r={next:e,error:t,complete:s},r.next===void 0&&(r.next=ya),r.error===void 0&&(r.error=ya),r.complete===void 0&&(r.complete=ya);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?r.error(this.finalError):r.complete()}catch{}}),this.observers.push(r),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(s){typeof console<"u"&&console.error&&console.error(s)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function qm(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function ya(){}/**
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
 */function Ce(n){return n&&n._delegate?n._delegate:n}class rs{constructor(e,t,s){this.name=e,this.instanceFactory=t,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jn="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hm{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const s=new xm;if(this.instancesDeferred.set(t,s),this.isInitialized(t)||this.shouldAutoInitialize())try{const r=this.getOrInitializeService({instanceIdentifier:t});r&&s.resolve(r)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const s=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(t=e==null?void 0:e.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(s)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:s})}catch(i){if(r)return null;throw i}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Wm(e))try{this.getOrInitializeService({instanceIdentifier:Jn})}catch{}for(const[t,s]of this.instancesDeferred.entries()){const r=this.normalizeInstanceIdentifier(t);try{const i=this.getOrInitializeService({instanceIdentifier:r});s.resolve(i)}catch{}}}}clearInstance(e=Jn){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Jn){return this.instances.has(e)}getOptions(e=Jn){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,s=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const r=this.getOrInitializeService({instanceIdentifier:s,options:t});for(const[i,a]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(i);s===l&&a.resolve(r)}return r}onInit(e,t){var s;const r=this.normalizeInstanceIdentifier(t),i=(s=this.onInitCallbacks.get(r))!==null&&s!==void 0?s:new Set;i.add(e),this.onInitCallbacks.set(r,i);const a=this.instances.get(r);return a&&e(a,r),()=>{i.delete(e)}}invokeOnInitCallbacks(e,t){const s=this.onInitCallbacks.get(t);if(s)for(const r of s)try{r(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let s=this.instances.get(e);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:jm(e),options:t}),this.instances.set(e,s),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(s,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,s)}catch{}return s||null}normalizeInstanceIdentifier(e=Jn){return this.component?this.component.multipleInstances?e:Jn:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function jm(n){return n===Jn?void 0:n}function Wm(n){return n.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ym{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new Hm(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var te;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(te||(te={}));const Gm={debug:te.DEBUG,verbose:te.VERBOSE,info:te.INFO,warn:te.WARN,error:te.ERROR,silent:te.SILENT},Km=te.INFO,Qm={[te.DEBUG]:"log",[te.VERBOSE]:"log",[te.INFO]:"info",[te.WARN]:"warn",[te.ERROR]:"error"},Jm=(n,e,...t)=>{if(e<n.logLevel)return;const s=new Date().toISOString(),r=Qm[e];if(r)console[r](`[${s}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class fl{constructor(e){this.name=e,this._logLevel=Km,this._logHandler=Jm,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in te))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Gm[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,te.DEBUG,...e),this._logHandler(this,te.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,te.VERBOSE,...e),this._logHandler(this,te.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,te.INFO,...e),this._logHandler(this,te.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,te.WARN,...e),this._logHandler(this,te.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,te.ERROR,...e),this._logHandler(this,te.ERROR,...e)}}const Xm=(n,e)=>e.some(t=>n instanceof t);let uu,du;function Zm(){return uu||(uu=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function eg(){return du||(du=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const zd=new WeakMap,La=new WeakMap,Ud=new WeakMap,va=new WeakMap,pl=new WeakMap;function tg(n){const e=new Promise((t,s)=>{const r=()=>{n.removeEventListener("success",i),n.removeEventListener("error",a)},i=()=>{t(Cn(n.result)),r()},a=()=>{s(n.error),r()};n.addEventListener("success",i),n.addEventListener("error",a)});return e.then(t=>{t instanceof IDBCursor&&zd.set(t,n)}).catch(()=>{}),pl.set(e,n),e}function ng(n){if(La.has(n))return;const e=new Promise((t,s)=>{const r=()=>{n.removeEventListener("complete",i),n.removeEventListener("error",a),n.removeEventListener("abort",a)},i=()=>{t(),r()},a=()=>{s(n.error||new DOMException("AbortError","AbortError")),r()};n.addEventListener("complete",i),n.addEventListener("error",a),n.addEventListener("abort",a)});La.set(n,e)}let Oa={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return La.get(n);if(e==="objectStoreNames")return n.objectStoreNames||Ud.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return Cn(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function sg(n){Oa=n(Oa)}function rg(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const s=n.call(_a(this),e,...t);return Ud.set(s,e.sort?e.sort():[e]),Cn(s)}:eg().includes(n)?function(...e){return n.apply(_a(this),e),Cn(zd.get(this))}:function(...e){return Cn(n.apply(_a(this),e))}}function ig(n){return typeof n=="function"?rg(n):(n instanceof IDBTransaction&&ng(n),Xm(n,Zm())?new Proxy(n,Oa):n)}function Cn(n){if(n instanceof IDBRequest)return tg(n);if(va.has(n))return va.get(n);const e=ig(n);return e!==n&&(va.set(n,e),pl.set(e,n)),e}const _a=n=>pl.get(n);function og(n,e,{blocked:t,upgrade:s,blocking:r,terminated:i}={}){const a=indexedDB.open(n,e),l=Cn(a);return s&&a.addEventListener("upgradeneeded",c=>{s(Cn(a.result),c.oldVersion,c.newVersion,Cn(a.transaction),c)}),t&&a.addEventListener("blocked",c=>t(c.oldVersion,c.newVersion,c)),l.then(c=>{i&&c.addEventListener("close",()=>i()),r&&c.addEventListener("versionchange",d=>r(d.oldVersion,d.newVersion,d))}).catch(()=>{}),l}const ag=["get","getKey","getAll","getAllKeys","count"],lg=["put","add","delete","clear"],wa=new Map;function hu(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(wa.get(e))return wa.get(e);const t=e.replace(/FromIndex$/,""),s=e!==t,r=lg.includes(t);if(!(t in(s?IDBIndex:IDBObjectStore).prototype)||!(r||ag.includes(t)))return;const i=async function(a,...l){const c=this.transaction(a,r?"readwrite":"readonly");let d=c.store;return s&&(d=d.index(l.shift())),(await Promise.all([d[t](...l),r&&c.done]))[0]};return wa.set(e,i),i}sg(n=>({...n,get:(e,t,s)=>hu(e,t)||n.get(e,t,s),has:(e,t)=>!!hu(e,t)||n.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cg{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(ug(t)){const s=t.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(t=>t).join(" ")}}function ug(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Va="@firebase/app",fu="0.10.13";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rn=new fl("@firebase/app"),dg="@firebase/app-compat",hg="@firebase/analytics-compat",fg="@firebase/analytics",pg="@firebase/app-check-compat",mg="@firebase/app-check",gg="@firebase/auth",yg="@firebase/auth-compat",vg="@firebase/database",_g="@firebase/data-connect",wg="@firebase/database-compat",bg="@firebase/functions",Eg="@firebase/functions-compat",Tg="@firebase/installations",Ig="@firebase/installations-compat",Sg="@firebase/messaging",xg="@firebase/messaging-compat",Ag="@firebase/performance",Rg="@firebase/performance-compat",Pg="@firebase/remote-config",Cg="@firebase/remote-config-compat",kg="@firebase/storage",Mg="@firebase/storage-compat",Dg="@firebase/firestore",Ng="@firebase/vertexai-preview",Lg="@firebase/firestore-compat",Og="firebase",Vg="10.14.1";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ba="[DEFAULT]",Bg={[Va]:"fire-core",[dg]:"fire-core-compat",[fg]:"fire-analytics",[hg]:"fire-analytics-compat",[mg]:"fire-app-check",[pg]:"fire-app-check-compat",[gg]:"fire-auth",[yg]:"fire-auth-compat",[vg]:"fire-rtdb",[_g]:"fire-data-connect",[wg]:"fire-rtdb-compat",[bg]:"fire-fn",[Eg]:"fire-fn-compat",[Tg]:"fire-iid",[Ig]:"fire-iid-compat",[Sg]:"fire-fcm",[xg]:"fire-fcm-compat",[Ag]:"fire-perf",[Rg]:"fire-perf-compat",[Pg]:"fire-rc",[Cg]:"fire-rc-compat",[kg]:"fire-gcs",[Mg]:"fire-gcs-compat",[Dg]:"fire-fst",[Lg]:"fire-fst-compat",[Ng]:"fire-vertex","fire-js":"fire-js",[Og]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qi=new Map,Fg=new Map,Fa=new Map;function pu(n,e){try{n.container.addComponent(e)}catch(t){rn.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function zs(n){const e=n.name;if(Fa.has(e))return rn.debug(`There were multiple attempts to register component ${e}.`),!1;Fa.set(e,n);for(const t of Qi.values())pu(t,n);for(const t of Fg.values())pu(t,n);return!0}function ml(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function Rt(n){return n.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zg={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},kn=new Xr("app","Firebase",zg);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ug{constructor(e,t,s){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new rs("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw kn.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Js=Vg;function $d(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const s=Object.assign({name:Ba,automaticDataCollectionEnabled:!1},e),r=s.name;if(typeof r!="string"||!r)throw kn.create("bad-app-name",{appName:String(r)});if(t||(t=Bd()),!t)throw kn.create("no-options");const i=Qi.get(r);if(i){if(Ki(t,i.options)&&Ki(s,i.config))return i;throw kn.create("duplicate-app",{appName:r})}const a=new Ym(r);for(const c of Fa.values())a.addComponent(c);const l=new Ug(t,s,a);return Qi.set(r,l),l}function qd(n=Ba){const e=Qi.get(n);if(!e&&n===Ba&&Bd())return $d();if(!e)throw kn.create("no-app",{appName:n});return e}function Mn(n,e,t){var s;let r=(s=Bg[n])!==null&&s!==void 0?s:n;t&&(r+=`-${t}`);const i=r.match(/\s|\//),a=e.match(/\s|\//);if(i||a){const l=[`Unable to register library "${r}" with version "${e}":`];i&&l.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&a&&l.push("and"),a&&l.push(`version name "${e}" contains illegal characters (whitespace or "/")`),rn.warn(l.join(" "));return}zs(new rs(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
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
 */const $g="firebase-heartbeat-database",qg=1,Fr="firebase-heartbeat-store";let ba=null;function Hd(){return ba||(ba=og($g,qg,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(Fr)}catch(t){console.warn(t)}}}}).catch(n=>{throw kn.create("idb-open",{originalErrorMessage:n.message})})),ba}async function Hg(n){try{const t=(await Hd()).transaction(Fr),s=await t.objectStore(Fr).get(jd(n));return await t.done,s}catch(e){if(e instanceof un)rn.warn(e.message);else{const t=kn.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});rn.warn(t.message)}}}async function mu(n,e){try{const s=(await Hd()).transaction(Fr,"readwrite");await s.objectStore(Fr).put(e,jd(n)),await s.done}catch(t){if(t instanceof un)rn.warn(t.message);else{const s=kn.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});rn.warn(s.message)}}}function jd(n){return`${n.name}!${n.options.appId}`}/**
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
 */const jg=1024,Wg=30*24*60*60*1e3;class Yg{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new Kg(t),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){var e,t;try{const r=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=gu();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(a=>a.date===i)?void 0:(this._heartbeatsCache.heartbeats.push({date:i,agent:r}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(a=>{const l=new Date(a.date).valueOf();return Date.now()-l<=Wg}),this._storage.overwrite(this._heartbeatsCache))}catch(s){rn.warn(s)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=gu(),{heartbeatsToSend:s,unsentEntries:r}=Gg(this._heartbeatsCache.heartbeats),i=Gi(JSON.stringify({version:2,heartbeats:s}));return this._heartbeatsCache.lastSentHeartbeatDate=t,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(t){return rn.warn(t),""}}}function gu(){return new Date().toISOString().substring(0,10)}function Gg(n,e=jg){const t=[];let s=n.slice();for(const r of n){const i=t.find(a=>a.agent===r.agent);if(i){if(i.dates.push(r.date),yu(t)>e){i.dates.pop();break}}else if(t.push({agent:r.agent,dates:[r.date]}),yu(t)>e){t.pop();break}s=s.slice(1)}return{heartbeatsToSend:t,unsentEntries:s}}class Kg{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Lm()?Om().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await Hg(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const r=await this.read();return mu(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const r=await this.read();return mu(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function yu(n){return Gi(JSON.stringify({version:2,heartbeats:n})).length}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qg(n){zs(new rs("platform-logger",e=>new cg(e),"PRIVATE")),zs(new rs("heartbeat",e=>new Yg(e),"PRIVATE")),Mn(Va,fu,n),Mn(Va,fu,"esm2017"),Mn("fire-js","")}Qg("");var Jg="firebase",Xg="10.14.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Mn(Jg,Xg,"app");function gl(n,e){var t={};for(var s in n)Object.prototype.hasOwnProperty.call(n,s)&&e.indexOf(s)<0&&(t[s]=n[s]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var r=0,s=Object.getOwnPropertySymbols(n);r<s.length;r++)e.indexOf(s[r])<0&&Object.prototype.propertyIsEnumerable.call(n,s[r])&&(t[s[r]]=n[s[r]]);return t}function Wd(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Zg=Wd,Yd=new Xr("auth","Firebase",Wd());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ji=new fl("@firebase/auth");function ey(n,...e){Ji.logLevel<=te.WARN&&Ji.warn(`Auth (${Js}): ${n}`,...e)}function Oi(n,...e){Ji.logLevel<=te.ERROR&&Ji.error(`Auth (${Js}): ${n}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Et(n,...e){throw vl(n,...e)}function Ct(n,...e){return vl(n,...e)}function yl(n,e,t){const s=Object.assign(Object.assign({},Zg()),{[e]:t});return new Xr("auth","Firebase",s).create(e,{appName:n.name})}function nn(n){return yl(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function ty(n,e,t){const s=t;if(!(e instanceof s))throw s.name!==e.constructor.name&&Et(n,"argument-error"),yl(n,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function vl(n,...e){if(typeof n!="string"){const t=e[0],s=[...e.slice(1)];return s[0]&&(s[0].appName=n.name),n._errorFactory.create(t,...s)}return Yd.create(n,...e)}function j(n,e,...t){if(!n)throw vl(e,...t)}function Xt(n){const e="INTERNAL ASSERTION FAILED: "+n;throw Oi(e),new Error(e)}function on(n,e){n||Xt(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function za(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.href)||""}function ny(){return vu()==="http:"||vu()==="https:"}function vu(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sy(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(ny()||km()||"connection"in navigator)?navigator.onLine:!0}function ry(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ei{constructor(e,t){this.shortDelay=e,this.longDelay=t,on(t>e,"Short delay should be less than long delay!"),this.isMobile=Rm()||Mm()}get(){return sy()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _l(n,e){on(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gd{static initialize(e,t,s){this.fetchImpl=e,t&&(this.headersImpl=t),s&&(this.responseImpl=s)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Xt("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Xt("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Xt("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const iy={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const oy=new ei(3e4,6e4);function dn(n,e){return n.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:n.tenantId}):e}async function Ht(n,e,t,s,r={}){return Kd(n,r,async()=>{let i={},a={};s&&(e==="GET"?a=s:i={body:JSON.stringify(s)});const l=Zr(Object.assign({key:n.config.apiKey},a)).slice(1),c=await n._getAdditionalHeaders();c["Content-Type"]="application/json",n.languageCode&&(c["X-Firebase-Locale"]=n.languageCode);const d=Object.assign({method:e,headers:c},i);return Cm()||(d.referrerPolicy="no-referrer"),Gd.fetch()(Qd(n,n.config.apiHost,t,l),d)})}async function Kd(n,e,t){n._canInitEmulator=!1;const s=Object.assign(Object.assign({},iy),e);try{const r=new ly(n),i=await Promise.race([t(),r.promise]);r.clearNetworkTimeout();const a=await i.json();if("needConfirmation"in a)throw ki(n,"account-exists-with-different-credential",a);if(i.ok&&!("errorMessage"in a))return a;{const l=i.ok?a.errorMessage:a.error.message,[c,d]=l.split(" : ");if(c==="FEDERATED_USER_ID_ALREADY_LINKED")throw ki(n,"credential-already-in-use",a);if(c==="EMAIL_EXISTS")throw ki(n,"email-already-in-use",a);if(c==="USER_DISABLED")throw ki(n,"user-disabled",a);const f=s[c]||c.toLowerCase().replace(/[_\s]+/g,"-");if(d)throw yl(n,f,d);Et(n,f)}}catch(r){if(r instanceof un)throw r;Et(n,"network-request-failed",{message:String(r)})}}async function ti(n,e,t,s,r={}){const i=await Ht(n,e,t,s,r);return"mfaPendingCredential"in i&&Et(n,"multi-factor-auth-required",{_serverResponse:i}),i}function Qd(n,e,t,s){const r=`${e}${t}?${s}`;return n.config.emulator?_l(n.config,r):`${n.config.apiScheme}://${r}`}function ay(n){switch(n){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class ly{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,s)=>{this.timer=setTimeout(()=>s(Ct(this.auth,"network-request-failed")),oy.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function ki(n,e,t){const s={appName:n.name};t.email&&(s.email=t.email),t.phoneNumber&&(s.phoneNumber=t.phoneNumber);const r=Ct(n,e,s);return r.customData._tokenResponse=t,r}function _u(n){return n!==void 0&&n.enterprise!==void 0}class cy{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return ay(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}}async function uy(n,e){return Ht(n,"GET","/v2/recaptchaConfig",dn(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function dy(n,e){return Ht(n,"POST","/v1/accounts:delete",e)}async function Jd(n,e){return Ht(n,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kr(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function hy(n,e=!1){const t=Ce(n),s=await t.getIdToken(e),r=wl(s);j(r&&r.exp&&r.auth_time&&r.iat,t.auth,"internal-error");const i=typeof r.firebase=="object"?r.firebase:void 0,a=i==null?void 0:i.sign_in_provider;return{claims:r,token:s,authTime:kr(Ea(r.auth_time)),issuedAtTime:kr(Ea(r.iat)),expirationTime:kr(Ea(r.exp)),signInProvider:a||null,signInSecondFactor:(i==null?void 0:i.sign_in_second_factor)||null}}function Ea(n){return Number(n)*1e3}function wl(n){const[e,t,s]=n.split(".");if(e===void 0||t===void 0||s===void 0)return Oi("JWT malformed, contained fewer than 3 sections"),null;try{const r=Od(t);return r?JSON.parse(r):(Oi("Failed to decode base64 JWT payload"),null)}catch(r){return Oi("Caught error parsing JWT payload as JSON",r==null?void 0:r.toString()),null}}function wu(n){const e=wl(n);return j(e,"internal-error"),j(typeof e.exp<"u","internal-error"),j(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Us(n,e,t=!1){if(t)return e;try{return await e}catch(s){throw s instanceof un&&fy(s)&&n.auth.currentUser===n&&await n.auth.signOut(),s}}function fy({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class py{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const s=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),s}else{this.errorBackoff=3e4;const r=((t=this.user.stsTokenManager.expirationTime)!==null&&t!==void 0?t:0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ua{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=kr(this.lastLoginAt),this.creationTime=kr(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Xi(n){var e;const t=n.auth,s=await n.getIdToken(),r=await Us(n,Jd(t,{idToken:s}));j(r==null?void 0:r.users.length,t,"internal-error");const i=r.users[0];n._notifyReloadListener(i);const a=!((e=i.providerUserInfo)===null||e===void 0)&&e.length?Xd(i.providerUserInfo):[],l=gy(n.providerData,a),c=n.isAnonymous,d=!(n.email&&i.passwordHash)&&!(l!=null&&l.length),f=c?d:!1,m={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:l,metadata:new Ua(i.createdAt,i.lastLoginAt),isAnonymous:f};Object.assign(n,m)}async function my(n){const e=Ce(n);await Xi(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function gy(n,e){return[...n.filter(s=>!e.some(r=>r.providerId===s.providerId)),...e]}function Xd(n){return n.map(e=>{var{providerId:t}=e,s=gl(e,["providerId"]);return{providerId:t,uid:s.rawId||"",displayName:s.displayName||null,email:s.email||null,phoneNumber:s.phoneNumber||null,photoURL:s.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function yy(n,e){const t=await Kd(n,{},async()=>{const s=Zr({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:r,apiKey:i}=n.config,a=Qd(n,r,"/v1/token",`key=${i}`),l=await n._getAdditionalHeaders();return l["Content-Type"]="application/x-www-form-urlencoded",Gd.fetch()(a,{method:"POST",headers:l,body:s})});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function vy(n,e){return Ht(n,"POST","/v2/accounts:revokeToken",dn(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ds{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){j(e.idToken,"internal-error"),j(typeof e.idToken<"u","internal-error"),j(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):wu(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){j(e.length!==0,"internal-error");const t=wu(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(j(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:s,refreshToken:r,expiresIn:i}=await yy(e,t);this.updateTokensAndExpiration(s,r,Number(i))}updateTokensAndExpiration(e,t,s){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+s*1e3}static fromJSON(e,t){const{refreshToken:s,accessToken:r,expirationTime:i}=t,a=new Ds;return s&&(j(typeof s=="string","internal-error",{appName:e}),a.refreshToken=s),r&&(j(typeof r=="string","internal-error",{appName:e}),a.accessToken=r),i&&(j(typeof i=="number","internal-error",{appName:e}),a.expirationTime=i),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Ds,this.toJSON())}_performRefresh(){return Xt("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wn(n,e){j(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class Zt{constructor(e){var{uid:t,auth:s,stsTokenManager:r}=e,i=gl(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new py(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=s,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new Ua(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const t=await Us(this,this.stsTokenManager.getToken(this.auth,e));return j(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return hy(this,e)}reload(){return my(this)}_assign(e){this!==e&&(j(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new Zt(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){j(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let s=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),s=!0),t&&await Xi(this),await this.auth._persistUserIfCurrent(this),s&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Rt(this.auth.app))return Promise.reject(nn(this.auth));const e=await this.getIdToken();return await Us(this,dy(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var s,r,i,a,l,c,d,f;const m=(s=t.displayName)!==null&&s!==void 0?s:void 0,_=(r=t.email)!==null&&r!==void 0?r:void 0,w=(i=t.phoneNumber)!==null&&i!==void 0?i:void 0,T=(a=t.photoURL)!==null&&a!==void 0?a:void 0,C=(l=t.tenantId)!==null&&l!==void 0?l:void 0,x=(c=t._redirectEventId)!==null&&c!==void 0?c:void 0,I=(d=t.createdAt)!==null&&d!==void 0?d:void 0,M=(f=t.lastLoginAt)!==null&&f!==void 0?f:void 0,{uid:D,emailVerified:P,isAnonymous:O,providerData:z,stsTokenManager:g}=t;j(D&&g,e,"internal-error");const y=Ds.fromJSON(this.name,g);j(typeof D=="string",e,"internal-error"),wn(m,e.name),wn(_,e.name),j(typeof P=="boolean",e,"internal-error"),j(typeof O=="boolean",e,"internal-error"),wn(w,e.name),wn(T,e.name),wn(C,e.name),wn(x,e.name),wn(I,e.name),wn(M,e.name);const v=new Zt({uid:D,auth:e,email:_,emailVerified:P,displayName:m,isAnonymous:O,photoURL:T,phoneNumber:w,tenantId:C,stsTokenManager:y,createdAt:I,lastLoginAt:M});return z&&Array.isArray(z)&&(v.providerData=z.map(E=>Object.assign({},E))),x&&(v._redirectEventId=x),v}static async _fromIdTokenResponse(e,t,s=!1){const r=new Ds;r.updateFromServerResponse(t);const i=new Zt({uid:t.localId,auth:e,stsTokenManager:r,isAnonymous:s});return await Xi(i),i}static async _fromGetAccountInfoResponse(e,t,s){const r=t.users[0];j(r.localId!==void 0,"internal-error");const i=r.providerUserInfo!==void 0?Xd(r.providerUserInfo):[],a=!(r.email&&r.passwordHash)&&!(i!=null&&i.length),l=new Ds;l.updateFromIdToken(s);const c=new Zt({uid:r.localId,auth:e,stsTokenManager:l,isAnonymous:a}),d={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:i,metadata:new Ua(r.createdAt,r.lastLoginAt),isAnonymous:!(r.email&&r.passwordHash)&&!(i!=null&&i.length)};return Object.assign(c,d),c}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bu=new Map;function en(n){on(n instanceof Function,"Expected a class definition");let e=bu.get(n);return e?(on(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,bu.set(n,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zd{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}Zd.type="NONE";const Eu=Zd;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vi(n,e,t){return`firebase:${n}:${e}:${t}`}class Ns{constructor(e,t,s){this.persistence=e,this.auth=t,this.userKey=s;const{config:r,name:i}=this.auth;this.fullUserKey=Vi(this.userKey,r.apiKey,i),this.fullPersistenceKey=Vi("persistence",r.apiKey,i),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?Zt._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,s="authUser"){if(!t.length)return new Ns(en(Eu),e,s);const r=(await Promise.all(t.map(async d=>{if(await d._isAvailable())return d}))).filter(d=>d);let i=r[0]||en(Eu);const a=Vi(s,e.config.apiKey,e.name);let l=null;for(const d of t)try{const f=await d._get(a);if(f){const m=Zt._fromJSON(e,f);d!==i&&(l=m),i=d;break}}catch{}const c=r.filter(d=>d._shouldAllowMigration);return!i._shouldAllowMigration||!c.length?new Ns(i,e,s):(i=c[0],l&&await i._set(a,l.toJSON()),await Promise.all(t.map(async d=>{if(d!==i)try{await d._remove(a)}catch{}})),new Ns(i,e,s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Tu(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(sh(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(eh(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(ih(e))return"Blackberry";if(oh(e))return"Webos";if(th(e))return"Safari";if((e.includes("chrome/")||nh(e))&&!e.includes("edge/"))return"Chrome";if(rh(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,s=n.match(t);if((s==null?void 0:s.length)===2)return s[1]}return"Other"}function eh(n=Ze()){return/firefox\//i.test(n)}function th(n=Ze()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function nh(n=Ze()){return/crios\//i.test(n)}function sh(n=Ze()){return/iemobile/i.test(n)}function rh(n=Ze()){return/android/i.test(n)}function ih(n=Ze()){return/blackberry/i.test(n)}function oh(n=Ze()){return/webos/i.test(n)}function bl(n=Ze()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function _y(n=Ze()){var e;return bl(n)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function wy(){return Dm()&&document.documentMode===10}function ah(n=Ze()){return bl(n)||rh(n)||oh(n)||ih(n)||/windows phone/i.test(n)||sh(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lh(n,e=[]){let t;switch(n){case"Browser":t=Tu(Ze());break;case"Worker":t=`${Tu(Ze())}-${n}`;break;default:t=n}const s=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${Js}/${s}`}/**
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
 */class by{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const s=i=>new Promise((a,l)=>{try{const c=e(i);a(c)}catch(c){l(c)}});s.onAbort=t,this.queue.push(s);const r=this.queue.length-1;return()=>{this.queue[r]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const s of this.queue)await s(e),s.onAbort&&t.push(s.onAbort)}catch(s){t.reverse();for(const r of t)try{r()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:s==null?void 0:s.message})}}}/**
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
 */async function Ey(n,e={}){return Ht(n,"GET","/v2/passwordPolicy",dn(n,e))}/**
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
 */const Ty=6;class Iy{constructor(e){var t,s,r,i;const a=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(t=a.minPasswordLength)!==null&&t!==void 0?t:Ty,a.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=a.maxPasswordLength),a.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=a.containsLowercaseCharacter),a.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=a.containsUppercaseCharacter),a.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=a.containsNumericCharacter),a.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=a.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(r=(s=e.allowedNonAlphanumericCharacters)===null||s===void 0?void 0:s.join(""))!==null&&r!==void 0?r:"",this.forceUpgradeOnSignin=(i=e.forceUpgradeOnSignin)!==null&&i!==void 0?i:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,s,r,i,a,l;const c={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,c),this.validatePasswordCharacterOptions(e,c),c.isValid&&(c.isValid=(t=c.meetsMinPasswordLength)!==null&&t!==void 0?t:!0),c.isValid&&(c.isValid=(s=c.meetsMaxPasswordLength)!==null&&s!==void 0?s:!0),c.isValid&&(c.isValid=(r=c.containsLowercaseLetter)!==null&&r!==void 0?r:!0),c.isValid&&(c.isValid=(i=c.containsUppercaseLetter)!==null&&i!==void 0?i:!0),c.isValid&&(c.isValid=(a=c.containsNumericCharacter)!==null&&a!==void 0?a:!0),c.isValid&&(c.isValid=(l=c.containsNonAlphanumericCharacter)!==null&&l!==void 0?l:!0),c}validatePasswordLengthOptions(e,t){const s=this.customStrengthOptions.minPasswordLength,r=this.customStrengthOptions.maxPasswordLength;s&&(t.meetsMinPasswordLength=e.length>=s),r&&(t.meetsMaxPasswordLength=e.length<=r)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let s;for(let r=0;r<e.length;r++)s=e.charAt(r),this.updatePasswordCharacterOptionsStatuses(t,s>="a"&&s<="z",s>="A"&&s<="Z",s>="0"&&s<="9",this.allowedNonAlphanumericCharacters.includes(s))}updatePasswordCharacterOptionsStatuses(e,t,s,r,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=s)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=r)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sy{constructor(e,t,s,r){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=s,this.config=r,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Iu(this),this.idTokenSubscription=new Iu(this),this.beforeStateQueue=new by(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Yd,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=r.sdkClientVersion}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=en(t)),this._initializationPromise=this.queue(async()=>{var s,r;if(!this._deleted&&(this.persistenceManager=await Ns.create(this,e),!this._deleted)){if(!((s=this._popupRedirectResolver)===null||s===void 0)&&s._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((r=this.currentUser)===null||r===void 0?void 0:r.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await Jd(this,{idToken:e}),s=await Zt._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(s)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(Rt(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(l=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(l,l))}):this.directlySetCurrentUser(null)}const s=await this.assertedPersistence.getCurrentUser();let r=s,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,l=r==null?void 0:r._redirectEventId,c=await this.tryRedirectSignIn(e);(!a||a===l)&&(c!=null&&c.user)&&(r=c.user,i=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(r)}catch(a){r=s,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return j(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Xi(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=ry()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Rt(this.app))return Promise.reject(nn(this));const t=e?Ce(e):null;return t&&j(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&j(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Rt(this.app)?Promise.reject(nn(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Rt(this.app)?Promise.reject(nn(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(en(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await Ey(this),t=new Iy(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new Xr("auth","Firebase",e())}onAuthStateChanged(e,t,s){return this.registerStateListener(this.authStateSubscription,e,t,s)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,s){return this.registerStateListener(this.idTokenSubscription,e,t,s)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const s=this.onAuthStateChanged(()=>{s(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),s={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(s.tenantId=this.tenantId),await vy(this,s)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){const s=await this.getOrInitRedirectPersistenceManager(t);return e===null?s.removeCurrentUser():s.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&en(e)||this._popupRedirectResolver;j(t,this,"argument-error"),this.redirectPersistenceManager=await Ns.create(this,[en(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,s;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((s=this.redirectUser)===null||s===void 0?void 0:s._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const s=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==s&&(this.lastNotifiedUid=s,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,s,r){if(this._deleted)return()=>{};const i=typeof t=="function"?t:t.next.bind(t);let a=!1;const l=this._isInitialized?Promise.resolve():this._initializationPromise;if(j(l,this,"internal-error"),l.then(()=>{a||i(this.currentUser)}),typeof t=="function"){const c=e.addObserver(t,s,r);return()=>{a=!0,c()}}else{const c=e.addObserver(t);return()=>{a=!0,c()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return j(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=lh(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const s=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());s&&(t["X-Firebase-Client"]=s);const r=await this._getAppCheckToken();return r&&(t["X-Firebase-AppCheck"]=r),t}async _getAppCheckToken(){var e;const t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t!=null&&t.error&&ey(`Error while retrieving App Check token: ${t.error}`),t==null?void 0:t.token}}function hn(n){return Ce(n)}class Iu{constructor(e){this.auth=e,this.observer=null,this.addObserver=Um(t=>this.observer=t)}get next(){return j(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let wo={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function xy(n){wo=n}function ch(n){return wo.loadJS(n)}function Ay(){return wo.recaptchaEnterpriseScript}function Ry(){return wo.gapiScript}function Py(n){return`__${n}${Math.floor(Math.random()*1e6)}`}const Cy="recaptcha-enterprise",ky="NO_RECAPTCHA";class My{constructor(e){this.type=Cy,this.auth=hn(e)}async verify(e="verify",t=!1){async function s(i){if(!t){if(i.tenantId==null&&i._agentRecaptchaConfig!=null)return i._agentRecaptchaConfig.siteKey;if(i.tenantId!=null&&i._tenantRecaptchaConfigs[i.tenantId]!==void 0)return i._tenantRecaptchaConfigs[i.tenantId].siteKey}return new Promise(async(a,l)=>{uy(i,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(c=>{if(c.recaptchaKey===void 0)l(new Error("recaptcha Enterprise site key undefined"));else{const d=new cy(c);return i.tenantId==null?i._agentRecaptchaConfig=d:i._tenantRecaptchaConfigs[i.tenantId]=d,a(d.siteKey)}}).catch(c=>{l(c)})})}function r(i,a,l){const c=window.grecaptcha;_u(c)?c.enterprise.ready(()=>{c.enterprise.execute(i,{action:e}).then(d=>{a(d)}).catch(()=>{a(ky)})}):l(Error("No reCAPTCHA enterprise script loaded."))}return new Promise((i,a)=>{s(this.auth).then(l=>{if(!t&&_u(window.grecaptcha))r(l,i,a);else{if(typeof window>"u"){a(new Error("RecaptchaVerifier is only supported in browser"));return}let c=Ay();c.length!==0&&(c+=l),ch(c).then(()=>{r(l,i,a)}).catch(d=>{a(d)})}}).catch(l=>{a(l)})})}}async function Su(n,e,t,s=!1){const r=new My(n);let i;try{i=await r.verify(t)}catch{i=await r.verify(t,!0)}const a=Object.assign({},e);return s?Object.assign(a,{captchaResp:i}):Object.assign(a,{captchaResponse:i}),Object.assign(a,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(a,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),a}async function Zi(n,e,t,s){var r;if(!((r=n._getRecaptchaConfig())===null||r===void 0)&&r.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const i=await Su(n,e,t,t==="getOobCode");return s(n,i)}else return s(n,e).catch(async i=>{if(i.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const a=await Su(n,e,t,t==="getOobCode");return s(n,a)}else return Promise.reject(i)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Dy(n,e){const t=ml(n,"auth");if(t.isInitialized()){const r=t.getImmediate(),i=t.getOptions();if(Ki(i,e??{}))return r;Et(r,"already-initialized")}return t.initialize({options:e})}function Ny(n,e){const t=(e==null?void 0:e.persistence)||[],s=(Array.isArray(t)?t:[t]).map(en);e!=null&&e.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(s,e==null?void 0:e.popupRedirectResolver)}function Ly(n,e,t){const s=hn(n);j(s._canInitEmulator,s,"emulator-config-failed"),j(/^https?:\/\//.test(e),s,"invalid-emulator-scheme");const r=!1,i=uh(e),{host:a,port:l}=Oy(e),c=l===null?"":`:${l}`;s.config.emulator={url:`${i}//${a}${c}/`},s.settings.appVerificationDisabledForTesting=!0,s.emulatorConfig=Object.freeze({host:a,port:l,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:r})}),Vy()}function uh(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function Oy(n){const e=uh(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const s=t[2].split("@").pop()||"",r=/^(\[[^\]]+\])(:|$)/.exec(s);if(r){const i=r[1];return{host:i,port:xu(s.substr(i.length+1))}}else{const[i,a]=s.split(":");return{host:i,port:xu(a)}}}function xu(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function Vy(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class El{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Xt("not implemented")}_getIdTokenResponse(e){return Xt("not implemented")}_linkToIdToken(e,t){return Xt("not implemented")}_getReauthenticationResolver(e){return Xt("not implemented")}}async function By(n,e){return Ht(n,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Fy(n,e){return ti(n,"POST","/v1/accounts:signInWithPassword",dn(n,e))}async function zy(n,e){return Ht(n,"POST","/v1/accounts:sendOobCode",dn(n,e))}async function Uy(n,e){return zy(n,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function $y(n,e){return ti(n,"POST","/v1/accounts:signInWithEmailLink",dn(n,e))}async function qy(n,e){return ti(n,"POST","/v1/accounts:signInWithEmailLink",dn(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zr extends El{constructor(e,t,s,r=null){super("password",s),this._email=e,this._password=t,this._tenantId=r}static _fromEmailAndPassword(e,t){return new zr(e,t,"password")}static _fromEmailAndCode(e,t,s=null){return new zr(e,t,"emailLink",s)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;if(t!=null&&t.email&&(t!=null&&t.password)){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Zi(e,t,"signInWithPassword",Fy);case"emailLink":return $y(e,{email:this._email,oobCode:this._password});default:Et(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":const s={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Zi(e,s,"signUpPassword",By);case"emailLink":return qy(e,{idToken:t,email:this._email,oobCode:this._password});default:Et(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ls(n,e){return ti(n,"POST","/v1/accounts:signInWithIdp",dn(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hy="http://localhost";class is extends El{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new is(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):Et("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:s,signInMethod:r}=t,i=gl(t,["providerId","signInMethod"]);if(!s||!r)return null;const a=new is(s,r);return a.idToken=i.idToken||void 0,a.accessToken=i.accessToken||void 0,a.secret=i.secret,a.nonce=i.nonce,a.pendingToken=i.pendingToken||null,a}_getIdTokenResponse(e){const t=this.buildRequest();return Ls(e,t)}_linkToIdToken(e,t){const s=this.buildRequest();return s.idToken=t,Ls(e,s)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,Ls(e,t)}buildRequest(){const e={requestUri:Hy,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=Zr(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jy(n){switch(n){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function Wy(n){const e=Ir(Sr(n)).link,t=e?Ir(Sr(e)).deep_link_id:null,s=Ir(Sr(n)).deep_link_id;return(s?Ir(Sr(s)).link:null)||s||t||e||n}class Tl{constructor(e){var t,s,r,i,a,l;const c=Ir(Sr(e)),d=(t=c.apiKey)!==null&&t!==void 0?t:null,f=(s=c.oobCode)!==null&&s!==void 0?s:null,m=jy((r=c.mode)!==null&&r!==void 0?r:null);j(d&&f&&m,"argument-error"),this.apiKey=d,this.operation=m,this.code=f,this.continueUrl=(i=c.continueUrl)!==null&&i!==void 0?i:null,this.languageCode=(a=c.languageCode)!==null&&a!==void 0?a:null,this.tenantId=(l=c.tenantId)!==null&&l!==void 0?l:null}static parseLink(e){const t=Wy(e);try{return new Tl(t)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xs{constructor(){this.providerId=Xs.PROVIDER_ID}static credential(e,t){return zr._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const s=Tl.parseLink(t);return j(s,"argument-error"),zr._fromEmailAndCode(e,s.code,s.tenantId)}}Xs.PROVIDER_ID="password";Xs.EMAIL_PASSWORD_SIGN_IN_METHOD="password";Xs.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Il{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ni extends Il{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tn extends ni{constructor(){super("facebook.com")}static credential(e){return is._fromParams({providerId:Tn.PROVIDER_ID,signInMethod:Tn.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Tn.credentialFromTaggedObject(e)}static credentialFromError(e){return Tn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Tn.credential(e.oauthAccessToken)}catch{return null}}}Tn.FACEBOOK_SIGN_IN_METHOD="facebook.com";Tn.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jt extends ni{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return is._fromParams({providerId:Jt.PROVIDER_ID,signInMethod:Jt.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Jt.credentialFromTaggedObject(e)}static credentialFromError(e){return Jt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:s}=e;if(!t&&!s)return null;try{return Jt.credential(t,s)}catch{return null}}}Jt.GOOGLE_SIGN_IN_METHOD="google.com";Jt.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class In extends ni{constructor(){super("github.com")}static credential(e){return is._fromParams({providerId:In.PROVIDER_ID,signInMethod:In.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return In.credentialFromTaggedObject(e)}static credentialFromError(e){return In.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return In.credential(e.oauthAccessToken)}catch{return null}}}In.GITHUB_SIGN_IN_METHOD="github.com";In.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sn extends ni{constructor(){super("twitter.com")}static credential(e,t){return is._fromParams({providerId:Sn.PROVIDER_ID,signInMethod:Sn.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return Sn.credentialFromTaggedObject(e)}static credentialFromError(e){return Sn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:s}=e;if(!t||!s)return null;try{return Sn.credential(t,s)}catch{return null}}}Sn.TWITTER_SIGN_IN_METHOD="twitter.com";Sn.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Yy(n,e){return ti(n,"POST","/v1/accounts:signUp",dn(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class os{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,s,r=!1){const i=await Zt._fromIdTokenResponse(e,s,r),a=Au(s);return new os({user:i,providerId:a,_tokenResponse:s,operationType:t})}static async _forOperation(e,t,s){await e._updateTokensIfNecessary(s,!0);const r=Au(s);return new os({user:e,providerId:r,_tokenResponse:s,operationType:t})}}function Au(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eo extends un{constructor(e,t,s,r){var i;super(t.code,t.message),this.operationType=s,this.user=r,Object.setPrototypeOf(this,eo.prototype),this.customData={appName:e.name,tenantId:(i=e.tenantId)!==null&&i!==void 0?i:void 0,_serverResponse:t.customData._serverResponse,operationType:s}}static _fromErrorAndOperation(e,t,s,r){return new eo(e,t,s,r)}}function dh(n,e,t,s){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(i=>{throw i.code==="auth/multi-factor-auth-required"?eo._fromErrorAndOperation(n,i,e,s):i})}async function Gy(n,e,t=!1){const s=await Us(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return os._forOperation(n,"link",s)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ky(n,e,t=!1){const{auth:s}=n;if(Rt(s.app))return Promise.reject(nn(s));const r="reauthenticate";try{const i=await Us(n,dh(s,r,e,n),t);j(i.idToken,s,"internal-error");const a=wl(i.idToken);j(a,s,"internal-error");const{sub:l}=a;return j(n.uid===l,s,"user-mismatch"),os._forOperation(n,r,i)}catch(i){throw(i==null?void 0:i.code)==="auth/user-not-found"&&Et(s,"user-mismatch"),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function hh(n,e,t=!1){if(Rt(n.app))return Promise.reject(nn(n));const s="signIn",r=await dh(n,s,e),i=await os._fromIdTokenResponse(n,s,r);return t||await n._updateCurrentUser(i.user),i}async function Qy(n,e){return hh(hn(n),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function fh(n){const e=hn(n);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function Jy(n,e,t){const s=hn(n);await Zi(s,{requestType:"PASSWORD_RESET",email:e,clientType:"CLIENT_TYPE_WEB"},"getOobCode",Uy)}async function Xy(n,e,t){if(Rt(n.app))return Promise.reject(nn(n));const s=hn(n),a=await Zi(s,{returnSecureToken:!0,email:e,password:t,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",Yy).catch(c=>{throw c.code==="auth/password-does-not-meet-requirements"&&fh(n),c}),l=await os._fromIdTokenResponse(s,"signIn",a);return await s._updateCurrentUser(l.user),l}function Zy(n,e,t){return Rt(n.app)?Promise.reject(nn(n)):Qy(Ce(n),Xs.credential(e,t)).catch(async s=>{throw s.code==="auth/password-does-not-meet-requirements"&&fh(n),s})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ev(n,e){return Ht(n,"POST","/v1/accounts:update",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function tv(n,{displayName:e,photoURL:t}){if(e===void 0&&t===void 0)return;const s=Ce(n),i={idToken:await s.getIdToken(),displayName:e,photoUrl:t,returnSecureToken:!0},a=await Us(s,ev(s.auth,i));s.displayName=a.displayName||null,s.photoURL=a.photoUrl||null;const l=s.providerData.find(({providerId:c})=>c==="password");l&&(l.displayName=s.displayName,l.photoURL=s.photoURL),await s._updateTokensIfNecessary(a)}function nv(n,e,t,s){return Ce(n).onIdTokenChanged(e,t,s)}function sv(n,e,t){return Ce(n).beforeAuthStateChanged(e,t)}function rv(n,e,t,s){return Ce(n).onAuthStateChanged(e,t,s)}function iv(n){return Ce(n).signOut()}const to="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ph{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(to,"1"),this.storage.removeItem(to),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ov=1e3,av=10;class mh extends ph{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=ah(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const s=this.storage.getItem(t),r=this.localCache[t];s!==r&&e(t,r,s)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((a,l,c)=>{this.notifyListeners(a,c)});return}const s=e.key;t?this.detachListener():this.stopPolling();const r=()=>{const a=this.storage.getItem(s);!t&&this.localCache[s]===a||this.notifyListeners(s,a)},i=this.storage.getItem(s);wy()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(r,av):r()}notifyListeners(e,t){this.localCache[e]=t;const s=this.listeners[e];if(s)for(const r of Array.from(s))r(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,s)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:s}),!0)})},ov)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}mh.type="LOCAL";const lv=mh;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gh extends ph{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}gh.type="SESSION";const yh=gh;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cv(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bo{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(r=>r.isListeningto(e));if(t)return t;const s=new bo(e);return this.receivers.push(s),s}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:s,eventType:r,data:i}=t.data,a=this.handlersMap[r];if(!(a!=null&&a.size))return;t.ports[0].postMessage({status:"ack",eventId:s,eventType:r});const l=Array.from(a).map(async d=>d(t.origin,i)),c=await cv(l);t.ports[0].postMessage({status:"done",eventId:s,eventType:r,response:c})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}bo.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sl(n="",e=10){let t="";for(let s=0;s<e;s++)t+=Math.floor(Math.random()*10);return n+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uv{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,s=50){const r=typeof MessageChannel<"u"?new MessageChannel:null;if(!r)throw new Error("connection_unavailable");let i,a;return new Promise((l,c)=>{const d=Sl("",20);r.port1.start();const f=setTimeout(()=>{c(new Error("unsupported_event"))},s);a={messageChannel:r,onMessage(m){const _=m;if(_.data.eventId===d)switch(_.data.status){case"ack":clearTimeout(f),i=setTimeout(()=>{c(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),l(_.data.response);break;default:clearTimeout(f),clearTimeout(i),c(new Error("invalid_response"));break}}},this.handlers.add(a),r.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:d,data:t},[r.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bt(){return window}function dv(n){Bt().location.href=n}/**
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
 */function vh(){return typeof Bt().WorkerGlobalScope<"u"&&typeof Bt().importScripts=="function"}async function hv(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function fv(){var n;return((n=navigator==null?void 0:navigator.serviceWorker)===null||n===void 0?void 0:n.controller)||null}function pv(){return vh()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _h="firebaseLocalStorageDb",mv=1,no="firebaseLocalStorage",wh="fbase_key";class si{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function Eo(n,e){return n.transaction([no],e?"readwrite":"readonly").objectStore(no)}function gv(){const n=indexedDB.deleteDatabase(_h);return new si(n).toPromise()}function $a(){const n=indexedDB.open(_h,mv);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const s=n.result;try{s.createObjectStore(no,{keyPath:wh})}catch(r){t(r)}}),n.addEventListener("success",async()=>{const s=n.result;s.objectStoreNames.contains(no)?e(s):(s.close(),await gv(),e(await $a()))})})}async function Ru(n,e,t){const s=Eo(n,!0).put({[wh]:e,value:t});return new si(s).toPromise()}async function yv(n,e){const t=Eo(n,!1).get(e),s=await new si(t).toPromise();return s===void 0?null:s.value}function Pu(n,e){const t=Eo(n,!0).delete(e);return new si(t).toPromise()}const vv=800,_v=3;class bh{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await $a(),this.db)}async _withRetries(e){let t=0;for(;;)try{const s=await this._openDb();return await e(s)}catch(s){if(t++>_v)throw s;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return vh()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=bo._getInstance(pv()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await hv(),!this.activeServiceWorker)return;this.sender=new uv(this.activeServiceWorker);const s=await this.sender._send("ping",{},800);s&&!((e=s[0])===null||e===void 0)&&e.fulfilled&&!((t=s[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||fv()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await $a();return await Ru(e,to,"1"),await Pu(e,to),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(s=>Ru(s,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(s=>yv(s,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>Pu(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(r=>{const i=Eo(r,!1).getAll();return new si(i).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],s=new Set;if(e.length!==0)for(const{fbase_key:r,value:i}of e)s.add(r),JSON.stringify(this.localCache[r])!==JSON.stringify(i)&&(this.notifyListeners(r,i),t.push(r));for(const r of Object.keys(this.localCache))this.localCache[r]&&!s.has(r)&&(this.notifyListeners(r,null),t.push(r));return t}notifyListeners(e,t){this.localCache[e]=t;const s=this.listeners[e];if(s)for(const r of Array.from(s))r(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),vv)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}bh.type="LOCAL";const wv=bh;new ei(3e4,6e4);/**
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
 */function Eh(n,e){return e?en(e):(j(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xl extends El{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Ls(e,this._buildIdpRequest())}_linkToIdToken(e,t){return Ls(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return Ls(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function bv(n){return hh(n.auth,new xl(n),n.bypassAuthState)}function Ev(n){const{auth:e,user:t}=n;return j(t,e,"internal-error"),Ky(t,new xl(n),n.bypassAuthState)}async function Tv(n){const{auth:e,user:t}=n;return j(t,e,"internal-error"),Gy(t,new xl(n),n.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Th{constructor(e,t,s,r,i=!1){this.auth=e,this.resolver=s,this.user=r,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(s){this.reject(s)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:s,postBody:r,tenantId:i,error:a,type:l}=e;if(a){this.reject(a);return}const c={auth:this.auth,requestUri:t,sessionId:s,tenantId:i||void 0,postBody:r||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(l)(c))}catch(d){this.reject(d)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return bv;case"linkViaPopup":case"linkViaRedirect":return Tv;case"reauthViaPopup":case"reauthViaRedirect":return Ev;default:Et(this.auth,"internal-error")}}resolve(e){on(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){on(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Iv=new ei(2e3,1e4);async function Sv(n,e,t){if(Rt(n.app))return Promise.reject(Ct(n,"operation-not-supported-in-this-environment"));const s=hn(n);ty(n,e,Il);const r=Eh(s,t);return new Zn(s,"signInViaPopup",e,r).executeNotNull()}class Zn extends Th{constructor(e,t,s,r,i){super(e,t,r,i),this.provider=s,this.authWindow=null,this.pollId=null,Zn.currentPopupAction&&Zn.currentPopupAction.cancel(),Zn.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return j(e,this.auth,"internal-error"),e}async onExecution(){on(this.filter.length===1,"Popup operations only handle one event");const e=Sl();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(Ct(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(Ct(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Zn.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,s;if(!((s=(t=this.authWindow)===null||t===void 0?void 0:t.window)===null||s===void 0)&&s.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Ct(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,Iv.get())};e()}}Zn.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xv="pendingRedirect",Bi=new Map;class Av extends Th{constructor(e,t,s=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,s),this.eventId=null}async execute(){let e=Bi.get(this.auth._key());if(!e){try{const s=await Rv(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(s)}catch(t){e=()=>Promise.reject(t)}Bi.set(this.auth._key(),e)}return this.bypassAuthState||Bi.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Rv(n,e){const t=kv(e),s=Cv(n);if(!await s._isAvailable())return!1;const r=await s._get(t)==="true";return await s._remove(t),r}function Pv(n,e){Bi.set(n._key(),e)}function Cv(n){return en(n._redirectPersistence)}function kv(n){return Vi(xv,n.config.apiKey,n.name)}async function Mv(n,e,t=!1){if(Rt(n.app))return Promise.reject(nn(n));const s=hn(n),r=Eh(s,e),a=await new Av(s,r,t).execute();return a&&!t&&(delete a.user._redirectEventId,await s._persistUserIfCurrent(a.user),await s._setRedirectUser(null,e)),a}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dv=10*60*1e3;class Nv{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(s=>{this.isEventForConsumer(e,s)&&(t=!0,this.sendToConsumer(e,s),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Lv(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var s;if(e.error&&!Ih(e)){const r=((s=e.error.code)===null||s===void 0?void 0:s.split("auth/")[1])||"internal-error";t.onError(Ct(this.auth,r))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const s=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&s}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Dv&&this.cachedEventUids.clear(),this.cachedEventUids.has(Cu(e))}saveEventToCache(e){this.cachedEventUids.add(Cu(e)),this.lastProcessedEventTime=Date.now()}}function Cu(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function Ih({type:n,error:e}){return n==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Lv(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Ih(n);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ov(n,e={}){return Ht(n,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vv=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Bv=/^https?/;async function Fv(n){if(n.config.emulator)return;const{authorizedDomains:e}=await Ov(n);for(const t of e)try{if(zv(t))return}catch{}Et(n,"unauthorized-domain")}function zv(n){const e=za(),{protocol:t,hostname:s}=new URL(e);if(n.startsWith("chrome-extension://")){const a=new URL(n);return a.hostname===""&&s===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&a.hostname===s}if(!Bv.test(t))return!1;if(Vv.test(n))return s===n;const r=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+r+"|"+r+")$","i").test(s)}/**
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
 */const Uv=new ei(3e4,6e4);function ku(){const n=Bt().___jsl;if(n!=null&&n.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function $v(n){return new Promise((e,t)=>{var s,r,i;function a(){ku(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{ku(),t(Ct(n,"network-request-failed"))},timeout:Uv.get()})}if(!((r=(s=Bt().gapi)===null||s===void 0?void 0:s.iframes)===null||r===void 0)&&r.Iframe)e(gapi.iframes.getContext());else if(!((i=Bt().gapi)===null||i===void 0)&&i.load)a();else{const l=Py("iframefcb");return Bt()[l]=()=>{gapi.load?a():t(Ct(n,"network-request-failed"))},ch(`${Ry()}?onload=${l}`).catch(c=>t(c))}}).catch(e=>{throw Fi=null,e})}let Fi=null;function qv(n){return Fi=Fi||$v(n),Fi}/**
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
 */const Hv=new ei(5e3,15e3),jv="__/auth/iframe",Wv="emulator/auth/iframe",Yv={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Gv=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Kv(n){const e=n.config;j(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?_l(e,Wv):`https://${n.config.authDomain}/${jv}`,s={apiKey:e.apiKey,appName:n.name,v:Js},r=Gv.get(n.config.apiHost);r&&(s.eid=r);const i=n._getFrameworks();return i.length&&(s.fw=i.join(",")),`${t}?${Zr(s).slice(1)}`}async function Qv(n){const e=await qv(n),t=Bt().gapi;return j(t,n,"internal-error"),e.open({where:document.body,url:Kv(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Yv,dontclear:!0},s=>new Promise(async(r,i)=>{await s.restyle({setHideOnLeave:!1});const a=Ct(n,"network-request-failed"),l=Bt().setTimeout(()=>{i(a)},Hv.get());function c(){Bt().clearTimeout(l),r(s)}s.ping(c).then(c,()=>{i(a)})}))}/**
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
 */const Jv={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Xv=500,Zv=600,e0="_blank",t0="http://localhost";class Mu{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function n0(n,e,t,s=Xv,r=Zv){const i=Math.max((window.screen.availHeight-r)/2,0).toString(),a=Math.max((window.screen.availWidth-s)/2,0).toString();let l="";const c=Object.assign(Object.assign({},Jv),{width:s.toString(),height:r.toString(),top:i,left:a}),d=Ze().toLowerCase();t&&(l=nh(d)?e0:t),eh(d)&&(e=e||t0,c.scrollbars="yes");const f=Object.entries(c).reduce((_,[w,T])=>`${_}${w}=${T},`,"");if(_y(d)&&l!=="_self")return s0(e||"",l),new Mu(null);const m=window.open(e||"",l,f);j(m,n,"popup-blocked");try{m.focus()}catch{}return new Mu(m)}function s0(n,e){const t=document.createElement("a");t.href=n,t.target=e;const s=document.createEvent("MouseEvent");s.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(s)}/**
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
 */const r0="__/auth/handler",i0="emulator/auth/handler",o0=encodeURIComponent("fac");async function Du(n,e,t,s,r,i){j(n.config.authDomain,n,"auth-domain-config-required"),j(n.config.apiKey,n,"invalid-api-key");const a={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:s,v:Js,eventId:r};if(e instanceof Il){e.setDefaultLanguage(n.languageCode),a.providerId=e.providerId||"",zm(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(const[f,m]of Object.entries({}))a[f]=m}if(e instanceof ni){const f=e.getScopes().filter(m=>m!=="");f.length>0&&(a.scopes=f.join(","))}n.tenantId&&(a.tid=n.tenantId);const l=a;for(const f of Object.keys(l))l[f]===void 0&&delete l[f];const c=await n._getAppCheckToken(),d=c?`#${o0}=${encodeURIComponent(c)}`:"";return`${a0(n)}?${Zr(l).slice(1)}${d}`}function a0({config:n}){return n.emulator?_l(n,i0):`https://${n.authDomain}/${r0}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ta="webStorageSupport";class l0{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=yh,this._completeRedirectFn=Mv,this._overrideRedirectResult=Pv}async _openPopup(e,t,s,r){var i;on((i=this.eventManagers[e._key()])===null||i===void 0?void 0:i.manager,"_initialize() not called before _openPopup()");const a=await Du(e,t,s,za(),r);return n0(e,a,Sl())}async _openRedirect(e,t,s,r){await this._originValidation(e);const i=await Du(e,t,s,za(),r);return dv(i),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:r,promise:i}=this.eventManagers[t];return r?Promise.resolve(r):(on(i,"If manager is not set, promise should be"),i)}const s=this.initAndGetManager(e);return this.eventManagers[t]={promise:s},s.catch(()=>{delete this.eventManagers[t]}),s}async initAndGetManager(e){const t=await Qv(e),s=new Nv(e);return t.register("authEvent",r=>(j(r==null?void 0:r.authEvent,e,"invalid-auth-event"),{status:s.onEvent(r.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:s},this.iframes[e._key()]=t,s}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Ta,{type:Ta},r=>{var i;const a=(i=r==null?void 0:r[0])===null||i===void 0?void 0:i[Ta];a!==void 0&&t(!!a),Et(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=Fv(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return ah()||th()||bl()}}const c0=l0;var Nu="@firebase/auth",Lu="1.7.9";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class u0{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(s=>{e((s==null?void 0:s.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){j(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function d0(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function h0(n){zs(new rs("auth",(e,{options:t})=>{const s=e.getProvider("app").getImmediate(),r=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:a,authDomain:l}=s.options;j(a&&!a.includes(":"),"invalid-api-key",{appName:s.name});const c={apiKey:a,authDomain:l,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:lh(n)},d=new Sy(s,r,i,c);return Ny(d,t),d},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,s)=>{e.getProvider("auth-internal").initialize()})),zs(new rs("auth-internal",e=>{const t=hn(e.getProvider("auth").getImmediate());return(s=>new u0(s))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),Mn(Nu,Lu,d0(n)),Mn(Nu,Lu,"esm2017")}/**
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
 */const f0=5*60,p0=Fd("authIdTokenMaxAge")||f0;let Ou=null;const m0=n=>async e=>{const t=e&&await e.getIdTokenResult(),s=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(s&&s>p0)return;const r=t==null?void 0:t.token;Ou!==r&&(Ou=r,await fetch(n,{method:r?"POST":"DELETE",headers:r?{Authorization:`Bearer ${r}`}:{}}))};function g0(n=qd()){const e=ml(n,"auth");if(e.isInitialized())return e.getImmediate();const t=Dy(n,{popupRedirectResolver:c0,persistence:[wv,lv,yh]}),s=Fd("authTokenSyncURL");if(s&&typeof isSecureContext=="boolean"&&isSecureContext){const i=new URL(s,location.origin);if(location.origin===i.origin){const a=m0(i.toString());sv(t,a,()=>a(t.currentUser)),nv(t,l=>a(l))}}const r=Vd("auth");return r&&Ly(t,`http://${r}`),t}function y0(){var n,e;return(e=(n=document.getElementsByTagName("head"))===null||n===void 0?void 0:n[0])!==null&&e!==void 0?e:document}xy({loadJS(n){return new Promise((e,t)=>{const s=document.createElement("script");s.setAttribute("src",n),s.onload=e,s.onerror=r=>{const i=Ct("internal-error");i.customData=r,t(i)},s.type="text/javascript",s.charset="UTF-8",y0().appendChild(s)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});h0("Browser");var Vu=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var ns,Sh;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(g,y){function v(){}v.prototype=y.prototype,g.D=y.prototype,g.prototype=new v,g.prototype.constructor=g,g.C=function(E,S,A){for(var b=Array(arguments.length-2),de=2;de<arguments.length;de++)b[de-2]=arguments[de];return y.prototype[S].apply(E,b)}}function t(){this.blockSize=-1}function s(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(s,t),s.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function r(g,y,v){v||(v=0);var E=Array(16);if(typeof y=="string")for(var S=0;16>S;++S)E[S]=y.charCodeAt(v++)|y.charCodeAt(v++)<<8|y.charCodeAt(v++)<<16|y.charCodeAt(v++)<<24;else for(S=0;16>S;++S)E[S]=y[v++]|y[v++]<<8|y[v++]<<16|y[v++]<<24;y=g.g[0],v=g.g[1],S=g.g[2];var A=g.g[3],b=y+(A^v&(S^A))+E[0]+3614090360&4294967295;y=v+(b<<7&4294967295|b>>>25),b=A+(S^y&(v^S))+E[1]+3905402710&4294967295,A=y+(b<<12&4294967295|b>>>20),b=S+(v^A&(y^v))+E[2]+606105819&4294967295,S=A+(b<<17&4294967295|b>>>15),b=v+(y^S&(A^y))+E[3]+3250441966&4294967295,v=S+(b<<22&4294967295|b>>>10),b=y+(A^v&(S^A))+E[4]+4118548399&4294967295,y=v+(b<<7&4294967295|b>>>25),b=A+(S^y&(v^S))+E[5]+1200080426&4294967295,A=y+(b<<12&4294967295|b>>>20),b=S+(v^A&(y^v))+E[6]+2821735955&4294967295,S=A+(b<<17&4294967295|b>>>15),b=v+(y^S&(A^y))+E[7]+4249261313&4294967295,v=S+(b<<22&4294967295|b>>>10),b=y+(A^v&(S^A))+E[8]+1770035416&4294967295,y=v+(b<<7&4294967295|b>>>25),b=A+(S^y&(v^S))+E[9]+2336552879&4294967295,A=y+(b<<12&4294967295|b>>>20),b=S+(v^A&(y^v))+E[10]+4294925233&4294967295,S=A+(b<<17&4294967295|b>>>15),b=v+(y^S&(A^y))+E[11]+2304563134&4294967295,v=S+(b<<22&4294967295|b>>>10),b=y+(A^v&(S^A))+E[12]+1804603682&4294967295,y=v+(b<<7&4294967295|b>>>25),b=A+(S^y&(v^S))+E[13]+4254626195&4294967295,A=y+(b<<12&4294967295|b>>>20),b=S+(v^A&(y^v))+E[14]+2792965006&4294967295,S=A+(b<<17&4294967295|b>>>15),b=v+(y^S&(A^y))+E[15]+1236535329&4294967295,v=S+(b<<22&4294967295|b>>>10),b=y+(S^A&(v^S))+E[1]+4129170786&4294967295,y=v+(b<<5&4294967295|b>>>27),b=A+(v^S&(y^v))+E[6]+3225465664&4294967295,A=y+(b<<9&4294967295|b>>>23),b=S+(y^v&(A^y))+E[11]+643717713&4294967295,S=A+(b<<14&4294967295|b>>>18),b=v+(A^y&(S^A))+E[0]+3921069994&4294967295,v=S+(b<<20&4294967295|b>>>12),b=y+(S^A&(v^S))+E[5]+3593408605&4294967295,y=v+(b<<5&4294967295|b>>>27),b=A+(v^S&(y^v))+E[10]+38016083&4294967295,A=y+(b<<9&4294967295|b>>>23),b=S+(y^v&(A^y))+E[15]+3634488961&4294967295,S=A+(b<<14&4294967295|b>>>18),b=v+(A^y&(S^A))+E[4]+3889429448&4294967295,v=S+(b<<20&4294967295|b>>>12),b=y+(S^A&(v^S))+E[9]+568446438&4294967295,y=v+(b<<5&4294967295|b>>>27),b=A+(v^S&(y^v))+E[14]+3275163606&4294967295,A=y+(b<<9&4294967295|b>>>23),b=S+(y^v&(A^y))+E[3]+4107603335&4294967295,S=A+(b<<14&4294967295|b>>>18),b=v+(A^y&(S^A))+E[8]+1163531501&4294967295,v=S+(b<<20&4294967295|b>>>12),b=y+(S^A&(v^S))+E[13]+2850285829&4294967295,y=v+(b<<5&4294967295|b>>>27),b=A+(v^S&(y^v))+E[2]+4243563512&4294967295,A=y+(b<<9&4294967295|b>>>23),b=S+(y^v&(A^y))+E[7]+1735328473&4294967295,S=A+(b<<14&4294967295|b>>>18),b=v+(A^y&(S^A))+E[12]+2368359562&4294967295,v=S+(b<<20&4294967295|b>>>12),b=y+(v^S^A)+E[5]+4294588738&4294967295,y=v+(b<<4&4294967295|b>>>28),b=A+(y^v^S)+E[8]+2272392833&4294967295,A=y+(b<<11&4294967295|b>>>21),b=S+(A^y^v)+E[11]+1839030562&4294967295,S=A+(b<<16&4294967295|b>>>16),b=v+(S^A^y)+E[14]+4259657740&4294967295,v=S+(b<<23&4294967295|b>>>9),b=y+(v^S^A)+E[1]+2763975236&4294967295,y=v+(b<<4&4294967295|b>>>28),b=A+(y^v^S)+E[4]+1272893353&4294967295,A=y+(b<<11&4294967295|b>>>21),b=S+(A^y^v)+E[7]+4139469664&4294967295,S=A+(b<<16&4294967295|b>>>16),b=v+(S^A^y)+E[10]+3200236656&4294967295,v=S+(b<<23&4294967295|b>>>9),b=y+(v^S^A)+E[13]+681279174&4294967295,y=v+(b<<4&4294967295|b>>>28),b=A+(y^v^S)+E[0]+3936430074&4294967295,A=y+(b<<11&4294967295|b>>>21),b=S+(A^y^v)+E[3]+3572445317&4294967295,S=A+(b<<16&4294967295|b>>>16),b=v+(S^A^y)+E[6]+76029189&4294967295,v=S+(b<<23&4294967295|b>>>9),b=y+(v^S^A)+E[9]+3654602809&4294967295,y=v+(b<<4&4294967295|b>>>28),b=A+(y^v^S)+E[12]+3873151461&4294967295,A=y+(b<<11&4294967295|b>>>21),b=S+(A^y^v)+E[15]+530742520&4294967295,S=A+(b<<16&4294967295|b>>>16),b=v+(S^A^y)+E[2]+3299628645&4294967295,v=S+(b<<23&4294967295|b>>>9),b=y+(S^(v|~A))+E[0]+4096336452&4294967295,y=v+(b<<6&4294967295|b>>>26),b=A+(v^(y|~S))+E[7]+1126891415&4294967295,A=y+(b<<10&4294967295|b>>>22),b=S+(y^(A|~v))+E[14]+2878612391&4294967295,S=A+(b<<15&4294967295|b>>>17),b=v+(A^(S|~y))+E[5]+4237533241&4294967295,v=S+(b<<21&4294967295|b>>>11),b=y+(S^(v|~A))+E[12]+1700485571&4294967295,y=v+(b<<6&4294967295|b>>>26),b=A+(v^(y|~S))+E[3]+2399980690&4294967295,A=y+(b<<10&4294967295|b>>>22),b=S+(y^(A|~v))+E[10]+4293915773&4294967295,S=A+(b<<15&4294967295|b>>>17),b=v+(A^(S|~y))+E[1]+2240044497&4294967295,v=S+(b<<21&4294967295|b>>>11),b=y+(S^(v|~A))+E[8]+1873313359&4294967295,y=v+(b<<6&4294967295|b>>>26),b=A+(v^(y|~S))+E[15]+4264355552&4294967295,A=y+(b<<10&4294967295|b>>>22),b=S+(y^(A|~v))+E[6]+2734768916&4294967295,S=A+(b<<15&4294967295|b>>>17),b=v+(A^(S|~y))+E[13]+1309151649&4294967295,v=S+(b<<21&4294967295|b>>>11),b=y+(S^(v|~A))+E[4]+4149444226&4294967295,y=v+(b<<6&4294967295|b>>>26),b=A+(v^(y|~S))+E[11]+3174756917&4294967295,A=y+(b<<10&4294967295|b>>>22),b=S+(y^(A|~v))+E[2]+718787259&4294967295,S=A+(b<<15&4294967295|b>>>17),b=v+(A^(S|~y))+E[9]+3951481745&4294967295,g.g[0]=g.g[0]+y&4294967295,g.g[1]=g.g[1]+(S+(b<<21&4294967295|b>>>11))&4294967295,g.g[2]=g.g[2]+S&4294967295,g.g[3]=g.g[3]+A&4294967295}s.prototype.u=function(g,y){y===void 0&&(y=g.length);for(var v=y-this.blockSize,E=this.B,S=this.h,A=0;A<y;){if(S==0)for(;A<=v;)r(this,g,A),A+=this.blockSize;if(typeof g=="string"){for(;A<y;)if(E[S++]=g.charCodeAt(A++),S==this.blockSize){r(this,E),S=0;break}}else for(;A<y;)if(E[S++]=g[A++],S==this.blockSize){r(this,E),S=0;break}}this.h=S,this.o+=y},s.prototype.v=function(){var g=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);g[0]=128;for(var y=1;y<g.length-8;++y)g[y]=0;var v=8*this.o;for(y=g.length-8;y<g.length;++y)g[y]=v&255,v/=256;for(this.u(g),g=Array(16),y=v=0;4>y;++y)for(var E=0;32>E;E+=8)g[v++]=this.g[y]>>>E&255;return g};function i(g,y){var v=l;return Object.prototype.hasOwnProperty.call(v,g)?v[g]:v[g]=y(g)}function a(g,y){this.h=y;for(var v=[],E=!0,S=g.length-1;0<=S;S--){var A=g[S]|0;E&&A==y||(v[S]=A,E=!1)}this.g=v}var l={};function c(g){return-128<=g&&128>g?i(g,function(y){return new a([y|0],0>y?-1:0)}):new a([g|0],0>g?-1:0)}function d(g){if(isNaN(g)||!isFinite(g))return m;if(0>g)return x(d(-g));for(var y=[],v=1,E=0;g>=v;E++)y[E]=g/v|0,v*=4294967296;return new a(y,0)}function f(g,y){if(g.length==0)throw Error("number format error: empty string");if(y=y||10,2>y||36<y)throw Error("radix out of range: "+y);if(g.charAt(0)=="-")return x(f(g.substring(1),y));if(0<=g.indexOf("-"))throw Error('number format error: interior "-" character');for(var v=d(Math.pow(y,8)),E=m,S=0;S<g.length;S+=8){var A=Math.min(8,g.length-S),b=parseInt(g.substring(S,S+A),y);8>A?(A=d(Math.pow(y,A)),E=E.j(A).add(d(b))):(E=E.j(v),E=E.add(d(b)))}return E}var m=c(0),_=c(1),w=c(16777216);n=a.prototype,n.m=function(){if(C(this))return-x(this).m();for(var g=0,y=1,v=0;v<this.g.length;v++){var E=this.i(v);g+=(0<=E?E:4294967296+E)*y,y*=4294967296}return g},n.toString=function(g){if(g=g||10,2>g||36<g)throw Error("radix out of range: "+g);if(T(this))return"0";if(C(this))return"-"+x(this).toString(g);for(var y=d(Math.pow(g,6)),v=this,E="";;){var S=P(v,y).g;v=I(v,S.j(y));var A=((0<v.g.length?v.g[0]:v.h)>>>0).toString(g);if(v=S,T(v))return A+E;for(;6>A.length;)A="0"+A;E=A+E}},n.i=function(g){return 0>g?0:g<this.g.length?this.g[g]:this.h};function T(g){if(g.h!=0)return!1;for(var y=0;y<g.g.length;y++)if(g.g[y]!=0)return!1;return!0}function C(g){return g.h==-1}n.l=function(g){return g=I(this,g),C(g)?-1:T(g)?0:1};function x(g){for(var y=g.g.length,v=[],E=0;E<y;E++)v[E]=~g.g[E];return new a(v,~g.h).add(_)}n.abs=function(){return C(this)?x(this):this},n.add=function(g){for(var y=Math.max(this.g.length,g.g.length),v=[],E=0,S=0;S<=y;S++){var A=E+(this.i(S)&65535)+(g.i(S)&65535),b=(A>>>16)+(this.i(S)>>>16)+(g.i(S)>>>16);E=b>>>16,A&=65535,b&=65535,v[S]=b<<16|A}return new a(v,v[v.length-1]&-2147483648?-1:0)};function I(g,y){return g.add(x(y))}n.j=function(g){if(T(this)||T(g))return m;if(C(this))return C(g)?x(this).j(x(g)):x(x(this).j(g));if(C(g))return x(this.j(x(g)));if(0>this.l(w)&&0>g.l(w))return d(this.m()*g.m());for(var y=this.g.length+g.g.length,v=[],E=0;E<2*y;E++)v[E]=0;for(E=0;E<this.g.length;E++)for(var S=0;S<g.g.length;S++){var A=this.i(E)>>>16,b=this.i(E)&65535,de=g.i(S)>>>16,Ae=g.i(S)&65535;v[2*E+2*S]+=b*Ae,M(v,2*E+2*S),v[2*E+2*S+1]+=A*Ae,M(v,2*E+2*S+1),v[2*E+2*S+1]+=b*de,M(v,2*E+2*S+1),v[2*E+2*S+2]+=A*de,M(v,2*E+2*S+2)}for(E=0;E<y;E++)v[E]=v[2*E+1]<<16|v[2*E];for(E=y;E<2*y;E++)v[E]=0;return new a(v,0)};function M(g,y){for(;(g[y]&65535)!=g[y];)g[y+1]+=g[y]>>>16,g[y]&=65535,y++}function D(g,y){this.g=g,this.h=y}function P(g,y){if(T(y))throw Error("division by zero");if(T(g))return new D(m,m);if(C(g))return y=P(x(g),y),new D(x(y.g),x(y.h));if(C(y))return y=P(g,x(y)),new D(x(y.g),y.h);if(30<g.g.length){if(C(g)||C(y))throw Error("slowDivide_ only works with positive integers.");for(var v=_,E=y;0>=E.l(g);)v=O(v),E=O(E);var S=z(v,1),A=z(E,1);for(E=z(E,2),v=z(v,2);!T(E);){var b=A.add(E);0>=b.l(g)&&(S=S.add(v),A=b),E=z(E,1),v=z(v,1)}return y=I(g,S.j(y)),new D(S,y)}for(S=m;0<=g.l(y);){for(v=Math.max(1,Math.floor(g.m()/y.m())),E=Math.ceil(Math.log(v)/Math.LN2),E=48>=E?1:Math.pow(2,E-48),A=d(v),b=A.j(y);C(b)||0<b.l(g);)v-=E,A=d(v),b=A.j(y);T(A)&&(A=_),S=S.add(A),g=I(g,b)}return new D(S,g)}n.A=function(g){return P(this,g).h},n.and=function(g){for(var y=Math.max(this.g.length,g.g.length),v=[],E=0;E<y;E++)v[E]=this.i(E)&g.i(E);return new a(v,this.h&g.h)},n.or=function(g){for(var y=Math.max(this.g.length,g.g.length),v=[],E=0;E<y;E++)v[E]=this.i(E)|g.i(E);return new a(v,this.h|g.h)},n.xor=function(g){for(var y=Math.max(this.g.length,g.g.length),v=[],E=0;E<y;E++)v[E]=this.i(E)^g.i(E);return new a(v,this.h^g.h)};function O(g){for(var y=g.g.length+1,v=[],E=0;E<y;E++)v[E]=g.i(E)<<1|g.i(E-1)>>>31;return new a(v,g.h)}function z(g,y){var v=y>>5;y%=32;for(var E=g.g.length-v,S=[],A=0;A<E;A++)S[A]=0<y?g.i(A+v)>>>y|g.i(A+v+1)<<32-y:g.i(A+v);return new a(S,g.h)}s.prototype.digest=s.prototype.v,s.prototype.reset=s.prototype.s,s.prototype.update=s.prototype.u,Sh=s,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.A,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=d,a.fromString=f,ns=a}).apply(typeof Vu<"u"?Vu:typeof self<"u"?self:typeof window<"u"?window:{});var Mi=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var xh,xr,Ah,zi,qa,Rh,Ph,Ch;(function(){var n,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(o,u,h){return o==Array.prototype||o==Object.prototype||(o[u]=h.value),o};function t(o){o=[typeof globalThis=="object"&&globalThis,o,typeof window=="object"&&window,typeof self=="object"&&self,typeof Mi=="object"&&Mi];for(var u=0;u<o.length;++u){var h=o[u];if(h&&h.Math==Math)return h}throw Error("Cannot find global object")}var s=t(this);function r(o,u){if(u)e:{var h=s;o=o.split(".");for(var p=0;p<o.length-1;p++){var R=o[p];if(!(R in h))break e;h=h[R]}o=o[o.length-1],p=h[o],u=u(p),u!=p&&u!=null&&e(h,o,{configurable:!0,writable:!0,value:u})}}function i(o,u){o instanceof String&&(o+="");var h=0,p=!1,R={next:function(){if(!p&&h<o.length){var k=h++;return{value:u(k,o[k]),done:!1}}return p=!0,{done:!0,value:void 0}}};return R[Symbol.iterator]=function(){return R},R}r("Array.prototype.values",function(o){return o||function(){return i(this,function(u,h){return h})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var a=a||{},l=this||self;function c(o){var u=typeof o;return u=u!="object"?u:o?Array.isArray(o)?"array":u:"null",u=="array"||u=="object"&&typeof o.length=="number"}function d(o){var u=typeof o;return u=="object"&&o!=null||u=="function"}function f(o,u,h){return o.call.apply(o.bind,arguments)}function m(o,u,h){if(!o)throw Error();if(2<arguments.length){var p=Array.prototype.slice.call(arguments,2);return function(){var R=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(R,p),o.apply(u,R)}}return function(){return o.apply(u,arguments)}}function _(o,u,h){return _=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?f:m,_.apply(null,arguments)}function w(o,u){var h=Array.prototype.slice.call(arguments,1);return function(){var p=h.slice();return p.push.apply(p,arguments),o.apply(this,p)}}function T(o,u){function h(){}h.prototype=u.prototype,o.aa=u.prototype,o.prototype=new h,o.prototype.constructor=o,o.Qb=function(p,R,k){for(var V=Array(arguments.length-2),ue=2;ue<arguments.length;ue++)V[ue-2]=arguments[ue];return u.prototype[R].apply(p,V)}}function C(o){const u=o.length;if(0<u){const h=Array(u);for(let p=0;p<u;p++)h[p]=o[p];return h}return[]}function x(o,u){for(let h=1;h<arguments.length;h++){const p=arguments[h];if(c(p)){const R=o.length||0,k=p.length||0;o.length=R+k;for(let V=0;V<k;V++)o[R+V]=p[V]}else o.push(p)}}class I{constructor(u,h){this.i=u,this.j=h,this.h=0,this.g=null}get(){let u;return 0<this.h?(this.h--,u=this.g,this.g=u.next,u.next=null):u=this.i(),u}}function M(o){return/^[\s\xa0]*$/.test(o)}function D(){var o=l.navigator;return o&&(o=o.userAgent)?o:""}function P(o){return P[" "](o),o}P[" "]=function(){};var O=D().indexOf("Gecko")!=-1&&!(D().toLowerCase().indexOf("webkit")!=-1&&D().indexOf("Edge")==-1)&&!(D().indexOf("Trident")!=-1||D().indexOf("MSIE")!=-1)&&D().indexOf("Edge")==-1;function z(o,u,h){for(const p in o)u.call(h,o[p],p,o)}function g(o,u){for(const h in o)u.call(void 0,o[h],h,o)}function y(o){const u={};for(const h in o)u[h]=o[h];return u}const v="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function E(o,u){let h,p;for(let R=1;R<arguments.length;R++){p=arguments[R];for(h in p)o[h]=p[h];for(let k=0;k<v.length;k++)h=v[k],Object.prototype.hasOwnProperty.call(p,h)&&(o[h]=p[h])}}function S(o){var u=1;o=o.split(":");const h=[];for(;0<u&&o.length;)h.push(o.shift()),u--;return o.length&&h.push(o.join(":")),h}function A(o){l.setTimeout(()=>{throw o},0)}function b(){var o=Z;let u=null;return o.g&&(u=o.g,o.g=o.g.next,o.g||(o.h=null),u.next=null),u}class de{constructor(){this.h=this.g=null}add(u,h){const p=Ae.get();p.set(u,h),this.h?this.h.next=p:this.g=p,this.h=p}}var Ae=new I(()=>new J,o=>o.reset());class J{constructor(){this.next=this.g=this.h=null}set(u,h){this.h=u,this.g=h,this.next=null}reset(){this.next=this.g=this.h=null}}let oe,ye=!1,Z=new de,he=()=>{const o=l.Promise.resolve(void 0);oe=()=>{o.then(ve)}};var ve=()=>{for(var o;o=b();){try{o.h.call(o.g)}catch(h){A(h)}var u=Ae;u.j(o),100>u.h&&(u.h++,o.next=u.g,u.g=o)}ye=!1};function _e(){this.s=this.s,this.C=this.C}_e.prototype.s=!1,_e.prototype.ma=function(){this.s||(this.s=!0,this.N())},_e.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function Y(o,u){this.type=o,this.g=this.target=u,this.defaultPrevented=!1}Y.prototype.h=function(){this.defaultPrevented=!0};var It=function(){if(!l.addEventListener||!Object.defineProperty)return!1;var o=!1,u=Object.defineProperty({},"passive",{get:function(){o=!0}});try{const h=()=>{};l.addEventListener("test",h,u),l.removeEventListener("test",h,u)}catch{}return o}();function ke(o,u){if(Y.call(this,o?o.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,o){var h=this.type=o.type,p=o.changedTouches&&o.changedTouches.length?o.changedTouches[0]:null;if(this.target=o.target||o.srcElement,this.g=u,u=o.relatedTarget){if(O){e:{try{P(u.nodeName);var R=!0;break e}catch{}R=!1}R||(u=null)}}else h=="mouseover"?u=o.fromElement:h=="mouseout"&&(u=o.toElement);this.relatedTarget=u,p?(this.clientX=p.clientX!==void 0?p.clientX:p.pageX,this.clientY=p.clientY!==void 0?p.clientY:p.pageY,this.screenX=p.screenX||0,this.screenY=p.screenY||0):(this.clientX=o.clientX!==void 0?o.clientX:o.pageX,this.clientY=o.clientY!==void 0?o.clientY:o.pageY,this.screenX=o.screenX||0,this.screenY=o.screenY||0),this.button=o.button,this.key=o.key||"",this.ctrlKey=o.ctrlKey,this.altKey=o.altKey,this.shiftKey=o.shiftKey,this.metaKey=o.metaKey,this.pointerId=o.pointerId||0,this.pointerType=typeof o.pointerType=="string"?o.pointerType:Yt[o.pointerType]||"",this.state=o.state,this.i=o,o.defaultPrevented&&ke.aa.h.call(this)}}T(ke,Y);var Yt={2:"touch",3:"pen",4:"mouse"};ke.prototype.h=function(){ke.aa.h.call(this);var o=this.i;o.preventDefault?o.preventDefault():o.returnValue=!1};var se="closure_listenable_"+(1e6*Math.random()|0),mn=0;function St(o,u,h,p,R){this.listener=o,this.proxy=null,this.src=u,this.type=h,this.capture=!!p,this.ha=R,this.key=++mn,this.da=this.fa=!1}function jn(o){o.da=!0,o.listener=null,o.proxy=null,o.src=null,o.ha=null}function gn(o){this.src=o,this.g={},this.h=0}gn.prototype.add=function(o,u,h,p,R){var k=o.toString();o=this.g[k],o||(o=this.g[k]=[],this.h++);var V=pt(o,u,p,R);return-1<V?(u=o[V],h||(u.fa=!1)):(u=new St(u,this.src,k,!!p,R),u.fa=h,o.push(u)),u};function ot(o,u){var h=u.type;if(h in o.g){var p=o.g[h],R=Array.prototype.indexOf.call(p,u,void 0),k;(k=0<=R)&&Array.prototype.splice.call(p,R,1),k&&(jn(u),o.g[h].length==0&&(delete o.g[h],o.h--))}}function pt(o,u,h,p){for(var R=0;R<o.length;++R){var k=o[R];if(!k.da&&k.listener==u&&k.capture==!!h&&k.ha==p)return R}return-1}var at="closure_lm_"+(1e6*Math.random()|0),et={};function le(o,u,h,p,R){if(Array.isArray(u)){for(var k=0;k<u.length;k++)le(o,u[k],h,p,R);return null}return h=ir(h),o&&o[se]?o.K(u,h,d(p)?!!p.capture:!1,R):vt(o,u,h,!1,p,R)}function vt(o,u,h,p,R,k){if(!u)throw Error("Invalid event type");var V=d(R)?!!R.capture:!!R,ue=Gt(o);if(ue||(o[at]=ue=new gn(o)),h=ue.add(u,h,p,V,k),h.proxy)return h;if(p=ze(),h.proxy=p,p.src=o,p.listener=h,o.addEventListener)It||(R=V),R===void 0&&(R=!1),o.addEventListener(u.toString(),p,R);else if(o.attachEvent)o.attachEvent(vs(u.toString()),p);else if(o.addListener&&o.removeListener)o.addListener(p);else throw Error("addEventListener and attachEvent are unavailable.");return h}function ze(){function o(h){return u.call(o.src,o.listener,h)}const u=pi;return o}function lt(o,u,h,p,R){if(Array.isArray(u))for(var k=0;k<u.length;k++)lt(o,u[k],h,p,R);else p=d(p)?!!p.capture:!!p,h=ir(h),o&&o[se]?(o=o.i,u=String(u).toString(),u in o.g&&(k=o.g[u],h=pt(k,h,p,R),-1<h&&(jn(k[h]),Array.prototype.splice.call(k,h,1),k.length==0&&(delete o.g[u],o.h--)))):o&&(o=Gt(o))&&(u=o.g[u.toString()],o=-1,u&&(o=pt(u,h,p,R)),(h=-1<o?u[o]:null)&&Ye(h))}function Ye(o){if(typeof o!="number"&&o&&!o.da){var u=o.src;if(u&&u[se])ot(u.i,o);else{var h=o.type,p=o.proxy;u.removeEventListener?u.removeEventListener(h,p,o.capture):u.detachEvent?u.detachEvent(vs(h),p):u.addListener&&u.removeListener&&u.removeListener(p),(h=Gt(u))?(ot(h,o),h.h==0&&(h.src=null,u[at]=null)):jn(o)}}}function vs(o){return o in et?et[o]:et[o]="on"+o}function pi(o,u){if(o.da)o=!0;else{u=new ke(u,this);var h=o.listener,p=o.ha||o.src;o.fa&&Ye(o),o=h.call(p,u)}return o}function Gt(o){return o=o[at],o instanceof gn?o:null}var rr="__closure_events_fn_"+(1e9*Math.random()>>>0);function ir(o){return typeof o=="function"?o:(o[rr]||(o[rr]=function(u){return o.handleEvent(u)}),o[rr])}function Ve(){_e.call(this),this.i=new gn(this),this.M=this,this.F=null}T(Ve,_e),Ve.prototype[se]=!0,Ve.prototype.removeEventListener=function(o,u,h,p){lt(this,o,u,h,p)};function Me(o,u){var h,p=o.F;if(p)for(h=[];p;p=p.F)h.push(p);if(o=o.M,p=u.type||u,typeof u=="string")u=new Y(u,o);else if(u instanceof Y)u.target=u.target||o;else{var R=u;u=new Y(p,o),E(u,R)}if(R=!0,h)for(var k=h.length-1;0<=k;k--){var V=u.g=h[k];R=or(V,p,!0,u)&&R}if(V=u.g=o,R=or(V,p,!0,u)&&R,R=or(V,p,!1,u)&&R,h)for(k=0;k<h.length;k++)V=u.g=h[k],R=or(V,p,!1,u)&&R}Ve.prototype.N=function(){if(Ve.aa.N.call(this),this.i){var o=this.i,u;for(u in o.g){for(var h=o.g[u],p=0;p<h.length;p++)jn(h[p]);delete o.g[u],o.h--}}this.F=null},Ve.prototype.K=function(o,u,h,p){return this.i.add(String(o),u,!1,h,p)},Ve.prototype.L=function(o,u,h,p){return this.i.add(String(o),u,!0,h,p)};function or(o,u,h,p){if(u=o.i.g[String(u)],!u)return!0;u=u.concat();for(var R=!0,k=0;k<u.length;++k){var V=u[k];if(V&&!V.da&&V.capture==h){var ue=V.listener,$e=V.ha||V.src;V.fa&&ot(o.i,V),R=ue.call($e,p)!==!1&&R}}return R&&!p.defaultPrevented}function mi(o,u,h){if(typeof o=="function")h&&(o=_(o,h));else if(o&&typeof o.handleEvent=="function")o=_(o.handleEvent,o);else throw Error("Invalid listener argument");return 2147483647<Number(u)?-1:l.setTimeout(o,u||0)}function ea(o){o.g=mi(()=>{o.g=null,o.i&&(o.i=!1,ea(o))},o.l);const u=o.h;o.h=null,o.m.apply(null,u)}class ar extends _e{constructor(u,h){super(),this.m=u,this.l=h,this.h=null,this.i=!1,this.g=null}j(u){this.h=arguments,this.g?this.i=!0:ea(this)}N(){super.N(),this.g&&(l.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Nt(o){_e.call(this),this.h=o,this.g={}}T(Nt,_e);var lr=[];function ta(o){z(o.g,function(u,h){this.g.hasOwnProperty(h)&&Ye(u)},o),o.g={}}Nt.prototype.N=function(){Nt.aa.N.call(this),ta(this)},Nt.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var _s=l.JSON.stringify,na=l.JSON.parse,sa=class{stringify(o){return l.JSON.stringify(o,void 0)}parse(o){return l.JSON.parse(o,void 0)}};function cr(){}cr.prototype.h=null;function gi(o){return o.h||(o.h=o.i())}function ws(){}var Wn={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function bs(){Y.call(this,"d")}T(bs,Y);function Es(){Y.call(this,"c")}T(Es,Y);var Lt={},ur=null;function X(){return ur=ur||new Ve}Lt.La="serverreachability";function De(o){Y.call(this,Lt.La,o)}T(De,Y);function Te(o){const u=X();Me(u,new De(u))}Lt.STAT_EVENT="statevent";function tt(o,u){Y.call(this,Lt.STAT_EVENT,o),this.stat=u}T(tt,Y);function me(o){const u=X();Me(u,new tt(u,o))}Lt.Ma="timingevent";function Se(o,u){Y.call(this,Lt.Ma,o),this.size=u}T(Se,Y);function nt(o,u){if(typeof o!="function")throw Error("Fn must not be null and must be a function");return l.setTimeout(function(){o()},u)}function fe(){this.g=!0}fe.prototype.xa=function(){this.g=!1};function Ue(o,u,h,p,R,k){o.info(function(){if(o.g)if(k)for(var V="",ue=k.split("&"),$e=0;$e<ue.length;$e++){var re=ue[$e].split("=");if(1<re.length){var Ge=re[0];re=re[1];var Ke=Ge.split("_");V=2<=Ke.length&&Ke[1]=="type"?V+(Ge+"="+re+"&"):V+(Ge+"=redacted&")}}else V=null;else V=k;return"XMLHTTP REQ ("+p+") [attempt "+R+"]: "+u+`
`+h+`
`+V})}function st(o,u,h,p,R,k,V){o.info(function(){return"XMLHTTP RESP ("+p+") [ attempt "+R+"]: "+u+`
`+h+`
`+k+" "+V})}function pe(o,u,h,p){o.info(function(){return"XMLHTTP TEXT ("+u+"): "+dr(o,h)+(p?" "+p:"")})}function Yn(o,u){o.info(function(){return"TIMEOUT: "+u})}fe.prototype.info=function(){};function dr(o,u){if(!o.g)return u;if(!u)return null;try{var h=JSON.parse(u);if(h){for(o=0;o<h.length;o++)if(Array.isArray(h[o])){var p=h[o];if(!(2>p.length)){var R=p[1];if(Array.isArray(R)&&!(1>R.length)){var k=R[0];if(k!="noop"&&k!="stop"&&k!="close")for(var V=1;V<R.length;V++)R[V]=""}}}}return _s(h)}catch{return u}}var hr={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},bc={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},ra;function yi(){}T(yi,cr),yi.prototype.g=function(){return new XMLHttpRequest},yi.prototype.i=function(){return{}},ra=new yi;function yn(o,u,h,p){this.j=o,this.i=u,this.l=h,this.R=p||1,this.U=new Nt(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new Ec}function Ec(){this.i=null,this.g="",this.h=!1}var Tc={},ia={};function oa(o,u,h){o.L=1,o.v=bi(Kt(u)),o.m=h,o.P=!0,Ic(o,null)}function Ic(o,u){o.F=Date.now(),vi(o),o.A=Kt(o.v);var h=o.A,p=o.R;Array.isArray(p)||(p=[String(p)]),Bc(h.i,"t",p),o.C=0,h=o.j.J,o.h=new Ec,o.g=nu(o.j,h?u:null,!o.m),0<o.O&&(o.M=new ar(_(o.Y,o,o.g),o.O)),u=o.U,h=o.g,p=o.ca;var R="readystatechange";Array.isArray(R)||(R&&(lr[0]=R.toString()),R=lr);for(var k=0;k<R.length;k++){var V=le(h,R[k],p||u.handleEvent,!1,u.h||u);if(!V)break;u.g[V.key]=V}u=o.H?y(o.H):{},o.m?(o.u||(o.u="POST"),u["Content-Type"]="application/x-www-form-urlencoded",o.g.ea(o.A,o.u,o.m,u)):(o.u="GET",o.g.ea(o.A,o.u,null,u)),Te(),Ue(o.i,o.u,o.A,o.l,o.R,o.m)}yn.prototype.ca=function(o){o=o.target;const u=this.M;u&&Qt(o)==3?u.j():this.Y(o)},yn.prototype.Y=function(o){try{if(o==this.g)e:{const Ke=Qt(this.g);var u=this.g.Ba();const Ss=this.g.Z();if(!(3>Ke)&&(Ke!=3||this.g&&(this.h.h||this.g.oa()||jc(this.g)))){this.J||Ke!=4||u==7||(u==8||0>=Ss?Te(3):Te(2)),aa(this);var h=this.g.Z();this.X=h;t:if(Sc(this)){var p=jc(this.g);o="";var R=p.length,k=Qt(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){Gn(this),fr(this);var V="";break t}this.h.i=new l.TextDecoder}for(u=0;u<R;u++)this.h.h=!0,o+=this.h.i.decode(p[u],{stream:!(k&&u==R-1)});p.length=0,this.h.g+=o,this.C=0,V=this.h.g}else V=this.g.oa();if(this.o=h==200,st(this.i,this.u,this.A,this.l,this.R,Ke,h),this.o){if(this.T&&!this.K){t:{if(this.g){var ue,$e=this.g;if((ue=$e.g?$e.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!M(ue)){var re=ue;break t}}re=null}if(h=re)pe(this.i,this.l,h,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,la(this,h);else{this.o=!1,this.s=3,me(12),Gn(this),fr(this);break e}}if(this.P){h=!0;let xt;for(;!this.J&&this.C<V.length;)if(xt=Fp(this,V),xt==ia){Ke==4&&(this.s=4,me(14),h=!1),pe(this.i,this.l,null,"[Incomplete Response]");break}else if(xt==Tc){this.s=4,me(15),pe(this.i,this.l,V,"[Invalid Chunk]"),h=!1;break}else pe(this.i,this.l,xt,null),la(this,xt);if(Sc(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),Ke!=4||V.length!=0||this.h.h||(this.s=1,me(16),h=!1),this.o=this.o&&h,!h)pe(this.i,this.l,V,"[Invalid Chunked Response]"),Gn(this),fr(this);else if(0<V.length&&!this.W){this.W=!0;var Ge=this.j;Ge.g==this&&Ge.ba&&!Ge.M&&(Ge.j.info("Great, no buffering proxy detected. Bytes received: "+V.length),pa(Ge),Ge.M=!0,me(11))}}else pe(this.i,this.l,V,null),la(this,V);Ke==4&&Gn(this),this.o&&!this.J&&(Ke==4?Xc(this.j,this):(this.o=!1,vi(this)))}else nm(this.g),h==400&&0<V.indexOf("Unknown SID")?(this.s=3,me(12)):(this.s=0,me(13)),Gn(this),fr(this)}}}catch{}finally{}};function Sc(o){return o.g?o.u=="GET"&&o.L!=2&&o.j.Ca:!1}function Fp(o,u){var h=o.C,p=u.indexOf(`
`,h);return p==-1?ia:(h=Number(u.substring(h,p)),isNaN(h)?Tc:(p+=1,p+h>u.length?ia:(u=u.slice(p,p+h),o.C=p+h,u)))}yn.prototype.cancel=function(){this.J=!0,Gn(this)};function vi(o){o.S=Date.now()+o.I,xc(o,o.I)}function xc(o,u){if(o.B!=null)throw Error("WatchDog timer not null");o.B=nt(_(o.ba,o),u)}function aa(o){o.B&&(l.clearTimeout(o.B),o.B=null)}yn.prototype.ba=function(){this.B=null;const o=Date.now();0<=o-this.S?(Yn(this.i,this.A),this.L!=2&&(Te(),me(17)),Gn(this),this.s=2,fr(this)):xc(this,this.S-o)};function fr(o){o.j.G==0||o.J||Xc(o.j,o)}function Gn(o){aa(o);var u=o.M;u&&typeof u.ma=="function"&&u.ma(),o.M=null,ta(o.U),o.g&&(u=o.g,o.g=null,u.abort(),u.ma())}function la(o,u){try{var h=o.j;if(h.G!=0&&(h.g==o||ca(h.h,o))){if(!o.K&&ca(h.h,o)&&h.G==3){try{var p=h.Da.g.parse(u)}catch{p=null}if(Array.isArray(p)&&p.length==3){var R=p;if(R[0]==0){e:if(!h.u){if(h.g)if(h.g.F+3e3<o.F)Ai(h),Si(h);else break e;fa(h),me(18)}}else h.za=R[1],0<h.za-h.T&&37500>R[2]&&h.F&&h.v==0&&!h.C&&(h.C=nt(_(h.Za,h),6e3));if(1>=Pc(h.h)&&h.ca){try{h.ca()}catch{}h.ca=void 0}}else Qn(h,11)}else if((o.K||h.g==o)&&Ai(h),!M(u))for(R=h.Da.g.parse(u),u=0;u<R.length;u++){let re=R[u];if(h.T=re[0],re=re[1],h.G==2)if(re[0]=="c"){h.K=re[1],h.ia=re[2];const Ge=re[3];Ge!=null&&(h.la=Ge,h.j.info("VER="+h.la));const Ke=re[4];Ke!=null&&(h.Aa=Ke,h.j.info("SVER="+h.Aa));const Ss=re[5];Ss!=null&&typeof Ss=="number"&&0<Ss&&(p=1.5*Ss,h.L=p,h.j.info("backChannelRequestTimeoutMs_="+p)),p=h;const xt=o.g;if(xt){const Pi=xt.g?xt.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Pi){var k=p.h;k.g||Pi.indexOf("spdy")==-1&&Pi.indexOf("quic")==-1&&Pi.indexOf("h2")==-1||(k.j=k.l,k.g=new Set,k.h&&(ua(k,k.h),k.h=null))}if(p.D){const ma=xt.g?xt.g.getResponseHeader("X-HTTP-Session-Id"):null;ma&&(p.ya=ma,ge(p.I,p.D,ma))}}h.G=3,h.l&&h.l.ua(),h.ba&&(h.R=Date.now()-o.F,h.j.info("Handshake RTT: "+h.R+"ms")),p=h;var V=o;if(p.qa=tu(p,p.J?p.ia:null,p.W),V.K){Cc(p.h,V);var ue=V,$e=p.L;$e&&(ue.I=$e),ue.B&&(aa(ue),vi(ue)),p.g=V}else Qc(p);0<h.i.length&&xi(h)}else re[0]!="stop"&&re[0]!="close"||Qn(h,7);else h.G==3&&(re[0]=="stop"||re[0]=="close"?re[0]=="stop"?Qn(h,7):ha(h):re[0]!="noop"&&h.l&&h.l.ta(re),h.v=0)}}Te(4)}catch{}}var zp=class{constructor(o,u){this.g=o,this.map=u}};function Ac(o){this.l=o||10,l.PerformanceNavigationTiming?(o=l.performance.getEntriesByType("navigation"),o=0<o.length&&(o[0].nextHopProtocol=="hq"||o[0].nextHopProtocol=="h2")):o=!!(l.chrome&&l.chrome.loadTimes&&l.chrome.loadTimes()&&l.chrome.loadTimes().wasFetchedViaSpdy),this.j=o?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function Rc(o){return o.h?!0:o.g?o.g.size>=o.j:!1}function Pc(o){return o.h?1:o.g?o.g.size:0}function ca(o,u){return o.h?o.h==u:o.g?o.g.has(u):!1}function ua(o,u){o.g?o.g.add(u):o.h=u}function Cc(o,u){o.h&&o.h==u?o.h=null:o.g&&o.g.has(u)&&o.g.delete(u)}Ac.prototype.cancel=function(){if(this.i=kc(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const o of this.g.values())o.cancel();this.g.clear()}};function kc(o){if(o.h!=null)return o.i.concat(o.h.D);if(o.g!=null&&o.g.size!==0){let u=o.i;for(const h of o.g.values())u=u.concat(h.D);return u}return C(o.i)}function Up(o){if(o.V&&typeof o.V=="function")return o.V();if(typeof Map<"u"&&o instanceof Map||typeof Set<"u"&&o instanceof Set)return Array.from(o.values());if(typeof o=="string")return o.split("");if(c(o)){for(var u=[],h=o.length,p=0;p<h;p++)u.push(o[p]);return u}u=[],h=0;for(p in o)u[h++]=o[p];return u}function $p(o){if(o.na&&typeof o.na=="function")return o.na();if(!o.V||typeof o.V!="function"){if(typeof Map<"u"&&o instanceof Map)return Array.from(o.keys());if(!(typeof Set<"u"&&o instanceof Set)){if(c(o)||typeof o=="string"){var u=[];o=o.length;for(var h=0;h<o;h++)u.push(h);return u}u=[],h=0;for(const p in o)u[h++]=p;return u}}}function Mc(o,u){if(o.forEach&&typeof o.forEach=="function")o.forEach(u,void 0);else if(c(o)||typeof o=="string")Array.prototype.forEach.call(o,u,void 0);else for(var h=$p(o),p=Up(o),R=p.length,k=0;k<R;k++)u.call(void 0,p[k],h&&h[k],o)}var Dc=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function qp(o,u){if(o){o=o.split("&");for(var h=0;h<o.length;h++){var p=o[h].indexOf("="),R=null;if(0<=p){var k=o[h].substring(0,p);R=o[h].substring(p+1)}else k=o[h];u(k,R?decodeURIComponent(R.replace(/\+/g," ")):"")}}}function Kn(o){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,o instanceof Kn){this.h=o.h,_i(this,o.j),this.o=o.o,this.g=o.g,wi(this,o.s),this.l=o.l;var u=o.i,h=new gr;h.i=u.i,u.g&&(h.g=new Map(u.g),h.h=u.h),Nc(this,h),this.m=o.m}else o&&(u=String(o).match(Dc))?(this.h=!1,_i(this,u[1]||"",!0),this.o=pr(u[2]||""),this.g=pr(u[3]||"",!0),wi(this,u[4]),this.l=pr(u[5]||"",!0),Nc(this,u[6]||"",!0),this.m=pr(u[7]||"")):(this.h=!1,this.i=new gr(null,this.h))}Kn.prototype.toString=function(){var o=[],u=this.j;u&&o.push(mr(u,Lc,!0),":");var h=this.g;return(h||u=="file")&&(o.push("//"),(u=this.o)&&o.push(mr(u,Lc,!0),"@"),o.push(encodeURIComponent(String(h)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),h=this.s,h!=null&&o.push(":",String(h))),(h=this.l)&&(this.g&&h.charAt(0)!="/"&&o.push("/"),o.push(mr(h,h.charAt(0)=="/"?Wp:jp,!0))),(h=this.i.toString())&&o.push("?",h),(h=this.m)&&o.push("#",mr(h,Gp)),o.join("")};function Kt(o){return new Kn(o)}function _i(o,u,h){o.j=h?pr(u,!0):u,o.j&&(o.j=o.j.replace(/:$/,""))}function wi(o,u){if(u){if(u=Number(u),isNaN(u)||0>u)throw Error("Bad port number "+u);o.s=u}else o.s=null}function Nc(o,u,h){u instanceof gr?(o.i=u,Kp(o.i,o.h)):(h||(u=mr(u,Yp)),o.i=new gr(u,o.h))}function ge(o,u,h){o.i.set(u,h)}function bi(o){return ge(o,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),o}function pr(o,u){return o?u?decodeURI(o.replace(/%25/g,"%2525")):decodeURIComponent(o):""}function mr(o,u,h){return typeof o=="string"?(o=encodeURI(o).replace(u,Hp),h&&(o=o.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),o):null}function Hp(o){return o=o.charCodeAt(0),"%"+(o>>4&15).toString(16)+(o&15).toString(16)}var Lc=/[#\/\?@]/g,jp=/[#\?:]/g,Wp=/[#\?]/g,Yp=/[#\?@]/g,Gp=/#/g;function gr(o,u){this.h=this.g=null,this.i=o||null,this.j=!!u}function vn(o){o.g||(o.g=new Map,o.h=0,o.i&&qp(o.i,function(u,h){o.add(decodeURIComponent(u.replace(/\+/g," ")),h)}))}n=gr.prototype,n.add=function(o,u){vn(this),this.i=null,o=Ts(this,o);var h=this.g.get(o);return h||this.g.set(o,h=[]),h.push(u),this.h+=1,this};function Oc(o,u){vn(o),u=Ts(o,u),o.g.has(u)&&(o.i=null,o.h-=o.g.get(u).length,o.g.delete(u))}function Vc(o,u){return vn(o),u=Ts(o,u),o.g.has(u)}n.forEach=function(o,u){vn(this),this.g.forEach(function(h,p){h.forEach(function(R){o.call(u,R,p,this)},this)},this)},n.na=function(){vn(this);const o=Array.from(this.g.values()),u=Array.from(this.g.keys()),h=[];for(let p=0;p<u.length;p++){const R=o[p];for(let k=0;k<R.length;k++)h.push(u[p])}return h},n.V=function(o){vn(this);let u=[];if(typeof o=="string")Vc(this,o)&&(u=u.concat(this.g.get(Ts(this,o))));else{o=Array.from(this.g.values());for(let h=0;h<o.length;h++)u=u.concat(o[h])}return u},n.set=function(o,u){return vn(this),this.i=null,o=Ts(this,o),Vc(this,o)&&(this.h-=this.g.get(o).length),this.g.set(o,[u]),this.h+=1,this},n.get=function(o,u){return o?(o=this.V(o),0<o.length?String(o[0]):u):u};function Bc(o,u,h){Oc(o,u),0<h.length&&(o.i=null,o.g.set(Ts(o,u),C(h)),o.h+=h.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const o=[],u=Array.from(this.g.keys());for(var h=0;h<u.length;h++){var p=u[h];const k=encodeURIComponent(String(p)),V=this.V(p);for(p=0;p<V.length;p++){var R=k;V[p]!==""&&(R+="="+encodeURIComponent(String(V[p]))),o.push(R)}}return this.i=o.join("&")};function Ts(o,u){return u=String(u),o.j&&(u=u.toLowerCase()),u}function Kp(o,u){u&&!o.j&&(vn(o),o.i=null,o.g.forEach(function(h,p){var R=p.toLowerCase();p!=R&&(Oc(this,p),Bc(this,R,h))},o)),o.j=u}function Qp(o,u){const h=new fe;if(l.Image){const p=new Image;p.onload=w(_n,h,"TestLoadImage: loaded",!0,u,p),p.onerror=w(_n,h,"TestLoadImage: error",!1,u,p),p.onabort=w(_n,h,"TestLoadImage: abort",!1,u,p),p.ontimeout=w(_n,h,"TestLoadImage: timeout",!1,u,p),l.setTimeout(function(){p.ontimeout&&p.ontimeout()},1e4),p.src=o}else u(!1)}function Jp(o,u){const h=new fe,p=new AbortController,R=setTimeout(()=>{p.abort(),_n(h,"TestPingServer: timeout",!1,u)},1e4);fetch(o,{signal:p.signal}).then(k=>{clearTimeout(R),k.ok?_n(h,"TestPingServer: ok",!0,u):_n(h,"TestPingServer: server error",!1,u)}).catch(()=>{clearTimeout(R),_n(h,"TestPingServer: error",!1,u)})}function _n(o,u,h,p,R){try{R&&(R.onload=null,R.onerror=null,R.onabort=null,R.ontimeout=null),p(h)}catch{}}function Xp(){this.g=new sa}function Zp(o,u,h){const p=h||"";try{Mc(o,function(R,k){let V=R;d(R)&&(V=_s(R)),u.push(p+k+"="+encodeURIComponent(V))})}catch(R){throw u.push(p+"type="+encodeURIComponent("_badmap")),R}}function Ei(o){this.l=o.Ub||null,this.j=o.eb||!1}T(Ei,cr),Ei.prototype.g=function(){return new Ti(this.l,this.j)},Ei.prototype.i=function(o){return function(){return o}}({});function Ti(o,u){Ve.call(this),this.D=o,this.o=u,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}T(Ti,Ve),n=Ti.prototype,n.open=function(o,u){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=o,this.A=u,this.readyState=1,vr(this)},n.send=function(o){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const u={headers:this.u,method:this.B,credentials:this.m,cache:void 0};o&&(u.body=o),(this.D||l).fetch(new Request(this.A,u)).then(this.Sa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,yr(this)),this.readyState=0},n.Sa=function(o){if(this.g&&(this.l=o,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=o.headers,this.readyState=2,vr(this)),this.g&&(this.readyState=3,vr(this),this.g)))if(this.responseType==="arraybuffer")o.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof l.ReadableStream<"u"&&"body"in o){if(this.j=o.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;Fc(this)}else o.text().then(this.Ra.bind(this),this.ga.bind(this))};function Fc(o){o.j.read().then(o.Pa.bind(o)).catch(o.ga.bind(o))}n.Pa=function(o){if(this.g){if(this.o&&o.value)this.response.push(o.value);else if(!this.o){var u=o.value?o.value:new Uint8Array(0);(u=this.v.decode(u,{stream:!o.done}))&&(this.response=this.responseText+=u)}o.done?yr(this):vr(this),this.readyState==3&&Fc(this)}},n.Ra=function(o){this.g&&(this.response=this.responseText=o,yr(this))},n.Qa=function(o){this.g&&(this.response=o,yr(this))},n.ga=function(){this.g&&yr(this)};function yr(o){o.readyState=4,o.l=null,o.j=null,o.v=null,vr(o)}n.setRequestHeader=function(o,u){this.u.append(o,u)},n.getResponseHeader=function(o){return this.h&&this.h.get(o.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const o=[],u=this.h.entries();for(var h=u.next();!h.done;)h=h.value,o.push(h[0]+": "+h[1]),h=u.next();return o.join(`\r
`)};function vr(o){o.onreadystatechange&&o.onreadystatechange.call(o)}Object.defineProperty(Ti.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(o){this.m=o?"include":"same-origin"}});function zc(o){let u="";return z(o,function(h,p){u+=p,u+=":",u+=h,u+=`\r
`}),u}function da(o,u,h){e:{for(p in h){var p=!1;break e}p=!0}p||(h=zc(h),typeof o=="string"?h!=null&&encodeURIComponent(String(h)):ge(o,u,h))}function Ie(o){Ve.call(this),this.headers=new Map,this.o=o||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}T(Ie,Ve);var em=/^https?$/i,tm=["POST","PUT"];n=Ie.prototype,n.Ha=function(o){this.J=o},n.ea=function(o,u,h,p){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+o);u=u?u.toUpperCase():"GET",this.D=o,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():ra.g(),this.v=this.o?gi(this.o):gi(ra),this.g.onreadystatechange=_(this.Ea,this);try{this.B=!0,this.g.open(u,String(o),!0),this.B=!1}catch(k){Uc(this,k);return}if(o=h||"",h=new Map(this.headers),p)if(Object.getPrototypeOf(p)===Object.prototype)for(var R in p)h.set(R,p[R]);else if(typeof p.keys=="function"&&typeof p.get=="function")for(const k of p.keys())h.set(k,p.get(k));else throw Error("Unknown input type for opt_headers: "+String(p));p=Array.from(h.keys()).find(k=>k.toLowerCase()=="content-type"),R=l.FormData&&o instanceof l.FormData,!(0<=Array.prototype.indexOf.call(tm,u,void 0))||p||R||h.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[k,V]of h)this.g.setRequestHeader(k,V);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{Hc(this),this.u=!0,this.g.send(o),this.u=!1}catch(k){Uc(this,k)}};function Uc(o,u){o.h=!1,o.g&&(o.j=!0,o.g.abort(),o.j=!1),o.l=u,o.m=5,$c(o),Ii(o)}function $c(o){o.A||(o.A=!0,Me(o,"complete"),Me(o,"error"))}n.abort=function(o){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=o||7,Me(this,"complete"),Me(this,"abort"),Ii(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Ii(this,!0)),Ie.aa.N.call(this)},n.Ea=function(){this.s||(this.B||this.u||this.j?qc(this):this.bb())},n.bb=function(){qc(this)};function qc(o){if(o.h&&typeof a<"u"&&(!o.v[1]||Qt(o)!=4||o.Z()!=2)){if(o.u&&Qt(o)==4)mi(o.Ea,0,o);else if(Me(o,"readystatechange"),Qt(o)==4){o.h=!1;try{const V=o.Z();e:switch(V){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var u=!0;break e;default:u=!1}var h;if(!(h=u)){var p;if(p=V===0){var R=String(o.D).match(Dc)[1]||null;!R&&l.self&&l.self.location&&(R=l.self.location.protocol.slice(0,-1)),p=!em.test(R?R.toLowerCase():"")}h=p}if(h)Me(o,"complete"),Me(o,"success");else{o.m=6;try{var k=2<Qt(o)?o.g.statusText:""}catch{k=""}o.l=k+" ["+o.Z()+"]",$c(o)}}finally{Ii(o)}}}}function Ii(o,u){if(o.g){Hc(o);const h=o.g,p=o.v[0]?()=>{}:null;o.g=null,o.v=null,u||Me(o,"ready");try{h.onreadystatechange=p}catch{}}}function Hc(o){o.I&&(l.clearTimeout(o.I),o.I=null)}n.isActive=function(){return!!this.g};function Qt(o){return o.g?o.g.readyState:0}n.Z=function(){try{return 2<Qt(this)?this.g.status:-1}catch{return-1}},n.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.Oa=function(o){if(this.g){var u=this.g.responseText;return o&&u.indexOf(o)==0&&(u=u.substring(o.length)),na(u)}};function jc(o){try{if(!o.g)return null;if("response"in o.g)return o.g.response;switch(o.H){case"":case"text":return o.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in o.g)return o.g.mozResponseArrayBuffer}return null}catch{return null}}function nm(o){const u={};o=(o.g&&2<=Qt(o)&&o.g.getAllResponseHeaders()||"").split(`\r
`);for(let p=0;p<o.length;p++){if(M(o[p]))continue;var h=S(o[p]);const R=h[0];if(h=h[1],typeof h!="string")continue;h=h.trim();const k=u[R]||[];u[R]=k,k.push(h)}g(u,function(p){return p.join(", ")})}n.Ba=function(){return this.m},n.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function _r(o,u,h){return h&&h.internalChannelParams&&h.internalChannelParams[o]||u}function Wc(o){this.Aa=0,this.i=[],this.j=new fe,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=_r("failFast",!1,o),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=_r("baseRetryDelayMs",5e3,o),this.cb=_r("retryDelaySeedMs",1e4,o),this.Wa=_r("forwardChannelMaxRetries",2,o),this.wa=_r("forwardChannelRequestTimeoutMs",2e4,o),this.pa=o&&o.xmlHttpFactory||void 0,this.Xa=o&&o.Tb||void 0,this.Ca=o&&o.useFetchStreams||!1,this.L=void 0,this.J=o&&o.supportsCrossDomainXhr||!1,this.K="",this.h=new Ac(o&&o.concurrentRequestLimit),this.Da=new Xp,this.P=o&&o.fastHandshake||!1,this.O=o&&o.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=o&&o.Rb||!1,o&&o.xa&&this.j.xa(),o&&o.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&o&&o.detectBufferingProxy||!1,this.ja=void 0,o&&o.longPollingTimeout&&0<o.longPollingTimeout&&(this.ja=o.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}n=Wc.prototype,n.la=8,n.G=1,n.connect=function(o,u,h,p){me(0),this.W=o,this.H=u||{},h&&p!==void 0&&(this.H.OSID=h,this.H.OAID=p),this.F=this.X,this.I=tu(this,null,this.W),xi(this)};function ha(o){if(Yc(o),o.G==3){var u=o.U++,h=Kt(o.I);if(ge(h,"SID",o.K),ge(h,"RID",u),ge(h,"TYPE","terminate"),wr(o,h),u=new yn(o,o.j,u),u.L=2,u.v=bi(Kt(h)),h=!1,l.navigator&&l.navigator.sendBeacon)try{h=l.navigator.sendBeacon(u.v.toString(),"")}catch{}!h&&l.Image&&(new Image().src=u.v,h=!0),h||(u.g=nu(u.j,null),u.g.ea(u.v)),u.F=Date.now(),vi(u)}eu(o)}function Si(o){o.g&&(pa(o),o.g.cancel(),o.g=null)}function Yc(o){Si(o),o.u&&(l.clearTimeout(o.u),o.u=null),Ai(o),o.h.cancel(),o.s&&(typeof o.s=="number"&&l.clearTimeout(o.s),o.s=null)}function xi(o){if(!Rc(o.h)&&!o.s){o.s=!0;var u=o.Ga;oe||he(),ye||(oe(),ye=!0),Z.add(u,o),o.B=0}}function sm(o,u){return Pc(o.h)>=o.h.j-(o.s?1:0)?!1:o.s?(o.i=u.D.concat(o.i),!0):o.G==1||o.G==2||o.B>=(o.Va?0:o.Wa)?!1:(o.s=nt(_(o.Ga,o,u),Zc(o,o.B)),o.B++,!0)}n.Ga=function(o){if(this.s)if(this.s=null,this.G==1){if(!o){this.U=Math.floor(1e5*Math.random()),o=this.U++;const R=new yn(this,this.j,o);let k=this.o;if(this.S&&(k?(k=y(k),E(k,this.S)):k=this.S),this.m!==null||this.O||(R.H=k,k=null),this.P)e:{for(var u=0,h=0;h<this.i.length;h++){t:{var p=this.i[h];if("__data__"in p.map&&(p=p.map.__data__,typeof p=="string")){p=p.length;break t}p=void 0}if(p===void 0)break;if(u+=p,4096<u){u=h;break e}if(u===4096||h===this.i.length-1){u=h+1;break e}}u=1e3}else u=1e3;u=Kc(this,R,u),h=Kt(this.I),ge(h,"RID",o),ge(h,"CVER",22),this.D&&ge(h,"X-HTTP-Session-Id",this.D),wr(this,h),k&&(this.O?u="headers="+encodeURIComponent(String(zc(k)))+"&"+u:this.m&&da(h,this.m,k)),ua(this.h,R),this.Ua&&ge(h,"TYPE","init"),this.P?(ge(h,"$req",u),ge(h,"SID","null"),R.T=!0,oa(R,h,null)):oa(R,h,u),this.G=2}}else this.G==3&&(o?Gc(this,o):this.i.length==0||Rc(this.h)||Gc(this))};function Gc(o,u){var h;u?h=u.l:h=o.U++;const p=Kt(o.I);ge(p,"SID",o.K),ge(p,"RID",h),ge(p,"AID",o.T),wr(o,p),o.m&&o.o&&da(p,o.m,o.o),h=new yn(o,o.j,h,o.B+1),o.m===null&&(h.H=o.o),u&&(o.i=u.D.concat(o.i)),u=Kc(o,h,1e3),h.I=Math.round(.5*o.wa)+Math.round(.5*o.wa*Math.random()),ua(o.h,h),oa(h,p,u)}function wr(o,u){o.H&&z(o.H,function(h,p){ge(u,p,h)}),o.l&&Mc({},function(h,p){ge(u,p,h)})}function Kc(o,u,h){h=Math.min(o.i.length,h);var p=o.l?_(o.l.Na,o.l,o):null;e:{var R=o.i;let k=-1;for(;;){const V=["count="+h];k==-1?0<h?(k=R[0].g,V.push("ofs="+k)):k=0:V.push("ofs="+k);let ue=!0;for(let $e=0;$e<h;$e++){let re=R[$e].g;const Ge=R[$e].map;if(re-=k,0>re)k=Math.max(0,R[$e].g-100),ue=!1;else try{Zp(Ge,V,"req"+re+"_")}catch{p&&p(Ge)}}if(ue){p=V.join("&");break e}}}return o=o.i.splice(0,h),u.D=o,p}function Qc(o){if(!o.g&&!o.u){o.Y=1;var u=o.Fa;oe||he(),ye||(oe(),ye=!0),Z.add(u,o),o.v=0}}function fa(o){return o.g||o.u||3<=o.v?!1:(o.Y++,o.u=nt(_(o.Fa,o),Zc(o,o.v)),o.v++,!0)}n.Fa=function(){if(this.u=null,Jc(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var o=2*this.R;this.j.info("BP detection timer enabled: "+o),this.A=nt(_(this.ab,this),o)}},n.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,me(10),Si(this),Jc(this))};function pa(o){o.A!=null&&(l.clearTimeout(o.A),o.A=null)}function Jc(o){o.g=new yn(o,o.j,"rpc",o.Y),o.m===null&&(o.g.H=o.o),o.g.O=0;var u=Kt(o.qa);ge(u,"RID","rpc"),ge(u,"SID",o.K),ge(u,"AID",o.T),ge(u,"CI",o.F?"0":"1"),!o.F&&o.ja&&ge(u,"TO",o.ja),ge(u,"TYPE","xmlhttp"),wr(o,u),o.m&&o.o&&da(u,o.m,o.o),o.L&&(o.g.I=o.L);var h=o.g;o=o.ia,h.L=1,h.v=bi(Kt(u)),h.m=null,h.P=!0,Ic(h,o)}n.Za=function(){this.C!=null&&(this.C=null,Si(this),fa(this),me(19))};function Ai(o){o.C!=null&&(l.clearTimeout(o.C),o.C=null)}function Xc(o,u){var h=null;if(o.g==u){Ai(o),pa(o),o.g=null;var p=2}else if(ca(o.h,u))h=u.D,Cc(o.h,u),p=1;else return;if(o.G!=0){if(u.o)if(p==1){h=u.m?u.m.length:0,u=Date.now()-u.F;var R=o.B;p=X(),Me(p,new Se(p,h)),xi(o)}else Qc(o);else if(R=u.s,R==3||R==0&&0<u.X||!(p==1&&sm(o,u)||p==2&&fa(o)))switch(h&&0<h.length&&(u=o.h,u.i=u.i.concat(h)),R){case 1:Qn(o,5);break;case 4:Qn(o,10);break;case 3:Qn(o,6);break;default:Qn(o,2)}}}function Zc(o,u){let h=o.Ta+Math.floor(Math.random()*o.cb);return o.isActive()||(h*=2),h*u}function Qn(o,u){if(o.j.info("Error code "+u),u==2){var h=_(o.fb,o),p=o.Xa;const R=!p;p=new Kn(p||"//www.google.com/images/cleardot.gif"),l.location&&l.location.protocol=="http"||_i(p,"https"),bi(p),R?Qp(p.toString(),h):Jp(p.toString(),h)}else me(2);o.G=0,o.l&&o.l.sa(u),eu(o),Yc(o)}n.fb=function(o){o?(this.j.info("Successfully pinged google.com"),me(2)):(this.j.info("Failed to ping google.com"),me(1))};function eu(o){if(o.G=0,o.ka=[],o.l){const u=kc(o.h);(u.length!=0||o.i.length!=0)&&(x(o.ka,u),x(o.ka,o.i),o.h.i.length=0,C(o.i),o.i.length=0),o.l.ra()}}function tu(o,u,h){var p=h instanceof Kn?Kt(h):new Kn(h);if(p.g!="")u&&(p.g=u+"."+p.g),wi(p,p.s);else{var R=l.location;p=R.protocol,u=u?u+"."+R.hostname:R.hostname,R=+R.port;var k=new Kn(null);p&&_i(k,p),u&&(k.g=u),R&&wi(k,R),h&&(k.l=h),p=k}return h=o.D,u=o.ya,h&&u&&ge(p,h,u),ge(p,"VER",o.la),wr(o,p),p}function nu(o,u,h){if(u&&!o.J)throw Error("Can't create secondary domain capable XhrIo object.");return u=o.Ca&&!o.pa?new Ie(new Ei({eb:h})):new Ie(o.pa),u.Ha(o.J),u}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function su(){}n=su.prototype,n.ua=function(){},n.ta=function(){},n.sa=function(){},n.ra=function(){},n.isActive=function(){return!0},n.Na=function(){};function Ri(){}Ri.prototype.g=function(o,u){return new mt(o,u)};function mt(o,u){Ve.call(this),this.g=new Wc(u),this.l=o,this.h=u&&u.messageUrlParams||null,o=u&&u.messageHeaders||null,u&&u.clientProtocolHeaderRequired&&(o?o["X-Client-Protocol"]="webchannel":o={"X-Client-Protocol":"webchannel"}),this.g.o=o,o=u&&u.initMessageHeaders||null,u&&u.messageContentType&&(o?o["X-WebChannel-Content-Type"]=u.messageContentType:o={"X-WebChannel-Content-Type":u.messageContentType}),u&&u.va&&(o?o["X-WebChannel-Client-Profile"]=u.va:o={"X-WebChannel-Client-Profile":u.va}),this.g.S=o,(o=u&&u.Sb)&&!M(o)&&(this.g.m=o),this.v=u&&u.supportsCrossDomainXhr||!1,this.u=u&&u.sendRawJson||!1,(u=u&&u.httpSessionIdParam)&&!M(u)&&(this.g.D=u,o=this.h,o!==null&&u in o&&(o=this.h,u in o&&delete o[u])),this.j=new Is(this)}T(mt,Ve),mt.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},mt.prototype.close=function(){ha(this.g)},mt.prototype.o=function(o){var u=this.g;if(typeof o=="string"){var h={};h.__data__=o,o=h}else this.u&&(h={},h.__data__=_s(o),o=h);u.i.push(new zp(u.Ya++,o)),u.G==3&&xi(u)},mt.prototype.N=function(){this.g.l=null,delete this.j,ha(this.g),delete this.g,mt.aa.N.call(this)};function ru(o){bs.call(this),o.__headers__&&(this.headers=o.__headers__,this.statusCode=o.__status__,delete o.__headers__,delete o.__status__);var u=o.__sm__;if(u){e:{for(const h in u){o=h;break e}o=void 0}(this.i=o)&&(o=this.i,u=u!==null&&o in u?u[o]:void 0),this.data=u}else this.data=o}T(ru,bs);function iu(){Es.call(this),this.status=1}T(iu,Es);function Is(o){this.g=o}T(Is,su),Is.prototype.ua=function(){Me(this.g,"a")},Is.prototype.ta=function(o){Me(this.g,new ru(o))},Is.prototype.sa=function(o){Me(this.g,new iu)},Is.prototype.ra=function(){Me(this.g,"b")},Ri.prototype.createWebChannel=Ri.prototype.g,mt.prototype.send=mt.prototype.o,mt.prototype.open=mt.prototype.m,mt.prototype.close=mt.prototype.close,Ch=function(){return new Ri},Ph=function(){return X()},Rh=Lt,qa={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},hr.NO_ERROR=0,hr.TIMEOUT=8,hr.HTTP_ERROR=6,zi=hr,bc.COMPLETE="complete",Ah=bc,ws.EventType=Wn,Wn.OPEN="a",Wn.CLOSE="b",Wn.ERROR="c",Wn.MESSAGE="d",Ve.prototype.listen=Ve.prototype.K,xr=ws,Ie.prototype.listenOnce=Ie.prototype.L,Ie.prototype.getLastError=Ie.prototype.Ka,Ie.prototype.getLastErrorCode=Ie.prototype.Ba,Ie.prototype.getStatus=Ie.prototype.Z,Ie.prototype.getResponseJson=Ie.prototype.Oa,Ie.prototype.getResponseText=Ie.prototype.oa,Ie.prototype.send=Ie.prototype.ea,Ie.prototype.setWithCredentials=Ie.prototype.Ha,xh=Ie}).apply(typeof Mi<"u"?Mi:typeof self<"u"?self:typeof window<"u"?window:{});const Bu="@firebase/firestore";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */let Zs="10.14.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const as=new fl("@firebase/firestore");function Er(){return as.logLevel}function U(n,...e){if(as.logLevel<=te.DEBUG){const t=e.map(Al);as.debug(`Firestore (${Zs}): ${n}`,...t)}}function an(n,...e){if(as.logLevel<=te.ERROR){const t=e.map(Al);as.error(`Firestore (${Zs}): ${n}`,...t)}}function $s(n,...e){if(as.logLevel<=te.WARN){const t=e.map(Al);as.warn(`Firestore (${Zs}): ${n}`,...t)}}function Al(n){if(typeof n=="string")return n;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
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
 */function W(n="Unexpected state"){const e=`FIRESTORE (${Zs}) INTERNAL ASSERTION FAILED: `+n;throw an(e),new Error(e)}function ae(n,e){n||W()}function K(n,e){return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const N={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class $ extends un{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sn{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kh{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class v0{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(Je.UNAUTHENTICATED))}shutdown(){}}class _0{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class w0{constructor(e){this.t=e,this.currentUser=Je.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){ae(this.o===void 0);let s=this.i;const r=c=>this.i!==s?(s=this.i,t(c)):Promise.resolve();let i=new sn;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new sn,e.enqueueRetryable(()=>r(this.currentUser))};const a=()=>{const c=i;e.enqueueRetryable(async()=>{await c.promise,await r(this.currentUser)})},l=c=>{U("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=c,this.o&&(this.auth.addAuthTokenListener(this.o),a())};this.t.onInit(c=>l(c)),setTimeout(()=>{if(!this.auth){const c=this.t.getImmediate({optional:!0});c?l(c):(U("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new sn)}},0),a()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(s=>this.i!==e?(U("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):s?(ae(typeof s.accessToken=="string"),new kh(s.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return ae(e===null||typeof e=="string"),new Je(e)}}class b0{constructor(e,t,s){this.l=e,this.h=t,this.P=s,this.type="FirstParty",this.user=Je.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class E0{constructor(e,t,s){this.l=e,this.h=t,this.P=s}getToken(){return Promise.resolve(new b0(this.l,this.h,this.P))}start(e,t){e.enqueueRetryable(()=>t(Je.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class T0{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class I0{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,t){ae(this.o===void 0);const s=i=>{i.error!=null&&U("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const a=i.token!==this.R;return this.R=i.token,U("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?t(i.token):Promise.resolve()};this.o=i=>{e.enqueueRetryable(()=>s(i))};const r=i=>{U("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(i=>r(i)),setTimeout(()=>{if(!this.appCheck){const i=this.A.getImmediate({optional:!0});i?r(i):U("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(t=>t?(ae(typeof t.token=="string"),this.R=t.token,new T0(t.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function S0(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let s=0;s<n;s++)t[s]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mh{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=Math.floor(256/e.length)*e.length;let s="";for(;s.length<20;){const r=S0(40);for(let i=0;i<r.length;++i)s.length<20&&r[i]<t&&(s+=e.charAt(r[i]%e.length))}return s}}function ie(n,e){return n<e?-1:n>e?1:0}function qs(n,e,t){return n.length===e.length&&n.every((s,r)=>t(s,e[r]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Le{constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new $(N.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new $(N.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<-62135596800)throw new $(N.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new $(N.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return Le.fromMillis(Date.now())}static fromDate(e){return Le.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),s=Math.floor(1e6*(e-1e3*t));return new Le(t,s)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?ie(this.nanoseconds,e.nanoseconds):ie(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class Ur{constructor(e,t,s){t===void 0?t=0:t>e.length&&W(),s===void 0?s=e.length-t:s>e.length-t&&W(),this.segments=e,this.offset=t,this.len=s}get length(){return this.len}isEqual(e){return Ur.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof Ur?e.forEach(s=>{t.push(s)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,s=this.limit();t<s;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const s=Math.min(e.length,t.length);for(let r=0;r<s;r++){const i=e.get(r),a=t.get(r);if(i<a)return-1;if(i>a)return 1}return e.length<t.length?-1:e.length>t.length?1:0}}class we extends Ur{construct(e,t,s){return new we(e,t,s)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const s of e){if(s.indexOf("//")>=0)throw new $(N.INVALID_ARGUMENT,`Invalid segment (${s}). Paths must not contain // in them.`);t.push(...s.split("/").filter(r=>r.length>0))}return new we(t)}static emptyPath(){return new we([])}}const x0=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class He extends Ur{construct(e,t,s){return new He(e,t,s)}static isValidIdentifier(e){return x0.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),He.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new He(["__name__"])}static fromServerFormat(e){const t=[];let s="",r=0;const i=()=>{if(s.length===0)throw new $(N.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(s),s=""};let a=!1;for(;r<e.length;){const l=e[r];if(l==="\\"){if(r+1===e.length)throw new $(N.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const c=e[r+1];if(c!=="\\"&&c!=="."&&c!=="`")throw new $(N.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);s+=c,r+=2}else l==="`"?(a=!a,r++):l!=="."||a?(s+=l,r++):(i(),r++)}if(i(),a)throw new $(N.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new He(t)}static emptyPath(){return new He([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class q{constructor(e){this.path=e}static fromPath(e){return new q(we.fromString(e))}static fromName(e){return new q(we.fromString(e).popFirst(5))}static empty(){return new q(we.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&we.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return we.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new q(new we(e.slice()))}}function A0(n,e){const t=n.toTimestamp().seconds,s=n.toTimestamp().nanoseconds+1,r=G.fromTimestamp(s===1e9?new Le(t+1,0):new Le(t,s));return new Vn(r,q.empty(),e)}function R0(n){return new Vn(n.readTime,n.key,-1)}class Vn{constructor(e,t,s){this.readTime=e,this.documentKey=t,this.largestBatchId=s}static min(){return new Vn(G.min(),q.empty(),-1)}static max(){return new Vn(G.max(),q.empty(),-1)}}function P0(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=q.comparator(n.documentKey,e.documentKey),t!==0?t:ie(n.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const C0="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class k0{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ri(n){if(n.code!==N.FAILED_PRECONDITION||n.message!==C0)throw n;U("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class L{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)},t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&W(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new L((s,r)=>{this.nextCallback=i=>{this.wrapSuccess(e,i).next(s,r)},this.catchCallback=i=>{this.wrapFailure(t,i).next(s,r)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{const t=e();return t instanceof L?t:L.resolve(t)}catch(t){return L.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):L.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):L.reject(t)}static resolve(e){return new L((t,s)=>{t(e)})}static reject(e){return new L((t,s)=>{s(e)})}static waitFor(e){return new L((t,s)=>{let r=0,i=0,a=!1;e.forEach(l=>{++r,l.next(()=>{++i,a&&i===r&&t()},c=>s(c))}),a=!0,i===r&&t()})}static or(e){let t=L.resolve(!1);for(const s of e)t=t.next(r=>r?L.resolve(r):s());return t}static forEach(e,t){const s=[];return e.forEach((r,i)=>{s.push(t.call(this,r,i))}),this.waitFor(s)}static mapArray(e,t){return new L((s,r)=>{const i=e.length,a=new Array(i);let l=0;for(let c=0;c<i;c++){const d=c;t(e[d]).next(f=>{a[d]=f,++l,l===i&&s(a)},f=>r(f))}})}static doWhile(e,t){return new L((s,r)=>{const i=()=>{e()===!0?t().next(()=>{i()},r):s()};i()})}}function M0(n){const e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function ii(n){return n.name==="IndexedDbTransactionError"}/**
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
 */class Rl{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=s=>this.ie(s),this.se=s=>t.writeSequenceNumber(s))}ie(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.se&&this.se(e),e}}Rl.oe=-1;function To(n){return n==null}function so(n){return n===0&&1/n==-1/0}function D0(n){return typeof n=="number"&&Number.isInteger(n)&&!so(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fu(n){let e=0;for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function fs(n,e){for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function Dh(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ee{constructor(e,t){this.comparator=e,this.root=t||qe.EMPTY}insert(e,t){return new Ee(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,qe.BLACK,null,null))}remove(e){return new Ee(this.comparator,this.root.remove(e,this.comparator).copy(null,null,qe.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const s=this.comparator(e,t.key);if(s===0)return t.value;s<0?t=t.left:s>0&&(t=t.right)}return null}indexOf(e){let t=0,s=this.root;for(;!s.isEmpty();){const r=this.comparator(e,s.key);if(r===0)return t+s.left.size;r<0?s=s.left:(t+=s.left.size+1,s=s.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,s)=>(e(t,s),!1))}toString(){const e=[];return this.inorderTraversal((t,s)=>(e.push(`${t}:${s}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Di(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Di(this.root,e,this.comparator,!1)}getReverseIterator(){return new Di(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Di(this.root,e,this.comparator,!0)}}class Di{constructor(e,t,s,r){this.isReverse=r,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?s(e.key,t):1,t&&r&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class qe{constructor(e,t,s,r,i){this.key=e,this.value=t,this.color=s??qe.RED,this.left=r??qe.EMPTY,this.right=i??qe.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,s,r,i){return new qe(e??this.key,t??this.value,s??this.color,r??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,s){let r=this;const i=s(e,r.key);return r=i<0?r.copy(null,null,null,r.left.insert(e,t,s),null):i===0?r.copy(null,t,null,null,null):r.copy(null,null,null,null,r.right.insert(e,t,s)),r.fixUp()}removeMin(){if(this.left.isEmpty())return qe.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let s,r=this;if(t(e,r.key)<0)r.left.isEmpty()||r.left.isRed()||r.left.left.isRed()||(r=r.moveRedLeft()),r=r.copy(null,null,null,r.left.remove(e,t),null);else{if(r.left.isRed()&&(r=r.rotateRight()),r.right.isEmpty()||r.right.isRed()||r.right.left.isRed()||(r=r.moveRedRight()),t(e,r.key)===0){if(r.right.isEmpty())return qe.EMPTY;s=r.right.min(),r=r.copy(s.key,s.value,null,null,r.right.removeMin())}r=r.copy(null,null,null,null,r.right.remove(e,t))}return r.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,qe.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,qe.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw W();const e=this.left.check();if(e!==this.right.check())throw W();return e+(this.isRed()?0:1)}}qe.EMPTY=null,qe.RED=!0,qe.BLACK=!1;qe.EMPTY=new class{constructor(){this.size=0}get key(){throw W()}get value(){throw W()}get color(){throw W()}get left(){throw W()}get right(){throw W()}copy(e,t,s,r,i){return this}insert(e,t,s){return new qe(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class je{constructor(e){this.comparator=e,this.data=new Ee(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,s)=>(e(t),!1))}forEachInRange(e,t){const s=this.data.getIteratorFrom(e[0]);for(;s.hasNext();){const r=s.getNext();if(this.comparator(r.key,e[1])>=0)return;t(r.key)}}forEachWhile(e,t){let s;for(s=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();s.hasNext();)if(!e(s.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new zu(this.data.getIterator())}getIteratorFrom(e){return new zu(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(s=>{t=t.add(s)}),t}isEqual(e){if(!(e instanceof je)||this.size!==e.size)return!1;const t=this.data.getIterator(),s=e.data.getIterator();for(;t.hasNext();){const r=t.getNext().key,i=s.getNext().key;if(this.comparator(r,i)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(t=>{e.push(t)}),e}toString(){const e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){const t=new je(this.comparator);return t.data=e,t}}class zu{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gt{constructor(e){this.fields=e,e.sort(He.comparator)}static empty(){return new gt([])}unionWith(e){let t=new je(He.comparator);for(const s of this.fields)t=t.add(s);for(const s of e)t=t.add(s);return new gt(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return qs(this.fields,e.fields,(t,s)=>t.isEqual(s))}}/**
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
 */class Nh extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class We{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(r){try{return atob(r)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new Nh("Invalid base64 string: "+i):i}}(e);return new We(t)}static fromUint8Array(e){const t=function(r){let i="";for(let a=0;a<r.length;++a)i+=String.fromCharCode(r[a]);return i}(e);return new We(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(t){return btoa(t)}(this.binaryString)}toUint8Array(){return function(t){const s=new Uint8Array(t.length);for(let r=0;r<t.length;r++)s[r]=t.charCodeAt(r);return s}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return ie(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}We.EMPTY_BYTE_STRING=new We("");const N0=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Bn(n){if(ae(!!n),typeof n=="string"){let e=0;const t=N0.exec(n);if(ae(!!t),t[1]){let r=t[1];r=(r+"000000000").substr(0,9),e=Number(r)}const s=new Date(n);return{seconds:Math.floor(s.getTime()/1e3),nanos:e}}return{seconds:xe(n.seconds),nanos:xe(n.nanos)}}function xe(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function ls(n){return typeof n=="string"?We.fromBase64String(n):We.fromUint8Array(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pl(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="server_timestamp"}function Cl(n){const e=n.mapValue.fields.__previous_value__;return Pl(e)?Cl(e):e}function $r(n){const e=Bn(n.mapValue.fields.__local_write_time__.timestampValue);return new Le(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class L0{constructor(e,t,s,r,i,a,l,c,d){this.databaseId=e,this.appId=t,this.persistenceKey=s,this.host=r,this.ssl=i,this.forceLongPolling=a,this.autoDetectLongPolling=l,this.longPollingOptions=c,this.useFetchStreams=d}}class qr{constructor(e,t){this.projectId=e,this.database=t||"(default)"}static empty(){return new qr("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof qr&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ni={mapValue:{}};function cs(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?Pl(n)?4:V0(n)?9007199254740991:O0(n)?10:11:W()}function Ut(n,e){if(n===e)return!0;const t=cs(n);if(t!==cs(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return $r(n).isEqual($r(e));case 3:return function(r,i){if(typeof r.timestampValue=="string"&&typeof i.timestampValue=="string"&&r.timestampValue.length===i.timestampValue.length)return r.timestampValue===i.timestampValue;const a=Bn(r.timestampValue),l=Bn(i.timestampValue);return a.seconds===l.seconds&&a.nanos===l.nanos}(n,e);case 5:return n.stringValue===e.stringValue;case 6:return function(r,i){return ls(r.bytesValue).isEqual(ls(i.bytesValue))}(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return function(r,i){return xe(r.geoPointValue.latitude)===xe(i.geoPointValue.latitude)&&xe(r.geoPointValue.longitude)===xe(i.geoPointValue.longitude)}(n,e);case 2:return function(r,i){if("integerValue"in r&&"integerValue"in i)return xe(r.integerValue)===xe(i.integerValue);if("doubleValue"in r&&"doubleValue"in i){const a=xe(r.doubleValue),l=xe(i.doubleValue);return a===l?so(a)===so(l):isNaN(a)&&isNaN(l)}return!1}(n,e);case 9:return qs(n.arrayValue.values||[],e.arrayValue.values||[],Ut);case 10:case 11:return function(r,i){const a=r.mapValue.fields||{},l=i.mapValue.fields||{};if(Fu(a)!==Fu(l))return!1;for(const c in a)if(a.hasOwnProperty(c)&&(l[c]===void 0||!Ut(a[c],l[c])))return!1;return!0}(n,e);default:return W()}}function Hr(n,e){return(n.values||[]).find(t=>Ut(t,e))!==void 0}function Hs(n,e){if(n===e)return 0;const t=cs(n),s=cs(e);if(t!==s)return ie(t,s);switch(t){case 0:case 9007199254740991:return 0;case 1:return ie(n.booleanValue,e.booleanValue);case 2:return function(i,a){const l=xe(i.integerValue||i.doubleValue),c=xe(a.integerValue||a.doubleValue);return l<c?-1:l>c?1:l===c?0:isNaN(l)?isNaN(c)?0:-1:1}(n,e);case 3:return Uu(n.timestampValue,e.timestampValue);case 4:return Uu($r(n),$r(e));case 5:return ie(n.stringValue,e.stringValue);case 6:return function(i,a){const l=ls(i),c=ls(a);return l.compareTo(c)}(n.bytesValue,e.bytesValue);case 7:return function(i,a){const l=i.split("/"),c=a.split("/");for(let d=0;d<l.length&&d<c.length;d++){const f=ie(l[d],c[d]);if(f!==0)return f}return ie(l.length,c.length)}(n.referenceValue,e.referenceValue);case 8:return function(i,a){const l=ie(xe(i.latitude),xe(a.latitude));return l!==0?l:ie(xe(i.longitude),xe(a.longitude))}(n.geoPointValue,e.geoPointValue);case 9:return $u(n.arrayValue,e.arrayValue);case 10:return function(i,a){var l,c,d,f;const m=i.fields||{},_=a.fields||{},w=(l=m.value)===null||l===void 0?void 0:l.arrayValue,T=(c=_.value)===null||c===void 0?void 0:c.arrayValue,C=ie(((d=w==null?void 0:w.values)===null||d===void 0?void 0:d.length)||0,((f=T==null?void 0:T.values)===null||f===void 0?void 0:f.length)||0);return C!==0?C:$u(w,T)}(n.mapValue,e.mapValue);case 11:return function(i,a){if(i===Ni.mapValue&&a===Ni.mapValue)return 0;if(i===Ni.mapValue)return 1;if(a===Ni.mapValue)return-1;const l=i.fields||{},c=Object.keys(l),d=a.fields||{},f=Object.keys(d);c.sort(),f.sort();for(let m=0;m<c.length&&m<f.length;++m){const _=ie(c[m],f[m]);if(_!==0)return _;const w=Hs(l[c[m]],d[f[m]]);if(w!==0)return w}return ie(c.length,f.length)}(n.mapValue,e.mapValue);default:throw W()}}function Uu(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return ie(n,e);const t=Bn(n),s=Bn(e),r=ie(t.seconds,s.seconds);return r!==0?r:ie(t.nanos,s.nanos)}function $u(n,e){const t=n.values||[],s=e.values||[];for(let r=0;r<t.length&&r<s.length;++r){const i=Hs(t[r],s[r]);if(i)return i}return ie(t.length,s.length)}function js(n){return Ha(n)}function Ha(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?function(t){const s=Bn(t);return`time(${s.seconds},${s.nanos})`}(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?function(t){return ls(t).toBase64()}(n.bytesValue):"referenceValue"in n?function(t){return q.fromName(t).toString()}(n.referenceValue):"geoPointValue"in n?function(t){return`geo(${t.latitude},${t.longitude})`}(n.geoPointValue):"arrayValue"in n?function(t){let s="[",r=!0;for(const i of t.values||[])r?r=!1:s+=",",s+=Ha(i);return s+"]"}(n.arrayValue):"mapValue"in n?function(t){const s=Object.keys(t.fields||{}).sort();let r="{",i=!0;for(const a of s)i?i=!1:r+=",",r+=`${a}:${Ha(t.fields[a])}`;return r+"}"}(n.mapValue):W()}function ja(n){return!!n&&"integerValue"in n}function kl(n){return!!n&&"arrayValue"in n}function qu(n){return!!n&&"nullValue"in n}function Hu(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function Ui(n){return!!n&&"mapValue"in n}function O0(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="__vector__"}function Mr(n){if(n.geoPointValue)return{geoPointValue:Object.assign({},n.geoPointValue)};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:Object.assign({},n.timestampValue)};if(n.mapValue){const e={mapValue:{fields:{}}};return fs(n.mapValue.fields,(t,s)=>e.mapValue.fields[t]=Mr(s)),e}if(n.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Mr(n.arrayValue.values[t]);return e}return Object.assign({},n)}function V0(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ct{constructor(e){this.value=e}static empty(){return new ct({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let s=0;s<e.length-1;++s)if(t=(t.mapValue.fields||{})[e.get(s)],!Ui(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Mr(t)}setAll(e){let t=He.emptyPath(),s={},r=[];e.forEach((a,l)=>{if(!t.isImmediateParentOf(l)){const c=this.getFieldsMap(t);this.applyChanges(c,s,r),s={},r=[],t=l.popLast()}a?s[l.lastSegment()]=Mr(a):r.push(l.lastSegment())});const i=this.getFieldsMap(t);this.applyChanges(i,s,r)}delete(e){const t=this.field(e.popLast());Ui(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return Ut(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let s=0;s<e.length;++s){let r=t.mapValue.fields[e.get(s)];Ui(r)&&r.mapValue.fields||(r={mapValue:{fields:{}}},t.mapValue.fields[e.get(s)]=r),t=r}return t.mapValue.fields}applyChanges(e,t,s){fs(t,(r,i)=>e[r]=i);for(const r of s)delete e[r]}clone(){return new ct(Mr(this.value))}}function Lh(n){const e=[];return fs(n.fields,(t,s)=>{const r=new He([t]);if(Ui(s)){const i=Lh(s.mapValue).fields;if(i.length===0)e.push(r);else for(const a of i)e.push(r.child(a))}else e.push(r)}),new gt(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xe{constructor(e,t,s,r,i,a,l){this.key=e,this.documentType=t,this.version=s,this.readTime=r,this.createTime=i,this.data=a,this.documentState=l}static newInvalidDocument(e){return new Xe(e,0,G.min(),G.min(),G.min(),ct.empty(),0)}static newFoundDocument(e,t,s,r){return new Xe(e,1,t,G.min(),s,r,0)}static newNoDocument(e,t){return new Xe(e,2,t,G.min(),G.min(),ct.empty(),0)}static newUnknownDocument(e,t){return new Xe(e,3,t,G.min(),G.min(),ct.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(G.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=ct.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=ct.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=G.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof Xe&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Xe(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class ro{constructor(e,t){this.position=e,this.inclusive=t}}function ju(n,e,t){let s=0;for(let r=0;r<n.position.length;r++){const i=e[r],a=n.position[r];if(i.field.isKeyField()?s=q.comparator(q.fromName(a.referenceValue),t.key):s=Hs(a,t.data.field(i.field)),i.dir==="desc"&&(s*=-1),s!==0)break}return s}function Wu(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!Ut(n.position[t],e.position[t]))return!1;return!0}/**
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
 */class Oh{}class Ne extends Oh{constructor(e,t,s){super(),this.field=e,this.op=t,this.value=s}static create(e,t,s){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,s):new z0(e,t,s):t==="array-contains"?new q0(e,s):t==="in"?new H0(e,s):t==="not-in"?new j0(e,s):t==="array-contains-any"?new W0(e,s):new Ne(e,t,s)}static createKeyFieldInFilter(e,t,s){return t==="in"?new U0(e,s):new $0(e,s)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&this.matchesComparison(Hs(t,this.value)):t!==null&&cs(this.value)===cs(t)&&this.matchesComparison(Hs(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return W()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class $t extends Oh{constructor(e,t){super(),this.filters=e,this.op=t,this.ae=null}static create(e,t){return new $t(e,t)}matches(e){return Vh(this)?this.filters.find(t=>!t.matches(e))===void 0:this.filters.find(t=>t.matches(e))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function Vh(n){return n.op==="and"}function Bh(n){return F0(n)&&Vh(n)}function F0(n){for(const e of n.filters)if(e instanceof $t)return!1;return!0}function Wa(n){if(n instanceof Ne)return n.field.canonicalString()+n.op.toString()+js(n.value);if(Bh(n))return n.filters.map(e=>Wa(e)).join(",");{const e=n.filters.map(t=>Wa(t)).join(",");return`${n.op}(${e})`}}function Fh(n,e){return n instanceof Ne?function(s,r){return r instanceof Ne&&s.op===r.op&&s.field.isEqual(r.field)&&Ut(s.value,r.value)}(n,e):n instanceof $t?function(s,r){return r instanceof $t&&s.op===r.op&&s.filters.length===r.filters.length?s.filters.reduce((i,a,l)=>i&&Fh(a,r.filters[l]),!0):!1}(n,e):void W()}function zh(n){return n instanceof Ne?function(t){return`${t.field.canonicalString()} ${t.op} ${js(t.value)}`}(n):n instanceof $t?function(t){return t.op.toString()+" {"+t.getFilters().map(zh).join(" ,")+"}"}(n):"Filter"}class z0 extends Ne{constructor(e,t,s){super(e,t,s),this.key=q.fromName(s.referenceValue)}matches(e){const t=q.comparator(e.key,this.key);return this.matchesComparison(t)}}class U0 extends Ne{constructor(e,t){super(e,"in",t),this.keys=Uh("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class $0 extends Ne{constructor(e,t){super(e,"not-in",t),this.keys=Uh("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function Uh(n,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map(s=>q.fromName(s.referenceValue))}class q0 extends Ne{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return kl(t)&&Hr(t.arrayValue,this.value)}}class H0 extends Ne{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&Hr(this.value.arrayValue,t)}}class j0 extends Ne{constructor(e,t){super(e,"not-in",t)}matches(e){if(Hr(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&!Hr(this.value.arrayValue,t)}}class W0 extends Ne{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!kl(t)||!t.arrayValue.values)&&t.arrayValue.values.some(s=>Hr(this.value.arrayValue,s))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Y0{constructor(e,t=null,s=[],r=[],i=null,a=null,l=null){this.path=e,this.collectionGroup=t,this.orderBy=s,this.filters=r,this.limit=i,this.startAt=a,this.endAt=l,this.ue=null}}function Yu(n,e=null,t=[],s=[],r=null,i=null,a=null){return new Y0(n,e,t,s,r,i,a)}function Ml(n){const e=K(n);if(e.ue===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map(s=>Wa(s)).join(","),t+="|ob:",t+=e.orderBy.map(s=>function(i){return i.field.canonicalString()+i.dir}(s)).join(","),To(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map(s=>js(s)).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map(s=>js(s)).join(",")),e.ue=t}return e.ue}function Dl(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!B0(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!Fh(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!Wu(n.startAt,e.startAt)&&Wu(n.endAt,e.endAt)}function Ya(n){return q.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Io{constructor(e,t=null,s=[],r=[],i=null,a="F",l=null,c=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=s,this.filters=r,this.limit=i,this.limitType=a,this.startAt=l,this.endAt=c,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function G0(n,e,t,s,r,i,a,l){return new Io(n,e,t,s,r,i,a,l)}function Nl(n){return new Io(n)}function Gu(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function K0(n){return n.collectionGroup!==null}function Dr(n){const e=K(n);if(e.ce===null){e.ce=[];const t=new Set;for(const i of e.explicitOrderBy)e.ce.push(i),t.add(i.field.canonicalString());const s=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(a){let l=new je(He.comparator);return a.filters.forEach(c=>{c.getFlattenedFilters().forEach(d=>{d.isInequality()&&(l=l.add(d.field))})}),l})(e).forEach(i=>{t.has(i.canonicalString())||i.isKeyField()||e.ce.push(new io(i,s))}),t.has(He.keyField().canonicalString())||e.ce.push(new io(He.keyField(),s))}return e.ce}function Ft(n){const e=K(n);return e.le||(e.le=Q0(e,Dr(n))),e.le}function Q0(n,e){if(n.limitType==="F")return Yu(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map(r=>{const i=r.dir==="desc"?"asc":"desc";return new io(r.field,i)});const t=n.endAt?new ro(n.endAt.position,n.endAt.inclusive):null,s=n.startAt?new ro(n.startAt.position,n.startAt.inclusive):null;return Yu(n.path,n.collectionGroup,e,n.filters,n.limit,t,s)}}function Ga(n,e,t){return new Io(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function So(n,e){return Dl(Ft(n),Ft(e))&&n.limitType===e.limitType}function $h(n){return`${Ml(Ft(n))}|lt:${n.limitType}`}function Rs(n){return`Query(target=${function(t){let s=t.path.canonicalString();return t.collectionGroup!==null&&(s+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(s+=`, filters: [${t.filters.map(r=>zh(r)).join(", ")}]`),To(t.limit)||(s+=", limit: "+t.limit),t.orderBy.length>0&&(s+=`, orderBy: [${t.orderBy.map(r=>function(a){return`${a.field.canonicalString()} (${a.dir})`}(r)).join(", ")}]`),t.startAt&&(s+=", startAt: ",s+=t.startAt.inclusive?"b:":"a:",s+=t.startAt.position.map(r=>js(r)).join(",")),t.endAt&&(s+=", endAt: ",s+=t.endAt.inclusive?"a:":"b:",s+=t.endAt.position.map(r=>js(r)).join(",")),`Target(${s})`}(Ft(n))}; limitType=${n.limitType})`}function xo(n,e){return e.isFoundDocument()&&function(s,r){const i=r.key.path;return s.collectionGroup!==null?r.key.hasCollectionId(s.collectionGroup)&&s.path.isPrefixOf(i):q.isDocumentKey(s.path)?s.path.isEqual(i):s.path.isImmediateParentOf(i)}(n,e)&&function(s,r){for(const i of Dr(s))if(!i.field.isKeyField()&&r.data.field(i.field)===null)return!1;return!0}(n,e)&&function(s,r){for(const i of s.filters)if(!i.matches(r))return!1;return!0}(n,e)&&function(s,r){return!(s.startAt&&!function(a,l,c){const d=ju(a,l,c);return a.inclusive?d<=0:d<0}(s.startAt,Dr(s),r)||s.endAt&&!function(a,l,c){const d=ju(a,l,c);return a.inclusive?d>=0:d>0}(s.endAt,Dr(s),r))}(n,e)}function J0(n){return n.collectionGroup||(n.path.length%2==1?n.path.lastSegment():n.path.get(n.path.length-2))}function qh(n){return(e,t)=>{let s=!1;for(const r of Dr(n)){const i=X0(r,e,t);if(i!==0)return i;s=s||r.field.isKeyField()}return 0}}function X0(n,e,t){const s=n.field.isKeyField()?q.comparator(e.key,t.key):function(i,a,l){const c=a.data.field(i),d=l.data.field(i);return c!==null&&d!==null?Hs(c,d):W()}(n.field,e,t);switch(n.dir){case"asc":return s;case"desc":return-1*s;default:return W()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class er{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),s=this.inner[t];if(s!==void 0){for(const[r,i]of s)if(this.equalsFn(r,e))return i}}has(e){return this.get(e)!==void 0}set(e,t){const s=this.mapKeyFn(e),r=this.inner[s];if(r===void 0)return this.inner[s]=[[e,t]],void this.innerSize++;for(let i=0;i<r.length;i++)if(this.equalsFn(r[i][0],e))return void(r[i]=[e,t]);r.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),s=this.inner[t];if(s===void 0)return!1;for(let r=0;r<s.length;r++)if(this.equalsFn(s[r][0],e))return s.length===1?delete this.inner[t]:s.splice(r,1),this.innerSize--,!0;return!1}forEach(e){fs(this.inner,(t,s)=>{for(const[r,i]of s)e(r,i)})}isEmpty(){return Dh(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Z0=new Ee(q.comparator);function ln(){return Z0}const Hh=new Ee(q.comparator);function Ar(...n){let e=Hh;for(const t of n)e=e.insert(t.key,t);return e}function jh(n){let e=Hh;return n.forEach((t,s)=>e=e.insert(t,s.overlayedDocument)),e}function es(){return Nr()}function Wh(){return Nr()}function Nr(){return new er(n=>n.toString(),(n,e)=>n.isEqual(e))}const e_=new Ee(q.comparator),t_=new je(q.comparator);function ee(...n){let e=t_;for(const t of n)e=e.add(t);return e}const n_=new je(ie);function s_(){return n_}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ll(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:so(e)?"-0":e}}function Yh(n){return{integerValue:""+n}}function r_(n,e){return D0(e)?Yh(e):Ll(n,e)}/**
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
 */class Ao{constructor(){this._=void 0}}function i_(n,e,t){return n instanceof oo?function(r,i){const a={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:r.seconds,nanos:r.nanoseconds}}}};return i&&Pl(i)&&(i=Cl(i)),i&&(a.fields.__previous_value__=i),{mapValue:a}}(t,e):n instanceof jr?Kh(n,e):n instanceof Wr?Qh(n,e):function(r,i){const a=Gh(r,i),l=Ku(a)+Ku(r.Pe);return ja(a)&&ja(r.Pe)?Yh(l):Ll(r.serializer,l)}(n,e)}function o_(n,e,t){return n instanceof jr?Kh(n,e):n instanceof Wr?Qh(n,e):t}function Gh(n,e){return n instanceof ao?function(s){return ja(s)||function(i){return!!i&&"doubleValue"in i}(s)}(e)?e:{integerValue:0}:null}class oo extends Ao{}class jr extends Ao{constructor(e){super(),this.elements=e}}function Kh(n,e){const t=Jh(e);for(const s of n.elements)t.some(r=>Ut(r,s))||t.push(s);return{arrayValue:{values:t}}}class Wr extends Ao{constructor(e){super(),this.elements=e}}function Qh(n,e){let t=Jh(e);for(const s of n.elements)t=t.filter(r=>!Ut(r,s));return{arrayValue:{values:t}}}class ao extends Ao{constructor(e,t){super(),this.serializer=e,this.Pe=t}}function Ku(n){return xe(n.integerValue||n.doubleValue)}function Jh(n){return kl(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}function a_(n,e){return n.field.isEqual(e.field)&&function(s,r){return s instanceof jr&&r instanceof jr||s instanceof Wr&&r instanceof Wr?qs(s.elements,r.elements,Ut):s instanceof ao&&r instanceof ao?Ut(s.Pe,r.Pe):s instanceof oo&&r instanceof oo}(n.transform,e.transform)}class l_{constructor(e,t){this.version=e,this.transformResults=t}}class it{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new it}static exists(e){return new it(void 0,e)}static updateTime(e){return new it(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function $i(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}class Ro{}function Xh(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new Po(n.key,it.none()):new oi(n.key,n.data,it.none());{const t=n.data,s=ct.empty();let r=new je(He.comparator);for(let i of e.fields)if(!r.has(i)){let a=t.field(i);a===null&&i.length>1&&(i=i.popLast(),a=t.field(i)),a===null?s.delete(i):s.set(i,a),r=r.add(i)}return new Un(n.key,s,new gt(r.toArray()),it.none())}}function c_(n,e,t){n instanceof oi?function(r,i,a){const l=r.value.clone(),c=Ju(r.fieldTransforms,i,a.transformResults);l.setAll(c),i.convertToFoundDocument(a.version,l).setHasCommittedMutations()}(n,e,t):n instanceof Un?function(r,i,a){if(!$i(r.precondition,i))return void i.convertToUnknownDocument(a.version);const l=Ju(r.fieldTransforms,i,a.transformResults),c=i.data;c.setAll(Zh(r)),c.setAll(l),i.convertToFoundDocument(a.version,c).setHasCommittedMutations()}(n,e,t):function(r,i,a){i.convertToNoDocument(a.version).setHasCommittedMutations()}(0,e,t)}function Lr(n,e,t,s){return n instanceof oi?function(i,a,l,c){if(!$i(i.precondition,a))return l;const d=i.value.clone(),f=Xu(i.fieldTransforms,c,a);return d.setAll(f),a.convertToFoundDocument(a.version,d).setHasLocalMutations(),null}(n,e,t,s):n instanceof Un?function(i,a,l,c){if(!$i(i.precondition,a))return l;const d=Xu(i.fieldTransforms,c,a),f=a.data;return f.setAll(Zh(i)),f.setAll(d),a.convertToFoundDocument(a.version,f).setHasLocalMutations(),l===null?null:l.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map(m=>m.field))}(n,e,t,s):function(i,a,l){return $i(i.precondition,a)?(a.convertToNoDocument(a.version).setHasLocalMutations(),null):l}(n,e,t)}function u_(n,e){let t=null;for(const s of n.fieldTransforms){const r=e.data.field(s.field),i=Gh(s.transform,r||null);i!=null&&(t===null&&(t=ct.empty()),t.set(s.field,i))}return t||null}function Qu(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!function(s,r){return s===void 0&&r===void 0||!(!s||!r)&&qs(s,r,(i,a)=>a_(i,a))}(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}class oi extends Ro{constructor(e,t,s,r=[]){super(),this.key=e,this.value=t,this.precondition=s,this.fieldTransforms=r,this.type=0}getFieldMask(){return null}}class Un extends Ro{constructor(e,t,s,r,i=[]){super(),this.key=e,this.data=t,this.fieldMask=s,this.precondition=r,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function Zh(n){const e=new Map;return n.fieldMask.fields.forEach(t=>{if(!t.isEmpty()){const s=n.data.field(t);e.set(t,s)}}),e}function Ju(n,e,t){const s=new Map;ae(n.length===t.length);for(let r=0;r<t.length;r++){const i=n[r],a=i.transform,l=e.data.field(i.field);s.set(i.field,o_(a,l,t[r]))}return s}function Xu(n,e,t){const s=new Map;for(const r of n){const i=r.transform,a=t.data.field(r.field);s.set(r.field,i_(i,a,e))}return s}class Po extends Ro{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class d_ extends Ro{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class h_{constructor(e,t,s,r){this.batchId=e,this.localWriteTime=t,this.baseMutations=s,this.mutations=r}applyToRemoteDocument(e,t){const s=t.mutationResults;for(let r=0;r<this.mutations.length;r++){const i=this.mutations[r];i.key.isEqual(e.key)&&c_(i,e,s[r])}}applyToLocalView(e,t){for(const s of this.baseMutations)s.key.isEqual(e.key)&&(t=Lr(s,e,t,this.localWriteTime));for(const s of this.mutations)s.key.isEqual(e.key)&&(t=Lr(s,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const s=Wh();return this.mutations.forEach(r=>{const i=e.get(r.key),a=i.overlayedDocument;let l=this.applyToLocalView(a,i.mutatedFields);l=t.has(r.key)?null:l;const c=Xh(a,l);c!==null&&s.set(r.key,c),a.isValidDocument()||a.convertToNoDocument(G.min())}),s}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),ee())}isEqual(e){return this.batchId===e.batchId&&qs(this.mutations,e.mutations,(t,s)=>Qu(t,s))&&qs(this.baseMutations,e.baseMutations,(t,s)=>Qu(t,s))}}class Ol{constructor(e,t,s,r){this.batch=e,this.commitVersion=t,this.mutationResults=s,this.docVersions=r}static from(e,t,s){ae(e.mutations.length===s.length);let r=function(){return e_}();const i=e.mutations;for(let a=0;a<i.length;a++)r=r.insert(i[a].key,s[a].version);return new Ol(e,t,s,r)}}/**
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
 */class f_{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
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
 */class p_{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Re,ne;function m_(n){switch(n){default:return W();case N.CANCELLED:case N.UNKNOWN:case N.DEADLINE_EXCEEDED:case N.RESOURCE_EXHAUSTED:case N.INTERNAL:case N.UNAVAILABLE:case N.UNAUTHENTICATED:return!1;case N.INVALID_ARGUMENT:case N.NOT_FOUND:case N.ALREADY_EXISTS:case N.PERMISSION_DENIED:case N.FAILED_PRECONDITION:case N.ABORTED:case N.OUT_OF_RANGE:case N.UNIMPLEMENTED:case N.DATA_LOSS:return!0}}function ef(n){if(n===void 0)return an("GRPC error has no .code"),N.UNKNOWN;switch(n){case Re.OK:return N.OK;case Re.CANCELLED:return N.CANCELLED;case Re.UNKNOWN:return N.UNKNOWN;case Re.DEADLINE_EXCEEDED:return N.DEADLINE_EXCEEDED;case Re.RESOURCE_EXHAUSTED:return N.RESOURCE_EXHAUSTED;case Re.INTERNAL:return N.INTERNAL;case Re.UNAVAILABLE:return N.UNAVAILABLE;case Re.UNAUTHENTICATED:return N.UNAUTHENTICATED;case Re.INVALID_ARGUMENT:return N.INVALID_ARGUMENT;case Re.NOT_FOUND:return N.NOT_FOUND;case Re.ALREADY_EXISTS:return N.ALREADY_EXISTS;case Re.PERMISSION_DENIED:return N.PERMISSION_DENIED;case Re.FAILED_PRECONDITION:return N.FAILED_PRECONDITION;case Re.ABORTED:return N.ABORTED;case Re.OUT_OF_RANGE:return N.OUT_OF_RANGE;case Re.UNIMPLEMENTED:return N.UNIMPLEMENTED;case Re.DATA_LOSS:return N.DATA_LOSS;default:return W()}}(ne=Re||(Re={}))[ne.OK=0]="OK",ne[ne.CANCELLED=1]="CANCELLED",ne[ne.UNKNOWN=2]="UNKNOWN",ne[ne.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",ne[ne.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",ne[ne.NOT_FOUND=5]="NOT_FOUND",ne[ne.ALREADY_EXISTS=6]="ALREADY_EXISTS",ne[ne.PERMISSION_DENIED=7]="PERMISSION_DENIED",ne[ne.UNAUTHENTICATED=16]="UNAUTHENTICATED",ne[ne.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",ne[ne.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",ne[ne.ABORTED=10]="ABORTED",ne[ne.OUT_OF_RANGE=11]="OUT_OF_RANGE",ne[ne.UNIMPLEMENTED=12]="UNIMPLEMENTED",ne[ne.INTERNAL=13]="INTERNAL",ne[ne.UNAVAILABLE=14]="UNAVAILABLE",ne[ne.DATA_LOSS=15]="DATA_LOSS";/**
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
 */function g_(){return new TextEncoder}/**
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
 */const y_=new ns([4294967295,4294967295],0);function Zu(n){const e=g_().encode(n),t=new Sh;return t.update(e),new Uint8Array(t.digest())}function ed(n){const e=new DataView(n.buffer),t=e.getUint32(0,!0),s=e.getUint32(4,!0),r=e.getUint32(8,!0),i=e.getUint32(12,!0);return[new ns([t,s],0),new ns([r,i],0)]}class Vl{constructor(e,t,s){if(this.bitmap=e,this.padding=t,this.hashCount=s,t<0||t>=8)throw new Rr(`Invalid padding: ${t}`);if(s<0)throw new Rr(`Invalid hash count: ${s}`);if(e.length>0&&this.hashCount===0)throw new Rr(`Invalid hash count: ${s}`);if(e.length===0&&t!==0)throw new Rr(`Invalid padding when bitmap length is 0: ${t}`);this.Ie=8*e.length-t,this.Te=ns.fromNumber(this.Ie)}Ee(e,t,s){let r=e.add(t.multiply(ns.fromNumber(s)));return r.compare(y_)===1&&(r=new ns([r.getBits(0),r.getBits(1)],0)),r.modulo(this.Te).toNumber()}de(e){return(this.bitmap[Math.floor(e/8)]&1<<e%8)!=0}mightContain(e){if(this.Ie===0)return!1;const t=Zu(e),[s,r]=ed(t);for(let i=0;i<this.hashCount;i++){const a=this.Ee(s,r,i);if(!this.de(a))return!1}return!0}static create(e,t,s){const r=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),a=new Vl(i,r,t);return s.forEach(l=>a.insert(l)),a}insert(e){if(this.Ie===0)return;const t=Zu(e),[s,r]=ed(t);for(let i=0;i<this.hashCount;i++){const a=this.Ee(s,r,i);this.Ae(a)}}Ae(e){const t=Math.floor(e/8),s=e%8;this.bitmap[t]|=1<<s}}class Rr extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Co{constructor(e,t,s,r,i){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=s,this.documentUpdates=r,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(e,t,s){const r=new Map;return r.set(e,ai.createSynthesizedTargetChangeForCurrentChange(e,t,s)),new Co(G.min(),r,new Ee(ie),ln(),ee())}}class ai{constructor(e,t,s,r,i){this.resumeToken=e,this.current=t,this.addedDocuments=s,this.modifiedDocuments=r,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,t,s){return new ai(s,t,ee(),ee(),ee())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qi{constructor(e,t,s,r){this.Re=e,this.removedTargetIds=t,this.key=s,this.Ve=r}}class tf{constructor(e,t){this.targetId=e,this.me=t}}class nf{constructor(e,t,s=We.EMPTY_BYTE_STRING,r=null){this.state=e,this.targetIds=t,this.resumeToken=s,this.cause=r}}class td{constructor(){this.fe=0,this.ge=sd(),this.pe=We.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return this.fe!==0}get be(){return this.we}De(e){e.approximateByteSize()>0&&(this.we=!0,this.pe=e)}ve(){let e=ee(),t=ee(),s=ee();return this.ge.forEach((r,i)=>{switch(i){case 0:e=e.add(r);break;case 2:t=t.add(r);break;case 1:s=s.add(r);break;default:W()}}),new ai(this.pe,this.ye,e,t,s)}Ce(){this.we=!1,this.ge=sd()}Fe(e,t){this.we=!0,this.ge=this.ge.insert(e,t)}Me(e){this.we=!0,this.ge=this.ge.remove(e)}xe(){this.fe+=1}Oe(){this.fe-=1,ae(this.fe>=0)}Ne(){this.we=!0,this.ye=!0}}class v_{constructor(e){this.Le=e,this.Be=new Map,this.ke=ln(),this.qe=nd(),this.Qe=new Ee(ie)}Ke(e){for(const t of e.Re)e.Ve&&e.Ve.isFoundDocument()?this.$e(t,e.Ve):this.Ue(t,e.key,e.Ve);for(const t of e.removedTargetIds)this.Ue(t,e.key,e.Ve)}We(e){this.forEachTarget(e,t=>{const s=this.Ge(t);switch(e.state){case 0:this.ze(t)&&s.De(e.resumeToken);break;case 1:s.Oe(),s.Se||s.Ce(),s.De(e.resumeToken);break;case 2:s.Oe(),s.Se||this.removeTarget(t);break;case 3:this.ze(t)&&(s.Ne(),s.De(e.resumeToken));break;case 4:this.ze(t)&&(this.je(t),s.De(e.resumeToken));break;default:W()}})}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Be.forEach((s,r)=>{this.ze(r)&&t(r)})}He(e){const t=e.targetId,s=e.me.count,r=this.Je(t);if(r){const i=r.target;if(Ya(i))if(s===0){const a=new q(i.path);this.Ue(t,a,Xe.newNoDocument(a,G.min()))}else ae(s===1);else{const a=this.Ye(t);if(a!==s){const l=this.Ze(e),c=l?this.Xe(l,e,a):1;if(c!==0){this.je(t);const d=c===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Qe=this.Qe.insert(t,d)}}}}}Ze(e){const t=e.me.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:s="",padding:r=0},hashCount:i=0}=t;let a,l;try{a=ls(s).toUint8Array()}catch(c){if(c instanceof Nh)return $s("Decoding the base64 bloom filter in existence filter failed ("+c.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw c}try{l=new Vl(a,r,i)}catch(c){return $s(c instanceof Rr?"BloomFilter error: ":"Applying bloom filter failed: ",c),null}return l.Ie===0?null:l}Xe(e,t,s){return t.me.count===s-this.nt(e,t.targetId)?0:2}nt(e,t){const s=this.Le.getRemoteKeysForTarget(t);let r=0;return s.forEach(i=>{const a=this.Le.tt(),l=`projects/${a.projectId}/databases/${a.database}/documents/${i.path.canonicalString()}`;e.mightContain(l)||(this.Ue(t,i,null),r++)}),r}rt(e){const t=new Map;this.Be.forEach((i,a)=>{const l=this.Je(a);if(l){if(i.current&&Ya(l.target)){const c=new q(l.target.path);this.ke.get(c)!==null||this.it(a,c)||this.Ue(a,c,Xe.newNoDocument(c,e))}i.be&&(t.set(a,i.ve()),i.Ce())}});let s=ee();this.qe.forEach((i,a)=>{let l=!0;a.forEachWhile(c=>{const d=this.Je(c);return!d||d.purpose==="TargetPurposeLimboResolution"||(l=!1,!1)}),l&&(s=s.add(i))}),this.ke.forEach((i,a)=>a.setReadTime(e));const r=new Co(e,t,this.Qe,this.ke,s);return this.ke=ln(),this.qe=nd(),this.Qe=new Ee(ie),r}$e(e,t){if(!this.ze(e))return;const s=this.it(e,t.key)?2:0;this.Ge(e).Fe(t.key,s),this.ke=this.ke.insert(t.key,t),this.qe=this.qe.insert(t.key,this.st(t.key).add(e))}Ue(e,t,s){if(!this.ze(e))return;const r=this.Ge(e);this.it(e,t)?r.Fe(t,1):r.Me(t),this.qe=this.qe.insert(t,this.st(t).delete(e)),s&&(this.ke=this.ke.insert(t,s))}removeTarget(e){this.Be.delete(e)}Ye(e){const t=this.Ge(e).ve();return this.Le.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}xe(e){this.Ge(e).xe()}Ge(e){let t=this.Be.get(e);return t||(t=new td,this.Be.set(e,t)),t}st(e){let t=this.qe.get(e);return t||(t=new je(ie),this.qe=this.qe.insert(e,t)),t}ze(e){const t=this.Je(e)!==null;return t||U("WatchChangeAggregator","Detected inactive target",e),t}Je(e){const t=this.Be.get(e);return t&&t.Se?null:this.Le.ot(e)}je(e){this.Be.set(e,new td),this.Le.getRemoteKeysForTarget(e).forEach(t=>{this.Ue(e,t,null)})}it(e,t){return this.Le.getRemoteKeysForTarget(e).has(t)}}function nd(){return new Ee(q.comparator)}function sd(){return new Ee(q.comparator)}const __={asc:"ASCENDING",desc:"DESCENDING"},w_={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},b_={and:"AND",or:"OR"};class E_{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function Ka(n,e){return n.useProto3Json||To(e)?e:{value:e}}function lo(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function sf(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function T_(n,e){return lo(n,e.toTimestamp())}function zt(n){return ae(!!n),G.fromTimestamp(function(t){const s=Bn(t);return new Le(s.seconds,s.nanos)}(n))}function Bl(n,e){return Qa(n,e).canonicalString()}function Qa(n,e){const t=function(r){return new we(["projects",r.projectId,"databases",r.database])}(n).child("documents");return e===void 0?t:t.child(e)}function rf(n){const e=we.fromString(n);return ae(uf(e)),e}function Ja(n,e){return Bl(n.databaseId,e.path)}function Ia(n,e){const t=rf(e);if(t.get(1)!==n.databaseId.projectId)throw new $(N.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new $(N.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new q(af(t))}function of(n,e){return Bl(n.databaseId,e)}function I_(n){const e=rf(n);return e.length===4?we.emptyPath():af(e)}function Xa(n){return new we(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function af(n){return ae(n.length>4&&n.get(4)==="documents"),n.popFirst(5)}function rd(n,e,t){return{name:Ja(n,e),fields:t.value.mapValue.fields}}function S_(n,e){let t;if("targetChange"in e){e.targetChange;const s=function(d){return d==="NO_CHANGE"?0:d==="ADD"?1:d==="REMOVE"?2:d==="CURRENT"?3:d==="RESET"?4:W()}(e.targetChange.targetChangeType||"NO_CHANGE"),r=e.targetChange.targetIds||[],i=function(d,f){return d.useProto3Json?(ae(f===void 0||typeof f=="string"),We.fromBase64String(f||"")):(ae(f===void 0||f instanceof Buffer||f instanceof Uint8Array),We.fromUint8Array(f||new Uint8Array))}(n,e.targetChange.resumeToken),a=e.targetChange.cause,l=a&&function(d){const f=d.code===void 0?N.UNKNOWN:ef(d.code);return new $(f,d.message||"")}(a);t=new nf(s,r,i,l||null)}else if("documentChange"in e){e.documentChange;const s=e.documentChange;s.document,s.document.name,s.document.updateTime;const r=Ia(n,s.document.name),i=zt(s.document.updateTime),a=s.document.createTime?zt(s.document.createTime):G.min(),l=new ct({mapValue:{fields:s.document.fields}}),c=Xe.newFoundDocument(r,i,a,l),d=s.targetIds||[],f=s.removedTargetIds||[];t=new qi(d,f,c.key,c)}else if("documentDelete"in e){e.documentDelete;const s=e.documentDelete;s.document;const r=Ia(n,s.document),i=s.readTime?zt(s.readTime):G.min(),a=Xe.newNoDocument(r,i),l=s.removedTargetIds||[];t=new qi([],l,a.key,a)}else if("documentRemove"in e){e.documentRemove;const s=e.documentRemove;s.document;const r=Ia(n,s.document),i=s.removedTargetIds||[];t=new qi([],i,r,null)}else{if(!("filter"in e))return W();{e.filter;const s=e.filter;s.targetId;const{count:r=0,unchangedNames:i}=s,a=new p_(r,i),l=s.targetId;t=new tf(l,a)}}return t}function x_(n,e){let t;if(e instanceof oi)t={update:rd(n,e.key,e.value)};else if(e instanceof Po)t={delete:Ja(n,e.key)};else if(e instanceof Un)t={update:rd(n,e.key,e.data),updateMask:L_(e.fieldMask)};else{if(!(e instanceof d_))return W();t={verify:Ja(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map(s=>function(i,a){const l=a.transform;if(l instanceof oo)return{fieldPath:a.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(l instanceof jr)return{fieldPath:a.field.canonicalString(),appendMissingElements:{values:l.elements}};if(l instanceof Wr)return{fieldPath:a.field.canonicalString(),removeAllFromArray:{values:l.elements}};if(l instanceof ao)return{fieldPath:a.field.canonicalString(),increment:l.Pe};throw W()}(0,s))),e.precondition.isNone||(t.currentDocument=function(r,i){return i.updateTime!==void 0?{updateTime:T_(r,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:W()}(n,e.precondition)),t}function A_(n,e){return n&&n.length>0?(ae(e!==void 0),n.map(t=>function(r,i){let a=r.updateTime?zt(r.updateTime):zt(i);return a.isEqual(G.min())&&(a=zt(i)),new l_(a,r.transformResults||[])}(t,e))):[]}function R_(n,e){return{documents:[of(n,e.path)]}}function P_(n,e){const t={structuredQuery:{}},s=e.path;let r;e.collectionGroup!==null?(r=s,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(r=s.popLast(),t.structuredQuery.from=[{collectionId:s.lastSegment()}]),t.parent=of(n,r);const i=function(d){if(d.length!==0)return cf($t.create(d,"and"))}(e.filters);i&&(t.structuredQuery.where=i);const a=function(d){if(d.length!==0)return d.map(f=>function(_){return{field:Ps(_.field),direction:M_(_.dir)}}(f))}(e.orderBy);a&&(t.structuredQuery.orderBy=a);const l=Ka(n,e.limit);return l!==null&&(t.structuredQuery.limit=l),e.startAt&&(t.structuredQuery.startAt=function(d){return{before:d.inclusive,values:d.position}}(e.startAt)),e.endAt&&(t.structuredQuery.endAt=function(d){return{before:!d.inclusive,values:d.position}}(e.endAt)),{_t:t,parent:r}}function C_(n){let e=I_(n.parent);const t=n.structuredQuery,s=t.from?t.from.length:0;let r=null;if(s>0){ae(s===1);const f=t.from[0];f.allDescendants?r=f.collectionId:e=e.child(f.collectionId)}let i=[];t.where&&(i=function(m){const _=lf(m);return _ instanceof $t&&Bh(_)?_.getFilters():[_]}(t.where));let a=[];t.orderBy&&(a=function(m){return m.map(_=>function(T){return new io(Cs(T.field),function(x){switch(x){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(T.direction))}(_))}(t.orderBy));let l=null;t.limit&&(l=function(m){let _;return _=typeof m=="object"?m.value:m,To(_)?null:_}(t.limit));let c=null;t.startAt&&(c=function(m){const _=!!m.before,w=m.values||[];return new ro(w,_)}(t.startAt));let d=null;return t.endAt&&(d=function(m){const _=!m.before,w=m.values||[];return new ro(w,_)}(t.endAt)),G0(e,r,a,i,l,"F",c,d)}function k_(n,e){const t=function(r){switch(r){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return W()}}(e.purpose);return t==null?null:{"goog-listen-tags":t}}function lf(n){return n.unaryFilter!==void 0?function(t){switch(t.unaryFilter.op){case"IS_NAN":const s=Cs(t.unaryFilter.field);return Ne.create(s,"==",{doubleValue:NaN});case"IS_NULL":const r=Cs(t.unaryFilter.field);return Ne.create(r,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=Cs(t.unaryFilter.field);return Ne.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const a=Cs(t.unaryFilter.field);return Ne.create(a,"!=",{nullValue:"NULL_VALUE"});default:return W()}}(n):n.fieldFilter!==void 0?function(t){return Ne.create(Cs(t.fieldFilter.field),function(r){switch(r){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return W()}}(t.fieldFilter.op),t.fieldFilter.value)}(n):n.compositeFilter!==void 0?function(t){return $t.create(t.compositeFilter.filters.map(s=>lf(s)),function(r){switch(r){case"AND":return"and";case"OR":return"or";default:return W()}}(t.compositeFilter.op))}(n):W()}function M_(n){return __[n]}function D_(n){return w_[n]}function N_(n){return b_[n]}function Ps(n){return{fieldPath:n.canonicalString()}}function Cs(n){return He.fromServerFormat(n.fieldPath)}function cf(n){return n instanceof Ne?function(t){if(t.op==="=="){if(Hu(t.value))return{unaryFilter:{field:Ps(t.field),op:"IS_NAN"}};if(qu(t.value))return{unaryFilter:{field:Ps(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(Hu(t.value))return{unaryFilter:{field:Ps(t.field),op:"IS_NOT_NAN"}};if(qu(t.value))return{unaryFilter:{field:Ps(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Ps(t.field),op:D_(t.op),value:t.value}}}(n):n instanceof $t?function(t){const s=t.getFilters().map(r=>cf(r));return s.length===1?s[0]:{compositeFilter:{op:N_(t.op),filters:s}}}(n):W()}function L_(n){const e=[];return n.fields.forEach(t=>e.push(t.canonicalString())),{fieldPaths:e}}function uf(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class An{constructor(e,t,s,r,i=G.min(),a=G.min(),l=We.EMPTY_BYTE_STRING,c=null){this.target=e,this.targetId=t,this.purpose=s,this.sequenceNumber=r,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=a,this.resumeToken=l,this.expectedCount=c}withSequenceNumber(e){return new An(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new An(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new An(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new An(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class O_{constructor(e){this.ct=e}}function V_(n){const e=C_({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?Ga(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class B_{constructor(){this.un=new F_}addToCollectionParentIndex(e,t){return this.un.add(t),L.resolve()}getCollectionParents(e,t){return L.resolve(this.un.getEntries(t))}addFieldIndex(e,t){return L.resolve()}deleteFieldIndex(e,t){return L.resolve()}deleteAllFieldIndexes(e){return L.resolve()}createTargetIndexes(e,t){return L.resolve()}getDocumentsMatchingTarget(e,t){return L.resolve(null)}getIndexType(e,t){return L.resolve(0)}getFieldIndexes(e,t){return L.resolve([])}getNextCollectionGroupToUpdate(e){return L.resolve(null)}getMinOffset(e,t){return L.resolve(Vn.min())}getMinOffsetFromCollectionGroup(e,t){return L.resolve(Vn.min())}updateCollectionGroup(e,t,s){return L.resolve()}updateIndexEntries(e,t){return L.resolve()}}class F_{constructor(){this.index={}}add(e){const t=e.lastSegment(),s=e.popLast(),r=this.index[t]||new je(we.comparator),i=!r.has(s);return this.index[t]=r.add(s),i}has(e){const t=e.lastSegment(),s=e.popLast(),r=this.index[t];return r&&r.has(s)}getEntries(e){return(this.index[e]||new je(we.comparator)).toArray()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ws{constructor(e){this.Ln=e}next(){return this.Ln+=2,this.Ln}static Bn(){return new Ws(0)}static kn(){return new Ws(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class z_{constructor(){this.changes=new er(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,Xe.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const s=this.changes.get(t);return s!==void 0?L.resolve(s):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class U_{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $_{constructor(e,t,s,r){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=s,this.indexManager=r}getDocument(e,t){let s=null;return this.documentOverlayCache.getOverlay(e,t).next(r=>(s=r,this.remoteDocumentCache.getEntry(e,t))).next(r=>(s!==null&&Lr(s.mutation,r,gt.empty(),Le.now()),r))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(s=>this.getLocalViewOfDocuments(e,s,ee()).next(()=>s))}getLocalViewOfDocuments(e,t,s=ee()){const r=es();return this.populateOverlays(e,r,t).next(()=>this.computeViews(e,t,r,s).next(i=>{let a=Ar();return i.forEach((l,c)=>{a=a.insert(l,c.overlayedDocument)}),a}))}getOverlayedDocuments(e,t){const s=es();return this.populateOverlays(e,s,t).next(()=>this.computeViews(e,t,s,ee()))}populateOverlays(e,t,s){const r=[];return s.forEach(i=>{t.has(i)||r.push(i)}),this.documentOverlayCache.getOverlays(e,r).next(i=>{i.forEach((a,l)=>{t.set(a,l)})})}computeViews(e,t,s,r){let i=ln();const a=Nr(),l=function(){return Nr()}();return t.forEach((c,d)=>{const f=s.get(d.key);r.has(d.key)&&(f===void 0||f.mutation instanceof Un)?i=i.insert(d.key,d):f!==void 0?(a.set(d.key,f.mutation.getFieldMask()),Lr(f.mutation,d,f.mutation.getFieldMask(),Le.now())):a.set(d.key,gt.empty())}),this.recalculateAndSaveOverlays(e,i).next(c=>(c.forEach((d,f)=>a.set(d,f)),t.forEach((d,f)=>{var m;return l.set(d,new U_(f,(m=a.get(d))!==null&&m!==void 0?m:null))}),l))}recalculateAndSaveOverlays(e,t){const s=Nr();let r=new Ee((a,l)=>a-l),i=ee();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(a=>{for(const l of a)l.keys().forEach(c=>{const d=t.get(c);if(d===null)return;let f=s.get(c)||gt.empty();f=l.applyToLocalView(d,f),s.set(c,f);const m=(r.get(l.batchId)||ee()).add(c);r=r.insert(l.batchId,m)})}).next(()=>{const a=[],l=r.getReverseIterator();for(;l.hasNext();){const c=l.getNext(),d=c.key,f=c.value,m=Wh();f.forEach(_=>{if(!i.has(_)){const w=Xh(t.get(_),s.get(_));w!==null&&m.set(_,w),i=i.add(_)}}),a.push(this.documentOverlayCache.saveOverlays(e,d,m))}return L.waitFor(a)}).next(()=>s)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(s=>this.recalculateAndSaveOverlays(e,s))}getDocumentsMatchingQuery(e,t,s,r){return function(a){return q.isDocumentKey(a.path)&&a.collectionGroup===null&&a.filters.length===0}(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):K0(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,s,r):this.getDocumentsMatchingCollectionQuery(e,t,s,r)}getNextDocuments(e,t,s,r){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,s,r).next(i=>{const a=r-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,s.largestBatchId,r-i.size):L.resolve(es());let l=-1,c=i;return a.next(d=>L.forEach(d,(f,m)=>(l<m.largestBatchId&&(l=m.largestBatchId),i.get(f)?L.resolve():this.remoteDocumentCache.getEntry(e,f).next(_=>{c=c.insert(f,_)}))).next(()=>this.populateOverlays(e,d,i)).next(()=>this.computeViews(e,c,d,ee())).next(f=>({batchId:l,changes:jh(f)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new q(t)).next(s=>{let r=Ar();return s.isFoundDocument()&&(r=r.insert(s.key,s)),r})}getDocumentsMatchingCollectionGroupQuery(e,t,s,r){const i=t.collectionGroup;let a=Ar();return this.indexManager.getCollectionParents(e,i).next(l=>L.forEach(l,c=>{const d=function(m,_){return new Io(_,null,m.explicitOrderBy.slice(),m.filters.slice(),m.limit,m.limitType,m.startAt,m.endAt)}(t,c.child(i));return this.getDocumentsMatchingCollectionQuery(e,d,s,r).next(f=>{f.forEach((m,_)=>{a=a.insert(m,_)})})}).next(()=>a))}getDocumentsMatchingCollectionQuery(e,t,s,r){let i;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,s.largestBatchId).next(a=>(i=a,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,s,i,r))).next(a=>{i.forEach((c,d)=>{const f=d.getKey();a.get(f)===null&&(a=a.insert(f,Xe.newInvalidDocument(f)))});let l=Ar();return a.forEach((c,d)=>{const f=i.get(c);f!==void 0&&Lr(f.mutation,d,gt.empty(),Le.now()),xo(t,d)&&(l=l.insert(c,d))}),l})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class q_{constructor(e){this.serializer=e,this.hr=new Map,this.Pr=new Map}getBundleMetadata(e,t){return L.resolve(this.hr.get(t))}saveBundleMetadata(e,t){return this.hr.set(t.id,function(r){return{id:r.id,version:r.version,createTime:zt(r.createTime)}}(t)),L.resolve()}getNamedQuery(e,t){return L.resolve(this.Pr.get(t))}saveNamedQuery(e,t){return this.Pr.set(t.name,function(r){return{name:r.name,query:V_(r.bundledQuery),readTime:zt(r.readTime)}}(t)),L.resolve()}}/**
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
 */class H_{constructor(){this.overlays=new Ee(q.comparator),this.Ir=new Map}getOverlay(e,t){return L.resolve(this.overlays.get(t))}getOverlays(e,t){const s=es();return L.forEach(t,r=>this.getOverlay(e,r).next(i=>{i!==null&&s.set(r,i)})).next(()=>s)}saveOverlays(e,t,s){return s.forEach((r,i)=>{this.ht(e,t,i)}),L.resolve()}removeOverlaysForBatchId(e,t,s){const r=this.Ir.get(s);return r!==void 0&&(r.forEach(i=>this.overlays=this.overlays.remove(i)),this.Ir.delete(s)),L.resolve()}getOverlaysForCollection(e,t,s){const r=es(),i=t.length+1,a=new q(t.child("")),l=this.overlays.getIteratorFrom(a);for(;l.hasNext();){const c=l.getNext().value,d=c.getKey();if(!t.isPrefixOf(d.path))break;d.path.length===i&&c.largestBatchId>s&&r.set(c.getKey(),c)}return L.resolve(r)}getOverlaysForCollectionGroup(e,t,s,r){let i=new Ee((d,f)=>d-f);const a=this.overlays.getIterator();for(;a.hasNext();){const d=a.getNext().value;if(d.getKey().getCollectionGroup()===t&&d.largestBatchId>s){let f=i.get(d.largestBatchId);f===null&&(f=es(),i=i.insert(d.largestBatchId,f)),f.set(d.getKey(),d)}}const l=es(),c=i.getIterator();for(;c.hasNext()&&(c.getNext().value.forEach((d,f)=>l.set(d,f)),!(l.size()>=r)););return L.resolve(l)}ht(e,t,s){const r=this.overlays.get(s.key);if(r!==null){const a=this.Ir.get(r.largestBatchId).delete(s.key);this.Ir.set(r.largestBatchId,a)}this.overlays=this.overlays.insert(s.key,new f_(t,s));let i=this.Ir.get(t);i===void 0&&(i=ee(),this.Ir.set(t,i)),this.Ir.set(t,i.add(s.key))}}/**
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
 */class j_{constructor(){this.sessionToken=We.EMPTY_BYTE_STRING}getSessionToken(e){return L.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,L.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fl{constructor(){this.Tr=new je(Be.Er),this.dr=new je(Be.Ar)}isEmpty(){return this.Tr.isEmpty()}addReference(e,t){const s=new Be(e,t);this.Tr=this.Tr.add(s),this.dr=this.dr.add(s)}Rr(e,t){e.forEach(s=>this.addReference(s,t))}removeReference(e,t){this.Vr(new Be(e,t))}mr(e,t){e.forEach(s=>this.removeReference(s,t))}gr(e){const t=new q(new we([])),s=new Be(t,e),r=new Be(t,e+1),i=[];return this.dr.forEachInRange([s,r],a=>{this.Vr(a),i.push(a.key)}),i}pr(){this.Tr.forEach(e=>this.Vr(e))}Vr(e){this.Tr=this.Tr.delete(e),this.dr=this.dr.delete(e)}yr(e){const t=new q(new we([])),s=new Be(t,e),r=new Be(t,e+1);let i=ee();return this.dr.forEachInRange([s,r],a=>{i=i.add(a.key)}),i}containsKey(e){const t=new Be(e,0),s=this.Tr.firstAfterOrEqual(t);return s!==null&&e.isEqual(s.key)}}class Be{constructor(e,t){this.key=e,this.wr=t}static Er(e,t){return q.comparator(e.key,t.key)||ie(e.wr,t.wr)}static Ar(e,t){return ie(e.wr,t.wr)||q.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class W_{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Sr=1,this.br=new je(Be.Er)}checkEmpty(e){return L.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,s,r){const i=this.Sr;this.Sr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const a=new h_(i,t,s,r);this.mutationQueue.push(a);for(const l of r)this.br=this.br.add(new Be(l.key,i)),this.indexManager.addToCollectionParentIndex(e,l.key.path.popLast());return L.resolve(a)}lookupMutationBatch(e,t){return L.resolve(this.Dr(t))}getNextMutationBatchAfterBatchId(e,t){const s=t+1,r=this.vr(s),i=r<0?0:r;return L.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return L.resolve(this.mutationQueue.length===0?-1:this.Sr-1)}getAllMutationBatches(e){return L.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const s=new Be(t,0),r=new Be(t,Number.POSITIVE_INFINITY),i=[];return this.br.forEachInRange([s,r],a=>{const l=this.Dr(a.wr);i.push(l)}),L.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let s=new je(ie);return t.forEach(r=>{const i=new Be(r,0),a=new Be(r,Number.POSITIVE_INFINITY);this.br.forEachInRange([i,a],l=>{s=s.add(l.wr)})}),L.resolve(this.Cr(s))}getAllMutationBatchesAffectingQuery(e,t){const s=t.path,r=s.length+1;let i=s;q.isDocumentKey(i)||(i=i.child(""));const a=new Be(new q(i),0);let l=new je(ie);return this.br.forEachWhile(c=>{const d=c.key.path;return!!s.isPrefixOf(d)&&(d.length===r&&(l=l.add(c.wr)),!0)},a),L.resolve(this.Cr(l))}Cr(e){const t=[];return e.forEach(s=>{const r=this.Dr(s);r!==null&&t.push(r)}),t}removeMutationBatch(e,t){ae(this.Fr(t.batchId,"removed")===0),this.mutationQueue.shift();let s=this.br;return L.forEach(t.mutations,r=>{const i=new Be(r.key,t.batchId);return s=s.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,r.key)}).next(()=>{this.br=s})}On(e){}containsKey(e,t){const s=new Be(t,0),r=this.br.firstAfterOrEqual(s);return L.resolve(t.isEqual(r&&r.key))}performConsistencyCheck(e){return this.mutationQueue.length,L.resolve()}Fr(e,t){return this.vr(e)}vr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Dr(e){const t=this.vr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Y_{constructor(e){this.Mr=e,this.docs=function(){return new Ee(q.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const s=t.key,r=this.docs.get(s),i=r?r.size:0,a=this.Mr(t);return this.docs=this.docs.insert(s,{document:t.mutableCopy(),size:a}),this.size+=a-i,this.indexManager.addToCollectionParentIndex(e,s.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const s=this.docs.get(t);return L.resolve(s?s.document.mutableCopy():Xe.newInvalidDocument(t))}getEntries(e,t){let s=ln();return t.forEach(r=>{const i=this.docs.get(r);s=s.insert(r,i?i.document.mutableCopy():Xe.newInvalidDocument(r))}),L.resolve(s)}getDocumentsMatchingQuery(e,t,s,r){let i=ln();const a=t.path,l=new q(a.child("")),c=this.docs.getIteratorFrom(l);for(;c.hasNext();){const{key:d,value:{document:f}}=c.getNext();if(!a.isPrefixOf(d.path))break;d.path.length>a.length+1||P0(R0(f),s)<=0||(r.has(f.key)||xo(t,f))&&(i=i.insert(f.key,f.mutableCopy()))}return L.resolve(i)}getAllFromCollectionGroup(e,t,s,r){W()}Or(e,t){return L.forEach(this.docs,s=>t(s))}newChangeBuffer(e){return new G_(this)}getSize(e){return L.resolve(this.size)}}class G_ extends z_{constructor(e){super(),this.cr=e}applyChanges(e){const t=[];return this.changes.forEach((s,r)=>{r.isValidDocument()?t.push(this.cr.addEntry(e,r)):this.cr.removeEntry(s)}),L.waitFor(t)}getFromCache(e,t){return this.cr.getEntry(e,t)}getAllFromCache(e,t){return this.cr.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class K_{constructor(e){this.persistence=e,this.Nr=new er(t=>Ml(t),Dl),this.lastRemoteSnapshotVersion=G.min(),this.highestTargetId=0,this.Lr=0,this.Br=new Fl,this.targetCount=0,this.kr=Ws.Bn()}forEachTarget(e,t){return this.Nr.forEach((s,r)=>t(r)),L.resolve()}getLastRemoteSnapshotVersion(e){return L.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return L.resolve(this.Lr)}allocateTargetId(e){return this.highestTargetId=this.kr.next(),L.resolve(this.highestTargetId)}setTargetsMetadata(e,t,s){return s&&(this.lastRemoteSnapshotVersion=s),t>this.Lr&&(this.Lr=t),L.resolve()}Kn(e){this.Nr.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.kr=new Ws(t),this.highestTargetId=t),e.sequenceNumber>this.Lr&&(this.Lr=e.sequenceNumber)}addTargetData(e,t){return this.Kn(t),this.targetCount+=1,L.resolve()}updateTargetData(e,t){return this.Kn(t),L.resolve()}removeTargetData(e,t){return this.Nr.delete(t.target),this.Br.gr(t.targetId),this.targetCount-=1,L.resolve()}removeTargets(e,t,s){let r=0;const i=[];return this.Nr.forEach((a,l)=>{l.sequenceNumber<=t&&s.get(l.targetId)===null&&(this.Nr.delete(a),i.push(this.removeMatchingKeysForTargetId(e,l.targetId)),r++)}),L.waitFor(i).next(()=>r)}getTargetCount(e){return L.resolve(this.targetCount)}getTargetData(e,t){const s=this.Nr.get(t)||null;return L.resolve(s)}addMatchingKeys(e,t,s){return this.Br.Rr(t,s),L.resolve()}removeMatchingKeys(e,t,s){this.Br.mr(t,s);const r=this.persistence.referenceDelegate,i=[];return r&&t.forEach(a=>{i.push(r.markPotentiallyOrphaned(e,a))}),L.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this.Br.gr(t),L.resolve()}getMatchingKeysForTargetId(e,t){const s=this.Br.yr(t);return L.resolve(s)}containsKey(e,t){return L.resolve(this.Br.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Q_{constructor(e,t){this.qr={},this.overlays={},this.Qr=new Rl(0),this.Kr=!1,this.Kr=!0,this.$r=new j_,this.referenceDelegate=e(this),this.Ur=new K_(this),this.indexManager=new B_,this.remoteDocumentCache=function(r){return new Y_(r)}(s=>this.referenceDelegate.Wr(s)),this.serializer=new O_(t),this.Gr=new q_(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Kr=!1,Promise.resolve()}get started(){return this.Kr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new H_,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let s=this.qr[e.toKey()];return s||(s=new W_(t,this.referenceDelegate),this.qr[e.toKey()]=s),s}getGlobalsCache(){return this.$r}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Gr}runTransaction(e,t,s){U("MemoryPersistence","Starting transaction:",e);const r=new J_(this.Qr.next());return this.referenceDelegate.zr(),s(r).next(i=>this.referenceDelegate.jr(r).next(()=>i)).toPromise().then(i=>(r.raiseOnCommittedEvent(),i))}Hr(e,t){return L.or(Object.values(this.qr).map(s=>()=>s.containsKey(e,t)))}}class J_ extends k0{constructor(e){super(),this.currentSequenceNumber=e}}class zl{constructor(e){this.persistence=e,this.Jr=new Fl,this.Yr=null}static Zr(e){return new zl(e)}get Xr(){if(this.Yr)return this.Yr;throw W()}addReference(e,t,s){return this.Jr.addReference(s,t),this.Xr.delete(s.toString()),L.resolve()}removeReference(e,t,s){return this.Jr.removeReference(s,t),this.Xr.add(s.toString()),L.resolve()}markPotentiallyOrphaned(e,t){return this.Xr.add(t.toString()),L.resolve()}removeTarget(e,t){this.Jr.gr(t.targetId).forEach(r=>this.Xr.add(r.toString()));const s=this.persistence.getTargetCache();return s.getMatchingKeysForTargetId(e,t.targetId).next(r=>{r.forEach(i=>this.Xr.add(i.toString()))}).next(()=>s.removeTargetData(e,t))}zr(){this.Yr=new Set}jr(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return L.forEach(this.Xr,s=>{const r=q.fromPath(s);return this.ei(e,r).next(i=>{i||t.removeEntry(r,G.min())})}).next(()=>(this.Yr=null,t.apply(e)))}updateLimboDocument(e,t){return this.ei(e,t).next(s=>{s?this.Xr.delete(t.toString()):this.Xr.add(t.toString())})}Wr(e){return 0}ei(e,t){return L.or([()=>L.resolve(this.Jr.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Hr(e,t)])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ul{constructor(e,t,s,r){this.targetId=e,this.fromCache=t,this.$i=s,this.Ui=r}static Wi(e,t){let s=ee(),r=ee();for(const i of t.docChanges)switch(i.type){case 0:s=s.add(i.doc.key);break;case 1:r=r.add(i.doc.key)}return new Ul(e,t.fromCache,s,r)}}/**
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
 */class X_{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Z_{constructor(){this.Gi=!1,this.zi=!1,this.ji=100,this.Hi=function(){return Nm()?8:M0(Ze())>0?6:4}()}initialize(e,t){this.Ji=e,this.indexManager=t,this.Gi=!0}getDocumentsMatchingQuery(e,t,s,r){const i={result:null};return this.Yi(e,t).next(a=>{i.result=a}).next(()=>{if(!i.result)return this.Zi(e,t,r,s).next(a=>{i.result=a})}).next(()=>{if(i.result)return;const a=new X_;return this.Xi(e,t,a).next(l=>{if(i.result=l,this.zi)return this.es(e,t,a,l.size)})}).next(()=>i.result)}es(e,t,s,r){return s.documentReadCount<this.ji?(Er()<=te.DEBUG&&U("QueryEngine","SDK will not create cache indexes for query:",Rs(t),"since it only creates cache indexes for collection contains","more than or equal to",this.ji,"documents"),L.resolve()):(Er()<=te.DEBUG&&U("QueryEngine","Query:",Rs(t),"scans",s.documentReadCount,"local documents and returns",r,"documents as results."),s.documentReadCount>this.Hi*r?(Er()<=te.DEBUG&&U("QueryEngine","The SDK decides to create cache indexes for query:",Rs(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,Ft(t))):L.resolve())}Yi(e,t){if(Gu(t))return L.resolve(null);let s=Ft(t);return this.indexManager.getIndexType(e,s).next(r=>r===0?null:(t.limit!==null&&r===1&&(t=Ga(t,null,"F"),s=Ft(t)),this.indexManager.getDocumentsMatchingTarget(e,s).next(i=>{const a=ee(...i);return this.Ji.getDocuments(e,a).next(l=>this.indexManager.getMinOffset(e,s).next(c=>{const d=this.ts(t,l);return this.ns(t,d,a,c.readTime)?this.Yi(e,Ga(t,null,"F")):this.rs(e,d,t,c)}))})))}Zi(e,t,s,r){return Gu(t)||r.isEqual(G.min())?L.resolve(null):this.Ji.getDocuments(e,s).next(i=>{const a=this.ts(t,i);return this.ns(t,a,s,r)?L.resolve(null):(Er()<=te.DEBUG&&U("QueryEngine","Re-using previous result from %s to execute query: %s",r.toString(),Rs(t)),this.rs(e,a,t,A0(r,-1)).next(l=>l))})}ts(e,t){let s=new je(qh(e));return t.forEach((r,i)=>{xo(e,i)&&(s=s.add(i))}),s}ns(e,t,s,r){if(e.limit===null)return!1;if(s.size!==t.size)return!0;const i=e.limitType==="F"?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(r)>0)}Xi(e,t,s){return Er()<=te.DEBUG&&U("QueryEngine","Using full collection scan to execute query:",Rs(t)),this.Ji.getDocumentsMatchingQuery(e,t,Vn.min(),s)}rs(e,t,s,r){return this.Ji.getDocumentsMatchingQuery(e,s,r).next(i=>(t.forEach(a=>{i=i.insert(a.key,a)}),i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ew{constructor(e,t,s,r){this.persistence=e,this.ss=t,this.serializer=r,this.os=new Ee(ie),this._s=new er(i=>Ml(i),Dl),this.us=new Map,this.cs=e.getRemoteDocumentCache(),this.Ur=e.getTargetCache(),this.Gr=e.getBundleCache(),this.ls(s)}ls(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new $_(this.cs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.cs.setIndexManager(this.indexManager),this.ss.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.os))}}function tw(n,e,t,s){return new ew(n,e,t,s)}async function df(n,e){const t=K(n);return await t.persistence.runTransaction("Handle user change","readonly",s=>{let r;return t.mutationQueue.getAllMutationBatches(s).next(i=>(r=i,t.ls(e),t.mutationQueue.getAllMutationBatches(s))).next(i=>{const a=[],l=[];let c=ee();for(const d of r){a.push(d.batchId);for(const f of d.mutations)c=c.add(f.key)}for(const d of i){l.push(d.batchId);for(const f of d.mutations)c=c.add(f.key)}return t.localDocuments.getDocuments(s,c).next(d=>({hs:d,removedBatchIds:a,addedBatchIds:l}))})})}function nw(n,e){const t=K(n);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",s=>{const r=e.batch.keys(),i=t.cs.newChangeBuffer({trackRemovals:!0});return function(l,c,d,f){const m=d.batch,_=m.keys();let w=L.resolve();return _.forEach(T=>{w=w.next(()=>f.getEntry(c,T)).next(C=>{const x=d.docVersions.get(T);ae(x!==null),C.version.compareTo(x)<0&&(m.applyToRemoteDocument(C,d),C.isValidDocument()&&(C.setReadTime(d.commitVersion),f.addEntry(C)))})}),w.next(()=>l.mutationQueue.removeMutationBatch(c,m))}(t,s,e,i).next(()=>i.apply(s)).next(()=>t.mutationQueue.performConsistencyCheck(s)).next(()=>t.documentOverlayCache.removeOverlaysForBatchId(s,r,e.batch.batchId)).next(()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(s,function(l){let c=ee();for(let d=0;d<l.mutationResults.length;++d)l.mutationResults[d].transformResults.length>0&&(c=c.add(l.batch.mutations[d].key));return c}(e))).next(()=>t.localDocuments.getDocuments(s,r))})}function hf(n){const e=K(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",t=>e.Ur.getLastRemoteSnapshotVersion(t))}function sw(n,e){const t=K(n),s=e.snapshotVersion;let r=t.os;return t.persistence.runTransaction("Apply remote event","readwrite-primary",i=>{const a=t.cs.newChangeBuffer({trackRemovals:!0});r=t.os;const l=[];e.targetChanges.forEach((f,m)=>{const _=r.get(m);if(!_)return;l.push(t.Ur.removeMatchingKeys(i,f.removedDocuments,m).next(()=>t.Ur.addMatchingKeys(i,f.addedDocuments,m)));let w=_.withSequenceNumber(i.currentSequenceNumber);e.targetMismatches.get(m)!==null?w=w.withResumeToken(We.EMPTY_BYTE_STRING,G.min()).withLastLimboFreeSnapshotVersion(G.min()):f.resumeToken.approximateByteSize()>0&&(w=w.withResumeToken(f.resumeToken,s)),r=r.insert(m,w),function(C,x,I){return C.resumeToken.approximateByteSize()===0||x.snapshotVersion.toMicroseconds()-C.snapshotVersion.toMicroseconds()>=3e8?!0:I.addedDocuments.size+I.modifiedDocuments.size+I.removedDocuments.size>0}(_,w,f)&&l.push(t.Ur.updateTargetData(i,w))});let c=ln(),d=ee();if(e.documentUpdates.forEach(f=>{e.resolvedLimboDocuments.has(f)&&l.push(t.persistence.referenceDelegate.updateLimboDocument(i,f))}),l.push(rw(i,a,e.documentUpdates).next(f=>{c=f.Ps,d=f.Is})),!s.isEqual(G.min())){const f=t.Ur.getLastRemoteSnapshotVersion(i).next(m=>t.Ur.setTargetsMetadata(i,i.currentSequenceNumber,s));l.push(f)}return L.waitFor(l).next(()=>a.apply(i)).next(()=>t.localDocuments.getLocalViewOfDocuments(i,c,d)).next(()=>c)}).then(i=>(t.os=r,i))}function rw(n,e,t){let s=ee(),r=ee();return t.forEach(i=>s=s.add(i)),e.getEntries(n,s).next(i=>{let a=ln();return t.forEach((l,c)=>{const d=i.get(l);c.isFoundDocument()!==d.isFoundDocument()&&(r=r.add(l)),c.isNoDocument()&&c.version.isEqual(G.min())?(e.removeEntry(l,c.readTime),a=a.insert(l,c)):!d.isValidDocument()||c.version.compareTo(d.version)>0||c.version.compareTo(d.version)===0&&d.hasPendingWrites?(e.addEntry(c),a=a.insert(l,c)):U("LocalStore","Ignoring outdated watch update for ",l,". Current version:",d.version," Watch version:",c.version)}),{Ps:a,Is:r}})}function iw(n,e){const t=K(n);return t.persistence.runTransaction("Get next mutation batch","readonly",s=>(e===void 0&&(e=-1),t.mutationQueue.getNextMutationBatchAfterBatchId(s,e)))}function ow(n,e){const t=K(n);return t.persistence.runTransaction("Allocate target","readwrite",s=>{let r;return t.Ur.getTargetData(s,e).next(i=>i?(r=i,L.resolve(r)):t.Ur.allocateTargetId(s).next(a=>(r=new An(e,a,"TargetPurposeListen",s.currentSequenceNumber),t.Ur.addTargetData(s,r).next(()=>r))))}).then(s=>{const r=t.os.get(s.targetId);return(r===null||s.snapshotVersion.compareTo(r.snapshotVersion)>0)&&(t.os=t.os.insert(s.targetId,s),t._s.set(e,s.targetId)),s})}async function Za(n,e,t){const s=K(n),r=s.os.get(e),i=t?"readwrite":"readwrite-primary";try{t||await s.persistence.runTransaction("Release target",i,a=>s.persistence.referenceDelegate.removeTarget(a,r))}catch(a){if(!ii(a))throw a;U("LocalStore",`Failed to update sequence numbers for target ${e}: ${a}`)}s.os=s.os.remove(e),s._s.delete(r.target)}function id(n,e,t){const s=K(n);let r=G.min(),i=ee();return s.persistence.runTransaction("Execute query","readwrite",a=>function(c,d,f){const m=K(c),_=m._s.get(f);return _!==void 0?L.resolve(m.os.get(_)):m.Ur.getTargetData(d,f)}(s,a,Ft(e)).next(l=>{if(l)return r=l.lastLimboFreeSnapshotVersion,s.Ur.getMatchingKeysForTargetId(a,l.targetId).next(c=>{i=c})}).next(()=>s.ss.getDocumentsMatchingQuery(a,e,t?r:G.min(),t?i:ee())).next(l=>(aw(s,J0(e),l),{documents:l,Ts:i})))}function aw(n,e,t){let s=n.us.get(e)||G.min();t.forEach((r,i)=>{i.readTime.compareTo(s)>0&&(s=i.readTime)}),n.us.set(e,s)}class od{constructor(){this.activeTargetIds=s_()}fs(e){this.activeTargetIds=this.activeTargetIds.add(e)}gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Vs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class lw{constructor(){this.so=new od,this.oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,s){}addLocalQueryTarget(e,t=!0){return t&&this.so.fs(e),this.oo[e]||"not-current"}updateQueryState(e,t,s){this.oo[e]=t}removeLocalQueryTarget(e){this.so.gs(e)}isLocalQueryTarget(e){return this.so.activeTargetIds.has(e)}clearQueryState(e){delete this.oo[e]}getAllActiveQueryTargets(){return this.so.activeTargetIds}isActiveQueryTarget(e){return this.so.activeTargetIds.has(e)}start(){return this.so=new od,Promise.resolve()}handleUserChange(e,t,s){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cw{_o(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ad{constructor(){this.ao=()=>this.uo(),this.co=()=>this.lo(),this.ho=[],this.Po()}_o(e){this.ho.push(e)}shutdown(){window.removeEventListener("online",this.ao),window.removeEventListener("offline",this.co)}Po(){window.addEventListener("online",this.ao),window.addEventListener("offline",this.co)}uo(){U("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const e of this.ho)e(0)}lo(){U("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const e of this.ho)e(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
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
 */let Li=null;function Sa(){return Li===null?Li=function(){return 268435456+Math.round(2147483648*Math.random())}():Li++,"0x"+Li.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uw={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dw{constructor(e){this.Io=e.Io,this.To=e.To}Eo(e){this.Ao=e}Ro(e){this.Vo=e}mo(e){this.fo=e}onMessage(e){this.po=e}close(){this.To()}send(e){this.Io(e)}yo(){this.Ao()}wo(){this.Vo()}So(e){this.fo(e)}bo(e){this.po(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qe="WebChannelConnection";class hw extends class{constructor(t){this.databaseInfo=t,this.databaseId=t.databaseId;const s=t.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),i=encodeURIComponent(this.databaseId.database);this.Do=s+"://"+t.host,this.vo=`projects/${r}/databases/${i}`,this.Co=this.databaseId.database==="(default)"?`project_id=${r}`:`project_id=${r}&database_id=${i}`}get Fo(){return!1}Mo(t,s,r,i,a){const l=Sa(),c=this.xo(t,s.toUriEncodedString());U("RestConnection",`Sending RPC '${t}' ${l}:`,c,r);const d={"google-cloud-resource-prefix":this.vo,"x-goog-request-params":this.Co};return this.Oo(d,i,a),this.No(t,c,d,r).then(f=>(U("RestConnection",`Received RPC '${t}' ${l}: `,f),f),f=>{throw $s("RestConnection",`RPC '${t}' ${l} failed with error: `,f,"url: ",c,"request:",r),f})}Lo(t,s,r,i,a,l){return this.Mo(t,s,r,i,a)}Oo(t,s,r){t["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+Zs}(),t["Content-Type"]="text/plain",this.databaseInfo.appId&&(t["X-Firebase-GMPID"]=this.databaseInfo.appId),s&&s.headers.forEach((i,a)=>t[a]=i),r&&r.headers.forEach((i,a)=>t[a]=i)}xo(t,s){const r=uw[t];return`${this.Do}/v1/${s}:${r}`}terminate(){}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}No(e,t,s,r){const i=Sa();return new Promise((a,l)=>{const c=new xh;c.setWithCredentials(!0),c.listenOnce(Ah.COMPLETE,()=>{try{switch(c.getLastErrorCode()){case zi.NO_ERROR:const f=c.getResponseJson();U(Qe,`XHR for RPC '${e}' ${i} received:`,JSON.stringify(f)),a(f);break;case zi.TIMEOUT:U(Qe,`RPC '${e}' ${i} timed out`),l(new $(N.DEADLINE_EXCEEDED,"Request time out"));break;case zi.HTTP_ERROR:const m=c.getStatus();if(U(Qe,`RPC '${e}' ${i} failed with status:`,m,"response text:",c.getResponseText()),m>0){let _=c.getResponseJson();Array.isArray(_)&&(_=_[0]);const w=_==null?void 0:_.error;if(w&&w.status&&w.message){const T=function(x){const I=x.toLowerCase().replace(/_/g,"-");return Object.values(N).indexOf(I)>=0?I:N.UNKNOWN}(w.status);l(new $(T,w.message))}else l(new $(N.UNKNOWN,"Server responded with status "+c.getStatus()))}else l(new $(N.UNAVAILABLE,"Connection failed."));break;default:W()}}finally{U(Qe,`RPC '${e}' ${i} completed.`)}});const d=JSON.stringify(r);U(Qe,`RPC '${e}' ${i} sending request:`,r),c.send(t,"POST",d,s,15)})}Bo(e,t,s){const r=Sa(),i=[this.Do,"/","google.firestore.v1.Firestore","/",e,"/channel"],a=Ch(),l=Ph(),c={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},d=this.longPollingOptions.timeoutSeconds;d!==void 0&&(c.longPollingTimeout=Math.round(1e3*d)),this.useFetchStreams&&(c.useFetchStreams=!0),this.Oo(c.initMessageHeaders,t,s),c.encodeInitMessageHeaders=!0;const f=i.join("");U(Qe,`Creating RPC '${e}' stream ${r}: ${f}`,c);const m=a.createWebChannel(f,c);let _=!1,w=!1;const T=new dw({Io:x=>{w?U(Qe,`Not sending because RPC '${e}' stream ${r} is closed:`,x):(_||(U(Qe,`Opening RPC '${e}' stream ${r} transport.`),m.open(),_=!0),U(Qe,`RPC '${e}' stream ${r} sending:`,x),m.send(x))},To:()=>m.close()}),C=(x,I,M)=>{x.listen(I,D=>{try{M(D)}catch(P){setTimeout(()=>{throw P},0)}})};return C(m,xr.EventType.OPEN,()=>{w||(U(Qe,`RPC '${e}' stream ${r} transport opened.`),T.yo())}),C(m,xr.EventType.CLOSE,()=>{w||(w=!0,U(Qe,`RPC '${e}' stream ${r} transport closed`),T.So())}),C(m,xr.EventType.ERROR,x=>{w||(w=!0,$s(Qe,`RPC '${e}' stream ${r} transport errored:`,x),T.So(new $(N.UNAVAILABLE,"The operation could not be completed")))}),C(m,xr.EventType.MESSAGE,x=>{var I;if(!w){const M=x.data[0];ae(!!M);const D=M,P=D.error||((I=D[0])===null||I===void 0?void 0:I.error);if(P){U(Qe,`RPC '${e}' stream ${r} received error:`,P);const O=P.status;let z=function(v){const E=Re[v];if(E!==void 0)return ef(E)}(O),g=P.message;z===void 0&&(z=N.INTERNAL,g="Unknown error status: "+O+" with message "+P.message),w=!0,T.So(new $(z,g)),m.close()}else U(Qe,`RPC '${e}' stream ${r} received:`,M),T.bo(M)}}),C(l,Rh.STAT_EVENT,x=>{x.stat===qa.PROXY?U(Qe,`RPC '${e}' stream ${r} detected buffering proxy`):x.stat===qa.NOPROXY&&U(Qe,`RPC '${e}' stream ${r} detected no buffering proxy`)}),setTimeout(()=>{T.wo()},0),T}}function xa(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ko(n){return new E_(n,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ff{constructor(e,t,s=1e3,r=1.5,i=6e4){this.ui=e,this.timerId=t,this.ko=s,this.qo=r,this.Qo=i,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(e){this.cancel();const t=Math.floor(this.Ko+this.zo()),s=Math.max(0,Date.now()-this.Uo),r=Math.max(0,t-s);r>0&&U("ExponentialBackoff",`Backing off for ${r} ms (base delay: ${this.Ko} ms, delay with jitter: ${t} ms, last attempt: ${s} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,r,()=>(this.Uo=Date.now(),e())),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){this.$o!==null&&(this.$o.skipDelay(),this.$o=null)}cancel(){this.$o!==null&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pf{constructor(e,t,s,r,i,a,l,c){this.ui=e,this.Ho=s,this.Jo=r,this.connection=i,this.authCredentialsProvider=a,this.appCheckCredentialsProvider=l,this.listener=c,this.state=0,this.Yo=0,this.Zo=null,this.Xo=null,this.stream=null,this.e_=0,this.t_=new ff(e,t)}n_(){return this.state===1||this.state===5||this.r_()}r_(){return this.state===2||this.state===3}start(){this.e_=0,this.state!==4?this.auth():this.i_()}async stop(){this.n_()&&await this.close(0)}s_(){this.state=0,this.t_.reset()}o_(){this.r_()&&this.Zo===null&&(this.Zo=this.ui.enqueueAfterDelay(this.Ho,6e4,()=>this.__()))}a_(e){this.u_(),this.stream.send(e)}async __(){if(this.r_())return this.close(0)}u_(){this.Zo&&(this.Zo.cancel(),this.Zo=null)}c_(){this.Xo&&(this.Xo.cancel(),this.Xo=null)}async close(e,t){this.u_(),this.c_(),this.t_.cancel(),this.Yo++,e!==4?this.t_.reset():t&&t.code===N.RESOURCE_EXHAUSTED?(an(t.toString()),an("Using maximum backoff delay to prevent overloading the backend."),this.t_.Wo()):t&&t.code===N.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.l_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.mo(t)}l_(){}auth(){this.state=1;const e=this.h_(this.Yo),t=this.Yo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([s,r])=>{this.Yo===t&&this.P_(s,r)},s=>{e(()=>{const r=new $(N.UNKNOWN,"Fetching auth token failed: "+s.message);return this.I_(r)})})}P_(e,t){const s=this.h_(this.Yo);this.stream=this.T_(e,t),this.stream.Eo(()=>{s(()=>this.listener.Eo())}),this.stream.Ro(()=>{s(()=>(this.state=2,this.Xo=this.ui.enqueueAfterDelay(this.Jo,1e4,()=>(this.r_()&&(this.state=3),Promise.resolve())),this.listener.Ro()))}),this.stream.mo(r=>{s(()=>this.I_(r))}),this.stream.onMessage(r=>{s(()=>++this.e_==1?this.E_(r):this.onNext(r))})}i_(){this.state=5,this.t_.Go(async()=>{this.state=0,this.start()})}I_(e){return U("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}h_(e){return t=>{this.ui.enqueueAndForget(()=>this.Yo===e?t():(U("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class fw extends pf{constructor(e,t,s,r,i,a){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,s,r,a),this.serializer=i}T_(e,t){return this.connection.Bo("Listen",e,t)}E_(e){return this.onNext(e)}onNext(e){this.t_.reset();const t=S_(this.serializer,e),s=function(i){if(!("targetChange"in i))return G.min();const a=i.targetChange;return a.targetIds&&a.targetIds.length?G.min():a.readTime?zt(a.readTime):G.min()}(e);return this.listener.d_(t,s)}A_(e){const t={};t.database=Xa(this.serializer),t.addTarget=function(i,a){let l;const c=a.target;if(l=Ya(c)?{documents:R_(i,c)}:{query:P_(i,c)._t},l.targetId=a.targetId,a.resumeToken.approximateByteSize()>0){l.resumeToken=sf(i,a.resumeToken);const d=Ka(i,a.expectedCount);d!==null&&(l.expectedCount=d)}else if(a.snapshotVersion.compareTo(G.min())>0){l.readTime=lo(i,a.snapshotVersion.toTimestamp());const d=Ka(i,a.expectedCount);d!==null&&(l.expectedCount=d)}return l}(this.serializer,e);const s=k_(this.serializer,e);s&&(t.labels=s),this.a_(t)}R_(e){const t={};t.database=Xa(this.serializer),t.removeTarget=e,this.a_(t)}}class pw extends pf{constructor(e,t,s,r,i,a){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,s,r,a),this.serializer=i}get V_(){return this.e_>0}start(){this.lastStreamToken=void 0,super.start()}l_(){this.V_&&this.m_([])}T_(e,t){return this.connection.Bo("Write",e,t)}E_(e){return ae(!!e.streamToken),this.lastStreamToken=e.streamToken,ae(!e.writeResults||e.writeResults.length===0),this.listener.f_()}onNext(e){ae(!!e.streamToken),this.lastStreamToken=e.streamToken,this.t_.reset();const t=A_(e.writeResults,e.commitTime),s=zt(e.commitTime);return this.listener.g_(s,t)}p_(){const e={};e.database=Xa(this.serializer),this.a_(e)}m_(e){const t={streamToken:this.lastStreamToken,writes:e.map(s=>x_(this.serializer,s))};this.a_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mw extends class{}{constructor(e,t,s,r){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=s,this.serializer=r,this.y_=!1}w_(){if(this.y_)throw new $(N.FAILED_PRECONDITION,"The client has already been terminated.")}Mo(e,t,s,r){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([i,a])=>this.connection.Mo(e,Qa(t,s),r,i,a)).catch(i=>{throw i.name==="FirebaseError"?(i.code===N.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new $(N.UNKNOWN,i.toString())})}Lo(e,t,s,r,i){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([a,l])=>this.connection.Lo(e,Qa(t,s),r,a,l,i)).catch(a=>{throw a.name==="FirebaseError"?(a.code===N.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new $(N.UNKNOWN,a.toString())})}terminate(){this.y_=!0,this.connection.terminate()}}class gw{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.S_=0,this.b_=null,this.D_=!0}v_(){this.S_===0&&(this.C_("Unknown"),this.b_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.b_=null,this.F_("Backend didn't respond within 10 seconds."),this.C_("Offline"),Promise.resolve())))}M_(e){this.state==="Online"?this.C_("Unknown"):(this.S_++,this.S_>=1&&(this.x_(),this.F_(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.C_("Offline")))}set(e){this.x_(),this.S_=0,e==="Online"&&(this.D_=!1),this.C_(e)}C_(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}F_(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.D_?(an(t),this.D_=!1):U("OnlineStateTracker",t)}x_(){this.b_!==null&&(this.b_.cancel(),this.b_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yw{constructor(e,t,s,r,i){this.localStore=e,this.datastore=t,this.asyncQueue=s,this.remoteSyncer={},this.O_=[],this.N_=new Map,this.L_=new Set,this.B_=[],this.k_=i,this.k_._o(a=>{s.enqueueAndForget(async()=>{ps(this)&&(U("RemoteStore","Restarting streams for network reachability change."),await async function(c){const d=K(c);d.L_.add(4),await li(d),d.q_.set("Unknown"),d.L_.delete(4),await Mo(d)}(this))})}),this.q_=new gw(s,r)}}async function Mo(n){if(ps(n))for(const e of n.B_)await e(!0)}async function li(n){for(const e of n.B_)await e(!1)}function mf(n,e){const t=K(n);t.N_.has(e.targetId)||(t.N_.set(e.targetId,e),jl(t)?Hl(t):tr(t).r_()&&ql(t,e))}function $l(n,e){const t=K(n),s=tr(t);t.N_.delete(e),s.r_()&&gf(t,e),t.N_.size===0&&(s.r_()?s.o_():ps(t)&&t.q_.set("Unknown"))}function ql(n,e){if(n.Q_.xe(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(G.min())>0){const t=n.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}tr(n).A_(e)}function gf(n,e){n.Q_.xe(e),tr(n).R_(e)}function Hl(n){n.Q_=new v_({getRemoteKeysForTarget:e=>n.remoteSyncer.getRemoteKeysForTarget(e),ot:e=>n.N_.get(e)||null,tt:()=>n.datastore.serializer.databaseId}),tr(n).start(),n.q_.v_()}function jl(n){return ps(n)&&!tr(n).n_()&&n.N_.size>0}function ps(n){return K(n).L_.size===0}function yf(n){n.Q_=void 0}async function vw(n){n.q_.set("Online")}async function _w(n){n.N_.forEach((e,t)=>{ql(n,e)})}async function ww(n,e){yf(n),jl(n)?(n.q_.M_(e),Hl(n)):n.q_.set("Unknown")}async function bw(n,e,t){if(n.q_.set("Online"),e instanceof nf&&e.state===2&&e.cause)try{await async function(r,i){const a=i.cause;for(const l of i.targetIds)r.N_.has(l)&&(await r.remoteSyncer.rejectListen(l,a),r.N_.delete(l),r.Q_.removeTarget(l))}(n,e)}catch(s){U("RemoteStore","Failed to remove targets %s: %s ",e.targetIds.join(","),s),await co(n,s)}else if(e instanceof qi?n.Q_.Ke(e):e instanceof tf?n.Q_.He(e):n.Q_.We(e),!t.isEqual(G.min()))try{const s=await hf(n.localStore);t.compareTo(s)>=0&&await function(i,a){const l=i.Q_.rt(a);return l.targetChanges.forEach((c,d)=>{if(c.resumeToken.approximateByteSize()>0){const f=i.N_.get(d);f&&i.N_.set(d,f.withResumeToken(c.resumeToken,a))}}),l.targetMismatches.forEach((c,d)=>{const f=i.N_.get(c);if(!f)return;i.N_.set(c,f.withResumeToken(We.EMPTY_BYTE_STRING,f.snapshotVersion)),gf(i,c);const m=new An(f.target,c,d,f.sequenceNumber);ql(i,m)}),i.remoteSyncer.applyRemoteEvent(l)}(n,t)}catch(s){U("RemoteStore","Failed to raise snapshot:",s),await co(n,s)}}async function co(n,e,t){if(!ii(e))throw e;n.L_.add(1),await li(n),n.q_.set("Offline"),t||(t=()=>hf(n.localStore)),n.asyncQueue.enqueueRetryable(async()=>{U("RemoteStore","Retrying IndexedDB access"),await t(),n.L_.delete(1),await Mo(n)})}function vf(n,e){return e().catch(t=>co(n,t,e))}async function Do(n){const e=K(n),t=Fn(e);let s=e.O_.length>0?e.O_[e.O_.length-1].batchId:-1;for(;Ew(e);)try{const r=await iw(e.localStore,s);if(r===null){e.O_.length===0&&t.o_();break}s=r.batchId,Tw(e,r)}catch(r){await co(e,r)}_f(e)&&wf(e)}function Ew(n){return ps(n)&&n.O_.length<10}function Tw(n,e){n.O_.push(e);const t=Fn(n);t.r_()&&t.V_&&t.m_(e.mutations)}function _f(n){return ps(n)&&!Fn(n).n_()&&n.O_.length>0}function wf(n){Fn(n).start()}async function Iw(n){Fn(n).p_()}async function Sw(n){const e=Fn(n);for(const t of n.O_)e.m_(t.mutations)}async function xw(n,e,t){const s=n.O_.shift(),r=Ol.from(s,e,t);await vf(n,()=>n.remoteSyncer.applySuccessfulWrite(r)),await Do(n)}async function Aw(n,e){e&&Fn(n).V_&&await async function(s,r){if(function(a){return m_(a)&&a!==N.ABORTED}(r.code)){const i=s.O_.shift();Fn(s).s_(),await vf(s,()=>s.remoteSyncer.rejectFailedWrite(i.batchId,r)),await Do(s)}}(n,e),_f(n)&&wf(n)}async function ld(n,e){const t=K(n);t.asyncQueue.verifyOperationInProgress(),U("RemoteStore","RemoteStore received new credentials");const s=ps(t);t.L_.add(3),await li(t),s&&t.q_.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.L_.delete(3),await Mo(t)}async function Rw(n,e){const t=K(n);e?(t.L_.delete(2),await Mo(t)):e||(t.L_.add(2),await li(t),t.q_.set("Unknown"))}function tr(n){return n.K_||(n.K_=function(t,s,r){const i=K(t);return i.w_(),new fw(s,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,r)}(n.datastore,n.asyncQueue,{Eo:vw.bind(null,n),Ro:_w.bind(null,n),mo:ww.bind(null,n),d_:bw.bind(null,n)}),n.B_.push(async e=>{e?(n.K_.s_(),jl(n)?Hl(n):n.q_.set("Unknown")):(await n.K_.stop(),yf(n))})),n.K_}function Fn(n){return n.U_||(n.U_=function(t,s,r){const i=K(t);return i.w_(),new pw(s,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,r)}(n.datastore,n.asyncQueue,{Eo:()=>Promise.resolve(),Ro:Iw.bind(null,n),mo:Aw.bind(null,n),f_:Sw.bind(null,n),g_:xw.bind(null,n)}),n.B_.push(async e=>{e?(n.U_.s_(),await Do(n)):(await n.U_.stop(),n.O_.length>0&&(U("RemoteStore",`Stopping write stream with ${n.O_.length} pending writes`),n.O_=[]))})),n.U_}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wl{constructor(e,t,s,r,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=s,this.op=r,this.removalCallback=i,this.deferred=new sn,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(a=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,s,r,i){const a=Date.now()+s,l=new Wl(e,t,a,r,i);return l.start(s),l}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new $(N.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Yl(n,e){if(an("AsyncQueue",`${e}: ${n}`),ii(n))return new $(N.UNAVAILABLE,`${e}: ${n}`);throw n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Os{constructor(e){this.comparator=e?(t,s)=>e(t,s)||q.comparator(t.key,s.key):(t,s)=>q.comparator(t.key,s.key),this.keyedMap=Ar(),this.sortedSet=new Ee(this.comparator)}static emptySet(e){return new Os(e.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((t,s)=>(e(t),!1))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof Os)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),s=e.sortedSet.getIterator();for(;t.hasNext();){const r=t.getNext().key,i=s.getNext().key;if(!r.isEqual(i))return!1}return!0}toString(){const e=[];return this.forEach(t=>{e.push(t.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const s=new Os;return s.comparator=this.comparator,s.keyedMap=e,s.sortedSet=t,s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cd{constructor(){this.W_=new Ee(q.comparator)}track(e){const t=e.doc.key,s=this.W_.get(t);s?e.type!==0&&s.type===3?this.W_=this.W_.insert(t,e):e.type===3&&s.type!==1?this.W_=this.W_.insert(t,{type:s.type,doc:e.doc}):e.type===2&&s.type===2?this.W_=this.W_.insert(t,{type:2,doc:e.doc}):e.type===2&&s.type===0?this.W_=this.W_.insert(t,{type:0,doc:e.doc}):e.type===1&&s.type===0?this.W_=this.W_.remove(t):e.type===1&&s.type===2?this.W_=this.W_.insert(t,{type:1,doc:s.doc}):e.type===0&&s.type===1?this.W_=this.W_.insert(t,{type:2,doc:e.doc}):W():this.W_=this.W_.insert(t,e)}G_(){const e=[];return this.W_.inorderTraversal((t,s)=>{e.push(s)}),e}}class Ys{constructor(e,t,s,r,i,a,l,c,d){this.query=e,this.docs=t,this.oldDocs=s,this.docChanges=r,this.mutatedKeys=i,this.fromCache=a,this.syncStateChanged=l,this.excludesMetadataChanges=c,this.hasCachedResults=d}static fromInitialDocuments(e,t,s,r,i){const a=[];return t.forEach(l=>{a.push({type:0,doc:l})}),new Ys(e,t,Os.emptySet(t),a,s,r,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&So(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,s=e.docChanges;if(t.length!==s.length)return!1;for(let r=0;r<t.length;r++)if(t[r].type!==s[r].type||!t[r].doc.isEqual(s[r].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pw{constructor(){this.z_=void 0,this.j_=[]}H_(){return this.j_.some(e=>e.J_())}}class Cw{constructor(){this.queries=ud(),this.onlineState="Unknown",this.Y_=new Set}terminate(){(function(t,s){const r=K(t),i=r.queries;r.queries=ud(),i.forEach((a,l)=>{for(const c of l.j_)c.onError(s)})})(this,new $(N.ABORTED,"Firestore shutting down"))}}function ud(){return new er(n=>$h(n),So)}async function bf(n,e){const t=K(n);let s=3;const r=e.query;let i=t.queries.get(r);i?!i.H_()&&e.J_()&&(s=2):(i=new Pw,s=e.J_()?0:1);try{switch(s){case 0:i.z_=await t.onListen(r,!0);break;case 1:i.z_=await t.onListen(r,!1);break;case 2:await t.onFirstRemoteStoreListen(r)}}catch(a){const l=Yl(a,`Initialization of query '${Rs(e.query)}' failed`);return void e.onError(l)}t.queries.set(r,i),i.j_.push(e),e.Z_(t.onlineState),i.z_&&e.X_(i.z_)&&Gl(t)}async function Ef(n,e){const t=K(n),s=e.query;let r=3;const i=t.queries.get(s);if(i){const a=i.j_.indexOf(e);a>=0&&(i.j_.splice(a,1),i.j_.length===0?r=e.J_()?0:1:!i.H_()&&e.J_()&&(r=2))}switch(r){case 0:return t.queries.delete(s),t.onUnlisten(s,!0);case 1:return t.queries.delete(s),t.onUnlisten(s,!1);case 2:return t.onLastRemoteStoreUnlisten(s);default:return}}function kw(n,e){const t=K(n);let s=!1;for(const r of e){const i=r.query,a=t.queries.get(i);if(a){for(const l of a.j_)l.X_(r)&&(s=!0);a.z_=r}}s&&Gl(t)}function Mw(n,e,t){const s=K(n),r=s.queries.get(e);if(r)for(const i of r.j_)i.onError(t);s.queries.delete(e)}function Gl(n){n.Y_.forEach(e=>{e.next()})}var el,dd;(dd=el||(el={})).ea="default",dd.Cache="cache";class Tf{constructor(e,t,s){this.query=e,this.ta=t,this.na=!1,this.ra=null,this.onlineState="Unknown",this.options=s||{}}X_(e){if(!this.options.includeMetadataChanges){const s=[];for(const r of e.docChanges)r.type!==3&&s.push(r);e=new Ys(e.query,e.docs,e.oldDocs,s,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.na?this.ia(e)&&(this.ta.next(e),t=!0):this.sa(e,this.onlineState)&&(this.oa(e),t=!0),this.ra=e,t}onError(e){this.ta.error(e)}Z_(e){this.onlineState=e;let t=!1;return this.ra&&!this.na&&this.sa(this.ra,e)&&(this.oa(this.ra),t=!0),t}sa(e,t){if(!e.fromCache||!this.J_())return!0;const s=t!=="Offline";return(!this.options._a||!s)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}ia(e){if(e.docChanges.length>0)return!0;const t=this.ra&&this.ra.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}oa(e){e=Ys.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.na=!0,this.ta.next(e)}J_(){return this.options.source!==el.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class If{constructor(e){this.key=e}}class Sf{constructor(e){this.key=e}}class Dw{constructor(e,t){this.query=e,this.Ta=t,this.Ea=null,this.hasCachedResults=!1,this.current=!1,this.da=ee(),this.mutatedKeys=ee(),this.Aa=qh(e),this.Ra=new Os(this.Aa)}get Va(){return this.Ta}ma(e,t){const s=t?t.fa:new cd,r=t?t.Ra:this.Ra;let i=t?t.mutatedKeys:this.mutatedKeys,a=r,l=!1;const c=this.query.limitType==="F"&&r.size===this.query.limit?r.last():null,d=this.query.limitType==="L"&&r.size===this.query.limit?r.first():null;if(e.inorderTraversal((f,m)=>{const _=r.get(f),w=xo(this.query,m)?m:null,T=!!_&&this.mutatedKeys.has(_.key),C=!!w&&(w.hasLocalMutations||this.mutatedKeys.has(w.key)&&w.hasCommittedMutations);let x=!1;_&&w?_.data.isEqual(w.data)?T!==C&&(s.track({type:3,doc:w}),x=!0):this.ga(_,w)||(s.track({type:2,doc:w}),x=!0,(c&&this.Aa(w,c)>0||d&&this.Aa(w,d)<0)&&(l=!0)):!_&&w?(s.track({type:0,doc:w}),x=!0):_&&!w&&(s.track({type:1,doc:_}),x=!0,(c||d)&&(l=!0)),x&&(w?(a=a.add(w),i=C?i.add(f):i.delete(f)):(a=a.delete(f),i=i.delete(f)))}),this.query.limit!==null)for(;a.size>this.query.limit;){const f=this.query.limitType==="F"?a.last():a.first();a=a.delete(f.key),i=i.delete(f.key),s.track({type:1,doc:f})}return{Ra:a,fa:s,ns:l,mutatedKeys:i}}ga(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,s,r){const i=this.Ra;this.Ra=e.Ra,this.mutatedKeys=e.mutatedKeys;const a=e.fa.G_();a.sort((f,m)=>function(w,T){const C=x=>{switch(x){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return W()}};return C(w)-C(T)}(f.type,m.type)||this.Aa(f.doc,m.doc)),this.pa(s),r=r!=null&&r;const l=t&&!r?this.ya():[],c=this.da.size===0&&this.current&&!r?1:0,d=c!==this.Ea;return this.Ea=c,a.length!==0||d?{snapshot:new Ys(this.query,e.Ra,i,a,e.mutatedKeys,c===0,d,!1,!!s&&s.resumeToken.approximateByteSize()>0),wa:l}:{wa:l}}Z_(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Ra:this.Ra,fa:new cd,mutatedKeys:this.mutatedKeys,ns:!1},!1)):{wa:[]}}Sa(e){return!this.Ta.has(e)&&!!this.Ra.has(e)&&!this.Ra.get(e).hasLocalMutations}pa(e){e&&(e.addedDocuments.forEach(t=>this.Ta=this.Ta.add(t)),e.modifiedDocuments.forEach(t=>{}),e.removedDocuments.forEach(t=>this.Ta=this.Ta.delete(t)),this.current=e.current)}ya(){if(!this.current)return[];const e=this.da;this.da=ee(),this.Ra.forEach(s=>{this.Sa(s.key)&&(this.da=this.da.add(s.key))});const t=[];return e.forEach(s=>{this.da.has(s)||t.push(new Sf(s))}),this.da.forEach(s=>{e.has(s)||t.push(new If(s))}),t}ba(e){this.Ta=e.Ts,this.da=ee();const t=this.ma(e.documents);return this.applyChanges(t,!0)}Da(){return Ys.fromInitialDocuments(this.query,this.Ra,this.mutatedKeys,this.Ea===0,this.hasCachedResults)}}class Nw{constructor(e,t,s){this.query=e,this.targetId=t,this.view=s}}class Lw{constructor(e){this.key=e,this.va=!1}}class Ow{constructor(e,t,s,r,i,a){this.localStore=e,this.remoteStore=t,this.eventManager=s,this.sharedClientState=r,this.currentUser=i,this.maxConcurrentLimboResolutions=a,this.Ca={},this.Fa=new er(l=>$h(l),So),this.Ma=new Map,this.xa=new Set,this.Oa=new Ee(q.comparator),this.Na=new Map,this.La=new Fl,this.Ba={},this.ka=new Map,this.qa=Ws.kn(),this.onlineState="Unknown",this.Qa=void 0}get isPrimaryClient(){return this.Qa===!0}}async function Vw(n,e,t=!0){const s=kf(n);let r;const i=s.Fa.get(e);return i?(s.sharedClientState.addLocalQueryTarget(i.targetId),r=i.view.Da()):r=await xf(s,e,t,!0),r}async function Bw(n,e){const t=kf(n);await xf(t,e,!0,!1)}async function xf(n,e,t,s){const r=await ow(n.localStore,Ft(e)),i=r.targetId,a=n.sharedClientState.addLocalQueryTarget(i,t);let l;return s&&(l=await Fw(n,e,i,a==="current",r.resumeToken)),n.isPrimaryClient&&t&&mf(n.remoteStore,r),l}async function Fw(n,e,t,s,r){n.Ka=(m,_,w)=>async function(C,x,I,M){let D=x.view.ma(I);D.ns&&(D=await id(C.localStore,x.query,!1).then(({documents:g})=>x.view.ma(g,D)));const P=M&&M.targetChanges.get(x.targetId),O=M&&M.targetMismatches.get(x.targetId)!=null,z=x.view.applyChanges(D,C.isPrimaryClient,P,O);return fd(C,x.targetId,z.wa),z.snapshot}(n,m,_,w);const i=await id(n.localStore,e,!0),a=new Dw(e,i.Ts),l=a.ma(i.documents),c=ai.createSynthesizedTargetChangeForCurrentChange(t,s&&n.onlineState!=="Offline",r),d=a.applyChanges(l,n.isPrimaryClient,c);fd(n,t,d.wa);const f=new Nw(e,t,a);return n.Fa.set(e,f),n.Ma.has(t)?n.Ma.get(t).push(e):n.Ma.set(t,[e]),d.snapshot}async function zw(n,e,t){const s=K(n),r=s.Fa.get(e),i=s.Ma.get(r.targetId);if(i.length>1)return s.Ma.set(r.targetId,i.filter(a=>!So(a,e))),void s.Fa.delete(e);s.isPrimaryClient?(s.sharedClientState.removeLocalQueryTarget(r.targetId),s.sharedClientState.isActiveQueryTarget(r.targetId)||await Za(s.localStore,r.targetId,!1).then(()=>{s.sharedClientState.clearQueryState(r.targetId),t&&$l(s.remoteStore,r.targetId),tl(s,r.targetId)}).catch(ri)):(tl(s,r.targetId),await Za(s.localStore,r.targetId,!0))}async function Uw(n,e){const t=K(n),s=t.Fa.get(e),r=t.Ma.get(s.targetId);t.isPrimaryClient&&r.length===1&&(t.sharedClientState.removeLocalQueryTarget(s.targetId),$l(t.remoteStore,s.targetId))}async function $w(n,e,t){const s=Kw(n);try{const r=await function(a,l){const c=K(a),d=Le.now(),f=l.reduce((w,T)=>w.add(T.key),ee());let m,_;return c.persistence.runTransaction("Locally write mutations","readwrite",w=>{let T=ln(),C=ee();return c.cs.getEntries(w,f).next(x=>{T=x,T.forEach((I,M)=>{M.isValidDocument()||(C=C.add(I))})}).next(()=>c.localDocuments.getOverlayedDocuments(w,T)).next(x=>{m=x;const I=[];for(const M of l){const D=u_(M,m.get(M.key).overlayedDocument);D!=null&&I.push(new Un(M.key,D,Lh(D.value.mapValue),it.exists(!0)))}return c.mutationQueue.addMutationBatch(w,d,I,l)}).next(x=>{_=x;const I=x.applyToLocalDocumentSet(m,C);return c.documentOverlayCache.saveOverlays(w,x.batchId,I)})}).then(()=>({batchId:_.batchId,changes:jh(m)}))}(s.localStore,e);s.sharedClientState.addPendingMutation(r.batchId),function(a,l,c){let d=a.Ba[a.currentUser.toKey()];d||(d=new Ee(ie)),d=d.insert(l,c),a.Ba[a.currentUser.toKey()]=d}(s,r.batchId,t),await ci(s,r.changes),await Do(s.remoteStore)}catch(r){const i=Yl(r,"Failed to persist write");t.reject(i)}}async function Af(n,e){const t=K(n);try{const s=await sw(t.localStore,e);e.targetChanges.forEach((r,i)=>{const a=t.Na.get(i);a&&(ae(r.addedDocuments.size+r.modifiedDocuments.size+r.removedDocuments.size<=1),r.addedDocuments.size>0?a.va=!0:r.modifiedDocuments.size>0?ae(a.va):r.removedDocuments.size>0&&(ae(a.va),a.va=!1))}),await ci(t,s,e)}catch(s){await ri(s)}}function hd(n,e,t){const s=K(n);if(s.isPrimaryClient&&t===0||!s.isPrimaryClient&&t===1){const r=[];s.Fa.forEach((i,a)=>{const l=a.view.Z_(e);l.snapshot&&r.push(l.snapshot)}),function(a,l){const c=K(a);c.onlineState=l;let d=!1;c.queries.forEach((f,m)=>{for(const _ of m.j_)_.Z_(l)&&(d=!0)}),d&&Gl(c)}(s.eventManager,e),r.length&&s.Ca.d_(r),s.onlineState=e,s.isPrimaryClient&&s.sharedClientState.setOnlineState(e)}}async function qw(n,e,t){const s=K(n);s.sharedClientState.updateQueryState(e,"rejected",t);const r=s.Na.get(e),i=r&&r.key;if(i){let a=new Ee(q.comparator);a=a.insert(i,Xe.newNoDocument(i,G.min()));const l=ee().add(i),c=new Co(G.min(),new Map,new Ee(ie),a,l);await Af(s,c),s.Oa=s.Oa.remove(i),s.Na.delete(e),Kl(s)}else await Za(s.localStore,e,!1).then(()=>tl(s,e,t)).catch(ri)}async function Hw(n,e){const t=K(n),s=e.batch.batchId;try{const r=await nw(t.localStore,e);Pf(t,s,null),Rf(t,s),t.sharedClientState.updateMutationState(s,"acknowledged"),await ci(t,r)}catch(r){await ri(r)}}async function jw(n,e,t){const s=K(n);try{const r=await function(a,l){const c=K(a);return c.persistence.runTransaction("Reject batch","readwrite-primary",d=>{let f;return c.mutationQueue.lookupMutationBatch(d,l).next(m=>(ae(m!==null),f=m.keys(),c.mutationQueue.removeMutationBatch(d,m))).next(()=>c.mutationQueue.performConsistencyCheck(d)).next(()=>c.documentOverlayCache.removeOverlaysForBatchId(d,f,l)).next(()=>c.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(d,f)).next(()=>c.localDocuments.getDocuments(d,f))})}(s.localStore,e);Pf(s,e,t),Rf(s,e),s.sharedClientState.updateMutationState(e,"rejected",t),await ci(s,r)}catch(r){await ri(r)}}function Rf(n,e){(n.ka.get(e)||[]).forEach(t=>{t.resolve()}),n.ka.delete(e)}function Pf(n,e,t){const s=K(n);let r=s.Ba[s.currentUser.toKey()];if(r){const i=r.get(e);i&&(t?i.reject(t):i.resolve(),r=r.remove(e)),s.Ba[s.currentUser.toKey()]=r}}function tl(n,e,t=null){n.sharedClientState.removeLocalQueryTarget(e);for(const s of n.Ma.get(e))n.Fa.delete(s),t&&n.Ca.$a(s,t);n.Ma.delete(e),n.isPrimaryClient&&n.La.gr(e).forEach(s=>{n.La.containsKey(s)||Cf(n,s)})}function Cf(n,e){n.xa.delete(e.path.canonicalString());const t=n.Oa.get(e);t!==null&&($l(n.remoteStore,t),n.Oa=n.Oa.remove(e),n.Na.delete(t),Kl(n))}function fd(n,e,t){for(const s of t)s instanceof If?(n.La.addReference(s.key,e),Ww(n,s)):s instanceof Sf?(U("SyncEngine","Document no longer in limbo: "+s.key),n.La.removeReference(s.key,e),n.La.containsKey(s.key)||Cf(n,s.key)):W()}function Ww(n,e){const t=e.key,s=t.path.canonicalString();n.Oa.get(t)||n.xa.has(s)||(U("SyncEngine","New document in limbo: "+t),n.xa.add(s),Kl(n))}function Kl(n){for(;n.xa.size>0&&n.Oa.size<n.maxConcurrentLimboResolutions;){const e=n.xa.values().next().value;n.xa.delete(e);const t=new q(we.fromString(e)),s=n.qa.next();n.Na.set(s,new Lw(t)),n.Oa=n.Oa.insert(t,s),mf(n.remoteStore,new An(Ft(Nl(t.path)),s,"TargetPurposeLimboResolution",Rl.oe))}}async function ci(n,e,t){const s=K(n),r=[],i=[],a=[];s.Fa.isEmpty()||(s.Fa.forEach((l,c)=>{a.push(s.Ka(c,e,t).then(d=>{var f;if((d||t)&&s.isPrimaryClient){const m=d?!d.fromCache:(f=t==null?void 0:t.targetChanges.get(c.targetId))===null||f===void 0?void 0:f.current;s.sharedClientState.updateQueryState(c.targetId,m?"current":"not-current")}if(d){r.push(d);const m=Ul.Wi(c.targetId,d);i.push(m)}}))}),await Promise.all(a),s.Ca.d_(r),await async function(c,d){const f=K(c);try{await f.persistence.runTransaction("notifyLocalViewChanges","readwrite",m=>L.forEach(d,_=>L.forEach(_.$i,w=>f.persistence.referenceDelegate.addReference(m,_.targetId,w)).next(()=>L.forEach(_.Ui,w=>f.persistence.referenceDelegate.removeReference(m,_.targetId,w)))))}catch(m){if(!ii(m))throw m;U("LocalStore","Failed to update sequence numbers: "+m)}for(const m of d){const _=m.targetId;if(!m.fromCache){const w=f.os.get(_),T=w.snapshotVersion,C=w.withLastLimboFreeSnapshotVersion(T);f.os=f.os.insert(_,C)}}}(s.localStore,i))}async function Yw(n,e){const t=K(n);if(!t.currentUser.isEqual(e)){U("SyncEngine","User change. New user:",e.toKey());const s=await df(t.localStore,e);t.currentUser=e,function(i,a){i.ka.forEach(l=>{l.forEach(c=>{c.reject(new $(N.CANCELLED,a))})}),i.ka.clear()}(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,s.removedBatchIds,s.addedBatchIds),await ci(t,s.hs)}}function Gw(n,e){const t=K(n),s=t.Na.get(e);if(s&&s.va)return ee().add(s.key);{let r=ee();const i=t.Ma.get(e);if(!i)return r;for(const a of i){const l=t.Fa.get(a);r=r.unionWith(l.view.Va)}return r}}function kf(n){const e=K(n);return e.remoteStore.remoteSyncer.applyRemoteEvent=Af.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=Gw.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=qw.bind(null,e),e.Ca.d_=kw.bind(null,e.eventManager),e.Ca.$a=Mw.bind(null,e.eventManager),e}function Kw(n){const e=K(n);return e.remoteStore.remoteSyncer.applySuccessfulWrite=Hw.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=jw.bind(null,e),e}class uo{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=ko(e.databaseInfo.databaseId),this.sharedClientState=this.Wa(e),this.persistence=this.Ga(e),await this.persistence.start(),this.localStore=this.za(e),this.gcScheduler=this.ja(e,this.localStore),this.indexBackfillerScheduler=this.Ha(e,this.localStore)}ja(e,t){return null}Ha(e,t){return null}za(e){return tw(this.persistence,new Z_,e.initialUser,this.serializer)}Ga(e){return new Q_(zl.Zr,this.serializer)}Wa(e){return new lw}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}uo.provider={build:()=>new uo};class nl{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=s=>hd(this.syncEngine,s,1),this.remoteStore.remoteSyncer.handleCredentialChange=Yw.bind(null,this.syncEngine),await Rw(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new Cw}()}createDatastore(e){const t=ko(e.databaseInfo.databaseId),s=function(i){return new hw(i)}(e.databaseInfo);return function(i,a,l,c){return new mw(i,a,l,c)}(e.authCredentials,e.appCheckCredentials,s,t)}createRemoteStore(e){return function(s,r,i,a,l){return new yw(s,r,i,a,l)}(this.localStore,this.datastore,e.asyncQueue,t=>hd(this.syncEngine,t,0),function(){return ad.D()?new ad:new cw}())}createSyncEngine(e,t){return function(r,i,a,l,c,d,f){const m=new Ow(r,i,a,l,c,d);return f&&(m.Qa=!0),m}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await async function(r){const i=K(r);U("RemoteStore","RemoteStore shutting down."),i.L_.add(5),await li(i),i.k_.shutdown(),i.q_.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}}nl.provider={build:()=>new nl};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class Mf{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ya(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ya(this.observer.error,e):an("Uncaught Error in snapshot listener:",e.toString()))}Za(){this.muted=!0}Ya(e,t){setTimeout(()=>{this.muted||e(t)},0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qw{constructor(e,t,s,r,i){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=s,this.databaseInfo=r,this.user=Je.UNAUTHENTICATED,this.clientId=Mh.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(s,async a=>{U("FirestoreClient","Received user=",a.uid),await this.authCredentialListener(a),this.user=a}),this.appCheckCredentials.start(s,a=>(U("FirestoreClient","Received new app check token=",a),this.appCheckCredentialListener(a,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new sn;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const s=Yl(t,"Failed to shutdown persistence");e.reject(s)}}),e.promise}}async function Aa(n,e){n.asyncQueue.verifyOperationInProgress(),U("FirestoreClient","Initializing OfflineComponentProvider");const t=n.configuration;await e.initialize(t);let s=t.initialUser;n.setCredentialChangeListener(async r=>{s.isEqual(r)||(await df(e.localStore,r),s=r)}),e.persistence.setDatabaseDeletedListener(()=>n.terminate()),n._offlineComponents=e}async function pd(n,e){n.asyncQueue.verifyOperationInProgress();const t=await Jw(n);U("FirestoreClient","Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener(s=>ld(e.remoteStore,s)),n.setAppCheckTokenChangeListener((s,r)=>ld(e.remoteStore,r)),n._onlineComponents=e}async function Jw(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){U("FirestoreClient","Using user provided OfflineComponentProvider");try{await Aa(n,n._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!function(r){return r.name==="FirebaseError"?r.code===N.FAILED_PRECONDITION||r.code===N.UNIMPLEMENTED:!(typeof DOMException<"u"&&r instanceof DOMException)||r.code===22||r.code===20||r.code===11}(t))throw t;$s("Error using user provided cache. Falling back to memory cache: "+t),await Aa(n,new uo)}}else U("FirestoreClient","Using default OfflineComponentProvider"),await Aa(n,new uo);return n._offlineComponents}async function Df(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(U("FirestoreClient","Using user provided OnlineComponentProvider"),await pd(n,n._uninitializedComponentsProvider._online)):(U("FirestoreClient","Using default OnlineComponentProvider"),await pd(n,new nl))),n._onlineComponents}function Xw(n){return Df(n).then(e=>e.syncEngine)}async function Nf(n){const e=await Df(n),t=e.eventManager;return t.onListen=Vw.bind(null,e.syncEngine),t.onUnlisten=zw.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=Bw.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=Uw.bind(null,e.syncEngine),t}function Zw(n,e,t={}){const s=new sn;return n.asyncQueue.enqueueAndForget(async()=>function(i,a,l,c,d){const f=new Mf({next:_=>{f.Za(),a.enqueueAndForget(()=>Ef(i,m));const w=_.docs.has(l);!w&&_.fromCache?d.reject(new $(N.UNAVAILABLE,"Failed to get document because the client is offline.")):w&&_.fromCache&&c&&c.source==="server"?d.reject(new $(N.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):d.resolve(_)},error:_=>d.reject(_)}),m=new Tf(Nl(l.path),f,{includeMetadataChanges:!0,_a:!0});return bf(i,m)}(await Nf(n),n.asyncQueue,e,t,s)),s.promise}function eb(n,e,t={}){const s=new sn;return n.asyncQueue.enqueueAndForget(async()=>function(i,a,l,c,d){const f=new Mf({next:_=>{f.Za(),a.enqueueAndForget(()=>Ef(i,m)),_.fromCache&&c.source==="server"?d.reject(new $(N.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):d.resolve(_)},error:_=>d.reject(_)}),m=new Tf(l,f,{includeMetadataChanges:!0,_a:!0});return bf(i,m)}(await Nf(n),n.asyncQueue,e,t,s)),s.promise}/**
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
 */const md=new Map;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Of(n,e,t){if(!t)throw new $(N.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function tb(n,e,t,s){if(e===!0&&s===!0)throw new $(N.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function gd(n){if(!q.isDocumentKey(n))throw new $(N.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function yd(n){if(q.isDocumentKey(n))throw new $(N.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function Ql(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=function(s){return s.constructor?s.constructor.name:null}(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":W()}function Tt(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new $(N.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Ql(n);throw new $(N.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vd{constructor(e){var t,s;if(e.host===void 0){if(e.ssl!==void 0)throw new $(N.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(t=e.ssl)===null||t===void 0||t;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new $(N.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}tb("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Lf((s=e.experimentalLongPollingOptions)!==null&&s!==void 0?s:{}),function(i){if(i.timeoutSeconds!==void 0){if(isNaN(i.timeoutSeconds))throw new $(N.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (must not be NaN)`);if(i.timeoutSeconds<5)throw new $(N.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (minimum allowed value is 5)`);if(i.timeoutSeconds>30)throw new $(N.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(s,r){return s.timeoutSeconds===r.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class No{constructor(e,t,s,r){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=s,this._app=r,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new vd({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new $(N.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new $(N.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new vd(e),e.credentials!==void 0&&(this._authCredentials=function(s){if(!s)return new v0;switch(s.type){case"firstParty":return new E0(s.sessionIndex||"0",s.iamToken||null,s.authTokenFactory||null);case"provider":return s.client;default:throw new $(N.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(t){const s=md.get(t);s&&(U("ComponentProvider","Removing Datastore"),md.delete(t),s.terminate())}(this),Promise.resolve()}}function nb(n,e,t,s={}){var r;const i=(n=Tt(n,No))._getSettings(),a=`${e}:${t}`;if(i.host!=="firestore.googleapis.com"&&i.host!==a&&$s("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),n._setSettings(Object.assign(Object.assign({},i),{host:a,ssl:!1})),s.mockUserToken){let l,c;if(typeof s.mockUserToken=="string")l=s.mockUserToken,c=Je.MOCK_USER;else{l=Am(s.mockUserToken,(r=n._app)===null||r===void 0?void 0:r.options.projectId);const d=s.mockUserToken.sub||s.mockUserToken.user_id;if(!d)throw new $(N.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");c=new Je(d)}n._authCredentials=new _0(new kh(l,c))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lo{constructor(e,t,s){this.converter=t,this._query=s,this.type="query",this.firestore=e}withConverter(e){return new Lo(this.firestore,e,this._query)}}class dt{constructor(e,t,s){this.converter=t,this._key=s,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Dn(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new dt(this.firestore,e,this._key)}}class Dn extends Lo{constructor(e,t,s){super(e,t,Nl(s)),this._path=s,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new dt(this.firestore,null,new q(e))}withConverter(e){return new Dn(this.firestore,e,this._path)}}function sb(n,e,...t){if(n=Ce(n),Of("collection","path",e),n instanceof No){const s=we.fromString(e,...t);return yd(s),new Dn(n,null,s)}{if(!(n instanceof dt||n instanceof Dn))throw new $(N.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=n._path.child(we.fromString(e,...t));return yd(s),new Dn(n.firestore,null,s)}}function Gs(n,e,...t){if(n=Ce(n),arguments.length===1&&(e=Mh.newId()),Of("doc","path",e),n instanceof No){const s=we.fromString(e,...t);return gd(s),new dt(n,null,new q(s))}{if(!(n instanceof dt||n instanceof Dn))throw new $(N.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=n._path.child(we.fromString(e,...t));return gd(s),new dt(n.firestore,n instanceof Dn?n.converter:null,new q(s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _d{constructor(e=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new ff(this,"async_queue_retry"),this.Vu=()=>{const s=xa();s&&U("AsyncQueue","Visibility state changed to "+s.visibilityState),this.t_.jo()},this.mu=e;const t=xa();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.fu(),this.gu(e)}enterRestrictedMode(e){if(!this.Iu){this.Iu=!0,this.Au=e||!1;const t=xa();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.Vu)}}enqueue(e){if(this.fu(),this.Iu)return new Promise(()=>{});const t=new sn;return this.gu(()=>this.Iu&&this.Au?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Pu.push(e),this.pu()))}async pu(){if(this.Pu.length!==0){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(e){if(!ii(e))throw e;U("AsyncQueue","Operation failed with retryable error: "+e)}this.Pu.length>0&&this.t_.Go(()=>this.pu())}}gu(e){const t=this.mu.then(()=>(this.du=!0,e().catch(s=>{this.Eu=s,this.du=!1;const r=function(a){let l=a.message||"";return a.stack&&(l=a.stack.includes(a.message)?a.stack:a.message+`
`+a.stack),l}(s);throw an("INTERNAL UNHANDLED ERROR: ",r),s}).then(s=>(this.du=!1,s))));return this.mu=t,t}enqueueAfterDelay(e,t,s){this.fu(),this.Ru.indexOf(e)>-1&&(t=0);const r=Wl.createAndSchedule(this,e,t,s,i=>this.yu(i));return this.Tu.push(r),r}fu(){this.Eu&&W()}verifyOperationInProgress(){}async wu(){let e;do e=this.mu,await e;while(e!==this.mu)}Su(e){for(const t of this.Tu)if(t.timerId===e)return!0;return!1}bu(e){return this.wu().then(()=>{this.Tu.sort((t,s)=>t.targetTimeMs-s.targetTimeMs);for(const t of this.Tu)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.wu()})}Du(e){this.Ru.push(e)}yu(e){const t=this.Tu.indexOf(e);this.Tu.splice(t,1)}}class $n extends No{constructor(e,t,s,r){super(e,t,s,r),this.type="firestore",this._queue=new _d,this._persistenceKey=(r==null?void 0:r.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new _d(e),this._firestoreClient=void 0,await e}}}function rb(n,e){const t=typeof n=="object"?n:qd(),s=typeof n=="string"?n:"(default)",r=ml(t,"firestore").getImmediate({identifier:s});if(!r._initialized){const i=Sm("firestore");i&&nb(r,...i)}return r}function Oo(n){if(n._terminated)throw new $(N.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||ib(n),n._firestoreClient}function ib(n){var e,t,s;const r=n._freezeSettings(),i=function(l,c,d,f){return new L0(l,c,d,f.host,f.ssl,f.experimentalForceLongPolling,f.experimentalAutoDetectLongPolling,Lf(f.experimentalLongPollingOptions),f.useFetchStreams)}(n._databaseId,((e=n._app)===null||e===void 0?void 0:e.options.appId)||"",n._persistenceKey,r);n._componentsProvider||!((t=r.localCache)===null||t===void 0)&&t._offlineComponentProvider&&(!((s=r.localCache)===null||s===void 0)&&s._onlineComponentProvider)&&(n._componentsProvider={_offline:r.localCache._offlineComponentProvider,_online:r.localCache._onlineComponentProvider}),n._firestoreClient=new Qw(n._authCredentials,n._appCheckCredentials,n._queue,i,n._componentsProvider&&function(l){const c=l==null?void 0:l._online.build();return{_offline:l==null?void 0:l._offline.build(c),_online:c}}(n._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ks{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Ks(We.fromBase64String(e))}catch(t){throw new $(N.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new Ks(We.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ui{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new $(N.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new He(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jl{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xl{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new $(N.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new $(N.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return ie(this._lat,e._lat)||ie(this._long,e._long)}}/**
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
 */class Zl{constructor(e){this._values=(e||[]).map(t=>t)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(s,r){if(s.length!==r.length)return!1;for(let i=0;i<s.length;++i)if(s[i]!==r[i])return!1;return!0}(this._values,e._values)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ob=/^__.*__$/;class ab{constructor(e,t,s){this.data=e,this.fieldMask=t,this.fieldTransforms=s}toMutation(e,t){return this.fieldMask!==null?new Un(e,this.data,this.fieldMask,t,this.fieldTransforms):new oi(e,this.data,t,this.fieldTransforms)}}class Vf{constructor(e,t,s){this.data=e,this.fieldMask=t,this.fieldTransforms=s}toMutation(e,t){return new Un(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function Bf(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw W()}}class ec{constructor(e,t,s,r,i,a){this.settings=e,this.databaseId=t,this.serializer=s,this.ignoreUndefinedProperties=r,i===void 0&&this.vu(),this.fieldTransforms=i||[],this.fieldMask=a||[]}get path(){return this.settings.path}get Cu(){return this.settings.Cu}Fu(e){return new ec(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Mu(e){var t;const s=(t=this.path)===null||t===void 0?void 0:t.child(e),r=this.Fu({path:s,xu:!1});return r.Ou(e),r}Nu(e){var t;const s=(t=this.path)===null||t===void 0?void 0:t.child(e),r=this.Fu({path:s,xu:!1});return r.vu(),r}Lu(e){return this.Fu({path:void 0,xu:!0})}Bu(e){return ho(e,this.settings.methodName,this.settings.ku||!1,this.path,this.settings.qu)}contains(e){return this.fieldMask.find(t=>e.isPrefixOf(t))!==void 0||this.fieldTransforms.find(t=>e.isPrefixOf(t.field))!==void 0}vu(){if(this.path)for(let e=0;e<this.path.length;e++)this.Ou(this.path.get(e))}Ou(e){if(e.length===0)throw this.Bu("Document fields must not be empty");if(Bf(this.Cu)&&ob.test(e))throw this.Bu('Document fields cannot begin and end with "__"')}}class lb{constructor(e,t,s){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=s||ko(e)}Qu(e,t,s,r=!1){return new ec({Cu:e,methodName:t,qu:s,path:He.emptyPath(),xu:!1,ku:r},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Vo(n){const e=n._freezeSettings(),t=ko(n._databaseId);return new lb(n._databaseId,!!e.ignoreUndefinedProperties,t)}function tc(n,e,t,s,r,i={}){const a=n.Qu(i.merge||i.mergeFields?2:0,e,t,r);nc("Data must be an object, but it was:",a,s);const l=Uf(s,a);let c,d;if(i.merge)c=new gt(a.fieldMask),d=a.fieldTransforms;else if(i.mergeFields){const f=[];for(const m of i.mergeFields){const _=sl(e,m,t);if(!a.contains(_))throw new $(N.INVALID_ARGUMENT,`Field '${_}' is specified in your field mask but missing from your input data.`);qf(f,_)||f.push(_)}c=new gt(f),d=a.fieldTransforms.filter(m=>c.covers(m.field))}else c=null,d=a.fieldTransforms;return new ab(new ct(l),c,d)}class Bo extends Jl{_toFieldTransform(e){if(e.Cu!==2)throw e.Cu===1?e.Bu(`${this._methodName}() can only appear at the top level of your update data`):e.Bu(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof Bo}}function Ff(n,e,t,s){const r=n.Qu(1,e,t);nc("Data must be an object, but it was:",r,s);const i=[],a=ct.empty();fs(s,(c,d)=>{const f=sc(e,c,t);d=Ce(d);const m=r.Nu(f);if(d instanceof Bo)i.push(f);else{const _=Fo(d,m);_!=null&&(i.push(f),a.set(f,_))}});const l=new gt(i);return new Vf(a,l,r.fieldTransforms)}function zf(n,e,t,s,r,i){const a=n.Qu(1,e,t),l=[sl(e,s,t)],c=[r];if(i.length%2!=0)throw new $(N.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let _=0;_<i.length;_+=2)l.push(sl(e,i[_])),c.push(i[_+1]);const d=[],f=ct.empty();for(let _=l.length-1;_>=0;--_)if(!qf(d,l[_])){const w=l[_];let T=c[_];T=Ce(T);const C=a.Nu(w);if(T instanceof Bo)d.push(w);else{const x=Fo(T,C);x!=null&&(d.push(w),f.set(w,x))}}const m=new gt(d);return new Vf(f,m,a.fieldTransforms)}function Fo(n,e){if($f(n=Ce(n)))return nc("Unsupported field value:",e,n),Uf(n,e);if(n instanceof Jl)return function(s,r){if(!Bf(r.Cu))throw r.Bu(`${s._methodName}() can only be used with update() and set()`);if(!r.path)throw r.Bu(`${s._methodName}() is not currently supported inside arrays`);const i=s._toFieldTransform(r);i&&r.fieldTransforms.push(i)}(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.xu&&e.Cu!==4)throw e.Bu("Nested arrays are not supported");return function(s,r){const i=[];let a=0;for(const l of s){let c=Fo(l,r.Lu(a));c==null&&(c={nullValue:"NULL_VALUE"}),i.push(c),a++}return{arrayValue:{values:i}}}(n,e)}return function(s,r){if((s=Ce(s))===null)return{nullValue:"NULL_VALUE"};if(typeof s=="number")return r_(r.serializer,s);if(typeof s=="boolean")return{booleanValue:s};if(typeof s=="string")return{stringValue:s};if(s instanceof Date){const i=Le.fromDate(s);return{timestampValue:lo(r.serializer,i)}}if(s instanceof Le){const i=new Le(s.seconds,1e3*Math.floor(s.nanoseconds/1e3));return{timestampValue:lo(r.serializer,i)}}if(s instanceof Xl)return{geoPointValue:{latitude:s.latitude,longitude:s.longitude}};if(s instanceof Ks)return{bytesValue:sf(r.serializer,s._byteString)};if(s instanceof dt){const i=r.databaseId,a=s.firestore._databaseId;if(!a.isEqual(i))throw r.Bu(`Document reference is for database ${a.projectId}/${a.database} but should be for database ${i.projectId}/${i.database}`);return{referenceValue:Bl(s.firestore._databaseId||r.databaseId,s._key.path)}}if(s instanceof Zl)return function(a,l){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:a.toArray().map(c=>{if(typeof c!="number")throw l.Bu("VectorValues must only contain numeric values.");return Ll(l.serializer,c)})}}}}}}(s,r);throw r.Bu(`Unsupported field value: ${Ql(s)}`)}(n,e)}function Uf(n,e){const t={};return Dh(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):fs(n,(s,r)=>{const i=Fo(r,e.Mu(s));i!=null&&(t[s]=i)}),{mapValue:{fields:t}}}function $f(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof Le||n instanceof Xl||n instanceof Ks||n instanceof dt||n instanceof Jl||n instanceof Zl)}function nc(n,e,t){if(!$f(t)||!function(r){return typeof r=="object"&&r!==null&&(Object.getPrototypeOf(r)===Object.prototype||Object.getPrototypeOf(r)===null)}(t)){const s=Ql(t);throw s==="an object"?e.Bu(n+" a custom object"):e.Bu(n+" "+s)}}function sl(n,e,t){if((e=Ce(e))instanceof ui)return e._internalPath;if(typeof e=="string")return sc(n,e);throw ho("Field path arguments must be of type string or ",n,!1,void 0,t)}const cb=new RegExp("[~\\*/\\[\\]]");function sc(n,e,t){if(e.search(cb)>=0)throw ho(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new ui(...e.split("."))._internalPath}catch{throw ho(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function ho(n,e,t,s,r){const i=s&&!s.isEmpty(),a=r!==void 0;let l=`Function ${e}() called with invalid data`;t&&(l+=" (via `toFirestore()`)"),l+=". ";let c="";return(i||a)&&(c+=" (found",i&&(c+=` in field ${s}`),a&&(c+=` in document ${r}`),c+=")"),new $(N.INVALID_ARGUMENT,l+n+c)}function qf(n,e){return n.some(t=>t.isEqual(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hf{constructor(e,t,s,r,i){this._firestore=e,this._userDataWriter=t,this._key=s,this._document=r,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new dt(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new ub(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(jf("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class ub extends Hf{data(){return super.data()}}function jf(n,e){return typeof e=="string"?sc(n,e):e instanceof ui?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function db(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new $(N.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class hb{convertValue(e,t="none"){switch(cs(e)){case 0:return null;case 1:return e.booleanValue;case 2:return xe(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(ls(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw W()}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const s={};return fs(e,(r,i)=>{s[r]=this.convertValue(i,t)}),s}convertVectorValue(e){var t,s,r;const i=(r=(s=(t=e.fields)===null||t===void 0?void 0:t.value.arrayValue)===null||s===void 0?void 0:s.values)===null||r===void 0?void 0:r.map(a=>xe(a.doubleValue));return new Zl(i)}convertGeoPoint(e){return new Xl(xe(e.latitude),xe(e.longitude))}convertArray(e,t){return(e.values||[]).map(s=>this.convertValue(s,t))}convertServerTimestamp(e,t){switch(t){case"previous":const s=Cl(e);return s==null?null:this.convertValue(s,t);case"estimate":return this.convertTimestamp($r(e));default:return null}}convertTimestamp(e){const t=Bn(e);return new Le(t.seconds,t.nanos)}convertDocumentKey(e,t){const s=we.fromString(e);ae(uf(s));const r=new qr(s.get(1),s.get(3)),i=new q(s.popFirst(5));return r.isEqual(t)||an(`Document ${i} contains a document reference within a different database (${r.projectId}/${r.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rc(n,e,t){let s;return s=n?t&&(t.merge||t.mergeFields)?n.toFirestore(e,t):n.toFirestore(e):e,s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pr{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class Wf extends Hf{constructor(e,t,s,r,i,a){super(e,t,s,r,a),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new Hi(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const s=this._document.data.field(jf("DocumentSnapshot.get",e));if(s!==null)return this._userDataWriter.convertValue(s,t.serverTimestamps)}}}class Hi extends Wf{data(e={}){return super.data(e)}}class fb{constructor(e,t,s,r){this._firestore=e,this._userDataWriter=t,this._snapshot=r,this.metadata=new Pr(r.hasPendingWrites,r.fromCache),this.query=s}get docs(){const e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach(s=>{e.call(t,new Hi(this._firestore,this._userDataWriter,s.key,s,new Pr(this._snapshot.mutatedKeys.has(s.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new $(N.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(r,i){if(r._snapshot.oldDocs.isEmpty()){let a=0;return r._snapshot.docChanges.map(l=>{const c=new Hi(r._firestore,r._userDataWriter,l.doc.key,l.doc,new Pr(r._snapshot.mutatedKeys.has(l.doc.key),r._snapshot.fromCache),r.query.converter);return l.doc,{type:"added",doc:c,oldIndex:-1,newIndex:a++}})}{let a=r._snapshot.oldDocs;return r._snapshot.docChanges.filter(l=>i||l.type!==3).map(l=>{const c=new Hi(r._firestore,r._userDataWriter,l.doc.key,l.doc,new Pr(r._snapshot.mutatedKeys.has(l.doc.key),r._snapshot.fromCache),r.query.converter);let d=-1,f=-1;return l.type!==0&&(d=a.indexOf(l.doc.key),a=a.delete(l.doc.key)),l.type!==1&&(a=a.add(l.doc),f=a.indexOf(l.doc.key)),{type:pb(l.type),doc:c,oldIndex:d,newIndex:f}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}}function pb(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return W()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mb(n){n=Tt(n,dt);const e=Tt(n.firestore,$n);return Zw(Oo(e),n._key).then(t=>bb(e,n,t))}class Yf extends hb{constructor(e){super(),this.firestore=e}convertBytes(e){return new Ks(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new dt(this.firestore,null,t)}}function gb(n){n=Tt(n,Lo);const e=Tt(n.firestore,$n),t=Oo(e),s=new Yf(e);return db(n._query),eb(t,n._query).then(r=>new fb(e,s,n,r))}function yb(n,e,t){n=Tt(n,dt);const s=Tt(n.firestore,$n),r=rc(n.converter,e,t);return di(s,[tc(Vo(s),"setDoc",n._key,r,n.converter!==null,t).toMutation(n._key,it.none())])}function vb(n,e,t,...s){n=Tt(n,dt);const r=Tt(n.firestore,$n),i=Vo(r);let a;return a=typeof(e=Ce(e))=="string"||e instanceof ui?zf(i,"updateDoc",n._key,e,t,s):Ff(i,"updateDoc",n._key,e),di(r,[a.toMutation(n._key,it.exists(!0))])}function _b(n){return di(Tt(n.firestore,$n),[new Po(n._key,it.none())])}function wb(n,e){const t=Tt(n.firestore,$n),s=Gs(n),r=rc(n.converter,e);return di(t,[tc(Vo(n.firestore),"addDoc",s._key,r,n.converter!==null,{}).toMutation(s._key,it.exists(!1))]).then(()=>s)}function di(n,e){return function(s,r){const i=new sn;return s.asyncQueue.enqueueAndForget(async()=>$w(await Xw(s),r,i)),i.promise}(Oo(n),e)}function bb(n,e,t){const s=t.docs.get(e._key),r=new Yf(n);return new Wf(n,r,e._key,s,new Pr(t.hasPendingWrites,t.fromCache),e.converter)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Eb{constructor(e,t){this._firestore=e,this._commitHandler=t,this._mutations=[],this._committed=!1,this._dataReader=Vo(e)}set(e,t,s){this._verifyNotCommitted();const r=Ra(e,this._firestore),i=rc(r.converter,t,s),a=tc(this._dataReader,"WriteBatch.set",r._key,i,r.converter!==null,s);return this._mutations.push(a.toMutation(r._key,it.none())),this}update(e,t,s,...r){this._verifyNotCommitted();const i=Ra(e,this._firestore);let a;return a=typeof(t=Ce(t))=="string"||t instanceof ui?zf(this._dataReader,"WriteBatch.update",i._key,t,s,r):Ff(this._dataReader,"WriteBatch.update",i._key,t),this._mutations.push(a.toMutation(i._key,it.exists(!0))),this}delete(e){this._verifyNotCommitted();const t=Ra(e,this._firestore);return this._mutations=this._mutations.concat(new Po(t._key,it.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new $(N.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function Ra(n,e){if((n=Ce(n)).firestore!==e)throw new $(N.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gf(n){return Oo(n=Tt(n,$n)),new Eb(n,e=>di(n,e))}(function(e,t=!0){(function(r){Zs=r})(Js),zs(new rs("firestore",(s,{instanceIdentifier:r,options:i})=>{const a=s.getProvider("app").getImmediate(),l=new $n(new w0(s.getProvider("auth-internal")),new I0(s.getProvider("app-check-internal")),function(d,f){if(!Object.prototype.hasOwnProperty.apply(d.options,["projectId"]))throw new $(N.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new qr(d.options.projectId,f)}(a,r),a);return i=Object.assign({useFetchStreams:t},i),l._setSettings(i),l},"PUBLIC").setMultipleInstances(!0)),Mn(Bu,"4.7.3",e),Mn(Bu,"4.7.3","esm2017")})();const Kf={apiKey:"AIzaSyBdbve0H70D-Ch69WlaxEly7PVBFVRB5p0",authDomain:"pensiontools-4b237.firebaseapp.com",projectId:"pensiontools-4b237",storageBucket:"pensiontools-4b237.firebasestorage.app",messagingSenderId:"760877353696",appId:"1:760877353696:web:2d6f7173c8d7fab6fd9e85",measurementId:"G-80XX542QZE"};function Oe(){return Kf.apiKey!=="YOUR_API_KEY"}let Pa=null,yt=null,ut=null;try{Oe()?(Pa=$d(Kf),yt=g0(Pa),ut=rb(Pa)):console.warn("Firebase not configured. Login required to save data.")}catch(n){console.error("Firebase initialization error:",n)}const Tb=new Jt;let xn=null,Or=[];function Ib(){if(!Oe()||!yt){console.warn("Firebase not configured - auth disabled");return}rv(yt,n=>{console.log("onAuthStateChanged fired:",n?n.email:"null"),xn=n,console.log("Notifying",Or.length,"listeners"),Or.forEach(e=>e(n))})}function Sb(n){return console.log("onAuthStateChange: adding listener, currentUser is:",xn&&xn.email),Or.push(n),xn&&(console.log("onAuthStateChange: immediately calling listener with user"),n(xn)),()=>{Or=Or.filter(e=>e!==n)}}function ms(){return xn}function ft(){return xn!==null}async function xb(n,e,t=null){if(!Oe()||!yt)throw new Error("Firebase not configured");const s=await Xy(yt,n,e);return t&&s.user&&await tv(s.user,{displayName:t}),s}async function Ab(n,e){if(!Oe()||!yt)throw new Error("Firebase not configured");return Zy(yt,n,e)}async function Rb(){if(!Oe()||!yt)throw new Error("Firebase not configured");console.log("Initiating Google sign-in popup...");try{const n=await Sv(yt,Tb);return console.log("Google sign-in successful:",n.user.email),n}catch(n){throw console.error("signInWithPopup error:",n.code,n.message),n}}async function Qf(){if(!Oe()||!yt)throw new Error("Firebase not configured");return iv(yt)}async function Pb(n){if(!Oe()||!yt)throw new Error("Firebase not configured");return Jy(yt,n)}Ib();function xs(...n){return n.find(e=>e!==void 0)}function Cb(n){if(!n||typeof n!="object")return{scenario:n,migrated:!1};const e=Object.keys(n).filter(c=>c.includes(".")),t="decisionSettings"in n||"stressSettings"in n||"name"in n||"description"in n||"taxYears"in n;if(!(e.length>0||t))return{scenario:n,migrated:!1};const r=n.decisionTool||{},i=n.stressTool||{},a=n.planDetails||{},l={isActive:n.isActive??!1,enabledTools:n.enabledTools||["stress","decision"],planDetails:{name:xs(n["planDetails.name"],a.name,n.name)??"My Plan",description:xs(n["planDetails.description"],a.description,n.description)??""},decisionTool:{settings:xs(n["decisionTool.settings"],r.settings,n.decisionSettings)??{},history:xs(n["decisionTool.history"],r.history)??[],taxYears:xs(n["decisionTool.taxYears"],r.taxYears,n.taxYears)??{}},stressTool:{settings:xs(n["stressTool.settings"],i.settings,n.stressSettings)??{}}};return n.id!==void 0&&(l.id=n.id),n.createdAt!==void 0&&(l.createdAt=n.createdAt),n.lastModified!==void 0&&(l.lastModified=n.lastModified),{scenario:l,migrated:!0}}function ic(n,e="settings"){const t=ms();return!t||!ut?null:Gs(ut,"users",t.uid,n,e)}function Jf(n){const e=ms();return!e||!ut?null:sb(ut,"users",e.uid,n)}async function Xf(n){const{scenario:e,migrated:t}=Cb(n);if(t){const s=ms();if(s&&ut)try{const{id:r,...i}=e;await yb(Gs(ut,"users",s.uid,"scenarios",r),i)}catch(r){console.error("Scenario migration write failed:",r)}}return e}async function zo(){if(!Oe())return[];const n=Jf("scenarios");if(!n)return[];try{const e=await gb(n),t=[];return e.forEach(s=>{t.push({id:s.id,...s.data()})}),Promise.all(t.map(s=>Xf(s)))}catch(e){return console.error("Error loading scenarios:",e),[]}}async function kb(n){if(!Oe())return null;const e=ic("scenarios",n);if(!e)return null;try{const t=await mb(e);return t.exists()?Xf({id:t.id,...t.data()}):null}catch(t){return console.error("Error loading scenario:",t),null}}async function gs(n,e){if(!Oe())return;const t=ic("scenarios",n);if(t)try{await vb(t,{...e,lastModified:new Date().toISOString()})}catch(s){throw console.error("Error saving scenario:",s),s}}async function Zf(n){if(!Oe())return null;const e=Jf("scenarios");if(!e)return null;try{return(await wb(e,{...n,createdAt:new Date().toISOString(),lastModified:new Date().toISOString()})).id}catch(t){throw console.error("Error creating scenario:",t),t}}async function Mb(n){if(!Oe())return;const e=ic("scenarios",n);if(e)try{await _b(e)}catch(t){throw console.error("Error deleting scenario:",t),t}}async function oc(n){if(!Oe())return;const e=ms();if(!(!e||!ut))try{const t=await zo(),s=Gf(ut);for(const r of t){const i=Gs(ut,"users",e.uid,"scenarios",r.id);r.id===n?s.update(i,{isActive:!0}):r.isActive&&s.update(i,{isActive:!1})}await s.commit()}catch(t){throw console.error("Error setting active scenario:",t),t}}async function Db(){if(!Oe())return;const n=ms();if(!(!n||!ut))try{const e=await zo(),t=Gf(ut);for(const s of e)t.delete(Gs(ut,"users",n.uid,"scenarios",s.id));t.delete(Gs(ut,"users",n.uid,"profile","settings")),await t.commit(),console.log("All user data wiped successfully")}catch(e){throw console.error("Error wiping user data:",e),e}}async function Nb(){return Oe()?(await zo()).length>0:!1}let Vs=null,Pe=null;function qn(){return Oe()&&ft()}function fn(){Vs=null,Pe=null}function ac(){return{equityMin:ce.EQUITY_MIN,bondMin:ce.BOND_MIN,cashTarget:ce.CASH_TARGET,duration:ce.DURATION_YEARS,baseSalary:ce.BASE_SALARY,other:0,statePension:12e3,statePensionYear:12,pa:Fe.PERSONAL_ALLOWANCE,brl:Fe.BASIC_RATE_LIMIT,hrl:Fe.HIGHER_RATE_LIMIT,taxMode:"inflates",protectionMult:ts.PROTECTION_MULTIPLIER,consecutiveLimit:ce.CONSECUTIVE_LIMIT,disableProtection:!1,hodlEnabled:ts.HODL_ENABLED,hodlValue:ts.HODL_VALUE,isaBalance:0,isaReturn:Pt.RETURN,isaMin:Pt.MIN,isaDrawdownStrategy:Pt.DRAWDOWN_STRATEGY}}function ep(){return{equityMin:ce.EQUITY_MIN,bondMin:ce.BOND_MIN,cashTarget:ce.CASH_TARGET,duration:ce.DURATION_YEARS,baseSalary:ce.BASE_SALARY,protectionFactor:ce.PROTECTION_FACTOR,recoveryBuffer:ce.RECOVERY_BUFFER,consecutiveLimit:ce.CONSECUTIVE_LIMIT,spStartDate:null,spWeeklyAmount:0,statePension:0,statePensionYear:0,isaBalance:0,isaReturn:Pt.RETURN,isaMin:Pt.MIN,isaDrawdownStrategy:Pt.DRAWDOWN_STRATEGY}}function Lb(n,e={},t=new Date().toISOString()){const s=n||{};return{...ac(),...e,equityMin:s.equityMin,bondMin:s.bondMin,cashTarget:s.cashTarget,duration:s.duration,baseSalary:s.baseSalary,spStartDate:s.spStartDate??e.spStartDate??null,spWeeklyAmount:s.spWeeklyAmount??e.spWeeklyAmount??0,consecutiveLimit:s.consecutiveLimit,recoveryBuffer:s.recoveryBuffer,protectionMult:s.protectionFactor!=null?1-s.protectionFactor/100:e.protectionMult??ts.PROTECTION_MULTIPLIER,isaBalance:s.isaBalance??0,isaReturn:s.isaReturn??Pt.RETURN,isaMin:s.isaMin??Pt.MIN,isaDrawdownStrategy:s.isaDrawdownStrategy??Pt.DRAWDOWN_STRATEGY,seededFrom:"decision",seededAt:t,decisionChecksum:hl(s)}}function tp(){return{}}function Ob(n="My Plan",e="",t=["stress","decision"]){return{planDetails:{name:n,description:e},enabledTools:t,isActive:!0,decisionTool:{settings:ep(),history:[],taxYears:tp()},stressTool:{settings:ac()}}}async function lc(){if(Vs)return Vs;if(!qn())return[];try{const n=await zo();return Vs=n,n}catch(n){return console.error("Error listing scenarios:",n),[]}}async function Dt(){if(Pe)return Pe;if(!qn())return null;try{const e=(await lc()).find(t=>t.isActive);return e?(Pe=e,e):null}catch(n){return console.error("Error getting active scenario:",n),null}}async function Vb(n,e,t,s={},r=!0){if(!qn())throw new Error("Must be logged in to create scenarios");const i=Ob(n,e,t);if(s.stressSettings&&(i.stressTool.settings={...i.stressTool.settings,...s.stressSettings}),s.decisionSettings&&(i.decisionTool.settings={...i.decisionTool.settings,...s.decisionSettings}),s.taxYears&&(i.decisionTool.taxYears=s.taxYears),i.isActive=r,r&&Vs){const l=Vs.find(c=>c.isActive);l&&(await oc(null),await gs(l.id,{isActive:!1}))}const a=await Zf(i);return fn(),a}async function Bb(n){if(!qn())throw new Error("Must be logged in to switch scenarios");await oc(n),fn()}async function Fb(n,e){if(!qn())throw new Error("Must be logged in to duplicate scenarios");const t=await kb(n);if(!t)throw new Error("Source scenario not found");const{id:s,createdAt:r,lastModified:i,...a}=t;a.planDetails={...a.planDetails,name:e},a.isActive=!1;const l=await Zf(a);return fn(),l}async function zb(n,e){if(!qn())throw new Error("Must be logged in to rename scenarios");await gs(n,{"planDetails.name":e}),fn()}async function Ub(n,e){if(!qn())throw new Error("Must be logged in to update scenarios");await gs(n,{enabledTools:e}),fn()}async function $b(n){if(!qn())throw new Error("Must be logged in to delete scenarios");const e=await lc();if(e.length<=1)throw new Error("Cannot delete the last scenario");const t=e.find(s=>s.id===n);if(t!=null&&t.isActive){const s=e.find(r=>r.id!==n);s&&await oc(s.id)}await Mb(n),fn()}async function qb(){var e;const n=await Dt();return((e=n==null?void 0:n.stressTool)==null?void 0:e.settings)||ac()}async function np(n){const e=await Dt();if(!e)throw new Error("No active scenario");await gs(e.id,{"stressTool.settings":n}),Pe&&(Pe.stressTool||(Pe.stressTool={}),Pe.stressTool.settings=n)}async function Hb(){var e;const n=await Dt();return((e=n==null?void 0:n.decisionTool)==null?void 0:e.settings)||ep()}async function jb(n){const e=await Dt();if(!e)throw new Error("No active scenario");await gs(e.id,{"decisionTool.settings":n}),Pe&&(Pe.decisionTool||(Pe.decisionTool={}),Pe.decisionTool.settings=n)}async function Wb(){var e;const n=await Dt();return((e=n==null?void 0:n.decisionTool)==null?void 0:e.taxYears)||tp()}async function Yb(n){const e=await Dt();if(!e)throw new Error("No active scenario");await gs(e.id,{"decisionTool.taxYears":n}),Pe&&(Pe.decisionTool||(Pe.decisionTool={}),Pe.decisionTool.taxYears=n)}async function Gb(){var e;const n=await Dt();return((e=n==null?void 0:n.decisionTool)==null?void 0:e.history)||[]}async function sp(n){const e=await Dt();if(!e)throw new Error("No active scenario");await gs(e.id,{"decisionTool.history":n}),Pe&&(Pe.decisionTool||(Pe.decisionTool={}),Pe.decisionTool.history=n)}async function rp(){const n=await Dt();return(n==null?void 0:n.enabledTools)||["stress","decision"]}let Nn=null;function ji(){return{settings:{equityMin:ce.EQUITY_MIN,bondMin:ce.BOND_MIN,cashTarget:ce.CASH_TARGET,duration:ce.DURATION_YEARS,baseSalary:ce.BASE_SALARY,protectionFactor:ce.PROTECTION_FACTOR,recoveryBuffer:ce.RECOVERY_BUFFER,consecutiveLimit:ce.CONSECUTIVE_LIMIT,startDate:null,spStartDate:null,spWeeklyAmount:0,statePension:0,statePensionYear:0},taxYears:{},history:[],lastModified:null,checksum:null}}function Uo(){return Oe()&&ft()}function us(){Nn=null}function ip(){return Nn||ji()}async function jt(){if(Nn)return Nn;if(!Uo())return console.warn("Firebase not available - returning defaults"),ji();try{const[n,e,t]=await Promise.all([Hb(),Wb(),Gb()]),s={settings:n||ji().settings,taxYears:e||{},history:t||[],lastModified:new Date().toISOString(),checksum:null};return s.checksum=op(s),Nn=s,s}catch(n){console.error("Error loading decision data:",n)}return ji()}async function $o(n){if(!Uo())throw new Error("Must be logged in to save data");try{n.lastModified=new Date().toISOString(),n.checksum=op(n),await Promise.all([jb(n.settings),Yb(n.taxYears)]),Nn=n}catch(e){throw console.error("Error saving decision data:",e),new Error("Failed to save decision data")}}function op(n){const e={settings:n.settings,taxYears:n.taxYears,historyCount:n.history.length,lastHistoryDate:n.history.length>0?n.history[n.history.length-1].date:null};return hl(e)}async function pn(){return(await jt()).settings}async function cc(n){const e=await jt();e.settings={...e.settings,...n},await $o(e)}function uc(){return{pa:Fe.PERSONAL_ALLOWANCE,brl:Fe.BASIC_RATE_LIMIT,hrl:Fe.HIGHER_RATE_LIMIT,cpi:.04,other:0,isaSavingsAllocation:0,isaSavingsUsed:0,isaContribution:0,isTaxEfficient:!0,taxEfficiencyChoice:null,grossIncomeToDate:0,startMonth:4,yearSetupComplete:!1,confirmedSalary:null}}function Kb(n){const t=ip().taxYears[n];return t||uc()}async function qo(n){const t=(await jt()).taxYears[n];return t||uc()}async function ys(n,e){console.log(`saveTaxYearConfig: Saving tax year ${n}`,e);const t=await jt();t.taxYears[n]={...Kb(n),...e},await $o(t),console.log(`saveTaxYearConfig: Saved tax year ${n}, yearSetupComplete=${t.taxYears[n].yearSetupComplete}`)}async function Qb(n){const e=Nn||await jt(),t=(e.history||[]).filter(r=>r.taxYear===n),s=t.reduce((r,i)=>r+(i.isa||0),0);return console.log(`recalculateIsaSavingsUsed: Tax year ${n}, found ${t.length} records, total ISA used: ${s}`),console.log("recalculateIsaSavingsUsed: History records:",t.map(r=>({date:r.date,isa:r.isa}))),e.taxYears[n]||(console.log(`recalculateIsaSavingsUsed: No existing config for ${n}, creating default`),e.taxYears[n]=uc()),console.log(`recalculateIsaSavingsUsed: Before update, isaSavingsUsed=${e.taxYears[n].isaSavingsUsed}`),e.taxYears[n].isaSavingsUsed=s,console.log(`recalculateIsaSavingsUsed: After update, isaSavingsUsed=${e.taxYears[n].isaSavingsUsed}`),await $o(e),console.log("recalculateIsaSavingsUsed: Saved to Firebase"),s}async function Jb(n){const e=await qo(n),t=e.yearSetupComplete===!0;return console.log(`isYearSetupComplete: Tax year ${n}, yearSetupComplete=${e.yearSetupComplete}, result=${t}`),t}async function Hn(){return(await jt()).taxYears}function Xb(n={}){let t=[...ip().history];return n.taxYear&&(t=t.filter(s=>s.taxYear===n.taxYear)),n.startDate&&(t=t.filter(s=>s.date>=n.startDate)),n.endDate&&(t=t.filter(s=>s.date<=n.endDate)),n.sortDesc?t.sort((s,r)=>r.date.localeCompare(s.date)):t.sort((s,r)=>s.date.localeCompare(r.date)),n.limit&&(t=t.slice(0,n.limit)),t}async function nr(n={}){return await jt(),Xb(n)}async function Zb(n){if(!Uo())throw new Error("Must be logged in to save history");const e=await jt(),t=e.history.findIndex(s=>s.date===n.date);t>=0?e.history[t]=n:e.history.push(n),e.history.sort((s,r)=>s.date.localeCompare(r.date)),await sp(e.history)}async function ap(n){if(!Uo())throw new Error("Must be logged in to delete history");const e=await jt();e.history=e.history.filter(t=>t.date!==n),await sp(e.history)}async function dc(n){const e=await pn(),t=await Hn(),s=e.spStartDate,r=e.spWeeklyAmount||0;if(!s||!r){let f=null;if(s){const{formatStatePensionDate:m}=await au(async()=>{const{formatStatePensionDate:_}=await Promise.resolve().then(()=>bd);return{formatStatePensionDate:_}},void 0,import.meta.url);f=m(s)}return{amount:0,monthly:0,yearsUntil:0,isReceiving:!1,isFirstYear:!1,startDate:f}}const{calculateStatePensionForTaxYear:i,getTimeUntilStatePension:a,parseStatePensionDate:l}=await au(async()=>{const{calculateStatePensionForTaxYear:f,getTimeUntilStatePension:m,parseStatePensionDate:_}=await Promise.resolve().then(()=>bd);return{calculateStatePensionForTaxYear:f,getTimeUntilStatePension:m,parseStatePensionDate:_}},void 0,import.meta.url),c=i({taxYear:n,spStartDate:s,weeklyAmount:r,taxYearConfigs:t}),d=a(s);return{amount:c.annual,monthly:c.monthly,yearsUntil:d.years,monthsUntil:d.months,isReceiving:c.isReceiving,isFirstYear:c.isFirstYear,weeksInYear:c.weeksInYear,startDate:c.startDate}}async function eE(n){const e=rm(n);e.stdSipp=n.stdSipp||n.sippDraw,await Zb(e),n.taxYear&&await Qb(n.taxYear)}const wd={TAX_EFFICIENT:"minimiseEarlyTax",LONGEVITY:"maximiseLongevity"};function tE(n,e){return n<=0?n:n*Math.pow(1+e,1/12)}function lp({targetGross:n,fixedIncome:e=0,pa:t,brl:s,hrl:r,isaBalance:i=0,strategy:a=wd.TAX_EFFICIENT,yearsUntilSp:l=0}){const c=Pn(n,t,s,r),d=Math.max(0,Math.min(s,n)-e),f=Pn(d+e,t,s,r),m=Math.max(0,c-f),_=a===wd.LONGEVITY&&l>0?i/l:1/0,w=Math.max(0,Math.min(m,Math.max(0,i),_)),T=i-w,C=m-w;let x=d;if(C>0){const D=om(f+C,t,s,r);x=Math.max(d,D-e)}const I=x+e,M=Pn(I,t,s,r);return{sippGross:x,isaDraw:w,remainingIsa:T,taxable:I,tax:I-M,net:M+w}}const rl={CONSECUTIVE_LIMIT:3,RECOVERY_BUFFER:1e4};function cp({totalGrowth:n,minGrowth:e,consecCashDraws:t,wasInProtection:s,consecutiveLimit:r=rl.CONSECUTIVE_LIMIT,recoveryBuffer:i=rl.RECOVERY_BUFFER}){let a=!1;return s&&(a=n<=e+i),!a&&n<e&&t+1>=r&&(a=!0),a}const fo={MAX_FRACTION:.5,MIN_BOOST:50,SURPLUS_BUFFER:15e3};function up({shortfall:n,standardMonthly:e,remainingMonths:t,surplus:s,brlHeadroom:r=1/0,maxFraction:i=fo.MAX_FRACTION,minBoost:a=fo.MIN_BOOST}){if(!(n>0)||!(s>0)||t<1)return 0;const l=[n/t,s/t];if(Number.isFinite(r)){if(r<=0)return 0;l.push(r/t)}l.push(e*i);const c=Math.min(...l);return c>a?c:0}function Ho(n,e,t=0){const s=dl(t);let r=n.equityStart,i=n.bondStart,a=n.cashStart,l=n.hodlEnabled?n.hodlStart!==void 0?n.hodlStart:n.hodlValue:0,c=0,d=n.isaBalance||0,f=null,m=0,_=0,w=0,T=0,C=!1,x=!1,I=null,M=0,D=0,P=-1;const O=[],z=n.trace?[]:null,g=[];let y=1;O.push({year:0,month:0,equity:r,bond:i,cash:a,hodl:l,total:r+i+a,draw:0,source:"None",inProtection:!1,equityMin:n.equityMin,bondMin:n.bondMin,cashMax:n.cashTarget});for(let v=0;v<n.years*12;v++){const E=Math.floor(v/12),S=v%12,A=E;if(A!==P&&(M=0,D=0,P=A),v>0&&v%12===0){const le=e.inflation[E]||.025;g.push(le),y*=1+le}const b=e.equity[E]||0,de=e.inflation[E]||.025,Ae=E>0?e.inflation[E-1]||.025:de,J=tn(n.equityMin,E,n.duration,y,!0),oe=tn(n.bondMin,E,n.duration,y,!0),ye=tn(n.cashTarget,E,n.duration,y,!1),Z=J+oe,he=C;C=n.disableProtection?!1:cp({totalGrowth:r+i,minGrowth:Z,consecCashDraws:T,wasInProtection:he,consecutiveLimit:n.consecutiveLimit,recoveryBuffer:n.recoveryBuffer??rl.RECOVERY_BUFFER}),C?(m++,w++):(_=Math.max(_,w),w=0);const{sippMonthly:ve,isaMonthly:_e,planInputs:Y}=rE(n,E,y,g,d),It=ve,ke=It;let Yt=C?It*n.protectionMult:It,se=Yt;const mn=_e,St=z?{month:v,year:E,monthInYear:S,cumInf:y,equityStart:r,bondStart:i,cashStart:a,isaStart:d,sippMonthly:ve,isaMonthly:_e,effectiveSipp:Yt,effectiveIsa:mn,boostAmount:0,inProtection:C,planInputs:Y}:null;St&&z.push(St),C&&(M+=ke-se);const jn=nE(de,b,Ae,s),gn=Math.max(.005,de+.012),ot=le=>Math.pow(1+(Number.isFinite(le)?Math.max(-.99,le):-.99),1/12);if(r*=ot(b),i*=ot(jn),a*=ot(gn),d=tE(d,n.isaReturn||Pt.RETURN),l>0){const ze=(s()-.5)*2*.06;let lt=0;b<-.1?lt=Math.min(.15,Math.abs(b)*.4):b<-.05&&(lt=Math.abs(b)*.2);let Ye=.069+ze+lt;Ye=Math.max(-.08,Math.min(.18,Ye)),l*=ot(Ye)}const pt=r+i;let at=0;if(!C){const le=12-S,vt=D+ke*le+Y.fixed;at=up({shortfall:M,standardMonthly:ke,remainingMonths:le,surplus:pt-Z-fo.SURPLUS_BUFFER,brlHeadroom:Y.brl-vt}),at>50&&(se+=at,M-=at)}D+=se,St&&(St.effectiveSipp=se,St.boostAmount=at>50?at:0);let et="Growth";if(!C&&pt>=Z+se){const le=Math.max(0,r-J),vt=Math.max(0,i-oe),ze=le+vt;if(ze>0){if(r-=se*le/ze,i-=se*vt/ze,et="Growth",a<ye){const lt=pt-Z-se;if(lt>5e3){const Ye=Math.min((ye-a)*.3,lt*.5);r-=Ye*le/ze,i-=Ye*vt/ze,a+=Ye}}}else a-=se,et="Cash"}else if(a>=se)a-=se,et="Cash";else{const le=se-a;a=0,i>le?(i-=le,et="Bond"):r>le?(r-=le,et="Equity"):l>le?(l-=le,c+=le,f===null&&(f=v),et="HODL"):(x=!0,I=v)}if(T=et==="Growth"?0:T+1,d=Math.max(0,d-Math.min(mn,d)),r=Math.max(0,r),i=Math.max(0,i),a=Math.max(0,a),(S===0||v===n.years*12-1||x)&&O.push({year:E+S/12,month:v,equity:r,bond:i,cash:a,hodl:l,total:r+i+a,draw:se,boostAmount:at,source:et,inProtection:C,equityMin:J,bondMin:oe,cashMax:ye}),x)break}return _=Math.max(_,w),{failed:x,years:x?I/12:n.years,failMonth:I,final:r+i+a,finalEquity:r,finalBond:i,finalCash:a,finalHodl:l,protMonths:m,maxConsec:_,hodlUsed:c,hodlUsedMonth:f,hist:O,trace:z,seed:t}}function nE(n,e,t,s){let r=.15,i=.3,a=.2,l=.1,c=.1,d=.15;const f=t!==void 0?t:n,m=f>.045,_=f>.07;if(m){const D=s()>.3?1:.5;_?(r=.15+.35*D,i=.3-.2*D,d=.15-.1*D,l=.1+.05*D):(r=.15+.2*D,i=.3-.1*D,d=.15-.05*D)}m&&s()<.15&&(r=.2,i=.25,d=.12);const w=n+.005+br(0,.03,s),T=.04-(n>.04?(n-.04)*.5:0)+br(0,.05,s),C=.03+n*.3+br(0,.08,s),x=n*.8+br(0,.15,s),I=Math.max(.005,n+.005),M=e*.5+br(0,.02,s);return r*w+i*T+a*C+l*x+c*I+d*M}function sE(n,e){return n.spStartYear!==void 0?Math.max(0,n.spStartYear-e):n.statePensionYear!==void 0?Math.max(0,n.statePensionYear-e):0}function rE(n,e,t,s,r=0){const i=n.taxMode==="frozen"?n.pa:n.pa*t,a=n.taxMode==="frozen"?n.brl:n.brl*t,l=n.taxMode==="frozen"?n.hrl:(n.hrl||125140)*t,c=n.baseSalary*t,d=Dd(n.other,s);let f=0;if(n.spStartYear!==void 0){if(e>=n.spStartYear&&n.spWeeklyAmount>0){const T=n.spWeeklyAmount*52;e===n.spStartYear&&n.spFirstYearRatio!==void 0?f=T*n.spFirstYearRatio*t:f=T*t}}else n.statePensionYear!==void 0&&(f=e>=n.statePensionYear?(n.statePension||0)*t:0);const m=d+f,_=sE(n,e),w=lp({targetGross:c,fixedIncome:m,pa:i,brl:a,hrl:l,isaBalance:r,strategy:n.isaDrawdownStrategy||Pt.DRAWDOWN_STRATEGY,yearsUntilSp:_});return{sippMonthly:w.sippGross/12,isaMonthly:w.isaDraw/12,planInputs:{target:c,other:d,statePension:f,fixed:m,pa:i,brl:a,hrl:l,yearsUntilSp:_}}}function dp(n,e=1e3){const t=[];for(let s=0;s<e;s++)t.push(Ho(n,iE(n,s),s));return t}function iE(n,e){const t=Object.keys(Br).map(Number).sort((i,a)=>i-a),s=dl(e*12345),r={equity:{},inflation:{}};for(let i=0;i<n.years;i++){const a=t[Math.floor(s()*t.length)];r.equity[i]=Br[a],r.inflation[i]=cl[a]||.025}return r}function hp(n){const e=Object.keys(Br).map(Number).sort((r,i)=>r-i),t=Math.max(...e),s=[];for(const r of e){if(r+n.years-1>t)continue;const i={equity:{},inflation:{}};for(let l=0;l<n.years;l++)i.equity[l]=Br[r+l]||0,i.inflation[l]=cl[r+l]||.025;const a=Ho(n,i,r);a.startYear=r,s.push(a)}return s}function oE(n,e){const t={equity:{},inflation:{}};for(let s=0;s<n.years;s++)t.equity[s]=e.equity[s%e.equity.length],t.inflation[s]=e.inflation[s%e.inflation.length];return Ho(n,t,999)}function aE(n){const e=n.filter(t=>t.failed).length;return(n.length-e)/n.length*100}function fp(n){const e=n.filter(l=>!l.failed),t=n.filter(l=>l.failed),s=n.map(l=>l.years).sort((l,c)=>l-c),r=e.map(l=>l.final).sort((l,c)=>l-c),i=n.map(l=>l.protMonths).sort((l,c)=>l-c),a=(l,c)=>l[Math.floor(l.length*c)]||0;return{total:n.length,successCount:e.length,failCount:t.length,successRate:aE(n),survival:{p5:a(s,.05),p10:a(s,.1),p25:a(s,.25),p50:a(s,.5),p75:a(s,.75),p90:a(s,.9),p95:a(s,.95),min:s[0],max:s[s.length-1]},finalValue:{p5:a(r,.05),p10:a(r,.1),p25:a(r,.25),p50:a(r,.5),p75:a(r,.75),p90:a(r,.9),p95:a(r,.95),min:r[0]||0,max:r[r.length-1]||0,avg:e.reduce((l,c)=>l+c.final,0)/(e.length||1)},minYears:s[0],p10Years:a(s,.1),medianYears:a(s,.5),medianFinal:a(r,.5),p10Final:a(r,.1),p90Final:a(r,.9),avgFinal:e.reduce((l,c)=>l+c.final,0)/(e.length||1),protection:{runsWithProtection:n.filter(l=>l.protMonths>0).length,pctWithProtection:n.filter(l=>l.protMonths>0).length/n.length*100,avgMonths:i.reduce((l,c)=>l+c,0)/n.length,maxMonths:Math.max(...i),maxConsecutive:Math.max(...n.map(l=>l.maxConsec)),avgConsecutive:n.reduce((l,c)=>l+c.maxConsec,0)/n.length,p50Months:a(i,.5),p90Months:a(i,.9),p95Months:a(i,.95)},runsWithProtection:n.filter(l=>l.protMonths>0).length,avgProtMonths:i.reduce((l,c)=>l+c,0)/n.length,maxProtMonths:Math.max(...i),maxConsecutive:Math.max(...n.map(l=>l.maxConsec)),avgConsecutive:n.reduce((l,c)=>l+c.maxConsec,0)/n.length,hodl:{runsUsingHodl:n.filter(l=>l.hodlUsed>0).length,pctUsingHodl:n.filter(l=>l.hodlUsed>0).length/n.length*100,avgUsed:n.filter(l=>l.hodlUsed>0).length>0?n.filter(l=>l.hodlUsed>0).reduce((l,c)=>l+c.hodlUsed,0)/n.filter(l=>l.hodlUsed>0).length:0,maxUsed:Math.max(...n.map(l=>l.hodlUsed||0))},runsUsingHodl:n.filter(l=>l.hodlUsed>0).length,avgHodlUsed:n.filter(l=>l.hodlUsed>0).length>0?n.filter(l=>l.hodlUsed>0).reduce((l,c)=>l+c.hodlUsed,0)/n.filter(l=>l.hodlUsed>0).length:0,maxHodlUsed:Math.max(...n.map(l=>l.hodlUsed||0)),failures:t.map(l=>({seed:l.seed,startYear:l.startYear,years:l.years,failMonth:l.failMonth,protMonths:l.protMonths}))}}function sr(n){if(!n)return null;const e={january:0,jan:0,february:1,feb:1,march:2,mar:2,april:3,apr:3,may:4,june:5,jun:5,july:6,jul:6,august:7,aug:7,september:8,sep:8,sept:8,october:9,oct:9,november:10,nov:10,december:11,dec:11},t=n.trim().replace(/\s+/g," ");if(/^\d{4}-\d{2}-\d{2}$/.test(t)){const r=new Date(t);if(!isNaN(r.getTime()))return r}if(/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(t)){const[r,i,a]=t.split("/").map(Number);return new Date(a,i-1,r)}if(/^\d{1,2}-\d{1,2}-\d{4}$/.test(t)){const[r,i,a]=t.split("-").map(Number);return new Date(a,i-1,r)}let s=t.match(/^(\d{1,2})\s+(\w+)\s+(\d{4})$/i);if(s){const r=parseInt(s[1]),i=e[s[2].toLowerCase()],a=parseInt(s[3]);if(i!==void 0)return new Date(a,i,r)}if(s=t.match(/^(\w+)\s+(\d{1,2})\s+(\d{4})$/i),s){const r=e[s[1].toLowerCase()],i=parseInt(s[2]),a=parseInt(s[3]);if(r!==void 0)return new Date(a,r,i)}if(s=t.match(/^(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})$/i),s){const r=e[s[1].toLowerCase()],i=parseInt(s[2]),a=parseInt(s[3]);if(r!==void 0)return new Date(a,r,i)}if(s=t.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+(\w+),?\s+(\d{4})$/i),s){const r=parseInt(s[1]),i=e[s[2].toLowerCase()],a=parseInt(s[3]);if(i!==void 0)return new Date(a,i,r)}return null}function Wi(n){const e=typeof n=="string"?sr(n):n;if(!e||isNaN(e.getTime()))return"";const t=["January","February","March","April","May","June","July","August","September","October","November","December"];return`${e.getDate()} ${t[e.getMonth()]} ${e.getFullYear()}`}function lE(n){const{taxYear:e,spStartDate:t,weeklyAmount:s,taxYearConfigs:r={}}=n;if(!t||!s||s<=0)return{annual:0,monthly:0,isReceiving:!1,isFirstYear:!1,weeksInYear:0,startDate:null};const i=typeof t=="string"?sr(t):t;if(!i||isNaN(i.getTime()))return{annual:0,monthly:0,isReceiving:!1,isFirstYear:!1,weeksInYear:0,startDate:null};const a=vo(i);ga(e);const l=am(e),c=[...new Set([a,e,...Object.keys(r)])].sort((C,x)=>ga(C).getTime()-ga(x).getTime()),d=c.indexOf(a),f=c.indexOf(e);if(f<d)return{annual:0,monthly:0,isReceiving:!1,isFirstYear:!1,weeksInYear:0,startDate:Wi(i)};let m=1;for(let C=d;C<f;C++){const x=c[C],I=r[x],M=(I==null?void 0:I.cpi)||.025;m*=1+M}const _=s*m;if(e===a){const x=Math.max(0,(l.getTime()-i.getTime())/6048e5),I=_*x;return{annual:I,monthly:I/12,isReceiving:!0,isFirstYear:!0,weeksInYear:Math.round(x*10)/10,startDate:Wi(i)}}const T=_*52;return{annual:T,monthly:T/12,isReceiving:!0,isFirstYear:!1,weeksInYear:52,startDate:Wi(i)}}function cE(n,e=new Date){const t=typeof n=="string"?sr(n):n;if(!t||isNaN(t.getTime()))return{years:0,months:0,totalMonths:0,isPast:!1};const s=t.getTime()-e.getTime(),r=s<=0;if(r)return{years:0,months:0,totalMonths:0,isPast:!0};const i=Math.floor(s/(30.44*24*60*60*1e3)),a=Math.floor(i/12),l=i%12;return{years:a,months:l,totalMonths:i,isPast:r}}const pp=2016;function jo(n,{now:e=new Date}={}){if(!n||!String(n).trim())return{valid:!0,error:null,warning:null,date:null};const t=sr(n);if(!t||isNaN(t.getTime()))return{valid:!1,error:'Could not read that date. Try a format like "6 May 2040".',warning:null,date:null};const s=t.getFullYear();return s<pp?{valid:!1,error:`That looks like a date of birth (${s}), not a State Pension start date. Enter the date your State Pension begins — check gov.uk/check-your-state-pension.`,warning:null,date:t}:t.getTime()<e.getTime()?{valid:!0,error:null,warning:`This date is in the past — State Pension will be treated as already in payment from ${s}.`,date:t}:{valid:!0,error:null,warning:null,date:t}}const bd=Object.freeze(Object.defineProperty({__proto__:null,MIN_SP_START_YEAR:pp,calculateStatePensionForTaxYear:lE,formatStatePensionDate:Wi,getTimeUntilStatePension:cE,parseStatePensionDate:sr,validateStatePensionDate:jo},Symbol.toStringTag,{value:"Module"}));let Rn=null;function Yr(){return{settings:{equityMin:ce.EQUITY_MIN,bondMin:ce.BOND_MIN,cashTarget:ce.CASH_TARGET,duration:ce.DURATION_YEARS,baseSalary:ce.BASE_SALARY,other:0,statePension:12e3,statePensionYear:12,pa:Fe.PERSONAL_ALLOWANCE,brl:Fe.BASIC_RATE_LIMIT,hrl:Fe.HIGHER_RATE_LIMIT,taxMode:"inflates",protectionMult:ts.PROTECTION_MULTIPLIER,consecutiveLimit:ce.CONSECUTIVE_LIMIT,disableProtection:!1,hodlEnabled:ts.HODL_ENABLED,hodlValue:ts.HODL_VALUE},lastModified:null,checksum:null}}function hc(){return Oe()&&ft()}function zn(){Rn=null}function uE(){return Rn||Yr()}async function mp(){if(Rn)return Rn;if(!hc())return console.warn("Firebase not available - returning defaults"),Yr();try{const n=await qb();if(n){const e={settings:n,lastModified:new Date().toISOString(),checksum:null};return Rn=fE(e),Rn}}catch(n){console.error("Error loading stress data:",n)}return Yr()}async function dE(n){if(!hc())throw new Error("Must be logged in to save data");try{n.lastModified=new Date().toISOString(),n.checksum=hE(n),await np(n.settings),Rn=n}catch(e){throw console.error("Error saving stress data:",e),new Error("Failed to save stress data")}}function hE(n){return hl(n.settings)}function fE(n){const e={...Yr()};return n.settings&&(e.settings={...e.settings,...n.settings},n.settings.pacwMin!==void 0&&n.settings.equityMin===void 0&&(e.settings.equityMin=n.settings.pacwMin),n.settings.cgtMin!==void 0&&n.settings.bondMin===void 0&&(e.settings.bondMin=n.settings.cgtMin),n.settings.csh2Target!==void 0&&n.settings.cashTarget===void 0&&(e.settings.cashTarget=n.settings.csh2Target),e.settings.hodlEnabled===void 0&&(e.settings.hodlEnabled=!1),e.settings.hodlValue===void 0&&(e.settings.hodlValue=25e3)),e.lastModified=n.lastModified,e.checksum=n.checksum,e}function pE(){return uE().settings}async function Wt(){return(await mp()).settings}async function Wo(n){const e=await mp();e.settings={...e.settings,...n},await dE(e)}async function mE(){if(!hc())throw new Error("Must be logged in to reset settings");const n=Yr();await np(n.settings),zn()}function gE(n){if(!n.spStartDate||!n.spWeeklyAmount)return null;const e=sr(n.spStartDate);if(!e)return console.warn("Could not parse spStartDate:",n.spStartDate),null;const t=new Date,s=365.25*24*60*60*1e3,r=Math.max(0,(e.getTime()-t.getTime())/s),i=Math.floor(r),a=365,l=Math.floor((e-new Date(e.getFullYear(),0,0))/(24*60*60*1e3)),d=(a-l)/a;return{spStartYear:i,spWeeklyAmount:n.spWeeklyAmount,spFirstYearRatio:d}}function Yo(n={},e=null){const t=e||pE(),s=gE(t),r=s?{spStartYear:s.spStartYear,spWeeklyAmount:s.spWeeklyAmount,spFirstYearRatio:s.spFirstYearRatio}:{statePension:t.statePension||0,statePensionYear:t.statePensionYear??999};return{equityStart:n.equityStart??t.equityMin,bondStart:n.bondStart??t.bondMin,cashStart:n.cashStart??t.cashTarget,equityMin:t.equityMin,bondMin:t.bondMin,cashTarget:t.cashTarget,years:n.years??t.duration,duration:t.duration,baseSalary:t.baseSalary,other:t.other,...r,pa:t.pa,brl:t.brl,hrl:t.hrl,taxMode:t.taxMode,protectionMult:t.protectionMult,consecutiveLimit:t.consecutiveLimit,disableProtection:t.disableProtection,hodlEnabled:t.hodlEnabled,hodlValue:t.hodlValue,isaBalance:t.isaBalance||0,isaReturn:t.isaReturn,isaDrawdownStrategy:t.isaDrawdownStrategy}}function H(n,e=null){const t=Math.abs(n),s=e!==null?e:t<100,r=Math.abs(n).toLocaleString("en-GB",{minimumFractionDigits:s?2:0,maximumFractionDigits:s?2:0});return n<0?`-£${r}`:`£${r}`}function Ed(n,e){const t=yE(n);e.innerHTML=t}function yE(n){var S,A,b,de,Ae;const e=n,t=e.calculationDetails||{};let s="";const r=e.isTaxEfficientYear??e.taxEfficient,i=e.protectionInducedTaxEfficiency||!1,a=e.boostAmount>0;let l,c,d;if(e.inProtection?(l="warning",c="Protection Mode",d="⚡"):a?(l="boost",c="Tax Boost (Catch-up)",d="↑"):i?(l="info",c="Protection-Induced Tax Efficiency",d="↑"):r?(l="success",c="Tax-Efficient Year",d="✓"):(l="warning",c="Tax-Inefficient Year",d="!"),s+=`<div class="decision-mode ${l}">
    <span class="mode-icon">${d}</span>
    <span class="mode-label">${c}</span>
  </div>`,r&&e.yearlyIsaSavingsAllocation>0){const J=e.cumulativeIsaSavingsUsed||0,oe=e.yearlyIsaSavingsAllocation,ye=Math.max(0,oe-J),Z=oe>0?J/oe*100:0;s+=`<div class="isa-progress-card">
      <h4>ISA/Savings Allocation</h4>
      <div class="isa-progress-bar">
        <div class="isa-progress-fill" style="width: ${Math.min(Z,100)}%"></div>
      </div>
      <div class="isa-progress-stats">
        <span>Used: ${H(J)} of ${H(oe)}</span>
        <span>Remaining: ${H(ye)}</span>
      </div>
    </div>`}if(e.alerts&&e.alerts.length>0){s+='<div class="alerts">';for(const J of e.alerts){const oe=vE(J.severity);s+=`<div class="alert ${oe}">${J.message}</div>`}s+="</div>"}s+='<div class="recommendation-card">',s+="<h3>Monthly Recommendation</h3>",s+='<div class="draw-row primary">',s+='<span class="label">SIPP Withdrawal</span>',s+=`<span class="value">${H(e.sippDraw)}</span>`,s+="</div>",e.isaDraw>0&&(s+='<div class="draw-row">',s+='<span class="label">ISA Top-up</span>',s+=`<span class="value">${H(e.isaDraw)}</span>`,s+="</div>"),e.other>0&&(s+='<div class="draw-row muted">',s+='<span class="label">Other Pension</span>',s+=`<span class="value">${H(e.other)}</span>`,s+="</div>"),e.statePension>0&&(s+='<div class="draw-row muted">',s+='<span class="label">State Pension</span>',s+=`<span class="value">${H(e.statePension)}</span>`,s+="</div>"),s+='<div class="divider"></div>';const f=e.sippDraw+e.other+e.statePension,m=f*12,_=e.pa||12570,w=e.brl||50270;let T=0;m>_&&(m<=w?T=(m-_)*.2:T=(w-_)*.2+(m-w)*.4);const C=f-T/12+e.isaDraw;s+='<div class="draw-row total">',s+='<span class="label">Total Monthly Income</span>',s+=`<span class="value">${H(C)}</span>`,s+="</div>",e.boostAmount>0&&(s+='<div class="boost-indicator">',s+='<span class="boost-label">Includes Tax Boost:</span>',s+=`<span class="boost-value">+${H(e.boostAmount)}</span>`,s+="</div>"),s+="</div>",s+='<div class="source-card">',s+="<h4>Withdraw From</h4>",s+=`<div class="source-label ${e.source.toLowerCase()}">${e.source}</div>`,e.source==="Growth"&&(e.drawFromEquity>0||e.drawFromBond>0)&&(s+='<div class="source-breakdown">',e.drawFromEquity>0&&(s+=`<div class="source-item">Equity: ${H(e.drawFromEquity)}</div>`),e.drawFromBond>0&&(s+=`<div class="source-item">Bond: ${H(e.drawFromBond)}</div>`),s+="</div>"),s+="</div>",s+='<div class="fund-status">',s+="<h4>Fund Status</h4>";const x=e.equity+e.bond+e.cash,I=e.adjEquityMin+e.adjBondMin+e.adjCashTarget,M=x-I,D=I>0?M/I*100:0;s+='<div class="fund-grid">';const P=e.equity-e.adjEquityMin;s+=Ca("Equity",e.equity,e.adjEquityMin,P);const O=e.bond-e.adjBondMin;s+=Ca("Bond",e.bond,e.adjBondMin,O);const z=e.cash-e.adjCashTarget;s+=Ca("Cash",e.cash,e.adjCashTarget,z),s+="</div>";const g=M>=0?"healthy":"warning";s+=`<div class="overall-status ${g}">`,s+=`<span>Total Surplus: ${H(M)}</span>`,s+=`<span>(${D.toFixed(1)}% above target)</span>`,s+="</div>",s+="</div>",s+='<div class="tax-info">',s+="<h4>Tax Summary</h4>",s+='<div class="tax-thresholds">',s+=`<div class="tax-threshold-item"><span class="label">PA:</span><span>${H(e.pa)}</span></div>`,s+=`<div class="tax-threshold-item"><span class="label">BRL:</span><span>${H(e.brl)}</span></div>`,t.taxInfo&&(s+=`<div class="tax-threshold-item"><span class="label">Headroom:</span><span class="${t.taxInfo.headroomToBRL>0?"success":"warning"}">${H(t.taxInfo.headroomToBRL)}</span></div>`),s+="</div>",s+='<div class="tax-comparison">',s+='<div class="tax-comparison-header">',s+="<div></div><div>Monthly</div><div>YTD</div><div>Projected</div>",s+="</div>";const y=((S=t.taxInfo)==null?void 0:S.monthlyTax)||T/12,v=e.taxPaidYTD||y,E=e.taxProjectedAnnual||((A=t.taxInfo)==null?void 0:A.annualTax)||T;if(s+='<div class="tax-comparison-row">',s+='<div class="label">Tax Paid</div>',s+=`<div>${H(y)}</div>`,s+=`<div>${H(v)}</div>`,s+=`<div>${H(E)}</div>`,s+="</div>",r||((b=t.taxInfo)==null?void 0:b.taxSavedAnnual)>0){const J=e.taxSavedMonthly||((de=t.taxInfo)==null?void 0:de.taxSavedMonthly)||0,oe=e.taxSavedYTD||J,ye=e.taxSavedProjectedAnnual||((Ae=t.taxInfo)==null?void 0:Ae.taxSavedAnnual)||0;ye>0&&(s+='<div class="tax-comparison-row saved">',s+='<div class="label">Tax Saved</div>',s+=`<div class="success">-${H(J)}</div>`,s+=`<div class="success">-${H(oe)}</div>`,s+=`<div class="success">-${H(ye)}</div>`,s+="</div>")}if(s+="</div>",t.taxInfo&&typeof t.taxInfo.effectiveRate=="number"&&!isNaN(t.taxInfo.effectiveRate)){const J=t.taxInfo.effectiveRate*100;s+=`<div class="effective-rate">
      <span>Effective Tax Rate:</span>
      <span class="${J<=20?"success":J<=40?"warning":"danger"}">${J.toFixed(1)}%</span>
    </div>`}else if(t.taxInfo&&t.taxInfo.annualTaxable>0&&t.taxInfo.annualTax>=0){const J=t.taxInfo.annualTax/t.taxInfo.annualTaxable*100;s+=`<div class="effective-rate">
      <span>Effective Tax Rate:</span>
      <span class="${J<=20?"success":J<=40?"warning":"danger"}">${J.toFixed(1)}%</span>
    </div>`}if(s+="</div>",e.rebalanceNeeded&&e.rebalanceActions.length>0){s+='<div class="rebalance-card">',s+="<h4>Rebalancing Suggestions</h4>",s+="<ul>";for(const J of e.rebalanceActions)s+=`<li>${J}</li>`;s+="</ul>",s+="</div>"}return s+='<div class="mode-explanation">',s+="<h4>Why This Recommendation?</h4>",s+=`<p>${t.reason||"Standard calculation based on your settings."}</p>`,!t.hasSufficientIsa&&t.isaNeededMonthly>0&&(s+=`<p class="isa-warning">To enable tax-efficient mode, you need ${H(t.totalIsaNeeded)} in your ISA (${e.remainingMonths} months remaining in tax year).</p>`),s+="</div>",s+='<details class="debug-section">',s+="<summary>Calculation Details</summary>",s+="<pre>"+JSON.stringify(t,null,2)+"</pre>",s+="</details>",s}function Ca(n,e,t,s){return`<div class="fund-cell ${s>=0?"healthy":"deficit"}">
    <div class="fund-name">${n}</div>
    <div class="fund-current">${H(e)}</div>
    <div class="fund-min">Min: ${H(t)}</div>
    <div class="fund-surplus">${s>=0?"+":""}${H(s)}</div>
  </div>`}function vE(n){switch(n){case Ci.DANGER:return"alert-danger";case Ci.WARNING:return"alert-warning";case Ci.SUCCESS:return"alert-success";case Ci.INFO:default:return"alert-info"}}function _E(){return`
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
  `}async function wE(n){const e=ul(n),t=vo(e),s=e.getMonth()+1;return await Jb(t)?{showWizard:!1,taxYear:t,isApril:s===4,reason:"Year setup already complete"}:{showWizard:!0,taxYear:t,isApril:s===4,reason:`Tax year ${t} has not been set up`}}function bE(n,e){return n*(1+e)}function EE(n){const{targetAnnualGross:e,brl:t,pa:s=12570,remainingMonths:r,grossIncomeToDate:i=0}=n,a=T=>T<=s?0:T<=t?(T-s)*.2:(t-s)*.2+(T-t)*.4,l=Math.max(0,t-i);if(l<=0)return{isaNeeded:0,brlExhausted:!0,remainingBrlHeadroom:0,maxTaxEfficientSalary:t,reducedSalaryOption:t,canBeTaxEfficient:!1,reason:"BRL already exhausted by prior income"};if(e<=t)return{isaNeeded:0,brlExhausted:!1,remainingBrlHeadroom:l,maxTaxEfficientSalary:t,reducedSalaryOption:t,canBeTaxEfficient:!0,targetAchievableAtBrl:!0,reason:"Target achievable at BRL without ISA"};const c=a(e),d=e-c,f=a(t),m=t-f,_=Math.max(0,d-m),w=_/12*r;return{isaNeeded:w,isaNeededAnnual:_,brlExhausted:!1,remainingBrlHeadroom:l,maxTaxEfficientSalary:t,reducedSalaryOption:t,canBeTaxEfficient:!0,targetAchievableAtBrl:!1,netAtTarget:d,netAtBrl:m,taxAtTarget:c,taxAtBrl:f,reason:`Need £${Math.round(w).toLocaleString()} ISA/Savings for tax efficiency`}}function TE(n,e,t){return t?{sufficient:!1,isBrlExhausted:!0,options:[{key:"reduced",label:"Reduce salary to BRL",description:"Accept lower income to stay tax-efficient"},{key:"inefficient",label:"Accept tax-inefficient year",description:"Draw full SIPP, pay 40% on excess"}]}:n>=e?{sufficient:!0,isBrlExhausted:!1,options:[]}:{sufficient:!1,isBrlExhausted:!1,shortfall:e-n,options:[{key:"increase",label:`Increase ISA to £${Math.round(e).toLocaleString()}`,description:"Provide enough ISA for tax efficiency"},{key:"reduced",label:"Reduce salary to BRL",description:"Keep ISA to grow, accept lower income"},{key:"inefficient",label:"Accept tax-inefficient year",description:"Draw full SIPP, ISA stays untouched"}]}}async function IE(n){const e=ul(n),t=vo(e),r=e.getMonth()+1===4,i=cm(e),a=await pn(),l=await qo(t),c=await Hn(),d=Object.keys(c).sort(),f=d.indexOf(t)-1,m=f>=0?c[d[f]]:null,_=await dc(t),w=(m==null?void 0:m.cpi)||.025,T=bE(a.baseSalary,w);return{taxYear:t,selectedMonth:n,isApril:r,remainingMonths:i,baseSalary:a.baseSalary,suggestedSalary:T,defaults:{pa:(m==null?void 0:m.pa)||l.pa,brl:(m==null?void 0:m.brl)||l.brl,hrl:(m==null?void 0:m.hrl)||l.hrl,cpi:w,other:(m==null?void 0:m.other)||0},statePension:_,existingConfig:l.yearSetupComplete?l:null}}function gp(n){const{targetSalary:e,brl:t,pa:s=12570,other:r=0,statePension:i=0,isaSavingsAllocation:a=0,remainingMonths:l,grossIncomeToDate:c=0,isTaxEfficient:d=!0}=n,f=A=>A<=s?0:A<=t?(A-s)*.2:(t-s)*.2+(A-t)*.4,m=r/12,_=i/12,w=m+_;let T,C;if(!d)T=e/12-w,C=0;else{const A=Math.max(0,t-c),b=Math.max(0,A/l-w);T=Math.min(e/12-w,b),C=a/l}const x=(T+w)*12,M=f(x)/12,D=T+w,P=D>0?M/D:0,O=T*P,z=m*P,g=_*P,y=T-O,v=m-z,E=_-g,S=y+v+E+C;return{sipp:{gross:T,tax:O,net:y},other:{gross:m,tax:z,net:v},statePension:{gross:_,tax:g,net:E},isa:{gross:C,tax:0,net:C},totalGross:T+m+_+C,totalTax:M,totalNet:S,mode:d?"tax-efficient":"tax-inefficient",monthlySipp:T,monthlyIsa:C,monthlyOther:m,monthlyStatePension:_,monthlyTotal:S}}function SE(n){var C,x,I,M,D,P,O,z,g,y,v;const{pa:e,brl:t,hrl:s,cpi:r,other:i,isaSavingsAllocation:a,isTaxEfficient:l,taxEfficiencyChoice:c,grossIncomeToDate:d,startMonth:f,confirmedSalary:m,remainingMonths:_,statePension:w,monthlyBreakdown:T}=n;return{pa:e,brl:t,hrl:s,cpi:r,other:i,isaSavingsAllocation:l?a:0,isaSavingsUsed:0,isTaxEfficient:l,taxEfficiencyChoice:c,grossIncomeToDate:d||0,startMonth:f||4,remainingMonths:_||12,yearSetupComplete:!0,confirmedSalary:m,statePension:w||0,expectedMonthly:T?{sipp:{gross:((C=T.sipp)==null?void 0:C.gross)||0,tax:((x=T.sipp)==null?void 0:x.tax)||0,net:((I=T.sipp)==null?void 0:I.net)||0},other:{gross:((M=T.other)==null?void 0:M.gross)||0,tax:((D=T.other)==null?void 0:D.tax)||0,net:((P=T.other)==null?void 0:P.net)||0},statePension:{gross:((O=T.statePension)==null?void 0:O.gross)||0,tax:((z=T.statePension)==null?void 0:z.tax)||0,net:((g=T.statePension)==null?void 0:g.net)||0},isa:{gross:((y=T.isa)==null?void 0:y.gross)||0,tax:0,net:((v=T.isa)==null?void 0:v.net)||0},totalGross:T.totalGross||0,totalTax:T.totalTax||0,totalNet:T.totalNet||0}:null}}let ss=null,Gr=null,bt=1,Q=null,B={};async function xE(n,e,t){ss=n,Gr=t,bt=1,B={},Q=await IE(e),B={pa:Q.defaults.pa,brl:Q.defaults.brl,hrl:Q.defaults.hrl,cpi:Q.defaults.cpi,other:Q.defaults.other,grossIncomeToDate:0,confirmedSalary:Q.suggestedSalary,isaSavingsAllocation:0,isTaxEfficient:!0,taxEfficiencyChoice:null},Vr()}async function AE(n){return await wE(n)}function Vr(){if(!ss||!Q)return;const n=Q.isApril?6:7;ss.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Tax Year ${Q.taxYear} Setup</div>
        <div class="wizard-subtitle">
          ${Q.isApril?"Setting up for the full tax year":`Starting in ${fc(Q.selectedMonth)} - ${Q.remainingMonths} months remaining`}
        </div>

        <div class="wizard-progress">
          ${CE(n,bt)}
        </div>

        ${RE()}
      </div>
    </div>
  `,kE()}function RE(){if(Q.isApril,Q.isApril)switch(bt){case 1:return Td();case 2:return Id();case 3:return Sd();case 4:return xd();case 5:return Ad();case 6:return Rd();default:return""}else switch(bt){case 1:return Td();case 2:return PE();case 3:return Id();case 4:return Sd();case 5:return xd();case 6:return Ad();case 7:return Rd();default:return""}}function Td(){return`
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
  `}function PE(){const n=fc(Q.selectedMonth),e=LE(Q.selectedMonth);return`
    <div class="wizard-step">
      <div class="wizard-step-title">Income Before Starting Pension</div>
      <div class="wizard-step-desc">
        You're starting your pension drawdown in ${n}. Enter any taxable income you've already received this tax year (April to ${e}).
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
  `}function Id(){const n=B.cpi!==void 0?B.cpi:Q.defaults.cpi,e=(n*100).toFixed(1),t=Q.baseSalary,s=Math.round(t*(1+n));return`
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
        <p style="font-size: 24px; color: var(--primary); margin: 12px 0;">£<span id="suggestedSalaryDisplay">${s.toLocaleString()}</span></p>
        <p>per year (gross)</p>
      </div>

      <div class="wizard-step-desc" style="margin-top: 16px;">
        Confirm or adjust your target salary:
      </div>

      <div class="wizard-input">
        <span class="wizard-unit">£</span>
        <input type="number" id="wizSalary" value="${Math.round(B.confirmedSalary||s)}">
        <span class="wizard-unit">per year</span>
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="back">Back</button>
        <button class="wizard-btn primary" data-action="next">Next</button>
      </div>
    </div>
  `}function Sd(){const n=Q.statePension,e=n.isReceiving?`<span style="color: var(--success);">Receiving £${Math.round(n.amount).toLocaleString()}/year</span>`:`<span style="color: var(--text-muted);">${n.yearsUntil} years until state pension</span>`;return`
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
  `}function xd(){hi();const n=EE({targetAnnualGross:B.confirmedSalary,brl:B.brl,pa:B.pa,other:B.other,statePension:Q.statePension.amount,remainingMonths:Q.remainingMonths,grossIncomeToDate:B.grossIncomeToDate});return B._isaCalc=n,n.brlExhausted?`
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
  `}function Ad(){hi();const n=B._isaCalc,e=TE(B.isaSavingsAllocation,(n==null?void 0:n.isaNeeded)||0,(n==null?void 0:n.brlExhausted)||!1);if(e.sufficient&&!e.isBrlExhausted)return B.isTaxEfficient=!0,B.taxEfficiencyChoice="efficient",setTimeout(()=>{bt++,Vr()},0),`
      <div class="wizard-step">
        <div class="wizard-step-title">Setting Up Tax Efficiency...</div>
        <div class="wizard-info-box">
          <p>Your ISA allocation is sufficient for tax efficiency.</p>
        </div>
      </div>
    `;const t=e.shortfall>0?`You entered £${B.isaSavingsAllocation.toLocaleString()} but need £${Math.round(n.isaNeeded).toLocaleString()}.`:"";return`
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
  `}function Rd(){hi();const n=gp({targetSalary:B.confirmedSalary,brl:B.brl,pa:B.pa,other:B.other,statePension:Q.statePension.amount,isaSavingsAllocation:B.isaSavingsAllocation,remainingMonths:Q.remainingMonths,grossIncomeToDate:B.grossIncomeToDate,isTaxEfficient:B.isTaxEfficient}),e=B.isTaxEfficient?"Tax-Efficient":"Tax-Inefficient",t=B.isTaxEfficient?"success":"warning",s=r=>`£${Math.round(r).toLocaleString()}`;return`
    <div class="wizard-step">
      <div class="wizard-step-title">Confirm Tax Year Setup</div>

      <div class="wizard-summary">
        <div class="wizard-summary-row">
          <span>Tax Year:</span>
          <span>${Q.taxYear}</span>
        </div>
        <div class="wizard-summary-row">
          <span>Starting Month:</span>
          <span>${fc(Q.selectedMonth)}</span>
        </div>
        <div class="wizard-summary-row">
          <span>Remaining Months:</span>
          <span>${Q.remainingMonths}</span>
        </div>
        ${B.grossIncomeToDate>0?`
          <div class="wizard-summary-row">
            <span>Income to Date:</span>
            <span>${s(B.grossIncomeToDate)}</span>
          </div>
        `:""}
        <div class="wizard-summary-row">
          <span>Target Salary:</span>
          <span>${s(B.confirmedSalary)}/year</span>
        </div>
        <div class="wizard-summary-row">
          <span>Tax Mode:</span>
          <span class="${t}">${e}</span>
        </div>
        <div class="wizard-summary-row">
          <span>ISA Allocation:</span>
          <span>${s(B.isaSavingsAllocation)}</span>
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
              <td style="padding: 4px 0; text-align: right;">${s(n.sipp.gross)}</td>
              <td style="padding: 4px 0; text-align: right; color: var(--danger);">-${s(n.sipp.tax)}</td>
              <td style="padding: 4px 0; text-align: right;">${s(n.sipp.net)}</td>
            </tr>
            ${n.other.gross>0?`
              <tr>
                <td style="padding: 4px 0;">Other</td>
                <td style="padding: 4px 0; text-align: right;">${s(n.other.gross)}</td>
                <td style="padding: 4px 0; text-align: right; color: var(--danger);">-${s(n.other.tax)}</td>
                <td style="padding: 4px 0; text-align: right;">${s(n.other.net)}</td>
              </tr>
            `:""}
            ${n.statePension.gross>0?`
              <tr>
                <td style="padding: 4px 0;">State Pension</td>
                <td style="padding: 4px 0; text-align: right;">${s(n.statePension.gross)}</td>
                <td style="padding: 4px 0; text-align: right; color: var(--danger);">-${s(n.statePension.tax)}</td>
                <td style="padding: 4px 0; text-align: right;">${s(n.statePension.net)}</td>
              </tr>
            `:""}
            ${n.isa.net>0?`
              <tr>
                <td style="padding: 4px 0;">ISA <span style="color: var(--success);">(tax-free)</span></td>
                <td style="padding: 4px 0; text-align: right;">${s(n.isa.gross)}</td>
                <td style="padding: 4px 0; text-align: right; color: var(--success);">£0</td>
                <td style="padding: 4px 0; text-align: right;">${s(n.isa.net)}</td>
              </tr>
            `:""}
          </tbody>
          <tfoot>
            <tr style="border-top: 1px solid var(--border); font-weight: bold;">
              <td style="padding: 8px 0;">Total</td>
              <td style="padding: 8px 0; text-align: right;">${s(n.totalGross)}</td>
              <td style="padding: 8px 0; text-align: right; color: var(--danger);">-${s(n.totalTax)}</td>
              <td style="padding: 8px 0; text-align: right; color: var(--success);">${s(n.totalNet)}</td>
            </tr>
          </tfoot>
        </table>
        <p style="margin-top: 12px; font-size: 14px; color: var(--text);">
          <strong>You'll receive ${s(n.totalNet)}/month</strong> in your bank
        </p>
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="back">Back</button>
        <button class="wizard-btn primary" data-action="finish">Confirm & Save</button>
      </div>
    </div>
  `}function CE(n,e){let t="";for(let s=1;s<=n;s++){const r=s<e?"done":s===e?"active":"";t+=`<div class="wizard-dot ${r}"></div>`}return t}function kE(){ss.querySelectorAll("[data-action]").forEach(e=>{e.addEventListener("click",()=>ME(e.dataset.action))}),window._updateWizardSalary=function(){const e=document.getElementById("wizCPI"),t=document.getElementById("wizSalary"),s=document.getElementById("cpiDisplay"),r=document.getElementById("suggestedSalaryDisplay");if(e&&t&&s&&r){const i=parseFloat(e.value)||0,a=i/100,l=Q.baseSalary,c=Math.round(l*(1+a));s.textContent=i.toFixed(1),r.textContent=c.toLocaleString(),t.value=c,B.cpi=a,B.confirmedSalary=c}}}function ME(n){hi();const e=Q.isApril?6:7;switch(n){case"cancel":yp(),Gr&&Gr({completed:!1,cancelled:!0});break;case"next":bt<e&&(bt++,Vr());break;case"back":bt>1&&(bt--,Vr());break;case"apply-choice":DE(),bt++,Vr();break;case"finish":NE();break}}function DE(){var e;const n=(e=document.querySelector('input[name="taxChoice"]:checked'))==null?void 0:e.value;switch(B.taxEfficiencyChoice=n,n){case"increase":B.isaSavingsAllocation=B._isaCalc.isaNeeded,B.isTaxEfficient=!0;break;case"reduced":B.confirmedSalary=B.brl,B.isaSavingsAllocation=0,B.isTaxEfficient=!0;break;case"inefficient":B.isaSavingsAllocation=0,B.isTaxEfficient=!1;break}}function hi(){const n=document.getElementById("wizPA");n&&(B.pa=parseFloat(n.value)||12570);const e=document.getElementById("wizBRL");e&&(B.brl=parseFloat(e.value)||50270);const t=document.getElementById("wizHRL");t&&(B.hrl=parseFloat(t.value)||125140);const s=document.getElementById("wizCPI");s&&(B.cpi=(parseFloat(s.value)||4)/100);const r=document.getElementById("wizSalary");r&&(B.confirmedSalary=parseFloat(r.value)||3e4);const i=document.getElementById("wizOther");i&&(B.other=parseFloat(i.value)||0);const a=document.getElementById("wizISA");a&&(B.isaSavingsAllocation=parseFloat(a.value)||0);const l=document.getElementById("wizIncomeToDate");l&&(B.grossIncomeToDate=parseFloat(l.value)||0)}async function NE(){hi();const n=gp({targetSalary:B.confirmedSalary,brl:B.brl,pa:B.pa,other:B.other,statePension:Q.statePension.amount,isaSavingsAllocation:B.isaSavingsAllocation,remainingMonths:Q.remainingMonths,grossIncomeToDate:B.grossIncomeToDate,isTaxEfficient:B.isTaxEfficient}),e=SE({pa:B.pa,brl:B.brl,hrl:B.hrl,cpi:B.cpi,other:B.other,isaSavingsAllocation:B.isaSavingsAllocation,isTaxEfficient:B.isTaxEfficient,taxEfficiencyChoice:B.taxEfficiencyChoice,grossIncomeToDate:B.grossIncomeToDate,startMonth:parseInt(Q.selectedMonth.split("-")[1]),confirmedSalary:B.confirmedSalary,remainingMonths:Q.remainingMonths,statePension:Q.statePension.amount,monthlyBreakdown:n});console.log(`Tax Year Wizard: Saving config for ${Q.taxYear}`,e);try{await ys(Q.taxYear,e),console.log(`Tax Year Wizard: Successfully saved config for ${Q.taxYear}`)}catch(t){console.error(`Tax Year Wizard: Failed to save config for ${Q.taxYear}`,t),typeof window.showToast=="function"&&window.showToast(`Error saving tax year configuration: ${t.message}`,"error");return}yp(),Gr&&Gr({completed:!0,taxYear:Q.taxYear,config:e,wizardInputs:B})}function yp(){ss&&(ss.innerHTML="",ss.style.display="none")}function fc(n){const[e,t]=n.split("-").map(Number);return new Date(e,t-1,1).toLocaleString("default",{month:"long",year:"numeric"})}function LE(n){const[e,t]=n.split("-").map(Number);return new Date(e,t-2,1).toLocaleString("default",{month:"long"})}function OE(){return`
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
  `}function VE(n={},e=null){const t=Yo(n,e),s=dp(t),r=fp(s);return{results:s,stats:r,config:t}}function BE(n={},e=null){const t=Yo(n,e),s=hp(t),r=fp(s);return{results:s,stats:r,config:t}}function FE(n={}){const e=Yo(n),t={};for(const[s,r]of Object.entries(im))t[s]={...r,result:oE(e,r)};return t}function vp(n){return vo(ul(n))}function zE(n){const[e,t]=n.split("-").map(Number);return Math.max(0,(t>=4?e:e-1)-2026)}async function UE(n,e,t,s,r){var bs,Es,Lt,ur;const i=r.settings,a=r.history,l=r.allTaxYears,c=vp(n),d=zE(n),[f,m]=n.split("-").map(Number);if(!l[c])throw new Error(`Tax year ${c} is not configured. Please add it in the Settings tab before calculating.`);const _=l[c],w=_.pa||12570,T=_.brl||50270,C=_.hrl||125140,x=_.other||0,I=_.isTaxEfficient!==!1,M=_.isaSavingsAllocation||0,D=_.grossIncomeToDate||0,P=_.confirmedSalary||i.baseSalary,O=a.find(X=>X.date===n),z=(O==null?void 0:O.isa)||0,g=Math.max(0,(_.isaSavingsUsed||0)-z),v=r.spInfo.amount||0;let E=1;for(let X=0;X<d;X++){const De=String((26+X)%100).padStart(2,"0")+"/"+String((27+X)%100).padStart(2,"0"),Te=(l[De]||{}).cpi||um;E*=1+Te}const S=Math.round(tn(i.equityMin,d,i.duration,E,!0)),A=Math.round(tn(i.bondMin,d,i.duration,E,!0)),b=Math.round(tn(i.cashTarget,d,i.duration,E,!1)),de=e+t,Ae=S+A;let J=0;const oe=a.filter(X=>X.date<n);for(let X=oe.length-1;X>=0&&oe[X].source==="Cash";X--)J++;const ye=cp({totalGrowth:de,minGrowth:Ae,consecCashDraws:J,wasInProtection:oe.length>0&&oe[oe.length-1].inProtection,consecutiveLimit:i.consecutiveLimit||3,recoveryBuffer:i.recoveryBuffer||1e4}),Z=m>=4?16-m:4-m,he=Math.max(1,Z),ve=P*E,_e=x+v;Pn(ve,w,T,C);let Y,It,ke,Yt=0,se=0,mn=!1,St=0;const gn=Math.max(0,M-g)/he;if(I){const X=_e/12;a.filter(Se=>Se.taxYear===c&&Se.date<n);const De=ve/12,Te=r.isaBalance||0;let tt,me;if(Te>0){const Se=lp({targetGross:ve,fixedIncome:_e,pa:w,brl:T,hrl:C,isaBalance:Te,strategy:i.isaDrawdownStrategy||"minimiseEarlyTax",yearsUntilSp:0});tt=Se.sippGross/12,me=Se.isaDraw/12}else{if(((Es=(bs=_.expectedMonthly)==null?void 0:bs.sipp)==null?void 0:Es.gross)>0)tt=_.expectedMonthly.sipp.gross;else{const pe=Math.max(0,T-D-_e)/12;tt=Math.min(De-X,pe)}const Se=Pn(ve,w,T,C)/12,nt=Math.min(ve,T),fe=Pn(nt,w,T,C)/12,Ue=Math.max(0,Se-fe);me=Math.min(Ue,gn)}if(St=me,Yt=tt,ye){const Se=(i.protectionFactor||20)/100;Y=tt*(1-Se),It=me,ke="Protection"}else{Y=tt,It=me,ke="Tax-Efficient";const Se=m>=4?f:f-1,nt=oe.filter(pe=>{const[Yn,dr]=pe.date.split("-").map(Number);return(dr>=4?Yn:Yn-1)===Se});let fe=0,Ue=0;nt.forEach(pe=>{Ue+=pe.sipp||0,pe.inProtection&&pe.stdSipp&&(fe+=pe.stdSipp-pe.sipp),pe.boostAmount>0&&(fe-=pe.boostAmount)});const st=Ue+Y*he+_e;se=up({shortfall:fe,standardMonthly:tt,remainingMonths:he,surplus:de-Ae-fo.SURPLUS_BUFFER,brlHeadroom:T-st}),se>50&&(Y+=se,ke="Tax Boost")}}else{const X=ve/12,De=_e/12;let Te;if(((ur=(Lt=_.expectedMonthly)==null?void 0:Lt.sipp)==null?void 0:ur.gross)>0?Te=_.expectedMonthly.sipp.gross:Te=Math.max(0,X-De),Yt=Te,It=0,ye){const tt=(i.protectionFactor||20)/100;Y=Te*(1-tt),ke="Protection";const me=m>=4?f:f-1,Se=oe.filter(Ue=>{const[st,pe]=Ue.date.split("-").map(Number);return(pe>=4?st:st-1)===me});let nt=0;Se.forEach(Ue=>{nt+=Ue.sipp||0});const fe=nt+Y*he+_e;if(fe<T){const st=(T-fe)/he,pe=de-Ae-(i.recoveryBuffer||1e4);pe>0&&st>50&&(se=Math.min(st,pe/he),se>50&&(Y+=se,mn=!0,ke="Protection-Induced Efficiency"))}}else{Y=Te,ke="Tax-Inefficient";const tt=m>=4?f:f-1,me=oe.filter(fe=>{const[Ue,st]=fe.date.split("-").map(Number);return(st>=4?Ue:Ue-1)===tt});let Se=0,nt=0;if(me.forEach(fe=>{nt+=fe.sipp||0,fe.inProtection&&fe.stdSipp&&(Se+=fe.stdSipp-fe.sipp),fe.boostAmount>0&&(Se-=fe.boostAmount)}),Se>0){const fe=nt+Y*he+_e,Ue=T-fe,st=de-Ae-(i.recoveryBuffer||1e4);if(Ue>0&&st>0){const pe=Ue/he,Yn=Se/he,dr=st/he;se=Math.min(Yn,pe,dr),se>50&&(Y+=se,ke="Tax Boost")}}}}let ot,pt,at=0,et=0,le=0,vt="";if(!ye&&de>=Ae+Y){ot="Growth";const X=Math.max(0,e-S),De=Math.max(0,t-A),Te=X+De;Te>0?(at=Y*X/Te,et=Y*De/Te,pt="Healthy"):(ot="Cash",le=Y,pt="At min")}else ot="Cash",le=Y,pt=ye?"Protection":"Below min",s<Y&&(vt="Cash low!");let ze="";const lt=e-S,Ye=t-A;if(lt>5e3&&Ye<-5e3){const X=Math.floor(Math.min(lt,-Ye)/1e3)*1e3;X>=5e3&&(ze=`Move £${X.toLocaleString()} Equity→Bond`)}else if(Ye>5e3&&lt<-5e3){const X=Math.floor(Math.min(Ye,-lt)/1e3)*1e3;X>=5e3&&(ze=`Move £${X.toLocaleString()} Bond→Equity`)}let vs="";const pi=b-s;if(pi>5e3&&ot==="Growth"&&!ye){const X=de-Ae-Y;if(X>1e4){const De=Math.floor(Math.min(pi*.3,X*.5)/1e3)*1e3;De>=5e3&&(vs=`Replenish Cash: Move £${De.toLocaleString()} from growth funds`)}}const Gt=[];vt&&Gt.push({message:vt,severity:"danger",type:"low-cash"}),se>50&&Gt.push({message:`Tax Boost: +£${Math.round(se).toLocaleString()}/mo catch-up from protection shortfall`,severity:"success",type:"tax-boost"}),ze&&Gt.push({message:ze,severity:"warning",type:"rebalance"}),vs&&Gt.push({message:vs,severity:"info",type:"cash-replenish"});const rr=m>=4?f:f-1,ir=oe.filter(X=>{const[De,Te]=X.date.split("-").map(Number);return(Te>=4?De:De-1)===rr}),Ve=ir.reduce((X,De)=>X+(De.sipp||0),0),Me=ir.length+1,mi=Math.max(0,12-Me)*Yt,ar=Ve+Y+mi+x+v,Nt=Yi(ar,w,T,C),lr=Nt/12,_s=Y+x/12+v/12-lr+It,na=lr*Me,sa=Nt,cr=ve/12,gi=Yi(cr*12,w,T,C),ws=Math.max(0,gi/12-Nt/12),Wn=g+St;return{date:n,taxYear:c,yearNumber:d,remainingMonths:he,equity:e,bond:t,cash:s,isa:0,adjEquityMin:S,adjBondMin:A,adjCashTarget:b,pa:w,brl:T,other:x/12,statePension:v/12,sippDraw:Y,stdSipp:Yt,isaDraw:It,totalMonthlyNet:_s,isTaxEfficientYear:I,yearlyIsaSavingsAllocation:M,cumulativeIsaSavingsUsed:Wn,isaSavingsUsedThisMonth:St,taxPaidYTD:na,taxProjectedAnnual:sa,taxSavedMonthly:ws,taxSavedYTD:ws*Me,taxSavedProjectedAnnual:ws*12,taxEfficient:I&&!mn,inProtection:ye,protectionReason:ye?pt:null,consecutiveCashDraws:J,protectionInducedTaxEfficiency:mn,boostAmount:se>50?se:0,boostEligible:se>50,source:ot,drawFromEquity:at,drawFromBond:et,drawFromCash:le,rebalanceNeeded:ze!=="",rebalanceActions:ze?[ze]:[],alerts:Gt,calculationDetails:{mode:ke,reason:`${pt} | ${ke}`,totalGrowth:de,minGrowth:Ae,consec:J,stdSipp:Y,inputs:{baseSalary:i.baseSalary,confirmedSalary:P,targetGross:ve,cumInf:E,yearNum:d,taxYear:c,OTHER:x,STATE:v,PA:w,BRL:T,isTaxEfficientYear:I,yearlyIsaSavingsAllocation:M,grossIncomeToDate:D},taxInfo:{annualTaxable:ar,headroomToBRL:T-ar,annualTax:Nt,monthlyNet:_s}}}}let Kr=null;function $E(n,e){Kr=n,qE(e)}function qE({onGetStarted:n,onSignIn:e}){Kr&&(Kr.innerHTML=`
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
  `,document.getElementById("landingGetStarted").addEventListener("click",n),document.getElementById("landingSignIn").addEventListener("click",e))}function Qr(){Kr&&(Kr.style.display="none")}function HE(){return`
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
  `}let ht=null,ka=null,ks=!1;function jE(n,e){console.log("initAuthScreen: initializing"),ht=n,ka=e,ks=!1,Sb(t=>{console.log("AuthScreen: auth state change received:",t?t.email:"null","processed:",ks),t&&ka&&!ks?(console.log("AuthScreen: calling onAuthSuccessCallback"),ks=!0,JE(),ka(t)):t?console.log("AuthScreen: skipping callback, already processed or no callback"):(ks=!1,console.log("AuthScreen: user signed out, reset authProcessed"))}),_p(),console.log("initAuthScreen: complete")}function _p(){if(ht){if(!Oe()){ht.innerHTML=`
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
    `;return}ht.innerHTML=`
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
  `,WE()}}function WE(){const n=ht.querySelectorAll(".auth-screen-tab");n.forEach(i=>{i.addEventListener("click",()=>{n.forEach(c=>c.classList.remove("active")),i.classList.add("active");const a=document.getElementById("signinForm"),l=document.getElementById("signupForm");i.dataset.tab==="signin"?(a.style.display="block",l.style.display="none"):(a.style.display="none",l.style.display="block"),fi()})}),document.getElementById("signinForm").addEventListener("submit",YE),document.getElementById("signupForm").addEventListener("submit",GE),document.getElementById("forgotPasswordBtn").addEventListener("click",KE),document.getElementById("googleSigninBtn").addEventListener("click",QE)}function Ln(n){const e=document.getElementById("authScreenError");e&&(e.textContent=n,e.style.display="block")}function fi(){const n=document.getElementById("authScreenError");n&&(n.style.display="none")}async function YE(n){n.preventDefault(),fi();const e=document.getElementById("signinEmail").value.trim(),t=document.getElementById("signinPassword").value;if(!e||!t){Ln("Please enter email and password");return}try{await Ab(e,t)}catch(s){console.error("Sign in error:",s),Ln(Go(s.code))}}async function GE(n){n.preventDefault(),fi();const e=document.getElementById("signupName").value.trim(),t=document.getElementById("signupEmail").value.trim(),s=document.getElementById("signupPassword").value;if(!e||!t||!s){Ln("Please fill in all fields");return}if(s.length<6){Ln("Password must be at least 6 characters");return}try{await xb(t,s,e)}catch(r){console.error("Sign up error:",r),Ln(Go(r.code))}}async function KE(){fi();const n=document.getElementById("signinEmail").value.trim();if(!n){Ln("Please enter your email address first");return}try{await Pb(n),typeof window.showToast=="function"&&window.showToast("Password reset email sent. Check your inbox.","success",5e3)}catch(e){console.error("Reset password error:",e),Ln(Go(e.code))}}async function QE(){fi();try{await Rb()}catch(n){console.error("Google sign in error:",n),Ln(Go(n.code))}}function Go(n){return{"auth/invalid-email":"Invalid email address","auth/user-disabled":"This account has been disabled","auth/user-not-found":"No account found with this email","auth/wrong-password":"Incorrect password","auth/email-already-in-use":"An account already exists with this email","auth/weak-password":"Password is too weak","auth/operation-not-allowed":"Sign in method not enabled","auth/popup-closed-by-user":"Sign in cancelled","auth/popup-blocked":"Sign in popup was blocked","auth/too-many-requests":"Too many attempts. Please try again later.","auth/invalid-credential":"Invalid email or password"}[n]||"An error occurred. Please try again."}function JE(){ht&&(ht.innerHTML=`
      <div class="auth-screen">
        <div class="auth-screen-box" style="text-align: center;">
          <div class="auth-screen-header">
            <h1>Pension Planner</h1>
            <p>Signing in...</p>
          </div>
        </div>
      </div>
    `)}function wp(){console.log("hideAuthScreen: hiding auth screen, element=",!!ht),ht&&(ht.style.display="none",console.log("hideAuthScreen: set display to none"))}function XE(){ks=!1,ht&&(ht.style.display="block",_p())}function po(n="signin"){XE(),ht.querySelectorAll(".auth-screen-tab").forEach(i=>i.classList.remove("active"));const t=ht.querySelector(`.auth-screen-tab[data-tab="${n}"]`);t&&t.classList.add("active");const s=document.getElementById("signinForm"),r=document.getElementById("signupForm");s&&r&&(s.style.display=n==="signin"?"block":"none",r.style.display=n==="signup"?"block":"none")}function ZE(){return`
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
  `}let Jr=null;function eT(n,e,t){Jr=n,tT(e,t)}function tT(n,e){if(!Jr)return;const t=n||"there";Jr.innerHTML=`
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
  `,document.getElementById("onboardingStartWizard").addEventListener("click",e)}function Ko(){Jr&&(Jr.style.display="none")}function nT(){return`
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
  `}let cn=null,mo=null,F={scenarioName:"My Plan",scenarioDescription:"",enabledTools:["stress","decision"],introDone:!1,baseSalary:3e4,otherIncome:0,spStartDate:"",spWeeklyAmount:0,equityMin:25e4,bondMin:2e5,cashTarget:5e4,isaBalance:0,duration:35,taxMode:"inflates",decisionSalary:3e4,decisionEquity:25e4,decisionBond:2e5,decisionCash:5e4,decisionIsaBalance:0,decisionDuration:35},rt="scenario",be=1;function bp(){rt="scenario",be=1,F={scenarioName:"My Plan",scenarioDescription:"",enabledTools:["stress","decision"],introDone:!1,baseSalary:3e4,otherIncome:0,spStartDate:"",spWeeklyAmount:0,equityMin:25e4,bondMin:2e5,cashTarget:5e4,isaBalance:0,duration:35,taxMode:"inflates",decisionSalary:3e4,decisionEquity:25e4,decisionBond:2e5,decisionCash:5e4,decisionIsaBalance:0,decisionDuration:35}}function Ep(n,e){cn=n,mo=e,bp(),At()}function At(){cn&&(rt==="scenario"?sT():rt==="stress"?oT():rt==="decision"&&lT())}function sT(){cn.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Welcome to Pension Planner</div>
        <div class="wizard-subtitle">Let's create your first plan</div>

        <div class="wizard-progress">
          ${pc(2,be)}
        </div>

        ${be===1?rT():iT()}
      </div>
    </div>
  `,mc()}function rT(){return`
    <div class="wizard-step">
      <div class="wizard-step-title">Name your plan</div>
      <div class="wizard-step-desc">
        Give your plan a name. You can create multiple plans later for different scenarios
        (e.g. "Retire at 57", "Conservative at 60").
      </div>

      <div class="wizard-input" style="margin-bottom: 16px;">
        <input type="text" id="wizScenarioName" value="${F.scenarioName}" placeholder="e.g. My Retirement Plan" style="max-width: 300px;">
      </div>

      <div class="wizard-step-desc" style="margin-bottom: 8px;">
        Add an optional description:
      </div>

      <div class="wizard-input">
        <input type="text" id="wizScenarioDesc" value="${F.scenarioDescription}" placeholder="e.g. Based on retiring at age 57" style="max-width: 400px;">
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="skip-all">Skip Setup</button>
        <button class="wizard-btn primary" data-action="next">Next</button>
      </div>
    </div>
  `}function iT(){const n=F.enabledTools.includes("stress"),e=F.enabledTools.includes("decision");return`
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
  `}function oT(){cn.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Stress Tester Setup</div>
        <div class="wizard-subtitle">Let's set up your pension simulation in a few simple steps.</div>

        <div class="wizard-progress">
          ${pc(6,be)}
        </div>

        ${aT(be)}
      </div>
    </div>
  `,mc()}function aT(n){switch(n){case 1:return`
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
          <div class="wizard-step-title">How big are your pension funds?</div>
          <div class="wizard-step-desc">
            Enter the minimum amount you want to keep in each type of investment at the start of retirement.
          </div>

          <div class="wizard-grid">
            <div class="wizard-grid-item">
              <label>Stocks/Shares (Higher Risk)</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizEquityMin" value="${F.equityMin}">
              </div>
            </div>
            <div class="wizard-grid-item">
              <label>Bonds (Medium Risk)</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizBondMin" value="${F.bondMin}">
              </div>
            </div>
            <div class="wizard-grid-item">
              <label>Cash (Low Risk)</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizCashTarget" value="${F.cashTarget}">
              </div>
            </div>
            <div class="wizard-grid-item">
              <label>ISA Balance (Tax-Free)</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizIsaBalance" min="0" value="${F.isaBalance}">
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
      `;default:return""}}function lT(){cn.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Decision Tool Setup</div>
        <div class="wizard-subtitle">Now let's set up the tool you'll use each month once you're retired.</div>

        <div class="wizard-progress">
          ${pc(4,be)}
        </div>

        ${cT(be)}
      </div>
    </div>
  `,mc()}function cT(n){switch(n){case 1:return`
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
              <label>Stocks/Shares</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizDEquityMin" value="${F.decisionEquity}">
              </div>
            </div>
            <div class="wizard-grid-item">
              <label>Bonds</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizDBondMin" value="${F.decisionBond}">
              </div>
            </div>
            <div class="wizard-grid-item">
              <label>Cash</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizDCashTarget" value="${F.decisionCash}">
              </div>
            </div>
            <div class="wizard-grid-item">
              <label>ISA Balance (Tax-Free)</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizDIsaBalance" min="0" value="${F.decisionIsaBalance}">
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
      `;default:return""}}function pc(n,e){let t="";for(let s=1;s<=n;s++){const r=s<e?"done":s===e?"active":"";t+=`<div class="wizard-dot ${r}"></div>`}return t}function mc(){cn.querySelectorAll("[data-action]").forEach(e=>{e.addEventListener("click",()=>uT(e.dataset.action))})}function uT(n){switch(Tp(),n){case"skip-all":Bs();break;case"next":{const e=jo(F.spStartDate);if(!e.valid){typeof window.showToast=="function"&&window.showToast(e.error,"error");return}rt==="scenario"?be<2&&(be++,At()):rt==="stress"?be<6&&(be++,At()):rt==="decision"&&be<4&&(be++,At());break}case"back":(rt==="scenario"&&be>1||rt==="stress"&&be>1||rt==="decision"&&be>1)&&(be--,At());break;case"start-tools":if(!F.enabledTools||F.enabledTools.length===0){typeof window.showToast=="function"&&window.showToast("Please select at least one tool","error");return}Ma("scenario");break;case"skip-stress":Ma("stress");break;case"finish-stress":F.decisionSalary=F.baseSalary,F.decisionEquity=F.equityMin,F.decisionBond=F.bondMin,F.decisionCash=F.cashTarget,F.decisionIsaBalance=F.isaBalance,F.decisionDuration=F.duration,Ma("stress");break;case"skip-decision":Bs();break;case"finish":Bs();break}}function Ma(n){const e=F.enabledTools.includes("stress"),t=F.enabledTools.includes("decision");n==="scenario"?e?(rt="stress",be=1,At()):t?(rt="decision",be=1,At()):Bs():n==="stress"&&t?(rt="decision",be=1,At()):Bs()}function Tp(){const n=document.getElementById("wizScenarioName");n&&(F.scenarioName=n.value.trim()||"My Plan");const e=document.getElementById("wizScenarioDesc");e&&(F.scenarioDescription=e.value.trim()||"");const t=document.getElementById("wizToolStress"),s=document.getElementById("wizToolDecision");if(t!==null||s!==null){const P=[];t&&t.checked&&P.push("stress"),s&&s.checked&&P.push("decision"),F.enabledTools=P}const r=document.getElementById("wizBaseSalary");r&&(F.baseSalary=parseFloat(r.value)||3e4);const i=document.getElementById("wizOther");i&&(F.otherIncome=parseFloat(i.value)||0);const a=document.getElementById("wizSpStartDate");a&&(F.spStartDate=a.value.trim()||"");const l=document.getElementById("wizSpWeeklyAmount");l&&(F.spWeeklyAmount=parseFloat(l.value)||0);const c=document.getElementById("wizEquityMin");c&&(F.equityMin=parseFloat(c.value)||25e4);const d=document.getElementById("wizBondMin");d&&(F.bondMin=parseFloat(d.value)||2e5);const f=document.getElementById("wizCashTarget");f&&(F.cashTarget=parseFloat(f.value)||5e4);const m=document.getElementById("wizIsaBalance");m&&(F.isaBalance=parseFloat(m.value)||0);const _=document.getElementById("wizDuration");_&&(F.duration=parseInt(_.value)||35);const w=document.getElementById("wizTaxMode");w&&(F.taxMode=w.value);const T=document.getElementById("wizDBaseSalary");T&&(F.decisionSalary=parseFloat(T.value)||3e4);const C=document.getElementById("wizDEquityMin");C&&(F.decisionEquity=parseFloat(C.value)||25e4);const x=document.getElementById("wizDBondMin");x&&(F.decisionBond=parseFloat(x.value)||2e5);const I=document.getElementById("wizDCashTarget");I&&(F.decisionCash=parseFloat(I.value)||5e4);const M=document.getElementById("wizDIsaBalance");M&&(F.decisionIsaBalance=parseFloat(M.value)||0);const D=document.getElementById("wizDDuration");D&&(F.decisionDuration=parseInt(D.value)||35)}function Bs(){Tp(),mo&&mo(F)}function Qo(){cn&&(cn.style.display="none")}function dT(n,e,t,s){if(cn=n,mo=t,bp(),F.enabledTools=e,s&&(e.includes("stress")&&s.source==="decision"&&(F.baseSalary=s.baseSalary||3e4,F.equityMin=s.equityMin||25e4,F.bondMin=s.bondMin||2e5,F.cashTarget=s.cashTarget||5e4,F.isaBalance=s.isaBalance||0,F.duration=s.duration||35,F.spStartDate=s.spStartDate||"",F.spWeeklyAmount=s.spWeeklyAmount||0),e.includes("decision")&&s.source==="stress"&&(F.decisionSalary=s.baseSalary||3e4,F.decisionEquity=s.equityMin||25e4,F.decisionBond=s.bondMin||2e5,F.decisionCash=s.cashTarget||5e4,F.decisionIsaBalance=s.isaBalance||0,F.decisionDuration=s.duration||35)),e.includes("stress"))rt="stress";else if(e.includes("decision"))rt="decision";else{t&&t(F);return}be=1,At()}function hT(){return`
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
  `}function Jo(){const e=getComputedStyle(document.documentElement).getPropertyValue("--bg").trim()==="#0d1117"||document.documentElement.classList.contains("dark")||window.matchMedia("(prefers-color-scheme: dark)").matches;return{primary:"#f0c674",success:"#2ea043",warning:"#e1b12c",danger:"#f85149",muted:"#8b8b9b",grid:"rgba(255,255,255,0.1)",bg:e?"rgba(15,15,26,1)":"#ffffff",text:e?"#c9d1d9":"#1f2937",cardBg:e?"#21262d":"#ffffff",cone:"rgba(240,198,116,0.15)",coneMid:"rgba(240,198,116,0.2)",coneInner:"rgba(240,198,116,0.35)",coneBorder:"rgba(240,198,116,0.4)",trajectory:"rgba(46,160,67,0.25)",trajectoryFailed:"rgba(248,81,73,0.8)",trajectoryHover:"#5fdd7b",trajectoryFailedHover:"#ff6b6b",glidepath:"#7eb8da",zeroLine:"#f85149"}}const ds=new Map;let As=-1;function Pd(n,e,t,s,r,i){const a=r-t,l=i-s,c=a*a+l*l;if(c===0)return Math.sqrt((n-t)*(n-t)+(e-s)*(e-s));const d=Math.max(0,Math.min(1,((n-t)*a+(e-s)*l)/c)),f=t+d*a,m=s+d*l;return Math.sqrt((n-f)*(n-f)+(e-m)*(e-m))}function fT(n,e,t={}){const s=Jo(),r=n.getContext("2d"),{width:i,height:a}=n,l={top:45,right:40,bottom:50,left:80},c=i-l.left-l.right,d=a-l.top-l.bottom;r.fillStyle="rgba(0,0,0,0.2)",r.fillRect(0,0,i,a);const f=t.title||"Fund Value Projections (Percentile Bands)";r.font="bold 14px system-ui, sans-serif",r.fillStyle=s.text,r.textAlign="center",r.fillText(f,l.left+c/2,22);const m=t.years||35,_={};for(let I=0;I<=m;I++)_[I]=[];e.forEach(I=>{I.hist.forEach(M=>{const D=Math.floor(M.year);_[D]!==void 0&&_[D].push(M.total)})});const w=[];for(let I=0;I<=m;I++){const M=_[I].sort((P,O)=>P-O);if(M.length===0)continue;const D=P=>M[Math.floor(M.length*P)]||0;w.push({year:I,p5:D(.05),p10:D(.1),p25:D(.25),p50:D(.5),p75:D(.75),p90:D(.9),p95:D(.95)})}if(w.length===0)return;const T=Math.max(...w.map(I=>I.p90))*1.15,C=I=>l.left+I/m*c,x=I=>a-l.bottom-I/T*d;r.strokeStyle=s.grid,r.lineWidth=1;for(let I=0;I<=5;I++){const M=l.top+I/5*d;r.beginPath(),r.moveTo(l.left,M),r.lineTo(i-l.right,M),r.stroke()}r.fillStyle=s.cone,r.beginPath(),w.forEach((I,M)=>{const D=C(I.year);M===0?r.moveTo(D,x(I.p95)):r.lineTo(D,x(I.p95))});for(let I=w.length-1;I>=0;I--)r.lineTo(C(w[I].year),x(w[I].p5));r.closePath(),r.fill(),r.fillStyle=s.coneMid,r.beginPath(),w.forEach((I,M)=>{const D=C(I.year);M===0?r.moveTo(D,x(I.p90)):r.lineTo(D,x(I.p90))});for(let I=w.length-1;I>=0;I--)r.lineTo(C(w[I].year),x(w[I].p10));r.closePath(),r.fill(),r.fillStyle=s.coneInner,r.beginPath(),w.forEach((I,M)=>{const D=C(I.year);M===0?r.moveTo(D,x(I.p75)):r.lineTo(D,x(I.p75))});for(let I=w.length-1;I>=0;I--)r.lineTo(C(w[I].year),x(w[I].p25));r.closePath(),r.fill(),t.glide&&t.glide.length>0&&(r.strokeStyle=s.glidepath,r.lineWidth=2,r.setLineDash([6,3]),r.beginPath(),t.glide.forEach((I,M)=>{const D=C(I.year),P=x(I.min);M===0?r.moveTo(D,P):r.lineTo(D,P)}),r.stroke(),r.setLineDash([])),r.strokeStyle=s.primary,r.lineWidth=3,r.beginPath(),w.forEach((I,M)=>{const D=C(I.year),P=x(I.p50);M===0?r.moveTo(D,P):r.lineTo(D,P)}),r.stroke(),r.strokeStyle="rgba(248,81,73,0.6)",r.lineWidth=1.5,r.setLineDash([4,2]),r.beginPath(),w.forEach((I,M)=>{const D=C(I.year);M===0?r.moveTo(D,x(I.p10)):r.lineTo(D,x(I.p10))}),r.stroke(),r.setLineDash([]),r.strokeStyle=s.zeroLine,r.lineWidth=2,r.setLineDash([5,5]),r.beginPath(),r.moveTo(l.left,x(0)),r.lineTo(i-l.right,x(0)),r.stroke(),r.setLineDash([]),r.fillStyle=s.muted,r.font="11px sans-serif",r.textAlign="right";for(let I=0;I<=5;I++){const M=T*(1-I/5);r.fillText(_t(M),l.left-10,l.top+I/5*d+4)}r.textAlign="center";for(let I=0;I<=m;I+=5)r.fillText(`Yr ${I}`,C(I),a-l.bottom+20);ds.set(n.id,{percentiles:w,xScale:C,yScale:x,padding:l,chartWidth:c,chartHeight:d,years:m,maxValue:T,type:"cone"}),vT(n)}function pT(n,e,t={}){const s=Jo(),r=n.getContext("2d"),{width:i,height:a}=n,l={top:45,right:40,bottom:50,left:80},c=i-l.left-l.right,d=a-l.top-l.bottom;r.fillStyle="rgba(0,0,0,0.2)",r.fillRect(0,0,i,a);const f=t.title||"Sample Trajectories (Green=Success, Red=Failed)";r.font="bold 14px system-ui, sans-serif",r.fillStyle=s.text,r.textAlign="center",r.fillText(f,l.left+c/2,22);const m=t.years||35,_=t.startValue||1e6,w=e.slice(0,100),T=w.filter(P=>P.failed),C=w.filter(P=>!P.failed);let x;if(T.length>0)x=_*2;else{const P=C.map(z=>z.final).sort((z,g)=>z-g),O=P[Math.floor(P.length*.5)]||_;x=Math.max(O*1.3,_*1.5)}const I=P=>l.left+P/m*c,M=P=>a-l.bottom-Math.min(P,x)/x*d;r.strokeStyle=s.grid,r.lineWidth=1;for(let P=0;P<=5;P++){const O=l.top+P/5*d;r.beginPath(),r.moveTo(l.left,O),r.lineTo(i-l.right,O),r.stroke()}r.fillStyle=s.muted,r.font="11px sans-serif",r.textAlign="right";for(let P=0;P<=5;P++){const O=x*(1-P/5);r.fillText(_t(O),l.left-10,l.top+P/5*d+4)}r.textAlign="center";for(let P=0;P<=m;P+=5)r.fillText(`Yr ${P}`,I(P),a-l.bottom+20);const D=[];t.glide&&t.glide.length>0&&(r.strokeStyle=s.glidepath,r.lineWidth=3,r.setLineDash([8,4]),r.beginPath(),t.glide.forEach((P,O)=>{const z=I(P.year),g=M(P.min);O===0?r.moveTo(z,g):r.lineTo(z,g)}),r.stroke(),r.setLineDash([])),C.forEach((P,O)=>{const z=P.hist.map(g=>({x:I(g.year),y:M(g.total)}));D.push({run:P,pts:z,failed:!1,idx:O}),r.strokeStyle=s.trajectory,r.lineWidth=.5,r.beginPath(),z.forEach((g,y)=>{y===0?r.moveTo(g.x,g.y):r.lineTo(g.x,g.y)}),r.stroke()}),T.forEach((P,O)=>{const z=P.hist.map(g=>({x:I(g.year),y:M(g.total)}));D.push({run:P,pts:z,failed:!0,idx:C.length+O}),r.strokeStyle=s.trajectoryFailed,r.lineWidth=2,r.beginPath(),z.forEach((g,y)=>{y===0?r.moveTo(g.x,g.y):r.lineTo(g.x,g.y)}),r.stroke()}),r.strokeStyle=s.zeroLine,r.lineWidth=2,r.setLineDash([5,5]),r.beginPath(),r.moveTo(l.left,M(0)),r.lineTo(i-l.right,M(0)),r.stroke(),r.setLineDash([]),ds.set(n.id,{results:w,paths:D,xScale:I,yScale:M,padding:l,chartWidth:c,chartHeight:d,years:m,maxValue:x,glide:t.glide,type:"trajectory"}),_T(n,s)}function mT(n,e,t={}){const s=Jo(),r=n.getContext("2d"),{width:i,height:a}=n,l={top:50,right:20,bottom:55,left:60},c=i-l.left-l.right,d=a-l.top-l.bottom;r.fillStyle="rgba(0,0,0,0.2)",r.fillRect(0,0,i,a);const f=t.title||"Protection Months Distribution";r.font="bold 14px system-ui, sans-serif",r.fillStyle=s.text,r.textAlign="center",r.fillText(f,l.left+c/2,22);const m=e.map(P=>P.protMonths),_=m.length,w=Math.max(...m),T=Math.max(1,Math.ceil(w/15)),C={};m.forEach(P=>{const O=Math.floor(P/T)*T;C[O]=(C[O]||0)+1});const x=Object.keys(C).map(Number).sort((P,O)=>P-O),I=Math.max(...Object.values(C)),M=c/(x.length||1),D=[];r.strokeStyle=s.grid,r.lineWidth=1,r.fillStyle=s.muted,r.font="10px sans-serif",r.textAlign="right";for(let P=0;P<=4;P++){const O=l.top+P/4*d;r.beginPath(),r.moveTo(l.left,O),r.lineTo(i-l.right,O),r.stroke();const z=Math.round(I*(1-P/4));r.fillText(`${z} runs`,l.left-5,O+4)}x.forEach((P,O)=>{const z=C[P],g=z/I*d,y=l.left+O*M+2,v=a-l.bottom-g,E=M-4;r.fillStyle=P===0?s.success:s.warning,r.fillRect(y,v,E,g),D.push({x:y,y:v,w:E,h:g,months:P,monthsEnd:P+T-1,count:z,pct:(z/_*100).toFixed(1)})}),r.fillStyle=s.muted,r.font="10px sans-serif",r.textAlign="center",x.forEach((P,O)=>{if(O%2===0||x.length<12){const z=T>1?`${P}-${P+T-1}`:P.toString();r.fillText(z,l.left+O*M+M/2,a-l.bottom+15)}}),r.fillText("Protection Months",i/2,a-5),r.save(),r.translate(12,a/2),r.rotate(-Math.PI/2),r.textAlign="center",r.fillText("Number of Runs",0,0),r.restore(),ds.set(n.id,{bars:D,totalRuns:_,type:"histogram"}),wT(n)}function gT(n,e,t={}){const s=Jo(),r=n.getContext("2d"),{width:i,height:a}=n,l={top:50,right:180,bottom:60,left:80},c=i-l.left-l.right,d=a-l.top-l.bottom;r.fillStyle=s.bg,r.fillRect(0,0,i,a);const f=Object.keys(e),m=t.years||35;let _=0;f.forEach(x=>{const I=e[x].result;I&&I.hist&&I.hist.forEach(M=>{M.total>_&&(_=M.total)})}),_*=1.1;const w=x=>l.left+x/m*c,T=x=>l.top+d-x/_*d;yT(r,l,c,d,m,_,t.title||"Scenario Comparison",s);const C=["#6366f1","#22c55e","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#ec4899","#84cc16"];f.forEach((x,I)=>{const M=e[x].result;if(!M||!M.hist)return;r.beginPath(),r.strokeStyle=C[I%C.length],r.lineWidth=2.5,M.hist.forEach((P,O)=>{const z=w(P.year),g=T(P.total);O===0?r.moveTo(z,g):r.lineTo(z,g)}),r.stroke();const D=l.top+15+I*24;r.fillStyle=C[I%C.length],r.fillRect(i-l.right+15,D,20,4),r.font="11px system-ui, sans-serif",r.fillStyle=s.text,r.textAlign="left",r.fillText(e[x].name||x,i-l.right+40,D+5),M.final/1e3,r.fillStyle=s.muted,r.fillText(`${_t(M.final)}`,i-l.right+40,D+18)})}function yT(n,e,t,s,r,i,a,l){n.font="bold 14px system-ui, sans-serif",n.fillStyle=l.text,n.textAlign="center",n.fillText(a,e.left+t/2,e.top-20),n.strokeStyle=l.grid,n.lineWidth=1;for(let c=0;c<=5;c++){const d=e.top+s*c/5;n.beginPath(),n.moveTo(e.left,d),n.lineTo(e.left+t,d),n.stroke();const f=i*(5-c)/5;n.font="11px system-ui, sans-serif",n.fillStyle=l.muted,n.textAlign="right",n.fillText(_t(f),e.left-10,d+4)}for(let c=0;c<=r;c+=5){const d=e.left+c/r*t;n.beginPath(),n.moveTo(d,e.top),n.lineTo(d,e.top+s),n.stroke(),n.textAlign="center",n.fillText(`Y${c}`,d,e.top+s+20)}n.font="12px system-ui, sans-serif",n.textAlign="center",n.fillText("Years",e.left+t/2,e.top+s+45),n.save(),n.translate(20,e.top+s/2),n.rotate(-Math.PI/2),n.fillText("Fund Value",0,0),n.restore()}function _t(n){return n>=1e6?`£${(n/1e6).toFixed(1)}M`:n>=1e3?`£${(n/1e3).toFixed(0)}k`:`£${n.toFixed(0)}`}function vT(n,e){const t=n._coneHoverListener;t&&n.removeEventListener("mousemove",t);const s=r=>{const i=ds.get(n.id);if(!i||i.type!=="cone")return;const a=n.getBoundingClientRect(),l=n.width/a.width,c=(r.clientX-a.left)*l,{percentiles:d,padding:f,chartWidth:m,years:_}=i,w=(c-f.left)/m*_,T=Math.round(w);if(T<0||T>_){On();return}const C=d.find(I=>I.year===T);if(!C){On();return}const x=`
      <div style="border-bottom:1px solid #555;padding-bottom:6px;margin-bottom:6px;">
        <strong style="color:#f0c674;">Year ${T}</strong>
      </div>
      <div style="display:grid;grid-template-columns:auto auto;gap:4px 16px;">
        <span style="color:#8b8b9b;">95th percentile:</span><span>${_t(C.p95)}</span>
        <span style="color:#8b8b9b;">75th percentile:</span><span>${_t(C.p75)}</span>
        <span style="color:#8b8b9b;">Median (50th):</span><span style="color:#f0c674;font-weight:bold;">${_t(C.p50)}</span>
        <span style="color:#8b8b9b;">25th percentile:</span><span>${_t(C.p25)}</span>
        <span style="color:#8b8b9b;">10th percentile:</span><span style="color:#f85149;">${_t(C.p10)}</span>
        <span style="color:#8b8b9b;">5th percentile:</span><span>${_t(C.p5)}</span>
      </div>
    `;gc(r.clientX,r.clientY,x)};n._coneHoverListener=s,n.addEventListener("mousemove",s),n.addEventListener("mouseleave",On)}function _T(n,e){const t=n._trajHoverListener;t&&n.removeEventListener("mousemove",t);const s=n._trajLeaveListener;s&&n.removeEventListener("mouseleave",s);const r=a=>{const l=ds.get(n.id);if(!l||l.type!=="trajectory")return;const c=n.getBoundingClientRect(),d=n.width/c.width,f=n.height/c.height,m=(a.clientX-c.left)*d,_=(a.clientY-c.top)*f,{paths:w,padding:T,chartWidth:C,chartHeight:x}=l;if(m<T.left||m>T.left+C||_<T.top||_>T.top+x){On(),As!==-1&&(As=-1,Da(n,l,e,null));return}let I=null,M=12*d;w.filter(P=>P.failed).forEach(P=>{for(let O=0;O<P.pts.length-1;O++){const z=Pd(m,_,P.pts[O].x,P.pts[O].y,P.pts[O+1].x,P.pts[O+1].y);z<M&&(M=z,I=P)}}),I||w.filter(P=>!P.failed).forEach(P=>{for(let O=0;O<P.pts.length-1;O++){const z=Pd(m,_,P.pts[O].x,P.pts[O].y,P.pts[O+1].x,P.pts[O+1].y);z<M&&(M=z,I=P)}});const D=I?I.idx:-1;if(D!==As&&(As=D,Da(n,l,e,I)),I){const P=I.run,O=I.failed?"#f85149":"#2ea043",z=I.failed?"❌":"✅",g=I.failed?"FAILED":"SUCCESS";let y=`
        <div style="border-bottom:1px solid #555;padding-bottom:6px;margin-bottom:6px;">
          <strong style="color:${O};">${z} ${g}</strong>
          <span style="float:right;color:#8b8b9b;font-size:11px;">Run #${I.idx+1}</span>
        </div>
        <div style="display:grid;grid-template-columns:auto auto;gap:4px 16px;">
      `;P.startYear&&(y+=`<span style="color:#8b8b9b;">Start year:</span><span>${P.startYear}</span>`),y+=`<span style="color:#8b8b9b;">Duration:</span><span>${P.years.toFixed(1)} years</span>`,y+=`<span style="color:#8b8b9b;">Final balance:</span><span>${_t(P.final)}</span>`,y+=`<span style="color:#8b8b9b;">Protection months:</span><span>${P.protMonths}</span>`,y+=`<span style="color:#8b8b9b;">Longest streak:</span><span>${P.maxConsec} months</span>`,P.hodlUsed>0&&(y+=`<span style="color:#8b8b9b;">HODL used:</span><span>${_t(P.hodlUsed)}</span>`),y+="</div>",I.failed&&P.failMonth&&(y+=`<div style="margin-top:8px;padding-top:8px;border-top:1px solid #555;color:#f0c674;">💀 Depleted at year ${(P.failMonth/12).toFixed(1)}</div>`),gc(a.clientX,a.clientY,y)}else On()},i=()=>{if(On(),As!==-1){As=-1;const a=ds.get(n.id);a&&Da(n,a,e,null)}};n._trajHoverListener=r,n._trajLeaveListener=i,n.addEventListener("mousemove",r),n.addEventListener("mouseleave",i)}function wT(n,e){const t=n._histHoverListener;t&&n.removeEventListener("mousemove",t);const s=r=>{const i=ds.get(n.id);if(!i||i.type!=="histogram")return;const a=n.getBoundingClientRect(),l=n.width/a.width,c=n.height/a.height,d=(r.clientX-a.left)*l,f=(r.clientY-a.top)*c,{bars:m,totalRuns:_}=i;let w=null;if(m.forEach(T=>{d>=T.x&&d<=T.x+T.w&&f>=T.y&&f<=T.y+T.h&&(w=T)}),w){const T=w.months===0,C=T?"#2ea043":"#e1b12c",x=T?"🟢":"🟡",I=T?"No Protection":`${w.months}${w.monthsEnd>w.months?`-${w.monthsEnd}`:""} months`,M=`
        <div style="border-bottom:1px solid #555;padding-bottom:6px;margin-bottom:6px;">
          <strong style="color:${C};">${x} ${I}</strong>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 12px;">
          <span style="color:#8b8b9b;">Runs:</span><span>${w.count} of ${_}</span>
          <span style="color:#8b8b9b;">Percentage:</span><span>${w.pct}%</span>
        </div>
      `;gc(r.clientX,r.clientY,M)}else On()};n._histHoverListener=s,n.addEventListener("mousemove",s),n.addEventListener("mouseleave",On)}function Da(n,e,t,s){const r=n.getContext("2d"),{width:i,height:a}=n,{paths:l,xScale:c,yScale:d,padding:f,chartWidth:m,chartHeight:_,years:w,maxValue:T,glide:C}=e;r.fillStyle="rgba(15,15,26,1)",r.fillRect(f.left,f.top,m,_),r.strokeStyle=t.grid,r.lineWidth=1;for(let x=0;x<=5;x++){const I=f.top+x/5*_;r.beginPath(),r.moveTo(f.left,I),r.lineTo(i-f.right,I),r.stroke()}C&&C.length>0&&(r.strokeStyle=t.glidepath,r.lineWidth=1.5,r.setLineDash([4,2]),r.beginPath(),C.forEach((x,I)=>{const M=c(x.year),D=d(x.min);I===0?r.moveTo(M,D):r.lineTo(M,D)}),r.stroke(),r.setLineDash([])),l.forEach(x=>{if(s&&x.idx===s.idx)return;const I=s?.15:x.failed?.8:.25;r.strokeStyle=x.failed?`rgba(248,81,73,${I})`:`rgba(46,160,67,${I})`,r.lineWidth=x.failed?2:.5,r.beginPath(),x.pts.forEach((M,D)=>{D===0?r.moveTo(M.x,M.y):r.lineTo(M.x,M.y)}),r.stroke()}),s&&(r.strokeStyle=s.failed?t.trajectoryFailedHover:t.trajectoryHover,r.lineWidth=4,r.shadowColor=s.failed?t.trajectoryFailedHover:t.trajectoryHover,r.shadowBlur=8,r.beginPath(),s.pts.forEach((x,I)=>{I===0?r.moveTo(x.x,x.y):r.lineTo(x.x,x.y)}),r.stroke(),r.shadowBlur=0),r.strokeStyle=t.zeroLine,r.lineWidth=2,r.setLineDash([5,5]),r.beginPath(),r.moveTo(f.left,d(0)),r.lineTo(i-f.right,d(0)),r.stroke(),r.setLineDash([])}function gc(n,e,t){let s=document.getElementById("chartTooltip");s||(s=document.createElement("div"),s.id="chartTooltip",document.body.appendChild(s)),s.innerHTML=t,s.style.display="block",s.style.left=n+15+"px",s.style.top=e-10+"px"}function On(){const n=document.getElementById("chartTooltip");n&&(n.style.display="none")}function bT(){return`
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
  `}window._simEngine={runMonteCarlo:dp,runHistorical:hp,simulate:Ho};window._constants={EQUITY_RETURNS:Br,INFLATION:cl};window._mathUtils={seededRng:dl};let Ip=null,Sp=null;function xp(){Ip=null,Sp=null;const n=document.getElementById("mcResults"),e=document.getElementById("histResults");n&&(n.innerHTML=""),e&&(e.innerHTML="");const t=document.getElementById("optimiseResultsMC"),s=document.getElementById("optimiseResultsHist");t&&(t.innerHTML=""),s&&(s.innerHTML="")}function Ap(){document.querySelectorAll(".sub-tab[data-stresstab]").forEach(t=>t.classList.remove("active"));const n=document.querySelector('.sub-tab[data-stresstab="montecarlo"]');n&&n.classList.add("active"),document.querySelectorAll(".stress-subtab").forEach(t=>t.classList.add("hidden"));const e=document.getElementById("stress-montecarlo");e&&e.classList.remove("hidden")}function Rp(){document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(t=>t.classList.remove("active"));const n=document.querySelector('.sub-tab[data-decisiontab="entry"]');n&&n.classList.add("active"),document.querySelectorAll(".decision-subtab").forEach(t=>t.classList.add("hidden"));const e=document.getElementById("decision-entry");e&&e.classList.remove("hidden")}const Pp=document.createElement("style");Pp.textContent=_E()+HE()+ZE()+nT()+hT()+OE()+bT();document.head.appendChild(Pp);const yc=document.getElementById("globalLoadingOverlay"),ET=yc.querySelector(".loading-text");function kt(n="Loading..."){ET.textContent=n,yc.classList.add("active")}function Mt(){yc.classList.remove("active")}window.showToast=function(e,t="info",s=3e3){const r=document.querySelector(".toast-notification");r&&r.remove();const i=document.createElement("div");i.className=`toast-notification ${t}`,i.innerHTML=`
        <span class="toast-icon">${t==="success"?"✓":t==="error"?"!":"ℹ"}</span>
        <span class="toast-message">${e}</span>
      `,document.body.appendChild(i),requestAnimationFrame(()=>i.classList.add("show")),setTimeout(()=>{i.classList.remove("show"),setTimeout(()=>i.remove(),300)},s)};document.getElementById("versionDisplay").textContent=`v${Md}`;document.getElementById("entryMonth").value=lm();function go(n){const e=document.getElementById(n+"SpWeeklyAmount"),t=document.getElementById(n+"SpAnnualAmount");if(!e||!t)return;const s=parseFloat(e.value)||0,r=s*52;s>0?t.value="£"+r.toLocaleString("en-GB",{maximumFractionDigits:2}):t.value=""}["ds","ss"].forEach(n=>{const e=document.getElementById(n+"SpWeeklyAmount");e&&e.addEventListener("input",()=>go(n))});function TT(n){const e=parseFloat(n);return isNaN(e)?"":e.toString().replace(/\B(?=(\d{3})+(?!\d))/g," ")}function Cp(){document.querySelectorAll('input[type="number"]').forEach(e=>{e.value,e.addEventListener("focus",function(t){setTimeout(()=>{this.select()},0)}),e.addEventListener("click",function(t){!t.shiftKey&&!t.ctrlKey&&!t.metaKey&&this.select()})})}function kp(){document.querySelectorAll('input[type="number"]').forEach(e=>{if(e.dataset.formatted)return;e.dataset.formatted="true";const t=e.closest(".input-with-unit")||e.parentElement,s=e.closest(".input-with-unit")!==null,r=document.createElement("span");r.className="number-format-overlay";const i=s?"34px":"14px";r.style.cssText=`
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
        `,getComputedStyle(t).position==="static"&&(t.style.position="relative");function a(){const l=parseFloat(e.value);!isNaN(l)&&l>=1e3&&document.activeElement!==e?(r.textContent=TT(l),r.style.display="block",e.style.color="transparent"):(r.style.display="none",e.style.color="")}e._updateOverlay=a,e.addEventListener("focus",()=>{r.style.display="none",e.style.color=""}),e.addEventListener("blur",a),e.addEventListener("input",()=>{document.activeElement===e&&(r.style.display="none",e.style.color="")}),t.appendChild(r),a()})}function Xo(){document.querySelectorAll('input[type="number"]').forEach(n=>{n._updateOverlay&&n._updateOverlay()})}setTimeout(()=>{Cp(),kp()},100);const IT=new MutationObserver(n=>{let e=!1;n.forEach(t=>{t.addedNodes.forEach(s=>{var r,i;s.nodeType===1&&((r=s.matches)!=null&&r.call(s,'input[type="number"]')||(i=s.querySelector)!=null&&i.call(s,'input[type="number"]'))&&(e=!0)})}),e&&setTimeout(()=>{Cp(),kp()},50)});IT.observe(document.body,{childList:!0,subtree:!0});let Ms=null;async function vc(n,e=null){Qr(),wp(),Ko(),Qo(),document.getElementById("mainApp").classList.remove("hidden"),document.getElementById("userEmail").textContent=n.email,await Fs();const t=await rp();_c(t),await qt(),await hs(),il(),Ap(),Rp(),xp();const s=e||(t.includes("decision")?"decision":"stress");document.querySelectorAll(".tab").forEach(a=>a.classList.remove("active"));const r=document.querySelector(`.tab[data-tab="${s}"]`);r&&r.classList.add("active"),document.querySelectorAll(".tab-content").forEach(a=>a.classList.remove("active"));const i=document.getElementById(`${s}-content`);i&&i.classList.add("active")}function _c(n){const e={decision:["decision"],stress:["stress"]};document.querySelectorAll(".tab").forEach(s=>{const r=s.dataset.tab;let i=!1;for(const[a,l]of Object.entries(e))if(l.includes(r)){i=n.includes(a);break}Object.values(e).flat().includes(r)||(i=!0),s.style.display=i?"":"none"})}async function il(){try{const n=await Wt(),e=await pn();document.getElementById("entryEquity").value=e.equityMin||25e4,document.getElementById("entryBond").value=e.bondMin||2e5,document.getElementById("entryCash").value=e.cashTarget||5e4,document.getElementById("entryIsa").value=e.isaBalance||0,document.getElementById("dsEquityMin").value=e.equityMin||25e4,document.getElementById("dsBondMin").value=e.bondMin||2e5,document.getElementById("dsCashTarget").value=e.cashTarget||5e4,document.getElementById("dsDuration").value=e.duration||35,document.getElementById("dsBaseSalary").value=e.baseSalary||3e4,document.getElementById("dsSpStartDate").value=e.spStartDate||"",document.getElementById("dsSpWeeklyAmount").value=e.spWeeklyAmount||"",go("ds"),document.getElementById("dsProtectionFactor").value=e.protectionFactor||20,document.getElementById("dsRecoveryBuffer").value=e.recoveryBuffer||1e4,document.getElementById("dsConsecutiveLimit").value=e.consecutiveLimit||3,Np(n),document.getElementById("ssBaseSalary").value=n.baseSalary,document.getElementById("ssEquityMin").value=n.equityMin,document.getElementById("ssBondMin").value=n.bondMin,document.getElementById("ssCashTarget").value=n.cashTarget,document.getElementById("ssDuration").value=n.duration,document.getElementById("ssPA").value=n.pa,document.getElementById("ssBRL").value=n.brl,document.getElementById("ssHRL").value=n.hrl,document.getElementById("ssTaxMode").value=n.taxMode||"inflates",document.getElementById("ssOther").value=n.other||0,document.getElementById("ssSpStartDate").value=n.spStartDate||"",document.getElementById("ssSpWeeklyAmount").value=n.spWeeklyAmount||"",go("ss"),document.getElementById("ssConsecutiveLimit").value=n.consecutiveLimit||3,document.getElementById("ssProtectionMult").value=n.protectionMult||.8,document.getElementById("ssDisableProtection").checked=n.disableProtection||!1,document.getElementById("ssHodlEnabled").checked=n.hodlEnabled||!1,document.getElementById("ssHodlValue").value=n.hodlValue||25e3,document.getElementById("ssIsaBalance").value=n.isaBalance||0;const t=document.getElementById("ssSeedNote");t&&(t.textContent=n.seededFrom==="decision"&&n.seededAt?"Seeded from Decision Tool "+new Date(n.seededAt).toLocaleDateString():""),Xo(),console.log("All inputs initialized from stored settings")}catch(n){console.error("Error initializing inputs from settings:",n)}}async function Mp(n){console.log("Wizard completed with data:",n);try{const s={baseSalary:n.baseSalary,other:n.otherIncome,spStartDate:n.spStartDate,spWeeklyAmount:n.spWeeklyAmount,equityMin:n.equityMin,bondMin:n.bondMin,cashTarget:n.cashTarget,isaBalance:n.isaBalance||0,duration:n.duration,taxMode:n.taxMode},r={baseSalary:n.decisionSalary,equityMin:n.decisionEquity,bondMin:n.decisionBond,cashTarget:n.decisionCash,isaBalance:n.decisionIsaBalance||0,duration:n.decisionDuration,spStartDate:n.spStartDate,spWeeklyAmount:n.spWeeklyAmount};await Vb(n.scenarioName||"My Plan",n.scenarioDescription||"",n.enabledTools||["stress","decision"],{stressSettings:s,decisionSettings:r},!0),us(),zn()}catch(s){console.error("Error creating scenario from wizard:",s)}const e=ms(),t=n.enabledTools.includes("stress")?"stress":"decision";vc(e,t)}function ol(n){Qr(),wp();const e=n.displayName||n.email.split("@")[0];document.getElementById("onboardingPage").style.display="block",eT(document.getElementById("onboardingPage"),e,()=>{Ko(),document.getElementById("setupWizard").style.display="block",Ep(document.getElementById("setupWizard"),Mp)})}jE(document.getElementById("authScreen"),async n=>{console.log("Auth success callback triggered for:",n.email);try{console.log("Checking for existing cloud data...");const e=await Nb();console.log("Has cloud data:",e),e?(console.log("Existing user - showing main app"),Qr(),vc(n)):(console.log("New user - showing onboarding page"),ol(n))}catch(e){console.error("Error in auth callback:",e),ol(n)}});$E(document.getElementById("landingPage"),{onGetStarted:()=>{Qr(),po("signup")},onSignIn:()=>{Qr(),po("signin")}});document.getElementById("logoutBtn").addEventListener("click",async()=>{try{us(),zn(),fn(),await Qf(),document.getElementById("mainApp").classList.add("hidden"),Ko(),Qo(),po("signin")}catch(n){console.error("Logout error:",n)}});async function Fs(){var r;const n=await lc(),e=n.find(i=>i.isActive),t=document.getElementById("scenarioActiveName");t&&(t.textContent=e&&(((r=e.planDetails)==null?void 0:r.name)||e.name)||"No Plan");const s=document.getElementById("scenarioList");if(s){if(n.length===0){s.innerHTML='<div class="scenario-dropdown-item" style="color:var(--text-muted);cursor:default;">No plans yet</div>';return}s.innerHTML=n.map(i=>{var c,d;const a=((c=i.planDetails)==null?void 0:c.name)||i.name||"Unnamed Plan",l=((d=i.planDetails)==null?void 0:d.description)||i.description||"";return`
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
      `}).join(""),s.querySelectorAll(".scenario-dropdown-item").forEach(i=>{i.addEventListener("click",async a=>{if(a.target.closest(".scenario-item-actions"))return;const l=i.dataset.scenarioId;if(!l)return;const c=n.find(d=>d.isActive);if(c&&c.id===l){document.getElementById("scenarioDropdown").classList.remove("open");return}try{await Bb(l),us(),zn(),document.getElementById("scenarioDropdown").classList.remove("open"),xp(),Ap(),Rp();const d=await rp();_c(d);const f=document.querySelector(".tab.active");if(f&&f.style.display==="none"){const m=document.querySelector('.tab:not([style*="display: none"])');if(m){document.querySelectorAll(".tab").forEach(T=>T.classList.remove("active")),m.classList.add("active"),document.querySelectorAll(".tab-content").forEach(T=>T.classList.remove("active"));const _=m.dataset.tab+"-content",w=document.getElementById(_);w&&w.classList.add("active")}}await qt(),await hs(),await il(),await Fs()}catch(d){console.error("Error switching scenario:",d),showToast("Failed to switch plan: "+d.message,"error")}})}),s.querySelectorAll(".scenario-rename-btn").forEach(i=>{i.addEventListener("click",async a=>{a.stopPropagation();const l=i.dataset.id,c=i.dataset.name,d=prompt("Rename plan:",c);if(d&&d.trim()&&d.trim()!==c)try{await zb(l,d.trim()),await Fs()}catch(f){console.error("Error renaming scenario:",f),showToast("Failed to rename plan: "+f.message,"error")}})}),s.querySelectorAll(".scenario-tools-btn").forEach(i=>{i.addEventListener("click",async a=>{a.stopPropagation();const l=i.dataset.id,c=(i.dataset.tools||"stress,decision").split(",");document.getElementById("scenarioDropdown").classList.remove("open"),ST(l,c)})}),s.querySelectorAll(".scenario-delete-btn").forEach(i=>{i.addEventListener("click",async a=>{a.stopPropagation();const l=i.dataset.id,c=i.dataset.name;if(confirm(`Delete plan "${c}"? This cannot be undone.`))try{await $b(l),us(),zn(),await qt(),await hs(),await il(),await Fs()}catch(d){console.error("Error deleting scenario:",d),showToast("Failed to delete plan: "+d.message,"error")}})})}}document.getElementById("scenarioActiveBtn").addEventListener("click",n=>{n.stopPropagation(),document.getElementById("scenarioDropdown").classList.toggle("open")});document.addEventListener("click",n=>{const e=document.getElementById("scenarioSelector");e&&!e.contains(n.target)&&document.getElementById("scenarioDropdown").classList.remove("open")});document.getElementById("scenarioNewBtn").addEventListener("click",async()=>{document.getElementById("scenarioDropdown").classList.remove("open"),document.getElementById("mainApp").classList.add("hidden"),document.getElementById("setupWizard").style.display="block",Ep(document.getElementById("setupWizard"),Mp)});document.getElementById("scenarioDuplicateBtn").addEventListener("click",async()=>{var s;document.getElementById("scenarioDropdown").classList.remove("open");const n=await Dt();if(!n){showToast("No active plan to duplicate.","error");return}const e=((s=n.planDetails)==null?void 0:s.name)||n.name||"My Plan",t=prompt("Name for the copy:",e+" (copy)");if(!(!t||!t.trim()))try{await Fb(n.id,t.trim()),await Fs()}catch(r){console.error("Error duplicating scenario:",r),showToast("Failed to duplicate plan: "+r.message,"error")}});function ST(n,e){const t=document.getElementById("editToolsModal");t&&t.remove();const s=e.includes("stress"),r=e.includes("decision"),i=document.createElement("div");i.id="editToolsModal",i.className="edit-tools-overlay",i.innerHTML=`
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
      `,document.body.appendChild(i),document.getElementById("editToolsCancel").addEventListener("click",()=>i.remove()),i.addEventListener("click",a=>{a.target===i&&i.remove()}),document.getElementById("editToolsSave").addEventListener("click",async()=>{const a=[];if(document.getElementById("editToolStress").checked&&a.push("stress"),document.getElementById("editToolDecision").checked&&a.push("decision"),a.length===0){showToast("Please select at least one tool","error");return}const l=a.filter(c=>!e.includes(c));try{await Ub(n,a);const c=await Dt();if(c&&c.id===n){_c(a);const d=document.querySelector(".tab.active");if(d&&d.style.display==="none"){const f=document.querySelector('.tab:not([style*="display: none"])');if(f){document.querySelectorAll(".tab").forEach(w=>w.classList.remove("active")),f.classList.add("active"),document.querySelectorAll(".tab-content").forEach(w=>w.classList.remove("active"));const m=f.dataset.tab+"-content",_=document.getElementById(m);_&&_.classList.add("active")}}}if(await Fs(),i.remove(),l.length>0){let d=null;try{if(l.includes("stress")&&e.includes("decision")){const _=await pn();_&&(d={source:"decision",..._})}else if(l.includes("decision")&&e.includes("stress")){const _=await Wt();_&&(d={source:"stress",..._})}}catch(_){console.warn("Could not load existing settings for pre-fill:",_)}const f=document.getElementById("setupWizard");f.style.display="block",document.getElementById("mainApp").style.display="none",dT(f,l,async _=>{Qo();try{l.includes("stress")&&(await Wo({equityMin:_.equityMin,bondMin:_.bondMin,cashTarget:_.cashTarget,isaBalance:_.isaBalance||0,duration:_.duration,baseSalary:_.baseSalary,other:_.otherIncome||0,taxMode:_.taxMode||"inflates"}),zn()),l.includes("decision")&&(await cc({equityMin:_.decisionEquity,bondMin:_.decisionBond,cashTarget:_.decisionCash,isaBalance:_.decisionIsaBalance||0,duration:_.decisionDuration,baseSalary:_.decisionSalary,spStartDate:_.spStartDate||null,spWeeklyAmount:_.spWeeklyAmount||0}),us())}catch(w){console.error("Error saving new tool settings:",w)}await vc(),showToast("New tool configured successfully","success")},d)}else showToast("Tools updated","success")}catch(c){console.error("Error updating scenario tools:",c),showToast("Failed to update tools: "+c.message,"error")}})}const xT=60*60*1e3;let Na=null;function Dp(){Na&&clearTimeout(Na),ft()&&(Na=setTimeout(async()=>{if(ft()){showToast("You have been logged out due to inactivity (1 hour).","info",5e3);try{us(),zn(),fn(),await Qf(),document.getElementById("mainApp").classList.add("hidden"),Ko(),Qo(),po("signin")}catch(n){console.error("Auto-logout error:",n)}}},xT))}const AT=["mousedown","mousemove","keydown","scroll","touchstart","click"];AT.forEach(n=>{document.addEventListener(n,()=>{Dp()},{passive:!0})});Dp();document.getElementById("resetBtn").addEventListener("click",async()=>{if(!(!confirm(`⚠️ WARNING: This will permanently delete ALL your data including:

• All saved settings
• All decision history
• All tax year configurations

This action cannot be undone.

Are you sure you want to reset and start over?`)||!confirm(`Are you ABSOLUTELY sure?

Type OK to confirm deletion of all your data.`)))try{console.log("Wiping all user data..."),await Db(),console.log("Data wiped successfully"),us(),zn(),fn(),localStorage.clear(),document.getElementById("mainApp").classList.add("hidden");const t=ms();ol(t),showToast("All data has been deleted. Set up a new plan to start fresh.","success",4e3)}catch(t){console.error("Reset error:",t),showToast("Error resetting data: "+t.message,"error")}});document.querySelectorAll(".tab").forEach(n=>{n.addEventListener("click",async()=>{if(n.dataset.tab!=="stress"){RT();const e=document.getElementById("optimiseResultsMC"),t=document.getElementById("optimiseResultsHist");e&&(e.innerHTML=""),t&&(t.innerHTML="")}document.querySelectorAll(".tab").forEach(e=>e.classList.remove("active")),n.classList.add("active"),document.querySelectorAll(".tab-content").forEach(e=>e.classList.remove("active")),document.getElementById(`${n.dataset.tab}-content`).classList.add("active"),n.dataset.tab==="stress"&&await Zo()})});const Tr=document.querySelector(".tabs"),Cd=document.querySelector(".tabs-wrapper");if(Tr&&Cd){const n=()=>{const e=Tr.scrollLeft+Tr.clientWidth>=Tr.scrollWidth-10;Cd.classList.toggle("scrolled-end",e)};Tr.addEventListener("scroll",n),n()}document.querySelectorAll(".sub-tab[data-stresstab]").forEach(n=>{n.addEventListener("click",async()=>{document.querySelectorAll(".sub-tab[data-stresstab]").forEach(e=>e.classList.remove("active")),n.classList.add("active"),document.querySelectorAll(".stress-subtab").forEach(e=>e.classList.add("hidden")),document.getElementById(`stress-${n.dataset.stresstab}`).classList.remove("hidden"),n.dataset.stresstab==="stresssettings"&&await Zo()})});document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(n=>{n.addEventListener("click",async()=>{document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(e=>e.classList.remove("active")),n.classList.add("active"),document.querySelectorAll(".decision-subtab").forEach(e=>e.classList.add("hidden")),document.getElementById(`decision-${n.dataset.decisiontab}`).classList.remove("hidden"),n.dataset.decisiontab==="decisionsettings"&&await Op(),n.dataset.decisiontab==="history"&&await qt(),n.dataset.decisiontab==="taxyears"&&await hs()})});async function kd(n,e,t,s){var r;return UE(n,e,t,s,{settings:await pn(),history:await nr(),allTaxYears:await Hn(),spInfo:await dc(vp(n)),isaBalance:parseFloat((r=document.getElementById("entryIsa"))==null?void 0:r.value)||0})}function wc(n,e,t){if(n<1e4&&e<1e4&&t<1e4&&n+e+t>0){const r=i=>"£"+Math.round(i||0).toLocaleString();return confirm(`These fund values look low — Equity ${r(n)}, Bond ${r(e)}, Cash ${r(t)}.

Enter absolute amounts in pounds, to the single pound (e.g. 250000, not 250).

Continue anyway?`)}return!0}window.handleDecisionSubmit=async function(n){n.preventDefault();const e=document.getElementById("entryMonth").value,t=parseFloat(document.getElementById("entryEquity").value)||0,s=parseFloat(document.getElementById("entryBond").value)||0,r=parseFloat(document.getElementById("entryCash").value)||0,i=[];if(e||i.push("Month"),!t&&t!==0&&i.push("Equity Fund"),!s&&s!==0&&i.push("Bond Balance"),!r&&r!==0&&i.push("Cash Balance"),i.length>0){showToast("Missing: "+i.join(", "),"error",4e3);return}if(!wc(t,s,r))return;if((await nr({limit:1e3})).find(c=>c.date===e)){showToast(`${Qs(e)} already has a saved decision. Delete it from the History tab first to recalculate.`,"error",5e3);return}try{if((await AE(e)).showWizard){const f=document.getElementById("taxYearWizard");f.style.display="block",window._pendingDecisionForm={dateStr:e,equity:t,bond:s,cash:r},xE(f,e,async m=>{if(f.style.display="none",m&&m.completed)try{Ms=await kd(e,t,s,r);const _=document.getElementById("decisionOutput");Ed(Ms,_),document.getElementById("saveBtn").disabled=!1}catch(_){console.error("Decision error after wizard:",_),showToast("Error: "+_.message,"error")}});return}Ms=await kd(e,t,s,r);const d=document.getElementById("decisionOutput");Ed(Ms,d),document.getElementById("saveBtn").disabled=!1}catch(c){console.error("Decision error:",c),showToast("Error: "+c.message,"error")}};window.saveCurrentDecision=async function(){const n=document.getElementById("saveBtn");if(!Ms){showToast("No decision to save","error");return}if(!ft()){showToast("Please sign in to save decisions","error");return}n.classList.add("loading"),n.disabled=!0;try{await eE(Ms),showToast("Decision saved to history","success"),await qt()}catch(e){console.error("Save error:",e),showToast("Error saving: "+e.message,"error"),n.disabled=!1}finally{n.classList.remove("loading")}};function Np(n){const e=s=>"£"+Math.round(s||0).toLocaleString(),t=`Starting balances come from your <strong>Settings</strong> (Fund Minimums): Equity ${e(n.equityMin)} · Bond ${e(n.bondMin)} · Cash ${e(n.cashTarget)}. Edit them in the Settings tab.`;["mcStartSummary","histStartSummary","scenStartSummary"].forEach(s=>{const r=document.getElementById(s);r&&(r.innerHTML=t)}),["mcYears","histYears"].forEach(s=>{const r=document.getElementById(s);r&&(r.value=n.duration)})}window.runMonteCarloUI=async function(){const n=await Wt(),e={years:parseInt(document.getElementById("mcYears").value)||n.duration},t=document.getElementById("optimiseResultsMC");t&&(t.innerHTML=""),document.getElementById("mcResults").innerHTML='<div class="loading"><div class="spinner"></div>Running simulation...</div>',setTimeout(()=>{try{const{results:s,stats:r}=VE(e);Ip=s,Lp(r,s,"Monte Carlo (1000 runs)","mcResults",e.years)}catch(s){console.error("Simulation error:",s),document.getElementById("mcResults").innerHTML=`<div class="alert alert-danger">Error: ${s.message}</div>`}},50)};window.runHistoricalUI=async function(){const n=await Wt(),e={years:parseInt(document.getElementById("histYears").value)||n.duration},t=document.getElementById("optimiseResultsHist");t&&(t.innerHTML=""),document.getElementById("histResults").innerHTML='<div class="loading"><div class="spinner"></div>Running simulation...</div>',setTimeout(()=>{try{const{results:s,stats:r}=BE(e);Sp=s,Lp(r,s,"Historical Analysis","histResults",e.years)}catch(s){console.error("Simulation error:",s),document.getElementById("histResults").innerHTML=`<div class="alert alert-danger">Error: ${s.message}</div>`}},50)};window.runScenariosUI=async function(){await Wt();const n={};document.getElementById("scenResults").innerHTML='<div class="loading"><div class="spinner"></div>Running scenarios...</div>',setTimeout(()=>{try{const e=FE(n);kT(e,"scenResults")}catch(e){console.error("Scenario error:",e),document.getElementById("scenResults").innerHTML=`<div class="alert alert-danger">Error: ${e.message}</div>`}},50)};let bn=!1,Cr=0;function RT(){Cr++}window.runOptimisationUI=async function(n){if(bn)return;bn=!0;const e=++Cr,t=document.getElementById("optimiseBtn"+n),s=document.getElementById("optimiseResults"+n);t&&(t.disabled=!0),t&&(t.textContent="Optimising..."),s.innerHTML='<div class="loading"><div class="spinner"></div>Preparing optimisation...</div>';const r=await Wt(),i=JSON.parse(JSON.stringify(r)),a=document.getElementById(n==="MC"?"mcYears":"histYears"),l=parseInt(a&&a.value)||i.duration,c=(i.equityMin||0)+(i.bondMin||0)+(i.cashTarget||0);if(e!==Cr){bn=!1,t&&(t.disabled=!1,t.textContent="Optimise Allocation");return}const d=[];for(let g=5;g<=30;g+=5)for(let y=20;y<=95-g;y+=5){const v=100-g-y;v>=0&&d.push({equity:Math.round(c*y/100),bond:Math.round(c*v/100),cash:Math.round(c*g/100)})}const{EQUITY_RETURNS:f,INFLATION:m}=window._constants,{simulate:_}=window._simEngine,{seededRng:w}=window._mathUtils,T=Object.keys(f).map(Number).sort((g,y)=>g-y),C=Math.max(...T),x=g=>{const y=Yo({equityStart:g.equity,bondStart:g.bond,cashStart:g.cash,years:l},i),v=[];if(n==="MC")for(let Z=0;Z<1e3;Z++){const he=w(Z*12345),ve={equity:{},inflation:{}};for(let _e=0;_e<l;_e++){const Y=T[Math.floor(he()*T.length)];ve.equity[_e]=f[Y],ve.inflation[_e]=m[Y]||.025}v.push(_(y,ve,Z))}else T.forEach(Z=>{if(Z+l-1>C)return;const he={equity:{},inflation:{}};for(let ve=0;ve<l;ve++)he.equity[ve]=f[Z+ve]||0,he.inflation[ve]=m[Z+ve]||.025;v.push(_(y,he,Z))});const E=v.filter(Z=>Z.failed),S=v.filter(Z=>!Z.failed),A=(v.length-E.length)/v.length*100,de=v.map(Z=>Z.protMonths).reduce((Z,he)=>Z+he,0)/v.length,Ae=v.filter(Z=>Z.protMonths>0).length,J=S.map(Z=>Z.final).sort((Z,he)=>Z-he),oe=J.length>0?J[Math.floor(J.length*.5)]:0,ye=J.length>0?J[Math.floor(J.length*.9)]:0;return{equity:g.equity,bond:g.bond,cash:g.cash,rate:A,avgProt:de,withProt:Ae,totalRuns:v.length,medianFinal:oe,p90Final:ye}};let I;try{const g={equity:i.equityMin||0,bond:i.bondMin||0,cash:i.cashTarget||0},y=x(g);I={...g,...y}}catch(g){console.error("Optimisation error (original):",g),s.innerHTML='<div class="alert alert-danger">Error: '+g.message+"</div>",bn=!1,t&&(t.disabled=!1,t.textContent="Optimise Allocation");return}const M=10;let D=0,P=null;function O(){if(e!==Cr){bn=!1,t&&(t.disabled=!1,t.textContent="Optimise Allocation"),s.innerHTML="";return}try{const g=Math.min(D+M,d.length);for(;D<g;D++){const y=x(d[D]);y.avgProt<=I.avgProt&&(!P||y.rate>P.rate)&&(P=y)}s.innerHTML='<div class="loading"><div class="spinner"></div>Testing allocations... '+D+"/"+d.length+"</div>",D<d.length?setTimeout(O,0):z()}catch(g){console.error("Optimisation error:",g),s.innerHTML='<div class="alert alert-danger">Error: '+g.message+"</div>",bn=!1,t&&(t.disabled=!1,t.textContent="Optimise Allocation")}}function z(){if(e!==Cr){bn=!1,t&&(t.disabled=!1,t.textContent="Optimise Allocation"),s.innerHTML="";return}let g="";if(P&&P.rate>I.rate){const y=P.medianFinal-I.medianFinal,v=I.medianFinal>0?y/I.medianFinal*100:0;g+='<div class="card" style="margin-top:20px;border-color:var(--success);">',g+='<h3 style="color:var(--success);margin-top:0;">Better Allocation Found</h3>',g+='<p style="color:var(--text-muted);margin-bottom:16px;">A different fund split could improve your success rate without increasing protection usage:</p>',g+='<div class="grid-2" style="gap:20px;margin-bottom:20px;">',g+='<div style="padding:16px;background:rgba(0,0,0,0.2);border-radius:8px;">',g+='<div style="font-weight:500;margin-bottom:12px;color:var(--text-muted);">Your Current Split</div>',g+='<div style="font-size:24px;font-weight:600;color:var(--warning);">'+I.rate.toFixed(1)+"%</div>",g+='<div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">Success Rate</div>',g+='<div style="font-size:13px;">Equity: '+H(I.equity)+" ("+Math.round(I.equity/c*100)+"%)</div>",g+='<div style="font-size:13px;">Bonds: '+H(I.bond)+" ("+Math.round(I.bond/c*100)+"%)</div>",g+='<div style="font-size:13px;">Cash: '+H(I.cash)+" ("+Math.round(I.cash/c*100)+"%)</div>",g+='<div style="font-size:12px;color:var(--text-muted);margin-top:8px;">Avg protection: '+I.avgProt.toFixed(0)+" mo | Median final: "+H(I.medianFinal)+"</div>",g+="</div>",g+='<div style="padding:16px;background:rgba(46,160,67,0.1);border-radius:8px;border:1px solid var(--success);">',g+='<div style="font-weight:500;margin-bottom:12px;color:var(--success);">Optimised Split</div>',g+='<div style="font-size:24px;font-weight:600;color:var(--success);">'+P.rate.toFixed(1)+"%</div>",g+='<div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">Success Rate (+'+(P.rate-I.rate).toFixed(1)+"%)</div>",g+='<div style="font-size:13px;">Equity: '+H(P.equity)+" ("+Math.round(P.equity/c*100)+"%)</div>",g+='<div style="font-size:13px;">Bonds: '+H(P.bond)+" ("+Math.round(P.bond/c*100)+"%)</div>",g+='<div style="font-size:13px;">Cash: '+H(P.cash)+" ("+Math.round(P.cash/c*100)+"%)</div>",g+='<div style="font-size:12px;color:var(--text-muted);margin-top:8px;">Avg protection: '+P.avgProt.toFixed(0)+" mo | Median final: "+H(P.medianFinal)+"</div>",g+="</div>",g+="</div>",y<0?(g+='<div class="alert alert-warning" style="margin-bottom:16px;">',g+="<strong>Trade-off:</strong> The optimised allocation has a "+Math.abs(v).toFixed(0)+"% lower median final value. ",g+="This is because it likely has less equity exposure. You gain safety but may sacrifice some upside.",g+="</div>"):y>0&&(g+='<div class="alert alert-info" style="margin-bottom:16px;">',g+="<strong>Bonus:</strong> The optimised allocation also has a "+v.toFixed(0)+"% higher median final value!",g+="</div>"),g+='<div class="alert alert-info" style="margin-bottom:16px;">',g+="<strong>To apply this allocation:</strong> Click the button below to update your Settings with these new fund minimums.",g+="</div>",g+='<button onclick="applyOptimisedAllocationUI('+P.equity+","+P.bond+","+P.cash+')" style="width:100%;">Apply Optimised Allocation to Settings</button>',g+="</div>"}else g+='<div class="card" style="margin-top:20px;border-color:var(--primary);">',g+='<h3 style="color:var(--primary);margin-top:0;">Your Allocation is Already Optimal</h3>',g+='<p style="color:var(--text-muted);">We tested '+d.length+" different fund splits. Your current allocation achieves the best success rate ("+I.rate.toFixed(1)+"%) without increasing protection usage.</p>",g+='<p style="font-size:13px;color:var(--text-muted);">Your protection: '+I.avgProt.toFixed(0)+" months average</p>",g+="</div>";s.innerHTML=g,bn=!1,t&&(t.disabled=!1,t.textContent="Optimise Allocation")}setTimeout(O,0)};window.applyOptimisedAllocationUI=async function(n,e,t){if(document.getElementById("ssEquityMin").value=n,document.getElementById("ssBondMin").value=e,document.getElementById("ssCashTarget").value=t,document.getElementById("dsEquityMin").value=n,document.getElementById("dsBondMin").value=e,document.getElementById("dsCashTarget").value=t,Np({equityMin:n,bondMin:e,cashTarget:t,duration:parseInt(document.getElementById("ssDuration").value)||35}),Xo(),ft())try{await Wo({equityMin:n,bondMin:e,cashTarget:t})}catch(s){console.error("Error saving optimised settings:",s)}showToast("Optimised allocation applied to settings and starting values. Scroll up to re-run.","success",4e3)};const PT={1929:"Wall Street Crash / Great Depression",1930:"Great Depression",1931:"Great Depression",1932:"Great Depression",1937:"Recession of 1937",1968:"Late 1960s stagflation",1969:"Late 1960s recession",1973:"Oil Crisis / 1973-74 crash",1974:"1973-74 bear market",2e3:"Dot-com bubble burst",2001:"Dot-com bust / 9/11",2007:"Global Financial Crisis",2008:"Global Financial Crisis",2022:"Post-COVID inflation / rate hikes"};function CT(n){if(!n||n.length===0)return"";const e=n.filter(i=>i.failed).sort((i,a)=>i.years-a.years),t=n.filter(i=>i.protMonths>0).sort((i,a)=>a.protMonths-i.protMonths),s=e.length>0?e.slice(0,5):t.slice(0,5);if(s.length===0)return"";let r=`
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
      `;return s.forEach(i=>{const a=i.startYear||i.seed,l=PT[a]||"-",c=i.failed?"danger":"success";r+=`
          <tr>
            <td>${a}</td>
            <td style="font-size: 12px;">${l}</td>
            <td>${i.years.toFixed(1)}</td>
            <td>${i.protMonths}</td>
            <td>${H(i.final)}</td>
            <td style="color: var(--${c});">${i.failed?"FAILED":"OK"}</td>
          </tr>
        `}),r+=`
              </tbody>
            </table>
          </div>
        </details>
      `,r}function Lp(n,e,t,s,r){const i=n.successRate>=90?"success":n.successRate>=80?"warning":"danger",a=s.replace("Results",""),l=n.survival||{},c=n.finalValue||{},d=n.protection||{};let f=`
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
          ${s==="histResults"?CT(e):""}

          <!-- Result Summary -->
          <div class="alert ${i==="success"?"alert-success":i==="warning"?"alert-warning":"alert-danger"}" style="margin-top: 24px;">
            ${n.successRate>=90?"Excellent! Very high probability of success.":n.successRate>=80?"Good but some downside risk. Consider adjustments.":"Warning: Significant risk of depletion."}
          </div>
        </div>
      `;document.getElementById(s).innerHTML=f,setTimeout(()=>{const m=document.getElementById(`${a}ConeChart`),_=document.getElementById(`${a}TrajChart`),w=document.getElementById(`${a}HistChart`);m&&e&&e.length>0&&fT(m,e,{years:r,title:"Cone of Uncertainty (5th-95th Percentile)"}),_&&e&&e.length>0&&pT(_,e,{years:r,title:"Sample Trajectories (100 runs)"}),w&&e&&e.length>0&&mT(w,e,{title:"Protection Months Distribution"})},50)}function kT(n,e){let t='<div class="card"><h2>Scenario Analysis</h2>';t+=`
        <div class="chart-container" style="margin-bottom: 24px;">
          <canvas id="scenCompChart" width="900" height="400"></canvas>
        </div>
      `,t+='<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">';for(const[s,r]of Object.entries(n)){const i=r.result,a=i.failed?"danger":"success";t+=`
          <div class="history-item" style="border-left: 4px solid ${r.color};">
            <div>
              <div class="history-date">${r.name}</div>
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
        `}t+="</div></div>",document.getElementById(e).innerHTML=t,setTimeout(()=>{const s=document.getElementById("scenCompChart");s&&n&&gT(s,n,{years:35,title:"Scenario Comparison"})},50)}async function Zo(){kt("Loading settings...");try{const n=await Wt();document.getElementById("ssBaseSalary").value=n.baseSalary,document.getElementById("ssEquityMin").value=n.equityMin,document.getElementById("ssBondMin").value=n.bondMin,document.getElementById("ssCashTarget").value=n.cashTarget,document.getElementById("ssDuration").value=n.duration,document.getElementById("ssPA").value=n.pa,document.getElementById("ssBRL").value=n.brl,document.getElementById("ssHRL").value=n.hrl,document.getElementById("ssTaxMode").value=n.taxMode||"inflates",document.getElementById("ssOther").value=n.other||0,document.getElementById("ssSpStartDate").value=n.spStartDate||"",document.getElementById("ssSpWeeklyAmount").value=n.spWeeklyAmount||"",go("ss"),document.getElementById("ssConsecutiveLimit").value=n.consecutiveLimit||3,document.getElementById("ssProtectionMult").value=n.protectionMult||.8,document.getElementById("ssDisableProtection").checked=n.disableProtection||!1,document.getElementById("ssHodlEnabled").checked=n.hodlEnabled||!1,document.getElementById("ssHodlValue").value=n.hodlValue||25e3,document.getElementById("ssIsaBalance").value=n.isaBalance||0;const e=document.getElementById("ssSeedNote");e&&(e.textContent=n.seededFrom==="decision"&&n.seededAt?"Seeded from Decision Tool "+new Date(n.seededAt).toLocaleDateString():""),Xo()}catch(n){console.error("Error loading stress settings:",n)}finally{Mt()}}window.saveStressSettingsUI=async function(){if(!ft()){showToast("Please sign in to save settings","error");return}const n=jo(document.getElementById("ssSpStartDate").value.trim());if(!n.valid){showToast(n.error,"error");return}if(n.warning&&showToast(n.warning,"warning"),!!wc(+document.getElementById("ssEquityMin").value,+document.getElementById("ssBondMin").value,+document.getElementById("ssCashTarget").value)){kt("Saving settings...");try{await Wo({baseSalary:+document.getElementById("ssBaseSalary").value,equityMin:+document.getElementById("ssEquityMin").value,bondMin:+document.getElementById("ssBondMin").value,cashTarget:+document.getElementById("ssCashTarget").value,duration:+document.getElementById("ssDuration").value,pa:+document.getElementById("ssPA").value,brl:+document.getElementById("ssBRL").value,hrl:+document.getElementById("ssHRL").value,taxMode:document.getElementById("ssTaxMode").value,other:+document.getElementById("ssOther").value,spStartDate:document.getElementById("ssSpStartDate").value.trim()||null,spWeeklyAmount:+document.getElementById("ssSpWeeklyAmount").value||0,consecutiveLimit:+document.getElementById("ssConsecutiveLimit").value,protectionMult:+document.getElementById("ssProtectionMult").value,disableProtection:document.getElementById("ssDisableProtection").checked,hodlEnabled:document.getElementById("ssHodlEnabled").checked,hodlValue:+document.getElementById("ssHodlValue").value,isaBalance:+document.getElementById("ssIsaBalance").value||0}),showToast("Settings saved successfully","success")}catch(e){console.error("Error saving stress settings:",e),showToast("Error saving: "+e.message,"error")}finally{Mt()}}};window.copyStressFromDecisionUI=async function(){if(!ft()){showToast("Please sign in first","error");return}if(confirm("Copy your Decision Tool plan basics (funds, income, State Pension, ISA, protection) into the Stress Tester? Your Stress-specific what-ifs (tax mode, HODL) are kept.")){kt("Copying from Decision...");try{const n=await pn(),e=await Wt(),t=Lb(n,e);await Wo(t),await Zo(),showToast("Stress Tester seeded from your Decision plan","success")}catch(n){console.error("Error copying from decision:",n),showToast("Error copying: "+n.message,"error")}finally{Mt()}}};window.resetStressSettingsUI=async function(){if(confirm("Reset all stress settings to defaults?")){kt("Resetting settings...");try{await mE(),await Zo(),showToast("Settings reset to defaults","success")}catch(n){console.error("Error resetting settings:",n),showToast("Error resetting: "+n.message,"error")}finally{Mt()}}};async function Op(){kt("Loading settings...");try{const n=await pn();document.getElementById("dsEquityMin").value=n.equityMin||25e4,document.getElementById("dsBondMin").value=n.bondMin||2e5,document.getElementById("dsCashTarget").value=n.cashTarget||5e4,document.getElementById("dsDuration").value=n.duration||35,document.getElementById("dsBaseSalary").value=n.baseSalary||3e4,document.getElementById("dsProtectionFactor").value=n.protectionFactor||20,document.getElementById("dsRecoveryBuffer").value=n.recoveryBuffer||15e3,document.getElementById("dsConsecutiveLimit").value=n.consecutiveLimit||3,document.getElementById("dsIsaBalance").value=n.isaBalance||0,document.getElementById("entryEquity").value=n.equityMin||25e4,document.getElementById("entryBond").value=n.bondMin||2e5,document.getElementById("entryCash").value=n.cashTarget||5e4,document.getElementById("entryIsa").value=n.isaBalance||0,Xo()}catch(n){console.error("Error loading decision settings:",n)}finally{Mt()}}window.saveDecisionSettingsUI=async function(){if(!ft()){showToast("Please sign in to save settings","error");return}const n=jo(document.getElementById("dsSpStartDate").value.trim());if(!n.valid){showToast(n.error,"error");return}if(n.warning&&showToast(n.warning,"warning"),!!wc(+document.getElementById("dsEquityMin").value,+document.getElementById("dsBondMin").value,+document.getElementById("dsCashTarget").value)){kt("Saving settings...");try{await cc({equityMin:+document.getElementById("dsEquityMin").value,bondMin:+document.getElementById("dsBondMin").value,cashTarget:+document.getElementById("dsCashTarget").value,duration:+document.getElementById("dsDuration").value,baseSalary:+document.getElementById("dsBaseSalary").value,spStartDate:document.getElementById("dsSpStartDate").value.trim()||null,spWeeklyAmount:+document.getElementById("dsSpWeeklyAmount").value||0,protectionFactor:+document.getElementById("dsProtectionFactor").value,recoveryBuffer:+document.getElementById("dsRecoveryBuffer").value,consecutiveLimit:+document.getElementById("dsConsecutiveLimit").value,isaBalance:+document.getElementById("dsIsaBalance").value||0}),showToast("Settings saved successfully","success")}catch(e){console.error("Error saving decision settings:",e),showToast("Error saving: "+e.message,"error")}finally{Mt()}}};window.resetDecisionSettingsUI=async function(){if(confirm("Reset all decision settings to defaults?")){kt("Resetting settings...");try{await cc({equityMin:25e4,bondMin:2e5,cashTarget:5e4,duration:35,baseSalary:3e4,protectionFactor:20,recoveryBuffer:15e3,consecutiveLimit:3}),await Op(),showToast("Settings reset to defaults","success")}catch(n){console.error("Error resetting settings:",n),showToast("Error resetting: "+n.message,"error")}finally{Mt()}}};window.showDrawdownScheduleUI=async function(){const n=parseFloat(document.getElementById("ddInflation").value)/100||.025,e=parseInt(document.getElementById("ddDuration").value)||35;try{const t=await Wt();t.duration=e;const s=fm(t,e,n);let r='<div class="card"><h2>Projected SIPP Drawdown Schedule</h2>';r+='<div style="overflow-x: auto;"><table>',r+="<thead><tr><th>Year</th><th>BRL</th><th>Other</th><th>State</th><th>SIPP Draw</th><th>Tax</th><th>Net</th></tr></thead>",r+="<tbody>";for(const i of s)r+=`<tr>
            <td>${i.year}</td>
            <td>${H(i.brl)}</td>
            <td>${H(i.other)}</td>
            <td>${H(i.statePension)}</td>
            <td style="color: var(--primary); font-weight: 600;">${H(i.sippDraw)}</td>
            <td style="color: var(--danger);">-${H(i.tax)}</td>
            <td style="color: var(--success);">${H(i.netIncome)}</td>
          </tr>`;r+="</tbody></table></div></div>",document.getElementById("drawdownResults").innerHTML=r}catch(t){console.error("Drawdown error:",t),document.getElementById("drawdownResults").innerHTML=`<div class="alert alert-danger">Error: ${t.message}</div>`}};window.showGlidepathUI=async function(){const n=parseFloat(document.getElementById("gpInflation").value)/100||.025,e=parseInt(document.getElementById("gpDuration").value)||35;try{const t=await Wt();t.duration=e;const s=mm(t,n);let r='<div class="card"><h2>Fund Glidepath (Inflation-Adjusted Minimums)</h2>';r+='<div class="alert alert-info" style="margin-bottom: 20px;">',r+="<strong>Glidepath Logic:</strong> Equity & Bond minimums inflate with CPI but deplete linearly to £0. Cash inflates only (maintains real value).",r+="</div>",r+='<div style="overflow-x: auto;"><table>',r+="<thead><tr><th>Year</th><th>Cum Inflation</th><th>Equity Min</th><th>Bond Min</th><th>Cash Target</th><th>Total Min</th></tr></thead>",r+="<tbody>";for(const i of s)r+=`<tr>
            <td>${i.year}</td>
            <td>${(i.cumulativeInflation*100-100).toFixed(1)}%</td>
            <td style="color: var(--success);">${H(i.equityMin)}</td>
            <td style="color: var(--info);">${H(i.bondMin)}</td>
            <td style="color: var(--warning);">${H(i.cashTarget)}</td>
            <td style="font-weight: 600;">${H(i.totalMin)}</td>
          </tr>`;r+="</tbody></table></div></div>",document.getElementById("glidepathResults").innerHTML=r}catch(t){console.error("Glidepath error:",t),document.getElementById("glidepathResults").innerHTML=`<div class="alert alert-danger">Error: ${t.message}</div>`}};let wt=null,En=[],Ot="all";async function qt(){const n=document.getElementById("historyTabs"),e=document.getElementById("historyDetail"),t=document.getElementById("historyYearFilter"),s=document.getElementById("deleteAllHistoryBtn"),r=document.getElementById("deleteYearBtn");if(!n||!e)return;if(n.innerHTML='<span class="loading">Loading...</span>',En=await nr({sortDesc:!1,limit:500}),s&&(s.style.display=En.length>0?"":"none"),r&&(r.style.display="none"),En.length===0){n.innerHTML="",t&&(t.innerHTML='<option value="all">No entries</option>'),e.innerHTML=`
          <div class="no-history-message">
            <h3>No History Entries</h3>
            <p>Save decisions from the Decision Tool to build your history.</p>
          </div>
        `;return}const i=[...new Set(En.map(d=>d.date.split("-")[0]))].sort().reverse();if(t){let d='<option value="all">All Years</option>';i.forEach(f=>{d+=`<option value="${f}">${f}</option>`}),t.innerHTML=d,t.value=Ot}r&&(r.style.display=Ot!=="all"&&En.length>0?"":"none");const a=Ot==="all"?En:En.filter(d=>d.date.startsWith(Ot));if(a.length===0){n.innerHTML="",e.innerHTML=`
          <div class="no-history-message">
            <h3>No entries for ${Ot}</h3>
            <p>Select a different year or "All Years".</p>
          </div>
        `;return}let l="";a.forEach(d=>{const f=d.date===wt,m=["history-tab"];f&&m.push("active"),d.inProtection&&m.push("protection");const[_,w]=d.date.split("-").map(Number),T=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],C=Ot==="all"?`${T[w-1]} ${_}`:T[w-1];l+=`<button class="${m.join(" ")}" onclick="selectHistoryEntry('${d.date}')">${C}</button>`}),n.innerHTML=l;const c=document.getElementById("historyMobileSelector");if(c){let d="";a.forEach(f=>{const m=Qs(f.date),_=f.inProtection?" (Protection)":"";d+=`<option value="${f.date}">${m}${_}</option>`}),c.innerHTML=d}(!wt||!a.find(d=>d.date===wt))&&(wt=a[a.length-1].date),c&&(c.value=wt),Vp(wt),setTimeout(()=>{const d=n.querySelector(".history-tab.active");d&&d.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})},100)}window.filterHistoryByYear=function(n){Ot=n,wt=null,qt()};function Qs(n){const[e,t]=n.split("-").map(Number);return`${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][t-1]} ${e}`}function Vp(n){const e=document.getElementById("historyDetail"),t=En.find(d=>d.date===n);if(!t){e.innerHTML='<div class="no-history-message"><h3>Entry not found</h3></div>';return}const s=d=>d!=null?"£"+Math.round(d).toLocaleString():"—",r=t.isTaxEfficientYear!==!1&&t.mode==="Tax-Efficient",i=t.inProtection?"warning":r?"efficient":"inefficient",a=t.inProtection?`Protection${t.protectionInducedTaxEfficiency?" (Tax-Efficient)":""}`:r?"Tax-Efficient":"Standard";let l=t.source||"Unknown";t.source==="Growth"&&(t.dEquity>0||t.dBond>0)?l=`Growth (Equity: ${s(t.dEquity||0)}, Bond: ${s(t.dBond||0)})`:t.source==="Cash"&&(l=`Cash (${s(t.dCash||t.sipp||0)})`);let c=`
        <!-- Header with date and mode -->
        <div class="history-detail-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <div>
              <h3 style="margin:0;">${Qs(t.date)}</h3>
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
              <span class="value">${s(t.equity)}</span>
            </div>
            <div class="history-field">
              <label>Bond</label>
              <span class="value">${s(t.bond)}</span>
            </div>
            <div class="history-field">
              <label>Cash</label>
              <span class="value">${s(t.cash)}</span>
            </div>
            <div class="history-field">
              <label>Total</label>
              <span class="value" style="color:var(--primary);">${s(t.total)}</span>
            </div>
          </div>

          <!-- Glidepath targets -->
          ${t.adjEquity||t.adjBond||t.adjCash?`
            <div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--border);">
              <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">GLIDEPATH TARGETS</div>
              <div class="history-grid">
                <div class="history-field">
                  <label>Equity Min</label>
                  <span class="value">${s(t.adjEquity)}</span>
                </div>
                <div class="history-field">
                  <label>Bond Min</label>
                  <span class="value">${s(t.adjBond)}</span>
                </div>
                <div class="history-field">
                  <label>Cash Target</label>
                  <span class="value">${s(t.adjCash)}</span>
                </div>
                <div class="history-field">
                  <label>Surplus</label>
                  <span class="value ${(t.total||0)-(t.adjEquity||0)-(t.adjBond||0)-(t.adjCash||0)>=0?"success":"danger"}">
                    ${s((t.total||0)-(t.adjEquity||0)-(t.adjBond||0)-(t.adjCash||0))}
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
              <span class="value" style="color:var(--primary);">${s(t.sipp)}</span>
            </div>
            <div class="history-field">
              <label>ISA Top-up</label>
              <span class="value">${s(t.isa)}</span>
            </div>
            <div class="history-field">
              <label>Other Income</label>
              <span class="value">${s(t.other)}</span>
            </div>
            <div class="history-field">
              <label>State Pension</label>
              <span class="value">${s(t.state)}</span>
            </div>
          </div>

          <div style="margin-top:16px;padding:16px;background:var(--card-alt);border-radius:8px;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-weight:500;">Total Monthly Income</span>
              <span style="font-size:20px;font-weight:600;color:var(--success);">${s(t.monthlyNet)}</span>
            </div>
          </div>

          ${t.boostAmount>0?`
            <div style="margin-top:12px;padding:12px;background:rgba(46,204,113,0.1);border-radius:8px;">
              <strong style="color:var(--success);">Tax Boost:</strong>
              <span style="color:var(--success);">+${s(t.boostAmount)}</span>
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
                <span class="value">${s(t.yearlyIsaSavingsAllocation)}</span>
              </div>
              <div class="history-field">
                <label>Used This Month</label>
                <span class="value">${s(t.isaSavingsUsedThisMonth||t.isa)}</span>
              </div>
              <div class="history-field">
                <label>Cumulative Used</label>
                <span class="value">${s(t.cumulativeIsaSavingsUsed)}</span>
              </div>
              <div class="history-field">
                <label>Remaining</label>
                <span class="value ${(t.yearlyIsaSavingsAllocation||0)-(t.cumulativeIsaSavingsUsed||0)>0?"success":"warning"}">
                  ${s((t.yearlyIsaSavingsAllocation||0)-(t.cumulativeIsaSavingsUsed||0))}
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
              <span class="value">${s(t.pa)}</span>
            </div>
            <div class="history-field">
              <label>Basic Rate Limit</label>
              <span class="value">${s(t.brl)}</span>
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
                <td>${s(t.taxPaidMonthly||t.monthlyTax)}</td>
                <td>${s(t.taxPaidYTD)}</td>
                <td>${s(t.taxProjectedAnnual)}</td>
              </tr>
              ${t.taxSavedMonthly>0||t.taxSavedProjectedAnnual>0?`
                <tr>
                  <td class="source-name">Tax Saved</td>
                  <td class="net-col">-${s(t.taxSavedMonthly)}</td>
                  <td class="net-col">-${s(t.taxSavedYTD)}</td>
                  <td class="net-col">-${s(t.taxSavedProjectedAnnual)}</td>
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
      `;e.innerHTML=c,document.querySelectorAll(".history-tab").forEach(d=>{d.classList.toggle("active",d.textContent===Qs(n))})}window.selectHistoryEntry=function(n){wt=n,Vp(n);const e=document.getElementById("historyMobileSelector");e&&(e.value=n);const s=document.getElementById("historyTabs").querySelector(".history-tab.active");s&&s.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})};window.scrollHistoryTabs=function(n){const e=document.getElementById("historyTabs"),t=200;n==="left"?e.scrollLeft-=t:e.scrollLeft+=t};function yo(n){const[e,t]=n.split("-").map(Number);return t>=4?`${e%100}/${(e+1)%100}`:`${(e-1)%100}/${e%100}`}async function al(n){const e={};for(const s of n){const r=s.taxYear||yo(s.date);e[r]||(e[r]=0),e[r]+=s.isaSavingsUsedThisMonth||s.isa||0}for(const s of n)await ap(s.date);const t=await Hn();for(const[s,r]of Object.entries(e))if(t[s]){const i=t[s].isaSavingsUsed||0,a=Math.max(0,i-r);await ys(s,{...t[s],isaSavingsUsed:a})}}window.deleteHistoryEntry=async function(n){if(!ft()){showToast("Please sign in to delete entries","error");return}const e=await nr({sortDesc:!1,limit:1e3}),t=yo(n),r=e.filter(c=>(c.taxYear||yo(c.date))===t).sort((c,d)=>c.date.localeCompare(d.date)),i=r.findIndex(c=>c.date===n);if(i===-1){showToast("Entry not found","error");return}const a=i===r.length-1,l=Qs(n);if(a){if(!confirm(`Delete entry for ${l}?`))return;kt("Deleting entry...");try{await al([r[i]]),showToast(`Deleted ${l}`,"success"),wt=null,await qt()}catch(c){console.error("Delete error:",c),showToast("Error deleting: "+c.message,"error")}finally{Mt()}}else{const c=r.slice(i),d=Qs(c[c.length-1].date);if(!confirm(`This will delete ${c.length} entries from ${l} to ${d} in tax year ${t}.

Continue?`))return;kt(`Deleting ${c.length} entries...`);try{await al(c),showToast(`Deleted ${c.length} entries`,"success"),wt=null,await qt()}catch(f){console.error("Delete error:",f),showToast("Error deleting: "+f.message,"error")}finally{Mt()}}};window.deleteHistoryForTaxYear=async function(n){if(!ft()){showToast("Please sign in to delete entries","error");return}const t=(await nr({sortDesc:!1,limit:1e3})).filter(s=>(s.taxYear||yo(s.date))===n);if(t.length===0){showToast(`No history entries for tax year ${n}`,"info");return}if(confirm(`Delete all ${t.length} history entries for tax year ${n}?`)){kt(`Deleting tax year ${n}...`);try{await al(t);const s=await Hn();s[n]&&await ys(n,{...s[n],isaSavingsUsed:0}),showToast(`Deleted all entries for ${n}`,"success"),wt=null,await qt()}catch(s){console.error("Delete error:",s),showToast("Error deleting: "+s.message,"error")}finally{Mt()}}};window.deleteHistoryForSelectedYear=async function(){if(Ot==="all"){showToast("Select a specific year first","error");return}const n=`${parseInt(Ot)%100}/${(parseInt(Ot)+1)%100}`;await deleteHistoryForTaxYear(n)};window.deleteAllHistory=async function(){if(confirm("Delete ALL history entries? This cannot be undone.")&&confirm("Are you ABSOLUTELY sure? All decision history will be permanently deleted.")){if(!ft()){showToast("Please sign in to delete entries","error");return}kt("Deleting all history...");try{const n=await nr({limit:1e3});for(const t of n)await ap(t.date);const e=await Hn();for(const[t,s]of Object.entries(e))s.isaSavingsUsed>0&&await ys(t,{...s,isaSavingsUsed:0});showToast(`Deleted ${n.length} entries`,"success"),wt=null,await qt()}catch(n){console.error("Delete all error:",n),showToast("Error deleting: "+n.message,"error")}finally{Mt()}}};let Xn=null;async function hs(){const n=document.getElementById("taxYearTabs"),e=document.getElementById("taxYearDetail");if(!n||!e)return;n.innerHTML='<span class="loading">Loading...</span>';const t=await Hn();await pn();const s=Object.keys(t).sort(),r=MT(),i=DT(s,r,40);let a="";i.forEach(d=>{const f=t[d],m=f&&f.yearSetupComplete,_=d===Xn,w=["tax-year-tab"];_&&w.push("active"),m||w.push("not-setup"),a+=`<button class="${w.join(" ")}" onclick="selectTaxYear('${d}')">${d}</button>`}),n.innerHTML=a;const l=document.getElementById("taxYearMobileSelector");if(l){let d="";i.forEach(f=>{const m=t[f],w=m&&m.yearSetupComplete?f:`${f} (not set up)`;d+=`<option value="${f}">${w}</option>`}),l.innerHTML=d}if(!Xn){const d=s.filter(f=>{var m;return(m=t[f])==null?void 0:m.yearSetupComplete});Xn=d.length>0?d[d.length-1]:r}l&&(l.value=Xn),await Bp(Xn,t);const c=n.querySelector(".tax-year-tab.active");c&&c.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})}function MT(){const n=new Date,e=n.getFullYear(),t=n.getMonth()+1;return t<4||t===4&&n.getDate()<6?`${String(e-1).slice(-2)}/${String(e).slice(-2)}`:`${String(e).slice(-2)}/${String(e+1).slice(-2)}`}function DT(n,e,t){const s=new Set(n),[r]=e.split("/").map(Number),i=r<50?2e3+r:1900+r;for(let a=0;a<t&&s.size<t;a++){const l=i+a,c=l+1;s.add(`${String(l).slice(-2)}/${String(c).slice(-2)}`)}return Array.from(s).sort()}async function Bp(n,e,t){var m,_,w,T,C,x,I,M,D,P,O,z,g,y;const s=document.getElementById("taxYearDetail"),r=e[n];if(!r||!r.yearSetupComplete){s.innerHTML=`
          <div class="not-configured-message">
            <h3>Tax Year ${n} Not Configured</h3>
            <p>This tax year hasn't been set up yet. Use the Decision Tool to calculate a decision for a month in this tax year to trigger the setup wizard.</p>
            <button class="btn primary" onclick="triggerWizardForYear('${n}')">Set Up ${n}</button>
          </div>
        `;return}const i=await dc(n),a=Math.round(i.amount||0),l=i.startDate||"Not configured",c=i.isReceiving;i.yearsUntil;const d=v=>v!=null?"£"+Math.round(v).toLocaleString():"—";let f=`
        <!-- Tax Thresholds -->
        <div class="tax-year-detail-card">
          <h3>Tax Thresholds</h3>
          <div class="tax-year-grid">
            <div class="tax-year-field">
              <label>Personal Allowance</label>
              <input type="number" value="${r.pa||12570}" onchange="updateTaxYear('${n}','pa',this.value)">
            </div>
            <div class="tax-year-field">
              <label>Basic Rate Limit</label>
              <input type="number" value="${r.brl||50270}" onchange="updateTaxYear('${n}','brl',this.value)">
            </div>
            <div class="tax-year-field">
              <label>Higher Rate Limit</label>
              <input type="number" value="${r.hrl||125140}" onchange="updateTaxYear('${n}','hrl',this.value)">
            </div>
            <div class="tax-year-field">
              <label>CPI (Previous Year)</label>
              <input type="number" step="0.1" value="${((r.cpi||.04)*100).toFixed(1)}" onchange="updateTaxYear('${n}','cpi',this.value/100)">
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
              <input type="number" value="${r.other||0}" onchange="updateTaxYear('${n}','other',this.value)">
            </div>
            <div class="tax-year-field">
              <label>State Pension (Annual)</label>
              <span class="value">${c?d(a)+(i.isFirstYear?" (partial year)":""):l!=="Not configured"?`Starts ${l}`:"Not configured"}</span>
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
              <span class="value">${NT(r.startMonth||4)}</span>
            </div>
            <div class="tax-year-field">
              <label>Remaining Months (at setup)</label>
              <span class="value">${r.remainingMonths||12}</span>
            </div>
          </div>
        </div>
      `;if(r.expectedMonthly){const v=r.expectedMonthly;f+=`
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
                  <td>${d((m=v.sipp)==null?void 0:m.gross)}</td>
                  <td class="tax-col">-${d((_=v.sipp)==null?void 0:_.tax)}</td>
                  <td class="net-col">${d((w=v.sipp)==null?void 0:w.net)}</td>
                </tr>
                ${((T=v.other)==null?void 0:T.gross)>0?`
                <tr>
                  <td class="source-name">Other Income</td>
                  <td>${d((C=v.other)==null?void 0:C.gross)}</td>
                  <td class="tax-col">-${d((x=v.other)==null?void 0:x.tax)}</td>
                  <td class="net-col">${d((I=v.other)==null?void 0:I.net)}</td>
                </tr>
                `:""}
                ${((M=v.statePension)==null?void 0:M.gross)>0?`
                <tr>
                  <td class="source-name">State Pension</td>
                  <td>${d((D=v.statePension)==null?void 0:D.gross)}</td>
                  <td class="tax-col">-${d((P=v.statePension)==null?void 0:P.tax)}</td>
                  <td class="net-col">${d((O=v.statePension)==null?void 0:O.net)}</td>
                </tr>
                `:""}
                ${((z=v.isa)==null?void 0:z.net)>0?`
                <tr>
                  <td class="source-name">ISA <span style="color:var(--success);font-size:11px;">(tax-free)</span></td>
                  <td>${d((g=v.isa)==null?void 0:g.gross)}</td>
                  <td style="color:var(--success);">£0</td>
                  <td class="net-col">${d((y=v.isa)==null?void 0:y.net)}</td>
                </tr>
                `:""}
              </tbody>
              <tfoot>
                <tr>
                  <td><strong>Total</strong></td>
                  <td><strong>${d(v.totalGross)}</strong></td>
                  <td class="tax-col"><strong>-${d(v.totalTax)}</strong></td>
                  <td class="net-col"><strong>${d(v.totalNet)}</strong></td>
                </tr>
              </tfoot>
            </table>
            <p style="margin-top:16px;font-size:14px;color:var(--text);">
              <strong>Monthly take-home: ${d(v.totalNet)}</strong>
            </p>
          </div>
        `}f+=`
        <div class="tax-year-actions">
          <button class="btn secondary" onclick="deleteTaxYear('${n}')">Delete Year</button>
          <button class="btn secondary" onclick="reconfigureTaxYear('${n}')">Reconfigure via Wizard</button>
        </div>
      `,s.innerHTML=f,document.querySelectorAll(".tax-year-tab").forEach(v=>{v.classList.toggle("active",v.textContent===n)})}window.selectTaxYear=async function(n){Xn=n;const e=await Hn();await pn(),await Bp(n,e),document.querySelectorAll(".tax-year-tab").forEach(i=>{i.classList.toggle("active",i.textContent===n)});const t=document.getElementById("taxYearMobileSelector");t&&(t.value=n);const r=document.getElementById("taxYearTabs").querySelector(`.tax-year-tab[onclick="selectTaxYear('${n}')"]`);r&&r.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})};window.scrollTaxYearTabs=function(n){const e=document.getElementById("taxYearTabs"),t=200;n==="left"?e.scrollLeft-=t:e.scrollLeft+=t};function NT(n){return["January","February","March","April","May","June","July","August","September","October","November","December"][(n-1)%12]||"April"}window.triggerWizardForYear=async function(n){const[e]=n.split("/").map(Number),t=e<50?2e3+e:1900+e,s=`${t}-04`,r=document.getElementById("selectedMonth");r&&(r.value=s),document.querySelectorAll(".tab").forEach(i=>i.classList.remove("active")),document.querySelector('.tab[data-tab="decision"]').classList.add("active"),document.querySelectorAll(".tab-content").forEach(i=>i.classList.remove("active")),document.getElementById("decision-content").classList.add("active"),document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(i=>i.classList.remove("active")),document.querySelector('.sub-tab[data-decisiontab="entry"]').classList.add("active"),document.querySelectorAll(".decision-subtab").forEach(i=>i.classList.add("hidden")),document.getElementById("decision-entry").classList.remove("hidden"),showToast(`Please click "Calculate" with April ${t} selected to set up tax year ${n}`,"info",5e3)};window.reconfigureTaxYear=async function(n){if(confirm(`This will allow you to reconfigure tax year ${n}. The setup wizard will be triggered when you next calculate a decision for this year. Continue?`))try{const e=await qo(n);e.yearSetupComplete=!1,await ys(n,e),await hs(),showToast(`Tax year ${n} marked for reconfiguration. Calculate a decision for this year to run the wizard again.`,"success",5e3)}catch(e){console.error("Error:",e),showToast("Error: "+e.message,"error")}};window.updateTaxYear=async function(n,e,t){try{const s=await qo(n);s[e]=parseFloat(t),await ys(n,s)}catch(s){console.error("Error updating tax year:",s),showToast("Error saving: "+s.message,"error")}};window.deleteTaxYear=async function(n){if(confirm("Delete tax year "+n+"? This will remove all configuration for this year."))try{const e=await jt();delete e.taxYears[n],await $o(e),Xn=null,await hs()}catch(e){console.error("Error deleting tax year:",e),showToast("Error deleting: "+e.message,"error")}};window.addTaxYear=async function(){if(!ft()){showToast("Please sign in to add tax years","error");return}const n=prompt("Enter tax year (e.g., 25/26):");if(!n||!/^\d{2}\/\d{2}$/.test(n)){showToast("Invalid format. Use YY/YY (e.g., 25/26)","error");return}try{await ys(n,{}),await hs()}catch(e){console.error("Save error:",e),showToast("Error saving: "+e.message,"error")}};console.log("Pension Planner v"+Md+" loaded");
