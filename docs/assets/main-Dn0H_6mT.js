(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();function $y(t){const e=(t.sippDraw||0)+(t.other||0)+(t.statePension||0),n=e*12,i=t.pa||12570,r=t.brl||50270,s=t.hrl||125140;let o=0;n>i&&(n<=r?o=(n-i)*.2:n<=s?o=(r-i)*.2+(n-r)*.4:o=(r-i)*.2+(s-r)*.4+(n-s)*.45);const l=o/12,c=e-l+(t.isaDraw||0);return{date:t.date,taxYear:t.taxYear,yearNum:t.yearNumber,equity:t.equity,bond:t.bond,cash:t.cash,total:t.equity+t.bond+t.cash,adjEquity:t.adjEquityMin,adjBond:t.adjBondMin,adjCash:t.adjCashTarget,source:t.source,dEquity:t.drawFromEquity||0,dBond:t.drawFromBond||0,dCash:t.drawFromCash||0,sipp:t.sippDraw,stdSipp:t.stdSipp||t.sippDraw,isa:t.isaDraw,other:t.other,state:t.statePension,pa:i,brl:r,monthlyTax:l,monthlyNet:c,mode:t.taxEfficient?"Tax-Efficient":"Standard",inProtection:t.inProtection,reason:t.protectionReason||"",consecutiveDraws:t.consecutiveCashDraws||0,boostAmount:t.boostAmount,boostEligible:t.boostEligible||!1,rebal:t.rebalanceActions?t.rebalanceActions.join("; "):"",yearlyIsaSavingsAllocation:t.yearlyIsaSavingsAllocation||0,isaSavingsUsedThisMonth:t.isaDraw||0,cumulativeIsaSavingsUsed:t.cumulativeIsaSavingsUsed||0,taxPaidMonthly:l,taxPaidYTD:t.taxPaidYTD||l,taxProjectedAnnual:t.taxProjectedAnnual||o,taxSavedMonthly:t.taxSavedMonthly||0,taxSavedYTD:t.taxSavedYTD||0,taxSavedProjectedAnnual:t.taxSavedProjectedAnnual||0,isTaxEfficientYear:t.isTaxEfficientYear??!0,protectionInducedTaxEfficiency:t.protectionInducedTaxEfficiency||!1,remainingMonths:t.remainingMonths||12}}const So={INFO:"info",WARNING:"warning",DANGER:"danger",SUCCESS:"success"},If="6.0.0",Ye={PERSONAL_ALLOWANCE:12570,BASIC_RATE_LIMIT:50270,HIGHER_RATE_LIMIT:125140,BASIC_RATE:.2,HIGHER_RATE:.4,ADDITIONAL_RATE:.45,PA_TAPER_THRESHOLD:1e5,PA_TAPER_RATE:.5},yc={ASSUMED_CPI:.025,OTHER_INCOME_CAP:.04},Jt={RETURN:.03,MIN:0,DRAWDOWN_STRATEGY:"minimiseEarlyTax"},ye={BASE_SALARY:3e4,EQUITY_MIN:25e4,BOND_MIN:2e5,CASH_TARGET:5e4,DURATION_YEARS:35,PROTECTION_FACTOR:20,RECOVERY_BUFFER:15e3,CONSECUTIVE_LIMIT:3},$i={PROTECTION_MULTIPLIER:.8,HODL_ENABLED:!1,HODL_VALUE:25e3},Wi={1928:.4781,1929:-.172,1930:-.338,1931:-.527,1932:-.231,1933:.669,1934:.041,1935:.3879,1936:.2492,1937:-.3839,1938:.2846,1939:-.0278,1940:-.1278,1941:-.1552,1942:.0782,1943:.1382,1944:.1226,1945:.2665,1946:-.0818,1947:.0225,1948:-.0246,1949:.1279,1950:.1787,1951:.1463,1952:.0837,1953:-.0377,1954:.4399,1955:.2084,1956:.0262,1957:-.1278,1958:.3396,1959:.1612,1960:-.0912,1961:.1889,1962:-.1081,1963:.1715,1964:.1478,1965:.1058,1966:-.1858,1967:.1506,1968:.0457,1969:-.1524,1970:.0482,1971:.0627,1972:.1476,1973:-.1652,1974:-.2777,1975:.3815,1976:.1774,1977:-.1271,1978:-.0303,1979:.0414,1980:.1493,1981:-.0909,1982:.1976,1983:.2027,1984:-.0365,1985:.2778,1986:.2278,1987:.0227,1988:.1185,1989:.2697,1990:-.0456,1991:.2013,1992:.044,1993:.1372,1994:.0218,1995:.3345,1996:.2601,1997:.2264,1998:.1627,1999:.2516,2e3:-.0617,2001:-.0727,2002:-.1679,2003:.2525,2004:.0333,2005:-.0061,2006:.1618,2007:.0648,2008:-.3355,2009:.1882,2010:.1102,2011:.0556,2012:.0728,2013:.2665,2014:.0775,2015:-.023,2016:.1342,2017:.2511,2018:-.0583,2019:.2234,2020:.0726,2021:.1873,2022:-.0878,2023:.1399,2024:.1299},ma={1928:-.012,1929:.002,1930:-.06,1931:-.094,1932:-.103,1933:.005,1934:.021,1935:.03,1936:.014,1937:.028,1938:-.02,1939:-.014,1940:.01,1941:.099,1942:.09,1943:.03,1944:.023,1945:.023,1946:.186,1947:.087,1948:.03,1949:-.02,1950:.059,1951:.06,1952:.009,1953:.006,1954:-.007,1955:.004,1956:.03,1957:.028,1958:.017,1959:.015,1960:.014,1961:.007,1962:.013,1963:.017,1964:.01,1965:.019,1966:.034,1967:.028,1968:.046,1969:.062,1970:.055,1971:.033,1972:.034,1973:.087,1974:.124,1975:.069,1976:.048,1977:.067,1978:.09,1979:.133,1980:.125,1981:.089,1982:.038,1983:.038,1984:.04,1985:.038,1986:.011,1987:.044,1988:.044,1989:.046,1990:.061,1991:.03,1992:.029,1993:.027,1994:.026,1995:.025,1996:.034,1997:.017,1998:.016,1999:.027,2e3:.034,2001:.016,2002:.024,2003:.019,2004:.033,2005:.034,2006:.025,2007:.041,2008:.001,2009:.027,2010:.015,2011:.03,2012:.017,2013:.015,2014:.008,2015:.007,2016:.021,2017:.021,2018:.019,2019:.023,2020:.012,2021:.07,2022:.065,2023:.032,2024:.029},Uy={GREAT_DEPRESSION:{name:"Great Depression",equity:[-.17,-.34,-.53,-.23,.67,.04,.39,.25,-.38,.28],inflation:[0,-.06,-.09,-.1,.01,.02,.03,.01,.03,-.02],color:"#e74c3c"},STAGFLATION_70S:{name:"Stagflation 70s",equity:[-.17,-.28,.38,.18,-.13,-.03,.04,.15,-.09,.2],inflation:[.09,.12,.07,.05,.07,.09,.13,.13,.09,.04],color:"#e67e22"},LOST_DECADE_2000S:{name:"Lost Decade 2000s",equity:[-.06,-.07,-.17,.25,.03,-.01,.16,.06,-.34,.19],inflation:[.03,.02,.02,.02,.03,.03,.03,.04,0,.03],color:"#9b59b6"},CRISIS_2008:{name:"2008 Crisis",equity:[-.34,.19,.11,.06,.07,.27,.08,-.02,.13,.25],inflation:[0,.03,.02,.03,.02,.02,.01,.01,.02,.02],color:"#3498db"},SYNTHETIC_WORST:{name:"Synthetic Worst",equity:[-.4,.1,.1,.1,-.35,.1,.1,.1,.1,-.3],inflation:[.08,.05,.05,.05,.08,.05,.05,.05,.05,.08],color:"#1abc9c"}},dn={START_MONTH:4,START_DAY:6};function xl(t,e,n,i=Ye.HIGHER_RATE_LIMIT){if(t<=0)return 0;let r=e;if(t>Ye.PA_TAPER_THRESHOLD){const f=(t-Ye.PA_TAPER_THRESHOLD)*Ye.PA_TAPER_RATE;r=Math.max(0,e-f)}const s=Math.max(0,t-r),o=Math.max(0,n-r),l=i-n;let c=0;const u=Math.min(s,o);if(c+=u*Ye.BASIC_RATE,s>o){const f=Math.min(s-o,l);c+=f*Ye.HIGHER_RATE}if(s>o+l){const f=s-o-l;c+=f*Ye.ADDITIONAL_RATE}return c}function Nn(t,e,n,i=Ye.HIGHER_RATE_LIMIT){return t-xl(t,e,n,i)}function qy(t,e,n,i=Ye.HIGHER_RATE_LIMIT){if(t<=0)return 0;let r=t,s=t+1;for(;Nn(s,e,n,i)<t&&s<1e12;)s*=2;for(let o=0;o<60;o++){const l=(r+s)/2;Nn(l,e,n,i)<t?r=l:s=l}return(r+s)/2}function ga(t){const e=typeof t=="string"?new Date(t):t,n=e.getFullYear(),i=e.getMonth()+1,r=e.getDate();if(i<dn.START_MONTH||i===dn.START_MONTH&&r<dn.START_DAY){const s=n-1;return`${String(s).slice(-2)}/${String(n).slice(-2)}`}return`${String(n).slice(-2)}/${String(n+1).slice(-2)}`}function dl(t){const e=parseInt(t.split("/")[0]),n=e<50?2e3+e:1900+e;return new Date(n,dn.START_MONTH-1,dn.START_DAY)}function Hy(t){const e=parseInt(t.split("/")[1]),n=e<50?2e3+e:1900+e;return new Date(n,dn.START_MONTH-1,dn.START_DAY-1)}function Wy(){const t=new Date;return`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}`}function vc(t){const[e,n]=t.split("-").map(Number);return new Date(e,n-1,15)}function Gy(t){const n=(typeof t=="string"?new Date(t):t).getMonth()+1;return n>=dn.START_MONTH?12-(n-dn.START_MONTH):dn.START_MONTH-n}const Yy=yc.ASSUMED_CPI,jy=yc.OTHER_INCOME_CAP;function Ky(t,e,n=jy){let i=t;for(const r of e)i*=1+Math.min(r,n);return i}const Fd={TAX_EFFICIENT:"minimiseEarlyTax",LONGEVITY:"maximiseLongevity"};function Qy(t,e){return t<=0?t:t*Math.pow(1+e,1/12)}function bc({targetGross:t,fixedIncome:e=0,pa:n,brl:i,hrl:r,isaBalance:s=0,strategy:o=Fd.TAX_EFFICIENT,yearsUntilSp:l=0}){const c=Nn(t,n,i,r),u=Math.max(0,Math.min(i,t)-e),f=Nn(u+e,n,i,r),m=Math.max(0,c-f),p=o===Fd.LONGEVITY&&l>0?s/l:1/0,w=Math.max(0,Math.min(m,Math.max(0,s),p)),I=s-w,S=m-w;let A=u;if(S>0){const L=qy(f+S,n,i,r);A=Math.max(u,L-e)}const C=A+e,P=Nn(C,n,i,r);return{sippGross:A,isaDraw:w,remainingIsa:I,taxable:C,tax:C-P,net:P+w}}const Jy=5,Xy=20,Zy=.01;function ev(t){return Math.min(Math.max(0,Math.floor(t)-Jy+1),Xy)}function Go(t,e="declining"){return e!=="declining"?1:Math.pow(1-Zy,ev(t))}function tv(t,e="declining"){if(e!=="declining")return 0;const n=Go(t-1,e);return n===0?0:1-Go(t,e)/n}function Sf(t,e,n=.025){const i=[];let r=t.isaBalance||0;const s=Math.max(0,n-.01);for(let o=0;o<=e;o++){const l=Math.pow(1+n,o),c=t.taxMode==="frozen"?t.pa:t.pa*l,u=t.taxMode==="frozen"?t.brl:t.brl*l,f=t.taxMode==="frozen"?t.hrl||125140:(t.hrl||125140)*l,m=Go(o,t.spendingProfile||"flat"),p=(t.baseSalary||0)*l*m,w=(t.other||0)*l,I=t.statePensionYear!==void 0&&o>=t.statePensionYear?(t.statePension||0)*l:0,S=w+I,A=Math.max(0,(t.statePensionYear??0)-o),C=bc({targetGross:p,fixedIncome:S,pa:c,brl:u,hrl:f,isaBalance:r,strategy:t.isaDrawdownStrategy,yearsUntilSp:A}),P=C.taxable-C.tax,L=r;r=C.remainingIsa*(1+s),i.push({year:o,brl:u,other:w,statePension:I,sippDraw:C.sippGross,totalTaxable:C.taxable,tax:C.tax,netIncome:P,target:p,isaDraw:C.isaDraw,isaBalance:L,spendable:C.net})}return i}function On(t,e,n,i,r){if(r){const s=Math.max(0,1-e/n);return t*i*s}return t*i}const $n={cautious:{key:"cautious",label:"Cautious",equity:.3,bond:.45,cash:.25},balanced:{key:"balanced",label:"Balanced",equity:.5,bond:.4,cash:.1},adventurous:{key:"adventurous",label:"Adventurous",equity:.7,bond:.25,cash:.05}};function ya(t,e,n){if(!t)return null;const i=Math.max(5,n-20),r=Math.min(1,e/i);return t.start+(t.end-t.start)*r}function $s(t,e,n=.22){const i=t+e;if(i<=0)return{start:0,end:0};const r=t/i;return{start:Math.max(0,r-n),end:r}}const nv=.12;function xf(t,e,n=null,i=nv){const r=t+e;if(r<=0)return{start:0,end:0};const s=t/r;let o;return n&&n.equityPct+n.bondPct>0?o=n.equityPct/(n.equityPct+n.bondPct):o=Math.min(1,s+i),{start:s,end:o}}function Af(t){const e=!!(t.subAsset&&t.subAsset.bondWeights&&Object.keys(t.subAsset.bondWeights).length>0),n=t.glideEndgame&&t.glideEndgame.equityPct+t.glideEndgame.bondPct>0?t.glideEndgame:null;return e?xf(t.equityMin,t.bondMin,n):$s(t.equityMin,t.bondMin)}function Al(t,e,n){const i=t.cash,r=Math.max(0,1-i),s=ya(t.equityGlide,e,n);return s==null?{equity:t.equity,bond:t.bond,cash:i}:{equity:r*s,bond:r*(1-s),cash:i}}function iv(t,e,n){const i=On(t.equityMin,e,t.duration,n,!0),r=On(t.bondMin,e,t.duration,n,!0),s=On(t.cashTarget,e,t.duration,n,!1);return{equity:i,bond:r,cash:s,totalGrowth:i+r,total:i+r+s}}function rv(t,e=yc.ASSUMED_CPI){const n=[],i=t.equityGlideEnabled?$s(t.equityMin,t.bondMin):null;for(let r=0;r<=t.duration;r++){const s=Math.pow(1+e,r),o=iv(t,r,s);let l=o.equity,c=o.bond;if(i){const u=ya(i,r,t.duration),f=l+c;l=f*u,c=f*(1-u)}n.push({year:r,cumulativeInflation:s,equityMin:l,bondMin:c,cashTarget:o.cash,totalMin:l+c+o.cash})}return n}const sv="modulepreload",ov=function(t,e){return new URL(t,e).href},Vd={},zd=function(e,n,i){let r=Promise.resolve();if(n&&n.length>0){const o=document.getElementsByTagName("link"),l=document.querySelector("meta[property=csp-nonce]"),c=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));r=Promise.allSettled(n.map(u=>{if(u=ov(u,i),u in Vd)return;Vd[u]=!0;const f=u.endsWith(".css"),m=f?'[rel="stylesheet"]':"";if(!!i)for(let I=o.length-1;I>=0;I--){const S=o[I];if(S.href===u&&(!f||S.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${u}"]${m}`))return;const w=document.createElement("link");if(w.rel=f?"stylesheet":sv,f||(w.as="script"),w.crossOrigin="",w.href=u,c&&w.setAttribute("nonce",c),document.head.appendChild(w),f)return new Promise((I,S)=>{w.addEventListener("load",I),w.addEventListener("error",()=>S(new Error(`Unable to preload CSS for ${u}`)))})}))}function s(o){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=o,window.dispatchEvent(l),!l.defaultPrevented)throw o}return r.then(o=>{for(const l of o||[])l.status==="rejected"&&s(l.reason);return e().catch(s)})};function wc(t){let e=t;return function(){return e=Math.sin(e)*1e4,e-Math.floor(e)}}function lr(t,e,n){const i=Math.max(n(),1e-12),r=n();let s=Math.sqrt(-2*Math.log(i))*Math.cos(2*Math.PI*r);return s=Math.max(-4,Math.min(4,s)),t+e*s}function va(t){const e=JSON.stringify(t);let n=0;for(let i=0;i<e.length;i++){const r=e.charCodeAt(i);n=(n<<5)-n+r,n=n&n}return n.toString(16)}var $d={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kf=function(t){const e=[];let n=0;for(let i=0;i<t.length;i++){let r=t.charCodeAt(i);r<128?e[n++]=r:r<2048?(e[n++]=r>>6|192,e[n++]=r&63|128):(r&64512)===55296&&i+1<t.length&&(t.charCodeAt(i+1)&64512)===56320?(r=65536+((r&1023)<<10)+(t.charCodeAt(++i)&1023),e[n++]=r>>18|240,e[n++]=r>>12&63|128,e[n++]=r>>6&63|128,e[n++]=r&63|128):(e[n++]=r>>12|224,e[n++]=r>>6&63|128,e[n++]=r&63|128)}return e},av=function(t){const e=[];let n=0,i=0;for(;n<t.length;){const r=t[n++];if(r<128)e[i++]=String.fromCharCode(r);else if(r>191&&r<224){const s=t[n++];e[i++]=String.fromCharCode((r&31)<<6|s&63)}else if(r>239&&r<365){const s=t[n++],o=t[n++],l=t[n++],c=((r&7)<<18|(s&63)<<12|(o&63)<<6|l&63)-65536;e[i++]=String.fromCharCode(55296+(c>>10)),e[i++]=String.fromCharCode(56320+(c&1023))}else{const s=t[n++],o=t[n++];e[i++]=String.fromCharCode((r&15)<<12|(s&63)<<6|o&63)}}return e.join("")},Cf={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,i=[];for(let r=0;r<t.length;r+=3){const s=t[r],o=r+1<t.length,l=o?t[r+1]:0,c=r+2<t.length,u=c?t[r+2]:0,f=s>>2,m=(s&3)<<4|l>>4;let p=(l&15)<<2|u>>6,w=u&63;c||(w=64,o||(p=64)),i.push(n[f],n[m],n[p],n[w])}return i.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(kf(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):av(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,i=[];for(let r=0;r<t.length;){const s=n[t.charAt(r++)],l=r<t.length?n[t.charAt(r)]:0;++r;const u=r<t.length?n[t.charAt(r)]:64;++r;const m=r<t.length?n[t.charAt(r)]:64;if(++r,s==null||l==null||u==null||m==null)throw new lv;const p=s<<2|l>>4;if(i.push(p),u!==64){const w=l<<4&240|u>>2;if(i.push(w),m!==64){const I=u<<6&192|m;i.push(I)}}}return i},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class lv extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const cv=function(t){const e=kf(t);return Cf.encodeByteArray(e,!0)},Yo=function(t){return cv(t).replace(/\./g,"")},Rf=function(t){try{return Cf.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function uv(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const dv=()=>uv().__FIREBASE_DEFAULTS__,hv=()=>{if(typeof process>"u"||typeof $d>"u")return;const t=$d.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},fv=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&Rf(t[1]);return e&&JSON.parse(e)},ba=()=>{try{return dv()||hv()||fv()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},Pf=t=>{var e,n;return(n=(e=ba())===null||e===void 0?void 0:e.emulatorHosts)===null||n===void 0?void 0:n[t]},pv=t=>{const e=Pf(t);if(!e)return;const n=e.lastIndexOf(":");if(n<=0||n+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const i=parseInt(e.substring(n+1),10);return e[0]==="["?[e.substring(1,n-1),i]:[e.substring(0,n),i]},Mf=()=>{var t;return(t=ba())===null||t===void 0?void 0:t.config},Df=t=>{var e;return(e=ba())===null||e===void 0?void 0:e[`_${t}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mv{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,i)=>{n?this.reject(n):this.resolve(i),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,i))}}}/**
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
 */function gv(t,e){if(t.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n={alg:"none",type:"JWT"},i=e||"demo-project",r=t.iat||0,s=t.sub||t.user_id;if(!s)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${i}`,aud:i,iat:r,exp:r+3600,auth_time:r,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}}},t);return[Yo(JSON.stringify(n)),Yo(JSON.stringify(o)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ct(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function yv(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(ct())}function vv(){var t;const e=(t=ba())===null||t===void 0?void 0:t.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function bv(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function wv(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function _v(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Ev(){const t=ct();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function Tv(){return!vv()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Iv(){try{return typeof indexedDB=="object"}catch{return!1}}function Sv(){return new Promise((t,e)=>{try{let n=!0;const i="validate-browser-context-for-indexeddb-analytics-module",r=self.indexedDB.open(i);r.onsuccess=()=>{r.result.close(),n||self.indexedDB.deleteDatabase(i),t(!0)},r.onupgradeneeded=()=>{n=!1},r.onerror=()=>{var s;e(((s=r.error)===null||s===void 0?void 0:s.message)||"")}}catch(n){e(n)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xv="FirebaseError";class jn extends Error{constructor(e,n,i){super(n),this.code=e,this.customData=i,this.name=xv,Object.setPrototypeOf(this,jn.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Us.prototype.create)}}class Us{constructor(e,n,i){this.service=e,this.serviceName=n,this.errors=i}create(e,...n){const i=n[0]||{},r=`${this.service}/${e}`,s=this.errors[e],o=s?Av(s,i):"Error",l=`${this.serviceName}: ${o} (${r}).`;return new jn(r,l,i)}}function Av(t,e){return t.replace(kv,(n,i)=>{const r=e[i];return r!=null?String(r):`<${i}?>`})}const kv=/\{\$([^}]+)}/g;function Cv(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function jo(t,e){if(t===e)return!0;const n=Object.keys(t),i=Object.keys(e);for(const r of n){if(!i.includes(r))return!1;const s=t[r],o=e[r];if(Ud(s)&&Ud(o)){if(!jo(s,o))return!1}else if(s!==o)return!1}for(const r of i)if(!n.includes(r))return!1;return!0}function Ud(t){return t!==null&&typeof t=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qs(t){const e=[];for(const[n,i]of Object.entries(t))Array.isArray(i)?i.forEach(r=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(r))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(i));return e.length?"&"+e.join("&"):""}function ss(t){const e={};return t.replace(/^\?/,"").split("&").forEach(i=>{if(i){const[r,s]=i.split("=");e[decodeURIComponent(r)]=decodeURIComponent(s)}}),e}function os(t){const e=t.indexOf("?");if(!e)return"";const n=t.indexOf("#",e);return t.substring(e,n>0?n:void 0)}function Rv(t,e){const n=new Pv(t,e);return n.subscribe.bind(n)}class Pv{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(i=>{this.error(i)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,i){let r;if(e===void 0&&n===void 0&&i===void 0)throw new Error("Missing Observer.");Mv(e,["next","error","complete"])?r=e:r={next:e,error:n,complete:i},r.next===void 0&&(r.next=hl),r.error===void 0&&(r.error=hl),r.complete===void 0&&(r.complete=hl);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?r.error(this.finalError):r.complete()}catch{}}),this.observers.push(r),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(i){typeof console<"u"&&console.error&&console.error(i)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Mv(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function hl(){}/**
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
 */function Me(t){return t&&t._delegate?t._delegate:t}class Gi{constructor(e,n,i){this.name=e,this.instanceFactory=n,this.type=i,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Li="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dv{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const i=new mv;if(this.instancesDeferred.set(n,i),this.isInitialized(n)||this.shouldAutoInitialize())try{const r=this.getOrInitializeService({instanceIdentifier:n});r&&i.resolve(r)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){var n;const i=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(n=e==null?void 0:e.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(i)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:i})}catch(s){if(r)return null;throw s}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Lv(e))try{this.getOrInitializeService({instanceIdentifier:Li})}catch{}for(const[n,i]of this.instancesDeferred.entries()){const r=this.normalizeInstanceIdentifier(n);try{const s=this.getOrInitializeService({instanceIdentifier:r});i.resolve(s)}catch{}}}}clearInstance(e=Li){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Li){return this.instances.has(e)}getOptions(e=Li){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,i=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(i))throw Error(`${this.name}(${i}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const r=this.getOrInitializeService({instanceIdentifier:i,options:n});for(const[s,o]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(s);i===l&&o.resolve(r)}return r}onInit(e,n){var i;const r=this.normalizeInstanceIdentifier(n),s=(i=this.onInitCallbacks.get(r))!==null&&i!==void 0?i:new Set;s.add(e),this.onInitCallbacks.set(r,s);const o=this.instances.get(r);return o&&e(o,r),()=>{s.delete(e)}}invokeOnInitCallbacks(e,n){const i=this.onInitCallbacks.get(n);if(i)for(const r of i)try{r(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let i=this.instances.get(e);if(!i&&this.component&&(i=this.component.instanceFactory(this.container,{instanceIdentifier:Bv(e),options:n}),this.instances.set(e,i),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(i,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,i)}catch{}return i||null}normalizeInstanceIdentifier(e=Li){return this.component?this.component.multipleInstances?e:Li:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Bv(t){return t===Li?void 0:t}function Lv(t){return t.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nv{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new Dv(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var oe;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(oe||(oe={}));const Ov={debug:oe.DEBUG,verbose:oe.VERBOSE,info:oe.INFO,warn:oe.WARN,error:oe.ERROR,silent:oe.SILENT},Fv=oe.INFO,Vv={[oe.DEBUG]:"log",[oe.VERBOSE]:"log",[oe.INFO]:"info",[oe.WARN]:"warn",[oe.ERROR]:"error"},zv=(t,e,...n)=>{if(e<t.logLevel)return;const i=new Date().toISOString(),r=Vv[e];if(r)console[r](`[${i}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class _c{constructor(e){this.name=e,this._logLevel=Fv,this._logHandler=zv,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in oe))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Ov[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,oe.DEBUG,...e),this._logHandler(this,oe.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,oe.VERBOSE,...e),this._logHandler(this,oe.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,oe.INFO,...e),this._logHandler(this,oe.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,oe.WARN,...e),this._logHandler(this,oe.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,oe.ERROR,...e),this._logHandler(this,oe.ERROR,...e)}}const $v=(t,e)=>e.some(n=>t instanceof n);let qd,Hd;function Uv(){return qd||(qd=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function qv(){return Hd||(Hd=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Bf=new WeakMap,kl=new WeakMap,Lf=new WeakMap,fl=new WeakMap,Ec=new WeakMap;function Hv(t){const e=new Promise((n,i)=>{const r=()=>{t.removeEventListener("success",s),t.removeEventListener("error",o)},s=()=>{n(pi(t.result)),r()},o=()=>{i(t.error),r()};t.addEventListener("success",s),t.addEventListener("error",o)});return e.then(n=>{n instanceof IDBCursor&&Bf.set(n,t)}).catch(()=>{}),Ec.set(e,t),e}function Wv(t){if(kl.has(t))return;const e=new Promise((n,i)=>{const r=()=>{t.removeEventListener("complete",s),t.removeEventListener("error",o),t.removeEventListener("abort",o)},s=()=>{n(),r()},o=()=>{i(t.error||new DOMException("AbortError","AbortError")),r()};t.addEventListener("complete",s),t.addEventListener("error",o),t.addEventListener("abort",o)});kl.set(t,e)}let Cl={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return kl.get(t);if(e==="objectStoreNames")return t.objectStoreNames||Lf.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return pi(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function Gv(t){Cl=t(Cl)}function Yv(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const i=t.call(pl(this),e,...n);return Lf.set(i,e.sort?e.sort():[e]),pi(i)}:qv().includes(t)?function(...e){return t.apply(pl(this),e),pi(Bf.get(this))}:function(...e){return pi(t.apply(pl(this),e))}}function jv(t){return typeof t=="function"?Yv(t):(t instanceof IDBTransaction&&Wv(t),$v(t,Uv())?new Proxy(t,Cl):t)}function pi(t){if(t instanceof IDBRequest)return Hv(t);if(fl.has(t))return fl.get(t);const e=jv(t);return e!==t&&(fl.set(t,e),Ec.set(e,t)),e}const pl=t=>Ec.get(t);function Kv(t,e,{blocked:n,upgrade:i,blocking:r,terminated:s}={}){const o=indexedDB.open(t,e),l=pi(o);return i&&o.addEventListener("upgradeneeded",c=>{i(pi(o.result),c.oldVersion,c.newVersion,pi(o.transaction),c)}),n&&o.addEventListener("blocked",c=>n(c.oldVersion,c.newVersion,c)),l.then(c=>{s&&c.addEventListener("close",()=>s()),r&&c.addEventListener("versionchange",u=>r(u.oldVersion,u.newVersion,u))}).catch(()=>{}),l}const Qv=["get","getKey","getAll","getAllKeys","count"],Jv=["put","add","delete","clear"],ml=new Map;function Wd(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(ml.get(e))return ml.get(e);const n=e.replace(/FromIndex$/,""),i=e!==n,r=Jv.includes(n);if(!(n in(i?IDBIndex:IDBObjectStore).prototype)||!(r||Qv.includes(n)))return;const s=async function(o,...l){const c=this.transaction(o,r?"readwrite":"readonly");let u=c.store;return i&&(u=u.index(l.shift())),(await Promise.all([u[n](...l),r&&c.done]))[0]};return ml.set(e,s),s}Gv(t=>({...t,get:(e,n,i)=>Wd(e,n)||t.get(e,n,i),has:(e,n)=>!!Wd(e,n)||t.has(e,n)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xv{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(Zv(n)){const i=n.getImmediate();return`${i.library}/${i.version}`}else return null}).filter(n=>n).join(" ")}}function Zv(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Rl="@firebase/app",Gd="0.10.13";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Un=new _c("@firebase/app"),e0="@firebase/app-compat",t0="@firebase/analytics-compat",n0="@firebase/analytics",i0="@firebase/app-check-compat",r0="@firebase/app-check",s0="@firebase/auth",o0="@firebase/auth-compat",a0="@firebase/database",l0="@firebase/data-connect",c0="@firebase/database-compat",u0="@firebase/functions",d0="@firebase/functions-compat",h0="@firebase/installations",f0="@firebase/installations-compat",p0="@firebase/messaging",m0="@firebase/messaging-compat",g0="@firebase/performance",y0="@firebase/performance-compat",v0="@firebase/remote-config",b0="@firebase/remote-config-compat",w0="@firebase/storage",_0="@firebase/storage-compat",E0="@firebase/firestore",T0="@firebase/vertexai-preview",I0="@firebase/firestore-compat",S0="firebase",x0="10.14.1";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pl="[DEFAULT]",A0={[Rl]:"fire-core",[e0]:"fire-core-compat",[n0]:"fire-analytics",[t0]:"fire-analytics-compat",[r0]:"fire-app-check",[i0]:"fire-app-check-compat",[s0]:"fire-auth",[o0]:"fire-auth-compat",[a0]:"fire-rtdb",[l0]:"fire-data-connect",[c0]:"fire-rtdb-compat",[u0]:"fire-fn",[d0]:"fire-fn-compat",[h0]:"fire-iid",[f0]:"fire-iid-compat",[p0]:"fire-fcm",[m0]:"fire-fcm-compat",[g0]:"fire-perf",[y0]:"fire-perf-compat",[v0]:"fire-rc",[b0]:"fire-rc-compat",[w0]:"fire-gcs",[_0]:"fire-gcs-compat",[E0]:"fire-fst",[I0]:"fire-fst-compat",[T0]:"fire-vertex","fire-js":"fire-js",[S0]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ko=new Map,k0=new Map,Ml=new Map;function Yd(t,e){try{t.container.addComponent(e)}catch(n){Un.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function wr(t){const e=t.name;if(Ml.has(e))return Un.debug(`There were multiple attempts to register component ${e}.`),!1;Ml.set(e,t);for(const n of Ko.values())Yd(n,t);for(const n of k0.values())Yd(n,t);return!0}function Tc(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function Qt(t){return t.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const C0={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},mi=new Us("app","Firebase",C0);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class R0{constructor(e,n,i){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=i,this.container.addComponent(new Gi("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw mi.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mr=x0;function Nf(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const i=Object.assign({name:Pl,automaticDataCollectionEnabled:!1},e),r=i.name;if(typeof r!="string"||!r)throw mi.create("bad-app-name",{appName:String(r)});if(n||(n=Mf()),!n)throw mi.create("no-options");const s=Ko.get(r);if(s){if(jo(n,s.options)&&jo(i,s.config))return s;throw mi.create("duplicate-app",{appName:r})}const o=new Nv(r);for(const c of Ml.values())o.addComponent(c);const l=new R0(n,i,o);return Ko.set(r,l),l}function Of(t=Pl){const e=Ko.get(t);if(!e&&t===Pl&&Mf())return Nf();if(!e)throw mi.create("no-app",{appName:t});return e}function gi(t,e,n){var i;let r=(i=A0[t])!==null&&i!==void 0?i:t;n&&(r+=`-${n}`);const s=r.match(/\s|\//),o=e.match(/\s|\//);if(s||o){const l=[`Unable to register library "${r}" with version "${e}":`];s&&l.push(`library name "${r}" contains illegal characters (whitespace or "/")`),s&&o&&l.push("and"),o&&l.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Un.warn(l.join(" "));return}wr(new Gi(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
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
 */const P0="firebase-heartbeat-database",M0=1,Es="firebase-heartbeat-store";let gl=null;function Ff(){return gl||(gl=Kv(P0,M0,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(Es)}catch(n){console.warn(n)}}}}).catch(t=>{throw mi.create("idb-open",{originalErrorMessage:t.message})})),gl}async function D0(t){try{const n=(await Ff()).transaction(Es),i=await n.objectStore(Es).get(Vf(t));return await n.done,i}catch(e){if(e instanceof jn)Un.warn(e.message);else{const n=mi.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Un.warn(n.message)}}}async function jd(t,e){try{const i=(await Ff()).transaction(Es,"readwrite");await i.objectStore(Es).put(e,Vf(t)),await i.done}catch(n){if(n instanceof jn)Un.warn(n.message);else{const i=mi.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});Un.warn(i.message)}}}function Vf(t){return`${t.name}!${t.options.appId}`}/**
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
 */const B0=1024,L0=30*24*60*60*1e3;class N0{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new F0(n),this._heartbeatsCachePromise=this._storage.read().then(i=>(this._heartbeatsCache=i,i))}async triggerHeartbeat(){var e,n;try{const r=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=Kd();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)===null||n===void 0?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(o=>o.date===s)?void 0:(this._heartbeatsCache.heartbeats.push({date:s,agent:r}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(o=>{const l=new Date(o.date).valueOf();return Date.now()-l<=L0}),this._storage.overwrite(this._heartbeatsCache))}catch(i){Un.warn(i)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=Kd(),{heartbeatsToSend:i,unsentEntries:r}=O0(this._heartbeatsCache.heartbeats),s=Yo(JSON.stringify({version:2,heartbeats:i}));return this._heartbeatsCache.lastSentHeartbeatDate=n,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(n){return Un.warn(n),""}}}function Kd(){return new Date().toISOString().substring(0,10)}function O0(t,e=B0){const n=[];let i=t.slice();for(const r of t){const s=n.find(o=>o.agent===r.agent);if(s){if(s.dates.push(r.date),Qd(n)>e){s.dates.pop();break}}else if(n.push({agent:r.agent,dates:[r.date]}),Qd(n)>e){n.pop();break}i=i.slice(1)}return{heartbeatsToSend:n,unsentEntries:i}}class F0{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Iv()?Sv().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await D0(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var n;if(await this._canUseIndexedDBPromise){const r=await this.read();return jd(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var n;if(await this._canUseIndexedDBPromise){const r=await this.read();return jd(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function Qd(t){return Yo(JSON.stringify({version:2,heartbeats:t})).length}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function V0(t){wr(new Gi("platform-logger",e=>new Xv(e),"PRIVATE")),wr(new Gi("heartbeat",e=>new N0(e),"PRIVATE")),gi(Rl,Gd,t),gi(Rl,Gd,"esm2017"),gi("fire-js","")}V0("");var z0="firebase",$0="10.14.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */gi(z0,$0,"app");function Ic(t,e){var n={};for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&e.indexOf(i)<0&&(n[i]=t[i]);if(t!=null&&typeof Object.getOwnPropertySymbols=="function")for(var r=0,i=Object.getOwnPropertySymbols(t);r<i.length;r++)e.indexOf(i[r])<0&&Object.prototype.propertyIsEnumerable.call(t,i[r])&&(n[i[r]]=t[i[r]]);return n}function zf(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const U0=zf,$f=new Us("auth","Firebase",zf());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qo=new _c("@firebase/auth");function q0(t,...e){Qo.logLevel<=oe.WARN&&Qo.warn(`Auth (${Mr}): ${t}`,...e)}function Mo(t,...e){Qo.logLevel<=oe.ERROR&&Qo.error(`Auth (${Mr}): ${t}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qt(t,...e){throw xc(t,...e)}function Xt(t,...e){return xc(t,...e)}function Sc(t,e,n){const i=Object.assign(Object.assign({},U0()),{[e]:n});return new Us("auth","Firebase",i).create(e,{appName:t.name})}function Fn(t){return Sc(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function H0(t,e,n){const i=n;if(!(e instanceof i))throw i.name!==e.constructor.name&&qt(t,"argument-error"),Sc(t,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function xc(t,...e){if(typeof t!="string"){const n=e[0],i=[...e.slice(1)];return i[0]&&(i[0].appName=t.name),t._errorFactory.create(n,...i)}return $f.create(t,...e)}function G(t,e,...n){if(!t)throw xc(e,...n)}function Mn(t){const e="INTERNAL ASSERTION FAILED: "+t;throw Mo(e),new Error(e)}function qn(t,e){t||Mn(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Dl(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.href)||""}function W0(){return Jd()==="http:"||Jd()==="https:"}function Jd(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function G0(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(W0()||wv()||"connection"in navigator)?navigator.onLine:!0}function Y0(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hs{constructor(e,n){this.shortDelay=e,this.longDelay=n,qn(n>e,"Short delay should be less than long delay!"),this.isMobile=yv()||_v()}get(){return G0()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ac(t,e){qn(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uf{static initialize(e,n,i){this.fetchImpl=e,n&&(this.headersImpl=n),i&&(this.responseImpl=i)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Mn("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Mn("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Mn("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const j0={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const K0=new Hs(3e4,6e4);function Kn(t,e){return t.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:t.tenantId}):e}async function yn(t,e,n,i,r={}){return qf(t,r,async()=>{let s={},o={};i&&(e==="GET"?o=i:s={body:JSON.stringify(i)});const l=qs(Object.assign({key:t.config.apiKey},o)).slice(1),c=await t._getAdditionalHeaders();c["Content-Type"]="application/json",t.languageCode&&(c["X-Firebase-Locale"]=t.languageCode);const u=Object.assign({method:e,headers:c},s);return bv()||(u.referrerPolicy="no-referrer"),Uf.fetch()(Hf(t,t.config.apiHost,n,l),u)})}async function qf(t,e,n){t._canInitEmulator=!1;const i=Object.assign(Object.assign({},j0),e);try{const r=new J0(t),s=await Promise.race([n(),r.promise]);r.clearNetworkTimeout();const o=await s.json();if("needConfirmation"in o)throw xo(t,"account-exists-with-different-credential",o);if(s.ok&&!("errorMessage"in o))return o;{const l=s.ok?o.errorMessage:o.error.message,[c,u]=l.split(" : ");if(c==="FEDERATED_USER_ID_ALREADY_LINKED")throw xo(t,"credential-already-in-use",o);if(c==="EMAIL_EXISTS")throw xo(t,"email-already-in-use",o);if(c==="USER_DISABLED")throw xo(t,"user-disabled",o);const f=i[c]||c.toLowerCase().replace(/[_\s]+/g,"-");if(u)throw Sc(t,f,u);qt(t,f)}}catch(r){if(r instanceof jn)throw r;qt(t,"network-request-failed",{message:String(r)})}}async function Ws(t,e,n,i,r={}){const s=await yn(t,e,n,i,r);return"mfaPendingCredential"in s&&qt(t,"multi-factor-auth-required",{_serverResponse:s}),s}function Hf(t,e,n,i){const r=`${e}${n}?${i}`;return t.config.emulator?Ac(t.config,r):`${t.config.apiScheme}://${r}`}function Q0(t){switch(t){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class J0{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,i)=>{this.timer=setTimeout(()=>i(Xt(this.auth,"network-request-failed")),K0.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function xo(t,e,n){const i={appName:t.name};n.email&&(i.email=n.email),n.phoneNumber&&(i.phoneNumber=n.phoneNumber);const r=Xt(t,e,i);return r.customData._tokenResponse=n,r}function Xd(t){return t!==void 0&&t.enterprise!==void 0}class X0{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const n of this.recaptchaEnforcementState)if(n.provider&&n.provider===e)return Q0(n.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}}async function Z0(t,e){return yn(t,"GET","/v2/recaptchaConfig",Kn(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function eb(t,e){return yn(t,"POST","/v1/accounts:delete",e)}async function Wf(t,e){return yn(t,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fs(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function tb(t,e=!1){const n=Me(t),i=await n.getIdToken(e),r=kc(i);G(r&&r.exp&&r.auth_time&&r.iat,n.auth,"internal-error");const s=typeof r.firebase=="object"?r.firebase:void 0,o=s==null?void 0:s.sign_in_provider;return{claims:r,token:i,authTime:fs(yl(r.auth_time)),issuedAtTime:fs(yl(r.iat)),expirationTime:fs(yl(r.exp)),signInProvider:o||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function yl(t){return Number(t)*1e3}function kc(t){const[e,n,i]=t.split(".");if(e===void 0||n===void 0||i===void 0)return Mo("JWT malformed, contained fewer than 3 sections"),null;try{const r=Rf(n);return r?JSON.parse(r):(Mo("Failed to decode base64 JWT payload"),null)}catch(r){return Mo("Caught error parsing JWT payload as JSON",r==null?void 0:r.toString()),null}}function Zd(t){const e=kc(t);return G(e,"internal-error"),G(typeof e.exp<"u","internal-error"),G(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _r(t,e,n=!1){if(n)return e;try{return await e}catch(i){throw i instanceof jn&&nb(i)&&t.auth.currentUser===t&&await t.auth.signOut(),i}}function nb({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ib{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var n;if(e){const i=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),i}else{this.errorBackoff=3e4;const r=((n=this.user.stsTokenManager.expirationTime)!==null&&n!==void 0?n:0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bl{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=fs(this.lastLoginAt),this.creationTime=fs(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Jo(t){var e;const n=t.auth,i=await t.getIdToken(),r=await _r(t,Wf(n,{idToken:i}));G(r==null?void 0:r.users.length,n,"internal-error");const s=r.users[0];t._notifyReloadListener(s);const o=!((e=s.providerUserInfo)===null||e===void 0)&&e.length?Gf(s.providerUserInfo):[],l=sb(t.providerData,o),c=t.isAnonymous,u=!(t.email&&s.passwordHash)&&!(l!=null&&l.length),f=c?u:!1,m={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:l,metadata:new Bl(s.createdAt,s.lastLoginAt),isAnonymous:f};Object.assign(t,m)}async function rb(t){const e=Me(t);await Jo(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function sb(t,e){return[...t.filter(i=>!e.some(r=>r.providerId===i.providerId)),...e]}function Gf(t){return t.map(e=>{var{providerId:n}=e,i=Ic(e,["providerId"]);return{providerId:n,uid:i.rawId||"",displayName:i.displayName||null,email:i.email||null,phoneNumber:i.phoneNumber||null,photoURL:i.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ob(t,e){const n=await qf(t,{},async()=>{const i=qs({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:r,apiKey:s}=t.config,o=Hf(t,r,"/v1/token",`key=${s}`),l=await t._getAdditionalHeaders();return l["Content-Type"]="application/x-www-form-urlencoded",Uf.fetch()(o,{method:"POST",headers:l,body:i})});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function ab(t,e){return yn(t,"POST","/v2/accounts:revokeToken",Kn(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fr{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){G(e.idToken,"internal-error"),G(typeof e.idToken<"u","internal-error"),G(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Zd(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){G(e.length!==0,"internal-error");const n=Zd(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(G(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:i,refreshToken:r,expiresIn:s}=await ob(e,n);this.updateTokensAndExpiration(i,r,Number(s))}updateTokensAndExpiration(e,n,i){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+i*1e3}static fromJSON(e,n){const{refreshToken:i,accessToken:r,expirationTime:s}=n,o=new fr;return i&&(G(typeof i=="string","internal-error",{appName:e}),o.refreshToken=i),r&&(G(typeof r=="string","internal-error",{appName:e}),o.accessToken=r),s&&(G(typeof s=="number","internal-error",{appName:e}),o.expirationTime=s),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new fr,this.toJSON())}_performRefresh(){return Mn("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function oi(t,e){G(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class Dn{constructor(e){var{uid:n,auth:i,stsTokenManager:r}=e,s=Ic(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new ib(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=n,this.auth=i,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new Bl(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const n=await _r(this,this.stsTokenManager.getToken(this.auth,e));return G(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return tb(this,e)}reload(){return rb(this)}_assign(e){this!==e&&(G(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>Object.assign({},n)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new Dn(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return n.metadata._copy(this.metadata),n}_onReload(e){G(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let i=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),i=!0),n&&await Jo(this),await this.auth._persistUserIfCurrent(this),i&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Qt(this.auth.app))return Promise.reject(Fn(this.auth));const e=await this.getIdToken();return await _r(this,eb(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){var i,r,s,o,l,c,u,f;const m=(i=n.displayName)!==null&&i!==void 0?i:void 0,p=(r=n.email)!==null&&r!==void 0?r:void 0,w=(s=n.phoneNumber)!==null&&s!==void 0?s:void 0,I=(o=n.photoURL)!==null&&o!==void 0?o:void 0,S=(l=n.tenantId)!==null&&l!==void 0?l:void 0,A=(c=n._redirectEventId)!==null&&c!==void 0?c:void 0,C=(u=n.createdAt)!==null&&u!==void 0?u:void 0,P=(f=n.lastLoginAt)!==null&&f!==void 0?f:void 0,{uid:L,emailVerified:N,isAnonymous:z,providerData:U,stsTokenManager:T}=n;G(L&&T,e,"internal-error");const y=fr.fromJSON(this.name,T);G(typeof L=="string",e,"internal-error"),oi(m,e.name),oi(p,e.name),G(typeof N=="boolean",e,"internal-error"),G(typeof z=="boolean",e,"internal-error"),oi(w,e.name),oi(I,e.name),oi(S,e.name),oi(A,e.name),oi(C,e.name),oi(P,e.name);const _=new Dn({uid:L,auth:e,email:p,emailVerified:N,displayName:m,isAnonymous:z,photoURL:I,phoneNumber:w,tenantId:S,stsTokenManager:y,createdAt:C,lastLoginAt:P});return U&&Array.isArray(U)&&(_.providerData=U.map(b=>Object.assign({},b))),A&&(_._redirectEventId=A),_}static async _fromIdTokenResponse(e,n,i=!1){const r=new fr;r.updateFromServerResponse(n);const s=new Dn({uid:n.localId,auth:e,stsTokenManager:r,isAnonymous:i});return await Jo(s),s}static async _fromGetAccountInfoResponse(e,n,i){const r=n.users[0];G(r.localId!==void 0,"internal-error");const s=r.providerUserInfo!==void 0?Gf(r.providerUserInfo):[],o=!(r.email&&r.passwordHash)&&!(s!=null&&s.length),l=new fr;l.updateFromIdToken(i);const c=new Dn({uid:r.localId,auth:e,stsTokenManager:l,isAnonymous:o}),u={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:s,metadata:new Bl(r.createdAt,r.lastLoginAt),isAnonymous:!(r.email&&r.passwordHash)&&!(s!=null&&s.length)};return Object.assign(c,u),c}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const eh=new Map;function Bn(t){qn(t instanceof Function,"Expected a class definition");let e=eh.get(t);return e?(qn(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,eh.set(t,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yf{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}Yf.type="NONE";const th=Yf;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Do(t,e,n){return`firebase:${t}:${e}:${n}`}class pr{constructor(e,n,i){this.persistence=e,this.auth=n,this.userKey=i;const{config:r,name:s}=this.auth;this.fullUserKey=Do(this.userKey,r.apiKey,s),this.fullPersistenceKey=Do("persistence",r.apiKey,s),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?Dn._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,i="authUser"){if(!n.length)return new pr(Bn(th),e,i);const r=(await Promise.all(n.map(async u=>{if(await u._isAvailable())return u}))).filter(u=>u);let s=r[0]||Bn(th);const o=Do(i,e.config.apiKey,e.name);let l=null;for(const u of n)try{const f=await u._get(o);if(f){const m=Dn._fromJSON(e,f);u!==s&&(l=m),s=u;break}}catch{}const c=r.filter(u=>u._shouldAllowMigration);return!s._shouldAllowMigration||!c.length?new pr(s,e,i):(s=c[0],l&&await s._set(o,l.toJSON()),await Promise.all(n.map(async u=>{if(u!==s)try{await u._remove(o)}catch{}})),new pr(s,e,i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nh(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Jf(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(jf(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Zf(e))return"Blackberry";if(ep(e))return"Webos";if(Kf(e))return"Safari";if((e.includes("chrome/")||Qf(e))&&!e.includes("edge/"))return"Chrome";if(Xf(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,i=t.match(n);if((i==null?void 0:i.length)===2)return i[1]}return"Other"}function jf(t=ct()){return/firefox\//i.test(t)}function Kf(t=ct()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Qf(t=ct()){return/crios\//i.test(t)}function Jf(t=ct()){return/iemobile/i.test(t)}function Xf(t=ct()){return/android/i.test(t)}function Zf(t=ct()){return/blackberry/i.test(t)}function ep(t=ct()){return/webos/i.test(t)}function Cc(t=ct()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function lb(t=ct()){var e;return Cc(t)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function cb(){return Ev()&&document.documentMode===10}function tp(t=ct()){return Cc(t)||Xf(t)||ep(t)||Zf(t)||/windows phone/i.test(t)||Jf(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function np(t,e=[]){let n;switch(t){case"Browser":n=nh(ct());break;case"Worker":n=`${nh(ct())}-${t}`;break;default:n=t}const i=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${Mr}/${i}`}/**
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
 */class ub{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const i=s=>new Promise((o,l)=>{try{const c=e(s);o(c)}catch(c){l(c)}});i.onAbort=n,this.queue.push(i);const r=this.queue.length-1;return()=>{this.queue[r]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const i of this.queue)await i(e),i.onAbort&&n.push(i.onAbort)}catch(i){n.reverse();for(const r of n)try{r()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:i==null?void 0:i.message})}}}/**
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
 */async function db(t,e={}){return yn(t,"GET","/v2/passwordPolicy",Kn(t,e))}/**
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
 */const hb=6;class fb{constructor(e){var n,i,r,s;const o=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(n=o.minPasswordLength)!==null&&n!==void 0?n:hb,o.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=o.maxPasswordLength),o.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=o.containsLowercaseCharacter),o.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=o.containsUppercaseCharacter),o.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=o.containsNumericCharacter),o.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=o.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(r=(i=e.allowedNonAlphanumericCharacters)===null||i===void 0?void 0:i.join(""))!==null&&r!==void 0?r:"",this.forceUpgradeOnSignin=(s=e.forceUpgradeOnSignin)!==null&&s!==void 0?s:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var n,i,r,s,o,l;const c={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,c),this.validatePasswordCharacterOptions(e,c),c.isValid&&(c.isValid=(n=c.meetsMinPasswordLength)!==null&&n!==void 0?n:!0),c.isValid&&(c.isValid=(i=c.meetsMaxPasswordLength)!==null&&i!==void 0?i:!0),c.isValid&&(c.isValid=(r=c.containsLowercaseLetter)!==null&&r!==void 0?r:!0),c.isValid&&(c.isValid=(s=c.containsUppercaseLetter)!==null&&s!==void 0?s:!0),c.isValid&&(c.isValid=(o=c.containsNumericCharacter)!==null&&o!==void 0?o:!0),c.isValid&&(c.isValid=(l=c.containsNonAlphanumericCharacter)!==null&&l!==void 0?l:!0),c}validatePasswordLengthOptions(e,n){const i=this.customStrengthOptions.minPasswordLength,r=this.customStrengthOptions.maxPasswordLength;i&&(n.meetsMinPasswordLength=e.length>=i),r&&(n.meetsMaxPasswordLength=e.length<=r)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let i;for(let r=0;r<e.length;r++)i=e.charAt(r),this.updatePasswordCharacterOptionsStatuses(n,i>="a"&&i<="z",i>="A"&&i<="Z",i>="0"&&i<="9",this.allowedNonAlphanumericCharacters.includes(i))}updatePasswordCharacterOptionsStatuses(e,n,i,r,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=i)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=r)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pb{constructor(e,n,i,r){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=i,this.config=r,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new ih(this),this.idTokenSubscription=new ih(this),this.beforeStateQueue=new ub(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=$f,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=r.sdkClientVersion}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=Bn(n)),this._initializationPromise=this.queue(async()=>{var i,r;if(!this._deleted&&(this.persistenceManager=await pr.create(this,e),!this._deleted)){if(!((i=this._popupRedirectResolver)===null||i===void 0)&&i._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((r=this.currentUser)===null||r===void 0?void 0:r.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await Wf(this,{idToken:e}),i=await Dn._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(i)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var n;if(Qt(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(l=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(l,l))}):this.directlySetCurrentUser(null)}const i=await this.assertedPersistence.getCurrentUser();let r=i,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(n=this.redirectUser)===null||n===void 0?void 0:n._redirectEventId,l=r==null?void 0:r._redirectEventId,c=await this.tryRedirectSignIn(e);(!o||o===l)&&(c!=null&&c.user)&&(r=c.user,s=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(r)}catch(o){r=i,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return G(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await Jo(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=Y0()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Qt(this.app))return Promise.reject(Fn(this));const n=e?Me(e):null;return n&&G(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&G(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Qt(this.app)?Promise.reject(Fn(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Qt(this.app)?Promise.reject(Fn(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Bn(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await db(this),n=new fb(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new Us("auth","Firebase",e())}onAuthStateChanged(e,n,i){return this.registerStateListener(this.authStateSubscription,e,n,i)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,i){return this.registerStateListener(this.idTokenSubscription,e,n,i)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const i=this.onAuthStateChanged(()=>{i(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),i={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(i.tenantId=this.tenantId),await ab(this,i)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,n){const i=await this.getOrInitRedirectPersistenceManager(n);return e===null?i.removeCurrentUser():i.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&Bn(e)||this._popupRedirectResolver;G(n,this,"argument-error"),this.redirectPersistenceManager=await pr.create(this,[Bn(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,i;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)===null||n===void 0?void 0:n._redirectEventId)===e?this._currentUser:((i=this.redirectUser)===null||i===void 0?void 0:i._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const i=(n=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&n!==void 0?n:null;this.lastNotifiedUid!==i&&(this.lastNotifiedUid=i,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,i,r){if(this._deleted)return()=>{};const s=typeof n=="function"?n:n.next.bind(n);let o=!1;const l=this._isInitialized?Promise.resolve():this._initializationPromise;if(G(l,this,"internal-error"),l.then(()=>{o||s(this.currentUser)}),typeof n=="function"){const c=e.addObserver(n,i,r);return()=>{o=!0,c()}}else{const c=e.addObserver(n);return()=>{o=!0,c()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return G(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=np(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const n={"X-Client-Version":this.clientVersion};this.app.options.appId&&(n["X-Firebase-gmpid"]=this.app.options.appId);const i=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());i&&(n["X-Firebase-Client"]=i);const r=await this._getAppCheckToken();return r&&(n["X-Firebase-AppCheck"]=r),n}async _getAppCheckToken(){var e;const n=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return n!=null&&n.error&&q0(`Error while retrieving App Check token: ${n.error}`),n==null?void 0:n.token}}function Qn(t){return Me(t)}class ih{constructor(e){this.auth=e,this.observer=null,this.addObserver=Rv(n=>this.observer=n)}get next(){return G(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let wa={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function mb(t){wa=t}function ip(t){return wa.loadJS(t)}function gb(){return wa.recaptchaEnterpriseScript}function yb(){return wa.gapiScript}function vb(t){return`__${t}${Math.floor(Math.random()*1e6)}`}const bb="recaptcha-enterprise",wb="NO_RECAPTCHA";class _b{constructor(e){this.type=bb,this.auth=Qn(e)}async verify(e="verify",n=!1){async function i(s){if(!n){if(s.tenantId==null&&s._agentRecaptchaConfig!=null)return s._agentRecaptchaConfig.siteKey;if(s.tenantId!=null&&s._tenantRecaptchaConfigs[s.tenantId]!==void 0)return s._tenantRecaptchaConfigs[s.tenantId].siteKey}return new Promise(async(o,l)=>{Z0(s,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(c=>{if(c.recaptchaKey===void 0)l(new Error("recaptcha Enterprise site key undefined"));else{const u=new X0(c);return s.tenantId==null?s._agentRecaptchaConfig=u:s._tenantRecaptchaConfigs[s.tenantId]=u,o(u.siteKey)}}).catch(c=>{l(c)})})}function r(s,o,l){const c=window.grecaptcha;Xd(c)?c.enterprise.ready(()=>{c.enterprise.execute(s,{action:e}).then(u=>{o(u)}).catch(()=>{o(wb)})}):l(Error("No reCAPTCHA enterprise script loaded."))}return new Promise((s,o)=>{i(this.auth).then(l=>{if(!n&&Xd(window.grecaptcha))r(l,s,o);else{if(typeof window>"u"){o(new Error("RecaptchaVerifier is only supported in browser"));return}let c=gb();c.length!==0&&(c+=l),ip(c).then(()=>{r(l,s,o)}).catch(u=>{o(u)})}}).catch(l=>{o(l)})})}}async function rh(t,e,n,i=!1){const r=new _b(t);let s;try{s=await r.verify(n)}catch{s=await r.verify(n,!0)}const o=Object.assign({},e);return i?Object.assign(o,{captchaResp:s}):Object.assign(o,{captchaResponse:s}),Object.assign(o,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(o,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),o}async function Xo(t,e,n,i){var r;if(!((r=t._getRecaptchaConfig())===null||r===void 0)&&r.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const s=await rh(t,e,n,n==="getOobCode");return i(t,s)}else return i(t,e).catch(async s=>{if(s.code==="auth/missing-recaptcha-token"){console.log(`${n} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const o=await rh(t,e,n,n==="getOobCode");return i(t,o)}else return Promise.reject(s)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Eb(t,e){const n=Tc(t,"auth");if(n.isInitialized()){const r=n.getImmediate(),s=n.getOptions();if(jo(s,e??{}))return r;qt(r,"already-initialized")}return n.initialize({options:e})}function Tb(t,e){const n=(e==null?void 0:e.persistence)||[],i=(Array.isArray(n)?n:[n]).map(Bn);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(i,e==null?void 0:e.popupRedirectResolver)}function Ib(t,e,n){const i=Qn(t);G(i._canInitEmulator,i,"emulator-config-failed"),G(/^https?:\/\//.test(e),i,"invalid-emulator-scheme");const r=!1,s=rp(e),{host:o,port:l}=Sb(e),c=l===null?"":`:${l}`;i.config.emulator={url:`${s}//${o}${c}/`},i.settings.appVerificationDisabledForTesting=!0,i.emulatorConfig=Object.freeze({host:o,port:l,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:r})}),xb()}function rp(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function Sb(t){const e=rp(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const i=n[2].split("@").pop()||"",r=/^(\[[^\]]+\])(:|$)/.exec(i);if(r){const s=r[1];return{host:s,port:sh(i.substr(s.length+1))}}else{const[s,o]=i.split(":");return{host:s,port:sh(o)}}}function sh(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function xb(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rc{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return Mn("not implemented")}_getIdTokenResponse(e){return Mn("not implemented")}_linkToIdToken(e,n){return Mn("not implemented")}_getReauthenticationResolver(e){return Mn("not implemented")}}async function Ab(t,e){return yn(t,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function kb(t,e){return Ws(t,"POST","/v1/accounts:signInWithPassword",Kn(t,e))}async function sp(t,e){return yn(t,"POST","/v1/accounts:sendOobCode",Kn(t,e))}async function Cb(t,e){return sp(t,e)}async function Rb(t,e){return sp(t,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Pb(t,e){return Ws(t,"POST","/v1/accounts:signInWithEmailLink",Kn(t,e))}async function Mb(t,e){return Ws(t,"POST","/v1/accounts:signInWithEmailLink",Kn(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ts extends Rc{constructor(e,n,i,r=null){super("password",i),this._email=e,this._password=n,this._tenantId=r}static _fromEmailAndPassword(e,n){return new Ts(e,n,"password")}static _fromEmailAndCode(e,n,i=null){return new Ts(e,n,"emailLink",i)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e;if(n!=null&&n.email&&(n!=null&&n.password)){if(n.signInMethod==="password")return this._fromEmailAndPassword(n.email,n.password);if(n.signInMethod==="emailLink")return this._fromEmailAndCode(n.email,n.password,n.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const n={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Xo(e,n,"signInWithPassword",kb);case"emailLink":return Pb(e,{email:this._email,oobCode:this._password});default:qt(e,"internal-error")}}async _linkToIdToken(e,n){switch(this.signInMethod){case"password":const i={idToken:n,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Xo(e,i,"signUpPassword",Ab);case"emailLink":return Mb(e,{idToken:n,email:this._email,oobCode:this._password});default:qt(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function mr(t,e){return Ws(t,"POST","/v1/accounts:signInWithIdp",Kn(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Db="http://localhost";class Yi extends Rc{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new Yi(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):qt("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:i,signInMethod:r}=n,s=Ic(n,["providerId","signInMethod"]);if(!i||!r)return null;const o=new Yi(i,r);return o.idToken=s.idToken||void 0,o.accessToken=s.accessToken||void 0,o.secret=s.secret,o.nonce=s.nonce,o.pendingToken=s.pendingToken||null,o}_getIdTokenResponse(e){const n=this.buildRequest();return mr(e,n)}_linkToIdToken(e,n){const i=this.buildRequest();return i.idToken=n,mr(e,i)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,mr(e,n)}buildRequest(){const e={requestUri:Db,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=qs(n)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bb(t){switch(t){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function Lb(t){const e=ss(os(t)).link,n=e?ss(os(e)).deep_link_id:null,i=ss(os(t)).deep_link_id;return(i?ss(os(i)).link:null)||i||n||e||t}class Pc{constructor(e){var n,i,r,s,o,l;const c=ss(os(e)),u=(n=c.apiKey)!==null&&n!==void 0?n:null,f=(i=c.oobCode)!==null&&i!==void 0?i:null,m=Bb((r=c.mode)!==null&&r!==void 0?r:null);G(u&&f&&m,"argument-error"),this.apiKey=u,this.operation=m,this.code=f,this.continueUrl=(s=c.continueUrl)!==null&&s!==void 0?s:null,this.languageCode=(o=c.languageCode)!==null&&o!==void 0?o:null,this.tenantId=(l=c.tenantId)!==null&&l!==void 0?l:null}static parseLink(e){const n=Lb(e);try{return new Pc(n)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dr{constructor(){this.providerId=Dr.PROVIDER_ID}static credential(e,n){return Ts._fromEmailAndPassword(e,n)}static credentialWithLink(e,n){const i=Pc.parseLink(n);return G(i,"argument-error"),Ts._fromEmailAndCode(e,i.code,i.tenantId)}}Dr.PROVIDER_ID="password";Dr.EMAIL_PASSWORD_SIGN_IN_METHOD="password";Dr.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mc{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gs extends Mc{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class li extends Gs{constructor(){super("facebook.com")}static credential(e){return Yi._fromParams({providerId:li.PROVIDER_ID,signInMethod:li.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return li.credentialFromTaggedObject(e)}static credentialFromError(e){return li.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return li.credential(e.oauthAccessToken)}catch{return null}}}li.FACEBOOK_SIGN_IN_METHOD="facebook.com";li.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pn extends Gs{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return Yi._fromParams({providerId:Pn.PROVIDER_ID,signInMethod:Pn.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return Pn.credentialFromTaggedObject(e)}static credentialFromError(e){return Pn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:i}=e;if(!n&&!i)return null;try{return Pn.credential(n,i)}catch{return null}}}Pn.GOOGLE_SIGN_IN_METHOD="google.com";Pn.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ci extends Gs{constructor(){super("github.com")}static credential(e){return Yi._fromParams({providerId:ci.PROVIDER_ID,signInMethod:ci.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return ci.credentialFromTaggedObject(e)}static credentialFromError(e){return ci.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return ci.credential(e.oauthAccessToken)}catch{return null}}}ci.GITHUB_SIGN_IN_METHOD="github.com";ci.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ui extends Gs{constructor(){super("twitter.com")}static credential(e,n){return Yi._fromParams({providerId:ui.PROVIDER_ID,signInMethod:ui.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return ui.credentialFromTaggedObject(e)}static credentialFromError(e){return ui.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:i}=e;if(!n||!i)return null;try{return ui.credential(n,i)}catch{return null}}}ui.TWITTER_SIGN_IN_METHOD="twitter.com";ui.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Nb(t,e){return Ws(t,"POST","/v1/accounts:signUp",Kn(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ji{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,i,r=!1){const s=await Dn._fromIdTokenResponse(e,i,r),o=oh(i);return new ji({user:s,providerId:o,_tokenResponse:i,operationType:n})}static async _forOperation(e,n,i){await e._updateTokensIfNecessary(i,!0);const r=oh(i);return new ji({user:e,providerId:r,_tokenResponse:i,operationType:n})}}function oh(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zo extends jn{constructor(e,n,i,r){var s;super(n.code,n.message),this.operationType=i,this.user=r,Object.setPrototypeOf(this,Zo.prototype),this.customData={appName:e.name,tenantId:(s=e.tenantId)!==null&&s!==void 0?s:void 0,_serverResponse:n.customData._serverResponse,operationType:i}}static _fromErrorAndOperation(e,n,i,r){return new Zo(e,n,i,r)}}function op(t,e,n,i){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?Zo._fromErrorAndOperation(t,s,e,i):s})}async function Ob(t,e,n=!1){const i=await _r(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return ji._forOperation(t,"link",i)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Fb(t,e,n=!1){const{auth:i}=t;if(Qt(i.app))return Promise.reject(Fn(i));const r="reauthenticate";try{const s=await _r(t,op(i,r,e,t),n);G(s.idToken,i,"internal-error");const o=kc(s.idToken);G(o,i,"internal-error");const{sub:l}=o;return G(t.uid===l,i,"user-mismatch"),ji._forOperation(t,r,s)}catch(s){throw(s==null?void 0:s.code)==="auth/user-not-found"&&qt(i,"user-mismatch"),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ap(t,e,n=!1){if(Qt(t.app))return Promise.reject(Fn(t));const i="signIn",r=await op(t,i,e),s=await ji._fromIdTokenResponse(t,i,r);return n||await t._updateCurrentUser(s.user),s}async function Vb(t,e){return ap(Qn(t),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function lp(t){const e=Qn(t);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function zb(t,e,n){const i=Qn(t);await Xo(i,{requestType:"PASSWORD_RESET",email:e,clientType:"CLIENT_TYPE_WEB"},"getOobCode",Rb)}async function $b(t,e,n){if(Qt(t.app))return Promise.reject(Fn(t));const i=Qn(t),o=await Xo(i,{returnSecureToken:!0,email:e,password:n,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",Nb).catch(c=>{throw c.code==="auth/password-does-not-meet-requirements"&&lp(t),c}),l=await ji._fromIdTokenResponse(i,"signIn",o);return await i._updateCurrentUser(l.user),l}function Ub(t,e,n){return Qt(t.app)?Promise.reject(Fn(t)):Vb(Me(t),Dr.credential(e,n)).catch(async i=>{throw i.code==="auth/password-does-not-meet-requirements"&&lp(t),i})}async function cp(t,e){const n=Me(t),r={requestType:"VERIFY_EMAIL",idToken:await t.getIdToken()},{email:s}=await Cb(n.auth,r);s!==t.email&&await t.reload()}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function qb(t,e){return yn(t,"POST","/v1/accounts:update",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Hb(t,{displayName:e,photoURL:n}){if(e===void 0&&n===void 0)return;const i=Me(t),s={idToken:await i.getIdToken(),displayName:e,photoUrl:n,returnSecureToken:!0},o=await _r(i,qb(i.auth,s));i.displayName=o.displayName||null,i.photoURL=o.photoUrl||null;const l=i.providerData.find(({providerId:c})=>c==="password");l&&(l.displayName=i.displayName,l.photoURL=i.photoURL),await i._updateTokensIfNecessary(o)}function Wb(t,e,n,i){return Me(t).onIdTokenChanged(e,n,i)}function Gb(t,e,n){return Me(t).beforeAuthStateChanged(e,n)}function Yb(t,e,n,i){return Me(t).onAuthStateChanged(e,n,i)}function jb(t){return Me(t).signOut()}async function Kb(t){return Me(t).delete()}const ea="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class up{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(ea,"1"),this.storage.removeItem(ea),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qb=1e3,Jb=10;class dp extends up{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=tp(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const i=this.storage.getItem(n),r=this.localCache[n];i!==r&&e(n,r,i)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((o,l,c)=>{this.notifyListeners(o,c)});return}const i=e.key;n?this.detachListener():this.stopPolling();const r=()=>{const o=this.storage.getItem(i);!n&&this.localCache[i]===o||this.notifyListeners(i,o)},s=this.storage.getItem(i);cb()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(r,Jb):r()}notifyListeners(e,n){this.localCache[e]=n;const i=this.listeners[e];if(i)for(const r of Array.from(i))r(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,i)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:i}),!0)})},Qb)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}dp.type="LOCAL";const Xb=dp;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hp extends up{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}hp.type="SESSION";const fp=hp;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zb(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _a{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(r=>r.isListeningto(e));if(n)return n;const i=new _a(e);return this.receivers.push(i),i}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:i,eventType:r,data:s}=n.data,o=this.handlersMap[r];if(!(o!=null&&o.size))return;n.ports[0].postMessage({status:"ack",eventId:i,eventType:r});const l=Array.from(o).map(async u=>u(n.origin,s)),c=await Zb(l);n.ports[0].postMessage({status:"done",eventId:i,eventType:r,response:c})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}_a.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Dc(t="",e=10){let n="";for(let i=0;i<e;i++)n+=Math.floor(Math.random()*10);return t+n}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ew{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,i=50){const r=typeof MessageChannel<"u"?new MessageChannel:null;if(!r)throw new Error("connection_unavailable");let s,o;return new Promise((l,c)=>{const u=Dc("",20);r.port1.start();const f=setTimeout(()=>{c(new Error("unsupported_event"))},i);o={messageChannel:r,onMessage(m){const p=m;if(p.data.eventId===u)switch(p.data.status){case"ack":clearTimeout(f),s=setTimeout(()=>{c(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),l(p.data.response);break;default:clearTimeout(f),clearTimeout(s),c(new Error("invalid_response"));break}}},this.handlers.add(o),r.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:u,data:n},[r.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hn(){return window}function tw(t){hn().location.href=t}/**
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
 */function pp(){return typeof hn().WorkerGlobalScope<"u"&&typeof hn().importScripts=="function"}async function nw(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function iw(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)===null||t===void 0?void 0:t.controller)||null}function rw(){return pp()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mp="firebaseLocalStorageDb",sw=1,ta="firebaseLocalStorage",gp="fbase_key";class Ys{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function Ea(t,e){return t.transaction([ta],e?"readwrite":"readonly").objectStore(ta)}function ow(){const t=indexedDB.deleteDatabase(mp);return new Ys(t).toPromise()}function Ll(){const t=indexedDB.open(mp,sw);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const i=t.result;try{i.createObjectStore(ta,{keyPath:gp})}catch(r){n(r)}}),t.addEventListener("success",async()=>{const i=t.result;i.objectStoreNames.contains(ta)?e(i):(i.close(),await ow(),e(await Ll()))})})}async function ah(t,e,n){const i=Ea(t,!0).put({[gp]:e,value:n});return new Ys(i).toPromise()}async function aw(t,e){const n=Ea(t,!1).get(e),i=await new Ys(n).toPromise();return i===void 0?null:i.value}function lh(t,e){const n=Ea(t,!0).delete(e);return new Ys(n).toPromise()}const lw=800,cw=3;class yp{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await Ll(),this.db)}async _withRetries(e){let n=0;for(;;)try{const i=await this._openDb();return await e(i)}catch(i){if(n++>cw)throw i;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return pp()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=_a._getInstance(rw()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var e,n;if(this.activeServiceWorker=await nw(),!this.activeServiceWorker)return;this.sender=new ew(this.activeServiceWorker);const i=await this.sender._send("ping",{},800);i&&!((e=i[0])===null||e===void 0)&&e.fulfilled&&!((n=i[0])===null||n===void 0)&&n.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||iw()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await Ll();return await ah(e,ea,"1"),await lh(e,ea),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(i=>ah(i,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(i=>aw(i,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>lh(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(r=>{const s=Ea(r,!1).getAll();return new Ys(s).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],i=new Set;if(e.length!==0)for(const{fbase_key:r,value:s}of e)i.add(r),JSON.stringify(this.localCache[r])!==JSON.stringify(s)&&(this.notifyListeners(r,s),n.push(r));for(const r of Object.keys(this.localCache))this.localCache[r]&&!i.has(r)&&(this.notifyListeners(r,null),n.push(r));return n}notifyListeners(e,n){this.localCache[e]=n;const i=this.listeners[e];if(i)for(const r of Array.from(i))r(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),lw)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}yp.type="LOCAL";const uw=yp;new Hs(3e4,6e4);/**
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
 */function vp(t,e){return e?Bn(e):(G(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bc extends Rc{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return mr(e,this._buildIdpRequest())}_linkToIdToken(e,n){return mr(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return mr(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function dw(t){return ap(t.auth,new Bc(t),t.bypassAuthState)}function hw(t){const{auth:e,user:n}=t;return G(n,e,"internal-error"),Fb(n,new Bc(t),t.bypassAuthState)}async function fw(t){const{auth:e,user:n}=t;return G(n,e,"internal-error"),Ob(n,new Bc(t),t.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bp{constructor(e,n,i,r,s=!1){this.auth=e,this.resolver=i,this.user=r,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(i){this.reject(i)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:i,postBody:r,tenantId:s,error:o,type:l}=e;if(o){this.reject(o);return}const c={auth:this.auth,requestUri:n,sessionId:i,tenantId:s||void 0,postBody:r||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(l)(c))}catch(u){this.reject(u)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return dw;case"linkViaPopup":case"linkViaRedirect":return fw;case"reauthViaPopup":case"reauthViaRedirect":return hw;default:qt(this.auth,"internal-error")}}resolve(e){qn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){qn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pw=new Hs(2e3,1e4);async function mw(t,e,n){if(Qt(t.app))return Promise.reject(Xt(t,"operation-not-supported-in-this-environment"));const i=Qn(t);H0(t,e,Mc);const r=vp(i,n);return new Oi(i,"signInViaPopup",e,r).executeNotNull()}class Oi extends bp{constructor(e,n,i,r,s){super(e,n,r,s),this.provider=i,this.authWindow=null,this.pollId=null,Oi.currentPopupAction&&Oi.currentPopupAction.cancel(),Oi.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return G(e,this.auth,"internal-error"),e}async onExecution(){qn(this.filter.length===1,"Popup operations only handle one event");const e=Dc();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(Xt(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(Xt(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Oi.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,i;if(!((i=(n=this.authWindow)===null||n===void 0?void 0:n.window)===null||i===void 0)&&i.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Xt(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,pw.get())};e()}}Oi.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gw="pendingRedirect",Bo=new Map;class yw extends bp{constructor(e,n,i=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,i),this.eventId=null}async execute(){let e=Bo.get(this.auth._key());if(!e){try{const i=await vw(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(i)}catch(n){e=()=>Promise.reject(n)}Bo.set(this.auth._key(),e)}return this.bypassAuthState||Bo.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function vw(t,e){const n=_w(e),i=ww(t);if(!await i._isAvailable())return!1;const r=await i._get(n)==="true";return await i._remove(n),r}function bw(t,e){Bo.set(t._key(),e)}function ww(t){return Bn(t._redirectPersistence)}function _w(t){return Do(gw,t.config.apiKey,t.name)}async function Ew(t,e,n=!1){if(Qt(t.app))return Promise.reject(Fn(t));const i=Qn(t),r=vp(i,e),o=await new yw(i,r,n).execute();return o&&!n&&(delete o.user._redirectEventId,await i._persistUserIfCurrent(o.user),await i._setRedirectUser(null,e)),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tw=10*60*1e3;class Iw{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(i=>{this.isEventForConsumer(e,i)&&(n=!0,this.sendToConsumer(e,i),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Sw(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var i;if(e.error&&!wp(e)){const r=((i=e.error.code)===null||i===void 0?void 0:i.split("auth/")[1])||"internal-error";n.onError(Xt(this.auth,r))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const i=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&i}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Tw&&this.cachedEventUids.clear(),this.cachedEventUids.has(ch(e))}saveEventToCache(e){this.cachedEventUids.add(ch(e)),this.lastProcessedEventTime=Date.now()}}function ch(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function wp({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Sw(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return wp(t);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function xw(t,e={}){return yn(t,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Aw=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,kw=/^https?/;async function Cw(t){if(t.config.emulator)return;const{authorizedDomains:e}=await xw(t);for(const n of e)try{if(Rw(n))return}catch{}qt(t,"unauthorized-domain")}function Rw(t){const e=Dl(),{protocol:n,hostname:i}=new URL(e);if(t.startsWith("chrome-extension://")){const o=new URL(t);return o.hostname===""&&i===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&o.hostname===i}if(!kw.test(n))return!1;if(Aw.test(t))return i===t;const r=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+r+"|"+r+")$","i").test(i)}/**
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
 */const Pw=new Hs(3e4,6e4);function uh(){const t=hn().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function Mw(t){return new Promise((e,n)=>{var i,r,s;function o(){uh(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{uh(),n(Xt(t,"network-request-failed"))},timeout:Pw.get()})}if(!((r=(i=hn().gapi)===null||i===void 0?void 0:i.iframes)===null||r===void 0)&&r.Iframe)e(gapi.iframes.getContext());else if(!((s=hn().gapi)===null||s===void 0)&&s.load)o();else{const l=vb("iframefcb");return hn()[l]=()=>{gapi.load?o():n(Xt(t,"network-request-failed"))},ip(`${yb()}?onload=${l}`).catch(c=>n(c))}}).catch(e=>{throw Lo=null,e})}let Lo=null;function Dw(t){return Lo=Lo||Mw(t),Lo}/**
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
 */const Bw=new Hs(5e3,15e3),Lw="__/auth/iframe",Nw="emulator/auth/iframe",Ow={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Fw=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Vw(t){const e=t.config;G(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?Ac(e,Nw):`https://${t.config.authDomain}/${Lw}`,i={apiKey:e.apiKey,appName:t.name,v:Mr},r=Fw.get(t.config.apiHost);r&&(i.eid=r);const s=t._getFrameworks();return s.length&&(i.fw=s.join(",")),`${n}?${qs(i).slice(1)}`}async function zw(t){const e=await Dw(t),n=hn().gapi;return G(n,t,"internal-error"),e.open({where:document.body,url:Vw(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Ow,dontclear:!0},i=>new Promise(async(r,s)=>{await i.restyle({setHideOnLeave:!1});const o=Xt(t,"network-request-failed"),l=hn().setTimeout(()=>{s(o)},Bw.get());function c(){hn().clearTimeout(l),r(i)}i.ping(c).then(c,()=>{s(o)})}))}/**
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
 */const $w={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Uw=500,qw=600,Hw="_blank",Ww="http://localhost";class dh{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Gw(t,e,n,i=Uw,r=qw){const s=Math.max((window.screen.availHeight-r)/2,0).toString(),o=Math.max((window.screen.availWidth-i)/2,0).toString();let l="";const c=Object.assign(Object.assign({},$w),{width:i.toString(),height:r.toString(),top:s,left:o}),u=ct().toLowerCase();n&&(l=Qf(u)?Hw:n),jf(u)&&(e=e||Ww,c.scrollbars="yes");const f=Object.entries(c).reduce((p,[w,I])=>`${p}${w}=${I},`,"");if(lb(u)&&l!=="_self")return Yw(e||"",l),new dh(null);const m=window.open(e||"",l,f);G(m,t,"popup-blocked");try{m.focus()}catch{}return new dh(m)}function Yw(t,e){const n=document.createElement("a");n.href=t,n.target=e;const i=document.createEvent("MouseEvent");i.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(i)}/**
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
 */const jw="__/auth/handler",Kw="emulator/auth/handler",Qw=encodeURIComponent("fac");async function hh(t,e,n,i,r,s){G(t.config.authDomain,t,"auth-domain-config-required"),G(t.config.apiKey,t,"invalid-api-key");const o={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:i,v:Mr,eventId:r};if(e instanceof Mc){e.setDefaultLanguage(t.languageCode),o.providerId=e.providerId||"",Cv(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[f,m]of Object.entries({}))o[f]=m}if(e instanceof Gs){const f=e.getScopes().filter(m=>m!=="");f.length>0&&(o.scopes=f.join(","))}t.tenantId&&(o.tid=t.tenantId);const l=o;for(const f of Object.keys(l))l[f]===void 0&&delete l[f];const c=await t._getAppCheckToken(),u=c?`#${Qw}=${encodeURIComponent(c)}`:"";return`${Jw(t)}?${qs(l).slice(1)}${u}`}function Jw({config:t}){return t.emulator?Ac(t,Kw):`https://${t.authDomain}/${jw}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vl="webStorageSupport";class Xw{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=fp,this._completeRedirectFn=Ew,this._overrideRedirectResult=bw}async _openPopup(e,n,i,r){var s;qn((s=this.eventManagers[e._key()])===null||s===void 0?void 0:s.manager,"_initialize() not called before _openPopup()");const o=await hh(e,n,i,Dl(),r);return Gw(e,o,Dc())}async _openRedirect(e,n,i,r){await this._originValidation(e);const s=await hh(e,n,i,Dl(),r);return tw(s),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:r,promise:s}=this.eventManagers[n];return r?Promise.resolve(r):(qn(s,"If manager is not set, promise should be"),s)}const i=this.initAndGetManager(e);return this.eventManagers[n]={promise:i},i.catch(()=>{delete this.eventManagers[n]}),i}async initAndGetManager(e){const n=await zw(e),i=new Iw(e);return n.register("authEvent",r=>(G(r==null?void 0:r.authEvent,e,"invalid-auth-event"),{status:i.onEvent(r.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:i},this.iframes[e._key()]=n,i}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(vl,{type:vl},r=>{var s;const o=(s=r==null?void 0:r[0])===null||s===void 0?void 0:s[vl];o!==void 0&&n(!!o),qt(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=Cw(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return tp()||Kf()||Cc()}}const Zw=Xw;var fh="@firebase/auth",ph="1.7.9";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class e_{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(i=>{e((i==null?void 0:i.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){G(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function t_(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function n_(t){wr(new Gi("auth",(e,{options:n})=>{const i=e.getProvider("app").getImmediate(),r=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:o,authDomain:l}=i.options;G(o&&!o.includes(":"),"invalid-api-key",{appName:i.name});const c={apiKey:o,authDomain:l,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:np(t)},u=new pb(i,r,s,c);return Tb(u,n),u},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,i)=>{e.getProvider("auth-internal").initialize()})),wr(new Gi("auth-internal",e=>{const n=Qn(e.getProvider("auth").getImmediate());return(i=>new e_(i))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),gi(fh,ph,t_(t)),gi(fh,ph,"esm2017")}/**
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
 */const i_=5*60,r_=Df("authIdTokenMaxAge")||i_;let mh=null;const s_=t=>async e=>{const n=e&&await e.getIdTokenResult(),i=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(i&&i>r_)return;const r=n==null?void 0:n.token;mh!==r&&(mh=r,await fetch(t,{method:r?"POST":"DELETE",headers:r?{Authorization:`Bearer ${r}`}:{}}))};function o_(t=Of()){const e=Tc(t,"auth");if(e.isInitialized())return e.getImmediate();const n=Eb(t,{popupRedirectResolver:Zw,persistence:[uw,Xb,fp]}),i=Df("authTokenSyncURL");if(i&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(i,location.origin);if(location.origin===s.origin){const o=s_(s.toString());Gb(n,o,()=>o(n.currentUser)),Wb(n,l=>o(l))}}const r=Pf("auth");return r&&Ib(n,`http://${r}`),n}function a_(){var t,e;return(e=(t=document.getElementsByTagName("head"))===null||t===void 0?void 0:t[0])!==null&&e!==void 0?e:document}mb({loadJS(t){return new Promise((e,n)=>{const i=document.createElement("script");i.setAttribute("src",t),i.onload=e,i.onerror=r=>{const s=Xt("internal-error");s.customData=r,n(s)},i.type="text/javascript",i.charset="UTF-8",a_().appendChild(i)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});n_("Browser");var gh=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Ui,_p;(function(){var t;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(T,y){function _(){}_.prototype=y.prototype,T.D=y.prototype,T.prototype=new _,T.prototype.constructor=T,T.C=function(b,E,x){for(var v=Array(arguments.length-2),le=2;le<arguments.length;le++)v[le-2]=arguments[le];return y.prototype[E].apply(b,v)}}function n(){this.blockSize=-1}function i(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(i,n),i.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function r(T,y,_){_||(_=0);var b=Array(16);if(typeof y=="string")for(var E=0;16>E;++E)b[E]=y.charCodeAt(_++)|y.charCodeAt(_++)<<8|y.charCodeAt(_++)<<16|y.charCodeAt(_++)<<24;else for(E=0;16>E;++E)b[E]=y[_++]|y[_++]<<8|y[_++]<<16|y[_++]<<24;y=T.g[0],_=T.g[1],E=T.g[2];var x=T.g[3],v=y+(x^_&(E^x))+b[0]+3614090360&4294967295;y=_+(v<<7&4294967295|v>>>25),v=x+(E^y&(_^E))+b[1]+3905402710&4294967295,x=y+(v<<12&4294967295|v>>>20),v=E+(_^x&(y^_))+b[2]+606105819&4294967295,E=x+(v<<17&4294967295|v>>>15),v=_+(y^E&(x^y))+b[3]+3250441966&4294967295,_=E+(v<<22&4294967295|v>>>10),v=y+(x^_&(E^x))+b[4]+4118548399&4294967295,y=_+(v<<7&4294967295|v>>>25),v=x+(E^y&(_^E))+b[5]+1200080426&4294967295,x=y+(v<<12&4294967295|v>>>20),v=E+(_^x&(y^_))+b[6]+2821735955&4294967295,E=x+(v<<17&4294967295|v>>>15),v=_+(y^E&(x^y))+b[7]+4249261313&4294967295,_=E+(v<<22&4294967295|v>>>10),v=y+(x^_&(E^x))+b[8]+1770035416&4294967295,y=_+(v<<7&4294967295|v>>>25),v=x+(E^y&(_^E))+b[9]+2336552879&4294967295,x=y+(v<<12&4294967295|v>>>20),v=E+(_^x&(y^_))+b[10]+4294925233&4294967295,E=x+(v<<17&4294967295|v>>>15),v=_+(y^E&(x^y))+b[11]+2304563134&4294967295,_=E+(v<<22&4294967295|v>>>10),v=y+(x^_&(E^x))+b[12]+1804603682&4294967295,y=_+(v<<7&4294967295|v>>>25),v=x+(E^y&(_^E))+b[13]+4254626195&4294967295,x=y+(v<<12&4294967295|v>>>20),v=E+(_^x&(y^_))+b[14]+2792965006&4294967295,E=x+(v<<17&4294967295|v>>>15),v=_+(y^E&(x^y))+b[15]+1236535329&4294967295,_=E+(v<<22&4294967295|v>>>10),v=y+(E^x&(_^E))+b[1]+4129170786&4294967295,y=_+(v<<5&4294967295|v>>>27),v=x+(_^E&(y^_))+b[6]+3225465664&4294967295,x=y+(v<<9&4294967295|v>>>23),v=E+(y^_&(x^y))+b[11]+643717713&4294967295,E=x+(v<<14&4294967295|v>>>18),v=_+(x^y&(E^x))+b[0]+3921069994&4294967295,_=E+(v<<20&4294967295|v>>>12),v=y+(E^x&(_^E))+b[5]+3593408605&4294967295,y=_+(v<<5&4294967295|v>>>27),v=x+(_^E&(y^_))+b[10]+38016083&4294967295,x=y+(v<<9&4294967295|v>>>23),v=E+(y^_&(x^y))+b[15]+3634488961&4294967295,E=x+(v<<14&4294967295|v>>>18),v=_+(x^y&(E^x))+b[4]+3889429448&4294967295,_=E+(v<<20&4294967295|v>>>12),v=y+(E^x&(_^E))+b[9]+568446438&4294967295,y=_+(v<<5&4294967295|v>>>27),v=x+(_^E&(y^_))+b[14]+3275163606&4294967295,x=y+(v<<9&4294967295|v>>>23),v=E+(y^_&(x^y))+b[3]+4107603335&4294967295,E=x+(v<<14&4294967295|v>>>18),v=_+(x^y&(E^x))+b[8]+1163531501&4294967295,_=E+(v<<20&4294967295|v>>>12),v=y+(E^x&(_^E))+b[13]+2850285829&4294967295,y=_+(v<<5&4294967295|v>>>27),v=x+(_^E&(y^_))+b[2]+4243563512&4294967295,x=y+(v<<9&4294967295|v>>>23),v=E+(y^_&(x^y))+b[7]+1735328473&4294967295,E=x+(v<<14&4294967295|v>>>18),v=_+(x^y&(E^x))+b[12]+2368359562&4294967295,_=E+(v<<20&4294967295|v>>>12),v=y+(_^E^x)+b[5]+4294588738&4294967295,y=_+(v<<4&4294967295|v>>>28),v=x+(y^_^E)+b[8]+2272392833&4294967295,x=y+(v<<11&4294967295|v>>>21),v=E+(x^y^_)+b[11]+1839030562&4294967295,E=x+(v<<16&4294967295|v>>>16),v=_+(E^x^y)+b[14]+4259657740&4294967295,_=E+(v<<23&4294967295|v>>>9),v=y+(_^E^x)+b[1]+2763975236&4294967295,y=_+(v<<4&4294967295|v>>>28),v=x+(y^_^E)+b[4]+1272893353&4294967295,x=y+(v<<11&4294967295|v>>>21),v=E+(x^y^_)+b[7]+4139469664&4294967295,E=x+(v<<16&4294967295|v>>>16),v=_+(E^x^y)+b[10]+3200236656&4294967295,_=E+(v<<23&4294967295|v>>>9),v=y+(_^E^x)+b[13]+681279174&4294967295,y=_+(v<<4&4294967295|v>>>28),v=x+(y^_^E)+b[0]+3936430074&4294967295,x=y+(v<<11&4294967295|v>>>21),v=E+(x^y^_)+b[3]+3572445317&4294967295,E=x+(v<<16&4294967295|v>>>16),v=_+(E^x^y)+b[6]+76029189&4294967295,_=E+(v<<23&4294967295|v>>>9),v=y+(_^E^x)+b[9]+3654602809&4294967295,y=_+(v<<4&4294967295|v>>>28),v=x+(y^_^E)+b[12]+3873151461&4294967295,x=y+(v<<11&4294967295|v>>>21),v=E+(x^y^_)+b[15]+530742520&4294967295,E=x+(v<<16&4294967295|v>>>16),v=_+(E^x^y)+b[2]+3299628645&4294967295,_=E+(v<<23&4294967295|v>>>9),v=y+(E^(_|~x))+b[0]+4096336452&4294967295,y=_+(v<<6&4294967295|v>>>26),v=x+(_^(y|~E))+b[7]+1126891415&4294967295,x=y+(v<<10&4294967295|v>>>22),v=E+(y^(x|~_))+b[14]+2878612391&4294967295,E=x+(v<<15&4294967295|v>>>17),v=_+(x^(E|~y))+b[5]+4237533241&4294967295,_=E+(v<<21&4294967295|v>>>11),v=y+(E^(_|~x))+b[12]+1700485571&4294967295,y=_+(v<<6&4294967295|v>>>26),v=x+(_^(y|~E))+b[3]+2399980690&4294967295,x=y+(v<<10&4294967295|v>>>22),v=E+(y^(x|~_))+b[10]+4293915773&4294967295,E=x+(v<<15&4294967295|v>>>17),v=_+(x^(E|~y))+b[1]+2240044497&4294967295,_=E+(v<<21&4294967295|v>>>11),v=y+(E^(_|~x))+b[8]+1873313359&4294967295,y=_+(v<<6&4294967295|v>>>26),v=x+(_^(y|~E))+b[15]+4264355552&4294967295,x=y+(v<<10&4294967295|v>>>22),v=E+(y^(x|~_))+b[6]+2734768916&4294967295,E=x+(v<<15&4294967295|v>>>17),v=_+(x^(E|~y))+b[13]+1309151649&4294967295,_=E+(v<<21&4294967295|v>>>11),v=y+(E^(_|~x))+b[4]+4149444226&4294967295,y=_+(v<<6&4294967295|v>>>26),v=x+(_^(y|~E))+b[11]+3174756917&4294967295,x=y+(v<<10&4294967295|v>>>22),v=E+(y^(x|~_))+b[2]+718787259&4294967295,E=x+(v<<15&4294967295|v>>>17),v=_+(x^(E|~y))+b[9]+3951481745&4294967295,T.g[0]=T.g[0]+y&4294967295,T.g[1]=T.g[1]+(E+(v<<21&4294967295|v>>>11))&4294967295,T.g[2]=T.g[2]+E&4294967295,T.g[3]=T.g[3]+x&4294967295}i.prototype.u=function(T,y){y===void 0&&(y=T.length);for(var _=y-this.blockSize,b=this.B,E=this.h,x=0;x<y;){if(E==0)for(;x<=_;)r(this,T,x),x+=this.blockSize;if(typeof T=="string"){for(;x<y;)if(b[E++]=T.charCodeAt(x++),E==this.blockSize){r(this,b),E=0;break}}else for(;x<y;)if(b[E++]=T[x++],E==this.blockSize){r(this,b),E=0;break}}this.h=E,this.o+=y},i.prototype.v=function(){var T=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);T[0]=128;for(var y=1;y<T.length-8;++y)T[y]=0;var _=8*this.o;for(y=T.length-8;y<T.length;++y)T[y]=_&255,_/=256;for(this.u(T),T=Array(16),y=_=0;4>y;++y)for(var b=0;32>b;b+=8)T[_++]=this.g[y]>>>b&255;return T};function s(T,y){var _=l;return Object.prototype.hasOwnProperty.call(_,T)?_[T]:_[T]=y(T)}function o(T,y){this.h=y;for(var _=[],b=!0,E=T.length-1;0<=E;E--){var x=T[E]|0;b&&x==y||(_[E]=x,b=!1)}this.g=_}var l={};function c(T){return-128<=T&&128>T?s(T,function(y){return new o([y|0],0>y?-1:0)}):new o([T|0],0>T?-1:0)}function u(T){if(isNaN(T)||!isFinite(T))return m;if(0>T)return A(u(-T));for(var y=[],_=1,b=0;T>=_;b++)y[b]=T/_|0,_*=4294967296;return new o(y,0)}function f(T,y){if(T.length==0)throw Error("number format error: empty string");if(y=y||10,2>y||36<y)throw Error("radix out of range: "+y);if(T.charAt(0)=="-")return A(f(T.substring(1),y));if(0<=T.indexOf("-"))throw Error('number format error: interior "-" character');for(var _=u(Math.pow(y,8)),b=m,E=0;E<T.length;E+=8){var x=Math.min(8,T.length-E),v=parseInt(T.substring(E,E+x),y);8>x?(x=u(Math.pow(y,x)),b=b.j(x).add(u(v))):(b=b.j(_),b=b.add(u(v)))}return b}var m=c(0),p=c(1),w=c(16777216);t=o.prototype,t.m=function(){if(S(this))return-A(this).m();for(var T=0,y=1,_=0;_<this.g.length;_++){var b=this.i(_);T+=(0<=b?b:4294967296+b)*y,y*=4294967296}return T},t.toString=function(T){if(T=T||10,2>T||36<T)throw Error("radix out of range: "+T);if(I(this))return"0";if(S(this))return"-"+A(this).toString(T);for(var y=u(Math.pow(T,6)),_=this,b="";;){var E=N(_,y).g;_=C(_,E.j(y));var x=((0<_.g.length?_.g[0]:_.h)>>>0).toString(T);if(_=E,I(_))return x+b;for(;6>x.length;)x="0"+x;b=x+b}},t.i=function(T){return 0>T?0:T<this.g.length?this.g[T]:this.h};function I(T){if(T.h!=0)return!1;for(var y=0;y<T.g.length;y++)if(T.g[y]!=0)return!1;return!0}function S(T){return T.h==-1}t.l=function(T){return T=C(this,T),S(T)?-1:I(T)?0:1};function A(T){for(var y=T.g.length,_=[],b=0;b<y;b++)_[b]=~T.g[b];return new o(_,~T.h).add(p)}t.abs=function(){return S(this)?A(this):this},t.add=function(T){for(var y=Math.max(this.g.length,T.g.length),_=[],b=0,E=0;E<=y;E++){var x=b+(this.i(E)&65535)+(T.i(E)&65535),v=(x>>>16)+(this.i(E)>>>16)+(T.i(E)>>>16);b=v>>>16,x&=65535,v&=65535,_[E]=v<<16|x}return new o(_,_[_.length-1]&-2147483648?-1:0)};function C(T,y){return T.add(A(y))}t.j=function(T){if(I(this)||I(T))return m;if(S(this))return S(T)?A(this).j(A(T)):A(A(this).j(T));if(S(T))return A(this.j(A(T)));if(0>this.l(w)&&0>T.l(w))return u(this.m()*T.m());for(var y=this.g.length+T.g.length,_=[],b=0;b<2*y;b++)_[b]=0;for(b=0;b<this.g.length;b++)for(var E=0;E<T.g.length;E++){var x=this.i(b)>>>16,v=this.i(b)&65535,le=T.i(E)>>>16,pe=T.i(E)&65535;_[2*b+2*E]+=v*pe,P(_,2*b+2*E),_[2*b+2*E+1]+=x*pe,P(_,2*b+2*E+1),_[2*b+2*E+1]+=v*le,P(_,2*b+2*E+1),_[2*b+2*E+2]+=x*le,P(_,2*b+2*E+2)}for(b=0;b<y;b++)_[b]=_[2*b+1]<<16|_[2*b];for(b=y;b<2*y;b++)_[b]=0;return new o(_,0)};function P(T,y){for(;(T[y]&65535)!=T[y];)T[y+1]+=T[y]>>>16,T[y]&=65535,y++}function L(T,y){this.g=T,this.h=y}function N(T,y){if(I(y))throw Error("division by zero");if(I(T))return new L(m,m);if(S(T))return y=N(A(T),y),new L(A(y.g),A(y.h));if(S(y))return y=N(T,A(y)),new L(A(y.g),y.h);if(30<T.g.length){if(S(T)||S(y))throw Error("slowDivide_ only works with positive integers.");for(var _=p,b=y;0>=b.l(T);)_=z(_),b=z(b);var E=U(_,1),x=U(b,1);for(b=U(b,2),_=U(_,2);!I(b);){var v=x.add(b);0>=v.l(T)&&(E=E.add(_),x=v),b=U(b,1),_=U(_,1)}return y=C(T,E.j(y)),new L(E,y)}for(E=m;0<=T.l(y);){for(_=Math.max(1,Math.floor(T.m()/y.m())),b=Math.ceil(Math.log(_)/Math.LN2),b=48>=b?1:Math.pow(2,b-48),x=u(_),v=x.j(y);S(v)||0<v.l(T);)_-=b,x=u(_),v=x.j(y);I(x)&&(x=p),E=E.add(x),T=C(T,v)}return new L(E,T)}t.A=function(T){return N(this,T).h},t.and=function(T){for(var y=Math.max(this.g.length,T.g.length),_=[],b=0;b<y;b++)_[b]=this.i(b)&T.i(b);return new o(_,this.h&T.h)},t.or=function(T){for(var y=Math.max(this.g.length,T.g.length),_=[],b=0;b<y;b++)_[b]=this.i(b)|T.i(b);return new o(_,this.h|T.h)},t.xor=function(T){for(var y=Math.max(this.g.length,T.g.length),_=[],b=0;b<y;b++)_[b]=this.i(b)^T.i(b);return new o(_,this.h^T.h)};function z(T){for(var y=T.g.length+1,_=[],b=0;b<y;b++)_[b]=T.i(b)<<1|T.i(b-1)>>>31;return new o(_,T.h)}function U(T,y){var _=y>>5;y%=32;for(var b=T.g.length-_,E=[],x=0;x<b;x++)E[x]=0<y?T.i(x+_)>>>y|T.i(x+_+1)<<32-y:T.i(x+_);return new o(E,T.h)}i.prototype.digest=i.prototype.v,i.prototype.reset=i.prototype.s,i.prototype.update=i.prototype.u,_p=i,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.A,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=u,o.fromString=f,Ui=o}).apply(typeof gh<"u"?gh:typeof self<"u"?self:typeof window<"u"?window:{});var Ao=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Ep,as,Tp,No,Nl,Ip,Sp,xp;(function(){var t,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(a,d,h){return a==Array.prototype||a==Object.prototype||(a[d]=h.value),a};function n(a){a=[typeof globalThis=="object"&&globalThis,a,typeof window=="object"&&window,typeof self=="object"&&self,typeof Ao=="object"&&Ao];for(var d=0;d<a.length;++d){var h=a[d];if(h&&h.Math==Math)return h}throw Error("Cannot find global object")}var i=n(this);function r(a,d){if(d)e:{var h=i;a=a.split(".");for(var g=0;g<a.length-1;g++){var k=a[g];if(!(k in h))break e;h=h[k]}a=a[a.length-1],g=h[a],d=d(g),d!=g&&d!=null&&e(h,a,{configurable:!0,writable:!0,value:d})}}function s(a,d){a instanceof String&&(a+="");var h=0,g=!1,k={next:function(){if(!g&&h<a.length){var R=h++;return{value:d(R,a[R]),done:!1}}return g=!0,{done:!0,value:void 0}}};return k[Symbol.iterator]=function(){return k},k}r("Array.prototype.values",function(a){return a||function(){return s(this,function(d,h){return h})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var o=o||{},l=this||self;function c(a){var d=typeof a;return d=d!="object"?d:a?Array.isArray(a)?"array":d:"null",d=="array"||d=="object"&&typeof a.length=="number"}function u(a){var d=typeof a;return d=="object"&&a!=null||d=="function"}function f(a,d,h){return a.call.apply(a.bind,arguments)}function m(a,d,h){if(!a)throw Error();if(2<arguments.length){var g=Array.prototype.slice.call(arguments,2);return function(){var k=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(k,g),a.apply(d,k)}}return function(){return a.apply(d,arguments)}}function p(a,d,h){return p=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?f:m,p.apply(null,arguments)}function w(a,d){var h=Array.prototype.slice.call(arguments,1);return function(){var g=h.slice();return g.push.apply(g,arguments),a.apply(this,g)}}function I(a,d){function h(){}h.prototype=d.prototype,a.aa=d.prototype,a.prototype=new h,a.prototype.constructor=a,a.Qb=function(g,k,R){for(var F=Array(arguments.length-2),we=2;we<arguments.length;we++)F[we-2]=arguments[we];return d.prototype[k].apply(g,F)}}function S(a){const d=a.length;if(0<d){const h=Array(d);for(let g=0;g<d;g++)h[g]=a[g];return h}return[]}function A(a,d){for(let h=1;h<arguments.length;h++){const g=arguments[h];if(c(g)){const k=a.length||0,R=g.length||0;a.length=k+R;for(let F=0;F<R;F++)a[k+F]=g[F]}else a.push(g)}}class C{constructor(d,h){this.i=d,this.j=h,this.h=0,this.g=null}get(){let d;return 0<this.h?(this.h--,d=this.g,this.g=d.next,d.next=null):d=this.i(),d}}function P(a){return/^[\s\xa0]*$/.test(a)}function L(){var a=l.navigator;return a&&(a=a.userAgent)?a:""}function N(a){return N[" "](a),a}N[" "]=function(){};var z=L().indexOf("Gecko")!=-1&&!(L().toLowerCase().indexOf("webkit")!=-1&&L().indexOf("Edge")==-1)&&!(L().indexOf("Trident")!=-1||L().indexOf("MSIE")!=-1)&&L().indexOf("Edge")==-1;function U(a,d,h){for(const g in a)d.call(h,a[g],g,a)}function T(a,d){for(const h in a)d.call(void 0,a[h],h,a)}function y(a){const d={};for(const h in a)d[h]=a[h];return d}const _="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function b(a,d){let h,g;for(let k=1;k<arguments.length;k++){g=arguments[k];for(h in g)a[h]=g[h];for(let R=0;R<_.length;R++)h=_[R],Object.prototype.hasOwnProperty.call(g,h)&&(a[h]=g[h])}}function E(a){var d=1;a=a.split(":");const h=[];for(;0<d&&a.length;)h.push(a.shift()),d--;return a.length&&h.push(a.join(":")),h}function x(a){l.setTimeout(()=>{throw a},0)}function v(){var a=te;let d=null;return a.g&&(d=a.g,a.g=a.g.next,a.g||(a.h=null),d.next=null),d}class le{constructor(){this.h=this.g=null}add(d,h){const g=pe.get();g.set(d,h),this.h?this.h.next=g:this.g=g,this.h=g}}var pe=new C(()=>new H,a=>a.reset());class H{constructor(){this.next=this.g=this.h=null}set(d,h){this.h=d,this.g=h,this.next=null}reset(){this.next=this.g=this.h=null}}let ee,ne=!1,te=new le,Ne=()=>{const a=l.Promise.resolve(void 0);ee=()=>{a.then(Pe)}};var Pe=()=>{for(var a;a=v();){try{a.h.call(a.g)}catch(h){x(h)}var d=pe;d.j(a),100>d.h&&(d.h++,a.next=d.g,d.g=a)}ne=!1};function ve(){this.s=this.s,this.C=this.C}ve.prototype.s=!1,ve.prototype.ma=function(){this.s||(this.s=!0,this.N())},ve.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function O(a,d){this.type=a,this.g=this.target=d,this.defaultPrevented=!1}O.prototype.h=function(){this.defaultPrevented=!0};var Z=function(){if(!l.addEventListener||!Object.defineProperty)return!1;var a=!1,d=Object.defineProperty({},"passive",{get:function(){a=!0}});try{const h=()=>{};l.addEventListener("test",h,d),l.removeEventListener("test",h,d)}catch{}return a}();function _e(a,d){if(O.call(this,a?a.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,a){var h=this.type=a.type,g=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;if(this.target=a.target||a.srcElement,this.g=d,d=a.relatedTarget){if(z){e:{try{N(d.nodeName);var k=!0;break e}catch{}k=!1}k||(d=null)}}else h=="mouseover"?d=a.fromElement:h=="mouseout"&&(d=a.toElement);this.relatedTarget=d,g?(this.clientX=g.clientX!==void 0?g.clientX:g.pageX,this.clientY=g.clientY!==void 0?g.clientY:g.pageY,this.screenX=g.screenX||0,this.screenY=g.screenY||0):(this.clientX=a.clientX!==void 0?a.clientX:a.pageX,this.clientY=a.clientY!==void 0?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0),this.button=a.button,this.key=a.key||"",this.ctrlKey=a.ctrlKey,this.altKey=a.altKey,this.shiftKey=a.shiftKey,this.metaKey=a.metaKey,this.pointerId=a.pointerId||0,this.pointerType=typeof a.pointerType=="string"?a.pointerType:se[a.pointerType]||"",this.state=a.state,this.i=a,a.defaultPrevented&&_e.aa.h.call(this)}}I(_e,O);var se={2:"touch",3:"pen",4:"mouse"};_e.prototype.h=function(){_e.aa.h.call(this);var a=this.i;a.preventDefault?a.preventDefault():a.returnValue=!1};var ce="closure_listenable_"+(1e6*Math.random()|0),xe=0;function Xn(a,d,h,g,k){this.listener=a,this.proxy=null,this.src=d,this.type=h,this.capture=!!g,this.ha=k,this.key=++xe,this.da=this.fa=!1}function ft(a){a.da=!0,a.listener=null,a.proxy=null,a.src=null,a.ha=null}function pt(a){this.src=a,this.g={},this.h=0}pt.prototype.add=function(a,d,h,g,k){var R=a.toString();a=this.g[R],a||(a=this.g[R]=[],this.h++);var F=Ot(a,d,g,k);return-1<F?(d=a[F],h||(d.fa=!1)):(d=new Xn(d,this.src,R,!!g,k),d.fa=h,a.push(d)),d};function nn(a,d){var h=d.type;if(h in a.g){var g=a.g[h],k=Array.prototype.indexOf.call(g,d,void 0),R;(R=0<=k)&&Array.prototype.splice.call(g,k,1),R&&(ft(d),a.g[h].length==0&&(delete a.g[h],a.h--))}}function Ot(a,d,h,g){for(var k=0;k<a.length;++k){var R=a[k];if(!R.da&&R.listener==d&&R.capture==!!h&&R.ha==g)return k}return-1}var tt="closure_lm_"+(1e6*Math.random()|0),mt={};function _n(a,d,h,g,k){if(Array.isArray(d)){for(var R=0;R<d.length;R++)_n(a,d[R],h,g,k);return null}return h=In(h),a&&a[ce]?a.K(d,h,u(g)?!!g.capture:!1,k):En(a,d,h,!1,g,k)}function En(a,d,h,g,k,R){if(!d)throw Error("Invalid event type");var F=u(k)?!!k.capture:!!k,we=sn(a);if(we||(a[tt]=we=new pt(a)),h=we.add(d,h,g,F,R),h.proxy)return h;if(g=rn(),h.proxy=g,g.src=a,g.listener=h,a.addEventListener)Z||(k=F),k===void 0&&(k=!1),a.addEventListener(d.toString(),g,k);else if(a.attachEvent)a.attachEvent(Tt(d.toString()),g);else if(a.addListener&&a.removeListener)a.addListener(g);else throw Error("addEventListener and attachEvent are unavailable.");return h}function rn(){function a(h){return d.call(a.src,a.listener,h)}const d=Zn;return a}function Tn(a,d,h,g,k){if(Array.isArray(d))for(var R=0;R<d.length;R++)Tn(a,d[R],h,g,k);else g=u(g)?!!g.capture:!!g,h=In(h),a&&a[ce]?(a=a.i,d=String(d).toString(),d in a.g&&(R=a.g[d],h=Ot(R,h,g,k),-1<h&&(ft(R[h]),Array.prototype.splice.call(R,h,1),R.length==0&&(delete a.g[d],a.h--)))):a&&(a=sn(a))&&(d=a.g[d.toString()],a=-1,d&&(a=Ot(d,h,g,k)),(h=-1<a?d[a]:null)&&Wt(h))}function Wt(a){if(typeof a!="number"&&a&&!a.da){var d=a.src;if(d&&d[ce])nn(d.i,a);else{var h=a.type,g=a.proxy;d.removeEventListener?d.removeEventListener(h,g,a.capture):d.detachEvent?d.detachEvent(Tt(h),g):d.addListener&&d.removeListener&&d.removeListener(g),(h=sn(d))?(nn(h,a),h.h==0&&(h.src=null,d[tt]=null)):ft(a)}}}function Tt(a){return a in mt?mt[a]:mt[a]="on"+a}function Zn(a,d){if(a.da)a=!0;else{d=new _e(d,this);var h=a.listener,g=a.ha||a.src;a.fa&&Wt(a),a=h.call(g,d)}return a}function sn(a){return a=a[tt],a instanceof pt?a:null}var Gt="__closure_events_fn_"+(1e9*Math.random()>>>0);function In(a){return typeof a=="function"?a:(a[Gt]||(a[Gt]=function(d){return a.handleEvent(d)}),a[Gt])}function Ee(){ve.call(this),this.i=new pt(this),this.M=this,this.F=null}I(Ee,ve),Ee.prototype[ce]=!0,Ee.prototype.removeEventListener=function(a,d,h,g){Tn(this,a,d,h,g)};function fe(a,d){var h,g=a.F;if(g)for(h=[];g;g=g.F)h.push(g);if(a=a.M,g=d.type||d,typeof d=="string")d=new O(d,a);else if(d instanceof O)d.target=d.target||a;else{var k=d;d=new O(g,a),b(d,k)}if(k=!0,h)for(var R=h.length-1;0<=R;R--){var F=d.g=h[R];k=on(F,g,!0,d)&&k}if(F=d.g=a,k=on(F,g,!0,d)&&k,k=on(F,g,!1,d)&&k,h)for(R=0;R<h.length;R++)F=d.g=h[R],k=on(F,g,!1,d)&&k}Ee.prototype.N=function(){if(Ee.aa.N.call(this),this.i){var a=this.i,d;for(d in a.g){for(var h=a.g[d],g=0;g<h.length;g++)ft(h[g]);delete a.g[d],a.h--}}this.F=null},Ee.prototype.K=function(a,d,h,g){return this.i.add(String(a),d,!1,h,g)},Ee.prototype.L=function(a,d,h,g){return this.i.add(String(a),d,!0,h,g)};function on(a,d,h,g){if(d=a.i.g[String(d)],!d)return!0;d=d.concat();for(var k=!0,R=0;R<d.length;++R){var F=d[R];if(F&&!F.da&&F.capture==h){var we=F.listener,Ke=F.ha||F.src;F.fa&&nn(a.i,F),k=we.call(Ke,g)!==!1&&k}}return k&&!g.defaultPrevented}function an(a,d,h){if(typeof a=="function")h&&(a=p(a,h));else if(a&&typeof a.handleEvent=="function")a=p(a.handleEvent,a);else throw Error("Invalid listener argument");return 2147483647<Number(d)?-1:l.setTimeout(a,d||0)}function ei(a){a.g=an(()=>{a.g=null,a.i&&(a.i=!1,ei(a))},a.l);const d=a.h;a.h=null,a.m.apply(null,d)}class ho extends ve{constructor(d,h){super(),this.m=d,this.l=h,this.h=null,this.i=!1,this.g=null}j(d){this.h=arguments,this.g?this.i=!0:ei(this)}N(){super.N(),this.g&&(l.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Sn(a){ve.call(this),this.h=a,this.g={}}I(Sn,ve);var xn=[];function ln(a){U(a.g,function(d,h){this.g.hasOwnProperty(h)&&Wt(d)},a),a.g={}}Sn.prototype.N=function(){Sn.aa.N.call(this),ln(this)},Sn.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var nt=l.JSON.stringify,It=l.JSON.parse,ie=class{stringify(a){return l.JSON.stringify(a,void 0)}parse(a){return l.JSON.parse(a,void 0)}};function Pt(){}Pt.prototype.h=null;function Ft(a){return a.h||(a.h=a.i())}function Yt(){}var gt={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function Wr(){O.call(this,"d")}I(Wr,O);function Ci(){O.call(this,"c")}I(Ci,O);var An={},Gr=null;function Ri(){return Gr=Gr||new Ee}An.La="serverreachability";function Yr(a){O.call(this,An.La,a)}I(Yr,O);function ti(a){const d=Ri();fe(d,new Yr(d))}An.STAT_EVENT="statevent";function X(a,d){O.call(this,An.STAT_EVENT,a),this.stat=d}I(X,O);function ue(a){const d=Ri();fe(d,new X(d,a))}An.Ma="timingevent";function qe(a,d){O.call(this,An.Ma,a),this.size=d}I(qe,O);function We(a,d){if(typeof a!="function")throw Error("Fn must not be null and must be a function");return l.setTimeout(function(){a()},d)}function yt(){this.g=!0}yt.prototype.xa=function(){this.g=!1};function Ve(a,d,h,g,k,R){a.info(function(){if(a.g)if(R)for(var F="",we=R.split("&"),Ke=0;Ke<we.length;Ke++){var de=we[Ke].split("=");if(1<de.length){var it=de[0];de=de[1];var rt=it.split("_");F=2<=rt.length&&rt[1]=="type"?F+(it+"="+de+"&"):F+(it+"=redacted&")}}else F=null;else F=R;return"XMLHTTP REQ ("+g+") [attempt "+k+"]: "+d+`
`+h+`
`+F})}function jt(a,d,h,g,k,R,F){a.info(function(){return"XMLHTTP RESP ("+g+") [ attempt "+k+"]: "+d+`
`+h+`
`+R+" "+F})}function be(a,d,h,g){a.info(function(){return"XMLHTTP TEXT ("+d+"): "+vt(a,h)+(g?" "+g:"")})}function je(a,d){a.info(function(){return"TIMEOUT: "+d})}yt.prototype.info=function(){};function vt(a,d){if(!a.g)return d;if(!d)return null;try{var h=JSON.parse(d);if(h){for(a=0;a<h.length;a++)if(Array.isArray(h[a])){var g=h[a];if(!(2>g.length)){var k=g[1];if(Array.isArray(k)&&!(1>k.length)){var R=k[0];if(R!="noop"&&R!="stop"&&R!="close")for(var F=1;F<k.length;F++)k[F]=""}}}}return nt(h)}catch{return d}}var Ae={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},ni={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},Pi;function jr(){}I(jr,Pt),jr.prototype.g=function(){return new XMLHttpRequest},jr.prototype.i=function(){return{}},Pi=new jr;function ii(a,d,h,g){this.j=a,this.i=d,this.l=h,this.R=g||1,this.U=new Sn(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new ed}function ed(){this.i=null,this.g="",this.h=!1}var td={},el={};function tl(a,d,h){a.L=1,a.v=go(kn(d)),a.m=h,a.P=!0,nd(a,null)}function nd(a,d){a.F=Date.now(),fo(a),a.A=kn(a.v);var h=a.A,g=a.R;Array.isArray(g)||(g=[String(g)]),gd(h.i,"t",g),a.C=0,h=a.j.J,a.h=new ed,a.g=Bd(a.j,h?d:null,!a.m),0<a.O&&(a.M=new ho(p(a.Y,a,a.g),a.O)),d=a.U,h=a.g,g=a.ca;var k="readystatechange";Array.isArray(k)||(k&&(xn[0]=k.toString()),k=xn);for(var R=0;R<k.length;R++){var F=_n(h,k[R],g||d.handleEvent,!1,d.h||d);if(!F)break;d.g[F.key]=F}d=a.H?y(a.H):{},a.m?(a.u||(a.u="POST"),d["Content-Type"]="application/x-www-form-urlencoded",a.g.ea(a.A,a.u,a.m,d)):(a.u="GET",a.g.ea(a.A,a.u,null,d)),ti(),Ve(a.i,a.u,a.A,a.l,a.R,a.m)}ii.prototype.ca=function(a){a=a.target;const d=this.M;d&&Cn(a)==3?d.j():this.Y(a)},ii.prototype.Y=function(a){try{if(a==this.g)e:{const rt=Cn(this.g);var d=this.g.Ba();const or=this.g.Z();if(!(3>rt)&&(rt!=3||this.g&&(this.h.h||this.g.oa()||Td(this.g)))){this.J||rt!=4||d==7||(d==8||0>=or?ti(3):ti(2)),nl(this);var h=this.g.Z();this.X=h;t:if(id(this)){var g=Td(this.g);a="";var k=g.length,R=Cn(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){Mi(this),Kr(this);var F="";break t}this.h.i=new l.TextDecoder}for(d=0;d<k;d++)this.h.h=!0,a+=this.h.i.decode(g[d],{stream:!(R&&d==k-1)});g.length=0,this.h.g+=a,this.C=0,F=this.h.g}else F=this.g.oa();if(this.o=h==200,jt(this.i,this.u,this.A,this.l,this.R,rt,h),this.o){if(this.T&&!this.K){t:{if(this.g){var we,Ke=this.g;if((we=Ke.g?Ke.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!P(we)){var de=we;break t}}de=null}if(h=de)be(this.i,this.l,h,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,il(this,h);else{this.o=!1,this.s=3,ue(12),Mi(this),Kr(this);break e}}if(this.P){h=!0;let Kt;for(;!this.J&&this.C<F.length;)if(Kt=Ey(this,F),Kt==el){rt==4&&(this.s=4,ue(14),h=!1),be(this.i,this.l,null,"[Incomplete Response]");break}else if(Kt==td){this.s=4,ue(15),be(this.i,this.l,F,"[Invalid Chunk]"),h=!1;break}else be(this.i,this.l,Kt,null),il(this,Kt);if(id(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),rt!=4||F.length!=0||this.h.h||(this.s=1,ue(16),h=!1),this.o=this.o&&h,!h)be(this.i,this.l,F,"[Invalid Chunked Response]"),Mi(this),Kr(this);else if(0<F.length&&!this.W){this.W=!0;var it=this.j;it.g==this&&it.ba&&!it.M&&(it.j.info("Great, no buffering proxy detected. Bytes received: "+F.length),cl(it),it.M=!0,ue(11))}}else be(this.i,this.l,F,null),il(this,F);rt==4&&Mi(this),this.o&&!this.J&&(rt==4?Rd(this.j,this):(this.o=!1,fo(this)))}else Vy(this.g),h==400&&0<F.indexOf("Unknown SID")?(this.s=3,ue(12)):(this.s=0,ue(13)),Mi(this),Kr(this)}}}catch{}finally{}};function id(a){return a.g?a.u=="GET"&&a.L!=2&&a.j.Ca:!1}function Ey(a,d){var h=a.C,g=d.indexOf(`
`,h);return g==-1?el:(h=Number(d.substring(h,g)),isNaN(h)?td:(g+=1,g+h>d.length?el:(d=d.slice(g,g+h),a.C=g+h,d)))}ii.prototype.cancel=function(){this.J=!0,Mi(this)};function fo(a){a.S=Date.now()+a.I,rd(a,a.I)}function rd(a,d){if(a.B!=null)throw Error("WatchDog timer not null");a.B=We(p(a.ba,a),d)}function nl(a){a.B&&(l.clearTimeout(a.B),a.B=null)}ii.prototype.ba=function(){this.B=null;const a=Date.now();0<=a-this.S?(je(this.i,this.A),this.L!=2&&(ti(),ue(17)),Mi(this),this.s=2,Kr(this)):rd(this,this.S-a)};function Kr(a){a.j.G==0||a.J||Rd(a.j,a)}function Mi(a){nl(a);var d=a.M;d&&typeof d.ma=="function"&&d.ma(),a.M=null,ln(a.U),a.g&&(d=a.g,a.g=null,d.abort(),d.ma())}function il(a,d){try{var h=a.j;if(h.G!=0&&(h.g==a||rl(h.h,a))){if(!a.K&&rl(h.h,a)&&h.G==3){try{var g=h.Da.g.parse(d)}catch{g=null}if(Array.isArray(g)&&g.length==3){var k=g;if(k[0]==0){e:if(!h.u){if(h.g)if(h.g.F+3e3<a.F)Eo(h),wo(h);else break e;ll(h),ue(18)}}else h.za=k[1],0<h.za-h.T&&37500>k[2]&&h.F&&h.v==0&&!h.C&&(h.C=We(p(h.Za,h),6e3));if(1>=ad(h.h)&&h.ca){try{h.ca()}catch{}h.ca=void 0}}else Bi(h,11)}else if((a.K||h.g==a)&&Eo(h),!P(d))for(k=h.Da.g.parse(d),d=0;d<k.length;d++){let de=k[d];if(h.T=de[0],de=de[1],h.G==2)if(de[0]=="c"){h.K=de[1],h.ia=de[2];const it=de[3];it!=null&&(h.la=it,h.j.info("VER="+h.la));const rt=de[4];rt!=null&&(h.Aa=rt,h.j.info("SVER="+h.Aa));const or=de[5];or!=null&&typeof or=="number"&&0<or&&(g=1.5*or,h.L=g,h.j.info("backChannelRequestTimeoutMs_="+g)),g=h;const Kt=a.g;if(Kt){const Io=Kt.g?Kt.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Io){var R=g.h;R.g||Io.indexOf("spdy")==-1&&Io.indexOf("quic")==-1&&Io.indexOf("h2")==-1||(R.j=R.l,R.g=new Set,R.h&&(sl(R,R.h),R.h=null))}if(g.D){const ul=Kt.g?Kt.g.getResponseHeader("X-HTTP-Session-Id"):null;ul&&(g.ya=ul,Te(g.I,g.D,ul))}}h.G=3,h.l&&h.l.ua(),h.ba&&(h.R=Date.now()-a.F,h.j.info("Handshake RTT: "+h.R+"ms")),g=h;var F=a;if(g.qa=Dd(g,g.J?g.ia:null,g.W),F.K){ld(g.h,F);var we=F,Ke=g.L;Ke&&(we.I=Ke),we.B&&(nl(we),fo(we)),g.g=F}else kd(g);0<h.i.length&&_o(h)}else de[0]!="stop"&&de[0]!="close"||Bi(h,7);else h.G==3&&(de[0]=="stop"||de[0]=="close"?de[0]=="stop"?Bi(h,7):al(h):de[0]!="noop"&&h.l&&h.l.ta(de),h.v=0)}}ti(4)}catch{}}var Ty=class{constructor(a,d){this.g=a,this.map=d}};function sd(a){this.l=a||10,l.PerformanceNavigationTiming?(a=l.performance.getEntriesByType("navigation"),a=0<a.length&&(a[0].nextHopProtocol=="hq"||a[0].nextHopProtocol=="h2")):a=!!(l.chrome&&l.chrome.loadTimes&&l.chrome.loadTimes()&&l.chrome.loadTimes().wasFetchedViaSpdy),this.j=a?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function od(a){return a.h?!0:a.g?a.g.size>=a.j:!1}function ad(a){return a.h?1:a.g?a.g.size:0}function rl(a,d){return a.h?a.h==d:a.g?a.g.has(d):!1}function sl(a,d){a.g?a.g.add(d):a.h=d}function ld(a,d){a.h&&a.h==d?a.h=null:a.g&&a.g.has(d)&&a.g.delete(d)}sd.prototype.cancel=function(){if(this.i=cd(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const a of this.g.values())a.cancel();this.g.clear()}};function cd(a){if(a.h!=null)return a.i.concat(a.h.D);if(a.g!=null&&a.g.size!==0){let d=a.i;for(const h of a.g.values())d=d.concat(h.D);return d}return S(a.i)}function Iy(a){if(a.V&&typeof a.V=="function")return a.V();if(typeof Map<"u"&&a instanceof Map||typeof Set<"u"&&a instanceof Set)return Array.from(a.values());if(typeof a=="string")return a.split("");if(c(a)){for(var d=[],h=a.length,g=0;g<h;g++)d.push(a[g]);return d}d=[],h=0;for(g in a)d[h++]=a[g];return d}function Sy(a){if(a.na&&typeof a.na=="function")return a.na();if(!a.V||typeof a.V!="function"){if(typeof Map<"u"&&a instanceof Map)return Array.from(a.keys());if(!(typeof Set<"u"&&a instanceof Set)){if(c(a)||typeof a=="string"){var d=[];a=a.length;for(var h=0;h<a;h++)d.push(h);return d}d=[],h=0;for(const g in a)d[h++]=g;return d}}}function ud(a,d){if(a.forEach&&typeof a.forEach=="function")a.forEach(d,void 0);else if(c(a)||typeof a=="string")Array.prototype.forEach.call(a,d,void 0);else for(var h=Sy(a),g=Iy(a),k=g.length,R=0;R<k;R++)d.call(void 0,g[R],h&&h[R],a)}var dd=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function xy(a,d){if(a){a=a.split("&");for(var h=0;h<a.length;h++){var g=a[h].indexOf("="),k=null;if(0<=g){var R=a[h].substring(0,g);k=a[h].substring(g+1)}else R=a[h];d(R,k?decodeURIComponent(k.replace(/\+/g," ")):"")}}}function Di(a){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,a instanceof Di){this.h=a.h,po(this,a.j),this.o=a.o,this.g=a.g,mo(this,a.s),this.l=a.l;var d=a.i,h=new Xr;h.i=d.i,d.g&&(h.g=new Map(d.g),h.h=d.h),hd(this,h),this.m=a.m}else a&&(d=String(a).match(dd))?(this.h=!1,po(this,d[1]||"",!0),this.o=Qr(d[2]||""),this.g=Qr(d[3]||"",!0),mo(this,d[4]),this.l=Qr(d[5]||"",!0),hd(this,d[6]||"",!0),this.m=Qr(d[7]||"")):(this.h=!1,this.i=new Xr(null,this.h))}Di.prototype.toString=function(){var a=[],d=this.j;d&&a.push(Jr(d,fd,!0),":");var h=this.g;return(h||d=="file")&&(a.push("//"),(d=this.o)&&a.push(Jr(d,fd,!0),"@"),a.push(encodeURIComponent(String(h)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),h=this.s,h!=null&&a.push(":",String(h))),(h=this.l)&&(this.g&&h.charAt(0)!="/"&&a.push("/"),a.push(Jr(h,h.charAt(0)=="/"?Cy:ky,!0))),(h=this.i.toString())&&a.push("?",h),(h=this.m)&&a.push("#",Jr(h,Py)),a.join("")};function kn(a){return new Di(a)}function po(a,d,h){a.j=h?Qr(d,!0):d,a.j&&(a.j=a.j.replace(/:$/,""))}function mo(a,d){if(d){if(d=Number(d),isNaN(d)||0>d)throw Error("Bad port number "+d);a.s=d}else a.s=null}function hd(a,d,h){d instanceof Xr?(a.i=d,My(a.i,a.h)):(h||(d=Jr(d,Ry)),a.i=new Xr(d,a.h))}function Te(a,d,h){a.i.set(d,h)}function go(a){return Te(a,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),a}function Qr(a,d){return a?d?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""}function Jr(a,d,h){return typeof a=="string"?(a=encodeURI(a).replace(d,Ay),h&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null}function Ay(a){return a=a.charCodeAt(0),"%"+(a>>4&15).toString(16)+(a&15).toString(16)}var fd=/[#\/\?@]/g,ky=/[#\?:]/g,Cy=/[#\?]/g,Ry=/[#\?@]/g,Py=/#/g;function Xr(a,d){this.h=this.g=null,this.i=a||null,this.j=!!d}function ri(a){a.g||(a.g=new Map,a.h=0,a.i&&xy(a.i,function(d,h){a.add(decodeURIComponent(d.replace(/\+/g," ")),h)}))}t=Xr.prototype,t.add=function(a,d){ri(this),this.i=null,a=rr(this,a);var h=this.g.get(a);return h||this.g.set(a,h=[]),h.push(d),this.h+=1,this};function pd(a,d){ri(a),d=rr(a,d),a.g.has(d)&&(a.i=null,a.h-=a.g.get(d).length,a.g.delete(d))}function md(a,d){return ri(a),d=rr(a,d),a.g.has(d)}t.forEach=function(a,d){ri(this),this.g.forEach(function(h,g){h.forEach(function(k){a.call(d,k,g,this)},this)},this)},t.na=function(){ri(this);const a=Array.from(this.g.values()),d=Array.from(this.g.keys()),h=[];for(let g=0;g<d.length;g++){const k=a[g];for(let R=0;R<k.length;R++)h.push(d[g])}return h},t.V=function(a){ri(this);let d=[];if(typeof a=="string")md(this,a)&&(d=d.concat(this.g.get(rr(this,a))));else{a=Array.from(this.g.values());for(let h=0;h<a.length;h++)d=d.concat(a[h])}return d},t.set=function(a,d){return ri(this),this.i=null,a=rr(this,a),md(this,a)&&(this.h-=this.g.get(a).length),this.g.set(a,[d]),this.h+=1,this},t.get=function(a,d){return a?(a=this.V(a),0<a.length?String(a[0]):d):d};function gd(a,d,h){pd(a,d),0<h.length&&(a.i=null,a.g.set(rr(a,d),S(h)),a.h+=h.length)}t.toString=function(){if(this.i)return this.i;if(!this.g)return"";const a=[],d=Array.from(this.g.keys());for(var h=0;h<d.length;h++){var g=d[h];const R=encodeURIComponent(String(g)),F=this.V(g);for(g=0;g<F.length;g++){var k=R;F[g]!==""&&(k+="="+encodeURIComponent(String(F[g]))),a.push(k)}}return this.i=a.join("&")};function rr(a,d){return d=String(d),a.j&&(d=d.toLowerCase()),d}function My(a,d){d&&!a.j&&(ri(a),a.i=null,a.g.forEach(function(h,g){var k=g.toLowerCase();g!=k&&(pd(this,g),gd(this,k,h))},a)),a.j=d}function Dy(a,d){const h=new yt;if(l.Image){const g=new Image;g.onload=w(si,h,"TestLoadImage: loaded",!0,d,g),g.onerror=w(si,h,"TestLoadImage: error",!1,d,g),g.onabort=w(si,h,"TestLoadImage: abort",!1,d,g),g.ontimeout=w(si,h,"TestLoadImage: timeout",!1,d,g),l.setTimeout(function(){g.ontimeout&&g.ontimeout()},1e4),g.src=a}else d(!1)}function By(a,d){const h=new yt,g=new AbortController,k=setTimeout(()=>{g.abort(),si(h,"TestPingServer: timeout",!1,d)},1e4);fetch(a,{signal:g.signal}).then(R=>{clearTimeout(k),R.ok?si(h,"TestPingServer: ok",!0,d):si(h,"TestPingServer: server error",!1,d)}).catch(()=>{clearTimeout(k),si(h,"TestPingServer: error",!1,d)})}function si(a,d,h,g,k){try{k&&(k.onload=null,k.onerror=null,k.onabort=null,k.ontimeout=null),g(h)}catch{}}function Ly(){this.g=new ie}function Ny(a,d,h){const g=h||"";try{ud(a,function(k,R){let F=k;u(k)&&(F=nt(k)),d.push(g+R+"="+encodeURIComponent(F))})}catch(k){throw d.push(g+"type="+encodeURIComponent("_badmap")),k}}function yo(a){this.l=a.Ub||null,this.j=a.eb||!1}I(yo,Pt),yo.prototype.g=function(){return new vo(this.l,this.j)},yo.prototype.i=function(a){return function(){return a}}({});function vo(a,d){Ee.call(this),this.D=a,this.o=d,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}I(vo,Ee),t=vo.prototype,t.open=function(a,d){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=a,this.A=d,this.readyState=1,es(this)},t.send=function(a){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const d={headers:this.u,method:this.B,credentials:this.m,cache:void 0};a&&(d.body=a),(this.D||l).fetch(new Request(this.A,d)).then(this.Sa.bind(this),this.ga.bind(this))},t.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,Zr(this)),this.readyState=0},t.Sa=function(a){if(this.g&&(this.l=a,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=a.headers,this.readyState=2,es(this)),this.g&&(this.readyState=3,es(this),this.g)))if(this.responseType==="arraybuffer")a.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof l.ReadableStream<"u"&&"body"in a){if(this.j=a.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;yd(this)}else a.text().then(this.Ra.bind(this),this.ga.bind(this))};function yd(a){a.j.read().then(a.Pa.bind(a)).catch(a.ga.bind(a))}t.Pa=function(a){if(this.g){if(this.o&&a.value)this.response.push(a.value);else if(!this.o){var d=a.value?a.value:new Uint8Array(0);(d=this.v.decode(d,{stream:!a.done}))&&(this.response=this.responseText+=d)}a.done?Zr(this):es(this),this.readyState==3&&yd(this)}},t.Ra=function(a){this.g&&(this.response=this.responseText=a,Zr(this))},t.Qa=function(a){this.g&&(this.response=a,Zr(this))},t.ga=function(){this.g&&Zr(this)};function Zr(a){a.readyState=4,a.l=null,a.j=null,a.v=null,es(a)}t.setRequestHeader=function(a,d){this.u.append(a,d)},t.getResponseHeader=function(a){return this.h&&this.h.get(a.toLowerCase())||""},t.getAllResponseHeaders=function(){if(!this.h)return"";const a=[],d=this.h.entries();for(var h=d.next();!h.done;)h=h.value,a.push(h[0]+": "+h[1]),h=d.next();return a.join(`\r
`)};function es(a){a.onreadystatechange&&a.onreadystatechange.call(a)}Object.defineProperty(vo.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(a){this.m=a?"include":"same-origin"}});function vd(a){let d="";return U(a,function(h,g){d+=g,d+=":",d+=h,d+=`\r
`}),d}function ol(a,d,h){e:{for(g in h){var g=!1;break e}g=!0}g||(h=vd(h),typeof a=="string"?h!=null&&encodeURIComponent(String(h)):Te(a,d,h))}function Oe(a){Ee.call(this),this.headers=new Map,this.o=a||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}I(Oe,Ee);var Oy=/^https?$/i,Fy=["POST","PUT"];t=Oe.prototype,t.Ha=function(a){this.J=a},t.ea=function(a,d,h,g){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+a);d=d?d.toUpperCase():"GET",this.D=a,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():Pi.g(),this.v=this.o?Ft(this.o):Ft(Pi),this.g.onreadystatechange=p(this.Ea,this);try{this.B=!0,this.g.open(d,String(a),!0),this.B=!1}catch(R){bd(this,R);return}if(a=h||"",h=new Map(this.headers),g)if(Object.getPrototypeOf(g)===Object.prototype)for(var k in g)h.set(k,g[k]);else if(typeof g.keys=="function"&&typeof g.get=="function")for(const R of g.keys())h.set(R,g.get(R));else throw Error("Unknown input type for opt_headers: "+String(g));g=Array.from(h.keys()).find(R=>R.toLowerCase()=="content-type"),k=l.FormData&&a instanceof l.FormData,!(0<=Array.prototype.indexOf.call(Fy,d,void 0))||g||k||h.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[R,F]of h)this.g.setRequestHeader(R,F);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{Ed(this),this.u=!0,this.g.send(a),this.u=!1}catch(R){bd(this,R)}};function bd(a,d){a.h=!1,a.g&&(a.j=!0,a.g.abort(),a.j=!1),a.l=d,a.m=5,wd(a),bo(a)}function wd(a){a.A||(a.A=!0,fe(a,"complete"),fe(a,"error"))}t.abort=function(a){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=a||7,fe(this,"complete"),fe(this,"abort"),bo(this))},t.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),bo(this,!0)),Oe.aa.N.call(this)},t.Ea=function(){this.s||(this.B||this.u||this.j?_d(this):this.bb())},t.bb=function(){_d(this)};function _d(a){if(a.h&&typeof o<"u"&&(!a.v[1]||Cn(a)!=4||a.Z()!=2)){if(a.u&&Cn(a)==4)an(a.Ea,0,a);else if(fe(a,"readystatechange"),Cn(a)==4){a.h=!1;try{const F=a.Z();e:switch(F){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var d=!0;break e;default:d=!1}var h;if(!(h=d)){var g;if(g=F===0){var k=String(a.D).match(dd)[1]||null;!k&&l.self&&l.self.location&&(k=l.self.location.protocol.slice(0,-1)),g=!Oy.test(k?k.toLowerCase():"")}h=g}if(h)fe(a,"complete"),fe(a,"success");else{a.m=6;try{var R=2<Cn(a)?a.g.statusText:""}catch{R=""}a.l=R+" ["+a.Z()+"]",wd(a)}}finally{bo(a)}}}}function bo(a,d){if(a.g){Ed(a);const h=a.g,g=a.v[0]?()=>{}:null;a.g=null,a.v=null,d||fe(a,"ready");try{h.onreadystatechange=g}catch{}}}function Ed(a){a.I&&(l.clearTimeout(a.I),a.I=null)}t.isActive=function(){return!!this.g};function Cn(a){return a.g?a.g.readyState:0}t.Z=function(){try{return 2<Cn(this)?this.g.status:-1}catch{return-1}},t.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},t.Oa=function(a){if(this.g){var d=this.g.responseText;return a&&d.indexOf(a)==0&&(d=d.substring(a.length)),It(d)}};function Td(a){try{if(!a.g)return null;if("response"in a.g)return a.g.response;switch(a.H){case"":case"text":return a.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in a.g)return a.g.mozResponseArrayBuffer}return null}catch{return null}}function Vy(a){const d={};a=(a.g&&2<=Cn(a)&&a.g.getAllResponseHeaders()||"").split(`\r
`);for(let g=0;g<a.length;g++){if(P(a[g]))continue;var h=E(a[g]);const k=h[0];if(h=h[1],typeof h!="string")continue;h=h.trim();const R=d[k]||[];d[k]=R,R.push(h)}T(d,function(g){return g.join(", ")})}t.Ba=function(){return this.m},t.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function ts(a,d,h){return h&&h.internalChannelParams&&h.internalChannelParams[a]||d}function Id(a){this.Aa=0,this.i=[],this.j=new yt,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=ts("failFast",!1,a),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=ts("baseRetryDelayMs",5e3,a),this.cb=ts("retryDelaySeedMs",1e4,a),this.Wa=ts("forwardChannelMaxRetries",2,a),this.wa=ts("forwardChannelRequestTimeoutMs",2e4,a),this.pa=a&&a.xmlHttpFactory||void 0,this.Xa=a&&a.Tb||void 0,this.Ca=a&&a.useFetchStreams||!1,this.L=void 0,this.J=a&&a.supportsCrossDomainXhr||!1,this.K="",this.h=new sd(a&&a.concurrentRequestLimit),this.Da=new Ly,this.P=a&&a.fastHandshake||!1,this.O=a&&a.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=a&&a.Rb||!1,a&&a.xa&&this.j.xa(),a&&a.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&a&&a.detectBufferingProxy||!1,this.ja=void 0,a&&a.longPollingTimeout&&0<a.longPollingTimeout&&(this.ja=a.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}t=Id.prototype,t.la=8,t.G=1,t.connect=function(a,d,h,g){ue(0),this.W=a,this.H=d||{},h&&g!==void 0&&(this.H.OSID=h,this.H.OAID=g),this.F=this.X,this.I=Dd(this,null,this.W),_o(this)};function al(a){if(Sd(a),a.G==3){var d=a.U++,h=kn(a.I);if(Te(h,"SID",a.K),Te(h,"RID",d),Te(h,"TYPE","terminate"),ns(a,h),d=new ii(a,a.j,d),d.L=2,d.v=go(kn(h)),h=!1,l.navigator&&l.navigator.sendBeacon)try{h=l.navigator.sendBeacon(d.v.toString(),"")}catch{}!h&&l.Image&&(new Image().src=d.v,h=!0),h||(d.g=Bd(d.j,null),d.g.ea(d.v)),d.F=Date.now(),fo(d)}Md(a)}function wo(a){a.g&&(cl(a),a.g.cancel(),a.g=null)}function Sd(a){wo(a),a.u&&(l.clearTimeout(a.u),a.u=null),Eo(a),a.h.cancel(),a.s&&(typeof a.s=="number"&&l.clearTimeout(a.s),a.s=null)}function _o(a){if(!od(a.h)&&!a.s){a.s=!0;var d=a.Ga;ee||Ne(),ne||(ee(),ne=!0),te.add(d,a),a.B=0}}function zy(a,d){return ad(a.h)>=a.h.j-(a.s?1:0)?!1:a.s?(a.i=d.D.concat(a.i),!0):a.G==1||a.G==2||a.B>=(a.Va?0:a.Wa)?!1:(a.s=We(p(a.Ga,a,d),Pd(a,a.B)),a.B++,!0)}t.Ga=function(a){if(this.s)if(this.s=null,this.G==1){if(!a){this.U=Math.floor(1e5*Math.random()),a=this.U++;const k=new ii(this,this.j,a);let R=this.o;if(this.S&&(R?(R=y(R),b(R,this.S)):R=this.S),this.m!==null||this.O||(k.H=R,R=null),this.P)e:{for(var d=0,h=0;h<this.i.length;h++){t:{var g=this.i[h];if("__data__"in g.map&&(g=g.map.__data__,typeof g=="string")){g=g.length;break t}g=void 0}if(g===void 0)break;if(d+=g,4096<d){d=h;break e}if(d===4096||h===this.i.length-1){d=h+1;break e}}d=1e3}else d=1e3;d=Ad(this,k,d),h=kn(this.I),Te(h,"RID",a),Te(h,"CVER",22),this.D&&Te(h,"X-HTTP-Session-Id",this.D),ns(this,h),R&&(this.O?d="headers="+encodeURIComponent(String(vd(R)))+"&"+d:this.m&&ol(h,this.m,R)),sl(this.h,k),this.Ua&&Te(h,"TYPE","init"),this.P?(Te(h,"$req",d),Te(h,"SID","null"),k.T=!0,tl(k,h,null)):tl(k,h,d),this.G=2}}else this.G==3&&(a?xd(this,a):this.i.length==0||od(this.h)||xd(this))};function xd(a,d){var h;d?h=d.l:h=a.U++;const g=kn(a.I);Te(g,"SID",a.K),Te(g,"RID",h),Te(g,"AID",a.T),ns(a,g),a.m&&a.o&&ol(g,a.m,a.o),h=new ii(a,a.j,h,a.B+1),a.m===null&&(h.H=a.o),d&&(a.i=d.D.concat(a.i)),d=Ad(a,h,1e3),h.I=Math.round(.5*a.wa)+Math.round(.5*a.wa*Math.random()),sl(a.h,h),tl(h,g,d)}function ns(a,d){a.H&&U(a.H,function(h,g){Te(d,g,h)}),a.l&&ud({},function(h,g){Te(d,g,h)})}function Ad(a,d,h){h=Math.min(a.i.length,h);var g=a.l?p(a.l.Na,a.l,a):null;e:{var k=a.i;let R=-1;for(;;){const F=["count="+h];R==-1?0<h?(R=k[0].g,F.push("ofs="+R)):R=0:F.push("ofs="+R);let we=!0;for(let Ke=0;Ke<h;Ke++){let de=k[Ke].g;const it=k[Ke].map;if(de-=R,0>de)R=Math.max(0,k[Ke].g-100),we=!1;else try{Ny(it,F,"req"+de+"_")}catch{g&&g(it)}}if(we){g=F.join("&");break e}}}return a=a.i.splice(0,h),d.D=a,g}function kd(a){if(!a.g&&!a.u){a.Y=1;var d=a.Fa;ee||Ne(),ne||(ee(),ne=!0),te.add(d,a),a.v=0}}function ll(a){return a.g||a.u||3<=a.v?!1:(a.Y++,a.u=We(p(a.Fa,a),Pd(a,a.v)),a.v++,!0)}t.Fa=function(){if(this.u=null,Cd(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var a=2*this.R;this.j.info("BP detection timer enabled: "+a),this.A=We(p(this.ab,this),a)}},t.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,ue(10),wo(this),Cd(this))};function cl(a){a.A!=null&&(l.clearTimeout(a.A),a.A=null)}function Cd(a){a.g=new ii(a,a.j,"rpc",a.Y),a.m===null&&(a.g.H=a.o),a.g.O=0;var d=kn(a.qa);Te(d,"RID","rpc"),Te(d,"SID",a.K),Te(d,"AID",a.T),Te(d,"CI",a.F?"0":"1"),!a.F&&a.ja&&Te(d,"TO",a.ja),Te(d,"TYPE","xmlhttp"),ns(a,d),a.m&&a.o&&ol(d,a.m,a.o),a.L&&(a.g.I=a.L);var h=a.g;a=a.ia,h.L=1,h.v=go(kn(d)),h.m=null,h.P=!0,nd(h,a)}t.Za=function(){this.C!=null&&(this.C=null,wo(this),ll(this),ue(19))};function Eo(a){a.C!=null&&(l.clearTimeout(a.C),a.C=null)}function Rd(a,d){var h=null;if(a.g==d){Eo(a),cl(a),a.g=null;var g=2}else if(rl(a.h,d))h=d.D,ld(a.h,d),g=1;else return;if(a.G!=0){if(d.o)if(g==1){h=d.m?d.m.length:0,d=Date.now()-d.F;var k=a.B;g=Ri(),fe(g,new qe(g,h)),_o(a)}else kd(a);else if(k=d.s,k==3||k==0&&0<d.X||!(g==1&&zy(a,d)||g==2&&ll(a)))switch(h&&0<h.length&&(d=a.h,d.i=d.i.concat(h)),k){case 1:Bi(a,5);break;case 4:Bi(a,10);break;case 3:Bi(a,6);break;default:Bi(a,2)}}}function Pd(a,d){let h=a.Ta+Math.floor(Math.random()*a.cb);return a.isActive()||(h*=2),h*d}function Bi(a,d){if(a.j.info("Error code "+d),d==2){var h=p(a.fb,a),g=a.Xa;const k=!g;g=new Di(g||"//www.google.com/images/cleardot.gif"),l.location&&l.location.protocol=="http"||po(g,"https"),go(g),k?Dy(g.toString(),h):By(g.toString(),h)}else ue(2);a.G=0,a.l&&a.l.sa(d),Md(a),Sd(a)}t.fb=function(a){a?(this.j.info("Successfully pinged google.com"),ue(2)):(this.j.info("Failed to ping google.com"),ue(1))};function Md(a){if(a.G=0,a.ka=[],a.l){const d=cd(a.h);(d.length!=0||a.i.length!=0)&&(A(a.ka,d),A(a.ka,a.i),a.h.i.length=0,S(a.i),a.i.length=0),a.l.ra()}}function Dd(a,d,h){var g=h instanceof Di?kn(h):new Di(h);if(g.g!="")d&&(g.g=d+"."+g.g),mo(g,g.s);else{var k=l.location;g=k.protocol,d=d?d+"."+k.hostname:k.hostname,k=+k.port;var R=new Di(null);g&&po(R,g),d&&(R.g=d),k&&mo(R,k),h&&(R.l=h),g=R}return h=a.D,d=a.ya,h&&d&&Te(g,h,d),Te(g,"VER",a.la),ns(a,g),g}function Bd(a,d,h){if(d&&!a.J)throw Error("Can't create secondary domain capable XhrIo object.");return d=a.Ca&&!a.pa?new Oe(new yo({eb:h})):new Oe(a.pa),d.Ha(a.J),d}t.isActive=function(){return!!this.l&&this.l.isActive(this)};function Ld(){}t=Ld.prototype,t.ua=function(){},t.ta=function(){},t.sa=function(){},t.ra=function(){},t.isActive=function(){return!0},t.Na=function(){};function To(){}To.prototype.g=function(a,d){return new Mt(a,d)};function Mt(a,d){Ee.call(this),this.g=new Id(d),this.l=a,this.h=d&&d.messageUrlParams||null,a=d&&d.messageHeaders||null,d&&d.clientProtocolHeaderRequired&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"}),this.g.o=a,a=d&&d.initMessageHeaders||null,d&&d.messageContentType&&(a?a["X-WebChannel-Content-Type"]=d.messageContentType:a={"X-WebChannel-Content-Type":d.messageContentType}),d&&d.va&&(a?a["X-WebChannel-Client-Profile"]=d.va:a={"X-WebChannel-Client-Profile":d.va}),this.g.S=a,(a=d&&d.Sb)&&!P(a)&&(this.g.m=a),this.v=d&&d.supportsCrossDomainXhr||!1,this.u=d&&d.sendRawJson||!1,(d=d&&d.httpSessionIdParam)&&!P(d)&&(this.g.D=d,a=this.h,a!==null&&d in a&&(a=this.h,d in a&&delete a[d])),this.j=new sr(this)}I(Mt,Ee),Mt.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},Mt.prototype.close=function(){al(this.g)},Mt.prototype.o=function(a){var d=this.g;if(typeof a=="string"){var h={};h.__data__=a,a=h}else this.u&&(h={},h.__data__=nt(a),a=h);d.i.push(new Ty(d.Ya++,a)),d.G==3&&_o(d)},Mt.prototype.N=function(){this.g.l=null,delete this.j,al(this.g),delete this.g,Mt.aa.N.call(this)};function Nd(a){Wr.call(this),a.__headers__&&(this.headers=a.__headers__,this.statusCode=a.__status__,delete a.__headers__,delete a.__status__);var d=a.__sm__;if(d){e:{for(const h in d){a=h;break e}a=void 0}(this.i=a)&&(a=this.i,d=d!==null&&a in d?d[a]:void 0),this.data=d}else this.data=a}I(Nd,Wr);function Od(){Ci.call(this),this.status=1}I(Od,Ci);function sr(a){this.g=a}I(sr,Ld),sr.prototype.ua=function(){fe(this.g,"a")},sr.prototype.ta=function(a){fe(this.g,new Nd(a))},sr.prototype.sa=function(a){fe(this.g,new Od)},sr.prototype.ra=function(){fe(this.g,"b")},To.prototype.createWebChannel=To.prototype.g,Mt.prototype.send=Mt.prototype.o,Mt.prototype.open=Mt.prototype.m,Mt.prototype.close=Mt.prototype.close,xp=function(){return new To},Sp=function(){return Ri()},Ip=An,Nl={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},Ae.NO_ERROR=0,Ae.TIMEOUT=8,Ae.HTTP_ERROR=6,No=Ae,ni.COMPLETE="complete",Tp=ni,Yt.EventType=gt,gt.OPEN="a",gt.CLOSE="b",gt.ERROR="c",gt.MESSAGE="d",Ee.prototype.listen=Ee.prototype.K,as=Yt,Oe.prototype.listenOnce=Oe.prototype.L,Oe.prototype.getLastError=Oe.prototype.Ka,Oe.prototype.getLastErrorCode=Oe.prototype.Ba,Oe.prototype.getStatus=Oe.prototype.Z,Oe.prototype.getResponseJson=Oe.prototype.Oa,Oe.prototype.getResponseText=Oe.prototype.oa,Oe.prototype.send=Oe.prototype.ea,Oe.prototype.setWithCredentials=Oe.prototype.Ha,Ep=Oe}).apply(typeof Ao<"u"?Ao:typeof self<"u"?self:typeof window<"u"?window:{});const yh="@firebase/firestore";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ot{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}ot.UNAUTHENTICATED=new ot(null),ot.GOOGLE_CREDENTIALS=new ot("google-credentials-uid"),ot.FIRST_PARTY=new ot("first-party-uid"),ot.MOCK_USER=new ot("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */const Ki=new _c("@firebase/firestore");function is(){return Ki.logLevel}function q(t,...e){if(Ki.logLevel<=oe.DEBUG){const n=e.map(Lc);Ki.debug(`Firestore (${Br}): ${t}`,...n)}}function Hn(t,...e){if(Ki.logLevel<=oe.ERROR){const n=e.map(Lc);Ki.error(`Firestore (${Br}): ${t}`,...n)}}function Er(t,...e){if(Ki.logLevel<=oe.WARN){const n=e.map(Lc);Ki.warn(`Firestore (${Br}): ${t}`,...n)}}function Lc(t){if(typeof t=="string")return t;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
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
 */function j(t="Unexpected state"){const e=`FIRESTORE (${Br}) INTERNAL ASSERTION FAILED: `+t;throw Hn(e),new Error(e)}function ge(t,e){t||j()}function J(t,e){return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const M={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class $ extends jn{constructor(e,n){super(e,n),this.code=e,this.message=n,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vn{constructor(){this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ap{constructor(e,n){this.user=n,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class l_{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,n){e.enqueueRetryable(()=>n(ot.UNAUTHENTICATED))}shutdown(){}}class c_{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,n){this.changeListener=n,e.enqueueRetryable(()=>n(this.token.user))}shutdown(){this.changeListener=null}}class u_{constructor(e){this.t=e,this.currentUser=ot.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,n){ge(this.o===void 0);let i=this.i;const r=c=>this.i!==i?(i=this.i,n(c)):Promise.resolve();let s=new Vn;this.o=()=>{this.i++,this.currentUser=this.u(),s.resolve(),s=new Vn,e.enqueueRetryable(()=>r(this.currentUser))};const o=()=>{const c=s;e.enqueueRetryable(async()=>{await c.promise,await r(this.currentUser)})},l=c=>{q("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=c,this.o&&(this.auth.addAuthTokenListener(this.o),o())};this.t.onInit(c=>l(c)),setTimeout(()=>{if(!this.auth){const c=this.t.getImmediate({optional:!0});c?l(c):(q("FirebaseAuthCredentialsProvider","Auth not yet detected"),s.resolve(),s=new Vn)}},0),o()}getToken(){const e=this.i,n=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(n).then(i=>this.i!==e?(q("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):i?(ge(typeof i.accessToken=="string"),new Ap(i.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return ge(e===null||typeof e=="string"),new ot(e)}}class d_{constructor(e,n,i){this.l=e,this.h=n,this.P=i,this.type="FirstParty",this.user=ot.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class h_{constructor(e,n,i){this.l=e,this.h=n,this.P=i}getToken(){return Promise.resolve(new d_(this.l,this.h,this.P))}start(e,n){e.enqueueRetryable(()=>n(ot.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class f_{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class p_{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,n){ge(this.o===void 0);const i=s=>{s.error!=null&&q("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${s.error.message}`);const o=s.token!==this.R;return this.R=s.token,q("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?n(s.token):Promise.resolve()};this.o=s=>{e.enqueueRetryable(()=>i(s))};const r=s=>{q("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=s,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(s=>r(s)),setTimeout(()=>{if(!this.appCheck){const s=this.A.getImmediate({optional:!0});s?r(s):q("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(n=>n?(ge(typeof n.token=="string"),this.R=n.token,new f_(n.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function m_(t){const e=typeof self<"u"&&(self.crypto||self.msCrypto),n=new Uint8Array(t);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(n);else for(let i=0;i<t;i++)n[i]=Math.floor(256*Math.random());return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kp{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=Math.floor(256/e.length)*e.length;let i="";for(;i.length<20;){const r=m_(40);for(let s=0;s<r.length;++s)i.length<20&&r[s]<n&&(i+=e.charAt(r[s]%e.length))}return i}}function he(t,e){return t<e?-1:t>e?1:0}function Tr(t,e,n){return t.length===e.length&&t.every((i,r)=>n(i,e[r]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class He{constructor(e,n){if(this.seconds=e,this.nanoseconds=n,n<0)throw new $(M.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(n>=1e9)throw new $(M.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(e<-62135596800)throw new $(M.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new $(M.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return He.fromMillis(Date.now())}static fromDate(e){return He.fromMillis(e.getTime())}static fromMillis(e){const n=Math.floor(e/1e3),i=Math.floor(1e6*(e-1e3*n));return new He(n,i)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?he(this.nanoseconds,e.nanoseconds):he(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Q{constructor(e){this.timestamp=e}static fromTimestamp(e){return new Q(e)}static min(){return new Q(new He(0,0))}static max(){return new Q(new He(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Is{constructor(e,n,i){n===void 0?n=0:n>e.length&&j(),i===void 0?i=e.length-n:i>e.length-n&&j(),this.segments=e,this.offset=n,this.len=i}get length(){return this.len}isEqual(e){return Is.comparator(this,e)===0}child(e){const n=this.segments.slice(this.offset,this.limit());return e instanceof Is?e.forEach(i=>{n.push(i)}):n.push(e),this.construct(n)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}forEach(e){for(let n=this.offset,i=this.limit();n<i;n++)e(this.segments[n])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,n){const i=Math.min(e.length,n.length);for(let r=0;r<i;r++){const s=e.get(r),o=n.get(r);if(s<o)return-1;if(s>o)return 1}return e.length<n.length?-1:e.length>n.length?1:0}}class Se extends Is{construct(e,n,i){return new Se(e,n,i)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const n=[];for(const i of e){if(i.indexOf("//")>=0)throw new $(M.INVALID_ARGUMENT,`Invalid segment (${i}). Paths must not contain // in them.`);n.push(...i.split("/").filter(r=>r.length>0))}return new Se(n)}static emptyPath(){return new Se([])}}const g_=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Je extends Is{construct(e,n,i){return new Je(e,n,i)}static isValidIdentifier(e){return g_.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Je.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new Je(["__name__"])}static fromServerFormat(e){const n=[];let i="",r=0;const s=()=>{if(i.length===0)throw new $(M.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);n.push(i),i=""};let o=!1;for(;r<e.length;){const l=e[r];if(l==="\\"){if(r+1===e.length)throw new $(M.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const c=e[r+1];if(c!=="\\"&&c!=="."&&c!=="`")throw new $(M.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);i+=c,r+=2}else l==="`"?(o=!o,r++):l!=="."||o?(i+=l,r++):(s(),r++)}if(s(),o)throw new $(M.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new Je(n)}static emptyPath(){return new Je([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class W{constructor(e){this.path=e}static fromPath(e){return new W(Se.fromString(e))}static fromName(e){return new W(Se.fromString(e).popFirst(5))}static empty(){return new W(Se.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&Se.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,n){return Se.comparator(e.path,n.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new W(new Se(e.slice()))}}function y_(t,e){const n=t.toTimestamp().seconds,i=t.toTimestamp().nanoseconds+1,r=Q.fromTimestamp(i===1e9?new He(n+1,0):new He(n,i));return new bi(r,W.empty(),e)}function v_(t){return new bi(t.readTime,t.key,-1)}class bi{constructor(e,n,i){this.readTime=e,this.documentKey=n,this.largestBatchId=i}static min(){return new bi(Q.min(),W.empty(),-1)}static max(){return new bi(Q.max(),W.empty(),-1)}}function b_(t,e){let n=t.readTime.compareTo(e.readTime);return n!==0?n:(n=W.comparator(t.documentKey,e.documentKey),n!==0?n:he(t.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const w_="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class __{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function js(t){if(t.code!==M.FAILED_PRECONDITION||t.message!==w_)throw t;q("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class B{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(n=>{this.isDone=!0,this.result=n,this.nextCallback&&this.nextCallback(n)},n=>{this.isDone=!0,this.error=n,this.catchCallback&&this.catchCallback(n)})}catch(e){return this.next(void 0,e)}next(e,n){return this.callbackAttached&&j(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(n,this.error):this.wrapSuccess(e,this.result):new B((i,r)=>{this.nextCallback=s=>{this.wrapSuccess(e,s).next(i,r)},this.catchCallback=s=>{this.wrapFailure(n,s).next(i,r)}})}toPromise(){return new Promise((e,n)=>{this.next(e,n)})}wrapUserFunction(e){try{const n=e();return n instanceof B?n:B.resolve(n)}catch(n){return B.reject(n)}}wrapSuccess(e,n){return e?this.wrapUserFunction(()=>e(n)):B.resolve(n)}wrapFailure(e,n){return e?this.wrapUserFunction(()=>e(n)):B.reject(n)}static resolve(e){return new B((n,i)=>{n(e)})}static reject(e){return new B((n,i)=>{i(e)})}static waitFor(e){return new B((n,i)=>{let r=0,s=0,o=!1;e.forEach(l=>{++r,l.next(()=>{++s,o&&s===r&&n()},c=>i(c))}),o=!0,s===r&&n()})}static or(e){let n=B.resolve(!1);for(const i of e)n=n.next(r=>r?B.resolve(r):i());return n}static forEach(e,n){const i=[];return e.forEach((r,s)=>{i.push(n.call(this,r,s))}),this.waitFor(i)}static mapArray(e,n){return new B((i,r)=>{const s=e.length,o=new Array(s);let l=0;for(let c=0;c<s;c++){const u=c;n(e[u]).next(f=>{o[u]=f,++l,l===s&&i(o)},f=>r(f))}})}static doWhile(e,n){return new B((i,r)=>{const s=()=>{e()===!0?n().next(()=>{s()},r):i()};s()})}}function E_(t){const e=t.match(/Android ([\d.]+)/i),n=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(n)}function Ks(t){return t.name==="IndexedDbTransactionError"}/**
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
 */class Nc{constructor(e,n){this.previousValue=e,n&&(n.sequenceNumberHandler=i=>this.ie(i),this.se=i=>n.writeSequenceNumber(i))}ie(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.se&&this.se(e),e}}Nc.oe=-1;function Ta(t){return t==null}function na(t){return t===0&&1/t==-1/0}function T_(t){return typeof t=="number"&&Number.isInteger(t)&&!na(t)&&t<=Number.MAX_SAFE_INTEGER&&t>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vh(t){let e=0;for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e++;return e}function er(t,e){for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e(n,t[n])}function Cp(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class De{constructor(e,n){this.comparator=e,this.root=n||Qe.EMPTY}insert(e,n){return new De(this.comparator,this.root.insert(e,n,this.comparator).copy(null,null,Qe.BLACK,null,null))}remove(e){return new De(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Qe.BLACK,null,null))}get(e){let n=this.root;for(;!n.isEmpty();){const i=this.comparator(e,n.key);if(i===0)return n.value;i<0?n=n.left:i>0&&(n=n.right)}return null}indexOf(e){let n=0,i=this.root;for(;!i.isEmpty();){const r=this.comparator(e,i.key);if(r===0)return n+i.left.size;r<0?i=i.left:(n+=i.left.size+1,i=i.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((n,i)=>(e(n,i),!1))}toString(){const e=[];return this.inorderTraversal((n,i)=>(e.push(`${n}:${i}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new ko(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new ko(this.root,e,this.comparator,!1)}getReverseIterator(){return new ko(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new ko(this.root,e,this.comparator,!0)}}class ko{constructor(e,n,i,r){this.isReverse=r,this.nodeStack=[];let s=1;for(;!e.isEmpty();)if(s=n?i(e.key,n):1,n&&r&&(s*=-1),s<0)e=this.isReverse?e.left:e.right;else{if(s===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const n={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return n}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class Qe{constructor(e,n,i,r,s){this.key=e,this.value=n,this.color=i??Qe.RED,this.left=r??Qe.EMPTY,this.right=s??Qe.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,n,i,r,s){return new Qe(e??this.key,n??this.value,i??this.color,r??this.left,s??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,n,i){let r=this;const s=i(e,r.key);return r=s<0?r.copy(null,null,null,r.left.insert(e,n,i),null):s===0?r.copy(null,n,null,null,null):r.copy(null,null,null,null,r.right.insert(e,n,i)),r.fixUp()}removeMin(){if(this.left.isEmpty())return Qe.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,n){let i,r=this;if(n(e,r.key)<0)r.left.isEmpty()||r.left.isRed()||r.left.left.isRed()||(r=r.moveRedLeft()),r=r.copy(null,null,null,r.left.remove(e,n),null);else{if(r.left.isRed()&&(r=r.rotateRight()),r.right.isEmpty()||r.right.isRed()||r.right.left.isRed()||(r=r.moveRedRight()),n(e,r.key)===0){if(r.right.isEmpty())return Qe.EMPTY;i=r.right.min(),r=r.copy(i.key,i.value,null,null,r.right.removeMin())}r=r.copy(null,null,null,null,r.right.remove(e,n))}return r.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Qe.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Qe.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),n=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,n)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw j();const e=this.left.check();if(e!==this.right.check())throw j();return e+(this.isRed()?0:1)}}Qe.EMPTY=null,Qe.RED=!0,Qe.BLACK=!1;Qe.EMPTY=new class{constructor(){this.size=0}get key(){throw j()}get value(){throw j()}get color(){throw j()}get left(){throw j()}get right(){throw j()}copy(e,n,i,r,s){return this}insert(e,n,i){return new Qe(e,n)}remove(e,n){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xe{constructor(e){this.comparator=e,this.data=new De(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((n,i)=>(e(n),!1))}forEachInRange(e,n){const i=this.data.getIteratorFrom(e[0]);for(;i.hasNext();){const r=i.getNext();if(this.comparator(r.key,e[1])>=0)return;n(r.key)}}forEachWhile(e,n){let i;for(i=n!==void 0?this.data.getIteratorFrom(n):this.data.getIterator();i.hasNext();)if(!e(i.getNext().key))return}firstAfterOrEqual(e){const n=this.data.getIteratorFrom(e);return n.hasNext()?n.getNext().key:null}getIterator(){return new bh(this.data.getIterator())}getIteratorFrom(e){return new bh(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let n=this;return n.size<e.size&&(n=e,e=this),e.forEach(i=>{n=n.add(i)}),n}isEqual(e){if(!(e instanceof Xe)||this.size!==e.size)return!1;const n=this.data.getIterator(),i=e.data.getIterator();for(;n.hasNext();){const r=n.getNext().key,s=i.getNext().key;if(this.comparator(r,s)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(n=>{e.push(n)}),e}toString(){const e=[];return this.forEach(n=>e.push(n)),"SortedSet("+e.toString()+")"}copy(e){const n=new Xe(this.comparator);return n.data=e,n}}class bh{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dt{constructor(e){this.fields=e,e.sort(Je.comparator)}static empty(){return new Dt([])}unionWith(e){let n=new Xe(Je.comparator);for(const i of this.fields)n=n.add(i);for(const i of e)n=n.add(i);return new Dt(n.toArray())}covers(e){for(const n of this.fields)if(n.isPrefixOf(e))return!0;return!1}isEqual(e){return Tr(this.fields,e.fields,(n,i)=>n.isEqual(i))}}/**
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
 */class Rp extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class et{constructor(e){this.binaryString=e}static fromBase64String(e){const n=function(r){try{return atob(r)}catch(s){throw typeof DOMException<"u"&&s instanceof DOMException?new Rp("Invalid base64 string: "+s):s}}(e);return new et(n)}static fromUint8Array(e){const n=function(r){let s="";for(let o=0;o<r.length;++o)s+=String.fromCharCode(r[o]);return s}(e);return new et(n)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(n){return btoa(n)}(this.binaryString)}toUint8Array(){return function(n){const i=new Uint8Array(n.length);for(let r=0;r<n.length;r++)i[r]=n.charCodeAt(r);return i}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return he(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}et.EMPTY_BYTE_STRING=new et("");const I_=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function wi(t){if(ge(!!t),typeof t=="string"){let e=0;const n=I_.exec(t);if(ge(!!n),n[1]){let r=n[1];r=(r+"000000000").substr(0,9),e=Number(r)}const i=new Date(t);return{seconds:Math.floor(i.getTime()/1e3),nanos:e}}return{seconds:Fe(t.seconds),nanos:Fe(t.nanos)}}function Fe(t){return typeof t=="number"?t:typeof t=="string"?Number(t):0}function Qi(t){return typeof t=="string"?et.fromBase64String(t):et.fromUint8Array(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Oc(t){var e,n;return((n=(((e=t==null?void 0:t.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||n===void 0?void 0:n.stringValue)==="server_timestamp"}function Fc(t){const e=t.mapValue.fields.__previous_value__;return Oc(e)?Fc(e):e}function Ss(t){const e=wi(t.mapValue.fields.__local_write_time__.timestampValue);return new He(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class S_{constructor(e,n,i,r,s,o,l,c,u){this.databaseId=e,this.appId=n,this.persistenceKey=i,this.host=r,this.ssl=s,this.forceLongPolling=o,this.autoDetectLongPolling=l,this.longPollingOptions=c,this.useFetchStreams=u}}class xs{constructor(e,n){this.projectId=e,this.database=n||"(default)"}static empty(){return new xs("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof xs&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Co={mapValue:{}};function Ji(t){return"nullValue"in t?0:"booleanValue"in t?1:"integerValue"in t||"doubleValue"in t?2:"timestampValue"in t?3:"stringValue"in t?5:"bytesValue"in t?6:"referenceValue"in t?7:"geoPointValue"in t?8:"arrayValue"in t?9:"mapValue"in t?Oc(t)?4:A_(t)?9007199254740991:x_(t)?10:11:j()}function mn(t,e){if(t===e)return!0;const n=Ji(t);if(n!==Ji(e))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return t.booleanValue===e.booleanValue;case 4:return Ss(t).isEqual(Ss(e));case 3:return function(r,s){if(typeof r.timestampValue=="string"&&typeof s.timestampValue=="string"&&r.timestampValue.length===s.timestampValue.length)return r.timestampValue===s.timestampValue;const o=wi(r.timestampValue),l=wi(s.timestampValue);return o.seconds===l.seconds&&o.nanos===l.nanos}(t,e);case 5:return t.stringValue===e.stringValue;case 6:return function(r,s){return Qi(r.bytesValue).isEqual(Qi(s.bytesValue))}(t,e);case 7:return t.referenceValue===e.referenceValue;case 8:return function(r,s){return Fe(r.geoPointValue.latitude)===Fe(s.geoPointValue.latitude)&&Fe(r.geoPointValue.longitude)===Fe(s.geoPointValue.longitude)}(t,e);case 2:return function(r,s){if("integerValue"in r&&"integerValue"in s)return Fe(r.integerValue)===Fe(s.integerValue);if("doubleValue"in r&&"doubleValue"in s){const o=Fe(r.doubleValue),l=Fe(s.doubleValue);return o===l?na(o)===na(l):isNaN(o)&&isNaN(l)}return!1}(t,e);case 9:return Tr(t.arrayValue.values||[],e.arrayValue.values||[],mn);case 10:case 11:return function(r,s){const o=r.mapValue.fields||{},l=s.mapValue.fields||{};if(vh(o)!==vh(l))return!1;for(const c in o)if(o.hasOwnProperty(c)&&(l[c]===void 0||!mn(o[c],l[c])))return!1;return!0}(t,e);default:return j()}}function As(t,e){return(t.values||[]).find(n=>mn(n,e))!==void 0}function Ir(t,e){if(t===e)return 0;const n=Ji(t),i=Ji(e);if(n!==i)return he(n,i);switch(n){case 0:case 9007199254740991:return 0;case 1:return he(t.booleanValue,e.booleanValue);case 2:return function(s,o){const l=Fe(s.integerValue||s.doubleValue),c=Fe(o.integerValue||o.doubleValue);return l<c?-1:l>c?1:l===c?0:isNaN(l)?isNaN(c)?0:-1:1}(t,e);case 3:return wh(t.timestampValue,e.timestampValue);case 4:return wh(Ss(t),Ss(e));case 5:return he(t.stringValue,e.stringValue);case 6:return function(s,o){const l=Qi(s),c=Qi(o);return l.compareTo(c)}(t.bytesValue,e.bytesValue);case 7:return function(s,o){const l=s.split("/"),c=o.split("/");for(let u=0;u<l.length&&u<c.length;u++){const f=he(l[u],c[u]);if(f!==0)return f}return he(l.length,c.length)}(t.referenceValue,e.referenceValue);case 8:return function(s,o){const l=he(Fe(s.latitude),Fe(o.latitude));return l!==0?l:he(Fe(s.longitude),Fe(o.longitude))}(t.geoPointValue,e.geoPointValue);case 9:return _h(t.arrayValue,e.arrayValue);case 10:return function(s,o){var l,c,u,f;const m=s.fields||{},p=o.fields||{},w=(l=m.value)===null||l===void 0?void 0:l.arrayValue,I=(c=p.value)===null||c===void 0?void 0:c.arrayValue,S=he(((u=w==null?void 0:w.values)===null||u===void 0?void 0:u.length)||0,((f=I==null?void 0:I.values)===null||f===void 0?void 0:f.length)||0);return S!==0?S:_h(w,I)}(t.mapValue,e.mapValue);case 11:return function(s,o){if(s===Co.mapValue&&o===Co.mapValue)return 0;if(s===Co.mapValue)return 1;if(o===Co.mapValue)return-1;const l=s.fields||{},c=Object.keys(l),u=o.fields||{},f=Object.keys(u);c.sort(),f.sort();for(let m=0;m<c.length&&m<f.length;++m){const p=he(c[m],f[m]);if(p!==0)return p;const w=Ir(l[c[m]],u[f[m]]);if(w!==0)return w}return he(c.length,f.length)}(t.mapValue,e.mapValue);default:throw j()}}function wh(t,e){if(typeof t=="string"&&typeof e=="string"&&t.length===e.length)return he(t,e);const n=wi(t),i=wi(e),r=he(n.seconds,i.seconds);return r!==0?r:he(n.nanos,i.nanos)}function _h(t,e){const n=t.values||[],i=e.values||[];for(let r=0;r<n.length&&r<i.length;++r){const s=Ir(n[r],i[r]);if(s)return s}return he(n.length,i.length)}function Sr(t){return Ol(t)}function Ol(t){return"nullValue"in t?"null":"booleanValue"in t?""+t.booleanValue:"integerValue"in t?""+t.integerValue:"doubleValue"in t?""+t.doubleValue:"timestampValue"in t?function(n){const i=wi(n);return`time(${i.seconds},${i.nanos})`}(t.timestampValue):"stringValue"in t?t.stringValue:"bytesValue"in t?function(n){return Qi(n).toBase64()}(t.bytesValue):"referenceValue"in t?function(n){return W.fromName(n).toString()}(t.referenceValue):"geoPointValue"in t?function(n){return`geo(${n.latitude},${n.longitude})`}(t.geoPointValue):"arrayValue"in t?function(n){let i="[",r=!0;for(const s of n.values||[])r?r=!1:i+=",",i+=Ol(s);return i+"]"}(t.arrayValue):"mapValue"in t?function(n){const i=Object.keys(n.fields||{}).sort();let r="{",s=!0;for(const o of i)s?s=!1:r+=",",r+=`${o}:${Ol(n.fields[o])}`;return r+"}"}(t.mapValue):j()}function Eh(t,e){return{referenceValue:`projects/${t.projectId}/databases/${t.database}/documents/${e.path.canonicalString()}`}}function Fl(t){return!!t&&"integerValue"in t}function Vc(t){return!!t&&"arrayValue"in t}function Th(t){return!!t&&"nullValue"in t}function Ih(t){return!!t&&"doubleValue"in t&&isNaN(Number(t.doubleValue))}function Oo(t){return!!t&&"mapValue"in t}function x_(t){var e,n;return((n=(((e=t==null?void 0:t.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||n===void 0?void 0:n.stringValue)==="__vector__"}function ps(t){if(t.geoPointValue)return{geoPointValue:Object.assign({},t.geoPointValue)};if(t.timestampValue&&typeof t.timestampValue=="object")return{timestampValue:Object.assign({},t.timestampValue)};if(t.mapValue){const e={mapValue:{fields:{}}};return er(t.mapValue.fields,(n,i)=>e.mapValue.fields[n]=ps(i)),e}if(t.arrayValue){const e={arrayValue:{values:[]}};for(let n=0;n<(t.arrayValue.values||[]).length;++n)e.arrayValue.values[n]=ps(t.arrayValue.values[n]);return e}return Object.assign({},t)}function A_(t){return(((t.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class St{constructor(e){this.value=e}static empty(){return new St({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let n=this.value;for(let i=0;i<e.length-1;++i)if(n=(n.mapValue.fields||{})[e.get(i)],!Oo(n))return null;return n=(n.mapValue.fields||{})[e.lastSegment()],n||null}}set(e,n){this.getFieldsMap(e.popLast())[e.lastSegment()]=ps(n)}setAll(e){let n=Je.emptyPath(),i={},r=[];e.forEach((o,l)=>{if(!n.isImmediateParentOf(l)){const c=this.getFieldsMap(n);this.applyChanges(c,i,r),i={},r=[],n=l.popLast()}o?i[l.lastSegment()]=ps(o):r.push(l.lastSegment())});const s=this.getFieldsMap(n);this.applyChanges(s,i,r)}delete(e){const n=this.field(e.popLast());Oo(n)&&n.mapValue.fields&&delete n.mapValue.fields[e.lastSegment()]}isEqual(e){return mn(this.value,e.value)}getFieldsMap(e){let n=this.value;n.mapValue.fields||(n.mapValue={fields:{}});for(let i=0;i<e.length;++i){let r=n.mapValue.fields[e.get(i)];Oo(r)&&r.mapValue.fields||(r={mapValue:{fields:{}}},n.mapValue.fields[e.get(i)]=r),n=r}return n.mapValue.fields}applyChanges(e,n,i){er(n,(r,s)=>e[r]=s);for(const r of i)delete e[r]}clone(){return new St(ps(this.value))}}function Pp(t){const e=[];return er(t.fields,(n,i)=>{const r=new Je([n]);if(Oo(i)){const s=Pp(i.mapValue).fields;if(s.length===0)e.push(r);else for(const o of s)e.push(r.child(o))}else e.push(r)}),new Dt(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class at{constructor(e,n,i,r,s,o,l){this.key=e,this.documentType=n,this.version=i,this.readTime=r,this.createTime=s,this.data=o,this.documentState=l}static newInvalidDocument(e){return new at(e,0,Q.min(),Q.min(),Q.min(),St.empty(),0)}static newFoundDocument(e,n,i,r){return new at(e,1,n,Q.min(),i,r,0)}static newNoDocument(e,n){return new at(e,2,n,Q.min(),Q.min(),St.empty(),0)}static newUnknownDocument(e,n){return new at(e,3,n,Q.min(),Q.min(),St.empty(),2)}convertToFoundDocument(e,n){return!this.createTime.isEqual(Q.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=n,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=St.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=St.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=Q.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof at&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new at(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class ia{constructor(e,n){this.position=e,this.inclusive=n}}function Sh(t,e,n){let i=0;for(let r=0;r<t.position.length;r++){const s=e[r],o=t.position[r];if(s.field.isKeyField()?i=W.comparator(W.fromName(o.referenceValue),n.key):i=Ir(o,n.data.field(s.field)),s.dir==="desc"&&(i*=-1),i!==0)break}return i}function xh(t,e){if(t===null)return e===null;if(e===null||t.inclusive!==e.inclusive||t.position.length!==e.position.length)return!1;for(let n=0;n<t.position.length;n++)if(!mn(t.position[n],e.position[n]))return!1;return!0}/**
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
 */class ks{constructor(e,n="asc"){this.field=e,this.dir=n}}function k_(t,e){return t.dir===e.dir&&t.field.isEqual(e.field)}/**
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
 */class Mp{}class $e extends Mp{constructor(e,n,i){super(),this.field=e,this.op=n,this.value=i}static create(e,n,i){return e.isKeyField()?n==="in"||n==="not-in"?this.createKeyFieldInFilter(e,n,i):new R_(e,n,i):n==="array-contains"?new D_(e,i):n==="in"?new B_(e,i):n==="not-in"?new L_(e,i):n==="array-contains-any"?new N_(e,i):new $e(e,n,i)}static createKeyFieldInFilter(e,n,i){return n==="in"?new P_(e,i):new M_(e,i)}matches(e){const n=e.data.field(this.field);return this.op==="!="?n!==null&&this.matchesComparison(Ir(n,this.value)):n!==null&&Ji(this.value)===Ji(n)&&this.matchesComparison(Ir(n,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return j()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class en extends Mp{constructor(e,n){super(),this.filters=e,this.op=n,this.ae=null}static create(e,n){return new en(e,n)}matches(e){return Dp(this)?this.filters.find(n=>!n.matches(e))===void 0:this.filters.find(n=>n.matches(e))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce((e,n)=>e.concat(n.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function Dp(t){return t.op==="and"}function Bp(t){return C_(t)&&Dp(t)}function C_(t){for(const e of t.filters)if(e instanceof en)return!1;return!0}function Vl(t){if(t instanceof $e)return t.field.canonicalString()+t.op.toString()+Sr(t.value);if(Bp(t))return t.filters.map(e=>Vl(e)).join(",");{const e=t.filters.map(n=>Vl(n)).join(",");return`${t.op}(${e})`}}function Lp(t,e){return t instanceof $e?function(i,r){return r instanceof $e&&i.op===r.op&&i.field.isEqual(r.field)&&mn(i.value,r.value)}(t,e):t instanceof en?function(i,r){return r instanceof en&&i.op===r.op&&i.filters.length===r.filters.length?i.filters.reduce((s,o,l)=>s&&Lp(o,r.filters[l]),!0):!1}(t,e):void j()}function Np(t){return t instanceof $e?function(n){return`${n.field.canonicalString()} ${n.op} ${Sr(n.value)}`}(t):t instanceof en?function(n){return n.op.toString()+" {"+n.getFilters().map(Np).join(" ,")+"}"}(t):"Filter"}class R_ extends $e{constructor(e,n,i){super(e,n,i),this.key=W.fromName(i.referenceValue)}matches(e){const n=W.comparator(e.key,this.key);return this.matchesComparison(n)}}class P_ extends $e{constructor(e,n){super(e,"in",n),this.keys=Op("in",n)}matches(e){return this.keys.some(n=>n.isEqual(e.key))}}class M_ extends $e{constructor(e,n){super(e,"not-in",n),this.keys=Op("not-in",n)}matches(e){return!this.keys.some(n=>n.isEqual(e.key))}}function Op(t,e){var n;return(((n=e.arrayValue)===null||n===void 0?void 0:n.values)||[]).map(i=>W.fromName(i.referenceValue))}class D_ extends $e{constructor(e,n){super(e,"array-contains",n)}matches(e){const n=e.data.field(this.field);return Vc(n)&&As(n.arrayValue,this.value)}}class B_ extends $e{constructor(e,n){super(e,"in",n)}matches(e){const n=e.data.field(this.field);return n!==null&&As(this.value.arrayValue,n)}}class L_ extends $e{constructor(e,n){super(e,"not-in",n)}matches(e){if(As(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const n=e.data.field(this.field);return n!==null&&!As(this.value.arrayValue,n)}}class N_ extends $e{constructor(e,n){super(e,"array-contains-any",n)}matches(e){const n=e.data.field(this.field);return!(!Vc(n)||!n.arrayValue.values)&&n.arrayValue.values.some(i=>As(this.value.arrayValue,i))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class O_{constructor(e,n=null,i=[],r=[],s=null,o=null,l=null){this.path=e,this.collectionGroup=n,this.orderBy=i,this.filters=r,this.limit=s,this.startAt=o,this.endAt=l,this.ue=null}}function Ah(t,e=null,n=[],i=[],r=null,s=null,o=null){return new O_(t,e,n,i,r,s,o)}function zc(t){const e=J(t);if(e.ue===null){let n=e.path.canonicalString();e.collectionGroup!==null&&(n+="|cg:"+e.collectionGroup),n+="|f:",n+=e.filters.map(i=>Vl(i)).join(","),n+="|ob:",n+=e.orderBy.map(i=>function(s){return s.field.canonicalString()+s.dir}(i)).join(","),Ta(e.limit)||(n+="|l:",n+=e.limit),e.startAt&&(n+="|lb:",n+=e.startAt.inclusive?"b:":"a:",n+=e.startAt.position.map(i=>Sr(i)).join(",")),e.endAt&&(n+="|ub:",n+=e.endAt.inclusive?"a:":"b:",n+=e.endAt.position.map(i=>Sr(i)).join(",")),e.ue=n}return e.ue}function $c(t,e){if(t.limit!==e.limit||t.orderBy.length!==e.orderBy.length)return!1;for(let n=0;n<t.orderBy.length;n++)if(!k_(t.orderBy[n],e.orderBy[n]))return!1;if(t.filters.length!==e.filters.length)return!1;for(let n=0;n<t.filters.length;n++)if(!Lp(t.filters[n],e.filters[n]))return!1;return t.collectionGroup===e.collectionGroup&&!!t.path.isEqual(e.path)&&!!xh(t.startAt,e.startAt)&&xh(t.endAt,e.endAt)}function zl(t){return W.isDocumentKey(t.path)&&t.collectionGroup===null&&t.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lr{constructor(e,n=null,i=[],r=[],s=null,o="F",l=null,c=null){this.path=e,this.collectionGroup=n,this.explicitOrderBy=i,this.filters=r,this.limit=s,this.limitType=o,this.startAt=l,this.endAt=c,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function F_(t,e,n,i,r,s,o,l){return new Lr(t,e,n,i,r,s,o,l)}function Uc(t){return new Lr(t)}function kh(t){return t.filters.length===0&&t.limit===null&&t.startAt==null&&t.endAt==null&&(t.explicitOrderBy.length===0||t.explicitOrderBy.length===1&&t.explicitOrderBy[0].field.isKeyField())}function Fp(t){return t.collectionGroup!==null}function ms(t){const e=J(t);if(e.ce===null){e.ce=[];const n=new Set;for(const s of e.explicitOrderBy)e.ce.push(s),n.add(s.field.canonicalString());const i=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let l=new Xe(Je.comparator);return o.filters.forEach(c=>{c.getFlattenedFilters().forEach(u=>{u.isInequality()&&(l=l.add(u.field))})}),l})(e).forEach(s=>{n.has(s.canonicalString())||s.isKeyField()||e.ce.push(new ks(s,i))}),n.has(Je.keyField().canonicalString())||e.ce.push(new ks(Je.keyField(),i))}return e.ce}function fn(t){const e=J(t);return e.le||(e.le=V_(e,ms(t))),e.le}function V_(t,e){if(t.limitType==="F")return Ah(t.path,t.collectionGroup,e,t.filters,t.limit,t.startAt,t.endAt);{e=e.map(r=>{const s=r.dir==="desc"?"asc":"desc";return new ks(r.field,s)});const n=t.endAt?new ia(t.endAt.position,t.endAt.inclusive):null,i=t.startAt?new ia(t.startAt.position,t.startAt.inclusive):null;return Ah(t.path,t.collectionGroup,e,t.filters,t.limit,n,i)}}function $l(t,e){const n=t.filters.concat([e]);return new Lr(t.path,t.collectionGroup,t.explicitOrderBy.slice(),n,t.limit,t.limitType,t.startAt,t.endAt)}function ra(t,e,n){return new Lr(t.path,t.collectionGroup,t.explicitOrderBy.slice(),t.filters.slice(),e,n,t.startAt,t.endAt)}function Ia(t,e){return $c(fn(t),fn(e))&&t.limitType===e.limitType}function Vp(t){return`${zc(fn(t))}|lt:${t.limitType}`}function cr(t){return`Query(target=${function(n){let i=n.path.canonicalString();return n.collectionGroup!==null&&(i+=" collectionGroup="+n.collectionGroup),n.filters.length>0&&(i+=`, filters: [${n.filters.map(r=>Np(r)).join(", ")}]`),Ta(n.limit)||(i+=", limit: "+n.limit),n.orderBy.length>0&&(i+=`, orderBy: [${n.orderBy.map(r=>function(o){return`${o.field.canonicalString()} (${o.dir})`}(r)).join(", ")}]`),n.startAt&&(i+=", startAt: ",i+=n.startAt.inclusive?"b:":"a:",i+=n.startAt.position.map(r=>Sr(r)).join(",")),n.endAt&&(i+=", endAt: ",i+=n.endAt.inclusive?"a:":"b:",i+=n.endAt.position.map(r=>Sr(r)).join(",")),`Target(${i})`}(fn(t))}; limitType=${t.limitType})`}function Sa(t,e){return e.isFoundDocument()&&function(i,r){const s=r.key.path;return i.collectionGroup!==null?r.key.hasCollectionId(i.collectionGroup)&&i.path.isPrefixOf(s):W.isDocumentKey(i.path)?i.path.isEqual(s):i.path.isImmediateParentOf(s)}(t,e)&&function(i,r){for(const s of ms(i))if(!s.field.isKeyField()&&r.data.field(s.field)===null)return!1;return!0}(t,e)&&function(i,r){for(const s of i.filters)if(!s.matches(r))return!1;return!0}(t,e)&&function(i,r){return!(i.startAt&&!function(o,l,c){const u=Sh(o,l,c);return o.inclusive?u<=0:u<0}(i.startAt,ms(i),r)||i.endAt&&!function(o,l,c){const u=Sh(o,l,c);return o.inclusive?u>=0:u>0}(i.endAt,ms(i),r))}(t,e)}function z_(t){return t.collectionGroup||(t.path.length%2==1?t.path.lastSegment():t.path.get(t.path.length-2))}function zp(t){return(e,n)=>{let i=!1;for(const r of ms(t)){const s=$_(r,e,n);if(s!==0)return s;i=i||r.field.isKeyField()}return 0}}function $_(t,e,n){const i=t.field.isKeyField()?W.comparator(e.key,n.key):function(s,o,l){const c=o.data.field(s),u=l.data.field(s);return c!==null&&u!==null?Ir(c,u):j()}(t.field,e,n);switch(t.dir){case"asc":return i;case"desc":return-1*i;default:return j()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nr{constructor(e,n){this.mapKeyFn=e,this.equalsFn=n,this.inner={},this.innerSize=0}get(e){const n=this.mapKeyFn(e),i=this.inner[n];if(i!==void 0){for(const[r,s]of i)if(this.equalsFn(r,e))return s}}has(e){return this.get(e)!==void 0}set(e,n){const i=this.mapKeyFn(e),r=this.inner[i];if(r===void 0)return this.inner[i]=[[e,n]],void this.innerSize++;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],e))return void(r[s]=[e,n]);r.push([e,n]),this.innerSize++}delete(e){const n=this.mapKeyFn(e),i=this.inner[n];if(i===void 0)return!1;for(let r=0;r<i.length;r++)if(this.equalsFn(i[r][0],e))return i.length===1?delete this.inner[n]:i.splice(r,1),this.innerSize--,!0;return!1}forEach(e){er(this.inner,(n,i)=>{for(const[r,s]of i)e(r,s)})}isEmpty(){return Cp(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const U_=new De(W.comparator);function Wn(){return U_}const $p=new De(W.comparator);function ls(...t){let e=$p;for(const n of t)e=e.insert(n.key,n);return e}function Up(t){let e=$p;return t.forEach((n,i)=>e=e.insert(n,i.overlayedDocument)),e}function Fi(){return gs()}function qp(){return gs()}function gs(){return new Nr(t=>t.toString(),(t,e)=>t.isEqual(e))}const q_=new De(W.comparator),H_=new Xe(W.comparator);function re(...t){let e=H_;for(const n of t)e=e.add(n);return e}const W_=new Xe(he);function G_(){return W_}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qc(t,e){if(t.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:na(e)?"-0":e}}function Hp(t){return{integerValue:""+t}}function Y_(t,e){return T_(e)?Hp(e):qc(t,e)}/**
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
 */class xa{constructor(){this._=void 0}}function j_(t,e,n){return t instanceof Cs?function(r,s){const o={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:r.seconds,nanos:r.nanoseconds}}}};return s&&Oc(s)&&(s=Fc(s)),s&&(o.fields.__previous_value__=s),{mapValue:o}}(n,e):t instanceof Rs?Gp(t,e):t instanceof Ps?Yp(t,e):function(r,s){const o=Wp(r,s),l=Ch(o)+Ch(r.Pe);return Fl(o)&&Fl(r.Pe)?Hp(l):qc(r.serializer,l)}(t,e)}function K_(t,e,n){return t instanceof Rs?Gp(t,e):t instanceof Ps?Yp(t,e):n}function Wp(t,e){return t instanceof sa?function(i){return Fl(i)||function(s){return!!s&&"doubleValue"in s}(i)}(e)?e:{integerValue:0}:null}class Cs extends xa{}class Rs extends xa{constructor(e){super(),this.elements=e}}function Gp(t,e){const n=jp(e);for(const i of t.elements)n.some(r=>mn(r,i))||n.push(i);return{arrayValue:{values:n}}}class Ps extends xa{constructor(e){super(),this.elements=e}}function Yp(t,e){let n=jp(e);for(const i of t.elements)n=n.filter(r=>!mn(r,i));return{arrayValue:{values:n}}}class sa extends xa{constructor(e,n){super(),this.serializer=e,this.Pe=n}}function Ch(t){return Fe(t.integerValue||t.doubleValue)}function jp(t){return Vc(t)&&t.arrayValue.values?t.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Q_{constructor(e,n){this.field=e,this.transform=n}}function J_(t,e){return t.field.isEqual(e.field)&&function(i,r){return i instanceof Rs&&r instanceof Rs||i instanceof Ps&&r instanceof Ps?Tr(i.elements,r.elements,mn):i instanceof sa&&r instanceof sa?mn(i.Pe,r.Pe):i instanceof Cs&&r instanceof Cs}(t.transform,e.transform)}class X_{constructor(e,n){this.version=e,this.transformResults=n}}class wt{constructor(e,n){this.updateTime=e,this.exists=n}static none(){return new wt}static exists(e){return new wt(void 0,e)}static updateTime(e){return new wt(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Fo(t,e){return t.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(t.updateTime):t.exists===void 0||t.exists===e.isFoundDocument()}class Aa{}function Kp(t,e){if(!t.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return t.isNoDocument()?new ka(t.key,wt.none()):new Qs(t.key,t.data,wt.none());{const n=t.data,i=St.empty();let r=new Xe(Je.comparator);for(let s of e.fields)if(!r.has(s)){let o=n.field(s);o===null&&s.length>1&&(s=s.popLast(),o=n.field(s)),o===null?i.delete(s):i.set(s,o),r=r.add(s)}return new Ii(t.key,i,new Dt(r.toArray()),wt.none())}}function Z_(t,e,n){t instanceof Qs?function(r,s,o){const l=r.value.clone(),c=Ph(r.fieldTransforms,s,o.transformResults);l.setAll(c),s.convertToFoundDocument(o.version,l).setHasCommittedMutations()}(t,e,n):t instanceof Ii?function(r,s,o){if(!Fo(r.precondition,s))return void s.convertToUnknownDocument(o.version);const l=Ph(r.fieldTransforms,s,o.transformResults),c=s.data;c.setAll(Qp(r)),c.setAll(l),s.convertToFoundDocument(o.version,c).setHasCommittedMutations()}(t,e,n):function(r,s,o){s.convertToNoDocument(o.version).setHasCommittedMutations()}(0,e,n)}function ys(t,e,n,i){return t instanceof Qs?function(s,o,l,c){if(!Fo(s.precondition,o))return l;const u=s.value.clone(),f=Mh(s.fieldTransforms,c,o);return u.setAll(f),o.convertToFoundDocument(o.version,u).setHasLocalMutations(),null}(t,e,n,i):t instanceof Ii?function(s,o,l,c){if(!Fo(s.precondition,o))return l;const u=Mh(s.fieldTransforms,c,o),f=o.data;return f.setAll(Qp(s)),f.setAll(u),o.convertToFoundDocument(o.version,f).setHasLocalMutations(),l===null?null:l.unionWith(s.fieldMask.fields).unionWith(s.fieldTransforms.map(m=>m.field))}(t,e,n,i):function(s,o,l){return Fo(s.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):l}(t,e,n)}function eE(t,e){let n=null;for(const i of t.fieldTransforms){const r=e.data.field(i.field),s=Wp(i.transform,r||null);s!=null&&(n===null&&(n=St.empty()),n.set(i.field,s))}return n||null}function Rh(t,e){return t.type===e.type&&!!t.key.isEqual(e.key)&&!!t.precondition.isEqual(e.precondition)&&!!function(i,r){return i===void 0&&r===void 0||!(!i||!r)&&Tr(i,r,(s,o)=>J_(s,o))}(t.fieldTransforms,e.fieldTransforms)&&(t.type===0?t.value.isEqual(e.value):t.type!==1||t.data.isEqual(e.data)&&t.fieldMask.isEqual(e.fieldMask))}class Qs extends Aa{constructor(e,n,i,r=[]){super(),this.key=e,this.value=n,this.precondition=i,this.fieldTransforms=r,this.type=0}getFieldMask(){return null}}class Ii extends Aa{constructor(e,n,i,r,s=[]){super(),this.key=e,this.data=n,this.fieldMask=i,this.precondition=r,this.fieldTransforms=s,this.type=1}getFieldMask(){return this.fieldMask}}function Qp(t){const e=new Map;return t.fieldMask.fields.forEach(n=>{if(!n.isEmpty()){const i=t.data.field(n);e.set(n,i)}}),e}function Ph(t,e,n){const i=new Map;ge(t.length===n.length);for(let r=0;r<n.length;r++){const s=t[r],o=s.transform,l=e.data.field(s.field);i.set(s.field,K_(o,l,n[r]))}return i}function Mh(t,e,n){const i=new Map;for(const r of t){const s=r.transform,o=n.data.field(r.field);i.set(r.field,j_(s,o,e))}return i}class ka extends Aa{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class tE extends Aa{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nE{constructor(e,n,i,r){this.batchId=e,this.localWriteTime=n,this.baseMutations=i,this.mutations=r}applyToRemoteDocument(e,n){const i=n.mutationResults;for(let r=0;r<this.mutations.length;r++){const s=this.mutations[r];s.key.isEqual(e.key)&&Z_(s,e,i[r])}}applyToLocalView(e,n){for(const i of this.baseMutations)i.key.isEqual(e.key)&&(n=ys(i,e,n,this.localWriteTime));for(const i of this.mutations)i.key.isEqual(e.key)&&(n=ys(i,e,n,this.localWriteTime));return n}applyToLocalDocumentSet(e,n){const i=qp();return this.mutations.forEach(r=>{const s=e.get(r.key),o=s.overlayedDocument;let l=this.applyToLocalView(o,s.mutatedFields);l=n.has(r.key)?null:l;const c=Kp(o,l);c!==null&&i.set(r.key,c),o.isValidDocument()||o.convertToNoDocument(Q.min())}),i}keys(){return this.mutations.reduce((e,n)=>e.add(n.key),re())}isEqual(e){return this.batchId===e.batchId&&Tr(this.mutations,e.mutations,(n,i)=>Rh(n,i))&&Tr(this.baseMutations,e.baseMutations,(n,i)=>Rh(n,i))}}class Hc{constructor(e,n,i,r){this.batch=e,this.commitVersion=n,this.mutationResults=i,this.docVersions=r}static from(e,n,i){ge(e.mutations.length===i.length);let r=function(){return q_}();const s=e.mutations;for(let o=0;o<s.length;o++)r=r.insert(s[o].key,i[o].version);return new Hc(e,n,i,r)}}/**
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
 */class iE{constructor(e,n){this.largestBatchId=e,this.mutation=n}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
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
 */class rE{constructor(e,n){this.count=e,this.unchangedNames=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ze,ae;function sE(t){switch(t){default:return j();case M.CANCELLED:case M.UNKNOWN:case M.DEADLINE_EXCEEDED:case M.RESOURCE_EXHAUSTED:case M.INTERNAL:case M.UNAVAILABLE:case M.UNAUTHENTICATED:return!1;case M.INVALID_ARGUMENT:case M.NOT_FOUND:case M.ALREADY_EXISTS:case M.PERMISSION_DENIED:case M.FAILED_PRECONDITION:case M.ABORTED:case M.OUT_OF_RANGE:case M.UNIMPLEMENTED:case M.DATA_LOSS:return!0}}function Jp(t){if(t===void 0)return Hn("GRPC error has no .code"),M.UNKNOWN;switch(t){case ze.OK:return M.OK;case ze.CANCELLED:return M.CANCELLED;case ze.UNKNOWN:return M.UNKNOWN;case ze.DEADLINE_EXCEEDED:return M.DEADLINE_EXCEEDED;case ze.RESOURCE_EXHAUSTED:return M.RESOURCE_EXHAUSTED;case ze.INTERNAL:return M.INTERNAL;case ze.UNAVAILABLE:return M.UNAVAILABLE;case ze.UNAUTHENTICATED:return M.UNAUTHENTICATED;case ze.INVALID_ARGUMENT:return M.INVALID_ARGUMENT;case ze.NOT_FOUND:return M.NOT_FOUND;case ze.ALREADY_EXISTS:return M.ALREADY_EXISTS;case ze.PERMISSION_DENIED:return M.PERMISSION_DENIED;case ze.FAILED_PRECONDITION:return M.FAILED_PRECONDITION;case ze.ABORTED:return M.ABORTED;case ze.OUT_OF_RANGE:return M.OUT_OF_RANGE;case ze.UNIMPLEMENTED:return M.UNIMPLEMENTED;case ze.DATA_LOSS:return M.DATA_LOSS;default:return j()}}(ae=ze||(ze={}))[ae.OK=0]="OK",ae[ae.CANCELLED=1]="CANCELLED",ae[ae.UNKNOWN=2]="UNKNOWN",ae[ae.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",ae[ae.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",ae[ae.NOT_FOUND=5]="NOT_FOUND",ae[ae.ALREADY_EXISTS=6]="ALREADY_EXISTS",ae[ae.PERMISSION_DENIED=7]="PERMISSION_DENIED",ae[ae.UNAUTHENTICATED=16]="UNAUTHENTICATED",ae[ae.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",ae[ae.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",ae[ae.ABORTED=10]="ABORTED",ae[ae.OUT_OF_RANGE=11]="OUT_OF_RANGE",ae[ae.UNIMPLEMENTED=12]="UNIMPLEMENTED",ae[ae.INTERNAL=13]="INTERNAL",ae[ae.UNAVAILABLE=14]="UNAVAILABLE",ae[ae.DATA_LOSS=15]="DATA_LOSS";/**
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
 */function oE(){return new TextEncoder}/**
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
 */const aE=new Ui([4294967295,4294967295],0);function Dh(t){const e=oE().encode(t),n=new _p;return n.update(e),new Uint8Array(n.digest())}function Bh(t){const e=new DataView(t.buffer),n=e.getUint32(0,!0),i=e.getUint32(4,!0),r=e.getUint32(8,!0),s=e.getUint32(12,!0);return[new Ui([n,i],0),new Ui([r,s],0)]}class Wc{constructor(e,n,i){if(this.bitmap=e,this.padding=n,this.hashCount=i,n<0||n>=8)throw new cs(`Invalid padding: ${n}`);if(i<0)throw new cs(`Invalid hash count: ${i}`);if(e.length>0&&this.hashCount===0)throw new cs(`Invalid hash count: ${i}`);if(e.length===0&&n!==0)throw new cs(`Invalid padding when bitmap length is 0: ${n}`);this.Ie=8*e.length-n,this.Te=Ui.fromNumber(this.Ie)}Ee(e,n,i){let r=e.add(n.multiply(Ui.fromNumber(i)));return r.compare(aE)===1&&(r=new Ui([r.getBits(0),r.getBits(1)],0)),r.modulo(this.Te).toNumber()}de(e){return(this.bitmap[Math.floor(e/8)]&1<<e%8)!=0}mightContain(e){if(this.Ie===0)return!1;const n=Dh(e),[i,r]=Bh(n);for(let s=0;s<this.hashCount;s++){const o=this.Ee(i,r,s);if(!this.de(o))return!1}return!0}static create(e,n,i){const r=e%8==0?0:8-e%8,s=new Uint8Array(Math.ceil(e/8)),o=new Wc(s,r,n);return i.forEach(l=>o.insert(l)),o}insert(e){if(this.Ie===0)return;const n=Dh(e),[i,r]=Bh(n);for(let s=0;s<this.hashCount;s++){const o=this.Ee(i,r,s);this.Ae(o)}}Ae(e){const n=Math.floor(e/8),i=e%8;this.bitmap[n]|=1<<i}}class cs extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ca{constructor(e,n,i,r,s){this.snapshotVersion=e,this.targetChanges=n,this.targetMismatches=i,this.documentUpdates=r,this.resolvedLimboDocuments=s}static createSynthesizedRemoteEventForCurrentChange(e,n,i){const r=new Map;return r.set(e,Js.createSynthesizedTargetChangeForCurrentChange(e,n,i)),new Ca(Q.min(),r,new De(he),Wn(),re())}}class Js{constructor(e,n,i,r,s){this.resumeToken=e,this.current=n,this.addedDocuments=i,this.modifiedDocuments=r,this.removedDocuments=s}static createSynthesizedTargetChangeForCurrentChange(e,n,i){return new Js(i,n,re(),re(),re())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vo{constructor(e,n,i,r){this.Re=e,this.removedTargetIds=n,this.key=i,this.Ve=r}}class Xp{constructor(e,n){this.targetId=e,this.me=n}}class Zp{constructor(e,n,i=et.EMPTY_BYTE_STRING,r=null){this.state=e,this.targetIds=n,this.resumeToken=i,this.cause=r}}class Lh{constructor(){this.fe=0,this.ge=Oh(),this.pe=et.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return this.fe!==0}get be(){return this.we}De(e){e.approximateByteSize()>0&&(this.we=!0,this.pe=e)}ve(){let e=re(),n=re(),i=re();return this.ge.forEach((r,s)=>{switch(s){case 0:e=e.add(r);break;case 2:n=n.add(r);break;case 1:i=i.add(r);break;default:j()}}),new Js(this.pe,this.ye,e,n,i)}Ce(){this.we=!1,this.ge=Oh()}Fe(e,n){this.we=!0,this.ge=this.ge.insert(e,n)}Me(e){this.we=!0,this.ge=this.ge.remove(e)}xe(){this.fe+=1}Oe(){this.fe-=1,ge(this.fe>=0)}Ne(){this.we=!0,this.ye=!0}}class lE{constructor(e){this.Le=e,this.Be=new Map,this.ke=Wn(),this.qe=Nh(),this.Qe=new De(he)}Ke(e){for(const n of e.Re)e.Ve&&e.Ve.isFoundDocument()?this.$e(n,e.Ve):this.Ue(n,e.key,e.Ve);for(const n of e.removedTargetIds)this.Ue(n,e.key,e.Ve)}We(e){this.forEachTarget(e,n=>{const i=this.Ge(n);switch(e.state){case 0:this.ze(n)&&i.De(e.resumeToken);break;case 1:i.Oe(),i.Se||i.Ce(),i.De(e.resumeToken);break;case 2:i.Oe(),i.Se||this.removeTarget(n);break;case 3:this.ze(n)&&(i.Ne(),i.De(e.resumeToken));break;case 4:this.ze(n)&&(this.je(n),i.De(e.resumeToken));break;default:j()}})}forEachTarget(e,n){e.targetIds.length>0?e.targetIds.forEach(n):this.Be.forEach((i,r)=>{this.ze(r)&&n(r)})}He(e){const n=e.targetId,i=e.me.count,r=this.Je(n);if(r){const s=r.target;if(zl(s))if(i===0){const o=new W(s.path);this.Ue(n,o,at.newNoDocument(o,Q.min()))}else ge(i===1);else{const o=this.Ye(n);if(o!==i){const l=this.Ze(e),c=l?this.Xe(l,e,o):1;if(c!==0){this.je(n);const u=c===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Qe=this.Qe.insert(n,u)}}}}}Ze(e){const n=e.me.unchangedNames;if(!n||!n.bits)return null;const{bits:{bitmap:i="",padding:r=0},hashCount:s=0}=n;let o,l;try{o=Qi(i).toUint8Array()}catch(c){if(c instanceof Rp)return Er("Decoding the base64 bloom filter in existence filter failed ("+c.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw c}try{l=new Wc(o,r,s)}catch(c){return Er(c instanceof cs?"BloomFilter error: ":"Applying bloom filter failed: ",c),null}return l.Ie===0?null:l}Xe(e,n,i){return n.me.count===i-this.nt(e,n.targetId)?0:2}nt(e,n){const i=this.Le.getRemoteKeysForTarget(n);let r=0;return i.forEach(s=>{const o=this.Le.tt(),l=`projects/${o.projectId}/databases/${o.database}/documents/${s.path.canonicalString()}`;e.mightContain(l)||(this.Ue(n,s,null),r++)}),r}rt(e){const n=new Map;this.Be.forEach((s,o)=>{const l=this.Je(o);if(l){if(s.current&&zl(l.target)){const c=new W(l.target.path);this.ke.get(c)!==null||this.it(o,c)||this.Ue(o,c,at.newNoDocument(c,e))}s.be&&(n.set(o,s.ve()),s.Ce())}});let i=re();this.qe.forEach((s,o)=>{let l=!0;o.forEachWhile(c=>{const u=this.Je(c);return!u||u.purpose==="TargetPurposeLimboResolution"||(l=!1,!1)}),l&&(i=i.add(s))}),this.ke.forEach((s,o)=>o.setReadTime(e));const r=new Ca(e,n,this.Qe,this.ke,i);return this.ke=Wn(),this.qe=Nh(),this.Qe=new De(he),r}$e(e,n){if(!this.ze(e))return;const i=this.it(e,n.key)?2:0;this.Ge(e).Fe(n.key,i),this.ke=this.ke.insert(n.key,n),this.qe=this.qe.insert(n.key,this.st(n.key).add(e))}Ue(e,n,i){if(!this.ze(e))return;const r=this.Ge(e);this.it(e,n)?r.Fe(n,1):r.Me(n),this.qe=this.qe.insert(n,this.st(n).delete(e)),i&&(this.ke=this.ke.insert(n,i))}removeTarget(e){this.Be.delete(e)}Ye(e){const n=this.Ge(e).ve();return this.Le.getRemoteKeysForTarget(e).size+n.addedDocuments.size-n.removedDocuments.size}xe(e){this.Ge(e).xe()}Ge(e){let n=this.Be.get(e);return n||(n=new Lh,this.Be.set(e,n)),n}st(e){let n=this.qe.get(e);return n||(n=new Xe(he),this.qe=this.qe.insert(e,n)),n}ze(e){const n=this.Je(e)!==null;return n||q("WatchChangeAggregator","Detected inactive target",e),n}Je(e){const n=this.Be.get(e);return n&&n.Se?null:this.Le.ot(e)}je(e){this.Be.set(e,new Lh),this.Le.getRemoteKeysForTarget(e).forEach(n=>{this.Ue(e,n,null)})}it(e,n){return this.Le.getRemoteKeysForTarget(e).has(n)}}function Nh(){return new De(W.comparator)}function Oh(){return new De(W.comparator)}const cE={asc:"ASCENDING",desc:"DESCENDING"},uE={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},dE={and:"AND",or:"OR"};class hE{constructor(e,n){this.databaseId=e,this.useProto3Json=n}}function Ul(t,e){return t.useProto3Json||Ta(e)?e:{value:e}}function oa(t,e){return t.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function em(t,e){return t.useProto3Json?e.toBase64():e.toUint8Array()}function fE(t,e){return oa(t,e.toTimestamp())}function pn(t){return ge(!!t),Q.fromTimestamp(function(n){const i=wi(n);return new He(i.seconds,i.nanos)}(t))}function Gc(t,e){return ql(t,e).canonicalString()}function ql(t,e){const n=function(r){return new Se(["projects",r.projectId,"databases",r.database])}(t).child("documents");return e===void 0?n:n.child(e)}function tm(t){const e=Se.fromString(t);return ge(om(e)),e}function Hl(t,e){return Gc(t.databaseId,e.path)}function bl(t,e){const n=tm(e);if(n.get(1)!==t.databaseId.projectId)throw new $(M.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+n.get(1)+" vs "+t.databaseId.projectId);if(n.get(3)!==t.databaseId.database)throw new $(M.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+n.get(3)+" vs "+t.databaseId.database);return new W(im(n))}function nm(t,e){return Gc(t.databaseId,e)}function pE(t){const e=tm(t);return e.length===4?Se.emptyPath():im(e)}function Wl(t){return new Se(["projects",t.databaseId.projectId,"databases",t.databaseId.database]).canonicalString()}function im(t){return ge(t.length>4&&t.get(4)==="documents"),t.popFirst(5)}function Fh(t,e,n){return{name:Hl(t,e),fields:n.value.mapValue.fields}}function mE(t,e){let n;if("targetChange"in e){e.targetChange;const i=function(u){return u==="NO_CHANGE"?0:u==="ADD"?1:u==="REMOVE"?2:u==="CURRENT"?3:u==="RESET"?4:j()}(e.targetChange.targetChangeType||"NO_CHANGE"),r=e.targetChange.targetIds||[],s=function(u,f){return u.useProto3Json?(ge(f===void 0||typeof f=="string"),et.fromBase64String(f||"")):(ge(f===void 0||f instanceof Buffer||f instanceof Uint8Array),et.fromUint8Array(f||new Uint8Array))}(t,e.targetChange.resumeToken),o=e.targetChange.cause,l=o&&function(u){const f=u.code===void 0?M.UNKNOWN:Jp(u.code);return new $(f,u.message||"")}(o);n=new Zp(i,r,s,l||null)}else if("documentChange"in e){e.documentChange;const i=e.documentChange;i.document,i.document.name,i.document.updateTime;const r=bl(t,i.document.name),s=pn(i.document.updateTime),o=i.document.createTime?pn(i.document.createTime):Q.min(),l=new St({mapValue:{fields:i.document.fields}}),c=at.newFoundDocument(r,s,o,l),u=i.targetIds||[],f=i.removedTargetIds||[];n=new Vo(u,f,c.key,c)}else if("documentDelete"in e){e.documentDelete;const i=e.documentDelete;i.document;const r=bl(t,i.document),s=i.readTime?pn(i.readTime):Q.min(),o=at.newNoDocument(r,s),l=i.removedTargetIds||[];n=new Vo([],l,o.key,o)}else if("documentRemove"in e){e.documentRemove;const i=e.documentRemove;i.document;const r=bl(t,i.document),s=i.removedTargetIds||[];n=new Vo([],s,r,null)}else{if(!("filter"in e))return j();{e.filter;const i=e.filter;i.targetId;const{count:r=0,unchangedNames:s}=i,o=new rE(r,s),l=i.targetId;n=new Xp(l,o)}}return n}function gE(t,e){let n;if(e instanceof Qs)n={update:Fh(t,e.key,e.value)};else if(e instanceof ka)n={delete:Hl(t,e.key)};else if(e instanceof Ii)n={update:Fh(t,e.key,e.data),updateMask:SE(e.fieldMask)};else{if(!(e instanceof tE))return j();n={verify:Hl(t,e.key)}}return e.fieldTransforms.length>0&&(n.updateTransforms=e.fieldTransforms.map(i=>function(s,o){const l=o.transform;if(l instanceof Cs)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(l instanceof Rs)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:l.elements}};if(l instanceof Ps)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:l.elements}};if(l instanceof sa)return{fieldPath:o.field.canonicalString(),increment:l.Pe};throw j()}(0,i))),e.precondition.isNone||(n.currentDocument=function(r,s){return s.updateTime!==void 0?{updateTime:fE(r,s.updateTime)}:s.exists!==void 0?{exists:s.exists}:j()}(t,e.precondition)),n}function yE(t,e){return t&&t.length>0?(ge(e!==void 0),t.map(n=>function(r,s){let o=r.updateTime?pn(r.updateTime):pn(s);return o.isEqual(Q.min())&&(o=pn(s)),new X_(o,r.transformResults||[])}(n,e))):[]}function vE(t,e){return{documents:[nm(t,e.path)]}}function bE(t,e){const n={structuredQuery:{}},i=e.path;let r;e.collectionGroup!==null?(r=i,n.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(r=i.popLast(),n.structuredQuery.from=[{collectionId:i.lastSegment()}]),n.parent=nm(t,r);const s=function(u){if(u.length!==0)return sm(en.create(u,"and"))}(e.filters);s&&(n.structuredQuery.where=s);const o=function(u){if(u.length!==0)return u.map(f=>function(p){return{field:ur(p.field),direction:EE(p.dir)}}(f))}(e.orderBy);o&&(n.structuredQuery.orderBy=o);const l=Ul(t,e.limit);return l!==null&&(n.structuredQuery.limit=l),e.startAt&&(n.structuredQuery.startAt=function(u){return{before:u.inclusive,values:u.position}}(e.startAt)),e.endAt&&(n.structuredQuery.endAt=function(u){return{before:!u.inclusive,values:u.position}}(e.endAt)),{_t:n,parent:r}}function wE(t){let e=pE(t.parent);const n=t.structuredQuery,i=n.from?n.from.length:0;let r=null;if(i>0){ge(i===1);const f=n.from[0];f.allDescendants?r=f.collectionId:e=e.child(f.collectionId)}let s=[];n.where&&(s=function(m){const p=rm(m);return p instanceof en&&Bp(p)?p.getFilters():[p]}(n.where));let o=[];n.orderBy&&(o=function(m){return m.map(p=>function(I){return new ks(dr(I.field),function(A){switch(A){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(I.direction))}(p))}(n.orderBy));let l=null;n.limit&&(l=function(m){let p;return p=typeof m=="object"?m.value:m,Ta(p)?null:p}(n.limit));let c=null;n.startAt&&(c=function(m){const p=!!m.before,w=m.values||[];return new ia(w,p)}(n.startAt));let u=null;return n.endAt&&(u=function(m){const p=!m.before,w=m.values||[];return new ia(w,p)}(n.endAt)),F_(e,r,o,s,l,"F",c,u)}function _E(t,e){const n=function(r){switch(r){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return j()}}(e.purpose);return n==null?null:{"goog-listen-tags":n}}function rm(t){return t.unaryFilter!==void 0?function(n){switch(n.unaryFilter.op){case"IS_NAN":const i=dr(n.unaryFilter.field);return $e.create(i,"==",{doubleValue:NaN});case"IS_NULL":const r=dr(n.unaryFilter.field);return $e.create(r,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const s=dr(n.unaryFilter.field);return $e.create(s,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=dr(n.unaryFilter.field);return $e.create(o,"!=",{nullValue:"NULL_VALUE"});default:return j()}}(t):t.fieldFilter!==void 0?function(n){return $e.create(dr(n.fieldFilter.field),function(r){switch(r){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return j()}}(n.fieldFilter.op),n.fieldFilter.value)}(t):t.compositeFilter!==void 0?function(n){return en.create(n.compositeFilter.filters.map(i=>rm(i)),function(r){switch(r){case"AND":return"and";case"OR":return"or";default:return j()}}(n.compositeFilter.op))}(t):j()}function EE(t){return cE[t]}function TE(t){return uE[t]}function IE(t){return dE[t]}function ur(t){return{fieldPath:t.canonicalString()}}function dr(t){return Je.fromServerFormat(t.fieldPath)}function sm(t){return t instanceof $e?function(n){if(n.op==="=="){if(Ih(n.value))return{unaryFilter:{field:ur(n.field),op:"IS_NAN"}};if(Th(n.value))return{unaryFilter:{field:ur(n.field),op:"IS_NULL"}}}else if(n.op==="!="){if(Ih(n.value))return{unaryFilter:{field:ur(n.field),op:"IS_NOT_NAN"}};if(Th(n.value))return{unaryFilter:{field:ur(n.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:ur(n.field),op:TE(n.op),value:n.value}}}(t):t instanceof en?function(n){const i=n.getFilters().map(r=>sm(r));return i.length===1?i[0]:{compositeFilter:{op:IE(n.op),filters:i}}}(t):j()}function SE(t){const e=[];return t.fields.forEach(n=>e.push(n.canonicalString())),{fieldPaths:e}}function om(t){return t.length>=4&&t.get(0)==="projects"&&t.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hi{constructor(e,n,i,r,s=Q.min(),o=Q.min(),l=et.EMPTY_BYTE_STRING,c=null){this.target=e,this.targetId=n,this.purpose=i,this.sequenceNumber=r,this.snapshotVersion=s,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=l,this.expectedCount=c}withSequenceNumber(e){return new hi(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,n){return new hi(this.target,this.targetId,this.purpose,this.sequenceNumber,n,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new hi(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new hi(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xE{constructor(e){this.ct=e}}function AE(t){const e=wE({parent:t.parent,structuredQuery:t.structuredQuery});return t.limitType==="LAST"?ra(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kE{constructor(){this.un=new CE}addToCollectionParentIndex(e,n){return this.un.add(n),B.resolve()}getCollectionParents(e,n){return B.resolve(this.un.getEntries(n))}addFieldIndex(e,n){return B.resolve()}deleteFieldIndex(e,n){return B.resolve()}deleteAllFieldIndexes(e){return B.resolve()}createTargetIndexes(e,n){return B.resolve()}getDocumentsMatchingTarget(e,n){return B.resolve(null)}getIndexType(e,n){return B.resolve(0)}getFieldIndexes(e,n){return B.resolve([])}getNextCollectionGroupToUpdate(e){return B.resolve(null)}getMinOffset(e,n){return B.resolve(bi.min())}getMinOffsetFromCollectionGroup(e,n){return B.resolve(bi.min())}updateCollectionGroup(e,n,i){return B.resolve()}updateIndexEntries(e,n){return B.resolve()}}class CE{constructor(){this.index={}}add(e){const n=e.lastSegment(),i=e.popLast(),r=this.index[n]||new Xe(Se.comparator),s=!r.has(i);return this.index[n]=r.add(i),s}has(e){const n=e.lastSegment(),i=e.popLast(),r=this.index[n];return r&&r.has(i)}getEntries(e){return(this.index[e]||new Xe(Se.comparator)).toArray()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xr{constructor(e){this.Ln=e}next(){return this.Ln+=2,this.Ln}static Bn(){return new xr(0)}static kn(){return new xr(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class RE{constructor(){this.changes=new Nr(e=>e.toString(),(e,n)=>e.isEqual(n)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,n){this.assertNotApplied(),this.changes.set(e,at.newInvalidDocument(e).setReadTime(n))}getEntry(e,n){this.assertNotApplied();const i=this.changes.get(n);return i!==void 0?B.resolve(i):this.getFromCache(e,n)}getEntries(e,n){return this.getAllFromCache(e,n)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class PE{constructor(e,n){this.overlayedDocument=e,this.mutatedFields=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ME{constructor(e,n,i,r){this.remoteDocumentCache=e,this.mutationQueue=n,this.documentOverlayCache=i,this.indexManager=r}getDocument(e,n){let i=null;return this.documentOverlayCache.getOverlay(e,n).next(r=>(i=r,this.remoteDocumentCache.getEntry(e,n))).next(r=>(i!==null&&ys(i.mutation,r,Dt.empty(),He.now()),r))}getDocuments(e,n){return this.remoteDocumentCache.getEntries(e,n).next(i=>this.getLocalViewOfDocuments(e,i,re()).next(()=>i))}getLocalViewOfDocuments(e,n,i=re()){const r=Fi();return this.populateOverlays(e,r,n).next(()=>this.computeViews(e,n,r,i).next(s=>{let o=ls();return s.forEach((l,c)=>{o=o.insert(l,c.overlayedDocument)}),o}))}getOverlayedDocuments(e,n){const i=Fi();return this.populateOverlays(e,i,n).next(()=>this.computeViews(e,n,i,re()))}populateOverlays(e,n,i){const r=[];return i.forEach(s=>{n.has(s)||r.push(s)}),this.documentOverlayCache.getOverlays(e,r).next(s=>{s.forEach((o,l)=>{n.set(o,l)})})}computeViews(e,n,i,r){let s=Wn();const o=gs(),l=function(){return gs()}();return n.forEach((c,u)=>{const f=i.get(u.key);r.has(u.key)&&(f===void 0||f.mutation instanceof Ii)?s=s.insert(u.key,u):f!==void 0?(o.set(u.key,f.mutation.getFieldMask()),ys(f.mutation,u,f.mutation.getFieldMask(),He.now())):o.set(u.key,Dt.empty())}),this.recalculateAndSaveOverlays(e,s).next(c=>(c.forEach((u,f)=>o.set(u,f)),n.forEach((u,f)=>{var m;return l.set(u,new PE(f,(m=o.get(u))!==null&&m!==void 0?m:null))}),l))}recalculateAndSaveOverlays(e,n){const i=gs();let r=new De((o,l)=>o-l),s=re();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,n).next(o=>{for(const l of o)l.keys().forEach(c=>{const u=n.get(c);if(u===null)return;let f=i.get(c)||Dt.empty();f=l.applyToLocalView(u,f),i.set(c,f);const m=(r.get(l.batchId)||re()).add(c);r=r.insert(l.batchId,m)})}).next(()=>{const o=[],l=r.getReverseIterator();for(;l.hasNext();){const c=l.getNext(),u=c.key,f=c.value,m=qp();f.forEach(p=>{if(!s.has(p)){const w=Kp(n.get(p),i.get(p));w!==null&&m.set(p,w),s=s.add(p)}}),o.push(this.documentOverlayCache.saveOverlays(e,u,m))}return B.waitFor(o)}).next(()=>i)}recalculateAndSaveOverlaysForDocumentKeys(e,n){return this.remoteDocumentCache.getEntries(e,n).next(i=>this.recalculateAndSaveOverlays(e,i))}getDocumentsMatchingQuery(e,n,i,r){return function(o){return W.isDocumentKey(o.path)&&o.collectionGroup===null&&o.filters.length===0}(n)?this.getDocumentsMatchingDocumentQuery(e,n.path):Fp(n)?this.getDocumentsMatchingCollectionGroupQuery(e,n,i,r):this.getDocumentsMatchingCollectionQuery(e,n,i,r)}getNextDocuments(e,n,i,r){return this.remoteDocumentCache.getAllFromCollectionGroup(e,n,i,r).next(s=>{const o=r-s.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,n,i.largestBatchId,r-s.size):B.resolve(Fi());let l=-1,c=s;return o.next(u=>B.forEach(u,(f,m)=>(l<m.largestBatchId&&(l=m.largestBatchId),s.get(f)?B.resolve():this.remoteDocumentCache.getEntry(e,f).next(p=>{c=c.insert(f,p)}))).next(()=>this.populateOverlays(e,u,s)).next(()=>this.computeViews(e,c,u,re())).next(f=>({batchId:l,changes:Up(f)})))})}getDocumentsMatchingDocumentQuery(e,n){return this.getDocument(e,new W(n)).next(i=>{let r=ls();return i.isFoundDocument()&&(r=r.insert(i.key,i)),r})}getDocumentsMatchingCollectionGroupQuery(e,n,i,r){const s=n.collectionGroup;let o=ls();return this.indexManager.getCollectionParents(e,s).next(l=>B.forEach(l,c=>{const u=function(m,p){return new Lr(p,null,m.explicitOrderBy.slice(),m.filters.slice(),m.limit,m.limitType,m.startAt,m.endAt)}(n,c.child(s));return this.getDocumentsMatchingCollectionQuery(e,u,i,r).next(f=>{f.forEach((m,p)=>{o=o.insert(m,p)})})}).next(()=>o))}getDocumentsMatchingCollectionQuery(e,n,i,r){let s;return this.documentOverlayCache.getOverlaysForCollection(e,n.path,i.largestBatchId).next(o=>(s=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,n,i,s,r))).next(o=>{s.forEach((c,u)=>{const f=u.getKey();o.get(f)===null&&(o=o.insert(f,at.newInvalidDocument(f)))});let l=ls();return o.forEach((c,u)=>{const f=s.get(c);f!==void 0&&ys(f.mutation,u,Dt.empty(),He.now()),Sa(n,u)&&(l=l.insert(c,u))}),l})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class DE{constructor(e){this.serializer=e,this.hr=new Map,this.Pr=new Map}getBundleMetadata(e,n){return B.resolve(this.hr.get(n))}saveBundleMetadata(e,n){return this.hr.set(n.id,function(r){return{id:r.id,version:r.version,createTime:pn(r.createTime)}}(n)),B.resolve()}getNamedQuery(e,n){return B.resolve(this.Pr.get(n))}saveNamedQuery(e,n){return this.Pr.set(n.name,function(r){return{name:r.name,query:AE(r.bundledQuery),readTime:pn(r.readTime)}}(n)),B.resolve()}}/**
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
 */class BE{constructor(){this.overlays=new De(W.comparator),this.Ir=new Map}getOverlay(e,n){return B.resolve(this.overlays.get(n))}getOverlays(e,n){const i=Fi();return B.forEach(n,r=>this.getOverlay(e,r).next(s=>{s!==null&&i.set(r,s)})).next(()=>i)}saveOverlays(e,n,i){return i.forEach((r,s)=>{this.ht(e,n,s)}),B.resolve()}removeOverlaysForBatchId(e,n,i){const r=this.Ir.get(i);return r!==void 0&&(r.forEach(s=>this.overlays=this.overlays.remove(s)),this.Ir.delete(i)),B.resolve()}getOverlaysForCollection(e,n,i){const r=Fi(),s=n.length+1,o=new W(n.child("")),l=this.overlays.getIteratorFrom(o);for(;l.hasNext();){const c=l.getNext().value,u=c.getKey();if(!n.isPrefixOf(u.path))break;u.path.length===s&&c.largestBatchId>i&&r.set(c.getKey(),c)}return B.resolve(r)}getOverlaysForCollectionGroup(e,n,i,r){let s=new De((u,f)=>u-f);const o=this.overlays.getIterator();for(;o.hasNext();){const u=o.getNext().value;if(u.getKey().getCollectionGroup()===n&&u.largestBatchId>i){let f=s.get(u.largestBatchId);f===null&&(f=Fi(),s=s.insert(u.largestBatchId,f)),f.set(u.getKey(),u)}}const l=Fi(),c=s.getIterator();for(;c.hasNext()&&(c.getNext().value.forEach((u,f)=>l.set(u,f)),!(l.size()>=r)););return B.resolve(l)}ht(e,n,i){const r=this.overlays.get(i.key);if(r!==null){const o=this.Ir.get(r.largestBatchId).delete(i.key);this.Ir.set(r.largestBatchId,o)}this.overlays=this.overlays.insert(i.key,new iE(n,i));let s=this.Ir.get(n);s===void 0&&(s=re(),this.Ir.set(n,s)),this.Ir.set(n,s.add(i.key))}}/**
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
 */class LE{constructor(){this.sessionToken=et.EMPTY_BYTE_STRING}getSessionToken(e){return B.resolve(this.sessionToken)}setSessionToken(e,n){return this.sessionToken=n,B.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yc{constructor(){this.Tr=new Xe(Ge.Er),this.dr=new Xe(Ge.Ar)}isEmpty(){return this.Tr.isEmpty()}addReference(e,n){const i=new Ge(e,n);this.Tr=this.Tr.add(i),this.dr=this.dr.add(i)}Rr(e,n){e.forEach(i=>this.addReference(i,n))}removeReference(e,n){this.Vr(new Ge(e,n))}mr(e,n){e.forEach(i=>this.removeReference(i,n))}gr(e){const n=new W(new Se([])),i=new Ge(n,e),r=new Ge(n,e+1),s=[];return this.dr.forEachInRange([i,r],o=>{this.Vr(o),s.push(o.key)}),s}pr(){this.Tr.forEach(e=>this.Vr(e))}Vr(e){this.Tr=this.Tr.delete(e),this.dr=this.dr.delete(e)}yr(e){const n=new W(new Se([])),i=new Ge(n,e),r=new Ge(n,e+1);let s=re();return this.dr.forEachInRange([i,r],o=>{s=s.add(o.key)}),s}containsKey(e){const n=new Ge(e,0),i=this.Tr.firstAfterOrEqual(n);return i!==null&&e.isEqual(i.key)}}class Ge{constructor(e,n){this.key=e,this.wr=n}static Er(e,n){return W.comparator(e.key,n.key)||he(e.wr,n.wr)}static Ar(e,n){return he(e.wr,n.wr)||W.comparator(e.key,n.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class NE{constructor(e,n){this.indexManager=e,this.referenceDelegate=n,this.mutationQueue=[],this.Sr=1,this.br=new Xe(Ge.Er)}checkEmpty(e){return B.resolve(this.mutationQueue.length===0)}addMutationBatch(e,n,i,r){const s=this.Sr;this.Sr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new nE(s,n,i,r);this.mutationQueue.push(o);for(const l of r)this.br=this.br.add(new Ge(l.key,s)),this.indexManager.addToCollectionParentIndex(e,l.key.path.popLast());return B.resolve(o)}lookupMutationBatch(e,n){return B.resolve(this.Dr(n))}getNextMutationBatchAfterBatchId(e,n){const i=n+1,r=this.vr(i),s=r<0?0:r;return B.resolve(this.mutationQueue.length>s?this.mutationQueue[s]:null)}getHighestUnacknowledgedBatchId(){return B.resolve(this.mutationQueue.length===0?-1:this.Sr-1)}getAllMutationBatches(e){return B.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,n){const i=new Ge(n,0),r=new Ge(n,Number.POSITIVE_INFINITY),s=[];return this.br.forEachInRange([i,r],o=>{const l=this.Dr(o.wr);s.push(l)}),B.resolve(s)}getAllMutationBatchesAffectingDocumentKeys(e,n){let i=new Xe(he);return n.forEach(r=>{const s=new Ge(r,0),o=new Ge(r,Number.POSITIVE_INFINITY);this.br.forEachInRange([s,o],l=>{i=i.add(l.wr)})}),B.resolve(this.Cr(i))}getAllMutationBatchesAffectingQuery(e,n){const i=n.path,r=i.length+1;let s=i;W.isDocumentKey(s)||(s=s.child(""));const o=new Ge(new W(s),0);let l=new Xe(he);return this.br.forEachWhile(c=>{const u=c.key.path;return!!i.isPrefixOf(u)&&(u.length===r&&(l=l.add(c.wr)),!0)},o),B.resolve(this.Cr(l))}Cr(e){const n=[];return e.forEach(i=>{const r=this.Dr(i);r!==null&&n.push(r)}),n}removeMutationBatch(e,n){ge(this.Fr(n.batchId,"removed")===0),this.mutationQueue.shift();let i=this.br;return B.forEach(n.mutations,r=>{const s=new Ge(r.key,n.batchId);return i=i.delete(s),this.referenceDelegate.markPotentiallyOrphaned(e,r.key)}).next(()=>{this.br=i})}On(e){}containsKey(e,n){const i=new Ge(n,0),r=this.br.firstAfterOrEqual(i);return B.resolve(n.isEqual(r&&r.key))}performConsistencyCheck(e){return this.mutationQueue.length,B.resolve()}Fr(e,n){return this.vr(e)}vr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Dr(e){const n=this.vr(e);return n<0||n>=this.mutationQueue.length?null:this.mutationQueue[n]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class OE{constructor(e){this.Mr=e,this.docs=function(){return new De(W.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,n){const i=n.key,r=this.docs.get(i),s=r?r.size:0,o=this.Mr(n);return this.docs=this.docs.insert(i,{document:n.mutableCopy(),size:o}),this.size+=o-s,this.indexManager.addToCollectionParentIndex(e,i.path.popLast())}removeEntry(e){const n=this.docs.get(e);n&&(this.docs=this.docs.remove(e),this.size-=n.size)}getEntry(e,n){const i=this.docs.get(n);return B.resolve(i?i.document.mutableCopy():at.newInvalidDocument(n))}getEntries(e,n){let i=Wn();return n.forEach(r=>{const s=this.docs.get(r);i=i.insert(r,s?s.document.mutableCopy():at.newInvalidDocument(r))}),B.resolve(i)}getDocumentsMatchingQuery(e,n,i,r){let s=Wn();const o=n.path,l=new W(o.child("")),c=this.docs.getIteratorFrom(l);for(;c.hasNext();){const{key:u,value:{document:f}}=c.getNext();if(!o.isPrefixOf(u.path))break;u.path.length>o.length+1||b_(v_(f),i)<=0||(r.has(f.key)||Sa(n,f))&&(s=s.insert(f.key,f.mutableCopy()))}return B.resolve(s)}getAllFromCollectionGroup(e,n,i,r){j()}Or(e,n){return B.forEach(this.docs,i=>n(i))}newChangeBuffer(e){return new FE(this)}getSize(e){return B.resolve(this.size)}}class FE extends RE{constructor(e){super(),this.cr=e}applyChanges(e){const n=[];return this.changes.forEach((i,r)=>{r.isValidDocument()?n.push(this.cr.addEntry(e,r)):this.cr.removeEntry(i)}),B.waitFor(n)}getFromCache(e,n){return this.cr.getEntry(e,n)}getAllFromCache(e,n){return this.cr.getEntries(e,n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class VE{constructor(e){this.persistence=e,this.Nr=new Nr(n=>zc(n),$c),this.lastRemoteSnapshotVersion=Q.min(),this.highestTargetId=0,this.Lr=0,this.Br=new Yc,this.targetCount=0,this.kr=xr.Bn()}forEachTarget(e,n){return this.Nr.forEach((i,r)=>n(r)),B.resolve()}getLastRemoteSnapshotVersion(e){return B.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return B.resolve(this.Lr)}allocateTargetId(e){return this.highestTargetId=this.kr.next(),B.resolve(this.highestTargetId)}setTargetsMetadata(e,n,i){return i&&(this.lastRemoteSnapshotVersion=i),n>this.Lr&&(this.Lr=n),B.resolve()}Kn(e){this.Nr.set(e.target,e);const n=e.targetId;n>this.highestTargetId&&(this.kr=new xr(n),this.highestTargetId=n),e.sequenceNumber>this.Lr&&(this.Lr=e.sequenceNumber)}addTargetData(e,n){return this.Kn(n),this.targetCount+=1,B.resolve()}updateTargetData(e,n){return this.Kn(n),B.resolve()}removeTargetData(e,n){return this.Nr.delete(n.target),this.Br.gr(n.targetId),this.targetCount-=1,B.resolve()}removeTargets(e,n,i){let r=0;const s=[];return this.Nr.forEach((o,l)=>{l.sequenceNumber<=n&&i.get(l.targetId)===null&&(this.Nr.delete(o),s.push(this.removeMatchingKeysForTargetId(e,l.targetId)),r++)}),B.waitFor(s).next(()=>r)}getTargetCount(e){return B.resolve(this.targetCount)}getTargetData(e,n){const i=this.Nr.get(n)||null;return B.resolve(i)}addMatchingKeys(e,n,i){return this.Br.Rr(n,i),B.resolve()}removeMatchingKeys(e,n,i){this.Br.mr(n,i);const r=this.persistence.referenceDelegate,s=[];return r&&n.forEach(o=>{s.push(r.markPotentiallyOrphaned(e,o))}),B.waitFor(s)}removeMatchingKeysForTargetId(e,n){return this.Br.gr(n),B.resolve()}getMatchingKeysForTargetId(e,n){const i=this.Br.yr(n);return B.resolve(i)}containsKey(e,n){return B.resolve(this.Br.containsKey(n))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zE{constructor(e,n){this.qr={},this.overlays={},this.Qr=new Nc(0),this.Kr=!1,this.Kr=!0,this.$r=new LE,this.referenceDelegate=e(this),this.Ur=new VE(this),this.indexManager=new kE,this.remoteDocumentCache=function(r){return new OE(r)}(i=>this.referenceDelegate.Wr(i)),this.serializer=new xE(n),this.Gr=new DE(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Kr=!1,Promise.resolve()}get started(){return this.Kr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let n=this.overlays[e.toKey()];return n||(n=new BE,this.overlays[e.toKey()]=n),n}getMutationQueue(e,n){let i=this.qr[e.toKey()];return i||(i=new NE(n,this.referenceDelegate),this.qr[e.toKey()]=i),i}getGlobalsCache(){return this.$r}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Gr}runTransaction(e,n,i){q("MemoryPersistence","Starting transaction:",e);const r=new $E(this.Qr.next());return this.referenceDelegate.zr(),i(r).next(s=>this.referenceDelegate.jr(r).next(()=>s)).toPromise().then(s=>(r.raiseOnCommittedEvent(),s))}Hr(e,n){return B.or(Object.values(this.qr).map(i=>()=>i.containsKey(e,n)))}}class $E extends __{constructor(e){super(),this.currentSequenceNumber=e}}class jc{constructor(e){this.persistence=e,this.Jr=new Yc,this.Yr=null}static Zr(e){return new jc(e)}get Xr(){if(this.Yr)return this.Yr;throw j()}addReference(e,n,i){return this.Jr.addReference(i,n),this.Xr.delete(i.toString()),B.resolve()}removeReference(e,n,i){return this.Jr.removeReference(i,n),this.Xr.add(i.toString()),B.resolve()}markPotentiallyOrphaned(e,n){return this.Xr.add(n.toString()),B.resolve()}removeTarget(e,n){this.Jr.gr(n.targetId).forEach(r=>this.Xr.add(r.toString()));const i=this.persistence.getTargetCache();return i.getMatchingKeysForTargetId(e,n.targetId).next(r=>{r.forEach(s=>this.Xr.add(s.toString()))}).next(()=>i.removeTargetData(e,n))}zr(){this.Yr=new Set}jr(e){const n=this.persistence.getRemoteDocumentCache().newChangeBuffer();return B.forEach(this.Xr,i=>{const r=W.fromPath(i);return this.ei(e,r).next(s=>{s||n.removeEntry(r,Q.min())})}).next(()=>(this.Yr=null,n.apply(e)))}updateLimboDocument(e,n){return this.ei(e,n).next(i=>{i?this.Xr.delete(n.toString()):this.Xr.add(n.toString())})}Wr(e){return 0}ei(e,n){return B.or([()=>B.resolve(this.Jr.containsKey(n)),()=>this.persistence.getTargetCache().containsKey(e,n),()=>this.persistence.Hr(e,n)])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kc{constructor(e,n,i,r){this.targetId=e,this.fromCache=n,this.$i=i,this.Ui=r}static Wi(e,n){let i=re(),r=re();for(const s of n.docChanges)switch(s.type){case 0:i=i.add(s.doc.key);break;case 1:r=r.add(s.doc.key)}return new Kc(e,n.fromCache,i,r)}}/**
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
 */class UE{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qE{constructor(){this.Gi=!1,this.zi=!1,this.ji=100,this.Hi=function(){return Tv()?8:E_(ct())>0?6:4}()}initialize(e,n){this.Ji=e,this.indexManager=n,this.Gi=!0}getDocumentsMatchingQuery(e,n,i,r){const s={result:null};return this.Yi(e,n).next(o=>{s.result=o}).next(()=>{if(!s.result)return this.Zi(e,n,r,i).next(o=>{s.result=o})}).next(()=>{if(s.result)return;const o=new UE;return this.Xi(e,n,o).next(l=>{if(s.result=l,this.zi)return this.es(e,n,o,l.size)})}).next(()=>s.result)}es(e,n,i,r){return i.documentReadCount<this.ji?(is()<=oe.DEBUG&&q("QueryEngine","SDK will not create cache indexes for query:",cr(n),"since it only creates cache indexes for collection contains","more than or equal to",this.ji,"documents"),B.resolve()):(is()<=oe.DEBUG&&q("QueryEngine","Query:",cr(n),"scans",i.documentReadCount,"local documents and returns",r,"documents as results."),i.documentReadCount>this.Hi*r?(is()<=oe.DEBUG&&q("QueryEngine","The SDK decides to create cache indexes for query:",cr(n),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,fn(n))):B.resolve())}Yi(e,n){if(kh(n))return B.resolve(null);let i=fn(n);return this.indexManager.getIndexType(e,i).next(r=>r===0?null:(n.limit!==null&&r===1&&(n=ra(n,null,"F"),i=fn(n)),this.indexManager.getDocumentsMatchingTarget(e,i).next(s=>{const o=re(...s);return this.Ji.getDocuments(e,o).next(l=>this.indexManager.getMinOffset(e,i).next(c=>{const u=this.ts(n,l);return this.ns(n,u,o,c.readTime)?this.Yi(e,ra(n,null,"F")):this.rs(e,u,n,c)}))})))}Zi(e,n,i,r){return kh(n)||r.isEqual(Q.min())?B.resolve(null):this.Ji.getDocuments(e,i).next(s=>{const o=this.ts(n,s);return this.ns(n,o,i,r)?B.resolve(null):(is()<=oe.DEBUG&&q("QueryEngine","Re-using previous result from %s to execute query: %s",r.toString(),cr(n)),this.rs(e,o,n,y_(r,-1)).next(l=>l))})}ts(e,n){let i=new Xe(zp(e));return n.forEach((r,s)=>{Sa(e,s)&&(i=i.add(s))}),i}ns(e,n,i,r){if(e.limit===null)return!1;if(i.size!==n.size)return!0;const s=e.limitType==="F"?n.last():n.first();return!!s&&(s.hasPendingWrites||s.version.compareTo(r)>0)}Xi(e,n,i){return is()<=oe.DEBUG&&q("QueryEngine","Using full collection scan to execute query:",cr(n)),this.Ji.getDocumentsMatchingQuery(e,n,bi.min(),i)}rs(e,n,i,r){return this.Ji.getDocumentsMatchingQuery(e,i,r).next(s=>(n.forEach(o=>{s=s.insert(o.key,o)}),s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class HE{constructor(e,n,i,r){this.persistence=e,this.ss=n,this.serializer=r,this.os=new De(he),this._s=new Nr(s=>zc(s),$c),this.us=new Map,this.cs=e.getRemoteDocumentCache(),this.Ur=e.getTargetCache(),this.Gr=e.getBundleCache(),this.ls(i)}ls(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new ME(this.cs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.cs.setIndexManager(this.indexManager),this.ss.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",n=>e.collect(n,this.os))}}function WE(t,e,n,i){return new HE(t,e,n,i)}async function am(t,e){const n=J(t);return await n.persistence.runTransaction("Handle user change","readonly",i=>{let r;return n.mutationQueue.getAllMutationBatches(i).next(s=>(r=s,n.ls(e),n.mutationQueue.getAllMutationBatches(i))).next(s=>{const o=[],l=[];let c=re();for(const u of r){o.push(u.batchId);for(const f of u.mutations)c=c.add(f.key)}for(const u of s){l.push(u.batchId);for(const f of u.mutations)c=c.add(f.key)}return n.localDocuments.getDocuments(i,c).next(u=>({hs:u,removedBatchIds:o,addedBatchIds:l}))})})}function GE(t,e){const n=J(t);return n.persistence.runTransaction("Acknowledge batch","readwrite-primary",i=>{const r=e.batch.keys(),s=n.cs.newChangeBuffer({trackRemovals:!0});return function(l,c,u,f){const m=u.batch,p=m.keys();let w=B.resolve();return p.forEach(I=>{w=w.next(()=>f.getEntry(c,I)).next(S=>{const A=u.docVersions.get(I);ge(A!==null),S.version.compareTo(A)<0&&(m.applyToRemoteDocument(S,u),S.isValidDocument()&&(S.setReadTime(u.commitVersion),f.addEntry(S)))})}),w.next(()=>l.mutationQueue.removeMutationBatch(c,m))}(n,i,e,s).next(()=>s.apply(i)).next(()=>n.mutationQueue.performConsistencyCheck(i)).next(()=>n.documentOverlayCache.removeOverlaysForBatchId(i,r,e.batch.batchId)).next(()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(i,function(l){let c=re();for(let u=0;u<l.mutationResults.length;++u)l.mutationResults[u].transformResults.length>0&&(c=c.add(l.batch.mutations[u].key));return c}(e))).next(()=>n.localDocuments.getDocuments(i,r))})}function lm(t){const e=J(t);return e.persistence.runTransaction("Get last remote snapshot version","readonly",n=>e.Ur.getLastRemoteSnapshotVersion(n))}function YE(t,e){const n=J(t),i=e.snapshotVersion;let r=n.os;return n.persistence.runTransaction("Apply remote event","readwrite-primary",s=>{const o=n.cs.newChangeBuffer({trackRemovals:!0});r=n.os;const l=[];e.targetChanges.forEach((f,m)=>{const p=r.get(m);if(!p)return;l.push(n.Ur.removeMatchingKeys(s,f.removedDocuments,m).next(()=>n.Ur.addMatchingKeys(s,f.addedDocuments,m)));let w=p.withSequenceNumber(s.currentSequenceNumber);e.targetMismatches.get(m)!==null?w=w.withResumeToken(et.EMPTY_BYTE_STRING,Q.min()).withLastLimboFreeSnapshotVersion(Q.min()):f.resumeToken.approximateByteSize()>0&&(w=w.withResumeToken(f.resumeToken,i)),r=r.insert(m,w),function(S,A,C){return S.resumeToken.approximateByteSize()===0||A.snapshotVersion.toMicroseconds()-S.snapshotVersion.toMicroseconds()>=3e8?!0:C.addedDocuments.size+C.modifiedDocuments.size+C.removedDocuments.size>0}(p,w,f)&&l.push(n.Ur.updateTargetData(s,w))});let c=Wn(),u=re();if(e.documentUpdates.forEach(f=>{e.resolvedLimboDocuments.has(f)&&l.push(n.persistence.referenceDelegate.updateLimboDocument(s,f))}),l.push(jE(s,o,e.documentUpdates).next(f=>{c=f.Ps,u=f.Is})),!i.isEqual(Q.min())){const f=n.Ur.getLastRemoteSnapshotVersion(s).next(m=>n.Ur.setTargetsMetadata(s,s.currentSequenceNumber,i));l.push(f)}return B.waitFor(l).next(()=>o.apply(s)).next(()=>n.localDocuments.getLocalViewOfDocuments(s,c,u)).next(()=>c)}).then(s=>(n.os=r,s))}function jE(t,e,n){let i=re(),r=re();return n.forEach(s=>i=i.add(s)),e.getEntries(t,i).next(s=>{let o=Wn();return n.forEach((l,c)=>{const u=s.get(l);c.isFoundDocument()!==u.isFoundDocument()&&(r=r.add(l)),c.isNoDocument()&&c.version.isEqual(Q.min())?(e.removeEntry(l,c.readTime),o=o.insert(l,c)):!u.isValidDocument()||c.version.compareTo(u.version)>0||c.version.compareTo(u.version)===0&&u.hasPendingWrites?(e.addEntry(c),o=o.insert(l,c)):q("LocalStore","Ignoring outdated watch update for ",l,". Current version:",u.version," Watch version:",c.version)}),{Ps:o,Is:r}})}function KE(t,e){const n=J(t);return n.persistence.runTransaction("Get next mutation batch","readonly",i=>(e===void 0&&(e=-1),n.mutationQueue.getNextMutationBatchAfterBatchId(i,e)))}function QE(t,e){const n=J(t);return n.persistence.runTransaction("Allocate target","readwrite",i=>{let r;return n.Ur.getTargetData(i,e).next(s=>s?(r=s,B.resolve(r)):n.Ur.allocateTargetId(i).next(o=>(r=new hi(e,o,"TargetPurposeListen",i.currentSequenceNumber),n.Ur.addTargetData(i,r).next(()=>r))))}).then(i=>{const r=n.os.get(i.targetId);return(r===null||i.snapshotVersion.compareTo(r.snapshotVersion)>0)&&(n.os=n.os.insert(i.targetId,i),n._s.set(e,i.targetId)),i})}async function Gl(t,e,n){const i=J(t),r=i.os.get(e),s=n?"readwrite":"readwrite-primary";try{n||await i.persistence.runTransaction("Release target",s,o=>i.persistence.referenceDelegate.removeTarget(o,r))}catch(o){if(!Ks(o))throw o;q("LocalStore",`Failed to update sequence numbers for target ${e}: ${o}`)}i.os=i.os.remove(e),i._s.delete(r.target)}function Vh(t,e,n){const i=J(t);let r=Q.min(),s=re();return i.persistence.runTransaction("Execute query","readwrite",o=>function(c,u,f){const m=J(c),p=m._s.get(f);return p!==void 0?B.resolve(m.os.get(p)):m.Ur.getTargetData(u,f)}(i,o,fn(e)).next(l=>{if(l)return r=l.lastLimboFreeSnapshotVersion,i.Ur.getMatchingKeysForTargetId(o,l.targetId).next(c=>{s=c})}).next(()=>i.ss.getDocumentsMatchingQuery(o,e,n?r:Q.min(),n?s:re())).next(l=>(JE(i,z_(e),l),{documents:l,Ts:s})))}function JE(t,e,n){let i=t.us.get(e)||Q.min();n.forEach((r,s)=>{s.readTime.compareTo(i)>0&&(i=s.readTime)}),t.us.set(e,i)}class zh{constructor(){this.activeTargetIds=G_()}fs(e){this.activeTargetIds=this.activeTargetIds.add(e)}gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Vs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class XE{constructor(){this.so=new zh,this.oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,n,i){}addLocalQueryTarget(e,n=!0){return n&&this.so.fs(e),this.oo[e]||"not-current"}updateQueryState(e,n,i){this.oo[e]=n}removeLocalQueryTarget(e){this.so.gs(e)}isLocalQueryTarget(e){return this.so.activeTargetIds.has(e)}clearQueryState(e){delete this.oo[e]}getAllActiveQueryTargets(){return this.so.activeTargetIds}isActiveQueryTarget(e){return this.so.activeTargetIds.has(e)}start(){return this.so=new zh,Promise.resolve()}handleUserChange(e,n,i){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ZE{_o(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $h{constructor(){this.ao=()=>this.uo(),this.co=()=>this.lo(),this.ho=[],this.Po()}_o(e){this.ho.push(e)}shutdown(){window.removeEventListener("online",this.ao),window.removeEventListener("offline",this.co)}Po(){window.addEventListener("online",this.ao),window.addEventListener("offline",this.co)}uo(){q("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const e of this.ho)e(0)}lo(){q("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const e of this.ho)e(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
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
 */let Ro=null;function wl(){return Ro===null?Ro=function(){return 268435456+Math.round(2147483648*Math.random())}():Ro++,"0x"+Ro.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const eT={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tT{constructor(e){this.Io=e.Io,this.To=e.To}Eo(e){this.Ao=e}Ro(e){this.Vo=e}mo(e){this.fo=e}onMessage(e){this.po=e}close(){this.To()}send(e){this.Io(e)}yo(){this.Ao()}wo(){this.Vo()}So(e){this.fo(e)}bo(e){this.po(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const st="WebChannelConnection";class nT extends class{constructor(n){this.databaseInfo=n,this.databaseId=n.databaseId;const i=n.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.Do=i+"://"+n.host,this.vo=`projects/${r}/databases/${s}`,this.Co=this.databaseId.database==="(default)"?`project_id=${r}`:`project_id=${r}&database_id=${s}`}get Fo(){return!1}Mo(n,i,r,s,o){const l=wl(),c=this.xo(n,i.toUriEncodedString());q("RestConnection",`Sending RPC '${n}' ${l}:`,c,r);const u={"google-cloud-resource-prefix":this.vo,"x-goog-request-params":this.Co};return this.Oo(u,s,o),this.No(n,c,u,r).then(f=>(q("RestConnection",`Received RPC '${n}' ${l}: `,f),f),f=>{throw Er("RestConnection",`RPC '${n}' ${l} failed with error: `,f,"url: ",c,"request:",r),f})}Lo(n,i,r,s,o,l){return this.Mo(n,i,r,s,o)}Oo(n,i,r){n["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+Br}(),n["Content-Type"]="text/plain",this.databaseInfo.appId&&(n["X-Firebase-GMPID"]=this.databaseInfo.appId),i&&i.headers.forEach((s,o)=>n[o]=s),r&&r.headers.forEach((s,o)=>n[o]=s)}xo(n,i){const r=eT[n];return`${this.Do}/v1/${i}:${r}`}terminate(){}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}No(e,n,i,r){const s=wl();return new Promise((o,l)=>{const c=new Ep;c.setWithCredentials(!0),c.listenOnce(Tp.COMPLETE,()=>{try{switch(c.getLastErrorCode()){case No.NO_ERROR:const f=c.getResponseJson();q(st,`XHR for RPC '${e}' ${s} received:`,JSON.stringify(f)),o(f);break;case No.TIMEOUT:q(st,`RPC '${e}' ${s} timed out`),l(new $(M.DEADLINE_EXCEEDED,"Request time out"));break;case No.HTTP_ERROR:const m=c.getStatus();if(q(st,`RPC '${e}' ${s} failed with status:`,m,"response text:",c.getResponseText()),m>0){let p=c.getResponseJson();Array.isArray(p)&&(p=p[0]);const w=p==null?void 0:p.error;if(w&&w.status&&w.message){const I=function(A){const C=A.toLowerCase().replace(/_/g,"-");return Object.values(M).indexOf(C)>=0?C:M.UNKNOWN}(w.status);l(new $(I,w.message))}else l(new $(M.UNKNOWN,"Server responded with status "+c.getStatus()))}else l(new $(M.UNAVAILABLE,"Connection failed."));break;default:j()}}finally{q(st,`RPC '${e}' ${s} completed.`)}});const u=JSON.stringify(r);q(st,`RPC '${e}' ${s} sending request:`,r),c.send(n,"POST",u,i,15)})}Bo(e,n,i){const r=wl(),s=[this.Do,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=xp(),l=Sp(),c={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},u=this.longPollingOptions.timeoutSeconds;u!==void 0&&(c.longPollingTimeout=Math.round(1e3*u)),this.useFetchStreams&&(c.useFetchStreams=!0),this.Oo(c.initMessageHeaders,n,i),c.encodeInitMessageHeaders=!0;const f=s.join("");q(st,`Creating RPC '${e}' stream ${r}: ${f}`,c);const m=o.createWebChannel(f,c);let p=!1,w=!1;const I=new tT({Io:A=>{w?q(st,`Not sending because RPC '${e}' stream ${r} is closed:`,A):(p||(q(st,`Opening RPC '${e}' stream ${r} transport.`),m.open(),p=!0),q(st,`RPC '${e}' stream ${r} sending:`,A),m.send(A))},To:()=>m.close()}),S=(A,C,P)=>{A.listen(C,L=>{try{P(L)}catch(N){setTimeout(()=>{throw N},0)}})};return S(m,as.EventType.OPEN,()=>{w||(q(st,`RPC '${e}' stream ${r} transport opened.`),I.yo())}),S(m,as.EventType.CLOSE,()=>{w||(w=!0,q(st,`RPC '${e}' stream ${r} transport closed`),I.So())}),S(m,as.EventType.ERROR,A=>{w||(w=!0,Er(st,`RPC '${e}' stream ${r} transport errored:`,A),I.So(new $(M.UNAVAILABLE,"The operation could not be completed")))}),S(m,as.EventType.MESSAGE,A=>{var C;if(!w){const P=A.data[0];ge(!!P);const L=P,N=L.error||((C=L[0])===null||C===void 0?void 0:C.error);if(N){q(st,`RPC '${e}' stream ${r} received error:`,N);const z=N.status;let U=function(_){const b=ze[_];if(b!==void 0)return Jp(b)}(z),T=N.message;U===void 0&&(U=M.INTERNAL,T="Unknown error status: "+z+" with message "+N.message),w=!0,I.So(new $(U,T)),m.close()}else q(st,`RPC '${e}' stream ${r} received:`,P),I.bo(P)}}),S(l,Ip.STAT_EVENT,A=>{A.stat===Nl.PROXY?q(st,`RPC '${e}' stream ${r} detected buffering proxy`):A.stat===Nl.NOPROXY&&q(st,`RPC '${e}' stream ${r} detected no buffering proxy`)}),setTimeout(()=>{I.wo()},0),I}}function _l(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ra(t){return new hE(t,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cm{constructor(e,n,i=1e3,r=1.5,s=6e4){this.ui=e,this.timerId=n,this.ko=i,this.qo=r,this.Qo=s,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(e){this.cancel();const n=Math.floor(this.Ko+this.zo()),i=Math.max(0,Date.now()-this.Uo),r=Math.max(0,n-i);r>0&&q("ExponentialBackoff",`Backing off for ${r} ms (base delay: ${this.Ko} ms, delay with jitter: ${n} ms, last attempt: ${i} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,r,()=>(this.Uo=Date.now(),e())),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){this.$o!==null&&(this.$o.skipDelay(),this.$o=null)}cancel(){this.$o!==null&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class um{constructor(e,n,i,r,s,o,l,c){this.ui=e,this.Ho=i,this.Jo=r,this.connection=s,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=l,this.listener=c,this.state=0,this.Yo=0,this.Zo=null,this.Xo=null,this.stream=null,this.e_=0,this.t_=new cm(e,n)}n_(){return this.state===1||this.state===5||this.r_()}r_(){return this.state===2||this.state===3}start(){this.e_=0,this.state!==4?this.auth():this.i_()}async stop(){this.n_()&&await this.close(0)}s_(){this.state=0,this.t_.reset()}o_(){this.r_()&&this.Zo===null&&(this.Zo=this.ui.enqueueAfterDelay(this.Ho,6e4,()=>this.__()))}a_(e){this.u_(),this.stream.send(e)}async __(){if(this.r_())return this.close(0)}u_(){this.Zo&&(this.Zo.cancel(),this.Zo=null)}c_(){this.Xo&&(this.Xo.cancel(),this.Xo=null)}async close(e,n){this.u_(),this.c_(),this.t_.cancel(),this.Yo++,e!==4?this.t_.reset():n&&n.code===M.RESOURCE_EXHAUSTED?(Hn(n.toString()),Hn("Using maximum backoff delay to prevent overloading the backend."),this.t_.Wo()):n&&n.code===M.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.l_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.mo(n)}l_(){}auth(){this.state=1;const e=this.h_(this.Yo),n=this.Yo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([i,r])=>{this.Yo===n&&this.P_(i,r)},i=>{e(()=>{const r=new $(M.UNKNOWN,"Fetching auth token failed: "+i.message);return this.I_(r)})})}P_(e,n){const i=this.h_(this.Yo);this.stream=this.T_(e,n),this.stream.Eo(()=>{i(()=>this.listener.Eo())}),this.stream.Ro(()=>{i(()=>(this.state=2,this.Xo=this.ui.enqueueAfterDelay(this.Jo,1e4,()=>(this.r_()&&(this.state=3),Promise.resolve())),this.listener.Ro()))}),this.stream.mo(r=>{i(()=>this.I_(r))}),this.stream.onMessage(r=>{i(()=>++this.e_==1?this.E_(r):this.onNext(r))})}i_(){this.state=5,this.t_.Go(async()=>{this.state=0,this.start()})}I_(e){return q("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}h_(e){return n=>{this.ui.enqueueAndForget(()=>this.Yo===e?n():(q("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class iT extends um{constructor(e,n,i,r,s,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",n,i,r,o),this.serializer=s}T_(e,n){return this.connection.Bo("Listen",e,n)}E_(e){return this.onNext(e)}onNext(e){this.t_.reset();const n=mE(this.serializer,e),i=function(s){if(!("targetChange"in s))return Q.min();const o=s.targetChange;return o.targetIds&&o.targetIds.length?Q.min():o.readTime?pn(o.readTime):Q.min()}(e);return this.listener.d_(n,i)}A_(e){const n={};n.database=Wl(this.serializer),n.addTarget=function(s,o){let l;const c=o.target;if(l=zl(c)?{documents:vE(s,c)}:{query:bE(s,c)._t},l.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){l.resumeToken=em(s,o.resumeToken);const u=Ul(s,o.expectedCount);u!==null&&(l.expectedCount=u)}else if(o.snapshotVersion.compareTo(Q.min())>0){l.readTime=oa(s,o.snapshotVersion.toTimestamp());const u=Ul(s,o.expectedCount);u!==null&&(l.expectedCount=u)}return l}(this.serializer,e);const i=_E(this.serializer,e);i&&(n.labels=i),this.a_(n)}R_(e){const n={};n.database=Wl(this.serializer),n.removeTarget=e,this.a_(n)}}class rT extends um{constructor(e,n,i,r,s,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",n,i,r,o),this.serializer=s}get V_(){return this.e_>0}start(){this.lastStreamToken=void 0,super.start()}l_(){this.V_&&this.m_([])}T_(e,n){return this.connection.Bo("Write",e,n)}E_(e){return ge(!!e.streamToken),this.lastStreamToken=e.streamToken,ge(!e.writeResults||e.writeResults.length===0),this.listener.f_()}onNext(e){ge(!!e.streamToken),this.lastStreamToken=e.streamToken,this.t_.reset();const n=yE(e.writeResults,e.commitTime),i=pn(e.commitTime);return this.listener.g_(i,n)}p_(){const e={};e.database=Wl(this.serializer),this.a_(e)}m_(e){const n={streamToken:this.lastStreamToken,writes:e.map(i=>gE(this.serializer,i))};this.a_(n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sT extends class{}{constructor(e,n,i,r){super(),this.authCredentials=e,this.appCheckCredentials=n,this.connection=i,this.serializer=r,this.y_=!1}w_(){if(this.y_)throw new $(M.FAILED_PRECONDITION,"The client has already been terminated.")}Mo(e,n,i,r){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,o])=>this.connection.Mo(e,ql(n,i),r,s,o)).catch(s=>{throw s.name==="FirebaseError"?(s.code===M.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),s):new $(M.UNKNOWN,s.toString())})}Lo(e,n,i,r,s){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,l])=>this.connection.Lo(e,ql(n,i),r,o,l,s)).catch(o=>{throw o.name==="FirebaseError"?(o.code===M.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new $(M.UNKNOWN,o.toString())})}terminate(){this.y_=!0,this.connection.terminate()}}class oT{constructor(e,n){this.asyncQueue=e,this.onlineStateHandler=n,this.state="Unknown",this.S_=0,this.b_=null,this.D_=!0}v_(){this.S_===0&&(this.C_("Unknown"),this.b_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.b_=null,this.F_("Backend didn't respond within 10 seconds."),this.C_("Offline"),Promise.resolve())))}M_(e){this.state==="Online"?this.C_("Unknown"):(this.S_++,this.S_>=1&&(this.x_(),this.F_(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.C_("Offline")))}set(e){this.x_(),this.S_=0,e==="Online"&&(this.D_=!1),this.C_(e)}C_(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}F_(e){const n=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.D_?(Hn(n),this.D_=!1):q("OnlineStateTracker",n)}x_(){this.b_!==null&&(this.b_.cancel(),this.b_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class aT{constructor(e,n,i,r,s){this.localStore=e,this.datastore=n,this.asyncQueue=i,this.remoteSyncer={},this.O_=[],this.N_=new Map,this.L_=new Set,this.B_=[],this.k_=s,this.k_._o(o=>{i.enqueueAndForget(async()=>{tr(this)&&(q("RemoteStore","Restarting streams for network reachability change."),await async function(c){const u=J(c);u.L_.add(4),await Xs(u),u.q_.set("Unknown"),u.L_.delete(4),await Pa(u)}(this))})}),this.q_=new oT(i,r)}}async function Pa(t){if(tr(t))for(const e of t.B_)await e(!0)}async function Xs(t){for(const e of t.B_)await e(!1)}function dm(t,e){const n=J(t);n.N_.has(e.targetId)||(n.N_.set(e.targetId,e),Zc(n)?Xc(n):Or(n).r_()&&Jc(n,e))}function Qc(t,e){const n=J(t),i=Or(n);n.N_.delete(e),i.r_()&&hm(n,e),n.N_.size===0&&(i.r_()?i.o_():tr(n)&&n.q_.set("Unknown"))}function Jc(t,e){if(t.Q_.xe(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(Q.min())>0){const n=t.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(n)}Or(t).A_(e)}function hm(t,e){t.Q_.xe(e),Or(t).R_(e)}function Xc(t){t.Q_=new lE({getRemoteKeysForTarget:e=>t.remoteSyncer.getRemoteKeysForTarget(e),ot:e=>t.N_.get(e)||null,tt:()=>t.datastore.serializer.databaseId}),Or(t).start(),t.q_.v_()}function Zc(t){return tr(t)&&!Or(t).n_()&&t.N_.size>0}function tr(t){return J(t).L_.size===0}function fm(t){t.Q_=void 0}async function lT(t){t.q_.set("Online")}async function cT(t){t.N_.forEach((e,n)=>{Jc(t,e)})}async function uT(t,e){fm(t),Zc(t)?(t.q_.M_(e),Xc(t)):t.q_.set("Unknown")}async function dT(t,e,n){if(t.q_.set("Online"),e instanceof Zp&&e.state===2&&e.cause)try{await async function(r,s){const o=s.cause;for(const l of s.targetIds)r.N_.has(l)&&(await r.remoteSyncer.rejectListen(l,o),r.N_.delete(l),r.Q_.removeTarget(l))}(t,e)}catch(i){q("RemoteStore","Failed to remove targets %s: %s ",e.targetIds.join(","),i),await aa(t,i)}else if(e instanceof Vo?t.Q_.Ke(e):e instanceof Xp?t.Q_.He(e):t.Q_.We(e),!n.isEqual(Q.min()))try{const i=await lm(t.localStore);n.compareTo(i)>=0&&await function(s,o){const l=s.Q_.rt(o);return l.targetChanges.forEach((c,u)=>{if(c.resumeToken.approximateByteSize()>0){const f=s.N_.get(u);f&&s.N_.set(u,f.withResumeToken(c.resumeToken,o))}}),l.targetMismatches.forEach((c,u)=>{const f=s.N_.get(c);if(!f)return;s.N_.set(c,f.withResumeToken(et.EMPTY_BYTE_STRING,f.snapshotVersion)),hm(s,c);const m=new hi(f.target,c,u,f.sequenceNumber);Jc(s,m)}),s.remoteSyncer.applyRemoteEvent(l)}(t,n)}catch(i){q("RemoteStore","Failed to raise snapshot:",i),await aa(t,i)}}async function aa(t,e,n){if(!Ks(e))throw e;t.L_.add(1),await Xs(t),t.q_.set("Offline"),n||(n=()=>lm(t.localStore)),t.asyncQueue.enqueueRetryable(async()=>{q("RemoteStore","Retrying IndexedDB access"),await n(),t.L_.delete(1),await Pa(t)})}function pm(t,e){return e().catch(n=>aa(t,n,e))}async function Ma(t){const e=J(t),n=_i(e);let i=e.O_.length>0?e.O_[e.O_.length-1].batchId:-1;for(;hT(e);)try{const r=await KE(e.localStore,i);if(r===null){e.O_.length===0&&n.o_();break}i=r.batchId,fT(e,r)}catch(r){await aa(e,r)}mm(e)&&gm(e)}function hT(t){return tr(t)&&t.O_.length<10}function fT(t,e){t.O_.push(e);const n=_i(t);n.r_()&&n.V_&&n.m_(e.mutations)}function mm(t){return tr(t)&&!_i(t).n_()&&t.O_.length>0}function gm(t){_i(t).start()}async function pT(t){_i(t).p_()}async function mT(t){const e=_i(t);for(const n of t.O_)e.m_(n.mutations)}async function gT(t,e,n){const i=t.O_.shift(),r=Hc.from(i,e,n);await pm(t,()=>t.remoteSyncer.applySuccessfulWrite(r)),await Ma(t)}async function yT(t,e){e&&_i(t).V_&&await async function(i,r){if(function(o){return sE(o)&&o!==M.ABORTED}(r.code)){const s=i.O_.shift();_i(i).s_(),await pm(i,()=>i.remoteSyncer.rejectFailedWrite(s.batchId,r)),await Ma(i)}}(t,e),mm(t)&&gm(t)}async function Uh(t,e){const n=J(t);n.asyncQueue.verifyOperationInProgress(),q("RemoteStore","RemoteStore received new credentials");const i=tr(n);n.L_.add(3),await Xs(n),i&&n.q_.set("Unknown"),await n.remoteSyncer.handleCredentialChange(e),n.L_.delete(3),await Pa(n)}async function vT(t,e){const n=J(t);e?(n.L_.delete(2),await Pa(n)):e||(n.L_.add(2),await Xs(n),n.q_.set("Unknown"))}function Or(t){return t.K_||(t.K_=function(n,i,r){const s=J(n);return s.w_(),new iT(i,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,r)}(t.datastore,t.asyncQueue,{Eo:lT.bind(null,t),Ro:cT.bind(null,t),mo:uT.bind(null,t),d_:dT.bind(null,t)}),t.B_.push(async e=>{e?(t.K_.s_(),Zc(t)?Xc(t):t.q_.set("Unknown")):(await t.K_.stop(),fm(t))})),t.K_}function _i(t){return t.U_||(t.U_=function(n,i,r){const s=J(n);return s.w_(),new rT(i,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,r)}(t.datastore,t.asyncQueue,{Eo:()=>Promise.resolve(),Ro:pT.bind(null,t),mo:yT.bind(null,t),f_:mT.bind(null,t),g_:gT.bind(null,t)}),t.B_.push(async e=>{e?(t.U_.s_(),await Ma(t)):(await t.U_.stop(),t.O_.length>0&&(q("RemoteStore",`Stopping write stream with ${t.O_.length} pending writes`),t.O_=[]))})),t.U_}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eu{constructor(e,n,i,r,s){this.asyncQueue=e,this.timerId=n,this.targetTimeMs=i,this.op=r,this.removalCallback=s,this.deferred=new Vn,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(o=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,n,i,r,s){const o=Date.now()+i,l=new eu(e,n,o,r,s);return l.start(i),l}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new $(M.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function tu(t,e){if(Hn("AsyncQueue",`${e}: ${t}`),Ks(t))return new $(M.UNAVAILABLE,`${e}: ${t}`);throw t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gr{constructor(e){this.comparator=e?(n,i)=>e(n,i)||W.comparator(n.key,i.key):(n,i)=>W.comparator(n.key,i.key),this.keyedMap=ls(),this.sortedSet=new De(this.comparator)}static emptySet(e){return new gr(e.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const n=this.keyedMap.get(e);return n?this.sortedSet.indexOf(n):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((n,i)=>(e(n),!1))}add(e){const n=this.delete(e.key);return n.copy(n.keyedMap.insert(e.key,e),n.sortedSet.insert(e,null))}delete(e){const n=this.get(e);return n?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(n)):this}isEqual(e){if(!(e instanceof gr)||this.size!==e.size)return!1;const n=this.sortedSet.getIterator(),i=e.sortedSet.getIterator();for(;n.hasNext();){const r=n.getNext().key,s=i.getNext().key;if(!r.isEqual(s))return!1}return!0}toString(){const e=[];return this.forEach(n=>{e.push(n.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,n){const i=new gr;return i.comparator=this.comparator,i.keyedMap=e,i.sortedSet=n,i}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qh{constructor(){this.W_=new De(W.comparator)}track(e){const n=e.doc.key,i=this.W_.get(n);i?e.type!==0&&i.type===3?this.W_=this.W_.insert(n,e):e.type===3&&i.type!==1?this.W_=this.W_.insert(n,{type:i.type,doc:e.doc}):e.type===2&&i.type===2?this.W_=this.W_.insert(n,{type:2,doc:e.doc}):e.type===2&&i.type===0?this.W_=this.W_.insert(n,{type:0,doc:e.doc}):e.type===1&&i.type===0?this.W_=this.W_.remove(n):e.type===1&&i.type===2?this.W_=this.W_.insert(n,{type:1,doc:i.doc}):e.type===0&&i.type===1?this.W_=this.W_.insert(n,{type:2,doc:e.doc}):j():this.W_=this.W_.insert(n,e)}G_(){const e=[];return this.W_.inorderTraversal((n,i)=>{e.push(i)}),e}}class Ar{constructor(e,n,i,r,s,o,l,c,u){this.query=e,this.docs=n,this.oldDocs=i,this.docChanges=r,this.mutatedKeys=s,this.fromCache=o,this.syncStateChanged=l,this.excludesMetadataChanges=c,this.hasCachedResults=u}static fromInitialDocuments(e,n,i,r,s){const o=[];return n.forEach(l=>{o.push({type:0,doc:l})}),new Ar(e,n,gr.emptySet(n),o,i,r,!0,!1,s)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Ia(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const n=this.docChanges,i=e.docChanges;if(n.length!==i.length)return!1;for(let r=0;r<n.length;r++)if(n[r].type!==i[r].type||!n[r].doc.isEqual(i[r].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bT{constructor(){this.z_=void 0,this.j_=[]}H_(){return this.j_.some(e=>e.J_())}}class wT{constructor(){this.queries=Hh(),this.onlineState="Unknown",this.Y_=new Set}terminate(){(function(n,i){const r=J(n),s=r.queries;r.queries=Hh(),s.forEach((o,l)=>{for(const c of l.j_)c.onError(i)})})(this,new $(M.ABORTED,"Firestore shutting down"))}}function Hh(){return new Nr(t=>Vp(t),Ia)}async function ym(t,e){const n=J(t);let i=3;const r=e.query;let s=n.queries.get(r);s?!s.H_()&&e.J_()&&(i=2):(s=new bT,i=e.J_()?0:1);try{switch(i){case 0:s.z_=await n.onListen(r,!0);break;case 1:s.z_=await n.onListen(r,!1);break;case 2:await n.onFirstRemoteStoreListen(r)}}catch(o){const l=tu(o,`Initialization of query '${cr(e.query)}' failed`);return void e.onError(l)}n.queries.set(r,s),s.j_.push(e),e.Z_(n.onlineState),s.z_&&e.X_(s.z_)&&nu(n)}async function vm(t,e){const n=J(t),i=e.query;let r=3;const s=n.queries.get(i);if(s){const o=s.j_.indexOf(e);o>=0&&(s.j_.splice(o,1),s.j_.length===0?r=e.J_()?0:1:!s.H_()&&e.J_()&&(r=2))}switch(r){case 0:return n.queries.delete(i),n.onUnlisten(i,!0);case 1:return n.queries.delete(i),n.onUnlisten(i,!1);case 2:return n.onLastRemoteStoreUnlisten(i);default:return}}function _T(t,e){const n=J(t);let i=!1;for(const r of e){const s=r.query,o=n.queries.get(s);if(o){for(const l of o.j_)l.X_(r)&&(i=!0);o.z_=r}}i&&nu(n)}function ET(t,e,n){const i=J(t),r=i.queries.get(e);if(r)for(const s of r.j_)s.onError(n);i.queries.delete(e)}function nu(t){t.Y_.forEach(e=>{e.next()})}var Yl,Wh;(Wh=Yl||(Yl={})).ea="default",Wh.Cache="cache";class bm{constructor(e,n,i){this.query=e,this.ta=n,this.na=!1,this.ra=null,this.onlineState="Unknown",this.options=i||{}}X_(e){if(!this.options.includeMetadataChanges){const i=[];for(const r of e.docChanges)r.type!==3&&i.push(r);e=new Ar(e.query,e.docs,e.oldDocs,i,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let n=!1;return this.na?this.ia(e)&&(this.ta.next(e),n=!0):this.sa(e,this.onlineState)&&(this.oa(e),n=!0),this.ra=e,n}onError(e){this.ta.error(e)}Z_(e){this.onlineState=e;let n=!1;return this.ra&&!this.na&&this.sa(this.ra,e)&&(this.oa(this.ra),n=!0),n}sa(e,n){if(!e.fromCache||!this.J_())return!0;const i=n!=="Offline";return(!this.options._a||!i)&&(!e.docs.isEmpty()||e.hasCachedResults||n==="Offline")}ia(e){if(e.docChanges.length>0)return!0;const n=this.ra&&this.ra.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!n)&&this.options.includeMetadataChanges===!0}oa(e){e=Ar.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.na=!0,this.ta.next(e)}J_(){return this.options.source!==Yl.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wm{constructor(e){this.key=e}}class _m{constructor(e){this.key=e}}class TT{constructor(e,n){this.query=e,this.Ta=n,this.Ea=null,this.hasCachedResults=!1,this.current=!1,this.da=re(),this.mutatedKeys=re(),this.Aa=zp(e),this.Ra=new gr(this.Aa)}get Va(){return this.Ta}ma(e,n){const i=n?n.fa:new qh,r=n?n.Ra:this.Ra;let s=n?n.mutatedKeys:this.mutatedKeys,o=r,l=!1;const c=this.query.limitType==="F"&&r.size===this.query.limit?r.last():null,u=this.query.limitType==="L"&&r.size===this.query.limit?r.first():null;if(e.inorderTraversal((f,m)=>{const p=r.get(f),w=Sa(this.query,m)?m:null,I=!!p&&this.mutatedKeys.has(p.key),S=!!w&&(w.hasLocalMutations||this.mutatedKeys.has(w.key)&&w.hasCommittedMutations);let A=!1;p&&w?p.data.isEqual(w.data)?I!==S&&(i.track({type:3,doc:w}),A=!0):this.ga(p,w)||(i.track({type:2,doc:w}),A=!0,(c&&this.Aa(w,c)>0||u&&this.Aa(w,u)<0)&&(l=!0)):!p&&w?(i.track({type:0,doc:w}),A=!0):p&&!w&&(i.track({type:1,doc:p}),A=!0,(c||u)&&(l=!0)),A&&(w?(o=o.add(w),s=S?s.add(f):s.delete(f)):(o=o.delete(f),s=s.delete(f)))}),this.query.limit!==null)for(;o.size>this.query.limit;){const f=this.query.limitType==="F"?o.last():o.first();o=o.delete(f.key),s=s.delete(f.key),i.track({type:1,doc:f})}return{Ra:o,fa:i,ns:l,mutatedKeys:s}}ga(e,n){return e.hasLocalMutations&&n.hasCommittedMutations&&!n.hasLocalMutations}applyChanges(e,n,i,r){const s=this.Ra;this.Ra=e.Ra,this.mutatedKeys=e.mutatedKeys;const o=e.fa.G_();o.sort((f,m)=>function(w,I){const S=A=>{switch(A){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return j()}};return S(w)-S(I)}(f.type,m.type)||this.Aa(f.doc,m.doc)),this.pa(i),r=r!=null&&r;const l=n&&!r?this.ya():[],c=this.da.size===0&&this.current&&!r?1:0,u=c!==this.Ea;return this.Ea=c,o.length!==0||u?{snapshot:new Ar(this.query,e.Ra,s,o,e.mutatedKeys,c===0,u,!1,!!i&&i.resumeToken.approximateByteSize()>0),wa:l}:{wa:l}}Z_(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Ra:this.Ra,fa:new qh,mutatedKeys:this.mutatedKeys,ns:!1},!1)):{wa:[]}}Sa(e){return!this.Ta.has(e)&&!!this.Ra.has(e)&&!this.Ra.get(e).hasLocalMutations}pa(e){e&&(e.addedDocuments.forEach(n=>this.Ta=this.Ta.add(n)),e.modifiedDocuments.forEach(n=>{}),e.removedDocuments.forEach(n=>this.Ta=this.Ta.delete(n)),this.current=e.current)}ya(){if(!this.current)return[];const e=this.da;this.da=re(),this.Ra.forEach(i=>{this.Sa(i.key)&&(this.da=this.da.add(i.key))});const n=[];return e.forEach(i=>{this.da.has(i)||n.push(new _m(i))}),this.da.forEach(i=>{e.has(i)||n.push(new wm(i))}),n}ba(e){this.Ta=e.Ts,this.da=re();const n=this.ma(e.documents);return this.applyChanges(n,!0)}Da(){return Ar.fromInitialDocuments(this.query,this.Ra,this.mutatedKeys,this.Ea===0,this.hasCachedResults)}}class IT{constructor(e,n,i){this.query=e,this.targetId=n,this.view=i}}class ST{constructor(e){this.key=e,this.va=!1}}class xT{constructor(e,n,i,r,s,o){this.localStore=e,this.remoteStore=n,this.eventManager=i,this.sharedClientState=r,this.currentUser=s,this.maxConcurrentLimboResolutions=o,this.Ca={},this.Fa=new Nr(l=>Vp(l),Ia),this.Ma=new Map,this.xa=new Set,this.Oa=new De(W.comparator),this.Na=new Map,this.La=new Yc,this.Ba={},this.ka=new Map,this.qa=xr.kn(),this.onlineState="Unknown",this.Qa=void 0}get isPrimaryClient(){return this.Qa===!0}}async function AT(t,e,n=!0){const i=Am(t);let r;const s=i.Fa.get(e);return s?(i.sharedClientState.addLocalQueryTarget(s.targetId),r=s.view.Da()):r=await Em(i,e,n,!0),r}async function kT(t,e){const n=Am(t);await Em(n,e,!0,!1)}async function Em(t,e,n,i){const r=await QE(t.localStore,fn(e)),s=r.targetId,o=t.sharedClientState.addLocalQueryTarget(s,n);let l;return i&&(l=await CT(t,e,s,o==="current",r.resumeToken)),t.isPrimaryClient&&n&&dm(t.remoteStore,r),l}async function CT(t,e,n,i,r){t.Ka=(m,p,w)=>async function(S,A,C,P){let L=A.view.ma(C);L.ns&&(L=await Vh(S.localStore,A.query,!1).then(({documents:T})=>A.view.ma(T,L)));const N=P&&P.targetChanges.get(A.targetId),z=P&&P.targetMismatches.get(A.targetId)!=null,U=A.view.applyChanges(L,S.isPrimaryClient,N,z);return Yh(S,A.targetId,U.wa),U.snapshot}(t,m,p,w);const s=await Vh(t.localStore,e,!0),o=new TT(e,s.Ts),l=o.ma(s.documents),c=Js.createSynthesizedTargetChangeForCurrentChange(n,i&&t.onlineState!=="Offline",r),u=o.applyChanges(l,t.isPrimaryClient,c);Yh(t,n,u.wa);const f=new IT(e,n,o);return t.Fa.set(e,f),t.Ma.has(n)?t.Ma.get(n).push(e):t.Ma.set(n,[e]),u.snapshot}async function RT(t,e,n){const i=J(t),r=i.Fa.get(e),s=i.Ma.get(r.targetId);if(s.length>1)return i.Ma.set(r.targetId,s.filter(o=>!Ia(o,e))),void i.Fa.delete(e);i.isPrimaryClient?(i.sharedClientState.removeLocalQueryTarget(r.targetId),i.sharedClientState.isActiveQueryTarget(r.targetId)||await Gl(i.localStore,r.targetId,!1).then(()=>{i.sharedClientState.clearQueryState(r.targetId),n&&Qc(i.remoteStore,r.targetId),jl(i,r.targetId)}).catch(js)):(jl(i,r.targetId),await Gl(i.localStore,r.targetId,!0))}async function PT(t,e){const n=J(t),i=n.Fa.get(e),r=n.Ma.get(i.targetId);n.isPrimaryClient&&r.length===1&&(n.sharedClientState.removeLocalQueryTarget(i.targetId),Qc(n.remoteStore,i.targetId))}async function MT(t,e,n){const i=VT(t);try{const r=await function(o,l){const c=J(o),u=He.now(),f=l.reduce((w,I)=>w.add(I.key),re());let m,p;return c.persistence.runTransaction("Locally write mutations","readwrite",w=>{let I=Wn(),S=re();return c.cs.getEntries(w,f).next(A=>{I=A,I.forEach((C,P)=>{P.isValidDocument()||(S=S.add(C))})}).next(()=>c.localDocuments.getOverlayedDocuments(w,I)).next(A=>{m=A;const C=[];for(const P of l){const L=eE(P,m.get(P.key).overlayedDocument);L!=null&&C.push(new Ii(P.key,L,Pp(L.value.mapValue),wt.exists(!0)))}return c.mutationQueue.addMutationBatch(w,u,C,l)}).next(A=>{p=A;const C=A.applyToLocalDocumentSet(m,S);return c.documentOverlayCache.saveOverlays(w,A.batchId,C)})}).then(()=>({batchId:p.batchId,changes:Up(m)}))}(i.localStore,e);i.sharedClientState.addPendingMutation(r.batchId),function(o,l,c){let u=o.Ba[o.currentUser.toKey()];u||(u=new De(he)),u=u.insert(l,c),o.Ba[o.currentUser.toKey()]=u}(i,r.batchId,n),await Zs(i,r.changes),await Ma(i.remoteStore)}catch(r){const s=tu(r,"Failed to persist write");n.reject(s)}}async function Tm(t,e){const n=J(t);try{const i=await YE(n.localStore,e);e.targetChanges.forEach((r,s)=>{const o=n.Na.get(s);o&&(ge(r.addedDocuments.size+r.modifiedDocuments.size+r.removedDocuments.size<=1),r.addedDocuments.size>0?o.va=!0:r.modifiedDocuments.size>0?ge(o.va):r.removedDocuments.size>0&&(ge(o.va),o.va=!1))}),await Zs(n,i,e)}catch(i){await js(i)}}function Gh(t,e,n){const i=J(t);if(i.isPrimaryClient&&n===0||!i.isPrimaryClient&&n===1){const r=[];i.Fa.forEach((s,o)=>{const l=o.view.Z_(e);l.snapshot&&r.push(l.snapshot)}),function(o,l){const c=J(o);c.onlineState=l;let u=!1;c.queries.forEach((f,m)=>{for(const p of m.j_)p.Z_(l)&&(u=!0)}),u&&nu(c)}(i.eventManager,e),r.length&&i.Ca.d_(r),i.onlineState=e,i.isPrimaryClient&&i.sharedClientState.setOnlineState(e)}}async function DT(t,e,n){const i=J(t);i.sharedClientState.updateQueryState(e,"rejected",n);const r=i.Na.get(e),s=r&&r.key;if(s){let o=new De(W.comparator);o=o.insert(s,at.newNoDocument(s,Q.min()));const l=re().add(s),c=new Ca(Q.min(),new Map,new De(he),o,l);await Tm(i,c),i.Oa=i.Oa.remove(s),i.Na.delete(e),iu(i)}else await Gl(i.localStore,e,!1).then(()=>jl(i,e,n)).catch(js)}async function BT(t,e){const n=J(t),i=e.batch.batchId;try{const r=await GE(n.localStore,e);Sm(n,i,null),Im(n,i),n.sharedClientState.updateMutationState(i,"acknowledged"),await Zs(n,r)}catch(r){await js(r)}}async function LT(t,e,n){const i=J(t);try{const r=await function(o,l){const c=J(o);return c.persistence.runTransaction("Reject batch","readwrite-primary",u=>{let f;return c.mutationQueue.lookupMutationBatch(u,l).next(m=>(ge(m!==null),f=m.keys(),c.mutationQueue.removeMutationBatch(u,m))).next(()=>c.mutationQueue.performConsistencyCheck(u)).next(()=>c.documentOverlayCache.removeOverlaysForBatchId(u,f,l)).next(()=>c.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(u,f)).next(()=>c.localDocuments.getDocuments(u,f))})}(i.localStore,e);Sm(i,e,n),Im(i,e),i.sharedClientState.updateMutationState(e,"rejected",n),await Zs(i,r)}catch(r){await js(r)}}function Im(t,e){(t.ka.get(e)||[]).forEach(n=>{n.resolve()}),t.ka.delete(e)}function Sm(t,e,n){const i=J(t);let r=i.Ba[i.currentUser.toKey()];if(r){const s=r.get(e);s&&(n?s.reject(n):s.resolve(),r=r.remove(e)),i.Ba[i.currentUser.toKey()]=r}}function jl(t,e,n=null){t.sharedClientState.removeLocalQueryTarget(e);for(const i of t.Ma.get(e))t.Fa.delete(i),n&&t.Ca.$a(i,n);t.Ma.delete(e),t.isPrimaryClient&&t.La.gr(e).forEach(i=>{t.La.containsKey(i)||xm(t,i)})}function xm(t,e){t.xa.delete(e.path.canonicalString());const n=t.Oa.get(e);n!==null&&(Qc(t.remoteStore,n),t.Oa=t.Oa.remove(e),t.Na.delete(n),iu(t))}function Yh(t,e,n){for(const i of n)i instanceof wm?(t.La.addReference(i.key,e),NT(t,i)):i instanceof _m?(q("SyncEngine","Document no longer in limbo: "+i.key),t.La.removeReference(i.key,e),t.La.containsKey(i.key)||xm(t,i.key)):j()}function NT(t,e){const n=e.key,i=n.path.canonicalString();t.Oa.get(n)||t.xa.has(i)||(q("SyncEngine","New document in limbo: "+n),t.xa.add(i),iu(t))}function iu(t){for(;t.xa.size>0&&t.Oa.size<t.maxConcurrentLimboResolutions;){const e=t.xa.values().next().value;t.xa.delete(e);const n=new W(Se.fromString(e)),i=t.qa.next();t.Na.set(i,new ST(n)),t.Oa=t.Oa.insert(n,i),dm(t.remoteStore,new hi(fn(Uc(n.path)),i,"TargetPurposeLimboResolution",Nc.oe))}}async function Zs(t,e,n){const i=J(t),r=[],s=[],o=[];i.Fa.isEmpty()||(i.Fa.forEach((l,c)=>{o.push(i.Ka(c,e,n).then(u=>{var f;if((u||n)&&i.isPrimaryClient){const m=u?!u.fromCache:(f=n==null?void 0:n.targetChanges.get(c.targetId))===null||f===void 0?void 0:f.current;i.sharedClientState.updateQueryState(c.targetId,m?"current":"not-current")}if(u){r.push(u);const m=Kc.Wi(c.targetId,u);s.push(m)}}))}),await Promise.all(o),i.Ca.d_(r),await async function(c,u){const f=J(c);try{await f.persistence.runTransaction("notifyLocalViewChanges","readwrite",m=>B.forEach(u,p=>B.forEach(p.$i,w=>f.persistence.referenceDelegate.addReference(m,p.targetId,w)).next(()=>B.forEach(p.Ui,w=>f.persistence.referenceDelegate.removeReference(m,p.targetId,w)))))}catch(m){if(!Ks(m))throw m;q("LocalStore","Failed to update sequence numbers: "+m)}for(const m of u){const p=m.targetId;if(!m.fromCache){const w=f.os.get(p),I=w.snapshotVersion,S=w.withLastLimboFreeSnapshotVersion(I);f.os=f.os.insert(p,S)}}}(i.localStore,s))}async function OT(t,e){const n=J(t);if(!n.currentUser.isEqual(e)){q("SyncEngine","User change. New user:",e.toKey());const i=await am(n.localStore,e);n.currentUser=e,function(s,o){s.ka.forEach(l=>{l.forEach(c=>{c.reject(new $(M.CANCELLED,o))})}),s.ka.clear()}(n,"'waitForPendingWrites' promise is rejected due to a user change."),n.sharedClientState.handleUserChange(e,i.removedBatchIds,i.addedBatchIds),await Zs(n,i.hs)}}function FT(t,e){const n=J(t),i=n.Na.get(e);if(i&&i.va)return re().add(i.key);{let r=re();const s=n.Ma.get(e);if(!s)return r;for(const o of s){const l=n.Fa.get(o);r=r.unionWith(l.view.Va)}return r}}function Am(t){const e=J(t);return e.remoteStore.remoteSyncer.applyRemoteEvent=Tm.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=FT.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=DT.bind(null,e),e.Ca.d_=_T.bind(null,e.eventManager),e.Ca.$a=ET.bind(null,e.eventManager),e}function VT(t){const e=J(t);return e.remoteStore.remoteSyncer.applySuccessfulWrite=BT.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=LT.bind(null,e),e}class la{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=Ra(e.databaseInfo.databaseId),this.sharedClientState=this.Wa(e),this.persistence=this.Ga(e),await this.persistence.start(),this.localStore=this.za(e),this.gcScheduler=this.ja(e,this.localStore),this.indexBackfillerScheduler=this.Ha(e,this.localStore)}ja(e,n){return null}Ha(e,n){return null}za(e){return WE(this.persistence,new qE,e.initialUser,this.serializer)}Ga(e){return new zE(jc.Zr,this.serializer)}Wa(e){return new XE}async terminate(){var e,n;(e=this.gcScheduler)===null||e===void 0||e.stop(),(n=this.indexBackfillerScheduler)===null||n===void 0||n.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}la.provider={build:()=>new la};class Kl{async initialize(e,n){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(n),this.remoteStore=this.createRemoteStore(n),this.eventManager=this.createEventManager(n),this.syncEngine=this.createSyncEngine(n,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=i=>Gh(this.syncEngine,i,1),this.remoteStore.remoteSyncer.handleCredentialChange=OT.bind(null,this.syncEngine),await vT(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new wT}()}createDatastore(e){const n=Ra(e.databaseInfo.databaseId),i=function(s){return new nT(s)}(e.databaseInfo);return function(s,o,l,c){return new sT(s,o,l,c)}(e.authCredentials,e.appCheckCredentials,i,n)}createRemoteStore(e){return function(i,r,s,o,l){return new aT(i,r,s,o,l)}(this.localStore,this.datastore,e.asyncQueue,n=>Gh(this.syncEngine,n,0),function(){return $h.D()?new $h:new ZE}())}createSyncEngine(e,n){return function(r,s,o,l,c,u,f){const m=new xT(r,s,o,l,c,u);return f&&(m.Qa=!0),m}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,n)}async terminate(){var e,n;await async function(r){const s=J(r);q("RemoteStore","RemoteStore shutting down."),s.L_.add(5),await Xs(s),s.k_.shutdown(),s.q_.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(n=this.eventManager)===null||n===void 0||n.terminate()}}Kl.provider={build:()=>new Kl};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class km{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ya(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ya(this.observer.error,e):Hn("Uncaught Error in snapshot listener:",e.toString()))}Za(){this.muted=!0}Ya(e,n){setTimeout(()=>{this.muted||e(n)},0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zT{constructor(e,n,i,r,s){this.authCredentials=e,this.appCheckCredentials=n,this.asyncQueue=i,this.databaseInfo=r,this.user=ot.UNAUTHENTICATED,this.clientId=kp.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=s,this.authCredentials.start(i,async o=>{q("FirestoreClient","Received user=",o.uid),await this.authCredentialListener(o),this.user=o}),this.appCheckCredentials.start(i,o=>(q("FirestoreClient","Received new app check token=",o),this.appCheckCredentialListener(o,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new Vn;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(n){const i=tu(n,"Failed to shutdown persistence");e.reject(i)}}),e.promise}}async function El(t,e){t.asyncQueue.verifyOperationInProgress(),q("FirestoreClient","Initializing OfflineComponentProvider");const n=t.configuration;await e.initialize(n);let i=n.initialUser;t.setCredentialChangeListener(async r=>{i.isEqual(r)||(await am(e.localStore,r),i=r)}),e.persistence.setDatabaseDeletedListener(()=>t.terminate()),t._offlineComponents=e}async function jh(t,e){t.asyncQueue.verifyOperationInProgress();const n=await $T(t);q("FirestoreClient","Initializing OnlineComponentProvider"),await e.initialize(n,t.configuration),t.setCredentialChangeListener(i=>Uh(e.remoteStore,i)),t.setAppCheckTokenChangeListener((i,r)=>Uh(e.remoteStore,r)),t._onlineComponents=e}async function $T(t){if(!t._offlineComponents)if(t._uninitializedComponentsProvider){q("FirestoreClient","Using user provided OfflineComponentProvider");try{await El(t,t._uninitializedComponentsProvider._offline)}catch(e){const n=e;if(!function(r){return r.name==="FirebaseError"?r.code===M.FAILED_PRECONDITION||r.code===M.UNIMPLEMENTED:!(typeof DOMException<"u"&&r instanceof DOMException)||r.code===22||r.code===20||r.code===11}(n))throw n;Er("Error using user provided cache. Falling back to memory cache: "+n),await El(t,new la)}}else q("FirestoreClient","Using default OfflineComponentProvider"),await El(t,new la);return t._offlineComponents}async function Cm(t){return t._onlineComponents||(t._uninitializedComponentsProvider?(q("FirestoreClient","Using user provided OnlineComponentProvider"),await jh(t,t._uninitializedComponentsProvider._online)):(q("FirestoreClient","Using default OnlineComponentProvider"),await jh(t,new Kl))),t._onlineComponents}function UT(t){return Cm(t).then(e=>e.syncEngine)}async function Rm(t){const e=await Cm(t),n=e.eventManager;return n.onListen=AT.bind(null,e.syncEngine),n.onUnlisten=RT.bind(null,e.syncEngine),n.onFirstRemoteStoreListen=kT.bind(null,e.syncEngine),n.onLastRemoteStoreUnlisten=PT.bind(null,e.syncEngine),n}function qT(t,e,n={}){const i=new Vn;return t.asyncQueue.enqueueAndForget(async()=>function(s,o,l,c,u){const f=new km({next:p=>{f.Za(),o.enqueueAndForget(()=>vm(s,m));const w=p.docs.has(l);!w&&p.fromCache?u.reject(new $(M.UNAVAILABLE,"Failed to get document because the client is offline.")):w&&p.fromCache&&c&&c.source==="server"?u.reject(new $(M.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):u.resolve(p)},error:p=>u.reject(p)}),m=new bm(Uc(l.path),f,{includeMetadataChanges:!0,_a:!0});return ym(s,m)}(await Rm(t),t.asyncQueue,e,n,i)),i.promise}function HT(t,e,n={}){const i=new Vn;return t.asyncQueue.enqueueAndForget(async()=>function(s,o,l,c,u){const f=new km({next:p=>{f.Za(),o.enqueueAndForget(()=>vm(s,m)),p.fromCache&&c.source==="server"?u.reject(new $(M.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):u.resolve(p)},error:p=>u.reject(p)}),m=new bm(l,f,{includeMetadataChanges:!0,_a:!0});return ym(s,m)}(await Rm(t),t.asyncQueue,e,n,i)),i.promise}/**
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
 */function Pm(t){const e={};return t.timeoutSeconds!==void 0&&(e.timeoutSeconds=t.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kh=new Map;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mm(t,e,n){if(!n)throw new $(M.INVALID_ARGUMENT,`Function ${t}() cannot be called with an empty ${e}.`)}function WT(t,e,n,i){if(e===!0&&i===!0)throw new $(M.INVALID_ARGUMENT,`${t} and ${n} cannot be used together.`)}function Qh(t){if(!W.isDocumentKey(t))throw new $(M.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${t} has ${t.length}.`)}function Jh(t){if(W.isDocumentKey(t))throw new $(M.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${t} has ${t.length}.`)}function Da(t){if(t===void 0)return"undefined";if(t===null)return"null";if(typeof t=="string")return t.length>20&&(t=`${t.substring(0,20)}...`),JSON.stringify(t);if(typeof t=="number"||typeof t=="boolean")return""+t;if(typeof t=="object"){if(t instanceof Array)return"an array";{const e=function(i){return i.constructor?i.constructor.name:null}(t);return e?`a custom ${e} object`:"an object"}}return typeof t=="function"?"a function":j()}function Ht(t,e){if("_delegate"in t&&(t=t._delegate),!(t instanceof e)){if(e.name===t.constructor.name)throw new $(M.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=Da(t);throw new $(M.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${n}`)}}return t}function GT(t,e){if(e<=0)throw new $(M.INVALID_ARGUMENT,`Function ${t}() requires a positive number, but it was: ${e}.`)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xh{constructor(e){var n,i;if(e.host===void 0){if(e.ssl!==void 0)throw new $(M.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(n=e.ssl)===null||n===void 0||n;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new $(M.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}WT("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Pm((i=e.experimentalLongPollingOptions)!==null&&i!==void 0?i:{}),function(s){if(s.timeoutSeconds!==void 0){if(isNaN(s.timeoutSeconds))throw new $(M.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (must not be NaN)`);if(s.timeoutSeconds<5)throw new $(M.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (minimum allowed value is 5)`);if(s.timeoutSeconds>30)throw new $(M.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(i,r){return i.timeoutSeconds===r.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Ba{constructor(e,n,i,r){this._authCredentials=e,this._appCheckCredentials=n,this._databaseId=i,this._app=r,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Xh({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new $(M.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new $(M.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Xh(e),e.credentials!==void 0&&(this._authCredentials=function(i){if(!i)return new l_;switch(i.type){case"firstParty":return new h_(i.sessionIndex||"0",i.iamToken||null,i.authTokenFactory||null);case"provider":return i.client;default:throw new $(M.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(n){const i=Kh.get(n);i&&(q("ComponentProvider","Removing Datastore"),Kh.delete(n),i.terminate())}(this),Promise.resolve()}}function YT(t,e,n,i={}){var r;const s=(t=Ht(t,Ba))._getSettings(),o=`${e}:${n}`;if(s.host!=="firestore.googleapis.com"&&s.host!==o&&Er("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),t._setSettings(Object.assign(Object.assign({},s),{host:o,ssl:!1})),i.mockUserToken){let l,c;if(typeof i.mockUserToken=="string")l=i.mockUserToken,c=ot.MOCK_USER;else{l=gv(i.mockUserToken,(r=t._app)===null||r===void 0?void 0:r.options.projectId);const u=i.mockUserToken.sub||i.mockUserToken.user_id;if(!u)throw new $(M.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");c=new ot(u)}t._authCredentials=new c_(new Ap(l,c))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Si{constructor(e,n,i){this.converter=n,this._query=i,this.type="query",this.firestore=e}withConverter(e){return new Si(this.firestore,e,this._query)}}class _t{constructor(e,n,i){this.converter=n,this._key=i,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new yi(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new _t(this.firestore,e,this._key)}}class yi extends Si{constructor(e,n,i){super(e,n,Uc(i)),this._path=i,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new _t(this.firestore,null,new W(e))}withConverter(e){return new yi(this.firestore,e,this._path)}}function ru(t,e,...n){if(t=Me(t),Mm("collection","path",e),t instanceof Ba){const i=Se.fromString(e,...n);return Jh(i),new yi(t,null,i)}{if(!(t instanceof _t||t instanceof yi))throw new $(M.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const i=t._path.child(Se.fromString(e,...n));return Jh(i),new yi(t.firestore,null,i)}}function Ei(t,e,...n){if(t=Me(t),arguments.length===1&&(e=kp.newId()),Mm("doc","path",e),t instanceof Ba){const i=Se.fromString(e,...n);return Qh(i),new _t(t,null,new W(i))}{if(!(t instanceof _t||t instanceof yi))throw new $(M.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const i=t._path.child(Se.fromString(e,...n));return Qh(i),new _t(t.firestore,t instanceof yi?t.converter:null,new W(i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zh{constructor(e=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new cm(this,"async_queue_retry"),this.Vu=()=>{const i=_l();i&&q("AsyncQueue","Visibility state changed to "+i.visibilityState),this.t_.jo()},this.mu=e;const n=_l();n&&typeof n.addEventListener=="function"&&n.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.fu(),this.gu(e)}enterRestrictedMode(e){if(!this.Iu){this.Iu=!0,this.Au=e||!1;const n=_l();n&&typeof n.removeEventListener=="function"&&n.removeEventListener("visibilitychange",this.Vu)}}enqueue(e){if(this.fu(),this.Iu)return new Promise(()=>{});const n=new Vn;return this.gu(()=>this.Iu&&this.Au?Promise.resolve():(e().then(n.resolve,n.reject),n.promise)).then(()=>n.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Pu.push(e),this.pu()))}async pu(){if(this.Pu.length!==0){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(e){if(!Ks(e))throw e;q("AsyncQueue","Operation failed with retryable error: "+e)}this.Pu.length>0&&this.t_.Go(()=>this.pu())}}gu(e){const n=this.mu.then(()=>(this.du=!0,e().catch(i=>{this.Eu=i,this.du=!1;const r=function(o){let l=o.message||"";return o.stack&&(l=o.stack.includes(o.message)?o.stack:o.message+`
`+o.stack),l}(i);throw Hn("INTERNAL UNHANDLED ERROR: ",r),i}).then(i=>(this.du=!1,i))));return this.mu=n,n}enqueueAfterDelay(e,n,i){this.fu(),this.Ru.indexOf(e)>-1&&(n=0);const r=eu.createAndSchedule(this,e,n,i,s=>this.yu(s));return this.Tu.push(r),r}fu(){this.Eu&&j()}verifyOperationInProgress(){}async wu(){let e;do e=this.mu,await e;while(e!==this.mu)}Su(e){for(const n of this.Tu)if(n.timerId===e)return!0;return!1}bu(e){return this.wu().then(()=>{this.Tu.sort((n,i)=>n.targetTimeMs-i.targetTimeMs);for(const n of this.Tu)if(n.skipDelay(),e!=="all"&&n.timerId===e)break;return this.wu()})}Du(e){this.Ru.push(e)}yu(e){const n=this.Tu.indexOf(e);this.Tu.splice(n,1)}}class xi extends Ba{constructor(e,n,i,r){super(e,n,i,r),this.type="firestore",this._queue=new Zh,this._persistenceKey=(r==null?void 0:r.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Zh(e),this._firestoreClient=void 0,await e}}}function jT(t,e){const n=typeof t=="object"?t:Of(),i=typeof t=="string"?t:"(default)",r=Tc(n,"firestore").getImmediate({identifier:i});if(!r._initialized){const s=pv("firestore");s&&YT(r,...s)}return r}function La(t){if(t._terminated)throw new $(M.FAILED_PRECONDITION,"The client has already been terminated.");return t._firestoreClient||KT(t),t._firestoreClient}function KT(t){var e,n,i;const r=t._freezeSettings(),s=function(l,c,u,f){return new S_(l,c,u,f.host,f.ssl,f.experimentalForceLongPolling,f.experimentalAutoDetectLongPolling,Pm(f.experimentalLongPollingOptions),f.useFetchStreams)}(t._databaseId,((e=t._app)===null||e===void 0?void 0:e.options.appId)||"",t._persistenceKey,r);t._componentsProvider||!((n=r.localCache)===null||n===void 0)&&n._offlineComponentProvider&&(!((i=r.localCache)===null||i===void 0)&&i._onlineComponentProvider)&&(t._componentsProvider={_offline:r.localCache._offlineComponentProvider,_online:r.localCache._onlineComponentProvider}),t._firestoreClient=new zT(t._authCredentials,t._appCheckCredentials,t._queue,s,t._componentsProvider&&function(l){const c=l==null?void 0:l._online.build();return{_offline:l==null?void 0:l._offline.build(c),_online:c}}(t._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kr{constructor(e){this._byteString=e}static fromBase64String(e){try{return new kr(et.fromBase64String(e))}catch(n){throw new $(M.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+n)}}static fromUint8Array(e){return new kr(et.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eo{constructor(...e){for(let n=0;n<e.length;++n)if(e[n].length===0)throw new $(M.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Je(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Na{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class su{constructor(e,n){if(!isFinite(e)||e<-90||e>90)throw new $(M.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(n)||n<-180||n>180)throw new $(M.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+n);this._lat=e,this._long=n}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return he(this._lat,e._lat)||he(this._long,e._long)}}/**
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
 */class ou{constructor(e){this._values=(e||[]).map(n=>n)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(i,r){if(i.length!==r.length)return!1;for(let s=0;s<i.length;++s)if(i[s]!==r[s])return!1;return!0}(this._values,e._values)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const QT=/^__.*__$/;class JT{constructor(e,n,i){this.data=e,this.fieldMask=n,this.fieldTransforms=i}toMutation(e,n){return this.fieldMask!==null?new Ii(e,this.data,this.fieldMask,n,this.fieldTransforms):new Qs(e,this.data,n,this.fieldTransforms)}}class Dm{constructor(e,n,i){this.data=e,this.fieldMask=n,this.fieldTransforms=i}toMutation(e,n){return new Ii(e,this.data,this.fieldMask,n,this.fieldTransforms)}}function Bm(t){switch(t){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw j()}}class au{constructor(e,n,i,r,s,o){this.settings=e,this.databaseId=n,this.serializer=i,this.ignoreUndefinedProperties=r,s===void 0&&this.vu(),this.fieldTransforms=s||[],this.fieldMask=o||[]}get path(){return this.settings.path}get Cu(){return this.settings.Cu}Fu(e){return new au(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Mu(e){var n;const i=(n=this.path)===null||n===void 0?void 0:n.child(e),r=this.Fu({path:i,xu:!1});return r.Ou(e),r}Nu(e){var n;const i=(n=this.path)===null||n===void 0?void 0:n.child(e),r=this.Fu({path:i,xu:!1});return r.vu(),r}Lu(e){return this.Fu({path:void 0,xu:!0})}Bu(e){return ca(e,this.settings.methodName,this.settings.ku||!1,this.path,this.settings.qu)}contains(e){return this.fieldMask.find(n=>e.isPrefixOf(n))!==void 0||this.fieldTransforms.find(n=>e.isPrefixOf(n.field))!==void 0}vu(){if(this.path)for(let e=0;e<this.path.length;e++)this.Ou(this.path.get(e))}Ou(e){if(e.length===0)throw this.Bu("Document fields must not be empty");if(Bm(this.Cu)&&QT.test(e))throw this.Bu('Document fields cannot begin and end with "__"')}}class XT{constructor(e,n,i){this.databaseId=e,this.ignoreUndefinedProperties=n,this.serializer=i||Ra(e)}Qu(e,n,i,r=!1){return new au({Cu:e,methodName:n,qu:i,path:Je.emptyPath(),xu:!1,ku:r},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function to(t){const e=t._freezeSettings(),n=Ra(t._databaseId);return new XT(t._databaseId,!!e.ignoreUndefinedProperties,n)}function lu(t,e,n,i,r,s={}){const o=t.Qu(s.merge||s.mergeFields?2:0,e,n,r);uu("Data must be an object, but it was:",o,i);const l=Om(i,o);let c,u;if(s.merge)c=new Dt(o.fieldMask),u=o.fieldTransforms;else if(s.mergeFields){const f=[];for(const m of s.mergeFields){const p=Ql(e,m,n);if(!o.contains(p))throw new $(M.INVALID_ARGUMENT,`Field '${p}' is specified in your field mask but missing from your input data.`);Vm(f,p)||f.push(p)}c=new Dt(f),u=o.fieldTransforms.filter(m=>c.covers(m.field))}else c=null,u=o.fieldTransforms;return new JT(new St(l),c,u)}class Oa extends Na{_toFieldTransform(e){if(e.Cu!==2)throw e.Cu===1?e.Bu(`${this._methodName}() can only appear at the top level of your update data`):e.Bu(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof Oa}}class cu extends Na{_toFieldTransform(e){return new Q_(e.path,new Cs)}isEqual(e){return e instanceof cu}}function Lm(t,e,n,i){const r=t.Qu(1,e,n);uu("Data must be an object, but it was:",r,i);const s=[],o=St.empty();er(i,(c,u)=>{const f=du(e,c,n);u=Me(u);const m=r.Nu(f);if(u instanceof Oa)s.push(f);else{const p=no(u,m);p!=null&&(s.push(f),o.set(f,p))}});const l=new Dt(s);return new Dm(o,l,r.fieldTransforms)}function Nm(t,e,n,i,r,s){const o=t.Qu(1,e,n),l=[Ql(e,i,n)],c=[r];if(s.length%2!=0)throw new $(M.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let p=0;p<s.length;p+=2)l.push(Ql(e,s[p])),c.push(s[p+1]);const u=[],f=St.empty();for(let p=l.length-1;p>=0;--p)if(!Vm(u,l[p])){const w=l[p];let I=c[p];I=Me(I);const S=o.Nu(w);if(I instanceof Oa)u.push(w);else{const A=no(I,S);A!=null&&(u.push(w),f.set(w,A))}}const m=new Dt(u);return new Dm(f,m,o.fieldTransforms)}function ZT(t,e,n,i=!1){return no(n,t.Qu(i?4:3,e))}function no(t,e){if(Fm(t=Me(t)))return uu("Unsupported field value:",e,t),Om(t,e);if(t instanceof Na)return function(i,r){if(!Bm(r.Cu))throw r.Bu(`${i._methodName}() can only be used with update() and set()`);if(!r.path)throw r.Bu(`${i._methodName}() is not currently supported inside arrays`);const s=i._toFieldTransform(r);s&&r.fieldTransforms.push(s)}(t,e),null;if(t===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),t instanceof Array){if(e.settings.xu&&e.Cu!==4)throw e.Bu("Nested arrays are not supported");return function(i,r){const s=[];let o=0;for(const l of i){let c=no(l,r.Lu(o));c==null&&(c={nullValue:"NULL_VALUE"}),s.push(c),o++}return{arrayValue:{values:s}}}(t,e)}return function(i,r){if((i=Me(i))===null)return{nullValue:"NULL_VALUE"};if(typeof i=="number")return Y_(r.serializer,i);if(typeof i=="boolean")return{booleanValue:i};if(typeof i=="string")return{stringValue:i};if(i instanceof Date){const s=He.fromDate(i);return{timestampValue:oa(r.serializer,s)}}if(i instanceof He){const s=new He(i.seconds,1e3*Math.floor(i.nanoseconds/1e3));return{timestampValue:oa(r.serializer,s)}}if(i instanceof su)return{geoPointValue:{latitude:i.latitude,longitude:i.longitude}};if(i instanceof kr)return{bytesValue:em(r.serializer,i._byteString)};if(i instanceof _t){const s=r.databaseId,o=i.firestore._databaseId;if(!o.isEqual(s))throw r.Bu(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${s.projectId}/${s.database}`);return{referenceValue:Gc(i.firestore._databaseId||r.databaseId,i._key.path)}}if(i instanceof ou)return function(o,l){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:o.toArray().map(c=>{if(typeof c!="number")throw l.Bu("VectorValues must only contain numeric values.");return qc(l.serializer,c)})}}}}}}(i,r);throw r.Bu(`Unsupported field value: ${Da(i)}`)}(t,e)}function Om(t,e){const n={};return Cp(t)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):er(t,(i,r)=>{const s=no(r,e.Mu(i));s!=null&&(n[i]=s)}),{mapValue:{fields:n}}}function Fm(t){return!(typeof t!="object"||t===null||t instanceof Array||t instanceof Date||t instanceof He||t instanceof su||t instanceof kr||t instanceof _t||t instanceof Na||t instanceof ou)}function uu(t,e,n){if(!Fm(n)||!function(r){return typeof r=="object"&&r!==null&&(Object.getPrototypeOf(r)===Object.prototype||Object.getPrototypeOf(r)===null)}(n)){const i=Da(n);throw i==="an object"?e.Bu(t+" a custom object"):e.Bu(t+" "+i)}}function Ql(t,e,n){if((e=Me(e))instanceof eo)return e._internalPath;if(typeof e=="string")return du(t,e);throw ca("Field path arguments must be of type string or ",t,!1,void 0,n)}const eI=new RegExp("[~\\*/\\[\\]]");function du(t,e,n){if(e.search(eI)>=0)throw ca(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,t,!1,void 0,n);try{return new eo(...e.split("."))._internalPath}catch{throw ca(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,t,!1,void 0,n)}}function ca(t,e,n,i,r){const s=i&&!i.isEmpty(),o=r!==void 0;let l=`Function ${e}() called with invalid data`;n&&(l+=" (via `toFirestore()`)"),l+=". ";let c="";return(s||o)&&(c+=" (found",s&&(c+=` in field ${i}`),o&&(c+=` in document ${r}`),c+=")"),new $(M.INVALID_ARGUMENT,l+t+c)}function Vm(t,e){return t.some(n=>n.isEqual(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zm{constructor(e,n,i,r,s){this._firestore=e,this._userDataWriter=n,this._key=i,this._document=r,this._converter=s}get id(){return this._key.path.lastSegment()}get ref(){return new _t(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new tI(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const n=this._document.data.field(hu("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n)}}}class tI extends zm{data(){return super.data()}}function hu(t,e){return typeof e=="string"?du(t,e):e instanceof eo?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nI(t){if(t.limitType==="L"&&t.explicitOrderBy.length===0)throw new $(M.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class fu{}class pu extends fu{}function iI(t,e,...n){let i=[];e instanceof fu&&i.push(e),i=i.concat(n),function(s){const o=s.filter(c=>c instanceof gu).length,l=s.filter(c=>c instanceof mu).length;if(o>1||o>0&&l>0)throw new $(M.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(i);for(const r of i)t=r._apply(t);return t}class mu extends pu{constructor(e,n,i){super(),this._field=e,this._op=n,this._value=i,this.type="where"}static _create(e,n,i){return new mu(e,n,i)}_apply(e){const n=this._parse(e);return $m(e._query,n),new Si(e.firestore,e.converter,$l(e._query,n))}_parse(e){const n=to(e.firestore);return function(s,o,l,c,u,f,m){let p;if(u.isKeyField()){if(f==="array-contains"||f==="array-contains-any")throw new $(M.INVALID_ARGUMENT,`Invalid Query. You can't perform '${f}' queries on documentId().`);if(f==="in"||f==="not-in"){tf(m,f);const w=[];for(const I of m)w.push(ef(c,s,I));p={arrayValue:{values:w}}}else p=ef(c,s,m)}else f!=="in"&&f!=="not-in"&&f!=="array-contains-any"||tf(m,f),p=ZT(l,o,m,f==="in"||f==="not-in");return $e.create(u,f,p)}(e._query,"where",n,e.firestore._databaseId,this._field,this._op,this._value)}}class gu extends fu{constructor(e,n){super(),this.type=e,this._queryConstraints=n}static _create(e,n){return new gu(e,n)}_parse(e){const n=this._queryConstraints.map(i=>i._parse(e)).filter(i=>i.getFilters().length>0);return n.length===1?n[0]:en.create(n,this._getOperator())}_apply(e){const n=this._parse(e);return n.getFilters().length===0?e:(function(r,s){let o=r;const l=s.getFlattenedFilters();for(const c of l)$m(o,c),o=$l(o,c)}(e._query,n),new Si(e.firestore,e.converter,$l(e._query,n)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class yu extends pu{constructor(e,n){super(),this._field=e,this._direction=n,this.type="orderBy"}static _create(e,n){return new yu(e,n)}_apply(e){const n=function(r,s,o){if(r.startAt!==null)throw new $(M.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(r.endAt!==null)throw new $(M.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new ks(s,o)}(e._query,this._field,this._direction);return new Si(e.firestore,e.converter,function(r,s){const o=r.explicitOrderBy.concat([s]);return new Lr(r.path,r.collectionGroup,o,r.filters.slice(),r.limit,r.limitType,r.startAt,r.endAt)}(e._query,n))}}function rI(t,e="asc"){const n=e,i=hu("orderBy",t);return yu._create(i,n)}class vu extends pu{constructor(e,n,i){super(),this.type=e,this._limit=n,this._limitType=i}static _create(e,n,i){return new vu(e,n,i)}_apply(e){return new Si(e.firestore,e.converter,ra(e._query,this._limit,this._limitType))}}function sI(t){return GT("limit",t),vu._create("limit",t,"F")}function ef(t,e,n){if(typeof(n=Me(n))=="string"){if(n==="")throw new $(M.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!Fp(e)&&n.indexOf("/")!==-1)throw new $(M.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${n}' contains a '/' character.`);const i=e.path.child(Se.fromString(n));if(!W.isDocumentKey(i))throw new $(M.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${i}' is not because it has an odd number of segments (${i.length}).`);return Eh(t,new W(i))}if(n instanceof _t)return Eh(t,n._key);throw new $(M.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Da(n)}.`)}function tf(t,e){if(!Array.isArray(t)||t.length===0)throw new $(M.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function $m(t,e){const n=function(r,s){for(const o of r)for(const l of o.getFlattenedFilters())if(s.indexOf(l.op)>=0)return l.op;return null}(t.filters,function(r){switch(r){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(e.op));if(n!==null)throw n===e.op?new $(M.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new $(M.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${n.toString()}' filters.`)}class oI{convertValue(e,n="none"){switch(Ji(e)){case 0:return null;case 1:return e.booleanValue;case 2:return Fe(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,n);case 5:return e.stringValue;case 6:return this.convertBytes(Qi(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,n);case 11:return this.convertObject(e.mapValue,n);case 10:return this.convertVectorValue(e.mapValue);default:throw j()}}convertObject(e,n){return this.convertObjectMap(e.fields,n)}convertObjectMap(e,n="none"){const i={};return er(e,(r,s)=>{i[r]=this.convertValue(s,n)}),i}convertVectorValue(e){var n,i,r;const s=(r=(i=(n=e.fields)===null||n===void 0?void 0:n.value.arrayValue)===null||i===void 0?void 0:i.values)===null||r===void 0?void 0:r.map(o=>Fe(o.doubleValue));return new ou(s)}convertGeoPoint(e){return new su(Fe(e.latitude),Fe(e.longitude))}convertArray(e,n){return(e.values||[]).map(i=>this.convertValue(i,n))}convertServerTimestamp(e,n){switch(n){case"previous":const i=Fc(e);return i==null?null:this.convertValue(i,n);case"estimate":return this.convertTimestamp(Ss(e));default:return null}}convertTimestamp(e){const n=wi(e);return new He(n.seconds,n.nanos)}convertDocumentKey(e,n){const i=Se.fromString(e);ge(om(i));const r=new xs(i.get(1),i.get(3)),s=new W(i.popFirst(5));return r.isEqual(n)||Hn(`Document ${s} contains a document reference within a different database (${r.projectId}/${r.database}) which is not supported. It will be treated as a reference in the current database (${n.projectId}/${n.database}) instead.`),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bu(t,e,n){let i;return i=t?n&&(n.merge||n.mergeFields)?t.toFirestore(e,n):t.toFirestore(e):e,i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class us{constructor(e,n){this.hasPendingWrites=e,this.fromCache=n}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class Um extends zm{constructor(e,n,i,r,s,o){super(e,n,i,r,o),this._firestore=e,this._firestoreImpl=e,this.metadata=s}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const n=new zo(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(n,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,n={}){if(this._document){const i=this._document.data.field(hu("DocumentSnapshot.get",e));if(i!==null)return this._userDataWriter.convertValue(i,n.serverTimestamps)}}}class zo extends Um{data(e={}){return super.data(e)}}class aI{constructor(e,n,i,r){this._firestore=e,this._userDataWriter=n,this._snapshot=r,this.metadata=new us(r.hasPendingWrites,r.fromCache),this.query=i}get docs(){const e=[];return this.forEach(n=>e.push(n)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,n){this._snapshot.docs.forEach(i=>{e.call(n,new zo(this._firestore,this._userDataWriter,i.key,i,new us(this._snapshot.mutatedKeys.has(i.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const n=!!e.includeMetadataChanges;if(n&&this._snapshot.excludesMetadataChanges)throw new $(M.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===n||(this._cachedChanges=function(r,s){if(r._snapshot.oldDocs.isEmpty()){let o=0;return r._snapshot.docChanges.map(l=>{const c=new zo(r._firestore,r._userDataWriter,l.doc.key,l.doc,new us(r._snapshot.mutatedKeys.has(l.doc.key),r._snapshot.fromCache),r.query.converter);return l.doc,{type:"added",doc:c,oldIndex:-1,newIndex:o++}})}{let o=r._snapshot.oldDocs;return r._snapshot.docChanges.filter(l=>s||l.type!==3).map(l=>{const c=new zo(r._firestore,r._userDataWriter,l.doc.key,l.doc,new us(r._snapshot.mutatedKeys.has(l.doc.key),r._snapshot.fromCache),r.query.converter);let u=-1,f=-1;return l.type!==0&&(u=o.indexOf(l.doc.key),o=o.delete(l.doc.key)),l.type!==1&&(o=o.add(l.doc),f=o.indexOf(l.doc.key)),{type:lI(l.type),doc:c,oldIndex:u,newIndex:f}})}}(this,n),this._cachedChangesIncludeMetadataChanges=n),this._cachedChanges}}function lI(t){switch(t){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return j()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jl(t){t=Ht(t,_t);const e=Ht(t.firestore,xi);return qT(La(e),t._key).then(n=>hI(e,t,n))}class qm extends oI{constructor(e){super(),this.firestore=e}convertBytes(e){return new kr(e)}convertReference(e){const n=this.convertDocumentKey(e,this.firestore._databaseId);return new _t(this.firestore,null,n)}}function Hm(t){t=Ht(t,Si);const e=Ht(t.firestore,xi),n=La(e),i=new qm(e);return nI(t._query),HT(n,t._query).then(r=>new aI(e,i,t,r))}function cI(t,e,n){t=Ht(t,_t);const i=Ht(t.firestore,xi),r=bu(t.converter,e,n);return io(i,[lu(to(i),"setDoc",t._key,r,t.converter!==null,n).toMutation(t._key,wt.none())])}function uI(t,e,n,...i){t=Ht(t,_t);const r=Ht(t.firestore,xi),s=to(r);let o;return o=typeof(e=Me(e))=="string"||e instanceof eo?Nm(s,"updateDoc",t._key,e,n,i):Lm(s,"updateDoc",t._key,e),io(r,[o.toMutation(t._key,wt.exists(!0))])}function dI(t){return io(Ht(t.firestore,xi),[new ka(t._key,wt.none())])}function Wm(t,e){const n=Ht(t.firestore,xi),i=Ei(t),r=bu(t.converter,e);return io(n,[lu(to(t.firestore),"addDoc",i._key,r,t.converter!==null,{}).toMutation(i._key,wt.exists(!1))]).then(()=>i)}function io(t,e){return function(i,r){const s=new Vn;return i.asyncQueue.enqueueAndForget(async()=>MT(await UT(i),r,s)),s.promise}(La(t),e)}function hI(t,e,n){const i=n.docs.get(e._key),r=new qm(t);return new Um(t,r,e._key,i,new us(n.hasPendingWrites,n.fromCache),e.converter)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fI{constructor(e,n){this._firestore=e,this._commitHandler=n,this._mutations=[],this._committed=!1,this._dataReader=to(e)}set(e,n,i){this._verifyNotCommitted();const r=Tl(e,this._firestore),s=bu(r.converter,n,i),o=lu(this._dataReader,"WriteBatch.set",r._key,s,r.converter!==null,i);return this._mutations.push(o.toMutation(r._key,wt.none())),this}update(e,n,i,...r){this._verifyNotCommitted();const s=Tl(e,this._firestore);let o;return o=typeof(n=Me(n))=="string"||n instanceof eo?Nm(this._dataReader,"WriteBatch.update",s._key,n,i,r):Lm(this._dataReader,"WriteBatch.update",s._key,n),this._mutations.push(o.toMutation(s._key,wt.exists(!0))),this}delete(e){this._verifyNotCommitted();const n=Tl(e,this._firestore);return this._mutations=this._mutations.concat(new ka(n._key,wt.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new $(M.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function Tl(t,e){if((t=Me(t)).firestore!==e)throw new $(M.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return t}function pI(){return new cu("serverTimestamp")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gm(t){return La(t=Ht(t,xi)),new fI(t,e=>io(t,e))}(function(e,n=!0){(function(r){Br=r})(Mr),wr(new Gi("firestore",(i,{instanceIdentifier:r,options:s})=>{const o=i.getProvider("app").getImmediate(),l=new xi(new u_(i.getProvider("auth-internal")),new p_(i.getProvider("app-check-internal")),function(u,f){if(!Object.prototype.hasOwnProperty.apply(u.options,["projectId"]))throw new $(M.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new xs(u.options.projectId,f)}(o,r),o);return s=Object.assign({useFetchStreams:n},s),l._setSettings(s),l},"PUBLIC").setMultipleInstances(!0)),gi(yh,"4.7.3",e),gi(yh,"4.7.3","esm2017")})();const Ym={apiKey:"AIzaSyBdbve0H70D-Ch69WlaxEly7PVBFVRB5p0",authDomain:"pensiontools-4b237.firebaseapp.com",projectId:"pensiontools-4b237",storageBucket:"pensiontools-4b237.firebasestorage.app",messagingSenderId:"760877353696",appId:"1:760877353696:web:2d6f7173c8d7fab6fd9e85"};function Be(){return Ym.apiKey!=="YOUR_API_KEY"}let Il=null,ut=null,Ue=null;try{Be()?(Il=Nf(Ym),ut=o_(Il),Ue=jT(Il)):console.warn("Firebase not configured. Login required to save data.")}catch(t){console.error("Firebase initialization error:",t)}const mI=new Pn;let lt=null,vs=[];function gI(){if(!Be()||!ut){console.warn("Firebase not configured - auth disabled");return}Yb(ut,t=>{console.log("onAuthStateChanged fired:",t?t.email:"null"),lt=t,console.log("Notifying",vs.length,"listeners"),vs.forEach(e=>e(t))})}function jm(t){return console.log("onAuthStateChange: adding listener, currentUser is:",lt&&lt.email),vs.push(t),lt&&(console.log("onAuthStateChange: immediately calling listener with user"),t(lt)),()=>{vs=vs.filter(e=>e!==t)}}function tn(){return lt}function dt(){return lt!==null}async function yI(t,e,n=null){if(!Be()||!ut)throw new Error("Firebase not configured");const i=await $b(ut,t,e);n&&i.user&&await Hb(i.user,{displayName:n});try{await cp(i.user)}catch(r){console.error("Failed to send verification email:",r)}return i}async function vI(){if(!Be()||!ut||!lt)throw new Error("Not logged in");return cp(lt)}async function bI(){return lt?(await lt.reload(),lt=ut.currentUser,lt):null}async function wI(t,e){if(!Be()||!ut)throw new Error("Firebase not configured");return Ub(ut,t,e)}async function _I(){if(!Be()||!ut)throw new Error("Firebase not configured");console.log("Initiating Google sign-in popup...");try{const t=await mw(ut,mI);return console.log("Google sign-in successful:",t.user.email),t}catch(t){throw console.error("signInWithPopup error:",t.code,t.message),t}}async function wu(){if(!Be()||!ut)throw new Error("Firebase not configured");return jb(ut)}async function EI(t){if(!Be()||!ut)throw new Error("Firebase not configured");return zb(ut,t)}async function TI(){if(!Be()||!ut||!lt)throw new Error("Not logged in");return Kb(lt)}gI();function ar(...t){return t.find(e=>e!==void 0)}function II(t){if(!t||typeof t!="object")return{scenario:t,migrated:!1};const e=Object.keys(t).filter(c=>c.includes(".")),n="decisionSettings"in t||"stressSettings"in t||"name"in t||"description"in t||"taxYears"in t;if(!(e.length>0||n))return{scenario:t,migrated:!1};const r=t.decisionTool||{},s=t.stressTool||{},o=t.planDetails||{},l={isActive:t.isActive??!1,enabledTools:t.enabledTools||["stress","decision"],planDetails:{name:ar(t["planDetails.name"],o.name,t.name)??"My Plan",description:ar(t["planDetails.description"],o.description,t.description)??""},decisionTool:{settings:ar(t["decisionTool.settings"],r.settings,t.decisionSettings)??{},history:ar(t["decisionTool.history"],r.history)??[],taxYears:ar(t["decisionTool.taxYears"],r.taxYears,t.taxYears)??{}},stressTool:{settings:ar(t["stressTool.settings"],s.settings,t.stressSettings)??{}}};return t.id!==void 0&&(l.id=t.id),t.createdAt!==void 0&&(l.createdAt=t.createdAt),t.lastModified!==void 0&&(l.lastModified=t.lastModified),{scenario:l,migrated:!0}}function _u(t,e="settings"){const n=tn();return!n||!Ue?null:Ei(Ue,"users",n.uid,t,e)}function Km(t){const e=tn();return!e||!Ue?null:ru(Ue,"users",e.uid,t)}async function Qm(t){const{scenario:e,migrated:n}=II(t);if(n){const i=tn();if(i&&Ue)try{const{id:r,...s}=e;await cI(Ei(Ue,"users",i.uid,"scenarios",r),s)}catch(r){console.error("Scenario migration write failed:",r)}}return e}async function Fa(){if(!Be())return[];const t=Km("scenarios");if(!t)return[];try{const e=await Hm(t),n=[];return e.forEach(i=>{n.push({id:i.id,...i.data()})}),Promise.all(n.map(i=>Qm(i)))}catch(e){return console.error("Error loading scenarios:",e),[]}}async function SI(t){if(!Be())return null;const e=_u("scenarios",t);if(!e)return null;try{const n=await Jl(e);return n.exists()?Qm({id:n.id,...n.data()}):null}catch(n){return console.error("Error loading scenario:",n),null}}async function Ai(t,e){if(!Be())return;const n=_u("scenarios",t);if(n)try{await uI(n,{...e,lastModified:new Date().toISOString()})}catch(i){throw console.error("Error saving scenario:",i),i}}async function Jm(t){if(!Be())return null;const e=Km("scenarios");if(!e)return null;try{return(await Wm(e,{...t,createdAt:new Date().toISOString(),lastModified:new Date().toISOString()})).id}catch(n){throw console.error("Error creating scenario:",n),n}}async function xI(t){if(!Be())return;const e=_u("scenarios",t);if(e)try{await dI(e)}catch(n){throw console.error("Error deleting scenario:",n),n}}async function Eu(t){if(!Be())return;const e=tn();if(!(!e||!Ue))try{const n=await Fa(),i=Gm(Ue);for(const r of n){const s=Ei(Ue,"users",e.uid,"scenarios",r.id);r.id===t?i.update(s,{isActive:!0}):r.isActive&&i.update(s,{isActive:!1})}await i.commit()}catch(n){throw console.error("Error setting active scenario:",n),n}}async function Xm(){if(!Be())return;const t=tn();if(!(!t||!Ue))try{const e=await Fa(),n=Gm(Ue);for(const i of e)n.delete(Ei(Ue,"users",t.uid,"scenarios",i.id));n.delete(Ei(Ue,"users",t.uid,"profile","settings")),await n.commit(),console.log("All user data wiped successfully")}catch(e){throw console.error("Error wiping user data:",e),e}}async function Zm(){return Be()?(await Fa()).length>0:!1}const eg={single:{minimum:14400,moderate:31300,comfortable:43100}},Xl={essential:[{label:"Rent / mortgage",period:"mo",hint:"Your regular housing payment"},{label:"Council tax",period:"mo",hint:""},{label:"Gas",period:"mo",hint:""},{label:"Electricity",period:"mo",hint:""},{label:"Water",period:"mo",hint:""},{label:"Broadband",period:"mo",hint:"Broadband tariff"},{label:"Mobile phones",period:"mo",hint:"Mobile phone tariffs"},{label:"TV licence",period:"yr",hint:""},{label:"Groceries & household",period:"mo",hint:"Food and everyday household items"},{label:"Home insurance",period:"yr",hint:"Buildings & contents"},{label:"Car insurance",period:"yr",hint:""},{label:"Car tax",period:"yr",hint:"DVLA vehicle tax"},{label:"Petrol / fuel",period:"mo",hint:""},{label:"Car servicing & maintenance",period:"yr",hint:"Servicing, MOT, repairs — a big replacement is a One-off cost"},{label:"Boiler service",period:"yr",hint:""},{label:"Personal health",period:"mo",hint:"Prescriptions, dental, optical, health cover"},{label:"Kids / dependents",period:"mo",hint:"Supporting children or other dependents"},{label:"Premier banking / account fees",period:"mo",hint:"Packaged or premier account fees"},{label:"Home upkeep",period:"mo",hint:"Routine maintenance & small repairs — big jobs go in One-off costs"}],discretionary:[{label:"Main holiday",period:"yr",hint:"Your big annual holiday"},{label:"UK breaks",period:"yr",hint:"Weekends & short breaks"},{label:"Day trips",period:"mo",hint:""},{label:"Eating out & takeaways",period:"mo",hint:""},{label:"Streaming & entertainment",period:"mo",hint:"Netflix, Amazon Prime, etc."},{label:"Digital subscriptions",period:"mo",hint:"Cloud storage, AI tools, credit-file, TradingView, broker subscriptions"},{label:"Gym & fitness",period:"mo",hint:"Membership & classes"},{label:"Sports & equipment",period:"yr",hint:"Kit and gear"},{label:"Clothes",period:"mo",hint:"Everyday clothing"},{label:"Sports clothes",period:"yr",hint:""},{label:"Hobbies & leisure",period:"mo",hint:""},{label:"Gifts & family",period:"mo",hint:"Presents, helping family"},{label:"Charity",period:"mo",hint:""},{label:"Pets",period:"mo",hint:"Food, insurance, vet (pet health)"},{label:"Personal spending money",period:"mo",hint:"Day-to-day 'spends'"},{label:"Home furnishings & décor",period:"yr",hint:"Soft furnishings, decorating, furniture refresh"},{label:"Home technology",period:"yr",hint:"Phones, laptops, gadgets"},{label:"Emergency buffer",period:"mo",hint:"A monthly set-aside for the unexpected"}]},AI=[{label:"Eating out & takeaways",tier:"discretionary",period:"mo",hint:"Meals out, takeaways, coffees"},{label:"Life insurance / income protection",tier:"essential",period:"mo",hint:"Protection premiums"},{label:"Health / dental insurance",tier:"essential",period:"mo",hint:"Private medical, dental plan, cash plan"},{label:"Dental & optical",tier:"essential",period:"yr",hint:"Check-ups, glasses, treatment not on the NHS"},{label:"Hearing",tier:"essential",period:"yr",hint:"Hearing tests & aids"},{label:"Breakdown cover",tier:"essential",period:"yr",hint:"AA / RAC vehicle breakdown"},{label:"Parking & permits",tier:"essential",period:"yr",hint:"Residents permit, ULEZ / congestion"},{label:"Public transport",tier:"essential",period:"mo",hint:"Bus, rail, rail card"},{label:"Cleaner / gardener",tier:"essential",period:"mo",hint:"Cleaner, window cleaner, gardener"},{label:"Long-term care set-aside",tier:"essential",period:"mo",hint:"A monthly reserve toward possible later-life care (easily forgotten)"},{label:"Christmas & birthdays",tier:"discretionary",period:"yr",hint:"Seasonal gifts & celebrations"},{label:"Alcohol",tier:"discretionary",period:"mo",hint:"Beer, wine, spirits"},{label:"Hairdressing & grooming",tier:"discretionary",period:"mo",hint:"Haircuts, beauty, barber"},{label:"Newspapers, books & media",tier:"discretionary",period:"mo",hint:"Papers, magazines, books"},{label:"Grandchildren",tier:"discretionary",period:"mo",hint:"Treats, days out, help with costs"},{label:"Professional memberships",tier:"discretionary",period:"yr",hint:"Institutes, unions, clubs"},{label:"Second / holiday home",tier:"discretionary",period:"mo",hint:"Running costs of a second property"},{label:"Storage / lock-up",tier:"discretionary",period:"mo",hint:"Self-storage, garage rental"},{label:"My personal spending",tier:"discretionary",period:"mo",hint:"Your own day-to-day 'spends'",paidBy:"me"},{label:"Partner's personal spending",tier:"discretionary",period:"mo",hint:"Your partner's day-to-day 'spends'",paidBy:"partner"}];function Ms(t){const e=new Set((t.lines||[]).map(s=>(s.label||"").trim().toLowerCase()).filter(Boolean)),n=[...Xl.essential.map(s=>({...s,tier:"essential"})),...Xl.discretionary.map(s=>({...s,tier:"discretionary"}))],i=new Set,r=[];for(const s of[...AI,...n]){const o=s.label.trim().toLowerCase();e.has(o)||i.has(o)||(i.add(o),r.push(s))}return r}const kI=[{label:"New car",tier:"essential",hint:"Replacement vehicle",everyYears:8},{label:"Redecorating",tier:"essential",hint:"Whole-house repaint — a 4-bed runs ~£2,000–3,500 professionally, ~£300–600 DIY",everyYears:7},{label:"Major home work",tier:"essential",hint:"Kitchen, bathroom, roof, windows",everyYears:null},{label:"White goods",tier:"essential",hint:"Fridge, washer, cooker",everyYears:10}],CI={"Council tax":{minimum:{s:95,c:150},moderate:{s:115,c:170},comfortable:{s:125,c:185}},Gas:{minimum:{s:45,c:60},moderate:{s:58,c:75},comfortable:{s:68,c:90}},Electricity:{minimum:{s:55,c:70},moderate:{s:68,c:85},comfortable:{s:80,c:100}},Water:{minimum:{s:28,c:38},moderate:{s:33,c:44},comfortable:{s:38,c:50}},Broadband:{minimum:{s:27,c:27},moderate:{s:32,c:32},comfortable:{s:38,c:38}},"Mobile phones":{minimum:{s:8,c:16},moderate:{s:14,c:28},comfortable:{s:20,c:40}},"TV licence":{minimum:{s:15,c:15},moderate:{s:15,c:15},comfortable:{s:15,c:15}},"Groceries & household":{minimum:{s:230,c:350},moderate:{s:300,c:470},comfortable:{s:360,c:580}},"Home insurance":{minimum:{s:16,c:22},moderate:{s:22,c:30},comfortable:{s:28,c:38}},"Car insurance":{minimum:{s:0,c:0},moderate:{s:38,c:50},comfortable:{s:48,c:80}},"Car tax":{minimum:{s:0,c:0},moderate:{s:16,c:16},comfortable:{s:16,c:32}},"Petrol / fuel":{minimum:{s:0,c:0},moderate:{s:95,c:130},comfortable:{s:115,c:190}},"Car servicing & maintenance":{minimum:{s:0,c:0},moderate:{s:48,c:65},comfortable:{s:65,c:105}},"Boiler service":{minimum:{s:9,c:9},moderate:{s:11,c:11},comfortable:{s:13,c:13}},"Personal health":{minimum:{s:15,c:25},moderate:{s:32,c:55},comfortable:{s:58,c:95}},"Home upkeep":{minimum:{s:30,c:42},moderate:{s:52,c:75},comfortable:{s:85,c:120}},"Main holiday":{minimum:{s:42,c:65},moderate:{s:130,c:200},comfortable:{s:220,c:350}},"UK breaks":{minimum:{s:0,c:0},moderate:{s:38,c:60},comfortable:{s:75,c:115}},"Day trips":{minimum:{s:15,c:25},moderate:{s:32,c:48},comfortable:{s:52,c:80}},"Eating out & takeaways":{minimum:{s:42,c:70},moderate:{s:100,c:170},comfortable:{s:170,c:285}},"Streaming & entertainment":{minimum:{s:12,c:12},moderate:{s:26,c:32},comfortable:{s:42,c:48}},"Digital subscriptions":{minimum:{s:5,c:8},moderate:{s:13,c:20},comfortable:{s:26,c:38}},"Gym & fitness":{minimum:{s:15,c:26},moderate:{s:32,c:55},comfortable:{s:48,c:85}},"Sports & equipment":{minimum:{s:5,c:8},moderate:{s:13,c:22},comfortable:{s:26,c:42}},Clothes:{minimum:{s:48,c:80},moderate:{s:65,c:115},comfortable:{s:105,c:190}},"Sports clothes":{minimum:{s:3,c:5},moderate:{s:8,c:13},comfortable:{s:13,c:22}},"Hobbies & leisure":{minimum:{s:16,c:26},moderate:{s:37,c:58},comfortable:{s:62,c:100}},"Gifts & family":{minimum:{s:22,c:32},moderate:{s:58,c:90},comfortable:{s:95,c:150}},Charity:{minimum:{s:5,c:10},moderate:{s:16,c:27},comfortable:{s:32,c:55}},Pets:{minimum:{s:32,c:32},moderate:{s:42,c:42},comfortable:{s:58,c:58}},"Personal spending money":{minimum:{s:26,c:48},moderate:{s:52,c:95},comfortable:{s:95,c:170}},"Home furnishings & décor":{minimum:{s:16,c:26},moderate:{s:37,c:58},comfortable:{s:68,c:105}},"Home technology":{minimum:{s:10,c:16},moderate:{s:26,c:37},comfortable:{s:48,c:68}},Alcohol:{minimum:{s:16,c:42},moderate:{s:32,c:80},comfortable:{s:52,c:115}},"Hairdressing & grooming":{minimum:{s:13,c:19},moderate:{s:26,c:42},comfortable:{s:48,c:80}},"Newspapers, books & media":{minimum:{s:8,c:13},moderate:{s:19,c:30},comfortable:{s:32,c:48}},"Life insurance / income protection":{minimum:{s:20,c:24},moderate:{s:20,c:24},comfortable:{s:20,c:24}},"Health / dental insurance":{minimum:{s:0,c:0},moderate:{s:16,c:27},comfortable:{s:42,c:75}},"Dental & optical":{minimum:{s:10,c:16},moderate:{s:19,c:32},comfortable:{s:32,c:55}},"Public transport":{minimum:{s:42,c:75},moderate:{s:26,c:48},comfortable:{s:26,c:48}},"Christmas & birthdays":{minimum:{s:22,c:37},moderate:{s:48,c:75},comfortable:{s:85,c:125}},"My personal spending":{minimum:{s:26,c:26},moderate:{s:48,c:48},comfortable:{s:85,c:85}},"Partner's personal spending":{minimum:{s:0,c:26},moderate:{s:0,c:48},comfortable:{s:0,c:85}}},tg=Object.freeze({minimum:"PLSA Minimum",moderate:"PLSA Moderate",comfortable:"PLSA Comfortable"});let ng=null;function RI(t){ng=t||null}function ro(t){const e=t&&t.plsaTier;return e==="minimum"||e==="comfortable"?e:"moderate"}function Fr(t,e){const i=(ng||CI)[(t||"").trim()];if(!i)return null;const r=i[ro(e)];return r?e&&e.sharedWithPartner?r.c:r.s:null}function ig(){const t=e=>Xl[e].map(n=>({label:n.label,tier:e,annual:null,fromAge:null,toAge:null,hint:n.hint,period:n.period||"yr"}));return[...t("essential"),...t("discretionary")]}function rg(){return kI.map(t=>({label:t.label,tier:t.tier,hint:t.hint,amount:null,atAge:null,everyYears:t.everyYears}))}const $o={pa:12570,brl:50270,hrl:125140},xt=t=>Number.isFinite(+t)?+t:0;function PI(t,e){const n=t.fromAge??e.retirementAge,i=t.toAge??e.endAge;return{from:xt(n),to:xt(i)}}function sg(t,e,n){const{from:i,to:r}=PI(t,e);return n>=i&&n<=r}function Zl(t,e,n="all"){return(t.lines||[]).filter(i=>n==="all"||i.tier===n).filter(i=>sg(i,t,e)).reduce((i,r)=>i+xt(r.annual),0)}function og(t,e){if(!e||!e.sharedWithPartner)return 1;const n=t&&t.paidBy||"me";if(n==="partner")return 0;if(n==="shared"){const i=t&&t.mySharePct,r=i!=null&&i!==""&&Number.isFinite(+i)?+i:Number.isFinite(+e.mySharePct)?+e.mySharePct:50;return Math.max(0,Math.min(1,r/100))}return 1}function nf(t,e,n="all"){return(t.lines||[]).filter(i=>n==="all"||i.tier===n).filter(i=>sg(i,t,e)).reduce((i,r)=>i+xt(r.annual)*og(r,t),0)}function MI(t){return Zl(t,xt(t.retirementAge),"all")}function Va(t,e=$o){const n=xt(t),{pa:i,brl:r,hrl:s}=e;if(n<=i)return n;const o=r-.2*(r-i);if(n<=o)return i+(n-i)/.8;const l=o+.6*(s-r);return n<=l?r+(n-o)/.6:s+(n-l)/.55}function rf(t,e=!1){return(t.oneOffs||[]).reduce((n,i)=>{const r=xt(i.amount),s=xt(i.everyYears);return s>0&&r?n+r/s*(e?og(i,t):1):n},0)}function Vr(t){const e=xt(t.retirementAge),n=nf(t,e,"essential"),i=nf(t,e,"all"),r=rf(t,!0),s=i+r,o=MI(t)+rf(t,!1),l=Math.max(0,o-s);return{partnerAllInAnnual:l,partnerAllInMonthly:l/12,essentialAnnualNet:n,comfortableAnnualNet:i,essentialMonthlyNet:n/12,comfortableMonthlyNet:i/12,periodicAnnualAverage:r,periodicMonthlyAverage:r/12,allInComfortableAnnual:s,allInComfortableMonthly:s/12,householdComfortableAnnual:o,householdComfortableMonthly:o/12,sharedWithPartner:!!t.sharedWithPartner,suggestedGrossAnnual:Va(s)}}function za(t){if(t==null)return null;const e=String(t).trim().replace(/^=/,"").replace(/[×x]/gi,"*").replace(/,/g,"");if(!e||!/^[\d+\-*/().\s]+$/.test(e)||!/\d/.test(e))return null;try{const n=Function('"use strict"; return ('+e+");")();return Number.isFinite(n)?Math.round(n*100)/100:null}catch{return null}}function ag(t){return(t||[]).reduce((e,n)=>{const i=xt(n&&n.amount);return i?e+((n.period||"yr")==="mo"?i*12:i):e},0)}function lg(t,e,n){const i=Fr(t,n),r=xt(e);if(i==null||i<=0||r<=0)return null;const s=i*12;return r<=s*.35?"low":r>=s*3?"high":null}function Ds(t=45,e=60,n=100){return{version:1,currentAge:xt(t),retirementAge:xt(e),endAge:xt(n),sharedWithPartner:!1,mySharePct:50,plsaTier:"moderate",lines:[],oneOffs:[]}}let yr=null,Re=null;function ki(){return Be()&&dt()}function vn(){yr=null,Re=null}function Tu(){return{equityMin:ye.EQUITY_MIN,bondMin:ye.BOND_MIN,cashTarget:ye.CASH_TARGET,duration:ye.DURATION_YEARS,baseSalary:ye.BASE_SALARY,other:0,statePension:12e3,statePensionYear:12,pa:Ye.PERSONAL_ALLOWANCE,brl:Ye.BASIC_RATE_LIMIT,hrl:Ye.HIGHER_RATE_LIMIT,taxMode:"inflates",protectionMult:$i.PROTECTION_MULTIPLIER,consecutiveLimit:ye.CONSECUTIVE_LIMIT,disableProtection:!1,hodlEnabled:$i.HODL_ENABLED,hodlValue:$i.HODL_VALUE,isaBalance:0,isaReturn:Jt.RETURN,isaMin:Jt.MIN,isaDrawdownStrategy:Jt.DRAWDOWN_STRATEGY}}function cg(){return{equityMin:ye.EQUITY_MIN,bondMin:ye.BOND_MIN,cashTarget:ye.CASH_TARGET,duration:ye.DURATION_YEARS,baseSalary:ye.BASE_SALARY,protectionFactor:ye.PROTECTION_FACTOR,recoveryBuffer:ye.RECOVERY_BUFFER,consecutiveLimit:ye.CONSECUTIVE_LIMIT,spStartDate:null,spWeeklyAmount:0,statePension:0,statePensionYear:0,isaBalance:0,isaReturn:Jt.RETURN,isaMin:Jt.MIN,isaDrawdownStrategy:Jt.DRAWDOWN_STRATEGY}}function DI(t,e={},n=new Date().toISOString()){const i=t||{};return{...Tu(),...e,equityMin:i.equityMin,bondMin:i.bondMin,cashTarget:i.cashTarget,duration:i.duration,baseSalary:i.baseSalary,spStartDate:i.spStartDate??e.spStartDate??null,spWeeklyAmount:i.spWeeklyAmount??e.spWeeklyAmount??0,consecutiveLimit:i.consecutiveLimit,recoveryBuffer:i.recoveryBuffer,protectionMult:i.protectionFactor!=null?1-i.protectionFactor/100:e.protectionMult??$i.PROTECTION_MULTIPLIER,isaBalance:i.isaBalance??0,isaReturn:i.isaReturn??Jt.RETURN,isaMin:i.isaMin??Jt.MIN,isaDrawdownStrategy:i.isaDrawdownStrategy??Jt.DRAWDOWN_STRATEGY,seededFrom:"decision",seededAt:n,decisionChecksum:va(i)}}function ug(){return{}}function dg(){return Ds()}function BI(t="My Plan",e="",n=["stress","decision"]){return{planDetails:{name:t,description:e},enabledTools:n,isActive:!0,decisionTool:{settings:cg(),history:[],taxYears:ug()},stressTool:{settings:Tu()},budgetTool:{settings:dg()}}}async function Iu(){if(yr)return yr;if(!ki())return[];try{const t=await Fa();return yr=t,t}catch(t){return console.error("Error listing scenarios:",t),[]}}async function Lt(){if(Re)return Re;if(!ki())return null;try{const e=(await Iu()).find(n=>n.isActive);return e?(Re=e,e):null}catch(t){return console.error("Error getting active scenario:",t),null}}async function LI(t,e,n,i={},r=!0){if(!ki())throw new Error("Must be logged in to create scenarios");const s=BI(t,e,n);if(i.stressSettings&&(s.stressTool.settings={...s.stressTool.settings,...i.stressSettings}),i.decisionSettings&&(s.decisionTool.settings={...s.decisionTool.settings,...i.decisionSettings}),i.taxYears&&(s.decisionTool.taxYears=i.taxYears),s.isActive=r,r&&yr){const l=yr.find(c=>c.isActive);l&&(await Eu(null),await Ai(l.id,{isActive:!1}))}const o=await Jm(s);return vn(),o}async function NI(t){if(!ki())throw new Error("Must be logged in to switch scenarios");await Eu(t),vn()}async function OI(t,e){if(!ki())throw new Error("Must be logged in to duplicate scenarios");const n=await SI(t);if(!n)throw new Error("Source scenario not found");const{id:i,createdAt:r,lastModified:s,...o}=n;o.planDetails={...o.planDetails,name:e},o.isActive=!1;const l=await Jm(o);return vn(),l}async function FI(t,e){if(!ki())throw new Error("Must be logged in to rename scenarios");await Ai(t,{"planDetails.name":e}),vn()}async function VI(t,e){if(!ki())throw new Error("Must be logged in to update scenarios");await Ai(t,{enabledTools:e}),vn()}async function zI(t){if(!ki())throw new Error("Must be logged in to delete scenarios");const e=await Iu();if(e.length<=1)throw new Error("Cannot delete the last scenario");const n=e.find(i=>i.id===t);if(n!=null&&n.isActive){const i=e.find(r=>r.id!==t);i&&await Eu(i.id)}await xI(t),vn()}async function $I(){var e;const t=await Lt();return((e=t==null?void 0:t.stressTool)==null?void 0:e.settings)||Tu()}async function hg(t){const e=await Lt();if(!e)throw new Error("No active scenario");await Ai(e.id,{"stressTool.settings":t}),Re&&(Re.stressTool||(Re.stressTool={}),Re.stressTool.settings=t)}async function UI(){var e;const t=await Lt();return((e=t==null?void 0:t.decisionTool)==null?void 0:e.settings)||cg()}async function qI(t){const e=await Lt();if(!e)throw new Error("No active scenario");await Ai(e.id,{"decisionTool.settings":t}),Re&&(Re.decisionTool||(Re.decisionTool={}),Re.decisionTool.settings=t)}async function HI(){var e;const t=await Lt();return((e=t==null?void 0:t.budgetTool)==null?void 0:e.settings)||dg()}async function WI(t){const e=await Lt();if(!e)throw new Error("No active scenario");await Ai(e.id,{"budgetTool.settings":t}),Re&&(Re.budgetTool||(Re.budgetTool={}),Re.budgetTool.settings=t)}async function GI(){var e;const t=await Lt();return((e=t==null?void 0:t.decisionTool)==null?void 0:e.taxYears)||ug()}async function YI(t){const e=await Lt();if(!e)throw new Error("No active scenario");await Ai(e.id,{"decisionTool.taxYears":t}),Re&&(Re.decisionTool||(Re.decisionTool={}),Re.decisionTool.taxYears=t)}async function jI(){var e;const t=await Lt();return((e=t==null?void 0:t.decisionTool)==null?void 0:e.history)||[]}async function fg(t){const e=await Lt();if(!e)throw new Error("No active scenario");await Ai(e.id,{"decisionTool.history":t}),Re&&(Re.decisionTool||(Re.decisionTool={}),Re.decisionTool.history=t)}async function pg(){const t=await Lt();return(t==null?void 0:t.enabledTools)||["stress","decision"]}let vi=null;function Uo(){return{settings:{equityMin:ye.EQUITY_MIN,bondMin:ye.BOND_MIN,cashTarget:ye.CASH_TARGET,duration:ye.DURATION_YEARS,equityGlideEnabled:!1,locked:!1,baseSalary:ye.BASE_SALARY,spendingProfile:"flat",protectionFactor:ye.PROTECTION_FACTOR,recoveryBuffer:ye.RECOVERY_BUFFER,consecutiveLimit:ye.CONSECUTIVE_LIMIT,startDate:null,spStartDate:null,spWeeklyAmount:0,statePension:0,statePensionYear:0},taxYears:{},history:[],lastModified:null,checksum:null}}function $a(){return Be()&&dt()}function Ti(){vi=null}function mg(){return vi||Uo()}async function bn(){if(vi)return vi;if(!$a())return console.warn("Firebase not available - returning defaults"),Uo();try{const[t,e,n]=await Promise.all([UI(),GI(),jI()]),i={settings:t||Uo().settings,taxYears:e||{},history:n||[],lastModified:new Date().toISOString(),checksum:null};return i.checksum=gg(i),vi=i,i}catch(t){console.error("Error loading decision data:",t)}return Uo()}async function Ua(t){if(!$a())throw new Error("Must be logged in to save data");try{t.lastModified=new Date().toISOString(),t.checksum=gg(t),await Promise.all([qI(t.settings),YI(t.taxYears)]),vi=t}catch(e){throw console.error("Error saving decision data:",e),new Error("Failed to save decision data")}}function gg(t){const e={settings:t.settings,taxYears:t.taxYears,historyCount:t.history.length,lastHistoryDate:t.history.length>0?t.history[t.history.length-1].date:null};return va(e)}function yg(t){if(!t)return"";const{locked:e,...n}=t;return va(n)}async function Et(){return(await bn()).settings}async function so(t){const e=await bn();e.settings={...e.settings,...t},await Ua(e)}function Su(){return{pa:Ye.PERSONAL_ALLOWANCE,brl:Ye.BASIC_RATE_LIMIT,hrl:Ye.HIGHER_RATE_LIMIT,cpi:.04,other:0,isaSavingsAllocation:0,isaSavingsUsed:0,isaContribution:0,isTaxEfficient:!0,taxEfficiencyChoice:null,grossIncomeToDate:0,startMonth:4,yearSetupComplete:!1,confirmedSalary:null}}function KI(t){const n=mg().taxYears[t];return n||Su()}async function qa(t){const n=(await bn()).taxYears[t];return n||Su()}async function nr(t,e){console.log(`saveTaxYearConfig: Saving tax year ${t}`,e);const n=await bn();n.taxYears[t]={...KI(t),...e},await Ua(n),console.log(`saveTaxYearConfig: Saved tax year ${t}, yearSetupComplete=${n.taxYears[t].yearSetupComplete}`)}async function QI(t){const e=vi||await bn(),n=(e.history||[]).filter(r=>r.taxYear===t),i=n.reduce((r,s)=>r+(s.isa||0),0);return console.log(`recalculateIsaSavingsUsed: Tax year ${t}, found ${n.length} records, total ISA used: ${i}`),console.log("recalculateIsaSavingsUsed: History records:",n.map(r=>({date:r.date,isa:r.isa}))),e.taxYears[t]||(console.log(`recalculateIsaSavingsUsed: No existing config for ${t}, creating default`),e.taxYears[t]=Su()),console.log(`recalculateIsaSavingsUsed: Before update, isaSavingsUsed=${e.taxYears[t].isaSavingsUsed}`),e.taxYears[t].isaSavingsUsed=i,console.log(`recalculateIsaSavingsUsed: After update, isaSavingsUsed=${e.taxYears[t].isaSavingsUsed}`),await Ua(e),console.log("recalculateIsaSavingsUsed: Saved to Firebase"),i}async function JI(t){const e=await qa(t),n=e.yearSetupComplete===!0;return console.log(`isYearSetupComplete: Tax year ${t}, yearSetupComplete=${e.yearSetupComplete}, result=${n}`),n}async function Jn(){return(await bn()).taxYears}function XI(t={}){let n=[...mg().history];return t.taxYear&&(n=n.filter(i=>i.taxYear===t.taxYear)),t.startDate&&(n=n.filter(i=>i.date>=t.startDate)),t.endDate&&(n=n.filter(i=>i.date<=t.endDate)),t.sortDesc?n.sort((i,r)=>r.date.localeCompare(i.date)):n.sort((i,r)=>i.date.localeCompare(r.date)),t.limit&&(n=n.slice(0,t.limit)),n}async function ir(t={}){return await bn(),XI(t)}async function ZI(t){if(!$a())throw new Error("Must be logged in to save history");const e=await bn(),n=e.history.findIndex(i=>i.date===t.date);n>=0?e.history[n]=t:e.history.push(t),e.history.sort((i,r)=>i.date.localeCompare(r.date)),await fg(e.history)}async function vg(t){if(!$a())throw new Error("Must be logged in to delete history");const e=await bn();e.history=e.history.filter(n=>n.date!==t),await fg(e.history)}async function xu(t){const e=await Et(),n=await Jn(),i=e.spStartDate,r=e.spWeeklyAmount||0;if(!i||!r){let f=null;if(i){const{formatStatePensionDate:m}=await zd(async()=>{const{formatStatePensionDate:p}=await Promise.resolve().then(()=>lf);return{formatStatePensionDate:p}},void 0,import.meta.url);f=m(i)}return{amount:0,monthly:0,yearsUntil:0,isReceiving:!1,isFirstYear:!1,startDate:f}}const{calculateStatePensionForTaxYear:s,getTimeUntilStatePension:o,parseStatePensionDate:l}=await zd(async()=>{const{calculateStatePensionForTaxYear:f,getTimeUntilStatePension:m,parseStatePensionDate:p}=await Promise.resolve().then(()=>lf);return{calculateStatePensionForTaxYear:f,getTimeUntilStatePension:m,parseStatePensionDate:p}},void 0,import.meta.url),c=s({taxYear:t,spStartDate:i,weeklyAmount:r,taxYearConfigs:n}),u=o(i);return{amount:c.annual,monthly:c.monthly,yearsUntil:u.years,monthsUntil:u.months,isReceiving:c.isReceiving,isFirstYear:c.isFirstYear,weeksInYear:c.weeksInYear,startDate:c.startDate}}async function eS(t){const e=$y(t);e.stdSipp=t.stdSipp||t.sippDraw;try{const n=await Et();e.settingsChecksum=yg(n)}catch(n){console.warn("Could not stamp settings checksum on decision:",n)}await ZI(e),t.taxYear&&await QI(t.taxYear)}const ec={CONSECUTIVE_LIMIT:3,RECOVERY_BUFFER:1e4};function bg({totalGrowth:t,minGrowth:e,consecCashDraws:n,wasInProtection:i,consecutiveLimit:r=ec.CONSECUTIVE_LIMIT,recoveryBuffer:s=ec.RECOVERY_BUFFER}){let o=!1;return i&&(o=t<=e+s),!o&&t<e&&n+1>=r&&(o=!0),o}const ua={MAX_FRACTION:.5,MIN_BOOST:50,SURPLUS_BUFFER:15e3};function wg({shortfall:t,standardMonthly:e,remainingMonths:n,surplus:i,brlHeadroom:r=1/0,maxFraction:s=ua.MAX_FRACTION,minBoost:o=ua.MIN_BOOST}){if(!(t>0)||!(i>0)||n<1)return 0;const l=[t/n,i/n];if(Number.isFinite(r)){if(r<=0)return 0;l.push(r/n)}l.push(e*s);const c=Math.min(...l);return c>o?c:0}const tS=[[{ticker:"ATST",name:"Alliance Trust",subClass:"worldGrowth"},{ticker:"ATT",name:"Allianz Technology Trust",subClass:"worldGrowth"},{ticker:"BGFD",name:"Baillie Gifford Japan Trust",subClass:"worldGrowth"},{ticker:"BNKR",name:"Bankers Investment Trust",subClass:"worldGrowth"},{ticker:"BUT",name:"Brunner Investment Trust",subClass:"worldGrowth"},{ticker:"CLDN",name:"Caledonia Investments",subClass:"worldGrowth"},{ticker:"CSP1",name:"iShares Core S&P 500 (Acc)",subClass:"worldGrowth"},{ticker:"CUKX",name:"iShares Core FTSE 100 (Acc)",subClass:"ukEquityIncome"},{ticker:"EQQQ",name:"Invesco Nasdaq-100",subClass:"worldGrowth"},{ticker:"FCIT",name:"F&C Investment Trust",subClass:"worldGrowth"},{ticker:"FWRA",name:"Invesco FTSE All-World (Acc)",subClass:"worldGrowth"},{ticker:"FWRG",name:"Invesco FTSE All-World (Dist)",subClass:"worldGrowth"},{ticker:"GSPX",name:"iShares S&P 500 GBP-Hedged",subClass:"worldGrowth"},{ticker:"HGT",name:"HgCapital Trust",subClass:"worldGrowth"},{ticker:"HMWO",name:"HSBC MSCI World",subClass:"worldGrowth"},{ticker:"HVPE",name:"HarbourVest Global Private Equity",subClass:"worldGrowth"},{ticker:"IBT",name:"International Biotechnology Trust",subClass:"worldGrowth"},{ticker:"IITU",name:"iShares S&P 500 Information Technology",subClass:"worldGrowth"},{ticker:"IMEU",name:"iShares Core MSCI Europe",subClass:"worldGrowth"},{ticker:"INRG",name:"iShares Global Clean Energy",subClass:"worldGrowth"},{ticker:"ISAC",name:"iShares MSCI ACWI (Acc)",subClass:"worldGrowth"},{ticker:"IUHC",name:"iShares S&P 500 Health Care",subClass:"worldGrowth"},{ticker:"IUSA",name:"iShares Core S&P 500 (Dist)",subClass:"worldGrowth"},{ticker:"IWDA",name:"iShares Core MSCI World (Acc, USD line)",subClass:"worldGrowth"},{ticker:"IWDG",name:"iShares Core MSCI World GBP-Hedged",subClass:"worldGrowth"},{ticker:"IJPN",name:"iShares MSCI Japan",subClass:"worldGrowth"},{ticker:"JAM",name:"JPMorgan American Investment Trust",subClass:"worldGrowth"},{ticker:"LCWL",name:"Amundi (Lyxor) Core MSCI World",subClass:"worldGrowth"},{ticker:"MNKS",name:"Monks Investment Trust",subClass:"worldGrowth"},{ticker:"MWY",name:"Mid Wynd International",subClass:"worldGrowth"},{ticker:"PACW",name:"Amundi Prime All Country World",subClass:"worldGrowth"},{ticker:"PCT",name:"Polar Capital Technology Trust",subClass:"worldGrowth"},{ticker:"PIN",name:"Pantheon International",subClass:"worldGrowth"},{ticker:"RCP",name:"RIT Capital Partners",subClass:"worldGrowth"},{ticker:"SJG",name:"Schroder Japan Trust",subClass:"worldGrowth"},{ticker:"SMT",name:"Scottish Mortgage Investment Trust",subClass:"worldGrowth"},{ticker:"SSAC",name:"iShares MSCI ACWI",subClass:"worldGrowth"},{ticker:"SWDA",name:"iShares Core MSCI World",subClass:"worldGrowth"},{ticker:"SWLD",name:"SPDR MSCI World",subClass:"worldGrowth"},{ticker:"VAPX",name:"Vanguard FTSE Dev Asia Pacific ex-Japan",subClass:"worldGrowth"},{ticker:"VERX",name:"Vanguard FTSE Developed Europe ex-UK",subClass:"worldGrowth"},{ticker:"VEUR",name:"Vanguard FTSE Developed Europe",subClass:"worldGrowth"},{ticker:"VEVE",name:"Vanguard FTSE Developed World (Dist)",subClass:"worldGrowth"},{ticker:"VHVG",name:"Vanguard FTSE Developed World (Acc)",subClass:"worldGrowth"},{ticker:"VJPN",name:"Vanguard FTSE Japan",subClass:"worldGrowth"},{ticker:"VNRT",name:"Vanguard FTSE North America",subClass:"worldGrowth"},{ticker:"VUAG",name:"Vanguard S&P 500 (Acc)",subClass:"worldGrowth"},{ticker:"VUSA",name:"Vanguard S&P 500 (Dist)",subClass:"worldGrowth"},{ticker:"VWRL",name:"Vanguard FTSE All-World (Dist)",subClass:"worldGrowth"},{ticker:"VWRP",name:"Vanguard FTSE All-World (Acc)",subClass:"worldGrowth"},{ticker:"WTAN",name:"Witan Investment Trust",subClass:"worldGrowth"},{ticker:"WWH",name:"Worldwide Healthcare Trust",subClass:"worldGrowth"}],[{ticker:"3IN",name:"3i Infrastructure",subClass:"ukEquityIncome"},{ticker:"AEI",name:"abrdn Equity Income Trust",subClass:"ukEquityIncome"},{ticker:"BBGI",name:"BBGI Global Infrastructure",subClass:"ukEquityIncome"},{ticker:"BSIF",name:"Bluefield Solar Income Fund",subClass:"ukEquityIncome"},{ticker:"CTY",name:"City of London Investment Trust",subClass:"ukEquityIncome"},{ticker:"DIG",name:"Dunedin Income Growth",subClass:"ukEquityIncome"},{ticker:"EDIN",name:"Edinburgh Investment Trust",subClass:"ukEquityIncome"},{ticker:"FGT",name:"Finsbury Growth & Income Trust",subClass:"ukEquityIncome"},{ticker:"FSFL",name:"Foresight Solar Fund",subClass:"ukEquityIncome"},{ticker:"FTAL",name:"SPDR FTSE UK All Share",subClass:"ukEquityIncome"},{ticker:"GRID",name:"Gresham House Energy Storage",subClass:"ukEquityIncome"},{ticker:"GSF",name:"Gore Street Energy Storage",subClass:"ukEquityIncome"},{ticker:"HHI",name:"Henderson High Income Trust",subClass:"ukEquityIncome"},{ticker:"HICL",name:"HICL Infrastructure",subClass:"ukEquityIncome"},{ticker:"HUKX",name:"HSBC FTSE 100",subClass:"ukEquityIncome"},{ticker:"INPP",name:"International Public Partnerships",subClass:"ukEquityIncome"},{ticker:"ISF",name:"iShares Core FTSE 100 (Dist)",subClass:"ukEquityIncome"},{ticker:"IUKD",name:"iShares UK Dividend",subClass:"ukEquityIncome"},{ticker:"JCH",name:"JPMorgan Claverhouse",subClass:"ukEquityIncome"},{ticker:"JLEN",name:"JLEN Environmental Assets",subClass:"ukEquityIncome"},{ticker:"LWDB",name:"Law Debenture Corporation",subClass:"ukEquityIncome"},{ticker:"MRCH",name:"Merchants Trust",subClass:"ukEquityIncome"},{ticker:"MUT",name:"Murray Income Trust",subClass:"ukEquityIncome"},{ticker:"NESF",name:"NextEnergy Solar Fund",subClass:"ukEquityIncome"},{ticker:"ORIT",name:"Octopus Renewables Infrastructure",subClass:"ukEquityIncome"},{ticker:"SEIT",name:"SDCL Energy Efficiency Income",subClass:"ukEquityIncome"},{ticker:"SHRS",name:"Shires Income",subClass:"ukEquityIncome"},{ticker:"TIGT",name:"Troy Income & Growth Trust",subClass:"ukEquityIncome"},{ticker:"TMPL",name:"Temple Bar Investment Trust",subClass:"ukEquityIncome"},{ticker:"TRIG",name:"The Renewables Infrastructure Group",subClass:"ukEquityIncome"},{ticker:"UKDV",name:"SPDR UK Dividend Aristocrats",subClass:"ukEquityIncome"},{ticker:"UKW",name:"Greencoat UK Wind",subClass:"ukEquityIncome"},{ticker:"VMID",name:"Vanguard FTSE 250",subClass:"ukEquityIncome"},{ticker:"VUKE",name:"Vanguard FTSE 100",subClass:"ukEquityIncome"}],[{ticker:"GBDV",name:"SPDR Global Dividend Aristocrats",subClass:"globalEquityIncome"},{ticker:"HFEL",name:"Henderson Far East Income",subClass:"globalEquityIncome"},{ticker:"IAPD",name:"iShares Asia Pacific Dividend",subClass:"globalEquityIncome"},{ticker:"IDVY",name:"iShares Euro Dividend",subClass:"globalEquityIncome"},{ticker:"JGGI",name:"JPMorgan Global Growth & Income",subClass:"globalEquityIncome"},{ticker:"MYI",name:"Murray International Trust",subClass:"globalEquityIncome"},{ticker:"SAIN",name:"Scottish American Investment Co",subClass:"globalEquityIncome"},{ticker:"STS",name:"STS Global Income & Growth (Troy)",subClass:"globalEquityIncome"},{ticker:"USDV",name:"SPDR US Dividend Aristocrats",subClass:"globalEquityIncome"},{ticker:"VHYL",name:"Vanguard FTSE All-World High Div Yield",subClass:"globalEquityIncome"}],[{ticker:"BBOX",name:"Tritax Big Box REIT",subClass:"reit"},{ticker:"BLND",name:"British Land",subClass:"reit"},{ticker:"BYG",name:"Big Yellow Group",subClass:"reit"},{ticker:"DLN",name:"Derwent London",subClass:"reit"},{ticker:"IHR",name:"Impact Healthcare REIT",subClass:"reit"},{ticker:"IUKP",name:"iShares UK Property",subClass:"reit"},{ticker:"IWDP",name:"iShares Developed Markets Property Yield",subClass:"reit"},{ticker:"LAND",name:"Land Securities (Landsec)",subClass:"reit"},{ticker:"LMP",name:"LondonMetric Property",subClass:"reit"},{ticker:"PHP",name:"Primary Health Properties",subClass:"reit"},{ticker:"SAFE",name:"Safestore Holdings",subClass:"reit"},{ticker:"SGRO",name:"Segro",subClass:"reit"},{ticker:"SHED",name:"Urban Logistics REIT",subClass:"reit"},{ticker:"SRE",name:"Sirius Real Estate",subClass:"reit"},{ticker:"SUPR",name:"Supermarket Income REIT",subClass:"reit"},{ticker:"THRL",name:"Target Healthcare REIT",subClass:"reit"},{ticker:"TRY",name:"TR Property Investment Trust",subClass:"reit"},{ticker:"UTG",name:"Unite Group",subClass:"reit"},{ticker:"WHR",name:"Warehouse REIT",subClass:"reit"}],[{ticker:"AAS",name:"abrdn Asia Focus",subClass:"emEquity"},{ticker:"EMIM",name:"iShares Core MSCI EM IMI",subClass:"emEquity"},{ticker:"FCSS",name:"Fidelity China Special Situations",subClass:"emEquity"},{ticker:"FEML",name:"Fidelity Emerging Markets Limited",subClass:"emEquity"},{ticker:"HMEF",name:"HSBC MSCI Emerging Markets",subClass:"emEquity"},{ticker:"JII",name:"JPMorgan Indian Investment Trust",subClass:"emEquity"},{ticker:"JMG",name:"JPMorgan Emerging Markets",subClass:"emEquity"},{ticker:"SEMA",name:"SPDR MSCI Emerging Markets",subClass:"emEquity"},{ticker:"TEM",name:"Templeton Emerging Markets",subClass:"emEquity"},{ticker:"VEIL",name:"Vietnam Enterprise Investments",subClass:"emEquity"},{ticker:"VFEG",name:"Vanguard FTSE Emerging Markets (Acc)",subClass:"emEquity"},{ticker:"VFEM",name:"Vanguard FTSE Emerging Markets (Dist)",subClass:"emEquity"},{ticker:"VOF",name:"VinaCapital Vietnam Opportunity",subClass:"emEquity"}],[{ticker:"ASL",name:"Aberforth Smaller Companies",subClass:"globalSmallCap"},{ticker:"BRSC",name:"BlackRock Smaller Companies",subClass:"globalSmallCap"},{ticker:"EWI",name:"Edinburgh Worldwide",subClass:"globalSmallCap"},{ticker:"HSL",name:"Henderson Smaller Companies",subClass:"globalSmallCap"},{ticker:"ISP6",name:"iShares S&P SmallCap 600",subClass:"globalSmallCap"},{ticker:"MTU",name:"Montanaro UK Smaller Companies",subClass:"globalSmallCap"},{ticker:"SSON",name:"Smithson Investment Trust",subClass:"globalSmallCap"},{ticker:"THRG",name:"BlackRock Throgmorton Trust",subClass:"globalSmallCap"},{ticker:"USSC",name:"SPDR MSCI USA Small Cap Value Weighted",subClass:"globalSmallCap"},{ticker:"WLDS",name:"iShares MSCI World Small Cap",subClass:"globalSmallCap"},{ticker:"WOSC",name:"SPDR MSCI World Small Cap",subClass:"globalSmallCap"}],[{ticker:"AGBP",name:"iShares Core Global Agg GBP-Hedged",subClass:"globalAggHedged"},{ticker:"GLTL",name:"SPDR Bloomberg 15+ Year Gilt",subClass:"longGilts"},{ticker:"GLTS",name:"SPDR Bloomberg 1-5 Year Gilt",subClass:"shortGilts"},{ticker:"IBTL",name:"iShares $ Treasury 20+yr",subClass:"usTreasHedged"},{ticker:"IBTM",name:"iShares $ Treasury 7-10yr",subClass:"usTreasHedged"},{ticker:"IBTS",name:"iShares $ Treasury 1-3yr",subClass:"usTreasHedged"},{ticker:"IDTG",name:"iShares $ Treasury 7-10yr GBP-Hedged",subClass:"usTreasHedged"},{ticker:"IGLS",name:"iShares UK Gilts 0-5yr",subClass:"shortGilts"},{ticker:"IGLT",name:"iShares Core UK Gilts",subClass:"longGilts"},{ticker:"INXG",name:"iShares £ Index-Linked Gilts",subClass:"indexLinked"},{ticker:"IS15",name:"iShares £ Corp Bond 0-5yr",subClass:"corporateIG"},{ticker:"ITPS",name:"iShares $ TIPS",subClass:"indexLinked"},{ticker:"SLXX",name:"iShares Core £ Corp Bond",subClass:"corporateIG"},{ticker:"TI5G",name:"iShares $ TIPS 0-5 (GBP-Hedged)",subClass:"indexLinked"},{ticker:"VAGP",name:"Vanguard Global Aggregate (GBP-Hedged, Dist)",subClass:"globalAggHedged"},{ticker:"VAGS",name:"Vanguard Global Aggregate (GBP-Hedged, Acc)",subClass:"globalAggHedged"},{ticker:"VGOV",name:"Vanguard UK Gilt",subClass:"longGilts"},{ticker:"VUTY",name:"Vanguard USD Treasury Bond",subClass:"usTreasHedged"}],[{ticker:"BIPS",name:"Invesco Bond Income Plus",subClass:"highYield"},{ticker:"GHYS",name:"iShares Global High Yield GBP-Hedged",subClass:"highYield"},{ticker:"IHYG",name:"iShares € High Yield Corp Bond",subClass:"highYield"},{ticker:"IHYU",name:"iShares $ High Yield Corp Bond",subClass:"highYield"},{ticker:"NCYF",name:"CQS New City High Yield",subClass:"highYield"}],[{ticker:"GCP",name:"GCP Infrastructure Investments",subClass:"infraDebt"},{ticker:"SEQI",name:"Sequoia Economic Infrastructure",subClass:"infraDebt"}],[{ticker:"CSH2",name:"Amundi Smart Overnight Return",subClass:"moneyMarket"},{ticker:"ERNS",name:"iShares £ Ultrashort Bond",subClass:"moneyMarket"},{ticker:"XSTR",name:"Xtrackers II Sterling Overnight Rate",subClass:"moneyMarket"}],[{ticker:"PHAU",name:"WisdomTree Physical Gold (USD)",subClass:"gold"},{ticker:"PHGP",name:"WisdomTree Physical Gold (GBP)",subClass:"gold"},{ticker:"RMAU",name:"Royal Mint Physical Gold",subClass:"gold"},{ticker:"SGLD",name:"Invesco Physical Gold",subClass:"gold"},{ticker:"SGLN",name:"iShares Physical Gold",subClass:"gold"}],[{ticker:"BHMG",name:"BH Macro",subClass:"trendMacro"},{ticker:"CGT",name:"Capital Gearing Trust",subClass:"trendMacro"},{ticker:"PNL",name:"Personal Assets Trust",subClass:"trendMacro"},{ticker:"RICA",name:"Ruffer Investment Company",subClass:"trendMacro"}],[{ticker:"AIGC",name:"WisdomTree Broad Commodities",subClass:"commodities"},{ticker:"BRNT",name:"WisdomTree Brent Crude Oil",subClass:"commodities"},{ticker:"CMOD",name:"Invesco Bloomberg Commodity",subClass:"commodities"},{ticker:"COPA",name:"WisdomTree Copper",subClass:"commodities"},{ticker:"CRUD",name:"WisdomTree WTI Crude Oil",subClass:"commodities"},{ticker:"PHSP",name:"WisdomTree Physical Silver (GBP)",subClass:"commodities"},{ticker:"WCOA",name:"WisdomTree Enhanced Commodity (USD)",subClass:"commodities"}]],_g=Object.freeze(tS.flat().sort((t,e)=>t.ticker.localeCompare(e.ticker))),me=Object.freeze({SHARES:"shares",BONDS:"bonds",DIVERSIFIERS:"diversifiers",CASH:"cash"}),Ut=Object.freeze({ukEquityIncome:{bucket:me.SHARES,label:"UK equity income",nominalReturn:.068,yield:.04,vol:.16,eqCorr:.9,duration:0,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:.07},globalEquityIncome:{bucket:me.SHARES,label:"Global equity income",nominalReturn:.07,yield:.03,vol:.16,eqCorr:.95,duration:0,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:.05},worldGrowth:{bucket:me.SHARES,label:"World growth / tracker",nominalReturn:.07,yield:.02,vol:.17,eqCorr:1,duration:0,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:0},reit:{bucket:me.SHARES,label:"Property / REITs",nominalReturn:.065,yield:.045,vol:.19,eqCorr:.65,duration:4,inflationBeta:.3,creditBeta:.2,crisisBeta:0,idioVol:.13,note:"listed property: equity-like with rate sensitivity; rents partly inflation-linked"},emEquity:{bucket:me.SHARES,label:"Emerging-markets equity",nominalReturn:.075,yield:.028,vol:.22,eqCorr:.8,duration:0,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:.13},globalSmallCap:{bucket:me.SHARES,label:"Global smaller companies",nominalReturn:.075,yield:.018,vol:.2,eqCorr:.9,duration:0,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:.09},shortGilts:{bucket:me.BONDS,label:"Short gilts 0-5y (buffer)",nominalReturn:.043,yield:.043,vol:.026,eqCorr:.1,duration:2.5,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:.01},longGilts:{bucket:me.BONDS,label:"Long gilts 15y+",nominalReturn:.064,yield:.055,vol:.108,eqCorr:.2,duration:15,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:.02},indexLinked:{bucket:me.BONDS,label:"Index-linked gilts (long)",nominalReturn:.047,yieldReal:.023,vol:.1,eqCorr:.33,duration:15,inflationBeta:1,creditBeta:0,crisisBeta:0,idioVol:.03,realYield:!0},corporateIG:{bucket:me.BONDS,label:"£ IG corporate",nominalReturn:.053,yield:.052,vol:.065,eqCorr:.41,duration:6.5,inflationBeta:0,creditBeta:.4,crisisBeta:0,idioVol:.03},globalAggHedged:{bucket:me.BONDS,label:"Global-agg £-hedged",nominalReturn:.045,yield:.045,vol:.053,eqCorr:.3,duration:6,inflationBeta:0,creditBeta:.2,crisisBeta:0,idioVol:.02},usTreasHedged:{bucket:me.BONDS,label:"US treasuries £-hedged",nominalReturn:.04,yield:.04,vol:.068,eqCorr:.1,duration:7,inflationBeta:0,creditBeta:0,crisisBeta:.15,idioVol:.02},infraDebt:{bucket:me.BONDS,label:"Infrastructure debt",nominalReturn:.064,yield:.06,vol:.07,eqCorr:.3,duration:8,inflationBeta:.3,creditBeta:.3,crisisBeta:0,idioVol:.03,note:"IG + ~115bps illiquidity premium"},highYield:{bucket:me.BONDS,label:"Global high-yield (£-hedged)",nominalReturn:.058,yield:.065,vol:.1,eqCorr:.6,duration:3.5,inflationBeta:0,creditBeta:.8,crisisBeta:0,idioVol:.05,note:"credit carry net of defaults; spreads blow out with equities in a crash"},moneyMarket:{bucket:me.CASH,label:"Money-market fund",nominalReturn:.034,yield:.034,vol:.002,eqCorr:0,duration:.1,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:0,note:"FCA -1% real; = engine cash model"},savings:{bucket:me.CASH,label:"Savings / NS&I",nominalReturn:.034,yield:.034,vol:.001,eqCorr:0,duration:0,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:0},gold:{bucket:me.DIVERSIFIERS,label:"Gold",nominalReturn:.055,yield:0,vol:.155,eqCorr:.05,duration:0,inflationBeta:.3,creditBeta:0,crisisBeta:.5,idioVol:.14,note:"near-uncorrelated; rises when stocks AND bonds fall (2022)"},trendMacro:{bucket:me.DIVERSIFIERS,label:"Trend / macro",nominalReturn:.045,yield:0,vol:.12,eqCorr:.07,duration:0,inflationBeta:0,creditBeta:0,crisisBeta:0,momentumBeta:.6,idioVol:.1,note:"lagged path-momentum; pays in prolonged 2008/2022, whipsaws in V-shaped 2020"},commodities:{bucket:me.DIVERSIFIERS,label:"Broad commodities",nominalReturn:.045,yield:0,vol:.16,eqCorr:.25,duration:0,inflationBeta:.8,creditBeta:0,crisisBeta:0,idioVol:.14,note:"the strongest inflation hedge (2022); long flat stretches otherwise; crashes WITH equities in a demand shock (2008)"}}),nS=_g,Eg=Object.freeze(Object.fromEntries(nS.map(t=>[t.ticker,t.subClass])));function iS(){const t={};for(const[e,n]of Object.entries(Ut))(t[n.bucket]=t[n.bucket]||[]).push({key:e,label:n.label});return t}const rS=.036,sS=.4,oS=.005,aS=.35,Tg=.01,Au=-.15,Ig=.045;function sf(t,e=.1){let n=rS+sS*t;return e<Au&&t<Ig&&(n-=Tg),n}function of(t,e=.1){let n=oS+aS*(t-.025);return e<Au&&t<Ig&&(n-=Tg),n}function lS(t){return t.inf>.045?"inflation":t.eqReturn<Au?"crash":"normal"}const cS=Object.freeze({shortGilts:{normal:.05,inflation:.3,crash:-.2},longGilts:{normal:.1,inflation:.45,crash:-.35},indexLinked:{normal:.15,inflation:.35,crash:-.15},corporateIG:{normal:.35,inflation:.45,crash:.55},globalAggHedged:{normal:.25,inflation:.4,crash:.1},usTreasHedged:{normal:.05,inflation:.25,crash:-.4},infraDebt:{normal:.3,inflation:.35,crash:.35},gold:{normal:0,inflation:-.05,crash:-.2},trendMacro:{normal:.05,inflation:-.1,crash:-.3},highYield:{normal:.5,inflation:.55,crash:.6},commodities:{normal:.2,inflation:-.1,crash:.4}});function Ha(t,e){const n=cS[t];if(!n)return 0;const i=n[lS(e)];return i??n.normal}const uS=new Map(Object.entries(Ut).map(([t,e])=>[e,t]));function Wa(t,e,n,i){if(!t)return 0;const r=(n-.1)/.17,s=lr(0,1,i),o=e*r+Math.sqrt(Math.max(0,1-e*e))*s;return t*o}function dS(t,e,n){const{inf:i,prevInf:r,eqReturn:s,prevEqReturn:o=.1}=e,l=!!t.realYield,c=t.duration||0,u=l?of(i,s)-of(r,o):sf(i,s)-sf(r,o),f=l?(t.yieldReal||0)+i:t.yield||0,m=-c*u,p=l?0:(t.inflationBeta||0)*(i-.025),w=Wa(t.idioVol||0,Ha(uS.get(t),e),s,n);return f+m+p+w}const hS=Object.freeze({shortGilts:.3,longGilts:.2,indexLinked:.2,corporateIG:.3});function fS(t,e,n=hS){let i=0;for(const r of Object.keys(n)){const s=n[r];if(!s)continue;const o=Ut[r];o&&(i+=s*dS(o,t,e))}return i}const pS=.048,mS=.045;function gS(t,e){const{inf:n,eqReturn:i}=t,r=Ut.gold,s=(r.inflationBeta||0)*(n-.025),o=Wa(r.idioVol||0,Ha("gold",t),i,e);return pS+s+o}function yS(t,e,n){const i=Ut.trendMacro,r=t.eqReturn-.05,s=(i.momentumBeta||0)*n*r,o=Wa(i.idioVol||0,Ha("trendMacro",t),t.eqReturn,e);return mS+s+o}const af=.6,vS=.15;function bS(t,e){return af*t+(1-af)*e}function wS(t){return Math.max(-1,Math.min(1,t/vS))}const _S=.035;function ES(t,e){const{inf:n}=t,i=Ut.commodities,r=(i.inflationBeta||0)*(n-.025),s=Wa(i.idioVol||0,Ha("commodities",t),t.eqReturn,e);return _S+r+s}const TS=Object.freeze({gold:.5,trendMacro:.5});function IS(t,e,n,i=TS){let r=0;return i.gold&&(r+=i.gold*gS(t,e)),i.trendMacro&&(r+=i.trendMacro*yS(t,e,n)),i.commodities&&(r+=i.commodities*ES(t,e)),r}const SS=-.01,xS=5;function Sg(t){return Math.max(0,t+SS)}function Cr(t,e,n=0){const i=wc(n);let r=t.equityStart,s=t.bondStart,o=t.cashStart,l=t.hodlEnabled?t.hodlStart!==void 0?t.hodlStart:t.hodlValue:0,c=0,u=t.diversifierStart||0,f=0,m=0,p=0,w=t.isaBalance||0,I=null;const S=t.isaBalance||0,A=Math.max(1e3,S*.05);let C=null,P=0,L=0;const N=new Array(t.years+1).fill(null),z=new Array(t.years+1).fill(null);let U=0,T=0,y=0,_=0,b=!1,E=!1,x=null,v=0,le=0,pe=-1;const H=[],ee=t.trace?[]:null,ne=[];let te=1;H.push({year:0,month:0,equity:r,bond:s,cash:o,hodl:l,total:r+s+o,draw:0,source:"None",inProtection:!1,equityMin:t.equityMin,bondMin:t.bondMin,cashMax:t.cashTarget});for(let se=0;se<t.years*12;se++){const ce=Math.floor(se/12),xe=se%12,Xn=ce;if(Xn!==pe&&(v=0,le=0,pe=Xn),se>0&&se%12===0){const ie=e.inflation[ce]||.025;ne.push(ie),te*=1+ie}const ft=ya(t.equityGlide,ce,t.duration);if(ft!=null&&xe===0){const ie=r+s;ie>0&&(r=ie*ft,s=ie*(1-ft))}u>0&&xe===0&&(ce>0&&(m=bS(m,e.equity[ce-1]||0)),p=wS(m));const pt=e.equity[ce]||0,nn=e.inflation[ce]||.025,Ot=ce>0?e.inflation[ce-1]||.025:nn;let tt=On(t.equityMin,ce,t.duration,te,!0),mt=On(t.bondMin,ce,t.duration,te,!0);if(ft!=null){const ie=tt+mt;tt=ie*ft,mt=ie*(1-ft)}const _n=On(t.cashTarget,ce,t.duration,te,!1),En=tt+mt,rn=b;b=t.disableProtection?!1:bg({totalGrowth:r+s,minGrowth:En,consecCashDraws:_,wasInProtection:rn,consecutiveLimit:t.consecutiveLimit,recoveryBuffer:t.recoveryBuffer??ec.RECOVERY_BUFFER}),b?(U++,y++):(T=Math.max(T,y),y=0);const{sippMonthly:Tn,isaMonthly:Wt,planInputs:Tt,taxAnnual:Zn,higherRate:sn}=PS(t,ce,te,ne,w);xe===0&&(N[ce]=w/te,z[ce]=(r+s+o+u)/te),L+=Zn/12/te,sn&&P++;const Gt=Tn,In=Gt;let Ee=b?Gt*t.protectionMult:Gt,fe=Ee;const on=Wt,an=ee?{month:se,year:ce,monthInYear:xe,cumInf:te,equityStart:r,bondStart:s,cashStart:o,isaStart:w,sippMonthly:Tn,isaMonthly:Wt,effectiveSipp:Ee,effectiveIsa:on,boostAmount:0,inProtection:b,planInputs:Tt}:null;an&&ee.push(an),b&&(v+=In-fe);const ei=ce>0?e.equity[ce-1]||0:pt,ho=t.subAsset?fS({inf:nn,prevInf:Ot,eqReturn:pt,prevEqReturn:ei},i,t.subAsset.bondWeights):AS(nn,pt,Ot,i),Sn=Sg(Ot),xn=ie=>Math.pow(1+(Number.isFinite(ie)?Math.max(-.99,ie):-.99),1/12);if(r*=xn(pt),s*=xn(ho),o*=xn(Sn),w=Qy(w,t.isaReturn||Jt.RETURN),l>0){const Ft=(i()-.5)*2*.06;let Yt=0;pt<-.1?Yt=Math.min(.15,Math.abs(pt)*.4):pt<-.05&&(Yt=Math.abs(pt)*.2);let gt=.069+Ft+Yt;gt=Math.max(-.08,Math.min(.18,gt)),l*=xn(gt)}if(u>0){const ie=IS({inf:nn,eqReturn:pt},i,p,t.subAsset&&t.subAsset.diversifierWeights);u*=xn(ie)}const ln=r+s;let nt=0;if(!b){const ie=12-xe,Pt=le+In*ie+Tt.fixed;nt=wg({shortfall:v,standardMonthly:In,remainingMonths:ie,surplus:ln-En-ua.SURPLUS_BUFFER,brlHeadroom:Tt.brl-Pt}),nt>50&&(fe+=nt,v-=nt)}le+=fe,an&&(an.effectiveSipp=fe,an.boostAmount=nt>50?nt:0);let It="Growth";if(!b&&ln>=En+fe){const ie=Math.max(0,r-tt),Pt=Math.max(0,s-mt),Ft=ie+Pt;if(Ft>0){if(r-=fe*ie/Ft,s-=fe*Pt/Ft,It="Growth",o<_n){const Yt=ln-En-fe;if(Yt>5e3){const gt=Math.min((_n-o)*.3,Yt*.5);r-=gt*ie/Ft,s-=gt*Pt/Ft,o+=gt}}}else o-=fe,It="Cash"}else if(o>=fe)o-=fe,It="Cash";else{const ie=fe-o;o=0,u>ie?(u-=ie,f+=ie,It="Diversifier"):s>ie?(s-=ie,It="Bond"):r>ie?(r-=ie,It="Equity"):l>ie?(l-=ie,c+=ie,I===null&&(I=se),It="HODL"):(E=!0,x=se)}if(_=It==="Growth"?0:_+1,w=Math.max(0,w-Math.min(on,w)),C===null&&S>0&&w/te<A&&(C=se),r=Math.max(0,r),s=Math.max(0,s),o=Math.max(0,o),u=Math.max(0,u),(xe===0||se===t.years*12-1||E)&&H.push({year:ce+xe/12,month:se,equity:r,bond:s,cash:o,hodl:l,diversifier:u,total:r+s+o+u,draw:fe,boostAmount:nt,source:It,inProtection:b,equityMin:tt,bondMin:mt,cashMax:_n}),E)break}if(T=Math.max(T,y),!E)N[t.years]=w/(te||1),z[t.years]=(r+s+o+u)/(te||1);else for(let se=Math.floor(x/12)+1;se<=t.years;se++)z[se]=0;let Ne=0,Pe=0,ve=0,O=0,Z=1;for(let se=0;se<t.years;se++){const ce=e.inflation[se]??.025;Ne+=ce,Z*=1+ce,Pe+=e.equity[se]??0,se<5&&(ve+=e.equity[se]??0,O++)}const _e=r+s+o+u;return{failed:E,duration:t.years,years:E?x/12:t.years,failMonth:x,avgInflation:Ne/t.years,avgEquityReturn:Pe/t.years,earlyEquityReturn:O?ve/O:0,cumInflation:Z,finalReal:_e/Z,final:_e,finalEquity:r,finalBond:s,finalCash:o,finalHodl:l,finalDiversifier:u,divUsed:f,protMonths:U,maxConsec:T,hodlUsed:c,hodlUsedMonth:I,startIsa:S,finalIsa:w,isaDepletedMonth:C,isaLastedYears:C===null?t.years:C/12,higherRateYears:P/12,totalTaxReal:L,isaByYear:N,potByYear:z,hist:H,trace:ee,seed:n}}function AS(t,e,n,i){let r=.15,s=.3,o=.2,l=.1,c=.1,u=.15;const f=n!==void 0?n:t,m=f>.045,p=f>.07;if(m){const U=i()>.3?1:.5;p?(r=.15+.35*U,s=.3-.2*U,u=.15-.1*U,l=.1+.05*U):(r=.15+.2*U,s=.3-.1*U,u=.15-.05*U)}m&&i()<.15&&(r=.2,s=.25,u=.12);const w=t+.005+lr(0,.03,i),I=.04-(t>.04?(t-.04)*.5:0)+lr(0,.05,i),S=.03+t*.3+lr(0,.08,i),A=t*.8+lr(0,.15,i),C=Sg(n),P=e*.5+lr(0,.02,i),L=r*w+s*I+o*S+l*A+c*C+u*P,N=kS(t,e),z=(e-.1)/.17;return L+N*z*.055}function kS(t,e){return t>.045?.4:e<-.15?-.3:.1}function CS(t,e){return Go(e,t.spendingProfile||"flat")}function RS(t,e){return t.spStartYear!==void 0?Math.max(0,t.spStartYear-e):t.statePensionYear!==void 0?Math.max(0,t.statePensionYear-e):0}function PS(t,e,n,i,r=0){const s=t.taxMode==="frozen"?t.pa:t.pa*n,o=t.taxMode==="frozen"?t.brl:t.brl*n,l=t.taxMode==="frozen"?t.hrl:(t.hrl||125140)*n,c=t.baseSalary*n*CS(t,e),u=Ky(t.other,i);let f=0;if(t.spStartYear!==void 0){if(e>=t.spStartYear&&t.spWeeklyAmount>0){const I=t.spWeeklyAmount*52;e===t.spStartYear&&t.spFirstYearRatio!==void 0?f=I*t.spFirstYearRatio*n:f=I*n}}else t.statePensionYear!==void 0&&(f=e>=t.statePensionYear?(t.statePension||0)*n:0);const m=u+f,p=RS(t,e),w=bc({targetGross:c,fixedIncome:m,pa:s,brl:o,hrl:l,isaBalance:r,strategy:t.isaDrawdownStrategy||Jt.DRAWDOWN_STRATEGY,yearsUntilSp:p});return{sippMonthly:w.sippGross/12,isaMonthly:w.isaDraw/12,taxAnnual:w.tax,higherRate:w.taxable>o+1,planInputs:{target:c,other:u,statePension:f,fixed:m,pa:s,brl:o,hrl:l,yearsUntilSp:p}}}function xg(t,e=1e3){const n=[];for(let i=0;i<e;i++)n.push(Cr(t,ku(t,i),i));return n}function ku(t,e){const n=Object.keys(Wi).map(Number).sort((c,u)=>c-u),i=n.length,r=wc(e*12345),s={equity:{},inflation:{}},o=t.blockYears||xS;let l=0;for(;l<t.years;){const c=Math.floor(r()*i);for(let u=0;u<o&&l<t.years;u++,l++){const f=n[(c+u)%i];s.equity[l]=Wi[f],s.inflation[l]=ma[f]||.025}}return s}function Ag(t){const e=Object.keys(Wi).map(Number).sort((r,s)=>r-s),n=Math.max(...e),i=[];for(const r of e){if(r+t.years-1>n)continue;const s={equity:{},inflation:{}};for(let l=0;l<t.years;l++)s.equity[l]=Wi[r+l]||0,s.inflation[l]=ma[r+l]||.025;const o=Cr(t,s,r);o.startYear=r,i.push(o)}return i}function MS(t,e){const n={equity:{},inflation:{}};for(let i=0;i<t.years;i++)n.equity[i]=e.equity[i%e.equity.length],n.inflation[i]=e.inflation[i%e.inflation.length];return Cr(t,n,999)}function DS(t){const e=t.filter(n=>n.failed).length;return(t.length-e)/t.length*100}function BS(t){if(!t||t.failCount===0)return"No shortfalls: every simulated future funded the whole plan.";const e=u=>(u*100).toFixed(1)+"%",n=Math.round(t.medianFailYear),i=t.duration,r=Math.round(t.pctNearMiss);let s;t.pctNearMiss>=60?s=`and when they do it's usually late — the typical shortfall is at year ${n} of ${i}, and ${r}% happen only in the final years, after funding almost the whole of retirement`:t.pctNearMiss<=30?s=`and they tend to come EARLY — the typical shortfall is at year ${n} of ${i}, with only ${r}% holding on to the final years. An early shortfall is the serious kind, with little retirement left to adjust`:s=`spread through retirement — the typical shortfall is at year ${n} of ${i}`;const o=[{mag:t.succEarlyEq-t.failEarlyEq,text:`a poor first few years of markets (sequence-of-returns risk): the futures that fell short averaged ${e(t.failEarlyEq)} equity in the opening 5 years versus ${e(t.succEarlyEq)} for those that lasted`},{mag:t.succAvgEq-t.failAvgEq,text:`weak markets across the whole plan: ${e(t.failAvgEq)} average equity return versus ${e(t.succAvgEq)} for those that lasted`},{mag:t.failAvgInf-t.succAvgInf,text:`higher inflation eroding spending power: ${e(t.failAvgInf)} a year versus ${e(t.succAvgInf)} for those that lasted`}].filter(u=>u.mag>.005).sort((u,f)=>f.mag-u.mag),l=`About ${Math.round(t.failRate||0)}% of futures fall short`;if(!o.length)return`${l}, ${s}. No single market driver stands out — the shortfalls come down to broadly bad luck across returns and inflation.`;let c=`The common thread is ${o[0].text}`;return o[1]&&o[1].mag>o[0].mag*.5&&(c+=`. A secondary factor is ${o[1].text}`),`${l}, ${s}. ${c}.`}function kg(t){const e=t.filter(l=>!l.failed),n=t.filter(l=>l.failed),i=t.map(l=>l.years).sort((l,c)=>l-c),r=e.map(l=>l.final).sort((l,c)=>l-c),s=t.map(l=>l.protMonths).sort((l,c)=>l-c),o=(l,c)=>l[Math.floor(l.length*c)]||0;return{total:t.length,successCount:e.length,failCount:n.length,successRate:DS(t),survival:{p5:o(i,.05),p10:o(i,.1),p25:o(i,.25),p50:o(i,.5),p75:o(i,.75),p90:o(i,.9),p95:o(i,.95),min:i[0],max:i[i.length-1]},finalValue:{p5:o(r,.05),p10:o(r,.1),p25:o(r,.25),p50:o(r,.5),p75:o(r,.75),p90:o(r,.9),p95:o(r,.95),min:r[0]||0,max:r[r.length-1]||0,avg:e.reduce((l,c)=>l+c.final,0)/(e.length||1)},minYears:i[0],p10Years:o(i,.1),medianYears:o(i,.5),medianFinal:o(r,.5),p10Final:o(r,.1),p90Final:o(r,.9),avgFinal:e.reduce((l,c)=>l+c.final,0)/(e.length||1),protection:{runsWithProtection:t.filter(l=>l.protMonths>0).length,pctWithProtection:t.filter(l=>l.protMonths>0).length/t.length*100,avgMonths:s.reduce((l,c)=>l+c,0)/t.length,maxMonths:Math.max(...s),maxConsecutive:Math.max(...t.map(l=>l.maxConsec)),avgConsecutive:t.reduce((l,c)=>l+c.maxConsec,0)/t.length,p50Months:o(s,.5),p90Months:o(s,.9),p95Months:o(s,.95)},runsWithProtection:t.filter(l=>l.protMonths>0).length,avgProtMonths:s.reduce((l,c)=>l+c,0)/t.length,maxProtMonths:Math.max(...s),maxConsecutive:Math.max(...t.map(l=>l.maxConsec)),avgConsecutive:t.reduce((l,c)=>l+c.maxConsec,0)/t.length,hodl:{runsUsingHodl:t.filter(l=>l.hodlUsed>0).length,pctUsingHodl:t.filter(l=>l.hodlUsed>0).length/t.length*100,avgUsed:t.filter(l=>l.hodlUsed>0).length>0?t.filter(l=>l.hodlUsed>0).reduce((l,c)=>l+c.hodlUsed,0)/t.filter(l=>l.hodlUsed>0).length:0,maxUsed:Math.max(...t.map(l=>l.hodlUsed||0))},runsUsingHodl:t.filter(l=>l.hodlUsed>0).length,avgHodlUsed:t.filter(l=>l.hodlUsed>0).length>0?t.filter(l=>l.hodlUsed>0).reduce((l,c)=>l+c.hodlUsed,0)/t.filter(l=>l.hodlUsed>0).length:0,maxHodlUsed:Math.max(...t.map(l=>l.hodlUsed||0)),severity:(()=>{const l=Math.max(...t.map(S=>S.duration||S.years),1),c=t.filter(S=>S.failed),u=t.filter(S=>!S.failed),f=c.map(S=>S.years).sort((S,A)=>S-A),m=l*.85,p=(S,A)=>S.length?S.reduce((C,P)=>C+(P[A]||0),0)/S.length:0,w={duration:l,coverage:t.reduce((S,A)=>S+Math.min(1,(A.years||0)/l),0)/t.length*100,failCount:c.length,failRate:t.length?c.length/t.length*100:0,medianFailYear:f.length?o(f,.5):0,pctNearMiss:c.length?c.filter(S=>S.years>=m).length/c.length*100:0,failEarlyEq:p(c,"earlyEquityReturn"),succEarlyEq:p(u,"earlyEquityReturn"),failAvgEq:p(c,"avgEquityReturn"),succAvgEq:p(u,"avgEquityReturn"),failAvgInf:p(c,"avgInflation"),succAvgInf:p(u,"avgInflation")};w.diagnosis=BS(w);const I=[{k:"sequence",m:w.succEarlyEq-w.failEarlyEq},{k:"market",m:w.succAvgEq-w.failAvgEq},{k:"inflation",m:w.failAvgInf-w.succAvgInf}].filter(S=>S.m>.005).sort((S,A)=>A.m-S.m);return w.primaryDriver=w.failCount>0&&I.length?I[0].k:null,w})(),finalReal:(()=>{const l=t.map(c=>c.failed?0:c.finalReal||0).sort((c,u)=>c-u);return{p5:o(l,.05),p10:o(l,.1),p25:o(l,.25),p50:o(l,.5),p75:o(l,.75),p90:o(l,.9),p95:o(l,.95),min:l[0]||0,max:l[l.length-1]||0}})(),chartData:(()=>{const l=Math.max(...t.map(m=>m.duration||m.years),1),c=l+1,u={p10:[],p25:[],p50:[],p75:[],p90:[]},f=[];for(let m=0;m<c;m++){const p=t.map(I=>I.potByYear&&I.potByYear[m]!=null?I.potByYear[m]:0).sort((I,S)=>I-S);u.p10.push(o(p,.1)),u.p25.push(o(p,.25)),u.p50.push(o(p,.5)),u.p75.push(o(p,.75)),u.p90.push(o(p,.9));const w=t.filter(I=>(I.failed?I.failMonth/12:l)>=m).length;f.push(t.length?w/t.length*100:0)}return{years:c,potBand:u,solvency:f}})(),isa:(()=>{const l=t.filter(S=>(S.startIsa||0)>0);if(!l.length)return{funded:!1};const c=l.map(S=>S.isaLastedYears).sort((S,A)=>S-A),u=l.map(S=>S.finalIsa).sort((S,A)=>S-A),f=l.map(S=>S.higherRateYears),m=l.map(S=>S.totalTaxReal).sort((S,A)=>S-A),p=Math.max(...l.map(S=>(S.isaByYear||[]).length)),w=[],I=[];for(let S=0;S<p;S++){const A=l.filter(P=>P.isaByYear&&P.isaByYear[S]>0).length;w.push(l.length?A/l.length*100:0);const C=l.map(P=>P.isaByYear&&P.isaByYear[S]!=null?P.isaByYear[S]:0).sort((P,L)=>P-L);I.push(C[Math.floor(C.length/2)])}return{funded:!0,runs:l.length,startBalance:l[0].startIsa,medianLastedYears:o(c,.5),minLastedYears:c[0],pctSurviveFullTerm:l.filter(S=>S.isaDepletedMonth===null).length/l.length*100,finalBalance:{p10:o(u,.1),p50:o(u,.5),p90:o(u,.9)},avgHigherRateYears:f.reduce((S,A)=>S+A,0)/l.length,maxHigherRateYears:Math.max(...f),pctEverHigherRate:l.filter(S=>S.higherRateYears>0).length/l.length*100,medianTotalTax:o(m,.5),p90TotalTax:o(m,.9),pctHoldingByYear:w,medianIsaByYear:I}})(),failures:n.map(l=>({seed:l.seed,startYear:l.startYear,years:l.years,failMonth:l.failMonth,protMonths:l.protMonths}))}}function zr(t){if(!t)return null;const e={january:0,jan:0,february:1,feb:1,march:2,mar:2,april:3,apr:3,may:4,june:5,jun:5,july:6,jul:6,august:7,aug:7,september:8,sep:8,sept:8,october:9,oct:9,november:10,nov:10,december:11,dec:11},n=t.trim().replace(/\s+/g," ");if(/^\d{4}-\d{2}-\d{2}$/.test(n)){const r=new Date(n);if(!isNaN(r.getTime()))return r}if(/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(n)){const[r,s,o]=n.split("/").map(Number);return new Date(o,s-1,r)}if(/^\d{1,2}-\d{1,2}-\d{4}$/.test(n)){const[r,s,o]=n.split("-").map(Number);return new Date(o,s-1,r)}let i=n.match(/^(\d{1,2})\s+(\w+)\s+(\d{4})$/i);if(i){const r=parseInt(i[1]),s=e[i[2].toLowerCase()],o=parseInt(i[3]);if(s!==void 0)return new Date(o,s,r)}if(i=n.match(/^(\w+)\s+(\d{1,2})\s+(\d{4})$/i),i){const r=e[i[1].toLowerCase()],s=parseInt(i[2]),o=parseInt(i[3]);if(r!==void 0)return new Date(o,r,s)}if(i=n.match(/^(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})$/i),i){const r=e[i[1].toLowerCase()],s=parseInt(i[2]),o=parseInt(i[3]);if(r!==void 0)return new Date(o,r,s)}if(i=n.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+(\w+),?\s+(\d{4})$/i),i){const r=parseInt(i[1]),s=e[i[2].toLowerCase()],o=parseInt(i[3]);if(s!==void 0)return new Date(o,s,r)}return null}function qo(t){const e=typeof t=="string"?zr(t):t;if(!e||isNaN(e.getTime()))return"";const n=["January","February","March","April","May","June","July","August","September","October","November","December"];return`${e.getDate()} ${n[e.getMonth()]} ${e.getFullYear()}`}function LS(t){const{taxYear:e,spStartDate:n,weeklyAmount:i,taxYearConfigs:r={}}=t;if(!n||!i||i<=0)return{annual:0,monthly:0,isReceiving:!1,isFirstYear:!1,weeksInYear:0,startDate:null};const s=typeof n=="string"?zr(n):n;if(!s||isNaN(s.getTime()))return{annual:0,monthly:0,isReceiving:!1,isFirstYear:!1,weeksInYear:0,startDate:null};const o=ga(s);dl(e);const l=Hy(e),c=[...new Set([o,e,...Object.keys(r)])].sort((S,A)=>dl(S).getTime()-dl(A).getTime()),u=c.indexOf(o),f=c.indexOf(e);if(f<u)return{annual:0,monthly:0,isReceiving:!1,isFirstYear:!1,weeksInYear:0,startDate:qo(s)};let m=1;for(let S=u;S<f;S++){const A=c[S],C=r[A],P=(C==null?void 0:C.cpi)||.025;m*=1+P}const p=i*m;if(e===o){const A=Math.max(0,(l.getTime()-s.getTime())/6048e5),C=p*A;return{annual:C,monthly:C/12,isReceiving:!0,isFirstYear:!0,weeksInYear:Math.round(A*10)/10,startDate:qo(s)}}const I=p*52;return{annual:I,monthly:I/12,isReceiving:!0,isFirstYear:!1,weeksInYear:52,startDate:qo(s)}}function NS(t,e=new Date){const n=typeof t=="string"?zr(t):t;if(!n||isNaN(n.getTime()))return{years:0,months:0,totalMonths:0,isPast:!1};const i=n.getTime()-e.getTime(),r=i<=0;if(r)return{years:0,months:0,totalMonths:0,isPast:!0};const s=Math.floor(i/(30.44*24*60*60*1e3)),o=Math.floor(s/12),l=s%12;return{years:o,months:l,totalMonths:s,isPast:r}}const Cg=2016;function Ga(t,{now:e=new Date}={}){if(!t||!String(t).trim())return{valid:!0,error:null,warning:null,date:null};const n=zr(t);if(!n||isNaN(n.getTime()))return{valid:!1,error:'Could not read that date. Try a format like "6 May 2040".',warning:null,date:null};const i=n.getFullYear();return i<Cg?{valid:!1,error:`That looks like a date of birth (${i}), not a State Pension start date. Enter the date your State Pension begins — check gov.uk/check-your-state-pension.`,warning:null,date:n}:n.getTime()<e.getTime()?{valid:!0,error:null,warning:`This date is in the past — State Pension will be treated as already in payment from ${i}.`,date:n}:{valid:!0,error:null,warning:null,date:n}}const lf=Object.freeze(Object.defineProperty({__proto__:null,MIN_SP_START_YEAR:Cg,calculateStatePensionForTaxYear:LS,formatStatePensionDate:qo,getTimeUntilStatePension:NS,parseStatePensionDate:zr,validateStatePensionDate:Ga},Symbol.toStringTag,{value:"Module"}));let fi=null;function Bs(){return{settings:{equityMin:ye.EQUITY_MIN,bondMin:ye.BOND_MIN,cashTarget:ye.CASH_TARGET,duration:ye.DURATION_YEARS,baseSalary:ye.BASE_SALARY,other:0,statePension:12e3,statePensionYear:12,pa:Ye.PERSONAL_ALLOWANCE,brl:Ye.BASIC_RATE_LIMIT,hrl:Ye.HIGHER_RATE_LIMIT,taxMode:"inflates",protectionMult:$i.PROTECTION_MULTIPLIER,consecutiveLimit:ye.CONSECUTIVE_LIMIT,disableProtection:!1,hodlEnabled:$i.HODL_ENABLED,hodlValue:$i.HODL_VALUE,spendingProfile:"flat",equityGlideEnabled:!1,diversifierStart:0,taggedFunds:[]},lastModified:null,checksum:null}}function Cu(){return Be()&&dt()}function Gn(){fi=null}function OS(){return fi||Bs()}async function Rg(){if(fi)return fi;if(!Cu())return console.warn("Firebase not available - returning defaults"),Bs();try{const t=await $I();if(t){const e={settings:t,lastModified:new Date().toISOString(),checksum:null};return fi=zS(e),fi}}catch(t){console.error("Error loading stress data:",t)}return Bs()}async function FS(t){if(!Cu())throw new Error("Must be logged in to save data");try{t.lastModified=new Date().toISOString(),t.checksum=VS(t),await hg(t.settings),fi=t}catch(e){throw console.error("Error saving stress data:",e),new Error("Failed to save stress data")}}function VS(t){return va(t.settings)}function zS(t){const e={...Bs()};return t.settings&&(e.settings={...e.settings,...t.settings},t.settings.pacwMin!==void 0&&t.settings.equityMin===void 0&&(e.settings.equityMin=t.settings.pacwMin),t.settings.cgtMin!==void 0&&t.settings.bondMin===void 0&&(e.settings.bondMin=t.settings.cgtMin),t.settings.csh2Target!==void 0&&t.settings.cashTarget===void 0&&(e.settings.cashTarget=t.settings.csh2Target),e.settings.hodlEnabled===void 0&&(e.settings.hodlEnabled=!1),e.settings.hodlValue===void 0&&(e.settings.hodlValue=25e3)),e.lastModified=t.lastModified,e.checksum=t.checksum,e}function $S(){return OS().settings}async function Nt(){return(await Rg()).settings}async function oo(t){const e=await Rg();e.settings={...e.settings,...t},await FS(e)}async function US(){if(!Cu())throw new Error("Must be logged in to reset settings");const t=Bs();await hg(t.settings),Gn()}function qS(t){if(!t.spStartDate||!t.spWeeklyAmount)return null;const e=zr(t.spStartDate);if(!e)return console.warn("Could not parse spStartDate:",t.spStartDate),null;const n=new Date,i=365.25*24*60*60*1e3,r=Math.max(0,(e.getTime()-n.getTime())/i),s=Math.floor(r),o=365,l=Math.floor((e-new Date(e.getFullYear(),0,0))/(24*60*60*1e3)),u=(o-l)/o;return{spStartYear:s,spWeeklyAmount:t.spWeeklyAmount,spFirstYearRatio:u}}function ao(t={},e=null){const n=e||$S(),i=qS(n),r=i?{spStartYear:i.spStartYear,spWeeklyAmount:i.spWeeklyAmount,spFirstYearRatio:i.spFirstYearRatio}:{statePension:n.statePension||0,statePensionYear:n.statePensionYear??999};return{equityStart:t.equityStart??n.equityMin,bondStart:t.bondStart??n.bondMin,cashStart:t.cashStart??n.cashTarget,equityMin:n.equityMin,bondMin:n.bondMin,cashTarget:n.cashTarget,years:t.years??n.duration,duration:n.duration,baseSalary:n.baseSalary,other:n.other,...r,pa:n.pa,brl:n.brl,hrl:n.hrl,taxMode:n.taxMode,protectionMult:n.protectionMult,consecutiveLimit:n.consecutiveLimit,disableProtection:n.disableProtection,hodlEnabled:n.hodlEnabled,hodlValue:n.hodlValue,isaBalance:n.isaBalance||0,isaReturn:n.isaReturn,isaDrawdownStrategy:n.isaDrawdownStrategy,spendingProfile:n.spendingProfile||"flat",equityGlide:n.equityGlideEnabled?Af(n):void 0,diversifierStart:t.diversifierStart??(n.diversifierStart||void 0),subAsset:n.subAsset||void 0}}async function Ru(){try{const t=await HI();return{...Ds(),...t||{}}}catch(t){return console.error("Error loading budget:",t),Ds()}}async function Pu(t){const e={...t,derived:Vr(t)};return await WI(e),e}function Y(t,e=null){const n=Math.abs(t),i=e!==null?e:n<100,r=Math.abs(t).toLocaleString("en-GB",{minimumFractionDigits:i?2:0,maximumFractionDigits:i?2:0});return t<0?`-£${r}`:`£${r}`}function cf(t,e){const n=HS(t);e.innerHTML=n}function HS(t){var E,x,v,le,pe;const e=t,n=e.calculationDetails||{};let i="";const r=e.isTaxEfficientYear??e.taxEfficient,s=e.protectionInducedTaxEfficiency||!1,o=e.boostAmount>0;let l,c,u;if(e.inProtection?(l="warning",c="Protection Mode",u="⚡"):o?(l="boost",c="Tax Boost (Catch-up)",u="↑"):s?(l="info",c="Protection-Induced Tax Efficiency",u="↑"):r?(l="success",c="Tax-Efficient Year",u="✓"):(l="warning",c="Tax-Inefficient Year",u="!"),i+=`<div class="decision-mode ${l}">
    <span class="mode-icon">${u}</span>
    <span class="mode-label">${c}</span>
  </div>`,r&&e.yearlyIsaSavingsAllocation>0){const H=e.cumulativeIsaSavingsUsed||0,ee=e.yearlyIsaSavingsAllocation,ne=Math.max(0,ee-H),te=ee>0?H/ee*100:0;i+=`<div class="isa-progress-card">
      <h4>ISA/Savings Allocation</h4>
      <div class="isa-progress-bar">
        <div class="isa-progress-fill" style="width: ${Math.min(te,100)}%"></div>
      </div>
      <div class="isa-progress-stats">
        <span>Used: ${Y(H)} of ${Y(ee)}</span>
        <span>Remaining: ${Y(ne)}</span>
      </div>
    </div>`}if(e.alerts&&e.alerts.length>0){i+='<div class="alerts">';for(const H of e.alerts){const ee=WS(H.severity);i+=`<div class="alert ${ee}">${H.message}</div>`}i+="</div>"}i+='<div class="recommendation-card">',i+="<h3>Monthly Recommendation</h3>",i+='<div class="draw-row primary">',i+='<span class="label">SIPP Withdrawal</span>',i+=`<span class="value">${Y(e.sippDraw)}</span>`,i+="</div>",e.isaDraw>0&&(i+='<div class="draw-row">',i+='<span class="label">ISA Top-up</span>',i+=`<span class="value">${Y(e.isaDraw)}</span>`,i+="</div>"),e.other>0&&(i+='<div class="draw-row muted">',i+='<span class="label">Other Pension</span>',i+=`<span class="value">${Y(e.other)}</span>`,i+="</div>"),e.statePension>0&&(i+='<div class="draw-row muted">',i+='<span class="label">State Pension</span>',i+=`<span class="value">${Y(e.statePension)}</span>`,i+="</div>"),i+='<div class="divider"></div>';const f=e.sippDraw+e.other+e.statePension,m=f*12,p=e.pa||12570,w=e.brl||50270;let I=0;m>p&&(m<=w?I=(m-p)*.2:I=(w-p)*.2+(m-w)*.4);const S=f-I/12+e.isaDraw;i+='<div class="draw-row total">',i+='<span class="label">Total Monthly Income</span>',i+=`<span class="value">${Y(S)}</span>`,i+="</div>",e.boostAmount>0&&(i+='<div class="boost-indicator">',i+='<span class="boost-label">Includes Tax Boost:</span>',i+=`<span class="boost-value">+${Y(e.boostAmount)}</span>`,i+="</div>"),i+="</div>",i+='<div class="source-card">',i+="<h4>Withdraw From</h4>",i+=`<div class="source-label ${e.source.toLowerCase().replace(/[^a-z]+/g,"-")}">${e.source}</div>`,e.source==="Growth"&&(e.drawFromEquity>0||e.drawFromBond>0)&&(i+='<div class="source-breakdown">',e.drawFromEquity>0&&(i+=`<div class="source-item">Equity: ${Y(e.drawFromEquity)}</div>`),e.drawFromBond>0&&(i+=`<div class="source-item">Bond: ${Y(e.drawFromBond)}</div>`),i+="</div>"),e.drawFromDiversifier>0&&(i+='<div class="source-breakdown">',e.drawFromCash>0&&(i+=`<div class="source-item">Cash: ${Y(e.drawFromCash)}</div>`),i+=`<div class="source-item">Diversifier reserve: ${Y(e.drawFromDiversifier)}</div>`,i+="</div>"),i+="</div>",i+='<div class="fund-status">',i+="<h4>Fund Status</h4>";const A=e.equity+e.bond+e.cash+(e.diversifier||0),C=e.adjEquityMin+e.adjBondMin+e.adjCashTarget,P=A-C,L=C>0?P/C*100:0;i+='<div class="fund-grid">';const N=e.equity-e.adjEquityMin;i+=Po("Equity",e.equity,e.adjEquityMin,N);const z=e.bond-e.adjBondMin;i+=Po("Bond",e.bond,e.adjBondMin,z);const U=e.cash-e.adjCashTarget;i+=Po("Cash",e.cash,e.adjCashTarget,U),e.diversifier!=null&&(i+=Po("Diversifiers",e.diversifier,0,e.diversifier)),i+="</div>";const T=P>=0?"healthy":"warning";i+=`<div class="overall-status ${T}">`,i+=`<span>Total Surplus: ${Y(P)}</span>`,i+=`<span>(${L.toFixed(1)}% above target)</span>`,i+="</div>",i+="</div>",i+='<div class="tax-info">',i+="<h4>Tax Summary</h4>",i+='<div class="tax-thresholds">',i+=`<div class="tax-threshold-item"><span class="label">PA:</span><span>${Y(e.pa)}</span></div>`,i+=`<div class="tax-threshold-item"><span class="label">BRL:</span><span>${Y(e.brl)}</span></div>`,n.taxInfo&&(i+=`<div class="tax-threshold-item"><span class="label">Headroom:</span><span class="${n.taxInfo.headroomToBRL>0?"success":"warning"}">${Y(n.taxInfo.headroomToBRL)}</span></div>`),i+="</div>",i+='<div class="tax-comparison">',i+='<div class="tax-comparison-header">',i+="<div></div><div>Monthly</div><div>YTD</div><div>Projected</div>",i+="</div>";const y=((E=n.taxInfo)==null?void 0:E.monthlyTax)||I/12,_=e.taxPaidYTD||y,b=e.taxProjectedAnnual||((x=n.taxInfo)==null?void 0:x.annualTax)||I;if(i+='<div class="tax-comparison-row">',i+='<div class="label">Tax Paid</div>',i+=`<div>${Y(y)}</div>`,i+=`<div>${Y(_)}</div>`,i+=`<div>${Y(b)}</div>`,i+="</div>",r||((v=n.taxInfo)==null?void 0:v.taxSavedAnnual)>0){const H=e.taxSavedMonthly||((le=n.taxInfo)==null?void 0:le.taxSavedMonthly)||0,ee=e.taxSavedYTD||H,ne=e.taxSavedProjectedAnnual||((pe=n.taxInfo)==null?void 0:pe.taxSavedAnnual)||0;ne>0&&(i+='<div class="tax-comparison-row saved">',i+='<div class="label">Tax Saved</div>',i+=`<div class="success">-${Y(H)}</div>`,i+=`<div class="success">-${Y(ee)}</div>`,i+=`<div class="success">-${Y(ne)}</div>`,i+="</div>")}if(i+="</div>",n.taxInfo&&typeof n.taxInfo.effectiveRate=="number"&&!isNaN(n.taxInfo.effectiveRate)){const H=n.taxInfo.effectiveRate*100;i+=`<div class="effective-rate">
      <span>Effective Tax Rate:</span>
      <span class="${H<=20?"success":H<=40?"warning":"danger"}">${H.toFixed(1)}%</span>
    </div>`}else if(n.taxInfo&&n.taxInfo.annualTaxable>0&&n.taxInfo.annualTax>=0){const H=n.taxInfo.annualTax/n.taxInfo.annualTaxable*100;i+=`<div class="effective-rate">
      <span>Effective Tax Rate:</span>
      <span class="${H<=20?"success":H<=40?"warning":"danger"}">${H.toFixed(1)}%</span>
    </div>`}if(i+="</div>",e.rebalanceNeeded&&e.rebalanceActions.length>0){i+='<div class="rebalance-card">',i+="<h4>Rebalancing Suggestions</h4>",i+="<ul>";for(const H of e.rebalanceActions)i+=`<li>${H}</li>`;i+="</ul>",i+="</div>"}return i+='<div class="mode-explanation">',i+="<h4>Why This Recommendation?</h4>",i+=`<p>${n.reason||"Standard calculation based on your settings."}</p>`,!n.hasSufficientIsa&&n.isaNeededMonthly>0&&(i+=`<p class="isa-warning">To enable tax-efficient mode, you need ${Y(n.totalIsaNeeded)} in your ISA (${e.remainingMonths} months remaining in tax year).</p>`),i+="</div>",i+='<details class="debug-section">',i+="<summary>Calculation Details</summary>",i+="<pre>"+JSON.stringify(n,null,2)+"</pre>",i+="</details>",i}function Po(t,e,n,i){return`<div class="fund-cell ${i>=0?"healthy":"deficit"}">
    <div class="fund-name">${t}</div>
    <div class="fund-current">${Y(e)}</div>
    <div class="fund-min">Min: ${Y(n)}</div>
    <div class="fund-surplus">${i>=0?"+":""}${Y(i)}</div>
  </div>`}function WS(t){switch(t){case So.DANGER:return"alert-danger";case So.WARNING:return"alert-warning";case So.SUCCESS:return"alert-success";case So.INFO:default:return"alert-info"}}function GS(){return`
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
  `}async function YS(t){const e=vc(t),n=ga(e),i=e.getMonth()+1;return await JI(n)?{showWizard:!1,taxYear:n,isApril:i===4,reason:"Year setup already complete"}:{showWizard:!0,taxYear:n,isApril:i===4,reason:`Tax year ${n} has not been set up`}}function jS(t,e,n=0){return t*(1+e-n)}function KS(t){const{targetAnnualGross:e,brl:n,pa:i=12570,remainingMonths:r,grossIncomeToDate:s=0}=t,o=I=>I<=i?0:I<=n?(I-i)*.2:(n-i)*.2+(I-n)*.4,l=Math.max(0,n-s);if(l<=0)return{isaNeeded:0,brlExhausted:!0,remainingBrlHeadroom:0,maxTaxEfficientSalary:n,reducedSalaryOption:n,canBeTaxEfficient:!1,reason:"BRL already exhausted by prior income"};if(e<=n)return{isaNeeded:0,brlExhausted:!1,remainingBrlHeadroom:l,maxTaxEfficientSalary:n,reducedSalaryOption:n,canBeTaxEfficient:!0,targetAchievableAtBrl:!0,reason:"Target achievable at BRL without ISA"};const c=o(e),u=e-c,f=o(n),m=n-f,p=Math.max(0,u-m),w=p/12*r;return{isaNeeded:w,isaNeededAnnual:p,brlExhausted:!1,remainingBrlHeadroom:l,maxTaxEfficientSalary:n,reducedSalaryOption:n,canBeTaxEfficient:!0,targetAchievableAtBrl:!1,netAtTarget:u,netAtBrl:m,taxAtTarget:c,taxAtBrl:f,reason:`Need £${Math.round(w).toLocaleString()} ISA/Savings for tax efficiency`}}function QS(t,e,n){return n?{sufficient:!1,isBrlExhausted:!0,options:[{key:"reduced",label:"Reduce salary to BRL",description:"Accept lower income to stay tax-efficient"},{key:"inefficient",label:"Accept tax-inefficient year",description:"Draw full SIPP, pay 40% on excess"}]}:t>=e?{sufficient:!0,isBrlExhausted:!1,options:[]}:{sufficient:!1,isBrlExhausted:!1,shortfall:e-t,options:[{key:"increase",label:`Increase ISA to £${Math.round(e).toLocaleString()}`,description:"Provide enough ISA for tax efficiency"},{key:"reduced",label:"Reduce salary to BRL",description:"Keep ISA to grow, accept lower income"},{key:"inefficient",label:"Accept tax-inefficient year",description:"Draw full SIPP, ISA stays untouched"}]}}async function JS(t){const e=vc(t),n=ga(e),r=e.getMonth()+1===4,s=Gy(e),o=await Et(),l=await qa(n),c=await Jn(),u=Object.keys(c).sort(),f=u.indexOf(n)-1,m=f>=0?c[u[f]]:null,p=await xu(n),w=(m==null?void 0:m.cpi)||.025,I=o.spendingProfile||"flat",S=Math.max(0,2e3+(parseInt(n.split("/")[0],10)||26)-2026),A=tv(S,I),C=m&&m.confirmedSalary||o.baseSalary,P=jS(C,w,A);return{taxYear:n,selectedMonth:t,isApril:r,remainingMonths:s,baseSalary:o.baseSalary,suggestionBase:C,spendingProfile:I,declineRate:A,suggestedSalary:P,defaults:{pa:(m==null?void 0:m.pa)||l.pa,brl:(m==null?void 0:m.brl)||l.brl,hrl:(m==null?void 0:m.hrl)||l.hrl,cpi:w,other:(m==null?void 0:m.other)||0},statePension:p,existingConfig:l.yearSetupComplete?l:null}}function Pg(t){const{targetSalary:e,brl:n,pa:i=12570,other:r=0,statePension:s=0,isaSavingsAllocation:o=0,remainingMonths:l,grossIncomeToDate:c=0,isTaxEfficient:u=!0}=t,f=x=>x<=i?0:x<=n?(x-i)*.2:(n-i)*.2+(x-n)*.4,m=r/12,p=s/12,w=m+p;let I,S;if(!u)I=e/12-w,S=0;else{const x=Math.max(0,n-c),v=Math.max(0,x/l-w);I=Math.min(e/12-w,v),S=o/l}const A=(I+w)*12,P=f(A)/12,L=I+w,N=L>0?P/L:0,z=I*N,U=m*N,T=p*N,y=I-z,_=m-U,b=p-T,E=y+_+b+S;return{sipp:{gross:I,tax:z,net:y},other:{gross:m,tax:U,net:_},statePension:{gross:p,tax:T,net:b},isa:{gross:S,tax:0,net:S},totalGross:I+m+p+S,totalTax:P,totalNet:E,mode:u?"tax-efficient":"tax-inefficient",monthlySipp:I,monthlyIsa:S,monthlyOther:m,monthlyStatePension:p,monthlyTotal:E}}function XS(t){var S,A,C,P,L,N,z,U,T,y,_;const{pa:e,brl:n,hrl:i,cpi:r,other:s,isaSavingsAllocation:o,isTaxEfficient:l,taxEfficiencyChoice:c,grossIncomeToDate:u,startMonth:f,confirmedSalary:m,remainingMonths:p,statePension:w,monthlyBreakdown:I}=t;return{pa:e,brl:n,hrl:i,cpi:r,other:s,isaSavingsAllocation:l?o:0,isaSavingsUsed:0,isTaxEfficient:l,taxEfficiencyChoice:c,grossIncomeToDate:u||0,startMonth:f||4,remainingMonths:p||12,yearSetupComplete:!0,confirmedSalary:m,statePension:w||0,expectedMonthly:I?{sipp:{gross:((S=I.sipp)==null?void 0:S.gross)||0,tax:((A=I.sipp)==null?void 0:A.tax)||0,net:((C=I.sipp)==null?void 0:C.net)||0},other:{gross:((P=I.other)==null?void 0:P.gross)||0,tax:((L=I.other)==null?void 0:L.tax)||0,net:((N=I.other)==null?void 0:N.net)||0},statePension:{gross:((z=I.statePension)==null?void 0:z.gross)||0,tax:((U=I.statePension)==null?void 0:U.tax)||0,net:((T=I.statePension)==null?void 0:T.net)||0},isa:{gross:((y=I.isa)==null?void 0:y.gross)||0,tax:0,net:((_=I.isa)==null?void 0:_.net)||0},totalGross:I.totalGross||0,totalTax:I.totalTax||0,totalNet:I.totalNet||0}:null}}let qi=null,Ls=null,$t=1,K=null,V={};async function ZS(t,e,n){qi=t,Ls=n,$t=1,V={},K=await JS(e),V={pa:K.defaults.pa,brl:K.defaults.brl,hrl:K.defaults.hrl,cpi:K.defaults.cpi,other:K.defaults.other,grossIncomeToDate:0,confirmedSalary:K.suggestedSalary,isaSavingsAllocation:0,isTaxEfficient:!0,taxEfficiencyChoice:null},bs()}async function ex(t){return await YS(t)}function bs(){if(!qi||!K)return;const t=K.isApril?6:7;qi.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Tax Year ${K.taxYear} Setup</div>
        <div class="wizard-subtitle">
          ${K.isApril?"Setting up for the full tax year":`Starting in ${Mu(K.selectedMonth)} - ${K.remainingMonths} months remaining`}
        </div>

        <div class="wizard-progress">
          ${ix(t,$t)}
        </div>

        ${tx()}
      </div>
    </div>
  `,rx()}function tx(){if(K.isApril,K.isApril)switch($t){case 1:return uf();case 2:return df();case 3:return hf();case 4:return ff();case 5:return pf();case 6:return mf();default:return""}else switch($t){case 1:return uf();case 2:return nx();case 3:return df();case 4:return hf();case 5:return ff();case 6:return pf();case 7:return mf();default:return""}}function uf(){return`
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
            <input type="number" id="wizPA" value="${V.pa}">
          </div>
        </div>
        <div class="wizard-grid-item">
          <label>Basic Rate Limit</label>
          <div class="wizard-input">
            <span class="wizard-unit">£</span>
            <input type="number" id="wizBRL" value="${V.brl}">
          </div>
        </div>
        <div class="wizard-grid-item">
          <label>Higher Rate Limit</label>
          <div class="wizard-input">
            <span class="wizard-unit">£</span>
            <input type="number" id="wizHRL" value="${V.hrl}">
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
  `}function nx(){const t=Mu(K.selectedMonth),e=lx(K.selectedMonth);return`
    <div class="wizard-step">
      <div class="wizard-step-title">Income Before Starting Pension</div>
      <div class="wizard-step-desc">
        You're starting your pension drawdown in ${t}. Enter any taxable income you've already received this tax year (April to ${e}).
      </div>

      <div class="wizard-input">
        <span class="wizard-unit">£</span>
        <input type="number" id="wizIncomeToDate" value="${V.grossIncomeToDate}" placeholder="0">
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
  `}function df(){const t=V.cpi!==void 0?V.cpi:K.defaults.cpi,e=(t*100).toFixed(1),n=K.suggestionBase??K.baseSalary,i=K.declineRate||0,r=Math.round(n*(1+t-i)),s=i>0,o=((t-i)*100).toFixed(1);return`
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
        ${s?`<p>Your plan uses <strong>declining spending</strong> (~${(i*100).toFixed(0)}%/yr real). Last year's salary rises with <span id="cpiDisplay">${e}</span>% CPI less that decline — a net <strong><span id="netUpliftDisplay">${o}</span>%</strong> — to:</p>`:`<p>Based on <span id="cpiDisplay">${e}</span>% inflation, your target salary should be:<span id="netUpliftDisplay" hidden>${o}</span></p>`}
        <p style="font-size: 24px; color: var(--primary); margin: 12px 0;">£<span id="suggestedSalaryDisplay">${r.toLocaleString()}</span></p>
        <p>per year (gross)</p>
      </div>

      <div class="wizard-step-desc" style="margin-top: 16px;">
        Confirm or adjust your target salary:
      </div>

      <div class="wizard-input">
        <span class="wizard-unit">£</span>
        <input type="number" id="wizSalary" value="${Math.round(V.confirmedSalary||r)}">
        <span class="wizard-unit">per year</span>
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="back">Back</button>
        <button class="wizard-btn primary" data-action="next">Next</button>
      </div>
    </div>
  `}function hf(){const t=K.statePension,e=t.isReceiving?`<span style="color: var(--success);">Receiving £${Math.round(t.amount).toLocaleString()}/year</span>`:`<span style="color: var(--text-muted);">${t.yearsUntil} years until state pension</span>`;return`
    <div class="wizard-step">
      <div class="wizard-step-title">Other Taxable Income</div>
      <div class="wizard-step-desc">
        Enter any other taxable income you'll receive this tax year (annual amount).
      </div>

      <div class="wizard-input">
        <span class="wizard-unit">£</span>
        <input type="number" id="wizOther" value="${V.other}">
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
  `}function ff(){lo();const t=KS({targetAnnualGross:V.confirmedSalary,brl:V.brl,pa:V.pa,other:V.other,statePension:K.statePension.amount,remainingMonths:K.remainingMonths,grossIncomeToDate:V.grossIncomeToDate});return V._isaCalc=t,t.brlExhausted?`
      <div class="wizard-step">
        <div class="wizard-step-title">BRL Already Exhausted</div>

        <div class="wizard-info-box" style="background: rgba(231, 76, 60, 0.2); border: 1px solid var(--danger);">
          <p style="color: var(--danger); font-weight: 500;">
            Your income to date (£${V.grossIncomeToDate.toLocaleString()}) has already exceeded the BRL (£${V.brl.toLocaleString()}).
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
            Your target salary of £${Math.round(V.confirmedSalary).toLocaleString()} is achievable within the BRL.
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
          £${Math.round(t.isaNeeded).toLocaleString()}
        </p>
        <p>from ISA/Savings</p>
        <p style="font-size: 12px; color: var(--text-muted); margin-top: 8px;">
          This keeps your SIPP draw at the BRL (£${V.brl.toLocaleString()}) while reaching your target salary.
        </p>
      </div>

      <div class="wizard-step-desc" style="margin-top: 16px;">
        How much ISA/Savings can you allocate this tax year?
      </div>

      <div class="wizard-input">
        <span class="wizard-unit">£</span>
        <input type="number" id="wizISA" value="${V.isaSavingsAllocation||Math.round(t.isaNeeded)}">
      </div>

      <div class="wizard-example">
        <strong>Tip:</strong> This is money you'll withdraw tax-free from ISA or savings to supplement your SIPP income.
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="back">Back</button>
        <button class="wizard-btn primary" data-action="next">Next</button>
      </div>
    </div>
  `}function pf(){lo();const t=V._isaCalc,e=QS(V.isaSavingsAllocation,(t==null?void 0:t.isaNeeded)||0,(t==null?void 0:t.brlExhausted)||!1);if(e.sufficient&&!e.isBrlExhausted)return V.isTaxEfficient=!0,V.taxEfficiencyChoice="efficient",setTimeout(()=>{$t++,bs()},0),`
      <div class="wizard-step">
        <div class="wizard-step-title">Setting Up Tax Efficiency...</div>
        <div class="wizard-info-box">
          <p>Your ISA allocation is sufficient for tax efficiency.</p>
        </div>
      </div>
    `;const n=e.shortfall>0?`You entered £${V.isaSavingsAllocation.toLocaleString()} but need £${Math.round(t.isaNeeded).toLocaleString()}.`:"";return`
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
            <input type="radio" name="taxChoice" value="increase" ${V.taxEfficiencyChoice==="increase"?"checked":""}>
            <div class="wizard-option-content">
              <strong>Increase ISA to £${Math.round(t.isaNeeded).toLocaleString()}</strong>
              <p>Provide enough ISA/Savings for tax efficiency</p>
            </div>
          </label>
        `}

        <label class="wizard-option">
          <input type="radio" name="taxChoice" value="reduced" ${V.taxEfficiencyChoice==="reduced"?"checked":""}>
          <div class="wizard-option-content">
            <strong>Reduce salary to BRL (£${V.brl.toLocaleString()})</strong>
            <p>Keep ISA/Savings to grow, accept lower income this year</p>
          </div>
        </label>

        <label class="wizard-option">
          <input type="radio" name="taxChoice" value="inefficient" ${V.taxEfficiencyChoice==="inefficient"?"checked":""}>
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
  `}function mf(){lo();const t=Pg({targetSalary:V.confirmedSalary,brl:V.brl,pa:V.pa,other:V.other,statePension:K.statePension.amount,isaSavingsAllocation:V.isaSavingsAllocation,remainingMonths:K.remainingMonths,grossIncomeToDate:V.grossIncomeToDate,isTaxEfficient:V.isTaxEfficient}),e=V.isTaxEfficient?"Tax-Efficient":"Tax-Inefficient",n=V.isTaxEfficient?"success":"warning",i=r=>`£${Math.round(r).toLocaleString()}`;return`
    <div class="wizard-step">
      <div class="wizard-step-title">Confirm Tax Year Setup</div>

      <div class="wizard-summary">
        <div class="wizard-summary-row">
          <span>Tax Year:</span>
          <span>${K.taxYear}</span>
        </div>
        <div class="wizard-summary-row">
          <span>Starting Month:</span>
          <span>${Mu(K.selectedMonth)}</span>
        </div>
        <div class="wizard-summary-row">
          <span>Remaining Months:</span>
          <span>${K.remainingMonths}</span>
        </div>
        ${V.grossIncomeToDate>0?`
          <div class="wizard-summary-row">
            <span>Income to Date:</span>
            <span>${i(V.grossIncomeToDate)}</span>
          </div>
        `:""}
        <div class="wizard-summary-row">
          <span>Target Salary:</span>
          <span>${i(V.confirmedSalary)}/year</span>
        </div>
        <div class="wizard-summary-row">
          <span>Tax Mode:</span>
          <span class="${n}">${e}</span>
        </div>
        <div class="wizard-summary-row">
          <span>ISA Allocation:</span>
          <span>${i(V.isaSavingsAllocation)}</span>
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
              <td style="padding: 4px 0; text-align: right;">${i(t.sipp.gross)}</td>
              <td style="padding: 4px 0; text-align: right; color: var(--danger);">-${i(t.sipp.tax)}</td>
              <td style="padding: 4px 0; text-align: right;">${i(t.sipp.net)}</td>
            </tr>
            ${t.other.gross>0?`
              <tr>
                <td style="padding: 4px 0;">Other</td>
                <td style="padding: 4px 0; text-align: right;">${i(t.other.gross)}</td>
                <td style="padding: 4px 0; text-align: right; color: var(--danger);">-${i(t.other.tax)}</td>
                <td style="padding: 4px 0; text-align: right;">${i(t.other.net)}</td>
              </tr>
            `:""}
            ${t.statePension.gross>0?`
              <tr>
                <td style="padding: 4px 0;">State Pension</td>
                <td style="padding: 4px 0; text-align: right;">${i(t.statePension.gross)}</td>
                <td style="padding: 4px 0; text-align: right; color: var(--danger);">-${i(t.statePension.tax)}</td>
                <td style="padding: 4px 0; text-align: right;">${i(t.statePension.net)}</td>
              </tr>
            `:""}
            ${t.isa.net>0?`
              <tr>
                <td style="padding: 4px 0;">ISA <span style="color: var(--success);">(tax-free)</span></td>
                <td style="padding: 4px 0; text-align: right;">${i(t.isa.gross)}</td>
                <td style="padding: 4px 0; text-align: right; color: var(--success);">£0</td>
                <td style="padding: 4px 0; text-align: right;">${i(t.isa.net)}</td>
              </tr>
            `:""}
          </tbody>
          <tfoot>
            <tr style="border-top: 1px solid var(--border); font-weight: bold;">
              <td style="padding: 8px 0;">Total</td>
              <td style="padding: 8px 0; text-align: right;">${i(t.totalGross)}</td>
              <td style="padding: 8px 0; text-align: right; color: var(--danger);">-${i(t.totalTax)}</td>
              <td style="padding: 8px 0; text-align: right; color: var(--success);">${i(t.totalNet)}</td>
            </tr>
          </tfoot>
        </table>
        <p style="margin-top: 12px; font-size: 14px; color: var(--text);">
          <strong>You'll receive ${i(t.totalNet)}/month</strong> in your bank
        </p>
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="back">Back</button>
        <button class="wizard-btn primary" data-action="finish">Confirm & Save</button>
      </div>
    </div>
  `}function ix(t,e){let n="";for(let i=1;i<=t;i++){const r=i<e?"done":i===e?"active":"";n+=`<div class="wizard-dot ${r}"></div>`}return n}function rx(){qi.querySelectorAll("[data-action]").forEach(e=>{e.addEventListener("click",()=>sx(e.dataset.action))}),window._updateWizardSalary=function(){const e=document.getElementById("wizCPI"),n=document.getElementById("wizSalary"),i=document.getElementById("cpiDisplay"),r=document.getElementById("suggestedSalaryDisplay");if(e&&n&&i&&r){const s=parseFloat(e.value)||0,o=s/100,l=K.suggestionBase??K.baseSalary,c=K.declineRate||0,u=Math.round(l*(1+o-c));i.textContent=s.toFixed(1),r.textContent=u.toLocaleString();const f=document.getElementById("netUpliftDisplay");f&&(f.textContent=((o-c)*100).toFixed(1)),n.value=u,V.cpi=o,V.confirmedSalary=u}}}function sx(t){lo();const e=K.isApril?6:7;switch(t){case"cancel":Mg(),Ls&&Ls({completed:!1,cancelled:!0});break;case"next":$t<e&&($t++,bs());break;case"back":$t>1&&($t--,bs());break;case"apply-choice":ox(),$t++,bs();break;case"finish":ax();break}}function ox(){var e;const t=(e=document.querySelector('input[name="taxChoice"]:checked'))==null?void 0:e.value;switch(V.taxEfficiencyChoice=t,t){case"increase":V.isaSavingsAllocation=V._isaCalc.isaNeeded,V.isTaxEfficient=!0;break;case"reduced":V.confirmedSalary=V.brl,V.isaSavingsAllocation=0,V.isTaxEfficient=!0;break;case"inefficient":V.isaSavingsAllocation=0,V.isTaxEfficient=!1;break}}function lo(){const t=document.getElementById("wizPA");t&&(V.pa=parseFloat(t.value)||12570);const e=document.getElementById("wizBRL");e&&(V.brl=parseFloat(e.value)||50270);const n=document.getElementById("wizHRL");n&&(V.hrl=parseFloat(n.value)||125140);const i=document.getElementById("wizCPI");i&&(V.cpi=(parseFloat(i.value)||4)/100);const r=document.getElementById("wizSalary");r&&(V.confirmedSalary=parseFloat(r.value)||3e4);const s=document.getElementById("wizOther");s&&(V.other=parseFloat(s.value)||0);const o=document.getElementById("wizISA");o&&(V.isaSavingsAllocation=parseFloat(o.value)||0);const l=document.getElementById("wizIncomeToDate");l&&(V.grossIncomeToDate=parseFloat(l.value)||0)}async function ax(){lo();const t=Pg({targetSalary:V.confirmedSalary,brl:V.brl,pa:V.pa,other:V.other,statePension:K.statePension.amount,isaSavingsAllocation:V.isaSavingsAllocation,remainingMonths:K.remainingMonths,grossIncomeToDate:V.grossIncomeToDate,isTaxEfficient:V.isTaxEfficient}),e=XS({pa:V.pa,brl:V.brl,hrl:V.hrl,cpi:V.cpi,other:V.other,isaSavingsAllocation:V.isaSavingsAllocation,isTaxEfficient:V.isTaxEfficient,taxEfficiencyChoice:V.taxEfficiencyChoice,grossIncomeToDate:V.grossIncomeToDate,startMonth:parseInt(K.selectedMonth.split("-")[1]),confirmedSalary:V.confirmedSalary,remainingMonths:K.remainingMonths,statePension:K.statePension.amount,monthlyBreakdown:t});console.log(`Tax Year Wizard: Saving config for ${K.taxYear}`,e);try{await nr(K.taxYear,e),console.log(`Tax Year Wizard: Successfully saved config for ${K.taxYear}`)}catch(n){console.error(`Tax Year Wizard: Failed to save config for ${K.taxYear}`,n),typeof window.showToast=="function"&&window.showToast(`Error saving tax year configuration: ${n.message}`,"error");return}Mg(),Ls&&Ls({completed:!0,taxYear:K.taxYear,config:e,wizardInputs:V})}function Mg(){qi&&(qi.innerHTML="",qi.style.display="none")}function Mu(t){const[e,n]=t.split("-").map(Number);return new Date(e,n-1,1).toLocaleString("default",{month:"long",year:"numeric"})}function lx(t){const[e,n]=t.split("-").map(Number);return new Date(e,n-2,1).toLocaleString("default",{month:"long"})}function cx(){return`
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
  `}function ux(t={},e=null){const n=ao(t,e),i=xg(n),r=kg(i);return{results:i,stats:r,config:n}}function dx(t={},e=null){const n=ao(t,e),i=Ag(n),r=kg(i);return{results:i,stats:r,config:n}}function hx(t={}){const e=ao(t),n={};for(const[i,r]of Object.entries(Uy))n[i]={...r,result:MS(e,r)};return n}function Du(t){const e={[me.SHARES]:0,[me.BONDS]:0,[me.DIVERSIFIERS]:0,[me.CASH]:0},n={},i=[],r=[];let s=0,o=0;for(const l of t){const c=+l.value||0,u=l.subClass||(l.ticker?Eg[l.ticker]:void 0),f=u?Ut[u]:null;if(!f){r.push({...l});continue}if(s+=c,i.push({...l,subClass:u,bucket:f.bucket,label:f.label}),(l.wrapper||"").toUpperCase()==="ISA"){o+=c;continue}e[f.bucket]+=c,n[u]=(n[u]||0)+c}return{buckets:e,subClassTotals:n,bondWeights:gf(n,me.BONDS),diversifierWeights:gf(n,me.DIVERSIFIERS),total:s,isaTotal:o,tagged:i,untagged:r}}function gf(t,e){const n=Object.entries(t).filter(([s])=>Ut[s].bucket===e),i=n.reduce((s,[,o])=>s+o,0);if(i<=0)return{};const r={};for(const[s,o]of n)r[s]=o/i;return r}function fx(t){const e=t.buckets[me.DIVERSIFIERS]||0,n={equityStart:t.buckets[me.SHARES]||0,bondStart:t.buckets[me.BONDS]||0,cashStart:t.buckets[me.CASH]||0,isaBalance:t.isaTotal||0};return e>0&&(n.diversifierStart=e,n.subAsset={}),Object.keys(t.bondWeights).length&&(n.subAsset=n.subAsset||{},n.subAsset.bondWeights=t.bondWeights),Object.keys(t.diversifierWeights).length&&(n.subAsset=n.subAsset||{},n.subAsset.diversifierWeights=t.diversifierWeights),n}const px="K5BLVvYKtzWTzqWqT5qUH7EqrwU2";let da=_g,yf=!1;function Dg(){return da}function Rr(t){const e=(t||"").toUpperCase().trim();return da.find(n=>n.ticker===e)||null}function Bg(){const t=tn();return!!t&&t.uid===px}async function mx(){if(!(yf||!Be()||!Ue)){yf=!0;try{const[t,e]=await Promise.all([Jl(Ei(Ue,"admin","fundCatalogue")),Jl(Ei(Ue,"admin","typicalAmounts"))]);if(t.exists()){const n=t.data().funds;Array.isArray(n)&&n.length&&n.every(i=>i.ticker&&i.subClass)&&(da=Object.freeze([...n].sort((i,r)=>i.ticker.localeCompare(r.ticker))),console.log("AdminConfig: fund catalogue override active ("+da.length+" funds)"))}if(e.exists()){const n=e.data().tiers;n&&typeof n=="object"&&(RI(n),console.log("AdminConfig: typical-amounts override active"))}}catch(t){console.warn("AdminConfig: using code defaults ("+t.message+")")}}}function gx({ticker:t,name:e,subClass:n}){try{const i=tn();if(!i||!Be()||!Ue||!t)return;Wm(ru(Ue,"fundSuggestions"),{ticker:String(t).toUpperCase().trim().slice(0,12),name:String(e||"").slice(0,80),subClass:String(n||"").slice(0,40),uid:i.uid,createdAt:pI()}).catch(()=>{})}catch{}}async function yx(t=100){return Bg()?(await Hm(iI(ru(Ue,"fundSuggestions"),rI("createdAt","desc"),sI(t)))).docs.map(n=>({id:n.id,...n.data()})):[]}function Lg(t){return ga(vc(t))}function vx(t){const[e,n]=t.split("-").map(Number);return Math.max(0,(n>=4?e:e-1)-2026)}async function bx(t,e,n,i,r){var Gr,Ri,Yr,ti;const s=r.settings,o=r.history,l=r.allTaxYears,c=Lg(t),u=vx(t),[f,m]=t.split("-").map(Number);if(!l[c])throw new Error(`Tax year ${c} is not configured. Please add it in the Settings tab before calculating.`);const p=l[c],w=p.pa||12570,I=p.brl||50270,S=p.hrl||125140,A=p.other||0,C=p.isTaxEfficient!==!1,P=p.isaSavingsAllocation||0,L=p.grossIncomeToDate||0,N=p.confirmedSalary||s.baseSalary,z=o.find(X=>X.date===t),U=(z==null?void 0:z.isa)||0,T=Math.max(0,(p.isaSavingsUsed||0)-U),_=r.spInfo.amount||0;let b=1;for(let X=0;X<u;X++){const ue=String((26+X)%100).padStart(2,"0")+"/"+String((27+X)%100).padStart(2,"0"),qe=(l[ue]||{}).cpi||Yy;b*=1+qe}let E=On(s.equityMin,u,s.duration,b,!0),x=On(s.bondMin,u,s.duration,b,!0);const v=Math.round(On(s.cashTarget,u,s.duration,b,!1)),le=ya(s.equityGlide,u,s.duration);if(le!=null){const X=E+x;E=X*le,x=X*(1-le)}E=Math.round(E),x=Math.round(x);const pe=e+n,H=E+x;let ee=0;const ne=o.filter(X=>X.date<t);for(let X=ne.length-1;X>=0&&ne[X].source==="Cash";X--)ee++;const te=bg({totalGrowth:pe,minGrowth:H,consecCashDraws:ee,wasInProtection:ne.length>0&&ne[ne.length-1].inProtection,consecutiveLimit:s.consecutiveLimit||3,recoveryBuffer:s.recoveryBuffer||1e4}),Ne=m>=4?16-m:4-m,Pe=Math.max(1,Ne),ve=N*b,O=A+_;Nn(ve,w,I,S);let Z,_e,se,ce=0,xe=0,Xn=!1,ft=0;const nn=Math.max(0,P-T)/Pe;if(C){const X=O/12;o.filter(Ve=>Ve.taxYear===c&&Ve.date<t);const ue=ve/12,qe=r.isaBalance||0;let We,yt;if(qe>0){const Ve=bc({targetGross:ve,fixedIncome:O,pa:w,brl:I,hrl:S,isaBalance:qe,strategy:s.isaDrawdownStrategy||"minimiseEarlyTax",yearsUntilSp:0});We=Ve.sippGross/12,yt=Ve.isaDraw/12}else{if(((Ri=(Gr=p.expectedMonthly)==null?void 0:Gr.sipp)==null?void 0:Ri.gross)>0)We=p.expectedMonthly.sipp.gross;else{const Ae=Math.max(0,I-L-O)/12;We=Math.min(ue-X,Ae)}const Ve=Nn(ve,w,I,S)/12,jt=Math.min(ve,I),be=Nn(jt,w,I,S)/12,je=Math.max(0,Ve-be);yt=Math.min(je,nn)}if(ft=yt,ce=We,te){const Ve=(s.protectionFactor||20)/100;Z=We*(1-Ve),_e=yt,se="Protection"}else{Z=We,_e=yt,se="Tax-Efficient";const Ve=m>=4?f:f-1,jt=ne.filter(Ae=>{const[ni,Pi]=Ae.date.split("-").map(Number);return(Pi>=4?ni:ni-1)===Ve});let be=0,je=0;jt.forEach(Ae=>{je+=Ae.sipp||0,Ae.inProtection&&Ae.stdSipp&&(be+=Ae.stdSipp-Ae.sipp),Ae.boostAmount>0&&(be-=Ae.boostAmount)});const vt=je+Z*Pe+O;xe=wg({shortfall:be,standardMonthly:We,remainingMonths:Pe,surplus:pe-H-ua.SURPLUS_BUFFER,brlHeadroom:I-vt}),xe>50&&(Z+=xe,se="Tax Boost")}}else{const X=ve/12,ue=O/12;let qe;if(((ti=(Yr=p.expectedMonthly)==null?void 0:Yr.sipp)==null?void 0:ti.gross)>0?qe=p.expectedMonthly.sipp.gross:qe=Math.max(0,X-ue),ce=qe,_e=0,te){const We=(s.protectionFactor||20)/100;Z=qe*(1-We),se="Protection";const yt=m>=4?f:f-1,Ve=ne.filter(je=>{const[vt,Ae]=je.date.split("-").map(Number);return(Ae>=4?vt:vt-1)===yt});let jt=0;Ve.forEach(je=>{jt+=je.sipp||0});const be=jt+Z*Pe+O;if(be<I){const vt=(I-be)/Pe,Ae=pe-H-(s.recoveryBuffer||1e4);Ae>0&&vt>50&&(xe=Math.min(vt,Ae/Pe),xe>50&&(Z+=xe,Xn=!0,se="Protection-Induced Efficiency"))}}else{Z=qe,se="Tax-Inefficient";const We=m>=4?f:f-1,yt=ne.filter(be=>{const[je,vt]=be.date.split("-").map(Number);return(vt>=4?je:je-1)===We});let Ve=0,jt=0;if(yt.forEach(be=>{jt+=be.sipp||0,be.inProtection&&be.stdSipp&&(Ve+=be.stdSipp-be.sipp),be.boostAmount>0&&(Ve-=be.boostAmount)}),Ve>0){const be=jt+Z*Pe+O,je=I-be,vt=pe-H-(s.recoveryBuffer||1e4);if(je>0&&vt>0){const Ae=je/Pe,ni=Ve/Pe,Pi=vt/Pe;xe=Math.min(ni,Ae,Pi),xe>50&&(Z+=xe,se="Tax Boost")}}}}const Ot=r.diversifier||0;let tt,mt,_n=0,En=0,rn=0,Tn=0,Wt="";if(!te&&pe>=H+Z){tt="Growth";const X=Math.max(0,e-E),ue=Math.max(0,n-x),qe=X+ue;qe>0?(_n=Z*X/qe,En=Z*ue/qe,mt="Healthy"):(tt="Cash",rn=Z,mt="At min")}else if(tt="Cash",mt=te?"Protection":"Below min",Ot>0){rn=Math.min(i,Z);let X=Z-rn;X>0&&(Tn=Math.min(Ot,X),X-=Tn,tt=rn>0?"Cash + Diversifier":"Diversifier"),X>0&&(Wt="Cash low!")}else rn=Z,i<Z&&(Wt="Cash low!");let Tt="";const Zn=e-E,sn=n-x;if(Zn>5e3&&sn<-5e3){const X=Math.floor(Math.min(Zn,-sn)/1e3)*1e3;X>=5e3&&(Tt=`Move £${X.toLocaleString()} Equity→Bond`)}else if(sn>5e3&&Zn<-5e3){const X=Math.floor(Math.min(sn,-Zn)/1e3)*1e3;X>=5e3&&(Tt=`Move £${X.toLocaleString()} Bond→Equity`)}let Gt="";const In=v-i;if(In>5e3&&tt==="Growth"&&!te){const X=pe-H-Z;if(X>1e4){const ue=Math.floor(Math.min(In*.3,X*.5)/1e3)*1e3;ue>=5e3&&(Gt=`Replenish Cash: Move £${ue.toLocaleString()} from growth funds`)}}const Ee=[];Wt&&Ee.push({message:Wt,severity:"danger",type:"low-cash"}),xe>50&&Ee.push({message:`Tax Boost: +£${Math.round(xe).toLocaleString()}/mo catch-up from protection shortfall`,severity:"success",type:"tax-boost"}),Tt&&Ee.push({message:Tt,severity:"warning",type:"rebalance"}),Gt&&Ee.push({message:Gt,severity:"info",type:"cash-replenish"});const fe=m>=4?f:f-1,on=ne.filter(X=>{const[ue,qe]=X.date.split("-").map(Number);return(qe>=4?ue:ue-1)===fe}),an=on.reduce((X,ue)=>X+(ue.sipp||0),0),ei=on.length+1,Sn=Math.max(0,12-ei)*ce,ln=an+Z+Sn+A+_,nt=xl(ln,w,I,S),It=nt/12,Pt=Z+A/12+_/12-It+_e,Ft=It*ei,Yt=nt,gt=ve/12,Wr=xl(gt*12,w,I,S),Ci=Math.max(0,Wr/12-nt/12),An=T+ft;return{date:t,taxYear:c,yearNumber:u,remainingMonths:Pe,equity:e,bond:n,cash:i,isa:0,adjEquityMin:E,adjBondMin:x,adjCashTarget:v,pa:w,brl:I,other:A/12,statePension:_/12,sippDraw:Z,stdSipp:ce,isaDraw:_e,totalMonthlyNet:Pt,isTaxEfficientYear:C,yearlyIsaSavingsAllocation:P,cumulativeIsaSavingsUsed:An,isaSavingsUsedThisMonth:ft,taxPaidYTD:Ft,taxProjectedAnnual:Yt,taxSavedMonthly:Ci,taxSavedYTD:Ci*ei,taxSavedProjectedAnnual:Ci*12,taxEfficient:C&&!Xn,inProtection:te,protectionReason:te?mt:null,consecutiveCashDraws:ee,protectionInducedTaxEfficiency:Xn,boostAmount:xe>50?xe:0,boostEligible:xe>50,source:tt,drawFromEquity:_n,drawFromBond:En,drawFromCash:rn,...Ot>0?{drawFromDiversifier:Tn,diversifier:Ot}:{},rebalanceNeeded:Tt!=="",rebalanceActions:Tt?[Tt]:[],alerts:Ee,calculationDetails:{mode:se,reason:`${mt} | ${se}`,totalGrowth:pe,minGrowth:H,consec:ee,stdSipp:Z,inputs:{baseSalary:s.baseSalary,confirmedSalary:N,targetGross:ve,cumInf:b,yearNum:u,taxYear:c,OTHER:A,STATE:_,PA:w,BRL:I,isTaxEfficientYear:C,yearlyIsaSavingsAllocation:P,grossIncomeToDate:L},taxInfo:{annualTaxable:ln,headroomToBRL:I-ln,annualTax:nt,monthlyNet:Pt}}}}let Ns=null;function wx(t,e){Ns=t,_x(e)}function _x({onGetStarted:t,onSignIn:e}){Ns&&(Ns.innerHTML=`
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
  `,document.getElementById("landingGetStarted").addEventListener("click",t),document.getElementById("landingSignIn").addEventListener("click",e))}function Os(){Ns&&(Ns.style.display="none")}function Ex(){return`
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
  `}let Ze=null,ws=null,di=!1;function Tx(t,e){console.log("initAuthScreen: initializing"),Ze=t,ws=e,di=!1,jm(n=>{if(console.log("AuthScreen: auth state change received:",n?n.email:"null","processed:",di),n&&!n.emailVerified){Cx(n);return}n&&ws&&!di?(console.log("AuthScreen: calling onAuthSuccessCallback"),di=!0,Ng(),ws(n)):n?console.log("AuthScreen: skipping callback, already processed or no callback"):(di=!1,console.log("AuthScreen: user signed out, reset authProcessed"))}),Bu(),console.log("initAuthScreen: complete")}function Bu(){if(Ze){if(!Be()){Ze.innerHTML=`
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
    `;return}Ze.innerHTML=`
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
  `,Ix()}}function Ix(){const t=Ze.querySelectorAll(".auth-screen-tab");t.forEach(s=>{s.addEventListener("click",()=>{t.forEach(c=>c.classList.remove("active")),s.classList.add("active");const o=document.getElementById("signinForm"),l=document.getElementById("signupForm");s.dataset.tab==="signin"?(o.style.display="block",l.style.display="none"):(o.style.display="none",l.style.display="block"),Xi()})}),document.getElementById("signinForm").addEventListener("submit",Sx),document.getElementById("signupForm").addEventListener("submit",xx),document.getElementById("forgotPasswordBtn").addEventListener("click",Ax),document.getElementById("googleSigninBtn").addEventListener("click",kx)}function Zt(t){const e=document.getElementById("authScreenError");e&&(e.textContent=t,e.style.display="block")}function Xi(){const t=document.getElementById("authScreenError");t&&(t.style.display="none")}async function Sx(t){t.preventDefault(),Xi();const e=document.getElementById("signinEmail").value.trim(),n=document.getElementById("signinPassword").value;if(!e||!n){Zt("Please enter email and password");return}try{await wI(e,n)}catch(i){console.error("Sign in error:",i),Zt(Ya(i.code))}}async function xx(t){t.preventDefault(),Xi();const e=document.getElementById("signupName").value.trim(),n=document.getElementById("signupEmail").value.trim(),i=document.getElementById("signupPassword").value;if(!e||!n||!i){Zt("Please fill in all fields");return}if(i.length<6){Zt("Password must be at least 6 characters");return}try{await yI(n,i,e)}catch(r){console.error("Sign up error:",r),Zt(Ya(r.code))}}async function Ax(){Xi();const t=document.getElementById("signinEmail").value.trim();if(!t){Zt("Please enter your email address first");return}try{await EI(t),typeof window.showToast=="function"&&window.showToast("Password reset email sent. Check your inbox.","success",5e3)}catch(e){console.error("Reset password error:",e),Zt(Ya(e.code))}}async function kx(){Xi();try{await _I()}catch(t){console.error("Google sign in error:",t),Zt(Ya(t.code))}}function Ya(t){return{"auth/invalid-email":"Invalid email address","auth/user-disabled":"This account has been disabled","auth/user-not-found":"No account found with this email","auth/wrong-password":"Incorrect password","auth/email-already-in-use":"An account already exists with this email","auth/weak-password":"Password is too weak","auth/operation-not-allowed":"Sign in method not enabled","auth/popup-closed-by-user":"Sign in cancelled","auth/popup-blocked":"Sign in popup was blocked","auth/too-many-requests":"Too many attempts. Please try again later.","auth/invalid-credential":"Invalid email or password"}[t]||"An error occurred. Please try again."}function Cx(t){Ze&&(Ze.style.display="block",Ze.innerHTML=`
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
  `,document.getElementById("verifiedContinueBtn").addEventListener("click",async()=>{Xi();try{const e=await bI();e&&e.emailVerified?ws&&!di&&(di=!0,Ng(),ws(e)):Zt("Not verified yet. Click the link in the email first (check spam), then try again.")}catch(e){console.error("Verification check error:",e),Zt("Could not check verification status. Please try again.")}}),document.getElementById("resendVerificationBtn").addEventListener("click",async()=>{Xi();try{await vI(),typeof window.showToast=="function"&&window.showToast("Verification email sent. Check your inbox.","success",5e3)}catch(e){console.error("Resend verification error:",e),Zt(e.code==="auth/too-many-requests"?"Too many attempts. Please wait a few minutes and try again.":"Could not send the email. Please try again.")}}),document.getElementById("verifySignOutBtn").addEventListener("click",async()=>{try{await wu(),Bu()}catch(e){console.error("Sign out error:",e)}}))}function Ng(){Ze&&(Ze.innerHTML=`
      <div class="auth-screen">
        <div class="auth-screen-box" style="text-align: center;">
          <div class="auth-screen-header">
            <h1>Pension Planner</h1>
            <p>Signing in...</p>
          </div>
        </div>
      </div>
    `)}function Og(){console.log("hideAuthScreen: hiding auth screen, element=",!!Ze),Ze&&(Ze.style.display="none",console.log("hideAuthScreen: set display to none"))}function Rx(){di=!1,Ze&&(Ze.style.display="block",Bu())}function Fs(t="signin"){Rx(),Ze.querySelectorAll(".auth-screen-tab").forEach(s=>s.classList.remove("active"));const n=Ze.querySelector(`.auth-screen-tab[data-tab="${t}"]`);n&&n.classList.add("active");const i=document.getElementById("signinForm"),r=document.getElementById("signupForm");i&&r&&(i.style.display=t==="signin"?"block":"none",r.style.display=t==="signup"?"block":"none")}function Px(){return`
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
  `}let Vs=null;function Fg(t,e,n,i={}){Vs=t,Mx(e,n,i)}function Mx(t,e,n={}){if(!Vs)return;const i=t||"there",r=n.title||`Welcome, ${i}!`,s=n.subtitle||"Your account is set up and ready to go. Here's what Pension Planner can do for you.",o=n.ctaLabel||"Set Up Your First Plan";Vs.innerHTML=`
    <div class="onboarding-page">
      <div class="onboarding-content">

        <div class="onboarding-welcome">
          <h1>${r}</h1>
          <p>${s}</p>
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
  `,document.getElementById("onboardingStartWizard").addEventListener("click",e),n.onSkip&&document.getElementById("onboardingSkip").addEventListener("click",n.onSkip)}function $r(){Vs&&(Vs.style.display="none")}function Dx(){return`
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
  `}let Yn=null,ha=null,tc=null,D={scenarioName:"My plan",scenarioDescription:"",enabledTools:["stress","decision"],household:"single",currentAge:"",retirementAge:"",retired:!1,partnerAge:"",partnerRetirementAge:"",partnerRetired:!1,startAt:"budget",introDone:!1,baseSalary:3e4,otherIncome:0,spStartDate:"",spWeeklyAmount:0,equityMin:25e4,bondMin:2e5,cashTarget:5e4,isaBalance:0,duration:35,taxMode:"inflates",decisionSalary:3e4,decisionEquity:25e4,decisionBond:2e5,decisionCash:5e4,decisionIsaBalance:0,decisionDuration:35},bt="scenario",ke=1;function Vg(){bt="scenario",ke=1,D={scenarioName:"My plan",scenarioDescription:"",enabledTools:["stress","decision"],household:"single",currentAge:"",retirementAge:"",retired:!1,partnerAge:"",partnerRetirementAge:"",partnerRetired:!1,startAt:"budget",introDone:!1,baseSalary:3e4,otherIncome:0,spStartDate:"",spWeeklyAmount:0,equityMin:25e4,bondMin:2e5,cashTarget:5e4,isaBalance:0,duration:35,taxMode:"inflates",decisionSalary:3e4,decisionEquity:25e4,decisionBond:2e5,decisionCash:5e4,decisionIsaBalance:0,decisionDuration:35}}function zg(t,e,n=null){Yn=t,ha=e,tc=n,Vg(),Vt()}function Vt(){Yn&&(bt==="scenario"?Bx():bt==="stress"?Ox():bt==="decision"&&Vx())}function Bx(){Yn.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Welcome to Pension Planner</div>
        <div class="wizard-subtitle">Let's create your first plan</div>

        <div class="wizard-progress">
          ${Lu(2,ke)}
        </div>

        ${ke===1?Lx():Nx()}
      </div>
    </div>
  `,Nu()}function Lx(){const t=D.household==="couple";return`
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
            <input type="radio" name="wizHousehold" value="single" ${t?"":"checked"} onchange="document.getElementById('wizPartnerBlock').style.display='none'"> Just me
          </label>
          <label class="wizard-tool-option" style="flex:0 0 auto; padding:8px 14px; cursor:pointer;">
            <input type="radio" name="wizHousehold" value="couple" ${t?"checked":""} onchange="document.getElementById('wizPartnerBlock').style.display='block'"> Me and a partner
          </label>
        </div>
      </div>

      ${vf("You","wiz",D.currentAge,D.retirementAge,D.retired)}
      <div id="wizPartnerBlock" style="display:${t?"block":"none"};">
        ${vf("Your partner","wizPartner",D.partnerAge,D.partnerRetirementAge,D.partnerRetired)}
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
  `}function vf(t,e,n,i,r){const s=r?"Age you retired":"Target retirement age",o=e+"CurrentAge",l=e+"RetireAge",c=e+"Retired";return`
    <div style="border:1px solid var(--border); border-radius:10px; padding:12px 14px; margin-bottom:12px;">
      <strong style="font-size:14px;">${t}</strong>
      <div style="display:flex; gap:14px; flex-wrap:wrap; align-items:flex-end; margin-top:8px;">
        <div class="wizard-input" style="flex:0 0 auto;">
          <label style="display:block; font-size:13px; margin-bottom:4px;">Age today</label>
          <input type="number" id="${o}" value="${n||""}" placeholder="e.g. 52" style="max-width:110px;">
        </div>
        <div class="wizard-input" style="flex:0 0 auto;">
          <label id="${l}Label" style="display:block; font-size:13px; margin-bottom:4px;">${s}</label>
          <input type="number" id="${l}" value="${i||""}" placeholder="e.g. 60" style="max-width:150px;">
        </div>
        <label style="flex:0 0 auto; display:flex; align-items:center; gap:6px; font-size:13px; padding-bottom:8px; cursor:pointer;">
          <input type="checkbox" id="${c}" ${r?"checked":""} style="width:auto;"
            onchange="document.getElementById('${l}Label').textContent = this.checked ? 'Age you retired' : 'Target retirement age'">
          Already retired
        </label>
      </div>
    </div>
  `}function Nx(){return`
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
  `}function Ox(){Yn.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Stress Tester Setup</div>
        <div class="wizard-subtitle">Let's set up your pension simulation in a few simple steps.</div>

        <div class="wizard-progress">
          ${Lu(6,ke)}
        </div>

        ${Fx(ke)}
      </div>
    </div>
  `,Nu()}function Fx(t){switch(t){case 1:return`
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
      `;default:return""}}function Vx(){Yn.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Decision Tool Setup</div>
        <div class="wizard-subtitle">Now let's set up the tool you'll use each month once you're retired.</div>

        <div class="wizard-progress">
          ${Lu(4,ke)}
        </div>

        ${zx(ke)}
      </div>
    </div>
  `,Nu()}function zx(t){switch(t){case 1:return`
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
      `;default:return""}}function Lu(t,e){let n="";for(let i=1;i<=t;i++){const r=i<e?"done":i===e?"active":"";n+=`<div class="wizard-dot ${r}"></div>`}return n}function Nu(){if(Yn.querySelectorAll("[data-action]").forEach(e=>{e.addEventListener("click",()=>$x(e.dataset.action))}),document.getElementById("wizRisks")&&typeof window.writeAlloc=="function"){window.writeAlloc("wiz",D.equityMin,D.bondMin,D.cashTarget);const e=document.getElementById("wizEquityGlide");e&&(e.checked=!!D.equityGlideEnabled,window.updateAllocDisplay("wiz"))}if(document.getElementById("wizDRisks")&&typeof window.writeAlloc=="function"){window.writeAlloc("wizD",D.decisionEquity,D.decisionBond,D.decisionCash);const e=document.getElementById("wizDEquityGlide");e&&(e.checked=!!D.decisionEquityGlideEnabled,window.updateAllocDisplay("wizD"))}}function $x(t){switch($g(),t){case"skip-all":if(tc){tc();break}D.startAt="budget",Vi();break;case"to-router":{const e=parseInt(D.currentAge),n=parseInt(D.retirementAge),i=r=>{typeof window.showToast=="function"&&window.showToast(r,"error")};if(!n||n<40||n>95){i(D.retired?"Please enter the age you retired":"Please enter a target retirement age");return}if(e&&n>e&&D.retired){i("You ticked 'already retired' but the age is in the future — untick it, or lower the age.");return}if(e&&n<e&&!D.retired){i("That retirement age is in the past — tick 'already retired' if you've already retired.");return}ke=2,Vt();break}case"start-budget":case"start-stress":case"start-decision":D.startAt=t.replace("start-",""),Vi();break;case"next":{const e=Ga(D.spStartDate);if(!e.valid){typeof window.showToast=="function"&&window.showToast(e.error,"error");return}bt==="scenario"?ke<2&&(ke++,Vt()):bt==="stress"?ke<6&&(ke++,Vt()):bt==="decision"&&ke<4&&(ke++,Vt());break}case"back":(bt==="scenario"&&ke>1||bt==="stress"&&ke>1||bt==="decision"&&ke>1)&&(ke--,Vt());break;case"start-tools":if(!D.enabledTools||D.enabledTools.length===0){typeof window.showToast=="function"&&window.showToast("Please select at least one tool","error");return}Sl("scenario");break;case"skip-stress":Sl("stress");break;case"finish-stress":D.decisionSalary=D.baseSalary,D.decisionEquity=D.equityMin,D.decisionBond=D.bondMin,D.decisionCash=D.cashTarget,D.decisionIsaBalance=D.isaBalance,D.decisionDuration=D.duration,D.decisionEquityGlideEnabled=D.equityGlideEnabled,Sl("stress");break;case"skip-decision":Vi();break;case"finish":Vi();break}}function Sl(t){const e=D.enabledTools.includes("stress"),n=D.enabledTools.includes("decision");t==="scenario"?e?(bt="stress",ke=1,Vt()):n?(bt="decision",ke=1,Vt()):Vi():t==="stress"&&n?(bt="decision",ke=1,Vt()):Vi()}function $g(){const t=document.getElementById("wizScenarioName");t&&(D.scenarioName=t.value.trim()||"My Plan");const e=document.getElementById("wizScenarioDesc");e&&(D.scenarioDescription=e.value.trim()||"");const n=document.querySelector('input[name="wizHousehold"]:checked');n&&(D.household=n.value);const i=document.getElementById("wizCurrentAge");i&&(D.currentAge=parseInt(i.value)||"");const r=document.getElementById("wizRetireAge");r&&(D.retirementAge=parseInt(r.value)||"");const s=document.getElementById("wizRetired");s&&(D.retired=s.checked);const o=document.getElementById("wizPartnerCurrentAge");o&&(D.partnerAge=parseInt(o.value)||"");const l=document.getElementById("wizPartnerRetireAge");l&&(D.partnerRetirementAge=parseInt(l.value)||"");const c=document.getElementById("wizPartnerRetired");c&&(D.partnerRetired=c.checked);const u=document.getElementById("wizToolStress"),f=document.getElementById("wizToolDecision");if(u!==null||f!==null){const T=[];u&&u.checked&&T.push("stress"),f&&f.checked&&T.push("decision"),D.enabledTools=T}const m=document.getElementById("wizBaseSalary");m&&(D.baseSalary=parseFloat(m.value)||3e4);const p=document.getElementById("wizOther");p&&(D.otherIncome=parseFloat(p.value)||0);const w=document.getElementById("wizSpStartDate");w&&(D.spStartDate=w.value.trim()||"");const I=document.getElementById("wizSpWeeklyAmount");if(I&&(D.spWeeklyAmount=parseFloat(I.value)||0),document.getElementById("wizPot")&&typeof window.readAlloc=="function"){const T=window.readAlloc("wiz");D.equityMin=T.equityMin,D.bondMin=T.bondMin,D.cashTarget=T.cashTarget}const S=document.getElementById("wizEquityGlide");S&&(D.equityGlideEnabled=S.checked);const A=document.getElementById("wizIsaBalance");A&&(D.isaBalance=parseFloat(A.value)||0);const C=document.getElementById("wizDuration");C&&(D.duration=parseInt(C.value)||35);const P=document.getElementById("wizTaxMode");P&&(D.taxMode=P.value);const L=document.getElementById("wizDBaseSalary");if(L&&(D.decisionSalary=parseFloat(L.value)||3e4),document.getElementById("wizDPot")&&typeof window.readAlloc=="function"){const T=window.readAlloc("wizD");D.decisionEquity=T.equityMin,D.decisionBond=T.bondMin,D.decisionCash=T.cashTarget}const N=document.getElementById("wizDEquityGlide");N&&(D.decisionEquityGlideEnabled=N.checked);const z=document.getElementById("wizDIsaBalance");z&&(D.decisionIsaBalance=parseFloat(z.value)||0);const U=document.getElementById("wizDDuration");U&&(D.decisionDuration=parseInt(U.value)||35)}function Vi(){$g(),ha&&ha(D)}function Ur(){Yn&&(Yn.style.display="none")}function Ux(t,e,n,i){if(Yn=t,ha=n,Vg(),D.enabledTools=e,i&&(e.includes("stress")&&i.source==="decision"&&(D.baseSalary=i.baseSalary||3e4,D.equityMin=i.equityMin||25e4,D.bondMin=i.bondMin||2e5,D.cashTarget=i.cashTarget||5e4,D.isaBalance=i.isaBalance||0,D.duration=i.duration||35,D.spStartDate=i.spStartDate||"",D.spWeeklyAmount=i.spWeeklyAmount||0),e.includes("decision")&&i.source==="stress"&&(D.decisionSalary=i.baseSalary||3e4,D.decisionEquity=i.equityMin||25e4,D.decisionBond=i.bondMin||2e5,D.decisionCash=i.cashTarget||5e4,D.decisionIsaBalance=i.isaBalance||0,D.decisionDuration=i.duration||35)),e.includes("stress"))bt="stress";else if(e.includes("decision"))bt="decision";else{n&&n(D);return}ke=1,Vt()}function qx(){return`
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
  `}function Hx(){const e=getComputedStyle(document.documentElement).getPropertyValue("--bg").trim()==="#0d1117"||document.documentElement.classList.contains("dark")||window.matchMedia("(prefers-color-scheme: dark)").matches;return{primary:"#f0c674",success:"#2ea043",warning:"#e1b12c",danger:"#f85149",muted:"#8b8b9b",grid:"rgba(255,255,255,0.1)",bg:e?"rgba(15,15,26,1)":"#ffffff",text:e?"#c9d1d9":"#1f2937",cardBg:e?"#21262d":"#ffffff",cone:"rgba(240,198,116,0.15)",coneMid:"rgba(240,198,116,0.2)",coneInner:"rgba(240,198,116,0.35)",coneBorder:"rgba(240,198,116,0.4)",trajectory:"rgba(46,160,67,0.25)",trajectoryFailed:"rgba(248,81,73,0.8)",trajectoryHover:"#5fdd7b",trajectoryFailedHover:"#ff6b6b",glidepath:"#7eb8da",zeroLine:"#f85149"}}function Wx(t,e,n={}){const i=Hx(),r=t.getContext("2d"),{width:s,height:o}=t,l={top:50,right:180,bottom:60,left:80},c=s-l.left-l.right,u=o-l.top-l.bottom;r.fillStyle=i.bg,r.fillRect(0,0,s,o);const f=Object.keys(e),m=n.years||35;let p=0;f.forEach(A=>{const C=e[A].result;C&&C.hist&&C.hist.forEach(P=>{P.total>p&&(p=P.total)})}),p*=1.1;const w=A=>l.left+A/m*c,I=A=>l.top+u-A/p*u;Gx(r,l,c,u,m,p,n.title||"Scenario Comparison",i);const S=["#6366f1","#22c55e","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#ec4899","#84cc16"];f.forEach((A,C)=>{const P=e[A].result;if(!P||!P.hist)return;r.beginPath(),r.strokeStyle=S[C%S.length],r.lineWidth=2.5,P.hist.forEach((N,z)=>{const U=w(N.year),T=I(N.total);z===0?r.moveTo(U,T):r.lineTo(U,T)}),r.stroke();const L=l.top+15+C*24;r.fillStyle=S[C%S.length],r.fillRect(s-l.right+15,L,20,4),r.font="11px system-ui, sans-serif",r.fillStyle=i.text,r.textAlign="left",r.fillText(e[A].name||A,s-l.right+40,L+5),P.final/1e3,r.fillStyle=i.muted,r.fillText(`${Ug(P.final)}`,s-l.right+40,L+18)})}function Gx(t,e,n,i,r,s,o,l){t.font="bold 14px system-ui, sans-serif",t.fillStyle=l.text,t.textAlign="center",t.fillText(o,e.left+n/2,e.top-20),t.strokeStyle=l.grid,t.lineWidth=1;for(let c=0;c<=5;c++){const u=e.top+i*c/5;t.beginPath(),t.moveTo(e.left,u),t.lineTo(e.left+n,u),t.stroke();const f=s*(5-c)/5;t.font="11px system-ui, sans-serif",t.fillStyle=l.muted,t.textAlign="right",t.fillText(Ug(f),e.left-10,u+4)}for(let c=0;c<=r;c+=5){const u=e.left+c/r*n;t.beginPath(),t.moveTo(u,e.top),t.lineTo(u,e.top+i),t.stroke(),t.textAlign="center",t.fillText(`Y${c}`,u,e.top+i+20)}t.font="12px system-ui, sans-serif",t.textAlign="center",t.fillText("Years",e.left+n/2,e.top+i+45),t.save(),t.translate(20,e.top+i/2),t.rotate(-Math.PI/2),t.fillText("Fund Value",0,0),t.restore()}function Ug(t){return t>=1e6?`£${(t/1e6).toFixed(1)}M`:t>=1e3?`£${(t/1e3).toFixed(0)}k`:`£${t.toFixed(0)}`}function Yx(){return`
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
  `}window._simEngine={runMonteCarlo:xg,runHistorical:Ag,simulate:Cr,monteCarloReturns:ku};window._constants={EQUITY_RETURNS:Wi,INFLATION:ma};window._mathUtils={seededRng:wc};let qg=null,Hg=null;function Wg(){qg=null,Hg=null;const t=document.getElementById("mcResults"),e=document.getElementById("histResults");t&&(t.innerHTML=""),e&&(e.innerHTML="");const n=document.getElementById("optimiseResultsMC"),i=document.getElementById("optimiseResultsHist");n&&(n.innerHTML=""),i&&(i.innerHTML="")}function Gg(){document.querySelectorAll(".sub-tab[data-stresstab]").forEach(n=>n.classList.remove("active"));const t=document.querySelector('.sub-tab[data-stresstab="montecarlo"]');t&&t.classList.add("active"),document.querySelectorAll(".stress-subtab").forEach(n=>n.classList.add("hidden"));const e=document.getElementById("stress-montecarlo");e&&e.classList.remove("hidden")}function Yg(){document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(n=>n.classList.remove("active"));const t=document.querySelector('.sub-tab[data-decisiontab="entry"]');t&&t.classList.add("active"),document.querySelectorAll(".decision-subtab").forEach(n=>n.classList.add("hidden"));const e=document.getElementById("decision-entry");e&&e.classList.remove("hidden")}const jg=document.createElement("style");jg.textContent=GS()+Ex()+Px()+Dx()+qx()+cx()+Yx();document.head.appendChild(jg);const Ou=document.getElementById("globalLoadingOverlay"),jx=Ou.querySelector(".loading-text");function At(t="Loading..."){jx.textContent=t,Ou.classList.add("active")}function kt(){Ou.classList.remove("active")}window.showToast=function(e,n="info",i=3e3){const r=document.querySelector(".toast-notification");r&&r.remove();const s=document.createElement("div");s.className=`toast-notification ${n}`,s.innerHTML=`
        <span class="toast-icon">${n==="success"?"✓":n==="error"?"!":"ℹ"}</span>
        <span class="toast-message">${e}</span>
      `,document.body.appendChild(s),requestAnimationFrame(()=>s.classList.add("show")),setTimeout(()=>{s.classList.remove("show"),setTimeout(()=>s.remove(),300)},i)};document.getElementById("versionDisplay").textContent=`v${If}`;document.getElementById("entryMonth").value=Wy();function nc(t){const e=document.getElementById(t+"SpWeeklyAmount"),n=document.getElementById(t+"SpAnnualAmount");if(!e||!n)return;const i=parseFloat(e.value)||0;n.value=i>0?Math.round(i*52):"",n._updateOverlay&&n._updateOverlay()}["ds","ss"].forEach(t=>{const e=document.getElementById(t+"SpWeeklyAmount"),n=document.getElementById(t+"SpAnnualAmount");e&&n&&(e.addEventListener("input",()=>{const i=parseFloat(e.value)||0;n.value=i>0?Math.round(i*52):"",n._updateOverlay&&n._updateOverlay()}),n.addEventListener("input",()=>{const i=parseFloat(n.value)||0;e.value=i>0?+(i/52).toFixed(2):"",e._updateOverlay&&e._updateOverlay()}))});function Fu(t){const e=parseFloat(t);return isNaN(e)?"":e.toString().replace(/\B(?=(\d{3})+(?!\d))/g," ")}function Kg(){document.querySelectorAll('input[type="number"]').forEach(e=>{e.value,e.addEventListener("focus",function(n){setTimeout(()=>{this.select()},0)}),e.addEventListener("click",function(n){!n.shiftKey&&!n.ctrlKey&&!n.metaKey&&this.select()})})}function Qg(){document.querySelectorAll('input[type="number"]').forEach(e=>{if(e.dataset.formatted||e.closest("#budget-content")||e.closest("#budWizardOverlay"))return;e.dataset.formatted="true";let n=e.closest(".input-with-unit");const i=!!n;n||(n=document.createElement("span"),n.className="num-format-wrap",n.style.cssText="position:relative; display:block;",e.parentNode.insertBefore(n,e),n.appendChild(e));const r=document.createElement("span");r.className="number-format-overlay";const s=i?"34px":"14px";r.style.cssText=`
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
        `,getComputedStyle(n).position==="static"&&(n.style.position="relative");function o(){const l=parseFloat(e.value);!isNaN(l)&&l>=1e3&&document.activeElement!==e?(r.textContent=Fu(l),r.style.display="block",e.style.color="transparent"):(r.style.display="none",e.style.color="")}e._updateOverlay=o,e.addEventListener("focus",()=>{r.style.display="none",e.style.color=""}),e.addEventListener("blur",o),e.addEventListener("input",()=>{document.activeElement===e&&(r.style.display="none",e.style.color="")}),n.appendChild(r),o()})}function ja(){document.querySelectorAll('input[type="number"]').forEach(t=>{t._updateOverlay&&t._updateOverlay()})}setTimeout(()=>{Kg(),Qg()},100);const Kx=new MutationObserver(t=>{let e=!1;t.forEach(n=>{n.addedNodes.forEach(i=>{var r,s;i.nodeType===1&&((r=i.matches)!=null&&r.call(i,'input[type="number"]')||(s=i.querySelector)!=null&&s.call(i,'input[type="number"]'))&&(e=!0)})}),e&&setTimeout(()=>{Kg(),Qg()},50)});Kx.observe(document.body,{childList:!0,subtree:!0});let hr=null;async function Vu(t,e=null){Os(),Og(),$r(),Ur(),document.getElementById("mainApp").classList.remove("hidden"),mx().then(()=>{ac("ss",!0),ac("ds",!0);const o=document.getElementById("budAdminSection");o&&(o.style.display=Bg()?"block":"none")}),document.getElementById("userEmail").textContent=t.email,await vr();const n=await pg();zu(n),await gn(),await Zi(),rc(),Gg(),Yg(),Wg();const i=e||(n.includes("decision")?"decision":"stress");document.querySelectorAll(".tab").forEach(o=>o.classList.remove("active"));const r=document.querySelector(`.tab[data-tab="${i}"]`);r&&r.classList.add("active"),document.querySelectorAll(".tab-content").forEach(o=>o.classList.remove("active"));const s=document.getElementById(`${i}-content`);s&&s.classList.add("active")}function zu(t){const e={decision:["decision"],stress:["stress"]};document.querySelectorAll(".tab").forEach(i=>{const r=i.dataset.tab;let s=!1;for(const[o,l]of Object.entries(e))if(l.includes(r)){s=t.includes(o);break}Object.values(e).flat().includes(r)||(s=!0),i.style.display=s?"":"none"})}window.openToolSettingsTab=function(t){const e=t==="decision"?'.sub-tab[data-decisiontab="decisionsettings"]':'.sub-tab[data-stresstab="stresssettings"]',n=document.querySelector(e);n&&n.click()};async function ic(t){try{const e=i=>!!i.baseSalary&&+i.baseSalary!=3e4;if(t==="decision"){const i=await Et();return!!i.configured||e(i)||await uo()}const n=await Nt();return!!n.configured||e(n)}catch{return!0}}async function $u(){const t=document.getElementById("dsSetupBanner"),e=document.getElementById("ssSetupBanner");t&&(t.style.display=await ic("decision")?"none":"block"),e&&(e.style.display=await ic("stress")?"none":"block")}async function rc(){try{const t=await Nt(),e=await Et();$u(),document.getElementById("entryEquity").value="",document.getElementById("entryBond").value="",document.getElementById("entryCash").value="",document.getElementById("entryIsa").value="",document.getElementById("dsDuration").value=e.duration||35,writeAlloc("ds",e.equityMin??25e4,e.bondMin??2e5,e.cashTarget??5e4,e.diversifierStart||0),restoreCustomAllocFromSettings("ds",e),window._taggedFunds.ds=(e.taggedFunds||[]).map(i=>({...i})),setAllocMode("ds",e.allocMode||(e.taggedFunds&&e.taggedFunds.length?"funds":"risk")),updateEntryTagPrompt(),document.getElementById("dsEquityGlide").checked=e.equityGlideEnabled||!1,updateAllocDisplay("ds"),document.getElementById("dsBaseSalary").value=e.baseSalary||3e4,syncNetFromGross("ds"),document.getElementById("dsIsaBalance").value=e.isaBalance||0,document.getElementById("dsSpendingProfile").value=e.spendingProfile||"flat",document.getElementById("dsSpStartDate").value=e.spStartDate||"",document.getElementById("dsSpWeeklyAmount").value=e.spWeeklyAmount||"",nc("ds"),document.getElementById("dsProtectionFactor").value=e.protectionFactor||20,document.getElementById("dsRecoveryBuffer").value=e.recoveryBuffer||1e4,document.getElementById("dsConsecutiveLimit").value=e.consecutiveLimit||3,qu(t),document.getElementById("ssBaseSalary").value=t.baseSalary,syncNetFromGross("ss"),writeAlloc("ss",t.equityMin,t.bondMin,t.cashTarget,t.diversifierStart||0),restoreCustomAllocFromSettings("ss",t),window._taggedFunds.ss=(t.taggedFunds||[]).map(i=>({...i})),setAllocMode("ss",t.allocMode||(t.taggedFunds&&t.taggedFunds.length?"funds":"risk")),document.getElementById("ssDuration").value=t.duration,document.getElementById("ssPA").value=t.pa,document.getElementById("ssBRL").value=t.brl,document.getElementById("ssHRL").value=t.hrl,document.getElementById("ssTaxMode").value=t.taxMode||"inflates",document.getElementById("ssOther").value=t.other||0,document.getElementById("ssSpStartDate").value=t.spStartDate||"",document.getElementById("ssSpWeeklyAmount").value=t.spWeeklyAmount||"",nc("ss"),document.getElementById("ssConsecutiveLimit").value=t.consecutiveLimit||3,document.getElementById("ssProtectionMult").value=t.protectionMult||.8,document.getElementById("ssDisableProtection").checked=t.disableProtection||!1,document.getElementById("ssHodlEnabled").checked=t.hodlEnabled||!1,document.getElementById("ssHodlValue").value=t.hodlValue||25e3,document.getElementById("ssSpendingProfile").value=t.spendingProfile||"flat",document.getElementById("ssEquityGlide").checked=t.equityGlideEnabled||!1,updateAllocDisplay("ss"),document.getElementById("ssIsaBalance").value=t.isaBalance||0;const n=document.getElementById("ssSeedNote");n&&(n.textContent=t.seededFrom==="decision"&&t.seededAt?"Seeded from Decision Tool "+new Date(t.seededAt).toLocaleDateString():""),ja(),console.log("All inputs initialized from stored settings")}catch(t){console.error("Error initializing inputs from settings:",t)}}async function Jg(t){console.log("Wizard completed with data:",t);const e=parseInt(t.retirementAge)||60,n=parseInt(t.currentAge)||e,i=95,r=Math.max(5,i-Math.max(n,e));try{const c={duration:r},u={duration:r};await LI(t.scenarioName||"My plan","",["stress","decision"],{stressSettings:c,decisionSettings:u},!0),Ti(),Gn();try{const f=await Ru();f.currentAge=parseInt(t.currentAge)||f.currentAge,f.retirementAge=e,f.endAge=i,f.retired=!!t.retired,f.sharedWithPartner=t.household==="couple",t.household==="couple"&&(f.partnerAge=parseInt(t.partnerAge)||null,f.partnerRetirementAge=parseInt(t.partnerRetirementAge)||null,f.partnerRetired=!!t.partnerRetired),await Pu(f)}catch(f){console.warn("Could not seed budget from wizard:",f)}}catch(c){console.error("Error creating scenario from wizard:",c)}const s=tn(),o=t.startAt||"budget";o==="budget"&&(window._budWizAutoOpen=!0),await Vu(s);const l=document.querySelector('.tab[data-tab="'+o+'"]');l&&l.click(),(o==="decision"||o==="stress")&&!await ic(o)&&(openToolSettingsTab(o),showToast("First, set up this plan: your pot, spending need and State Pension.","info",6e3))}async function Xg(){if(Ur(),await Zm()){document.getElementById("mainApp").classList.remove("hidden");const e=document.getElementById("scenarioDropdown");e&&e.classList.add("open"),showToast("Plan creation cancelled — you’re back on your current plan.","info",3500)}else fa(tn())}function fa(t){Os(),Og();const e=t.displayName||t.email.split("@")[0];document.getElementById("onboardingPage").style.display="block",Fg(document.getElementById("onboardingPage"),e,()=>{$r(),document.getElementById("setupWizard").style.display="block",zg(document.getElementById("setupWizard"),Jg,Xg)})}Tx(document.getElementById("authScreen"),async t=>{console.log("Auth success callback triggered for:",t.email);try{console.log("Checking for existing cloud data...");const e=await Zm();console.log("Has cloud data:",e),e?(console.log("Existing user - showing main app"),Os(),Vu(t)):(console.log("New user - showing onboarding page"),fa(t))}catch(e){console.error("Error in auth callback:",e),fa(t)}});wx(document.getElementById("landingPage"),{onGetStarted:()=>{Os(),Fs("signup")},onSignIn:()=>{Os(),Fs("signin")}});document.getElementById("logoutBtn").addEventListener("click",async()=>{try{Ti(),Gn(),vn(),await wu(),document.getElementById("mainApp").classList.add("hidden"),$r(),Ur(),Fs("signin")}catch(t){console.error("Logout error:",t)}});async function sc(){const t=document.getElementById("planLockChip");if(!t)return;const e=await uo();t.style.display="inline-block",t.textContent=e?"🔒 locked":"✏️ draft",t.title=e?"This plan’s settings are committed so your recorded entries stay consistent. Click for details.":"This plan’s settings are still editable. Saving the Decision settings commits (locks) the plan. Click for details.",t.style.cursor="pointer",t.onclick=n=>{n.stopPropagation(),explainPlanLock(e)}}window.explainPlanLock=function(t){let e=document.getElementById("planLockExplainer");e&&e.remove(),e=document.createElement("div"),e.id="planLockExplainer",e.style.cssText="position:fixed; inset:0; z-index:1300; background:rgba(0,0,0,0.55); display:flex; align-items:center; justify-content:center; padding:20px;",e.innerHTML=`<div style="background:var(--card); border:1px solid var(--border); border-radius:14px; max-width:560px; width:100%; padding:26px; font-size:15px; line-height:1.6;"><h2 style="margin-bottom:12px;">Plans — and why they lock 🔒</h2><p style="margin-bottom:10px; color:var(--text-muted);">A <strong style="color:var(--text);">plan</strong> is a named scenario: its settings (pots, spending target, State Pension, rules) plus everything you record against them — monthly decisions and tax years. You can keep several plans and switch or duplicate them from this dropdown.</p><p style="margin-bottom:10px; color:var(--text-muted);">When you save a plan’s Decision settings, the plan <strong style="color:var(--text);">locks</strong>: the settings freeze so your recorded history stays meaningful — a decision saved under one set of rules shouldn’t be silently re-judged under another.</p><ul style="margin:0 0 12px 18px; color:var(--text-muted);"><li><strong style="color:var(--text);">✏️ draft</strong> — settings still editable; nothing committed yet.</li><li><strong style="color:var(--text);">🔒 locked, nothing recorded</strong> — you can unlock and edit freely.</li><li><strong style="color:var(--text);">🔒 locked with history</strong> — settings can’t change; duplicate into a new plan instead.</li></ul><p style="margin-bottom:16px; color:var(--text-muted);">The Budget and the Stress Tester are never locked — the budget autosaves like a document, and Stress is a sandbox for what-ifs.</p><div style="display:flex; gap:10px; flex-wrap:wrap;"><button type="button" onclick="document.getElementById('planLockExplainer').remove()">Got it</button>`+(t?`<button type="button" class="risk-btn" onclick="document.getElementById('planLockExplainer').remove(); document.querySelector('.tab[data-tab=&quot;decision&quot;]').click(); openToolSettingsTab('decision');">View the locked settings</button>`:"")+"</div></div>",e.addEventListener("click",n=>{n.target===e&&e.remove()}),document.body.appendChild(e)};async function vr(){var r;const t=await Iu(),e=t.find(s=>s.isActive),n=document.getElementById("scenarioActiveName");n&&(n.textContent=e&&(((r=e.planDetails)==null?void 0:r.name)||e.name)||"No Plan"),await sc();const i=document.getElementById("scenarioList");if(i){if(t.length===0){i.innerHTML='<div class="scenario-dropdown-item" style="color:var(--text-muted);cursor:default;">No plans yet</div>';return}i.innerHTML=t.map(s=>{var c,u;const o=((c=s.planDetails)==null?void 0:c.name)||s.name||"Unnamed Plan",l=((u=s.planDetails)==null?void 0:u.description)||s.description||"";return`
        <div class="scenario-dropdown-item ${s.isActive?"active":""}" data-scenario-id="${s.id}">
          <div>
            <div class="scenario-item-name">${o}</div>
            ${l?`<div class="scenario-item-desc">${l}</div>`:""}
          </div>
          <div class="scenario-item-actions">
            ${s.isActive?`<button class="scenario-tools-btn" data-id="${s.id}" data-tools="${(s.enabledTools||["stress","decision"]).join(",")}" title="Edit Tools">&#9881;</button>`:""}
            <button class="scenario-rename-btn" data-id="${s.id}" data-name="${o}" title="Rename">&#9998;</button>
            ${t.length>1?`<button class="scenario-delete-btn" data-id="${s.id}" data-name="${o}" title="Delete">&times;</button>`:""}
          </div>
        </div>
      `}).join(""),i.querySelectorAll(".scenario-dropdown-item").forEach(s=>{s.addEventListener("click",async o=>{if(o.target.closest(".scenario-item-actions"))return;const l=s.dataset.scenarioId;if(!l)return;const c=t.find(u=>u.isActive);if(c&&c.id===l){document.getElementById("scenarioDropdown").classList.remove("open");return}try{await NI(l),Ti(),Gn(),document.getElementById("scenarioDropdown").classList.remove("open"),Wg(),Gg(),Yg();const u=await pg();zu(u);const f=document.querySelector(".tab.active");if(f&&f.style.display==="none"){const m=document.querySelector('.tab:not([style*="display: none"])');if(m){document.querySelectorAll(".tab").forEach(I=>I.classList.remove("active")),m.classList.add("active"),document.querySelectorAll(".tab-content").forEach(I=>I.classList.remove("active"));const p=m.dataset.tab+"-content",w=document.getElementById(p);w&&w.classList.add("active")}}await gn(),await Zi(),await rc(),await vr()}catch(u){console.error("Error switching scenario:",u),showToast("Failed to switch plan: "+u.message,"error")}})}),i.querySelectorAll(".scenario-rename-btn").forEach(s=>{s.addEventListener("click",async o=>{o.stopPropagation();const l=s.dataset.id,c=s.dataset.name,u=prompt("Rename plan:",c);if(u&&u.trim()&&u.trim()!==c)try{await FI(l,u.trim()),await vr()}catch(f){console.error("Error renaming scenario:",f),showToast("Failed to rename plan: "+f.message,"error")}})}),i.querySelectorAll(".scenario-tools-btn").forEach(s=>{s.addEventListener("click",async o=>{o.stopPropagation();const l=s.dataset.id,c=(s.dataset.tools||"stress,decision").split(",");document.getElementById("scenarioDropdown").classList.remove("open"),Qx(l,c)})}),i.querySelectorAll(".scenario-delete-btn").forEach(s=>{s.addEventListener("click",async o=>{o.stopPropagation();const l=s.dataset.id,c=s.dataset.name;if(confirm(`Delete plan "${c}"? This cannot be undone.`))try{await zI(l),Ti(),Gn(),await gn(),await Zi(),await rc(),await vr()}catch(u){console.error("Error deleting scenario:",u),showToast("Failed to delete plan: "+u.message,"error")}})})}}document.getElementById("scenarioActiveBtn").addEventListener("click",t=>{t.stopPropagation(),document.getElementById("scenarioDropdown").classList.toggle("open")});document.addEventListener("click",t=>{const e=document.getElementById("scenarioSelector");e&&!e.contains(t.target)&&document.getElementById("scenarioDropdown").classList.remove("open")});document.getElementById("scenarioNewBtn").addEventListener("click",async()=>{document.getElementById("scenarioDropdown").classList.remove("open"),document.getElementById("mainApp").classList.add("hidden");const t=()=>{$r(),document.getElementById("setupWizard").style.display="block",zg(document.getElementById("setupWizard"),Jg,Xg)},e=tn(),n=e&&(e.displayName||(e.email||"").split("@")[0])||"there",i=document.getElementById("onboardingPage");i.style.display="block",Fg(i,n,t,{title:"A new plan — here’s the flow",subtitle:"A quick refresher on how the pieces fit together before you set it up.",ctaLabel:"Set up the new plan",onSkip:t})});document.getElementById("scenarioDuplicateBtn").addEventListener("click",async()=>{var i;document.getElementById("scenarioDropdown").classList.remove("open");const t=await Lt();if(!t){showToast("No active plan to duplicate.","error");return}const e=((i=t.planDetails)==null?void 0:i.name)||t.name||"My Plan",n=prompt("Name for the copy:",e+" (copy)");if(!(!n||!n.trim()))try{await OI(t.id,n.trim()),await vr()}catch(r){console.error("Error duplicating scenario:",r),showToast("Failed to duplicate plan: "+r.message,"error")}});function Qx(t,e){const n=document.getElementById("editToolsModal");n&&n.remove();const i=e.includes("stress"),r=e.includes("decision"),s=document.createElement("div");s.id="editToolsModal",s.className="edit-tools-overlay",s.innerHTML=`
        <div class="edit-tools-box">
          <div class="edit-tools-title">Edit Enabled Tools</div>
          <div class="edit-tools-desc">Choose which tools this plan should include. You can change this any time.</div>

          <div class="wizard-tool-choices">
            <label class="wizard-tool-option">
              <input type="checkbox" id="editToolStress" ${i?"checked":""}>
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
      `,document.body.appendChild(s),document.getElementById("editToolsCancel").addEventListener("click",()=>s.remove()),s.addEventListener("click",o=>{o.target===s&&s.remove()}),document.getElementById("editToolsSave").addEventListener("click",async()=>{const o=[];if(document.getElementById("editToolStress").checked&&o.push("stress"),document.getElementById("editToolDecision").checked&&o.push("decision"),o.length===0){showToast("Please select at least one tool","error");return}const l=o.filter(c=>!e.includes(c));try{await VI(t,o);const c=await Lt();if(c&&c.id===t){zu(o);const u=document.querySelector(".tab.active");if(u&&u.style.display==="none"){const f=document.querySelector('.tab:not([style*="display: none"])');if(f){document.querySelectorAll(".tab").forEach(w=>w.classList.remove("active")),f.classList.add("active"),document.querySelectorAll(".tab-content").forEach(w=>w.classList.remove("active"));const m=f.dataset.tab+"-content",p=document.getElementById(m);p&&p.classList.add("active")}}}if(await vr(),s.remove(),l.length>0){let u=null;try{if(l.includes("stress")&&e.includes("decision")){const p=await Et();p&&(u={source:"decision",...p})}else if(l.includes("decision")&&e.includes("stress")){const p=await Nt();p&&(u={source:"stress",...p})}}catch(p){console.warn("Could not load existing settings for pre-fill:",p)}const f=document.getElementById("setupWizard");f.style.display="block",document.getElementById("mainApp").style.display="none",Ux(f,l,async p=>{Ur();try{l.includes("stress")&&(await oo({equityMin:p.equityMin,bondMin:p.bondMin,cashTarget:p.cashTarget,isaBalance:p.isaBalance||0,duration:p.duration,baseSalary:p.baseSalary,other:p.otherIncome||0,taxMode:p.taxMode||"inflates",equityGlideEnabled:p.equityGlideEnabled||!1}),Gn()),l.includes("decision")&&(await so({equityMin:p.decisionEquity,bondMin:p.decisionBond,cashTarget:p.decisionCash,isaBalance:p.decisionIsaBalance||0,duration:p.decisionDuration,baseSalary:p.decisionSalary,spStartDate:p.spStartDate||null,spWeeklyAmount:p.spWeeklyAmount||0,equityGlideEnabled:p.decisionEquityGlideEnabled||!1}),Ti())}catch(w){console.error("Error saving new tool settings:",w)}await Vu(),showToast("New tool configured successfully","success")},u)}else showToast("Tools updated","success")}catch(c){console.error("Error updating scenario tools:",c),showToast("Failed to update tools: "+c.message,"error")}})}const oc=60*60*1e3,Zg="pt_lastActivity";let Ho=null,bf=0;function ey(){const t=Date.now();if(t-bf>1e4){bf=t;try{localStorage.setItem(Zg,String(t))}catch{}}}function Jx(){try{return+localStorage.getItem(Zg)||0}catch{return 0}}async function ty(){if(!dt())return;const t=Date.now()-Jx();if(t<oc){Ho=setTimeout(ty,Math.max(6e4,oc-t));return}showToast("You have been logged out due to inactivity (1 hour).","info",5e3);try{Ti(),Gn(),vn(),await wu(),document.getElementById("mainApp").classList.add("hidden"),$r(),Ur(),Fs("signin")}catch(e){console.error("Auto-logout error:",e)}}function ny(){Ho&&clearTimeout(Ho),dt()&&(Ho=setTimeout(ty,oc))}const Xx=["mousedown","mousemove","keydown","scroll","touchstart","click"];Xx.forEach(t=>{document.addEventListener(t,()=>{ey(),ny()},{passive:!0})});ey();ny();jm(t=>{const e=!document.getElementById("mainApp").classList.contains("hidden");!t&&e&&(document.getElementById("mainApp").classList.add("hidden"),$r(),Ur(),Fs("signin"),showToast("You’ve been signed out — sign in again to continue. Unsaved changes in open forms were not stored.","warning",8e3))});document.getElementById("resetBtn").addEventListener("click",async()=>{if(!(!confirm(`⚠️ WARNING: This will permanently delete ALL your data including:

• All saved settings
• All decision history
• All tax year configurations

This action cannot be undone.

Are you sure you want to reset and start over?`)||!confirm(`Are you ABSOLUTELY sure?

Type OK to confirm deletion of all your data.`)))try{console.log("Wiping all user data..."),await Xm(),console.log("Data wiped successfully"),Ti(),Gn(),vn(),localStorage.clear(),document.getElementById("mainApp").classList.add("hidden");const n=tn();fa(n),showToast("All data has been deleted. Set up a new plan to start fresh.","success",4e3)}catch(n){console.error("Reset error:",n),showToast("Error resetting data: "+n.message,"error")}});document.getElementById("deleteAccountBtn").addEventListener("click",async()=>{if(!(!confirm(`⚠️ DELETE YOUR ACCOUNT?

This permanently deletes your login AND all saved data:

• All plans and settings
• All portfolio/decision history
• Your household budget

This cannot be undone.`)||!confirm(`FINAL WARNING

Your account and every piece of data will be gone forever.

Delete everything?`)))try{await Xm(),Ti(),Gn(),vn(),localStorage.clear(),await TI(),showToast("Your account and all data have been deleted.","success",4e3),setTimeout(()=>window.location.reload(),1500)}catch(n){console.error("Delete account error:",n),n.code==="auth/requires-recent-login"?showToast("For security, please sign out, sign back in, and press Delete Account again.","error",8e3):showToast("Error deleting account: "+n.message,"error")}});document.querySelectorAll(".tab").forEach(t=>{t.addEventListener("click",async()=>{if(t.dataset.tab!=="stress"){Zx();const e=document.getElementById("optimiseResultsMC"),n=document.getElementById("optimiseResultsHist");e&&(e.innerHTML=""),n&&(n.innerHTML="")}document.querySelectorAll(".tab").forEach(e=>e.classList.remove("active")),t.classList.add("active"),document.querySelectorAll(".tab-content").forEach(e=>e.classList.remove("active")),document.getElementById(`${t.dataset.tab}-content`).classList.add("active"),t.dataset.tab==="stress"&&await Qa(),t.dataset.tab==="budget"&&await wA()})});const rs=document.querySelector(".tabs"),wf=document.querySelector(".tabs-wrapper");if(rs&&wf){const t=()=>{const e=rs.scrollLeft+rs.clientWidth>=rs.scrollWidth-10;wf.classList.toggle("scrolled-end",e)};rs.addEventListener("scroll",t),t()}document.querySelectorAll(".sub-tab[data-stresstab]").forEach(t=>{t.addEventListener("click",async()=>{document.querySelectorAll(".sub-tab[data-stresstab]").forEach(e=>e.classList.remove("active")),t.classList.add("active"),document.querySelectorAll(".stress-subtab").forEach(e=>e.classList.add("hidden")),document.getElementById(`stress-${t.dataset.stresstab}`).classList.remove("hidden"),t.dataset.stresstab==="stresssettings"&&await Qa()})});document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(t=>{t.addEventListener("click",async()=>{document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(e=>e.classList.remove("active")),t.classList.add("active"),document.querySelectorAll(".decision-subtab").forEach(e=>e.classList.add("hidden")),document.getElementById(`decision-${t.dataset.decisiontab}`).classList.remove("hidden"),t.dataset.decisiontab==="decisionsettings"&&await Gu(),t.dataset.decisiontab==="history"&&await gn(),t.dataset.decisiontab==="taxyears"&&await Zi()})});async function _f(t,e,n,i){var o,l;const r=await Et(),s=r.equityGlideEnabled?{...r,equityGlide:Af(r)}:r;return bx(t,e,n,i,{settings:s,history:await ir(),allTaxYears:await Jn(),spInfo:await xu(Lg(t)),isaBalance:parseFloat((o=document.getElementById("entryIsa"))==null?void 0:o.value)||0,diversifier:parseFloat((l=document.getElementById("entryDiversifier"))==null?void 0:l.value)||0})}function Uu(t,e,n){if(t<1e4&&e<1e4&&n<1e4&&t+e+n>0){const r=s=>"£"+Math.round(s||0).toLocaleString();return confirm(`These fund values look low — Equity ${r(t)}, Bond ${r(e)}, Cash ${r(n)}.

Enter absolute amounts in pounds, to the single pound (e.g. 250000, not 250).

Continue anyway?`)}return!0}window.handleDecisionSubmit=async function(t){t.preventDefault();const e=document.getElementById("entryMonth").value,n=parseFloat(document.getElementById("entryEquity").value)||0,i=parseFloat(document.getElementById("entryBond").value)||0,r=parseFloat(document.getElementById("entryCash").value)||0,s=[];if(e||s.push("Month"),!n&&n!==0&&s.push("Equity Fund"),!i&&i!==0&&s.push("Bond Balance"),!r&&r!==0&&s.push("Cash Balance"),s.length>0){showToast("Missing: "+s.join(", "),"error",4e3);return}if(!Uu(n,i,r))return;if((await ir({limit:1e3})).find(c=>c.date===e)){showToast(`${Pr(e)} already has a saved decision. Delete it from the History tab first to recalculate.`,"error",5e3);return}try{if((await ex(e)).showWizard){const f=document.getElementById("taxYearWizard");f.style.display="block",window._pendingDecisionForm={dateStr:e,equity:n,bond:i,cash:r},ZS(f,e,async m=>{if(f.style.display="none",m&&m.completed)try{hr=await _f(e,n,i,r);const p=document.getElementById("decisionOutput");cf(hr,p),document.getElementById("saveBtn").disabled=!1}catch(p){console.error("Decision error after wizard:",p),showToast("Error: "+p.message,"error")}});return}hr=await _f(e,n,i,r);const u=document.getElementById("decisionOutput");cf(hr,u),document.getElementById("saveBtn").disabled=!1}catch(c){console.error("Decision error:",c),showToast("Error: "+c.message,"error")}};window.saveCurrentDecision=async function(){const t=document.getElementById("saveBtn");if(!hr){showToast("No decision to save","error");return}if(!dt()){showToast("Please sign in to save decisions","error");return}t.classList.add("loading"),t.disabled=!0;try{await eS(hr),showToast("Decision saved to history","success"),await gn()}catch(e){console.error("Save error:",e),showToast("Error saving: "+e.message,"error"),t.disabled=!1}finally{t.classList.remove("loading")}};function qu(t){const e=r=>"£"+Math.round(r||0).toLocaleString(),n=(t.diversifierStart||0)>0?` · Diversifiers ${e(t.diversifierStart)}`:"",i=`Starting balances come from your <strong>Settings</strong> (Fund Minimums): Equity ${e(t.equityMin)} · Bond ${e(t.bondMin)}${n} · Cash ${e(t.cashTarget)}. Edit them in the Settings tab.`;["mcStartSummary","histStartSummary","scenStartSummary"].forEach(r=>{const s=document.getElementById(r);s&&(s.innerHTML=i)}),["mcYears","histYears"].forEach(r=>{const s=document.getElementById(r);s&&(s.value=t.duration)})}window.runMonteCarloUI=async function(){const t=await Nt(),e={years:parseInt(document.getElementById("mcYears").value)||t.duration},n=document.getElementById("optimiseResultsMC");n&&(n.innerHTML=""),document.getElementById("mcResults").innerHTML='<div class="loading"><div class="spinner"></div>Running simulation...</div>',setTimeout(()=>{try{const{results:i,stats:r}=ux(e);qg=i,sy(r,i,"Monte Carlo (1000 runs)","mcResults",e.years)}catch(i){console.error("Simulation error:",i),document.getElementById("mcResults").innerHTML=`<div class="alert alert-danger">Error: ${i.message}</div>`}},50)};window.runHistoricalUI=async function(){const t=await Nt(),e={years:parseInt(document.getElementById("histYears").value)||t.duration},n=document.getElementById("optimiseResultsHist");n&&(n.innerHTML=""),document.getElementById("histResults").innerHTML='<div class="loading"><div class="spinner"></div>Running simulation...</div>',setTimeout(()=>{try{const{results:i,stats:r}=dx(e);Hg=i,sy(r,i,"Historical Analysis","histResults",e.years)}catch(i){console.error("Simulation error:",i),document.getElementById("histResults").innerHTML=`<div class="alert alert-danger">Error: ${i.message}</div>`}},50)};window.runScenariosUI=async function(){await Nt();const t={};document.getElementById("scenResults").innerHTML='<div class="loading"><div class="spinner"></div>Running scenarios...</div>',setTimeout(()=>{try{const e=hx(t);lA(e,"scenResults")}catch(e){console.error("Scenario error:",e),document.getElementById("scenResults").innerHTML=`<div class="alert alert-danger">Error: ${e.message}</div>`}},50)};let ai=!1,ds=0;function Zx(){ds++}window.runOptimisationUI=async function(t){if(ai)return;ai=!0;const e=++ds,n=document.getElementById("optimiseBtn"+t),i=document.getElementById("optimiseResults"+t);n&&(n.disabled=!0),n&&(n.textContent="Optimising..."),i.innerHTML='<div class="loading"><div class="spinner"></div>Preparing optimisation...</div>';const r=await Nt(),s=JSON.parse(JSON.stringify(r)),o=document.getElementById(t==="MC"?"mcYears":"histYears"),l=parseInt(o&&o.value)||s.duration,c=(s.equityMin||0)+(s.bondMin||0)+(s.cashTarget||0);if(e!==ds){ai=!1,n&&(n.disabled=!1,n.textContent="Optimise Allocation");return}const u=[];for(let b=5;b<=90;b+=5)for(let E=5;E<=95-b;E+=5){const x=100-b-E;x>=0&&u.push({equity:Math.round(c*E/100),bond:Math.round(c*x/100),cash:Math.round(c*b/100)})}const{EQUITY_RETURNS:f,INFLATION:m}=window._constants,{simulate:p,monteCarloReturns:w}=window._simEngine,I=Object.keys(f).map(Number).sort((b,E)=>b-E),S=Math.max(...I),A=b=>{const E={...s,equityMin:b.equity,bondMin:b.bond,cashTarget:b.cash},x=ao({years:l},E),v=[];if(t==="MC")for(let O=0;O<1e3;O++)v.push(p(x,w(x,O),O));else I.forEach(O=>{if(O+l-1>S)return;const Z={equity:{},inflation:{}};for(let _e=0;_e<l;_e++)Z.equity[_e]=f[O+_e]||0,Z.inflation[_e]=m[O+_e]||.025;v.push(p(x,Z,O))});const le=v.filter(O=>O.failed);v.filter(O=>!O.failed);const pe=(v.length-le.length)/v.length*100,H=v.reduce((O,Z)=>O+Math.min(1,(Z.years||0)/(Z.duration||l)),0)/v.length*100,ne=v.map(O=>O.protMonths).reduce((O,Z)=>O+Z,0)/v.length,te=v.filter(O=>O.protMonths>0).length,Ne=v.map(O=>O.failed?0:O.finalReal||0).sort((O,Z)=>O-Z),Pe=Ne.length?Ne[Math.floor(Ne.length*.5)]:0,ve=Ne.length?Ne[Math.floor(Ne.length*.9)]:0;return{equity:b.equity,bond:b.bond,cash:b.cash,rate:pe,coverage:H,avgProt:ne,withProt:te,totalRuns:v.length,medianFinal:Pe,p90Final:ve}};let C;try{const b={equity:s.equityMin||0,bond:s.bondMin||0,cash:s.cashTarget||0},E=A(b);C={...b,...E}}catch(b){console.error("Optimisation error (original):",b),i.innerHTML='<div class="alert alert-danger">Error: '+b.message+"</div>",ai=!1,n&&(n.disabled=!1,n.textContent="Optimise Allocation");return}const P=10;let L=0;const N=[];let z=null;function U(b){const E=Math.max(...b.map(v=>v.coverage)),x=b.filter(v=>v.coverage>=E-.5);return x.sort((v,le)=>v.avgProt-le.avgProt||le.medianFinal-v.medianFinal),x[0]}function T(b,E){return Math.round(b.equity)===Math.round(E.equity)&&Math.round(b.bond)===Math.round(E.bond)&&Math.round(b.cash)===Math.round(E.cash)}function y(){if(e!==ds){ai=!1,n&&(n.disabled=!1,n.textContent="Optimise Allocation"),i.innerHTML="";return}try{const b=Math.min(L+P,u.length);for(;L<b;L++)N.push(A(u[L]));i.innerHTML='<div class="loading"><div class="spinner"></div>Testing allocations... '+L+"/"+u.length+"</div>",L<u.length?setTimeout(y,0):(z=U([...N,C]),_())}catch(b){console.error("Optimisation error:",b),i.innerHTML='<div class="alert alert-danger">Error: '+b.message+"</div>",ai=!1,n&&(n.disabled=!1,n.textContent="Optimise Allocation")}}function _(){if(e!==ds){ai=!1,n&&(n.disabled=!1,n.textContent="Optimise Allocation"),i.innerHTML="";return}const b=c>0?C.cash/c*100:0,E=c>0?C.equity/c*100:0,v=b>90||b<5||E<5?'<div class="alert alert-info" style="margin-bottom:16px;font-size:13px;">Your current split is outside the range the optimiser sweeps, but it was included in this comparison.</div>':"",le=z&&!T(z,C)&&(z.coverage>C.coverage+.5||z.coverage>=C.coverage-.01&&z.avgProt<C.avgProt-3),pe=(ee,ne)=>{const te=Ne=>Math.round(Ne/c*100);return'<div style="padding:16px;border-radius:8px;'+(ne?"background:rgba(46,160,67,0.1);border:1px solid var(--success);":"background:rgba(0,0,0,0.2);")+'"><div style="font-weight:500;margin-bottom:10px;color:var(--'+(ne?"success":"text-muted")+');">'+(ne?"Optimised split":"Your current split")+'</div><div style="font-size:26px;font-weight:700;color:var(--'+(ne?"success":"warning")+');">'+ee.coverage.toFixed(0)+'%</div><div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">of retirement years funded'+(ne?" ("+(z.coverage-C.coverage>=0?"+":"")+(z.coverage-C.coverage).toFixed(0)+"%)":"")+'</div><div style="font-size:13px;">Equity '+te(ee.equity)+"% · Bonds "+te(ee.bond)+"% · Cash "+te(ee.cash)+'%</div><div style="font-size:12px;color:var(--text-muted);margin-top:8px;">'+ee.rate.toFixed(0)+"% never run out · "+Y(ee.medianFinal)+" typically left</div></div>"};let H="";if(le){const ee=z.medianFinal-C.medianFinal,ne=C.medianFinal>0?ee/C.medianFinal*100:0;H+='<div class="card" style="margin-top:20px;border-color:var(--success);">',H+='<h3 style="color:var(--success);margin-top:0;">A better fund split</h3>',H+='<p style="color:var(--text-muted);margin-bottom:16px;">This split funds more of your retirement (higher coverage). Coverage credits a plan for every year it pays for, so it prefers splits that fall short late over ones that fail early.</p>',H+=v,H+='<div class="grid-2" style="gap:20px;margin-bottom:20px;">'+pe(C,!1)+pe(z,!0)+"</div>",ee<0?H+='<div class="alert alert-warning" style="margin-bottom:16px;"><strong>Trade-off:</strong> it typically leaves '+Math.abs(ne).toFixed(0)+"% less at the end (usually less equity) — more safety, a bit less upside.</div>":ee>0&&(H+='<div class="alert alert-info" style="margin-bottom:16px;"><strong>Bonus:</strong> it also typically leaves '+ne.toFixed(0)+"% more at the end.</div>"),H+='<button onclick="applyOptimisedAllocationUI('+z.equity+","+z.bond+","+z.cash+')" style="width:100%;">Apply this split to your Settings</button>',H+="</div>"}else H+='<div class="card" style="margin-top:20px;border-color:var(--primary);">',H+='<h3 style="color:var(--primary);margin-top:0;">Your split is already about as good as it gets</h3>',H+=v,H+='<p style="color:var(--text-muted);">We tested '+u.length+" fund splits. Yours funds "+C.coverage.toFixed(0)+"% of retirement years — the best, or within 0.5% of it, with no clearly better low-protection alternative.</p>",H+='<p style="font-size:13px;color:var(--text-muted);">Your split — Equity '+Math.round(E)+"% · Bonds "+Math.round(C.bond/c*100)+"% · Cash "+Math.round(b)+"% · "+C.rate.toFixed(0)+"% never run out.</p>",H+="</div>";i.innerHTML=H,ai=!1,n&&(n.disabled=!1,n.textContent="Optimise Allocation")}setTimeout(y,0)};window.applyOptimisedAllocationUI=async function(t,e,n){if(writeAlloc("ss",t,e,n),writeAlloc("ds",t,e,n),qu({equityMin:t,bondMin:e,cashTarget:n,duration:parseInt(document.getElementById("ssDuration").value)||35}),ja(),dt())try{await oo({equityMin:t,bondMin:e,cashTarget:n})}catch(i){console.error("Error saving optimised settings:",i)}showToast("Optimised allocation applied to settings and starting values. Scroll up to re-run.","success",4e3)};const eA={1929:"Wall Street Crash / Great Depression",1930:"Great Depression",1931:"Great Depression",1932:"Great Depression",1937:"Recession of 1937",1968:"Late 1960s stagflation",1969:"Late 1960s recession",1973:"Oil Crisis / 1973-74 crash",1974:"1973-74 bear market",2e3:"Dot-com bubble burst",2001:"Dot-com bust / 9/11",2007:"Global Financial Crisis",2008:"Global Financial Crisis",2022:"Post-COVID inflation / rate hikes"};function tA(t){if(!t||t.length===0)return"";const e=t.filter(s=>s.failed).sort((s,o)=>s.years-o.years),n=t.filter(s=>s.protMonths>0).sort((s,o)=>o.protMonths-s.protMonths),i=e.length>0?e.slice(0,5):n.slice(0,5);if(i.length===0)return"";let r=`
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
      `;return i.forEach(s=>{const o=s.startYear||s.seed,l=eA[o]||"-",c=s.failed?"danger":"success";r+=`
          <tr>
            <td>${o}</td>
            <td style="font-size: 12px;">${l}</td>
            <td>${s.years.toFixed(1)}</td>
            <td>${s.protMonths}</td>
            <td>${Y(s.final)}</td>
            <td style="color: var(--${c});">${s.failed?"FAILED":"OK"}</td>
          </tr>
        `}),r+=`
              </tbody>
            </table>
          </div>
        </details>
      `,r}function Ln(t){return`<span class="hlp" tabindex="0" data-tip="${String(t).replace(/"/g,"&quot;")}">?</span>`}function nA(){if(window.__helpTipInit)return;window.__helpTipInit=!0;const t=document.createElement("div");t.className="help-tip",t.style.display="none",document.body.appendChild(t);let e=null;const n=r=>{const s=r.getAttribute("data-tip");if(!s)return;clearTimeout(e),t.textContent=s,t.style.display="block";const o=r.getBoundingClientRect(),l=Math.min(260,window.innerWidth-24);t.style.width=l+"px";let c=o.left+o.width/2-l/2+window.scrollX;c=Math.max(12+window.scrollX,Math.min(c,window.scrollX+window.innerWidth-l-12)),t.style.left=c+"px";const u=t.offsetHeight;let f=o.top+window.scrollY-u-8;o.top<u+12&&(f=o.bottom+window.scrollY+8),t.style.top=f+"px"},i=()=>{e=setTimeout(()=>{t.style.display="none"},80)};document.addEventListener("mouseover",r=>{const s=r.target.closest&&r.target.closest("[data-tip]");s&&n(s)}),document.addEventListener("mouseout",r=>{r.target.closest&&r.target.closest("[data-tip]")&&i()}),document.addEventListener("focusin",r=>{const s=r.target.closest&&r.target.closest("[data-tip]");s&&n(s)}),document.addEventListener("focusout",r=>{r.target.closest&&r.target.closest("[data-tip]")&&i()}),document.addEventListener("click",r=>{const s=r.target.closest&&r.target.closest("[data-tip]");s&&(t.style.display==="block"?i():n(s))})}function iA(){if(window.__chartHoverInit)return;window.__chartHoverInit=!0;const t=e=>e.querySelectorAll("circle[data-tip]").forEach(n=>{n.setAttribute("fill","transparent"),n.removeAttribute("stroke")});document.addEventListener("mousemove",e=>{const n=e.target.closest&&e.target.closest(".ichart");if(!n)return;const i=n.querySelectorAll("circle[data-tip]");if(!i.length)return;let r=null,s=1/0;i.forEach(o=>{const l=o.getBoundingClientRect(),c=Math.abs(l.left+l.width/2-e.clientX);c<s&&(s=c,r=o)}),r&&(t(n),r.setAttribute("fill","#60a5fa"),r.setAttribute("stroke","var(--surface,#161b22)"),r.setAttribute("stroke-width","2"),r.dispatchEvent(new MouseEvent("mouseover",{bubbles:!0})))}),document.addEventListener("mouseout",e=>{const n=e.target.closest&&e.target.closest(".ichart");n&&t(n)})}const zi=t=>"£"+Math.round(t).toLocaleString();function iy(t,e,n){return`<svg class="ichart" viewBox="0 0 ${e} ${n}" style="width:100%;height:auto;overflow:visible;display:block" role="img">${t}</svg>`}function ry(t,{max:e,valueFmt:n=zi,tip:i,pct:r=!1}={}){const m=t.length;if(m<2)return"";const p=e??(r?100:Math.max(1,...t)),w=N=>56+N/(m-1)*590,I=N=>174-Math.max(0,Math.min(r?100:1/0,N))/p*160,S=t.map((N,z)=>`${w(z).toFixed(1)},${I(N).toFixed(1)}`).join(" "),A=`56,${174 .toFixed(1)} ${S} ${w(m-1).toFixed(1)},${174 .toFixed(1)}`,C=r?[0,50,100]:[0,p/2,p],P=[0,Math.floor((m-1)/2),m-1],L=i||((N,z)=>`Year ${z}: ${n(N)}`);return iy(C.map(N=>`<line x1="56" y1="${I(N).toFixed(1)}" x2="646" y2="${I(N).toFixed(1)}" stroke="var(--border,#8883)" opacity=".45"/><text x="50" y="${(I(N)+3).toFixed(1)}" text-anchor="end" font-size="10" fill="var(--text-muted,#999)">${n(N)}</text>`).join("")+`<polygon points="${A}" fill="rgba(96,165,250,.13)"/><polyline points="${S}" fill="none" stroke="#60a5fa" stroke-width="2.5"/>`+t.map((N,z)=>`<circle cx="${w(z).toFixed(1)}" cy="${I(N).toFixed(1)}" r="8" fill="transparent" data-tip="${L(N,z).replace(/"/g,"&quot;")}"></circle>`).join("")+P.map(N=>`<text x="${w(N).toFixed(1)}" y="192" text-anchor="middle" font-size="10" fill="var(--text-muted,#999)">Year ${N}</text>`).join(""),660,200)}function rA(t){const l=t.p50.length;if(l<2)return"";const c=Math.max(1,...t.p90),u=S=>60+S/(l-1)*606,f=S=>222-Math.max(0,S)/c*208,m=(S,A)=>S.map((C,P)=>`${u(P).toFixed(1)},${f(C).toFixed(1)}`).concat(A.map((C,P)=>`${u(l-1-P).toFixed(1)},${f(A[l-1-P]).toFixed(1)}`)).join(" "),p=S=>S.map((A,C)=>`${u(C).toFixed(1)},${f(A).toFixed(1)}`).join(" "),w=[0,c/4,c/2,3*c/4,c],I=[0,Math.floor((l-1)/2),l-1];return iy(w.map(S=>`<line x1="60" y1="${f(S).toFixed(1)}" x2="666" y2="${f(S).toFixed(1)}" stroke="var(--border,#8883)" opacity=".4"/><text x="54" y="${(f(S)+3).toFixed(1)}" text-anchor="end" font-size="10" fill="var(--text-muted,#999)">${zi(S)}</text>`).join("")+`<polygon points="${m(t.p90,t.p10)}" fill="rgba(96,165,250,.12)"/><polygon points="${m(t.p75,t.p25)}" fill="rgba(96,165,250,.22)"/><polyline points="${p(t.p50)}" fill="none" stroke="#60a5fa" stroke-width="2.5"/>`+t.p50.map((S,A)=>`<circle cx="${u(A).toFixed(1)}" cy="${f(S).toFixed(1)}" r="8" fill="transparent" data-tip="Year ${A}: middle ${zi(S)}; likely range ${zi(t.p10[A])} to ${zi(t.p90[A])}"></circle>`).join("")+I.map(S=>`<text x="${u(S).toFixed(1)}" y="242" text-anchor="middle" font-size="10" fill="var(--text-muted,#999)">Year ${S}</text>`).join(""),680,250)}function sA(t){if(!t||!t.funded)return"";const e=r=>(r||0).toFixed(r>=10?0:1),n=t.pctSurviveFullTerm>=80?"success":t.pctSurviveFullTerm>=50?"warning":"danger",i=t.avgHigherRateYears<1?"success":t.avgHigherRateYears<4?"warning":"danger";return`
        <h3 style="margin:24px 0 4px;">Your tax-free ISA bridge</h3>
        <p style="color:var(--text-muted);font-size:12px;margin:0 0 12px;">
          The ISA (starting at ${Y(t.startBalance)}) is drawn tax-free to top your income up, keeping you out of higher-rate tax. Modelled as a steady money-market fund.
        </p>
        <div class="keynums">
          <div class="keynum ${n}">
            <div class="kn-val">${t.pctSurviveFullTerm.toFixed(0)}%</div>
            <div class="kn-label">of futures the ISA still has real money at the end ${Ln("The ISA is treated as used up once its value in present-day money falls below 5% of what you started with — money-market growth leaves a tiny nominal sliver forever, so an exactly-zero test would be misleading.")}</div>
          </div>
          <div class="keynum">
            <div class="kn-val">${e(t.medianLastedYears)} yrs</div>
            <div class="kn-label">the ISA typically lasts before it's used up ${Ln("Median year its value in present-day money drops below 5% of the starting balance — the point it stops meaningfully topping up your income. Matches the chart below.")}</div>
          </div>
          <div class="keynum ${i}">
            <div class="kn-val">${e(t.avgHigherRateYears)} yrs</div>
            <div class="kn-label">typically paying 40% (higher-rate) tax ${Ln("Years you pay higher-rate income tax because the ISA has run out and income must come from the taxable pension above the basic-rate limit. A bigger ISA reduces these.")}</div>
          </div>
          <div class="keynum">
            <div class="kn-val">${Y(t.medianTotalTax)}</div>
            <div class="kn-label">typical lifetime income tax, today's money ${Ln("Median total income tax paid over the whole plan, in present-day spending power.")}</div>
          </div>
        </div>
        <div style="margin-bottom:8px;">
          <div class="chart-caption">Typical ISA balance still to hand, year by year (today's money — hover a point for the figure). A slow, steady fall means it's being drawn as intended; a flat line means it's barely touched (larger than this plan needs); a drop to £0 marks when it typically runs out.</div>
          ${ry(t.medianIsaByYear,{valueFmt:zi,tip:(r,s)=>`Year ${s}: typically ${zi(r)} of ISA left`})}
        </div>`}function oA(t){return t==="sequence"?"The failing futures were sunk by a bad first few years of markets. Holding a bigger cash/bond buffer for the early years, or starting with a slightly lower withdrawal, would let the plan ride out an early slump.":t==="inflation"?"The failing futures were driven by high inflation eroding your spending power. More inflation protection (e.g. index-linked gilts) and less plain cash would help — cash loses to inflation over time.":t==="market"?"The failing futures simply had weak markets throughout. A slightly lower withdrawal rate, or more growth assets (equities) accepting more short-term ups and downs, gives more headroom.":"Lowering your target income, delaying the start, or a larger starting pot would all raise the odds."}function aA(t,e){const n=t.severity||{},i=t.successRate,r=i>=90?{t:"Very likely to last",c:"success"}:i>=75?{t:"Likely to last — with some risk",c:"success"}:i>=50?{t:"At real risk of running out",c:"warning"}:{t:"Unlikely to last as planned",c:"danger"};let s=`<div class="verdict verdict-${r.c}">
        <div class="verdict-title">Will your money last? — ${r.t}</div>
        <div class="verdict-heroes">
          <div><span class="hero">${i.toFixed(0)}%</span>
            <span class="hero-sub">chance your money lasts the whole plan ${Ln("Out of "+e+", the share where your pot never runs out before the end of the plan. Higher is better.")}</span></div>
          <div><span class="hero" style="font-size:30px;">${(n.coverage||0).toFixed(0)}%</span>
            <span class="hero-sub">of retirement years funded (coverage) ${Ln('The average share of retirement years your plan pays for, across every simulated future — so a plan that funds 34 of 35 years scores 97%, and a late shortfall counts far less than an early one. Based on the retirement "coverage ratio" (Estrada & Kritzman, 2019). Note: it is capped at 100% and ignores any money left over, and it is an average — check the worst-case minimum below.')}</span></div>
        </div>
        <div class="verdict-basis">Based on ${e}. Pot and income values are shown in today's money.</div>
      </div>`;return n.failCount>0&&(s+=`<div class="callout">
          <div class="callout-title">Why it might fall short</div>
          <p>${n.diagnosis}</p>
          <p class="lever"><strong>What could help:</strong> ${oA(n.primaryDriver)}</p>
        </div>`),s}function sy(t,e,n,i,r){nA(),iA();const s=t.survival||{},o=t.finalReal||{},l=t.protection||{},c=l.pctWithProtection!=null?l.pctWithProtection:(l.runsWithProtection||0)/(e.length||1)*100,u=i==="mcResults",f=u?`${e.length.toLocaleString()} simulated futures`:`${e.length} historical periods since 1928`;let m=`
        <div class="card">
          <h2>${n}</h2>

          ${aA(t,f)}

          <div class="keynums">
            <div class="keynum">
              <div class="kn-val">${Math.round(s.min||0)} / ${r} yrs</div>
              <div class="kn-label">worst simulated future — money lasted this long ${Ln("The single unluckiest of all the simulated futures — the true tail. The average coverage can look reassuring; this is the worst it ever got. (10th-percentile: at least "+(s.p10||0).toFixed(0)+" years.)")}</div>
            </div>
            <div class="keynum">
              <div class="kn-val">${Y(o.p50||0)}</div>
              <div class="kn-label">typically left at the end, today's money ${Ln("The middle outcome for the pension pot left at the end, in present-day spending power. Futures that ran out count as £0, so this is not flattered by only the lucky runs.")}</div>
            </div>
            <div class="keynum">
              <div class="kn-val">${c.toFixed(0)} in 100</div>
              <div class="kn-label">futures where the plan had to cut back spending ${Ln("To ride out a market slump the plan temporarily reduces withdrawals. This is how often that safety response was needed.")}</div>
            </div>
          </div>

          <h3 style="margin:8px 0 4px;">How your pot changes over time (today's money)</h3>
          <div class="chart-caption">The blue line is the middle outcome; the darker band is the middle half of futures, the lighter band the 10th–90th. Futures that ran out count as £0, so a sinking band means real risk. Hover any point for the figures.</div>
          ${rA(t.chartData.potBand)}

          <h3 style="margin:22px 0 4px;">Chance your plan is still going, year by year</h3>
          <div class="chart-caption">Share of futures in which the money hasn't run out yet — starts at 100% and dips where plans tend to fail. A late dip means most shortfalls happen late.</div>
          ${ry(t.chartData.solvency,{pct:!0,valueFmt:p=>p.toFixed(0)+"%",tip:(p,w)=>`Year ${w}: ${p.toFixed(0)}% of plans still going`})}

          ${sA(t.isa)}

          <details style="margin-top:22px;">
            <summary style="cursor:pointer;font-weight:600;color:var(--primary);">More detail — worst historical periods &amp; full statistics</summary>
            <div style="margin-top:16px;">
              ${i==="histResults"?tA(e):""}

              <h4 style="margin:20px 0 8px;">Pot left at the end — full range (today's money)</h4>
              <div class="grid-7" style="display:grid;grid-template-columns:repeat(7,1fr);gap:10px;">
                ${[["p5","unluckiest 5%"],["p10","10%"],["p25","25%"],["p50","middle"],["p75","75%"],["p90","90%"],["p95","luckiest 5%"]].map(([p,w])=>`
                  <div class="stat-box mini">
                    <div class="stat-value" style="font-size:13px;">${Y(o[p]||0)}</div>
                    <div class="stat-label" style="font-size:10px;">${w}</div>
                  </div>`).join("")}
              </div>
              <p style="font-size:12px;color:var(--text-muted);margin-top:14px;line-height:1.6;">
                Based on ${f}. ${u?"Monte Carlo builds each future by stitching together random 5-year blocks of real history (1928–2024), so market slumps and inflation spikes arrive in realistic sustained runs rather than one-off years.":"Each run replays an actual stretch of history in its real order, capturing the true sequence of good and bad years."}
                A future "runs out" when the pension/cash pots hit zero before the plan ends.
              </p>
            </div>
          </details>
        </div>
      `;document.getElementById(i).innerHTML=m}function lA(t,e){let n='<div class="card"><h2>Scenario Analysis</h2>';n+=`
        <div class="chart-container" style="margin-bottom: 24px;">
          <canvas id="scenCompChart" width="900" height="400"></canvas>
        </div>
      `,n+='<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">';for(const[i,r]of Object.entries(t)){const s=r.result,o=s.failed?"danger":"success";n+=`
          <div class="history-item" style="border-left: 4px solid ${r.color};">
            <div>
              <div class="history-date">${r.name}</div>
              <div class="history-details">
                Protection: ${s.protMonths} mo | Max streak: ${s.maxConsec} mo
                ${s.hodlUsed>0?` | HODL used: ${Y(s.hodlUsed)}`:""}
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 24px; color: var(--${o});">${s.years.toFixed(1)} yrs</div>
              <div style="font-size: 12px; color: var(--${o});">${s.failed?"FAILED":"OK"}</div>
              <div style="font-size: 11px; color: var(--text-muted);">Final: ${Y(s.final)}</div>
            </div>
          </div>
        `}n+="</div></div>",document.getElementById(e).innerHTML=n,setTimeout(()=>{const i=document.getElementById("scenCompChart");i&&t&&Wx(i,t,{years:35,title:"Scenario Comparison"})},50)}const Ka={cautious:{key:"cautious",label:"Cautious",equity:.3,bond:.45,diversifiers:.12,cash:.13},balanced:{key:"balanced",label:"Balanced",equity:.5,bond:.3,diversifiers:.15,cash:.05},adventurous:{key:"adventurous",label:"Adventurous",equity:.65,bond:.15,diversifiers:.15,cash:.05}};function oy(t){const e=document.getElementById(t+"Diversifiers");return!!(e&&e.checked)}window._customAlloc=window._customAlloc||{};window._allocMode=window._allocMode||{};function Hu(t){return window._allocMode[t]||"risk"}function ay(t){if(window._customAlloc[t])return window._customAlloc[t];const e=document.querySelector("#"+t+"Risks .risk-card.active"),n=e&&e.dataset.risk||"balanced",i=oy(t)?Ka:$n;return i[n]||i.balanced}function ly(t,e,n,i){i=i||0;const r=i>.001?Ka:$n;let s="balanced",o=1/0;for(const l in r){const c=r[l],u=(c.equity-t)**2+(c.bond-e)**2+((c.diversifiers||0)-i)**2+(c.cash-n)**2;u<o&&(o=u,s=l)}return s}window.updateAllocDisplay=function(t){const e=ay(t),n=Math.round(e.equity*100),i=Math.round(e.bond*100),r=Math.round(e.cash*100),s=Math.round((e.diversifiers||0)*100),o=document.getElementById(t+"AllocAmounts"),l=window._customAlloc[t],c=document.getElementById(t+"Pot");if(l&&c){const U=Math.round((l.equityMin||0)+(l.bondMin||0)+(l.cashTarget||0)+(l.diversifierStart||0));+c.value!==U&&(c.value=U,c._updateOverlay&&c._updateOverlay());const T=document.getElementById(t+"PotDisplay");T&&(T.textContent="£"+U.toLocaleString())}const u=+document.getElementById(t+"Pot").value||0,f=l?l.equityMin:Math.round(u*n/100),m=l?l.bondMin:Math.round(u*i/100),p=l?l.cashTarget:Math.round(u*r/100),w=l?l.diversifierStart||0:Math.round(u*s/100),I=s>0?" &middot; "+s+"% diversifiers":"",S=s>0?" &middot; £"+w.toLocaleString()+" diversifiers":"",A=Math.round(+(document.getElementById(t+"IsaBalance")||{}).value||0),C=A>0?'<br><span style="color:var(--text-muted);">+ £'+A.toLocaleString()+" ISA kept separate (the tax-free bridge)</span>":"";o&&(o.innerHTML="<strong>"+e.label+"</strong> &mdash; "+n+"% shares &middot; "+i+"% bonds"+I+" &middot; "+r+'% cash<br><span style="color:var(--text-muted);">£'+f.toLocaleString()+" shares &middot; £"+m.toLocaleString()+" bonds"+S+" &middot; £"+p.toLocaleString()+" cash</span>"+C);const P=document.getElementById(t+"EquityGlide"),L=!!(P&&P.checked),N=document.getElementById(t+"GlideEndgame");N&&(L&&l?(N.style.display="block",N.innerHTML=uA(t)):N.style.display="none");const z=document.getElementById(t+"GlideMinNote");z&&(L?(z.style.display="block",z.innerHTML=cA(t,e)):z.style.display="none")};function cA(t,e){const n=document.getElementById(t+"Duration"),i=n&&+n.value||35,r=Math.max(5,i-20),s=e.cash,o=e.diversifiers||0,l=1-s-o,c=window._customAlloc[t],u=!!c,f=u&&c.glideEndgame?c.glideEndgame:null,m=u?xf(e.equity,e.bond,f):$s(e.equity,e.bond),p=Math.round(l*m.start*100),w=Math.round(l*m.end*100),I=Math.round(l*(1-m.start)*100),S=Math.round(l*(1-m.end)*100),A=Math.round(s*100),C=Math.round(o*100),P=6,L=314,N=18,z=104,U=z-N,T=_e=>(z-_e*U).toFixed(1),y=(P+(L-P)*Math.min(1,r/i)).toFixed(1),_=T(s),b=T(s+o),E=T(s+o+l*(1-m.start)),x=T(s+o+l*(1-m.end)),v="#6366f1",le="#14b8a6",pe="#94a3b8",H="#f59e0b",ee=o>0?`<polygon points="${P},${_} ${L},${_} ${L},${b} ${P},${b}" fill="${H}"></polygon>`:"",ne=`<svg viewBox="0 0 320 122" style="width:100%;height:auto;display:block;" preserveAspectRatio="none"><polygon points="${P},${z} ${L},${z} ${L},${_} ${P},${_}" fill="${pe}"></polygon>`+ee+`<polygon points="${P},${b} ${L},${b} ${L},${x} ${y},${x} ${P},${E}" fill="${le}"></polygon><polygon points="${P},${E} ${y},${x} ${L},${x} ${L},${N} ${P},${N}" fill="${v}"></polygon><line x1="${y}" y1="${N}" x2="${y}" y2="${z}" stroke="rgba(148,163,184,0.9)" stroke-width="1" stroke-dasharray="3,2"></line></svg>`,te=_e=>`<span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${_e};vertical-align:middle;"></span>`,Ne=o>0?" · "+C+"% diversifiers":"",Pe=o>0?" &nbsp; "+te(H)+" Diversifiers":"",ve=u?"Now (your funds)":"Starts",O=u?"Rises to"+(f&&f.label?" ("+f.label+")":""):"Then holds ("+e.label+")",Z=u?"rises from your holdings, levels off at year "+r:"reaches your mix at year "+r+", then holds";return'<div style="font-weight:600;margin-bottom:6px;">How your mix glides over '+i+" years</div>"+ne+'<div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);margin-top:3px;"><span>Now</span><span>'+Z+'</span></div><div style="display:flex;justify-content:space-between;gap:12px;font-size:12px;margin-top:8px;"><span><strong>'+ve+"</strong><br>"+p+"% shares · "+I+"% bonds"+Ne+" · "+A+'% cash</span><span style="text-align:right;"><strong>'+O+"</strong><br>"+w+"% shares · "+S+"% bonds"+Ne+" · "+A+'% cash</span></div><div style="font-size:12px;margin-top:8px;">'+te(v)+" Shares &nbsp; "+te(le)+" Bonds"+Pe+" &nbsp; "+te(pe)+" Cash</div>"}window.setRiskPreset=function(t,e){$n[e]&&(window._allocMode[t]="risk",delete window._customAlloc[t],document.querySelectorAll("#"+t+"Risks .risk-card").forEach(n=>n.classList.toggle("active",n.dataset.risk===e)),updateAllocDisplay(t))};window.setAllocMode=function(t,e){window._allocMode[t]=e;const n=document.getElementById(t+"ModeRisk"),i=document.getElementById(t+"ModeFunds");n&&n.classList.toggle("active",e==="risk"),i&&i.classList.toggle("active",e==="funds");const r=document.getElementById(t+"RiskMode"),s=document.getElementById(t+"FundsMode");if(r&&(r.style.display=e==="risk"?"":"none"),s&&(s.style.display=e==="funds"?"":"none"),e==="funds")renderFunds(t),Wu(t);else if(delete window._customAlloc[t],!document.querySelector("#"+t+"Risks .risk-card.active")){const o=document.querySelector("#"+t+'Risks .risk-card[data-risk="balanced"]');o&&o.classList.add("active")}updateAllocDisplay(t),typeof updateEntryTagPrompt=="function"&&updateEntryTagPrompt()};function uA(t){const e=window._customAlloc[t]&&window._customAlloc[t].glideEndgame&&window._customAlloc[t].glideEndgame.key||"",n=(i,r)=>'<button type="button" class="risk-btn'+(e===i?" active":"")+`" style="padding:6px 12px;" onclick="setGlideEndgame('`+t+"','"+i+`')">`+r+"</button>";return'<div style="font-size:12px;color:var(--text-muted);margin-bottom:6px;"><strong>Glide towards</strong> — your funds are the start; the tent raises shares over time to this level:</div><div style="display:flex;gap:8px;flex-wrap:wrap;">'+n("cautious","Cautious")+n("balanced","Balanced")+n("adventurous","Adventurous")+"</div>"}window.setGlideEndgame=function(t,e){const n=window._customAlloc[t];if(!n)return;const r=(oy(t)?Ka:$n)[e];if(!r)return;n.glideEndgame={equityPct:r.equity,bondPct:r.bond,key:e,label:r.label};const s=n.equity/(n.equity+n.bond||1);r.equity/(r.equity+r.bond||1)<=s&&showToast("That endgame isn’t more share-heavy than your holdings — the glide would flatten or decline, not rise.","warning",5e3),updateAllocDisplay(t)};window.readAlloc=function(t){const e=window._customAlloc[t];if(e){const o={equityMin:e.equityMin,bondMin:e.bondMin,cashTarget:e.cashTarget};return e.diversifierStart>0&&(o.diversifierStart=e.diversifierStart),e.subAsset&&(o.subAsset=e.subAsset),e.glideEndgame&&(o.glideEndgame=e.glideEndgame),o}const n=+document.getElementById(t+"Pot").value||0,i=ay(t),r={equityMin:Math.round(n*i.equity),bondMin:Math.round(n*i.bond),cashTarget:Math.round(n*i.cash)},s=i.diversifiers||0;return s>0&&(r.diversifierStart=Math.round(n*s),r.subAsset={}),r};window.writeAlloc=function(t,e,n,i,r){const s=+r||0,o=(+e||0)+(+n||0)+(+i||0)+s;document.getElementById(t+"Pot").value=Math.round(o);const l=document.getElementById(t+"Diversifiers");l&&(l.checked=s>0);const c=o>0?Math.round((+e||0)/o*100):50,u=o>0?Math.round((+n||0)/o*100):40,f=o>0?ly((+e||0)/o,(+n||0)/o,(+i||0)/o,s/o):"balanced";document.querySelectorAll("#"+t+"Risks .risk-card").forEach(p=>p.classList.toggle("active",p.dataset.risk===f)),updateAllocDisplay(t);const m=(s>0?Ka:$n)[f];if(o>0&&(c!==Math.round(m.equity*100)||u!==Math.round(m.bond*100))){const p=document.getElementById(t+"AllocAmounts");p&&(p.innerHTML+='<div style="margin-top:8px;color:#b45309;font-size:12px;">Your saved split ('+c+"% / "+u+"% / "+Math.max(0,100-c-u)+"%) was matched to the nearest risk level (<strong>"+m.label+"</strong>). Pick another if you prefer — saving keeps this one.</div>")}};window._taggedFunds=window._taggedFunds||{};function Bt(t){return window._taggedFunds[t]=window._taggedFunds[t]||[]}const cy={shares:"Shares",bonds:"Bonds",diversifiers:"Diversifiers",cash:"Cash"};function ac(t,e=!1){const n=document.getElementById(t+"FundCatalogue");n&&(e||!n.childElementCount)&&(n.innerHTML=Dg().map(i=>'<option value="'+i.ticker+'">'+i.ticker+" — "+i.name+"</option>").join(""))}function lc(t){const e=(t.ticker||"").toUpperCase().trim(),n=Rr(e);return t.subClass||n&&n.subClass||Eg[e]||""}window.reformatMoney=function(t){const e=parseFloat(String(t.value).replace(/[^0-9.]/g,""));t.value=isNaN(e)||e===0?"":Fu(e)};function dA(t,e,n){if(t=t.toLowerCase().trim(),!t)return 0;const i=e.toLowerCase(),r=n.toLowerCase();if(i===t)return 1e3;if(i.startsWith(t))return 900-(i.length-t.length);if(r.split(/[^a-z0-9]+/).filter(Boolean).some(l=>l.startsWith(t)))return 820;if(i.includes(t))return 720;if(r.includes(t))return 660-Math.min(50,r.indexOf(t));const o=l=>{let c=0;for(const u of l)if(u===t[c]&&c++,c===t.length)return!0;return!1};return o(i)?360:o(r)?300:0}function hA(t,e=8){return Dg().map(n=>({f:n,s:dA(t,n.ticker,n.name)})).filter(n=>n.s>0).sort((n,i)=>i.s-n.s||n.f.ticker.localeCompare(i.f.ticker)).slice(0,e).map(n=>n.f)}window.showFundSearch=function(t,e){const n=document.getElementById(t+"FundSearchResults");if(!n)return;const i=hA(e);if(!e.trim()||!i.length){n.style.display="none",n.innerHTML="";return}n.innerHTML=i.map(r=>`<div class="fund-search-item" onmousedown="addFundFromSearch('`+t+"','"+r.ticker+`')" style="padding:7px 10px; cursor:pointer;"><strong>`+r.ticker+'</strong> <span style="color:var(--text-muted);font-size:12px;">'+r.name+"</span></div>").join(""),n.style.display="block"};window.hideFundSearch=function(t){const e=document.getElementById(t+"FundSearchResults");e&&(e.style.display="none")};window.addFundFromSearch=function(t,e){const n=Rr(e);Bt(t).push({ticker:e,value:"",wrapper:"SIPP",subClass:n?n.subClass:""});const i=document.getElementById(t+"FundSearch");i&&(i.value=""),hideFundSearch(t),renderFunds(t)};function fA(t,e,n){const i=iS();let r='<option value="">— not set —</option>';for(const s of["shares","bonds","diversifiers","cash"]){const o=i[s]||[];o.length&&(r+='<optgroup label="'+cy[s]+'">'+o.map(l=>'<option value="'+l.key+'"'+(l.key===n?" selected":"")+">"+l.label+"</option>").join("")+"</optgroup>")}return`<select onchange="updateFundField('`+t+"',"+e+`,'subClass',this.value)" style="width:190px;">`+r+"</select>"}function pA(t){const e=encodeURIComponent((t||"").toUpperCase().trim()),n=(i,r)=>'<a href="'+i+'" target="_blank" rel="noopener" style="margin-right:8px;">'+r+"</a>";return'<div style="font-size:11px; margin-top:3px; color:var(--text-muted);">Not in our list — how is it invested? Look it up: '+n("https://markets.ft.com/data/search?query="+e,"FT")+n("https://www.morningstar.co.uk/uk/util/SecuritySearchResults.aspx?search="+e,"Morningstar")+n("https://www.justetf.com/uk/search.html?query="+e,"justETF")+"then pick a category.</div>"}function uy(t,e,n){const i=(n.ticker||"").toUpperCase().trim(),r=i&&!Rr(i);return fA(t,e,lc(n))+(r?pA(i):"")}window.renderFunds=function(t){const e=document.getElementById(t+"FundRows");e&&(ac(t),e.innerHTML=Bt(t).map((n,i)=>'<tr><td style="padding:3px 6px;"><input type="text" list="'+t+'FundCatalogue" value="'+(n.ticker||"")+`" oninput="updateFundField('`+t+"',"+i+`,'ticker',this.value)" style="width:92px;text-transform:uppercase;" placeholder="e.g. VWRL"></td><td style="padding:3px 6px;"><input type="text" inputmode="numeric" value="`+(n.value?Fu(n.value):"")+`" oninput="updateFundField('`+t+"',"+i+`,'value',this.value)" onblur="reformatMoney(this)" style="width:110px;" placeholder="0"></td><td style="padding:3px 6px;"><select onchange="updateFundField('`+t+"',"+i+`,'wrapper',this.value)" style="width:74px;"><option`+(n.wrapper!=="ISA"?" selected":"")+">SIPP</option><option"+(n.wrapper==="ISA"?" selected":"")+'>ISA</option></select></td><td id="'+t+"_fcat_"+i+'" style="padding:3px 6px;">'+uy(t,i,n)+`</td><td style="padding:3px 6px;"><button type="button" class="risk-btn" style="padding:2px 8px;" onclick="removeFund('`+t+"',"+i+')">&times;</button></td></tr>').join(""),dy(t))};window.updateFundField=function(t,e,n,i){const r=Bt(t)[e];if(r){if(n==="value")r.value=parseFloat(String(i).replace(/[^0-9.]/g,""))||0;else if(n==="ticker"){r.ticker=i;const s=Rr(i);s&&(r.subClass=s.subClass);const o=document.getElementById(t+"_fcat_"+e);o&&(o.innerHTML=uy(t,e,r))}else n==="subClass"?(r.subClass=i,i&&r.ticker&&!Rr(r.ticker)&&gx({ticker:r.ticker,name:"",subClass:i})):r[n]=i;dy(t)}};window.addFundRow=function(t){Bt(t).push({ticker:"",value:"",wrapper:"SIPP"}),renderFunds(t)};window.removeFund=function(t,e){Bt(t).splice(e,1),renderFunds(t)};window.clearFunds=function(t){window._taggedFunds[t]=[],renderFunds(t)};function dy(t){const e=document.getElementById(t+"FundSummary");if(!e)return;const n=Bt(t).filter(u=>u.ticker&&u.value>0);if(!n.length){e.innerHTML='<span style="color:var(--text-muted);font-size:12px;">Add holdings above to see the bucket roll-up.</span>';return}const i=Du(n),r=i.total-i.isaTotal,s=u=>r?Math.round(i.buckets[u]/r*100):0,o=u=>"£"+Math.round(u).toLocaleString(),l=u=>Object.entries(u).map(([f,m])=>Ut[f].label+" "+Math.round(m*100)+"%").join(" · ");let c='<div style="font-weight:600;margin-bottom:6px;">Rolls up to '+o(r)+" pot"+(i.isaTotal?" + "+o(i.isaTotal)+" ISA (kept separate — the tax-free bridge)":"")+"</div>";c+='<div style="font-size:13px;">';for(const u of["shares","bonds","diversifiers","cash"])i.buckets[u]&&(c+="<div><strong>"+cy[u]+"</strong>: "+o(i.buckets[u])+" ("+s(u)+"%)"+(u==="bonds"&&Object.keys(i.bondWeights).length?' <span style="color:var(--text-muted);font-size:11px;">— '+l(i.bondWeights)+"</span>":"")+(u==="diversifiers"&&Object.keys(i.diversifierWeights).length?' <span style="color:var(--text-muted);font-size:11px;">— '+l(i.diversifierWeights)+"</span>":"")+"</div>");c+="</div>",i.untagged.length&&(c+='<div style="color:#b45309;font-size:12px;margin-top:6px;">Not recognised (ignored): '+i.untagged.map(u=>u.ticker).join(", ")+"</div>"),e.innerHTML=c,Hu(t)==="funds"&&(Wu(t),updateAllocDisplay(t))}function Wu(t){const e=Bt(t).filter(c=>c.ticker&&c.value>0);if(!e.length)return delete window._customAlloc[t],null;const n=Du(e),i=fx(n),r=window._customAlloc[t]||{};window._customAlloc[t]={label:"Your funds",equity:n.total?n.buckets.shares/n.total:0,bond:n.total?n.buckets.bonds/n.total:0,diversifiers:n.total?n.buckets.diversifiers/n.total:0,cash:n.total?n.buckets.cash/n.total:0,equityMin:i.equityStart,bondMin:i.bondStart,cashTarget:i.cashStart,diversifierStart:i.diversifierStart||0,subAsset:i.subAsset||null,glideEndgame:r.glideEndgame||null};const s=document.getElementById(t+"Pot");s&&(s.value=Math.round(n.total-n.isaTotal),s._updateOverlay&&s._updateOverlay());const o=document.getElementById(t+"Diversifiers");o&&(o.checked=(i.diversifierStart||0)>0);const l=document.getElementById(t+"IsaBalance");return l&&(l.value=Math.round(n.isaTotal||0),l._updateOverlay&&l._updateOverlay()),n}window.applyTaggedPortfolio=function(t){if(window._allocMode[t]="funds",!Wu(t)){showToast("Add some holdings first","warning");return}updateAllocDisplay(t)};window.restoreCustomAllocFromSettings=function(t,e){if(e&&e.subAsset&&e.subAsset.bondWeights&&Object.keys(e.subAsset.bondWeights).length){const n=(e.equityMin||0)+(e.bondMin||0)+(e.cashTarget||0)+(e.diversifierStart||0);window._customAlloc[t]={label:"Your funds",equity:n?e.equityMin/n:0,bond:n?e.bondMin/n:0,diversifiers:n?(e.diversifierStart||0)/n:0,cash:n?e.cashTarget/n:0,equityMin:e.equityMin,bondMin:e.bondMin,cashTarget:e.cashTarget,diversifierStart:e.diversifierStart||0,subAsset:e.subAsset,glideEndgame:e.glideEndgame||null}}else delete window._customAlloc[t]};function mA(t){const e={shares:[],bonds:[],diversifiers:[],cash:[]},n=[];t.tagged.forEach(o=>{(o.wrapper||"").toUpperCase()==="ISA"?n.push(o):e[o.bucket]&&e[o.bucket].push(o)});const i=o=>"£"+Math.round(o).toLocaleString(),r={shares:"Shares",bonds:"Bonds",diversifiers:"Diversifiers",cash:"Cash"};let s='<div style="font-size:12px;border:1px solid var(--border,#cbd5e1);border-radius:8px;padding:10px 12px;">';s+='<div style="font-weight:600;margin-bottom:6px;">Which of your funds went where</div>';for(const o of["shares","bonds","diversifiers","cash"]){if(!e[o].length)continue;const l=e[o].reduce((c,u)=>c+(+u.value||0),0);s+='<div style="margin:3px 0;"><strong>'+r[o]+"</strong> "+i(l)+': <span style="color:var(--text-muted);">'+e[o].map(c=>c.ticker).join(", ")+"</span></div>"}return n.length&&(s+='<div style="margin:3px 0;"><strong>ISA (separate tax-free pool)</strong> '+i(t.isaTotal)+': <span style="color:var(--text-muted);">'+n.map(o=>o.ticker).join(", ")+"</span></div>"),t.untagged.length&&(s+='<div style="color:#b45309;margin-top:4px;">Not recognised: '+t.untagged.map(o=>o.ticker).join(", ")+"</div>"),s+="</div>",s}window._fundModal={fieldId:null,subtotal:0};window.openFundBucketModal=function(t,e,n){const i=Bt("ds").filter(s=>{const o=lc(s);return s.ticker&&o&&Ut[o]&&Ut[o].bucket===t});window._fundModal={fieldId:e,subtotal:0},document.getElementById("fundModalTitle").textContent=n;const r=document.getElementById("fundModalRows");i.length?r.innerHTML=i.map(s=>{const o=Rr(s.ticker),l=Ut[lc(s)],c=o?o.name:l?l.label:"";return'<div style="display:flex; align-items:center; justify-content:space-between; gap:12px; margin:8px 0;"><span><strong>'+s.ticker+'</strong> <span style="color:var(--text-muted);font-size:12px;">'+c+'</span></span><span style="white-space:nowrap;">£ <input type="number" class="fund-modal-input" oninput="updateFundModalSubtotal()" style="width:120px;" placeholder="0"></span></div>'}).join(""):r.innerHTML='<p style="color:var(--text-muted);">No '+n.toLowerCase()+" tagged yet. Define your holdings in <strong>Settings → Build from my funds</strong>, then come back — or just type the total into the box.</p>",updateFundModalSubtotal(),document.getElementById("fundBucketModal").style.display="flex"};window.updateFundModalSubtotal=function(){let t=0;document.querySelectorAll("#fundModalRows .fund-modal-input").forEach(e=>{t+=+e.value||0}),window._fundModal.subtotal=t,document.getElementById("fundModalSubtotal").textContent="Total: £"+Math.round(t).toLocaleString()};window.applyFundBucketModal=function(){const t=document.getElementById(window._fundModal.fieldId);t&&(t.value=Math.round(window._fundModal.subtotal||0)),closeFundBucketModal()};window.closeFundBucketModal=function(){document.getElementById("fundBucketModal").style.display="none"};window.updateEntryTagPrompt=function(){const t=document.getElementById("entryTagPrompt");if(!t)return;if(Bt("ds").filter(n=>n.ticker).length>0){t.style.display="none",t.innerHTML="";return}t.style.display="block",t.innerHTML='<div class="alert alert-info" style="font-size:13px;">The Decision Tool works from your real portfolio. Tag your funds in <strong>Settings → “Build from my funds”</strong> to enter values per fund via the <em>enter per fund ▸</em> links. You can still type bucket totals directly.</div>'};window.fillDecisionFromTaggedFunds=async function(){let t=Bt("ds").filter(r=>r.ticker&&r.value>0);if(t.length||(t=Bt("ss").filter(r=>r.ticker&&r.value>0)),!t.length)try{t=((await Nt()).taggedFunds||[]).filter(s=>s.ticker&&s.value>0)}catch{}if(!t.length){showToast('No tagged funds yet — tag your holdings in Settings → "Build from my funds", then come back.',"info",6e3);return}const e=Du(t),n=(r,s)=>{const o=document.getElementById(r);o&&(o.value=Math.round(s))};n("entryEquity",e.buckets.shares),n("entryBond",e.buckets.bonds),n("entryCash",e.buckets.cash),n("entryDiversifier",e.buckets.diversifiers),e.isaTotal&&n("entryIsa",e.isaTotal);const i=document.getElementById("entryFundTagHelp");i&&(i.innerHTML=mA(e)),showToast("Filled your fund values from "+t.length+" tagged funds","success")};function hy(t,e){const n=(t.equityMin||0)+(t.bondMin||0)+(t.cashTarget||0),i=n>0?ly(t.equityMin/n,t.bondMin/n,t.cashTarget/n):"balanced",r=$n[i],s=l=>"£"+Math.round(l||0).toLocaleString(),o=Math.round(r.equity*100)+"/"+Math.round(r.bond*100)+"/"+Math.round(r.cash*100);return`<div class="rpt-header">
        <h1>Pension Decision Plan</h1>
        <div class="rpt-sub">${e||""}</div>
        <table class="rpt-meta"><tbody>
          <tr><td>Total pot</td><td>${s(n)}</td><td>Risk level</td><td>${r.label} (${o})</td></tr>
          <tr><td>Bond tent</td><td>${t.equityGlideEnabled?"On — rising-equity glidepath":"Off"}</td><td>Target income</td><td>${s(t.baseSalary)}/yr</td></tr>
          <tr><td>Duration</td><td>${t.duration||35} yrs</td><td>Generated</td><td>${new Date().toLocaleDateString("en-GB")}</td></tr>
        </tbody></table>
      </div>`}function fy(t){let e=document.getElementById("printPortal");e||(e=document.createElement("div"),e.id="printPortal",document.body.appendChild(e)),e.innerHTML=t,document.body.classList.add("printing"),window.print()}window.addEventListener("afterprint",()=>{document.body.classList.remove("printing");const t=document.getElementById("printPortal");t&&(t.innerHTML="")});function gA(t,e,n){const i=new Blob([e],{type:n}),r=URL.createObjectURL(i),s=document.createElement("a");s.href=r,s.download=t,document.body.appendChild(s),s.click(),s.remove(),setTimeout(()=>URL.revokeObjectURL(r),1e3)}window.printAnnualReport=async function(t){const e=await Et();fy(hy(e,"Annual report — tax year "+t)+document.getElementById("taxYearDetail").innerHTML)};window.printMonthlyReport=async function(t){const e=await Et();fy(hy(e,"Monthly record — "+t)+document.getElementById("historyDetail").innerHTML)};window.exportAnnualCsv=function(t){const e=(typeof cn<"u"?cn:[]).filter(o=>o.taxYear===t).sort((o,l)=>(o.date||"").localeCompare(l.date||"")),n=o=>(o=o==null?"":String(o),/[",\n]/.test(o)?'"'+o.replace(/"/g,'""')+'"':o),i=o=>Math.round(o||0);let s=["Date","Draw source","SIPP draw","ISA draw","From equity","From bond","From cash","Protection","Equity target","Bond target","Cash target","Total pot","Rebalance"].map(n).join(",")+`
`;for(const o of e)s+=[o.date,o.source,i(o.sipp),i(o.isa),i(o.dEquity),i(o.dBond),i(o.dCash),o.inProtection?"Yes":"No",i(o.adjEquity),i(o.adjBond),i(o.adjCash),i(o.total),o.rebal||""].map(n).join(",")+`
`;e.length||(s+=`(no monthly records saved for this tax year yet)
`),gA("decision-plan-"+t.replace("/","-")+".csv",s,"text/csv;charset=utf-8;")};window.runCompareStrategiesUI=async function(t){const e=document.getElementById("optimiseBtn"+t),n=document.getElementById("optimiseResults"+t);e&&(e.disabled=!0,e.textContent="Comparing..."),n&&(n.innerHTML='<div class="loading"><div class="spinner"></div>Running six strategies…</div>');const i=JSON.parse(JSON.stringify(await Nt())),r=document.getElementById(t==="MC"?"mcYears":"histYears"),s=parseInt(r&&r.value)||i.duration,o=(i.equityMin||0)+(i.bondMin||0)+(i.cashTarget||0),l=Object.keys(Wi).map(Number).sort((p,w)=>p-w),c=Math.max(...l),u=p=>{const w=[];if(t==="MC")for(let P=0;P<1e3;P++)w.push(Cr(p,ku(p,P),P));else l.forEach(P=>{if(P+s-1>c)return;const L={equity:{},inflation:{}};for(let N=0;N<s;N++)L.equity[N]=Wi[P+N]||0,L.inflation[N]=ma[P+N]||.025;w.push(Cr(p,L,P))});const I=w.length||1,S=w.reduce((P,L)=>P+Math.min(1,(L.years||0)/(L.duration||s)),0)/I*100,A=w.filter(P=>!P.failed).length/I*100,C=w.reduce((P,L)=>Math.min(P,L.years||0),1/0);return{coverage:S,rate:A,minYears:C===1/0?0:C}},f=["cautious","balanced","adventurous"],m={};for(const p of f){const w=$n[p];m[p]={};for(const I of[!1,!0]){const S={...i,equityMin:Math.round(o*w.equity),bondMin:Math.round(o*w.bond),cashTarget:Math.round(o*w.cash),equityGlideEnabled:I},A=ao({years:s},S);m[p][I?"tent":"flat"]=u(A),await new Promise(C=>setTimeout(C,0))}}yA(n,m,f),e&&(e.disabled=!1,e.textContent="Compare strategies")};function yA(t,e,n){let i={cov:-1,key:null,tent:null};for(const o of n)for(const l of["flat","tent"])e[o][l].coverage>i.cov&&(i={cov:e[o][l].coverage,key:o,tent:l});const r=(o,l)=>`<td style="text-align:center;padding:10px;border:1px solid var(--border);${l?"background:rgba(16,185,129,0.12);":""}">
          <div style="font-size:22px;font-weight:700;color:var(--${l?"success":"text"});">${o.coverage.toFixed(0)}%</div>
          <div style="font-size:11px;color:var(--text-muted);">worst case ${o.minYears.toFixed(0)} yrs</div>
        </td>`;let s='<h3 style="margin-bottom:6px;">Compare strategies</h3>';s+=`<p style="color:var(--text-muted);font-size:13px;margin-bottom:12px;">Coverage = the share of your retirement years the pot funds (worst case = the fewest years it lasted in any run). More shares usually buys a little more coverage but a rougher ride; the bond tent mainly lifts the worst case. Pick the risk level you're comfortable holding — the tool won't change it for you.</p>`,s+='<table style="border-collapse:collapse;width:100%;max-width:520px;"><thead><tr><th style="text-align:left;padding:8px;"></th><th style="padding:8px;">Flat</th><th style="padding:8px;">+ Bond tent</th></tr></thead><tbody>';for(const o of n){const l=$n[o];s+=`<tr><td style="padding:8px;border:1px solid var(--border);"><strong>${l.label}</strong><br><span style="font-size:11px;color:var(--text-muted);">${Math.round(l.equity*100)}/${Math.round(l.bond*100)}/${Math.round(l.cash*100)}</span></td>`,s+=r(e[o].flat,i.key===o&&i.tent==="flat"),s+=r(e[o].tent,i.key===o&&i.tent==="tent"),s+="</tr>"}s+="</tbody></table>",s+=`<p style="margin-top:12px;font-size:13px;">Best coverage: <strong>${$n[i.key].label}${i.tent==="tent"?" + bond tent":""}</strong> at ${i.cov.toFixed(0)}%. Set it in Settings if you'd like it.</p>`,t&&(t.innerHTML=s)}const br={ss:"mo",ds:"mo"};window.netSpendChanged=function(t,e){const n=+e||0,i=br[t]==="mo"?n*12:n;document.getElementById(t+"BaseSalary").value=Math.round(Va(i)),py(t)};window.toggleNetPeriod=function(t){br[t]=br[t]==="mo"?"yr":"mo",document.getElementById(t+"NetPeriodBtn").textContent="/"+br[t],syncNetFromGross(t)};window.syncNetFromGross=function(t){const e=+document.getElementById(t+"BaseSalary").value||0,n=Nn(e,$o.pa,$o.brl,$o.hrl),i=document.getElementById(t+"NetSpend");i&&(i.value=e?Math.round(br[t]==="mo"?n/12:n):""),py(t),vA(t)};function py(t){const e=Math.round(+document.getElementById(t+"BaseSalary").value||0),n=document.getElementById(t+"NetGrossNote");n&&(n.textContent=e?"≈ "+Ie(e)+"/yr before tax — withdrawals are sized to cover the tax":"")}async function vA(t){const e=document.getElementById(t+"BudgetChipRow"),n=document.getElementById(t+"BudgetChip");if(!(!e||!n)){try{const i=window._budget||cc(await Ru()),r=Vr(i);if(r.allInComfortableMonthly>0){n.textContent="From your budget: "+Ie(r.allInComfortableMonthly)+"/mo — use",n.dataset.monthly=Math.round(r.allInComfortableMonthly),e.style.display="block";return}}catch{}e.style.display="none"}}window.useBudgetSpend=function(t){const e=document.getElementById(t+"BudgetChip"),n=+(e&&e.dataset.monthly||0);n&&(br[t]="mo",document.getElementById(t+"NetPeriodBtn").textContent="/mo",document.getElementById(t+"NetSpend").value=n,netSpendChanged(t,n))};async function Qa(){At("Loading settings...");try{const t=await Nt();document.getElementById("ssBaseSalary").value=t.baseSalary,syncNetFromGross("ss"),writeAlloc("ss",t.equityMin,t.bondMin,t.cashTarget,t.diversifierStart||0),restoreCustomAllocFromSettings("ss",t),window._taggedFunds.ss=(t.taggedFunds||[]).map(n=>({...n})),setAllocMode("ss",t.allocMode||(t.taggedFunds&&t.taggedFunds.length?"funds":"risk")),document.getElementById("ssDuration").value=t.duration,document.getElementById("ssPA").value=t.pa,document.getElementById("ssBRL").value=t.brl,document.getElementById("ssHRL").value=t.hrl,document.getElementById("ssTaxMode").value=t.taxMode||"inflates",document.getElementById("ssOther").value=t.other||0,document.getElementById("ssSpStartDate").value=t.spStartDate||"",document.getElementById("ssSpWeeklyAmount").value=t.spWeeklyAmount||"",nc("ss"),document.getElementById("ssConsecutiveLimit").value=t.consecutiveLimit||3,document.getElementById("ssProtectionMult").value=t.protectionMult||.8,document.getElementById("ssDisableProtection").checked=t.disableProtection||!1,document.getElementById("ssHodlEnabled").checked=t.hodlEnabled||!1,document.getElementById("ssHodlValue").value=t.hodlValue||25e3,document.getElementById("ssSpendingProfile").value=t.spendingProfile||"flat",document.getElementById("ssEquityGlide").checked=t.equityGlideEnabled||!1,updateAllocDisplay("ss"),document.getElementById("ssIsaBalance").value=t.isaBalance||0;const e=document.getElementById("ssSeedNote");e&&(e.textContent=t.seededFrom==="decision"&&t.seededAt?"Seeded from Decision Tool "+new Date(t.seededAt).toLocaleDateString():""),ja()}catch(t){console.error("Error loading stress settings:",t)}finally{kt()}}window.saveStressSettingsUI=async function(){if(!dt()){showToast("Please sign in to save settings","error");return}const t=Ga(document.getElementById("ssSpStartDate").value.trim());if(!t.valid){showToast(t.error,"error");return}t.warning&&showToast(t.warning,"warning");const e=readAlloc("ss");if(Uu(e.equityMin,e.bondMin,e.cashTarget)){At("Saving settings...");try{await oo({configured:!0,baseSalary:+document.getElementById("ssBaseSalary").value,equityMin:e.equityMin,bondMin:e.bondMin,cashTarget:e.cashTarget,duration:+document.getElementById("ssDuration").value,pa:+document.getElementById("ssPA").value,brl:+document.getElementById("ssBRL").value,hrl:+document.getElementById("ssHRL").value,taxMode:document.getElementById("ssTaxMode").value,other:+document.getElementById("ssOther").value,spStartDate:document.getElementById("ssSpStartDate").value.trim()||null,spWeeklyAmount:+document.getElementById("ssSpWeeklyAmount").value||0,consecutiveLimit:+document.getElementById("ssConsecutiveLimit").value,protectionMult:+document.getElementById("ssProtectionMult").value,disableProtection:document.getElementById("ssDisableProtection").checked,hodlEnabled:document.getElementById("ssHodlEnabled").checked,hodlValue:+document.getElementById("ssHodlValue").value,isaBalance:+document.getElementById("ssIsaBalance").value||0,spendingProfile:document.getElementById("ssSpendingProfile").value,equityGlideEnabled:document.getElementById("ssEquityGlide").checked,diversifierStart:e.diversifierStart||0,subAsset:e.subAsset||null,glideEndgame:e.glideEndgame||null,allocMode:Hu("ss"),taggedFunds:Bt("ss").filter(n=>n.ticker&&n.value>0)}),qu({...e,duration:+document.getElementById("ssDuration").value||35}),$u(),showToast("Settings saved successfully","success")}catch(n){console.error("Error saving stress settings:",n),showToast("Error saving: "+n.message,"error")}finally{kt()}}};window.copyStressFromDecisionUI=async function(){if(!dt()){showToast("Please sign in first","error");return}if(confirm("Copy your Decision Tool plan basics (funds, income, State Pension, ISA, protection) into the Stress Tester? Your Stress-specific what-ifs (tax mode, HODL) are kept.")){At("Copying from Decision...");try{const t=await Et(),e=await Nt(),n=DI(t,e);await oo(n),await Qa(),showToast("Stress Tester seeded from your Decision plan","success")}catch(t){console.error("Error copying from decision:",t),showToast("Error copying: "+t.message,"error")}finally{kt()}}};window.resetStressSettingsUI=async function(){if(confirm("Reset all stress settings to defaults?")){At("Resetting settings...");try{await US(),await Qa(),showToast("Settings reset to defaults","success")}catch(t){console.error("Error resetting settings:",t),showToast("Error resetting: "+t.message,"error")}finally{kt()}}};async function Gu(){At("Loading settings...");try{const t=await Et();document.getElementById("dsDuration").value=t.duration||35,writeAlloc("ds",t.equityMin??25e4,t.bondMin??2e5,t.cashTarget??5e4,t.diversifierStart||0),restoreCustomAllocFromSettings("ds",t),window._taggedFunds.ds=(t.taggedFunds||[]).map(e=>({...e})),setAllocMode("ds",t.allocMode||(t.taggedFunds&&t.taggedFunds.length?"funds":"risk")),document.getElementById("dsEquityGlide").checked=t.equityGlideEnabled||!1,updateAllocDisplay("ds"),document.getElementById("dsBaseSalary").value=t.baseSalary||3e4,syncNetFromGross("ds"),document.getElementById("dsSpendingProfile").value=t.spendingProfile||"flat",document.getElementById("dsProtectionFactor").value=t.protectionFactor||20,document.getElementById("dsRecoveryBuffer").value=t.recoveryBuffer||15e3,document.getElementById("dsConsecutiveLimit").value=t.consecutiveLimit||3,document.getElementById("dsIsaBalance").value=t.isaBalance||0,document.getElementById("entryEquity").value="",document.getElementById("entryBond").value="",document.getElementById("entryCash").value="",document.getElementById("entryIsa").value="",ja(),await Zu()}catch(t){console.error("Error loading decision settings:",t)}finally{kt()}}let bA=0;const Ct=()=>"b"+ ++bA,Ie=t=>"£"+Math.round(+t||0).toLocaleString(),Ce=t=>String(t??"").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;");function cc(t){const e={...Ds(),...t||{}};return e.lines=(Array.isArray(e.lines)?e.lines:[]).map(n=>({id:n.id||Ct(),...n})),e.oneOffs=(Array.isArray(e.oneOffs)?e.oneOffs:[]).map(n=>({id:n.id||Ct(),...n})),e}async function wA(){uc=!1;try{window._budget=cc(await Ru())}catch(e){console.error("Budget load error:",e),window._budget=cc(Ds())}window._budget.lines.length||(window._budget.lines=ig().map(e=>({id:Ct(),...e})),window._budget.oneOffs.length||(window._budget.oneOffs=rg().map(e=>({id:Ct(),...e})))),document.getElementById("budCurrentAge").value=window._budget.currentAge,document.getElementById("budRetireAge").value=window._budget.retirementAge,document.getElementById("budEndAge").value=window._budget.endAge,document.getElementById("budShared").checked=!!window._budget.sharedWithPartner,document.getElementById("budSharePct").value=window._budget.mySharePct??50,document.getElementById("budShareRow").style.display=window._budget.sharedWithPartner?"block":"none",Rt(),wn(),Le(),my();const t=!window._budget.lines.some(e=>e.annual)&&!window._budget.oneOffs.some(e=>e.amount);document.getElementById("budWizBanner").style.display=t?"block":"none",uc=!0,Hi("Autosaves as you edit"),window._budWizAutoOpen&&(window._budWizAutoOpen=!1,openBudgetWizard())}function my(){const t=ro(window._budget);document.querySelectorAll("#budTierBtns [data-tier], #budWizTierBtns [data-tier]").forEach(e=>{e.classList.toggle("active",e.dataset.tier===t)})}window.setPlsaTier=function(t){window._budget.plsaTier=t,my(),document.getElementById("budWizardOverlay").style.display!=="none"&&ht(!0);const n=window.scrollY;Rt(),wn(),Le(),window.scrollTo(0,n)};function Ja(t,e){const n=t.paidBy||"me",i=(o,l)=>'<option value="'+o+'"'+(n===o?" selected":"")+">"+l+"</option>",r=window._budget.mySharePct??50,s=n==="shared"?'<input type="number" min="0" max="100" placeholder="'+r+'%" title="Your % of this shared cost (blank = the overall split)" value="'+(t.mySharePct??"")+'" oninput="'+e+"('"+t.id+`','mySharePct',this.value)" style="flex:0 0 62px;">`:"";return'<select title="Who pays this?" onchange="'+e+"('"+t.id+`','paidBy',this.value)" style="flex:0 0 96px;">`+i("me","Me")+i("partner","Partner")+i("shared","Shared")+"</select>"+s}window.onBudgetSharedToggle=function(){window._budget.sharedWithPartner=document.getElementById("budShared").checked,document.getElementById("budShareRow").style.display=window._budget.sharedWithPartner?"block":"none",Rt(),wn(),Le()};window.onBudgetSharePctChange=function(){window._budget.mySharePct=+document.getElementById("budSharePct").value||0,Le()};function Ef(t){const e=t.hint?'<div style="font-size:11px;color:var(--text-muted);margin-top:2px;line-height:1.3;">'+Ce(t.hint)+"</div>":"",n=t.period||"yr",i=t.annual==null?"":n==="mo"?Math.round(t.annual/12):t.annual,r=Fr(t.label,window._budget),s=r!=null?"≈"+(n==="mo"?r:r*12):"Amount",o=window._budget.sharedWithPartner?`<button type="button" class="risk-btn" style="padding:4px 8px;" title="Add a copy for your partner (e.g. their car)" onclick="duplicateBudgetLine('`+t.id+`')">⧉</button>`:"";return'<div class="bud-row" data-id="'+t.id+'" style="display:flex; gap:8px; flex-wrap:wrap; align-items:flex-start; margin-bottom:10px;"><div style="flex:1 1 200px; min-width:170px;"><input type="text" placeholder="Category" value="'+Ce(t.label)+`" oninput="updateBudgetLine('`+t.id+`','label',this.value)" style="width:100%;">`+e+'</div><div style="display:flex; gap:4px; flex:0 0 186px; align-items:center;"><input type="text" inputmode="decimal" id="bm-amt-'+t.id+'" placeholder="'+s+`" title="Amount in today's money — sums welcome: 11.99+8.99 or =4×52/12`+(r!=null?" (typical shown)":"")+'" value="'+i+`" onchange="updateBudgetAmount('`+t.id+`',this.value,this)" style="flex:1 1 auto; min-width:0;"><button type="button" class="risk-btn" style="padding:4px 8px; flex:0 0 auto;" title="Switch monthly / yearly" onclick="toggleBudgetPeriod('`+t.id+`')">`+(n==="mo"?"/mo":"/yr")+'</button><button type="button" class="risk-btn'+(t.breakdownOpen?" active":"")+`" style="padding:4px 8px; flex:0 0 auto;" title="Break it down into parts (saved with your budget)" onclick="budBreakToggle('bm','`+t.id+`')">&Sigma;</button></div>`+(window._budget.sharedWithPartner?Ja(t,"updateBudgetLine"):"")+'<input type="number" placeholder="from age" title="From age (blank = retirement). For temporary costs — e.g. a car lease with 3 years left — set when it starts and stops." value="'+(t.fromAge??"")+`" oninput="updateBudgetLine('`+t.id+`','fromAge',this.value)" style="flex:0 0 84px;"><input type="number" placeholder="to age" title="To age (blank = end of plan)" value="`+(t.toAge??"")+`" oninput="updateBudgetLine('`+t.id+`','toAge',this.value)" style="flex:0 0 84px;">`+o+`<button type="button" class="risk-btn" style="padding:4px 10px;" title="Remove" onclick="removeBudgetLine('`+t.id+`')">&times;</button>`+(t.breakdownOpen?'<div style="flex-basis:100%;">'+yy("bm",t)+"</div>":"")+"</div>"}function Rt(){const t=window._budget.lines.filter(n=>n.tier==="essential"),e=window._budget.lines.filter(n=>n.tier==="discretionary");document.getElementById("budEssentialRows").innerHTML=t.map(Ef).join("")||'<p style="font-size:12px;color:var(--text-muted);margin:0 0 8px;">No essentials yet — add housing, bills, food, transport…</p>',document.getElementById("budDiscretionaryRows").innerHTML=e.map(Ef).join("")||'<p style="font-size:12px;color:var(--text-muted);margin:0 0 8px;">No lifestyle spending yet — holidays, hobbies, eating out…</p>',Yu()}function _A(t){const e=t.hint?'<div style="font-size:11px;color:var(--text-muted);margin-top:2px;line-height:1.3;">'+Ce(t.hint)+"</div>":"";return'<div class="bud-row" data-id="'+t.id+'" style="display:flex; gap:8px; flex-wrap:wrap; align-items:flex-start; margin-bottom:10px;"><div style="flex:1 1 170px; min-width:150px;"><input type="text" placeholder="e.g. Car" value="'+Ce(t.label)+`" oninput="updateBudgetOneOff('`+t.id+`','label',this.value)" style="width:100%;">`+e+`</div><input type="number" placeholder="£ amount" title="Total cost in today's money" value="`+(t.amount??"")+`" oninput="updateBudgetOneOff('`+t.id+`','amount',this.value)" style="flex:0 0 120px;">`+(window._budget.sharedWithPartner?Ja(t,"updateBudgetOneOff"):"")+'<input type="number" placeholder="at age" value="'+(t.atAge??"")+`" oninput="updateBudgetOneOff('`+t.id+`','atAge',this.value)" style="flex:0 0 84px;"><input type="number" placeholder="every N yrs" title="Leave blank for a one-time cost" value="`+(t.everyYears??"")+`" oninput="updateBudgetOneOff('`+t.id+`','everyYears',this.value)" style="flex:0 0 110px;">`+(window._budget.sharedWithPartner?`<button type="button" class="risk-btn" style="padding:4px 8px;" title="Add a copy for your partner" onclick="duplicateBudgetOneOff('`+t.id+`')">⧉</button>`:"")+`<button type="button" class="risk-btn" style="padding:4px 10px;" title="Remove" onclick="removeBudgetOneOff('`+t.id+`')">&times;</button></div>`}function wn(){document.getElementById("budOneOffRows").innerHTML=window._budget.oneOffs.map(_A).join("")||'<p style="font-size:12px;color:var(--text-muted);margin:0 0 8px;">No one-off costs yet — a car every ~8 years, a new roof, a milestone trip…</p>'}function Yu(){const t=Ms(window._budget),e=document.getElementById("budSuggestionsSection"),n=document.getElementById("budSuggestions");if(!t.length){e.style.display="none",n.innerHTML="";return}e.style.display="block",n.innerHTML=t.map(i=>'<button type="button" class="risk-btn" style="padding:5px 10px;" title="'+Ce(i.hint||"")+`" onclick="addBudgetSuggestion('`+Ce(i.label).replace(/'/g,"\\'")+`')">+ `+Ce(i.label)+"</button>").join("")}window.addBudgetSuggestion=function(t){const e=Ms(window._budget).find(n=>n.label===t);e&&(window._budget.lines.push({id:Ct(),label:e.label,tier:e.tier,annual:null,fromAge:null,toAge:null,hint:e.hint||"",period:e.period||"yr",paidBy:e.paidBy||"me"}),Rt(),Yu(),Le())};function ju(){window._budget.currentAge=+document.getElementById("budCurrentAge").value||0,window._budget.retirementAge=+document.getElementById("budRetireAge").value||0,window._budget.endAge=+document.getElementById("budEndAge").value||100}window.onBudgetHorizonChange=function(){ju(),Le()};window.updateBudgetLine=function(t,e,n){const i=window._budget.lines.find(r=>r.id===t);i&&(e==="label"||e==="paidBy"?i[e]=n:e==="fromAge"||e==="toAge"?i[e]=n===""?null:Za(n):i[e]=n===""?null:+n,e==="label"&&Yu(),e==="paidBy"&&Rt(),Le())};window.updateBudgetAmount=function(t,e,n){const i=window._budget.lines.find(s=>s.id===t);if(!i)return;const r=String(e).trim();if(r==="")i.annual=null;else{const s=za(r);if(s==null)return;i.annual=(i.period||"yr")==="mo"?s*12:s,n&&(n.value=s)}budTouch(),Le()};window.toggleBudgetPeriod=function(t){const e=window._budget.lines.find(i=>i.id===t);if(!e)return;e.period=(e.period||"yr")==="mo"?"yr":"mo",budTouch();const n=window.scrollY;Rt(),Le(),window.scrollTo(0,n)};window.updateBudgetOneOff=function(t,e,n){const i=window._budget.oneOffs.find(r=>r.id===t);i&&(e==="label"||e==="paidBy"?i[e]=n:e==="atAge"?i[e]=n===""?null:Za(n):i[e]=n===""?null:+n,e==="paidBy"&&wn(),Le())};window.addBudgetLine=function(t){window._budget.lines.push({id:Ct(),label:"",tier:t,annual:null,fromAge:null,toAge:null}),Rt(),Le()};window.addBudgetOneOff=function(){window._budget.oneOffs.push({id:Ct(),label:"",tier:"essential",amount:null,atAge:null,everyYears:null}),wn(),Le()};window.removeBudgetLine=function(t){const e=window._budget.lines.findIndex(n=>n.id===t);e<0||(Xa("line",window._budget.lines[e],e),window._budget.lines.splice(e,1),Rt(),Le())};window.removeBudgetOneOff=function(t){const e=window._budget.oneOffs.findIndex(n=>n.id===t);e<0||(Xa("oneOff",window._budget.oneOffs[e],e),window._budget.oneOffs.splice(e,1),wn(),Le())};window.duplicateBudgetLine=function(t){const e=window._budget.lines,n=e.find(r=>r.id===t);if(!n)return;const i={...n,id:Ct(),label:(n.label||"Item")+" (partner)",paidBy:"partner"};e.splice(e.indexOf(n)+1,0,i),Rt(),Le()};window.duplicateBudgetOneOff=function(t){const e=window._budget.oneOffs,n=e.find(r=>r.id===t);if(!n)return;const i={...n,id:Ct(),label:(n.label||"Item")+" (partner)",paidBy:"partner"};e.splice(e.indexOf(n)+1,0,i),wn(),Le()};window.fillTypicalAmounts=function(){let t=0;for(const e of window._budget.lines)if(e.annual==null||e.annual===""){const n=Fr(e.label,window._budget);n!=null&&(e.annual=n*12,t++)}Rt(),Le(),showToast(t?"Filled "+t+" blank categories with "+tg[ro(window._budget)]+" figures — adjust freely":"No blank categories with a typical figure",t?"success":"info")};function Le(){budTouch(),ju();const t=window._budget,e=t.retirementAge,n=Zl(t,e,"essential"),i=Zl(t,e,"all");document.getElementById("budEssentialSubtotal").textContent=Ie(n),document.getElementById("budDiscretionarySubtotal").textContent=Ie(i-n);const r=Vr(t),s=A=>Ie(A),o=t.oneOffs.filter(A=>(+A.everyYears||0)>0&&(+A.amount||0)>0),l=t.oneOffs.filter(A=>!((+A.everyYears||0)>0)&&(+A.amount||0)>0),c=eg.single,u=r.allInComfortableAnnual,f=u>=c.comfortable?"at/above Comfortable":u>=c.moderate?"between Moderate and Comfortable":u>=c.minimum?"between Minimum and Moderate":"below the Minimum",m=r.sharedWithPartner;let p="";if(p+='<div style="display:flex; gap:22px; flex-wrap:wrap; margin-bottom:14px;">',p+='<div><div style="font-size:12px;color:var(--text-muted);">Essential (floor)'+(m?" — your share":"")+'</div><div style="font-size:22px;font-weight:700;">'+s(r.essentialMonthlyNet)+'<span style="font-size:13px;font-weight:400;color:var(--text-muted);">/mo</span></div></div>',p+='<div><div style="font-size:12px;color:var(--text-muted);">'+(m?"Your share (all-in)":"All-in comfortable")+'</div><div style="font-size:26px;font-weight:800;color:var(--primary,#6366f1);">'+s(r.allInComfortableMonthly)+'<span style="font-size:13px;font-weight:400;color:var(--text-muted);">/mo</span></div><div style="font-size:12px;color:var(--text-muted);">'+s(u)+"/yr — what your plan funds</div></div>",m&&(p+='<div><div style="font-size:12px;color:var(--text-muted);">Partner’s share</div><div style="font-size:22px;font-weight:700;">'+s(r.partnerAllInMonthly)+'<span style="font-size:13px;font-weight:400;color:var(--text-muted);">/mo</span></div><div style="font-size:12px;color:var(--text-muted);">'+s(r.partnerAllInAnnual)+"/yr — their side of this budget</div></div>",p+='<div><div style="font-size:12px;color:var(--text-muted);">Household all-in</div><div style="font-size:22px;font-weight:700;">'+s(r.householdComfortableMonthly)+'<span style="font-size:13px;font-weight:400;color:var(--text-muted);">/mo</span></div><div style="font-size:12px;color:var(--text-muted);">everything, both of you</div></div>'),p+="</div>",m&&r.partnerAllInAnnual>0&&(p+='<div class="alert alert-info" style="margin-bottom:12px;">Your partner’s share is <strong>'+s(r.partnerAllInMonthly)+"/mo</strong> ("+s(r.partnerAllInAnnual)+'/yr). They can create their own free plan and use that as <em>their</em> target income. <span style="color:var(--text-muted);">Note: this plan only funds <em>your</em> share — it doesn’t check your partner can fund theirs.</span></div>'),p+='<div style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">= comfortable recurring <strong style="color:var(--text);">'+s(r.comfortableMonthlyNet)+"/mo</strong>"+(r.periodicMonthlyAverage>0?' + periodic set-aside <strong style="color:var(--text);">'+s(r.periodicMonthlyAverage)+"/mo</strong> <span>(averaged from the big periodic costs below)</span>":"")+".</div>",p+='<div class="alert alert-info" style="margin-bottom:12px;"><strong>vs PLSA (single, 2024):</strong> Minimum '+s(c.minimum)+" · Moderate "+s(c.moderate)+" · Comfortable "+s(c.comfortable)+" per year. Your all-in spend is <strong>"+f+'</strong>. <span style="color:var(--text-muted);">(Assumes home owned outright; excludes care costs.)</span></div>',o.length){p+='<div style="font-size:13px;margin-bottom:8px;"><strong>Periodic costs</strong> (averaged into the monthly need, but the cash lands lumpily):<ul style="margin:6px 0 0; padding-left:18px;">';for(const A of o){const C=+A.amount/+A.everyYears;p+="<li>"+Ce(A.label||"item")+": "+s(A.amount)+" every "+ +A.everyYears+" yrs ≈ <strong>"+s(C)+"/yr</strong> ("+s(C/12)+"/mo)</li>"}p+="</ul></div>"}if(l.length){p+='<div style="font-size:13px;margin-bottom:12px;"><strong>One-time costs</strong> (not in the monthly average — planned for the year they fall):<ul style="margin:6px 0 0; padding-left:18px;">';for(const A of l)p+="<li>"+Ce(A.label||"item")+": "+s(A.amount)+(A.atAge?" at age "+ +A.atAge:"")+"</li>";p+="</ul></div>"}const w=+window._budget.targetHeadroomMonthly||0,I=r.allInComfortableMonthly+w,S=Va(r.allInComfortableAnnual+w*12);p+='<div style="border-top:1px solid var(--border); padding-top:12px;">',p+='<div style="font-size:13px; margin-bottom:8px;">Your all-in take-home of <strong>'+s(r.allInComfortableMonthly)+"/mo</strong> becomes the <strong>target both tools work to</strong>: the Stress Tester asks “will my pots deliver this for life?” and the Decision Tool works out each month’s withdrawal to hit it tax-efficiently.</div>",p+='<div style="font-size:13px; margin-bottom:10px; display:flex; align-items:center; gap:6px; flex-wrap:wrap;">Optional headroom on top: £<input type="number" min="0" value="'+(window._budget.targetHeadroomMonthly??"")+'" placeholder="0" onchange="budHeadroomChanged(this.value)" style="width:90px;">/mo <span style="color:var(--text-muted);">— breathing room above the budget, so the plan isn’t cut to the bone.</span></div>',p+='<div style="font-size:13px; margin-bottom:8px;">Plan target: <strong>'+s(I)+'/mo take-home</strong> <span style="color:var(--text-muted);">(≈ '+s(S)+"/yr before tax"+(w?" — budget + "+s(w)+"/mo headroom":"")+")</span></div>",p+='<button type="button" onclick="applyBudgetToPlan()">Set as my plan’s target (Stress + Decision)</button>',p+="</div>",document.getElementById("budSummary").innerHTML=p}let _s=[];window.loadFundSuggestionsUI=async function(){const t=document.getElementById("budAdminSuggestions");if(t){t.textContent="Loading…";try{if(_s=await yx(),!_s.length){t.textContent="No pending suggestions.";return}t.innerHTML=_s.map(e=>"<div>"+Ce(e.ticker)+" → "+Ce(e.subClass||"(none)")+(e.name?' <span style="color:var(--text-muted);">'+Ce(e.name)+"</span>":"")+"</div>").join("")}catch(e){t.textContent="Could not load: "+e.message}}};window.copyFundSuggestionsUI=async function(){_s.length||await loadFundSuggestionsUI();try{await navigator.clipboard.writeText(JSON.stringify(_s,null,2)),showToast("Suggestions copied to clipboard","success")}catch(t){showToast("Copy failed: "+t.message,"error")}};let uc=!1,zs=null;function Hi(t){if(zn)return;const e=document.getElementById("budSaveStatus");e&&(e.textContent=t)}let zn=null,dc=null;function Xa(t,e,n){zn={kind:t,item:e,index:n},clearTimeout(dc),dc=setTimeout(()=>{zn=null,hc()},12e3),hc()}function hc(){const t=zn?zn.item.label||"item":null,e=zn?"Removed “"+Ce(t)+'” — <button type="button" class="budwiz-chip" onclick="budUndoRemove()">Undo</button>':null,n=document.getElementById("budSaveStatus");n&&e?n.innerHTML=e:n&&!e&&Hi("Saved ✓");const i=document.getElementById("budWizUndoSlot");i&&(i.innerHTML=e||"")}window.budUndoRemove=function(){if(!zn)return;const{kind:t,item:e,index:n}=zn;zn=null,clearTimeout(dc);const i=t==="line"?window._budget.lines:window._budget.oneOffs;if(i.splice(Math.min(n,i.length),0,e),budTouch(),document.getElementById("budWizardOverlay").style.display!=="none")ht(!0);else{const s=window.scrollY;Rt(),wn(),Le(),window.scrollTo(0,s)}hc()};window.budTouch=function(){!uc||!window._budget||(Hi("Saving…"),clearTimeout(zs),zs=setTimeout(Ku,1200))};function gy(){return{...window._budget,lines:window._budget.lines.filter(t=>t.label&&t.label.trim()||t.annual||t.breakdown&&t.breakdown.some(e=>e.label&&e.label.trim()||e.amount)),oneOffs:window._budget.oneOffs.filter(t=>t.label&&t.label.trim()||t.amount)}}async function Ku(){if(!dt()){Hi("Sign in to save");return}try{await Pu(gy()),Hi("Saved ✓")}catch(t){console.error("Budget autosave error:",t),Hi("Not saved — retrying…"),clearTimeout(zs),zs=setTimeout(Ku,4e3)}}window.resetBudgetUI=async function(){confirm(`Reset the budget?

All amounts, sub-sheets and custom lines go back to a fresh start. Your ages and partner-sharing setting are kept.

This saves immediately and cannot be undone.`)&&(window._budget.lines=ig().map(t=>({id:Ct(),...t})),window._budget.oneOffs=rg().map(t=>({id:Ct(),...t})),Rt(),wn(),Le(),await Ku(),showToast("Budget reset to a fresh start","success"))};window.saveBudgetUI=async function(){if(!dt()){showToast("Please sign in to save your budget","error");return}ju(),At("Saving budget…");try{clearTimeout(zs),await Pu(gy()),Hi("Saved ✓"),showToast("Budget saved","success")}catch(t){console.error("Budget save error:",t),showToast("Error saving budget: "+t.message,"error")}finally{kt()}};window.budHeadroomChanged=function(t){window._budget.targetHeadroomMonthly=t===""?null:Math.max(0,+t||0),Le()};window.applyBudgetToPlan=async function(){const t=Vr(window._budget),e=+window._budget.targetHeadroomMonthly||0,n=Math.round(Va(t.allInComfortableAnnual+e*12));if(!n){showToast("Add some spending first","warning");return}At("Applying to plan…");try{await oo({baseSalary:n});const i=await uo();i||await so({baseSalary:n});const r=document.getElementById("ssBaseSalary");r&&(r.value=n,syncNetFromGross("ss"));const s=document.getElementById("dsBaseSalary");s&&!i&&(s.value=n,syncNetFromGross("ds")),showToast("Target set: both tools now work to "+Ie(t.allInComfortableMonthly+e)+"/mo take-home"+(e?" (incl. "+Ie(e)+"/mo headroom)":"")+" — "+Ie(n)+"/yr gross"+(i?". Stress only; the Decision plan is locked":""),"success",5e3)}catch(i){console.error("Apply-to-plan error:",i),showToast("Could not apply: "+i.message,"error")}finally{kt()}};const co=[{key:"home",title:"Home & bills",tier:"essential",tip:"Will your mortgage still exist at retirement? If it ends earlier, use the ⏱ button on its row to set the age it stops. Bills mostly carry on — but you'll be home more, so heating often rises.",labels:["Rent / mortgage","Council tax","Gas","Electricity","Water","Broadband","Mobile phones","TV licence","Home insurance","Boiler service","Home upkeep","Premier banking / account fees","Cleaner / gardener","Second / holiday home","Storage / lock-up"]},{key:"food",title:"Food, drink & eating out",tier:"essential",tip:"With more free time most retirees eat OUT more, not less. Check 2–3 months of bank statements for what you really spend — real numbers beat guesses.",labels:["Groceries & household","Eating out & takeaways","Alcohol"]},{key:"transport",title:"Transport",tier:"essential",tip:"Commuting disappears at retirement, but running costs are easy to underestimate — servicing, MOT, tyres, repairs. Replacing the car itself goes in One-off costs (a later step).",labels:["Car insurance","Car tax","Petrol / fuel","Car servicing & maintenance","Breakdown cover","Parking & permits","Public transport"]},{key:"health",title:"Health & protection",tier:"essential",tip:"Health spending tends to RISE with age — and the PLSA benchmarks exclude long-term care entirely. A monthly care set-aside is easy to add now and painful to discover missing later.",labels:["Personal health","Health / dental insurance","Dental & optical","Hearing","Life insurance / income protection","Long-term care set-aside"]},{key:"leisure",title:"Holidays, hobbies & leisure",tier:"discretionary",tip:'Most people spend MORE on holidays and hobbies in the early "go-go" years. Budget for the retirement you actually want — the spending smile tapers it in later life.',labels:["Main holiday","UK breaks","Day trips","Streaming & entertainment","Digital subscriptions","Gym & fitness","Sports & equipment","Sports clothes","Hobbies & leisure","Newspapers, books & media"]},{key:"personal",title:"Personal, family & giving",tier:"discretionary",tip:'The easiest category to underestimate: gifts, grandchildren, Christmas. A personal "spends" line per person keeps day-to-day money simple.',labels:["Clothes","Gifts & family","Charity","Pets","Personal spending money","Kids / dependents","Christmas & birthdays","Hairdressing & grooming","Grandchildren","Professional memberships","My personal spending","Partner's personal spending"]},{key:"extras",title:"Around the home & everything else",tier:"discretionary",tip:"Furniture wears out, technology needs refreshing, and a small emergency buffer stops a bad month becoming a plan problem. Anything of yours that didn't fit an earlier screen appears here too.",labels:["Home furnishings & décor","Home technology","Emergency buffer"]}],Qu=(()=>{const t={};for(const e of co)for(const n of e.labels)t[n.toLowerCase()]=e.key;return t})(),hs=["intro",...co.map(t=>t.key),"oneoffs","review"];let Rn=0;function EA(t){return t.wizGroup&&co.some(e=>e.key===t.wizGroup)?t.wizGroup:Qu[(t.label||"").trim().toLowerCase()]||"extras"}window.openBudgetWizard=function(){window._budget&&(Rn=0,document.getElementById("budWizardOverlay").style.display="block",ht())};window.closeBudgetWizard=function(){document.getElementById("budWizardOverlay").style.display="none",Rt(),wn(),Le()};window.budWizGo=function(t){Rn=Math.max(0,Math.min(hs.length-1,Rn+t)),ht()};function TA(t){return t.annual==null?"":(t.period||"yr")==="mo"?Math.round(t.annual/12):t.annual}function IA(t){const e=t.period||"yr",n=Fr(t.label,window._budget),i=tg[ro(window._budget)].replace("PLSA ",""),r=n!=null&&n>0?i+" "+Ie(e==="mo"?n:n*12)+"/"+e:null,o=!!Qu[(t.label||"").trim().toLowerCase()]?'<div style="font-weight:600;">'+Ce(t.label)+"</div>":'<input type="text" placeholder="What is it?" value="'+Ce(t.label)+`" oninput="budWizField('`+t.id+`','label',this.value)" style="width:100%;">`,l=t.hint?'<div class="budwiz-hint">'+Ce(t.hint)+"</div>":"",c=lg(t.label,t.annual,window._budget),u=c?'<div class="budwiz-nudge" id="bw-n-'+t.id+'">'+(c==="low"?"Well below typical ("+Ie(n)+"/mo) — deliberate, or missing something?":"Well above typical ("+Ie(n)+"/mo) — worth double-checking.")+"</div>":'<div class="budwiz-nudge" id="bw-n-'+t.id+'"></div>';return'<div class="budwiz-row" id="bw-row-'+t.id+'"><div class="budwiz-name">'+o+l+'</div><div class="budwiz-amt"><input type="text" inputmode="decimal" id="bw-amt-'+t.id+`" placeholder="£ or e.g. =12+9.50" title="Amount in today's money — sums welcome: 11.99+8.99, =4×52/12" value="`+TA(t)+`" onchange="budWizAmount('`+t.id+`',this.value,this)" style="flex:1 1 auto; min-width:0;"><button type="button" class="risk-btn" style="padding:6px 9px;" title="Switch monthly / yearly" onclick="budWizTogglePeriod('`+t.id+`')">/`+e+'</button><button type="button" class="risk-btn'+(t.breakdownOpen?" active":"")+`" style="padding:6px 9px;" title="Break it down into parts (saved with your budget)" onclick="budBreakToggle('bw','`+t.id+`')">&Sigma;</button></div><div class="budwiz-chipslot">`+(r?`<button type="button" class="budwiz-chip" onclick="budWizUseTypical('`+t.id+`')" title="ONS retired-household average — a starting point">`+r+" — use</button>":"")+"</div>"+(window._budget.sharedWithPartner?Ja(t,"budWizField"):"")+(Wo(t)?'<input type="number" placeholder="from age" title="From age (blank = retirement)" value="'+(t.fromAge??"")+`" oninput="budWizField('`+t.id+`','fromAge',this.value)" style="flex:0 0 78px;"><input type="number" placeholder="to age" title="To age (blank = end of plan). E.g. a car lease with 3 years left: to retirement age + 3." value="`+(t.toAge??"")+`" oninput="budWizField('`+t.id+`','toAge',this.value)" style="flex:0 0 78px;">`:"")+'<button type="button" class="risk-btn'+(Wo(t)?" active":"")+'" style="padding:6px 9px;" title="'+(Wo(t)?"Remove the age limits — make this a whole-of-retirement cost again":"Assumed for the whole retirement. Click to limit it to an age range — for temporary costs like a lease or a mortgage that ends.")+`" onclick="budWizBandToggle('`+t.id+`')">&#x23F1;</button><button type="button" class="risk-btn" style="padding:6px 11px;" title="Remove" onclick="budWizRemove('`+t.id+`')">&times;</button><div id="bw-err-`+t.id+'" class="budwiz-err"></div>'+u+(t.breakdownOpen?'<div style="flex-basis:100%;">'+yy("bw",t)+"</div>":"")+"</div>"}window.budWizField=function(t,e,n){const i=window._budget.lines.find(r=>r.id===t);i&&(e==="label"||e==="paidBy"?i[e]=n:e==="fromAge"||e==="toAge"?i[e]=n===""?null:Za(n):i[e]=n===""?null:+n,e==="paidBy"&&ht(!0),budTouch(),Hr())};window.budWizAmount=function(t,e,n){const i=window._budget.lines.find(o=>o.id===t);if(!i)return;const r=document.getElementById("bw-err-"+t),s=String(e).trim();if(s==="")i.annual=null,r&&(r.textContent="");else{const o=za(s);if(o==null){r&&(r.textContent="Couldn’t read that — a number or a simple sum like 12.99+8.50 works.");return}r&&(r.textContent=""),i.annual=(i.period||"yr")==="mo"?o*12:o,n&&(n.value=(i.period||"yr")==="mo"?Math.round(i.annual/12):i.annual)}fc(i),budTouch(),Hr()};function fc(t){const e=document.getElementById("bw-n-"+t.id);if(!e)return;const n=Fr(t.label,window._budget),i=lg(t.label,t.annual,window._budget);e.textContent=i?i==="low"?"Well below typical ("+Ie(n)+"/mo) — deliberate, or missing something?":"Well above typical ("+Ie(n)+"/mo) — worth double-checking.":""}function Za(t){const e=+t;if(!Number.isFinite(e))return null;if(e>1e3){const n=new Date().getFullYear()-(+window._budget.currentAge||0);return Math.max(0,e-n)}return e}function Wo(t){return t.fromAge!=null||t.toAge!=null||t._bandOpen}window.budWizBandToggle=function(t){const e=window._budget.lines.find(n=>n.id===t);e&&(Wo(e)?(e._bandOpen=!1,e.fromAge=null,e.toAge=null,budTouch()):e._bandOpen=!0,ht(!0))};window.budWizTogglePeriod=function(t){const e=window._budget.lines.find(n=>n.id===t);e&&(e.period=(e.period||"yr")==="mo"?"yr":"mo",budTouch(),ht(!0))};window.budWizUseTypical=function(t){const e=window._budget.lines.find(i=>i.id===t);if(!e)return;const n=Fr(e.label,window._budget);n!=null&&(e.annual=n*12,budTouch(),ht(!0))};window.budWizRemove=function(t){const e=window._budget.lines.findIndex(n=>n.id===t);e<0||(Xa("line",window._budget.lines[e],e),window._budget.lines.splice(e,1),budTouch(),ht(!0))};window.budWizAddLine=function(t){const e=co.find(n=>n.key===t);window._budget.lines.push({id:Ct(),label:"",tier:e&&e.tier||"discretionary",annual:null,fromAge:null,toAge:null,period:"mo",wizGroup:t}),budTouch(),ht(!0)};window.budWizSuggest=function(t,e){const n=Ms(window._budget).find(i=>i.label===t);n&&(window._budget.lines.push({id:Ct(),label:n.label,tier:n.tier,annual:null,fromAge:null,toAge:null,hint:n.hint||"",period:n.period||"yr",paidBy:n.paidBy||"me",wizGroup:e}),budTouch(),ht(!0))};const qr=t=>window._budget.lines.find(e=>e.id===t);function Ju(t){if(t==="bw"){ht(!0);return}const e=window.scrollY;Rt(),Le(),window.scrollTo(0,e)}function yy(t,e){return'<div style="background:var(--card-alt); border:1px solid var(--border); border-radius:8px; padding:10px; margin-top:6px;"><div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">Break it into parts — mix /mo and /yr freely; sums (or =sums) are fine in each box. The total is written to the line for you, and the parts are saved.</div>'+(e.breakdown||[]).map((i,r)=>'<div style="display:flex; gap:6px; margin-bottom:6px; align-items:center;"><input type="text" placeholder="'+(r===0?"e.g. insurance":r===1?"e.g. fuel":"part "+(r+1))+'" value="'+Ce(i.label)+`" oninput="budBreakField('`+t+"','"+e.id+"',"+r+`,'label',this.value)" style="flex:1 1 auto; min-width:0;"><input type="text" inputmode="decimal" placeholder="£ or =12+8" value="`+(i.amount??"")+`" onchange="budBreakField('`+t+"','"+e.id+"',"+r+`,'amount',this.value,this)" style="flex:0 0 104px;"><button type="button" class="risk-btn" style="padding:4px 8px;" title="This part is per month / per year" onclick="budBreakTogglePeriod('`+t+"','"+e.id+"',"+r+',this)">/'+(i.period||"yr")+`</button><button type="button" class="risk-btn" style="padding:4px 9px;" title="Remove part" onclick="budBreakRemoveRow('`+t+"','"+e.id+"',"+r+')">&times;</button></div>').join("")+`<div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;"><button type="button" class="risk-btn" style="padding:4px 12px;" onclick="budBreakAddRow('`+t+"','"+e.id+`')">+ add part</button><div style="font-size:13px;">Adds up to <strong id="`+t+"-bsum-"+e.id+'">'+vy(e)+"</strong></div></div></div>"}function vy(t){const e=ag(t.breakdown);return(t.period||"yr")==="mo"?Ie(e/12)+"/mo":Ie(e)+"/yr"}function Xu(t,e){const n=qr(e);if(!n)return;if((n.breakdown||[]).some(r=>+r.amount)){n.annual=ag(n.breakdown);const r=document.getElementById(t+"-amt-"+e);r&&(r.value=(n.period||"yr")==="mo"?Math.round(n.annual/12):n.annual)}const i=document.getElementById(t+"-bsum-"+e);i&&(i.textContent=vy(n)),t==="bw"?(Hr(),typeof fc=="function"&&fc(n)):Le(),budTouch()}window.budBreakToggle=function(t,e){const n=qr(e);n&&(n.breakdownOpen=!n.breakdownOpen,n.breakdownOpen&&!Array.isArray(n.breakdown)&&(n.breakdown=[{label:"",amount:null,period:"mo"},{label:"",amount:null,period:"mo"}]),budTouch(),Ju(t))};window.budBreakAddRow=function(t,e){const n=qr(e);n&&((n.breakdown=n.breakdown||[]).push({label:"",amount:null,period:"mo"}),Ju(t))};window.budBreakRemoveRow=function(t,e,n){const i=qr(e);!i||!i.breakdown||(i.breakdown.splice(n,1),Xu(t,e),Ju(t))};window.budBreakField=function(t,e,n,i,r,s){const o=qr(e),l=o&&o.breakdown&&o.breakdown[n];if(!l)return;if(i==="label"){l.label=r,budTouch();return}const c=String(r).trim();if(c==="")l.amount=null;else{const u=za(c);if(u==null)return;l.amount=u,s&&(s.value=u)}Xu(t,e)};window.budBreakTogglePeriod=function(t,e,n,i){const r=qr(e),s=r&&r.breakdown&&r.breakdown[n];s&&(s.period=(s.period||"yr")==="mo"?"yr":"mo",i&&(i.textContent="/"+s.period),Xu(t,e))};function SA(t){return'<div class="budwiz-row"><input type="text" placeholder="e.g. Replacement car" value="'+Ce(t.label)+`" oninput="budWizOneOff('`+t.id+`','label',this.value)" style="flex:1 1 170px; min-width:150px;"><input type="text" inputmode="decimal" placeholder="£ total" title="Total cost in today's money — sums welcome" value="`+(t.amount??"")+`" onchange="budWizOneOffAmount('`+t.id+`',this.value,this)" style="flex:0 0 110px;"><input type="number" placeholder="at age" title="Age it first happens" value="`+(t.atAge??"")+`" oninput="budWizOneOff('`+t.id+`','atAge',this.value)" style="flex:0 0 84px;"><input type="number" placeholder="every N yrs" title="Blank = one-time" value="`+(t.everyYears??"")+`" oninput="budWizOneOff('`+t.id+`','everyYears',this.value)" style="flex:0 0 104px;">`+(window._budget.sharedWithPartner?Ja(t,"budWizOneOff"):"")+`<button type="button" class="risk-btn" style="padding:4px 10px;" onclick="budWizRemoveOneOff('`+t.id+`')">&times;</button><div id="bw-oerr-`+t.id+'" class="budwiz-err"></div></div>'}window.budWizOneOff=function(t,e,n){const i=window._budget.oneOffs.find(r=>r.id===t);i&&(e==="label"||e==="paidBy"?i[e]=n:e==="atAge"?i[e]=n===""?null:Za(n):i[e]=n===""?null:+n,e==="paidBy"&&ht(!0),budTouch(),Hr())};window.budWizOneOffAmount=function(t,e,n){const i=window._budget.oneOffs.find(o=>o.id===t);if(!i)return;const r=document.getElementById("bw-oerr-"+t),s=String(e).trim();if(s==="")i.amount=null,r&&(r.textContent="");else{const o=za(s);if(o==null){r&&(r.textContent="Couldn’t read that — a number or a simple sum works.");return}r&&(r.textContent=""),i.amount=o,n&&(n.value=o)}budTouch(),Hr()};window.budWizAddOneOff=function(){window._budget.oneOffs.push({id:Ct(),label:"",tier:"essential",amount:null,atAge:null,everyYears:null}),budTouch(),ht(!0)};window.budWizRemoveOneOff=function(t){const e=window._budget.oneOffs.findIndex(n=>n.id===t);e<0||(Xa("oneOff",window._budget.oneOffs[e],e),window._budget.oneOffs.splice(e,1),budTouch(),ht(!0))};window.budWizClearAmounts=function(){for(const t of window._budget.lines)t.annual=null;for(const t of window._budget.oneOffs)t.amount=null;budTouch(),ht(),showToast("Amounts cleared — nothing is saved until you choose Save.","info",4e3)};window.budWizSave=async function(t){await saveBudgetUI(),t&&await applyBudgetToPlan(),closeBudgetWizard()};function Hr(){const t=document.getElementById("budWizTotals");if(!t)return;const e=window._budget,n=Vr(e);t.innerHTML="Essential <strong>"+Ie(n.essentialMonthlyNet)+"</strong>/mo · Lifestyle <strong>"+Ie(n.comfortableMonthlyNet-n.essentialMonthlyNet)+"</strong>/mo · All-in"+(n.sharedWithPartner?" (your share)":"")+' <strong style="color:var(--primary,#6366f1);">'+Ie(n.allInComfortableMonthly)+"</strong>/mo"}function xA(t){if(t==="intro"){const s=window._budget.lines.some(c=>c.annual)||window._budget.oneOffs.some(c=>c.amount)?'<div class="alert alert-warning" style="margin-bottom:12px;"><strong>You already have a saved budget</strong> — the totals in the bar below are your own saved figures, and each screen shows them ready to edit. Prefer a clean slate? <button type="button" class="risk-btn" style="padding:4px 12px; margin-left:4px;" onclick="budWizClearAmounts()">Start fresh — clear all amounts</button><span style="color:var(--text-muted);"> (nothing is saved until you choose Save at the end)</span></div>':"",o=ro(window._budget),l=(c,u)=>'<button type="button" class="risk-btn'+(o===c?" active":"")+'" data-tier="'+c+`" onclick="setPlsaTier('`+c+`')">`+u+"</button>";return'<h2 style="margin-bottom:10px;">Let’s build your budget</h2><p style="margin-bottom:12px;">We’ll walk through your spending one category at a time — bills first, then the fun stuff, then the big occasional costs. Skip anything; you can come back any time.</p>'+s+'<div style="margin-bottom:12px;"><div style="font-size:15px; margin-bottom:6px;"><strong>What are you aiming for?</strong> <span style="color:var(--text-muted);">— sets every typical-£ suggestion</span></div><div id="budWizTierBtns" style="display:flex; gap:8px; flex-wrap:wrap;">'+l("minimum","Minimum")+l("moderate","Moderate")+l("comfortable","Comfortable")+'</div><div style="font-size:13px; color:var(--text-muted); margin-top:6px;">PLSA Retirement Living Standards: Minimum = essentials, no car; Moderate = a car + two weeks in Europe; Comfortable = more of everything.</div></div><div class="alert alert-info" style="margin-bottom:12px;"><strong>Before you start:</strong> open your banking app and look at the last 2–3 months of statements. Real numbers beat guesses — most people who guess miss 20% of their spending.</div><ul style="padding-left:18px; color:var(--text-muted); line-height:1.8;"><li>Every amount box is a <strong>calculator</strong> — type <code>11.99+8.99+5.99</code> or <code>4×52/12</code> and it does the maths.</li><li><strong>Typical UK figures</strong> (ONS retired households) appear as one-tap chips when you’re unsure.</li><li>The <strong>&Sigma;</strong> button breaks a cost into parts (fuel + insurance + MOT…) so nothing gets forgotten.</li><li>Everything is in <strong>today’s money</strong>.</li>'+(window._budget.sharedWithPartner?"<li>Mark each line <strong>Me / Partner / Shared</strong> — your plan funds your share; your partner sees theirs.</li>":"")+"</ul>"}if(t==="oneoffs")return'<h2 style="margin-bottom:6px;">One-off & periodic costs</h2><p style="font-size:13px; color:var(--text-muted); margin-bottom:12px;">Big costs that land in a specific year: cars, roofs, weddings, milestone trips, helping the kids. Give recurring ones an "every N years" and we average them into your monthly need; one-time items stay as dated events.</p>'+(window._budget.oneOffs.map(SA).join("")||'<p style="font-size:13px;color:var(--text-muted);">Nothing yet — add the big things below.</p>')+'<button type="button" class="risk-btn" style="margin-top:10px;" onclick="budWizAddOneOff()">+ Add a one-off</button>';if(t==="review"){const r=Vr(window._budget),s=eg.single,o=r.allInComfortableAnnual,l=o>=s.comfortable?"at or above <strong>Comfortable</strong>":o>=s.moderate?"between <strong>Moderate</strong> and <strong>Comfortable</strong>":o>=s.minimum?"between <strong>Minimum</strong> and <strong>Moderate</strong>":"below the <strong>Minimum</strong>";let c='<h2 style="margin-bottom:10px;">Your spending picture</h2><div style="display:flex; gap:22px; flex-wrap:wrap; margin-bottom:14px;"><div><div style="font-size:12px;color:var(--text-muted);">Essential (floor)'+(r.sharedWithPartner?" — your share":"")+'</div><div style="font-size:24px;font-weight:700;">'+Ie(r.essentialMonthlyNet)+'<span style="font-size:13px;font-weight:400;color:var(--text-muted);">/mo</span></div></div><div><div style="font-size:12px;color:var(--text-muted);">'+(r.sharedWithPartner?"Your share (all-in)":"All-in comfortable")+'</div><div style="font-size:28px;font-weight:800;color:var(--primary,#6366f1);">'+Ie(r.allInComfortableMonthly)+'<span style="font-size:13px;font-weight:400;color:var(--text-muted);">/mo</span></div><div style="font-size:12px;color:var(--text-muted);">'+Ie(o)+"/yr — what your plan funds</div></div>";r.sharedWithPartner&&(c+='<div><div style="font-size:12px;color:var(--text-muted);">Partner’s share</div><div style="font-size:24px;font-weight:700;">'+Ie(r.partnerAllInMonthly)+'<span style="font-size:13px;font-weight:400;color:var(--text-muted);">/mo</span></div><div style="font-size:12px;color:var(--text-muted);">their side — they can plan with this</div></div>'),c+="</div>",c+='<div class="alert alert-info" style="margin-bottom:14px;"><strong>vs PLSA (single, 2024):</strong> Minimum '+Ie(s.minimum)+" · Moderate "+Ie(s.moderate)+" · Comfortable "+Ie(s.comfortable)+" per year — you’re "+l+'. <span style="color:var(--text-muted);">(Home owned outright; excludes care costs.)</span></div>';const u=Ms(window._budget).slice(0,8);return u.length&&(c+='<div style="margin-bottom:14px;"><div style="font-size:13px; margin-bottom:6px;"><strong>Did you miss anything?</strong> Tap to add, then find it on its category screen:</div><div style="display:flex; flex-wrap:wrap; gap:6px;">'+u.map(f=>'<button type="button" class="budwiz-chip" title="'+Ce(f.hint||"")+`" onclick="budWizSuggest('`+Ce(f.label).replace(/'/g,"\\'")+`', null)">+ `+Ce(f.label)+"</button>").join("")+"</div></div>"),c+='<div style="font-size:13px; color:var(--text-muted); margin-bottom:10px;">Everything is saved automatically as you type.</div>',c+='<div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:6px;"><button type="button" onclick="budWizSave(false)">Done</button><button type="button" onclick="budWizSave(true)">Set as my plan’s target (Stress + Decision) &amp; finish</button></div>',c}const e=co.find(r=>r.key===t),n=window._budget.lines.filter(r=>EA(r)===e.key),i=Ms(window._budget).filter(r=>(Qu[r.label.toLowerCase()]||"extras")===e.key);return'<h2 style="margin-bottom:6px;">'+e.title+'</h2><div class="alert alert-info" style="margin-bottom:10px; font-size:13px;">'+e.tip+"</div>"+(n.map(IA).join("")||'<p style="font-size:13px;color:var(--text-muted);">Nothing here yet — add below.</p>')+`<div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:12px; align-items:center;"><button type="button" class="risk-btn" onclick="budWizAddLine('`+e.key+`')">+ Add your own</button>`+(i.length?'<span style="font-size:12px;color:var(--text-muted);">Often forgotten:</span>'+i.map(r=>'<button type="button" class="budwiz-chip" title="'+Ce(r.hint||"")+`" onclick="budWizSuggest('`+Ce(r.label).replace(/'/g,"\\'")+"','"+e.key+`')">+ `+Ce(r.label)+"</button>").join(""):"")+"</div>"}function ht(t=!1){const e=document.getElementById("budWizardOverlay"),n=e.querySelector(".budwiz-body"),i=t&&n?n.scrollTop:0,r=hs[Rn],s=Rn===hs.length-1,o=hs.map((l,c)=>'<span class="budwiz-dot '+(c===Rn?"on":c<Rn?"done":"")+'"></span>').join("");e.innerHTML='<div class="budwiz-shell"><div class="budwiz-head" style="display:flex; justify-content:space-between; align-items:center;"><div style="font-size:13px; color:var(--text-muted);">Budget walk-through · step '+(Rn+1)+" of "+hs.length+'</div><button type="button" class="risk-btn" style="padding:4px 12px;" title="Close (your entries are kept)" onclick="closeBudgetWizard()">&times;</button></div><div class="budwiz-body">'+xA(r)+'</div><div class="budwiz-foot"><button type="button" class="risk-btn" onclick="budWizGo(-1)"'+(Rn===0?" disabled":"")+">Back</button>"+(s?"":'<button type="button" onclick="budWizGo(1)">'+(r==="intro"?"Start":"Next")+"</button>")+'<div class="budwiz-dots">'+o+'</div><div id="budWizUndoSlot" style="font-size:13px; color:var(--text-muted);"></div><div id="budWizTotals" style="margin-left:auto; font-size:13px; color:var(--text-muted);"></div></div></div>',Hr(),e.querySelector(".budwiz-body").scrollTop=i}let pc=!1,mc=!1;async function uo(){try{const t=await Et();return!!(t&&t.locked)}catch(t){return console.warn("Could not read decision settings for lock state:",t),!1}}async function by(){try{const[t,e,n]=await Promise.all([Et(),ir({limit:1e3}),Jn()]);if(n&&Object.values(n).some(s=>s&&s.yearSetupComplete))return!0;const i=yg(t);return(Array.isArray(e)?e:[]).some(s=>s.settingsChecksum===void 0||s.settingsChecksum===i)}catch(t){return console.warn("Could not determine derived-data state:",t),!0}}function Tf(t){const e=document.getElementById("decision-decisionsettings");e&&e.querySelectorAll("input, select, textarea, button").forEach(n=>{n.closest("#dsLockBanner")||n.id!=="dsSaveBtn"&&(n.disabled=!t)})}async function Zu(){const t=document.getElementById("dsLockBanner"),e=document.getElementById("dsSaveBtn");if(!(!t||!e)){if(pc=await uo(),!pc){t.style.display="none",Tf(!0),e.textContent="Save Settings",e.classList.remove("btn-locked"),sc();return}mc=!await by(),t.style.display="flex",t.className="lock-banner",mc?t.innerHTML='<span>🔒 <strong>These settings are locked.</strong> Nothing has been recorded against them yet — no tax years, no monthly entries — so you can unlock and edit them.</span><button type="button" onclick="unlockDecisionSettings()">Unlock to edit</button>':t.innerHTML='<span>🔒 <strong>These settings are locked.</strong> Tax years or monthly entries have been recorded against them, so they can’t be changed. To use different settings, create a new plan.</span><button type="button" onclick="createNewPlanForSettings()">Create new plan</button>',Tf(!1),e.textContent="🔒 Locked",e.classList.add("btn-locked"),sc()}}window.unlockDecisionSettings=async function(){if(await by()){showToast("Can’t unlock — tax years or entries now depend on these settings. Create a new plan.","warning"),await Zu();return}At("Unlocking…");try{await so({locked:!1}),await Gu(),showToast("Settings unlocked — you can edit them now.","success")}catch(t){console.error("Unlock error:",t),showToast("Could not unlock: "+t.message,"error")}finally{kt()}};window.createNewPlanForSettings=function(){const t=document.getElementById("scenarioNewBtn");t&&t.click()};window.saveDecisionSettingsUI=async function(){if(!dt()){showToast("Please sign in to save settings","error");return}if(pc||await uo()){showToast(mc?"These settings are locked. Use “Unlock to edit” above to change them.":"These settings are locked. Define a new plan to use different settings.","info");return}const t=Ga(document.getElementById("dsSpStartDate").value.trim());if(!t.valid){showToast(t.error,"error");return}t.warning&&showToast(t.warning,"warning");const e=readAlloc("ds");if(Uu(e.equityMin,e.bondMin,e.cashTarget)){At("Saving settings...");try{await so({configured:!0,equityMin:e.equityMin,bondMin:e.bondMin,cashTarget:e.cashTarget,duration:+document.getElementById("dsDuration").value,equityGlideEnabled:document.getElementById("dsEquityGlide").checked,baseSalary:+document.getElementById("dsBaseSalary").value,spendingProfile:document.getElementById("dsSpendingProfile").value||"flat",spStartDate:document.getElementById("dsSpStartDate").value.trim()||null,spWeeklyAmount:+document.getElementById("dsSpWeeklyAmount").value||0,protectionFactor:+document.getElementById("dsProtectionFactor").value,recoveryBuffer:+document.getElementById("dsRecoveryBuffer").value,consecutiveLimit:+document.getElementById("dsConsecutiveLimit").value,isaBalance:+document.getElementById("dsIsaBalance").value||0,diversifierStart:e.diversifierStart||0,subAsset:e.subAsset||null,glideEndgame:e.glideEndgame||null,allocMode:Hu("ds"),taggedFunds:Bt("ds").filter(n=>n.ticker&&n.value>0),locked:!0}),$u(),showToast("Settings saved and locked. Create a new plan to use different settings.","success",4e3),await Zu()}catch(n){console.error("Error saving decision settings:",n),showToast("Error saving: "+n.message,"error")}finally{kt()}}};window.resetDecisionSettingsUI=async function(){if(confirm("Reset all decision settings to defaults?")){At("Resetting settings...");try{await so({equityMin:25e4,bondMin:2e5,cashTarget:5e4,duration:35,baseSalary:3e4,protectionFactor:20,recoveryBuffer:15e3,consecutiveLimit:3}),await Gu(),showToast("Settings reset to defaults","success")}catch(t){console.error("Error resetting settings:",t),showToast("Error resetting: "+t.message,"error")}finally{kt()}}};window.showDrawdownScheduleUI=async function(){const t=parseFloat(document.getElementById("ddInflation").value)/100||.025,e=parseInt(document.getElementById("ddDuration").value)||35;try{const n=await Nt();n.duration=e;const i=Sf(n,e,t);let r='<div class="card"><h2>Projected Drawdown Schedule (SIPP + ISA bridge)</h2>';r+='<div class="alert alert-info" style="margin-bottom:16px;">SIPP is drawn to fill the basic-rate band; the tax-free <strong>ISA tops your income up to the target</strong> and runs down over the years (the bridge to the State Pension). Deterministic projection at your assumed inflation — the stochastic ISA path is in the Monte-Carlo / Historical results.</div>',r+='<div style="overflow-x: auto;"><table>',r+="<thead><tr><th>Year</th><th>SIPP Draw</th><th>State</th><th>Tax</th><th>Net (SIPP+SP)</th><th>ISA Top-up</th><th>Spendable</th><th>ISA Left</th></tr></thead>",r+="<tbody>";for(const s of i)r+=`<tr>
            <td>${s.year}</td>
            <td style="color: var(--primary); font-weight: 600;">${Y(s.sippDraw)}</td>
            <td>${Y(s.statePension)}</td>
            <td style="color: var(--danger);">-${Y(s.tax)}</td>
            <td>${Y(s.netIncome)}</td>
            <td style="color: var(--info);">${Y(s.isaDraw)}</td>
            <td style="color: var(--success); font-weight: 600;">${Y(s.spendable)}</td>
            <td>${Y(s.isaBalance)}</td>
          </tr>`;r+="</tbody></table></div></div>",document.getElementById("drawdownResults").innerHTML=r}catch(n){console.error("Drawdown error:",n),document.getElementById("drawdownResults").innerHTML=`<div class="alert alert-danger">Error: ${n.message}</div>`}};window.showGlidepathUI=async function(){const t=parseFloat(document.getElementById("gpInflation").value)/100||.025,e=parseInt(document.getElementById("gpDuration").value)||35;try{const n=await Nt();n.duration=e;const i=rv(n,t),r=Sf(n,e,t),s={};r.forEach(f=>{s[f.year]=f.isaBalance});const o=!!n.equityGlideEnabled,l=(n.equityMin||0)+(n.bondMin||0)+(n.cashTarget||0),c={equity:l>0?n.equityMin/l:.5,bond:l>0?n.bondMin/l:.4,cash:l>0?n.cashTarget/l:.1,equityGlide:o?$s(n.equityMin,n.bondMin):void 0};let u='<div class="card"><h2>Fund Glidepath Over Time</h2>';u+='<div class="alert alert-info" style="margin-bottom: 20px;">',u+=o?"<strong>Bond tent on:</strong> the equity share (Shares %) RISES over the early years then holds; the £ floors inflate with CPI and deplete over time, cash holds its real value, and the ISA bridge runs down as it tops up income.":"<strong>Glidepath:</strong> Equity & Bond minimums inflate with CPI but deplete over time to £0; cash inflates only (holds real value); the ISA bridge runs down as it tops up income. Turn on the bond tent in Settings to see the equity share rise.",u+="</div>",u+='<div style="overflow-x: auto;"><table>',u+="<thead><tr><th>Year</th><th>Equity Min</th><th>Bond Min</th><th>Cash Target</th><th>Shares % (of pot)</th><th>ISA Balance</th><th>Total Min</th></tr></thead>",u+="<tbody>";for(const f of i){const m=Math.round(Al(c,f.year,n.duration).equity*100);u+=`<tr>
            <td>${f.year}</td>
            <td style="color: var(--success);">${Y(f.equityMin)}</td>
            <td style="color: var(--info);">${Y(f.bondMin)}</td>
            <td style="color: var(--warning);">${Y(f.cashTarget)}</td>
            <td style="font-weight: 600;">${m}%</td>
            <td>${Y(s[f.year]||0)}</td>
            <td style="font-weight: 600;">${Y(f.totalMin)}</td>
          </tr>`}u+="</tbody></table></div></div>",document.getElementById("glidepathResults").innerHTML=u}catch(n){console.error("Glidepath error:",n),document.getElementById("glidepathResults").innerHTML=`<div class="alert alert-danger">Error: ${n.message}</div>`}};let zt=null,cn=[],un="all";async function gn(){const t=document.getElementById("historyTabs"),e=document.getElementById("historyDetail"),n=document.getElementById("historyYearFilter"),i=document.getElementById("deleteAllHistoryBtn"),r=document.getElementById("deleteYearBtn");if(!t||!e)return;if(t.innerHTML='<span class="loading">Loading...</span>',cn=await ir({sortDesc:!1,limit:500}),i&&(i.style.display=cn.length>0?"":"none"),r&&(r.style.display="none"),cn.length===0){t.innerHTML="",n&&(n.innerHTML='<option value="all">No entries</option>'),e.innerHTML=`
          <div class="no-history-message">
            <h3>No History Entries</h3>
            <p>Save decisions from the Decision Tool to build your history.</p>
          </div>
        `;return}const s=[...new Set(cn.map(u=>u.date.split("-")[0]))].sort().reverse();if(n){let u='<option value="all">All Years</option>';s.forEach(f=>{u+=`<option value="${f}">${f}</option>`}),n.innerHTML=u,n.value=un}r&&(r.style.display=un!=="all"&&cn.length>0?"":"none");const o=un==="all"?cn:cn.filter(u=>u.date.startsWith(un));if(o.length===0){t.innerHTML="",e.innerHTML=`
          <div class="no-history-message">
            <h3>No entries for ${un}</h3>
            <p>Select a different year or "All Years".</p>
          </div>
        `;return}let l="";o.forEach(u=>{const f=u.date===zt,m=["history-tab"];f&&m.push("active"),u.inProtection&&m.push("protection");const[p,w]=u.date.split("-").map(Number),I=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],S=un==="all"?`${I[w-1]} ${p}`:I[w-1];l+=`<button class="${m.join(" ")}" onclick="selectHistoryEntry('${u.date}')">${S}</button>`}),t.innerHTML=l;const c=document.getElementById("historyMobileSelector");if(c){let u="";o.forEach(f=>{const m=Pr(f.date),p=f.inProtection?" (Protection)":"";u+=`<option value="${f.date}">${m}${p}</option>`}),c.innerHTML=u}(!zt||!o.find(u=>u.date===zt))&&(zt=o[o.length-1].date),c&&(c.value=zt),wy(zt),setTimeout(()=>{const u=t.querySelector(".history-tab.active");u&&u.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})},100)}window.filterHistoryByYear=function(t){un=t,zt=null,gn()};function Pr(t){const[e,n]=t.split("-").map(Number);return`${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][n-1]} ${e}`}function wy(t){const e=document.getElementById("historyDetail"),n=cn.find(u=>u.date===t);if(!n){e.innerHTML='<div class="no-history-message"><h3>Entry not found</h3></div>';return}const i=u=>u!=null?"£"+Math.round(u).toLocaleString():"—",r=n.isTaxEfficientYear!==!1&&n.mode==="Tax-Efficient",s=n.inProtection?"warning":r?"efficient":"inefficient",o=n.inProtection?`Protection${n.protectionInducedTaxEfficiency?" (Tax-Efficient)":""}`:r?"Tax-Efficient":"Standard";let l=n.source||"Unknown";n.source==="Growth"&&(n.dEquity>0||n.dBond>0)?l=`Growth (Equity: ${i(n.dEquity||0)}, Bond: ${i(n.dBond||0)})`:n.source==="Cash"&&(l=`Cash (${i(n.dCash||n.sipp||0)})`);let c=`
        <div class="no-print" style="display:flex;justify-content:flex-end;margin-bottom:12px;">
          <button class="btn secondary" onclick="printMonthlyReport('${n.date}')">Download PDF</button>
        </div>
        <!-- Header with date and mode -->
        <div class="history-detail-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <div>
              <h3 style="margin:0;">${Pr(n.date)}</h3>
              <div style="color:var(--text-muted);font-size:13px;">Tax Year ${n.taxYear} • Year ${n.yearNum||0}</div>
            </div>
            <span class="tax-mode-badge ${s}">${o}</span>
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
              <span class="value">${i(n.equity)}</span>
            </div>
            <div class="history-field">
              <label>Bond</label>
              <span class="value">${i(n.bond)}</span>
            </div>
            <div class="history-field">
              <label>Cash</label>
              <span class="value">${i(n.cash)}</span>
            </div>
            <div class="history-field">
              <label>Total</label>
              <span class="value" style="color:var(--primary);">${i(n.total)}</span>
            </div>
          </div>

          <!-- Glidepath targets -->
          ${n.adjEquity||n.adjBond||n.adjCash?`
            <div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--border);">
              <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">GLIDEPATH TARGETS</div>
              <div class="history-grid">
                <div class="history-field">
                  <label>Equity Min</label>
                  <span class="value">${i(n.adjEquity)}</span>
                </div>
                <div class="history-field">
                  <label>Bond Min</label>
                  <span class="value">${i(n.adjBond)}</span>
                </div>
                <div class="history-field">
                  <label>Cash Target</label>
                  <span class="value">${i(n.adjCash)}</span>
                </div>
                <div class="history-field">
                  <label>Shares vs bonds (target)</label>
                  <span class="value">${n.adjEquity+n.adjBond>0?Math.round(n.adjEquity/(n.adjEquity+n.adjBond)*100)+"% / "+Math.round(n.adjBond/(n.adjEquity+n.adjBond)*100)+"%":"—"}</span>
                </div>
                <div class="history-field">
                  <label>Surplus</label>
                  <span class="value ${(n.total||0)-(n.adjEquity||0)-(n.adjBond||0)-(n.adjCash||0)>=0?"success":"danger"}">
                    ${i((n.total||0)-(n.adjEquity||0)-(n.adjBond||0)-(n.adjCash||0))}
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
              <span class="value" style="color:var(--primary);">${i(n.sipp)}</span>
            </div>
            <div class="history-field">
              <label>ISA Top-up</label>
              <span class="value">${i(n.isa)}</span>
            </div>
            <div class="history-field">
              <label>Other Income</label>
              <span class="value">${i(n.other)}</span>
            </div>
            <div class="history-field">
              <label>State Pension</label>
              <span class="value">${i(n.state)}</span>
            </div>
          </div>

          <div style="margin-top:16px;padding:16px;background:var(--card-alt);border-radius:8px;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-weight:500;">Total Monthly Income</span>
              <span style="font-size:20px;font-weight:600;color:var(--success);">${i(n.monthlyNet)}</span>
            </div>
          </div>

          ${n.boostAmount>0?`
            <div style="margin-top:12px;padding:12px;background:rgba(46,204,113,0.1);border-radius:8px;">
              <strong style="color:var(--success);">Tax Boost:</strong>
              <span style="color:var(--success);">+${i(n.boostAmount)}</span>
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
                <span class="value">${i(n.yearlyIsaSavingsAllocation)}</span>
              </div>
              <div class="history-field">
                <label>Used This Month</label>
                <span class="value">${i(n.isaSavingsUsedThisMonth||n.isa)}</span>
              </div>
              <div class="history-field">
                <label>Cumulative Used</label>
                <span class="value">${i(n.cumulativeIsaSavingsUsed)}</span>
              </div>
              <div class="history-field">
                <label>Remaining</label>
                <span class="value ${(n.yearlyIsaSavingsAllocation||0)-(n.cumulativeIsaSavingsUsed||0)>0?"success":"warning"}">
                  ${i((n.yearlyIsaSavingsAllocation||0)-(n.cumulativeIsaSavingsUsed||0))}
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
              <span class="value">${i(n.pa)}</span>
            </div>
            <div class="history-field">
              <label>Basic Rate Limit</label>
              <span class="value">${i(n.brl)}</span>
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
                <td>${i(n.taxPaidMonthly||n.monthlyTax)}</td>
                <td>${i(n.taxPaidYTD)}</td>
                <td>${i(n.taxProjectedAnnual)}</td>
              </tr>
              ${n.taxSavedMonthly>0||n.taxSavedProjectedAnnual>0?`
                <tr>
                  <td class="source-name">Tax Saved</td>
                  <td class="net-col">-${i(n.taxSavedMonthly)}</td>
                  <td class="net-col">-${i(n.taxSavedYTD)}</td>
                  <td class="net-col">-${i(n.taxSavedProjectedAnnual)}</td>
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
      `;e.innerHTML=c,document.querySelectorAll(".history-tab").forEach(u=>{u.classList.toggle("active",u.textContent===Pr(t))})}window.selectHistoryEntry=function(t){zt=t,wy(t);const e=document.getElementById("historyMobileSelector");e&&(e.value=t);const i=document.getElementById("historyTabs").querySelector(".history-tab.active");i&&i.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})};window.scrollHistoryTabs=function(t){const e=document.getElementById("historyTabs"),n=200;t==="left"?e.scrollLeft-=n:e.scrollLeft+=n};function pa(t){const[e,n]=t.split("-").map(Number);return n>=4?`${e%100}/${(e+1)%100}`:`${(e-1)%100}/${e%100}`}async function gc(t){const e={};for(const i of t){const r=i.taxYear||pa(i.date);e[r]||(e[r]=0),e[r]+=i.isaSavingsUsedThisMonth||i.isa||0}for(const i of t)await vg(i.date);const n=await Jn();for(const[i,r]of Object.entries(e))if(n[i]){const s=n[i].isaSavingsUsed||0,o=Math.max(0,s-r);await nr(i,{...n[i],isaSavingsUsed:o})}}window.deleteHistoryEntry=async function(t){if(!dt()){showToast("Please sign in to delete entries","error");return}const e=await ir({sortDesc:!1,limit:1e3}),n=pa(t),r=e.filter(c=>(c.taxYear||pa(c.date))===n).sort((c,u)=>c.date.localeCompare(u.date)),s=r.findIndex(c=>c.date===t);if(s===-1){showToast("Entry not found","error");return}const o=s===r.length-1,l=Pr(t);if(o){if(!confirm(`Delete entry for ${l}?`))return;At("Deleting entry...");try{await gc([r[s]]),showToast(`Deleted ${l}`,"success"),zt=null,await gn()}catch(c){console.error("Delete error:",c),showToast("Error deleting: "+c.message,"error")}finally{kt()}}else{const c=r.slice(s),u=Pr(c[c.length-1].date);if(!confirm(`This will delete ${c.length} entries from ${l} to ${u} in tax year ${n}.

Continue?`))return;At(`Deleting ${c.length} entries...`);try{await gc(c),showToast(`Deleted ${c.length} entries`,"success"),zt=null,await gn()}catch(f){console.error("Delete error:",f),showToast("Error deleting: "+f.message,"error")}finally{kt()}}};window.deleteHistoryForTaxYear=async function(t){if(!dt()){showToast("Please sign in to delete entries","error");return}const n=(await ir({sortDesc:!1,limit:1e3})).filter(i=>(i.taxYear||pa(i.date))===t);if(n.length===0){showToast(`No history entries for tax year ${t}`,"info");return}if(confirm(`Delete all ${n.length} history entries for tax year ${t}?`)){At(`Deleting tax year ${t}...`);try{await gc(n);const i=await Jn();i[t]&&await nr(t,{...i[t],isaSavingsUsed:0}),showToast(`Deleted all entries for ${t}`,"success"),zt=null,await gn()}catch(i){console.error("Delete error:",i),showToast("Error deleting: "+i.message,"error")}finally{kt()}}};window.deleteHistoryForSelectedYear=async function(){if(un==="all"){showToast("Select a specific year first","error");return}const t=`${parseInt(un)%100}/${(parseInt(un)+1)%100}`;await deleteHistoryForTaxYear(t)};window.deleteAllHistory=async function(){if(confirm("Delete ALL history entries? This cannot be undone.")&&confirm("Are you ABSOLUTELY sure? All decision history will be permanently deleted.")){if(!dt()){showToast("Please sign in to delete entries","error");return}At("Deleting all history...");try{const t=await ir({limit:1e3});for(const n of t)await vg(n.date);const e=await Jn();for(const[n,i]of Object.entries(e))i.isaSavingsUsed>0&&await nr(n,{...i,isaSavingsUsed:0});showToast(`Deleted ${t.length} entries`,"success"),zt=null,await gn()}catch(t){console.error("Delete all error:",t),showToast("Error deleting: "+t.message,"error")}finally{kt()}}};let Ni=null;async function Zi(){const t=document.getElementById("taxYearTabs"),e=document.getElementById("taxYearDetail");if(!t||!e)return;t.innerHTML='<span class="loading">Loading...</span>';const n=await Jn(),i=await Et(),r=Object.keys(n).sort(),s=AA(),o=kA(r,s,40);let l="";o.forEach(f=>{const m=n[f],p=m&&m.yearSetupComplete,w=f===Ni,I=["tax-year-tab"];w&&I.push("active"),p||I.push("not-setup"),l+=`<button class="${I.join(" ")}" onclick="selectTaxYear('${f}')">${f}</button>`}),t.innerHTML=l;const c=document.getElementById("taxYearMobileSelector");if(c){let f="";o.forEach(m=>{const p=n[m],I=p&&p.yearSetupComplete?m:`${m} (not set up)`;f+=`<option value="${m}">${I}</option>`}),c.innerHTML=f}if(!Ni){const f=r.filter(m=>{var p;return(p=n[m])==null?void 0:p.yearSetupComplete});Ni=f.length>0?f[f.length-1]:s}c&&(c.value=Ni),await _y(Ni,n,i);const u=t.querySelector(".tax-year-tab.active");u&&u.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})}function AA(){const t=new Date,e=t.getFullYear(),n=t.getMonth()+1;return n<4||n===4&&t.getDate()<6?`${String(e-1).slice(-2)}/${String(e).slice(-2)}`:`${String(e).slice(-2)}/${String(e+1).slice(-2)}`}function kA(t,e,n){const i=new Set(t),[r]=e.split("/").map(Number),s=r<50?2e3+r:1900+r;for(let o=0;o<n&&i.size<n;o++){const l=s+o,c=l+1;i.add(`${String(l).slice(-2)}/${String(c).slice(-2)}`)}return Array.from(i).sort()}async function _y(t,e,n){var _,b,E,x,v,le,pe,H,ee,ne,te,Ne,Pe,ve;const i=document.getElementById("taxYearDetail"),r=e[t];if(!r||!r.yearSetupComplete){i.innerHTML=`
          <div class="not-configured-message">
            <h3>Tax Year ${t} Not Configured</h3>
            <p>This tax year hasn't been set up yet. Use the Decision Tool to calculate a decision for a month in this tax year to trigger the setup wizard.</p>
            <button class="btn primary" onclick="triggerWizardForYear('${t}')">Set Up ${t}</button>
          </div>
        `;return}const s=await xu(t),o=Math.round(s.amount||0),l=s.startDate||"Not configured",c=s.isReceiving;s.yearsUntil;const u=O=>O!=null?"£"+Math.round(O).toLocaleString():"—",f=(n.equityMin||0)+(n.bondMin||0)+(n.cashTarget||0),m=n.duration||35,p=Math.max(0,2e3+(parseInt(t.split("/")[0],10)||26)-2026),w=!!n.equityGlideEnabled,I={equity:f>0?n.equityMin/f:.5,bond:f>0?n.bondMin/f:.4,cash:f>0?n.cashTarget/f:.1,equityGlide:w?$s(n.equityMin,n.bondMin):void 0},S=Al(I,p,m),A=Al(I,Math.max(0,p-1),m),C=O=>Math.round(O*100),P=Math.max(5,m-20),L=C(S.equity)-C(A.equity),N=`${C(S.equity)}% shares / ${C(S.bond)}% bonds / ${C(S.cash)}% cash`;let z,U;w?p>P?(U=`Holding — reached your mix at year ${P}`,z=`You've reached your endgame mix. Hold ${N}; no glide change this year.`):L>0?(U=`Rising — year ${p} of ${P}`,z=`Shift about ${L}% of your pot from bonds into shares this year, reaching ${N}.`):(U=`Rising — year ${p} of ${P}`,z=`Hold ${N}.`):(U="Flat (bond tent off)",z=`Hold a steady ${N}. Rebalance back to this whenever it drifts.`);const T=`
        <div class="tax-year-detail-card">
          <h3>This Year's Target Mix${w?" — Bond Tent":""}</h3>
          <div class="tax-year-grid">
            <div class="tax-year-field"><label>Shares</label><span class="value">${C(S.equity)}% · ${u(f*S.equity)}</span></div>
            <div class="tax-year-field"><label>Bonds</label><span class="value">${C(S.bond)}% · ${u(f*S.bond)}</span></div>
            <div class="tax-year-field"><label>Cash</label><span class="value">${C(S.cash)}% · ${u(f*S.cash)}</span></div>
            <div class="tax-year-field"><label>Glide stage</label><span class="value">${U}</span></div>
          </div>
          <div class="alert alert-info" style="margin-top:12px;"><strong>Rebalance:</strong> ${z}</div>
        </div>`;let y=`<div class="no-print" style="display:flex;gap:8px;justify-content:flex-end;margin-bottom:12px;"><button class="btn secondary" onclick="printAnnualReport('${t}')">Download PDF</button> <button class="btn secondary" onclick="exportAnnualCsv('${t}')">Export CSV</button></div>`+T+`
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
              <span class="value">${u(r.confirmedSalary)}</span>
            </div>
            <div class="tax-year-field">
              <label>Other Taxable Income (Annual)</label>
              <input type="number" value="${r.other||0}" onchange="updateTaxYear('${t}','other',this.value)">
            </div>
            <div class="tax-year-field">
              <label>State Pension (Annual)</label>
              <span class="value">${c?u(o)+(s.isFirstYear?" (partial year)":""):l!=="Not configured"?`Starts ${l}`:"Not configured"}</span>
            </div>
            <div class="tax-year-field">
              <label>Income Before Pension Start</label>
              <span class="value">${u(r.grossIncomeToDate)}</span>
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
              <span class="value">${u(r.isaSavingsAllocation)}</span>
            </div>
            <div class="tax-year-field">
              <label>ISA/Savings Used</label>
              <span class="value">${u(r.isaSavingsUsed||0)}</span>
            </div>
            <div class="tax-year-field">
              <label>Start Month</label>
              <span class="value">${CA(r.startMonth||4)}</span>
            </div>
            <div class="tax-year-field">
              <label>Remaining Months (at setup)</label>
              <span class="value">${r.remainingMonths||12}</span>
            </div>
          </div>
        </div>
      `;if(r.expectedMonthly){const O=r.expectedMonthly;y+=`
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
                ${((x=O.other)==null?void 0:x.gross)>0?`
                <tr>
                  <td class="source-name">Other Income</td>
                  <td>${u((v=O.other)==null?void 0:v.gross)}</td>
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
                ${((Ne=O.isa)==null?void 0:Ne.net)>0?`
                <tr>
                  <td class="source-name">ISA <span style="color:var(--success);font-size:11px;">(tax-free)</span></td>
                  <td>${u((Pe=O.isa)==null?void 0:Pe.gross)}</td>
                  <td style="color:var(--success);">£0</td>
                  <td class="net-col">${u((ve=O.isa)==null?void 0:ve.net)}</td>
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
        `}y+=`
        <div class="tax-year-actions">
          <button class="btn secondary" onclick="deleteTaxYear('${t}')">Delete Year</button>
          <button class="btn secondary" onclick="reconfigureTaxYear('${t}')">Reconfigure via Wizard</button>
        </div>
      `,i.innerHTML=y,document.querySelectorAll(".tax-year-tab").forEach(O=>{O.classList.toggle("active",O.textContent===t)})}window.selectTaxYear=async function(t){Ni=t;const e=await Jn(),n=await Et();await _y(t,e,n),document.querySelectorAll(".tax-year-tab").forEach(o=>{o.classList.toggle("active",o.textContent===t)});const i=document.getElementById("taxYearMobileSelector");i&&(i.value=t);const s=document.getElementById("taxYearTabs").querySelector(`.tax-year-tab[onclick="selectTaxYear('${t}')"]`);s&&s.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})};window.scrollTaxYearTabs=function(t){const e=document.getElementById("taxYearTabs"),n=200;t==="left"?e.scrollLeft-=n:e.scrollLeft+=n};function CA(t){return["January","February","March","April","May","June","July","August","September","October","November","December"][(t-1)%12]||"April"}window.triggerWizardForYear=async function(t){const[e]=t.split("/").map(Number),n=e<50?2e3+e:1900+e,i=`${n}-04`,r=document.getElementById("selectedMonth");r&&(r.value=i),document.querySelectorAll(".tab").forEach(s=>s.classList.remove("active")),document.querySelector('.tab[data-tab="decision"]').classList.add("active"),document.querySelectorAll(".tab-content").forEach(s=>s.classList.remove("active")),document.getElementById("decision-content").classList.add("active"),document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(s=>s.classList.remove("active")),document.querySelector('.sub-tab[data-decisiontab="entry"]').classList.add("active"),document.querySelectorAll(".decision-subtab").forEach(s=>s.classList.add("hidden")),document.getElementById("decision-entry").classList.remove("hidden"),showToast(`Please click "Calculate" with April ${n} selected to set up tax year ${t}`,"info",5e3)};window.reconfigureTaxYear=async function(t){if(confirm(`This will allow you to reconfigure tax year ${t}. The setup wizard will be triggered when you next calculate a decision for this year. Continue?`))try{const e=await qa(t);e.yearSetupComplete=!1,await nr(t,e),await Zi(),showToast(`Tax year ${t} marked for reconfiguration. Calculate a decision for this year to run the wizard again.`,"success",5e3)}catch(e){console.error("Error:",e),showToast("Error: "+e.message,"error")}};window.updateTaxYear=async function(t,e,n){try{const i=await qa(t);i[e]=parseFloat(n),await nr(t,i)}catch(i){console.error("Error updating tax year:",i),showToast("Error saving: "+i.message,"error")}};window.deleteTaxYear=async function(t){if(confirm("Delete tax year "+t+"? This will remove all configuration for this year."))try{const e=await bn();delete e.taxYears[t],await Ua(e),Ni=null,await Zi()}catch(e){console.error("Error deleting tax year:",e),showToast("Error deleting: "+e.message,"error")}};window.addTaxYear=async function(){if(!dt()){showToast("Please sign in to add tax years","error");return}const t=prompt("Enter tax year (e.g., 25/26):");if(!t||!/^\d{2}\/\d{2}$/.test(t)){showToast("Invalid format. Use YY/YY (e.g., 25/26)","error");return}try{await nr(t,{}),await Zi()}catch(e){console.error("Save error:",e),showToast("Error saving: "+e.message,"error")}};console.log("Pension Planner v"+If+" loaded");
