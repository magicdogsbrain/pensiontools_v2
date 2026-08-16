(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();function Xg(t){const e=(t.sippDraw||0)+(t.other||0)+(t.statePension||0),n=e*12,i=t.pa||12570,r=t.brl||50270,s=t.hrl||125140;let o=0;n>i&&(n<=r?o=(n-i)*.2:n<=s?o=(r-i)*.2+(n-r)*.4:o=(r-i)*.2+(s-r)*.4+(n-s)*.45);const l=o/12,c=e-l+(t.isaDraw||0);return{date:t.date,taxYear:t.taxYear,yearNum:t.yearNumber,equity:t.equity,bond:t.bond,cash:t.cash,total:t.equity+t.bond+t.cash,adjEquity:t.adjEquityMin,adjBond:t.adjBondMin,adjCash:t.adjCashTarget,source:t.source,dEquity:t.drawFromEquity||0,dBond:t.drawFromBond||0,dCash:t.drawFromCash||0,sipp:t.sippDraw,stdSipp:t.stdSipp||t.sippDraw,isa:t.isaDraw,other:t.other,state:t.statePension,pa:i,brl:r,monthlyTax:l,monthlyNet:c,mode:t.taxEfficient?"Tax-Efficient":"Standard",inProtection:t.inProtection,reason:t.protectionReason||"",consecutiveDraws:t.consecutiveCashDraws||0,boostAmount:t.boostAmount,boostEligible:t.boostEligible||!1,rebal:t.rebalanceActions?t.rebalanceActions.join("; "):"",yearlyIsaSavingsAllocation:t.yearlyIsaSavingsAllocation||0,isaSavingsUsedThisMonth:t.isaDraw||0,cumulativeIsaSavingsUsed:t.cumulativeIsaSavingsUsed||0,taxPaidMonthly:l,taxPaidYTD:t.taxPaidYTD||l,taxProjectedAnnual:t.taxProjectedAnnual||o,taxSavedMonthly:t.taxSavedMonthly||0,taxSavedYTD:t.taxSavedYTD||0,taxSavedProjectedAnnual:t.taxSavedProjectedAnnual||0,isTaxEfficientYear:t.isTaxEfficientYear??!0,protectionInducedTaxEfficiency:t.protectionInducedTaxEfficiency||!1,remainingMonths:t.remainingMonths||12}}const ho={INFO:"info",WARNING:"warning",DANGER:"danger",SUCCESS:"success"},Kh="6.0.0",Ye={PERSONAL_ALLOWANCE:12570,BASIC_RATE_LIMIT:50270,HIGHER_RATE_LIMIT:125140,BASIC_RATE:.2,HIGHER_RATE:.4,ADDITIONAL_RATE:.45,PA_TAPER_THRESHOLD:1e5,PA_TAPER_RATE:.5},Xl={ASSUMED_CPI:.025,OTHER_INCOME_CAP:.04},Qt={RETURN:.03,MIN:0,DRAWDOWN_STRATEGY:"minimiseEarlyTax"},ge={BASE_SALARY:3e4,EQUITY_MIN:25e4,BOND_MIN:2e5,CASH_TARGET:5e4,DURATION_YEARS:35,PROTECTION_FACTOR:20,RECOVERY_BUFFER:15e3,CONSECUTIVE_LIMIT:3},Oi={PROTECTION_MULTIPLIER:.8,HODL_ENABLED:!1,HODL_VALUE:25e3},zi={1928:.4781,1929:-.172,1930:-.338,1931:-.527,1932:-.231,1933:.669,1934:.041,1935:.3879,1936:.2492,1937:-.3839,1938:.2846,1939:-.0278,1940:-.1278,1941:-.1552,1942:.0782,1943:.1382,1944:.1226,1945:.2665,1946:-.0818,1947:.0225,1948:-.0246,1949:.1279,1950:.1787,1951:.1463,1952:.0837,1953:-.0377,1954:.4399,1955:.2084,1956:.0262,1957:-.1278,1958:.3396,1959:.1612,1960:-.0912,1961:.1889,1962:-.1081,1963:.1715,1964:.1478,1965:.1058,1966:-.1858,1967:.1506,1968:.0457,1969:-.1524,1970:.0482,1971:.0627,1972:.1476,1973:-.1652,1974:-.2777,1975:.3815,1976:.1774,1977:-.1271,1978:-.0303,1979:.0414,1980:.1493,1981:-.0909,1982:.1976,1983:.2027,1984:-.0365,1985:.2778,1986:.2278,1987:.0227,1988:.1185,1989:.2697,1990:-.0456,1991:.2013,1992:.044,1993:.1372,1994:.0218,1995:.3345,1996:.2601,1997:.2264,1998:.1627,1999:.2516,2e3:-.0617,2001:-.0727,2002:-.1679,2003:.2525,2004:.0333,2005:-.0061,2006:.1618,2007:.0648,2008:-.3355,2009:.1882,2010:.1102,2011:.0556,2012:.0728,2013:.2665,2014:.0775,2015:-.023,2016:.1342,2017:.2511,2018:-.0583,2019:.2234,2020:.0726,2021:.1873,2022:-.0878,2023:.1399,2024:.1299},ta={1928:-.012,1929:.002,1930:-.06,1931:-.094,1932:-.103,1933:.005,1934:.021,1935:.03,1936:.014,1937:.028,1938:-.02,1939:-.014,1940:.01,1941:.099,1942:.09,1943:.03,1944:.023,1945:.023,1946:.186,1947:.087,1948:.03,1949:-.02,1950:.059,1951:.06,1952:.009,1953:.006,1954:-.007,1955:.004,1956:.03,1957:.028,1958:.017,1959:.015,1960:.014,1961:.007,1962:.013,1963:.017,1964:.01,1965:.019,1966:.034,1967:.028,1968:.046,1969:.062,1970:.055,1971:.033,1972:.034,1973:.087,1974:.124,1975:.069,1976:.048,1977:.067,1978:.09,1979:.133,1980:.125,1981:.089,1982:.038,1983:.038,1984:.04,1985:.038,1986:.011,1987:.044,1988:.044,1989:.046,1990:.061,1991:.03,1992:.029,1993:.027,1994:.026,1995:.025,1996:.034,1997:.017,1998:.016,1999:.027,2e3:.034,2001:.016,2002:.024,2003:.019,2004:.033,2005:.034,2006:.025,2007:.041,2008:.001,2009:.027,2010:.015,2011:.03,2012:.017,2013:.015,2014:.008,2015:.007,2016:.021,2017:.021,2018:.019,2019:.023,2020:.012,2021:.07,2022:.065,2023:.032,2024:.029},Zg={GREAT_DEPRESSION:{name:"Great Depression",equity:[-.17,-.34,-.53,-.23,.67,.04,.39,.25,-.38,.28],inflation:[0,-.06,-.09,-.1,.01,.02,.03,.01,.03,-.02],color:"#e74c3c"},STAGFLATION_70S:{name:"Stagflation 70s",equity:[-.17,-.28,.38,.18,-.13,-.03,.04,.15,-.09,.2],inflation:[.09,.12,.07,.05,.07,.09,.13,.13,.09,.04],color:"#e67e22"},LOST_DECADE_2000S:{name:"Lost Decade 2000s",equity:[-.06,-.07,-.17,.25,.03,-.01,.16,.06,-.34,.19],inflation:[.03,.02,.02,.02,.03,.03,.03,.04,0,.03],color:"#9b59b6"},CRISIS_2008:{name:"2008 Crisis",equity:[-.34,.19,.11,.06,.07,.27,.08,-.02,.13,.25],inflation:[0,.03,.02,.03,.02,.02,.01,.01,.02,.02],color:"#3498db"},SYNTHETIC_WORST:{name:"Synthetic Worst",equity:[-.4,.1,.1,.1,-.35,.1,.1,.1,.1,-.3],inflation:[.08,.05,.05,.05,.08,.05,.05,.05,.05,.08],color:"#1abc9c"}},cn={START_MONTH:4,START_DAY:6};function fl(t,e,n,i=Ye.HIGHER_RATE_LIMIT){if(t<=0)return 0;let r=e;if(t>Ye.PA_TAPER_THRESHOLD){const f=(t-Ye.PA_TAPER_THRESHOLD)*Ye.PA_TAPER_RATE;r=Math.max(0,e-f)}const s=Math.max(0,t-r),o=Math.max(0,n-r),l=i-n;let c=0;const d=Math.min(s,o);if(c+=d*Ye.BASIC_RATE,s>o){const f=Math.min(s-o,l);c+=f*Ye.HIGHER_RATE}if(s>o+l){const f=s-o-l;c+=f*Ye.ADDITIONAL_RATE}return c}function Bn(t,e,n,i=Ye.HIGHER_RATE_LIMIT){return t-fl(t,e,n,i)}function ey(t,e,n,i=Ye.HIGHER_RATE_LIMIT){if(t<=0)return 0;let r=t,s=t+1;for(;Bn(s,e,n,i)<t&&s<1e12;)s*=2;for(let o=0;o<60;o++){const l=(r+s)/2;Bn(l,e,n,i)<t?r=l:s=l}return(r+s)/2}function na(t){const e=typeof t=="string"?new Date(t):t,n=e.getFullYear(),i=e.getMonth()+1,r=e.getDate();if(i<cn.START_MONTH||i===cn.START_MONTH&&r<cn.START_DAY){const s=n-1;return`${String(s).slice(-2)}/${String(n).slice(-2)}`}return`${String(n).slice(-2)}/${String(n+1).slice(-2)}`}function Ja(t){const e=parseInt(t.split("/")[0]),n=e<50?2e3+e:1900+e;return new Date(n,cn.START_MONTH-1,cn.START_DAY)}function ty(t){const e=parseInt(t.split("/")[1]),n=e<50?2e3+e:1900+e;return new Date(n,cn.START_MONTH-1,cn.START_DAY-1)}function ny(){const t=new Date;return`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}`}function Zl(t){const[e,n]=t.split("-").map(Number);return new Date(e,n-1,15)}function iy(t){const n=(typeof t=="string"?new Date(t):t).getMonth()+1;return n>=cn.START_MONTH?12-(n-cn.START_MONTH):cn.START_MONTH-n}const ry=Xl.ASSUMED_CPI,sy=Xl.OTHER_INCOME_CAP;function oy(t,e,n=sy){let i=t;for(const r of e)i*=1+Math.min(r,n);return i}const mu={TAX_EFFICIENT:"minimiseEarlyTax",LONGEVITY:"maximiseLongevity"};function ay(t,e){return t<=0?t:t*Math.pow(1+e,1/12)}function ec({targetGross:t,fixedIncome:e=0,pa:n,brl:i,hrl:r,isaBalance:s=0,strategy:o=mu.TAX_EFFICIENT,yearsUntilSp:l=0}){const c=Bn(t,n,i,r),d=Math.max(0,Math.min(i,t)-e),f=Bn(d+e,n,i,r),m=Math.max(0,c-f),p=o===mu.LONGEVITY&&l>0?s/l:1/0,y=Math.max(0,Math.min(m,Math.max(0,s),p)),I=s-y,x=m-y;let A=d;if(x>0){const L=ey(f+x,n,i,r);A=Math.max(d,L-e)}const R=A+e,C=Bn(R,n,i,r);return{sippGross:A,isaDraw:y,remainingIsa:I,taxable:R,tax:R-C,net:C+y}}const ly=5,cy=20,dy=.01;function uy(t){return Math.min(Math.max(0,Math.floor(t)-ly+1),cy)}function Co(t,e="declining"){return e!=="declining"?1:Math.pow(1-dy,uy(t))}function hy(t,e="declining"){if(e!=="declining")return 0;const n=Co(t-1,e);return n===0?0:1-Co(t,e)/n}function Qh(t,e,n=.025){const i=[];let r=t.isaBalance||0;const s=Math.max(0,n-.01);for(let o=0;o<=e;o++){const l=Math.pow(1+n,o),c=t.taxMode==="frozen"?t.pa:t.pa*l,d=t.taxMode==="frozen"?t.brl:t.brl*l,f=t.taxMode==="frozen"?t.hrl||125140:(t.hrl||125140)*l,m=Co(o,t.spendingProfile||"flat"),p=(t.baseSalary||0)*l*m,y=(t.other||0)*l,I=t.statePensionYear!==void 0&&o>=t.statePensionYear?(t.statePension||0)*l:0,x=y+I,A=Math.max(0,(t.statePensionYear??0)-o),R=ec({targetGross:p,fixedIncome:x,pa:c,brl:d,hrl:f,isaBalance:r,strategy:t.isaDrawdownStrategy,yearsUntilSp:A}),C=R.taxable-R.tax,L=r;r=R.remainingIsa*(1+s),i.push({year:o,brl:d,other:y,statePension:I,sippDraw:R.sippGross,totalTaxable:R.taxable,tax:R.tax,netIncome:C,target:p,isaDraw:R.isaDraw,isaBalance:L,spendable:R.net})}return i}function Ln(t,e,n,i,r){if(r){const s=Math.max(0,1-e/n);return t*i*s}return t*i}const Fn={cautious:{key:"cautious",label:"Cautious",equity:.3,bond:.45,cash:.25},balanced:{key:"balanced",label:"Balanced",equity:.5,bond:.4,cash:.1},adventurous:{key:"adventurous",label:"Adventurous",equity:.7,bond:.25,cash:.05}};function ia(t,e,n){if(!t)return null;const i=Math.max(5,n-20),r=Math.min(1,e/i);return t.start+(t.end-t.start)*r}function Cs(t,e,n=.22){const i=t+e;if(i<=0)return{start:0,end:0};const r=t/i;return{start:Math.max(0,r-n),end:r}}const fy=.12;function Jh(t,e,n=null,i=fy){const r=t+e;if(r<=0)return{start:0,end:0};const s=t/r;let o;return n&&n.equityPct+n.bondPct>0?o=n.equityPct/(n.equityPct+n.bondPct):o=Math.min(1,s+i),{start:s,end:o}}function Xh(t){const e=!!(t.subAsset&&t.subAsset.bondWeights&&Object.keys(t.subAsset.bondWeights).length>0),n=t.glideEndgame&&t.glideEndgame.equityPct+t.glideEndgame.bondPct>0?t.glideEndgame:null;return e?Jh(t.equityMin,t.bondMin,n):Cs(t.equityMin,t.bondMin)}function pl(t,e,n){const i=t.cash,r=Math.max(0,1-i),s=ia(t.equityGlide,e,n);return s==null?{equity:t.equity,bond:t.bond,cash:i}:{equity:r*s,bond:r*(1-s),cash:i}}function py(t,e,n){const i=Ln(t.equityMin,e,t.duration,n,!0),r=Ln(t.bondMin,e,t.duration,n,!0),s=Ln(t.cashTarget,e,t.duration,n,!1);return{equity:i,bond:r,cash:s,totalGrowth:i+r,total:i+r+s}}function my(t,e=Xl.ASSUMED_CPI){const n=[],i=t.equityGlideEnabled?Cs(t.equityMin,t.bondMin):null;for(let r=0;r<=t.duration;r++){const s=Math.pow(1+e,r),o=py(t,r,s);let l=o.equity,c=o.bond;if(i){const d=ia(i,r,t.duration),f=l+c;l=f*d,c=f*(1-d)}n.push({year:r,cumulativeInflation:s,equityMin:l,bondMin:c,cashTarget:o.cash,totalMin:l+c+o.cash})}return n}const gy="modulepreload",yy=function(t,e){return new URL(t,e).href},gu={},yu=function(e,n,i){let r=Promise.resolve();if(n&&n.length>0){const o=document.getElementsByTagName("link"),l=document.querySelector("meta[property=csp-nonce]"),c=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));r=Promise.allSettled(n.map(d=>{if(d=yy(d,i),d in gu)return;gu[d]=!0;const f=d.endsWith(".css"),m=f?'[rel="stylesheet"]':"";if(!!i)for(let I=o.length-1;I>=0;I--){const x=o[I];if(x.href===d&&(!f||x.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${d}"]${m}`))return;const y=document.createElement("link");if(y.rel=f?"stylesheet":gy,f||(y.as="script"),y.crossOrigin="",y.href=d,c&&y.setAttribute("nonce",c),document.head.appendChild(y),f)return new Promise((I,x)=>{y.addEventListener("load",I),y.addEventListener("error",()=>x(new Error(`Unable to preload CSS for ${d}`)))})}))}function s(o){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=o,window.dispatchEvent(l),!l.defaultPrevented)throw o}return r.then(o=>{for(const l of o||[])l.status==="rejected"&&s(l.reason);return e().catch(s)})};function tc(t){let e=t;return function(){return e=Math.sin(e)*1e4,e-Math.floor(e)}}function rr(t,e,n){const i=Math.max(n(),1e-12),r=n();let s=Math.sqrt(-2*Math.log(i))*Math.cos(2*Math.PI*r);return s=Math.max(-4,Math.min(4,s)),t+e*s}function ra(t){const e=JSON.stringify(t);let n=0;for(let i=0;i<e.length;i++){const r=e.charCodeAt(i);n=(n<<5)-n+r,n=n&n}return n.toString(16)}var vu={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zh=function(t){const e=[];let n=0;for(let i=0;i<t.length;i++){let r=t.charCodeAt(i);r<128?e[n++]=r:r<2048?(e[n++]=r>>6|192,e[n++]=r&63|128):(r&64512)===55296&&i+1<t.length&&(t.charCodeAt(i+1)&64512)===56320?(r=65536+((r&1023)<<10)+(t.charCodeAt(++i)&1023),e[n++]=r>>18|240,e[n++]=r>>12&63|128,e[n++]=r>>6&63|128,e[n++]=r&63|128):(e[n++]=r>>12|224,e[n++]=r>>6&63|128,e[n++]=r&63|128)}return e},vy=function(t){const e=[];let n=0,i=0;for(;n<t.length;){const r=t[n++];if(r<128)e[i++]=String.fromCharCode(r);else if(r>191&&r<224){const s=t[n++];e[i++]=String.fromCharCode((r&31)<<6|s&63)}else if(r>239&&r<365){const s=t[n++],o=t[n++],l=t[n++],c=((r&7)<<18|(s&63)<<12|(o&63)<<6|l&63)-65536;e[i++]=String.fromCharCode(55296+(c>>10)),e[i++]=String.fromCharCode(56320+(c&1023))}else{const s=t[n++],o=t[n++];e[i++]=String.fromCharCode((r&15)<<12|(s&63)<<6|o&63)}}return e.join("")},ef={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,i=[];for(let r=0;r<t.length;r+=3){const s=t[r],o=r+1<t.length,l=o?t[r+1]:0,c=r+2<t.length,d=c?t[r+2]:0,f=s>>2,m=(s&3)<<4|l>>4;let p=(l&15)<<2|d>>6,y=d&63;c||(y=64,o||(p=64)),i.push(n[f],n[m],n[p],n[y])}return i.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(Zh(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):vy(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,i=[];for(let r=0;r<t.length;){const s=n[t.charAt(r++)],l=r<t.length?n[t.charAt(r)]:0;++r;const d=r<t.length?n[t.charAt(r)]:64;++r;const m=r<t.length?n[t.charAt(r)]:64;if(++r,s==null||l==null||d==null||m==null)throw new by;const p=s<<2|l>>4;if(i.push(p),d!==64){const y=l<<4&240|d>>2;if(i.push(y),m!==64){const I=d<<6&192|m;i.push(I)}}}return i},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class by extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const wy=function(t){const e=Zh(t);return ef.encodeByteArray(e,!0)},Mo=function(t){return wy(t).replace(/\./g,"")},tf=function(t){try{return ef.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function _y(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const Ey=()=>_y().__FIREBASE_DEFAULTS__,Ty=()=>{if(typeof process>"u"||typeof vu>"u")return;const t=vu.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},Iy=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&tf(t[1]);return e&&JSON.parse(e)},sa=()=>{try{return Ey()||Ty()||Iy()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},nf=t=>{var e,n;return(n=(e=sa())===null||e===void 0?void 0:e.emulatorHosts)===null||n===void 0?void 0:n[t]},xy=t=>{const e=nf(t);if(!e)return;const n=e.lastIndexOf(":");if(n<=0||n+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const i=parseInt(e.substring(n+1),10);return e[0]==="["?[e.substring(1,n-1),i]:[e.substring(0,n),i]},rf=()=>{var t;return(t=sa())===null||t===void 0?void 0:t.config},sf=t=>{var e;return(e=sa())===null||e===void 0?void 0:e[`_${t}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sy{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,i)=>{n?this.reject(n):this.resolve(i),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,i))}}}/**
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
 */function Ay(t,e){if(t.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n={alg:"none",type:"JWT"},i=e||"demo-project",r=t.iat||0,s=t.sub||t.user_id;if(!s)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${i}`,aud:i,iat:r,exp:r+3600,auth_time:r,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}}},t);return[Mo(JSON.stringify(n)),Mo(JSON.stringify(o)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lt(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function ky(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(lt())}function Ry(){var t;const e=(t=sa())===null||t===void 0?void 0:t.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Py(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Cy(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function My(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Dy(){const t=lt();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function By(){return!Ry()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Ly(){try{return typeof indexedDB=="object"}catch{return!1}}function Ny(){return new Promise((t,e)=>{try{let n=!0;const i="validate-browser-context-for-indexeddb-analytics-module",r=self.indexedDB.open(i);r.onsuccess=()=>{r.result.close(),n||self.indexedDB.deleteDatabase(i),t(!0)},r.onupgradeneeded=()=>{n=!1},r.onerror=()=>{var s;e(((s=r.error)===null||s===void 0?void 0:s.message)||"")}}catch(n){e(n)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Oy="FirebaseError";class Wn extends Error{constructor(e,n,i){super(n),this.code=e,this.customData=i,this.name=Oy,Object.setPrototypeOf(this,Wn.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Ms.prototype.create)}}class Ms{constructor(e,n,i){this.service=e,this.serviceName=n,this.errors=i}create(e,...n){const i=n[0]||{},r=`${this.service}/${e}`,s=this.errors[e],o=s?Fy(s,i):"Error",l=`${this.serviceName}: ${o} (${r}).`;return new Wn(r,l,i)}}function Fy(t,e){return t.replace(Vy,(n,i)=>{const r=e[i];return r!=null?String(r):`<${i}?>`})}const Vy=/\{\$([^}]+)}/g;function zy(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function Do(t,e){if(t===e)return!0;const n=Object.keys(t),i=Object.keys(e);for(const r of n){if(!i.includes(r))return!1;const s=t[r],o=e[r];if(bu(s)&&bu(o)){if(!Do(s,o))return!1}else if(s!==o)return!1}for(const r of i)if(!n.includes(r))return!1;return!0}function bu(t){return t!==null&&typeof t=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ds(t){const e=[];for(const[n,i]of Object.entries(t))Array.isArray(i)?i.forEach(r=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(r))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(i));return e.length?"&"+e.join("&"):""}function Zr(t){const e={};return t.replace(/^\?/,"").split("&").forEach(i=>{if(i){const[r,s]=i.split("=");e[decodeURIComponent(r)]=decodeURIComponent(s)}}),e}function es(t){const e=t.indexOf("?");if(!e)return"";const n=t.indexOf("#",e);return t.substring(e,n>0?n:void 0)}function $y(t,e){const n=new Uy(t,e);return n.subscribe.bind(n)}class Uy{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(i=>{this.error(i)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,i){let r;if(e===void 0&&n===void 0&&i===void 0)throw new Error("Missing Observer.");qy(e,["next","error","complete"])?r=e:r={next:e,error:n,complete:i},r.next===void 0&&(r.next=Xa),r.error===void 0&&(r.error=Xa),r.complete===void 0&&(r.complete=Xa);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?r.error(this.finalError):r.complete()}catch{}}),this.observers.push(r),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(i){typeof console<"u"&&console.error&&console.error(i)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function qy(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function Xa(){}/**
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
 */function Be(t){return t&&t._delegate?t._delegate:t}class $i{constructor(e,n,i){this.name=e,this.instanceFactory=n,this.type=i,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ci="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hy{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const i=new Sy;if(this.instancesDeferred.set(n,i),this.isInitialized(n)||this.shouldAutoInitialize())try{const r=this.getOrInitializeService({instanceIdentifier:n});r&&i.resolve(r)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){var n;const i=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(n=e==null?void 0:e.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(i)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:i})}catch(s){if(r)return null;throw s}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Yy(e))try{this.getOrInitializeService({instanceIdentifier:Ci})}catch{}for(const[n,i]of this.instancesDeferred.entries()){const r=this.normalizeInstanceIdentifier(n);try{const s=this.getOrInitializeService({instanceIdentifier:r});i.resolve(s)}catch{}}}}clearInstance(e=Ci){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Ci){return this.instances.has(e)}getOptions(e=Ci){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,i=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(i))throw Error(`${this.name}(${i}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const r=this.getOrInitializeService({instanceIdentifier:i,options:n});for(const[s,o]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(s);i===l&&o.resolve(r)}return r}onInit(e,n){var i;const r=this.normalizeInstanceIdentifier(n),s=(i=this.onInitCallbacks.get(r))!==null&&i!==void 0?i:new Set;s.add(e),this.onInitCallbacks.set(r,s);const o=this.instances.get(r);return o&&e(o,r),()=>{s.delete(e)}}invokeOnInitCallbacks(e,n){const i=this.onInitCallbacks.get(n);if(i)for(const r of i)try{r(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let i=this.instances.get(e);if(!i&&this.component&&(i=this.component.instanceFactory(this.container,{instanceIdentifier:Wy(e),options:n}),this.instances.set(e,i),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(i,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,i)}catch{}return i||null}normalizeInstanceIdentifier(e=Ci){return this.component?this.component.multipleInstances?e:Ci:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Wy(t){return t===Ci?void 0:t}function Yy(t){return t.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jy{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new Hy(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var oe;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(oe||(oe={}));const Gy={debug:oe.DEBUG,verbose:oe.VERBOSE,info:oe.INFO,warn:oe.WARN,error:oe.ERROR,silent:oe.SILENT},Ky=oe.INFO,Qy={[oe.DEBUG]:"log",[oe.VERBOSE]:"log",[oe.INFO]:"info",[oe.WARN]:"warn",[oe.ERROR]:"error"},Jy=(t,e,...n)=>{if(e<t.logLevel)return;const i=new Date().toISOString(),r=Qy[e];if(r)console[r](`[${i}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class nc{constructor(e){this.name=e,this._logLevel=Ky,this._logHandler=Jy,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in oe))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Gy[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,oe.DEBUG,...e),this._logHandler(this,oe.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,oe.VERBOSE,...e),this._logHandler(this,oe.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,oe.INFO,...e),this._logHandler(this,oe.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,oe.WARN,...e),this._logHandler(this,oe.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,oe.ERROR,...e),this._logHandler(this,oe.ERROR,...e)}}const Xy=(t,e)=>e.some(n=>t instanceof n);let wu,_u;function Zy(){return wu||(wu=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function ev(){return _u||(_u=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const of=new WeakMap,ml=new WeakMap,af=new WeakMap,Za=new WeakMap,ic=new WeakMap;function tv(t){const e=new Promise((n,i)=>{const r=()=>{t.removeEventListener("success",s),t.removeEventListener("error",o)},s=()=>{n(ui(t.result)),r()},o=()=>{i(t.error),r()};t.addEventListener("success",s),t.addEventListener("error",o)});return e.then(n=>{n instanceof IDBCursor&&of.set(n,t)}).catch(()=>{}),ic.set(e,t),e}function nv(t){if(ml.has(t))return;const e=new Promise((n,i)=>{const r=()=>{t.removeEventListener("complete",s),t.removeEventListener("error",o),t.removeEventListener("abort",o)},s=()=>{n(),r()},o=()=>{i(t.error||new DOMException("AbortError","AbortError")),r()};t.addEventListener("complete",s),t.addEventListener("error",o),t.addEventListener("abort",o)});ml.set(t,e)}let gl={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return ml.get(t);if(e==="objectStoreNames")return t.objectStoreNames||af.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return ui(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function iv(t){gl=t(gl)}function rv(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const i=t.call(el(this),e,...n);return af.set(i,e.sort?e.sort():[e]),ui(i)}:ev().includes(t)?function(...e){return t.apply(el(this),e),ui(of.get(this))}:function(...e){return ui(t.apply(el(this),e))}}function sv(t){return typeof t=="function"?rv(t):(t instanceof IDBTransaction&&nv(t),Xy(t,Zy())?new Proxy(t,gl):t)}function ui(t){if(t instanceof IDBRequest)return tv(t);if(Za.has(t))return Za.get(t);const e=sv(t);return e!==t&&(Za.set(t,e),ic.set(e,t)),e}const el=t=>ic.get(t);function ov(t,e,{blocked:n,upgrade:i,blocking:r,terminated:s}={}){const o=indexedDB.open(t,e),l=ui(o);return i&&o.addEventListener("upgradeneeded",c=>{i(ui(o.result),c.oldVersion,c.newVersion,ui(o.transaction),c)}),n&&o.addEventListener("blocked",c=>n(c.oldVersion,c.newVersion,c)),l.then(c=>{s&&c.addEventListener("close",()=>s()),r&&c.addEventListener("versionchange",d=>r(d.oldVersion,d.newVersion,d))}).catch(()=>{}),l}const av=["get","getKey","getAll","getAllKeys","count"],lv=["put","add","delete","clear"],tl=new Map;function Eu(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(tl.get(e))return tl.get(e);const n=e.replace(/FromIndex$/,""),i=e!==n,r=lv.includes(n);if(!(n in(i?IDBIndex:IDBObjectStore).prototype)||!(r||av.includes(n)))return;const s=async function(o,...l){const c=this.transaction(o,r?"readwrite":"readonly");let d=c.store;return i&&(d=d.index(l.shift())),(await Promise.all([d[n](...l),r&&c.done]))[0]};return tl.set(e,s),s}iv(t=>({...t,get:(e,n,i)=>Eu(e,n)||t.get(e,n,i),has:(e,n)=>!!Eu(e,n)||t.has(e,n)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cv{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(dv(n)){const i=n.getImmediate();return`${i.library}/${i.version}`}else return null}).filter(n=>n).join(" ")}}function dv(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const yl="@firebase/app",Tu="0.10.13";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vn=new nc("@firebase/app"),uv="@firebase/app-compat",hv="@firebase/analytics-compat",fv="@firebase/analytics",pv="@firebase/app-check-compat",mv="@firebase/app-check",gv="@firebase/auth",yv="@firebase/auth-compat",vv="@firebase/database",bv="@firebase/data-connect",wv="@firebase/database-compat",_v="@firebase/functions",Ev="@firebase/functions-compat",Tv="@firebase/installations",Iv="@firebase/installations-compat",xv="@firebase/messaging",Sv="@firebase/messaging-compat",Av="@firebase/performance",kv="@firebase/performance-compat",Rv="@firebase/remote-config",Pv="@firebase/remote-config-compat",Cv="@firebase/storage",Mv="@firebase/storage-compat",Dv="@firebase/firestore",Bv="@firebase/vertexai-preview",Lv="@firebase/firestore-compat",Nv="firebase",Ov="10.14.1";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vl="[DEFAULT]",Fv={[yl]:"fire-core",[uv]:"fire-core-compat",[fv]:"fire-analytics",[hv]:"fire-analytics-compat",[mv]:"fire-app-check",[pv]:"fire-app-check-compat",[gv]:"fire-auth",[yv]:"fire-auth-compat",[vv]:"fire-rtdb",[bv]:"fire-data-connect",[wv]:"fire-rtdb-compat",[_v]:"fire-fn",[Ev]:"fire-fn-compat",[Tv]:"fire-iid",[Iv]:"fire-iid-compat",[xv]:"fire-fcm",[Sv]:"fire-fcm-compat",[Av]:"fire-perf",[kv]:"fire-perf-compat",[Rv]:"fire-rc",[Pv]:"fire-rc-compat",[Cv]:"fire-gcs",[Mv]:"fire-gcs-compat",[Dv]:"fire-fst",[Lv]:"fire-fst-compat",[Bv]:"fire-vertex","fire-js":"fire-js",[Nv]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bo=new Map,Vv=new Map,bl=new Map;function Iu(t,e){try{t.container.addComponent(e)}catch(n){Vn.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function yr(t){const e=t.name;if(bl.has(e))return Vn.debug(`There were multiple attempts to register component ${e}.`),!1;bl.set(e,t);for(const n of Bo.values())Iu(n,t);for(const n of Vv.values())Iu(n,t);return!0}function rc(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function Kt(t){return t.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zv={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},hi=new Ms("app","Firebase",zv);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $v{constructor(e,n,i){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=i,this.container.addComponent(new $i("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw hi.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rr=Ov;function lf(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const i=Object.assign({name:vl,automaticDataCollectionEnabled:!1},e),r=i.name;if(typeof r!="string"||!r)throw hi.create("bad-app-name",{appName:String(r)});if(n||(n=rf()),!n)throw hi.create("no-options");const s=Bo.get(r);if(s){if(Do(n,s.options)&&Do(i,s.config))return s;throw hi.create("duplicate-app",{appName:r})}const o=new jy(r);for(const c of bl.values())o.addComponent(c);const l=new $v(n,i,o);return Bo.set(r,l),l}function cf(t=vl){const e=Bo.get(t);if(!e&&t===vl&&rf())return lf();if(!e)throw hi.create("no-app",{appName:t});return e}function fi(t,e,n){var i;let r=(i=Fv[t])!==null&&i!==void 0?i:t;n&&(r+=`-${n}`);const s=r.match(/\s|\//),o=e.match(/\s|\//);if(s||o){const l=[`Unable to register library "${r}" with version "${e}":`];s&&l.push(`library name "${r}" contains illegal characters (whitespace or "/")`),s&&o&&l.push("and"),o&&l.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Vn.warn(l.join(" "));return}yr(new $i(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
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
 */const Uv="firebase-heartbeat-database",qv=1,ms="firebase-heartbeat-store";let nl=null;function df(){return nl||(nl=ov(Uv,qv,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(ms)}catch(n){console.warn(n)}}}}).catch(t=>{throw hi.create("idb-open",{originalErrorMessage:t.message})})),nl}async function Hv(t){try{const n=(await df()).transaction(ms),i=await n.objectStore(ms).get(uf(t));return await n.done,i}catch(e){if(e instanceof Wn)Vn.warn(e.message);else{const n=hi.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Vn.warn(n.message)}}}async function xu(t,e){try{const i=(await df()).transaction(ms,"readwrite");await i.objectStore(ms).put(e,uf(t)),await i.done}catch(n){if(n instanceof Wn)Vn.warn(n.message);else{const i=hi.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});Vn.warn(i.message)}}}function uf(t){return`${t.name}!${t.options.appId}`}/**
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
 */const Wv=1024,Yv=30*24*60*60*1e3;class jv{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new Kv(n),this._heartbeatsCachePromise=this._storage.read().then(i=>(this._heartbeatsCache=i,i))}async triggerHeartbeat(){var e,n;try{const r=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=Su();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)===null||n===void 0?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(o=>o.date===s)?void 0:(this._heartbeatsCache.heartbeats.push({date:s,agent:r}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(o=>{const l=new Date(o.date).valueOf();return Date.now()-l<=Yv}),this._storage.overwrite(this._heartbeatsCache))}catch(i){Vn.warn(i)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=Su(),{heartbeatsToSend:i,unsentEntries:r}=Gv(this._heartbeatsCache.heartbeats),s=Mo(JSON.stringify({version:2,heartbeats:i}));return this._heartbeatsCache.lastSentHeartbeatDate=n,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(n){return Vn.warn(n),""}}}function Su(){return new Date().toISOString().substring(0,10)}function Gv(t,e=Wv){const n=[];let i=t.slice();for(const r of t){const s=n.find(o=>o.agent===r.agent);if(s){if(s.dates.push(r.date),Au(n)>e){s.dates.pop();break}}else if(n.push({agent:r.agent,dates:[r.date]}),Au(n)>e){n.pop();break}i=i.slice(1)}return{heartbeatsToSend:n,unsentEntries:i}}class Kv{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Ly()?Ny().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await Hv(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var n;if(await this._canUseIndexedDBPromise){const r=await this.read();return xu(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var n;if(await this._canUseIndexedDBPromise){const r=await this.read();return xu(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function Au(t){return Mo(JSON.stringify({version:2,heartbeats:t})).length}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qv(t){yr(new $i("platform-logger",e=>new cv(e),"PRIVATE")),yr(new $i("heartbeat",e=>new jv(e),"PRIVATE")),fi(yl,Tu,t),fi(yl,Tu,"esm2017"),fi("fire-js","")}Qv("");var Jv="firebase",Xv="10.14.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */fi(Jv,Xv,"app");function sc(t,e){var n={};for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&e.indexOf(i)<0&&(n[i]=t[i]);if(t!=null&&typeof Object.getOwnPropertySymbols=="function")for(var r=0,i=Object.getOwnPropertySymbols(t);r<i.length;r++)e.indexOf(i[r])<0&&Object.prototype.propertyIsEnumerable.call(t,i[r])&&(n[i[r]]=t[i[r]]);return n}function hf(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Zv=hf,ff=new Ms("auth","Firebase",hf());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lo=new nc("@firebase/auth");function e0(t,...e){Lo.logLevel<=oe.WARN&&Lo.warn(`Auth (${Rr}): ${t}`,...e)}function bo(t,...e){Lo.logLevel<=oe.ERROR&&Lo.error(`Auth (${Rr}): ${t}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $t(t,...e){throw ac(t,...e)}function Jt(t,...e){return ac(t,...e)}function oc(t,e,n){const i=Object.assign(Object.assign({},Zv()),{[e]:n});return new Ms("auth","Firebase",i).create(e,{appName:t.name})}function Nn(t){return oc(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function t0(t,e,n){const i=n;if(!(e instanceof i))throw i.name!==e.constructor.name&&$t(t,"argument-error"),oc(t,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function ac(t,...e){if(typeof t!="string"){const n=e[0],i=[...e.slice(1)];return i[0]&&(i[0].appName=t.name),t._errorFactory.create(n,...i)}return ff.create(t,...e)}function Y(t,e,...n){if(!t)throw ac(e,...n)}function Pn(t){const e="INTERNAL ASSERTION FAILED: "+t;throw bo(e),new Error(e)}function zn(t,e){t||Pn(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wl(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.href)||""}function n0(){return ku()==="http:"||ku()==="https:"}function ku(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function i0(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(n0()||Cy()||"connection"in navigator)?navigator.onLine:!0}function r0(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bs{constructor(e,n){this.shortDelay=e,this.longDelay=n,zn(n>e,"Short delay should be less than long delay!"),this.isMobile=ky()||My()}get(){return i0()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lc(t,e){zn(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pf{static initialize(e,n,i){this.fetchImpl=e,n&&(this.headersImpl=n),i&&(this.responseImpl=i)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Pn("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Pn("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Pn("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const s0={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const o0=new Bs(3e4,6e4);function Yn(t,e){return t.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:t.tenantId}):e}async function gn(t,e,n,i,r={}){return mf(t,r,async()=>{let s={},o={};i&&(e==="GET"?o=i:s={body:JSON.stringify(i)});const l=Ds(Object.assign({key:t.config.apiKey},o)).slice(1),c=await t._getAdditionalHeaders();c["Content-Type"]="application/json",t.languageCode&&(c["X-Firebase-Locale"]=t.languageCode);const d=Object.assign({method:e,headers:c},s);return Py()||(d.referrerPolicy="no-referrer"),pf.fetch()(gf(t,t.config.apiHost,n,l),d)})}async function mf(t,e,n){t._canInitEmulator=!1;const i=Object.assign(Object.assign({},s0),e);try{const r=new l0(t),s=await Promise.race([n(),r.promise]);r.clearNetworkTimeout();const o=await s.json();if("needConfirmation"in o)throw fo(t,"account-exists-with-different-credential",o);if(s.ok&&!("errorMessage"in o))return o;{const l=s.ok?o.errorMessage:o.error.message,[c,d]=l.split(" : ");if(c==="FEDERATED_USER_ID_ALREADY_LINKED")throw fo(t,"credential-already-in-use",o);if(c==="EMAIL_EXISTS")throw fo(t,"email-already-in-use",o);if(c==="USER_DISABLED")throw fo(t,"user-disabled",o);const f=i[c]||c.toLowerCase().replace(/[_\s]+/g,"-");if(d)throw oc(t,f,d);$t(t,f)}}catch(r){if(r instanceof Wn)throw r;$t(t,"network-request-failed",{message:String(r)})}}async function Ls(t,e,n,i,r={}){const s=await gn(t,e,n,i,r);return"mfaPendingCredential"in s&&$t(t,"multi-factor-auth-required",{_serverResponse:s}),s}function gf(t,e,n,i){const r=`${e}${n}?${i}`;return t.config.emulator?lc(t.config,r):`${t.config.apiScheme}://${r}`}function a0(t){switch(t){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class l0{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,i)=>{this.timer=setTimeout(()=>i(Jt(this.auth,"network-request-failed")),o0.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function fo(t,e,n){const i={appName:t.name};n.email&&(i.email=n.email),n.phoneNumber&&(i.phoneNumber=n.phoneNumber);const r=Jt(t,e,i);return r.customData._tokenResponse=n,r}function Ru(t){return t!==void 0&&t.enterprise!==void 0}class c0{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const n of this.recaptchaEnforcementState)if(n.provider&&n.provider===e)return a0(n.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}}async function d0(t,e){return gn(t,"GET","/v2/recaptchaConfig",Yn(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function u0(t,e){return gn(t,"POST","/v1/accounts:delete",e)}async function yf(t,e){return gn(t,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function as(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function h0(t,e=!1){const n=Be(t),i=await n.getIdToken(e),r=cc(i);Y(r&&r.exp&&r.auth_time&&r.iat,n.auth,"internal-error");const s=typeof r.firebase=="object"?r.firebase:void 0,o=s==null?void 0:s.sign_in_provider;return{claims:r,token:i,authTime:as(il(r.auth_time)),issuedAtTime:as(il(r.iat)),expirationTime:as(il(r.exp)),signInProvider:o||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function il(t){return Number(t)*1e3}function cc(t){const[e,n,i]=t.split(".");if(e===void 0||n===void 0||i===void 0)return bo("JWT malformed, contained fewer than 3 sections"),null;try{const r=tf(n);return r?JSON.parse(r):(bo("Failed to decode base64 JWT payload"),null)}catch(r){return bo("Caught error parsing JWT payload as JSON",r==null?void 0:r.toString()),null}}function Pu(t){const e=cc(t);return Y(e,"internal-error"),Y(typeof e.exp<"u","internal-error"),Y(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function vr(t,e,n=!1){if(n)return e;try{return await e}catch(i){throw i instanceof Wn&&f0(i)&&t.auth.currentUser===t&&await t.auth.signOut(),i}}function f0({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class p0{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var n;if(e){const i=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),i}else{this.errorBackoff=3e4;const r=((n=this.user.stsTokenManager.expirationTime)!==null&&n!==void 0?n:0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _l{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=as(this.lastLoginAt),this.creationTime=as(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function No(t){var e;const n=t.auth,i=await t.getIdToken(),r=await vr(t,yf(n,{idToken:i}));Y(r==null?void 0:r.users.length,n,"internal-error");const s=r.users[0];t._notifyReloadListener(s);const o=!((e=s.providerUserInfo)===null||e===void 0)&&e.length?vf(s.providerUserInfo):[],l=g0(t.providerData,o),c=t.isAnonymous,d=!(t.email&&s.passwordHash)&&!(l!=null&&l.length),f=c?d:!1,m={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:l,metadata:new _l(s.createdAt,s.lastLoginAt),isAnonymous:f};Object.assign(t,m)}async function m0(t){const e=Be(t);await No(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function g0(t,e){return[...t.filter(i=>!e.some(r=>r.providerId===i.providerId)),...e]}function vf(t){return t.map(e=>{var{providerId:n}=e,i=sc(e,["providerId"]);return{providerId:n,uid:i.rawId||"",displayName:i.displayName||null,email:i.email||null,phoneNumber:i.phoneNumber||null,photoURL:i.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function y0(t,e){const n=await mf(t,{},async()=>{const i=Ds({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:r,apiKey:s}=t.config,o=gf(t,r,"/v1/token",`key=${s}`),l=await t._getAdditionalHeaders();return l["Content-Type"]="application/x-www-form-urlencoded",pf.fetch()(o,{method:"POST",headers:l,body:i})});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function v0(t,e){return gn(t,"POST","/v2/accounts:revokeToken",Yn(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cr{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){Y(e.idToken,"internal-error"),Y(typeof e.idToken<"u","internal-error"),Y(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Pu(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){Y(e.length!==0,"internal-error");const n=Pu(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(Y(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:i,refreshToken:r,expiresIn:s}=await y0(e,n);this.updateTokensAndExpiration(i,r,Number(s))}updateTokensAndExpiration(e,n,i){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+i*1e3}static fromJSON(e,n){const{refreshToken:i,accessToken:r,expirationTime:s}=n,o=new cr;return i&&(Y(typeof i=="string","internal-error",{appName:e}),o.refreshToken=i),r&&(Y(typeof r=="string","internal-error",{appName:e}),o.accessToken=r),s&&(Y(typeof s=="number","internal-error",{appName:e}),o.expirationTime=s),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new cr,this.toJSON())}_performRefresh(){return Pn("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ii(t,e){Y(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class Cn{constructor(e){var{uid:n,auth:i,stsTokenManager:r}=e,s=sc(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new p0(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=n,this.auth=i,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new _l(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const n=await vr(this,this.stsTokenManager.getToken(this.auth,e));return Y(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return h0(this,e)}reload(){return m0(this)}_assign(e){this!==e&&(Y(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>Object.assign({},n)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new Cn(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return n.metadata._copy(this.metadata),n}_onReload(e){Y(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let i=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),i=!0),n&&await No(this),await this.auth._persistUserIfCurrent(this),i&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Kt(this.auth.app))return Promise.reject(Nn(this.auth));const e=await this.getIdToken();return await vr(this,u0(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){var i,r,s,o,l,c,d,f;const m=(i=n.displayName)!==null&&i!==void 0?i:void 0,p=(r=n.email)!==null&&r!==void 0?r:void 0,y=(s=n.phoneNumber)!==null&&s!==void 0?s:void 0,I=(o=n.photoURL)!==null&&o!==void 0?o:void 0,x=(l=n.tenantId)!==null&&l!==void 0?l:void 0,A=(c=n._redirectEventId)!==null&&c!==void 0?c:void 0,R=(d=n.createdAt)!==null&&d!==void 0?d:void 0,C=(f=n.lastLoginAt)!==null&&f!==void 0?f:void 0,{uid:L,emailVerified:N,isAnonymous:z,providerData:q,stsTokenManager:T}=n;Y(L&&T,e,"internal-error");const v=cr.fromJSON(this.name,T);Y(typeof L=="string",e,"internal-error"),ii(m,e.name),ii(p,e.name),Y(typeof N=="boolean",e,"internal-error"),Y(typeof z=="boolean",e,"internal-error"),ii(y,e.name),ii(I,e.name),ii(x,e.name),ii(A,e.name),ii(R,e.name),ii(C,e.name);const _=new Cn({uid:L,auth:e,email:p,emailVerified:N,displayName:m,isAnonymous:z,photoURL:I,phoneNumber:y,tenantId:x,stsTokenManager:v,createdAt:R,lastLoginAt:C});return q&&Array.isArray(q)&&(_.providerData=q.map(w=>Object.assign({},w))),A&&(_._redirectEventId=A),_}static async _fromIdTokenResponse(e,n,i=!1){const r=new cr;r.updateFromServerResponse(n);const s=new Cn({uid:n.localId,auth:e,stsTokenManager:r,isAnonymous:i});return await No(s),s}static async _fromGetAccountInfoResponse(e,n,i){const r=n.users[0];Y(r.localId!==void 0,"internal-error");const s=r.providerUserInfo!==void 0?vf(r.providerUserInfo):[],o=!(r.email&&r.passwordHash)&&!(s!=null&&s.length),l=new cr;l.updateFromIdToken(i);const c=new Cn({uid:r.localId,auth:e,stsTokenManager:l,isAnonymous:o}),d={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:s,metadata:new _l(r.createdAt,r.lastLoginAt),isAnonymous:!(r.email&&r.passwordHash)&&!(s!=null&&s.length)};return Object.assign(c,d),c}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cu=new Map;function Mn(t){zn(t instanceof Function,"Expected a class definition");let e=Cu.get(t);return e?(zn(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,Cu.set(t,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bf{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}bf.type="NONE";const Mu=bf;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wo(t,e,n){return`firebase:${t}:${e}:${n}`}class dr{constructor(e,n,i){this.persistence=e,this.auth=n,this.userKey=i;const{config:r,name:s}=this.auth;this.fullUserKey=wo(this.userKey,r.apiKey,s),this.fullPersistenceKey=wo("persistence",r.apiKey,s),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?Cn._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,i="authUser"){if(!n.length)return new dr(Mn(Mu),e,i);const r=(await Promise.all(n.map(async d=>{if(await d._isAvailable())return d}))).filter(d=>d);let s=r[0]||Mn(Mu);const o=wo(i,e.config.apiKey,e.name);let l=null;for(const d of n)try{const f=await d._get(o);if(f){const m=Cn._fromJSON(e,f);d!==s&&(l=m),s=d;break}}catch{}const c=r.filter(d=>d._shouldAllowMigration);return!s._shouldAllowMigration||!c.length?new dr(s,e,i):(s=c[0],l&&await s._set(o,l.toJSON()),await Promise.all(n.map(async d=>{if(d!==s)try{await d._remove(o)}catch{}})),new dr(s,e,i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Du(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Tf(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(wf(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(xf(e))return"Blackberry";if(Sf(e))return"Webos";if(_f(e))return"Safari";if((e.includes("chrome/")||Ef(e))&&!e.includes("edge/"))return"Chrome";if(If(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,i=t.match(n);if((i==null?void 0:i.length)===2)return i[1]}return"Other"}function wf(t=lt()){return/firefox\//i.test(t)}function _f(t=lt()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Ef(t=lt()){return/crios\//i.test(t)}function Tf(t=lt()){return/iemobile/i.test(t)}function If(t=lt()){return/android/i.test(t)}function xf(t=lt()){return/blackberry/i.test(t)}function Sf(t=lt()){return/webos/i.test(t)}function dc(t=lt()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function b0(t=lt()){var e;return dc(t)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function w0(){return Dy()&&document.documentMode===10}function Af(t=lt()){return dc(t)||If(t)||Sf(t)||xf(t)||/windows phone/i.test(t)||Tf(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kf(t,e=[]){let n;switch(t){case"Browser":n=Du(lt());break;case"Worker":n=`${Du(lt())}-${t}`;break;default:n=t}const i=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${Rr}/${i}`}/**
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
 */class _0{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const i=s=>new Promise((o,l)=>{try{const c=e(s);o(c)}catch(c){l(c)}});i.onAbort=n,this.queue.push(i);const r=this.queue.length-1;return()=>{this.queue[r]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const i of this.queue)await i(e),i.onAbort&&n.push(i.onAbort)}catch(i){n.reverse();for(const r of n)try{r()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:i==null?void 0:i.message})}}}/**
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
 */async function E0(t,e={}){return gn(t,"GET","/v2/passwordPolicy",Yn(t,e))}/**
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
 */const T0=6;class I0{constructor(e){var n,i,r,s;const o=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(n=o.minPasswordLength)!==null&&n!==void 0?n:T0,o.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=o.maxPasswordLength),o.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=o.containsLowercaseCharacter),o.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=o.containsUppercaseCharacter),o.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=o.containsNumericCharacter),o.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=o.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(r=(i=e.allowedNonAlphanumericCharacters)===null||i===void 0?void 0:i.join(""))!==null&&r!==void 0?r:"",this.forceUpgradeOnSignin=(s=e.forceUpgradeOnSignin)!==null&&s!==void 0?s:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var n,i,r,s,o,l;const c={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,c),this.validatePasswordCharacterOptions(e,c),c.isValid&&(c.isValid=(n=c.meetsMinPasswordLength)!==null&&n!==void 0?n:!0),c.isValid&&(c.isValid=(i=c.meetsMaxPasswordLength)!==null&&i!==void 0?i:!0),c.isValid&&(c.isValid=(r=c.containsLowercaseLetter)!==null&&r!==void 0?r:!0),c.isValid&&(c.isValid=(s=c.containsUppercaseLetter)!==null&&s!==void 0?s:!0),c.isValid&&(c.isValid=(o=c.containsNumericCharacter)!==null&&o!==void 0?o:!0),c.isValid&&(c.isValid=(l=c.containsNonAlphanumericCharacter)!==null&&l!==void 0?l:!0),c}validatePasswordLengthOptions(e,n){const i=this.customStrengthOptions.minPasswordLength,r=this.customStrengthOptions.maxPasswordLength;i&&(n.meetsMinPasswordLength=e.length>=i),r&&(n.meetsMaxPasswordLength=e.length<=r)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let i;for(let r=0;r<e.length;r++)i=e.charAt(r),this.updatePasswordCharacterOptionsStatuses(n,i>="a"&&i<="z",i>="A"&&i<="Z",i>="0"&&i<="9",this.allowedNonAlphanumericCharacters.includes(i))}updatePasswordCharacterOptionsStatuses(e,n,i,r,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=i)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=r)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class x0{constructor(e,n,i,r){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=i,this.config=r,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Bu(this),this.idTokenSubscription=new Bu(this),this.beforeStateQueue=new _0(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=ff,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=r.sdkClientVersion}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=Mn(n)),this._initializationPromise=this.queue(async()=>{var i,r;if(!this._deleted&&(this.persistenceManager=await dr.create(this,e),!this._deleted)){if(!((i=this._popupRedirectResolver)===null||i===void 0)&&i._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((r=this.currentUser)===null||r===void 0?void 0:r.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await yf(this,{idToken:e}),i=await Cn._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(i)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var n;if(Kt(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(l=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(l,l))}):this.directlySetCurrentUser(null)}const i=await this.assertedPersistence.getCurrentUser();let r=i,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(n=this.redirectUser)===null||n===void 0?void 0:n._redirectEventId,l=r==null?void 0:r._redirectEventId,c=await this.tryRedirectSignIn(e);(!o||o===l)&&(c!=null&&c.user)&&(r=c.user,s=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(r)}catch(o){r=i,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return Y(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await No(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=r0()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Kt(this.app))return Promise.reject(Nn(this));const n=e?Be(e):null;return n&&Y(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&Y(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Kt(this.app)?Promise.reject(Nn(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Kt(this.app)?Promise.reject(Nn(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Mn(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await E0(this),n=new I0(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new Ms("auth","Firebase",e())}onAuthStateChanged(e,n,i){return this.registerStateListener(this.authStateSubscription,e,n,i)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,i){return this.registerStateListener(this.idTokenSubscription,e,n,i)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const i=this.onAuthStateChanged(()=>{i(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),i={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(i.tenantId=this.tenantId),await v0(this,i)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,n){const i=await this.getOrInitRedirectPersistenceManager(n);return e===null?i.removeCurrentUser():i.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&Mn(e)||this._popupRedirectResolver;Y(n,this,"argument-error"),this.redirectPersistenceManager=await dr.create(this,[Mn(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,i;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)===null||n===void 0?void 0:n._redirectEventId)===e?this._currentUser:((i=this.redirectUser)===null||i===void 0?void 0:i._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const i=(n=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&n!==void 0?n:null;this.lastNotifiedUid!==i&&(this.lastNotifiedUid=i,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,i,r){if(this._deleted)return()=>{};const s=typeof n=="function"?n:n.next.bind(n);let o=!1;const l=this._isInitialized?Promise.resolve():this._initializationPromise;if(Y(l,this,"internal-error"),l.then(()=>{o||s(this.currentUser)}),typeof n=="function"){const c=e.addObserver(n,i,r);return()=>{o=!0,c()}}else{const c=e.addObserver(n);return()=>{o=!0,c()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return Y(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=kf(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const n={"X-Client-Version":this.clientVersion};this.app.options.appId&&(n["X-Firebase-gmpid"]=this.app.options.appId);const i=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());i&&(n["X-Firebase-Client"]=i);const r=await this._getAppCheckToken();return r&&(n["X-Firebase-AppCheck"]=r),n}async _getAppCheckToken(){var e;const n=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return n!=null&&n.error&&e0(`Error while retrieving App Check token: ${n.error}`),n==null?void 0:n.token}}function jn(t){return Be(t)}class Bu{constructor(e){this.auth=e,this.observer=null,this.addObserver=$y(n=>this.observer=n)}get next(){return Y(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let oa={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function S0(t){oa=t}function Rf(t){return oa.loadJS(t)}function A0(){return oa.recaptchaEnterpriseScript}function k0(){return oa.gapiScript}function R0(t){return`__${t}${Math.floor(Math.random()*1e6)}`}const P0="recaptcha-enterprise",C0="NO_RECAPTCHA";class M0{constructor(e){this.type=P0,this.auth=jn(e)}async verify(e="verify",n=!1){async function i(s){if(!n){if(s.tenantId==null&&s._agentRecaptchaConfig!=null)return s._agentRecaptchaConfig.siteKey;if(s.tenantId!=null&&s._tenantRecaptchaConfigs[s.tenantId]!==void 0)return s._tenantRecaptchaConfigs[s.tenantId].siteKey}return new Promise(async(o,l)=>{d0(s,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(c=>{if(c.recaptchaKey===void 0)l(new Error("recaptcha Enterprise site key undefined"));else{const d=new c0(c);return s.tenantId==null?s._agentRecaptchaConfig=d:s._tenantRecaptchaConfigs[s.tenantId]=d,o(d.siteKey)}}).catch(c=>{l(c)})})}function r(s,o,l){const c=window.grecaptcha;Ru(c)?c.enterprise.ready(()=>{c.enterprise.execute(s,{action:e}).then(d=>{o(d)}).catch(()=>{o(C0)})}):l(Error("No reCAPTCHA enterprise script loaded."))}return new Promise((s,o)=>{i(this.auth).then(l=>{if(!n&&Ru(window.grecaptcha))r(l,s,o);else{if(typeof window>"u"){o(new Error("RecaptchaVerifier is only supported in browser"));return}let c=A0();c.length!==0&&(c+=l),Rf(c).then(()=>{r(l,s,o)}).catch(d=>{o(d)})}}).catch(l=>{o(l)})})}}async function Lu(t,e,n,i=!1){const r=new M0(t);let s;try{s=await r.verify(n)}catch{s=await r.verify(n,!0)}const o=Object.assign({},e);return i?Object.assign(o,{captchaResp:s}):Object.assign(o,{captchaResponse:s}),Object.assign(o,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(o,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),o}async function Oo(t,e,n,i){var r;if(!((r=t._getRecaptchaConfig())===null||r===void 0)&&r.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const s=await Lu(t,e,n,n==="getOobCode");return i(t,s)}else return i(t,e).catch(async s=>{if(s.code==="auth/missing-recaptcha-token"){console.log(`${n} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const o=await Lu(t,e,n,n==="getOobCode");return i(t,o)}else return Promise.reject(s)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function D0(t,e){const n=rc(t,"auth");if(n.isInitialized()){const r=n.getImmediate(),s=n.getOptions();if(Do(s,e??{}))return r;$t(r,"already-initialized")}return n.initialize({options:e})}function B0(t,e){const n=(e==null?void 0:e.persistence)||[],i=(Array.isArray(n)?n:[n]).map(Mn);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(i,e==null?void 0:e.popupRedirectResolver)}function L0(t,e,n){const i=jn(t);Y(i._canInitEmulator,i,"emulator-config-failed"),Y(/^https?:\/\//.test(e),i,"invalid-emulator-scheme");const r=!1,s=Pf(e),{host:o,port:l}=N0(e),c=l===null?"":`:${l}`;i.config.emulator={url:`${s}//${o}${c}/`},i.settings.appVerificationDisabledForTesting=!0,i.emulatorConfig=Object.freeze({host:o,port:l,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:r})}),O0()}function Pf(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function N0(t){const e=Pf(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const i=n[2].split("@").pop()||"",r=/^(\[[^\]]+\])(:|$)/.exec(i);if(r){const s=r[1];return{host:s,port:Nu(i.substr(s.length+1))}}else{const[s,o]=i.split(":");return{host:s,port:Nu(o)}}}function Nu(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function O0(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uc{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return Pn("not implemented")}_getIdTokenResponse(e){return Pn("not implemented")}_linkToIdToken(e,n){return Pn("not implemented")}_getReauthenticationResolver(e){return Pn("not implemented")}}async function F0(t,e){return gn(t,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function V0(t,e){return Ls(t,"POST","/v1/accounts:signInWithPassword",Yn(t,e))}async function Cf(t,e){return gn(t,"POST","/v1/accounts:sendOobCode",Yn(t,e))}async function z0(t,e){return Cf(t,e)}async function $0(t,e){return Cf(t,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function U0(t,e){return Ls(t,"POST","/v1/accounts:signInWithEmailLink",Yn(t,e))}async function q0(t,e){return Ls(t,"POST","/v1/accounts:signInWithEmailLink",Yn(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gs extends uc{constructor(e,n,i,r=null){super("password",i),this._email=e,this._password=n,this._tenantId=r}static _fromEmailAndPassword(e,n){return new gs(e,n,"password")}static _fromEmailAndCode(e,n,i=null){return new gs(e,n,"emailLink",i)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e;if(n!=null&&n.email&&(n!=null&&n.password)){if(n.signInMethod==="password")return this._fromEmailAndPassword(n.email,n.password);if(n.signInMethod==="emailLink")return this._fromEmailAndCode(n.email,n.password,n.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const n={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Oo(e,n,"signInWithPassword",V0);case"emailLink":return U0(e,{email:this._email,oobCode:this._password});default:$t(e,"internal-error")}}async _linkToIdToken(e,n){switch(this.signInMethod){case"password":const i={idToken:n,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Oo(e,i,"signUpPassword",F0);case"emailLink":return q0(e,{idToken:n,email:this._email,oobCode:this._password});default:$t(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ur(t,e){return Ls(t,"POST","/v1/accounts:signInWithIdp",Yn(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const H0="http://localhost";class Ui extends uc{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new Ui(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):$t("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:i,signInMethod:r}=n,s=sc(n,["providerId","signInMethod"]);if(!i||!r)return null;const o=new Ui(i,r);return o.idToken=s.idToken||void 0,o.accessToken=s.accessToken||void 0,o.secret=s.secret,o.nonce=s.nonce,o.pendingToken=s.pendingToken||null,o}_getIdTokenResponse(e){const n=this.buildRequest();return ur(e,n)}_linkToIdToken(e,n){const i=this.buildRequest();return i.idToken=n,ur(e,i)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,ur(e,n)}buildRequest(){const e={requestUri:H0,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=Ds(n)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function W0(t){switch(t){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function Y0(t){const e=Zr(es(t)).link,n=e?Zr(es(e)).deep_link_id:null,i=Zr(es(t)).deep_link_id;return(i?Zr(es(i)).link:null)||i||n||e||t}class hc{constructor(e){var n,i,r,s,o,l;const c=Zr(es(e)),d=(n=c.apiKey)!==null&&n!==void 0?n:null,f=(i=c.oobCode)!==null&&i!==void 0?i:null,m=W0((r=c.mode)!==null&&r!==void 0?r:null);Y(d&&f&&m,"argument-error"),this.apiKey=d,this.operation=m,this.code=f,this.continueUrl=(s=c.continueUrl)!==null&&s!==void 0?s:null,this.languageCode=(o=c.languageCode)!==null&&o!==void 0?o:null,this.tenantId=(l=c.tenantId)!==null&&l!==void 0?l:null}static parseLink(e){const n=Y0(e);try{return new hc(n)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pr{constructor(){this.providerId=Pr.PROVIDER_ID}static credential(e,n){return gs._fromEmailAndPassword(e,n)}static credentialWithLink(e,n){const i=hc.parseLink(n);return Y(i,"argument-error"),gs._fromEmailAndCode(e,i.code,i.tenantId)}}Pr.PROVIDER_ID="password";Pr.EMAIL_PASSWORD_SIGN_IN_METHOD="password";Pr.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fc{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ns extends fc{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class si extends Ns{constructor(){super("facebook.com")}static credential(e){return Ui._fromParams({providerId:si.PROVIDER_ID,signInMethod:si.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return si.credentialFromTaggedObject(e)}static credentialFromError(e){return si.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return si.credential(e.oauthAccessToken)}catch{return null}}}si.FACEBOOK_SIGN_IN_METHOD="facebook.com";si.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rn extends Ns{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return Ui._fromParams({providerId:Rn.PROVIDER_ID,signInMethod:Rn.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return Rn.credentialFromTaggedObject(e)}static credentialFromError(e){return Rn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:i}=e;if(!n&&!i)return null;try{return Rn.credential(n,i)}catch{return null}}}Rn.GOOGLE_SIGN_IN_METHOD="google.com";Rn.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oi extends Ns{constructor(){super("github.com")}static credential(e){return Ui._fromParams({providerId:oi.PROVIDER_ID,signInMethod:oi.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return oi.credentialFromTaggedObject(e)}static credentialFromError(e){return oi.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return oi.credential(e.oauthAccessToken)}catch{return null}}}oi.GITHUB_SIGN_IN_METHOD="github.com";oi.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ai extends Ns{constructor(){super("twitter.com")}static credential(e,n){return Ui._fromParams({providerId:ai.PROVIDER_ID,signInMethod:ai.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return ai.credentialFromTaggedObject(e)}static credentialFromError(e){return ai.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:i}=e;if(!n||!i)return null;try{return ai.credential(n,i)}catch{return null}}}ai.TWITTER_SIGN_IN_METHOD="twitter.com";ai.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function j0(t,e){return Ls(t,"POST","/v1/accounts:signUp",Yn(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qi{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,i,r=!1){const s=await Cn._fromIdTokenResponse(e,i,r),o=Ou(i);return new qi({user:s,providerId:o,_tokenResponse:i,operationType:n})}static async _forOperation(e,n,i){await e._updateTokensIfNecessary(i,!0);const r=Ou(i);return new qi({user:e,providerId:r,_tokenResponse:i,operationType:n})}}function Ou(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fo extends Wn{constructor(e,n,i,r){var s;super(n.code,n.message),this.operationType=i,this.user=r,Object.setPrototypeOf(this,Fo.prototype),this.customData={appName:e.name,tenantId:(s=e.tenantId)!==null&&s!==void 0?s:void 0,_serverResponse:n.customData._serverResponse,operationType:i}}static _fromErrorAndOperation(e,n,i,r){return new Fo(e,n,i,r)}}function Mf(t,e,n,i){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?Fo._fromErrorAndOperation(t,s,e,i):s})}async function G0(t,e,n=!1){const i=await vr(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return qi._forOperation(t,"link",i)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function K0(t,e,n=!1){const{auth:i}=t;if(Kt(i.app))return Promise.reject(Nn(i));const r="reauthenticate";try{const s=await vr(t,Mf(i,r,e,t),n);Y(s.idToken,i,"internal-error");const o=cc(s.idToken);Y(o,i,"internal-error");const{sub:l}=o;return Y(t.uid===l,i,"user-mismatch"),qi._forOperation(t,r,s)}catch(s){throw(s==null?void 0:s.code)==="auth/user-not-found"&&$t(i,"user-mismatch"),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Df(t,e,n=!1){if(Kt(t.app))return Promise.reject(Nn(t));const i="signIn",r=await Mf(t,i,e),s=await qi._fromIdTokenResponse(t,i,r);return n||await t._updateCurrentUser(s.user),s}async function Q0(t,e){return Df(jn(t),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Bf(t){const e=jn(t);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function J0(t,e,n){const i=jn(t);await Oo(i,{requestType:"PASSWORD_RESET",email:e,clientType:"CLIENT_TYPE_WEB"},"getOobCode",$0)}async function X0(t,e,n){if(Kt(t.app))return Promise.reject(Nn(t));const i=jn(t),o=await Oo(i,{returnSecureToken:!0,email:e,password:n,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",j0).catch(c=>{throw c.code==="auth/password-does-not-meet-requirements"&&Bf(t),c}),l=await qi._fromIdTokenResponse(i,"signIn",o);return await i._updateCurrentUser(l.user),l}function Z0(t,e,n){return Kt(t.app)?Promise.reject(Nn(t)):Q0(Be(t),Pr.credential(e,n)).catch(async i=>{throw i.code==="auth/password-does-not-meet-requirements"&&Bf(t),i})}async function Lf(t,e){const n=Be(t),r={requestType:"VERIFY_EMAIL",idToken:await t.getIdToken()},{email:s}=await z0(n.auth,r);s!==t.email&&await t.reload()}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function eb(t,e){return gn(t,"POST","/v1/accounts:update",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function tb(t,{displayName:e,photoURL:n}){if(e===void 0&&n===void 0)return;const i=Be(t),s={idToken:await i.getIdToken(),displayName:e,photoUrl:n,returnSecureToken:!0},o=await vr(i,eb(i.auth,s));i.displayName=o.displayName||null,i.photoURL=o.photoUrl||null;const l=i.providerData.find(({providerId:c})=>c==="password");l&&(l.displayName=i.displayName,l.photoURL=i.photoURL),await i._updateTokensIfNecessary(o)}function nb(t,e,n,i){return Be(t).onIdTokenChanged(e,n,i)}function ib(t,e,n){return Be(t).beforeAuthStateChanged(e,n)}function rb(t,e,n,i){return Be(t).onAuthStateChanged(e,n,i)}function sb(t){return Be(t).signOut()}async function ob(t){return Be(t).delete()}const Vo="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nf{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(Vo,"1"),this.storage.removeItem(Vo),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ab=1e3,lb=10;class Of extends Nf{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Af(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const i=this.storage.getItem(n),r=this.localCache[n];i!==r&&e(n,r,i)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((o,l,c)=>{this.notifyListeners(o,c)});return}const i=e.key;n?this.detachListener():this.stopPolling();const r=()=>{const o=this.storage.getItem(i);!n&&this.localCache[i]===o||this.notifyListeners(i,o)},s=this.storage.getItem(i);w0()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(r,lb):r()}notifyListeners(e,n){this.localCache[e]=n;const i=this.listeners[e];if(i)for(const r of Array.from(i))r(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,i)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:i}),!0)})},ab)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}Of.type="LOCAL";const cb=Of;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ff extends Nf{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}Ff.type="SESSION";const Vf=Ff;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function db(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class aa{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(r=>r.isListeningto(e));if(n)return n;const i=new aa(e);return this.receivers.push(i),i}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:i,eventType:r,data:s}=n.data,o=this.handlersMap[r];if(!(o!=null&&o.size))return;n.ports[0].postMessage({status:"ack",eventId:i,eventType:r});const l=Array.from(o).map(async d=>d(n.origin,s)),c=await db(l);n.ports[0].postMessage({status:"done",eventId:i,eventType:r,response:c})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}aa.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pc(t="",e=10){let n="";for(let i=0;i<e;i++)n+=Math.floor(Math.random()*10);return t+n}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ub{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,i=50){const r=typeof MessageChannel<"u"?new MessageChannel:null;if(!r)throw new Error("connection_unavailable");let s,o;return new Promise((l,c)=>{const d=pc("",20);r.port1.start();const f=setTimeout(()=>{c(new Error("unsupported_event"))},i);o={messageChannel:r,onMessage(m){const p=m;if(p.data.eventId===d)switch(p.data.status){case"ack":clearTimeout(f),s=setTimeout(()=>{c(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),l(p.data.response);break;default:clearTimeout(f),clearTimeout(s),c(new Error("invalid_response"));break}}},this.handlers.add(o),r.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:d,data:n},[r.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dn(){return window}function hb(t){dn().location.href=t}/**
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
 */function zf(){return typeof dn().WorkerGlobalScope<"u"&&typeof dn().importScripts=="function"}async function fb(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function pb(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)===null||t===void 0?void 0:t.controller)||null}function mb(){return zf()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $f="firebaseLocalStorageDb",gb=1,zo="firebaseLocalStorage",Uf="fbase_key";class Os{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function la(t,e){return t.transaction([zo],e?"readwrite":"readonly").objectStore(zo)}function yb(){const t=indexedDB.deleteDatabase($f);return new Os(t).toPromise()}function El(){const t=indexedDB.open($f,gb);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const i=t.result;try{i.createObjectStore(zo,{keyPath:Uf})}catch(r){n(r)}}),t.addEventListener("success",async()=>{const i=t.result;i.objectStoreNames.contains(zo)?e(i):(i.close(),await yb(),e(await El()))})})}async function Fu(t,e,n){const i=la(t,!0).put({[Uf]:e,value:n});return new Os(i).toPromise()}async function vb(t,e){const n=la(t,!1).get(e),i=await new Os(n).toPromise();return i===void 0?null:i.value}function Vu(t,e){const n=la(t,!0).delete(e);return new Os(n).toPromise()}const bb=800,wb=3;class qf{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await El(),this.db)}async _withRetries(e){let n=0;for(;;)try{const i=await this._openDb();return await e(i)}catch(i){if(n++>wb)throw i;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return zf()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=aa._getInstance(mb()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var e,n;if(this.activeServiceWorker=await fb(),!this.activeServiceWorker)return;this.sender=new ub(this.activeServiceWorker);const i=await this.sender._send("ping",{},800);i&&!((e=i[0])===null||e===void 0)&&e.fulfilled&&!((n=i[0])===null||n===void 0)&&n.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||pb()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await El();return await Fu(e,Vo,"1"),await Vu(e,Vo),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(i=>Fu(i,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(i=>vb(i,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>Vu(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(r=>{const s=la(r,!1).getAll();return new Os(s).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],i=new Set;if(e.length!==0)for(const{fbase_key:r,value:s}of e)i.add(r),JSON.stringify(this.localCache[r])!==JSON.stringify(s)&&(this.notifyListeners(r,s),n.push(r));for(const r of Object.keys(this.localCache))this.localCache[r]&&!i.has(r)&&(this.notifyListeners(r,null),n.push(r));return n}notifyListeners(e,n){this.localCache[e]=n;const i=this.listeners[e];if(i)for(const r of Array.from(i))r(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),bb)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}qf.type="LOCAL";const _b=qf;new Bs(3e4,6e4);/**
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
 */function Hf(t,e){return e?Mn(e):(Y(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mc extends uc{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return ur(e,this._buildIdpRequest())}_linkToIdToken(e,n){return ur(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return ur(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function Eb(t){return Df(t.auth,new mc(t),t.bypassAuthState)}function Tb(t){const{auth:e,user:n}=t;return Y(n,e,"internal-error"),K0(n,new mc(t),t.bypassAuthState)}async function Ib(t){const{auth:e,user:n}=t;return Y(n,e,"internal-error"),G0(n,new mc(t),t.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wf{constructor(e,n,i,r,s=!1){this.auth=e,this.resolver=i,this.user=r,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(i){this.reject(i)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:i,postBody:r,tenantId:s,error:o,type:l}=e;if(o){this.reject(o);return}const c={auth:this.auth,requestUri:n,sessionId:i,tenantId:s||void 0,postBody:r||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(l)(c))}catch(d){this.reject(d)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return Eb;case"linkViaPopup":case"linkViaRedirect":return Ib;case"reauthViaPopup":case"reauthViaRedirect":return Tb;default:$t(this.auth,"internal-error")}}resolve(e){zn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){zn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xb=new Bs(2e3,1e4);async function Sb(t,e,n){if(Kt(t.app))return Promise.reject(Jt(t,"operation-not-supported-in-this-environment"));const i=jn(t);t0(t,e,fc);const r=Hf(i,n);return new Di(i,"signInViaPopup",e,r).executeNotNull()}class Di extends Wf{constructor(e,n,i,r,s){super(e,n,r,s),this.provider=i,this.authWindow=null,this.pollId=null,Di.currentPopupAction&&Di.currentPopupAction.cancel(),Di.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return Y(e,this.auth,"internal-error"),e}async onExecution(){zn(this.filter.length===1,"Popup operations only handle one event");const e=pc();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(Jt(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(Jt(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Di.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,i;if(!((i=(n=this.authWindow)===null||n===void 0?void 0:n.window)===null||i===void 0)&&i.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Jt(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,xb.get())};e()}}Di.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ab="pendingRedirect",_o=new Map;class kb extends Wf{constructor(e,n,i=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,i),this.eventId=null}async execute(){let e=_o.get(this.auth._key());if(!e){try{const i=await Rb(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(i)}catch(n){e=()=>Promise.reject(n)}_o.set(this.auth._key(),e)}return this.bypassAuthState||_o.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Rb(t,e){const n=Mb(e),i=Cb(t);if(!await i._isAvailable())return!1;const r=await i._get(n)==="true";return await i._remove(n),r}function Pb(t,e){_o.set(t._key(),e)}function Cb(t){return Mn(t._redirectPersistence)}function Mb(t){return wo(Ab,t.config.apiKey,t.name)}async function Db(t,e,n=!1){if(Kt(t.app))return Promise.reject(Nn(t));const i=jn(t),r=Hf(i,e),o=await new kb(i,r,n).execute();return o&&!n&&(delete o.user._redirectEventId,await i._persistUserIfCurrent(o.user),await i._setRedirectUser(null,e)),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bb=10*60*1e3;class Lb{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(i=>{this.isEventForConsumer(e,i)&&(n=!0,this.sendToConsumer(e,i),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Nb(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var i;if(e.error&&!Yf(e)){const r=((i=e.error.code)===null||i===void 0?void 0:i.split("auth/")[1])||"internal-error";n.onError(Jt(this.auth,r))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const i=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&i}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Bb&&this.cachedEventUids.clear(),this.cachedEventUids.has(zu(e))}saveEventToCache(e){this.cachedEventUids.add(zu(e)),this.lastProcessedEventTime=Date.now()}}function zu(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function Yf({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Nb(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Yf(t);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ob(t,e={}){return gn(t,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fb=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Vb=/^https?/;async function zb(t){if(t.config.emulator)return;const{authorizedDomains:e}=await Ob(t);for(const n of e)try{if($b(n))return}catch{}$t(t,"unauthorized-domain")}function $b(t){const e=wl(),{protocol:n,hostname:i}=new URL(e);if(t.startsWith("chrome-extension://")){const o=new URL(t);return o.hostname===""&&i===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&o.hostname===i}if(!Vb.test(n))return!1;if(Fb.test(t))return i===t;const r=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+r+"|"+r+")$","i").test(i)}/**
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
 */const Ub=new Bs(3e4,6e4);function $u(){const t=dn().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function qb(t){return new Promise((e,n)=>{var i,r,s;function o(){$u(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{$u(),n(Jt(t,"network-request-failed"))},timeout:Ub.get()})}if(!((r=(i=dn().gapi)===null||i===void 0?void 0:i.iframes)===null||r===void 0)&&r.Iframe)e(gapi.iframes.getContext());else if(!((s=dn().gapi)===null||s===void 0)&&s.load)o();else{const l=R0("iframefcb");return dn()[l]=()=>{gapi.load?o():n(Jt(t,"network-request-failed"))},Rf(`${k0()}?onload=${l}`).catch(c=>n(c))}}).catch(e=>{throw Eo=null,e})}let Eo=null;function Hb(t){return Eo=Eo||qb(t),Eo}/**
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
 */const Wb=new Bs(5e3,15e3),Yb="__/auth/iframe",jb="emulator/auth/iframe",Gb={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Kb=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Qb(t){const e=t.config;Y(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?lc(e,jb):`https://${t.config.authDomain}/${Yb}`,i={apiKey:e.apiKey,appName:t.name,v:Rr},r=Kb.get(t.config.apiHost);r&&(i.eid=r);const s=t._getFrameworks();return s.length&&(i.fw=s.join(",")),`${n}?${Ds(i).slice(1)}`}async function Jb(t){const e=await Hb(t),n=dn().gapi;return Y(n,t,"internal-error"),e.open({where:document.body,url:Qb(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Gb,dontclear:!0},i=>new Promise(async(r,s)=>{await i.restyle({setHideOnLeave:!1});const o=Jt(t,"network-request-failed"),l=dn().setTimeout(()=>{s(o)},Wb.get());function c(){dn().clearTimeout(l),r(i)}i.ping(c).then(c,()=>{s(o)})}))}/**
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
 */const Xb={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Zb=500,ew=600,tw="_blank",nw="http://localhost";class Uu{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function iw(t,e,n,i=Zb,r=ew){const s=Math.max((window.screen.availHeight-r)/2,0).toString(),o=Math.max((window.screen.availWidth-i)/2,0).toString();let l="";const c=Object.assign(Object.assign({},Xb),{width:i.toString(),height:r.toString(),top:s,left:o}),d=lt().toLowerCase();n&&(l=Ef(d)?tw:n),wf(d)&&(e=e||nw,c.scrollbars="yes");const f=Object.entries(c).reduce((p,[y,I])=>`${p}${y}=${I},`,"");if(b0(d)&&l!=="_self")return rw(e||"",l),new Uu(null);const m=window.open(e||"",l,f);Y(m,t,"popup-blocked");try{m.focus()}catch{}return new Uu(m)}function rw(t,e){const n=document.createElement("a");n.href=t,n.target=e;const i=document.createEvent("MouseEvent");i.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(i)}/**
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
 */const sw="__/auth/handler",ow="emulator/auth/handler",aw=encodeURIComponent("fac");async function qu(t,e,n,i,r,s){Y(t.config.authDomain,t,"auth-domain-config-required"),Y(t.config.apiKey,t,"invalid-api-key");const o={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:i,v:Rr,eventId:r};if(e instanceof fc){e.setDefaultLanguage(t.languageCode),o.providerId=e.providerId||"",zy(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[f,m]of Object.entries({}))o[f]=m}if(e instanceof Ns){const f=e.getScopes().filter(m=>m!=="");f.length>0&&(o.scopes=f.join(","))}t.tenantId&&(o.tid=t.tenantId);const l=o;for(const f of Object.keys(l))l[f]===void 0&&delete l[f];const c=await t._getAppCheckToken(),d=c?`#${aw}=${encodeURIComponent(c)}`:"";return`${lw(t)}?${Ds(l).slice(1)}${d}`}function lw({config:t}){return t.emulator?lc(t,ow):`https://${t.authDomain}/${sw}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rl="webStorageSupport";class cw{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Vf,this._completeRedirectFn=Db,this._overrideRedirectResult=Pb}async _openPopup(e,n,i,r){var s;zn((s=this.eventManagers[e._key()])===null||s===void 0?void 0:s.manager,"_initialize() not called before _openPopup()");const o=await qu(e,n,i,wl(),r);return iw(e,o,pc())}async _openRedirect(e,n,i,r){await this._originValidation(e);const s=await qu(e,n,i,wl(),r);return hb(s),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:r,promise:s}=this.eventManagers[n];return r?Promise.resolve(r):(zn(s,"If manager is not set, promise should be"),s)}const i=this.initAndGetManager(e);return this.eventManagers[n]={promise:i},i.catch(()=>{delete this.eventManagers[n]}),i}async initAndGetManager(e){const n=await Jb(e),i=new Lb(e);return n.register("authEvent",r=>(Y(r==null?void 0:r.authEvent,e,"invalid-auth-event"),{status:i.onEvent(r.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:i},this.iframes[e._key()]=n,i}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(rl,{type:rl},r=>{var s;const o=(s=r==null?void 0:r[0])===null||s===void 0?void 0:s[rl];o!==void 0&&n(!!o),$t(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=zb(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return Af()||_f()||dc()}}const dw=cw;var Hu="@firebase/auth",Wu="1.7.9";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uw{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(i=>{e((i==null?void 0:i.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){Y(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hw(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function fw(t){yr(new $i("auth",(e,{options:n})=>{const i=e.getProvider("app").getImmediate(),r=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:o,authDomain:l}=i.options;Y(o&&!o.includes(":"),"invalid-api-key",{appName:i.name});const c={apiKey:o,authDomain:l,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:kf(t)},d=new x0(i,r,s,c);return B0(d,n),d},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,i)=>{e.getProvider("auth-internal").initialize()})),yr(new $i("auth-internal",e=>{const n=jn(e.getProvider("auth").getImmediate());return(i=>new uw(i))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),fi(Hu,Wu,hw(t)),fi(Hu,Wu,"esm2017")}/**
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
 */const pw=5*60,mw=sf("authIdTokenMaxAge")||pw;let Yu=null;const gw=t=>async e=>{const n=e&&await e.getIdTokenResult(),i=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(i&&i>mw)return;const r=n==null?void 0:n.token;Yu!==r&&(Yu=r,await fetch(t,{method:r?"POST":"DELETE",headers:r?{Authorization:`Bearer ${r}`}:{}}))};function yw(t=cf()){const e=rc(t,"auth");if(e.isInitialized())return e.getImmediate();const n=D0(t,{popupRedirectResolver:dw,persistence:[_b,cb,Vf]}),i=sf("authTokenSyncURL");if(i&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(i,location.origin);if(location.origin===s.origin){const o=gw(s.toString());ib(n,o,()=>o(n.currentUser)),nb(n,l=>o(l))}}const r=nf("auth");return r&&L0(n,`http://${r}`),n}function vw(){var t,e;return(e=(t=document.getElementsByTagName("head"))===null||t===void 0?void 0:t[0])!==null&&e!==void 0?e:document}S0({loadJS(t){return new Promise((e,n)=>{const i=document.createElement("script");i.setAttribute("src",t),i.onload=e,i.onerror=r=>{const s=Jt("internal-error");s.customData=r,n(s)},i.type="text/javascript",i.charset="UTF-8",vw().appendChild(i)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});fw("Browser");var ju=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Fi,jf;(function(){var t;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(T,v){function _(){}_.prototype=v.prototype,T.D=v.prototype,T.prototype=new _,T.prototype.constructor=T,T.C=function(w,E,S){for(var b=Array(arguments.length-2),le=2;le<arguments.length;le++)b[le-2]=arguments[le];return v.prototype[E].apply(w,b)}}function n(){this.blockSize=-1}function i(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(i,n),i.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function r(T,v,_){_||(_=0);var w=Array(16);if(typeof v=="string")for(var E=0;16>E;++E)w[E]=v.charCodeAt(_++)|v.charCodeAt(_++)<<8|v.charCodeAt(_++)<<16|v.charCodeAt(_++)<<24;else for(E=0;16>E;++E)w[E]=v[_++]|v[_++]<<8|v[_++]<<16|v[_++]<<24;v=T.g[0],_=T.g[1],E=T.g[2];var S=T.g[3],b=v+(S^_&(E^S))+w[0]+3614090360&4294967295;v=_+(b<<7&4294967295|b>>>25),b=S+(E^v&(_^E))+w[1]+3905402710&4294967295,S=v+(b<<12&4294967295|b>>>20),b=E+(_^S&(v^_))+w[2]+606105819&4294967295,E=S+(b<<17&4294967295|b>>>15),b=_+(v^E&(S^v))+w[3]+3250441966&4294967295,_=E+(b<<22&4294967295|b>>>10),b=v+(S^_&(E^S))+w[4]+4118548399&4294967295,v=_+(b<<7&4294967295|b>>>25),b=S+(E^v&(_^E))+w[5]+1200080426&4294967295,S=v+(b<<12&4294967295|b>>>20),b=E+(_^S&(v^_))+w[6]+2821735955&4294967295,E=S+(b<<17&4294967295|b>>>15),b=_+(v^E&(S^v))+w[7]+4249261313&4294967295,_=E+(b<<22&4294967295|b>>>10),b=v+(S^_&(E^S))+w[8]+1770035416&4294967295,v=_+(b<<7&4294967295|b>>>25),b=S+(E^v&(_^E))+w[9]+2336552879&4294967295,S=v+(b<<12&4294967295|b>>>20),b=E+(_^S&(v^_))+w[10]+4294925233&4294967295,E=S+(b<<17&4294967295|b>>>15),b=_+(v^E&(S^v))+w[11]+2304563134&4294967295,_=E+(b<<22&4294967295|b>>>10),b=v+(S^_&(E^S))+w[12]+1804603682&4294967295,v=_+(b<<7&4294967295|b>>>25),b=S+(E^v&(_^E))+w[13]+4254626195&4294967295,S=v+(b<<12&4294967295|b>>>20),b=E+(_^S&(v^_))+w[14]+2792965006&4294967295,E=S+(b<<17&4294967295|b>>>15),b=_+(v^E&(S^v))+w[15]+1236535329&4294967295,_=E+(b<<22&4294967295|b>>>10),b=v+(E^S&(_^E))+w[1]+4129170786&4294967295,v=_+(b<<5&4294967295|b>>>27),b=S+(_^E&(v^_))+w[6]+3225465664&4294967295,S=v+(b<<9&4294967295|b>>>23),b=E+(v^_&(S^v))+w[11]+643717713&4294967295,E=S+(b<<14&4294967295|b>>>18),b=_+(S^v&(E^S))+w[0]+3921069994&4294967295,_=E+(b<<20&4294967295|b>>>12),b=v+(E^S&(_^E))+w[5]+3593408605&4294967295,v=_+(b<<5&4294967295|b>>>27),b=S+(_^E&(v^_))+w[10]+38016083&4294967295,S=v+(b<<9&4294967295|b>>>23),b=E+(v^_&(S^v))+w[15]+3634488961&4294967295,E=S+(b<<14&4294967295|b>>>18),b=_+(S^v&(E^S))+w[4]+3889429448&4294967295,_=E+(b<<20&4294967295|b>>>12),b=v+(E^S&(_^E))+w[9]+568446438&4294967295,v=_+(b<<5&4294967295|b>>>27),b=S+(_^E&(v^_))+w[14]+3275163606&4294967295,S=v+(b<<9&4294967295|b>>>23),b=E+(v^_&(S^v))+w[3]+4107603335&4294967295,E=S+(b<<14&4294967295|b>>>18),b=_+(S^v&(E^S))+w[8]+1163531501&4294967295,_=E+(b<<20&4294967295|b>>>12),b=v+(E^S&(_^E))+w[13]+2850285829&4294967295,v=_+(b<<5&4294967295|b>>>27),b=S+(_^E&(v^_))+w[2]+4243563512&4294967295,S=v+(b<<9&4294967295|b>>>23),b=E+(v^_&(S^v))+w[7]+1735328473&4294967295,E=S+(b<<14&4294967295|b>>>18),b=_+(S^v&(E^S))+w[12]+2368359562&4294967295,_=E+(b<<20&4294967295|b>>>12),b=v+(_^E^S)+w[5]+4294588738&4294967295,v=_+(b<<4&4294967295|b>>>28),b=S+(v^_^E)+w[8]+2272392833&4294967295,S=v+(b<<11&4294967295|b>>>21),b=E+(S^v^_)+w[11]+1839030562&4294967295,E=S+(b<<16&4294967295|b>>>16),b=_+(E^S^v)+w[14]+4259657740&4294967295,_=E+(b<<23&4294967295|b>>>9),b=v+(_^E^S)+w[1]+2763975236&4294967295,v=_+(b<<4&4294967295|b>>>28),b=S+(v^_^E)+w[4]+1272893353&4294967295,S=v+(b<<11&4294967295|b>>>21),b=E+(S^v^_)+w[7]+4139469664&4294967295,E=S+(b<<16&4294967295|b>>>16),b=_+(E^S^v)+w[10]+3200236656&4294967295,_=E+(b<<23&4294967295|b>>>9),b=v+(_^E^S)+w[13]+681279174&4294967295,v=_+(b<<4&4294967295|b>>>28),b=S+(v^_^E)+w[0]+3936430074&4294967295,S=v+(b<<11&4294967295|b>>>21),b=E+(S^v^_)+w[3]+3572445317&4294967295,E=S+(b<<16&4294967295|b>>>16),b=_+(E^S^v)+w[6]+76029189&4294967295,_=E+(b<<23&4294967295|b>>>9),b=v+(_^E^S)+w[9]+3654602809&4294967295,v=_+(b<<4&4294967295|b>>>28),b=S+(v^_^E)+w[12]+3873151461&4294967295,S=v+(b<<11&4294967295|b>>>21),b=E+(S^v^_)+w[15]+530742520&4294967295,E=S+(b<<16&4294967295|b>>>16),b=_+(E^S^v)+w[2]+3299628645&4294967295,_=E+(b<<23&4294967295|b>>>9),b=v+(E^(_|~S))+w[0]+4096336452&4294967295,v=_+(b<<6&4294967295|b>>>26),b=S+(_^(v|~E))+w[7]+1126891415&4294967295,S=v+(b<<10&4294967295|b>>>22),b=E+(v^(S|~_))+w[14]+2878612391&4294967295,E=S+(b<<15&4294967295|b>>>17),b=_+(S^(E|~v))+w[5]+4237533241&4294967295,_=E+(b<<21&4294967295|b>>>11),b=v+(E^(_|~S))+w[12]+1700485571&4294967295,v=_+(b<<6&4294967295|b>>>26),b=S+(_^(v|~E))+w[3]+2399980690&4294967295,S=v+(b<<10&4294967295|b>>>22),b=E+(v^(S|~_))+w[10]+4293915773&4294967295,E=S+(b<<15&4294967295|b>>>17),b=_+(S^(E|~v))+w[1]+2240044497&4294967295,_=E+(b<<21&4294967295|b>>>11),b=v+(E^(_|~S))+w[8]+1873313359&4294967295,v=_+(b<<6&4294967295|b>>>26),b=S+(_^(v|~E))+w[15]+4264355552&4294967295,S=v+(b<<10&4294967295|b>>>22),b=E+(v^(S|~_))+w[6]+2734768916&4294967295,E=S+(b<<15&4294967295|b>>>17),b=_+(S^(E|~v))+w[13]+1309151649&4294967295,_=E+(b<<21&4294967295|b>>>11),b=v+(E^(_|~S))+w[4]+4149444226&4294967295,v=_+(b<<6&4294967295|b>>>26),b=S+(_^(v|~E))+w[11]+3174756917&4294967295,S=v+(b<<10&4294967295|b>>>22),b=E+(v^(S|~_))+w[2]+718787259&4294967295,E=S+(b<<15&4294967295|b>>>17),b=_+(S^(E|~v))+w[9]+3951481745&4294967295,T.g[0]=T.g[0]+v&4294967295,T.g[1]=T.g[1]+(E+(b<<21&4294967295|b>>>11))&4294967295,T.g[2]=T.g[2]+E&4294967295,T.g[3]=T.g[3]+S&4294967295}i.prototype.u=function(T,v){v===void 0&&(v=T.length);for(var _=v-this.blockSize,w=this.B,E=this.h,S=0;S<v;){if(E==0)for(;S<=_;)r(this,T,S),S+=this.blockSize;if(typeof T=="string"){for(;S<v;)if(w[E++]=T.charCodeAt(S++),E==this.blockSize){r(this,w),E=0;break}}else for(;S<v;)if(w[E++]=T[S++],E==this.blockSize){r(this,w),E=0;break}}this.h=E,this.o+=v},i.prototype.v=function(){var T=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);T[0]=128;for(var v=1;v<T.length-8;++v)T[v]=0;var _=8*this.o;for(v=T.length-8;v<T.length;++v)T[v]=_&255,_/=256;for(this.u(T),T=Array(16),v=_=0;4>v;++v)for(var w=0;32>w;w+=8)T[_++]=this.g[v]>>>w&255;return T};function s(T,v){var _=l;return Object.prototype.hasOwnProperty.call(_,T)?_[T]:_[T]=v(T)}function o(T,v){this.h=v;for(var _=[],w=!0,E=T.length-1;0<=E;E--){var S=T[E]|0;w&&S==v||(_[E]=S,w=!1)}this.g=_}var l={};function c(T){return-128<=T&&128>T?s(T,function(v){return new o([v|0],0>v?-1:0)}):new o([T|0],0>T?-1:0)}function d(T){if(isNaN(T)||!isFinite(T))return m;if(0>T)return A(d(-T));for(var v=[],_=1,w=0;T>=_;w++)v[w]=T/_|0,_*=4294967296;return new o(v,0)}function f(T,v){if(T.length==0)throw Error("number format error: empty string");if(v=v||10,2>v||36<v)throw Error("radix out of range: "+v);if(T.charAt(0)=="-")return A(f(T.substring(1),v));if(0<=T.indexOf("-"))throw Error('number format error: interior "-" character');for(var _=d(Math.pow(v,8)),w=m,E=0;E<T.length;E+=8){var S=Math.min(8,T.length-E),b=parseInt(T.substring(E,E+S),v);8>S?(S=d(Math.pow(v,S)),w=w.j(S).add(d(b))):(w=w.j(_),w=w.add(d(b)))}return w}var m=c(0),p=c(1),y=c(16777216);t=o.prototype,t.m=function(){if(x(this))return-A(this).m();for(var T=0,v=1,_=0;_<this.g.length;_++){var w=this.i(_);T+=(0<=w?w:4294967296+w)*v,v*=4294967296}return T},t.toString=function(T){if(T=T||10,2>T||36<T)throw Error("radix out of range: "+T);if(I(this))return"0";if(x(this))return"-"+A(this).toString(T);for(var v=d(Math.pow(T,6)),_=this,w="";;){var E=N(_,v).g;_=R(_,E.j(v));var S=((0<_.g.length?_.g[0]:_.h)>>>0).toString(T);if(_=E,I(_))return S+w;for(;6>S.length;)S="0"+S;w=S+w}},t.i=function(T){return 0>T?0:T<this.g.length?this.g[T]:this.h};function I(T){if(T.h!=0)return!1;for(var v=0;v<T.g.length;v++)if(T.g[v]!=0)return!1;return!0}function x(T){return T.h==-1}t.l=function(T){return T=R(this,T),x(T)?-1:I(T)?0:1};function A(T){for(var v=T.g.length,_=[],w=0;w<v;w++)_[w]=~T.g[w];return new o(_,~T.h).add(p)}t.abs=function(){return x(this)?A(this):this},t.add=function(T){for(var v=Math.max(this.g.length,T.g.length),_=[],w=0,E=0;E<=v;E++){var S=w+(this.i(E)&65535)+(T.i(E)&65535),b=(S>>>16)+(this.i(E)>>>16)+(T.i(E)>>>16);w=b>>>16,S&=65535,b&=65535,_[E]=b<<16|S}return new o(_,_[_.length-1]&-2147483648?-1:0)};function R(T,v){return T.add(A(v))}t.j=function(T){if(I(this)||I(T))return m;if(x(this))return x(T)?A(this).j(A(T)):A(A(this).j(T));if(x(T))return A(this.j(A(T)));if(0>this.l(y)&&0>T.l(y))return d(this.m()*T.m());for(var v=this.g.length+T.g.length,_=[],w=0;w<2*v;w++)_[w]=0;for(w=0;w<this.g.length;w++)for(var E=0;E<T.g.length;E++){var S=this.i(w)>>>16,b=this.i(w)&65535,le=T.i(E)>>>16,pe=T.i(E)&65535;_[2*w+2*E]+=b*pe,C(_,2*w+2*E),_[2*w+2*E+1]+=S*pe,C(_,2*w+2*E+1),_[2*w+2*E+1]+=b*le,C(_,2*w+2*E+1),_[2*w+2*E+2]+=S*le,C(_,2*w+2*E+2)}for(w=0;w<v;w++)_[w]=_[2*w+1]<<16|_[2*w];for(w=v;w<2*v;w++)_[w]=0;return new o(_,0)};function C(T,v){for(;(T[v]&65535)!=T[v];)T[v+1]+=T[v]>>>16,T[v]&=65535,v++}function L(T,v){this.g=T,this.h=v}function N(T,v){if(I(v))throw Error("division by zero");if(I(T))return new L(m,m);if(x(T))return v=N(A(T),v),new L(A(v.g),A(v.h));if(x(v))return v=N(T,A(v)),new L(A(v.g),v.h);if(30<T.g.length){if(x(T)||x(v))throw Error("slowDivide_ only works with positive integers.");for(var _=p,w=v;0>=w.l(T);)_=z(_),w=z(w);var E=q(_,1),S=q(w,1);for(w=q(w,2),_=q(_,2);!I(w);){var b=S.add(w);0>=b.l(T)&&(E=E.add(_),S=b),w=q(w,1),_=q(_,1)}return v=R(T,E.j(v)),new L(E,v)}for(E=m;0<=T.l(v);){for(_=Math.max(1,Math.floor(T.m()/v.m())),w=Math.ceil(Math.log(_)/Math.LN2),w=48>=w?1:Math.pow(2,w-48),S=d(_),b=S.j(v);x(b)||0<b.l(T);)_-=w,S=d(_),b=S.j(v);I(S)&&(S=p),E=E.add(S),T=R(T,b)}return new L(E,T)}t.A=function(T){return N(this,T).h},t.and=function(T){for(var v=Math.max(this.g.length,T.g.length),_=[],w=0;w<v;w++)_[w]=this.i(w)&T.i(w);return new o(_,this.h&T.h)},t.or=function(T){for(var v=Math.max(this.g.length,T.g.length),_=[],w=0;w<v;w++)_[w]=this.i(w)|T.i(w);return new o(_,this.h|T.h)},t.xor=function(T){for(var v=Math.max(this.g.length,T.g.length),_=[],w=0;w<v;w++)_[w]=this.i(w)^T.i(w);return new o(_,this.h^T.h)};function z(T){for(var v=T.g.length+1,_=[],w=0;w<v;w++)_[w]=T.i(w)<<1|T.i(w-1)>>>31;return new o(_,T.h)}function q(T,v){var _=v>>5;v%=32;for(var w=T.g.length-_,E=[],S=0;S<w;S++)E[S]=0<v?T.i(S+_)>>>v|T.i(S+_+1)<<32-v:T.i(S+_);return new o(E,T.h)}i.prototype.digest=i.prototype.v,i.prototype.reset=i.prototype.s,i.prototype.update=i.prototype.u,jf=i,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.A,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=d,o.fromString=f,Fi=o}).apply(typeof ju<"u"?ju:typeof self<"u"?self:typeof window<"u"?window:{});var po=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Gf,ts,Kf,To,Tl,Qf,Jf,Xf;(function(){var t,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(a,u,h){return a==Array.prototype||a==Object.prototype||(a[u]=h.value),a};function n(a){a=[typeof globalThis=="object"&&globalThis,a,typeof window=="object"&&window,typeof self=="object"&&self,typeof po=="object"&&po];for(var u=0;u<a.length;++u){var h=a[u];if(h&&h.Math==Math)return h}throw Error("Cannot find global object")}var i=n(this);function r(a,u){if(u)e:{var h=i;a=a.split(".");for(var g=0;g<a.length-1;g++){var k=a[g];if(!(k in h))break e;h=h[k]}a=a[a.length-1],g=h[a],u=u(g),u!=g&&u!=null&&e(h,a,{configurable:!0,writable:!0,value:u})}}function s(a,u){a instanceof String&&(a+="");var h=0,g=!1,k={next:function(){if(!g&&h<a.length){var P=h++;return{value:u(P,a[P]),done:!1}}return g=!0,{done:!0,value:void 0}}};return k[Symbol.iterator]=function(){return k},k}r("Array.prototype.values",function(a){return a||function(){return s(this,function(u,h){return h})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var o=o||{},l=this||self;function c(a){var u=typeof a;return u=u!="object"?u:a?Array.isArray(a)?"array":u:"null",u=="array"||u=="object"&&typeof a.length=="number"}function d(a){var u=typeof a;return u=="object"&&a!=null||u=="function"}function f(a,u,h){return a.call.apply(a.bind,arguments)}function m(a,u,h){if(!a)throw Error();if(2<arguments.length){var g=Array.prototype.slice.call(arguments,2);return function(){var k=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(k,g),a.apply(u,k)}}return function(){return a.apply(u,arguments)}}function p(a,u,h){return p=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?f:m,p.apply(null,arguments)}function y(a,u){var h=Array.prototype.slice.call(arguments,1);return function(){var g=h.slice();return g.push.apply(g,arguments),a.apply(this,g)}}function I(a,u){function h(){}h.prototype=u.prototype,a.aa=u.prototype,a.prototype=new h,a.prototype.constructor=a,a.Qb=function(g,k,P){for(var F=Array(arguments.length-2),be=2;be<arguments.length;be++)F[be-2]=arguments[be];return u.prototype[k].apply(g,F)}}function x(a){const u=a.length;if(0<u){const h=Array(u);for(let g=0;g<u;g++)h[g]=a[g];return h}return[]}function A(a,u){for(let h=1;h<arguments.length;h++){const g=arguments[h];if(c(g)){const k=a.length||0,P=g.length||0;a.length=k+P;for(let F=0;F<P;F++)a[k+F]=g[F]}else a.push(g)}}class R{constructor(u,h){this.i=u,this.j=h,this.h=0,this.g=null}get(){let u;return 0<this.h?(this.h--,u=this.g,this.g=u.next,u.next=null):u=this.i(),u}}function C(a){return/^[\s\xa0]*$/.test(a)}function L(){var a=l.navigator;return a&&(a=a.userAgent)?a:""}function N(a){return N[" "](a),a}N[" "]=function(){};var z=L().indexOf("Gecko")!=-1&&!(L().toLowerCase().indexOf("webkit")!=-1&&L().indexOf("Edge")==-1)&&!(L().indexOf("Trident")!=-1||L().indexOf("MSIE")!=-1)&&L().indexOf("Edge")==-1;function q(a,u,h){for(const g in a)u.call(h,a[g],g,a)}function T(a,u){for(const h in a)u.call(void 0,a[h],h,a)}function v(a){const u={};for(const h in a)u[h]=a[h];return u}const _="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function w(a,u){let h,g;for(let k=1;k<arguments.length;k++){g=arguments[k];for(h in g)a[h]=g[h];for(let P=0;P<_.length;P++)h=_[P],Object.prototype.hasOwnProperty.call(g,h)&&(a[h]=g[h])}}function E(a){var u=1;a=a.split(":");const h=[];for(;0<u&&a.length;)h.push(a.shift()),u--;return a.length&&h.push(a.join(":")),h}function S(a){l.setTimeout(()=>{throw a},0)}function b(){var a=te;let u=null;return a.g&&(u=a.g,a.g=a.g.next,a.g||(a.h=null),u.next=null),u}class le{constructor(){this.h=this.g=null}add(u,h){const g=pe.get();g.set(u,h),this.h?this.h.next=g:this.g=g,this.h=g}}var pe=new R(()=>new H,a=>a.reset());class H{constructor(){this.next=this.g=this.h=null}set(u,h){this.h=u,this.g=h,this.next=null}reset(){this.next=this.g=this.h=null}}let ee,ne=!1,te=new le,Me=()=>{const a=l.Promise.resolve(void 0);ee=()=>{a.then(Pe)}};var Pe=()=>{for(var a;a=b();){try{a.h.call(a.g)}catch(h){S(h)}var u=pe;u.j(a),100>u.h&&(u.h++,a.next=u.g,u.g=a)}ne=!1};function ye(){this.s=this.s,this.C=this.C}ye.prototype.s=!1,ye.prototype.ma=function(){this.s||(this.s=!0,this.N())},ye.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function O(a,u){this.type=a,this.g=this.target=u,this.defaultPrevented=!1}O.prototype.h=function(){this.defaultPrevented=!0};var Z=function(){if(!l.addEventListener||!Object.defineProperty)return!1;var a=!1,u=Object.defineProperty({},"passive",{get:function(){a=!0}});try{const h=()=>{};l.addEventListener("test",h,u),l.removeEventListener("test",h,u)}catch{}return a}();function we(a,u){if(O.call(this,a?a.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,a){var h=this.type=a.type,g=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;if(this.target=a.target||a.srcElement,this.g=u,u=a.relatedTarget){if(z){e:{try{N(u.nodeName);var k=!0;break e}catch{}k=!1}k||(u=null)}}else h=="mouseover"?u=a.fromElement:h=="mouseout"&&(u=a.toElement);this.relatedTarget=u,g?(this.clientX=g.clientX!==void 0?g.clientX:g.pageX,this.clientY=g.clientY!==void 0?g.clientY:g.pageY,this.screenX=g.screenX||0,this.screenY=g.screenY||0):(this.clientX=a.clientX!==void 0?a.clientX:a.pageX,this.clientY=a.clientY!==void 0?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0),this.button=a.button,this.key=a.key||"",this.ctrlKey=a.ctrlKey,this.altKey=a.altKey,this.shiftKey=a.shiftKey,this.metaKey=a.metaKey,this.pointerId=a.pointerId||0,this.pointerType=typeof a.pointerType=="string"?a.pointerType:se[a.pointerType]||"",this.state=a.state,this.i=a,a.defaultPrevented&&we.aa.h.call(this)}}I(we,O);var se={2:"touch",3:"pen",4:"mouse"};we.prototype.h=function(){we.aa.h.call(this);var a=this.i;a.preventDefault?a.preventDefault():a.returnValue=!1};var ce="closure_listenable_"+(1e6*Math.random()|0),Te=0;function Kn(a,u,h,g,k){this.listener=a,this.proxy=null,this.src=u,this.type=h,this.capture=!!g,this.ha=k,this.key=++Te,this.da=this.fa=!1}function ut(a){a.da=!0,a.listener=null,a.proxy=null,a.src=null,a.ha=null}function ht(a){this.src=a,this.g={},this.h=0}ht.prototype.add=function(a,u,h,g,k){var P=a.toString();a=this.g[P],a||(a=this.g[P]=[],this.h++);var F=Nt(a,u,g,k);return-1<F?(u=a[F],h||(u.fa=!1)):(u=new Kn(u,this.src,P,!!g,k),u.fa=h,a.push(u)),u};function en(a,u){var h=u.type;if(h in a.g){var g=a.g[h],k=Array.prototype.indexOf.call(g,u,void 0),P;(P=0<=k)&&Array.prototype.splice.call(g,k,1),P&&(ut(u),a.g[h].length==0&&(delete a.g[h],a.h--))}}function Nt(a,u,h,g){for(var k=0;k<a.length;++k){var P=a[k];if(!P.da&&P.listener==u&&P.capture==!!h&&P.ha==g)return k}return-1}var et="closure_lm_"+(1e6*Math.random()|0),ft={};function bn(a,u,h,g,k){if(Array.isArray(u)){for(var P=0;P<u.length;P++)bn(a,u[P],h,g,k);return null}return h=En(h),a&&a[ce]?a.K(u,h,d(g)?!!g.capture:!1,k):wn(a,u,h,!1,g,k)}function wn(a,u,h,g,k,P){if(!u)throw Error("Invalid event type");var F=d(k)?!!k.capture:!!k,be=nn(a);if(be||(a[et]=be=new ht(a)),h=be.add(u,h,g,F,P),h.proxy)return h;if(g=tn(),h.proxy=g,g.src=a,g.listener=h,a.addEventListener)Z||(k=F),k===void 0&&(k=!1),a.addEventListener(u.toString(),g,k);else if(a.attachEvent)a.attachEvent(wt(u.toString()),g);else if(a.addListener&&a.removeListener)a.addListener(g);else throw Error("addEventListener and attachEvent are unavailable.");return h}function tn(){function a(h){return u.call(a.src,a.listener,h)}const u=Qn;return a}function _n(a,u,h,g,k){if(Array.isArray(u))for(var P=0;P<u.length;P++)_n(a,u[P],h,g,k);else g=d(g)?!!g.capture:!!g,h=En(h),a&&a[ce]?(a=a.i,u=String(u).toString(),u in a.g&&(P=a.g[u],h=Nt(P,h,g,k),-1<h&&(ut(P[h]),Array.prototype.splice.call(P,h,1),P.length==0&&(delete a.g[u],a.h--)))):a&&(a=nn(a))&&(u=a.g[u.toString()],a=-1,u&&(a=Nt(u,h,g,k)),(h=-1<a?u[a]:null)&&Ht(h))}function Ht(a){if(typeof a!="number"&&a&&!a.da){var u=a.src;if(u&&u[ce])en(u.i,a);else{var h=a.type,g=a.proxy;u.removeEventListener?u.removeEventListener(h,g,a.capture):u.detachEvent?u.detachEvent(wt(h),g):u.addListener&&u.removeListener&&u.removeListener(g),(h=nn(u))?(en(h,a),h.h==0&&(h.src=null,u[et]=null)):ut(a)}}}function wt(a){return a in ft?ft[a]:ft[a]="on"+a}function Qn(a,u){if(a.da)a=!0;else{u=new we(u,this);var h=a.listener,g=a.ha||a.src;a.fa&&Ht(a),a=h.call(g,u)}return a}function nn(a){return a=a[et],a instanceof ht?a:null}var Wt="__closure_events_fn_"+(1e9*Math.random()>>>0);function En(a){return typeof a=="function"?a:(a[Wt]||(a[Wt]=function(u){return a.handleEvent(u)}),a[Wt])}function _e(){ye.call(this),this.i=new ht(this),this.M=this,this.F=null}I(_e,ye),_e.prototype[ce]=!0,_e.prototype.removeEventListener=function(a,u,h,g){_n(this,a,u,h,g)};function fe(a,u){var h,g=a.F;if(g)for(h=[];g;g=g.F)h.push(g);if(a=a.M,g=u.type||u,typeof u=="string")u=new O(u,a);else if(u instanceof O)u.target=u.target||a;else{var k=u;u=new O(g,a),w(u,k)}if(k=!0,h)for(var P=h.length-1;0<=P;P--){var F=u.g=h[P];k=rn(F,g,!0,u)&&k}if(F=u.g=a,k=rn(F,g,!0,u)&&k,k=rn(F,g,!1,u)&&k,h)for(P=0;P<h.length;P++)F=u.g=h[P],k=rn(F,g,!1,u)&&k}_e.prototype.N=function(){if(_e.aa.N.call(this),this.i){var a=this.i,u;for(u in a.g){for(var h=a.g[u],g=0;g<h.length;g++)ut(h[g]);delete a.g[u],a.h--}}this.F=null},_e.prototype.K=function(a,u,h,g){return this.i.add(String(a),u,!1,h,g)},_e.prototype.L=function(a,u,h,g){return this.i.add(String(a),u,!0,h,g)};function rn(a,u,h,g){if(u=a.i.g[String(u)],!u)return!0;u=u.concat();for(var k=!0,P=0;P<u.length;++P){var F=u[P];if(F&&!F.da&&F.capture==h){var be=F.listener,Ge=F.ha||F.src;F.fa&&en(a.i,F),k=be.call(Ge,g)!==!1&&k}}return k&&!g.defaultPrevented}function sn(a,u,h){if(typeof a=="function")h&&(a=p(a,h));else if(a&&typeof a.handleEvent=="function")a=p(a.handleEvent,a);else throw Error("Invalid listener argument");return 2147483647<Number(u)?-1:l.setTimeout(a,u||0)}function Jn(a){a.g=sn(()=>{a.g=null,a.i&&(a.i=!1,Jn(a))},a.l);const u=a.h;a.h=null,a.m.apply(null,u)}class Xs extends ye{constructor(u,h){super(),this.m=u,this.l=h,this.h=null,this.i=!1,this.g=null}j(u){this.h=arguments,this.g?this.i=!0:Jn(this)}N(){super.N(),this.g&&(l.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Tn(a){ye.call(this),this.h=a,this.g={}}I(Tn,ye);var In=[];function on(a){q(a.g,function(u,h){this.g.hasOwnProperty(h)&&Ht(u)},a),a.g={}}Tn.prototype.N=function(){Tn.aa.N.call(this),on(this)},Tn.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var tt=l.JSON.stringify,_t=l.JSON.parse,ie=class{stringify(a){return l.JSON.stringify(a,void 0)}parse(a){return l.JSON.parse(a,void 0)}};function Rt(){}Rt.prototype.h=null;function Ot(a){return a.h||(a.h=a.i())}function Yt(){}var pt={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function Vr(){O.call(this,"d")}I(Vr,O);function xi(){O.call(this,"c")}I(xi,O);var xn={},zr=null;function Si(){return zr=zr||new _e}xn.La="serverreachability";function $r(a){O.call(this,xn.La,a)}I($r,O);function Xn(a){const u=Si();fe(u,new $r(u))}xn.STAT_EVENT="statevent";function X(a,u){O.call(this,xn.STAT_EVENT,a),this.stat=u}I(X,O);function de(a){const u=Si();fe(u,new X(u,a))}xn.Ma="timingevent";function $e(a,u){O.call(this,xn.Ma,a),this.size=u}I($e,O);function He(a,u){if(typeof a!="function")throw Error("Fn must not be null and must be a function");return l.setTimeout(function(){a()},u)}function mt(){this.g=!0}mt.prototype.xa=function(){this.g=!1};function Oe(a,u,h,g,k,P){a.info(function(){if(a.g)if(P)for(var F="",be=P.split("&"),Ge=0;Ge<be.length;Ge++){var ue=be[Ge].split("=");if(1<ue.length){var nt=ue[0];ue=ue[1];var it=nt.split("_");F=2<=it.length&&it[1]=="type"?F+(nt+"="+ue+"&"):F+(nt+"=redacted&")}}else F=null;else F=P;return"XMLHTTP REQ ("+g+") [attempt "+k+"]: "+u+`
`+h+`
`+F})}function jt(a,u,h,g,k,P,F){a.info(function(){return"XMLHTTP RESP ("+g+") [ attempt "+k+"]: "+u+`
`+h+`
`+P+" "+F})}function ve(a,u,h,g){a.info(function(){return"XMLHTTP TEXT ("+u+"): "+gt(a,h)+(g?" "+g:"")})}function je(a,u){a.info(function(){return"TIMEOUT: "+u})}mt.prototype.info=function(){};function gt(a,u){if(!a.g)return u;if(!u)return null;try{var h=JSON.parse(u);if(h){for(a=0;a<h.length;a++)if(Array.isArray(h[a])){var g=h[a];if(!(2>g.length)){var k=g[1];if(Array.isArray(k)&&!(1>k.length)){var P=k[0];if(P!="noop"&&P!="stop"&&P!="close")for(var F=1;F<k.length;F++)k[F]=""}}}}return tt(h)}catch{return u}}var Ie={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},Zn={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},Ai;function Ur(){}I(Ur,Rt),Ur.prototype.g=function(){return new XMLHttpRequest},Ur.prototype.i=function(){return{}},Ai=new Ur;function ei(a,u,h,g){this.j=a,this.i=u,this.l=h,this.R=g||1,this.U=new Tn(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new Cd}function Cd(){this.i=null,this.g="",this.h=!1}var Md={},za={};function $a(a,u,h){a.L=1,a.v=no(Sn(u)),a.m=h,a.P=!0,Dd(a,null)}function Dd(a,u){a.F=Date.now(),Zs(a),a.A=Sn(a.v);var h=a.A,g=a.R;Array.isArray(g)||(g=[String(g)]),jd(h.i,"t",g),a.C=0,h=a.j.J,a.h=new Cd,a.g=uu(a.j,h?u:null,!a.m),0<a.O&&(a.M=new Xs(p(a.Y,a,a.g),a.O)),u=a.U,h=a.g,g=a.ca;var k="readystatechange";Array.isArray(k)||(k&&(In[0]=k.toString()),k=In);for(var P=0;P<k.length;P++){var F=bn(h,k[P],g||u.handleEvent,!1,u.h||u);if(!F)break;u.g[F.key]=F}u=a.H?v(a.H):{},a.m?(a.u||(a.u="POST"),u["Content-Type"]="application/x-www-form-urlencoded",a.g.ea(a.A,a.u,a.m,u)):(a.u="GET",a.g.ea(a.A,a.u,null,u)),Xn(),Oe(a.i,a.u,a.A,a.l,a.R,a.m)}ei.prototype.ca=function(a){a=a.target;const u=this.M;u&&An(a)==3?u.j():this.Y(a)},ei.prototype.Y=function(a){try{if(a==this.g)e:{const it=An(this.g);var u=this.g.Ba();const nr=this.g.Z();if(!(3>it)&&(it!=3||this.g&&(this.h.h||this.g.oa()||eu(this.g)))){this.J||it!=4||u==7||(u==8||0>=nr?Xn(3):Xn(2)),Ua(this);var h=this.g.Z();this.X=h;t:if(Bd(this)){var g=eu(this.g);a="";var k=g.length,P=An(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){ki(this),qr(this);var F="";break t}this.h.i=new l.TextDecoder}for(u=0;u<k;u++)this.h.h=!0,a+=this.h.i.decode(g[u],{stream:!(P&&u==k-1)});g.length=0,this.h.g+=a,this.C=0,F=this.h.g}else F=this.g.oa();if(this.o=h==200,jt(this.i,this.u,this.A,this.l,this.R,it,h),this.o){if(this.T&&!this.K){t:{if(this.g){var be,Ge=this.g;if((be=Ge.g?Ge.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!C(be)){var ue=be;break t}}ue=null}if(h=ue)ve(this.i,this.l,h,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,qa(this,h);else{this.o=!1,this.s=3,de(12),ki(this),qr(this);break e}}if(this.P){h=!0;let Gt;for(;!this.J&&this.C<F.length;)if(Gt=Dg(this,F),Gt==za){it==4&&(this.s=4,de(14),h=!1),ve(this.i,this.l,null,"[Incomplete Response]");break}else if(Gt==Md){this.s=4,de(15),ve(this.i,this.l,F,"[Invalid Chunk]"),h=!1;break}else ve(this.i,this.l,Gt,null),qa(this,Gt);if(Bd(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),it!=4||F.length!=0||this.h.h||(this.s=1,de(16),h=!1),this.o=this.o&&h,!h)ve(this.i,this.l,F,"[Invalid Chunked Response]"),ki(this),qr(this);else if(0<F.length&&!this.W){this.W=!0;var nt=this.j;nt.g==this&&nt.ba&&!nt.M&&(nt.j.info("Great, no buffering proxy detected. Bytes received: "+F.length),Ka(nt),nt.M=!0,de(11))}}else ve(this.i,this.l,F,null),qa(this,F);it==4&&ki(this),this.o&&!this.J&&(it==4?au(this.j,this):(this.o=!1,Zs(this)))}else Qg(this.g),h==400&&0<F.indexOf("Unknown SID")?(this.s=3,de(12)):(this.s=0,de(13)),ki(this),qr(this)}}}catch{}finally{}};function Bd(a){return a.g?a.u=="GET"&&a.L!=2&&a.j.Ca:!1}function Dg(a,u){var h=a.C,g=u.indexOf(`
`,h);return g==-1?za:(h=Number(u.substring(h,g)),isNaN(h)?Md:(g+=1,g+h>u.length?za:(u=u.slice(g,g+h),a.C=g+h,u)))}ei.prototype.cancel=function(){this.J=!0,ki(this)};function Zs(a){a.S=Date.now()+a.I,Ld(a,a.I)}function Ld(a,u){if(a.B!=null)throw Error("WatchDog timer not null");a.B=He(p(a.ba,a),u)}function Ua(a){a.B&&(l.clearTimeout(a.B),a.B=null)}ei.prototype.ba=function(){this.B=null;const a=Date.now();0<=a-this.S?(je(this.i,this.A),this.L!=2&&(Xn(),de(17)),ki(this),this.s=2,qr(this)):Ld(this,this.S-a)};function qr(a){a.j.G==0||a.J||au(a.j,a)}function ki(a){Ua(a);var u=a.M;u&&typeof u.ma=="function"&&u.ma(),a.M=null,on(a.U),a.g&&(u=a.g,a.g=null,u.abort(),u.ma())}function qa(a,u){try{var h=a.j;if(h.G!=0&&(h.g==a||Ha(h.h,a))){if(!a.K&&Ha(h.h,a)&&h.G==3){try{var g=h.Da.g.parse(u)}catch{g=null}if(Array.isArray(g)&&g.length==3){var k=g;if(k[0]==0){e:if(!h.u){if(h.g)if(h.g.F+3e3<a.F)lo(h),oo(h);else break e;Ga(h),de(18)}}else h.za=k[1],0<h.za-h.T&&37500>k[2]&&h.F&&h.v==0&&!h.C&&(h.C=He(p(h.Za,h),6e3));if(1>=Fd(h.h)&&h.ca){try{h.ca()}catch{}h.ca=void 0}}else Pi(h,11)}else if((a.K||h.g==a)&&lo(h),!C(u))for(k=h.Da.g.parse(u),u=0;u<k.length;u++){let ue=k[u];if(h.T=ue[0],ue=ue[1],h.G==2)if(ue[0]=="c"){h.K=ue[1],h.ia=ue[2];const nt=ue[3];nt!=null&&(h.la=nt,h.j.info("VER="+h.la));const it=ue[4];it!=null&&(h.Aa=it,h.j.info("SVER="+h.Aa));const nr=ue[5];nr!=null&&typeof nr=="number"&&0<nr&&(g=1.5*nr,h.L=g,h.j.info("backChannelRequestTimeoutMs_="+g)),g=h;const Gt=a.g;if(Gt){const uo=Gt.g?Gt.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(uo){var P=g.h;P.g||uo.indexOf("spdy")==-1&&uo.indexOf("quic")==-1&&uo.indexOf("h2")==-1||(P.j=P.l,P.g=new Set,P.h&&(Wa(P,P.h),P.h=null))}if(g.D){const Qa=Gt.g?Gt.g.getResponseHeader("X-HTTP-Session-Id"):null;Qa&&(g.ya=Qa,Ee(g.I,g.D,Qa))}}h.G=3,h.l&&h.l.ua(),h.ba&&(h.R=Date.now()-a.F,h.j.info("Handshake RTT: "+h.R+"ms")),g=h;var F=a;if(g.qa=du(g,g.J?g.ia:null,g.W),F.K){Vd(g.h,F);var be=F,Ge=g.L;Ge&&(be.I=Ge),be.B&&(Ua(be),Zs(be)),g.g=F}else su(g);0<h.i.length&&ao(h)}else ue[0]!="stop"&&ue[0]!="close"||Pi(h,7);else h.G==3&&(ue[0]=="stop"||ue[0]=="close"?ue[0]=="stop"?Pi(h,7):ja(h):ue[0]!="noop"&&h.l&&h.l.ta(ue),h.v=0)}}Xn(4)}catch{}}var Bg=class{constructor(a,u){this.g=a,this.map=u}};function Nd(a){this.l=a||10,l.PerformanceNavigationTiming?(a=l.performance.getEntriesByType("navigation"),a=0<a.length&&(a[0].nextHopProtocol=="hq"||a[0].nextHopProtocol=="h2")):a=!!(l.chrome&&l.chrome.loadTimes&&l.chrome.loadTimes()&&l.chrome.loadTimes().wasFetchedViaSpdy),this.j=a?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function Od(a){return a.h?!0:a.g?a.g.size>=a.j:!1}function Fd(a){return a.h?1:a.g?a.g.size:0}function Ha(a,u){return a.h?a.h==u:a.g?a.g.has(u):!1}function Wa(a,u){a.g?a.g.add(u):a.h=u}function Vd(a,u){a.h&&a.h==u?a.h=null:a.g&&a.g.has(u)&&a.g.delete(u)}Nd.prototype.cancel=function(){if(this.i=zd(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const a of this.g.values())a.cancel();this.g.clear()}};function zd(a){if(a.h!=null)return a.i.concat(a.h.D);if(a.g!=null&&a.g.size!==0){let u=a.i;for(const h of a.g.values())u=u.concat(h.D);return u}return x(a.i)}function Lg(a){if(a.V&&typeof a.V=="function")return a.V();if(typeof Map<"u"&&a instanceof Map||typeof Set<"u"&&a instanceof Set)return Array.from(a.values());if(typeof a=="string")return a.split("");if(c(a)){for(var u=[],h=a.length,g=0;g<h;g++)u.push(a[g]);return u}u=[],h=0;for(g in a)u[h++]=a[g];return u}function Ng(a){if(a.na&&typeof a.na=="function")return a.na();if(!a.V||typeof a.V!="function"){if(typeof Map<"u"&&a instanceof Map)return Array.from(a.keys());if(!(typeof Set<"u"&&a instanceof Set)){if(c(a)||typeof a=="string"){var u=[];a=a.length;for(var h=0;h<a;h++)u.push(h);return u}u=[],h=0;for(const g in a)u[h++]=g;return u}}}function $d(a,u){if(a.forEach&&typeof a.forEach=="function")a.forEach(u,void 0);else if(c(a)||typeof a=="string")Array.prototype.forEach.call(a,u,void 0);else for(var h=Ng(a),g=Lg(a),k=g.length,P=0;P<k;P++)u.call(void 0,g[P],h&&h[P],a)}var Ud=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Og(a,u){if(a){a=a.split("&");for(var h=0;h<a.length;h++){var g=a[h].indexOf("="),k=null;if(0<=g){var P=a[h].substring(0,g);k=a[h].substring(g+1)}else P=a[h];u(P,k?decodeURIComponent(k.replace(/\+/g," ")):"")}}}function Ri(a){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,a instanceof Ri){this.h=a.h,eo(this,a.j),this.o=a.o,this.g=a.g,to(this,a.s),this.l=a.l;var u=a.i,h=new Yr;h.i=u.i,u.g&&(h.g=new Map(u.g),h.h=u.h),qd(this,h),this.m=a.m}else a&&(u=String(a).match(Ud))?(this.h=!1,eo(this,u[1]||"",!0),this.o=Hr(u[2]||""),this.g=Hr(u[3]||"",!0),to(this,u[4]),this.l=Hr(u[5]||"",!0),qd(this,u[6]||"",!0),this.m=Hr(u[7]||"")):(this.h=!1,this.i=new Yr(null,this.h))}Ri.prototype.toString=function(){var a=[],u=this.j;u&&a.push(Wr(u,Hd,!0),":");var h=this.g;return(h||u=="file")&&(a.push("//"),(u=this.o)&&a.push(Wr(u,Hd,!0),"@"),a.push(encodeURIComponent(String(h)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),h=this.s,h!=null&&a.push(":",String(h))),(h=this.l)&&(this.g&&h.charAt(0)!="/"&&a.push("/"),a.push(Wr(h,h.charAt(0)=="/"?zg:Vg,!0))),(h=this.i.toString())&&a.push("?",h),(h=this.m)&&a.push("#",Wr(h,Ug)),a.join("")};function Sn(a){return new Ri(a)}function eo(a,u,h){a.j=h?Hr(u,!0):u,a.j&&(a.j=a.j.replace(/:$/,""))}function to(a,u){if(u){if(u=Number(u),isNaN(u)||0>u)throw Error("Bad port number "+u);a.s=u}else a.s=null}function qd(a,u,h){u instanceof Yr?(a.i=u,qg(a.i,a.h)):(h||(u=Wr(u,$g)),a.i=new Yr(u,a.h))}function Ee(a,u,h){a.i.set(u,h)}function no(a){return Ee(a,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),a}function Hr(a,u){return a?u?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""}function Wr(a,u,h){return typeof a=="string"?(a=encodeURI(a).replace(u,Fg),h&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null}function Fg(a){return a=a.charCodeAt(0),"%"+(a>>4&15).toString(16)+(a&15).toString(16)}var Hd=/[#\/\?@]/g,Vg=/[#\?:]/g,zg=/[#\?]/g,$g=/[#\?@]/g,Ug=/#/g;function Yr(a,u){this.h=this.g=null,this.i=a||null,this.j=!!u}function ti(a){a.g||(a.g=new Map,a.h=0,a.i&&Og(a.i,function(u,h){a.add(decodeURIComponent(u.replace(/\+/g," ")),h)}))}t=Yr.prototype,t.add=function(a,u){ti(this),this.i=null,a=er(this,a);var h=this.g.get(a);return h||this.g.set(a,h=[]),h.push(u),this.h+=1,this};function Wd(a,u){ti(a),u=er(a,u),a.g.has(u)&&(a.i=null,a.h-=a.g.get(u).length,a.g.delete(u))}function Yd(a,u){return ti(a),u=er(a,u),a.g.has(u)}t.forEach=function(a,u){ti(this),this.g.forEach(function(h,g){h.forEach(function(k){a.call(u,k,g,this)},this)},this)},t.na=function(){ti(this);const a=Array.from(this.g.values()),u=Array.from(this.g.keys()),h=[];for(let g=0;g<u.length;g++){const k=a[g];for(let P=0;P<k.length;P++)h.push(u[g])}return h},t.V=function(a){ti(this);let u=[];if(typeof a=="string")Yd(this,a)&&(u=u.concat(this.g.get(er(this,a))));else{a=Array.from(this.g.values());for(let h=0;h<a.length;h++)u=u.concat(a[h])}return u},t.set=function(a,u){return ti(this),this.i=null,a=er(this,a),Yd(this,a)&&(this.h-=this.g.get(a).length),this.g.set(a,[u]),this.h+=1,this},t.get=function(a,u){return a?(a=this.V(a),0<a.length?String(a[0]):u):u};function jd(a,u,h){Wd(a,u),0<h.length&&(a.i=null,a.g.set(er(a,u),x(h)),a.h+=h.length)}t.toString=function(){if(this.i)return this.i;if(!this.g)return"";const a=[],u=Array.from(this.g.keys());for(var h=0;h<u.length;h++){var g=u[h];const P=encodeURIComponent(String(g)),F=this.V(g);for(g=0;g<F.length;g++){var k=P;F[g]!==""&&(k+="="+encodeURIComponent(String(F[g]))),a.push(k)}}return this.i=a.join("&")};function er(a,u){return u=String(u),a.j&&(u=u.toLowerCase()),u}function qg(a,u){u&&!a.j&&(ti(a),a.i=null,a.g.forEach(function(h,g){var k=g.toLowerCase();g!=k&&(Wd(this,g),jd(this,k,h))},a)),a.j=u}function Hg(a,u){const h=new mt;if(l.Image){const g=new Image;g.onload=y(ni,h,"TestLoadImage: loaded",!0,u,g),g.onerror=y(ni,h,"TestLoadImage: error",!1,u,g),g.onabort=y(ni,h,"TestLoadImage: abort",!1,u,g),g.ontimeout=y(ni,h,"TestLoadImage: timeout",!1,u,g),l.setTimeout(function(){g.ontimeout&&g.ontimeout()},1e4),g.src=a}else u(!1)}function Wg(a,u){const h=new mt,g=new AbortController,k=setTimeout(()=>{g.abort(),ni(h,"TestPingServer: timeout",!1,u)},1e4);fetch(a,{signal:g.signal}).then(P=>{clearTimeout(k),P.ok?ni(h,"TestPingServer: ok",!0,u):ni(h,"TestPingServer: server error",!1,u)}).catch(()=>{clearTimeout(k),ni(h,"TestPingServer: error",!1,u)})}function ni(a,u,h,g,k){try{k&&(k.onload=null,k.onerror=null,k.onabort=null,k.ontimeout=null),g(h)}catch{}}function Yg(){this.g=new ie}function jg(a,u,h){const g=h||"";try{$d(a,function(k,P){let F=k;d(k)&&(F=tt(k)),u.push(g+P+"="+encodeURIComponent(F))})}catch(k){throw u.push(g+"type="+encodeURIComponent("_badmap")),k}}function io(a){this.l=a.Ub||null,this.j=a.eb||!1}I(io,Rt),io.prototype.g=function(){return new ro(this.l,this.j)},io.prototype.i=function(a){return function(){return a}}({});function ro(a,u){_e.call(this),this.D=a,this.o=u,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}I(ro,_e),t=ro.prototype,t.open=function(a,u){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=a,this.A=u,this.readyState=1,Gr(this)},t.send=function(a){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const u={headers:this.u,method:this.B,credentials:this.m,cache:void 0};a&&(u.body=a),(this.D||l).fetch(new Request(this.A,u)).then(this.Sa.bind(this),this.ga.bind(this))},t.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,jr(this)),this.readyState=0},t.Sa=function(a){if(this.g&&(this.l=a,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=a.headers,this.readyState=2,Gr(this)),this.g&&(this.readyState=3,Gr(this),this.g)))if(this.responseType==="arraybuffer")a.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof l.ReadableStream<"u"&&"body"in a){if(this.j=a.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;Gd(this)}else a.text().then(this.Ra.bind(this),this.ga.bind(this))};function Gd(a){a.j.read().then(a.Pa.bind(a)).catch(a.ga.bind(a))}t.Pa=function(a){if(this.g){if(this.o&&a.value)this.response.push(a.value);else if(!this.o){var u=a.value?a.value:new Uint8Array(0);(u=this.v.decode(u,{stream:!a.done}))&&(this.response=this.responseText+=u)}a.done?jr(this):Gr(this),this.readyState==3&&Gd(this)}},t.Ra=function(a){this.g&&(this.response=this.responseText=a,jr(this))},t.Qa=function(a){this.g&&(this.response=a,jr(this))},t.ga=function(){this.g&&jr(this)};function jr(a){a.readyState=4,a.l=null,a.j=null,a.v=null,Gr(a)}t.setRequestHeader=function(a,u){this.u.append(a,u)},t.getResponseHeader=function(a){return this.h&&this.h.get(a.toLowerCase())||""},t.getAllResponseHeaders=function(){if(!this.h)return"";const a=[],u=this.h.entries();for(var h=u.next();!h.done;)h=h.value,a.push(h[0]+": "+h[1]),h=u.next();return a.join(`\r
`)};function Gr(a){a.onreadystatechange&&a.onreadystatechange.call(a)}Object.defineProperty(ro.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(a){this.m=a?"include":"same-origin"}});function Kd(a){let u="";return q(a,function(h,g){u+=g,u+=":",u+=h,u+=`\r
`}),u}function Ya(a,u,h){e:{for(g in h){var g=!1;break e}g=!0}g||(h=Kd(h),typeof a=="string"?h!=null&&encodeURIComponent(String(h)):Ee(a,u,h))}function De(a){_e.call(this),this.headers=new Map,this.o=a||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}I(De,_e);var Gg=/^https?$/i,Kg=["POST","PUT"];t=De.prototype,t.Ha=function(a){this.J=a},t.ea=function(a,u,h,g){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+a);u=u?u.toUpperCase():"GET",this.D=a,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():Ai.g(),this.v=this.o?Ot(this.o):Ot(Ai),this.g.onreadystatechange=p(this.Ea,this);try{this.B=!0,this.g.open(u,String(a),!0),this.B=!1}catch(P){Qd(this,P);return}if(a=h||"",h=new Map(this.headers),g)if(Object.getPrototypeOf(g)===Object.prototype)for(var k in g)h.set(k,g[k]);else if(typeof g.keys=="function"&&typeof g.get=="function")for(const P of g.keys())h.set(P,g.get(P));else throw Error("Unknown input type for opt_headers: "+String(g));g=Array.from(h.keys()).find(P=>P.toLowerCase()=="content-type"),k=l.FormData&&a instanceof l.FormData,!(0<=Array.prototype.indexOf.call(Kg,u,void 0))||g||k||h.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[P,F]of h)this.g.setRequestHeader(P,F);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{Zd(this),this.u=!0,this.g.send(a),this.u=!1}catch(P){Qd(this,P)}};function Qd(a,u){a.h=!1,a.g&&(a.j=!0,a.g.abort(),a.j=!1),a.l=u,a.m=5,Jd(a),so(a)}function Jd(a){a.A||(a.A=!0,fe(a,"complete"),fe(a,"error"))}t.abort=function(a){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=a||7,fe(this,"complete"),fe(this,"abort"),so(this))},t.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),so(this,!0)),De.aa.N.call(this)},t.Ea=function(){this.s||(this.B||this.u||this.j?Xd(this):this.bb())},t.bb=function(){Xd(this)};function Xd(a){if(a.h&&typeof o<"u"&&(!a.v[1]||An(a)!=4||a.Z()!=2)){if(a.u&&An(a)==4)sn(a.Ea,0,a);else if(fe(a,"readystatechange"),An(a)==4){a.h=!1;try{const F=a.Z();e:switch(F){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var u=!0;break e;default:u=!1}var h;if(!(h=u)){var g;if(g=F===0){var k=String(a.D).match(Ud)[1]||null;!k&&l.self&&l.self.location&&(k=l.self.location.protocol.slice(0,-1)),g=!Gg.test(k?k.toLowerCase():"")}h=g}if(h)fe(a,"complete"),fe(a,"success");else{a.m=6;try{var P=2<An(a)?a.g.statusText:""}catch{P=""}a.l=P+" ["+a.Z()+"]",Jd(a)}}finally{so(a)}}}}function so(a,u){if(a.g){Zd(a);const h=a.g,g=a.v[0]?()=>{}:null;a.g=null,a.v=null,u||fe(a,"ready");try{h.onreadystatechange=g}catch{}}}function Zd(a){a.I&&(l.clearTimeout(a.I),a.I=null)}t.isActive=function(){return!!this.g};function An(a){return a.g?a.g.readyState:0}t.Z=function(){try{return 2<An(this)?this.g.status:-1}catch{return-1}},t.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},t.Oa=function(a){if(this.g){var u=this.g.responseText;return a&&u.indexOf(a)==0&&(u=u.substring(a.length)),_t(u)}};function eu(a){try{if(!a.g)return null;if("response"in a.g)return a.g.response;switch(a.H){case"":case"text":return a.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in a.g)return a.g.mozResponseArrayBuffer}return null}catch{return null}}function Qg(a){const u={};a=(a.g&&2<=An(a)&&a.g.getAllResponseHeaders()||"").split(`\r
`);for(let g=0;g<a.length;g++){if(C(a[g]))continue;var h=E(a[g]);const k=h[0];if(h=h[1],typeof h!="string")continue;h=h.trim();const P=u[k]||[];u[k]=P,P.push(h)}T(u,function(g){return g.join(", ")})}t.Ba=function(){return this.m},t.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function Kr(a,u,h){return h&&h.internalChannelParams&&h.internalChannelParams[a]||u}function tu(a){this.Aa=0,this.i=[],this.j=new mt,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=Kr("failFast",!1,a),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=Kr("baseRetryDelayMs",5e3,a),this.cb=Kr("retryDelaySeedMs",1e4,a),this.Wa=Kr("forwardChannelMaxRetries",2,a),this.wa=Kr("forwardChannelRequestTimeoutMs",2e4,a),this.pa=a&&a.xmlHttpFactory||void 0,this.Xa=a&&a.Tb||void 0,this.Ca=a&&a.useFetchStreams||!1,this.L=void 0,this.J=a&&a.supportsCrossDomainXhr||!1,this.K="",this.h=new Nd(a&&a.concurrentRequestLimit),this.Da=new Yg,this.P=a&&a.fastHandshake||!1,this.O=a&&a.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=a&&a.Rb||!1,a&&a.xa&&this.j.xa(),a&&a.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&a&&a.detectBufferingProxy||!1,this.ja=void 0,a&&a.longPollingTimeout&&0<a.longPollingTimeout&&(this.ja=a.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}t=tu.prototype,t.la=8,t.G=1,t.connect=function(a,u,h,g){de(0),this.W=a,this.H=u||{},h&&g!==void 0&&(this.H.OSID=h,this.H.OAID=g),this.F=this.X,this.I=du(this,null,this.W),ao(this)};function ja(a){if(nu(a),a.G==3){var u=a.U++,h=Sn(a.I);if(Ee(h,"SID",a.K),Ee(h,"RID",u),Ee(h,"TYPE","terminate"),Qr(a,h),u=new ei(a,a.j,u),u.L=2,u.v=no(Sn(h)),h=!1,l.navigator&&l.navigator.sendBeacon)try{h=l.navigator.sendBeacon(u.v.toString(),"")}catch{}!h&&l.Image&&(new Image().src=u.v,h=!0),h||(u.g=uu(u.j,null),u.g.ea(u.v)),u.F=Date.now(),Zs(u)}cu(a)}function oo(a){a.g&&(Ka(a),a.g.cancel(),a.g=null)}function nu(a){oo(a),a.u&&(l.clearTimeout(a.u),a.u=null),lo(a),a.h.cancel(),a.s&&(typeof a.s=="number"&&l.clearTimeout(a.s),a.s=null)}function ao(a){if(!Od(a.h)&&!a.s){a.s=!0;var u=a.Ga;ee||Me(),ne||(ee(),ne=!0),te.add(u,a),a.B=0}}function Jg(a,u){return Fd(a.h)>=a.h.j-(a.s?1:0)?!1:a.s?(a.i=u.D.concat(a.i),!0):a.G==1||a.G==2||a.B>=(a.Va?0:a.Wa)?!1:(a.s=He(p(a.Ga,a,u),lu(a,a.B)),a.B++,!0)}t.Ga=function(a){if(this.s)if(this.s=null,this.G==1){if(!a){this.U=Math.floor(1e5*Math.random()),a=this.U++;const k=new ei(this,this.j,a);let P=this.o;if(this.S&&(P?(P=v(P),w(P,this.S)):P=this.S),this.m!==null||this.O||(k.H=P,P=null),this.P)e:{for(var u=0,h=0;h<this.i.length;h++){t:{var g=this.i[h];if("__data__"in g.map&&(g=g.map.__data__,typeof g=="string")){g=g.length;break t}g=void 0}if(g===void 0)break;if(u+=g,4096<u){u=h;break e}if(u===4096||h===this.i.length-1){u=h+1;break e}}u=1e3}else u=1e3;u=ru(this,k,u),h=Sn(this.I),Ee(h,"RID",a),Ee(h,"CVER",22),this.D&&Ee(h,"X-HTTP-Session-Id",this.D),Qr(this,h),P&&(this.O?u="headers="+encodeURIComponent(String(Kd(P)))+"&"+u:this.m&&Ya(h,this.m,P)),Wa(this.h,k),this.Ua&&Ee(h,"TYPE","init"),this.P?(Ee(h,"$req",u),Ee(h,"SID","null"),k.T=!0,$a(k,h,null)):$a(k,h,u),this.G=2}}else this.G==3&&(a?iu(this,a):this.i.length==0||Od(this.h)||iu(this))};function iu(a,u){var h;u?h=u.l:h=a.U++;const g=Sn(a.I);Ee(g,"SID",a.K),Ee(g,"RID",h),Ee(g,"AID",a.T),Qr(a,g),a.m&&a.o&&Ya(g,a.m,a.o),h=new ei(a,a.j,h,a.B+1),a.m===null&&(h.H=a.o),u&&(a.i=u.D.concat(a.i)),u=ru(a,h,1e3),h.I=Math.round(.5*a.wa)+Math.round(.5*a.wa*Math.random()),Wa(a.h,h),$a(h,g,u)}function Qr(a,u){a.H&&q(a.H,function(h,g){Ee(u,g,h)}),a.l&&$d({},function(h,g){Ee(u,g,h)})}function ru(a,u,h){h=Math.min(a.i.length,h);var g=a.l?p(a.l.Na,a.l,a):null;e:{var k=a.i;let P=-1;for(;;){const F=["count="+h];P==-1?0<h?(P=k[0].g,F.push("ofs="+P)):P=0:F.push("ofs="+P);let be=!0;for(let Ge=0;Ge<h;Ge++){let ue=k[Ge].g;const nt=k[Ge].map;if(ue-=P,0>ue)P=Math.max(0,k[Ge].g-100),be=!1;else try{jg(nt,F,"req"+ue+"_")}catch{g&&g(nt)}}if(be){g=F.join("&");break e}}}return a=a.i.splice(0,h),u.D=a,g}function su(a){if(!a.g&&!a.u){a.Y=1;var u=a.Fa;ee||Me(),ne||(ee(),ne=!0),te.add(u,a),a.v=0}}function Ga(a){return a.g||a.u||3<=a.v?!1:(a.Y++,a.u=He(p(a.Fa,a),lu(a,a.v)),a.v++,!0)}t.Fa=function(){if(this.u=null,ou(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var a=2*this.R;this.j.info("BP detection timer enabled: "+a),this.A=He(p(this.ab,this),a)}},t.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,de(10),oo(this),ou(this))};function Ka(a){a.A!=null&&(l.clearTimeout(a.A),a.A=null)}function ou(a){a.g=new ei(a,a.j,"rpc",a.Y),a.m===null&&(a.g.H=a.o),a.g.O=0;var u=Sn(a.qa);Ee(u,"RID","rpc"),Ee(u,"SID",a.K),Ee(u,"AID",a.T),Ee(u,"CI",a.F?"0":"1"),!a.F&&a.ja&&Ee(u,"TO",a.ja),Ee(u,"TYPE","xmlhttp"),Qr(a,u),a.m&&a.o&&Ya(u,a.m,a.o),a.L&&(a.g.I=a.L);var h=a.g;a=a.ia,h.L=1,h.v=no(Sn(u)),h.m=null,h.P=!0,Dd(h,a)}t.Za=function(){this.C!=null&&(this.C=null,oo(this),Ga(this),de(19))};function lo(a){a.C!=null&&(l.clearTimeout(a.C),a.C=null)}function au(a,u){var h=null;if(a.g==u){lo(a),Ka(a),a.g=null;var g=2}else if(Ha(a.h,u))h=u.D,Vd(a.h,u),g=1;else return;if(a.G!=0){if(u.o)if(g==1){h=u.m?u.m.length:0,u=Date.now()-u.F;var k=a.B;g=Si(),fe(g,new $e(g,h)),ao(a)}else su(a);else if(k=u.s,k==3||k==0&&0<u.X||!(g==1&&Jg(a,u)||g==2&&Ga(a)))switch(h&&0<h.length&&(u=a.h,u.i=u.i.concat(h)),k){case 1:Pi(a,5);break;case 4:Pi(a,10);break;case 3:Pi(a,6);break;default:Pi(a,2)}}}function lu(a,u){let h=a.Ta+Math.floor(Math.random()*a.cb);return a.isActive()||(h*=2),h*u}function Pi(a,u){if(a.j.info("Error code "+u),u==2){var h=p(a.fb,a),g=a.Xa;const k=!g;g=new Ri(g||"//www.google.com/images/cleardot.gif"),l.location&&l.location.protocol=="http"||eo(g,"https"),no(g),k?Hg(g.toString(),h):Wg(g.toString(),h)}else de(2);a.G=0,a.l&&a.l.sa(u),cu(a),nu(a)}t.fb=function(a){a?(this.j.info("Successfully pinged google.com"),de(2)):(this.j.info("Failed to ping google.com"),de(1))};function cu(a){if(a.G=0,a.ka=[],a.l){const u=zd(a.h);(u.length!=0||a.i.length!=0)&&(A(a.ka,u),A(a.ka,a.i),a.h.i.length=0,x(a.i),a.i.length=0),a.l.ra()}}function du(a,u,h){var g=h instanceof Ri?Sn(h):new Ri(h);if(g.g!="")u&&(g.g=u+"."+g.g),to(g,g.s);else{var k=l.location;g=k.protocol,u=u?u+"."+k.hostname:k.hostname,k=+k.port;var P=new Ri(null);g&&eo(P,g),u&&(P.g=u),k&&to(P,k),h&&(P.l=h),g=P}return h=a.D,u=a.ya,h&&u&&Ee(g,h,u),Ee(g,"VER",a.la),Qr(a,g),g}function uu(a,u,h){if(u&&!a.J)throw Error("Can't create secondary domain capable XhrIo object.");return u=a.Ca&&!a.pa?new De(new io({eb:h})):new De(a.pa),u.Ha(a.J),u}t.isActive=function(){return!!this.l&&this.l.isActive(this)};function hu(){}t=hu.prototype,t.ua=function(){},t.ta=function(){},t.sa=function(){},t.ra=function(){},t.isActive=function(){return!0},t.Na=function(){};function co(){}co.prototype.g=function(a,u){return new Pt(a,u)};function Pt(a,u){_e.call(this),this.g=new tu(u),this.l=a,this.h=u&&u.messageUrlParams||null,a=u&&u.messageHeaders||null,u&&u.clientProtocolHeaderRequired&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"}),this.g.o=a,a=u&&u.initMessageHeaders||null,u&&u.messageContentType&&(a?a["X-WebChannel-Content-Type"]=u.messageContentType:a={"X-WebChannel-Content-Type":u.messageContentType}),u&&u.va&&(a?a["X-WebChannel-Client-Profile"]=u.va:a={"X-WebChannel-Client-Profile":u.va}),this.g.S=a,(a=u&&u.Sb)&&!C(a)&&(this.g.m=a),this.v=u&&u.supportsCrossDomainXhr||!1,this.u=u&&u.sendRawJson||!1,(u=u&&u.httpSessionIdParam)&&!C(u)&&(this.g.D=u,a=this.h,a!==null&&u in a&&(a=this.h,u in a&&delete a[u])),this.j=new tr(this)}I(Pt,_e),Pt.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},Pt.prototype.close=function(){ja(this.g)},Pt.prototype.o=function(a){var u=this.g;if(typeof a=="string"){var h={};h.__data__=a,a=h}else this.u&&(h={},h.__data__=tt(a),a=h);u.i.push(new Bg(u.Ya++,a)),u.G==3&&ao(u)},Pt.prototype.N=function(){this.g.l=null,delete this.j,ja(this.g),delete this.g,Pt.aa.N.call(this)};function fu(a){Vr.call(this),a.__headers__&&(this.headers=a.__headers__,this.statusCode=a.__status__,delete a.__headers__,delete a.__status__);var u=a.__sm__;if(u){e:{for(const h in u){a=h;break e}a=void 0}(this.i=a)&&(a=this.i,u=u!==null&&a in u?u[a]:void 0),this.data=u}else this.data=a}I(fu,Vr);function pu(){xi.call(this),this.status=1}I(pu,xi);function tr(a){this.g=a}I(tr,hu),tr.prototype.ua=function(){fe(this.g,"a")},tr.prototype.ta=function(a){fe(this.g,new fu(a))},tr.prototype.sa=function(a){fe(this.g,new pu)},tr.prototype.ra=function(){fe(this.g,"b")},co.prototype.createWebChannel=co.prototype.g,Pt.prototype.send=Pt.prototype.o,Pt.prototype.open=Pt.prototype.m,Pt.prototype.close=Pt.prototype.close,Xf=function(){return new co},Jf=function(){return Si()},Qf=xn,Tl={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},Ie.NO_ERROR=0,Ie.TIMEOUT=8,Ie.HTTP_ERROR=6,To=Ie,Zn.COMPLETE="complete",Kf=Zn,Yt.EventType=pt,pt.OPEN="a",pt.CLOSE="b",pt.ERROR="c",pt.MESSAGE="d",_e.prototype.listen=_e.prototype.K,ts=Yt,De.prototype.listenOnce=De.prototype.L,De.prototype.getLastError=De.prototype.Ka,De.prototype.getLastErrorCode=De.prototype.Ba,De.prototype.getStatus=De.prototype.Z,De.prototype.getResponseJson=De.prototype.Oa,De.prototype.getResponseText=De.prototype.oa,De.prototype.send=De.prototype.ea,De.prototype.setWithCredentials=De.prototype.Ha,Gf=De}).apply(typeof po<"u"?po:typeof self<"u"?self:typeof window<"u"?window:{});const Gu="@firebase/firestore";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class st{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}st.UNAUTHENTICATED=new st(null),st.GOOGLE_CREDENTIALS=new st("google-credentials-uid"),st.FIRST_PARTY=new st("first-party-uid"),st.MOCK_USER=new st("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Cr="10.14.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hi=new nc("@firebase/firestore");function Jr(){return Hi.logLevel}function $(t,...e){if(Hi.logLevel<=oe.DEBUG){const n=e.map(gc);Hi.debug(`Firestore (${Cr}): ${t}`,...n)}}function $n(t,...e){if(Hi.logLevel<=oe.ERROR){const n=e.map(gc);Hi.error(`Firestore (${Cr}): ${t}`,...n)}}function br(t,...e){if(Hi.logLevel<=oe.WARN){const n=e.map(gc);Hi.warn(`Firestore (${Cr}): ${t}`,...n)}}function gc(t){if(typeof t=="string")return t;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
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
 */function G(t="Unexpected state"){const e=`FIRESTORE (${Cr}) INTERNAL ASSERTION FAILED: `+t;throw $n(e),new Error(e)}function me(t,e){t||G()}function J(t,e){return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const M={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class U extends Wn{constructor(e,n){super(e,n),this.code=e,this.message=n,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class On{constructor(){this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zf{constructor(e,n){this.user=n,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class bw{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,n){e.enqueueRetryable(()=>n(st.UNAUTHENTICATED))}shutdown(){}}class ww{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,n){this.changeListener=n,e.enqueueRetryable(()=>n(this.token.user))}shutdown(){this.changeListener=null}}class _w{constructor(e){this.t=e,this.currentUser=st.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,n){me(this.o===void 0);let i=this.i;const r=c=>this.i!==i?(i=this.i,n(c)):Promise.resolve();let s=new On;this.o=()=>{this.i++,this.currentUser=this.u(),s.resolve(),s=new On,e.enqueueRetryable(()=>r(this.currentUser))};const o=()=>{const c=s;e.enqueueRetryable(async()=>{await c.promise,await r(this.currentUser)})},l=c=>{$("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=c,this.o&&(this.auth.addAuthTokenListener(this.o),o())};this.t.onInit(c=>l(c)),setTimeout(()=>{if(!this.auth){const c=this.t.getImmediate({optional:!0});c?l(c):($("FirebaseAuthCredentialsProvider","Auth not yet detected"),s.resolve(),s=new On)}},0),o()}getToken(){const e=this.i,n=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(n).then(i=>this.i!==e?($("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):i?(me(typeof i.accessToken=="string"),new Zf(i.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return me(e===null||typeof e=="string"),new st(e)}}class Ew{constructor(e,n,i){this.l=e,this.h=n,this.P=i,this.type="FirstParty",this.user=st.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class Tw{constructor(e,n,i){this.l=e,this.h=n,this.P=i}getToken(){return Promise.resolve(new Ew(this.l,this.h,this.P))}start(e,n){e.enqueueRetryable(()=>n(st.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class Iw{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class xw{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,n){me(this.o===void 0);const i=s=>{s.error!=null&&$("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${s.error.message}`);const o=s.token!==this.R;return this.R=s.token,$("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?n(s.token):Promise.resolve()};this.o=s=>{e.enqueueRetryable(()=>i(s))};const r=s=>{$("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=s,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(s=>r(s)),setTimeout(()=>{if(!this.appCheck){const s=this.A.getImmediate({optional:!0});s?r(s):$("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(n=>n?(me(typeof n.token=="string"),this.R=n.token,new Iw(n.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sw(t){const e=typeof self<"u"&&(self.crypto||self.msCrypto),n=new Uint8Array(t);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(n);else for(let i=0;i<t;i++)n[i]=Math.floor(256*Math.random());return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ep{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=Math.floor(256/e.length)*e.length;let i="";for(;i.length<20;){const r=Sw(40);for(let s=0;s<r.length;++s)i.length<20&&r[s]<n&&(i+=e.charAt(r[s]%e.length))}return i}}function he(t,e){return t<e?-1:t>e?1:0}function wr(t,e,n){return t.length===e.length&&t.every((i,r)=>n(i,e[r]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qe{constructor(e,n){if(this.seconds=e,this.nanoseconds=n,n<0)throw new U(M.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(n>=1e9)throw new U(M.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(e<-62135596800)throw new U(M.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new U(M.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return qe.fromMillis(Date.now())}static fromDate(e){return qe.fromMillis(e.getTime())}static fromMillis(e){const n=Math.floor(e/1e3),i=Math.floor(1e6*(e-1e3*n));return new qe(n,i)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?he(this.nanoseconds,e.nanoseconds):he(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Q{constructor(e){this.timestamp=e}static fromTimestamp(e){return new Q(e)}static min(){return new Q(new qe(0,0))}static max(){return new Q(new qe(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ys{constructor(e,n,i){n===void 0?n=0:n>e.length&&G(),i===void 0?i=e.length-n:i>e.length-n&&G(),this.segments=e,this.offset=n,this.len=i}get length(){return this.len}isEqual(e){return ys.comparator(this,e)===0}child(e){const n=this.segments.slice(this.offset,this.limit());return e instanceof ys?e.forEach(i=>{n.push(i)}):n.push(e),this.construct(n)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}forEach(e){for(let n=this.offset,i=this.limit();n<i;n++)e(this.segments[n])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,n){const i=Math.min(e.length,n.length);for(let r=0;r<i;r++){const s=e.get(r),o=n.get(r);if(s<o)return-1;if(s>o)return 1}return e.length<n.length?-1:e.length>n.length?1:0}}class ke extends ys{construct(e,n,i){return new ke(e,n,i)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const n=[];for(const i of e){if(i.indexOf("//")>=0)throw new U(M.INVALID_ARGUMENT,`Invalid segment (${i}). Paths must not contain // in them.`);n.push(...i.split("/").filter(r=>r.length>0))}return new ke(n)}static emptyPath(){return new ke([])}}const Aw=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Qe extends ys{construct(e,n,i){return new Qe(e,n,i)}static isValidIdentifier(e){return Aw.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Qe.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new Qe(["__name__"])}static fromServerFormat(e){const n=[];let i="",r=0;const s=()=>{if(i.length===0)throw new U(M.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);n.push(i),i=""};let o=!1;for(;r<e.length;){const l=e[r];if(l==="\\"){if(r+1===e.length)throw new U(M.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const c=e[r+1];if(c!=="\\"&&c!=="."&&c!=="`")throw new U(M.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);i+=c,r+=2}else l==="`"?(o=!o,r++):l!=="."||o?(i+=l,r++):(s(),r++)}if(s(),o)throw new U(M.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new Qe(n)}static emptyPath(){return new Qe([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class W{constructor(e){this.path=e}static fromPath(e){return new W(ke.fromString(e))}static fromName(e){return new W(ke.fromString(e).popFirst(5))}static empty(){return new W(ke.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&ke.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,n){return ke.comparator(e.path,n.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new W(new ke(e.slice()))}}function kw(t,e){const n=t.toTimestamp().seconds,i=t.toTimestamp().nanoseconds+1,r=Q.fromTimestamp(i===1e9?new qe(n+1,0):new qe(n,i));return new gi(r,W.empty(),e)}function Rw(t){return new gi(t.readTime,t.key,-1)}class gi{constructor(e,n,i){this.readTime=e,this.documentKey=n,this.largestBatchId=i}static min(){return new gi(Q.min(),W.empty(),-1)}static max(){return new gi(Q.max(),W.empty(),-1)}}function Pw(t,e){let n=t.readTime.compareTo(e.readTime);return n!==0?n:(n=W.comparator(t.documentKey,e.documentKey),n!==0?n:he(t.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cw="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class Mw{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Fs(t){if(t.code!==M.FAILED_PRECONDITION||t.message!==Cw)throw t;$("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class B{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(n=>{this.isDone=!0,this.result=n,this.nextCallback&&this.nextCallback(n)},n=>{this.isDone=!0,this.error=n,this.catchCallback&&this.catchCallback(n)})}catch(e){return this.next(void 0,e)}next(e,n){return this.callbackAttached&&G(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(n,this.error):this.wrapSuccess(e,this.result):new B((i,r)=>{this.nextCallback=s=>{this.wrapSuccess(e,s).next(i,r)},this.catchCallback=s=>{this.wrapFailure(n,s).next(i,r)}})}toPromise(){return new Promise((e,n)=>{this.next(e,n)})}wrapUserFunction(e){try{const n=e();return n instanceof B?n:B.resolve(n)}catch(n){return B.reject(n)}}wrapSuccess(e,n){return e?this.wrapUserFunction(()=>e(n)):B.resolve(n)}wrapFailure(e,n){return e?this.wrapUserFunction(()=>e(n)):B.reject(n)}static resolve(e){return new B((n,i)=>{n(e)})}static reject(e){return new B((n,i)=>{i(e)})}static waitFor(e){return new B((n,i)=>{let r=0,s=0,o=!1;e.forEach(l=>{++r,l.next(()=>{++s,o&&s===r&&n()},c=>i(c))}),o=!0,s===r&&n()})}static or(e){let n=B.resolve(!1);for(const i of e)n=n.next(r=>r?B.resolve(r):i());return n}static forEach(e,n){const i=[];return e.forEach((r,s)=>{i.push(n.call(this,r,s))}),this.waitFor(i)}static mapArray(e,n){return new B((i,r)=>{const s=e.length,o=new Array(s);let l=0;for(let c=0;c<s;c++){const d=c;n(e[d]).next(f=>{o[d]=f,++l,l===s&&i(o)},f=>r(f))}})}static doWhile(e,n){return new B((i,r)=>{const s=()=>{e()===!0?n().next(()=>{s()},r):i()};s()})}}function Dw(t){const e=t.match(/Android ([\d.]+)/i),n=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(n)}function Vs(t){return t.name==="IndexedDbTransactionError"}/**
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
 */class yc{constructor(e,n){this.previousValue=e,n&&(n.sequenceNumberHandler=i=>this.ie(i),this.se=i=>n.writeSequenceNumber(i))}ie(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.se&&this.se(e),e}}yc.oe=-1;function ca(t){return t==null}function $o(t){return t===0&&1/t==-1/0}function Bw(t){return typeof t=="number"&&Number.isInteger(t)&&!$o(t)&&t<=Number.MAX_SAFE_INTEGER&&t>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ku(t){let e=0;for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e++;return e}function Ki(t,e){for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e(n,t[n])}function tp(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ce{constructor(e,n){this.comparator=e,this.root=n||Ke.EMPTY}insert(e,n){return new Ce(this.comparator,this.root.insert(e,n,this.comparator).copy(null,null,Ke.BLACK,null,null))}remove(e){return new Ce(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Ke.BLACK,null,null))}get(e){let n=this.root;for(;!n.isEmpty();){const i=this.comparator(e,n.key);if(i===0)return n.value;i<0?n=n.left:i>0&&(n=n.right)}return null}indexOf(e){let n=0,i=this.root;for(;!i.isEmpty();){const r=this.comparator(e,i.key);if(r===0)return n+i.left.size;r<0?i=i.left:(n+=i.left.size+1,i=i.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((n,i)=>(e(n,i),!1))}toString(){const e=[];return this.inorderTraversal((n,i)=>(e.push(`${n}:${i}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new mo(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new mo(this.root,e,this.comparator,!1)}getReverseIterator(){return new mo(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new mo(this.root,e,this.comparator,!0)}}class mo{constructor(e,n,i,r){this.isReverse=r,this.nodeStack=[];let s=1;for(;!e.isEmpty();)if(s=n?i(e.key,n):1,n&&r&&(s*=-1),s<0)e=this.isReverse?e.left:e.right;else{if(s===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const n={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return n}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class Ke{constructor(e,n,i,r,s){this.key=e,this.value=n,this.color=i??Ke.RED,this.left=r??Ke.EMPTY,this.right=s??Ke.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,n,i,r,s){return new Ke(e??this.key,n??this.value,i??this.color,r??this.left,s??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,n,i){let r=this;const s=i(e,r.key);return r=s<0?r.copy(null,null,null,r.left.insert(e,n,i),null):s===0?r.copy(null,n,null,null,null):r.copy(null,null,null,null,r.right.insert(e,n,i)),r.fixUp()}removeMin(){if(this.left.isEmpty())return Ke.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,n){let i,r=this;if(n(e,r.key)<0)r.left.isEmpty()||r.left.isRed()||r.left.left.isRed()||(r=r.moveRedLeft()),r=r.copy(null,null,null,r.left.remove(e,n),null);else{if(r.left.isRed()&&(r=r.rotateRight()),r.right.isEmpty()||r.right.isRed()||r.right.left.isRed()||(r=r.moveRedRight()),n(e,r.key)===0){if(r.right.isEmpty())return Ke.EMPTY;i=r.right.min(),r=r.copy(i.key,i.value,null,null,r.right.removeMin())}r=r.copy(null,null,null,null,r.right.remove(e,n))}return r.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Ke.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Ke.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),n=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,n)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw G();const e=this.left.check();if(e!==this.right.check())throw G();return e+(this.isRed()?0:1)}}Ke.EMPTY=null,Ke.RED=!0,Ke.BLACK=!1;Ke.EMPTY=new class{constructor(){this.size=0}get key(){throw G()}get value(){throw G()}get color(){throw G()}get left(){throw G()}get right(){throw G()}copy(e,n,i,r,s){return this}insert(e,n,i){return new Ke(e,n)}remove(e,n){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Je{constructor(e){this.comparator=e,this.data=new Ce(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((n,i)=>(e(n),!1))}forEachInRange(e,n){const i=this.data.getIteratorFrom(e[0]);for(;i.hasNext();){const r=i.getNext();if(this.comparator(r.key,e[1])>=0)return;n(r.key)}}forEachWhile(e,n){let i;for(i=n!==void 0?this.data.getIteratorFrom(n):this.data.getIterator();i.hasNext();)if(!e(i.getNext().key))return}firstAfterOrEqual(e){const n=this.data.getIteratorFrom(e);return n.hasNext()?n.getNext().key:null}getIterator(){return new Qu(this.data.getIterator())}getIteratorFrom(e){return new Qu(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let n=this;return n.size<e.size&&(n=e,e=this),e.forEach(i=>{n=n.add(i)}),n}isEqual(e){if(!(e instanceof Je)||this.size!==e.size)return!1;const n=this.data.getIterator(),i=e.data.getIterator();for(;n.hasNext();){const r=n.getNext().key,s=i.getNext().key;if(this.comparator(r,s)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(n=>{e.push(n)}),e}toString(){const e=[];return this.forEach(n=>e.push(n)),"SortedSet("+e.toString()+")"}copy(e){const n=new Je(this.comparator);return n.data=e,n}}class Qu{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ct{constructor(e){this.fields=e,e.sort(Qe.comparator)}static empty(){return new Ct([])}unionWith(e){let n=new Je(Qe.comparator);for(const i of this.fields)n=n.add(i);for(const i of e)n=n.add(i);return new Ct(n.toArray())}covers(e){for(const n of this.fields)if(n.isPrefixOf(e))return!0;return!1}isEqual(e){return wr(this.fields,e.fields,(n,i)=>n.isEqual(i))}}/**
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
 */class np extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ze{constructor(e){this.binaryString=e}static fromBase64String(e){const n=function(r){try{return atob(r)}catch(s){throw typeof DOMException<"u"&&s instanceof DOMException?new np("Invalid base64 string: "+s):s}}(e);return new Ze(n)}static fromUint8Array(e){const n=function(r){let s="";for(let o=0;o<r.length;++o)s+=String.fromCharCode(r[o]);return s}(e);return new Ze(n)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(n){return btoa(n)}(this.binaryString)}toUint8Array(){return function(n){const i=new Uint8Array(n.length);for(let r=0;r<n.length;r++)i[r]=n.charCodeAt(r);return i}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return he(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}Ze.EMPTY_BYTE_STRING=new Ze("");const Lw=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function yi(t){if(me(!!t),typeof t=="string"){let e=0;const n=Lw.exec(t);if(me(!!n),n[1]){let r=n[1];r=(r+"000000000").substr(0,9),e=Number(r)}const i=new Date(t);return{seconds:Math.floor(i.getTime()/1e3),nanos:e}}return{seconds:Le(t.seconds),nanos:Le(t.nanos)}}function Le(t){return typeof t=="number"?t:typeof t=="string"?Number(t):0}function Wi(t){return typeof t=="string"?Ze.fromBase64String(t):Ze.fromUint8Array(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vc(t){var e,n;return((n=(((e=t==null?void 0:t.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||n===void 0?void 0:n.stringValue)==="server_timestamp"}function bc(t){const e=t.mapValue.fields.__previous_value__;return vc(e)?bc(e):e}function vs(t){const e=yi(t.mapValue.fields.__local_write_time__.timestampValue);return new qe(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nw{constructor(e,n,i,r,s,o,l,c,d){this.databaseId=e,this.appId=n,this.persistenceKey=i,this.host=r,this.ssl=s,this.forceLongPolling=o,this.autoDetectLongPolling=l,this.longPollingOptions=c,this.useFetchStreams=d}}class bs{constructor(e,n){this.projectId=e,this.database=n||"(default)"}static empty(){return new bs("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof bs&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const go={mapValue:{}};function Yi(t){return"nullValue"in t?0:"booleanValue"in t?1:"integerValue"in t||"doubleValue"in t?2:"timestampValue"in t?3:"stringValue"in t?5:"bytesValue"in t?6:"referenceValue"in t?7:"geoPointValue"in t?8:"arrayValue"in t?9:"mapValue"in t?vc(t)?4:Fw(t)?9007199254740991:Ow(t)?10:11:G()}function fn(t,e){if(t===e)return!0;const n=Yi(t);if(n!==Yi(e))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return t.booleanValue===e.booleanValue;case 4:return vs(t).isEqual(vs(e));case 3:return function(r,s){if(typeof r.timestampValue=="string"&&typeof s.timestampValue=="string"&&r.timestampValue.length===s.timestampValue.length)return r.timestampValue===s.timestampValue;const o=yi(r.timestampValue),l=yi(s.timestampValue);return o.seconds===l.seconds&&o.nanos===l.nanos}(t,e);case 5:return t.stringValue===e.stringValue;case 6:return function(r,s){return Wi(r.bytesValue).isEqual(Wi(s.bytesValue))}(t,e);case 7:return t.referenceValue===e.referenceValue;case 8:return function(r,s){return Le(r.geoPointValue.latitude)===Le(s.geoPointValue.latitude)&&Le(r.geoPointValue.longitude)===Le(s.geoPointValue.longitude)}(t,e);case 2:return function(r,s){if("integerValue"in r&&"integerValue"in s)return Le(r.integerValue)===Le(s.integerValue);if("doubleValue"in r&&"doubleValue"in s){const o=Le(r.doubleValue),l=Le(s.doubleValue);return o===l?$o(o)===$o(l):isNaN(o)&&isNaN(l)}return!1}(t,e);case 9:return wr(t.arrayValue.values||[],e.arrayValue.values||[],fn);case 10:case 11:return function(r,s){const o=r.mapValue.fields||{},l=s.mapValue.fields||{};if(Ku(o)!==Ku(l))return!1;for(const c in o)if(o.hasOwnProperty(c)&&(l[c]===void 0||!fn(o[c],l[c])))return!1;return!0}(t,e);default:return G()}}function ws(t,e){return(t.values||[]).find(n=>fn(n,e))!==void 0}function _r(t,e){if(t===e)return 0;const n=Yi(t),i=Yi(e);if(n!==i)return he(n,i);switch(n){case 0:case 9007199254740991:return 0;case 1:return he(t.booleanValue,e.booleanValue);case 2:return function(s,o){const l=Le(s.integerValue||s.doubleValue),c=Le(o.integerValue||o.doubleValue);return l<c?-1:l>c?1:l===c?0:isNaN(l)?isNaN(c)?0:-1:1}(t,e);case 3:return Ju(t.timestampValue,e.timestampValue);case 4:return Ju(vs(t),vs(e));case 5:return he(t.stringValue,e.stringValue);case 6:return function(s,o){const l=Wi(s),c=Wi(o);return l.compareTo(c)}(t.bytesValue,e.bytesValue);case 7:return function(s,o){const l=s.split("/"),c=o.split("/");for(let d=0;d<l.length&&d<c.length;d++){const f=he(l[d],c[d]);if(f!==0)return f}return he(l.length,c.length)}(t.referenceValue,e.referenceValue);case 8:return function(s,o){const l=he(Le(s.latitude),Le(o.latitude));return l!==0?l:he(Le(s.longitude),Le(o.longitude))}(t.geoPointValue,e.geoPointValue);case 9:return Xu(t.arrayValue,e.arrayValue);case 10:return function(s,o){var l,c,d,f;const m=s.fields||{},p=o.fields||{},y=(l=m.value)===null||l===void 0?void 0:l.arrayValue,I=(c=p.value)===null||c===void 0?void 0:c.arrayValue,x=he(((d=y==null?void 0:y.values)===null||d===void 0?void 0:d.length)||0,((f=I==null?void 0:I.values)===null||f===void 0?void 0:f.length)||0);return x!==0?x:Xu(y,I)}(t.mapValue,e.mapValue);case 11:return function(s,o){if(s===go.mapValue&&o===go.mapValue)return 0;if(s===go.mapValue)return 1;if(o===go.mapValue)return-1;const l=s.fields||{},c=Object.keys(l),d=o.fields||{},f=Object.keys(d);c.sort(),f.sort();for(let m=0;m<c.length&&m<f.length;++m){const p=he(c[m],f[m]);if(p!==0)return p;const y=_r(l[c[m]],d[f[m]]);if(y!==0)return y}return he(c.length,f.length)}(t.mapValue,e.mapValue);default:throw G()}}function Ju(t,e){if(typeof t=="string"&&typeof e=="string"&&t.length===e.length)return he(t,e);const n=yi(t),i=yi(e),r=he(n.seconds,i.seconds);return r!==0?r:he(n.nanos,i.nanos)}function Xu(t,e){const n=t.values||[],i=e.values||[];for(let r=0;r<n.length&&r<i.length;++r){const s=_r(n[r],i[r]);if(s)return s}return he(n.length,i.length)}function Er(t){return Il(t)}function Il(t){return"nullValue"in t?"null":"booleanValue"in t?""+t.booleanValue:"integerValue"in t?""+t.integerValue:"doubleValue"in t?""+t.doubleValue:"timestampValue"in t?function(n){const i=yi(n);return`time(${i.seconds},${i.nanos})`}(t.timestampValue):"stringValue"in t?t.stringValue:"bytesValue"in t?function(n){return Wi(n).toBase64()}(t.bytesValue):"referenceValue"in t?function(n){return W.fromName(n).toString()}(t.referenceValue):"geoPointValue"in t?function(n){return`geo(${n.latitude},${n.longitude})`}(t.geoPointValue):"arrayValue"in t?function(n){let i="[",r=!0;for(const s of n.values||[])r?r=!1:i+=",",i+=Il(s);return i+"]"}(t.arrayValue):"mapValue"in t?function(n){const i=Object.keys(n.fields||{}).sort();let r="{",s=!0;for(const o of i)s?s=!1:r+=",",r+=`${o}:${Il(n.fields[o])}`;return r+"}"}(t.mapValue):G()}function xl(t){return!!t&&"integerValue"in t}function wc(t){return!!t&&"arrayValue"in t}function Zu(t){return!!t&&"nullValue"in t}function eh(t){return!!t&&"doubleValue"in t&&isNaN(Number(t.doubleValue))}function Io(t){return!!t&&"mapValue"in t}function Ow(t){var e,n;return((n=(((e=t==null?void 0:t.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||n===void 0?void 0:n.stringValue)==="__vector__"}function ls(t){if(t.geoPointValue)return{geoPointValue:Object.assign({},t.geoPointValue)};if(t.timestampValue&&typeof t.timestampValue=="object")return{timestampValue:Object.assign({},t.timestampValue)};if(t.mapValue){const e={mapValue:{fields:{}}};return Ki(t.mapValue.fields,(n,i)=>e.mapValue.fields[n]=ls(i)),e}if(t.arrayValue){const e={arrayValue:{values:[]}};for(let n=0;n<(t.arrayValue.values||[]).length;++n)e.arrayValue.values[n]=ls(t.arrayValue.values[n]);return e}return Object.assign({},t)}function Fw(t){return(((t.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Et{constructor(e){this.value=e}static empty(){return new Et({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let n=this.value;for(let i=0;i<e.length-1;++i)if(n=(n.mapValue.fields||{})[e.get(i)],!Io(n))return null;return n=(n.mapValue.fields||{})[e.lastSegment()],n||null}}set(e,n){this.getFieldsMap(e.popLast())[e.lastSegment()]=ls(n)}setAll(e){let n=Qe.emptyPath(),i={},r=[];e.forEach((o,l)=>{if(!n.isImmediateParentOf(l)){const c=this.getFieldsMap(n);this.applyChanges(c,i,r),i={},r=[],n=l.popLast()}o?i[l.lastSegment()]=ls(o):r.push(l.lastSegment())});const s=this.getFieldsMap(n);this.applyChanges(s,i,r)}delete(e){const n=this.field(e.popLast());Io(n)&&n.mapValue.fields&&delete n.mapValue.fields[e.lastSegment()]}isEqual(e){return fn(this.value,e.value)}getFieldsMap(e){let n=this.value;n.mapValue.fields||(n.mapValue={fields:{}});for(let i=0;i<e.length;++i){let r=n.mapValue.fields[e.get(i)];Io(r)&&r.mapValue.fields||(r={mapValue:{fields:{}}},n.mapValue.fields[e.get(i)]=r),n=r}return n.mapValue.fields}applyChanges(e,n,i){Ki(n,(r,s)=>e[r]=s);for(const r of i)delete e[r]}clone(){return new Et(ls(this.value))}}function ip(t){const e=[];return Ki(t.fields,(n,i)=>{const r=new Qe([n]);if(Io(i)){const s=ip(i.mapValue).fields;if(s.length===0)e.push(r);else for(const o of s)e.push(r.child(o))}else e.push(r)}),new Ct(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ot{constructor(e,n,i,r,s,o,l){this.key=e,this.documentType=n,this.version=i,this.readTime=r,this.createTime=s,this.data=o,this.documentState=l}static newInvalidDocument(e){return new ot(e,0,Q.min(),Q.min(),Q.min(),Et.empty(),0)}static newFoundDocument(e,n,i,r){return new ot(e,1,n,Q.min(),i,r,0)}static newNoDocument(e,n){return new ot(e,2,n,Q.min(),Q.min(),Et.empty(),0)}static newUnknownDocument(e,n){return new ot(e,3,n,Q.min(),Q.min(),Et.empty(),2)}convertToFoundDocument(e,n){return!this.createTime.isEqual(Q.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=n,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Et.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Et.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=Q.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof ot&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new ot(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class Uo{constructor(e,n){this.position=e,this.inclusive=n}}function th(t,e,n){let i=0;for(let r=0;r<t.position.length;r++){const s=e[r],o=t.position[r];if(s.field.isKeyField()?i=W.comparator(W.fromName(o.referenceValue),n.key):i=_r(o,n.data.field(s.field)),s.dir==="desc"&&(i*=-1),i!==0)break}return i}function nh(t,e){if(t===null)return e===null;if(e===null||t.inclusive!==e.inclusive||t.position.length!==e.position.length)return!1;for(let n=0;n<t.position.length;n++)if(!fn(t.position[n],e.position[n]))return!1;return!0}/**
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
 */class qo{constructor(e,n="asc"){this.field=e,this.dir=n}}function Vw(t,e){return t.dir===e.dir&&t.field.isEqual(e.field)}/**
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
 */class rp{}class Ue extends rp{constructor(e,n,i){super(),this.field=e,this.op=n,this.value=i}static create(e,n,i){return e.isKeyField()?n==="in"||n==="not-in"?this.createKeyFieldInFilter(e,n,i):new $w(e,n,i):n==="array-contains"?new Hw(e,i):n==="in"?new Ww(e,i):n==="not-in"?new Yw(e,i):n==="array-contains-any"?new jw(e,i):new Ue(e,n,i)}static createKeyFieldInFilter(e,n,i){return n==="in"?new Uw(e,i):new qw(e,i)}matches(e){const n=e.data.field(this.field);return this.op==="!="?n!==null&&this.matchesComparison(_r(n,this.value)):n!==null&&Yi(this.value)===Yi(n)&&this.matchesComparison(_r(n,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return G()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class pn extends rp{constructor(e,n){super(),this.filters=e,this.op=n,this.ae=null}static create(e,n){return new pn(e,n)}matches(e){return sp(this)?this.filters.find(n=>!n.matches(e))===void 0:this.filters.find(n=>n.matches(e))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce((e,n)=>e.concat(n.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function sp(t){return t.op==="and"}function op(t){return zw(t)&&sp(t)}function zw(t){for(const e of t.filters)if(e instanceof pn)return!1;return!0}function Sl(t){if(t instanceof Ue)return t.field.canonicalString()+t.op.toString()+Er(t.value);if(op(t))return t.filters.map(e=>Sl(e)).join(",");{const e=t.filters.map(n=>Sl(n)).join(",");return`${t.op}(${e})`}}function ap(t,e){return t instanceof Ue?function(i,r){return r instanceof Ue&&i.op===r.op&&i.field.isEqual(r.field)&&fn(i.value,r.value)}(t,e):t instanceof pn?function(i,r){return r instanceof pn&&i.op===r.op&&i.filters.length===r.filters.length?i.filters.reduce((s,o,l)=>s&&ap(o,r.filters[l]),!0):!1}(t,e):void G()}function lp(t){return t instanceof Ue?function(n){return`${n.field.canonicalString()} ${n.op} ${Er(n.value)}`}(t):t instanceof pn?function(n){return n.op.toString()+" {"+n.getFilters().map(lp).join(" ,")+"}"}(t):"Filter"}class $w extends Ue{constructor(e,n,i){super(e,n,i),this.key=W.fromName(i.referenceValue)}matches(e){const n=W.comparator(e.key,this.key);return this.matchesComparison(n)}}class Uw extends Ue{constructor(e,n){super(e,"in",n),this.keys=cp("in",n)}matches(e){return this.keys.some(n=>n.isEqual(e.key))}}class qw extends Ue{constructor(e,n){super(e,"not-in",n),this.keys=cp("not-in",n)}matches(e){return!this.keys.some(n=>n.isEqual(e.key))}}function cp(t,e){var n;return(((n=e.arrayValue)===null||n===void 0?void 0:n.values)||[]).map(i=>W.fromName(i.referenceValue))}class Hw extends Ue{constructor(e,n){super(e,"array-contains",n)}matches(e){const n=e.data.field(this.field);return wc(n)&&ws(n.arrayValue,this.value)}}class Ww extends Ue{constructor(e,n){super(e,"in",n)}matches(e){const n=e.data.field(this.field);return n!==null&&ws(this.value.arrayValue,n)}}class Yw extends Ue{constructor(e,n){super(e,"not-in",n)}matches(e){if(ws(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const n=e.data.field(this.field);return n!==null&&!ws(this.value.arrayValue,n)}}class jw extends Ue{constructor(e,n){super(e,"array-contains-any",n)}matches(e){const n=e.data.field(this.field);return!(!wc(n)||!n.arrayValue.values)&&n.arrayValue.values.some(i=>ws(this.value.arrayValue,i))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gw{constructor(e,n=null,i=[],r=[],s=null,o=null,l=null){this.path=e,this.collectionGroup=n,this.orderBy=i,this.filters=r,this.limit=s,this.startAt=o,this.endAt=l,this.ue=null}}function ih(t,e=null,n=[],i=[],r=null,s=null,o=null){return new Gw(t,e,n,i,r,s,o)}function _c(t){const e=J(t);if(e.ue===null){let n=e.path.canonicalString();e.collectionGroup!==null&&(n+="|cg:"+e.collectionGroup),n+="|f:",n+=e.filters.map(i=>Sl(i)).join(","),n+="|ob:",n+=e.orderBy.map(i=>function(s){return s.field.canonicalString()+s.dir}(i)).join(","),ca(e.limit)||(n+="|l:",n+=e.limit),e.startAt&&(n+="|lb:",n+=e.startAt.inclusive?"b:":"a:",n+=e.startAt.position.map(i=>Er(i)).join(",")),e.endAt&&(n+="|ub:",n+=e.endAt.inclusive?"a:":"b:",n+=e.endAt.position.map(i=>Er(i)).join(",")),e.ue=n}return e.ue}function Ec(t,e){if(t.limit!==e.limit||t.orderBy.length!==e.orderBy.length)return!1;for(let n=0;n<t.orderBy.length;n++)if(!Vw(t.orderBy[n],e.orderBy[n]))return!1;if(t.filters.length!==e.filters.length)return!1;for(let n=0;n<t.filters.length;n++)if(!ap(t.filters[n],e.filters[n]))return!1;return t.collectionGroup===e.collectionGroup&&!!t.path.isEqual(e.path)&&!!nh(t.startAt,e.startAt)&&nh(t.endAt,e.endAt)}function Al(t){return W.isDocumentKey(t.path)&&t.collectionGroup===null&&t.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class da{constructor(e,n=null,i=[],r=[],s=null,o="F",l=null,c=null){this.path=e,this.collectionGroup=n,this.explicitOrderBy=i,this.filters=r,this.limit=s,this.limitType=o,this.startAt=l,this.endAt=c,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function Kw(t,e,n,i,r,s,o,l){return new da(t,e,n,i,r,s,o,l)}function Tc(t){return new da(t)}function rh(t){return t.filters.length===0&&t.limit===null&&t.startAt==null&&t.endAt==null&&(t.explicitOrderBy.length===0||t.explicitOrderBy.length===1&&t.explicitOrderBy[0].field.isKeyField())}function Qw(t){return t.collectionGroup!==null}function cs(t){const e=J(t);if(e.ce===null){e.ce=[];const n=new Set;for(const s of e.explicitOrderBy)e.ce.push(s),n.add(s.field.canonicalString());const i=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let l=new Je(Qe.comparator);return o.filters.forEach(c=>{c.getFlattenedFilters().forEach(d=>{d.isInequality()&&(l=l.add(d.field))})}),l})(e).forEach(s=>{n.has(s.canonicalString())||s.isKeyField()||e.ce.push(new qo(s,i))}),n.has(Qe.keyField().canonicalString())||e.ce.push(new qo(Qe.keyField(),i))}return e.ce}function un(t){const e=J(t);return e.le||(e.le=Jw(e,cs(t))),e.le}function Jw(t,e){if(t.limitType==="F")return ih(t.path,t.collectionGroup,e,t.filters,t.limit,t.startAt,t.endAt);{e=e.map(r=>{const s=r.dir==="desc"?"asc":"desc";return new qo(r.field,s)});const n=t.endAt?new Uo(t.endAt.position,t.endAt.inclusive):null,i=t.startAt?new Uo(t.startAt.position,t.startAt.inclusive):null;return ih(t.path,t.collectionGroup,e,t.filters,t.limit,n,i)}}function kl(t,e,n){return new da(t.path,t.collectionGroup,t.explicitOrderBy.slice(),t.filters.slice(),e,n,t.startAt,t.endAt)}function ua(t,e){return Ec(un(t),un(e))&&t.limitType===e.limitType}function dp(t){return`${_c(un(t))}|lt:${t.limitType}`}function sr(t){return`Query(target=${function(n){let i=n.path.canonicalString();return n.collectionGroup!==null&&(i+=" collectionGroup="+n.collectionGroup),n.filters.length>0&&(i+=`, filters: [${n.filters.map(r=>lp(r)).join(", ")}]`),ca(n.limit)||(i+=", limit: "+n.limit),n.orderBy.length>0&&(i+=`, orderBy: [${n.orderBy.map(r=>function(o){return`${o.field.canonicalString()} (${o.dir})`}(r)).join(", ")}]`),n.startAt&&(i+=", startAt: ",i+=n.startAt.inclusive?"b:":"a:",i+=n.startAt.position.map(r=>Er(r)).join(",")),n.endAt&&(i+=", endAt: ",i+=n.endAt.inclusive?"a:":"b:",i+=n.endAt.position.map(r=>Er(r)).join(",")),`Target(${i})`}(un(t))}; limitType=${t.limitType})`}function ha(t,e){return e.isFoundDocument()&&function(i,r){const s=r.key.path;return i.collectionGroup!==null?r.key.hasCollectionId(i.collectionGroup)&&i.path.isPrefixOf(s):W.isDocumentKey(i.path)?i.path.isEqual(s):i.path.isImmediateParentOf(s)}(t,e)&&function(i,r){for(const s of cs(i))if(!s.field.isKeyField()&&r.data.field(s.field)===null)return!1;return!0}(t,e)&&function(i,r){for(const s of i.filters)if(!s.matches(r))return!1;return!0}(t,e)&&function(i,r){return!(i.startAt&&!function(o,l,c){const d=th(o,l,c);return o.inclusive?d<=0:d<0}(i.startAt,cs(i),r)||i.endAt&&!function(o,l,c){const d=th(o,l,c);return o.inclusive?d>=0:d>0}(i.endAt,cs(i),r))}(t,e)}function Xw(t){return t.collectionGroup||(t.path.length%2==1?t.path.lastSegment():t.path.get(t.path.length-2))}function up(t){return(e,n)=>{let i=!1;for(const r of cs(t)){const s=Zw(r,e,n);if(s!==0)return s;i=i||r.field.isKeyField()}return 0}}function Zw(t,e,n){const i=t.field.isKeyField()?W.comparator(e.key,n.key):function(s,o,l){const c=o.data.field(s),d=l.data.field(s);return c!==null&&d!==null?_r(c,d):G()}(t.field,e,n);switch(t.dir){case"asc":return i;case"desc":return-1*i;default:return G()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mr{constructor(e,n){this.mapKeyFn=e,this.equalsFn=n,this.inner={},this.innerSize=0}get(e){const n=this.mapKeyFn(e),i=this.inner[n];if(i!==void 0){for(const[r,s]of i)if(this.equalsFn(r,e))return s}}has(e){return this.get(e)!==void 0}set(e,n){const i=this.mapKeyFn(e),r=this.inner[i];if(r===void 0)return this.inner[i]=[[e,n]],void this.innerSize++;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],e))return void(r[s]=[e,n]);r.push([e,n]),this.innerSize++}delete(e){const n=this.mapKeyFn(e),i=this.inner[n];if(i===void 0)return!1;for(let r=0;r<i.length;r++)if(this.equalsFn(i[r][0],e))return i.length===1?delete this.inner[n]:i.splice(r,1),this.innerSize--,!0;return!1}forEach(e){Ki(this.inner,(n,i)=>{for(const[r,s]of i)e(r,s)})}isEmpty(){return tp(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const e_=new Ce(W.comparator);function Un(){return e_}const hp=new Ce(W.comparator);function ns(...t){let e=hp;for(const n of t)e=e.insert(n.key,n);return e}function fp(t){let e=hp;return t.forEach((n,i)=>e=e.insert(n,i.overlayedDocument)),e}function Bi(){return ds()}function pp(){return ds()}function ds(){return new Mr(t=>t.toString(),(t,e)=>t.isEqual(e))}const t_=new Ce(W.comparator),n_=new Je(W.comparator);function re(...t){let e=n_;for(const n of t)e=e.add(n);return e}const i_=new Je(he);function r_(){return i_}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ic(t,e){if(t.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:$o(e)?"-0":e}}function mp(t){return{integerValue:""+t}}function s_(t,e){return Bw(e)?mp(e):Ic(t,e)}/**
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
 */class fa{constructor(){this._=void 0}}function o_(t,e,n){return t instanceof Ho?function(r,s){const o={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:r.seconds,nanos:r.nanoseconds}}}};return s&&vc(s)&&(s=bc(s)),s&&(o.fields.__previous_value__=s),{mapValue:o}}(n,e):t instanceof _s?yp(t,e):t instanceof Es?vp(t,e):function(r,s){const o=gp(r,s),l=sh(o)+sh(r.Pe);return xl(o)&&xl(r.Pe)?mp(l):Ic(r.serializer,l)}(t,e)}function a_(t,e,n){return t instanceof _s?yp(t,e):t instanceof Es?vp(t,e):n}function gp(t,e){return t instanceof Wo?function(i){return xl(i)||function(s){return!!s&&"doubleValue"in s}(i)}(e)?e:{integerValue:0}:null}class Ho extends fa{}class _s extends fa{constructor(e){super(),this.elements=e}}function yp(t,e){const n=bp(e);for(const i of t.elements)n.some(r=>fn(r,i))||n.push(i);return{arrayValue:{values:n}}}class Es extends fa{constructor(e){super(),this.elements=e}}function vp(t,e){let n=bp(e);for(const i of t.elements)n=n.filter(r=>!fn(r,i));return{arrayValue:{values:n}}}class Wo extends fa{constructor(e,n){super(),this.serializer=e,this.Pe=n}}function sh(t){return Le(t.integerValue||t.doubleValue)}function bp(t){return wc(t)&&t.arrayValue.values?t.arrayValue.values.slice():[]}function l_(t,e){return t.field.isEqual(e.field)&&function(i,r){return i instanceof _s&&r instanceof _s||i instanceof Es&&r instanceof Es?wr(i.elements,r.elements,fn):i instanceof Wo&&r instanceof Wo?fn(i.Pe,r.Pe):i instanceof Ho&&r instanceof Ho}(t.transform,e.transform)}class c_{constructor(e,n){this.version=e,this.transformResults=n}}class vt{constructor(e,n){this.updateTime=e,this.exists=n}static none(){return new vt}static exists(e){return new vt(void 0,e)}static updateTime(e){return new vt(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function xo(t,e){return t.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(t.updateTime):t.exists===void 0||t.exists===e.isFoundDocument()}class pa{}function wp(t,e){if(!t.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return t.isNoDocument()?new ma(t.key,vt.none()):new zs(t.key,t.data,vt.none());{const n=t.data,i=Et.empty();let r=new Je(Qe.comparator);for(let s of e.fields)if(!r.has(s)){let o=n.field(s);o===null&&s.length>1&&(s=s.popLast(),o=n.field(s)),o===null?i.delete(s):i.set(s,o),r=r.add(s)}return new wi(t.key,i,new Ct(r.toArray()),vt.none())}}function d_(t,e,n){t instanceof zs?function(r,s,o){const l=r.value.clone(),c=ah(r.fieldTransforms,s,o.transformResults);l.setAll(c),s.convertToFoundDocument(o.version,l).setHasCommittedMutations()}(t,e,n):t instanceof wi?function(r,s,o){if(!xo(r.precondition,s))return void s.convertToUnknownDocument(o.version);const l=ah(r.fieldTransforms,s,o.transformResults),c=s.data;c.setAll(_p(r)),c.setAll(l),s.convertToFoundDocument(o.version,c).setHasCommittedMutations()}(t,e,n):function(r,s,o){s.convertToNoDocument(o.version).setHasCommittedMutations()}(0,e,n)}function us(t,e,n,i){return t instanceof zs?function(s,o,l,c){if(!xo(s.precondition,o))return l;const d=s.value.clone(),f=lh(s.fieldTransforms,c,o);return d.setAll(f),o.convertToFoundDocument(o.version,d).setHasLocalMutations(),null}(t,e,n,i):t instanceof wi?function(s,o,l,c){if(!xo(s.precondition,o))return l;const d=lh(s.fieldTransforms,c,o),f=o.data;return f.setAll(_p(s)),f.setAll(d),o.convertToFoundDocument(o.version,f).setHasLocalMutations(),l===null?null:l.unionWith(s.fieldMask.fields).unionWith(s.fieldTransforms.map(m=>m.field))}(t,e,n,i):function(s,o,l){return xo(s.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):l}(t,e,n)}function u_(t,e){let n=null;for(const i of t.fieldTransforms){const r=e.data.field(i.field),s=gp(i.transform,r||null);s!=null&&(n===null&&(n=Et.empty()),n.set(i.field,s))}return n||null}function oh(t,e){return t.type===e.type&&!!t.key.isEqual(e.key)&&!!t.precondition.isEqual(e.precondition)&&!!function(i,r){return i===void 0&&r===void 0||!(!i||!r)&&wr(i,r,(s,o)=>l_(s,o))}(t.fieldTransforms,e.fieldTransforms)&&(t.type===0?t.value.isEqual(e.value):t.type!==1||t.data.isEqual(e.data)&&t.fieldMask.isEqual(e.fieldMask))}class zs extends pa{constructor(e,n,i,r=[]){super(),this.key=e,this.value=n,this.precondition=i,this.fieldTransforms=r,this.type=0}getFieldMask(){return null}}class wi extends pa{constructor(e,n,i,r,s=[]){super(),this.key=e,this.data=n,this.fieldMask=i,this.precondition=r,this.fieldTransforms=s,this.type=1}getFieldMask(){return this.fieldMask}}function _p(t){const e=new Map;return t.fieldMask.fields.forEach(n=>{if(!n.isEmpty()){const i=t.data.field(n);e.set(n,i)}}),e}function ah(t,e,n){const i=new Map;me(t.length===n.length);for(let r=0;r<n.length;r++){const s=t[r],o=s.transform,l=e.data.field(s.field);i.set(s.field,a_(o,l,n[r]))}return i}function lh(t,e,n){const i=new Map;for(const r of t){const s=r.transform,o=n.data.field(r.field);i.set(r.field,o_(s,o,e))}return i}class ma extends pa{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class h_ extends pa{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class f_{constructor(e,n,i,r){this.batchId=e,this.localWriteTime=n,this.baseMutations=i,this.mutations=r}applyToRemoteDocument(e,n){const i=n.mutationResults;for(let r=0;r<this.mutations.length;r++){const s=this.mutations[r];s.key.isEqual(e.key)&&d_(s,e,i[r])}}applyToLocalView(e,n){for(const i of this.baseMutations)i.key.isEqual(e.key)&&(n=us(i,e,n,this.localWriteTime));for(const i of this.mutations)i.key.isEqual(e.key)&&(n=us(i,e,n,this.localWriteTime));return n}applyToLocalDocumentSet(e,n){const i=pp();return this.mutations.forEach(r=>{const s=e.get(r.key),o=s.overlayedDocument;let l=this.applyToLocalView(o,s.mutatedFields);l=n.has(r.key)?null:l;const c=wp(o,l);c!==null&&i.set(r.key,c),o.isValidDocument()||o.convertToNoDocument(Q.min())}),i}keys(){return this.mutations.reduce((e,n)=>e.add(n.key),re())}isEqual(e){return this.batchId===e.batchId&&wr(this.mutations,e.mutations,(n,i)=>oh(n,i))&&wr(this.baseMutations,e.baseMutations,(n,i)=>oh(n,i))}}class xc{constructor(e,n,i,r){this.batch=e,this.commitVersion=n,this.mutationResults=i,this.docVersions=r}static from(e,n,i){me(e.mutations.length===i.length);let r=function(){return t_}();const s=e.mutations;for(let o=0;o<s.length;o++)r=r.insert(s[o].key,i[o].version);return new xc(e,n,i,r)}}/**
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
 */class p_{constructor(e,n){this.largestBatchId=e,this.mutation=n}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
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
 */class m_{constructor(e,n){this.count=e,this.unchangedNames=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Fe,ae;function g_(t){switch(t){default:return G();case M.CANCELLED:case M.UNKNOWN:case M.DEADLINE_EXCEEDED:case M.RESOURCE_EXHAUSTED:case M.INTERNAL:case M.UNAVAILABLE:case M.UNAUTHENTICATED:return!1;case M.INVALID_ARGUMENT:case M.NOT_FOUND:case M.ALREADY_EXISTS:case M.PERMISSION_DENIED:case M.FAILED_PRECONDITION:case M.ABORTED:case M.OUT_OF_RANGE:case M.UNIMPLEMENTED:case M.DATA_LOSS:return!0}}function Ep(t){if(t===void 0)return $n("GRPC error has no .code"),M.UNKNOWN;switch(t){case Fe.OK:return M.OK;case Fe.CANCELLED:return M.CANCELLED;case Fe.UNKNOWN:return M.UNKNOWN;case Fe.DEADLINE_EXCEEDED:return M.DEADLINE_EXCEEDED;case Fe.RESOURCE_EXHAUSTED:return M.RESOURCE_EXHAUSTED;case Fe.INTERNAL:return M.INTERNAL;case Fe.UNAVAILABLE:return M.UNAVAILABLE;case Fe.UNAUTHENTICATED:return M.UNAUTHENTICATED;case Fe.INVALID_ARGUMENT:return M.INVALID_ARGUMENT;case Fe.NOT_FOUND:return M.NOT_FOUND;case Fe.ALREADY_EXISTS:return M.ALREADY_EXISTS;case Fe.PERMISSION_DENIED:return M.PERMISSION_DENIED;case Fe.FAILED_PRECONDITION:return M.FAILED_PRECONDITION;case Fe.ABORTED:return M.ABORTED;case Fe.OUT_OF_RANGE:return M.OUT_OF_RANGE;case Fe.UNIMPLEMENTED:return M.UNIMPLEMENTED;case Fe.DATA_LOSS:return M.DATA_LOSS;default:return G()}}(ae=Fe||(Fe={}))[ae.OK=0]="OK",ae[ae.CANCELLED=1]="CANCELLED",ae[ae.UNKNOWN=2]="UNKNOWN",ae[ae.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",ae[ae.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",ae[ae.NOT_FOUND=5]="NOT_FOUND",ae[ae.ALREADY_EXISTS=6]="ALREADY_EXISTS",ae[ae.PERMISSION_DENIED=7]="PERMISSION_DENIED",ae[ae.UNAUTHENTICATED=16]="UNAUTHENTICATED",ae[ae.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",ae[ae.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",ae[ae.ABORTED=10]="ABORTED",ae[ae.OUT_OF_RANGE=11]="OUT_OF_RANGE",ae[ae.UNIMPLEMENTED=12]="UNIMPLEMENTED",ae[ae.INTERNAL=13]="INTERNAL",ae[ae.UNAVAILABLE=14]="UNAVAILABLE",ae[ae.DATA_LOSS=15]="DATA_LOSS";/**
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
 */function y_(){return new TextEncoder}/**
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
 */const v_=new Fi([4294967295,4294967295],0);function ch(t){const e=y_().encode(t),n=new jf;return n.update(e),new Uint8Array(n.digest())}function dh(t){const e=new DataView(t.buffer),n=e.getUint32(0,!0),i=e.getUint32(4,!0),r=e.getUint32(8,!0),s=e.getUint32(12,!0);return[new Fi([n,i],0),new Fi([r,s],0)]}class Sc{constructor(e,n,i){if(this.bitmap=e,this.padding=n,this.hashCount=i,n<0||n>=8)throw new is(`Invalid padding: ${n}`);if(i<0)throw new is(`Invalid hash count: ${i}`);if(e.length>0&&this.hashCount===0)throw new is(`Invalid hash count: ${i}`);if(e.length===0&&n!==0)throw new is(`Invalid padding when bitmap length is 0: ${n}`);this.Ie=8*e.length-n,this.Te=Fi.fromNumber(this.Ie)}Ee(e,n,i){let r=e.add(n.multiply(Fi.fromNumber(i)));return r.compare(v_)===1&&(r=new Fi([r.getBits(0),r.getBits(1)],0)),r.modulo(this.Te).toNumber()}de(e){return(this.bitmap[Math.floor(e/8)]&1<<e%8)!=0}mightContain(e){if(this.Ie===0)return!1;const n=ch(e),[i,r]=dh(n);for(let s=0;s<this.hashCount;s++){const o=this.Ee(i,r,s);if(!this.de(o))return!1}return!0}static create(e,n,i){const r=e%8==0?0:8-e%8,s=new Uint8Array(Math.ceil(e/8)),o=new Sc(s,r,n);return i.forEach(l=>o.insert(l)),o}insert(e){if(this.Ie===0)return;const n=ch(e),[i,r]=dh(n);for(let s=0;s<this.hashCount;s++){const o=this.Ee(i,r,s);this.Ae(o)}}Ae(e){const n=Math.floor(e/8),i=e%8;this.bitmap[n]|=1<<i}}class is extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ga{constructor(e,n,i,r,s){this.snapshotVersion=e,this.targetChanges=n,this.targetMismatches=i,this.documentUpdates=r,this.resolvedLimboDocuments=s}static createSynthesizedRemoteEventForCurrentChange(e,n,i){const r=new Map;return r.set(e,$s.createSynthesizedTargetChangeForCurrentChange(e,n,i)),new ga(Q.min(),r,new Ce(he),Un(),re())}}class $s{constructor(e,n,i,r,s){this.resumeToken=e,this.current=n,this.addedDocuments=i,this.modifiedDocuments=r,this.removedDocuments=s}static createSynthesizedTargetChangeForCurrentChange(e,n,i){return new $s(i,n,re(),re(),re())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class So{constructor(e,n,i,r){this.Re=e,this.removedTargetIds=n,this.key=i,this.Ve=r}}class Tp{constructor(e,n){this.targetId=e,this.me=n}}class Ip{constructor(e,n,i=Ze.EMPTY_BYTE_STRING,r=null){this.state=e,this.targetIds=n,this.resumeToken=i,this.cause=r}}class uh{constructor(){this.fe=0,this.ge=fh(),this.pe=Ze.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return this.fe!==0}get be(){return this.we}De(e){e.approximateByteSize()>0&&(this.we=!0,this.pe=e)}ve(){let e=re(),n=re(),i=re();return this.ge.forEach((r,s)=>{switch(s){case 0:e=e.add(r);break;case 2:n=n.add(r);break;case 1:i=i.add(r);break;default:G()}}),new $s(this.pe,this.ye,e,n,i)}Ce(){this.we=!1,this.ge=fh()}Fe(e,n){this.we=!0,this.ge=this.ge.insert(e,n)}Me(e){this.we=!0,this.ge=this.ge.remove(e)}xe(){this.fe+=1}Oe(){this.fe-=1,me(this.fe>=0)}Ne(){this.we=!0,this.ye=!0}}class b_{constructor(e){this.Le=e,this.Be=new Map,this.ke=Un(),this.qe=hh(),this.Qe=new Ce(he)}Ke(e){for(const n of e.Re)e.Ve&&e.Ve.isFoundDocument()?this.$e(n,e.Ve):this.Ue(n,e.key,e.Ve);for(const n of e.removedTargetIds)this.Ue(n,e.key,e.Ve)}We(e){this.forEachTarget(e,n=>{const i=this.Ge(n);switch(e.state){case 0:this.ze(n)&&i.De(e.resumeToken);break;case 1:i.Oe(),i.Se||i.Ce(),i.De(e.resumeToken);break;case 2:i.Oe(),i.Se||this.removeTarget(n);break;case 3:this.ze(n)&&(i.Ne(),i.De(e.resumeToken));break;case 4:this.ze(n)&&(this.je(n),i.De(e.resumeToken));break;default:G()}})}forEachTarget(e,n){e.targetIds.length>0?e.targetIds.forEach(n):this.Be.forEach((i,r)=>{this.ze(r)&&n(r)})}He(e){const n=e.targetId,i=e.me.count,r=this.Je(n);if(r){const s=r.target;if(Al(s))if(i===0){const o=new W(s.path);this.Ue(n,o,ot.newNoDocument(o,Q.min()))}else me(i===1);else{const o=this.Ye(n);if(o!==i){const l=this.Ze(e),c=l?this.Xe(l,e,o):1;if(c!==0){this.je(n);const d=c===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Qe=this.Qe.insert(n,d)}}}}}Ze(e){const n=e.me.unchangedNames;if(!n||!n.bits)return null;const{bits:{bitmap:i="",padding:r=0},hashCount:s=0}=n;let o,l;try{o=Wi(i).toUint8Array()}catch(c){if(c instanceof np)return br("Decoding the base64 bloom filter in existence filter failed ("+c.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw c}try{l=new Sc(o,r,s)}catch(c){return br(c instanceof is?"BloomFilter error: ":"Applying bloom filter failed: ",c),null}return l.Ie===0?null:l}Xe(e,n,i){return n.me.count===i-this.nt(e,n.targetId)?0:2}nt(e,n){const i=this.Le.getRemoteKeysForTarget(n);let r=0;return i.forEach(s=>{const o=this.Le.tt(),l=`projects/${o.projectId}/databases/${o.database}/documents/${s.path.canonicalString()}`;e.mightContain(l)||(this.Ue(n,s,null),r++)}),r}rt(e){const n=new Map;this.Be.forEach((s,o)=>{const l=this.Je(o);if(l){if(s.current&&Al(l.target)){const c=new W(l.target.path);this.ke.get(c)!==null||this.it(o,c)||this.Ue(o,c,ot.newNoDocument(c,e))}s.be&&(n.set(o,s.ve()),s.Ce())}});let i=re();this.qe.forEach((s,o)=>{let l=!0;o.forEachWhile(c=>{const d=this.Je(c);return!d||d.purpose==="TargetPurposeLimboResolution"||(l=!1,!1)}),l&&(i=i.add(s))}),this.ke.forEach((s,o)=>o.setReadTime(e));const r=new ga(e,n,this.Qe,this.ke,i);return this.ke=Un(),this.qe=hh(),this.Qe=new Ce(he),r}$e(e,n){if(!this.ze(e))return;const i=this.it(e,n.key)?2:0;this.Ge(e).Fe(n.key,i),this.ke=this.ke.insert(n.key,n),this.qe=this.qe.insert(n.key,this.st(n.key).add(e))}Ue(e,n,i){if(!this.ze(e))return;const r=this.Ge(e);this.it(e,n)?r.Fe(n,1):r.Me(n),this.qe=this.qe.insert(n,this.st(n).delete(e)),i&&(this.ke=this.ke.insert(n,i))}removeTarget(e){this.Be.delete(e)}Ye(e){const n=this.Ge(e).ve();return this.Le.getRemoteKeysForTarget(e).size+n.addedDocuments.size-n.removedDocuments.size}xe(e){this.Ge(e).xe()}Ge(e){let n=this.Be.get(e);return n||(n=new uh,this.Be.set(e,n)),n}st(e){let n=this.qe.get(e);return n||(n=new Je(he),this.qe=this.qe.insert(e,n)),n}ze(e){const n=this.Je(e)!==null;return n||$("WatchChangeAggregator","Detected inactive target",e),n}Je(e){const n=this.Be.get(e);return n&&n.Se?null:this.Le.ot(e)}je(e){this.Be.set(e,new uh),this.Le.getRemoteKeysForTarget(e).forEach(n=>{this.Ue(e,n,null)})}it(e,n){return this.Le.getRemoteKeysForTarget(e).has(n)}}function hh(){return new Ce(W.comparator)}function fh(){return new Ce(W.comparator)}const w_={asc:"ASCENDING",desc:"DESCENDING"},__={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},E_={and:"AND",or:"OR"};class T_{constructor(e,n){this.databaseId=e,this.useProto3Json=n}}function Rl(t,e){return t.useProto3Json||ca(e)?e:{value:e}}function Yo(t,e){return t.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function xp(t,e){return t.useProto3Json?e.toBase64():e.toUint8Array()}function I_(t,e){return Yo(t,e.toTimestamp())}function hn(t){return me(!!t),Q.fromTimestamp(function(n){const i=yi(n);return new qe(i.seconds,i.nanos)}(t))}function Ac(t,e){return Pl(t,e).canonicalString()}function Pl(t,e){const n=function(r){return new ke(["projects",r.projectId,"databases",r.database])}(t).child("documents");return e===void 0?n:n.child(e)}function Sp(t){const e=ke.fromString(t);return me(Cp(e)),e}function Cl(t,e){return Ac(t.databaseId,e.path)}function sl(t,e){const n=Sp(e);if(n.get(1)!==t.databaseId.projectId)throw new U(M.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+n.get(1)+" vs "+t.databaseId.projectId);if(n.get(3)!==t.databaseId.database)throw new U(M.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+n.get(3)+" vs "+t.databaseId.database);return new W(kp(n))}function Ap(t,e){return Ac(t.databaseId,e)}function x_(t){const e=Sp(t);return e.length===4?ke.emptyPath():kp(e)}function Ml(t){return new ke(["projects",t.databaseId.projectId,"databases",t.databaseId.database]).canonicalString()}function kp(t){return me(t.length>4&&t.get(4)==="documents"),t.popFirst(5)}function ph(t,e,n){return{name:Cl(t,e),fields:n.value.mapValue.fields}}function S_(t,e){let n;if("targetChange"in e){e.targetChange;const i=function(d){return d==="NO_CHANGE"?0:d==="ADD"?1:d==="REMOVE"?2:d==="CURRENT"?3:d==="RESET"?4:G()}(e.targetChange.targetChangeType||"NO_CHANGE"),r=e.targetChange.targetIds||[],s=function(d,f){return d.useProto3Json?(me(f===void 0||typeof f=="string"),Ze.fromBase64String(f||"")):(me(f===void 0||f instanceof Buffer||f instanceof Uint8Array),Ze.fromUint8Array(f||new Uint8Array))}(t,e.targetChange.resumeToken),o=e.targetChange.cause,l=o&&function(d){const f=d.code===void 0?M.UNKNOWN:Ep(d.code);return new U(f,d.message||"")}(o);n=new Ip(i,r,s,l||null)}else if("documentChange"in e){e.documentChange;const i=e.documentChange;i.document,i.document.name,i.document.updateTime;const r=sl(t,i.document.name),s=hn(i.document.updateTime),o=i.document.createTime?hn(i.document.createTime):Q.min(),l=new Et({mapValue:{fields:i.document.fields}}),c=ot.newFoundDocument(r,s,o,l),d=i.targetIds||[],f=i.removedTargetIds||[];n=new So(d,f,c.key,c)}else if("documentDelete"in e){e.documentDelete;const i=e.documentDelete;i.document;const r=sl(t,i.document),s=i.readTime?hn(i.readTime):Q.min(),o=ot.newNoDocument(r,s),l=i.removedTargetIds||[];n=new So([],l,o.key,o)}else if("documentRemove"in e){e.documentRemove;const i=e.documentRemove;i.document;const r=sl(t,i.document),s=i.removedTargetIds||[];n=new So([],s,r,null)}else{if(!("filter"in e))return G();{e.filter;const i=e.filter;i.targetId;const{count:r=0,unchangedNames:s}=i,o=new m_(r,s),l=i.targetId;n=new Tp(l,o)}}return n}function A_(t,e){let n;if(e instanceof zs)n={update:ph(t,e.key,e.value)};else if(e instanceof ma)n={delete:Cl(t,e.key)};else if(e instanceof wi)n={update:ph(t,e.key,e.data),updateMask:N_(e.fieldMask)};else{if(!(e instanceof h_))return G();n={verify:Cl(t,e.key)}}return e.fieldTransforms.length>0&&(n.updateTransforms=e.fieldTransforms.map(i=>function(s,o){const l=o.transform;if(l instanceof Ho)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(l instanceof _s)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:l.elements}};if(l instanceof Es)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:l.elements}};if(l instanceof Wo)return{fieldPath:o.field.canonicalString(),increment:l.Pe};throw G()}(0,i))),e.precondition.isNone||(n.currentDocument=function(r,s){return s.updateTime!==void 0?{updateTime:I_(r,s.updateTime)}:s.exists!==void 0?{exists:s.exists}:G()}(t,e.precondition)),n}function k_(t,e){return t&&t.length>0?(me(e!==void 0),t.map(n=>function(r,s){let o=r.updateTime?hn(r.updateTime):hn(s);return o.isEqual(Q.min())&&(o=hn(s)),new c_(o,r.transformResults||[])}(n,e))):[]}function R_(t,e){return{documents:[Ap(t,e.path)]}}function P_(t,e){const n={structuredQuery:{}},i=e.path;let r;e.collectionGroup!==null?(r=i,n.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(r=i.popLast(),n.structuredQuery.from=[{collectionId:i.lastSegment()}]),n.parent=Ap(t,r);const s=function(d){if(d.length!==0)return Pp(pn.create(d,"and"))}(e.filters);s&&(n.structuredQuery.where=s);const o=function(d){if(d.length!==0)return d.map(f=>function(p){return{field:or(p.field),direction:D_(p.dir)}}(f))}(e.orderBy);o&&(n.structuredQuery.orderBy=o);const l=Rl(t,e.limit);return l!==null&&(n.structuredQuery.limit=l),e.startAt&&(n.structuredQuery.startAt=function(d){return{before:d.inclusive,values:d.position}}(e.startAt)),e.endAt&&(n.structuredQuery.endAt=function(d){return{before:!d.inclusive,values:d.position}}(e.endAt)),{_t:n,parent:r}}function C_(t){let e=x_(t.parent);const n=t.structuredQuery,i=n.from?n.from.length:0;let r=null;if(i>0){me(i===1);const f=n.from[0];f.allDescendants?r=f.collectionId:e=e.child(f.collectionId)}let s=[];n.where&&(s=function(m){const p=Rp(m);return p instanceof pn&&op(p)?p.getFilters():[p]}(n.where));let o=[];n.orderBy&&(o=function(m){return m.map(p=>function(I){return new qo(ar(I.field),function(A){switch(A){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(I.direction))}(p))}(n.orderBy));let l=null;n.limit&&(l=function(m){let p;return p=typeof m=="object"?m.value:m,ca(p)?null:p}(n.limit));let c=null;n.startAt&&(c=function(m){const p=!!m.before,y=m.values||[];return new Uo(y,p)}(n.startAt));let d=null;return n.endAt&&(d=function(m){const p=!m.before,y=m.values||[];return new Uo(y,p)}(n.endAt)),Kw(e,r,o,s,l,"F",c,d)}function M_(t,e){const n=function(r){switch(r){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return G()}}(e.purpose);return n==null?null:{"goog-listen-tags":n}}function Rp(t){return t.unaryFilter!==void 0?function(n){switch(n.unaryFilter.op){case"IS_NAN":const i=ar(n.unaryFilter.field);return Ue.create(i,"==",{doubleValue:NaN});case"IS_NULL":const r=ar(n.unaryFilter.field);return Ue.create(r,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const s=ar(n.unaryFilter.field);return Ue.create(s,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=ar(n.unaryFilter.field);return Ue.create(o,"!=",{nullValue:"NULL_VALUE"});default:return G()}}(t):t.fieldFilter!==void 0?function(n){return Ue.create(ar(n.fieldFilter.field),function(r){switch(r){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return G()}}(n.fieldFilter.op),n.fieldFilter.value)}(t):t.compositeFilter!==void 0?function(n){return pn.create(n.compositeFilter.filters.map(i=>Rp(i)),function(r){switch(r){case"AND":return"and";case"OR":return"or";default:return G()}}(n.compositeFilter.op))}(t):G()}function D_(t){return w_[t]}function B_(t){return __[t]}function L_(t){return E_[t]}function or(t){return{fieldPath:t.canonicalString()}}function ar(t){return Qe.fromServerFormat(t.fieldPath)}function Pp(t){return t instanceof Ue?function(n){if(n.op==="=="){if(eh(n.value))return{unaryFilter:{field:or(n.field),op:"IS_NAN"}};if(Zu(n.value))return{unaryFilter:{field:or(n.field),op:"IS_NULL"}}}else if(n.op==="!="){if(eh(n.value))return{unaryFilter:{field:or(n.field),op:"IS_NOT_NAN"}};if(Zu(n.value))return{unaryFilter:{field:or(n.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:or(n.field),op:B_(n.op),value:n.value}}}(t):t instanceof pn?function(n){const i=n.getFilters().map(r=>Pp(r));return i.length===1?i[0]:{compositeFilter:{op:L_(n.op),filters:i}}}(t):G()}function N_(t){const e=[];return t.fields.forEach(n=>e.push(n.canonicalString())),{fieldPaths:e}}function Cp(t){return t.length>=4&&t.get(0)==="projects"&&t.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ci{constructor(e,n,i,r,s=Q.min(),o=Q.min(),l=Ze.EMPTY_BYTE_STRING,c=null){this.target=e,this.targetId=n,this.purpose=i,this.sequenceNumber=r,this.snapshotVersion=s,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=l,this.expectedCount=c}withSequenceNumber(e){return new ci(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,n){return new ci(this.target,this.targetId,this.purpose,this.sequenceNumber,n,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new ci(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new ci(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class O_{constructor(e){this.ct=e}}function F_(t){const e=C_({parent:t.parent,structuredQuery:t.structuredQuery});return t.limitType==="LAST"?kl(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class V_{constructor(){this.un=new z_}addToCollectionParentIndex(e,n){return this.un.add(n),B.resolve()}getCollectionParents(e,n){return B.resolve(this.un.getEntries(n))}addFieldIndex(e,n){return B.resolve()}deleteFieldIndex(e,n){return B.resolve()}deleteAllFieldIndexes(e){return B.resolve()}createTargetIndexes(e,n){return B.resolve()}getDocumentsMatchingTarget(e,n){return B.resolve(null)}getIndexType(e,n){return B.resolve(0)}getFieldIndexes(e,n){return B.resolve([])}getNextCollectionGroupToUpdate(e){return B.resolve(null)}getMinOffset(e,n){return B.resolve(gi.min())}getMinOffsetFromCollectionGroup(e,n){return B.resolve(gi.min())}updateCollectionGroup(e,n,i){return B.resolve()}updateIndexEntries(e,n){return B.resolve()}}class z_{constructor(){this.index={}}add(e){const n=e.lastSegment(),i=e.popLast(),r=this.index[n]||new Je(ke.comparator),s=!r.has(i);return this.index[n]=r.add(i),s}has(e){const n=e.lastSegment(),i=e.popLast(),r=this.index[n];return r&&r.has(i)}getEntries(e){return(this.index[e]||new Je(ke.comparator)).toArray()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tr{constructor(e){this.Ln=e}next(){return this.Ln+=2,this.Ln}static Bn(){return new Tr(0)}static kn(){return new Tr(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $_{constructor(){this.changes=new Mr(e=>e.toString(),(e,n)=>e.isEqual(n)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,n){this.assertNotApplied(),this.changes.set(e,ot.newInvalidDocument(e).setReadTime(n))}getEntry(e,n){this.assertNotApplied();const i=this.changes.get(n);return i!==void 0?B.resolve(i):this.getFromCache(e,n)}getEntries(e,n){return this.getAllFromCache(e,n)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class U_{constructor(e,n){this.overlayedDocument=e,this.mutatedFields=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class q_{constructor(e,n,i,r){this.remoteDocumentCache=e,this.mutationQueue=n,this.documentOverlayCache=i,this.indexManager=r}getDocument(e,n){let i=null;return this.documentOverlayCache.getOverlay(e,n).next(r=>(i=r,this.remoteDocumentCache.getEntry(e,n))).next(r=>(i!==null&&us(i.mutation,r,Ct.empty(),qe.now()),r))}getDocuments(e,n){return this.remoteDocumentCache.getEntries(e,n).next(i=>this.getLocalViewOfDocuments(e,i,re()).next(()=>i))}getLocalViewOfDocuments(e,n,i=re()){const r=Bi();return this.populateOverlays(e,r,n).next(()=>this.computeViews(e,n,r,i).next(s=>{let o=ns();return s.forEach((l,c)=>{o=o.insert(l,c.overlayedDocument)}),o}))}getOverlayedDocuments(e,n){const i=Bi();return this.populateOverlays(e,i,n).next(()=>this.computeViews(e,n,i,re()))}populateOverlays(e,n,i){const r=[];return i.forEach(s=>{n.has(s)||r.push(s)}),this.documentOverlayCache.getOverlays(e,r).next(s=>{s.forEach((o,l)=>{n.set(o,l)})})}computeViews(e,n,i,r){let s=Un();const o=ds(),l=function(){return ds()}();return n.forEach((c,d)=>{const f=i.get(d.key);r.has(d.key)&&(f===void 0||f.mutation instanceof wi)?s=s.insert(d.key,d):f!==void 0?(o.set(d.key,f.mutation.getFieldMask()),us(f.mutation,d,f.mutation.getFieldMask(),qe.now())):o.set(d.key,Ct.empty())}),this.recalculateAndSaveOverlays(e,s).next(c=>(c.forEach((d,f)=>o.set(d,f)),n.forEach((d,f)=>{var m;return l.set(d,new U_(f,(m=o.get(d))!==null&&m!==void 0?m:null))}),l))}recalculateAndSaveOverlays(e,n){const i=ds();let r=new Ce((o,l)=>o-l),s=re();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,n).next(o=>{for(const l of o)l.keys().forEach(c=>{const d=n.get(c);if(d===null)return;let f=i.get(c)||Ct.empty();f=l.applyToLocalView(d,f),i.set(c,f);const m=(r.get(l.batchId)||re()).add(c);r=r.insert(l.batchId,m)})}).next(()=>{const o=[],l=r.getReverseIterator();for(;l.hasNext();){const c=l.getNext(),d=c.key,f=c.value,m=pp();f.forEach(p=>{if(!s.has(p)){const y=wp(n.get(p),i.get(p));y!==null&&m.set(p,y),s=s.add(p)}}),o.push(this.documentOverlayCache.saveOverlays(e,d,m))}return B.waitFor(o)}).next(()=>i)}recalculateAndSaveOverlaysForDocumentKeys(e,n){return this.remoteDocumentCache.getEntries(e,n).next(i=>this.recalculateAndSaveOverlays(e,i))}getDocumentsMatchingQuery(e,n,i,r){return function(o){return W.isDocumentKey(o.path)&&o.collectionGroup===null&&o.filters.length===0}(n)?this.getDocumentsMatchingDocumentQuery(e,n.path):Qw(n)?this.getDocumentsMatchingCollectionGroupQuery(e,n,i,r):this.getDocumentsMatchingCollectionQuery(e,n,i,r)}getNextDocuments(e,n,i,r){return this.remoteDocumentCache.getAllFromCollectionGroup(e,n,i,r).next(s=>{const o=r-s.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,n,i.largestBatchId,r-s.size):B.resolve(Bi());let l=-1,c=s;return o.next(d=>B.forEach(d,(f,m)=>(l<m.largestBatchId&&(l=m.largestBatchId),s.get(f)?B.resolve():this.remoteDocumentCache.getEntry(e,f).next(p=>{c=c.insert(f,p)}))).next(()=>this.populateOverlays(e,d,s)).next(()=>this.computeViews(e,c,d,re())).next(f=>({batchId:l,changes:fp(f)})))})}getDocumentsMatchingDocumentQuery(e,n){return this.getDocument(e,new W(n)).next(i=>{let r=ns();return i.isFoundDocument()&&(r=r.insert(i.key,i)),r})}getDocumentsMatchingCollectionGroupQuery(e,n,i,r){const s=n.collectionGroup;let o=ns();return this.indexManager.getCollectionParents(e,s).next(l=>B.forEach(l,c=>{const d=function(m,p){return new da(p,null,m.explicitOrderBy.slice(),m.filters.slice(),m.limit,m.limitType,m.startAt,m.endAt)}(n,c.child(s));return this.getDocumentsMatchingCollectionQuery(e,d,i,r).next(f=>{f.forEach((m,p)=>{o=o.insert(m,p)})})}).next(()=>o))}getDocumentsMatchingCollectionQuery(e,n,i,r){let s;return this.documentOverlayCache.getOverlaysForCollection(e,n.path,i.largestBatchId).next(o=>(s=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,n,i,s,r))).next(o=>{s.forEach((c,d)=>{const f=d.getKey();o.get(f)===null&&(o=o.insert(f,ot.newInvalidDocument(f)))});let l=ns();return o.forEach((c,d)=>{const f=s.get(c);f!==void 0&&us(f.mutation,d,Ct.empty(),qe.now()),ha(n,d)&&(l=l.insert(c,d))}),l})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class H_{constructor(e){this.serializer=e,this.hr=new Map,this.Pr=new Map}getBundleMetadata(e,n){return B.resolve(this.hr.get(n))}saveBundleMetadata(e,n){return this.hr.set(n.id,function(r){return{id:r.id,version:r.version,createTime:hn(r.createTime)}}(n)),B.resolve()}getNamedQuery(e,n){return B.resolve(this.Pr.get(n))}saveNamedQuery(e,n){return this.Pr.set(n.name,function(r){return{name:r.name,query:F_(r.bundledQuery),readTime:hn(r.readTime)}}(n)),B.resolve()}}/**
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
 */class W_{constructor(){this.overlays=new Ce(W.comparator),this.Ir=new Map}getOverlay(e,n){return B.resolve(this.overlays.get(n))}getOverlays(e,n){const i=Bi();return B.forEach(n,r=>this.getOverlay(e,r).next(s=>{s!==null&&i.set(r,s)})).next(()=>i)}saveOverlays(e,n,i){return i.forEach((r,s)=>{this.ht(e,n,s)}),B.resolve()}removeOverlaysForBatchId(e,n,i){const r=this.Ir.get(i);return r!==void 0&&(r.forEach(s=>this.overlays=this.overlays.remove(s)),this.Ir.delete(i)),B.resolve()}getOverlaysForCollection(e,n,i){const r=Bi(),s=n.length+1,o=new W(n.child("")),l=this.overlays.getIteratorFrom(o);for(;l.hasNext();){const c=l.getNext().value,d=c.getKey();if(!n.isPrefixOf(d.path))break;d.path.length===s&&c.largestBatchId>i&&r.set(c.getKey(),c)}return B.resolve(r)}getOverlaysForCollectionGroup(e,n,i,r){let s=new Ce((d,f)=>d-f);const o=this.overlays.getIterator();for(;o.hasNext();){const d=o.getNext().value;if(d.getKey().getCollectionGroup()===n&&d.largestBatchId>i){let f=s.get(d.largestBatchId);f===null&&(f=Bi(),s=s.insert(d.largestBatchId,f)),f.set(d.getKey(),d)}}const l=Bi(),c=s.getIterator();for(;c.hasNext()&&(c.getNext().value.forEach((d,f)=>l.set(d,f)),!(l.size()>=r)););return B.resolve(l)}ht(e,n,i){const r=this.overlays.get(i.key);if(r!==null){const o=this.Ir.get(r.largestBatchId).delete(i.key);this.Ir.set(r.largestBatchId,o)}this.overlays=this.overlays.insert(i.key,new p_(n,i));let s=this.Ir.get(n);s===void 0&&(s=re(),this.Ir.set(n,s)),this.Ir.set(n,s.add(i.key))}}/**
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
 */class Y_{constructor(){this.sessionToken=Ze.EMPTY_BYTE_STRING}getSessionToken(e){return B.resolve(this.sessionToken)}setSessionToken(e,n){return this.sessionToken=n,B.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kc{constructor(){this.Tr=new Je(We.Er),this.dr=new Je(We.Ar)}isEmpty(){return this.Tr.isEmpty()}addReference(e,n){const i=new We(e,n);this.Tr=this.Tr.add(i),this.dr=this.dr.add(i)}Rr(e,n){e.forEach(i=>this.addReference(i,n))}removeReference(e,n){this.Vr(new We(e,n))}mr(e,n){e.forEach(i=>this.removeReference(i,n))}gr(e){const n=new W(new ke([])),i=new We(n,e),r=new We(n,e+1),s=[];return this.dr.forEachInRange([i,r],o=>{this.Vr(o),s.push(o.key)}),s}pr(){this.Tr.forEach(e=>this.Vr(e))}Vr(e){this.Tr=this.Tr.delete(e),this.dr=this.dr.delete(e)}yr(e){const n=new W(new ke([])),i=new We(n,e),r=new We(n,e+1);let s=re();return this.dr.forEachInRange([i,r],o=>{s=s.add(o.key)}),s}containsKey(e){const n=new We(e,0),i=this.Tr.firstAfterOrEqual(n);return i!==null&&e.isEqual(i.key)}}class We{constructor(e,n){this.key=e,this.wr=n}static Er(e,n){return W.comparator(e.key,n.key)||he(e.wr,n.wr)}static Ar(e,n){return he(e.wr,n.wr)||W.comparator(e.key,n.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class j_{constructor(e,n){this.indexManager=e,this.referenceDelegate=n,this.mutationQueue=[],this.Sr=1,this.br=new Je(We.Er)}checkEmpty(e){return B.resolve(this.mutationQueue.length===0)}addMutationBatch(e,n,i,r){const s=this.Sr;this.Sr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new f_(s,n,i,r);this.mutationQueue.push(o);for(const l of r)this.br=this.br.add(new We(l.key,s)),this.indexManager.addToCollectionParentIndex(e,l.key.path.popLast());return B.resolve(o)}lookupMutationBatch(e,n){return B.resolve(this.Dr(n))}getNextMutationBatchAfterBatchId(e,n){const i=n+1,r=this.vr(i),s=r<0?0:r;return B.resolve(this.mutationQueue.length>s?this.mutationQueue[s]:null)}getHighestUnacknowledgedBatchId(){return B.resolve(this.mutationQueue.length===0?-1:this.Sr-1)}getAllMutationBatches(e){return B.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,n){const i=new We(n,0),r=new We(n,Number.POSITIVE_INFINITY),s=[];return this.br.forEachInRange([i,r],o=>{const l=this.Dr(o.wr);s.push(l)}),B.resolve(s)}getAllMutationBatchesAffectingDocumentKeys(e,n){let i=new Je(he);return n.forEach(r=>{const s=new We(r,0),o=new We(r,Number.POSITIVE_INFINITY);this.br.forEachInRange([s,o],l=>{i=i.add(l.wr)})}),B.resolve(this.Cr(i))}getAllMutationBatchesAffectingQuery(e,n){const i=n.path,r=i.length+1;let s=i;W.isDocumentKey(s)||(s=s.child(""));const o=new We(new W(s),0);let l=new Je(he);return this.br.forEachWhile(c=>{const d=c.key.path;return!!i.isPrefixOf(d)&&(d.length===r&&(l=l.add(c.wr)),!0)},o),B.resolve(this.Cr(l))}Cr(e){const n=[];return e.forEach(i=>{const r=this.Dr(i);r!==null&&n.push(r)}),n}removeMutationBatch(e,n){me(this.Fr(n.batchId,"removed")===0),this.mutationQueue.shift();let i=this.br;return B.forEach(n.mutations,r=>{const s=new We(r.key,n.batchId);return i=i.delete(s),this.referenceDelegate.markPotentiallyOrphaned(e,r.key)}).next(()=>{this.br=i})}On(e){}containsKey(e,n){const i=new We(n,0),r=this.br.firstAfterOrEqual(i);return B.resolve(n.isEqual(r&&r.key))}performConsistencyCheck(e){return this.mutationQueue.length,B.resolve()}Fr(e,n){return this.vr(e)}vr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Dr(e){const n=this.vr(e);return n<0||n>=this.mutationQueue.length?null:this.mutationQueue[n]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class G_{constructor(e){this.Mr=e,this.docs=function(){return new Ce(W.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,n){const i=n.key,r=this.docs.get(i),s=r?r.size:0,o=this.Mr(n);return this.docs=this.docs.insert(i,{document:n.mutableCopy(),size:o}),this.size+=o-s,this.indexManager.addToCollectionParentIndex(e,i.path.popLast())}removeEntry(e){const n=this.docs.get(e);n&&(this.docs=this.docs.remove(e),this.size-=n.size)}getEntry(e,n){const i=this.docs.get(n);return B.resolve(i?i.document.mutableCopy():ot.newInvalidDocument(n))}getEntries(e,n){let i=Un();return n.forEach(r=>{const s=this.docs.get(r);i=i.insert(r,s?s.document.mutableCopy():ot.newInvalidDocument(r))}),B.resolve(i)}getDocumentsMatchingQuery(e,n,i,r){let s=Un();const o=n.path,l=new W(o.child("")),c=this.docs.getIteratorFrom(l);for(;c.hasNext();){const{key:d,value:{document:f}}=c.getNext();if(!o.isPrefixOf(d.path))break;d.path.length>o.length+1||Pw(Rw(f),i)<=0||(r.has(f.key)||ha(n,f))&&(s=s.insert(f.key,f.mutableCopy()))}return B.resolve(s)}getAllFromCollectionGroup(e,n,i,r){G()}Or(e,n){return B.forEach(this.docs,i=>n(i))}newChangeBuffer(e){return new K_(this)}getSize(e){return B.resolve(this.size)}}class K_ extends $_{constructor(e){super(),this.cr=e}applyChanges(e){const n=[];return this.changes.forEach((i,r)=>{r.isValidDocument()?n.push(this.cr.addEntry(e,r)):this.cr.removeEntry(i)}),B.waitFor(n)}getFromCache(e,n){return this.cr.getEntry(e,n)}getAllFromCache(e,n){return this.cr.getEntries(e,n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Q_{constructor(e){this.persistence=e,this.Nr=new Mr(n=>_c(n),Ec),this.lastRemoteSnapshotVersion=Q.min(),this.highestTargetId=0,this.Lr=0,this.Br=new kc,this.targetCount=0,this.kr=Tr.Bn()}forEachTarget(e,n){return this.Nr.forEach((i,r)=>n(r)),B.resolve()}getLastRemoteSnapshotVersion(e){return B.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return B.resolve(this.Lr)}allocateTargetId(e){return this.highestTargetId=this.kr.next(),B.resolve(this.highestTargetId)}setTargetsMetadata(e,n,i){return i&&(this.lastRemoteSnapshotVersion=i),n>this.Lr&&(this.Lr=n),B.resolve()}Kn(e){this.Nr.set(e.target,e);const n=e.targetId;n>this.highestTargetId&&(this.kr=new Tr(n),this.highestTargetId=n),e.sequenceNumber>this.Lr&&(this.Lr=e.sequenceNumber)}addTargetData(e,n){return this.Kn(n),this.targetCount+=1,B.resolve()}updateTargetData(e,n){return this.Kn(n),B.resolve()}removeTargetData(e,n){return this.Nr.delete(n.target),this.Br.gr(n.targetId),this.targetCount-=1,B.resolve()}removeTargets(e,n,i){let r=0;const s=[];return this.Nr.forEach((o,l)=>{l.sequenceNumber<=n&&i.get(l.targetId)===null&&(this.Nr.delete(o),s.push(this.removeMatchingKeysForTargetId(e,l.targetId)),r++)}),B.waitFor(s).next(()=>r)}getTargetCount(e){return B.resolve(this.targetCount)}getTargetData(e,n){const i=this.Nr.get(n)||null;return B.resolve(i)}addMatchingKeys(e,n,i){return this.Br.Rr(n,i),B.resolve()}removeMatchingKeys(e,n,i){this.Br.mr(n,i);const r=this.persistence.referenceDelegate,s=[];return r&&n.forEach(o=>{s.push(r.markPotentiallyOrphaned(e,o))}),B.waitFor(s)}removeMatchingKeysForTargetId(e,n){return this.Br.gr(n),B.resolve()}getMatchingKeysForTargetId(e,n){const i=this.Br.yr(n);return B.resolve(i)}containsKey(e,n){return B.resolve(this.Br.containsKey(n))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class J_{constructor(e,n){this.qr={},this.overlays={},this.Qr=new yc(0),this.Kr=!1,this.Kr=!0,this.$r=new Y_,this.referenceDelegate=e(this),this.Ur=new Q_(this),this.indexManager=new V_,this.remoteDocumentCache=function(r){return new G_(r)}(i=>this.referenceDelegate.Wr(i)),this.serializer=new O_(n),this.Gr=new H_(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Kr=!1,Promise.resolve()}get started(){return this.Kr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let n=this.overlays[e.toKey()];return n||(n=new W_,this.overlays[e.toKey()]=n),n}getMutationQueue(e,n){let i=this.qr[e.toKey()];return i||(i=new j_(n,this.referenceDelegate),this.qr[e.toKey()]=i),i}getGlobalsCache(){return this.$r}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Gr}runTransaction(e,n,i){$("MemoryPersistence","Starting transaction:",e);const r=new X_(this.Qr.next());return this.referenceDelegate.zr(),i(r).next(s=>this.referenceDelegate.jr(r).next(()=>s)).toPromise().then(s=>(r.raiseOnCommittedEvent(),s))}Hr(e,n){return B.or(Object.values(this.qr).map(i=>()=>i.containsKey(e,n)))}}class X_ extends Mw{constructor(e){super(),this.currentSequenceNumber=e}}class Rc{constructor(e){this.persistence=e,this.Jr=new kc,this.Yr=null}static Zr(e){return new Rc(e)}get Xr(){if(this.Yr)return this.Yr;throw G()}addReference(e,n,i){return this.Jr.addReference(i,n),this.Xr.delete(i.toString()),B.resolve()}removeReference(e,n,i){return this.Jr.removeReference(i,n),this.Xr.add(i.toString()),B.resolve()}markPotentiallyOrphaned(e,n){return this.Xr.add(n.toString()),B.resolve()}removeTarget(e,n){this.Jr.gr(n.targetId).forEach(r=>this.Xr.add(r.toString()));const i=this.persistence.getTargetCache();return i.getMatchingKeysForTargetId(e,n.targetId).next(r=>{r.forEach(s=>this.Xr.add(s.toString()))}).next(()=>i.removeTargetData(e,n))}zr(){this.Yr=new Set}jr(e){const n=this.persistence.getRemoteDocumentCache().newChangeBuffer();return B.forEach(this.Xr,i=>{const r=W.fromPath(i);return this.ei(e,r).next(s=>{s||n.removeEntry(r,Q.min())})}).next(()=>(this.Yr=null,n.apply(e)))}updateLimboDocument(e,n){return this.ei(e,n).next(i=>{i?this.Xr.delete(n.toString()):this.Xr.add(n.toString())})}Wr(e){return 0}ei(e,n){return B.or([()=>B.resolve(this.Jr.containsKey(n)),()=>this.persistence.getTargetCache().containsKey(e,n),()=>this.persistence.Hr(e,n)])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pc{constructor(e,n,i,r){this.targetId=e,this.fromCache=n,this.$i=i,this.Ui=r}static Wi(e,n){let i=re(),r=re();for(const s of n.docChanges)switch(s.type){case 0:i=i.add(s.doc.key);break;case 1:r=r.add(s.doc.key)}return new Pc(e,n.fromCache,i,r)}}/**
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
 */class Z_{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eE{constructor(){this.Gi=!1,this.zi=!1,this.ji=100,this.Hi=function(){return By()?8:Dw(lt())>0?6:4}()}initialize(e,n){this.Ji=e,this.indexManager=n,this.Gi=!0}getDocumentsMatchingQuery(e,n,i,r){const s={result:null};return this.Yi(e,n).next(o=>{s.result=o}).next(()=>{if(!s.result)return this.Zi(e,n,r,i).next(o=>{s.result=o})}).next(()=>{if(s.result)return;const o=new Z_;return this.Xi(e,n,o).next(l=>{if(s.result=l,this.zi)return this.es(e,n,o,l.size)})}).next(()=>s.result)}es(e,n,i,r){return i.documentReadCount<this.ji?(Jr()<=oe.DEBUG&&$("QueryEngine","SDK will not create cache indexes for query:",sr(n),"since it only creates cache indexes for collection contains","more than or equal to",this.ji,"documents"),B.resolve()):(Jr()<=oe.DEBUG&&$("QueryEngine","Query:",sr(n),"scans",i.documentReadCount,"local documents and returns",r,"documents as results."),i.documentReadCount>this.Hi*r?(Jr()<=oe.DEBUG&&$("QueryEngine","The SDK decides to create cache indexes for query:",sr(n),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,un(n))):B.resolve())}Yi(e,n){if(rh(n))return B.resolve(null);let i=un(n);return this.indexManager.getIndexType(e,i).next(r=>r===0?null:(n.limit!==null&&r===1&&(n=kl(n,null,"F"),i=un(n)),this.indexManager.getDocumentsMatchingTarget(e,i).next(s=>{const o=re(...s);return this.Ji.getDocuments(e,o).next(l=>this.indexManager.getMinOffset(e,i).next(c=>{const d=this.ts(n,l);return this.ns(n,d,o,c.readTime)?this.Yi(e,kl(n,null,"F")):this.rs(e,d,n,c)}))})))}Zi(e,n,i,r){return rh(n)||r.isEqual(Q.min())?B.resolve(null):this.Ji.getDocuments(e,i).next(s=>{const o=this.ts(n,s);return this.ns(n,o,i,r)?B.resolve(null):(Jr()<=oe.DEBUG&&$("QueryEngine","Re-using previous result from %s to execute query: %s",r.toString(),sr(n)),this.rs(e,o,n,kw(r,-1)).next(l=>l))})}ts(e,n){let i=new Je(up(e));return n.forEach((r,s)=>{ha(e,s)&&(i=i.add(s))}),i}ns(e,n,i,r){if(e.limit===null)return!1;if(i.size!==n.size)return!0;const s=e.limitType==="F"?n.last():n.first();return!!s&&(s.hasPendingWrites||s.version.compareTo(r)>0)}Xi(e,n,i){return Jr()<=oe.DEBUG&&$("QueryEngine","Using full collection scan to execute query:",sr(n)),this.Ji.getDocumentsMatchingQuery(e,n,gi.min(),i)}rs(e,n,i,r){return this.Ji.getDocumentsMatchingQuery(e,i,r).next(s=>(n.forEach(o=>{s=s.insert(o.key,o)}),s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tE{constructor(e,n,i,r){this.persistence=e,this.ss=n,this.serializer=r,this.os=new Ce(he),this._s=new Mr(s=>_c(s),Ec),this.us=new Map,this.cs=e.getRemoteDocumentCache(),this.Ur=e.getTargetCache(),this.Gr=e.getBundleCache(),this.ls(i)}ls(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new q_(this.cs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.cs.setIndexManager(this.indexManager),this.ss.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",n=>e.collect(n,this.os))}}function nE(t,e,n,i){return new tE(t,e,n,i)}async function Mp(t,e){const n=J(t);return await n.persistence.runTransaction("Handle user change","readonly",i=>{let r;return n.mutationQueue.getAllMutationBatches(i).next(s=>(r=s,n.ls(e),n.mutationQueue.getAllMutationBatches(i))).next(s=>{const o=[],l=[];let c=re();for(const d of r){o.push(d.batchId);for(const f of d.mutations)c=c.add(f.key)}for(const d of s){l.push(d.batchId);for(const f of d.mutations)c=c.add(f.key)}return n.localDocuments.getDocuments(i,c).next(d=>({hs:d,removedBatchIds:o,addedBatchIds:l}))})})}function iE(t,e){const n=J(t);return n.persistence.runTransaction("Acknowledge batch","readwrite-primary",i=>{const r=e.batch.keys(),s=n.cs.newChangeBuffer({trackRemovals:!0});return function(l,c,d,f){const m=d.batch,p=m.keys();let y=B.resolve();return p.forEach(I=>{y=y.next(()=>f.getEntry(c,I)).next(x=>{const A=d.docVersions.get(I);me(A!==null),x.version.compareTo(A)<0&&(m.applyToRemoteDocument(x,d),x.isValidDocument()&&(x.setReadTime(d.commitVersion),f.addEntry(x)))})}),y.next(()=>l.mutationQueue.removeMutationBatch(c,m))}(n,i,e,s).next(()=>s.apply(i)).next(()=>n.mutationQueue.performConsistencyCheck(i)).next(()=>n.documentOverlayCache.removeOverlaysForBatchId(i,r,e.batch.batchId)).next(()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(i,function(l){let c=re();for(let d=0;d<l.mutationResults.length;++d)l.mutationResults[d].transformResults.length>0&&(c=c.add(l.batch.mutations[d].key));return c}(e))).next(()=>n.localDocuments.getDocuments(i,r))})}function Dp(t){const e=J(t);return e.persistence.runTransaction("Get last remote snapshot version","readonly",n=>e.Ur.getLastRemoteSnapshotVersion(n))}function rE(t,e){const n=J(t),i=e.snapshotVersion;let r=n.os;return n.persistence.runTransaction("Apply remote event","readwrite-primary",s=>{const o=n.cs.newChangeBuffer({trackRemovals:!0});r=n.os;const l=[];e.targetChanges.forEach((f,m)=>{const p=r.get(m);if(!p)return;l.push(n.Ur.removeMatchingKeys(s,f.removedDocuments,m).next(()=>n.Ur.addMatchingKeys(s,f.addedDocuments,m)));let y=p.withSequenceNumber(s.currentSequenceNumber);e.targetMismatches.get(m)!==null?y=y.withResumeToken(Ze.EMPTY_BYTE_STRING,Q.min()).withLastLimboFreeSnapshotVersion(Q.min()):f.resumeToken.approximateByteSize()>0&&(y=y.withResumeToken(f.resumeToken,i)),r=r.insert(m,y),function(x,A,R){return x.resumeToken.approximateByteSize()===0||A.snapshotVersion.toMicroseconds()-x.snapshotVersion.toMicroseconds()>=3e8?!0:R.addedDocuments.size+R.modifiedDocuments.size+R.removedDocuments.size>0}(p,y,f)&&l.push(n.Ur.updateTargetData(s,y))});let c=Un(),d=re();if(e.documentUpdates.forEach(f=>{e.resolvedLimboDocuments.has(f)&&l.push(n.persistence.referenceDelegate.updateLimboDocument(s,f))}),l.push(sE(s,o,e.documentUpdates).next(f=>{c=f.Ps,d=f.Is})),!i.isEqual(Q.min())){const f=n.Ur.getLastRemoteSnapshotVersion(s).next(m=>n.Ur.setTargetsMetadata(s,s.currentSequenceNumber,i));l.push(f)}return B.waitFor(l).next(()=>o.apply(s)).next(()=>n.localDocuments.getLocalViewOfDocuments(s,c,d)).next(()=>c)}).then(s=>(n.os=r,s))}function sE(t,e,n){let i=re(),r=re();return n.forEach(s=>i=i.add(s)),e.getEntries(t,i).next(s=>{let o=Un();return n.forEach((l,c)=>{const d=s.get(l);c.isFoundDocument()!==d.isFoundDocument()&&(r=r.add(l)),c.isNoDocument()&&c.version.isEqual(Q.min())?(e.removeEntry(l,c.readTime),o=o.insert(l,c)):!d.isValidDocument()||c.version.compareTo(d.version)>0||c.version.compareTo(d.version)===0&&d.hasPendingWrites?(e.addEntry(c),o=o.insert(l,c)):$("LocalStore","Ignoring outdated watch update for ",l,". Current version:",d.version," Watch version:",c.version)}),{Ps:o,Is:r}})}function oE(t,e){const n=J(t);return n.persistence.runTransaction("Get next mutation batch","readonly",i=>(e===void 0&&(e=-1),n.mutationQueue.getNextMutationBatchAfterBatchId(i,e)))}function aE(t,e){const n=J(t);return n.persistence.runTransaction("Allocate target","readwrite",i=>{let r;return n.Ur.getTargetData(i,e).next(s=>s?(r=s,B.resolve(r)):n.Ur.allocateTargetId(i).next(o=>(r=new ci(e,o,"TargetPurposeListen",i.currentSequenceNumber),n.Ur.addTargetData(i,r).next(()=>r))))}).then(i=>{const r=n.os.get(i.targetId);return(r===null||i.snapshotVersion.compareTo(r.snapshotVersion)>0)&&(n.os=n.os.insert(i.targetId,i),n._s.set(e,i.targetId)),i})}async function Dl(t,e,n){const i=J(t),r=i.os.get(e),s=n?"readwrite":"readwrite-primary";try{n||await i.persistence.runTransaction("Release target",s,o=>i.persistence.referenceDelegate.removeTarget(o,r))}catch(o){if(!Vs(o))throw o;$("LocalStore",`Failed to update sequence numbers for target ${e}: ${o}`)}i.os=i.os.remove(e),i._s.delete(r.target)}function mh(t,e,n){const i=J(t);let r=Q.min(),s=re();return i.persistence.runTransaction("Execute query","readwrite",o=>function(c,d,f){const m=J(c),p=m._s.get(f);return p!==void 0?B.resolve(m.os.get(p)):m.Ur.getTargetData(d,f)}(i,o,un(e)).next(l=>{if(l)return r=l.lastLimboFreeSnapshotVersion,i.Ur.getMatchingKeysForTargetId(o,l.targetId).next(c=>{s=c})}).next(()=>i.ss.getDocumentsMatchingQuery(o,e,n?r:Q.min(),n?s:re())).next(l=>(lE(i,Xw(e),l),{documents:l,Ts:s})))}function lE(t,e,n){let i=t.us.get(e)||Q.min();n.forEach((r,s)=>{s.readTime.compareTo(i)>0&&(i=s.readTime)}),t.us.set(e,i)}class gh{constructor(){this.activeTargetIds=r_()}fs(e){this.activeTargetIds=this.activeTargetIds.add(e)}gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Vs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class cE{constructor(){this.so=new gh,this.oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,n,i){}addLocalQueryTarget(e,n=!0){return n&&this.so.fs(e),this.oo[e]||"not-current"}updateQueryState(e,n,i){this.oo[e]=n}removeLocalQueryTarget(e){this.so.gs(e)}isLocalQueryTarget(e){return this.so.activeTargetIds.has(e)}clearQueryState(e){delete this.oo[e]}getAllActiveQueryTargets(){return this.so.activeTargetIds}isActiveQueryTarget(e){return this.so.activeTargetIds.has(e)}start(){return this.so=new gh,Promise.resolve()}handleUserChange(e,n,i){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dE{_o(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yh{constructor(){this.ao=()=>this.uo(),this.co=()=>this.lo(),this.ho=[],this.Po()}_o(e){this.ho.push(e)}shutdown(){window.removeEventListener("online",this.ao),window.removeEventListener("offline",this.co)}Po(){window.addEventListener("online",this.ao),window.addEventListener("offline",this.co)}uo(){$("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const e of this.ho)e(0)}lo(){$("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const e of this.ho)e(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
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
 */let yo=null;function ol(){return yo===null?yo=function(){return 268435456+Math.round(2147483648*Math.random())}():yo++,"0x"+yo.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uE={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hE{constructor(e){this.Io=e.Io,this.To=e.To}Eo(e){this.Ao=e}Ro(e){this.Vo=e}mo(e){this.fo=e}onMessage(e){this.po=e}close(){this.To()}send(e){this.Io(e)}yo(){this.Ao()}wo(){this.Vo()}So(e){this.fo(e)}bo(e){this.po(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rt="WebChannelConnection";class fE extends class{constructor(n){this.databaseInfo=n,this.databaseId=n.databaseId;const i=n.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.Do=i+"://"+n.host,this.vo=`projects/${r}/databases/${s}`,this.Co=this.databaseId.database==="(default)"?`project_id=${r}`:`project_id=${r}&database_id=${s}`}get Fo(){return!1}Mo(n,i,r,s,o){const l=ol(),c=this.xo(n,i.toUriEncodedString());$("RestConnection",`Sending RPC '${n}' ${l}:`,c,r);const d={"google-cloud-resource-prefix":this.vo,"x-goog-request-params":this.Co};return this.Oo(d,s,o),this.No(n,c,d,r).then(f=>($("RestConnection",`Received RPC '${n}' ${l}: `,f),f),f=>{throw br("RestConnection",`RPC '${n}' ${l} failed with error: `,f,"url: ",c,"request:",r),f})}Lo(n,i,r,s,o,l){return this.Mo(n,i,r,s,o)}Oo(n,i,r){n["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+Cr}(),n["Content-Type"]="text/plain",this.databaseInfo.appId&&(n["X-Firebase-GMPID"]=this.databaseInfo.appId),i&&i.headers.forEach((s,o)=>n[o]=s),r&&r.headers.forEach((s,o)=>n[o]=s)}xo(n,i){const r=uE[n];return`${this.Do}/v1/${i}:${r}`}terminate(){}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}No(e,n,i,r){const s=ol();return new Promise((o,l)=>{const c=new Gf;c.setWithCredentials(!0),c.listenOnce(Kf.COMPLETE,()=>{try{switch(c.getLastErrorCode()){case To.NO_ERROR:const f=c.getResponseJson();$(rt,`XHR for RPC '${e}' ${s} received:`,JSON.stringify(f)),o(f);break;case To.TIMEOUT:$(rt,`RPC '${e}' ${s} timed out`),l(new U(M.DEADLINE_EXCEEDED,"Request time out"));break;case To.HTTP_ERROR:const m=c.getStatus();if($(rt,`RPC '${e}' ${s} failed with status:`,m,"response text:",c.getResponseText()),m>0){let p=c.getResponseJson();Array.isArray(p)&&(p=p[0]);const y=p==null?void 0:p.error;if(y&&y.status&&y.message){const I=function(A){const R=A.toLowerCase().replace(/_/g,"-");return Object.values(M).indexOf(R)>=0?R:M.UNKNOWN}(y.status);l(new U(I,y.message))}else l(new U(M.UNKNOWN,"Server responded with status "+c.getStatus()))}else l(new U(M.UNAVAILABLE,"Connection failed."));break;default:G()}}finally{$(rt,`RPC '${e}' ${s} completed.`)}});const d=JSON.stringify(r);$(rt,`RPC '${e}' ${s} sending request:`,r),c.send(n,"POST",d,i,15)})}Bo(e,n,i){const r=ol(),s=[this.Do,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=Xf(),l=Jf(),c={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},d=this.longPollingOptions.timeoutSeconds;d!==void 0&&(c.longPollingTimeout=Math.round(1e3*d)),this.useFetchStreams&&(c.useFetchStreams=!0),this.Oo(c.initMessageHeaders,n,i),c.encodeInitMessageHeaders=!0;const f=s.join("");$(rt,`Creating RPC '${e}' stream ${r}: ${f}`,c);const m=o.createWebChannel(f,c);let p=!1,y=!1;const I=new hE({Io:A=>{y?$(rt,`Not sending because RPC '${e}' stream ${r} is closed:`,A):(p||($(rt,`Opening RPC '${e}' stream ${r} transport.`),m.open(),p=!0),$(rt,`RPC '${e}' stream ${r} sending:`,A),m.send(A))},To:()=>m.close()}),x=(A,R,C)=>{A.listen(R,L=>{try{C(L)}catch(N){setTimeout(()=>{throw N},0)}})};return x(m,ts.EventType.OPEN,()=>{y||($(rt,`RPC '${e}' stream ${r} transport opened.`),I.yo())}),x(m,ts.EventType.CLOSE,()=>{y||(y=!0,$(rt,`RPC '${e}' stream ${r} transport closed`),I.So())}),x(m,ts.EventType.ERROR,A=>{y||(y=!0,br(rt,`RPC '${e}' stream ${r} transport errored:`,A),I.So(new U(M.UNAVAILABLE,"The operation could not be completed")))}),x(m,ts.EventType.MESSAGE,A=>{var R;if(!y){const C=A.data[0];me(!!C);const L=C,N=L.error||((R=L[0])===null||R===void 0?void 0:R.error);if(N){$(rt,`RPC '${e}' stream ${r} received error:`,N);const z=N.status;let q=function(_){const w=Fe[_];if(w!==void 0)return Ep(w)}(z),T=N.message;q===void 0&&(q=M.INTERNAL,T="Unknown error status: "+z+" with message "+N.message),y=!0,I.So(new U(q,T)),m.close()}else $(rt,`RPC '${e}' stream ${r} received:`,C),I.bo(C)}}),x(l,Qf.STAT_EVENT,A=>{A.stat===Tl.PROXY?$(rt,`RPC '${e}' stream ${r} detected buffering proxy`):A.stat===Tl.NOPROXY&&$(rt,`RPC '${e}' stream ${r} detected no buffering proxy`)}),setTimeout(()=>{I.wo()},0),I}}function al(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ya(t){return new T_(t,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bp{constructor(e,n,i=1e3,r=1.5,s=6e4){this.ui=e,this.timerId=n,this.ko=i,this.qo=r,this.Qo=s,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(e){this.cancel();const n=Math.floor(this.Ko+this.zo()),i=Math.max(0,Date.now()-this.Uo),r=Math.max(0,n-i);r>0&&$("ExponentialBackoff",`Backing off for ${r} ms (base delay: ${this.Ko} ms, delay with jitter: ${n} ms, last attempt: ${i} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,r,()=>(this.Uo=Date.now(),e())),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){this.$o!==null&&(this.$o.skipDelay(),this.$o=null)}cancel(){this.$o!==null&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lp{constructor(e,n,i,r,s,o,l,c){this.ui=e,this.Ho=i,this.Jo=r,this.connection=s,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=l,this.listener=c,this.state=0,this.Yo=0,this.Zo=null,this.Xo=null,this.stream=null,this.e_=0,this.t_=new Bp(e,n)}n_(){return this.state===1||this.state===5||this.r_()}r_(){return this.state===2||this.state===3}start(){this.e_=0,this.state!==4?this.auth():this.i_()}async stop(){this.n_()&&await this.close(0)}s_(){this.state=0,this.t_.reset()}o_(){this.r_()&&this.Zo===null&&(this.Zo=this.ui.enqueueAfterDelay(this.Ho,6e4,()=>this.__()))}a_(e){this.u_(),this.stream.send(e)}async __(){if(this.r_())return this.close(0)}u_(){this.Zo&&(this.Zo.cancel(),this.Zo=null)}c_(){this.Xo&&(this.Xo.cancel(),this.Xo=null)}async close(e,n){this.u_(),this.c_(),this.t_.cancel(),this.Yo++,e!==4?this.t_.reset():n&&n.code===M.RESOURCE_EXHAUSTED?($n(n.toString()),$n("Using maximum backoff delay to prevent overloading the backend."),this.t_.Wo()):n&&n.code===M.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.l_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.mo(n)}l_(){}auth(){this.state=1;const e=this.h_(this.Yo),n=this.Yo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([i,r])=>{this.Yo===n&&this.P_(i,r)},i=>{e(()=>{const r=new U(M.UNKNOWN,"Fetching auth token failed: "+i.message);return this.I_(r)})})}P_(e,n){const i=this.h_(this.Yo);this.stream=this.T_(e,n),this.stream.Eo(()=>{i(()=>this.listener.Eo())}),this.stream.Ro(()=>{i(()=>(this.state=2,this.Xo=this.ui.enqueueAfterDelay(this.Jo,1e4,()=>(this.r_()&&(this.state=3),Promise.resolve())),this.listener.Ro()))}),this.stream.mo(r=>{i(()=>this.I_(r))}),this.stream.onMessage(r=>{i(()=>++this.e_==1?this.E_(r):this.onNext(r))})}i_(){this.state=5,this.t_.Go(async()=>{this.state=0,this.start()})}I_(e){return $("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}h_(e){return n=>{this.ui.enqueueAndForget(()=>this.Yo===e?n():($("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class pE extends Lp{constructor(e,n,i,r,s,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",n,i,r,o),this.serializer=s}T_(e,n){return this.connection.Bo("Listen",e,n)}E_(e){return this.onNext(e)}onNext(e){this.t_.reset();const n=S_(this.serializer,e),i=function(s){if(!("targetChange"in s))return Q.min();const o=s.targetChange;return o.targetIds&&o.targetIds.length?Q.min():o.readTime?hn(o.readTime):Q.min()}(e);return this.listener.d_(n,i)}A_(e){const n={};n.database=Ml(this.serializer),n.addTarget=function(s,o){let l;const c=o.target;if(l=Al(c)?{documents:R_(s,c)}:{query:P_(s,c)._t},l.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){l.resumeToken=xp(s,o.resumeToken);const d=Rl(s,o.expectedCount);d!==null&&(l.expectedCount=d)}else if(o.snapshotVersion.compareTo(Q.min())>0){l.readTime=Yo(s,o.snapshotVersion.toTimestamp());const d=Rl(s,o.expectedCount);d!==null&&(l.expectedCount=d)}return l}(this.serializer,e);const i=M_(this.serializer,e);i&&(n.labels=i),this.a_(n)}R_(e){const n={};n.database=Ml(this.serializer),n.removeTarget=e,this.a_(n)}}class mE extends Lp{constructor(e,n,i,r,s,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",n,i,r,o),this.serializer=s}get V_(){return this.e_>0}start(){this.lastStreamToken=void 0,super.start()}l_(){this.V_&&this.m_([])}T_(e,n){return this.connection.Bo("Write",e,n)}E_(e){return me(!!e.streamToken),this.lastStreamToken=e.streamToken,me(!e.writeResults||e.writeResults.length===0),this.listener.f_()}onNext(e){me(!!e.streamToken),this.lastStreamToken=e.streamToken,this.t_.reset();const n=k_(e.writeResults,e.commitTime),i=hn(e.commitTime);return this.listener.g_(i,n)}p_(){const e={};e.database=Ml(this.serializer),this.a_(e)}m_(e){const n={streamToken:this.lastStreamToken,writes:e.map(i=>A_(this.serializer,i))};this.a_(n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gE extends class{}{constructor(e,n,i,r){super(),this.authCredentials=e,this.appCheckCredentials=n,this.connection=i,this.serializer=r,this.y_=!1}w_(){if(this.y_)throw new U(M.FAILED_PRECONDITION,"The client has already been terminated.")}Mo(e,n,i,r){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,o])=>this.connection.Mo(e,Pl(n,i),r,s,o)).catch(s=>{throw s.name==="FirebaseError"?(s.code===M.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),s):new U(M.UNKNOWN,s.toString())})}Lo(e,n,i,r,s){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,l])=>this.connection.Lo(e,Pl(n,i),r,o,l,s)).catch(o=>{throw o.name==="FirebaseError"?(o.code===M.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new U(M.UNKNOWN,o.toString())})}terminate(){this.y_=!0,this.connection.terminate()}}class yE{constructor(e,n){this.asyncQueue=e,this.onlineStateHandler=n,this.state="Unknown",this.S_=0,this.b_=null,this.D_=!0}v_(){this.S_===0&&(this.C_("Unknown"),this.b_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.b_=null,this.F_("Backend didn't respond within 10 seconds."),this.C_("Offline"),Promise.resolve())))}M_(e){this.state==="Online"?this.C_("Unknown"):(this.S_++,this.S_>=1&&(this.x_(),this.F_(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.C_("Offline")))}set(e){this.x_(),this.S_=0,e==="Online"&&(this.D_=!1),this.C_(e)}C_(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}F_(e){const n=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.D_?($n(n),this.D_=!1):$("OnlineStateTracker",n)}x_(){this.b_!==null&&(this.b_.cancel(),this.b_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vE{constructor(e,n,i,r,s){this.localStore=e,this.datastore=n,this.asyncQueue=i,this.remoteSyncer={},this.O_=[],this.N_=new Map,this.L_=new Set,this.B_=[],this.k_=s,this.k_._o(o=>{i.enqueueAndForget(async()=>{Qi(this)&&($("RemoteStore","Restarting streams for network reachability change."),await async function(c){const d=J(c);d.L_.add(4),await Us(d),d.q_.set("Unknown"),d.L_.delete(4),await va(d)}(this))})}),this.q_=new yE(i,r)}}async function va(t){if(Qi(t))for(const e of t.B_)await e(!0)}async function Us(t){for(const e of t.B_)await e(!1)}function Np(t,e){const n=J(t);n.N_.has(e.targetId)||(n.N_.set(e.targetId,e),Bc(n)?Dc(n):Dr(n).r_()&&Mc(n,e))}function Cc(t,e){const n=J(t),i=Dr(n);n.N_.delete(e),i.r_()&&Op(n,e),n.N_.size===0&&(i.r_()?i.o_():Qi(n)&&n.q_.set("Unknown"))}function Mc(t,e){if(t.Q_.xe(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(Q.min())>0){const n=t.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(n)}Dr(t).A_(e)}function Op(t,e){t.Q_.xe(e),Dr(t).R_(e)}function Dc(t){t.Q_=new b_({getRemoteKeysForTarget:e=>t.remoteSyncer.getRemoteKeysForTarget(e),ot:e=>t.N_.get(e)||null,tt:()=>t.datastore.serializer.databaseId}),Dr(t).start(),t.q_.v_()}function Bc(t){return Qi(t)&&!Dr(t).n_()&&t.N_.size>0}function Qi(t){return J(t).L_.size===0}function Fp(t){t.Q_=void 0}async function bE(t){t.q_.set("Online")}async function wE(t){t.N_.forEach((e,n)=>{Mc(t,e)})}async function _E(t,e){Fp(t),Bc(t)?(t.q_.M_(e),Dc(t)):t.q_.set("Unknown")}async function EE(t,e,n){if(t.q_.set("Online"),e instanceof Ip&&e.state===2&&e.cause)try{await async function(r,s){const o=s.cause;for(const l of s.targetIds)r.N_.has(l)&&(await r.remoteSyncer.rejectListen(l,o),r.N_.delete(l),r.Q_.removeTarget(l))}(t,e)}catch(i){$("RemoteStore","Failed to remove targets %s: %s ",e.targetIds.join(","),i),await jo(t,i)}else if(e instanceof So?t.Q_.Ke(e):e instanceof Tp?t.Q_.He(e):t.Q_.We(e),!n.isEqual(Q.min()))try{const i=await Dp(t.localStore);n.compareTo(i)>=0&&await function(s,o){const l=s.Q_.rt(o);return l.targetChanges.forEach((c,d)=>{if(c.resumeToken.approximateByteSize()>0){const f=s.N_.get(d);f&&s.N_.set(d,f.withResumeToken(c.resumeToken,o))}}),l.targetMismatches.forEach((c,d)=>{const f=s.N_.get(c);if(!f)return;s.N_.set(c,f.withResumeToken(Ze.EMPTY_BYTE_STRING,f.snapshotVersion)),Op(s,c);const m=new ci(f.target,c,d,f.sequenceNumber);Mc(s,m)}),s.remoteSyncer.applyRemoteEvent(l)}(t,n)}catch(i){$("RemoteStore","Failed to raise snapshot:",i),await jo(t,i)}}async function jo(t,e,n){if(!Vs(e))throw e;t.L_.add(1),await Us(t),t.q_.set("Offline"),n||(n=()=>Dp(t.localStore)),t.asyncQueue.enqueueRetryable(async()=>{$("RemoteStore","Retrying IndexedDB access"),await n(),t.L_.delete(1),await va(t)})}function Vp(t,e){return e().catch(n=>jo(t,n,e))}async function ba(t){const e=J(t),n=vi(e);let i=e.O_.length>0?e.O_[e.O_.length-1].batchId:-1;for(;TE(e);)try{const r=await oE(e.localStore,i);if(r===null){e.O_.length===0&&n.o_();break}i=r.batchId,IE(e,r)}catch(r){await jo(e,r)}zp(e)&&$p(e)}function TE(t){return Qi(t)&&t.O_.length<10}function IE(t,e){t.O_.push(e);const n=vi(t);n.r_()&&n.V_&&n.m_(e.mutations)}function zp(t){return Qi(t)&&!vi(t).n_()&&t.O_.length>0}function $p(t){vi(t).start()}async function xE(t){vi(t).p_()}async function SE(t){const e=vi(t);for(const n of t.O_)e.m_(n.mutations)}async function AE(t,e,n){const i=t.O_.shift(),r=xc.from(i,e,n);await Vp(t,()=>t.remoteSyncer.applySuccessfulWrite(r)),await ba(t)}async function kE(t,e){e&&vi(t).V_&&await async function(i,r){if(function(o){return g_(o)&&o!==M.ABORTED}(r.code)){const s=i.O_.shift();vi(i).s_(),await Vp(i,()=>i.remoteSyncer.rejectFailedWrite(s.batchId,r)),await ba(i)}}(t,e),zp(t)&&$p(t)}async function vh(t,e){const n=J(t);n.asyncQueue.verifyOperationInProgress(),$("RemoteStore","RemoteStore received new credentials");const i=Qi(n);n.L_.add(3),await Us(n),i&&n.q_.set("Unknown"),await n.remoteSyncer.handleCredentialChange(e),n.L_.delete(3),await va(n)}async function RE(t,e){const n=J(t);e?(n.L_.delete(2),await va(n)):e||(n.L_.add(2),await Us(n),n.q_.set("Unknown"))}function Dr(t){return t.K_||(t.K_=function(n,i,r){const s=J(n);return s.w_(),new pE(i,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,r)}(t.datastore,t.asyncQueue,{Eo:bE.bind(null,t),Ro:wE.bind(null,t),mo:_E.bind(null,t),d_:EE.bind(null,t)}),t.B_.push(async e=>{e?(t.K_.s_(),Bc(t)?Dc(t):t.q_.set("Unknown")):(await t.K_.stop(),Fp(t))})),t.K_}function vi(t){return t.U_||(t.U_=function(n,i,r){const s=J(n);return s.w_(),new mE(i,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,r)}(t.datastore,t.asyncQueue,{Eo:()=>Promise.resolve(),Ro:xE.bind(null,t),mo:kE.bind(null,t),f_:SE.bind(null,t),g_:AE.bind(null,t)}),t.B_.push(async e=>{e?(t.U_.s_(),await ba(t)):(await t.U_.stop(),t.O_.length>0&&($("RemoteStore",`Stopping write stream with ${t.O_.length} pending writes`),t.O_=[]))})),t.U_}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lc{constructor(e,n,i,r,s){this.asyncQueue=e,this.timerId=n,this.targetTimeMs=i,this.op=r,this.removalCallback=s,this.deferred=new On,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(o=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,n,i,r,s){const o=Date.now()+i,l=new Lc(e,n,o,r,s);return l.start(i),l}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new U(M.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Nc(t,e){if($n("AsyncQueue",`${e}: ${t}`),Vs(t))return new U(M.UNAVAILABLE,`${e}: ${t}`);throw t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hr{constructor(e){this.comparator=e?(n,i)=>e(n,i)||W.comparator(n.key,i.key):(n,i)=>W.comparator(n.key,i.key),this.keyedMap=ns(),this.sortedSet=new Ce(this.comparator)}static emptySet(e){return new hr(e.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const n=this.keyedMap.get(e);return n?this.sortedSet.indexOf(n):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((n,i)=>(e(n),!1))}add(e){const n=this.delete(e.key);return n.copy(n.keyedMap.insert(e.key,e),n.sortedSet.insert(e,null))}delete(e){const n=this.get(e);return n?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(n)):this}isEqual(e){if(!(e instanceof hr)||this.size!==e.size)return!1;const n=this.sortedSet.getIterator(),i=e.sortedSet.getIterator();for(;n.hasNext();){const r=n.getNext().key,s=i.getNext().key;if(!r.isEqual(s))return!1}return!0}toString(){const e=[];return this.forEach(n=>{e.push(n.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,n){const i=new hr;return i.comparator=this.comparator,i.keyedMap=e,i.sortedSet=n,i}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bh{constructor(){this.W_=new Ce(W.comparator)}track(e){const n=e.doc.key,i=this.W_.get(n);i?e.type!==0&&i.type===3?this.W_=this.W_.insert(n,e):e.type===3&&i.type!==1?this.W_=this.W_.insert(n,{type:i.type,doc:e.doc}):e.type===2&&i.type===2?this.W_=this.W_.insert(n,{type:2,doc:e.doc}):e.type===2&&i.type===0?this.W_=this.W_.insert(n,{type:0,doc:e.doc}):e.type===1&&i.type===0?this.W_=this.W_.remove(n):e.type===1&&i.type===2?this.W_=this.W_.insert(n,{type:1,doc:i.doc}):e.type===0&&i.type===1?this.W_=this.W_.insert(n,{type:2,doc:e.doc}):G():this.W_=this.W_.insert(n,e)}G_(){const e=[];return this.W_.inorderTraversal((n,i)=>{e.push(i)}),e}}class Ir{constructor(e,n,i,r,s,o,l,c,d){this.query=e,this.docs=n,this.oldDocs=i,this.docChanges=r,this.mutatedKeys=s,this.fromCache=o,this.syncStateChanged=l,this.excludesMetadataChanges=c,this.hasCachedResults=d}static fromInitialDocuments(e,n,i,r,s){const o=[];return n.forEach(l=>{o.push({type:0,doc:l})}),new Ir(e,n,hr.emptySet(n),o,i,r,!0,!1,s)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&ua(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const n=this.docChanges,i=e.docChanges;if(n.length!==i.length)return!1;for(let r=0;r<n.length;r++)if(n[r].type!==i[r].type||!n[r].doc.isEqual(i[r].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class PE{constructor(){this.z_=void 0,this.j_=[]}H_(){return this.j_.some(e=>e.J_())}}class CE{constructor(){this.queries=wh(),this.onlineState="Unknown",this.Y_=new Set}terminate(){(function(n,i){const r=J(n),s=r.queries;r.queries=wh(),s.forEach((o,l)=>{for(const c of l.j_)c.onError(i)})})(this,new U(M.ABORTED,"Firestore shutting down"))}}function wh(){return new Mr(t=>dp(t),ua)}async function Up(t,e){const n=J(t);let i=3;const r=e.query;let s=n.queries.get(r);s?!s.H_()&&e.J_()&&(i=2):(s=new PE,i=e.J_()?0:1);try{switch(i){case 0:s.z_=await n.onListen(r,!0);break;case 1:s.z_=await n.onListen(r,!1);break;case 2:await n.onFirstRemoteStoreListen(r)}}catch(o){const l=Nc(o,`Initialization of query '${sr(e.query)}' failed`);return void e.onError(l)}n.queries.set(r,s),s.j_.push(e),e.Z_(n.onlineState),s.z_&&e.X_(s.z_)&&Oc(n)}async function qp(t,e){const n=J(t),i=e.query;let r=3;const s=n.queries.get(i);if(s){const o=s.j_.indexOf(e);o>=0&&(s.j_.splice(o,1),s.j_.length===0?r=e.J_()?0:1:!s.H_()&&e.J_()&&(r=2))}switch(r){case 0:return n.queries.delete(i),n.onUnlisten(i,!0);case 1:return n.queries.delete(i),n.onUnlisten(i,!1);case 2:return n.onLastRemoteStoreUnlisten(i);default:return}}function ME(t,e){const n=J(t);let i=!1;for(const r of e){const s=r.query,o=n.queries.get(s);if(o){for(const l of o.j_)l.X_(r)&&(i=!0);o.z_=r}}i&&Oc(n)}function DE(t,e,n){const i=J(t),r=i.queries.get(e);if(r)for(const s of r.j_)s.onError(n);i.queries.delete(e)}function Oc(t){t.Y_.forEach(e=>{e.next()})}var Bl,_h;(_h=Bl||(Bl={})).ea="default",_h.Cache="cache";class Hp{constructor(e,n,i){this.query=e,this.ta=n,this.na=!1,this.ra=null,this.onlineState="Unknown",this.options=i||{}}X_(e){if(!this.options.includeMetadataChanges){const i=[];for(const r of e.docChanges)r.type!==3&&i.push(r);e=new Ir(e.query,e.docs,e.oldDocs,i,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let n=!1;return this.na?this.ia(e)&&(this.ta.next(e),n=!0):this.sa(e,this.onlineState)&&(this.oa(e),n=!0),this.ra=e,n}onError(e){this.ta.error(e)}Z_(e){this.onlineState=e;let n=!1;return this.ra&&!this.na&&this.sa(this.ra,e)&&(this.oa(this.ra),n=!0),n}sa(e,n){if(!e.fromCache||!this.J_())return!0;const i=n!=="Offline";return(!this.options._a||!i)&&(!e.docs.isEmpty()||e.hasCachedResults||n==="Offline")}ia(e){if(e.docChanges.length>0)return!0;const n=this.ra&&this.ra.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!n)&&this.options.includeMetadataChanges===!0}oa(e){e=Ir.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.na=!0,this.ta.next(e)}J_(){return this.options.source!==Bl.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wp{constructor(e){this.key=e}}class Yp{constructor(e){this.key=e}}class BE{constructor(e,n){this.query=e,this.Ta=n,this.Ea=null,this.hasCachedResults=!1,this.current=!1,this.da=re(),this.mutatedKeys=re(),this.Aa=up(e),this.Ra=new hr(this.Aa)}get Va(){return this.Ta}ma(e,n){const i=n?n.fa:new bh,r=n?n.Ra:this.Ra;let s=n?n.mutatedKeys:this.mutatedKeys,o=r,l=!1;const c=this.query.limitType==="F"&&r.size===this.query.limit?r.last():null,d=this.query.limitType==="L"&&r.size===this.query.limit?r.first():null;if(e.inorderTraversal((f,m)=>{const p=r.get(f),y=ha(this.query,m)?m:null,I=!!p&&this.mutatedKeys.has(p.key),x=!!y&&(y.hasLocalMutations||this.mutatedKeys.has(y.key)&&y.hasCommittedMutations);let A=!1;p&&y?p.data.isEqual(y.data)?I!==x&&(i.track({type:3,doc:y}),A=!0):this.ga(p,y)||(i.track({type:2,doc:y}),A=!0,(c&&this.Aa(y,c)>0||d&&this.Aa(y,d)<0)&&(l=!0)):!p&&y?(i.track({type:0,doc:y}),A=!0):p&&!y&&(i.track({type:1,doc:p}),A=!0,(c||d)&&(l=!0)),A&&(y?(o=o.add(y),s=x?s.add(f):s.delete(f)):(o=o.delete(f),s=s.delete(f)))}),this.query.limit!==null)for(;o.size>this.query.limit;){const f=this.query.limitType==="F"?o.last():o.first();o=o.delete(f.key),s=s.delete(f.key),i.track({type:1,doc:f})}return{Ra:o,fa:i,ns:l,mutatedKeys:s}}ga(e,n){return e.hasLocalMutations&&n.hasCommittedMutations&&!n.hasLocalMutations}applyChanges(e,n,i,r){const s=this.Ra;this.Ra=e.Ra,this.mutatedKeys=e.mutatedKeys;const o=e.fa.G_();o.sort((f,m)=>function(y,I){const x=A=>{switch(A){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return G()}};return x(y)-x(I)}(f.type,m.type)||this.Aa(f.doc,m.doc)),this.pa(i),r=r!=null&&r;const l=n&&!r?this.ya():[],c=this.da.size===0&&this.current&&!r?1:0,d=c!==this.Ea;return this.Ea=c,o.length!==0||d?{snapshot:new Ir(this.query,e.Ra,s,o,e.mutatedKeys,c===0,d,!1,!!i&&i.resumeToken.approximateByteSize()>0),wa:l}:{wa:l}}Z_(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Ra:this.Ra,fa:new bh,mutatedKeys:this.mutatedKeys,ns:!1},!1)):{wa:[]}}Sa(e){return!this.Ta.has(e)&&!!this.Ra.has(e)&&!this.Ra.get(e).hasLocalMutations}pa(e){e&&(e.addedDocuments.forEach(n=>this.Ta=this.Ta.add(n)),e.modifiedDocuments.forEach(n=>{}),e.removedDocuments.forEach(n=>this.Ta=this.Ta.delete(n)),this.current=e.current)}ya(){if(!this.current)return[];const e=this.da;this.da=re(),this.Ra.forEach(i=>{this.Sa(i.key)&&(this.da=this.da.add(i.key))});const n=[];return e.forEach(i=>{this.da.has(i)||n.push(new Yp(i))}),this.da.forEach(i=>{e.has(i)||n.push(new Wp(i))}),n}ba(e){this.Ta=e.Ts,this.da=re();const n=this.ma(e.documents);return this.applyChanges(n,!0)}Da(){return Ir.fromInitialDocuments(this.query,this.Ra,this.mutatedKeys,this.Ea===0,this.hasCachedResults)}}class LE{constructor(e,n,i){this.query=e,this.targetId=n,this.view=i}}class NE{constructor(e){this.key=e,this.va=!1}}class OE{constructor(e,n,i,r,s,o){this.localStore=e,this.remoteStore=n,this.eventManager=i,this.sharedClientState=r,this.currentUser=s,this.maxConcurrentLimboResolutions=o,this.Ca={},this.Fa=new Mr(l=>dp(l),ua),this.Ma=new Map,this.xa=new Set,this.Oa=new Ce(W.comparator),this.Na=new Map,this.La=new kc,this.Ba={},this.ka=new Map,this.qa=Tr.kn(),this.onlineState="Unknown",this.Qa=void 0}get isPrimaryClient(){return this.Qa===!0}}async function FE(t,e,n=!0){const i=Xp(t);let r;const s=i.Fa.get(e);return s?(i.sharedClientState.addLocalQueryTarget(s.targetId),r=s.view.Da()):r=await jp(i,e,n,!0),r}async function VE(t,e){const n=Xp(t);await jp(n,e,!0,!1)}async function jp(t,e,n,i){const r=await aE(t.localStore,un(e)),s=r.targetId,o=t.sharedClientState.addLocalQueryTarget(s,n);let l;return i&&(l=await zE(t,e,s,o==="current",r.resumeToken)),t.isPrimaryClient&&n&&Np(t.remoteStore,r),l}async function zE(t,e,n,i,r){t.Ka=(m,p,y)=>async function(x,A,R,C){let L=A.view.ma(R);L.ns&&(L=await mh(x.localStore,A.query,!1).then(({documents:T})=>A.view.ma(T,L)));const N=C&&C.targetChanges.get(A.targetId),z=C&&C.targetMismatches.get(A.targetId)!=null,q=A.view.applyChanges(L,x.isPrimaryClient,N,z);return Th(x,A.targetId,q.wa),q.snapshot}(t,m,p,y);const s=await mh(t.localStore,e,!0),o=new BE(e,s.Ts),l=o.ma(s.documents),c=$s.createSynthesizedTargetChangeForCurrentChange(n,i&&t.onlineState!=="Offline",r),d=o.applyChanges(l,t.isPrimaryClient,c);Th(t,n,d.wa);const f=new LE(e,n,o);return t.Fa.set(e,f),t.Ma.has(n)?t.Ma.get(n).push(e):t.Ma.set(n,[e]),d.snapshot}async function $E(t,e,n){const i=J(t),r=i.Fa.get(e),s=i.Ma.get(r.targetId);if(s.length>1)return i.Ma.set(r.targetId,s.filter(o=>!ua(o,e))),void i.Fa.delete(e);i.isPrimaryClient?(i.sharedClientState.removeLocalQueryTarget(r.targetId),i.sharedClientState.isActiveQueryTarget(r.targetId)||await Dl(i.localStore,r.targetId,!1).then(()=>{i.sharedClientState.clearQueryState(r.targetId),n&&Cc(i.remoteStore,r.targetId),Ll(i,r.targetId)}).catch(Fs)):(Ll(i,r.targetId),await Dl(i.localStore,r.targetId,!0))}async function UE(t,e){const n=J(t),i=n.Fa.get(e),r=n.Ma.get(i.targetId);n.isPrimaryClient&&r.length===1&&(n.sharedClientState.removeLocalQueryTarget(i.targetId),Cc(n.remoteStore,i.targetId))}async function qE(t,e,n){const i=QE(t);try{const r=await function(o,l){const c=J(o),d=qe.now(),f=l.reduce((y,I)=>y.add(I.key),re());let m,p;return c.persistence.runTransaction("Locally write mutations","readwrite",y=>{let I=Un(),x=re();return c.cs.getEntries(y,f).next(A=>{I=A,I.forEach((R,C)=>{C.isValidDocument()||(x=x.add(R))})}).next(()=>c.localDocuments.getOverlayedDocuments(y,I)).next(A=>{m=A;const R=[];for(const C of l){const L=u_(C,m.get(C.key).overlayedDocument);L!=null&&R.push(new wi(C.key,L,ip(L.value.mapValue),vt.exists(!0)))}return c.mutationQueue.addMutationBatch(y,d,R,l)}).next(A=>{p=A;const R=A.applyToLocalDocumentSet(m,x);return c.documentOverlayCache.saveOverlays(y,A.batchId,R)})}).then(()=>({batchId:p.batchId,changes:fp(m)}))}(i.localStore,e);i.sharedClientState.addPendingMutation(r.batchId),function(o,l,c){let d=o.Ba[o.currentUser.toKey()];d||(d=new Ce(he)),d=d.insert(l,c),o.Ba[o.currentUser.toKey()]=d}(i,r.batchId,n),await qs(i,r.changes),await ba(i.remoteStore)}catch(r){const s=Nc(r,"Failed to persist write");n.reject(s)}}async function Gp(t,e){const n=J(t);try{const i=await rE(n.localStore,e);e.targetChanges.forEach((r,s)=>{const o=n.Na.get(s);o&&(me(r.addedDocuments.size+r.modifiedDocuments.size+r.removedDocuments.size<=1),r.addedDocuments.size>0?o.va=!0:r.modifiedDocuments.size>0?me(o.va):r.removedDocuments.size>0&&(me(o.va),o.va=!1))}),await qs(n,i,e)}catch(i){await Fs(i)}}function Eh(t,e,n){const i=J(t);if(i.isPrimaryClient&&n===0||!i.isPrimaryClient&&n===1){const r=[];i.Fa.forEach((s,o)=>{const l=o.view.Z_(e);l.snapshot&&r.push(l.snapshot)}),function(o,l){const c=J(o);c.onlineState=l;let d=!1;c.queries.forEach((f,m)=>{for(const p of m.j_)p.Z_(l)&&(d=!0)}),d&&Oc(c)}(i.eventManager,e),r.length&&i.Ca.d_(r),i.onlineState=e,i.isPrimaryClient&&i.sharedClientState.setOnlineState(e)}}async function HE(t,e,n){const i=J(t);i.sharedClientState.updateQueryState(e,"rejected",n);const r=i.Na.get(e),s=r&&r.key;if(s){let o=new Ce(W.comparator);o=o.insert(s,ot.newNoDocument(s,Q.min()));const l=re().add(s),c=new ga(Q.min(),new Map,new Ce(he),o,l);await Gp(i,c),i.Oa=i.Oa.remove(s),i.Na.delete(e),Fc(i)}else await Dl(i.localStore,e,!1).then(()=>Ll(i,e,n)).catch(Fs)}async function WE(t,e){const n=J(t),i=e.batch.batchId;try{const r=await iE(n.localStore,e);Qp(n,i,null),Kp(n,i),n.sharedClientState.updateMutationState(i,"acknowledged"),await qs(n,r)}catch(r){await Fs(r)}}async function YE(t,e,n){const i=J(t);try{const r=await function(o,l){const c=J(o);return c.persistence.runTransaction("Reject batch","readwrite-primary",d=>{let f;return c.mutationQueue.lookupMutationBatch(d,l).next(m=>(me(m!==null),f=m.keys(),c.mutationQueue.removeMutationBatch(d,m))).next(()=>c.mutationQueue.performConsistencyCheck(d)).next(()=>c.documentOverlayCache.removeOverlaysForBatchId(d,f,l)).next(()=>c.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(d,f)).next(()=>c.localDocuments.getDocuments(d,f))})}(i.localStore,e);Qp(i,e,n),Kp(i,e),i.sharedClientState.updateMutationState(e,"rejected",n),await qs(i,r)}catch(r){await Fs(r)}}function Kp(t,e){(t.ka.get(e)||[]).forEach(n=>{n.resolve()}),t.ka.delete(e)}function Qp(t,e,n){const i=J(t);let r=i.Ba[i.currentUser.toKey()];if(r){const s=r.get(e);s&&(n?s.reject(n):s.resolve(),r=r.remove(e)),i.Ba[i.currentUser.toKey()]=r}}function Ll(t,e,n=null){t.sharedClientState.removeLocalQueryTarget(e);for(const i of t.Ma.get(e))t.Fa.delete(i),n&&t.Ca.$a(i,n);t.Ma.delete(e),t.isPrimaryClient&&t.La.gr(e).forEach(i=>{t.La.containsKey(i)||Jp(t,i)})}function Jp(t,e){t.xa.delete(e.path.canonicalString());const n=t.Oa.get(e);n!==null&&(Cc(t.remoteStore,n),t.Oa=t.Oa.remove(e),t.Na.delete(n),Fc(t))}function Th(t,e,n){for(const i of n)i instanceof Wp?(t.La.addReference(i.key,e),jE(t,i)):i instanceof Yp?($("SyncEngine","Document no longer in limbo: "+i.key),t.La.removeReference(i.key,e),t.La.containsKey(i.key)||Jp(t,i.key)):G()}function jE(t,e){const n=e.key,i=n.path.canonicalString();t.Oa.get(n)||t.xa.has(i)||($("SyncEngine","New document in limbo: "+n),t.xa.add(i),Fc(t))}function Fc(t){for(;t.xa.size>0&&t.Oa.size<t.maxConcurrentLimboResolutions;){const e=t.xa.values().next().value;t.xa.delete(e);const n=new W(ke.fromString(e)),i=t.qa.next();t.Na.set(i,new NE(n)),t.Oa=t.Oa.insert(n,i),Np(t.remoteStore,new ci(un(Tc(n.path)),i,"TargetPurposeLimboResolution",yc.oe))}}async function qs(t,e,n){const i=J(t),r=[],s=[],o=[];i.Fa.isEmpty()||(i.Fa.forEach((l,c)=>{o.push(i.Ka(c,e,n).then(d=>{var f;if((d||n)&&i.isPrimaryClient){const m=d?!d.fromCache:(f=n==null?void 0:n.targetChanges.get(c.targetId))===null||f===void 0?void 0:f.current;i.sharedClientState.updateQueryState(c.targetId,m?"current":"not-current")}if(d){r.push(d);const m=Pc.Wi(c.targetId,d);s.push(m)}}))}),await Promise.all(o),i.Ca.d_(r),await async function(c,d){const f=J(c);try{await f.persistence.runTransaction("notifyLocalViewChanges","readwrite",m=>B.forEach(d,p=>B.forEach(p.$i,y=>f.persistence.referenceDelegate.addReference(m,p.targetId,y)).next(()=>B.forEach(p.Ui,y=>f.persistence.referenceDelegate.removeReference(m,p.targetId,y)))))}catch(m){if(!Vs(m))throw m;$("LocalStore","Failed to update sequence numbers: "+m)}for(const m of d){const p=m.targetId;if(!m.fromCache){const y=f.os.get(p),I=y.snapshotVersion,x=y.withLastLimboFreeSnapshotVersion(I);f.os=f.os.insert(p,x)}}}(i.localStore,s))}async function GE(t,e){const n=J(t);if(!n.currentUser.isEqual(e)){$("SyncEngine","User change. New user:",e.toKey());const i=await Mp(n.localStore,e);n.currentUser=e,function(s,o){s.ka.forEach(l=>{l.forEach(c=>{c.reject(new U(M.CANCELLED,o))})}),s.ka.clear()}(n,"'waitForPendingWrites' promise is rejected due to a user change."),n.sharedClientState.handleUserChange(e,i.removedBatchIds,i.addedBatchIds),await qs(n,i.hs)}}function KE(t,e){const n=J(t),i=n.Na.get(e);if(i&&i.va)return re().add(i.key);{let r=re();const s=n.Ma.get(e);if(!s)return r;for(const o of s){const l=n.Fa.get(o);r=r.unionWith(l.view.Va)}return r}}function Xp(t){const e=J(t);return e.remoteStore.remoteSyncer.applyRemoteEvent=Gp.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=KE.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=HE.bind(null,e),e.Ca.d_=ME.bind(null,e.eventManager),e.Ca.$a=DE.bind(null,e.eventManager),e}function QE(t){const e=J(t);return e.remoteStore.remoteSyncer.applySuccessfulWrite=WE.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=YE.bind(null,e),e}class Go{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=ya(e.databaseInfo.databaseId),this.sharedClientState=this.Wa(e),this.persistence=this.Ga(e),await this.persistence.start(),this.localStore=this.za(e),this.gcScheduler=this.ja(e,this.localStore),this.indexBackfillerScheduler=this.Ha(e,this.localStore)}ja(e,n){return null}Ha(e,n){return null}za(e){return nE(this.persistence,new eE,e.initialUser,this.serializer)}Ga(e){return new J_(Rc.Zr,this.serializer)}Wa(e){return new cE}async terminate(){var e,n;(e=this.gcScheduler)===null||e===void 0||e.stop(),(n=this.indexBackfillerScheduler)===null||n===void 0||n.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Go.provider={build:()=>new Go};class Nl{async initialize(e,n){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(n),this.remoteStore=this.createRemoteStore(n),this.eventManager=this.createEventManager(n),this.syncEngine=this.createSyncEngine(n,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=i=>Eh(this.syncEngine,i,1),this.remoteStore.remoteSyncer.handleCredentialChange=GE.bind(null,this.syncEngine),await RE(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new CE}()}createDatastore(e){const n=ya(e.databaseInfo.databaseId),i=function(s){return new fE(s)}(e.databaseInfo);return function(s,o,l,c){return new gE(s,o,l,c)}(e.authCredentials,e.appCheckCredentials,i,n)}createRemoteStore(e){return function(i,r,s,o,l){return new vE(i,r,s,o,l)}(this.localStore,this.datastore,e.asyncQueue,n=>Eh(this.syncEngine,n,0),function(){return yh.D()?new yh:new dE}())}createSyncEngine(e,n){return function(r,s,o,l,c,d,f){const m=new OE(r,s,o,l,c,d);return f&&(m.Qa=!0),m}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,n)}async terminate(){var e,n;await async function(r){const s=J(r);$("RemoteStore","RemoteStore shutting down."),s.L_.add(5),await Us(s),s.k_.shutdown(),s.q_.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(n=this.eventManager)===null||n===void 0||n.terminate()}}Nl.provider={build:()=>new Nl};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class Zp{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ya(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ya(this.observer.error,e):$n("Uncaught Error in snapshot listener:",e.toString()))}Za(){this.muted=!0}Ya(e,n){setTimeout(()=>{this.muted||e(n)},0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class JE{constructor(e,n,i,r,s){this.authCredentials=e,this.appCheckCredentials=n,this.asyncQueue=i,this.databaseInfo=r,this.user=st.UNAUTHENTICATED,this.clientId=ep.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=s,this.authCredentials.start(i,async o=>{$("FirestoreClient","Received user=",o.uid),await this.authCredentialListener(o),this.user=o}),this.appCheckCredentials.start(i,o=>($("FirestoreClient","Received new app check token=",o),this.appCheckCredentialListener(o,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new On;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(n){const i=Nc(n,"Failed to shutdown persistence");e.reject(i)}}),e.promise}}async function ll(t,e){t.asyncQueue.verifyOperationInProgress(),$("FirestoreClient","Initializing OfflineComponentProvider");const n=t.configuration;await e.initialize(n);let i=n.initialUser;t.setCredentialChangeListener(async r=>{i.isEqual(r)||(await Mp(e.localStore,r),i=r)}),e.persistence.setDatabaseDeletedListener(()=>t.terminate()),t._offlineComponents=e}async function Ih(t,e){t.asyncQueue.verifyOperationInProgress();const n=await XE(t);$("FirestoreClient","Initializing OnlineComponentProvider"),await e.initialize(n,t.configuration),t.setCredentialChangeListener(i=>vh(e.remoteStore,i)),t.setAppCheckTokenChangeListener((i,r)=>vh(e.remoteStore,r)),t._onlineComponents=e}async function XE(t){if(!t._offlineComponents)if(t._uninitializedComponentsProvider){$("FirestoreClient","Using user provided OfflineComponentProvider");try{await ll(t,t._uninitializedComponentsProvider._offline)}catch(e){const n=e;if(!function(r){return r.name==="FirebaseError"?r.code===M.FAILED_PRECONDITION||r.code===M.UNIMPLEMENTED:!(typeof DOMException<"u"&&r instanceof DOMException)||r.code===22||r.code===20||r.code===11}(n))throw n;br("Error using user provided cache. Falling back to memory cache: "+n),await ll(t,new Go)}}else $("FirestoreClient","Using default OfflineComponentProvider"),await ll(t,new Go);return t._offlineComponents}async function em(t){return t._onlineComponents||(t._uninitializedComponentsProvider?($("FirestoreClient","Using user provided OnlineComponentProvider"),await Ih(t,t._uninitializedComponentsProvider._online)):($("FirestoreClient","Using default OnlineComponentProvider"),await Ih(t,new Nl))),t._onlineComponents}function ZE(t){return em(t).then(e=>e.syncEngine)}async function tm(t){const e=await em(t),n=e.eventManager;return n.onListen=FE.bind(null,e.syncEngine),n.onUnlisten=$E.bind(null,e.syncEngine),n.onFirstRemoteStoreListen=VE.bind(null,e.syncEngine),n.onLastRemoteStoreUnlisten=UE.bind(null,e.syncEngine),n}function eT(t,e,n={}){const i=new On;return t.asyncQueue.enqueueAndForget(async()=>function(s,o,l,c,d){const f=new Zp({next:p=>{f.Za(),o.enqueueAndForget(()=>qp(s,m));const y=p.docs.has(l);!y&&p.fromCache?d.reject(new U(M.UNAVAILABLE,"Failed to get document because the client is offline.")):y&&p.fromCache&&c&&c.source==="server"?d.reject(new U(M.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):d.resolve(p)},error:p=>d.reject(p)}),m=new Hp(Tc(l.path),f,{includeMetadataChanges:!0,_a:!0});return Up(s,m)}(await tm(t),t.asyncQueue,e,n,i)),i.promise}function tT(t,e,n={}){const i=new On;return t.asyncQueue.enqueueAndForget(async()=>function(s,o,l,c,d){const f=new Zp({next:p=>{f.Za(),o.enqueueAndForget(()=>qp(s,m)),p.fromCache&&c.source==="server"?d.reject(new U(M.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):d.resolve(p)},error:p=>d.reject(p)}),m=new Hp(l,f,{includeMetadataChanges:!0,_a:!0});return Up(s,m)}(await tm(t),t.asyncQueue,e,n,i)),i.promise}/**
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
 */function nm(t){const e={};return t.timeoutSeconds!==void 0&&(e.timeoutSeconds=t.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xh=new Map;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function im(t,e,n){if(!n)throw new U(M.INVALID_ARGUMENT,`Function ${t}() cannot be called with an empty ${e}.`)}function nT(t,e,n,i){if(e===!0&&i===!0)throw new U(M.INVALID_ARGUMENT,`${t} and ${n} cannot be used together.`)}function Sh(t){if(!W.isDocumentKey(t))throw new U(M.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${t} has ${t.length}.`)}function Ah(t){if(W.isDocumentKey(t))throw new U(M.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${t} has ${t.length}.`)}function Vc(t){if(t===void 0)return"undefined";if(t===null)return"null";if(typeof t=="string")return t.length>20&&(t=`${t.substring(0,20)}...`),JSON.stringify(t);if(typeof t=="number"||typeof t=="boolean")return""+t;if(typeof t=="object"){if(t instanceof Array)return"an array";{const e=function(i){return i.constructor?i.constructor.name:null}(t);return e?`a custom ${e} object`:"an object"}}return typeof t=="function"?"a function":G()}function Ut(t,e){if("_delegate"in t&&(t=t._delegate),!(t instanceof e)){if(e.name===t.constructor.name)throw new U(M.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=Vc(t);throw new U(M.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${n}`)}}return t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kh{constructor(e){var n,i;if(e.host===void 0){if(e.ssl!==void 0)throw new U(M.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(n=e.ssl)===null||n===void 0||n;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new U(M.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}nT("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=nm((i=e.experimentalLongPollingOptions)!==null&&i!==void 0?i:{}),function(s){if(s.timeoutSeconds!==void 0){if(isNaN(s.timeoutSeconds))throw new U(M.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (must not be NaN)`);if(s.timeoutSeconds<5)throw new U(M.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (minimum allowed value is 5)`);if(s.timeoutSeconds>30)throw new U(M.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(i,r){return i.timeoutSeconds===r.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class wa{constructor(e,n,i,r){this._authCredentials=e,this._appCheckCredentials=n,this._databaseId=i,this._app=r,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new kh({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new U(M.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new U(M.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new kh(e),e.credentials!==void 0&&(this._authCredentials=function(i){if(!i)return new bw;switch(i.type){case"firstParty":return new Tw(i.sessionIndex||"0",i.iamToken||null,i.authTokenFactory||null);case"provider":return i.client;default:throw new U(M.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(n){const i=xh.get(n);i&&($("ComponentProvider","Removing Datastore"),xh.delete(n),i.terminate())}(this),Promise.resolve()}}function iT(t,e,n,i={}){var r;const s=(t=Ut(t,wa))._getSettings(),o=`${e}:${n}`;if(s.host!=="firestore.googleapis.com"&&s.host!==o&&br("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),t._setSettings(Object.assign(Object.assign({},s),{host:o,ssl:!1})),i.mockUserToken){let l,c;if(typeof i.mockUserToken=="string")l=i.mockUserToken,c=st.MOCK_USER;else{l=Ay(i.mockUserToken,(r=t._app)===null||r===void 0?void 0:r.options.projectId);const d=i.mockUserToken.sub||i.mockUserToken.user_id;if(!d)throw new U(M.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");c=new st(d)}t._authCredentials=new ww(new Zf(l,c))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _a{constructor(e,n,i){this.converter=n,this._query=i,this.type="query",this.firestore=e}withConverter(e){return new _a(this.firestore,e,this._query)}}class It{constructor(e,n,i){this.converter=n,this._key=i,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new pi(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new It(this.firestore,e,this._key)}}class pi extends _a{constructor(e,n,i){super(e,n,Tc(i)),this._path=i,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new It(this.firestore,null,new W(e))}withConverter(e){return new pi(this.firestore,e,this._path)}}function rT(t,e,...n){if(t=Be(t),im("collection","path",e),t instanceof wa){const i=ke.fromString(e,...n);return Ah(i),new pi(t,null,i)}{if(!(t instanceof It||t instanceof pi))throw new U(M.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const i=t._path.child(ke.fromString(e,...n));return Ah(i),new pi(t.firestore,null,i)}}function xr(t,e,...n){if(t=Be(t),arguments.length===1&&(e=ep.newId()),im("doc","path",e),t instanceof wa){const i=ke.fromString(e,...n);return Sh(i),new It(t,null,new W(i))}{if(!(t instanceof It||t instanceof pi))throw new U(M.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const i=t._path.child(ke.fromString(e,...n));return Sh(i),new It(t.firestore,t instanceof pi?t.converter:null,new W(i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rh{constructor(e=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new Bp(this,"async_queue_retry"),this.Vu=()=>{const i=al();i&&$("AsyncQueue","Visibility state changed to "+i.visibilityState),this.t_.jo()},this.mu=e;const n=al();n&&typeof n.addEventListener=="function"&&n.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.fu(),this.gu(e)}enterRestrictedMode(e){if(!this.Iu){this.Iu=!0,this.Au=e||!1;const n=al();n&&typeof n.removeEventListener=="function"&&n.removeEventListener("visibilitychange",this.Vu)}}enqueue(e){if(this.fu(),this.Iu)return new Promise(()=>{});const n=new On;return this.gu(()=>this.Iu&&this.Au?Promise.resolve():(e().then(n.resolve,n.reject),n.promise)).then(()=>n.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Pu.push(e),this.pu()))}async pu(){if(this.Pu.length!==0){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(e){if(!Vs(e))throw e;$("AsyncQueue","Operation failed with retryable error: "+e)}this.Pu.length>0&&this.t_.Go(()=>this.pu())}}gu(e){const n=this.mu.then(()=>(this.du=!0,e().catch(i=>{this.Eu=i,this.du=!1;const r=function(o){let l=o.message||"";return o.stack&&(l=o.stack.includes(o.message)?o.stack:o.message+`
`+o.stack),l}(i);throw $n("INTERNAL UNHANDLED ERROR: ",r),i}).then(i=>(this.du=!1,i))));return this.mu=n,n}enqueueAfterDelay(e,n,i){this.fu(),this.Ru.indexOf(e)>-1&&(n=0);const r=Lc.createAndSchedule(this,e,n,i,s=>this.yu(s));return this.Tu.push(r),r}fu(){this.Eu&&G()}verifyOperationInProgress(){}async wu(){let e;do e=this.mu,await e;while(e!==this.mu)}Su(e){for(const n of this.Tu)if(n.timerId===e)return!0;return!1}bu(e){return this.wu().then(()=>{this.Tu.sort((n,i)=>n.targetTimeMs-i.targetTimeMs);for(const n of this.Tu)if(n.skipDelay(),e!=="all"&&n.timerId===e)break;return this.wu()})}Du(e){this.Ru.push(e)}yu(e){const n=this.Tu.indexOf(e);this.Tu.splice(n,1)}}class _i extends wa{constructor(e,n,i,r){super(e,n,i,r),this.type="firestore",this._queue=new Rh,this._persistenceKey=(r==null?void 0:r.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Rh(e),this._firestoreClient=void 0,await e}}}function sT(t,e){const n=typeof t=="object"?t:cf(),i=typeof t=="string"?t:"(default)",r=rc(n,"firestore").getImmediate({identifier:i});if(!r._initialized){const s=xy("firestore");s&&iT(r,...s)}return r}function Ea(t){if(t._terminated)throw new U(M.FAILED_PRECONDITION,"The client has already been terminated.");return t._firestoreClient||oT(t),t._firestoreClient}function oT(t){var e,n,i;const r=t._freezeSettings(),s=function(l,c,d,f){return new Nw(l,c,d,f.host,f.ssl,f.experimentalForceLongPolling,f.experimentalAutoDetectLongPolling,nm(f.experimentalLongPollingOptions),f.useFetchStreams)}(t._databaseId,((e=t._app)===null||e===void 0?void 0:e.options.appId)||"",t._persistenceKey,r);t._componentsProvider||!((n=r.localCache)===null||n===void 0)&&n._offlineComponentProvider&&(!((i=r.localCache)===null||i===void 0)&&i._onlineComponentProvider)&&(t._componentsProvider={_offline:r.localCache._offlineComponentProvider,_online:r.localCache._onlineComponentProvider}),t._firestoreClient=new JE(t._authCredentials,t._appCheckCredentials,t._queue,s,t._componentsProvider&&function(l){const c=l==null?void 0:l._online.build();return{_offline:l==null?void 0:l._offline.build(c),_online:c}}(t._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sr{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Sr(Ze.fromBase64String(e))}catch(n){throw new U(M.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+n)}}static fromUint8Array(e){return new Sr(Ze.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hs{constructor(...e){for(let n=0;n<e.length;++n)if(e[n].length===0)throw new U(M.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Qe(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zc{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $c{constructor(e,n){if(!isFinite(e)||e<-90||e>90)throw new U(M.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(n)||n<-180||n>180)throw new U(M.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+n);this._lat=e,this._long=n}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return he(this._lat,e._lat)||he(this._long,e._long)}}/**
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
 */class Uc{constructor(e){this._values=(e||[]).map(n=>n)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(i,r){if(i.length!==r.length)return!1;for(let s=0;s<i.length;++s)if(i[s]!==r[s])return!1;return!0}(this._values,e._values)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const aT=/^__.*__$/;class lT{constructor(e,n,i){this.data=e,this.fieldMask=n,this.fieldTransforms=i}toMutation(e,n){return this.fieldMask!==null?new wi(e,this.data,this.fieldMask,n,this.fieldTransforms):new zs(e,this.data,n,this.fieldTransforms)}}class rm{constructor(e,n,i){this.data=e,this.fieldMask=n,this.fieldTransforms=i}toMutation(e,n){return new wi(e,this.data,this.fieldMask,n,this.fieldTransforms)}}function sm(t){switch(t){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw G()}}class qc{constructor(e,n,i,r,s,o){this.settings=e,this.databaseId=n,this.serializer=i,this.ignoreUndefinedProperties=r,s===void 0&&this.vu(),this.fieldTransforms=s||[],this.fieldMask=o||[]}get path(){return this.settings.path}get Cu(){return this.settings.Cu}Fu(e){return new qc(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Mu(e){var n;const i=(n=this.path)===null||n===void 0?void 0:n.child(e),r=this.Fu({path:i,xu:!1});return r.Ou(e),r}Nu(e){var n;const i=(n=this.path)===null||n===void 0?void 0:n.child(e),r=this.Fu({path:i,xu:!1});return r.vu(),r}Lu(e){return this.Fu({path:void 0,xu:!0})}Bu(e){return Ko(e,this.settings.methodName,this.settings.ku||!1,this.path,this.settings.qu)}contains(e){return this.fieldMask.find(n=>e.isPrefixOf(n))!==void 0||this.fieldTransforms.find(n=>e.isPrefixOf(n.field))!==void 0}vu(){if(this.path)for(let e=0;e<this.path.length;e++)this.Ou(this.path.get(e))}Ou(e){if(e.length===0)throw this.Bu("Document fields must not be empty");if(sm(this.Cu)&&aT.test(e))throw this.Bu('Document fields cannot begin and end with "__"')}}class cT{constructor(e,n,i){this.databaseId=e,this.ignoreUndefinedProperties=n,this.serializer=i||ya(e)}Qu(e,n,i,r=!1){return new qc({Cu:e,methodName:n,qu:i,path:Qe.emptyPath(),xu:!1,ku:r},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Ta(t){const e=t._freezeSettings(),n=ya(t._databaseId);return new cT(t._databaseId,!!e.ignoreUndefinedProperties,n)}function Hc(t,e,n,i,r,s={}){const o=t.Qu(s.merge||s.mergeFields?2:0,e,n,r);Wc("Data must be an object, but it was:",o,i);const l=lm(i,o);let c,d;if(s.merge)c=new Ct(o.fieldMask),d=o.fieldTransforms;else if(s.mergeFields){const f=[];for(const m of s.mergeFields){const p=Ol(e,m,n);if(!o.contains(p))throw new U(M.INVALID_ARGUMENT,`Field '${p}' is specified in your field mask but missing from your input data.`);dm(f,p)||f.push(p)}c=new Ct(f),d=o.fieldTransforms.filter(m=>c.covers(m.field))}else c=null,d=o.fieldTransforms;return new lT(new Et(l),c,d)}class Ia extends zc{_toFieldTransform(e){if(e.Cu!==2)throw e.Cu===1?e.Bu(`${this._methodName}() can only appear at the top level of your update data`):e.Bu(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof Ia}}function om(t,e,n,i){const r=t.Qu(1,e,n);Wc("Data must be an object, but it was:",r,i);const s=[],o=Et.empty();Ki(i,(c,d)=>{const f=Yc(e,c,n);d=Be(d);const m=r.Nu(f);if(d instanceof Ia)s.push(f);else{const p=xa(d,m);p!=null&&(s.push(f),o.set(f,p))}});const l=new Ct(s);return new rm(o,l,r.fieldTransforms)}function am(t,e,n,i,r,s){const o=t.Qu(1,e,n),l=[Ol(e,i,n)],c=[r];if(s.length%2!=0)throw new U(M.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let p=0;p<s.length;p+=2)l.push(Ol(e,s[p])),c.push(s[p+1]);const d=[],f=Et.empty();for(let p=l.length-1;p>=0;--p)if(!dm(d,l[p])){const y=l[p];let I=c[p];I=Be(I);const x=o.Nu(y);if(I instanceof Ia)d.push(y);else{const A=xa(I,x);A!=null&&(d.push(y),f.set(y,A))}}const m=new Ct(d);return new rm(f,m,o.fieldTransforms)}function xa(t,e){if(cm(t=Be(t)))return Wc("Unsupported field value:",e,t),lm(t,e);if(t instanceof zc)return function(i,r){if(!sm(r.Cu))throw r.Bu(`${i._methodName}() can only be used with update() and set()`);if(!r.path)throw r.Bu(`${i._methodName}() is not currently supported inside arrays`);const s=i._toFieldTransform(r);s&&r.fieldTransforms.push(s)}(t,e),null;if(t===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),t instanceof Array){if(e.settings.xu&&e.Cu!==4)throw e.Bu("Nested arrays are not supported");return function(i,r){const s=[];let o=0;for(const l of i){let c=xa(l,r.Lu(o));c==null&&(c={nullValue:"NULL_VALUE"}),s.push(c),o++}return{arrayValue:{values:s}}}(t,e)}return function(i,r){if((i=Be(i))===null)return{nullValue:"NULL_VALUE"};if(typeof i=="number")return s_(r.serializer,i);if(typeof i=="boolean")return{booleanValue:i};if(typeof i=="string")return{stringValue:i};if(i instanceof Date){const s=qe.fromDate(i);return{timestampValue:Yo(r.serializer,s)}}if(i instanceof qe){const s=new qe(i.seconds,1e3*Math.floor(i.nanoseconds/1e3));return{timestampValue:Yo(r.serializer,s)}}if(i instanceof $c)return{geoPointValue:{latitude:i.latitude,longitude:i.longitude}};if(i instanceof Sr)return{bytesValue:xp(r.serializer,i._byteString)};if(i instanceof It){const s=r.databaseId,o=i.firestore._databaseId;if(!o.isEqual(s))throw r.Bu(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${s.projectId}/${s.database}`);return{referenceValue:Ac(i.firestore._databaseId||r.databaseId,i._key.path)}}if(i instanceof Uc)return function(o,l){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:o.toArray().map(c=>{if(typeof c!="number")throw l.Bu("VectorValues must only contain numeric values.");return Ic(l.serializer,c)})}}}}}}(i,r);throw r.Bu(`Unsupported field value: ${Vc(i)}`)}(t,e)}function lm(t,e){const n={};return tp(t)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Ki(t,(i,r)=>{const s=xa(r,e.Mu(i));s!=null&&(n[i]=s)}),{mapValue:{fields:n}}}function cm(t){return!(typeof t!="object"||t===null||t instanceof Array||t instanceof Date||t instanceof qe||t instanceof $c||t instanceof Sr||t instanceof It||t instanceof zc||t instanceof Uc)}function Wc(t,e,n){if(!cm(n)||!function(r){return typeof r=="object"&&r!==null&&(Object.getPrototypeOf(r)===Object.prototype||Object.getPrototypeOf(r)===null)}(n)){const i=Vc(n);throw i==="an object"?e.Bu(t+" a custom object"):e.Bu(t+" "+i)}}function Ol(t,e,n){if((e=Be(e))instanceof Hs)return e._internalPath;if(typeof e=="string")return Yc(t,e);throw Ko("Field path arguments must be of type string or ",t,!1,void 0,n)}const dT=new RegExp("[~\\*/\\[\\]]");function Yc(t,e,n){if(e.search(dT)>=0)throw Ko(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,t,!1,void 0,n);try{return new Hs(...e.split("."))._internalPath}catch{throw Ko(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,t,!1,void 0,n)}}function Ko(t,e,n,i,r){const s=i&&!i.isEmpty(),o=r!==void 0;let l=`Function ${e}() called with invalid data`;n&&(l+=" (via `toFirestore()`)"),l+=". ";let c="";return(s||o)&&(c+=" (found",s&&(c+=` in field ${i}`),o&&(c+=` in document ${r}`),c+=")"),new U(M.INVALID_ARGUMENT,l+t+c)}function dm(t,e){return t.some(n=>n.isEqual(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class um{constructor(e,n,i,r,s){this._firestore=e,this._userDataWriter=n,this._key=i,this._document=r,this._converter=s}get id(){return this._key.path.lastSegment()}get ref(){return new It(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new uT(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const n=this._document.data.field(hm("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n)}}}class uT extends um{data(){return super.data()}}function hm(t,e){return typeof e=="string"?Yc(t,e):e instanceof Hs?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hT(t){if(t.limitType==="L"&&t.explicitOrderBy.length===0)throw new U(M.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class fT{convertValue(e,n="none"){switch(Yi(e)){case 0:return null;case 1:return e.booleanValue;case 2:return Le(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,n);case 5:return e.stringValue;case 6:return this.convertBytes(Wi(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,n);case 11:return this.convertObject(e.mapValue,n);case 10:return this.convertVectorValue(e.mapValue);default:throw G()}}convertObject(e,n){return this.convertObjectMap(e.fields,n)}convertObjectMap(e,n="none"){const i={};return Ki(e,(r,s)=>{i[r]=this.convertValue(s,n)}),i}convertVectorValue(e){var n,i,r;const s=(r=(i=(n=e.fields)===null||n===void 0?void 0:n.value.arrayValue)===null||i===void 0?void 0:i.values)===null||r===void 0?void 0:r.map(o=>Le(o.doubleValue));return new Uc(s)}convertGeoPoint(e){return new $c(Le(e.latitude),Le(e.longitude))}convertArray(e,n){return(e.values||[]).map(i=>this.convertValue(i,n))}convertServerTimestamp(e,n){switch(n){case"previous":const i=bc(e);return i==null?null:this.convertValue(i,n);case"estimate":return this.convertTimestamp(vs(e));default:return null}}convertTimestamp(e){const n=yi(e);return new qe(n.seconds,n.nanos)}convertDocumentKey(e,n){const i=ke.fromString(e);me(Cp(i));const r=new bs(i.get(1),i.get(3)),s=new W(i.popFirst(5));return r.isEqual(n)||$n(`Document ${s} contains a document reference within a different database (${r.projectId}/${r.database}) which is not supported. It will be treated as a reference in the current database (${n.projectId}/${n.database}) instead.`),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jc(t,e,n){let i;return i=t?n&&(n.merge||n.mergeFields)?t.toFirestore(e,n):t.toFirestore(e):e,i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rs{constructor(e,n){this.hasPendingWrites=e,this.fromCache=n}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class fm extends um{constructor(e,n,i,r,s,o){super(e,n,i,r,o),this._firestore=e,this._firestoreImpl=e,this.metadata=s}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const n=new Ao(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(n,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,n={}){if(this._document){const i=this._document.data.field(hm("DocumentSnapshot.get",e));if(i!==null)return this._userDataWriter.convertValue(i,n.serverTimestamps)}}}class Ao extends fm{data(e={}){return super.data(e)}}class pT{constructor(e,n,i,r){this._firestore=e,this._userDataWriter=n,this._snapshot=r,this.metadata=new rs(r.hasPendingWrites,r.fromCache),this.query=i}get docs(){const e=[];return this.forEach(n=>e.push(n)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,n){this._snapshot.docs.forEach(i=>{e.call(n,new Ao(this._firestore,this._userDataWriter,i.key,i,new rs(this._snapshot.mutatedKeys.has(i.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const n=!!e.includeMetadataChanges;if(n&&this._snapshot.excludesMetadataChanges)throw new U(M.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===n||(this._cachedChanges=function(r,s){if(r._snapshot.oldDocs.isEmpty()){let o=0;return r._snapshot.docChanges.map(l=>{const c=new Ao(r._firestore,r._userDataWriter,l.doc.key,l.doc,new rs(r._snapshot.mutatedKeys.has(l.doc.key),r._snapshot.fromCache),r.query.converter);return l.doc,{type:"added",doc:c,oldIndex:-1,newIndex:o++}})}{let o=r._snapshot.oldDocs;return r._snapshot.docChanges.filter(l=>s||l.type!==3).map(l=>{const c=new Ao(r._firestore,r._userDataWriter,l.doc.key,l.doc,new rs(r._snapshot.mutatedKeys.has(l.doc.key),r._snapshot.fromCache),r.query.converter);let d=-1,f=-1;return l.type!==0&&(d=o.indexOf(l.doc.key),o=o.delete(l.doc.key)),l.type!==1&&(o=o.add(l.doc),f=o.indexOf(l.doc.key)),{type:mT(l.type),doc:c,oldIndex:d,newIndex:f}})}}(this,n),this._cachedChangesIncludeMetadataChanges=n),this._cachedChanges}}function mT(t){switch(t){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return G()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gT(t){t=Ut(t,It);const e=Ut(t.firestore,_i);return eT(Ea(e),t._key).then(n=>ET(e,t,n))}class pm extends fT{constructor(e){super(),this.firestore=e}convertBytes(e){return new Sr(e)}convertReference(e){const n=this.convertDocumentKey(e,this.firestore._databaseId);return new It(this.firestore,null,n)}}function yT(t){t=Ut(t,_a);const e=Ut(t.firestore,_i),n=Ea(e),i=new pm(e);return hT(t._query),tT(n,t._query).then(r=>new pT(e,i,t,r))}function vT(t,e,n){t=Ut(t,It);const i=Ut(t.firestore,_i),r=jc(t.converter,e,n);return Ws(i,[Hc(Ta(i),"setDoc",t._key,r,t.converter!==null,n).toMutation(t._key,vt.none())])}function bT(t,e,n,...i){t=Ut(t,It);const r=Ut(t.firestore,_i),s=Ta(r);let o;return o=typeof(e=Be(e))=="string"||e instanceof Hs?am(s,"updateDoc",t._key,e,n,i):om(s,"updateDoc",t._key,e),Ws(r,[o.toMutation(t._key,vt.exists(!0))])}function wT(t){return Ws(Ut(t.firestore,_i),[new ma(t._key,vt.none())])}function _T(t,e){const n=Ut(t.firestore,_i),i=xr(t),r=jc(t.converter,e);return Ws(n,[Hc(Ta(t.firestore),"addDoc",i._key,r,t.converter!==null,{}).toMutation(i._key,vt.exists(!1))]).then(()=>i)}function Ws(t,e){return function(i,r){const s=new On;return i.asyncQueue.enqueueAndForget(async()=>qE(await ZE(i),r,s)),s.promise}(Ea(t),e)}function ET(t,e,n){const i=n.docs.get(e._key),r=new pm(t);return new fm(t,r,e._key,i,new rs(n.hasPendingWrites,n.fromCache),e.converter)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class TT{constructor(e,n){this._firestore=e,this._commitHandler=n,this._mutations=[],this._committed=!1,this._dataReader=Ta(e)}set(e,n,i){this._verifyNotCommitted();const r=cl(e,this._firestore),s=jc(r.converter,n,i),o=Hc(this._dataReader,"WriteBatch.set",r._key,s,r.converter!==null,i);return this._mutations.push(o.toMutation(r._key,vt.none())),this}update(e,n,i,...r){this._verifyNotCommitted();const s=cl(e,this._firestore);let o;return o=typeof(n=Be(n))=="string"||n instanceof Hs?am(this._dataReader,"WriteBatch.update",s._key,n,i,r):om(this._dataReader,"WriteBatch.update",s._key,n),this._mutations.push(o.toMutation(s._key,vt.exists(!0))),this}delete(e){this._verifyNotCommitted();const n=cl(e,this._firestore);return this._mutations=this._mutations.concat(new ma(n._key,vt.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new U(M.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function cl(t,e){if((t=Be(t)).firestore!==e)throw new U(M.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mm(t){return Ea(t=Ut(t,_i)),new TT(t,e=>Ws(t,e))}(function(e,n=!0){(function(r){Cr=r})(Rr),yr(new $i("firestore",(i,{instanceIdentifier:r,options:s})=>{const o=i.getProvider("app").getImmediate(),l=new _i(new _w(i.getProvider("auth-internal")),new xw(i.getProvider("app-check-internal")),function(d,f){if(!Object.prototype.hasOwnProperty.apply(d.options,["projectId"]))throw new U(M.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new bs(d.options.projectId,f)}(o,r),o);return s=Object.assign({useFetchStreams:n},s),l._setSettings(s),l},"PUBLIC").setMultipleInstances(!0)),fi(Gu,"4.7.3",e),fi(Gu,"4.7.3","esm2017")})();const gm={apiKey:"AIzaSyBdbve0H70D-Ch69WlaxEly7PVBFVRB5p0",authDomain:"pensiontools-4b237.firebaseapp.com",projectId:"pensiontools-4b237",storageBucket:"pensiontools-4b237.firebasestorage.app",messagingSenderId:"760877353696",appId:"1:760877353696:web:2d6f7173c8d7fab6fd9e85"};function Ne(){return gm.apiKey!=="YOUR_API_KEY"}let dl=null,ct=null,Tt=null;try{Ne()?(dl=lf(gm),ct=yw(dl),Tt=sT(dl)):console.warn("Firebase not configured. Login required to save data.")}catch(t){console.error("Firebase initialization error:",t)}const IT=new Rn;let at=null,hs=[];function xT(){if(!Ne()||!ct){console.warn("Firebase not configured - auth disabled");return}rb(ct,t=>{console.log("onAuthStateChanged fired:",t?t.email:"null"),at=t,console.log("Notifying",hs.length,"listeners"),hs.forEach(e=>e(t))})}function ST(t){return console.log("onAuthStateChange: adding listener, currentUser is:",at&&at.email),hs.push(t),at&&(console.log("onAuthStateChange: immediately calling listener with user"),t(at)),()=>{hs=hs.filter(e=>e!==t)}}function Ji(){return at}function dt(){return at!==null}async function AT(t,e,n=null){if(!Ne()||!ct)throw new Error("Firebase not configured");const i=await X0(ct,t,e);n&&i.user&&await tb(i.user,{displayName:n});try{await Lf(i.user)}catch(r){console.error("Failed to send verification email:",r)}return i}async function kT(){if(!Ne()||!ct||!at)throw new Error("Not logged in");return Lf(at)}async function RT(){return at?(await at.reload(),at=ct.currentUser,at):null}async function PT(t,e){if(!Ne()||!ct)throw new Error("Firebase not configured");return Z0(ct,t,e)}async function CT(){if(!Ne()||!ct)throw new Error("Firebase not configured");console.log("Initiating Google sign-in popup...");try{const t=await Sb(ct,IT);return console.log("Google sign-in successful:",t.user.email),t}catch(t){throw console.error("signInWithPopup error:",t.code,t.message),t}}async function Gc(){if(!Ne()||!ct)throw new Error("Firebase not configured");return sb(ct)}async function MT(t){if(!Ne()||!ct)throw new Error("Firebase not configured");return J0(ct,t)}async function DT(){if(!Ne()||!ct||!at)throw new Error("Not logged in");return ob(at)}xT();function ir(...t){return t.find(e=>e!==void 0)}function BT(t){if(!t||typeof t!="object")return{scenario:t,migrated:!1};const e=Object.keys(t).filter(c=>c.includes(".")),n="decisionSettings"in t||"stressSettings"in t||"name"in t||"description"in t||"taxYears"in t;if(!(e.length>0||n))return{scenario:t,migrated:!1};const r=t.decisionTool||{},s=t.stressTool||{},o=t.planDetails||{},l={isActive:t.isActive??!1,enabledTools:t.enabledTools||["stress","decision"],planDetails:{name:ir(t["planDetails.name"],o.name,t.name)??"My Plan",description:ir(t["planDetails.description"],o.description,t.description)??""},decisionTool:{settings:ir(t["decisionTool.settings"],r.settings,t.decisionSettings)??{},history:ir(t["decisionTool.history"],r.history)??[],taxYears:ir(t["decisionTool.taxYears"],r.taxYears,t.taxYears)??{}},stressTool:{settings:ir(t["stressTool.settings"],s.settings,t.stressSettings)??{}}};return t.id!==void 0&&(l.id=t.id),t.createdAt!==void 0&&(l.createdAt=t.createdAt),t.lastModified!==void 0&&(l.lastModified=t.lastModified),{scenario:l,migrated:!0}}function Kc(t,e="settings"){const n=Ji();return!n||!Tt?null:xr(Tt,"users",n.uid,t,e)}function ym(t){const e=Ji();return!e||!Tt?null:rT(Tt,"users",e.uid,t)}async function vm(t){const{scenario:e,migrated:n}=BT(t);if(n){const i=Ji();if(i&&Tt)try{const{id:r,...s}=e;await vT(xr(Tt,"users",i.uid,"scenarios",r),s)}catch(r){console.error("Scenario migration write failed:",r)}}return e}async function Sa(){if(!Ne())return[];const t=ym("scenarios");if(!t)return[];try{const e=await yT(t),n=[];return e.forEach(i=>{n.push({id:i.id,...i.data()})}),Promise.all(n.map(i=>vm(i)))}catch(e){return console.error("Error loading scenarios:",e),[]}}async function LT(t){if(!Ne())return null;const e=Kc("scenarios",t);if(!e)return null;try{const n=await gT(e);return n.exists()?vm({id:n.id,...n.data()}):null}catch(n){return console.error("Error loading scenario:",n),null}}async function Ei(t,e){if(!Ne())return;const n=Kc("scenarios",t);if(n)try{await bT(n,{...e,lastModified:new Date().toISOString()})}catch(i){throw console.error("Error saving scenario:",i),i}}async function bm(t){if(!Ne())return null;const e=ym("scenarios");if(!e)return null;try{return(await _T(e,{...t,createdAt:new Date().toISOString(),lastModified:new Date().toISOString()})).id}catch(n){throw console.error("Error creating scenario:",n),n}}async function NT(t){if(!Ne())return;const e=Kc("scenarios",t);if(e)try{await wT(e)}catch(n){throw console.error("Error deleting scenario:",n),n}}async function Qc(t){if(!Ne())return;const e=Ji();if(!(!e||!Tt))try{const n=await Sa(),i=mm(Tt);for(const r of n){const s=xr(Tt,"users",e.uid,"scenarios",r.id);r.id===t?i.update(s,{isActive:!0}):r.isActive&&i.update(s,{isActive:!1})}await i.commit()}catch(n){throw console.error("Error setting active scenario:",n),n}}async function wm(){if(!Ne())return;const t=Ji();if(!(!t||!Tt))try{const e=await Sa(),n=mm(Tt);for(const i of e)n.delete(xr(Tt,"users",t.uid,"scenarios",i.id));n.delete(xr(Tt,"users",t.uid,"profile","settings")),await n.commit(),console.log("All user data wiped successfully")}catch(e){throw console.error("Error wiping user data:",e),e}}async function OT(){return Ne()?(await Sa()).length>0:!1}const _m={single:{minimum:14400,moderate:31300,comfortable:43100}},Fl={essential:[{label:"Rent / mortgage",period:"mo",hint:"Your regular housing payment"},{label:"Council tax",period:"mo",hint:""},{label:"Gas",period:"mo",hint:""},{label:"Electricity",period:"mo",hint:""},{label:"Water",period:"mo",hint:""},{label:"Broadband",period:"mo",hint:"Broadband tariff"},{label:"Mobile phones",period:"mo",hint:"Mobile phone tariffs"},{label:"TV licence",period:"yr",hint:""},{label:"Groceries & household",period:"mo",hint:"Food and everyday household items"},{label:"Home insurance",period:"yr",hint:"Buildings & contents"},{label:"Car insurance",period:"yr",hint:""},{label:"Car tax",period:"yr",hint:"DVLA vehicle tax"},{label:"Petrol / fuel",period:"mo",hint:""},{label:"Car servicing & maintenance",period:"yr",hint:"Servicing, MOT, repairs — a big replacement is a One-off cost"},{label:"Boiler service",period:"yr",hint:""},{label:"Personal health",period:"mo",hint:"Prescriptions, dental, optical, health cover"},{label:"Kids / dependents",period:"mo",hint:"Supporting children or other dependents"},{label:"Premier banking / account fees",period:"mo",hint:"Packaged or premier account fees"},{label:"Home upkeep",period:"mo",hint:"Routine maintenance & small repairs — big jobs go in One-off costs"}],discretionary:[{label:"Main holiday",period:"yr",hint:"Your big annual holiday"},{label:"UK breaks",period:"yr",hint:"Weekends & short breaks"},{label:"Day trips",period:"mo",hint:""},{label:"Eating out & takeaways",period:"mo",hint:""},{label:"Streaming & entertainment",period:"mo",hint:"Netflix, Amazon Prime, etc."},{label:"Digital subscriptions",period:"mo",hint:"Cloud storage, AI tools, credit-file, TradingView, broker subscriptions"},{label:"Gym & fitness",period:"mo",hint:"Membership & classes"},{label:"Sports & equipment",period:"yr",hint:"Kit and gear"},{label:"Clothes",period:"mo",hint:"Everyday clothing"},{label:"Sports clothes",period:"yr",hint:""},{label:"Hobbies & leisure",period:"mo",hint:""},{label:"Gifts & family",period:"mo",hint:"Presents, helping family"},{label:"Charity",period:"mo",hint:""},{label:"Pets",period:"mo",hint:"Food, insurance, vet (pet health)"},{label:"Personal spending money",period:"mo",hint:"Day-to-day 'spends'"},{label:"Home furnishings & décor",period:"yr",hint:"Soft furnishings, decorating, furniture refresh"},{label:"Home technology",period:"yr",hint:"Phones, laptops, gadgets"},{label:"Emergency buffer",period:"mo",hint:"A monthly set-aside for the unexpected"}]},FT=[{label:"Eating out & takeaways",tier:"discretionary",period:"mo",hint:"Meals out, takeaways, coffees"},{label:"Life insurance / income protection",tier:"essential",period:"mo",hint:"Protection premiums"},{label:"Health / dental insurance",tier:"essential",period:"mo",hint:"Private medical, dental plan, cash plan"},{label:"Dental & optical",tier:"essential",period:"yr",hint:"Check-ups, glasses, treatment not on the NHS"},{label:"Hearing",tier:"essential",period:"yr",hint:"Hearing tests & aids"},{label:"Breakdown cover",tier:"essential",period:"yr",hint:"AA / RAC vehicle breakdown"},{label:"Parking & permits",tier:"essential",period:"yr",hint:"Residents permit, ULEZ / congestion"},{label:"Public transport",tier:"essential",period:"mo",hint:"Bus, rail, rail card"},{label:"Cleaner / gardener",tier:"essential",period:"mo",hint:"Cleaner, window cleaner, gardener"},{label:"Long-term care set-aside",tier:"essential",period:"mo",hint:"A monthly reserve toward possible later-life care (easily forgotten)"},{label:"Christmas & birthdays",tier:"discretionary",period:"yr",hint:"Seasonal gifts & celebrations"},{label:"Alcohol",tier:"discretionary",period:"mo",hint:"Beer, wine, spirits"},{label:"Hairdressing & grooming",tier:"discretionary",period:"mo",hint:"Haircuts, beauty, barber"},{label:"Newspapers, books & media",tier:"discretionary",period:"mo",hint:"Papers, magazines, books"},{label:"Grandchildren",tier:"discretionary",period:"mo",hint:"Treats, days out, help with costs"},{label:"Professional memberships",tier:"discretionary",period:"yr",hint:"Institutes, unions, clubs"},{label:"Second / holiday home",tier:"discretionary",period:"mo",hint:"Running costs of a second property"},{label:"Storage / lock-up",tier:"discretionary",period:"mo",hint:"Self-storage, garage rental"},{label:"My personal spending",tier:"discretionary",period:"mo",hint:"Your own day-to-day 'spends'",paidBy:"me"},{label:"Partner's personal spending",tier:"discretionary",period:"mo",hint:"Your partner's day-to-day 'spends'",paidBy:"partner"}];function Ts(t){const e=new Set((t.lines||[]).map(s=>(s.label||"").trim().toLowerCase()).filter(Boolean)),n=[...Fl.essential.map(s=>({...s,tier:"essential"})),...Fl.discretionary.map(s=>({...s,tier:"discretionary"}))],i=new Set,r=[];for(const s of[...FT,...n]){const o=s.label.trim().toLowerCase();e.has(o)||i.has(o)||(i.add(o),r.push(s))}return r}const VT=[{label:"New car",tier:"essential",hint:"Replacement vehicle",everyYears:8},{label:"Redecorating",tier:"essential",hint:"Whole-house repaint — a 4-bed runs ~£2,000–3,500 professionally, ~£300–600 DIY",everyYears:7},{label:"Major home work",tier:"essential",hint:"Kitchen, bathroom, roof, windows",everyYears:null},{label:"White goods",tier:"essential",hint:"Fridge, washer, cooker",everyYears:10}],zT={"Council tax":{s:97,c:165},Gas:{s:54,c:71},Electricity:{s:69,c:81},Water:{s:30,c:40},Broadband:{s:28,c:33},"Mobile phones":{s:15,c:30},"TV licence":{s:14,c:14},"Groceries & household":{s:180,c:320},"Home insurance":{s:20,c:28},"Car insurance":{s:26,c:37},"Car tax":{s:16,c:16},"Petrol / fuel":{s:38,c:82},"Car servicing & maintenance":{s:30,c:60},"Boiler service":{s:10,c:12},"Personal health":{s:15,c:40},"Home upkeep":{s:36,c:72},"Main holiday":{s:70,c:145},"UK breaks":{s:30,c:56},"Day trips":{s:20,c:30},"Eating out & takeaways":{s:40,c:110},"Streaming & entertainment":{s:15,c:20},"Digital subscriptions":{s:10,c:15},"Gym & fitness":{s:25,c:45},"Sports & equipment":{s:10,c:15},Clothes:{s:25,c:46},"Sports clothes":{s:5,c:8},"Hobbies & leisure":{s:20,c:30},"Gifts & family":{s:40,c:60},Charity:{s:10,c:15},Pets:{s:25,c:25},"Personal spending money":{s:30,c:50},"Home furnishings & décor":{s:30,c:50},"Home technology":{s:20,c:30},Alcohol:{s:18,c:53},"Hairdressing & grooming":{s:13,c:16},"Newspapers, books & media":{s:20,c:28},"Life insurance / income protection":{s:24,c:24},"Health / dental insurance":{s:10,c:17},"Dental & optical":{s:15,c:25},"Public transport":{s:29,c:55},"Christmas & birthdays":{s:30,c:50},"My personal spending":{s:30,c:30},"Partner's personal spending":{s:0,c:30}};function Br(t,e){const n=zT[(t||"").trim()];return n?e&&e.sharedWithPartner?n.c:n.s:null}function Em(){const t=e=>Fl[e].map(n=>({label:n.label,tier:e,annual:null,fromAge:null,toAge:null,hint:n.hint,period:n.period||"yr"}));return[...t("essential"),...t("discretionary")]}function Tm(){return VT.map(t=>({label:t.label,tier:t.tier,hint:t.hint,amount:null,atAge:null,everyYears:t.everyYears}))}const ko={pa:12570,brl:50270,hrl:125140},xt=t=>Number.isFinite(+t)?+t:0;function $T(t,e){const n=t.fromAge??e.retirementAge,i=t.toAge??e.endAge;return{from:xt(n),to:xt(i)}}function Im(t,e,n){const{from:i,to:r}=$T(t,e);return n>=i&&n<=r}function Vl(t,e,n="all"){return(t.lines||[]).filter(i=>n==="all"||i.tier===n).filter(i=>Im(i,t,e)).reduce((i,r)=>i+xt(r.annual),0)}function xm(t,e){if(!e||!e.sharedWithPartner)return 1;const n=t&&t.paidBy||"me";if(n==="partner")return 0;if(n==="shared"){const i=t&&t.mySharePct,r=i!=null&&i!==""&&Number.isFinite(+i)?+i:Number.isFinite(+e.mySharePct)?+e.mySharePct:50;return Math.max(0,Math.min(1,r/100))}return 1}function Ph(t,e,n="all"){return(t.lines||[]).filter(i=>n==="all"||i.tier===n).filter(i=>Im(i,t,e)).reduce((i,r)=>i+xt(r.annual)*xm(r,t),0)}function UT(t){return Vl(t,xt(t.retirementAge),"all")}function Sm(t,e=ko){const n=xt(t),{pa:i,brl:r,hrl:s}=e;if(n<=i)return n;const o=r-.2*(r-i);if(n<=o)return i+(n-i)/.8;const l=o+.6*(s-r);return n<=l?r+(n-o)/.6:s+(n-l)/.55}function Ch(t,e=!1){return(t.oneOffs||[]).reduce((n,i)=>{const r=xt(i.amount),s=xt(i.everyYears);return s>0&&r?n+r/s*(e?xm(i,t):1):n},0)}function Lr(t){const e=xt(t.retirementAge),n=Ph(t,e,"essential"),i=Ph(t,e,"all"),r=Ch(t,!0),s=i+r,o=UT(t)+Ch(t,!1),l=Math.max(0,o-s);return{partnerAllInAnnual:l,partnerAllInMonthly:l/12,essentialAnnualNet:n,comfortableAnnualNet:i,essentialMonthlyNet:n/12,comfortableMonthlyNet:i/12,periodicAnnualAverage:r,periodicMonthlyAverage:r/12,allInComfortableAnnual:s,allInComfortableMonthly:s/12,householdComfortableAnnual:o,householdComfortableMonthly:o/12,sharedWithPartner:!!t.sharedWithPartner,suggestedGrossAnnual:Sm(s)}}function Aa(t){if(t==null)return null;const e=String(t).trim().replace(/^=/,"").replace(/[×x]/gi,"*").replace(/,/g,"");if(!e||!/^[\d+\-*/().\s]+$/.test(e)||!/\d/.test(e))return null;try{const n=Function('"use strict"; return ('+e+");")();return Number.isFinite(n)?Math.round(n*100)/100:null}catch{return null}}function Am(t){return(t||[]).reduce((e,n)=>{const i=xt(n&&n.amount);return i?e+((n.period||"yr")==="mo"?i*12:i):e},0)}function km(t,e,n){const i=Br(t,n),r=xt(e);if(i==null||i<=0||r<=0)return null;const s=i*12;return r<=s*.35?"low":r>=s*3?"high":null}function Is(t=45,e=60,n=100){return{version:1,currentAge:xt(t),retirementAge:xt(e),endAge:xt(n),sharedWithPartner:!1,mySharePct:50,lines:[],oneOffs:[]}}let fr=null,Re=null;function Ti(){return Ne()&&dt()}function yn(){fr=null,Re=null}function Jc(){return{equityMin:ge.EQUITY_MIN,bondMin:ge.BOND_MIN,cashTarget:ge.CASH_TARGET,duration:ge.DURATION_YEARS,baseSalary:ge.BASE_SALARY,other:0,statePension:12e3,statePensionYear:12,pa:Ye.PERSONAL_ALLOWANCE,brl:Ye.BASIC_RATE_LIMIT,hrl:Ye.HIGHER_RATE_LIMIT,taxMode:"inflates",protectionMult:Oi.PROTECTION_MULTIPLIER,consecutiveLimit:ge.CONSECUTIVE_LIMIT,disableProtection:!1,hodlEnabled:Oi.HODL_ENABLED,hodlValue:Oi.HODL_VALUE,isaBalance:0,isaReturn:Qt.RETURN,isaMin:Qt.MIN,isaDrawdownStrategy:Qt.DRAWDOWN_STRATEGY}}function Rm(){return{equityMin:ge.EQUITY_MIN,bondMin:ge.BOND_MIN,cashTarget:ge.CASH_TARGET,duration:ge.DURATION_YEARS,baseSalary:ge.BASE_SALARY,protectionFactor:ge.PROTECTION_FACTOR,recoveryBuffer:ge.RECOVERY_BUFFER,consecutiveLimit:ge.CONSECUTIVE_LIMIT,spStartDate:null,spWeeklyAmount:0,statePension:0,statePensionYear:0,isaBalance:0,isaReturn:Qt.RETURN,isaMin:Qt.MIN,isaDrawdownStrategy:Qt.DRAWDOWN_STRATEGY}}function qT(t,e={},n=new Date().toISOString()){const i=t||{};return{...Jc(),...e,equityMin:i.equityMin,bondMin:i.bondMin,cashTarget:i.cashTarget,duration:i.duration,baseSalary:i.baseSalary,spStartDate:i.spStartDate??e.spStartDate??null,spWeeklyAmount:i.spWeeklyAmount??e.spWeeklyAmount??0,consecutiveLimit:i.consecutiveLimit,recoveryBuffer:i.recoveryBuffer,protectionMult:i.protectionFactor!=null?1-i.protectionFactor/100:e.protectionMult??Oi.PROTECTION_MULTIPLIER,isaBalance:i.isaBalance??0,isaReturn:i.isaReturn??Qt.RETURN,isaMin:i.isaMin??Qt.MIN,isaDrawdownStrategy:i.isaDrawdownStrategy??Qt.DRAWDOWN_STRATEGY,seededFrom:"decision",seededAt:n,decisionChecksum:ra(i)}}function Pm(){return{}}function Cm(){return Is()}function HT(t="My Plan",e="",n=["stress","decision"]){return{planDetails:{name:t,description:e},enabledTools:n,isActive:!0,decisionTool:{settings:Rm(),history:[],taxYears:Pm()},stressTool:{settings:Jc()},budgetTool:{settings:Cm()}}}async function Xc(){if(fr)return fr;if(!Ti())return[];try{const t=await Sa();return fr=t,t}catch(t){return console.error("Error listing scenarios:",t),[]}}async function Dt(){if(Re)return Re;if(!Ti())return null;try{const e=(await Xc()).find(n=>n.isActive);return e?(Re=e,e):null}catch(t){return console.error("Error getting active scenario:",t),null}}async function WT(t,e,n,i={},r=!0){if(!Ti())throw new Error("Must be logged in to create scenarios");const s=HT(t,e,n);if(i.stressSettings&&(s.stressTool.settings={...s.stressTool.settings,...i.stressSettings}),i.decisionSettings&&(s.decisionTool.settings={...s.decisionTool.settings,...i.decisionSettings}),i.taxYears&&(s.decisionTool.taxYears=i.taxYears),s.isActive=r,r&&fr){const l=fr.find(c=>c.isActive);l&&(await Qc(null),await Ei(l.id,{isActive:!1}))}const o=await bm(s);return yn(),o}async function YT(t){if(!Ti())throw new Error("Must be logged in to switch scenarios");await Qc(t),yn()}async function jT(t,e){if(!Ti())throw new Error("Must be logged in to duplicate scenarios");const n=await LT(t);if(!n)throw new Error("Source scenario not found");const{id:i,createdAt:r,lastModified:s,...o}=n;o.planDetails={...o.planDetails,name:e},o.isActive=!1;const l=await bm(o);return yn(),l}async function GT(t,e){if(!Ti())throw new Error("Must be logged in to rename scenarios");await Ei(t,{"planDetails.name":e}),yn()}async function KT(t,e){if(!Ti())throw new Error("Must be logged in to update scenarios");await Ei(t,{enabledTools:e}),yn()}async function QT(t){if(!Ti())throw new Error("Must be logged in to delete scenarios");const e=await Xc();if(e.length<=1)throw new Error("Cannot delete the last scenario");const n=e.find(i=>i.id===t);if(n!=null&&n.isActive){const i=e.find(r=>r.id!==t);i&&await Qc(i.id)}await NT(t),yn()}async function JT(){var e;const t=await Dt();return((e=t==null?void 0:t.stressTool)==null?void 0:e.settings)||Jc()}async function Mm(t){const e=await Dt();if(!e)throw new Error("No active scenario");await Ei(e.id,{"stressTool.settings":t}),Re&&(Re.stressTool||(Re.stressTool={}),Re.stressTool.settings=t)}async function XT(){var e;const t=await Dt();return((e=t==null?void 0:t.decisionTool)==null?void 0:e.settings)||Rm()}async function ZT(t){const e=await Dt();if(!e)throw new Error("No active scenario");await Ei(e.id,{"decisionTool.settings":t}),Re&&(Re.decisionTool||(Re.decisionTool={}),Re.decisionTool.settings=t)}async function eI(){var e;const t=await Dt();return((e=t==null?void 0:t.budgetTool)==null?void 0:e.settings)||Cm()}async function tI(t){const e=await Dt();if(!e)throw new Error("No active scenario");await Ei(e.id,{"budgetTool.settings":t}),Re&&(Re.budgetTool||(Re.budgetTool={}),Re.budgetTool.settings=t)}async function nI(){var e;const t=await Dt();return((e=t==null?void 0:t.decisionTool)==null?void 0:e.taxYears)||Pm()}async function iI(t){const e=await Dt();if(!e)throw new Error("No active scenario");await Ei(e.id,{"decisionTool.taxYears":t}),Re&&(Re.decisionTool||(Re.decisionTool={}),Re.decisionTool.taxYears=t)}async function rI(){var e;const t=await Dt();return((e=t==null?void 0:t.decisionTool)==null?void 0:e.history)||[]}async function Dm(t){const e=await Dt();if(!e)throw new Error("No active scenario");await Ei(e.id,{"decisionTool.history":t}),Re&&(Re.decisionTool||(Re.decisionTool={}),Re.decisionTool.history=t)}async function Bm(){const t=await Dt();return(t==null?void 0:t.enabledTools)||["stress","decision"]}let mi=null;function Ro(){return{settings:{equityMin:ge.EQUITY_MIN,bondMin:ge.BOND_MIN,cashTarget:ge.CASH_TARGET,duration:ge.DURATION_YEARS,equityGlideEnabled:!1,locked:!1,baseSalary:ge.BASE_SALARY,spendingProfile:"flat",protectionFactor:ge.PROTECTION_FACTOR,recoveryBuffer:ge.RECOVERY_BUFFER,consecutiveLimit:ge.CONSECUTIVE_LIMIT,startDate:null,spStartDate:null,spWeeklyAmount:0,statePension:0,statePensionYear:0},taxYears:{},history:[],lastModified:null,checksum:null}}function ka(){return Ne()&&dt()}function bi(){mi=null}function Lm(){return mi||Ro()}async function vn(){if(mi)return mi;if(!ka())return console.warn("Firebase not available - returning defaults"),Ro();try{const[t,e,n]=await Promise.all([XT(),nI(),rI()]),i={settings:t||Ro().settings,taxYears:e||{},history:n||[],lastModified:new Date().toISOString(),checksum:null};return i.checksum=Nm(i),mi=i,i}catch(t){console.error("Error loading decision data:",t)}return Ro()}async function Ra(t){if(!ka())throw new Error("Must be logged in to save data");try{t.lastModified=new Date().toISOString(),t.checksum=Nm(t),await Promise.all([ZT(t.settings),iI(t.taxYears)]),mi=t}catch(e){throw console.error("Error saving decision data:",e),new Error("Failed to save decision data")}}function Nm(t){const e={settings:t.settings,taxYears:t.taxYears,historyCount:t.history.length,lastHistoryDate:t.history.length>0?t.history[t.history.length-1].date:null};return ra(e)}function Om(t){if(!t)return"";const{locked:e,...n}=t;return ra(n)}async function bt(){return(await vn()).settings}async function Ys(t){const e=await vn();e.settings={...e.settings,...t},await Ra(e)}function Zc(){return{pa:Ye.PERSONAL_ALLOWANCE,brl:Ye.BASIC_RATE_LIMIT,hrl:Ye.HIGHER_RATE_LIMIT,cpi:.04,other:0,isaSavingsAllocation:0,isaSavingsUsed:0,isaContribution:0,isTaxEfficient:!0,taxEfficiencyChoice:null,grossIncomeToDate:0,startMonth:4,yearSetupComplete:!1,confirmedSalary:null}}function sI(t){const n=Lm().taxYears[t];return n||Zc()}async function Pa(t){const n=(await vn()).taxYears[t];return n||Zc()}async function Xi(t,e){console.log(`saveTaxYearConfig: Saving tax year ${t}`,e);const n=await vn();n.taxYears[t]={...sI(t),...e},await Ra(n),console.log(`saveTaxYearConfig: Saved tax year ${t}, yearSetupComplete=${n.taxYears[t].yearSetupComplete}`)}async function oI(t){const e=mi||await vn(),n=(e.history||[]).filter(r=>r.taxYear===t),i=n.reduce((r,s)=>r+(s.isa||0),0);return console.log(`recalculateIsaSavingsUsed: Tax year ${t}, found ${n.length} records, total ISA used: ${i}`),console.log("recalculateIsaSavingsUsed: History records:",n.map(r=>({date:r.date,isa:r.isa}))),e.taxYears[t]||(console.log(`recalculateIsaSavingsUsed: No existing config for ${t}, creating default`),e.taxYears[t]=Zc()),console.log(`recalculateIsaSavingsUsed: Before update, isaSavingsUsed=${e.taxYears[t].isaSavingsUsed}`),e.taxYears[t].isaSavingsUsed=i,console.log(`recalculateIsaSavingsUsed: After update, isaSavingsUsed=${e.taxYears[t].isaSavingsUsed}`),await Ra(e),console.log("recalculateIsaSavingsUsed: Saved to Firebase"),i}async function aI(t){const e=await Pa(t),n=e.yearSetupComplete===!0;return console.log(`isYearSetupComplete: Tax year ${t}, yearSetupComplete=${e.yearSetupComplete}, result=${n}`),n}async function Gn(){return(await vn()).taxYears}function lI(t={}){let n=[...Lm().history];return t.taxYear&&(n=n.filter(i=>i.taxYear===t.taxYear)),t.startDate&&(n=n.filter(i=>i.date>=t.startDate)),t.endDate&&(n=n.filter(i=>i.date<=t.endDate)),t.sortDesc?n.sort((i,r)=>r.date.localeCompare(i.date)):n.sort((i,r)=>i.date.localeCompare(r.date)),t.limit&&(n=n.slice(0,t.limit)),n}async function Zi(t={}){return await vn(),lI(t)}async function cI(t){if(!ka())throw new Error("Must be logged in to save history");const e=await vn(),n=e.history.findIndex(i=>i.date===t.date);n>=0?e.history[n]=t:e.history.push(t),e.history.sort((i,r)=>i.date.localeCompare(r.date)),await Dm(e.history)}async function Fm(t){if(!ka())throw new Error("Must be logged in to delete history");const e=await vn();e.history=e.history.filter(n=>n.date!==t),await Dm(e.history)}async function ed(t){const e=await bt(),n=await Gn(),i=e.spStartDate,r=e.spWeeklyAmount||0;if(!i||!r){let f=null;if(i){const{formatStatePensionDate:m}=await yu(async()=>{const{formatStatePensionDate:p}=await Promise.resolve().then(()=>Lh);return{formatStatePensionDate:p}},void 0,import.meta.url);f=m(i)}return{amount:0,monthly:0,yearsUntil:0,isReceiving:!1,isFirstYear:!1,startDate:f}}const{calculateStatePensionForTaxYear:s,getTimeUntilStatePension:o,parseStatePensionDate:l}=await yu(async()=>{const{calculateStatePensionForTaxYear:f,getTimeUntilStatePension:m,parseStatePensionDate:p}=await Promise.resolve().then(()=>Lh);return{calculateStatePensionForTaxYear:f,getTimeUntilStatePension:m,parseStatePensionDate:p}},void 0,import.meta.url),c=s({taxYear:t,spStartDate:i,weeklyAmount:r,taxYearConfigs:n}),d=o(i);return{amount:c.annual,monthly:c.monthly,yearsUntil:d.years,monthsUntil:d.months,isReceiving:c.isReceiving,isFirstYear:c.isFirstYear,weeksInYear:c.weeksInYear,startDate:c.startDate}}async function dI(t){const e=Xg(t);e.stdSipp=t.stdSipp||t.sippDraw;try{const n=await bt();e.settingsChecksum=Om(n)}catch(n){console.warn("Could not stamp settings checksum on decision:",n)}await cI(e),t.taxYear&&await oI(t.taxYear)}const zl={CONSECUTIVE_LIMIT:3,RECOVERY_BUFFER:1e4};function Vm({totalGrowth:t,minGrowth:e,consecCashDraws:n,wasInProtection:i,consecutiveLimit:r=zl.CONSECUTIVE_LIMIT,recoveryBuffer:s=zl.RECOVERY_BUFFER}){let o=!1;return i&&(o=t<=e+s),!o&&t<e&&n+1>=r&&(o=!0),o}const Qo={MAX_FRACTION:.5,MIN_BOOST:50,SURPLUS_BUFFER:15e3};function zm({shortfall:t,standardMonthly:e,remainingMonths:n,surplus:i,brlHeadroom:r=1/0,maxFraction:s=Qo.MAX_FRACTION,minBoost:o=Qo.MIN_BOOST}){if(!(t>0)||!(i>0)||n<1)return 0;const l=[t/n,i/n];if(Number.isFinite(r)){if(r<=0)return 0;l.push(r/n)}l.push(e*s);const c=Math.min(...l);return c>o?c:0}const xe=Object.freeze({SHARES:"shares",BONDS:"bonds",DIVERSIFIERS:"diversifiers",CASH:"cash"}),Xt=Object.freeze({ukEquityIncome:{bucket:xe.SHARES,label:"UK equity income",nominalReturn:.068,yield:.04,vol:.16,eqCorr:.9,duration:0,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:.07},globalEquityIncome:{bucket:xe.SHARES,label:"Global equity income",nominalReturn:.07,yield:.03,vol:.16,eqCorr:.95,duration:0,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:.05},worldGrowth:{bucket:xe.SHARES,label:"World growth / tracker",nominalReturn:.07,yield:.02,vol:.17,eqCorr:1,duration:0,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:0},shortGilts:{bucket:xe.BONDS,label:"Short gilts 0-5y (buffer)",nominalReturn:.043,yield:.043,vol:.026,eqCorr:.1,duration:2.5,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:.01},longGilts:{bucket:xe.BONDS,label:"Long gilts 15y+",nominalReturn:.064,yield:.055,vol:.108,eqCorr:.2,duration:15,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:.02},indexLinked:{bucket:xe.BONDS,label:"Index-linked gilts (long)",nominalReturn:.047,yieldReal:.023,vol:.1,eqCorr:.33,duration:15,inflationBeta:1,creditBeta:0,crisisBeta:0,idioVol:.03,realYield:!0},corporateIG:{bucket:xe.BONDS,label:"£ IG corporate",nominalReturn:.053,yield:.052,vol:.065,eqCorr:.41,duration:6.5,inflationBeta:0,creditBeta:.4,crisisBeta:0,idioVol:.03},globalAggHedged:{bucket:xe.BONDS,label:"Global-agg £-hedged",nominalReturn:.045,yield:.045,vol:.053,eqCorr:.3,duration:6,inflationBeta:0,creditBeta:.2,crisisBeta:0,idioVol:.02},usTreasHedged:{bucket:xe.BONDS,label:"US treasuries £-hedged",nominalReturn:.04,yield:.04,vol:.068,eqCorr:.1,duration:7,inflationBeta:0,creditBeta:0,crisisBeta:.15,idioVol:.02},infraDebt:{bucket:xe.BONDS,label:"Infrastructure debt",nominalReturn:.064,yield:.06,vol:.07,eqCorr:.3,duration:8,inflationBeta:.3,creditBeta:.3,crisisBeta:0,idioVol:.03,note:"IG + ~115bps illiquidity premium"},moneyMarket:{bucket:xe.CASH,label:"Money-market fund",nominalReturn:.034,yield:.034,vol:.002,eqCorr:0,duration:.1,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:0,note:"FCA -1% real; = engine cash model"},savings:{bucket:xe.CASH,label:"Savings / NS&I",nominalReturn:.034,yield:.034,vol:.001,eqCorr:0,duration:0,inflationBeta:0,creditBeta:0,crisisBeta:0,idioVol:0},gold:{bucket:xe.DIVERSIFIERS,label:"Gold",nominalReturn:.055,yield:0,vol:.155,eqCorr:.05,duration:0,inflationBeta:.3,creditBeta:0,crisisBeta:.5,idioVol:.14,note:"near-uncorrelated; rises when stocks AND bonds fall (2022)"},trendMacro:{bucket:xe.DIVERSIFIERS,label:"Trend / macro",nominalReturn:.045,yield:0,vol:.12,eqCorr:.07,duration:0,inflationBeta:0,creditBeta:0,crisisBeta:0,momentumBeta:.6,idioVol:.1,note:"lagged path-momentum; pays in prolonged 2008/2022, whipsaws in V-shaped 2020"}}),Ca=Object.freeze([{ticker:"VWRL",name:"Vanguard FTSE All-World (Dist)",subClass:"worldGrowth"},{ticker:"VWRP",name:"Vanguard FTSE All-World (Acc)",subClass:"worldGrowth"},{ticker:"VEVE",name:"Vanguard FTSE Developed World",subClass:"worldGrowth"},{ticker:"SWDA",name:"iShares Core MSCI World",subClass:"worldGrowth"},{ticker:"HMWO",name:"HSBC MSCI World",subClass:"worldGrowth"},{ticker:"VUSA",name:"Vanguard S&P 500",subClass:"worldGrowth"},{ticker:"PACW",name:"Amundi Prime All Country World",subClass:"worldGrowth"},{ticker:"CTY",name:"City of London Investment Trust",subClass:"ukEquityIncome"},{ticker:"LWDB",name:"Law Debenture Corporation",subClass:"ukEquityIncome"},{ticker:"FGT",name:"Finsbury Growth & Income Trust",subClass:"ukEquityIncome"},{ticker:"MRCH",name:"Merchants Trust",subClass:"ukEquityIncome"},{ticker:"ISF",name:"iShares Core FTSE 100",subClass:"ukEquityIncome"},{ticker:"VUKE",name:"Vanguard FTSE 100",subClass:"ukEquityIncome"},{ticker:"UKW",name:"Greencoat UK Wind",subClass:"ukEquityIncome"},{ticker:"HICL",name:"HICL Infrastructure",subClass:"ukEquityIncome"},{ticker:"TRIG",name:"The Renewables Infrastructure Group",subClass:"ukEquityIncome"},{ticker:"MYI",name:"Murray International Trust",subClass:"globalEquityIncome"},{ticker:"VHYL",name:"Vanguard FTSE All-World High Div Yld",subClass:"globalEquityIncome"},{ticker:"JGGI",name:"JPMorgan Global Growth & Income",subClass:"globalEquityIncome"},{ticker:"IGLS",name:"iShares UK Gilts 0-5yr",subClass:"shortGilts"},{ticker:"IGLT",name:"iShares Core UK Gilts",subClass:"longGilts"},{ticker:"VGOV",name:"Vanguard UK Gilt",subClass:"longGilts"},{ticker:"INXG",name:"iShares £ Index-Linked Gilts",subClass:"indexLinked"},{ticker:"TI5G",name:"iShares $ TIPS 0-5 (GBP Hedged)",subClass:"indexLinked"},{ticker:"SLXX",name:"iShares Core £ Corp Bond",subClass:"corporateIG"},{ticker:"VAGP",name:"Vanguard Global Aggregate Bond (GBP Hedged)",subClass:"globalAggHedged"},{ticker:"IBTM",name:"iShares $ Treasury Bond 7-10yr",subClass:"usTreasHedged"},{ticker:"SEQI",name:"Sequoia Economic Infrastructure",subClass:"infraDebt"},{ticker:"CSH2",name:"Amundi Smart Overnight Return",subClass:"moneyMarket"},{ticker:"ERNS",name:"iShares £ Ultrashort Bond",subClass:"moneyMarket"},{ticker:"SGLN",name:"iShares Physical Gold",subClass:"gold"},{ticker:"PHGP",name:"WisdomTree Physical Gold (GBP)",subClass:"gold"},{ticker:"BHMG",name:"BH Macro",subClass:"trendMacro"},{ticker:"CGT",name:"Capital Gearing Trust",subClass:"trendMacro"},{ticker:"PNL",name:"Personal Assets Trust",subClass:"trendMacro"},{ticker:"RICA",name:"Ruffer Investment Company",subClass:"trendMacro"}]),$m=Object.freeze(Object.fromEntries(Ca.map(t=>[t.ticker,t.subClass])));function td(t){const e=(t||"").toUpperCase().trim();return Ca.find(n=>n.ticker===e)||null}function uI(){const t={};for(const[e,n]of Object.entries(Xt))(t[n.bucket]=t[n.bucket]||[]).push({key:e,label:n.label});return t}const hI=.036,fI=.4,pI=.005,mI=.35,Um=.01,nd=-.15,qm=.045;function Mh(t,e=.1){let n=hI+fI*t;return e<nd&&t<qm&&(n-=Um),n}function Dh(t,e=.1){let n=pI+mI*(t-.025);return e<nd&&t<qm&&(n-=Um),n}function gI(t){return t.inf>.045?"inflation":t.eqReturn<nd?"crash":"normal"}const yI=Object.freeze({shortGilts:{normal:.05,inflation:.3,crash:-.2},longGilts:{normal:.1,inflation:.45,crash:-.35},indexLinked:{normal:.15,inflation:.35,crash:-.15},corporateIG:{normal:.35,inflation:.45,crash:.55},globalAggHedged:{normal:.25,inflation:.4,crash:.1},usTreasHedged:{normal:.05,inflation:.25,crash:-.4},infraDebt:{normal:.3,inflation:.35,crash:.35},gold:{normal:0,inflation:-.05,crash:-.2},trendMacro:{normal:.05,inflation:-.1,crash:-.3}});function id(t,e){const n=yI[t];if(!n)return 0;const i=n[gI(e)];return i??n.normal}const vI=new Map(Object.entries(Xt).map(([t,e])=>[e,t]));function rd(t,e,n,i){if(!t)return 0;const r=(n-.1)/.17,s=rr(0,1,i),o=e*r+Math.sqrt(Math.max(0,1-e*e))*s;return t*o}function bI(t,e,n){const{inf:i,prevInf:r,eqReturn:s,prevEqReturn:o=.1}=e,l=!!t.realYield,c=t.duration||0,d=l?Dh(i,s)-Dh(r,o):Mh(i,s)-Mh(r,o),f=l?(t.yieldReal||0)+i:t.yield||0,m=-c*d,p=l?0:(t.inflationBeta||0)*(i-.025),y=rd(t.idioVol||0,id(vI.get(t),e),s,n);return f+m+p+y}const wI=Object.freeze({shortGilts:.3,longGilts:.2,indexLinked:.2,corporateIG:.3});function _I(t,e,n=wI){let i=0;for(const r of Object.keys(n)){const s=n[r];if(!s)continue;const o=Xt[r];o&&(i+=s*bI(o,t,e))}return i}const EI=.048,TI=.045;function II(t,e){const{inf:n,eqReturn:i}=t,r=Xt.gold,s=(r.inflationBeta||0)*(n-.025),o=rd(r.idioVol||0,id("gold",t),i,e);return EI+s+o}function xI(t,e,n){const i=Xt.trendMacro,r=t.eqReturn-.05,s=(i.momentumBeta||0)*n*r,o=rd(i.idioVol||0,id("trendMacro",t),t.eqReturn,e);return TI+s+o}const Bh=.6,SI=.15;function AI(t,e){return Bh*t+(1-Bh)*e}function kI(t){return Math.max(-1,Math.min(1,t/SI))}const RI=Object.freeze({gold:.5,trendMacro:.5});function PI(t,e,n,i=RI){let r=0;return i.gold&&(r+=i.gold*II(t,e)),i.trendMacro&&(r+=i.trendMacro*xI(t,e,n)),r}const CI=-.01,MI=5;function Hm(t){return Math.max(0,t+CI)}function Ar(t,e,n=0){const i=tc(n);let r=t.equityStart,s=t.bondStart,o=t.cashStart,l=t.hodlEnabled?t.hodlStart!==void 0?t.hodlStart:t.hodlValue:0,c=0,d=t.diversifierStart||0,f=0,m=0,p=0,y=t.isaBalance||0,I=null;const x=t.isaBalance||0,A=Math.max(1e3,x*.05);let R=null,C=0,L=0;const N=new Array(t.years+1).fill(null),z=new Array(t.years+1).fill(null);let q=0,T=0,v=0,_=0,w=!1,E=!1,S=null,b=0,le=0,pe=-1;const H=[],ee=t.trace?[]:null,ne=[];let te=1;H.push({year:0,month:0,equity:r,bond:s,cash:o,hodl:l,total:r+s+o,draw:0,source:"None",inProtection:!1,equityMin:t.equityMin,bondMin:t.bondMin,cashMax:t.cashTarget});for(let se=0;se<t.years*12;se++){const ce=Math.floor(se/12),Te=se%12,Kn=ce;if(Kn!==pe&&(b=0,le=0,pe=Kn),se>0&&se%12===0){const ie=e.inflation[ce]||.025;ne.push(ie),te*=1+ie}const ut=ia(t.equityGlide,ce,t.duration);if(ut!=null&&Te===0){const ie=r+s;ie>0&&(r=ie*ut,s=ie*(1-ut))}d>0&&Te===0&&(ce>0&&(m=AI(m,e.equity[ce-1]||0)),p=kI(m));const ht=e.equity[ce]||0,en=e.inflation[ce]||.025,Nt=ce>0?e.inflation[ce-1]||.025:en;let et=Ln(t.equityMin,ce,t.duration,te,!0),ft=Ln(t.bondMin,ce,t.duration,te,!0);if(ut!=null){const ie=et+ft;et=ie*ut,ft=ie*(1-ut)}const bn=Ln(t.cashTarget,ce,t.duration,te,!1),wn=et+ft,tn=w;w=t.disableProtection?!1:Vm({totalGrowth:r+s,minGrowth:wn,consecCashDraws:_,wasInProtection:tn,consecutiveLimit:t.consecutiveLimit,recoveryBuffer:t.recoveryBuffer??zl.RECOVERY_BUFFER}),w?(q++,v++):(T=Math.max(T,v),v=0);const{sippMonthly:_n,isaMonthly:Ht,planInputs:wt,taxAnnual:Qn,higherRate:nn}=OI(t,ce,te,ne,y);Te===0&&(N[ce]=y/te,z[ce]=(r+s+o+d)/te),L+=Qn/12/te,nn&&C++;const Wt=_n,En=Wt;let _e=w?Wt*t.protectionMult:Wt,fe=_e;const rn=Ht,sn=ee?{month:se,year:ce,monthInYear:Te,cumInf:te,equityStart:r,bondStart:s,cashStart:o,isaStart:y,sippMonthly:_n,isaMonthly:Ht,effectiveSipp:_e,effectiveIsa:rn,boostAmount:0,inProtection:w,planInputs:wt}:null;sn&&ee.push(sn),w&&(b+=En-fe);const Jn=ce>0?e.equity[ce-1]||0:ht,Xs=t.subAsset?_I({inf:en,prevInf:Nt,eqReturn:ht,prevEqReturn:Jn},i,t.subAsset.bondWeights):DI(en,ht,Nt,i),Tn=Hm(Nt),In=ie=>Math.pow(1+(Number.isFinite(ie)?Math.max(-.99,ie):-.99),1/12);if(r*=In(ht),s*=In(Xs),o*=In(Tn),y=ay(y,t.isaReturn||Qt.RETURN),l>0){const Ot=(i()-.5)*2*.06;let Yt=0;ht<-.1?Yt=Math.min(.15,Math.abs(ht)*.4):ht<-.05&&(Yt=Math.abs(ht)*.2);let pt=.069+Ot+Yt;pt=Math.max(-.08,Math.min(.18,pt)),l*=In(pt)}if(d>0){const ie=PI({inf:en,eqReturn:ht},i,p,t.subAsset&&t.subAsset.diversifierWeights);d*=In(ie)}const on=r+s;let tt=0;if(!w){const ie=12-Te,Rt=le+En*ie+wt.fixed;tt=zm({shortfall:b,standardMonthly:En,remainingMonths:ie,surplus:on-wn-Qo.SURPLUS_BUFFER,brlHeadroom:wt.brl-Rt}),tt>50&&(fe+=tt,b-=tt)}le+=fe,sn&&(sn.effectiveSipp=fe,sn.boostAmount=tt>50?tt:0);let _t="Growth";if(!w&&on>=wn+fe){const ie=Math.max(0,r-et),Rt=Math.max(0,s-ft),Ot=ie+Rt;if(Ot>0){if(r-=fe*ie/Ot,s-=fe*Rt/Ot,_t="Growth",o<bn){const Yt=on-wn-fe;if(Yt>5e3){const pt=Math.min((bn-o)*.3,Yt*.5);r-=pt*ie/Ot,s-=pt*Rt/Ot,o+=pt}}}else o-=fe,_t="Cash"}else if(o>=fe)o-=fe,_t="Cash";else{const ie=fe-o;o=0,d>ie?(d-=ie,f+=ie,_t="Diversifier"):s>ie?(s-=ie,_t="Bond"):r>ie?(r-=ie,_t="Equity"):l>ie?(l-=ie,c+=ie,I===null&&(I=se),_t="HODL"):(E=!0,S=se)}if(_=_t==="Growth"?0:_+1,y=Math.max(0,y-Math.min(rn,y)),R===null&&x>0&&y/te<A&&(R=se),r=Math.max(0,r),s=Math.max(0,s),o=Math.max(0,o),d=Math.max(0,d),(Te===0||se===t.years*12-1||E)&&H.push({year:ce+Te/12,month:se,equity:r,bond:s,cash:o,hodl:l,diversifier:d,total:r+s+o+d,draw:fe,boostAmount:tt,source:_t,inProtection:w,equityMin:et,bondMin:ft,cashMax:bn}),E)break}if(T=Math.max(T,v),!E)N[t.years]=y/(te||1),z[t.years]=(r+s+o+d)/(te||1);else for(let se=Math.floor(S/12)+1;se<=t.years;se++)z[se]=0;let Me=0,Pe=0,ye=0,O=0,Z=1;for(let se=0;se<t.years;se++){const ce=e.inflation[se]??.025;Me+=ce,Z*=1+ce,Pe+=e.equity[se]??0,se<5&&(ye+=e.equity[se]??0,O++)}const we=r+s+o+d;return{failed:E,duration:t.years,years:E?S/12:t.years,failMonth:S,avgInflation:Me/t.years,avgEquityReturn:Pe/t.years,earlyEquityReturn:O?ye/O:0,cumInflation:Z,finalReal:we/Z,final:we,finalEquity:r,finalBond:s,finalCash:o,finalHodl:l,finalDiversifier:d,divUsed:f,protMonths:q,maxConsec:T,hodlUsed:c,hodlUsedMonth:I,startIsa:x,finalIsa:y,isaDepletedMonth:R,isaLastedYears:R===null?t.years:R/12,higherRateYears:C/12,totalTaxReal:L,isaByYear:N,potByYear:z,hist:H,trace:ee,seed:n}}function DI(t,e,n,i){let r=.15,s=.3,o=.2,l=.1,c=.1,d=.15;const f=n!==void 0?n:t,m=f>.045,p=f>.07;if(m){const q=i()>.3?1:.5;p?(r=.15+.35*q,s=.3-.2*q,d=.15-.1*q,l=.1+.05*q):(r=.15+.2*q,s=.3-.1*q,d=.15-.05*q)}m&&i()<.15&&(r=.2,s=.25,d=.12);const y=t+.005+rr(0,.03,i),I=.04-(t>.04?(t-.04)*.5:0)+rr(0,.05,i),x=.03+t*.3+rr(0,.08,i),A=t*.8+rr(0,.15,i),R=Hm(n),C=e*.5+rr(0,.02,i),L=r*y+s*I+o*x+l*A+c*R+d*C,N=BI(t,e),z=(e-.1)/.17;return L+N*z*.055}function BI(t,e){return t>.045?.4:e<-.15?-.3:.1}function LI(t,e){return Co(e,t.spendingProfile||"flat")}function NI(t,e){return t.spStartYear!==void 0?Math.max(0,t.spStartYear-e):t.statePensionYear!==void 0?Math.max(0,t.statePensionYear-e):0}function OI(t,e,n,i,r=0){const s=t.taxMode==="frozen"?t.pa:t.pa*n,o=t.taxMode==="frozen"?t.brl:t.brl*n,l=t.taxMode==="frozen"?t.hrl:(t.hrl||125140)*n,c=t.baseSalary*n*LI(t,e),d=oy(t.other,i);let f=0;if(t.spStartYear!==void 0){if(e>=t.spStartYear&&t.spWeeklyAmount>0){const I=t.spWeeklyAmount*52;e===t.spStartYear&&t.spFirstYearRatio!==void 0?f=I*t.spFirstYearRatio*n:f=I*n}}else t.statePensionYear!==void 0&&(f=e>=t.statePensionYear?(t.statePension||0)*n:0);const m=d+f,p=NI(t,e),y=ec({targetGross:c,fixedIncome:m,pa:s,brl:o,hrl:l,isaBalance:r,strategy:t.isaDrawdownStrategy||Qt.DRAWDOWN_STRATEGY,yearsUntilSp:p});return{sippMonthly:y.sippGross/12,isaMonthly:y.isaDraw/12,taxAnnual:y.tax,higherRate:y.taxable>o+1,planInputs:{target:c,other:d,statePension:f,fixed:m,pa:s,brl:o,hrl:l,yearsUntilSp:p}}}function Wm(t,e=1e3){const n=[];for(let i=0;i<e;i++)n.push(Ar(t,sd(t,i),i));return n}function sd(t,e){const n=Object.keys(zi).map(Number).sort((c,d)=>c-d),i=n.length,r=tc(e*12345),s={equity:{},inflation:{}},o=t.blockYears||MI;let l=0;for(;l<t.years;){const c=Math.floor(r()*i);for(let d=0;d<o&&l<t.years;d++,l++){const f=n[(c+d)%i];s.equity[l]=zi[f],s.inflation[l]=ta[f]||.025}}return s}function Ym(t){const e=Object.keys(zi).map(Number).sort((r,s)=>r-s),n=Math.max(...e),i=[];for(const r of e){if(r+t.years-1>n)continue;const s={equity:{},inflation:{}};for(let l=0;l<t.years;l++)s.equity[l]=zi[r+l]||0,s.inflation[l]=ta[r+l]||.025;const o=Ar(t,s,r);o.startYear=r,i.push(o)}return i}function FI(t,e){const n={equity:{},inflation:{}};for(let i=0;i<t.years;i++)n.equity[i]=e.equity[i%e.equity.length],n.inflation[i]=e.inflation[i%e.inflation.length];return Ar(t,n,999)}function VI(t){const e=t.filter(n=>n.failed).length;return(t.length-e)/t.length*100}function zI(t){if(!t||t.failCount===0)return"No shortfalls: every simulated future funded the whole plan.";const e=d=>(d*100).toFixed(1)+"%",n=Math.round(t.medianFailYear),i=t.duration,r=Math.round(t.pctNearMiss);let s;t.pctNearMiss>=60?s=`and when they do it's usually late — the typical shortfall is at year ${n} of ${i}, and ${r}% happen only in the final years, after funding almost the whole of retirement`:t.pctNearMiss<=30?s=`and they tend to come EARLY — the typical shortfall is at year ${n} of ${i}, with only ${r}% holding on to the final years. An early shortfall is the serious kind, with little retirement left to adjust`:s=`spread through retirement — the typical shortfall is at year ${n} of ${i}`;const o=[{mag:t.succEarlyEq-t.failEarlyEq,text:`a poor first few years of markets (sequence-of-returns risk): the futures that fell short averaged ${e(t.failEarlyEq)} equity in the opening 5 years versus ${e(t.succEarlyEq)} for those that lasted`},{mag:t.succAvgEq-t.failAvgEq,text:`weak markets across the whole plan: ${e(t.failAvgEq)} average equity return versus ${e(t.succAvgEq)} for those that lasted`},{mag:t.failAvgInf-t.succAvgInf,text:`higher inflation eroding spending power: ${e(t.failAvgInf)} a year versus ${e(t.succAvgInf)} for those that lasted`}].filter(d=>d.mag>.005).sort((d,f)=>f.mag-d.mag),l=`About ${Math.round(t.failRate||0)}% of futures fall short`;if(!o.length)return`${l}, ${s}. No single market driver stands out — the shortfalls come down to broadly bad luck across returns and inflation.`;let c=`The common thread is ${o[0].text}`;return o[1]&&o[1].mag>o[0].mag*.5&&(c+=`. A secondary factor is ${o[1].text}`),`${l}, ${s}. ${c}.`}function jm(t){const e=t.filter(l=>!l.failed),n=t.filter(l=>l.failed),i=t.map(l=>l.years).sort((l,c)=>l-c),r=e.map(l=>l.final).sort((l,c)=>l-c),s=t.map(l=>l.protMonths).sort((l,c)=>l-c),o=(l,c)=>l[Math.floor(l.length*c)]||0;return{total:t.length,successCount:e.length,failCount:n.length,successRate:VI(t),survival:{p5:o(i,.05),p10:o(i,.1),p25:o(i,.25),p50:o(i,.5),p75:o(i,.75),p90:o(i,.9),p95:o(i,.95),min:i[0],max:i[i.length-1]},finalValue:{p5:o(r,.05),p10:o(r,.1),p25:o(r,.25),p50:o(r,.5),p75:o(r,.75),p90:o(r,.9),p95:o(r,.95),min:r[0]||0,max:r[r.length-1]||0,avg:e.reduce((l,c)=>l+c.final,0)/(e.length||1)},minYears:i[0],p10Years:o(i,.1),medianYears:o(i,.5),medianFinal:o(r,.5),p10Final:o(r,.1),p90Final:o(r,.9),avgFinal:e.reduce((l,c)=>l+c.final,0)/(e.length||1),protection:{runsWithProtection:t.filter(l=>l.protMonths>0).length,pctWithProtection:t.filter(l=>l.protMonths>0).length/t.length*100,avgMonths:s.reduce((l,c)=>l+c,0)/t.length,maxMonths:Math.max(...s),maxConsecutive:Math.max(...t.map(l=>l.maxConsec)),avgConsecutive:t.reduce((l,c)=>l+c.maxConsec,0)/t.length,p50Months:o(s,.5),p90Months:o(s,.9),p95Months:o(s,.95)},runsWithProtection:t.filter(l=>l.protMonths>0).length,avgProtMonths:s.reduce((l,c)=>l+c,0)/t.length,maxProtMonths:Math.max(...s),maxConsecutive:Math.max(...t.map(l=>l.maxConsec)),avgConsecutive:t.reduce((l,c)=>l+c.maxConsec,0)/t.length,hodl:{runsUsingHodl:t.filter(l=>l.hodlUsed>0).length,pctUsingHodl:t.filter(l=>l.hodlUsed>0).length/t.length*100,avgUsed:t.filter(l=>l.hodlUsed>0).length>0?t.filter(l=>l.hodlUsed>0).reduce((l,c)=>l+c.hodlUsed,0)/t.filter(l=>l.hodlUsed>0).length:0,maxUsed:Math.max(...t.map(l=>l.hodlUsed||0))},runsUsingHodl:t.filter(l=>l.hodlUsed>0).length,avgHodlUsed:t.filter(l=>l.hodlUsed>0).length>0?t.filter(l=>l.hodlUsed>0).reduce((l,c)=>l+c.hodlUsed,0)/t.filter(l=>l.hodlUsed>0).length:0,maxHodlUsed:Math.max(...t.map(l=>l.hodlUsed||0)),severity:(()=>{const l=Math.max(...t.map(x=>x.duration||x.years),1),c=t.filter(x=>x.failed),d=t.filter(x=>!x.failed),f=c.map(x=>x.years).sort((x,A)=>x-A),m=l*.85,p=(x,A)=>x.length?x.reduce((R,C)=>R+(C[A]||0),0)/x.length:0,y={duration:l,coverage:t.reduce((x,A)=>x+Math.min(1,(A.years||0)/l),0)/t.length*100,failCount:c.length,failRate:t.length?c.length/t.length*100:0,medianFailYear:f.length?o(f,.5):0,pctNearMiss:c.length?c.filter(x=>x.years>=m).length/c.length*100:0,failEarlyEq:p(c,"earlyEquityReturn"),succEarlyEq:p(d,"earlyEquityReturn"),failAvgEq:p(c,"avgEquityReturn"),succAvgEq:p(d,"avgEquityReturn"),failAvgInf:p(c,"avgInflation"),succAvgInf:p(d,"avgInflation")};y.diagnosis=zI(y);const I=[{k:"sequence",m:y.succEarlyEq-y.failEarlyEq},{k:"market",m:y.succAvgEq-y.failAvgEq},{k:"inflation",m:y.failAvgInf-y.succAvgInf}].filter(x=>x.m>.005).sort((x,A)=>A.m-x.m);return y.primaryDriver=y.failCount>0&&I.length?I[0].k:null,y})(),finalReal:(()=>{const l=t.map(c=>c.failed?0:c.finalReal||0).sort((c,d)=>c-d);return{p5:o(l,.05),p10:o(l,.1),p25:o(l,.25),p50:o(l,.5),p75:o(l,.75),p90:o(l,.9),p95:o(l,.95),min:l[0]||0,max:l[l.length-1]||0}})(),chartData:(()=>{const l=Math.max(...t.map(m=>m.duration||m.years),1),c=l+1,d={p10:[],p25:[],p50:[],p75:[],p90:[]},f=[];for(let m=0;m<c;m++){const p=t.map(I=>I.potByYear&&I.potByYear[m]!=null?I.potByYear[m]:0).sort((I,x)=>I-x);d.p10.push(o(p,.1)),d.p25.push(o(p,.25)),d.p50.push(o(p,.5)),d.p75.push(o(p,.75)),d.p90.push(o(p,.9));const y=t.filter(I=>(I.failed?I.failMonth/12:l)>=m).length;f.push(t.length?y/t.length*100:0)}return{years:c,potBand:d,solvency:f}})(),isa:(()=>{const l=t.filter(x=>(x.startIsa||0)>0);if(!l.length)return{funded:!1};const c=l.map(x=>x.isaLastedYears).sort((x,A)=>x-A),d=l.map(x=>x.finalIsa).sort((x,A)=>x-A),f=l.map(x=>x.higherRateYears),m=l.map(x=>x.totalTaxReal).sort((x,A)=>x-A),p=Math.max(...l.map(x=>(x.isaByYear||[]).length)),y=[],I=[];for(let x=0;x<p;x++){const A=l.filter(C=>C.isaByYear&&C.isaByYear[x]>0).length;y.push(l.length?A/l.length*100:0);const R=l.map(C=>C.isaByYear&&C.isaByYear[x]!=null?C.isaByYear[x]:0).sort((C,L)=>C-L);I.push(R[Math.floor(R.length/2)])}return{funded:!0,runs:l.length,startBalance:l[0].startIsa,medianLastedYears:o(c,.5),minLastedYears:c[0],pctSurviveFullTerm:l.filter(x=>x.isaDepletedMonth===null).length/l.length*100,finalBalance:{p10:o(d,.1),p50:o(d,.5),p90:o(d,.9)},avgHigherRateYears:f.reduce((x,A)=>x+A,0)/l.length,maxHigherRateYears:Math.max(...f),pctEverHigherRate:l.filter(x=>x.higherRateYears>0).length/l.length*100,medianTotalTax:o(m,.5),p90TotalTax:o(m,.9),pctHoldingByYear:y,medianIsaByYear:I}})(),failures:n.map(l=>({seed:l.seed,startYear:l.startYear,years:l.years,failMonth:l.failMonth,protMonths:l.protMonths}))}}function Nr(t){if(!t)return null;const e={january:0,jan:0,february:1,feb:1,march:2,mar:2,april:3,apr:3,may:4,june:5,jun:5,july:6,jul:6,august:7,aug:7,september:8,sep:8,sept:8,october:9,oct:9,november:10,nov:10,december:11,dec:11},n=t.trim().replace(/\s+/g," ");if(/^\d{4}-\d{2}-\d{2}$/.test(n)){const r=new Date(n);if(!isNaN(r.getTime()))return r}if(/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(n)){const[r,s,o]=n.split("/").map(Number);return new Date(o,s-1,r)}if(/^\d{1,2}-\d{1,2}-\d{4}$/.test(n)){const[r,s,o]=n.split("-").map(Number);return new Date(o,s-1,r)}let i=n.match(/^(\d{1,2})\s+(\w+)\s+(\d{4})$/i);if(i){const r=parseInt(i[1]),s=e[i[2].toLowerCase()],o=parseInt(i[3]);if(s!==void 0)return new Date(o,s,r)}if(i=n.match(/^(\w+)\s+(\d{1,2})\s+(\d{4})$/i),i){const r=e[i[1].toLowerCase()],s=parseInt(i[2]),o=parseInt(i[3]);if(r!==void 0)return new Date(o,r,s)}if(i=n.match(/^(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})$/i),i){const r=e[i[1].toLowerCase()],s=parseInt(i[2]),o=parseInt(i[3]);if(r!==void 0)return new Date(o,r,s)}if(i=n.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+(\w+),?\s+(\d{4})$/i),i){const r=parseInt(i[1]),s=e[i[2].toLowerCase()],o=parseInt(i[3]);if(s!==void 0)return new Date(o,s,r)}return null}function Po(t){const e=typeof t=="string"?Nr(t):t;if(!e||isNaN(e.getTime()))return"";const n=["January","February","March","April","May","June","July","August","September","October","November","December"];return`${e.getDate()} ${n[e.getMonth()]} ${e.getFullYear()}`}function $I(t){const{taxYear:e,spStartDate:n,weeklyAmount:i,taxYearConfigs:r={}}=t;if(!n||!i||i<=0)return{annual:0,monthly:0,isReceiving:!1,isFirstYear:!1,weeksInYear:0,startDate:null};const s=typeof n=="string"?Nr(n):n;if(!s||isNaN(s.getTime()))return{annual:0,monthly:0,isReceiving:!1,isFirstYear:!1,weeksInYear:0,startDate:null};const o=na(s);Ja(e);const l=ty(e),c=[...new Set([o,e,...Object.keys(r)])].sort((x,A)=>Ja(x).getTime()-Ja(A).getTime()),d=c.indexOf(o),f=c.indexOf(e);if(f<d)return{annual:0,monthly:0,isReceiving:!1,isFirstYear:!1,weeksInYear:0,startDate:Po(s)};let m=1;for(let x=d;x<f;x++){const A=c[x],R=r[A],C=(R==null?void 0:R.cpi)||.025;m*=1+C}const p=i*m;if(e===o){const A=Math.max(0,(l.getTime()-s.getTime())/6048e5),R=p*A;return{annual:R,monthly:R/12,isReceiving:!0,isFirstYear:!0,weeksInYear:Math.round(A*10)/10,startDate:Po(s)}}const I=p*52;return{annual:I,monthly:I/12,isReceiving:!0,isFirstYear:!1,weeksInYear:52,startDate:Po(s)}}function UI(t,e=new Date){const n=typeof t=="string"?Nr(t):t;if(!n||isNaN(n.getTime()))return{years:0,months:0,totalMonths:0,isPast:!1};const i=n.getTime()-e.getTime(),r=i<=0;if(r)return{years:0,months:0,totalMonths:0,isPast:!0};const s=Math.floor(i/(30.44*24*60*60*1e3)),o=Math.floor(s/12),l=s%12;return{years:o,months:l,totalMonths:s,isPast:r}}const Gm=2016;function Ma(t,{now:e=new Date}={}){if(!t||!String(t).trim())return{valid:!0,error:null,warning:null,date:null};const n=Nr(t);if(!n||isNaN(n.getTime()))return{valid:!1,error:'Could not read that date. Try a format like "6 May 2040".',warning:null,date:null};const i=n.getFullYear();return i<Gm?{valid:!1,error:`That looks like a date of birth (${i}), not a State Pension start date. Enter the date your State Pension begins — check gov.uk/check-your-state-pension.`,warning:null,date:n}:n.getTime()<e.getTime()?{valid:!0,error:null,warning:`This date is in the past — State Pension will be treated as already in payment from ${i}.`,date:n}:{valid:!0,error:null,warning:null,date:n}}const Lh=Object.freeze(Object.defineProperty({__proto__:null,MIN_SP_START_YEAR:Gm,calculateStatePensionForTaxYear:$I,formatStatePensionDate:Po,getTimeUntilStatePension:UI,parseStatePensionDate:Nr,validateStatePensionDate:Ma},Symbol.toStringTag,{value:"Module"}));let di=null;function xs(){return{settings:{equityMin:ge.EQUITY_MIN,bondMin:ge.BOND_MIN,cashTarget:ge.CASH_TARGET,duration:ge.DURATION_YEARS,baseSalary:ge.BASE_SALARY,other:0,statePension:12e3,statePensionYear:12,pa:Ye.PERSONAL_ALLOWANCE,brl:Ye.BASIC_RATE_LIMIT,hrl:Ye.HIGHER_RATE_LIMIT,taxMode:"inflates",protectionMult:Oi.PROTECTION_MULTIPLIER,consecutiveLimit:ge.CONSECUTIVE_LIMIT,disableProtection:!1,hodlEnabled:Oi.HODL_ENABLED,hodlValue:Oi.HODL_VALUE,spendingProfile:"flat",equityGlideEnabled:!1,diversifierStart:0,taggedFunds:[]},lastModified:null,checksum:null}}function od(){return Ne()&&dt()}function qn(){di=null}function qI(){return di||xs()}async function Km(){if(di)return di;if(!od())return console.warn("Firebase not available - returning defaults"),xs();try{const t=await JT();if(t){const e={settings:t,lastModified:new Date().toISOString(),checksum:null};return di=YI(e),di}}catch(t){console.error("Error loading stress data:",t)}return xs()}async function HI(t){if(!od())throw new Error("Must be logged in to save data");try{t.lastModified=new Date().toISOString(),t.checksum=WI(t),await Mm(t.settings),di=t}catch(e){throw console.error("Error saving stress data:",e),new Error("Failed to save stress data")}}function WI(t){return ra(t.settings)}function YI(t){const e={...xs()};return t.settings&&(e.settings={...e.settings,...t.settings},t.settings.pacwMin!==void 0&&t.settings.equityMin===void 0&&(e.settings.equityMin=t.settings.pacwMin),t.settings.cgtMin!==void 0&&t.settings.bondMin===void 0&&(e.settings.bondMin=t.settings.cgtMin),t.settings.csh2Target!==void 0&&t.settings.cashTarget===void 0&&(e.settings.cashTarget=t.settings.csh2Target),e.settings.hodlEnabled===void 0&&(e.settings.hodlEnabled=!1),e.settings.hodlValue===void 0&&(e.settings.hodlValue=25e3)),e.lastModified=t.lastModified,e.checksum=t.checksum,e}function jI(){return qI().settings}async function Bt(){return(await Km()).settings}async function js(t){const e=await Km();e.settings={...e.settings,...t},await HI(e)}async function GI(){if(!od())throw new Error("Must be logged in to reset settings");const t=xs();await Mm(t.settings),qn()}function KI(t){if(!t.spStartDate||!t.spWeeklyAmount)return null;const e=Nr(t.spStartDate);if(!e)return console.warn("Could not parse spStartDate:",t.spStartDate),null;const n=new Date,i=365.25*24*60*60*1e3,r=Math.max(0,(e.getTime()-n.getTime())/i),s=Math.floor(r),o=365,l=Math.floor((e-new Date(e.getFullYear(),0,0))/(24*60*60*1e3)),d=(o-l)/o;return{spStartYear:s,spWeeklyAmount:t.spWeeklyAmount,spFirstYearRatio:d}}function Gs(t={},e=null){const n=e||jI(),i=KI(n),r=i?{spStartYear:i.spStartYear,spWeeklyAmount:i.spWeeklyAmount,spFirstYearRatio:i.spFirstYearRatio}:{statePension:n.statePension||0,statePensionYear:n.statePensionYear??999};return{equityStart:t.equityStart??n.equityMin,bondStart:t.bondStart??n.bondMin,cashStart:t.cashStart??n.cashTarget,equityMin:n.equityMin,bondMin:n.bondMin,cashTarget:n.cashTarget,years:t.years??n.duration,duration:n.duration,baseSalary:n.baseSalary,other:n.other,...r,pa:n.pa,brl:n.brl,hrl:n.hrl,taxMode:n.taxMode,protectionMult:n.protectionMult,consecutiveLimit:n.consecutiveLimit,disableProtection:n.disableProtection,hodlEnabled:n.hodlEnabled,hodlValue:n.hodlValue,isaBalance:n.isaBalance||0,isaReturn:n.isaReturn,isaDrawdownStrategy:n.isaDrawdownStrategy,spendingProfile:n.spendingProfile||"flat",equityGlide:n.equityGlideEnabled?Xh(n):void 0,diversifierStart:t.diversifierStart??(n.diversifierStart||void 0),subAsset:n.subAsset||void 0}}async function ad(){try{const t=await eI();return{...Is(),...t||{}}}catch(t){return console.error("Error loading budget:",t),Is()}}async function ld(t){const e={...t,derived:Lr(t)};return await tI(e),e}function j(t,e=null){const n=Math.abs(t),i=e!==null?e:n<100,r=Math.abs(t).toLocaleString("en-GB",{minimumFractionDigits:i?2:0,maximumFractionDigits:i?2:0});return t<0?`-£${r}`:`£${r}`}function Nh(t,e){const n=QI(t);e.innerHTML=n}function QI(t){var E,S,b,le,pe;const e=t,n=e.calculationDetails||{};let i="";const r=e.isTaxEfficientYear??e.taxEfficient,s=e.protectionInducedTaxEfficiency||!1,o=e.boostAmount>0;let l,c,d;if(e.inProtection?(l="warning",c="Protection Mode",d="⚡"):o?(l="boost",c="Tax Boost (Catch-up)",d="↑"):s?(l="info",c="Protection-Induced Tax Efficiency",d="↑"):r?(l="success",c="Tax-Efficient Year",d="✓"):(l="warning",c="Tax-Inefficient Year",d="!"),i+=`<div class="decision-mode ${l}">
    <span class="mode-icon">${d}</span>
    <span class="mode-label">${c}</span>
  </div>`,r&&e.yearlyIsaSavingsAllocation>0){const H=e.cumulativeIsaSavingsUsed||0,ee=e.yearlyIsaSavingsAllocation,ne=Math.max(0,ee-H),te=ee>0?H/ee*100:0;i+=`<div class="isa-progress-card">
      <h4>ISA/Savings Allocation</h4>
      <div class="isa-progress-bar">
        <div class="isa-progress-fill" style="width: ${Math.min(te,100)}%"></div>
      </div>
      <div class="isa-progress-stats">
        <span>Used: ${j(H)} of ${j(ee)}</span>
        <span>Remaining: ${j(ne)}</span>
      </div>
    </div>`}if(e.alerts&&e.alerts.length>0){i+='<div class="alerts">';for(const H of e.alerts){const ee=JI(H.severity);i+=`<div class="alert ${ee}">${H.message}</div>`}i+="</div>"}i+='<div class="recommendation-card">',i+="<h3>Monthly Recommendation</h3>",i+='<div class="draw-row primary">',i+='<span class="label">SIPP Withdrawal</span>',i+=`<span class="value">${j(e.sippDraw)}</span>`,i+="</div>",e.isaDraw>0&&(i+='<div class="draw-row">',i+='<span class="label">ISA Top-up</span>',i+=`<span class="value">${j(e.isaDraw)}</span>`,i+="</div>"),e.other>0&&(i+='<div class="draw-row muted">',i+='<span class="label">Other Pension</span>',i+=`<span class="value">${j(e.other)}</span>`,i+="</div>"),e.statePension>0&&(i+='<div class="draw-row muted">',i+='<span class="label">State Pension</span>',i+=`<span class="value">${j(e.statePension)}</span>`,i+="</div>"),i+='<div class="divider"></div>';const f=e.sippDraw+e.other+e.statePension,m=f*12,p=e.pa||12570,y=e.brl||50270;let I=0;m>p&&(m<=y?I=(m-p)*.2:I=(y-p)*.2+(m-y)*.4);const x=f-I/12+e.isaDraw;i+='<div class="draw-row total">',i+='<span class="label">Total Monthly Income</span>',i+=`<span class="value">${j(x)}</span>`,i+="</div>",e.boostAmount>0&&(i+='<div class="boost-indicator">',i+='<span class="boost-label">Includes Tax Boost:</span>',i+=`<span class="boost-value">+${j(e.boostAmount)}</span>`,i+="</div>"),i+="</div>",i+='<div class="source-card">',i+="<h4>Withdraw From</h4>",i+=`<div class="source-label ${e.source.toLowerCase().replace(/[^a-z]+/g,"-")}">${e.source}</div>`,e.source==="Growth"&&(e.drawFromEquity>0||e.drawFromBond>0)&&(i+='<div class="source-breakdown">',e.drawFromEquity>0&&(i+=`<div class="source-item">Equity: ${j(e.drawFromEquity)}</div>`),e.drawFromBond>0&&(i+=`<div class="source-item">Bond: ${j(e.drawFromBond)}</div>`),i+="</div>"),e.drawFromDiversifier>0&&(i+='<div class="source-breakdown">',e.drawFromCash>0&&(i+=`<div class="source-item">Cash: ${j(e.drawFromCash)}</div>`),i+=`<div class="source-item">Diversifier reserve: ${j(e.drawFromDiversifier)}</div>`,i+="</div>"),i+="</div>",i+='<div class="fund-status">',i+="<h4>Fund Status</h4>";const A=e.equity+e.bond+e.cash+(e.diversifier||0),R=e.adjEquityMin+e.adjBondMin+e.adjCashTarget,C=A-R,L=R>0?C/R*100:0;i+='<div class="fund-grid">';const N=e.equity-e.adjEquityMin;i+=vo("Equity",e.equity,e.adjEquityMin,N);const z=e.bond-e.adjBondMin;i+=vo("Bond",e.bond,e.adjBondMin,z);const q=e.cash-e.adjCashTarget;i+=vo("Cash",e.cash,e.adjCashTarget,q),e.diversifier!=null&&(i+=vo("Diversifiers",e.diversifier,0,e.diversifier)),i+="</div>";const T=C>=0?"healthy":"warning";i+=`<div class="overall-status ${T}">`,i+=`<span>Total Surplus: ${j(C)}</span>`,i+=`<span>(${L.toFixed(1)}% above target)</span>`,i+="</div>",i+="</div>",i+='<div class="tax-info">',i+="<h4>Tax Summary</h4>",i+='<div class="tax-thresholds">',i+=`<div class="tax-threshold-item"><span class="label">PA:</span><span>${j(e.pa)}</span></div>`,i+=`<div class="tax-threshold-item"><span class="label">BRL:</span><span>${j(e.brl)}</span></div>`,n.taxInfo&&(i+=`<div class="tax-threshold-item"><span class="label">Headroom:</span><span class="${n.taxInfo.headroomToBRL>0?"success":"warning"}">${j(n.taxInfo.headroomToBRL)}</span></div>`),i+="</div>",i+='<div class="tax-comparison">',i+='<div class="tax-comparison-header">',i+="<div></div><div>Monthly</div><div>YTD</div><div>Projected</div>",i+="</div>";const v=((E=n.taxInfo)==null?void 0:E.monthlyTax)||I/12,_=e.taxPaidYTD||v,w=e.taxProjectedAnnual||((S=n.taxInfo)==null?void 0:S.annualTax)||I;if(i+='<div class="tax-comparison-row">',i+='<div class="label">Tax Paid</div>',i+=`<div>${j(v)}</div>`,i+=`<div>${j(_)}</div>`,i+=`<div>${j(w)}</div>`,i+="</div>",r||((b=n.taxInfo)==null?void 0:b.taxSavedAnnual)>0){const H=e.taxSavedMonthly||((le=n.taxInfo)==null?void 0:le.taxSavedMonthly)||0,ee=e.taxSavedYTD||H,ne=e.taxSavedProjectedAnnual||((pe=n.taxInfo)==null?void 0:pe.taxSavedAnnual)||0;ne>0&&(i+='<div class="tax-comparison-row saved">',i+='<div class="label">Tax Saved</div>',i+=`<div class="success">-${j(H)}</div>`,i+=`<div class="success">-${j(ee)}</div>`,i+=`<div class="success">-${j(ne)}</div>`,i+="</div>")}if(i+="</div>",n.taxInfo&&typeof n.taxInfo.effectiveRate=="number"&&!isNaN(n.taxInfo.effectiveRate)){const H=n.taxInfo.effectiveRate*100;i+=`<div class="effective-rate">
      <span>Effective Tax Rate:</span>
      <span class="${H<=20?"success":H<=40?"warning":"danger"}">${H.toFixed(1)}%</span>
    </div>`}else if(n.taxInfo&&n.taxInfo.annualTaxable>0&&n.taxInfo.annualTax>=0){const H=n.taxInfo.annualTax/n.taxInfo.annualTaxable*100;i+=`<div class="effective-rate">
      <span>Effective Tax Rate:</span>
      <span class="${H<=20?"success":H<=40?"warning":"danger"}">${H.toFixed(1)}%</span>
    </div>`}if(i+="</div>",e.rebalanceNeeded&&e.rebalanceActions.length>0){i+='<div class="rebalance-card">',i+="<h4>Rebalancing Suggestions</h4>",i+="<ul>";for(const H of e.rebalanceActions)i+=`<li>${H}</li>`;i+="</ul>",i+="</div>"}return i+='<div class="mode-explanation">',i+="<h4>Why This Recommendation?</h4>",i+=`<p>${n.reason||"Standard calculation based on your settings."}</p>`,!n.hasSufficientIsa&&n.isaNeededMonthly>0&&(i+=`<p class="isa-warning">To enable tax-efficient mode, you need ${j(n.totalIsaNeeded)} in your ISA (${e.remainingMonths} months remaining in tax year).</p>`),i+="</div>",i+='<details class="debug-section">',i+="<summary>Calculation Details</summary>",i+="<pre>"+JSON.stringify(n,null,2)+"</pre>",i+="</details>",i}function vo(t,e,n,i){return`<div class="fund-cell ${i>=0?"healthy":"deficit"}">
    <div class="fund-name">${t}</div>
    <div class="fund-current">${j(e)}</div>
    <div class="fund-min">Min: ${j(n)}</div>
    <div class="fund-surplus">${i>=0?"+":""}${j(i)}</div>
  </div>`}function JI(t){switch(t){case ho.DANGER:return"alert-danger";case ho.WARNING:return"alert-warning";case ho.SUCCESS:return"alert-success";case ho.INFO:default:return"alert-info"}}function XI(){return`
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
  `}async function ZI(t){const e=Zl(t),n=na(e),i=e.getMonth()+1;return await aI(n)?{showWizard:!1,taxYear:n,isApril:i===4,reason:"Year setup already complete"}:{showWizard:!0,taxYear:n,isApril:i===4,reason:`Tax year ${n} has not been set up`}}function ex(t,e,n=0){return t*(1+e-n)}function tx(t){const{targetAnnualGross:e,brl:n,pa:i=12570,remainingMonths:r,grossIncomeToDate:s=0}=t,o=I=>I<=i?0:I<=n?(I-i)*.2:(n-i)*.2+(I-n)*.4,l=Math.max(0,n-s);if(l<=0)return{isaNeeded:0,brlExhausted:!0,remainingBrlHeadroom:0,maxTaxEfficientSalary:n,reducedSalaryOption:n,canBeTaxEfficient:!1,reason:"BRL already exhausted by prior income"};if(e<=n)return{isaNeeded:0,brlExhausted:!1,remainingBrlHeadroom:l,maxTaxEfficientSalary:n,reducedSalaryOption:n,canBeTaxEfficient:!0,targetAchievableAtBrl:!0,reason:"Target achievable at BRL without ISA"};const c=o(e),d=e-c,f=o(n),m=n-f,p=Math.max(0,d-m),y=p/12*r;return{isaNeeded:y,isaNeededAnnual:p,brlExhausted:!1,remainingBrlHeadroom:l,maxTaxEfficientSalary:n,reducedSalaryOption:n,canBeTaxEfficient:!0,targetAchievableAtBrl:!1,netAtTarget:d,netAtBrl:m,taxAtTarget:c,taxAtBrl:f,reason:`Need £${Math.round(y).toLocaleString()} ISA/Savings for tax efficiency`}}function nx(t,e,n){return n?{sufficient:!1,isBrlExhausted:!0,options:[{key:"reduced",label:"Reduce salary to BRL",description:"Accept lower income to stay tax-efficient"},{key:"inefficient",label:"Accept tax-inefficient year",description:"Draw full SIPP, pay 40% on excess"}]}:t>=e?{sufficient:!0,isBrlExhausted:!1,options:[]}:{sufficient:!1,isBrlExhausted:!1,shortfall:e-t,options:[{key:"increase",label:`Increase ISA to £${Math.round(e).toLocaleString()}`,description:"Provide enough ISA for tax efficiency"},{key:"reduced",label:"Reduce salary to BRL",description:"Keep ISA to grow, accept lower income"},{key:"inefficient",label:"Accept tax-inefficient year",description:"Draw full SIPP, ISA stays untouched"}]}}async function ix(t){const e=Zl(t),n=na(e),r=e.getMonth()+1===4,s=iy(e),o=await bt(),l=await Pa(n),c=await Gn(),d=Object.keys(c).sort(),f=d.indexOf(n)-1,m=f>=0?c[d[f]]:null,p=await ed(n),y=(m==null?void 0:m.cpi)||.025,I=o.spendingProfile||"flat",x=Math.max(0,2e3+(parseInt(n.split("/")[0],10)||26)-2026),A=hy(x,I),R=m&&m.confirmedSalary||o.baseSalary,C=ex(R,y,A);return{taxYear:n,selectedMonth:t,isApril:r,remainingMonths:s,baseSalary:o.baseSalary,suggestionBase:R,spendingProfile:I,declineRate:A,suggestedSalary:C,defaults:{pa:(m==null?void 0:m.pa)||l.pa,brl:(m==null?void 0:m.brl)||l.brl,hrl:(m==null?void 0:m.hrl)||l.hrl,cpi:y,other:(m==null?void 0:m.other)||0},statePension:p,existingConfig:l.yearSetupComplete?l:null}}function Qm(t){const{targetSalary:e,brl:n,pa:i=12570,other:r=0,statePension:s=0,isaSavingsAllocation:o=0,remainingMonths:l,grossIncomeToDate:c=0,isTaxEfficient:d=!0}=t,f=S=>S<=i?0:S<=n?(S-i)*.2:(n-i)*.2+(S-n)*.4,m=r/12,p=s/12,y=m+p;let I,x;if(!d)I=e/12-y,x=0;else{const S=Math.max(0,n-c),b=Math.max(0,S/l-y);I=Math.min(e/12-y,b),x=o/l}const A=(I+y)*12,C=f(A)/12,L=I+y,N=L>0?C/L:0,z=I*N,q=m*N,T=p*N,v=I-z,_=m-q,w=p-T,E=v+_+w+x;return{sipp:{gross:I,tax:z,net:v},other:{gross:m,tax:q,net:_},statePension:{gross:p,tax:T,net:w},isa:{gross:x,tax:0,net:x},totalGross:I+m+p+x,totalTax:C,totalNet:E,mode:d?"tax-efficient":"tax-inefficient",monthlySipp:I,monthlyIsa:x,monthlyOther:m,monthlyStatePension:p,monthlyTotal:E}}function rx(t){var x,A,R,C,L,N,z,q,T,v,_;const{pa:e,brl:n,hrl:i,cpi:r,other:s,isaSavingsAllocation:o,isTaxEfficient:l,taxEfficiencyChoice:c,grossIncomeToDate:d,startMonth:f,confirmedSalary:m,remainingMonths:p,statePension:y,monthlyBreakdown:I}=t;return{pa:e,brl:n,hrl:i,cpi:r,other:s,isaSavingsAllocation:l?o:0,isaSavingsUsed:0,isTaxEfficient:l,taxEfficiencyChoice:c,grossIncomeToDate:d||0,startMonth:f||4,remainingMonths:p||12,yearSetupComplete:!0,confirmedSalary:m,statePension:y||0,expectedMonthly:I?{sipp:{gross:((x=I.sipp)==null?void 0:x.gross)||0,tax:((A=I.sipp)==null?void 0:A.tax)||0,net:((R=I.sipp)==null?void 0:R.net)||0},other:{gross:((C=I.other)==null?void 0:C.gross)||0,tax:((L=I.other)==null?void 0:L.tax)||0,net:((N=I.other)==null?void 0:N.net)||0},statePension:{gross:((z=I.statePension)==null?void 0:z.gross)||0,tax:((q=I.statePension)==null?void 0:q.tax)||0,net:((T=I.statePension)==null?void 0:T.net)||0},isa:{gross:((v=I.isa)==null?void 0:v.gross)||0,tax:0,net:((_=I.isa)==null?void 0:_.net)||0},totalGross:I.totalGross||0,totalTax:I.totalTax||0,totalNet:I.totalNet||0}:null}}let Vi=null,Ss=null,zt=1,K=null,V={};async function sx(t,e,n){Vi=t,Ss=n,zt=1,V={},K=await ix(e),V={pa:K.defaults.pa,brl:K.defaults.brl,hrl:K.defaults.hrl,cpi:K.defaults.cpi,other:K.defaults.other,grossIncomeToDate:0,confirmedSalary:K.suggestedSalary,isaSavingsAllocation:0,isTaxEfficient:!0,taxEfficiencyChoice:null},fs()}async function ox(t){return await ZI(t)}function fs(){if(!Vi||!K)return;const t=K.isApril?6:7;Vi.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Tax Year ${K.taxYear} Setup</div>
        <div class="wizard-subtitle">
          ${K.isApril?"Setting up for the full tax year":`Starting in ${cd(K.selectedMonth)} - ${K.remainingMonths} months remaining`}
        </div>

        <div class="wizard-progress">
          ${cx(t,zt)}
        </div>

        ${ax()}
      </div>
    </div>
  `,dx()}function ax(){if(K.isApril,K.isApril)switch(zt){case 1:return Oh();case 2:return Fh();case 3:return Vh();case 4:return zh();case 5:return $h();case 6:return Uh();default:return""}else switch(zt){case 1:return Oh();case 2:return lx();case 3:return Fh();case 4:return Vh();case 5:return zh();case 6:return $h();case 7:return Uh();default:return""}}function Oh(){return`
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
  `}function lx(){const t=cd(K.selectedMonth),e=px(K.selectedMonth);return`
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
  `}function Fh(){const t=V.cpi!==void 0?V.cpi:K.defaults.cpi,e=(t*100).toFixed(1),n=K.suggestionBase??K.baseSalary,i=K.declineRate||0,r=Math.round(n*(1+t-i)),s=i>0,o=((t-i)*100).toFixed(1);return`
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
  `}function Vh(){const t=K.statePension,e=t.isReceiving?`<span style="color: var(--success);">Receiving £${Math.round(t.amount).toLocaleString()}/year</span>`:`<span style="color: var(--text-muted);">${t.yearsUntil} years until state pension</span>`;return`
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
  `}function zh(){Ks();const t=tx({targetAnnualGross:V.confirmedSalary,brl:V.brl,pa:V.pa,other:V.other,statePension:K.statePension.amount,remainingMonths:K.remainingMonths,grossIncomeToDate:V.grossIncomeToDate});return V._isaCalc=t,t.brlExhausted?`
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
  `}function $h(){Ks();const t=V._isaCalc,e=nx(V.isaSavingsAllocation,(t==null?void 0:t.isaNeeded)||0,(t==null?void 0:t.brlExhausted)||!1);if(e.sufficient&&!e.isBrlExhausted)return V.isTaxEfficient=!0,V.taxEfficiencyChoice="efficient",setTimeout(()=>{zt++,fs()},0),`
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
  `}function Uh(){Ks();const t=Qm({targetSalary:V.confirmedSalary,brl:V.brl,pa:V.pa,other:V.other,statePension:K.statePension.amount,isaSavingsAllocation:V.isaSavingsAllocation,remainingMonths:K.remainingMonths,grossIncomeToDate:V.grossIncomeToDate,isTaxEfficient:V.isTaxEfficient}),e=V.isTaxEfficient?"Tax-Efficient":"Tax-Inefficient",n=V.isTaxEfficient?"success":"warning",i=r=>`£${Math.round(r).toLocaleString()}`;return`
    <div class="wizard-step">
      <div class="wizard-step-title">Confirm Tax Year Setup</div>

      <div class="wizard-summary">
        <div class="wizard-summary-row">
          <span>Tax Year:</span>
          <span>${K.taxYear}</span>
        </div>
        <div class="wizard-summary-row">
          <span>Starting Month:</span>
          <span>${cd(K.selectedMonth)}</span>
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
  `}function cx(t,e){let n="";for(let i=1;i<=t;i++){const r=i<e?"done":i===e?"active":"";n+=`<div class="wizard-dot ${r}"></div>`}return n}function dx(){Vi.querySelectorAll("[data-action]").forEach(e=>{e.addEventListener("click",()=>ux(e.dataset.action))}),window._updateWizardSalary=function(){const e=document.getElementById("wizCPI"),n=document.getElementById("wizSalary"),i=document.getElementById("cpiDisplay"),r=document.getElementById("suggestedSalaryDisplay");if(e&&n&&i&&r){const s=parseFloat(e.value)||0,o=s/100,l=K.suggestionBase??K.baseSalary,c=K.declineRate||0,d=Math.round(l*(1+o-c));i.textContent=s.toFixed(1),r.textContent=d.toLocaleString();const f=document.getElementById("netUpliftDisplay");f&&(f.textContent=((o-c)*100).toFixed(1)),n.value=d,V.cpi=o,V.confirmedSalary=d}}}function ux(t){Ks();const e=K.isApril?6:7;switch(t){case"cancel":Jm(),Ss&&Ss({completed:!1,cancelled:!0});break;case"next":zt<e&&(zt++,fs());break;case"back":zt>1&&(zt--,fs());break;case"apply-choice":hx(),zt++,fs();break;case"finish":fx();break}}function hx(){var e;const t=(e=document.querySelector('input[name="taxChoice"]:checked'))==null?void 0:e.value;switch(V.taxEfficiencyChoice=t,t){case"increase":V.isaSavingsAllocation=V._isaCalc.isaNeeded,V.isTaxEfficient=!0;break;case"reduced":V.confirmedSalary=V.brl,V.isaSavingsAllocation=0,V.isTaxEfficient=!0;break;case"inefficient":V.isaSavingsAllocation=0,V.isTaxEfficient=!1;break}}function Ks(){const t=document.getElementById("wizPA");t&&(V.pa=parseFloat(t.value)||12570);const e=document.getElementById("wizBRL");e&&(V.brl=parseFloat(e.value)||50270);const n=document.getElementById("wizHRL");n&&(V.hrl=parseFloat(n.value)||125140);const i=document.getElementById("wizCPI");i&&(V.cpi=(parseFloat(i.value)||4)/100);const r=document.getElementById("wizSalary");r&&(V.confirmedSalary=parseFloat(r.value)||3e4);const s=document.getElementById("wizOther");s&&(V.other=parseFloat(s.value)||0);const o=document.getElementById("wizISA");o&&(V.isaSavingsAllocation=parseFloat(o.value)||0);const l=document.getElementById("wizIncomeToDate");l&&(V.grossIncomeToDate=parseFloat(l.value)||0)}async function fx(){Ks();const t=Qm({targetSalary:V.confirmedSalary,brl:V.brl,pa:V.pa,other:V.other,statePension:K.statePension.amount,isaSavingsAllocation:V.isaSavingsAllocation,remainingMonths:K.remainingMonths,grossIncomeToDate:V.grossIncomeToDate,isTaxEfficient:V.isTaxEfficient}),e=rx({pa:V.pa,brl:V.brl,hrl:V.hrl,cpi:V.cpi,other:V.other,isaSavingsAllocation:V.isaSavingsAllocation,isTaxEfficient:V.isTaxEfficient,taxEfficiencyChoice:V.taxEfficiencyChoice,grossIncomeToDate:V.grossIncomeToDate,startMonth:parseInt(K.selectedMonth.split("-")[1]),confirmedSalary:V.confirmedSalary,remainingMonths:K.remainingMonths,statePension:K.statePension.amount,monthlyBreakdown:t});console.log(`Tax Year Wizard: Saving config for ${K.taxYear}`,e);try{await Xi(K.taxYear,e),console.log(`Tax Year Wizard: Successfully saved config for ${K.taxYear}`)}catch(n){console.error(`Tax Year Wizard: Failed to save config for ${K.taxYear}`,n),typeof window.showToast=="function"&&window.showToast(`Error saving tax year configuration: ${n.message}`,"error");return}Jm(),Ss&&Ss({completed:!0,taxYear:K.taxYear,config:e,wizardInputs:V})}function Jm(){Vi&&(Vi.innerHTML="",Vi.style.display="none")}function cd(t){const[e,n]=t.split("-").map(Number);return new Date(e,n-1,1).toLocaleString("default",{month:"long",year:"numeric"})}function px(t){const[e,n]=t.split("-").map(Number);return new Date(e,n-2,1).toLocaleString("default",{month:"long"})}function mx(){return`
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
  `}function gx(t={},e=null){const n=Gs(t,e),i=Wm(n),r=jm(i);return{results:i,stats:r,config:n}}function yx(t={},e=null){const n=Gs(t,e),i=Ym(n),r=jm(i);return{results:i,stats:r,config:n}}function vx(t={}){const e=Gs(t),n={};for(const[i,r]of Object.entries(Zg))n[i]={...r,result:FI(e,r)};return n}function dd(t){const e={[xe.SHARES]:0,[xe.BONDS]:0,[xe.DIVERSIFIERS]:0,[xe.CASH]:0},n={},i=[],r=[];let s=0,o=0;for(const l of t){const c=+l.value||0,d=l.subClass||(l.ticker?$m[l.ticker]:void 0),f=d?Xt[d]:null;if(!f){r.push({...l});continue}s+=c,(l.wrapper||"").toUpperCase()==="ISA"&&(o+=c),e[f.bucket]+=c,n[d]=(n[d]||0)+c,i.push({...l,subClass:d,bucket:f.bucket,label:f.label})}return{buckets:e,subClassTotals:n,bondWeights:qh(n,xe.BONDS),diversifierWeights:qh(n,xe.DIVERSIFIERS),total:s,isaTotal:o,tagged:i,untagged:r}}function qh(t,e){const n=Object.entries(t).filter(([s])=>Xt[s].bucket===e),i=n.reduce((s,[,o])=>s+o,0);if(i<=0)return{};const r={};for(const[s,o]of n)r[s]=o/i;return r}function bx(t){const e=t.buckets[xe.DIVERSIFIERS]||0,n={equityStart:t.buckets[xe.SHARES]||0,bondStart:t.buckets[xe.BONDS]||0,cashStart:t.buckets[xe.CASH]||0,isaBalance:t.isaTotal||0};return e>0&&(n.diversifierStart=e,n.subAsset={}),Object.keys(t.bondWeights).length&&(n.subAsset=n.subAsset||{},n.subAsset.bondWeights=t.bondWeights),Object.keys(t.diversifierWeights).length&&(n.subAsset=n.subAsset||{},n.subAsset.diversifierWeights=t.diversifierWeights),n}function Xm(t){return na(Zl(t))}function wx(t){const[e,n]=t.split("-").map(Number);return Math.max(0,(n>=4?e:e-1)-2026)}async function _x(t,e,n,i,r){var zr,Si,$r,Xn;const s=r.settings,o=r.history,l=r.allTaxYears,c=Xm(t),d=wx(t),[f,m]=t.split("-").map(Number);if(!l[c])throw new Error(`Tax year ${c} is not configured. Please add it in the Settings tab before calculating.`);const p=l[c],y=p.pa||12570,I=p.brl||50270,x=p.hrl||125140,A=p.other||0,R=p.isTaxEfficient!==!1,C=p.isaSavingsAllocation||0,L=p.grossIncomeToDate||0,N=p.confirmedSalary||s.baseSalary,z=o.find(X=>X.date===t),q=(z==null?void 0:z.isa)||0,T=Math.max(0,(p.isaSavingsUsed||0)-q),_=r.spInfo.amount||0;let w=1;for(let X=0;X<d;X++){const de=String((26+X)%100).padStart(2,"0")+"/"+String((27+X)%100).padStart(2,"0"),$e=(l[de]||{}).cpi||ry;w*=1+$e}let E=Ln(s.equityMin,d,s.duration,w,!0),S=Ln(s.bondMin,d,s.duration,w,!0);const b=Math.round(Ln(s.cashTarget,d,s.duration,w,!1)),le=ia(s.equityGlide,d,s.duration);if(le!=null){const X=E+S;E=X*le,S=X*(1-le)}E=Math.round(E),S=Math.round(S);const pe=e+n,H=E+S;let ee=0;const ne=o.filter(X=>X.date<t);for(let X=ne.length-1;X>=0&&ne[X].source==="Cash";X--)ee++;const te=Vm({totalGrowth:pe,minGrowth:H,consecCashDraws:ee,wasInProtection:ne.length>0&&ne[ne.length-1].inProtection,consecutiveLimit:s.consecutiveLimit||3,recoveryBuffer:s.recoveryBuffer||1e4}),Me=m>=4?16-m:4-m,Pe=Math.max(1,Me),ye=N*w,O=A+_;Bn(ye,y,I,x);let Z,we,se,ce=0,Te=0,Kn=!1,ut=0;const en=Math.max(0,C-T)/Pe;if(R){const X=O/12;o.filter(Oe=>Oe.taxYear===c&&Oe.date<t);const de=ye/12,$e=r.isaBalance||0;let He,mt;if($e>0){const Oe=ec({targetGross:ye,fixedIncome:O,pa:y,brl:I,hrl:x,isaBalance:$e,strategy:s.isaDrawdownStrategy||"minimiseEarlyTax",yearsUntilSp:0});He=Oe.sippGross/12,mt=Oe.isaDraw/12}else{if(((Si=(zr=p.expectedMonthly)==null?void 0:zr.sipp)==null?void 0:Si.gross)>0)He=p.expectedMonthly.sipp.gross;else{const Ie=Math.max(0,I-L-O)/12;He=Math.min(de-X,Ie)}const Oe=Bn(ye,y,I,x)/12,jt=Math.min(ye,I),ve=Bn(jt,y,I,x)/12,je=Math.max(0,Oe-ve);mt=Math.min(je,en)}if(ut=mt,ce=He,te){const Oe=(s.protectionFactor||20)/100;Z=He*(1-Oe),we=mt,se="Protection"}else{Z=He,we=mt,se="Tax-Efficient";const Oe=m>=4?f:f-1,jt=ne.filter(Ie=>{const[Zn,Ai]=Ie.date.split("-").map(Number);return(Ai>=4?Zn:Zn-1)===Oe});let ve=0,je=0;jt.forEach(Ie=>{je+=Ie.sipp||0,Ie.inProtection&&Ie.stdSipp&&(ve+=Ie.stdSipp-Ie.sipp),Ie.boostAmount>0&&(ve-=Ie.boostAmount)});const gt=je+Z*Pe+O;Te=zm({shortfall:ve,standardMonthly:He,remainingMonths:Pe,surplus:pe-H-Qo.SURPLUS_BUFFER,brlHeadroom:I-gt}),Te>50&&(Z+=Te,se="Tax Boost")}}else{const X=ye/12,de=O/12;let $e;if(((Xn=($r=p.expectedMonthly)==null?void 0:$r.sipp)==null?void 0:Xn.gross)>0?$e=p.expectedMonthly.sipp.gross:$e=Math.max(0,X-de),ce=$e,we=0,te){const He=(s.protectionFactor||20)/100;Z=$e*(1-He),se="Protection";const mt=m>=4?f:f-1,Oe=ne.filter(je=>{const[gt,Ie]=je.date.split("-").map(Number);return(Ie>=4?gt:gt-1)===mt});let jt=0;Oe.forEach(je=>{jt+=je.sipp||0});const ve=jt+Z*Pe+O;if(ve<I){const gt=(I-ve)/Pe,Ie=pe-H-(s.recoveryBuffer||1e4);Ie>0&&gt>50&&(Te=Math.min(gt,Ie/Pe),Te>50&&(Z+=Te,Kn=!0,se="Protection-Induced Efficiency"))}}else{Z=$e,se="Tax-Inefficient";const He=m>=4?f:f-1,mt=ne.filter(ve=>{const[je,gt]=ve.date.split("-").map(Number);return(gt>=4?je:je-1)===He});let Oe=0,jt=0;if(mt.forEach(ve=>{jt+=ve.sipp||0,ve.inProtection&&ve.stdSipp&&(Oe+=ve.stdSipp-ve.sipp),ve.boostAmount>0&&(Oe-=ve.boostAmount)}),Oe>0){const ve=jt+Z*Pe+O,je=I-ve,gt=pe-H-(s.recoveryBuffer||1e4);if(je>0&&gt>0){const Ie=je/Pe,Zn=Oe/Pe,Ai=gt/Pe;Te=Math.min(Zn,Ie,Ai),Te>50&&(Z+=Te,se="Tax Boost")}}}}const Nt=r.diversifier||0;let et,ft,bn=0,wn=0,tn=0,_n=0,Ht="";if(!te&&pe>=H+Z){et="Growth";const X=Math.max(0,e-E),de=Math.max(0,n-S),$e=X+de;$e>0?(bn=Z*X/$e,wn=Z*de/$e,ft="Healthy"):(et="Cash",tn=Z,ft="At min")}else if(et="Cash",ft=te?"Protection":"Below min",Nt>0){tn=Math.min(i,Z);let X=Z-tn;X>0&&(_n=Math.min(Nt,X),X-=_n,et=tn>0?"Cash + Diversifier":"Diversifier"),X>0&&(Ht="Cash low!")}else tn=Z,i<Z&&(Ht="Cash low!");let wt="";const Qn=e-E,nn=n-S;if(Qn>5e3&&nn<-5e3){const X=Math.floor(Math.min(Qn,-nn)/1e3)*1e3;X>=5e3&&(wt=`Move £${X.toLocaleString()} Equity→Bond`)}else if(nn>5e3&&Qn<-5e3){const X=Math.floor(Math.min(nn,-Qn)/1e3)*1e3;X>=5e3&&(wt=`Move £${X.toLocaleString()} Bond→Equity`)}let Wt="";const En=b-i;if(En>5e3&&et==="Growth"&&!te){const X=pe-H-Z;if(X>1e4){const de=Math.floor(Math.min(En*.3,X*.5)/1e3)*1e3;de>=5e3&&(Wt=`Replenish Cash: Move £${de.toLocaleString()} from growth funds`)}}const _e=[];Ht&&_e.push({message:Ht,severity:"danger",type:"low-cash"}),Te>50&&_e.push({message:`Tax Boost: +£${Math.round(Te).toLocaleString()}/mo catch-up from protection shortfall`,severity:"success",type:"tax-boost"}),wt&&_e.push({message:wt,severity:"warning",type:"rebalance"}),Wt&&_e.push({message:Wt,severity:"info",type:"cash-replenish"});const fe=m>=4?f:f-1,rn=ne.filter(X=>{const[de,$e]=X.date.split("-").map(Number);return($e>=4?de:de-1)===fe}),sn=rn.reduce((X,de)=>X+(de.sipp||0),0),Jn=rn.length+1,Tn=Math.max(0,12-Jn)*ce,on=sn+Z+Tn+A+_,tt=fl(on,y,I,x),_t=tt/12,Rt=Z+A/12+_/12-_t+we,Ot=_t*Jn,Yt=tt,pt=ye/12,Vr=fl(pt*12,y,I,x),xi=Math.max(0,Vr/12-tt/12),xn=T+ut;return{date:t,taxYear:c,yearNumber:d,remainingMonths:Pe,equity:e,bond:n,cash:i,isa:0,adjEquityMin:E,adjBondMin:S,adjCashTarget:b,pa:y,brl:I,other:A/12,statePension:_/12,sippDraw:Z,stdSipp:ce,isaDraw:we,totalMonthlyNet:Rt,isTaxEfficientYear:R,yearlyIsaSavingsAllocation:C,cumulativeIsaSavingsUsed:xn,isaSavingsUsedThisMonth:ut,taxPaidYTD:Ot,taxProjectedAnnual:Yt,taxSavedMonthly:xi,taxSavedYTD:xi*Jn,taxSavedProjectedAnnual:xi*12,taxEfficient:R&&!Kn,inProtection:te,protectionReason:te?ft:null,consecutiveCashDraws:ee,protectionInducedTaxEfficiency:Kn,boostAmount:Te>50?Te:0,boostEligible:Te>50,source:et,drawFromEquity:bn,drawFromBond:wn,drawFromCash:tn,...Nt>0?{drawFromDiversifier:_n,diversifier:Nt}:{},rebalanceNeeded:wt!=="",rebalanceActions:wt?[wt]:[],alerts:_e,calculationDetails:{mode:se,reason:`${ft} | ${se}`,totalGrowth:pe,minGrowth:H,consec:ee,stdSipp:Z,inputs:{baseSalary:s.baseSalary,confirmedSalary:N,targetGross:ye,cumInf:w,yearNum:d,taxYear:c,OTHER:A,STATE:_,PA:y,BRL:I,isTaxEfficientYear:R,yearlyIsaSavingsAllocation:C,grossIncomeToDate:L},taxInfo:{annualTaxable:on,headroomToBRL:I-on,annualTax:tt,monthlyNet:Rt}}}}let As=null;function Ex(t,e){As=t,Tx(e)}function Tx({onGetStarted:t,onSignIn:e}){As&&(As.innerHTML=`
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
  `,document.getElementById("landingGetStarted").addEventListener("click",t),document.getElementById("landingSignIn").addEventListener("click",e))}function ks(){As&&(As.style.display="none")}function Ix(){return`
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
  `}let Xe=null,ps=null,li=!1;function xx(t,e){console.log("initAuthScreen: initializing"),Xe=t,ps=e,li=!1,ST(n=>{if(console.log("AuthScreen: auth state change received:",n?n.email:"null","processed:",li),n&&!n.emailVerified){Cx(n);return}n&&ps&&!li?(console.log("AuthScreen: calling onAuthSuccessCallback"),li=!0,Zm(),ps(n)):n?console.log("AuthScreen: skipping callback, already processed or no callback"):(li=!1,console.log("AuthScreen: user signed out, reset authProcessed"))}),ud(),console.log("initAuthScreen: complete")}function ud(){if(Xe){if(!Ne()){Xe.innerHTML=`
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
    `;return}Xe.innerHTML=`
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
  `,Sx()}}function Sx(){const t=Xe.querySelectorAll(".auth-screen-tab");t.forEach(s=>{s.addEventListener("click",()=>{t.forEach(c=>c.classList.remove("active")),s.classList.add("active");const o=document.getElementById("signinForm"),l=document.getElementById("signupForm");s.dataset.tab==="signin"?(o.style.display="block",l.style.display="none"):(o.style.display="none",l.style.display="block"),ji()})}),document.getElementById("signinForm").addEventListener("submit",Ax),document.getElementById("signupForm").addEventListener("submit",kx),document.getElementById("forgotPasswordBtn").addEventListener("click",Rx),document.getElementById("googleSigninBtn").addEventListener("click",Px)}function Zt(t){const e=document.getElementById("authScreenError");e&&(e.textContent=t,e.style.display="block")}function ji(){const t=document.getElementById("authScreenError");t&&(t.style.display="none")}async function Ax(t){t.preventDefault(),ji();const e=document.getElementById("signinEmail").value.trim(),n=document.getElementById("signinPassword").value;if(!e||!n){Zt("Please enter email and password");return}try{await PT(e,n)}catch(i){console.error("Sign in error:",i),Zt(Da(i.code))}}async function kx(t){t.preventDefault(),ji();const e=document.getElementById("signupName").value.trim(),n=document.getElementById("signupEmail").value.trim(),i=document.getElementById("signupPassword").value;if(!e||!n||!i){Zt("Please fill in all fields");return}if(i.length<6){Zt("Password must be at least 6 characters");return}try{await AT(n,i,e)}catch(r){console.error("Sign up error:",r),Zt(Da(r.code))}}async function Rx(){ji();const t=document.getElementById("signinEmail").value.trim();if(!t){Zt("Please enter your email address first");return}try{await MT(t),typeof window.showToast=="function"&&window.showToast("Password reset email sent. Check your inbox.","success",5e3)}catch(e){console.error("Reset password error:",e),Zt(Da(e.code))}}async function Px(){ji();try{await CT()}catch(t){console.error("Google sign in error:",t),Zt(Da(t.code))}}function Da(t){return{"auth/invalid-email":"Invalid email address","auth/user-disabled":"This account has been disabled","auth/user-not-found":"No account found with this email","auth/wrong-password":"Incorrect password","auth/email-already-in-use":"An account already exists with this email","auth/weak-password":"Password is too weak","auth/operation-not-allowed":"Sign in method not enabled","auth/popup-closed-by-user":"Sign in cancelled","auth/popup-blocked":"Sign in popup was blocked","auth/too-many-requests":"Too many attempts. Please try again later.","auth/invalid-credential":"Invalid email or password"}[t]||"An error occurred. Please try again."}function Cx(t){Xe&&(Xe.style.display="block",Xe.innerHTML=`
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
  `,document.getElementById("verifiedContinueBtn").addEventListener("click",async()=>{ji();try{const e=await RT();e&&e.emailVerified?ps&&!li&&(li=!0,Zm(),ps(e)):Zt("Not verified yet. Click the link in the email first (check spam), then try again.")}catch(e){console.error("Verification check error:",e),Zt("Could not check verification status. Please try again.")}}),document.getElementById("resendVerificationBtn").addEventListener("click",async()=>{ji();try{await kT(),typeof window.showToast=="function"&&window.showToast("Verification email sent. Check your inbox.","success",5e3)}catch(e){console.error("Resend verification error:",e),Zt(e.code==="auth/too-many-requests"?"Too many attempts. Please wait a few minutes and try again.":"Could not send the email. Please try again.")}}),document.getElementById("verifySignOutBtn").addEventListener("click",async()=>{try{await Gc(),ud()}catch(e){console.error("Sign out error:",e)}}))}function Zm(){Xe&&(Xe.innerHTML=`
      <div class="auth-screen">
        <div class="auth-screen-box" style="text-align: center;">
          <div class="auth-screen-header">
            <h1>Pension Planner</h1>
            <p>Signing in...</p>
          </div>
        </div>
      </div>
    `)}function eg(){console.log("hideAuthScreen: hiding auth screen, element=",!!Xe),Xe&&(Xe.style.display="none",console.log("hideAuthScreen: set display to none"))}function Mx(){li=!1,Xe&&(Xe.style.display="block",ud())}function Jo(t="signin"){Mx(),Xe.querySelectorAll(".auth-screen-tab").forEach(s=>s.classList.remove("active"));const n=Xe.querySelector(`.auth-screen-tab[data-tab="${t}"]`);n&&n.classList.add("active");const i=document.getElementById("signinForm"),r=document.getElementById("signupForm");i&&r&&(i.style.display=t==="signin"?"block":"none",r.style.display=t==="signup"?"block":"none")}function Dx(){return`
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
  `}let Rs=null;function Bx(t,e,n){Rs=t,Lx(e,n)}function Lx(t,e){if(!Rs)return;const n=t||"there";Rs.innerHTML=`
    <div class="onboarding-page">
      <div class="onboarding-content">

        <div class="onboarding-welcome">
          <h1>Welcome, ${n}!</h1>
          <p>Your account is set up and ready to go. Here's what Pension Planner can do for you.</p>
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
          <button class="onboarding-btn primary" id="onboardingStartWizard">Set Up Your First Plan</button>
        </div>

      </div>
    </div>
  `,document.getElementById("onboardingStartWizard").addEventListener("click",e)}function Ba(){Rs&&(Rs.style.display="none")}function Nx(){return`
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
  `}let Hn=null,Xo=null,D={scenarioName:"My plan",scenarioDescription:"",enabledTools:["stress","decision"],household:"single",currentAge:"",retirementAge:"",retired:!1,partnerAge:"",partnerRetirementAge:"",partnerRetired:!1,startAt:"budget",introDone:!1,baseSalary:3e4,otherIncome:0,spStartDate:"",spWeeklyAmount:0,equityMin:25e4,bondMin:2e5,cashTarget:5e4,isaBalance:0,duration:35,taxMode:"inflates",decisionSalary:3e4,decisionEquity:25e4,decisionBond:2e5,decisionCash:5e4,decisionIsaBalance:0,decisionDuration:35},yt="scenario",Se=1;function tg(){yt="scenario",Se=1,D={scenarioName:"My plan",scenarioDescription:"",enabledTools:["stress","decision"],household:"single",currentAge:"",retirementAge:"",retired:!1,partnerAge:"",partnerRetirementAge:"",partnerRetired:!1,startAt:"budget",introDone:!1,baseSalary:3e4,otherIncome:0,spStartDate:"",spWeeklyAmount:0,equityMin:25e4,bondMin:2e5,cashTarget:5e4,isaBalance:0,duration:35,taxMode:"inflates",decisionSalary:3e4,decisionEquity:25e4,decisionBond:2e5,decisionCash:5e4,decisionIsaBalance:0,decisionDuration:35}}function ng(t,e){Hn=t,Xo=e,tg(),Ft()}function Ft(){Hn&&(yt==="scenario"?Ox():yt==="stress"?zx():yt==="decision"&&Ux())}function Ox(){Hn.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Welcome to Pension Planner</div>
        <div class="wizard-subtitle">Let's create your first plan</div>

        <div class="wizard-progress">
          ${hd(2,Se)}
        </div>

        ${Se===1?Fx():Vx()}
      </div>
    </div>
  `,fd()}function Fx(){const t=D.household==="couple";return`
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

      ${Hh("You","wiz",D.currentAge,D.retirementAge,D.retired)}
      <div id="wizPartnerBlock" style="display:${t?"block":"none"};">
        ${Hh("Your partner","wizPartner",D.partnerAge,D.partnerRetirementAge,D.partnerRetired)}
        <p style="font-size:12px; color:var(--text-muted); margin:4px 0 0;">
          You'll plan <strong>your own money</strong> against your share of the joint budget —
          your partner can do the same in a plan of their own.
        </p>
      </div>

      <div class="wizard-buttons">
        <button class="wizard-btn secondary" data-action="skip-all">Skip</button>
        <button class="wizard-btn primary" data-action="to-router">Next</button>
      </div>
    </div>
  `}function Hh(t,e,n,i,r){const s=r?"Age you retired":"Target retirement age",o=e+"CurrentAge",l=e+"RetireAge",c=e+"Retired";return`
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
  `}function Vx(){return`
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
  `}function zx(){Hn.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Stress Tester Setup</div>
        <div class="wizard-subtitle">Let's set up your pension simulation in a few simple steps.</div>

        <div class="wizard-progress">
          ${hd(6,Se)}
        </div>

        ${$x(Se)}
      </div>
    </div>
  `,fd()}function $x(t){switch(t){case 1:return`
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
      `;default:return""}}function Ux(){Hn.innerHTML=`
    <div class="wizard-overlay">
      <div class="wizard-box">
        <div class="wizard-title">Decision Tool Setup</div>
        <div class="wizard-subtitle">Now let's set up the tool you'll use each month once you're retired.</div>

        <div class="wizard-progress">
          ${hd(4,Se)}
        </div>

        ${qx(Se)}
      </div>
    </div>
  `,fd()}function qx(t){switch(t){case 1:return`
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
      `;default:return""}}function hd(t,e){let n="";for(let i=1;i<=t;i++){const r=i<e?"done":i===e?"active":"";n+=`<div class="wizard-dot ${r}"></div>`}return n}function fd(){if(Hn.querySelectorAll("[data-action]").forEach(e=>{e.addEventListener("click",()=>Hx(e.dataset.action))}),document.getElementById("wizRisks")&&typeof window.writeAlloc=="function"){window.writeAlloc("wiz",D.equityMin,D.bondMin,D.cashTarget);const e=document.getElementById("wizEquityGlide");e&&(e.checked=!!D.equityGlideEnabled,window.updateAllocDisplay("wiz"))}if(document.getElementById("wizDRisks")&&typeof window.writeAlloc=="function"){window.writeAlloc("wizD",D.decisionEquity,D.decisionBond,D.decisionCash);const e=document.getElementById("wizDEquityGlide");e&&(e.checked=!!D.decisionEquityGlideEnabled,window.updateAllocDisplay("wizD"))}}function Hx(t){switch(ig(),t){case"skip-all":D.startAt="budget",Li();break;case"to-router":{const e=parseInt(D.currentAge),n=parseInt(D.retirementAge),i=r=>{typeof window.showToast=="function"&&window.showToast(r,"error")};if(!n||n<40||n>95){i(D.retired?"Please enter the age you retired":"Please enter a target retirement age");return}if(e&&n>e&&D.retired){i("You ticked 'already retired' but the age is in the future — untick it, or lower the age.");return}if(e&&n<e&&!D.retired){i("That retirement age is in the past — tick 'already retired' if you've already retired.");return}Se=2,Ft();break}case"start-budget":case"start-stress":case"start-decision":D.startAt=t.replace("start-",""),Li();break;case"next":{const e=Ma(D.spStartDate);if(!e.valid){typeof window.showToast=="function"&&window.showToast(e.error,"error");return}yt==="scenario"?Se<2&&(Se++,Ft()):yt==="stress"?Se<6&&(Se++,Ft()):yt==="decision"&&Se<4&&(Se++,Ft());break}case"back":(yt==="scenario"&&Se>1||yt==="stress"&&Se>1||yt==="decision"&&Se>1)&&(Se--,Ft());break;case"start-tools":if(!D.enabledTools||D.enabledTools.length===0){typeof window.showToast=="function"&&window.showToast("Please select at least one tool","error");return}ul("scenario");break;case"skip-stress":ul("stress");break;case"finish-stress":D.decisionSalary=D.baseSalary,D.decisionEquity=D.equityMin,D.decisionBond=D.bondMin,D.decisionCash=D.cashTarget,D.decisionIsaBalance=D.isaBalance,D.decisionDuration=D.duration,D.decisionEquityGlideEnabled=D.equityGlideEnabled,ul("stress");break;case"skip-decision":Li();break;case"finish":Li();break}}function ul(t){const e=D.enabledTools.includes("stress"),n=D.enabledTools.includes("decision");t==="scenario"?e?(yt="stress",Se=1,Ft()):n?(yt="decision",Se=1,Ft()):Li():t==="stress"&&n?(yt="decision",Se=1,Ft()):Li()}function ig(){const t=document.getElementById("wizScenarioName");t&&(D.scenarioName=t.value.trim()||"My Plan");const e=document.getElementById("wizScenarioDesc");e&&(D.scenarioDescription=e.value.trim()||"");const n=document.querySelector('input[name="wizHousehold"]:checked');n&&(D.household=n.value);const i=document.getElementById("wizCurrentAge");i&&(D.currentAge=parseInt(i.value)||"");const r=document.getElementById("wizRetireAge");r&&(D.retirementAge=parseInt(r.value)||"");const s=document.getElementById("wizRetired");s&&(D.retired=s.checked);const o=document.getElementById("wizPartnerCurrentAge");o&&(D.partnerAge=parseInt(o.value)||"");const l=document.getElementById("wizPartnerRetireAge");l&&(D.partnerRetirementAge=parseInt(l.value)||"");const c=document.getElementById("wizPartnerRetired");c&&(D.partnerRetired=c.checked);const d=document.getElementById("wizToolStress"),f=document.getElementById("wizToolDecision");if(d!==null||f!==null){const T=[];d&&d.checked&&T.push("stress"),f&&f.checked&&T.push("decision"),D.enabledTools=T}const m=document.getElementById("wizBaseSalary");m&&(D.baseSalary=parseFloat(m.value)||3e4);const p=document.getElementById("wizOther");p&&(D.otherIncome=parseFloat(p.value)||0);const y=document.getElementById("wizSpStartDate");y&&(D.spStartDate=y.value.trim()||"");const I=document.getElementById("wizSpWeeklyAmount");if(I&&(D.spWeeklyAmount=parseFloat(I.value)||0),document.getElementById("wizPot")&&typeof window.readAlloc=="function"){const T=window.readAlloc("wiz");D.equityMin=T.equityMin,D.bondMin=T.bondMin,D.cashTarget=T.cashTarget}const x=document.getElementById("wizEquityGlide");x&&(D.equityGlideEnabled=x.checked);const A=document.getElementById("wizIsaBalance");A&&(D.isaBalance=parseFloat(A.value)||0);const R=document.getElementById("wizDuration");R&&(D.duration=parseInt(R.value)||35);const C=document.getElementById("wizTaxMode");C&&(D.taxMode=C.value);const L=document.getElementById("wizDBaseSalary");if(L&&(D.decisionSalary=parseFloat(L.value)||3e4),document.getElementById("wizDPot")&&typeof window.readAlloc=="function"){const T=window.readAlloc("wizD");D.decisionEquity=T.equityMin,D.decisionBond=T.bondMin,D.decisionCash=T.cashTarget}const N=document.getElementById("wizDEquityGlide");N&&(D.decisionEquityGlideEnabled=N.checked);const z=document.getElementById("wizDIsaBalance");z&&(D.decisionIsaBalance=parseFloat(z.value)||0);const q=document.getElementById("wizDDuration");q&&(D.decisionDuration=parseInt(q.value)||35)}function Li(){ig(),Xo&&Xo(D)}function La(){Hn&&(Hn.style.display="none")}function Wx(t,e,n,i){if(Hn=t,Xo=n,tg(),D.enabledTools=e,i&&(e.includes("stress")&&i.source==="decision"&&(D.baseSalary=i.baseSalary||3e4,D.equityMin=i.equityMin||25e4,D.bondMin=i.bondMin||2e5,D.cashTarget=i.cashTarget||5e4,D.isaBalance=i.isaBalance||0,D.duration=i.duration||35,D.spStartDate=i.spStartDate||"",D.spWeeklyAmount=i.spWeeklyAmount||0),e.includes("decision")&&i.source==="stress"&&(D.decisionSalary=i.baseSalary||3e4,D.decisionEquity=i.equityMin||25e4,D.decisionBond=i.bondMin||2e5,D.decisionCash=i.cashTarget||5e4,D.decisionIsaBalance=i.isaBalance||0,D.decisionDuration=i.duration||35)),e.includes("stress"))yt="stress";else if(e.includes("decision"))yt="decision";else{n&&n(D);return}Se=1,Ft()}function Yx(){return`
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
  `}function jx(){const e=getComputedStyle(document.documentElement).getPropertyValue("--bg").trim()==="#0d1117"||document.documentElement.classList.contains("dark")||window.matchMedia("(prefers-color-scheme: dark)").matches;return{primary:"#f0c674",success:"#2ea043",warning:"#e1b12c",danger:"#f85149",muted:"#8b8b9b",grid:"rgba(255,255,255,0.1)",bg:e?"rgba(15,15,26,1)":"#ffffff",text:e?"#c9d1d9":"#1f2937",cardBg:e?"#21262d":"#ffffff",cone:"rgba(240,198,116,0.15)",coneMid:"rgba(240,198,116,0.2)",coneInner:"rgba(240,198,116,0.35)",coneBorder:"rgba(240,198,116,0.4)",trajectory:"rgba(46,160,67,0.25)",trajectoryFailed:"rgba(248,81,73,0.8)",trajectoryHover:"#5fdd7b",trajectoryFailedHover:"#ff6b6b",glidepath:"#7eb8da",zeroLine:"#f85149"}}function Gx(t,e,n={}){const i=jx(),r=t.getContext("2d"),{width:s,height:o}=t,l={top:50,right:180,bottom:60,left:80},c=s-l.left-l.right,d=o-l.top-l.bottom;r.fillStyle=i.bg,r.fillRect(0,0,s,o);const f=Object.keys(e),m=n.years||35;let p=0;f.forEach(A=>{const R=e[A].result;R&&R.hist&&R.hist.forEach(C=>{C.total>p&&(p=C.total)})}),p*=1.1;const y=A=>l.left+A/m*c,I=A=>l.top+d-A/p*d;Kx(r,l,c,d,m,p,n.title||"Scenario Comparison",i);const x=["#6366f1","#22c55e","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#ec4899","#84cc16"];f.forEach((A,R)=>{const C=e[A].result;if(!C||!C.hist)return;r.beginPath(),r.strokeStyle=x[R%x.length],r.lineWidth=2.5,C.hist.forEach((N,z)=>{const q=y(N.year),T=I(N.total);z===0?r.moveTo(q,T):r.lineTo(q,T)}),r.stroke();const L=l.top+15+R*24;r.fillStyle=x[R%x.length],r.fillRect(s-l.right+15,L,20,4),r.font="11px system-ui, sans-serif",r.fillStyle=i.text,r.textAlign="left",r.fillText(e[A].name||A,s-l.right+40,L+5),C.final/1e3,r.fillStyle=i.muted,r.fillText(`${rg(C.final)}`,s-l.right+40,L+18)})}function Kx(t,e,n,i,r,s,o,l){t.font="bold 14px system-ui, sans-serif",t.fillStyle=l.text,t.textAlign="center",t.fillText(o,e.left+n/2,e.top-20),t.strokeStyle=l.grid,t.lineWidth=1;for(let c=0;c<=5;c++){const d=e.top+i*c/5;t.beginPath(),t.moveTo(e.left,d),t.lineTo(e.left+n,d),t.stroke();const f=s*(5-c)/5;t.font="11px system-ui, sans-serif",t.fillStyle=l.muted,t.textAlign="right",t.fillText(rg(f),e.left-10,d+4)}for(let c=0;c<=r;c+=5){const d=e.left+c/r*n;t.beginPath(),t.moveTo(d,e.top),t.lineTo(d,e.top+i),t.stroke(),t.textAlign="center",t.fillText(`Y${c}`,d,e.top+i+20)}t.font="12px system-ui, sans-serif",t.textAlign="center",t.fillText("Years",e.left+n/2,e.top+i+45),t.save(),t.translate(20,e.top+i/2),t.rotate(-Math.PI/2),t.fillText("Fund Value",0,0),t.restore()}function rg(t){return t>=1e6?`£${(t/1e6).toFixed(1)}M`:t>=1e3?`£${(t/1e3).toFixed(0)}k`:`£${t.toFixed(0)}`}function Qx(){return`
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
  `}window._simEngine={runMonteCarlo:Wm,runHistorical:Ym,simulate:Ar,monteCarloReturns:sd};window._constants={EQUITY_RETURNS:zi,INFLATION:ta};window._mathUtils={seededRng:tc};let sg=null,og=null;function ag(){sg=null,og=null;const t=document.getElementById("mcResults"),e=document.getElementById("histResults");t&&(t.innerHTML=""),e&&(e.innerHTML="");const n=document.getElementById("optimiseResultsMC"),i=document.getElementById("optimiseResultsHist");n&&(n.innerHTML=""),i&&(i.innerHTML="")}function lg(){document.querySelectorAll(".sub-tab[data-stresstab]").forEach(n=>n.classList.remove("active"));const t=document.querySelector('.sub-tab[data-stresstab="montecarlo"]');t&&t.classList.add("active"),document.querySelectorAll(".stress-subtab").forEach(n=>n.classList.add("hidden"));const e=document.getElementById("stress-montecarlo");e&&e.classList.remove("hidden")}function cg(){document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(n=>n.classList.remove("active"));const t=document.querySelector('.sub-tab[data-decisiontab="entry"]');t&&t.classList.add("active"),document.querySelectorAll(".decision-subtab").forEach(n=>n.classList.add("hidden"));const e=document.getElementById("decision-entry");e&&e.classList.remove("hidden")}const dg=document.createElement("style");dg.textContent=XI()+Ix()+Dx()+Nx()+Yx()+mx()+Qx();document.head.appendChild(dg);const pd=document.getElementById("globalLoadingOverlay"),Jx=pd.querySelector(".loading-text");function St(t="Loading..."){Jx.textContent=t,pd.classList.add("active")}function At(){pd.classList.remove("active")}window.showToast=function(e,n="info",i=3e3){const r=document.querySelector(".toast-notification");r&&r.remove();const s=document.createElement("div");s.className=`toast-notification ${n}`,s.innerHTML=`
        <span class="toast-icon">${n==="success"?"✓":n==="error"?"!":"ℹ"}</span>
        <span class="toast-message">${e}</span>
      `,document.body.appendChild(s),requestAnimationFrame(()=>s.classList.add("show")),setTimeout(()=>{s.classList.remove("show"),setTimeout(()=>s.remove(),300)},i)};document.getElementById("versionDisplay").textContent=`v${Kh}`;document.getElementById("entryMonth").value=ny();function $l(t){const e=document.getElementById(t+"SpWeeklyAmount"),n=document.getElementById(t+"SpAnnualAmount");if(!e||!n)return;const i=parseFloat(e.value)||0;n.value=i>0?Math.round(i*52):"",n._updateOverlay&&n._updateOverlay()}["ds","ss"].forEach(t=>{const e=document.getElementById(t+"SpWeeklyAmount"),n=document.getElementById(t+"SpAnnualAmount");e&&n&&(e.addEventListener("input",()=>{const i=parseFloat(e.value)||0;n.value=i>0?Math.round(i*52):"",n._updateOverlay&&n._updateOverlay()}),n.addEventListener("input",()=>{const i=parseFloat(n.value)||0;e.value=i>0?+(i/52).toFixed(2):"",e._updateOverlay&&e._updateOverlay()}))});function md(t){const e=parseFloat(t);return isNaN(e)?"":e.toString().replace(/\B(?=(\d{3})+(?!\d))/g," ")}function ug(){document.querySelectorAll('input[type="number"]').forEach(e=>{e.value,e.addEventListener("focus",function(n){setTimeout(()=>{this.select()},0)}),e.addEventListener("click",function(n){!n.shiftKey&&!n.ctrlKey&&!n.metaKey&&this.select()})})}function hg(){document.querySelectorAll('input[type="number"]').forEach(e=>{if(e.dataset.formatted||e.closest("#budget-content")||e.closest("#budWizardOverlay"))return;e.dataset.formatted="true";let n=e.closest(".input-with-unit");const i=!!n;n||(n=document.createElement("span"),n.className="num-format-wrap",n.style.cssText="position:relative; display:block;",e.parentNode.insertBefore(n,e),n.appendChild(e));const r=document.createElement("span");r.className="number-format-overlay";const s=i?"34px":"14px";r.style.cssText=`
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
        `,getComputedStyle(n).position==="static"&&(n.style.position="relative");function o(){const l=parseFloat(e.value);!isNaN(l)&&l>=1e3&&document.activeElement!==e?(r.textContent=md(l),r.style.display="block",e.style.color="transparent"):(r.style.display="none",e.style.color="")}e._updateOverlay=o,e.addEventListener("focus",()=>{r.style.display="none",e.style.color=""}),e.addEventListener("blur",o),e.addEventListener("input",()=>{document.activeElement===e&&(r.style.display="none",e.style.color="")}),n.appendChild(r),o()})}function Na(){document.querySelectorAll('input[type="number"]').forEach(t=>{t._updateOverlay&&t._updateOverlay()})}setTimeout(()=>{ug(),hg()},100);const Xx=new MutationObserver(t=>{let e=!1;t.forEach(n=>{n.addedNodes.forEach(i=>{var r,s;i.nodeType===1&&((r=i.matches)!=null&&r.call(i,'input[type="number"]')||(s=i.querySelector)!=null&&s.call(i,'input[type="number"]'))&&(e=!0)})}),e&&setTimeout(()=>{ug(),hg()},50)});Xx.observe(document.body,{childList:!0,subtree:!0});let lr=null;async function gd(t,e=null){ks(),eg(),Ba(),La(),document.getElementById("mainApp").classList.remove("hidden"),document.getElementById("userEmail").textContent=t.email,await pr();const n=await Bm();yd(n),await mn(),await Gi(),ql(),lg(),cg(),ag();const i=e||(n.includes("decision")?"decision":"stress");document.querySelectorAll(".tab").forEach(o=>o.classList.remove("active"));const r=document.querySelector(`.tab[data-tab="${i}"]`);r&&r.classList.add("active"),document.querySelectorAll(".tab-content").forEach(o=>o.classList.remove("active"));const s=document.getElementById(`${i}-content`);s&&s.classList.add("active")}function yd(t){const e={decision:["decision"],stress:["stress"]};document.querySelectorAll(".tab").forEach(i=>{const r=i.dataset.tab;let s=!1;for(const[o,l]of Object.entries(e))if(l.includes(r)){s=t.includes(o);break}Object.values(e).flat().includes(r)||(s=!0),i.style.display=s?"":"none"})}window.openToolSettingsTab=function(t){const e=t==="decision"?'.sub-tab[data-decisiontab="decisionsettings"]':'.sub-tab[data-stresstab="stresssettings"]',n=document.querySelector(e);n&&n.click()};async function Ul(t){try{const e=i=>!!i.baseSalary&&+i.baseSalary!=3e4;if(t==="decision"){const i=await bt();return!!i.configured||e(i)||await Js()}const n=await Bt();return!!n.configured||e(n)}catch{return!0}}async function vd(){const t=document.getElementById("dsSetupBanner"),e=document.getElementById("ssSetupBanner");t&&(t.style.display=await Ul("decision")?"none":"block"),e&&(e.style.display=await Ul("stress")?"none":"block")}async function ql(){try{const t=await Bt(),e=await bt();vd(),document.getElementById("entryEquity").value="",document.getElementById("entryBond").value="",document.getElementById("entryCash").value="",document.getElementById("entryIsa").value="",document.getElementById("dsDuration").value=e.duration||35,writeAlloc("ds",e.equityMin??25e4,e.bondMin??2e5,e.cashTarget??5e4,e.diversifierStart||0),restoreCustomAllocFromSettings("ds",e),window._taggedFunds.ds=(e.taggedFunds||[]).map(i=>({...i})),setAllocMode("ds",e.allocMode||(e.taggedFunds&&e.taggedFunds.length?"funds":"risk")),updateEntryTagPrompt(),document.getElementById("dsEquityGlide").checked=e.equityGlideEnabled||!1,updateAllocDisplay("ds"),document.getElementById("dsBaseSalary").value=e.baseSalary||3e4,syncNetFromGross("ds"),document.getElementById("dsSpendingProfile").value=e.spendingProfile||"flat",document.getElementById("dsSpStartDate").value=e.spStartDate||"",document.getElementById("dsSpWeeklyAmount").value=e.spWeeklyAmount||"",$l("ds"),document.getElementById("dsProtectionFactor").value=e.protectionFactor||20,document.getElementById("dsRecoveryBuffer").value=e.recoveryBuffer||1e4,document.getElementById("dsConsecutiveLimit").value=e.consecutiveLimit||3,wd(t),document.getElementById("ssBaseSalary").value=t.baseSalary,syncNetFromGross("ss"),writeAlloc("ss",t.equityMin,t.bondMin,t.cashTarget,t.diversifierStart||0),restoreCustomAllocFromSettings("ss",t),window._taggedFunds.ss=(t.taggedFunds||[]).map(i=>({...i})),setAllocMode("ss",t.allocMode||(t.taggedFunds&&t.taggedFunds.length?"funds":"risk")),document.getElementById("ssDuration").value=t.duration,document.getElementById("ssPA").value=t.pa,document.getElementById("ssBRL").value=t.brl,document.getElementById("ssHRL").value=t.hrl,document.getElementById("ssTaxMode").value=t.taxMode||"inflates",document.getElementById("ssOther").value=t.other||0,document.getElementById("ssSpStartDate").value=t.spStartDate||"",document.getElementById("ssSpWeeklyAmount").value=t.spWeeklyAmount||"",$l("ss"),document.getElementById("ssConsecutiveLimit").value=t.consecutiveLimit||3,document.getElementById("ssProtectionMult").value=t.protectionMult||.8,document.getElementById("ssDisableProtection").checked=t.disableProtection||!1,document.getElementById("ssHodlEnabled").checked=t.hodlEnabled||!1,document.getElementById("ssHodlValue").value=t.hodlValue||25e3,document.getElementById("ssSpendingProfile").value=t.spendingProfile||"flat",document.getElementById("ssEquityGlide").checked=t.equityGlideEnabled||!1,updateAllocDisplay("ss"),document.getElementById("ssIsaBalance").value=t.isaBalance||0;const n=document.getElementById("ssSeedNote");n&&(n.textContent=t.seededFrom==="decision"&&t.seededAt?"Seeded from Decision Tool "+new Date(t.seededAt).toLocaleDateString():""),Na(),console.log("All inputs initialized from stored settings")}catch(t){console.error("Error initializing inputs from settings:",t)}}async function fg(t){console.log("Wizard completed with data:",t);const e=parseInt(t.retirementAge)||60,n=parseInt(t.currentAge)||e,i=95,r=Math.max(5,i-Math.max(n,e));try{const c={duration:r},d={duration:r};await WT(t.scenarioName||"My plan","",["stress","decision"],{stressSettings:c,decisionSettings:d},!0),bi(),qn();try{const f=await ad();f.currentAge=parseInt(t.currentAge)||f.currentAge,f.retirementAge=e,f.endAge=i,f.retired=!!t.retired,f.sharedWithPartner=t.household==="couple",t.household==="couple"&&(f.partnerAge=parseInt(t.partnerAge)||null,f.partnerRetirementAge=parseInt(t.partnerRetirementAge)||null,f.partnerRetired=!!t.partnerRetired),await ld(f)}catch(f){console.warn("Could not seed budget from wizard:",f)}}catch(c){console.error("Error creating scenario from wizard:",c)}const s=Ji(),o=t.startAt||"budget";o==="budget"&&(window._budWizAutoOpen=!0),await gd(s);const l=document.querySelector('.tab[data-tab="'+o+'"]');l&&l.click(),(o==="decision"||o==="stress")&&!await Ul(o)&&(openToolSettingsTab(o),showToast("First, set up this plan: your pot, spending need and State Pension.","info",6e3))}function Hl(t){ks(),eg();const e=t.displayName||t.email.split("@")[0];document.getElementById("onboardingPage").style.display="block",Bx(document.getElementById("onboardingPage"),e,()=>{Ba(),document.getElementById("setupWizard").style.display="block",ng(document.getElementById("setupWizard"),fg)})}xx(document.getElementById("authScreen"),async t=>{console.log("Auth success callback triggered for:",t.email);try{console.log("Checking for existing cloud data...");const e=await OT();console.log("Has cloud data:",e),e?(console.log("Existing user - showing main app"),ks(),gd(t)):(console.log("New user - showing onboarding page"),Hl(t))}catch(e){console.error("Error in auth callback:",e),Hl(t)}});Ex(document.getElementById("landingPage"),{onGetStarted:()=>{ks(),Jo("signup")},onSignIn:()=>{ks(),Jo("signin")}});document.getElementById("logoutBtn").addEventListener("click",async()=>{try{bi(),qn(),yn(),await Gc(),document.getElementById("mainApp").classList.add("hidden"),Ba(),La(),Jo("signin")}catch(t){console.error("Logout error:",t)}});async function Wl(){const t=document.getElementById("planLockChip");if(!t)return;const e=await Js();t.style.display="inline-block",t.textContent=e?"🔒 locked":"✏️ draft",t.title=e?"This plan’s settings are committed so your recorded entries stay consistent. Click for details.":"This plan’s settings are still editable. Saving the Decision settings commits (locks) the plan. Click for details.",t.style.cursor="pointer",t.onclick=n=>{n.stopPropagation(),explainPlanLock(e)}}window.explainPlanLock=function(t){let e=document.getElementById("planLockExplainer");e&&e.remove(),e=document.createElement("div"),e.id="planLockExplainer",e.style.cssText="position:fixed; inset:0; z-index:1300; background:rgba(0,0,0,0.55); display:flex; align-items:center; justify-content:center; padding:20px;",e.innerHTML=`<div style="background:var(--card); border:1px solid var(--border); border-radius:14px; max-width:560px; width:100%; padding:26px; font-size:15px; line-height:1.6;"><h2 style="margin-bottom:12px;">Plans — and why they lock 🔒</h2><p style="margin-bottom:10px; color:var(--text-muted);">A <strong style="color:var(--text);">plan</strong> is a named scenario: its settings (pots, spending target, State Pension, rules) plus everything you record against them — monthly decisions and tax years. You can keep several plans and switch or duplicate them from this dropdown.</p><p style="margin-bottom:10px; color:var(--text-muted);">When you save a plan’s Decision settings, the plan <strong style="color:var(--text);">locks</strong>: the settings freeze so your recorded history stays meaningful — a decision saved under one set of rules shouldn’t be silently re-judged under another.</p><ul style="margin:0 0 12px 18px; color:var(--text-muted);"><li><strong style="color:var(--text);">✏️ draft</strong> — settings still editable; nothing committed yet.</li><li><strong style="color:var(--text);">🔒 locked, nothing recorded</strong> — you can unlock and edit freely.</li><li><strong style="color:var(--text);">🔒 locked with history</strong> — settings can’t change; duplicate into a new plan instead.</li></ul><p style="margin-bottom:16px; color:var(--text-muted);">The Budget and the Stress Tester are never locked — the budget autosaves like a document, and Stress is a sandbox for what-ifs.</p><div style="display:flex; gap:10px; flex-wrap:wrap;"><button type="button" onclick="document.getElementById('planLockExplainer').remove()">Got it</button>`+(t?`<button type="button" class="risk-btn" onclick="document.getElementById('planLockExplainer').remove(); document.querySelector('.tab[data-tab=&quot;decision&quot;]').click(); openToolSettingsTab('decision');">View the locked settings</button>`:"")+"</div></div>",e.addEventListener("click",n=>{n.target===e&&e.remove()}),document.body.appendChild(e)};async function pr(){var r;const t=await Xc(),e=t.find(s=>s.isActive),n=document.getElementById("scenarioActiveName");n&&(n.textContent=e&&(((r=e.planDetails)==null?void 0:r.name)||e.name)||"No Plan"),await Wl();const i=document.getElementById("scenarioList");if(i){if(t.length===0){i.innerHTML='<div class="scenario-dropdown-item" style="color:var(--text-muted);cursor:default;">No plans yet</div>';return}i.innerHTML=t.map(s=>{var c,d;const o=((c=s.planDetails)==null?void 0:c.name)||s.name||"Unnamed Plan",l=((d=s.planDetails)==null?void 0:d.description)||s.description||"";return`
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
      `}).join(""),i.querySelectorAll(".scenario-dropdown-item").forEach(s=>{s.addEventListener("click",async o=>{if(o.target.closest(".scenario-item-actions"))return;const l=s.dataset.scenarioId;if(!l)return;const c=t.find(d=>d.isActive);if(c&&c.id===l){document.getElementById("scenarioDropdown").classList.remove("open");return}try{await YT(l),bi(),qn(),document.getElementById("scenarioDropdown").classList.remove("open"),ag(),lg(),cg();const d=await Bm();yd(d);const f=document.querySelector(".tab.active");if(f&&f.style.display==="none"){const m=document.querySelector('.tab:not([style*="display: none"])');if(m){document.querySelectorAll(".tab").forEach(I=>I.classList.remove("active")),m.classList.add("active"),document.querySelectorAll(".tab-content").forEach(I=>I.classList.remove("active"));const p=m.dataset.tab+"-content",y=document.getElementById(p);y&&y.classList.add("active")}}await mn(),await Gi(),await ql(),await pr()}catch(d){console.error("Error switching scenario:",d),showToast("Failed to switch plan: "+d.message,"error")}})}),i.querySelectorAll(".scenario-rename-btn").forEach(s=>{s.addEventListener("click",async o=>{o.stopPropagation();const l=s.dataset.id,c=s.dataset.name,d=prompt("Rename plan:",c);if(d&&d.trim()&&d.trim()!==c)try{await GT(l,d.trim()),await pr()}catch(f){console.error("Error renaming scenario:",f),showToast("Failed to rename plan: "+f.message,"error")}})}),i.querySelectorAll(".scenario-tools-btn").forEach(s=>{s.addEventListener("click",async o=>{o.stopPropagation();const l=s.dataset.id,c=(s.dataset.tools||"stress,decision").split(",");document.getElementById("scenarioDropdown").classList.remove("open"),Zx(l,c)})}),i.querySelectorAll(".scenario-delete-btn").forEach(s=>{s.addEventListener("click",async o=>{o.stopPropagation();const l=s.dataset.id,c=s.dataset.name;if(confirm(`Delete plan "${c}"? This cannot be undone.`))try{await QT(l),bi(),qn(),await mn(),await Gi(),await ql(),await pr()}catch(d){console.error("Error deleting scenario:",d),showToast("Failed to delete plan: "+d.message,"error")}})})}}document.getElementById("scenarioActiveBtn").addEventListener("click",t=>{t.stopPropagation(),document.getElementById("scenarioDropdown").classList.toggle("open")});document.addEventListener("click",t=>{const e=document.getElementById("scenarioSelector");e&&!e.contains(t.target)&&document.getElementById("scenarioDropdown").classList.remove("open")});document.getElementById("scenarioNewBtn").addEventListener("click",async()=>{document.getElementById("scenarioDropdown").classList.remove("open"),document.getElementById("mainApp").classList.add("hidden"),document.getElementById("setupWizard").style.display="block",ng(document.getElementById("setupWizard"),fg)});document.getElementById("scenarioDuplicateBtn").addEventListener("click",async()=>{var i;document.getElementById("scenarioDropdown").classList.remove("open");const t=await Dt();if(!t){showToast("No active plan to duplicate.","error");return}const e=((i=t.planDetails)==null?void 0:i.name)||t.name||"My Plan",n=prompt("Name for the copy:",e+" (copy)");if(!(!n||!n.trim()))try{await jT(t.id,n.trim()),await pr()}catch(r){console.error("Error duplicating scenario:",r),showToast("Failed to duplicate plan: "+r.message,"error")}});function Zx(t,e){const n=document.getElementById("editToolsModal");n&&n.remove();const i=e.includes("stress"),r=e.includes("decision"),s=document.createElement("div");s.id="editToolsModal",s.className="edit-tools-overlay",s.innerHTML=`
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
      `,document.body.appendChild(s),document.getElementById("editToolsCancel").addEventListener("click",()=>s.remove()),s.addEventListener("click",o=>{o.target===s&&s.remove()}),document.getElementById("editToolsSave").addEventListener("click",async()=>{const o=[];if(document.getElementById("editToolStress").checked&&o.push("stress"),document.getElementById("editToolDecision").checked&&o.push("decision"),o.length===0){showToast("Please select at least one tool","error");return}const l=o.filter(c=>!e.includes(c));try{await KT(t,o);const c=await Dt();if(c&&c.id===t){yd(o);const d=document.querySelector(".tab.active");if(d&&d.style.display==="none"){const f=document.querySelector('.tab:not([style*="display: none"])');if(f){document.querySelectorAll(".tab").forEach(y=>y.classList.remove("active")),f.classList.add("active"),document.querySelectorAll(".tab-content").forEach(y=>y.classList.remove("active"));const m=f.dataset.tab+"-content",p=document.getElementById(m);p&&p.classList.add("active")}}}if(await pr(),s.remove(),l.length>0){let d=null;try{if(l.includes("stress")&&e.includes("decision")){const p=await bt();p&&(d={source:"decision",...p})}else if(l.includes("decision")&&e.includes("stress")){const p=await Bt();p&&(d={source:"stress",...p})}}catch(p){console.warn("Could not load existing settings for pre-fill:",p)}const f=document.getElementById("setupWizard");f.style.display="block",document.getElementById("mainApp").style.display="none",Wx(f,l,async p=>{La();try{l.includes("stress")&&(await js({equityMin:p.equityMin,bondMin:p.bondMin,cashTarget:p.cashTarget,isaBalance:p.isaBalance||0,duration:p.duration,baseSalary:p.baseSalary,other:p.otherIncome||0,taxMode:p.taxMode||"inflates",equityGlideEnabled:p.equityGlideEnabled||!1}),qn()),l.includes("decision")&&(await Ys({equityMin:p.decisionEquity,bondMin:p.decisionBond,cashTarget:p.decisionCash,isaBalance:p.decisionIsaBalance||0,duration:p.decisionDuration,baseSalary:p.decisionSalary,spStartDate:p.spStartDate||null,spWeeklyAmount:p.spWeeklyAmount||0,equityGlideEnabled:p.decisionEquityGlideEnabled||!1}),bi())}catch(y){console.error("Error saving new tool settings:",y)}await gd(),showToast("New tool configured successfully","success")},d)}else showToast("Tools updated","success")}catch(c){console.error("Error updating scenario tools:",c),showToast("Failed to update tools: "+c.message,"error")}})}const eS=60*60*1e3;let hl=null;function pg(){hl&&clearTimeout(hl),dt()&&(hl=setTimeout(async()=>{if(dt()){showToast("You have been logged out due to inactivity (1 hour).","info",5e3);try{bi(),qn(),yn(),await Gc(),document.getElementById("mainApp").classList.add("hidden"),Ba(),La(),Jo("signin")}catch(t){console.error("Auto-logout error:",t)}}},eS))}const tS=["mousedown","mousemove","keydown","scroll","touchstart","click"];tS.forEach(t=>{document.addEventListener(t,()=>{pg()},{passive:!0})});pg();document.getElementById("resetBtn").addEventListener("click",async()=>{if(!(!confirm(`⚠️ WARNING: This will permanently delete ALL your data including:

• All saved settings
• All decision history
• All tax year configurations

This action cannot be undone.

Are you sure you want to reset and start over?`)||!confirm(`Are you ABSOLUTELY sure?

Type OK to confirm deletion of all your data.`)))try{console.log("Wiping all user data..."),await wm(),console.log("Data wiped successfully"),bi(),qn(),yn(),localStorage.clear(),document.getElementById("mainApp").classList.add("hidden");const n=Ji();Hl(n),showToast("All data has been deleted. Set up a new plan to start fresh.","success",4e3)}catch(n){console.error("Reset error:",n),showToast("Error resetting data: "+n.message,"error")}});document.getElementById("deleteAccountBtn").addEventListener("click",async()=>{if(!(!confirm(`⚠️ DELETE YOUR ACCOUNT?

This permanently deletes your login AND all saved data:

• All plans and settings
• All portfolio/decision history
• Your household budget

This cannot be undone.`)||!confirm(`FINAL WARNING

Your account and every piece of data will be gone forever.

Delete everything?`)))try{await wm(),bi(),qn(),yn(),localStorage.clear(),await DT(),showToast("Your account and all data have been deleted.","success",4e3),setTimeout(()=>window.location.reload(),1500)}catch(n){console.error("Delete account error:",n),n.code==="auth/requires-recent-login"?showToast("For security, please sign out, sign back in, and press Delete Account again.","error",8e3):showToast("Error deleting account: "+n.message,"error")}});document.querySelectorAll(".tab").forEach(t=>{t.addEventListener("click",async()=>{if(t.dataset.tab!=="stress"){nS();const e=document.getElementById("optimiseResultsMC"),n=document.getElementById("optimiseResultsHist");e&&(e.innerHTML=""),n&&(n.innerHTML="")}document.querySelectorAll(".tab").forEach(e=>e.classList.remove("active")),t.classList.add("active"),document.querySelectorAll(".tab-content").forEach(e=>e.classList.remove("active")),document.getElementById(`${t.dataset.tab}-content`).classList.add("active"),t.dataset.tab==="stress"&&await Fa(),t.dataset.tab==="budget"&&await ES()})});const Xr=document.querySelector(".tabs"),Wh=document.querySelector(".tabs-wrapper");if(Xr&&Wh){const t=()=>{const e=Xr.scrollLeft+Xr.clientWidth>=Xr.scrollWidth-10;Wh.classList.toggle("scrolled-end",e)};Xr.addEventListener("scroll",t),t()}document.querySelectorAll(".sub-tab[data-stresstab]").forEach(t=>{t.addEventListener("click",async()=>{document.querySelectorAll(".sub-tab[data-stresstab]").forEach(e=>e.classList.remove("active")),t.classList.add("active"),document.querySelectorAll(".stress-subtab").forEach(e=>e.classList.add("hidden")),document.getElementById(`stress-${t.dataset.stresstab}`).classList.remove("hidden"),t.dataset.stresstab==="stresssettings"&&await Fa()})});document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(t=>{t.addEventListener("click",async()=>{document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(e=>e.classList.remove("active")),t.classList.add("active"),document.querySelectorAll(".decision-subtab").forEach(e=>e.classList.add("hidden")),document.getElementById(`decision-${t.dataset.decisiontab}`).classList.remove("hidden"),t.dataset.decisiontab==="decisionsettings"&&await Td(),t.dataset.decisiontab==="history"&&await mn(),t.dataset.decisiontab==="taxyears"&&await Gi()})});async function Yh(t,e,n,i){var o,l;const r=await bt(),s=r.equityGlideEnabled?{...r,equityGlide:Xh(r)}:r;return _x(t,e,n,i,{settings:s,history:await Zi(),allTaxYears:await Gn(),spInfo:await ed(Xm(t)),isaBalance:parseFloat((o=document.getElementById("entryIsa"))==null?void 0:o.value)||0,diversifier:parseFloat((l=document.getElementById("entryDiversifier"))==null?void 0:l.value)||0})}function bd(t,e,n){if(t<1e4&&e<1e4&&n<1e4&&t+e+n>0){const r=s=>"£"+Math.round(s||0).toLocaleString();return confirm(`These fund values look low — Equity ${r(t)}, Bond ${r(e)}, Cash ${r(n)}.

Enter absolute amounts in pounds, to the single pound (e.g. 250000, not 250).

Continue anyway?`)}return!0}window.handleDecisionSubmit=async function(t){t.preventDefault();const e=document.getElementById("entryMonth").value,n=parseFloat(document.getElementById("entryEquity").value)||0,i=parseFloat(document.getElementById("entryBond").value)||0,r=parseFloat(document.getElementById("entryCash").value)||0,s=[];if(e||s.push("Month"),!n&&n!==0&&s.push("Equity Fund"),!i&&i!==0&&s.push("Bond Balance"),!r&&r!==0&&s.push("Cash Balance"),s.length>0){showToast("Missing: "+s.join(", "),"error",4e3);return}if(!bd(n,i,r))return;if((await Zi({limit:1e3})).find(c=>c.date===e)){showToast(`${kr(e)} already has a saved decision. Delete it from the History tab first to recalculate.`,"error",5e3);return}try{if((await ox(e)).showWizard){const f=document.getElementById("taxYearWizard");f.style.display="block",window._pendingDecisionForm={dateStr:e,equity:n,bond:i,cash:r},sx(f,e,async m=>{if(f.style.display="none",m&&m.completed)try{lr=await Yh(e,n,i,r);const p=document.getElementById("decisionOutput");Nh(lr,p),document.getElementById("saveBtn").disabled=!1}catch(p){console.error("Decision error after wizard:",p),showToast("Error: "+p.message,"error")}});return}lr=await Yh(e,n,i,r);const d=document.getElementById("decisionOutput");Nh(lr,d),document.getElementById("saveBtn").disabled=!1}catch(c){console.error("Decision error:",c),showToast("Error: "+c.message,"error")}};window.saveCurrentDecision=async function(){const t=document.getElementById("saveBtn");if(!lr){showToast("No decision to save","error");return}if(!dt()){showToast("Please sign in to save decisions","error");return}t.classList.add("loading"),t.disabled=!0;try{await dI(lr),showToast("Decision saved to history","success"),await mn()}catch(e){console.error("Save error:",e),showToast("Error saving: "+e.message,"error"),t.disabled=!1}finally{t.classList.remove("loading")}};function wd(t){const e=r=>"£"+Math.round(r||0).toLocaleString(),n=(t.diversifierStart||0)>0?` · Diversifiers ${e(t.diversifierStart)}`:"",i=`Starting balances come from your <strong>Settings</strong> (Fund Minimums): Equity ${e(t.equityMin)} · Bond ${e(t.bondMin)}${n} · Cash ${e(t.cashTarget)}. Edit them in the Settings tab.`;["mcStartSummary","histStartSummary","scenStartSummary"].forEach(r=>{const s=document.getElementById(r);s&&(s.innerHTML=i)}),["mcYears","histYears"].forEach(r=>{const s=document.getElementById(r);s&&(s.value=t.duration)})}window.runMonteCarloUI=async function(){const t=await Bt(),e={years:parseInt(document.getElementById("mcYears").value)||t.duration},n=document.getElementById("optimiseResultsMC");n&&(n.innerHTML=""),document.getElementById("mcResults").innerHTML='<div class="loading"><div class="spinner"></div>Running simulation...</div>',setTimeout(()=>{try{const{results:i,stats:r}=gx(e);sg=i,yg(r,i,"Monte Carlo (1000 runs)","mcResults",e.years)}catch(i){console.error("Simulation error:",i),document.getElementById("mcResults").innerHTML=`<div class="alert alert-danger">Error: ${i.message}</div>`}},50)};window.runHistoricalUI=async function(){const t=await Bt(),e={years:parseInt(document.getElementById("histYears").value)||t.duration},n=document.getElementById("optimiseResultsHist");n&&(n.innerHTML=""),document.getElementById("histResults").innerHTML='<div class="loading"><div class="spinner"></div>Running simulation...</div>',setTimeout(()=>{try{const{results:i,stats:r}=yx(e);og=i,yg(r,i,"Historical Analysis","histResults",e.years)}catch(i){console.error("Simulation error:",i),document.getElementById("histResults").innerHTML=`<div class="alert alert-danger">Error: ${i.message}</div>`}},50)};window.runScenariosUI=async function(){await Bt();const t={};document.getElementById("scenResults").innerHTML='<div class="loading"><div class="spinner"></div>Running scenarios...</div>',setTimeout(()=>{try{const e=vx(t);uS(e,"scenResults")}catch(e){console.error("Scenario error:",e),document.getElementById("scenResults").innerHTML=`<div class="alert alert-danger">Error: ${e.message}</div>`}},50)};let ri=!1,ss=0;function nS(){ss++}window.runOptimisationUI=async function(t){if(ri)return;ri=!0;const e=++ss,n=document.getElementById("optimiseBtn"+t),i=document.getElementById("optimiseResults"+t);n&&(n.disabled=!0),n&&(n.textContent="Optimising..."),i.innerHTML='<div class="loading"><div class="spinner"></div>Preparing optimisation...</div>';const r=await Bt(),s=JSON.parse(JSON.stringify(r)),o=document.getElementById(t==="MC"?"mcYears":"histYears"),l=parseInt(o&&o.value)||s.duration,c=(s.equityMin||0)+(s.bondMin||0)+(s.cashTarget||0);if(e!==ss){ri=!1,n&&(n.disabled=!1,n.textContent="Optimise Allocation");return}const d=[];for(let w=5;w<=90;w+=5)for(let E=5;E<=95-w;E+=5){const S=100-w-E;S>=0&&d.push({equity:Math.round(c*E/100),bond:Math.round(c*S/100),cash:Math.round(c*w/100)})}const{EQUITY_RETURNS:f,INFLATION:m}=window._constants,{simulate:p,monteCarloReturns:y}=window._simEngine,I=Object.keys(f).map(Number).sort((w,E)=>w-E),x=Math.max(...I),A=w=>{const E={...s,equityMin:w.equity,bondMin:w.bond,cashTarget:w.cash},S=Gs({years:l},E),b=[];if(t==="MC")for(let O=0;O<1e3;O++)b.push(p(S,y(S,O),O));else I.forEach(O=>{if(O+l-1>x)return;const Z={equity:{},inflation:{}};for(let we=0;we<l;we++)Z.equity[we]=f[O+we]||0,Z.inflation[we]=m[O+we]||.025;b.push(p(S,Z,O))});const le=b.filter(O=>O.failed);b.filter(O=>!O.failed);const pe=(b.length-le.length)/b.length*100,H=b.reduce((O,Z)=>O+Math.min(1,(Z.years||0)/(Z.duration||l)),0)/b.length*100,ne=b.map(O=>O.protMonths).reduce((O,Z)=>O+Z,0)/b.length,te=b.filter(O=>O.protMonths>0).length,Me=b.map(O=>O.failed?0:O.finalReal||0).sort((O,Z)=>O-Z),Pe=Me.length?Me[Math.floor(Me.length*.5)]:0,ye=Me.length?Me[Math.floor(Me.length*.9)]:0;return{equity:w.equity,bond:w.bond,cash:w.cash,rate:pe,coverage:H,avgProt:ne,withProt:te,totalRuns:b.length,medianFinal:Pe,p90Final:ye}};let R;try{const w={equity:s.equityMin||0,bond:s.bondMin||0,cash:s.cashTarget||0},E=A(w);R={...w,...E}}catch(w){console.error("Optimisation error (original):",w),i.innerHTML='<div class="alert alert-danger">Error: '+w.message+"</div>",ri=!1,n&&(n.disabled=!1,n.textContent="Optimise Allocation");return}const C=10;let L=0;const N=[];let z=null;function q(w){const E=Math.max(...w.map(b=>b.coverage)),S=w.filter(b=>b.coverage>=E-.5);return S.sort((b,le)=>b.avgProt-le.avgProt||le.medianFinal-b.medianFinal),S[0]}function T(w,E){return Math.round(w.equity)===Math.round(E.equity)&&Math.round(w.bond)===Math.round(E.bond)&&Math.round(w.cash)===Math.round(E.cash)}function v(){if(e!==ss){ri=!1,n&&(n.disabled=!1,n.textContent="Optimise Allocation"),i.innerHTML="";return}try{const w=Math.min(L+C,d.length);for(;L<w;L++)N.push(A(d[L]));i.innerHTML='<div class="loading"><div class="spinner"></div>Testing allocations... '+L+"/"+d.length+"</div>",L<d.length?setTimeout(v,0):(z=q([...N,R]),_())}catch(w){console.error("Optimisation error:",w),i.innerHTML='<div class="alert alert-danger">Error: '+w.message+"</div>",ri=!1,n&&(n.disabled=!1,n.textContent="Optimise Allocation")}}function _(){if(e!==ss){ri=!1,n&&(n.disabled=!1,n.textContent="Optimise Allocation"),i.innerHTML="";return}const w=c>0?R.cash/c*100:0,E=c>0?R.equity/c*100:0,b=w>90||w<5||E<5?'<div class="alert alert-info" style="margin-bottom:16px;font-size:13px;">Your current split is outside the range the optimiser sweeps, but it was included in this comparison.</div>':"",le=z&&!T(z,R)&&(z.coverage>R.coverage+.5||z.coverage>=R.coverage-.01&&z.avgProt<R.avgProt-3),pe=(ee,ne)=>{const te=Me=>Math.round(Me/c*100);return'<div style="padding:16px;border-radius:8px;'+(ne?"background:rgba(46,160,67,0.1);border:1px solid var(--success);":"background:rgba(0,0,0,0.2);")+'"><div style="font-weight:500;margin-bottom:10px;color:var(--'+(ne?"success":"text-muted")+');">'+(ne?"Optimised split":"Your current split")+'</div><div style="font-size:26px;font-weight:700;color:var(--'+(ne?"success":"warning")+');">'+ee.coverage.toFixed(0)+'%</div><div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">of retirement years funded'+(ne?" ("+(z.coverage-R.coverage>=0?"+":"")+(z.coverage-R.coverage).toFixed(0)+"%)":"")+'</div><div style="font-size:13px;">Equity '+te(ee.equity)+"% · Bonds "+te(ee.bond)+"% · Cash "+te(ee.cash)+'%</div><div style="font-size:12px;color:var(--text-muted);margin-top:8px;">'+ee.rate.toFixed(0)+"% never run out · "+j(ee.medianFinal)+" typically left</div></div>"};let H="";if(le){const ee=z.medianFinal-R.medianFinal,ne=R.medianFinal>0?ee/R.medianFinal*100:0;H+='<div class="card" style="margin-top:20px;border-color:var(--success);">',H+='<h3 style="color:var(--success);margin-top:0;">A better fund split</h3>',H+='<p style="color:var(--text-muted);margin-bottom:16px;">This split funds more of your retirement (higher coverage). Coverage credits a plan for every year it pays for, so it prefers splits that fall short late over ones that fail early.</p>',H+=b,H+='<div class="grid-2" style="gap:20px;margin-bottom:20px;">'+pe(R,!1)+pe(z,!0)+"</div>",ee<0?H+='<div class="alert alert-warning" style="margin-bottom:16px;"><strong>Trade-off:</strong> it typically leaves '+Math.abs(ne).toFixed(0)+"% less at the end (usually less equity) — more safety, a bit less upside.</div>":ee>0&&(H+='<div class="alert alert-info" style="margin-bottom:16px;"><strong>Bonus:</strong> it also typically leaves '+ne.toFixed(0)+"% more at the end.</div>"),H+='<button onclick="applyOptimisedAllocationUI('+z.equity+","+z.bond+","+z.cash+')" style="width:100%;">Apply this split to your Settings</button>',H+="</div>"}else H+='<div class="card" style="margin-top:20px;border-color:var(--primary);">',H+='<h3 style="color:var(--primary);margin-top:0;">Your split is already about as good as it gets</h3>',H+=b,H+='<p style="color:var(--text-muted);">We tested '+d.length+" fund splits. Yours funds "+R.coverage.toFixed(0)+"% of retirement years — the best, or within 0.5% of it, with no clearly better low-protection alternative.</p>",H+='<p style="font-size:13px;color:var(--text-muted);">Your split — Equity '+Math.round(E)+"% · Bonds "+Math.round(R.bond/c*100)+"% · Cash "+Math.round(w)+"% · "+R.rate.toFixed(0)+"% never run out.</p>",H+="</div>";i.innerHTML=H,ri=!1,n&&(n.disabled=!1,n.textContent="Optimise Allocation")}setTimeout(v,0)};window.applyOptimisedAllocationUI=async function(t,e,n){if(writeAlloc("ss",t,e,n),writeAlloc("ds",t,e,n),wd({equityMin:t,bondMin:e,cashTarget:n,duration:parseInt(document.getElementById("ssDuration").value)||35}),Na(),dt())try{await js({equityMin:t,bondMin:e,cashTarget:n})}catch(i){console.error("Error saving optimised settings:",i)}showToast("Optimised allocation applied to settings and starting values. Scroll up to re-run.","success",4e3)};const iS={1929:"Wall Street Crash / Great Depression",1930:"Great Depression",1931:"Great Depression",1932:"Great Depression",1937:"Recession of 1937",1968:"Late 1960s stagflation",1969:"Late 1960s recession",1973:"Oil Crisis / 1973-74 crash",1974:"1973-74 bear market",2e3:"Dot-com bubble burst",2001:"Dot-com bust / 9/11",2007:"Global Financial Crisis",2008:"Global Financial Crisis",2022:"Post-COVID inflation / rate hikes"};function rS(t){if(!t||t.length===0)return"";const e=t.filter(s=>s.failed).sort((s,o)=>s.years-o.years),n=t.filter(s=>s.protMonths>0).sort((s,o)=>o.protMonths-s.protMonths),i=e.length>0?e.slice(0,5):n.slice(0,5);if(i.length===0)return"";let r=`
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
      `;return i.forEach(s=>{const o=s.startYear||s.seed,l=iS[o]||"-",c=s.failed?"danger":"success";r+=`
          <tr>
            <td>${o}</td>
            <td style="font-size: 12px;">${l}</td>
            <td>${s.years.toFixed(1)}</td>
            <td>${s.protMonths}</td>
            <td>${j(s.final)}</td>
            <td style="color: var(--${c});">${s.failed?"FAILED":"OK"}</td>
          </tr>
        `}),r+=`
              </tbody>
            </table>
          </div>
        </details>
      `,r}function Dn(t){return`<span class="hlp" tabindex="0" data-tip="${String(t).replace(/"/g,"&quot;")}">?</span>`}function sS(){if(window.__helpTipInit)return;window.__helpTipInit=!0;const t=document.createElement("div");t.className="help-tip",t.style.display="none",document.body.appendChild(t);let e=null;const n=r=>{const s=r.getAttribute("data-tip");if(!s)return;clearTimeout(e),t.textContent=s,t.style.display="block";const o=r.getBoundingClientRect(),l=Math.min(260,window.innerWidth-24);t.style.width=l+"px";let c=o.left+o.width/2-l/2+window.scrollX;c=Math.max(12+window.scrollX,Math.min(c,window.scrollX+window.innerWidth-l-12)),t.style.left=c+"px";const d=t.offsetHeight;let f=o.top+window.scrollY-d-8;o.top<d+12&&(f=o.bottom+window.scrollY+8),t.style.top=f+"px"},i=()=>{e=setTimeout(()=>{t.style.display="none"},80)};document.addEventListener("mouseover",r=>{const s=r.target.closest&&r.target.closest("[data-tip]");s&&n(s)}),document.addEventListener("mouseout",r=>{r.target.closest&&r.target.closest("[data-tip]")&&i()}),document.addEventListener("focusin",r=>{const s=r.target.closest&&r.target.closest("[data-tip]");s&&n(s)}),document.addEventListener("focusout",r=>{r.target.closest&&r.target.closest("[data-tip]")&&i()}),document.addEventListener("click",r=>{const s=r.target.closest&&r.target.closest("[data-tip]");s&&(t.style.display==="block"?i():n(s))})}function oS(){if(window.__chartHoverInit)return;window.__chartHoverInit=!0;const t=e=>e.querySelectorAll("circle[data-tip]").forEach(n=>{n.setAttribute("fill","transparent"),n.removeAttribute("stroke")});document.addEventListener("mousemove",e=>{const n=e.target.closest&&e.target.closest(".ichart");if(!n)return;const i=n.querySelectorAll("circle[data-tip]");if(!i.length)return;let r=null,s=1/0;i.forEach(o=>{const l=o.getBoundingClientRect(),c=Math.abs(l.left+l.width/2-e.clientX);c<s&&(s=c,r=o)}),r&&(t(n),r.setAttribute("fill","#60a5fa"),r.setAttribute("stroke","var(--surface,#161b22)"),r.setAttribute("stroke-width","2"),r.dispatchEvent(new MouseEvent("mouseover",{bubbles:!0})))}),document.addEventListener("mouseout",e=>{const n=e.target.closest&&e.target.closest(".ichart");n&&t(n)})}const Ni=t=>"£"+Math.round(t).toLocaleString();function mg(t,e,n){return`<svg class="ichart" viewBox="0 0 ${e} ${n}" style="width:100%;height:auto;overflow:visible;display:block" role="img">${t}</svg>`}function gg(t,{max:e,valueFmt:n=Ni,tip:i,pct:r=!1}={}){const m=t.length;if(m<2)return"";const p=e??(r?100:Math.max(1,...t)),y=N=>56+N/(m-1)*590,I=N=>174-Math.max(0,Math.min(r?100:1/0,N))/p*160,x=t.map((N,z)=>`${y(z).toFixed(1)},${I(N).toFixed(1)}`).join(" "),A=`56,${174 .toFixed(1)} ${x} ${y(m-1).toFixed(1)},${174 .toFixed(1)}`,R=r?[0,50,100]:[0,p/2,p],C=[0,Math.floor((m-1)/2),m-1],L=i||((N,z)=>`Year ${z}: ${n(N)}`);return mg(R.map(N=>`<line x1="56" y1="${I(N).toFixed(1)}" x2="646" y2="${I(N).toFixed(1)}" stroke="var(--border,#8883)" opacity=".45"/><text x="50" y="${(I(N)+3).toFixed(1)}" text-anchor="end" font-size="10" fill="var(--text-muted,#999)">${n(N)}</text>`).join("")+`<polygon points="${A}" fill="rgba(96,165,250,.13)"/><polyline points="${x}" fill="none" stroke="#60a5fa" stroke-width="2.5"/>`+t.map((N,z)=>`<circle cx="${y(z).toFixed(1)}" cy="${I(N).toFixed(1)}" r="8" fill="transparent" data-tip="${L(N,z).replace(/"/g,"&quot;")}"></circle>`).join("")+C.map(N=>`<text x="${y(N).toFixed(1)}" y="192" text-anchor="middle" font-size="10" fill="var(--text-muted,#999)">Year ${N}</text>`).join(""),660,200)}function aS(t){const l=t.p50.length;if(l<2)return"";const c=Math.max(1,...t.p90),d=x=>60+x/(l-1)*606,f=x=>222-Math.max(0,x)/c*208,m=(x,A)=>x.map((R,C)=>`${d(C).toFixed(1)},${f(R).toFixed(1)}`).concat(A.map((R,C)=>`${d(l-1-C).toFixed(1)},${f(A[l-1-C]).toFixed(1)}`)).join(" "),p=x=>x.map((A,R)=>`${d(R).toFixed(1)},${f(A).toFixed(1)}`).join(" "),y=[0,c/4,c/2,3*c/4,c],I=[0,Math.floor((l-1)/2),l-1];return mg(y.map(x=>`<line x1="60" y1="${f(x).toFixed(1)}" x2="666" y2="${f(x).toFixed(1)}" stroke="var(--border,#8883)" opacity=".4"/><text x="54" y="${(f(x)+3).toFixed(1)}" text-anchor="end" font-size="10" fill="var(--text-muted,#999)">${Ni(x)}</text>`).join("")+`<polygon points="${m(t.p90,t.p10)}" fill="rgba(96,165,250,.12)"/><polygon points="${m(t.p75,t.p25)}" fill="rgba(96,165,250,.22)"/><polyline points="${p(t.p50)}" fill="none" stroke="#60a5fa" stroke-width="2.5"/>`+t.p50.map((x,A)=>`<circle cx="${d(A).toFixed(1)}" cy="${f(x).toFixed(1)}" r="8" fill="transparent" data-tip="Year ${A}: middle ${Ni(x)}; likely range ${Ni(t.p10[A])} to ${Ni(t.p90[A])}"></circle>`).join("")+I.map(x=>`<text x="${d(x).toFixed(1)}" y="242" text-anchor="middle" font-size="10" fill="var(--text-muted,#999)">Year ${x}</text>`).join(""),680,250)}function lS(t){if(!t||!t.funded)return"";const e=r=>(r||0).toFixed(r>=10?0:1),n=t.pctSurviveFullTerm>=80?"success":t.pctSurviveFullTerm>=50?"warning":"danger",i=t.avgHigherRateYears<1?"success":t.avgHigherRateYears<4?"warning":"danger";return`
        <h3 style="margin:24px 0 4px;">Your tax-free ISA bridge</h3>
        <p style="color:var(--text-muted);font-size:12px;margin:0 0 12px;">
          The ISA (starting at ${j(t.startBalance)}) is drawn tax-free to top your income up, keeping you out of higher-rate tax. Modelled as a steady money-market fund.
        </p>
        <div class="keynums">
          <div class="keynum ${n}">
            <div class="kn-val">${t.pctSurviveFullTerm.toFixed(0)}%</div>
            <div class="kn-label">of futures the ISA still has real money at the end ${Dn("The ISA is treated as used up once its value in present-day money falls below 5% of what you started with — money-market growth leaves a tiny nominal sliver forever, so an exactly-zero test would be misleading.")}</div>
          </div>
          <div class="keynum">
            <div class="kn-val">${e(t.medianLastedYears)} yrs</div>
            <div class="kn-label">the ISA typically lasts before it's used up ${Dn("Median year its value in present-day money drops below 5% of the starting balance — the point it stops meaningfully topping up your income. Matches the chart below.")}</div>
          </div>
          <div class="keynum ${i}">
            <div class="kn-val">${e(t.avgHigherRateYears)} yrs</div>
            <div class="kn-label">typically paying 40% (higher-rate) tax ${Dn("Years you pay higher-rate income tax because the ISA has run out and income must come from the taxable pension above the basic-rate limit. A bigger ISA reduces these.")}</div>
          </div>
          <div class="keynum">
            <div class="kn-val">${j(t.medianTotalTax)}</div>
            <div class="kn-label">typical lifetime income tax, today's money ${Dn("Median total income tax paid over the whole plan, in present-day spending power.")}</div>
          </div>
        </div>
        <div style="margin-bottom:8px;">
          <div class="chart-caption">Typical ISA balance still to hand, year by year (today's money — hover a point for the figure). A slow, steady fall means it's being drawn as intended; a flat line means it's barely touched (larger than this plan needs); a drop to £0 marks when it typically runs out.</div>
          ${gg(t.medianIsaByYear,{valueFmt:Ni,tip:(r,s)=>`Year ${s}: typically ${Ni(r)} of ISA left`})}
        </div>`}function cS(t){return t==="sequence"?"The failing futures were sunk by a bad first few years of markets. Holding a bigger cash/bond buffer for the early years, or starting with a slightly lower withdrawal, would let the plan ride out an early slump.":t==="inflation"?"The failing futures were driven by high inflation eroding your spending power. More inflation protection (e.g. index-linked gilts) and less plain cash would help — cash loses to inflation over time.":t==="market"?"The failing futures simply had weak markets throughout. A slightly lower withdrawal rate, or more growth assets (equities) accepting more short-term ups and downs, gives more headroom.":"Lowering your target income, delaying the start, or a larger starting pot would all raise the odds."}function dS(t,e){const n=t.severity||{},i=t.successRate,r=i>=90?{t:"Very likely to last",c:"success"}:i>=75?{t:"Likely to last — with some risk",c:"success"}:i>=50?{t:"At real risk of running out",c:"warning"}:{t:"Unlikely to last as planned",c:"danger"};let s=`<div class="verdict verdict-${r.c}">
        <div class="verdict-title">Will your money last? — ${r.t}</div>
        <div class="verdict-heroes">
          <div><span class="hero">${i.toFixed(0)}%</span>
            <span class="hero-sub">chance your money lasts the whole plan ${Dn("Out of "+e+", the share where your pot never runs out before the end of the plan. Higher is better.")}</span></div>
          <div><span class="hero" style="font-size:30px;">${(n.coverage||0).toFixed(0)}%</span>
            <span class="hero-sub">of retirement years funded (coverage) ${Dn('The average share of retirement years your plan pays for, across every simulated future — so a plan that funds 34 of 35 years scores 97%, and a late shortfall counts far less than an early one. Based on the retirement "coverage ratio" (Estrada & Kritzman, 2019). Note: it is capped at 100% and ignores any money left over, and it is an average — check the worst-case minimum below.')}</span></div>
        </div>
        <div class="verdict-basis">Based on ${e}. Pot and income values are shown in today's money.</div>
      </div>`;return n.failCount>0&&(s+=`<div class="callout">
          <div class="callout-title">Why it might fall short</div>
          <p>${n.diagnosis}</p>
          <p class="lever"><strong>What could help:</strong> ${cS(n.primaryDriver)}</p>
        </div>`),s}function yg(t,e,n,i,r){sS(),oS();const s=t.survival||{},o=t.finalReal||{},l=t.protection||{},c=l.pctWithProtection!=null?l.pctWithProtection:(l.runsWithProtection||0)/(e.length||1)*100,d=i==="mcResults",f=d?`${e.length.toLocaleString()} simulated futures`:`${e.length} historical periods since 1928`;let m=`
        <div class="card">
          <h2>${n}</h2>

          ${dS(t,f)}

          <div class="keynums">
            <div class="keynum">
              <div class="kn-val">${Math.round(s.min||0)} / ${r} yrs</div>
              <div class="kn-label">worst simulated future — money lasted this long ${Dn("The single unluckiest of all the simulated futures — the true tail. The average coverage can look reassuring; this is the worst it ever got. (10th-percentile: at least "+(s.p10||0).toFixed(0)+" years.)")}</div>
            </div>
            <div class="keynum">
              <div class="kn-val">${j(o.p50||0)}</div>
              <div class="kn-label">typically left at the end, today's money ${Dn("The middle outcome for the pension pot left at the end, in present-day spending power. Futures that ran out count as £0, so this is not flattered by only the lucky runs.")}</div>
            </div>
            <div class="keynum">
              <div class="kn-val">${c.toFixed(0)} in 100</div>
              <div class="kn-label">futures where the plan had to cut back spending ${Dn("To ride out a market slump the plan temporarily reduces withdrawals. This is how often that safety response was needed.")}</div>
            </div>
          </div>

          <h3 style="margin:8px 0 4px;">How your pot changes over time (today's money)</h3>
          <div class="chart-caption">The blue line is the middle outcome; the darker band is the middle half of futures, the lighter band the 10th–90th. Futures that ran out count as £0, so a sinking band means real risk. Hover any point for the figures.</div>
          ${aS(t.chartData.potBand)}

          <h3 style="margin:22px 0 4px;">Chance your plan is still going, year by year</h3>
          <div class="chart-caption">Share of futures in which the money hasn't run out yet — starts at 100% and dips where plans tend to fail. A late dip means most shortfalls happen late.</div>
          ${gg(t.chartData.solvency,{pct:!0,valueFmt:p=>p.toFixed(0)+"%",tip:(p,y)=>`Year ${y}: ${p.toFixed(0)}% of plans still going`})}

          ${lS(t.isa)}

          <details style="margin-top:22px;">
            <summary style="cursor:pointer;font-weight:600;color:var(--primary);">More detail — worst historical periods &amp; full statistics</summary>
            <div style="margin-top:16px;">
              ${i==="histResults"?rS(e):""}

              <h4 style="margin:20px 0 8px;">Pot left at the end — full range (today's money)</h4>
              <div class="grid-7" style="display:grid;grid-template-columns:repeat(7,1fr);gap:10px;">
                ${[["p5","unluckiest 5%"],["p10","10%"],["p25","25%"],["p50","middle"],["p75","75%"],["p90","90%"],["p95","luckiest 5%"]].map(([p,y])=>`
                  <div class="stat-box mini">
                    <div class="stat-value" style="font-size:13px;">${j(o[p]||0)}</div>
                    <div class="stat-label" style="font-size:10px;">${y}</div>
                  </div>`).join("")}
              </div>
              <p style="font-size:12px;color:var(--text-muted);margin-top:14px;line-height:1.6;">
                Based on ${f}. ${d?"Monte Carlo builds each future by stitching together random 5-year blocks of real history (1928–2024), so market slumps and inflation spikes arrive in realistic sustained runs rather than one-off years.":"Each run replays an actual stretch of history in its real order, capturing the true sequence of good and bad years."}
                A future "runs out" when the pension/cash pots hit zero before the plan ends.
              </p>
            </div>
          </details>
        </div>
      `;document.getElementById(i).innerHTML=m}function uS(t,e){let n='<div class="card"><h2>Scenario Analysis</h2>';n+=`
        <div class="chart-container" style="margin-bottom: 24px;">
          <canvas id="scenCompChart" width="900" height="400"></canvas>
        </div>
      `,n+='<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">';for(const[i,r]of Object.entries(t)){const s=r.result,o=s.failed?"danger":"success";n+=`
          <div class="history-item" style="border-left: 4px solid ${r.color};">
            <div>
              <div class="history-date">${r.name}</div>
              <div class="history-details">
                Protection: ${s.protMonths} mo | Max streak: ${s.maxConsec} mo
                ${s.hodlUsed>0?` | HODL used: ${j(s.hodlUsed)}`:""}
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 24px; color: var(--${o});">${s.years.toFixed(1)} yrs</div>
              <div style="font-size: 12px; color: var(--${o});">${s.failed?"FAILED":"OK"}</div>
              <div style="font-size: 11px; color: var(--text-muted);">Final: ${j(s.final)}</div>
            </div>
          </div>
        `}n+="</div></div>",document.getElementById(e).innerHTML=n,setTimeout(()=>{const i=document.getElementById("scenCompChart");i&&t&&Gx(i,t,{years:35,title:"Scenario Comparison"})},50)}const Oa={cautious:{key:"cautious",label:"Cautious",equity:.3,bond:.45,diversifiers:.12,cash:.13},balanced:{key:"balanced",label:"Balanced",equity:.5,bond:.3,diversifiers:.15,cash:.05},adventurous:{key:"adventurous",label:"Adventurous",equity:.65,bond:.15,diversifiers:.15,cash:.05}};function vg(t){const e=document.getElementById(t+"Diversifiers");return!!(e&&e.checked)}window._customAlloc=window._customAlloc||{};window._allocMode=window._allocMode||{};function _d(t){return window._allocMode[t]||"risk"}function bg(t){if(window._customAlloc[t])return window._customAlloc[t];const e=document.querySelector("#"+t+"Risks .risk-card.active"),n=e&&e.dataset.risk||"balanced",i=vg(t)?Oa:Fn;return i[n]||i.balanced}function wg(t,e,n,i){i=i||0;const r=i>.001?Oa:Fn;let s="balanced",o=1/0;for(const l in r){const c=r[l],d=(c.equity-t)**2+(c.bond-e)**2+((c.diversifiers||0)-i)**2+(c.cash-n)**2;d<o&&(o=d,s=l)}return s}window.updateAllocDisplay=function(t){const e=bg(t),n=Math.round(e.equity*100),i=Math.round(e.bond*100),r=Math.round(e.cash*100),s=Math.round((e.diversifiers||0)*100),o=document.getElementById(t+"AllocAmounts"),l=window._customAlloc[t],c=document.getElementById(t+"Pot");if(l&&c){const N=Math.round((l.equityMin||0)+(l.bondMin||0)+(l.cashTarget||0)+(l.diversifierStart||0));+c.value!==N&&(c.value=N,c._updateOverlay&&c._updateOverlay());const z=document.getElementById(t+"PotDisplay");z&&(z.textContent="£"+N.toLocaleString())}const d=+document.getElementById(t+"Pot").value||0,f=l?l.equityMin:Math.round(d*n/100),m=l?l.bondMin:Math.round(d*i/100),p=l?l.cashTarget:Math.round(d*r/100),y=l?l.diversifierStart||0:Math.round(d*s/100),I=s>0?" &middot; "+s+"% diversifiers":"",x=s>0?" &middot; £"+y.toLocaleString()+" diversifiers":"";o&&(o.innerHTML="<strong>"+e.label+"</strong> &mdash; "+n+"% shares &middot; "+i+"% bonds"+I+" &middot; "+r+'% cash<br><span style="color:var(--text-muted);">£'+f.toLocaleString()+" shares &middot; £"+m.toLocaleString()+" bonds"+x+" &middot; £"+p.toLocaleString()+" cash</span>");const A=document.getElementById(t+"EquityGlide"),R=!!(A&&A.checked),C=document.getElementById(t+"GlideEndgame");C&&(R&&l?(C.style.display="block",C.innerHTML=fS(t)):C.style.display="none");const L=document.getElementById(t+"GlideMinNote");L&&(R?(L.style.display="block",L.innerHTML=hS(t,e)):L.style.display="none")};function hS(t,e){const n=document.getElementById(t+"Duration"),i=n&&+n.value||35,r=Math.max(5,i-20),s=e.cash,o=e.diversifiers||0,l=1-s-o,c=window._customAlloc[t],d=!!c,f=d&&c.glideEndgame?c.glideEndgame:null,m=d?Jh(e.equity,e.bond,f):Cs(e.equity,e.bond),p=Math.round(l*m.start*100),y=Math.round(l*m.end*100),I=Math.round(l*(1-m.start)*100),x=Math.round(l*(1-m.end)*100),A=Math.round(s*100),R=Math.round(o*100),C=6,L=314,N=18,z=104,q=z-N,T=we=>(z-we*q).toFixed(1),v=(C+(L-C)*Math.min(1,r/i)).toFixed(1),_=T(s),w=T(s+o),E=T(s+o+l*(1-m.start)),S=T(s+o+l*(1-m.end)),b="#6366f1",le="#14b8a6",pe="#94a3b8",H="#f59e0b",ee=o>0?`<polygon points="${C},${_} ${L},${_} ${L},${w} ${C},${w}" fill="${H}"></polygon>`:"",ne=`<svg viewBox="0 0 320 122" style="width:100%;height:auto;display:block;" preserveAspectRatio="none"><polygon points="${C},${z} ${L},${z} ${L},${_} ${C},${_}" fill="${pe}"></polygon>`+ee+`<polygon points="${C},${w} ${L},${w} ${L},${S} ${v},${S} ${C},${E}" fill="${le}"></polygon><polygon points="${C},${E} ${v},${S} ${L},${S} ${L},${N} ${C},${N}" fill="${b}"></polygon><line x1="${v}" y1="${N}" x2="${v}" y2="${z}" stroke="rgba(148,163,184,0.9)" stroke-width="1" stroke-dasharray="3,2"></line></svg>`,te=we=>`<span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${we};vertical-align:middle;"></span>`,Me=o>0?" · "+R+"% diversifiers":"",Pe=o>0?" &nbsp; "+te(H)+" Diversifiers":"",ye=d?"Now (your funds)":"Starts",O=d?"Rises to"+(f&&f.label?" ("+f.label+")":""):"Then holds ("+e.label+")",Z=d?"rises from your holdings, levels off at year "+r:"reaches your mix at year "+r+", then holds";return'<div style="font-weight:600;margin-bottom:6px;">How your mix glides over '+i+" years</div>"+ne+'<div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);margin-top:3px;"><span>Now</span><span>'+Z+'</span></div><div style="display:flex;justify-content:space-between;gap:12px;font-size:12px;margin-top:8px;"><span><strong>'+ye+"</strong><br>"+p+"% shares · "+I+"% bonds"+Me+" · "+A+'% cash</span><span style="text-align:right;"><strong>'+O+"</strong><br>"+y+"% shares · "+x+"% bonds"+Me+" · "+A+'% cash</span></div><div style="font-size:12px;margin-top:8px;">'+te(b)+" Shares &nbsp; "+te(le)+" Bonds"+Pe+" &nbsp; "+te(pe)+" Cash</div>"}window.setRiskPreset=function(t,e){Fn[e]&&(window._allocMode[t]="risk",delete window._customAlloc[t],document.querySelectorAll("#"+t+"Risks .risk-card").forEach(n=>n.classList.toggle("active",n.dataset.risk===e)),updateAllocDisplay(t))};window.setAllocMode=function(t,e){window._allocMode[t]=e;const n=document.getElementById(t+"ModeRisk"),i=document.getElementById(t+"ModeFunds");n&&n.classList.toggle("active",e==="risk"),i&&i.classList.toggle("active",e==="funds");const r=document.getElementById(t+"RiskMode"),s=document.getElementById(t+"FundsMode");if(r&&(r.style.display=e==="risk"?"":"none"),s&&(s.style.display=e==="funds"?"":"none"),e==="funds")renderFunds(t),Ed(t);else if(delete window._customAlloc[t],!document.querySelector("#"+t+"Risks .risk-card.active")){const o=document.querySelector("#"+t+'Risks .risk-card[data-risk="balanced"]');o&&o.classList.add("active")}updateAllocDisplay(t),typeof updateEntryTagPrompt=="function"&&updateEntryTagPrompt()};function fS(t){const e=window._customAlloc[t]&&window._customAlloc[t].glideEndgame&&window._customAlloc[t].glideEndgame.key||"",n=(i,r)=>'<button type="button" class="risk-btn'+(e===i?" active":"")+`" style="padding:6px 12px;" onclick="setGlideEndgame('`+t+"','"+i+`')">`+r+"</button>";return'<div style="font-size:12px;color:var(--text-muted);margin-bottom:6px;"><strong>Glide towards</strong> — your funds are the start; the tent raises shares over time to this level:</div><div style="display:flex;gap:8px;flex-wrap:wrap;">'+n("cautious","Cautious")+n("balanced","Balanced")+n("adventurous","Adventurous")+"</div>"}window.setGlideEndgame=function(t,e){const n=window._customAlloc[t];if(!n)return;const r=(vg(t)?Oa:Fn)[e];if(!r)return;n.glideEndgame={equityPct:r.equity,bondPct:r.bond,key:e,label:r.label};const s=n.equity/(n.equity+n.bond||1);r.equity/(r.equity+r.bond||1)<=s&&showToast("That endgame isn’t more share-heavy than your holdings — the glide would flatten or decline, not rise.","warning",5e3),updateAllocDisplay(t)};window.readAlloc=function(t){const e=window._customAlloc[t];if(e){const o={equityMin:e.equityMin,bondMin:e.bondMin,cashTarget:e.cashTarget};return e.diversifierStart>0&&(o.diversifierStart=e.diversifierStart),e.subAsset&&(o.subAsset=e.subAsset),e.glideEndgame&&(o.glideEndgame=e.glideEndgame),o}const n=+document.getElementById(t+"Pot").value||0,i=bg(t),r={equityMin:Math.round(n*i.equity),bondMin:Math.round(n*i.bond),cashTarget:Math.round(n*i.cash)},s=i.diversifiers||0;return s>0&&(r.diversifierStart=Math.round(n*s),r.subAsset={}),r};window.writeAlloc=function(t,e,n,i,r){const s=+r||0,o=(+e||0)+(+n||0)+(+i||0)+s;document.getElementById(t+"Pot").value=Math.round(o);const l=document.getElementById(t+"Diversifiers");l&&(l.checked=s>0);const c=o>0?Math.round((+e||0)/o*100):50,d=o>0?Math.round((+n||0)/o*100):40,f=o>0?wg((+e||0)/o,(+n||0)/o,(+i||0)/o,s/o):"balanced";document.querySelectorAll("#"+t+"Risks .risk-card").forEach(p=>p.classList.toggle("active",p.dataset.risk===f)),updateAllocDisplay(t);const m=(s>0?Oa:Fn)[f];if(o>0&&(c!==Math.round(m.equity*100)||d!==Math.round(m.bond*100))){const p=document.getElementById(t+"AllocAmounts");p&&(p.innerHTML+='<div style="margin-top:8px;color:#b45309;font-size:12px;">Your saved split ('+c+"% / "+d+"% / "+Math.max(0,100-c-d)+"%) was matched to the nearest risk level (<strong>"+m.label+"</strong>). Pick another if you prefer — saving keeps this one.</div>")}};window._taggedFunds=window._taggedFunds||{};function Mt(t){return window._taggedFunds[t]=window._taggedFunds[t]||[]}const _g={shares:"Shares",bonds:"Bonds",diversifiers:"Diversifiers",cash:"Cash"};function pS(t){const e=document.getElementById(t+"FundCatalogue");e&&!e.childElementCount&&(e.innerHTML=Ca.map(n=>'<option value="'+n.ticker+'">'+n.ticker+" — "+n.name+"</option>").join(""))}function Zo(t){return t.subClass||$m[(t.ticker||"").toUpperCase().trim()]||""}window.reformatMoney=function(t){const e=parseFloat(String(t.value).replace(/[^0-9.]/g,""));t.value=isNaN(e)||e===0?"":md(e)};function mS(t,e,n){if(t=t.toLowerCase().trim(),!t)return 0;const i=e.toLowerCase(),r=n.toLowerCase();if(i===t)return 1e3;if(i.startsWith(t))return 900-(i.length-t.length);if(r.split(/[^a-z0-9]+/).filter(Boolean).some(l=>l.startsWith(t)))return 820;if(i.includes(t))return 720;if(r.includes(t))return 660-Math.min(50,r.indexOf(t));const o=l=>{let c=0;for(const d of l)if(d===t[c]&&c++,c===t.length)return!0;return!1};return o(i)?360:o(r)?300:0}function gS(t,e=8){return Ca.map(n=>({f:n,s:mS(t,n.ticker,n.name)})).filter(n=>n.s>0).sort((n,i)=>i.s-n.s).slice(0,e).map(n=>n.f)}window.showFundSearch=function(t,e){const n=document.getElementById(t+"FundSearchResults");if(!n)return;const i=gS(e);if(!e.trim()||!i.length){n.style.display="none",n.innerHTML="";return}n.innerHTML=i.map(r=>`<div class="fund-search-item" onmousedown="addFundFromSearch('`+t+"','"+r.ticker+`')" style="padding:7px 10px; cursor:pointer;"><strong>`+r.ticker+'</strong> <span style="color:var(--text-muted);font-size:12px;">'+r.name+"</span></div>").join(""),n.style.display="block"};window.hideFundSearch=function(t){const e=document.getElementById(t+"FundSearchResults");e&&(e.style.display="none")};window.addFundFromSearch=function(t,e){const n=td(e);Mt(t).push({ticker:e,value:"",wrapper:"SIPP",subClass:n?n.subClass:""});const i=document.getElementById(t+"FundSearch");i&&(i.value=""),hideFundSearch(t),renderFunds(t)};function Eg(t,e,n){const i=uI();let r='<option value="">— not set —</option>';for(const s of["shares","bonds","diversifiers","cash"]){const o=i[s]||[];o.length&&(r+='<optgroup label="'+_g[s]+'">'+o.map(l=>'<option value="'+l.key+'"'+(l.key===n?" selected":"")+">"+l.label+"</option>").join("")+"</optgroup>")}return`<select onchange="updateFundField('`+t+"',"+e+`,'subClass',this.value)" style="width:190px;">`+r+"</select>"}window.renderFunds=function(t){const e=document.getElementById(t+"FundRows");e&&(pS(t),e.innerHTML=Mt(t).map((n,i)=>'<tr><td style="padding:3px 6px;"><input type="text" list="'+t+'FundCatalogue" value="'+(n.ticker||"")+`" oninput="updateFundField('`+t+"',"+i+`,'ticker',this.value)" style="width:92px;text-transform:uppercase;" placeholder="e.g. VWRL"></td><td style="padding:3px 6px;"><input type="text" inputmode="numeric" value="`+(n.value?md(n.value):"")+`" oninput="updateFundField('`+t+"',"+i+`,'value',this.value)" onblur="reformatMoney(this)" style="width:110px;" placeholder="0"></td><td style="padding:3px 6px;"><select onchange="updateFundField('`+t+"',"+i+`,'wrapper',this.value)" style="width:74px;"><option`+(n.wrapper!=="ISA"?" selected":"")+">SIPP</option><option"+(n.wrapper==="ISA"?" selected":"")+'>ISA</option></select></td><td id="'+t+"_fcat_"+i+'" style="padding:3px 6px;">'+Eg(t,i,Zo(n))+`</td><td style="padding:3px 6px;"><button type="button" class="risk-btn" style="padding:2px 8px;" onclick="removeFund('`+t+"',"+i+')">&times;</button></td></tr>').join(""),Tg(t))};window.updateFundField=function(t,e,n,i){const r=Mt(t)[e];if(r){if(n==="value")r.value=parseFloat(String(i).replace(/[^0-9.]/g,""))||0;else if(n==="ticker"){r.ticker=i;const s=td(i);s&&(r.subClass=s.subClass);const o=document.getElementById(t+"_fcat_"+e);o&&(o.innerHTML=Eg(t,e,Zo(r)))}else n==="subClass"?r.subClass=i:r[n]=i;Tg(t)}};window.addFundRow=function(t){Mt(t).push({ticker:"",value:"",wrapper:"SIPP"}),renderFunds(t)};window.removeFund=function(t,e){Mt(t).splice(e,1),renderFunds(t)};window.clearFunds=function(t){window._taggedFunds[t]=[],renderFunds(t)};function Tg(t){const e=document.getElementById(t+"FundSummary");if(!e)return;const n=Mt(t).filter(c=>c.ticker&&c.value>0);if(!n.length){e.innerHTML='<span style="color:var(--text-muted);font-size:12px;">Add holdings above to see the bucket roll-up.</span>';return}const i=dd(n),r=c=>i.total?Math.round(i.buckets[c]/i.total*100):0,s=c=>"£"+Math.round(c).toLocaleString(),o=c=>Object.entries(c).map(([d,f])=>Xt[d].label+" "+Math.round(f*100)+"%").join(" · ");let l='<div style="font-weight:600;margin-bottom:6px;">Rolls up to ('+s(i.total)+" total"+(i.isaTotal?", "+s(i.isaTotal)+" ISA":"")+")</div>";l+='<div style="font-size:13px;">';for(const c of["shares","bonds","diversifiers","cash"])i.buckets[c]&&(l+="<div><strong>"+_g[c]+"</strong>: "+s(i.buckets[c])+" ("+r(c)+"%)"+(c==="bonds"&&Object.keys(i.bondWeights).length?' <span style="color:var(--text-muted);font-size:11px;">— '+o(i.bondWeights)+"</span>":"")+(c==="diversifiers"&&Object.keys(i.diversifierWeights).length?' <span style="color:var(--text-muted);font-size:11px;">— '+o(i.diversifierWeights)+"</span>":"")+"</div>");l+="</div>",i.untagged.length&&(l+='<div style="color:#b45309;font-size:12px;margin-top:6px;">Not recognised (ignored): '+i.untagged.map(c=>c.ticker).join(", ")+"</div>"),e.innerHTML=l,_d(t)==="funds"&&(Ed(t),updateAllocDisplay(t))}function Ed(t){const e=Mt(t).filter(l=>l.ticker&&l.value>0);if(!e.length)return delete window._customAlloc[t],null;const n=dd(e),i=bx(n),r=window._customAlloc[t]||{};window._customAlloc[t]={label:"Your funds",equity:n.total?n.buckets.shares/n.total:0,bond:n.total?n.buckets.bonds/n.total:0,diversifiers:n.total?n.buckets.diversifiers/n.total:0,cash:n.total?n.buckets.cash/n.total:0,equityMin:i.equityStart,bondMin:i.bondStart,cashTarget:i.cashStart,diversifierStart:i.diversifierStart||0,subAsset:i.subAsset||null,glideEndgame:r.glideEndgame||null};const s=document.getElementById(t+"Pot");s&&(s.value=Math.round(n.total),s._updateOverlay&&s._updateOverlay());const o=document.getElementById(t+"Diversifiers");if(o&&(o.checked=(i.diversifierStart||0)>0),n.isaTotal){const l=document.getElementById(t+"IsaBalance");l&&(l.value=Math.round(n.isaTotal),l._updateOverlay&&l._updateOverlay())}return n}window.applyTaggedPortfolio=function(t){if(window._allocMode[t]="funds",!Ed(t)){showToast("Add some holdings first","warning");return}updateAllocDisplay(t)};window.restoreCustomAllocFromSettings=function(t,e){if(e&&e.subAsset&&e.subAsset.bondWeights&&Object.keys(e.subAsset.bondWeights).length){const n=(e.equityMin||0)+(e.bondMin||0)+(e.cashTarget||0)+(e.diversifierStart||0);window._customAlloc[t]={label:"Your funds",equity:n?e.equityMin/n:0,bond:n?e.bondMin/n:0,diversifiers:n?(e.diversifierStart||0)/n:0,cash:n?e.cashTarget/n:0,equityMin:e.equityMin,bondMin:e.bondMin,cashTarget:e.cashTarget,diversifierStart:e.diversifierStart||0,subAsset:e.subAsset,glideEndgame:e.glideEndgame||null}}else delete window._customAlloc[t]};function yS(t){const e={shares:[],bonds:[],diversifiers:[],cash:[]};t.tagged.forEach(s=>{e[s.bucket]&&e[s.bucket].push(s)});const n=s=>"£"+Math.round(s).toLocaleString(),i={shares:"Shares",bonds:"Bonds",diversifiers:"Diversifiers",cash:"Cash"};let r='<div style="font-size:12px;border:1px solid var(--border,#cbd5e1);border-radius:8px;padding:10px 12px;">';r+='<div style="font-weight:600;margin-bottom:6px;">Which of your funds went where</div>';for(const s of["shares","bonds","diversifiers","cash"]){if(!e[s].length)continue;const o=e[s].reduce((l,c)=>l+(+c.value||0),0);r+='<div style="margin:3px 0;"><strong>'+i[s]+"</strong> "+n(o)+': <span style="color:var(--text-muted);">'+e[s].map(l=>l.ticker).join(", ")+"</span></div>"}return t.isaTotal&&(r+='<div style="margin-top:4px;color:var(--text-muted);">of which £'+Math.round(t.isaTotal).toLocaleString()+" is in an ISA (the bridge)</div>"),t.untagged.length&&(r+='<div style="color:#b45309;margin-top:4px;">Not recognised: '+t.untagged.map(s=>s.ticker).join(", ")+"</div>"),r+="</div>",r}window._fundModal={fieldId:null,subtotal:0};window.openFundBucketModal=function(t,e,n){const i=Mt("ds").filter(s=>{const o=Zo(s);return s.ticker&&o&&Xt[o]&&Xt[o].bucket===t});window._fundModal={fieldId:e,subtotal:0},document.getElementById("fundModalTitle").textContent=n;const r=document.getElementById("fundModalRows");i.length?r.innerHTML=i.map(s=>{const o=td(s.ticker),l=Xt[Zo(s)],c=o?o.name:l?l.label:"";return'<div style="display:flex; align-items:center; justify-content:space-between; gap:12px; margin:8px 0;"><span><strong>'+s.ticker+'</strong> <span style="color:var(--text-muted);font-size:12px;">'+c+'</span></span><span style="white-space:nowrap;">£ <input type="number" class="fund-modal-input" oninput="updateFundModalSubtotal()" style="width:120px;" placeholder="0"></span></div>'}).join(""):r.innerHTML='<p style="color:var(--text-muted);">No '+n.toLowerCase()+" tagged yet. Define your holdings in <strong>Settings → Build from my funds</strong>, then come back — or just type the total into the box.</p>",updateFundModalSubtotal(),document.getElementById("fundBucketModal").style.display="flex"};window.updateFundModalSubtotal=function(){let t=0;document.querySelectorAll("#fundModalRows .fund-modal-input").forEach(e=>{t+=+e.value||0}),window._fundModal.subtotal=t,document.getElementById("fundModalSubtotal").textContent="Total: £"+Math.round(t).toLocaleString()};window.applyFundBucketModal=function(){const t=document.getElementById(window._fundModal.fieldId);t&&(t.value=Math.round(window._fundModal.subtotal||0)),closeFundBucketModal()};window.closeFundBucketModal=function(){document.getElementById("fundBucketModal").style.display="none"};window.updateEntryTagPrompt=function(){const t=document.getElementById("entryTagPrompt");if(!t)return;if(Mt("ds").filter(n=>n.ticker).length>0){t.style.display="none",t.innerHTML="";return}t.style.display="block",t.innerHTML='<div class="alert alert-info" style="font-size:13px;">The Decision Tool works from your real portfolio. Tag your funds in <strong>Settings → “Build from my funds”</strong> to enter values per fund via the <em>enter per fund ▸</em> links. You can still type bucket totals directly.</div>'};window.fillDecisionFromTaggedFunds=async function(){let t=Mt("ds").filter(r=>r.ticker&&r.value>0);if(t.length||(t=Mt("ss").filter(r=>r.ticker&&r.value>0)),!t.length)try{t=((await Bt()).taggedFunds||[]).filter(s=>s.ticker&&s.value>0)}catch{}if(!t.length){showToast('No tagged funds yet — tag your holdings in Settings → "Build from my funds", then come back.',"info",6e3);return}const e=dd(t),n=(r,s)=>{const o=document.getElementById(r);o&&(o.value=Math.round(s))};n("entryEquity",e.buckets.shares),n("entryBond",e.buckets.bonds),n("entryCash",e.buckets.cash),n("entryDiversifier",e.buckets.diversifiers),e.isaTotal&&n("entryIsa",e.isaTotal);const i=document.getElementById("entryFundTagHelp");i&&(i.innerHTML=yS(e)),showToast("Filled your fund values from "+t.length+" tagged funds","success")};function Ig(t,e){const n=(t.equityMin||0)+(t.bondMin||0)+(t.cashTarget||0),i=n>0?wg(t.equityMin/n,t.bondMin/n,t.cashTarget/n):"balanced",r=Fn[i],s=l=>"£"+Math.round(l||0).toLocaleString(),o=Math.round(r.equity*100)+"/"+Math.round(r.bond*100)+"/"+Math.round(r.cash*100);return`<div class="rpt-header">
        <h1>Pension Decision Plan</h1>
        <div class="rpt-sub">${e||""}</div>
        <table class="rpt-meta"><tbody>
          <tr><td>Total pot</td><td>${s(n)}</td><td>Risk level</td><td>${r.label} (${o})</td></tr>
          <tr><td>Bond tent</td><td>${t.equityGlideEnabled?"On — rising-equity glidepath":"Off"}</td><td>Target income</td><td>${s(t.baseSalary)}/yr</td></tr>
          <tr><td>Duration</td><td>${t.duration||35} yrs</td><td>Generated</td><td>${new Date().toLocaleDateString("en-GB")}</td></tr>
        </tbody></table>
      </div>`}function xg(t){let e=document.getElementById("printPortal");e||(e=document.createElement("div"),e.id="printPortal",document.body.appendChild(e)),e.innerHTML=t,document.body.classList.add("printing"),window.print()}window.addEventListener("afterprint",()=>{document.body.classList.remove("printing");const t=document.getElementById("printPortal");t&&(t.innerHTML="")});function vS(t,e,n){const i=new Blob([e],{type:n}),r=URL.createObjectURL(i),s=document.createElement("a");s.href=r,s.download=t,document.body.appendChild(s),s.click(),s.remove(),setTimeout(()=>URL.revokeObjectURL(r),1e3)}window.printAnnualReport=async function(t){const e=await bt();xg(Ig(e,"Annual report — tax year "+t)+document.getElementById("taxYearDetail").innerHTML)};window.printMonthlyReport=async function(t){const e=await bt();xg(Ig(e,"Monthly record — "+t)+document.getElementById("historyDetail").innerHTML)};window.exportAnnualCsv=function(t){const e=(typeof an<"u"?an:[]).filter(o=>o.taxYear===t).sort((o,l)=>(o.date||"").localeCompare(l.date||"")),n=o=>(o=o==null?"":String(o),/[",\n]/.test(o)?'"'+o.replace(/"/g,'""')+'"':o),i=o=>Math.round(o||0);let s=["Date","Draw source","SIPP draw","ISA draw","From equity","From bond","From cash","Protection","Equity target","Bond target","Cash target","Total pot","Rebalance"].map(n).join(",")+`
`;for(const o of e)s+=[o.date,o.source,i(o.sipp),i(o.isa),i(o.dEquity),i(o.dBond),i(o.dCash),o.inProtection?"Yes":"No",i(o.adjEquity),i(o.adjBond),i(o.adjCash),i(o.total),o.rebal||""].map(n).join(",")+`
`;e.length||(s+=`(no monthly records saved for this tax year yet)
`),vS("decision-plan-"+t.replace("/","-")+".csv",s,"text/csv;charset=utf-8;")};window.runCompareStrategiesUI=async function(t){const e=document.getElementById("optimiseBtn"+t),n=document.getElementById("optimiseResults"+t);e&&(e.disabled=!0,e.textContent="Comparing..."),n&&(n.innerHTML='<div class="loading"><div class="spinner"></div>Running six strategies…</div>');const i=JSON.parse(JSON.stringify(await Bt())),r=document.getElementById(t==="MC"?"mcYears":"histYears"),s=parseInt(r&&r.value)||i.duration,o=(i.equityMin||0)+(i.bondMin||0)+(i.cashTarget||0),l=Object.keys(zi).map(Number).sort((p,y)=>p-y),c=Math.max(...l),d=p=>{const y=[];if(t==="MC")for(let C=0;C<1e3;C++)y.push(Ar(p,sd(p,C),C));else l.forEach(C=>{if(C+s-1>c)return;const L={equity:{},inflation:{}};for(let N=0;N<s;N++)L.equity[N]=zi[C+N]||0,L.inflation[N]=ta[C+N]||.025;y.push(Ar(p,L,C))});const I=y.length||1,x=y.reduce((C,L)=>C+Math.min(1,(L.years||0)/(L.duration||s)),0)/I*100,A=y.filter(C=>!C.failed).length/I*100,R=y.reduce((C,L)=>Math.min(C,L.years||0),1/0);return{coverage:x,rate:A,minYears:R===1/0?0:R}},f=["cautious","balanced","adventurous"],m={};for(const p of f){const y=Fn[p];m[p]={};for(const I of[!1,!0]){const x={...i,equityMin:Math.round(o*y.equity),bondMin:Math.round(o*y.bond),cashTarget:Math.round(o*y.cash),equityGlideEnabled:I},A=Gs({years:s},x);m[p][I?"tent":"flat"]=d(A),await new Promise(R=>setTimeout(R,0))}}bS(n,m,f),e&&(e.disabled=!1,e.textContent="Compare strategies")};function bS(t,e,n){let i={cov:-1,key:null,tent:null};for(const o of n)for(const l of["flat","tent"])e[o][l].coverage>i.cov&&(i={cov:e[o][l].coverage,key:o,tent:l});const r=(o,l)=>`<td style="text-align:center;padding:10px;border:1px solid var(--border);${l?"background:rgba(16,185,129,0.12);":""}">
          <div style="font-size:22px;font-weight:700;color:var(--${l?"success":"text"});">${o.coverage.toFixed(0)}%</div>
          <div style="font-size:11px;color:var(--text-muted);">worst case ${o.minYears.toFixed(0)} yrs</div>
        </td>`;let s='<h3 style="margin-bottom:6px;">Compare strategies</h3>';s+=`<p style="color:var(--text-muted);font-size:13px;margin-bottom:12px;">Coverage = the share of your retirement years the pot funds (worst case = the fewest years it lasted in any run). More shares usually buys a little more coverage but a rougher ride; the bond tent mainly lifts the worst case. Pick the risk level you're comfortable holding — the tool won't change it for you.</p>`,s+='<table style="border-collapse:collapse;width:100%;max-width:520px;"><thead><tr><th style="text-align:left;padding:8px;"></th><th style="padding:8px;">Flat</th><th style="padding:8px;">+ Bond tent</th></tr></thead><tbody>';for(const o of n){const l=Fn[o];s+=`<tr><td style="padding:8px;border:1px solid var(--border);"><strong>${l.label}</strong><br><span style="font-size:11px;color:var(--text-muted);">${Math.round(l.equity*100)}/${Math.round(l.bond*100)}/${Math.round(l.cash*100)}</span></td>`,s+=r(e[o].flat,i.key===o&&i.tent==="flat"),s+=r(e[o].tent,i.key===o&&i.tent==="tent"),s+="</tr>"}s+="</tbody></table>",s+=`<p style="margin-top:12px;font-size:13px;">Best coverage: <strong>${Fn[i.key].label}${i.tent==="tent"?" + bond tent":""}</strong> at ${i.cov.toFixed(0)}%. Set it in Settings if you'd like it.</p>`,t&&(t.innerHTML=s)}const mr={ss:"mo",ds:"mo"};window.netSpendChanged=function(t,e){const n=+e||0,i=mr[t]==="mo"?n*12:n;document.getElementById(t+"BaseSalary").value=Math.round(Sm(i)),Sg(t)};window.toggleNetPeriod=function(t){mr[t]=mr[t]==="mo"?"yr":"mo",document.getElementById(t+"NetPeriodBtn").textContent="/"+mr[t],syncNetFromGross(t)};window.syncNetFromGross=function(t){const e=+document.getElementById(t+"BaseSalary").value||0,n=Bn(e,ko.pa,ko.brl,ko.hrl),i=document.getElementById(t+"NetSpend");i&&(i.value=e?Math.round(mr[t]==="mo"?n/12:n):""),Sg(t),wS(t)};function Sg(t){const e=Math.round(+document.getElementById(t+"BaseSalary").value||0),n=document.getElementById(t+"NetGrossNote");n&&(n.textContent=e?"≈ "+Ae(e)+"/yr before tax — withdrawals are sized to cover the tax":"")}async function wS(t){const e=document.getElementById(t+"BudgetChipRow"),n=document.getElementById(t+"BudgetChip");if(!(!e||!n)){try{const i=window._budget||Yl(await ad()),r=Lr(i);if(r.allInComfortableMonthly>0){n.textContent="From your budget: "+Ae(r.allInComfortableMonthly)+"/mo — use",n.dataset.monthly=Math.round(r.allInComfortableMonthly),e.style.display="block";return}}catch{}e.style.display="none"}}window.useBudgetSpend=function(t){const e=document.getElementById(t+"BudgetChip"),n=+(e&&e.dataset.monthly||0);n&&(mr[t]="mo",document.getElementById(t+"NetPeriodBtn").textContent="/mo",document.getElementById(t+"NetSpend").value=n,netSpendChanged(t,n))};async function Fa(){St("Loading settings...");try{const t=await Bt();document.getElementById("ssBaseSalary").value=t.baseSalary,syncNetFromGross("ss"),writeAlloc("ss",t.equityMin,t.bondMin,t.cashTarget,t.diversifierStart||0),restoreCustomAllocFromSettings("ss",t),window._taggedFunds.ss=(t.taggedFunds||[]).map(n=>({...n})),setAllocMode("ss",t.allocMode||(t.taggedFunds&&t.taggedFunds.length?"funds":"risk")),document.getElementById("ssDuration").value=t.duration,document.getElementById("ssPA").value=t.pa,document.getElementById("ssBRL").value=t.brl,document.getElementById("ssHRL").value=t.hrl,document.getElementById("ssTaxMode").value=t.taxMode||"inflates",document.getElementById("ssOther").value=t.other||0,document.getElementById("ssSpStartDate").value=t.spStartDate||"",document.getElementById("ssSpWeeklyAmount").value=t.spWeeklyAmount||"",$l("ss"),document.getElementById("ssConsecutiveLimit").value=t.consecutiveLimit||3,document.getElementById("ssProtectionMult").value=t.protectionMult||.8,document.getElementById("ssDisableProtection").checked=t.disableProtection||!1,document.getElementById("ssHodlEnabled").checked=t.hodlEnabled||!1,document.getElementById("ssHodlValue").value=t.hodlValue||25e3,document.getElementById("ssSpendingProfile").value=t.spendingProfile||"flat",document.getElementById("ssEquityGlide").checked=t.equityGlideEnabled||!1,updateAllocDisplay("ss"),document.getElementById("ssIsaBalance").value=t.isaBalance||0;const e=document.getElementById("ssSeedNote");e&&(e.textContent=t.seededFrom==="decision"&&t.seededAt?"Seeded from Decision Tool "+new Date(t.seededAt).toLocaleDateString():""),Na()}catch(t){console.error("Error loading stress settings:",t)}finally{At()}}window.saveStressSettingsUI=async function(){if(!dt()){showToast("Please sign in to save settings","error");return}const t=Ma(document.getElementById("ssSpStartDate").value.trim());if(!t.valid){showToast(t.error,"error");return}t.warning&&showToast(t.warning,"warning");const e=readAlloc("ss");if(bd(e.equityMin,e.bondMin,e.cashTarget)){St("Saving settings...");try{await js({configured:!0,baseSalary:+document.getElementById("ssBaseSalary").value,equityMin:e.equityMin,bondMin:e.bondMin,cashTarget:e.cashTarget,duration:+document.getElementById("ssDuration").value,pa:+document.getElementById("ssPA").value,brl:+document.getElementById("ssBRL").value,hrl:+document.getElementById("ssHRL").value,taxMode:document.getElementById("ssTaxMode").value,other:+document.getElementById("ssOther").value,spStartDate:document.getElementById("ssSpStartDate").value.trim()||null,spWeeklyAmount:+document.getElementById("ssSpWeeklyAmount").value||0,consecutiveLimit:+document.getElementById("ssConsecutiveLimit").value,protectionMult:+document.getElementById("ssProtectionMult").value,disableProtection:document.getElementById("ssDisableProtection").checked,hodlEnabled:document.getElementById("ssHodlEnabled").checked,hodlValue:+document.getElementById("ssHodlValue").value,isaBalance:+document.getElementById("ssIsaBalance").value||0,spendingProfile:document.getElementById("ssSpendingProfile").value,equityGlideEnabled:document.getElementById("ssEquityGlide").checked,diversifierStart:e.diversifierStart||0,subAsset:e.subAsset||null,glideEndgame:e.glideEndgame||null,allocMode:_d("ss"),taggedFunds:Mt("ss").filter(n=>n.ticker&&n.value>0)}),wd({...e,duration:+document.getElementById("ssDuration").value||35}),vd(),showToast("Settings saved successfully","success")}catch(n){console.error("Error saving stress settings:",n),showToast("Error saving: "+n.message,"error")}finally{At()}}};window.copyStressFromDecisionUI=async function(){if(!dt()){showToast("Please sign in first","error");return}if(confirm("Copy your Decision Tool plan basics (funds, income, State Pension, ISA, protection) into the Stress Tester? Your Stress-specific what-ifs (tax mode, HODL) are kept.")){St("Copying from Decision...");try{const t=await bt(),e=await Bt(),n=qT(t,e);await js(n),await Fa(),showToast("Stress Tester seeded from your Decision plan","success")}catch(t){console.error("Error copying from decision:",t),showToast("Error copying: "+t.message,"error")}finally{At()}}};window.resetStressSettingsUI=async function(){if(confirm("Reset all stress settings to defaults?")){St("Resetting settings...");try{await GI(),await Fa(),showToast("Settings reset to defaults","success")}catch(t){console.error("Error resetting settings:",t),showToast("Error resetting: "+t.message,"error")}finally{At()}}};async function Td(){St("Loading settings...");try{const t=await bt();document.getElementById("dsDuration").value=t.duration||35,writeAlloc("ds",t.equityMin??25e4,t.bondMin??2e5,t.cashTarget??5e4,t.diversifierStart||0),restoreCustomAllocFromSettings("ds",t),window._taggedFunds.ds=(t.taggedFunds||[]).map(e=>({...e})),setAllocMode("ds",t.allocMode||(t.taggedFunds&&t.taggedFunds.length?"funds":"risk")),document.getElementById("dsEquityGlide").checked=t.equityGlideEnabled||!1,updateAllocDisplay("ds"),document.getElementById("dsBaseSalary").value=t.baseSalary||3e4,syncNetFromGross("ds"),document.getElementById("dsSpendingProfile").value=t.spendingProfile||"flat",document.getElementById("dsProtectionFactor").value=t.protectionFactor||20,document.getElementById("dsRecoveryBuffer").value=t.recoveryBuffer||15e3,document.getElementById("dsConsecutiveLimit").value=t.consecutiveLimit||3,document.getElementById("dsIsaBalance").value=t.isaBalance||0,document.getElementById("entryEquity").value="",document.getElementById("entryBond").value="",document.getElementById("entryCash").value="",document.getElementById("entryIsa").value="",Na(),await Pd()}catch(t){console.error("Error loading decision settings:",t)}finally{At()}}let _S=0;const kt=()=>"b"+ ++_S,Ae=t=>"£"+Math.round(+t||0).toLocaleString(),Ve=t=>String(t??"").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;");function Yl(t){const e={...Is(),...t||{}};return e.lines=(Array.isArray(e.lines)?e.lines:[]).map(n=>({id:n.id||kt(),...n})),e.oneOffs=(Array.isArray(e.oneOffs)?e.oneOffs:[]).map(n=>({id:n.id||kt(),...n})),e}async function ES(){jl=!1;try{window._budget=Yl(await ad())}catch(e){console.error("Budget load error:",e),window._budget=Yl(Is())}window._budget.lines.length||(window._budget.lines=Em().map(e=>({id:kt(),...e})),window._budget.oneOffs.length||(window._budget.oneOffs=Tm().map(e=>({id:kt(),...e})))),document.getElementById("budCurrentAge").value=window._budget.currentAge,document.getElementById("budRetireAge").value=window._budget.retirementAge,document.getElementById("budEndAge").value=window._budget.endAge,document.getElementById("budShared").checked=!!window._budget.sharedWithPartner,document.getElementById("budSharePct").value=window._budget.mySharePct??50,document.getElementById("budShareRow").style.display=window._budget.sharedWithPartner?"block":"none",qt(),Ii(),ze();const t=!window._budget.lines.some(e=>e.annual)&&!window._budget.oneOffs.some(e=>e.amount);document.getElementById("budWizBanner").style.display=t?"block":"none",jl=!0,gr("Autosaves as you edit"),window._budWizAutoOpen&&(window._budWizAutoOpen=!1,openBudgetWizard())}function Va(t,e){const n=t.paidBy||"me",i=(o,l)=>'<option value="'+o+'"'+(n===o?" selected":"")+">"+l+"</option>",r=window._budget.mySharePct??50,s=n==="shared"?'<input type="number" min="0" max="100" placeholder="'+r+'%" title="Your % of this shared cost (blank = the overall split)" value="'+(t.mySharePct??"")+'" oninput="'+e+"('"+t.id+`','mySharePct',this.value)" style="flex:0 0 62px;">`:"";return'<select title="Who pays this?" onchange="'+e+"('"+t.id+`','paidBy',this.value)" style="flex:0 0 96px;">`+i("me","Me")+i("partner","Partner")+i("shared","Shared")+"</select>"+s}window.onBudgetSharedToggle=function(){window._budget.sharedWithPartner=document.getElementById("budShared").checked,document.getElementById("budShareRow").style.display=window._budget.sharedWithPartner?"block":"none",qt(),Ii(),ze()};window.onBudgetSharePctChange=function(){window._budget.mySharePct=+document.getElementById("budSharePct").value||0,ze()};function jh(t){const e=t.hint?'<div style="font-size:11px;color:var(--text-muted);margin-top:2px;line-height:1.3;">'+Ve(t.hint)+"</div>":"",n=t.period||"yr",i=t.annual==null?"":n==="mo"?Math.round(t.annual/12):t.annual,r=Br(t.label,window._budget),s=r!=null?"≈"+(n==="mo"?r:r*12):"Amount",o=window._budget.sharedWithPartner?`<button type="button" class="risk-btn" style="padding:4px 8px;" title="Add a copy for your partner (e.g. their car)" onclick="duplicateBudgetLine('`+t.id+`')">⧉</button>`:"";return'<div class="bud-row" data-id="'+t.id+'" style="display:flex; gap:8px; flex-wrap:wrap; align-items:flex-start; margin-bottom:10px;"><div style="flex:1 1 200px; min-width:170px;"><input type="text" placeholder="Category" value="'+Ve(t.label)+`" oninput="updateBudgetLine('`+t.id+`','label',this.value)" style="width:100%;">`+e+'</div><div style="display:flex; gap:4px; flex:0 0 186px; align-items:center;"><input type="text" inputmode="decimal" id="bm-amt-'+t.id+'" placeholder="'+s+`" title="Amount in today's money — sums welcome: 11.99+8.99 or =4×52/12`+(r!=null?" (typical shown)":"")+'" value="'+i+`" onchange="updateBudgetAmount('`+t.id+`',this.value,this)" style="flex:1 1 auto; min-width:0;"><button type="button" class="risk-btn" style="padding:4px 8px; flex:0 0 auto;" title="Switch monthly / yearly" onclick="toggleBudgetPeriod('`+t.id+`')">`+(n==="mo"?"/mo":"/yr")+'</button><button type="button" class="risk-btn'+(t.breakdownOpen?" active":"")+`" style="padding:4px 8px; flex:0 0 auto;" title="Break it down into parts (saved with your budget)" onclick="budBreakToggle('bm','`+t.id+`')">&Sigma;</button></div>`+(window._budget.sharedWithPartner?Va(t,"updateBudgetLine"):"")+'<input type="number" placeholder="from age" title="From age (blank = retirement). For temporary costs — e.g. a car lease with 3 years left — set when it starts and stops." value="'+(t.fromAge??"")+`" oninput="updateBudgetLine('`+t.id+`','fromAge',this.value)" style="flex:0 0 84px;"><input type="number" placeholder="to age" title="To age (blank = end of plan)" value="`+(t.toAge??"")+`" oninput="updateBudgetLine('`+t.id+`','toAge',this.value)" style="flex:0 0 84px;">`+o+`<button type="button" class="risk-btn" style="padding:4px 10px;" title="Remove" onclick="removeBudgetLine('`+t.id+`')">&times;</button>`+(t.breakdownOpen?'<div style="flex-basis:100%;">'+kg("bm",t)+"</div>":"")+"</div>"}function qt(){const t=window._budget.lines.filter(n=>n.tier==="essential"),e=window._budget.lines.filter(n=>n.tier==="discretionary");document.getElementById("budEssentialRows").innerHTML=t.map(jh).join("")||'<p style="font-size:12px;color:var(--text-muted);margin:0 0 8px;">No essentials yet — add housing, bills, food, transport…</p>',document.getElementById("budDiscretionaryRows").innerHTML=e.map(jh).join("")||'<p style="font-size:12px;color:var(--text-muted);margin:0 0 8px;">No lifestyle spending yet — holidays, hobbies, eating out…</p>',Id()}function TS(t){const e=t.hint?'<div style="font-size:11px;color:var(--text-muted);margin-top:2px;line-height:1.3;">'+Ve(t.hint)+"</div>":"";return'<div class="bud-row" data-id="'+t.id+'" style="display:flex; gap:8px; flex-wrap:wrap; align-items:flex-start; margin-bottom:10px;"><div style="flex:1 1 170px; min-width:150px;"><input type="text" placeholder="e.g. Car" value="'+Ve(t.label)+`" oninput="updateBudgetOneOff('`+t.id+`','label',this.value)" style="width:100%;">`+e+`</div><input type="number" placeholder="£ amount" title="Total cost in today's money" value="`+(t.amount??"")+`" oninput="updateBudgetOneOff('`+t.id+`','amount',this.value)" style="flex:0 0 120px;">`+(window._budget.sharedWithPartner?Va(t,"updateBudgetOneOff"):"")+'<input type="number" placeholder="at age" value="'+(t.atAge??"")+`" oninput="updateBudgetOneOff('`+t.id+`','atAge',this.value)" style="flex:0 0 84px;"><input type="number" placeholder="every N yrs" title="Leave blank for a one-time cost" value="`+(t.everyYears??"")+`" oninput="updateBudgetOneOff('`+t.id+`','everyYears',this.value)" style="flex:0 0 110px;">`+(window._budget.sharedWithPartner?`<button type="button" class="risk-btn" style="padding:4px 8px;" title="Add a copy for your partner" onclick="duplicateBudgetOneOff('`+t.id+`')">⧉</button>`:"")+`<button type="button" class="risk-btn" style="padding:4px 10px;" title="Remove" onclick="removeBudgetOneOff('`+t.id+`')">&times;</button></div>`}function Ii(){document.getElementById("budOneOffRows").innerHTML=window._budget.oneOffs.map(TS).join("")||'<p style="font-size:12px;color:var(--text-muted);margin:0 0 8px;">No one-off costs yet — a car every ~8 years, a new roof, a milestone trip…</p>'}function Id(){const t=Ts(window._budget),e=document.getElementById("budSuggestionsSection"),n=document.getElementById("budSuggestions");if(!t.length){e.style.display="none",n.innerHTML="";return}e.style.display="block",n.innerHTML=t.map(i=>'<button type="button" class="risk-btn" style="padding:5px 10px;" title="'+Ve(i.hint||"")+`" onclick="addBudgetSuggestion('`+Ve(i.label).replace(/'/g,"\\'")+`')">+ `+Ve(i.label)+"</button>").join("")}window.addBudgetSuggestion=function(t){const e=Ts(window._budget).find(n=>n.label===t);e&&(window._budget.lines.push({id:kt(),label:e.label,tier:e.tier,annual:null,fromAge:null,toAge:null,hint:e.hint||"",period:e.period||"yr",paidBy:e.paidBy||"me"}),qt(),Id(),ze())};function xd(){window._budget.currentAge=+document.getElementById("budCurrentAge").value||0,window._budget.retirementAge=+document.getElementById("budRetireAge").value||0,window._budget.endAge=+document.getElementById("budEndAge").value||100}window.onBudgetHorizonChange=function(){xd(),ze()};window.updateBudgetLine=function(t,e,n){const i=window._budget.lines.find(r=>r.id===t);i&&(e==="label"||e==="paidBy"?i[e]=n:i[e]=n===""?null:+n,e==="label"&&Id(),e==="paidBy"&&qt(),ze())};window.updateBudgetAmount=function(t,e,n){const i=window._budget.lines.find(s=>s.id===t);if(!i)return;const r=String(e).trim();if(r==="")i.annual=null;else{const s=Aa(r);if(s==null)return;i.annual=(i.period||"yr")==="mo"?s*12:s,n&&(n.value=s)}budTouch(),ze()};window.toggleBudgetPeriod=function(t){const e=window._budget.lines.find(i=>i.id===t);if(!e)return;e.period=(e.period||"yr")==="mo"?"yr":"mo",budTouch();const n=window.scrollY;qt(),ze(),window.scrollTo(0,n)};window.updateBudgetOneOff=function(t,e,n){const i=window._budget.oneOffs.find(r=>r.id===t);i&&(e==="label"||e==="paidBy"?i[e]=n:i[e]=n===""?null:+n,e==="paidBy"&&Ii(),ze())};window.addBudgetLine=function(t){window._budget.lines.push({id:kt(),label:"",tier:t,annual:null,fromAge:null,toAge:null}),qt(),ze()};window.addBudgetOneOff=function(){window._budget.oneOffs.push({id:kt(),label:"",tier:"essential",amount:null,atAge:null,everyYears:null}),Ii(),ze()};window.removeBudgetLine=function(t){window._budget.lines=window._budget.lines.filter(e=>e.id!==t),qt(),ze()};window.removeBudgetOneOff=function(t){window._budget.oneOffs=window._budget.oneOffs.filter(e=>e.id!==t),Ii(),ze()};window.duplicateBudgetLine=function(t){const e=window._budget.lines,n=e.find(r=>r.id===t);if(!n)return;const i={...n,id:kt(),label:(n.label||"Item")+" (partner)",paidBy:"partner"};e.splice(e.indexOf(n)+1,0,i),qt(),ze()};window.duplicateBudgetOneOff=function(t){const e=window._budget.oneOffs,n=e.find(r=>r.id===t);if(!n)return;const i={...n,id:kt(),label:(n.label||"Item")+" (partner)",paidBy:"partner"};e.splice(e.indexOf(n)+1,0,i),Ii(),ze()};window.fillTypicalAmounts=function(){let t=0;for(const e of window._budget.lines)if(e.annual==null||e.annual===""){const n=Br(e.label,window._budget);n!=null&&(e.annual=n*12,t++)}qt(),ze(),showToast(t?"Filled "+t+" blank categories with typical UK amounts — adjust freely":"No blank categories with a typical figure",t?"success":"info")};function ze(){budTouch(),xd();const t=window._budget,e=t.retirementAge,n=Vl(t,e,"essential"),i=Vl(t,e,"all");document.getElementById("budEssentialSubtotal").textContent=Ae(n),document.getElementById("budDiscretionarySubtotal").textContent=Ae(i-n);const r=Lr(t),s=y=>Ae(y),o=t.oneOffs.filter(y=>(+y.everyYears||0)>0&&(+y.amount||0)>0),l=t.oneOffs.filter(y=>!((+y.everyYears||0)>0)&&(+y.amount||0)>0),c=_m.single,d=r.allInComfortableAnnual,f=d>=c.comfortable?"at/above Comfortable":d>=c.moderate?"between Moderate and Comfortable":d>=c.minimum?"between Minimum and Moderate":"below the Minimum",m=r.sharedWithPartner;let p="";if(p+='<div style="display:flex; gap:22px; flex-wrap:wrap; margin-bottom:14px;">',p+='<div><div style="font-size:12px;color:var(--text-muted);">Essential (floor)'+(m?" — your share":"")+'</div><div style="font-size:22px;font-weight:700;">'+s(r.essentialMonthlyNet)+'<span style="font-size:13px;font-weight:400;color:var(--text-muted);">/mo</span></div></div>',p+='<div><div style="font-size:12px;color:var(--text-muted);">'+(m?"Your share (all-in)":"All-in comfortable")+'</div><div style="font-size:26px;font-weight:800;color:var(--primary,#6366f1);">'+s(r.allInComfortableMonthly)+'<span style="font-size:13px;font-weight:400;color:var(--text-muted);">/mo</span></div><div style="font-size:12px;color:var(--text-muted);">'+s(d)+"/yr — what your plan funds</div></div>",m&&(p+='<div><div style="font-size:12px;color:var(--text-muted);">Partner’s share</div><div style="font-size:22px;font-weight:700;">'+s(r.partnerAllInMonthly)+'<span style="font-size:13px;font-weight:400;color:var(--text-muted);">/mo</span></div><div style="font-size:12px;color:var(--text-muted);">'+s(r.partnerAllInAnnual)+"/yr — their side of this budget</div></div>",p+='<div><div style="font-size:12px;color:var(--text-muted);">Household all-in</div><div style="font-size:22px;font-weight:700;">'+s(r.householdComfortableMonthly)+'<span style="font-size:13px;font-weight:400;color:var(--text-muted);">/mo</span></div><div style="font-size:12px;color:var(--text-muted);">everything, both of you</div></div>'),p+="</div>",m&&r.partnerAllInAnnual>0&&(p+='<div class="alert alert-info" style="margin-bottom:12px;">Your partner’s share is <strong>'+s(r.partnerAllInMonthly)+"/mo</strong> ("+s(r.partnerAllInAnnual)+'/yr). They can create their own free plan and use that as <em>their</em> target income. <span style="color:var(--text-muted);">Note: this plan only funds <em>your</em> share — it doesn’t check your partner can fund theirs.</span></div>'),p+='<div style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">= comfortable recurring <strong style="color:var(--text);">'+s(r.comfortableMonthlyNet)+"/mo</strong>"+(r.periodicMonthlyAverage>0?' + periodic set-aside <strong style="color:var(--text);">'+s(r.periodicMonthlyAverage)+"/mo</strong> <span>(averaged from the big periodic costs below)</span>":"")+".</div>",p+='<div class="alert alert-info" style="margin-bottom:12px;"><strong>vs PLSA (single, 2024):</strong> Minimum '+s(c.minimum)+" · Moderate "+s(c.moderate)+" · Comfortable "+s(c.comfortable)+" per year. Your all-in spend is <strong>"+f+'</strong>. <span style="color:var(--text-muted);">(Assumes home owned outright; excludes care costs.)</span></div>',o.length){p+='<div style="font-size:13px;margin-bottom:8px;"><strong>Periodic costs</strong> (averaged into the monthly need, but the cash lands lumpily):<ul style="margin:6px 0 0; padding-left:18px;">';for(const y of o){const I=+y.amount/+y.everyYears;p+="<li>"+Ve(y.label||"item")+": "+s(y.amount)+" every "+ +y.everyYears+" yrs ≈ <strong>"+s(I)+"/yr</strong> ("+s(I/12)+"/mo)</li>"}p+="</ul></div>"}if(l.length){p+='<div style="font-size:13px;margin-bottom:12px;"><strong>One-time costs</strong> (not in the monthly average — planned for the year they fall):<ul style="margin:6px 0 0; padding-left:18px;">';for(const y of l)p+="<li>"+Ve(y.label||"item")+": "+s(y.amount)+(y.atAge?" at age "+ +y.atAge:"")+"</li>";p+="</ul></div>"}p+='<div style="border-top:1px solid var(--border); padding-top:12px;">',p+='<div style="font-size:13px; margin-bottom:8px;">Your all-in take-home of <strong>'+s(r.allInComfortableMonthly)+'/mo</strong> becomes the <strong>target both tools work to</strong>: the Stress Tester asks “will my pots deliver this for life?” and the Decision Tool works out each month’s withdrawal to hit it tax-efficiently. <span style="color:var(--text-muted);">(≈ '+s(r.suggestedGrossAnnual)+"/yr before tax.)</span></div>",p+='<button type="button" onclick="applyBudgetToPlan()">Set as my plan’s target (Stress + Decision)</button>',p+="</div>",document.getElementById("budSummary").innerHTML=p}let jl=!1,Ps=null;function gr(t){const e=document.getElementById("budSaveStatus");e&&(e.textContent=t)}window.budTouch=function(){!jl||!window._budget||(gr("Saving…"),clearTimeout(Ps),Ps=setTimeout(Sd,1200))};function Ag(){return{...window._budget,lines:window._budget.lines.filter(t=>t.label&&t.label.trim()||t.annual||t.breakdown&&t.breakdown.some(e=>e.label&&e.label.trim()||e.amount)),oneOffs:window._budget.oneOffs.filter(t=>t.label&&t.label.trim()||t.amount)}}async function Sd(){if(!dt()){gr("Sign in to save");return}try{await ld(Ag()),gr("Saved ✓")}catch(t){console.error("Budget autosave error:",t),gr("Not saved — retrying…"),clearTimeout(Ps),Ps=setTimeout(Sd,4e3)}}window.resetBudgetUI=async function(){confirm(`Reset the budget?

All amounts, sub-sheets and custom lines go back to a fresh start. Your ages and partner-sharing setting are kept.

This saves immediately and cannot be undone.`)&&(window._budget.lines=Em().map(t=>({id:kt(),...t})),window._budget.oneOffs=Tm().map(t=>({id:kt(),...t})),qt(),Ii(),ze(),await Sd(),showToast("Budget reset to a fresh start","success"))};window.saveBudgetUI=async function(){if(!dt()){showToast("Please sign in to save your budget","error");return}xd(),St("Saving budget…");try{clearTimeout(Ps),await ld(Ag()),gr("Saved ✓"),showToast("Budget saved","success")}catch(t){console.error("Budget save error:",t),showToast("Error saving budget: "+t.message,"error")}finally{At()}};window.applyBudgetToPlan=async function(){const t=Lr(window._budget),e=Math.round(t.suggestedGrossAnnual);if(!e){showToast("Add some spending first","warning");return}St("Applying to plan…");try{await js({baseSalary:e});const n=await Js();n||await Ys({baseSalary:e});const i=document.getElementById("ssBaseSalary");i&&(i.value=e,syncNetFromGross("ss"));const r=document.getElementById("dsBaseSalary");r&&!n&&(r.value=e,syncNetFromGross("ds")),showToast("Target set: both tools now work to "+Ae(t.allInComfortableMonthly)+"/mo take-home ("+Ae(e)+"/yr gross)"+(n?" — Stress only; the Decision plan is locked":""),"success",5e3)}catch(n){console.error("Apply-to-plan error:",n),showToast("Could not apply: "+n.message,"error")}finally{At()}};const Qs=[{key:"home",title:"Home & bills",tier:"essential",tip:`Will your mortgage still exist at retirement? If it ends earlier, leave it out (or give it a "to age" on the main Budget page). Bills mostly carry on — but you'll be home more, so heating often rises.`,labels:["Rent / mortgage","Council tax","Gas","Electricity","Water","Broadband","Mobile phones","TV licence","Home insurance","Boiler service","Home upkeep","Premier banking / account fees","Cleaner / gardener","Second / holiday home","Storage / lock-up"]},{key:"food",title:"Food, drink & eating out",tier:"essential",tip:"With more free time most retirees eat OUT more, not less. Check 2–3 months of bank statements for what you really spend — real numbers beat guesses.",labels:["Groceries & household","Eating out & takeaways","Alcohol"]},{key:"transport",title:"Transport",tier:"essential",tip:"Commuting disappears at retirement, but running costs are easy to underestimate — servicing, MOT, tyres, repairs. Replacing the car itself goes in One-off costs (a later step).",labels:["Car insurance","Car tax","Petrol / fuel","Car servicing & maintenance","Breakdown cover","Parking & permits","Public transport"]},{key:"health",title:"Health & protection",tier:"essential",tip:"Health spending tends to RISE with age — and the PLSA benchmarks exclude long-term care entirely. A monthly care set-aside is easy to add now and painful to discover missing later.",labels:["Personal health","Health / dental insurance","Dental & optical","Hearing","Life insurance / income protection","Long-term care set-aside"]},{key:"leisure",title:"Holidays, hobbies & leisure",tier:"discretionary",tip:'Most people spend MORE on holidays and hobbies in the early "go-go" years. Budget for the retirement you actually want — the spending smile tapers it in later life.',labels:["Main holiday","UK breaks","Day trips","Streaming & entertainment","Digital subscriptions","Gym & fitness","Sports & equipment","Sports clothes","Hobbies & leisure","Newspapers, books & media"]},{key:"personal",title:"Personal, family & giving",tier:"discretionary",tip:'The easiest category to underestimate: gifts, grandchildren, Christmas. A personal "spends" line per person keeps day-to-day money simple.',labels:["Clothes","Gifts & family","Charity","Pets","Personal spending money","Kids / dependents","Christmas & birthdays","Hairdressing & grooming","Grandchildren","Professional memberships","My personal spending","Partner's personal spending"]},{key:"extras",title:"Around the home & everything else",tier:"discretionary",tip:"Furniture wears out, technology needs refreshing, and a small emergency buffer stops a bad month becoming a plan problem. Anything of yours that didn't fit an earlier screen appears here too.",labels:["Home furnishings & décor","Home technology","Emergency buffer"]}],Ad=(()=>{const t={};for(const e of Qs)for(const n of e.labels)t[n.toLowerCase()]=e.key;return t})(),os=["intro",...Qs.map(t=>t.key),"oneoffs","review"];let kn=0;function IS(t){return t.wizGroup&&Qs.some(e=>e.key===t.wizGroup)?t.wizGroup:Ad[(t.label||"").trim().toLowerCase()]||"extras"}window.openBudgetWizard=function(){window._budget&&(kn=0,document.getElementById("budWizardOverlay").style.display="block",Lt())};window.closeBudgetWizard=function(){document.getElementById("budWizardOverlay").style.display="none",qt(),Ii(),ze()};window.budWizGo=function(t){kn=Math.max(0,Math.min(os.length-1,kn+t)),Lt()};function xS(t){return t.annual==null?"":(t.period||"yr")==="mo"?Math.round(t.annual/12):t.annual}function SS(t){const e=t.period||"yr",n=Br(t.label,window._budget),i=n!=null?"Typical "+Ae(e==="mo"?n:n*12)+"/"+e:null,s=!!Ad[(t.label||"").trim().toLowerCase()]?'<div style="font-weight:600;">'+Ve(t.label)+"</div>":'<input type="text" placeholder="What is it?" value="'+Ve(t.label)+`" oninput="budWizField('`+t.id+`','label',this.value)" style="width:100%;">`,o=t.hint?'<div class="budwiz-hint">'+Ve(t.hint)+"</div>":"",l=km(t.label,t.annual,window._budget),c=l?'<div class="budwiz-nudge" id="bw-n-'+t.id+'">'+(l==="low"?"Well below typical ("+Ae(n)+"/mo) — deliberate, or missing something?":"Well above typical ("+Ae(n)+"/mo) — worth double-checking.")+"</div>":'<div class="budwiz-nudge" id="bw-n-'+t.id+'"></div>';return'<div class="budwiz-row" id="bw-row-'+t.id+'"><div class="budwiz-name">'+s+o+'</div><div class="budwiz-amt"><input type="text" inputmode="decimal" id="bw-amt-'+t.id+`" placeholder="£ or e.g. =12+9.50" title="Amount in today's money — sums welcome: 11.99+8.99, =4×52/12" value="`+xS(t)+`" onchange="budWizAmount('`+t.id+`',this.value,this)" style="flex:1 1 auto; min-width:0;"><button type="button" class="risk-btn" style="padding:6px 9px;" title="Switch monthly / yearly" onclick="budWizTogglePeriod('`+t.id+`')">/`+e+'</button><button type="button" class="risk-btn'+(t.breakdownOpen?" active":"")+`" style="padding:6px 9px;" title="Break it down into parts (saved with your budget)" onclick="budBreakToggle('bw','`+t.id+`')">&Sigma;</button></div><div class="budwiz-chipslot">`+(i?`<button type="button" class="budwiz-chip" onclick="budWizUseTypical('`+t.id+`')" title="ONS retired-household average — a starting point">`+i+" — use</button>":"")+"</div>"+(window._budget.sharedWithPartner?Va(t,"budWizField"):"")+'<input type="number" placeholder="from" title="From age (blank = retirement). For temporary costs — e.g. a car lease with 3 years left: from retirement age, to retirement age + 3." value="'+(t.fromAge??"")+`" oninput="budWizField('`+t.id+`','fromAge',this.value)" style="flex:0 0 64px;"><input type="number" placeholder="to" title="To age (blank = end of plan). For temporary costs, set the age this stops." value="`+(t.toAge??"")+`" oninput="budWizField('`+t.id+`','toAge',this.value)" style="flex:0 0 64px;"><button type="button" class="risk-btn" style="padding:6px 11px;" title="Remove" onclick="budWizRemove('`+t.id+`')">&times;</button><div id="bw-err-`+t.id+'" class="budwiz-err"></div>'+c+(t.breakdownOpen?'<div style="flex-basis:100%;">'+kg("bw",t)+"</div>":"")+"</div>"}window.budWizField=function(t,e,n){const i=window._budget.lines.find(r=>r.id===t);i&&(e==="label"||e==="paidBy"?i[e]=n:i[e]=n===""?null:+n,e==="paidBy"&&Lt(!0),budTouch(),Fr())};window.budWizAmount=function(t,e,n){const i=window._budget.lines.find(o=>o.id===t);if(!i)return;const r=document.getElementById("bw-err-"+t),s=String(e).trim();if(s==="")i.annual=null,r&&(r.textContent="");else{const o=Aa(s);if(o==null){r&&(r.textContent="Couldn’t read that — a number or a simple sum like 12.99+8.50 works.");return}r&&(r.textContent=""),i.annual=(i.period||"yr")==="mo"?o*12:o,n&&(n.value=(i.period||"yr")==="mo"?Math.round(i.annual/12):i.annual)}Gl(i),budTouch(),Fr()};function Gl(t){const e=document.getElementById("bw-n-"+t.id);if(!e)return;const n=Br(t.label,window._budget),i=km(t.label,t.annual,window._budget);e.textContent=i?i==="low"?"Well below typical ("+Ae(n)+"/mo) — deliberate, or missing something?":"Well above typical ("+Ae(n)+"/mo) — worth double-checking.":""}window.budWizTogglePeriod=function(t){const e=window._budget.lines.find(n=>n.id===t);e&&(e.period=(e.period||"yr")==="mo"?"yr":"mo",budTouch(),Lt(!0))};window.budWizUseTypical=function(t){const e=window._budget.lines.find(i=>i.id===t);if(!e)return;const n=Br(e.label,window._budget);n!=null&&(e.annual=n*12,budTouch(),Lt(!0))};window.budWizRemove=function(t){window._budget.lines=window._budget.lines.filter(e=>e.id!==t),budTouch(),Lt(!0)};window.budWizAddLine=function(t){const e=Qs.find(n=>n.key===t);window._budget.lines.push({id:kt(),label:"",tier:e&&e.tier||"discretionary",annual:null,fromAge:null,toAge:null,period:"mo",wizGroup:t}),budTouch(),Lt(!0)};window.budWizSuggest=function(t,e){const n=Ts(window._budget).find(i=>i.label===t);n&&(window._budget.lines.push({id:kt(),label:n.label,tier:n.tier,annual:null,fromAge:null,toAge:null,hint:n.hint||"",period:n.period||"yr",paidBy:n.paidBy||"me",wizGroup:e}),budTouch(),Lt(!0))};const Or=t=>window._budget.lines.find(e=>e.id===t);function kd(t){if(t==="bw"){Lt(!0);return}const e=window.scrollY;qt(),ze(),window.scrollTo(0,e)}function kg(t,e){return'<div style="background:var(--card-alt); border:1px solid var(--border); border-radius:8px; padding:10px; margin-top:6px;"><div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">Break it into parts — mix /mo and /yr freely; sums (or =sums) are fine in each box. The total is written to the line for you, and the parts are saved.</div>'+(e.breakdown||[]).map((i,r)=>'<div style="display:flex; gap:6px; margin-bottom:6px; align-items:center;"><input type="text" placeholder="'+(r===0?"e.g. insurance":r===1?"e.g. fuel":"part "+(r+1))+'" value="'+Ve(i.label)+`" oninput="budBreakField('`+t+"','"+e.id+"',"+r+`,'label',this.value)" style="flex:1 1 auto; min-width:0;"><input type="text" inputmode="decimal" placeholder="£ or =12+8" value="`+(i.amount??"")+`" onchange="budBreakField('`+t+"','"+e.id+"',"+r+`,'amount',this.value,this)" style="flex:0 0 104px;"><button type="button" class="risk-btn" style="padding:4px 8px;" title="This part is per month / per year" onclick="budBreakTogglePeriod('`+t+"','"+e.id+"',"+r+',this)">/'+(i.period||"yr")+`</button><button type="button" class="risk-btn" style="padding:4px 9px;" title="Remove part" onclick="budBreakRemoveRow('`+t+"','"+e.id+"',"+r+')">&times;</button></div>').join("")+`<div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;"><button type="button" class="risk-btn" style="padding:4px 12px;" onclick="budBreakAddRow('`+t+"','"+e.id+`')">+ add part</button><div style="font-size:13px;">Adds up to <strong id="`+t+"-bsum-"+e.id+'">'+Rg(e)+"</strong></div></div></div>"}function Rg(t){const e=Am(t.breakdown);return(t.period||"yr")==="mo"?Ae(e/12)+"/mo":Ae(e)+"/yr"}function Rd(t,e){const n=Or(e);if(!n)return;if((n.breakdown||[]).some(r=>+r.amount)){n.annual=Am(n.breakdown);const r=document.getElementById(t+"-amt-"+e);r&&(r.value=(n.period||"yr")==="mo"?Math.round(n.annual/12):n.annual)}const i=document.getElementById(t+"-bsum-"+e);i&&(i.textContent=Rg(n)),t==="bw"?(Fr(),typeof Gl=="function"&&Gl(n)):ze(),budTouch()}window.budBreakToggle=function(t,e){const n=Or(e);n&&(n.breakdownOpen=!n.breakdownOpen,n.breakdownOpen&&!Array.isArray(n.breakdown)&&(n.breakdown=[{label:"",amount:null,period:"mo"},{label:"",amount:null,period:"mo"}]),budTouch(),kd(t))};window.budBreakAddRow=function(t,e){const n=Or(e);n&&((n.breakdown=n.breakdown||[]).push({label:"",amount:null,period:"mo"}),kd(t))};window.budBreakRemoveRow=function(t,e,n){const i=Or(e);!i||!i.breakdown||(i.breakdown.splice(n,1),Rd(t,e),kd(t))};window.budBreakField=function(t,e,n,i,r,s){const o=Or(e),l=o&&o.breakdown&&o.breakdown[n];if(!l)return;if(i==="label"){l.label=r,budTouch();return}const c=String(r).trim();if(c==="")l.amount=null;else{const d=Aa(c);if(d==null)return;l.amount=d,s&&(s.value=d)}Rd(t,e)};window.budBreakTogglePeriod=function(t,e,n,i){const r=Or(e),s=r&&r.breakdown&&r.breakdown[n];s&&(s.period=(s.period||"yr")==="mo"?"yr":"mo",i&&(i.textContent="/"+s.period),Rd(t,e))};function AS(t){return'<div class="budwiz-row"><input type="text" placeholder="e.g. Replacement car" value="'+Ve(t.label)+`" oninput="budWizOneOff('`+t.id+`','label',this.value)" style="flex:1 1 170px; min-width:150px;"><input type="text" inputmode="decimal" placeholder="£ total" title="Total cost in today's money — sums welcome" value="`+(t.amount??"")+`" onchange="budWizOneOffAmount('`+t.id+`',this.value,this)" style="flex:0 0 110px;"><input type="number" placeholder="at age" title="Age it first happens" value="`+(t.atAge??"")+`" oninput="budWizOneOff('`+t.id+`','atAge',this.value)" style="flex:0 0 84px;"><input type="number" placeholder="every N yrs" title="Blank = one-time" value="`+(t.everyYears??"")+`" oninput="budWizOneOff('`+t.id+`','everyYears',this.value)" style="flex:0 0 104px;">`+(window._budget.sharedWithPartner?Va(t,"budWizOneOff"):"")+`<button type="button" class="risk-btn" style="padding:4px 10px;" onclick="budWizRemoveOneOff('`+t.id+`')">&times;</button><div id="bw-oerr-`+t.id+'" class="budwiz-err"></div></div>'}window.budWizOneOff=function(t,e,n){const i=window._budget.oneOffs.find(r=>r.id===t);i&&(e==="label"||e==="paidBy"?i[e]=n:i[e]=n===""?null:+n,e==="paidBy"&&Lt(!0),budTouch(),Fr())};window.budWizOneOffAmount=function(t,e,n){const i=window._budget.oneOffs.find(o=>o.id===t);if(!i)return;const r=document.getElementById("bw-oerr-"+t),s=String(e).trim();if(s==="")i.amount=null,r&&(r.textContent="");else{const o=Aa(s);if(o==null){r&&(r.textContent="Couldn’t read that — a number or a simple sum works.");return}r&&(r.textContent=""),i.amount=o,n&&(n.value=o)}budTouch(),Fr()};window.budWizAddOneOff=function(){window._budget.oneOffs.push({id:kt(),label:"",tier:"essential",amount:null,atAge:null,everyYears:null}),budTouch(),Lt(!0)};window.budWizRemoveOneOff=function(t){window._budget.oneOffs=window._budget.oneOffs.filter(e=>e.id!==t),budTouch(),Lt(!0)};window.budWizClearAmounts=function(){for(const t of window._budget.lines)t.annual=null;for(const t of window._budget.oneOffs)t.amount=null;budTouch(),Lt(),showToast("Amounts cleared — nothing is saved until you choose Save.","info",4e3)};window.budWizSave=async function(t){await saveBudgetUI(),t&&await applyBudgetToPlan(),closeBudgetWizard()};function Fr(){const t=document.getElementById("budWizTotals");if(!t)return;const e=window._budget,n=Lr(e);t.innerHTML="Essential <strong>"+Ae(n.essentialMonthlyNet)+"</strong>/mo · Lifestyle <strong>"+Ae(n.comfortableMonthlyNet-n.essentialMonthlyNet)+"</strong>/mo · All-in"+(n.sharedWithPartner?" (your share)":"")+' <strong style="color:var(--primary,#6366f1);">'+Ae(n.allInComfortableMonthly)+"</strong>/mo"}function kS(t){if(t==="intro")return'<h2 style="margin-bottom:10px;">Let’s build your budget</h2><p style="margin-bottom:12px;">We’ll walk through your spending one category at a time — bills first, then the fun stuff, then the big occasional costs. Skip anything; you can come back any time.</p>'+(window._budget.lines.some(o=>o.annual)||window._budget.oneOffs.some(o=>o.amount)?'<div class="alert alert-warning" style="margin-bottom:12px;"><strong>You already have a saved budget</strong> — the totals in the bar below are your own saved figures, and each screen shows them ready to edit. Prefer a clean slate? <button type="button" class="risk-btn" style="padding:4px 12px; margin-left:4px;" onclick="budWizClearAmounts()">Start fresh — clear all amounts</button><span style="color:var(--text-muted);"> (nothing is saved until you choose Save at the end)</span></div>':"")+'<div class="alert alert-info" style="margin-bottom:12px;"><strong>Before you start:</strong> open your banking app and look at the last 2–3 months of statements. Real numbers beat guesses — most people who guess miss 20% of their spending.</div><ul style="padding-left:18px; color:var(--text-muted); line-height:1.8;"><li>Every amount box is a <strong>calculator</strong> — type <code>11.99+8.99+5.99</code> or <code>4×52/12</code> and it does the maths.</li><li><strong>Typical UK figures</strong> (ONS retired households) appear as one-tap chips when you’re unsure.</li><li>The <strong>&Sigma;</strong> button breaks a cost into parts (fuel + insurance + MOT…) so nothing gets forgotten.</li><li>Everything is in <strong>today’s money</strong>.</li>'+(window._budget.sharedWithPartner?"<li>Mark each line <strong>Me / Partner / Shared</strong> — your plan funds your share; your partner sees theirs.</li>":"")+"</ul>";if(t==="oneoffs")return'<h2 style="margin-bottom:6px;">One-off & periodic costs</h2><p style="font-size:13px; color:var(--text-muted); margin-bottom:12px;">Big costs that land in a specific year: cars, roofs, weddings, milestone trips, helping the kids. Give recurring ones an "every N years" and we average them into your monthly need; one-time items stay as dated events.</p>'+(window._budget.oneOffs.map(AS).join("")||'<p style="font-size:13px;color:var(--text-muted);">Nothing yet — add the big things below.</p>')+'<button type="button" class="risk-btn" style="margin-top:10px;" onclick="budWizAddOneOff()">+ Add a one-off</button>';if(t==="review"){const r=Lr(window._budget),s=_m.single,o=r.allInComfortableAnnual,l=o>=s.comfortable?"at or above <strong>Comfortable</strong>":o>=s.moderate?"between <strong>Moderate</strong> and <strong>Comfortable</strong>":o>=s.minimum?"between <strong>Minimum</strong> and <strong>Moderate</strong>":"below the <strong>Minimum</strong>";let c='<h2 style="margin-bottom:10px;">Your spending picture</h2><div style="display:flex; gap:22px; flex-wrap:wrap; margin-bottom:14px;"><div><div style="font-size:12px;color:var(--text-muted);">Essential (floor)'+(r.sharedWithPartner?" — your share":"")+'</div><div style="font-size:24px;font-weight:700;">'+Ae(r.essentialMonthlyNet)+'<span style="font-size:13px;font-weight:400;color:var(--text-muted);">/mo</span></div></div><div><div style="font-size:12px;color:var(--text-muted);">'+(r.sharedWithPartner?"Your share (all-in)":"All-in comfortable")+'</div><div style="font-size:28px;font-weight:800;color:var(--primary,#6366f1);">'+Ae(r.allInComfortableMonthly)+'<span style="font-size:13px;font-weight:400;color:var(--text-muted);">/mo</span></div><div style="font-size:12px;color:var(--text-muted);">'+Ae(o)+"/yr — what your plan funds</div></div>";r.sharedWithPartner&&(c+='<div><div style="font-size:12px;color:var(--text-muted);">Partner’s share</div><div style="font-size:24px;font-weight:700;">'+Ae(r.partnerAllInMonthly)+'<span style="font-size:13px;font-weight:400;color:var(--text-muted);">/mo</span></div><div style="font-size:12px;color:var(--text-muted);">their side — they can plan with this</div></div>'),c+="</div>",c+='<div class="alert alert-info" style="margin-bottom:14px;"><strong>vs PLSA (single, 2024):</strong> Minimum '+Ae(s.minimum)+" · Moderate "+Ae(s.moderate)+" · Comfortable "+Ae(s.comfortable)+" per year — you’re "+l+'. <span style="color:var(--text-muted);">(Home owned outright; excludes care costs.)</span></div>';const d=Ts(window._budget).slice(0,8);return d.length&&(c+='<div style="margin-bottom:14px;"><div style="font-size:13px; margin-bottom:6px;"><strong>Did you miss anything?</strong> Tap to add, then find it on its category screen:</div><div style="display:flex; flex-wrap:wrap; gap:6px;">'+d.map(f=>'<button type="button" class="budwiz-chip" title="'+Ve(f.hint||"")+`" onclick="budWizSuggest('`+Ve(f.label).replace(/'/g,"\\'")+`', null)">+ `+Ve(f.label)+"</button>").join("")+"</div></div>"),c+='<div style="font-size:13px; color:var(--text-muted); margin-bottom:10px;">Everything is saved automatically as you type.</div>',c+='<div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:6px;"><button type="button" onclick="budWizSave(false)">Done</button><button type="button" onclick="budWizSave(true)">Set as my plan’s target (Stress + Decision) &amp; finish</button></div>',c}const e=Qs.find(r=>r.key===t),n=window._budget.lines.filter(r=>IS(r)===e.key),i=Ts(window._budget).filter(r=>(Ad[r.label.toLowerCase()]||"extras")===e.key);return'<h2 style="margin-bottom:6px;">'+e.title+'</h2><div class="alert alert-info" style="margin-bottom:10px; font-size:13px;">'+e.tip+"</div>"+(n.map(SS).join("")||'<p style="font-size:13px;color:var(--text-muted);">Nothing here yet — add below.</p>')+`<div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:12px; align-items:center;"><button type="button" class="risk-btn" onclick="budWizAddLine('`+e.key+`')">+ Add your own</button>`+(i.length?'<span style="font-size:12px;color:var(--text-muted);">Often forgotten:</span>'+i.map(r=>'<button type="button" class="budwiz-chip" title="'+Ve(r.hint||"")+`" onclick="budWizSuggest('`+Ve(r.label).replace(/'/g,"\\'")+"','"+e.key+`')">+ `+Ve(r.label)+"</button>").join(""):"")+"</div>"}function Lt(t=!1){const e=document.getElementById("budWizardOverlay"),n=e.querySelector(".budwiz-body"),i=t&&n?n.scrollTop:0,r=os[kn],s=kn===os.length-1,o=os.map((l,c)=>'<span class="budwiz-dot '+(c===kn?"on":c<kn?"done":"")+'"></span>').join("");e.innerHTML='<div class="budwiz-shell"><div class="budwiz-head" style="display:flex; justify-content:space-between; align-items:center;"><div style="font-size:13px; color:var(--text-muted);">Budget walk-through · step '+(kn+1)+" of "+os.length+'</div><button type="button" class="risk-btn" style="padding:4px 12px;" title="Close (your entries are kept)" onclick="closeBudgetWizard()">&times;</button></div><div class="budwiz-body">'+kS(r)+'</div><div class="budwiz-foot"><button type="button" class="risk-btn" onclick="budWizGo(-1)"'+(kn===0?" disabled":"")+">Back</button>"+(s?"":'<button type="button" onclick="budWizGo(1)">'+(r==="intro"?"Start":"Next")+"</button>")+'<div class="budwiz-dots">'+o+'</div><div id="budWizTotals" style="margin-left:auto; font-size:13px; color:var(--text-muted);"></div></div></div>',Fr(),e.querySelector(".budwiz-body").scrollTop=i}let Kl=!1,Ql=!1;async function Js(){try{const t=await bt();return!!(t&&t.locked)}catch(t){return console.warn("Could not read decision settings for lock state:",t),!1}}async function Pg(){try{const[t,e,n]=await Promise.all([bt(),Zi({limit:1e3}),Gn()]);if(n&&Object.values(n).some(s=>s&&s.yearSetupComplete))return!0;const i=Om(t);return(Array.isArray(e)?e:[]).some(s=>s.settingsChecksum===void 0||s.settingsChecksum===i)}catch(t){return console.warn("Could not determine derived-data state:",t),!0}}function Gh(t){const e=document.getElementById("decision-decisionsettings");e&&e.querySelectorAll("input, select, textarea, button").forEach(n=>{n.closest("#dsLockBanner")||n.id!=="dsSaveBtn"&&(n.disabled=!t)})}async function Pd(){const t=document.getElementById("dsLockBanner"),e=document.getElementById("dsSaveBtn");if(!(!t||!e)){if(Kl=await Js(),!Kl){t.style.display="none",Gh(!0),e.textContent="Save Settings",e.classList.remove("btn-locked"),Wl();return}Ql=!await Pg(),t.style.display="flex",t.className="lock-banner",Ql?t.innerHTML='<span>🔒 <strong>These settings are locked.</strong> Nothing has been recorded against them yet — no tax years, no monthly entries — so you can unlock and edit them.</span><button type="button" onclick="unlockDecisionSettings()">Unlock to edit</button>':t.innerHTML='<span>🔒 <strong>These settings are locked.</strong> Tax years or monthly entries have been recorded against them, so they can’t be changed. To use different settings, create a new plan.</span><button type="button" onclick="createNewPlanForSettings()">Create new plan</button>',Gh(!1),e.textContent="🔒 Locked",e.classList.add("btn-locked"),Wl()}}window.unlockDecisionSettings=async function(){if(await Pg()){showToast("Can’t unlock — tax years or entries now depend on these settings. Create a new plan.","warning"),await Pd();return}St("Unlocking…");try{await Ys({locked:!1}),await Td(),showToast("Settings unlocked — you can edit them now.","success")}catch(t){console.error("Unlock error:",t),showToast("Could not unlock: "+t.message,"error")}finally{At()}};window.createNewPlanForSettings=function(){const t=document.getElementById("scenarioNewBtn");t&&t.click()};window.saveDecisionSettingsUI=async function(){if(!dt()){showToast("Please sign in to save settings","error");return}if(Kl||await Js()){showToast(Ql?"These settings are locked. Use “Unlock to edit” above to change them.":"These settings are locked. Define a new plan to use different settings.","info");return}const t=Ma(document.getElementById("dsSpStartDate").value.trim());if(!t.valid){showToast(t.error,"error");return}t.warning&&showToast(t.warning,"warning");const e=readAlloc("ds");if(bd(e.equityMin,e.bondMin,e.cashTarget)){St("Saving settings...");try{await Ys({configured:!0,equityMin:e.equityMin,bondMin:e.bondMin,cashTarget:e.cashTarget,duration:+document.getElementById("dsDuration").value,equityGlideEnabled:document.getElementById("dsEquityGlide").checked,baseSalary:+document.getElementById("dsBaseSalary").value,spendingProfile:document.getElementById("dsSpendingProfile").value||"flat",spStartDate:document.getElementById("dsSpStartDate").value.trim()||null,spWeeklyAmount:+document.getElementById("dsSpWeeklyAmount").value||0,protectionFactor:+document.getElementById("dsProtectionFactor").value,recoveryBuffer:+document.getElementById("dsRecoveryBuffer").value,consecutiveLimit:+document.getElementById("dsConsecutiveLimit").value,isaBalance:+document.getElementById("dsIsaBalance").value||0,diversifierStart:e.diversifierStart||0,subAsset:e.subAsset||null,glideEndgame:e.glideEndgame||null,allocMode:_d("ds"),taggedFunds:Mt("ds").filter(n=>n.ticker&&n.value>0),locked:!0}),vd(),showToast("Settings saved and locked. Create a new plan to use different settings.","success",4e3),await Pd()}catch(n){console.error("Error saving decision settings:",n),showToast("Error saving: "+n.message,"error")}finally{At()}}};window.resetDecisionSettingsUI=async function(){if(confirm("Reset all decision settings to defaults?")){St("Resetting settings...");try{await Ys({equityMin:25e4,bondMin:2e5,cashTarget:5e4,duration:35,baseSalary:3e4,protectionFactor:20,recoveryBuffer:15e3,consecutiveLimit:3}),await Td(),showToast("Settings reset to defaults","success")}catch(t){console.error("Error resetting settings:",t),showToast("Error resetting: "+t.message,"error")}finally{At()}}};window.showDrawdownScheduleUI=async function(){const t=parseFloat(document.getElementById("ddInflation").value)/100||.025,e=parseInt(document.getElementById("ddDuration").value)||35;try{const n=await Bt();n.duration=e;const i=Qh(n,e,t);let r='<div class="card"><h2>Projected Drawdown Schedule (SIPP + ISA bridge)</h2>';r+='<div class="alert alert-info" style="margin-bottom:16px;">SIPP is drawn to fill the basic-rate band; the tax-free <strong>ISA tops your income up to the target</strong> and runs down over the years (the bridge to the State Pension). Deterministic projection at your assumed inflation — the stochastic ISA path is in the Monte-Carlo / Historical results.</div>',r+='<div style="overflow-x: auto;"><table>',r+="<thead><tr><th>Year</th><th>SIPP Draw</th><th>State</th><th>Tax</th><th>Net (SIPP+SP)</th><th>ISA Top-up</th><th>Spendable</th><th>ISA Left</th></tr></thead>",r+="<tbody>";for(const s of i)r+=`<tr>
            <td>${s.year}</td>
            <td style="color: var(--primary); font-weight: 600;">${j(s.sippDraw)}</td>
            <td>${j(s.statePension)}</td>
            <td style="color: var(--danger);">-${j(s.tax)}</td>
            <td>${j(s.netIncome)}</td>
            <td style="color: var(--info);">${j(s.isaDraw)}</td>
            <td style="color: var(--success); font-weight: 600;">${j(s.spendable)}</td>
            <td>${j(s.isaBalance)}</td>
          </tr>`;r+="</tbody></table></div></div>",document.getElementById("drawdownResults").innerHTML=r}catch(n){console.error("Drawdown error:",n),document.getElementById("drawdownResults").innerHTML=`<div class="alert alert-danger">Error: ${n.message}</div>`}};window.showGlidepathUI=async function(){const t=parseFloat(document.getElementById("gpInflation").value)/100||.025,e=parseInt(document.getElementById("gpDuration").value)||35;try{const n=await Bt();n.duration=e;const i=my(n,t),r=Qh(n,e,t),s={};r.forEach(f=>{s[f.year]=f.isaBalance});const o=!!n.equityGlideEnabled,l=(n.equityMin||0)+(n.bondMin||0)+(n.cashTarget||0),c={equity:l>0?n.equityMin/l:.5,bond:l>0?n.bondMin/l:.4,cash:l>0?n.cashTarget/l:.1,equityGlide:o?Cs(n.equityMin,n.bondMin):void 0};let d='<div class="card"><h2>Fund Glidepath Over Time</h2>';d+='<div class="alert alert-info" style="margin-bottom: 20px;">',d+=o?"<strong>Bond tent on:</strong> the equity share (Shares %) RISES over the early years then holds; the £ floors inflate with CPI and deplete over time, cash holds its real value, and the ISA bridge runs down as it tops up income.":"<strong>Glidepath:</strong> Equity & Bond minimums inflate with CPI but deplete over time to £0; cash inflates only (holds real value); the ISA bridge runs down as it tops up income. Turn on the bond tent in Settings to see the equity share rise.",d+="</div>",d+='<div style="overflow-x: auto;"><table>',d+="<thead><tr><th>Year</th><th>Equity Min</th><th>Bond Min</th><th>Cash Target</th><th>Shares % (of pot)</th><th>ISA Balance</th><th>Total Min</th></tr></thead>",d+="<tbody>";for(const f of i){const m=Math.round(pl(c,f.year,n.duration).equity*100);d+=`<tr>
            <td>${f.year}</td>
            <td style="color: var(--success);">${j(f.equityMin)}</td>
            <td style="color: var(--info);">${j(f.bondMin)}</td>
            <td style="color: var(--warning);">${j(f.cashTarget)}</td>
            <td style="font-weight: 600;">${m}%</td>
            <td>${j(s[f.year]||0)}</td>
            <td style="font-weight: 600;">${j(f.totalMin)}</td>
          </tr>`}d+="</tbody></table></div></div>",document.getElementById("glidepathResults").innerHTML=d}catch(n){console.error("Glidepath error:",n),document.getElementById("glidepathResults").innerHTML=`<div class="alert alert-danger">Error: ${n.message}</div>`}};let Vt=null,an=[],ln="all";async function mn(){const t=document.getElementById("historyTabs"),e=document.getElementById("historyDetail"),n=document.getElementById("historyYearFilter"),i=document.getElementById("deleteAllHistoryBtn"),r=document.getElementById("deleteYearBtn");if(!t||!e)return;if(t.innerHTML='<span class="loading">Loading...</span>',an=await Zi({sortDesc:!1,limit:500}),i&&(i.style.display=an.length>0?"":"none"),r&&(r.style.display="none"),an.length===0){t.innerHTML="",n&&(n.innerHTML='<option value="all">No entries</option>'),e.innerHTML=`
          <div class="no-history-message">
            <h3>No History Entries</h3>
            <p>Save decisions from the Decision Tool to build your history.</p>
          </div>
        `;return}const s=[...new Set(an.map(d=>d.date.split("-")[0]))].sort().reverse();if(n){let d='<option value="all">All Years</option>';s.forEach(f=>{d+=`<option value="${f}">${f}</option>`}),n.innerHTML=d,n.value=ln}r&&(r.style.display=ln!=="all"&&an.length>0?"":"none");const o=ln==="all"?an:an.filter(d=>d.date.startsWith(ln));if(o.length===0){t.innerHTML="",e.innerHTML=`
          <div class="no-history-message">
            <h3>No entries for ${ln}</h3>
            <p>Select a different year or "All Years".</p>
          </div>
        `;return}let l="";o.forEach(d=>{const f=d.date===Vt,m=["history-tab"];f&&m.push("active"),d.inProtection&&m.push("protection");const[p,y]=d.date.split("-").map(Number),I=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],x=ln==="all"?`${I[y-1]} ${p}`:I[y-1];l+=`<button class="${m.join(" ")}" onclick="selectHistoryEntry('${d.date}')">${x}</button>`}),t.innerHTML=l;const c=document.getElementById("historyMobileSelector");if(c){let d="";o.forEach(f=>{const m=kr(f.date),p=f.inProtection?" (Protection)":"";d+=`<option value="${f.date}">${m}${p}</option>`}),c.innerHTML=d}(!Vt||!o.find(d=>d.date===Vt))&&(Vt=o[o.length-1].date),c&&(c.value=Vt),Cg(Vt),setTimeout(()=>{const d=t.querySelector(".history-tab.active");d&&d.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})},100)}window.filterHistoryByYear=function(t){ln=t,Vt=null,mn()};function kr(t){const[e,n]=t.split("-").map(Number);return`${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][n-1]} ${e}`}function Cg(t){const e=document.getElementById("historyDetail"),n=an.find(d=>d.date===t);if(!n){e.innerHTML='<div class="no-history-message"><h3>Entry not found</h3></div>';return}const i=d=>d!=null?"£"+Math.round(d).toLocaleString():"—",r=n.isTaxEfficientYear!==!1&&n.mode==="Tax-Efficient",s=n.inProtection?"warning":r?"efficient":"inefficient",o=n.inProtection?`Protection${n.protectionInducedTaxEfficiency?" (Tax-Efficient)":""}`:r?"Tax-Efficient":"Standard";let l=n.source||"Unknown";n.source==="Growth"&&(n.dEquity>0||n.dBond>0)?l=`Growth (Equity: ${i(n.dEquity||0)}, Bond: ${i(n.dBond||0)})`:n.source==="Cash"&&(l=`Cash (${i(n.dCash||n.sipp||0)})`);let c=`
        <div class="no-print" style="display:flex;justify-content:flex-end;margin-bottom:12px;">
          <button class="btn secondary" onclick="printMonthlyReport('${n.date}')">Download PDF</button>
        </div>
        <!-- Header with date and mode -->
        <div class="history-detail-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <div>
              <h3 style="margin:0;">${kr(n.date)}</h3>
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
      `;e.innerHTML=c,document.querySelectorAll(".history-tab").forEach(d=>{d.classList.toggle("active",d.textContent===kr(t))})}window.selectHistoryEntry=function(t){Vt=t,Cg(t);const e=document.getElementById("historyMobileSelector");e&&(e.value=t);const i=document.getElementById("historyTabs").querySelector(".history-tab.active");i&&i.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})};window.scrollHistoryTabs=function(t){const e=document.getElementById("historyTabs"),n=200;t==="left"?e.scrollLeft-=n:e.scrollLeft+=n};function ea(t){const[e,n]=t.split("-").map(Number);return n>=4?`${e%100}/${(e+1)%100}`:`${(e-1)%100}/${e%100}`}async function Jl(t){const e={};for(const i of t){const r=i.taxYear||ea(i.date);e[r]||(e[r]=0),e[r]+=i.isaSavingsUsedThisMonth||i.isa||0}for(const i of t)await Fm(i.date);const n=await Gn();for(const[i,r]of Object.entries(e))if(n[i]){const s=n[i].isaSavingsUsed||0,o=Math.max(0,s-r);await Xi(i,{...n[i],isaSavingsUsed:o})}}window.deleteHistoryEntry=async function(t){if(!dt()){showToast("Please sign in to delete entries","error");return}const e=await Zi({sortDesc:!1,limit:1e3}),n=ea(t),r=e.filter(c=>(c.taxYear||ea(c.date))===n).sort((c,d)=>c.date.localeCompare(d.date)),s=r.findIndex(c=>c.date===t);if(s===-1){showToast("Entry not found","error");return}const o=s===r.length-1,l=kr(t);if(o){if(!confirm(`Delete entry for ${l}?`))return;St("Deleting entry...");try{await Jl([r[s]]),showToast(`Deleted ${l}`,"success"),Vt=null,await mn()}catch(c){console.error("Delete error:",c),showToast("Error deleting: "+c.message,"error")}finally{At()}}else{const c=r.slice(s),d=kr(c[c.length-1].date);if(!confirm(`This will delete ${c.length} entries from ${l} to ${d} in tax year ${n}.

Continue?`))return;St(`Deleting ${c.length} entries...`);try{await Jl(c),showToast(`Deleted ${c.length} entries`,"success"),Vt=null,await mn()}catch(f){console.error("Delete error:",f),showToast("Error deleting: "+f.message,"error")}finally{At()}}};window.deleteHistoryForTaxYear=async function(t){if(!dt()){showToast("Please sign in to delete entries","error");return}const n=(await Zi({sortDesc:!1,limit:1e3})).filter(i=>(i.taxYear||ea(i.date))===t);if(n.length===0){showToast(`No history entries for tax year ${t}`,"info");return}if(confirm(`Delete all ${n.length} history entries for tax year ${t}?`)){St(`Deleting tax year ${t}...`);try{await Jl(n);const i=await Gn();i[t]&&await Xi(t,{...i[t],isaSavingsUsed:0}),showToast(`Deleted all entries for ${t}`,"success"),Vt=null,await mn()}catch(i){console.error("Delete error:",i),showToast("Error deleting: "+i.message,"error")}finally{At()}}};window.deleteHistoryForSelectedYear=async function(){if(ln==="all"){showToast("Select a specific year first","error");return}const t=`${parseInt(ln)%100}/${(parseInt(ln)+1)%100}`;await deleteHistoryForTaxYear(t)};window.deleteAllHistory=async function(){if(confirm("Delete ALL history entries? This cannot be undone.")&&confirm("Are you ABSOLUTELY sure? All decision history will be permanently deleted.")){if(!dt()){showToast("Please sign in to delete entries","error");return}St("Deleting all history...");try{const t=await Zi({limit:1e3});for(const n of t)await Fm(n.date);const e=await Gn();for(const[n,i]of Object.entries(e))i.isaSavingsUsed>0&&await Xi(n,{...i,isaSavingsUsed:0});showToast(`Deleted ${t.length} entries`,"success"),Vt=null,await mn()}catch(t){console.error("Delete all error:",t),showToast("Error deleting: "+t.message,"error")}finally{At()}}};let Mi=null;async function Gi(){const t=document.getElementById("taxYearTabs"),e=document.getElementById("taxYearDetail");if(!t||!e)return;t.innerHTML='<span class="loading">Loading...</span>';const n=await Gn(),i=await bt(),r=Object.keys(n).sort(),s=RS(),o=PS(r,s,40);let l="";o.forEach(f=>{const m=n[f],p=m&&m.yearSetupComplete,y=f===Mi,I=["tax-year-tab"];y&&I.push("active"),p||I.push("not-setup"),l+=`<button class="${I.join(" ")}" onclick="selectTaxYear('${f}')">${f}</button>`}),t.innerHTML=l;const c=document.getElementById("taxYearMobileSelector");if(c){let f="";o.forEach(m=>{const p=n[m],I=p&&p.yearSetupComplete?m:`${m} (not set up)`;f+=`<option value="${m}">${I}</option>`}),c.innerHTML=f}if(!Mi){const f=r.filter(m=>{var p;return(p=n[m])==null?void 0:p.yearSetupComplete});Mi=f.length>0?f[f.length-1]:s}c&&(c.value=Mi),await Mg(Mi,n,i);const d=t.querySelector(".tax-year-tab.active");d&&d.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})}function RS(){const t=new Date,e=t.getFullYear(),n=t.getMonth()+1;return n<4||n===4&&t.getDate()<6?`${String(e-1).slice(-2)}/${String(e).slice(-2)}`:`${String(e).slice(-2)}/${String(e+1).slice(-2)}`}function PS(t,e,n){const i=new Set(t),[r]=e.split("/").map(Number),s=r<50?2e3+r:1900+r;for(let o=0;o<n&&i.size<n;o++){const l=s+o,c=l+1;i.add(`${String(l).slice(-2)}/${String(c).slice(-2)}`)}return Array.from(i).sort()}async function Mg(t,e,n){var _,w,E,S,b,le,pe,H,ee,ne,te,Me,Pe,ye;const i=document.getElementById("taxYearDetail"),r=e[t];if(!r||!r.yearSetupComplete){i.innerHTML=`
          <div class="not-configured-message">
            <h3>Tax Year ${t} Not Configured</h3>
            <p>This tax year hasn't been set up yet. Use the Decision Tool to calculate a decision for a month in this tax year to trigger the setup wizard.</p>
            <button class="btn primary" onclick="triggerWizardForYear('${t}')">Set Up ${t}</button>
          </div>
        `;return}const s=await ed(t),o=Math.round(s.amount||0),l=s.startDate||"Not configured",c=s.isReceiving;s.yearsUntil;const d=O=>O!=null?"£"+Math.round(O).toLocaleString():"—",f=(n.equityMin||0)+(n.bondMin||0)+(n.cashTarget||0),m=n.duration||35,p=Math.max(0,2e3+(parseInt(t.split("/")[0],10)||26)-2026),y=!!n.equityGlideEnabled,I={equity:f>0?n.equityMin/f:.5,bond:f>0?n.bondMin/f:.4,cash:f>0?n.cashTarget/f:.1,equityGlide:y?Cs(n.equityMin,n.bondMin):void 0},x=pl(I,p,m),A=pl(I,Math.max(0,p-1),m),R=O=>Math.round(O*100),C=Math.max(5,m-20),L=R(x.equity)-R(A.equity),N=`${R(x.equity)}% shares / ${R(x.bond)}% bonds / ${R(x.cash)}% cash`;let z,q;y?p>C?(q=`Holding — reached your mix at year ${C}`,z=`You've reached your endgame mix. Hold ${N}; no glide change this year.`):L>0?(q=`Rising — year ${p} of ${C}`,z=`Shift about ${L}% of your pot from bonds into shares this year, reaching ${N}.`):(q=`Rising — year ${p} of ${C}`,z=`Hold ${N}.`):(q="Flat (bond tent off)",z=`Hold a steady ${N}. Rebalance back to this whenever it drifts.`);const T=`
        <div class="tax-year-detail-card">
          <h3>This Year's Target Mix${y?" — Bond Tent":""}</h3>
          <div class="tax-year-grid">
            <div class="tax-year-field"><label>Shares</label><span class="value">${R(x.equity)}% · ${d(f*x.equity)}</span></div>
            <div class="tax-year-field"><label>Bonds</label><span class="value">${R(x.bond)}% · ${d(f*x.bond)}</span></div>
            <div class="tax-year-field"><label>Cash</label><span class="value">${R(x.cash)}% · ${d(f*x.cash)}</span></div>
            <div class="tax-year-field"><label>Glide stage</label><span class="value">${q}</span></div>
          </div>
          <div class="alert alert-info" style="margin-top:12px;"><strong>Rebalance:</strong> ${z}</div>
        </div>`;let v=`<div class="no-print" style="display:flex;gap:8px;justify-content:flex-end;margin-bottom:12px;"><button class="btn secondary" onclick="printAnnualReport('${t}')">Download PDF</button> <button class="btn secondary" onclick="exportAnnualCsv('${t}')">Export CSV</button></div>`+T+`
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
              <span class="value">${c?d(o)+(s.isFirstYear?" (partial year)":""):l!=="Not configured"?`Starts ${l}`:"Not configured"}</span>
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
              <span class="value">${CS(r.startMonth||4)}</span>
            </div>
            <div class="tax-year-field">
              <label>Remaining Months (at setup)</label>
              <span class="value">${r.remainingMonths||12}</span>
            </div>
          </div>
        </div>
      `;if(r.expectedMonthly){const O=r.expectedMonthly;v+=`
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
                  <td>${d((_=O.sipp)==null?void 0:_.gross)}</td>
                  <td class="tax-col">-${d((w=O.sipp)==null?void 0:w.tax)}</td>
                  <td class="net-col">${d((E=O.sipp)==null?void 0:E.net)}</td>
                </tr>
                ${((S=O.other)==null?void 0:S.gross)>0?`
                <tr>
                  <td class="source-name">Other Income</td>
                  <td>${d((b=O.other)==null?void 0:b.gross)}</td>
                  <td class="tax-col">-${d((le=O.other)==null?void 0:le.tax)}</td>
                  <td class="net-col">${d((pe=O.other)==null?void 0:pe.net)}</td>
                </tr>
                `:""}
                ${((H=O.statePension)==null?void 0:H.gross)>0?`
                <tr>
                  <td class="source-name">State Pension</td>
                  <td>${d((ee=O.statePension)==null?void 0:ee.gross)}</td>
                  <td class="tax-col">-${d((ne=O.statePension)==null?void 0:ne.tax)}</td>
                  <td class="net-col">${d((te=O.statePension)==null?void 0:te.net)}</td>
                </tr>
                `:""}
                ${((Me=O.isa)==null?void 0:Me.net)>0?`
                <tr>
                  <td class="source-name">ISA <span style="color:var(--success);font-size:11px;">(tax-free)</span></td>
                  <td>${d((Pe=O.isa)==null?void 0:Pe.gross)}</td>
                  <td style="color:var(--success);">£0</td>
                  <td class="net-col">${d((ye=O.isa)==null?void 0:ye.net)}</td>
                </tr>
                `:""}
              </tbody>
              <tfoot>
                <tr>
                  <td><strong>Total</strong></td>
                  <td><strong>${d(O.totalGross)}</strong></td>
                  <td class="tax-col"><strong>-${d(O.totalTax)}</strong></td>
                  <td class="net-col"><strong>${d(O.totalNet)}</strong></td>
                </tr>
              </tfoot>
            </table>
            <p style="margin-top:16px;font-size:14px;color:var(--text);">
              <strong>Monthly take-home: ${d(O.totalNet)}</strong>
            </p>
          </div>
        `}v+=`
        <div class="tax-year-actions">
          <button class="btn secondary" onclick="deleteTaxYear('${t}')">Delete Year</button>
          <button class="btn secondary" onclick="reconfigureTaxYear('${t}')">Reconfigure via Wizard</button>
        </div>
      `,i.innerHTML=v,document.querySelectorAll(".tax-year-tab").forEach(O=>{O.classList.toggle("active",O.textContent===t)})}window.selectTaxYear=async function(t){Mi=t;const e=await Gn(),n=await bt();await Mg(t,e,n),document.querySelectorAll(".tax-year-tab").forEach(o=>{o.classList.toggle("active",o.textContent===t)});const i=document.getElementById("taxYearMobileSelector");i&&(i.value=t);const s=document.getElementById("taxYearTabs").querySelector(`.tax-year-tab[onclick="selectTaxYear('${t}')"]`);s&&s.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})};window.scrollTaxYearTabs=function(t){const e=document.getElementById("taxYearTabs"),n=200;t==="left"?e.scrollLeft-=n:e.scrollLeft+=n};function CS(t){return["January","February","March","April","May","June","July","August","September","October","November","December"][(t-1)%12]||"April"}window.triggerWizardForYear=async function(t){const[e]=t.split("/").map(Number),n=e<50?2e3+e:1900+e,i=`${n}-04`,r=document.getElementById("selectedMonth");r&&(r.value=i),document.querySelectorAll(".tab").forEach(s=>s.classList.remove("active")),document.querySelector('.tab[data-tab="decision"]').classList.add("active"),document.querySelectorAll(".tab-content").forEach(s=>s.classList.remove("active")),document.getElementById("decision-content").classList.add("active"),document.querySelectorAll(".sub-tab[data-decisiontab]").forEach(s=>s.classList.remove("active")),document.querySelector('.sub-tab[data-decisiontab="entry"]').classList.add("active"),document.querySelectorAll(".decision-subtab").forEach(s=>s.classList.add("hidden")),document.getElementById("decision-entry").classList.remove("hidden"),showToast(`Please click "Calculate" with April ${n} selected to set up tax year ${t}`,"info",5e3)};window.reconfigureTaxYear=async function(t){if(confirm(`This will allow you to reconfigure tax year ${t}. The setup wizard will be triggered when you next calculate a decision for this year. Continue?`))try{const e=await Pa(t);e.yearSetupComplete=!1,await Xi(t,e),await Gi(),showToast(`Tax year ${t} marked for reconfiguration. Calculate a decision for this year to run the wizard again.`,"success",5e3)}catch(e){console.error("Error:",e),showToast("Error: "+e.message,"error")}};window.updateTaxYear=async function(t,e,n){try{const i=await Pa(t);i[e]=parseFloat(n),await Xi(t,i)}catch(i){console.error("Error updating tax year:",i),showToast("Error saving: "+i.message,"error")}};window.deleteTaxYear=async function(t){if(confirm("Delete tax year "+t+"? This will remove all configuration for this year."))try{const e=await vn();delete e.taxYears[t],await Ra(e),Mi=null,await Gi()}catch(e){console.error("Error deleting tax year:",e),showToast("Error deleting: "+e.message,"error")}};window.addTaxYear=async function(){if(!dt()){showToast("Please sign in to add tax years","error");return}const t=prompt("Enter tax year (e.g., 25/26):");if(!t||!/^\d{2}\/\d{2}$/.test(t)){showToast("Invalid format. Use YY/YY (e.g., 25/26)","error");return}try{await Xi(t,{}),await Gi()}catch(e){console.error("Save error:",e),showToast("Error saving: "+e.message,"error")}};console.log("Pension Planner v"+Kh+" loaded");
