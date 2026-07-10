(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function t(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(r){if(r.ep)return;r.ep=!0;const i=t(r);fetch(r.href,i)}})();function Xp(n){const e=(n.sippDraw||0)+(n.other||0)+(n.statePension||0),t=e*12,s=n.pa||12570,r=n.brl||50270,i=n.hrl||125140;let a=0;t>s&&(t<=r?a=(t-s)*.2:t<=i?a=(r-s)*.2+(t-r)*.4:a=(r-s)*.2+(i-r)*.4+(t-i)*.45);const l=a/12,c=e-l+(n.isaDraw||0);return{date:n.date,taxYear:n.taxYear,yearNum:n.yearNumber,equity:n.equity,bond:n.bond,cash:n.cash,total:n.equity+n.bond+n.cash,adjEquity:n.adjEquityMin,adjBond:n.adjBondMin,adjCash:n.adjCashTarget,source:n.source,dEquity:n.drawFromEquity||0,dBond:n.drawFromBond||0,dCash:n.drawFromCash||0,sipp:n.sippDraw,stdSipp:n.stdSipp||n.sippDraw,isa:n.isaDraw,other:n.other,state:n.statePension,pa:s,brl:r,monthlyTax:l,monthlyNet:c,mode:n.taxEfficient?"Tax-Efficient":"Standard",inProtection:n.inProtection,reason:n.protectionReason||"",consecutiveDraws:n.consecutiveCashDraws||0,boostAmount:n.boostAmount,boostEligible:n.boostEligible||!1,rebal:n.rebalanceActions?n.rebalanceActions.join("; "):"",yearlyIsaSavingsAllocation:n.yearlyIsaSavingsAllocation||0,isaSavingsUsedThisMonth:n.isaDraw||0,cumulativeIsaSavingsUsed:n.cumulativeIsaSavingsUsed||0,taxPaidMonthly:l,taxPaidYTD:n.taxPaidYTD||l,taxProjectedAnnual:n.taxProjectedAnnual||a,taxSavedMonthly:n.taxSavedMonthly||0,taxSavedYTD:n.taxSavedYTD||0,taxSavedProjectedAnnual:n.taxSavedProjectedAnnual||0,isTaxEfficientYear:n.isTaxEfficientYear??!0,protectionInducedTaxEfficiency:n.protectionInducedTaxEfficiency||!1,remainingMonths:n.remainingMonths||12}}const ki={INFO:"info",WARNING:"warning",DANGER:"danger",SUCCESS:"success"},Pd="6.0.0",ze={PERSONAL_ALLOWANCE:12570,BASIC_RATE_LIMIT:50270,HIGHER_RATE_LIMIT:125140,BASIC_RATE:.2,HIGHER_RATE:.4,ADDITIONAL_RATE:.45,PA_TAPER_THRESHOLD:1e5,PA_TAPER_RATE:.5},al={ASSUMED_CPI:.025,OTHER_INCOME_CAP:.04},Rt={RETURN:.03,MIN:0,DRAWDOWN_STRATEGY:"minimiseEarlyTax"},de={BASE_SALARY:3e4,EQUITY_MIN:25e4,BOND_MIN:2e5,CASH_TARGET:5e4,DURATION_YEARS:35,PROTECTION_FACTOR:20,RECOVERY_BUFFER:15e3,CONSECUTIVE_LIMIT:3},Zn={PROTECTION_MULTIPLIER:.8,HODL_ENABLED:!1,HODL_VALUE:25e3},Br={1928:.4781,1929:-.172,1930:-.338,1931:-.527,1932:-.231,1933:.669,1934:.041,1935:.3879,1936:.2492,1937:-.3839,1938:.2846,1939:-.0278,1940:-.1278,1941:-.1552,1942:.0782,1943:.1382,1944:.1226,1945:.2665,1946:-.0818,1947:.0225,1948:-.0246,1949:.1279,1950:.1787,1951:.1463,1952:.0837,1953:-.0377,1954:.4399,1955:.2084,1956:.0262,1957:-.1278,1958:.3396,1959:.1612,1960:-.0912,1961:.1889,1962:-.1081,1963:.1715,1964:.1478,1965:.1058,1966:-.1858,1967:.1506,1968:.0457,1969:-.1524,1970:.0482,1971:.0627,1972:.1476,1973:-.1652,1974:-.2777,1975:.3815,1976:.1774,1977:-.1271,1978:-.0303,1979:.0414,1980:.1493,1981:-.0909,1982:.1976,1983:.2027,1984:-.0365,1985:.2778,1986:.2278,1987:.0227,1988:.1185,1989:.2697,1990:-.0456,1991:.2013,1992:.044,1993:.1372,1994:.0218,1995:.3345,1996:.2601,1997:.2264,1998:.1627,1999:.2516,2e3:-.0617,2001:-.0727,2002:-.1679,2003:.2525,2004:.0333,2005:-.0061,2006:.1618,2007:.0648,2008:-.3355,2009:.1882,2010:.1102,2011:.0556,2012:.0728,2013:.2665,2014:.0775,2015:-.023,2016:.1342,2017:.2511,2018:-.0583,2019:.2234,2020:.0726,2021:.1873,2022:-.0878,2023:.1399,2024:.1299},ll={1928:-.012,1929:.002,1930:-.06,1931:-.094,1932:-.103,1933:.005,1934:.021,1935:.03,1936:.014,1937:.028,1938:-.02,1939:-.014,1940:.01,1941:.099,1942:.09,1943:.03,1944:.023,1945:.023,1946:.186,1947:.087,1948:.03,1949:-.02,1950:.059,1951:.06,1952:.009,1953:.006,1954:-.007,1955:.004,1956:.03,1957:.028,1958:.017,1959:.015,1960:.014,1961:.007,1962:.013,1963:.017,1964:.01,1965:.019,1966:.034,1967:.028,1968:.046,1969:.062,1970:.055,1971:.033,1972:.034,1973:.087,1974:.124,1975:.069,1976:.048,1977:.067,1978:.09,1979:.133,1980:.125,1981:.089,1982:.038,1983:.038,1984:.04,1985:.038,1986:.011,1987:.044,1988:.044,1989:.046,1990:.061,1991:.03,1992:.029,1993:.027,1994:.026,1995:.025,1996:.034,1997:.017,1998:.016,1999:.027,2e3:.034,2001:.016,2002:.024,2003:.019,2004:.033,2005:.034,2006:.025,2007:.041,2008:.001,2009:.027,2010:.015,2011:.03,2012:.017,2013:.015,2014:.008,2015:.007,2016:.021,2017:.021,2018:.019,2019:.023,2020:.012,2021:.07,2022:.065,2023:.032,2024:.029},Zp={GREAT_DEPRESSION:{name:"Great Depression",equity:[-.17,-.34,-.53,-.23,.67,.04,.39,.25,-.38,.28],inflation:[0,-.06,-.09,-.1,.01,.02,.03,.01,.03,-.02],color:"#e74c3c"},STAGFLATION_70S:{name:"Stagflation 70s",equity:[-.17,-.28,.38,.18,-.13,-.03,.04,.15,-.09,.2],inflation:[.09,.12,.07,.05,.07,.09,.13,.13,.09,.04],color:"#e67e22"},LOST_DECADE_2000S:{name:"Lost Decade 2000s",equity:[-.06,-.07,-.17,.25,.03,-.01,.16,.06,-.34,.19],inflation:[.03,.02,.02,.02,.03,.03,.03,.04,0,.03],color:"#9b59b6"},CRISIS_2008:{name:"2008 Crisis",equity:[-.34,.19,.11,.06,.07,.27,.08,-.02,.13,.25],inflation:[0,.03,.02,.03,.02,.02,.01,.01,.02,.02],color:"#3498db"},SYNTHETIC_WORST:{name:"Synthetic Worst",equity:[-.4,.1,.1,.1,-.35,.1,.1,.1,.1,-.3],inflation:[.08,.05,.05,.05,.08,.05,.05,.05,.05,.08],color:"#1abc9c"}},Ot={START_MONTH:4,START_DAY:6};function Gi(n,e,t,s=ze.HIGHER_RATE_LIMIT){if(n<=0)return 0;let r=e;if(n>ze.PA_TAPER_THRESHOLD){const f=(n-ze.PA_TAPER_THRESHOLD)*ze.PA_TAPER_RATE;r=Math.max(0,e-f)}const i=Math.max(0,n-r),a=Math.max(0,t-r),l=s-t;let c=0;const d=Math.min(i,a);if(c+=d*ze.BASIC_RATE,i>a){const f=Math.min(i-a,l);c+=f*ze.HIGHER_RATE}if(i>a+l){const f=i-a-l;c+=f*ze.ADDITIONAL_RATE}return c}function Rn(n,e,t,s=ze.HIGHER_RATE_LIMIT){return n-Gi(n,e,t,s)}function em(n,e,t,s=ze.HIGHER_RATE_LIMIT){if(n<=0)return 0;let r=n,i=n+1;for(;Rn(i,e,t,s)<n&&i<1e12;)i*=2;for(let a=0;a<60;a++){const l=(r+i)/2;Rn(l,e,t,s)<n?r=l:i=l}return(r+i)/2}function vo(n){const e=typeof n=="string"?new Date(n):n,t=e.getFullYear(),s=e.getMonth()+1,r=e.getDate();if(s<Ot.START_MONTH||s===Ot.START_MONTH&&r<Ot.START_DAY){const i=t-1;return`${String(i).slice(-2)}/${String(t).slice(-2)}`}return`${String(t).slice(-2)}/${String(t+1).slice(-2)}`}function ga(n){const e=parseInt(n.split("/")[0]),t=e<50?2e3+e:1900+e;return new Date(t,Ot.START_MONTH-1,Ot.START_DAY)}function tm(n){const e=parseInt(n.split("/")[1]),t=e<50?2e3+e:1900+e;return new Date(t,Ot.START_MONTH-1,Ot.START_DAY-1)}function nm(){const n=new Date;return`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`}function cl(n){const[e,t]=n.split("-").map(Number);return new Date(e,t-1,15)}function sm(n){const t=(typeof n=="string"?new Date(n):n).getMonth()+1;return t>=Ot.START_MONTH?12-(t-Ot.START_MONTH):Ot.START_MONTH-t}const rm=al.ASSUMED_CPI,im=al.OTHER_INCOME_CAP;function Cd(n,e,t=im){let s=n;for(const r of e)s*=1+Math.min(r,t);return s}function om(n){const{baseSalary:e,cumulativeInflation:t,yearlyInflation:s=[],other:r=0,statePension:i=0,statePensionYear:a=12,yearNumber:l=0,pa:c,brl:d,hrl:f,taxMode:m="inflates"}=n,y=m==="frozen"?c:c*t,b=m==="frozen"?d:d*t,T=m==="frozen"?f:f*t,R=e*t,x=Cd(r,s),S=l>=a?i*t:0,M=x+S,C=Math.max(0,b-M),O=Math.max(0,R-M),F=Math.min(C,O);return{pa:y,brl:b,hrl:T,targetGross:R,other:x,statePension:S,fixedIncome:M,annualSippDraw:F,monthlySippDraw:F/12,sippPlusfixedAtBRL:C+M===b}}function am(n,e,t=.025){const s=[],r=[];for(let i=0;i<=e;i++){i>0&&r.push(t);const a=Math.pow(1+t,i),l=om({baseSalary:n.baseSalary,cumulativeInflation:a,yearlyInflation:[...r],other:n.other,statePension:n.statePension,statePensionYear:n.statePensionYear,yearNumber:i,pa:n.pa,brl:n.brl,hrl:n.hrl,taxMode:n.taxMode}),c=l.annualSippDraw+l.other+l.statePension,d=Gi(c,l.pa,l.brl,l.hrl);s.push({year:i,brl:l.brl,other:l.other,statePension:l.statePension,sippDraw:l.annualSippDraw,totalTaxable:c,tax:d,netIncome:c-d})}return s}function tn(n,e,t,s,r){if(r){const i=Math.max(0,1-e/t);return n*s*i}return n*s}function lm(n,e,t){const s=tn(n.equityMin,e,n.duration,t,!0),r=tn(n.bondMin,e,n.duration,t,!0),i=tn(n.cashTarget,e,n.duration,t,!1);return{equity:s,bond:r,cash:i,totalGrowth:s+r,total:s+r+i}}function cm(n,e=al.ASSUMED_CPI){const t=[];for(let s=0;s<=n.duration;s++){const r=Math.pow(1+e,s),i=lm(n,s,r);t.push({year:s,cumulativeInflation:r,equityMin:i.equity,bondMin:i.bond,cashTarget:i.cash,totalMin:i.total})}return t}const um="modulepreload",dm=function(n,e){return new URL(n,e).href},su={},ru=function(e,t,s){let r=Promise.resolve();if(t&&t.length>0){const a=document.getElementsByTagName("link"),l=document.querySelector("meta[property=csp-nonce]"),c=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));r=Promise.allSettled(t.map(d=>{if(d=dm(d,s),d in su)return;su[d]=!0;const f=d.endsWith(".css"),m=f?'[rel="stylesheet"]':"";if(!!s)for(let T=a.length-1;T>=0;T--){const R=a[T];if(R.href===d&&(!f||R.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${d}"]${m}`))return;const b=document.createElement("link");if(b.rel=f?"stylesheet":um,f||(b.as="script"),b.crossOrigin="",b.href=d,c&&b.setAttribute("nonce",c),document.head.appendChild(b),f)return new Promise((T,R)=>{b.addEventListener("load",T),b.addEventListener("error",()=>R(new Error(`Unable to preload CSS for ${d}`)))})}))}function i(a){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=a,window.dispatchEvent(l),!l.defaultPrevented)throw a}return r.then(a=>{for(const l of a||[])l.status==="rejected"&&i(l.reason);return e().catch(i)})};function ul(n){let e=n;return function(){return e=Math.sin(e)*1e4,e-Math.floor(e)}}function br(n,e,t){const s=Math.max(t(),1e-12),r=t();let i=Math.sqrt(-2*Math.log(s))*Math.cos(2*Math.PI*r);return i=Math.max(-4,Math.min(4,i)),n+e*i}function dl(n){const e=JSON.stringify(n);let t=0;for(let s=0;s<e.length;s++){const r=e.charCodeAt(s);t=(t<<5)-t+r,t=t&t}return t.toString(16)}var iu={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kd=function(n){const e=[];let t=0;for(let s=0;s<n.length;s++){let r=n.charCodeAt(s);r<128?e[t++]=r:r<2048?(e[t++]=r>>6|192,e[t++]=r&63|128):(r&64512)===55296&&s+1<n.length&&(n.charCodeAt(s+1)&64512)===56320?(r=65536+((r&1023)<<10)+(n.charCodeAt(++s)&1023),e[t++]=r>>18|240,e[t++]=r>>12&63|128,e[t++]=r>>6&63|128,e[t++]=r&63|128):(e[t++]=r>>12|224,e[t++]=r>>6&63|128,e[t++]=r&63|128)}return e},hm=function(n){const e=[];let t=0,s=0;for(;t<n.length;){const r=n[t++];if(r<128)e[s++]=String.fromCharCode(r);else if(r>191&&r<224){const i=n[t++];e[s++]=String.fromCharCode((r&31)<<6|i&63)}else if(r>239&&r<365){const i=n[t++],a=n[t++],l=n[t++],c=((r&7)<<18|(i&63)<<12|(a&63)<<6|l&63)-65536;e[s++]=String.fromCharCode(55296+(c>>10)),e[s++]=String.fromCharCode(56320+(c&1023))}else{const i=n[t++],a=n[t++];e[s++]=String.fromCharCode((r&15)<<12|(i&63)<<6|a&63)}}return e.join("")},Md={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let r=0;r<n.length;r+=3){const i=n[r],a=r+1<n.length,l=a?n[r+1]:0,c=r+2<n.length,d=c?n[r+2]:0,f=i>>2,m=(i&3)<<4|l>>4;let y=(l&15)<<2|d>>6,b=d&63;c||(b=64,a||(y=64)),s.push(t[f],t[m],t[y],t[b])}return s.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(kd(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):hm(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let r=0;r<n.length;){const i=t[n.charAt(r++)],l=r<n.length?t[n.charAt(r)]:0;++r;const d=r<n.length?t[n.charAt(r)]:64;++r;const m=r<n.length?t[n.charAt(r)]:64;if(++r,i==null||l==null||d==null||m==null)throw new fm;const y=i<<2|l>>4;if(s.push(y),d!==64){const b=l<<4&240|d>>2;if(s.push(b),m!==64){const T=d<<6&192|m;s.push(T)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class fm extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const pm=function(n){const e=kd(n);return Md.encodeByteArray(e,!0)},Ki=function(n){return pm(n).replace(/\./g,"")},Dd=function(n){try{return Md.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function mm(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const gm=()=>mm().__FIREBASE_DEFAULTS__,ym=()=>{if(typeof process>"u"||typeof iu>"u")return;const n=iu.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},vm=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&Dd(n[1]);return e&&JSON.parse(e)},_o=()=>{try{return gm()||ym()||vm()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},Nd=n=>{var e,t;return(t=(e=_o())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[n]},_m=n=>{const e=Nd(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const s=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),s]:[e.substring(0,t),s]},Ld=()=>{var n;return(n=_o())===null||n===void 0?void 0:n.config},Od=n=>{var e;return(e=_o())===null||e===void 0?void 0:e[`_${n}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wm{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,s)=>{t?this.reject(t):this.resolve(s),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,s))}}}/**
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
 */function bm(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},s=e||"demo-project",r=n.iat||0,i=n.sub||n.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const a=Object.assign({iss:`https://securetoken.google.com/${s}`,aud:s,iat:r,exp:r+3600,auth_time:r,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}}},n);return[Ki(JSON.stringify(t)),Ki(JSON.stringify(a)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function et(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Em(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(et())}function Tm(){var n;const e=(n=_o())===null||n===void 0?void 0:n.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Im(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Sm(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function xm(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Am(){const n=et();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function Rm(){return!Tm()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Pm(){try{return typeof indexedDB=="object"}catch{return!1}}function Cm(){return new Promise((n,e)=>{try{let t=!0;const s="validate-browser-context-for-indexeddb-analytics-module",r=self.indexedDB.open(s);r.onsuccess=()=>{r.result.close(),t||self.indexedDB.deleteDatabase(s),n(!0)},r.onupgradeneeded=()=>{t=!1},r.onerror=()=>{var i;e(((i=r.error)===null||i===void 0?void 0:i.message)||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const km="FirebaseError";class un extends Error{constructor(e,t,s){super(t),this.code=e,this.customData=s,this.name=km,Object.setPrototypeOf(this,un.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Xr.prototype.create)}}class Xr{constructor(e,t,s){this.service=e,this.serviceName=t,this.errors=s}create(e,...t){const s=t[0]||{},r=`${this.service}/${e}`,i=this.errors[e],a=i?Mm(i,s):"Error",l=`${this.serviceName}: ${a} (${r}).`;return new un(r,l,s)}}function Mm(n,e){return n.replace(Dm,(t,s)=>{const r=e[s];return r!=null?String(r):`<${s}?>`})}const Dm=/\{\$([^}]+)}/g;function Nm(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function Qi(n,e){if(n===e)return!0;const t=Object.keys(n),s=Object.keys(e);for(const r of t){if(!s.includes(r))return!1;const i=n[r],a=e[r];if(ou(i)&&ou(a)){if(!Qi(i,a))return!1}else if(i!==a)return!1}for(const r of s)if(!t.includes(r))return!1;return!0}function ou(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zr(n){const e=[];for(const[t,s]of Object.entries(n))Array.isArray(s)?s.forEach(r=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(r))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(s));return e.length?"&"+e.join("&"):""}function Ir(n){const e={};return n.replace(/^\?/,"").split("&").forEach(s=>{if(s){const[r,i]=s.split("=");e[decodeURIComponent(r)]=decodeURIComponent(i)}}),e}function Sr(n){const e=n.indexOf("?");if(!e)return"";const t=n.indexOf("#",e);return n.substring(e,t>0?t:void 0)}function Lm(n,e){const t=new Om(n,e);return t.subscribe.bind(t)}class Om{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(s=>{this.error(s)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,s){let r;if(e===void 0&&t===void 0&&s===void 0)throw new Error("Missing Observer.");Vm(e,["next","error","complete"])?r=e:r={next:e,error:t,complete:s},r.next===void 0&&(r.next=ya),r.error===void 0&&(r.error=ya),r.complete===void 0&&(r.complete=ya);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?r.error(this.finalError):r.complete()}catch{}}),this.observers.push(r),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(s){typeof console<"u"&&console.error&&console.error(s)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Vm(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function ya(){}/**
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
 */function ke(n){return n&&n._delegate?n._delegate:n}class ns{constructor(e,t,s){this.name=e,this.instanceFactory=t,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kn="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bm{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const s=new wm;if(this.instancesDeferred.set(t,s),this.isInitialized(t)||this.shouldAutoInitialize())try{const r=this.getOrInitializeService({instanceIdentifier:t});r&&s.resolve(r)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const s=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(t=e==null?void 0:e.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(s)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:s})}catch(i){if(r)return null;throw i}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(zm(e))try{this.getOrInitializeService({instanceIdentifier:Kn})}catch{}for(const[t,s]of this.instancesDeferred.entries()){const r=this.normalizeInstanceIdentifier(t);try{const i=this.getOrInitializeService({instanceIdentifier:r});s.resolve(i)}catch{}}}}clearInstance(e=Kn){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Kn){return this.instances.has(e)}getOptions(e=Kn){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,s=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const r=this.getOrInitializeService({instanceIdentifier:s,options:t});for(const[i,a]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(i);s===l&&a.resolve(r)}return r}onInit(e,t){var s;const r=this.normalizeInstanceIdentifier(t),i=(s=this.onInitCallbacks.get(r))!==null&&s!==void 0?s:new Set;i.add(e),this.onInitCallbacks.set(r,i);const a=this.instances.get(r);return a&&e(a,r),()=>{i.delete(e)}}invokeOnInitCallbacks(e,t){const s=this.onInitCallbacks.get(t);if(s)for(const r of s)try{r(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let s=this.instances.get(e);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:Fm(e),options:t}),this.instances.set(e,s),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(s,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,s)}catch{}return s||null}normalizeInstanceIdentifier(e=Kn){return this.component?this.component.multipleInstances?e:Kn:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Fm(n){return n===Kn?void 0:n}function zm(n){return n.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Um{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new Bm(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ie;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(ie||(ie={}));const $m={debug:ie.DEBUG,verbose:ie.VERBOSE,info:ie.INFO,warn:ie.WARN,error:ie.ERROR,silent:ie.SILENT},qm=ie.INFO,Hm={[ie.DEBUG]:"log",[ie.VERBOSE]:"log",[ie.INFO]:"info",[ie.WARN]:"warn",[ie.ERROR]:"error"},jm=(n,e,...t)=>{if(e<n.logLevel)return;const s=new Date().toISOString(),r=Hm[e];if(r)console[r](`[${s}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class hl{constructor(e){this.name=e,this._logLevel=qm,this._logHandler=jm,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in ie))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?$m[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,ie.DEBUG,...e),this._logHandler(this,ie.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,ie.VERBOSE,...e),this._logHandler(this,ie.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,ie.INFO,...e),this._logHandler(this,ie.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,ie.WARN,...e),this._logHandler(this,ie.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,ie.ERROR,...e),this._logHandler(this,ie.ERROR,...e)}}const Wm=(n,e)=>e.some(t=>n instanceof t);let au,lu;function Ym(){return au||(au=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Gm(){return lu||(lu=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Vd=new WeakMap,La=new WeakMap,Bd=new WeakMap,va=new WeakMap,fl=new WeakMap;function Km(n){const e=new Promise((t,s)=>{const r=()=>{n.removeEventListener("success",i),n.removeEventListener("error",a)},i=()=>{t(Pn(n.result)),r()},a=()=>{s(n.error),r()};n.addEventListener("success",i),n.addEventListener("error",a)});return e.then(t=>{t instanceof IDBCursor&&Vd.set(t,n)}).catch(()=>{}),fl.set(e,n),e}function Qm(n){if(La.has(n))return;const e=new Promise((t,s)=>{const r=()=>{n.removeEventListener("complete",i),n.removeEventListener("error",a),n.removeEventListener("abort",a)},i=()=>{t(),r()},a=()=>{s(n.error||new DOMException("AbortError","AbortError")),r()};n.addEventListener("complete",i),n.addEventListener("error",a),n.addEventListener("abort",a)});La.set(n,e)}let Oa={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return La.get(n);if(e==="objectStoreNames")return n.objectStoreNames||Bd.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return Pn(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function Jm(n){Oa=n(Oa)}function Xm(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const s=n.call(_a(this),e,...t);return Bd.set(s,e.sort?e.sort():[e]),Pn(s)}:Gm().includes(n)?function(...e){return n.apply(_a(this),e),Pn(Vd.get(this))}:function(...e){return Pn(n.apply(_a(this),e))}}function Zm(n){return typeof n=="function"?Xm(n):(n instanceof IDBTransaction&&Qm(n),Wm(n,Ym())?new Proxy(n,Oa):n)}function Pn(n){if(n instanceof IDBRequest)return Km(n);if(va.has(n))return va.get(n);const e=Zm(n);return e!==n&&(va.set(n,e),fl.set(e,n)),e}const _a=n=>fl.get(n);function eg(n,e,{blocked:t,upgrade:s,blocking:r,terminated:i}={}){const a=indexedDB.open(n,e),l=Pn(a);return s&&a.addEventListener("upgradeneeded",c=>{s(Pn(a.result),c.oldVersion,c.newVersion,Pn(a.transaction),c)}),t&&a.addEventListener("blocked",c=>t(c.oldVersion,c.newVersion,c)),l.then(c=>{i&&c.addEventListener("close",()=>i()),r&&c.addEventListener("versionchange",d=>r(d.oldVersion,d.newVersion,d))}).catch(()=>{}),l}const tg=["get","getKey","getAll","getAllKeys","count"],ng=["put","add","delete","clear"],wa=new Map;function cu(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(wa.get(e))return wa.get(e);const t=e.replace(/FromIndex$/,""),s=e!==t,r=ng.includes(t);if(!(t in(s?IDBIndex:IDBObjectStore).prototype)||!(r||tg.includes(t)))return;const i=async function(a,...l){const c=this.transaction(a,r?"readwrite":"readonly");let d=c.store;return s&&(d=d.index(l.shift())),(await Promise.all([d[t](...l),r&&c.done]))[0]};return wa.set(e,i),i}Jm(n=>({...n,get:(e,t,s)=>cu(e,t)||n.get(e,t,s),has:(e,t)=>!!cu(e,t)||n.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sg{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(rg(t)){const s=t.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(t=>t).join(" ")}}function rg(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Va="@firebase/app",uu="0.10.13";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rn=new hl("@firebase/app"),ig="@firebase/app-compat",og="@firebase/analytics-compat",ag="@firebase/analytics",lg="@firebase/app-check-compat",cg="@firebase/app-check",ug="@firebase/auth",dg="@firebase/auth-compat",hg="@firebase/database",fg="@firebase/data-connect",pg="@firebase/database-compat",mg="@firebase/functions",gg="@firebase/functions-compat",yg="@firebase/installations",vg="@firebase/installations-compat",_g="@firebase/messaging",wg="@firebase/messaging-compat",bg="@firebase/performance",Eg="@firebase/performance-compat",Tg="@firebase/remote-config",Ig="@firebase/remote-config-compat",Sg="@firebase/storage",xg="@firebase/storage-compat",Ag="@firebase/firestore",Rg="@firebase/vertexai-preview",Pg="@firebase/firestore-compat",Cg="firebase",kg="10.14.1";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ba="[DEFAULT]",Mg={[Va]:"fire-core",[ig]:"fire-core-compat",[ag]:"fire-analytics",[og]:"fire-analytics-compat",[cg]:"fire-app-check",[lg]:"fire-app-check-compat",[ug]:"fire-auth",[dg]:"fire-auth-compat",[hg]:"fire-rtdb",[fg]:"fire-data-connect",[pg]:"fire-rtdb-compat",[mg]:"fire-fn",[gg]:"fire-fn-compat",[yg]:"fire-iid",[vg]:"fire-iid-compat",[_g]:"fire-fcm",[wg]:"fire-fcm-compat",[bg]:"fire-perf",[Eg]:"fire-perf-compat",[Tg]:"fire-rc",[Ig]:"fire-rc-compat",[Sg]:"fire-gcs",[xg]:"fire-gcs-compat",[Ag]:"fire-fst",[Pg]:"fire-fst-compat",[Rg]:"fire-vertex","fire-js":"fire-js",[Cg]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ji=new Map,Dg=new Map,Fa=new Map;function du(n,e){try{n.container.addComponent(e)}catch(t){rn.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function Us(n){const e=n.name;if(Fa.has(e))return rn.debug(`There were multiple attempts to register component ${e}.`),!1;Fa.set(e,n);for(const t of Ji.values())du(t,n);for(const t of Dg.values())du(t,n);return!0}function pl(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function At(n){return n.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ng={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Cn=new Xr("app","Firebase",Ng);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lg{constructor(e,t,s){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new ns("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Cn.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xs=kg;function Fd(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const s=Object.assign({name:Ba,automaticDataCollectionEnabled:!1},e),r=s.name;if(typeof r!="string"||!r)throw Cn.create("bad-app-name",{appName:String(r)});if(t||(t=Ld()),!t)throw Cn.create("no-options");const i=Ji.get(r);if(i){if(Qi(t,i.options)&&Qi(s,i.config))return i;throw Cn.create("duplicate-app",{appName:r})}const a=new Um(r);for(const c of Fa.values())a.addComponent(c);const l=new Lg(t,s,a);return Ji.set(r,l),l}function zd(n=Ba){const e=Ji.get(n);if(!e&&n===Ba&&Ld())return Fd();if(!e)throw Cn.create("no-app",{appName:n});return e}function kn(n,e,t){var s;let r=(s=Mg[n])!==null&&s!==void 0?s:n;t&&(r+=`-${t}`);const i=r.match(/\s|\//),a=e.match(/\s|\//);if(i||a){const l=[`Unable to register library "${r}" with version "${e}":`];i&&l.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&a&&l.push("and"),a&&l.push(`version name "${e}" contains illegal characters (whitespace or "/")`),rn.warn(l.join(" "));return}Us(new ns(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
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
 */const Og="firebase-heartbeat-database",Vg=1,Fr="firebase-heartbeat-store";let ba=null;function Ud(){return ba||(ba=eg(Og,Vg,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(Fr)}catch(t){console.warn(t)}}}}).catch(n=>{throw Cn.create("idb-open",{originalErrorMessage:n.message})})),ba}async function Bg(n){try{const t=(await Ud()).transaction(Fr),s=await t.objectStore(Fr).get($d(n));return await t.done,s}catch(e){if(e instanceof un)rn.warn(e.message);else{const t=Cn.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});rn.warn(t.message)}}}async function hu(n,e){try{const s=(await Ud()).transaction(Fr,"readwrite");await s.objectStore(Fr).put(e,$d(n)),await s.done}catch(t){if(t instanceof un)rn.warn(t.message);else{const s=Cn.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});rn.warn(s.message)}}}function $d(n){return`${n.name}!${n.options.appId}`}/**
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
 */const Fg=1024,zg=30*24*60*60*1e3;class Ug{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new qg(t),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){var e,t;try{const r=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=fu();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(a=>a.date===i)?void 0:(this._heartbeatsCache.heartbeats.push({date:i,agent:r}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(a=>{const l=new Date(a.date).valueOf();return Date.now()-l<=zg}),this._storage.overwrite(this._heartbeatsCache))}catch(s){rn.warn(s)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=fu(),{heartbeatsToSend:s,unsentEntries:r}=$g(this._heartbeatsCache.heartbeats),i=Ki(JSON.stringify({version:2,heartbeats:s}));return this._heartbeatsCache.lastSentHeartbeatDate=t,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(t){return rn.warn(t),""}}}function fu(){return new Date().toISOString().substring(0,10)}function $g(n,e=Fg){const t=[];let s=n.slice();for(const r of n){const i=t.find(a=>a.agent===r.agent);if(i){if(i.dates.push(r.date),pu(t)>e){i.dates.pop();break}}else if(t.push({agent:r.agent,dates:[r.date]}),pu(t)>e){t.pop();break}s=s.slice(1)}return{heartbeatsToSend:t,unsentEntries:s}}class qg{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Pm()?Cm().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await Bg(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const r=await this.read();return hu(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const r=await this.read();return hu(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function pu(n){return Ki(JSON.stringify({version:2,heartbeats:n})).length}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hg(n){Us(new ns("platform-logger",e=>new sg(e),"PRIVATE")),Us(new ns("heartbeat",e=>new Ug(e),"PRIVATE")),kn(Va,uu,n),kn(Va,uu,"esm2017"),kn("fire-js","")}Hg("");var jg="firebase",Wg="10.14.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */kn(jg,Wg,"app");function ml(n,e){var t={};for(var s in n)Object.prototype.hasOwnProperty.call(n,s)&&e.indexOf(s)<0&&(t[s]=n[s]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var r=0,s=Object.getOwnPropertySymbols(n);r<s.length;r++)e.indexOf(s[r])<0&&Object.prototype.propertyIsEnumerable.call(n,s[r])&&(t[s[r]]=n[s[r]]);return t}function qd(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Yg=qd,Hd=new Xr("auth","Firebase",qd());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xi=new hl("@firebase/auth");function Gg(n,...e){Xi.logLevel<=ie.WARN&&Xi.warn(`Auth (${Xs}): ${n}`,...e)}function Vi(n,...e){Xi.logLevel<=ie.ERROR&&Xi.error(`Auth (${Xs}): ${n}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Et(n,...e){throw yl(n,...e)}function Pt(n,...e){return yl(n,...e)}function gl(n,e,t){const s=Object.assign(Object.assign({},Yg()),{[e]:t});return new Xr("auth","Firebase",s).create(e,{appName:n.name})}function nn(n){return gl(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Kg(n,e,t){const s=t;if(!(e instanceof s))throw s.name!==e.constructor.name&&Et(n,"argument-error"),gl(n,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function yl(n,...e){if(typeof n!="string"){const t=e[0],s=[...e.slice(1)];return s[0]&&(s[0].appName=n.name),n._errorFactory.create(t,...s)}return Hd.create(n,...e)}function j(n,e,...t){if(!n)throw yl(e,...t)}function Xt(n){const e="INTERNAL ASSERTION FAILED: "+n;throw Vi(e),new Error(e)}function on(n,e){n||Xt(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function za(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.href)||""}function Qg(){return mu()==="http:"||mu()==="https:"}function mu(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jg(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Qg()||Sm()||"connection"in navigator)?navigator.onLine:!0}function Xg(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ei{constructor(e,t){this.shortDelay=e,this.longDelay=t,on(t>e,"Short delay should be less than long delay!"),this.isMobile=Em()||xm()}get(){return Jg()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vl(n,e){on(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jd{static initialize(e,t,s){this.fetchImpl=e,t&&(this.headersImpl=t),s&&(this.responseImpl=s)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Xt("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Xt("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Xt("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zg={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ey=new ei(3e4,6e4);function dn(n,e){return n.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:n.tenantId}):e}async function qt(n,e,t,s,r={}){return Wd(n,r,async()=>{let i={},a={};s&&(e==="GET"?a=s:i={body:JSON.stringify(s)});const l=Zr(Object.assign({key:n.config.apiKey},a)).slice(1),c=await n._getAdditionalHeaders();c["Content-Type"]="application/json",n.languageCode&&(c["X-Firebase-Locale"]=n.languageCode);const d=Object.assign({method:e,headers:c},i);return Im()||(d.referrerPolicy="no-referrer"),jd.fetch()(Yd(n,n.config.apiHost,t,l),d)})}async function Wd(n,e,t){n._canInitEmulator=!1;const s=Object.assign(Object.assign({},Zg),e);try{const r=new ny(n),i=await Promise.race([t(),r.promise]);r.clearNetworkTimeout();const a=await i.json();if("needConfirmation"in a)throw Mi(n,"account-exists-with-different-credential",a);if(i.ok&&!("errorMessage"in a))return a;{const l=i.ok?a.errorMessage:a.error.message,[c,d]=l.split(" : ");if(c==="FEDERATED_USER_ID_ALREADY_LINKED")throw Mi(n,"credential-already-in-use",a);if(c==="EMAIL_EXISTS")throw Mi(n,"email-already-in-use",a);if(c==="USER_DISABLED")throw Mi(n,"user-disabled",a);const f=s[c]||c.toLowerCase().replace(/[_\s]+/g,"-");if(d)throw gl(n,f,d);Et(n,f)}}catch(r){if(r instanceof un)throw r;Et(n,"network-request-failed",{message:String(r)})}}async function ti(n,e,t,s,r={}){const i=await qt(n,e,t,s,r);return"mfaPendingCredential"in i&&Et(n,"multi-factor-auth-required",{_serverResponse:i}),i}function Yd(n,e,t,s){const r=`${e}${t}?${s}`;return n.config.emulator?vl(n.config,r):`${n.config.apiScheme}://${r}`}function ty(n){switch(n){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class ny{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,s)=>{this.timer=setTimeout(()=>s(Pt(this.auth,"network-request-failed")),ey.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function Mi(n,e,t){const s={appName:n.name};t.email&&(s.email=t.email),t.phoneNumber&&(s.phoneNumber=t.phoneNumber);const r=Pt(n,e,s);return r.customData._tokenResponse=t,r}function gu(n){return n!==void 0&&n.enterprise!==void 0}class sy{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return ty(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}}async function ry(n,e){return qt(n,"GET","/v2/recaptchaConfig",dn(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function iy(n,e){return qt(n,"POST","/v1/accounts:delete",e)}async function Gd(n,e){return qt(n,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kr(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function oy(n,e=!1){const t=ke(n),s=await t.getIdToken(e),r=_l(s);j(r&&r.exp&&r.auth_time&&r.iat,t.auth,"internal-error");const i=typeof r.firebase=="object"?r.firebase:void 0,a=i==null?void 0:i.sign_in_provider;return{claims:r,token:s,authTime:kr(Ea(r.auth_time)),issuedAtTime:kr(Ea(r.iat)),expirationTime:kr(Ea(r.exp)),signInProvider:a||null,signInSecondFactor:(i==null?void 0:i.sign_in_second_factor)||null}}function Ea(n){return Number(n)*1e3}function _l(n){const[e,t,s]=n.split(".");if(e===void 0||t===void 0||s===void 0)return Vi("JWT malformed, contained fewer than 3 sections"),null;try{const r=Dd(t);return r?JSON.parse(r):(Vi("Failed to decode base64 JWT payload"),null)}catch(r){return Vi("Caught error parsing JWT payload as JSON",r==null?void 0:r.toString()),null}}function yu(n){const e=_l(n);return j(e,"internal-error"),j(typeof e.exp<"u","internal-error"),j(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function $s(n,e,t=!1){if(t)return e;try{return await e}catch(s){throw s instanceof un&&ay(s)&&n.auth.currentUser===n&&await n.auth.signOut(),s}}function ay({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ly{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const s=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),s}else{this.errorBackoff=3e4;const r=((t=this.user.stsTokenManager.expirationTime)!==null&&t!==void 0?t:0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */async function Zi(n){var e;const t=n.auth,s=await n.getIdToken(),r=await $s(n,Gd(t,{idToken:s}));j(r==null?void 0:r.users.length,t,"internal-error");const i=r.users[0];n._notifyReloadListener(i);const a=!((e=i.providerUserInfo)===null||e===void 0)&&e.length?Kd(i.providerUserInfo):[],l=uy(n.providerData,a),c=n.isAnonymous,d=!(n.email&&i.passwordHash)&&!(l!=null&&l.length),f=c?d:!1,m={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:l,metadata:new Ua(i.createdAt,i.lastLoginAt),isAnonymous:f};Object.assign(n,m)}async function cy(n){const e=ke(n);await Zi(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function uy(n,e){return[...n.filter(s=>!e.some(r=>r.providerId===s.providerId)),...e]}function Kd(n){return n.map(e=>{var{providerId:t}=e,s=ml(e,["providerId"]);return{providerId:t,uid:s.rawId||"",displayName:s.displayName||null,email:s.email||null,phoneNumber:s.phoneNumber||null,photoURL:s.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function dy(n,e){const t=await Wd(n,{},async()=>{const s=Zr({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:r,apiKey:i}=n.config,a=Yd(n,r,"/v1/token",`key=${i}`),l=await n._getAdditionalHeaders();return l["Content-Type"]="application/x-www-form-urlencoded",jd.fetch()(a,{method:"POST",headers:l,body:s})});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function hy(n,e){return qt(n,"POST","/v2/accounts:revokeToken",dn(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ns{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){j(e.idToken,"internal-error"),j(typeof e.idToken<"u","internal-error"),j(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):yu(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){j(e.length!==0,"internal-error");const t=yu(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(j(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:s,refreshToken:r,expiresIn:i}=await dy(e,t);this.updateTokensAndExpiration(s,r,Number(i))}updateTokensAndExpiration(e,t,s){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+s*1e3}static fromJSON(e,t){const{refreshToken:s,accessToken:r,expirationTime:i}=t,a=new Ns;return s&&(j(typeof s=="string","internal-error",{appName:e}),a.refreshToken=s),r&&(j(typeof r=="string","internal-error",{appName:e}),a.accessToken=r),i&&(j(typeof i=="number","internal-error",{appName:e}),a.expirationTime=i),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Ns,this.toJSON())}_performRefresh(){return Xt("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _n(n,e){j(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class Zt{constructor(e){var{uid:t,auth:s,stsTokenManager:r}=e,i=ml(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new ly(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=s,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new Ua(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const t=await $s(this,this.stsTokenManager.getToken(this.auth,e));return j(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return oy(this,e)}reload(){return cy(this)}_assign(e){this!==e&&(j(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new Zt(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){j(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let s=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),s=!0),t&&await Zi(this),await this.auth._persistUserIfCurrent(this),s&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(At(this.auth.app))return Promise.reject(nn(this.auth));const e=await this.getIdToken();return await $s(this,iy(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var s,r,i,a,l,c,d,f;const m=(s=t.displayName)!==null&&s!==void 0?s:void 0,y=(r=t.email)!==null&&r!==void 0?r:void 0,b=(i=t.phoneNumber)!==null&&i!==void 0?i:void 0,T=(a=t.photoURL)!==null&&a!==void 0?a:void 0,R=(l=t.tenantId)!==null&&l!==void 0?l:void 0,x=(c=t._redirectEventId)!==null&&c!==void 0?c:void 0,S=(d=t.createdAt)!==null&&d!==void 0?d:void 0,M=(f=t.lastLoginAt)!==null&&f!==void 0?f:void 0,{uid:D,emailVerified:C,isAnonymous:O,providerData:F,stsTokenManager:w}=t;j(D&&w,e,"internal-error");const v=Ns.fromJSON(this.name,w);j(typeof D=="string",e,"internal-error"),_n(m,e.name),_n(y,e.name),j(typeof C=="boolean",e,"internal-error"),j(typeof O=="boolean",e,"internal-error"),_n(b,e.name),_n(T,e.name),_n(R,e.name),_n(x,e.name),_n(S,e.name),_n(M,e.name);const _=new Zt({uid:D,auth:e,email:y,emailVerified:C,displayName:m,isAnonymous:O,photoURL:T,phoneNumber:b,tenantId:R,stsTokenManager:v,createdAt:S,lastLoginAt:M});return F&&Array.isArray(F)&&(_.providerData=F.map(E=>Object.assign({},E))),x&&(_._redirectEventId=x),_}static async _fromIdTokenResponse(e,t,s=!1){const r=new Ns;r.updateFromServerResponse(t);const i=new Zt({uid:t.localId,auth:e,stsTokenManager:r,isAnonymous:s});return await Zi(i),i}static async _fromGetAccountInfoResponse(e,t,s){const r=t.users[0];j(r.localId!==void 0,"internal-error");const i=r.providerUserInfo!==void 0?Kd(r.providerUserInfo):[],a=!(r.email&&r.passwordHash)&&!(i!=null&&i.length),l=new Ns;l.updateFromIdToken(s);const c=new Zt({uid:r.localId,auth:e,stsTokenManager:l,isAnonymous:a}),d={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:i,metadata:new Ua(r.createdAt,r.lastLoginAt),isAnonymous:!(r.email&&r.passwordHash)&&!(i!=null&&i.length)};return Object.assign(c,d),c}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vu=new Map;function en(n){on(n instanceof Function,"Expected a class definition");let e=vu.get(n);return e?(on(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,vu.set(n,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qd{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}Qd.type="NONE";const _u=Qd;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bi(n,e,t){return`firebase:${n}:${e}:${t}`}class Ls{constructor(e,t,s){this.persistence=e,this.auth=t,this.userKey=s;const{config:r,name:i}=this.auth;this.fullUserKey=Bi(this.userKey,r.apiKey,i),this.fullPersistenceKey=Bi("persistence",r.apiKey,i),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?Zt._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,s="authUser"){if(!t.length)return new Ls(en(_u),e,s);const r=(await Promise.all(t.map(async d=>{if(await d._isAvailable())return d}))).filter(d=>d);let i=r[0]||en(_u);const a=Bi(s,e.config.apiKey,e.name);let l=null;for(const d of t)try{const f=await d._get(a);if(f){const m=Zt._fromJSON(e,f);d!==i&&(l=m),i=d;break}}catch{}const c=r.filter(d=>d._shouldAllowMigration);return!i._shouldAllowMigration||!c.length?new Ls(i,e,s):(i=c[0],l&&await i._set(a,l.toJSON()),await Promise.all(t.map(async d=>{if(d!==i)try{await d._remove(a)}catch{}})),new Ls(i,e,s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wu(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(eh(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Jd(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(nh(e))return"Blackberry";if(sh(e))return"Webos";if(Xd(e))return"Safari";if((e.includes("chrome/")||Zd(e))&&!e.includes("edge/"))return"Chrome";if(th(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,s=n.match(t);if((s==null?void 0:s.length)===2)return s[1]}return"Other"}function Jd(n=et()){return/firefox\//i.test(n)}function Xd(n=et()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Zd(n=et()){return/crios\//i.test(n)}function eh(n=et()){return/iemobile/i.test(n)}function th(n=et()){return/android/i.test(n)}function nh(n=et()){return/blackberry/i.test(n)}function sh(n=et()){return/webos/i.test(n)}function wl(n=et()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function fy(n=et()){var e;return wl(n)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function py(){return Am()&&document.documentMode===10}function rh(n=et()){return wl(n)||th(n)||sh(n)||nh(n)||/windows phone/i.test(n)||eh(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ih(n,e=[]){let t;switch(n){case"Browser":t=wu(et());break;case"Worker":t=`${wu(et())}-${n}`;break;default:t=n}const s=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${Xs}/${s}`}/**
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
 */class my{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const s=i=>new Promise((a,l)=>{try{const c=e(i);a(c)}catch(c){l(c)}});s.onAbort=t,this.queue.push(s);const r=this.queue.length-1;return()=>{this.queue[r]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const s of this.queue)await s(e),s.onAbort&&t.push(s.onAbort)}catch(s){t.reverse();for(const r of t)try{r()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:s==null?void 0:s.message})}}}/**
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
 */async function gy(n,e={}){return qt(n,"GET","/v2/passwordPolicy",dn(n,e))}/**
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
 */const yy=6;class vy{constructor(e){var t,s,r,i;const a=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(t=a.minPasswordLength)!==null&&t!==void 0?t:yy,a.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=a.maxPasswordLength),a.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=a.containsLowercaseCharacter),a.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=a.containsUppercaseCharacter),a.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=a.containsNumericCharacter),a.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=a.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(r=(s=e.allowedNonAlphanumericCharacters)===null||s===void 0?void 0:s.join(""))!==null&&r!==void 0?r:"",this.forceUpgradeOnSignin=(i=e.forceUpgradeOnSignin)!==null&&i!==void 0?i:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,s,r,i,a,l;const c={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,c),this.validatePasswordCharacterOptions(e,c),c.isValid&&(c.isValid=(t=c.meetsMinPasswordLength)!==null&&t!==void 0?t:!0),c.isValid&&(c.isValid=(s=c.meetsMaxPasswordLength)!==null&&s!==void 0?s:!0),c.isValid&&(c.isValid=(r=c.containsLowercaseLetter)!==null&&r!==void 0?r:!0),c.isValid&&(c.isValid=(i=c.containsUppercaseLetter)!==null&&i!==void 0?i:!0),c.isValid&&(c.isValid=(a=c.containsNumericCharacter)!==null&&a!==void 0?a:!0),c.isValid&&(c.isValid=(l=c.containsNonAlphanumericCharacter)!==null&&l!==void 0?l:!0),c}validatePasswordLengthOptions(e,t){const s=this.customStrengthOptions.minPasswordLength,r=this.customStrengthOptions.maxPasswordLength;s&&(t.meetsMinPasswordLength=e.length>=s),r&&(t.meetsMaxPasswordLength=e.length<=r)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let s;for(let r=0;r<e.length;r++)s=e.charAt(r),this.updatePasswordCharacterOptionsStatuses(t,s>="a"&&s<="z",s>="A"&&s<="Z",s>="0"&&s<="9",this.allowedNonAlphanumericCharacters.includes(s))}updatePasswordCharacterOptionsStatuses(e,t,s,r,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=s)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=r)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _y{constructor(e,t,s,r){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=s,this.config=r,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new bu(this),this.idTokenSubscription=new bu(this),this.beforeStateQueue=new my(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Hd,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=r.sdkClientVersion}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=en(t)),this._initializationPromise=this.queue(async()=>{var s,r;if(!this._deleted&&(this.persistenceManager=await Ls.create(this,e),!this._deleted)){if(!((s=this._popupRedirectResolver)===null||s===void 0)&&s._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((r=this.currentUser)===null||r===void 0?void 0:r.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await Gd(this,{idToken:e}),s=await Zt._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(s)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(At(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(l=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(l,l))}):this.directlySetCurrentUser(null)}const s=await this.assertedPersistence.getCurrentUser();let r=s,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,l=r==null?void 0:r._redirectEventId,c=await this.tryRedirectSignIn(e);(!a||a===l)&&(c!=null&&c.user)&&(r=c.user,i=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(r)}catch(a){r=s,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return j(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Zi(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=Xg()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(At(this.app))return Promise.reject(nn(this));const t=e?ke(e):null;return t&&j(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&j(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return At(this.app)?Promise.reject(nn(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return At(this.app)?Promise.reject(nn(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(en(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await gy(this),t=new vy(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new Xr("auth","Firebase",e())}onAuthStateChanged(e,t,s){return this.registerStateListener(this.authStateSubscription,e,t,s)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,s){return this.registerStateListener(this.idTokenSubscription,e,t,s)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const s=this.onAuthStateChanged(()=>{s(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),s={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(s.tenantId=this.tenantId),await hy(this,s)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){const s=await this.getOrInitRedirectPersistenceManager(t);return e===null?s.removeCurrentUser():s.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&en(e)||this._popupRedirectResolver;j(t,this,"argument-error"),this.redirectPersistenceManager=await Ls.create(this,[en(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,s;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((s=this.redirectUser)===null||s===void 0?void 0:s._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const s=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==s&&(this.lastNotifiedUid=s,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,s,r){if(this._deleted)return()=>{};const i=typeof t=="function"?t:t.next.bind(t);let a=!1;const l=this._isInitialized?Promise.resolve():this._initializationPromise;if(j(l,this,"internal-error"),l.then(()=>{a||i(this.currentUser)}),typeof t=="function"){const c=e.addObserver(t,s,r);return()=>{a=!0,c()}}else{const c=e.addObserver(t);return()=>{a=!0,c()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return j(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=ih(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const s=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());s&&(t["X-Firebase-Client"]=s);const r=await this._getAppCheckToken();return r&&(t["X-Firebase-AppCheck"]=r),t}async _getAppCheckToken(){var e;const t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t!=null&&t.error&&Gg(`Error while retrieving App Check token: ${t.error}`),t==null?void 0:t.token}}function hn(n){return ke(n)}class bu{constructor(e){this.auth=e,this.observer=null,this.addObserver=Lm(t=>this.observer=t)}get next(){return j(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let wo={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function wy(n){wo=n}function oh(n){return wo.loadJS(n)}function by(){return wo.recaptchaEnterpriseScript}function Ey(){return wo.gapiScript}function Ty(n){return`__${n}${Math.floor(Math.random()*1e6)}`}const Iy="recaptcha-enterprise",Sy="NO_RECAPTCHA";class xy{constructor(e){this.type=Iy,this.auth=hn(e)}async verify(e="verify",t=!1){async function s(i){if(!t){if(i.tenantId==null&&i._agentRecaptchaConfig!=null)return i._agentRecaptchaConfig.siteKey;if(i.tenantId!=null&&i._tenantRecaptchaConfigs[i.tenantId]!==void 0)return i._tenantRecaptchaConfigs[i.tenantId].siteKey}return new Promise(async(a,l)=>{ry(i,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(c=>{if(c.recaptchaKey===void 0)l(new Error("recaptcha Enterprise site key undefined"));else{const d=new sy(c);return i.tenantId==null?i._agentRecaptchaConfig=d:i._tenantRecaptchaConfigs[i.tenantId]=d,a(d.siteKey)}}).catch(c=>{l(c)})})}function r(i,a,l){const c=window.grecaptcha;gu(c)?c.enterprise.ready(()=>{c.enterprise.execute(i,{action:e}).then(d=>{a(d)}).catch(()=>{a(Sy)})}):l(Error("No reCAPTCHA enterprise script loaded."))}return new Promise((i,a)=>{s(this.auth).then(l=>{if(!t&&gu(window.grecaptcha))r(l,i,a);else{if(typeof window>"u"){a(new Error("RecaptchaVerifier is only supported in browser"));return}let c=by();c.length!==0&&(c+=l),oh(c).then(()=>{r(l,i,a)}).catch(d=>{a(d)})}}).catch(l=>{a(l)})})}}async function Eu(n,e,t,s=!1){const r=new xy(n);let i;try{i=await r.verify(t)}catch{i=await r.verify(t,!0)}const a=Object.assign({},e);return s?Object.assign(a,{captchaResp:i}):Object.assign(a,{captchaResponse:i}),Object.assign(a,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(a,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),a}async function eo(n,e,t,s){var r;if(!((r=n._getRecaptchaConfig())===null||r===void 0)&&r.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const i=await Eu(n,e,t,t==="getOobCode");return s(n,i)}else return s(n,e).catch(async i=>{if(i.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const a=await Eu(n,e,t,t==="getOobCode");return s(n,a)}else return Promise.reject(i)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ay(n,e){const t=pl(n,"auth");if(t.isInitialized()){const r=t.getImmediate(),i=t.getOptions();if(Qi(i,e??{}))return r;Et(r,"already-initialized")}return t.initialize({options:e})}function Ry(n,e){const t=(e==null?void 0:e.persistence)||[],s=(Array.isArray(t)?t:[t]).map(en);e!=null&&e.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(s,e==null?void 0:e.popupRedirectResolver)}function Py(n,e,t){const s=hn(n);j(s._canInitEmulator,s,"emulator-config-failed"),j(/^https?:\/\//.test(e),s,"invalid-emulator-scheme");const r=!1,i=ah(e),{host:a,port:l}=Cy(e),c=l===null?"":`:${l}`;s.config.emulator={url:`${i}//${a}${c}/`},s.settings.appVerificationDisabledForTesting=!0,s.emulatorConfig=Object.freeze({host:a,port:l,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:r})}),ky()}function ah(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function Cy(n){const e=ah(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const s=t[2].split("@").pop()||"",r=/^(\[[^\]]+\])(:|$)/.exec(s);if(r){const i=r[1];return{host:i,port:Tu(s.substr(i.length+1))}}else{const[i,a]=s.split(":");return{host:i,port:Tu(a)}}}function Tu(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function ky(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bl{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Xt("not implemented")}_getIdTokenResponse(e){return Xt("not implemented")}_linkToIdToken(e,t){return Xt("not implemented")}_getReauthenticationResolver(e){return Xt("not implemented")}}async function My(n,e){return qt(n,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Dy(n,e){return ti(n,"POST","/v1/accounts:signInWithPassword",dn(n,e))}async function Ny(n,e){return qt(n,"POST","/v1/accounts:sendOobCode",dn(n,e))}async function Ly(n,e){return Ny(n,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Oy(n,e){return ti(n,"POST","/v1/accounts:signInWithEmailLink",dn(n,e))}async function Vy(n,e){return ti(n,"POST","/v1/accounts:signInWithEmailLink",dn(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zr extends bl{constructor(e,t,s,r=null){super("password",s),this._email=e,this._password=t,this._tenantId=r}static _fromEmailAndPassword(e,t){return new zr(e,t,"password")}static _fromEmailAndCode(e,t,s=null){return new zr(e,t,"emailLink",s)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;if(t!=null&&t.email&&(t!=null&&t.password)){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return eo(e,t,"signInWithPassword",Dy);case"emailLink":return Oy(e,{email:this._email,oobCode:this._password});default:Et(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":const s={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return eo(e,s,"signUpPassword",My);case"emailLink":return Vy(e,{idToken:t,email:this._email,oobCode:this._password});default:Et(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Os(n,e){return ti(n,"POST","/v1/accounts:signInWithIdp",dn(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const By="http://localhost";class ss extends bl{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new ss(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):Et("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:s,signInMethod:r}=t,i=ml(t,["providerId","signInMethod"]);if(!s||!r)return null;const a=new ss(s,r);return a.idToken=i.idToken||void 0,a.accessToken=i.accessToken||void 0,a.secret=i.secret,a.nonce=i.nonce,a.pendingToken=i.pendingToken||null,a}_getIdTokenResponse(e){const t=this.buildRequest();return Os(e,t)}_linkToIdToken(e,t){const s=this.buildRequest();return s.idToken=t,Os(e,s)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,Os(e,t)}buildRequest(){const e={requestUri:By,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=Zr(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fy(n){switch(n){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function zy(n){const e=Ir(Sr(n)).link,t=e?Ir(Sr(e)).deep_link_id:null,s=Ir(Sr(n)).deep_link_id;return(s?Ir(Sr(s)).link:null)||s||t||e||n}class El{constructor(e){var t,s,r,i,a,l;const c=Ir(Sr(e)),d=(t=c.apiKey)!==null&&t!==void 0?t:null,f=(s=c.oobCode)!==null&&s!==void 0?s:null,m=Fy((r=c.mode)!==null&&r!==void 0?r:null);j(d&&f&&m,"argument-error"),this.apiKey=d,this.operation=m,this.code=f,this.continueUrl=(i=c.continueUrl)!==null&&i!==void 0?i:null,this.languageCode=(a=c.languageCode)!==null&&a!==void 0?a:null,this.tenantId=(l=c.tenantId)!==null&&l!==void 0?l:null}static parseLink(e){const t=zy(e);try{return new El(t)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zs{constructor(){this.providerId=Zs.PROVIDER_ID}static credential(e,t){return zr._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const s=El.parseLink(t);return j(s,"argument-error"),zr._fromEmailAndCode(e,s.code,s.tenantId)}}Zs.PROVIDER_ID="password";Zs.EMAIL_PASSWORD_SIGN_IN_METHOD="password";Zs.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tl{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ni extends Tl{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class En extends ni{constructor(){super("facebook.com")}static credential(e){return ss._fromParams({providerId:En.PROVIDER_ID,signInMethod:En.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return En.credentialFromTaggedObject(e)}static credentialFromError(e){return En.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return En.credential(e.oauthAccessToken)}catch{return null}}}En.FACEBOOK_SIGN_IN_METHOD="facebook.com";En.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jt extends ni{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return ss._fromParams({providerId:Jt.PROVIDER_ID,signInMethod:Jt.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Jt.credentialFromTaggedObject(e)}static credentialFromError(e){return Jt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:s}=e;if(!t&&!s)return null;try{return Jt.credential(t,s)}catch{return null}}}Jt.GOOGLE_SIGN_IN_METHOD="google.com";Jt.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tn extends ni{constructor(){super("github.com")}static credential(e){return ss._fromParams({providerId:Tn.PROVIDER_ID,signInMethod:Tn.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Tn.credentialFromTaggedObject(e)}static credentialFromError(e){return Tn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Tn.credential(e.oauthAccessToken)}catch{return null}}}Tn.GITHUB_SIGN_IN_METHOD="github.com";Tn.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class In extends ni{constructor(){super("twitter.com")}static credential(e,t){return ss._fromParams({providerId:In.PROVIDER_ID,signInMethod:In.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return In.credentialFromTaggedObject(e)}static credentialFromError(e){return In.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:s}=e;if(!t||!s)return null;try{return In.credential(t,s)}catch{return null}}}In.TWITTER_SIGN_IN_METHOD="twitter.com";In.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Uy(n,e){return ti(n,"POST","/v1/accounts:signUp",dn(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rs{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,s,r=!1){const i=await Zt._fromIdTokenResponse(e,s,r),a=Iu(s);return new rs({user:i,providerId:a,_tokenResponse:s,operationType:t})}static async _forOperation(e,t,s){await e._updateTokensIfNecessary(s,!0);const r=Iu(s);return new rs({user:e,providerId:r,_tokenResponse:s,operationType:t})}}function Iu(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class to extends un{constructor(e,t,s,r){var i;super(t.code,t.message),this.operationType=s,this.user=r,Object.setPrototypeOf(this,to.prototype),this.customData={appName:e.name,tenantId:(i=e.tenantId)!==null&&i!==void 0?i:void 0,_serverResponse:t.customData._serverResponse,operationType:s}}static _fromErrorAndOperation(e,t,s,r){return new to(e,t,s,r)}}function lh(n,e,t,s){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(i=>{throw i.code==="auth/multi-factor-auth-required"?to._fromErrorAndOperation(n,i,e,s):i})}async function $y(n,e,t=!1){const s=await $s(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return rs._forOperation(n,"link",s)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function qy(n,e,t=!1){const{auth:s}=n;if(At(s.app))return Promise.reject(nn(s));const r="reauthenticate";try{const i=await $s(n,lh(s,r,e,n),t);j(i.idToken,s,"internal-error");const a=_l(i.idToken);j(a,s,"internal-error");const{sub:l}=a;return j(n.uid===l,s,"user-mismatch"),rs._forOperation(n,r,i)}catch(i){throw(i==null?void 0:i.code)==="auth/user-not-found"&&Et(s,"user-mismatch"),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ch(n,e,t=!1){if(At(n.app))return Promise.reject(nn(n));const s="signIn",r=await lh(n,s,e),i=await rs._fromIdTokenResponse(n,s,r);return t||await n._updateCurrentUser(i.user),i}async function Hy(n,e){return ch(hn(n),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function uh(n){const e=hn(n);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function jy(n,e,t){const s=hn(n);await eo(s,{requestType:"PASSWORD_RESET",email:e,clientType:"CLIENT_TYPE_WEB"},"getOobCode",Ly)}async function Wy(n,e,t){if(At(n.app))return Promise.reject(nn(n));const s=hn(n),a=await eo(s,{returnSecureToken:!0,email:e,password:t,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",Uy).catch(c=>{throw c.code==="auth/password-does-not-meet-requirements"&&uh(n),c}),l=await rs._fromIdTokenResponse(s,"signIn",a);return await s._updateCurrentUser(l.user),l}function Yy(n,e,t){return At(n.app)?Promise.reject(nn(n)):Hy(ke(n),Zs.credential(e,t)).catch(async s=>{throw s.code==="auth/password-does-not-meet-requirements"&&uh(n),s})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Gy(n,e){return qt(n,"POST","/v1/accounts:update",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ky(n,{displayName:e,photoURL:t}){if(e===void 0&&t===void 0)return;const s=ke(n),i={idToken:await s.getIdToken(),displayName:e,photoUrl:t,returnSecureToken:!0},a=await $s(s,Gy(s.auth,i));s.displayName=a.displayName||null,s.photoURL=a.photoUrl||null;const l=s.providerData.find(({providerId:c})=>c==="password");l&&(l.displayName=s.displayName,l.photoURL=s.photoURL),await s._updateTokensIfNecessary(a)}function Qy(n,e,t,s){return ke(n).onIdTokenChanged(e,t,s)}function Jy(n,e,t){return ke(n).beforeAuthStateChanged(e,t)}function Xy(n,e,t,s){return ke(n).onAuthStateChanged(e,t,s)}function Zy(n){return ke(n).signOut()}const no="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dh{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(no,"1"),this.storage.removeItem(no),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ev=1e3,tv=10;class hh extends dh{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=rh(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const s=this.storage.getItem(t),r=this.localCache[t];s!==r&&e(t,r,s)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((a,l,c)=>{this.notifyListeners(a,c)});return}const s=e.key;t?this.detachListener():this.stopPolling();const r=()=>{const a=this.storage.getItem(s);!t&&this.localCache[s]===a||this.notifyListeners(s,a)},i=this.storage.getItem(s);py()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(r,tv):r()}notifyListeners(e,t){this.localCache[e]=t;const s=this.listeners[e];if(s)for(const r of Array.from(s))r(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,s)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:s}),!0)})},ev)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}hh.type="LOCAL";const nv=hh;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fh extends dh{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}fh.type="SESSION";const ph=fh;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sv(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bo{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(r=>r.isListeningto(e));if(t)return t;const s=new bo(e);return this.receivers.push(s),s}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:s,eventType:r,data:i}=t.data,a=this.handlersMap[r];if(!(a!=null&&a.size))return;t.ports[0].postMessage({status:"ack",eventId:s,eventType:r});const l=Array.from(a).map(async d=>d(t.origin,i)),c=await sv(l);t.ports[0].postMessage({status:"done",eventId:s,eventType:r,response:c})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}bo.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Il(n="",e=10){let t="";for(let s=0;s<e;s++)t+=Math.floor(Math.random()*10);return n+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rv{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,s=50){const r=typeof MessageChannel<"u"?new MessageChannel:null;if(!r)throw new Error("connection_unavailable");let i,a;return new Promise((l,c)=>{const d=Il("",20);r.port1.start();const f=setTimeout(()=>{c(new Error("unsupported_event"))},s);a={messageChannel:r,onMessage(m){const y=m;if(y.data.eventId===d)switch(y.data.status){case"ack":clearTimeout(f),i=setTimeout(()=>{c(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),l(y.data.response);break;default:clearTimeout(f),clearTimeout(i),c(new Error("invalid_response"));break}}},this.handlers.add(a),r.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:d,data:t},[r.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vt(){return window}function iv(n){Vt().location.href=n}/**
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
 */function mh(){return typeof Vt().WorkerGlobalScope<"u"&&typeof Vt().importScripts=="function"}async function ov(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function av(){var n;return((n=navigator==null?void 0:navigator.serviceWorker)===null||n===void 0?void 0:n.controller)||null}function lv(){return mh()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gh="firebaseLocalStorageDb",cv=1,so="firebaseLocalStorage",yh="fbase_key";class si{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function Eo(n,e){return n.transaction([so],e?"readwrite":"readonly").objectStore(so)}function uv(){const n=indexedDB.deleteDatabase(gh);return new si(n).toPromise()}function $a(){const n=indexedDB.open(gh,cv);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const s=n.result;try{s.createObjectStore(so,{keyPath:yh})}catch(r){t(r)}}),n.addEventListener("success",async()=>{const s=n.result;s.objectStoreNames.contains(so)?e(s):(s.close(),await uv(),e(await $a()))})})}async function Su(n,e,t){const s=Eo(n,!0).put({[yh]:e,value:t});return new si(s).toPromise()}async function dv(n,e){const t=Eo(n,!1).get(e),s=await new si(t).toPromise();return s===void 0?null:s.value}function xu(n,e){const t=Eo(n,!0).delete(e);return new si(t).toPromise()}const hv=800,fv=3;class vh{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await $a(),this.db)}async _withRetries(e){let t=0;for(;;)try{const s=await this._openDb();return await e(s)}catch(s){if(t++>fv)throw s;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return mh()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=bo._getInstance(lv()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await ov(),!this.activeServiceWorker)return;this.sender=new rv(this.activeServiceWorker);const s=await this.sender._send("ping",{},800);s&&!((e=s[0])===null||e===void 0)&&e.fulfilled&&!((t=s[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||av()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await $a();return await Su(e,no,"1"),await xu(e,no),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(s=>Su(s,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(s=>dv(s,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>xu(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(r=>{const i=Eo(r,!1).getAll();return new si(i).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],s=new Set;if(e.length!==0)for(const{fbase_key:r,value:i}of e)s.add(r),JSON.stringify(this.localCache[r])!==JSON.stringify(i)&&(this.notifyListeners(r,i),t.push(r));for(const r of Object.keys(this.localCache))this.localCache[r]&&!s.has(r)&&(this.notifyListeners(r,null),t.push(r));return t}notifyListeners(e,t){this.localCache[e]=t;const s=this.listeners[e];if(s)for(const r of Array.from(s))r(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),hv)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}vh.type="LOCAL";const pv=vh;new ei(3e4,6e4);/**
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
 */function _h(n,e){return e?en(e):(j(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sl extends bl{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Os(e,this._buildIdpRequest())}_linkToIdToken(e,t){return Os(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return Os(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function mv(n){return ch(n.auth,new Sl(n),n.bypassAuthState)}function gv(n){const{auth:e,user:t}=n;return j(t,e,"internal-error"),qy(t,new Sl(n),n.bypassAuthState)}async function yv(n){const{auth:e,user:t}=n;return j(t,e,"internal-error"),$y(t,new Sl(n),n.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wh{constructor(e,t,s,r,i=!1){this.auth=e,this.resolver=s,this.user=r,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(s){this.reject(s)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:s,postBody:r,tenantId:i,error:a,type:l}=e;if(a){this.reject(a);return}const c={auth:this.auth,requestUri:t,sessionId:s,tenantId:i||void 0,postBody:r||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(l)(c))}catch(d){this.reject(d)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return mv;case"linkViaPopup":case"linkViaRedirect":return yv;case"reauthViaPopup":case"reauthViaRedirect":return gv;default:Et(this.auth,"internal-error")}}resolve(e){on(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){on(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vv=new ei(2e3,1e4);async function _v(n,e,t){if(At(n.app))return Promise.reject(Pt(n,"operation-not-supported-in-this-environment"));const s=hn(n);Kg(n,e,Tl);const r=_h(s,t);return new Jn(s,"signInViaPopup",e,r).executeNotNull()}class Jn extends wh{constructor(e,t,s,r,i){super(e,t,r,i),this.provider=s,this.authWindow=null,this.pollId=null,Jn.currentPopupAction&&Jn.currentPopupAction.cancel(),Jn.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return j(e,this.auth,"internal-error"),e}async onExecution(){on(this.filter.length===1,"Popup operations only handle one event");const e=Il();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(Pt(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(Pt(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Jn.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,s;if(!((s=(t=this.authWindow)===null||t===void 0?void 0:t.window)===null||s===void 0)&&s.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Pt(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,vv.get())};e()}}Jn.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wv="pendingRedirect",Fi=new Map;class bv extends wh{constructor(e,t,s=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,s),this.eventId=null}async execute(){let e=Fi.get(this.auth._key());if(!e){try{const s=await Ev(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(s)}catch(t){e=()=>Promise.reject(t)}Fi.set(this.auth._key(),e)}return this.bypassAuthState||Fi.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Ev(n,e){const t=Sv(e),s=Iv(n);if(!await s._isAvailable())return!1;const r=await s._get(t)==="true";return await s._remove(t),r}function Tv(n,e){Fi.set(n._key(),e)}function Iv(n){return en(n._redirectPersistence)}function Sv(n){return Bi(wv,n.config.apiKey,n.name)}async function xv(n,e,t=!1){if(At(n.app))return Promise.reject(nn(n));const s=hn(n),r=_h(s,e),a=await new bv(s,r,t).execute();return a&&!t&&(delete a.user._redirectEventId,await s._persistUserIfCurrent(a.user),await s._setRedirectUser(null,e)),a}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Av=10*60*1e3;class Rv{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(s=>{this.isEventForConsumer(e,s)&&(t=!0,this.sendToConsumer(e,s),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Pv(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var s;if(e.error&&!bh(e)){const r=((s=e.error.code)===null||s===void 0?void 0:s.split("auth/")[1])||"internal-error";t.onError(Pt(this.auth,r))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const s=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&s}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Av&&this.cachedEventUids.clear(),this.cachedEventUids.has(Au(e))}saveEventToCache(e){this.cachedEventUids.add(Au(e)),this.lastProcessedEventTime=Date.now()}}function Au(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function bh({type:n,error:e}){return n==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Pv(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return bh(n);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Cv(n,e={}){return qt(n,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kv=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Mv=/^https?/;async function Dv(n){if(n.config.emulator)return;const{authorizedDomains:e}=await Cv(n);for(const t of e)try{if(Nv(t))return}catch{}Et(n,"unauthorized-domain")}function Nv(n){const e=za(),{protocol:t,hostname:s}=new URL(e);if(n.startsWith("chrome-extension://")){const a=new URL(n);return a.hostname===""&&s===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&a.hostname===s}if(!Mv.test(t))return!1;if(kv.test(n))return s===n;const r=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+r+"|"+r+")$","i").test(s)}/**
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
 */const Lv=new ei(3e4,6e4);function Ru(){const n=Vt().___jsl;if(n!=null&&n.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function Ov(n){return new Promise((e,t)=>{var s,r,i;function a(){Ru(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Ru(),t(Pt(n,"network-request-failed"))},timeout:Lv.get()})}if(!((r=(s=Vt().gapi)===null||s===void 0?void 0:s.iframes)===null||r===void 0)&&r.Iframe)e(gapi.iframes.getContext());else if(!((i=Vt().gapi)===null||i===void 0)&&i.load)a();else{const l=Ty("iframefcb");return Vt()[l]=()=>{gapi.load?a():t(Pt(n,"network-request-failed"))},oh(`${Ey()}?onload=${l}`).catch(c=>t(c))}}).catch(e=>{throw zi=null,e})}let zi=null;function Vv(n){return zi=zi||Ov(n),zi}/**
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
 */const Bv=new ei(5e3,15e3),Fv="__/auth/iframe",zv="emulator/auth/iframe",Uv={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},$v=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function qv(n){const e=n.config;j(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?vl(e,zv):`https://${n.config.authDomain}/${Fv}`,s={apiKey:e.apiKey,appName:n.name,v:Xs},r=$v.get(n.config.apiHost);r&&(s.eid=r);const i=n._getFrameworks();return i.length&&(s.fw=i.join(",")),`${t}?${Zr(s).slice(1)}`}async function Hv(n){const e=await Vv(n),t=Vt().gapi;return j(t,n,"internal-error"),e.open({where:document.body,url:qv(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Uv,dontclear:!0},s=>new Promise(async(r,i)=>{await s.restyle({setHideOnLeave:!1});const a=Pt(n,"network-request-failed"),l=Vt().setTimeout(()=>{i(a)},Bv.get());function c(){Vt().clearTimeout(l),r(s)}s.ping(c).then(c,()=>{i(a)})}))}/**
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
 */const jv={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Wv=500,Yv=600,Gv="_blank",Kv="http://localhost";class Pu{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Qv(n,e,t,s=Wv,r=Yv){const i=Math.max((window.screen.availHeight-r)/2,0).toString(),a=Math.max((window.screen.availWidth-s)/2,0).toString();let l="";const c=Object.assign(Object.assign({},jv),{width:s.toString(),height:r.toString(),top:i,left:a}),d=et().toLowerCase();t&&(l=Zd(d)?Gv:t),Jd(d)&&(e=e||Kv,c.scrollbars="yes");const f=Object.entries(c).reduce((y,[b,T])=>`${y}${b}=${T},`,"");if(fy(d)&&l!=="_self")return Jv(e||"",l),new Pu(null);const m=window.open(e||"",l,f);j(m,n,"popup-blocked");try{m.focus()}catch{}return new Pu(m)}function Jv(n,e){const t=document.createElement("a");t.href=n,t.target=e;const s=document.createEvent("MouseEvent");s.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(s)}/**
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
 */const Xv="__/auth/handler",Zv="emulator/auth/handler",e0=encodeURIComponent("fac");async function Cu(n,e,t,s,r,i){j(n.config.authDomain,n,"auth-domain-config-required"),j(n.config.apiKey,n,"invalid-api-key");const a={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:s,v:Xs,eventId:r};if(e instanceof Tl){e.setDefaultLanguage(n.languageCode),a.providerId=e.providerId||"",Nm(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(const[f,m]of Object.entries({}))a[f]=m}if(e instanceof ni){const f=e.getScopes().filter(m=>m!=="");f.length>0&&(a.scopes=f.join(","))}n.tenantId&&(a.tid=n.tenantId);const l=a;for(const f of Object.keys(l))l[f]===void 0&&delete l[f];const c=await n._getAppCheckToken(),d=c?`#${e0}=${encodeURIComponent(c)}`:"";return`${t0(n)}?${Zr(l).slice(1)}${d}`}function t0({config:n}){return n.emulator?vl(n,Zv):`https://${n.authDomain}/${Xv}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ta="webStorageSupport";class n0{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=ph,this._completeRedirectFn=xv,this._overrideRedirectResult=Tv}async _openPopup(e,t,s,r){var i;on((i=this.eventManagers[e._key()])===null||i===void 0?void 0:i.manager,"_initialize() not called before _openPopup()");const a=await Cu(e,t,s,za(),r);return Qv(e,a,Il())}async _openRedirect(e,t,s,r){await this._originValidation(e);const i=await Cu(e,t,s,za(),r);return iv(i),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:r,promise:i}=this.eventManagers[t];return r?Promise.resolve(r):(on(i,"If manager is not set, promise should be"),i)}const s=this.initAndGetManager(e);return this.eventManagers[t]={promise:s},s.catch(()=>{delete this.eventManagers[t]}),s}async initAndGetManager(e){const t=await Hv(e),s=new Rv(e);return t.register("authEvent",r=>(j(r==null?void 0:r.authEvent,e,"invalid-auth-event"),{status:s.onEvent(r.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:s},this.iframes[e._key()]=t,s}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Ta,{type:Ta},r=>{var i;const a=(i=r==null?void 0:r[0])===null||i===void 0?void 0:i[Ta];a!==void 0&&t(!!a),Et(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=Dv(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return rh()||Xd()||wl()}}const s0=n0;var ku="@firebase/auth",Mu="1.7.9";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class r0{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(s=>{e((s==null?void 0:s.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){j(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function i0(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function o0(n){Us(new ns("auth",(e,{options:t})=>{const s=e.getProvider("app").getImmediate(),r=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:a,authDomain:l}=s.options;j(a&&!a.includes(":"),"invalid-api-key",{appName:s.name});const c={apiKey:a,authDomain:l,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:ih(n)},d=new _y(s,r,i,c);return Ry(d,t),d},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,s)=>{e.getProvider("auth-internal").initialize()})),Us(new ns("auth-internal",e=>{const t=hn(e.getProvider("auth").getImmediate());return(s=>new r0(s))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),kn(ku,Mu,i0(n)),kn(ku,Mu,"esm2017")}/**
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
 */const a0=5*60,l0=Od("authIdTokenMaxAge")||a0;let Du=null;const c0=n=>async e=>{const t=e&&await e.getIdTokenResult(),s=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(s&&s>l0)return;const r=t==null?void 0:t.token;Du!==r&&(Du=r,await fetch(n,{method:r?"POST":"DELETE",headers:r?{Authorization:`Bearer ${r}`}:{}}))};function u0(n=zd()){const e=pl(n,"auth");if(e.isInitialized())return e.getImmediate();const t=Ay(n,{popupRedirectResolver:s0,persistence:[pv,nv,ph]}),s=Od("authTokenSyncURL");if(s&&typeof isSecureContext=="boolean"&&isSecureContext){const i=new URL(s,location.origin);if(location.origin===i.origin){const a=c0(i.toString());Jy(t,a,()=>a(t.currentUser)),Qy(t,l=>a(l))}}const r=Nd("auth");return r&&Py(t,`http://${r}`),t}function d0(){var n,e;return(e=(n=document.getElementsByTagName("head"))===null||n===void 0?void 0:n[0])!==null&&e!==void 0?e:document}wy({loadJS(n){return new Promise((e,t)=>{const s=document.createElement("script");s.setAttribute("src",n),s.onload=e,s.onerror=r=>{const i=Pt("internal-error");i.customData=r,t(i)},s.type="text/javascript",s.charset="UTF-8",d0().appendChild(s)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});o0("Browser");var Nu=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var es,Eh;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(w,v){function _(){}_.prototype=v.prototype,w.D=v.prototype,w.prototype=new _,w.prototype.constructor=w,w.C=function(E,I,A){for(var g=Array(arguments.length-2),Y=2;Y<arguments.length;Y++)g[Y-2]=arguments[Y];return v.prototype[I].apply(E,g)}}function t(){this.blockSize=-1}function s(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(s,t),s.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function r(w,v,_){_||(_=0);var E=Array(16);if(typeof v=="string")for(var I=0;16>I;++I)E[I]=v.charCodeAt(_++)|v.charCodeAt(_++)<<8|v.charCodeAt(_++)<<16|v.charCodeAt(_++)<<24;else for(I=0;16>I;++I)E[I]=v[_++]|v[_++]<<8|v[_++]<<16|v[_++]<<24;v=w.g[0],_=w.g[1],I=w.g[2];var A=w.g[3],g=v+(A^_&(I^A))+E[0]+3614090360&4294967295;v=_+(g<<7&4294967295|g>>>25),g=A+(I^v&(_^I))+E[1]+3905402710&4294967295,A=v+(g<<12&4294967295|g>>>20),g=I+(_^A&(v^_))+E[2]+606105819&4294967295,I=A+(g<<17&4294967295|g>>>15),g=_+(v^I&(A^v))+E[3]+3250441966&4294967295,_=I+(g<<22&4294967295|g>>>10),g=v+(A^_&(I^A))+E[4]+4118548399&4294967295,v=_+(g<<7&4294967295|g>>>25),g=A+(I^v&(_^I))+E[5]+1200080426&4294967295,A=v+(g<<12&4294967295|g>>>20),g=I+(_^A&(v^_))+E[6]+2821735955&4294967295,I=A+(g<<17&4294967295|g>>>15),g=_+(v^I&(A^v))+E[7]+4249261313&4294967295,_=I+(g<<22&4294967295|g>>>10),g=v+(A^_&(I^A))+E[8]+1770035416&4294967295,v=_+(g<<7&4294967295|g>>>25),g=A+(I^v&(_^I))+E[9]+2336552879&4294967295,A=v+(g<<12&4294967295|g>>>20),g=I+(_^A&(v^_))+E[10]+4294925233&4294967295,I=A+(g<<17&4294967295|g>>>15),g=_+(v^I&(A^v))+E[11]+2304563134&4294967295,_=I+(g<<22&4294967295|g>>>10),g=v+(A^_&(I^A))+E[12]+1804603682&4294967295,v=_+(g<<7&4294967295|g>>>25),g=A+(I^v&(_^I))+E[13]+4254626195&4294967295,A=v+(g<<12&4294967295|g>>>20),g=I+(_^A&(v^_))+E[14]+2792965006&4294967295,I=A+(g<<17&4294967295|g>>>15),g=_+(v^I&(A^v))+E[15]+1236535329&4294967295,_=I+(g<<22&4294967295|g>>>10),g=v+(I^A&(_^I))+E[1]+4129170786&4294967295,v=_+(g<<5&4294967295|g>>>27),g=A+(_^I&(v^_))+E[6]+3225465664&4294967295,A=v+(g<<9&4294967295|g>>>23),g=I+(v^_&(A^v))+E[11]+643717713&4294967295,I=A+(g<<14&4294967295|g>>>18),g=_+(A^v&(I^A))+E[0]+3921069994&4294967295,_=I+(g<<20&4294967295|g>>>12),g=v+(I^A&(_^I))+E[5]+3593408605&4294967295,v=_+(g<<5&4294967295|g>>>27),g=A+(_^I&(v^_))+E[10]+38016083&4294967295,A=v+(g<<9&4294967295|g>>>23),g=I+(v^_&(A^v))+E[15]+3634488961&4294967295,I=A+(g<<14&4294967295|g>>>18),g=_+(A^v&(I^A))+E[4]+3889429448&4294967295,_=I+(g<<20&4294967295|g>>>12),g=v+(I^A&(_^I))+E[9]+568446438&4294967295,v=_+(g<<5&4294967295|g>>>27),g=A+(_^I&(v^_))+E[14]+3275163606&4294967295,A=v+(g<<9&4294967295|g>>>23),g=I+(v^_&(A^v))+E[3]+4107603335&4294967295,I=A+(g<<14&4294967295|g>>>18),g=_+(A^v&(I^A))+E[8]+1163531501&4294967295,_=I+(g<<20&4294967295|g>>>12),g=v+(I^A&(_^I))+E[13]+2850285829&4294967295,v=_+(g<<5&4294967295|g>>>27),g=A+(_^I&(v^_))+E[2]+4243563512&4294967295,A=v+(g<<9&4294967295|g>>>23),g=I+(v^_&(A^v))+E[7]+1735328473&4294967295,I=A+(g<<14&4294967295|g>>>18),g=_+(A^v&(I^A))+E[12]+2368359562&4294967295,_=I+(g<<20&4294967295|g>>>12),g=v+(_^I^A)+E[5]+4294588738&4294967295,v=_+(g<<4&4294967295|g>>>28),g=A+(v^_^I)+E[8]+2272392833&4294967295,A=v+(g<<11&4294967295|g>>>21),g=I+(A^v^_)+E[11]+1839030562&4294967295,I=A+(g<<16&4294967295|g>>>16),g=_+(I^A^v)+E[14]+4259657740&4294967295,_=I+(g<<23&4294967295|g>>>9),g=v+(_^I^A)+E[1]+2763975236&4294967295,v=_+(g<<4&4294967295|g>>>28),g=A+(v^_^I)+E[4]+1272893353&4294967295,A=v+(g<<11&4294967295|g>>>21),g=I+(A^v^_)+E[7]+4139469664&4294967295,I=A+(g<<16&4294967295|g>>>16),g=_+(I^A^v)+E[10]+3200236656&4294967295,_=I+(g<<23&4294967295|g>>>9),g=v+(_^I^A)+E[13]+681279174&4294967295,v=_+(g<<4&4294967295|g>>>28),g=A+(v^_^I)+E[0]+3936430074&4294967295,A=v+(g<<11&4294967295|g>>>21),g=I+(A^v^_)+E[3]+3572445317&4294967295,I=A+(g<<16&4294967295|g>>>16),g=_+(I^A^v)+E[6]+76029189&4294967295,_=I+(g<<23&4294967295|g>>>9),g=v+(_^I^A)+E[9]+3654602809&4294967295,v=_+(g<<4&4294967295|g>>>28),g=A+(v^_^I)+E[12]+3873151461&4294967295,A=v+(g<<11&4294967295|g>>>21),g=I+(A^v^_)+E[15]+530742520&4294967295,I=A+(g<<16&4294967295|g>>>16),g=_+(I^A^v)+E[2]+3299628645&4294967295,_=I+(g<<23&4294967295|g>>>9),g=v+(I^(_|~A))+E[0]+4096336452&4294967295,v=_+(g<<6&4294967295|g>>>26),g=A+(_^(v|~I))+E[7]+1126891415&4294967295,A=v+(g<<10&4294967295|g>>>22),g=I+(v^(A|~_))+E[14]+2878612391&4294967295,I=A+(g<<15&4294967295|g>>>17),g=_+(A^(I|~v))+E[5]+4237533241&4294967295,_=I+(g<<21&4294967295|g>>>11),g=v+(I^(_|~A))+E[12]+1700485571&4294967295,v=_+(g<<6&4294967295|g>>>26),g=A+(_^(v|~I))+E[3]+2399980690&4294967295,A=v+(g<<10&4294967295|g>>>22),g=I+(v^(A|~_))+E[10]+4293915773&4294967295,I=A+(g<<15&4294967295|g>>>17),g=_+(A^(I|~v))+E[1]+2240044497&4294967295,_=I+(g<<21&4294967295|g>>>11),g=v+(I^(_|~A))+E[8]+1873313359&4294967295,v=_+(g<<6&4294967295|g>>>26),g=A+(_^(v|~I))+E[15]+4264355552&4294967295,A=v+(g<<10&4294967295|g>>>22),g=I+(v^(A|~_))+E[6]+2734768916&4294967295,I=A+(g<<15&4294967295|g>>>17),g=_+(A^(I|~v))+E[13]+1309151649&4294967295,_=I+(g<<21&4294967295|g>>>11),g=v+(I^(_|~A))+E[4]+4149444226&4294967295,v=_+(g<<6&4294967295|g>>>26),g=A+(_^(v|~I))+E[11]+3174756917&4294967295,A=v+(g<<10&4294967295|g>>>22),g=I+(v^(A|~_))+E[2]+718787259&4294967295,I=A+(g<<15&4294967295|g>>>17),g=_+(A^(I|~v))+E[9]+3951481745&4294967295,w.g[0]=w.g[0]+v&4294967295,w.g[1]=w.g[1]+(I+(g<<21&4294967295|g>>>11))&4294967295,w.g[2]=w.g[2]+I&4294967295,w.g[3]=w.g[3]+A&4294967295}s.prototype.u=function(w,v){v===void 0&&(v=w.length);for(var _=v-this.blockSize,E=this.B,I=this.h,A=0;A<v;){if(I==0)for(;A<=_;)r(this,w,A),A+=this.blockSize;if(typeof w=="string"){for(;A<v;)if(E[I++]=w.charCodeAt(A++),I==this.blockSize){r(this,E),I=0;break}}else for(;A<v;)if(E[I++]=w[A++],I==this.blockSize){r(this,E),I=0;break}}this.h=I,this.o+=v},s.prototype.v=function(){var w=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);w[0]=128;for(var v=1;v<w.length-8;++v)w[v]=0;var _=8*this.o;for(v=w.length-8;v<w.length;++v)w[v]=_&255,_/=256;for(this.u(w),w=Array(16),v=_=0;4>v;++v)for(var E=0;32>E;E+=8)w[_++]=this.g[v]>>>E&255;return w};function i(w,v){var _=l;return Object.prototype.hasOwnProperty.call(_,w)?_[w]:_[w]=v(w)}function a(w,v){this.h=v;for(var _=[],E=!0,I=w.length-1;0<=I;I--){var A=w[I]|0;E&&A==v||(_[I]=A,E=!1)}this.g=_}var l={};function c(w){return-128<=w&&128>w?i(w,function(v){return new a([v|0],0>v?-1:0)}):new a([w|0],0>w?-1:0)}function d(w){if(isNaN(w)||!isFinite(w))return m;if(0>w)return x(d(-w));for(var v=[],_=1,E=0;w>=_;E++)v[E]=w/_|0,_*=4294967296;return new a(v,0)}function f(w,v){if(w.length==0)throw Error("number format error: empty string");if(v=v||10,2>v||36<v)throw Error("radix out of range: "+v);if(w.charAt(0)=="-")return x(f(w.substring(1),v));if(0<=w.indexOf("-"))throw Error('number format error: interior "-" character');for(var _=d(Math.pow(v,8)),E=m,I=0;I<w.length;I+=8){var A=Math.min(8,w.length-I),g=parseInt(w.substring(I,I+A),v);8>A?(A=d(Math.pow(v,A)),E=E.j(A).add(d(g))):(E=E.j(_),E=E.add(d(g)))}return E}var m=c(0),y=c(1),b=c(16777216);n=a.prototype,n.m=function(){if(R(this))return-x(this).m();for(var w=0,v=1,_=0;_<this.g.length;_++){var E=this.i(_);w+=(0<=E?E:4294967296+E)*v,v*=4294967296}return w},n.toString=function(w){if(w=w||10,2>w||36<w)throw Error("radix out of range: "+w);if(T(this))return"0";if(R(this))return"-"+x(this).toString(w);for(var v=d(Math.pow(w,6)),_=this,E="";;){var I=C(_,v).g;_=S(_,I.j(v));var A=((0<_.g.length?_.g[0]:_.h)>>>0).toString(w);if(_=I,T(_))return A+E;for(;6>A.length;)A="0"+A;E=A+E}},n.i=function(w){return 0>w?0:w<this.g.length?this.g[w]:this.h};function T(w){if(w.h!=0)return!1;for(var v=0;v<w.g.length;v++)if(w.g[v]!=0)return!1;return!0}function R(w){return w.h==-1}n.l=function(w){return w=S(this,w),R(w)?-1:T(w)?0:1};function x(w){for(var v=w.g.length,_=[],E=0;E<v;E++)_[E]=~w.g[E];return new a(_,~w.h).add(y)}n.abs=function(){return R(this)?x(this):this},n.add=function(w){for(var v=Math.max(this.g.length,w.g.length),_=[],E=0,I=0;I<=v;I++){var A=E+(this.i(I)&65535)+(w.i(I)&65535),g=(A>>>16)+(this.i(I)>>>16)+(w.i(I)>>>16);E=g>>>16,A&=65535,g&=65535,_[I]=g<<16|A}return new a(_,_[_.length-1]&-2147483648?-1:0)};function S(w,v){return w.add(x(v))}n.j=function(w){if(T(this)||T(w))return m;if(R(this))return R(w)?x(this).j(x(w)):x(x(this).j(w));if(R(w))return x(this.j(x(w)));if(0>this.l(b)&&0>w.l(b))return d(this.m()*w.m());for(var v=this.g.length+w.g.length,_=[],E=0;E<2*v;E++)_[E]=0;for(E=0;E<this.g.length;E++)for(var I=0;I<w.g.length;I++){var A=this.i(E)>>>16,g=this.i(E)&65535,Y=w.i(I)>>>16,Z=w.i(I)&65535;_[2*E+2*I]+=g*Z,M(_,2*E+2*I),_[2*E+2*I+1]+=A*Z,M(_,2*E+2*I+1),_[2*E+2*I+1]+=g*Y,M(_,2*E+2*I+1),_[2*E+2*I+2]+=A*Y,M(_,2*E+2*I+2)}for(E=0;E<v;E++)_[E]=_[2*E+1]<<16|_[2*E];for(E=v;E<2*v;E++)_[E]=0;return new a(_,0)};function M(w,v){for(;(w[v]&65535)!=w[v];)w[v+1]+=w[v]>>>16,w[v]&=65535,v++}function D(w,v){this.g=w,this.h=v}function C(w,v){if(T(v))throw Error("division by zero");if(T(w))return new D(m,m);if(R(w))return v=C(x(w),v),new D(x(v.g),x(v.h));if(R(v))return v=C(w,x(v)),new D(x(v.g),v.h);if(30<w.g.length){if(R(w)||R(v))throw Error("slowDivide_ only works with positive integers.");for(var _=y,E=v;0>=E.l(w);)_=O(_),E=O(E);var I=F(_,1),A=F(E,1);for(E=F(E,2),_=F(_,2);!T(E);){var g=A.add(E);0>=g.l(w)&&(I=I.add(_),A=g),E=F(E,1),_=F(_,1)}return v=S(w,I.j(v)),new D(I,v)}for(I=m;0<=w.l(v);){for(_=Math.max(1,Math.floor(w.m()/v.m())),E=Math.ceil(Math.log(_)/Math.LN2),E=48>=E?1:Math.pow(2,E-48),A=d(_),g=A.j(v);R(g)||0<g.l(w);)_-=E,A=d(_),g=A.j(v);T(A)&&(A=y),I=I.add(A),w=S(w,g)}return new D(I,w)}n.A=function(w){return C(this,w).h},n.and=function(w){for(var v=Math.max(this.g.length,w.g.length),_=[],E=0;E<v;E++)_[E]=this.i(E)&w.i(E);return new a(_,this.h&w.h)},n.or=function(w){for(var v=Math.max(this.g.length,w.g.length),_=[],E=0;E<v;E++)_[E]=this.i(E)|w.i(E);return new a(_,this.h|w.h)},n.xor=function(w){for(var v=Math.max(this.g.length,w.g.length),_=[],E=0;E<v;E++)_[E]=this.i(E)^w.i(E);return new a(_,this.h^w.h)};function O(w){for(var v=w.g.length+1,_=[],E=0;E<v;E++)_[E]=w.i(E)<<1|w.i(E-1)>>>31;return new a(_,w.h)}function F(w,v){var _=v>>5;v%=32;for(var E=w.g.length-_,I=[],A=0;A<E;A++)I[A]=0<v?w.i(A+_)>>>v|w.i(A+_+1)<<32-v:w.i(A+_);return new a(I,w.h)}s.prototype.digest=s.prototype.v,s.prototype.reset=s.prototype.s,s.prototype.update=s.prototype.u,Eh=s,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.A,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=d,a.fromString=f,es=a}).apply(typeof Nu<"u"?Nu:typeof self<"u"?self:typeof window<"u"?window:{});var Di=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Th,xr,Ih,Ui,qa,Sh,xh,Ah;(function(){var n,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(o,u,h){return o==Array.prototype||o==Object.prototype||(o[u]=h.value),o};function t(o){o=[typeof globalThis=="object"&&globalThis,o,typeof window=="object"&&window,typeof self=="object"&&self,typeof Di=="object"&&Di];for(var u=0;u<o.length;++u){var h=o[u];if(h&&h.Math==Math)return h}throw Error("Cannot find global object")}var s=t(this);function r(o,u){if(u)e:{var h=s;o=o.split(".");for(var p=0;p<o.length-1;p++){var P=o[p];if(!(P in h))break e;h=h[P]}o=o[o.length-1],p=h[o],u=u(p),u!=p&&u!=null&&e(h,o,{configurable:!0,writable:!0,value:u})}}function i(o,u){o instanceof String&&(o+="");var h=0,p=!1,P={next:function(){if(!p&&h<o.length){var k=h++;return{value:u(k,o[k]),done:!1}}return p=!0,{done:!0,value:void 0}}};return P[Symbol.iterator]=function(){return P},P}r("Array.prototype.values",function(o){return o||function(){return i(this,function(u,h){return h})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var a=a||{},l=this||self;function c(o){var u=typeof o;return u=u!="object"?u:o?Array.isArray(o)?"array":u:"null",u=="array"||u=="object"&&typeof o.length=="number"}function d(o){var u=typeof o;return u=="object"&&o!=null||u=="function"}function f(o,u,h){return o.call.apply(o.bind,arguments)}function m(o,u,h){if(!o)throw Error();if(2<arguments.length){var p=Array.prototype.slice.call(arguments,2);return function(){var P=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(P,p),o.apply(u,P)}}return function(){return o.apply(u,arguments)}}function y(o,u,h){return y=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?f:m,y.apply(null,arguments)}function b(o,u){var h=Array.prototype.slice.call(arguments,1);return function(){var p=h.slice();return p.push.apply(p,arguments),o.apply(this,p)}}function T(o,u){function h(){}h.prototype=u.prototype,o.aa=u.prototype,o.prototype=new h,o.prototype.constructor=o,o.Qb=function(p,P,k){for(var V=Array(arguments.length-2),fe=2;fe<arguments.length;fe++)V[fe-2]=arguments[fe];return u.prototype[P].apply(p,V)}}function R(o){const u=o.length;if(0<u){const h=Array(u);for(let p=0;p<u;p++)h[p]=o[p];return h}return[]}function x(o,u){for(let h=1;h<arguments.length;h++){const p=arguments[h];if(c(p)){const P=o.length||0,k=p.length||0;o.length=P+k;for(let V=0;V<k;V++)o[P+V]=p[V]}else o.push(p)}}class S{constructor(u,h){this.i=u,this.j=h,this.h=0,this.g=null}get(){let u;return 0<this.h?(this.h--,u=this.g,this.g=u.next,u.next=null):u=this.i(),u}}function M(o){return/^[\s\xa0]*$/.test(o)}function D(){var o=l.navigator;return o&&(o=o.userAgent)?o:""}function C(o){return C[" "](o),o}C[" "]=function(){};var O=D().indexOf("Gecko")!=-1&&!(D().toLowerCase().indexOf("webkit")!=-1&&D().indexOf("Edge")==-1)&&!(D().indexOf("Trident")!=-1||D().indexOf("MSIE")!=-1)&&D().indexOf("Edge")==-1;function F(o,u,h){for(const p in o)u.call(h,o[p],p,o)}function w(o,u){for(const h in o)u.call(void 0,o[h],h,o)}function v(o){const u={};for(const h in o)u[h]=o[h];return u}const _="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function E(o,u){let h,p;for(let P=1;P<arguments.length;P++){p=arguments[P];for(h in p)o[h]=p[h];for(let k=0;k<_.length;k++)h=_[k],Object.prototype.hasOwnProperty.call(p,h)&&(o[h]=p[h])}}function I(o){var u=1;o=o.split(":");const h=[];for(;0<u&&o.length;)h.push(o.shift()),u--;return o.length&&h.push(o.join(":")),h}function A(o){l.setTimeout(()=>{throw o},0)}function g(){var o=vt;let u=null;return o.g&&(u=o.g,o.g=o.g.next,o.g||(o.h=null),u.next=null),u}class Y{constructor(){this.h=this.g=null}add(u,h){const p=Z.get();p.set(u,h),this.h?this.h.next=p:this.g=p,this.h=p}}var Z=new S(()=>new ee,o=>o.reset());class ee{constructor(){this.next=this.g=this.h=null}set(u,h){this.h=u,this.g=h,this.next=null}reset(){this.next=this.g=this.h=null}}let _e,pe=!1,vt=new Y,Se=()=>{const o=l.Promise.resolve(void 0);_e=()=>{o.then(ft)}};var ft=()=>{for(var o;o=g();){try{o.h.call(o.g)}catch(h){A(h)}var u=Z;u.j(o),100>u.h&&(u.h++,o.next=u.g,u.g=o)}pe=!1};function re(){this.s=this.s,this.C=this.C}re.prototype.s=!1,re.prototype.ma=function(){this.s||(this.s=!0,this.N())},re.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function Q(o,u){this.type=o,this.g=this.target=u,this.defaultPrevented=!1}Q.prototype.h=function(){this.defaultPrevented=!0};var It=function(){if(!l.addEventListener||!Object.defineProperty)return!1;var o=!1,u=Object.defineProperty({},"passive",{get:function(){o=!0}});try{const h=()=>{};l.addEventListener("test",h,u),l.removeEventListener("test",h,u)}catch{}return o}();function J(o,u){if(Q.call(this,o?o.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,o){var h=this.type=o.type,p=o.changedTouches&&o.changedTouches.length?o.changedTouches[0]:null;if(this.target=o.target||o.srcElement,this.g=u,u=o.relatedTarget){if(O){e:{try{C(u.nodeName);var P=!0;break e}catch{}P=!1}P||(u=null)}}else h=="mouseover"?u=o.fromElement:h=="mouseout"&&(u=o.toElement);this.relatedTarget=u,p?(this.clientX=p.clientX!==void 0?p.clientX:p.pageX,this.clientY=p.clientY!==void 0?p.clientY:p.pageY,this.screenX=p.screenX||0,this.screenY=p.screenY||0):(this.clientX=o.clientX!==void 0?o.clientX:o.pageX,this.clientY=o.clientY!==void 0?o.clientY:o.pageY,this.screenX=o.screenX||0,this.screenY=o.screenY||0),this.button=o.button,this.key=o.key||"",this.ctrlKey=o.ctrlKey,this.altKey=o.altKey,this.shiftKey=o.shiftKey,this.metaKey=o.metaKey,this.pointerId=o.pointerId||0,this.pointerType=typeof o.pointerType=="string"?o.pointerType:xe[o.pointerType]||"",this.state=o.state,this.i=o,o.defaultPrevented&&J.aa.h.call(this)}}T(J,Q);var xe={2:"touch",3:"pen",4:"mouse"};J.prototype.h=function(){J.aa.h.call(this);var o=this.i;o.preventDefault?o.preventDefault():o.returnValue=!1};var ne="closure_listenable_"+(1e6*Math.random()|0),Ye=0;function it(o,u,h,p,P){this.listener=o,this.proxy=null,this.src=u,this.type=h,this.capture=!!p,this.ha=P,this.key=++Ye,this.da=this.fa=!1}function pt(o){o.da=!0,o.listener=null,o.proxy=null,o.src=null,o.ha=null}function ce(o){this.src=o,this.g={},this.h=0}ce.prototype.add=function(o,u,h,p,P){var k=o.toString();o=this.g[k],o||(o=this.g[k]=[],this.h++);var V=Me(o,u,p,P);return-1<V?(u=o[V],h||(u.fa=!1)):(u=new it(u,this.src,k,!!p,P),u.fa=h,o.push(u)),u};function Ge(o,u){var h=u.type;if(h in o.g){var p=o.g[h],P=Array.prototype.indexOf.call(p,u,void 0),k;(k=0<=P)&&Array.prototype.splice.call(p,P,1),k&&(pt(u),o.g[h].length==0&&(delete o.g[h],o.h--))}}function Me(o,u,h,p){for(var P=0;P<o.length;++P){var k=o[P];if(!k.da&&k.listener==u&&k.capture==!!h&&k.ha==p)return P}return-1}var tt="closure_lm_"+(1e6*Math.random()|0),ot={};function gs(o,u,h,p,P){if(Array.isArray(u)){for(var k=0;k<u.length;k++)gs(o,u[k],h,p,P);return null}return h=ar(h),o&&o[ne]?o.K(u,h,d(p)?!!p.capture:!1,P):ir(o,u,h,!1,p,P)}function ir(o,u,h,p,P,k){if(!u)throw Error("Invalid event type");var V=d(P)?!!P.capture:!!P,fe=Yt(o);if(fe||(o[tt]=fe=new ce(o)),h=fe.add(u,h,p,V,k),h.proxy)return h;if(p=Wt(),h.proxy=p,p.src=o,p.listener=h,o.addEventListener)It||(P=V),P===void 0&&(P=!1),o.addEventListener(u.toString(),p,P);else if(o.attachEvent)o.attachEvent(ys(u.toString()),p);else if(o.addListener&&o.removeListener)o.addListener(p);else throw Error("addEventListener and attachEvent are unavailable.");return h}function Wt(){function o(h){return u.call(o.src,o.listener,h)}const u=pi;return o}function Hn(o,u,h,p,P){if(Array.isArray(u))for(var k=0;k<u.length;k++)Hn(o,u[k],h,p,P);else p=d(p)?!!p.capture:!!p,h=ar(h),o&&o[ne]?(o=o.i,u=String(u).toString(),u in o.g&&(k=o.g[u],h=Me(k,h,p,P),-1<h&&(pt(k[h]),Array.prototype.splice.call(k,h,1),k.length==0&&(delete o.g[u],o.h--)))):o&&(o=Yt(o))&&(u=o.g[u.toString()],o=-1,u&&(o=Me(u,h,p,P)),(h=-1<o?u[o]:null)&&mn(h))}function mn(o){if(typeof o!="number"&&o&&!o.da){var u=o.src;if(u&&u[ne])Ge(u.i,o);else{var h=o.type,p=o.proxy;u.removeEventListener?u.removeEventListener(h,p,o.capture):u.detachEvent?u.detachEvent(ys(h),p):u.addListener&&u.removeListener&&u.removeListener(p),(h=Yt(u))?(Ge(h,o),h.h==0&&(h.src=null,u[tt]=null)):pt(o)}}}function ys(o){return o in ot?ot[o]:ot[o]="on"+o}function pi(o,u){if(o.da)o=!0;else{u=new J(u,this);var h=o.listener,p=o.ha||o.src;o.fa&&mn(o),o=h.call(p,u)}return o}function Yt(o){return o=o[tt],o instanceof ce?o:null}var or="__closure_events_fn_"+(1e9*Math.random()>>>0);function ar(o){return typeof o=="function"?o:(o[or]||(o[or]=function(u){return o.handleEvent(u)}),o[or])}function Be(){re.call(this),this.i=new ce(this),this.M=this,this.F=null}T(Be,re),Be.prototype[ne]=!0,Be.prototype.removeEventListener=function(o,u,h,p){Hn(this,o,u,h,p)};function De(o,u){var h,p=o.F;if(p)for(h=[];p;p=p.F)h.push(p);if(o=o.M,p=u.type||u,typeof u=="string")u=new Q(u,o);else if(u instanceof Q)u.target=u.target||o;else{var P=u;u=new Q(p,o),E(u,P)}if(P=!0,h)for(var k=h.length-1;0<=k;k--){var V=u.g=h[k];P=lr(V,p,!0,u)&&P}if(V=u.g=o,P=lr(V,p,!0,u)&&P,P=lr(V,p,!1,u)&&P,h)for(k=0;k<h.length;k++)V=u.g=h[k],P=lr(V,p,!1,u)&&P}Be.prototype.N=function(){if(Be.aa.N.call(this),this.i){var o=this.i,u;for(u in o.g){for(var h=o.g[u],p=0;p<h.length;p++)pt(h[p]);delete o.g[u],o.h--}}this.F=null},Be.prototype.K=function(o,u,h,p){return this.i.add(String(o),u,!1,h,p)},Be.prototype.L=function(o,u,h,p){return this.i.add(String(o),u,!0,h,p)};function lr(o,u,h,p){if(u=o.i.g[String(u)],!u)return!0;u=u.concat();for(var P=!0,k=0;k<u.length;++k){var V=u[k];if(V&&!V.da&&V.capture==h){var fe=V.listener,$e=V.ha||V.src;V.fa&&Ge(o.i,V),P=fe.call($e,p)!==!1&&P}}return P&&!p.defaultPrevented}function mi(o,u,h){if(typeof o=="function")h&&(o=y(o,h));else if(o&&typeof o.handleEvent=="function")o=y(o.handleEvent,o);else throw Error("Invalid listener argument");return 2147483647<Number(u)?-1:l.setTimeout(o,u||0)}function ea(o){o.g=mi(()=>{o.g=null,o.i&&(o.i=!1,ea(o))},o.l);const u=o.h;o.h=null,o.m.apply(null,u)}class cr extends re{constructor(u,h){super(),this.m=u,this.l=h,this.h=null,this.i=!1,this.g=null}j(u){this.h=arguments,this.g?this.i=!0:ea(this)}N(){super.N(),this.g&&(l.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Dt(o){re.call(this),this.h=o,this.g={}}T(Dt,re);var ur=[];function ta(o){F(o.g,function(u,h){this.g.hasOwnProperty(h)&&mn(u)},o),o.g={}}Dt.prototype.N=function(){Dt.aa.N.call(this),ta(this)},Dt.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var vs=l.JSON.stringify,na=l.JSON.parse,sa=class{stringify(o){return l.JSON.stringify(o,void 0)}parse(o){return l.JSON.parse(o,void 0)}};function dr(){}dr.prototype.h=null;function gi(o){return o.h||(o.h=o.i())}function _s(){}var jn={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function ws(){Q.call(this,"d")}T(ws,Q);function bs(){Q.call(this,"c")}T(bs,Q);var Nt={},hr=null;function te(){return hr=hr||new Be}Nt.La="serverreachability";function Ne(o){Q.call(this,Nt.La,o)}T(Ne,Q);function Ee(o){const u=te();De(u,new Ne(u))}Nt.STAT_EVENT="statevent";function at(o,u){Q.call(this,Nt.STAT_EVENT,o),this.stat=u}T(at,Q);function me(o){const u=te();De(u,new at(u,o))}Nt.Ma="timingevent";function Ae(o,u){Q.call(this,Nt.Ma,o),this.size=u}T(Ae,Q);function nt(o,u){if(typeof o!="function")throw Error("Fn must not be null and must be a function");return l.setTimeout(function(){o()},u)}function he(){this.g=!0}he.prototype.xa=function(){this.g=!1};function Ue(o,u,h,p,P,k){o.info(function(){if(o.g)if(k)for(var V="",fe=k.split("&"),$e=0;$e<fe.length;$e++){var ae=fe[$e].split("=");if(1<ae.length){var Ke=ae[0];ae=ae[1];var Qe=Ke.split("_");V=2<=Qe.length&&Qe[1]=="type"?V+(Ke+"="+ae+"&"):V+(Ke+"=redacted&")}}else V=null;else V=k;return"XMLHTTP REQ ("+p+") [attempt "+P+"]: "+u+`
`+h+`
`+V})}function ge(o,u,h,p,P,k,V){o.info(function(){return"XMLHTTP RESP ("+p+") [ attempt "+P+"]: "+u+`
`+h+`
`+k+" "+V})}function Te(o,u,h,p){o.info(function(){return"XMLHTTP TEXT ("+u+"): "+Es(o,h)+(p?" "+p:"")})}function Gt(o,u){o.info(function(){return"TIMEOUT: "+u})}he.prototype.info=function(){};function Es(o,u){if(!o.g)return u;if(!u)return null;try{var h=JSON.parse(u);if(h){for(o=0;o<h.length;o++)if(Array.isArray(h[o])){var p=h[o];if(!(2>p.length)){var P=p[1];if(Array.isArray(P)&&!(1>P.length)){var k=P[0];if(k!="noop"&&k!="stop"&&k!="close")for(var V=1;V<P.length;V++)P[V]=""}}}}return vs(h)}catch{return u}}var Ts={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},yi={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},ra;function vi(){}T(vi,dr),vi.prototype.g=function(){return new XMLHttpRequest},vi.prototype.i=function(){return{}},ra=new vi;function gn(o,u,h,p){this.j=o,this.i=u,this.l=h,this.R=p||1,this.U=new Dt(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new _c}function _c(){this.i=null,this.g="",this.h=!1}var wc={},ia={};function oa(o,u,h){o.L=1,o.v=Ei(Kt(u)),o.m=h,o.P=!0,bc(o,null)}function bc(o,u){o.F=Date.now(),_i(o),o.A=Kt(o.v);var h=o.A,p=o.R;Array.isArray(p)||(p=[String(p)]),Lc(h.i,"t",p),o.C=0,h=o.j.J,o.h=new _c,o.g=Zc(o.j,h?u:null,!o.m),0<o.O&&(o.M=new cr(y(o.Y,o,o.g),o.O)),u=o.U,h=o.g,p=o.ca;var P="readystatechange";Array.isArray(P)||(P&&(ur[0]=P.toString()),P=ur);for(var k=0;k<P.length;k++){var V=gs(h,P[k],p||u.handleEvent,!1,u.h||u);if(!V)break;u.g[V.key]=V}u=o.H?v(o.H):{},o.m?(o.u||(o.u="POST"),u["Content-Type"]="application/x-www-form-urlencoded",o.g.ea(o.A,o.u,o.m,u)):(o.u="GET",o.g.ea(o.A,o.u,null,u)),Ee(),Ue(o.i,o.u,o.A,o.l,o.R,o.m)}gn.prototype.ca=function(o){o=o.target;const u=this.M;u&&Qt(o)==3?u.j():this.Y(o)},gn.prototype.Y=function(o){try{if(o==this.g)e:{const Qe=Qt(this.g);var u=this.g.Ba();const xs=this.g.Z();if(!(3>Qe)&&(Qe!=3||this.g&&(this.h.h||this.g.oa()||$c(this.g)))){this.J||Qe!=4||u==7||(u==8||0>=xs?Ee(3):Ee(2)),aa(this);var h=this.g.Z();this.X=h;t:if(Ec(this)){var p=$c(this.g);o="";var P=p.length,k=Qt(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){Wn(this),fr(this);var V="";break t}this.h.i=new l.TextDecoder}for(u=0;u<P;u++)this.h.h=!0,o+=this.h.i.decode(p[u],{stream:!(k&&u==P-1)});p.length=0,this.h.g+=o,this.C=0,V=this.h.g}else V=this.g.oa();if(this.o=h==200,ge(this.i,this.u,this.A,this.l,this.R,Qe,h),this.o){if(this.T&&!this.K){t:{if(this.g){var fe,$e=this.g;if((fe=$e.g?$e.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!M(fe)){var ae=fe;break t}}ae=null}if(h=ae)Te(this.i,this.l,h,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,la(this,h);else{this.o=!1,this.s=3,me(12),Wn(this),fr(this);break e}}if(this.P){h=!0;let St;for(;!this.J&&this.C<V.length;)if(St=Dp(this,V),St==ia){Qe==4&&(this.s=4,me(14),h=!1),Te(this.i,this.l,null,"[Incomplete Response]");break}else if(St==wc){this.s=4,me(15),Te(this.i,this.l,V,"[Invalid Chunk]"),h=!1;break}else Te(this.i,this.l,St,null),la(this,St);if(Ec(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),Qe!=4||V.length!=0||this.h.h||(this.s=1,me(16),h=!1),this.o=this.o&&h,!h)Te(this.i,this.l,V,"[Invalid Chunked Response]"),Wn(this),fr(this);else if(0<V.length&&!this.W){this.W=!0;var Ke=this.j;Ke.g==this&&Ke.ba&&!Ke.M&&(Ke.j.info("Great, no buffering proxy detected. Bytes received: "+V.length),pa(Ke),Ke.M=!0,me(11))}}else Te(this.i,this.l,V,null),la(this,V);Qe==4&&Wn(this),this.o&&!this.J&&(Qe==4?Kc(this.j,this):(this.o=!1,_i(this)))}else Qp(this.g),h==400&&0<V.indexOf("Unknown SID")?(this.s=3,me(12)):(this.s=0,me(13)),Wn(this),fr(this)}}}catch{}finally{}};function Ec(o){return o.g?o.u=="GET"&&o.L!=2&&o.j.Ca:!1}function Dp(o,u){var h=o.C,p=u.indexOf(`
`,h);return p==-1?ia:(h=Number(u.substring(h,p)),isNaN(h)?wc:(p+=1,p+h>u.length?ia:(u=u.slice(p,p+h),o.C=p+h,u)))}gn.prototype.cancel=function(){this.J=!0,Wn(this)};function _i(o){o.S=Date.now()+o.I,Tc(o,o.I)}function Tc(o,u){if(o.B!=null)throw Error("WatchDog timer not null");o.B=nt(y(o.ba,o),u)}function aa(o){o.B&&(l.clearTimeout(o.B),o.B=null)}gn.prototype.ba=function(){this.B=null;const o=Date.now();0<=o-this.S?(Gt(this.i,this.A),this.L!=2&&(Ee(),me(17)),Wn(this),this.s=2,fr(this)):Tc(this,this.S-o)};function fr(o){o.j.G==0||o.J||Kc(o.j,o)}function Wn(o){aa(o);var u=o.M;u&&typeof u.ma=="function"&&u.ma(),o.M=null,ta(o.U),o.g&&(u=o.g,o.g=null,u.abort(),u.ma())}function la(o,u){try{var h=o.j;if(h.G!=0&&(h.g==o||ca(h.h,o))){if(!o.K&&ca(h.h,o)&&h.G==3){try{var p=h.Da.g.parse(u)}catch{p=null}if(Array.isArray(p)&&p.length==3){var P=p;if(P[0]==0){e:if(!h.u){if(h.g)if(h.g.F+3e3<o.F)Ri(h),xi(h);else break e;fa(h),me(18)}}else h.za=P[1],0<h.za-h.T&&37500>P[2]&&h.F&&h.v==0&&!h.C&&(h.C=nt(y(h.Za,h),6e3));if(1>=xc(h.h)&&h.ca){try{h.ca()}catch{}h.ca=void 0}}else Gn(h,11)}else if((o.K||h.g==o)&&Ri(h),!M(u))for(P=h.Da.g.parse(u),u=0;u<P.length;u++){let ae=P[u];if(h.T=ae[0],ae=ae[1],h.G==2)if(ae[0]=="c"){h.K=ae[1],h.ia=ae[2];const Ke=ae[3];Ke!=null&&(h.la=Ke,h.j.info("VER="+h.la));const Qe=ae[4];Qe!=null&&(h.Aa=Qe,h.j.info("SVER="+h.Aa));const xs=ae[5];xs!=null&&typeof xs=="number"&&0<xs&&(p=1.5*xs,h.L=p,h.j.info("backChannelRequestTimeoutMs_="+p)),p=h;const St=o.g;if(St){const Ci=St.g?St.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Ci){var k=p.h;k.g||Ci.indexOf("spdy")==-1&&Ci.indexOf("quic")==-1&&Ci.indexOf("h2")==-1||(k.j=k.l,k.g=new Set,k.h&&(ua(k,k.h),k.h=null))}if(p.D){const ma=St.g?St.g.getResponseHeader("X-HTTP-Session-Id"):null;ma&&(p.ya=ma,ye(p.I,p.D,ma))}}h.G=3,h.l&&h.l.ua(),h.ba&&(h.R=Date.now()-o.F,h.j.info("Handshake RTT: "+h.R+"ms")),p=h;var V=o;if(p.qa=Xc(p,p.J?p.ia:null,p.W),V.K){Ac(p.h,V);var fe=V,$e=p.L;$e&&(fe.I=$e),fe.B&&(aa(fe),_i(fe)),p.g=V}else Yc(p);0<h.i.length&&Ai(h)}else ae[0]!="stop"&&ae[0]!="close"||Gn(h,7);else h.G==3&&(ae[0]=="stop"||ae[0]=="close"?ae[0]=="stop"?Gn(h,7):ha(h):ae[0]!="noop"&&h.l&&h.l.ta(ae),h.v=0)}}Ee(4)}catch{}}var Np=class{constructor(o,u){this.g=o,this.map=u}};function Ic(o){this.l=o||10,l.PerformanceNavigationTiming?(o=l.performance.getEntriesByType("navigation"),o=0<o.length&&(o[0].nextHopProtocol=="hq"||o[0].nextHopProtocol=="h2")):o=!!(l.chrome&&l.chrome.loadTimes&&l.chrome.loadTimes()&&l.chrome.loadTimes().wasFetchedViaSpdy),this.j=o?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function Sc(o){return o.h?!0:o.g?o.g.size>=o.j:!1}function xc(o){return o.h?1:o.g?o.g.size:0}function ca(o,u){return o.h?o.h==u:o.g?o.g.has(u):!1}function ua(o,u){o.g?o.g.add(u):o.h=u}function Ac(o,u){o.h&&o.h==u?o.h=null:o.g&&o.g.has(u)&&o.g.delete(u)}Ic.prototype.cancel=function(){if(this.i=Rc(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const o of this.g.values())o.cancel();this.g.clear()}};function Rc(o){if(o.h!=null)return o.i.concat(o.h.D);if(o.g!=null&&o.g.size!==0){let u=o.i;for(const h of o.g.values())u=u.concat(h.D);return u}return R(o.i)}function Lp(o){if(o.V&&typeof o.V=="function")return o.V();if(typeof Map<"u"&&o instanceof Map||typeof Set<"u"&&o instanceof Set)return Array.from(o.values());if(typeof o=="string")return o.split("");if(c(o)){for(var u=[],h=o.length,p=0;p<h;p++)u.push(o[p]);return u}u=[],h=0;for(p in o)u[h++]=o[p];return u}function Op(o){if(o.na&&typeof o.na=="function")return o.na();if(!o.V||typeof o.V!="function"){if(typeof Map<"u"&&o instanceof Map)return Array.from(o.keys());if(!(typeof Set<"u"&&o instanceof Set)){if(c(o)||typeof o=="string"){var u=[];o=o.length;for(var h=0;h<o;h++)u.push(h);return u}u=[],h=0;for(const p in o)u[h++]=p;return u}}}function Pc(o,u){if(o.forEach&&typeof o.forEach=="function")o.forEach(u,void 0);else if(c(o)||typeof o=="string")Array.prototype.forEach.call(o,u,void 0);else for(var h=Op(o),p=Lp(o),P=p.length,k=0;k<P;k++)u.call(void 0,p[k],h&&h[k],o)}var Cc=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Vp(o,u){if(o){o=o.split("&");for(var h=0;h<o.length;h++){var p=o[h].indexOf("="),P=null;if(0<=p){var k=o[h].substring(0,p);P=o[h].substring(p+1)}else k=o[h];u(k,P?decodeURIComponent(P.replace(/\+/g," ")):"")}}}function Yn(o){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,o instanceof Yn){this.h=o.h,wi(this,o.j),this.o=o.o,this.g=o.g,bi(this,o.s),this.l=o.l;var u=o.i,h=new gr;h.i=u.i,u.g&&(h.g=new Map(u.g),h.h=u.h),kc(this,h),this.m=o.m}else o&&(u=String(o).match(Cc))?(this.h=!1,wi(this,u[1]||"",!0),this.o=pr(u[2]||""),this.g=pr(u[3]||"",!0),bi(this,u[4]),this.l=pr(u[5]||"",!0),kc(this,u[6]||"",!0),this.m=pr(u[7]||"")):(this.h=!1,this.i=new gr(null,this.h))}Yn.prototype.toString=function(){var o=[],u=this.j;u&&o.push(mr(u,Mc,!0),":");var h=this.g;return(h||u=="file")&&(o.push("//"),(u=this.o)&&o.push(mr(u,Mc,!0),"@"),o.push(encodeURIComponent(String(h)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),h=this.s,h!=null&&o.push(":",String(h))),(h=this.l)&&(this.g&&h.charAt(0)!="/"&&o.push("/"),o.push(mr(h,h.charAt(0)=="/"?zp:Fp,!0))),(h=this.i.toString())&&o.push("?",h),(h=this.m)&&o.push("#",mr(h,$p)),o.join("")};function Kt(o){return new Yn(o)}function wi(o,u,h){o.j=h?pr(u,!0):u,o.j&&(o.j=o.j.replace(/:$/,""))}function bi(o,u){if(u){if(u=Number(u),isNaN(u)||0>u)throw Error("Bad port number "+u);o.s=u}else o.s=null}function kc(o,u,h){u instanceof gr?(o.i=u,qp(o.i,o.h)):(h||(u=mr(u,Up)),o.i=new gr(u,o.h))}function ye(o,u,h){o.i.set(u,h)}function Ei(o){return ye(o,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),o}function pr(o,u){return o?u?decodeURI(o.replace(/%25/g,"%2525")):decodeURIComponent(o):""}function mr(o,u,h){return typeof o=="string"?(o=encodeURI(o).replace(u,Bp),h&&(o=o.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),o):null}function Bp(o){return o=o.charCodeAt(0),"%"+(o>>4&15).toString(16)+(o&15).toString(16)}var Mc=/[#\/\?@]/g,Fp=/[#\?:]/g,zp=/[#\?]/g,Up=/[#\?@]/g,$p=/#/g;function gr(o,u){this.h=this.g=null,this.i=o||null,this.j=!!u}function yn(o){o.g||(o.g=new Map,o.h=0,o.i&&Vp(o.i,function(u,h){o.add(decodeURIComponent(u.replace(/\+/g," ")),h)}))}n=gr.prototype,n.add=function(o,u){yn(this),this.i=null,o=Is(this,o);var h=this.g.get(o);return h||this.g.set(o,h=[]),h.push(u),this.h+=1,this};function Dc(o,u){yn(o),u=Is(o,u),o.g.has(u)&&(o.i=null,o.h-=o.g.get(u).length,o.g.delete(u))}function Nc(o,u){return yn(o),u=Is(o,u),o.g.has(u)}n.forEach=function(o,u){yn(this),this.g.forEach(function(h,p){h.forEach(function(P){o.call(u,P,p,this)},this)},this)},n.na=function(){yn(this);const o=Array.from(this.g.values()),u=Array.from(this.g.keys()),h=[];for(let p=0;p<u.length;p++){const P=o[p];for(let k=0;k<P.length;k++)h.push(u[p])}return h},n.V=function(o){yn(this);let u=[];if(typeof o=="string")Nc(this,o)&&(u=u.concat(this.g.get(Is(this,o))));else{o=Array.from(this.g.values());for(let h=0;h<o.length;h++)u=u.concat(o[h])}return u},n.set=function(o,u){return yn(this),this.i=null,o=Is(this,o),Nc(this,o)&&(this.h-=this.g.get(o).length),this.g.set(o,[u]),this.h+=1,this},n.get=function(o,u){return o?(o=this.V(o),0<o.length?String(o[0]):u):u};function Lc(o,u,h){Dc(o,u),0<h.length&&(o.i=null,o.g.set(Is(o,u),R(h)),o.h+=h.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const o=[],u=Array.from(this.g.keys());for(var h=0;h<u.length;h++){var p=u[h];const k=encodeURIComponent(String(p)),V=this.V(p);for(p=0;p<V.length;p++){var P=k;V[p]!==""&&(P+="="+encodeURIComponent(String(V[p]))),o.push(P)}}return this.i=o.join("&")};function Is(o,u){return u=String(u),o.j&&(u=u.toLowerCase()),u}function qp(o,u){u&&!o.j&&(yn(o),o.i=null,o.g.forEach(function(h,p){var P=p.toLowerCase();p!=P&&(Dc(this,p),Lc(this,P,h))},o)),o.j=u}function Hp(o,u){const h=new he;if(l.Image){const p=new Image;p.onload=b(vn,h,"TestLoadImage: loaded",!0,u,p),p.onerror=b(vn,h,"TestLoadImage: error",!1,u,p),p.onabort=b(vn,h,"TestLoadImage: abort",!1,u,p),p.ontimeout=b(vn,h,"TestLoadImage: timeout",!1,u,p),l.setTimeout(function(){p.ontimeout&&p.ontimeout()},1e4),p.src=o}else u(!1)}function jp(o,u){const h=new he,p=new AbortController,P=setTimeout(()=>{p.abort(),vn(h,"TestPingServer: timeout",!1,u)},1e4);fetch(o,{signal:p.signal}).then(k=>{clearTimeout(P),k.ok?vn(h,"TestPingServer: ok",!0,u):vn(h,"TestPingServer: server error",!1,u)}).catch(()=>{clearTimeout(P),vn(h,"TestPingServer: error",!1,u)})}function vn(o,u,h,p,P){try{P&&(P.onload=null,P.onerror=null,P.onabort=null,P.ontimeout=null),p(h)}catch{}}function Wp(){this.g=new sa}function Yp(o,u,h){const p=h||"";try{Pc(o,function(P,k){let V=P;d(P)&&(V=vs(P)),u.push(p+k+"="+encodeURIComponent(V))})}catch(P){throw u.push(p+"type="+encodeURIComponent("_badmap")),P}}function Ti(o){this.l=o.Ub||null,this.j=o.eb||!1}T(Ti,dr),Ti.prototype.g=function(){return new Ii(this.l,this.j)},Ti.prototype.i=function(o){return function(){return o}}({});function Ii(o,u){Be.call(this),this.D=o,this.o=u,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}T(Ii,Be),n=Ii.prototype,n.open=function(o,u){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=o,this.A=u,this.readyState=1,vr(this)},n.send=function(o){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const u={headers:this.u,method:this.B,credentials:this.m,cache:void 0};o&&(u.body=o),(this.D||l).fetch(new Request(this.A,u)).then(this.Sa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,yr(this)),this.readyState=0},n.Sa=function(o){if(this.g&&(this.l=o,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=o.headers,this.readyState=2,vr(this)),this.g&&(this.readyState=3,vr(this),this.g)))if(this.responseType==="arraybuffer")o.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof l.ReadableStream<"u"&&"body"in o){if(this.j=o.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;Oc(this)}else o.text().then(this.Ra.bind(this),this.ga.bind(this))};function Oc(o){o.j.read().then(o.Pa.bind(o)).catch(o.ga.bind(o))}n.Pa=function(o){if(this.g){if(this.o&&o.value)this.response.push(o.value);else if(!this.o){var u=o.value?o.value:new Uint8Array(0);(u=this.v.decode(u,{stream:!o.done}))&&(this.response=this.responseText+=u)}o.done?yr(this):vr(this),this.readyState==3&&Oc(this)}},n.Ra=function(o){this.g&&(this.response=this.responseText=o,yr(this))},n.Qa=function(o){this.g&&(this.response=o,yr(this))},n.ga=function(){this.g&&yr(this)};function yr(o){o.readyState=4,o.l=null,o.j=null,o.v=null,vr(o)}n.setRequestHeader=function(o,u){this.u.append(o,u)},n.getResponseHeader=function(o){return this.h&&this.h.get(o.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const o=[],u=this.h.entries();for(var h=u.next();!h.done;)h=h.value,o.push(h[0]+": "+h[1]),h=u.next();return o.join(`\r
`)};function vr(o){o.onreadystatechange&&o.onreadystatechange.call(o)}Object.defineProperty(Ii.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(o){this.m=o?"include":"same-origin"}});function Vc(o){let u="";return F(o,function(h,p){u+=p,u+=":",u+=h,u+=`\r
`}),u}function da(o,u,h){e:{for(p in h){var p=!1;break e}p=!0}p||(h=Vc(h),typeof o=="string"?h!=null&&encodeURIComponent(String(h)):ye(o,u,h))}function Ie(o){Be.call(this),this.headers=new Map,this.o=o||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}T(Ie,Be);var Gp=/^https?$/i,Kp=["POST","PUT"];n=Ie.prototype,n.Ha=function(o){this.J=o},n.ea=function(o,u,h,p){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+o);u=u?u.toUpperCase():"GET",this.D=o,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():ra.g(),this.v=this.o?gi(this.o):gi(ra),this.g.onreadystatechange=y(this.Ea,this);try{this.B=!0,this.g.open(u,String(o),!0),this.B=!1}catch(k){Bc(this,k);return}if(o=h||"",h=new Map(this.headers),p)if(Object.getPrototypeOf(p)===Object.prototype)for(var P in p)h.set(P,p[P]);else if(typeof p.keys=="function"&&typeof p.get=="function")for(const k of p.keys())h.set(k,p.get(k));else throw Error("Unknown input type for opt_headers: "+String(p));p=Array.from(h.keys()).find(k=>k.toLowerCase()=="content-type"),P=l.FormData&&o instanceof l.FormData,!(0<=Array.prototype.indexOf.call(Kp,u,void 0))||p||P||h.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[k,V]of h)this.g.setRequestHeader(k,V);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{Uc(this),this.u=!0,this.g.send(o),this.u=!1}catch(k){Bc(this,k)}};function Bc(o,u){o.h=!1,o.g&&(o.j=!0,o.g.abort(),o.j=!1),o.l=u,o.m=5,Fc(o),Si(o)}function Fc(o){o.A||(o.A=!0,De(o,"complete"),De(o,"error"))}n.abort=function(o){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=o||7,De(this,"complete"),De(this,"abort"),Si(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Si(this,!0)),Ie.aa.N.call(this)},n.Ea=function(){this.s||(this.B||this.u||this.j?zc(this):this.bb())},n.bb=function(){zc(this)};function zc(o){if(o.h&&typeof a<"u"&&(!o.v[1]||Qt(o)!=4||o.Z()!=2)){if(o.u&&Qt(o)==4)mi(o.Ea,0,o);else if(De(o,"readystatechange"),Qt(o)==4){o.h=!1;try{const V=o.Z();e:switch(V){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var u=!0;break e;default:u=!1}var h;if(!(h=u)){var p;if(p=V===0){var P=String(o.D).match(Cc)[1]||null;!P&&l.self&&l.self.location&&(P=l.self.location.protocol.slice(0,-1)),p=!Gp.test(P?P.toLowerCase():"")}h=p}if(h)De(o,"complete"),De(o,"success");else{o.m=6;try{var k=2<Qt(o)?o.g.statusText:""}catch{k=""}o.l=k+" ["+o.Z()+"]",Fc(o)}}finally{Si(o)}}}}function Si(o,u){if(o.g){Uc(o);const h=o.g,p=o.v[0]?()=>{}:null;o.g=null,o.v=null,u||De(o,"ready");try{h.onreadystatechange=p}catch{}}}function Uc(o){o.I&&(l.clearTimeout(o.I),o.I=null)}n.isActive=function(){return!!this.g};function Qt(o){return o.g?o.g.readyState:0}n.Z=function(){try{return 2<Qt(this)?this.g.status:-1}catch{return-1}},n.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.Oa=function(o){if(this.g){var u=this.g.responseText;return o&&u.indexOf(o)==0&&(u=u.substring(o.length)),na(u)}};function $c(o){try{if(!o.g)return null;if("response"in o.g)return o.g.response;switch(o.H){case"":case"text":return o.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in o.g)return o.g.mozResponseArrayBuffer}return null}catch{return null}}function Qp(o){const u={};o=(o.g&&2<=Qt(o)&&o.g.getAllResponseHeaders()||"").split(`\r
`);for(let p=0;p<o.length;p++){if(M(o[p]))continue;var h=I(o[p]);const P=h[0];if(h=h[1],typeof h!="string")continue;h=h.trim();const k=u[P]||[];u[P]=k,k.push(h)}w(u,function(p){return p.join(", ")})}n.Ba=function(){return this.m},n.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function _r(o,u,h){return h&&h.internalChannelParams&&h.internalChannelParams[o]||u}function qc(o){this.Aa=0,this.i=[],this.j=new he,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=_r("failFast",!1,o),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=_r("baseRetryDelayMs",5e3,o),this.cb=_r("retryDelaySeedMs",1e4,o),this.Wa=_r("forwardChannelMaxRetries",2,o),this.wa=_r("forwardChannelRequestTimeoutMs",2e4,o),this.pa=o&&o.xmlHttpFactory||void 0,this.Xa=o&&o.Tb||void 0,this.Ca=o&&o.useFetchStreams||!1,this.L=void 0,this.J=o&&o.supportsCrossDomainXhr||!1,this.K="",this.h=new Ic(o&&o.concurrentRequestLimit),this.Da=new Wp,this.P=o&&o.fastHandshake||!1,this.O=o&&o.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=o&&o.Rb||!1,o&&o.xa&&this.j.xa(),o&&o.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&o&&o.detectBufferingProxy||!1,this.ja=void 0,o&&o.longPollingTimeout&&0<o.longPollingTimeout&&(this.ja=o.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}n=qc.prototype,n.la=8,n.G=1,n.connect=function(o,u,h,p){me(0),this.W=o,this.H=u||{},h&&p!==void 0&&(this.H.OSID=h,this.H.OAID=p),this.F=this.X,this.I=Xc(this,null,this.W),Ai(this)};function ha(o){if(Hc(o),o.G==3){var u=o.U++,h=Kt(o.I);if(ye(h,"SID",o.K),ye(h,"RID",u),ye(h,"TYPE","terminate"),wr(o,h),u=new gn(o,o.j,u),u.L=2,u.v=Ei(Kt(h)),h=!1,l.navigator&&l.navigator.sendBeacon)try{h=l.navigator.sendBeacon(u.v.toString(),"")}catch{}!h&&l.Image&&(new Image().src=u.v,h=!0),h||(u.g=Zc(u.j,null),u.g.ea(u.v)),u.F=Date.now(),_i(u)}Jc(o)}function xi(o){o.g&&(pa(o),o.g.cancel(),o.g=null)}function Hc(o){xi(o),o.u&&(l.clearTimeout(o.u),o.u=null),Ri(o),o.h.cancel(),o.s&&(typeof o.s=="number"&&l.clearTimeout(o.s),o.s=null)}function Ai(o){if(!Sc(o.h)&&!o.s){o.s=!0;var u=o.Ga;_e||Se(),pe||(_e(),pe=!0),vt.add(u,o),o.B=0}}function Jp(o,u){return xc(o.h)>=o.h.j-(o.s?1:0)?!1:o.s?(o.i=u.D.concat(o.i),!0):o.G==1||o.G==2||o.B>=(o.Va?0:o.Wa)?!1:(o.s=nt(y(o.Ga,o,u),Qc(o,o.B)),o.B++,!0)}n.Ga=function(o){if(this.s)if(this.s=null,this.G==1){if(!o){this.U=Math.floor(1e5*Math.random()),o=this.U++;const P=new gn(this,this.j,o);let k=this.o;if(this.S&&(k?(k=v(k),E(k,this.S)):k=this.S),this.m!==null||this.O||(P.H=k,k=null),this.P)e:{for(var u=0,h=0;h<this.i.length;h++){t:{var p=this.i[h];if("__data__"in p.map&&(p=p.map.__data__,typeof p=="string")){p=p.length;break t}p=void 0}if(p===void 0)break;if(u+=p,4096<u){u=h;break e}if(u===4096||h===this.i.length-1){u=h+1;break e}}u=1e3}else u=1e3;u=Wc(this,P,u),h=Kt(this.I),ye(h,"RID",o),ye(h,"CVER",22),this.D&&ye(h,"X-HTTP-Session-Id",this.D),wr(this,h),k&&(this.O?u="headers="+encodeURIComponent(String(Vc(k)))+"&"+u:this.m&&da(h,this.m,k)),ua(this.h,P),this.Ua&&ye(h,"TYPE","init"),this.P?(ye(h,"$req",u),ye(h,"SID","null"),P.T=!0,oa(P,h,null)):oa(P,h,u),this.G=2}}else this.G==3&&(o?jc(this,o):this.i.length==0||Sc(this.h)||jc(this))};function jc(o,u){var h;u?h=u.l:h=o.U++;const p=Kt(o.I);ye(p,"SID",o.K),ye(p,"RID",h),ye(p,"AID",o.T),wr(o,p),o.m&&o.o&&da(p,o.m,o.o),h=new gn(o,o.j,h,o.B+1),o.m===null&&(h.H=o.o),u&&(o.i=u.D.concat(o.i)),u=Wc(o,h,1e3),h.I=Math.round(.5*o.wa)+Math.round(.5*o.wa*Math.random()),ua(o.h,h),oa(h,p,u)}function wr(o,u){o.H&&F(o.H,function(h,p){ye(u,p,h)}),o.l&&Pc({},function(h,p){ye(u,p,h)})}function Wc(o,u,h){h=Math.min(o.i.length,h);var p=o.l?y(o.l.Na,o.l,o):null;e:{var P=o.i;let k=-1;for(;;){const V=["count="+h];k==-1?0<h?(k=P[0].g,V.push("ofs="+k)):k=0:V.push("ofs="+k);let fe=!0;for(let $e=0;$e<h;$e++){let ae=P[$e].g;const Ke=P[$e].map;if(ae-=k,0>ae)k=Math.max(0,P[$e].g-100),fe=!1;else try{Yp(Ke,V,"req"+ae+"_")}catch{p&&p(Ke)}}if(fe){p=V.join("&");break e}}}return o=o.i.splice(0,h),u.D=o,p}function Yc(o){if(!o.g&&!o.u){o.Y=1;var u=o.Fa;_e||Se(),pe||(_e(),pe=!0),vt.add(u,o),o.v=0}}function fa(o){return o.g||o.u||3<=o.v?!1:(o.Y++,o.u=nt(y(o.Fa,o),Qc(o,o.v)),o.v++,!0)}n.Fa=function(){if(this.u=null,Gc(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var o=2*this.R;this.j.info("BP detection timer enabled: "+o),this.A=nt(y(this.ab,this),o)}},n.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,me(10),xi(this),Gc(this))};function pa(o){o.A!=null&&(l.clearTimeout(o.A),o.A=null)}function Gc(o){o.g=new gn(o,o.j,"rpc",o.Y),o.m===null&&(o.g.H=o.o),o.g.O=0;var u=Kt(o.qa);ye(u,"RID","rpc"),ye(u,"SID",o.K),ye(u,"AID",o.T),ye(u,"CI",o.F?"0":"1"),!o.F&&o.ja&&ye(u,"TO",o.ja),ye(u,"TYPE","xmlhttp"),wr(o,u),o.m&&o.o&&da(u,o.m,o.o),o.L&&(o.g.I=o.L);var h=o.g;o=o.ia,h.L=1,h.v=Ei(Kt(u)),h.m=null,h.P=!0,bc(h,o)}n.Za=function(){this.C!=null&&(this.C=null,xi(this),fa(this),me(19))};function Ri(o){o.C!=null&&(l.clearTimeout(o.C),o.C=null)}function Kc(o,u){var h=null;if(o.g==u){Ri(o),pa(o),o.g=null;var p=2}else if(ca(o.h,u))h=u.D,Ac(o.h,u),p=1;else return;if(o.G!=0){if(u.o)if(p==1){h=u.m?u.m.length:0,u=Date.now()-u.F;var P=o.B;p=te(),De(p,new Ae(p,h)),Ai(o)}else Yc(o);else if(P=u.s,P==3||P==0&&0<u.X||!(p==1&&Jp(o,u)||p==2&&fa(o)))switch(h&&0<h.length&&(u=o.h,u.i=u.i.concat(h)),P){case 1:Gn(o,5);break;case 4:Gn(o,10);break;case 3:Gn(o,6);break;default:Gn(o,2)}}}function Qc(o,u){let h=o.Ta+Math.floor(Math.random()*o.cb);return o.isActive()||(h*=2),h*u}function Gn(o,u){if(o.j.info("Error code "+u),u==2){var h=y(o.fb,o),p=o.Xa;const P=!p;p=new Yn(p||"//www.google.com/images/cleardot.gif"),l.location&&l.location.protocol=="http"||wi(p,"https"),Ei(p),P?Hp(p.toString(),h):jp(p.toString(),h)}else me(2);o.G=0,o.l&&o.l.sa(u),Jc(o),Hc(o)}n.fb=function(o){o?(this.j.info("Successfully pinged google.com"),me(2)):(this.j.info("Failed to ping google.com"),me(1))};function Jc(o){if(o.G=0,o.ka=[],o.l){const u=Rc(o.h);(u.length!=0||o.i.length!=0)&&(x(o.ka,u),x(o.ka,o.i),o.h.i.length=0,R(o.i),o.i.length=0),o.l.ra()}}function Xc(o,u,h){var p=h instanceof Yn?Kt(h):new Yn(h);if(p.g!="")u&&(p.g=u+"."+p.g),bi(p,p.s);else{var P=l.location;p=P.protocol,u=u?u+"."+P.hostname:P.hostname,P=+P.port;var k=new Yn(null);p&&wi(k,p),u&&(k.g=u),P&&bi(k,P),h&&(k.l=h),p=k}return h=o.D,u=o.ya,h&&u&&ye(p,h,u),ye(p,"VER",o.la),wr(o,p),p}function Zc(o,u,h){if(u&&!o.J)throw Error("Can't create secondary domain capable XhrIo object.");return u=o.Ca&&!o.pa?new Ie(new Ti({eb:h})):new Ie(o.pa),u.Ha(o.J),u}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function eu(){}n=eu.prototype,n.ua=function(){},n.ta=function(){},n.sa=function(){},n.ra=function(){},n.isActive=function(){return!0},n.Na=function(){};function Pi(){}Pi.prototype.g=function(o,u){return new mt(o,u)};function mt(o,u){Be.call(this),this.g=new qc(u),this.l=o,this.h=u&&u.messageUrlParams||null,o=u&&u.messageHeaders||null,u&&u.clientProtocolHeaderRequired&&(o?o["X-Client-Protocol"]="webchannel":o={"X-Client-Protocol":"webchannel"}),this.g.o=o,o=u&&u.initMessageHeaders||null,u&&u.messageContentType&&(o?o["X-WebChannel-Content-Type"]=u.messageContentType:o={"X-WebChannel-Content-Type":u.messageContentType}),u&&u.va&&(o?o["X-WebChannel-Client-Profile"]=u.va:o={"X-WebChannel-Client-Profile":u.va}),this.g.S=o,(o=u&&u.Sb)&&!M(o)&&(this.g.m=o),this.v=u&&u.supportsCrossDomainXhr||!1,this.u=u&&u.sendRawJson||!1,(u=u&&u.httpSessionIdParam)&&!M(u)&&(this.g.D=u,o=this.h,o!==null&&u in o&&(o=this.h,u in o&&delete o[u])),this.j=new Ss(this)}T(mt,Be),mt.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},mt.prototype.close=function(){ha(this.g)},mt.prototype.o=function(o){var u=this.g;if(typeof o=="string"){var h={};h.__data__=o,o=h}else this.u&&(h={},h.__data__=vs(o),o=h);u.i.push(new Np(u.Ya++,o)),u.G==3&&Ai(u)},mt.prototype.N=function(){this.g.l=null,delete this.j,ha(this.g),delete this.g,mt.aa.N.call(this)};function tu(o){ws.call(this),o.__headers__&&(this.headers=o.__headers__,this.statusCode=o.__status__,delete o.__headers__,delete o.__status__);var u=o.__sm__;if(u){e:{for(const h in u){o=h;break e}o=void 0}(this.i=o)&&(o=this.i,u=u!==null&&o in u?u[o]:void 0),this.data=u}else this.data=o}T(tu,ws);function nu(){bs.call(this),this.status=1}T(nu,bs);function Ss(o){this.g=o}T(Ss,eu),Ss.prototype.ua=function(){De(this.g,"a")},Ss.prototype.ta=function(o){De(this.g,new tu(o))},Ss.prototype.sa=function(o){De(this.g,new nu)},Ss.prototype.ra=function(){De(this.g,"b")},Pi.prototype.createWebChannel=Pi.prototype.g,mt.prototype.send=mt.prototype.o,mt.prototype.open=mt.prototype.m,mt.prototype.close=mt.prototype.close,Ah=function(){return new Pi},xh=function(){return te()},Sh=Nt,qa={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},Ts.NO_ERROR=0,Ts.TIMEOUT=8,Ts.HTTP_ERROR=6,Ui=Ts,yi.COMPLETE="complete",Ih=yi,_s.EventType=jn,jn.OPEN="a",jn.CLOSE="b",jn.ERROR="c",jn.MESSAGE="d",Be.prototype.listen=Be.prototype.K,xr=_s,Ie.prototype.listenOnce=Ie.prototype.L,Ie.prototype.getLastError=Ie.prototype.Ka,Ie.prototype.getLastErrorCode=Ie.prototype.Ba,Ie.prototype.getStatus=Ie.prototype.Z,Ie.prototype.getResponseJson=Ie.prototype.Oa,Ie.prototype.getResponseText=Ie.prototype.oa,Ie.prototype.send=Ie.prototype.ea,Ie.prototype.setWithCredentials=Ie.prototype.Ha,Th=Ie}).apply(typeof Di<"u"?Di:typeof self<"u"?self:typeof window<"u"?window:{});const Lu="@firebase/firestore";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */let er="10.14.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const is=new hl("@firebase/firestore");function Er(){return is.logLevel}function U(n,...e){if(is.logLevel<=ie.DEBUG){const t=e.map(xl);is.debug(`Firestore (${er}): ${n}`,...t)}}function an(n,...e){if(is.logLevel<=ie.ERROR){const t=e.map(xl);is.error(`Firestore (${er}): ${n}`,...t)}}function qs(n,...e){if(is.logLevel<=ie.WARN){const t=e.map(xl);is.warn(`Firestore (${er}): ${n}`,...t)}}function xl(n){if(typeof n=="string")return n;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
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
 */function W(n="Unexpected state"){const e=`FIRESTORE (${er}) INTERNAL ASSERTION FAILED: `+n;throw an(e),new Error(e)}function ue(n,e){n||W()}function K(n,e){return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class Rh{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class h0{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(Xe.UNAUTHENTICATED))}shutdown(){}}class f0{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class p0{constructor(e){this.t=e,this.currentUser=Xe.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){ue(this.o===void 0);let s=this.i;const r=c=>this.i!==s?(s=this.i,t(c)):Promise.resolve();let i=new sn;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new sn,e.enqueueRetryable(()=>r(this.currentUser))};const a=()=>{const c=i;e.enqueueRetryable(async()=>{await c.promise,await r(this.currentUser)})},l=c=>{U("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=c,this.o&&(this.auth.addAuthTokenListener(this.o),a())};this.t.onInit(c=>l(c)),setTimeout(()=>{if(!this.auth){const c=this.t.getImmediate({optional:!0});c?l(c):(U("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new sn)}},0),a()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(s=>this.i!==e?(U("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):s?(ue(typeof s.accessToken=="string"),new Rh(s.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return ue(e===null||typeof e=="string"),new Xe(e)}}class m0{constructor(e,t,s){this.l=e,this.h=t,this.P=s,this.type="FirstParty",this.user=Xe.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class g0{constructor(e,t,s){this.l=e,this.h=t,this.P=s}getToken(){return Promise.resolve(new m0(this.l,this.h,this.P))}start(e,t){e.enqueueRetryable(()=>t(Xe.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class y0{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class v0{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,t){ue(this.o===void 0);const s=i=>{i.error!=null&&U("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const a=i.token!==this.R;return this.R=i.token,U("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?t(i.token):Promise.resolve()};this.o=i=>{e.enqueueRetryable(()=>s(i))};const r=i=>{U("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(i=>r(i)),setTimeout(()=>{if(!this.appCheck){const i=this.A.getImmediate({optional:!0});i?r(i):U("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(t=>t?(ue(typeof t.token=="string"),this.R=t.token,new y0(t.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _0(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let s=0;s<n;s++)t[s]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ph{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=Math.floor(256/e.length)*e.length;let s="";for(;s.length<20;){const r=_0(40);for(let i=0;i<r.length;++i)s.length<20&&r[i]<t&&(s+=e.charAt(r[i]%e.length))}return s}}function le(n,e){return n<e?-1:n>e?1:0}function Hs(n,e,t){return n.length===e.length&&n.every((s,r)=>t(s,e[r]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oe{constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new $(N.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new $(N.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<-62135596800)throw new $(N.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new $(N.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return Oe.fromMillis(Date.now())}static fromDate(e){return Oe.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),s=Math.floor(1e6*(e-1e3*t));return new Oe(t,s)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?le(this.nanoseconds,e.nanoseconds):le(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class G{constructor(e){this.timestamp=e}static fromTimestamp(e){return new G(e)}static min(){return new G(new Oe(0,0))}static max(){return new G(new Oe(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ur{constructor(e,t,s){t===void 0?t=0:t>e.length&&W(),s===void 0?s=e.length-t:s>e.length-t&&W(),this.segments=e,this.offset=t,this.len=s}get length(){return this.len}isEqual(e){return Ur.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof Ur?e.forEach(s=>{t.push(s)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,s=this.limit();t<s;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const s=Math.min(e.length,t.length);for(let r=0;r<s;r++){const i=e.get(r),a=t.get(r);if(i<a)return-1;if(i>a)return 1}return e.length<t.length?-1:e.length>t.length?1:0}}class ve extends Ur{construct(e,t,s){return new ve(e,t,s)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const s of e){if(s.indexOf("//")>=0)throw new $(N.INVALID_ARGUMENT,`Invalid segment (${s}). Paths must not contain // in them.`);t.push(...s.split("/").filter(r=>r.length>0))}return new ve(t)}static emptyPath(){return new ve([])}}const w0=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class He extends Ur{construct(e,t,s){return new He(e,t,s)}static isValidIdentifier(e){return w0.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),He.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new He(["__name__"])}static fromServerFormat(e){const t=[];let s="",r=0;const i=()=>{if(s.length===0)throw new $(N.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(s),s=""};let a=!1;for(;r<e.length;){const l=e[r];if(l==="\\"){if(r+1===e.length)throw new $(N.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const c=e[r+1];if(c!=="\\"&&c!=="."&&c!=="`")throw new $(N.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);s+=c,r+=2}else l==="`"?(a=!a,r++):l!=="."||a?(s+=l,r++):(i(),r++)}if(i(),a)throw new $(N.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new He(t)}static emptyPath(){return new He([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class q{constructor(e){this.path=e}static fromPath(e){return new q(ve.fromString(e))}static fromName(e){return new q(ve.fromString(e).popFirst(5))}static empty(){return new q(ve.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&ve.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return ve.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new q(new ve(e.slice()))}}function b0(n,e){const t=n.toTimestamp().seconds,s=n.toTimestamp().nanoseconds+1,r=G.fromTimestamp(s===1e9?new Oe(t+1,0):new Oe(t,s));return new On(r,q.empty(),e)}function E0(n){return new On(n.readTime,n.key,-1)}class On{constructor(e,t,s){this.readTime=e,this.documentKey=t,this.largestBatchId=s}static min(){return new On(G.min(),q.empty(),-1)}static max(){return new On(G.max(),q.empty(),-1)}}function T0(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=q.comparator(n.documentKey,e.documentKey),t!==0?t:le(n.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const I0="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class S0{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ri(n){if(n.code!==N.FAILED_PRECONDITION||n.message!==I0)throw n;U("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class L{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)},t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&W(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new L((s,r)=>{this.nextCallback=i=>{this.wrapSuccess(e,i).next(s,r)},this.catchCallback=i=>{this.wrapFailure(t,i).next(s,r)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{const t=e();return t instanceof L?t:L.resolve(t)}catch(t){return L.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):L.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):L.reject(t)}static resolve(e){return new L((t,s)=>{t(e)})}static reject(e){return new L((t,s)=>{s(e)})}static waitFor(e){return new L((t,s)=>{let r=0,i=0,a=!1;e.forEach(l=>{++r,l.next(()=>{++i,a&&i===r&&t()},c=>s(c))}),a=!0,i===r&&t()})}static or(e){let t=L.resolve(!1);for(const s of e)t=t.next(r=>r?L.resolve(r):s());return t}static forEach(e,t){const s=[];return e.forEach((r,i)=>{s.push(t.call(this,r,i))}),this.waitFor(s)}static mapArray(e,t){return new L((s,r)=>{const i=e.length,a=new Array(i);let l=0;for(let c=0;c<i;c++){const d=c;t(e[d]).next(f=>{a[d]=f,++l,l===i&&s(a)},f=>r(f))}})}static doWhile(e,t){return new L((s,r)=>{const i=()=>{e()===!0?t().next(()=>{i()},r):s()};i()})}}function x0(n){const e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function ii(n){return n.name==="IndexedDbTransactionError"}/**
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
 */class Al{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=s=>this.ie(s),this.se=s=>t.writeSequenceNumber(s))}ie(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.se&&this.se(e),e}}Al.oe=-1;function To(n){return n==null}function ro(n){return n===0&&1/n==-1/0}function A0(n){return typeof n=="number"&&Number.isInteger(n)&&!ro(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ou(n){let e=0;for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function ds(n,e){for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function Ch(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class be{constructor(e,t){this.comparator=e,this.root=t||qe.EMPTY}insert(e,t){return new be(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,qe.BLACK,null,null))}remove(e){return new be(this.comparator,this.root.remove(e,this.comparator).copy(null,null,qe.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const s=this.comparator(e,t.key);if(s===0)return t.value;s<0?t=t.left:s>0&&(t=t.right)}return null}indexOf(e){let t=0,s=this.root;for(;!s.isEmpty();){const r=this.comparator(e,s.key);if(r===0)return t+s.left.size;r<0?s=s.left:(t+=s.left.size+1,s=s.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,s)=>(e(t,s),!1))}toString(){const e=[];return this.inorderTraversal((t,s)=>(e.push(`${t}:${s}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Ni(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Ni(this.root,e,this.comparator,!1)}getReverseIterator(){return new Ni(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Ni(this.root,e,this.comparator,!0)}}class Ni{constructor(e,t,s,r){this.isReverse=r,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?s(e.key,t):1,t&&r&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class qe{constructor(e,t,s,r,i){this.key=e,this.value=t,this.color=s??qe.RED,this.left=r??qe.EMPTY,this.right=i??qe.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,s,r,i){return new qe(e??this.key,t??this.value,s??this.color,r??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,s){let r=this;const i=s(e,r.key);return r=i<0?r.copy(null,null,null,r.left.insert(e,t,s),null):i===0?r.copy(null,t,null,null,null):r.copy(null,null,null,null,r.right.insert(e,t,s)),r.fixUp()}removeMin(){if(this.left.isEmpty())return qe.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let s,r=this;if(t(e,r.key)<0)r.left.isEmpty()||r.left.isRed()||r.left.left.isRed()||(r=r.moveRedLeft()),r=r.copy(null,null,null,r.left.remove(e,t),null);else{if(r.left.isRed()&&(r=r.rotateRight()),r.right.isEmpty()||r.right.isRed()||r.right.left.isRed()||(r=r.moveRedRight()),t(e,r.key)===0){if(r.right.isEmpty())return qe.EMPTY;s=r.right.min(),r=r.copy(s.key,s.value,null,null,r.right.removeMin())}r=r.copy(null,null,null,null,r.right.remove(e,t))}return r.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,qe.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,qe.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw W();const e=this.left.check();if(e!==this.right.check())throw W();return e+(this.isRed()?0:1)}}qe.EMPTY=null,qe.RED=!0,qe.BLACK=!1;qe.EMPTY=new class{constructor(){this.size=0}get key(){throw W()}get value(){throw W()}get color(){throw W()}get left(){throw W()}get right(){throw W()}copy(e,t,s,r,i){return this}insert(e,t,s){return new qe(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class je{constructor(e){this.comparator=e,this.data=new be(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,s)=>(e(t),!1))}forEachInRange(e,t){const s=this.data.getIteratorFrom(e[0]);for(;s.hasNext();){const r=s.getNext();if(this.comparator(r.key,e[1])>=0)return;t(r.key)}}forEachWhile(e,t){let s;for(s=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();s.hasNext();)if(!e(s.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Vu(this.data.getIterator())}getIteratorFrom(e){return new Vu(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(s=>{t=t.add(s)}),t}isEqual(e){if(!(e instanceof je)||this.size!==e.size)return!1;const t=this.data.getIterator(),s=e.data.getIterator();for(;t.hasNext();){const r=t.getNext().key,i=s.getNext().key;if(this.comparator(r,i)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(t=>{e.push(t)}),e}toString(){const e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){const t=new je(this.comparator);return t.data=e,t}}class Vu{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gt{constructor(e){this.fields=e,e.sort(He.comparator)}static empty(){return new gt([])}unionWith(e){let t=new je(He.comparator);for(const s of this.fields)t=t.add(s);for(const s of e)t=t.add(s);return new gt(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Hs(this.fields,e.fields,(t,s)=>t.isEqual(s))}}/**
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
 */class kh extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class We{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(r){try{return atob(r)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new kh("Invalid base64 string: "+i):i}}(e);return new We(t)}static fromUint8Array(e){const t=function(r){let i="";for(let a=0;a<r.length;++a)i+=String.fromCharCode(r[a]);return i}(e);return new We(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(t){return btoa(t)}(this.binaryString)}toUint8Array(){return function(t){const s=new Uint8Array(t.length);for(let r=0;r<t.length;r++)s[r]=t.charCodeAt(r);return s}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return le(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}We.EMPTY_BYTE_STRING=new We("");const R0=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Vn(n){if(ue(!!n),typeof n=="string"){let e=0;const t=R0.exec(n);if(ue(!!t),t[1]){let r=t[1];r=(r+"000000000").substr(0,9),e=Number(r)}const s=new Date(n);return{seconds:Math.floor(s.getTime()/1e3),nanos:e}}return{seconds:Re(n.seconds),nanos:Re(n.nanos)}}function Re(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function os(n){return typeof n=="string"?We.fromBase64String(n):We.fromUint8Array(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rl(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="server_timestamp"}function Pl(n){const e=n.mapValue.fields.__previous_value__;return Rl(e)?Pl(e):e}function $r(n){const e=Vn(n.mapValue.fields.__local_write_time__.timestampValue);return new Oe(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class P0{constructor(e,t,s,r,i,a,l,c,d){this.databaseId=e,this.appId=t,this.persistenceKey=s,this.host=r,this.ssl=i,this.forceLongPolling=a,this.autoDetectLongPolling=l,this.longPollingOptions=c,this.useFetchStreams=d}}class qr{constructor(e,t){this.projectId=e,this.database=t||"(default)"}static empty(){return new qr("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof qr&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Li={mapValue:{}};function as(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?Rl(n)?4:k0(n)?9007199254740991:C0(n)?10:11:W()}function zt(n,e){if(n===e)return!0;const t=as(n);if(t!==as(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return $r(n).isEqual($r(e));case 3:return function(r,i){if(typeof r.timestampValue=="string"&&typeof i.timestampValue=="string"&&r.timestampValue.length===i.timestampValue.length)return r.timestampValue===i.timestampValue;const a=Vn(r.timestampValue),l=Vn(i.timestampValue);return a.seconds===l.seconds&&a.nanos===l.nanos}(n,e);case 5:return n.stringValue===e.stringValue;case 6:return function(r,i){return os(r.bytesValue).isEqual(os(i.bytesValue))}(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return function(r,i){return Re(r.geoPointValue.latitude)===Re(i.geoPointValue.latitude)&&Re(r.geoPointValue.longitude)===Re(i.geoPointValue.longitude)}(n,e);case 2:return function(r,i){if("integerValue"in r&&"integerValue"in i)return Re(r.integerValue)===Re(i.integerValue);if("doubleValue"in r&&"doubleValue"in i){const a=Re(r.doubleValue),l=Re(i.doubleValue);return a===l?ro(a)===ro(l):isNaN(a)&&isNaN(l)}return!1}(n,e);case 9:return Hs(n.arrayValue.values||[],e.arrayValue.values||[],zt);case 10:case 11:return function(r,i){const a=r.mapValue.fields||{},l=i.mapValue.fields||{};if(Ou(a)!==Ou(l))return!1;for(const c in a)if(a.hasOwnProperty(c)&&(l[c]===void 0||!zt(a[c],l[c])))return!1;return!0}(n,e);default:return W()}}function Hr(n,e){return(n.values||[]).find(t=>zt(t,e))!==void 0}function js(n,e){if(n===e)return 0;const t=as(n),s=as(e);if(t!==s)return le(t,s);switch(t){case 0:case 9007199254740991:return 0;case 1:return le(n.booleanValue,e.booleanValue);case 2:return function(i,a){const l=Re(i.integerValue||i.doubleValue),c=Re(a.integerValue||a.doubleValue);return l<c?-1:l>c?1:l===c?0:isNaN(l)?isNaN(c)?0:-1:1}(n,e);case 3:return Bu(n.timestampValue,e.timestampValue);case 4:return Bu($r(n),$r(e));case 5:return le(n.stringValue,e.stringValue);case 6:return function(i,a){const l=os(i),c=os(a);return l.compareTo(c)}(n.bytesValue,e.bytesValue);case 7:return function(i,a){const l=i.split("/"),c=a.split("/");for(let d=0;d<l.length&&d<c.length;d++){const f=le(l[d],c[d]);if(f!==0)return f}return le(l.length,c.length)}(n.referenceValue,e.referenceValue);case 8:return function(i,a){const l=le(Re(i.latitude),Re(a.latitude));return l!==0?l:le(Re(i.longitude),Re(a.longitude))}(n.geoPointValue,e.geoPointValue);case 9:return Fu(n.arrayValue,e.arrayValue);case 10:return function(i,a){var l,c,d,f;const m=i.fields||{},y=a.fields||{},b=(l=m.value)===null||l===void 0?void 0:l.arrayValue,T=(c=y.value)===null||c===void 0?void 0:c.arrayValue,R=le(((d=b==null?void 0:b.values)===null||d===void 0?void 0:d.length)||0,((f=T==null?void 0:T.values)===null||f===void 0?void 0:f.length)||0);return R!==0?R:Fu(b,T)}(n.mapValue,e.mapValue);case 11:return function(i,a){if(i===Li.mapValue&&a===Li.mapValue)return 0;if(i===Li.mapValue)return 1;if(a===Li.mapValue)return-1;const l=i.fields||{},c=Object.keys(l),d=a.fields||{},f=Object.keys(d);c.sort(),f.sort();for(let m=0;m<c.length&&m<f.length;++m){const y=le(c[m],f[m]);if(y!==0)return y;const b=js(l[c[m]],d[f[m]]);if(b!==0)return b}return le(c.length,f.length)}(n.mapValue,e.mapValue);default:throw W()}}function Bu(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return le(n,e);const t=Vn(n),s=Vn(e),r=le(t.seconds,s.seconds);return r!==0?r:le(t.nanos,s.nanos)}function Fu(n,e){const t=n.values||[],s=e.values||[];for(let r=0;r<t.length&&r<s.length;++r){const i=js(t[r],s[r]);if(i)return i}return le(t.length,s.length)}function Ws(n){return Ha(n)}function Ha(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?function(t){const s=Vn(t);return`time(${s.seconds},${s.nanos})`}(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?function(t){return os(t).toBase64()}(n.bytesValue):"referenceValue"in n?function(t){return q.fromName(t).toString()}(n.referenceValue):"geoPointValue"in n?function(t){return`geo(${t.latitude},${t.longitude})`}(n.geoPointValue):"arrayValue"in n?function(t){let s="[",r=!0;for(const i of t.values||[])r?r=!1:s+=",",s+=Ha(i);return s+"]"}(n.arrayValue):"mapValue"in n?function(t){const s=Object.keys(t.fields||{}).sort();let r="{",i=!0;for(const a of s)i?i=!1:r+=",",r+=`${a}:${Ha(t.fields[a])}`;return r+"}"}(n.mapValue):W()}function ja(n){return!!n&&"integerValue"in n}function Cl(n){return!!n&&"arrayValue"in n}function zu(n){return!!n&&"nullValue"in n}function Uu(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function $i(n){return!!n&&"mapValue"in n}function C0(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="__vector__"}function Mr(n){if(n.geoPointValue)return{geoPointValue:Object.assign({},n.geoPointValue)};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:Object.assign({},n.timestampValue)};if(n.mapValue){const e={mapValue:{fields:{}}};return ds(n.mapValue.fields,(t,s)=>e.mapValue.fields[t]=Mr(s)),e}if(n.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Mr(n.arrayValue.values[t]);return e}return Object.assign({},n)}function k0(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lt{constructor(e){this.value=e}static empty(){return new lt({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let s=0;s<e.length-1;++s)if(t=(t.mapValue.fields||{})[e.get(s)],!$i(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Mr(t)}setAll(e){let t=He.emptyPath(),s={},r=[];e.forEach((a,l)=>{if(!t.isImmediateParentOf(l)){const c=this.getFieldsMap(t);this.applyChanges(c,s,r),s={},r=[],t=l.popLast()}a?s[l.lastSegment()]=Mr(a):r.push(l.lastSegment())});const i=this.getFieldsMap(t);this.applyChanges(i,s,r)}delete(e){const t=this.field(e.popLast());$i(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return zt(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let s=0;s<e.length;++s){let r=t.mapValue.fields[e.get(s)];$i(r)&&r.mapValue.fields||(r={mapValue:{fields:{}}},t.mapValue.fields[e.get(s)]=r),t=r}return t.mapValue.fields}applyChanges(e,t,s){ds(t,(r,i)=>e[r]=i);for(const r of s)delete e[r]}clone(){return new lt(Mr(this.value))}}function Mh(n){const e=[];return ds(n.fields,(t,s)=>{const r=new He([t]);if($i(s)){const i=Mh(s.mapValue).fields;if(i.length===0)e.push(r);else for(const a of i)e.push(r.child(a))}else e.push(r)}),new gt(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ze{constructor(e,t,s,r,i,a,l){this.key=e,this.documentType=t,this.version=s,this.readTime=r,this.createTime=i,this.data=a,this.documentState=l}static newInvalidDocument(e){return new Ze(e,0,G.min(),G.min(),G.min(),lt.empty(),0)}static newFoundDocument(e,t,s,r){return new Ze(e,1,t,G.min(),s,r,0)}static newNoDocument(e,t){return new Ze(e,2,t,G.min(),G.min(),lt.empty(),0)}static newUnknownDocument(e,t){return new Ze(e,3,t,G.min(),G.min(),lt.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(G.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=lt.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=lt.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=G.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof Ze&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Ze(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class io{constructor(e,t){this.position=e,this.inclusive=t}}function $u(n,e,t){let s=0;for(let r=0;r<n.position.length;r++){const i=e[r],a=n.position[r];if(i.field.isKeyField()?s=q.comparator(q.fromName(a.referenceValue),t.key):s=js(a,t.data.field(i.field)),i.dir==="desc"&&(s*=-1),s!==0)break}return s}function qu(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!zt(n.position[t],e.position[t]))return!1;return!0}/**
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
 */class oo{constructor(e,t="asc"){this.field=e,this.dir=t}}function M0(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}/**
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
 */class Dh{}class Le extends Dh{constructor(e,t,s){super(),this.field=e,this.op=t,this.value=s}static create(e,t,s){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,s):new N0(e,t,s):t==="array-contains"?new V0(e,s):t==="in"?new B0(e,s):t==="not-in"?new F0(e,s):t==="array-contains-any"?new z0(e,s):new Le(e,t,s)}static createKeyFieldInFilter(e,t,s){return t==="in"?new L0(e,s):new O0(e,s)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&this.matchesComparison(js(t,this.value)):t!==null&&as(this.value)===as(t)&&this.matchesComparison(js(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return W()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Ut extends Dh{constructor(e,t){super(),this.filters=e,this.op=t,this.ae=null}static create(e,t){return new Ut(e,t)}matches(e){return Nh(this)?this.filters.find(t=>!t.matches(e))===void 0:this.filters.find(t=>t.matches(e))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function Nh(n){return n.op==="and"}function Lh(n){return D0(n)&&Nh(n)}function D0(n){for(const e of n.filters)if(e instanceof Ut)return!1;return!0}function Wa(n){if(n instanceof Le)return n.field.canonicalString()+n.op.toString()+Ws(n.value);if(Lh(n))return n.filters.map(e=>Wa(e)).join(",");{const e=n.filters.map(t=>Wa(t)).join(",");return`${n.op}(${e})`}}function Oh(n,e){return n instanceof Le?function(s,r){return r instanceof Le&&s.op===r.op&&s.field.isEqual(r.field)&&zt(s.value,r.value)}(n,e):n instanceof Ut?function(s,r){return r instanceof Ut&&s.op===r.op&&s.filters.length===r.filters.length?s.filters.reduce((i,a,l)=>i&&Oh(a,r.filters[l]),!0):!1}(n,e):void W()}function Vh(n){return n instanceof Le?function(t){return`${t.field.canonicalString()} ${t.op} ${Ws(t.value)}`}(n):n instanceof Ut?function(t){return t.op.toString()+" {"+t.getFilters().map(Vh).join(" ,")+"}"}(n):"Filter"}class N0 extends Le{constructor(e,t,s){super(e,t,s),this.key=q.fromName(s.referenceValue)}matches(e){const t=q.comparator(e.key,this.key);return this.matchesComparison(t)}}class L0 extends Le{constructor(e,t){super(e,"in",t),this.keys=Bh("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class O0 extends Le{constructor(e,t){super(e,"not-in",t),this.keys=Bh("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function Bh(n,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map(s=>q.fromName(s.referenceValue))}class V0 extends Le{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return Cl(t)&&Hr(t.arrayValue,this.value)}}class B0 extends Le{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&Hr(this.value.arrayValue,t)}}class F0 extends Le{constructor(e,t){super(e,"not-in",t)}matches(e){if(Hr(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&!Hr(this.value.arrayValue,t)}}class z0 extends Le{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!Cl(t)||!t.arrayValue.values)&&t.arrayValue.values.some(s=>Hr(this.value.arrayValue,s))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class U0{constructor(e,t=null,s=[],r=[],i=null,a=null,l=null){this.path=e,this.collectionGroup=t,this.orderBy=s,this.filters=r,this.limit=i,this.startAt=a,this.endAt=l,this.ue=null}}function Hu(n,e=null,t=[],s=[],r=null,i=null,a=null){return new U0(n,e,t,s,r,i,a)}function kl(n){const e=K(n);if(e.ue===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map(s=>Wa(s)).join(","),t+="|ob:",t+=e.orderBy.map(s=>function(i){return i.field.canonicalString()+i.dir}(s)).join(","),To(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map(s=>Ws(s)).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map(s=>Ws(s)).join(",")),e.ue=t}return e.ue}function Ml(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!M0(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!Oh(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!qu(n.startAt,e.startAt)&&qu(n.endAt,e.endAt)}function Ya(n){return q.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Io{constructor(e,t=null,s=[],r=[],i=null,a="F",l=null,c=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=s,this.filters=r,this.limit=i,this.limitType=a,this.startAt=l,this.endAt=c,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function $0(n,e,t,s,r,i,a,l){return new Io(n,e,t,s,r,i,a,l)}function Dl(n){return new Io(n)}function ju(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function q0(n){return n.collectionGroup!==null}function Dr(n){const e=K(n);if(e.ce===null){e.ce=[];const t=new Set;for(const i of e.explicitOrderBy)e.ce.push(i),t.add(i.field.canonicalString());const s=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(a){let l=new je(He.comparator);return a.filters.forEach(c=>{c.getFlattenedFilters().forEach(d=>{d.isInequality()&&(l=l.add(d.field))})}),l})(e).forEach(i=>{t.has(i.canonicalString())||i.isKeyField()||e.ce.push(new oo(i,s))}),t.has(He.keyField().canonicalString())||e.ce.push(new oo(He.keyField(),s))}return e.ce}function Bt(n){const e=K(n);return e.le||(e.le=H0(e,Dr(n))),e.le}function H0(n,e){if(n.limitType==="F")return Hu(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map(r=>{const i=r.dir==="desc"?"asc":"desc";return new oo(r.field,i)});const t=n.endAt?new io(n.endAt.position,n.endAt.inclusive):null,s=n.startAt?new io(n.startAt.position,n.startAt.inclusive):null;return Hu(n.path,n.collectionGroup,e,n.filters,n.limit,t,s)}}function Ga(n,e,t){return new Io(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function So(n,e){return Ml(Bt(n),Bt(e))&&n.limitType===e.limitType}function Fh(n){return`${kl(Bt(n))}|lt:${n.limitType}`}function Ps(n){return`Query(target=${function(t){let s=t.path.canonicalString();return t.collectionGroup!==null&&(s+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(s+=`, filters: [${t.filters.map(r=>Vh(r)).join(", ")}]`),To(t.limit)||(s+=", limit: "+t.limit),t.orderBy.length>0&&(s+=`, orderBy: [${t.orderBy.map(r=>function(a){return`${a.field.canonicalString()} (${a.dir})`}(r)).join(", ")}]`),t.startAt&&(s+=", startAt: ",s+=t.startAt.inclusive?"b:":"a:",s+=t.startAt.position.map(r=>Ws(r)).join(",")),t.endAt&&(s+=", endAt: ",s+=t.endAt.inclusive?"a:":"b:",s+=t.endAt.position.map(r=>Ws(r)).join(",")),`Target(${s})`}(Bt(n))}; limitType=${n.limitType})`}function xo(n,e){return e.isFoundDocument()&&function(s,r){const i=r.key.path;return s.collectionGroup!==null?r.key.hasCollectionId(s.collectionGroup)&&s.path.isPrefixOf(i):q.isDocumentKey(s.path)?s.path.isEqual(i):s.path.isImmediateParentOf(i)}(n,e)&&function(s,r){for(const i of Dr(s))if(!i.field.isKeyField()&&r.data.field(i.field)===null)return!1;return!0}(n,e)&&function(s,r){for(const i of s.filters)if(!i.matches(r))return!1;return!0}(n,e)&&function(s,r){return!(s.startAt&&!function(a,l,c){const d=$u(a,l,c);return a.inclusive?d<=0:d<0}(s.startAt,Dr(s),r)||s.endAt&&!function(a,l,c){const d=$u(a,l,c);return a.inclusive?d>=0:d>0}(s.endAt,Dr(s),r))}(n,e)}function j0(n){return n.collectionGroup||(n.path.length%2==1?n.path.lastSegment():n.path.get(n.path.length-2))}function zh(n){return(e,t)=>{let s=!1;for(const r of Dr(n)){const i=W0(r,e,t);if(i!==0)return i;s=s||r.field.isKeyField()}return 0}}function W0(n,e,t){const s=n.field.isKeyField()?q.comparator(e.key,t.key):function(i,a,l){const c=a.data.field(i),d=l.data.field(i);return c!==null&&d!==null?js(c,d):W()}(n.field,e,t);switch(n.dir){case"asc":return s;case"desc":return-1*s;default:return W()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tr{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),s=this.inner[t];if(s!==void 0){for(const[r,i]of s)if(this.equalsFn(r,e))return i}}has(e){return this.get(e)!==void 0}set(e,t){const s=this.mapKeyFn(e),r=this.inner[s];if(r===void 0)return this.inner[s]=[[e,t]],void this.innerSize++;for(let i=0;i<r.length;i++)if(this.equalsFn(r[i][0],e))return void(r[i]=[e,t]);r.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),s=this.inner[t];if(s===void 0)return!1;for(let r=0;r<s.length;r++)if(this.equalsFn(s[r][0],e))return s.length===1?delete this.inner[t]:s.splice(r,1),this.innerSize--,!0;return!1}forEach(e){ds(this.inner,(t,s)=>{for(const[r,i]of s)e(r,i)})}isEmpty(){return Ch(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Y0=new be(q.comparator);function ln(){return Y0}const Uh=new be(q.comparator);function Ar(...n){let e=Uh;for(const t of n)e=e.insert(t.key,t);return e}function $h(n){let e=Uh;return n.forEach((t,s)=>e=e.insert(t,s.overlayedDocument)),e}function Xn(){return Nr()}function qh(){return Nr()}function Nr(){return new tr(n=>n.toString(),(n,e)=>n.isEqual(e))}const G0=new be(q.comparator),K0=new je(q.comparator);function se(...n){let e=K0;for(const t of n)e=e.add(t);return e}const Q0=new je(le);function J0(){return Q0}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Nl(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:ro(e)?"-0":e}}function Hh(n){return{integerValue:""+n}}function X0(n,e){return A0(e)?Hh(e):Nl(n,e)}/**
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
 */class Ao{constructor(){this._=void 0}}function Z0(n,e,t){return n instanceof ao?function(r,i){const a={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:r.seconds,nanos:r.nanoseconds}}}};return i&&Rl(i)&&(i=Pl(i)),i&&(a.fields.__previous_value__=i),{mapValue:a}}(t,e):n instanceof jr?Wh(n,e):n instanceof Wr?Yh(n,e):function(r,i){const a=jh(r,i),l=Wu(a)+Wu(r.Pe);return ja(a)&&ja(r.Pe)?Hh(l):Nl(r.serializer,l)}(n,e)}function e_(n,e,t){return n instanceof jr?Wh(n,e):n instanceof Wr?Yh(n,e):t}function jh(n,e){return n instanceof lo?function(s){return ja(s)||function(i){return!!i&&"doubleValue"in i}(s)}(e)?e:{integerValue:0}:null}class ao extends Ao{}class jr extends Ao{constructor(e){super(),this.elements=e}}function Wh(n,e){const t=Gh(e);for(const s of n.elements)t.some(r=>zt(r,s))||t.push(s);return{arrayValue:{values:t}}}class Wr extends Ao{constructor(e){super(),this.elements=e}}function Yh(n,e){let t=Gh(e);for(const s of n.elements)t=t.filter(r=>!zt(r,s));return{arrayValue:{values:t}}}class lo extends Ao{constructor(e,t){super(),this.serializer=e,this.Pe=t}}function Wu(n){return Re(n.integerValue||n.doubleValue)}function Gh(n){return Cl(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}function t_(n,e){return n.field.isEqual(e.field)&&function(s,r){return s instanceof jr&&r instanceof jr||s instanceof Wr&&r instanceof Wr?Hs(s.elements,r.elements,zt):s instanceof lo&&r instanceof lo?zt(s.Pe,r.Pe):s instanceof ao&&r instanceof ao}(n.transform,e.transform)}class n_{constructor(e,t){this.version=e,this.transformResults=t}}class rt{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new rt}static exists(e){return new rt(void 0,e)}static updateTime(e){return new rt(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function qi(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}class Ro{}function Kh(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new Po(n.key,rt.none()):new oi(n.key,n.data,rt.none());{const t=n.data,s=lt.empty();let r=new je(He.comparator);for(let i of e.fields)if(!r.has(i)){let a=t.field(i);a===null&&i.length>1&&(i=i.popLast(),a=t.field(i)),a===null?s.delete(i):s.set(i,a),r=r.add(i)}return new zn(n.key,s,new gt(r.toArray()),rt.none())}}function s_(n,e,t){n instanceof oi?function(r,i,a){const l=r.value.clone(),c=Gu(r.fieldTransforms,i,a.transformResults);l.setAll(c),i.convertToFoundDocument(a.version,l).setHasCommittedMutations()}(n,e,t):n instanceof zn?function(r,i,a){if(!qi(r.precondition,i))return void i.convertToUnknownDocument(a.version);const l=Gu(r.fieldTransforms,i,a.transformResults),c=i.data;c.setAll(Qh(r)),c.setAll(l),i.convertToFoundDocument(a.version,c).setHasCommittedMutations()}(n,e,t):function(r,i,a){i.convertToNoDocument(a.version).setHasCommittedMutations()}(0,e,t)}function Lr(n,e,t,s){return n instanceof oi?function(i,a,l,c){if(!qi(i.precondition,a))return l;const d=i.value.clone(),f=Ku(i.fieldTransforms,c,a);return d.setAll(f),a.convertToFoundDocument(a.version,d).setHasLocalMutations(),null}(n,e,t,s):n instanceof zn?function(i,a,l,c){if(!qi(i.precondition,a))return l;const d=Ku(i.fieldTransforms,c,a),f=a.data;return f.setAll(Qh(i)),f.setAll(d),a.convertToFoundDocument(a.version,f).setHasLocalMutations(),l===null?null:l.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map(m=>m.field))}(n,e,t,s):function(i,a,l){return qi(i.precondition,a)?(a.convertToNoDocument(a.version).setHasLocalMutations(),null):l}(n,e,t)}function r_(n,e){let t=null;for(const s of n.fieldTransforms){const r=e.data.field(s.field),i=jh(s.transform,r||null);i!=null&&(t===null&&(t=lt.empty()),t.set(s.field,i))}return t||null}function Yu(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!function(s,r){return s===void 0&&r===void 0||!(!s||!r)&&Hs(s,r,(i,a)=>t_(i,a))}(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}class oi extends Ro{constructor(e,t,s,r=[]){super(),this.key=e,this.value=t,this.precondition=s,this.fieldTransforms=r,this.type=0}getFieldMask(){return null}}class zn extends Ro{constructor(e,t,s,r,i=[]){super(),this.key=e,this.data=t,this.fieldMask=s,this.precondition=r,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function Qh(n){const e=new Map;return n.fieldMask.fields.forEach(t=>{if(!t.isEmpty()){const s=n.data.field(t);e.set(t,s)}}),e}function Gu(n,e,t){const s=new Map;ue(n.length===t.length);for(let r=0;r<t.length;r++){const i=n[r],a=i.transform,l=e.data.field(i.field);s.set(i.field,e_(a,l,t[r]))}return s}function Ku(n,e,t){const s=new Map;for(const r of n){const i=r.transform,a=t.data.field(r.field);s.set(r.field,Z0(i,a,e))}return s}class Po extends Ro{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class i_ extends Ro{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class o_{constructor(e,t,s,r){this.batchId=e,this.localWriteTime=t,this.baseMutations=s,this.mutations=r}applyToRemoteDocument(e,t){const s=t.mutationResults;for(let r=0;r<this.mutations.length;r++){const i=this.mutations[r];i.key.isEqual(e.key)&&s_(i,e,s[r])}}applyToLocalView(e,t){for(const s of this.baseMutations)s.key.isEqual(e.key)&&(t=Lr(s,e,t,this.localWriteTime));for(const s of this.mutations)s.key.isEqual(e.key)&&(t=Lr(s,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const s=qh();return this.mutations.forEach(r=>{const i=e.get(r.key),a=i.overlayedDocument;let l=this.applyToLocalView(a,i.mutatedFields);l=t.has(r.key)?null:l;const c=Kh(a,l);c!==null&&s.set(r.key,c),a.isValidDocument()||a.convertToNoDocument(G.min())}),s}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),se())}isEqual(e){return this.batchId===e.batchId&&Hs(this.mutations,e.mutations,(t,s)=>Yu(t,s))&&Hs(this.baseMutations,e.baseMutations,(t,s)=>Yu(t,s))}}class Ll{constructor(e,t,s,r){this.batch=e,this.commitVersion=t,this.mutationResults=s,this.docVersions=r}static from(e,t,s){ue(e.mutations.length===s.length);let r=function(){return G0}();const i=e.mutations;for(let a=0;a<i.length;a++)r=r.insert(i[a].key,s[a].version);return new Ll(e,t,s,r)}}/**
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
 */class a_{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
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
 */class l_{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Pe,oe;function c_(n){switch(n){default:return W();case N.CANCELLED:case N.UNKNOWN:case N.DEADLINE_EXCEEDED:case N.RESOURCE_EXHAUSTED:case N.INTERNAL:case N.UNAVAILABLE:case N.UNAUTHENTICATED:return!1;case N.INVALID_ARGUMENT:case N.NOT_FOUND:case N.ALREADY_EXISTS:case N.PERMISSION_DENIED:case N.FAILED_PRECONDITION:case N.ABORTED:case N.OUT_OF_RANGE:case N.UNIMPLEMENTED:case N.DATA_LOSS:return!0}}function Jh(n){if(n===void 0)return an("GRPC error has no .code"),N.UNKNOWN;switch(n){case Pe.OK:return N.OK;case Pe.CANCELLED:return N.CANCELLED;case Pe.UNKNOWN:return N.UNKNOWN;case Pe.DEADLINE_EXCEEDED:return N.DEADLINE_EXCEEDED;case Pe.RESOURCE_EXHAUSTED:return N.RESOURCE_EXHAUSTED;case Pe.INTERNAL:return N.INTERNAL;case Pe.UNAVAILABLE:return N.UNAVAILABLE;case Pe.UNAUTHENTICATED:return N.UNAUTHENTICATED;case Pe.INVALID_ARGUMENT:return N.INVALID_ARGUMENT;case Pe.NOT_FOUND:return N.NOT_FOUND;case Pe.ALREADY_EXISTS:return N.ALREADY_EXISTS;case Pe.PERMISSION_DENIED:return N.PERMISSION_DENIED;case Pe.FAILED_PRECONDITION:return N.FAILED_PRECONDITION;case Pe.ABORTED:return N.ABORTED;case Pe.OUT_OF_RANGE:return N.OUT_OF_RANGE;case Pe.UNIMPLEMENTED:return N.UNIMPLEMENTED;case Pe.DATA_LOSS:return N.DATA_LOSS;default:return W()}}(oe=Pe||(Pe={}))[oe.OK=0]="OK",oe[oe.CANCELLED=1]="CANCELLED",oe[oe.UNKNOWN=2]="UNKNOWN",oe[oe.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",oe[oe.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",oe[oe.NOT_FOUND=5]="NOT_FOUND",oe[oe.ALREADY_EXISTS=6]="ALREADY_EXISTS",oe[oe.PERMISSION_DENIED=7]="PERMISSION_DENIED",oe[oe.UNAUTHENTICATED=16]="UNAUTHENTICATED",oe[oe.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",oe[oe.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",oe[oe.ABORTED=10]="ABORTED",oe[oe.OUT_OF_RANGE=11]="OUT_OF_RANGE",oe[oe.UNIMPLEMENTED=12]="UNIMPLEMENTED",oe[oe.INTERNAL=13]="INTERNAL",oe[oe.UNAVAILABLE=14]="UNAVAILABLE",oe[oe.DATA_LOSS=15]="DATA_LOSS";/**
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
 */function u_(){return new TextEncoder}/**
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
 */const d_=new es([4294967295,4294967295],0);function Qu(n){const e=u_().encode(n),t=new Eh;return t.update(e),new Uint8Array(t.digest())}function Ju(n){const e=new DataView(n.buffer),t=e.getUint32(0,!0),s=e.getUint32(4,!0),r=e.getUint32(8,!0),i=e.getUint32(12,!0);return[new es([t,s],0),new es([r,i],0)]}class Ol{constructor(e,t,s){if(this.bitmap=e,this.padding=t,this.hashCount=s,t<0||t>=8)throw new Rr(`Invalid padding: ${t}`);if(s<0)throw new Rr(`Invalid hash count: ${s}`);if(e.length>0&&this.hashCount===0)throw new Rr(`Invalid hash count: ${s}`);if(e.length===0&&t!==0)throw new Rr(`Invalid padding when bitmap length is 0: ${t}`);this.Ie=8*e.length-t,this.Te=es.fromNumber(this.Ie)}Ee(e,t,s){let r=e.add(t.multiply(es.fromNumber(s)));return r.compare(d_)===1&&(r=new es([r.getBits(0),r.getBits(1)],0)),r.modulo(this.Te).toNumber()}de(e){return(this.bitmap[Math.floor(e/8)]&1<<e%8)!=0}mightContain(e){if(this.Ie===0)return!1;const t=Qu(e),[s,r]=Ju(t);for(let i=0;i<this.hashCount;i++){const a=this.Ee(s,r,i);if(!this.de(a))return!1}return!0}static create(e,t,s){const r=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),a=new Ol(i,r,t);return s.forEach(l=>a.insert(l)),a}insert(e){if(this.Ie===0)return;const t=Qu(e),[s,r]=Ju(t);for(let i=0;i<this.hashCount;i++){const a=this.Ee(s,r,i);this.Ae(a)}}Ae(e){const t=Math.floor(e/8),s=e%8;this.bitmap[t]|=1<<s}}class Rr extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Co{constructor(e,t,s,r,i){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=s,this.documentUpdates=r,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(e,t,s){const r=new Map;return r.set(e,ai.createSynthesizedTargetChangeForCurrentChange(e,t,s)),new Co(G.min(),r,new be(le),ln(),se())}}class ai{constructor(e,t,s,r,i){this.resumeToken=e,this.current=t,this.addedDocuments=s,this.modifiedDocuments=r,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,t,s){return new ai(s,t,se(),se(),se())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hi{constructor(e,t,s,r){this.Re=e,this.removedTargetIds=t,this.key=s,this.Ve=r}}class Xh{constructor(e,t){this.targetId=e,this.me=t}}class Zh{constructor(e,t,s=We.EMPTY_BYTE_STRING,r=null){this.state=e,this.targetIds=t,this.resumeToken=s,this.cause=r}}class Xu{constructor(){this.fe=0,this.ge=ed(),this.pe=We.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return this.fe!==0}get be(){return this.we}De(e){e.approximateByteSize()>0&&(this.we=!0,this.pe=e)}ve(){let e=se(),t=se(),s=se();return this.ge.forEach((r,i)=>{switch(i){case 0:e=e.add(r);break;case 2:t=t.add(r);break;case 1:s=s.add(r);break;default:W()}}),new ai(this.pe,this.ye,e,t,s)}Ce(){this.we=!1,this.ge=ed()}Fe(e,t){this.we=!0,this.ge=this.ge.insert(e,t)}Me(e){this.we=!0,this.ge=this.ge.remove(e)}xe(){this.fe+=1}Oe(){this.fe-=1,ue(this.fe>=0)}Ne(){this.we=!0,this.ye=!0}}class h_{constructor(e){this.Le=e,this.Be=new Map,this.ke=ln(),this.qe=Zu(),this.Qe=new be(le)}Ke(e){for(const t of e.Re)e.Ve&&e.Ve.isFoundDocument()?this.$e(t,e.Ve):this.Ue(t,e.key,e.Ve);for(const t of e.removedTargetIds)this.Ue(t,e.key,e.Ve)}We(e){this.forEachTarget(e,t=>{const s=this.Ge(t);switch(e.state){case 0:this.ze(t)&&s.De(e.resumeToken);break;case 1:s.Oe(),s.Se||s.Ce(),s.De(e.resumeToken);break;case 2:s.Oe(),s.Se||this.removeTarget(t);break;case 3:this.ze(t)&&(s.Ne(),s.De(e.resumeToken));break;case 4:this.ze(t)&&(this.je(t),s.De(e.resumeToken));break;default:W()}})}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Be.forEach((s,r)=>{this.ze(r)&&t(r)})}He(e){const t=e.targetId,s=e.me.count,r=this.Je(t);if(r){const i=r.target;if(Ya(i))if(s===0){const a=new q(i.path);this.Ue(t,a,Ze.newNoDocument(a,G.min()))}else ue(s===1);else{const a=this.Ye(t);if(a!==s){const l=this.Ze(e),c=l?this.Xe(l,e,a):1;if(c!==0){this.je(t);const d=c===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Qe=this.Qe.insert(t,d)}}}}}Ze(e){const t=e.me.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:s="",padding:r=0},hashCount:i=0}=t;let a,l;try{a=os(s).toUint8Array()}catch(c){if(c instanceof kh)return qs("Decoding the base64 bloom filter in existence filter failed ("+c.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw c}try{l=new Ol(a,r,i)}catch(c){return qs(c instanceof Rr?"BloomFilter error: ":"Applying bloom filter failed: ",c),null}return l.Ie===0?null:l}Xe(e,t,s){return t.me.count===s-this.nt(e,t.targetId)?0:2}nt(e,t){const s=this.Le.getRemoteKeysForTarget(t);let r=0;return s.forEach(i=>{const a=this.Le.tt(),l=`projects/${a.projectId}/databases/${a.database}/documents/${i.path.canonicalString()}`;e.mightContain(l)||(this.Ue(t,i,null),r++)}),r}rt(e){const t=new Map;this.Be.forEach((i,a)=>{const l=this.Je(a);if(l){if(i.current&&Ya(l.target)){const c=new q(l.target.path);this.ke.get(c)!==null||this.it(a,c)||this.Ue(a,c,Ze.newNoDocument(c,e))}i.be&&(t.set(a,i.ve()),i.Ce())}});let s=se();this.qe.forEach((i,a)=>{let l=!0;a.forEachWhile(c=>{const d=this.Je(c);return!d||d.purpose==="TargetPurposeLimboResolution"||(l=!1,!1)}),l&&(s=s.add(i))}),this.ke.forEach((i,a)=>a.setReadTime(e));const r=new Co(e,t,this.Qe,this.ke,s);return this.ke=ln(),this.qe=Zu(),this.Qe=new be(le),r}$e(e,t){if(!this.ze(e))return;const s=this.it(e,t.key)?2:0;this.Ge(e).Fe(t.key,s),this.ke=this.ke.insert(t.key,t),this.qe=this.qe.insert(t.key,this.st(t.key).add(e))}Ue(e,t,s){if(!this.ze(e))return;const r=this.Ge(e);this.it(e,t)?r.Fe(t,1):r.Me(t),this.qe=this.qe.insert(t,this.st(t).delete(e)),s&&(this.ke=this.ke.insert(t,s))}removeTarget(e){this.Be.delete(e)}Ye(e){const t=this.Ge(e).ve();return this.Le.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}xe(e){this.Ge(e).xe()}Ge(e){let t=this.Be.get(e);return t||(t=new Xu,this.Be.set(e,t)),t}st(e){let t=this.qe.get(e);return t||(t=new je(le),this.qe=this.qe.insert(e,t)),t}ze(e){const t=this.Je(e)!==null;return t||U("WatchChangeAggregator","Detected inactive target",e),t}Je(e){const t=this.Be.get(e);return t&&t.Se?null:this.Le.ot(e)}je(e){this.Be.set(e,new Xu),this.Le.getRemoteKeysForTarget(e).forEach(t=>{this.Ue(e,t,null)})}it(e,t){return this.Le.getRemoteKeysForTarget(e).has(t)}}function Zu(){return new be(q.comparator)}function ed(){return new be(q.comparator)}const f_={asc:"ASCENDING",desc:"DESCENDING"},p_={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},m_={and:"AND",or:"OR"};class g_{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function Ka(n,e){return n.useProto3Json||To(e)?e:{value:e}}function co(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function ef(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function y_(n,e){return co(n,e.toTimestamp())}function Ft(n){return ue(!!n),G.fromTimestamp(function(t){const s=Vn(t);return new Oe(s.seconds,s.nanos)}(n))}function Vl(n,e){return Qa(n,e).canonicalString()}function Qa(n,e){const t=function(r){return new ve(["projects",r.projectId,"databases",r.database])}(n).child("documents");return e===void 0?t:t.child(e)}function tf(n){const e=ve.fromString(n);return ue(af(e)),e}function Ja(n,e){return Vl(n.databaseId,e.path)}function Ia(n,e){const t=tf(e);if(t.get(1)!==n.databaseId.projectId)throw new $(N.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new $(N.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new q(sf(t))}function nf(n,e){return Vl(n.databaseId,e)}function v_(n){const e=tf(n);return e.length===4?ve.emptyPath():sf(e)}function Xa(n){return new ve(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function sf(n){return ue(n.length>4&&n.get(4)==="documents"),n.popFirst(5)}function td(n,e,t){return{name:Ja(n,e),fields:t.value.mapValue.fields}}function __(n,e){let t;if("targetChange"in e){e.targetChange;const s=function(d){return d==="NO_CHANGE"?0:d==="ADD"?1:d==="REMOVE"?2:d==="CURRENT"?3:d==="RESET"?4:W()}(e.targetChange.targetChangeType||"NO_CHANGE"),r=e.targetChange.targetIds||[],i=function(d,f){return d.useProto3Json?(ue(f===void 0||typeof f=="string"),We.fromBase64String(f||"")):(ue(f===void 0||f instanceof Buffer||f instanceof Uint8Array),We.fromUint8Array(f||new Uint8Array))}(n,e.targetChange.resumeToken),a=e.targetChange.cause,l=a&&function(d){const f=d.code===void 0?N.UNKNOWN:Jh(d.code);return new $(f,d.message||"")}(a);t=new Zh(s,r,i,l||null)}else if("documentChange"in e){e.documentChange;const s=e.documentChange;s.document,s.document.name,s.document.updateTime;const r=Ia(n,s.document.name),i=Ft(s.document.updateTime),a=s.document.createTime?Ft(s.document.createTime):G.min(),l=new lt({mapValue:{fields:s.document.fields}}),c=Ze.newFoundDocument(r,i,a,l),d=s.targetIds||[],f=s.removedTargetIds||[];t=new Hi(d,f,c.key,c)}else if("documentDelete"in e){e.documentDelete;const s=e.documentDelete;s.document;const r=Ia(n,s.document),i=s.readTime?Ft(s.readTime):G.min(),a=Ze.newNoDocument(r,i),l=s.removedTargetIds||[];t=new Hi([],l,a.key,a)}else if("documentRemove"in e){e.documentRemove;const s=e.documentRemove;s.document;const r=Ia(n,s.document),i=s.removedTargetIds||[];t=new Hi([],i,r,null)}else{if(!("filter"in e))return W();{e.filter;const s=e.filter;s.targetId;const{count:r=0,unchangedNames:i}=s,a=new l_(r,i),l=s.targetId;t=new Xh(l,a)}}return t}function w_(n,e){let t;if(e instanceof oi)t={update:td(n,e.key,e.value)};else if(e instanceof Po)t={delete:Ja(n,e.key)};else if(e instanceof zn)t={update:td(n,e.key,e.data),updateMask:P_(e.fieldMask)};else{if(!(e instanceof i_))return W();t={verify:Ja(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map(s=>function(i,a){const l=a.transform;if(l instanceof ao)return{fieldPath:a.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(l instanceof jr)return{fieldPath:a.field.canonicalString(),appendMissingElements:{values:l.elements}};if(l instanceof Wr)return{fieldPath:a.field.canonicalString(),removeAllFromArray:{values:l.elements}};if(l instanceof lo)return{fieldPath:a.field.canonicalString(),increment:l.Pe};throw W()}(0,s))),e.precondition.isNone||(t.currentDocument=function(r,i){return i.updateTime!==void 0?{updateTime:y_(r,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:W()}(n,e.precondition)),t}function b_(n,e){return n&&n.length>0?(ue(e!==void 0),n.map(t=>function(r,i){let a=r.updateTime?Ft(r.updateTime):Ft(i);return a.isEqual(G.min())&&(a=Ft(i)),new n_(a,r.transformResults||[])}(t,e))):[]}function E_(n,e){return{documents:[nf(n,e.path)]}}function T_(n,e){const t={structuredQuery:{}},s=e.path;let r;e.collectionGroup!==null?(r=s,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(r=s.popLast(),t.structuredQuery.from=[{collectionId:s.lastSegment()}]),t.parent=nf(n,r);const i=function(d){if(d.length!==0)return of(Ut.create(d,"and"))}(e.filters);i&&(t.structuredQuery.where=i);const a=function(d){if(d.length!==0)return d.map(f=>function(y){return{field:Cs(y.field),direction:x_(y.dir)}}(f))}(e.orderBy);a&&(t.structuredQuery.orderBy=a);const l=Ka(n,e.limit);return l!==null&&(t.structuredQuery.limit=l),e.startAt&&(t.structuredQuery.startAt=function(d){return{before:d.inclusive,values:d.position}}(e.startAt)),e.endAt&&(t.structuredQuery.endAt=function(d){return{before:!d.inclusive,values:d.position}}(e.endAt)),{_t:t,parent:r}}function I_(n){let e=v_(n.parent);const t=n.structuredQuery,s=t.from?t.from.length:0;let r=null;if(s>0){ue(s===1);const f=t.from[0];f.allDescendants?r=f.collectionId:e=e.child(f.collectionId)}let i=[];t.where&&(i=function(m){const y=rf(m);return y instanceof Ut&&Lh(y)?y.getFilters():[y]}(t.where));let a=[];t.orderBy&&(a=function(m){return m.map(y=>function(T){return new oo(ks(T.field),function(x){switch(x){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(T.direction))}(y))}(t.orderBy));let l=null;t.limit&&(l=function(m){let y;return y=typeof m=="object"?m.value:m,To(y)?null:y}(t.limit));let c=null;t.startAt&&(c=function(m){const y=!!m.before,b=m.values||[];return new io(b,y)}(t.startAt));let d=null;return t.endAt&&(d=function(m){const y=!m.before,b=m.values||[];return new io(b,y)}(t.endAt)),$0(e,r,a,i,l,"F",c,d)}function S_(n,e){const t=function(r){switch(r){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return W()}}(e.purpose);return t==null?null:{"goog-listen-tags":t}}function rf(n){return n.unaryFilter!==void 0?function(t){switch(t.unaryFilter.op){case"IS_NAN":const s=ks(t.unaryFilter.field);return Le.create(s,"==",{doubleValue:NaN});case"IS_NULL":const r=ks(t.unaryFilter.field);return Le.create(r,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=ks(t.unaryFilter.field);return Le.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const a=ks(t.unaryFilter.field);return Le.create(a,"!=",{nullValue:"NULL_VALUE"});default:return W()}}(n):n.fieldFilter!==void 0?function(t){return Le.create(ks(t.fieldFilter.field),function(r){switch(r){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return W()}}(t.fieldFilter.op),t.fieldFilter.value)}(n):n.compositeFilter!==void 0?function(t){return Ut.create(t.compositeFilter.filters.map(s=>rf(s)),function(r){switch(r){case"AND":return"and";case"OR":return"or";default:return W()}}(t.compositeFilter.op))}(n):W()}function x_(n){return f_[n]}function A_(n){return p_[n]}function R_(n){return m_[n]}function Cs(n){return{fieldPath:n.canonicalString()}}function ks(n){return He.fromServerFormat(n.fieldPath)}function of(n){return n instanceof Le?function(t){if(t.op==="=="){if(Uu(t.value))return{unaryFilter:{field:Cs(t.field),op:"IS_NAN"}};if(zu(t.value))return{unaryFilter:{field:Cs(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(Uu(t.value))return{unaryFilter:{field:Cs(t.field),op:"IS_NOT_NAN"}};if(zu(t.value))return{unaryFilter:{field:Cs(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Cs(t.field),op:A_(t.op),value:t.value}}}(n):n instanceof Ut?function(t){const s=t.getFilters().map(r=>of(r));return s.length===1?s[0]:{compositeFilter:{op:R_(t.op),filters:s}}}(n):W()}function P_(n){const e=[];return n.fields.forEach(t=>e.push(t.canonicalString())),{fieldPaths:e}}function af(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xn{constructor(e,t,s,r,i=G.min(),a=G.min(),l=We.EMPTY_BYTE_STRING,c=null){this.target=e,this.targetId=t,this.purpose=s,this.sequenceNumber=r,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=a,this.resumeToken=l,this.expectedCount=c}withSequenceNumber(e){return new xn(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new xn(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new xn(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new xn(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class C_{constructor(e){this.ct=e}}function k_(n){const e=I_({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?Ga(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class M_{constructor(){this.un=new D_}addToCollectionParentIndex(e,t){return this.un.add(t),L.resolve()}getCollectionParents(e,t){return L.resolve(this.un.getEntries(t))}addFieldIndex(e,t){return L.resolve()}deleteFieldIndex(e,t){return L.resolve()}deleteAllFieldIndexes(e){return L.resolve()}createTargetIndexes(e,t){return L.resolve()}getDocumentsMatchingTarget(e,t){return L.resolve(null)}getIndexType(e,t){return L.resolve(0)}getFieldIndexes(e,t){return L.resolve([])}getNextCollectionGroupToUpdate(e){return L.resolve(null)}getMinOffset(e,t){return L.resolve(On.min())}getMinOffsetFromCollectionGroup(e,t){return L.resolve(On.min())}updateCollectionGroup(e,t,s){return L.resolve()}updateIndexEntries(e,t){return L.resolve()}}class D_{constructor(){this.index={}}add(e){const t=e.lastSegment(),s=e.popLast(),r=this.index[t]||new je(ve.comparator),i=!r.has(s);return this.index[t]=r.add(s),i}has(e){const t=e.lastSegment(),s=e.popLast(),r=this.index[t];return r&&r.has(s)}getEntries(e){return(this.index[e]||new je(ve.comparator)).toArray()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ys{constructor(e){this.Ln=e}next(){return this.Ln+=2,this.Ln}static Bn(){return new Ys(0)}static kn(){return new Ys(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class N_{constructor(){this.changes=new tr(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,Ze.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const s=this.changes.get(t);return s!==void 0?L.resolve(s):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class L_{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class O_{constructor(e,t,s,r){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=s,this.indexManager=r}getDocument(e,t){let s=null;return this.documentOverlayCache.getOverlay(e,t).next(r=>(s=r,this.remoteDocumentCache.getEntry(e,t))).next(r=>(s!==null&&Lr(s.mutation,r,gt.empty(),Oe.now()),r))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(s=>this.getLocalViewOfDocuments(e,s,se()).next(()=>s))}getLocalViewOfDocuments(e,t,s=se()){const r=Xn();return this.populateOverlays(e,r,t).next(()=>this.computeViews(e,t,r,s).next(i=>{let a=Ar();return i.forEach((l,c)=>{a=a.insert(l,c.overlayedDocument)}),a}))}getOverlayedDocuments(e,t){const s=Xn();return this.populateOverlays(e,s,t).next(()=>this.computeViews(e,t,s,se()))}populateOverlays(e,t,s){const r=[];return s.forEach(i=>{t.has(i)||r.push(i)}),this.documentOverlayCache.getOverlays(e,r).next(i=>{i.forEach((a,l)=>{t.set(a,l)})})}computeViews(e,t,s,r){let i=ln();const a=Nr(),l=function(){return Nr()}();return t.forEach((c,d)=>{const f=s.get(d.key);r.has(d.key)&&(f===void 0||f.mutation instanceof zn)?i=i.insert(d.key,d):f!==void 0?(a.set(d.key,f.mutation.getFieldMask()),Lr(f.mutation,d,f.mutation.getFieldMask(),Oe.now())):a.set(d.key,gt.empty())}),this.recalculateAndSaveOverlays(e,i).next(c=>(c.forEach((d,f)=>a.set(d,f)),t.forEach((d,f)=>{var m;return l.set(d,new L_(f,(m=a.get(d))!==null&&m!==void 0?m:null))}),l))}recalculateAndSaveOverlays(e,t){const s=Nr();let r=new be((a,l)=>a-l),i=se();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(a=>{for(const l of a)l.keys().forEach(c=>{const d=t.get(c);if(d===null)return;let f=s.get(c)||gt.empty();f=l.applyToLocalView(d,f),s.set(c,f);const m=(r.get(l.batchId)||se()).add(c);r=r.insert(l.batchId,m)})}).next(()=>{const a=[],l=r.getReverseIterator();for(;l.hasNext();){const c=l.getNext(),d=c.key,f=c.value,m=qh();f.forEach(y=>{if(!i.has(y)){const b=Kh(t.get(y),s.get(y));b!==null&&m.set(y,b),i=i.add(y)}}),a.push(this.documentOverlayCache.saveOverlays(e,d,m))}return L.waitFor(a)}).next(()=>s)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(s=>this.recalculateAndSaveOverlays(e,s))}getDocumentsMatchingQuery(e,t,s,r){return function(a){return q.isDocumentKey(a.path)&&a.collectionGroup===null&&a.filters.length===0}(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):q0(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,s,r):this.getDocumentsMatchingCollectionQuery(e,t,s,r)}getNextDocuments(e,t,s,r){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,s,r).next(i=>{const a=r-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,s.largestBatchId,r-i.size):L.resolve(Xn());let l=-1,c=i;return a.next(d=>L.forEach(d,(f,m)=>(l<m.largestBatchId&&(l=m.largestBatchId),i.get(f)?L.resolve():this.remoteDocumentCache.getEntry(e,f).next(y=>{c=c.insert(f,y)}))).next(()=>this.populateOverlays(e,d,i)).next(()=>this.computeViews(e,c,d,se())).next(f=>({batchId:l,changes:$h(f)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new q(t)).next(s=>{let r=Ar();return s.isFoundDocument()&&(r=r.insert(s.key,s)),r})}getDocumentsMatchingCollectionGroupQuery(e,t,s,r){const i=t.collectionGroup;let a=Ar();return this.indexManager.getCollectionParents(e,i).next(l=>L.forEach(l,c=>{const d=function(m,y){return new Io(y,null,m.explicitOrderBy.slice(),m.filters.slice(),m.limit,m.limitType,m.startAt,m.endAt)}(t,c.child(i));return this.getDocumentsMatchingCollectionQuery(e,d,s,r).next(f=>{f.forEach((m,y)=>{a=a.insert(m,y)})})}).next(()=>a))}getDocumentsMatchingCollectionQuery(e,t,s,r){let i;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,s.largestBatchId).next(a=>(i=a,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,s,i,r))).next(a=>{i.forEach((c,d)=>{const f=d.getKey();a.get(f)===null&&(a=a.insert(f,Ze.newInvalidDocument(f)))});let l=Ar();return a.forEach((c,d)=>{const f=i.get(c);f!==void 0&&Lr(f.mutation,d,gt.empty(),Oe.now()),xo(t,d)&&(l=l.insert(c,d))}),l})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class V_{constructor(e){this.serializer=e,this.hr=new Map,this.Pr=new Map}getBundleMetadata(e,t){return L.resolve(this.hr.get(t))}saveBundleMetadata(e,t){return this.hr.set(t.id,function(r){return{id:r.id,version:r.version,createTime:Ft(r.createTime)}}(t)),L.resolve()}getNamedQuery(e,t){return L.resolve(this.Pr.get(t))}saveNamedQuery(e,t){return this.Pr.set(t.name,function(r){return{name:r.name,query:k_(r.bundledQuery),readTime:Ft(r.readTime)}}(t)),L.resolve()}}/**
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
 */class B_{constructor(){this.overlays=new be(q.comparator),this.Ir=new Map}getOverlay(e,t){return L.resolve(this.overlays.get(t))}getOverlays(e,t){const s=Xn();return L.forEach(t,r=>this.getOverlay(e,r).next(i=>{i!==null&&s.set(r,i)})).next(()=>s)}saveOverlays(e,t,s){return s.forEach((r,i)=>{this.ht(e,t,i)}),L.resolve()}removeOverlaysForBatchId(e,t,s){const r=this.Ir.get(s);return r!==void 0&&(r.forEach(i=>this.overlays=this.overlays.remove(i)),this.Ir.delete(s)),L.resolve()}getOverlaysForCollection(e,t,s){const r=Xn(),i=t.length+1,a=new q(t.child("")),l=this.overlays.getIteratorFrom(a);for(;l.hasNext();){const c=l.getNext().value,d=c.getKey();if(!t.isPrefixOf(d.path))break;d.path.length===i&&c.largestBatchId>s&&r.set(c.getKey(),c)}return L.resolve(r)}getOverlaysForCollectionGroup(e,t,s,r){let i=new be((d,f)=>d-f);const a=this.overlays.getIterator();for(;a.hasNext();){const d=a.getNext().value;if(d.getKey().getCollectionGroup()===t&&d.largestBatchId>s){let f=i.get(d.largestBatchId);f===null&&(f=Xn(),i=i.insert(d.largestBatchId,f)),f.set(d.getKey(),d)}}const l=Xn(),c=i.getIterator();for(;c.hasNext()&&(c.getNext().value.forEach((d,f)=>l.set(d,f)),!(l.size()>=r)););return L.resolve(l)}ht(e,t,s){const r=this.overlays.get(s.key);if(r!==null){const a=this.Ir.get(r.largestBatchId).delete(s.key);this.Ir.set(r.largestBatchId,a)}this.overlays=this.overlays.insert(s.key,new a_(t,s));let i=this.Ir.get(t);i===void 0&&(i=se(),this.Ir.set(t,i)),this.Ir.set(t,i.add(s.key))}}/**
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
 */class F_{constructor(){this.sessionToken=We.EMPTY_BYTE_STRING}getSessionToken(e){return L.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,L.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bl{constructor(){this.Tr=new je(Fe.Er),this.dr=new je(Fe.Ar)}isEmpty(){return this.Tr.isEmpty()}addReference(e,t){const s=new Fe(e,t);this.Tr=this.Tr.add(s),this.dr=this.dr.add(s)}Rr(e,t){e.forEach(s=>this.addReference(s,t))}removeReference(e,t){this.Vr(new Fe(e,t))}mr(e,t){e.forEach(s=>this.removeReference(s,t))}gr(e){const t=new q(new ve([])),s=new Fe(t,e),r=new Fe(t,e+1),i=[];return this.dr.forEachInRange([s,r],a=>{this.Vr(a),i.push(a.key)}),i}pr(){this.Tr.forEach(e=>this.Vr(e))}Vr(e){this.Tr=this.Tr.delete(e),this.dr=this.dr.delete(e)}yr(e){const t=new q(new ve([])),s=new Fe(t,e),r=new Fe(t,e+1);let i=se();return this.dr.forEachInRange([s,r],a=>{i=i.add(a.key)}),i}containsKey(e){const t=new Fe(e,0),s=this.Tr.firstAfterOrEqual(t);return s!==null&&e.isEqual(s.key)}}class Fe{constructor(e,t){this.key=e,this.wr=t}static Er(e,t){return q.comparator(e.key,t.key)||le(e.wr,t.wr)}static Ar(e,t){return le(e.wr,t.wr)||q.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class z_{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Sr=1,this.br=new je(Fe.Er)}checkEmpty(e){return L.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,s,r){const i=this.Sr;this.Sr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const a=new o_(i,t,s,r);this.mutationQueue.push(a);for(const l of r)this.br=this.br.add(new Fe(l.key,i)),this.indexManager.addToCollectionParentIndex(e,l.key.path.popLast());return L.resolve(a)}lookupMutationBatch(e,t){return L.resolve(this.Dr(t))}getNextMutationBatchAfterBatchId(e,t){const s=t+1,r=this.vr(s),i=r<0?0:r;return L.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return L.resolve(this.mutationQueue.length===0?-1:this.Sr-1)}getAllMutationBatches(e){return L.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const s=new Fe(t,0),r=new Fe(t,Number.POSITIVE_INFINITY),i=[];return this.br.forEachInRange([s,r],a=>{const l=this.Dr(a.wr);i.push(l)}),L.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let s=new je(le);return t.forEach(r=>{const i=new Fe(r,0),a=new Fe(r,Number.POSITIVE_INFINITY);this.br.forEachInRange([i,a],l=>{s=s.add(l.wr)})}),L.resolve(this.Cr(s))}getAllMutationBatchesAffectingQuery(e,t){const s=t.path,r=s.length+1;let i=s;q.isDocumentKey(i)||(i=i.child(""));const a=new Fe(new q(i),0);let l=new je(le);return this.br.forEachWhile(c=>{const d=c.key.path;return!!s.isPrefixOf(d)&&(d.length===r&&(l=l.add(c.wr)),!0)},a),L.resolve(this.Cr(l))}Cr(e){const t=[];return e.forEach(s=>{const r=this.Dr(s);r!==null&&t.push(r)}),t}removeMutationBatch(e,t){ue(this.Fr(t.batchId,"removed")===0),this.mutationQueue.shift();let s=this.br;return L.forEach(t.mutations,r=>{const i=new Fe(r.key,t.batchId);return s=s.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,r.key)}).next(()=>{this.br=s})}On(e){}containsKey(e,t){const s=new Fe(t,0),r=this.br.firstAfterOrEqual(s);return L.resolve(t.isEqual(r&&r.key))}performConsistencyCheck(e){return this.mutationQueue.length,L.resolve()}Fr(e,t){return this.vr(e)}vr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Dr(e){const t=this.vr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class U_{constructor(e){this.Mr=e,this.docs=function(){return new be(q.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const s=t.key,r=this.docs.get(s),i=r?r.size:0,a=this.Mr(t);return this.docs=this.docs.insert(s,{document:t.mutableCopy(),size:a}),this.size+=a-i,this.indexManager.addToCollectionParentIndex(e,s.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const s=this.docs.get(t);return L.resolve(s?s.document.mutableCopy():Ze.newInvalidDocument(t))}getEntries(e,t){let s=ln();return t.forEach(r=>{const i=this.docs.get(r);s=s.insert(r,i?i.document.mutableCopy():Ze.newInvalidDocument(r))}),L.resolve(s)}getDocumentsMatchingQuery(e,t,s,r){let i=ln();const a=t.path,l=new q(a.child("")),c=this.docs.getIteratorFrom(l);for(;c.hasNext();){const{key:d,value:{document:f}}=c.getNext();if(!a.isPrefixOf(d.path))break;d.path.length>a.length+1||T0(E0(f),s)<=0||(r.has(f.key)||xo(t,f))&&(i=i.insert(f.key,f.mutableCopy()))}return L.resolve(i)}getAllFromCollectionGroup(e,t,s,r){W()}Or(e,t){return L.forEach(this.docs,s=>t(s))}newChangeBuffer(e){return new $_(this)}getSize(e){return L.resolve(this.size)}}class $_ extends N_{constructor(e){super(),this.cr=e}applyChanges(e){const t=[];return this.changes.forEach((s,r)=>{r.isValidDocument()?t.push(this.cr.addEntry(e,r)):this.cr.removeEntry(s)}),L.waitFor(t)}getFromCache(e,t){return this.cr.getEntry(e,t)}getAllFromCache(e,t){return this.cr.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class q_{constructor(e){this.persistence=e,this.Nr=new tr(t=>kl(t),Ml),this.lastRemoteSnapshotVersion=G.min(),this.highestTargetId=0,this.Lr=0,this.Br=new Bl,this.targetCount=0,this.kr=Ys.Bn()}forEachTarget(e,t){return this.Nr.forEach((s,r)=>t(r)),L.resolve()}getLastRemoteSnapshotVersion(e){return L.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return L.resolve(this.Lr)}allocateTargetId(e){return this.highestTargetId=this.kr.next(),L.resolve(this.highestTargetId)}setTargetsMetadata(e,t,s){return s&&(this.lastRemoteSnapshotVersion=s),t>this.Lr&&(this.Lr=t),L.resolve()}Kn(e){this.Nr.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.kr=new Ys(t),this.highestTargetId=t),e.sequenceNumber>this.Lr&&(this.Lr=e.sequenceNumber)}addTargetData(e,t){return this.Kn(t),this.targetCount+=1,L.resolve()}updateTargetData(e,t){return this.Kn(t),L.resolve()}removeTargetData(e,t){return this.Nr.delete(t.target),this.Br.gr(t.targetId),this.targetCount-=1,L.resolve()}removeTargets(e,t,s){let r=0;const i=[];return this.Nr.forEach((a,l)=>{l.sequenceNumber<=t&&s.get(l.targetId)===null&&(this.Nr.delete(a),i.push(this.removeMatchingKeysForTargetId(e,l.targetId)),r++)}),L.waitFor(i).next(()=>r)}getTargetCount(e){return L.resolve(this.targetCount)}getTargetData(e,t){const s=this.Nr.get(t)||null;return L.resolve(s)}addMatchingKeys(e,t,s){return this.Br.Rr(t,s),L.resolve()}removeMatchingKeys(e,t,s){this.Br.mr(t,s);const r=this.persistence.referenceDelegate,i=[];return r&&t.forEach(a=>{i.push(r.markPotentiallyOrphaned(e,a))}),L.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this.Br.gr(t),L.resolve()}getMatchingKeysForTargetId(e,t){const s=this.Br.yr(t);return L.resolve(s)}containsKey(e,t){return L.resolve(this.Br.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class H_{constructor(e,t){this.qr={},this.overlays={},this.Qr=new Al(0),this.Kr=!1,this.Kr=!0,this.$r=new F_,this.referenceDelegate=e(this),this.Ur=new q_(this),this.indexManager=new M_,this.remoteDocumentCache=function(r){return new U_(r)}(s=>this.referenceDelegate.Wr(s)),this.serializer=new C_(t),this.Gr=new V_(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Kr=!1,Promise.resolve()}get started(){return this.Kr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new B_,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let s=this.qr[e.toKey()];return s||(s=new z_(t,this.referenceDelegate),this.qr[e.toKey()]=s),s}getGlobalsCache(){return this.$r}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Gr}runTransaction(e,t,s){U("MemoryPersistence","Starting transaction:",e);const r=new j_(this.Qr.next());return this.referenceDelegate.zr(),s(r).next(i=>this.referenceDelegate.jr(r).next(()=>i)).toPromise().then(i=>(r.raiseOnCommittedEvent(),i))}Hr(e,t){return L.or(Object.values(this.qr).map(s=>()=>s.containsKey(e,t)))}}class j_ extends S0{constructor(e){super(),this.currentSequenceNumber=e}}class Fl{constructor(e){this.persistence=e,this.Jr=new Bl,this.Yr=null}static Zr(e){return new Fl(e)}get Xr(){if(this.Yr)return this.Yr;throw W()}addReference(e,t,s){return this.Jr.addReference(s,t),this.Xr.delete(s.toString()),L.resolve()}removeReference(e,t,s){return this.Jr.removeReference(s,t),this.Xr.add(s.toString()),L.resolve()}markPotentiallyOrphaned(e,t){return this.Xr.add(t.toString()),L.resolve()}removeTarget(e,t){this.Jr.gr(t.targetId).forEach(r=>this.Xr.add(r.toString()));const s=this.persistence.getTargetCache();return s.getMatchingKeysForTargetId(e,t.targetId).next(r=>{r.forEach(i=>this.Xr.add(i.toString()))}).next(()=>s.removeTargetData(e,t))}zr(){this.Yr=new Set}jr(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return L.forEach(this.Xr,s=>{const r=q.fromPath(s);return this.ei(e,r).next(i=>{i||t.removeEntry(r,G.min())})}).next(()=>(this.Yr=null,t.apply(e)))}updateLimboDocument(e,t){return this.ei(e,t).next(s=>{s?this.Xr.delete(t.toString()):this.Xr.add(t.toString())})}Wr(e){return 0}ei(e,t){return L.or([()=>L.resolve(this.Jr.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Hr(e,t)])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zl{constructor(e,t,s,r){this.targetId=e,this.fromCache=t,this.$i=s,this.Ui=r}static Wi(e,t){let s=se(),r=se();for(const i of t.docChanges)switch(i.type){case 0:s=s.add(i.doc.key);break;case 1:r=r.add(i.doc.key)}return new zl(e,t.fromCache,s,r)}}/**
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
 */class W_{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Y_{constructor(){this.Gi=!1,this.zi=!1,this.ji=100,this.Hi=function(){return Rm()?8:x0(et())>0?6:4}()}initialize(e,t){this.Ji=e,this.indexManager=t,this.Gi=!0}getDocumentsMatchingQuery(e,t,s,r){const i={result:null};return this.Yi(e,t).next(a=>{i.result=a}).next(()=>{if(!i.result)return this.Zi(e,t,r,s).next(a=>{i.result=a})}).next(()=>{if(i.result)return;const a=new W_;return this.Xi(e,t,a).next(l=>{if(i.result=l,this.zi)return this.es(e,t,a,l.size)})}).next(()=>i.result)}es(e,t,s,r){return s.documentReadCount<this.ji?(Er()<=ie.DEBUG&&U("QueryEngine","SDK will not create cache indexes for query:",Ps(t),"since it only creates cache indexes for collection contains","more than or equal to",this.ji,"documents"),L.resolve()):(Er()<=ie.DEBUG&&U("QueryEngine","Query:",Ps(t),"scans",s.documentReadCount,"local documents and returns",r,"documents as results."),s.documentReadCount>this.Hi*r?(Er()<=ie.DEBUG&&U("QueryEngine","The SDK decides to create cache indexes for query:",Ps(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,Bt(t))):L.resolve())}Yi(e,t){if(ju(t))return L.resolve(null);let s=Bt(t);return this.indexManager.getIndexType(e,s).next(r=>r===0?null:(t.limit!==null&&r===1&&(t=Ga(t,null,"F"),s=Bt(t)),this.indexManager.getDocumentsMatchingTarget(e,s).next(i=>{const a=se(...i);return this.Ji.getDocuments(e,a).next(l=>this.indexManager.getMinOffset(e,s).next(c=>{const d=this.ts(t,l);return this.ns(t,d,a,c.readTime)?this.Yi(e,Ga(t,null,"F")):this.rs(e,d,t,c)}))})))}Zi(e,t,s,r){return ju(t)||r.isEqual(G.min())?L.resolve(null):this.Ji.getDocuments(e,s).next(i=>{const a=this.ts(t,i);return this.ns(t,a,s,r)?L.resolve(null):(Er()<=ie.DEBUG&&U("QueryEngine","Re-using previous result from %s to execute query: %s",r.toString(),Ps(t)),this.rs(e,a,t,b0(r,-1)).next(l=>l))})}ts(e,t){let s=new je(zh(e));return t.forEach((r,i)=>{xo(e,i)&&(s=s.add(i))}),s}ns(e,t,s,r){if(e.limit===null)return!1;if(s.size!==t.size)return!0;const i=e.limitType==="F"?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(r)>0)}Xi(e,t,s){return Er()<=ie.DEBUG&&U("QueryEngine","Using full collection scan to execute query:",Ps(t)),this.Ji.getDocumentsMatchingQuery(e,t,On.min(),s)}rs(e,t,s,r){return this.Ji.getDocumentsMatchingQuery(e,s,r).next(i=>(t.forEach(a=>{i=i.insert(a.key,a)}),i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class G_{constructor(e,t,s,r){this.persistence=e,this.ss=t,this.serializer=r,this.os=new be(le),this._s=new tr(i=>kl(i),Ml),this.us=new Map,this.cs=e.getRemoteDocumentCache(),this.Ur=e.getTargetCache(),this.Gr=e.getBundleCache(),this.ls(s)}ls(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new O_(this.cs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.cs.setIndexManager(this.indexManager),this.ss.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.os))}}function K_(n,e,t,s){return new G_(n,e,t,s)}async function lf(n,e){const t=K(n);return await t.persistence.runTransaction("Handle user change","readonly",s=>{let r;return t.mutationQueue.getAllMutationBatches(s).next(i=>(r=i,t.ls(e),t.mutationQueue.getAllMutationBatches(s))).next(i=>{const a=[],l=[];let c=se();for(const d of r){a.push(d.batchId);for(const f of d.mutations)c=c.add(f.key)}for(const d of i){l.push(d.batchId);for(const f of d.mutations)c=c.add(f.key)}return t.localDocuments.getDocuments(s,c).next(d=>({hs:d,removedBatchIds:a,addedBatchIds:l}))})})}function Q_(n,e){const t=K(n);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",s=>{const r=e.batch.keys(),i=t.cs.newChangeBuffer({trackRemovals:!0});return function(l,c,d,f){const m=d.batch,y=m.keys();let b=L.resolve();return y.forEach(T=>{b=b.next(()=>f.getEntry(c,T)).next(R=>{const x=d.docVersions.get(T);ue(x!==null),R.version.compareTo(x)<0&&(m.applyToRemoteDocument(R,d),R.isValidDocument()&&(R.setReadTime(d.commitVersion),f.addEntry(R)))})}),b.next(()=>l.mutationQueue.removeMutationBatch(c,m))}(t,s,e,i).next(()=>i.apply(s)).next(()=>t.mutationQueue.performConsistencyCheck(s)).next(()=>t.documentOverlayCache.removeOverlaysForBatchId(s,r,e.batch.batchId)).next(()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(s,function(l){let c=se();for(let d=0;d<l.mutationResults.length;++d)l.mutationResults[d].transformResults.length>0&&(c=c.add(l.batch.mutations[d].key));return c}(e))).next(()=>t.localDocuments.getDocuments(s,r))})}function cf(n){const e=K(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",t=>e.Ur.getLastRemoteSnapshotVersion(t))}function J_(n,e){const t=K(n),s=e.snapshotVersion;let r=t.os;return t.persistence.runTransaction("Apply remote event","readwrite-primary",i=>{const a=t.cs.newChangeBuffer({trackRemovals:!0});r=t.os;const l=[];e.targetChanges.forEach((f,m)=>{const y=r.get(m);if(!y)return;l.push(t.Ur.removeMatchingKeys(i,f.removedDocuments,m).next(()=>t.Ur.addMatchingKeys(i,f.addedDocuments,m)));let b=y.withSequenceNumber(i.currentSequenceNumber);e.targetMismatches.get(m)!==null?b=b.withResumeToken(We.EMPTY_BYTE_STRING,G.min()).withLastLimboFreeSnapshotVersion(G.min()):f.resumeToken.approximateByteSize()>0&&(b=b.withResumeToken(f.resumeToken,s)),r=r.insert(m,b),function(R,x,S){return R.resumeToken.approximateByteSize()===0||x.snapshotVersion.toMicroseconds()-R.snapshotVersion.toMicroseconds()>=3e8?!0:S.addedDocuments.size+S.modifiedDocuments.size+S.removedDocuments.size>0}(y,b,f)&&l.push(t.Ur.updateTargetData(i,b))});let c=ln(),d=se();if(e.documentUpdates.forEach(f=>{e.resolvedLimboDocuments.has(f)&&l.push(t.persistence.referenceDelegate.updateLimboDocument(i,f))}),l.push(X_(i,a,e.documentUpdates).next(f=>{c=f.Ps,d=f.Is})),!s.isEqual(G.min())){const f=t.Ur.getLastRemoteSnapshotVersion(i).next(m=>t.Ur.setTargetsMetadata(i,i.currentSequenceNumber,s));l.push(f)}return L.waitFor(l).next(()=>a.apply(i)).next(()=>t.localDocuments.getLocalViewOfDocuments(i,c,d)).next(()=>c)}).then(i=>(t.os=r,i))}function X_(n,e,t){let s=se(),r=se();return t.forEach(i=>s=s.add(i)),e.getEntries(n,s).next(i=>{let a=ln();return t.forEach((l,c)=>{const d=i.get(l);c.isFoundDocument()!==d.isFoundDocument()&&(r=r.add(l)),c.isNoDocument()&&c.version.isEqual(G.min())?(e.removeEntry(l,c.readTime),a=a.insert(l,c)):!d.isValidDocument()||c.version.compareTo(d.version)>0||c.version.compareTo(d.version)===0&&d.hasPendingWrites?(e.addEntry(c),a=a.insert(l,c)):U("LocalStore","Ignoring outdated watch update for ",l,". Current version:",d.version," Watch version:",c.version)}),{Ps:a,Is:r}})}function Z_(n,e){const t=K(n);return t.persistence.runTransaction("Get next mutation batch","readonly",s=>(e===void 0&&(e=-1),t.mutationQueue.getNextMutationBatchAfterBatchId(s,e)))}function ew(n,e){const t=K(n);return t.persistence.runTransaction("Allocate target","readwrite",s=>{let r;return t.Ur.getTargetData(s,e).next(i=>i?(r=i,L.resolve(r)):t.Ur.allocateTargetId(s).next(a=>(r=new xn(e,a,"TargetPurposeListen",s.currentSequenceNumber),t.Ur.addTargetData(s,r).next(()=>r))))}).then(s=>{const r=t.os.get(s.targetId);return(r===null||s.snapshotVersion.compareTo(r.snapshotVersion)>0)&&(t.os=t.os.insert(s.targetId,s),t._s.set(e,s.targetId)),s})}async function Za(n,e,t){const s=K(n),r=s.os.get(e),i=t?"readwrite":"readwrite-primary";try{t||await s.persistence.runTransaction("Release target",i,a=>s.persistence.referenceDelegate.removeTarget(a,r))}catch(a){if(!ii(a))throw a;U("LocalStore",`Failed to update sequence numbers for target ${e}: ${a}`)}s.os=s.os.remove(e),s._s.delete(r.target)}function nd(n,e,t){const s=K(n);let r=G.min(),i=se();return s.persistence.runTransaction("Execute query","readwrite",a=>function(c,d,f){const m=K(c),y=m._s.get(f);return y!==void 0?L.resolve(m.os.get(y)):m.Ur.getTargetData(d,f)}(s,a,Bt(e)).next(l=>{if(l)return r=l.lastLimboFreeSnapshotVersion,s.Ur.getMatchingKeysForTargetId(a,l.targetId).next(c=>{i=c})}).next(()=>s.ss.getDocumentsMatchingQuery(a,e,t?r:G.min(),t?i:se())).next(l=>(tw(s,j0(e),l),{documents:l,Ts:i})))}function tw(n,e,t){let s=n.us.get(e)||G.min();t.forEach((r,i)=>{i.readTime.compareTo(s)>0&&(s=i.readTime)}),n.us.set(e,s)}class sd{constructor(){this.activeTargetIds=J0()}fs(e){this.activeTargetIds=this.activeTargetIds.add(e)}gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Vs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class nw{constructor(){this.so=new sd,this.oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,s){}addLocalQueryTarget(e,t=!0){return t&&this.so.fs(e),this.oo[e]||"not-current"}updateQueryState(e,t,s){this.oo[e]=t}removeLocalQueryTarget(e){this.so.gs(e)}isLocalQueryTarget(e){return this.so.activeTargetIds.has(e)}clearQueryState(e){delete this.oo[e]}getAllActiveQueryTargets(){return this.so.activeTargetIds}isActiveQueryTarget(e){return this.so.activeTargetIds.has(e)}start(){return this.so=new sd,Promise.resolve()}handleUserChange(e,t,s){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sw{_o(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rd{constructor(){this.ao=()=>this.uo(),this.co=()=>this.lo(),this.ho=[],this.Po()}_o(e){this.ho.push(e)}shutdown(){window.removeEventListener("online",this.ao),window.removeEventListener("offline",this.co)}Po(){window.addEventListener("online",this.ao),window.addEventListener("offline",this.co)}uo(){U("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const e of this.ho)e(0)}lo(){U("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const e of this.ho)e(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
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
 */let Oi=null;function Sa(){return Oi===null?Oi=function(){return 268435456+Math.round(2147483648*Math.random())}():Oi++,"0x"+Oi.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rw={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iw{constructor(e){this.Io=e.Io,this.To=e.To}Eo(e){this.Ao=e}Ro(e){this.Vo=e}mo(e){this.fo=e}onMessage(e){this.po=e}close(){this.To()}send(e){this.Io(e)}yo(){this.Ao()}wo(){this.Vo()}So(e){this.fo(e)}bo(e){this.po(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Je="WebChannelConnection";class ow extends class{constructor(t){this.databaseInfo=t,this.databaseId=t.databaseId;const s=t.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),i=encodeURIComponent(this.databaseId.database);this.Do=s+"://"+t.host,this.vo=`projects/${r}/databases/${i}`,this.Co=this.databaseId.database==="(default)"?`project_id=${r}`:`project_id=${r}&database_id=${i}`}get Fo(){return!1}Mo(t,s,r,i,a){const l=Sa(),c=this.xo(t,s.toUriEncodedString());U("RestConnection",`Sending RPC '${t}' ${l}:`,c,r);const d={"google-cloud-resource-prefix":this.vo,"x-goog-request-params":this.Co};return this.Oo(d,i,a),this.No(t,c,d,r).then(f=>(U("RestConnection",`Received RPC '${t}' ${l}: `,f),f),f=>{throw qs("RestConnection",`RPC '${t}' ${l} failed with error: `,f,"url: ",c,"request:",r),f})}Lo(t,s,r,i,a,l){return this.Mo(t,s,r,i,a)}Oo(t,s,r){t["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+er}(),t["Content-Type"]="text/plain",this.databaseInfo.appId&&(t["X-Firebase-GMPID"]=this.databaseInfo.appId),s&&s.headers.forEach((i,a)=>t[a]=i),r&&r.headers.forEach((i,a)=>t[a]=i)}xo(t,s){const r=rw[t];return`${this.Do}/v1/${s}:${r}`}terminate(){}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}No(e,t,s,r){const i=Sa();return new Promise((a,l)=>{const c=new Th;c.setWithCredentials(!0),c.listenOnce(Ih.COMPLETE,()=>{try{switch(c.getLastErrorCode()){case Ui.NO_ERROR:const f=c.getResponseJson();U(Je,`XHR for RPC '${e}' ${i} received:`,JSON.stringify(f)),a(f);break;case Ui.TIMEOUT:U(Je,`RPC '${e}' ${i} timed out`),l(new $(N.DEADLINE_EXCEEDED,"Request time out"));break;case Ui.HTTP_ERROR:const m=c.getStatus();if(U(Je,`RPC '${e}' ${i} failed with status:`,m,"response text:",c.getResponseText()),m>0){let y=c.getResponseJson();Array.isArray(y)&&(y=y[0]);const b=y==null?void 0:y.error;if(b&&b.status&&b.message){const T=function(x){const S=x.toLowerCase().replace(/_/g,"-");return Object.values(N).indexOf(S)>=0?S:N.UNKNOWN}(b.status);l(new $(T,b.message))}else l(new $(N.UNKNOWN,"Server responded with status "+c.getStatus()))}else l(new $(N.UNAVAILABLE,"Connection failed."));break;default:W()}}finally{U(Je,`RPC '${e}' ${i} completed.`)}});const d=JSON.stringify(r);U(Je,`RPC '${e}' ${i} sending request:`,r),c.send(t,"POST",d,s,15)})}Bo(e,t,s){const r=Sa(),i=[this.Do,"/","google.firestore.v1.Firestore","/",e,"/channel"],a=Ah(),l=xh(),c={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},d=this.longPollingOptions.timeoutSeconds;d!==void 0&&(c.longPollingTimeout=Math.round(1e3*d)),this.useFetchStreams&&(c.useFetchStreams=!0),this.Oo(c.initMessageHeaders,t,s),c.encodeInitMessageHeaders=!0;const f=i.join("");U(Je,`Creating RPC '${e}' stream ${r}: ${f}`,c);const m=a.createWebChannel(f,c);let y=!1,b=!1;const T=new iw({Io:x=>{b?U(Je,`Not sending because RPC '${e}' stream ${r} is closed:`,x):(y||(U(Je,`Opening RPC '${e}' stream ${r} transport.`),m.open(),y=!0),U(Je,`RPC '${e}' stream ${r} sending:`,x),m.send(x))},To:()=>m.close()}),R=(x,S,M)=>{x.listen(S,D=>{try{M(D)}catch(C){setTimeout(()=>{throw C},0)}})};return R(m,xr.EventType.OPEN,()=>{b||(U(Je,`RPC '${e}' stream ${r} transport opened.`),T.yo())}),R(m,xr.EventType.CLOSE,()=>{b||(b=!0,U(Je,`RPC '${e}' stream ${r} transport closed`),T.So())}),R(m,xr.EventType.ERROR,x=>{b||(b=!0,qs(Je,`RPC '${e}' stream ${r} transport errored:`,x),T.So(new $(N.UNAVAILABLE,"The operation could not be completed")))}),R(m,xr.EventType.MESSAGE,x=>{var S;if(!b){const M=x.data[0];ue(!!M);const D=M,C=D.error||((S=D[0])===null||S===void 0?void 0:S.error);if(C){U(Je,`RPC '${e}' stream ${r} received error:`,C);const O=C.status;let F=function(_){const E=Pe[_];if(E!==void 0)return Jh(E)}(O),w=C.message;F===void 0&&(F=N.INTERNAL,w="Unknown error status: "+O+" with message "+C.message),b=!0,T.So(new $(F,w)),m.close()}else U(Je,`RPC '${e}' stream ${r} received:`,M),T.bo(M)}}),R(l,Sh.STAT_EVENT,x=>{x.stat===qa.PROXY?U(Je,`RPC '${e}' stream ${r} detected buffering proxy`):x.stat===qa.NOPROXY&&U(Je,`RPC '${e}' stream ${r} detected no buffering proxy`)}),setTimeout(()=>{T.wo()},0),T}}function xa(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ko(n){return new g_(n,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uf{constructor(e,t,s=1e3,r=1.5,i=6e4){this.ui=e,this.timerId=t,this.ko=s,this.qo=r,this.Qo=i,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(e){this.cancel();const t=Math.floor(this.Ko+this.zo()),s=Math.max(0,Date.now()-this.Uo),r=Math.max(0,t-s);r>0&&U("ExponentialBackoff",`Backing off for ${r} ms (base delay: ${this.Ko} ms, delay with jitter: ${t} ms, last attempt: ${s} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,r,()=>(this.Uo=Date.now(),e())),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){this.$o!==null&&(this.$o.skipDelay(),this.$o=null)}cancel(){this.$o!==null&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class df{constructor(e,t,s,r,i,a,l,c){this.ui=e,this.Ho=s,this.Jo=r,this.connection=i,this.authCredentialsProvider=a,this.appCheckCredentialsProvider=l,this.listener=c,this.state=0,this.Yo=0,this.Zo=null,this.Xo=null,this.stream=null,this.e_=0,this.t_=new uf(e,t)}n_(){return this.state===1||this.state===5||this.r_()}r_(){return this.state===2||this.state===3}start(){this.e_=0,this.state!==4?this.auth():this.i_()}async stop(){this.n_()&&await this.close(0)}s_(){this.state=0,this.t_.reset()}o_(){this.r_()&&this.Zo===null&&(this.Zo=this.ui.enqueueAfterDelay(this.Ho,6e4,()=>this.__()))}a_(e){this.u_(),this.stream.send(e)}async __(){if(this.r_())return this.close(0)}u_(){this.Zo&&(this.Zo.cancel(),this.Zo=null)}c_(){this.Xo&&(this.Xo.cancel(),this.Xo=null)}async close(e,t){this.u_(),this.c_(),this.t_.cancel(),this.Yo++,e!==4?this.t_.reset():t&&t.code===N.RESOURCE_EXHAUSTED?(an(t.toString()),an("Using maximum backoff delay to prevent overloading the backend."),this.t_.Wo()):t&&t.code===N.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.l_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.mo(t)}l_(){}auth(){this.state=1;const e=this.h_(this.Yo),t=this.Yo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([s,r])=>{this.Yo===t&&this.P_(s,r)},s=>{e(()=>{const r=new $(N.UNKNOWN,"Fetching auth token failed: "+s.message);return this.I_(r)})})}P_(e,t){const s=this.h_(this.Yo);this.stream=this.T_(e,t),this.stream.Eo(()=>{s(()=>this.listener.Eo())}),this.stream.Ro(()=>{s(()=>(this.state=2,this.Xo=this.ui.enqueueAfterDelay(this.Jo,1e4,()=>(this.r_()&&(this.state=3),Promise.resolve())),this.listener.Ro()))}),this.stream.mo(r=>{s(()=>this.I_(r))}),this.stream.onMessage(r=>{s(()=>++this.e_==1?this.E_(r):this.onNext(r))})}i_(){this.state=5,this.t_.Go(async()=>{this.state=0,this.start()})}I_(e){return U("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}h_(e){return t=>{this.ui.enqueueAndForget(()=>this.Yo===e?t():(U("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class aw extends df{constructor(e,t,s,r,i,a){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,s,r,a),this.serializer=i}T_(e,t){return this.connection.Bo("Listen",e,t)}E_(e){return this.onNext(e)}onNext(e){this.t_.reset();const t=__(this.serializer,e),s=function(i){if(!("targetChange"in i))return G.min();const a=i.targetChange;return a.targetIds&&a.targetIds.length?G.min():a.readTime?Ft(a.readTime):G.min()}(e);return this.listener.d_(t,s)}A_(e){const t={};t.database=Xa(this.serializer),t.addTarget=function(i,a){let l;const c=a.target;if(l=Ya(c)?{documents:E_(i,c)}:{query:T_(i,c)._t},l.targetId=a.targetId,a.resumeToken.approximateByteSize()>0){l.resumeToken=ef(i,a.resumeToken);const d=Ka(i,a.expectedCount);d!==null&&(l.expectedCount=d)}else if(a.snapshotVersion.compareTo(G.min())>0){l.readTime=co(i,a.snapshotVersion.toTimestamp());const d=Ka(i,a.expectedCount);d!==null&&(l.expectedCount=d)}return l}(this.serializer,e);const s=S_(this.serializer,e);s&&(t.labels=s),this.a_(t)}R_(e){const t={};t.database=Xa(this.serializer),t.removeTarget=e,this.a_(t)}}class lw extends df{constructor(e,t,s,r,i,a){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,s,r,a),this.serializer=i}get V_(){return this.e_>0}start(){this.lastStreamToken=void 0,super.start()}l_(){this.V_&&this.m_([])}T_(e,t){return this.connection.Bo("Write",e,t)}E_(e){return ue(!!e.streamToken),this.lastStreamToken=e.streamToken,ue(!e.writeResults||e.writeResults.length===0),this.listener.f_()}onNext(e){ue(!!e.streamToken),this.lastStreamToken=e.streamToken,this.t_.reset();const t=b_(e.writeResults,e.commitTime),s=Ft(e.commitTime);return this.listener.g_(s,t)}p_(){const e={};e.database=Xa(this.serializer),this.a_(e)}m_(e){const t={streamToken:this.lastStreamToken,writes:e.map(s=>w_(this.serializer,s))};this.a_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cw extends class{}{constructor(e,t,s,r){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=s,this.serializer=r,this.y_=!1}w_(){if(this.y_)throw new $(N.FAILED_PRECONDITION,"The client has already been terminated.")}Mo(e,t,s,r){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([i,a])=>this.connection.Mo(e,Qa(t,s),r,i,a)).catch(i=>{throw i.name==="FirebaseError"?(i.code===N.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new $(N.UNKNOWN,i.toString())})}Lo(e,t,s,r,i){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([a,l])=>this.connection.Lo(e,Qa(t,s),r,a,l,i)).catch(a=>{throw a.name==="FirebaseError"?(a.code===N.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new $(N.UNKNOWN,a.toString())})}terminate(){this.y_=!0,this.connection.terminate()}}class uw{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.S_=0,this.b_=null,this.D_=!0}v_(){this.S_===0&&(this.C_("Unknown"),this.b_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.b_=null,this.F_("Backend didn't respond within 10 seconds."),this.C_("Offline"),Promise.resolve())))}M_(e){this.state==="Online"?this.C_("Unknown"):(this.S_++,this.S_>=1&&(this.x_(),this.F_(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.C_("Offline")))}set(e){this.x_(),this.S_=0,e==="Online"&&(this.D_=!1),this.C_(e)}C_(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}F_(e){const t=`Could not reach Cloud Firestore backend. ${e}
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
 */class dw{constructor(e,t,s,r,i){this.localStore=e,this.datastore=t,this.asyncQueue=s,this.remoteSyncer={},this.O_=[],this.N_=new Map,this.L_=new Set,this.B_=[],this.k_=i,this.k_._o(a=>{s.enqueueAndForget(async()=>{hs(this)&&(U("RemoteStore","Restarting streams for network reachability change."),await async function(c){const d=K(c);d.L_.add(4),await li(d),d.q_.set("Unknown"),d.L_.delete(4),await Mo(d)}(this))})}),this.q_=new uw(s,r)}}async function Mo(n){if(hs(n))for(const e of n.B_)await e(!0)}async function li(n){for(const e of n.B_)await e(!1)}function hf(n,e){const t=K(n);t.N_.has(e.targetId)||(t.N_.set(e.targetId,e),Hl(t)?ql(t):nr(t).r_()&&$l(t,e))}function Ul(n,e){const t=K(n),s=nr(t);t.N_.delete(e),s.r_()&&ff(t,e),t.N_.size===0&&(s.r_()?s.o_():hs(t)&&t.q_.set("Unknown"))}function $l(n,e){if(n.Q_.xe(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(G.min())>0){const t=n.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}nr(n).A_(e)}function ff(n,e){n.Q_.xe(e),nr(n).R_(e)}function ql(n){n.Q_=new h_({getRemoteKeysForTarget:e=>n.remoteSyncer.getRemoteKeysForTarget(e),ot:e=>n.N_.get(e)||null,tt:()=>n.datastore.serializer.databaseId}),nr(n).start(),n.q_.v_()}function Hl(n){return hs(n)&&!nr(n).n_()&&n.N_.size>0}function hs(n){return K(n).L_.size===0}function pf(n){n.Q_=void 0}async function hw(n){n.q_.set("Online")}async function fw(n){n.N_.forEach((e,t)=>{$l(n,e)})}async function pw(n,e){pf(n),Hl(n)?(n.q_.M_(e),ql(n)):n.q_.set("Unknown")}async function mw(n,e,t){if(n.q_.set("Online"),e instanceof Zh&&e.state===2&&e.cause)try{await async function(r,i){const a=i.cause;for(const l of i.targetIds)r.N_.has(l)&&(await r.remoteSyncer.rejectListen(l,a),r.N_.delete(l),r.Q_.removeTarget(l))}(n,e)}catch(s){U("RemoteStore","Failed to remove targets %s: %s ",e.targetIds.join(","),s),await uo(n,s)}else if(e instanceof Hi?n.Q_.Ke(e):e instanceof Xh?n.Q_.He(e):n.Q_.We(e),!t.isEqual(G.min()))try{const s=await cf(n.localStore);t.compareTo(s)>=0&&await function(i,a){const l=i.Q_.rt(a);return l.targetChanges.forEach((c,d)=>{if(c.resumeToken.approximateByteSize()>0){const f=i.N_.get(d);f&&i.N_.set(d,f.withResumeToken(c.resumeToken,a))}}),l.targetMismatches.forEach((c,d)=>{const f=i.N_.get(c);if(!f)return;i.N_.set(c,f.withResumeToken(We.EMPTY_BYTE_STRING,f.snapshotVersion)),ff(i,c);const m=new xn(f.target,c,d,f.sequenceNumber);$l(i,m)}),i.remoteSyncer.applyRemoteEvent(l)}(n,t)}catch(s){U("RemoteStore","Failed to raise snapshot:",s),await uo(n,s)}}async function uo(n,e,t){if(!ii(e))throw e;n.L_.add(1),await li(n),n.q_.set("Offline"),t||(t=()=>cf(n.localStore)),n.asyncQueue.enqueueRetryable(async()=>{U("RemoteStore","Retrying IndexedDB access"),await t(),n.L_.delete(1),await Mo(n)})}function mf(n,e){return e().catch(t=>uo(n,t,e))}async function Do(n){const e=K(n),t=Bn(e);let s=e.O_.length>0?e.O_[e.O_.length-1].batchId:-1;for(;gw(e);)try{const r=await Z_(e.localStore,s);if(r===null){e.O_.length===0&&t.o_();break}s=r.batchId,yw(e,r)}catch(r){await uo(e,r)}gf(e)&&yf(e)}function gw(n){return hs(n)&&n.O_.length<10}function yw(n,e){n.O_.push(e);const t=Bn(n);t.r_()&&t.V_&&t.m_(e.mutations)}function gf(n){return hs(n)&&!Bn(n).n_()&&n.O_.length>0}function yf(n){Bn(n).start()}async function vw(n){Bn(n).p_()}async function _w(n){const e=Bn(n);for(const t of n.O_)e.m_(t.mutations)}async function ww(n,e,t){const s=n.O_.shift(),r=Ll.from(s,e,t);await mf(n,()=>n.remoteSyncer.applySuccessfulWrite(r)),await Do(n)}async function bw(n,e){e&&Bn(n).V_&&await async function(s,r){if(function(a){return c_(a)&&a!==N.ABORTED}(r.code)){const i=s.O_.shift();Bn(s).s_(),await mf(s,()=>s.remoteSyncer.rejectFailedWrite(i.batchId,r)),await Do(s)}}(n,e),gf(n)&&yf(n)}async function id(n,e){const t=K(n);t.asyncQueue.verifyOperationInProgress(),U("RemoteStore","RemoteStore received new credentials");const s=hs(t);t.L_.add(3),await li(t),s&&t.q_.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.L_.delete(3),await Mo(t)}async function Ew(n,e){const t=K(n);e?(t.L_.delete(2),await Mo(t)):e||(t.L_.add(2),await li(t),t.q_.set("Unknown"))}function nr(n){return n.K_||(n.K_=function(t,s,r){const i=K(t);return i.w_(),new aw(s,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,r)}(n.datastore,n.asyncQueue,{Eo:hw.bind(null,n),Ro:fw.bind(null,n),mo:pw.bind(null,n),d_:mw.bind(null,n)}),n.B_.push(async e=>{e?(n.K_.s_(),Hl(n)?ql(n):n.q_.set("Unknown")):(await n.K_.stop(),pf(n))})),n.K_}function Bn(n){return n.U_||(n.U_=function(t,s,r){const i=K(t);return i.w_(),new lw(s,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,r)}(n.datastore,n.asyncQueue,{Eo:()=>Promise.resolve(),Ro:vw.bind(null,n),mo:bw.bind(null,n),f_:_w.bind(null,n),g_:ww.bind(null,n)}),n.B_.push(async e=>{e?(n.U_.s_(),await Do(n)):(await n.U_.stop(),n.O_.length>0&&(U("RemoteStore",`Stopping write stream with ${n.O_.length} pending writes`),n.O_=[]))})),n.U_}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jl{constructor(e,t,s,r,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=s,this.op=r,this.removalCallback=i,this.deferred=new sn,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(a=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,s,r,i){const a=Date.now()+s,l=new jl(e,t,a,r,i);return l.start(s),l}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new $(N.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Wl(n,e){if(an("AsyncQueue",`${e}: ${n}`),ii(n))return new $(N.UNAVAILABLE,`${e}: ${n}`);throw n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vs{constructor(e){this.comparator=e?(t,s)=>e(t,s)||q.comparator(t.key,s.key):(t,s)=>q.comparator(t.key,s.key),this.keyedMap=Ar(),this.sortedSet=new be(this.comparator)}static emptySet(e){return new Vs(e.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((t,s)=>(e(t),!1))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof Vs)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),s=e.sortedSet.getIterator();for(;t.hasNext();){const r=t.getNext().key,i=s.getNext().key;if(!r.isEqual(i))return!1}return!0}toString(){const e=[];return this.forEach(t=>{e.push(t.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const s=new Vs;return s.comparator=this.comparator,s.keyedMap=e,s.sortedSet=t,s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class od{constructor(){this.W_=new be(q.comparator)}track(e){const t=e.doc.key,s=this.W_.get(t);s?e.type!==0&&s.type===3?this.W_=this.W_.insert(t,e):e.type===3&&s.type!==1?this.W_=this.W_.insert(t,{type:s.type,doc:e.doc}):e.type===2&&s.type===2?this.W_=this.W_.insert(t,{type:2,doc:e.doc}):e.type===2&&s.type===0?this.W_=this.W_.insert(t,{type:0,doc:e.doc}):e.type===1&&s.type===0?this.W_=this.W_.remove(t):e.type===1&&s.type===2?this.W_=this.W_.insert(t,{type:1,doc:s.doc}):e.type===0&&s.type===1?this.W_=this.W_.insert(t,{type:2,doc:e.doc}):W():this.W_=this.W_.insert(t,e)}G_(){const e=[];return this.W_.inorderTraversal((t,s)=>{e.push(s)}),e}}class Gs{constructor(e,t,s,r,i,a,l,c,d){this.query=e,this.docs=t,this.oldDocs=s,this.docChanges=r,this.mutatedKeys=i,this.fromCache=a,this.syncStateChanged=l,this.excludesMetadataChanges=c,this.hasCachedResults=d}static fromInitialDocuments(e,t,s,r,i){const a=[];return t.forEach(l=>{a.push({type:0,doc:l})}),new Gs(e,t,Vs.emptySet(t),a,s,r,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&So(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,s=e.docChanges;if(t.length!==s.length)return!1;for(let r=0;r<t.length;r++)if(t[r].type!==s[r].type||!t[r].doc.isEqual(s[r].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tw{constructor(){this.z_=void 0,this.j_=[]}H_(){return this.j_.some(e=>e.J_())}}class Iw{constructor(){this.queries=ad(),this.onlineState="Unknown",this.Y_=new Set}terminate(){(function(t,s){const r=K(t),i=r.queries;r.queries=ad(),i.forEach((a,l)=>{for(const c of l.j_)c.onError(s)})})(this,new $(N.ABORTED,"Firestore shutting down"))}}function ad(){return new tr(n=>Fh(n),So)}async function vf(n,e){const t=K(n);let s=3;const r=e.query;let i=t.queries.get(r);i?!i.H_()&&e.J_()&&(s=2):(i=new Tw,s=e.J_()?0:1);try{switch(s){case 0:i.z_=await t.onListen(r,!0);break;case 1:i.z_=await t.onListen(r,!1);break;case 2:await t.onFirstRemoteStoreListen(r)}}catch(a){const l=Wl(a,`Initialization of query '${Ps(e.query)}' failed`);return void e.onError(l)}t.queries.set(r,i),i.j_.push(e),e.Z_(t.onlineState),i.z_&&e.X_(i.z_)&&Yl(t)}async function _f(n,e){const t=K(n),s=e.query;let r=3;const i=t.queries.get(s);if(i){const a=i.j_.indexOf(e);a>=0&&(i.j_.splice(a,1),i.j_.length===0?r=e.J_()?0:1:!i.H_()&&e.J_()&&(r=2))}switch(r){case 0:return t.queries.delete(s),t.onUnlisten(s,!0);case 1:return t.queries.delete(s),t.onUnlisten(s,!1);case 2:return t.onLastRemoteStoreUnlisten(s);default:return}}function Sw(n,e){const t=K(n);let s=!1;for(const r of e){const i=r.query,a=t.queries.get(i);if(a){for(const l of a.j_)l.X_(r)&&(s=!0);a.z_=r}}s&&Yl(t)}function xw(n,e,t){const s=K(n),r=s.queries.get(e);if(r)for(const i of r.j_)i.onError(t);s.queries.delete(e)}function Yl(n){n.Y_.forEach(e=>{e.next()})}var el,ld;(ld=el||(el={})).ea="default",ld.Cache="cache";class wf{constructor(e,t,s){this.query=e,this.ta=t,this.na=!1,this.ra=null,this.onlineState="Unknown",this.options=s||{}}X_(e){if(!this.options.includeMetadataChanges){const s=[];for(const r of e.docChanges)r.type!==3&&s.push(r);e=new Gs(e.query,e.docs,e.oldDocs,s,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.na?this.ia(e)&&(this.ta.next(e),t=!0):this.sa(e,this.onlineState)&&(this.oa(e),t=!0),this.ra=e,t}onError(e){this.ta.error(e)}Z_(e){this.onlineState=e;let t=!1;return this.ra&&!this.na&&this.sa(this.ra,e)&&(this.oa(this.ra),t=!0),t}sa(e,t){if(!e.fromCache||!this.J_())return!0;const s=t!=="Offline";return(!this.options._a||!s)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}ia(e){if(e.docChanges.length>0)return!0;const t=this.ra&&this.ra.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}oa(e){e=Gs.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.na=!0,this.ta.next(e)}J_(){return this.options.source!==el.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bf{constructor(e){this.key=e}}class Ef{constructor(e){this.key=e}}class Aw{constructor(e,t){this.query=e,this.Ta=t,this.Ea=null,this.hasCachedResults=!1,this.current=!1,this.da=se(),this.mutatedKeys=se(),this.Aa=zh(e),this.Ra=new Vs(this.Aa)}get Va(){return this.Ta}ma(e,t){const s=t?t.fa:new od,r=t?t.Ra:this.Ra;let i=t?t.mutatedKeys:this.mutatedKeys,a=r,l=!1;const c=this.query.limitType==="F"&&r.size===this.query.limit?r.last():null,d=this.query.limitType==="L"&&r.size===this.query.limit?r.first():null;if(e.inorderTraversal((f,m)=>{const y=r.get(f),b=xo(this.query,m)?m:null,T=!!y&&this.mutatedKeys.has(y.key),R=!!b&&(b.hasLocalMutations||this.mutatedKeys.has(b.key)&&b.hasCommittedMutations);let x=!1;y&&b?y.data.isEqual(b.data)?T!==R&&(s.track({type:3,doc:b}),x=!0):this.ga(y,b)||(s.track({type:2,doc:b}),x=!0,(c&&this.Aa(b,c)>0||d&&this.Aa(b,d)<0)&&(l=!0)):!y&&b?(s.track({type:0,doc:b}),x=!0):y&&!b&&(s.track({type:1,doc:y}),x=!0,(c||d)&&(l=!0)),x&&(b?(a=a.add(b),i=R?i.add(f):i.delete(f)):(a=a.delete(f),i=i.delete(f)))}),this.query.limit!==null)for(;a.size>this.query.limit;){const f=this.query.limitType==="F"?a.last():a.first();a=a.delete(f.key),i=i.delete(f.key),s.track({type:1,doc:f})}return{Ra:a,fa:s,ns:l,mutatedKeys:i}}ga(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,s,r){const i=this.Ra;this.Ra=e.Ra,this.mutatedKeys=e.mutatedKeys;const a=e.fa.G_();a.sort((f,m)=>function(b,T){const R=x=>{switch(x){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return W()}};return R(b)-R(T)}(f.type,m.type)||this.Aa(f.doc,m.doc)),this.pa(s),r=r!=null&&r;const l=t&&!r?this.ya():[],c=this.da.size===0&&this.current&&!r?1:0,d=c!==this.Ea;return this.Ea=c,a.length!==0||d?{snapshot:new Gs(this.query,e.Ra,i,a,e.mutatedKeys,c===0,d,!1,!!s&&s.resumeToken.approximateByteSize()>0),wa:l}:{wa:l}}Z_(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Ra:this.Ra,fa:new od,mutatedKeys:this.mutatedKeys,ns:!1},!1)):{wa:[]}}Sa(e){return!this.Ta.has(e)&&!!this.Ra.has(e)&&!this.Ra.get(e).hasLocalMutations}pa(e){e&&(e.addedDocuments.forEach(t=>this.Ta=this.Ta.add(t)),e.modifiedDocuments.forEach(t=>{}),e.removedDocuments.forEach(t=>this.Ta=this.Ta.delete(t)),this.current=e.current)}ya(){if(!this.current)return[];const e=this.da;this.da=se(),this.Ra.forEach(s=>{this.Sa(s.key)&&(this.da=this.da.add(s.key))});const t=[];return e.forEach(s=>{this.da.has(s)||t.push(new Ef(s))}),this.da.forEach(s=>{e.has(s)||t.push(new bf(s))}),t}ba(e){this.Ta=e.Ts,this.da=se();const t=this.ma(e.documents);return this.applyChanges(t,!0)}Da(){return Gs.fromInitialDocuments(this.query,this.Ra,this.mutatedKeys,this.Ea===0,this.hasCachedResults)}}class Rw{constructor(e,t,s){this.query=e,this.targetId=t,this.view=s}}class Pw{constructor(e){this.key=e,this.va=!1}}class Cw{constructor(e,t,s,r,i,a){this.localStore=e,this.remoteStore=t,this.eventManager=s,this.sharedClientState=r,this.currentUser=i,this.maxConcurrentLimboResolutions=a,this.Ca={},this.Fa=new tr(l=>Fh(l),So),this.Ma=new Map,this.xa=new Set,this.Oa=new be(q.comparator),this.Na=new Map,this.La=new Bl,this.Ba={},this.ka=new Map,this.qa=Ys.kn(),this.onlineState="Unknown",this.Qa=void 0}get isPrimaryClient(){return this.Qa===!0}}async function kw(n,e,t=!0){const s=Rf(n);let r;const i=s.Fa.get(e);return i?(s.sharedClientState.addLocalQueryTarget(i.targetId),r=i.view.Da()):r=await Tf(s,e,t,!0),r}async function Mw(n,e){const t=Rf(n);await Tf(t,e,!0,!1)}async function Tf(n,e,t,s){const r=await ew(n.localStore,Bt(e)),i=r.targetId,a=n.sharedClientState.addLocalQueryTarget(i,t);let l;return s&&(l=await Dw(n,e,i,a==="current",r.resumeToken)),n.isPrimaryClient&&t&&hf(n.remoteStore,r),l}async function Dw(n,e,t,s,r){n.Ka=(m,y,b)=>async function(R,x,S,M){let D=x.view.ma(S);D.ns&&(D=await nd(R.localStore,x.query,!1).then(({documents:w})=>x.view.ma(w,D)));const C=M&&M.targetChanges.get(x.targetId),O=M&&M.targetMismatches.get(x.targetId)!=null,F=x.view.applyChanges(D,R.isPrimaryClient,C,O);return ud(R,x.targetId,F.wa),F.snapshot}(n,m,y,b);const i=await nd(n.localStore,e,!0),a=new Aw(e,i.Ts),l=a.ma(i.documents),c=ai.createSynthesizedTargetChangeForCurrentChange(t,s&&n.onlineState!=="Offline",r),d=a.applyChanges(l,n.isPrimaryClient,c);ud(n,t,d.wa);const f=new Rw(e,t,a);return n.Fa.set(e,f),n.Ma.has(t)?n.Ma.get(t).push(e):n.Ma.set(t,[e]),d.snapshot}async function Nw(n,e,t){const s=K(n),r=s.Fa.get(e),i=s.Ma.get(r.targetId);if(i.length>1)return s.Ma.set(r.targetId,i.filter(a=>!So(a,e))),void s.Fa.delete(e);s.isPrimaryClient?(s.sharedClientState.removeLocalQueryTarget(r.targetId),s.sharedClientState.isActiveQueryTarget(r.targetId)||await Za(s.localStore,r.targetId,!1).then(()=>{s.sharedClientState.clearQueryState(r.targetId),t&&Ul(s.remoteStore,r.targetId),tl(s,r.targetId)}).catch(ri)):(tl(s,r.targetId),await Za(s.localStore,r.targetId,!0))}async function Lw(n,e){const t=K(n),s=t.Fa.get(e),r=t.Ma.get(s.targetId);t.isPrimaryClient&&r.length===1&&(t.sharedClientState.removeLocalQueryTarget(s.targetId),Ul(t.remoteStore,s.targetId))}async function Ow(n,e,t){const s=qw(n);try{const r=await function(a,l){const c=K(a),d=Oe.now(),f=l.reduce((b,T)=>b.add(T.key),se());let m,y;return c.persistence.runTransaction("Locally write mutations","readwrite",b=>{let T=ln(),R=se();return c.cs.getEntries(b,f).next(x=>{T=x,T.forEach((S,M)=>{M.isValidDocument()||(R=R.add(S))})}).next(()=>c.localDocuments.getOverlayedDocuments(b,T)).next(x=>{m=x;const S=[];for(const M of l){const D=r_(M,m.get(M.key).overlayedDocument);D!=null&&S.push(new zn(M.key,D,Mh(D.value.mapValue),rt.exists(!0)))}return c.mutationQueue.addMutationBatch(b,d,S,l)}).next(x=>{y=x;const S=x.applyToLocalDocumentSet(m,R);return c.documentOverlayCache.saveOverlays(b,x.batchId,S)})}).then(()=>({batchId:y.batchId,changes:$h(m)}))}(s.localStore,e);s.sharedClientState.addPendingMutation(r.batchId),function(a,l,c){let d=a.Ba[a.currentUser.toKey()];d||(d=new be(le)),d=d.insert(l,c),a.Ba[a.currentUser.toKey()]=d}(s,r.batchId,t),await ci(s,r.changes),await Do(s.remoteStore)}catch(r){const i=Wl(r,"Failed to persist write");t.reject(i)}}async function If(n,e){const t=K(n);try{const s=await J_(t.localStore,e);e.targetChanges.forEach((r,i)=>{const a=t.Na.get(i);a&&(ue(r.addedDocuments.size+r.modifiedDocuments.size+r.removedDocuments.size<=1),r.addedDocuments.size>0?a.va=!0:r.modifiedDocuments.size>0?ue(a.va):r.removedDocuments.size>0&&(ue(a.va),a.va=!1))}),await ci(t,s,e)}catch(s){await ri(s)}}function cd(n,e,t){const s=K(n);if(s.isPrimaryClient&&t===0||!s.isPrimaryClient&&t===1){const r=[];s.Fa.forEach((i,a)=>{const l=a.view.Z_(e);l.snapshot&&r.push(l.snapshot)}),function(a,l){const c=K(a);c.onlineState=l;let d=!1;c.queries.forEach((f,m)=>{for(const y of m.j_)y.Z_(l)&&(d=!0)}),d&&Yl(c)}(s.eventManager,e),r.length&&s.Ca.d_(r),s.onlineState=e,s.isPrimaryClient&&s.sharedClientState.setOnlineState(e)}}async function Vw(n,e,t){const s=K(n);s.sharedClientState.updateQueryState(e,"rejected",t);const r=s.Na.get(e),i=r&&r.key;if(i){let a=new be(q.comparator);a=a.insert(i,Ze.newNoDocument(i,G.min()));const l=se().add(i),c=new Co(G.min(),new Map,new be(le),a,l);await If(s,c),s.Oa=s.Oa.remove(i),s.Na.delete(e),Gl(s)}else await Za(s.localStore,e,!1).then(()=>tl(s,e,t)).catch(ri)}async function Bw(n,e){const t=K(n),s=e.batch.batchId;try{const r=await Q_(t.localStore,e);xf(t,s,null),Sf(t,s),t.sharedClientState.updateMutationState(s,"acknowledged"),await ci(t,r)}catch(r){await ri(r)}}async function Fw(n,e,t){const s=K(n);try{const r=await function(a,l){const c=K(a);return c.persistence.runTransaction("Reject batch","readwrite-primary",d=>{let f;return c.mutationQueue.lookupMutationBatch(d,l).next(m=>(ue(m!==null),f=m.keys(),c.mutationQueue.removeMutationBatch(d,m))).next(()=>c.mutationQueue.performConsistencyCheck(d)).next(()=>c.documentOverlayCache.removeOverlaysForBatchId(d,f,l)).next(()=>c.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(d,f)).next(()=>c.localDocuments.getDocuments(d,f))})}(s.localStore,e);xf(s,e,t),Sf(s,e),s.sharedClientState.updateMutationState(e,"rejected",t),await ci(s,r)}catch(r){await ri(r)}}function Sf(n,e){(n.ka.get(e)||[]).forEach(t=>{t.resolve()}),n.ka.delete(e)}function xf(n,e,t){const s=K(n);let r=s.Ba[s.currentUser.toKey()];if(r){const i=r.get(e);i&&(t?i.reject(t):i.resolve(),r=r.remove(e)),s.Ba[s.currentUser.toKey()]=r}}function tl(n,e,t=null){n.sharedClientState.removeLocalQueryTarget(e);for(const s of n.Ma.get(e))n.Fa.delete(s),t&&n.Ca.$a(s,t);n.Ma.delete(e),n.isPrimaryClient&&n.La.gr(e).forEach(s=>{n.La.containsKey(s)||Af(n,s)})}function Af(n,e){n.xa.delete(e.path.canonicalString());const t=n.Oa.get(e);t!==null&&(Ul(n.remoteStore,t),n.Oa=n.Oa.remove(e),n.Na.delete(t),Gl(n))}function ud(n,e,t){for(const s of t)s instanceof bf?(n.La.addReference(s.key,e),zw(n,s)):s instanceof Ef?(U("SyncEngine","Document no longer in limbo: "+s.key),n.La.removeReference(s.key,e),n.La.containsKey(s.key)||Af(n,s.key)):W()}function zw(n,e){const t=e.key,s=t.path.canonicalString();n.Oa.get(t)||n.xa.has(s)||(U("SyncEngine","New document in limbo: "+t),n.xa.add(s),Gl(n))}function Gl(n){for(;n.xa.size>0&&n.Oa.size<n.maxConcurrentLimboResolutions;){const e=n.xa.values().next().value;n.xa.delete(e);const t=new q(ve.fromString(e)),s=n.qa.next();n.Na.set(s,new Pw(t)),n.Oa=n.Oa.insert(t,s),hf(n.remoteStore,new xn(Bt(Dl(t.path)),s,"TargetPurposeLimboResolution",Al.oe))}}async function ci(n,e,t){const s=K(n),r=[],i=[],a=[];s.Fa.isEmpty()||(s.Fa.forEach((l,c)=>{a.push(s.Ka(c,e,t).then(d=>{var f;if((d||t)&&s.isPrimaryClient){const m=d?!d.fromCache:(f=t==null?void 0:t.targetChanges.get(c.targetId))===null||f===void 0?void 0:f.current;s.sharedClientState.updateQueryState(c.targetId,m?"current":"not-current")}if(d){r.push(d);const m=zl.Wi(c.targetId,d);i.push(m)}}))}),await Promise.all(a),s.Ca.d_(r),await async function(c,d){const f=K(c);try{await f.persistence.runTransaction("notifyLocalViewChanges","readwrite",m=>L.forEach(d,y=>L.forEach(y.$i,b=>f.persistence.referenceDelegate.addReference(m,y.targetId,b)).next(()=>L.forEach(y.Ui,b=>f.persistence.referenceDelegate.removeReference(m,y.targetId,b)))))}catch(m){if(!ii(m))throw m;U("LocalStore","Failed to update sequence numbers: "+m)}for(const m of d){const y=m.targetId;if(!m.fromCache){const b=f.os.get(y),T=b.snapshotVersion,R=b.withLastLimboFreeSnapshotVersion(T);f.os=f.os.insert(y,R)}}}(s.localStore,i))}async function Uw(n,e){const t=K(n);if(!t.currentUser.isEqual(e)){U("SyncEngine","User change. New user:",e.toKey());const s=await lf(t.localStore,e);t.currentUser=e,function(i,a){i.ka.forEach(l=>{l.forEach(c=>{c.reject(new $(N.CANCELLED,a))})}),i.ka.clear()}(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,s.removedBatchIds,s.addedBatchIds),await ci(t,s.hs)}}function $w(n,e){const t=K(n),s=t.Na.get(e);if(s&&s.va)return se().add(s.key);{let r=se();const i=t.Ma.get(e);if(!i)return r;for(const a of i){const l=t.Fa.get(a);r=r.unionWith(l.view.Va)}return r}}function Rf(n){const e=K(n);return e.remoteStore.remoteSyncer.applyRemoteEvent=If.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=$w.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=Vw.bind(null,e),e.Ca.d_=Sw.bind(null,e.eventManager),e.Ca.$a=xw.bind(null,e.eventManager),e}function qw(n){const e=K(n);return e.remoteStore.remoteSyncer.applySuccessfulWrite=Bw.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=Fw.bind(null,e),e}class ho{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=ko(e.databaseInfo.databaseId),this.sharedClientState=this.Wa(e),this.persistence=this.Ga(e),await this.persistence.start(),this.localStore=this.za(e),this.gcScheduler=this.ja(e,this.localStore),this.indexBackfillerScheduler=this.Ha(e,this.localStore)}ja(e,t){return null}Ha(e,t){return null}za(e){return K_(this.persistence,new Y_,e.initialUser,this.serializer)}Ga(e){return new H_(Fl.Zr,this.serializer)}Wa(e){return new nw}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}ho.provider={build:()=>new ho};class nl{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=s=>cd(this.syncEngine,s,1),this.remoteStore.remoteSyncer.handleCredentialChange=Uw.bind(null,this.syncEngine),await Ew(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new Iw}()}createDatastore(e){const t=ko(e.databaseInfo.databaseId),s=function(i){return new ow(i)}(e.databaseInfo);return function(i,a,l,c){return new cw(i,a,l,c)}(e.authCredentials,e.appCheckCredentials,s,t)}createRemoteStore(e){return function(s,r,i,a,l){return new dw(s,r,i,a,l)}(this.localStore,this.datastore,e.asyncQueue,t=>cd(this.syncEngine,t,0),function(){return rd.D()?new rd:new sw}())}createSyncEngine(e,t){return function(r,i,a,l,c,d,f){const m=new Cw(r,i,a,l,c,d);return f&&(m.Qa=!0),m}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await async function(r){const i=K(r);U("RemoteStore","RemoteStore shutting down."),i.L_.add(5),await li(i),i.k_.shutdown(),i.q_.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}}nl.provider={build:()=>new nl};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class Pf{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ya(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ya(this.observer.error,e):an("Uncaught Error in snapshot listener:",e.toString()))}Za(){this.muted=!0}Ya(e,t){setTimeout(()=>{this.muted||e(t)},0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hw{constructor(e,t,s,r,i){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=s,this.databaseInfo=r,this.user=Xe.UNAUTHENTICATED,this.clientId=Ph.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(s,async a=>{U("FirestoreClient","Received user=",a.uid),await this.authCredentialListener(a),this.user=a}),this.appCheckCredentials.start(s,a=>(U("FirestoreClient","Received new app check token=",a),this.appCheckCredentialListener(a,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new sn;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const s=Wl(t,"Failed to shutdown persistence");e.reject(s)}}),e.promise}}async function Aa(n,e){n.asyncQueue.verifyOperationInProgress(),U("FirestoreClient","Initializing OfflineComponentProvider");const t=n.configuration;await e.initialize(t);let s=t.initialUser;n.setCredentialChangeListener(async r=>{s.isEqual(r)||(await lf(e.localStore,r),s=r)}),e.persistence.setDatabaseDeletedListener(()=>n.terminate()),n._offlineComponents=e}async function dd(n,e){n.asyncQueue.verifyOperationInProgress();const t=await jw(n);U("FirestoreClient","Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener(s=>id(e.remoteStore,s)),n.setAppCheckTokenChangeListener((s,r)=>id(e.remoteStore,r)),n._onlineComponents=e}async function jw(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){U("FirestoreClient","Using user provided OfflineComponentProvider");try{await Aa(n,n._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!function(r){return r.name==="FirebaseError"?r.code===N.FAILED_PRECONDITION||r.code===N.UNIMPLEMENTED:!(typeof DOMException<"u"&&r instanceof DOMException)||r.code===22||r.code===20||r.code===11}(t))throw t;qs("Error using user provided cache. Falling back to memory cache: "+t),await Aa(n,new ho)}}else U("FirestoreClient","Using default OfflineComponentProvider"),await Aa(n,new ho);return n._offlineComponents}async function Cf(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(U("FirestoreClient","Using user provided OnlineComponentProvider"),await dd(n,n._uninitializedComponentsProvider._online)):(U("FirestoreClient","Using default OnlineComponentProvider"),await dd(n,new nl))),n._onlineComponents}function Ww(n){return Cf(n).then(e=>e.syncEngine)}async function kf(n){const e=await Cf(n),t=e.eventManager;return t.onListen=kw.bind(null,e.syncEngine),t.onUnlisten=Nw.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=Mw.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=Lw.bind(null,e.syncEngine),t}function Yw(n,e,t={}){const s=new sn;return n.asyncQueue.enqueueAndForget(async()=>function(i,a,l,c,d){const f=new Pf({next:y=>{f.Za(),a.enqueueAndForget(()=>_f(i,m));const b=y.docs.has(l);!b&&y.fromCache?d.reject(new $(N.UNAVAILABLE,"Failed to get document because the client is offline.")):b&&y.fromCache&&c&&c.source==="server"?d.reject(new $(N.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):d.resolve(y)},error:y=>d.reject(y)}),m=new wf(Dl(l.path),f,{includeMetadataChanges:!0,_a:!0});return vf(i,m)}(await kf(n),n.asyncQueue,e,t,s)),s.promise}function Gw(n,e,t={}){const s=new sn;return n.asyncQueue.enqueueAndForget(async()=>function(i,a,l,c,d){const f=new Pf({next:y=>{f.Za(),a.enqueueAndForget(()=>_f(i,m)),y.fromCache&&c.source==="server"?d.reject(new $(N.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):d.resolve(y)},error:y=>d.reject(y)}),m=new wf(l,f,{includeMetadataChanges:!0,_a:!0});return vf(i,m)}(await kf(n),n.asyncQueue,e,t,s)),s.promise}/**
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
 */function Mf(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hd=new Map;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Df(n,e,t){if(!t)throw new $(N.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function Kw(n,e,t,s){if(e===!0&&s===!0)throw new $(N.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function fd(n){if(!q.isDocumentKey(n))throw new $(N.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function pd(n){if(q.isDocumentKey(n))throw new $(N.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function Kl(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=function(s){return s.constructor?s.constructor.name:null}(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":W()}function Tt(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new $(N.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Kl(n);throw new $(N.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class md{constructor(e){var t,s;if(e.host===void 0){if(e.ssl!==void 0)throw new $(N.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(t=e.ssl)===null||t===void 0||t;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new $(N.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}Kw("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Mf((s=e.experimentalLongPollingOptions)!==null&&s!==void 0?s:{}),function(i){if(i.timeoutSeconds!==void 0){if(isNaN(i.timeoutSeconds))throw new $(N.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (must not be NaN)`);if(i.timeoutSeconds<5)throw new $(N.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (minimum allowed value is 5)`);if(i.timeoutSeconds>30)throw new $(N.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(s,r){return s.timeoutSeconds===r.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class No{constructor(e,t,s,r){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=s,this._app=r,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new md({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new $(N.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new $(N.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new md(e),e.credentials!==void 0&&(this._authCredentials=function(s){if(!s)return new h0;switch(s.type){case"firstParty":return new g0(s.sessionIndex||"0",s.iamToken||null,s.authTokenFactory||null);case"provider":return s.client;default:throw new $(N.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(t){const s=hd.get(t);s&&(U("ComponentProvider","Removing Datastore"),hd.delete(t),s.terminate())}(this),Promise.resolve()}}function Qw(n,e,t,s={}){var r;const i=(n=Tt(n,No))._getSettings(),a=`${e}:${t}`;if(i.host!=="firestore.googleapis.com"&&i.host!==a&&qs("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),n._setSettings(Object.assign(Object.assign({},i),{host:a,ssl:!1})),s.mockUserToken){let l,c;if(typeof s.mockUserToken=="string")l=s.mockUserToken,c=Xe.MOCK_USER;else{l=bm(s.mockUserToken,(r=n._app)===null||r===void 0?void 0:r.options.projectId);const d=s.mockUserToken.sub||s.mockUserToken.user_id;if(!d)throw new $(N.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");c=new Xe(d)}n._authCredentials=new f0(new Rh(l,c))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lo{constructor(e,t,s){this.converter=t,this._query=s,this.type="query",this.firestore=e}withConverter(e){return new Lo(this.firestore,e,this._query)}}class ut{constructor(e,t,s){this.converter=t,this._key=s,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Mn(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new ut(this.firestore,e,this._key)}}class Mn extends Lo{constructor(e,t,s){super(e,t,Dl(s)),this._path=s,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new ut(this.firestore,null,new q(e))}withConverter(e){return new Mn(this.firestore,e,this._path)}}function Jw(n,e,...t){if(n=ke(n),Df("collection","path",e),n instanceof No){const s=ve.fromString(e,...t);return pd(s),new Mn(n,null,s)}{if(!(n instanceof ut||n instanceof Mn))throw new $(N.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=n._path.child(ve.fromString(e,...t));return pd(s),new Mn(n.firestore,null,s)}}function Ks(n,e,...t){if(n=ke(n),arguments.length===1&&(e=Ph.newId()),Df("doc","path",e),n instanceof No){const s=ve.fromString(e,...t);return fd(s),new ut(n,null,new q(s))}{if(!(n instanceof ut||n instanceof Mn))throw new $(N.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=n._path.child(ve.fromString(e,...t));return fd(s),new ut(n.firestore,n instanceof Mn?n.converter:null,new q(s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gd{constructor(e=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new uf(this,"async_queue_retry"),this.Vu=()=>{const s=xa();s&&U("AsyncQueue","Visibility state changed to "+s.visibilityState),this.t_.jo()},this.mu=e;const t=xa();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.fu(),this.gu(e)}enterRestrictedMode(e){if(!this.Iu){this.Iu=!0,this.Au=e||!1;const t=xa();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.Vu)}}enqueue(e){if(this.fu(),this.Iu)return new Promise(()=>{});const t=new sn;return this.gu(()=>this.Iu&&this.Au?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Pu.push(e),this.pu()))}async pu(){if(this.Pu.length!==0){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(e){if(!ii(e))throw e;U("AsyncQueue","Operation failed with retryable error: "+e)}this.Pu.length>0&&this.t_.Go(()=>this.pu())}}gu(e){const t=this.mu.then(()=>(this.du=!0,e().catch(s=>{this.Eu=s,this.du=!1;const r=function(a){let l=a.message||"";return a.stack&&(l=a.stack.includes(a.message)?a.stack:a.message+`
`+a.stack),l}(s);throw an("INTERNAL UNHANDLED ERROR: ",r),s}).then(s=>(this.du=!1,s))));return this.mu=t,t}enqueueAfterDelay(e,t,s){this.fu(),this.Ru.indexOf(e)>-1&&(t=0);const r=jl.createAndSchedule(this,e,t,s,i=>this.yu(i));return this.Tu.push(r),r}fu(){this.Eu&&W()}verifyOperationInProgress(){}async wu(){let e;do e=this.mu,await e;while(e!==this.mu)}Su(e){for(const t of this.Tu)if(t.timerId===e)return!0;return!1}bu(e){return this.wu().then(()=>{this.Tu.sort((t,s)=>t.targetTimeMs-s.targetTimeMs);for(const t of this.Tu)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.wu()})}Du(e){this.Ru.push(e)}yu(e){const t=this.Tu.indexOf(e);this.Tu.splice(t,1)}}class Un extends No{constructor(e,t,s,r){super(e,t,s,r),this.type="firestore",this._queue=new gd,this._persistenceKey=(r==null?void 0:r.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new gd(e),this._firestoreClient=void 0,await e}}}function Xw(n,e){const t=typeof n=="object"?n:zd(),s=typeof n=="string"?n:"(default)",r=pl(t,"firestore").getImmediate({identifier:s});if(!r._initialized){const i=_m("firestore");i&&Qw(r,...i)}return r}function Oo(n){if(n._terminated)throw new $(N.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||Zw(n),n._firestoreClient}function Zw(n){var e,t,s;const r=n._freezeSettings(),i=function(l,c,d,f){return new P0(l,c,d,f.host,f.ssl,f.experimentalForceLongPolling,f.experimentalAutoDetectLongPolling,Mf(f.experimentalLongPollingOptions),f.useFetchStreams)}(n._databaseId,((e=n._app)===null||e===void 0?void 0:e.options.appId)||"",n._persistenceKey,r);n._componentsProvider||!((t=r.localCache)===null||t===void 0)&&t._offlineComponentProvider&&(!((s=r.localCache)===null||s===void 0)&&s._onlineComponentProvider)&&(n._componentsProvider={_offline:r.localCache._offlineComponentProvider,_online:r.localCache._onlineComponentProvider}),n._firestoreClient=new Hw(n._authCredentials,n._appCheckCredentials,n._queue,i,n._componentsProvider&&function(l){const c=l==null?void 0:l._online.build();return{_offline:l==null?void 0:l._offline.build(c),_online:c}}(n._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qs{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Qs(We.fromBase64String(e))}catch(t){throw new $(N.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new Qs(We.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class Ql{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jl{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new $(N.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new $(N.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return le(this._lat,e._lat)||le(this._long,e._long)}}/**
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
 */class Xl{constructor(e){this._values=(e||[]).map(t=>t)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(s,r){if(s.length!==r.length)return!1;for(let i=0;i<s.length;++i)if(s[i]!==r[i])return!1;return!0}(this._values,e._values)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const eb=/^__.*__$/;class tb{constructor(e,t,s){this.data=e,this.fieldMask=t,this.fieldTransforms=s}toMutation(e,t){return this.fieldMask!==null?new zn(e,this.data,this.fieldMask,t,this.fieldTransforms):new oi(e,this.data,t,this.fieldTransforms)}}class Nf{constructor(e,t,s){this.data=e,this.fieldMask=t,this.fieldTransforms=s}toMutation(e,t){return new zn(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function Lf(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw W()}}class Zl{constructor(e,t,s,r,i,a){this.settings=e,this.databaseId=t,this.serializer=s,this.ignoreUndefinedProperties=r,i===void 0&&this.vu(),this.fieldTransforms=i||[],this.fieldMask=a||[]}get path(){return this.settings.path}get Cu(){return this.settings.Cu}Fu(e){return new Zl(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Mu(e){var t;const s=(t=this.path)===null||t===void 0?void 0:t.child(e),r=this.Fu({path:s,xu:!1});return r.Ou(e),r}Nu(e){var t;const s=(t=this.path)===null||t===void 0?void 0:t.child(e),r=this.Fu({path:s,xu:!1});return r.vu(),r}Lu(e){return this.Fu({path:void 0,xu:!0})}Bu(e){return fo(e,this.settings.methodName,this.settings.ku||!1,this.path,this.settings.qu)}contains(e){return this.fieldMask.find(t=>e.isPrefixOf(t))!==void 0||this.fieldTransforms.find(t=>e.isPrefixOf(t.field))!==void 0}vu(){if(this.path)for(let e=0;e<this.path.length;e++)this.Ou(this.path.get(e))}Ou(e){if(e.length===0)throw this.Bu("Document fields must not be empty");if(Lf(this.Cu)&&eb.test(e))throw this.Bu('Document fields cannot begin and end with "__"')}}class nb{constructor(e,t,s){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=s||ko(e)}Qu(e,t,s,r=!1){return new Zl({Cu:e,methodName:t,qu:s,path:He.emptyPath(),xu:!1,ku:r},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Vo(n){const e=n._freezeSettings(),t=ko(n._databaseId);return new nb(n._databaseId,!!e.ignoreUndefinedProperties,t)}function ec(n,e,t,s,r,i={}){const a=n.Qu(i.merge||i.mergeFields?2:0,e,t,r);tc("Data must be an object, but it was:",a,s);const l=Bf(s,a);let c,d;if(i.merge)c=new gt(a.fieldMask),d=a.fieldTransforms;else if(i.mergeFields){const f=[];for(const m of i.mergeFields){const y=sl(e,m,t);if(!a.contains(y))throw new $(N.INVALID_ARGUMENT,`Field '${y}' is specified in your field mask but missing from your input data.`);zf(f,y)||f.push(y)}c=new gt(f),d=a.fieldTransforms.filter(m=>c.covers(m.field))}else c=null,d=a.fieldTransforms;return new tb(new lt(l),c,d)}class Bo extends Ql{_toFieldTransform(e){if(e.Cu!==2)throw e.Cu===1?e.Bu(`${this._methodName}() can only appear at the top level of your update data`):e.Bu(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof Bo}}function Of(n,e,t,s){const r=n.Qu(1,e,t);tc("Data must be an object, but it was:",r,s);const i=[],a=lt.empty();ds(s,(c,d)=>{const f=nc(e,c,t);d=ke(d);const m=r.Nu(f);if(d instanceof Bo)i.push(f);else{const y=Fo(d,m);y!=null&&(i.push(f),a.set(f,y))}});const l=new gt(i);return new Nf(a,l,r.fieldTransforms)}function Vf(n,e,t,s,r,i){const a=n.Qu(1,e,t),l=[sl(e,s,t)],c=[r];if(i.length%2!=0)throw new $(N.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let y=0;y<i.length;y+=2)l.push(sl(e,i[y])),c.push(i[y+1]);const d=[],f=lt.empty();for(let y=l.length-1;y>=0;--y)if(!zf(d,l[y])){const b=l[y];let T=c[y];T=ke(T);const R=a.Nu(b);if(T instanceof Bo)d.push(b);else{const x=Fo(T,R);x!=null&&(d.push(b),f.set(b,x))}}const m=new gt(d);return new Nf(f,m,a.fieldTransforms)}function Fo(n,e){if(Ff(n=ke(n)))return tc("Unsupported field value:",e,n),Bf(n,e);if(n instanceof Ql)return function(s,r){if(!Lf(r.Cu))throw r.Bu(`${s._methodName}() can only be used with update() and set()`);if(!r.path)throw r.Bu(`${s._methodName}() is not currently supported inside arrays`);const i=s._toFieldTransform(r);i&&r.fieldTransforms.push(i)}(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.xu&&e.Cu!==4)throw e.Bu("Nested arrays are not supported");return function(s,r){const i=[];let a=0;for(const l of s){let c=Fo(l,r.Lu(a));c==null&&(c={nullValue:"NULL_VALUE"}),i.push(c),a++}return{arrayValue:{values:i}}}(n,e)}return function(s,r){if((s=ke(s))===null)return{nullValue:"NULL_VALUE"};if(typeof s=="number")return X0(r.serializer,s);if(typeof s=="boolean")return{booleanValue:s};if(typeof s=="string")return{stringValue:s};if(s instanceof Date){const i=Oe.fromDate(s);return{timestampValue:co(r.serializer,i)}}if(s instanceof Oe){const i=new Oe(s.seconds,1e3*Math.floor(s.nanoseconds/1e3));return{timestampValue:co(r.serializer,i)}}if(s instanceof Jl)return{geoPointValue:{latitude:s.latitude,longitude:s.longitude}};if(s instanceof Qs)return{bytesValue:ef(r.serializer,s._byteString)};if(s instanceof ut){const i=r.databaseId,a=s.firestore._databaseId;if(!a.isEqual(i))throw r.Bu(`Document reference is for database ${a.projectId}/${a.database} but should be for database ${i.projectId}/${i.database}`);return{referenceValue:Vl(s.firestore._databaseId||r.databaseId,s._key.path)}}if(s instanceof Xl)return function(a,l){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:a.toArray().map(c=>{if(typeof c!="number")throw l.Bu("VectorValues must only contain numeric values.");return Nl(l.serializer,c)})}}}}}}(s,r);throw r.Bu(`Unsupported field value: ${Kl(s)}`)}(n,e)}function Bf(n,e){const t={};return Ch(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):ds(n,(s,r)=>{const i=Fo(r,e.Mu(s));i!=null&&(t[s]=i)}),{mapValue:{fields:t}}}function Ff(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof Oe||n instanceof Jl||n instanceof Qs||n instanceof ut||n instanceof Ql||n instanceof Xl)}function tc(n,e,t){if(!Ff(t)||!function(r){return typeof r=="object"&&r!==null&&(Object.getPrototypeOf(r)===Object.prototype||Object.getPrototypeOf(r)===null)}(t)){const s=Kl(t);throw s==="an object"?e.Bu(n+" a custom object"):e.Bu(n+" "+s)}}function sl(n,e,t){if((e=ke(e))instanceof ui)return e._internalPath;if(typeof e=="string")return nc(n,e);throw fo("Field path arguments must be of type string or ",n,!1,void 0,t)}const sb=new RegExp("[~\\*/\\[\\]]");function nc(n,e,t){if(e.search(sb)>=0)throw fo(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new ui(...e.split("."))._internalPath}catch{throw fo(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function fo(n,e,t,s,r){const i=s&&!s.isEmpty(),a=r!==void 0;let l=`Function ${e}() called with invalid data`;t&&(l+=" (via `toFirestore()`)"),l+=". ";let c="";return(i||a)&&(c+=" (found",i&&(c+=` in field ${s}`),a&&(c+=` in document ${r}`),c+=")"),new $(N.INVALID_ARGUMENT,l+n+c)}function zf(n,e){return n.some(t=>t.isEqual(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uf{constructor(e,t,s,r,i){this._firestore=e,this._userDataWriter=t,this._key=s,this._document=r,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new ut(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new rb(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field($f("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class rb extends Uf{data(){return super.data()}}function $f(n,e){return typeof e=="string"?nc(n,e):e instanceof ui?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ib(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new $(N.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class ob{convertValue(e,t="none"){switch(as(e)){case 0:return null;case 1:return e.booleanValue;case 2:return Re(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(os(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw W()}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const s={};return ds(e,(r,i)=>{s[r]=this.convertValue(i,t)}),s}convertVectorValue(e){var t,s,r;const i=(r=(s=(t=e.fields)===null||t===void 0?void 0:t.value.arrayValue)===null||s===void 0?void 0:s.values)===null||r===void 0?void 0:r.map(a=>Re(a.doubleValue));return new Xl(i)}convertGeoPoint(e){return new Jl(Re(e.latitude),Re(e.longitude))}convertArray(e,t){return(e.values||[]).map(s=>this.convertValue(s,t))}convertServerTimestamp(e,t){switch(t){case"previous":const s=Pl(e);return s==null?null:this.convertValue(s,t);case"estimate":return this.convertTimestamp($r(e));default:return null}}convertTimestamp(e){const t=Vn(e);return new Oe(t.seconds,t.nanos)}convertDocumentKey(e,t){const s=ve.fromString(e);ue(af(s));const r=new qr(s.get(1),s.get(3)),i=new q(s.popFirst(5));return r.isEqual(t)||an(`Document ${i} contains a document reference within a different database (${r.projectId}/${r.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sc(n,e,t){let s;return s=n?t&&(t.merge||t.mergeFields)?n.toFirestore(e,t):n.toFirestore(e):e,s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pr{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class qf extends Uf{constructor(e,t,s,r,i,a){super(e,t,s,r,a),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new ji(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const s=this._document.data.field($f("DocumentSnapshot.get",e));if(s!==null)return this._userDataWriter.convertValue(s,t.serverTimestamps)}}}class ji extends qf{data(e={}){return super.data(e)}}class ab{constructor(e,t,s,r){this._firestore=e,this._userDataWriter=t,this._snapshot=r,this.metadata=new Pr(r.hasPendingWrites,r.fromCache),this.query=s}get docs(){const e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach(s=>{e.call(t,new ji(this._firestore,this._userDataWriter,s.key,s,new Pr(this._snapshot.mutatedKeys.has(s.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new $(N.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(r,i){if(r._snapshot.oldDocs.isEmpty()){let a=0;return r._snapshot.docChanges.map(l=>{const c=new ji(r._firestore,r._userDataWriter,l.doc.key,l.doc,new Pr(r._snapshot.mutatedKeys.has(l.doc.key),r._snapshot.fromCache),r.query.converter);return l.doc,{type:"added",doc:c,oldIndex:-1,newIndex:a++}})}{let a=r._snapshot.oldDocs;return r._snapshot.docChanges.filter(l=>i||l.type!==3).map(l=>{const c=new ji(r._firestore,r._userDataWriter,l.doc.key,l.doc,new Pr(r._snapshot.mutatedKeys.has(l.doc.key),r._snapshot.fromCache),r.query.converter);let d=-1,f=-1;return l.type!==0&&(d=a.indexOf(l.doc.key),a=a.delete(l.doc.key)),l.type!==1&&(a=a.add(l.doc),f=a.indexOf(l.doc.key)),{type:lb(l.type),doc:c,oldIndex:d,newIndex:f}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}}function lb(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return W()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cb(n){n=Tt(n,ut);const e=Tt(n.firestore,Un);return Yw(Oo(e),n._key).then(t=>mb(e,n,t))}class Hf extends ob{constructor(e){super(),this.firestore=e}convertBytes(e){return new Qs(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new ut(this.firestore,null,t)}}function ub(n){n=Tt(n,Lo);const e=Tt(n.firestore,Un),t=Oo(e),s=new Hf(e);return ib(n._query),Gw(t,n._query).then(r=>new ab(e,s,n,r))}function db(n,e,t){n=Tt(n,ut);const s=Tt(n.firestore,Un),r=sc(n.converter,e,t);return di(s,[ec(Vo(s),"setDoc",n._key,r,n.converter!==null,t).toMutation(n._key,rt.none())])}function hb(n,e,t,...s){n=Tt(n,ut);const r=Tt(n.firestore,Un),i=Vo(r);let a;return a=typeof(e=ke(e))=="string"||e instanceof ui?Vf(i,"updateDoc",n._key,e,t,s):Of(i,"updateDoc",n._key,e),di(r,[a.toMutation(n._key,rt.exists(!0))])}function fb(n){return di(Tt(n.firestore,Un),[new Po(n._key,rt.none())])}function pb(n,e){const t=Tt(n.firestore,Un),s=Ks(n),r=sc(n.converter,e);return di(t,[ec(Vo(n.firestore),"addDoc",s._key,r,n.converter!==null,{}).toMutation(s._key,rt.exists(!1))]).then(()=>s)}function di(n,e){return function(s,r){const i=new sn;return s.asyncQueue.enqueueAndForget(async()=>Ow(await Ww(s),r,i)),i.promise}(Oo(n),e)}function mb(n,e,t){const s=t.docs.get(e._key),r=new Hf(n);return new qf(n,r,e._key,s,new Pr(t.hasPendingWrites,t.fromCache),e.converter)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gb{constructor(e,t){this._firestore=e,this._commitHandler=t,this._mutations=[],this._committed=!1,this._dataReader=Vo(e)}set(e,t,s){this._verifyNotCommitted();const r=Ra(e,this._firestore),i=sc(r.converter,t,s),a=ec(this._dataReader,"WriteBatch.set",r._key,i,r.converter!==null,s);return this._mutations.push(a.toMutation(r._key,rt.none())),this}update(e,t,s,...r){this._verifyNotCommitted();const i=Ra(e,this._firestore);let a;return a=typeof(t=ke(t))=="string"||t instanceof ui?Vf(this._dataReader,"WriteBatch.update",i._key,t,s,r):Of(this._dataReader,"WriteBatch.update",i._key,t),this._mutations.push(a.toMutation(i._key,rt.exists(!0))),this}delete(e){this._verifyNotCommitted();const t=Ra(e,this._firestore);return this._mutations=this._mutations.concat(new Po(t._key,rt.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new $(N.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function Ra(n,e){if((n=ke(n)).firestore!==e)throw new $(N.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jf(n){return Oo(n=Tt(n,Un)),new gb(n,e=>di(n,e))}(function(e,t=!0){(function(r){er=r})(Xs),Us(new ns("firestore",(s,{instanceIdentifier:r,options:i})=>{const a=s.getProvider("app").getImmediate(),l=new Un(new p0(s.getProvider("auth-internal")),new v0(s.getProvider("app-check-internal")),function(d,f){if(!Object.prototype.hasOwnProperty.apply(d.options,["projectId"]))throw new $(N.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new qr(d.options.projectId,f)}(a,r),a);return i=Object.assign({useFetchStreams:t},i),l._setSettings(i),l},"PUBLIC").setMultipleInstances(!0)),kn(Lu,"4.7.3",e),kn(Lu,"4.7.3","esm2017")})();const Wf={apiKey:"AIzaSyBdbve0H70D-Ch69WlaxEly7PVBFVRB5p0",authDomain:"pensiontools-4b237.firebaseapp.com",projectId:"pensiontools-4b237",storageBucket:"pensiontools-4b237.firebasestorage.app",messagingSenderId:"760877353696",appId:"1:760877353696:web:2d6f7173c8d7fab6fd9e85",measurementId:"G-80XX542QZE"};function Ve(){return Wf.apiKey!=="YOUR_API_KEY"}let Pa=null,yt=null,ct=null;try{Ve()?(Pa=Fd(Wf),yt=u0(Pa),ct=Xw(Pa)):console.warn("Firebase not configured. Login required to save data.")}catch(n){console.error("Firebase initialization error:",n)}const yb=new Jt;let Sn=null,Or=[];function vb(){if(!Ve()||!yt){console.warn("Firebase not configured - auth disabled");return}Xy(yt,n=>{console.log("onAuthStateChanged fired:",n?n.email:"null"),Sn=n,console.log("Notifying",Or.length,"listeners"),Or.forEach(e=>e(n))})}function _b(n){return console.log("onAuthStateChange: adding listener, currentUser is:",Sn&&Sn.email),Or.push(n),Sn&&(console.log("onAuthStateChange: immediately calling listener with user"),n(Sn)),()=>{Or=Or.filter(e=>e!==n)}}function fs(){return Sn}function ht(){return Sn!==null}async function wb(n,e,t=null){if(!Ve()||!yt)throw new Error("Firebase not configured");const s=await Wy(yt,n,e);return t&&s.user&&await Ky(s.user,{displayName:t}),s}async function bb(n,e){if(!Ve()||!yt)throw new Error("Firebase not configured");return Yy(yt,n,e)}async function Eb(){if(!Ve()||!yt)throw new Error("Firebase not configured");console.log("Initiating Google sign-in popup...");try{const n=await _v(yt,yb);return console.log("Google sign-in successful:",n.user.email),n}catch(n){throw console.error("signInWithPopup error:",n.code,n.message),n}}async function Yf(){if(!Ve()||!yt)throw new Error("Firebase not configured");return Zy(yt)}async function Tb(n){if(!Ve()||!yt)throw new Error("Firebase not configured");return jy(yt,n)}vb();function As(...n){return n.find(e=>e!==void 0)}function Ib(n){if(!n||typeof n!="object")return{scenario:n,migrated:!1};const e=Object.keys(n).filter(c=>c.includes(".")),t="decisionSettings"in n||"stressSettings"in n||"name"in n||"description"in n||"taxYears"in n;if(!(e.length>0||t))return{scenario:n,migrated:!1};const r=n.decisionTool||{},i=n.stressTool||{},a=n.planDetails||{},l={isActive:n.isActive??!1,enabledTools:n.enabledTools||["stress","decision"],planDetails:{name:As(n["planDetails.name"],a.name,n.name)??"My Plan",description:As(n["planDetails.description"],a.description,n.description)??""},decisionTool:{settings:As(n["decisionTool.settings"],r.settings,n.decisionSettings)??{},history:As(n["decisionTool.history"],r.history)??[],taxYears:As(n["decisionTool.taxYears"],r.taxYears,n.taxYears)??{}},stressTool:{settings:As(n["stressTool.settings"],i.settings,n.stressSettings)??{}}};return n.id!==void 0&&(l.id=n.id),n.createdAt!==void 0&&(l.createdAt=n.createdAt),n.lastModified!==void 0&&(l.lastModified=n.lastModified),{scenario:l,migrated:!0}}function rc(n,e="settings"){const t=fs();return!t||!ct?null:Ks(ct,"users",t.uid,n,e)}function Gf(n){const e=fs();return!e||!ct?null:Jw(ct,"users",e.uid,n)}async function Kf(n){const{scenario:e,migrated:t}=Ib(n);if(t){const s=fs();if(s&&ct)try{const{id:r,...i}=e;await db(Ks(ct,"users",s.uid,"scenarios",r),i)}catch(r){console.error("Scenario migration write failed:",r)}}return e}async function zo(){if(!Ve())return[];const n=Gf("scenarios");if(!n)return[];try{const e=await ub(n),t=[];return e.forEach(s=>{t.push({id:s.id,...s.data()})}),Promise.all(t.map(s=>Kf(s)))}catch(e){return console.error("Error loading scenarios:",e),[]}}async function Sb(n){if(!Ve())return null;const e=rc("scenarios",n);if(!e)return null;try{const t=await cb(e);return t.exists()?Kf({id:t.id,...t.data()}):null}catch(t){return console.error("Error loading scenario:",t),null}}async function ps(n,e){if(!Ve())return;const t=rc("scenarios",n);if(t)try{await hb(t,{...e,lastModified:new Date().toISOString()})}catch(s){throw console.error("Error saving scenario:",s),s}}async function Qf(n){if(!Ve())return null;const e=Gf("scenarios");if(!e)return null;try{return(await pb(e,{...n,createdAt:new Date().toISOString(),lastModified:new Date().toISOString()})).id}catch(t){throw console.error("Error creating scenario:",t),t}}async function xb(n){if(!Ve())return;const e=rc("scenarios",n);if(e)try{await fb(e)}catch(t){throw console.error("Error deleting scenario:",t),t}}async function ic(n){if(!Ve())return;const e=fs();if(!(!e||!ct))try{const t=await zo(),s=jf(ct);for(const r of t){const i=Ks(ct,"users",e.uid,"scenarios",r.id);r.id===n?s.update(i,{isActive:!0}):r.isActive&&s.update(i,{isActive:!1})}await s.commit()}catch(t){throw console.error("Error setting active scenario:",t),t}}async function Ab(){if(!Ve())return;const n=fs();if(!(!n||!ct))try{const e=await zo(),t=jf(ct);for(const s of e)t.delete(Ks(ct,"users",n.uid,"scenarios",s.id));t.delete(Ks(ct,"users",n.uid,"profile","settings")),await t.commit(),console.log("All user data wiped successfully")}catch(e){throw console.error("Error wiping user data:",e),e}}async function Rb(){return Ve()?(await zo()).length>0:!1}let Bs=null,Ce=null;function $n(){return Ve()&&ht()}function fn(){Bs=null,Ce=null}function oc(){return{equityMin:de.EQUITY_MIN,bondMin:de.BOND_MIN,cashTarget:de.CASH_TARGET,duration:de.DURATION_YEARS,baseSalary:de.BASE_SALARY,other:0,statePension:12e3,statePensionYear:12,pa:ze.PERSONAL_ALLOWANCE,brl:ze.BASIC_RATE_LIMIT,hrl:ze.HIGHER_RATE_LIMIT,taxMode:"inflates",protectionMult:Zn.PROTECTION_MULTIPLIER,consecutiveLimit:de.CONSECUTIVE_LIMIT,disableProtection:!1,hodlEnabled:Zn.HODL_ENABLED,hodlValue:Zn.HODL_VALUE,isaBalance:0,isaReturn:Rt.RETURN,isaMin:Rt.MIN,isaDrawdownStrategy:Rt.DRAWDOWN_STRATEGY}}function Jf(){return{equityMin:de.EQUITY_MIN,bondMin:de.BOND_MIN,cashTarget:de.CASH_TARGET,duration:de.DURATION_YEARS,baseSalary:de.BASE_SALARY,protectionFactor:de.PROTECTION_FACTOR,recoveryBuffer:de.RECOVERY_BUFFER,consecutiveLimit:de.CONSECUTIVE_LIMIT,spStartDate:null,spWeeklyAmount:0,statePension:0,statePensionYear:0,isaBalance:0,isaReturn:Rt.RETURN,isaMin:Rt.MIN,isaDrawdownStrategy:Rt.DRAWDOWN_STRATEGY}}function Pb(n,e={},t=new Date().toISOString()){const s=n||{};return{...oc(),...e,equityMin:s.equityMin,bondMin:s.bondMin,cashTarget:s.cashTarget,duration:s.duration,baseSalary:s.baseSalary,spStartDate:s.spStartDate??e.spStartDate??null,spWeeklyAmount:s.spWeeklyAmount??e.spWeeklyAmount??0,consecutiveLimit:s.consecutiveLimit,recoveryBuffer:s.recoveryBuffer,protectionMult:s.protectionFactor!=null?1-s.protectionFactor/100:e.protectionMult??Zn.PROTECTION_MULTIPLIER,isaBalance:s.isaBalance??0,isaReturn:s.isaReturn??Rt.RETURN,isaMin:s.isaMin??Rt.MIN,isaDrawdownStrategy:s.isaDrawdownStrategy??Rt.DRAWDOWN_STRATEGY,seededFrom:"decision",seededAt:t,decisionChecksum:dl(s)}}function Xf(){return{}}function Cb(n="My Plan",e="",t=["stress","decision"]){return{planDetails:{name:n,description:e},enabledTools:t,isActive:!0,decisionTool:{settings:Jf(),history:[],taxYears:Xf()},stressTool:{settings:oc()}}}async function ac(){if(Bs)return Bs;if(!$n())return[];try{const n=await zo();return Bs=n,n}catch(n){return console.error("Error listing scenarios:",n),[]}}async function Mt(){if(Ce)return Ce;if(!$n())return null;try{const e=(await ac()).find(t=>t.isActive);return e?(Ce=e,e):null}catch(n){return console.error("Error getting active scenario:",n),null}}async function kb(n,e,t,s={},r=!0){if(!$n())throw new Error("Must be logged in to create scenarios");const i=Cb(n,e,t);if(s.stressSettings&&(i.stressTool.settings={...i.stressTool.settings,...s.stressSettings}),s.decisionSettings&&(i.decisionTool.settings={...i.decisionTool.settings,...s.decisionSettings}),s.taxYears&&(i.decisionTool.taxYears=s.taxYears),i.isActive=r,r&&Bs){const l=Bs.find(c=>c.isActive);l&&(await ic(null),await ps(l.id,{isActive:!1}))}const a=await Qf(i);return fn(),a}async function Mb(n){if(!$n())throw new Error("Must be logged in to switch scenarios");await ic(n),fn()}async function Db(n,e){if(!$n())throw new Error("Must be logged in to duplicate scenarios");const t=await Sb(n);if(!t)throw new Error("Source scenario not found");const{id:s,createdAt:r,lastModified:i,...a}=t;a.planDetails={...a.planDetails,name:e},a.isActive=!1;const l=await Qf(a);return fn(),l}async function Nb(n,e){if(!$n())throw new Error("Must be logged in to rename scenarios");await ps(n,{"planDetails.name":e}),fn()}async function Lb(n,e){if(!$n())throw new Error("Must be logged in to update scenarios");await ps(n,{enabledTools:e}),fn()}async function Ob(n){if(!$n())throw new Error("Must be logged in to delete scenarios");const e=await ac();if(e.length<=1)throw new Error("Cannot delete the last scenario");const t=e.find(s=>s.id===n);if(t!=null&&t.isActive){const s=e.find(r=>r.id!==n);s&&await ic(s.id)}await xb(n),fn()}async function Vb(){var e;const n=await Mt();return((e=n==null?void 0:n.stressTool)==null?void 0:e.settings)||oc()}async function Zf(n){const e=await Mt();if(!e)throw new Error("No active scenario");await ps(e.id,{"stressTool.settings":n}),Ce&&(Ce.stressTool||(Ce.stressTool={}),Ce.stressTool.settings=n)}async function Bb(){var e;const n=await Mt();return((e=n==null?void 0:n.decisionTool)==null?void 0:e.settings)||Jf()}async function Fb(n){const e=await Mt();if(!e)throw new Error("No active scenario");await ps(e.id,{"decisionTool.settings":n}),Ce&&(Ce.decisionTool||(Ce.decisionTool={}),Ce.decisionTool.settings=n)}async function zb(){var e;const n=await Mt();return((e=n==null?void 0:n.decisionTool)==null?void 0:e.taxYears)||Xf()}async function Ub(n){const e=await Mt();if(!e)throw new Error("No active scenario");await ps(e.id,{"decisionTool.taxYears":n}),Ce&&(Ce.decisionTool||(Ce.decisionTool={}),Ce.decisionTool.taxYears=n)}async function $b(){var e;const n=await Mt();return((e=n==null?void 0:n.decisionTool)==null?void 0:e.history)||[]}async function ep(n){const e=await Mt();if(!e)throw new Error("No active scenario");await ps(e.id,{"decisionTool.history":n}),Ce&&(Ce.decisionTool||(Ce.decisionTool={}),Ce.decisionTool.history=n)}async function tp(){const n=await Mt();return(n==null?void 0:n.enabledTools)||["stress","decision"]}let Dn=null;function Wi(){return{settings:{equityMin:de.EQUITY_MIN,bondMin:de.BOND_MIN,cashTarget:de.CASH_TARGET,duration:de.DURATION_YEARS,baseSalary:de.BASE_SALARY,protectionFactor:de.PROTECTION_FACTOR,recoveryBuffer:de.RECOVERY_BUFFER,consecutiveLimit:de.CONSECUTIVE_LIMIT,startDate:null,spStartDate:null,spWeeklyAmount:0,statePension:0,statePensionYear:0},taxYears:{},history:[],lastModified:null,checksum:null}}function Uo(){return Ve()&&ht()}function ls(){Dn=null}function np(){return Dn||Wi()}async function Ht(){if(Dn)return Dn;if(!Uo())return console.warn("Firebase not available - returning defaults"),Wi();try{const[n,e,t]=await Promise.all([Bb(),zb(),$b()]),s={settings:n||Wi().settings,taxYears:e||{},history:t||[],lastModified:new Date().toISOString(),checksum:null};return s.checksum=sp(s),Dn=s,s}catch(n){console.error("Error loading decision data:",n)}return Wi()}async function $o(n){if(!Uo())throw new Error("Must be logged in to save data");try{n.lastModified=new Date().toISOString(),n.checksum=sp(n),await Promise.all([Fb(n.settings),Ub(n.taxYears)]),Dn=n}catch(e){throw console.error("Error saving decision data:",e),new Error("Failed to save decision data")}}function sp(n){const e={settings:n.settings,taxYears:n.taxYears,historyCount:n.history.length,lastHistoryDate:n.history.length>0?n.history[n.history.length-1].date:null};return dl(e)}async function pn(){return(await Ht()).settings}async function lc(n){const e=await Ht();e.settings={...e.settings,...n},await $o(e)}function cc(){return{pa:ze.PERSONAL_ALLOWANCE,brl:ze.BASIC_RATE_LIMIT,hrl:ze.HIGHER_RATE_LIMIT,cpi:.04,other:0,isaSavingsAllocation:0,isaSavingsUsed:0,isaContribution:0,isTaxEfficient:!0,taxEfficiencyChoice:null,grossIncomeToDate:0,startMonth:4,yearSetupComplete:!1,confirmedSalary:null}}function qb(n){const t=np().taxYears[n];return t||cc()}async function qo(n){const t=(await Ht()).taxYears[n];return t||cc()}async function ms(n,e){console.log(`saveTaxYearConfig: Saving tax year ${n}`,e);const t=await Ht();t.taxYears[n]={...qb(n),...e},await $o(t),console.log(`saveTaxYearConfig: Saved tax year ${n}, yearSetupComplete=${t.taxYears[n].yearSetupComplete}`)}async function Hb(n){const e=Dn||await Ht(),t=(e.history||[]).filter(r=>r.taxYear===n),s=t.reduce((r,i)=>r+(i.isa||0),0);return console.log(`recalculateIsaSavingsUsed: Tax year ${n}, found ${t.length} records, total ISA used: ${s}`),console.log("recalculateIsaSavingsUsed: History records:",t.map(r=>({date:r.date,isa:r.isa}))),e.taxYears[n]||(console.log(`recalculateIsaSavingsUsed: No existing config for ${n}, creating default`),e.taxYears[n]=cc()),console.log(`recalculateIsaSavingsUsed: Before update, isaSavingsUsed=${e.taxYears[n].isaSavingsUsed}`),e.taxYears[n].isaSavingsUsed=s,console.log(`recalculateIsaSavingsUsed: After update, isaSavingsUsed=${e.taxYears[n].isaSavingsUsed}`),await $o(e),console.log("recalculateIsaSavingsUsed: Saved to Firebase"),s}async function jb(n){const e=await qo(n),t=e.yearSetupComplete===!0;return console.log(`isYearSetupComplete: Tax year ${n}, yearSetupComplete=${e.yearSetupComplete}, result=${t}`),t}async function qn(){return(await Ht()).taxYears}function Wb(n={}){let t=[...np().history];return n.taxYear&&(t=t.filter(s=>s.taxYear===n.taxYear)),n.startDate&&(t=t.filter(s=>s.date>=n.startDate)),n.endDate&&(t=t.filter(s=>s.date<=n.endDate)),n.sortDesc?t.sort((s,r)=>r.date.localeCompare(s.date)):t.sort((s,r)=>s.date.localeCompare(r.date)),n.limit&&(t=t.slice(0,n.limit)),t}async function sr(n={}){return await Ht(),Wb(n)}async function Yb(n){if(!Uo())throw new Error("Must be logged in to save history");const e=await Ht(),t=e.history.findIndex(s=>s.date===n.date);t>=0?e.history[t]=n:e.history.push(n),e.history.sort((s,r)=>s.date.localeCompare(r.date)),await ep(e.history)}async function rp(n){if(!Uo())throw new Error("Must be logged in to delete history");const e=await Ht();e.history=e.history.filter(t=>t.date!==n),await ep(e.history)}async function uc(n){const e=await pn(),t=await qn(),s=e.spStartDate,r=e.spWeeklyAmount||0;if(!s||!r){let f=null;if(s){const{formatStatePensionDate:m}=await ru(async()=>{const{formatStatePensionDate:y}=await Promise.resolve().then(()=>vd);return{formatStatePensionDate:y}},void 0,import.meta.url);f=m(s)}return{amount:0,monthly:0,yearsUntil:0,isReceiving:!1,isFirstYear:!1,startDate:f}}const{calculateStatePensionForTaxYear:i,getTimeUntilStatePension:a,parseStatePensionDate:l}=await ru(async()=>{const{calculateStatePensionForTaxYear:f,getTimeUntilStatePension:m,parseStatePensionDate:y}=await Promise.resolve().then(()=>vd);return{calculateStatePensionForTaxYear:f,getTimeUntilStatePension:m,parseStatePensionDate:y}},void 0,import.meta.url),c=i({taxYear:n,spStartDate:s,weeklyAmount:r,taxYearConfigs:t}),d=a(s);return{amount:c.annual,monthly:c.monthly,yearsUntil:d.years,monthsUntil:d.months,isReceiving:c.isReceiving,isFirstYear:c.isFirstYear,weeksInYear:c.weeksInYear,startDate:c.startDate}}async function Gb(n){const e=Xp(n);e.stdSipp=n.stdSipp||n.sippDraw,await Yb(e),n.taxYear&&await Hb(n.taxYear)}const yd={TAX_EFFICIENT:"minimiseEarlyTax",LONGEVITY:"maximiseLongevity"};function Kb(n,e){return n<=0?n:n*Math.pow(1+e,1/12)}function ip({targetGross:n,fixedIncome:e=0,pa:t,brl:s,hrl:r,isaBalance:i=0,strategy:a=yd.TAX_EFFICIENT,yearsUntilSp:l=0}){const c=Rn(n,t,s,r),d=Math.max(0,Math.min(s,n)-e),f=Rn(d+e,t,s,r),m=Math.max(0,c-f),y=a===yd.LONGEVITY&&l>0?i/l:1/0,b=Math.max(0,Math.min(m,Math.max(0,i),y)),T=i-b,R=m-b;let x=d;if(R>0){const D=em(f+R,t,s,r);x=Math.max(d,D-e)}const S=x+e,M=Rn(S,t,s,r);return{sippGross:x,isaDraw:b,remainingIsa:T,taxable:S,tax:S-M,net:M+b}}function Ho(n,e,t=0){const s=ul(t);let r=n.equityStart,i=n.bondStart,a=n.cashStart,l=n.hodlEnabled?n.hodlStart!==void 0?n.hodlStart:n.hodlValue:0,c=0,d=n.isaBalance||0,f=null,m=0,y=0,b=0,T=0,R=!1,x=!1,S=null,M=0,D=-1;const C=[],O=[];let F=1;C.push({year:0,month:0,equity:r,bond:i,cash:a,hodl:l,total:r+i+a,draw:0,source:"None",inProtection:!1,equityMin:n.equityMin,bondMin:n.bondMin,cashMax:n.cashTarget});for(let w=0;w<n.years*12;w++){const v=Math.floor(w/12),_=w%12,E=_>=3?v:v-1;if(E!==D&&(M=0,D=E),w>0&&w%12===0){const ce=e.inflation[v]||.025;O.push(ce),F*=1+ce}const I=e.equity[v]||0,A=e.inflation[v]||.025,g=v>0?e.inflation[v-1]||.025:A,Y=tn(n.equityMin,v,n.duration,F,!0),Z=tn(n.bondMin,v,n.duration,F,!0),ee=tn(n.cashTarget,v,n.duration,F,!1),{sippMonthly:_e,isaMonthly:pe}=Xb(n,v,F,O,d),vt=_e,Se=vt;let re=R?vt*n.protectionMult:vt;const Q=R?pe*n.protectionMult:pe;R&&(M+=Se-re);const It=Qb(A,I,g,s),J=Math.max(.005,A+.012),xe=ce=>Math.pow(1+(Number.isFinite(ce)?Math.max(-.99,ce):-.99),1/12);if(r*=xe(I),i*=xe(It),a*=xe(J),d=Kb(d,n.isaReturn||Rt.RETURN),l>0){const Me=(s()-.5)*2*.06;let tt=0;I<-.1?tt=Math.min(.15,Math.abs(I)*.4):I<-.05&&(tt=Math.abs(I)*.2);let ot=.069+Me+tt;ot=Math.max(-.08,Math.min(.18,ot)),l*=xe(ot)}const ne=r+i,Ye=Y+Z;R&&ne>Ye+5e3&&(R=!1,T=0,y=Math.max(y,b),b=0),R&&(m++,b++);let it=0;if(!R&&M>0&&ne>Ye+15e3){let ce=_>=3?15-_:3-_;ce<1&&(ce=1);const Ge=ne-Ye-15e3,Me=Math.min(M/ce,Ge/ce),tt=Se*.5;it=Math.min(Me,tt),it>50&&(re+=it,M-=it)}let pt="Growth";if(!R&&ne>=Ye+re){const ce=Math.max(0,r-Y),Ge=Math.max(0,i-Z),Me=ce+Ge;if(Me>0){if(r-=re*ce/Me,i-=re*Ge/Me,T=0,pt="Growth",a<ee){const tt=ne-Ye-re;if(tt>5e3){const ot=Math.min((ee-a)*.3,tt*.5);r-=ot*ce/Me,i-=ot*Ge/Me,a+=ot}}}else a-=re,pt="Cash"}else if(a>=re)a-=re,T++,pt="Cash",!n.disableProtection&&T>=n.consecutiveLimit&&(R=!0);else{const ce=re-a;a=0,i>ce?(i-=ce,pt="Bond"):r>ce?(r-=ce,pt="Equity"):l>ce?(l-=ce,c+=ce,f===null&&(f=w),pt="HODL"):(x=!0,S=w)}if(d=Math.max(0,d-Math.min(Q,d)),r=Math.max(0,r),i=Math.max(0,i),a=Math.max(0,a),(_===0||w===n.years*12-1||x)&&C.push({year:v+_/12,month:w,equity:r,bond:i,cash:a,hodl:l,total:r+i+a,draw:re,boostAmount:it,source:pt,inProtection:R,equityMin:Y,bondMin:Z,cashMax:ee}),x)break}return y=Math.max(y,b),{failed:x,years:x?S/12:n.years,failMonth:S,final:r+i+a,finalEquity:r,finalBond:i,finalCash:a,finalHodl:l,protMonths:m,maxConsec:y,hodlUsed:c,hodlUsedMonth:f,hist:C,seed:t}}function Qb(n,e,t,s){let r=.15,i=.3,a=.2,l=.1,c=.1,d=.15;const f=t!==void 0?t:n,m=f>.045,y=f>.07;if(m){const D=s()>.3?1:.5;y?(r=.15+.35*D,i=.3-.2*D,d=.15-.1*D,l=.1+.05*D):(r=.15+.2*D,i=.3-.1*D,d=.15-.05*D)}m&&s()<.15&&(r=.2,i=.25,d=.12);const b=n+.005+br(0,.03,s),T=.04-(n>.04?(n-.04)*.5:0)+br(0,.05,s),R=.03+n*.3+br(0,.08,s),x=n*.8+br(0,.15,s),S=Math.max(.005,n+.005),M=e*.5+br(0,.02,s);return r*b+i*T+a*R+l*x+c*S+d*M}function Jb(n,e){return n.spStartYear!==void 0?Math.max(0,n.spStartYear-e):n.statePensionYear!==void 0?Math.max(0,n.statePensionYear-e):0}function Xb(n,e,t,s,r=0){const i=n.taxMode==="frozen"?n.pa:n.pa*t,a=n.taxMode==="frozen"?n.brl:n.brl*t,l=n.taxMode==="frozen"?n.hrl:(n.hrl||125140)*t,c=n.baseSalary*t,d=Cd(n.other,s);let f=0;if(n.spStartYear!==void 0){if(e>=n.spStartYear&&n.spWeeklyAmount>0){const b=n.spWeeklyAmount*52;e===n.spStartYear&&n.spFirstYearRatio!==void 0?f=b*n.spFirstYearRatio*t:f=b*t}}else n.statePensionYear!==void 0&&(f=e>=n.statePensionYear?(n.statePension||0)*t:0);const m=d+f,y=ip({targetGross:c,fixedIncome:m,pa:i,brl:a,hrl:l,isaBalance:r,strategy:n.isaDrawdownStrategy||Rt.DRAWDOWN_STRATEGY,yearsUntilSp:Jb(n,e)});return{sippMonthly:y.sippGross/12,isaMonthly:y.isaDraw/12}}function op(n,e=1e3){const t=Object.keys(Br).map(Number).sort((r,i)=>r-i),s=[];for(let r=0;r<e;r++){const i=ul(r*12345),a={equity:{},inflation:{}};for(let l=0;l<n.years;l++){const c=t[Math.floor(i()*t.length)];a.equity[l]=Br[c],a.inflation[l]=ll[c]||.025}s.push(Ho(n,a,r))}return s}function ap(n){const e=Object.keys(Br).map(Number).sort((r,i)=>r-i),t=Math.max(...e),s=[];for(const r of e){if(r+n.years-1>t)continue;const i={equity:{},inflation:{}};for(let l=0;l<n.years;l++)i.equity[l]=Br[r+l]||0,i.inflation[l]=ll[r+l]||.025;const a=Ho(n,i,r);a.startYear=r,s.push(a)}return s}function Zb(n,e){const t={equity:{},inflation:{}};for(let s=0;s<n.years;s++)t.equity[s]=e.equity[s%e.equity.length],t.inflation[s]=e.inflation[s%e.inflation.length];return Ho(n,t,999)}function eE(n){const e=n.filter(t=>t.failed).length;return(n.length-e)/n.length*100}function lp(n){const e=n.filter(l=>!l.failed),t=n.filter(l=>l.failed),s=n.map(l=>l.years).sort((l,c)=>l-c),r=e.map(l=>l.final).sort((l,c)=>l-c),i=n.map(l=>l.protMonths).sort((l,c)=>l-c),a=(l,c)=>l[Math.floor(l.length*c)]||0;return{total:n.length,successCount:e.length,failCount:t.length,successRate:eE(n),survival:{p5:a(s,.05),p10:a(s,.1),p25:a(s,.25),p50:a(s,.5),p75:a(s,.75),p90:a(s,.9),p95:a(s,.95),min:s[0],max:s[s.length-1]},finalValue:{p5:a(r,.05),p10:a(r,.1),p25:a(r,.25),p50:a(r,.5),p75:a(r,.75),p90:a(r,.9),p95:a(r,.95),min:r[0]||0,max:r[r.length-1]||0,avg:e.reduce((l,c)=>l+c.final,0)/(e.length||1)},minYears:s[0],p10Years:a(s,.1),medianYears:a(s,.5),medianFinal:a(r,.5),p10Final:a(r,.1),p90Final:a(r,.9),avgFinal:e.reduce((l,c)=>l+c.final,0)/(e.length||1),protection:{runsWithProtection:n.filter(l=>l.protMonths>0).length,pctWithProtection:n.filter(l=>l.protMonths>0).length/n.length*100,avgMonths:i.reduce((l,c)=>l+c,0)/n.length,maxMonths:Math.max(...i),maxConsecutive:Math.max(...n.map(l=>l.maxConsec)),avgConsecutive:n.reduce((l,c)=>l+c.maxConsec,0)/n.length,p50Months:a(i,.5),p90Months:a(i,.9),p95Months:a(i,.95)},runsWithProtection:n.filter(l=>l.protMonths>0).length,avgProtMonths:i.reduce((l,c)=>l+c,0)/n.length,maxProtMonths:Math.max(...i),maxConsecutive:Math.max(...n.map(l=>l.maxConsec)),avgConsecutive:n.reduce((l,c)=>l+c.maxConsec,0)/n.length,hodl:{runsUsingHodl:n.filter(l=>l.hodlUsed>0).length,pctUsingHodl:n.filter(l=>l.hodlUsed>0).length/n.length*100,avgUsed:n.filter(l=>l.hodlUsed>0).length>0?n.filter(l=>l.hodlUsed>0).reduce((l,c)=>l+c.hodlUsed,0)/n.filter(l=>l.hodlUsed>0).length:0,maxUsed:Math.max(...n.map(l=>l.hodlUsed||0))},runsUsingHodl:n.filter(l=>l.hodlUsed>0).length,avgHodlUsed:n.filter(l=>l.hodlUsed>0).length>0?n.filter(l=>l.hodlUsed>0).reduce((l,c)=>l+c.hodlUsed,0)/n.filter(l=>l.hodlUsed>0).length:0,maxHodlUsed:Math.max(...n.map(l=>l.hodlUsed||0)),failures:t.map(l=>({seed:l.seed,startYear:l.startYear,years:l.years,failMonth:l.failMonth,protMonths:l.protMonths}))}}function rr(n){if(!n)return null;const e={january:0,jan:0,february:1,feb:1,march:2,mar:2,april:3,apr:3,may:4,june:5,jun:5,july:6,jul:6,august:7,aug:7,september:8,sep:8,sept:8,october:9,oct:9,november:10,nov:10,december:11,dec:11},t=n.trim().replace(/\s+/g," ");if(/^\d{4}-\d{2}-\d{2}$/.test(t)){const r=new Date(t);if(!isNaN(r.getTime()))return r}if(/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(t)){const[r,i,a]=t.split("/").map(Number);return new Date(a,i-1,r)}if(/^\d{1,2}-\d{1,2}-\d{4}$/.test(t)){const[r,i,a]=t.split("-").map(Number);return new Date(a,i-1,r)}let s=t.match(/^(\d{1,2})\s+(\w+)\s+(\d{4})$/i);if(s){const r=parseInt(s[1]),i=e[s[2].toLowerCase()],a=parseInt(s[3]);if(i!==void 0)return new Date(a,i,r)}if(s=t.match(/^(\w+)\s+(\d{1,2})\s+(\d{4})$/i),s){const r=e[s[1].toLowerCase()],i=parseInt(s[2]),a=parseInt(s[3]);if(r!==void 0)return new Date(a,r,i)}if(s=t.match(/^(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})$/i),s){const r=e[s[1].toLowerCase()],i=parseInt(s[2]),a=parseInt(s[3]);if(r!==void 0)return new Date(a,r,i)}if(s=t.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+(\w+),?\s+(\d{4})$/i),s){const r=parseInt(s[1]),i=e[s[2].toLowerCase()],a=parseInt(s[3]);if(i!==void 0)return new Date(a,i,r)}return null}function Yi(n){const e=typeof n=="string"?rr(n):n;if(!e||isNaN(e.getTime()))return"";const t=["January","February","March","April","May","June","July","August","September","October","November","December"];return`${e.getDate()} ${t[e.getMonth()]} ${e.getFullYear()}`}function tE(n){const{taxYear:e,spStartDate:t,weeklyAmount:s,taxYearConfigs:r={}}=n;if(!t||!s||s<=0)return{annual:0,monthly:0,isReceiving:!1,isFirstYear:!1,weeksInYear:0,startDate:null};const i=typeof t=="string"?rr(t):t;if(!i||isNaN(i.getTime()))return{annual:0,monthly:0,isReceiving:!1,isFirstYear:!1,weeksInYear:0,startDate:null};const a=vo(i);ga(e);const l=tm(e),c=[...new Set([a,e,...Object.keys(r)])].sort((R,x)=>ga(R).getTime()-ga(x).getTime()),d=c.indexOf(a),f=c.indexOf(e);if(f<d)return{annual:0,monthly:0,isReceiving:!1,isFirstYear:!1,weeksInYear:0,startDate:Yi(i)};let m=1;for(let R=d;R<f;R++){const x=c[R],S=r[x],M=(S==null?void 0:S.cpi)||.025;m*=1+M}const y=s*m;if(e===a){const x=Math.max(0,(l.getTime()-i.getTime())/6048e5),S=y*x;return{annual:S,monthly:S/12,isReceiving:!0,isFirstYear:!0,weeksInYear:Math.round(x*10)/10,startDate:Yi(i)}}const T=y*52;return{annual:T,monthly:T/12,isReceiving:!0,isFirstYear:!1,weeksInYear:52,startDate:Yi(i)}}function nE(n,e=new Date){const t=typeof n=="string"?rr(n):n;if(!t||isNaN(t.getTime()))return{years:0,months:0,totalMonths:0,isPast:!1};const s=t.getTime()-e.getTime(),r=s<=0;if(r)return{years:0,months:0,totalMonths:0,isPast:!0};const i=Math.floor(s/(30.44*24*60*60*1e3)),a=Math.floor(i/12),l=i%12;return{years:a,months:l,totalMonths:i,isPast:r}}const cp=2016;function jo(n,{now:e=new Date}={}){if(!n||!String(n).trim())return{valid:!0,error:null,warning:null,date:null};const t=rr(n);if(!t||isNaN(t.getTime()))return{valid:!1,error:'Could not read that date. Try a format like "6 May 2040".',warning:null,date:null};const s=t.getFullYear();return s<cp?{valid:!1,error:`That looks like a date of birth (${s}), not a State Pension start date. Enter the date your State Pension begins — check gov.uk/check-your-state-pension.`,warning:null,date:t}:t.getTime()<e.getTime()?{valid:!0,error:null,warning:`This date is in the past — State Pension will be treated as already in payment from ${s}.`,date:t}:{valid:!0,error:null,warning:null,date:t}}const vd=Object.freeze(Object.defineProperty({__proto__:null,MIN_SP_START_YEAR:cp,calculateStatePensionForTaxYear:tE,formatStatePensionDate:Yi,getTimeUntilStatePension:nE,parseStatePensionDate:rr,validateStatePensionDate:jo},Symbol.toStringTag,{value:"Module"}));let An=null;function Yr(){return{settings:{equityMin:de.EQUITY_MIN,bondMin:de.BOND_MIN,cashTarget:de.CASH_TARGET,duration:de.DURATION_YEARS,baseSalary:de.BASE_SALARY,other:0,statePension:12e3,statePensionYear:12,pa:ze.PERSONAL_ALLOWANCE,brl:ze.BASIC_RATE_LIMIT,hrl:ze.HIGHER_RATE_LIMIT,taxMode:"inflates",protectionMult:Zn.PROTECTION_MULTIPLIER,consecutiveLimit:de.CONSECUTIVE_LIMIT,disableProtection:!1,hodlEnabled:Zn.HODL_ENABLED,hodlValue:Zn.HODL_VALUE},lastModified:null,checksum:null}}function dc(){return Ve()&&ht()}function Fn(){An=null}function sE(){return An||Yr()}async function up(){if(An)return An;if(!dc())return console.warn("Firebase not available - returning defaults"),Yr();try{const n=await Vb();if(n){const e={settings:n,lastModified:new Date().toISOString(),checksum:null};return An=oE(e),An}}catch(n){console.error("Error loading stress data:",n)}return Yr()}async function rE(n){if(!dc())throw new Error("Must be logged in to save data");try{n.lastModified=new Date().toISOString(),n.checksum=iE(n),await Zf(n.settings),An=n}catch(e){throw console.error("Error saving stress data:",e),new Error("Failed to save stress data")}}function iE(n){return dl(n.settings)}function oE(n){const e={...Yr()};return n.settings&&(e.settings={...e.settings,...n.settings},n.settings.pacwMin!==void 0&&n.settings.equityMin===void 0&&(e.settings.equityMin=n.settings.pacwMin),n.settings.cgtMin!==void 0&&n.settings.bondMin===void 0&&(e.settings.bondMin=n.settings.cgtMin),n.settings.csh2Target!==void 0&&n.settings.cashTarget===void 0&&(e.settings.cashTarget=n.settings.csh2Target),e.settings.hodlEnabled===void 0&&(e.settings.hodlEnabled=!1),e.settings.hodlValue===void 0&&(e.settings.hodlValue=25e3)),e.lastModified=n.lastModified,e.checksum=n.checksum,e}function aE(){return sE().settings}async function jt(){return(await up()).settings}async function Wo(n){const e=await up();e.settings={...e.settings,...n},await rE(e)}async function lE(){if(!dc())throw new Error("Must be logged in to reset settings");const n=Yr();await Zf(n.settings),Fn()}function cE(n){if(!n.spStartDate||!n.spWeeklyAmount)return null;const e=rr(n.spStartDate);if(!e)return console.warn("Could not parse spStartDate:",n.spStartDate),null;const t=new Date,s=365.25*24*60*60*1e3,r=Math.max(0,(e.getTime()-t.getTime())/s),i=Math.floor(r),a=365,l=Math.floor((e-new Date(e.getFullYear(),0,0))/(24*60*60*1e3)),d=(a-l)/a;return{spStartYear:i,spWeeklyAmount:n.spWeeklyAmount,spFirstYearRatio:d}}function Yo(n={},e=null){const t=e||aE(),s=cE(t),r=s?{spStartYear:s.spStartYear,spWeeklyAmount:s.spWeeklyAmount,spFirstYearRatio:s.spFirstYearRatio}:{statePension:t.statePension||0,statePensionYear:t.statePensionYear??999};return{equityStart:n.equityStart??t.equityMin,bondStart:n.bondStart??t.bondMin,cashStart:n.cashStart??t.cashTarget,equityMin:t.equityMin,bondMin:t.bondMin,cashTarget:t.cashTarget,years:n.years??t.duration,duration:t.duration,baseSalary:t.baseSalary,other:t.other,...r,pa:t.pa,brl:t.brl,hrl:t.hrl,taxMode:t.taxMode,protectionMult:t.protectionMult,consecutiveLimit:t.consecutiveLimit,disableProtection:t.disableProtection,hodlEnabled:t.hodlEnabled,hodlValue:t.hodlValue,isaBalance:t.isaBalance||0,isaReturn:t.isaReturn,isaDrawdownStrategy:t.isaDrawdownStrategy}}function H(n,e=null){const t=Math.abs(n),s=e!==null?e:t<100,r=Math.abs(n).toLocaleString("en-GB",{minimumFractionDigits:s?2:0,maximumFractionDigits:s?2:0});return n<0?`-£${r}`:`£${r}`}function _d(n,e){const t=uE(n);e.innerHTML=t}function uE(n){var I,A,g,Y,Z;const e=n,t=e.calculationDetails||{};let s="";const r=e.isTaxEfficientYear??e.taxEfficient,i=e.protectionInducedTaxEfficiency||!1,a=e.boostAmount>0;let l,c,d;if(e.inProtection?(l="warning",c="Protection Mode",d="⚡"):a?(l="boost",c="Tax Boost (Catch-up)",d="↑"):i?(l="info",c="Protection-Induced Tax Efficiency",d="↑"):r?(l="success",c="Tax-Efficient Year",d="✓"):(l="warning",c="Tax-Inefficient Year",d="!"),s+=`<div class="decision-mode ${l}">
    <span class="mode-icon">${d}</span>
    <span class="mode-label">${c}</span>
  </div>`,r&&e.yearlyIsaSavingsAllocation>0){const ee=e.cumulativeIsaSavingsUsed||0,_e=e.yearlyIsaSavingsAllocation,pe=Math.max(0,_e-ee),vt=_e>0?ee/_e*100:0;s+=`<div class="isa-progress-card">
      <h4>ISA/Savings Allocation</h4>
      <div class="isa-progress-bar">
        <div class="isa-progress-fill" style="width: ${Math.min(vt,100)}%"></div>
      </div>
      <div class="isa-progress-stats">
        <span>Used: ${H(ee)} of ${H(_e)}</span>
        <span>Remaining: ${H(pe)}</span>
      </div>
    </div>`}if(e.alerts&&e.alerts.length>0){s+='<div class="alerts">';for(const ee of e.alerts){const _e=dE(ee.severity);s+=`<div class="alert ${_e}">${ee.message}</div>`}s+="</div>"}s+='<div class="recommendation-card">',s+="<h3>Monthly Recommendation</h3>",s+='<div class="draw-row primary">',s+='<span class="label">SIPP Withdrawal</span>',s+=`<span class="value">${H(e.sippDraw)}</span>`,s+="</div>",e.isaDraw>0&&(s+='<div class="draw-row">',s+='<span class="label">ISA Top-up</span>',s+=`<span class="value">${H(e.isaDraw)}</span>`,s+="</div>"),e.other>0&&(s+='<div class="draw-row muted">',s+='<span class="label">Other Pension</span>',s+=`<span class="value">${H(e.other)}</span>`,s+="</div>"),e.statePension>0&&(s+='<div class="draw-row muted">',s+='<span class="label">State Pension</span>',s+=`<span class="value">${H(e.statePension)}</span>`,s+="</div>"),s+='<div class="divider"></div>';const f=e.sippDraw+e.other+e.statePension,m=f*12,y=e.pa||12570,b=e.brl||50270;let T=0;m>y&&(m<=b?T=(m-y)*.2:T=(b-y)*.2+(m-b)*.4);const R=f-T/12+e.isaDraw;s+='<div class="draw-row total">',s+='<span class="label">Total Monthly Income</span>',s+=`<span class="value">${H(R)}</span>`,s+="</div>",e.boostAmount>0&&(s+='<div class="boost-indicator">',s+='<span class="boost-label">Includes Tax Boost:</span>',s+=`<span class="boost-value">+${H(e.boostAmount)}</span>`,s+="</div>"),s+="</div>",s+='<div class="source-card">',s+="<h4>Withdraw From</h4>",s+=`<div class="source-label ${e.source.toLowerCase()}">${e.source}</div>`,e.source==="Growth"&&(e.drawFromEquity>0||e.drawFromBond>0)&&(s+='<div class="source-breakdown">',e.drawFromEquity>0&&(s+=`<div class="source-item">Equity: ${H(e.drawFromEquity)}</div>`),e.drawFromBond>0&&(s+=`<div class="source-item">Bond: ${H(e.drawFromBond)}</div>`),s+="</div>"),s+="</div>",s+='<div class="fund-status">',s+="<h4>Fund Status</h4>";const x=e.equity+e.bond+e.cash,S=e.adjEquityMin+e.adjBondMin+e.adjCashTarget,M=x-S,D=S>0?M/S*100:0;s+='<div class="fund-grid">';const C=e.equity-e.adjEquityMin;s+=Ca("Equity",e.equity,e.adjEquityMin,C);const O=e.bond-e.adjBondMin;s+=Ca("Bond",e.bond,e.adjBondMin,O);const F=e.cash-e.adjCashTarget;s+=Ca("Cash",e.cash,e.adjCashTarget,F),s+="</div>";const w=M>=0?"healthy":"warning";s+=`<div class="overall-status ${w}">`,s+=`<span>Total Surplus: ${H(M)}</span>`,s+=`<span>(${D.toFixed(1)}% above target)</span>`,s+="</div>",s+="</div>",s+='<div class="tax-info">',s+="<h4>Tax Summary</h4>",s+='<div class="tax-thresholds">',s+=`<div class="tax-threshold-item"><span class="label">PA:</span><span>${H(e.pa)}</span></div>`,s+=`<div class="tax-threshold-item"><span class="label">BRL:</span><span>${H(e.brl)}</span></div>`,t.taxInfo&&(s+=`<div class="tax-threshold-item"><span class="label">Headroom:</span><span class="${t.taxInfo.headroomToBRL>0?"success":"warning"}">${H(t.taxInfo.headroomToBRL)}</span></div>`),s+="</div>",s+='<div class="tax-comparison">',s+='<div class="tax-comparison-header">',s+="<div></div><div>Monthly</div><div>YTD</div><div>Projected</div>",s+="</div>";const v=((I=t.taxInfo)==null?void 0:I.monthlyTax)||T/12,_=e.taxPaidYTD||v,E=e.taxProjectedAnnual||((A=t.taxInfo)==null?void 0:A.annualTax)||T;if(s+='<div class="tax-comparison-row">',s+='<div class="label">Tax Paid</div>',s+=`<div>${H(v)}</div>`,s+=`<div>${H(_)}</div>`,s+=`<div>${H(E)}</div>`,s+="</div>",r||((g=t.taxInfo)==null?void 0:g.taxSavedAnnual)>0){const ee=e.taxSavedMonthly||((Y=t.taxInfo)==null?void 0:Y.taxSavedMonthly)||0,_e=e.taxSavedYTD||ee,pe=e.taxSavedProjectedAnnual||((Z=t.taxInfo)==null?void 0:Z.taxSavedAnnual)||0;pe>0&&(s+='<div class="tax-comparison-row saved">',s+='<div class="label">Tax Saved</div>',s+=`<div class="success">-${H(ee)}</div>`,s+=`<div class="success">-${H(_e)}</div>`,s+=`<div class="success">-${H(pe)}</div>`,s+="</div>")}if(s+="</div>",t.taxInfo&&typeof t.taxInfo.effectiveRate=="number"&&!isNaN(t.taxInfo.effectiveRate)){const ee=t.taxInfo.effectiveRate*100;s+=`<div class="effective-rate">
      <span>Effective Tax Rate:</span>
      <span class="${ee<=20?"success":ee<=40?"warning":"danger"}">${ee.toFixed(1)}%</span>
    </div>`}else if(t.taxInfo&&t.taxInfo.annualTaxable>0&&t.taxInfo.annualTax>=0){const ee=t.taxInfo.annualTax/t.taxInfo.annualTaxable*100;s+=`<div class="effective-rate">
      <span>Effective Tax Rate:</span>
      <span class="${ee<=20?"success":ee<=40?"warning":"danger"}">${ee.toFixed(1)}%</span>
    </div>`}if(s+="</div>",e.rebalanceNeeded&&e.rebalanceActions.length>0){s+='<div class="rebalance-card">',s+="<h4>Rebalancing Suggestions</h4>",s+="<ul>";for(const ee of e.rebalanceActions)s+=`<li>${ee}</li>`;s+="</ul>",s+="</div>"}return s+='<div class="mode-explanation">',s+="<h4>Why This Recommendation?</h4>",s+=`<p>${t.reason||"Standard calculation based on your settings."}</p>`,!t.hasSufficientIsa&&t.isaNeededMonthly>0&&(s+=`<p class="isa-warning">To enable tax-efficient mode, you need ${H(t.totalIsaNeeded)} in your ISA (${e.remainingMonths} months remaining in tax year).</p>`),s+="</div>",s+='<details class="debug-section">',s+="<summary>Calculation Details</summary>",s+="<pre>"+JSON.stringify(t,null,2)+"</pre>",s+="</details>",s}function Ca(n,e,t,s){return`<div class="fund-cell ${s>=0?"healthy":"deficit"}">
    <div class="fund-name">${n}</div>
    <div class="fund-current">${H(e)}</div>
    <div class="fund-min">Min: ${H(t)}</div>
    <div class="fund-surplus">${s>=0?"+":""}${H(s)}</div>
  </div>`}function dE(n){switch(n){case ki.DANGER:return"alert-danger";case ki.WARNING:return"alert-warning";case ki.SUCCESS:return"alert-success";case ki.INFO:default:return"alert-info"}}function hE(){return`
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
  `}async function fE(n){const e=cl(n),t=vo(e),s=e.getMonth()+1;return await jb(t)?{showWizard:!1,taxYear:t,isApril:s===4,reason:"Year setup already complete"}:{showWizard:!0,taxYear:t,isApril:s===4,reason:`Tax year ${t} has not been set up`}}function pE(n,e){return n*(1+e)}function mE(n){const{targetAnnualGross:e,brl:t,pa:s=12570,remainingMonths:r,grossIncomeToDate:i=0}=n,a=T=>T<=s?0:T<=t?(T-s)*.2:(t-s)*.2+(T-t)*.4,l=Math.max(0,t-i);if(l<=0)return{isaNeeded:0,brlExhausted:!0,remainingBrlHeadroom:0,maxTaxEfficientSalary:t,reducedSalaryOption:t,canBeTaxEfficient:!1,reason:"BRL already exhausted by prior income"};if(e<=t)return{isaNeeded:0,brlExhausted:!1,remainingBrlHeadroom:l,maxTaxEfficientSalary:t,reducedSalaryOption:t,canBeTaxEfficient:!0,targetAchievableAtBrl:!0,reason:"Target achievable at BRL without ISA"};const c=a(e),d=e-c,f=a(t),m=t-f,y=Math.max(0,d-m),b=y/12*r;return{isaNeeded:b,isaNeededAnnual:y,brlExhausted:!1,remainingBrlHeadroom:l,maxTaxEfficientSalary:t,reducedSalaryOption:t,canBeTaxEfficient:!0,targetAchievableAtBrl:!1,netAtTarget:d,netAtBrl:m,taxAtTarget:c,taxAtBrl:f,reason:`Need £${Math.round(b).toLocaleString()} ISA/Savings for tax efficiency`}}function gE(n,e,t){return t?{sufficient:!1,isBrlExhausted:!0,options:[{key:"reduced",label:"Reduce salary to BRL",description:"Accept lower income to stay tax-efficient"},{key:"inefficient",label:"Accept tax-inefficient year",description:"Draw full SIPP, pay 40% on excess"}]}:n>=e?{sufficient:!0,isBrlExhausted:!1,options:[]}:{sufficient:!1,isBrlExhausted:!1,shortfall:e-n,options:[{key:"increase",label:`Increase ISA to £${Math.round(e).toLocaleString()}`,description:"Provide enough ISA for tax efficiency"},{key:"reduced",label:"Reduce salary to BRL",description:"Keep ISA to grow, accept lower income"},{key:"inefficient",label:"Accept tax-inefficient year",description:"Draw full SIPP, ISA stays untouched"}]}}async function yE(n){const e=cl(n),t=vo(e),r=e.getMonth()+1===4,i=sm(e),a=await pn(),l=await qo(t),c=await qn(),d=Object.keys(c).sort(),f=d.indexOf(t)-1,m=f>=0?c[d[f]]:null,y=await uc(t),b=(m==null?void 0:m.cpi)||.025,T=pE(a.baseSalary,b);return{taxYear:t,selectedMonth:n,isApril:r,remainingMonths:i,baseSalary:a.baseSalary,suggestedSalary:T,defaults:{pa:(m==null?void 0:m.pa)||l.pa,brl:(m==null?void 0:m.brl)||l.brl,hrl:(m==null?void 0:m.hrl)||l.hrl,cpi:b,other:(m==null?void 0:m.other)||0},statePension:y,existingConfig:l.yearSetupComplete?l:null}}function dp(n){const{targetSalary:e,brl:t,pa:s=12570,other:r=0,statePension:i=0,isaSavingsAllocation:a=0,remainingMonths:l,grossIncomeToDate:c=0,isTaxEfficient:d=!0}=n,f=A=>A<=s?0:A<=t?(A-s)*.2:(t-s)*.2+(A-t)*.4,m=r/12,y=i/12,b=m+y;let T,R;if(!d)T=e/12-b,R=0;else{const A=Math.max(0,t-c),g=Math.max(0,A/l-b);T=Math.min(e/12-b,g),R=a/l}const x=(T+b)*12,M=f(x)/12,D=T+b,C=D>0?M/D:0,O=T*C,F=m*C,w=y*C,v=T-O,_=m-F,E=y-w,I=v+_+E+R;return{sipp:{gross:T,tax:O,net:v},other:{gross:m,tax:F,net:_},statePension:{gross:y,tax:w,net:E},isa:{gross:R,tax:0,net:R},totalGross:T+m+y+R,totalTax:M,totalNet:I,mode:d?"tax-efficient":"tax-inefficient",monthlySipp:T,monthlyIsa:R,monthlyOther:m,monthlyStatePension:y,monthlyTotal:I}}function vE(n){var R,x,S,M,D,C,O,F,w,v,_;const{pa:e,brl:t,hrl:s,cpi:r,other:i,isaSavingsAllocation:a,isTaxEfficient:l,taxEfficiencyChoice:c,grossIncomeToDate:d,startMonth:f,confirmedSalary:m,remainingMonths:y,statePension:b,monthlyBreakdown:T}=n;return{pa:e,brl:t,hrl:s,cpi:r,other:i,isaSavingsAllocation:l?a:0,isaSavingsUsed:0,isTaxEfficient:l,taxEfficiencyChoice:c,grossIncomeToDate:d||0,startMonth:f||4,remainingMonths:y||12,yearSetupComplete:!0,confirmedSalary:m,statePension:b||0,expectedMonthly:T?{sipp:{gross:((R=T.sipp)==null?void 0:R.gross)||0,tax:((x=T.sipp)==null?void 0:x.tax)||0,net:((S=T.sipp)==null?void 0:S.net)||0},other:{gross:((M=T.other)==null?void 0:M.gross)||0,tax:((D=T.other)==null?void 0:D.tax)||0,net:((C=T.other)==null?void 0:C.net)||0},statePension:{gross:((O=T.statePension)==null?void 0:O.gross)||0,tax:((F=T.statePension)==null?void 0:F.tax)||0,net:((w=T.statePension)==null?void 0:w.net)||0},isa:{gross:((v=T.isa)==null?void 0:v.gross)||0,tax:0,net:((_=T.isa)==null?void 0:_.net)||0},totalGross:T.totalGross||0,totalTax:T.totalTax||0,totalNet:T.totalNet||0}:null}}let ts=null,Gr=null,bt=1,X=null,B={};async function _E(n,e,t){ts=n,Gr=t,bt=1,B={},X=await yE(e),B={pa:X.defaults.pa,brl:X.defaults.brl,hrl:X.defaults.hrl,cpi:X.defaults.cpi,other:X.defaults.other,grossIncomeToDate:0,confirmedSalary:X.suggestedSalary,isaSavingsAllocation:0,isTaxEfficient:!0,taxEfficiencyChoice:null},Vr()}async function wE(n){return await fE(n)}function Vr(){if(!ts||!X)return;const n=X.isApril?6:7;ts.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Tax Year ${X.taxYear} Setup</div>
        <div class="wizard-subtitle">
          ${X.isApril?"Setting up for the full tax year":`Starting in ${hc(X.selectedMonth)} - ${X.remainingMonths} months remaining`}
        </div>

        <div class="wizard-progress">
          ${TE(n,bt)}
        </div>

        ${bE()}
      </div>
    </div>
  `,IE()}function bE(){if(X.isApril,X.isApril)switch(bt){case 1:return wd();case 2:return bd();case 3:return Ed();case 4:return Td();case 5:return Id();case 6:return Sd();default:return""}else switch(bt){case 1:return wd();case 2:return EE();case 3:return bd();case 4:return Ed();case 5:return Td();case 6:return Id();case 7:return Sd();default:return""}}function wd(){return`
    <div class="wizard-step">
      <div class="wizard-step-title">Tax Thresholds for ${X.taxYear}</div>
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
  `}function EE(){const n=hc(X.selectedMonth),e=RE(X.selectedMonth);return`
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
  `}function bd(){const n=B.cpi!==void 0?B.cpi:X.defaults.cpi,e=(n*100).toFixed(1),t=X.baseSalary,s=Math.round(t*(1+n));return`
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
  `}function Ed(){const n=X.statePension,e=n.isReceiving?`<span style="color: var(--success);">Receiving £${Math.round(n.amount).toLocaleString()}/year</span>`:`<span style="color: var(--text-muted);">${n.yearsUntil} years until state pension</span>`;return`
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
  `}function Td(){hi();const n=mE({targetAnnualGross:B.confirmedSalary,brl:B.brl,pa:B.pa,other:B.other,statePension:X.statePension.amount,remainingMonths:X.remainingMonths,grossIncomeToDate:B.grossIncomeToDate});return B._isaCalc=n,n.brlExhausted?`
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
        <p>To be tax-efficient for the remaining <strong>${X.remainingMonths} months</strong>, you need:</p>
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
  `}function Id(){hi();const n=B._isaCalc,e=gE(B.isaSavingsAllocation,(n==null?void 0:n.isaNeeded)||0,(n==null?void 0:n.brlExhausted)||!1);if(e.sufficient&&!e.isBrlExhausted)return B.isTaxEfficient=!0,B.taxEfficiencyChoice="efficient",setTimeout(()=>{bt++,Vr()},0),`
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
  `}function Sd(){hi();const n=dp({targetSalary:B.confirmedSalary,brl:B.brl,pa:B.pa,other:B.other,statePension:X.statePension.amount,isaSavingsAllocation:B.isaSavingsAllocation,remainingMonths:X.remainingMonths,grossIncomeToDate:B.grossIncomeToDate,isTaxEfficient:B.isTaxEfficient}),e=B.isTaxEfficient?"Tax-Efficient":"Tax-Inefficient",t=B.isTaxEfficient?"success":"warning",s=r=>`£${Math.round(r).toLocaleString()}`;return`
    <div class="wizard-step">
      <div class="wizard-step-title">Confirm Tax Year Setup</div>

      <div class="wizard-summary">
        <div class="wizard-summary-row">
          <span>Tax Year:</span>
          <span>${X.taxYear}</span>
        </div>
        <div class="wizard-summary-row">
          <span>Starting Month:</span>
          <span>${hc(X.selectedMonth)}</span>
        </div>
        <div class="wizard-summary-row">
          <span>Remaining Months:</span>
          <span>${X.remainingMonths}</span>
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
  `}function TE(n,e){let t="";for(let s=1;s<=n;s++){const r=s<e?"done":s===e?"active":"";t+=`<div class="wizard-dot ${r}"></div>`}return t}function IE(){ts.querySelectorAll("[data-action]").forEach(e=>{e.addEventListener("click",()=>SE(e.dataset.action))}),window._updateWizardSalary=function(){const e=document.getElementById("wizCPI"),t=document.getElementById("wizSalary"),s=document.getElementById("cpiDisplay"),r=document.getElementById("suggestedSalaryDisplay");if(e&&t&&s&&r){const i=parseFloat(e.value)||0,a=i/100,l=X.baseSalary,c=Math.round(l*(1+a));s.textContent=i.toFixed(1),r.textContent=c.toLocaleString(),t.value=c,B.cpi=a,B.confirmedSalary=c}}}function SE(n){hi();const e=X.isApril?6:7;switch(n){case"cancel":hp(),Gr&&Gr({completed:!1,cancelled:!0});break;case"next":bt<e&&(bt++,Vr());break;case"back":bt>1&&(bt--,Vr());break;case"apply-choice":xE(),bt++,Vr();break;case"finish":AE();break}}function xE(){var e;const n=(e=document.querySelector('input[name="taxChoice"]:checked'))==null?void 0:e.value;switch(B.taxEfficiencyChoice=n,n){case"increase":B.isaSavingsAllocation=B._isaCalc.isaNeeded,B.isTaxEfficient=!0;break;case"reduced":B.confirmedSalary=B.brl,B.isaSavingsAllocation=0,B.isTaxEfficient=!0;break;case"inefficient":B.isaSavingsAllocation=0,B.isTaxEfficient=!1;break}}function hi(){const n=document.getElementById("wizPA");n&&(B.pa=parseFloat(n.value)||12570);const e=document.getElementById("wizBRL");e&&(B.brl=parseFloat(e.value)||50270);const t=document.getElementById("wizHRL");t&&(B.hrl=parseFloat(t.value)||125140);const s=document.getElementById("wizCPI");s&&(B.cpi=(parseFloat(s.value)||4)/100);const r=document.getElementById("wizSalary");r&&(B.confirmedSalary=parseFloat(r.value)||3e4);const i=document.getElementById("wizOther");i&&(B.other=parseFloat(i.value)||0);const a=document.getElementById("wizISA");a&&(B.isaSavingsAllocation=parseFloat(a.value)||0);const l=document.getElementById("wizIncomeToDate");l&&(B.grossIncomeToDate=parseFloat(l.value)||0)}async function AE(){hi();const n=dp({targetSalary:B.confirmedSalary,brl:B.brl,pa:B.pa,other:B.other,statePension:X.statePension.amount,isaSavingsAllocation:B.isaSavingsAllocation,remainingMonths:X.remainingMonths,grossIncomeToDate:B.grossIncomeToDate,isTaxEfficient:B.isTaxEfficient}),e=vE({pa:B.pa,brl:B.brl,hrl:B.hrl,cpi:B.cpi,other:B.other,isaSavingsAllocation:B.isaSavingsAllocation,isTaxEfficient:B.isTaxEfficient,taxEfficiencyChoice:B.taxEfficiencyChoice,grossIncomeToDate:B.grossIncomeToDate,startMonth:parseInt(X.selectedMonth.split("-")[1]),confirmedSalary:B.confirmedSalary,remainingMonths:X.remainingMonths,statePension:X.statePension.amount,monthlyBreakdown:n});console.log(`Tax Year Wizard: Saving config for ${X.taxYear}`,e);try{await ms(X.taxYear,e),console.log(`Tax Year Wizard: Successfully saved config for ${X.taxYear}`)}catch(t){console.error(`Tax Year Wizard: Failed to save config for ${X.taxYear}`,t),typeof window.showToast=="function"&&window.showToast(`Error saving tax year configuration: ${t.message}`,"error");return}hp(),Gr&&Gr({completed:!0,taxYear:X.taxYear,config:e,wizardInputs:B})}function hp(){ts&&(ts.innerHTML="",ts.style.display="none")}function hc(n){const[e,t]=n.split("-").map(Number);return new Date(e,t-1,1).toLocaleString("default",{month:"long",year:"numeric"})}function RE(n){const[e,t]=n.split("-").map(Number);return new Date(e,t-2,1).toLocaleString("default",{month:"long"})}function PE(){return`
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
  `}function CE(n={},e=null){const t=Yo(n,e),s=op(t),r=lp(s);return{results:s,stats:r,config:t}}function kE(n={},e=null){const t=Yo(n,e),s=ap(t),r=lp(s);return{results:s,stats:r,config:t}}function ME(n={}){const e=Yo(n),t={};for(const[s,r]of Object.entries(Zp))t[s]={...r,result:Zb(e,r)};return t}function fp(n){return vo(cl(n))}function DE(n){const[e,t]=n.split("-").map(Number);return Math.max(0,(t>=4?e:e-1)-2026)}async function NE(n,e,t,s,r){var ws,bs,Nt,hr;const i=r.settings,a=r.history,l=r.allTaxYears,c=fp(n),d=DE(n),[f,m]=n.split("-").map(Number);if(!l[c])throw new Error(`Tax year ${c} is not configured. Please add it in the Settings tab before calculating.`);const y=l[c],b=y.pa||12570,T=y.brl||50270,R=y.hrl||125140,x=y.other||0,S=y.isTaxEfficient!==!1,M=y.isaSavingsAllocation||0,D=y.grossIncomeToDate||0,C=y.confirmedSalary||i.baseSalary,O=a.find(te=>te.date===n),F=(O==null?void 0:O.isa)||0,w=Math.max(0,(y.isaSavingsUsed||0)-F),_=r.spInfo.amount||0;let E=1;for(let te=0;te<d;te++){const Ne=String((26+te)%100).padStart(2,"0")+"/"+String((27+te)%100).padStart(2,"0"),Ee=(l[Ne]||{}).cpi||rm;E*=1+Ee}const I=Math.round(tn(i.equityMin,d,i.duration,E,!0)),A=Math.round(tn(i.bondMin,d,i.duration,E,!0)),g=Math.round(tn(i.cashTarget,d,i.duration,E,!1)),Y=e+t,Z=I+A;let ee=!1,_e=0;const pe=a.filter(te=>te.date<n);for(let te=pe.length-1;te>=0&&pe[te].source==="Cash";te--)_e++;pe.length&&pe[pe.length-1].inProtection&&(ee=Y<=Z+(i.recoveryBuffer||1e4)),!ee&&Y<Z&&_e+1>=(i.consecutiveLimit||3)&&(ee=!0);const vt=m>=4?16-m:4-m,Se=Math.max(1,vt),ft=C*E,re=x+_;Rn(ft,b,T,R);let Q,It,J,xe=0,ne=0,Ye=!1,it=0;const ce=Math.max(0,M-w)/Se;if(S){const te=re/12;a.filter(Ae=>Ae.taxYear===c&&Ae.date<n);const Ne=ft/12,Ee=r.isaBalance||0;let at,me;if(Ee>0){const Ae=ip({targetGross:ft,fixedIncome:re,pa:b,brl:T,hrl:R,isaBalance:Ee,strategy:i.isaDrawdownStrategy||"minimiseEarlyTax",yearsUntilSp:0});at=Ae.sippGross/12,me=Ae.isaDraw/12}else{if(((bs=(ws=y.expectedMonthly)==null?void 0:ws.sipp)==null?void 0:bs.gross)>0)at=y.expectedMonthly.sipp.gross;else{const Te=Math.max(0,T-D-re)/12;at=Math.min(Ne-te,Te)}const Ae=Rn(ft,b,T,R)/12,nt=Math.min(ft,T),he=Rn(nt,b,T,R)/12,Ue=Math.max(0,Ae-he);me=Math.min(Ue,ce)}if(it=me,xe=at,ee){const Ae=(i.protectionFactor||20)/100;Q=at*(1-Ae),It=me,J="Protection"}else{Q=at,It=me,J="Tax-Efficient";const Ae=m>=4?f:f-1,nt=pe.filter(ge=>{const[Te,Gt]=ge.date.split("-").map(Number);return(Gt>=4?Te:Te-1)===Ae});let he=0,Ue=0;if(nt.forEach(ge=>{Ue+=ge.sipp||0,ge.inProtection&&ge.stdSipp&&(he+=ge.stdSipp-ge.sipp),ge.boostAmount>0&&(he-=ge.boostAmount)}),he>0){const ge=Ue+Q*Se+re,Te=T-ge,Gt=Y-Z-(i.recoveryBuffer||1e4);if(Te>0&&Gt>0){const Es=Te/Se,Ts=he/Se,yi=Gt/Se;ne=Math.min(Ts,Es,yi),ne>50&&(Q+=ne,J="Tax Boost")}}}}else{const te=ft/12,Ne=re/12;let Ee;if(((hr=(Nt=y.expectedMonthly)==null?void 0:Nt.sipp)==null?void 0:hr.gross)>0?Ee=y.expectedMonthly.sipp.gross:Ee=Math.max(0,te-Ne),xe=Ee,It=0,ee){const at=(i.protectionFactor||20)/100;Q=Ee*(1-at),J="Protection";const me=m>=4?f:f-1,Ae=pe.filter(Ue=>{const[ge,Te]=Ue.date.split("-").map(Number);return(Te>=4?ge:ge-1)===me});let nt=0;Ae.forEach(Ue=>{nt+=Ue.sipp||0});const he=nt+Q*Se+re;if(he<T){const ge=(T-he)/Se,Te=Y-Z-(i.recoveryBuffer||1e4);Te>0&&ge>50&&(ne=Math.min(ge,Te/Se),ne>50&&(Q+=ne,Ye=!0,J="Protection-Induced Efficiency"))}}else{Q=Ee,J="Tax-Inefficient";const at=m>=4?f:f-1,me=pe.filter(he=>{const[Ue,ge]=he.date.split("-").map(Number);return(ge>=4?Ue:Ue-1)===at});let Ae=0,nt=0;if(me.forEach(he=>{nt+=he.sipp||0,he.inProtection&&he.stdSipp&&(Ae+=he.stdSipp-he.sipp),he.boostAmount>0&&(Ae-=he.boostAmount)}),Ae>0){const he=nt+Q*Se+re,Ue=T-he,ge=Y-Z-(i.recoveryBuffer||1e4);if(Ue>0&&ge>0){const Te=Ue/Se,Gt=Ae/Se,Es=ge/Se;ne=Math.min(Gt,Te,Es),ne>50&&(Q+=ne,J="Tax Boost")}}}}let Ge,Me,tt=0,ot=0,gs=0,ir="";if(!ee&&Y>=Z+Q){Ge="Growth";const te=Math.max(0,e-I),Ne=Math.max(0,t-A),Ee=te+Ne;Ee>0?(tt=Q*te/Ee,ot=Q*Ne/Ee,Me="Healthy"):(Ge="Cash",gs=Q,Me="At min")}else Ge="Cash",gs=Q,Me=ee?"Protection":"Below min",s<Q&&(ir="Cash low!");let Wt="";const Hn=e-I,mn=t-A;if(Hn>5e3&&mn<-5e3){const te=Math.floor(Math.min(Hn,-mn)/1e3)*1e3;te>=5e3&&(Wt=`Move £${te.toLocaleString()} Equity→Bond`)}else if(mn>5e3&&Hn<-5e3){const te=Math.floor(Math.min(mn,-Hn)/1e3)*1e3;te>=5e3&&(Wt=`Move £${te.toLocaleString()} Bond→Equity`)}let ys="";const pi=g-s;if(pi>5e3&&Ge==="Growth"&&!ee){const te=Y-Z-Q;if(te>1e4){const Ne=Math.floor(Math.min(pi*.3,te*.5)/1e3)*1e3;Ne>=5e3&&(ys=`Replenish Cash: Move £${Ne.toLocaleString()} from growth funds`)}}const Yt=[];ir&&Yt.push({message:ir,severity:"danger",type:"low-cash"}),ne>50&&Yt.push({message:`Tax Boost: +£${Math.round(ne).toLocaleString()}/mo catch-up from protection shortfall`,severity:"success",type:"tax-boost"}),Wt&&Yt.push({message:Wt,severity:"warning",type:"rebalance"}),ys&&Yt.push({message:ys,severity:"info",type:"cash-replenish"});const or=m>=4?f:f-1,ar=pe.filter(te=>{const[Ne,Ee]=te.date.split("-").map(Number);return(Ee>=4?Ne:Ne-1)===or}),Be=ar.reduce((te,Ne)=>te+(Ne.sipp||0),0),De=ar.length+1,mi=Math.max(0,12-De)*xe,cr=Be+Q+mi+x+_,Dt=Gi(cr,b,T,R),ur=Dt/12,vs=Q+x/12+_/12-ur+It,na=ur*De,sa=Dt,dr=ft/12,gi=Gi(dr*12,b,T,R),_s=Math.max(0,gi/12-Dt/12),jn=w+it;return{date:n,taxYear:c,yearNumber:d,remainingMonths:Se,equity:e,bond:t,cash:s,isa:0,adjEquityMin:I,adjBondMin:A,adjCashTarget:g,pa:b,brl:T,other:x/12,statePension:_/12,sippDraw:Q,stdSipp:xe,isaDraw:It,totalMonthlyNet:vs,isTaxEfficientYear:S,yearlyIsaSavingsAllocation:M,cumulativeIsaSavingsUsed:jn,isaSavingsUsedThisMonth:it,taxPaidYTD:na,taxProjectedAnnual:sa,taxSavedMonthly:_s,taxSavedYTD:_s*De,taxSavedProjectedAnnual:_s*12,taxEfficient:S&&!Ye,inProtection:ee,protectionReason:ee?Me:null,consecutiveCashDraws:_e,protectionInducedTaxEfficiency:Ye,boostAmount:ne>50?ne:0,boostEligible:ne>50,source:Ge,drawFromEquity:tt,drawFromBond:ot,drawFromCash:gs,rebalanceNeeded:Wt!=="",rebalanceActions:Wt?[Wt]:[],alerts:Yt,calculationDetails:{mode:J,reason:`${Me} | ${J}`,totalGrowth:Y,minGrowth:Z,consec:_e,stdSipp:Q,inputs:{baseSalary:i.baseSalary,confirmedSalary:C,targetGross:ft,cumInf:E,yearNum:d,taxYear:c,OTHER:x,STATE:_,PA:b,BRL:T,isTaxEfficientYear:S,yearlyIsaSavingsAllocation:M,grossIncomeToDate:D},taxInfo:{annualTaxable:cr,headroomToBRL:T-cr,annualTax:Dt,monthlyNet:vs}}}}let Kr=null;function LE(n,e){Kr=n,OE(e)}function OE({onGetStarted:n,onSignIn:e}){Kr&&(Kr.innerHTML=`
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
  `,document.getElementById("landingGetStarted").addEventListener("click",n),document.getElementById("landingSignIn").addEventListener("click",e))}function Qr(){Kr&&(Kr.style.display="none")}function VE(){return`
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
  `}let dt=null,ka=null,Ms=!1;function BE(n,e){console.log("initAuthScreen: initializing"),dt=n,ka=e,Ms=!1,_b(t=>{console.log("AuthScreen: auth state change received:",t?t.email:"null","processed:",Ms),t&&ka&&!Ms?(console.log("AuthScreen: calling onAuthSuccessCallback"),Ms=!0,HE(),ka(t)):t?console.log("AuthScreen: skipping callback, already processed or no callback"):(Ms=!1,console.log("AuthScreen: user signed out, reset authProcessed"))}),pp(),console.log("initAuthScreen: complete")}function pp(){if(dt){if(!Ve()){dt.innerHTML=`
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
    `;return}dt.innerHTML=`
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
  `,FE()}}function FE(){const n=dt.querySelectorAll(".auth-screen-tab");n.forEach(i=>{i.addEventListener("click",()=>{n.forEach(c=>c.classList.remove("active")),i.classList.add("active");const a=document.getElementById("signinForm"),l=document.getElementById("signupForm");i.dataset.tab==="signin"?(a.style.display="block",l.style.display="none"):(a.style.display="none",l.style.display="block"),fi()})}),document.getElementById("signinForm").addEventListener("submit",zE),document.getElementById("signupForm").addEventListener("submit",UE),document.getElementById("forgotPasswordBtn").addEventListener("click",$E),document.getElementById("googleSigninBtn").addEventListener("click",qE)}function Nn(n){const e=document.getElementById("authScreenError");e&&(e.textContent=n,e.style.display="block")}function fi(){const n=document.getElementById("authScreenError");n&&(n.style.display="none")}async function zE(n){n.preventDefault(),fi();const e=document.getElementById("signinEmail").value.trim(),t=document.getElementById("signinPassword").value;if(!e||!t){Nn("Please enter email and password");return}try{await bb(e,t)}catch(s){console.error("Sign in error:",s),Nn(Go(s.code))}}async function UE(n){n.preventDefault(),fi();const e=document.getElementById("signupName").value.trim(),t=document.getElementById("signupEmail").value.trim(),s=document.getElementById("signupPassword").value;if(!e||!t||!s){Nn("Please fill in all fields");return}if(s.length<6){Nn("Password must be at least 6 characters");return}try{await wb(t,s,e)}catch(r){console.error("Sign up error:",r),Nn(Go(r.code))}}async function $E(){fi();const n=document.getElementById("signinEmail").value.trim();if(!n){Nn("Please enter your email address first");return}try{await Tb(n),typeof window.showToast=="function"&&window.showToast("Password reset email sent. Check your inbox.","success",5e3)}catch(e){console.error("Reset password error:",e),Nn(Go(e.code))}}async function qE(){fi();try{await Eb()}catch(n){console.error("Google sign in error:",n),Nn(Go(n.code))}}function Go(n){return{"auth/invalid-email":"Invalid email address","auth/user-disabled":"This account has been disabled","auth/user-not-found":"No account found with this email","auth/wrong-password":"Incorrect password","auth/email-already-in-use":"An account already exists with this email","auth/weak-password":"Password is too weak","auth/operation-not-allowed":"Sign in method not enabled","auth/popup-closed-by-user":"Sign in cancelled","auth/popup-blocked":"Sign in popup was blocked","auth/too-many-requests":"Too many attempts. Please try again later.","auth/invalid-credential":"Invalid email or password"}[n]||"An error occurred. Please try again."}function HE(){dt&&(dt.innerHTML=`
      <div class="auth-screen">
        <div class="auth-screen-box" style="text-align: center;">
          <div class="auth-screen-header">
            <h1>Pension Planner</h1>
            <p>Signing in...</p>
          </div>
        </div>
      </div>
    `)}function mp(){console.log("hideAuthScreen: hiding auth screen, element=",!!dt),dt&&(dt.style.display="none",console.log("hideAuthScreen: set display to none"))}function jE(){Ms=!1,dt&&(dt.style.display="block",pp())}function po(n="signin"){jE(),dt.querySelectorAll(".auth-screen-tab").forEach(i=>i.classList.remove("active"));const t=dt.querySelector(`.auth-screen-tab[data-tab="${n}"]`);t&&t.classList.add("active");const s=document.getElementById("signinForm"),r=document.getElementById("signupForm");s&&r&&(s.style.display=n==="signin"?"block":"none",r.style.display=n==="signup"?"block":"none")}function WE(){return`
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
  `}let Jr=null;function YE(n,e,t){Jr=n,GE(e,t)}function GE(n,e){if(!Jr)return;const t=n||"there";Jr.innerHTML=`
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
  `,document.getElementById("onboardingStartWizard").addEventListener("click",e)}function Ko(){Jr&&(Jr.style.display="none")}function KE(){return`
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
  `}let cn=null,mo=null,z={scenarioName:"My Plan",scenarioDescription:"",enabledTools:["stress","decision"],introDone:!1,baseSalary:3e4,otherIncome:0,spStartDate:"",spWeeklyAmount:0,equityMin:25e4,bondMin:2e5,cashTarget:5e4,duration:35,taxMode:"inflates",decisionSalary:3e4,decisionEquity:25e4,decisionBond:2e5,decisionCash:5e4,decisionDuration:35},st="scenario",we=1;function gp(){st="scenario",we=1,z={scenarioName:"My Plan",scenarioDescription:"",enabledTools:["stress","decision"],introDone:!1,baseSalary:3e4,otherIncome:0,spStartDate:"",spWeeklyAmount:0,equityMin:25e4,bondMin:2e5,cashTarget:5e4,duration:35,taxMode:"inflates",decisionSalary:3e4,decisionEquity:25e4,decisionBond:2e5,decisionCash:5e4,decisionDuration:35}}function yp(n,e){cn=n,mo=e,gp(),xt()}function xt(){cn&&(st==="scenario"?QE():st==="stress"?ZE():st==="decision"&&tT())}function QE(){cn.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Welcome to Pension Planner</div>
        <div class="wizard-subtitle">Let's create your first plan</div>

        <div class="wizard-progress">
          ${fc(2,we)}
        </div>

        ${we===1?JE():XE()}
      </div>
    </div>
  `,pc()}function JE(){return`
    <div class="wizard-step">
      <div class="wizard-step-title">Name your plan</div>
      <div class="wizard-step-desc">
        Give your plan a name. You can create multiple plans later for different scenarios
        (e.g. "Retire at 57", "Conservative at 60").
      </div>

      <div class="wizard-input" style="margin-bottom: 16px;">
        <input type="text" id="wizScenarioName" value="${z.scenarioName}" placeholder="e.g. My Retirement Plan" style="max-width: 300px;">
      </div>

      <div class="wizard-step-desc" style="margin-bottom: 8px;">
        Add an optional description:
      </div>

      <div class="wizard-input">
        <input type="text" id="wizScenarioDesc" value="${z.scenarioDescription}" placeholder="e.g. Based on retiring at age 57" style="max-width: 400px;">
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="skip-all">Skip Setup</button>
        <button class="wizard-btn primary" data-action="next">Next</button>
      </div>
    </div>
  `}function XE(){const n=z.enabledTools.includes("stress"),e=z.enabledTools.includes("decision");return`
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
  `}function ZE(){cn.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Stress Tester Setup</div>
        <div class="wizard-subtitle">Let's set up your pension simulation in a few simple steps.</div>

        <div class="wizard-progress">
          ${fc(6,we)}
        </div>

        ${eT(we)}
      </div>
    </div>
  `,pc()}function eT(n){switch(n){case 1:return`
        <div class="wizard-step">
          <div class="wizard-step-title">How much money do you want each year?</div>
          <div class="wizard-step-desc">
            Think of this as your "salary" in retirement. This is the total amount before tax that you want to receive each year.
          </div>

          <div class="wizard-input">
            <span class="wizard-unit">£</span>
            <input type="number" id="wizBaseSalary" value="${z.baseSalary}">
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
            <input type="number" id="wizOther" value="${z.otherIncome}">
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
                <input type="text" id="wizSpStartDate" value="${z.spStartDate}" placeholder="e.g. 6 May 2040" style="width: 100%;">
              </div>
            </div>
            <div class="wizard-grid-item">
              <label>Weekly Amount (from HMRC)</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizSpWeeklyAmount" value="${z.spWeeklyAmount||""}" step="0.01" placeholder="e.g. 221.20">
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
                <input type="number" id="wizEquityMin" value="${z.equityMin}">
              </div>
            </div>
            <div class="wizard-grid-item">
              <label>Bonds (Medium Risk)</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizBondMin" value="${z.bondMin}">
              </div>
            </div>
            <div class="wizard-grid-item">
              <label>Cash (Low Risk)</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizCashTarget" value="${z.cashTarget}">
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
            <input type="number" id="wizDuration" value="${z.duration}" style="max-width: 100px;">
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
              <option value="inflates" ${z.taxMode==="inflates"?"selected":""}>Standard (rise with inflation)</option>
              <option value="frozen" ${z.taxMode==="frozen"?"selected":""}>Frozen (stay at current levels)</option>
            </select>
          </div>

          <div class="wizard-example">
            <strong>Tip:</strong> "Frozen" is more pessimistic - you pay more tax over time as your income grows but thresholds don't.
          </div>

          <div class="wizard-buttons">
            <button class="wizard-btn secondary" data-action="back">Back</button>
            <button class="wizard-btn primary" data-action="finish-stress">${z.enabledTools.includes("decision")?"Continue to Decision Tool":"Finish Setup"}</button>
          </div>
        </div>
      `;default:return""}}function tT(){cn.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Decision Tool Setup</div>
        <div class="wizard-subtitle">Now let's set up the tool you'll use each month once you're retired.</div>

        <div class="wizard-progress">
          ${fc(4,we)}
        </div>

        ${nT(we)}
      </div>
    </div>
  `,pc()}function nT(n){switch(n){case 1:return`
        <div class="wizard-step">
          <div class="wizard-step-title">How much money do you want each year?</div>
          <div class="wizard-step-desc">
            This is your target "salary" from your pension. The tool will calculate how much to withdraw each month.
          </div>

          <div class="wizard-input">
            <span class="wizard-unit">£</span>
            <input type="number" id="wizDBaseSalary" value="${z.decisionSalary}">
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
                <input type="number" id="wizDEquityMin" value="${z.decisionEquity}">
              </div>
            </div>
            <div class="wizard-grid-item">
              <label>Bonds</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizDBondMin" value="${z.decisionBond}">
              </div>
            </div>
            <div class="wizard-grid-item">
              <label>Cash</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizDCashTarget" value="${z.decisionCash}">
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
            <input type="number" id="wizDDuration" value="${z.decisionDuration}" style="max-width: 100px;">
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
      `;default:return""}}function fc(n,e){let t="";for(let s=1;s<=n;s++){const r=s<e?"done":s===e?"active":"";t+=`<div class="wizard-dot ${r}"></div>`}return t}function pc(){cn.querySelectorAll("[data-action]").forEach(e=>{e.addEventListener("click",()=>sT(e.dataset.action))})}function sT(n){switch(vp(),n){case"skip-all":Fs();break;case"next":{const e=jo(z.spStartDate);if(!e.valid){typeof window.showToast=="function"&&window.showToast(e.error,"error");return}st==="scenario"?we<2&&(we++,xt()):st==="stress"?we<6&&(we++,xt()):st==="decision"&&we<4&&(we++,xt());break}case"back":(st==="scenario"&&we>1||st==="stress"&&we>1||st==="decision"&&we>1)&&(we--,xt());break;case"start-tools":if(!z.enabledTools||z.enabledTools.length===0){typeof window.showToast=="function"&&window.showToast("Please select at least one tool","error");return}Ma("scenario");break;case"skip-stress":Ma("stress");break;case"finish-stress":z.decisionSalary=z.baseSalary,z.decisionEquity=z.equityMin,z.decisionBond=z.bondMin,z.decisionCash=z.cashTarget,z.decisionDuration=z.duration,Ma("stress");break;case"skip-decision":Fs();break;case"finish":Fs();break}}function Ma(n){const e=z.enabledTools.includes("stress"),t=z.enabledTools.includes("decision");n==="scenario"?e?(st="stress",we=1,xt()):t?(st="decision",we=1,xt()):Fs():n==="stress"&&t?(st="decision",we=1,xt()):Fs()}function vp(){const n=document.getElementById("wizScenarioName");n&&(z.scenarioName=n.value.trim()||"My Plan");const e=document.getElementById("wizScenarioDesc");e&&(z.scenarioDescription=e.value.trim()||"");const t=document.getElementById("wizToolStress"),s=document.getElementById("wizToolDecision");if(t!==null||s!==null){const M=[];t&&t.checked&&M.push("stress"),s&&s.checked&&M.push("decision"),z.enabledTools=M}const r=document.getElementById("wizBaseSalary");r&&(z.baseSalary=parseFloat(r.value)||3e4);const i=document.getElementById("wizOther");i&&(z.otherIncome=parseFloat(i.value)||0);const a=document.getElementById("wizSpStartDate");a&&(z.spStartDate=a.value.trim()||"");const l=document.getElementById("wizSpWeeklyAmount");l&&(z.spWeeklyAmount=parseFloat(l.value)||0);const c=document.getElementById("wizEquityMin");c&&(z.equityMin=parseFloat(c.value)||25e4);const d=document.getElementById("wizBondMin");d&&(z.bondMin=parseFloat(d.value)||2e5);const f=document.getElementById("wizCashTarget");f&&(z.cashTarget=parseFloat(f.value)||5e4);const m=document.getElementById("wizDuration");m&&(z.duration=parseInt(m.value)||35);const y=document.getElementById("wizTaxMode");y&&(z.taxMode=y.value);const b=document.getElementById("wizDBaseSalary");b&&(z.decisionSalary=parseFloat(b.value)||3e4);const T=document.getElementById("wizDEquityMin");T&&(z.decisionEquity=parseFloat(T.value)||25e4);const R=document.getElementById("wizDBondMin");R&&(z.decisionBond=parseFloat(R.value)||2e5);const x=document.getElementById("wizDCashTarget");x&&(z.decisionCash=parseFloat(x.value)||5e4);const S=document.getElementById("wizDDuration");S&&(z.decisionDuration=parseInt(S.value)||35)}function Fs(){vp(),mo&&mo(z)}function Qo(){cn&&(cn.style.display="none")}function rT(n,e,t,s){if(cn=n,mo=t,gp(),z.enabledTools=e,s&&(e.includes("stress")&&s.source==="decision"&&(z.baseSalary=s.baseSalary||3e4,z.equityMin=s.equityMin||25e4,z.bondMin=s.bondMin||2e5,z.cashTarget=s.cashTarget||5e4,z.duration=s.duration||35,z.spStartDate=s.spStartDate||"",z.spWeeklyAmount=s.spWeeklyAmount||0),e.includes("decision")&&s.source==="stress"&&(z.decisionSalary=s.baseSalary||3e4,z.decisionEquity=s.equityMin||25e4,z.decisionBond=s.bondMin||2e5,z.decisionCash=s.cashTarget||5e4,z.decisionDuration=s.duration||35)),e.includes("stress"))st="stress";else if(e.includes("decision"))st="decision";else{t&&t(z);return}we=1,xt()}function iT(){return`
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
  `}function Jo(){const e=getComputedStyle(document.documentElement).getPropertyValue("--bg").trim()==="#0d1117"||document.documentElement.classList.contains("dark")||window.matchMedia("(prefers-color-scheme: dark)").matches;return{primary:"#f0c674",success:"#2ea043",warning:"#e1b12c",danger:"#f85149",muted:"#8b8b9b",grid:"rgba(255,255,255,0.1)",bg:e?"rgba(15,15,26,1)":"#ffffff",text:e?"#c9d1d9":"#1f2937",cardBg:e?"#21262d":"#ffffff",cone:"rgba(240,198,116,0.15)",coneMid:"rgba(240,198,116,0.2)",coneInner:"rgba(240,198,116,0.35)",coneBorder:"rgba(240,198,116,0.4)",trajectory:"rgba(46,160,67,0.25)",trajectoryFailed:"rgba(248,81,73,0.8)",trajectoryHover:"#5fdd7b",trajectoryFailedHover:"#ff6b6b",glidepath:"#7eb8da",zeroLine:"#f85149"}}const cs=new Map;let Rs=-1;function xd(n,e,t,s,r,i){const a=r-t,l=i-s,c=a*a+l*l;if(c===0)return Math.sqrt((n-t)*(n-t)+(e-s)*(e-s));const d=Math.max(0,Math.min(1,((n-t)*a+(e-s)*l)/c)),f=t+d*a,m=s+d*l;return Math.sqrt((n-f)*(n-f)+(e-m)*(e-m))}function oT(n,e,t={}){const s=Jo(),r=n.getContext("2d"),{width:i,height:a}=n,l={top:45,right:40,bottom:50,left:80},c=i-l.left-l.right,d=a-l.top-l.bottom;r.fillStyle="rgba(0,0,0,0.2)",r.fillRect(0,0,i,a);const f=t.title||"Fund Value Projections (Percentile Bands)";r.font="bold 14px system-ui, sans-serif",r.fillStyle=s.text,r.textAlign="center",r.fillText(f,l.left+c/2,22);const m=t.years||35,y={};for(let S=0;S<=m;S++)y[S]=[];e.forEach(S=>{S.hist.forEach(M=>{const D=Math.floor(M.year);y[D]!==void 0&&y[D].push(M.total)})});const b=[];for(let S=0;S<=m;S++){const M=y[S].sort((C,O)=>C-O);if(M.length===0)continue;const D=C=>M[Math.floor(M.length*C)]||0;b.push({year:S,p5:D(.05),p10:D(.1),p25:D(.25),p50:D(.5),p75:D(.75),p90:D(.9),p95:D(.95)})}if(b.length===0)return;const T=Math.max(...b.map(S=>S.p90))*1.15,R=S=>l.left+S/m*c,x=S=>a-l.bottom-S/T*d;r.strokeStyle=s.grid,r.lineWidth=1;for(let S=0;S<=5;S++){const M=l.top+S/5*d;r.beginPath(),r.moveTo(l.left,M),r.lineTo(i-l.right,M),r.stroke()}r.fillStyle=s.cone,r.beginPath(),b.forEach((S,M)=>{const D=R(S.year);M===0?r.moveTo(D,x(S.p95)):r.lineTo(D,x(S.p95))});for(let S=b.length-1;S>=0;S--)r.lineTo(R(b[S].year),x(b[S].p5));r.closePath(),r.fill(),r.fillStyle=s.coneMid,r.beginPath(),b.forEach((S,M)=>{const D=R(S.year);M===0?r.moveTo(D,x(S.p90)):r.lineTo(D,x(S.p90))});for(let S=b.length-1;S>=0;S--)r.lineTo(R(b[S].year),x(b[S].p10));r.closePath(),r.fill(),r.fillStyle=s.coneInner,r.beginPath(),b.forEach((S,M)=>{const D=R(S.year);M===0?r.moveTo(D,x(S.p75)):r.lineTo(D,x(S.p75))});for(let S=b.length-1;S>=0;S--)r.lineTo(R(b[S].year),x(b[S].p25));r.closePath(),r.fill(),t.glide&&t.glide.length>0&&(r.strokeStyle=s.glidepath,r.lineWidth=2,r.setLineDash([6,3]),r.beginPath(),t.glide.forEach((S,M)=>{const D=R(S.year),C=x(S.min);M===0?r.moveTo(D,C):r.lineTo(D,C)}),r.stroke(),r.setLineDash([])),r.strokeStyle=s.primary,r.lineWidth=3,r.beginPath(),b.forEach((S,M)=>{const D=R(S.year),C=x(S.p50);M===0?r.moveTo(D,C):r.lineTo(D,C)}),r.stroke(),r.strokeStyle="rgba(248,81,73,0.6)",r.lineWidth=1.5,r.setLineDash([4,2]),r.beginPath(),b.forEach((S,M)=>{const D=R(S.year);M===0?r.moveTo(D,x(S.p10)):r.lineTo(D,x(S.p10))}),r.stroke(),r.setLineDash([]),r.strokeStyle=s.zeroLine,r.lineWidth=2,r.setLineDash([5,5]),r.beginPath(),r.moveTo(l.left,x(0)),r.lineTo(i-l.right,x(0)),r.stroke(),r.setLineDash([]),r.fillStyle=s.muted,r.font="11px sans-serif",r.textAlign="right";for(let S=0;S<=5;S++){const M=T*(1-S/5);r.fillText(_t(M),l.left-10,l.top+S/5*d+4)}r.textAlign="center";for(let S=0;S<=m;S+=5)r.fillText(`Yr ${S}`,R(S),a-l.bottom+20);cs.set(n.id,{percentiles:b,xScale:R,yScale:x,padding:l,chartWidth:c,chartHeight:d,years:m,maxValue:T,type:"cone"}),dT(n)}function aT(n,e,t={}){const s=Jo(),r=n.getContext("2d"),{width:i,height:a}=n,l={top:45,right:40,bottom:50,left:80},c=i-l.left-l.right,d=a-l.top-l.bottom;r.fillStyle="rgba(0,0,0,0.2)",r.fillRect(0,0,i,a);const f=t.title||"Sample Trajectories (Green=Success, Red=Failed)";r.font="bold 14px system-ui, sans-serif",r.fillStyle=s.text,r.textAlign="center",r.fillText(f,l.left+c/2,22);const m=t.years||35,y=t.startValue||1e6,b=e.slice(0,100),T=b.filter(C=>C.failed),R=b.filter(C=>!C.failed);let x;if(T.length>0)x=y*2;else{const C=R.map(F=>F.final).sort((F,w)=>F-w),O=C[Math.floor(C.length*.5)]||y;x=Math.max(O*1.3,y*1.5)}const S=C=>l.left+C/m*c,M=C=>a-l.bottom-Math.min(C,x)/x*d;r.strokeStyle=s.grid,r.lineWidth=1;for(let C=0;C<=5;C++){const O=l.top+C/5*d;r.beginPath(),r.moveTo(l.left,O),r.lineTo(i-l.right,O),r.stroke()}r.fillStyle=s.muted,r.font="11px sans-serif",r.textAlign="right";for(let C=0;C<=5;C++){const O=x*(1-C/5);r.fillText(_t(O),l.left-10,l.top+C/5*d+4)}r.textAlign="center";for(let C=0;C<=m;C+=5)r.fillText(`Yr ${C}`,S(C),a-l.bottom+20);const D=[];t.glide&&t.glide.length>0&&(r.strokeStyle=s.glidepath,r.lineWidth=3,r.setLineDash([8,4]),r.beginPath(),t.glide.forEach((C,O)=>{const F=S(C.year),w=M(C.min);O===0?r.moveTo(F,w):r.lineTo(F,w)}),r.stroke(),r.setLineDash([])),R.forEach((C,O)=>{const F=C.hist.map(w=>({x:S(w.year),y:M(w.total)}));D.push({run:C,pts:F,failed:!1,idx:O}),r.strokeStyle=s.trajectory,r.lineWidth=.5,r.beginPath(),F.forEach((w,v)=>{v===0?r.moveTo(w.x,w.y):r.lineTo(w.x,w.y)}),r.stroke()}),T.forEach((C,O)=>{const F=C.hist.map(w=>({x:S(w.year),y:M(w.total)}));D.push({run:C,pts:F,failed:!0,idx:R.length+O}),r.strokeStyle=s.trajectoryFailed,r.lineWidth=2,r.beginPath(),F.forEach((w,v)=>{v===0?r.moveTo(w.x,w.y):r.lineTo(w.x,w.y)}),r.stroke()}),r.strokeStyle=s.zeroLine,r.lineWidth=2,r.setLineDash([5,5]),r.beginPath(),r.moveTo(l.left,M(0)),r.lineTo(i-l.right,M(0)),r.stroke(),r.setLineDash([]),cs.set(n.id,{results:b,paths:D,xScale:S,yScale:M,padding:l,chartWidth:c,chartHeight:d,years:m,maxValue:x,glide:t.glide,type:"trajectory"}),hT(n,s)}function lT(n,e,t={}){const s=Jo(),r=n.getContext("2d"),{width:i,height:a}=n,l={top:50,right:20,bottom:55,left:60},c=i-l.left-l.right,d=a-l.top-l.bottom;r.fillStyle="rgba(0,0,0,0.2)",r.fillRect(0,0,i,a);const f=t.title||"Protection Months Distribution";r.font="bold 14px system-ui, sans-serif",r.fillStyle=s.text,r.textAlign="center",r.fillText(f,l.left+c/2,22);const m=e.map(C=>C.protMonths),y=m.length,b=Math.max(...m),T=Math.max(1,Math.ceil(b/15)),R={};m.forEach(C=>{const O=Math.floor(C/T)*T;R[O]=(R[O]||0)+1});const x=Object.keys(R).map(Number).sort((C,O)=>C-O),S=Math.max(...Object.values(R)),M=c/(x.length||1),D=[];r.strokeStyle=s.grid,r.lineWidth=1,r.fillStyle=s.muted,r.font="10px sans-serif",r.textAlign="right";for(let C=0;C<=4;C++){const O=l.top+C/4*d;r.beginPath(),r.moveTo(l.left,O),r.lineTo(i-l.right,O),r.stroke();const F=Math.round(S*(1-C/4));r.fillText(`${F} runs`,l.left-5,O+4)}x.forEach((C,O)=>{const F=R[C],w=F/S*d,v=l.left+O*M+2,_=a-l.bottom-w,E=M-4;r.fillStyle=C===0?s.success:s.warning,r.fillRect(v,_,E,w),D.push({x:v,y:_,w:E,h:w,months:C,monthsEnd:C+T-1,count:F,pct:(F/y*100).toFixed(1)})}),r.fillStyle=s.muted,r.font="10px sans-serif",r.textAlign="center",x.forEach((C,O)=>{if(O%2===0||x.length<12){const F=T>1?`${C}-${C+T-1}`:C.toString();r.fillText(F,l.left+O*M+M/2,a-l.bottom+15)}}),r.fillText("Protection Months",i/2,a-5),r.save(),r.translate(12,a/2),r.rotate(-Math.PI/2),r.textAlign="center",r.fillText("Number of Runs",0,0),r.restore(),cs.set(n.id,{bars:D,totalRuns:y,type:"histogram"}),fT(n)}function cT(n,e,t={}){const s=Jo(),r=n.getContext("2d"),{width:i,height:a}=n,l={top:50,right:180,bottom:60,left:80},c=i-l.left-l.right,d=a-l.top-l.bottom;r.fillStyle=s.bg,r.fillRect(0,0,i,a);const f=Object.keys(e),m=t.years||35;let y=0;f.forEach(x=>{const S=e[x].result;S&&S.hist&&S.hist.forEach(M=>{M.total>y&&(y=M.total)})}),y*=1.1;const b=x=>l.left+x/m*c,T=x=>l.top+d-x/y*d;uT(r,l,c,d,m,y,t.title||"Scenario Comparison",s);const R=["#6366f1","#22c55e","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#ec4899","#84cc16"];f.forEach((x,S)=>{const M=e[x].result;if(!M||!M.hist)return;r.beginPath(),r.strokeStyle=R[S%R.length],r.lineWidth=2.5,M.hist.forEach((C,O)=>{const F=b(C.year),w=T(C.total);O===0?r.moveTo(F,w):r.lineTo(F,w)}),r.stroke();const D=l.top+15+S*24;r.fillStyle=R[S%R.length],r.fillRect(i-l.right+15,D,20,4),r.font="11px system-ui, sans-serif",r.fillStyle=s.text,r.textAlign="left",r.fillText(e[x].name||x,i-l.right+40,D+5),M.final/1e3,r.fillStyle=s.muted,r.fillText(`${_t(M.final)}`,i-l.right+40,D+18)})}function uT(n,e,t,s,r,i,a,l){n.font="bold 14px system-ui, sans-serif",n.fillStyle=l.text,n.textAlign="center",n.fillText(a,e.left+t/2,e.top-20),n.strokeStyle=l.grid,n.lineWidth=1;for(let c=0;c<=5;c++){const d=e.top+s*c/5;n.beginPath(),n.moveTo(e.left,d),n.lineTo(e.left+t,d),n.stroke();const f=i*(5-c)/5;n.font="11px system-ui, sans-serif",n.fillStyle=l.muted,n.textAlign="right",n.fillText(_t(f),e.left-10,d+4)}for(let c=0;c<=r;c+=5){const d=e.left+c/r*t;n.beginPath(),n.moveTo(d,e.top),n.lineTo(d,e.top+s),n.stroke(),n.textAlign="center",n.fillText(`Y${c}`,d,e.top+s+20)}n.font="12px system-ui, sans-serif",n.textAlign="center",n.fillText("Years",e.left+t/2,e.top+s+45),n.save(),n.translate(20,e.top+s/2),n.rotate(-Math.PI/2),n.fillText("Fund Value",0,0),n.restore()}function _t(n){return n>=1e6?`£${(n/1e6).toFixed(1)}M`:n>=1e3?`£${(n/1e3).toFixed(0)}k`:`£${n.toFixed(0)}`}function dT(n,e){const t=n._coneHoverListener;t&&n.removeEventListener("mousemove",t);const s=r=>{const i=cs.get(n.id);if(!i||i.type!=="cone")return;const a=n.getBoundingClientRect(),l=n.width/a.width,c=(r.clientX-a.left)*l,{percentiles:d,padding:f,chartWidth:m,years:y}=i,b=(c-f.left)/m*y,T=Math.round(b);if(T<0||T>y){Ln();return}const R=d.find(S=>S.year===T);if(!R){Ln();return}const x=`
      <div style="border-bottom:1px solid #555;padding-bottom:6px;margin-bottom:6px;">
        <strong style="color:#f0c674;">Year ${T}</strong>
      </div>
      <div style="display:grid;grid-template-columns:auto auto;gap:4px 16px;">
        <span style="color:#8b8b9b;">95th percentile:</span><span>${_t(R.p95)}</span>
        <span style="color:#8b8b9b;">75th percentile:</span><span>${_t(R.p75)}</span>
        <span style="color:#8b8b9b;">Median (50th):</span><span style="color:#f0c674;font-weight:bold;">${_t(R.p50)}</span>
        <span style="color:#8b8b9b;">25th percentile:</span><span>${_t(R.p25)}</span>
        <span style="color:#8b8b9b;">10th percentile:</span><span style="color:#f85149;">${_t(R.p10)}</span>
        <span style="color:#8b8b9b;">5th percentile:</span><span>${_t(R.p5)}</span>
      </div>
    `;mc(r.clientX,r.clientY,x)};n._coneHoverListener=s,n.addEventListener("mousemove",s),n.addEventListener("mouseleave",Ln)}function hT(n,e){const t=n._trajHoverListener;t&&n.removeEventListener("mousemove",t);const s=n._trajLeaveListener;s&&n.removeEventListener("mouseleave",s);const r=a=>{const l=cs.get(n.id);if(!l||l.type!=="trajectory")return;const c=n.getBoundingClientRect(),d=n.width/c.width,f=n.height/c.height,m=(a.clientX-c.left)*d,y=(a.clientY-c.top)*f,{paths:b,padding:T,chartWidth:R,chartHeight:x}=l;if(m<T.left||m>T.left+R||y<T.top||y>T.top+x){Ln(),Rs!==-1&&(Rs=-1,Da(n,l,e,null));return}let S=null,M=12*d;b.filter(C=>C.failed).forEach(C=>{for(let O=0;O<C.pts.length-1;O++){const F=xd(m,y,C.pts[O].x,C.pts[O].y,C.pts[O+1].x,C.pts[O+1].y);F<M&&(M=F,S=C)}}),S||b.filter(C=>!C.failed).forEach(C=>{for(let O=0;O<C.pts.length-1;O++){const F=xd(m,y,C.pts[O].x,C.pts[O].y,C.pts[O+1].x,C.pts[O+1].y);F<M&&(M=F,S=C)}});const D=S?S.idx:-1;if(D!==Rs&&(Rs=D,Da(n,l,e,S)),S){const C=S.run,O=S.failed?"#f85149":"#2ea043",F=S.failed?"❌":"✅",w=S.failed?"FAILED":"SUCCESS";let v=`
        <div style="border-bottom:1px solid #555;padding-bottom:6px;margin-bottom:6px;">
          <strong style="color:${O};">${F} ${w}</strong>
          <span style="float:right;color:#8b8b9b;font-size:11px;">Run #${S.idx+1}</span>
        </div>
        <div style="display:grid;grid-template-columns:auto auto;gap:4px 16px;">
      `;C.startYear&&(v+=`<span style="color:#8b8b9b;">Start year:</span><span>${C.startYear}</span>`),v+=`<span style="color:#8b8b9b;">Duration:</span><span>${C.years.toFixed(1)} years</span>`,v+=`<span style="color:#8b8b9b;">Final balance:</span><span>${_t(C.final)}</span>`,v+=`<span style="color:#8b8b9b;">Protection months:</span><span>${C.protMonths}</span>`,v+=`<span style="color:#8b8b9b;">Longest streak:</span><span>${C.maxConsec} months</span>`,C.hodlUsed>0&&(v+=`<span style="color:#8b8b9b;">HODL used:</span><span>${_t(C.hodlUsed)}</span>`),v+="</div>",S.failed&&C.failMonth&&(v+=`<div style="margin-top:8px;padding-top:8px;border-top:1px solid #555;color:#f0c674;">💀 Depleted at year ${(C.failMonth/12).toFixed(1)}</div>`),mc(a.clientX,a.clientY,v)}else Ln()},i=()=>{if(Ln(),Rs!==-1){Rs=-1;const a=cs.get(n.id);a&&Da(n,a,e,null)}};n._trajHoverListener=r,n._trajLeaveListener=i,n.addEventListener("mousemove",r),n.addEventListener("mouseleave",i)}function fT(n,e){const t=n._histHoverListener;t&&n.removeEventListener("mousemove",t);const s=r=>{const i=cs.get(n.id);if(!i||i.type!=="histogram")return;const a=n.getBoundingClientRect(),l=n.width/a.width,c=n.height/a.height,d=(r.clientX-a.left)*l,f=(r.clientY-a.top)*c,{bars:m,totalRuns:y}=i;let b=null;if(m.forEach(T=>{d>=T.x&&d<=T.x+T.w&&f>=T.y&&f<=T.y+T.h&&(b=T)}),b){const T=b.months===0,R=T?"#2ea043":"#e1b12c",x=T?"🟢":"🟡",S=T?"No Protection":`${b.months}${b.monthsEnd>b.months?`-${b.monthsEnd}`:""} months`,M=`
        <div style="border-bottom:1px solid #555;padding-bottom:6px;margin-bottom:6px;">
          <strong style="color:${R};">${x} ${S}</strong>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 12px;">
          <span style="color:#8b8b9b;">Runs:</span><span>${b.count} of ${y}</span>
          <span style="color:#8b8b9b;">Percentage:</span><span>${b.pct}%</span>
        </div>
      `;mc(r.clientX,r.clientY,M)}else Ln()};n._histHoverListener=s,n.addEventListener("mousemove",s),n.addEventListener("mouseleave",Ln)}function Da(n,e,t,s){const r=n.getContext("2d"),{width:i,height:a}=n,{paths:l,xScale:c,yScale:d,padding:f,chartWidth:m,chartHeight:y,years:b,maxValue:T,glide:R}=e;r.fillStyle="rgba(15,15,26,1)",r.fillRect(f.left,f.top,m,y),r.strokeStyle=t.grid,r.lineWidth=1;for(let x=0;x<=5;x++){const S=f.top+x/5*y;r.beginPath(),r.moveTo(f.left,S),r.lineTo(i-f.right,S),r.stroke()}R&&R.length>0&&(r.strokeStyle=t.glidepath,r.lineWidth=1.5,r.setLineDash([4,2]),r.beginPath(),R.forEach((x,S)=>{const M=c(x.year),D=d(x.min);S===0?r.moveTo(M,D):r.lineTo(M,D)}),r.stroke(),r.setLineDash([])),l.forEach(x=>{if(s&&x.idx===s.idx)return;const S=s?.15:x.failed?.8:.25;r.strokeStyle=x.failed?`rgba(248,81,73,${S})`:`rgba(46,160,67,${S})`,r.lineWidth=x.failed?2:.5,r.beginPath(),x.pts.forEach((M,D)=>{D===0?r.moveTo(M.x,M.y):r.lineTo(M.x,M.y)}),r.stroke()}),s&&(r.strokeStyle=s.failed?t.trajectoryFailedHover:t.trajectoryHover,r.lineWidth=4,r.shadowColor=s.failed?t.trajectoryFailedHover:t.trajectoryHover,r.shadowBlur=8,r.beginPath(),s.pts.forEach((x,S)=>{S===0?r.moveTo(x.x,x.y):r.lineTo(x.x,x.y)}),r.stroke(),r.shadowBlur=0),r.strokeStyle=t.zeroLine,r.lineWidth=2,r.setLineDash([5,5]),r.beginPath(),r.moveTo(f.left,d(0)),r.lineTo(i-f.right,d(0)),r.stroke(),r.setLineDash([])}function mc(n,e,t){let s=document.getElementById("chartTooltip");s||(s=document.createElement("div"),s.id="chartTooltip",document.body.appendChild(s)),s.innerHTML=t,s.style.display="block",s.style.left=n+15+"px",s.style.top=e-10+"px"}function Ln(){const n=document.getElementById("chartTooltip");n&&(n.style.display="none")}function pT(){return`
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
  `}window._simEngine={runMonteCarlo:op,runHistorical:ap,simulate:Ho};window._constants={EQUITY_RETURNS:Br,INFLATION:ll};window._mathUtils={seededRng:ul};let _p=null,wp=null;function bp(){_p=null,wp=null;const n=document.getElementById("mcResults"),e=document.getElementById("histResults");n&&(n.innerHTML=""),e&&(e.innerHTML="");const t=document.getElementById("optimiseResultsMC"),s=document.getElementById("optimiseResultsHist");t&&(t.innerHTML=""),s&&(s.innerHTML="")}function Ep(){document.querySelectorAll(".sub-tab[data-stresstab]").forEach(t=>t.classList.remove("active"));const n=document.querySelector('.sub-tab[data-stresstab="montecarlo"]');n&&n.classList.add("active"),document.querySelectorAll(".stress-subtab").forEach(t=>t.classList.add("hidden"));const e=document.getElementById("stress-montecarlo");e&&e.classList.remove("hidden")}function Tp(){document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(t=>t.classList.remove("active"));const n=document.querySelector('.sub-tab[data-decisiontab="entry"]');n&&n.classList.add("active"),document.querySelectorAll(".decision-subtab").forEach(t=>t.classList.add("hidden"));const e=document.getElementById("decision-entry");e&&e.classList.remove("hidden")}const Ip=document.createElement("style");Ip.textContent=hE()+VE()+WE()+KE()+iT()+PE()+pT();document.head.appendChild(Ip);const gc=document.getElementById("globalLoadingOverlay"),mT=gc.querySelector(".loading-text");function Ct(n="Loading..."){mT.textContent=n,gc.classList.add("active")}function kt(){gc.classList.remove("active")}window.showToast=function(e,t="info",s=3e3){const r=document.querySelector(".toast-notification");r&&r.remove();const i=document.createElement("div");i.className=`toast-notification ${t}`,i.innerHTML=`
        <span class="toast-icon">${t==="success"?"✓":t==="error"?"!":"ℹ"}</span>
        <span class="toast-message">${e}</span>
      `,document.body.appendChild(i),requestAnimationFrame(()=>i.classList.add("show")),setTimeout(()=>{i.classList.remove("show"),setTimeout(()=>i.remove(),300)},s)};document.getElementById("versionDisplay").textContent=`v${Pd}`;document.getElementById("entryMonth").value=nm();function go(n){const e=document.getElementById(n+"SpWeeklyAmount"),t=document.getElementById(n+"SpAnnualAmount");if(!e||!t)return;const s=parseFloat(e.value)||0,r=s*52;s>0?t.value="£"+r.toLocaleString("en-GB",{maximumFractionDigits:2}):t.value=""}["ds","ss"].forEach(n=>{const e=document.getElementById(n+"SpWeeklyAmount");e&&e.addEventListener("input",()=>go(n))});function gT(n){const e=parseFloat(n);return isNaN(e)?"":e.toString().replace(/\B(?=(\d{3})+(?!\d))/g," ")}function Sp(){document.querySelectorAll('input[type="number"]').forEach(e=>{e.value,e.addEventListener("focus",function(t){setTimeout(()=>{this.select()},0)}),e.addEventListener("click",function(t){!t.shiftKey&&!t.ctrlKey&&!t.metaKey&&this.select()})})}function xp(){document.querySelectorAll('input[type="number"]').forEach(e=>{if(e.dataset.formatted)return;e.dataset.formatted="true";const t=e.closest(".input-with-unit")||e.parentElement,s=e.closest(".input-with-unit")!==null,r=document.createElement("span");r.className="number-format-overlay";const i=s?"34px":"14px";r.style.cssText=`
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
        `,getComputedStyle(t).position==="static"&&(t.style.position="relative");function a(){const l=parseFloat(e.value);!isNaN(l)&&l>=1e3&&document.activeElement!==e?(r.textContent=gT(l),r.style.display="block",e.style.color="transparent"):(r.style.display="none",e.style.color="")}e._updateOverlay=a,e.addEventListener("focus",()=>{r.style.display="none",e.style.color=""}),e.addEventListener("blur",a),e.addEventListener("input",()=>{document.activeElement===e&&(r.style.display="none",e.style.color="")}),t.appendChild(r),a()})}function Xo(){document.querySelectorAll('input[type="number"]').forEach(n=>{n._updateOverlay&&n._updateOverlay()})}setTimeout(()=>{Sp(),xp()},100);const yT=new MutationObserver(n=>{let e=!1;n.forEach(t=>{t.addedNodes.forEach(s=>{var r,i;s.nodeType===1&&((r=s.matches)!=null&&r.call(s,'input[type="number"]')||(i=s.querySelector)!=null&&i.call(s,'input[type="number"]'))&&(e=!0)})}),e&&setTimeout(()=>{Sp(),xp()},50)});yT.observe(document.body,{childList:!0,subtree:!0});let Ds=null;async function yc(n,e=null){Qr(),mp(),Ko(),Qo(),document.getElementById("mainApp").classList.remove("hidden"),document.getElementById("userEmail").textContent=n.email,await zs();const t=await tp();vc(t),await $t(),await us(),rl(),Ep(),Tp(),bp();const s=e||(t.includes("decision")?"decision":"stress");document.querySelectorAll(".tab").forEach(a=>a.classList.remove("active"));const r=document.querySelector(`.tab[data-tab="${s}"]`);r&&r.classList.add("active"),document.querySelectorAll(".tab-content").forEach(a=>a.classList.remove("active"));const i=document.getElementById(`${s}-content`);i&&i.classList.add("active")}function vc(n){const e={decision:["decision"],stress:["stress"]};document.querySelectorAll(".tab").forEach(s=>{const r=s.dataset.tab;let i=!1;for(const[a,l]of Object.entries(e))if(l.includes(r)){i=n.includes(a);break}Object.values(e).flat().includes(r)||(i=!0),s.style.display=i?"":"none"})}async function rl(){try{const n=await jt(),e=await pn();document.getElementById("entryEquity").value=e.equityMin||25e4,document.getElementById("entryBond").value=e.bondMin||2e5,document.getElementById("entryCash").value=e.cashTarget||5e4,document.getElementById("entryIsa").value=e.isaBalance||0,document.getElementById("dsEquityMin").value=e.equityMin||25e4,document.getElementById("dsBondMin").value=e.bondMin||2e5,document.getElementById("dsCashTarget").value=e.cashTarget||5e4,document.getElementById("dsDuration").value=e.duration||35,document.getElementById("dsBaseSalary").value=e.baseSalary||3e4,document.getElementById("dsSpStartDate").value=e.spStartDate||"",document.getElementById("dsSpWeeklyAmount").value=e.spWeeklyAmount||"",go("ds"),document.getElementById("dsProtectionFactor").value=e.protectionFactor||20,document.getElementById("dsRecoveryBuffer").value=e.recoveryBuffer||1e4,document.getElementById("dsConsecutiveLimit").value=e.consecutiveLimit||3,["mc","hist","scen"].forEach(s=>{const r=document.getElementById(s+"Equity"),i=document.getElementById(s+"Bond"),a=document.getElementById(s+"Cash"),l=document.getElementById(s+"Years");r&&(r.value=n.equityMin),i&&(i.value=n.bondMin),a&&(a.value=n.cashTarget),l&&(l.value=n.duration)}),document.getElementById("ssBaseSalary").value=n.baseSalary,document.getElementById("ssEquityMin").value=n.equityMin,document.getElementById("ssBondMin").value=n.bondMin,document.getElementById("ssCashTarget").value=n.cashTarget,document.getElementById("ssDuration").value=n.duration,document.getElementById("ssPA").value=n.pa,document.getElementById("ssBRL").value=n.brl,document.getElementById("ssHRL").value=n.hrl,document.getElementById("ssTaxMode").value=n.taxMode||"inflates",document.getElementById("ssOther").value=n.other||0,document.getElementById("ssSpStartDate").value=n.spStartDate||"",document.getElementById("ssSpWeeklyAmount").value=n.spWeeklyAmount||"",go("ss"),document.getElementById("ssConsecutiveLimit").value=n.consecutiveLimit||3,document.getElementById("ssProtectionMult").value=n.protectionMult||.8,document.getElementById("ssDisableProtection").checked=n.disableProtection||!1,document.getElementById("ssHodlEnabled").checked=n.hodlEnabled||!1,document.getElementById("ssHodlValue").value=n.hodlValue||25e3,document.getElementById("ssIsaBalance").value=n.isaBalance||0;const t=document.getElementById("ssSeedNote");t&&(t.textContent=n.seededFrom==="decision"&&n.seededAt?"Seeded from Decision Tool "+new Date(n.seededAt).toLocaleDateString():""),Xo(),console.log("All inputs initialized from stored settings")}catch(n){console.error("Error initializing inputs from settings:",n)}}async function Ap(n){console.log("Wizard completed with data:",n);try{const s={baseSalary:n.baseSalary,other:n.otherIncome,spStartDate:n.spStartDate,spWeeklyAmount:n.spWeeklyAmount,equityMin:n.equityMin,bondMin:n.bondMin,cashTarget:n.cashTarget,duration:n.duration,taxMode:n.taxMode},r={baseSalary:n.decisionSalary,equityMin:n.decisionEquity,bondMin:n.decisionBond,cashTarget:n.decisionCash,duration:n.decisionDuration,spStartDate:n.spStartDate,spWeeklyAmount:n.spWeeklyAmount};await kb(n.scenarioName||"My Plan",n.scenarioDescription||"",n.enabledTools||["stress","decision"],{stressSettings:s,decisionSettings:r},!0),ls(),Fn()}catch(s){console.error("Error creating scenario from wizard:",s)}const e=fs(),t=n.enabledTools.includes("stress")?"stress":"decision";yc(e,t)}function il(n){Qr(),mp();const e=n.displayName||n.email.split("@")[0];document.getElementById("onboardingPage").style.display="block",YE(document.getElementById("onboardingPage"),e,()=>{Ko(),document.getElementById("setupWizard").style.display="block",yp(document.getElementById("setupWizard"),Ap)})}BE(document.getElementById("authScreen"),async n=>{console.log("Auth success callback triggered for:",n.email);try{console.log("Checking for existing cloud data...");const e=await Rb();console.log("Has cloud data:",e),e?(console.log("Existing user - showing main app"),Qr(),yc(n)):(console.log("New user - showing onboarding page"),il(n))}catch(e){console.error("Error in auth callback:",e),il(n)}});LE(document.getElementById("landingPage"),{onGetStarted:()=>{Qr(),po("signup")},onSignIn:()=>{Qr(),po("signin")}});document.getElementById("logoutBtn").addEventListener("click",async()=>{try{ls(),Fn(),fn(),await Yf(),document.getElementById("mainApp").classList.add("hidden"),Ko(),Qo(),po("signin")}catch(n){console.error("Logout error:",n)}});async function zs(){var r;const n=await ac(),e=n.find(i=>i.isActive),t=document.getElementById("scenarioActiveName");t&&(t.textContent=e&&(((r=e.planDetails)==null?void 0:r.name)||e.name)||"No Plan");const s=document.getElementById("scenarioList");if(s){if(n.length===0){s.innerHTML='<div class="scenario-dropdown-item" style="color:var(--text-muted);cursor:default;">No plans yet</div>';return}s.innerHTML=n.map(i=>{var c,d;const a=((c=i.planDetails)==null?void 0:c.name)||i.name||"Unnamed Plan",l=((d=i.planDetails)==null?void 0:d.description)||i.description||"";return`
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
      `}).join(""),s.querySelectorAll(".scenario-dropdown-item").forEach(i=>{i.addEventListener("click",async a=>{if(a.target.closest(".scenario-item-actions"))return;const l=i.dataset.scenarioId;if(!l)return;const c=n.find(d=>d.isActive);if(c&&c.id===l){document.getElementById("scenarioDropdown").classList.remove("open");return}try{await Mb(l),ls(),Fn(),document.getElementById("scenarioDropdown").classList.remove("open"),bp(),Ep(),Tp();const d=await tp();vc(d);const f=document.querySelector(".tab.active");if(f&&f.style.display==="none"){const m=document.querySelector('.tab:not([style*="display: none"])');if(m){document.querySelectorAll(".tab").forEach(T=>T.classList.remove("active")),m.classList.add("active"),document.querySelectorAll(".tab-content").forEach(T=>T.classList.remove("active"));const y=m.dataset.tab+"-content",b=document.getElementById(y);b&&b.classList.add("active")}}await $t(),await us(),await rl(),await zs()}catch(d){console.error("Error switching scenario:",d),showToast("Failed to switch plan: "+d.message,"error")}})}),s.querySelectorAll(".scenario-rename-btn").forEach(i=>{i.addEventListener("click",async a=>{a.stopPropagation();const l=i.dataset.id,c=i.dataset.name,d=prompt("Rename plan:",c);if(d&&d.trim()&&d.trim()!==c)try{await Nb(l,d.trim()),await zs()}catch(f){console.error("Error renaming scenario:",f),showToast("Failed to rename plan: "+f.message,"error")}})}),s.querySelectorAll(".scenario-tools-btn").forEach(i=>{i.addEventListener("click",async a=>{a.stopPropagation();const l=i.dataset.id,c=(i.dataset.tools||"stress,decision").split(",");document.getElementById("scenarioDropdown").classList.remove("open"),vT(l,c)})}),s.querySelectorAll(".scenario-delete-btn").forEach(i=>{i.addEventListener("click",async a=>{a.stopPropagation();const l=i.dataset.id,c=i.dataset.name;if(confirm(`Delete plan "${c}"? This cannot be undone.`))try{await Ob(l),ls(),Fn(),await $t(),await us(),await rl(),await zs()}catch(d){console.error("Error deleting scenario:",d),showToast("Failed to delete plan: "+d.message,"error")}})})}}document.getElementById("scenarioActiveBtn").addEventListener("click",n=>{n.stopPropagation(),document.getElementById("scenarioDropdown").classList.toggle("open")});document.addEventListener("click",n=>{const e=document.getElementById("scenarioSelector");e&&!e.contains(n.target)&&document.getElementById("scenarioDropdown").classList.remove("open")});document.getElementById("scenarioNewBtn").addEventListener("click",async()=>{document.getElementById("scenarioDropdown").classList.remove("open"),document.getElementById("mainApp").classList.add("hidden"),document.getElementById("setupWizard").style.display="block",yp(document.getElementById("setupWizard"),Ap)});document.getElementById("scenarioDuplicateBtn").addEventListener("click",async()=>{var s;document.getElementById("scenarioDropdown").classList.remove("open");const n=await Mt();if(!n){showToast("No active plan to duplicate.","error");return}const e=((s=n.planDetails)==null?void 0:s.name)||n.name||"My Plan",t=prompt("Name for the copy:",e+" (copy)");if(!(!t||!t.trim()))try{await Db(n.id,t.trim()),await zs()}catch(r){console.error("Error duplicating scenario:",r),showToast("Failed to duplicate plan: "+r.message,"error")}});function vT(n,e){const t=document.getElementById("editToolsModal");t&&t.remove();const s=e.includes("stress"),r=e.includes("decision"),i=document.createElement("div");i.id="editToolsModal",i.className="edit-tools-overlay",i.innerHTML=`
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
      `,document.body.appendChild(i),document.getElementById("editToolsCancel").addEventListener("click",()=>i.remove()),i.addEventListener("click",a=>{a.target===i&&i.remove()}),document.getElementById("editToolsSave").addEventListener("click",async()=>{const a=[];if(document.getElementById("editToolStress").checked&&a.push("stress"),document.getElementById("editToolDecision").checked&&a.push("decision"),a.length===0){showToast("Please select at least one tool","error");return}const l=a.filter(c=>!e.includes(c));try{await Lb(n,a);const c=await Mt();if(c&&c.id===n){vc(a);const d=document.querySelector(".tab.active");if(d&&d.style.display==="none"){const f=document.querySelector('.tab:not([style*="display: none"])');if(f){document.querySelectorAll(".tab").forEach(b=>b.classList.remove("active")),f.classList.add("active"),document.querySelectorAll(".tab-content").forEach(b=>b.classList.remove("active"));const m=f.dataset.tab+"-content",y=document.getElementById(m);y&&y.classList.add("active")}}}if(await zs(),i.remove(),l.length>0){let d=null;try{if(l.includes("stress")&&e.includes("decision")){const y=await pn();y&&(d={source:"decision",...y})}else if(l.includes("decision")&&e.includes("stress")){const y=await jt();y&&(d={source:"stress",...y})}}catch(y){console.warn("Could not load existing settings for pre-fill:",y)}const f=document.getElementById("setupWizard");f.style.display="block",document.getElementById("mainApp").style.display="none",rT(f,l,async y=>{Qo();try{l.includes("stress")&&(await Wo({equityMin:y.equityMin,bondMin:y.bondMin,cashTarget:y.cashTarget,duration:y.duration,baseSalary:y.baseSalary,other:y.otherIncome||0,taxMode:y.taxMode||"inflates"}),Fn()),l.includes("decision")&&(await lc({equityMin:y.decisionEquity,bondMin:y.decisionBond,cashTarget:y.decisionCash,duration:y.decisionDuration,baseSalary:y.decisionSalary,spStartDate:y.spStartDate||null,spWeeklyAmount:y.spWeeklyAmount||0}),ls())}catch(b){console.error("Error saving new tool settings:",b)}await yc(),showToast("New tool configured successfully","success")},d)}else showToast("Tools updated","success")}catch(c){console.error("Error updating scenario tools:",c),showToast("Failed to update tools: "+c.message,"error")}})}const _T=60*60*1e3;let Na=null;function Rp(){Na&&clearTimeout(Na),ht()&&(Na=setTimeout(async()=>{if(ht()){showToast("You have been logged out due to inactivity (1 hour).","info",5e3);try{ls(),Fn(),fn(),await Yf(),document.getElementById("mainApp").classList.add("hidden"),Ko(),Qo(),po("signin")}catch(n){console.error("Auto-logout error:",n)}}},_T))}const wT=["mousedown","mousemove","keydown","scroll","touchstart","click"];wT.forEach(n=>{document.addEventListener(n,()=>{Rp()},{passive:!0})});Rp();document.getElementById("resetBtn").addEventListener("click",async()=>{if(!(!confirm(`⚠️ WARNING: This will permanently delete ALL your data including:

• All saved settings
• All decision history
• All tax year configurations

This action cannot be undone.

Are you sure you want to reset and start over?`)||!confirm(`Are you ABSOLUTELY sure?

Type OK to confirm deletion of all your data.`)))try{console.log("Wiping all user data..."),await Ab(),console.log("Data wiped successfully"),ls(),Fn(),fn(),localStorage.clear(),document.getElementById("mainApp").classList.add("hidden");const t=fs();il(t),showToast("All data has been deleted. Set up a new plan to start fresh.","success",4e3)}catch(t){console.error("Reset error:",t),showToast("Error resetting data: "+t.message,"error")}});document.querySelectorAll(".tab").forEach(n=>{n.addEventListener("click",async()=>{if(n.dataset.tab!=="stress"){bT();const e=document.getElementById("optimiseResultsMC"),t=document.getElementById("optimiseResultsHist");e&&(e.innerHTML=""),t&&(t.innerHTML="")}document.querySelectorAll(".tab").forEach(e=>e.classList.remove("active")),n.classList.add("active"),document.querySelectorAll(".tab-content").forEach(e=>e.classList.remove("active")),document.getElementById(`${n.dataset.tab}-content`).classList.add("active"),n.dataset.tab==="stress"&&await Zo()})});const Tr=document.querySelector(".tabs"),Ad=document.querySelector(".tabs-wrapper");if(Tr&&Ad){const n=()=>{const e=Tr.scrollLeft+Tr.clientWidth>=Tr.scrollWidth-10;Ad.classList.toggle("scrolled-end",e)};Tr.addEventListener("scroll",n),n()}document.querySelectorAll(".sub-tab[data-stresstab]").forEach(n=>{n.addEventListener("click",async()=>{document.querySelectorAll(".sub-tab[data-stresstab]").forEach(e=>e.classList.remove("active")),n.classList.add("active"),document.querySelectorAll(".stress-subtab").forEach(e=>e.classList.add("hidden")),document.getElementById(`stress-${n.dataset.stresstab}`).classList.remove("hidden"),n.dataset.stresstab==="stresssettings"&&await Zo()})});document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(n=>{n.addEventListener("click",async()=>{document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(e=>e.classList.remove("active")),n.classList.add("active"),document.querySelectorAll(".decision-subtab").forEach(e=>e.classList.add("hidden")),document.getElementById(`decision-${n.dataset.decisiontab}`).classList.remove("hidden"),n.dataset.decisiontab==="decisionsettings"&&await Cp(),n.dataset.decisiontab==="history"&&await $t(),n.dataset.decisiontab==="taxyears"&&await us()})});async function Rd(n,e,t,s){var r;return NE(n,e,t,s,{settings:await pn(),history:await sr(),allTaxYears:await qn(),spInfo:await uc(fp(n)),isaBalance:parseFloat((r=document.getElementById("entryIsa"))==null?void 0:r.value)||0})}window.handleDecisionSubmit=async function(n){n.preventDefault();const e=document.getElementById("entryMonth").value,t=parseFloat(document.getElementById("entryEquity").value)||0,s=parseFloat(document.getElementById("entryBond").value)||0,r=parseFloat(document.getElementById("entryCash").value)||0,i=[];if(e||i.push("Month"),!t&&t!==0&&i.push("Equity Fund"),!s&&s!==0&&i.push("Bond Balance"),!r&&r!==0&&i.push("Cash Balance"),i.length>0){showToast("Missing: "+i.join(", "),"error",4e3);return}if((await sr({limit:1e3})).find(c=>c.date===e)){showToast(`${Js(e)} already has a saved decision. Delete it from the History tab first to recalculate.`,"error",5e3);return}try{if((await wE(e)).showWizard){const f=document.getElementById("taxYearWizard");f.style.display="block",window._pendingDecisionForm={dateStr:e,equity:t,bond:s,cash:r},_E(f,e,async m=>{if(f.style.display="none",m&&m.completed)try{Ds=await Rd(e,t,s,r);const y=document.getElementById("decisionOutput");_d(Ds,y),document.getElementById("saveBtn").disabled=!1}catch(y){console.error("Decision error after wizard:",y),showToast("Error: "+y.message,"error")}});return}Ds=await Rd(e,t,s,r);const d=document.getElementById("decisionOutput");_d(Ds,d),document.getElementById("saveBtn").disabled=!1}catch(c){console.error("Decision error:",c),showToast("Error: "+c.message,"error")}};window.saveCurrentDecision=async function(){const n=document.getElementById("saveBtn");if(!Ds){showToast("No decision to save","error");return}if(!ht()){showToast("Please sign in to save decisions","error");return}n.classList.add("loading"),n.disabled=!0;try{await Gb(Ds),showToast("Decision saved to history","success"),await $t()}catch(e){console.error("Save error:",e),showToast("Error saving: "+e.message,"error"),n.disabled=!1}finally{n.classList.remove("loading")}};window.runMonteCarloUI=async function(){const n={equityStart:parseFloat(document.getElementById("mcEquity").value)||25e4,bondStart:parseFloat(document.getElementById("mcBond").value)||2e5,cashStart:parseFloat(document.getElementById("mcCash").value)||5e4,years:parseInt(document.getElementById("mcYears").value)||35},e=document.getElementById("optimiseResultsMC");e&&(e.innerHTML=""),document.getElementById("mcResults").innerHTML='<div class="loading"><div class="spinner"></div>Running simulation...</div>',await jt(),setTimeout(()=>{try{const{results:t,stats:s}=CE(n);_p=t,Pp(s,t,"Monte Carlo (1000 runs)","mcResults",n.years)}catch(t){console.error("Simulation error:",t),document.getElementById("mcResults").innerHTML=`<div class="alert alert-danger">Error: ${t.message}</div>`}},50)};window.runHistoricalUI=async function(){const n={equityStart:parseFloat(document.getElementById("histEquity").value)||25e4,bondStart:parseFloat(document.getElementById("histBond").value)||2e5,cashStart:parseFloat(document.getElementById("histCash").value)||5e4,years:parseInt(document.getElementById("histYears").value)||35},e=document.getElementById("optimiseResultsHist");e&&(e.innerHTML=""),document.getElementById("histResults").innerHTML='<div class="loading"><div class="spinner"></div>Running simulation...</div>',await jt(),setTimeout(()=>{try{const{results:t,stats:s}=kE(n);wp=t,Pp(s,t,"Historical Analysis","histResults",n.years)}catch(t){console.error("Simulation error:",t),document.getElementById("histResults").innerHTML=`<div class="alert alert-danger">Error: ${t.message}</div>`}},50)};window.runScenariosUI=async function(){const n={equityStart:parseFloat(document.getElementById("scenEquity").value)||25e4,bondStart:parseFloat(document.getElementById("scenBond").value)||2e5,cashStart:parseFloat(document.getElementById("scenCash").value)||5e4,years:35};document.getElementById("scenResults").innerHTML='<div class="loading"><div class="spinner"></div>Running scenarios...</div>',await jt(),setTimeout(()=>{try{const e=ME(n);IT(e,"scenResults")}catch(e){console.error("Scenario error:",e),document.getElementById("scenResults").innerHTML=`<div class="alert alert-danger">Error: ${e.message}</div>`}},50)};let wn=!1,Cr=0;function bT(){Cr++}window.runOptimisationUI=async function(n){if(wn)return;wn=!0;const e=++Cr,t=document.getElementById("optimiseBtn"+n),s=document.getElementById("optimiseResults"+n);t&&(t.disabled=!0),t&&(t.textContent="Optimising...");let r,i,a,l;n==="MC"?(r=document.getElementById("mcEquity"),i=document.getElementById("mcBond"),a=document.getElementById("mcCash"),l=document.getElementById("mcYears")):(r=document.getElementById("histEquity"),i=document.getElementById("histBond"),a=document.getElementById("histCash"),l=document.getElementById("histYears"));const c=+r.value,d=+i.value,f=+a.value,m=+l.value,y=c+d+f;s.innerHTML='<div class="loading"><div class="spinner"></div>Preparing optimisation...</div>';const b=await jt(),T=JSON.parse(JSON.stringify(b));if(e!==Cr){wn=!1,t&&(t.disabled=!1,t.textContent="Optimise Allocation");return}const R=[];for(let g=5;g<=30;g+=5)for(let Y=20;Y<=95-g;Y+=5){const Z=100-g-Y;Z>=0&&R.push({equity:Math.round(y*Y/100),bond:Math.round(y*Z/100),cash:Math.round(y*g/100)})}const{EQUITY_RETURNS:x,INFLATION:S}=window._constants,{simulate:M}=window._simEngine,{seededRng:D}=window._mathUtils,C=Object.keys(x).map(Number).sort((g,Y)=>g-Y),O=Math.max(...C),F=g=>{const Y=Yo({equityStart:g.equity,bondStart:g.bond,cashStart:g.cash,years:m},T),Z=[];if(n==="MC")for(let J=0;J<1e3;J++){const xe=D(J*12345),ne={equity:{},inflation:{}};for(let Ye=0;Ye<m;Ye++){const it=C[Math.floor(xe()*C.length)];ne.equity[Ye]=x[it],ne.inflation[Ye]=S[it]||.025}Z.push(M(Y,ne,J))}else C.forEach(J=>{if(J+m-1>O)return;const xe={equity:{},inflation:{}};for(let ne=0;ne<m;ne++)xe.equity[ne]=x[J+ne]||0,xe.inflation[ne]=S[J+ne]||.025;Z.push(M(Y,xe,J))});const ee=Z.filter(J=>J.failed),_e=Z.filter(J=>!J.failed),pe=(Z.length-ee.length)/Z.length*100,Se=Z.map(J=>J.protMonths).reduce((J,xe)=>J+xe,0)/Z.length,ft=Z.filter(J=>J.protMonths>0).length,re=_e.map(J=>J.final).sort((J,xe)=>J-xe),Q=re.length>0?re[Math.floor(re.length*.5)]:0,It=re.length>0?re[Math.floor(re.length*.9)]:0;return{equity:g.equity,bond:g.bond,cash:g.cash,rate:pe,avgProt:Se,withProt:ft,totalRuns:Z.length,medianFinal:Q,p90Final:It}};let w;try{const g={equity:c,bond:d,cash:f},Y=F(g);w={...g,...Y}}catch(g){console.error("Optimisation error (original):",g),s.innerHTML='<div class="alert alert-danger">Error: '+g.message+"</div>",wn=!1,t&&(t.disabled=!1,t.textContent="Optimise Allocation");return}const v=10;let _=0,E=null;function I(){if(e!==Cr){wn=!1,t&&(t.disabled=!1,t.textContent="Optimise Allocation"),s.innerHTML="";return}try{const g=Math.min(_+v,R.length);for(;_<g;_++){const Y=F(R[_]);Y.avgProt<=w.avgProt&&(!E||Y.rate>E.rate)&&(E=Y)}s.innerHTML='<div class="loading"><div class="spinner"></div>Testing allocations... '+_+"/"+R.length+"</div>",_<R.length?setTimeout(I,0):A()}catch(g){console.error("Optimisation error:",g),s.innerHTML='<div class="alert alert-danger">Error: '+g.message+"</div>",wn=!1,t&&(t.disabled=!1,t.textContent="Optimise Allocation")}}function A(){if(e!==Cr){wn=!1,t&&(t.disabled=!1,t.textContent="Optimise Allocation"),s.innerHTML="";return}let g="";if(E&&E.rate>w.rate){const Y=E.medianFinal-w.medianFinal,Z=w.medianFinal>0?Y/w.medianFinal*100:0;g+='<div class="card" style="margin-top:20px;border-color:var(--success);">',g+='<h3 style="color:var(--success);margin-top:0;">Better Allocation Found</h3>',g+='<p style="color:var(--text-muted);margin-bottom:16px;">A different fund split could improve your success rate without increasing protection usage:</p>',g+='<div class="grid-2" style="gap:20px;margin-bottom:20px;">',g+='<div style="padding:16px;background:rgba(0,0,0,0.2);border-radius:8px;">',g+='<div style="font-weight:500;margin-bottom:12px;color:var(--text-muted);">Your Current Split</div>',g+='<div style="font-size:24px;font-weight:600;color:var(--warning);">'+w.rate.toFixed(1)+"%</div>",g+='<div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">Success Rate</div>',g+='<div style="font-size:13px;">Equity: '+H(w.equity)+" ("+Math.round(w.equity/y*100)+"%)</div>",g+='<div style="font-size:13px;">Bonds: '+H(w.bond)+" ("+Math.round(w.bond/y*100)+"%)</div>",g+='<div style="font-size:13px;">Cash: '+H(w.cash)+" ("+Math.round(w.cash/y*100)+"%)</div>",g+='<div style="font-size:12px;color:var(--text-muted);margin-top:8px;">Avg protection: '+w.avgProt.toFixed(0)+" mo | Median final: "+H(w.medianFinal)+"</div>",g+="</div>",g+='<div style="padding:16px;background:rgba(46,160,67,0.1);border-radius:8px;border:1px solid var(--success);">',g+='<div style="font-weight:500;margin-bottom:12px;color:var(--success);">Optimised Split</div>',g+='<div style="font-size:24px;font-weight:600;color:var(--success);">'+E.rate.toFixed(1)+"%</div>",g+='<div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">Success Rate (+'+(E.rate-w.rate).toFixed(1)+"%)</div>",g+='<div style="font-size:13px;">Equity: '+H(E.equity)+" ("+Math.round(E.equity/y*100)+"%)</div>",g+='<div style="font-size:13px;">Bonds: '+H(E.bond)+" ("+Math.round(E.bond/y*100)+"%)</div>",g+='<div style="font-size:13px;">Cash: '+H(E.cash)+" ("+Math.round(E.cash/y*100)+"%)</div>",g+='<div style="font-size:12px;color:var(--text-muted);margin-top:8px;">Avg protection: '+E.avgProt.toFixed(0)+" mo | Median final: "+H(E.medianFinal)+"</div>",g+="</div>",g+="</div>",Y<0?(g+='<div class="alert alert-warning" style="margin-bottom:16px;">',g+="<strong>Trade-off:</strong> The optimised allocation has a "+Math.abs(Z).toFixed(0)+"% lower median final value. ",g+="This is because it likely has less equity exposure. You gain safety but may sacrifice some upside.",g+="</div>"):Y>0&&(g+='<div class="alert alert-info" style="margin-bottom:16px;">',g+="<strong>Bonus:</strong> The optimised allocation also has a "+Z.toFixed(0)+"% higher median final value!",g+="</div>"),g+='<div class="alert alert-info" style="margin-bottom:16px;">',g+="<strong>To apply this allocation:</strong> Click the button below to update your Settings with these new fund minimums.",g+="</div>",g+='<button onclick="applyOptimisedAllocationUI('+E.equity+","+E.bond+","+E.cash+')" style="width:100%;">Apply Optimised Allocation to Settings</button>',g+="</div>"}else g+='<div class="card" style="margin-top:20px;border-color:var(--primary);">',g+='<h3 style="color:var(--primary);margin-top:0;">Your Allocation is Already Optimal</h3>',g+='<p style="color:var(--text-muted);">We tested '+R.length+" different fund splits. Your current allocation achieves the best success rate ("+w.rate.toFixed(1)+"%) without increasing protection usage.</p>",g+='<p style="font-size:13px;color:var(--text-muted);">Your protection: '+w.avgProt.toFixed(0)+" months average</p>",g+="</div>";s.innerHTML=g,wn=!1,t&&(t.disabled=!1,t.textContent="Optimise Allocation")}setTimeout(I,0)};window.applyOptimisedAllocationUI=async function(n,e,t){if(document.getElementById("ssEquityMin").value=n,document.getElementById("ssBondMin").value=e,document.getElementById("ssCashTarget").value=t,document.getElementById("dsEquityMin").value=n,document.getElementById("dsBondMin").value=e,document.getElementById("dsCashTarget").value=t,document.getElementById("mcEquity").value=n,document.getElementById("mcBond").value=e,document.getElementById("mcCash").value=t,document.getElementById("histEquity").value=n,document.getElementById("histBond").value=e,document.getElementById("histCash").value=t,document.getElementById("scenEquity").value=n,document.getElementById("scenBond").value=e,document.getElementById("scenCash").value=t,Xo(),ht())try{await Wo({equityMin:n,bondMin:e,cashTarget:t})}catch(s){console.error("Error saving optimised settings:",s)}showToast("Optimised allocation applied to settings and starting values. Scroll up to re-run.","success",4e3)};const ET={1929:"Wall Street Crash / Great Depression",1930:"Great Depression",1931:"Great Depression",1932:"Great Depression",1937:"Recession of 1937",1968:"Late 1960s stagflation",1969:"Late 1960s recession",1973:"Oil Crisis / 1973-74 crash",1974:"1973-74 bear market",2e3:"Dot-com bubble burst",2001:"Dot-com bust / 9/11",2007:"Global Financial Crisis",2008:"Global Financial Crisis",2022:"Post-COVID inflation / rate hikes"};function TT(n){if(!n||n.length===0)return"";const e=n.filter(i=>i.failed).sort((i,a)=>i.years-a.years),t=n.filter(i=>i.protMonths>0).sort((i,a)=>a.protMonths-i.protMonths),s=e.length>0?e.slice(0,5):t.slice(0,5);if(s.length===0)return"";let r=`
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
      `;return s.forEach(i=>{const a=i.startYear||i.seed,l=ET[a]||"-",c=i.failed?"danger":"success";r+=`
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
      `,r}function Pp(n,e,t,s,r){const i=n.successRate>=90?"success":n.successRate>=80?"warning":"danger",a=s.replace("Results",""),l=n.survival||{},c=n.finalValue||{},d=n.protection||{};let f=`
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
          ${s==="histResults"?TT(e):""}

          <!-- Result Summary -->
          <div class="alert ${i==="success"?"alert-success":i==="warning"?"alert-warning":"alert-danger"}" style="margin-top: 24px;">
            ${n.successRate>=90?"Excellent! Very high probability of success.":n.successRate>=80?"Good but some downside risk. Consider adjustments.":"Warning: Significant risk of depletion."}
          </div>
        </div>
      `;document.getElementById(s).innerHTML=f,setTimeout(()=>{const m=document.getElementById(`${a}ConeChart`),y=document.getElementById(`${a}TrajChart`),b=document.getElementById(`${a}HistChart`);m&&e&&e.length>0&&oT(m,e,{years:r,title:"Cone of Uncertainty (5th-95th Percentile)"}),y&&e&&e.length>0&&aT(y,e,{years:r,title:"Sample Trajectories (100 runs)"}),b&&e&&e.length>0&&lT(b,e,{title:"Protection Months Distribution"})},50)}function IT(n,e){let t='<div class="card"><h2>Scenario Analysis</h2>';t+=`
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
        `}t+="</div></div>",document.getElementById(e).innerHTML=t,setTimeout(()=>{const s=document.getElementById("scenCompChart");s&&n&&cT(s,n,{years:35,title:"Scenario Comparison"})},50)}async function Zo(){Ct("Loading settings...");try{const n=await jt();document.getElementById("ssBaseSalary").value=n.baseSalary,document.getElementById("ssEquityMin").value=n.equityMin,document.getElementById("ssBondMin").value=n.bondMin,document.getElementById("ssCashTarget").value=n.cashTarget,document.getElementById("ssDuration").value=n.duration,document.getElementById("ssPA").value=n.pa,document.getElementById("ssBRL").value=n.brl,document.getElementById("ssHRL").value=n.hrl,document.getElementById("ssTaxMode").value=n.taxMode||"inflates",document.getElementById("ssOther").value=n.other||0,document.getElementById("ssSpStartDate").value=n.spStartDate||"",document.getElementById("ssSpWeeklyAmount").value=n.spWeeklyAmount||"",go("ss"),document.getElementById("ssConsecutiveLimit").value=n.consecutiveLimit||3,document.getElementById("ssProtectionMult").value=n.protectionMult||.8,document.getElementById("ssDisableProtection").checked=n.disableProtection||!1,document.getElementById("ssHodlEnabled").checked=n.hodlEnabled||!1,document.getElementById("ssHodlValue").value=n.hodlValue||25e3,Xo()}catch(n){console.error("Error loading stress settings:",n)}finally{kt()}}window.saveStressSettingsUI=async function(){if(!ht()){showToast("Please sign in to save settings","error");return}const n=jo(document.getElementById("ssSpStartDate").value.trim());if(!n.valid){showToast(n.error,"error");return}n.warning&&showToast(n.warning,"warning"),Ct("Saving settings...");try{await Wo({baseSalary:+document.getElementById("ssBaseSalary").value,equityMin:+document.getElementById("ssEquityMin").value,bondMin:+document.getElementById("ssBondMin").value,cashTarget:+document.getElementById("ssCashTarget").value,duration:+document.getElementById("ssDuration").value,pa:+document.getElementById("ssPA").value,brl:+document.getElementById("ssBRL").value,hrl:+document.getElementById("ssHRL").value,taxMode:document.getElementById("ssTaxMode").value,other:+document.getElementById("ssOther").value,spStartDate:document.getElementById("ssSpStartDate").value.trim()||null,spWeeklyAmount:+document.getElementById("ssSpWeeklyAmount").value||0,consecutiveLimit:+document.getElementById("ssConsecutiveLimit").value,protectionMult:+document.getElementById("ssProtectionMult").value,disableProtection:document.getElementById("ssDisableProtection").checked,hodlEnabled:document.getElementById("ssHodlEnabled").checked,hodlValue:+document.getElementById("ssHodlValue").value,isaBalance:+document.getElementById("ssIsaBalance").value||0}),showToast("Settings saved successfully","success")}catch(e){console.error("Error saving stress settings:",e),showToast("Error saving: "+e.message,"error")}finally{kt()}};window.copyStressFromDecisionUI=async function(){if(!ht()){showToast("Please sign in first","error");return}if(confirm("Copy your Decision Tool plan basics (funds, income, State Pension, ISA, protection) into the Stress Tester? Your Stress-specific what-ifs (tax mode, HODL) are kept.")){Ct("Copying from Decision...");try{const n=await pn(),e=await jt(),t=Pb(n,e);await Wo(t),await Zo(),showToast("Stress Tester seeded from your Decision plan","success")}catch(n){console.error("Error copying from decision:",n),showToast("Error copying: "+n.message,"error")}finally{kt()}}};window.resetStressSettingsUI=async function(){if(confirm("Reset all stress settings to defaults?")){Ct("Resetting settings...");try{await lE(),await Zo(),showToast("Settings reset to defaults","success")}catch(n){console.error("Error resetting settings:",n),showToast("Error resetting: "+n.message,"error")}finally{kt()}}};async function Cp(){Ct("Loading settings...");try{const n=await pn();document.getElementById("dsEquityMin").value=n.equityMin||25e4,document.getElementById("dsBondMin").value=n.bondMin||2e5,document.getElementById("dsCashTarget").value=n.cashTarget||5e4,document.getElementById("dsDuration").value=n.duration||35,document.getElementById("dsBaseSalary").value=n.baseSalary||3e4,document.getElementById("dsProtectionFactor").value=n.protectionFactor||20,document.getElementById("dsRecoveryBuffer").value=n.recoveryBuffer||15e3,document.getElementById("dsConsecutiveLimit").value=n.consecutiveLimit||3,document.getElementById("dsIsaBalance").value=n.isaBalance||0,document.getElementById("entryEquity").value=n.equityMin||25e4,document.getElementById("entryBond").value=n.bondMin||2e5,document.getElementById("entryCash").value=n.cashTarget||5e4,document.getElementById("entryIsa").value=n.isaBalance||0,Xo()}catch(n){console.error("Error loading decision settings:",n)}finally{kt()}}window.saveDecisionSettingsUI=async function(){if(!ht()){showToast("Please sign in to save settings","error");return}const n=jo(document.getElementById("dsSpStartDate").value.trim());if(!n.valid){showToast(n.error,"error");return}n.warning&&showToast(n.warning,"warning"),Ct("Saving settings...");try{await lc({equityMin:+document.getElementById("dsEquityMin").value,bondMin:+document.getElementById("dsBondMin").value,cashTarget:+document.getElementById("dsCashTarget").value,duration:+document.getElementById("dsDuration").value,baseSalary:+document.getElementById("dsBaseSalary").value,spStartDate:document.getElementById("dsSpStartDate").value.trim()||null,spWeeklyAmount:+document.getElementById("dsSpWeeklyAmount").value||0,protectionFactor:+document.getElementById("dsProtectionFactor").value,recoveryBuffer:+document.getElementById("dsRecoveryBuffer").value,consecutiveLimit:+document.getElementById("dsConsecutiveLimit").value,isaBalance:+document.getElementById("dsIsaBalance").value||0}),showToast("Settings saved successfully","success")}catch(e){console.error("Error saving decision settings:",e),showToast("Error saving: "+e.message,"error")}finally{kt()}};window.resetDecisionSettingsUI=async function(){if(confirm("Reset all decision settings to defaults?")){Ct("Resetting settings...");try{await lc({equityMin:25e4,bondMin:2e5,cashTarget:5e4,duration:35,baseSalary:3e4,protectionFactor:20,recoveryBuffer:15e3,consecutiveLimit:3}),await Cp(),showToast("Settings reset to defaults","success")}catch(n){console.error("Error resetting settings:",n),showToast("Error resetting: "+n.message,"error")}finally{kt()}}};window.showDrawdownScheduleUI=async function(){const n=parseFloat(document.getElementById("ddInflation").value)/100||.025,e=parseInt(document.getElementById("ddDuration").value)||35;try{const t=await jt();t.duration=e;const s=am(t,e,n);let r='<div class="card"><h2>Projected SIPP Drawdown Schedule</h2>';r+='<div style="overflow-x: auto;"><table>',r+="<thead><tr><th>Year</th><th>BRL</th><th>Other</th><th>State</th><th>SIPP Draw</th><th>Tax</th><th>Net</th></tr></thead>",r+="<tbody>";for(const i of s)r+=`<tr>
            <td>${i.year}</td>
            <td>${H(i.brl)}</td>
            <td>${H(i.other)}</td>
            <td>${H(i.statePension)}</td>
            <td style="color: var(--primary); font-weight: 600;">${H(i.sippDraw)}</td>
            <td style="color: var(--danger);">-${H(i.tax)}</td>
            <td style="color: var(--success);">${H(i.netIncome)}</td>
          </tr>`;r+="</tbody></table></div></div>",document.getElementById("drawdownResults").innerHTML=r}catch(t){console.error("Drawdown error:",t),document.getElementById("drawdownResults").innerHTML=`<div class="alert alert-danger">Error: ${t.message}</div>`}};window.showGlidepathUI=async function(){const n=parseFloat(document.getElementById("gpInflation").value)/100||.025,e=parseInt(document.getElementById("gpDuration").value)||35;try{const t=await jt();t.duration=e;const s=cm(t,n);let r='<div class="card"><h2>Fund Glidepath (Inflation-Adjusted Minimums)</h2>';r+='<div class="alert alert-info" style="margin-bottom: 20px;">',r+="<strong>Glidepath Logic:</strong> Equity & Bond minimums inflate with CPI but deplete linearly to £0. Cash inflates only (maintains real value).",r+="</div>",r+='<div style="overflow-x: auto;"><table>',r+="<thead><tr><th>Year</th><th>Cum Inflation</th><th>Equity Min</th><th>Bond Min</th><th>Cash Target</th><th>Total Min</th></tr></thead>",r+="<tbody>";for(const i of s)r+=`<tr>
            <td>${i.year}</td>
            <td>${(i.cumulativeInflation*100-100).toFixed(1)}%</td>
            <td style="color: var(--success);">${H(i.equityMin)}</td>
            <td style="color: var(--info);">${H(i.bondMin)}</td>
            <td style="color: var(--warning);">${H(i.cashTarget)}</td>
            <td style="font-weight: 600;">${H(i.totalMin)}</td>
          </tr>`;r+="</tbody></table></div></div>",document.getElementById("glidepathResults").innerHTML=r}catch(t){console.error("Glidepath error:",t),document.getElementById("glidepathResults").innerHTML=`<div class="alert alert-danger">Error: ${t.message}</div>`}};let wt=null,bn=[],Lt="all";async function $t(){const n=document.getElementById("historyTabs"),e=document.getElementById("historyDetail"),t=document.getElementById("historyYearFilter"),s=document.getElementById("deleteAllHistoryBtn"),r=document.getElementById("deleteYearBtn");if(!n||!e)return;if(n.innerHTML='<span class="loading">Loading...</span>',bn=await sr({sortDesc:!1,limit:500}),s&&(s.style.display=bn.length>0?"":"none"),r&&(r.style.display="none"),bn.length===0){n.innerHTML="",t&&(t.innerHTML='<option value="all">No entries</option>'),e.innerHTML=`
          <div class="no-history-message">
            <h3>No History Entries</h3>
            <p>Save decisions from the Decision Tool to build your history.</p>
          </div>
        `;return}const i=[...new Set(bn.map(d=>d.date.split("-")[0]))].sort().reverse();if(t){let d='<option value="all">All Years</option>';i.forEach(f=>{d+=`<option value="${f}">${f}</option>`}),t.innerHTML=d,t.value=Lt}r&&(r.style.display=Lt!=="all"&&bn.length>0?"":"none");const a=Lt==="all"?bn:bn.filter(d=>d.date.startsWith(Lt));if(a.length===0){n.innerHTML="",e.innerHTML=`
          <div class="no-history-message">
            <h3>No entries for ${Lt}</h3>
            <p>Select a different year or "All Years".</p>
          </div>
        `;return}let l="";a.forEach(d=>{const f=d.date===wt,m=["history-tab"];f&&m.push("active"),d.inProtection&&m.push("protection");const[y,b]=d.date.split("-").map(Number),T=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],R=Lt==="all"?`${T[b-1]} ${y}`:T[b-1];l+=`<button class="${m.join(" ")}" onclick="selectHistoryEntry('${d.date}')">${R}</button>`}),n.innerHTML=l;const c=document.getElementById("historyMobileSelector");if(c){let d="";a.forEach(f=>{const m=Js(f.date),y=f.inProtection?" (Protection)":"";d+=`<option value="${f.date}">${m}${y}</option>`}),c.innerHTML=d}(!wt||!a.find(d=>d.date===wt))&&(wt=a[a.length-1].date),c&&(c.value=wt),kp(wt),setTimeout(()=>{const d=n.querySelector(".history-tab.active");d&&d.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})},100)}window.filterHistoryByYear=function(n){Lt=n,wt=null,$t()};function Js(n){const[e,t]=n.split("-").map(Number);return`${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][t-1]} ${e}`}function kp(n){const e=document.getElementById("historyDetail"),t=bn.find(d=>d.date===n);if(!t){e.innerHTML='<div class="no-history-message"><h3>Entry not found</h3></div>';return}const s=d=>d!=null?"£"+Math.round(d).toLocaleString():"—",r=t.isTaxEfficientYear!==!1&&t.mode==="Tax-Efficient",i=t.inProtection?"warning":r?"efficient":"inefficient",a=t.inProtection?`Protection${t.protectionInducedTaxEfficiency?" (Tax-Efficient)":""}`:r?"Tax-Efficient":"Standard";let l=t.source||"Unknown";t.source==="Growth"&&(t.dEquity>0||t.dBond>0)?l=`Growth (Equity: ${s(t.dEquity||0)}, Bond: ${s(t.dBond||0)})`:t.source==="Cash"&&(l=`Cash (${s(t.dCash||t.sipp||0)})`);let c=`
        <!-- Header with date and mode -->
        <div class="history-detail-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <div>
              <h3 style="margin:0;">${Js(t.date)}</h3>
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
      `;e.innerHTML=c,document.querySelectorAll(".history-tab").forEach(d=>{d.classList.toggle("active",d.textContent===Js(n))})}window.selectHistoryEntry=function(n){wt=n,kp(n);const e=document.getElementById("historyMobileSelector");e&&(e.value=n);const s=document.getElementById("historyTabs").querySelector(".history-tab.active");s&&s.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})};window.scrollHistoryTabs=function(n){const e=document.getElementById("historyTabs"),t=200;n==="left"?e.scrollLeft-=t:e.scrollLeft+=t};function yo(n){const[e,t]=n.split("-").map(Number);return t>=4?`${e%100}/${(e+1)%100}`:`${(e-1)%100}/${e%100}`}async function ol(n){const e={};for(const s of n){const r=s.taxYear||yo(s.date);e[r]||(e[r]=0),e[r]+=s.isaSavingsUsedThisMonth||s.isa||0}for(const s of n)await rp(s.date);const t=await qn();for(const[s,r]of Object.entries(e))if(t[s]){const i=t[s].isaSavingsUsed||0,a=Math.max(0,i-r);await ms(s,{...t[s],isaSavingsUsed:a})}}window.deleteHistoryEntry=async function(n){if(!ht()){showToast("Please sign in to delete entries","error");return}const e=await sr({sortDesc:!1,limit:1e3}),t=yo(n),r=e.filter(c=>(c.taxYear||yo(c.date))===t).sort((c,d)=>c.date.localeCompare(d.date)),i=r.findIndex(c=>c.date===n);if(i===-1){showToast("Entry not found","error");return}const a=i===r.length-1,l=Js(n);if(a){if(!confirm(`Delete entry for ${l}?`))return;Ct("Deleting entry...");try{await ol([r[i]]),showToast(`Deleted ${l}`,"success"),wt=null,await $t()}catch(c){console.error("Delete error:",c),showToast("Error deleting: "+c.message,"error")}finally{kt()}}else{const c=r.slice(i),d=Js(c[c.length-1].date);if(!confirm(`This will delete ${c.length} entries from ${l} to ${d} in tax year ${t}.

Continue?`))return;Ct(`Deleting ${c.length} entries...`);try{await ol(c),showToast(`Deleted ${c.length} entries`,"success"),wt=null,await $t()}catch(f){console.error("Delete error:",f),showToast("Error deleting: "+f.message,"error")}finally{kt()}}};window.deleteHistoryForTaxYear=async function(n){if(!ht()){showToast("Please sign in to delete entries","error");return}const t=(await sr({sortDesc:!1,limit:1e3})).filter(s=>(s.taxYear||yo(s.date))===n);if(t.length===0){showToast(`No history entries for tax year ${n}`,"info");return}if(confirm(`Delete all ${t.length} history entries for tax year ${n}?`)){Ct(`Deleting tax year ${n}...`);try{await ol(t);const s=await qn();s[n]&&await ms(n,{...s[n],isaSavingsUsed:0}),showToast(`Deleted all entries for ${n}`,"success"),wt=null,await $t()}catch(s){console.error("Delete error:",s),showToast("Error deleting: "+s.message,"error")}finally{kt()}}};window.deleteHistoryForSelectedYear=async function(){if(Lt==="all"){showToast("Select a specific year first","error");return}const n=`${parseInt(Lt)%100}/${(parseInt(Lt)+1)%100}`;await deleteHistoryForTaxYear(n)};window.deleteAllHistory=async function(){if(confirm("Delete ALL history entries? This cannot be undone.")&&confirm("Are you ABSOLUTELY sure? All decision history will be permanently deleted.")){if(!ht()){showToast("Please sign in to delete entries","error");return}Ct("Deleting all history...");try{const n=await sr({limit:1e3});for(const t of n)await rp(t.date);const e=await qn();for(const[t,s]of Object.entries(e))s.isaSavingsUsed>0&&await ms(t,{...s,isaSavingsUsed:0});showToast(`Deleted ${n.length} entries`,"success"),wt=null,await $t()}catch(n){console.error("Delete all error:",n),showToast("Error deleting: "+n.message,"error")}finally{kt()}}};let Qn=null;async function us(){const n=document.getElementById("taxYearTabs"),e=document.getElementById("taxYearDetail");if(!n||!e)return;n.innerHTML='<span class="loading">Loading...</span>';const t=await qn();await pn();const s=Object.keys(t).sort(),r=ST(),i=xT(s,r,40);let a="";i.forEach(d=>{const f=t[d],m=f&&f.yearSetupComplete,y=d===Qn,b=["tax-year-tab"];y&&b.push("active"),m||b.push("not-setup"),a+=`<button class="${b.join(" ")}" onclick="selectTaxYear('${d}')">${d}</button>`}),n.innerHTML=a;const l=document.getElementById("taxYearMobileSelector");if(l){let d="";i.forEach(f=>{const m=t[f],b=m&&m.yearSetupComplete?f:`${f} (not set up)`;d+=`<option value="${f}">${b}</option>`}),l.innerHTML=d}if(!Qn){const d=s.filter(f=>{var m;return(m=t[f])==null?void 0:m.yearSetupComplete});Qn=d.length>0?d[d.length-1]:r}l&&(l.value=Qn),await Mp(Qn,t);const c=n.querySelector(".tax-year-tab.active");c&&c.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})}function ST(){const n=new Date,e=n.getFullYear(),t=n.getMonth()+1;return t<4||t===4&&n.getDate()<6?`${String(e-1).slice(-2)}/${String(e).slice(-2)}`:`${String(e).slice(-2)}/${String(e+1).slice(-2)}`}function xT(n,e,t){const s=new Set(n),[r]=e.split("/").map(Number),i=r<50?2e3+r:1900+r;for(let a=0;a<t&&s.size<t;a++){const l=i+a,c=l+1;s.add(`${String(l).slice(-2)}/${String(c).slice(-2)}`)}return Array.from(s).sort()}async function Mp(n,e,t){var m,y,b,T,R,x,S,M,D,C,O,F,w,v;const s=document.getElementById("taxYearDetail"),r=e[n];if(!r||!r.yearSetupComplete){s.innerHTML=`
          <div class="not-configured-message">
            <h3>Tax Year ${n} Not Configured</h3>
            <p>This tax year hasn't been set up yet. Use the Decision Tool to calculate a decision for a month in this tax year to trigger the setup wizard.</p>
            <button class="btn primary" onclick="triggerWizardForYear('${n}')">Set Up ${n}</button>
          </div>
        `;return}const i=await uc(n),a=Math.round(i.amount||0),l=i.startDate||"Not configured",c=i.isReceiving;i.yearsUntil;const d=_=>_!=null?"£"+Math.round(_).toLocaleString():"—";let f=`
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
              <span class="value">${AT(r.startMonth||4)}</span>
            </div>
            <div class="tax-year-field">
              <label>Remaining Months (at setup)</label>
              <span class="value">${r.remainingMonths||12}</span>
            </div>
          </div>
        </div>
      `;if(r.expectedMonthly){const _=r.expectedMonthly;f+=`
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
                  <td>${d((m=_.sipp)==null?void 0:m.gross)}</td>
                  <td class="tax-col">-${d((y=_.sipp)==null?void 0:y.tax)}</td>
                  <td class="net-col">${d((b=_.sipp)==null?void 0:b.net)}</td>
                </tr>
                ${((T=_.other)==null?void 0:T.gross)>0?`
                <tr>
                  <td class="source-name">Other Income</td>
                  <td>${d((R=_.other)==null?void 0:R.gross)}</td>
                  <td class="tax-col">-${d((x=_.other)==null?void 0:x.tax)}</td>
                  <td class="net-col">${d((S=_.other)==null?void 0:S.net)}</td>
                </tr>
                `:""}
                ${((M=_.statePension)==null?void 0:M.gross)>0?`
                <tr>
                  <td class="source-name">State Pension</td>
                  <td>${d((D=_.statePension)==null?void 0:D.gross)}</td>
                  <td class="tax-col">-${d((C=_.statePension)==null?void 0:C.tax)}</td>
                  <td class="net-col">${d((O=_.statePension)==null?void 0:O.net)}</td>
                </tr>
                `:""}
                ${((F=_.isa)==null?void 0:F.net)>0?`
                <tr>
                  <td class="source-name">ISA <span style="color:var(--success);font-size:11px;">(tax-free)</span></td>
                  <td>${d((w=_.isa)==null?void 0:w.gross)}</td>
                  <td style="color:var(--success);">£0</td>
                  <td class="net-col">${d((v=_.isa)==null?void 0:v.net)}</td>
                </tr>
                `:""}
              </tbody>
              <tfoot>
                <tr>
                  <td><strong>Total</strong></td>
                  <td><strong>${d(_.totalGross)}</strong></td>
                  <td class="tax-col"><strong>-${d(_.totalTax)}</strong></td>
                  <td class="net-col"><strong>${d(_.totalNet)}</strong></td>
                </tr>
              </tfoot>
            </table>
            <p style="margin-top:16px;font-size:14px;color:var(--text);">
              <strong>Monthly take-home: ${d(_.totalNet)}</strong>
            </p>
          </div>
        `}f+=`
        <div class="tax-year-actions">
          <button class="btn secondary" onclick="deleteTaxYear('${n}')">Delete Year</button>
          <button class="btn secondary" onclick="reconfigureTaxYear('${n}')">Reconfigure via Wizard</button>
        </div>
      `,s.innerHTML=f,document.querySelectorAll(".tax-year-tab").forEach(_=>{_.classList.toggle("active",_.textContent===n)})}window.selectTaxYear=async function(n){Qn=n;const e=await qn();await pn(),await Mp(n,e),document.querySelectorAll(".tax-year-tab").forEach(i=>{i.classList.toggle("active",i.textContent===n)});const t=document.getElementById("taxYearMobileSelector");t&&(t.value=n);const r=document.getElementById("taxYearTabs").querySelector(`.tax-year-tab[onclick="selectTaxYear('${n}')"]`);r&&r.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})};window.scrollTaxYearTabs=function(n){const e=document.getElementById("taxYearTabs"),t=200;n==="left"?e.scrollLeft-=t:e.scrollLeft+=t};function AT(n){return["January","February","March","April","May","June","July","August","September","October","November","December"][(n-1)%12]||"April"}window.triggerWizardForYear=async function(n){const[e]=n.split("/").map(Number),t=e<50?2e3+e:1900+e,s=`${t}-04`,r=document.getElementById("selectedMonth");r&&(r.value=s),document.querySelectorAll(".tab").forEach(i=>i.classList.remove("active")),document.querySelector('.tab[data-tab="decision"]').classList.add("active"),document.querySelectorAll(".tab-content").forEach(i=>i.classList.remove("active")),document.getElementById("decision-content").classList.add("active"),document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(i=>i.classList.remove("active")),document.querySelector('.sub-tab[data-decisiontab="entry"]').classList.add("active"),document.querySelectorAll(".decision-subtab").forEach(i=>i.classList.add("hidden")),document.getElementById("decision-entry").classList.remove("hidden"),showToast(`Please click "Calculate" with April ${t} selected to set up tax year ${n}`,"info",5e3)};window.reconfigureTaxYear=async function(n){if(confirm(`This will allow you to reconfigure tax year ${n}. The setup wizard will be triggered when you next calculate a decision for this year. Continue?`))try{const e=await qo(n);e.yearSetupComplete=!1,await ms(n,e),await us(),showToast(`Tax year ${n} marked for reconfiguration. Calculate a decision for this year to run the wizard again.`,"success",5e3)}catch(e){console.error("Error:",e),showToast("Error: "+e.message,"error")}};window.updateTaxYear=async function(n,e,t){try{const s=await qo(n);s[e]=parseFloat(t),await ms(n,s)}catch(s){console.error("Error updating tax year:",s),showToast("Error saving: "+s.message,"error")}};window.deleteTaxYear=async function(n){if(confirm("Delete tax year "+n+"? This will remove all configuration for this year."))try{const e=await Ht();delete e.taxYears[n],await $o(e),Qn=null,await us()}catch(e){console.error("Error deleting tax year:",e),showToast("Error deleting: "+e.message,"error")}};window.addTaxYear=async function(){if(!ht()){showToast("Please sign in to add tax years","error");return}const n=prompt("Enter tax year (e.g., 25/26):");if(!n||!/^\d{2}\/\d{2}$/.test(n)){showToast("Invalid format. Use YY/YY (e.g., 25/26)","error");return}try{await ms(n,{}),await us()}catch(e){console.error("Save error:",e),showToast("Error saving: "+e.message,"error")}};console.log("Pension Planner v"+Pd+" loaded");
