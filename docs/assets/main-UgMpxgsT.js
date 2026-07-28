(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function t(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(i){if(i.ep)return;i.ep=!0;const s=t(i);fetch(i.href,s)}})();function Eg(n){const e=(n.sippDraw||0)+(n.other||0)+(n.statePension||0),t=e*12,r=n.pa||12570,i=n.brl||50270,s=n.hrl||125140;let o=0;t>r&&(t<=i?o=(t-r)*.2:t<=s?o=(i-r)*.2+(t-i)*.4:o=(i-r)*.2+(s-i)*.4+(t-s)*.45);const l=o/12,c=e-l+(n.isaDraw||0);return{date:n.date,taxYear:n.taxYear,yearNum:n.yearNumber,equity:n.equity,bond:n.bond,cash:n.cash,total:n.equity+n.bond+n.cash,adjEquity:n.adjEquityMin,adjBond:n.adjBondMin,adjCash:n.adjCashTarget,source:n.source,dEquity:n.drawFromEquity||0,dBond:n.drawFromBond||0,dCash:n.drawFromCash||0,sipp:n.sippDraw,stdSipp:n.stdSipp||n.sippDraw,isa:n.isaDraw,other:n.other,state:n.statePension,pa:r,brl:i,monthlyTax:l,monthlyNet:c,mode:n.taxEfficient?"Tax-Efficient":"Standard",inProtection:n.inProtection,reason:n.protectionReason||"",consecutiveDraws:n.consecutiveCashDraws||0,boostAmount:n.boostAmount,boostEligible:n.boostEligible||!1,rebal:n.rebalanceActions?n.rebalanceActions.join("; "):"",yearlyIsaSavingsAllocation:n.yearlyIsaSavingsAllocation||0,isaSavingsUsedThisMonth:n.isaDraw||0,cumulativeIsaSavingsUsed:n.cumulativeIsaSavingsUsed||0,taxPaidMonthly:l,taxPaidYTD:n.taxPaidYTD||l,taxProjectedAnnual:n.taxProjectedAnnual||o,taxSavedMonthly:n.taxSavedMonthly||0,taxSavedYTD:n.taxSavedYTD||0,taxSavedProjectedAnnual:n.taxSavedProjectedAnnual||0,isTaxEfficientYear:n.isTaxEfficientYear??!0,protectionInducedTaxEfficiency:n.protectionInducedTaxEfficiency||!1,remainingMonths:n.remainingMonths||12}}const Js={INFO:"info",WARNING:"warning",DANGER:"danger",SUCCESS:"success"},Ih="6.0.0",qe={PERSONAL_ALLOWANCE:12570,BASIC_RATE_LIMIT:50270,HIGHER_RATE_LIMIT:125140,BASIC_RATE:.2,HIGHER_RATE:.4,ADDITIONAL_RATE:.45,PA_TAPER_THRESHOLD:1e5,PA_TAPER_RATE:.5},Ml={ASSUMED_CPI:.025,OTHER_INCOME_CAP:.04},Yt={RETURN:.03,MIN:0,DRAWDOWN_STRATEGY:"minimiseEarlyTax"},ge={BASE_SALARY:3e4,EQUITY_MIN:25e4,BOND_MIN:2e5,CASH_TARGET:5e4,DURATION_YEARS:35,PROTECTION_FACTOR:20,RECOVERY_BUFFER:15e3,CONSECUTIVE_LIMIT:3},Dr={PROTECTION_MULTIPLIER:.8,HODL_ENABLED:!1,HODL_VALUE:25e3},Br={1928:.4781,1929:-.172,1930:-.338,1931:-.527,1932:-.231,1933:.669,1934:.041,1935:.3879,1936:.2492,1937:-.3839,1938:.2846,1939:-.0278,1940:-.1278,1941:-.1552,1942:.0782,1943:.1382,1944:.1226,1945:.2665,1946:-.0818,1947:.0225,1948:-.0246,1949:.1279,1950:.1787,1951:.1463,1952:.0837,1953:-.0377,1954:.4399,1955:.2084,1956:.0262,1957:-.1278,1958:.3396,1959:.1612,1960:-.0912,1961:.1889,1962:-.1081,1963:.1715,1964:.1478,1965:.1058,1966:-.1858,1967:.1506,1968:.0457,1969:-.1524,1970:.0482,1971:.0627,1972:.1476,1973:-.1652,1974:-.2777,1975:.3815,1976:.1774,1977:-.1271,1978:-.0303,1979:.0414,1980:.1493,1981:-.0909,1982:.1976,1983:.2027,1984:-.0365,1985:.2778,1986:.2278,1987:.0227,1988:.1185,1989:.2697,1990:-.0456,1991:.2013,1992:.044,1993:.1372,1994:.0218,1995:.3345,1996:.2601,1997:.2264,1998:.1627,1999:.2516,2e3:-.0617,2001:-.0727,2002:-.1679,2003:.2525,2004:.0333,2005:-.0061,2006:.1618,2007:.0648,2008:-.3355,2009:.1882,2010:.1102,2011:.0556,2012:.0728,2013:.2665,2014:.0775,2015:-.023,2016:.1342,2017:.2511,2018:-.0583,2019:.2234,2020:.0726,2021:.1873,2022:-.0878,2023:.1399,2024:.1299},$o={1928:-.012,1929:.002,1930:-.06,1931:-.094,1932:-.103,1933:.005,1934:.021,1935:.03,1936:.014,1937:.028,1938:-.02,1939:-.014,1940:.01,1941:.099,1942:.09,1943:.03,1944:.023,1945:.023,1946:.186,1947:.087,1948:.03,1949:-.02,1950:.059,1951:.06,1952:.009,1953:.006,1954:-.007,1955:.004,1956:.03,1957:.028,1958:.017,1959:.015,1960:.014,1961:.007,1962:.013,1963:.017,1964:.01,1965:.019,1966:.034,1967:.028,1968:.046,1969:.062,1970:.055,1971:.033,1972:.034,1973:.087,1974:.124,1975:.069,1976:.048,1977:.067,1978:.09,1979:.133,1980:.125,1981:.089,1982:.038,1983:.038,1984:.04,1985:.038,1986:.011,1987:.044,1988:.044,1989:.046,1990:.061,1991:.03,1992:.029,1993:.027,1994:.026,1995:.025,1996:.034,1997:.017,1998:.016,1999:.027,2e3:.034,2001:.016,2002:.024,2003:.019,2004:.033,2005:.034,2006:.025,2007:.041,2008:.001,2009:.027,2010:.015,2011:.03,2012:.017,2013:.015,2014:.008,2015:.007,2016:.021,2017:.021,2018:.019,2019:.023,2020:.012,2021:.07,2022:.065,2023:.032,2024:.029},Tg={GREAT_DEPRESSION:{name:"Great Depression",equity:[-.17,-.34,-.53,-.23,.67,.04,.39,.25,-.38,.28],inflation:[0,-.06,-.09,-.1,.01,.02,.03,.01,.03,-.02],color:"#e74c3c"},STAGFLATION_70S:{name:"Stagflation 70s",equity:[-.17,-.28,.38,.18,-.13,-.03,.04,.15,-.09,.2],inflation:[.09,.12,.07,.05,.07,.09,.13,.13,.09,.04],color:"#e67e22"},LOST_DECADE_2000S:{name:"Lost Decade 2000s",equity:[-.06,-.07,-.17,.25,.03,-.01,.16,.06,-.34,.19],inflation:[.03,.02,.02,.02,.03,.03,.03,.04,0,.03],color:"#9b59b6"},CRISIS_2008:{name:"2008 Crisis",equity:[-.34,.19,.11,.06,.07,.27,.08,-.02,.13,.25],inflation:[0,.03,.02,.03,.02,.02,.01,.01,.02,.02],color:"#3498db"},SYNTHETIC_WORST:{name:"Synthetic Worst",equity:[-.4,.1,.1,.1,-.35,.1,.1,.1,.1,-.3],inflation:[.08,.05,.05,.05,.08,.05,.05,.05,.05,.08],color:"#1abc9c"}},rn={START_MONTH:4,START_DAY:6};function Ja(n,e,t,r=qe.HIGHER_RATE_LIMIT){if(n<=0)return 0;let i=e;if(n>qe.PA_TAPER_THRESHOLD){const f=(n-qe.PA_TAPER_THRESHOLD)*qe.PA_TAPER_RATE;i=Math.max(0,e-f)}const s=Math.max(0,n-i),o=Math.max(0,t-i),l=r-t;let c=0;const u=Math.min(s,o);if(c+=u*qe.BASIC_RATE,s>o){const f=Math.min(s-o,l);c+=f*qe.HIGHER_RATE}if(s>o+l){const f=s-o-l;c+=f*qe.ADDITIONAL_RATE}return c}function ar(n,e,t,r=qe.HIGHER_RATE_LIMIT){return n-Ja(n,e,t,r)}function Ig(n,e,t,r=qe.HIGHER_RATE_LIMIT){if(n<=0)return 0;let i=n,s=n+1;for(;ar(s,e,t,r)<n&&s<1e12;)s*=2;for(let o=0;o<60;o++){const l=(i+s)/2;ar(l,e,t,r)<n?i=l:s=l}return(i+s)/2}function zo(n){const e=typeof n=="string"?new Date(n):n,t=e.getFullYear(),r=e.getMonth()+1,i=e.getDate();if(r<rn.START_MONTH||r===rn.START_MONTH&&i<rn.START_DAY){const s=t-1;return`${String(s).slice(-2)}/${String(t).slice(-2)}`}return`${String(t).slice(-2)}/${String(t+1).slice(-2)}`}function Na(n){const e=parseInt(n.split("/")[0]),t=e<50?2e3+e:1900+e;return new Date(t,rn.START_MONTH-1,rn.START_DAY)}function Sg(n){const e=parseInt(n.split("/")[1]),t=e<50?2e3+e:1900+e;return new Date(t,rn.START_MONTH-1,rn.START_DAY-1)}function Ag(){const n=new Date;return`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`}function Dl(n){const[e,t]=n.split("-").map(Number);return new Date(e,t-1,15)}function xg(n){const t=(typeof n=="string"?new Date(n):n).getMonth()+1;return t>=rn.START_MONTH?12-(t-rn.START_MONTH):rn.START_MONTH-t}const Rg=Ml.ASSUMED_CPI,kg=Ml.OTHER_INCOME_CAP;function Pg(n,e,t=kg){let r=n;for(const i of e)r*=1+Math.min(i,t);return r}const Hu={TAX_EFFICIENT:"minimiseEarlyTax",LONGEVITY:"maximiseLongevity"};function Cg(n,e){return n<=0?n:n*Math.pow(1+e,1/12)}function Ll({targetGross:n,fixedIncome:e=0,pa:t,brl:r,hrl:i,isaBalance:s=0,strategy:o=Hu.TAX_EFFICIENT,yearsUntilSp:l=0}){const c=ar(n,t,r,i),u=Math.max(0,Math.min(r,n)-e),f=ar(u+e,t,r,i),m=Math.max(0,c-f),p=o===Hu.LONGEVITY&&l>0?s/l:1/0,y=Math.max(0,Math.min(m,Math.max(0,s),p)),I=s-y,S=m-y;let x=u;if(S>0){const N=Ig(f+S,t,r,i);x=Math.max(u,N-e)}const k=x+e,C=ar(k,t,r,i);return{sippGross:x,isaDraw:y,remainingIsa:I,taxable:k,tax:k-C,net:C+y}}const Mg=5,Dg=20,Lg=.01;function Ng(n){return Math.min(Math.max(0,Math.floor(n)-Mg+1),Dg)}function go(n,e="declining"){return e!=="declining"?1:Math.pow(1-Lg,Ng(n))}function Bg(n,e="declining"){if(e!=="declining")return 0;const t=go(n-1,e);return t===0?0:1-go(n,e)/t}function Sh(n,e,t=.025){const r=[];let i=n.isaBalance||0;const s=Math.max(0,t-.01);for(let o=0;o<=e;o++){const l=Math.pow(1+t,o),c=n.taxMode==="frozen"?n.pa:n.pa*l,u=n.taxMode==="frozen"?n.brl:n.brl*l,f=n.taxMode==="frozen"?n.hrl||125140:(n.hrl||125140)*l,m=go(o,n.spendingProfile||"flat"),p=(n.baseSalary||0)*l*m,y=(n.other||0)*l,I=n.statePensionYear!==void 0&&o>=n.statePensionYear?(n.statePension||0)*l:0,S=y+I,x=Math.max(0,(n.statePensionYear??0)-o),k=Ll({targetGross:p,fixedIncome:S,pa:c,brl:u,hrl:f,isaBalance:i,strategy:n.isaDrawdownStrategy,yearsUntilSp:x}),C=k.taxable-k.tax,N=i;i=k.remainingIsa*(1+s),r.push({year:o,brl:u,other:y,statePension:I,sippDraw:k.sippGross,totalTaxable:k.taxable,tax:k.tax,netIncome:C,target:p,isaDraw:k.isaDraw,isaBalance:N,spendable:k.net})}return r}function Rn(n,e,t,r,i){if(i){const s=Math.max(0,1-e/t);return n*r*s}return n*r}const Mn={cautious:{key:"cautious",label:"Cautious",equity:.3,bond:.45,cash:.25},balanced:{key:"balanced",label:"Balanced",equity:.5,bond:.4,cash:.1},adventurous:{key:"adventurous",label:"Adventurous",equity:.7,bond:.25,cash:.05}};function Uo(n,e,t){if(!n)return null;const r=Math.max(5,t-20),i=Math.min(1,e/r);return n.start+(n.end-n.start)*i}function bs(n,e,t=.22){const r=n+e;if(r<=0)return{start:0,end:0};const i=n/r;return{start:Math.max(0,i-t),end:i}}const Og=.12;function Ah(n,e,t=null,r=Og){const i=n+e;if(i<=0)return{start:0,end:0};const s=n/i;let o;return t&&t.equityPct+t.bondPct>0?o=t.equityPct/(t.equityPct+t.bondPct):o=Math.min(1,s+r),{start:s,end:o}}function xh(n){const e=!!(n.subAsset&&n.subAsset.bondWeights&&Object.keys(n.subAsset.bondWeights).length>0),t=n.glideEndgame&&n.glideEndgame.equityPct+n.glideEndgame.bondPct>0?n.glideEndgame:null;return e?Ah(n.equityMin,n.bondMin,t):bs(n.equityMin,n.bondMin)}function Xa(n,e,t){const r=n.cash,i=Math.max(0,1-r),s=Uo(n.equityGlide,e,t);return s==null?{equity:n.equity,bond:n.bond,cash:r}:{equity:i*s,bond:i*(1-s),cash:r}}function Vg(n,e,t){const r=Rn(n.equityMin,e,n.duration,t,!0),i=Rn(n.bondMin,e,n.duration,t,!0),s=Rn(n.cashTarget,e,n.duration,t,!1);return{equity:r,bond:i,cash:s,totalGrowth:r+i,total:r+i+s}}function Fg(n,e=Ml.ASSUMED_CPI){const t=[],r=n.equityGlideEnabled?bs(n.equityMin,n.bondMin):null;for(let i=0;i<=n.duration;i++){const s=Math.pow(1+e,i),o=Vg(n,i,s);let l=o.equity,c=o.bond;if(r){const u=Uo(r,i,n.duration),f=l+c;l=f*u,c=f*(1-u)}t.push({year:i,cumulativeInflation:s,equityMin:l,bondMin:c,cashTarget:o.cash,totalMin:l+c+o.cash})}return t}const $g="modulepreload",zg=function(n,e){return new URL(n,e).href},Yu={},ju=function(e,t,r){let i=Promise.resolve();if(t&&t.length>0){const o=document.getElementsByTagName("link"),l=document.querySelector("meta[property=csp-nonce]"),c=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));i=Promise.allSettled(t.map(u=>{if(u=zg(u,r),u in Yu)return;Yu[u]=!0;const f=u.endsWith(".css"),m=f?'[rel="stylesheet"]':"";if(!!r)for(let I=o.length-1;I>=0;I--){const S=o[I];if(S.href===u&&(!f||S.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${u}"]${m}`))return;const y=document.createElement("link");if(y.rel=f?"stylesheet":$g,f||(y.as="script"),y.crossOrigin="",y.href=u,c&&y.setAttribute("nonce",c),document.head.appendChild(y),f)return new Promise((I,S)=>{y.addEventListener("load",I),y.addEventListener("error",()=>S(new Error(`Unable to preload CSS for ${u}`)))})}))}function s(o){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=o,window.dispatchEvent(l),!l.defaultPrevented)throw o}return i.then(o=>{for(const l of o||[])l.status==="rejected"&&s(l.reason);return e().catch(s)})};function Nl(n){let e=n;return function(){return e=Math.sin(e)*1e4,e-Math.floor(e)}}function ei(n,e,t){const r=Math.max(t(),1e-12),i=t();let s=Math.sqrt(-2*Math.log(r))*Math.cos(2*Math.PI*i);return s=Math.max(-4,Math.min(4,s)),n+e*s}function qo(n){const e=JSON.stringify(n);let t=0;for(let r=0;r<e.length;r++){const i=e.charCodeAt(r);t=(t<<5)-t+i,t=t&t}return t.toString(16)}var Wu={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rh=function(n){const e=[];let t=0;for(let r=0;r<n.length;r++){let i=n.charCodeAt(r);i<128?e[t++]=i:i<2048?(e[t++]=i>>6|192,e[t++]=i&63|128):(i&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(n.charCodeAt(++r)&1023),e[t++]=i>>18|240,e[t++]=i>>12&63|128,e[t++]=i>>6&63|128,e[t++]=i&63|128):(e[t++]=i>>12|224,e[t++]=i>>6&63|128,e[t++]=i&63|128)}return e},Ug=function(n){const e=[];let t=0,r=0;for(;t<n.length;){const i=n[t++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){const s=n[t++];e[r++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){const s=n[t++],o=n[t++],l=n[t++],c=((i&7)<<18|(s&63)<<12|(o&63)<<6|l&63)-65536;e[r++]=String.fromCharCode(55296+(c>>10)),e[r++]=String.fromCharCode(56320+(c&1023))}else{const s=n[t++],o=n[t++];e[r++]=String.fromCharCode((i&15)<<12|(s&63)<<6|o&63)}}return e.join("")},kh={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<n.length;i+=3){const s=n[i],o=i+1<n.length,l=o?n[i+1]:0,c=i+2<n.length,u=c?n[i+2]:0,f=s>>2,m=(s&3)<<4|l>>4;let p=(l&15)<<2|u>>6,y=u&63;c||(y=64,o||(p=64)),r.push(t[f],t[m],t[p],t[y])}return r.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(Rh(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):Ug(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<n.length;){const s=t[n.charAt(i++)],l=i<n.length?t[n.charAt(i)]:0;++i;const u=i<n.length?t[n.charAt(i)]:64;++i;const m=i<n.length?t[n.charAt(i)]:64;if(++i,s==null||l==null||u==null||m==null)throw new qg;const p=s<<2|l>>4;if(r.push(p),u!==64){const y=l<<4&240|u>>2;if(r.push(y),m!==64){const I=u<<6&192|m;r.push(I)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class qg extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Hg=function(n){const e=Rh(n);return kh.encodeByteArray(e,!0)},yo=function(n){return Hg(n).replace(/\./g,"")},Ph=function(n){try{return kh.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function Yg(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const jg=()=>Yg().__FIREBASE_DEFAULTS__,Wg=()=>{if(typeof process>"u"||typeof Wu>"u")return;const n=Wu.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},Gg=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&Ph(n[1]);return e&&JSON.parse(e)},Ho=()=>{try{return jg()||Wg()||Gg()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},Ch=n=>{var e,t;return(t=(e=Ho())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[n]},Kg=n=>{const e=Ch(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),r]:[e.substring(0,t),r]},Mh=()=>{var n;return(n=Ho())===null||n===void 0?void 0:n.config},Dh=n=>{var e;return(e=Ho())===null||e===void 0?void 0:e[`_${n}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qg{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,r))}}}/**
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
 */function Jg(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},r=e||"demo-project",i=n.iat||0,s=n.sub||n.user_id;if(!s)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:i,exp:i+3600,auth_time:i,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}}},n);return[yo(JSON.stringify(t)),yo(JSON.stringify(o)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ot(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Xg(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(ot())}function Zg(){var n;const e=(n=Ho())===null||n===void 0?void 0:n.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function ey(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function ty(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function ny(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function ry(){const n=ot();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function iy(){return!Zg()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function sy(){try{return typeof indexedDB=="object"}catch{return!1}}function oy(){return new Promise((n,e)=>{try{let t=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),t||self.indexedDB.deleteDatabase(r),n(!0)},i.onupgradeneeded=()=>{t=!1},i.onerror=()=>{var s;e(((s=i.error)===null||s===void 0?void 0:s.message)||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ay="FirebaseError";class $n extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name=ay,Object.setPrototypeOf(this,$n.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,_s.prototype.create)}}class _s{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){const r=t[0]||{},i=`${this.service}/${e}`,s=this.errors[e],o=s?ly(s,r):"Error",l=`${this.serviceName}: ${o} (${i}).`;return new $n(i,l,r)}}function ly(n,e){return n.replace(cy,(t,r)=>{const i=e[r];return i!=null?String(i):`<${r}?>`})}const cy=/\{\$([^}]+)}/g;function uy(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function vo(n,e){if(n===e)return!0;const t=Object.keys(n),r=Object.keys(e);for(const i of t){if(!r.includes(i))return!1;const s=n[i],o=e[i];if(Gu(s)&&Gu(o)){if(!vo(s,o))return!1}else if(s!==o)return!1}for(const i of r)if(!t.includes(i))return!1;return!0}function Gu(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Es(n){const e=[];for(const[t,r]of Object.entries(n))Array.isArray(r)?r.forEach(i=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function Hi(n){const e={};return n.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[i,s]=r.split("=");e[decodeURIComponent(i)]=decodeURIComponent(s)}}),e}function Yi(n){const e=n.indexOf("?");if(!e)return"";const t=n.indexOf("#",e);return n.substring(e,t>0?t:void 0)}function dy(n,e){const t=new hy(n,e);return t.subscribe.bind(t)}class hy{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,r){let i;if(e===void 0&&t===void 0&&r===void 0)throw new Error("Missing Observer.");fy(e,["next","error","complete"])?i=e:i={next:e,error:t,complete:r},i.next===void 0&&(i.next=Ba),i.error===void 0&&(i.error=Ba),i.complete===void 0&&(i.complete=Ba);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function fy(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function Ba(){}/**
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
 */function De(n){return n&&n._delegate?n._delegate:n}class Or{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xr="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class py{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const r=new Qg;if(this.instancesDeferred.set(t,r),this.isInitialized(t)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:t});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const r=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),i=(t=e==null?void 0:e.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(s){if(i)return null;throw s}else{if(i)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(gy(e))try{this.getOrInitializeService({instanceIdentifier:xr})}catch{}for(const[t,r]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(t);try{const s=this.getOrInitializeService({instanceIdentifier:i});r.resolve(s)}catch{}}}}clearInstance(e=xr){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=xr){return this.instances.has(e)}getOptions(e=xr){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:r,options:t});for(const[s,o]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(s);r===l&&o.resolve(i)}return i}onInit(e,t){var r;const i=this.normalizeInstanceIdentifier(t),s=(r=this.onInitCallbacks.get(i))!==null&&r!==void 0?r:new Set;s.add(e),this.onInitCallbacks.set(i,s);const o=this.instances.get(i);return o&&e(o,i),()=>{s.delete(e)}}invokeOnInitCallbacks(e,t){const r=this.onInitCallbacks.get(t);if(r)for(const i of r)try{i(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:my(e),options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=xr){return this.component?this.component.multipleInstances?e:xr:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function my(n){return n===xr?void 0:n}function gy(n){return n.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yy{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new py(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var oe;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(oe||(oe={}));const vy={debug:oe.DEBUG,verbose:oe.VERBOSE,info:oe.INFO,warn:oe.WARN,error:oe.ERROR,silent:oe.SILENT},wy=oe.INFO,by={[oe.DEBUG]:"log",[oe.VERBOSE]:"log",[oe.INFO]:"info",[oe.WARN]:"warn",[oe.ERROR]:"error"},_y=(n,e,...t)=>{if(e<n.logLevel)return;const r=new Date().toISOString(),i=by[e];if(i)console[i](`[${r}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Bl{constructor(e){this.name=e,this._logLevel=wy,this._logHandler=_y,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in oe))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?vy[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,oe.DEBUG,...e),this._logHandler(this,oe.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,oe.VERBOSE,...e),this._logHandler(this,oe.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,oe.INFO,...e),this._logHandler(this,oe.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,oe.WARN,...e),this._logHandler(this,oe.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,oe.ERROR,...e),this._logHandler(this,oe.ERROR,...e)}}const Ey=(n,e)=>e.some(t=>n instanceof t);let Ku,Qu;function Ty(){return Ku||(Ku=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Iy(){return Qu||(Qu=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Lh=new WeakMap,Za=new WeakMap,Nh=new WeakMap,Oa=new WeakMap,Ol=new WeakMap;function Sy(n){const e=new Promise((t,r)=>{const i=()=>{n.removeEventListener("success",s),n.removeEventListener("error",o)},s=()=>{t(lr(n.result)),i()},o=()=>{r(n.error),i()};n.addEventListener("success",s),n.addEventListener("error",o)});return e.then(t=>{t instanceof IDBCursor&&Lh.set(t,n)}).catch(()=>{}),Ol.set(e,n),e}function Ay(n){if(Za.has(n))return;const e=new Promise((t,r)=>{const i=()=>{n.removeEventListener("complete",s),n.removeEventListener("error",o),n.removeEventListener("abort",o)},s=()=>{t(),i()},o=()=>{r(n.error||new DOMException("AbortError","AbortError")),i()};n.addEventListener("complete",s),n.addEventListener("error",o),n.addEventListener("abort",o)});Za.set(n,e)}let el={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return Za.get(n);if(e==="objectStoreNames")return n.objectStoreNames||Nh.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return lr(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function xy(n){el=n(el)}function Ry(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const r=n.call(Va(this),e,...t);return Nh.set(r,e.sort?e.sort():[e]),lr(r)}:Iy().includes(n)?function(...e){return n.apply(Va(this),e),lr(Lh.get(this))}:function(...e){return lr(n.apply(Va(this),e))}}function ky(n){return typeof n=="function"?Ry(n):(n instanceof IDBTransaction&&Ay(n),Ey(n,Ty())?new Proxy(n,el):n)}function lr(n){if(n instanceof IDBRequest)return Sy(n);if(Oa.has(n))return Oa.get(n);const e=ky(n);return e!==n&&(Oa.set(n,e),Ol.set(e,n)),e}const Va=n=>Ol.get(n);function Py(n,e,{blocked:t,upgrade:r,blocking:i,terminated:s}={}){const o=indexedDB.open(n,e),l=lr(o);return r&&o.addEventListener("upgradeneeded",c=>{r(lr(o.result),c.oldVersion,c.newVersion,lr(o.transaction),c)}),t&&o.addEventListener("blocked",c=>t(c.oldVersion,c.newVersion,c)),l.then(c=>{s&&c.addEventListener("close",()=>s()),i&&c.addEventListener("versionchange",u=>i(u.oldVersion,u.newVersion,u))}).catch(()=>{}),l}const Cy=["get","getKey","getAll","getAllKeys","count"],My=["put","add","delete","clear"],Fa=new Map;function Ju(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(Fa.get(e))return Fa.get(e);const t=e.replace(/FromIndex$/,""),r=e!==t,i=My.includes(t);if(!(t in(r?IDBIndex:IDBObjectStore).prototype)||!(i||Cy.includes(t)))return;const s=async function(o,...l){const c=this.transaction(o,i?"readwrite":"readonly");let u=c.store;return r&&(u=u.index(l.shift())),(await Promise.all([u[t](...l),i&&c.done]))[0]};return Fa.set(e,s),s}xy(n=>({...n,get:(e,t,r)=>Ju(e,t)||n.get(e,t,r),has:(e,t)=>!!Ju(e,t)||n.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dy{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(Ly(t)){const r=t.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(t=>t).join(" ")}}function Ly(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const tl="@firebase/app",Xu="0.10.13";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dn=new Bl("@firebase/app"),Ny="@firebase/app-compat",By="@firebase/analytics-compat",Oy="@firebase/analytics",Vy="@firebase/app-check-compat",Fy="@firebase/app-check",$y="@firebase/auth",zy="@firebase/auth-compat",Uy="@firebase/database",qy="@firebase/data-connect",Hy="@firebase/database-compat",Yy="@firebase/functions",jy="@firebase/functions-compat",Wy="@firebase/installations",Gy="@firebase/installations-compat",Ky="@firebase/messaging",Qy="@firebase/messaging-compat",Jy="@firebase/performance",Xy="@firebase/performance-compat",Zy="@firebase/remote-config",e0="@firebase/remote-config-compat",t0="@firebase/storage",n0="@firebase/storage-compat",r0="@firebase/firestore",i0="@firebase/vertexai-preview",s0="@firebase/firestore-compat",o0="firebase",a0="10.14.1";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nl="[DEFAULT]",l0={[tl]:"fire-core",[Ny]:"fire-core-compat",[Oy]:"fire-analytics",[By]:"fire-analytics-compat",[Fy]:"fire-app-check",[Vy]:"fire-app-check-compat",[$y]:"fire-auth",[zy]:"fire-auth-compat",[Uy]:"fire-rtdb",[qy]:"fire-data-connect",[Hy]:"fire-rtdb-compat",[Yy]:"fire-fn",[jy]:"fire-fn-compat",[Wy]:"fire-iid",[Gy]:"fire-iid-compat",[Ky]:"fire-fcm",[Qy]:"fire-fcm-compat",[Jy]:"fire-perf",[Xy]:"fire-perf-compat",[Zy]:"fire-rc",[e0]:"fire-rc-compat",[t0]:"fire-gcs",[n0]:"fire-gcs-compat",[r0]:"fire-fst",[s0]:"fire-fst-compat",[i0]:"fire-vertex","fire-js":"fire-js",[o0]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wo=new Map,c0=new Map,rl=new Map;function Zu(n,e){try{n.container.addComponent(e)}catch(t){Dn.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function di(n){const e=n.name;if(rl.has(e))return Dn.debug(`There were multiple attempts to register component ${e}.`),!1;rl.set(e,n);for(const t of wo.values())Zu(t,n);for(const t of c0.values())Zu(t,n);return!0}function Vl(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function Ht(n){return n.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const u0={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},cr=new _s("app","Firebase",u0);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class d0{constructor(e,t,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new Or("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw cr.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ti=a0;function Bh(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const r=Object.assign({name:nl,automaticDataCollectionEnabled:!1},e),i=r.name;if(typeof i!="string"||!i)throw cr.create("bad-app-name",{appName:String(i)});if(t||(t=Mh()),!t)throw cr.create("no-options");const s=wo.get(i);if(s){if(vo(t,s.options)&&vo(r,s.config))return s;throw cr.create("duplicate-app",{appName:i})}const o=new yy(i);for(const c of rl.values())o.addComponent(c);const l=new d0(t,r,o);return wo.set(i,l),l}function Oh(n=nl){const e=wo.get(n);if(!e&&n===nl&&Mh())return Bh();if(!e)throw cr.create("no-app",{appName:n});return e}function ur(n,e,t){var r;let i=(r=l0[n])!==null&&r!==void 0?r:n;t&&(i+=`-${t}`);const s=i.match(/\s|\//),o=e.match(/\s|\//);if(s||o){const l=[`Unable to register library "${i}" with version "${e}":`];s&&l.push(`library name "${i}" contains illegal characters (whitespace or "/")`),s&&o&&l.push("and"),o&&l.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Dn.warn(l.join(" "));return}di(new Or(`${i}-version`,()=>({library:i,version:e}),"VERSION"))}/**
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
 */const h0="firebase-heartbeat-database",f0=1,os="firebase-heartbeat-store";let $a=null;function Vh(){return $a||($a=Py(h0,f0,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(os)}catch(t){console.warn(t)}}}}).catch(n=>{throw cr.create("idb-open",{originalErrorMessage:n.message})})),$a}async function p0(n){try{const t=(await Vh()).transaction(os),r=await t.objectStore(os).get(Fh(n));return await t.done,r}catch(e){if(e instanceof $n)Dn.warn(e.message);else{const t=cr.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Dn.warn(t.message)}}}async function ed(n,e){try{const r=(await Vh()).transaction(os,"readwrite");await r.objectStore(os).put(e,Fh(n)),await r.done}catch(t){if(t instanceof $n)Dn.warn(t.message);else{const r=cr.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});Dn.warn(r.message)}}}function Fh(n){return`${n.name}!${n.options.appId}`}/**
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
 */const m0=1024,g0=30*24*60*60*1e3;class y0{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new w0(t),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,t;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=td();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(o=>o.date===s)?void 0:(this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(o=>{const l=new Date(o.date).valueOf();return Date.now()-l<=g0}),this._storage.overwrite(this._heartbeatsCache))}catch(r){Dn.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=td(),{heartbeatsToSend:r,unsentEntries:i}=v0(this._heartbeatsCache.heartbeats),s=yo(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=t,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(t){return Dn.warn(t),""}}}function td(){return new Date().toISOString().substring(0,10)}function v0(n,e=m0){const t=[];let r=n.slice();for(const i of n){const s=t.find(o=>o.agent===i.agent);if(s){if(s.dates.push(i.date),nd(t)>e){s.dates.pop();break}}else if(t.push({agent:i.agent,dates:[i.date]}),nd(t)>e){t.pop();break}r=r.slice(1)}return{heartbeatsToSend:t,unsentEntries:r}}class w0{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return sy()?oy().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await p0(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const i=await this.read();return ed(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const i=await this.read();return ed(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}else return}}function nd(n){return yo(JSON.stringify({version:2,heartbeats:n})).length}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function b0(n){di(new Or("platform-logger",e=>new Dy(e),"PRIVATE")),di(new Or("heartbeat",e=>new y0(e),"PRIVATE")),ur(tl,Xu,n),ur(tl,Xu,"esm2017"),ur("fire-js","")}b0("");var _0="firebase",E0="10.14.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ur(_0,E0,"app");function Fl(n,e){var t={};for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&e.indexOf(r)<0&&(t[r]=n[r]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,r=Object.getOwnPropertySymbols(n);i<r.length;i++)e.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(n,r[i])&&(t[r[i]]=n[r[i]]);return t}function $h(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const T0=$h,zh=new _s("auth","Firebase",$h());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bo=new Bl("@firebase/auth");function I0(n,...e){bo.logLevel<=oe.WARN&&bo.warn(`Auth (${Ti}): ${n}`,...e)}function io(n,...e){bo.logLevel<=oe.ERROR&&bo.error(`Auth (${Ti}): ${n}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bt(n,...e){throw zl(n,...e)}function jt(n,...e){return zl(n,...e)}function $l(n,e,t){const r=Object.assign(Object.assign({},T0()),{[e]:t});return new _s("auth","Firebase",r).create(e,{appName:n.name})}function kn(n){return $l(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function S0(n,e,t){const r=t;if(!(e instanceof r))throw r.name!==e.constructor.name&&Bt(n,"argument-error"),$l(n,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function zl(n,...e){if(typeof n!="string"){const t=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=n.name),n._errorFactory.create(t,...r)}return zh.create(n,...e)}function j(n,e,...t){if(!n)throw zl(e,...t)}function In(n){const e="INTERNAL ASSERTION FAILED: "+n;throw io(e),new Error(e)}function Ln(n,e){n||In(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function il(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.href)||""}function A0(){return rd()==="http:"||rd()==="https:"}function rd(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function x0(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(A0()||ty()||"connection"in navigator)?navigator.onLine:!0}function R0(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ts{constructor(e,t){this.shortDelay=e,this.longDelay=t,Ln(t>e,"Short delay should be less than long delay!"),this.isMobile=Xg()||ny()}get(){return x0()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ul(n,e){Ln(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uh{static initialize(e,t,r){this.fetchImpl=e,t&&(this.headersImpl=t),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;In("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;In("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;In("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const k0={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const P0=new Ts(3e4,6e4);function zn(n,e){return n.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:n.tenantId}):e}async function dn(n,e,t,r,i={}){return qh(n,i,async()=>{let s={},o={};r&&(e==="GET"?o=r:s={body:JSON.stringify(r)});const l=Es(Object.assign({key:n.config.apiKey},o)).slice(1),c=await n._getAdditionalHeaders();c["Content-Type"]="application/json",n.languageCode&&(c["X-Firebase-Locale"]=n.languageCode);const u=Object.assign({method:e,headers:c},s);return ey()||(u.referrerPolicy="no-referrer"),Uh.fetch()(Hh(n,n.config.apiHost,t,l),u)})}async function qh(n,e,t){n._canInitEmulator=!1;const r=Object.assign(Object.assign({},k0),e);try{const i=new M0(n),s=await Promise.race([t(),i.promise]);i.clearNetworkTimeout();const o=await s.json();if("needConfirmation"in o)throw Xs(n,"account-exists-with-different-credential",o);if(s.ok&&!("errorMessage"in o))return o;{const l=s.ok?o.errorMessage:o.error.message,[c,u]=l.split(" : ");if(c==="FEDERATED_USER_ID_ALREADY_LINKED")throw Xs(n,"credential-already-in-use",o);if(c==="EMAIL_EXISTS")throw Xs(n,"email-already-in-use",o);if(c==="USER_DISABLED")throw Xs(n,"user-disabled",o);const f=r[c]||c.toLowerCase().replace(/[_\s]+/g,"-");if(u)throw $l(n,f,u);Bt(n,f)}}catch(i){if(i instanceof $n)throw i;Bt(n,"network-request-failed",{message:String(i)})}}async function Is(n,e,t,r,i={}){const s=await dn(n,e,t,r,i);return"mfaPendingCredential"in s&&Bt(n,"multi-factor-auth-required",{_serverResponse:s}),s}function Hh(n,e,t,r){const i=`${e}${t}?${r}`;return n.config.emulator?Ul(n.config,i):`${n.config.apiScheme}://${i}`}function C0(n){switch(n){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class M0{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,r)=>{this.timer=setTimeout(()=>r(jt(this.auth,"network-request-failed")),P0.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function Xs(n,e,t){const r={appName:n.name};t.email&&(r.email=t.email),t.phoneNumber&&(r.phoneNumber=t.phoneNumber);const i=jt(n,e,r);return i.customData._tokenResponse=t,i}function id(n){return n!==void 0&&n.enterprise!==void 0}class D0{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return C0(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}}async function L0(n,e){return dn(n,"GET","/v2/recaptchaConfig",zn(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function N0(n,e){return dn(n,"POST","/v1/accounts:delete",e)}async function Yh(n,e){return dn(n,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ji(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function B0(n,e=!1){const t=De(n),r=await t.getIdToken(e),i=ql(r);j(i&&i.exp&&i.auth_time&&i.iat,t.auth,"internal-error");const s=typeof i.firebase=="object"?i.firebase:void 0,o=s==null?void 0:s.sign_in_provider;return{claims:i,token:r,authTime:Ji(za(i.auth_time)),issuedAtTime:Ji(za(i.iat)),expirationTime:Ji(za(i.exp)),signInProvider:o||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function za(n){return Number(n)*1e3}function ql(n){const[e,t,r]=n.split(".");if(e===void 0||t===void 0||r===void 0)return io("JWT malformed, contained fewer than 3 sections"),null;try{const i=Ph(t);return i?JSON.parse(i):(io("Failed to decode base64 JWT payload"),null)}catch(i){return io("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function sd(n){const e=ql(n);return j(e,"internal-error"),j(typeof e.exp<"u","internal-error"),j(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function hi(n,e,t=!1){if(t)return e;try{return await e}catch(r){throw r instanceof $n&&O0(r)&&n.auth.currentUser===n&&await n.auth.signOut(),r}}function O0({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class V0{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const r=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),r}else{this.errorBackoff=3e4;const i=((t=this.user.stsTokenManager.expirationTime)!==null&&t!==void 0?t:0)-Date.now()-3e5;return Math.max(0,i)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sl{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=Ji(this.lastLoginAt),this.creationTime=Ji(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _o(n){var e;const t=n.auth,r=await n.getIdToken(),i=await hi(n,Yh(t,{idToken:r}));j(i==null?void 0:i.users.length,t,"internal-error");const s=i.users[0];n._notifyReloadListener(s);const o=!((e=s.providerUserInfo)===null||e===void 0)&&e.length?jh(s.providerUserInfo):[],l=$0(n.providerData,o),c=n.isAnonymous,u=!(n.email&&s.passwordHash)&&!(l!=null&&l.length),f=c?u:!1,m={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:l,metadata:new sl(s.createdAt,s.lastLoginAt),isAnonymous:f};Object.assign(n,m)}async function F0(n){const e=De(n);await _o(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function $0(n,e){return[...n.filter(r=>!e.some(i=>i.providerId===r.providerId)),...e]}function jh(n){return n.map(e=>{var{providerId:t}=e,r=Fl(e,["providerId"]);return{providerId:t,uid:r.rawId||"",displayName:r.displayName||null,email:r.email||null,phoneNumber:r.phoneNumber||null,photoURL:r.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function z0(n,e){const t=await qh(n,{},async()=>{const r=Es({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=n.config,o=Hh(n,i,"/v1/token",`key=${s}`),l=await n._getAdditionalHeaders();return l["Content-Type"]="application/x-www-form-urlencoded",Uh.fetch()(o,{method:"POST",headers:l,body:r})});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function U0(n,e){return dn(n,"POST","/v2/accounts:revokeToken",zn(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class si{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){j(e.idToken,"internal-error"),j(typeof e.idToken<"u","internal-error"),j(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):sd(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){j(e.length!==0,"internal-error");const t=sd(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(j(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:r,refreshToken:i,expiresIn:s}=await z0(e,t);this.updateTokensAndExpiration(r,i,Number(s))}updateTokensAndExpiration(e,t,r){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,t){const{refreshToken:r,accessToken:i,expirationTime:s}=t,o=new si;return r&&(j(typeof r=="string","internal-error",{appName:e}),o.refreshToken=r),i&&(j(typeof i=="string","internal-error",{appName:e}),o.accessToken=i),s&&(j(typeof s=="number","internal-error",{appName:e}),o.expirationTime=s),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new si,this.toJSON())}_performRefresh(){return In("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zn(n,e){j(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class Sn{constructor(e){var{uid:t,auth:r,stsTokenManager:i}=e,s=Fl(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new V0(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=r,this.stsTokenManager=i,this.accessToken=i.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new sl(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const t=await hi(this,this.stsTokenManager.getToken(this.auth,e));return j(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return B0(this,e)}reload(){return F0(this)}_assign(e){this!==e&&(j(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new Sn(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){j(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),t&&await _o(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Ht(this.auth.app))return Promise.reject(kn(this.auth));const e=await this.getIdToken();return await hi(this,N0(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var r,i,s,o,l,c,u,f;const m=(r=t.displayName)!==null&&r!==void 0?r:void 0,p=(i=t.email)!==null&&i!==void 0?i:void 0,y=(s=t.phoneNumber)!==null&&s!==void 0?s:void 0,I=(o=t.photoURL)!==null&&o!==void 0?o:void 0,S=(l=t.tenantId)!==null&&l!==void 0?l:void 0,x=(c=t._redirectEventId)!==null&&c!==void 0?c:void 0,k=(u=t.createdAt)!==null&&u!==void 0?u:void 0,C=(f=t.lastLoginAt)!==null&&f!==void 0?f:void 0,{uid:N,emailVerified:B,isAnonymous:$,providerData:q,stsTokenManager:T}=t;j(N&&T,e,"internal-error");const v=si.fromJSON(this.name,T);j(typeof N=="string",e,"internal-error"),Zn(m,e.name),Zn(p,e.name),j(typeof B=="boolean",e,"internal-error"),j(typeof $=="boolean",e,"internal-error"),Zn(y,e.name),Zn(I,e.name),Zn(S,e.name),Zn(x,e.name),Zn(k,e.name),Zn(C,e.name);const _=new Sn({uid:N,auth:e,email:p,emailVerified:B,displayName:m,isAnonymous:$,photoURL:I,phoneNumber:y,tenantId:S,stsTokenManager:v,createdAt:k,lastLoginAt:C});return q&&Array.isArray(q)&&(_.providerData=q.map(b=>Object.assign({},b))),x&&(_._redirectEventId=x),_}static async _fromIdTokenResponse(e,t,r=!1){const i=new si;i.updateFromServerResponse(t);const s=new Sn({uid:t.localId,auth:e,stsTokenManager:i,isAnonymous:r});return await _o(s),s}static async _fromGetAccountInfoResponse(e,t,r){const i=t.users[0];j(i.localId!==void 0,"internal-error");const s=i.providerUserInfo!==void 0?jh(i.providerUserInfo):[],o=!(i.email&&i.passwordHash)&&!(s!=null&&s.length),l=new si;l.updateFromIdToken(r);const c=new Sn({uid:i.localId,auth:e,stsTokenManager:l,isAnonymous:o}),u={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new sl(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(s!=null&&s.length)};return Object.assign(c,u),c}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const od=new Map;function An(n){Ln(n instanceof Function,"Expected a class definition");let e=od.get(n);return e?(Ln(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,od.set(n,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wh{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}Wh.type="NONE";const ad=Wh;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function so(n,e,t){return`firebase:${n}:${e}:${t}`}class oi{constructor(e,t,r){this.persistence=e,this.auth=t,this.userKey=r;const{config:i,name:s}=this.auth;this.fullUserKey=so(this.userKey,i.apiKey,s),this.fullPersistenceKey=so("persistence",i.apiKey,s),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?Sn._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,r="authUser"){if(!t.length)return new oi(An(ad),e,r);const i=(await Promise.all(t.map(async u=>{if(await u._isAvailable())return u}))).filter(u=>u);let s=i[0]||An(ad);const o=so(r,e.config.apiKey,e.name);let l=null;for(const u of t)try{const f=await u._get(o);if(f){const m=Sn._fromJSON(e,f);u!==s&&(l=m),s=u;break}}catch{}const c=i.filter(u=>u._shouldAllowMigration);return!s._shouldAllowMigration||!c.length?new oi(s,e,r):(s=c[0],l&&await s._set(o,l.toJSON()),await Promise.all(t.map(async u=>{if(u!==s)try{await u._remove(o)}catch{}})),new oi(s,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ld(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Jh(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Gh(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Zh(e))return"Blackberry";if(ef(e))return"Webos";if(Kh(e))return"Safari";if((e.includes("chrome/")||Qh(e))&&!e.includes("edge/"))return"Chrome";if(Xh(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=n.match(t);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function Gh(n=ot()){return/firefox\//i.test(n)}function Kh(n=ot()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Qh(n=ot()){return/crios\//i.test(n)}function Jh(n=ot()){return/iemobile/i.test(n)}function Xh(n=ot()){return/android/i.test(n)}function Zh(n=ot()){return/blackberry/i.test(n)}function ef(n=ot()){return/webos/i.test(n)}function Hl(n=ot()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function q0(n=ot()){var e;return Hl(n)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function H0(){return ry()&&document.documentMode===10}function tf(n=ot()){return Hl(n)||Xh(n)||ef(n)||Zh(n)||/windows phone/i.test(n)||Jh(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nf(n,e=[]){let t;switch(n){case"Browser":t=ld(ot());break;case"Worker":t=`${ld(ot())}-${n}`;break;default:t=n}const r=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${Ti}/${r}`}/**
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
 */class Y0{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const r=s=>new Promise((o,l)=>{try{const c=e(s);o(c)}catch(c){l(c)}});r.onAbort=t,this.queue.push(r);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const r of this.queue)await r(e),r.onAbort&&t.push(r.onAbort)}catch(r){t.reverse();for(const i of t)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
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
 */async function j0(n,e={}){return dn(n,"GET","/v2/passwordPolicy",zn(n,e))}/**
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
 */const W0=6;class G0{constructor(e){var t,r,i,s;const o=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(t=o.minPasswordLength)!==null&&t!==void 0?t:W0,o.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=o.maxPasswordLength),o.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=o.containsLowercaseCharacter),o.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=o.containsUppercaseCharacter),o.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=o.containsNumericCharacter),o.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=o.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(i=(r=e.allowedNonAlphanumericCharacters)===null||r===void 0?void 0:r.join(""))!==null&&i!==void 0?i:"",this.forceUpgradeOnSignin=(s=e.forceUpgradeOnSignin)!==null&&s!==void 0?s:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,r,i,s,o,l;const c={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,c),this.validatePasswordCharacterOptions(e,c),c.isValid&&(c.isValid=(t=c.meetsMinPasswordLength)!==null&&t!==void 0?t:!0),c.isValid&&(c.isValid=(r=c.meetsMaxPasswordLength)!==null&&r!==void 0?r:!0),c.isValid&&(c.isValid=(i=c.containsLowercaseLetter)!==null&&i!==void 0?i:!0),c.isValid&&(c.isValid=(s=c.containsUppercaseLetter)!==null&&s!==void 0?s:!0),c.isValid&&(c.isValid=(o=c.containsNumericCharacter)!==null&&o!==void 0?o:!0),c.isValid&&(c.isValid=(l=c.containsNonAlphanumericCharacter)!==null&&l!==void 0?l:!0),c}validatePasswordLengthOptions(e,t){const r=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;r&&(t.meetsMinPasswordLength=e.length>=r),i&&(t.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let r;for(let i=0;i<e.length;i++)r=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(t,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,t,r,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class K0{constructor(e,t,r,i){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=r,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new cd(this),this.idTokenSubscription=new cd(this),this.beforeStateQueue=new Y0(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=zh,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=An(t)),this._initializationPromise=this.queue(async()=>{var r,i;if(!this._deleted&&(this.persistenceManager=await oi.create(this,e),!this._deleted)){if(!((r=this._popupRedirectResolver)===null||r===void 0)&&r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((i=this.currentUser)===null||i===void 0?void 0:i.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await Yh(this,{idToken:e}),r=await Sn._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(r)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(Ht(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(l=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(l,l))}):this.directlySetCurrentUser(null)}const r=await this.assertedPersistence.getCurrentUser();let i=r,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,l=i==null?void 0:i._redirectEventId,c=await this.tryRedirectSignIn(e);(!o||o===l)&&(c!=null&&c.user)&&(i=c.user,s=!0)}if(!i)return this.directlySetCurrentUser(null);if(!i._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(i)}catch(o){i=r,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return i?this.reloadAndSetCurrentUserOrClear(i):this.directlySetCurrentUser(null)}return j(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===i._redirectEventId?this.directlySetCurrentUser(i):this.reloadAndSetCurrentUserOrClear(i)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await _o(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=R0()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Ht(this.app))return Promise.reject(kn(this));const t=e?De(e):null;return t&&j(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&j(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Ht(this.app)?Promise.reject(kn(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Ht(this.app)?Promise.reject(kn(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(An(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await j0(this),t=new G0(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new _s("auth","Firebase",e())}onAuthStateChanged(e,t,r){return this.registerStateListener(this.authStateSubscription,e,t,r)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,r){return this.registerStateListener(this.idTokenSubscription,e,t,r)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(r.tenantId=this.tenantId),await U0(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){const r=await this.getOrInitRedirectPersistenceManager(t);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&An(e)||this._popupRedirectResolver;j(t,this,"argument-error"),this.redirectPersistenceManager=await oi.create(this,[An(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,r;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((r=this.redirectUser)===null||r===void 0?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const r=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==r&&(this.lastNotifiedUid=r,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,r,i){if(this._deleted)return()=>{};const s=typeof t=="function"?t:t.next.bind(t);let o=!1;const l=this._isInitialized?Promise.resolve():this._initializationPromise;if(j(l,this,"internal-error"),l.then(()=>{o||s(this.currentUser)}),typeof t=="function"){const c=e.addObserver(t,r,i);return()=>{o=!0,c()}}else{const c=e.addObserver(t);return()=>{o=!0,c()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return j(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=nf(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const r=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());r&&(t["X-Firebase-Client"]=r);const i=await this._getAppCheckToken();return i&&(t["X-Firebase-AppCheck"]=i),t}async _getAppCheckToken(){var e;const t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t!=null&&t.error&&I0(`Error while retrieving App Check token: ${t.error}`),t==null?void 0:t.token}}function Un(n){return De(n)}class cd{constructor(e){this.auth=e,this.observer=null,this.addObserver=dy(t=>this.observer=t)}get next(){return j(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Yo={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Q0(n){Yo=n}function rf(n){return Yo.loadJS(n)}function J0(){return Yo.recaptchaEnterpriseScript}function X0(){return Yo.gapiScript}function Z0(n){return`__${n}${Math.floor(Math.random()*1e6)}`}const ev="recaptcha-enterprise",tv="NO_RECAPTCHA";class nv{constructor(e){this.type=ev,this.auth=Un(e)}async verify(e="verify",t=!1){async function r(s){if(!t){if(s.tenantId==null&&s._agentRecaptchaConfig!=null)return s._agentRecaptchaConfig.siteKey;if(s.tenantId!=null&&s._tenantRecaptchaConfigs[s.tenantId]!==void 0)return s._tenantRecaptchaConfigs[s.tenantId].siteKey}return new Promise(async(o,l)=>{L0(s,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(c=>{if(c.recaptchaKey===void 0)l(new Error("recaptcha Enterprise site key undefined"));else{const u=new D0(c);return s.tenantId==null?s._agentRecaptchaConfig=u:s._tenantRecaptchaConfigs[s.tenantId]=u,o(u.siteKey)}}).catch(c=>{l(c)})})}function i(s,o,l){const c=window.grecaptcha;id(c)?c.enterprise.ready(()=>{c.enterprise.execute(s,{action:e}).then(u=>{o(u)}).catch(()=>{o(tv)})}):l(Error("No reCAPTCHA enterprise script loaded."))}return new Promise((s,o)=>{r(this.auth).then(l=>{if(!t&&id(window.grecaptcha))i(l,s,o);else{if(typeof window>"u"){o(new Error("RecaptchaVerifier is only supported in browser"));return}let c=J0();c.length!==0&&(c+=l),rf(c).then(()=>{i(l,s,o)}).catch(u=>{o(u)})}}).catch(l=>{o(l)})})}}async function ud(n,e,t,r=!1){const i=new nv(n);let s;try{s=await i.verify(t)}catch{s=await i.verify(t,!0)}const o=Object.assign({},e);return r?Object.assign(o,{captchaResp:s}):Object.assign(o,{captchaResponse:s}),Object.assign(o,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(o,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),o}async function Eo(n,e,t,r){var i;if(!((i=n._getRecaptchaConfig())===null||i===void 0)&&i.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const s=await ud(n,e,t,t==="getOobCode");return r(n,s)}else return r(n,e).catch(async s=>{if(s.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const o=await ud(n,e,t,t==="getOobCode");return r(n,o)}else return Promise.reject(s)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rv(n,e){const t=Vl(n,"auth");if(t.isInitialized()){const i=t.getImmediate(),s=t.getOptions();if(vo(s,e??{}))return i;Bt(i,"already-initialized")}return t.initialize({options:e})}function iv(n,e){const t=(e==null?void 0:e.persistence)||[],r=(Array.isArray(t)?t:[t]).map(An);e!=null&&e.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function sv(n,e,t){const r=Un(n);j(r._canInitEmulator,r,"emulator-config-failed"),j(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const i=!1,s=sf(e),{host:o,port:l}=ov(e),c=l===null?"":`:${l}`;r.config.emulator={url:`${s}//${o}${c}/`},r.settings.appVerificationDisabledForTesting=!0,r.emulatorConfig=Object.freeze({host:o,port:l,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})}),av()}function sf(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function ov(n){const e=sf(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const r=t[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const s=i[1];return{host:s,port:dd(r.substr(s.length+1))}}else{const[s,o]=r.split(":");return{host:s,port:dd(o)}}}function dd(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function av(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yl{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return In("not implemented")}_getIdTokenResponse(e){return In("not implemented")}_linkToIdToken(e,t){return In("not implemented")}_getReauthenticationResolver(e){return In("not implemented")}}async function lv(n,e){return dn(n,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function cv(n,e){return Is(n,"POST","/v1/accounts:signInWithPassword",zn(n,e))}async function of(n,e){return dn(n,"POST","/v1/accounts:sendOobCode",zn(n,e))}async function uv(n,e){return of(n,e)}async function dv(n,e){return of(n,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function hv(n,e){return Is(n,"POST","/v1/accounts:signInWithEmailLink",zn(n,e))}async function fv(n,e){return Is(n,"POST","/v1/accounts:signInWithEmailLink",zn(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class as extends Yl{constructor(e,t,r,i=null){super("password",r),this._email=e,this._password=t,this._tenantId=i}static _fromEmailAndPassword(e,t){return new as(e,t,"password")}static _fromEmailAndCode(e,t,r=null){return new as(e,t,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;if(t!=null&&t.email&&(t!=null&&t.password)){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Eo(e,t,"signInWithPassword",cv);case"emailLink":return hv(e,{email:this._email,oobCode:this._password});default:Bt(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":const r={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Eo(e,r,"signUpPassword",lv);case"emailLink":return fv(e,{idToken:t,email:this._email,oobCode:this._password});default:Bt(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ai(n,e){return Is(n,"POST","/v1/accounts:signInWithIdp",zn(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pv="http://localhost";class Vr extends Yl{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new Vr(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):Bt("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:i}=t,s=Fl(t,["providerId","signInMethod"]);if(!r||!i)return null;const o=new Vr(r,i);return o.idToken=s.idToken||void 0,o.accessToken=s.accessToken||void 0,o.secret=s.secret,o.nonce=s.nonce,o.pendingToken=s.pendingToken||null,o}_getIdTokenResponse(e){const t=this.buildRequest();return ai(e,t)}_linkToIdToken(e,t){const r=this.buildRequest();return r.idToken=t,ai(e,r)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,ai(e,t)}buildRequest(){const e={requestUri:pv,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=Es(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mv(n){switch(n){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function gv(n){const e=Hi(Yi(n)).link,t=e?Hi(Yi(e)).deep_link_id:null,r=Hi(Yi(n)).deep_link_id;return(r?Hi(Yi(r)).link:null)||r||t||e||n}class jl{constructor(e){var t,r,i,s,o,l;const c=Hi(Yi(e)),u=(t=c.apiKey)!==null&&t!==void 0?t:null,f=(r=c.oobCode)!==null&&r!==void 0?r:null,m=mv((i=c.mode)!==null&&i!==void 0?i:null);j(u&&f&&m,"argument-error"),this.apiKey=u,this.operation=m,this.code=f,this.continueUrl=(s=c.continueUrl)!==null&&s!==void 0?s:null,this.languageCode=(o=c.languageCode)!==null&&o!==void 0?o:null,this.tenantId=(l=c.tenantId)!==null&&l!==void 0?l:null}static parseLink(e){const t=gv(e);try{return new jl(t)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ii{constructor(){this.providerId=Ii.PROVIDER_ID}static credential(e,t){return as._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const r=jl.parseLink(t);return j(r,"argument-error"),as._fromEmailAndCode(e,r.code,r.tenantId)}}Ii.PROVIDER_ID="password";Ii.EMAIL_PASSWORD_SIGN_IN_METHOD="password";Ii.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wl{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ss extends Wl{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tr extends Ss{constructor(){super("facebook.com")}static credential(e){return Vr._fromParams({providerId:tr.PROVIDER_ID,signInMethod:tr.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return tr.credentialFromTaggedObject(e)}static credentialFromError(e){return tr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return tr.credential(e.oauthAccessToken)}catch{return null}}}tr.FACEBOOK_SIGN_IN_METHOD="facebook.com";tr.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tn extends Ss{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return Vr._fromParams({providerId:Tn.PROVIDER_ID,signInMethod:Tn.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Tn.credentialFromTaggedObject(e)}static credentialFromError(e){return Tn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:r}=e;if(!t&&!r)return null;try{return Tn.credential(t,r)}catch{return null}}}Tn.GOOGLE_SIGN_IN_METHOD="google.com";Tn.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nr extends Ss{constructor(){super("github.com")}static credential(e){return Vr._fromParams({providerId:nr.PROVIDER_ID,signInMethod:nr.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return nr.credentialFromTaggedObject(e)}static credentialFromError(e){return nr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return nr.credential(e.oauthAccessToken)}catch{return null}}}nr.GITHUB_SIGN_IN_METHOD="github.com";nr.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rr extends Ss{constructor(){super("twitter.com")}static credential(e,t){return Vr._fromParams({providerId:rr.PROVIDER_ID,signInMethod:rr.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return rr.credentialFromTaggedObject(e)}static credentialFromError(e){return rr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:r}=e;if(!t||!r)return null;try{return rr.credential(t,r)}catch{return null}}}rr.TWITTER_SIGN_IN_METHOD="twitter.com";rr.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function yv(n,e){return Is(n,"POST","/v1/accounts:signUp",zn(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fr{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,r,i=!1){const s=await Sn._fromIdTokenResponse(e,r,i),o=hd(r);return new Fr({user:s,providerId:o,_tokenResponse:r,operationType:t})}static async _forOperation(e,t,r){await e._updateTokensIfNecessary(r,!0);const i=hd(r);return new Fr({user:e,providerId:i,_tokenResponse:r,operationType:t})}}function hd(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class To extends $n{constructor(e,t,r,i){var s;super(t.code,t.message),this.operationType=r,this.user=i,Object.setPrototypeOf(this,To.prototype),this.customData={appName:e.name,tenantId:(s=e.tenantId)!==null&&s!==void 0?s:void 0,_serverResponse:t.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,t,r,i){return new To(e,t,r,i)}}function af(n,e,t,r){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?To._fromErrorAndOperation(n,s,e,r):s})}async function vv(n,e,t=!1){const r=await hi(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return Fr._forOperation(n,"link",r)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function wv(n,e,t=!1){const{auth:r}=n;if(Ht(r.app))return Promise.reject(kn(r));const i="reauthenticate";try{const s=await hi(n,af(r,i,e,n),t);j(s.idToken,r,"internal-error");const o=ql(s.idToken);j(o,r,"internal-error");const{sub:l}=o;return j(n.uid===l,r,"user-mismatch"),Fr._forOperation(n,i,s)}catch(s){throw(s==null?void 0:s.code)==="auth/user-not-found"&&Bt(r,"user-mismatch"),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function lf(n,e,t=!1){if(Ht(n.app))return Promise.reject(kn(n));const r="signIn",i=await af(n,r,e),s=await Fr._fromIdTokenResponse(n,r,i);return t||await n._updateCurrentUser(s.user),s}async function bv(n,e){return lf(Un(n),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function cf(n){const e=Un(n);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function _v(n,e,t){const r=Un(n);await Eo(r,{requestType:"PASSWORD_RESET",email:e,clientType:"CLIENT_TYPE_WEB"},"getOobCode",dv)}async function Ev(n,e,t){if(Ht(n.app))return Promise.reject(kn(n));const r=Un(n),o=await Eo(r,{returnSecureToken:!0,email:e,password:t,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",yv).catch(c=>{throw c.code==="auth/password-does-not-meet-requirements"&&cf(n),c}),l=await Fr._fromIdTokenResponse(r,"signIn",o);return await r._updateCurrentUser(l.user),l}function Tv(n,e,t){return Ht(n.app)?Promise.reject(kn(n)):bv(De(n),Ii.credential(e,t)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&cf(n),r})}async function uf(n,e){const t=De(n),i={requestType:"VERIFY_EMAIL",idToken:await n.getIdToken()},{email:s}=await uv(t.auth,i);s!==n.email&&await n.reload()}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Iv(n,e){return dn(n,"POST","/v1/accounts:update",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Sv(n,{displayName:e,photoURL:t}){if(e===void 0&&t===void 0)return;const r=De(n),s={idToken:await r.getIdToken(),displayName:e,photoUrl:t,returnSecureToken:!0},o=await hi(r,Iv(r.auth,s));r.displayName=o.displayName||null,r.photoURL=o.photoUrl||null;const l=r.providerData.find(({providerId:c})=>c==="password");l&&(l.displayName=r.displayName,l.photoURL=r.photoURL),await r._updateTokensIfNecessary(o)}function Av(n,e,t,r){return De(n).onIdTokenChanged(e,t,r)}function xv(n,e,t){return De(n).beforeAuthStateChanged(e,t)}function Rv(n,e,t,r){return De(n).onAuthStateChanged(e,t,r)}function kv(n){return De(n).signOut()}async function Pv(n){return De(n).delete()}const Io="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class df{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Io,"1"),this.storage.removeItem(Io),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cv=1e3,Mv=10;class hf extends df{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=tf(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const r=this.storage.getItem(t),i=this.localCache[t];r!==i&&e(t,i,r)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((o,l,c)=>{this.notifyListeners(o,c)});return}const r=e.key;t?this.detachListener():this.stopPolling();const i=()=>{const o=this.storage.getItem(r);!t&&this.localCache[r]===o||this.notifyListeners(r,o)},s=this.storage.getItem(r);H0()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,Mv):i()}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:r}),!0)})},Cv)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}hf.type="LOCAL";const Dv=hf;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ff extends df{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}ff.type="SESSION";const pf=ff;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Lv(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jo{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(i=>i.isListeningto(e));if(t)return t;const r=new jo(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:r,eventType:i,data:s}=t.data,o=this.handlersMap[i];if(!(o!=null&&o.size))return;t.ports[0].postMessage({status:"ack",eventId:r,eventType:i});const l=Array.from(o).map(async u=>u(t.origin,s)),c=await Lv(l);t.ports[0].postMessage({status:"done",eventId:r,eventType:i,response:c})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}jo.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gl(n="",e=10){let t="";for(let r=0;r<e;r++)t+=Math.floor(Math.random()*10);return n+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nv{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,r=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,o;return new Promise((l,c)=>{const u=Gl("",20);i.port1.start();const f=setTimeout(()=>{c(new Error("unsupported_event"))},r);o={messageChannel:i,onMessage(m){const p=m;if(p.data.eventId===u)switch(p.data.status){case"ack":clearTimeout(f),s=setTimeout(()=>{c(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),l(p.data.response);break;default:clearTimeout(f),clearTimeout(s),c(new Error("invalid_response"));break}}},this.handlers.add(o),i.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:u,data:t},[i.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sn(){return window}function Bv(n){sn().location.href=n}/**
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
 */function mf(){return typeof sn().WorkerGlobalScope<"u"&&typeof sn().importScripts=="function"}async function Ov(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function Vv(){var n;return((n=navigator==null?void 0:navigator.serviceWorker)===null||n===void 0?void 0:n.controller)||null}function Fv(){return mf()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gf="firebaseLocalStorageDb",$v=1,So="firebaseLocalStorage",yf="fbase_key";class As{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function Wo(n,e){return n.transaction([So],e?"readwrite":"readonly").objectStore(So)}function zv(){const n=indexedDB.deleteDatabase(gf);return new As(n).toPromise()}function ol(){const n=indexedDB.open(gf,$v);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const r=n.result;try{r.createObjectStore(So,{keyPath:yf})}catch(i){t(i)}}),n.addEventListener("success",async()=>{const r=n.result;r.objectStoreNames.contains(So)?e(r):(r.close(),await zv(),e(await ol()))})})}async function fd(n,e,t){const r=Wo(n,!0).put({[yf]:e,value:t});return new As(r).toPromise()}async function Uv(n,e){const t=Wo(n,!1).get(e),r=await new As(t).toPromise();return r===void 0?null:r.value}function pd(n,e){const t=Wo(n,!0).delete(e);return new As(t).toPromise()}const qv=800,Hv=3;class vf{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await ol(),this.db)}async _withRetries(e){let t=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(t++>Hv)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return mf()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=jo._getInstance(Fv()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await Ov(),!this.activeServiceWorker)return;this.sender=new Nv(this.activeServiceWorker);const r=await this.sender._send("ping",{},800);r&&!((e=r[0])===null||e===void 0)&&e.fulfilled&&!((t=r[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||Vv()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await ol();return await fd(e,Io,"1"),await pd(e,Io),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(r=>fd(r,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(r=>Uv(r,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>pd(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(i=>{const s=Wo(i,!1).getAll();return new As(s).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],r=new Set;if(e.length!==0)for(const{fbase_key:i,value:s}of e)r.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),t.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!r.has(i)&&(this.notifyListeners(i,null),t.push(i));return t}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),qv)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}vf.type="LOCAL";const Yv=vf;new Ts(3e4,6e4);/**
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
 */function wf(n,e){return e?An(e):(j(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kl extends Yl{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return ai(e,this._buildIdpRequest())}_linkToIdToken(e,t){return ai(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return ai(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function jv(n){return lf(n.auth,new Kl(n),n.bypassAuthState)}function Wv(n){const{auth:e,user:t}=n;return j(t,e,"internal-error"),wv(t,new Kl(n),n.bypassAuthState)}async function Gv(n){const{auth:e,user:t}=n;return j(t,e,"internal-error"),vv(t,new Kl(n),n.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bf{constructor(e,t,r,i,s=!1){this.auth=e,this.resolver=r,this.user=i,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:r,postBody:i,tenantId:s,error:o,type:l}=e;if(o){this.reject(o);return}const c={auth:this.auth,requestUri:t,sessionId:r,tenantId:s||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(l)(c))}catch(u){this.reject(u)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return jv;case"linkViaPopup":case"linkViaRedirect":return Gv;case"reauthViaPopup":case"reauthViaRedirect":return Wv;default:Bt(this.auth,"internal-error")}}resolve(e){Ln(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Ln(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kv=new Ts(2e3,1e4);async function Qv(n,e,t){if(Ht(n.app))return Promise.reject(jt(n,"operation-not-supported-in-this-environment"));const r=Un(n);S0(n,e,Wl);const i=wf(r,t);return new kr(r,"signInViaPopup",e,i).executeNotNull()}class kr extends bf{constructor(e,t,r,i,s){super(e,t,i,s),this.provider=r,this.authWindow=null,this.pollId=null,kr.currentPopupAction&&kr.currentPopupAction.cancel(),kr.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return j(e,this.auth,"internal-error"),e}async onExecution(){Ln(this.filter.length===1,"Popup operations only handle one event");const e=Gl();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(jt(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(jt(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,kr.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,r;if(!((r=(t=this.authWindow)===null||t===void 0?void 0:t.window)===null||r===void 0)&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(jt(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,Kv.get())};e()}}kr.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jv="pendingRedirect",oo=new Map;class Xv extends bf{constructor(e,t,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,r),this.eventId=null}async execute(){let e=oo.get(this.auth._key());if(!e){try{const r=await Zv(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(t){e=()=>Promise.reject(t)}oo.set(this.auth._key(),e)}return this.bypassAuthState||oo.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Zv(n,e){const t=nw(e),r=tw(n);if(!await r._isAvailable())return!1;const i=await r._get(t)==="true";return await r._remove(t),i}function ew(n,e){oo.set(n._key(),e)}function tw(n){return An(n._redirectPersistence)}function nw(n){return so(Jv,n.config.apiKey,n.name)}async function rw(n,e,t=!1){if(Ht(n.app))return Promise.reject(kn(n));const r=Un(n),i=wf(r,e),o=await new Xv(r,i,t).execute();return o&&!t&&(delete o.user._redirectEventId,await r._persistUserIfCurrent(o.user),await r._setRedirectUser(null,e)),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const iw=10*60*1e3;class sw{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(t=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!ow(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var r;if(e.error&&!_f(e)){const i=((r=e.error.code)===null||r===void 0?void 0:r.split("auth/")[1])||"internal-error";t.onError(jt(this.auth,i))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const r=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=iw&&this.cachedEventUids.clear(),this.cachedEventUids.has(md(e))}saveEventToCache(e){this.cachedEventUids.add(md(e)),this.lastProcessedEventTime=Date.now()}}function md(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function _f({type:n,error:e}){return n==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function ow(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return _f(n);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function aw(n,e={}){return dn(n,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lw=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,cw=/^https?/;async function uw(n){if(n.config.emulator)return;const{authorizedDomains:e}=await aw(n);for(const t of e)try{if(dw(t))return}catch{}Bt(n,"unauthorized-domain")}function dw(n){const e=il(),{protocol:t,hostname:r}=new URL(e);if(n.startsWith("chrome-extension://")){const o=new URL(n);return o.hostname===""&&r===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&o.hostname===r}if(!cw.test(t))return!1;if(lw.test(n))return r===n;const i=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}/**
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
 */const hw=new Ts(3e4,6e4);function gd(){const n=sn().___jsl;if(n!=null&&n.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function fw(n){return new Promise((e,t)=>{var r,i,s;function o(){gd(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{gd(),t(jt(n,"network-request-failed"))},timeout:hw.get()})}if(!((i=(r=sn().gapi)===null||r===void 0?void 0:r.iframes)===null||i===void 0)&&i.Iframe)e(gapi.iframes.getContext());else if(!((s=sn().gapi)===null||s===void 0)&&s.load)o();else{const l=Z0("iframefcb");return sn()[l]=()=>{gapi.load?o():t(jt(n,"network-request-failed"))},rf(`${X0()}?onload=${l}`).catch(c=>t(c))}}).catch(e=>{throw ao=null,e})}let ao=null;function pw(n){return ao=ao||fw(n),ao}/**
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
 */const mw=new Ts(5e3,15e3),gw="__/auth/iframe",yw="emulator/auth/iframe",vw={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},ww=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function bw(n){const e=n.config;j(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?Ul(e,yw):`https://${n.config.authDomain}/${gw}`,r={apiKey:e.apiKey,appName:n.name,v:Ti},i=ww.get(n.config.apiHost);i&&(r.eid=i);const s=n._getFrameworks();return s.length&&(r.fw=s.join(",")),`${t}?${Es(r).slice(1)}`}async function _w(n){const e=await pw(n),t=sn().gapi;return j(t,n,"internal-error"),e.open({where:document.body,url:bw(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:vw,dontclear:!0},r=>new Promise(async(i,s)=>{await r.restyle({setHideOnLeave:!1});const o=jt(n,"network-request-failed"),l=sn().setTimeout(()=>{s(o)},mw.get());function c(){sn().clearTimeout(l),i(r)}r.ping(c).then(c,()=>{s(o)})}))}/**
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
 */const Ew={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Tw=500,Iw=600,Sw="_blank",Aw="http://localhost";class yd{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function xw(n,e,t,r=Tw,i=Iw){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),o=Math.max((window.screen.availWidth-r)/2,0).toString();let l="";const c=Object.assign(Object.assign({},Ew),{width:r.toString(),height:i.toString(),top:s,left:o}),u=ot().toLowerCase();t&&(l=Qh(u)?Sw:t),Gh(u)&&(e=e||Aw,c.scrollbars="yes");const f=Object.entries(c).reduce((p,[y,I])=>`${p}${y}=${I},`,"");if(q0(u)&&l!=="_self")return Rw(e||"",l),new yd(null);const m=window.open(e||"",l,f);j(m,n,"popup-blocked");try{m.focus()}catch{}return new yd(m)}function Rw(n,e){const t=document.createElement("a");t.href=n,t.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(r)}/**
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
 */const kw="__/auth/handler",Pw="emulator/auth/handler",Cw=encodeURIComponent("fac");async function vd(n,e,t,r,i,s){j(n.config.authDomain,n,"auth-domain-config-required"),j(n.config.apiKey,n,"invalid-api-key");const o={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:r,v:Ti,eventId:i};if(e instanceof Wl){e.setDefaultLanguage(n.languageCode),o.providerId=e.providerId||"",uy(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[f,m]of Object.entries({}))o[f]=m}if(e instanceof Ss){const f=e.getScopes().filter(m=>m!=="");f.length>0&&(o.scopes=f.join(","))}n.tenantId&&(o.tid=n.tenantId);const l=o;for(const f of Object.keys(l))l[f]===void 0&&delete l[f];const c=await n._getAppCheckToken(),u=c?`#${Cw}=${encodeURIComponent(c)}`:"";return`${Mw(n)}?${Es(l).slice(1)}${u}`}function Mw({config:n}){return n.emulator?Ul(n,Pw):`https://${n.authDomain}/${kw}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ua="webStorageSupport";class Dw{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=pf,this._completeRedirectFn=rw,this._overrideRedirectResult=ew}async _openPopup(e,t,r,i){var s;Ln((s=this.eventManagers[e._key()])===null||s===void 0?void 0:s.manager,"_initialize() not called before _openPopup()");const o=await vd(e,t,r,il(),i);return xw(e,o,Gl())}async _openRedirect(e,t,r,i){await this._originValidation(e);const s=await vd(e,t,r,il(),i);return Bv(s),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:i,promise:s}=this.eventManagers[t];return i?Promise.resolve(i):(Ln(s,"If manager is not set, promise should be"),s)}const r=this.initAndGetManager(e);return this.eventManagers[t]={promise:r},r.catch(()=>{delete this.eventManagers[t]}),r}async initAndGetManager(e){const t=await _w(e),r=new sw(e);return t.register("authEvent",i=>(j(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:r.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=t,r}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Ua,{type:Ua},i=>{var s;const o=(s=i==null?void 0:i[0])===null||s===void 0?void 0:s[Ua];o!==void 0&&t(!!o),Bt(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=uw(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return tf()||Kh()||Hl()}}const Lw=Dw;var wd="@firebase/auth",bd="1.7.9";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nw{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){j(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bw(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function Ow(n){di(new Or("auth",(e,{options:t})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:o,authDomain:l}=r.options;j(o&&!o.includes(":"),"invalid-api-key",{appName:r.name});const c={apiKey:o,authDomain:l,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:nf(n)},u=new K0(r,i,s,c);return iv(u,t),u},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,r)=>{e.getProvider("auth-internal").initialize()})),di(new Or("auth-internal",e=>{const t=Un(e.getProvider("auth").getImmediate());return(r=>new Nw(r))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),ur(wd,bd,Bw(n)),ur(wd,bd,"esm2017")}/**
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
 */const Vw=5*60,Fw=Dh("authIdTokenMaxAge")||Vw;let _d=null;const $w=n=>async e=>{const t=e&&await e.getIdTokenResult(),r=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(r&&r>Fw)return;const i=t==null?void 0:t.token;_d!==i&&(_d=i,await fetch(n,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function zw(n=Oh()){const e=Vl(n,"auth");if(e.isInitialized())return e.getImmediate();const t=rv(n,{popupRedirectResolver:Lw,persistence:[Yv,Dv,pf]}),r=Dh("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(r,location.origin);if(location.origin===s.origin){const o=$w(s.toString());xv(t,o,()=>o(t.currentUser)),Av(t,l=>o(l))}}const i=Ch("auth");return i&&sv(t,`http://${i}`),t}function Uw(){var n,e;return(e=(n=document.getElementsByTagName("head"))===null||n===void 0?void 0:n[0])!==null&&e!==void 0?e:document}Q0({loadJS(n){return new Promise((e,t)=>{const r=document.createElement("script");r.setAttribute("src",n),r.onload=e,r.onerror=i=>{const s=jt("internal-error");s.customData=i,t(s)},r.type="text/javascript",r.charset="UTF-8",Uw().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});Ow("Browser");var Ed=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Lr,Ef;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(T,v){function _(){}_.prototype=v.prototype,T.D=v.prototype,T.prototype=new _,T.prototype.constructor=T,T.C=function(b,E,A){for(var w=Array(arguments.length-2),le=2;le<arguments.length;le++)w[le-2]=arguments[le];return v.prototype[E].apply(b,w)}}function t(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(r,t),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function i(T,v,_){_||(_=0);var b=Array(16);if(typeof v=="string")for(var E=0;16>E;++E)b[E]=v.charCodeAt(_++)|v.charCodeAt(_++)<<8|v.charCodeAt(_++)<<16|v.charCodeAt(_++)<<24;else for(E=0;16>E;++E)b[E]=v[_++]|v[_++]<<8|v[_++]<<16|v[_++]<<24;v=T.g[0],_=T.g[1],E=T.g[2];var A=T.g[3],w=v+(A^_&(E^A))+b[0]+3614090360&4294967295;v=_+(w<<7&4294967295|w>>>25),w=A+(E^v&(_^E))+b[1]+3905402710&4294967295,A=v+(w<<12&4294967295|w>>>20),w=E+(_^A&(v^_))+b[2]+606105819&4294967295,E=A+(w<<17&4294967295|w>>>15),w=_+(v^E&(A^v))+b[3]+3250441966&4294967295,_=E+(w<<22&4294967295|w>>>10),w=v+(A^_&(E^A))+b[4]+4118548399&4294967295,v=_+(w<<7&4294967295|w>>>25),w=A+(E^v&(_^E))+b[5]+1200080426&4294967295,A=v+(w<<12&4294967295|w>>>20),w=E+(_^A&(v^_))+b[6]+2821735955&4294967295,E=A+(w<<17&4294967295|w>>>15),w=_+(v^E&(A^v))+b[7]+4249261313&4294967295,_=E+(w<<22&4294967295|w>>>10),w=v+(A^_&(E^A))+b[8]+1770035416&4294967295,v=_+(w<<7&4294967295|w>>>25),w=A+(E^v&(_^E))+b[9]+2336552879&4294967295,A=v+(w<<12&4294967295|w>>>20),w=E+(_^A&(v^_))+b[10]+4294925233&4294967295,E=A+(w<<17&4294967295|w>>>15),w=_+(v^E&(A^v))+b[11]+2304563134&4294967295,_=E+(w<<22&4294967295|w>>>10),w=v+(A^_&(E^A))+b[12]+1804603682&4294967295,v=_+(w<<7&4294967295|w>>>25),w=A+(E^v&(_^E))+b[13]+4254626195&4294967295,A=v+(w<<12&4294967295|w>>>20),w=E+(_^A&(v^_))+b[14]+2792965006&4294967295,E=A+(w<<17&4294967295|w>>>15),w=_+(v^E&(A^v))+b[15]+1236535329&4294967295,_=E+(w<<22&4294967295|w>>>10),w=v+(E^A&(_^E))+b[1]+4129170786&4294967295,v=_+(w<<5&4294967295|w>>>27),w=A+(_^E&(v^_))+b[6]+3225465664&4294967295,A=v+(w<<9&4294967295|w>>>23),w=E+(v^_&(A^v))+b[11]+643717713&4294967295,E=A+(w<<14&4294967295|w>>>18),w=_+(A^v&(E^A))+b[0]+3921069994&4294967295,_=E+(w<<20&4294967295|w>>>12),w=v+(E^A&(_^E))+b[5]+3593408605&4294967295,v=_+(w<<5&4294967295|w>>>27),w=A+(_^E&(v^_))+b[10]+38016083&4294967295,A=v+(w<<9&4294967295|w>>>23),w=E+(v^_&(A^v))+b[15]+3634488961&4294967295,E=A+(w<<14&4294967295|w>>>18),w=_+(A^v&(E^A))+b[4]+3889429448&4294967295,_=E+(w<<20&4294967295|w>>>12),w=v+(E^A&(_^E))+b[9]+568446438&4294967295,v=_+(w<<5&4294967295|w>>>27),w=A+(_^E&(v^_))+b[14]+3275163606&4294967295,A=v+(w<<9&4294967295|w>>>23),w=E+(v^_&(A^v))+b[3]+4107603335&4294967295,E=A+(w<<14&4294967295|w>>>18),w=_+(A^v&(E^A))+b[8]+1163531501&4294967295,_=E+(w<<20&4294967295|w>>>12),w=v+(E^A&(_^E))+b[13]+2850285829&4294967295,v=_+(w<<5&4294967295|w>>>27),w=A+(_^E&(v^_))+b[2]+4243563512&4294967295,A=v+(w<<9&4294967295|w>>>23),w=E+(v^_&(A^v))+b[7]+1735328473&4294967295,E=A+(w<<14&4294967295|w>>>18),w=_+(A^v&(E^A))+b[12]+2368359562&4294967295,_=E+(w<<20&4294967295|w>>>12),w=v+(_^E^A)+b[5]+4294588738&4294967295,v=_+(w<<4&4294967295|w>>>28),w=A+(v^_^E)+b[8]+2272392833&4294967295,A=v+(w<<11&4294967295|w>>>21),w=E+(A^v^_)+b[11]+1839030562&4294967295,E=A+(w<<16&4294967295|w>>>16),w=_+(E^A^v)+b[14]+4259657740&4294967295,_=E+(w<<23&4294967295|w>>>9),w=v+(_^E^A)+b[1]+2763975236&4294967295,v=_+(w<<4&4294967295|w>>>28),w=A+(v^_^E)+b[4]+1272893353&4294967295,A=v+(w<<11&4294967295|w>>>21),w=E+(A^v^_)+b[7]+4139469664&4294967295,E=A+(w<<16&4294967295|w>>>16),w=_+(E^A^v)+b[10]+3200236656&4294967295,_=E+(w<<23&4294967295|w>>>9),w=v+(_^E^A)+b[13]+681279174&4294967295,v=_+(w<<4&4294967295|w>>>28),w=A+(v^_^E)+b[0]+3936430074&4294967295,A=v+(w<<11&4294967295|w>>>21),w=E+(A^v^_)+b[3]+3572445317&4294967295,E=A+(w<<16&4294967295|w>>>16),w=_+(E^A^v)+b[6]+76029189&4294967295,_=E+(w<<23&4294967295|w>>>9),w=v+(_^E^A)+b[9]+3654602809&4294967295,v=_+(w<<4&4294967295|w>>>28),w=A+(v^_^E)+b[12]+3873151461&4294967295,A=v+(w<<11&4294967295|w>>>21),w=E+(A^v^_)+b[15]+530742520&4294967295,E=A+(w<<16&4294967295|w>>>16),w=_+(E^A^v)+b[2]+3299628645&4294967295,_=E+(w<<23&4294967295|w>>>9),w=v+(E^(_|~A))+b[0]+4096336452&4294967295,v=_+(w<<6&4294967295|w>>>26),w=A+(_^(v|~E))+b[7]+1126891415&4294967295,A=v+(w<<10&4294967295|w>>>22),w=E+(v^(A|~_))+b[14]+2878612391&4294967295,E=A+(w<<15&4294967295|w>>>17),w=_+(A^(E|~v))+b[5]+4237533241&4294967295,_=E+(w<<21&4294967295|w>>>11),w=v+(E^(_|~A))+b[12]+1700485571&4294967295,v=_+(w<<6&4294967295|w>>>26),w=A+(_^(v|~E))+b[3]+2399980690&4294967295,A=v+(w<<10&4294967295|w>>>22),w=E+(v^(A|~_))+b[10]+4293915773&4294967295,E=A+(w<<15&4294967295|w>>>17),w=_+(A^(E|~v))+b[1]+2240044497&4294967295,_=E+(w<<21&4294967295|w>>>11),w=v+(E^(_|~A))+b[8]+1873313359&4294967295,v=_+(w<<6&4294967295|w>>>26),w=A+(_^(v|~E))+b[15]+4264355552&4294967295,A=v+(w<<10&4294967295|w>>>22),w=E+(v^(A|~_))+b[6]+2734768916&4294967295,E=A+(w<<15&4294967295|w>>>17),w=_+(A^(E|~v))+b[13]+1309151649&4294967295,_=E+(w<<21&4294967295|w>>>11),w=v+(E^(_|~A))+b[4]+4149444226&4294967295,v=_+(w<<6&4294967295|w>>>26),w=A+(_^(v|~E))+b[11]+3174756917&4294967295,A=v+(w<<10&4294967295|w>>>22),w=E+(v^(A|~_))+b[2]+718787259&4294967295,E=A+(w<<15&4294967295|w>>>17),w=_+(A^(E|~v))+b[9]+3951481745&4294967295,T.g[0]=T.g[0]+v&4294967295,T.g[1]=T.g[1]+(E+(w<<21&4294967295|w>>>11))&4294967295,T.g[2]=T.g[2]+E&4294967295,T.g[3]=T.g[3]+A&4294967295}r.prototype.u=function(T,v){v===void 0&&(v=T.length);for(var _=v-this.blockSize,b=this.B,E=this.h,A=0;A<v;){if(E==0)for(;A<=_;)i(this,T,A),A+=this.blockSize;if(typeof T=="string"){for(;A<v;)if(b[E++]=T.charCodeAt(A++),E==this.blockSize){i(this,b),E=0;break}}else for(;A<v;)if(b[E++]=T[A++],E==this.blockSize){i(this,b),E=0;break}}this.h=E,this.o+=v},r.prototype.v=function(){var T=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);T[0]=128;for(var v=1;v<T.length-8;++v)T[v]=0;var _=8*this.o;for(v=T.length-8;v<T.length;++v)T[v]=_&255,_/=256;for(this.u(T),T=Array(16),v=_=0;4>v;++v)for(var b=0;32>b;b+=8)T[_++]=this.g[v]>>>b&255;return T};function s(T,v){var _=l;return Object.prototype.hasOwnProperty.call(_,T)?_[T]:_[T]=v(T)}function o(T,v){this.h=v;for(var _=[],b=!0,E=T.length-1;0<=E;E--){var A=T[E]|0;b&&A==v||(_[E]=A,b=!1)}this.g=_}var l={};function c(T){return-128<=T&&128>T?s(T,function(v){return new o([v|0],0>v?-1:0)}):new o([T|0],0>T?-1:0)}function u(T){if(isNaN(T)||!isFinite(T))return m;if(0>T)return x(u(-T));for(var v=[],_=1,b=0;T>=_;b++)v[b]=T/_|0,_*=4294967296;return new o(v,0)}function f(T,v){if(T.length==0)throw Error("number format error: empty string");if(v=v||10,2>v||36<v)throw Error("radix out of range: "+v);if(T.charAt(0)=="-")return x(f(T.substring(1),v));if(0<=T.indexOf("-"))throw Error('number format error: interior "-" character');for(var _=u(Math.pow(v,8)),b=m,E=0;E<T.length;E+=8){var A=Math.min(8,T.length-E),w=parseInt(T.substring(E,E+A),v);8>A?(A=u(Math.pow(v,A)),b=b.j(A).add(u(w))):(b=b.j(_),b=b.add(u(w)))}return b}var m=c(0),p=c(1),y=c(16777216);n=o.prototype,n.m=function(){if(S(this))return-x(this).m();for(var T=0,v=1,_=0;_<this.g.length;_++){var b=this.i(_);T+=(0<=b?b:4294967296+b)*v,v*=4294967296}return T},n.toString=function(T){if(T=T||10,2>T||36<T)throw Error("radix out of range: "+T);if(I(this))return"0";if(S(this))return"-"+x(this).toString(T);for(var v=u(Math.pow(T,6)),_=this,b="";;){var E=B(_,v).g;_=k(_,E.j(v));var A=((0<_.g.length?_.g[0]:_.h)>>>0).toString(T);if(_=E,I(_))return A+b;for(;6>A.length;)A="0"+A;b=A+b}},n.i=function(T){return 0>T?0:T<this.g.length?this.g[T]:this.h};function I(T){if(T.h!=0)return!1;for(var v=0;v<T.g.length;v++)if(T.g[v]!=0)return!1;return!0}function S(T){return T.h==-1}n.l=function(T){return T=k(this,T),S(T)?-1:I(T)?0:1};function x(T){for(var v=T.g.length,_=[],b=0;b<v;b++)_[b]=~T.g[b];return new o(_,~T.h).add(p)}n.abs=function(){return S(this)?x(this):this},n.add=function(T){for(var v=Math.max(this.g.length,T.g.length),_=[],b=0,E=0;E<=v;E++){var A=b+(this.i(E)&65535)+(T.i(E)&65535),w=(A>>>16)+(this.i(E)>>>16)+(T.i(E)>>>16);b=w>>>16,A&=65535,w&=65535,_[E]=w<<16|A}return new o(_,_[_.length-1]&-2147483648?-1:0)};function k(T,v){return T.add(x(v))}n.j=function(T){if(I(this)||I(T))return m;if(S(this))return S(T)?x(this).j(x(T)):x(x(this).j(T));if(S(T))return x(this.j(x(T)));if(0>this.l(y)&&0>T.l(y))return u(this.m()*T.m());for(var v=this.g.length+T.g.length,_=[],b=0;b<2*v;b++)_[b]=0;for(b=0;b<this.g.length;b++)for(var E=0;E<T.g.length;E++){var A=this.i(b)>>>16,w=this.i(b)&65535,le=T.i(E)>>>16,pe=T.i(E)&65535;_[2*b+2*E]+=w*pe,C(_,2*b+2*E),_[2*b+2*E+1]+=A*pe,C(_,2*b+2*E+1),_[2*b+2*E+1]+=w*le,C(_,2*b+2*E+1),_[2*b+2*E+2]+=A*le,C(_,2*b+2*E+2)}for(b=0;b<v;b++)_[b]=_[2*b+1]<<16|_[2*b];for(b=v;b<2*v;b++)_[b]=0;return new o(_,0)};function C(T,v){for(;(T[v]&65535)!=T[v];)T[v+1]+=T[v]>>>16,T[v]&=65535,v++}function N(T,v){this.g=T,this.h=v}function B(T,v){if(I(v))throw Error("division by zero");if(I(T))return new N(m,m);if(S(T))return v=B(x(T),v),new N(x(v.g),x(v.h));if(S(v))return v=B(T,x(v)),new N(x(v.g),v.h);if(30<T.g.length){if(S(T)||S(v))throw Error("slowDivide_ only works with positive integers.");for(var _=p,b=v;0>=b.l(T);)_=$(_),b=$(b);var E=q(_,1),A=q(b,1);for(b=q(b,2),_=q(_,2);!I(b);){var w=A.add(b);0>=w.l(T)&&(E=E.add(_),A=w),b=q(b,1),_=q(_,1)}return v=k(T,E.j(v)),new N(E,v)}for(E=m;0<=T.l(v);){for(_=Math.max(1,Math.floor(T.m()/v.m())),b=Math.ceil(Math.log(_)/Math.LN2),b=48>=b?1:Math.pow(2,b-48),A=u(_),w=A.j(v);S(w)||0<w.l(T);)_-=b,A=u(_),w=A.j(v);I(A)&&(A=p),E=E.add(A),T=k(T,w)}return new N(E,T)}n.A=function(T){return B(this,T).h},n.and=function(T){for(var v=Math.max(this.g.length,T.g.length),_=[],b=0;b<v;b++)_[b]=this.i(b)&T.i(b);return new o(_,this.h&T.h)},n.or=function(T){for(var v=Math.max(this.g.length,T.g.length),_=[],b=0;b<v;b++)_[b]=this.i(b)|T.i(b);return new o(_,this.h|T.h)},n.xor=function(T){for(var v=Math.max(this.g.length,T.g.length),_=[],b=0;b<v;b++)_[b]=this.i(b)^T.i(b);return new o(_,this.h^T.h)};function $(T){for(var v=T.g.length+1,_=[],b=0;b<v;b++)_[b]=T.i(b)<<1|T.i(b-1)>>>31;return new o(_,T.h)}function q(T,v){var _=v>>5;v%=32;for(var b=T.g.length-_,E=[],A=0;A<b;A++)E[A]=0<v?T.i(A+_)>>>v|T.i(A+_+1)<<32-v:T.i(A+_);return new o(E,T.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,Ef=r,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.A,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=u,o.fromString=f,Lr=o}).apply(typeof Ed<"u"?Ed:typeof self<"u"?self:typeof window<"u"?window:{});var Zs=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Tf,ji,If,lo,al,Sf,Af,xf;(function(){var n,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(a,d,h){return a==Array.prototype||a==Object.prototype||(a[d]=h.value),a};function t(a){a=[typeof globalThis=="object"&&globalThis,a,typeof window=="object"&&window,typeof self=="object"&&self,typeof Zs=="object"&&Zs];for(var d=0;d<a.length;++d){var h=a[d];if(h&&h.Math==Math)return h}throw Error("Cannot find global object")}var r=t(this);function i(a,d){if(d)e:{var h=r;a=a.split(".");for(var g=0;g<a.length-1;g++){var R=a[g];if(!(R in h))break e;h=h[R]}a=a[a.length-1],g=h[a],d=d(g),d!=g&&d!=null&&e(h,a,{configurable:!0,writable:!0,value:d})}}function s(a,d){a instanceof String&&(a+="");var h=0,g=!1,R={next:function(){if(!g&&h<a.length){var P=h++;return{value:d(P,a[P]),done:!1}}return g=!0,{done:!0,value:void 0}}};return R[Symbol.iterator]=function(){return R},R}i("Array.prototype.values",function(a){return a||function(){return s(this,function(d,h){return h})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var o=o||{},l=this||self;function c(a){var d=typeof a;return d=d!="object"?d:a?Array.isArray(a)?"array":d:"null",d=="array"||d=="object"&&typeof a.length=="number"}function u(a){var d=typeof a;return d=="object"&&a!=null||d=="function"}function f(a,d,h){return a.call.apply(a.bind,arguments)}function m(a,d,h){if(!a)throw Error();if(2<arguments.length){var g=Array.prototype.slice.call(arguments,2);return function(){var R=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(R,g),a.apply(d,R)}}return function(){return a.apply(d,arguments)}}function p(a,d,h){return p=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?f:m,p.apply(null,arguments)}function y(a,d){var h=Array.prototype.slice.call(arguments,1);return function(){var g=h.slice();return g.push.apply(g,arguments),a.apply(this,g)}}function I(a,d){function h(){}h.prototype=d.prototype,a.aa=d.prototype,a.prototype=new h,a.prototype.constructor=a,a.Qb=function(g,R,P){for(var V=Array(arguments.length-2),we=2;we<arguments.length;we++)V[we-2]=arguments[we];return d.prototype[R].apply(g,V)}}function S(a){const d=a.length;if(0<d){const h=Array(d);for(let g=0;g<d;g++)h[g]=a[g];return h}return[]}function x(a,d){for(let h=1;h<arguments.length;h++){const g=arguments[h];if(c(g)){const R=a.length||0,P=g.length||0;a.length=R+P;for(let V=0;V<P;V++)a[R+V]=g[V]}else a.push(g)}}class k{constructor(d,h){this.i=d,this.j=h,this.h=0,this.g=null}get(){let d;return 0<this.h?(this.h--,d=this.g,this.g=d.next,d.next=null):d=this.i(),d}}function C(a){return/^[\s\xa0]*$/.test(a)}function N(){var a=l.navigator;return a&&(a=a.userAgent)?a:""}function B(a){return B[" "](a),a}B[" "]=function(){};var $=N().indexOf("Gecko")!=-1&&!(N().toLowerCase().indexOf("webkit")!=-1&&N().indexOf("Edge")==-1)&&!(N().indexOf("Trident")!=-1||N().indexOf("MSIE")!=-1)&&N().indexOf("Edge")==-1;function q(a,d,h){for(const g in a)d.call(h,a[g],g,a)}function T(a,d){for(const h in a)d.call(void 0,a[h],h,a)}function v(a){const d={};for(const h in a)d[h]=a[h];return d}const _="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function b(a,d){let h,g;for(let R=1;R<arguments.length;R++){g=arguments[R];for(h in g)a[h]=g[h];for(let P=0;P<_.length;P++)h=_[P],Object.prototype.hasOwnProperty.call(g,h)&&(a[h]=g[h])}}function E(a){var d=1;a=a.split(":");const h=[];for(;0<d&&a.length;)h.push(a.shift()),d--;return a.length&&h.push(a.join(":")),h}function A(a){l.setTimeout(()=>{throw a},0)}function w(){var a=te;let d=null;return a.g&&(d=a.g,a.g=a.g.next,a.g||(a.h=null),d.next=null),d}class le{constructor(){this.h=this.g=null}add(d,h){const g=pe.get();g.set(d,h),this.h?this.h.next=g:this.g=g,this.h=g}}var pe=new k(()=>new H,a=>a.reset());class H{constructor(){this.next=this.g=this.h=null}set(d,h){this.h=d,this.g=h,this.next=null}reset(){this.next=this.g=this.h=null}}let ee,ne=!1,te=new le,Ce=()=>{const a=l.Promise.resolve(void 0);ee=()=>{a.then(ke)}};var ke=()=>{for(var a;a=w();){try{a.h.call(a.g)}catch(h){A(h)}var d=pe;d.j(a),100>d.h&&(d.h++,a.next=d.g,d.g=a)}ne=!1};function ye(){this.s=this.s,this.C=this.C}ye.prototype.s=!1,ye.prototype.ma=function(){this.s||(this.s=!0,this.N())},ye.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function O(a,d){this.type=a,this.g=this.target=d,this.defaultPrevented=!1}O.prototype.h=function(){this.defaultPrevented=!0};var Z=function(){if(!l.addEventListener||!Object.defineProperty)return!1;var a=!1,d=Object.defineProperty({},"passive",{get:function(){a=!0}});try{const h=()=>{};l.addEventListener("test",h,d),l.removeEventListener("test",h,d)}catch{}return a}();function be(a,d){if(O.call(this,a?a.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,a){var h=this.type=a.type,g=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;if(this.target=a.target||a.srcElement,this.g=d,d=a.relatedTarget){if($){e:{try{B(d.nodeName);var R=!0;break e}catch{}R=!1}R||(d=null)}}else h=="mouseover"?d=a.fromElement:h=="mouseout"&&(d=a.toElement);this.relatedTarget=d,g?(this.clientX=g.clientX!==void 0?g.clientX:g.pageX,this.clientY=g.clientY!==void 0?g.clientY:g.pageY,this.screenX=g.screenX||0,this.screenY=g.screenY||0):(this.clientX=a.clientX!==void 0?a.clientX:a.pageX,this.clientY=a.clientY!==void 0?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0),this.button=a.button,this.key=a.key||"",this.ctrlKey=a.ctrlKey,this.altKey=a.altKey,this.shiftKey=a.shiftKey,this.metaKey=a.metaKey,this.pointerId=a.pointerId||0,this.pointerType=typeof a.pointerType=="string"?a.pointerType:se[a.pointerType]||"",this.state=a.state,this.i=a,a.defaultPrevented&&be.aa.h.call(this)}}I(be,O);var se={2:"touch",3:"pen",4:"mouse"};be.prototype.h=function(){be.aa.h.call(this);var a=this.i;a.preventDefault?a.preventDefault():a.returnValue=!1};var ce="closure_listenable_"+(1e6*Math.random()|0),Te=0;function Yn(a,d,h,g,R){this.listener=a,this.proxy=null,this.src=d,this.type=h,this.capture=!!g,this.ha=R,this.key=++Te,this.da=this.fa=!1}function lt(a){a.da=!0,a.listener=null,a.proxy=null,a.src=null,a.ha=null}function ct(a){this.src=a,this.g={},this.h=0}ct.prototype.add=function(a,d,h,g,R){var P=a.toString();a=this.g[P],a||(a=this.g[P]=[],this.h++);var V=Pt(a,d,g,R);return-1<V?(d=a[V],h||(d.fa=!1)):(d=new Yn(d,this.src,P,!!g,R),d.fa=h,a.push(d)),d};function Kt(a,d){var h=d.type;if(h in a.g){var g=a.g[h],R=Array.prototype.indexOf.call(g,d,void 0),P;(P=0<=R)&&Array.prototype.splice.call(g,R,1),P&&(lt(d),a.g[h].length==0&&(delete a.g[h],a.h--))}}function Pt(a,d,h,g){for(var R=0;R<a.length;++R){var P=a[R];if(!P.da&&P.listener==d&&P.capture==!!h&&P.ha==g)return R}return-1}var Xe="closure_lm_"+(1e6*Math.random()|0),ut={};function pn(a,d,h,g,R){if(Array.isArray(d)){for(var P=0;P<d.length;P++)pn(a,d[P],h,g,R);return null}return h=yn(h),a&&a[ce]?a.K(d,h,u(g)?!!g.capture:!1,R):mn(a,d,h,!1,g,R)}function mn(a,d,h,g,R,P){if(!d)throw Error("Invalid event type");var V=u(R)?!!R.capture:!!R,we=Jt(a);if(we||(a[Xe]=we=new ct(a)),h=we.add(d,h,g,V,P),h.proxy)return h;if(g=Qt(),h.proxy=g,g.src=a,g.listener=h,a.addEventListener)Z||(R=V),R===void 0&&(R=!1),a.addEventListener(d.toString(),g,R);else if(a.attachEvent)a.attachEvent(yt(d.toString()),g);else if(a.addListener&&a.removeListener)a.addListener(g);else throw Error("addEventListener and attachEvent are unavailable.");return h}function Qt(){function a(h){return d.call(a.src,a.listener,h)}const d=jn;return a}function gn(a,d,h,g,R){if(Array.isArray(d))for(var P=0;P<d.length;P++)gn(a,d[P],h,g,R);else g=u(g)?!!g.capture:!!g,h=yn(h),a&&a[ce]?(a=a.i,d=String(d).toString(),d in a.g&&(P=a.g[d],h=Pt(P,h,g,R),-1<h&&(lt(P[h]),Array.prototype.splice.call(P,h,1),P.length==0&&(delete a.g[d],a.h--)))):a&&(a=Jt(a))&&(d=a.g[d.toString()],a=-1,d&&(a=Pt(d,h,g,R)),(h=-1<a?d[a]:null)&&Ft(h))}function Ft(a){if(typeof a!="number"&&a&&!a.da){var d=a.src;if(d&&d[ce])Kt(d.i,a);else{var h=a.type,g=a.proxy;d.removeEventListener?d.removeEventListener(h,g,a.capture):d.detachEvent?d.detachEvent(yt(h),g):d.addListener&&d.removeListener&&d.removeListener(g),(h=Jt(d))?(Kt(h,a),h.h==0&&(h.src=null,d[Xe]=null)):lt(a)}}}function yt(a){return a in ut?ut[a]:ut[a]="on"+a}function jn(a,d){if(a.da)a=!0;else{d=new be(d,this);var h=a.listener,g=a.ha||a.src;a.fa&&Ft(a),a=h.call(g,d)}return a}function Jt(a){return a=a[Xe],a instanceof ct?a:null}var $t="__closure_events_fn_"+(1e9*Math.random()>>>0);function yn(a){return typeof a=="function"?a:(a[$t]||(a[$t]=function(d){return a.handleEvent(d)}),a[$t])}function _e(){ye.call(this),this.i=new ct(this),this.M=this,this.F=null}I(_e,ye),_e.prototype[ce]=!0,_e.prototype.removeEventListener=function(a,d,h,g){gn(this,a,d,h,g)};function fe(a,d){var h,g=a.F;if(g)for(h=[];g;g=g.F)h.push(g);if(a=a.M,g=d.type||d,typeof d=="string")d=new O(d,a);else if(d instanceof O)d.target=d.target||a;else{var R=d;d=new O(g,a),b(d,R)}if(R=!0,h)for(var P=h.length-1;0<=P;P--){var V=d.g=h[P];R=Xt(V,g,!0,d)&&R}if(V=d.g=a,R=Xt(V,g,!0,d)&&R,R=Xt(V,g,!1,d)&&R,h)for(P=0;P<h.length;P++)V=d.g=h[P],R=Xt(V,g,!1,d)&&R}_e.prototype.N=function(){if(_e.aa.N.call(this),this.i){var a=this.i,d;for(d in a.g){for(var h=a.g[d],g=0;g<h.length;g++)lt(h[g]);delete a.g[d],a.h--}}this.F=null},_e.prototype.K=function(a,d,h,g){return this.i.add(String(a),d,!1,h,g)},_e.prototype.L=function(a,d,h,g){return this.i.add(String(a),d,!0,h,g)};function Xt(a,d,h,g){if(d=a.i.g[String(d)],!d)return!0;d=d.concat();for(var R=!0,P=0;P<d.length;++P){var V=d[P];if(V&&!V.da&&V.capture==h){var we=V.listener,Ye=V.ha||V.src;V.fa&&Kt(a.i,V),R=we.call(Ye,g)!==!1&&R}}return R&&!g.defaultPrevented}function Zt(a,d,h){if(typeof a=="function")h&&(a=p(a,h));else if(a&&typeof a.handleEvent=="function")a=p(a.handleEvent,a);else throw Error("Invalid listener argument");return 2147483647<Number(d)?-1:l.setTimeout(a,d||0)}function Wn(a){a.g=Zt(()=>{a.g=null,a.i&&(a.i=!1,Wn(a))},a.l);const d=a.h;a.h=null,a.m.apply(null,d)}class Vs extends ye{constructor(d,h){super(),this.m=d,this.l=h,this.h=null,this.i=!1,this.g=null}j(d){this.h=arguments,this.g?this.i=!0:Wn(this)}N(){super.N(),this.g&&(l.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function vn(a){ye.call(this),this.h=a,this.g={}}I(vn,ye);var wn=[];function en(a){q(a.g,function(d,h){this.g.hasOwnProperty(h)&&Ft(d)},a),a.g={}}vn.prototype.N=function(){vn.aa.N.call(this),en(this)},vn.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Ze=l.JSON.stringify,vt=l.JSON.parse,re=class{stringify(a){return l.JSON.stringify(a,void 0)}parse(a){return l.JSON.parse(a,void 0)}};function St(){}St.prototype.h=null;function Ct(a){return a.h||(a.h=a.i())}function zt(){}var dt={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function Pi(){O.call(this,"d")}I(Pi,O);function _r(){O.call(this,"c")}I(_r,O);var bn={},Ci=null;function Er(){return Ci=Ci||new _e}bn.La="serverreachability";function Mi(a){O.call(this,bn.La,a)}I(Mi,O);function Gn(a){const d=Er();fe(d,new Mi(d))}bn.STAT_EVENT="statevent";function X(a,d){O.call(this,bn.STAT_EVENT,a),this.stat=d}I(X,O);function ue(a){const d=Er();fe(d,new X(d,a))}bn.Ma="timingevent";function Ve(a,d){O.call(this,bn.Ma,a),this.size=d}I(Ve,O);function ze(a,d){if(typeof a!="function")throw Error("Fn must not be null and must be a function");return l.setTimeout(function(){a()},d)}function ht(){this.g=!0}ht.prototype.xa=function(){this.g=!1};function Be(a,d,h,g,R,P){a.info(function(){if(a.g)if(P)for(var V="",we=P.split("&"),Ye=0;Ye<we.length;Ye++){var de=we[Ye].split("=");if(1<de.length){var et=de[0];de=de[1];var tt=et.split("_");V=2<=tt.length&&tt[1]=="type"?V+(et+"="+de+"&"):V+(et+"=redacted&")}}else V=null;else V=P;return"XMLHTTP REQ ("+g+") [attempt "+R+"]: "+d+`
`+h+`
`+V})}function Ut(a,d,h,g,R,P,V){a.info(function(){return"XMLHTTP RESP ("+g+") [ attempt "+R+"]: "+d+`
`+h+`
`+P+" "+V})}function ve(a,d,h,g){a.info(function(){return"XMLHTTP TEXT ("+d+"): "+ft(a,h)+(g?" "+g:"")})}function He(a,d){a.info(function(){return"TIMEOUT: "+d})}ht.prototype.info=function(){};function ft(a,d){if(!a.g)return d;if(!d)return null;try{var h=JSON.parse(d);if(h){for(a=0;a<h.length;a++)if(Array.isArray(h[a])){var g=h[a];if(!(2>g.length)){var R=g[1];if(Array.isArray(R)&&!(1>R.length)){var P=R[0];if(P!="noop"&&P!="stop"&&P!="close")for(var V=1;V<R.length;V++)R[V]=""}}}}return Ze(h)}catch{return d}}var Ie={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},Kn={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},Tr;function Di(){}I(Di,St),Di.prototype.g=function(){return new XMLHttpRequest},Di.prototype.i=function(){return{}},Tr=new Di;function Qn(a,d,h,g){this.j=a,this.i=d,this.l=h,this.R=g||1,this.U=new vn(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new ou}function ou(){this.i=null,this.g="",this.h=!1}var au={},Ia={};function Sa(a,d,h){a.L=1,a.v=Us(_n(d)),a.m=h,a.P=!0,lu(a,null)}function lu(a,d){a.F=Date.now(),Fs(a),a.A=_n(a.v);var h=a.A,g=a.R;Array.isArray(g)||(g=[String(g)]),Eu(h.i,"t",g),a.C=0,h=a.j.J,a.h=new ou,a.g=$u(a.j,h?d:null,!a.m),0<a.O&&(a.M=new Vs(p(a.Y,a,a.g),a.O)),d=a.U,h=a.g,g=a.ca;var R="readystatechange";Array.isArray(R)||(R&&(wn[0]=R.toString()),R=wn);for(var P=0;P<R.length;P++){var V=pn(h,R[P],g||d.handleEvent,!1,d.h||d);if(!V)break;d.g[V.key]=V}d=a.H?v(a.H):{},a.m?(a.u||(a.u="POST"),d["Content-Type"]="application/x-www-form-urlencoded",a.g.ea(a.A,a.u,a.m,d)):(a.u="GET",a.g.ea(a.A,a.u,null,d)),Gn(),Be(a.i,a.u,a.A,a.l,a.R,a.m)}Qn.prototype.ca=function(a){a=a.target;const d=this.M;d&&En(a)==3?d.j():this.Y(a)},Qn.prototype.Y=function(a){try{if(a==this.g)e:{const tt=En(this.g);var d=this.g.Ba();const Xr=this.g.Z();if(!(3>tt)&&(tt!=3||this.g&&(this.h.h||this.g.oa()||ku(this.g)))){this.J||tt!=4||d==7||(d==8||0>=Xr?Gn(3):Gn(2)),Aa(this);var h=this.g.Z();this.X=h;t:if(cu(this)){var g=ku(this.g);a="";var R=g.length,P=En(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){Ir(this),Li(this);var V="";break t}this.h.i=new l.TextDecoder}for(d=0;d<R;d++)this.h.h=!0,a+=this.h.i.decode(g[d],{stream:!(P&&d==R-1)});g.length=0,this.h.g+=a,this.C=0,V=this.h.g}else V=this.g.oa();if(this.o=h==200,Ut(this.i,this.u,this.A,this.l,this.R,tt,h),this.o){if(this.T&&!this.K){t:{if(this.g){var we,Ye=this.g;if((we=Ye.g?Ye.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!C(we)){var de=we;break t}}de=null}if(h=de)ve(this.i,this.l,h,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,xa(this,h);else{this.o=!1,this.s=3,ue(12),Ir(this),Li(this);break e}}if(this.P){h=!0;let qt;for(;!this.J&&this.C<V.length;)if(qt=rg(this,V),qt==Ia){tt==4&&(this.s=4,ue(14),h=!1),ve(this.i,this.l,null,"[Incomplete Response]");break}else if(qt==au){this.s=4,ue(15),ve(this.i,this.l,V,"[Invalid Chunk]"),h=!1;break}else ve(this.i,this.l,qt,null),xa(this,qt);if(cu(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),tt!=4||V.length!=0||this.h.h||(this.s=1,ue(16),h=!1),this.o=this.o&&h,!h)ve(this.i,this.l,V,"[Invalid Chunked Response]"),Ir(this),Li(this);else if(0<V.length&&!this.W){this.W=!0;var et=this.j;et.g==this&&et.ba&&!et.M&&(et.j.info("Great, no buffering proxy detected. Bytes received: "+V.length),Da(et),et.M=!0,ue(11))}}else ve(this.i,this.l,V,null),xa(this,V);tt==4&&Ir(this),this.o&&!this.J&&(tt==4?Bu(this.j,this):(this.o=!1,Fs(this)))}else bg(this.g),h==400&&0<V.indexOf("Unknown SID")?(this.s=3,ue(12)):(this.s=0,ue(13)),Ir(this),Li(this)}}}catch{}finally{}};function cu(a){return a.g?a.u=="GET"&&a.L!=2&&a.j.Ca:!1}function rg(a,d){var h=a.C,g=d.indexOf(`
`,h);return g==-1?Ia:(h=Number(d.substring(h,g)),isNaN(h)?au:(g+=1,g+h>d.length?Ia:(d=d.slice(g,g+h),a.C=g+h,d)))}Qn.prototype.cancel=function(){this.J=!0,Ir(this)};function Fs(a){a.S=Date.now()+a.I,uu(a,a.I)}function uu(a,d){if(a.B!=null)throw Error("WatchDog timer not null");a.B=ze(p(a.ba,a),d)}function Aa(a){a.B&&(l.clearTimeout(a.B),a.B=null)}Qn.prototype.ba=function(){this.B=null;const a=Date.now();0<=a-this.S?(He(this.i,this.A),this.L!=2&&(Gn(),ue(17)),Ir(this),this.s=2,Li(this)):uu(this,this.S-a)};function Li(a){a.j.G==0||a.J||Bu(a.j,a)}function Ir(a){Aa(a);var d=a.M;d&&typeof d.ma=="function"&&d.ma(),a.M=null,en(a.U),a.g&&(d=a.g,a.g=null,d.abort(),d.ma())}function xa(a,d){try{var h=a.j;if(h.G!=0&&(h.g==a||Ra(h.h,a))){if(!a.K&&Ra(h.h,a)&&h.G==3){try{var g=h.Da.g.parse(d)}catch{g=null}if(Array.isArray(g)&&g.length==3){var R=g;if(R[0]==0){e:if(!h.u){if(h.g)if(h.g.F+3e3<a.F)Gs(h),js(h);else break e;Ma(h),ue(18)}}else h.za=R[1],0<h.za-h.T&&37500>R[2]&&h.F&&h.v==0&&!h.C&&(h.C=ze(p(h.Za,h),6e3));if(1>=fu(h.h)&&h.ca){try{h.ca()}catch{}h.ca=void 0}}else Ar(h,11)}else if((a.K||h.g==a)&&Gs(h),!C(d))for(R=h.Da.g.parse(d),d=0;d<R.length;d++){let de=R[d];if(h.T=de[0],de=de[1],h.G==2)if(de[0]=="c"){h.K=de[1],h.ia=de[2];const et=de[3];et!=null&&(h.la=et,h.j.info("VER="+h.la));const tt=de[4];tt!=null&&(h.Aa=tt,h.j.info("SVER="+h.Aa));const Xr=de[5];Xr!=null&&typeof Xr=="number"&&0<Xr&&(g=1.5*Xr,h.L=g,h.j.info("backChannelRequestTimeoutMs_="+g)),g=h;const qt=a.g;if(qt){const Qs=qt.g?qt.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Qs){var P=g.h;P.g||Qs.indexOf("spdy")==-1&&Qs.indexOf("quic")==-1&&Qs.indexOf("h2")==-1||(P.j=P.l,P.g=new Set,P.h&&(ka(P,P.h),P.h=null))}if(g.D){const La=qt.g?qt.g.getResponseHeader("X-HTTP-Session-Id"):null;La&&(g.ya=La,Ee(g.I,g.D,La))}}h.G=3,h.l&&h.l.ua(),h.ba&&(h.R=Date.now()-a.F,h.j.info("Handshake RTT: "+h.R+"ms")),g=h;var V=a;if(g.qa=Fu(g,g.J?g.ia:null,g.W),V.K){pu(g.h,V);var we=V,Ye=g.L;Ye&&(we.I=Ye),we.B&&(Aa(we),Fs(we)),g.g=V}else Lu(g);0<h.i.length&&Ws(h)}else de[0]!="stop"&&de[0]!="close"||Ar(h,7);else h.G==3&&(de[0]=="stop"||de[0]=="close"?de[0]=="stop"?Ar(h,7):Ca(h):de[0]!="noop"&&h.l&&h.l.ta(de),h.v=0)}}Gn(4)}catch{}}var ig=class{constructor(a,d){this.g=a,this.map=d}};function du(a){this.l=a||10,l.PerformanceNavigationTiming?(a=l.performance.getEntriesByType("navigation"),a=0<a.length&&(a[0].nextHopProtocol=="hq"||a[0].nextHopProtocol=="h2")):a=!!(l.chrome&&l.chrome.loadTimes&&l.chrome.loadTimes()&&l.chrome.loadTimes().wasFetchedViaSpdy),this.j=a?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function hu(a){return a.h?!0:a.g?a.g.size>=a.j:!1}function fu(a){return a.h?1:a.g?a.g.size:0}function Ra(a,d){return a.h?a.h==d:a.g?a.g.has(d):!1}function ka(a,d){a.g?a.g.add(d):a.h=d}function pu(a,d){a.h&&a.h==d?a.h=null:a.g&&a.g.has(d)&&a.g.delete(d)}du.prototype.cancel=function(){if(this.i=mu(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const a of this.g.values())a.cancel();this.g.clear()}};function mu(a){if(a.h!=null)return a.i.concat(a.h.D);if(a.g!=null&&a.g.size!==0){let d=a.i;for(const h of a.g.values())d=d.concat(h.D);return d}return S(a.i)}function sg(a){if(a.V&&typeof a.V=="function")return a.V();if(typeof Map<"u"&&a instanceof Map||typeof Set<"u"&&a instanceof Set)return Array.from(a.values());if(typeof a=="string")return a.split("");if(c(a)){for(var d=[],h=a.length,g=0;g<h;g++)d.push(a[g]);return d}d=[],h=0;for(g in a)d[h++]=a[g];return d}function og(a){if(a.na&&typeof a.na=="function")return a.na();if(!a.V||typeof a.V!="function"){if(typeof Map<"u"&&a instanceof Map)return Array.from(a.keys());if(!(typeof Set<"u"&&a instanceof Set)){if(c(a)||typeof a=="string"){var d=[];a=a.length;for(var h=0;h<a;h++)d.push(h);return d}d=[],h=0;for(const g in a)d[h++]=g;return d}}}function gu(a,d){if(a.forEach&&typeof a.forEach=="function")a.forEach(d,void 0);else if(c(a)||typeof a=="string")Array.prototype.forEach.call(a,d,void 0);else for(var h=og(a),g=sg(a),R=g.length,P=0;P<R;P++)d.call(void 0,g[P],h&&h[P],a)}var yu=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function ag(a,d){if(a){a=a.split("&");for(var h=0;h<a.length;h++){var g=a[h].indexOf("="),R=null;if(0<=g){var P=a[h].substring(0,g);R=a[h].substring(g+1)}else P=a[h];d(P,R?decodeURIComponent(R.replace(/\+/g," ")):"")}}}function Sr(a){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,a instanceof Sr){this.h=a.h,$s(this,a.j),this.o=a.o,this.g=a.g,zs(this,a.s),this.l=a.l;var d=a.i,h=new Oi;h.i=d.i,d.g&&(h.g=new Map(d.g),h.h=d.h),vu(this,h),this.m=a.m}else a&&(d=String(a).match(yu))?(this.h=!1,$s(this,d[1]||"",!0),this.o=Ni(d[2]||""),this.g=Ni(d[3]||"",!0),zs(this,d[4]),this.l=Ni(d[5]||"",!0),vu(this,d[6]||"",!0),this.m=Ni(d[7]||"")):(this.h=!1,this.i=new Oi(null,this.h))}Sr.prototype.toString=function(){var a=[],d=this.j;d&&a.push(Bi(d,wu,!0),":");var h=this.g;return(h||d=="file")&&(a.push("//"),(d=this.o)&&a.push(Bi(d,wu,!0),"@"),a.push(encodeURIComponent(String(h)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),h=this.s,h!=null&&a.push(":",String(h))),(h=this.l)&&(this.g&&h.charAt(0)!="/"&&a.push("/"),a.push(Bi(h,h.charAt(0)=="/"?ug:cg,!0))),(h=this.i.toString())&&a.push("?",h),(h=this.m)&&a.push("#",Bi(h,hg)),a.join("")};function _n(a){return new Sr(a)}function $s(a,d,h){a.j=h?Ni(d,!0):d,a.j&&(a.j=a.j.replace(/:$/,""))}function zs(a,d){if(d){if(d=Number(d),isNaN(d)||0>d)throw Error("Bad port number "+d);a.s=d}else a.s=null}function vu(a,d,h){d instanceof Oi?(a.i=d,fg(a.i,a.h)):(h||(d=Bi(d,dg)),a.i=new Oi(d,a.h))}function Ee(a,d,h){a.i.set(d,h)}function Us(a){return Ee(a,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),a}function Ni(a,d){return a?d?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""}function Bi(a,d,h){return typeof a=="string"?(a=encodeURI(a).replace(d,lg),h&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null}function lg(a){return a=a.charCodeAt(0),"%"+(a>>4&15).toString(16)+(a&15).toString(16)}var wu=/[#\/\?@]/g,cg=/[#\?:]/g,ug=/[#\?]/g,dg=/[#\?@]/g,hg=/#/g;function Oi(a,d){this.h=this.g=null,this.i=a||null,this.j=!!d}function Jn(a){a.g||(a.g=new Map,a.h=0,a.i&&ag(a.i,function(d,h){a.add(decodeURIComponent(d.replace(/\+/g," ")),h)}))}n=Oi.prototype,n.add=function(a,d){Jn(this),this.i=null,a=Qr(this,a);var h=this.g.get(a);return h||this.g.set(a,h=[]),h.push(d),this.h+=1,this};function bu(a,d){Jn(a),d=Qr(a,d),a.g.has(d)&&(a.i=null,a.h-=a.g.get(d).length,a.g.delete(d))}function _u(a,d){return Jn(a),d=Qr(a,d),a.g.has(d)}n.forEach=function(a,d){Jn(this),this.g.forEach(function(h,g){h.forEach(function(R){a.call(d,R,g,this)},this)},this)},n.na=function(){Jn(this);const a=Array.from(this.g.values()),d=Array.from(this.g.keys()),h=[];for(let g=0;g<d.length;g++){const R=a[g];for(let P=0;P<R.length;P++)h.push(d[g])}return h},n.V=function(a){Jn(this);let d=[];if(typeof a=="string")_u(this,a)&&(d=d.concat(this.g.get(Qr(this,a))));else{a=Array.from(this.g.values());for(let h=0;h<a.length;h++)d=d.concat(a[h])}return d},n.set=function(a,d){return Jn(this),this.i=null,a=Qr(this,a),_u(this,a)&&(this.h-=this.g.get(a).length),this.g.set(a,[d]),this.h+=1,this},n.get=function(a,d){return a?(a=this.V(a),0<a.length?String(a[0]):d):d};function Eu(a,d,h){bu(a,d),0<h.length&&(a.i=null,a.g.set(Qr(a,d),S(h)),a.h+=h.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const a=[],d=Array.from(this.g.keys());for(var h=0;h<d.length;h++){var g=d[h];const P=encodeURIComponent(String(g)),V=this.V(g);for(g=0;g<V.length;g++){var R=P;V[g]!==""&&(R+="="+encodeURIComponent(String(V[g]))),a.push(R)}}return this.i=a.join("&")};function Qr(a,d){return d=String(d),a.j&&(d=d.toLowerCase()),d}function fg(a,d){d&&!a.j&&(Jn(a),a.i=null,a.g.forEach(function(h,g){var R=g.toLowerCase();g!=R&&(bu(this,g),Eu(this,R,h))},a)),a.j=d}function pg(a,d){const h=new ht;if(l.Image){const g=new Image;g.onload=y(Xn,h,"TestLoadImage: loaded",!0,d,g),g.onerror=y(Xn,h,"TestLoadImage: error",!1,d,g),g.onabort=y(Xn,h,"TestLoadImage: abort",!1,d,g),g.ontimeout=y(Xn,h,"TestLoadImage: timeout",!1,d,g),l.setTimeout(function(){g.ontimeout&&g.ontimeout()},1e4),g.src=a}else d(!1)}function mg(a,d){const h=new ht,g=new AbortController,R=setTimeout(()=>{g.abort(),Xn(h,"TestPingServer: timeout",!1,d)},1e4);fetch(a,{signal:g.signal}).then(P=>{clearTimeout(R),P.ok?Xn(h,"TestPingServer: ok",!0,d):Xn(h,"TestPingServer: server error",!1,d)}).catch(()=>{clearTimeout(R),Xn(h,"TestPingServer: error",!1,d)})}function Xn(a,d,h,g,R){try{R&&(R.onload=null,R.onerror=null,R.onabort=null,R.ontimeout=null),g(h)}catch{}}function gg(){this.g=new re}function yg(a,d,h){const g=h||"";try{gu(a,function(R,P){let V=R;u(R)&&(V=Ze(R)),d.push(g+P+"="+encodeURIComponent(V))})}catch(R){throw d.push(g+"type="+encodeURIComponent("_badmap")),R}}function qs(a){this.l=a.Ub||null,this.j=a.eb||!1}I(qs,St),qs.prototype.g=function(){return new Hs(this.l,this.j)},qs.prototype.i=function(a){return function(){return a}}({});function Hs(a,d){_e.call(this),this.D=a,this.o=d,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}I(Hs,_e),n=Hs.prototype,n.open=function(a,d){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=a,this.A=d,this.readyState=1,Fi(this)},n.send=function(a){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const d={headers:this.u,method:this.B,credentials:this.m,cache:void 0};a&&(d.body=a),(this.D||l).fetch(new Request(this.A,d)).then(this.Sa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,Vi(this)),this.readyState=0},n.Sa=function(a){if(this.g&&(this.l=a,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=a.headers,this.readyState=2,Fi(this)),this.g&&(this.readyState=3,Fi(this),this.g)))if(this.responseType==="arraybuffer")a.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof l.ReadableStream<"u"&&"body"in a){if(this.j=a.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;Tu(this)}else a.text().then(this.Ra.bind(this),this.ga.bind(this))};function Tu(a){a.j.read().then(a.Pa.bind(a)).catch(a.ga.bind(a))}n.Pa=function(a){if(this.g){if(this.o&&a.value)this.response.push(a.value);else if(!this.o){var d=a.value?a.value:new Uint8Array(0);(d=this.v.decode(d,{stream:!a.done}))&&(this.response=this.responseText+=d)}a.done?Vi(this):Fi(this),this.readyState==3&&Tu(this)}},n.Ra=function(a){this.g&&(this.response=this.responseText=a,Vi(this))},n.Qa=function(a){this.g&&(this.response=a,Vi(this))},n.ga=function(){this.g&&Vi(this)};function Vi(a){a.readyState=4,a.l=null,a.j=null,a.v=null,Fi(a)}n.setRequestHeader=function(a,d){this.u.append(a,d)},n.getResponseHeader=function(a){return this.h&&this.h.get(a.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const a=[],d=this.h.entries();for(var h=d.next();!h.done;)h=h.value,a.push(h[0]+": "+h[1]),h=d.next();return a.join(`\r
`)};function Fi(a){a.onreadystatechange&&a.onreadystatechange.call(a)}Object.defineProperty(Hs.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(a){this.m=a?"include":"same-origin"}});function Iu(a){let d="";return q(a,function(h,g){d+=g,d+=":",d+=h,d+=`\r
`}),d}function Pa(a,d,h){e:{for(g in h){var g=!1;break e}g=!0}g||(h=Iu(h),typeof a=="string"?h!=null&&encodeURIComponent(String(h)):Ee(a,d,h))}function Me(a){_e.call(this),this.headers=new Map,this.o=a||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}I(Me,_e);var vg=/^https?$/i,wg=["POST","PUT"];n=Me.prototype,n.Ha=function(a){this.J=a},n.ea=function(a,d,h,g){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+a);d=d?d.toUpperCase():"GET",this.D=a,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():Tr.g(),this.v=this.o?Ct(this.o):Ct(Tr),this.g.onreadystatechange=p(this.Ea,this);try{this.B=!0,this.g.open(d,String(a),!0),this.B=!1}catch(P){Su(this,P);return}if(a=h||"",h=new Map(this.headers),g)if(Object.getPrototypeOf(g)===Object.prototype)for(var R in g)h.set(R,g[R]);else if(typeof g.keys=="function"&&typeof g.get=="function")for(const P of g.keys())h.set(P,g.get(P));else throw Error("Unknown input type for opt_headers: "+String(g));g=Array.from(h.keys()).find(P=>P.toLowerCase()=="content-type"),R=l.FormData&&a instanceof l.FormData,!(0<=Array.prototype.indexOf.call(wg,d,void 0))||g||R||h.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[P,V]of h)this.g.setRequestHeader(P,V);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{Ru(this),this.u=!0,this.g.send(a),this.u=!1}catch(P){Su(this,P)}};function Su(a,d){a.h=!1,a.g&&(a.j=!0,a.g.abort(),a.j=!1),a.l=d,a.m=5,Au(a),Ys(a)}function Au(a){a.A||(a.A=!0,fe(a,"complete"),fe(a,"error"))}n.abort=function(a){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=a||7,fe(this,"complete"),fe(this,"abort"),Ys(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Ys(this,!0)),Me.aa.N.call(this)},n.Ea=function(){this.s||(this.B||this.u||this.j?xu(this):this.bb())},n.bb=function(){xu(this)};function xu(a){if(a.h&&typeof o<"u"&&(!a.v[1]||En(a)!=4||a.Z()!=2)){if(a.u&&En(a)==4)Zt(a.Ea,0,a);else if(fe(a,"readystatechange"),En(a)==4){a.h=!1;try{const V=a.Z();e:switch(V){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var d=!0;break e;default:d=!1}var h;if(!(h=d)){var g;if(g=V===0){var R=String(a.D).match(yu)[1]||null;!R&&l.self&&l.self.location&&(R=l.self.location.protocol.slice(0,-1)),g=!vg.test(R?R.toLowerCase():"")}h=g}if(h)fe(a,"complete"),fe(a,"success");else{a.m=6;try{var P=2<En(a)?a.g.statusText:""}catch{P=""}a.l=P+" ["+a.Z()+"]",Au(a)}}finally{Ys(a)}}}}function Ys(a,d){if(a.g){Ru(a);const h=a.g,g=a.v[0]?()=>{}:null;a.g=null,a.v=null,d||fe(a,"ready");try{h.onreadystatechange=g}catch{}}}function Ru(a){a.I&&(l.clearTimeout(a.I),a.I=null)}n.isActive=function(){return!!this.g};function En(a){return a.g?a.g.readyState:0}n.Z=function(){try{return 2<En(this)?this.g.status:-1}catch{return-1}},n.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.Oa=function(a){if(this.g){var d=this.g.responseText;return a&&d.indexOf(a)==0&&(d=d.substring(a.length)),vt(d)}};function ku(a){try{if(!a.g)return null;if("response"in a.g)return a.g.response;switch(a.H){case"":case"text":return a.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in a.g)return a.g.mozResponseArrayBuffer}return null}catch{return null}}function bg(a){const d={};a=(a.g&&2<=En(a)&&a.g.getAllResponseHeaders()||"").split(`\r
`);for(let g=0;g<a.length;g++){if(C(a[g]))continue;var h=E(a[g]);const R=h[0];if(h=h[1],typeof h!="string")continue;h=h.trim();const P=d[R]||[];d[R]=P,P.push(h)}T(d,function(g){return g.join(", ")})}n.Ba=function(){return this.m},n.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function $i(a,d,h){return h&&h.internalChannelParams&&h.internalChannelParams[a]||d}function Pu(a){this.Aa=0,this.i=[],this.j=new ht,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=$i("failFast",!1,a),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=$i("baseRetryDelayMs",5e3,a),this.cb=$i("retryDelaySeedMs",1e4,a),this.Wa=$i("forwardChannelMaxRetries",2,a),this.wa=$i("forwardChannelRequestTimeoutMs",2e4,a),this.pa=a&&a.xmlHttpFactory||void 0,this.Xa=a&&a.Tb||void 0,this.Ca=a&&a.useFetchStreams||!1,this.L=void 0,this.J=a&&a.supportsCrossDomainXhr||!1,this.K="",this.h=new du(a&&a.concurrentRequestLimit),this.Da=new gg,this.P=a&&a.fastHandshake||!1,this.O=a&&a.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=a&&a.Rb||!1,a&&a.xa&&this.j.xa(),a&&a.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&a&&a.detectBufferingProxy||!1,this.ja=void 0,a&&a.longPollingTimeout&&0<a.longPollingTimeout&&(this.ja=a.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}n=Pu.prototype,n.la=8,n.G=1,n.connect=function(a,d,h,g){ue(0),this.W=a,this.H=d||{},h&&g!==void 0&&(this.H.OSID=h,this.H.OAID=g),this.F=this.X,this.I=Fu(this,null,this.W),Ws(this)};function Ca(a){if(Cu(a),a.G==3){var d=a.U++,h=_n(a.I);if(Ee(h,"SID",a.K),Ee(h,"RID",d),Ee(h,"TYPE","terminate"),zi(a,h),d=new Qn(a,a.j,d),d.L=2,d.v=Us(_n(h)),h=!1,l.navigator&&l.navigator.sendBeacon)try{h=l.navigator.sendBeacon(d.v.toString(),"")}catch{}!h&&l.Image&&(new Image().src=d.v,h=!0),h||(d.g=$u(d.j,null),d.g.ea(d.v)),d.F=Date.now(),Fs(d)}Vu(a)}function js(a){a.g&&(Da(a),a.g.cancel(),a.g=null)}function Cu(a){js(a),a.u&&(l.clearTimeout(a.u),a.u=null),Gs(a),a.h.cancel(),a.s&&(typeof a.s=="number"&&l.clearTimeout(a.s),a.s=null)}function Ws(a){if(!hu(a.h)&&!a.s){a.s=!0;var d=a.Ga;ee||Ce(),ne||(ee(),ne=!0),te.add(d,a),a.B=0}}function _g(a,d){return fu(a.h)>=a.h.j-(a.s?1:0)?!1:a.s?(a.i=d.D.concat(a.i),!0):a.G==1||a.G==2||a.B>=(a.Va?0:a.Wa)?!1:(a.s=ze(p(a.Ga,a,d),Ou(a,a.B)),a.B++,!0)}n.Ga=function(a){if(this.s)if(this.s=null,this.G==1){if(!a){this.U=Math.floor(1e5*Math.random()),a=this.U++;const R=new Qn(this,this.j,a);let P=this.o;if(this.S&&(P?(P=v(P),b(P,this.S)):P=this.S),this.m!==null||this.O||(R.H=P,P=null),this.P)e:{for(var d=0,h=0;h<this.i.length;h++){t:{var g=this.i[h];if("__data__"in g.map&&(g=g.map.__data__,typeof g=="string")){g=g.length;break t}g=void 0}if(g===void 0)break;if(d+=g,4096<d){d=h;break e}if(d===4096||h===this.i.length-1){d=h+1;break e}}d=1e3}else d=1e3;d=Du(this,R,d),h=_n(this.I),Ee(h,"RID",a),Ee(h,"CVER",22),this.D&&Ee(h,"X-HTTP-Session-Id",this.D),zi(this,h),P&&(this.O?d="headers="+encodeURIComponent(String(Iu(P)))+"&"+d:this.m&&Pa(h,this.m,P)),ka(this.h,R),this.Ua&&Ee(h,"TYPE","init"),this.P?(Ee(h,"$req",d),Ee(h,"SID","null"),R.T=!0,Sa(R,h,null)):Sa(R,h,d),this.G=2}}else this.G==3&&(a?Mu(this,a):this.i.length==0||hu(this.h)||Mu(this))};function Mu(a,d){var h;d?h=d.l:h=a.U++;const g=_n(a.I);Ee(g,"SID",a.K),Ee(g,"RID",h),Ee(g,"AID",a.T),zi(a,g),a.m&&a.o&&Pa(g,a.m,a.o),h=new Qn(a,a.j,h,a.B+1),a.m===null&&(h.H=a.o),d&&(a.i=d.D.concat(a.i)),d=Du(a,h,1e3),h.I=Math.round(.5*a.wa)+Math.round(.5*a.wa*Math.random()),ka(a.h,h),Sa(h,g,d)}function zi(a,d){a.H&&q(a.H,function(h,g){Ee(d,g,h)}),a.l&&gu({},function(h,g){Ee(d,g,h)})}function Du(a,d,h){h=Math.min(a.i.length,h);var g=a.l?p(a.l.Na,a.l,a):null;e:{var R=a.i;let P=-1;for(;;){const V=["count="+h];P==-1?0<h?(P=R[0].g,V.push("ofs="+P)):P=0:V.push("ofs="+P);let we=!0;for(let Ye=0;Ye<h;Ye++){let de=R[Ye].g;const et=R[Ye].map;if(de-=P,0>de)P=Math.max(0,R[Ye].g-100),we=!1;else try{yg(et,V,"req"+de+"_")}catch{g&&g(et)}}if(we){g=V.join("&");break e}}}return a=a.i.splice(0,h),d.D=a,g}function Lu(a){if(!a.g&&!a.u){a.Y=1;var d=a.Fa;ee||Ce(),ne||(ee(),ne=!0),te.add(d,a),a.v=0}}function Ma(a){return a.g||a.u||3<=a.v?!1:(a.Y++,a.u=ze(p(a.Fa,a),Ou(a,a.v)),a.v++,!0)}n.Fa=function(){if(this.u=null,Nu(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var a=2*this.R;this.j.info("BP detection timer enabled: "+a),this.A=ze(p(this.ab,this),a)}},n.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,ue(10),js(this),Nu(this))};function Da(a){a.A!=null&&(l.clearTimeout(a.A),a.A=null)}function Nu(a){a.g=new Qn(a,a.j,"rpc",a.Y),a.m===null&&(a.g.H=a.o),a.g.O=0;var d=_n(a.qa);Ee(d,"RID","rpc"),Ee(d,"SID",a.K),Ee(d,"AID",a.T),Ee(d,"CI",a.F?"0":"1"),!a.F&&a.ja&&Ee(d,"TO",a.ja),Ee(d,"TYPE","xmlhttp"),zi(a,d),a.m&&a.o&&Pa(d,a.m,a.o),a.L&&(a.g.I=a.L);var h=a.g;a=a.ia,h.L=1,h.v=Us(_n(d)),h.m=null,h.P=!0,lu(h,a)}n.Za=function(){this.C!=null&&(this.C=null,js(this),Ma(this),ue(19))};function Gs(a){a.C!=null&&(l.clearTimeout(a.C),a.C=null)}function Bu(a,d){var h=null;if(a.g==d){Gs(a),Da(a),a.g=null;var g=2}else if(Ra(a.h,d))h=d.D,pu(a.h,d),g=1;else return;if(a.G!=0){if(d.o)if(g==1){h=d.m?d.m.length:0,d=Date.now()-d.F;var R=a.B;g=Er(),fe(g,new Ve(g,h)),Ws(a)}else Lu(a);else if(R=d.s,R==3||R==0&&0<d.X||!(g==1&&_g(a,d)||g==2&&Ma(a)))switch(h&&0<h.length&&(d=a.h,d.i=d.i.concat(h)),R){case 1:Ar(a,5);break;case 4:Ar(a,10);break;case 3:Ar(a,6);break;default:Ar(a,2)}}}function Ou(a,d){let h=a.Ta+Math.floor(Math.random()*a.cb);return a.isActive()||(h*=2),h*d}function Ar(a,d){if(a.j.info("Error code "+d),d==2){var h=p(a.fb,a),g=a.Xa;const R=!g;g=new Sr(g||"//www.google.com/images/cleardot.gif"),l.location&&l.location.protocol=="http"||$s(g,"https"),Us(g),R?pg(g.toString(),h):mg(g.toString(),h)}else ue(2);a.G=0,a.l&&a.l.sa(d),Vu(a),Cu(a)}n.fb=function(a){a?(this.j.info("Successfully pinged google.com"),ue(2)):(this.j.info("Failed to ping google.com"),ue(1))};function Vu(a){if(a.G=0,a.ka=[],a.l){const d=mu(a.h);(d.length!=0||a.i.length!=0)&&(x(a.ka,d),x(a.ka,a.i),a.h.i.length=0,S(a.i),a.i.length=0),a.l.ra()}}function Fu(a,d,h){var g=h instanceof Sr?_n(h):new Sr(h);if(g.g!="")d&&(g.g=d+"."+g.g),zs(g,g.s);else{var R=l.location;g=R.protocol,d=d?d+"."+R.hostname:R.hostname,R=+R.port;var P=new Sr(null);g&&$s(P,g),d&&(P.g=d),R&&zs(P,R),h&&(P.l=h),g=P}return h=a.D,d=a.ya,h&&d&&Ee(g,h,d),Ee(g,"VER",a.la),zi(a,g),g}function $u(a,d,h){if(d&&!a.J)throw Error("Can't create secondary domain capable XhrIo object.");return d=a.Ca&&!a.pa?new Me(new qs({eb:h})):new Me(a.pa),d.Ha(a.J),d}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function zu(){}n=zu.prototype,n.ua=function(){},n.ta=function(){},n.sa=function(){},n.ra=function(){},n.isActive=function(){return!0},n.Na=function(){};function Ks(){}Ks.prototype.g=function(a,d){return new At(a,d)};function At(a,d){_e.call(this),this.g=new Pu(d),this.l=a,this.h=d&&d.messageUrlParams||null,a=d&&d.messageHeaders||null,d&&d.clientProtocolHeaderRequired&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"}),this.g.o=a,a=d&&d.initMessageHeaders||null,d&&d.messageContentType&&(a?a["X-WebChannel-Content-Type"]=d.messageContentType:a={"X-WebChannel-Content-Type":d.messageContentType}),d&&d.va&&(a?a["X-WebChannel-Client-Profile"]=d.va:a={"X-WebChannel-Client-Profile":d.va}),this.g.S=a,(a=d&&d.Sb)&&!C(a)&&(this.g.m=a),this.v=d&&d.supportsCrossDomainXhr||!1,this.u=d&&d.sendRawJson||!1,(d=d&&d.httpSessionIdParam)&&!C(d)&&(this.g.D=d,a=this.h,a!==null&&d in a&&(a=this.h,d in a&&delete a[d])),this.j=new Jr(this)}I(At,_e),At.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},At.prototype.close=function(){Ca(this.g)},At.prototype.o=function(a){var d=this.g;if(typeof a=="string"){var h={};h.__data__=a,a=h}else this.u&&(h={},h.__data__=Ze(a),a=h);d.i.push(new ig(d.Ya++,a)),d.G==3&&Ws(d)},At.prototype.N=function(){this.g.l=null,delete this.j,Ca(this.g),delete this.g,At.aa.N.call(this)};function Uu(a){Pi.call(this),a.__headers__&&(this.headers=a.__headers__,this.statusCode=a.__status__,delete a.__headers__,delete a.__status__);var d=a.__sm__;if(d){e:{for(const h in d){a=h;break e}a=void 0}(this.i=a)&&(a=this.i,d=d!==null&&a in d?d[a]:void 0),this.data=d}else this.data=a}I(Uu,Pi);function qu(){_r.call(this),this.status=1}I(qu,_r);function Jr(a){this.g=a}I(Jr,zu),Jr.prototype.ua=function(){fe(this.g,"a")},Jr.prototype.ta=function(a){fe(this.g,new Uu(a))},Jr.prototype.sa=function(a){fe(this.g,new qu)},Jr.prototype.ra=function(){fe(this.g,"b")},Ks.prototype.createWebChannel=Ks.prototype.g,At.prototype.send=At.prototype.o,At.prototype.open=At.prototype.m,At.prototype.close=At.prototype.close,xf=function(){return new Ks},Af=function(){return Er()},Sf=bn,al={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},Ie.NO_ERROR=0,Ie.TIMEOUT=8,Ie.HTTP_ERROR=6,lo=Ie,Kn.COMPLETE="complete",If=Kn,zt.EventType=dt,dt.OPEN="a",dt.CLOSE="b",dt.ERROR="c",dt.MESSAGE="d",_e.prototype.listen=_e.prototype.K,ji=zt,Me.prototype.listenOnce=Me.prototype.L,Me.prototype.getLastError=Me.prototype.Ka,Me.prototype.getLastErrorCode=Me.prototype.Ba,Me.prototype.getStatus=Me.prototype.Z,Me.prototype.getResponseJson=Me.prototype.Oa,Me.prototype.getResponseText=Me.prototype.oa,Me.prototype.send=Me.prototype.ea,Me.prototype.setWithCredentials=Me.prototype.Ha,Tf=Me}).apply(typeof Zs<"u"?Zs:typeof self<"u"?self:typeof window<"u"?window:{});const Td="@firebase/firestore";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rt{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}rt.UNAUTHENTICATED=new rt(null),rt.GOOGLE_CREDENTIALS=new rt("google-credentials-uid"),rt.FIRST_PARTY=new rt("first-party-uid"),rt.MOCK_USER=new rt("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Si="10.14.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $r=new Bl("@firebase/firestore");function Ui(){return $r.logLevel}function z(n,...e){if($r.logLevel<=oe.DEBUG){const t=e.map(Ql);$r.debug(`Firestore (${Si}): ${n}`,...t)}}function Nn(n,...e){if($r.logLevel<=oe.ERROR){const t=e.map(Ql);$r.error(`Firestore (${Si}): ${n}`,...t)}}function fi(n,...e){if($r.logLevel<=oe.WARN){const t=e.map(Ql);$r.warn(`Firestore (${Si}): ${n}`,...t)}}function Ql(n){if(typeof n=="string")return n;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
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
 */function G(n="Unexpected state"){const e=`FIRESTORE (${Si}) INTERNAL ASSERTION FAILED: `+n;throw Nn(e),new Error(e)}function me(n,e){n||G()}function J(n,e){return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const M={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class U extends $n{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pn{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rf{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class qw{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(rt.UNAUTHENTICATED))}shutdown(){}}class Hw{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class Yw{constructor(e){this.t=e,this.currentUser=rt.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){me(this.o===void 0);let r=this.i;const i=c=>this.i!==r?(r=this.i,t(c)):Promise.resolve();let s=new Pn;this.o=()=>{this.i++,this.currentUser=this.u(),s.resolve(),s=new Pn,e.enqueueRetryable(()=>i(this.currentUser))};const o=()=>{const c=s;e.enqueueRetryable(async()=>{await c.promise,await i(this.currentUser)})},l=c=>{z("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=c,this.o&&(this.auth.addAuthTokenListener(this.o),o())};this.t.onInit(c=>l(c)),setTimeout(()=>{if(!this.auth){const c=this.t.getImmediate({optional:!0});c?l(c):(z("FirebaseAuthCredentialsProvider","Auth not yet detected"),s.resolve(),s=new Pn)}},0),o()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(r=>this.i!==e?(z("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(me(typeof r.accessToken=="string"),new Rf(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return me(e===null||typeof e=="string"),new rt(e)}}class jw{constructor(e,t,r){this.l=e,this.h=t,this.P=r,this.type="FirstParty",this.user=rt.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class Ww{constructor(e,t,r){this.l=e,this.h=t,this.P=r}getToken(){return Promise.resolve(new jw(this.l,this.h,this.P))}start(e,t){e.enqueueRetryable(()=>t(rt.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class Gw{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class Kw{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,t){me(this.o===void 0);const r=s=>{s.error!=null&&z("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${s.error.message}`);const o=s.token!==this.R;return this.R=s.token,z("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?t(s.token):Promise.resolve()};this.o=s=>{e.enqueueRetryable(()=>r(s))};const i=s=>{z("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=s,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(s=>i(s)),setTimeout(()=>{if(!this.appCheck){const s=this.A.getImmediate({optional:!0});s?i(s):z("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(t=>t?(me(typeof t.token=="string"),this.R=t.token,new Gw(t.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qw(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let r=0;r<n;r++)t[r]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kf{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=Math.floor(256/e.length)*e.length;let r="";for(;r.length<20;){const i=Qw(40);for(let s=0;s<i.length;++s)r.length<20&&i[s]<t&&(r+=e.charAt(i[s]%e.length))}return r}}function he(n,e){return n<e?-1:n>e?1:0}function pi(n,e,t){return n.length===e.length&&n.every((r,i)=>t(r,e[i]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $e{constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new U(M.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new U(M.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<-62135596800)throw new U(M.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new U(M.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return $e.fromMillis(Date.now())}static fromDate(e){return $e.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),r=Math.floor(1e6*(e-1e3*t));return new $e(t,r)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?he(this.nanoseconds,e.nanoseconds):he(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Q{constructor(e){this.timestamp=e}static fromTimestamp(e){return new Q(e)}static min(){return new Q(new $e(0,0))}static max(){return new Q(new $e(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ls{constructor(e,t,r){t===void 0?t=0:t>e.length&&G(),r===void 0?r=e.length-t:r>e.length-t&&G(),this.segments=e,this.offset=t,this.len=r}get length(){return this.len}isEqual(e){return ls.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof ls?e.forEach(r=>{t.push(r)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,r=this.limit();t<r;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const r=Math.min(e.length,t.length);for(let i=0;i<r;i++){const s=e.get(i),o=t.get(i);if(s<o)return-1;if(s>o)return 1}return e.length<t.length?-1:e.length>t.length?1:0}}class xe extends ls{construct(e,t,r){return new xe(e,t,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const r of e){if(r.indexOf("//")>=0)throw new U(M.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);t.push(...r.split("/").filter(i=>i.length>0))}return new xe(t)}static emptyPath(){return new xe([])}}const Jw=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class We extends ls{construct(e,t,r){return new We(e,t,r)}static isValidIdentifier(e){return Jw.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),We.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new We(["__name__"])}static fromServerFormat(e){const t=[];let r="",i=0;const s=()=>{if(r.length===0)throw new U(M.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(r),r=""};let o=!1;for(;i<e.length;){const l=e[i];if(l==="\\"){if(i+1===e.length)throw new U(M.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const c=e[i+1];if(c!=="\\"&&c!=="."&&c!=="`")throw new U(M.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=c,i+=2}else l==="`"?(o=!o,i++):l!=="."||o?(r+=l,i++):(s(),i++)}if(s(),o)throw new U(M.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new We(t)}static emptyPath(){return new We([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Y{constructor(e){this.path=e}static fromPath(e){return new Y(xe.fromString(e))}static fromName(e){return new Y(xe.fromString(e).popFirst(5))}static empty(){return new Y(xe.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&xe.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return xe.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new Y(new xe(e.slice()))}}function Xw(n,e){const t=n.toTimestamp().seconds,r=n.toTimestamp().nanoseconds+1,i=Q.fromTimestamp(r===1e9?new $e(t+1,0):new $e(t,r));return new fr(i,Y.empty(),e)}function Zw(n){return new fr(n.readTime,n.key,-1)}class fr{constructor(e,t,r){this.readTime=e,this.documentKey=t,this.largestBatchId=r}static min(){return new fr(Q.min(),Y.empty(),-1)}static max(){return new fr(Q.max(),Y.empty(),-1)}}function eb(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=Y.comparator(n.documentKey,e.documentKey),t!==0?t:he(n.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tb="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class nb{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function xs(n){if(n.code!==M.FAILED_PRECONDITION||n.message!==tb)throw n;z("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class L{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)},t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&G(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new L((r,i)=>{this.nextCallback=s=>{this.wrapSuccess(e,s).next(r,i)},this.catchCallback=s=>{this.wrapFailure(t,s).next(r,i)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{const t=e();return t instanceof L?t:L.resolve(t)}catch(t){return L.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):L.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):L.reject(t)}static resolve(e){return new L((t,r)=>{t(e)})}static reject(e){return new L((t,r)=>{r(e)})}static waitFor(e){return new L((t,r)=>{let i=0,s=0,o=!1;e.forEach(l=>{++i,l.next(()=>{++s,o&&s===i&&t()},c=>r(c))}),o=!0,s===i&&t()})}static or(e){let t=L.resolve(!1);for(const r of e)t=t.next(i=>i?L.resolve(i):r());return t}static forEach(e,t){const r=[];return e.forEach((i,s)=>{r.push(t.call(this,i,s))}),this.waitFor(r)}static mapArray(e,t){return new L((r,i)=>{const s=e.length,o=new Array(s);let l=0;for(let c=0;c<s;c++){const u=c;t(e[u]).next(f=>{o[u]=f,++l,l===s&&r(o)},f=>i(f))}})}static doWhile(e,t){return new L((r,i)=>{const s=()=>{e()===!0?t().next(()=>{s()},i):r()};s()})}}function rb(n){const e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function Rs(n){return n.name==="IndexedDbTransactionError"}/**
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
 */class Jl{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=r=>this.ie(r),this.se=r=>t.writeSequenceNumber(r))}ie(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.se&&this.se(e),e}}Jl.oe=-1;function Go(n){return n==null}function Ao(n){return n===0&&1/n==-1/0}function ib(n){return typeof n=="number"&&Number.isInteger(n)&&!Ao(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Id(n){let e=0;for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function Yr(n,e){for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function Pf(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pe{constructor(e,t){this.comparator=e,this.root=t||je.EMPTY}insert(e,t){return new Pe(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,je.BLACK,null,null))}remove(e){return new Pe(this.comparator,this.root.remove(e,this.comparator).copy(null,null,je.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const r=this.comparator(e,t.key);if(r===0)return t.value;r<0?t=t.left:r>0&&(t=t.right)}return null}indexOf(e){let t=0,r=this.root;for(;!r.isEmpty();){const i=this.comparator(e,r.key);if(i===0)return t+r.left.size;i<0?r=r.left:(t+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,r)=>(e(t,r),!1))}toString(){const e=[];return this.inorderTraversal((t,r)=>(e.push(`${t}:${r}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new eo(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new eo(this.root,e,this.comparator,!1)}getReverseIterator(){return new eo(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new eo(this.root,e,this.comparator,!0)}}class eo{constructor(e,t,r,i){this.isReverse=i,this.nodeStack=[];let s=1;for(;!e.isEmpty();)if(s=t?r(e.key,t):1,t&&i&&(s*=-1),s<0)e=this.isReverse?e.left:e.right;else{if(s===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class je{constructor(e,t,r,i,s){this.key=e,this.value=t,this.color=r??je.RED,this.left=i??je.EMPTY,this.right=s??je.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,r,i,s){return new je(e??this.key,t??this.value,r??this.color,i??this.left,s??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,r){let i=this;const s=r(e,i.key);return i=s<0?i.copy(null,null,null,i.left.insert(e,t,r),null):s===0?i.copy(null,t,null,null,null):i.copy(null,null,null,null,i.right.insert(e,t,r)),i.fixUp()}removeMin(){if(this.left.isEmpty())return je.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let r,i=this;if(t(e,i.key)<0)i.left.isEmpty()||i.left.isRed()||i.left.left.isRed()||(i=i.moveRedLeft()),i=i.copy(null,null,null,i.left.remove(e,t),null);else{if(i.left.isRed()&&(i=i.rotateRight()),i.right.isEmpty()||i.right.isRed()||i.right.left.isRed()||(i=i.moveRedRight()),t(e,i.key)===0){if(i.right.isEmpty())return je.EMPTY;r=i.right.min(),i=i.copy(r.key,r.value,null,null,i.right.removeMin())}i=i.copy(null,null,null,null,i.right.remove(e,t))}return i.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,je.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,je.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw G();const e=this.left.check();if(e!==this.right.check())throw G();return e+(this.isRed()?0:1)}}je.EMPTY=null,je.RED=!0,je.BLACK=!1;je.EMPTY=new class{constructor(){this.size=0}get key(){throw G()}get value(){throw G()}get color(){throw G()}get left(){throw G()}get right(){throw G()}copy(e,t,r,i,s){return this}insert(e,t,r){return new je(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ge{constructor(e){this.comparator=e,this.data=new Pe(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,r)=>(e(t),!1))}forEachInRange(e,t){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const i=r.getNext();if(this.comparator(i.key,e[1])>=0)return;t(i.key)}}forEachWhile(e,t){let r;for(r=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Sd(this.data.getIterator())}getIteratorFrom(e){return new Sd(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(r=>{t=t.add(r)}),t}isEqual(e){if(!(e instanceof Ge)||this.size!==e.size)return!1;const t=this.data.getIterator(),r=e.data.getIterator();for(;t.hasNext();){const i=t.getNext().key,s=r.getNext().key;if(this.comparator(i,s)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(t=>{e.push(t)}),e}toString(){const e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){const t=new Ge(this.comparator);return t.data=e,t}}class Sd{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xt{constructor(e){this.fields=e,e.sort(We.comparator)}static empty(){return new xt([])}unionWith(e){let t=new Ge(We.comparator);for(const r of this.fields)t=t.add(r);for(const r of e)t=t.add(r);return new xt(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return pi(this.fields,e.fields,(t,r)=>t.isEqual(r))}}/**
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
 */class Cf extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qe{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(i){try{return atob(i)}catch(s){throw typeof DOMException<"u"&&s instanceof DOMException?new Cf("Invalid base64 string: "+s):s}}(e);return new Qe(t)}static fromUint8Array(e){const t=function(i){let s="";for(let o=0;o<i.length;++o)s+=String.fromCharCode(i[o]);return s}(e);return new Qe(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(t){return btoa(t)}(this.binaryString)}toUint8Array(){return function(t){const r=new Uint8Array(t.length);for(let i=0;i<t.length;i++)r[i]=t.charCodeAt(i);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return he(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}Qe.EMPTY_BYTE_STRING=new Qe("");const sb=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function pr(n){if(me(!!n),typeof n=="string"){let e=0;const t=sb.exec(n);if(me(!!t),t[1]){let i=t[1];i=(i+"000000000").substr(0,9),e=Number(i)}const r=new Date(n);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:Le(n.seconds),nanos:Le(n.nanos)}}function Le(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function zr(n){return typeof n=="string"?Qe.fromBase64String(n):Qe.fromUint8Array(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xl(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="server_timestamp"}function Zl(n){const e=n.mapValue.fields.__previous_value__;return Xl(e)?Zl(e):e}function cs(n){const e=pr(n.mapValue.fields.__local_write_time__.timestampValue);return new $e(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ob{constructor(e,t,r,i,s,o,l,c,u){this.databaseId=e,this.appId=t,this.persistenceKey=r,this.host=i,this.ssl=s,this.forceLongPolling=o,this.autoDetectLongPolling=l,this.longPollingOptions=c,this.useFetchStreams=u}}class us{constructor(e,t){this.projectId=e,this.database=t||"(default)"}static empty(){return new us("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof us&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const to={mapValue:{}};function Ur(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?Xl(n)?4:lb(n)?9007199254740991:ab(n)?10:11:G()}function ln(n,e){if(n===e)return!0;const t=Ur(n);if(t!==Ur(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return cs(n).isEqual(cs(e));case 3:return function(i,s){if(typeof i.timestampValue=="string"&&typeof s.timestampValue=="string"&&i.timestampValue.length===s.timestampValue.length)return i.timestampValue===s.timestampValue;const o=pr(i.timestampValue),l=pr(s.timestampValue);return o.seconds===l.seconds&&o.nanos===l.nanos}(n,e);case 5:return n.stringValue===e.stringValue;case 6:return function(i,s){return zr(i.bytesValue).isEqual(zr(s.bytesValue))}(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return function(i,s){return Le(i.geoPointValue.latitude)===Le(s.geoPointValue.latitude)&&Le(i.geoPointValue.longitude)===Le(s.geoPointValue.longitude)}(n,e);case 2:return function(i,s){if("integerValue"in i&&"integerValue"in s)return Le(i.integerValue)===Le(s.integerValue);if("doubleValue"in i&&"doubleValue"in s){const o=Le(i.doubleValue),l=Le(s.doubleValue);return o===l?Ao(o)===Ao(l):isNaN(o)&&isNaN(l)}return!1}(n,e);case 9:return pi(n.arrayValue.values||[],e.arrayValue.values||[],ln);case 10:case 11:return function(i,s){const o=i.mapValue.fields||{},l=s.mapValue.fields||{};if(Id(o)!==Id(l))return!1;for(const c in o)if(o.hasOwnProperty(c)&&(l[c]===void 0||!ln(o[c],l[c])))return!1;return!0}(n,e);default:return G()}}function ds(n,e){return(n.values||[]).find(t=>ln(t,e))!==void 0}function mi(n,e){if(n===e)return 0;const t=Ur(n),r=Ur(e);if(t!==r)return he(t,r);switch(t){case 0:case 9007199254740991:return 0;case 1:return he(n.booleanValue,e.booleanValue);case 2:return function(s,o){const l=Le(s.integerValue||s.doubleValue),c=Le(o.integerValue||o.doubleValue);return l<c?-1:l>c?1:l===c?0:isNaN(l)?isNaN(c)?0:-1:1}(n,e);case 3:return Ad(n.timestampValue,e.timestampValue);case 4:return Ad(cs(n),cs(e));case 5:return he(n.stringValue,e.stringValue);case 6:return function(s,o){const l=zr(s),c=zr(o);return l.compareTo(c)}(n.bytesValue,e.bytesValue);case 7:return function(s,o){const l=s.split("/"),c=o.split("/");for(let u=0;u<l.length&&u<c.length;u++){const f=he(l[u],c[u]);if(f!==0)return f}return he(l.length,c.length)}(n.referenceValue,e.referenceValue);case 8:return function(s,o){const l=he(Le(s.latitude),Le(o.latitude));return l!==0?l:he(Le(s.longitude),Le(o.longitude))}(n.geoPointValue,e.geoPointValue);case 9:return xd(n.arrayValue,e.arrayValue);case 10:return function(s,o){var l,c,u,f;const m=s.fields||{},p=o.fields||{},y=(l=m.value)===null||l===void 0?void 0:l.arrayValue,I=(c=p.value)===null||c===void 0?void 0:c.arrayValue,S=he(((u=y==null?void 0:y.values)===null||u===void 0?void 0:u.length)||0,((f=I==null?void 0:I.values)===null||f===void 0?void 0:f.length)||0);return S!==0?S:xd(y,I)}(n.mapValue,e.mapValue);case 11:return function(s,o){if(s===to.mapValue&&o===to.mapValue)return 0;if(s===to.mapValue)return 1;if(o===to.mapValue)return-1;const l=s.fields||{},c=Object.keys(l),u=o.fields||{},f=Object.keys(u);c.sort(),f.sort();for(let m=0;m<c.length&&m<f.length;++m){const p=he(c[m],f[m]);if(p!==0)return p;const y=mi(l[c[m]],u[f[m]]);if(y!==0)return y}return he(c.length,f.length)}(n.mapValue,e.mapValue);default:throw G()}}function Ad(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return he(n,e);const t=pr(n),r=pr(e),i=he(t.seconds,r.seconds);return i!==0?i:he(t.nanos,r.nanos)}function xd(n,e){const t=n.values||[],r=e.values||[];for(let i=0;i<t.length&&i<r.length;++i){const s=mi(t[i],r[i]);if(s)return s}return he(t.length,r.length)}function gi(n){return ll(n)}function ll(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?function(t){const r=pr(t);return`time(${r.seconds},${r.nanos})`}(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?function(t){return zr(t).toBase64()}(n.bytesValue):"referenceValue"in n?function(t){return Y.fromName(t).toString()}(n.referenceValue):"geoPointValue"in n?function(t){return`geo(${t.latitude},${t.longitude})`}(n.geoPointValue):"arrayValue"in n?function(t){let r="[",i=!0;for(const s of t.values||[])i?i=!1:r+=",",r+=ll(s);return r+"]"}(n.arrayValue):"mapValue"in n?function(t){const r=Object.keys(t.fields||{}).sort();let i="{",s=!0;for(const o of r)s?s=!1:i+=",",i+=`${o}:${ll(t.fields[o])}`;return i+"}"}(n.mapValue):G()}function cl(n){return!!n&&"integerValue"in n}function ec(n){return!!n&&"arrayValue"in n}function Rd(n){return!!n&&"nullValue"in n}function kd(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function co(n){return!!n&&"mapValue"in n}function ab(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="__vector__"}function Xi(n){if(n.geoPointValue)return{geoPointValue:Object.assign({},n.geoPointValue)};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:Object.assign({},n.timestampValue)};if(n.mapValue){const e={mapValue:{fields:{}}};return Yr(n.mapValue.fields,(t,r)=>e.mapValue.fields[t]=Xi(r)),e}if(n.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Xi(n.arrayValue.values[t]);return e}return Object.assign({},n)}function lb(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wt{constructor(e){this.value=e}static empty(){return new wt({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let r=0;r<e.length-1;++r)if(t=(t.mapValue.fields||{})[e.get(r)],!co(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Xi(t)}setAll(e){let t=We.emptyPath(),r={},i=[];e.forEach((o,l)=>{if(!t.isImmediateParentOf(l)){const c=this.getFieldsMap(t);this.applyChanges(c,r,i),r={},i=[],t=l.popLast()}o?r[l.lastSegment()]=Xi(o):i.push(l.lastSegment())});const s=this.getFieldsMap(t);this.applyChanges(s,r,i)}delete(e){const t=this.field(e.popLast());co(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return ln(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let r=0;r<e.length;++r){let i=t.mapValue.fields[e.get(r)];co(i)&&i.mapValue.fields||(i={mapValue:{fields:{}}},t.mapValue.fields[e.get(r)]=i),t=i}return t.mapValue.fields}applyChanges(e,t,r){Yr(t,(i,s)=>e[i]=s);for(const i of r)delete e[i]}clone(){return new wt(Xi(this.value))}}function Mf(n){const e=[];return Yr(n.fields,(t,r)=>{const i=new We([t]);if(co(r)){const s=Mf(r.mapValue).fields;if(s.length===0)e.push(i);else for(const o of s)e.push(i.child(o))}else e.push(i)}),new xt(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class it{constructor(e,t,r,i,s,o,l){this.key=e,this.documentType=t,this.version=r,this.readTime=i,this.createTime=s,this.data=o,this.documentState=l}static newInvalidDocument(e){return new it(e,0,Q.min(),Q.min(),Q.min(),wt.empty(),0)}static newFoundDocument(e,t,r,i){return new it(e,1,t,Q.min(),r,i,0)}static newNoDocument(e,t){return new it(e,2,t,Q.min(),Q.min(),wt.empty(),0)}static newUnknownDocument(e,t){return new it(e,3,t,Q.min(),Q.min(),wt.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(Q.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=wt.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=wt.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=Q.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof it&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new it(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class xo{constructor(e,t){this.position=e,this.inclusive=t}}function Pd(n,e,t){let r=0;for(let i=0;i<n.position.length;i++){const s=e[i],o=n.position[i];if(s.field.isKeyField()?r=Y.comparator(Y.fromName(o.referenceValue),t.key):r=mi(o,t.data.field(s.field)),s.dir==="desc"&&(r*=-1),r!==0)break}return r}function Cd(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!ln(n.position[t],e.position[t]))return!1;return!0}/**
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
 */class Ro{constructor(e,t="asc"){this.field=e,this.dir=t}}function cb(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}/**
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
 */class Df{}class Fe extends Df{constructor(e,t,r){super(),this.field=e,this.op=t,this.value=r}static create(e,t,r){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,r):new db(e,t,r):t==="array-contains"?new pb(e,r):t==="in"?new mb(e,r):t==="not-in"?new gb(e,r):t==="array-contains-any"?new yb(e,r):new Fe(e,t,r)}static createKeyFieldInFilter(e,t,r){return t==="in"?new hb(e,r):new fb(e,r)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&this.matchesComparison(mi(t,this.value)):t!==null&&Ur(this.value)===Ur(t)&&this.matchesComparison(mi(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return G()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class cn extends Df{constructor(e,t){super(),this.filters=e,this.op=t,this.ae=null}static create(e,t){return new cn(e,t)}matches(e){return Lf(this)?this.filters.find(t=>!t.matches(e))===void 0:this.filters.find(t=>t.matches(e))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function Lf(n){return n.op==="and"}function Nf(n){return ub(n)&&Lf(n)}function ub(n){for(const e of n.filters)if(e instanceof cn)return!1;return!0}function ul(n){if(n instanceof Fe)return n.field.canonicalString()+n.op.toString()+gi(n.value);if(Nf(n))return n.filters.map(e=>ul(e)).join(",");{const e=n.filters.map(t=>ul(t)).join(",");return`${n.op}(${e})`}}function Bf(n,e){return n instanceof Fe?function(r,i){return i instanceof Fe&&r.op===i.op&&r.field.isEqual(i.field)&&ln(r.value,i.value)}(n,e):n instanceof cn?function(r,i){return i instanceof cn&&r.op===i.op&&r.filters.length===i.filters.length?r.filters.reduce((s,o,l)=>s&&Bf(o,i.filters[l]),!0):!1}(n,e):void G()}function Of(n){return n instanceof Fe?function(t){return`${t.field.canonicalString()} ${t.op} ${gi(t.value)}`}(n):n instanceof cn?function(t){return t.op.toString()+" {"+t.getFilters().map(Of).join(" ,")+"}"}(n):"Filter"}class db extends Fe{constructor(e,t,r){super(e,t,r),this.key=Y.fromName(r.referenceValue)}matches(e){const t=Y.comparator(e.key,this.key);return this.matchesComparison(t)}}class hb extends Fe{constructor(e,t){super(e,"in",t),this.keys=Vf("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class fb extends Fe{constructor(e,t){super(e,"not-in",t),this.keys=Vf("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function Vf(n,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map(r=>Y.fromName(r.referenceValue))}class pb extends Fe{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return ec(t)&&ds(t.arrayValue,this.value)}}class mb extends Fe{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&ds(this.value.arrayValue,t)}}class gb extends Fe{constructor(e,t){super(e,"not-in",t)}matches(e){if(ds(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&!ds(this.value.arrayValue,t)}}class yb extends Fe{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!ec(t)||!t.arrayValue.values)&&t.arrayValue.values.some(r=>ds(this.value.arrayValue,r))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vb{constructor(e,t=null,r=[],i=[],s=null,o=null,l=null){this.path=e,this.collectionGroup=t,this.orderBy=r,this.filters=i,this.limit=s,this.startAt=o,this.endAt=l,this.ue=null}}function Md(n,e=null,t=[],r=[],i=null,s=null,o=null){return new vb(n,e,t,r,i,s,o)}function tc(n){const e=J(n);if(e.ue===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map(r=>ul(r)).join(","),t+="|ob:",t+=e.orderBy.map(r=>function(s){return s.field.canonicalString()+s.dir}(r)).join(","),Go(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map(r=>gi(r)).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map(r=>gi(r)).join(",")),e.ue=t}return e.ue}function nc(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!cb(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!Bf(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!Cd(n.startAt,e.startAt)&&Cd(n.endAt,e.endAt)}function dl(n){return Y.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ko{constructor(e,t=null,r=[],i=[],s=null,o="F",l=null,c=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=r,this.filters=i,this.limit=s,this.limitType=o,this.startAt=l,this.endAt=c,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function wb(n,e,t,r,i,s,o,l){return new Ko(n,e,t,r,i,s,o,l)}function rc(n){return new Ko(n)}function Dd(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function bb(n){return n.collectionGroup!==null}function Zi(n){const e=J(n);if(e.ce===null){e.ce=[];const t=new Set;for(const s of e.explicitOrderBy)e.ce.push(s),t.add(s.field.canonicalString());const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let l=new Ge(We.comparator);return o.filters.forEach(c=>{c.getFlattenedFilters().forEach(u=>{u.isInequality()&&(l=l.add(u.field))})}),l})(e).forEach(s=>{t.has(s.canonicalString())||s.isKeyField()||e.ce.push(new Ro(s,r))}),t.has(We.keyField().canonicalString())||e.ce.push(new Ro(We.keyField(),r))}return e.ce}function on(n){const e=J(n);return e.le||(e.le=_b(e,Zi(n))),e.le}function _b(n,e){if(n.limitType==="F")return Md(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map(i=>{const s=i.dir==="desc"?"asc":"desc";return new Ro(i.field,s)});const t=n.endAt?new xo(n.endAt.position,n.endAt.inclusive):null,r=n.startAt?new xo(n.startAt.position,n.startAt.inclusive):null;return Md(n.path,n.collectionGroup,e,n.filters,n.limit,t,r)}}function hl(n,e,t){return new Ko(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function Qo(n,e){return nc(on(n),on(e))&&n.limitType===e.limitType}function Ff(n){return`${tc(on(n))}|lt:${n.limitType}`}function ti(n){return`Query(target=${function(t){let r=t.path.canonicalString();return t.collectionGroup!==null&&(r+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(r+=`, filters: [${t.filters.map(i=>Of(i)).join(", ")}]`),Go(t.limit)||(r+=", limit: "+t.limit),t.orderBy.length>0&&(r+=`, orderBy: [${t.orderBy.map(i=>function(o){return`${o.field.canonicalString()} (${o.dir})`}(i)).join(", ")}]`),t.startAt&&(r+=", startAt: ",r+=t.startAt.inclusive?"b:":"a:",r+=t.startAt.position.map(i=>gi(i)).join(",")),t.endAt&&(r+=", endAt: ",r+=t.endAt.inclusive?"a:":"b:",r+=t.endAt.position.map(i=>gi(i)).join(",")),`Target(${r})`}(on(n))}; limitType=${n.limitType})`}function Jo(n,e){return e.isFoundDocument()&&function(r,i){const s=i.key.path;return r.collectionGroup!==null?i.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(s):Y.isDocumentKey(r.path)?r.path.isEqual(s):r.path.isImmediateParentOf(s)}(n,e)&&function(r,i){for(const s of Zi(r))if(!s.field.isKeyField()&&i.data.field(s.field)===null)return!1;return!0}(n,e)&&function(r,i){for(const s of r.filters)if(!s.matches(i))return!1;return!0}(n,e)&&function(r,i){return!(r.startAt&&!function(o,l,c){const u=Pd(o,l,c);return o.inclusive?u<=0:u<0}(r.startAt,Zi(r),i)||r.endAt&&!function(o,l,c){const u=Pd(o,l,c);return o.inclusive?u>=0:u>0}(r.endAt,Zi(r),i))}(n,e)}function Eb(n){return n.collectionGroup||(n.path.length%2==1?n.path.lastSegment():n.path.get(n.path.length-2))}function $f(n){return(e,t)=>{let r=!1;for(const i of Zi(n)){const s=Tb(i,e,t);if(s!==0)return s;r=r||i.field.isKeyField()}return 0}}function Tb(n,e,t){const r=n.field.isKeyField()?Y.comparator(e.key,t.key):function(s,o,l){const c=o.data.field(s),u=l.data.field(s);return c!==null&&u!==null?mi(c,u):G()}(n.field,e,t);switch(n.dir){case"asc":return r;case"desc":return-1*r;default:return G()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ai{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r!==void 0){for(const[i,s]of r)if(this.equalsFn(i,e))return s}}has(e){return this.get(e)!==void 0}set(e,t){const r=this.mapKeyFn(e),i=this.inner[r];if(i===void 0)return this.inner[r]=[[e,t]],void this.innerSize++;for(let s=0;s<i.length;s++)if(this.equalsFn(i[s][0],e))return void(i[s]=[e,t]);i.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r===void 0)return!1;for(let i=0;i<r.length;i++)if(this.equalsFn(r[i][0],e))return r.length===1?delete this.inner[t]:r.splice(i,1),this.innerSize--,!0;return!1}forEach(e){Yr(this.inner,(t,r)=>{for(const[i,s]of r)e(i,s)})}isEmpty(){return Pf(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ib=new Pe(Y.comparator);function Bn(){return Ib}const zf=new Pe(Y.comparator);function Wi(...n){let e=zf;for(const t of n)e=e.insert(t.key,t);return e}function Uf(n){let e=zf;return n.forEach((t,r)=>e=e.insert(t,r.overlayedDocument)),e}function Pr(){return es()}function qf(){return es()}function es(){return new Ai(n=>n.toString(),(n,e)=>n.isEqual(e))}const Sb=new Pe(Y.comparator),Ab=new Ge(Y.comparator);function ie(...n){let e=Ab;for(const t of n)e=e.add(t);return e}const xb=new Ge(he);function Rb(){return xb}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ic(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Ao(e)?"-0":e}}function Hf(n){return{integerValue:""+n}}function kb(n,e){return ib(e)?Hf(e):ic(n,e)}/**
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
 */class Xo{constructor(){this._=void 0}}function Pb(n,e,t){return n instanceof ko?function(i,s){const o={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:i.seconds,nanos:i.nanoseconds}}}};return s&&Xl(s)&&(s=Zl(s)),s&&(o.fields.__previous_value__=s),{mapValue:o}}(t,e):n instanceof hs?jf(n,e):n instanceof fs?Wf(n,e):function(i,s){const o=Yf(i,s),l=Ld(o)+Ld(i.Pe);return cl(o)&&cl(i.Pe)?Hf(l):ic(i.serializer,l)}(n,e)}function Cb(n,e,t){return n instanceof hs?jf(n,e):n instanceof fs?Wf(n,e):t}function Yf(n,e){return n instanceof Po?function(r){return cl(r)||function(s){return!!s&&"doubleValue"in s}(r)}(e)?e:{integerValue:0}:null}class ko extends Xo{}class hs extends Xo{constructor(e){super(),this.elements=e}}function jf(n,e){const t=Gf(e);for(const r of n.elements)t.some(i=>ln(i,r))||t.push(r);return{arrayValue:{values:t}}}class fs extends Xo{constructor(e){super(),this.elements=e}}function Wf(n,e){let t=Gf(e);for(const r of n.elements)t=t.filter(i=>!ln(i,r));return{arrayValue:{values:t}}}class Po extends Xo{constructor(e,t){super(),this.serializer=e,this.Pe=t}}function Ld(n){return Le(n.integerValue||n.doubleValue)}function Gf(n){return ec(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}function Mb(n,e){return n.field.isEqual(e.field)&&function(r,i){return r instanceof hs&&i instanceof hs||r instanceof fs&&i instanceof fs?pi(r.elements,i.elements,ln):r instanceof Po&&i instanceof Po?ln(r.Pe,i.Pe):r instanceof ko&&i instanceof ko}(n.transform,e.transform)}class Db{constructor(e,t){this.version=e,this.transformResults=t}}class mt{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new mt}static exists(e){return new mt(void 0,e)}static updateTime(e){return new mt(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function uo(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}class Zo{}function Kf(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new ea(n.key,mt.none()):new ks(n.key,n.data,mt.none());{const t=n.data,r=wt.empty();let i=new Ge(We.comparator);for(let s of e.fields)if(!i.has(s)){let o=t.field(s);o===null&&s.length>1&&(s=s.popLast(),o=t.field(s)),o===null?r.delete(s):r.set(s,o),i=i.add(s)}return new yr(n.key,r,new xt(i.toArray()),mt.none())}}function Lb(n,e,t){n instanceof ks?function(i,s,o){const l=i.value.clone(),c=Bd(i.fieldTransforms,s,o.transformResults);l.setAll(c),s.convertToFoundDocument(o.version,l).setHasCommittedMutations()}(n,e,t):n instanceof yr?function(i,s,o){if(!uo(i.precondition,s))return void s.convertToUnknownDocument(o.version);const l=Bd(i.fieldTransforms,s,o.transformResults),c=s.data;c.setAll(Qf(i)),c.setAll(l),s.convertToFoundDocument(o.version,c).setHasCommittedMutations()}(n,e,t):function(i,s,o){s.convertToNoDocument(o.version).setHasCommittedMutations()}(0,e,t)}function ts(n,e,t,r){return n instanceof ks?function(s,o,l,c){if(!uo(s.precondition,o))return l;const u=s.value.clone(),f=Od(s.fieldTransforms,c,o);return u.setAll(f),o.convertToFoundDocument(o.version,u).setHasLocalMutations(),null}(n,e,t,r):n instanceof yr?function(s,o,l,c){if(!uo(s.precondition,o))return l;const u=Od(s.fieldTransforms,c,o),f=o.data;return f.setAll(Qf(s)),f.setAll(u),o.convertToFoundDocument(o.version,f).setHasLocalMutations(),l===null?null:l.unionWith(s.fieldMask.fields).unionWith(s.fieldTransforms.map(m=>m.field))}(n,e,t,r):function(s,o,l){return uo(s.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):l}(n,e,t)}function Nb(n,e){let t=null;for(const r of n.fieldTransforms){const i=e.data.field(r.field),s=Yf(r.transform,i||null);s!=null&&(t===null&&(t=wt.empty()),t.set(r.field,s))}return t||null}function Nd(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!function(r,i){return r===void 0&&i===void 0||!(!r||!i)&&pi(r,i,(s,o)=>Mb(s,o))}(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}class ks extends Zo{constructor(e,t,r,i=[]){super(),this.key=e,this.value=t,this.precondition=r,this.fieldTransforms=i,this.type=0}getFieldMask(){return null}}class yr extends Zo{constructor(e,t,r,i,s=[]){super(),this.key=e,this.data=t,this.fieldMask=r,this.precondition=i,this.fieldTransforms=s,this.type=1}getFieldMask(){return this.fieldMask}}function Qf(n){const e=new Map;return n.fieldMask.fields.forEach(t=>{if(!t.isEmpty()){const r=n.data.field(t);e.set(t,r)}}),e}function Bd(n,e,t){const r=new Map;me(n.length===t.length);for(let i=0;i<t.length;i++){const s=n[i],o=s.transform,l=e.data.field(s.field);r.set(s.field,Cb(o,l,t[i]))}return r}function Od(n,e,t){const r=new Map;for(const i of n){const s=i.transform,o=t.data.field(i.field);r.set(i.field,Pb(s,o,e))}return r}class ea extends Zo{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class Bb extends Zo{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ob{constructor(e,t,r,i){this.batchId=e,this.localWriteTime=t,this.baseMutations=r,this.mutations=i}applyToRemoteDocument(e,t){const r=t.mutationResults;for(let i=0;i<this.mutations.length;i++){const s=this.mutations[i];s.key.isEqual(e.key)&&Lb(s,e,r[i])}}applyToLocalView(e,t){for(const r of this.baseMutations)r.key.isEqual(e.key)&&(t=ts(r,e,t,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(e.key)&&(t=ts(r,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const r=qf();return this.mutations.forEach(i=>{const s=e.get(i.key),o=s.overlayedDocument;let l=this.applyToLocalView(o,s.mutatedFields);l=t.has(i.key)?null:l;const c=Kf(o,l);c!==null&&r.set(i.key,c),o.isValidDocument()||o.convertToNoDocument(Q.min())}),r}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),ie())}isEqual(e){return this.batchId===e.batchId&&pi(this.mutations,e.mutations,(t,r)=>Nd(t,r))&&pi(this.baseMutations,e.baseMutations,(t,r)=>Nd(t,r))}}class sc{constructor(e,t,r,i){this.batch=e,this.commitVersion=t,this.mutationResults=r,this.docVersions=i}static from(e,t,r){me(e.mutations.length===r.length);let i=function(){return Sb}();const s=e.mutations;for(let o=0;o<s.length;o++)i=i.insert(s[o].key,r[o].version);return new sc(e,t,r,i)}}/**
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
 */class Vb{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
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
 */class Fb{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Oe,ae;function $b(n){switch(n){default:return G();case M.CANCELLED:case M.UNKNOWN:case M.DEADLINE_EXCEEDED:case M.RESOURCE_EXHAUSTED:case M.INTERNAL:case M.UNAVAILABLE:case M.UNAUTHENTICATED:return!1;case M.INVALID_ARGUMENT:case M.NOT_FOUND:case M.ALREADY_EXISTS:case M.PERMISSION_DENIED:case M.FAILED_PRECONDITION:case M.ABORTED:case M.OUT_OF_RANGE:case M.UNIMPLEMENTED:case M.DATA_LOSS:return!0}}function Jf(n){if(n===void 0)return Nn("GRPC error has no .code"),M.UNKNOWN;switch(n){case Oe.OK:return M.OK;case Oe.CANCELLED:return M.CANCELLED;case Oe.UNKNOWN:return M.UNKNOWN;case Oe.DEADLINE_EXCEEDED:return M.DEADLINE_EXCEEDED;case Oe.RESOURCE_EXHAUSTED:return M.RESOURCE_EXHAUSTED;case Oe.INTERNAL:return M.INTERNAL;case Oe.UNAVAILABLE:return M.UNAVAILABLE;case Oe.UNAUTHENTICATED:return M.UNAUTHENTICATED;case Oe.INVALID_ARGUMENT:return M.INVALID_ARGUMENT;case Oe.NOT_FOUND:return M.NOT_FOUND;case Oe.ALREADY_EXISTS:return M.ALREADY_EXISTS;case Oe.PERMISSION_DENIED:return M.PERMISSION_DENIED;case Oe.FAILED_PRECONDITION:return M.FAILED_PRECONDITION;case Oe.ABORTED:return M.ABORTED;case Oe.OUT_OF_RANGE:return M.OUT_OF_RANGE;case Oe.UNIMPLEMENTED:return M.UNIMPLEMENTED;case Oe.DATA_LOSS:return M.DATA_LOSS;default:return G()}}(ae=Oe||(Oe={}))[ae.OK=0]="OK",ae[ae.CANCELLED=1]="CANCELLED",ae[ae.UNKNOWN=2]="UNKNOWN",ae[ae.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",ae[ae.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",ae[ae.NOT_FOUND=5]="NOT_FOUND",ae[ae.ALREADY_EXISTS=6]="ALREADY_EXISTS",ae[ae.PERMISSION_DENIED=7]="PERMISSION_DENIED",ae[ae.UNAUTHENTICATED=16]="UNAUTHENTICATED",ae[ae.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",ae[ae.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",ae[ae.ABORTED=10]="ABORTED",ae[ae.OUT_OF_RANGE=11]="OUT_OF_RANGE",ae[ae.UNIMPLEMENTED=12]="UNIMPLEMENTED",ae[ae.INTERNAL=13]="INTERNAL",ae[ae.UNAVAILABLE=14]="UNAVAILABLE",ae[ae.DATA_LOSS=15]="DATA_LOSS";/**
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
 */function zb(){return new TextEncoder}/**
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
 */const Ub=new Lr([4294967295,4294967295],0);function Vd(n){const e=zb().encode(n),t=new Ef;return t.update(e),new Uint8Array(t.digest())}function Fd(n){const e=new DataView(n.buffer),t=e.getUint32(0,!0),r=e.getUint32(4,!0),i=e.getUint32(8,!0),s=e.getUint32(12,!0);return[new Lr([t,r],0),new Lr([i,s],0)]}class oc{constructor(e,t,r){if(this.bitmap=e,this.padding=t,this.hashCount=r,t<0||t>=8)throw new Gi(`Invalid padding: ${t}`);if(r<0)throw new Gi(`Invalid hash count: ${r}`);if(e.length>0&&this.hashCount===0)throw new Gi(`Invalid hash count: ${r}`);if(e.length===0&&t!==0)throw new Gi(`Invalid padding when bitmap length is 0: ${t}`);this.Ie=8*e.length-t,this.Te=Lr.fromNumber(this.Ie)}Ee(e,t,r){let i=e.add(t.multiply(Lr.fromNumber(r)));return i.compare(Ub)===1&&(i=new Lr([i.getBits(0),i.getBits(1)],0)),i.modulo(this.Te).toNumber()}de(e){return(this.bitmap[Math.floor(e/8)]&1<<e%8)!=0}mightContain(e){if(this.Ie===0)return!1;const t=Vd(e),[r,i]=Fd(t);for(let s=0;s<this.hashCount;s++){const o=this.Ee(r,i,s);if(!this.de(o))return!1}return!0}static create(e,t,r){const i=e%8==0?0:8-e%8,s=new Uint8Array(Math.ceil(e/8)),o=new oc(s,i,t);return r.forEach(l=>o.insert(l)),o}insert(e){if(this.Ie===0)return;const t=Vd(e),[r,i]=Fd(t);for(let s=0;s<this.hashCount;s++){const o=this.Ee(r,i,s);this.Ae(o)}}Ae(e){const t=Math.floor(e/8),r=e%8;this.bitmap[t]|=1<<r}}class Gi extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ta{constructor(e,t,r,i,s){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=r,this.documentUpdates=i,this.resolvedLimboDocuments=s}static createSynthesizedRemoteEventForCurrentChange(e,t,r){const i=new Map;return i.set(e,Ps.createSynthesizedTargetChangeForCurrentChange(e,t,r)),new ta(Q.min(),i,new Pe(he),Bn(),ie())}}class Ps{constructor(e,t,r,i,s){this.resumeToken=e,this.current=t,this.addedDocuments=r,this.modifiedDocuments=i,this.removedDocuments=s}static createSynthesizedTargetChangeForCurrentChange(e,t,r){return new Ps(r,t,ie(),ie(),ie())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ho{constructor(e,t,r,i){this.Re=e,this.removedTargetIds=t,this.key=r,this.Ve=i}}class Xf{constructor(e,t){this.targetId=e,this.me=t}}class Zf{constructor(e,t,r=Qe.EMPTY_BYTE_STRING,i=null){this.state=e,this.targetIds=t,this.resumeToken=r,this.cause=i}}class $d{constructor(){this.fe=0,this.ge=Ud(),this.pe=Qe.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return this.fe!==0}get be(){return this.we}De(e){e.approximateByteSize()>0&&(this.we=!0,this.pe=e)}ve(){let e=ie(),t=ie(),r=ie();return this.ge.forEach((i,s)=>{switch(s){case 0:e=e.add(i);break;case 2:t=t.add(i);break;case 1:r=r.add(i);break;default:G()}}),new Ps(this.pe,this.ye,e,t,r)}Ce(){this.we=!1,this.ge=Ud()}Fe(e,t){this.we=!0,this.ge=this.ge.insert(e,t)}Me(e){this.we=!0,this.ge=this.ge.remove(e)}xe(){this.fe+=1}Oe(){this.fe-=1,me(this.fe>=0)}Ne(){this.we=!0,this.ye=!0}}class qb{constructor(e){this.Le=e,this.Be=new Map,this.ke=Bn(),this.qe=zd(),this.Qe=new Pe(he)}Ke(e){for(const t of e.Re)e.Ve&&e.Ve.isFoundDocument()?this.$e(t,e.Ve):this.Ue(t,e.key,e.Ve);for(const t of e.removedTargetIds)this.Ue(t,e.key,e.Ve)}We(e){this.forEachTarget(e,t=>{const r=this.Ge(t);switch(e.state){case 0:this.ze(t)&&r.De(e.resumeToken);break;case 1:r.Oe(),r.Se||r.Ce(),r.De(e.resumeToken);break;case 2:r.Oe(),r.Se||this.removeTarget(t);break;case 3:this.ze(t)&&(r.Ne(),r.De(e.resumeToken));break;case 4:this.ze(t)&&(this.je(t),r.De(e.resumeToken));break;default:G()}})}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Be.forEach((r,i)=>{this.ze(i)&&t(i)})}He(e){const t=e.targetId,r=e.me.count,i=this.Je(t);if(i){const s=i.target;if(dl(s))if(r===0){const o=new Y(s.path);this.Ue(t,o,it.newNoDocument(o,Q.min()))}else me(r===1);else{const o=this.Ye(t);if(o!==r){const l=this.Ze(e),c=l?this.Xe(l,e,o):1;if(c!==0){this.je(t);const u=c===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Qe=this.Qe.insert(t,u)}}}}}Ze(e){const t=e.me.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:r="",padding:i=0},hashCount:s=0}=t;let o,l;try{o=zr(r).toUint8Array()}catch(c){if(c instanceof Cf)return fi("Decoding the base64 bloom filter in existence filter failed ("+c.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw c}try{l=new oc(o,i,s)}catch(c){return fi(c instanceof Gi?"BloomFilter error: ":"Applying bloom filter failed: ",c),null}return l.Ie===0?null:l}Xe(e,t,r){return t.me.count===r-this.nt(e,t.targetId)?0:2}nt(e,t){const r=this.Le.getRemoteKeysForTarget(t);let i=0;return r.forEach(s=>{const o=this.Le.tt(),l=`projects/${o.projectId}/databases/${o.database}/documents/${s.path.canonicalString()}`;e.mightContain(l)||(this.Ue(t,s,null),i++)}),i}rt(e){const t=new Map;this.Be.forEach((s,o)=>{const l=this.Je(o);if(l){if(s.current&&dl(l.target)){const c=new Y(l.target.path);this.ke.get(c)!==null||this.it(o,c)||this.Ue(o,c,it.newNoDocument(c,e))}s.be&&(t.set(o,s.ve()),s.Ce())}});let r=ie();this.qe.forEach((s,o)=>{let l=!0;o.forEachWhile(c=>{const u=this.Je(c);return!u||u.purpose==="TargetPurposeLimboResolution"||(l=!1,!1)}),l&&(r=r.add(s))}),this.ke.forEach((s,o)=>o.setReadTime(e));const i=new ta(e,t,this.Qe,this.ke,r);return this.ke=Bn(),this.qe=zd(),this.Qe=new Pe(he),i}$e(e,t){if(!this.ze(e))return;const r=this.it(e,t.key)?2:0;this.Ge(e).Fe(t.key,r),this.ke=this.ke.insert(t.key,t),this.qe=this.qe.insert(t.key,this.st(t.key).add(e))}Ue(e,t,r){if(!this.ze(e))return;const i=this.Ge(e);this.it(e,t)?i.Fe(t,1):i.Me(t),this.qe=this.qe.insert(t,this.st(t).delete(e)),r&&(this.ke=this.ke.insert(t,r))}removeTarget(e){this.Be.delete(e)}Ye(e){const t=this.Ge(e).ve();return this.Le.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}xe(e){this.Ge(e).xe()}Ge(e){let t=this.Be.get(e);return t||(t=new $d,this.Be.set(e,t)),t}st(e){let t=this.qe.get(e);return t||(t=new Ge(he),this.qe=this.qe.insert(e,t)),t}ze(e){const t=this.Je(e)!==null;return t||z("WatchChangeAggregator","Detected inactive target",e),t}Je(e){const t=this.Be.get(e);return t&&t.Se?null:this.Le.ot(e)}je(e){this.Be.set(e,new $d),this.Le.getRemoteKeysForTarget(e).forEach(t=>{this.Ue(e,t,null)})}it(e,t){return this.Le.getRemoteKeysForTarget(e).has(t)}}function zd(){return new Pe(Y.comparator)}function Ud(){return new Pe(Y.comparator)}const Hb={asc:"ASCENDING",desc:"DESCENDING"},Yb={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},jb={and:"AND",or:"OR"};class Wb{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function fl(n,e){return n.useProto3Json||Go(e)?e:{value:e}}function Co(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function ep(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function Gb(n,e){return Co(n,e.toTimestamp())}function an(n){return me(!!n),Q.fromTimestamp(function(t){const r=pr(t);return new $e(r.seconds,r.nanos)}(n))}function ac(n,e){return pl(n,e).canonicalString()}function pl(n,e){const t=function(i){return new xe(["projects",i.projectId,"databases",i.database])}(n).child("documents");return e===void 0?t:t.child(e)}function tp(n){const e=xe.fromString(n);return me(op(e)),e}function ml(n,e){return ac(n.databaseId,e.path)}function qa(n,e){const t=tp(e);if(t.get(1)!==n.databaseId.projectId)throw new U(M.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new U(M.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new Y(rp(t))}function np(n,e){return ac(n.databaseId,e)}function Kb(n){const e=tp(n);return e.length===4?xe.emptyPath():rp(e)}function gl(n){return new xe(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function rp(n){return me(n.length>4&&n.get(4)==="documents"),n.popFirst(5)}function qd(n,e,t){return{name:ml(n,e),fields:t.value.mapValue.fields}}function Qb(n,e){let t;if("targetChange"in e){e.targetChange;const r=function(u){return u==="NO_CHANGE"?0:u==="ADD"?1:u==="REMOVE"?2:u==="CURRENT"?3:u==="RESET"?4:G()}(e.targetChange.targetChangeType||"NO_CHANGE"),i=e.targetChange.targetIds||[],s=function(u,f){return u.useProto3Json?(me(f===void 0||typeof f=="string"),Qe.fromBase64String(f||"")):(me(f===void 0||f instanceof Buffer||f instanceof Uint8Array),Qe.fromUint8Array(f||new Uint8Array))}(n,e.targetChange.resumeToken),o=e.targetChange.cause,l=o&&function(u){const f=u.code===void 0?M.UNKNOWN:Jf(u.code);return new U(f,u.message||"")}(o);t=new Zf(r,i,s,l||null)}else if("documentChange"in e){e.documentChange;const r=e.documentChange;r.document,r.document.name,r.document.updateTime;const i=qa(n,r.document.name),s=an(r.document.updateTime),o=r.document.createTime?an(r.document.createTime):Q.min(),l=new wt({mapValue:{fields:r.document.fields}}),c=it.newFoundDocument(i,s,o,l),u=r.targetIds||[],f=r.removedTargetIds||[];t=new ho(u,f,c.key,c)}else if("documentDelete"in e){e.documentDelete;const r=e.documentDelete;r.document;const i=qa(n,r.document),s=r.readTime?an(r.readTime):Q.min(),o=it.newNoDocument(i,s),l=r.removedTargetIds||[];t=new ho([],l,o.key,o)}else if("documentRemove"in e){e.documentRemove;const r=e.documentRemove;r.document;const i=qa(n,r.document),s=r.removedTargetIds||[];t=new ho([],s,i,null)}else{if(!("filter"in e))return G();{e.filter;const r=e.filter;r.targetId;const{count:i=0,unchangedNames:s}=r,o=new Fb(i,s),l=r.targetId;t=new Xf(l,o)}}return t}function Jb(n,e){let t;if(e instanceof ks)t={update:qd(n,e.key,e.value)};else if(e instanceof ea)t={delete:ml(n,e.key)};else if(e instanceof yr)t={update:qd(n,e.key,e.data),updateMask:o_(e.fieldMask)};else{if(!(e instanceof Bb))return G();t={verify:ml(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map(r=>function(s,o){const l=o.transform;if(l instanceof ko)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(l instanceof hs)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:l.elements}};if(l instanceof fs)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:l.elements}};if(l instanceof Po)return{fieldPath:o.field.canonicalString(),increment:l.Pe};throw G()}(0,r))),e.precondition.isNone||(t.currentDocument=function(i,s){return s.updateTime!==void 0?{updateTime:Gb(i,s.updateTime)}:s.exists!==void 0?{exists:s.exists}:G()}(n,e.precondition)),t}function Xb(n,e){return n&&n.length>0?(me(e!==void 0),n.map(t=>function(i,s){let o=i.updateTime?an(i.updateTime):an(s);return o.isEqual(Q.min())&&(o=an(s)),new Db(o,i.transformResults||[])}(t,e))):[]}function Zb(n,e){return{documents:[np(n,e.path)]}}function e_(n,e){const t={structuredQuery:{}},r=e.path;let i;e.collectionGroup!==null?(i=r,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(i=r.popLast(),t.structuredQuery.from=[{collectionId:r.lastSegment()}]),t.parent=np(n,i);const s=function(u){if(u.length!==0)return sp(cn.create(u,"and"))}(e.filters);s&&(t.structuredQuery.where=s);const o=function(u){if(u.length!==0)return u.map(f=>function(p){return{field:ni(p.field),direction:r_(p.dir)}}(f))}(e.orderBy);o&&(t.structuredQuery.orderBy=o);const l=fl(n,e.limit);return l!==null&&(t.structuredQuery.limit=l),e.startAt&&(t.structuredQuery.startAt=function(u){return{before:u.inclusive,values:u.position}}(e.startAt)),e.endAt&&(t.structuredQuery.endAt=function(u){return{before:!u.inclusive,values:u.position}}(e.endAt)),{_t:t,parent:i}}function t_(n){let e=Kb(n.parent);const t=n.structuredQuery,r=t.from?t.from.length:0;let i=null;if(r>0){me(r===1);const f=t.from[0];f.allDescendants?i=f.collectionId:e=e.child(f.collectionId)}let s=[];t.where&&(s=function(m){const p=ip(m);return p instanceof cn&&Nf(p)?p.getFilters():[p]}(t.where));let o=[];t.orderBy&&(o=function(m){return m.map(p=>function(I){return new Ro(ri(I.field),function(x){switch(x){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(I.direction))}(p))}(t.orderBy));let l=null;t.limit&&(l=function(m){let p;return p=typeof m=="object"?m.value:m,Go(p)?null:p}(t.limit));let c=null;t.startAt&&(c=function(m){const p=!!m.before,y=m.values||[];return new xo(y,p)}(t.startAt));let u=null;return t.endAt&&(u=function(m){const p=!m.before,y=m.values||[];return new xo(y,p)}(t.endAt)),wb(e,i,o,s,l,"F",c,u)}function n_(n,e){const t=function(i){switch(i){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return G()}}(e.purpose);return t==null?null:{"goog-listen-tags":t}}function ip(n){return n.unaryFilter!==void 0?function(t){switch(t.unaryFilter.op){case"IS_NAN":const r=ri(t.unaryFilter.field);return Fe.create(r,"==",{doubleValue:NaN});case"IS_NULL":const i=ri(t.unaryFilter.field);return Fe.create(i,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const s=ri(t.unaryFilter.field);return Fe.create(s,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=ri(t.unaryFilter.field);return Fe.create(o,"!=",{nullValue:"NULL_VALUE"});default:return G()}}(n):n.fieldFilter!==void 0?function(t){return Fe.create(ri(t.fieldFilter.field),function(i){switch(i){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return G()}}(t.fieldFilter.op),t.fieldFilter.value)}(n):n.compositeFilter!==void 0?function(t){return cn.create(t.compositeFilter.filters.map(r=>ip(r)),function(i){switch(i){case"AND":return"and";case"OR":return"or";default:return G()}}(t.compositeFilter.op))}(n):G()}function r_(n){return Hb[n]}function i_(n){return Yb[n]}function s_(n){return jb[n]}function ni(n){return{fieldPath:n.canonicalString()}}function ri(n){return We.fromServerFormat(n.fieldPath)}function sp(n){return n instanceof Fe?function(t){if(t.op==="=="){if(kd(t.value))return{unaryFilter:{field:ni(t.field),op:"IS_NAN"}};if(Rd(t.value))return{unaryFilter:{field:ni(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(kd(t.value))return{unaryFilter:{field:ni(t.field),op:"IS_NOT_NAN"}};if(Rd(t.value))return{unaryFilter:{field:ni(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:ni(t.field),op:i_(t.op),value:t.value}}}(n):n instanceof cn?function(t){const r=t.getFilters().map(i=>sp(i));return r.length===1?r[0]:{compositeFilter:{op:s_(t.op),filters:r}}}(n):G()}function o_(n){const e=[];return n.fields.forEach(t=>e.push(t.canonicalString())),{fieldPaths:e}}function op(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sr{constructor(e,t,r,i,s=Q.min(),o=Q.min(),l=Qe.EMPTY_BYTE_STRING,c=null){this.target=e,this.targetId=t,this.purpose=r,this.sequenceNumber=i,this.snapshotVersion=s,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=l,this.expectedCount=c}withSequenceNumber(e){return new sr(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new sr(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new sr(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new sr(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class a_{constructor(e){this.ct=e}}function l_(n){const e=t_({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?hl(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class c_{constructor(){this.un=new u_}addToCollectionParentIndex(e,t){return this.un.add(t),L.resolve()}getCollectionParents(e,t){return L.resolve(this.un.getEntries(t))}addFieldIndex(e,t){return L.resolve()}deleteFieldIndex(e,t){return L.resolve()}deleteAllFieldIndexes(e){return L.resolve()}createTargetIndexes(e,t){return L.resolve()}getDocumentsMatchingTarget(e,t){return L.resolve(null)}getIndexType(e,t){return L.resolve(0)}getFieldIndexes(e,t){return L.resolve([])}getNextCollectionGroupToUpdate(e){return L.resolve(null)}getMinOffset(e,t){return L.resolve(fr.min())}getMinOffsetFromCollectionGroup(e,t){return L.resolve(fr.min())}updateCollectionGroup(e,t,r){return L.resolve()}updateIndexEntries(e,t){return L.resolve()}}class u_{constructor(){this.index={}}add(e){const t=e.lastSegment(),r=e.popLast(),i=this.index[t]||new Ge(xe.comparator),s=!i.has(r);return this.index[t]=i.add(r),s}has(e){const t=e.lastSegment(),r=e.popLast(),i=this.index[t];return i&&i.has(r)}getEntries(e){return(this.index[e]||new Ge(xe.comparator)).toArray()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yi{constructor(e){this.Ln=e}next(){return this.Ln+=2,this.Ln}static Bn(){return new yi(0)}static kn(){return new yi(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class d_{constructor(){this.changes=new Ai(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,it.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const r=this.changes.get(t);return r!==void 0?L.resolve(r):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class h_{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class f_{constructor(e,t,r,i){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=r,this.indexManager=i}getDocument(e,t){let r=null;return this.documentOverlayCache.getOverlay(e,t).next(i=>(r=i,this.remoteDocumentCache.getEntry(e,t))).next(i=>(r!==null&&ts(r.mutation,i,xt.empty(),$e.now()),i))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(r=>this.getLocalViewOfDocuments(e,r,ie()).next(()=>r))}getLocalViewOfDocuments(e,t,r=ie()){const i=Pr();return this.populateOverlays(e,i,t).next(()=>this.computeViews(e,t,i,r).next(s=>{let o=Wi();return s.forEach((l,c)=>{o=o.insert(l,c.overlayedDocument)}),o}))}getOverlayedDocuments(e,t){const r=Pr();return this.populateOverlays(e,r,t).next(()=>this.computeViews(e,t,r,ie()))}populateOverlays(e,t,r){const i=[];return r.forEach(s=>{t.has(s)||i.push(s)}),this.documentOverlayCache.getOverlays(e,i).next(s=>{s.forEach((o,l)=>{t.set(o,l)})})}computeViews(e,t,r,i){let s=Bn();const o=es(),l=function(){return es()}();return t.forEach((c,u)=>{const f=r.get(u.key);i.has(u.key)&&(f===void 0||f.mutation instanceof yr)?s=s.insert(u.key,u):f!==void 0?(o.set(u.key,f.mutation.getFieldMask()),ts(f.mutation,u,f.mutation.getFieldMask(),$e.now())):o.set(u.key,xt.empty())}),this.recalculateAndSaveOverlays(e,s).next(c=>(c.forEach((u,f)=>o.set(u,f)),t.forEach((u,f)=>{var m;return l.set(u,new h_(f,(m=o.get(u))!==null&&m!==void 0?m:null))}),l))}recalculateAndSaveOverlays(e,t){const r=es();let i=new Pe((o,l)=>o-l),s=ie();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(o=>{for(const l of o)l.keys().forEach(c=>{const u=t.get(c);if(u===null)return;let f=r.get(c)||xt.empty();f=l.applyToLocalView(u,f),r.set(c,f);const m=(i.get(l.batchId)||ie()).add(c);i=i.insert(l.batchId,m)})}).next(()=>{const o=[],l=i.getReverseIterator();for(;l.hasNext();){const c=l.getNext(),u=c.key,f=c.value,m=qf();f.forEach(p=>{if(!s.has(p)){const y=Kf(t.get(p),r.get(p));y!==null&&m.set(p,y),s=s.add(p)}}),o.push(this.documentOverlayCache.saveOverlays(e,u,m))}return L.waitFor(o)}).next(()=>r)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(r=>this.recalculateAndSaveOverlays(e,r))}getDocumentsMatchingQuery(e,t,r,i){return function(o){return Y.isDocumentKey(o.path)&&o.collectionGroup===null&&o.filters.length===0}(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):bb(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,r,i):this.getDocumentsMatchingCollectionQuery(e,t,r,i)}getNextDocuments(e,t,r,i){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,r,i).next(s=>{const o=i-s.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,r.largestBatchId,i-s.size):L.resolve(Pr());let l=-1,c=s;return o.next(u=>L.forEach(u,(f,m)=>(l<m.largestBatchId&&(l=m.largestBatchId),s.get(f)?L.resolve():this.remoteDocumentCache.getEntry(e,f).next(p=>{c=c.insert(f,p)}))).next(()=>this.populateOverlays(e,u,s)).next(()=>this.computeViews(e,c,u,ie())).next(f=>({batchId:l,changes:Uf(f)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new Y(t)).next(r=>{let i=Wi();return r.isFoundDocument()&&(i=i.insert(r.key,r)),i})}getDocumentsMatchingCollectionGroupQuery(e,t,r,i){const s=t.collectionGroup;let o=Wi();return this.indexManager.getCollectionParents(e,s).next(l=>L.forEach(l,c=>{const u=function(m,p){return new Ko(p,null,m.explicitOrderBy.slice(),m.filters.slice(),m.limit,m.limitType,m.startAt,m.endAt)}(t,c.child(s));return this.getDocumentsMatchingCollectionQuery(e,u,r,i).next(f=>{f.forEach((m,p)=>{o=o.insert(m,p)})})}).next(()=>o))}getDocumentsMatchingCollectionQuery(e,t,r,i){let s;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,r.largestBatchId).next(o=>(s=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,r,s,i))).next(o=>{s.forEach((c,u)=>{const f=u.getKey();o.get(f)===null&&(o=o.insert(f,it.newInvalidDocument(f)))});let l=Wi();return o.forEach((c,u)=>{const f=s.get(c);f!==void 0&&ts(f.mutation,u,xt.empty(),$e.now()),Jo(t,u)&&(l=l.insert(c,u))}),l})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class p_{constructor(e){this.serializer=e,this.hr=new Map,this.Pr=new Map}getBundleMetadata(e,t){return L.resolve(this.hr.get(t))}saveBundleMetadata(e,t){return this.hr.set(t.id,function(i){return{id:i.id,version:i.version,createTime:an(i.createTime)}}(t)),L.resolve()}getNamedQuery(e,t){return L.resolve(this.Pr.get(t))}saveNamedQuery(e,t){return this.Pr.set(t.name,function(i){return{name:i.name,query:l_(i.bundledQuery),readTime:an(i.readTime)}}(t)),L.resolve()}}/**
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
 */class m_{constructor(){this.overlays=new Pe(Y.comparator),this.Ir=new Map}getOverlay(e,t){return L.resolve(this.overlays.get(t))}getOverlays(e,t){const r=Pr();return L.forEach(t,i=>this.getOverlay(e,i).next(s=>{s!==null&&r.set(i,s)})).next(()=>r)}saveOverlays(e,t,r){return r.forEach((i,s)=>{this.ht(e,t,s)}),L.resolve()}removeOverlaysForBatchId(e,t,r){const i=this.Ir.get(r);return i!==void 0&&(i.forEach(s=>this.overlays=this.overlays.remove(s)),this.Ir.delete(r)),L.resolve()}getOverlaysForCollection(e,t,r){const i=Pr(),s=t.length+1,o=new Y(t.child("")),l=this.overlays.getIteratorFrom(o);for(;l.hasNext();){const c=l.getNext().value,u=c.getKey();if(!t.isPrefixOf(u.path))break;u.path.length===s&&c.largestBatchId>r&&i.set(c.getKey(),c)}return L.resolve(i)}getOverlaysForCollectionGroup(e,t,r,i){let s=new Pe((u,f)=>u-f);const o=this.overlays.getIterator();for(;o.hasNext();){const u=o.getNext().value;if(u.getKey().getCollectionGroup()===t&&u.largestBatchId>r){let f=s.get(u.largestBatchId);f===null&&(f=Pr(),s=s.insert(u.largestBatchId,f)),f.set(u.getKey(),u)}}const l=Pr(),c=s.getIterator();for(;c.hasNext()&&(c.getNext().value.forEach((u,f)=>l.set(u,f)),!(l.size()>=i)););return L.resolve(l)}ht(e,t,r){const i=this.overlays.get(r.key);if(i!==null){const o=this.Ir.get(i.largestBatchId).delete(r.key);this.Ir.set(i.largestBatchId,o)}this.overlays=this.overlays.insert(r.key,new Vb(t,r));let s=this.Ir.get(t);s===void 0&&(s=ie(),this.Ir.set(t,s)),this.Ir.set(t,s.add(r.key))}}/**
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
 */class g_{constructor(){this.sessionToken=Qe.EMPTY_BYTE_STRING}getSessionToken(e){return L.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,L.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lc{constructor(){this.Tr=new Ge(Ue.Er),this.dr=new Ge(Ue.Ar)}isEmpty(){return this.Tr.isEmpty()}addReference(e,t){const r=new Ue(e,t);this.Tr=this.Tr.add(r),this.dr=this.dr.add(r)}Rr(e,t){e.forEach(r=>this.addReference(r,t))}removeReference(e,t){this.Vr(new Ue(e,t))}mr(e,t){e.forEach(r=>this.removeReference(r,t))}gr(e){const t=new Y(new xe([])),r=new Ue(t,e),i=new Ue(t,e+1),s=[];return this.dr.forEachInRange([r,i],o=>{this.Vr(o),s.push(o.key)}),s}pr(){this.Tr.forEach(e=>this.Vr(e))}Vr(e){this.Tr=this.Tr.delete(e),this.dr=this.dr.delete(e)}yr(e){const t=new Y(new xe([])),r=new Ue(t,e),i=new Ue(t,e+1);let s=ie();return this.dr.forEachInRange([r,i],o=>{s=s.add(o.key)}),s}containsKey(e){const t=new Ue(e,0),r=this.Tr.firstAfterOrEqual(t);return r!==null&&e.isEqual(r.key)}}class Ue{constructor(e,t){this.key=e,this.wr=t}static Er(e,t){return Y.comparator(e.key,t.key)||he(e.wr,t.wr)}static Ar(e,t){return he(e.wr,t.wr)||Y.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class y_{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Sr=1,this.br=new Ge(Ue.Er)}checkEmpty(e){return L.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,r,i){const s=this.Sr;this.Sr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new Ob(s,t,r,i);this.mutationQueue.push(o);for(const l of i)this.br=this.br.add(new Ue(l.key,s)),this.indexManager.addToCollectionParentIndex(e,l.key.path.popLast());return L.resolve(o)}lookupMutationBatch(e,t){return L.resolve(this.Dr(t))}getNextMutationBatchAfterBatchId(e,t){const r=t+1,i=this.vr(r),s=i<0?0:i;return L.resolve(this.mutationQueue.length>s?this.mutationQueue[s]:null)}getHighestUnacknowledgedBatchId(){return L.resolve(this.mutationQueue.length===0?-1:this.Sr-1)}getAllMutationBatches(e){return L.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const r=new Ue(t,0),i=new Ue(t,Number.POSITIVE_INFINITY),s=[];return this.br.forEachInRange([r,i],o=>{const l=this.Dr(o.wr);s.push(l)}),L.resolve(s)}getAllMutationBatchesAffectingDocumentKeys(e,t){let r=new Ge(he);return t.forEach(i=>{const s=new Ue(i,0),o=new Ue(i,Number.POSITIVE_INFINITY);this.br.forEachInRange([s,o],l=>{r=r.add(l.wr)})}),L.resolve(this.Cr(r))}getAllMutationBatchesAffectingQuery(e,t){const r=t.path,i=r.length+1;let s=r;Y.isDocumentKey(s)||(s=s.child(""));const o=new Ue(new Y(s),0);let l=new Ge(he);return this.br.forEachWhile(c=>{const u=c.key.path;return!!r.isPrefixOf(u)&&(u.length===i&&(l=l.add(c.wr)),!0)},o),L.resolve(this.Cr(l))}Cr(e){const t=[];return e.forEach(r=>{const i=this.Dr(r);i!==null&&t.push(i)}),t}removeMutationBatch(e,t){me(this.Fr(t.batchId,"removed")===0),this.mutationQueue.shift();let r=this.br;return L.forEach(t.mutations,i=>{const s=new Ue(i.key,t.batchId);return r=r.delete(s),this.referenceDelegate.markPotentiallyOrphaned(e,i.key)}).next(()=>{this.br=r})}On(e){}containsKey(e,t){const r=new Ue(t,0),i=this.br.firstAfterOrEqual(r);return L.resolve(t.isEqual(i&&i.key))}performConsistencyCheck(e){return this.mutationQueue.length,L.resolve()}Fr(e,t){return this.vr(e)}vr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Dr(e){const t=this.vr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class v_{constructor(e){this.Mr=e,this.docs=function(){return new Pe(Y.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const r=t.key,i=this.docs.get(r),s=i?i.size:0,o=this.Mr(t);return this.docs=this.docs.insert(r,{document:t.mutableCopy(),size:o}),this.size+=o-s,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const r=this.docs.get(t);return L.resolve(r?r.document.mutableCopy():it.newInvalidDocument(t))}getEntries(e,t){let r=Bn();return t.forEach(i=>{const s=this.docs.get(i);r=r.insert(i,s?s.document.mutableCopy():it.newInvalidDocument(i))}),L.resolve(r)}getDocumentsMatchingQuery(e,t,r,i){let s=Bn();const o=t.path,l=new Y(o.child("")),c=this.docs.getIteratorFrom(l);for(;c.hasNext();){const{key:u,value:{document:f}}=c.getNext();if(!o.isPrefixOf(u.path))break;u.path.length>o.length+1||eb(Zw(f),r)<=0||(i.has(f.key)||Jo(t,f))&&(s=s.insert(f.key,f.mutableCopy()))}return L.resolve(s)}getAllFromCollectionGroup(e,t,r,i){G()}Or(e,t){return L.forEach(this.docs,r=>t(r))}newChangeBuffer(e){return new w_(this)}getSize(e){return L.resolve(this.size)}}class w_ extends d_{constructor(e){super(),this.cr=e}applyChanges(e){const t=[];return this.changes.forEach((r,i)=>{i.isValidDocument()?t.push(this.cr.addEntry(e,i)):this.cr.removeEntry(r)}),L.waitFor(t)}getFromCache(e,t){return this.cr.getEntry(e,t)}getAllFromCache(e,t){return this.cr.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class b_{constructor(e){this.persistence=e,this.Nr=new Ai(t=>tc(t),nc),this.lastRemoteSnapshotVersion=Q.min(),this.highestTargetId=0,this.Lr=0,this.Br=new lc,this.targetCount=0,this.kr=yi.Bn()}forEachTarget(e,t){return this.Nr.forEach((r,i)=>t(i)),L.resolve()}getLastRemoteSnapshotVersion(e){return L.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return L.resolve(this.Lr)}allocateTargetId(e){return this.highestTargetId=this.kr.next(),L.resolve(this.highestTargetId)}setTargetsMetadata(e,t,r){return r&&(this.lastRemoteSnapshotVersion=r),t>this.Lr&&(this.Lr=t),L.resolve()}Kn(e){this.Nr.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.kr=new yi(t),this.highestTargetId=t),e.sequenceNumber>this.Lr&&(this.Lr=e.sequenceNumber)}addTargetData(e,t){return this.Kn(t),this.targetCount+=1,L.resolve()}updateTargetData(e,t){return this.Kn(t),L.resolve()}removeTargetData(e,t){return this.Nr.delete(t.target),this.Br.gr(t.targetId),this.targetCount-=1,L.resolve()}removeTargets(e,t,r){let i=0;const s=[];return this.Nr.forEach((o,l)=>{l.sequenceNumber<=t&&r.get(l.targetId)===null&&(this.Nr.delete(o),s.push(this.removeMatchingKeysForTargetId(e,l.targetId)),i++)}),L.waitFor(s).next(()=>i)}getTargetCount(e){return L.resolve(this.targetCount)}getTargetData(e,t){const r=this.Nr.get(t)||null;return L.resolve(r)}addMatchingKeys(e,t,r){return this.Br.Rr(t,r),L.resolve()}removeMatchingKeys(e,t,r){this.Br.mr(t,r);const i=this.persistence.referenceDelegate,s=[];return i&&t.forEach(o=>{s.push(i.markPotentiallyOrphaned(e,o))}),L.waitFor(s)}removeMatchingKeysForTargetId(e,t){return this.Br.gr(t),L.resolve()}getMatchingKeysForTargetId(e,t){const r=this.Br.yr(t);return L.resolve(r)}containsKey(e,t){return L.resolve(this.Br.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class __{constructor(e,t){this.qr={},this.overlays={},this.Qr=new Jl(0),this.Kr=!1,this.Kr=!0,this.$r=new g_,this.referenceDelegate=e(this),this.Ur=new b_(this),this.indexManager=new c_,this.remoteDocumentCache=function(i){return new v_(i)}(r=>this.referenceDelegate.Wr(r)),this.serializer=new a_(t),this.Gr=new p_(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Kr=!1,Promise.resolve()}get started(){return this.Kr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new m_,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let r=this.qr[e.toKey()];return r||(r=new y_(t,this.referenceDelegate),this.qr[e.toKey()]=r),r}getGlobalsCache(){return this.$r}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Gr}runTransaction(e,t,r){z("MemoryPersistence","Starting transaction:",e);const i=new E_(this.Qr.next());return this.referenceDelegate.zr(),r(i).next(s=>this.referenceDelegate.jr(i).next(()=>s)).toPromise().then(s=>(i.raiseOnCommittedEvent(),s))}Hr(e,t){return L.or(Object.values(this.qr).map(r=>()=>r.containsKey(e,t)))}}class E_ extends nb{constructor(e){super(),this.currentSequenceNumber=e}}class cc{constructor(e){this.persistence=e,this.Jr=new lc,this.Yr=null}static Zr(e){return new cc(e)}get Xr(){if(this.Yr)return this.Yr;throw G()}addReference(e,t,r){return this.Jr.addReference(r,t),this.Xr.delete(r.toString()),L.resolve()}removeReference(e,t,r){return this.Jr.removeReference(r,t),this.Xr.add(r.toString()),L.resolve()}markPotentiallyOrphaned(e,t){return this.Xr.add(t.toString()),L.resolve()}removeTarget(e,t){this.Jr.gr(t.targetId).forEach(i=>this.Xr.add(i.toString()));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,t.targetId).next(i=>{i.forEach(s=>this.Xr.add(s.toString()))}).next(()=>r.removeTargetData(e,t))}zr(){this.Yr=new Set}jr(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return L.forEach(this.Xr,r=>{const i=Y.fromPath(r);return this.ei(e,i).next(s=>{s||t.removeEntry(i,Q.min())})}).next(()=>(this.Yr=null,t.apply(e)))}updateLimboDocument(e,t){return this.ei(e,t).next(r=>{r?this.Xr.delete(t.toString()):this.Xr.add(t.toString())})}Wr(e){return 0}ei(e,t){return L.or([()=>L.resolve(this.Jr.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Hr(e,t)])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uc{constructor(e,t,r,i){this.targetId=e,this.fromCache=t,this.$i=r,this.Ui=i}static Wi(e,t){let r=ie(),i=ie();for(const s of t.docChanges)switch(s.type){case 0:r=r.add(s.doc.key);break;case 1:i=i.add(s.doc.key)}return new uc(e,t.fromCache,r,i)}}/**
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
 */class T_{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class I_{constructor(){this.Gi=!1,this.zi=!1,this.ji=100,this.Hi=function(){return iy()?8:rb(ot())>0?6:4}()}initialize(e,t){this.Ji=e,this.indexManager=t,this.Gi=!0}getDocumentsMatchingQuery(e,t,r,i){const s={result:null};return this.Yi(e,t).next(o=>{s.result=o}).next(()=>{if(!s.result)return this.Zi(e,t,i,r).next(o=>{s.result=o})}).next(()=>{if(s.result)return;const o=new T_;return this.Xi(e,t,o).next(l=>{if(s.result=l,this.zi)return this.es(e,t,o,l.size)})}).next(()=>s.result)}es(e,t,r,i){return r.documentReadCount<this.ji?(Ui()<=oe.DEBUG&&z("QueryEngine","SDK will not create cache indexes for query:",ti(t),"since it only creates cache indexes for collection contains","more than or equal to",this.ji,"documents"),L.resolve()):(Ui()<=oe.DEBUG&&z("QueryEngine","Query:",ti(t),"scans",r.documentReadCount,"local documents and returns",i,"documents as results."),r.documentReadCount>this.Hi*i?(Ui()<=oe.DEBUG&&z("QueryEngine","The SDK decides to create cache indexes for query:",ti(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,on(t))):L.resolve())}Yi(e,t){if(Dd(t))return L.resolve(null);let r=on(t);return this.indexManager.getIndexType(e,r).next(i=>i===0?null:(t.limit!==null&&i===1&&(t=hl(t,null,"F"),r=on(t)),this.indexManager.getDocumentsMatchingTarget(e,r).next(s=>{const o=ie(...s);return this.Ji.getDocuments(e,o).next(l=>this.indexManager.getMinOffset(e,r).next(c=>{const u=this.ts(t,l);return this.ns(t,u,o,c.readTime)?this.Yi(e,hl(t,null,"F")):this.rs(e,u,t,c)}))})))}Zi(e,t,r,i){return Dd(t)||i.isEqual(Q.min())?L.resolve(null):this.Ji.getDocuments(e,r).next(s=>{const o=this.ts(t,s);return this.ns(t,o,r,i)?L.resolve(null):(Ui()<=oe.DEBUG&&z("QueryEngine","Re-using previous result from %s to execute query: %s",i.toString(),ti(t)),this.rs(e,o,t,Xw(i,-1)).next(l=>l))})}ts(e,t){let r=new Ge($f(e));return t.forEach((i,s)=>{Jo(e,s)&&(r=r.add(s))}),r}ns(e,t,r,i){if(e.limit===null)return!1;if(r.size!==t.size)return!0;const s=e.limitType==="F"?t.last():t.first();return!!s&&(s.hasPendingWrites||s.version.compareTo(i)>0)}Xi(e,t,r){return Ui()<=oe.DEBUG&&z("QueryEngine","Using full collection scan to execute query:",ti(t)),this.Ji.getDocumentsMatchingQuery(e,t,fr.min(),r)}rs(e,t,r,i){return this.Ji.getDocumentsMatchingQuery(e,r,i).next(s=>(t.forEach(o=>{s=s.insert(o.key,o)}),s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class S_{constructor(e,t,r,i){this.persistence=e,this.ss=t,this.serializer=i,this.os=new Pe(he),this._s=new Ai(s=>tc(s),nc),this.us=new Map,this.cs=e.getRemoteDocumentCache(),this.Ur=e.getTargetCache(),this.Gr=e.getBundleCache(),this.ls(r)}ls(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new f_(this.cs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.cs.setIndexManager(this.indexManager),this.ss.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.os))}}function A_(n,e,t,r){return new S_(n,e,t,r)}async function ap(n,e){const t=J(n);return await t.persistence.runTransaction("Handle user change","readonly",r=>{let i;return t.mutationQueue.getAllMutationBatches(r).next(s=>(i=s,t.ls(e),t.mutationQueue.getAllMutationBatches(r))).next(s=>{const o=[],l=[];let c=ie();for(const u of i){o.push(u.batchId);for(const f of u.mutations)c=c.add(f.key)}for(const u of s){l.push(u.batchId);for(const f of u.mutations)c=c.add(f.key)}return t.localDocuments.getDocuments(r,c).next(u=>({hs:u,removedBatchIds:o,addedBatchIds:l}))})})}function x_(n,e){const t=J(n);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",r=>{const i=e.batch.keys(),s=t.cs.newChangeBuffer({trackRemovals:!0});return function(l,c,u,f){const m=u.batch,p=m.keys();let y=L.resolve();return p.forEach(I=>{y=y.next(()=>f.getEntry(c,I)).next(S=>{const x=u.docVersions.get(I);me(x!==null),S.version.compareTo(x)<0&&(m.applyToRemoteDocument(S,u),S.isValidDocument()&&(S.setReadTime(u.commitVersion),f.addEntry(S)))})}),y.next(()=>l.mutationQueue.removeMutationBatch(c,m))}(t,r,e,s).next(()=>s.apply(r)).next(()=>t.mutationQueue.performConsistencyCheck(r)).next(()=>t.documentOverlayCache.removeOverlaysForBatchId(r,i,e.batch.batchId)).next(()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,function(l){let c=ie();for(let u=0;u<l.mutationResults.length;++u)l.mutationResults[u].transformResults.length>0&&(c=c.add(l.batch.mutations[u].key));return c}(e))).next(()=>t.localDocuments.getDocuments(r,i))})}function lp(n){const e=J(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",t=>e.Ur.getLastRemoteSnapshotVersion(t))}function R_(n,e){const t=J(n),r=e.snapshotVersion;let i=t.os;return t.persistence.runTransaction("Apply remote event","readwrite-primary",s=>{const o=t.cs.newChangeBuffer({trackRemovals:!0});i=t.os;const l=[];e.targetChanges.forEach((f,m)=>{const p=i.get(m);if(!p)return;l.push(t.Ur.removeMatchingKeys(s,f.removedDocuments,m).next(()=>t.Ur.addMatchingKeys(s,f.addedDocuments,m)));let y=p.withSequenceNumber(s.currentSequenceNumber);e.targetMismatches.get(m)!==null?y=y.withResumeToken(Qe.EMPTY_BYTE_STRING,Q.min()).withLastLimboFreeSnapshotVersion(Q.min()):f.resumeToken.approximateByteSize()>0&&(y=y.withResumeToken(f.resumeToken,r)),i=i.insert(m,y),function(S,x,k){return S.resumeToken.approximateByteSize()===0||x.snapshotVersion.toMicroseconds()-S.snapshotVersion.toMicroseconds()>=3e8?!0:k.addedDocuments.size+k.modifiedDocuments.size+k.removedDocuments.size>0}(p,y,f)&&l.push(t.Ur.updateTargetData(s,y))});let c=Bn(),u=ie();if(e.documentUpdates.forEach(f=>{e.resolvedLimboDocuments.has(f)&&l.push(t.persistence.referenceDelegate.updateLimboDocument(s,f))}),l.push(k_(s,o,e.documentUpdates).next(f=>{c=f.Ps,u=f.Is})),!r.isEqual(Q.min())){const f=t.Ur.getLastRemoteSnapshotVersion(s).next(m=>t.Ur.setTargetsMetadata(s,s.currentSequenceNumber,r));l.push(f)}return L.waitFor(l).next(()=>o.apply(s)).next(()=>t.localDocuments.getLocalViewOfDocuments(s,c,u)).next(()=>c)}).then(s=>(t.os=i,s))}function k_(n,e,t){let r=ie(),i=ie();return t.forEach(s=>r=r.add(s)),e.getEntries(n,r).next(s=>{let o=Bn();return t.forEach((l,c)=>{const u=s.get(l);c.isFoundDocument()!==u.isFoundDocument()&&(i=i.add(l)),c.isNoDocument()&&c.version.isEqual(Q.min())?(e.removeEntry(l,c.readTime),o=o.insert(l,c)):!u.isValidDocument()||c.version.compareTo(u.version)>0||c.version.compareTo(u.version)===0&&u.hasPendingWrites?(e.addEntry(c),o=o.insert(l,c)):z("LocalStore","Ignoring outdated watch update for ",l,". Current version:",u.version," Watch version:",c.version)}),{Ps:o,Is:i}})}function P_(n,e){const t=J(n);return t.persistence.runTransaction("Get next mutation batch","readonly",r=>(e===void 0&&(e=-1),t.mutationQueue.getNextMutationBatchAfterBatchId(r,e)))}function C_(n,e){const t=J(n);return t.persistence.runTransaction("Allocate target","readwrite",r=>{let i;return t.Ur.getTargetData(r,e).next(s=>s?(i=s,L.resolve(i)):t.Ur.allocateTargetId(r).next(o=>(i=new sr(e,o,"TargetPurposeListen",r.currentSequenceNumber),t.Ur.addTargetData(r,i).next(()=>i))))}).then(r=>{const i=t.os.get(r.targetId);return(i===null||r.snapshotVersion.compareTo(i.snapshotVersion)>0)&&(t.os=t.os.insert(r.targetId,r),t._s.set(e,r.targetId)),r})}async function yl(n,e,t){const r=J(n),i=r.os.get(e),s=t?"readwrite":"readwrite-primary";try{t||await r.persistence.runTransaction("Release target",s,o=>r.persistence.referenceDelegate.removeTarget(o,i))}catch(o){if(!Rs(o))throw o;z("LocalStore",`Failed to update sequence numbers for target ${e}: ${o}`)}r.os=r.os.remove(e),r._s.delete(i.target)}function Hd(n,e,t){const r=J(n);let i=Q.min(),s=ie();return r.persistence.runTransaction("Execute query","readwrite",o=>function(c,u,f){const m=J(c),p=m._s.get(f);return p!==void 0?L.resolve(m.os.get(p)):m.Ur.getTargetData(u,f)}(r,o,on(e)).next(l=>{if(l)return i=l.lastLimboFreeSnapshotVersion,r.Ur.getMatchingKeysForTargetId(o,l.targetId).next(c=>{s=c})}).next(()=>r.ss.getDocumentsMatchingQuery(o,e,t?i:Q.min(),t?s:ie())).next(l=>(M_(r,Eb(e),l),{documents:l,Ts:s})))}function M_(n,e,t){let r=n.us.get(e)||Q.min();t.forEach((i,s)=>{s.readTime.compareTo(r)>0&&(r=s.readTime)}),n.us.set(e,r)}class Yd{constructor(){this.activeTargetIds=Rb()}fs(e){this.activeTargetIds=this.activeTargetIds.add(e)}gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Vs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class D_{constructor(){this.so=new Yd,this.oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,r){}addLocalQueryTarget(e,t=!0){return t&&this.so.fs(e),this.oo[e]||"not-current"}updateQueryState(e,t,r){this.oo[e]=t}removeLocalQueryTarget(e){this.so.gs(e)}isLocalQueryTarget(e){return this.so.activeTargetIds.has(e)}clearQueryState(e){delete this.oo[e]}getAllActiveQueryTargets(){return this.so.activeTargetIds}isActiveQueryTarget(e){return this.so.activeTargetIds.has(e)}start(){return this.so=new Yd,Promise.resolve()}handleUserChange(e,t,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class L_{_o(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jd{constructor(){this.ao=()=>this.uo(),this.co=()=>this.lo(),this.ho=[],this.Po()}_o(e){this.ho.push(e)}shutdown(){window.removeEventListener("online",this.ao),window.removeEventListener("offline",this.co)}Po(){window.addEventListener("online",this.ao),window.addEventListener("offline",this.co)}uo(){z("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const e of this.ho)e(0)}lo(){z("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const e of this.ho)e(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
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
 */let no=null;function Ha(){return no===null?no=function(){return 268435456+Math.round(2147483648*Math.random())}():no++,"0x"+no.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const N_={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class B_{constructor(e){this.Io=e.Io,this.To=e.To}Eo(e){this.Ao=e}Ro(e){this.Vo=e}mo(e){this.fo=e}onMessage(e){this.po=e}close(){this.To()}send(e){this.Io(e)}yo(){this.Ao()}wo(){this.Vo()}So(e){this.fo(e)}bo(e){this.po(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nt="WebChannelConnection";class O_ extends class{constructor(t){this.databaseInfo=t,this.databaseId=t.databaseId;const r=t.ssl?"https":"http",i=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.Do=r+"://"+t.host,this.vo=`projects/${i}/databases/${s}`,this.Co=this.databaseId.database==="(default)"?`project_id=${i}`:`project_id=${i}&database_id=${s}`}get Fo(){return!1}Mo(t,r,i,s,o){const l=Ha(),c=this.xo(t,r.toUriEncodedString());z("RestConnection",`Sending RPC '${t}' ${l}:`,c,i);const u={"google-cloud-resource-prefix":this.vo,"x-goog-request-params":this.Co};return this.Oo(u,s,o),this.No(t,c,u,i).then(f=>(z("RestConnection",`Received RPC '${t}' ${l}: `,f),f),f=>{throw fi("RestConnection",`RPC '${t}' ${l} failed with error: `,f,"url: ",c,"request:",i),f})}Lo(t,r,i,s,o,l){return this.Mo(t,r,i,s,o)}Oo(t,r,i){t["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+Si}(),t["Content-Type"]="text/plain",this.databaseInfo.appId&&(t["X-Firebase-GMPID"]=this.databaseInfo.appId),r&&r.headers.forEach((s,o)=>t[o]=s),i&&i.headers.forEach((s,o)=>t[o]=s)}xo(t,r){const i=N_[t];return`${this.Do}/v1/${r}:${i}`}terminate(){}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}No(e,t,r,i){const s=Ha();return new Promise((o,l)=>{const c=new Tf;c.setWithCredentials(!0),c.listenOnce(If.COMPLETE,()=>{try{switch(c.getLastErrorCode()){case lo.NO_ERROR:const f=c.getResponseJson();z(nt,`XHR for RPC '${e}' ${s} received:`,JSON.stringify(f)),o(f);break;case lo.TIMEOUT:z(nt,`RPC '${e}' ${s} timed out`),l(new U(M.DEADLINE_EXCEEDED,"Request time out"));break;case lo.HTTP_ERROR:const m=c.getStatus();if(z(nt,`RPC '${e}' ${s} failed with status:`,m,"response text:",c.getResponseText()),m>0){let p=c.getResponseJson();Array.isArray(p)&&(p=p[0]);const y=p==null?void 0:p.error;if(y&&y.status&&y.message){const I=function(x){const k=x.toLowerCase().replace(/_/g,"-");return Object.values(M).indexOf(k)>=0?k:M.UNKNOWN}(y.status);l(new U(I,y.message))}else l(new U(M.UNKNOWN,"Server responded with status "+c.getStatus()))}else l(new U(M.UNAVAILABLE,"Connection failed."));break;default:G()}}finally{z(nt,`RPC '${e}' ${s} completed.`)}});const u=JSON.stringify(i);z(nt,`RPC '${e}' ${s} sending request:`,i),c.send(t,"POST",u,r,15)})}Bo(e,t,r){const i=Ha(),s=[this.Do,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=xf(),l=Af(),c={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},u=this.longPollingOptions.timeoutSeconds;u!==void 0&&(c.longPollingTimeout=Math.round(1e3*u)),this.useFetchStreams&&(c.useFetchStreams=!0),this.Oo(c.initMessageHeaders,t,r),c.encodeInitMessageHeaders=!0;const f=s.join("");z(nt,`Creating RPC '${e}' stream ${i}: ${f}`,c);const m=o.createWebChannel(f,c);let p=!1,y=!1;const I=new B_({Io:x=>{y?z(nt,`Not sending because RPC '${e}' stream ${i} is closed:`,x):(p||(z(nt,`Opening RPC '${e}' stream ${i} transport.`),m.open(),p=!0),z(nt,`RPC '${e}' stream ${i} sending:`,x),m.send(x))},To:()=>m.close()}),S=(x,k,C)=>{x.listen(k,N=>{try{C(N)}catch(B){setTimeout(()=>{throw B},0)}})};return S(m,ji.EventType.OPEN,()=>{y||(z(nt,`RPC '${e}' stream ${i} transport opened.`),I.yo())}),S(m,ji.EventType.CLOSE,()=>{y||(y=!0,z(nt,`RPC '${e}' stream ${i} transport closed`),I.So())}),S(m,ji.EventType.ERROR,x=>{y||(y=!0,fi(nt,`RPC '${e}' stream ${i} transport errored:`,x),I.So(new U(M.UNAVAILABLE,"The operation could not be completed")))}),S(m,ji.EventType.MESSAGE,x=>{var k;if(!y){const C=x.data[0];me(!!C);const N=C,B=N.error||((k=N[0])===null||k===void 0?void 0:k.error);if(B){z(nt,`RPC '${e}' stream ${i} received error:`,B);const $=B.status;let q=function(_){const b=Oe[_];if(b!==void 0)return Jf(b)}($),T=B.message;q===void 0&&(q=M.INTERNAL,T="Unknown error status: "+$+" with message "+B.message),y=!0,I.So(new U(q,T)),m.close()}else z(nt,`RPC '${e}' stream ${i} received:`,C),I.bo(C)}}),S(l,Sf.STAT_EVENT,x=>{x.stat===al.PROXY?z(nt,`RPC '${e}' stream ${i} detected buffering proxy`):x.stat===al.NOPROXY&&z(nt,`RPC '${e}' stream ${i} detected no buffering proxy`)}),setTimeout(()=>{I.wo()},0),I}}function Ya(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function na(n){return new Wb(n,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cp{constructor(e,t,r=1e3,i=1.5,s=6e4){this.ui=e,this.timerId=t,this.ko=r,this.qo=i,this.Qo=s,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(e){this.cancel();const t=Math.floor(this.Ko+this.zo()),r=Math.max(0,Date.now()-this.Uo),i=Math.max(0,t-r);i>0&&z("ExponentialBackoff",`Backing off for ${i} ms (base delay: ${this.Ko} ms, delay with jitter: ${t} ms, last attempt: ${r} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,i,()=>(this.Uo=Date.now(),e())),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){this.$o!==null&&(this.$o.skipDelay(),this.$o=null)}cancel(){this.$o!==null&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class up{constructor(e,t,r,i,s,o,l,c){this.ui=e,this.Ho=r,this.Jo=i,this.connection=s,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=l,this.listener=c,this.state=0,this.Yo=0,this.Zo=null,this.Xo=null,this.stream=null,this.e_=0,this.t_=new cp(e,t)}n_(){return this.state===1||this.state===5||this.r_()}r_(){return this.state===2||this.state===3}start(){this.e_=0,this.state!==4?this.auth():this.i_()}async stop(){this.n_()&&await this.close(0)}s_(){this.state=0,this.t_.reset()}o_(){this.r_()&&this.Zo===null&&(this.Zo=this.ui.enqueueAfterDelay(this.Ho,6e4,()=>this.__()))}a_(e){this.u_(),this.stream.send(e)}async __(){if(this.r_())return this.close(0)}u_(){this.Zo&&(this.Zo.cancel(),this.Zo=null)}c_(){this.Xo&&(this.Xo.cancel(),this.Xo=null)}async close(e,t){this.u_(),this.c_(),this.t_.cancel(),this.Yo++,e!==4?this.t_.reset():t&&t.code===M.RESOURCE_EXHAUSTED?(Nn(t.toString()),Nn("Using maximum backoff delay to prevent overloading the backend."),this.t_.Wo()):t&&t.code===M.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.l_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.mo(t)}l_(){}auth(){this.state=1;const e=this.h_(this.Yo),t=this.Yo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([r,i])=>{this.Yo===t&&this.P_(r,i)},r=>{e(()=>{const i=new U(M.UNKNOWN,"Fetching auth token failed: "+r.message);return this.I_(i)})})}P_(e,t){const r=this.h_(this.Yo);this.stream=this.T_(e,t),this.stream.Eo(()=>{r(()=>this.listener.Eo())}),this.stream.Ro(()=>{r(()=>(this.state=2,this.Xo=this.ui.enqueueAfterDelay(this.Jo,1e4,()=>(this.r_()&&(this.state=3),Promise.resolve())),this.listener.Ro()))}),this.stream.mo(i=>{r(()=>this.I_(i))}),this.stream.onMessage(i=>{r(()=>++this.e_==1?this.E_(i):this.onNext(i))})}i_(){this.state=5,this.t_.Go(async()=>{this.state=0,this.start()})}I_(e){return z("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}h_(e){return t=>{this.ui.enqueueAndForget(()=>this.Yo===e?t():(z("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class V_ extends up{constructor(e,t,r,i,s,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,r,i,o),this.serializer=s}T_(e,t){return this.connection.Bo("Listen",e,t)}E_(e){return this.onNext(e)}onNext(e){this.t_.reset();const t=Qb(this.serializer,e),r=function(s){if(!("targetChange"in s))return Q.min();const o=s.targetChange;return o.targetIds&&o.targetIds.length?Q.min():o.readTime?an(o.readTime):Q.min()}(e);return this.listener.d_(t,r)}A_(e){const t={};t.database=gl(this.serializer),t.addTarget=function(s,o){let l;const c=o.target;if(l=dl(c)?{documents:Zb(s,c)}:{query:e_(s,c)._t},l.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){l.resumeToken=ep(s,o.resumeToken);const u=fl(s,o.expectedCount);u!==null&&(l.expectedCount=u)}else if(o.snapshotVersion.compareTo(Q.min())>0){l.readTime=Co(s,o.snapshotVersion.toTimestamp());const u=fl(s,o.expectedCount);u!==null&&(l.expectedCount=u)}return l}(this.serializer,e);const r=n_(this.serializer,e);r&&(t.labels=r),this.a_(t)}R_(e){const t={};t.database=gl(this.serializer),t.removeTarget=e,this.a_(t)}}class F_ extends up{constructor(e,t,r,i,s,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,r,i,o),this.serializer=s}get V_(){return this.e_>0}start(){this.lastStreamToken=void 0,super.start()}l_(){this.V_&&this.m_([])}T_(e,t){return this.connection.Bo("Write",e,t)}E_(e){return me(!!e.streamToken),this.lastStreamToken=e.streamToken,me(!e.writeResults||e.writeResults.length===0),this.listener.f_()}onNext(e){me(!!e.streamToken),this.lastStreamToken=e.streamToken,this.t_.reset();const t=Xb(e.writeResults,e.commitTime),r=an(e.commitTime);return this.listener.g_(r,t)}p_(){const e={};e.database=gl(this.serializer),this.a_(e)}m_(e){const t={streamToken:this.lastStreamToken,writes:e.map(r=>Jb(this.serializer,r))};this.a_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $_ extends class{}{constructor(e,t,r,i){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=r,this.serializer=i,this.y_=!1}w_(){if(this.y_)throw new U(M.FAILED_PRECONDITION,"The client has already been terminated.")}Mo(e,t,r,i){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,o])=>this.connection.Mo(e,pl(t,r),i,s,o)).catch(s=>{throw s.name==="FirebaseError"?(s.code===M.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),s):new U(M.UNKNOWN,s.toString())})}Lo(e,t,r,i,s){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,l])=>this.connection.Lo(e,pl(t,r),i,o,l,s)).catch(o=>{throw o.name==="FirebaseError"?(o.code===M.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new U(M.UNKNOWN,o.toString())})}terminate(){this.y_=!0,this.connection.terminate()}}class z_{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.S_=0,this.b_=null,this.D_=!0}v_(){this.S_===0&&(this.C_("Unknown"),this.b_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.b_=null,this.F_("Backend didn't respond within 10 seconds."),this.C_("Offline"),Promise.resolve())))}M_(e){this.state==="Online"?this.C_("Unknown"):(this.S_++,this.S_>=1&&(this.x_(),this.F_(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.C_("Offline")))}set(e){this.x_(),this.S_=0,e==="Online"&&(this.D_=!1),this.C_(e)}C_(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}F_(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.D_?(Nn(t),this.D_=!1):z("OnlineStateTracker",t)}x_(){this.b_!==null&&(this.b_.cancel(),this.b_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class U_{constructor(e,t,r,i,s){this.localStore=e,this.datastore=t,this.asyncQueue=r,this.remoteSyncer={},this.O_=[],this.N_=new Map,this.L_=new Set,this.B_=[],this.k_=s,this.k_._o(o=>{r.enqueueAndForget(async()=>{jr(this)&&(z("RemoteStore","Restarting streams for network reachability change."),await async function(c){const u=J(c);u.L_.add(4),await Cs(u),u.q_.set("Unknown"),u.L_.delete(4),await ra(u)}(this))})}),this.q_=new z_(r,i)}}async function ra(n){if(jr(n))for(const e of n.B_)await e(!0)}async function Cs(n){for(const e of n.B_)await e(!1)}function dp(n,e){const t=J(n);t.N_.has(e.targetId)||(t.N_.set(e.targetId,e),pc(t)?fc(t):xi(t).r_()&&hc(t,e))}function dc(n,e){const t=J(n),r=xi(t);t.N_.delete(e),r.r_()&&hp(t,e),t.N_.size===0&&(r.r_()?r.o_():jr(t)&&t.q_.set("Unknown"))}function hc(n,e){if(n.Q_.xe(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(Q.min())>0){const t=n.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}xi(n).A_(e)}function hp(n,e){n.Q_.xe(e),xi(n).R_(e)}function fc(n){n.Q_=new qb({getRemoteKeysForTarget:e=>n.remoteSyncer.getRemoteKeysForTarget(e),ot:e=>n.N_.get(e)||null,tt:()=>n.datastore.serializer.databaseId}),xi(n).start(),n.q_.v_()}function pc(n){return jr(n)&&!xi(n).n_()&&n.N_.size>0}function jr(n){return J(n).L_.size===0}function fp(n){n.Q_=void 0}async function q_(n){n.q_.set("Online")}async function H_(n){n.N_.forEach((e,t)=>{hc(n,e)})}async function Y_(n,e){fp(n),pc(n)?(n.q_.M_(e),fc(n)):n.q_.set("Unknown")}async function j_(n,e,t){if(n.q_.set("Online"),e instanceof Zf&&e.state===2&&e.cause)try{await async function(i,s){const o=s.cause;for(const l of s.targetIds)i.N_.has(l)&&(await i.remoteSyncer.rejectListen(l,o),i.N_.delete(l),i.Q_.removeTarget(l))}(n,e)}catch(r){z("RemoteStore","Failed to remove targets %s: %s ",e.targetIds.join(","),r),await Mo(n,r)}else if(e instanceof ho?n.Q_.Ke(e):e instanceof Xf?n.Q_.He(e):n.Q_.We(e),!t.isEqual(Q.min()))try{const r=await lp(n.localStore);t.compareTo(r)>=0&&await function(s,o){const l=s.Q_.rt(o);return l.targetChanges.forEach((c,u)=>{if(c.resumeToken.approximateByteSize()>0){const f=s.N_.get(u);f&&s.N_.set(u,f.withResumeToken(c.resumeToken,o))}}),l.targetMismatches.forEach((c,u)=>{const f=s.N_.get(c);if(!f)return;s.N_.set(c,f.withResumeToken(Qe.EMPTY_BYTE_STRING,f.snapshotVersion)),hp(s,c);const m=new sr(f.target,c,u,f.sequenceNumber);hc(s,m)}),s.remoteSyncer.applyRemoteEvent(l)}(n,t)}catch(r){z("RemoteStore","Failed to raise snapshot:",r),await Mo(n,r)}}async function Mo(n,e,t){if(!Rs(e))throw e;n.L_.add(1),await Cs(n),n.q_.set("Offline"),t||(t=()=>lp(n.localStore)),n.asyncQueue.enqueueRetryable(async()=>{z("RemoteStore","Retrying IndexedDB access"),await t(),n.L_.delete(1),await ra(n)})}function pp(n,e){return e().catch(t=>Mo(n,t,e))}async function ia(n){const e=J(n),t=mr(e);let r=e.O_.length>0?e.O_[e.O_.length-1].batchId:-1;for(;W_(e);)try{const i=await P_(e.localStore,r);if(i===null){e.O_.length===0&&t.o_();break}r=i.batchId,G_(e,i)}catch(i){await Mo(e,i)}mp(e)&&gp(e)}function W_(n){return jr(n)&&n.O_.length<10}function G_(n,e){n.O_.push(e);const t=mr(n);t.r_()&&t.V_&&t.m_(e.mutations)}function mp(n){return jr(n)&&!mr(n).n_()&&n.O_.length>0}function gp(n){mr(n).start()}async function K_(n){mr(n).p_()}async function Q_(n){const e=mr(n);for(const t of n.O_)e.m_(t.mutations)}async function J_(n,e,t){const r=n.O_.shift(),i=sc.from(r,e,t);await pp(n,()=>n.remoteSyncer.applySuccessfulWrite(i)),await ia(n)}async function X_(n,e){e&&mr(n).V_&&await async function(r,i){if(function(o){return $b(o)&&o!==M.ABORTED}(i.code)){const s=r.O_.shift();mr(r).s_(),await pp(r,()=>r.remoteSyncer.rejectFailedWrite(s.batchId,i)),await ia(r)}}(n,e),mp(n)&&gp(n)}async function Wd(n,e){const t=J(n);t.asyncQueue.verifyOperationInProgress(),z("RemoteStore","RemoteStore received new credentials");const r=jr(t);t.L_.add(3),await Cs(t),r&&t.q_.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.L_.delete(3),await ra(t)}async function Z_(n,e){const t=J(n);e?(t.L_.delete(2),await ra(t)):e||(t.L_.add(2),await Cs(t),t.q_.set("Unknown"))}function xi(n){return n.K_||(n.K_=function(t,r,i){const s=J(t);return s.w_(),new V_(r,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,i)}(n.datastore,n.asyncQueue,{Eo:q_.bind(null,n),Ro:H_.bind(null,n),mo:Y_.bind(null,n),d_:j_.bind(null,n)}),n.B_.push(async e=>{e?(n.K_.s_(),pc(n)?fc(n):n.q_.set("Unknown")):(await n.K_.stop(),fp(n))})),n.K_}function mr(n){return n.U_||(n.U_=function(t,r,i){const s=J(t);return s.w_(),new F_(r,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,i)}(n.datastore,n.asyncQueue,{Eo:()=>Promise.resolve(),Ro:K_.bind(null,n),mo:X_.bind(null,n),f_:Q_.bind(null,n),g_:J_.bind(null,n)}),n.B_.push(async e=>{e?(n.U_.s_(),await ia(n)):(await n.U_.stop(),n.O_.length>0&&(z("RemoteStore",`Stopping write stream with ${n.O_.length} pending writes`),n.O_=[]))})),n.U_}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mc{constructor(e,t,r,i,s){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=r,this.op=i,this.removalCallback=s,this.deferred=new Pn,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(o=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,r,i,s){const o=Date.now()+r,l=new mc(e,t,o,i,s);return l.start(r),l}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new U(M.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function gc(n,e){if(Nn("AsyncQueue",`${e}: ${n}`),Rs(n))return new U(M.UNAVAILABLE,`${e}: ${n}`);throw n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class li{constructor(e){this.comparator=e?(t,r)=>e(t,r)||Y.comparator(t.key,r.key):(t,r)=>Y.comparator(t.key,r.key),this.keyedMap=Wi(),this.sortedSet=new Pe(this.comparator)}static emptySet(e){return new li(e.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((t,r)=>(e(t),!1))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof li)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),r=e.sortedSet.getIterator();for(;t.hasNext();){const i=t.getNext().key,s=r.getNext().key;if(!i.isEqual(s))return!1}return!0}toString(){const e=[];return this.forEach(t=>{e.push(t.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const r=new li;return r.comparator=this.comparator,r.keyedMap=e,r.sortedSet=t,r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gd{constructor(){this.W_=new Pe(Y.comparator)}track(e){const t=e.doc.key,r=this.W_.get(t);r?e.type!==0&&r.type===3?this.W_=this.W_.insert(t,e):e.type===3&&r.type!==1?this.W_=this.W_.insert(t,{type:r.type,doc:e.doc}):e.type===2&&r.type===2?this.W_=this.W_.insert(t,{type:2,doc:e.doc}):e.type===2&&r.type===0?this.W_=this.W_.insert(t,{type:0,doc:e.doc}):e.type===1&&r.type===0?this.W_=this.W_.remove(t):e.type===1&&r.type===2?this.W_=this.W_.insert(t,{type:1,doc:r.doc}):e.type===0&&r.type===1?this.W_=this.W_.insert(t,{type:2,doc:e.doc}):G():this.W_=this.W_.insert(t,e)}G_(){const e=[];return this.W_.inorderTraversal((t,r)=>{e.push(r)}),e}}class vi{constructor(e,t,r,i,s,o,l,c,u){this.query=e,this.docs=t,this.oldDocs=r,this.docChanges=i,this.mutatedKeys=s,this.fromCache=o,this.syncStateChanged=l,this.excludesMetadataChanges=c,this.hasCachedResults=u}static fromInitialDocuments(e,t,r,i,s){const o=[];return t.forEach(l=>{o.push({type:0,doc:l})}),new vi(e,t,li.emptySet(t),o,r,i,!0,!1,s)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Qo(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,r=e.docChanges;if(t.length!==r.length)return!1;for(let i=0;i<t.length;i++)if(t[i].type!==r[i].type||!t[i].doc.isEqual(r[i].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eE{constructor(){this.z_=void 0,this.j_=[]}H_(){return this.j_.some(e=>e.J_())}}class tE{constructor(){this.queries=Kd(),this.onlineState="Unknown",this.Y_=new Set}terminate(){(function(t,r){const i=J(t),s=i.queries;i.queries=Kd(),s.forEach((o,l)=>{for(const c of l.j_)c.onError(r)})})(this,new U(M.ABORTED,"Firestore shutting down"))}}function Kd(){return new Ai(n=>Ff(n),Qo)}async function yp(n,e){const t=J(n);let r=3;const i=e.query;let s=t.queries.get(i);s?!s.H_()&&e.J_()&&(r=2):(s=new eE,r=e.J_()?0:1);try{switch(r){case 0:s.z_=await t.onListen(i,!0);break;case 1:s.z_=await t.onListen(i,!1);break;case 2:await t.onFirstRemoteStoreListen(i)}}catch(o){const l=gc(o,`Initialization of query '${ti(e.query)}' failed`);return void e.onError(l)}t.queries.set(i,s),s.j_.push(e),e.Z_(t.onlineState),s.z_&&e.X_(s.z_)&&yc(t)}async function vp(n,e){const t=J(n),r=e.query;let i=3;const s=t.queries.get(r);if(s){const o=s.j_.indexOf(e);o>=0&&(s.j_.splice(o,1),s.j_.length===0?i=e.J_()?0:1:!s.H_()&&e.J_()&&(i=2))}switch(i){case 0:return t.queries.delete(r),t.onUnlisten(r,!0);case 1:return t.queries.delete(r),t.onUnlisten(r,!1);case 2:return t.onLastRemoteStoreUnlisten(r);default:return}}function nE(n,e){const t=J(n);let r=!1;for(const i of e){const s=i.query,o=t.queries.get(s);if(o){for(const l of o.j_)l.X_(i)&&(r=!0);o.z_=i}}r&&yc(t)}function rE(n,e,t){const r=J(n),i=r.queries.get(e);if(i)for(const s of i.j_)s.onError(t);r.queries.delete(e)}function yc(n){n.Y_.forEach(e=>{e.next()})}var vl,Qd;(Qd=vl||(vl={})).ea="default",Qd.Cache="cache";class wp{constructor(e,t,r){this.query=e,this.ta=t,this.na=!1,this.ra=null,this.onlineState="Unknown",this.options=r||{}}X_(e){if(!this.options.includeMetadataChanges){const r=[];for(const i of e.docChanges)i.type!==3&&r.push(i);e=new vi(e.query,e.docs,e.oldDocs,r,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.na?this.ia(e)&&(this.ta.next(e),t=!0):this.sa(e,this.onlineState)&&(this.oa(e),t=!0),this.ra=e,t}onError(e){this.ta.error(e)}Z_(e){this.onlineState=e;let t=!1;return this.ra&&!this.na&&this.sa(this.ra,e)&&(this.oa(this.ra),t=!0),t}sa(e,t){if(!e.fromCache||!this.J_())return!0;const r=t!=="Offline";return(!this.options._a||!r)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}ia(e){if(e.docChanges.length>0)return!0;const t=this.ra&&this.ra.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}oa(e){e=vi.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.na=!0,this.ta.next(e)}J_(){return this.options.source!==vl.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bp{constructor(e){this.key=e}}class _p{constructor(e){this.key=e}}class iE{constructor(e,t){this.query=e,this.Ta=t,this.Ea=null,this.hasCachedResults=!1,this.current=!1,this.da=ie(),this.mutatedKeys=ie(),this.Aa=$f(e),this.Ra=new li(this.Aa)}get Va(){return this.Ta}ma(e,t){const r=t?t.fa:new Gd,i=t?t.Ra:this.Ra;let s=t?t.mutatedKeys:this.mutatedKeys,o=i,l=!1;const c=this.query.limitType==="F"&&i.size===this.query.limit?i.last():null,u=this.query.limitType==="L"&&i.size===this.query.limit?i.first():null;if(e.inorderTraversal((f,m)=>{const p=i.get(f),y=Jo(this.query,m)?m:null,I=!!p&&this.mutatedKeys.has(p.key),S=!!y&&(y.hasLocalMutations||this.mutatedKeys.has(y.key)&&y.hasCommittedMutations);let x=!1;p&&y?p.data.isEqual(y.data)?I!==S&&(r.track({type:3,doc:y}),x=!0):this.ga(p,y)||(r.track({type:2,doc:y}),x=!0,(c&&this.Aa(y,c)>0||u&&this.Aa(y,u)<0)&&(l=!0)):!p&&y?(r.track({type:0,doc:y}),x=!0):p&&!y&&(r.track({type:1,doc:p}),x=!0,(c||u)&&(l=!0)),x&&(y?(o=o.add(y),s=S?s.add(f):s.delete(f)):(o=o.delete(f),s=s.delete(f)))}),this.query.limit!==null)for(;o.size>this.query.limit;){const f=this.query.limitType==="F"?o.last():o.first();o=o.delete(f.key),s=s.delete(f.key),r.track({type:1,doc:f})}return{Ra:o,fa:r,ns:l,mutatedKeys:s}}ga(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,r,i){const s=this.Ra;this.Ra=e.Ra,this.mutatedKeys=e.mutatedKeys;const o=e.fa.G_();o.sort((f,m)=>function(y,I){const S=x=>{switch(x){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return G()}};return S(y)-S(I)}(f.type,m.type)||this.Aa(f.doc,m.doc)),this.pa(r),i=i!=null&&i;const l=t&&!i?this.ya():[],c=this.da.size===0&&this.current&&!i?1:0,u=c!==this.Ea;return this.Ea=c,o.length!==0||u?{snapshot:new vi(this.query,e.Ra,s,o,e.mutatedKeys,c===0,u,!1,!!r&&r.resumeToken.approximateByteSize()>0),wa:l}:{wa:l}}Z_(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Ra:this.Ra,fa:new Gd,mutatedKeys:this.mutatedKeys,ns:!1},!1)):{wa:[]}}Sa(e){return!this.Ta.has(e)&&!!this.Ra.has(e)&&!this.Ra.get(e).hasLocalMutations}pa(e){e&&(e.addedDocuments.forEach(t=>this.Ta=this.Ta.add(t)),e.modifiedDocuments.forEach(t=>{}),e.removedDocuments.forEach(t=>this.Ta=this.Ta.delete(t)),this.current=e.current)}ya(){if(!this.current)return[];const e=this.da;this.da=ie(),this.Ra.forEach(r=>{this.Sa(r.key)&&(this.da=this.da.add(r.key))});const t=[];return e.forEach(r=>{this.da.has(r)||t.push(new _p(r))}),this.da.forEach(r=>{e.has(r)||t.push(new bp(r))}),t}ba(e){this.Ta=e.Ts,this.da=ie();const t=this.ma(e.documents);return this.applyChanges(t,!0)}Da(){return vi.fromInitialDocuments(this.query,this.Ra,this.mutatedKeys,this.Ea===0,this.hasCachedResults)}}class sE{constructor(e,t,r){this.query=e,this.targetId=t,this.view=r}}class oE{constructor(e){this.key=e,this.va=!1}}class aE{constructor(e,t,r,i,s,o){this.localStore=e,this.remoteStore=t,this.eventManager=r,this.sharedClientState=i,this.currentUser=s,this.maxConcurrentLimboResolutions=o,this.Ca={},this.Fa=new Ai(l=>Ff(l),Qo),this.Ma=new Map,this.xa=new Set,this.Oa=new Pe(Y.comparator),this.Na=new Map,this.La=new lc,this.Ba={},this.ka=new Map,this.qa=yi.kn(),this.onlineState="Unknown",this.Qa=void 0}get isPrimaryClient(){return this.Qa===!0}}async function lE(n,e,t=!0){const r=xp(n);let i;const s=r.Fa.get(e);return s?(r.sharedClientState.addLocalQueryTarget(s.targetId),i=s.view.Da()):i=await Ep(r,e,t,!0),i}async function cE(n,e){const t=xp(n);await Ep(t,e,!0,!1)}async function Ep(n,e,t,r){const i=await C_(n.localStore,on(e)),s=i.targetId,o=n.sharedClientState.addLocalQueryTarget(s,t);let l;return r&&(l=await uE(n,e,s,o==="current",i.resumeToken)),n.isPrimaryClient&&t&&dp(n.remoteStore,i),l}async function uE(n,e,t,r,i){n.Ka=(m,p,y)=>async function(S,x,k,C){let N=x.view.ma(k);N.ns&&(N=await Hd(S.localStore,x.query,!1).then(({documents:T})=>x.view.ma(T,N)));const B=C&&C.targetChanges.get(x.targetId),$=C&&C.targetMismatches.get(x.targetId)!=null,q=x.view.applyChanges(N,S.isPrimaryClient,B,$);return Xd(S,x.targetId,q.wa),q.snapshot}(n,m,p,y);const s=await Hd(n.localStore,e,!0),o=new iE(e,s.Ts),l=o.ma(s.documents),c=Ps.createSynthesizedTargetChangeForCurrentChange(t,r&&n.onlineState!=="Offline",i),u=o.applyChanges(l,n.isPrimaryClient,c);Xd(n,t,u.wa);const f=new sE(e,t,o);return n.Fa.set(e,f),n.Ma.has(t)?n.Ma.get(t).push(e):n.Ma.set(t,[e]),u.snapshot}async function dE(n,e,t){const r=J(n),i=r.Fa.get(e),s=r.Ma.get(i.targetId);if(s.length>1)return r.Ma.set(i.targetId,s.filter(o=>!Qo(o,e))),void r.Fa.delete(e);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(i.targetId),r.sharedClientState.isActiveQueryTarget(i.targetId)||await yl(r.localStore,i.targetId,!1).then(()=>{r.sharedClientState.clearQueryState(i.targetId),t&&dc(r.remoteStore,i.targetId),wl(r,i.targetId)}).catch(xs)):(wl(r,i.targetId),await yl(r.localStore,i.targetId,!0))}async function hE(n,e){const t=J(n),r=t.Fa.get(e),i=t.Ma.get(r.targetId);t.isPrimaryClient&&i.length===1&&(t.sharedClientState.removeLocalQueryTarget(r.targetId),dc(t.remoteStore,r.targetId))}async function fE(n,e,t){const r=bE(n);try{const i=await function(o,l){const c=J(o),u=$e.now(),f=l.reduce((y,I)=>y.add(I.key),ie());let m,p;return c.persistence.runTransaction("Locally write mutations","readwrite",y=>{let I=Bn(),S=ie();return c.cs.getEntries(y,f).next(x=>{I=x,I.forEach((k,C)=>{C.isValidDocument()||(S=S.add(k))})}).next(()=>c.localDocuments.getOverlayedDocuments(y,I)).next(x=>{m=x;const k=[];for(const C of l){const N=Nb(C,m.get(C.key).overlayedDocument);N!=null&&k.push(new yr(C.key,N,Mf(N.value.mapValue),mt.exists(!0)))}return c.mutationQueue.addMutationBatch(y,u,k,l)}).next(x=>{p=x;const k=x.applyToLocalDocumentSet(m,S);return c.documentOverlayCache.saveOverlays(y,x.batchId,k)})}).then(()=>({batchId:p.batchId,changes:Uf(m)}))}(r.localStore,e);r.sharedClientState.addPendingMutation(i.batchId),function(o,l,c){let u=o.Ba[o.currentUser.toKey()];u||(u=new Pe(he)),u=u.insert(l,c),o.Ba[o.currentUser.toKey()]=u}(r,i.batchId,t),await Ms(r,i.changes),await ia(r.remoteStore)}catch(i){const s=gc(i,"Failed to persist write");t.reject(s)}}async function Tp(n,e){const t=J(n);try{const r=await R_(t.localStore,e);e.targetChanges.forEach((i,s)=>{const o=t.Na.get(s);o&&(me(i.addedDocuments.size+i.modifiedDocuments.size+i.removedDocuments.size<=1),i.addedDocuments.size>0?o.va=!0:i.modifiedDocuments.size>0?me(o.va):i.removedDocuments.size>0&&(me(o.va),o.va=!1))}),await Ms(t,r,e)}catch(r){await xs(r)}}function Jd(n,e,t){const r=J(n);if(r.isPrimaryClient&&t===0||!r.isPrimaryClient&&t===1){const i=[];r.Fa.forEach((s,o)=>{const l=o.view.Z_(e);l.snapshot&&i.push(l.snapshot)}),function(o,l){const c=J(o);c.onlineState=l;let u=!1;c.queries.forEach((f,m)=>{for(const p of m.j_)p.Z_(l)&&(u=!0)}),u&&yc(c)}(r.eventManager,e),i.length&&r.Ca.d_(i),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function pE(n,e,t){const r=J(n);r.sharedClientState.updateQueryState(e,"rejected",t);const i=r.Na.get(e),s=i&&i.key;if(s){let o=new Pe(Y.comparator);o=o.insert(s,it.newNoDocument(s,Q.min()));const l=ie().add(s),c=new ta(Q.min(),new Map,new Pe(he),o,l);await Tp(r,c),r.Oa=r.Oa.remove(s),r.Na.delete(e),vc(r)}else await yl(r.localStore,e,!1).then(()=>wl(r,e,t)).catch(xs)}async function mE(n,e){const t=J(n),r=e.batch.batchId;try{const i=await x_(t.localStore,e);Sp(t,r,null),Ip(t,r),t.sharedClientState.updateMutationState(r,"acknowledged"),await Ms(t,i)}catch(i){await xs(i)}}async function gE(n,e,t){const r=J(n);try{const i=await function(o,l){const c=J(o);return c.persistence.runTransaction("Reject batch","readwrite-primary",u=>{let f;return c.mutationQueue.lookupMutationBatch(u,l).next(m=>(me(m!==null),f=m.keys(),c.mutationQueue.removeMutationBatch(u,m))).next(()=>c.mutationQueue.performConsistencyCheck(u)).next(()=>c.documentOverlayCache.removeOverlaysForBatchId(u,f,l)).next(()=>c.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(u,f)).next(()=>c.localDocuments.getDocuments(u,f))})}(r.localStore,e);Sp(r,e,t),Ip(r,e),r.sharedClientState.updateMutationState(e,"rejected",t),await Ms(r,i)}catch(i){await xs(i)}}function Ip(n,e){(n.ka.get(e)||[]).forEach(t=>{t.resolve()}),n.ka.delete(e)}function Sp(n,e,t){const r=J(n);let i=r.Ba[r.currentUser.toKey()];if(i){const s=i.get(e);s&&(t?s.reject(t):s.resolve(),i=i.remove(e)),r.Ba[r.currentUser.toKey()]=i}}function wl(n,e,t=null){n.sharedClientState.removeLocalQueryTarget(e);for(const r of n.Ma.get(e))n.Fa.delete(r),t&&n.Ca.$a(r,t);n.Ma.delete(e),n.isPrimaryClient&&n.La.gr(e).forEach(r=>{n.La.containsKey(r)||Ap(n,r)})}function Ap(n,e){n.xa.delete(e.path.canonicalString());const t=n.Oa.get(e);t!==null&&(dc(n.remoteStore,t),n.Oa=n.Oa.remove(e),n.Na.delete(t),vc(n))}function Xd(n,e,t){for(const r of t)r instanceof bp?(n.La.addReference(r.key,e),yE(n,r)):r instanceof _p?(z("SyncEngine","Document no longer in limbo: "+r.key),n.La.removeReference(r.key,e),n.La.containsKey(r.key)||Ap(n,r.key)):G()}function yE(n,e){const t=e.key,r=t.path.canonicalString();n.Oa.get(t)||n.xa.has(r)||(z("SyncEngine","New document in limbo: "+t),n.xa.add(r),vc(n))}function vc(n){for(;n.xa.size>0&&n.Oa.size<n.maxConcurrentLimboResolutions;){const e=n.xa.values().next().value;n.xa.delete(e);const t=new Y(xe.fromString(e)),r=n.qa.next();n.Na.set(r,new oE(t)),n.Oa=n.Oa.insert(t,r),dp(n.remoteStore,new sr(on(rc(t.path)),r,"TargetPurposeLimboResolution",Jl.oe))}}async function Ms(n,e,t){const r=J(n),i=[],s=[],o=[];r.Fa.isEmpty()||(r.Fa.forEach((l,c)=>{o.push(r.Ka(c,e,t).then(u=>{var f;if((u||t)&&r.isPrimaryClient){const m=u?!u.fromCache:(f=t==null?void 0:t.targetChanges.get(c.targetId))===null||f===void 0?void 0:f.current;r.sharedClientState.updateQueryState(c.targetId,m?"current":"not-current")}if(u){i.push(u);const m=uc.Wi(c.targetId,u);s.push(m)}}))}),await Promise.all(o),r.Ca.d_(i),await async function(c,u){const f=J(c);try{await f.persistence.runTransaction("notifyLocalViewChanges","readwrite",m=>L.forEach(u,p=>L.forEach(p.$i,y=>f.persistence.referenceDelegate.addReference(m,p.targetId,y)).next(()=>L.forEach(p.Ui,y=>f.persistence.referenceDelegate.removeReference(m,p.targetId,y)))))}catch(m){if(!Rs(m))throw m;z("LocalStore","Failed to update sequence numbers: "+m)}for(const m of u){const p=m.targetId;if(!m.fromCache){const y=f.os.get(p),I=y.snapshotVersion,S=y.withLastLimboFreeSnapshotVersion(I);f.os=f.os.insert(p,S)}}}(r.localStore,s))}async function vE(n,e){const t=J(n);if(!t.currentUser.isEqual(e)){z("SyncEngine","User change. New user:",e.toKey());const r=await ap(t.localStore,e);t.currentUser=e,function(s,o){s.ka.forEach(l=>{l.forEach(c=>{c.reject(new U(M.CANCELLED,o))})}),s.ka.clear()}(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await Ms(t,r.hs)}}function wE(n,e){const t=J(n),r=t.Na.get(e);if(r&&r.va)return ie().add(r.key);{let i=ie();const s=t.Ma.get(e);if(!s)return i;for(const o of s){const l=t.Fa.get(o);i=i.unionWith(l.view.Va)}return i}}function xp(n){const e=J(n);return e.remoteStore.remoteSyncer.applyRemoteEvent=Tp.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=wE.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=pE.bind(null,e),e.Ca.d_=nE.bind(null,e.eventManager),e.Ca.$a=rE.bind(null,e.eventManager),e}function bE(n){const e=J(n);return e.remoteStore.remoteSyncer.applySuccessfulWrite=mE.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=gE.bind(null,e),e}class Do{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=na(e.databaseInfo.databaseId),this.sharedClientState=this.Wa(e),this.persistence=this.Ga(e),await this.persistence.start(),this.localStore=this.za(e),this.gcScheduler=this.ja(e,this.localStore),this.indexBackfillerScheduler=this.Ha(e,this.localStore)}ja(e,t){return null}Ha(e,t){return null}za(e){return A_(this.persistence,new I_,e.initialUser,this.serializer)}Ga(e){return new __(cc.Zr,this.serializer)}Wa(e){return new D_}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Do.provider={build:()=>new Do};class bl{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>Jd(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=vE.bind(null,this.syncEngine),await Z_(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new tE}()}createDatastore(e){const t=na(e.databaseInfo.databaseId),r=function(s){return new O_(s)}(e.databaseInfo);return function(s,o,l,c){return new $_(s,o,l,c)}(e.authCredentials,e.appCheckCredentials,r,t)}createRemoteStore(e){return function(r,i,s,o,l){return new U_(r,i,s,o,l)}(this.localStore,this.datastore,e.asyncQueue,t=>Jd(this.syncEngine,t,0),function(){return jd.D()?new jd:new L_}())}createSyncEngine(e,t){return function(i,s,o,l,c,u,f){const m=new aE(i,s,o,l,c,u);return f&&(m.Qa=!0),m}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await async function(i){const s=J(i);z("RemoteStore","RemoteStore shutting down."),s.L_.add(5),await Cs(s),s.k_.shutdown(),s.q_.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}}bl.provider={build:()=>new bl};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class Rp{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ya(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ya(this.observer.error,e):Nn("Uncaught Error in snapshot listener:",e.toString()))}Za(){this.muted=!0}Ya(e,t){setTimeout(()=>{this.muted||e(t)},0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _E{constructor(e,t,r,i,s){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=r,this.databaseInfo=i,this.user=rt.UNAUTHENTICATED,this.clientId=kf.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=s,this.authCredentials.start(r,async o=>{z("FirestoreClient","Received user=",o.uid),await this.authCredentialListener(o),this.user=o}),this.appCheckCredentials.start(r,o=>(z("FirestoreClient","Received new app check token=",o),this.appCheckCredentialListener(o,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new Pn;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const r=gc(t,"Failed to shutdown persistence");e.reject(r)}}),e.promise}}async function ja(n,e){n.asyncQueue.verifyOperationInProgress(),z("FirestoreClient","Initializing OfflineComponentProvider");const t=n.configuration;await e.initialize(t);let r=t.initialUser;n.setCredentialChangeListener(async i=>{r.isEqual(i)||(await ap(e.localStore,i),r=i)}),e.persistence.setDatabaseDeletedListener(()=>n.terminate()),n._offlineComponents=e}async function Zd(n,e){n.asyncQueue.verifyOperationInProgress();const t=await EE(n);z("FirestoreClient","Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener(r=>Wd(e.remoteStore,r)),n.setAppCheckTokenChangeListener((r,i)=>Wd(e.remoteStore,i)),n._onlineComponents=e}async function EE(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){z("FirestoreClient","Using user provided OfflineComponentProvider");try{await ja(n,n._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!function(i){return i.name==="FirebaseError"?i.code===M.FAILED_PRECONDITION||i.code===M.UNIMPLEMENTED:!(typeof DOMException<"u"&&i instanceof DOMException)||i.code===22||i.code===20||i.code===11}(t))throw t;fi("Error using user provided cache. Falling back to memory cache: "+t),await ja(n,new Do)}}else z("FirestoreClient","Using default OfflineComponentProvider"),await ja(n,new Do);return n._offlineComponents}async function kp(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(z("FirestoreClient","Using user provided OnlineComponentProvider"),await Zd(n,n._uninitializedComponentsProvider._online)):(z("FirestoreClient","Using default OnlineComponentProvider"),await Zd(n,new bl))),n._onlineComponents}function TE(n){return kp(n).then(e=>e.syncEngine)}async function Pp(n){const e=await kp(n),t=e.eventManager;return t.onListen=lE.bind(null,e.syncEngine),t.onUnlisten=dE.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=cE.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=hE.bind(null,e.syncEngine),t}function IE(n,e,t={}){const r=new Pn;return n.asyncQueue.enqueueAndForget(async()=>function(s,o,l,c,u){const f=new Rp({next:p=>{f.Za(),o.enqueueAndForget(()=>vp(s,m));const y=p.docs.has(l);!y&&p.fromCache?u.reject(new U(M.UNAVAILABLE,"Failed to get document because the client is offline.")):y&&p.fromCache&&c&&c.source==="server"?u.reject(new U(M.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):u.resolve(p)},error:p=>u.reject(p)}),m=new wp(rc(l.path),f,{includeMetadataChanges:!0,_a:!0});return yp(s,m)}(await Pp(n),n.asyncQueue,e,t,r)),r.promise}function SE(n,e,t={}){const r=new Pn;return n.asyncQueue.enqueueAndForget(async()=>function(s,o,l,c,u){const f=new Rp({next:p=>{f.Za(),o.enqueueAndForget(()=>vp(s,m)),p.fromCache&&c.source==="server"?u.reject(new U(M.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):u.resolve(p)},error:p=>u.reject(p)}),m=new wp(l,f,{includeMetadataChanges:!0,_a:!0});return yp(s,m)}(await Pp(n),n.asyncQueue,e,t,r)),r.promise}/**
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
 */function Cp(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const eh=new Map;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mp(n,e,t){if(!t)throw new U(M.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function AE(n,e,t,r){if(e===!0&&r===!0)throw new U(M.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function th(n){if(!Y.isDocumentKey(n))throw new U(M.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function nh(n){if(Y.isDocumentKey(n))throw new U(M.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function wc(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=function(r){return r.constructor?r.constructor.name:null}(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":G()}function Ot(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new U(M.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=wc(n);throw new U(M.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rh{constructor(e){var t,r;if(e.host===void 0){if(e.ssl!==void 0)throw new U(M.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(t=e.ssl)===null||t===void 0||t;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new U(M.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}AE("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Cp((r=e.experimentalLongPollingOptions)!==null&&r!==void 0?r:{}),function(s){if(s.timeoutSeconds!==void 0){if(isNaN(s.timeoutSeconds))throw new U(M.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (must not be NaN)`);if(s.timeoutSeconds<5)throw new U(M.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (minimum allowed value is 5)`);if(s.timeoutSeconds>30)throw new U(M.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(r,i){return r.timeoutSeconds===i.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class sa{constructor(e,t,r,i){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=r,this._app=i,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new rh({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new U(M.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new U(M.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new rh(e),e.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new qw;switch(r.type){case"firstParty":return new Ww(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new U(M.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(t){const r=eh.get(t);r&&(z("ComponentProvider","Removing Datastore"),eh.delete(t),r.terminate())}(this),Promise.resolve()}}function xE(n,e,t,r={}){var i;const s=(n=Ot(n,sa))._getSettings(),o=`${e}:${t}`;if(s.host!=="firestore.googleapis.com"&&s.host!==o&&fi("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),n._setSettings(Object.assign(Object.assign({},s),{host:o,ssl:!1})),r.mockUserToken){let l,c;if(typeof r.mockUserToken=="string")l=r.mockUserToken,c=rt.MOCK_USER;else{l=Jg(r.mockUserToken,(i=n._app)===null||i===void 0?void 0:i.options.projectId);const u=r.mockUserToken.sub||r.mockUserToken.user_id;if(!u)throw new U(M.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");c=new rt(u)}n._authCredentials=new Hw(new Rf(l,c))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oa{constructor(e,t,r){this.converter=t,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new oa(this.firestore,e,this._query)}}class _t{constructor(e,t,r){this.converter=t,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new dr(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new _t(this.firestore,e,this._key)}}class dr extends oa{constructor(e,t,r){super(e,t,rc(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new _t(this.firestore,null,new Y(e))}withConverter(e){return new dr(this.firestore,e,this._path)}}function RE(n,e,...t){if(n=De(n),Mp("collection","path",e),n instanceof sa){const r=xe.fromString(e,...t);return nh(r),new dr(n,null,r)}{if(!(n instanceof _t||n instanceof dr))throw new U(M.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(xe.fromString(e,...t));return nh(r),new dr(n.firestore,null,r)}}function wi(n,e,...t){if(n=De(n),arguments.length===1&&(e=kf.newId()),Mp("doc","path",e),n instanceof sa){const r=xe.fromString(e,...t);return th(r),new _t(n,null,new Y(r))}{if(!(n instanceof _t||n instanceof dr))throw new U(M.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(xe.fromString(e,...t));return th(r),new _t(n.firestore,n instanceof dr?n.converter:null,new Y(r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ih{constructor(e=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new cp(this,"async_queue_retry"),this.Vu=()=>{const r=Ya();r&&z("AsyncQueue","Visibility state changed to "+r.visibilityState),this.t_.jo()},this.mu=e;const t=Ya();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.fu(),this.gu(e)}enterRestrictedMode(e){if(!this.Iu){this.Iu=!0,this.Au=e||!1;const t=Ya();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.Vu)}}enqueue(e){if(this.fu(),this.Iu)return new Promise(()=>{});const t=new Pn;return this.gu(()=>this.Iu&&this.Au?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Pu.push(e),this.pu()))}async pu(){if(this.Pu.length!==0){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(e){if(!Rs(e))throw e;z("AsyncQueue","Operation failed with retryable error: "+e)}this.Pu.length>0&&this.t_.Go(()=>this.pu())}}gu(e){const t=this.mu.then(()=>(this.du=!0,e().catch(r=>{this.Eu=r,this.du=!1;const i=function(o){let l=o.message||"";return o.stack&&(l=o.stack.includes(o.message)?o.stack:o.message+`
`+o.stack),l}(r);throw Nn("INTERNAL UNHANDLED ERROR: ",i),r}).then(r=>(this.du=!1,r))));return this.mu=t,t}enqueueAfterDelay(e,t,r){this.fu(),this.Ru.indexOf(e)>-1&&(t=0);const i=mc.createAndSchedule(this,e,t,r,s=>this.yu(s));return this.Tu.push(i),i}fu(){this.Eu&&G()}verifyOperationInProgress(){}async wu(){let e;do e=this.mu,await e;while(e!==this.mu)}Su(e){for(const t of this.Tu)if(t.timerId===e)return!0;return!1}bu(e){return this.wu().then(()=>{this.Tu.sort((t,r)=>t.targetTimeMs-r.targetTimeMs);for(const t of this.Tu)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.wu()})}Du(e){this.Ru.push(e)}yu(e){const t=this.Tu.indexOf(e);this.Tu.splice(t,1)}}class vr extends sa{constructor(e,t,r,i){super(e,t,r,i),this.type="firestore",this._queue=new ih,this._persistenceKey=(i==null?void 0:i.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new ih(e),this._firestoreClient=void 0,await e}}}function kE(n,e){const t=typeof n=="object"?n:Oh(),r=typeof n=="string"?n:"(default)",i=Vl(t,"firestore").getImmediate({identifier:r});if(!i._initialized){const s=Kg("firestore");s&&xE(i,...s)}return i}function aa(n){if(n._terminated)throw new U(M.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||PE(n),n._firestoreClient}function PE(n){var e,t,r;const i=n._freezeSettings(),s=function(l,c,u,f){return new ob(l,c,u,f.host,f.ssl,f.experimentalForceLongPolling,f.experimentalAutoDetectLongPolling,Cp(f.experimentalLongPollingOptions),f.useFetchStreams)}(n._databaseId,((e=n._app)===null||e===void 0?void 0:e.options.appId)||"",n._persistenceKey,i);n._componentsProvider||!((t=i.localCache)===null||t===void 0)&&t._offlineComponentProvider&&(!((r=i.localCache)===null||r===void 0)&&r._onlineComponentProvider)&&(n._componentsProvider={_offline:i.localCache._offlineComponentProvider,_online:i.localCache._onlineComponentProvider}),n._firestoreClient=new _E(n._authCredentials,n._appCheckCredentials,n._queue,s,n._componentsProvider&&function(l){const c=l==null?void 0:l._online.build();return{_offline:l==null?void 0:l._offline.build(c),_online:c}}(n._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bi{constructor(e){this._byteString=e}static fromBase64String(e){try{return new bi(Qe.fromBase64String(e))}catch(t){throw new U(M.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new bi(Qe.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ds{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new U(M.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new We(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bc{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _c{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new U(M.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new U(M.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return he(this._lat,e._lat)||he(this._long,e._long)}}/**
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
 */class Ec{constructor(e){this._values=(e||[]).map(t=>t)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(r,i){if(r.length!==i.length)return!1;for(let s=0;s<r.length;++s)if(r[s]!==i[s])return!1;return!0}(this._values,e._values)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const CE=/^__.*__$/;class ME{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return this.fieldMask!==null?new yr(e,this.data,this.fieldMask,t,this.fieldTransforms):new ks(e,this.data,t,this.fieldTransforms)}}class Dp{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return new yr(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function Lp(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw G()}}class Tc{constructor(e,t,r,i,s,o){this.settings=e,this.databaseId=t,this.serializer=r,this.ignoreUndefinedProperties=i,s===void 0&&this.vu(),this.fieldTransforms=s||[],this.fieldMask=o||[]}get path(){return this.settings.path}get Cu(){return this.settings.Cu}Fu(e){return new Tc(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Mu(e){var t;const r=(t=this.path)===null||t===void 0?void 0:t.child(e),i=this.Fu({path:r,xu:!1});return i.Ou(e),i}Nu(e){var t;const r=(t=this.path)===null||t===void 0?void 0:t.child(e),i=this.Fu({path:r,xu:!1});return i.vu(),i}Lu(e){return this.Fu({path:void 0,xu:!0})}Bu(e){return Lo(e,this.settings.methodName,this.settings.ku||!1,this.path,this.settings.qu)}contains(e){return this.fieldMask.find(t=>e.isPrefixOf(t))!==void 0||this.fieldTransforms.find(t=>e.isPrefixOf(t.field))!==void 0}vu(){if(this.path)for(let e=0;e<this.path.length;e++)this.Ou(this.path.get(e))}Ou(e){if(e.length===0)throw this.Bu("Document fields must not be empty");if(Lp(this.Cu)&&CE.test(e))throw this.Bu('Document fields cannot begin and end with "__"')}}class DE{constructor(e,t,r){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=r||na(e)}Qu(e,t,r,i=!1){return new Tc({Cu:e,methodName:t,qu:r,path:We.emptyPath(),xu:!1,ku:i},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function la(n){const e=n._freezeSettings(),t=na(n._databaseId);return new DE(n._databaseId,!!e.ignoreUndefinedProperties,t)}function Ic(n,e,t,r,i,s={}){const o=n.Qu(s.merge||s.mergeFields?2:0,e,t,i);Sc("Data must be an object, but it was:",o,r);const l=Op(r,o);let c,u;if(s.merge)c=new xt(o.fieldMask),u=o.fieldTransforms;else if(s.mergeFields){const f=[];for(const m of s.mergeFields){const p=_l(e,m,t);if(!o.contains(p))throw new U(M.INVALID_ARGUMENT,`Field '${p}' is specified in your field mask but missing from your input data.`);Fp(f,p)||f.push(p)}c=new xt(f),u=o.fieldTransforms.filter(m=>c.covers(m.field))}else c=null,u=o.fieldTransforms;return new ME(new wt(l),c,u)}class ca extends bc{_toFieldTransform(e){if(e.Cu!==2)throw e.Cu===1?e.Bu(`${this._methodName}() can only appear at the top level of your update data`):e.Bu(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof ca}}function Np(n,e,t,r){const i=n.Qu(1,e,t);Sc("Data must be an object, but it was:",i,r);const s=[],o=wt.empty();Yr(r,(c,u)=>{const f=Ac(e,c,t);u=De(u);const m=i.Nu(f);if(u instanceof ca)s.push(f);else{const p=ua(u,m);p!=null&&(s.push(f),o.set(f,p))}});const l=new xt(s);return new Dp(o,l,i.fieldTransforms)}function Bp(n,e,t,r,i,s){const o=n.Qu(1,e,t),l=[_l(e,r,t)],c=[i];if(s.length%2!=0)throw new U(M.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let p=0;p<s.length;p+=2)l.push(_l(e,s[p])),c.push(s[p+1]);const u=[],f=wt.empty();for(let p=l.length-1;p>=0;--p)if(!Fp(u,l[p])){const y=l[p];let I=c[p];I=De(I);const S=o.Nu(y);if(I instanceof ca)u.push(y);else{const x=ua(I,S);x!=null&&(u.push(y),f.set(y,x))}}const m=new xt(u);return new Dp(f,m,o.fieldTransforms)}function ua(n,e){if(Vp(n=De(n)))return Sc("Unsupported field value:",e,n),Op(n,e);if(n instanceof bc)return function(r,i){if(!Lp(i.Cu))throw i.Bu(`${r._methodName}() can only be used with update() and set()`);if(!i.path)throw i.Bu(`${r._methodName}() is not currently supported inside arrays`);const s=r._toFieldTransform(i);s&&i.fieldTransforms.push(s)}(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.xu&&e.Cu!==4)throw e.Bu("Nested arrays are not supported");return function(r,i){const s=[];let o=0;for(const l of r){let c=ua(l,i.Lu(o));c==null&&(c={nullValue:"NULL_VALUE"}),s.push(c),o++}return{arrayValue:{values:s}}}(n,e)}return function(r,i){if((r=De(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return kb(i.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const s=$e.fromDate(r);return{timestampValue:Co(i.serializer,s)}}if(r instanceof $e){const s=new $e(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:Co(i.serializer,s)}}if(r instanceof _c)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof bi)return{bytesValue:ep(i.serializer,r._byteString)};if(r instanceof _t){const s=i.databaseId,o=r.firestore._databaseId;if(!o.isEqual(s))throw i.Bu(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${s.projectId}/${s.database}`);return{referenceValue:ac(r.firestore._databaseId||i.databaseId,r._key.path)}}if(r instanceof Ec)return function(o,l){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:o.toArray().map(c=>{if(typeof c!="number")throw l.Bu("VectorValues must only contain numeric values.");return ic(l.serializer,c)})}}}}}}(r,i);throw i.Bu(`Unsupported field value: ${wc(r)}`)}(n,e)}function Op(n,e){const t={};return Pf(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Yr(n,(r,i)=>{const s=ua(i,e.Mu(r));s!=null&&(t[r]=s)}),{mapValue:{fields:t}}}function Vp(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof $e||n instanceof _c||n instanceof bi||n instanceof _t||n instanceof bc||n instanceof Ec)}function Sc(n,e,t){if(!Vp(t)||!function(i){return typeof i=="object"&&i!==null&&(Object.getPrototypeOf(i)===Object.prototype||Object.getPrototypeOf(i)===null)}(t)){const r=wc(t);throw r==="an object"?e.Bu(n+" a custom object"):e.Bu(n+" "+r)}}function _l(n,e,t){if((e=De(e))instanceof Ds)return e._internalPath;if(typeof e=="string")return Ac(n,e);throw Lo("Field path arguments must be of type string or ",n,!1,void 0,t)}const LE=new RegExp("[~\\*/\\[\\]]");function Ac(n,e,t){if(e.search(LE)>=0)throw Lo(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new Ds(...e.split("."))._internalPath}catch{throw Lo(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function Lo(n,e,t,r,i){const s=r&&!r.isEmpty(),o=i!==void 0;let l=`Function ${e}() called with invalid data`;t&&(l+=" (via `toFirestore()`)"),l+=". ";let c="";return(s||o)&&(c+=" (found",s&&(c+=` in field ${r}`),o&&(c+=` in document ${i}`),c+=")"),new U(M.INVALID_ARGUMENT,l+n+c)}function Fp(n,e){return n.some(t=>t.isEqual(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $p{constructor(e,t,r,i,s){this._firestore=e,this._userDataWriter=t,this._key=r,this._document=i,this._converter=s}get id(){return this._key.path.lastSegment()}get ref(){return new _t(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new NE(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(zp("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class NE extends $p{data(){return super.data()}}function zp(n,e){return typeof e=="string"?Ac(n,e):e instanceof Ds?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function BE(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new U(M.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class OE{convertValue(e,t="none"){switch(Ur(e)){case 0:return null;case 1:return e.booleanValue;case 2:return Le(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(zr(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw G()}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const r={};return Yr(e,(i,s)=>{r[i]=this.convertValue(s,t)}),r}convertVectorValue(e){var t,r,i;const s=(i=(r=(t=e.fields)===null||t===void 0?void 0:t.value.arrayValue)===null||r===void 0?void 0:r.values)===null||i===void 0?void 0:i.map(o=>Le(o.doubleValue));return new Ec(s)}convertGeoPoint(e){return new _c(Le(e.latitude),Le(e.longitude))}convertArray(e,t){return(e.values||[]).map(r=>this.convertValue(r,t))}convertServerTimestamp(e,t){switch(t){case"previous":const r=Zl(e);return r==null?null:this.convertValue(r,t);case"estimate":return this.convertTimestamp(cs(e));default:return null}}convertTimestamp(e){const t=pr(e);return new $e(t.seconds,t.nanos)}convertDocumentKey(e,t){const r=xe.fromString(e);me(op(r));const i=new us(r.get(1),r.get(3)),s=new Y(r.popFirst(5));return i.isEqual(t)||Nn(`Document ${s} contains a document reference within a different database (${i.projectId}/${i.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xc(n,e,t){let r;return r=n?t&&(t.merge||t.mergeFields)?n.toFirestore(e,t):n.toFirestore(e):e,r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ki{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class Up extends $p{constructor(e,t,r,i,s,o){super(e,t,r,i,o),this._firestore=e,this._firestoreImpl=e,this.metadata=s}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new fo(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const r=this._document.data.field(zp("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,t.serverTimestamps)}}}class fo extends Up{data(e={}){return super.data(e)}}class VE{constructor(e,t,r,i){this._firestore=e,this._userDataWriter=t,this._snapshot=i,this.metadata=new Ki(i.hasPendingWrites,i.fromCache),this.query=r}get docs(){const e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach(r=>{e.call(t,new fo(this._firestore,this._userDataWriter,r.key,r,new Ki(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new U(M.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(i,s){if(i._snapshot.oldDocs.isEmpty()){let o=0;return i._snapshot.docChanges.map(l=>{const c=new fo(i._firestore,i._userDataWriter,l.doc.key,l.doc,new Ki(i._snapshot.mutatedKeys.has(l.doc.key),i._snapshot.fromCache),i.query.converter);return l.doc,{type:"added",doc:c,oldIndex:-1,newIndex:o++}})}{let o=i._snapshot.oldDocs;return i._snapshot.docChanges.filter(l=>s||l.type!==3).map(l=>{const c=new fo(i._firestore,i._userDataWriter,l.doc.key,l.doc,new Ki(i._snapshot.mutatedKeys.has(l.doc.key),i._snapshot.fromCache),i.query.converter);let u=-1,f=-1;return l.type!==0&&(u=o.indexOf(l.doc.key),o=o.delete(l.doc.key)),l.type!==1&&(o=o.add(l.doc),f=o.indexOf(l.doc.key)),{type:FE(l.type),doc:c,oldIndex:u,newIndex:f}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}}function FE(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return G()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $E(n){n=Ot(n,_t);const e=Ot(n.firestore,vr);return IE(aa(e),n._key).then(t=>jE(e,n,t))}class qp extends OE{constructor(e){super(),this.firestore=e}convertBytes(e){return new bi(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new _t(this.firestore,null,t)}}function zE(n){n=Ot(n,oa);const e=Ot(n.firestore,vr),t=aa(e),r=new qp(e);return BE(n._query),SE(t,n._query).then(i=>new VE(e,r,n,i))}function UE(n,e,t){n=Ot(n,_t);const r=Ot(n.firestore,vr),i=xc(n.converter,e,t);return Ls(r,[Ic(la(r),"setDoc",n._key,i,n.converter!==null,t).toMutation(n._key,mt.none())])}function qE(n,e,t,...r){n=Ot(n,_t);const i=Ot(n.firestore,vr),s=la(i);let o;return o=typeof(e=De(e))=="string"||e instanceof Ds?Bp(s,"updateDoc",n._key,e,t,r):Np(s,"updateDoc",n._key,e),Ls(i,[o.toMutation(n._key,mt.exists(!0))])}function HE(n){return Ls(Ot(n.firestore,vr),[new ea(n._key,mt.none())])}function YE(n,e){const t=Ot(n.firestore,vr),r=wi(n),i=xc(n.converter,e);return Ls(t,[Ic(la(n.firestore),"addDoc",r._key,i,n.converter!==null,{}).toMutation(r._key,mt.exists(!1))]).then(()=>r)}function Ls(n,e){return function(r,i){const s=new Pn;return r.asyncQueue.enqueueAndForget(async()=>fE(await TE(r),i,s)),s.promise}(aa(n),e)}function jE(n,e,t){const r=t.docs.get(e._key),i=new qp(n);return new Up(n,i,e._key,r,new Ki(t.hasPendingWrites,t.fromCache),e.converter)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class WE{constructor(e,t){this._firestore=e,this._commitHandler=t,this._mutations=[],this._committed=!1,this._dataReader=la(e)}set(e,t,r){this._verifyNotCommitted();const i=Wa(e,this._firestore),s=xc(i.converter,t,r),o=Ic(this._dataReader,"WriteBatch.set",i._key,s,i.converter!==null,r);return this._mutations.push(o.toMutation(i._key,mt.none())),this}update(e,t,r,...i){this._verifyNotCommitted();const s=Wa(e,this._firestore);let o;return o=typeof(t=De(t))=="string"||t instanceof Ds?Bp(this._dataReader,"WriteBatch.update",s._key,t,r,i):Np(this._dataReader,"WriteBatch.update",s._key,t),this._mutations.push(o.toMutation(s._key,mt.exists(!0))),this}delete(e){this._verifyNotCommitted();const t=Wa(e,this._firestore);return this._mutations=this._mutations.concat(new ea(t._key,mt.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new U(M.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function Wa(n,e){if((n=De(n)).firestore!==e)throw new U(M.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hp(n){return aa(n=Ot(n,vr)),new WE(n,e=>Ls(n,e))}(function(e,t=!0){(function(i){Si=i})(Ti),di(new Or("firestore",(r,{instanceIdentifier:i,options:s})=>{const o=r.getProvider("app").getImmediate(),l=new vr(new Yw(r.getProvider("auth-internal")),new Kw(r.getProvider("app-check-internal")),function(u,f){if(!Object.prototype.hasOwnProperty.apply(u.options,["projectId"]))throw new U(M.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new us(u.options.projectId,f)}(o,i),o);return s=Object.assign({useFetchStreams:t},s),l._setSettings(s),l},"PUBLIC").setMultipleInstances(!0)),ur(Td,"4.7.3",e),ur(Td,"4.7.3","esm2017")})();const Yp={apiKey:"AIzaSyBdbve0H70D-Ch69WlaxEly7PVBFVRB5p0",authDomain:"pensiontools-4b237.firebaseapp.com",projectId:"pensiontools-4b237",storageBucket:"pensiontools-4b237.firebasestorage.app",messagingSenderId:"760877353696",appId:"1:760877353696:web:2d6f7173c8d7fab6fd9e85"};function Ne(){return Yp.apiKey!=="YOUR_API_KEY"}let Ga=null,at=null,bt=null;try{Ne()?(Ga=Bh(Yp),at=zw(Ga),bt=kE(Ga)):console.warn("Firebase not configured. Login required to save data.")}catch(n){console.error("Firebase initialization error:",n)}const GE=new Tn;let st=null,ns=[];function KE(){if(!Ne()||!at){console.warn("Firebase not configured - auth disabled");return}Rv(at,n=>{console.log("onAuthStateChanged fired:",n?n.email:"null"),st=n,console.log("Notifying",ns.length,"listeners"),ns.forEach(e=>e(n))})}function QE(n){return console.log("onAuthStateChange: adding listener, currentUser is:",st&&st.email),ns.push(n),st&&(console.log("onAuthStateChange: immediately calling listener with user"),n(st)),()=>{ns=ns.filter(e=>e!==n)}}function Wr(){return st}function gt(){return st!==null}async function JE(n,e,t=null){if(!Ne()||!at)throw new Error("Firebase not configured");const r=await Ev(at,n,e);t&&r.user&&await Sv(r.user,{displayName:t});try{await uf(r.user)}catch(i){console.error("Failed to send verification email:",i)}return r}async function XE(){if(!Ne()||!at||!st)throw new Error("Not logged in");return uf(st)}async function ZE(){return st?(await st.reload(),st=at.currentUser,st):null}async function eT(n,e){if(!Ne()||!at)throw new Error("Firebase not configured");return Tv(at,n,e)}async function tT(){if(!Ne()||!at)throw new Error("Firebase not configured");console.log("Initiating Google sign-in popup...");try{const n=await Qv(at,GE);return console.log("Google sign-in successful:",n.user.email),n}catch(n){throw console.error("signInWithPopup error:",n.code,n.message),n}}async function Rc(){if(!Ne()||!at)throw new Error("Firebase not configured");return kv(at)}async function nT(n){if(!Ne()||!at)throw new Error("Firebase not configured");return _v(at,n)}async function rT(){if(!Ne()||!at||!st)throw new Error("Not logged in");return Pv(st)}KE();function Zr(...n){return n.find(e=>e!==void 0)}function iT(n){if(!n||typeof n!="object")return{scenario:n,migrated:!1};const e=Object.keys(n).filter(c=>c.includes(".")),t="decisionSettings"in n||"stressSettings"in n||"name"in n||"description"in n||"taxYears"in n;if(!(e.length>0||t))return{scenario:n,migrated:!1};const i=n.decisionTool||{},s=n.stressTool||{},o=n.planDetails||{},l={isActive:n.isActive??!1,enabledTools:n.enabledTools||["stress","decision"],planDetails:{name:Zr(n["planDetails.name"],o.name,n.name)??"My Plan",description:Zr(n["planDetails.description"],o.description,n.description)??""},decisionTool:{settings:Zr(n["decisionTool.settings"],i.settings,n.decisionSettings)??{},history:Zr(n["decisionTool.history"],i.history)??[],taxYears:Zr(n["decisionTool.taxYears"],i.taxYears,n.taxYears)??{}},stressTool:{settings:Zr(n["stressTool.settings"],s.settings,n.stressSettings)??{}}};return n.id!==void 0&&(l.id=n.id),n.createdAt!==void 0&&(l.createdAt=n.createdAt),n.lastModified!==void 0&&(l.lastModified=n.lastModified),{scenario:l,migrated:!0}}function kc(n,e="settings"){const t=Wr();return!t||!bt?null:wi(bt,"users",t.uid,n,e)}function jp(n){const e=Wr();return!e||!bt?null:RE(bt,"users",e.uid,n)}async function Wp(n){const{scenario:e,migrated:t}=iT(n);if(t){const r=Wr();if(r&&bt)try{const{id:i,...s}=e;await UE(wi(bt,"users",r.uid,"scenarios",i),s)}catch(i){console.error("Scenario migration write failed:",i)}}return e}async function da(){if(!Ne())return[];const n=jp("scenarios");if(!n)return[];try{const e=await zE(n),t=[];return e.forEach(r=>{t.push({id:r.id,...r.data()})}),Promise.all(t.map(r=>Wp(r)))}catch(e){return console.error("Error loading scenarios:",e),[]}}async function sT(n){if(!Ne())return null;const e=kc("scenarios",n);if(!e)return null;try{const t=await $E(e);return t.exists()?Wp({id:t.id,...t.data()}):null}catch(t){return console.error("Error loading scenario:",t),null}}async function wr(n,e){if(!Ne())return;const t=kc("scenarios",n);if(t)try{await qE(t,{...e,lastModified:new Date().toISOString()})}catch(r){throw console.error("Error saving scenario:",r),r}}async function Gp(n){if(!Ne())return null;const e=jp("scenarios");if(!e)return null;try{return(await YE(e,{...n,createdAt:new Date().toISOString(),lastModified:new Date().toISOString()})).id}catch(t){throw console.error("Error creating scenario:",t),t}}async function oT(n){if(!Ne())return;const e=kc("scenarios",n);if(e)try{await HE(e)}catch(t){throw console.error("Error deleting scenario:",t),t}}async function Pc(n){if(!Ne())return;const e=Wr();if(!(!e||!bt))try{const t=await da(),r=Hp(bt);for(const i of t){const s=wi(bt,"users",e.uid,"scenarios",i.id);i.id===n?r.update(s,{isActive:!0}):i.isActive&&r.update(s,{isActive:!1})}await r.commit()}catch(t){throw console.error("Error setting active scenario:",t),t}}async function Kp(){if(!Ne())return;const n=Wr();if(!(!n||!bt))try{const e=await da(),t=Hp(bt);for(const r of e)t.delete(wi(bt,"users",n.uid,"scenarios",r.id));t.delete(wi(bt,"users",n.uid,"profile","settings")),await t.commit(),console.log("All user data wiped successfully")}catch(e){throw console.error("Error wiping user data:",e),e}}async function aT(){return Ne()?(await da()).length>0:!1}const lT={single:{minimum:14400,moderate:31300,comfortable:43100}},El={essential:[{label:"Rent / mortgage",period:"mo",hint:"Your regular housing payment"},{label:"Council tax",period:"mo",hint:""},{label:"Gas",period:"mo",hint:""},{label:"Electricity",period:"mo",hint:""},{label:"Water",period:"mo",hint:""},{label:"Broadband",period:"mo",hint:"Broadband tariff"},{label:"Mobile phones",period:"mo",hint:"Mobile phone tariffs"},{label:"TV licence",period:"yr",hint:""},{label:"Groceries & household",period:"mo",hint:"Food and everyday household items"},{label:"Home insurance",period:"yr",hint:"Buildings & contents"},{label:"Car insurance",period:"yr",hint:""},{label:"Car tax",period:"yr",hint:"DVLA vehicle tax"},{label:"Petrol / fuel",period:"mo",hint:""},{label:"Car servicing & maintenance",period:"yr",hint:"Servicing, MOT, repairs — a big replacement is a One-off cost"},{label:"Boiler service",period:"yr",hint:""},{label:"Personal health",period:"mo",hint:"Prescriptions, dental, optical, health cover"},{label:"Kids / dependents",period:"mo",hint:"Supporting children or other dependents"},{label:"Premier banking / account fees",period:"mo",hint:"Packaged or premier account fees"},{label:"Home upkeep",period:"mo",hint:"Routine maintenance & small repairs — big jobs go in One-off costs"}],discretionary:[{label:"Main holiday",period:"yr",hint:"Your big annual holiday"},{label:"UK breaks",period:"yr",hint:"Weekends & short breaks"},{label:"Day trips",period:"mo",hint:""},{label:"Eating out & takeaways",period:"mo",hint:""},{label:"Streaming & entertainment",period:"mo",hint:"Netflix, Amazon Prime, etc."},{label:"Digital subscriptions",period:"mo",hint:"Cloud storage, AI tools, credit-file, TradingView, broker subscriptions"},{label:"Gym & fitness",period:"mo",hint:"Membership & classes"},{label:"Sports & equipment",period:"yr",hint:"Kit and gear"},{label:"Clothes",period:"mo",hint:"Everyday clothing"},{label:"Sports clothes",period:"yr",hint:""},{label:"Hobbies & leisure",period:"mo",hint:""},{label:"Gifts & family",period:"mo",hint:"Presents, helping family"},{label:"Charity",period:"mo",hint:""},{label:"Pets",period:"mo",hint:"Food, insurance, vet (pet health)"},{label:"Personal spending money",period:"mo",hint:"Day-to-day 'spends'"},{label:"Home furnishings & décor",period:"yr",hint:"Soft furnishings, decorating, furniture refresh"},{label:"Home technology",period:"yr",hint:"Phones, laptops, gadgets"},{label:"Emergency buffer",period:"mo",hint:"A monthly set-aside for the unexpected"}]},cT=[{label:"Eating out & takeaways",tier:"discretionary",period:"mo",hint:"Meals out, takeaways, coffees"},{label:"Life insurance / income protection",tier:"essential",period:"mo",hint:"Protection premiums"},{label:"Health / dental insurance",tier:"essential",period:"mo",hint:"Private medical, dental plan, cash plan"},{label:"Dental & optical",tier:"essential",period:"yr",hint:"Check-ups, glasses, treatment not on the NHS"},{label:"Hearing",tier:"essential",period:"yr",hint:"Hearing tests & aids"},{label:"Breakdown cover",tier:"essential",period:"yr",hint:"AA / RAC vehicle breakdown"},{label:"Parking & permits",tier:"essential",period:"yr",hint:"Residents permit, ULEZ / congestion"},{label:"Public transport",tier:"essential",period:"mo",hint:"Bus, rail, rail card"},{label:"Cleaner / gardener",tier:"essential",period:"mo",hint:"Cleaner, window cleaner, gardener"},{label:"Long-term care set-aside",tier:"essential",period:"mo",hint:"A monthly reserve toward possible later-life care (easily forgotten)"},{label:"Christmas & birthdays",tier:"discretionary",period:"yr",hint:"Seasonal gifts & celebrations"},{label:"Alcohol",tier:"discretionary",period:"mo",hint:"Beer, wine, spirits"},{label:"Hairdressing & grooming",tier:"discretionary",period:"mo",hint:"Haircuts, beauty, barber"},{label:"Newspapers, books & media",tier:"discretionary",period:"mo",hint:"Papers, magazines, books"},{label:"Grandchildren",tier:"discretionary",period:"mo",hint:"Treats, days out, help with costs"},{label:"Professional memberships",tier:"discretionary",period:"yr",hint:"Institutes, unions, clubs"},{label:"Second / holiday home",tier:"discretionary",period:"mo",hint:"Running costs of a second property"},{label:"Storage / lock-up",tier:"discretionary",period:"mo",hint:"Self-storage, garage rental"},{label:"My personal spending",tier:"discretionary",period:"mo",hint:"Your own day-to-day 'spends'",paidBy:"me"},{label:"Partner's personal spending",tier:"discretionary",period:"mo",hint:"Your partner's day-to-day 'spends'",paidBy:"partner"}];function Qp(n){const e=new Set((n.lines||[]).map(s=>(s.label||"").trim().toLowerCase()).filter(Boolean)),t=[...El.essential.map(s=>({...s,tier:"essential"})),...El.discretionary.map(s=>({...s,tier:"discretionary"}))],r=new Set,i=[];for(const s of[...cT,...t]){const o=s.label.trim().toLowerCase();e.has(o)||r.has(o)||(r.add(o),i.push(s))}return i}const uT=[{label:"New car",tier:"essential",hint:"Replacement vehicle",everyYears:8},{label:"Redecorating",tier:"essential",hint:"Whole-house repaint — a 4-bed runs ~£2,000–3,500 professionally, ~£300–600 DIY",everyYears:7},{label:"Major home work",tier:"essential",hint:"Kitchen, bathroom, roof, windows",everyYears:null},{label:"White goods",tier:"essential",hint:"Fridge, washer, cooker",everyYears:10}],dT={"Council tax":{s:97,c:165},Gas:{s:54,c:71},Electricity:{s:69,c:81},Water:{s:30,c:40},Broadband:{s:28,c:33},"Mobile phones":{s:15,c:30},"TV licence":{s:14,c:14},"Groceries & household":{s:180,c:320},"Home insurance":{s:20,c:28},"Car insurance":{s:26,c:37},"Car tax":{s:16,c:16},"Petrol / fuel":{s:38,c:82},"Car servicing & maintenance":{s:30,c:60},"Boiler service":{s:10,c:12},"Personal health":{s:15,c:40},"Home upkeep":{s:36,c:72},"Main holiday":{s:70,c:145},"UK breaks":{s:30,c:56},"Day trips":{s:20,c:30},"Eating out & takeaways":{s:40,c:110},"Streaming & entertainment":{s:15,c:20},"Digital subscriptions":{s:10,c:15},"Gym & fitness":{s:25,c:45},"Sports & equipment":{s:10,c:15},Clothes:{s:25,c:46},"Sports clothes":{s:5,c:8},"Hobbies & leisure":{s:20,c:30},"Gifts & family":{s:40,c:60},Charity:{s:10,c:15},Pets:{s:25,c:25},"Personal spending money":{s:30,c:50},"Home furnishings & décor":{s:30,c:50},"Home technology":{s:20,c:30},Alcohol:{s:18,c:53},"Hairdressing & grooming":{s:13,c:16},"Newspapers, books & media":{s:20,c:28},"Life insurance / income protection":{s:24,c:24},"Health / dental insurance":{s:10,c:17},"Dental & optical":{s:15,c:25},"Public transport":{s:29,c:55},"Christmas & birthdays":{s:30,c:50},"My personal spending":{s:30,c:30},"Partner's personal spending":{s:0,c:30}};function Jp(n,e){const t=dT[(n||"").trim()];return t?e&&e.sharedWithPartner?t.c:t.s:null}function hT(){const n=e=>El[e].map(t=>({label:t.label,tier:e,annual:null,fromAge:null,toAge:null,hint:t.hint,period:t.period||"yr"}));return[...n("essential"),...n("discretionary")]}function fT(){return uT.map(n=>({label:n.label,tier:n.tier,hint:n.hint,amount:null,atAge:null,everyYears:n.everyYears}))}const pT={pa:12570,brl:50270,hrl:125140},Nt=n=>Number.isFinite(+n)?+n:0;function mT(n,e){const t=n.fromAge??e.retirementAge,r=n.toAge??e.endAge;return{from:Nt(t),to:Nt(r)}}function Xp(n,e,t){const{from:r,to:i}=mT(n,e);return t>=r&&t<=i}function Tl(n,e,t="all"){return(n.lines||[]).filter(r=>t==="all"||r.tier===t).filter(r=>Xp(r,n,e)).reduce((r,i)=>r+Nt(i.annual),0)}function Zp(n,e){if(!e||!e.sharedWithPartner)return 1;const t=n&&n.paidBy||"me";if(t==="partner")return 0;if(t==="shared"){const r=Number.isFinite(+e.mySharePct)?+e.mySharePct:50;return Math.max(0,Math.min(1,r/100))}return 1}function sh(n,e,t="all"){return(n.lines||[]).filter(r=>t==="all"||r.tier===t).filter(r=>Xp(r,n,e)).reduce((r,i)=>r+Nt(i.annual)*Zp(i,n),0)}function gT(n){return Tl(n,Nt(n.retirementAge),"all")}function yT(n,e=pT){const t=Nt(n),{pa:r,brl:i,hrl:s}=e;if(t<=r)return t;const o=i-.2*(i-r);if(t<=o)return r+(t-r)/.8;const l=o+.6*(s-i);return t<=l?i+(t-o)/.6:s+(t-l)/.55}function oh(n,e=!1){return(n.oneOffs||[]).reduce((t,r)=>{const i=Nt(r.amount),s=Nt(r.everyYears);return s>0&&i?t+i/s*(e?Zp(r,n):1):t},0)}function Cc(n){const e=Nt(n.retirementAge),t=sh(n,e,"essential"),r=sh(n,e,"all"),i=oh(n,!0),s=r+i,o=gT(n)+oh(n,!1);return{essentialAnnualNet:t,comfortableAnnualNet:r,essentialMonthlyNet:t/12,comfortableMonthlyNet:r/12,periodicAnnualAverage:i,periodicMonthlyAverage:i/12,allInComfortableAnnual:s,allInComfortableMonthly:s/12,householdComfortableAnnual:o,householdComfortableMonthly:o/12,sharedWithPartner:!!n.sharedWithPartner,suggestedGrossAnnual:yT(s)}}function ps(n=45,e=60,t=100){return{version:1,currentAge:Nt(n),retirementAge:Nt(e),endAge:Nt(t),sharedWithPartner:!1,mySharePct:50,lines:[],oneOffs:[]}}let ci=null,Re=null;function br(){return Ne()&&gt()}function hn(){ci=null,Re=null}function Mc(){return{equityMin:ge.EQUITY_MIN,bondMin:ge.BOND_MIN,cashTarget:ge.CASH_TARGET,duration:ge.DURATION_YEARS,baseSalary:ge.BASE_SALARY,other:0,statePension:12e3,statePensionYear:12,pa:qe.PERSONAL_ALLOWANCE,brl:qe.BASIC_RATE_LIMIT,hrl:qe.HIGHER_RATE_LIMIT,taxMode:"inflates",protectionMult:Dr.PROTECTION_MULTIPLIER,consecutiveLimit:ge.CONSECUTIVE_LIMIT,disableProtection:!1,hodlEnabled:Dr.HODL_ENABLED,hodlValue:Dr.HODL_VALUE,isaBalance:0,isaReturn:Yt.RETURN,isaMin:Yt.MIN,isaDrawdownStrategy:Yt.DRAWDOWN_STRATEGY}}function em(){return{equityMin:ge.EQUITY_MIN,bondMin:ge.BOND_MIN,cashTarget:ge.CASH_TARGET,duration:ge.DURATION_YEARS,baseSalary:ge.BASE_SALARY,protectionFactor:ge.PROTECTION_FACTOR,recoveryBuffer:ge.RECOVERY_BUFFER,consecutiveLimit:ge.CONSECUTIVE_LIMIT,spStartDate:null,spWeeklyAmount:0,statePension:0,statePensionYear:0,isaBalance:0,isaReturn:Yt.RETURN,isaMin:Yt.MIN,isaDrawdownStrategy:Yt.DRAWDOWN_STRATEGY}}function vT(n,e={},t=new Date().toISOString()){const r=n||{};return{...Mc(),...e,equityMin:r.equityMin,bondMin:r.bondMin,cashTarget:r.cashTarget,duration:r.duration,baseSalary:r.baseSalary,spStartDate:r.spStartDate??e.spStartDate??null,spWeeklyAmount:r.spWeeklyAmount??e.spWeeklyAmount??0,consecutiveLimit:r.consecutiveLimit,recoveryBuffer:r.recoveryBuffer,protectionMult:r.protectionFactor!=null?1-r.protectionFactor/100:e.protectionMult??Dr.PROTECTION_MULTIPLIER,isaBalance:r.isaBalance??0,isaReturn:r.isaReturn??Yt.RETURN,isaMin:r.isaMin??Yt.MIN,isaDrawdownStrategy:r.isaDrawdownStrategy??Yt.DRAWDOWN_STRATEGY,seededFrom:"decision",seededAt:t,decisionChecksum:qo(r)}}function tm(){return{}}function nm(){return ps()}function wT(n="My Plan",e="",t=["stress","decision"]){return{planDetails:{name:n,description:e},enabledTools:t,isActive:!0,decisionTool:{settings:em(),history:[],taxYears:tm()},stressTool:{settings:Mc()},budgetTool:{settings:nm()}}}async function Dc(){if(ci)return ci;if(!br())return[];try{const n=await da();return ci=n,n}catch(n){return console.error("Error listing scenarios:",n),[]}}async function kt(){if(Re)return Re;if(!br())return null;try{const e=(await Dc()).find(t=>t.isActive);return e?(Re=e,e):null}catch(n){return console.error("Error getting active scenario:",n),null}}async function bT(n,e,t,r={},i=!0){if(!br())throw new Error("Must be logged in to create scenarios");const s=wT(n,e,t);if(r.stressSettings&&(s.stressTool.settings={...s.stressTool.settings,...r.stressSettings}),r.decisionSettings&&(s.decisionTool.settings={...s.decisionTool.settings,...r.decisionSettings}),r.taxYears&&(s.decisionTool.taxYears=r.taxYears),s.isActive=i,i&&ci){const l=ci.find(c=>c.isActive);l&&(await Pc(null),await wr(l.id,{isActive:!1}))}const o=await Gp(s);return hn(),o}async function _T(n){if(!br())throw new Error("Must be logged in to switch scenarios");await Pc(n),hn()}async function ET(n,e){if(!br())throw new Error("Must be logged in to duplicate scenarios");const t=await sT(n);if(!t)throw new Error("Source scenario not found");const{id:r,createdAt:i,lastModified:s,...o}=t;o.planDetails={...o.planDetails,name:e},o.isActive=!1;const l=await Gp(o);return hn(),l}async function TT(n,e){if(!br())throw new Error("Must be logged in to rename scenarios");await wr(n,{"planDetails.name":e}),hn()}async function IT(n,e){if(!br())throw new Error("Must be logged in to update scenarios");await wr(n,{enabledTools:e}),hn()}async function ST(n){if(!br())throw new Error("Must be logged in to delete scenarios");const e=await Dc();if(e.length<=1)throw new Error("Cannot delete the last scenario");const t=e.find(r=>r.id===n);if(t!=null&&t.isActive){const r=e.find(i=>i.id!==n);r&&await Pc(r.id)}await oT(n),hn()}async function AT(){var e;const n=await kt();return((e=n==null?void 0:n.stressTool)==null?void 0:e.settings)||Mc()}async function rm(n){const e=await kt();if(!e)throw new Error("No active scenario");await wr(e.id,{"stressTool.settings":n}),Re&&(Re.stressTool||(Re.stressTool={}),Re.stressTool.settings=n)}async function xT(){var e;const n=await kt();return((e=n==null?void 0:n.decisionTool)==null?void 0:e.settings)||em()}async function RT(n){const e=await kt();if(!e)throw new Error("No active scenario");await wr(e.id,{"decisionTool.settings":n}),Re&&(Re.decisionTool||(Re.decisionTool={}),Re.decisionTool.settings=n)}async function kT(){var e;const n=await kt();return((e=n==null?void 0:n.budgetTool)==null?void 0:e.settings)||nm()}async function PT(n){const e=await kt();if(!e)throw new Error("No active scenario");await wr(e.id,{"budgetTool.settings":n}),Re&&(Re.budgetTool||(Re.budgetTool={}),Re.budgetTool.settings=n)}async function CT(){var e;const n=await kt();return((e=n==null?void 0:n.decisionTool)==null?void 0:e.taxYears)||tm()}async function MT(n){const e=await kt();if(!e)throw new Error("No active scenario");await wr(e.id,{"decisionTool.taxYears":n}),Re&&(Re.decisionTool||(Re.decisionTool={}),Re.decisionTool.taxYears=n)}async function DT(){var e;const n=await kt();return((e=n==null?void 0:n.decisionTool)==null?void 0:e.history)||[]}async function im(n){const e=await kt();if(!e)throw new Error("No active scenario");await wr(e.id,{"decisionTool.history":n}),Re&&(Re.decisionTool||(Re.decisionTool={}),Re.decisionTool.history=n)}async function sm(){const n=await kt();return(n==null?void 0:n.enabledTools)||["stress","decision"]}let hr=null;function po(){return{settings:{equityMin:ge.EQUITY_MIN,bondMin:ge.BOND_MIN,cashTarget:ge.CASH_TARGET,duration:ge.DURATION_YEARS,equityGlideEnabled:!1,locked:!1,baseSalary:ge.BASE_SALARY,spendingProfile:"flat",protectionFactor:ge.PROTECTION_FACTOR,recoveryBuffer:ge.RECOVERY_BUFFER,consecutiveLimit:ge.CONSECUTIVE_LIMIT,startDate:null,spStartDate:null,spWeeklyAmount:0,statePension:0,statePensionYear:0},taxYears:{},history:[],lastModified:null,checksum:null}}function ha(){return Ne()&&gt()}function gr(){hr=null}function om(){return hr||po()}async function fn(){if(hr)return hr;if(!ha())return console.warn("Firebase not available - returning defaults"),po();try{const[n,e,t]=await Promise.all([xT(),CT(),DT()]),r={settings:n||po().settings,taxYears:e||{},history:t||[],lastModified:new Date().toISOString(),checksum:null};return r.checksum=am(r),hr=r,r}catch(n){console.error("Error loading decision data:",n)}return po()}async function fa(n){if(!ha())throw new Error("Must be logged in to save data");try{n.lastModified=new Date().toISOString(),n.checksum=am(n),await Promise.all([RT(n.settings),MT(n.taxYears)]),hr=n}catch(e){throw console.error("Error saving decision data:",e),new Error("Failed to save decision data")}}function am(n){const e={settings:n.settings,taxYears:n.taxYears,historyCount:n.history.length,lastHistoryDate:n.history.length>0?n.history[n.history.length-1].date:null};return qo(e)}function lm(n){if(!n)return"";const{locked:e,...t}=n;return qo(t)}async function It(){return(await fn()).settings}async function Ns(n){const e=await fn();e.settings={...e.settings,...n},await fa(e)}function Lc(){return{pa:qe.PERSONAL_ALLOWANCE,brl:qe.BASIC_RATE_LIMIT,hrl:qe.HIGHER_RATE_LIMIT,cpi:.04,other:0,isaSavingsAllocation:0,isaSavingsUsed:0,isaContribution:0,isTaxEfficient:!0,taxEfficiencyChoice:null,grossIncomeToDate:0,startMonth:4,yearSetupComplete:!1,confirmedSalary:null}}function LT(n){const t=om().taxYears[n];return t||Lc()}async function pa(n){const t=(await fn()).taxYears[n];return t||Lc()}async function Gr(n,e){console.log(`saveTaxYearConfig: Saving tax year ${n}`,e);const t=await fn();t.taxYears[n]={...LT(n),...e},await fa(t),console.log(`saveTaxYearConfig: Saved tax year ${n}, yearSetupComplete=${t.taxYears[n].yearSetupComplete}`)}async function NT(n){const e=hr||await fn(),t=(e.history||[]).filter(i=>i.taxYear===n),r=t.reduce((i,s)=>i+(s.isa||0),0);return console.log(`recalculateIsaSavingsUsed: Tax year ${n}, found ${t.length} records, total ISA used: ${r}`),console.log("recalculateIsaSavingsUsed: History records:",t.map(i=>({date:i.date,isa:i.isa}))),e.taxYears[n]||(console.log(`recalculateIsaSavingsUsed: No existing config for ${n}, creating default`),e.taxYears[n]=Lc()),console.log(`recalculateIsaSavingsUsed: Before update, isaSavingsUsed=${e.taxYears[n].isaSavingsUsed}`),e.taxYears[n].isaSavingsUsed=r,console.log(`recalculateIsaSavingsUsed: After update, isaSavingsUsed=${e.taxYears[n].isaSavingsUsed}`),await fa(e),console.log("recalculateIsaSavingsUsed: Saved to Firebase"),r}async function BT(n){const e=await pa(n),t=e.yearSetupComplete===!0;return console.log(`isYearSetupComplete: Tax year ${n}, yearSetupComplete=${e.yearSetupComplete}, result=${t}`),t}async function qn(){return(await fn()).taxYears}function OT(n={}){let t=[...om().history];return n.taxYear&&(t=t.filter(r=>r.taxYear===n.taxYear)),n.startDate&&(t=t.filter(r=>r.date>=n.startDate)),n.endDate&&(t=t.filter(r=>r.date<=n.endDate)),n.sortDesc?t.sort((r,i)=>i.date.localeCompare(r.date)):t.sort((r,i)=>r.date.localeCompare(i.date)),n.limit&&(t=t.slice(0,n.limit)),t}async function Kr(n={}){return await fn(),OT(n)}async function VT(n){if(!ha())throw new Error("Must be logged in to save history");const e=await fn(),t=e.history.findIndex(r=>r.date===n.date);t>=0?e.history[t]=n:e.history.push(n),e.history.sort((r,i)=>r.date.localeCompare(i.date)),await im(e.history)}async function cm(n){if(!ha())throw new Error("Must be logged in to delete history");const e=await fn();e.history=e.history.filter(t=>t.date!==n),await im(e.history)}async function Nc(n){const e=await It(),t=await qn(),r=e.spStartDate,i=e.spWeeklyAmount||0;if(!r||!i){let f=null;if(r){const{formatStatePensionDate:m}=await ju(async()=>{const{formatStatePensionDate:p}=await Promise.resolve().then(()=>uh);return{formatStatePensionDate:p}},void 0,import.meta.url);f=m(r)}return{amount:0,monthly:0,yearsUntil:0,isReceiving:!1,isFirstYear:!1,startDate:f}}const{calculateStatePensionForTaxYear:s,getTimeUntilStatePension:o,parseStatePensionDate:l}=await ju(async()=>{const{calculateStatePensionForTaxYear:f,getTimeUntilStatePension:m,parseStatePensionDate:p}=await Promise.resolve().then(()=>uh);return{calculateStatePensionForTaxYear:f,getTimeUntilStatePension:m,parseStatePensionDate:p}},void 0,import.meta.url),c=s({taxYear:n,spStartDate:r,weeklyAmount:i,taxYearConfigs:t}),u=o(r);return{amount:c.annual,monthly:c.monthly,yearsUntil:u.years,monthsUntil:u.months,isReceiving:c.isReceiving,isFirstYear:c.isFirstYear,weeksInYear:c.weeksInYear,startDate:c.startDate}}async function FT(n){const e=Eg(n);e.stdSipp=n.stdSipp||n.sippDraw;try{const t=await It();e.settingsChecksum=lm(t)}catch(t){console.warn("Could not stamp settings checksum on decision:",t)}await VT(e),n.taxYear&&await NT(n.taxYear)}const Il={CONSECUTIVE_LIMIT:3,RECOVERY_BUFFER:1e4};function um({totalGrowth:n,minGrowth:e,consecCashDraws:t,wasInProtection:r,consecutiveLimit:i=Il.CONSECUTIVE_LIMIT,recoveryBuffer:s=Il.RECOVERY_BUFFER}){let o=!1;return r&&(o=n<=e+s),!o&&n<e&&t+1>=i&&(o=!0),o}const No={MAX_FRACTION:.5,MIN_BOOST:50,SURPLUS_BUFFER:15e3};function dm({shortfall:n,standardMonthly:e,remainingMonths:t,surplus:r,brlHeadroom:i=1/0,maxFraction:s=No.MAX_FRACTION,minBoost:o=No.MIN_BOOST}){if(!(n>0)||!(r>0)||t<1)return 0;const l=[n/t,r/t];if(Number.isFinite(i)){if(i<=0)return 0;l.push(i/t)}l.push(e*s);const c=Math.min(...l);return c>o?c:0}const Se=Object.freeze({SHARES:"shares",BONDS:"bonds",DIVERSIFIERS:"diversifiers",CASH:"cash"}),Wt=Object.freeze({ukEquityIncome:{bucket:Se.SHARES,label:"UK equity income",nominalReturn:.068,yield:.04,vol:.16,eqCorr:.9,duration:0,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:.07},globalEquityIncome:{bucket:Se.SHARES,label:"Global equity income",nominalReturn:.07,yield:.03,vol:.16,eqCorr:.95,duration:0,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:.05},worldGrowth:{bucket:Se.SHARES,label:"World growth / tracker",nominalReturn:.07,yield:.02,vol:.17,eqCorr:1,duration:0,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:0},shortGilts:{bucket:Se.BONDS,label:"Short gilts 0-5y (buffer)",nominalReturn:.043,yield:.043,vol:.026,eqCorr:.1,duration:2.5,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:.01},longGilts:{bucket:Se.BONDS,label:"Long gilts 15y+",nominalReturn:.064,yield:.055,vol:.108,eqCorr:.2,duration:15,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:.02},indexLinked:{bucket:Se.BONDS,label:"Index-linked gilts (long)",nominalReturn:.047,yieldReal:.023,vol:.1,eqCorr:.33,duration:15,inflationBeta:1,creditBeta:0,crisisBeta:0,idioVol:.03,realYield:!0},corporateIG:{bucket:Se.BONDS,label:"£ IG corporate",nominalReturn:.053,yield:.052,vol:.065,eqCorr:.41,duration:6.5,inflationBeta:0,creditBeta:.4,crisisBeta:0,idioVol:.03},globalAggHedged:{bucket:Se.BONDS,label:"Global-agg £-hedged",nominalReturn:.045,yield:.045,vol:.053,eqCorr:.3,duration:6,inflationBeta:0,creditBeta:.2,crisisBeta:0,idioVol:.02},usTreasHedged:{bucket:Se.BONDS,label:"US treasuries £-hedged",nominalReturn:.04,yield:.04,vol:.068,eqCorr:.1,duration:7,inflationBeta:0,creditBeta:0,crisisBeta:.15,idioVol:.02},infraDebt:{bucket:Se.BONDS,label:"Infrastructure debt",nominalReturn:.064,yield:.06,vol:.07,eqCorr:.3,duration:8,inflationBeta:.3,creditBeta:.3,crisisBeta:0,idioVol:.03,note:"IG + ~115bps illiquidity premium"},moneyMarket:{bucket:Se.CASH,label:"Money-market fund",nominalReturn:.034,yield:.034,vol:.002,eqCorr:0,duration:.1,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:0,note:"FCA -1% real; = engine cash model"},savings:{bucket:Se.CASH,label:"Savings / NS&I",nominalReturn:.034,yield:.034,vol:.001,eqCorr:0,duration:0,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:0},gold:{bucket:Se.DIVERSIFIERS,label:"Gold",nominalReturn:.055,yield:0,vol:.155,eqCorr:.05,duration:0,inflationBeta:.3,creditBeta:0,crisisBeta:.5,idioVol:.14,note:"near-uncorrelated; rises when stocks AND bonds fall (2022)"},trendMacro:{bucket:Se.DIVERSIFIERS,label:"Trend / macro",nominalReturn:.045,yield:0,vol:.12,eqCorr:.07,duration:0,inflationBeta:0,creditBeta:0,crisisBeta:0,momentumBeta:.6,idioVol:.1,note:"lagged path-momentum; pays in prolonged 2008/2022, whipsaws in V-shaped 2020"}}),ma=Object.freeze([{ticker:"VWRL",name:"Vanguard FTSE All-World (Dist)",subClass:"worldGrowth"},{ticker:"VWRP",name:"Vanguard FTSE All-World (Acc)",subClass:"worldGrowth"},{ticker:"VEVE",name:"Vanguard FTSE Developed World",subClass:"worldGrowth"},{ticker:"SWDA",name:"iShares Core MSCI World",subClass:"worldGrowth"},{ticker:"HMWO",name:"HSBC MSCI World",subClass:"worldGrowth"},{ticker:"VUSA",name:"Vanguard S&P 500",subClass:"worldGrowth"},{ticker:"PACW",name:"Amundi Prime All Country World",subClass:"worldGrowth"},{ticker:"CTY",name:"City of London Investment Trust",subClass:"ukEquityIncome"},{ticker:"LWDB",name:"Law Debenture Corporation",subClass:"ukEquityIncome"},{ticker:"FGT",name:"Finsbury Growth & Income Trust",subClass:"ukEquityIncome"},{ticker:"MRCH",name:"Merchants Trust",subClass:"ukEquityIncome"},{ticker:"ISF",name:"iShares Core FTSE 100",subClass:"ukEquityIncome"},{ticker:"VUKE",name:"Vanguard FTSE 100",subClass:"ukEquityIncome"},{ticker:"UKW",name:"Greencoat UK Wind",subClass:"ukEquityIncome"},{ticker:"HICL",name:"HICL Infrastructure",subClass:"ukEquityIncome"},{ticker:"TRIG",name:"The Renewables Infrastructure Group",subClass:"ukEquityIncome"},{ticker:"MYI",name:"Murray International Trust",subClass:"globalEquityIncome"},{ticker:"VHYL",name:"Vanguard FTSE All-World High Div Yld",subClass:"globalEquityIncome"},{ticker:"JGGI",name:"JPMorgan Global Growth & Income",subClass:"globalEquityIncome"},{ticker:"IGLS",name:"iShares UK Gilts 0-5yr",subClass:"shortGilts"},{ticker:"IGLT",name:"iShares Core UK Gilts",subClass:"longGilts"},{ticker:"VGOV",name:"Vanguard UK Gilt",subClass:"longGilts"},{ticker:"INXG",name:"iShares £ Index-Linked Gilts",subClass:"indexLinked"},{ticker:"TI5G",name:"iShares $ TIPS 0-5 (GBP Hedged)",subClass:"indexLinked"},{ticker:"SLXX",name:"iShares Core £ Corp Bond",subClass:"corporateIG"},{ticker:"VAGP",name:"Vanguard Global Aggregate Bond (GBP Hedged)",subClass:"globalAggHedged"},{ticker:"IBTM",name:"iShares $ Treasury Bond 7-10yr",subClass:"usTreasHedged"},{ticker:"SEQI",name:"Sequoia Economic Infrastructure",subClass:"infraDebt"},{ticker:"CSH2",name:"Amundi Smart Overnight Return",subClass:"moneyMarket"},{ticker:"ERNS",name:"iShares £ Ultrashort Bond",subClass:"moneyMarket"},{ticker:"SGLN",name:"iShares Physical Gold",subClass:"gold"},{ticker:"PHGP",name:"WisdomTree Physical Gold (GBP)",subClass:"gold"},{ticker:"BHMG",name:"BH Macro",subClass:"trendMacro"},{ticker:"CGT",name:"Capital Gearing Trust",subClass:"trendMacro"},{ticker:"PNL",name:"Personal Assets Trust",subClass:"trendMacro"},{ticker:"RICA",name:"Ruffer Investment Company",subClass:"trendMacro"}]),hm=Object.freeze(Object.fromEntries(ma.map(n=>[n.ticker,n.subClass])));function Bc(n){const e=(n||"").toUpperCase().trim();return ma.find(t=>t.ticker===e)||null}function $T(){const n={};for(const[e,t]of Object.entries(Wt))(n[t.bucket]=n[t.bucket]||[]).push({key:e,label:t.label});return n}const zT=.036,UT=.4,qT=.005,HT=.35,fm=.01,Oc=-.15,pm=.045;function ah(n,e=.1){let t=zT+UT*n;return e<Oc&&n<pm&&(t-=fm),t}function lh(n,e=.1){let t=qT+HT*(n-.025);return e<Oc&&n<pm&&(t-=fm),t}function YT(n){return n.inf>.045?"inflation":n.eqReturn<Oc?"crash":"normal"}const jT=Object.freeze({shortGilts:{normal:.05,inflation:.3,crash:-.2},longGilts:{normal:.1,inflation:.45,crash:-.35},indexLinked:{normal:.15,inflation:.35,crash:-.15},corporateIG:{normal:.35,inflation:.45,crash:.55},globalAggHedged:{normal:.25,inflation:.4,crash:.1},usTreasHedged:{normal:.05,inflation:.25,crash:-.4},infraDebt:{normal:.3,inflation:.35,crash:.35},gold:{normal:0,inflation:-.05,crash:-.2},trendMacro:{normal:.05,inflation:-.1,crash:-.3}});function Vc(n,e){const t=jT[n];if(!t)return 0;const r=t[YT(e)];return r??t.normal}const WT=new Map(Object.entries(Wt).map(([n,e])=>[e,n]));function Fc(n,e,t,r){if(!n)return 0;const i=(t-.1)/.17,s=ei(0,1,r),o=e*i+Math.sqrt(Math.max(0,1-e*e))*s;return n*o}function GT(n,e,t){const{inf:r,prevInf:i,eqReturn:s,prevEqReturn:o=.1}=e,l=!!n.realYield,c=n.duration||0,u=l?lh(r,s)-lh(i,o):ah(r,s)-ah(i,o),f=l?(n.yieldReal||0)+r:n.yield||0,m=-c*u,p=l?0:(n.inflationBeta||0)*(r-.025),y=Fc(n.idioVol||0,Vc(WT.get(n),e),s,t);return f+m+p+y}const KT=Object.freeze({shortGilts:.3,longGilts:.2,indexLinked:.2,corporateIG:.3});function QT(n,e,t=KT){let r=0;for(const i of Object.keys(t)){const s=t[i];if(!s)continue;const o=Wt[i];o&&(r+=s*GT(o,n,e))}return r}const JT=.048,XT=.045;function ZT(n,e){const{inf:t,eqReturn:r}=n,i=Wt.gold,s=(i.inflationBeta||0)*(t-.025),o=Fc(i.idioVol||0,Vc("gold",n),r,e);return JT+s+o}function eI(n,e,t){const r=Wt.trendMacro,i=n.eqReturn-.05,s=(r.momentumBeta||0)*t*i,o=Fc(r.idioVol||0,Vc("trendMacro",n),n.eqReturn,e);return XT+s+o}const ch=.6,tI=.15;function nI(n,e){return ch*n+(1-ch)*e}function rI(n){return Math.max(-1,Math.min(1,n/tI))}const iI=Object.freeze({gold:.5,trendMacro:.5});function sI(n,e,t,r=iI){let i=0;return r.gold&&(i+=r.gold*ZT(n,e)),r.trendMacro&&(i+=r.trendMacro*eI(n,e,t)),i}const oI=-.01,aI=5;function mm(n){return Math.max(0,n+oI)}function _i(n,e,t=0){const r=Nl(t);let i=n.equityStart,s=n.bondStart,o=n.cashStart,l=n.hodlEnabled?n.hodlStart!==void 0?n.hodlStart:n.hodlValue:0,c=0,u=n.diversifierStart||0,f=0,m=0,p=0,y=n.isaBalance||0,I=null;const S=n.isaBalance||0,x=Math.max(1e3,S*.05);let k=null,C=0,N=0;const B=new Array(n.years+1).fill(null),$=new Array(n.years+1).fill(null);let q=0,T=0,v=0,_=0,b=!1,E=!1,A=null,w=0,le=0,pe=-1;const H=[],ee=n.trace?[]:null,ne=[];let te=1;H.push({year:0,month:0,equity:i,bond:s,cash:o,hodl:l,total:i+s+o,draw:0,source:"None",inProtection:!1,equityMin:n.equityMin,bondMin:n.bondMin,cashMax:n.cashTarget});for(let se=0;se<n.years*12;se++){const ce=Math.floor(se/12),Te=se%12,Yn=ce;if(Yn!==pe&&(w=0,le=0,pe=Yn),se>0&&se%12===0){const re=e.inflation[ce]||.025;ne.push(re),te*=1+re}const lt=Uo(n.equityGlide,ce,n.duration);if(lt!=null&&Te===0){const re=i+s;re>0&&(i=re*lt,s=re*(1-lt))}u>0&&Te===0&&(ce>0&&(m=nI(m,e.equity[ce-1]||0)),p=rI(m));const ct=e.equity[ce]||0,Kt=e.inflation[ce]||.025,Pt=ce>0?e.inflation[ce-1]||.025:Kt;let Xe=Rn(n.equityMin,ce,n.duration,te,!0),ut=Rn(n.bondMin,ce,n.duration,te,!0);if(lt!=null){const re=Xe+ut;Xe=re*lt,ut=re*(1-lt)}const pn=Rn(n.cashTarget,ce,n.duration,te,!1),mn=Xe+ut,Qt=b;b=n.disableProtection?!1:um({totalGrowth:i+s,minGrowth:mn,consecCashDraws:_,wasInProtection:Qt,consecutiveLimit:n.consecutiveLimit,recoveryBuffer:n.recoveryBuffer??Il.RECOVERY_BUFFER}),b?(q++,v++):(T=Math.max(T,v),v=0);const{sippMonthly:gn,isaMonthly:Ft,planInputs:yt,taxAnnual:jn,higherRate:Jt}=hI(n,ce,te,ne,y);Te===0&&(B[ce]=y/te,$[ce]=(i+s+o+u)/te),N+=jn/12/te,Jt&&C++;const $t=gn,yn=$t;let _e=b?$t*n.protectionMult:$t,fe=_e;const Xt=Ft,Zt=ee?{month:se,year:ce,monthInYear:Te,cumInf:te,equityStart:i,bondStart:s,cashStart:o,isaStart:y,sippMonthly:gn,isaMonthly:Ft,effectiveSipp:_e,effectiveIsa:Xt,boostAmount:0,inProtection:b,planInputs:yt}:null;Zt&&ee.push(Zt),b&&(w+=yn-fe);const Wn=ce>0?e.equity[ce-1]||0:ct,Vs=n.subAsset?QT({inf:Kt,prevInf:Pt,eqReturn:ct,prevEqReturn:Wn},r,n.subAsset.bondWeights):lI(Kt,ct,Pt,r),vn=mm(Pt),wn=re=>Math.pow(1+(Number.isFinite(re)?Math.max(-.99,re):-.99),1/12);if(i*=wn(ct),s*=wn(Vs),o*=wn(vn),y=Cg(y,n.isaReturn||Yt.RETURN),l>0){const Ct=(r()-.5)*2*.06;let zt=0;ct<-.1?zt=Math.min(.15,Math.abs(ct)*.4):ct<-.05&&(zt=Math.abs(ct)*.2);let dt=.069+Ct+zt;dt=Math.max(-.08,Math.min(.18,dt)),l*=wn(dt)}if(u>0){const re=sI({inf:Kt,eqReturn:ct},r,p,n.subAsset&&n.subAsset.diversifierWeights);u*=wn(re)}const en=i+s;let Ze=0;if(!b){const re=12-Te,St=le+yn*re+yt.fixed;Ze=dm({shortfall:w,standardMonthly:yn,remainingMonths:re,surplus:en-mn-No.SURPLUS_BUFFER,brlHeadroom:yt.brl-St}),Ze>50&&(fe+=Ze,w-=Ze)}le+=fe,Zt&&(Zt.effectiveSipp=fe,Zt.boostAmount=Ze>50?Ze:0);let vt="Growth";if(!b&&en>=mn+fe){const re=Math.max(0,i-Xe),St=Math.max(0,s-ut),Ct=re+St;if(Ct>0){if(i-=fe*re/Ct,s-=fe*St/Ct,vt="Growth",o<pn){const zt=en-mn-fe;if(zt>5e3){const dt=Math.min((pn-o)*.3,zt*.5);i-=dt*re/Ct,s-=dt*St/Ct,o+=dt}}}else o-=fe,vt="Cash"}else if(o>=fe)o-=fe,vt="Cash";else{const re=fe-o;o=0,u>re?(u-=re,f+=re,vt="Diversifier"):s>re?(s-=re,vt="Bond"):i>re?(i-=re,vt="Equity"):l>re?(l-=re,c+=re,I===null&&(I=se),vt="HODL"):(E=!0,A=se)}if(_=vt==="Growth"?0:_+1,y=Math.max(0,y-Math.min(Xt,y)),k===null&&S>0&&y/te<x&&(k=se),i=Math.max(0,i),s=Math.max(0,s),o=Math.max(0,o),u=Math.max(0,u),(Te===0||se===n.years*12-1||E)&&H.push({year:ce+Te/12,month:se,equity:i,bond:s,cash:o,hodl:l,diversifier:u,total:i+s+o+u,draw:fe,boostAmount:Ze,source:vt,inProtection:b,equityMin:Xe,bondMin:ut,cashMax:pn}),E)break}if(T=Math.max(T,v),!E)B[n.years]=y/(te||1),$[n.years]=(i+s+o+u)/(te||1);else for(let se=Math.floor(A/12)+1;se<=n.years;se++)$[se]=0;let Ce=0,ke=0,ye=0,O=0,Z=1;for(let se=0;se<n.years;se++){const ce=e.inflation[se]??.025;Ce+=ce,Z*=1+ce,ke+=e.equity[se]??0,se<5&&(ye+=e.equity[se]??0,O++)}const be=i+s+o+u;return{failed:E,duration:n.years,years:E?A/12:n.years,failMonth:A,avgInflation:Ce/n.years,avgEquityReturn:ke/n.years,earlyEquityReturn:O?ye/O:0,cumInflation:Z,finalReal:be/Z,final:be,finalEquity:i,finalBond:s,finalCash:o,finalHodl:l,finalDiversifier:u,divUsed:f,protMonths:q,maxConsec:T,hodlUsed:c,hodlUsedMonth:I,startIsa:S,finalIsa:y,isaDepletedMonth:k,isaLastedYears:k===null?n.years:k/12,higherRateYears:C/12,totalTaxReal:N,isaByYear:B,potByYear:$,hist:H,trace:ee,seed:t}}function lI(n,e,t,r){let i=.15,s=.3,o=.2,l=.1,c=.1,u=.15;const f=t!==void 0?t:n,m=f>.045,p=f>.07;if(m){const q=r()>.3?1:.5;p?(i=.15+.35*q,s=.3-.2*q,u=.15-.1*q,l=.1+.05*q):(i=.15+.2*q,s=.3-.1*q,u=.15-.05*q)}m&&r()<.15&&(i=.2,s=.25,u=.12);const y=n+.005+ei(0,.03,r),I=.04-(n>.04?(n-.04)*.5:0)+ei(0,.05,r),S=.03+n*.3+ei(0,.08,r),x=n*.8+ei(0,.15,r),k=mm(t),C=e*.5+ei(0,.02,r),N=i*y+s*I+o*S+l*x+c*k+u*C,B=cI(n,e),$=(e-.1)/.17;return N+B*$*.055}function cI(n,e){return n>.045?.4:e<-.15?-.3:.1}function uI(n,e){return go(e,n.spendingProfile||"flat")}function dI(n,e){return n.spStartYear!==void 0?Math.max(0,n.spStartYear-e):n.statePensionYear!==void 0?Math.max(0,n.statePensionYear-e):0}function hI(n,e,t,r,i=0){const s=n.taxMode==="frozen"?n.pa:n.pa*t,o=n.taxMode==="frozen"?n.brl:n.brl*t,l=n.taxMode==="frozen"?n.hrl:(n.hrl||125140)*t,c=n.baseSalary*t*uI(n,e),u=Pg(n.other,r);let f=0;if(n.spStartYear!==void 0){if(e>=n.spStartYear&&n.spWeeklyAmount>0){const I=n.spWeeklyAmount*52;e===n.spStartYear&&n.spFirstYearRatio!==void 0?f=I*n.spFirstYearRatio*t:f=I*t}}else n.statePensionYear!==void 0&&(f=e>=n.statePensionYear?(n.statePension||0)*t:0);const m=u+f,p=dI(n,e),y=Ll({targetGross:c,fixedIncome:m,pa:s,brl:o,hrl:l,isaBalance:i,strategy:n.isaDrawdownStrategy||Yt.DRAWDOWN_STRATEGY,yearsUntilSp:p});return{sippMonthly:y.sippGross/12,isaMonthly:y.isaDraw/12,taxAnnual:y.tax,higherRate:y.taxable>o+1,planInputs:{target:c,other:u,statePension:f,fixed:m,pa:s,brl:o,hrl:l,yearsUntilSp:p}}}function gm(n,e=1e3){const t=[];for(let r=0;r<e;r++)t.push(_i(n,$c(n,r),r));return t}function $c(n,e){const t=Object.keys(Br).map(Number).sort((c,u)=>c-u),r=t.length,i=Nl(e*12345),s={equity:{},inflation:{}},o=n.blockYears||aI;let l=0;for(;l<n.years;){const c=Math.floor(i()*r);for(let u=0;u<o&&l<n.years;u++,l++){const f=t[(c+u)%r];s.equity[l]=Br[f],s.inflation[l]=$o[f]||.025}}return s}function ym(n){const e=Object.keys(Br).map(Number).sort((i,s)=>i-s),t=Math.max(...e),r=[];for(const i of e){if(i+n.years-1>t)continue;const s={equity:{},inflation:{}};for(let l=0;l<n.years;l++)s.equity[l]=Br[i+l]||0,s.inflation[l]=$o[i+l]||.025;const o=_i(n,s,i);o.startYear=i,r.push(o)}return r}function fI(n,e){const t={equity:{},inflation:{}};for(let r=0;r<n.years;r++)t.equity[r]=e.equity[r%e.equity.length],t.inflation[r]=e.inflation[r%e.inflation.length];return _i(n,t,999)}function pI(n){const e=n.filter(t=>t.failed).length;return(n.length-e)/n.length*100}function mI(n){if(!n||n.failCount===0)return"No shortfalls: every simulated future funded the whole plan.";const e=u=>(u*100).toFixed(1)+"%",t=Math.round(n.medianFailYear),r=n.duration,i=Math.round(n.pctNearMiss);let s;n.pctNearMiss>=60?s=`and when they do it's usually late — the typical shortfall is at year ${t} of ${r}, and ${i}% happen only in the final years, after funding almost the whole of retirement`:n.pctNearMiss<=30?s=`and they tend to come EARLY — the typical shortfall is at year ${t} of ${r}, with only ${i}% holding on to the final years. An early shortfall is the serious kind, with little retirement left to adjust`:s=`spread through retirement — the typical shortfall is at year ${t} of ${r}`;const o=[{mag:n.succEarlyEq-n.failEarlyEq,text:`a poor first few years of markets (sequence-of-returns risk): the futures that fell short averaged ${e(n.failEarlyEq)} equity in the opening 5 years versus ${e(n.succEarlyEq)} for those that lasted`},{mag:n.succAvgEq-n.failAvgEq,text:`weak markets across the whole plan: ${e(n.failAvgEq)} average equity return versus ${e(n.succAvgEq)} for those that lasted`},{mag:n.failAvgInf-n.succAvgInf,text:`higher inflation eroding spending power: ${e(n.failAvgInf)} a year versus ${e(n.succAvgInf)} for those that lasted`}].filter(u=>u.mag>.005).sort((u,f)=>f.mag-u.mag),l=`About ${Math.round(n.failRate||0)}% of futures fall short`;if(!o.length)return`${l}, ${s}. No single market driver stands out — the shortfalls come down to broadly bad luck across returns and inflation.`;let c=`The common thread is ${o[0].text}`;return o[1]&&o[1].mag>o[0].mag*.5&&(c+=`. A secondary factor is ${o[1].text}`),`${l}, ${s}. ${c}.`}function vm(n){const e=n.filter(l=>!l.failed),t=n.filter(l=>l.failed),r=n.map(l=>l.years).sort((l,c)=>l-c),i=e.map(l=>l.final).sort((l,c)=>l-c),s=n.map(l=>l.protMonths).sort((l,c)=>l-c),o=(l,c)=>l[Math.floor(l.length*c)]||0;return{total:n.length,successCount:e.length,failCount:t.length,successRate:pI(n),survival:{p5:o(r,.05),p10:o(r,.1),p25:o(r,.25),p50:o(r,.5),p75:o(r,.75),p90:o(r,.9),p95:o(r,.95),min:r[0],max:r[r.length-1]},finalValue:{p5:o(i,.05),p10:o(i,.1),p25:o(i,.25),p50:o(i,.5),p75:o(i,.75),p90:o(i,.9),p95:o(i,.95),min:i[0]||0,max:i[i.length-1]||0,avg:e.reduce((l,c)=>l+c.final,0)/(e.length||1)},minYears:r[0],p10Years:o(r,.1),medianYears:o(r,.5),medianFinal:o(i,.5),p10Final:o(i,.1),p90Final:o(i,.9),avgFinal:e.reduce((l,c)=>l+c.final,0)/(e.length||1),protection:{runsWithProtection:n.filter(l=>l.protMonths>0).length,pctWithProtection:n.filter(l=>l.protMonths>0).length/n.length*100,avgMonths:s.reduce((l,c)=>l+c,0)/n.length,maxMonths:Math.max(...s),maxConsecutive:Math.max(...n.map(l=>l.maxConsec)),avgConsecutive:n.reduce((l,c)=>l+c.maxConsec,0)/n.length,p50Months:o(s,.5),p90Months:o(s,.9),p95Months:o(s,.95)},runsWithProtection:n.filter(l=>l.protMonths>0).length,avgProtMonths:s.reduce((l,c)=>l+c,0)/n.length,maxProtMonths:Math.max(...s),maxConsecutive:Math.max(...n.map(l=>l.maxConsec)),avgConsecutive:n.reduce((l,c)=>l+c.maxConsec,0)/n.length,hodl:{runsUsingHodl:n.filter(l=>l.hodlUsed>0).length,pctUsingHodl:n.filter(l=>l.hodlUsed>0).length/n.length*100,avgUsed:n.filter(l=>l.hodlUsed>0).length>0?n.filter(l=>l.hodlUsed>0).reduce((l,c)=>l+c.hodlUsed,0)/n.filter(l=>l.hodlUsed>0).length:0,maxUsed:Math.max(...n.map(l=>l.hodlUsed||0))},runsUsingHodl:n.filter(l=>l.hodlUsed>0).length,avgHodlUsed:n.filter(l=>l.hodlUsed>0).length>0?n.filter(l=>l.hodlUsed>0).reduce((l,c)=>l+c.hodlUsed,0)/n.filter(l=>l.hodlUsed>0).length:0,maxHodlUsed:Math.max(...n.map(l=>l.hodlUsed||0)),severity:(()=>{const l=Math.max(...n.map(S=>S.duration||S.years),1),c=n.filter(S=>S.failed),u=n.filter(S=>!S.failed),f=c.map(S=>S.years).sort((S,x)=>S-x),m=l*.85,p=(S,x)=>S.length?S.reduce((k,C)=>k+(C[x]||0),0)/S.length:0,y={duration:l,coverage:n.reduce((S,x)=>S+Math.min(1,(x.years||0)/l),0)/n.length*100,failCount:c.length,failRate:n.length?c.length/n.length*100:0,medianFailYear:f.length?o(f,.5):0,pctNearMiss:c.length?c.filter(S=>S.years>=m).length/c.length*100:0,failEarlyEq:p(c,"earlyEquityReturn"),succEarlyEq:p(u,"earlyEquityReturn"),failAvgEq:p(c,"avgEquityReturn"),succAvgEq:p(u,"avgEquityReturn"),failAvgInf:p(c,"avgInflation"),succAvgInf:p(u,"avgInflation")};y.diagnosis=mI(y);const I=[{k:"sequence",m:y.succEarlyEq-y.failEarlyEq},{k:"market",m:y.succAvgEq-y.failAvgEq},{k:"inflation",m:y.failAvgInf-y.succAvgInf}].filter(S=>S.m>.005).sort((S,x)=>x.m-S.m);return y.primaryDriver=y.failCount>0&&I.length?I[0].k:null,y})(),finalReal:(()=>{const l=n.map(c=>c.failed?0:c.finalReal||0).sort((c,u)=>c-u);return{p5:o(l,.05),p10:o(l,.1),p25:o(l,.25),p50:o(l,.5),p75:o(l,.75),p90:o(l,.9),p95:o(l,.95),min:l[0]||0,max:l[l.length-1]||0}})(),chartData:(()=>{const l=Math.max(...n.map(m=>m.duration||m.years),1),c=l+1,u={p10:[],p25:[],p50:[],p75:[],p90:[]},f=[];for(let m=0;m<c;m++){const p=n.map(I=>I.potByYear&&I.potByYear[m]!=null?I.potByYear[m]:0).sort((I,S)=>I-S);u.p10.push(o(p,.1)),u.p25.push(o(p,.25)),u.p50.push(o(p,.5)),u.p75.push(o(p,.75)),u.p90.push(o(p,.9));const y=n.filter(I=>(I.failed?I.failMonth/12:l)>=m).length;f.push(n.length?y/n.length*100:0)}return{years:c,potBand:u,solvency:f}})(),isa:(()=>{const l=n.filter(S=>(S.startIsa||0)>0);if(!l.length)return{funded:!1};const c=l.map(S=>S.isaLastedYears).sort((S,x)=>S-x),u=l.map(S=>S.finalIsa).sort((S,x)=>S-x),f=l.map(S=>S.higherRateYears),m=l.map(S=>S.totalTaxReal).sort((S,x)=>S-x),p=Math.max(...l.map(S=>(S.isaByYear||[]).length)),y=[],I=[];for(let S=0;S<p;S++){const x=l.filter(C=>C.isaByYear&&C.isaByYear[S]>0).length;y.push(l.length?x/l.length*100:0);const k=l.map(C=>C.isaByYear&&C.isaByYear[S]!=null?C.isaByYear[S]:0).sort((C,N)=>C-N);I.push(k[Math.floor(k.length/2)])}return{funded:!0,runs:l.length,startBalance:l[0].startIsa,medianLastedYears:o(c,.5),minLastedYears:c[0],pctSurviveFullTerm:l.filter(S=>S.isaDepletedMonth===null).length/l.length*100,finalBalance:{p10:o(u,.1),p50:o(u,.5),p90:o(u,.9)},avgHigherRateYears:f.reduce((S,x)=>S+x,0)/l.length,maxHigherRateYears:Math.max(...f),pctEverHigherRate:l.filter(S=>S.higherRateYears>0).length/l.length*100,medianTotalTax:o(m,.5),p90TotalTax:o(m,.9),pctHoldingByYear:y,medianIsaByYear:I}})(),failures:t.map(l=>({seed:l.seed,startYear:l.startYear,years:l.years,failMonth:l.failMonth,protMonths:l.protMonths}))}}function Ri(n){if(!n)return null;const e={january:0,jan:0,february:1,feb:1,march:2,mar:2,april:3,apr:3,may:4,june:5,jun:5,july:6,jul:6,august:7,aug:7,september:8,sep:8,sept:8,october:9,oct:9,november:10,nov:10,december:11,dec:11},t=n.trim().replace(/\s+/g," ");if(/^\d{4}-\d{2}-\d{2}$/.test(t)){const i=new Date(t);if(!isNaN(i.getTime()))return i}if(/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(t)){const[i,s,o]=t.split("/").map(Number);return new Date(o,s-1,i)}if(/^\d{1,2}-\d{1,2}-\d{4}$/.test(t)){const[i,s,o]=t.split("-").map(Number);return new Date(o,s-1,i)}let r=t.match(/^(\d{1,2})\s+(\w+)\s+(\d{4})$/i);if(r){const i=parseInt(r[1]),s=e[r[2].toLowerCase()],o=parseInt(r[3]);if(s!==void 0)return new Date(o,s,i)}if(r=t.match(/^(\w+)\s+(\d{1,2})\s+(\d{4})$/i),r){const i=e[r[1].toLowerCase()],s=parseInt(r[2]),o=parseInt(r[3]);if(i!==void 0)return new Date(o,i,s)}if(r=t.match(/^(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})$/i),r){const i=e[r[1].toLowerCase()],s=parseInt(r[2]),o=parseInt(r[3]);if(i!==void 0)return new Date(o,i,s)}if(r=t.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+(\w+),?\s+(\d{4})$/i),r){const i=parseInt(r[1]),s=e[r[2].toLowerCase()],o=parseInt(r[3]);if(s!==void 0)return new Date(o,s,i)}return null}function mo(n){const e=typeof n=="string"?Ri(n):n;if(!e||isNaN(e.getTime()))return"";const t=["January","February","March","April","May","June","July","August","September","October","November","December"];return`${e.getDate()} ${t[e.getMonth()]} ${e.getFullYear()}`}function gI(n){const{taxYear:e,spStartDate:t,weeklyAmount:r,taxYearConfigs:i={}}=n;if(!t||!r||r<=0)return{annual:0,monthly:0,isReceiving:!1,isFirstYear:!1,weeksInYear:0,startDate:null};const s=typeof t=="string"?Ri(t):t;if(!s||isNaN(s.getTime()))return{annual:0,monthly:0,isReceiving:!1,isFirstYear:!1,weeksInYear:0,startDate:null};const o=zo(s);Na(e);const l=Sg(e),c=[...new Set([o,e,...Object.keys(i)])].sort((S,x)=>Na(S).getTime()-Na(x).getTime()),u=c.indexOf(o),f=c.indexOf(e);if(f<u)return{annual:0,monthly:0,isReceiving:!1,isFirstYear:!1,weeksInYear:0,startDate:mo(s)};let m=1;for(let S=u;S<f;S++){const x=c[S],k=i[x],C=(k==null?void 0:k.cpi)||.025;m*=1+C}const p=r*m;if(e===o){const x=Math.max(0,(l.getTime()-s.getTime())/6048e5),k=p*x;return{annual:k,monthly:k/12,isReceiving:!0,isFirstYear:!0,weeksInYear:Math.round(x*10)/10,startDate:mo(s)}}const I=p*52;return{annual:I,monthly:I/12,isReceiving:!0,isFirstYear:!1,weeksInYear:52,startDate:mo(s)}}function yI(n,e=new Date){const t=typeof n=="string"?Ri(n):n;if(!t||isNaN(t.getTime()))return{years:0,months:0,totalMonths:0,isPast:!1};const r=t.getTime()-e.getTime(),i=r<=0;if(i)return{years:0,months:0,totalMonths:0,isPast:!0};const s=Math.floor(r/(30.44*24*60*60*1e3)),o=Math.floor(s/12),l=s%12;return{years:o,months:l,totalMonths:s,isPast:i}}const wm=2016;function ga(n,{now:e=new Date}={}){if(!n||!String(n).trim())return{valid:!0,error:null,warning:null,date:null};const t=Ri(n);if(!t||isNaN(t.getTime()))return{valid:!1,error:'Could not read that date. Try a format like "6 May 2040".',warning:null,date:null};const r=t.getFullYear();return r<wm?{valid:!1,error:`That looks like a date of birth (${r}), not a State Pension start date. Enter the date your State Pension begins — check gov.uk/check-your-state-pension.`,warning:null,date:t}:t.getTime()<e.getTime()?{valid:!0,error:null,warning:`This date is in the past — State Pension will be treated as already in payment from ${r}.`,date:t}:{valid:!0,error:null,warning:null,date:t}}const uh=Object.freeze(Object.defineProperty({__proto__:null,MIN_SP_START_YEAR:wm,calculateStatePensionForTaxYear:gI,formatStatePensionDate:mo,getTimeUntilStatePension:yI,parseStatePensionDate:Ri,validateStatePensionDate:ga},Symbol.toStringTag,{value:"Module"}));let or=null;function ms(){return{settings:{equityMin:ge.EQUITY_MIN,bondMin:ge.BOND_MIN,cashTarget:ge.CASH_TARGET,duration:ge.DURATION_YEARS,baseSalary:ge.BASE_SALARY,other:0,statePension:12e3,statePensionYear:12,pa:qe.PERSONAL_ALLOWANCE,brl:qe.BASIC_RATE_LIMIT,hrl:qe.HIGHER_RATE_LIMIT,taxMode:"inflates",protectionMult:Dr.PROTECTION_MULTIPLIER,consecutiveLimit:ge.CONSECUTIVE_LIMIT,disableProtection:!1,hodlEnabled:Dr.HODL_ENABLED,hodlValue:Dr.HODL_VALUE,spendingProfile:"flat",equityGlideEnabled:!1,diversifierStart:0,taggedFunds:[]},lastModified:null,checksum:null}}function zc(){return Ne()&&gt()}function On(){or=null}function vI(){return or||ms()}async function bm(){if(or)return or;if(!zc())return console.warn("Firebase not available - returning defaults"),ms();try{const n=await AT();if(n){const e={settings:n,lastModified:new Date().toISOString(),checksum:null};return or=_I(e),or}}catch(n){console.error("Error loading stress data:",n)}return ms()}async function wI(n){if(!zc())throw new Error("Must be logged in to save data");try{n.lastModified=new Date().toISOString(),n.checksum=bI(n),await rm(n.settings),or=n}catch(e){throw console.error("Error saving stress data:",e),new Error("Failed to save stress data")}}function bI(n){return qo(n.settings)}function _I(n){const e={...ms()};return n.settings&&(e.settings={...e.settings,...n.settings},n.settings.pacwMin!==void 0&&n.settings.equityMin===void 0&&(e.settings.equityMin=n.settings.pacwMin),n.settings.cgtMin!==void 0&&n.settings.bondMin===void 0&&(e.settings.bondMin=n.settings.cgtMin),n.settings.csh2Target!==void 0&&n.settings.cashTarget===void 0&&(e.settings.cashTarget=n.settings.csh2Target),e.settings.hodlEnabled===void 0&&(e.settings.hodlEnabled=!1),e.settings.hodlValue===void 0&&(e.settings.hodlValue=25e3)),e.lastModified=n.lastModified,e.checksum=n.checksum,e}function EI(){return vI().settings}async function Vt(){return(await bm()).settings}async function ya(n){const e=await bm();e.settings={...e.settings,...n},await wI(e)}async function TI(){if(!zc())throw new Error("Must be logged in to reset settings");const n=ms();await rm(n.settings),On()}function II(n){if(!n.spStartDate||!n.spWeeklyAmount)return null;const e=Ri(n.spStartDate);if(!e)return console.warn("Could not parse spStartDate:",n.spStartDate),null;const t=new Date,r=365.25*24*60*60*1e3,i=Math.max(0,(e.getTime()-t.getTime())/r),s=Math.floor(i),o=365,l=Math.floor((e-new Date(e.getFullYear(),0,0))/(24*60*60*1e3)),u=(o-l)/o;return{spStartYear:s,spWeeklyAmount:n.spWeeklyAmount,spFirstYearRatio:u}}function Bs(n={},e=null){const t=e||EI(),r=II(t),i=r?{spStartYear:r.spStartYear,spWeeklyAmount:r.spWeeklyAmount,spFirstYearRatio:r.spFirstYearRatio}:{statePension:t.statePension||0,statePensionYear:t.statePensionYear??999};return{equityStart:n.equityStart??t.equityMin,bondStart:n.bondStart??t.bondMin,cashStart:n.cashStart??t.cashTarget,equityMin:t.equityMin,bondMin:t.bondMin,cashTarget:t.cashTarget,years:n.years??t.duration,duration:t.duration,baseSalary:t.baseSalary,other:t.other,...i,pa:t.pa,brl:t.brl,hrl:t.hrl,taxMode:t.taxMode,protectionMult:t.protectionMult,consecutiveLimit:t.consecutiveLimit,disableProtection:t.disableProtection,hodlEnabled:t.hodlEnabled,hodlValue:t.hodlValue,isaBalance:t.isaBalance||0,isaReturn:t.isaReturn,isaDrawdownStrategy:t.isaDrawdownStrategy,spendingProfile:t.spendingProfile||"flat",equityGlide:t.equityGlideEnabled?xh(t):void 0,diversifierStart:n.diversifierStart??(t.diversifierStart||void 0),subAsset:t.subAsset||void 0}}async function _m(){try{const n=await kT();return{...ps(),...n||{}}}catch(n){return console.error("Error loading budget:",n),ps()}}async function Em(n){const e={...n,derived:Cc(n)};return await PT(e),e}function W(n,e=null){const t=Math.abs(n),r=e!==null?e:t<100,i=Math.abs(n).toLocaleString("en-GB",{minimumFractionDigits:r?2:0,maximumFractionDigits:r?2:0});return n<0?`-£${i}`:`£${i}`}function dh(n,e){const t=SI(n);e.innerHTML=t}function SI(n){var E,A,w,le,pe;const e=n,t=e.calculationDetails||{};let r="";const i=e.isTaxEfficientYear??e.taxEfficient,s=e.protectionInducedTaxEfficiency||!1,o=e.boostAmount>0;let l,c,u;if(e.inProtection?(l="warning",c="Protection Mode",u="⚡"):o?(l="boost",c="Tax Boost (Catch-up)",u="↑"):s?(l="info",c="Protection-Induced Tax Efficiency",u="↑"):i?(l="success",c="Tax-Efficient Year",u="✓"):(l="warning",c="Tax-Inefficient Year",u="!"),r+=`<div class="decision-mode ${l}">
    <span class="mode-icon">${u}</span>
    <span class="mode-label">${c}</span>
  </div>`,i&&e.yearlyIsaSavingsAllocation>0){const H=e.cumulativeIsaSavingsUsed||0,ee=e.yearlyIsaSavingsAllocation,ne=Math.max(0,ee-H),te=ee>0?H/ee*100:0;r+=`<div class="isa-progress-card">
      <h4>ISA/Savings Allocation</h4>
      <div class="isa-progress-bar">
        <div class="isa-progress-fill" style="width: ${Math.min(te,100)}%"></div>
      </div>
      <div class="isa-progress-stats">
        <span>Used: ${W(H)} of ${W(ee)}</span>
        <span>Remaining: ${W(ne)}</span>
      </div>
    </div>`}if(e.alerts&&e.alerts.length>0){r+='<div class="alerts">';for(const H of e.alerts){const ee=AI(H.severity);r+=`<div class="alert ${ee}">${H.message}</div>`}r+="</div>"}r+='<div class="recommendation-card">',r+="<h3>Monthly Recommendation</h3>",r+='<div class="draw-row primary">',r+='<span class="label">SIPP Withdrawal</span>',r+=`<span class="value">${W(e.sippDraw)}</span>`,r+="</div>",e.isaDraw>0&&(r+='<div class="draw-row">',r+='<span class="label">ISA Top-up</span>',r+=`<span class="value">${W(e.isaDraw)}</span>`,r+="</div>"),e.other>0&&(r+='<div class="draw-row muted">',r+='<span class="label">Other Pension</span>',r+=`<span class="value">${W(e.other)}</span>`,r+="</div>"),e.statePension>0&&(r+='<div class="draw-row muted">',r+='<span class="label">State Pension</span>',r+=`<span class="value">${W(e.statePension)}</span>`,r+="</div>"),r+='<div class="divider"></div>';const f=e.sippDraw+e.other+e.statePension,m=f*12,p=e.pa||12570,y=e.brl||50270;let I=0;m>p&&(m<=y?I=(m-p)*.2:I=(y-p)*.2+(m-y)*.4);const S=f-I/12+e.isaDraw;r+='<div class="draw-row total">',r+='<span class="label">Total Monthly Income</span>',r+=`<span class="value">${W(S)}</span>`,r+="</div>",e.boostAmount>0&&(r+='<div class="boost-indicator">',r+='<span class="boost-label">Includes Tax Boost:</span>',r+=`<span class="boost-value">+${W(e.boostAmount)}</span>`,r+="</div>"),r+="</div>",r+='<div class="source-card">',r+="<h4>Withdraw From</h4>",r+=`<div class="source-label ${e.source.toLowerCase().replace(/[^a-z]+/g,"-")}">${e.source}</div>`,e.source==="Growth"&&(e.drawFromEquity>0||e.drawFromBond>0)&&(r+='<div class="source-breakdown">',e.drawFromEquity>0&&(r+=`<div class="source-item">Equity: ${W(e.drawFromEquity)}</div>`),e.drawFromBond>0&&(r+=`<div class="source-item">Bond: ${W(e.drawFromBond)}</div>`),r+="</div>"),e.drawFromDiversifier>0&&(r+='<div class="source-breakdown">',e.drawFromCash>0&&(r+=`<div class="source-item">Cash: ${W(e.drawFromCash)}</div>`),r+=`<div class="source-item">Diversifier reserve: ${W(e.drawFromDiversifier)}</div>`,r+="</div>"),r+="</div>",r+='<div class="fund-status">',r+="<h4>Fund Status</h4>";const x=e.equity+e.bond+e.cash+(e.diversifier||0),k=e.adjEquityMin+e.adjBondMin+e.adjCashTarget,C=x-k,N=k>0?C/k*100:0;r+='<div class="fund-grid">';const B=e.equity-e.adjEquityMin;r+=ro("Equity",e.equity,e.adjEquityMin,B);const $=e.bond-e.adjBondMin;r+=ro("Bond",e.bond,e.adjBondMin,$);const q=e.cash-e.adjCashTarget;r+=ro("Cash",e.cash,e.adjCashTarget,q),e.diversifier!=null&&(r+=ro("Diversifiers",e.diversifier,0,e.diversifier)),r+="</div>";const T=C>=0?"healthy":"warning";r+=`<div class="overall-status ${T}">`,r+=`<span>Total Surplus: ${W(C)}</span>`,r+=`<span>(${N.toFixed(1)}% above target)</span>`,r+="</div>",r+="</div>",r+='<div class="tax-info">',r+="<h4>Tax Summary</h4>",r+='<div class="tax-thresholds">',r+=`<div class="tax-threshold-item"><span class="label">PA:</span><span>${W(e.pa)}</span></div>`,r+=`<div class="tax-threshold-item"><span class="label">BRL:</span><span>${W(e.brl)}</span></div>`,t.taxInfo&&(r+=`<div class="tax-threshold-item"><span class="label">Headroom:</span><span class="${t.taxInfo.headroomToBRL>0?"success":"warning"}">${W(t.taxInfo.headroomToBRL)}</span></div>`),r+="</div>",r+='<div class="tax-comparison">',r+='<div class="tax-comparison-header">',r+="<div></div><div>Monthly</div><div>YTD</div><div>Projected</div>",r+="</div>";const v=((E=t.taxInfo)==null?void 0:E.monthlyTax)||I/12,_=e.taxPaidYTD||v,b=e.taxProjectedAnnual||((A=t.taxInfo)==null?void 0:A.annualTax)||I;if(r+='<div class="tax-comparison-row">',r+='<div class="label">Tax Paid</div>',r+=`<div>${W(v)}</div>`,r+=`<div>${W(_)}</div>`,r+=`<div>${W(b)}</div>`,r+="</div>",i||((w=t.taxInfo)==null?void 0:w.taxSavedAnnual)>0){const H=e.taxSavedMonthly||((le=t.taxInfo)==null?void 0:le.taxSavedMonthly)||0,ee=e.taxSavedYTD||H,ne=e.taxSavedProjectedAnnual||((pe=t.taxInfo)==null?void 0:pe.taxSavedAnnual)||0;ne>0&&(r+='<div class="tax-comparison-row saved">',r+='<div class="label">Tax Saved</div>',r+=`<div class="success">-${W(H)}</div>`,r+=`<div class="success">-${W(ee)}</div>`,r+=`<div class="success">-${W(ne)}</div>`,r+="</div>")}if(r+="</div>",t.taxInfo&&typeof t.taxInfo.effectiveRate=="number"&&!isNaN(t.taxInfo.effectiveRate)){const H=t.taxInfo.effectiveRate*100;r+=`<div class="effective-rate">
      <span>Effective Tax Rate:</span>
      <span class="${H<=20?"success":H<=40?"warning":"danger"}">${H.toFixed(1)}%</span>
    </div>`}else if(t.taxInfo&&t.taxInfo.annualTaxable>0&&t.taxInfo.annualTax>=0){const H=t.taxInfo.annualTax/t.taxInfo.annualTaxable*100;r+=`<div class="effective-rate">
      <span>Effective Tax Rate:</span>
      <span class="${H<=20?"success":H<=40?"warning":"danger"}">${H.toFixed(1)}%</span>
    </div>`}if(r+="</div>",e.rebalanceNeeded&&e.rebalanceActions.length>0){r+='<div class="rebalance-card">',r+="<h4>Rebalancing Suggestions</h4>",r+="<ul>";for(const H of e.rebalanceActions)r+=`<li>${H}</li>`;r+="</ul>",r+="</div>"}return r+='<div class="mode-explanation">',r+="<h4>Why This Recommendation?</h4>",r+=`<p>${t.reason||"Standard calculation based on your settings."}</p>`,!t.hasSufficientIsa&&t.isaNeededMonthly>0&&(r+=`<p class="isa-warning">To enable tax-efficient mode, you need ${W(t.totalIsaNeeded)} in your ISA (${e.remainingMonths} months remaining in tax year).</p>`),r+="</div>",r+='<details class="debug-section">',r+="<summary>Calculation Details</summary>",r+="<pre>"+JSON.stringify(t,null,2)+"</pre>",r+="</details>",r}function ro(n,e,t,r){return`<div class="fund-cell ${r>=0?"healthy":"deficit"}">
    <div class="fund-name">${n}</div>
    <div class="fund-current">${W(e)}</div>
    <div class="fund-min">Min: ${W(t)}</div>
    <div class="fund-surplus">${r>=0?"+":""}${W(r)}</div>
  </div>`}function AI(n){switch(n){case Js.DANGER:return"alert-danger";case Js.WARNING:return"alert-warning";case Js.SUCCESS:return"alert-success";case Js.INFO:default:return"alert-info"}}function xI(){return`
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
  `}async function RI(n){const e=Dl(n),t=zo(e),r=e.getMonth()+1;return await BT(t)?{showWizard:!1,taxYear:t,isApril:r===4,reason:"Year setup already complete"}:{showWizard:!0,taxYear:t,isApril:r===4,reason:`Tax year ${t} has not been set up`}}function kI(n,e,t=0){return n*(1+e-t)}function PI(n){const{targetAnnualGross:e,brl:t,pa:r=12570,remainingMonths:i,grossIncomeToDate:s=0}=n,o=I=>I<=r?0:I<=t?(I-r)*.2:(t-r)*.2+(I-t)*.4,l=Math.max(0,t-s);if(l<=0)return{isaNeeded:0,brlExhausted:!0,remainingBrlHeadroom:0,maxTaxEfficientSalary:t,reducedSalaryOption:t,canBeTaxEfficient:!1,reason:"BRL already exhausted by prior income"};if(e<=t)return{isaNeeded:0,brlExhausted:!1,remainingBrlHeadroom:l,maxTaxEfficientSalary:t,reducedSalaryOption:t,canBeTaxEfficient:!0,targetAchievableAtBrl:!0,reason:"Target achievable at BRL without ISA"};const c=o(e),u=e-c,f=o(t),m=t-f,p=Math.max(0,u-m),y=p/12*i;return{isaNeeded:y,isaNeededAnnual:p,brlExhausted:!1,remainingBrlHeadroom:l,maxTaxEfficientSalary:t,reducedSalaryOption:t,canBeTaxEfficient:!0,targetAchievableAtBrl:!1,netAtTarget:u,netAtBrl:m,taxAtTarget:c,taxAtBrl:f,reason:`Need £${Math.round(y).toLocaleString()} ISA/Savings for tax efficiency`}}function CI(n,e,t){return t?{sufficient:!1,isBrlExhausted:!0,options:[{key:"reduced",label:"Reduce salary to BRL",description:"Accept lower income to stay tax-efficient"},{key:"inefficient",label:"Accept tax-inefficient year",description:"Draw full SIPP, pay 40% on excess"}]}:n>=e?{sufficient:!0,isBrlExhausted:!1,options:[]}:{sufficient:!1,isBrlExhausted:!1,shortfall:e-n,options:[{key:"increase",label:`Increase ISA to £${Math.round(e).toLocaleString()}`,description:"Provide enough ISA for tax efficiency"},{key:"reduced",label:"Reduce salary to BRL",description:"Keep ISA to grow, accept lower income"},{key:"inefficient",label:"Accept tax-inefficient year",description:"Draw full SIPP, ISA stays untouched"}]}}async function MI(n){const e=Dl(n),t=zo(e),i=e.getMonth()+1===4,s=xg(e),o=await It(),l=await pa(t),c=await qn(),u=Object.keys(c).sort(),f=u.indexOf(t)-1,m=f>=0?c[u[f]]:null,p=await Nc(t),y=(m==null?void 0:m.cpi)||.025,I=o.spendingProfile||"flat",S=Math.max(0,2e3+(parseInt(t.split("/")[0],10)||26)-2026),x=Bg(S,I),k=m&&m.confirmedSalary||o.baseSalary,C=kI(k,y,x);return{taxYear:t,selectedMonth:n,isApril:i,remainingMonths:s,baseSalary:o.baseSalary,suggestionBase:k,spendingProfile:I,declineRate:x,suggestedSalary:C,defaults:{pa:(m==null?void 0:m.pa)||l.pa,brl:(m==null?void 0:m.brl)||l.brl,hrl:(m==null?void 0:m.hrl)||l.hrl,cpi:y,other:(m==null?void 0:m.other)||0},statePension:p,existingConfig:l.yearSetupComplete?l:null}}function Tm(n){const{targetSalary:e,brl:t,pa:r=12570,other:i=0,statePension:s=0,isaSavingsAllocation:o=0,remainingMonths:l,grossIncomeToDate:c=0,isTaxEfficient:u=!0}=n,f=A=>A<=r?0:A<=t?(A-r)*.2:(t-r)*.2+(A-t)*.4,m=i/12,p=s/12,y=m+p;let I,S;if(!u)I=e/12-y,S=0;else{const A=Math.max(0,t-c),w=Math.max(0,A/l-y);I=Math.min(e/12-y,w),S=o/l}const x=(I+y)*12,C=f(x)/12,N=I+y,B=N>0?C/N:0,$=I*B,q=m*B,T=p*B,v=I-$,_=m-q,b=p-T,E=v+_+b+S;return{sipp:{gross:I,tax:$,net:v},other:{gross:m,tax:q,net:_},statePension:{gross:p,tax:T,net:b},isa:{gross:S,tax:0,net:S},totalGross:I+m+p+S,totalTax:C,totalNet:E,mode:u?"tax-efficient":"tax-inefficient",monthlySipp:I,monthlyIsa:S,monthlyOther:m,monthlyStatePension:p,monthlyTotal:E}}function DI(n){var S,x,k,C,N,B,$,q,T,v,_;const{pa:e,brl:t,hrl:r,cpi:i,other:s,isaSavingsAllocation:o,isTaxEfficient:l,taxEfficiencyChoice:c,grossIncomeToDate:u,startMonth:f,confirmedSalary:m,remainingMonths:p,statePension:y,monthlyBreakdown:I}=n;return{pa:e,brl:t,hrl:r,cpi:i,other:s,isaSavingsAllocation:l?o:0,isaSavingsUsed:0,isTaxEfficient:l,taxEfficiencyChoice:c,grossIncomeToDate:u||0,startMonth:f||4,remainingMonths:p||12,yearSetupComplete:!0,confirmedSalary:m,statePension:y||0,expectedMonthly:I?{sipp:{gross:((S=I.sipp)==null?void 0:S.gross)||0,tax:((x=I.sipp)==null?void 0:x.tax)||0,net:((k=I.sipp)==null?void 0:k.net)||0},other:{gross:((C=I.other)==null?void 0:C.gross)||0,tax:((N=I.other)==null?void 0:N.tax)||0,net:((B=I.other)==null?void 0:B.net)||0},statePension:{gross:(($=I.statePension)==null?void 0:$.gross)||0,tax:((q=I.statePension)==null?void 0:q.tax)||0,net:((T=I.statePension)==null?void 0:T.net)||0},isa:{gross:((v=I.isa)==null?void 0:v.gross)||0,tax:0,net:((_=I.isa)==null?void 0:_.net)||0},totalGross:I.totalGross||0,totalTax:I.totalTax||0,totalNet:I.totalNet||0}:null}}let Nr=null,gs=null,Lt=1,K=null,F={};async function LI(n,e,t){Nr=n,gs=t,Lt=1,F={},K=await MI(e),F={pa:K.defaults.pa,brl:K.defaults.brl,hrl:K.defaults.hrl,cpi:K.defaults.cpi,other:K.defaults.other,grossIncomeToDate:0,confirmedSalary:K.suggestedSalary,isaSavingsAllocation:0,isTaxEfficient:!0,taxEfficiencyChoice:null},rs()}async function NI(n){return await RI(n)}function rs(){if(!Nr||!K)return;const n=K.isApril?6:7;Nr.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Tax Year ${K.taxYear} Setup</div>
        <div class="wizard-subtitle">
          ${K.isApril?"Setting up for the full tax year":`Starting in ${Uc(K.selectedMonth)} - ${K.remainingMonths} months remaining`}
        </div>

        <div class="wizard-progress">
          ${VI(n,Lt)}
        </div>

        ${BI()}
      </div>
    </div>
  `,FI()}function BI(){if(K.isApril,K.isApril)switch(Lt){case 1:return hh();case 2:return fh();case 3:return ph();case 4:return mh();case 5:return gh();case 6:return yh();default:return""}else switch(Lt){case 1:return hh();case 2:return OI();case 3:return fh();case 4:return ph();case 5:return mh();case 6:return gh();case 7:return yh();default:return""}}function hh(){return`
    <div class="wizard-step">
      <div class="wizard-step-title">Tax Thresholds for ${K.taxYear}</div>
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
  `}function OI(){const n=Uc(K.selectedMonth),e=qI(K.selectedMonth);return`
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
  `}function fh(){const n=F.cpi!==void 0?F.cpi:K.defaults.cpi,e=(n*100).toFixed(1),t=K.suggestionBase??K.baseSalary,r=K.declineRate||0,i=Math.round(t*(1+n-r)),s=r>0,o=((n-r)*100).toFixed(1);return`
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
        ${s?`<p>Your plan uses <strong>declining spending</strong> (~${(r*100).toFixed(0)}%/yr real). Last year's salary rises with <span id="cpiDisplay">${e}</span>% CPI less that decline — a net <strong><span id="netUpliftDisplay">${o}</span>%</strong> — to:</p>`:`<p>Based on <span id="cpiDisplay">${e}</span>% inflation, your target salary should be:<span id="netUpliftDisplay" hidden>${o}</span></p>`}
        <p style="font-size: 24px; color: var(--primary); margin: 12px 0;">£<span id="suggestedSalaryDisplay">${i.toLocaleString()}</span></p>
        <p>per year (gross)</p>
      </div>

      <div class="wizard-step-desc" style="margin-top: 16px;">
        Confirm or adjust your target salary:
      </div>

      <div class="wizard-input">
        <span class="wizard-unit">£</span>
        <input type="number" id="wizSalary" value="${Math.round(F.confirmedSalary||i)}">
        <span class="wizard-unit">per year</span>
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="back">Back</button>
        <button class="wizard-btn primary" data-action="next">Next</button>
      </div>
    </div>
  `}function ph(){const n=K.statePension,e=n.isReceiving?`<span style="color: var(--success);">Receiving £${Math.round(n.amount).toLocaleString()}/year</span>`:`<span style="color: var(--text-muted);">${n.yearsUntil} years until state pension</span>`;return`
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
  `}function mh(){Os();const n=PI({targetAnnualGross:F.confirmedSalary,brl:F.brl,pa:F.pa,other:F.other,statePension:K.statePension.amount,remainingMonths:K.remainingMonths,grossIncomeToDate:F.grossIncomeToDate});return F._isaCalc=n,n.brlExhausted?`
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
        <p>To be tax-efficient for the remaining <strong>${K.remainingMonths} months</strong>, you need:</p>
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
  `}function gh(){Os();const n=F._isaCalc,e=CI(F.isaSavingsAllocation,(n==null?void 0:n.isaNeeded)||0,(n==null?void 0:n.brlExhausted)||!1);if(e.sufficient&&!e.isBrlExhausted)return F.isTaxEfficient=!0,F.taxEfficiencyChoice="efficient",setTimeout(()=>{Lt++,rs()},0),`
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
  `}function yh(){Os();const n=Tm({targetSalary:F.confirmedSalary,brl:F.brl,pa:F.pa,other:F.other,statePension:K.statePension.amount,isaSavingsAllocation:F.isaSavingsAllocation,remainingMonths:K.remainingMonths,grossIncomeToDate:F.grossIncomeToDate,isTaxEfficient:F.isTaxEfficient}),e=F.isTaxEfficient?"Tax-Efficient":"Tax-Inefficient",t=F.isTaxEfficient?"success":"warning",r=i=>`£${Math.round(i).toLocaleString()}`;return`
    <div class="wizard-step">
      <div class="wizard-step-title">Confirm Tax Year Setup</div>

      <div class="wizard-summary">
        <div class="wizard-summary-row">
          <span>Tax Year:</span>
          <span>${K.taxYear}</span>
        </div>
        <div class="wizard-summary-row">
          <span>Starting Month:</span>
          <span>${Uc(K.selectedMonth)}</span>
        </div>
        <div class="wizard-summary-row">
          <span>Remaining Months:</span>
          <span>${K.remainingMonths}</span>
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
  `}function VI(n,e){let t="";for(let r=1;r<=n;r++){const i=r<e?"done":r===e?"active":"";t+=`<div class="wizard-dot ${i}"></div>`}return t}function FI(){Nr.querySelectorAll("[data-action]").forEach(e=>{e.addEventListener("click",()=>$I(e.dataset.action))}),window._updateWizardSalary=function(){const e=document.getElementById("wizCPI"),t=document.getElementById("wizSalary"),r=document.getElementById("cpiDisplay"),i=document.getElementById("suggestedSalaryDisplay");if(e&&t&&r&&i){const s=parseFloat(e.value)||0,o=s/100,l=K.suggestionBase??K.baseSalary,c=K.declineRate||0,u=Math.round(l*(1+o-c));r.textContent=s.toFixed(1),i.textContent=u.toLocaleString();const f=document.getElementById("netUpliftDisplay");f&&(f.textContent=((o-c)*100).toFixed(1)),t.value=u,F.cpi=o,F.confirmedSalary=u}}}function $I(n){Os();const e=K.isApril?6:7;switch(n){case"cancel":Im(),gs&&gs({completed:!1,cancelled:!0});break;case"next":Lt<e&&(Lt++,rs());break;case"back":Lt>1&&(Lt--,rs());break;case"apply-choice":zI(),Lt++,rs();break;case"finish":UI();break}}function zI(){var e;const n=(e=document.querySelector('input[name="taxChoice"]:checked'))==null?void 0:e.value;switch(F.taxEfficiencyChoice=n,n){case"increase":F.isaSavingsAllocation=F._isaCalc.isaNeeded,F.isTaxEfficient=!0;break;case"reduced":F.confirmedSalary=F.brl,F.isaSavingsAllocation=0,F.isTaxEfficient=!0;break;case"inefficient":F.isaSavingsAllocation=0,F.isTaxEfficient=!1;break}}function Os(){const n=document.getElementById("wizPA");n&&(F.pa=parseFloat(n.value)||12570);const e=document.getElementById("wizBRL");e&&(F.brl=parseFloat(e.value)||50270);const t=document.getElementById("wizHRL");t&&(F.hrl=parseFloat(t.value)||125140);const r=document.getElementById("wizCPI");r&&(F.cpi=(parseFloat(r.value)||4)/100);const i=document.getElementById("wizSalary");i&&(F.confirmedSalary=parseFloat(i.value)||3e4);const s=document.getElementById("wizOther");s&&(F.other=parseFloat(s.value)||0);const o=document.getElementById("wizISA");o&&(F.isaSavingsAllocation=parseFloat(o.value)||0);const l=document.getElementById("wizIncomeToDate");l&&(F.grossIncomeToDate=parseFloat(l.value)||0)}async function UI(){Os();const n=Tm({targetSalary:F.confirmedSalary,brl:F.brl,pa:F.pa,other:F.other,statePension:K.statePension.amount,isaSavingsAllocation:F.isaSavingsAllocation,remainingMonths:K.remainingMonths,grossIncomeToDate:F.grossIncomeToDate,isTaxEfficient:F.isTaxEfficient}),e=DI({pa:F.pa,brl:F.brl,hrl:F.hrl,cpi:F.cpi,other:F.other,isaSavingsAllocation:F.isaSavingsAllocation,isTaxEfficient:F.isTaxEfficient,taxEfficiencyChoice:F.taxEfficiencyChoice,grossIncomeToDate:F.grossIncomeToDate,startMonth:parseInt(K.selectedMonth.split("-")[1]),confirmedSalary:F.confirmedSalary,remainingMonths:K.remainingMonths,statePension:K.statePension.amount,monthlyBreakdown:n});console.log(`Tax Year Wizard: Saving config for ${K.taxYear}`,e);try{await Gr(K.taxYear,e),console.log(`Tax Year Wizard: Successfully saved config for ${K.taxYear}`)}catch(t){console.error(`Tax Year Wizard: Failed to save config for ${K.taxYear}`,t),typeof window.showToast=="function"&&window.showToast(`Error saving tax year configuration: ${t.message}`,"error");return}Im(),gs&&gs({completed:!0,taxYear:K.taxYear,config:e,wizardInputs:F})}function Im(){Nr&&(Nr.innerHTML="",Nr.style.display="none")}function Uc(n){const[e,t]=n.split("-").map(Number);return new Date(e,t-1,1).toLocaleString("default",{month:"long",year:"numeric"})}function qI(n){const[e,t]=n.split("-").map(Number);return new Date(e,t-2,1).toLocaleString("default",{month:"long"})}function HI(){return`
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
  `}function YI(n={},e=null){const t=Bs(n,e),r=gm(t),i=vm(r);return{results:r,stats:i,config:t}}function jI(n={},e=null){const t=Bs(n,e),r=ym(t),i=vm(r);return{results:r,stats:i,config:t}}function WI(n={}){const e=Bs(n),t={};for(const[r,i]of Object.entries(Tg))t[r]={...i,result:fI(e,i)};return t}function qc(n){const e={[Se.SHARES]:0,[Se.BONDS]:0,[Se.DIVERSIFIERS]:0,[Se.CASH]:0},t={},r=[],i=[];let s=0,o=0;for(const l of n){const c=+l.value||0,u=l.subClass||(l.ticker?hm[l.ticker]:void 0),f=u?Wt[u]:null;if(!f){i.push({...l});continue}s+=c,(l.wrapper||"").toUpperCase()==="ISA"&&(o+=c),e[f.bucket]+=c,t[u]=(t[u]||0)+c,r.push({...l,subClass:u,bucket:f.bucket,label:f.label})}return{buckets:e,subClassTotals:t,bondWeights:vh(t,Se.BONDS),diversifierWeights:vh(t,Se.DIVERSIFIERS),total:s,isaTotal:o,tagged:r,untagged:i}}function vh(n,e){const t=Object.entries(n).filter(([s])=>Wt[s].bucket===e),r=t.reduce((s,[,o])=>s+o,0);if(r<=0)return{};const i={};for(const[s,o]of t)i[s]=o/r;return i}function GI(n){const e=n.buckets[Se.DIVERSIFIERS]||0,t={equityStart:n.buckets[Se.SHARES]||0,bondStart:n.buckets[Se.BONDS]||0,cashStart:n.buckets[Se.CASH]||0,isaBalance:n.isaTotal||0};return e>0&&(t.diversifierStart=e,t.subAsset={}),Object.keys(n.bondWeights).length&&(t.subAsset=t.subAsset||{},t.subAsset.bondWeights=n.bondWeights),Object.keys(n.diversifierWeights).length&&(t.subAsset=t.subAsset||{},t.subAsset.diversifierWeights=n.diversifierWeights),t}const KI=Object.freeze([{ticker:"UKW",value:1e5,wrapper:"SIPP",name:"Greencoat UK Wind"},{ticker:"HICL",value:11e4,wrapper:"SIPP",name:"HICL Infrastructure"},{ticker:"SEQI",value:9e4,wrapper:"SIPP",name:"Sequoia Economic Infrastructure"},{ticker:"CTY",value:125e3,wrapper:"SIPP",name:"City of London Investment Trust"},{ticker:"MYI",value:125e3,wrapper:"SIPP",name:"Murray International Trust"},{ticker:"LWDB",value:11e4,wrapper:"SIPP",name:"Law Debenture Corporation"},{ticker:"IGLS",value:6e4,wrapper:"ISA",name:"iShares UK Gilts 0-5yr (ISA bridge)"},{ticker:"IGLS",value:85e3,wrapper:"SIPP",name:"iShares UK Gilts 0-5yr (buffer)"},{ticker:"CGT",value:9e4,wrapper:"SIPP",name:"Capital Gearing Trust"},{ticker:"SGLN",value:85e3,wrapper:"SIPP",name:"iShares Physical Gold"},{ticker:"IBTM",value:8e4,wrapper:"SIPP",name:"iShares $ Treasury 7-10yr"},{ticker:"TI5G",value:7e4,wrapper:"SIPP",name:"iShares $ TIPS 0-5 (GBP-hedged)"},{ticker:"BHMG",value:7e4,wrapper:"SIPP",name:"BH Macro"},{ticker:"PACW",value:1e5,wrapper:"SIPP",name:"Amundi Prime All Country World"}]);function Sm(n){return zo(Dl(n))}function QI(n){const[e,t]=n.split("-").map(Number);return Math.max(0,(t>=4?e:e-1)-2026)}async function JI(n,e,t,r,i){var Ci,Er,Mi,Gn;const s=i.settings,o=i.history,l=i.allTaxYears,c=Sm(n),u=QI(n),[f,m]=n.split("-").map(Number);if(!l[c])throw new Error(`Tax year ${c} is not configured. Please add it in the Settings tab before calculating.`);const p=l[c],y=p.pa||12570,I=p.brl||50270,S=p.hrl||125140,x=p.other||0,k=p.isTaxEfficient!==!1,C=p.isaSavingsAllocation||0,N=p.grossIncomeToDate||0,B=p.confirmedSalary||s.baseSalary,$=o.find(X=>X.date===n),q=($==null?void 0:$.isa)||0,T=Math.max(0,(p.isaSavingsUsed||0)-q),_=i.spInfo.amount||0;let b=1;for(let X=0;X<u;X++){const ue=String((26+X)%100).padStart(2,"0")+"/"+String((27+X)%100).padStart(2,"0"),Ve=(l[ue]||{}).cpi||Rg;b*=1+Ve}let E=Rn(s.equityMin,u,s.duration,b,!0),A=Rn(s.bondMin,u,s.duration,b,!0);const w=Math.round(Rn(s.cashTarget,u,s.duration,b,!1)),le=Uo(s.equityGlide,u,s.duration);if(le!=null){const X=E+A;E=X*le,A=X*(1-le)}E=Math.round(E),A=Math.round(A);const pe=e+t,H=E+A;let ee=0;const ne=o.filter(X=>X.date<n);for(let X=ne.length-1;X>=0&&ne[X].source==="Cash";X--)ee++;const te=um({totalGrowth:pe,minGrowth:H,consecCashDraws:ee,wasInProtection:ne.length>0&&ne[ne.length-1].inProtection,consecutiveLimit:s.consecutiveLimit||3,recoveryBuffer:s.recoveryBuffer||1e4}),Ce=m>=4?16-m:4-m,ke=Math.max(1,Ce),ye=B*b,O=x+_;ar(ye,y,I,S);let Z,be,se,ce=0,Te=0,Yn=!1,lt=0;const Kt=Math.max(0,C-T)/ke;if(k){const X=O/12;o.filter(Be=>Be.taxYear===c&&Be.date<n);const ue=ye/12,Ve=i.isaBalance||0;let ze,ht;if(Ve>0){const Be=Ll({targetGross:ye,fixedIncome:O,pa:y,brl:I,hrl:S,isaBalance:Ve,strategy:s.isaDrawdownStrategy||"minimiseEarlyTax",yearsUntilSp:0});ze=Be.sippGross/12,ht=Be.isaDraw/12}else{if(((Er=(Ci=p.expectedMonthly)==null?void 0:Ci.sipp)==null?void 0:Er.gross)>0)ze=p.expectedMonthly.sipp.gross;else{const Ie=Math.max(0,I-N-O)/12;ze=Math.min(ue-X,Ie)}const Be=ar(ye,y,I,S)/12,Ut=Math.min(ye,I),ve=ar(Ut,y,I,S)/12,He=Math.max(0,Be-ve);ht=Math.min(He,Kt)}if(lt=ht,ce=ze,te){const Be=(s.protectionFactor||20)/100;Z=ze*(1-Be),be=ht,se="Protection"}else{Z=ze,be=ht,se="Tax-Efficient";const Be=m>=4?f:f-1,Ut=ne.filter(Ie=>{const[Kn,Tr]=Ie.date.split("-").map(Number);return(Tr>=4?Kn:Kn-1)===Be});let ve=0,He=0;Ut.forEach(Ie=>{He+=Ie.sipp||0,Ie.inProtection&&Ie.stdSipp&&(ve+=Ie.stdSipp-Ie.sipp),Ie.boostAmount>0&&(ve-=Ie.boostAmount)});const ft=He+Z*ke+O;Te=dm({shortfall:ve,standardMonthly:ze,remainingMonths:ke,surplus:pe-H-No.SURPLUS_BUFFER,brlHeadroom:I-ft}),Te>50&&(Z+=Te,se="Tax Boost")}}else{const X=ye/12,ue=O/12;let Ve;if(((Gn=(Mi=p.expectedMonthly)==null?void 0:Mi.sipp)==null?void 0:Gn.gross)>0?Ve=p.expectedMonthly.sipp.gross:Ve=Math.max(0,X-ue),ce=Ve,be=0,te){const ze=(s.protectionFactor||20)/100;Z=Ve*(1-ze),se="Protection";const ht=m>=4?f:f-1,Be=ne.filter(He=>{const[ft,Ie]=He.date.split("-").map(Number);return(Ie>=4?ft:ft-1)===ht});let Ut=0;Be.forEach(He=>{Ut+=He.sipp||0});const ve=Ut+Z*ke+O;if(ve<I){const ft=(I-ve)/ke,Ie=pe-H-(s.recoveryBuffer||1e4);Ie>0&&ft>50&&(Te=Math.min(ft,Ie/ke),Te>50&&(Z+=Te,Yn=!0,se="Protection-Induced Efficiency"))}}else{Z=Ve,se="Tax-Inefficient";const ze=m>=4?f:f-1,ht=ne.filter(ve=>{const[He,ft]=ve.date.split("-").map(Number);return(ft>=4?He:He-1)===ze});let Be=0,Ut=0;if(ht.forEach(ve=>{Ut+=ve.sipp||0,ve.inProtection&&ve.stdSipp&&(Be+=ve.stdSipp-ve.sipp),ve.boostAmount>0&&(Be-=ve.boostAmount)}),Be>0){const ve=Ut+Z*ke+O,He=I-ve,ft=pe-H-(s.recoveryBuffer||1e4);if(He>0&&ft>0){const Ie=He/ke,Kn=Be/ke,Tr=ft/ke;Te=Math.min(Kn,Ie,Tr),Te>50&&(Z+=Te,se="Tax Boost")}}}}const Pt=i.diversifier||0;let Xe,ut,pn=0,mn=0,Qt=0,gn=0,Ft="";if(!te&&pe>=H+Z){Xe="Growth";const X=Math.max(0,e-E),ue=Math.max(0,t-A),Ve=X+ue;Ve>0?(pn=Z*X/Ve,mn=Z*ue/Ve,ut="Healthy"):(Xe="Cash",Qt=Z,ut="At min")}else if(Xe="Cash",ut=te?"Protection":"Below min",Pt>0){Qt=Math.min(r,Z);let X=Z-Qt;X>0&&(gn=Math.min(Pt,X),X-=gn,Xe=Qt>0?"Cash + Diversifier":"Diversifier"),X>0&&(Ft="Cash low!")}else Qt=Z,r<Z&&(Ft="Cash low!");let yt="";const jn=e-E,Jt=t-A;if(jn>5e3&&Jt<-5e3){const X=Math.floor(Math.min(jn,-Jt)/1e3)*1e3;X>=5e3&&(yt=`Move £${X.toLocaleString()} Equity→Bond`)}else if(Jt>5e3&&jn<-5e3){const X=Math.floor(Math.min(Jt,-jn)/1e3)*1e3;X>=5e3&&(yt=`Move £${X.toLocaleString()} Bond→Equity`)}let $t="";const yn=w-r;if(yn>5e3&&Xe==="Growth"&&!te){const X=pe-H-Z;if(X>1e4){const ue=Math.floor(Math.min(yn*.3,X*.5)/1e3)*1e3;ue>=5e3&&($t=`Replenish Cash: Move £${ue.toLocaleString()} from growth funds`)}}const _e=[];Ft&&_e.push({message:Ft,severity:"danger",type:"low-cash"}),Te>50&&_e.push({message:`Tax Boost: +£${Math.round(Te).toLocaleString()}/mo catch-up from protection shortfall`,severity:"success",type:"tax-boost"}),yt&&_e.push({message:yt,severity:"warning",type:"rebalance"}),$t&&_e.push({message:$t,severity:"info",type:"cash-replenish"});const fe=m>=4?f:f-1,Xt=ne.filter(X=>{const[ue,Ve]=X.date.split("-").map(Number);return(Ve>=4?ue:ue-1)===fe}),Zt=Xt.reduce((X,ue)=>X+(ue.sipp||0),0),Wn=Xt.length+1,vn=Math.max(0,12-Wn)*ce,en=Zt+Z+vn+x+_,Ze=Ja(en,y,I,S),vt=Ze/12,St=Z+x/12+_/12-vt+be,Ct=vt*Wn,zt=Ze,dt=ye/12,Pi=Ja(dt*12,y,I,S),_r=Math.max(0,Pi/12-Ze/12),bn=T+lt;return{date:n,taxYear:c,yearNumber:u,remainingMonths:ke,equity:e,bond:t,cash:r,isa:0,adjEquityMin:E,adjBondMin:A,adjCashTarget:w,pa:y,brl:I,other:x/12,statePension:_/12,sippDraw:Z,stdSipp:ce,isaDraw:be,totalMonthlyNet:St,isTaxEfficientYear:k,yearlyIsaSavingsAllocation:C,cumulativeIsaSavingsUsed:bn,isaSavingsUsedThisMonth:lt,taxPaidYTD:Ct,taxProjectedAnnual:zt,taxSavedMonthly:_r,taxSavedYTD:_r*Wn,taxSavedProjectedAnnual:_r*12,taxEfficient:k&&!Yn,inProtection:te,protectionReason:te?ut:null,consecutiveCashDraws:ee,protectionInducedTaxEfficiency:Yn,boostAmount:Te>50?Te:0,boostEligible:Te>50,source:Xe,drawFromEquity:pn,drawFromBond:mn,drawFromCash:Qt,...Pt>0?{drawFromDiversifier:gn,diversifier:Pt}:{},rebalanceNeeded:yt!=="",rebalanceActions:yt?[yt]:[],alerts:_e,calculationDetails:{mode:se,reason:`${ut} | ${se}`,totalGrowth:pe,minGrowth:H,consec:ee,stdSipp:Z,inputs:{baseSalary:s.baseSalary,confirmedSalary:B,targetGross:ye,cumInf:b,yearNum:u,taxYear:c,OTHER:x,STATE:_,PA:y,BRL:I,isTaxEfficientYear:k,yearlyIsaSavingsAllocation:C,grossIncomeToDate:N},taxInfo:{annualTaxable:en,headroomToBRL:I-en,annualTax:Ze,monthlyNet:St}}}}let ys=null;function XI(n,e){ys=n,ZI(e)}function ZI({onGetStarted:n,onSignIn:e}){ys&&(ys.innerHTML=`
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

        <div class="landing-footer">
          <p><a href="privacy.html" target="_blank" rel="noopener">Privacy Policy</a> &middot; Usefulish Ltd</p>
        </div>

      </div>
    </div>
  `,document.getElementById("landingGetStarted").addEventListener("click",n),document.getElementById("landingSignIn").addEventListener("click",e))}function vs(){ys&&(ys.style.display="none")}function eS(){return`
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
  `}let Ke=null,is=null,ir=!1;function tS(n,e){console.log("initAuthScreen: initializing"),Ke=n,is=e,ir=!1,QE(t=>{if(console.log("AuthScreen: auth state change received:",t?t.email:"null","processed:",ir),t&&!t.emailVerified){aS(t);return}t&&is&&!ir?(console.log("AuthScreen: calling onAuthSuccessCallback"),ir=!0,Am(),is(t)):t?console.log("AuthScreen: skipping callback, already processed or no callback"):(ir=!1,console.log("AuthScreen: user signed out, reset authProcessed"))}),Hc(),console.log("initAuthScreen: complete")}function Hc(){if(Ke){if(!Ne()){Ke.innerHTML=`
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
    `;return}Ke.innerHTML=`
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
  `,nS()}}function nS(){const n=Ke.querySelectorAll(".auth-screen-tab");n.forEach(s=>{s.addEventListener("click",()=>{n.forEach(c=>c.classList.remove("active")),s.classList.add("active");const o=document.getElementById("signinForm"),l=document.getElementById("signupForm");s.dataset.tab==="signin"?(o.style.display="block",l.style.display="none"):(o.style.display="none",l.style.display="block"),qr()})}),document.getElementById("signinForm").addEventListener("submit",rS),document.getElementById("signupForm").addEventListener("submit",iS),document.getElementById("forgotPasswordBtn").addEventListener("click",sS),document.getElementById("googleSigninBtn").addEventListener("click",oS)}function Gt(n){const e=document.getElementById("authScreenError");e&&(e.textContent=n,e.style.display="block")}function qr(){const n=document.getElementById("authScreenError");n&&(n.style.display="none")}async function rS(n){n.preventDefault(),qr();const e=document.getElementById("signinEmail").value.trim(),t=document.getElementById("signinPassword").value;if(!e||!t){Gt("Please enter email and password");return}try{await eT(e,t)}catch(r){console.error("Sign in error:",r),Gt(va(r.code))}}async function iS(n){n.preventDefault(),qr();const e=document.getElementById("signupName").value.trim(),t=document.getElementById("signupEmail").value.trim(),r=document.getElementById("signupPassword").value;if(!e||!t||!r){Gt("Please fill in all fields");return}if(r.length<6){Gt("Password must be at least 6 characters");return}try{await JE(t,r,e)}catch(i){console.error("Sign up error:",i),Gt(va(i.code))}}async function sS(){qr();const n=document.getElementById("signinEmail").value.trim();if(!n){Gt("Please enter your email address first");return}try{await nT(n),typeof window.showToast=="function"&&window.showToast("Password reset email sent. Check your inbox.","success",5e3)}catch(e){console.error("Reset password error:",e),Gt(va(e.code))}}async function oS(){qr();try{await tT()}catch(n){console.error("Google sign in error:",n),Gt(va(n.code))}}function va(n){return{"auth/invalid-email":"Invalid email address","auth/user-disabled":"This account has been disabled","auth/user-not-found":"No account found with this email","auth/wrong-password":"Incorrect password","auth/email-already-in-use":"An account already exists with this email","auth/weak-password":"Password is too weak","auth/operation-not-allowed":"Sign in method not enabled","auth/popup-closed-by-user":"Sign in cancelled","auth/popup-blocked":"Sign in popup was blocked","auth/too-many-requests":"Too many attempts. Please try again later.","auth/invalid-credential":"Invalid email or password"}[n]||"An error occurred. Please try again."}function aS(n){Ke&&(Ke.style.display="block",Ke.innerHTML=`
    <div class="auth-screen">
      <div class="auth-screen-box" style="text-align: center;">
        <div class="auth-screen-header">
          <h1>Verify your email</h1>
          <p>We've sent a verification link to <strong>${n.email}</strong>.<br>
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
  `,document.getElementById("verifiedContinueBtn").addEventListener("click",async()=>{qr();try{const e=await ZE();e&&e.emailVerified?is&&!ir&&(ir=!0,Am(),is(e)):Gt("Not verified yet. Click the link in the email first (check spam), then try again.")}catch(e){console.error("Verification check error:",e),Gt("Could not check verification status. Please try again.")}}),document.getElementById("resendVerificationBtn").addEventListener("click",async()=>{qr();try{await XE(),typeof window.showToast=="function"&&window.showToast("Verification email sent. Check your inbox.","success",5e3)}catch(e){console.error("Resend verification error:",e),Gt(e.code==="auth/too-many-requests"?"Too many attempts. Please wait a few minutes and try again.":"Could not send the email. Please try again.")}}),document.getElementById("verifySignOutBtn").addEventListener("click",async()=>{try{await Rc(),Hc()}catch(e){console.error("Sign out error:",e)}}))}function Am(){Ke&&(Ke.innerHTML=`
      <div class="auth-screen">
        <div class="auth-screen-box" style="text-align: center;">
          <div class="auth-screen-header">
            <h1>Pension Planner</h1>
            <p>Signing in...</p>
          </div>
        </div>
      </div>
    `)}function xm(){console.log("hideAuthScreen: hiding auth screen, element=",!!Ke),Ke&&(Ke.style.display="none",console.log("hideAuthScreen: set display to none"))}function lS(){ir=!1,Ke&&(Ke.style.display="block",Hc())}function Bo(n="signin"){lS(),Ke.querySelectorAll(".auth-screen-tab").forEach(s=>s.classList.remove("active"));const t=Ke.querySelector(`.auth-screen-tab[data-tab="${n}"]`);t&&t.classList.add("active");const r=document.getElementById("signinForm"),i=document.getElementById("signupForm");r&&i&&(r.style.display=n==="signin"?"block":"none",i.style.display=n==="signup"?"block":"none")}function cS(){return`
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
  `}let ws=null;function uS(n,e,t){ws=n,dS(e,t)}function dS(n,e){if(!ws)return;const t=n||"there";ws.innerHTML=`
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
  `,document.getElementById("onboardingStartWizard").addEventListener("click",e)}function wa(){ws&&(ws.style.display="none")}function hS(){return`
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
  `}let Vn=null,Oo=null,D={scenarioName:"My plan",scenarioDescription:"",enabledTools:["stress","decision"],household:"single",currentAge:"",retirementAge:"",retired:!1,partnerAge:"",partnerRetirementAge:"",partnerRetired:!1,startAt:"budget",introDone:!1,baseSalary:3e4,otherIncome:0,spStartDate:"",spWeeklyAmount:0,equityMin:25e4,bondMin:2e5,cashTarget:5e4,isaBalance:0,duration:35,taxMode:"inflates",decisionSalary:3e4,decisionEquity:25e4,decisionBond:2e5,decisionCash:5e4,decisionIsaBalance:0,decisionDuration:35},pt="scenario",Ae=1;function Rm(){pt="scenario",Ae=1,D={scenarioName:"My plan",scenarioDescription:"",enabledTools:["stress","decision"],household:"single",currentAge:"",retirementAge:"",retired:!1,partnerAge:"",partnerRetirementAge:"",partnerRetired:!1,startAt:"budget",introDone:!1,baseSalary:3e4,otherIncome:0,spStartDate:"",spWeeklyAmount:0,equityMin:25e4,bondMin:2e5,cashTarget:5e4,isaBalance:0,duration:35,taxMode:"inflates",decisionSalary:3e4,decisionEquity:25e4,decisionBond:2e5,decisionCash:5e4,decisionIsaBalance:0,decisionDuration:35}}function km(n,e){Vn=n,Oo=e,Rm(),Mt()}function Mt(){Vn&&(pt==="scenario"?fS():pt==="stress"?gS():pt==="decision"&&vS())}function fS(){Vn.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Welcome to Pension Planner</div>
        <div class="wizard-subtitle">Let's create your first plan</div>

        <div class="wizard-progress">
          ${Yc(2,Ae)}
        </div>

        ${Ae===1?pS():mS()}
      </div>
    </div>
  `,jc()}function pS(){const n=D.household==="couple";return`
    <div class="wizard-step">
      <div class="wizard-step-title">Let's create your plan</div>
      <div class="wizard-step-desc">
        Just a few basics to start — no money questions yet. You'll add your spending, pots and other
        details in the tools themselves, only when you need them.
      </div>

      <div class="wizard-input" style="margin-bottom: 16px;">
        <label style="display:block; font-size:13px; margin-bottom:4px;">Plan name</label>
        <input type="text" id="wizScenarioName" value="${D.scenarioName}" placeholder="e.g. My plan" style="max-width: 320px;">
      </div>

      <div style="margin-bottom: 16px;">
        <label style="display:block; font-size:13px; margin-bottom:6px;">Who's this plan for?</label>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <label class="wizard-tool-option" style="flex:0 0 auto; padding:8px 14px; cursor:pointer;">
            <input type="radio" name="wizHousehold" value="single" ${n?"":"checked"} onchange="document.getElementById('wizPartnerBlock').style.display='none'"> Just me
          </label>
          <label class="wizard-tool-option" style="flex:0 0 auto; padding:8px 14px; cursor:pointer;">
            <input type="radio" name="wizHousehold" value="couple" ${n?"checked":""} onchange="document.getElementById('wizPartnerBlock').style.display='block'"> Me and a partner
          </label>
        </div>
      </div>

      ${wh("You","wiz",D.currentAge,D.retirementAge,D.retired)}
      <div id="wizPartnerBlock" style="display:${n?"block":"none"};">
        ${wh("Your partner","wizPartner",D.partnerAge,D.partnerRetirementAge,D.partnerRetired)}
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="skip-all">Skip</button>
        <button class="wizard-btn primary" data-action="to-router">Next</button>
      </div>
    </div>
  `}function wh(n,e,t,r,i){const s=i?"Age you retired":"Target retirement age",o=e+"CurrentAge",l=e+"RetireAge",c=e+"Retired";return`
    <div style="border:1px solid var(--border); border-radius:10px; padding:12px 14px; margin-bottom:12px;">
      <strong style="font-size:14px;">${n}</strong>
      <div style="display:flex; gap:14px; flex-wrap:wrap; align-items:flex-end; margin-top:8px;">
        <div class="wizard-input" style="flex:0 0 auto;">
          <label style="display:block; font-size:13px; margin-bottom:4px;">Age today</label>
          <input type="number" id="${o}" value="${t||""}" placeholder="e.g. 52" style="max-width:110px;">
        </div>
        <div class="wizard-input" style="flex:0 0 auto;">
          <label id="${l}Label" style="display:block; font-size:13px; margin-bottom:4px;">${s}</label>
          <input type="number" id="${l}" value="${r||""}" placeholder="e.g. 60" style="max-width:150px;">
        </div>
        <label style="flex:0 0 auto; display:flex; align-items:center; gap:6px; font-size:13px; padding-bottom:8px; cursor:pointer;">
          <input type="checkbox" id="${c}" ${i?"checked":""} style="width:auto;"
            onchange="document.getElementById('${l}Label').textContent = this.checked ? 'Age you retired' : 'Target retirement age'">
          Already retired
        </label>
      </div>
    </div>
  `}function mS(){return`
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
  `}function gS(){Vn.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Stress Tester Setup</div>
        <div class="wizard-subtitle">Let's set up your pension simulation in a few simple steps.</div>

        <div class="wizard-progress">
          ${Yc(6,Ae)}
        </div>

        ${yS(Ae)}
      </div>
    </div>
  `,jc()}function yS(n){switch(n){case 1:return`
        <div class="wizard-step">
          <div class="wizard-step-title">How much money do you want each year?</div>
          <div class="wizard-step-desc">
            Think of this as your "salary" in retirement. This is the total amount before tax that you want to receive each year.
          </div>

          <div class="wizard-input">
            <span class="wizard-unit">£</span>
            <input type="number" id="wizBaseSalary" value="${D.baseSalary}">
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
            <input type="number" id="wizOther" value="${D.otherIncome}">
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
                <input type="text" id="wizSpStartDate" value="${D.spStartDate}" placeholder="e.g. 6 May 2040" style="width: 100%;">
              </div>
            </div>
            <div class="wizard-grid-item">
              <label>Weekly Amount (from HMRC)</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizSpWeeklyAmount" value="${D.spWeeklyAmount||""}" step="0.01" placeholder="e.g. 221.20">
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
              <label>Total Pot (£)</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizPot" oninput="updateAllocDisplay('wiz')">
              </div>
            </div>
            <div class="wizard-grid-item">
              <label>ISA Balance (Tax-Free)</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizIsaBalance" min="0" value="${D.isaBalance}">
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
            <input type="number" id="wizDuration" value="${D.duration}" style="max-width: 100px;">
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
              <option value="inflates" ${D.taxMode==="inflates"?"selected":""}>Standard (rise with inflation)</option>
              <option value="frozen" ${D.taxMode==="frozen"?"selected":""}>Frozen (stay at current levels)</option>
            </select>
          </div>

          <div class="wizard-example">
            <strong>Tip:</strong> "Frozen" is more pessimistic - you pay more tax over time as your income grows but thresholds don't.
          </div>

          <div class="wizard-buttons">
            <button class="wizard-btn secondary" data-action="back">Back</button>
            <button class="wizard-btn primary" data-action="finish-stress">${D.enabledTools.includes("decision")?"Continue to Decision Tool":"Finish Setup"}</button>
          </div>
        </div>
      `;default:return""}}function vS(){Vn.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Decision Tool Setup</div>
        <div class="wizard-subtitle">Now let's set up the tool you'll use each month once you're retired.</div>

        <div class="wizard-progress">
          ${Yc(4,Ae)}
        </div>

        ${wS(Ae)}
      </div>
    </div>
  `,jc()}function wS(n){switch(n){case 1:return`
        <div class="wizard-step">
          <div class="wizard-step-title">How much money do you want each year?</div>
          <div class="wizard-step-desc">
            This is your target "salary" from your pension. The tool will calculate how much to withdraw each month.
          </div>

          <div class="wizard-input">
            <span class="wizard-unit">£</span>
            <input type="number" id="wizDBaseSalary" value="${D.decisionSalary}">
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
              <label>Total Pot (£)</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizDPot" oninput="updateAllocDisplay('wizD')">
              </div>
            </div>
            <div class="wizard-grid-item">
              <label>ISA Balance (Tax-Free)</label>
              <div class="wizard-input">
                <span class="wizard-unit">£</span>
                <input type="number" id="wizDIsaBalance" min="0" value="${D.decisionIsaBalance}">
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
            <input type="number" id="wizDDuration" value="${D.decisionDuration}" style="max-width: 100px;">
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
      `;default:return""}}function Yc(n,e){let t="";for(let r=1;r<=n;r++){const i=r<e?"done":r===e?"active":"";t+=`<div class="wizard-dot ${i}"></div>`}return t}function jc(){if(Vn.querySelectorAll("[data-action]").forEach(e=>{e.addEventListener("click",()=>bS(e.dataset.action))}),document.getElementById("wizRisks")&&typeof window.writeAlloc=="function"){window.writeAlloc("wiz",D.equityMin,D.bondMin,D.cashTarget);const e=document.getElementById("wizEquityGlide");e&&(e.checked=!!D.equityGlideEnabled,window.updateAllocDisplay("wiz"))}if(document.getElementById("wizDRisks")&&typeof window.writeAlloc=="function"){window.writeAlloc("wizD",D.decisionEquity,D.decisionBond,D.decisionCash);const e=document.getElementById("wizDEquityGlide");e&&(e.checked=!!D.decisionEquityGlideEnabled,window.updateAllocDisplay("wizD"))}}function bS(n){switch(Pm(),n){case"skip-all":D.startAt="budget",Cr();break;case"to-router":{const e=parseInt(D.currentAge),t=parseInt(D.retirementAge),r=i=>{typeof window.showToast=="function"&&window.showToast(i,"error")};if(!t||t<40||t>95){r(D.retired?"Please enter the age you retired":"Please enter a target retirement age");return}if(e&&t>e&&D.retired){r("You ticked 'already retired' but the age is in the future — untick it, or lower the age.");return}if(e&&t<e&&!D.retired){r("That retirement age is in the past — tick 'already retired' if you've already retired.");return}Ae=2,Mt();break}case"start-budget":case"start-stress":case"start-decision":D.startAt=n.replace("start-",""),Cr();break;case"next":{const e=ga(D.spStartDate);if(!e.valid){typeof window.showToast=="function"&&window.showToast(e.error,"error");return}pt==="scenario"?Ae<2&&(Ae++,Mt()):pt==="stress"?Ae<6&&(Ae++,Mt()):pt==="decision"&&Ae<4&&(Ae++,Mt());break}case"back":(pt==="scenario"&&Ae>1||pt==="stress"&&Ae>1||pt==="decision"&&Ae>1)&&(Ae--,Mt());break;case"start-tools":if(!D.enabledTools||D.enabledTools.length===0){typeof window.showToast=="function"&&window.showToast("Please select at least one tool","error");return}Ka("scenario");break;case"skip-stress":Ka("stress");break;case"finish-stress":D.decisionSalary=D.baseSalary,D.decisionEquity=D.equityMin,D.decisionBond=D.bondMin,D.decisionCash=D.cashTarget,D.decisionIsaBalance=D.isaBalance,D.decisionDuration=D.duration,D.decisionEquityGlideEnabled=D.equityGlideEnabled,Ka("stress");break;case"skip-decision":Cr();break;case"finish":Cr();break}}function Ka(n){const e=D.enabledTools.includes("stress"),t=D.enabledTools.includes("decision");n==="scenario"?e?(pt="stress",Ae=1,Mt()):t?(pt="decision",Ae=1,Mt()):Cr():n==="stress"&&t?(pt="decision",Ae=1,Mt()):Cr()}function Pm(){const n=document.getElementById("wizScenarioName");n&&(D.scenarioName=n.value.trim()||"My Plan");const e=document.getElementById("wizScenarioDesc");e&&(D.scenarioDescription=e.value.trim()||"");const t=document.querySelector('input[name="wizHousehold"]:checked');t&&(D.household=t.value);const r=document.getElementById("wizCurrentAge");r&&(D.currentAge=parseInt(r.value)||"");const i=document.getElementById("wizRetireAge");i&&(D.retirementAge=parseInt(i.value)||"");const s=document.getElementById("wizRetired");s&&(D.retired=s.checked);const o=document.getElementById("wizPartnerCurrentAge");o&&(D.partnerAge=parseInt(o.value)||"");const l=document.getElementById("wizPartnerRetireAge");l&&(D.partnerRetirementAge=parseInt(l.value)||"");const c=document.getElementById("wizPartnerRetired");c&&(D.partnerRetired=c.checked);const u=document.getElementById("wizToolStress"),f=document.getElementById("wizToolDecision");if(u!==null||f!==null){const T=[];u&&u.checked&&T.push("stress"),f&&f.checked&&T.push("decision"),D.enabledTools=T}const m=document.getElementById("wizBaseSalary");m&&(D.baseSalary=parseFloat(m.value)||3e4);const p=document.getElementById("wizOther");p&&(D.otherIncome=parseFloat(p.value)||0);const y=document.getElementById("wizSpStartDate");y&&(D.spStartDate=y.value.trim()||"");const I=document.getElementById("wizSpWeeklyAmount");if(I&&(D.spWeeklyAmount=parseFloat(I.value)||0),document.getElementById("wizPot")&&typeof window.readAlloc=="function"){const T=window.readAlloc("wiz");D.equityMin=T.equityMin,D.bondMin=T.bondMin,D.cashTarget=T.cashTarget}const S=document.getElementById("wizEquityGlide");S&&(D.equityGlideEnabled=S.checked);const x=document.getElementById("wizIsaBalance");x&&(D.isaBalance=parseFloat(x.value)||0);const k=document.getElementById("wizDuration");k&&(D.duration=parseInt(k.value)||35);const C=document.getElementById("wizTaxMode");C&&(D.taxMode=C.value);const N=document.getElementById("wizDBaseSalary");if(N&&(D.decisionSalary=parseFloat(N.value)||3e4),document.getElementById("wizDPot")&&typeof window.readAlloc=="function"){const T=window.readAlloc("wizD");D.decisionEquity=T.equityMin,D.decisionBond=T.bondMin,D.decisionCash=T.cashTarget}const B=document.getElementById("wizDEquityGlide");B&&(D.decisionEquityGlideEnabled=B.checked);const $=document.getElementById("wizDIsaBalance");$&&(D.decisionIsaBalance=parseFloat($.value)||0);const q=document.getElementById("wizDDuration");q&&(D.decisionDuration=parseInt(q.value)||35)}function Cr(){Pm(),Oo&&Oo(D)}function ba(){Vn&&(Vn.style.display="none")}function _S(n,e,t,r){if(Vn=n,Oo=t,Rm(),D.enabledTools=e,r&&(e.includes("stress")&&r.source==="decision"&&(D.baseSalary=r.baseSalary||3e4,D.equityMin=r.equityMin||25e4,D.bondMin=r.bondMin||2e5,D.cashTarget=r.cashTarget||5e4,D.isaBalance=r.isaBalance||0,D.duration=r.duration||35,D.spStartDate=r.spStartDate||"",D.spWeeklyAmount=r.spWeeklyAmount||0),e.includes("decision")&&r.source==="stress"&&(D.decisionSalary=r.baseSalary||3e4,D.decisionEquity=r.equityMin||25e4,D.decisionBond=r.bondMin||2e5,D.decisionCash=r.cashTarget||5e4,D.decisionIsaBalance=r.isaBalance||0,D.decisionDuration=r.duration||35)),e.includes("stress"))pt="stress";else if(e.includes("decision"))pt="decision";else{t&&t(D);return}Ae=1,Mt()}function ES(){return`
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
  `}function TS(){const e=getComputedStyle(document.documentElement).getPropertyValue("--bg").trim()==="#0d1117"||document.documentElement.classList.contains("dark")||window.matchMedia("(prefers-color-scheme: dark)").matches;return{primary:"#f0c674",success:"#2ea043",warning:"#e1b12c",danger:"#f85149",muted:"#8b8b9b",grid:"rgba(255,255,255,0.1)",bg:e?"rgba(15,15,26,1)":"#ffffff",text:e?"#c9d1d9":"#1f2937",cardBg:e?"#21262d":"#ffffff",cone:"rgba(240,198,116,0.15)",coneMid:"rgba(240,198,116,0.2)",coneInner:"rgba(240,198,116,0.35)",coneBorder:"rgba(240,198,116,0.4)",trajectory:"rgba(46,160,67,0.25)",trajectoryFailed:"rgba(248,81,73,0.8)",trajectoryHover:"#5fdd7b",trajectoryFailedHover:"#ff6b6b",glidepath:"#7eb8da",zeroLine:"#f85149"}}function IS(n,e,t={}){const r=TS(),i=n.getContext("2d"),{width:s,height:o}=n,l={top:50,right:180,bottom:60,left:80},c=s-l.left-l.right,u=o-l.top-l.bottom;i.fillStyle=r.bg,i.fillRect(0,0,s,o);const f=Object.keys(e),m=t.years||35;let p=0;f.forEach(x=>{const k=e[x].result;k&&k.hist&&k.hist.forEach(C=>{C.total>p&&(p=C.total)})}),p*=1.1;const y=x=>l.left+x/m*c,I=x=>l.top+u-x/p*u;SS(i,l,c,u,m,p,t.title||"Scenario Comparison",r);const S=["#6366f1","#22c55e","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#ec4899","#84cc16"];f.forEach((x,k)=>{const C=e[x].result;if(!C||!C.hist)return;i.beginPath(),i.strokeStyle=S[k%S.length],i.lineWidth=2.5,C.hist.forEach((B,$)=>{const q=y(B.year),T=I(B.total);$===0?i.moveTo(q,T):i.lineTo(q,T)}),i.stroke();const N=l.top+15+k*24;i.fillStyle=S[k%S.length],i.fillRect(s-l.right+15,N,20,4),i.font="11px system-ui, sans-serif",i.fillStyle=r.text,i.textAlign="left",i.fillText(e[x].name||x,s-l.right+40,N+5),C.final/1e3,i.fillStyle=r.muted,i.fillText(`${Cm(C.final)}`,s-l.right+40,N+18)})}function SS(n,e,t,r,i,s,o,l){n.font="bold 14px system-ui, sans-serif",n.fillStyle=l.text,n.textAlign="center",n.fillText(o,e.left+t/2,e.top-20),n.strokeStyle=l.grid,n.lineWidth=1;for(let c=0;c<=5;c++){const u=e.top+r*c/5;n.beginPath(),n.moveTo(e.left,u),n.lineTo(e.left+t,u),n.stroke();const f=s*(5-c)/5;n.font="11px system-ui, sans-serif",n.fillStyle=l.muted,n.textAlign="right",n.fillText(Cm(f),e.left-10,u+4)}for(let c=0;c<=i;c+=5){const u=e.left+c/i*t;n.beginPath(),n.moveTo(u,e.top),n.lineTo(u,e.top+r),n.stroke(),n.textAlign="center",n.fillText(`Y${c}`,u,e.top+r+20)}n.font="12px system-ui, sans-serif",n.textAlign="center",n.fillText("Years",e.left+t/2,e.top+r+45),n.save(),n.translate(20,e.top+r/2),n.rotate(-Math.PI/2),n.fillText("Fund Value",0,0),n.restore()}function Cm(n){return n>=1e6?`£${(n/1e6).toFixed(1)}M`:n>=1e3?`£${(n/1e3).toFixed(0)}k`:`£${n.toFixed(0)}`}function AS(){return`
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
  `}window._simEngine={runMonteCarlo:gm,runHistorical:ym,simulate:_i,monteCarloReturns:$c};window._constants={EQUITY_RETURNS:Br,INFLATION:$o};window._mathUtils={seededRng:Nl};let Mm=null,Dm=null;function Lm(){Mm=null,Dm=null;const n=document.getElementById("mcResults"),e=document.getElementById("histResults");n&&(n.innerHTML=""),e&&(e.innerHTML="");const t=document.getElementById("optimiseResultsMC"),r=document.getElementById("optimiseResultsHist");t&&(t.innerHTML=""),r&&(r.innerHTML="")}function Nm(){document.querySelectorAll(".sub-tab[data-stresstab]").forEach(t=>t.classList.remove("active"));const n=document.querySelector('.sub-tab[data-stresstab="montecarlo"]');n&&n.classList.add("active"),document.querySelectorAll(".stress-subtab").forEach(t=>t.classList.add("hidden"));const e=document.getElementById("stress-montecarlo");e&&e.classList.remove("hidden")}function Bm(){document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(t=>t.classList.remove("active"));const n=document.querySelector('.sub-tab[data-decisiontab="entry"]');n&&n.classList.add("active"),document.querySelectorAll(".decision-subtab").forEach(t=>t.classList.add("hidden"));const e=document.getElementById("decision-entry");e&&e.classList.remove("hidden")}const Om=document.createElement("style");Om.textContent=xI()+eS()+cS()+hS()+ES()+HI()+AS();document.head.appendChild(Om);const Wc=document.getElementById("globalLoadingOverlay"),xS=Wc.querySelector(".loading-text");function Et(n="Loading..."){xS.textContent=n,Wc.classList.add("active")}function Tt(){Wc.classList.remove("active")}window.showToast=function(e,t="info",r=3e3){const i=document.querySelector(".toast-notification");i&&i.remove();const s=document.createElement("div");s.className=`toast-notification ${t}`,s.innerHTML=`
        <span class="toast-icon">${t==="success"?"✓":t==="error"?"!":"ℹ"}</span>
        <span class="toast-message">${e}</span>
      `,document.body.appendChild(s),requestAnimationFrame(()=>s.classList.add("show")),setTimeout(()=>{s.classList.remove("show"),setTimeout(()=>s.remove(),300)},r)};document.getElementById("versionDisplay").textContent=`v${Ih}`;document.getElementById("entryMonth").value=Ag();function Sl(n){const e=document.getElementById(n+"SpWeeklyAmount"),t=document.getElementById(n+"SpAnnualAmount");if(!e||!t)return;const r=parseFloat(e.value)||0;t.value=r>0?Math.round(r*52):"",t._updateOverlay&&t._updateOverlay()}["ds","ss"].forEach(n=>{const e=document.getElementById(n+"SpWeeklyAmount"),t=document.getElementById(n+"SpAnnualAmount");e&&t&&(e.addEventListener("input",()=>{const r=parseFloat(e.value)||0;t.value=r>0?Math.round(r*52):"",t._updateOverlay&&t._updateOverlay()}),t.addEventListener("input",()=>{const r=parseFloat(t.value)||0;e.value=r>0?+(r/52).toFixed(2):"",e._updateOverlay&&e._updateOverlay()}))});function Gc(n){const e=parseFloat(n);return isNaN(e)?"":e.toString().replace(/\B(?=(\d{3})+(?!\d))/g," ")}function Vm(){document.querySelectorAll('input[type="number"]').forEach(e=>{e.value,e.addEventListener("focus",function(t){setTimeout(()=>{this.select()},0)}),e.addEventListener("click",function(t){!t.shiftKey&&!t.ctrlKey&&!t.metaKey&&this.select()})})}function Fm(){document.querySelectorAll('input[type="number"]').forEach(e=>{if(e.dataset.formatted||e.closest("#budget-content"))return;e.dataset.formatted="true";let t=e.closest(".input-with-unit");const r=!!t;t||(t=document.createElement("span"),t.className="num-format-wrap",t.style.cssText="position:relative; display:block;",e.parentNode.insertBefore(t,e),t.appendChild(e));const i=document.createElement("span");i.className="number-format-overlay";const s=r?"34px":"14px";i.style.cssText=`
          position: absolute;
          left: ${s};
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: inherit;
          font-size: inherit;
          font-family: inherit;
          background: transparent;
          z-index: 1;
        `,getComputedStyle(t).position==="static"&&(t.style.position="relative");function o(){const l=parseFloat(e.value);!isNaN(l)&&l>=1e3&&document.activeElement!==e?(i.textContent=Gc(l),i.style.display="block",e.style.color="transparent"):(i.style.display="none",e.style.color="")}e._updateOverlay=o,e.addEventListener("focus",()=>{i.style.display="none",e.style.color=""}),e.addEventListener("blur",o),e.addEventListener("input",()=>{document.activeElement===e&&(i.style.display="none",e.style.color="")}),t.appendChild(i),o()})}function _a(){document.querySelectorAll('input[type="number"]').forEach(n=>{n._updateOverlay&&n._updateOverlay()})}setTimeout(()=>{Vm(),Fm()},100);const RS=new MutationObserver(n=>{let e=!1;n.forEach(t=>{t.addedNodes.forEach(r=>{var i,s;r.nodeType===1&&((i=r.matches)!=null&&i.call(r,'input[type="number"]')||(s=r.querySelector)!=null&&s.call(r,'input[type="number"]'))&&(e=!0)})}),e&&setTimeout(()=>{Vm(),Fm()},50)});RS.observe(document.body,{childList:!0,subtree:!0});let ii=null;async function Kc(n,e=null){vs(),xm(),wa(),ba(),document.getElementById("mainApp").classList.remove("hidden"),document.getElementById("userEmail").textContent=n.email,await ui();const t=await sm();Qc(t),await un(),await Hr(),Al(),Nm(),Bm(),Lm();const r=e||(t.includes("decision")?"decision":"stress");document.querySelectorAll(".tab").forEach(o=>o.classList.remove("active"));const i=document.querySelector(`.tab[data-tab="${r}"]`);i&&i.classList.add("active"),document.querySelectorAll(".tab-content").forEach(o=>o.classList.remove("active"));const s=document.getElementById(`${r}-content`);s&&s.classList.add("active")}function Qc(n){const e={decision:["decision"],stress:["stress"]};document.querySelectorAll(".tab").forEach(r=>{const i=r.dataset.tab;let s=!1;for(const[o,l]of Object.entries(e))if(l.includes(i)){s=n.includes(o);break}Object.values(e).flat().includes(i)||(s=!0),r.style.display=s?"":"none"})}async function Al(){try{const n=await Vt(),e=await It();document.getElementById("entryEquity").value="",document.getElementById("entryBond").value="",document.getElementById("entryCash").value="",document.getElementById("entryIsa").value="",document.getElementById("dsDuration").value=e.duration||35,writeAlloc("ds",e.equityMin??25e4,e.bondMin??2e5,e.cashTarget??5e4,e.diversifierStart||0),restoreCustomAllocFromSettings("ds",e),window._taggedFunds.ds=(e.taggedFunds||[]).map(r=>({...r})),setAllocMode("ds",e.allocMode||(e.taggedFunds&&e.taggedFunds.length?"funds":"risk")),updateEntryTagPrompt(),document.getElementById("dsEquityGlide").checked=e.equityGlideEnabled||!1,updateAllocDisplay("ds"),document.getElementById("dsBaseSalary").value=e.baseSalary||3e4,document.getElementById("dsSpendingProfile").value=e.spendingProfile||"flat",document.getElementById("dsSpStartDate").value=e.spStartDate||"",document.getElementById("dsSpWeeklyAmount").value=e.spWeeklyAmount||"",Sl("ds"),document.getElementById("dsProtectionFactor").value=e.protectionFactor||20,document.getElementById("dsRecoveryBuffer").value=e.recoveryBuffer||1e4,document.getElementById("dsConsecutiveLimit").value=e.consecutiveLimit||3,Xc(n),document.getElementById("ssBaseSalary").value=n.baseSalary,writeAlloc("ss",n.equityMin,n.bondMin,n.cashTarget,n.diversifierStart||0),restoreCustomAllocFromSettings("ss",n),window._taggedFunds.ss=(n.taggedFunds||[]).map(r=>({...r})),setAllocMode("ss",n.allocMode||(n.taggedFunds&&n.taggedFunds.length?"funds":"risk")),document.getElementById("ssDuration").value=n.duration,document.getElementById("ssPA").value=n.pa,document.getElementById("ssBRL").value=n.brl,document.getElementById("ssHRL").value=n.hrl,document.getElementById("ssTaxMode").value=n.taxMode||"inflates",document.getElementById("ssOther").value=n.other||0,document.getElementById("ssSpStartDate").value=n.spStartDate||"",document.getElementById("ssSpWeeklyAmount").value=n.spWeeklyAmount||"",Sl("ss"),document.getElementById("ssConsecutiveLimit").value=n.consecutiveLimit||3,document.getElementById("ssProtectionMult").value=n.protectionMult||.8,document.getElementById("ssDisableProtection").checked=n.disableProtection||!1,document.getElementById("ssHodlEnabled").checked=n.hodlEnabled||!1,document.getElementById("ssHodlValue").value=n.hodlValue||25e3,document.getElementById("ssSpendingProfile").value=n.spendingProfile||"flat",document.getElementById("ssEquityGlide").checked=n.equityGlideEnabled||!1,updateAllocDisplay("ss"),document.getElementById("ssIsaBalance").value=n.isaBalance||0;const t=document.getElementById("ssSeedNote");t&&(t.textContent=n.seededFrom==="decision"&&n.seededAt?"Seeded from Decision Tool "+new Date(n.seededAt).toLocaleDateString():""),_a(),console.log("All inputs initialized from stored settings")}catch(n){console.error("Error initializing inputs from settings:",n)}}async function $m(n){console.log("Wizard completed with data:",n);const e=parseInt(n.retirementAge)||60,t=parseInt(n.currentAge)||e,r=95,i=Math.max(5,r-Math.max(t,e));try{const c={duration:i},u={duration:i};await bT(n.scenarioName||"My plan","",["stress","decision"],{stressSettings:c,decisionSettings:u},!0),gr(),On();try{const f=await _m();f.currentAge=parseInt(n.currentAge)||f.currentAge,f.retirementAge=e,f.endAge=r,f.retired=!!n.retired,f.sharedWithPartner=n.household==="couple",n.household==="couple"&&(f.partnerAge=parseInt(n.partnerAge)||null,f.partnerRetirementAge=parseInt(n.partnerRetirementAge)||null,f.partnerRetired=!!n.partnerRetired),await Em(f)}catch(f){console.warn("Could not seed budget from wizard:",f)}}catch(c){console.error("Error creating scenario from wizard:",c)}const s=Wr(),o=n.startAt||"budget";await Kc(s);const l=document.querySelector('.tab[data-tab="'+o+'"]');l&&l.click()}function xl(n){vs(),xm();const e=n.displayName||n.email.split("@")[0];document.getElementById("onboardingPage").style.display="block",uS(document.getElementById("onboardingPage"),e,()=>{wa(),document.getElementById("setupWizard").style.display="block",km(document.getElementById("setupWizard"),$m)})}tS(document.getElementById("authScreen"),async n=>{console.log("Auth success callback triggered for:",n.email);try{console.log("Checking for existing cloud data...");const e=await aT();console.log("Has cloud data:",e),e?(console.log("Existing user - showing main app"),vs(),Kc(n)):(console.log("New user - showing onboarding page"),xl(n))}catch(e){console.error("Error in auth callback:",e),xl(n)}});XI(document.getElementById("landingPage"),{onGetStarted:()=>{vs(),Bo("signup")},onSignIn:()=>{vs(),Bo("signin")}});document.getElementById("logoutBtn").addEventListener("click",async()=>{try{gr(),On(),hn(),await Rc(),document.getElementById("mainApp").classList.add("hidden"),wa(),ba(),Bo("signin")}catch(n){console.error("Logout error:",n)}});async function ui(){var i;const n=await Dc(),e=n.find(s=>s.isActive),t=document.getElementById("scenarioActiveName");t&&(t.textContent=e&&(((i=e.planDetails)==null?void 0:i.name)||e.name)||"No Plan");const r=document.getElementById("scenarioList");if(r){if(n.length===0){r.innerHTML='<div class="scenario-dropdown-item" style="color:var(--text-muted);cursor:default;">No plans yet</div>';return}r.innerHTML=n.map(s=>{var c,u;const o=((c=s.planDetails)==null?void 0:c.name)||s.name||"Unnamed Plan",l=((u=s.planDetails)==null?void 0:u.description)||s.description||"";return`
        <div class="scenario-dropdown-item ${s.isActive?"active":""}" data-scenario-id="${s.id}">
          <div>
            <div class="scenario-item-name">${o}</div>
            ${l?`<div class="scenario-item-desc">${l}</div>`:""}
          </div>
          <div class="scenario-item-actions">
            ${s.isActive?`<button class="scenario-tools-btn" data-id="${s.id}" data-tools="${(s.enabledTools||["stress","decision"]).join(",")}" title="Edit Tools">&#9881;</button>`:""}
            <button class="scenario-rename-btn" data-id="${s.id}" data-name="${o}" title="Rename">&#9998;</button>
            ${n.length>1?`<button class="scenario-delete-btn" data-id="${s.id}" data-name="${o}" title="Delete">&times;</button>`:""}
          </div>
        </div>
      `}).join(""),r.querySelectorAll(".scenario-dropdown-item").forEach(s=>{s.addEventListener("click",async o=>{if(o.target.closest(".scenario-item-actions"))return;const l=s.dataset.scenarioId;if(!l)return;const c=n.find(u=>u.isActive);if(c&&c.id===l){document.getElementById("scenarioDropdown").classList.remove("open");return}try{await _T(l),gr(),On(),document.getElementById("scenarioDropdown").classList.remove("open"),Lm(),Nm(),Bm();const u=await sm();Qc(u);const f=document.querySelector(".tab.active");if(f&&f.style.display==="none"){const m=document.querySelector('.tab:not([style*="display: none"])');if(m){document.querySelectorAll(".tab").forEach(I=>I.classList.remove("active")),m.classList.add("active"),document.querySelectorAll(".tab-content").forEach(I=>I.classList.remove("active"));const p=m.dataset.tab+"-content",y=document.getElementById(p);y&&y.classList.add("active")}}await un(),await Hr(),await Al(),await ui()}catch(u){console.error("Error switching scenario:",u),showToast("Failed to switch plan: "+u.message,"error")}})}),r.querySelectorAll(".scenario-rename-btn").forEach(s=>{s.addEventListener("click",async o=>{o.stopPropagation();const l=s.dataset.id,c=s.dataset.name,u=prompt("Rename plan:",c);if(u&&u.trim()&&u.trim()!==c)try{await TT(l,u.trim()),await ui()}catch(f){console.error("Error renaming scenario:",f),showToast("Failed to rename plan: "+f.message,"error")}})}),r.querySelectorAll(".scenario-tools-btn").forEach(s=>{s.addEventListener("click",async o=>{o.stopPropagation();const l=s.dataset.id,c=(s.dataset.tools||"stress,decision").split(",");document.getElementById("scenarioDropdown").classList.remove("open"),kS(l,c)})}),r.querySelectorAll(".scenario-delete-btn").forEach(s=>{s.addEventListener("click",async o=>{o.stopPropagation();const l=s.dataset.id,c=s.dataset.name;if(confirm(`Delete plan "${c}"? This cannot be undone.`))try{await ST(l),gr(),On(),await un(),await Hr(),await Al(),await ui()}catch(u){console.error("Error deleting scenario:",u),showToast("Failed to delete plan: "+u.message,"error")}})})}}document.getElementById("scenarioActiveBtn").addEventListener("click",n=>{n.stopPropagation(),document.getElementById("scenarioDropdown").classList.toggle("open")});document.addEventListener("click",n=>{const e=document.getElementById("scenarioSelector");e&&!e.contains(n.target)&&document.getElementById("scenarioDropdown").classList.remove("open")});document.getElementById("scenarioNewBtn").addEventListener("click",async()=>{document.getElementById("scenarioDropdown").classList.remove("open"),document.getElementById("mainApp").classList.add("hidden"),document.getElementById("setupWizard").style.display="block",km(document.getElementById("setupWizard"),$m)});document.getElementById("scenarioDuplicateBtn").addEventListener("click",async()=>{var r;document.getElementById("scenarioDropdown").classList.remove("open");const n=await kt();if(!n){showToast("No active plan to duplicate.","error");return}const e=((r=n.planDetails)==null?void 0:r.name)||n.name||"My Plan",t=prompt("Name for the copy:",e+" (copy)");if(!(!t||!t.trim()))try{await ET(n.id,t.trim()),await ui()}catch(i){console.error("Error duplicating scenario:",i),showToast("Failed to duplicate plan: "+i.message,"error")}});function kS(n,e){const t=document.getElementById("editToolsModal");t&&t.remove();const r=e.includes("stress"),i=e.includes("decision"),s=document.createElement("div");s.id="editToolsModal",s.className="edit-tools-overlay",s.innerHTML=`
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
      `,document.body.appendChild(s),document.getElementById("editToolsCancel").addEventListener("click",()=>s.remove()),s.addEventListener("click",o=>{o.target===s&&s.remove()}),document.getElementById("editToolsSave").addEventListener("click",async()=>{const o=[];if(document.getElementById("editToolStress").checked&&o.push("stress"),document.getElementById("editToolDecision").checked&&o.push("decision"),o.length===0){showToast("Please select at least one tool","error");return}const l=o.filter(c=>!e.includes(c));try{await IT(n,o);const c=await kt();if(c&&c.id===n){Qc(o);const u=document.querySelector(".tab.active");if(u&&u.style.display==="none"){const f=document.querySelector('.tab:not([style*="display: none"])');if(f){document.querySelectorAll(".tab").forEach(y=>y.classList.remove("active")),f.classList.add("active"),document.querySelectorAll(".tab-content").forEach(y=>y.classList.remove("active"));const m=f.dataset.tab+"-content",p=document.getElementById(m);p&&p.classList.add("active")}}}if(await ui(),s.remove(),l.length>0){let u=null;try{if(l.includes("stress")&&e.includes("decision")){const p=await It();p&&(u={source:"decision",...p})}else if(l.includes("decision")&&e.includes("stress")){const p=await Vt();p&&(u={source:"stress",...p})}}catch(p){console.warn("Could not load existing settings for pre-fill:",p)}const f=document.getElementById("setupWizard");f.style.display="block",document.getElementById("mainApp").style.display="none",_S(f,l,async p=>{ba();try{l.includes("stress")&&(await ya({equityMin:p.equityMin,bondMin:p.bondMin,cashTarget:p.cashTarget,isaBalance:p.isaBalance||0,duration:p.duration,baseSalary:p.baseSalary,other:p.otherIncome||0,taxMode:p.taxMode||"inflates",equityGlideEnabled:p.equityGlideEnabled||!1}),On()),l.includes("decision")&&(await Ns({equityMin:p.decisionEquity,bondMin:p.decisionBond,cashTarget:p.decisionCash,isaBalance:p.decisionIsaBalance||0,duration:p.decisionDuration,baseSalary:p.decisionSalary,spStartDate:p.spStartDate||null,spWeeklyAmount:p.spWeeklyAmount||0,equityGlideEnabled:p.decisionEquityGlideEnabled||!1}),gr())}catch(y){console.error("Error saving new tool settings:",y)}await Kc(),showToast("New tool configured successfully","success")},u)}else showToast("Tools updated","success")}catch(c){console.error("Error updating scenario tools:",c),showToast("Failed to update tools: "+c.message,"error")}})}const PS=60*60*1e3;let Qa=null;function zm(){Qa&&clearTimeout(Qa),gt()&&(Qa=setTimeout(async()=>{if(gt()){showToast("You have been logged out due to inactivity (1 hour).","info",5e3);try{gr(),On(),hn(),await Rc(),document.getElementById("mainApp").classList.add("hidden"),wa(),ba(),Bo("signin")}catch(n){console.error("Auto-logout error:",n)}}},PS))}const CS=["mousedown","mousemove","keydown","scroll","touchstart","click"];CS.forEach(n=>{document.addEventListener(n,()=>{zm()},{passive:!0})});zm();document.getElementById("resetBtn").addEventListener("click",async()=>{if(!(!confirm(`⚠️ WARNING: This will permanently delete ALL your data including:

• All saved settings
• All decision history
• All tax year configurations

This action cannot be undone.

Are you sure you want to reset and start over?`)||!confirm(`Are you ABSOLUTELY sure?

Type OK to confirm deletion of all your data.`)))try{console.log("Wiping all user data..."),await Kp(),console.log("Data wiped successfully"),gr(),On(),hn(),localStorage.clear(),document.getElementById("mainApp").classList.add("hidden");const t=Wr();xl(t),showToast("All data has been deleted. Set up a new plan to start fresh.","success",4e3)}catch(t){console.error("Reset error:",t),showToast("Error resetting data: "+t.message,"error")}});document.getElementById("deleteAccountBtn").addEventListener("click",async()=>{if(!(!confirm(`⚠️ DELETE YOUR ACCOUNT?

This permanently deletes your login AND all saved data:

• All plans and settings
• All portfolio/decision history
• Your household budget

This cannot be undone.`)||!confirm(`FINAL WARNING

Your account and every piece of data will be gone forever.

Delete everything?`)))try{await Kp(),gr(),On(),hn(),localStorage.clear(),await rT(),showToast("Your account and all data have been deleted.","success",4e3),setTimeout(()=>window.location.reload(),1500)}catch(t){console.error("Delete account error:",t),t.code==="auth/requires-recent-login"?showToast("For security, please sign out, sign back in, and press Delete Account again.","error",8e3):showToast("Error deleting account: "+t.message,"error")}});document.querySelectorAll(".tab").forEach(n=>{n.addEventListener("click",async()=>{if(n.dataset.tab!=="stress"){MS();const e=document.getElementById("optimiseResultsMC"),t=document.getElementById("optimiseResultsHist");e&&(e.innerHTML=""),t&&(t.innerHTML="")}document.querySelectorAll(".tab").forEach(e=>e.classList.remove("active")),n.classList.add("active"),document.querySelectorAll(".tab-content").forEach(e=>e.classList.remove("active")),document.getElementById(`${n.dataset.tab}-content`).classList.add("active"),n.dataset.tab==="stress"&&await Ta(),n.dataset.tab==="budget"&&await JS()})});const qi=document.querySelector(".tabs"),bh=document.querySelector(".tabs-wrapper");if(qi&&bh){const n=()=>{const e=qi.scrollLeft+qi.clientWidth>=qi.scrollWidth-10;bh.classList.toggle("scrolled-end",e)};qi.addEventListener("scroll",n),n()}document.querySelectorAll(".sub-tab[data-stresstab]").forEach(n=>{n.addEventListener("click",async()=>{document.querySelectorAll(".sub-tab[data-stresstab]").forEach(e=>e.classList.remove("active")),n.classList.add("active"),document.querySelectorAll(".stress-subtab").forEach(e=>e.classList.add("hidden")),document.getElementById(`stress-${n.dataset.stresstab}`).classList.remove("hidden"),n.dataset.stresstab==="stresssettings"&&await Ta()})});document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(n=>{n.addEventListener("click",async()=>{document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(e=>e.classList.remove("active")),n.classList.add("active"),document.querySelectorAll(".decision-subtab").forEach(e=>e.classList.add("hidden")),document.getElementById(`decision-${n.dataset.decisiontab}`).classList.remove("hidden"),n.dataset.decisiontab==="decisionsettings"&&await tu(),n.dataset.decisiontab==="history"&&await un(),n.dataset.decisiontab==="taxyears"&&await Hr()})});async function _h(n,e,t,r){var o,l;const i=await It(),s=i.equityGlideEnabled?{...i,equityGlide:xh(i)}:i;return JI(n,e,t,r,{settings:s,history:await Kr(),allTaxYears:await qn(),spInfo:await Nc(Sm(n)),isaBalance:parseFloat((o=document.getElementById("entryIsa"))==null?void 0:o.value)||0,diversifier:parseFloat((l=document.getElementById("entryDiversifier"))==null?void 0:l.value)||0})}function Jc(n,e,t){if(n<1e4&&e<1e4&&t<1e4&&n+e+t>0){const i=s=>"£"+Math.round(s||0).toLocaleString();return confirm(`These fund values look low — Equity ${i(n)}, Bond ${i(e)}, Cash ${i(t)}.

Enter absolute amounts in pounds, to the single pound (e.g. 250000, not 250).

Continue anyway?`)}return!0}window.handleDecisionSubmit=async function(n){n.preventDefault();const e=document.getElementById("entryMonth").value,t=parseFloat(document.getElementById("entryEquity").value)||0,r=parseFloat(document.getElementById("entryBond").value)||0,i=parseFloat(document.getElementById("entryCash").value)||0,s=[];if(e||s.push("Month"),!t&&t!==0&&s.push("Equity Fund"),!r&&r!==0&&s.push("Bond Balance"),!i&&i!==0&&s.push("Cash Balance"),s.length>0){showToast("Missing: "+s.join(", "),"error",4e3);return}if(!Jc(t,r,i))return;if((await Kr({limit:1e3})).find(c=>c.date===e)){showToast(`${Ei(e)} already has a saved decision. Delete it from the History tab first to recalculate.`,"error",5e3);return}try{if((await NI(e)).showWizard){const f=document.getElementById("taxYearWizard");f.style.display="block",window._pendingDecisionForm={dateStr:e,equity:t,bond:r,cash:i},LI(f,e,async m=>{if(f.style.display="none",m&&m.completed)try{ii=await _h(e,t,r,i);const p=document.getElementById("decisionOutput");dh(ii,p),document.getElementById("saveBtn").disabled=!1}catch(p){console.error("Decision error after wizard:",p),showToast("Error: "+p.message,"error")}});return}ii=await _h(e,t,r,i);const u=document.getElementById("decisionOutput");dh(ii,u),document.getElementById("saveBtn").disabled=!1}catch(c){console.error("Decision error:",c),showToast("Error: "+c.message,"error")}};window.saveCurrentDecision=async function(){const n=document.getElementById("saveBtn");if(!ii){showToast("No decision to save","error");return}if(!gt()){showToast("Please sign in to save decisions","error");return}n.classList.add("loading"),n.disabled=!0;try{await FT(ii),showToast("Decision saved to history","success"),await un()}catch(e){console.error("Save error:",e),showToast("Error saving: "+e.message,"error"),n.disabled=!1}finally{n.classList.remove("loading")}};function Xc(n){const e=i=>"£"+Math.round(i||0).toLocaleString(),t=(n.diversifierStart||0)>0?` · Diversifiers ${e(n.diversifierStart)}`:"",r=`Starting balances come from your <strong>Settings</strong> (Fund Minimums): Equity ${e(n.equityMin)} · Bond ${e(n.bondMin)}${t} · Cash ${e(n.cashTarget)}. Edit them in the Settings tab.`;["mcStartSummary","histStartSummary","scenStartSummary"].forEach(i=>{const s=document.getElementById(i);s&&(s.innerHTML=r)}),["mcYears","histYears"].forEach(i=>{const s=document.getElementById(i);s&&(s.value=n.duration)})}window.runMonteCarloUI=async function(){const n=await Vt(),e={years:parseInt(document.getElementById("mcYears").value)||n.duration},t=document.getElementById("optimiseResultsMC");t&&(t.innerHTML=""),document.getElementById("mcResults").innerHTML='<div class="loading"><div class="spinner"></div>Running simulation...</div>',setTimeout(()=>{try{const{results:r,stats:i}=YI(e);Mm=r,Hm(i,r,"Monte Carlo (1000 runs)","mcResults",e.years)}catch(r){console.error("Simulation error:",r),document.getElementById("mcResults").innerHTML=`<div class="alert alert-danger">Error: ${r.message}</div>`}},50)};window.runHistoricalUI=async function(){const n=await Vt(),e={years:parseInt(document.getElementById("histYears").value)||n.duration},t=document.getElementById("optimiseResultsHist");t&&(t.innerHTML=""),document.getElementById("histResults").innerHTML='<div class="loading"><div class="spinner"></div>Running simulation...</div>',setTimeout(()=>{try{const{results:r,stats:i}=jI(e);Dm=r,Hm(i,r,"Historical Analysis","histResults",e.years)}catch(r){console.error("Simulation error:",r),document.getElementById("histResults").innerHTML=`<div class="alert alert-danger">Error: ${r.message}</div>`}},50)};window.runScenariosUI=async function(){await Vt();const n={};document.getElementById("scenResults").innerHTML='<div class="loading"><div class="spinner"></div>Running scenarios...</div>',setTimeout(()=>{try{const e=WI(n);zS(e,"scenResults")}catch(e){console.error("Scenario error:",e),document.getElementById("scenResults").innerHTML=`<div class="alert alert-danger">Error: ${e.message}</div>`}},50)};let er=!1,Qi=0;function MS(){Qi++}window.runOptimisationUI=async function(n){if(er)return;er=!0;const e=++Qi,t=document.getElementById("optimiseBtn"+n),r=document.getElementById("optimiseResults"+n);t&&(t.disabled=!0),t&&(t.textContent="Optimising..."),r.innerHTML='<div class="loading"><div class="spinner"></div>Preparing optimisation...</div>';const i=await Vt(),s=JSON.parse(JSON.stringify(i)),o=document.getElementById(n==="MC"?"mcYears":"histYears"),l=parseInt(o&&o.value)||s.duration,c=(s.equityMin||0)+(s.bondMin||0)+(s.cashTarget||0);if(e!==Qi){er=!1,t&&(t.disabled=!1,t.textContent="Optimise Allocation");return}const u=[];for(let b=5;b<=90;b+=5)for(let E=5;E<=95-b;E+=5){const A=100-b-E;A>=0&&u.push({equity:Math.round(c*E/100),bond:Math.round(c*A/100),cash:Math.round(c*b/100)})}const{EQUITY_RETURNS:f,INFLATION:m}=window._constants,{simulate:p,monteCarloReturns:y}=window._simEngine,I=Object.keys(f).map(Number).sort((b,E)=>b-E),S=Math.max(...I),x=b=>{const E={...s,equityMin:b.equity,bondMin:b.bond,cashTarget:b.cash},A=Bs({years:l},E),w=[];if(n==="MC")for(let O=0;O<1e3;O++)w.push(p(A,y(A,O),O));else I.forEach(O=>{if(O+l-1>S)return;const Z={equity:{},inflation:{}};for(let be=0;be<l;be++)Z.equity[be]=f[O+be]||0,Z.inflation[be]=m[O+be]||.025;w.push(p(A,Z,O))});const le=w.filter(O=>O.failed);w.filter(O=>!O.failed);const pe=(w.length-le.length)/w.length*100,H=w.reduce((O,Z)=>O+Math.min(1,(Z.years||0)/(Z.duration||l)),0)/w.length*100,ne=w.map(O=>O.protMonths).reduce((O,Z)=>O+Z,0)/w.length,te=w.filter(O=>O.protMonths>0).length,Ce=w.map(O=>O.failed?0:O.finalReal||0).sort((O,Z)=>O-Z),ke=Ce.length?Ce[Math.floor(Ce.length*.5)]:0,ye=Ce.length?Ce[Math.floor(Ce.length*.9)]:0;return{equity:b.equity,bond:b.bond,cash:b.cash,rate:pe,coverage:H,avgProt:ne,withProt:te,totalRuns:w.length,medianFinal:ke,p90Final:ye}};let k;try{const b={equity:s.equityMin||0,bond:s.bondMin||0,cash:s.cashTarget||0},E=x(b);k={...b,...E}}catch(b){console.error("Optimisation error (original):",b),r.innerHTML='<div class="alert alert-danger">Error: '+b.message+"</div>",er=!1,t&&(t.disabled=!1,t.textContent="Optimise Allocation");return}const C=10;let N=0;const B=[];let $=null;function q(b){const E=Math.max(...b.map(w=>w.coverage)),A=b.filter(w=>w.coverage>=E-.5);return A.sort((w,le)=>w.avgProt-le.avgProt||le.medianFinal-w.medianFinal),A[0]}function T(b,E){return Math.round(b.equity)===Math.round(E.equity)&&Math.round(b.bond)===Math.round(E.bond)&&Math.round(b.cash)===Math.round(E.cash)}function v(){if(e!==Qi){er=!1,t&&(t.disabled=!1,t.textContent="Optimise Allocation"),r.innerHTML="";return}try{const b=Math.min(N+C,u.length);for(;N<b;N++)B.push(x(u[N]));r.innerHTML='<div class="loading"><div class="spinner"></div>Testing allocations... '+N+"/"+u.length+"</div>",N<u.length?setTimeout(v,0):($=q([...B,k]),_())}catch(b){console.error("Optimisation error:",b),r.innerHTML='<div class="alert alert-danger">Error: '+b.message+"</div>",er=!1,t&&(t.disabled=!1,t.textContent="Optimise Allocation")}}function _(){if(e!==Qi){er=!1,t&&(t.disabled=!1,t.textContent="Optimise Allocation"),r.innerHTML="";return}const b=c>0?k.cash/c*100:0,E=c>0?k.equity/c*100:0,w=b>90||b<5||E<5?'<div class="alert alert-info" style="margin-bottom:16px;font-size:13px;">Your current split is outside the range the optimiser sweeps, but it was included in this comparison.</div>':"",le=$&&!T($,k)&&($.coverage>k.coverage+.5||$.coverage>=k.coverage-.01&&$.avgProt<k.avgProt-3),pe=(ee,ne)=>{const te=Ce=>Math.round(Ce/c*100);return'<div style="padding:16px;border-radius:8px;'+(ne?"background:rgba(46,160,67,0.1);border:1px solid var(--success);":"background:rgba(0,0,0,0.2);")+'"><div style="font-weight:500;margin-bottom:10px;color:var(--'+(ne?"success":"text-muted")+');">'+(ne?"Optimised split":"Your current split")+'</div><div style="font-size:26px;font-weight:700;color:var(--'+(ne?"success":"warning")+');">'+ee.coverage.toFixed(0)+'%</div><div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">of retirement years funded'+(ne?" ("+($.coverage-k.coverage>=0?"+":"")+($.coverage-k.coverage).toFixed(0)+"%)":"")+'</div><div style="font-size:13px;">Equity '+te(ee.equity)+"% · Bonds "+te(ee.bond)+"% · Cash "+te(ee.cash)+'%</div><div style="font-size:12px;color:var(--text-muted);margin-top:8px;">'+ee.rate.toFixed(0)+"% never run out · "+W(ee.medianFinal)+" typically left</div></div>"};let H="";if(le){const ee=$.medianFinal-k.medianFinal,ne=k.medianFinal>0?ee/k.medianFinal*100:0;H+='<div class="card" style="margin-top:20px;border-color:var(--success);">',H+='<h3 style="color:var(--success);margin-top:0;">A better fund split</h3>',H+='<p style="color:var(--text-muted);margin-bottom:16px;">This split funds more of your retirement (higher coverage). Coverage credits a plan for every year it pays for, so it prefers splits that fall short late over ones that fail early.</p>',H+=w,H+='<div class="grid-2" style="gap:20px;margin-bottom:20px;">'+pe(k,!1)+pe($,!0)+"</div>",ee<0?H+='<div class="alert alert-warning" style="margin-bottom:16px;"><strong>Trade-off:</strong> it typically leaves '+Math.abs(ne).toFixed(0)+"% less at the end (usually less equity) — more safety, a bit less upside.</div>":ee>0&&(H+='<div class="alert alert-info" style="margin-bottom:16px;"><strong>Bonus:</strong> it also typically leaves '+ne.toFixed(0)+"% more at the end.</div>"),H+='<button onclick="applyOptimisedAllocationUI('+$.equity+","+$.bond+","+$.cash+')" style="width:100%;">Apply this split to your Settings</button>',H+="</div>"}else H+='<div class="card" style="margin-top:20px;border-color:var(--primary);">',H+='<h3 style="color:var(--primary);margin-top:0;">Your split is already about as good as it gets</h3>',H+=w,H+='<p style="color:var(--text-muted);">We tested '+u.length+" fund splits. Yours funds "+k.coverage.toFixed(0)+"% of retirement years — the best, or within 0.5% of it, with no clearly better low-protection alternative.</p>",H+='<p style="font-size:13px;color:var(--text-muted);">Your split — Equity '+Math.round(E)+"% · Bonds "+Math.round(k.bond/c*100)+"% · Cash "+Math.round(b)+"% · "+k.rate.toFixed(0)+"% never run out.</p>",H+="</div>";r.innerHTML=H,er=!1,t&&(t.disabled=!1,t.textContent="Optimise Allocation")}setTimeout(v,0)};window.applyOptimisedAllocationUI=async function(n,e,t){if(writeAlloc("ss",n,e,t),writeAlloc("ds",n,e,t),Xc({equityMin:n,bondMin:e,cashTarget:t,duration:parseInt(document.getElementById("ssDuration").value)||35}),_a(),gt())try{await ya({equityMin:n,bondMin:e,cashTarget:t})}catch(r){console.error("Error saving optimised settings:",r)}showToast("Optimised allocation applied to settings and starting values. Scroll up to re-run.","success",4e3)};const DS={1929:"Wall Street Crash / Great Depression",1930:"Great Depression",1931:"Great Depression",1932:"Great Depression",1937:"Recession of 1937",1968:"Late 1960s stagflation",1969:"Late 1960s recession",1973:"Oil Crisis / 1973-74 crash",1974:"1973-74 bear market",2e3:"Dot-com bubble burst",2001:"Dot-com bust / 9/11",2007:"Global Financial Crisis",2008:"Global Financial Crisis",2022:"Post-COVID inflation / rate hikes"};function LS(n){if(!n||n.length===0)return"";const e=n.filter(s=>s.failed).sort((s,o)=>s.years-o.years),t=n.filter(s=>s.protMonths>0).sort((s,o)=>o.protMonths-s.protMonths),r=e.length>0?e.slice(0,5):t.slice(0,5);if(r.length===0)return"";let i=`
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
      `;return r.forEach(s=>{const o=s.startYear||s.seed,l=DS[o]||"-",c=s.failed?"danger":"success";i+=`
          <tr>
            <td>${o}</td>
            <td style="font-size: 12px;">${l}</td>
            <td>${s.years.toFixed(1)}</td>
            <td>${s.protMonths}</td>
            <td>${W(s.final)}</td>
            <td style="color: var(--${c});">${s.failed?"FAILED":"OK"}</td>
          </tr>
        `}),i+=`
              </tbody>
            </table>
          </div>
        </details>
      `,i}function xn(n){return`<span class="hlp" tabindex="0" data-tip="${String(n).replace(/"/g,"&quot;")}">?</span>`}function NS(){if(window.__helpTipInit)return;window.__helpTipInit=!0;const n=document.createElement("div");n.className="help-tip",n.style.display="none",document.body.appendChild(n);let e=null;const t=i=>{const s=i.getAttribute("data-tip");if(!s)return;clearTimeout(e),n.textContent=s,n.style.display="block";const o=i.getBoundingClientRect(),l=Math.min(260,window.innerWidth-24);n.style.width=l+"px";let c=o.left+o.width/2-l/2+window.scrollX;c=Math.max(12+window.scrollX,Math.min(c,window.scrollX+window.innerWidth-l-12)),n.style.left=c+"px";const u=n.offsetHeight;let f=o.top+window.scrollY-u-8;o.top<u+12&&(f=o.bottom+window.scrollY+8),n.style.top=f+"px"},r=()=>{e=setTimeout(()=>{n.style.display="none"},80)};document.addEventListener("mouseover",i=>{const s=i.target.closest&&i.target.closest("[data-tip]");s&&t(s)}),document.addEventListener("mouseout",i=>{i.target.closest&&i.target.closest("[data-tip]")&&r()}),document.addEventListener("focusin",i=>{const s=i.target.closest&&i.target.closest("[data-tip]");s&&t(s)}),document.addEventListener("focusout",i=>{i.target.closest&&i.target.closest("[data-tip]")&&r()}),document.addEventListener("click",i=>{const s=i.target.closest&&i.target.closest("[data-tip]");s&&(n.style.display==="block"?r():t(s))})}function BS(){if(window.__chartHoverInit)return;window.__chartHoverInit=!0;const n=e=>e.querySelectorAll("circle[data-tip]").forEach(t=>{t.setAttribute("fill","transparent"),t.removeAttribute("stroke")});document.addEventListener("mousemove",e=>{const t=e.target.closest&&e.target.closest(".ichart");if(!t)return;const r=t.querySelectorAll("circle[data-tip]");if(!r.length)return;let i=null,s=1/0;r.forEach(o=>{const l=o.getBoundingClientRect(),c=Math.abs(l.left+l.width/2-e.clientX);c<s&&(s=c,i=o)}),i&&(n(t),i.setAttribute("fill","#60a5fa"),i.setAttribute("stroke","var(--surface,#161b22)"),i.setAttribute("stroke-width","2"),i.dispatchEvent(new MouseEvent("mouseover",{bubbles:!0})))}),document.addEventListener("mouseout",e=>{const t=e.target.closest&&e.target.closest(".ichart");t&&n(t)})}const Mr=n=>"£"+Math.round(n).toLocaleString();function Um(n,e,t){return`<svg class="ichart" viewBox="0 0 ${e} ${t}" style="width:100%;height:auto;overflow:visible;display:block" role="img">${n}</svg>`}function qm(n,{max:e,valueFmt:t=Mr,tip:r,pct:i=!1}={}){const m=n.length;if(m<2)return"";const p=e??(i?100:Math.max(1,...n)),y=B=>56+B/(m-1)*590,I=B=>174-Math.max(0,Math.min(i?100:1/0,B))/p*160,S=n.map((B,$)=>`${y($).toFixed(1)},${I(B).toFixed(1)}`).join(" "),x=`56,${174 .toFixed(1)} ${S} ${y(m-1).toFixed(1)},${174 .toFixed(1)}`,k=i?[0,50,100]:[0,p/2,p],C=[0,Math.floor((m-1)/2),m-1],N=r||((B,$)=>`Year ${$}: ${t(B)}`);return Um(k.map(B=>`<line x1="56" y1="${I(B).toFixed(1)}" x2="646" y2="${I(B).toFixed(1)}" stroke="var(--border,#8883)" opacity=".45"/><text x="50" y="${(I(B)+3).toFixed(1)}" text-anchor="end" font-size="10" fill="var(--text-muted,#999)">${t(B)}</text>`).join("")+`<polygon points="${x}" fill="rgba(96,165,250,.13)"/><polyline points="${S}" fill="none" stroke="#60a5fa" stroke-width="2.5"/>`+n.map((B,$)=>`<circle cx="${y($).toFixed(1)}" cy="${I(B).toFixed(1)}" r="8" fill="transparent" data-tip="${N(B,$).replace(/"/g,"&quot;")}"></circle>`).join("")+C.map(B=>`<text x="${y(B).toFixed(1)}" y="192" text-anchor="middle" font-size="10" fill="var(--text-muted,#999)">Year ${B}</text>`).join(""),660,200)}function OS(n){const l=n.p50.length;if(l<2)return"";const c=Math.max(1,...n.p90),u=S=>60+S/(l-1)*606,f=S=>222-Math.max(0,S)/c*208,m=(S,x)=>S.map((k,C)=>`${u(C).toFixed(1)},${f(k).toFixed(1)}`).concat(x.map((k,C)=>`${u(l-1-C).toFixed(1)},${f(x[l-1-C]).toFixed(1)}`)).join(" "),p=S=>S.map((x,k)=>`${u(k).toFixed(1)},${f(x).toFixed(1)}`).join(" "),y=[0,c/4,c/2,3*c/4,c],I=[0,Math.floor((l-1)/2),l-1];return Um(y.map(S=>`<line x1="60" y1="${f(S).toFixed(1)}" x2="666" y2="${f(S).toFixed(1)}" stroke="var(--border,#8883)" opacity=".4"/><text x="54" y="${(f(S)+3).toFixed(1)}" text-anchor="end" font-size="10" fill="var(--text-muted,#999)">${Mr(S)}</text>`).join("")+`<polygon points="${m(n.p90,n.p10)}" fill="rgba(96,165,250,.12)"/><polygon points="${m(n.p75,n.p25)}" fill="rgba(96,165,250,.22)"/><polyline points="${p(n.p50)}" fill="none" stroke="#60a5fa" stroke-width="2.5"/>`+n.p50.map((S,x)=>`<circle cx="${u(x).toFixed(1)}" cy="${f(S).toFixed(1)}" r="8" fill="transparent" data-tip="Year ${x}: middle ${Mr(S)}; likely range ${Mr(n.p10[x])} to ${Mr(n.p90[x])}"></circle>`).join("")+I.map(S=>`<text x="${u(S).toFixed(1)}" y="242" text-anchor="middle" font-size="10" fill="var(--text-muted,#999)">Year ${S}</text>`).join(""),680,250)}function VS(n){if(!n||!n.funded)return"";const e=i=>(i||0).toFixed(i>=10?0:1),t=n.pctSurviveFullTerm>=80?"success":n.pctSurviveFullTerm>=50?"warning":"danger",r=n.avgHigherRateYears<1?"success":n.avgHigherRateYears<4?"warning":"danger";return`
        <h3 style="margin:24px 0 4px;">Your tax-free ISA bridge</h3>
        <p style="color:var(--text-muted);font-size:12px;margin:0 0 12px;">
          The ISA (starting at ${W(n.startBalance)}) is drawn tax-free to top your income up, keeping you out of higher-rate tax. Modelled as a steady money-market fund.
        </p>
        <div class="keynums">
          <div class="keynum ${t}">
            <div class="kn-val">${n.pctSurviveFullTerm.toFixed(0)}%</div>
            <div class="kn-label">of futures the ISA still has real money at the end ${xn("The ISA is treated as used up once its value in present-day money falls below 5% of what you started with — money-market growth leaves a tiny nominal sliver forever, so an exactly-zero test would be misleading.")}</div>
          </div>
          <div class="keynum">
            <div class="kn-val">${e(n.medianLastedYears)} yrs</div>
            <div class="kn-label">the ISA typically lasts before it's used up ${xn("Median year its value in present-day money drops below 5% of the starting balance — the point it stops meaningfully topping up your income. Matches the chart below.")}</div>
          </div>
          <div class="keynum ${r}">
            <div class="kn-val">${e(n.avgHigherRateYears)} yrs</div>
            <div class="kn-label">typically paying 40% (higher-rate) tax ${xn("Years you pay higher-rate income tax because the ISA has run out and income must come from the taxable pension above the basic-rate limit. A bigger ISA reduces these.")}</div>
          </div>
          <div class="keynum">
            <div class="kn-val">${W(n.medianTotalTax)}</div>
            <div class="kn-label">typical lifetime income tax, today's money ${xn("Median total income tax paid over the whole plan, in present-day spending power.")}</div>
          </div>
        </div>
        <div style="margin-bottom:8px;">
          <div class="chart-caption">Typical ISA balance still to hand, year by year (today's money — hover a point for the figure). A slow, steady fall means it's being drawn as intended; a flat line means it's barely touched (larger than this plan needs); a drop to £0 marks when it typically runs out.</div>
          ${qm(n.medianIsaByYear,{valueFmt:Mr,tip:(i,s)=>`Year ${s}: typically ${Mr(i)} of ISA left`})}
        </div>`}function FS(n){return n==="sequence"?"The failing futures were sunk by a bad first few years of markets. Holding a bigger cash/bond buffer for the early years, or starting with a slightly lower withdrawal, would let the plan ride out an early slump.":n==="inflation"?"The failing futures were driven by high inflation eroding your spending power. More inflation protection (e.g. index-linked gilts) and less plain cash would help — cash loses to inflation over time.":n==="market"?"The failing futures simply had weak markets throughout. A slightly lower withdrawal rate, or more growth assets (equities) accepting more short-term ups and downs, gives more headroom.":"Lowering your target income, delaying the start, or a larger starting pot would all raise the odds."}function $S(n,e){const t=n.severity||{},r=n.successRate,i=r>=90?{t:"Very likely to last",c:"success"}:r>=75?{t:"Likely to last — with some risk",c:"success"}:r>=50?{t:"At real risk of running out",c:"warning"}:{t:"Unlikely to last as planned",c:"danger"};let s=`<div class="verdict verdict-${i.c}">
        <div class="verdict-title">Will your money last? — ${i.t}</div>
        <div class="verdict-heroes">
          <div><span class="hero">${r.toFixed(0)}%</span>
            <span class="hero-sub">chance your money lasts the whole plan ${xn("Out of "+e+", the share where your pot never runs out before the end of the plan. Higher is better.")}</span></div>
          <div><span class="hero" style="font-size:30px;">${(t.coverage||0).toFixed(0)}%</span>
            <span class="hero-sub">of retirement years funded (coverage) ${xn('The average share of retirement years your plan pays for, across every simulated future — so a plan that funds 34 of 35 years scores 97%, and a late shortfall counts far less than an early one. Based on the retirement "coverage ratio" (Estrada & Kritzman, 2019). Note: it is capped at 100% and ignores any money left over, and it is an average — check the worst-case minimum below.')}</span></div>
        </div>
        <div class="verdict-basis">Based on ${e}. Pot and income values are shown in today's money.</div>
      </div>`;return t.failCount>0&&(s+=`<div class="callout">
          <div class="callout-title">Why it might fall short</div>
          <p>${t.diagnosis}</p>
          <p class="lever"><strong>What could help:</strong> ${FS(t.primaryDriver)}</p>
        </div>`),s}function Hm(n,e,t,r,i){NS(),BS();const s=n.survival||{},o=n.finalReal||{},l=n.protection||{},c=l.pctWithProtection!=null?l.pctWithProtection:(l.runsWithProtection||0)/(e.length||1)*100,u=r==="mcResults",f=u?`${e.length.toLocaleString()} simulated futures`:`${e.length} historical periods since 1928`;let m=`
        <div class="card">
          <h2>${t}</h2>

          ${$S(n,f)}

          <div class="keynums">
            <div class="keynum">
              <div class="kn-val">${Math.round(s.min||0)} / ${i} yrs</div>
              <div class="kn-label">worst simulated future — money lasted this long ${xn("The single unluckiest of all the simulated futures — the true tail. The average coverage can look reassuring; this is the worst it ever got. (10th-percentile: at least "+(s.p10||0).toFixed(0)+" years.)")}</div>
            </div>
            <div class="keynum">
              <div class="kn-val">${W(o.p50||0)}</div>
              <div class="kn-label">typically left at the end, today's money ${xn("The middle outcome for the pension pot left at the end, in present-day spending power. Futures that ran out count as £0, so this is not flattered by only the lucky runs.")}</div>
            </div>
            <div class="keynum">
              <div class="kn-val">${c.toFixed(0)} in 100</div>
              <div class="kn-label">futures where the plan had to cut back spending ${xn("To ride out a market slump the plan temporarily reduces withdrawals. This is how often that safety response was needed.")}</div>
            </div>
          </div>

          <h3 style="margin:8px 0 4px;">How your pot changes over time (today's money)</h3>
          <div class="chart-caption">The blue line is the middle outcome; the darker band is the middle half of futures, the lighter band the 10th–90th. Futures that ran out count as £0, so a sinking band means real risk. Hover any point for the figures.</div>
          ${OS(n.chartData.potBand)}

          <h3 style="margin:22px 0 4px;">Chance your plan is still going, year by year</h3>
          <div class="chart-caption">Share of futures in which the money hasn't run out yet — starts at 100% and dips where plans tend to fail. A late dip means most shortfalls happen late.</div>
          ${qm(n.chartData.solvency,{pct:!0,valueFmt:p=>p.toFixed(0)+"%",tip:(p,y)=>`Year ${y}: ${p.toFixed(0)}% of plans still going`})}

          ${VS(n.isa)}

          <details style="margin-top:22px;">
            <summary style="cursor:pointer;font-weight:600;color:var(--primary);">More detail — worst historical periods &amp; full statistics</summary>
            <div style="margin-top:16px;">
              ${r==="histResults"?LS(e):""}

              <h4 style="margin:20px 0 8px;">Pot left at the end — full range (today's money)</h4>
              <div class="grid-7" style="display:grid;grid-template-columns:repeat(7,1fr);gap:10px;">
                ${[["p5","unluckiest 5%"],["p10","10%"],["p25","25%"],["p50","middle"],["p75","75%"],["p90","90%"],["p95","luckiest 5%"]].map(([p,y])=>`
                  <div class="stat-box mini">
                    <div class="stat-value" style="font-size:13px;">${W(o[p]||0)}</div>
                    <div class="stat-label" style="font-size:10px;">${y}</div>
                  </div>`).join("")}
              </div>
              <p style="font-size:12px;color:var(--text-muted);margin-top:14px;line-height:1.6;">
                Based on ${f}. ${u?"Monte Carlo builds each future by stitching together random 5-year blocks of real history (1928–2024), so market slumps and inflation spikes arrive in realistic sustained runs rather than one-off years.":"Each run replays an actual stretch of history in its real order, capturing the true sequence of good and bad years."}
                A future "runs out" when the pension/cash pots hit zero before the plan ends.
              </p>
            </div>
          </details>
        </div>
      `;document.getElementById(r).innerHTML=m}function zS(n,e){let t='<div class="card"><h2>Scenario Analysis</h2>';t+=`
        <div class="chart-container" style="margin-bottom: 24px;">
          <canvas id="scenCompChart" width="900" height="400"></canvas>
        </div>
      `,t+='<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">';for(const[r,i]of Object.entries(n)){const s=i.result,o=s.failed?"danger":"success";t+=`
          <div class="history-item" style="border-left: 4px solid ${i.color};">
            <div>
              <div class="history-date">${i.name}</div>
              <div class="history-details">
                Protection: ${s.protMonths} mo | Max streak: ${s.maxConsec} mo
                ${s.hodlUsed>0?` | HODL used: ${W(s.hodlUsed)}`:""}
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 24px; color: var(--${o});">${s.years.toFixed(1)} yrs</div>
              <div style="font-size: 12px; color: var(--${o});">${s.failed?"FAILED":"OK"}</div>
              <div style="font-size: 11px; color: var(--text-muted);">Final: ${W(s.final)}</div>
            </div>
          </div>
        `}t+="</div></div>",document.getElementById(e).innerHTML=t,setTimeout(()=>{const r=document.getElementById("scenCompChart");r&&n&&IS(r,n,{years:35,title:"Scenario Comparison"})},50)}const Ea={cautious:{key:"cautious",label:"Cautious",equity:.3,bond:.45,diversifiers:.12,cash:.13},balanced:{key:"balanced",label:"Balanced",equity:.5,bond:.3,diversifiers:.15,cash:.05},adventurous:{key:"adventurous",label:"Adventurous",equity:.65,bond:.15,diversifiers:.15,cash:.05}};function Ym(n){const e=document.getElementById(n+"Diversifiers");return!!(e&&e.checked)}window._customAlloc=window._customAlloc||{};window._allocMode=window._allocMode||{};function Zc(n){return window._allocMode[n]||"risk"}function jm(n){if(window._customAlloc[n])return window._customAlloc[n];const e=document.querySelector("#"+n+"Risks .risk-card.active"),t=e&&e.dataset.risk||"balanced",r=Ym(n)?Ea:Mn;return r[t]||r.balanced}function Wm(n,e,t,r){r=r||0;const i=r>.001?Ea:Mn;let s="balanced",o=1/0;for(const l in i){const c=i[l],u=(c.equity-n)**2+(c.bond-e)**2+((c.diversifiers||0)-r)**2+(c.cash-t)**2;u<o&&(o=u,s=l)}return s}window.updateAllocDisplay=function(n){const e=jm(n),t=Math.round(e.equity*100),r=Math.round(e.bond*100),i=Math.round(e.cash*100),s=Math.round((e.diversifiers||0)*100),o=document.getElementById(n+"AllocAmounts"),l=window._customAlloc[n],c=document.getElementById(n+"Pot");if(l&&c){const B=Math.round((l.equityMin||0)+(l.bondMin||0)+(l.cashTarget||0)+(l.diversifierStart||0));+c.value!==B&&(c.value=B,c._updateOverlay&&c._updateOverlay());const $=document.getElementById(n+"PotDisplay");$&&($.textContent="£"+B.toLocaleString())}const u=+document.getElementById(n+"Pot").value||0,f=l?l.equityMin:Math.round(u*t/100),m=l?l.bondMin:Math.round(u*r/100),p=l?l.cashTarget:Math.round(u*i/100),y=l?l.diversifierStart||0:Math.round(u*s/100),I=s>0?" &middot; "+s+"% diversifiers":"",S=s>0?" &middot; £"+y.toLocaleString()+" diversifiers":"";o&&(o.innerHTML="<strong>"+e.label+"</strong> &mdash; "+t+"% shares &middot; "+r+"% bonds"+I+" &middot; "+i+'% cash<br><span style="color:var(--text-muted);">£'+f.toLocaleString()+" shares &middot; £"+m.toLocaleString()+" bonds"+S+" &middot; £"+p.toLocaleString()+" cash</span>");const x=document.getElementById(n+"EquityGlide"),k=!!(x&&x.checked),C=document.getElementById(n+"GlideEndgame");C&&(k&&l?(C.style.display="block",C.innerHTML=qS(n)):C.style.display="none");const N=document.getElementById(n+"GlideMinNote");N&&(k?(N.style.display="block",N.innerHTML=US(n,e)):N.style.display="none")};function US(n,e){const t=document.getElementById(n+"Duration"),r=t&&+t.value||35,i=Math.max(5,r-20),s=e.cash,o=e.diversifiers||0,l=1-s-o,c=window._customAlloc[n],u=!!c,f=u&&c.glideEndgame?c.glideEndgame:null,m=u?Ah(e.equity,e.bond,f):bs(e.equity,e.bond),p=Math.round(l*m.start*100),y=Math.round(l*m.end*100),I=Math.round(l*(1-m.start)*100),S=Math.round(l*(1-m.end)*100),x=Math.round(s*100),k=Math.round(o*100),C=6,N=314,B=18,$=104,q=$-B,T=be=>($-be*q).toFixed(1),v=(C+(N-C)*Math.min(1,i/r)).toFixed(1),_=T(s),b=T(s+o),E=T(s+o+l*(1-m.start)),A=T(s+o+l*(1-m.end)),w="#6366f1",le="#14b8a6",pe="#94a3b8",H="#f59e0b",ee=o>0?`<polygon points="${C},${_} ${N},${_} ${N},${b} ${C},${b}" fill="${H}"></polygon>`:"",ne=`<svg viewBox="0 0 320 122" style="width:100%;height:auto;display:block;" preserveAspectRatio="none"><polygon points="${C},${$} ${N},${$} ${N},${_} ${C},${_}" fill="${pe}"></polygon>`+ee+`<polygon points="${C},${b} ${N},${b} ${N},${A} ${v},${A} ${C},${E}" fill="${le}"></polygon><polygon points="${C},${E} ${v},${A} ${N},${A} ${N},${B} ${C},${B}" fill="${w}"></polygon><line x1="${v}" y1="${B}" x2="${v}" y2="${$}" stroke="rgba(148,163,184,0.9)" stroke-width="1" stroke-dasharray="3,2"></line></svg>`,te=be=>`<span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${be};vertical-align:middle;"></span>`,Ce=o>0?" · "+k+"% diversifiers":"",ke=o>0?" &nbsp; "+te(H)+" Diversifiers":"",ye=u?"Now (your funds)":"Starts",O=u?"Rises to"+(f&&f.label?" ("+f.label+")":""):"Then holds ("+e.label+")",Z=u?"rises from your holdings, levels off at year "+i:"reaches your mix at year "+i+", then holds";return'<div style="font-weight:600;margin-bottom:6px;">How your mix glides over '+r+" years</div>"+ne+'<div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);margin-top:3px;"><span>Now</span><span>'+Z+'</span></div><div style="display:flex;justify-content:space-between;gap:12px;font-size:12px;margin-top:8px;"><span><strong>'+ye+"</strong><br>"+p+"% shares · "+I+"% bonds"+Ce+" · "+x+'% cash</span><span style="text-align:right;"><strong>'+O+"</strong><br>"+y+"% shares · "+S+"% bonds"+Ce+" · "+x+'% cash</span></div><div style="font-size:12px;margin-top:8px;">'+te(w)+" Shares &nbsp; "+te(le)+" Bonds"+ke+" &nbsp; "+te(pe)+" Cash</div>"}window.setRiskPreset=function(n,e){Mn[e]&&(window._allocMode[n]="risk",delete window._customAlloc[n],document.querySelectorAll("#"+n+"Risks .risk-card").forEach(t=>t.classList.toggle("active",t.dataset.risk===e)),updateAllocDisplay(n))};window.setAllocMode=function(n,e){window._allocMode[n]=e;const t=document.getElementById(n+"ModeRisk"),r=document.getElementById(n+"ModeFunds");t&&t.classList.toggle("active",e==="risk"),r&&r.classList.toggle("active",e==="funds");const i=document.getElementById(n+"RiskMode"),s=document.getElementById(n+"FundsMode");if(i&&(i.style.display=e==="risk"?"":"none"),s&&(s.style.display=e==="funds"?"":"none"),e==="funds")renderFunds(n),eu(n);else if(delete window._customAlloc[n],!document.querySelector("#"+n+"Risks .risk-card.active")){const o=document.querySelector("#"+n+'Risks .risk-card[data-risk="balanced"]');o&&o.classList.add("active")}updateAllocDisplay(n),typeof updateEntryTagPrompt=="function"&&updateEntryTagPrompt()};function qS(n){const e=window._customAlloc[n]&&window._customAlloc[n].glideEndgame&&window._customAlloc[n].glideEndgame.key||"",t=(r,i)=>'<button type="button" class="risk-btn'+(e===r?" active":"")+`" style="padding:6px 12px;" onclick="setGlideEndgame('`+n+"','"+r+`')">`+i+"</button>";return'<div style="font-size:12px;color:var(--text-muted);margin-bottom:6px;"><strong>Glide towards</strong> — your funds are the start; the tent raises shares over time to this level:</div><div style="display:flex;gap:8px;flex-wrap:wrap;">'+t("cautious","Cautious")+t("balanced","Balanced")+t("adventurous","Adventurous")+"</div>"}window.setGlideEndgame=function(n,e){const t=window._customAlloc[n];if(!t)return;const i=(Ym(n)?Ea:Mn)[e];if(!i)return;t.glideEndgame={equityPct:i.equity,bondPct:i.bond,key:e,label:i.label};const s=t.equity/(t.equity+t.bond||1);i.equity/(i.equity+i.bond||1)<=s&&showToast("That endgame isn’t more share-heavy than your holdings — the glide would flatten or decline, not rise.","warning",5e3),updateAllocDisplay(n)};window.readAlloc=function(n){const e=window._customAlloc[n];if(e){const o={equityMin:e.equityMin,bondMin:e.bondMin,cashTarget:e.cashTarget};return e.diversifierStart>0&&(o.diversifierStart=e.diversifierStart),e.subAsset&&(o.subAsset=e.subAsset),e.glideEndgame&&(o.glideEndgame=e.glideEndgame),o}const t=+document.getElementById(n+"Pot").value||0,r=jm(n),i={equityMin:Math.round(t*r.equity),bondMin:Math.round(t*r.bond),cashTarget:Math.round(t*r.cash)},s=r.diversifiers||0;return s>0&&(i.diversifierStart=Math.round(t*s),i.subAsset={}),i};window.writeAlloc=function(n,e,t,r,i){const s=+i||0,o=(+e||0)+(+t||0)+(+r||0)+s;document.getElementById(n+"Pot").value=Math.round(o);const l=document.getElementById(n+"Diversifiers");l&&(l.checked=s>0);const c=o>0?Math.round((+e||0)/o*100):50,u=o>0?Math.round((+t||0)/o*100):40,f=o>0?Wm((+e||0)/o,(+t||0)/o,(+r||0)/o,s/o):"balanced";document.querySelectorAll("#"+n+"Risks .risk-card").forEach(p=>p.classList.toggle("active",p.dataset.risk===f)),updateAllocDisplay(n);const m=(s>0?Ea:Mn)[f];if(o>0&&(c!==Math.round(m.equity*100)||u!==Math.round(m.bond*100))){const p=document.getElementById(n+"AllocAmounts");p&&(p.innerHTML+='<div style="margin-top:8px;color:#b45309;font-size:12px;">Your saved split ('+c+"% / "+u+"% / "+Math.max(0,100-c-u)+"%) was matched to the nearest risk level (<strong>"+m.label+"</strong>). Pick another if you prefer — saving keeps this one.</div>")}};window._taggedFunds=window._taggedFunds||{};function Rt(n){return window._taggedFunds[n]=window._taggedFunds[n]||[]}const Gm={shares:"Shares",bonds:"Bonds",diversifiers:"Diversifiers",cash:"Cash"};function HS(n){const e=document.getElementById(n+"FundCatalogue");e&&!e.childElementCount&&(e.innerHTML=ma.map(t=>'<option value="'+t.ticker+'">'+t.ticker+" — "+t.name+"</option>").join(""))}function Vo(n){return n.subClass||hm[(n.ticker||"").toUpperCase().trim()]||""}window.reformatMoney=function(n){const e=parseFloat(String(n.value).replace(/[^0-9.]/g,""));n.value=isNaN(e)||e===0?"":Gc(e)};function YS(n,e,t){if(n=n.toLowerCase().trim(),!n)return 0;const r=e.toLowerCase(),i=t.toLowerCase();if(r===n)return 1e3;if(r.startsWith(n))return 900-(r.length-n.length);if(i.split(/[^a-z0-9]+/).filter(Boolean).some(l=>l.startsWith(n)))return 820;if(r.includes(n))return 720;if(i.includes(n))return 660-Math.min(50,i.indexOf(n));const o=l=>{let c=0;for(const u of l)if(u===n[c]&&c++,c===n.length)return!0;return!1};return o(r)?360:o(i)?300:0}function jS(n,e=8){return ma.map(t=>({f:t,s:YS(n,t.ticker,t.name)})).filter(t=>t.s>0).sort((t,r)=>r.s-t.s).slice(0,e).map(t=>t.f)}window.showFundSearch=function(n,e){const t=document.getElementById(n+"FundSearchResults");if(!t)return;const r=jS(e);if(!e.trim()||!r.length){t.style.display="none",t.innerHTML="";return}t.innerHTML=r.map(i=>`<div class="fund-search-item" onmousedown="addFundFromSearch('`+n+"','"+i.ticker+`')" style="padding:7px 10px; cursor:pointer;"><strong>`+i.ticker+'</strong> <span style="color:var(--text-muted);font-size:12px;">'+i.name+"</span></div>").join(""),t.style.display="block"};window.hideFundSearch=function(n){const e=document.getElementById(n+"FundSearchResults");e&&(e.style.display="none")};window.addFundFromSearch=function(n,e){const t=Bc(e);Rt(n).push({ticker:e,value:"",wrapper:"SIPP",subClass:t?t.subClass:""});const r=document.getElementById(n+"FundSearch");r&&(r.value=""),hideFundSearch(n),renderFunds(n)};function Km(n,e,t){const r=$T();let i='<option value="">— not set —</option>';for(const s of["shares","bonds","diversifiers","cash"]){const o=r[s]||[];o.length&&(i+='<optgroup label="'+Gm[s]+'">'+o.map(l=>'<option value="'+l.key+'"'+(l.key===t?" selected":"")+">"+l.label+"</option>").join("")+"</optgroup>")}return`<select onchange="updateFundField('`+n+"',"+e+`,'subClass',this.value)" style="width:190px;">`+i+"</select>"}window.renderFunds=function(n){const e=document.getElementById(n+"FundRows");e&&(HS(n),e.innerHTML=Rt(n).map((t,r)=>'<tr><td style="padding:3px 6px;"><input type="text" list="'+n+'FundCatalogue" value="'+(t.ticker||"")+`" oninput="updateFundField('`+n+"',"+r+`,'ticker',this.value)" style="width:92px;text-transform:uppercase;" placeholder="e.g. VWRL"></td><td style="padding:3px 6px;"><input type="text" inputmode="numeric" value="`+(t.value?Gc(t.value):"")+`" oninput="updateFundField('`+n+"',"+r+`,'value',this.value)" onblur="reformatMoney(this)" style="width:110px;" placeholder="0"></td><td style="padding:3px 6px;"><select onchange="updateFundField('`+n+"',"+r+`,'wrapper',this.value)" style="width:74px;"><option`+(t.wrapper!=="ISA"?" selected":"")+">SIPP</option><option"+(t.wrapper==="ISA"?" selected":"")+'>ISA</option></select></td><td id="'+n+"_fcat_"+r+'" style="padding:3px 6px;">'+Km(n,r,Vo(t))+`</td><td style="padding:3px 6px;"><button type="button" class="risk-btn" style="padding:2px 8px;" onclick="removeFund('`+n+"',"+r+')">&times;</button></td></tr>').join(""),Qm(n))};window.updateFundField=function(n,e,t,r){const i=Rt(n)[e];if(i){if(t==="value")i.value=parseFloat(String(r).replace(/[^0-9.]/g,""))||0;else if(t==="ticker"){i.ticker=r;const s=Bc(r);s&&(i.subClass=s.subClass);const o=document.getElementById(n+"_fcat_"+e);o&&(o.innerHTML=Km(n,e,Vo(i)))}else t==="subClass"?i.subClass=r:i[t]=r;Qm(n)}};window.addFundRow=function(n){Rt(n).push({ticker:"",value:"",wrapper:"SIPP"}),renderFunds(n)};window.removeFund=function(n,e){Rt(n).splice(e,1),renderFunds(n)};window.clearFunds=function(n){window._taggedFunds[n]=[],renderFunds(n)};window.loadPdfExample=function(n){window._taggedFunds[n]=KI.map(e=>({ticker:e.ticker,value:e.value,wrapper:e.wrapper})),renderFunds(n)};function Qm(n){const e=document.getElementById(n+"FundSummary");if(!e)return;const t=Rt(n).filter(c=>c.ticker&&c.value>0);if(!t.length){e.innerHTML='<span style="color:var(--text-muted);font-size:12px;">Add holdings above to see the bucket roll-up.</span>';return}const r=qc(t),i=c=>r.total?Math.round(r.buckets[c]/r.total*100):0,s=c=>"£"+Math.round(c).toLocaleString(),o=c=>Object.entries(c).map(([u,f])=>Wt[u].label+" "+Math.round(f*100)+"%").join(" · ");let l='<div style="font-weight:600;margin-bottom:6px;">Rolls up to ('+s(r.total)+" total"+(r.isaTotal?", "+s(r.isaTotal)+" ISA":"")+")</div>";l+='<div style="font-size:13px;">';for(const c of["shares","bonds","diversifiers","cash"])r.buckets[c]&&(l+="<div><strong>"+Gm[c]+"</strong>: "+s(r.buckets[c])+" ("+i(c)+"%)"+(c==="bonds"&&Object.keys(r.bondWeights).length?' <span style="color:var(--text-muted);font-size:11px;">— '+o(r.bondWeights)+"</span>":"")+(c==="diversifiers"&&Object.keys(r.diversifierWeights).length?' <span style="color:var(--text-muted);font-size:11px;">— '+o(r.diversifierWeights)+"</span>":"")+"</div>");l+="</div>",r.untagged.length&&(l+='<div style="color:#b45309;font-size:12px;margin-top:6px;">Not recognised (ignored): '+r.untagged.map(c=>c.ticker).join(", ")+"</div>"),e.innerHTML=l,Zc(n)==="funds"&&(eu(n),updateAllocDisplay(n))}function eu(n){const e=Rt(n).filter(l=>l.ticker&&l.value>0);if(!e.length)return delete window._customAlloc[n],null;const t=qc(e),r=GI(t),i=window._customAlloc[n]||{};window._customAlloc[n]={label:"Your funds",equity:t.total?t.buckets.shares/t.total:0,bond:t.total?t.buckets.bonds/t.total:0,diversifiers:t.total?t.buckets.diversifiers/t.total:0,cash:t.total?t.buckets.cash/t.total:0,equityMin:r.equityStart,bondMin:r.bondStart,cashTarget:r.cashStart,diversifierStart:r.diversifierStart||0,subAsset:r.subAsset||null,glideEndgame:i.glideEndgame||null};const s=document.getElementById(n+"Pot");s&&(s.value=Math.round(t.total),s._updateOverlay&&s._updateOverlay());const o=document.getElementById(n+"Diversifiers");if(o&&(o.checked=(r.diversifierStart||0)>0),t.isaTotal){const l=document.getElementById(n+"IsaBalance");l&&(l.value=Math.round(t.isaTotal),l._updateOverlay&&l._updateOverlay())}return t}window.applyTaggedPortfolio=function(n){if(window._allocMode[n]="funds",!eu(n)){showToast("Add some holdings first","warning");return}updateAllocDisplay(n)};window.restoreCustomAllocFromSettings=function(n,e){if(e&&e.subAsset&&e.subAsset.bondWeights&&Object.keys(e.subAsset.bondWeights).length){const t=(e.equityMin||0)+(e.bondMin||0)+(e.cashTarget||0)+(e.diversifierStart||0);window._customAlloc[n]={label:"Your funds",equity:t?e.equityMin/t:0,bond:t?e.bondMin/t:0,diversifiers:t?(e.diversifierStart||0)/t:0,cash:t?e.cashTarget/t:0,equityMin:e.equityMin,bondMin:e.bondMin,cashTarget:e.cashTarget,diversifierStart:e.diversifierStart||0,subAsset:e.subAsset,glideEndgame:e.glideEndgame||null}}else delete window._customAlloc[n]};function WS(n){const e={shares:[],bonds:[],diversifiers:[],cash:[]};n.tagged.forEach(s=>{e[s.bucket]&&e[s.bucket].push(s)});const t=s=>"£"+Math.round(s).toLocaleString(),r={shares:"Shares",bonds:"Bonds",diversifiers:"Diversifiers",cash:"Cash"};let i='<div style="font-size:12px;border:1px solid var(--border,#cbd5e1);border-radius:8px;padding:10px 12px;">';i+='<div style="font-weight:600;margin-bottom:6px;">Which of your funds went where</div>';for(const s of["shares","bonds","diversifiers","cash"]){if(!e[s].length)continue;const o=e[s].reduce((l,c)=>l+(+c.value||0),0);i+='<div style="margin:3px 0;"><strong>'+r[s]+"</strong> "+t(o)+': <span style="color:var(--text-muted);">'+e[s].map(l=>l.ticker).join(", ")+"</span></div>"}return n.isaTotal&&(i+='<div style="margin-top:4px;color:var(--text-muted);">of which £'+Math.round(n.isaTotal).toLocaleString()+" is in an ISA (the bridge)</div>"),n.untagged.length&&(i+='<div style="color:#b45309;margin-top:4px;">Not recognised: '+n.untagged.map(s=>s.ticker).join(", ")+"</div>"),i+="</div>",i}window._fundModal={fieldId:null,subtotal:0};window.openFundBucketModal=function(n,e,t){const r=Rt("ds").filter(s=>{const o=Vo(s);return s.ticker&&o&&Wt[o]&&Wt[o].bucket===n});window._fundModal={fieldId:e,subtotal:0},document.getElementById("fundModalTitle").textContent=t;const i=document.getElementById("fundModalRows");r.length?i.innerHTML=r.map(s=>{const o=Bc(s.ticker),l=Wt[Vo(s)],c=o?o.name:l?l.label:"";return'<div style="display:flex; align-items:center; justify-content:space-between; gap:12px; margin:8px 0;"><span><strong>'+s.ticker+'</strong> <span style="color:var(--text-muted);font-size:12px;">'+c+'</span></span><span style="white-space:nowrap;">£ <input type="number" class="fund-modal-input" oninput="updateFundModalSubtotal()" style="width:120px;" placeholder="0"></span></div>'}).join(""):i.innerHTML='<p style="color:var(--text-muted);">No '+t.toLowerCase()+" tagged yet. Define your holdings in <strong>Settings → Build from my funds</strong>, then come back — or just type the total into the box.</p>",updateFundModalSubtotal(),document.getElementById("fundBucketModal").style.display="flex"};window.updateFundModalSubtotal=function(){let n=0;document.querySelectorAll("#fundModalRows .fund-modal-input").forEach(e=>{n+=+e.value||0}),window._fundModal.subtotal=n,document.getElementById("fundModalSubtotal").textContent="Total: £"+Math.round(n).toLocaleString()};window.applyFundBucketModal=function(){const n=document.getElementById(window._fundModal.fieldId);n&&(n.value=Math.round(window._fundModal.subtotal||0)),closeFundBucketModal()};window.closeFundBucketModal=function(){document.getElementById("fundBucketModal").style.display="none"};window.updateEntryTagPrompt=function(){const n=document.getElementById("entryTagPrompt");if(!n)return;if(Rt("ds").filter(t=>t.ticker).length>0){n.style.display="none",n.innerHTML="";return}n.style.display="block",n.innerHTML='<div class="alert alert-info" style="font-size:13px;">The Decision Tool works from your real portfolio. Tag your funds in <strong>Settings → “Build from my funds”</strong> to enter values per fund via the <em>enter per fund ▸</em> links. You can still type bucket totals directly.</div>'};window.fillDecisionFromTaggedFunds=async function(){let n=Rt("ds").filter(i=>i.ticker&&i.value>0);if(n.length||(n=Rt("ss").filter(i=>i.ticker&&i.value>0)),!n.length)try{n=((await Vt()).taggedFunds||[]).filter(s=>s.ticker&&s.value>0)}catch{}if(!n.length){showToast('No tagged funds yet — tag your holdings in Settings → "Build from my funds", then come back.',"info",6e3);return}const e=qc(n),t=(i,s)=>{const o=document.getElementById(i);o&&(o.value=Math.round(s))};t("entryEquity",e.buckets.shares),t("entryBond",e.buckets.bonds),t("entryCash",e.buckets.cash),t("entryDiversifier",e.buckets.diversifiers),e.isaTotal&&t("entryIsa",e.isaTotal);const r=document.getElementById("entryFundTagHelp");r&&(r.innerHTML=WS(e)),showToast("Filled your fund values from "+n.length+" tagged funds","success")};function Jm(n,e){const t=(n.equityMin||0)+(n.bondMin||0)+(n.cashTarget||0),r=t>0?Wm(n.equityMin/t,n.bondMin/t,n.cashTarget/t):"balanced",i=Mn[r],s=l=>"£"+Math.round(l||0).toLocaleString(),o=Math.round(i.equity*100)+"/"+Math.round(i.bond*100)+"/"+Math.round(i.cash*100);return`<div class="rpt-header">
        <h1>Pension Decision Plan</h1>
        <div class="rpt-sub">${e||""}</div>
        <table class="rpt-meta"><tbody>
          <tr><td>Total pot</td><td>${s(t)}</td><td>Risk level</td><td>${i.label} (${o})</td></tr>
          <tr><td>Bond tent</td><td>${n.equityGlideEnabled?"On — rising-equity glidepath":"Off"}</td><td>Target income</td><td>${s(n.baseSalary)}/yr</td></tr>
          <tr><td>Duration</td><td>${n.duration||35} yrs</td><td>Generated</td><td>${new Date().toLocaleDateString("en-GB")}</td></tr>
        </tbody></table>
      </div>`}function Xm(n){let e=document.getElementById("printPortal");e||(e=document.createElement("div"),e.id="printPortal",document.body.appendChild(e)),e.innerHTML=n,document.body.classList.add("printing"),window.print()}window.addEventListener("afterprint",()=>{document.body.classList.remove("printing");const n=document.getElementById("printPortal");n&&(n.innerHTML="")});function GS(n,e,t){const r=new Blob([e],{type:t}),i=URL.createObjectURL(r),s=document.createElement("a");s.href=i,s.download=n,document.body.appendChild(s),s.click(),s.remove(),setTimeout(()=>URL.revokeObjectURL(i),1e3)}window.printAnnualReport=async function(n){const e=await It();Xm(Jm(e,"Annual report — tax year "+n)+document.getElementById("taxYearDetail").innerHTML)};window.printMonthlyReport=async function(n){const e=await It();Xm(Jm(e,"Monthly record — "+n)+document.getElementById("historyDetail").innerHTML)};window.exportAnnualCsv=function(n){const e=(typeof tn<"u"?tn:[]).filter(o=>o.taxYear===n).sort((o,l)=>(o.date||"").localeCompare(l.date||"")),t=o=>(o=o==null?"":String(o),/[",\n]/.test(o)?'"'+o.replace(/"/g,'""')+'"':o),r=o=>Math.round(o||0);let s=["Date","Draw source","SIPP draw","ISA draw","From equity","From bond","From cash","Protection","Equity target","Bond target","Cash target","Total pot","Rebalance"].map(t).join(",")+`
`;for(const o of e)s+=[o.date,o.source,r(o.sipp),r(o.isa),r(o.dEquity),r(o.dBond),r(o.dCash),o.inProtection?"Yes":"No",r(o.adjEquity),r(o.adjBond),r(o.adjCash),r(o.total),o.rebal||""].map(t).join(",")+`
`;e.length||(s+=`(no monthly records saved for this tax year yet)
`),GS("decision-plan-"+n.replace("/","-")+".csv",s,"text/csv;charset=utf-8;")};window.runCompareStrategiesUI=async function(n){const e=document.getElementById("optimiseBtn"+n),t=document.getElementById("optimiseResults"+n);e&&(e.disabled=!0,e.textContent="Comparing..."),t&&(t.innerHTML='<div class="loading"><div class="spinner"></div>Running six strategies…</div>');const r=JSON.parse(JSON.stringify(await Vt())),i=document.getElementById(n==="MC"?"mcYears":"histYears"),s=parseInt(i&&i.value)||r.duration,o=(r.equityMin||0)+(r.bondMin||0)+(r.cashTarget||0),l=Object.keys(Br).map(Number).sort((p,y)=>p-y),c=Math.max(...l),u=p=>{const y=[];if(n==="MC")for(let C=0;C<1e3;C++)y.push(_i(p,$c(p,C),C));else l.forEach(C=>{if(C+s-1>c)return;const N={equity:{},inflation:{}};for(let B=0;B<s;B++)N.equity[B]=Br[C+B]||0,N.inflation[B]=$o[C+B]||.025;y.push(_i(p,N,C))});const I=y.length||1,S=y.reduce((C,N)=>C+Math.min(1,(N.years||0)/(N.duration||s)),0)/I*100,x=y.filter(C=>!C.failed).length/I*100,k=y.reduce((C,N)=>Math.min(C,N.years||0),1/0);return{coverage:S,rate:x,minYears:k===1/0?0:k}},f=["cautious","balanced","adventurous"],m={};for(const p of f){const y=Mn[p];m[p]={};for(const I of[!1,!0]){const S={...r,equityMin:Math.round(o*y.equity),bondMin:Math.round(o*y.bond),cashTarget:Math.round(o*y.cash),equityGlideEnabled:I},x=Bs({years:s},S);m[p][I?"tent":"flat"]=u(x),await new Promise(k=>setTimeout(k,0))}}KS(t,m,f),e&&(e.disabled=!1,e.textContent="Compare strategies")};function KS(n,e,t){let r={cov:-1,key:null,tent:null};for(const o of t)for(const l of["flat","tent"])e[o][l].coverage>r.cov&&(r={cov:e[o][l].coverage,key:o,tent:l});const i=(o,l)=>`<td style="text-align:center;padding:10px;border:1px solid var(--border);${l?"background:rgba(16,185,129,0.12);":""}">
          <div style="font-size:22px;font-weight:700;color:var(--${l?"success":"text"});">${o.coverage.toFixed(0)}%</div>
          <div style="font-size:11px;color:var(--text-muted);">worst case ${o.minYears.toFixed(0)} yrs</div>
        </td>`;let s='<h3 style="margin-bottom:6px;">Compare strategies</h3>';s+=`<p style="color:var(--text-muted);font-size:13px;margin-bottom:12px;">Coverage = the share of your retirement years the pot funds (worst case = the fewest years it lasted in any run). More shares usually buys a little more coverage but a rougher ride; the bond tent mainly lifts the worst case. Pick the risk level you're comfortable holding — the tool won't change it for you.</p>`,s+='<table style="border-collapse:collapse;width:100%;max-width:520px;"><thead><tr><th style="text-align:left;padding:8px;"></th><th style="padding:8px;">Flat</th><th style="padding:8px;">+ Bond tent</th></tr></thead><tbody>';for(const o of t){const l=Mn[o];s+=`<tr><td style="padding:8px;border:1px solid var(--border);"><strong>${l.label}</strong><br><span style="font-size:11px;color:var(--text-muted);">${Math.round(l.equity*100)}/${Math.round(l.bond*100)}/${Math.round(l.cash*100)}</span></td>`,s+=i(e[o].flat,r.key===o&&r.tent==="flat"),s+=i(e[o].tent,r.key===o&&r.tent==="tent"),s+="</tr>"}s+="</tbody></table>",s+=`<p style="margin-top:12px;font-size:13px;">Best coverage: <strong>${Mn[r.key].label}${r.tent==="tent"?" + bond tent":""}</strong> at ${r.cov.toFixed(0)}%. Set it in Settings if you'd like it.</p>`,n&&(n.innerHTML=s)}async function Ta(){Et("Loading settings...");try{const n=await Vt();document.getElementById("ssBaseSalary").value=n.baseSalary,writeAlloc("ss",n.equityMin,n.bondMin,n.cashTarget,n.diversifierStart||0),restoreCustomAllocFromSettings("ss",n),window._taggedFunds.ss=(n.taggedFunds||[]).map(t=>({...t})),setAllocMode("ss",n.allocMode||(n.taggedFunds&&n.taggedFunds.length?"funds":"risk")),document.getElementById("ssDuration").value=n.duration,document.getElementById("ssPA").value=n.pa,document.getElementById("ssBRL").value=n.brl,document.getElementById("ssHRL").value=n.hrl,document.getElementById("ssTaxMode").value=n.taxMode||"inflates",document.getElementById("ssOther").value=n.other||0,document.getElementById("ssSpStartDate").value=n.spStartDate||"",document.getElementById("ssSpWeeklyAmount").value=n.spWeeklyAmount||"",Sl("ss"),document.getElementById("ssConsecutiveLimit").value=n.consecutiveLimit||3,document.getElementById("ssProtectionMult").value=n.protectionMult||.8,document.getElementById("ssDisableProtection").checked=n.disableProtection||!1,document.getElementById("ssHodlEnabled").checked=n.hodlEnabled||!1,document.getElementById("ssHodlValue").value=n.hodlValue||25e3,document.getElementById("ssSpendingProfile").value=n.spendingProfile||"flat",document.getElementById("ssEquityGlide").checked=n.equityGlideEnabled||!1,updateAllocDisplay("ss"),document.getElementById("ssIsaBalance").value=n.isaBalance||0;const e=document.getElementById("ssSeedNote");e&&(e.textContent=n.seededFrom==="decision"&&n.seededAt?"Seeded from Decision Tool "+new Date(n.seededAt).toLocaleDateString():""),_a()}catch(n){console.error("Error loading stress settings:",n)}finally{Tt()}}window.saveStressSettingsUI=async function(){if(!gt()){showToast("Please sign in to save settings","error");return}const n=ga(document.getElementById("ssSpStartDate").value.trim());if(!n.valid){showToast(n.error,"error");return}n.warning&&showToast(n.warning,"warning");const e=readAlloc("ss");if(Jc(e.equityMin,e.bondMin,e.cashTarget)){Et("Saving settings...");try{await ya({baseSalary:+document.getElementById("ssBaseSalary").value,equityMin:e.equityMin,bondMin:e.bondMin,cashTarget:e.cashTarget,duration:+document.getElementById("ssDuration").value,pa:+document.getElementById("ssPA").value,brl:+document.getElementById("ssBRL").value,hrl:+document.getElementById("ssHRL").value,taxMode:document.getElementById("ssTaxMode").value,other:+document.getElementById("ssOther").value,spStartDate:document.getElementById("ssSpStartDate").value.trim()||null,spWeeklyAmount:+document.getElementById("ssSpWeeklyAmount").value||0,consecutiveLimit:+document.getElementById("ssConsecutiveLimit").value,protectionMult:+document.getElementById("ssProtectionMult").value,disableProtection:document.getElementById("ssDisableProtection").checked,hodlEnabled:document.getElementById("ssHodlEnabled").checked,hodlValue:+document.getElementById("ssHodlValue").value,isaBalance:+document.getElementById("ssIsaBalance").value||0,spendingProfile:document.getElementById("ssSpendingProfile").value,equityGlideEnabled:document.getElementById("ssEquityGlide").checked,diversifierStart:e.diversifierStart||0,subAsset:e.subAsset||null,glideEndgame:e.glideEndgame||null,allocMode:Zc("ss"),taggedFunds:Rt("ss").filter(t=>t.ticker&&t.value>0)}),Xc({...e,duration:+document.getElementById("ssDuration").value||35}),showToast("Settings saved successfully","success")}catch(t){console.error("Error saving stress settings:",t),showToast("Error saving: "+t.message,"error")}finally{Tt()}}};window.copyStressFromDecisionUI=async function(){if(!gt()){showToast("Please sign in first","error");return}if(confirm("Copy your Decision Tool plan basics (funds, income, State Pension, ISA, protection) into the Stress Tester? Your Stress-specific what-ifs (tax mode, HODL) are kept.")){Et("Copying from Decision...");try{const n=await It(),e=await Vt(),t=vT(n,e);await ya(t),await Ta(),showToast("Stress Tester seeded from your Decision plan","success")}catch(n){console.error("Error copying from decision:",n),showToast("Error copying: "+n.message,"error")}finally{Tt()}}};window.resetStressSettingsUI=async function(){if(confirm("Reset all stress settings to defaults?")){Et("Resetting settings...");try{await TI(),await Ta(),showToast("Settings reset to defaults","success")}catch(n){console.error("Error resetting settings:",n),showToast("Error resetting: "+n.message,"error")}finally{Tt()}}};async function tu(){Et("Loading settings...");try{const n=await It();document.getElementById("dsDuration").value=n.duration||35,writeAlloc("ds",n.equityMin??25e4,n.bondMin??2e5,n.cashTarget??5e4,n.diversifierStart||0),restoreCustomAllocFromSettings("ds",n),window._taggedFunds.ds=(n.taggedFunds||[]).map(e=>({...e})),setAllocMode("ds",n.allocMode||(n.taggedFunds&&n.taggedFunds.length?"funds":"risk")),document.getElementById("dsEquityGlide").checked=n.equityGlideEnabled||!1,updateAllocDisplay("ds"),document.getElementById("dsBaseSalary").value=n.baseSalary||3e4,document.getElementById("dsSpendingProfile").value=n.spendingProfile||"flat",document.getElementById("dsProtectionFactor").value=n.protectionFactor||20,document.getElementById("dsRecoveryBuffer").value=n.recoveryBuffer||15e3,document.getElementById("dsConsecutiveLimit").value=n.consecutiveLimit||3,document.getElementById("dsIsaBalance").value=n.isaBalance||0,document.getElementById("entryEquity").value="",document.getElementById("entryBond").value="",document.getElementById("entryCash").value="",document.getElementById("entryIsa").value="",_a(),await su()}catch(n){console.error("Error loading decision settings:",n)}finally{Tt()}}let QS=0;const Fn=()=>"b"+ ++QS,ss=n=>"£"+Math.round(+n||0).toLocaleString(),Cn=n=>String(n??"").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;");function Rl(n){const e={...ps(),...n||{}};return e.lines=(Array.isArray(e.lines)?e.lines:[]).map(t=>({id:t.id||Fn(),...t})),e.oneOffs=(Array.isArray(e.oneOffs)?e.oneOffs:[]).map(t=>({id:t.id||Fn(),...t})),e}async function JS(){try{window._budget=Rl(await _m())}catch(n){console.error("Budget load error:",n),window._budget=Rl(ps())}window._budget.lines.length||(window._budget.lines=hT().map(n=>({id:Fn(),...n})),window._budget.oneOffs.length||(window._budget.oneOffs=fT().map(n=>({id:Fn(),...n})))),document.getElementById("budCurrentAge").value=window._budget.currentAge,document.getElementById("budRetireAge").value=window._budget.retirementAge,document.getElementById("budEndAge").value=window._budget.endAge,document.getElementById("budShared").checked=!!window._budget.sharedWithPartner,document.getElementById("budSharePct").value=window._budget.mySharePct??50,document.getElementById("budShareRow").style.display=window._budget.sharedWithPartner?"block":"none",Hn(),ki(),Je()}function Zm(n,e,t){const r=(i,s)=>'<option value="'+i+'"'+((e||"me")===i?" selected":"")+">"+s+"</option>";return'<select title="Who pays this?" onchange="'+t+"('"+n+`','paidBy',this.value)" style="flex:0 0 96px;">`+r("me","Me")+r("partner","Partner")+r("shared","Shared")+"</select>"}window.onBudgetSharedToggle=function(){window._budget.sharedWithPartner=document.getElementById("budShared").checked,document.getElementById("budShareRow").style.display=window._budget.sharedWithPartner?"block":"none",Hn(),ki(),Je()};window.onBudgetSharePctChange=function(){window._budget.mySharePct=+document.getElementById("budSharePct").value||0,Je()};function Eh(n){const e=n.hint?'<div style="font-size:11px;color:var(--text-muted);margin-top:2px;line-height:1.3;">'+Cn(n.hint)+"</div>":"",t=n.period||"yr",r=n.annual==null?"":t==="mo"?Math.round(n.annual/12):n.annual,i=Jp(n.label,window._budget),s=i!=null?"≈"+(t==="mo"?i:i*12):"Amount",o=window._budget.sharedWithPartner?`<button type="button" class="risk-btn" style="padding:4px 8px;" title="Add a copy for your partner (e.g. their car)" onclick="duplicateBudgetLine('`+n.id+`')">⧉</button>`:"";return'<div class="bud-row" data-id="'+n.id+'" style="display:flex; gap:8px; flex-wrap:wrap; align-items:flex-start; margin-bottom:10px;"><div style="flex:1 1 200px; min-width:170px;"><input type="text" placeholder="Category" value="'+Cn(n.label)+`" oninput="updateBudgetLine('`+n.id+`','label',this.value)" style="width:100%;">`+e+'</div><div style="display:flex; gap:4px; flex:0 0 150px; align-items:center;"><input type="number" placeholder="'+s+`" title="Amount in today's money`+(i!=null?" (typical shown)":"")+'" value="'+r+`" oninput="updateBudgetAmount('`+n.id+`',this.value)" style="flex:1 1 auto; min-width:0;"><button type="button" class="risk-btn" style="padding:4px 8px; flex:0 0 auto;" title="Switch monthly / yearly" onclick="toggleBudgetPeriod('`+n.id+`')">`+(t==="mo"?"/mo":"/yr")+"</button></div>"+(window._budget.sharedWithPartner?Zm(n.id,n.paidBy,"updateBudgetLine"):"")+'<input type="number" placeholder="from age" title="From age (blank = retirement)" value="'+(n.fromAge??"")+`" oninput="updateBudgetLine('`+n.id+`','fromAge',this.value)" style="flex:0 0 84px;"><input type="number" placeholder="to age" title="To age (blank = end of plan)" value="`+(n.toAge??"")+`" oninput="updateBudgetLine('`+n.id+`','toAge',this.value)" style="flex:0 0 84px;">`+o+`<button type="button" class="risk-btn" style="padding:4px 10px;" title="Remove" onclick="removeBudgetLine('`+n.id+`')">&times;</button></div>`}function Hn(){const n=window._budget.lines.filter(t=>t.tier==="essential"),e=window._budget.lines.filter(t=>t.tier==="discretionary");document.getElementById("budEssentialRows").innerHTML=n.map(Eh).join("")||'<p style="font-size:12px;color:var(--text-muted);margin:0 0 8px;">No essentials yet — add housing, bills, food, transport…</p>',document.getElementById("budDiscretionaryRows").innerHTML=e.map(Eh).join("")||'<p style="font-size:12px;color:var(--text-muted);margin:0 0 8px;">No lifestyle spending yet — holidays, hobbies, eating out…</p>',nu()}function XS(n){const e=n.hint?'<div style="font-size:11px;color:var(--text-muted);margin-top:2px;line-height:1.3;">'+Cn(n.hint)+"</div>":"";return'<div class="bud-row" data-id="'+n.id+'" style="display:flex; gap:8px; flex-wrap:wrap; align-items:flex-start; margin-bottom:10px;"><div style="flex:1 1 170px; min-width:150px;"><input type="text" placeholder="e.g. Car" value="'+Cn(n.label)+`" oninput="updateBudgetOneOff('`+n.id+`','label',this.value)" style="width:100%;">`+e+`</div><input type="number" placeholder="£ amount" title="Total cost in today's money" value="`+(n.amount??"")+`" oninput="updateBudgetOneOff('`+n.id+`','amount',this.value)" style="flex:0 0 120px;">`+(window._budget.sharedWithPartner?Zm(n.id,n.paidBy,"updateBudgetOneOff"):"")+'<input type="number" placeholder="at age" value="'+(n.atAge??"")+`" oninput="updateBudgetOneOff('`+n.id+`','atAge',this.value)" style="flex:0 0 84px;"><input type="number" placeholder="every N yrs" title="Leave blank for a one-time cost" value="`+(n.everyYears??"")+`" oninput="updateBudgetOneOff('`+n.id+`','everyYears',this.value)" style="flex:0 0 110px;">`+(window._budget.sharedWithPartner?`<button type="button" class="risk-btn" style="padding:4px 8px;" title="Add a copy for your partner" onclick="duplicateBudgetOneOff('`+n.id+`')">⧉</button>`:"")+`<button type="button" class="risk-btn" style="padding:4px 10px;" title="Remove" onclick="removeBudgetOneOff('`+n.id+`')">&times;</button></div>`}function ki(){document.getElementById("budOneOffRows").innerHTML=window._budget.oneOffs.map(XS).join("")||'<p style="font-size:12px;color:var(--text-muted);margin:0 0 8px;">No one-off costs yet — a car every ~8 years, a new roof, a milestone trip…</p>'}function nu(){const n=Qp(window._budget),e=document.getElementById("budSuggestionsSection"),t=document.getElementById("budSuggestions");if(!n.length){e.style.display="none",t.innerHTML="";return}e.style.display="block",t.innerHTML=n.map(r=>'<button type="button" class="risk-btn" style="padding:5px 10px;" title="'+Cn(r.hint||"")+`" onclick="addBudgetSuggestion('`+Cn(r.label).replace(/'/g,"\\'")+`')">+ `+Cn(r.label)+"</button>").join("")}window.addBudgetSuggestion=function(n){const e=Qp(window._budget).find(t=>t.label===n);e&&(window._budget.lines.push({id:Fn(),label:e.label,tier:e.tier,annual:null,fromAge:null,toAge:null,hint:e.hint||"",period:e.period||"yr",paidBy:e.paidBy||"me"}),Hn(),nu(),Je())};function ru(){window._budget.currentAge=+document.getElementById("budCurrentAge").value||0,window._budget.retirementAge=+document.getElementById("budRetireAge").value||0,window._budget.endAge=+document.getElementById("budEndAge").value||100}window.onBudgetHorizonChange=function(){ru(),Je()};window.updateBudgetLine=function(n,e,t){const r=window._budget.lines.find(i=>i.id===n);r&&(e==="label"||e==="paidBy"?r[e]=t:r[e]=t===""?null:+t,e==="label"&&nu(),Je())};window.updateBudgetAmount=function(n,e){const t=window._budget.lines.find(i=>i.id===n);if(!t)return;const r=e===""?null:+e;t.annual=r==null?null:(t.period||"yr")==="mo"?r*12:r,Je()};window.toggleBudgetPeriod=function(n){const e=window._budget.lines.find(t=>t.id===n);e&&(e.period=(e.period||"yr")==="mo"?"yr":"mo",Hn(),Je())};window.updateBudgetOneOff=function(n,e,t){const r=window._budget.oneOffs.find(i=>i.id===n);r&&(e==="label"||e==="paidBy"?r[e]=t:r[e]=t===""?null:+t,Je())};window.addBudgetLine=function(n){window._budget.lines.push({id:Fn(),label:"",tier:n,annual:null,fromAge:null,toAge:null}),Hn(),Je()};window.addBudgetOneOff=function(){window._budget.oneOffs.push({id:Fn(),label:"",tier:"essential",amount:null,atAge:null,everyYears:null}),ki(),Je()};window.removeBudgetLine=function(n){window._budget.lines=window._budget.lines.filter(e=>e.id!==n),Hn(),Je()};window.removeBudgetOneOff=function(n){window._budget.oneOffs=window._budget.oneOffs.filter(e=>e.id!==n),ki(),Je()};window.duplicateBudgetLine=function(n){const e=window._budget.lines,t=e.find(i=>i.id===n);if(!t)return;const r={...t,id:Fn(),label:(t.label||"Item")+" (partner)",paidBy:"partner"};e.splice(e.indexOf(t)+1,0,r),Hn(),Je()};window.duplicateBudgetOneOff=function(n){const e=window._budget.oneOffs,t=e.find(i=>i.id===n);if(!t)return;const r={...t,id:Fn(),label:(t.label||"Item")+" (partner)",paidBy:"partner"};e.splice(e.indexOf(t)+1,0,r),ki(),Je()};window.fillTypicalAmounts=function(){let n=0;for(const e of window._budget.lines)if(e.annual==null||e.annual===""){const t=Jp(e.label,window._budget);t!=null&&(e.annual=t*12,n++)}Hn(),Je(),showToast(n?"Filled "+n+" blank categories with typical UK amounts — adjust freely":"No blank categories with a typical figure",n?"success":"info")};function Je(){ru();const n=window._budget,e=n.retirementAge,t=Tl(n,e,"essential"),r=Tl(n,e,"all");document.getElementById("budEssentialSubtotal").textContent=ss(t),document.getElementById("budDiscretionarySubtotal").textContent=ss(r-t);const i=Cc(n),s=y=>ss(y),o=n.oneOffs.filter(y=>(+y.everyYears||0)>0&&(+y.amount||0)>0),l=n.oneOffs.filter(y=>!((+y.everyYears||0)>0)&&(+y.amount||0)>0),c=lT.single,u=i.allInComfortableAnnual,f=u>=c.comfortable?"at/above Comfortable":u>=c.moderate?"between Moderate and Comfortable":u>=c.minimum?"between Minimum and Moderate":"below the Minimum",m=i.sharedWithPartner;let p="";if(p+='<div style="display:flex; gap:22px; flex-wrap:wrap; margin-bottom:14px;">',p+='<div><div style="font-size:12px;color:var(--text-muted);">Essential (floor)'+(m?" — your share":"")+'</div><div style="font-size:22px;font-weight:700;">'+s(i.essentialMonthlyNet)+'<span style="font-size:13px;font-weight:400;color:var(--text-muted);">/mo</span></div></div>',p+='<div><div style="font-size:12px;color:var(--text-muted);">'+(m?"Your share (all-in)":"All-in comfortable")+'</div><div style="font-size:26px;font-weight:800;color:var(--primary,#6366f1);">'+s(i.allInComfortableMonthly)+'<span style="font-size:13px;font-weight:400;color:var(--text-muted);">/mo</span></div><div style="font-size:12px;color:var(--text-muted);">'+s(u)+"/yr — what your plan funds</div></div>",m&&(p+='<div><div style="font-size:12px;color:var(--text-muted);">Household all-in</div><div style="font-size:22px;font-weight:700;">'+s(i.householdComfortableMonthly)+'<span style="font-size:13px;font-weight:400;color:var(--text-muted);">/mo</span></div><div style="font-size:12px;color:var(--text-muted);">everything, both of you</div></div>'),p+="</div>",p+='<div style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">= comfortable recurring <strong style="color:var(--text);">'+s(i.comfortableMonthlyNet)+"/mo</strong>"+(i.periodicMonthlyAverage>0?' + periodic set-aside <strong style="color:var(--text);">'+s(i.periodicMonthlyAverage)+"/mo</strong> <span>(averaged from the big periodic costs below)</span>":"")+".</div>",p+='<div class="alert alert-info" style="margin-bottom:12px;"><strong>vs PLSA (single, 2024):</strong> Minimum '+s(c.minimum)+" · Moderate "+s(c.moderate)+" · Comfortable "+s(c.comfortable)+" per year. Your all-in spend is <strong>"+f+'</strong>. <span style="color:var(--text-muted);">(Assumes home owned outright; excludes care costs.)</span></div>',o.length){p+='<div style="font-size:13px;margin-bottom:8px;"><strong>Periodic costs</strong> (averaged into the monthly need, but the cash lands lumpily):<ul style="margin:6px 0 0; padding-left:18px;">';for(const y of o){const I=+y.amount/+y.everyYears;p+="<li>"+Cn(y.label||"item")+": "+s(y.amount)+" every "+ +y.everyYears+" yrs ≈ <strong>"+s(I)+"/yr</strong> ("+s(I/12)+"/mo)</li>"}p+="</ul></div>"}if(l.length){p+='<div style="font-size:13px;margin-bottom:12px;"><strong>One-time costs</strong> (not in the monthly average — planned for the year they fall):<ul style="margin:6px 0 0; padding-left:18px;">';for(const y of l)p+="<li>"+Cn(y.label||"item")+": "+s(y.amount)+(y.atAge?" at age "+ +y.atAge:"")+"</li>";p+="</ul></div>"}p+='<div style="border-top:1px solid var(--border); padding-top:12px; display:flex; gap:12px; align-items:center; flex-wrap:wrap;">',p+='<div style="font-size:13px;">Suggested plan target: <strong>'+s(i.suggestedGrossAnnual)+'/yr gross</strong> <span style="color:var(--text-muted);">(grosses up your all-in take-home — approximate)</span></div>',p+='<button type="button" onclick="applyBudgetToPlan()">Use as my plan’s target income</button>',p+="</div>",document.getElementById("budSummary").innerHTML=p}window.saveBudgetUI=async function(){if(!gt()){showToast("Please sign in to save your budget","error");return}ru(),Et("Saving budget…");try{const n={...window._budget,lines:window._budget.lines.filter(e=>e.label&&e.label.trim()||e.annual),oneOffs:window._budget.oneOffs.filter(e=>e.label&&e.label.trim()||e.amount)};await Em(n),window._budget=Rl(n),Hn(),ki(),Je(),showToast("Budget saved","success")}catch(n){console.error("Budget save error:",n),showToast("Error saving budget: "+n.message,"error")}finally{Tt()}};window.applyBudgetToPlan=async function(){const n=Cc(window._budget),e=Math.round(n.suggestedGrossAnnual);if(!e){showToast("Add some spending first","warning");return}if(await iu()){showToast("Your plan is locked — unlock it or start a new plan to change its target.","warning");return}Et("Applying to plan…");try{await Ns({baseSalary:e}),showToast("Plan target set to "+ss(e)+"/yr (≈ your "+ss(n.allInComfortableMonthly)+"/mo all-in take-home)","success",4500)}catch(t){console.error("Apply-to-plan error:",t),showToast("Could not apply: "+t.message,"error")}finally{Tt()}};let kl=!1,Pl=!1;async function iu(){try{const n=await It();return!!(n&&n.locked)}catch(n){return console.warn("Could not read decision settings for lock state:",n),!1}}async function eg(){try{const[n,e,t]=await Promise.all([It(),Kr({limit:1e3}),qn()]);if(t&&Object.values(t).some(s=>s&&s.yearSetupComplete))return!0;const r=lm(n);return(Array.isArray(e)?e:[]).some(s=>s.settingsChecksum===void 0||s.settingsChecksum===r)}catch(n){return console.warn("Could not determine derived-data state:",n),!0}}function Th(n){const e=document.getElementById("decision-decisionsettings");e&&e.querySelectorAll("input, select, textarea, button").forEach(t=>{t.closest("#dsLockBanner")||t.id!=="dsSaveBtn"&&(t.disabled=!n)})}async function su(){const n=document.getElementById("dsLockBanner"),e=document.getElementById("dsSaveBtn");if(!(!n||!e)){if(kl=await iu(),!kl){n.style.display="none",Th(!0),e.textContent="Save Settings",e.classList.remove("btn-locked");return}Pl=!await eg(),n.style.display="flex",n.className="lock-banner",Pl?n.innerHTML='<span>🔒 <strong>These settings are locked.</strong> Nothing has been recorded against them yet — no tax years, no monthly entries — so you can unlock and edit them.</span><button type="button" onclick="unlockDecisionSettings()">Unlock to edit</button>':n.innerHTML='<span>🔒 <strong>These settings are locked.</strong> Tax years or monthly entries have been recorded against them, so they can’t be changed. To use different settings, create a new plan.</span><button type="button" onclick="createNewPlanForSettings()">Create new plan</button>',Th(!1),e.textContent="🔒 Locked",e.classList.add("btn-locked")}}window.unlockDecisionSettings=async function(){if(await eg()){showToast("Can’t unlock — tax years or entries now depend on these settings. Create a new plan.","warning"),await su();return}Et("Unlocking…");try{await Ns({locked:!1}),await tu(),showToast("Settings unlocked — you can edit them now.","success")}catch(n){console.error("Unlock error:",n),showToast("Could not unlock: "+n.message,"error")}finally{Tt()}};window.createNewPlanForSettings=function(){const n=document.getElementById("scenarioNewBtn");n&&n.click()};window.saveDecisionSettingsUI=async function(){if(!gt()){showToast("Please sign in to save settings","error");return}if(kl||await iu()){showToast(Pl?"These settings are locked. Use “Unlock to edit” above to change them.":"These settings are locked. Define a new plan to use different settings.","info");return}const n=ga(document.getElementById("dsSpStartDate").value.trim());if(!n.valid){showToast(n.error,"error");return}n.warning&&showToast(n.warning,"warning");const e=readAlloc("ds");if(Jc(e.equityMin,e.bondMin,e.cashTarget)){Et("Saving settings...");try{await Ns({equityMin:e.equityMin,bondMin:e.bondMin,cashTarget:e.cashTarget,duration:+document.getElementById("dsDuration").value,equityGlideEnabled:document.getElementById("dsEquityGlide").checked,baseSalary:+document.getElementById("dsBaseSalary").value,spendingProfile:document.getElementById("dsSpendingProfile").value||"flat",spStartDate:document.getElementById("dsSpStartDate").value.trim()||null,spWeeklyAmount:+document.getElementById("dsSpWeeklyAmount").value||0,protectionFactor:+document.getElementById("dsProtectionFactor").value,recoveryBuffer:+document.getElementById("dsRecoveryBuffer").value,consecutiveLimit:+document.getElementById("dsConsecutiveLimit").value,isaBalance:+document.getElementById("dsIsaBalance").value||0,diversifierStart:e.diversifierStart||0,subAsset:e.subAsset||null,glideEndgame:e.glideEndgame||null,allocMode:Zc("ds"),taggedFunds:Rt("ds").filter(t=>t.ticker&&t.value>0),locked:!0}),showToast("Settings saved and locked. Create a new plan to use different settings.","success",4e3),await su()}catch(t){console.error("Error saving decision settings:",t),showToast("Error saving: "+t.message,"error")}finally{Tt()}}};window.resetDecisionSettingsUI=async function(){if(confirm("Reset all decision settings to defaults?")){Et("Resetting settings...");try{await Ns({equityMin:25e4,bondMin:2e5,cashTarget:5e4,duration:35,baseSalary:3e4,protectionFactor:20,recoveryBuffer:15e3,consecutiveLimit:3}),await tu(),showToast("Settings reset to defaults","success")}catch(n){console.error("Error resetting settings:",n),showToast("Error resetting: "+n.message,"error")}finally{Tt()}}};window.showDrawdownScheduleUI=async function(){const n=parseFloat(document.getElementById("ddInflation").value)/100||.025,e=parseInt(document.getElementById("ddDuration").value)||35;try{const t=await Vt();t.duration=e;const r=Sh(t,e,n);let i='<div class="card"><h2>Projected Drawdown Schedule (SIPP + ISA bridge)</h2>';i+='<div class="alert alert-info" style="margin-bottom:16px;">SIPP is drawn to fill the basic-rate band; the tax-free <strong>ISA tops your income up to the target</strong> and runs down over the years (the bridge to the State Pension). Deterministic projection at your assumed inflation — the stochastic ISA path is in the Monte-Carlo / Historical results.</div>',i+='<div style="overflow-x: auto;"><table>',i+="<thead><tr><th>Year</th><th>SIPP Draw</th><th>State</th><th>Tax</th><th>Net (SIPP+SP)</th><th>ISA Top-up</th><th>Spendable</th><th>ISA Left</th></tr></thead>",i+="<tbody>";for(const s of r)i+=`<tr>
            <td>${s.year}</td>
            <td style="color: var(--primary); font-weight: 600;">${W(s.sippDraw)}</td>
            <td>${W(s.statePension)}</td>
            <td style="color: var(--danger);">-${W(s.tax)}</td>
            <td>${W(s.netIncome)}</td>
            <td style="color: var(--info);">${W(s.isaDraw)}</td>
            <td style="color: var(--success); font-weight: 600;">${W(s.spendable)}</td>
            <td>${W(s.isaBalance)}</td>
          </tr>`;i+="</tbody></table></div></div>",document.getElementById("drawdownResults").innerHTML=i}catch(t){console.error("Drawdown error:",t),document.getElementById("drawdownResults").innerHTML=`<div class="alert alert-danger">Error: ${t.message}</div>`}};window.showGlidepathUI=async function(){const n=parseFloat(document.getElementById("gpInflation").value)/100||.025,e=parseInt(document.getElementById("gpDuration").value)||35;try{const t=await Vt();t.duration=e;const r=Fg(t,n),i=Sh(t,e,n),s={};i.forEach(f=>{s[f.year]=f.isaBalance});const o=!!t.equityGlideEnabled,l=(t.equityMin||0)+(t.bondMin||0)+(t.cashTarget||0),c={equity:l>0?t.equityMin/l:.5,bond:l>0?t.bondMin/l:.4,cash:l>0?t.cashTarget/l:.1,equityGlide:o?bs(t.equityMin,t.bondMin):void 0};let u='<div class="card"><h2>Fund Glidepath Over Time</h2>';u+='<div class="alert alert-info" style="margin-bottom: 20px;">',u+=o?"<strong>Bond tent on:</strong> the equity share (Shares %) RISES over the early years then holds; the £ floors inflate with CPI and deplete over time, cash holds its real value, and the ISA bridge runs down as it tops up income.":"<strong>Glidepath:</strong> Equity & Bond minimums inflate with CPI but deplete over time to £0; cash inflates only (holds real value); the ISA bridge runs down as it tops up income. Turn on the bond tent in Settings to see the equity share rise.",u+="</div>",u+='<div style="overflow-x: auto;"><table>',u+="<thead><tr><th>Year</th><th>Equity Min</th><th>Bond Min</th><th>Cash Target</th><th>Shares % (of pot)</th><th>ISA Balance</th><th>Total Min</th></tr></thead>",u+="<tbody>";for(const f of r){const m=Math.round(Xa(c,f.year,t.duration).equity*100);u+=`<tr>
            <td>${f.year}</td>
            <td style="color: var(--success);">${W(f.equityMin)}</td>
            <td style="color: var(--info);">${W(f.bondMin)}</td>
            <td style="color: var(--warning);">${W(f.cashTarget)}</td>
            <td style="font-weight: 600;">${m}%</td>
            <td>${W(s[f.year]||0)}</td>
            <td style="font-weight: 600;">${W(f.totalMin)}</td>
          </tr>`}u+="</tbody></table></div></div>",document.getElementById("glidepathResults").innerHTML=u}catch(t){console.error("Glidepath error:",t),document.getElementById("glidepathResults").innerHTML=`<div class="alert alert-danger">Error: ${t.message}</div>`}};let Dt=null,tn=[],nn="all";async function un(){const n=document.getElementById("historyTabs"),e=document.getElementById("historyDetail"),t=document.getElementById("historyYearFilter"),r=document.getElementById("deleteAllHistoryBtn"),i=document.getElementById("deleteYearBtn");if(!n||!e)return;if(n.innerHTML='<span class="loading">Loading...</span>',tn=await Kr({sortDesc:!1,limit:500}),r&&(r.style.display=tn.length>0?"":"none"),i&&(i.style.display="none"),tn.length===0){n.innerHTML="",t&&(t.innerHTML='<option value="all">No entries</option>'),e.innerHTML=`
          <div class="no-history-message">
            <h3>No History Entries</h3>
            <p>Save decisions from the Decision Tool to build your history.</p>
          </div>
        `;return}const s=[...new Set(tn.map(u=>u.date.split("-")[0]))].sort().reverse();if(t){let u='<option value="all">All Years</option>';s.forEach(f=>{u+=`<option value="${f}">${f}</option>`}),t.innerHTML=u,t.value=nn}i&&(i.style.display=nn!=="all"&&tn.length>0?"":"none");const o=nn==="all"?tn:tn.filter(u=>u.date.startsWith(nn));if(o.length===0){n.innerHTML="",e.innerHTML=`
          <div class="no-history-message">
            <h3>No entries for ${nn}</h3>
            <p>Select a different year or "All Years".</p>
          </div>
        `;return}let l="";o.forEach(u=>{const f=u.date===Dt,m=["history-tab"];f&&m.push("active"),u.inProtection&&m.push("protection");const[p,y]=u.date.split("-").map(Number),I=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],S=nn==="all"?`${I[y-1]} ${p}`:I[y-1];l+=`<button class="${m.join(" ")}" onclick="selectHistoryEntry('${u.date}')">${S}</button>`}),n.innerHTML=l;const c=document.getElementById("historyMobileSelector");if(c){let u="";o.forEach(f=>{const m=Ei(f.date),p=f.inProtection?" (Protection)":"";u+=`<option value="${f.date}">${m}${p}</option>`}),c.innerHTML=u}(!Dt||!o.find(u=>u.date===Dt))&&(Dt=o[o.length-1].date),c&&(c.value=Dt),tg(Dt),setTimeout(()=>{const u=n.querySelector(".history-tab.active");u&&u.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})},100)}window.filterHistoryByYear=function(n){nn=n,Dt=null,un()};function Ei(n){const[e,t]=n.split("-").map(Number);return`${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][t-1]} ${e}`}function tg(n){const e=document.getElementById("historyDetail"),t=tn.find(u=>u.date===n);if(!t){e.innerHTML='<div class="no-history-message"><h3>Entry not found</h3></div>';return}const r=u=>u!=null?"£"+Math.round(u).toLocaleString():"—",i=t.isTaxEfficientYear!==!1&&t.mode==="Tax-Efficient",s=t.inProtection?"warning":i?"efficient":"inefficient",o=t.inProtection?`Protection${t.protectionInducedTaxEfficiency?" (Tax-Efficient)":""}`:i?"Tax-Efficient":"Standard";let l=t.source||"Unknown";t.source==="Growth"&&(t.dEquity>0||t.dBond>0)?l=`Growth (Equity: ${r(t.dEquity||0)}, Bond: ${r(t.dBond||0)})`:t.source==="Cash"&&(l=`Cash (${r(t.dCash||t.sipp||0)})`);let c=`
        <div class="no-print" style="display:flex;justify-content:flex-end;margin-bottom:12px;">
          <button class="btn secondary" onclick="printMonthlyReport('${t.date}')">Download PDF</button>
        </div>
        <!-- Header with date and mode -->
        <div class="history-detail-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <div>
              <h3 style="margin:0;">${Ei(t.date)}</h3>
              <div style="color:var(--text-muted);font-size:13px;">Tax Year ${t.taxYear} • Year ${t.yearNum||0}</div>
            </div>
            <span class="tax-mode-badge ${s}">${o}</span>
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
                  <label>Shares vs bonds (target)</label>
                  <span class="value">${t.adjEquity+t.adjBond>0?Math.round(t.adjEquity/(t.adjEquity+t.adjBond)*100)+"% / "+Math.round(t.adjBond/(t.adjEquity+t.adjBond)*100)+"%":"—"}</span>
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
      `;e.innerHTML=c,document.querySelectorAll(".history-tab").forEach(u=>{u.classList.toggle("active",u.textContent===Ei(n))})}window.selectHistoryEntry=function(n){Dt=n,tg(n);const e=document.getElementById("historyMobileSelector");e&&(e.value=n);const r=document.getElementById("historyTabs").querySelector(".history-tab.active");r&&r.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})};window.scrollHistoryTabs=function(n){const e=document.getElementById("historyTabs"),t=200;n==="left"?e.scrollLeft-=t:e.scrollLeft+=t};function Fo(n){const[e,t]=n.split("-").map(Number);return t>=4?`${e%100}/${(e+1)%100}`:`${(e-1)%100}/${e%100}`}async function Cl(n){const e={};for(const r of n){const i=r.taxYear||Fo(r.date);e[i]||(e[i]=0),e[i]+=r.isaSavingsUsedThisMonth||r.isa||0}for(const r of n)await cm(r.date);const t=await qn();for(const[r,i]of Object.entries(e))if(t[r]){const s=t[r].isaSavingsUsed||0,o=Math.max(0,s-i);await Gr(r,{...t[r],isaSavingsUsed:o})}}window.deleteHistoryEntry=async function(n){if(!gt()){showToast("Please sign in to delete entries","error");return}const e=await Kr({sortDesc:!1,limit:1e3}),t=Fo(n),i=e.filter(c=>(c.taxYear||Fo(c.date))===t).sort((c,u)=>c.date.localeCompare(u.date)),s=i.findIndex(c=>c.date===n);if(s===-1){showToast("Entry not found","error");return}const o=s===i.length-1,l=Ei(n);if(o){if(!confirm(`Delete entry for ${l}?`))return;Et("Deleting entry...");try{await Cl([i[s]]),showToast(`Deleted ${l}`,"success"),Dt=null,await un()}catch(c){console.error("Delete error:",c),showToast("Error deleting: "+c.message,"error")}finally{Tt()}}else{const c=i.slice(s),u=Ei(c[c.length-1].date);if(!confirm(`This will delete ${c.length} entries from ${l} to ${u} in tax year ${t}.

Continue?`))return;Et(`Deleting ${c.length} entries...`);try{await Cl(c),showToast(`Deleted ${c.length} entries`,"success"),Dt=null,await un()}catch(f){console.error("Delete error:",f),showToast("Error deleting: "+f.message,"error")}finally{Tt()}}};window.deleteHistoryForTaxYear=async function(n){if(!gt()){showToast("Please sign in to delete entries","error");return}const t=(await Kr({sortDesc:!1,limit:1e3})).filter(r=>(r.taxYear||Fo(r.date))===n);if(t.length===0){showToast(`No history entries for tax year ${n}`,"info");return}if(confirm(`Delete all ${t.length} history entries for tax year ${n}?`)){Et(`Deleting tax year ${n}...`);try{await Cl(t);const r=await qn();r[n]&&await Gr(n,{...r[n],isaSavingsUsed:0}),showToast(`Deleted all entries for ${n}`,"success"),Dt=null,await un()}catch(r){console.error("Delete error:",r),showToast("Error deleting: "+r.message,"error")}finally{Tt()}}};window.deleteHistoryForSelectedYear=async function(){if(nn==="all"){showToast("Select a specific year first","error");return}const n=`${parseInt(nn)%100}/${(parseInt(nn)+1)%100}`;await deleteHistoryForTaxYear(n)};window.deleteAllHistory=async function(){if(confirm("Delete ALL history entries? This cannot be undone.")&&confirm("Are you ABSOLUTELY sure? All decision history will be permanently deleted.")){if(!gt()){showToast("Please sign in to delete entries","error");return}Et("Deleting all history...");try{const n=await Kr({limit:1e3});for(const t of n)await cm(t.date);const e=await qn();for(const[t,r]of Object.entries(e))r.isaSavingsUsed>0&&await Gr(t,{...r,isaSavingsUsed:0});showToast(`Deleted ${n.length} entries`,"success"),Dt=null,await un()}catch(n){console.error("Delete all error:",n),showToast("Error deleting: "+n.message,"error")}finally{Tt()}}};let Rr=null;async function Hr(){const n=document.getElementById("taxYearTabs"),e=document.getElementById("taxYearDetail");if(!n||!e)return;n.innerHTML='<span class="loading">Loading...</span>';const t=await qn(),r=await It(),i=Object.keys(t).sort(),s=ZS(),o=eA(i,s,40);let l="";o.forEach(f=>{const m=t[f],p=m&&m.yearSetupComplete,y=f===Rr,I=["tax-year-tab"];y&&I.push("active"),p||I.push("not-setup"),l+=`<button class="${I.join(" ")}" onclick="selectTaxYear('${f}')">${f}</button>`}),n.innerHTML=l;const c=document.getElementById("taxYearMobileSelector");if(c){let f="";o.forEach(m=>{const p=t[m],I=p&&p.yearSetupComplete?m:`${m} (not set up)`;f+=`<option value="${m}">${I}</option>`}),c.innerHTML=f}if(!Rr){const f=i.filter(m=>{var p;return(p=t[m])==null?void 0:p.yearSetupComplete});Rr=f.length>0?f[f.length-1]:s}c&&(c.value=Rr),await ng(Rr,t,r);const u=n.querySelector(".tax-year-tab.active");u&&u.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})}function ZS(){const n=new Date,e=n.getFullYear(),t=n.getMonth()+1;return t<4||t===4&&n.getDate()<6?`${String(e-1).slice(-2)}/${String(e).slice(-2)}`:`${String(e).slice(-2)}/${String(e+1).slice(-2)}`}function eA(n,e,t){const r=new Set(n),[i]=e.split("/").map(Number),s=i<50?2e3+i:1900+i;for(let o=0;o<t&&r.size<t;o++){const l=s+o,c=l+1;r.add(`${String(l).slice(-2)}/${String(c).slice(-2)}`)}return Array.from(r).sort()}async function ng(n,e,t){var _,b,E,A,w,le,pe,H,ee,ne,te,Ce,ke,ye;const r=document.getElementById("taxYearDetail"),i=e[n];if(!i||!i.yearSetupComplete){r.innerHTML=`
          <div class="not-configured-message">
            <h3>Tax Year ${n} Not Configured</h3>
            <p>This tax year hasn't been set up yet. Use the Decision Tool to calculate a decision for a month in this tax year to trigger the setup wizard.</p>
            <button class="btn primary" onclick="triggerWizardForYear('${n}')">Set Up ${n}</button>
          </div>
        `;return}const s=await Nc(n),o=Math.round(s.amount||0),l=s.startDate||"Not configured",c=s.isReceiving;s.yearsUntil;const u=O=>O!=null?"£"+Math.round(O).toLocaleString():"—",f=(t.equityMin||0)+(t.bondMin||0)+(t.cashTarget||0),m=t.duration||35,p=Math.max(0,2e3+(parseInt(n.split("/")[0],10)||26)-2026),y=!!t.equityGlideEnabled,I={equity:f>0?t.equityMin/f:.5,bond:f>0?t.bondMin/f:.4,cash:f>0?t.cashTarget/f:.1,equityGlide:y?bs(t.equityMin,t.bondMin):void 0},S=Xa(I,p,m),x=Xa(I,Math.max(0,p-1),m),k=O=>Math.round(O*100),C=Math.max(5,m-20),N=k(S.equity)-k(x.equity),B=`${k(S.equity)}% shares / ${k(S.bond)}% bonds / ${k(S.cash)}% cash`;let $,q;y?p>C?(q=`Holding — reached your mix at year ${C}`,$=`You've reached your endgame mix. Hold ${B}; no glide change this year.`):N>0?(q=`Rising — year ${p} of ${C}`,$=`Shift about ${N}% of your pot from bonds into shares this year, reaching ${B}.`):(q=`Rising — year ${p} of ${C}`,$=`Hold ${B}.`):(q="Flat (bond tent off)",$=`Hold a steady ${B}. Rebalance back to this whenever it drifts.`);const T=`
        <div class="tax-year-detail-card">
          <h3>This Year's Target Mix${y?" — Bond Tent":""}</h3>
          <div class="tax-year-grid">
            <div class="tax-year-field"><label>Shares</label><span class="value">${k(S.equity)}% · ${u(f*S.equity)}</span></div>
            <div class="tax-year-field"><label>Bonds</label><span class="value">${k(S.bond)}% · ${u(f*S.bond)}</span></div>
            <div class="tax-year-field"><label>Cash</label><span class="value">${k(S.cash)}% · ${u(f*S.cash)}</span></div>
            <div class="tax-year-field"><label>Glide stage</label><span class="value">${q}</span></div>
          </div>
          <div class="alert alert-info" style="margin-top:12px;"><strong>Rebalance:</strong> ${$}</div>
        </div>`;let v=`<div class="no-print" style="display:flex;gap:8px;justify-content:flex-end;margin-bottom:12px;"><button class="btn secondary" onclick="printAnnualReport('${n}')">Download PDF</button> <button class="btn secondary" onclick="exportAnnualCsv('${n}')">Export CSV</button></div>`+T+`
        <!-- Tax Thresholds -->
        <div class="tax-year-detail-card">
          <h3>Tax Thresholds</h3>
          <div class="tax-year-grid">
            <div class="tax-year-field">
              <label>Personal Allowance</label>
              <input type="number" value="${i.pa||12570}" onchange="updateTaxYear('${n}','pa',this.value)">
            </div>
            <div class="tax-year-field">
              <label>Basic Rate Limit</label>
              <input type="number" value="${i.brl||50270}" onchange="updateTaxYear('${n}','brl',this.value)">
            </div>
            <div class="tax-year-field">
              <label>Higher Rate Limit</label>
              <input type="number" value="${i.hrl||125140}" onchange="updateTaxYear('${n}','hrl',this.value)">
            </div>
            <div class="tax-year-field">
              <label>CPI (Previous Year)</label>
              <input type="number" step="0.1" value="${((i.cpi||.04)*100).toFixed(1)}" onchange="updateTaxYear('${n}','cpi',this.value/100)">
            </div>
          </div>
        </div>

        <!-- Income Configuration -->
        <div class="tax-year-detail-card">
          <h3>Income Configuration</h3>
          <div class="tax-year-grid">
            <div class="tax-year-field">
              <label>Target Annual Salary</label>
              <span class="value">${u(i.confirmedSalary)}</span>
            </div>
            <div class="tax-year-field">
              <label>Other Taxable Income (Annual)</label>
              <input type="number" value="${i.other||0}" onchange="updateTaxYear('${n}','other',this.value)">
            </div>
            <div class="tax-year-field">
              <label>State Pension (Annual)</label>
              <span class="value">${c?u(o)+(s.isFirstYear?" (partial year)":""):l!=="Not configured"?`Starts ${l}`:"Not configured"}</span>
            </div>
            <div class="tax-year-field">
              <label>Income Before Pension Start</label>
              <span class="value">${u(i.grossIncomeToDate)}</span>
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
              <span class="value">${u(i.isaSavingsAllocation)}</span>
            </div>
            <div class="tax-year-field">
              <label>ISA/Savings Used</label>
              <span class="value">${u(i.isaSavingsUsed||0)}</span>
            </div>
            <div class="tax-year-field">
              <label>Start Month</label>
              <span class="value">${tA(i.startMonth||4)}</span>
            </div>
            <div class="tax-year-field">
              <label>Remaining Months (at setup)</label>
              <span class="value">${i.remainingMonths||12}</span>
            </div>
          </div>
        </div>
      `;if(i.expectedMonthly){const O=i.expectedMonthly;v+=`
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
                  <td>${u((_=O.sipp)==null?void 0:_.gross)}</td>
                  <td class="tax-col">-${u((b=O.sipp)==null?void 0:b.tax)}</td>
                  <td class="net-col">${u((E=O.sipp)==null?void 0:E.net)}</td>
                </tr>
                ${((A=O.other)==null?void 0:A.gross)>0?`
                <tr>
                  <td class="source-name">Other Income</td>
                  <td>${u((w=O.other)==null?void 0:w.gross)}</td>
                  <td class="tax-col">-${u((le=O.other)==null?void 0:le.tax)}</td>
                  <td class="net-col">${u((pe=O.other)==null?void 0:pe.net)}</td>
                </tr>
                `:""}
                ${((H=O.statePension)==null?void 0:H.gross)>0?`
                <tr>
                  <td class="source-name">State Pension</td>
                  <td>${u((ee=O.statePension)==null?void 0:ee.gross)}</td>
                  <td class="tax-col">-${u((ne=O.statePension)==null?void 0:ne.tax)}</td>
                  <td class="net-col">${u((te=O.statePension)==null?void 0:te.net)}</td>
                </tr>
                `:""}
                ${((Ce=O.isa)==null?void 0:Ce.net)>0?`
                <tr>
                  <td class="source-name">ISA <span style="color:var(--success);font-size:11px;">(tax-free)</span></td>
                  <td>${u((ke=O.isa)==null?void 0:ke.gross)}</td>
                  <td style="color:var(--success);">£0</td>
                  <td class="net-col">${u((ye=O.isa)==null?void 0:ye.net)}</td>
                </tr>
                `:""}
              </tbody>
              <tfoot>
                <tr>
                  <td><strong>Total</strong></td>
                  <td><strong>${u(O.totalGross)}</strong></td>
                  <td class="tax-col"><strong>-${u(O.totalTax)}</strong></td>
                  <td class="net-col"><strong>${u(O.totalNet)}</strong></td>
                </tr>
              </tfoot>
            </table>
            <p style="margin-top:16px;font-size:14px;color:var(--text);">
              <strong>Monthly take-home: ${u(O.totalNet)}</strong>
            </p>
          </div>
        `}v+=`
        <div class="tax-year-actions">
          <button class="btn secondary" onclick="deleteTaxYear('${n}')">Delete Year</button>
          <button class="btn secondary" onclick="reconfigureTaxYear('${n}')">Reconfigure via Wizard</button>
        </div>
      `,r.innerHTML=v,document.querySelectorAll(".tax-year-tab").forEach(O=>{O.classList.toggle("active",O.textContent===n)})}window.selectTaxYear=async function(n){Rr=n;const e=await qn(),t=await It();await ng(n,e,t),document.querySelectorAll(".tax-year-tab").forEach(o=>{o.classList.toggle("active",o.textContent===n)});const r=document.getElementById("taxYearMobileSelector");r&&(r.value=n);const s=document.getElementById("taxYearTabs").querySelector(`.tax-year-tab[onclick="selectTaxYear('${n}')"]`);s&&s.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})};window.scrollTaxYearTabs=function(n){const e=document.getElementById("taxYearTabs"),t=200;n==="left"?e.scrollLeft-=t:e.scrollLeft+=t};function tA(n){return["January","February","March","April","May","June","July","August","September","October","November","December"][(n-1)%12]||"April"}window.triggerWizardForYear=async function(n){const[e]=n.split("/").map(Number),t=e<50?2e3+e:1900+e,r=`${t}-04`,i=document.getElementById("selectedMonth");i&&(i.value=r),document.querySelectorAll(".tab").forEach(s=>s.classList.remove("active")),document.querySelector('.tab[data-tab="decision"]').classList.add("active"),document.querySelectorAll(".tab-content").forEach(s=>s.classList.remove("active")),document.getElementById("decision-content").classList.add("active"),document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(s=>s.classList.remove("active")),document.querySelector('.sub-tab[data-decisiontab="entry"]').classList.add("active"),document.querySelectorAll(".decision-subtab").forEach(s=>s.classList.add("hidden")),document.getElementById("decision-entry").classList.remove("hidden"),showToast(`Please click "Calculate" with April ${t} selected to set up tax year ${n}`,"info",5e3)};window.reconfigureTaxYear=async function(n){if(confirm(`This will allow you to reconfigure tax year ${n}. The setup wizard will be triggered when you next calculate a decision for this year. Continue?`))try{const e=await pa(n);e.yearSetupComplete=!1,await Gr(n,e),await Hr(),showToast(`Tax year ${n} marked for reconfiguration. Calculate a decision for this year to run the wizard again.`,"success",5e3)}catch(e){console.error("Error:",e),showToast("Error: "+e.message,"error")}};window.updateTaxYear=async function(n,e,t){try{const r=await pa(n);r[e]=parseFloat(t),await Gr(n,r)}catch(r){console.error("Error updating tax year:",r),showToast("Error saving: "+r.message,"error")}};window.deleteTaxYear=async function(n){if(confirm("Delete tax year "+n+"? This will remove all configuration for this year."))try{const e=await fn();delete e.taxYears[n],await fa(e),Rr=null,await Hr()}catch(e){console.error("Error deleting tax year:",e),showToast("Error deleting: "+e.message,"error")}};window.addTaxYear=async function(){if(!gt()){showToast("Please sign in to add tax years","error");return}const n=prompt("Enter tax year (e.g., 25/26):");if(!n||!/^\d{2}\/\d{2}$/.test(n)){showToast("Invalid format. Use YY/YY (e.g., 25/26)","error");return}try{await Gr(n,{}),await Hr()}catch(e){console.error("Save error:",e),showToast("Error saving: "+e.message,"error")}};console.log("Pension Planner v"+Ih+" loaded");
