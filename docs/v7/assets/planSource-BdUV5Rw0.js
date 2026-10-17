import{h as oc,ad as ea,f as ac,ae as ta,c as jt,S as Ge,D as fe,af as Te,ag as Tn,ah as lc,ai as cc,aj as uc,ak as dc,al as na,am as rr,an as hc,g as fc,ao as pc,ap as Ys,aq as Ts,ar as sa,as as Nr,at as vi,au as mc,av as ir,aw as ra,R as ht,ax as gc,ay as _i,az as yc,q as Ac,j as vc,aA as ia,aB as _c,aC as oa,aD as Wn,aE as bc,aF as X,aG as Tc,aH as Sc,aI as wc,aJ as Ic,aK as Ec}from"./index-CG8_TT_P.js";import{B as Lt,F as kc,l as Pc,S as pn,j as Rc,G as Mc}from"./SpendingModel-B2FKV7lF.js";var bi={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const aa=function(t){const e=[];let n=0;for(let s=0;s<t.length;s++){let r=t.charCodeAt(s);r<128?e[n++]=r:r<2048?(e[n++]=r>>6|192,e[n++]=r&63|128):(r&64512)===55296&&s+1<t.length&&(t.charCodeAt(s+1)&64512)===56320?(r=65536+((r&1023)<<10)+(t.charCodeAt(++s)&1023),e[n++]=r>>18|240,e[n++]=r>>12&63|128,e[n++]=r>>6&63|128,e[n++]=r&63|128):(e[n++]=r>>12|224,e[n++]=r>>6&63|128,e[n++]=r&63|128)}return e},Oc=function(t){const e=[];let n=0,s=0;for(;n<t.length;){const r=t[n++];if(r<128)e[s++]=String.fromCharCode(r);else if(r>191&&r<224){const i=t[n++];e[s++]=String.fromCharCode((r&31)<<6|i&63)}else if(r>239&&r<365){const i=t[n++],o=t[n++],l=t[n++],a=((r&7)<<18|(i&63)<<12|(o&63)<<6|l&63)-65536;e[s++]=String.fromCharCode(55296+(a>>10)),e[s++]=String.fromCharCode(56320+(a&1023))}else{const i=t[n++],o=t[n++];e[s++]=String.fromCharCode((r&15)<<12|(i&63)<<6|o&63)}}return e.join("")},la={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let r=0;r<t.length;r+=3){const i=t[r],o=r+1<t.length,l=o?t[r+1]:0,a=r+2<t.length,c=a?t[r+2]:0,u=i>>2,d=(i&3)<<4|l>>4;let f=(l&15)<<2|c>>6,m=c&63;a||(m=64,o||(f=64)),s.push(n[u],n[d],n[f],n[m])}return s.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(aa(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):Oc(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let r=0;r<t.length;){const i=n[t.charAt(r++)],l=r<t.length?n[t.charAt(r)]:0;++r;const c=r<t.length?n[t.charAt(r)]:64;++r;const d=r<t.length?n[t.charAt(r)]:64;if(++r,i==null||l==null||c==null||d==null)throw new Dc;const f=i<<2|l>>4;if(s.push(f),c!==64){const m=l<<4&240|c>>2;if(s.push(m),d!==64){const g=c<<6&192|d;s.push(g)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class Dc extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Nc=function(t){const e=aa(t);return la.encodeByteArray(e,!0)},Xn=function(t){return Nc(t).replace(/\./g,"")},ca=function(t){try{return la.decodeString(t,!0)}catch{}return null};/**
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
 */function xc(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const Cc=()=>xc().__FIREBASE_DEFAULTS__,Lc=()=>{if(typeof process>"u"||typeof bi>"u")return;const t=bi.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},Vc=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&ca(t[1]);return e&&JSON.parse(e)},xr=()=>{try{return Cc()||Lc()||Vc()}catch{return}},ua=t=>{var e,n;return(n=(e=xr())===null||e===void 0?void 0:e.emulatorHosts)===null||n===void 0?void 0:n[t]},Bc=t=>{const e=ua(t);if(!e)return;const n=e.lastIndexOf(":");if(n<=0||n+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const s=parseInt(e.substring(n+1),10);return e[0]==="["?[e.substring(1,n-1),s]:[e.substring(0,n),s]},da=()=>{var t;return(t=xr())===null||t===void 0?void 0:t.config},ha=t=>{var e;return(e=xr())===null||e===void 0?void 0:e[`_${t}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fc{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,s)=>{n?this.reject(n):this.resolve(s),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,s))}}}/**
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
 */function Uc(t,e){if(t.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n={alg:"none",type:"JWT"},s=e||"demo-project",r=t.iat||0,i=t.sub||t.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${s}`,aud:s,iat:r,exp:r+3600,auth_time:r,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}}},t);return[Xn(JSON.stringify(n)),Xn(JSON.stringify(o)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ie(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Gc(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Ie())}function Yc(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function $c(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function jc(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Kc(){const t=Ie();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function Wc(){try{return typeof indexedDB=="object"}catch{return!1}}function Hc(){return new Promise((t,e)=>{try{let n=!0;const s="validate-browser-context-for-indexeddb-analytics-module",r=self.indexedDB.open(s);r.onsuccess=()=>{r.result.close(),n||self.indexedDB.deleteDatabase(s),t(!0)},r.onupgradeneeded=()=>{n=!1},r.onerror=()=>{var i;e(((i=r.error)===null||i===void 0?void 0:i.message)||"")}}catch(n){e(n)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zc="FirebaseError";class tt extends Error{constructor(e,n,s){super(n),this.code=e,this.customData=s,this.name=zc,Object.setPrototypeOf(this,tt.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Dn.prototype.create)}}class Dn{constructor(e,n,s){this.service=e,this.serviceName=n,this.errors=s}create(e,...n){const s=n[0]||{},r=`${this.service}/${e}`,i=this.errors[e],o=i?qc(i,s):"Error",l=`${this.serviceName}: ${o} (${r}).`;return new tt(r,l,s)}}function qc(t,e){return t.replace(Jc,(n,s)=>{const r=e[s];return r!=null?String(r):`<${s}?>`})}const Jc=/\{\$([^}]+)}/g;function Qc(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function Zn(t,e){if(t===e)return!0;const n=Object.keys(t),s=Object.keys(e);for(const r of n){if(!s.includes(r))return!1;const i=t[r],o=e[r];if(Ti(i)&&Ti(o)){if(!Zn(i,o))return!1}else if(i!==o)return!1}for(const r of s)if(!n.includes(r))return!1;return!0}function Ti(t){return t!==null&&typeof t=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Nn(t){const e=[];for(const[n,s]of Object.entries(t))Array.isArray(s)?s.forEach(r=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(r))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(s));return e.length?"&"+e.join("&"):""}function Xc(t,e){const n=new Zc(t,e);return n.subscribe.bind(n)}class Zc{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(s=>{this.error(s)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,s){let r;if(e===void 0&&n===void 0&&s===void 0)throw new Error("Missing Observer.");eu(e,["next","error","complete"])?r=e:r={next:e,error:n,complete:s},r.next===void 0&&(r.next=$s),r.error===void 0&&(r.error=$s),r.complete===void 0&&(r.complete=$s);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?r.error(this.finalError):r.complete()}catch{}}),this.observers.push(r),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch{}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function eu(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function $s(){}/**
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
 */function Ae(t){return t&&t._delegate?t._delegate:t}class Rt{constructor(e,n,s){this.name=e,this.instanceFactory=n,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const St="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tu{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const s=new Fc;if(this.instancesDeferred.set(n,s),this.isInitialized(n)||this.shouldAutoInitialize())try{const r=this.getOrInitializeService({instanceIdentifier:n});r&&s.resolve(r)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){var n;const s=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(n=e==null?void 0:e.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(s)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:s})}catch(i){if(r)return null;throw i}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(su(e))try{this.getOrInitializeService({instanceIdentifier:St})}catch{}for(const[n,s]of this.instancesDeferred.entries()){const r=this.normalizeInstanceIdentifier(n);try{const i=this.getOrInitializeService({instanceIdentifier:r});s.resolve(i)}catch{}}}}clearInstance(e=St){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=St){return this.instances.has(e)}getOptions(e=St){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,s=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const r=this.getOrInitializeService({instanceIdentifier:s,options:n});for(const[i,o]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(i);s===l&&o.resolve(r)}return r}onInit(e,n){var s;const r=this.normalizeInstanceIdentifier(n),i=(s=this.onInitCallbacks.get(r))!==null&&s!==void 0?s:new Set;i.add(e),this.onInitCallbacks.set(r,i);const o=this.instances.get(r);return o&&e(o,r),()=>{i.delete(e)}}invokeOnInitCallbacks(e,n){const s=this.onInitCallbacks.get(n);if(s)for(const r of s)try{r(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let s=this.instances.get(e);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:nu(e),options:n}),this.instances.set(e,s),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(s,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,s)}catch{}return s||null}normalizeInstanceIdentifier(e=St){return this.component?this.component.multipleInstances?e:St:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function nu(t){return t===St?void 0:t}function su(t){return t.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ru{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new tu(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var J;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(J||(J={}));const iu={debug:J.DEBUG,verbose:J.VERBOSE,info:J.INFO,warn:J.WARN,error:J.ERROR,silent:J.SILENT},ou=J.INFO,au={[J.DEBUG]:"log",[J.VERBOSE]:"log",[J.INFO]:"info",[J.WARN]:"warn",[J.ERROR]:"error"},lu=(t,e,...n)=>{if(e<t.logLevel)return;const s=new Date().toISOString(),r=au[e];if(!r)throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Cr{constructor(e){this.name=e,this._logLevel=ou,this._logHandler=lu,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in J))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?iu[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,J.DEBUG,...e),this._logHandler(this,J.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,J.VERBOSE,...e),this._logHandler(this,J.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,J.INFO,...e),this._logHandler(this,J.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,J.WARN,...e),this._logHandler(this,J.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,J.ERROR,...e),this._logHandler(this,J.ERROR,...e)}}const cu=(t,e)=>e.some(n=>t instanceof n);let Si,wi;function uu(){return Si||(Si=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function du(){return wi||(wi=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const fa=new WeakMap,or=new WeakMap,pa=new WeakMap,js=new WeakMap,Lr=new WeakMap;function hu(t){const e=new Promise((n,s)=>{const r=()=>{t.removeEventListener("success",i),t.removeEventListener("error",o)},i=()=>{n(ft(t.result)),r()},o=()=>{s(t.error),r()};t.addEventListener("success",i),t.addEventListener("error",o)});return e.then(n=>{n instanceof IDBCursor&&fa.set(n,t)}).catch(()=>{}),Lr.set(e,t),e}function fu(t){if(or.has(t))return;const e=new Promise((n,s)=>{const r=()=>{t.removeEventListener("complete",i),t.removeEventListener("error",o),t.removeEventListener("abort",o)},i=()=>{n(),r()},o=()=>{s(t.error||new DOMException("AbortError","AbortError")),r()};t.addEventListener("complete",i),t.addEventListener("error",o),t.addEventListener("abort",o)});or.set(t,e)}let ar={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return or.get(t);if(e==="objectStoreNames")return t.objectStoreNames||pa.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return ft(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function pu(t){ar=t(ar)}function mu(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const s=t.call(Ks(this),e,...n);return pa.set(s,e.sort?e.sort():[e]),ft(s)}:du().includes(t)?function(...e){return t.apply(Ks(this),e),ft(fa.get(this))}:function(...e){return ft(t.apply(Ks(this),e))}}function gu(t){return typeof t=="function"?mu(t):(t instanceof IDBTransaction&&fu(t),cu(t,uu())?new Proxy(t,ar):t)}function ft(t){if(t instanceof IDBRequest)return hu(t);if(js.has(t))return js.get(t);const e=gu(t);return e!==t&&(js.set(t,e),Lr.set(e,t)),e}const Ks=t=>Lr.get(t);function yu(t,e,{blocked:n,upgrade:s,blocking:r,terminated:i}={}){const o=indexedDB.open(t,e),l=ft(o);return s&&o.addEventListener("upgradeneeded",a=>{s(ft(o.result),a.oldVersion,a.newVersion,ft(o.transaction),a)}),n&&o.addEventListener("blocked",a=>n(a.oldVersion,a.newVersion,a)),l.then(a=>{i&&a.addEventListener("close",()=>i()),r&&a.addEventListener("versionchange",c=>r(c.oldVersion,c.newVersion,c))}).catch(()=>{}),l}const Au=["get","getKey","getAll","getAllKeys","count"],vu=["put","add","delete","clear"],Ws=new Map;function Ii(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(Ws.get(e))return Ws.get(e);const n=e.replace(/FromIndex$/,""),s=e!==n,r=vu.includes(n);if(!(n in(s?IDBIndex:IDBObjectStore).prototype)||!(r||Au.includes(n)))return;const i=async function(o,...l){const a=this.transaction(o,r?"readwrite":"readonly");let c=a.store;return s&&(c=c.index(l.shift())),(await Promise.all([c[n](...l),r&&a.done]))[0]};return Ws.set(e,i),i}pu(t=>({...t,get:(e,n,s)=>Ii(e,n)||t.get(e,n,s),has:(e,n)=>!!Ii(e,n)||t.has(e,n)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _u{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(bu(n)){const s=n.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(n=>n).join(" ")}}function bu(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const lr="@firebase/app",Ei="0.10.13";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qe=new Cr("@firebase/app"),Tu="@firebase/app-compat",Su="@firebase/analytics-compat",wu="@firebase/analytics",Iu="@firebase/app-check-compat",Eu="@firebase/app-check",ku="@firebase/auth",Pu="@firebase/auth-compat",Ru="@firebase/database",Mu="@firebase/data-connect",Ou="@firebase/database-compat",Du="@firebase/functions",Nu="@firebase/functions-compat",xu="@firebase/installations",Cu="@firebase/installations-compat",Lu="@firebase/messaging",Vu="@firebase/messaging-compat",Bu="@firebase/performance",Fu="@firebase/performance-compat",Uu="@firebase/remote-config",Gu="@firebase/remote-config-compat",Yu="@firebase/storage",$u="@firebase/storage-compat",ju="@firebase/firestore",Ku="@firebase/vertexai-preview",Wu="@firebase/firestore-compat",Hu="firebase",zu="10.14.1";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cr="[DEFAULT]",qu={[lr]:"fire-core",[Tu]:"fire-core-compat",[wu]:"fire-analytics",[Su]:"fire-analytics-compat",[Eu]:"fire-app-check",[Iu]:"fire-app-check-compat",[ku]:"fire-auth",[Pu]:"fire-auth-compat",[Ru]:"fire-rtdb",[Mu]:"fire-data-connect",[Ou]:"fire-rtdb-compat",[Du]:"fire-fn",[Nu]:"fire-fn-compat",[xu]:"fire-iid",[Cu]:"fire-iid-compat",[Lu]:"fire-fcm",[Vu]:"fire-fcm-compat",[Bu]:"fire-perf",[Fu]:"fire-perf-compat",[Uu]:"fire-rc",[Gu]:"fire-rc-compat",[Yu]:"fire-gcs",[$u]:"fire-gcs-compat",[ju]:"fire-fst",[Wu]:"fire-fst-compat",[Ku]:"fire-vertex","fire-js":"fire-js",[Hu]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const es=new Map,Ju=new Map,ur=new Map;function ki(t,e){try{t.container.addComponent(e)}catch(n){Qe.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function qt(t){const e=t.name;if(ur.has(e))return Qe.debug(`There were multiple attempts to register component ${e}.`),!1;ur.set(e,t);for(const n of es.values())ki(n,t);for(const n of Ju.values())ki(n,t);return!0}function Vr(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function dt(t){return t.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qu={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},pt=new Dn("app","Firebase",Qu);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xu{constructor(e,n,s){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new Rt("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw pt.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nn=zu;function ma(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const s=Object.assign({name:cr,automaticDataCollectionEnabled:!1},e),r=s.name;if(typeof r!="string"||!r)throw pt.create("bad-app-name",{appName:String(r)});if(n||(n=da()),!n)throw pt.create("no-options");const i=es.get(r);if(i){if(Zn(n,i.options)&&Zn(s,i.config))return i;throw pt.create("duplicate-app",{appName:r})}const o=new ru(r);for(const a of ur.values())o.addComponent(a);const l=new Xu(n,s,o);return es.set(r,l),l}function ga(t=cr){const e=es.get(t);if(!e&&t===cr&&da())return ma();if(!e)throw pt.create("no-app",{appName:t});return e}function mt(t,e,n){var s;let r=(s=qu[t])!==null&&s!==void 0?s:t;n&&(r+=`-${n}`);const i=r.match(/\s|\//),o=e.match(/\s|\//);if(i||o){const l=[`Unable to register library "${r}" with version "${e}":`];i&&l.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&o&&l.push("and"),o&&l.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Qe.warn(l.join(" "));return}qt(new Rt(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
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
 */const Zu="firebase-heartbeat-database",ed=1,Sn="firebase-heartbeat-store";let Hs=null;function ya(){return Hs||(Hs=yu(Zu,ed,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(Sn)}catch{}}}}).catch(t=>{throw pt.create("idb-open",{originalErrorMessage:t.message})})),Hs}async function td(t){try{const n=(await ya()).transaction(Sn),s=await n.objectStore(Sn).get(Aa(t));return await n.done,s}catch(e){if(e instanceof tt)Qe.warn(e.message);else{const n=pt.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Qe.warn(n.message)}}}async function Pi(t,e){try{const s=(await ya()).transaction(Sn,"readwrite");await s.objectStore(Sn).put(e,Aa(t)),await s.done}catch(n){if(n instanceof tt)Qe.warn(n.message);else{const s=pt.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});Qe.warn(s.message)}}}function Aa(t){return`${t.name}!${t.options.appId}`}/**
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
 */const nd=1024,sd=30*24*60*60*1e3;class rd{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new od(n),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){var e,n;try{const r=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=Ri();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)===null||n===void 0?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(o=>o.date===i)?void 0:(this._heartbeatsCache.heartbeats.push({date:i,agent:r}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(o=>{const l=new Date(o.date).valueOf();return Date.now()-l<=sd}),this._storage.overwrite(this._heartbeatsCache))}catch(s){Qe.warn(s)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=Ri(),{heartbeatsToSend:s,unsentEntries:r}=id(this._heartbeatsCache.heartbeats),i=Xn(JSON.stringify({version:2,heartbeats:s}));return this._heartbeatsCache.lastSentHeartbeatDate=n,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(n){return Qe.warn(n),""}}}function Ri(){return new Date().toISOString().substring(0,10)}function id(t,e=nd){const n=[];let s=t.slice();for(const r of t){const i=n.find(o=>o.agent===r.agent);if(i){if(i.dates.push(r.date),Mi(n)>e){i.dates.pop();break}}else if(n.push({agent:r.agent,dates:[r.date]}),Mi(n)>e){n.pop();break}s=s.slice(1)}return{heartbeatsToSend:n,unsentEntries:s}}class od{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Wc()?Hc().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await td(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var n;if(await this._canUseIndexedDBPromise){const r=await this.read();return Pi(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var n;if(await this._canUseIndexedDBPromise){const r=await this.read();return Pi(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function Mi(t){return Xn(JSON.stringify({version:2,heartbeats:t})).length}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ad(t){qt(new Rt("platform-logger",e=>new _u(e),"PRIVATE")),qt(new Rt("heartbeat",e=>new rd(e),"PRIVATE")),mt(lr,Ei,t),mt(lr,Ei,"esm2017"),mt("fire-js","")}ad("");var ld="firebase",cd="10.14.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */mt(ld,cd,"app");function Br(t,e){var n={};for(var s in t)Object.prototype.hasOwnProperty.call(t,s)&&e.indexOf(s)<0&&(n[s]=t[s]);if(t!=null&&typeof Object.getOwnPropertySymbols=="function")for(var r=0,s=Object.getOwnPropertySymbols(t);r<s.length;r++)e.indexOf(s[r])<0&&Object.prototype.propertyIsEnumerable.call(t,s[r])&&(n[s[r]]=t[s[r]]);return n}function va(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const ud=va,_a=new Dn("auth","Firebase",va());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ts=new Cr("@firebase/auth");function dd(t,...e){ts.logLevel<=J.WARN&&ts.warn(`Auth (${nn}): ${t}`,...e)}function Hn(t,...e){ts.logLevel<=J.ERROR&&ts.error(`Auth (${nn}): ${t}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xe(t,...e){throw Fr(t,...e)}function Ye(t,...e){return Fr(t,...e)}function ba(t,e,n){const s=Object.assign(Object.assign({},ud()),{[e]:n});return new Dn("auth","Firebase",s).create(e,{appName:t.name})}function kt(t){return ba(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Fr(t,...e){if(typeof t!="string"){const n=e[0],s=[...e.slice(1)];return s[0]&&(s[0].appName=t.name),t._errorFactory.create(n,...s)}return _a.create(t,...e)}function V(t,e,...n){if(!t)throw Fr(e,...n)}function We(t){const e="INTERNAL ASSERTION FAILED: "+t;throw Hn(e),new Error(e)}function Ze(t,e){t||We(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dr(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.href)||""}function hd(){return Oi()==="http:"||Oi()==="https:"}function Oi(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fd(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(hd()||$c()||"connection"in navigator)?navigator.onLine:!0}function pd(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xn{constructor(e,n){this.shortDelay=e,this.longDelay=n,Ze(n>e,"Short delay should be less than long delay!"),this.isMobile=Gc()||jc()}get(){return fd()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ur(t,e){Ze(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ta{static initialize(e,n,s){this.fetchImpl=e,n&&(this.headersImpl=n),s&&(this.responseImpl=s)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;We("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;We("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;We("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const md={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gd=new xn(3e4,6e4);function Gr(t,e){return t.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:t.tenantId}):e}async function sn(t,e,n,s,r={}){return Sa(t,r,async()=>{let i={},o={};s&&(e==="GET"?o=s:i={body:JSON.stringify(s)});const l=Nn(Object.assign({key:t.config.apiKey},o)).slice(1),a=await t._getAdditionalHeaders();a["Content-Type"]="application/json",t.languageCode&&(a["X-Firebase-Locale"]=t.languageCode);const c=Object.assign({method:e,headers:a},i);return Yc()||(c.referrerPolicy="no-referrer"),Ta.fetch()(wa(t,t.config.apiHost,n,l),c)})}async function Sa(t,e,n){t._canInitEmulator=!1;const s=Object.assign(Object.assign({},md),e);try{const r=new Ad(t),i=await Promise.race([n(),r.promise]);r.clearNetworkTimeout();const o=await i.json();if("needConfirmation"in o)throw Un(t,"account-exists-with-different-credential",o);if(i.ok&&!("errorMessage"in o))return o;{const l=i.ok?o.errorMessage:o.error.message,[a,c]=l.split(" : ");if(a==="FEDERATED_USER_ID_ALREADY_LINKED")throw Un(t,"credential-already-in-use",o);if(a==="EMAIL_EXISTS")throw Un(t,"email-already-in-use",o);if(a==="USER_DISABLED")throw Un(t,"user-disabled",o);const u=s[a]||a.toLowerCase().replace(/[_\s]+/g,"-");if(c)throw ba(t,u,c);Xe(t,u)}}catch(r){if(r instanceof tt)throw r;Xe(t,"network-request-failed",{message:String(r)})}}async function yd(t,e,n,s,r={}){const i=await sn(t,e,n,s,r);return"mfaPendingCredential"in i&&Xe(t,"multi-factor-auth-required",{_serverResponse:i}),i}function wa(t,e,n,s){const r=`${e}${n}?${s}`;return t.config.emulator?Ur(t.config,r):`${t.config.apiScheme}://${r}`}class Ad{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,s)=>{this.timer=setTimeout(()=>s(Ye(this.auth,"network-request-failed")),gd.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function Un(t,e,n){const s={appName:t.name};n.email&&(s.email=n.email),n.phoneNumber&&(s.phoneNumber=n.phoneNumber);const r=Ye(t,e,s);return r.customData._tokenResponse=n,r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function vd(t,e){return sn(t,"POST","/v1/accounts:delete",e)}async function Ia(t,e){return sn(t,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mn(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function _d(t,e=!1){const n=Ae(t),s=await n.getIdToken(e),r=Yr(s);V(r&&r.exp&&r.auth_time&&r.iat,n.auth,"internal-error");const i=typeof r.firebase=="object"?r.firebase:void 0,o=i==null?void 0:i.sign_in_provider;return{claims:r,token:s,authTime:mn(zs(r.auth_time)),issuedAtTime:mn(zs(r.iat)),expirationTime:mn(zs(r.exp)),signInProvider:o||null,signInSecondFactor:(i==null?void 0:i.sign_in_second_factor)||null}}function zs(t){return Number(t)*1e3}function Yr(t){const[e,n,s]=t.split(".");if(e===void 0||n===void 0||s===void 0)return Hn("JWT malformed, contained fewer than 3 sections"),null;try{const r=ca(n);return r?JSON.parse(r):(Hn("Failed to decode base64 JWT payload"),null)}catch(r){return Hn("Caught error parsing JWT payload as JSON",r==null?void 0:r.toString()),null}}function Di(t){const e=Yr(t);return V(e,"internal-error"),V(typeof e.exp<"u","internal-error"),V(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function wn(t,e,n=!1){if(n)return e;try{return await e}catch(s){throw s instanceof tt&&bd(s)&&t.auth.currentUser===t&&await t.auth.signOut(),s}}function bd({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Td{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var n;if(e){const s=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),s}else{this.errorBackoff=3e4;const r=((n=this.user.stsTokenManager.expirationTime)!==null&&n!==void 0?n:0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hr{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=mn(this.lastLoginAt),this.creationTime=mn(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ns(t){var e;const n=t.auth,s=await t.getIdToken(),r=await wn(t,Ia(n,{idToken:s}));V(r==null?void 0:r.users.length,n,"internal-error");const i=r.users[0];t._notifyReloadListener(i);const o=!((e=i.providerUserInfo)===null||e===void 0)&&e.length?Ea(i.providerUserInfo):[],l=wd(t.providerData,o),a=t.isAnonymous,c=!(t.email&&i.passwordHash)&&!(l!=null&&l.length),u=a?c:!1,d={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:l,metadata:new hr(i.createdAt,i.lastLoginAt),isAnonymous:u};Object.assign(t,d)}async function Sd(t){const e=Ae(t);await ns(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function wd(t,e){return[...t.filter(s=>!e.some(r=>r.providerId===s.providerId)),...e]}function Ea(t){return t.map(e=>{var{providerId:n}=e,s=Br(e,["providerId"]);return{providerId:n,uid:s.rawId||"",displayName:s.displayName||null,email:s.email||null,phoneNumber:s.phoneNumber||null,photoURL:s.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Id(t,e){const n=await Sa(t,{},async()=>{const s=Nn({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:r,apiKey:i}=t.config,o=wa(t,r,"/v1/token",`key=${i}`),l=await t._getAdditionalHeaders();return l["Content-Type"]="application/x-www-form-urlencoded",Ta.fetch()(o,{method:"POST",headers:l,body:s})});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function Ed(t,e){return sn(t,"POST","/v2/accounts:revokeToken",Gr(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kt{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){V(e.idToken,"internal-error"),V(typeof e.idToken<"u","internal-error"),V(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Di(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){V(e.length!==0,"internal-error");const n=Di(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(V(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:s,refreshToken:r,expiresIn:i}=await Id(e,n);this.updateTokensAndExpiration(s,r,Number(i))}updateTokensAndExpiration(e,n,s){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+s*1e3}static fromJSON(e,n){const{refreshToken:s,accessToken:r,expirationTime:i}=n,o=new Kt;return s&&(V(typeof s=="string","internal-error",{appName:e}),o.refreshToken=s),r&&(V(typeof r=="string","internal-error",{appName:e}),o.accessToken=r),i&&(V(typeof i=="number","internal-error",{appName:e}),o.expirationTime=i),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Kt,this.toJSON())}_performRefresh(){return We("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function st(t,e){V(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class He{constructor(e){var{uid:n,auth:s,stsTokenManager:r}=e,i=Br(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new Td(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=n,this.auth=s,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new hr(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const n=await wn(this,this.stsTokenManager.getToken(this.auth,e));return V(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return _d(this,e)}reload(){return Sd(this)}_assign(e){this!==e&&(V(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>Object.assign({},n)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new He(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return n.metadata._copy(this.metadata),n}_onReload(e){V(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let s=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),s=!0),n&&await ns(this),await this.auth._persistUserIfCurrent(this),s&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(dt(this.auth.app))return Promise.reject(kt(this.auth));const e=await this.getIdToken();return await wn(this,vd(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){var s,r,i,o,l,a,c,u;const d=(s=n.displayName)!==null&&s!==void 0?s:void 0,f=(r=n.email)!==null&&r!==void 0?r:void 0,m=(i=n.phoneNumber)!==null&&i!==void 0?i:void 0,g=(o=n.photoURL)!==null&&o!==void 0?o:void 0,h=(l=n.tenantId)!==null&&l!==void 0?l:void 0,_=(a=n._redirectEventId)!==null&&a!==void 0?a:void 0,E=(c=n.createdAt)!==null&&c!==void 0?c:void 0,w=(u=n.lastLoginAt)!==null&&u!==void 0?u:void 0,{uid:y,emailVerified:p,isAnonymous:A,providerData:v,stsTokenManager:b}=n;V(y&&b,e,"internal-error");const S=Kt.fromJSON(this.name,b);V(typeof y=="string",e,"internal-error"),st(d,e.name),st(f,e.name),V(typeof p=="boolean",e,"internal-error"),V(typeof A=="boolean",e,"internal-error"),st(m,e.name),st(g,e.name),st(h,e.name),st(_,e.name),st(E,e.name),st(w,e.name);const T=new He({uid:y,auth:e,email:f,emailVerified:p,displayName:d,isAnonymous:A,photoURL:g,phoneNumber:m,tenantId:h,stsTokenManager:S,createdAt:E,lastLoginAt:w});return v&&Array.isArray(v)&&(T.providerData=v.map(R=>Object.assign({},R))),_&&(T._redirectEventId=_),T}static async _fromIdTokenResponse(e,n,s=!1){const r=new Kt;r.updateFromServerResponse(n);const i=new He({uid:n.localId,auth:e,stsTokenManager:r,isAnonymous:s});return await ns(i),i}static async _fromGetAccountInfoResponse(e,n,s){const r=n.users[0];V(r.localId!==void 0,"internal-error");const i=r.providerUserInfo!==void 0?Ea(r.providerUserInfo):[],o=!(r.email&&r.passwordHash)&&!(i!=null&&i.length),l=new Kt;l.updateFromIdToken(s);const a=new He({uid:r.localId,auth:e,stsTokenManager:l,isAnonymous:o}),c={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:i,metadata:new hr(r.createdAt,r.lastLoginAt),isAnonymous:!(r.email&&r.passwordHash)&&!(i!=null&&i.length)};return Object.assign(a,c),a}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ni=new Map;function ze(t){Ze(t instanceof Function,"Expected a class definition");let e=Ni.get(t);return e?(Ze(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,Ni.set(t,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ka{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}ka.type="NONE";const xi=ka;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zn(t,e,n){return`firebase:${t}:${e}:${n}`}class Wt{constructor(e,n,s){this.persistence=e,this.auth=n,this.userKey=s;const{config:r,name:i}=this.auth;this.fullUserKey=zn(this.userKey,r.apiKey,i),this.fullPersistenceKey=zn("persistence",r.apiKey,i),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?He._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,s="authUser"){if(!n.length)return new Wt(ze(xi),e,s);const r=(await Promise.all(n.map(async c=>{if(await c._isAvailable())return c}))).filter(c=>c);let i=r[0]||ze(xi);const o=zn(s,e.config.apiKey,e.name);let l=null;for(const c of n)try{const u=await c._get(o);if(u){const d=He._fromJSON(e,u);c!==i&&(l=d),i=c;break}}catch{}const a=r.filter(c=>c._shouldAllowMigration);return!i._shouldAllowMigration||!a.length?new Wt(i,e,s):(i=a[0],l&&await i._set(o,l.toJSON()),await Promise.all(n.map(async c=>{if(c!==i)try{await c._remove(o)}catch{}})),new Wt(i,e,s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ci(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Oa(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Pa(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Na(e))return"Blackberry";if(xa(e))return"Webos";if(Ra(e))return"Safari";if((e.includes("chrome/")||Ma(e))&&!e.includes("edge/"))return"Chrome";if(Da(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,s=t.match(n);if((s==null?void 0:s.length)===2)return s[1]}return"Other"}function Pa(t=Ie()){return/firefox\//i.test(t)}function Ra(t=Ie()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Ma(t=Ie()){return/crios\//i.test(t)}function Oa(t=Ie()){return/iemobile/i.test(t)}function Da(t=Ie()){return/android/i.test(t)}function Na(t=Ie()){return/blackberry/i.test(t)}function xa(t=Ie()){return/webos/i.test(t)}function $r(t=Ie()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function kd(t=Ie()){var e;return $r(t)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function Pd(){return Kc()&&document.documentMode===10}function Ca(t=Ie()){return $r(t)||Da(t)||xa(t)||Na(t)||/windows phone/i.test(t)||Oa(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function La(t,e=[]){let n;switch(t){case"Browser":n=Ci(Ie());break;case"Worker":n=`${Ci(Ie())}-${t}`;break;default:n=t}const s=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${nn}/${s}`}/**
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
 */class Rd{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const s=i=>new Promise((o,l)=>{try{const a=e(i);o(a)}catch(a){l(a)}});s.onAbort=n,this.queue.push(s);const r=this.queue.length-1;return()=>{this.queue[r]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const s of this.queue)await s(e),s.onAbort&&n.push(s.onAbort)}catch(s){n.reverse();for(const r of n)try{r()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:s==null?void 0:s.message})}}}/**
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
 */async function Md(t,e={}){return sn(t,"GET","/v2/passwordPolicy",Gr(t,e))}/**
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
 */const Od=6;class Dd{constructor(e){var n,s,r,i;const o=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(n=o.minPasswordLength)!==null&&n!==void 0?n:Od,o.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=o.maxPasswordLength),o.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=o.containsLowercaseCharacter),o.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=o.containsUppercaseCharacter),o.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=o.containsNumericCharacter),o.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=o.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(r=(s=e.allowedNonAlphanumericCharacters)===null||s===void 0?void 0:s.join(""))!==null&&r!==void 0?r:"",this.forceUpgradeOnSignin=(i=e.forceUpgradeOnSignin)!==null&&i!==void 0?i:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var n,s,r,i,o,l;const a={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,a),this.validatePasswordCharacterOptions(e,a),a.isValid&&(a.isValid=(n=a.meetsMinPasswordLength)!==null&&n!==void 0?n:!0),a.isValid&&(a.isValid=(s=a.meetsMaxPasswordLength)!==null&&s!==void 0?s:!0),a.isValid&&(a.isValid=(r=a.containsLowercaseLetter)!==null&&r!==void 0?r:!0),a.isValid&&(a.isValid=(i=a.containsUppercaseLetter)!==null&&i!==void 0?i:!0),a.isValid&&(a.isValid=(o=a.containsNumericCharacter)!==null&&o!==void 0?o:!0),a.isValid&&(a.isValid=(l=a.containsNonAlphanumericCharacter)!==null&&l!==void 0?l:!0),a}validatePasswordLengthOptions(e,n){const s=this.customStrengthOptions.minPasswordLength,r=this.customStrengthOptions.maxPasswordLength;s&&(n.meetsMinPasswordLength=e.length>=s),r&&(n.meetsMaxPasswordLength=e.length<=r)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let s;for(let r=0;r<e.length;r++)s=e.charAt(r),this.updatePasswordCharacterOptionsStatuses(n,s>="a"&&s<="z",s>="A"&&s<="Z",s>="0"&&s<="9",this.allowedNonAlphanumericCharacters.includes(s))}updatePasswordCharacterOptionsStatuses(e,n,s,r,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=s)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=r)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nd{constructor(e,n,s,r){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=s,this.config=r,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Li(this),this.idTokenSubscription=new Li(this),this.beforeStateQueue=new Rd(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=_a,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=r.sdkClientVersion}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=ze(n)),this._initializationPromise=this.queue(async()=>{var s,r;if(!this._deleted&&(this.persistenceManager=await Wt.create(this,e),!this._deleted)){if(!((s=this._popupRedirectResolver)===null||s===void 0)&&s._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((r=this.currentUser)===null||r===void 0?void 0:r.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await Ia(this,{idToken:e}),s=await He._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(s)}catch{await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var n;if(dt(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(l=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(l,l))}):this.directlySetCurrentUser(null)}const s=await this.assertedPersistence.getCurrentUser();let r=s,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(n=this.redirectUser)===null||n===void 0?void 0:n._redirectEventId,l=r==null?void 0:r._redirectEventId,a=await this.tryRedirectSignIn(e);(!o||o===l)&&(a!=null&&a.user)&&(r=a.user,i=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(r)}catch(o){r=s,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return V(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await ns(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=pd()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(dt(this.app))return Promise.reject(kt(this));const n=e?Ae(e):null;return n&&V(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&V(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return dt(this.app)?Promise.reject(kt(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return dt(this.app)?Promise.reject(kt(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(ze(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await Md(this),n=new Dd(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new Dn("auth","Firebase",e())}onAuthStateChanged(e,n,s){return this.registerStateListener(this.authStateSubscription,e,n,s)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,s){return this.registerStateListener(this.idTokenSubscription,e,n,s)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const s=this.onAuthStateChanged(()=>{s(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),s={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(s.tenantId=this.tenantId),await Ed(this,s)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,n){const s=await this.getOrInitRedirectPersistenceManager(n);return e===null?s.removeCurrentUser():s.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&ze(e)||this._popupRedirectResolver;V(n,this,"argument-error"),this.redirectPersistenceManager=await Wt.create(this,[ze(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,s;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)===null||n===void 0?void 0:n._redirectEventId)===e?this._currentUser:((s=this.redirectUser)===null||s===void 0?void 0:s._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const s=(n=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&n!==void 0?n:null;this.lastNotifiedUid!==s&&(this.lastNotifiedUid=s,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,s,r){if(this._deleted)return()=>{};const i=typeof n=="function"?n:n.next.bind(n);let o=!1;const l=this._isInitialized?Promise.resolve():this._initializationPromise;if(V(l,this,"internal-error"),l.then(()=>{o||i(this.currentUser)}),typeof n=="function"){const a=e.addObserver(n,s,r);return()=>{o=!0,a()}}else{const a=e.addObserver(n);return()=>{o=!0,a()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return V(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=La(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const n={"X-Client-Version":this.clientVersion};this.app.options.appId&&(n["X-Firebase-gmpid"]=this.app.options.appId);const s=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());s&&(n["X-Firebase-Client"]=s);const r=await this._getAppCheckToken();return r&&(n["X-Firebase-AppCheck"]=r),n}async _getAppCheckToken(){var e;const n=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return n!=null&&n.error&&dd(`Error while retrieving App Check token: ${n.error}`),n==null?void 0:n.token}}function jr(t){return Ae(t)}class Li{constructor(e){this.auth=e,this.observer=null,this.addObserver=Xc(n=>this.observer=n)}get next(){return V(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Kr={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function xd(t){Kr=t}function Cd(t){return Kr.loadJS(t)}function Ld(){return Kr.gapiScript}function Vd(t){return`__${t}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bd(t,e){const n=Vr(t,"auth");if(n.isInitialized()){const r=n.getImmediate(),i=n.getOptions();if(Zn(i,e??{}))return r;Xe(r,"already-initialized")}return n.initialize({options:e})}function Fd(t,e){const n=(e==null?void 0:e.persistence)||[],s=(Array.isArray(n)?n:[n]).map(ze);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(s,e==null?void 0:e.popupRedirectResolver)}function Ud(t,e,n){const s=jr(t);V(s._canInitEmulator,s,"emulator-config-failed"),V(/^https?:\/\//.test(e),s,"invalid-emulator-scheme");const r=!1,i=Va(e),{host:o,port:l}=Gd(e),a=l===null?"":`:${l}`;s.config.emulator={url:`${i}//${o}${a}/`},s.settings.appVerificationDisabledForTesting=!0,s.emulatorConfig=Object.freeze({host:o,port:l,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:r})}),Yd()}function Va(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function Gd(t){const e=Va(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const s=n[2].split("@").pop()||"",r=/^(\[[^\]]+\])(:|$)/.exec(s);if(r){const i=r[1];return{host:i,port:Vi(s.substr(i.length+1))}}else{const[i,o]=s.split(":");return{host:i,port:Vi(o)}}}function Vi(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function Yd(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ba{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return We("not implemented")}_getIdTokenResponse(e){return We("not implemented")}_linkToIdToken(e,n){return We("not implemented")}_getReauthenticationResolver(e){return We("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ht(t,e){return yd(t,"POST","/v1/accounts:signInWithIdp",Gr(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $d="http://localhost";class Mt extends Ba{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new Mt(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):Xe("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:s,signInMethod:r}=n,i=Br(n,["providerId","signInMethod"]);if(!s||!r)return null;const o=new Mt(s,r);return o.idToken=i.idToken||void 0,o.accessToken=i.accessToken||void 0,o.secret=i.secret,o.nonce=i.nonce,o.pendingToken=i.pendingToken||null,o}_getIdTokenResponse(e){const n=this.buildRequest();return Ht(e,n)}_linkToIdToken(e,n){const s=this.buildRequest();return s.idToken=n,Ht(e,s)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,Ht(e,n)}buildRequest(){const e={requestUri:$d,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=Nn(n)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fa{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cn extends Fa{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class at extends Cn{constructor(){super("facebook.com")}static credential(e){return Mt._fromParams({providerId:at.PROVIDER_ID,signInMethod:at.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return at.credentialFromTaggedObject(e)}static credentialFromError(e){return at.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return at.credential(e.oauthAccessToken)}catch{return null}}}at.FACEBOOK_SIGN_IN_METHOD="facebook.com";at.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lt extends Cn{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return Mt._fromParams({providerId:lt.PROVIDER_ID,signInMethod:lt.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return lt.credentialFromTaggedObject(e)}static credentialFromError(e){return lt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:s}=e;if(!n&&!s)return null;try{return lt.credential(n,s)}catch{return null}}}lt.GOOGLE_SIGN_IN_METHOD="google.com";lt.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ct extends Cn{constructor(){super("github.com")}static credential(e){return Mt._fromParams({providerId:ct.PROVIDER_ID,signInMethod:ct.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return ct.credentialFromTaggedObject(e)}static credentialFromError(e){return ct.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return ct.credential(e.oauthAccessToken)}catch{return null}}}ct.GITHUB_SIGN_IN_METHOD="github.com";ct.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ut extends Cn{constructor(){super("twitter.com")}static credential(e,n){return Mt._fromParams({providerId:ut.PROVIDER_ID,signInMethod:ut.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return ut.credentialFromTaggedObject(e)}static credentialFromError(e){return ut.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:s}=e;if(!n||!s)return null;try{return ut.credential(n,s)}catch{return null}}}ut.TWITTER_SIGN_IN_METHOD="twitter.com";ut.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jt{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,s,r=!1){const i=await He._fromIdTokenResponse(e,s,r),o=Bi(s);return new Jt({user:i,providerId:o,_tokenResponse:s,operationType:n})}static async _forOperation(e,n,s){await e._updateTokensIfNecessary(s,!0);const r=Bi(s);return new Jt({user:e,providerId:r,_tokenResponse:s,operationType:n})}}function Bi(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ss extends tt{constructor(e,n,s,r){var i;super(n.code,n.message),this.operationType=s,this.user=r,Object.setPrototypeOf(this,ss.prototype),this.customData={appName:e.name,tenantId:(i=e.tenantId)!==null&&i!==void 0?i:void 0,_serverResponse:n.customData._serverResponse,operationType:s}}static _fromErrorAndOperation(e,n,s,r){return new ss(e,n,s,r)}}function Ua(t,e,n,s){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(i=>{throw i.code==="auth/multi-factor-auth-required"?ss._fromErrorAndOperation(t,i,e,s):i})}async function jd(t,e,n=!1){const s=await wn(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return Jt._forOperation(t,"link",s)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Kd(t,e,n=!1){const{auth:s}=t;if(dt(s.app))return Promise.reject(kt(s));const r="reauthenticate";try{const i=await wn(t,Ua(s,r,e,t),n);V(i.idToken,s,"internal-error");const o=Yr(i.idToken);V(o,s,"internal-error");const{sub:l}=o;return V(t.uid===l,s,"user-mismatch"),Jt._forOperation(t,r,i)}catch(i){throw(i==null?void 0:i.code)==="auth/user-not-found"&&Xe(s,"user-mismatch"),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Wd(t,e,n=!1){if(dt(t.app))return Promise.reject(kt(t));const s="signIn",r=await Ua(t,s,e),i=await Jt._fromIdTokenResponse(t,s,r);return n||await t._updateCurrentUser(i.user),i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hd(t,e){return Ae(t).setPersistence(e)}function zd(t,e,n,s){return Ae(t).onIdTokenChanged(e,n,s)}function qd(t,e,n){return Ae(t).beforeAuthStateChanged(e,n)}function Jd(t,e,n,s){return Ae(t).onAuthStateChanged(e,n,s)}function Qd(t){return Ae(t).signOut()}const rs="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ga{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(rs,"1"),this.storage.removeItem(rs),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xd=1e3,Zd=10;class Ya extends Ga{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Ca(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const s=this.storage.getItem(n),r=this.localCache[n];s!==r&&e(n,r,s)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((o,l,a)=>{this.notifyListeners(o,a)});return}const s=e.key;n?this.detachListener():this.stopPolling();const r=()=>{const o=this.storage.getItem(s);!n&&this.localCache[s]===o||this.notifyListeners(s,o)},i=this.storage.getItem(s);Pd()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(r,Zd):r()}notifyListeners(e,n){this.localCache[e]=n;const s=this.listeners[e];if(s)for(const r of Array.from(s))r(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,s)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:s}),!0)})},Xd)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}Ya.type="LOCAL";const $a=Ya;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ja extends Ga{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}ja.type="SESSION";const Ka=ja;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function eh(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ss{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(r=>r.isListeningto(e));if(n)return n;const s=new Ss(e);return this.receivers.push(s),s}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:s,eventType:r,data:i}=n.data,o=this.handlersMap[r];if(!(o!=null&&o.size))return;n.ports[0].postMessage({status:"ack",eventId:s,eventType:r});const l=Array.from(o).map(async c=>c(n.origin,i)),a=await eh(l);n.ports[0].postMessage({status:"done",eventId:s,eventType:r,response:a})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Ss.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wr(t="",e=10){let n="";for(let s=0;s<e;s++)n+=Math.floor(Math.random()*10);return t+n}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class th{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,s=50){const r=typeof MessageChannel<"u"?new MessageChannel:null;if(!r)throw new Error("connection_unavailable");let i,o;return new Promise((l,a)=>{const c=Wr("",20);r.port1.start();const u=setTimeout(()=>{a(new Error("unsupported_event"))},s);o={messageChannel:r,onMessage(d){const f=d;if(f.data.eventId===c)switch(f.data.status){case"ack":clearTimeout(u),i=setTimeout(()=>{a(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),l(f.data.response);break;default:clearTimeout(u),clearTimeout(i),a(new Error("invalid_response"));break}}},this.handlers.add(o),r.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:c,data:n},[r.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $e(){return window}function nh(t){$e().location.href=t}/**
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
 */function Wa(){return typeof $e().WorkerGlobalScope<"u"&&typeof $e().importScripts=="function"}async function sh(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function rh(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)===null||t===void 0?void 0:t.controller)||null}function ih(){return Wa()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ha="firebaseLocalStorageDb",oh=1,is="firebaseLocalStorage",za="fbase_key";class Ln{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function ws(t,e){return t.transaction([is],e?"readwrite":"readonly").objectStore(is)}function ah(){const t=indexedDB.deleteDatabase(Ha);return new Ln(t).toPromise()}function fr(){const t=indexedDB.open(Ha,oh);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const s=t.result;try{s.createObjectStore(is,{keyPath:za})}catch(r){n(r)}}),t.addEventListener("success",async()=>{const s=t.result;s.objectStoreNames.contains(is)?e(s):(s.close(),await ah(),e(await fr()))})})}async function Fi(t,e,n){const s=ws(t,!0).put({[za]:e,value:n});return new Ln(s).toPromise()}async function lh(t,e){const n=ws(t,!1).get(e),s=await new Ln(n).toPromise();return s===void 0?null:s.value}function Ui(t,e){const n=ws(t,!0).delete(e);return new Ln(n).toPromise()}const ch=800,uh=3;class qa{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await fr(),this.db)}async _withRetries(e){let n=0;for(;;)try{const s=await this._openDb();return await e(s)}catch(s){if(n++>uh)throw s;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return Wa()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Ss._getInstance(ih()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var e,n;if(this.activeServiceWorker=await sh(),!this.activeServiceWorker)return;this.sender=new th(this.activeServiceWorker);const s=await this.sender._send("ping",{},800);s&&!((e=s[0])===null||e===void 0)&&e.fulfilled&&!((n=s[0])===null||n===void 0)&&n.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||rh()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await fr();return await Fi(e,rs,"1"),await Ui(e,rs),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(s=>Fi(s,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(s=>lh(s,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>Ui(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(r=>{const i=ws(r,!1).getAll();return new Ln(i).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],s=new Set;if(e.length!==0)for(const{fbase_key:r,value:i}of e)s.add(r),JSON.stringify(this.localCache[r])!==JSON.stringify(i)&&(this.notifyListeners(r,i),n.push(r));for(const r of Object.keys(this.localCache))this.localCache[r]&&!s.has(r)&&(this.notifyListeners(r,null),n.push(r));return n}notifyListeners(e,n){this.localCache[e]=n;const s=this.listeners[e];if(s)for(const r of Array.from(s))r(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),ch)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}qa.type="LOCAL";const dh=qa;new xn(3e4,6e4);/**
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
 */function hh(t,e){return e?ze(e):(V(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hr extends Ba{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Ht(e,this._buildIdpRequest())}_linkToIdToken(e,n){return Ht(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return Ht(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function fh(t){return Wd(t.auth,new Hr(t),t.bypassAuthState)}function ph(t){const{auth:e,user:n}=t;return V(n,e,"internal-error"),Kd(n,new Hr(t),t.bypassAuthState)}async function mh(t){const{auth:e,user:n}=t;return V(n,e,"internal-error"),jd(n,new Hr(t),t.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ja{constructor(e,n,s,r,i=!1){this.auth=e,this.resolver=s,this.user=r,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(s){this.reject(s)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:s,postBody:r,tenantId:i,error:o,type:l}=e;if(o){this.reject(o);return}const a={auth:this.auth,requestUri:n,sessionId:s,tenantId:i||void 0,postBody:r||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(l)(a))}catch(c){this.reject(c)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return fh;case"linkViaPopup":case"linkViaRedirect":return mh;case"reauthViaPopup":case"reauthViaRedirect":return ph;default:Xe(this.auth,"internal-error")}}resolve(e){Ze(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Ze(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gh=new xn(2e3,1e4);class Gt extends Ja{constructor(e,n,s,r,i){super(e,n,r,i),this.provider=s,this.authWindow=null,this.pollId=null,Gt.currentPopupAction&&Gt.currentPopupAction.cancel(),Gt.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return V(e,this.auth,"internal-error"),e}async onExecution(){Ze(this.filter.length===1,"Popup operations only handle one event");const e=Wr();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(Ye(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(Ye(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Gt.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,s;if(!((s=(n=this.authWindow)===null||n===void 0?void 0:n.window)===null||s===void 0)&&s.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Ye(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,gh.get())};e()}}Gt.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yh="pendingRedirect",qn=new Map;class Ah extends Ja{constructor(e,n,s=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,s),this.eventId=null}async execute(){let e=qn.get(this.auth._key());if(!e){try{const s=await vh(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(s)}catch(n){e=()=>Promise.reject(n)}qn.set(this.auth._key(),e)}return this.bypassAuthState||qn.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function vh(t,e){const n=Th(e),s=bh(t);if(!await s._isAvailable())return!1;const r=await s._get(n)==="true";return await s._remove(n),r}function _h(t,e){qn.set(t._key(),e)}function bh(t){return ze(t._redirectPersistence)}function Th(t){return zn(yh,t.config.apiKey,t.name)}async function Sh(t,e,n=!1){if(dt(t.app))return Promise.reject(kt(t));const s=jr(t),r=hh(s,e),o=await new Ah(s,r,n).execute();return o&&!n&&(delete o.user._redirectEventId,await s._persistUserIfCurrent(o.user),await s._setRedirectUser(null,e)),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wh=10*60*1e3;class Ih{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(s=>{this.isEventForConsumer(e,s)&&(n=!0,this.sendToConsumer(e,s),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Eh(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var s;if(e.error&&!Qa(e)){const r=((s=e.error.code)===null||s===void 0?void 0:s.split("auth/")[1])||"internal-error";n.onError(Ye(this.auth,r))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const s=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&s}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=wh&&this.cachedEventUids.clear(),this.cachedEventUids.has(Gi(e))}saveEventToCache(e){this.cachedEventUids.add(Gi(e)),this.lastProcessedEventTime=Date.now()}}function Gi(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function Qa({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Eh(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Qa(t);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function kh(t,e={}){return sn(t,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ph=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Rh=/^https?/;async function Mh(t){if(t.config.emulator)return;const{authorizedDomains:e}=await kh(t);for(const n of e)try{if(Oh(n))return}catch{}Xe(t,"unauthorized-domain")}function Oh(t){const e=dr(),{protocol:n,hostname:s}=new URL(e);if(t.startsWith("chrome-extension://")){const o=new URL(t);return o.hostname===""&&s===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&o.hostname===s}if(!Rh.test(n))return!1;if(Ph.test(t))return s===t;const r=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+r+"|"+r+")$","i").test(s)}/**
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
 */const Dh=new xn(3e4,6e4);function Yi(){const t=$e().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function Nh(t){return new Promise((e,n)=>{var s,r,i;function o(){Yi(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Yi(),n(Ye(t,"network-request-failed"))},timeout:Dh.get()})}if(!((r=(s=$e().gapi)===null||s===void 0?void 0:s.iframes)===null||r===void 0)&&r.Iframe)e(gapi.iframes.getContext());else if(!((i=$e().gapi)===null||i===void 0)&&i.load)o();else{const l=Vd("iframefcb");return $e()[l]=()=>{gapi.load?o():n(Ye(t,"network-request-failed"))},Cd(`${Ld()}?onload=${l}`).catch(a=>n(a))}}).catch(e=>{throw Jn=null,e})}let Jn=null;function xh(t){return Jn=Jn||Nh(t),Jn}/**
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
 */const Ch=new xn(5e3,15e3),Lh="__/auth/iframe",Vh="emulator/auth/iframe",Bh={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Fh=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Uh(t){const e=t.config;V(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?Ur(e,Vh):`https://${t.config.authDomain}/${Lh}`,s={apiKey:e.apiKey,appName:t.name,v:nn},r=Fh.get(t.config.apiHost);r&&(s.eid=r);const i=t._getFrameworks();return i.length&&(s.fw=i.join(",")),`${n}?${Nn(s).slice(1)}`}async function Gh(t){const e=await xh(t),n=$e().gapi;return V(n,t,"internal-error"),e.open({where:document.body,url:Uh(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Bh,dontclear:!0},s=>new Promise(async(r,i)=>{await s.restyle({setHideOnLeave:!1});const o=Ye(t,"network-request-failed"),l=$e().setTimeout(()=>{i(o)},Ch.get());function a(){$e().clearTimeout(l),r(s)}s.ping(a).then(a,()=>{i(o)})}))}/**
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
 */const Yh={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},$h=500,jh=600,Kh="_blank",Wh="http://localhost";class $i{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Hh(t,e,n,s=$h,r=jh){const i=Math.max((window.screen.availHeight-r)/2,0).toString(),o=Math.max((window.screen.availWidth-s)/2,0).toString();let l="";const a=Object.assign(Object.assign({},Yh),{width:s.toString(),height:r.toString(),top:i,left:o}),c=Ie().toLowerCase();n&&(l=Ma(c)?Kh:n),Pa(c)&&(e=e||Wh,a.scrollbars="yes");const u=Object.entries(a).reduce((f,[m,g])=>`${f}${m}=${g},`,"");if(kd(c)&&l!=="_self")return zh(e||"",l),new $i(null);const d=window.open(e||"",l,u);V(d,t,"popup-blocked");try{d.focus()}catch{}return new $i(d)}function zh(t,e){const n=document.createElement("a");n.href=t,n.target=e;const s=document.createEvent("MouseEvent");s.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(s)}/**
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
 */const qh="__/auth/handler",Jh="emulator/auth/handler",Qh=encodeURIComponent("fac");async function ji(t,e,n,s,r,i){V(t.config.authDomain,t,"auth-domain-config-required"),V(t.config.apiKey,t,"invalid-api-key");const o={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:s,v:nn,eventId:r};if(e instanceof Fa){e.setDefaultLanguage(t.languageCode),o.providerId=e.providerId||"",Qc(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[u,d]of Object.entries({}))o[u]=d}if(e instanceof Cn){const u=e.getScopes().filter(d=>d!=="");u.length>0&&(o.scopes=u.join(","))}t.tenantId&&(o.tid=t.tenantId);const l=o;for(const u of Object.keys(l))l[u]===void 0&&delete l[u];const a=await t._getAppCheckToken(),c=a?`#${Qh}=${encodeURIComponent(a)}`:"";return`${Xh(t)}?${Nn(l).slice(1)}${c}`}function Xh({config:t}){return t.emulator?Ur(t,Jh):`https://${t.authDomain}/${qh}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qs="webStorageSupport";class Zh{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Ka,this._completeRedirectFn=Sh,this._overrideRedirectResult=_h}async _openPopup(e,n,s,r){var i;Ze((i=this.eventManagers[e._key()])===null||i===void 0?void 0:i.manager,"_initialize() not called before _openPopup()");const o=await ji(e,n,s,dr(),r);return Hh(e,o,Wr())}async _openRedirect(e,n,s,r){await this._originValidation(e);const i=await ji(e,n,s,dr(),r);return nh(i),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:r,promise:i}=this.eventManagers[n];return r?Promise.resolve(r):(Ze(i,"If manager is not set, promise should be"),i)}const s=this.initAndGetManager(e);return this.eventManagers[n]={promise:s},s.catch(()=>{delete this.eventManagers[n]}),s}async initAndGetManager(e){const n=await Gh(e),s=new Ih(e);return n.register("authEvent",r=>(V(r==null?void 0:r.authEvent,e,"invalid-auth-event"),{status:s.onEvent(r.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:s},this.iframes[e._key()]=n,s}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(qs,{type:qs},r=>{var i;const o=(i=r==null?void 0:r[0])===null||i===void 0?void 0:i[qs];o!==void 0&&n(!!o),Xe(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=Mh(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return Ca()||Ra()||$r()}}const ef=Zh;var Ki="@firebase/auth",Wi="1.7.9";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tf{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(s=>{e((s==null?void 0:s.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){V(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nf(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function sf(t){qt(new Rt("auth",(e,{options:n})=>{const s=e.getProvider("app").getImmediate(),r=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:o,authDomain:l}=s.options;V(o&&!o.includes(":"),"invalid-api-key",{appName:s.name});const a={apiKey:o,authDomain:l,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:La(t)},c=new Nd(s,r,i,a);return Fd(c,n),c},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,s)=>{e.getProvider("auth-internal").initialize()})),qt(new Rt("auth-internal",e=>{const n=jr(e.getProvider("auth").getImmediate());return(s=>new tf(s))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),mt(Ki,Wi,nf(t)),mt(Ki,Wi,"esm2017")}/**
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
 */const rf=5*60,of=ha("authIdTokenMaxAge")||rf;let Hi=null;const af=t=>async e=>{const n=e&&await e.getIdTokenResult(),s=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(s&&s>of)return;const r=n==null?void 0:n.token;Hi!==r&&(Hi=r,await fetch(t,{method:r?"POST":"DELETE",headers:r?{Authorization:`Bearer ${r}`}:{}}))};function lf(t=ga()){const e=Vr(t,"auth");if(e.isInitialized())return e.getImmediate();const n=Bd(t,{popupRedirectResolver:ef,persistence:[dh,$a,Ka]}),s=ha("authTokenSyncURL");if(s&&typeof isSecureContext=="boolean"&&isSecureContext){const i=new URL(s,location.origin);if(location.origin===i.origin){const o=af(i.toString());qd(n,o,()=>o(n.currentUser)),zd(n,l=>o(l))}}const r=ua("auth");return r&&Ud(n,`http://${r}`),n}function cf(){var t,e;return(e=(t=document.getElementsByTagName("head"))===null||t===void 0?void 0:t[0])!==null&&e!==void 0?e:document}xd({loadJS(t){return new Promise((e,n)=>{const s=document.createElement("script");s.setAttribute("src",t),s.onload=e,s.onerror=r=>{const i=Ye("internal-error");i.customData=r,n(i)},s.type="text/javascript",s.charset="UTF-8",cf().appendChild(s)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});sf("Browser");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ke{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}ke.UNAUTHENTICATED=new ke(null),ke.GOOGLE_CREDENTIALS=new ke("google-credentials-uid"),ke.FIRST_PARTY=new ke("first-party-uid"),ke.MOCK_USER=new ke("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let rn="10.14.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qt=new Cr("@firebase/firestore");function os(t,...e){if(Qt.logLevel<=J.DEBUG){const n=e.map(qr);Qt.debug(`Firestore (${rn}): ${t}`,...n)}}function zr(t,...e){if(Qt.logLevel<=J.ERROR){const n=e.map(qr);Qt.error(`Firestore (${rn}): ${t}`,...n)}}function Xa(t,...e){if(Qt.logLevel<=J.WARN){const n=e.map(qr);Qt.warn(`Firestore (${rn}): ${t}`,...n)}}function qr(t){if(typeof t=="string")return t;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
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
 */function le(t="Unexpected state"){const e=`FIRESTORE (${rn}) INTERNAL ASSERTION FAILED: `+t;throw zr(e),new Error(e)}function At(t,e){t||le()}function Is(t,e){return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zi="ok",uf="cancelled",gn="unknown",j="invalid-argument",df="deadline-exceeded",hf="not-found",ff="permission-denied",pr="unauthenticated",pf="resource-exhausted",Xt="failed-precondition",mf="aborted",gf="out-of-range",Za="unimplemented",yf="internal",Af="unavailable";class F extends tt{constructor(e,n){super(e,n),this.code=e,this.message=n,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class el{constructor(e,n){this.user=n,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class vf{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,n){e.enqueueRetryable(()=>n(ke.UNAUTHENTICATED))}shutdown(){}}class _f{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,n){this.changeListener=n,e.enqueueRetryable(()=>n(this.token.user))}shutdown(){this.changeListener=null}}class bf{constructor(e){this.auth=null,e.onInit(n=>{this.auth=n})}getToken(){return this.auth?this.auth.getToken().then(e=>e?(At(typeof e.accessToken=="string"),new el(e.accessToken,new ke(this.auth.getUid()))):null):Promise.resolve(null)}invalidateToken(){}start(e,n){}shutdown(){}}class Tf{constructor(e,n,s){this.t=e,this.i=n,this.o=s,this.type="FirstParty",this.user=ke.FIRST_PARTY,this.u=new Map}l(){return this.o?this.o():null}get headers(){this.u.set("X-Goog-AuthUser",this.t);const e=this.l();return e&&this.u.set("Authorization",e),this.i&&this.u.set("X-Goog-Iam-Authorization-Token",this.i),this.u}}class Sf{constructor(e,n,s){this.t=e,this.i=n,this.o=s}getToken(){return Promise.resolve(new Tf(this.t,this.i,this.o))}start(e,n){e.enqueueRetryable(()=>n(ke.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class wf{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class If{constructor(e){this.h=e,this.appCheck=null,e.onInit(n=>{this.appCheck=n})}getToken(){return this.appCheck?this.appCheck.getToken().then(e=>e?(At(typeof e.token=="string"),new wf(e.token)):null):Promise.resolve(null)}invalidateToken(){}start(e,n){}shutdown(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ef{constructor(e,n,s,r,i,o,l,a,c){this.databaseId=e,this.appId=n,this.persistenceKey=s,this.host=r,this.ssl=i,this.forceLongPolling=o,this.autoDetectLongPolling=l,this.longPollingOptions=a,this.useFetchStreams=c}}class In{constructor(e,n){this.projectId=e,this.database=n||"(default)"}static empty(){return new In("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof In&&e.projectId===this.projectId&&e.database===this.database}}class En{constructor(e,n,s){n===void 0?n=0:n>e.length&&le(),s===void 0?s=e.length-n:s>e.length-n&&le(),this.segments=e,this.offset=n,this.len=s}get length(){return this.len}isEqual(e){return En.comparator(this,e)===0}child(e){const n=this.segments.slice(this.offset,this.limit());return e instanceof En?e.forEach(s=>{n.push(s)}):n.push(e),this.construct(n)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}forEach(e){for(let n=this.offset,s=this.limit();n<s;n++)e(this.segments[n])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,n){const s=Math.min(e.length,n.length);for(let r=0;r<s;r++){const i=e.get(r),o=n.get(r);if(i<o)return-1;if(i>o)return 1}return e.length<n.length?-1:e.length>n.length?1:0}}class ge extends En{construct(e,n,s){return new ge(e,n,s)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const n=[];for(const s of e){if(s.indexOf("//")>=0)throw new F(j,`Invalid segment (${s}). Paths must not contain // in them.`);n.push(...s.split("/").filter(r=>r.length>0))}return new ge(n)}static emptyPath(){return new ge([])}}const kf=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Re extends En{construct(e,n,s){return new Re(e,n,s)}static isValidIdentifier(e){return kf.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Re.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new Re(["__name__"])}static fromServerFormat(e){const n=[];let s="",r=0;const i=()=>{if(s.length===0)throw new F(j,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);n.push(s),s=""};let o=!1;for(;r<e.length;){const l=e[r];if(l==="\\"){if(r+1===e.length)throw new F(j,"Path has trailing escape character: "+e);const a=e[r+1];if(a!=="\\"&&a!=="."&&a!=="`")throw new F(j,"Path has invalid escape sequence: "+e);s+=a,r+=2}else l==="`"?(o=!o,r++):l!=="."||o?(s+=l,r++):(i(),r++)}if(i(),o)throw new F(j,"Unterminated ` in path: "+e);return new Re(n)}static emptyPath(){return new Re([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Se{constructor(e){this.path=e}static fromPath(e){return new Se(ge.fromString(e))}static fromName(e){return new Se(ge.fromString(e).popFirst(5))}static empty(){return new Se(ge.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&ge.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,n){return ge.comparator(e.path,n.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new Se(new ge(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tl(t,e,n){if(!n)throw new F(j,`Function ${t}() cannot be called with an empty ${e}.`)}function qi(t){if(!Se.isDocumentKey(t))throw new F(j,`Invalid document reference. Document references must have an even number of segments, but ${t} has ${t.length}.`)}function Ji(t){if(Se.isDocumentKey(t))throw new F(j,`Invalid collection reference. Collection references must have an odd number of segments, but ${t} has ${t.length}.`)}function Jr(t){if(t===void 0)return"undefined";if(t===null)return"null";if(typeof t=="string")return t.length>20&&(t=`${t.substring(0,20)}...`),JSON.stringify(t);if(typeof t=="number"||typeof t=="boolean")return""+t;if(typeof t=="object"){if(t instanceof Array)return"an array";{const e=function(s){return s.constructor?s.constructor.name:null}(t);return e?`a custom ${e} object`:"an object"}}return typeof t=="function"?"a function":le()}function Qr(t,e){if("_delegate"in t&&(t=t._delegate),!(t instanceof e)){if(e.name===t.constructor.name)throw new F(j,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=Jr(t);throw new F(j,`Expected type '${e.name}', but it was: ${n}`)}}return t}/**
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
 */function nl(t){const e={};return t.timeoutSeconds!==void 0&&(e.timeoutSeconds=t.timeoutSeconds),e}/**
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
 */let Gn=null;function Pf(){return Gn===null?Gn=function(){return 268435456+Math.round(2147483648*Math.random())}():Gn++,"0x"+Gn.toString(16)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rf(t){return t==null}function as(t){return t===0&&1/t==-1/0}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mf={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Qi,G;function Xi(t){if(t===void 0)return zr("RPC_ERROR","HTTP error has no status"),gn;switch(t){case 200:return zi;case 400:return Xt;case 401:return pr;case 403:return ff;case 404:return hf;case 409:return mf;case 416:return gf;case 429:return pf;case 499:return uf;case 500:return gn;case 501:return Za;case 503:return Af;case 504:return df;default:return t>=200&&t<300?zi:t>=400&&t<500?Xt:t>=500&&t<600?yf:gn}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(G=Qi||(Qi={}))[G.OK=0]="OK",G[G.CANCELLED=1]="CANCELLED",G[G.UNKNOWN=2]="UNKNOWN",G[G.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",G[G.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",G[G.NOT_FOUND=5]="NOT_FOUND",G[G.ALREADY_EXISTS=6]="ALREADY_EXISTS",G[G.PERMISSION_DENIED=7]="PERMISSION_DENIED",G[G.UNAUTHENTICATED=16]="UNAUTHENTICATED",G[G.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",G[G.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",G[G.ABORTED=10]="ABORTED",G[G.OUT_OF_RANGE=11]="OUT_OF_RANGE",G[G.UNIMPLEMENTED=12]="UNIMPLEMENTED",G[G.INTERNAL=13]="INTERNAL",G[G.UNAVAILABLE=14]="UNAVAILABLE",G[G.DATA_LOSS=15]="DATA_LOSS";class Of extends class{constructor(n){this.databaseInfo=n,this.databaseId=n.databaseId;const s=n.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),i=encodeURIComponent(this.databaseId.database);this.m=s+"://"+n.host,this.A=`projects/${r}/databases/${i}`,this.T=this.databaseId.database==="(default)"?`project_id=${r}`:`project_id=${r}&database_id=${i}`}get R(){return!1}P(n,s,r,i,o){const l=Pf(),a=this.V(n,s.toUriEncodedString());os("RestConnection",`Sending RPC '${n}' ${l}:`,a,r);const c={"google-cloud-resource-prefix":this.A,"x-goog-request-params":this.T};return this.I(c,i,o),this.p(n,a,c,r).then(u=>(os("RestConnection",`Received RPC '${n}' ${l}: `,u),u),u=>{throw Xa("RestConnection",`RPC '${n}' ${l} failed with error: `,u,"url: ",a,"request:",r),u})}g(n,s,r,i,o,l){return this.P(n,s,r,i,o)}I(n,s,r){n["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+rn}(),n["Content-Type"]="text/plain",this.databaseInfo.appId&&(n["X-Firebase-GMPID"]=this.databaseInfo.appId),s&&s.headers.forEach((i,o)=>n[o]=i),r&&r.headers.forEach((i,o)=>n[o]=i)}V(n,s){const r=Mf[n];return`${this.m}/v1/${s}:${r}`}terminate(){}}{constructor(e,n){super(e),this.F=n}v(e,n){throw new Error("Not supported by FetchConnection")}async p(e,n,s,r){var i;const o=JSON.stringify(r);let l;try{l=await this.F(n,{method:"POST",headers:s,body:o})}catch(a){const c=a;throw new F(Xi(c.status),"Request failed with error: "+c.statusText)}if(!l.ok){let a=await l.json();Array.isArray(a)&&(a=a[0]);const c=(i=a==null?void 0:a.error)===null||i===void 0?void 0:i.message;throw new F(Xi(l.status),`Request failed with error: ${c??l.statusText}`)}return l.json()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Df(t){const e=typeof self<"u"&&(self.crypto||self.msCrypto),n=new Uint8Array(t);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(n);else for(let s=0;s<t;s++)n[s]=Math.floor(256*Math.random());return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nf{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=Math.floor(256/e.length)*e.length;let s="";for(;s.length<20;){const r=Df(40);for(let i=0;i<r.length;++i)s.length<20&&r[i]<n&&(s+=e.charAt(r[i]%e.length))}return s}}function he(t,e){return t<e?-1:t>e?1:0}function sl(t,e,n){return t.length===e.length&&t.every((s,r)=>n(s,e[r]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zi(t){let e=0;for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e++;return e}function Vn(t,e){for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e(n,t[n])}/**
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
 */class xf extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class et{constructor(e){this.binaryString=e}static fromBase64String(e){const n=function(r){try{return atob(r)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new xf("Invalid base64 string: "+i):i}}(e);return new et(n)}static fromUint8Array(e){const n=function(r){let i="";for(let o=0;o<r.length;++o)i+=String.fromCharCode(r[o]);return i}(e);return new et(n)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(n){return btoa(n)}(this.binaryString)}toUint8Array(){return function(n){const s=new Uint8Array(n.length);for(let r=0;r<n.length;r++)s[r]=n.charCodeAt(r);return s}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return he(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}et.EMPTY_BYTE_STRING=new et("");const Cf=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Ot(t){if(At(!!t),typeof t=="string"){let e=0;const n=Cf.exec(t);if(At(!!n),n[1]){let r=n[1];r=(r+"000000000").substr(0,9),e=Number(r)}const s=new Date(t);return{seconds:Math.floor(s.getTime()/1e3),nanos:e}}return{seconds:de(t.seconds),nanos:de(t.nanos)}}function de(t){return typeof t=="number"?t:typeof t=="string"?Number(t):0}function kn(t){return typeof t=="string"?et.fromBase64String(t):et.fromUint8Array(t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class De{constructor(e,n){if(this.seconds=e,this.nanoseconds=n,n<0)throw new F(j,"Timestamp nanoseconds out of range: "+n);if(n>=1e9)throw new F(j,"Timestamp nanoseconds out of range: "+n);if(e<-62135596800)throw new F(j,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new F(j,"Timestamp seconds out of range: "+e)}static now(){return De.fromMillis(Date.now())}static fromDate(e){return De.fromMillis(e.getTime())}static fromMillis(e){const n=Math.floor(e/1e3),s=Math.floor(1e6*(e-1e3*n));return new De(n,s)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?he(this.nanoseconds,e.nanoseconds):he(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rl(t){var e,n;return((n=(((e=t==null?void 0:t.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||n===void 0?void 0:n.stringValue)==="server_timestamp"}function il(t){const e=t.mapValue.fields.__previous_value__;return rl(e)?il(e):e}function Pn(t){const e=Ot(t.mapValue.fields.__local_write_time__.timestampValue);return new De(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yn={};function Dt(t){return"nullValue"in t?0:"booleanValue"in t?1:"integerValue"in t||"doubleValue"in t?2:"timestampValue"in t?3:"stringValue"in t?5:"bytesValue"in t?6:"referenceValue"in t?7:"geoPointValue"in t?8:"arrayValue"in t?9:"mapValue"in t?rl(t)?4:function(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}(t)?9007199254740991:function(n){var s,r;return((r=(((s=n==null?void 0:n.mapValue)===null||s===void 0?void 0:s.fields)||{}).__type__)===null||r===void 0?void 0:r.stringValue)==="__vector__"}(t)?10:11:le()}function ls(t,e){if(t===e)return!0;const n=Dt(t);if(n!==Dt(e))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return t.booleanValue===e.booleanValue;case 4:return Pn(t).isEqual(Pn(e));case 3:return function(r,i){if(typeof r.timestampValue=="string"&&typeof i.timestampValue=="string"&&r.timestampValue.length===i.timestampValue.length)return r.timestampValue===i.timestampValue;const o=Ot(r.timestampValue),l=Ot(i.timestampValue);return o.seconds===l.seconds&&o.nanos===l.nanos}(t,e);case 5:return t.stringValue===e.stringValue;case 6:return function(r,i){return kn(r.bytesValue).isEqual(kn(i.bytesValue))}(t,e);case 7:return t.referenceValue===e.referenceValue;case 8:return function(r,i){return de(r.geoPointValue.latitude)===de(i.geoPointValue.latitude)&&de(r.geoPointValue.longitude)===de(i.geoPointValue.longitude)}(t,e);case 2:return function(r,i){if("integerValue"in r&&"integerValue"in i)return de(r.integerValue)===de(i.integerValue);if("doubleValue"in r&&"doubleValue"in i){const o=de(r.doubleValue),l=de(i.doubleValue);return o===l?as(o)===as(l):isNaN(o)&&isNaN(l)}return!1}(t,e);case 9:return sl(t.arrayValue.values||[],e.arrayValue.values||[],ls);case 10:case 11:return function(r,i){const o=r.mapValue.fields||{},l=i.mapValue.fields||{};if(Zi(o)!==Zi(l))return!1;for(const a in o)if(o.hasOwnProperty(a)&&(l[a]===void 0||!ls(o[a],l[a])))return!1;return!0}(t,e);default:return le()}}function Rn(t,e){return(t.values||[]).find(n=>ls(n,e))!==void 0}function cs(t,e){if(t===e)return 0;const n=Dt(t),s=Dt(e);if(n!==s)return he(n,s);switch(n){case 0:case 9007199254740991:return 0;case 1:return he(t.booleanValue,e.booleanValue);case 2:return function(i,o){const l=de(i.integerValue||i.doubleValue),a=de(o.integerValue||o.doubleValue);return l<a?-1:l>a?1:l===a?0:isNaN(l)?isNaN(a)?0:-1:1}(t,e);case 3:return eo(t.timestampValue,e.timestampValue);case 4:return eo(Pn(t),Pn(e));case 5:return he(t.stringValue,e.stringValue);case 6:return function(i,o){const l=kn(i),a=kn(o);return l.compareTo(a)}(t.bytesValue,e.bytesValue);case 7:return function(i,o){const l=i.split("/"),a=o.split("/");for(let c=0;c<l.length&&c<a.length;c++){const u=he(l[c],a[c]);if(u!==0)return u}return he(l.length,a.length)}(t.referenceValue,e.referenceValue);case 8:return function(i,o){const l=he(de(i.latitude),de(o.latitude));return l!==0?l:he(de(i.longitude),de(o.longitude))}(t.geoPointValue,e.geoPointValue);case 9:return to(t.arrayValue,e.arrayValue);case 10:return function(i,o){var l,a,c,u;const d=i.fields||{},f=o.fields||{},m=(l=d.value)===null||l===void 0?void 0:l.arrayValue,g=(a=f.value)===null||a===void 0?void 0:a.arrayValue,h=he(((c=m==null?void 0:m.values)===null||c===void 0?void 0:c.length)||0,((u=g==null?void 0:g.values)===null||u===void 0?void 0:u.length)||0);return h!==0?h:to(m,g)}(t.mapValue,e.mapValue);case 11:return function(i,o){if(i===Yn&&o===Yn)return 0;if(i===Yn)return 1;if(o===Yn)return-1;const l=i.fields||{},a=Object.keys(l),c=o.fields||{},u=Object.keys(c);a.sort(),u.sort();for(let d=0;d<a.length&&d<u.length;++d){const f=he(a[d],u[d]);if(f!==0)return f;const m=cs(l[a[d]],c[u[d]]);if(m!==0)return m}return he(a.length,u.length)}(t.mapValue,e.mapValue);default:throw le()}}function eo(t,e){if(typeof t=="string"&&typeof e=="string"&&t.length===e.length)return he(t,e);const n=Ot(t),s=Ot(e),r=he(n.seconds,s.seconds);return r!==0?r:he(n.nanos,s.nanos)}function to(t,e){const n=t.values||[],s=e.values||[];for(let r=0;r<n.length&&r<s.length;++r){const i=cs(n[r],s[r]);if(i)return i}return he(n.length,s.length)}function ol(t){return!!t&&"arrayValue"in t}function no(t){return!!t&&"nullValue"in t}function so(t){return!!t&&"doubleValue"in t&&isNaN(Number(t.doubleValue))}function Js(t){return!!t&&"mapValue"in t}function yn(t){if(t.geoPointValue)return{geoPointValue:Object.assign({},t.geoPointValue)};if(t.timestampValue&&typeof t.timestampValue=="object")return{timestampValue:Object.assign({},t.timestampValue)};if(t.mapValue){const e={mapValue:{fields:{}}};return Vn(t.mapValue.fields,(n,s)=>e.mapValue.fields[n]=yn(s)),e}if(t.arrayValue){const e={arrayValue:{values:[]}};for(let n=0;n<(t.arrayValue.values||[]).length;++n)e.arrayValue.values[n]=yn(t.arrayValue.values[n]);return e}return Object.assign({},t)}class ro{constructor(e,n){this.position=e,this.inclusive=n}}/**
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
 */class al{}class Ke extends al{constructor(e,n,s){super(),this.field=e,this.op=n,this.value=s}static create(e,n,s){return e.isKeyField()?n==="in"||n==="not-in"?this.createKeyFieldInFilter(e,n,s):new Lf(e,n,s):n==="array-contains"?new Ff(e,s):n==="in"?new Uf(e,s):n==="not-in"?new Gf(e,s):n==="array-contains-any"?new Yf(e,s):new Ke(e,n,s)}static createKeyFieldInFilter(e,n,s){return n==="in"?new Vf(e,s):new Bf(e,s)}matches(e){const n=e.data.field(this.field);return this.op==="!="?n!==null&&this.matchesComparison(cs(n,this.value)):n!==null&&Dt(this.value)===Dt(n)&&this.matchesComparison(cs(n,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return le()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Es extends al{constructor(e,n){super(),this.filters=e,this.op=n,this.D=null}static create(e,n){return new Es(e,n)}matches(e){return function(s){return s.op==="and"}(this)?this.filters.find(n=>!n.matches(e))===void 0:this.filters.find(n=>n.matches(e))!==void 0}getFlattenedFilters(){return this.D!==null||(this.D=this.filters.reduce((e,n)=>e.concat(n.getFlattenedFilters()),[])),this.D}getFilters(){return Object.assign([],this.filters)}}class Lf extends Ke{constructor(e,n,s){super(e,n,s),this.key=Se.fromName(s.referenceValue)}matches(e){const n=Se.comparator(e.key,this.key);return this.matchesComparison(n)}}class Vf extends Ke{constructor(e,n){super(e,"in",n),this.keys=ll("in",n)}matches(e){return this.keys.some(n=>n.isEqual(e.key))}}class Bf extends Ke{constructor(e,n){super(e,"not-in",n),this.keys=ll("not-in",n)}matches(e){return!this.keys.some(n=>n.isEqual(e.key))}}function ll(t,e){var n;return(((n=e.arrayValue)===null||n===void 0?void 0:n.values)||[]).map(s=>Se.fromName(s.referenceValue))}class Ff extends Ke{constructor(e,n){super(e,"array-contains",n)}matches(e){const n=e.data.field(this.field);return ol(n)&&Rn(n.arrayValue,this.value)}}class Uf extends Ke{constructor(e,n){super(e,"in",n)}matches(e){const n=e.data.field(this.field);return n!==null&&Rn(this.value.arrayValue,n)}}class Gf extends Ke{constructor(e,n){super(e,"not-in",n)}matches(e){if(Rn(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const n=e.data.field(this.field);return n!==null&&!Rn(this.value.arrayValue,n)}}class Yf extends Ke{constructor(e,n){super(e,"array-contains-any",n)}matches(e){const n=e.data.field(this.field);return!(!ol(n)||!n.arrayValue.values)&&n.arrayValue.values.some(s=>Rn(this.value.arrayValue,s))}}/**
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
 */class mr{constructor(e,n="asc"){this.field=e,this.dir=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _e{constructor(e){this.timestamp=e}static fromTimestamp(e){return new _e(e)}static min(){return new _e(new De(0,0))}static max(){return new _e(new De(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class us{constructor(e,n){this.comparator=e,this.root=n||ye.EMPTY}insert(e,n){return new us(this.comparator,this.root.insert(e,n,this.comparator).copy(null,null,ye.BLACK,null,null))}remove(e){return new us(this.comparator,this.root.remove(e,this.comparator).copy(null,null,ye.BLACK,null,null))}get(e){let n=this.root;for(;!n.isEmpty();){const s=this.comparator(e,n.key);if(s===0)return n.value;s<0?n=n.left:s>0&&(n=n.right)}return null}indexOf(e){let n=0,s=this.root;for(;!s.isEmpty();){const r=this.comparator(e,s.key);if(r===0)return n+s.left.size;r<0?s=s.left:(n+=s.left.size+1,s=s.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((n,s)=>(e(n,s),!1))}toString(){const e=[];return this.inorderTraversal((n,s)=>(e.push(`${n}:${s}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new $n(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new $n(this.root,e,this.comparator,!1)}getReverseIterator(){return new $n(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new $n(this.root,e,this.comparator,!0)}}class $n{constructor(e,n,s,r){this.isReverse=r,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=n?s(e.key,n):1,n&&r&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const n={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return n}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class ye{constructor(e,n,s,r,i){this.key=e,this.value=n,this.color=s??ye.RED,this.left=r??ye.EMPTY,this.right=i??ye.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,n,s,r,i){return new ye(e??this.key,n??this.value,s??this.color,r??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,n,s){let r=this;const i=s(e,r.key);return r=i<0?r.copy(null,null,null,r.left.insert(e,n,s),null):i===0?r.copy(null,n,null,null,null):r.copy(null,null,null,null,r.right.insert(e,n,s)),r.fixUp()}removeMin(){if(this.left.isEmpty())return ye.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,n){let s,r=this;if(n(e,r.key)<0)r.left.isEmpty()||r.left.isRed()||r.left.left.isRed()||(r=r.moveRedLeft()),r=r.copy(null,null,null,r.left.remove(e,n),null);else{if(r.left.isRed()&&(r=r.rotateRight()),r.right.isEmpty()||r.right.isRed()||r.right.left.isRed()||(r=r.moveRedRight()),n(e,r.key)===0){if(r.right.isEmpty())return ye.EMPTY;s=r.right.min(),r=r.copy(s.key,s.value,null,null,r.right.removeMin())}r=r.copy(null,null,null,null,r.right.remove(e,n))}return r.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,ye.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,ye.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),n=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,n)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw le();const e=this.left.check();if(e!==this.right.check())throw le();return e+(this.isRed()?0:1)}}ye.EMPTY=null,ye.RED=!0,ye.BLACK=!1;ye.EMPTY=new class{constructor(){this.size=0}get key(){throw le()}get value(){throw le()}get color(){throw le()}get left(){throw le()}get right(){throw le()}copy(e,n,s,r,i){return this}insert(e,n,s){return new ye(e,n)}remove(e,n){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mn{constructor(e){this.comparator=e,this.data=new us(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((n,s)=>(e(n),!1))}forEachInRange(e,n){const s=this.data.getIteratorFrom(e[0]);for(;s.hasNext();){const r=s.getNext();if(this.comparator(r.key,e[1])>=0)return;n(r.key)}}forEachWhile(e,n){let s;for(s=n!==void 0?this.data.getIteratorFrom(n):this.data.getIterator();s.hasNext();)if(!e(s.getNext().key))return}firstAfterOrEqual(e){const n=this.data.getIteratorFrom(e);return n.hasNext()?n.getNext().key:null}getIterator(){return new io(this.data.getIterator())}getIteratorFrom(e){return new io(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let n=this;return n.size<e.size&&(n=e,e=this),e.forEach(s=>{n=n.add(s)}),n}isEqual(e){if(!(e instanceof Mn)||this.size!==e.size)return!1;const n=this.data.getIterator(),s=e.data.getIterator();for(;n.hasNext();){const r=n.getNext().key,i=s.getNext().key;if(this.comparator(r,i)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(n=>{e.push(n)}),e}toString(){const e=[];return this.forEach(n=>e.push(n)),"SortedSet("+e.toString()+")"}copy(e){const n=new Mn(this.comparator);return n.data=e,n}}class io{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class On{constructor(e){this.fields=e,e.sort(Re.comparator)}static empty(){return new On([])}unionWith(e){let n=new Mn(Re.comparator);for(const s of this.fields)n=n.add(s);for(const s of e)n=n.add(s);return new On(n.toArray())}covers(e){for(const n of this.fields)if(n.isPrefixOf(e))return!0;return!1}isEqual(e){return sl(this.fields,e.fields,(n,s)=>n.isEqual(s))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fe{constructor(e){this.value=e}static empty(){return new Fe({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let n=this.value;for(let s=0;s<e.length-1;++s)if(n=(n.mapValue.fields||{})[e.get(s)],!Js(n))return null;return n=(n.mapValue.fields||{})[e.lastSegment()],n||null}}set(e,n){this.getFieldsMap(e.popLast())[e.lastSegment()]=yn(n)}setAll(e){let n=Re.emptyPath(),s={},r=[];e.forEach((o,l)=>{if(!n.isImmediateParentOf(l)){const a=this.getFieldsMap(n);this.applyChanges(a,s,r),s={},r=[],n=l.popLast()}o?s[l.lastSegment()]=yn(o):r.push(l.lastSegment())});const i=this.getFieldsMap(n);this.applyChanges(i,s,r)}delete(e){const n=this.field(e.popLast());Js(n)&&n.mapValue.fields&&delete n.mapValue.fields[e.lastSegment()]}isEqual(e){return ls(this.value,e.value)}getFieldsMap(e){let n=this.value;n.mapValue.fields||(n.mapValue={fields:{}});for(let s=0;s<e.length;++s){let r=n.mapValue.fields[e.get(s)];Js(r)&&r.mapValue.fields||(r={mapValue:{fields:{}}},n.mapValue.fields[e.get(s)]=r),n=r}return n.mapValue.fields}applyChanges(e,n,s){Vn(n,(r,i)=>e[r]=i);for(const r of s)delete e[r]}clone(){return new Fe(yn(this.value))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class it{constructor(e,n,s,r,i,o,l){this.key=e,this.documentType=n,this.version=s,this.readTime=r,this.createTime=i,this.data=o,this.documentState=l}static newInvalidDocument(e){return new it(e,0,_e.min(),_e.min(),_e.min(),Fe.empty(),0)}static newFoundDocument(e,n,s,r){return new it(e,1,n,_e.min(),s,r,0)}static newNoDocument(e,n){return new it(e,2,n,_e.min(),_e.min(),Fe.empty(),0)}static newUnknownDocument(e,n){return new it(e,3,n,_e.min(),_e.min(),Fe.empty(),2)}convertToFoundDocument(e,n){return!this.createTime.isEqual(_e.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=n,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Fe.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Fe.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=_e.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof it&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new it(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $f{constructor(e,n=null,s=[],r=[],i=null,o=null,l=null){this.path=e,this.collectionGroup=n,this.orderBy=s,this.filters=r,this.limit=i,this.startAt=o,this.endAt=l,this.C=null}}function oo(t,e=null,n=[],s=[],r=null,i=null,o=null){return new $f(t,e,n,s,r,i,o)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jf{constructor(e,n=null,s=[],r=[],i=null,o="F",l=null,a=null){this.path=e,this.collectionGroup=n,this.explicitOrderBy=s,this.filters=r,this.limit=i,this.limitType=o,this.startAt=l,this.endAt=a,this.S=null,this.N=null,this.O=null,this.startAt,this.endAt}}function Kf(t){const e=Is(t);if(e.S===null){e.S=[];const n=new Set;for(const i of e.explicitOrderBy)e.S.push(i),n.add(i.field.canonicalString());const s=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let l=new Mn(Re.comparator);return o.filters.forEach(a=>{a.getFlattenedFilters().forEach(c=>{c.isInequality()&&(l=l.add(c.field))})}),l})(e).forEach(i=>{n.has(i.canonicalString())||i.isKeyField()||e.S.push(new mr(i,s))}),n.has(Re.keyField().canonicalString())||e.S.push(new mr(Re.keyField(),s))}return e.S}function Wf(t){const e=Is(t);return e.N||(e.N=Hf(e,Kf(t))),e.N}function Hf(t,e){if(t.limitType==="F")return oo(t.path,t.collectionGroup,e,t.filters,t.limit,t.startAt,t.endAt);{e=e.map(r=>{const i=r.dir==="desc"?"asc":"desc";return new mr(r.field,i)});const n=t.endAt?new ro(t.endAt.position,t.endAt.inclusive):null,s=t.startAt?new ro(t.startAt.position,t.startAt.inclusive):null;return oo(t.path,t.collectionGroup,e,t.filters,t.limit,n,s)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cl(t,e){if(t.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:as(e)?"-0":e}}function zf(t,e){return function(s){return typeof s=="number"&&Number.isInteger(s)&&!as(s)&&s<=Number.MAX_SAFE_INTEGER&&s>=Number.MIN_SAFE_INTEGER}(e)?function(s){return{integerValue:""+s}}(e):cl(t,e)}/**
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
 */class ks{constructor(){this._=void 0}}class qf extends ks{}class Jf extends ks{constructor(e){super(),this.elements=e}}class Qf extends ks{constructor(e){super(),this.elements=e}}class Xf extends ks{constructor(e,n){super(),this.serializer=e,this.q=n}}class An{constructor(e,n){this.updateTime=e,this.exists=n}static none(){return new An}static exists(e){return new An(void 0,e)}static updateTime(e){return new An(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}class Ps{}class Zf extends Ps{constructor(e,n,s,r=[]){super(),this.key=e,this.value=n,this.precondition=s,this.fieldTransforms=r,this.type=0}getFieldMask(){return null}}class ul extends Ps{constructor(e,n,s,r,i=[]){super(),this.key=e,this.data=n,this.fieldMask=s,this.precondition=r,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}class ep extends Ps{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class tp extends Ps{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const np={asc:"ASCENDING",desc:"DESCENDING"},sp={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},rp={and:"AND",or:"OR"};class ip{constructor(e,n){this.databaseId=e,this.useProto3Json=n}}function gr(t,e){return t.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function op(t,e){return t.useProto3Json?e.toBase64():e.toUint8Array()}function ap(t,e){return gr(t,e.toTimestamp())}function ao(t){return At(!!t),_e.fromTimestamp(function(n){const s=Ot(n);return new De(s.seconds,s.nanos)}(t))}function Xr(t,e){return yr(t,e).canonicalString()}function yr(t,e){const n=function(r){return new ge(["projects",r.projectId,"databases",r.database])}(t).child("documents");return e===void 0?n:n.child(e)}function Ar(t,e){return Xr(t.databaseId,e.path)}function lp(t,e){const n=function(r){const i=ge.fromString(r);return At(hl(i)),i}(e);if(n.get(1)!==t.databaseId.projectId)throw new F(j,"Tried to deserialize key from different project: "+n.get(1)+" vs "+t.databaseId.projectId);if(n.get(3)!==t.databaseId.database)throw new F(j,"Tried to deserialize key from different database: "+n.get(3)+" vs "+t.databaseId.database);return new Se(function(r){return At(r.length>4&&r.get(4)==="documents"),r.popFirst(5)}(n))}function lo(t,e,n){return{name:Ar(t,e),fields:n.value.mapValue.fields}}function cp(t,e){let n;if(e instanceof Zf)n={update:lo(t,e.key,e.value)};else if(e instanceof ep)n={delete:Ar(t,e.key)};else if(e instanceof ul)n={update:lo(t,e.key,e.data),updateMask:pp(e.fieldMask)};else{if(!(e instanceof tp))return le();n={verify:Ar(t,e.key)}}return e.fieldTransforms.length>0&&(n.updateTransforms=e.fieldTransforms.map(s=>function(i,o){const l=o.transform;if(l instanceof qf)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(l instanceof Jf)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:l.elements}};if(l instanceof Qf)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:l.elements}};if(l instanceof Xf)return{fieldPath:o.field.canonicalString(),increment:l.q};throw le()}(0,s))),e.precondition.isNone||(n.currentDocument=function(r,i){return i.updateTime!==void 0?{updateTime:ap(r,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:le()}(t,e.precondition)),n}function up(t,e){const n={structuredQuery:{}},s=e.path;let r;e.collectionGroup!==null?(r=s,n.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(r=s.popLast(),n.structuredQuery.from=[{collectionId:s.lastSegment()}]),n.parent=function(c,u){return Xr(c.databaseId,u)}(t,r);const i=function(c){if(c.length!==0)return dl(Es.create(c,"and"))}(e.filters);i&&(n.structuredQuery.where=i);const o=function(c){if(c.length!==0)return c.map(u=>function(f){return{field:Ut(f.field),direction:dp(f.dir)}}(u))}(e.orderBy);o&&(n.structuredQuery.orderBy=o);const l=function(c,u){return c.useProto3Json||Rf(u)?u:{value:u}}(t,e.limit);return l!==null&&(n.structuredQuery.limit=l),e.startAt&&(n.structuredQuery.startAt=function(c){return{before:c.inclusive,values:c.position}}(e.startAt)),e.endAt&&(n.structuredQuery.endAt=function(c){return{before:!c.inclusive,values:c.position}}(e.endAt)),{B:n,parent:r}}function dp(t){return np[t]}function hp(t){return sp[t]}function fp(t){return rp[t]}function Ut(t){return{fieldPath:t.canonicalString()}}function dl(t){return t instanceof Ke?function(n){if(n.op==="=="){if(so(n.value))return{unaryFilter:{field:Ut(n.field),op:"IS_NAN"}};if(no(n.value))return{unaryFilter:{field:Ut(n.field),op:"IS_NULL"}}}else if(n.op==="!="){if(so(n.value))return{unaryFilter:{field:Ut(n.field),op:"IS_NOT_NAN"}};if(no(n.value))return{unaryFilter:{field:Ut(n.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Ut(n.field),op:hp(n.op),value:n.value}}}(t):t instanceof Es?function(n){const s=n.getFilters().map(r=>dl(r));return s.length===1?s[0]:{compositeFilter:{op:fp(n.op),filters:s}}}(t):le()}function pp(t){const e=[];return t.fields.forEach(n=>e.push(n.canonicalString())),{fieldPaths:e}}function hl(t){return t.length>=4&&t.get(0)==="projects"&&t.get(2)==="databases"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zr(t){return new ip(t,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mp extends class{}{constructor(e,n,s,r){super(),this.authCredentials=e,this.appCheckCredentials=n,this.connection=s,this.serializer=r,this.Y=!1}Z(){if(this.Y)throw new F(Xt,"The client has already been terminated.")}P(e,n,s,r){return this.Z(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([i,o])=>this.connection.P(e,yr(n,s),r,i,o)).catch(i=>{throw i.name==="FirebaseError"?(i.code===pr&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new F(gn,i.toString())})}g(e,n,s,r,i){return this.Z(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,l])=>this.connection.g(e,yr(n,s),r,o,l,i)).catch(o=>{throw o.name==="FirebaseError"?(o.code===pr&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new F(gn,o.toString())})}terminate(){this.Y=!0,this.connection.terminate()}}async function gp(t,e){const n=Is(t),s={writes:e.map(r=>cp(n.serializer,r))};await n.P("Commit",n.serializer.databaseId,ge.emptyPath(),s)}async function yp(t,e){const n=Is(t),{B:s,parent:r}=up(n.serializer,Wf(e));return(await n.g("RunQuery",n.serializer.databaseId,r,{structuredQuery:s.structuredQuery})).filter(i=>!!i.document).map(i=>function(l,a,c){const u=lp(l,a.name),d=ao(a.updateTime),f=a.createTime?ao(a.createTime):_e.min(),m=new Fe({mapValue:{fields:a.fields}}),g=it.newFoundDocument(u,d,f,m);return c?g.setHasCommittedMutations():g}(n.serializer,i.document,void 0))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vn=new Map;function fl(t){if(t._terminated)throw new F(Xt,"The client has already been terminated.");if(!vn.has(t)){os("ComponentProvider","Initializing Datastore");const e=function(i){return new Of(i,fetch.bind(null))}(function(i,o,l,a){return new Ef(i,o,l,a.host,a.ssl,a.experimentalForceLongPolling,a.experimentalAutoDetectLongPolling,nl(a.experimentalLongPollingOptions),a.useFetchStreams)}(t._databaseId,t.app.options.appId||"",t._persistenceKey,t._freezeSettings())),n=Zr(t._databaseId),s=function(i,o,l,a){return new mp(i,o,l,a)}(t._authCredentials,t._appCheckCredentials,e,n);vn.set(t,s)}return vn.get(t)}class co{constructor(e){var n,s;if(e.host===void 0){if(e.ssl!==void 0)throw new F(j,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(n=e.ssl)===null||n===void 0||n;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new F(j,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}(function(i,o,l,a){if(o===!0&&a===!0)throw new F(j,`${i} and ${l} cannot be used together.`)})("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=nl((s=e.experimentalLongPollingOptions)!==null&&s!==void 0?s:{}),function(i){if(i.timeoutSeconds!==void 0){if(isNaN(i.timeoutSeconds))throw new F(j,`invalid long polling timeout: ${i.timeoutSeconds} (must not be NaN)`);if(i.timeoutSeconds<5)throw new F(j,`invalid long polling timeout: ${i.timeoutSeconds} (minimum allowed value is 5)`);if(i.timeoutSeconds>30)throw new F(j,`invalid long polling timeout: ${i.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(s,r){return s.timeoutSeconds===r.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Rs{constructor(e,n,s,r){this._authCredentials=e,this._appCheckCredentials=n,this._databaseId=s,this._app=r,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new co({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new F(Xt,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new F(Xt,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new co(e),e.credentials!==void 0&&(this._authCredentials=function(s){if(!s)return new vf;switch(s.type){case"firstParty":return new Sf(s.sessionIndex||"0",s.iamToken||null,s.authTokenFactory||null);case"provider":return s.client;default:throw new F(j,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(n){const s=vn.get(n);s&&(os("ComponentProvider","Removing Datastore"),vn.delete(n),s.terminate())}(this),Promise.resolve()}}function Ap(t,e){const n=typeof t=="object"?t:ga(),s=typeof t=="string"?t:e||"(default)",r=Vr(n,"firestore/lite").getImmediate({identifier:s});if(!r._initialized){const i=Bc("firestore");i&&vp(r,...i)}return r}function vp(t,e,n,s={}){var r;const i=(t=Qr(t,Rs))._getSettings(),o=`${e}:${n}`;if(i.host!=="firestore.googleapis.com"&&i.host!==o&&Xa("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),t._setSettings(Object.assign(Object.assign({},i),{host:o,ssl:!1})),s.mockUserToken){let l,a;if(typeof s.mockUserToken=="string")l=s.mockUserToken,a=ke.MOCK_USER;else{l=Uc(s.mockUserToken,(r=t._app)===null||r===void 0?void 0:r.options.projectId);const c=s.mockUserToken.sub||s.mockUserToken.user_id;if(!c)throw new F(j,"mockUserToken must contain 'sub' or 'user_id' field!");a=new ke(c)}t._authCredentials=new _f(new el(l,a))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ms{constructor(e,n,s){this.converter=n,this._query=s,this.type="query",this.firestore=e}withConverter(e){return new Ms(this.firestore,e,this._query)}}class Ce{constructor(e,n,s){this.converter=n,this._key=s,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new gt(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new Ce(this.firestore,e,this._key)}}class gt extends Ms{constructor(e,n,s){super(e,n,function(i){return new jf(i)}(s)),this._path=s,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new Ce(this.firestore,null,new Se(e))}withConverter(e){return new gt(this.firestore,e,this._path)}}function _p(t,e,...n){if(t=Ae(t),tl("collection","path",e),t instanceof Rs){const s=ge.fromString(e,...n);return Ji(s),new gt(t,null,s)}{if(!(t instanceof Ce||t instanceof gt))throw new F(j,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=t._path.child(ge.fromString(e,...n));return Ji(s),new gt(t.firestore,null,s)}}function bp(t,e,...n){if(t=Ae(t),arguments.length===1&&(e=Nf.newId()),tl("doc","path",e),t instanceof Rs){const s=ge.fromString(e,...n);return qi(s),new Ce(t,null,new Se(s))}{if(!(t instanceof Ce||t instanceof gt))throw new F(j,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=t._path.child(ge.fromString(e,...n));return qi(s),new Ce(t.firestore,t instanceof gt?t.converter:null,new Se(s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zt{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Zt(et.fromBase64String(e))}catch(n){throw new F(j,"Failed to construct data from Base64 string: "+n)}}static fromUint8Array(e){return new Zt(et.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Os{constructor(...e){for(let n=0;n<e.length;++n)if(e[n].length===0)throw new F(j,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Re(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ei{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ti{constructor(e,n){if(!isFinite(e)||e<-90||e>90)throw new F(j,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(n)||n<-180||n>180)throw new F(j,"Longitude must be a number between -180 and 180, but was: "+n);this._lat=e,this._long=n}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return he(this._lat,e._lat)||he(this._long,e._long)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class ni{constructor(e){this._values=(e||[]).map(n=>n)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(s,r){if(s.length!==r.length)return!1;for(let i=0;i<s.length;++i)if(s[i]!==r[i])return!1;return!0}(this._values,e._values)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tp=/^__.*__$/;class pl{constructor(e,n,s){this.data=e,this.fieldMask=n,this.fieldTransforms=s}toMutation(e,n){return new ul(e,this.data,this.fieldMask,n,this.fieldTransforms)}}function ml(t){switch(t){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw le()}}class si{constructor(e,n,s,r,i,o){this.settings=e,this.databaseId=n,this.serializer=s,this.ignoreUndefinedProperties=r,i===void 0&&this.tt(),this.fieldTransforms=i||[],this.fieldMask=o||[]}get path(){return this.settings.path}get et(){return this.settings.et}rt(e){return new si(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}nt(e){var n;const s=(n=this.path)===null||n===void 0?void 0:n.child(e),r=this.rt({path:s,it:!1});return r.st(e),r}ot(e){var n;const s=(n=this.path)===null||n===void 0?void 0:n.child(e),r=this.rt({path:s,it:!1});return r.tt(),r}ut(e){return this.rt({path:void 0,it:!0})}_t(e){return ds(e,this.settings.methodName,this.settings.ct||!1,this.path,this.settings.lt)}contains(e){return this.fieldMask.find(n=>e.isPrefixOf(n))!==void 0||this.fieldTransforms.find(n=>e.isPrefixOf(n.field))!==void 0}tt(){if(this.path)for(let e=0;e<this.path.length;e++)this.st(this.path.get(e))}st(e){if(e.length===0)throw this._t("Document fields must not be empty");if(ml(this.et)&&Tp.test(e))throw this._t('Document fields cannot begin and end with "__"')}}class Sp{constructor(e,n,s){this.databaseId=e,this.ignoreUndefinedProperties=n,this.serializer=s||Zr(e)}ht(e,n,s,r=!1){return new si({et:e,methodName:n,lt:s,path:Re.emptyPath(),it:!1,ct:r},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function wp(t){const e=t._freezeSettings(),n=Zr(t._databaseId);return new Sp(t._databaseId,!!e.ignoreUndefinedProperties,n)}class Ds extends ei{_toFieldTransform(e){if(e.et!==2)throw e.et===1?e._t(`${this._methodName}() can only appear at the top level of your update data`):e._t(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof Ds}}function Ip(t,e,n,s){const r=t.ht(1,e,n);yl("Data must be an object, but it was:",r,s);const i=[],o=Fe.empty();Vn(s,(a,c)=>{const u=ri(e,a,n);c=Ae(c);const d=r.ot(u);if(c instanceof Ds)i.push(u);else{const f=Ns(c,d);f!=null&&(i.push(u),o.set(u,f))}});const l=new On(i);return new pl(o,l,r.fieldTransforms)}function Ep(t,e,n,s,r,i){const o=t.ht(1,e,n),l=[uo(e,s,n)],a=[r];if(i.length%2!=0)throw new F(j,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let f=0;f<i.length;f+=2)l.push(uo(e,i[f])),a.push(i[f+1]);const c=[],u=Fe.empty();for(let f=l.length-1;f>=0;--f)if(!Rp(c,l[f])){const m=l[f];let g=a[f];g=Ae(g);const h=o.ot(m);if(g instanceof Ds)c.push(m);else{const _=Ns(g,h);_!=null&&(c.push(m),u.set(m,_))}}const d=new On(c);return new pl(u,d,o.fieldTransforms)}function Ns(t,e){if(gl(t=Ae(t)))return yl("Unsupported field value:",e,t),kp(t,e);if(t instanceof ei)return function(s,r){if(!ml(r.et))throw r._t(`${s._methodName}() can only be used with update() and set()`);if(!r.path)throw r._t(`${s._methodName}() is not currently supported inside arrays`);const i=s._toFieldTransform(r);i&&r.fieldTransforms.push(i)}(t,e),null;if(t===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),t instanceof Array){if(e.settings.it&&e.et!==4)throw e._t("Nested arrays are not supported");return function(s,r){const i=[];let o=0;for(const l of s){let a=Ns(l,r.ut(o));a==null&&(a={nullValue:"NULL_VALUE"}),i.push(a),o++}return{arrayValue:{values:i}}}(t,e)}return function(s,r){if((s=Ae(s))===null)return{nullValue:"NULL_VALUE"};if(typeof s=="number")return zf(r.serializer,s);if(typeof s=="boolean")return{booleanValue:s};if(typeof s=="string")return{stringValue:s};if(s instanceof Date){const i=De.fromDate(s);return{timestampValue:gr(r.serializer,i)}}if(s instanceof De){const i=new De(s.seconds,1e3*Math.floor(s.nanoseconds/1e3));return{timestampValue:gr(r.serializer,i)}}if(s instanceof ti)return{geoPointValue:{latitude:s.latitude,longitude:s.longitude}};if(s instanceof Zt)return{bytesValue:op(r.serializer,s._byteString)};if(s instanceof Ce){const i=r.databaseId,o=s.firestore._databaseId;if(!o.isEqual(i))throw r._t(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${i.projectId}/${i.database}`);return{referenceValue:Xr(s.firestore._databaseId||r.databaseId,s._key.path)}}if(s instanceof ni)return function(o,l){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:o.toArray().map(a=>{if(typeof a!="number")throw l._t("VectorValues must only contain numeric values.");return cl(l.serializer,a)})}}}}}}(s,r);throw r._t(`Unsupported field value: ${Jr(s)}`)}(t,e)}function kp(t,e){const n={};return function(r){for(const i in r)if(Object.prototype.hasOwnProperty.call(r,i))return!1;return!0}(t)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Vn(t,(s,r)=>{const i=Ns(r,e.nt(s));i!=null&&(n[s]=i)}),{mapValue:{fields:n}}}function gl(t){return!(typeof t!="object"||t===null||t instanceof Array||t instanceof Date||t instanceof De||t instanceof ti||t instanceof Zt||t instanceof Ce||t instanceof ei||t instanceof ni)}function yl(t,e,n){if(!gl(n)||!function(r){return typeof r=="object"&&r!==null&&(Object.getPrototypeOf(r)===Object.prototype||Object.getPrototypeOf(r)===null)}(n)){const s=Jr(n);throw s==="an object"?e._t(t+" a custom object"):e._t(t+" "+s)}}function uo(t,e,n){if((e=Ae(e))instanceof Os)return e._internalPath;if(typeof e=="string")return ri(t,e);throw ds("Field path arguments must be of type string or ",t,!1,void 0,n)}const Pp=new RegExp("[~\\*/\\[\\]]");function ri(t,e,n){if(e.search(Pp)>=0)throw ds(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,t,!1,void 0,n);try{return new Os(...e.split("."))._internalPath}catch{throw ds(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,t,!1,void 0,n)}}function ds(t,e,n,s,r){const i=s&&!s.isEmpty(),o=r!==void 0;let l=`Function ${e}() called with invalid data`;n&&(l+=" (via `toFirestore()`)"),l+=". ";let a="";return(i||o)&&(a+=" (found",i&&(a+=` in field ${s}`),o&&(a+=` in document ${r}`),a+=")"),new F(j,l+t+a)}function Rp(t,e){return t.some(n=>n.isEqual(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mp{constructor(e,n,s,r,i){this._firestore=e,this._userDataWriter=n,this._key=s,this._document=r,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new Ce(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new Al(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const n=this._document.data.field(Dp("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n)}}}class Al extends Mp{data(){return super.data()}}class Op{constructor(e,n){this._docs=n,this.query=e}get docs(){return[...this._docs]}get size(){return this.docs.length}get empty(){return this.docs.length===0}forEach(e,n){this._docs.forEach(e,n)}}function Dp(t,e){return typeof e=="string"?ri(t,e):e instanceof Os?e._internalPath:e._delegate._internalPath}class Np extends class{convertValue(n,s="none"){switch(Dt(n)){case 0:return null;case 1:return n.booleanValue;case 2:return de(n.integerValue||n.doubleValue);case 3:return this.convertTimestamp(n.timestampValue);case 4:return this.convertServerTimestamp(n,s);case 5:return n.stringValue;case 6:return this.convertBytes(kn(n.bytesValue));case 7:return this.convertReference(n.referenceValue);case 8:return this.convertGeoPoint(n.geoPointValue);case 9:return this.convertArray(n.arrayValue,s);case 11:return this.convertObject(n.mapValue,s);case 10:return this.convertVectorValue(n.mapValue);default:throw le()}}convertObject(n,s){return this.convertObjectMap(n.fields,s)}convertObjectMap(n,s="none"){const r={};return Vn(n,(i,o)=>{r[i]=this.convertValue(o,s)}),r}convertVectorValue(n){var s,r,i;const o=(i=(r=(s=n.fields)===null||s===void 0?void 0:s.value.arrayValue)===null||r===void 0?void 0:r.values)===null||i===void 0?void 0:i.map(l=>de(l.doubleValue));return new ni(o)}convertGeoPoint(n){return new ti(de(n.latitude),de(n.longitude))}convertArray(n,s){return(n.values||[]).map(r=>this.convertValue(r,s))}convertServerTimestamp(n,s){switch(s){case"previous":const r=il(n);return r==null?null:this.convertValue(r,s);case"estimate":return this.convertTimestamp(Pn(n));default:return null}}convertTimestamp(n){const s=Ot(n);return new De(s.seconds,s.nanos)}convertDocumentKey(n,s){const r=ge.fromString(n);At(hl(r));const i=new In(r.get(1),r.get(3)),o=new Se(r.popFirst(5));return i.isEqual(s)||zr(`Document ${o} contains a document reference within a different database (${i.projectId}/${i.database}) which is not supported. It will be treated as a reference in the current database (${s.projectId}/${s.database}) instead.`),o}}{constructor(e){super(),this.firestore=e}convertBytes(e){return new Zt(e)}convertReference(e){const n=this.convertDocumentKey(e,this.firestore._databaseId);return new Ce(this.firestore,null,n)}}function xp(t){(function(r){if(r.limitType==="L"&&r.explicitOrderBy.length===0)throw new F(Za,"limitToLast() queries require specifying at least one orderBy() clause")})((t=Qr(t,Ms))._query);const e=fl(t.firestore),n=new Np(t.firestore);return yp(e,t._query).then(s=>{const r=s.map(i=>new Al(t.firestore,n,i.key,i,t.converter));return t._query.limitType==="L"&&r.reverse(),new Op(t,r)})}function Cp(t,e,n,...s){const r=wp((t=Qr(t,Ce)).firestore);let i;return i=typeof(e=Ae(e))=="string"||e instanceof Os?Ep(r,"updateDoc",t._key,e,n,s):Ip(r,"updateDoc",t._key,e),gp(fl(t.firestore),[i.toMutation(t._key,An.exists(!0))])}(function(){(function(n){rn=n})(`${nn}_lite`),qt(new Rt("firestore/lite",(e,{instanceIdentifier:n,options:s})=>{const r=e.getProvider("app").getImmediate(),i=new Rs(new bf(e.getProvider("auth-internal")),new If(e.getProvider("app-check-internal")),function(l,a){if(!Object.prototype.hasOwnProperty.apply(l.options,["projectId"]))throw new F(j,'"projectId" not provided in firebase.initializeApp.');return new In(l.options.projectId,a)}(r,n),r);return s&&i._setSettings(s),i},"PUBLIC").setMultipleInstances(!0)),mt("firestore-lite","4.7.3",""),mt("firestore-lite","4.7.3","esm2017")})();const vl=Object.freeze({apiKey:"AIzaSyBdbve0H70D-Ch69WlaxEly7PVBFVRB5p0",authDomain:"pensiontools-4b237.firebaseapp.com",projectId:"pensiontools-4b237",storageBucket:"pensiontools-4b237.firebasestorage.app",messagingSenderId:"760877353696",appId:"1:760877353696:web:2d6f7173c8d7fab6fd9e85"});function Lp(){return vl.apiKey!=="YOUR_API_KEY"}const Vp=3;function Bp(t){const e=t&&typeof t=="object"?t.schemaVersion:void 0;return Number.isInteger(e)&&e>=0?e:0}const Fp="6.22.0",_l="pots-and-valves",hs={"pots-and-valves":[],"buckets-in-order":["bucketBand"],"bridge-and-engine":["bridgeAge","cashYears"],"ladder-and-ratchet":["ladderYears","drawAnnual","triggerMode","bandThreshold"],"floor-and-flex":["essentialsAnnual","horizonAge","sleeveRate","treatsRule","ratchet"],"floor-the-schedule":[],"floor-to-age":["floorToAge","borrowedFloor"],"full-il-gilt":["cashYears","bridgeCash"],"gilt-rotation":["cashYears","bridgeCash","rotateCutAge","rotateTrigger","rotateDisarmYears"]},Up=["sippTotal","isaTotal"],ii=t=>Object.prototype.hasOwnProperty.call(hs,t),ho=t=>!!t&&typeof t=="object"&&!Array.isArray(t),bl=t=>{const e={};for(const[n,s]of Object.entries(t||{}))s!==void 0&&(e[n]=s);return e},Gp=t=>Array.isArray(t)?t.filter(Boolean).map(e=>bl(e)):[];function fo(t){return ii(t)?hs[t].slice():[]}function Tl(t){return t===_l?fo(t):[...fo(t),...Up]}function Yp(t,e){const n=e&&typeof e=="object"?e:{};if(!ii(t))return bl(n);const s={};for(const r of Tl(t))n[r]!==void 0&&(s[r]=n[r]);return s}function $p(t){return t.allocMode||(Array.isArray(t.taggedFunds)&&t.taggedFunds.length?"funds":"risk")}function jp(t){const e=t||{},n=e.strategyId||_l;if(!ii(n)||ho(e.strategyState)&&Object.keys(e.strategyState).length)return e;const s=ho(e.strategyParams)?e.strategyParams:{},r=new Set(Tl(n));if(!Object.keys(s).some(o=>s[o]!==void 0&&!r.has(o)))return e;const i={};for(const o of Object.keys(hs))o===n||!hs[o].some(l=>s[l]!==void 0)||(i[o]={strategyParams:Yp(o,s),allocMode:$p(e),taggedFunds:Gp(e.taggedFunds),savedAt:null});return Object.keys(i).length?{...e,strategyState:i}:e}const oi=1,Kp=["typed","paste","imported","none"],Wp=["fund","gilt","cash"];function xe(t){if(t===""||t==null)return null;const e=typeof t=="number"?t:+String(t).replace(/[£$€,\s]/g,"");return Number.isFinite(e)?e:null}const jn=(t,{upper:e=!1}={})=>{const n=String(t??"").trim();return n?e?n.toUpperCase():n:null};function Sl(t){const e=String(t??"").trim().slice(0,10);return/^\d{4}-\d{2}-\d{2}$/.test(e)?e:null}function xs(t){const e=String(t??"").trim().toUpperCase();return e==="ISA"||e==="LISA"||e==="S&S ISA"||e==="STOCKS AND SHARES ISA"?"ISA":e==="GIA"||e==="TAXABLE"||e==="DEALING"||e==="GENERAL"||e==="TRADING"?"GIA":e==="CASH"||e==="BANK"||e==="SAVINGS"?"CASH":"SIPP"}function Hp(){return{version:oi,updatedAt:null,source:"none",offerDismissed:!1,lines:[]}}function zp(t){const e=t&&typeof t=="object"?t:{},n=jn(e.ticker,{upper:!0}),s=jn(e.name),r=jn(e.sedol,{upper:!0});if(!n&&!s&&!r)return null;const i=Wp.includes(e.kind)?e.kind:null;return{wrapper:xs(e.wrapper),ticker:n,name:s,sedol:r,units:xe(e.units),value:xe(e.value),ocf:xe(e.ocf),contribution:xe(e.contribution),subClass:jn(e.subClass),kind:i,asOf:Sl(e.asOf)}}function on(t){if(Array.isArray(t))return on({lines:t});if(!t||typeof t!="object")return Hp();const e=(Array.isArray(t.lines)?t.lines:[]).map(zp).filter(Boolean),n=Kp.includes(t.source)?t.source:e.length?"typed":"none";return{version:oi,updatedAt:Sl(t.updatedAt),source:n,offerDismissed:t.offerDismissed===!0,lines:e}}function an(t){return Array.isArray(t)?t:t&&typeof t=="object"&&Array.isArray(t.lines)?t.lines:[]}function qp(t){const e=an(t),n={SIPP:0,ISA:0,GIA:0,CASH:0};let s=0;for(const r of e){const i=xe(r&&r.value);i!=null&&(s+=i,n[xs(r.wrapper)]+=i)}return{count:e.length,total:s,byWrapper:n}}const ee=t=>!!t&&typeof t=="object"&&!Array.isArray(t),Jp=t=>{if(!ee(t))return!1;const e=Object.getPrototypeOf(t);return e===Object.prototype||e===null};function fs(t){if(Array.isArray(t))return t.map(fs);if(Jp(t)){const e={};for(const n of Object.keys(t))e[n]=fs(t[n]);return e}return t}const Qp=t=>{const e=t instanceof Date?t:new Date(t??Date.now());return Number.isFinite(e.getTime())?e.toISOString():new Date().toISOString()},wt=t=>{const e=JSON.stringify(t);return e===void 0?"undefined":e};function Xp(t){const e=t&&ee(t.decisionTool)?t.decisionTool:null;return e?ee(e.settings)&&e.settings.locked||Array.isArray(e.history)&&e.history.length?!0:ee(e.taxYears)&&Object.values(e.taxYears).some(n=>n&&n.yearSetupComplete):!1}function ai(t){const e=t&&ee(t.decisionTool)?t.decisionTool:null;return!!(e&&ee(e.settings)&&e.settings.locked)}const Zp=2,po=t=>wt(t&&ee(t.stressTool)?t.stressTool.settings:void 0);function mo(t){const e=t||{},n=ee(e.decisionTool)?e.decisionTool:{},s={planDocument:wt(e.planDocument),planDocumentArchive:wt(e.planDocumentArchive),"decisionTool.planOfRecord":wt(n.planOfRecord),"decisionTool.planOfRecordArchive":wt(n.planOfRecordArchive),"decisionTool.history":wt(n.history)};return Xp(e)&&(s["decisionTool.settings"]=wt(n.settings)),s}function em(t,{now:e}){if(!ee(t.strategy)){const r=typeof t.createdAt=="string"&&t.createdAt?t.createdAt:typeof t.lastModified=="string"&&t.lastModified?t.lastModified:Qp(e);t.strategy={id:"pots-and-valves",params:{},lockedAt:r,engineVersion:Fp}}const n=ee(t.stressTool)&&ee(t.stressTool.settings)?t.stressTool.settings:null;if(n){for(const[i,o]of[["pacwMin","equityMin"],["cgtMin","bondMin"],["csh2Target","cashTarget"]])n[i]!==void 0&&n[o]===void 0&&(n[o]=n[i]);const r=jp(n);r!==n&&ee(r.strategyState)&&(n.strategyState=fs(r.strategyState))}const s=t.holdings;return(Array.isArray(s)||ee(s)&&s.version!==oi)&&(t.holdings={...ee(s)?s:{},...on(s)}),t}function tm(t){if(ai(t))return t;const e=ee(t.stressTool)&&ee(t.stressTool.settings)?t.stressTool.settings:null;return e&&(oc(e.chargesPct)||(e.chargesPct=ea)),t}function nm(t){if(ai(t))return t;const e=ee(t.stressTool)&&ee(t.stressTool.settings)?t.stressTool.settings:null;return e&&(ac(e.isaGrowth)||(e.isaGrowth=ta),sm(t,e)&&(e.isaBalance=0)),t}function sm(t,e){const n=ee(t.fromAnswer)&&Array.isArray(t.fromAnswer.people)&&ee(t.fromAnswer.people[0])?t.fromAnswer.people[0]:null,s=n&&ee(n.savings)?n.savings:null,r=s&&ee(s.atStop)&&typeof s.atStop.middling=="number"?s.atStop.middling:NaN,i=ee(e.potAtRetirement)?e.potAtRetirement:null;return!!s&&s.today===0&&r>0&&e.retired===!1&&!!i&&i.source==="override"&&i.isa===r&&e.isaBalance===r}const rm=[{to:1,name:"Version stamp; strategy block, renamed Stress keys, per-strategy settings and holdings shape written once",up:em},{to:2,name:"Fund and platform charges: 0.5% a year written into every unlocked plan; locked plans untouched",up:tm},{to:3,name:'How ISAs and savings grow: "Mostly cash" written into every unlocked plan; locked plans untouched',up:nm}];function im(t,{now:e=new Date,migrations:n=rm,target:s=Vp}={}){const r=Bp(t),i={scenario:t,from:r,to:r,changed:!1,error:null,newer:!1};if(!ee(t))return i;if(r>s)return{...i,newer:!0};if(r===s)return i;try{const o=mo(t);let l=fs(t),a=r;for(const d of n){if(!(d.to>a))continue;if(d.to!==a+1)throw new Error("Migration chain has a gap: no step from version "+a+" to "+(a+1));const f=d.to>=Zp&&ai(l)?po(l):null,m=d.up(l,{now:e});if(m!==void 0&&(l=m),!ee(l))throw new Error("Migration to version "+d.to+" did not return a plan");if(f!==null&&po(l)!==f)throw new Error("Migration to version "+d.to+" changed the Stress settings of a locked plan, which no migration may touch");if(l.schemaVersion=d.to,a=d.to,a===s)break}if(a!==s)throw new Error("Migration chain stops at version "+a+", short of "+s);const c=Object.keys(t).filter(d=>!(d in l));if(c.length)throw new Error("Migration dropped root key(s): "+c.join(", "));const u=mo(l);for(const d of Object.keys(o))if(u[d]!==o[d])throw new Error("Migration changed "+d+", which no migration may touch");return{scenario:l,from:r,to:a,changed:!0,error:null,newer:!1}}catch(o){return{...i,error:o instanceof Error?o:new Error(String(o))}}}const go=["decisionSettings","stressSettings","name","description","taxYears"],Qn=t=>t&&typeof t=="object"&&!Array.isArray(t);function om(t,e,n){const s=e.split(".");let r=t;for(let i=0;i<s.length-1;i++){const o=s[i];r[o]=Qn(r[o])?{...r[o]}:{},r=r[o]}r[s[s.length-1]]=n}function am(t){if(!t||typeof t!="object")return{scenario:t,migrated:!1};const e=Object.keys(t).filter(a=>a.includes(".")),n=go.some(a=>a in t);if(!(e.length>0||n))return{scenario:t,migrated:!1};const r={};for(const[a,c]of Object.entries(t))!a.includes(".")&&!go.includes(a)&&(r[a]=c);for(const a of e)om(r,a,t[a]);r.isActive=r.isActive??!1,r.enabledTools=r.enabledTools||["stress","decision"];const i=Qn(r.planDetails)?r.planDetails:{};r.planDetails={...i,name:i.name??t.name??"My Plan",description:i.description??t.description??""};const o=Qn(r.decisionTool)?r.decisionTool:{};r.decisionTool={...o,settings:o.settings??t.decisionSettings??{},history:o.history??[],taxYears:o.taxYears??t.taxYears??{}};const l=Qn(r.stressTool)?r.stressTool:{};return r.stressTool={...l,settings:l.settings??t.stressSettings??{}},{scenario:r,migrated:!0}}function lm(t,{now:e}={}){const n=am(t),s=im(n.scenario,e===void 0?{}:{now:e});return{scenario:s.scenario,write:!s.error&&!s.newer&&(n.migrated||s.changed),from:s.from,to:s.to,newer:s.newer,error:s.error}}const cm=180,um="pt_guest_minutes",dm=t=>{const e=parseFloat(t);return Number.isFinite(e)&&e>0?e:0},hm=(t,e)=>{try{return t.getItem(e)}catch{return null}};function wl(t){return dm(hm(t,um))}function Il(t){return t>=cm}function vr(){return{equityMin:fe.EQUITY_MIN,bondMin:fe.BOND_MIN,cashTarget:fe.CASH_TARGET,duration:fe.DURATION_YEARS,baseSalary:fe.BASE_SALARY,other:0,statePension:12e3,statePensionYear:12,currentAge:null,currentAgeAsOf:null,retired:null,retireAge:null,firstTaxYear:null,potAtRetirement:null,pa:Te.PERSONAL_ALLOWANCE,brl:Te.BASIC_RATE_LIMIT,hrl:Te.HIGHER_RATE_LIMIT,taxMode:"inflates",protectionMult:Ge.PROTECTION_MULTIPLIER,consecutiveLimit:fe.CONSECUTIVE_LIMIT,disableProtection:!1,recoveryBuffer:fe.RECOVERY_BUFFER,hodlEnabled:Ge.HODL_ENABLED,hodlValue:Ge.HODL_VALUE,isaBalance:0,isaReturn:jt.RETURN,isaMin:jt.MIN,isaDrawdownStrategy:jt.DRAWDOWN_STRATEGY}}function Cs(t){if(!t)return null;const e={january:0,jan:0,february:1,feb:1,march:2,mar:2,april:3,apr:3,may:4,june:5,jun:5,july:6,jul:6,august:7,aug:7,september:8,sep:8,sept:8,october:9,oct:9,november:10,nov:10,december:11,dec:11},n=t.trim().replace(/\s+/g," ");if(/^\d{4}-\d{2}-\d{2}$/.test(n)){const[r,i,o]=n.split("-").map(Number),l=new Date(r,i-1,o);if(!isNaN(l.getTime()))return l}if(/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(n)){const[r,i,o]=n.split("/").map(Number);return new Date(o,i-1,r)}if(/^\d{1,2}-\d{1,2}-\d{4}$/.test(n)){const[r,i,o]=n.split("-").map(Number);return new Date(o,i-1,r)}let s=n.match(/^(\d{1,2})\s+(\w+)\s+(\d{4})$/i);if(s){const r=parseInt(s[1]),i=e[s[2].toLowerCase()],o=parseInt(s[3]);if(i!==void 0)return new Date(o,i,r)}if(s=n.match(/^(\w+)\s+(\d{1,2})\s+(\d{4})$/i),s){const r=e[s[1].toLowerCase()],i=parseInt(s[2]),o=parseInt(s[3]);if(r!==void 0)return new Date(o,r,i)}if(s=n.match(/^(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})$/i),s){const r=e[s[1].toLowerCase()],i=parseInt(s[2]),o=parseInt(s[3]);if(r!==void 0)return new Date(o,r,i)}if(s=n.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+(\w+),?\s+(\d{4})$/i),s){const r=parseInt(s[1]),i=e[s[2].toLowerCase()],o=parseInt(s[3]);if(i!==void 0)return new Date(o,i,r)}return null}function Yt(t){return Date.UTC(t.getFullYear(),t.getMonth(),t.getDate())/864e5}function Qs(t,e=new Date){const n=+t.currentAge||0;if(!n)return 0;if(t.currentAgeAsOf){const s=Date.parse(t.currentAgeAsOf);if(Number.isFinite(s))return n+Math.max(0,(e.getTime()-s)/(365.25*24*3600*1e3))}return n}function El(t,e=new Date){if(!t.spStartDate||!t.spWeeklyAmount)return null;const n=Cs(t.spStartDate);if(!n)return null;const s=365.25*24*60*60*1e3;let r;if(+t.firstTaxYear>0)return r=Math.max(0,(c=>c.getMonth()>3||c.getMonth()===3&&c.getDate()>=6?c.getFullYear():c.getFullYear()-1)(n)-+t.firstTaxYear),{spStartYear:r,spWeeklyAmount:t.spWeeklyAmount,spFirstYearRatio:fm(t)??1};if(t.shapeAgeNow>0&&t.currentAge>0&&t.shapeAgeNow>Math.floor(Qs(t,e))&&n.getTime()>e.getTime()){let a=0;for(let u=e.getFullYear();u<=n.getFullYear();u++){const d=new Date(u,n.getMonth(),n.getDate());d.getTime()>e.getTime()&&d.getTime()<=n.getTime()&&a++}const c=Math.floor(Qs(t,e))+a;r=Math.max(0,c-t.shapeAgeNow)}else{const a=t.shapeAgeNow>0&&t.currentAge>0?Math.max(0,t.shapeAgeNow-Qs(t,e)):0,c=Math.max(0,(n.getTime()-e.getTime())/s-a);r=Math.floor((Math.round(c*12)+1)/12)}const i=365,o=Yt(n)-Yt(new Date(n.getFullYear(),0,0)),l=(i-o)/i;return{spStartYear:r,spWeeklyAmount:t.spWeeklyAmount,spFirstYearRatio:l}}function fm(t){if(!t||!t.spStartDate)return null;const e=Cs(t.spStartDate);if(!e)return null;const n=e.getMonth()>3||e.getMonth()===3&&e.getDate()>=6?e.getFullYear():e.getFullYear()-1,s=new Date(n,3,6),r=new Date(n+1,3,6);return Math.max(0,Math.min(1,(Yt(r)-Yt(e))/(Yt(r)-Yt(s))))}function Xs(t,e,n="potMid"){if(!Array.isArray(t)||!t.length)return null;const s=Math.max(0,Math.min(t.length-1,e)),r=Math.floor(s),i=s-r,o=t[r],l=t[Math.min(t.length-1,r+1)];if(!o)return null;const a=o[n]??o.potMid,c=(l&&(l[n]??l.potMid))??a;return a+(c-a)*i}function _r(t){const e={[Lt.SHARES]:0,[Lt.BONDS]:0,[Lt.DIVERSIFIERS]:0,[Lt.CASH]:0},n={},s=[],r=[];let i=0,o=0;const l=[];for(const a of t){const c=a.mix?{mix:a.mix}:a.ticker&&!a.subClass?kc.find(u=>u.ticker===String(a.ticker).toUpperCase().trim()):null;if(c&&c.mix&&typeof c.mix=="object"){const u=Object.values(c.mix).reduce((d,f)=>d+(+f||0),0)||1;for(const[d,f]of Object.entries(c.mix))+f>0&&l.push({...a,subClass:d,value:(+a.value||0)*(+f/u),mixOf:a.ticker||null})}else l.push(a)}for(const a of l){const c=+a.value||0,u=a.subClass||(a.ticker?Pc[a.ticker]:void 0),d=u?pn[u]:null;if(!d){r.push({...a});continue}if(i+=c,s.push({...a,subClass:u,bucket:d.bucket,label:d.label}),(a.wrapper||"").toUpperCase()==="ISA"){o+=c;continue}e[d.bucket]+=c,n[u]=(n[u]||0)+c}return{buckets:e,subClassTotals:n,bondWeights:yo(n,Lt.BONDS),diversifierWeights:yo(n,Lt.DIVERSIFIERS),total:i,isaTotal:o,tagged:s,untagged:r}}function yo(t,e){const n=Object.entries(t).filter(([i])=>pn[i].bucket===e),s=n.reduce((i,[,o])=>i+o,0);if(s<=0)return{};const r={};for(const[i,o]of n)r[i]=o/s;return r}function kl(t){const e=t||{};return(+e.equityMin||0)+(+e.bondMin||0)+(+e.cashTarget||0)+(+e.diversifierStart||0)}function pm(t){const e=t||{},n=e.potAtRetirement,s={sipp:1,isa:1};if(!n||e.retired!==!1)return s;const r=kl(e),i=+e.isaBalance||0;return+n.sipp>0&&r>0&&(s.sipp=+n.sipp/r),+n.isa>0&&i>0&&(s.isa=+n.isa/i),s}const mm=24*3600*1e3;function we(t){const e=t instanceof Date?t:new Date(t);return e.getMonth()>3||e.getMonth()===3&&e.getDate()>=6?e.getFullYear():e.getFullYear()-1}function W(t){return t+"/"+String(t+1).slice(2)}function li(t){return String(t%100).padStart(2,"0")+"/"+String((t+1)%100).padStart(2,"0")}function gm(t){const e=parseInt(String(t).split("/")[0],10);return Number.isFinite(e)?e<100?2e3+e:e:NaN}function ym(t,e){let n;if(typeof t=="number")n=t;else if(t instanceof Date)n=we(t);else if(typeof t=="string"&&t.includes("/"))n=gm(t);else if(typeof t=="string"){const[s,r]=t.split("-").map(Number);n=r>=4?s:s-1}else return NaN;return n-+e}function Pl(t){const e=/^(\d{4})-(\d{2})-(\d{2})$/.exec(typeof t=="string"?t.trim():"");return e?new Date(+e[1],+e[2]-1,+e[3]):new Date(t)}function Rl(t,e=new Date){const n=t||{},s=n.spStartDate?Cs(n.spStartDate):null;if(s)return{month:s.getMonth(),day:s.getDate(),source:"sp"};if(n.currentAgeAsOf){const r=Pl(n.currentAgeAsOf);if(Number.isFinite(r.getTime()))return{month:r.getMonth(),day:r.getDate(),source:"asOf"}}return{month:e.getMonth(),day:e.getDate(),source:"today"}}function Ao(t,e,n){let s=0;for(let r=t.getFullYear();r<=e.getFullYear();r++){const i=new Date(r,n.month,n.day);i.getTime()>t.getTime()&&i.getTime()<=e.getTime()&&s++}return s}function Bn(t,e,n=new Date){const s=t||{},r=Math.floor(+s.currentAge||0);if(!(r>0))return null;let i=s.currentAgeAsOf?Pl(s.currentAgeAsOf):n;Number.isFinite(i.getTime())||(i=n);const o=Rl(s,n),l=e instanceof Date?e:new Date(e);return l.getTime()>=i.getTime()?r+Ao(i,l,o):r-Ao(l,i,o)}function br(t,e,n=new Date){return Bn(t,new Date(e+1,3,5),n)}function ps(t,e,n=new Date){const s=we(n),r=br(t,s,n);return r==null?null:s+(Math.round(+e)-r)}function Tr(t,e=new Date){const n=new Date(+t,3,6);return Math.max(0,Math.round((n.getTime()-e.getTime())/(30.44*mm)))}function Ml(t,e=new Date){const[n,s]=String(t||"").split("-").map(Number);return!Number.isFinite(n)||!Number.isFinite(s)?0:Math.max(0,(n-e.getFullYear())*12+(s-1-e.getMonth()))}function Am(t,e,n=new Date){const s=t||{},r=Bn(s,n,n);if(r==null)return null;const i=Rl(s,n);return(new Date(n.getFullYear(),i.month,i.day).getTime()>n.getTime()?n.getFullYear():n.getFullYear()+1)+(Math.round(+e)-(r+1))+"-"+String(i.month+1).padStart(2,"0")}function Ol(t,e=null,n=new Date){const s=t||{};if(typeof s.retired=="boolean"&&+s.firstTaxYear>0||!(+s.currentAge>0))return s;const r=we(n),i=+s.shapeAgeNow||57,l=ps(s,i,n)>r+1,a=s.retired===!0?!0:s.retired===!1||l?!1:e&&typeof e.retired=="boolean"?e.retired:!0;let c=+s.firstTaxYear>0?+s.firstTaxYear:a?r+1:ps(s,+s.retireAge||i,n);return!(+s.firstTaxYear>0)&&!(c>=r)&&(c=r+1),{...s,firstTaxYear:c,retired:a,retireAge:a?null:+s.retireAge||i}}function vm(t){return t.getFullYear()+"-"+String(t.getMonth()+1).padStart(2,"0")+"-"+String(t.getDate()).padStart(2,"0")}const _m=["firstTaxYear","retired","retireAge","currentAgeAsOf","legacyFirstTaxYear"];function bm(t,e=null,n=new Date){const s=Ol(t,e,n);return+s.currentAge>0?s.currentAgeAsOf?s:{...s,currentAgeAsOf:vm(n)}:+s.firstTaxYear>0||+s.legacyFirstTaxYear>0?s:{...s,legacyFirstTaxYear:n.getFullYear()+1}}function Dl(t,e=new Date){const n=Ol(t||{},null,e),s=we(e),r={currentAge:null,retireAge:null,potScale:{sipp:1,isa:1},startOptions:[s,s+1]};if(!(+n.currentAge>0)){const a=+n.firstTaxYear>0?+n.firstTaxYear:+n.legacyFirstTaxYear>0?+n.legacyFirstTaxYear:e.getFullYear()+1;return{...r,mode:"legacy",firstTaxYear:a,shapeAgeNow:+n.shapeAgeNow||57,yearsToStart:Math.max(0,a-s),startMonth:a+"-04",bridgeMonths:Tr(a,e)}}const i=Bn(n,e,e);if(n.retired===!1&&+n.retireAge>0){let a=ps(n,+n.retireAge,e);a>=s||(a=s);const c=br(n,a,e),u=Am(n,+n.retireAge,e);return{...r,mode:"future",firstTaxYear:a,shapeAgeNow:c,currentAge:i,retireAge:+n.retireAge,yearsToStart:a-s,startMonth:u,bridgeMonths:Ml(u,e),potScale:pm(n)}}const o=+n.firstTaxYear>0?+n.firstTaxYear:s+1,l=o+"-04";return{...r,mode:"retired",firstTaxYear:o,shapeAgeNow:br(n,o,e),currentAge:i,yearsToStart:Math.max(0,o-s),startMonth:l,bridgeMonths:Tr(o,e)}}function Tm(t,{locked:e=!1,hasRecords:n=!1,now:s=new Date}={}){if(e||n)return null;const r=t||{},i=we(s),o=+r.currentAge>0;let l=0,a="retired";return o&&r.retired===!1&&+r.retireAge>0?(a="future",l=ps(r,+r.retireAge,s)||0):+r.firstTaxYear>0?(l=+r.firstTaxYear,o||(a="legacy")):!o&&+r.legacyFirstTaxYear>0&&(a="legacy",l=+r.legacyFirstTaxYear),!(l>0)||l>=i||+r.staleDraftDismissedFor===l?null:{savedYear:l,savedLabel:W(l),suggestedYear:i,suggestedLabel:W(i),mode:a}}const Sm=Object.freeze({stress:Object.freeze([..._m,"staleDraftDismissedFor"]),decision:Object.freeze([])}),wm=Object.freeze(["locked","unlockedAt","unlockCount"]),Im=Object.freeze(["targetSchedule","spendingProfile","spendingMigratedFrom"]),vt=t=>!!t&&typeof t=="object"&&!Array.isArray(t);function en(t){return!!(vt(t)&&t.locked)}function Sr(t){return Array.isArray(t)?t.map(Sr):vt(t)?Object.keys(t).sort().reduce((e,n)=>(t[n]!==void 0&&(e[n]=Sr(t[n])),e),{}):t}const tn=t=>t===void 0?"<absent>":JSON.stringify(Sr(t));function Em(t,e){const n=vt(t)?t:{},s=vt(e)?e:{};return[...new Set([...Object.keys(n),...Object.keys(s)])].filter(i=>tn(n[i])!==tn(s[i])).sort()}function km(t,e){if(!vt(t)||!vt(e)||t.spendingProfile!=="declining"||e.spendingProfile!=="flat"||e.spendingMigratedFrom!=="declining")return!1;const n=t.targetSchedule,s=Array.isArray(n)&&n.length?n.map((r,i)=>Math.round((+r||0)*Rc(i,"declining"))):n;return tn(s)===tn(e.targetSchedule)}function Pm(t,e){return!en(t)||!vt(e)||en(e)?!1:!!e.unlockedAt&&(+e.unlockCount||0)>(+t.unlockCount||0)}function Rm(t,e,n){const s=new Set(Sm[t]||[]);return t==="decision"&&Pm(e,n)&&wm.forEach(r=>s.add(r)),t==="decision"&&km(e,n)&&Im.forEach(r=>s.add(r)),s}function vo(t,{locked:e,stored:n,next:s}){const r=Rm(t,n,s),i=Em(n,s).filter(o=>!r.has(o));return i.length?i:null}const Mm=["stressTool","decisionTool","strategy"],Om=/^(?:stressTool|decisionTool|strategy)$|^(?:stressTool|decisionTool)\.settings(?:\.|$)|^strategy\./;function Dm(t){return!!t&&typeof t=="object"&&Object.keys(t).some(e=>Om.test(e))}function Nm(t,e){var s,r;const n=JSON.parse(JSON.stringify({stressTool:t==null?void 0:t.stressTool,decisionTool:t==null?void 0:t.decisionTool,strategy:t==null?void 0:t.strategy}));for(const[i,o]of Object.entries(e||{})){const l=i.split(".");if(!Mm.includes(l[0]))continue;let a=n;for(let c=0;c<l.length-1;c++)vt(a[l[c]])||(a[l[c]]={}),a=a[l[c]];a[l[l.length-1]]=o}return{stress:(s=n.stressTool)==null?void 0:s.settings,decision:(r=n.decisionTool)==null?void 0:r.settings,strategy:n.strategy}}function xm(t,e,n){var l,a;const s={stress:(l=t==null?void 0:t.stressTool)==null?void 0:l.settings,decision:(a=t==null?void 0:t.decisionTool)==null?void 0:a.settings,strategy:t==null?void 0:t.strategy};if(!en(s.decision)||!Dm(e))return null;const r=Nm(t,e),i=c=>c===void 0?n:c,o=[...(vo("stress",{locked:!0,stored:i(s.stress),next:i(r.stress)})||[]).map(c=>"stress."+c),...(vo("decision",{locked:!0,stored:s.decision,next:r.decision})||[]).map(c=>"decision."+c),...tn(s.strategy)!==tn(r.strategy)?["strategy"]:[]];return o.length?o:null}const _o=.025,Nt=3;function Pe(t){if(t instanceof Date)return Number.isFinite(t.getTime())?{y:t.getFullYear(),m:t.getMonth()+1}:null;if(t&&typeof t=="object")return Number.isInteger(t.y)&&t.m>=1&&t.m<=12?{y:t.y,m:t.m}:null;const e=/^(\d{4})-(\d{2})/.exec(String(t??""));return e&&+e[2]>=1&&+e[2]<=12?{y:+e[1],m:+e[2]}:null}const wr=(t,e)=>e.y*12+e.m-(t.y*12+t.m),It=t=>t?t.y+"-"+String(t.m).padStart(2,"0"):null,qe=t=>typeof t=="number"&&Number.isFinite(t);function Nl(t){const e=t&&t.accumulation;return!e||typeof e!="object"?null:e.version===Nt?Nt:2}function xl(t){const e=t||{},n=e.accumulation||{};return n.version===Nt&&Pe(n.asOf)?{at:Pe(n.asOf),from:"asOf"}:Pe(e.createdAt)?{at:Pe(e.createdAt),from:"createdAt"}:Pe(e.lockedAt)?{at:Pe(e.lockedAt),from:"lockedAt"}:{at:null,from:null}}function Cm(t,e){const n=xl(t).at,s=Pe(e);if(Nl(t)===Nt||!n||!s)return{factor:1,cpi:null,months:n&&s?wr(n,s):0,start:n};const r=wr(n,s);return{factor:Math.pow(1+_o,r/12),cpi:_o,months:r,start:n}}function Lm(t){const e=t&&t.accumulation;return!!(e&&e.version===Nt&&((+e.isaNow||0)>0||(+e.isaMonthly||0)>0))}function Vm(t,e){const n=t.length,s=Math.max(0,Math.min(n-1,e/12)),r=Math.floor(s),i=s-r,o=t[r],l=t[Math.min(n-1,r+1)],a=c=>{const u=+o.nominal[c],d=+l.nominal[c];return u+(d-u)*i};return{low:a("careful"),expected:a("middling"),high:a("good")}}function Bm(t,{at:e,pension:n=null,isa:s=null}={}){const r=t&&t.accumulation;if(!r)return null;const i=Nl(t),o=Array.isArray(r.path)?r.path:[],l=xl(t).at,a=Pe(e),c=l&&a?Math.max(0,wr(l,a)):0,u=Lm(t),d={version:i,start:It(l),at:It(a),months:c,pathMissing:!o.length,isaCounted:u,actual:null,pension:qe(n)?Math.round(n):null,isa:qe(s)?Math.round(s):null,compared:null,prices:null,expected:null,low:null,high:null,band:null,missing:[]};if(!o.length)return d;let f;if(i===Nt)f=Vm(o,c);else{const _=o[0].potMix!=null?"potMix":"potMid";f={expected:Xs(o,c/12,_),low:Xs(o,c/12,"potLow"),high:Xs(o,c/12,"potHigh")}}if(d.expected=Math.round(f.expected),d.low=Math.round(f.low),d.high=Math.round(f.high),!qe(n))return d.missing.push("pension"),d;if(u&&!qe(s))return d.missing.push("isa"),d;const m=n+(u?s:0),g=Cm(t,a||l),h=m/g.factor;return d.actual=Math.round(m),d.compared=Math.round(h),d.prices={factor:g.factor,cpi:g.cpi,start:It(g.start)},i===Nt?d.band=Math.abs(f.high-f.low)<1?"start":h<f.low?"below p10":h<f.expected?"p10–p50":h<=f.high?"p50–p90":"above p90":d.band=h<f.low?"below the cautious line":h<f.expected?"below the locked path":h<=f.high?"on or above the locked path":"above the strong line",d}function Fm(t){if(!t||t.isa==null||!qe(+t.isa))return null;const e=+t.isa;return e===0&&t.isaEntered!==!0?null:e}function Cl({accHistory:t=[],potsToday:e=null,holdingsPension:n=0,holdingsIsa:s=null,holdingsAsOf:r=null,today:i=new Date}={}){const o=(t||[]).filter(l=>l&&Pe(l.date)).slice().sort((l,a)=>String(l.date).localeCompare(String(a.date))).pop()||null;if(o){const l=qe(+o.sipp)&&o.sipp!=null?+o.sipp:qe(+o.total)?+o.total:null;return{source:"record",at:It(Pe(o.date)),recordedAt:o.date,pension:l,isa:Fm(o)}}return e!=null&&qe(+e)?{source:"today",at:It(Pe(i)),recordedAt:null,pension:+e,isa:null}:n>0?{source:"holdings",at:It(Pe(r)||Pe(i)),recordedAt:r||null,pension:n,isa:qe(s)?s:null}:{source:null,at:It(Pe(i)),recordedAt:null,pension:null,isa:null}}const Um=5,Gm=Object.freeze({saving:{key:"saving",label:"Saving",chip:"saving",leads:["budget","accumulation"],readOnly:[],hidden:[],banner:{text:"You are saving. Set the income you will want (Budget), then check you are on course for it (Accumulation planner). The Stress tester can price the plan on the pots you will have at retirement.",btn:"Open the Accumulation planner",tab:"accumulation"}},approaching:{key:"approaching",label:"Approaching retirement",chip:"approaching",leads:["stress","strategies","accumulation"],readOnly:[],hidden:[],banner:{text:"Within five years of your plan start. Pick the strategy you will retire on and stress-test it — then lock the plan and start moving your holdings into it.",btn:"Open the Stress tester",tab:"stress"}},"committed-saving":{key:"committed-saving",label:"Committed, still saving",chip:"to go",leads:["accumulation"],readOnly:["stress","strategies"],hidden:[],banner:{text:"Your plan is locked and starts in {start}. Keep saving and buying the target portfolio; the Decision tool opens when the plan starts.",btn:"Open the plan document",tab:"decision",sub:"plandoc"}},bridge:{key:"bridge",label:"Retired — run-up to the plan's first tax year",chip:"run-up",leads:["decision"],readOnly:["stress","strategies"],hidden:["accumulation"],banner:{text:"Retired, drawing from your SIPP cash until the plan's first tax year, {start}. Record each month in the Decision tool; the ladder's rungs and the plan's tracks begin in {start}.",btn:"Open the Decision tool",tab:"decision"}},running:{key:"running",label:"Running the plan",chip:"running",leads:["decision"],readOnly:["stress","strategies"],hidden:["accumulation"],banner:null},"draft-retired":{key:"draft-retired",label:"Retired, designing the plan",chip:"retired",leads:["stress","strategies"],readOnly:[],hidden:["accumulation"],banner:{text:"You are retired and the plan is still a draft. Stress-test it, then lock it from the Stress tester's Settings page to write the plan document and start recording months.",btn:"Open the Stress tester",tab:"stress"}},unknown:{key:"unknown",label:"Getting started",chip:"",leads:["budget"],readOnly:[],hidden:[],banner:null}});function Ym(t,e=new Date){var v,b,S,T;const n=t||{},s=((v=n.stressTool)==null?void 0:v.settings)||{},i=!!(((b=n.decisionTool)==null?void 0:b.settings)||{}).locked,o=Array.isArray((S=n.decisionTool)==null?void 0:S.history)?n.decisionTool.history:[],l=((T=n.decisionTool)==null?void 0:T.taxYears)||{},a=o.length>0||Object.values(l).some(R=>R&&R.yearSetupComplete),c=!!n.planDocument,u=Dl(s,e),d=we(e),f=e.getFullYear()+"-"+String(e.getMonth()+1).padStart(2,"0"),m=u.mode==="future"&&u.startMonth?f<u.startMonth:u.firstTaxYear>d,g=u.mode==="future"&&u.startMonth?Ml(u.startMonth,e):Tr(u.firstTaxYear,e),h=[];let _;u.mode==="legacy"?(_=i?"running":"unknown",h.push("no age today in the Timing block")):u.mode==="future"?(i?_=m?"committed-saving":"running":_=u.yearsToStart>Um?"saving":"approaching",h.push("retiring at "+u.retireAge+" ("+W(u.firstTaxYear)+")")):(i?_=m?"bridge":"running":_="draft-retired",h.push("already retired; plan starts "+W(u.firstTaxYear))),i&&h.push("plan locked"+(c?" with a plan document":""));const E=Gm[_],w=E.leads.slice(),y=E.hidden.slice();["approaching","committed-saving","bridge","draft-retired"].includes(_)&&w.push("transition");const p=W(u.firstTaxYear),A=E.banner?{...E.banner,text:E.banner.text.replace(/\{start\}/g,p)}:null;return{key:_,label:E.label,chip:$m(E,g,m),leads:w,readOnly:E.readOnly.slice(),hidden:y,banner:A,locked:i,retired:u.mode==="retired",timingMode:u.mode,firstTaxYear:u.firstTaxYear,startLabel:p,startMonth:u.startMonth||null,yearsToStart:u.yearsToStart,monthsToStart:g,beforeStart:m,hasRecords:a,hasDocument:c,reasons:h}}function $m(t,e,n){return t.key==="committed-saving"||t.key==="bridge"?!n||e<=0?t.chip:e>=24?Math.round(e/12)+" years to go":e+" month"+(e===1?"":"s")+" to go":t.chip}const jm=.025,Be=t=>Number.isFinite(+t)?+t:0;function Km(t){const e=an(t).filter(y=>y&&(Be(y.value)>0||Be(y.contribution)>0)),n=_r(e.map(y=>({...y,value:Be(y.value)}))),s={SIPP:0,ISA:0,GIA:0,CASH:0},r={shares:0,bonds:0,diversifiers:0,cash:0},i={};let o=0,l=0,a=0;for(const y of n.tagged){const p=Be(y.value);if(!(p>0))continue;o+=p;const A=(y.wrapper||"SIPP").toUpperCase();s[A in s?A:"SIPP"]+=p,r[y.bucket]=(r[y.bucket]||0)+p,i[y.subClass]=(i[y.subClass]||0)+p,l+=p*(Be(y.ocf)/100);const v=pn[y.subClass];a+=p*(v?Be(v.nominalReturn):0)}const c={};for(const y of Object.keys(r))c[y]=o>0?r[y]/o:0;const u=Object.entries(i).map(([y,p])=>{var A,v;return{key:y,label:((A=pn[y])==null?void 0:A.label)||y,bucket:((v=pn[y])==null?void 0:v.bucket)||"shares",value:p,weight:o>0?p/o:0}}).sort((y,p)=>p.value-y.value),d=o>0?l/o:0,f=o>0?a/o:0,m=e.filter(y=>Be(y.contribution)>0),g=_r(m.map(y=>({...y,value:Be(y.contribution)}))),h={shares:0,bonds:0,diversifiers:0,cash:0};let _=0;const E={SIPP:0,ISA:0,GIA:0,CASH:0};for(const y of g.tagged){const p=Be(y.value);_+=p,h[y.bucket]=(h[y.bucket]||0)+p;const A=(y.wrapper||"SIPP").toUpperCase();E[A in E?A:"SIPP"]+=p}const w={};for(const y of Object.keys(h))w[y]=_>0?h[y]/_:0;return{total:o,byWrapper:s,buckets:c,bucketValues:r,subClasses:u,weightedOcf:d,expectedNominal:f,expectedReal:f-jm-d,contributions:{monthly:_,byBucket:w,byWrapper:E},untagged:n.untagged.map(y=>({ticker:y.ticker||"",name:y.name||"",value:Be(y.value)}))}}function Wm(t){return an(t).reduce((e,n)=>e+(n&&(n.wrapper||"SIPP").toUpperCase()==="SIPP"?Be(n.value):0),0)}const Hm=["full-il-gilt","gilt-rotation","floor-the-schedule"],zm=.04,qm=["pots-and-valves","buckets-in-order"],Jm=["full-il-gilt","gilt-rotation"];function bo(t,{planYear:e=0}={}){var f,m;const n=t||{},s=((f=n.strategy)==null?void 0:f.id)||"pots-and-valves",r=qm.includes(s),i=n.pots||{},o=i.isaPolicy==="hold",l=r||!o,a=(Array.isArray(n.timeline)?n.timeline:[]).filter(g=>g&&+g.y<=e).flatMap(g=>Array.isArray(g.lumpIn)?g.lumpIn:[]);let c=!1,u=!1;for(const g of a){const h=String(g.wrapper||"cash").toLowerCase(),_=+g.amount||0;h==="pension"||h==="sipp"||!(_>0)||(h==="isa"?c=!0:h==="gia"||o?u=!0:(c=!0,_>Mc.ISA_ALLOWANCE&&(u=!0)))}const d=(+i.isa||0)>0;return{strategyId:s,potsStrategy:r,isa:l&&(d||c),gia:(+i.gia||0)>0||u,diversifiers:r&&(+((m=i.allocation)==null?void 0:m.diversifierStart)||0)>0,isaLeftOut:!l&&d}}function Ne(t){if(t instanceof Date)return Number.isFinite(t.getTime())?{y:t.getFullYear(),m:t.getMonth()+1}:null;if(t&&typeof t=="object")return Number.isInteger(t.y)&&t.m>=1&&t.m<=12?{y:t.y,m:t.m}:null;const e=/^(\d{4})-(\d{2})/.exec(String(t??""));return e?{y:+e[1],m:+e[2]}:null}const ci=(t,e)=>e.y*12+e.m-(t.y*12+t.m),ui=(t,e)=>(t.m>=4?t.y:t.y-1)-e,Ll=t=>(t.m+8)%12;function Qm(t,e,n=null){var u,d;const s=+((u=t==null?void 0:t.assumptions)==null?void 0:u.cpiDecision)>0?+t.assumptions.cpiDecision:zm,r=+((d=t==null?void 0:t.timing)==null?void 0:d.firstTaxYear),i=Ne(e),o={factor:1,assumed:s,years:[]};if(!i||!Number.isFinite(r))return o;const l=ui(i,r),a=Ll(i)/12,c=n&&typeof n=="object"?n:{};for(let f=0;f<=l;f++){const m=f<l?1:a;if(!(m>0))break;const g=li(r+f),h=+(c[g]&&c[g].cpi)||0,_=h||s;o.factor*=Math.pow(1+_,m),o.years.push({taxYear:g,cpi:_,entered:!!h,share:m})}return o}function Xm(t){const e=(t||[]).filter(r=>r&&Ne(r.date)).slice().sort((r,i)=>String(r.date).localeCompare(String(i.date)));if(!e.length)return null;const n=(r,i)=>["equity","bond","cash"].every(o=>Math.abs((+r[o]||0)-(+i[o]||0))<.5);let s=e.length-1;for(;s>0&&n(e[s-1],e[s])&&ci(Ne(e[s-1].date),Ne(e[s].date))===1;)s--;return{rec:e[s],idx:s,recs:e}}function _n(t,e){const n=an(t).filter(r=>r&&xs(r.wrapper)===e&&xe(r.value)!=null);if(!n.length)return null;const s=t&&!Array.isArray(t)&&t.updatedAt||n.map(r=>r.asOf).filter(Boolean).sort().pop()||null;return{value:n.reduce((r,i)=>r+xe(i.value),0),asOf:s?String(s).slice(0,10):null}}function Zm(t){const e=_n(t,"SIPP");if(!e)return null;const n=an(t).filter(s=>s&&xs(s.wrapper)==="SIPP"&&xe(s.value)!=null).map(s=>({...s,value:xe(s.value)}));return{value:Km(n).bucketValues.diversifiers||0,asOf:e.asOf}}function eg(t,{today:e,history:n,potsToday:s,holdings:r}){const i=p=>bo(t,{planYear:ui(p,+t.timing.firstTaxYear)});if(s!=null){const p=e.toISOString().slice(0,10),A=Ne(e);return{source:"today",asOf:p,at:A,pension:Math.round(+s),parts:[{key:"all",value:+s,source:"today",asOf:p}],missing:[],measure:i(A),runUpMonthly:0}}const o=Xm(n),l=_n(r,"SIPP"),a=bo(t).diversifiers,c=[],u=[];let d=null,f=null,m=null,g=null;const h=l&&l.value>0?Ne(l.asOf):null,_=a&&l&&l.value>0&&(!o||h!=null&&ci(Ne(o.rec.date),h)>=0);if(o&&!_){if(d="record",g=o.rec,m=String(g.date).slice(0,7),f=(+g.equity||0)+(+g.bond||0)+(+g.cash||0),a){const p=Zm(r);p?p.value>0&&u.push({key:"diversifiers",value:p.value,source:"holdings",asOf:p.asOf}):c.push("diversifiers")}}else l&&l.value>0&&(d="holdings",f=l.value,m=l.asOf);const E=Ne(m)||Ne(e),w=i(E);if(d==null)return{source:null,asOf:null,at:E,pension:null,parts:[],missing:["pension"],measure:w,runUpMonthly:0};const y=[{key:"pension",value:f,source:d,asOf:m},...u];if(w.isa){const p=_n(r,"ISA");p?y.push({key:"isa",value:p.value,source:"holdings",asOf:p.asOf}):c.push("isa")}if(w.gia){let p=null;if(g&&xe(g.gia)!=null)p={value:+g.gia,source:"record",asOf:m};else if(g){const A=o.recs.slice(0,o.idx).reverse().find(v=>xe(v.gia)!=null);A&&xe(A.giaBalanceAfter)!=null&&+A.giaBalanceAfter<=1&&(p={value:0,source:"record",asOf:m})}if(!p){const A=_n(r,"GIA");A&&(p={value:A.value,source:"holdings",asOf:A.asOf})}p?y.push({key:"gia",...p}):c.push("gia")}return{source:d,asOf:m,at:E,pension:Math.round(f),parts:y,missing:c,measure:w,runUpMonthly:g&&+g.sipp||0}}function tg(t,e,n=0){const s=(f,m)=>Array.isArray(f)&&m<f.length&&Number.isFinite(+f[m])?+f[m]:null,r=Array.isArray(t==null?void 0:t.p50)?t.p50.length:0;if(!r)return{p10:null,p50:null,p90:null};const i=Math.min(Math.max(0,e),r-1),o=s(t.p50,i),l=s(t.p50,i+1);if(o==null)return{p10:null,p50:null,p90:null};const a=n>0&&l!=null,c=a?o+n*(l-o):o,u=a?(Math.sqrt(i+n)-Math.sqrt(i))/(Math.sqrt(i+1)-Math.sqrt(i)):0,d=f=>{const m=s(f,i);if(m==null)return null;const g=s(f,i+1);if(!a||g==null)return m+(c-o);const h=m-o,_=g-l;return c+h+u*(_-h)};return{p10:d(t.p10),p50:c,p90:d(t.p90)}}function ng(t,e,{today:n,history:s,potsToday:r,holdings:i,taxYears:o}){var P,D,I;const l=+t.timing.firstTaxYear,a=eg(t,{today:n,history:s,potsToday:r,holdings:i}),c=ui(a.at,l);if(t.timing.mode==="future"&&c<0)return null;const u=Math.max(0,c),d=c>=0?Ll(a.at)/12:0;let{p10:f,p50:m,p90:g}=tg(e,u,d);const h=m;let _=null;const E=Math.max(0,+((P=t.assumptions)==null?void 0:P.bridgeCash)||0);if(c<0&&E>0){const M=Math.max(0,l*12+4-(a.at.y*12+a.at.m)),N=Math.round(+((D=t.timing)==null?void 0:D.bridgeMonths)||+((I=t.assumptions)==null?void 0:I.bridgeMonths)||0);let B,ue;if(N>0)B=E*Math.min(1,M/N),ue=E/N;else{const oe=Array.isArray(t.timeline)?t.timeline[0]:null;ue=a.runUpMonthly>0?a.runUpMonthly:oe?Math.max(0,((+oe.gross||0)-(+oe.sp||0)-(+oe.other||0))/12):0,B=Math.min(E,ue*M)}B>0&&(_={months:M,of:N>0?N:null,monthly:Math.round(ue),value:Math.round(B)},[f,m,g]=[f,m,g].map(oe=>oe==null?null:oe+B))}const w=a.missing.length?null:a.parts.reduce((M,N)=>M+N.value,0),y=Qm(t,a.at,o),p=w==null?null:w/y.factor,A=Array.isArray(e.p10)&&Array.isArray(e.p90)&&e.p10.length>1&&e.p10.every((M,N)=>Math.abs((e.p90[N]??M)-M)<1),v=Jm.includes(a.measure.strategyId)||A;let b=null,S=null;p!=null&&m!=null&&(v?b="gilts-at-cost":f==null||g==null||Math.abs(m-f)<1?b=(f==null||g==null||Math.abs(g-f)<1)&&(c<0||c===0&&d===0)?"start":"not-open":(b="band",S=p<f?"below p10":p<m?"p10–p50":p<=g?"p50–p90":"above p90"));const T=Ne(n),R=a.parts.filter(M=>M.source!=="today"&&Ne(M.asOf)&&T&&ci(Ne(M.asOf),T)>3).map(M=>({key:M.key,source:M.source,asOf:M.asOf})),k=M=>M==null?null:Math.round(M);return{actual:k(w),real:k(p),pension:a.pension,parts:a.parts.map(M=>({...M,value:Math.round(M.value)})),missing:a.missing,source:a.source,asOf:a.asOf,planYear:c,monthsIn:Math.round(d*12),prices:{factor:y.factor,assumed:y.assumed,years:y.years.length,entered:y.years.filter(M=>M.entered).length},p10:k(f),p50:k(m),p90:k(g),startP50:_?k(h):null,runUp:_,verdict:b,band:S,flat:A,isaLeftOut:a.measure.isaLeftOut,stale:R}}function sg(t,{today:e=new Date,history:n=[],potsToday:s=null,ladderPos:r=null,accHistory:i=[],holdings:o=null,taxYears:l=null}={}){var P,D,I,M,N,B,ue,oe,pe;if(!t||!t.timing)return null;const a=Wm(an(o)),c=o&&!Array.isArray(o)&&o.updatedAt?o.updatedAt:null;let u=null;if(t.accumulation&&t.timing.mode==="future"){const H=_n(o,"ISA"),te=Cl({accHistory:i,potsToday:s,holdingsPension:a,holdingsIsa:H?H.value:null,holdingsAsOf:c,today:e}),ae=Bm(t,{at:te.at,pension:te.pension,isa:te.isa}),nt=new Date(+t.timing.firstTaxYear,3,6);u={monthsToGo:Math.max(0,Math.round((nt.getTime()-e.getTime())/(30.44*24*3600*1e3))),pathMissing:ae.pathMissing,version:ae.version,expected:ae.expected,low:ae.low,high:ae.high,actual:ae.pathMissing||ae.actual==null?te.pension==null?null:Math.round(te.pension):ae.actual,compared:ae.compared,pension:ae.pension,isa:ae.isa,isaCounted:ae.isaCounted,missing:ae.missing,prices:ae.prices,at:ae.at,start:ae.start,actualSource:te.source,recordedAt:te.source==="record"?te.recordedAt:te.source==="holdings"?c:null,band:ae.band,contributions:t.accumulation.totalMonthly||0,isaMonthly:t.accumulation.isaMonthly||0}}const d=+t.timing.firstTaxYear,f=ym(e,d),m=f<0,g=Math.max(0,f),h=((P=t.timeline)==null?void 0:P.length)||((D=t.assumptions)==null?void 0:D.duration)||35,_=t.timing.shapeAgeNow+f,E=W(we(e)),w=(t.steps||[]).slice().sort((H,te)=>H.fromAge-te.fromAge),y=w.filter(H=>{var te;return H.fromAge<=Math.max(_,((te=w[0])==null?void 0:te.fromAge)??_)}).pop()||w[0]||null,p=w.find(H=>H.fromAge>(y?y.fromAge:_))||null,A=y?Math.round(Tn(w.map(H=>({fromAge:H.fromAge,amount:H.amount,decline:H.decline,glideToNext:H.glideToNext})),Math.max(_,y.fromAge),y.amount)):null,v=((I=t.timeline)==null?void 0:I[g])||null,b=String(we(e)%100).padStart(2,"0")+"/"+String((we(e)+1)%100).padStart(2,"0"),S=(n||[]).filter(H=>H&&H.taxYear===b),T=S.reduce((H,te)=>H+(+te.sipp||0)+(+te.other||0)+(+te.state||0),0),R=((B=(N=(M=t.strategy)==null?void 0:M.r)==null?void 0:N.cones)==null?void 0:B.wealth)||null,k=R?ng(t,R,{today:e,history:n,potsToday:s,holdings:o,taxYears:l}):null;return{today:e.toISOString().slice(0,10),planYear:f,planYears:h,bridge:m,taxYear:E,age:_,planStart:W(d),step:y?{amount:A,from:y.fromAge,taxYear:y.taxYear,index:w.indexOf(y)+1,of:w.length,next:p?{fromAge:p.fromAge,amount:p.amount,taxYear:p.taxYear,yearsAway:p.fromAge-_}:null}:null,incomeThisYear:{recorded:S.length,drawn:Math.round(T),planned:v?v.gross:null,perMonth:v?Math.round(v.gross/12):null},pot:k,ladder:r?{phase:r.phase,instruction:r.instruction,monthly:r.monthly,source:r.source,verdict:((ue=r.cashCheck)==null?void 0:ue.verdict)||null}:null,contract:!!((oe=t.strategy)!=null&&oe.contract),strategyId:((pe=t.strategy)==null?void 0:pe.id)||"pots-and-valves",saving:u}}function rg(t){const e=t.getMonth(),n=t.getDate();return e>3||e===3&&n>=6?t.getFullYear():t.getFullYear()-1}function ig(t,e){const n=new Date(t+1,3,6);if(e>=n)return 0;const s=new Date(t,3,6),r=e<s?s:e;return Math.max(1,Math.min(12,Math.round((n-r)/(30.44*24*3600*1e3))))}function og(t,e={}){if(!t||!Array.isArray(t.years)||!t.years.length)return null;const n=e.today||new Date,s=rg(n),r=t.years,i=r[0].Y,o=r[r.length-1].Y,l=r.find(k=>k.Y===s)||null,a=s<i?"before":s>o?"after":"running",c=l?l.need:0,u=l?l.gross:0,d=Math.max(0,u-c),f=ig(s,n),m=e.drawnThisYear||0,g=Math.max(0,c-m),h=f>0?g/f:0,_=[];for(const k of r){if(k.Y<=s)continue;(k.from==="cash"?!0:k.matures?new Date(k.matures)<=n:!1)&&_.push({Y:k.Y,age:k.age,amount:k.need,from:k.from,until:new Date(k.Y,3,6)})}const E=_.reduce((k,P)=>k+P.amount,0),w=(t.orders||[]).filter(k=>new Date(k.matures)>n).sort((k,P)=>k.matures.localeCompare(P.matures)),y=w.length?w[0]:null,p=y?{tidm:y.tidm,name:y.name,matures:y.matures,nominal:y.nominal,pays:y.pays,taxYears:y.taxYears||[],monthsAway:Math.round((new Date(y.matures)-n)/(30.44*24*3600*1e3)),sitsMonths:y.taxYears&&y.taxYears.length?Math.max(0,Math.round((new Date(y.taxYears[0],3,6)-new Date(y.matures))/(30.44*24*3600*1e3))):0}:null,A=g,v=A+E,b=e.cashBalance==null?null:e.cashBalance,S=b==null?null:{balance:b,shouldBeLiquid:A,parkedTotal:E,expectedTotal:v,diff:b-v,verdict:Math.abs(b-v)<Math.max(500,v*.02)?"as expected":b>v?"more cash than the plan needs — park the surplus":"less cash than the plan needs — check the last maturity landed"},T=r[0],R=a==="before"?{Y:T.Y,label:`${T.Y}/${String(T.Y+1).slice(2)}`,age:T.age,gross:T.gross,fromLadder:T.need,statePension:Math.max(0,T.gross-T.need),monthly:T.need/12,source:T.from,startsOn:new Date(T.Y,3,6),cashBucket:t.cash||0,cashYears:r.filter(k=>k.from==="cash").length}:null;return{taxYear:s,taxYearLabel:`${s}/${String(s+1).slice(2)}`,phase:a,upcoming:R,age:l?l.age:null,gross:u,statePension:d,fromLadder:c,source:l?l.from:null,sourceHeld:l?!!l.held:!1,monthsLeft:f,drawnThisYear:m,remaining:g,monthly:h,parked:_,parkedTotal:E,next:p,cashCheck:S,yearsLeft:Math.max(0,o-s),instruction:l?`Instruct the broker to pay ${ag(h)} a month for the ${f} month${f===1?"":"s"} to 5 April ${s+1}.`:a==="before"?`The ladder starts in ${i}/${String(i+1).slice(2)}.`:"The ladder has paid its last year."}}function ag(t){return"£"+Math.round(t).toLocaleString("en-GB")}function To(t,e=null){const n=t&&t.strategy&&t.strategy.r?t.strategy.r.plan:null;return!n||!Array.isArray(n.years)||!n.years.length||!Array.isArray(n.orders)||e&&t.strategy.id&&t.strategy.id!==e?null:n}const Kn={gilts:[{name:"0 3/8% Treasury Gilt 2026",isin:"GB00BNNGP668",type:"conventional",coupon:.375,maturity:"2026-10-22",dmoDate:"2026-10-16",tidm:"T26A",cleanPrice:99.96,yield:null,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 1/8% Treasury Gilt 2027",isin:"GB00BL6C7720",type:"conventional",coupon:4.125,maturity:"2027-01-29",dmoDate:"2026-10-16",tidm:"T27A",cleanPrice:99.99,yield:.04185,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"3¾% Treasury Gilt 2027",isin:"GB00BPSNB460",type:"conventional",coupon:3.75,maturity:"2027-03-07",dmoDate:"2026-10-16",tidm:"TS27",cleanPrice:99.82,yield:.04257,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1¼% Treasury Gilt 2027",isin:"GB00BDRHNP05",type:"conventional",coupon:1.25,maturity:"2027-07-22",dmoDate:"2026-10-16",tidm:"TG27",cleanPrice:97.72,yield:.04361,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1¼% Index-linked Treasury Gilt 2027",isin:"GB00B128DH60",type:"il3",coupon:1.25,maturity:"2027-11-22",dmoDate:"2026-10-16",tidm:"T27",cleanPrice:101.77,yield:-.00353,yieldKind:"real",baseRpi:194.06667,indexRatio:2.16663},{name:"4¼% Treasury Gilt 2027",isin:"GB00B16NNR78",type:"conventional",coupon:4.25,maturity:"2027-12-07",dmoDate:"2026-10-16",tidm:"TR27",cleanPrice:99.69,yield:.04579,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Treasury Gilt 2028",isin:"GB00BMBL1G81",type:"conventional",coupon:.125,maturity:"2028-01-31",dmoDate:"2026-10-16",tidm:"TN28",cleanPrice:94.88,yield:.04283,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 3/8% Treasury Gilt 2028",isin:"GB00BSQNRC93",type:"conventional",coupon:4.375,maturity:"2028-03-07",dmoDate:"2026-10-16",tidm:"TE28",cleanPrice:99.58,yield:.04742,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4½% Treasury Gilt 2028",isin:"GB00BMF9LG83",type:"conventional",coupon:4.5,maturity:"2028-06-07",dmoDate:"2026-10-16",tidm:"TS28",cleanPrice:99.63,yield:.04789,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2028",isin:"GB00BZ1NTB69",type:"il3",coupon:.125,maturity:"2028-08-10",dmoDate:"2026-10-16",tidm:"T28",cleanPrice:99.83,yield:.00219,yieldKind:"real",baseRpi:279.23333,indexRatio:1.50581},{name:"1 5/8% Treasury Gilt 2028",isin:"GB00BFX0ZL78",type:"conventional",coupon:1.625,maturity:"2028-10-22",dmoDate:"2026-10-16",tidm:"TG28",cleanPrice:94.17,yield:.04741,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"6% Treasury Stock 2028",isin:"GB0002404191",type:"conventional",coupon:6,maturity:"2028-12-07",dmoDate:"2026-10-16",tidm:"TR28",cleanPrice:102.69,yield:.04718,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0½% Treasury Gilt 2029",isin:"GB00BLPK7227",type:"conventional",coupon:.5,maturity:"2029-01-31",dmoDate:"2026-10-16",tidm:"TG29",cleanPrice:90.98,yield:.04747,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2029",isin:"GB00B3Y1JG82",type:"il3",coupon:.125,maturity:"2029-03-22",dmoDate:"2026-10-16",tidm:"T29",cleanPrice:98.32,yield:.00826,yieldKind:"real",baseRpi:237.42,indexRatio:1.771},{name:"4% Treasury Gilt 2029",isin:"GB00BVP99566",type:"conventional",coupon:4,maturity:"2029-05-22",dmoDate:"2026-10-16",tidm:"T29K",cleanPrice:97.96,yield:.04902,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 1/8% Treasury Gilt 2029",isin:"GB00BQC82B83",type:"conventional",coupon:4.125,maturity:"2029-07-22",dmoDate:"2026-10-16",tidm:"TS29",cleanPrice:98.16,yield:.049,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 7/8% Treasury Gilt 2029",isin:"GB00BJMHB534",type:"conventional",coupon:.875,maturity:"2029-10-22",dmoDate:"2026-10-16",tidm:"TR29",cleanPrice:89.15,yield:.04836,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 3/8% Treasury Gilt 2030",isin:"GB00BSQNRD01",type:"conventional",coupon:4.375,maturity:"2030-03-07",dmoDate:"2026-10-16",tidm:"T30",cleanPrice:98.41,yield:.04948,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 5/8% Treasury Gilt 2030",isin:"GB00BWBR1P52",type:"conventional",coupon:4.625,maturity:"2030-05-22",dmoDate:"2026-10-16",tidm:"T30K",cleanPrice:99.08,yield:.04966,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 1/8% Index-linked Treasury Stock 2030",isin:"GB0008932666",type:"il8",coupon:4.125,maturity:"2030-07-22",dmoDate:"2026-10-16",tidm:"T30I",cleanPrice:342.35,yield:null,yieldKind:"real",baseRpi:135.1,indexRatio:null},{name:"0 3/8% Treasury Gilt 2030",isin:"GB00BL68HH02",type:"conventional",coupon:.375,maturity:"2030-10-22",dmoDate:"2026-10-16",tidm:"TG30",cleanPrice:84.04,yield:.04848,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4¾% Treasury Gilt 2030",isin:"GB00B24FF097",type:"conventional",coupon:4.75,maturity:"2030-12-07",dmoDate:"2026-10-16",tidm:"TR30",cleanPrice:99.7,yield:.04888,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 1/8% Treasury Gilt 2031",isin:"GB00BVP99673",type:"conventional",coupon:4.125,maturity:"2031-03-07",dmoDate:"2026-10-16",tidm:"T31H",cleanPrice:96.86,yield:.04989,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0¼% Treasury Gilt 2031",isin:"GB00BMGR2809",type:"conventional",coupon:.25,maturity:"2031-07-31",dmoDate:"2026-10-16",tidm:"TG31",cleanPrice:80.69,yield:.04871,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2031",isin:"GB00BNNGP551",type:"il3",coupon:.125,maturity:"2031-08-10",dmoDate:"2026-10-16",tidm:"TR31",cleanPrice:95.53,yield:.01083,yieldKind:"real",baseRpi:293.60323,indexRatio:1.43211},{name:"4% Treasury Gilt 2031",isin:"GB00BPSNBF73",type:"conventional",coupon:4,maturity:"2031-10-22",dmoDate:"2026-10-16",tidm:"T31",cleanPrice:95.82,yield:.05012,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1% Treasury Gilt 2032",isin:"GB00BM8Z2T38",type:"conventional",coupon:1,maturity:"2032-01-31",dmoDate:"2026-10-16",tidm:"TG32",cleanPrice:81.73,yield:.0503,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 5/8% Treasury Gilt 2032",isin:"GB00BWGDRG14",type:"conventional",coupon:4.625,maturity:"2032-03-07",dmoDate:"2026-10-16",tidm:"T32H",cleanPrice:98.27,yield:.05056,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4¼% Treasury Stock 2032",isin:"GB0004893086",type:"conventional",coupon:4.25,maturity:"2032-06-07",dmoDate:"2026-10-16",tidm:"TR32",cleanPrice:96.57,yield:.05014,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1¼% Index-linked Treasury Gilt 2032",isin:"GB00B3D4VD98",type:"il3",coupon:1.25,maturity:"2032-11-22",dmoDate:"2026-10-16",tidm:"T32",cleanPrice:99.38,yield:.01361,yieldKind:"real",baseRpi:217.13226,indexRatio:1.93647},{name:"3¼% Treasury Gilt 2033",isin:"GB00BMV7TC88",type:"conventional",coupon:3.25,maturity:"2033-01-31",dmoDate:"2026-10-16",tidm:"TR33",cleanPrice:90.35,yield:.05122,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 1/8% Treasury Gilt 2033",isin:"GB00BVP99780",type:"conventional",coupon:4.125,maturity:"2033-03-07",dmoDate:"2026-10-16",tidm:"T33H",cleanPrice:94.86,yield:.05141,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 7/8% Green Gilt 2033",isin:"GB00BM8Z2S21",type:"conventional",coupon:.875,maturity:"2033-07-31",dmoDate:"2026-10-16",tidm:"TG33",cleanPrice:76.03,yield:.0516,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0¾% Index-linked Treasury Gilt 2033",isin:"GB00BMF9LJ15",type:"il3",coupon:.75,maturity:"2033-11-22",dmoDate:"2026-10-16",tidm:"T33",cleanPrice:94.65,yield:.01554,yieldKind:"real",baseRpi:372.24,indexRatio:1.12957},{name:"4 5/8% Treasury Gilt 2034",isin:"GB00BPJJKN53",type:"conventional",coupon:4.625,maturity:"2034-01-31",dmoDate:"2026-10-16",tidm:"T34",cleanPrice:96.9,yield:.05205,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0¾% Index-linked Treasury Gilt 2034",isin:"GB00B46CGH68",type:"il3",coupon:.75,maturity:"2034-03-22",dmoDate:"2026-10-16",tidm:"TRTQ",cleanPrice:93.56,yield:.01682,yieldKind:"real",baseRpi:232.22903,indexRatio:1.81059},{name:"4¼% Treasury Gilt 2034",isin:"GB00BQC82C90",type:"conventional",coupon:4.25,maturity:"2034-07-31",dmoDate:"2026-10-16",tidm:"TS34",cleanPrice:94.12,yield:.05243,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4½% Treasury Gilt 2034",isin:"GB00B52WS153",type:"conventional",coupon:4.5,maturity:"2034-09-07",dmoDate:"2026-10-16",tidm:"TR34",cleanPrice:95.78,yield:.05223,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"2% Index-linked Treasury Stock 2035",isin:"GB0031790826",type:"il8",coupon:2,maturity:"2035-01-26",dmoDate:"2026-10-16",tidm:"T2IL",cleanPrice:241.88,yield:null,yieldKind:"real",baseRpi:173.6,indexRatio:null},{name:"4½% Treasury Gilt 2035",isin:"GB00BT7J0027",type:"conventional",coupon:4.5,maturity:"2035-03-07",dmoDate:"2026-10-16",tidm:"T35",cleanPrice:95.03,yield:.05308,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 5/8% Treasury Gilt 2035",isin:"GB00BMGR2916",type:"conventional",coupon:.625,maturity:"2035-07-31",dmoDate:"2026-10-16",tidm:"TG35",cleanPrice:67.83,yield:.05308,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1 1/8% Index-linked Treasury Gilt 2035",isin:"GB00BT7HZZ68",type:"il3",coupon:1.125,maturity:"2035-09-22",dmoDate:"2026-10-16",tidm:"TR35",cleanPrice:94.09,yield:.01854,yieldKind:"real",baseRpi:390.88065,indexRatio:1.0757},{name:"4¾% Treasury Gilt 2035",isin:"GB00BTXS1K06",type:"conventional",coupon:4.75,maturity:"2035-10-22",dmoDate:"2026-10-16",tidm:"T35V",cleanPrice:96.21,yield:.05354,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4¼% Treasury Stock 2036",isin:"GB0032452392",type:"conventional",coupon:4.25,maturity:"2036-03-07",dmoDate:"2026-10-16",tidm:"T4Q",cleanPrice:92.34,yield:.05365,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 7/8% Treasury Gilt 2036",isin:"GB00BWBR1N39",type:"conventional",coupon:4.875,maturity:"2036-07-31",dmoDate:"2026-10-16",tidm:"T36N",cleanPrice:96.45,yield:.05416,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2036",isin:"GB00BYZW3J87",type:"il3",coupon:.125,maturity:"2036-11-22",dmoDate:"2026-10-16",tidm:"TG36",cleanPrice:83.13,yield:.01985,yieldKind:"real",baseRpi:260.01935,indexRatio:1.61708},{name:"4 5/8% Green Gilt 2037",isin:"GB00BVP99905",type:"conventional",coupon:4.625,maturity:"2037-03-07",dmoDate:"2026-10-16",tidm:"T37H",cleanPrice:93.96,yield:.05464,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1¾% Treasury Gilt 2037",isin:"GB00BZB26Y51",type:"conventional",coupon:1.75,maturity:"2037-09-07",dmoDate:"2026-10-16",tidm:"TG37",cleanPrice:70.11,yield:.05492,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1 1/8% Index-linked Treasury Gilt 2037",isin:"GB00B1L6W962",type:"il3",coupon:1.125,maturity:"2037-11-22",dmoDate:"2026-10-16",tidm:"TR37",cleanPrice:90.73,yield:.02074,yieldKind:"real",baseRpi:202.24286,indexRatio:2.07904},{name:"3¾% Treasury Gilt 2038",isin:"GB00BQC4R999",type:"conventional",coupon:3.75,maturity:"2038-01-29",dmoDate:"2026-10-16",tidm:"TG38",cleanPrice:85.71,yield:.05537,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1¾% Index-linked Treasury Gilt 2038",isin:"GB00BMY62Z61",type:"il3",coupon:1.75,maturity:"2038-09-22",dmoDate:"2026-10-16",tidm:"T38",cleanPrice:95.955,yield:.02147,yieldKind:"real",baseRpi:397.6,indexRatio:1.05752},{name:"4¾% Treasury Stock 2038",isin:"GB00B00NY175",type:"conventional",coupon:4.75,maturity:"2038-12-07",dmoDate:"2026-10-16",tidm:"TR38",cleanPrice:93.46,yield:.0557,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1 1/8% Treasury Gilt 2039",isin:"GB00BLPK7334",type:"conventional",coupon:1.125,maturity:"2039-01-31",dmoDate:"2026-10-16",tidm:"TR39",cleanPrice:61.29,yield:.05574,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2039",isin:"GB00BLH38265",type:"il3",coupon:.125,maturity:"2039-03-22",dmoDate:"2026-10-16",tidm:"TG39",cleanPrice:77.27,yield:.02241,yieldKind:"real",baseRpi:296.72581,indexRatio:1.41704},{name:"4¼% Treasury Gilt 2039",isin:"GB00B3KJDS62",type:"conventional",coupon:4.25,maturity:"2039-09-07",dmoDate:"2026-10-16",tidm:"T39",cleanPrice:88.21,yield:.05618,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 3/8% Treasury Gilt 2040",isin:"GB00BQC82D08",type:"conventional",coupon:4.375,maturity:"2040-01-31",dmoDate:"2026-10-16",tidm:"TG40",cleanPrice:88.79,yield:.05658,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 5/8% Index-linked Treasury Gilt 2040",isin:"GB00B3LZBF68",type:"il3",coupon:.625,maturity:"2040-03-22",dmoDate:"2026-10-16",tidm:"TR40",cleanPrice:80.98,yield:.02289,yieldKind:"real",baseRpi:216.52258,indexRatio:1.94193},{name:"4¼% Treasury Gilt 2040",isin:"GB00B6460505",type:"conventional",coupon:4.25,maturity:"2040-12-07",dmoDate:"2026-10-16",tidm:"T40",cleanPrice:87.03,yield:.05666,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"5¼% Treasury Gilt 2041",isin:"GB00BVP99897",type:"conventional",coupon:5.25,maturity:"2041-01-31",dmoDate:"2026-10-16",tidm:"T41F",cleanPrice:96.38,yield:.057,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2041",isin:"GB00BGDYHF49",type:"il3",coupon:.125,maturity:"2041-08-10",dmoDate:"2026-10-16",tidm:"T41",cleanPrice:72.76,yield:.02319,yieldKind:"real",baseRpi:280.05484,indexRatio:1.50139},{name:"1¼ % Treasury Gilt 2041",isin:"GB00BJQWYH73",type:"conventional",coupon:1.25,maturity:"2041-10-22",dmoDate:"2026-10-16",tidm:"TG41",cleanPrice:55.98,yield:.05712,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 5/8% Index-linked Treasury Gilt 2042",isin:"GB00B3MYD345",type:"il3",coupon:.625,maturity:"2042-11-22",dmoDate:"2026-10-16",tidm:"T42A",cleanPrice:76.775,yield:.02382,yieldKind:"real",baseRpi:212.46452,indexRatio:1.97902},{name:"4½% Treasury Gilt 2042",isin:"GB00B1VWPJ53",type:"conventional",coupon:4.5,maturity:"2042-12-07",dmoDate:"2026-10-16",tidm:"T42",cleanPrice:87.63,yield:.05761,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4¾% Treasury Gilt 2043",isin:"GB00BPJJKP77",type:"conventional",coupon:4.75,maturity:"2043-10-22",dmoDate:"2026-10-16",tidm:"TR43",cleanPrice:89.32,yield:.05824,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"3¼% Treasury Gilt 2044",isin:"GB00B84Z9V04",type:"conventional",coupon:3.25,maturity:"2044-01-22",dmoDate:"2026-10-16",tidm:"TG44",cleanPrice:72.77,yield:.05842,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2044",isin:"GB00B7RN0G65",type:"il3",coupon:.125,maturity:"2044-03-22",dmoDate:"2026-10-16",tidm:"T44",cleanPrice:67.05,yield:.02476,yieldKind:"real",baseRpi:242.42258,indexRatio:1.73445},{name:"3½% Treasury Gilt 2045",isin:"GB00BN65R313",type:"conventional",coupon:3.5,maturity:"2045-01-22",dmoDate:"2026-10-16",tidm:"T45",cleanPrice:74.54,yield:.05856,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 5/8% Index-linked Treasury Gilt 2045",isin:"GB00BMF9LH90",type:"il3",coupon:.625,maturity:"2045-03-22",dmoDate:"2026-10-16",tidm:"TR45",cleanPrice:72.725,yield:.02493,yieldKind:"real",baseRpi:363.94,indexRatio:1.15533},{name:"0 7/8% Treasury Gilt 2046",isin:"GB00BNNGP775",type:"conventional",coupon:.875,maturity:"2046-01-31",dmoDate:"2026-10-16",tidm:"TG46",cleanPrice:43.22,yield:.0589,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2046",isin:"GB00BYMWG366",type:"il3",coupon:.125,maturity:"2046-03-22",dmoDate:"2026-10-16",tidm:"TR46",cleanPrice:63.525,yield:.02524,yieldKind:"real",baseRpi:257.79,indexRatio:1.63106},{name:"4¼% Treasury Gilt 2046",isin:"GB00B128DP45",type:"conventional",coupon:4.25,maturity:"2046-12-07",dmoDate:"2026-10-16",tidm:"T46",cleanPrice:81.92,yield:.05864,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1½% Treasury Gilt 2047",isin:"GB00BDCHBW80",type:"conventional",coupon:1.5,maturity:"2047-07-22",dmoDate:"2026-10-16",tidm:"TG47",cleanPrice:48.275,yield:.05911,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0¾% Index-linked Treasury Gilt 2047",isin:"GB00B24FFM16",type:"il3",coupon:.75,maturity:"2047-11-22",dmoDate:"2026-10-16",tidm:"T47",cleanPrice:71.575,yield:.02506,yieldKind:"real",baseRpi:207.76667,indexRatio:2.02377},{name:"0 1/8% Index-linked Treasury Gilt 2048",isin:"GB00BZ13DV40",type:"il3",coupon:.125,maturity:"2048-08-10",dmoDate:"2026-10-16",tidm:"TG48",cleanPrice:60.1,yield:.02527,yieldKind:"real",baseRpi:274.79333,indexRatio:1.53014},{name:"1¾% Treasury Gilt 2049",isin:"GB00BFWFPP71",type:"conventional",coupon:1.75,maturity:"2049-01-22",dmoDate:"2026-10-16",tidm:"TG49",cleanPrice:49.52,yield:.05909,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1 7/8% Index-linked Treasury Gilt 2049",isin:"GB00BT7J0134",type:"il3",coupon:1.875,maturity:"2049-09-22",dmoDate:"2026-10-16",tidm:"TR49",cleanPrice:89.32,yield:.02504,yieldKind:"real",baseRpi:391.95806,indexRatio:1.07274},{name:"4¼% Treasury Gilt 2049",isin:"GB00B39R3707",type:"conventional",coupon:4.25,maturity:"2049-12-07",dmoDate:"2026-10-16",tidm:"T49",cleanPrice:80.45,yield:.05878,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0½% Index-linked Treasury Gilt 2050",isin:"GB00B421JZ66",type:"il3",coupon:.5,maturity:"2050-03-22",dmoDate:"2026-10-16",tidm:"TR50",cleanPrice:64.425,yield:.02535,yieldKind:"real",baseRpi:213.4,indexRatio:1.97034},{name:"0 5/8% Treasury Gilt 2050",isin:"GB00BMBL1F74",type:"conventional",coupon:.625,maturity:"2050-10-22",dmoDate:"2026-10-16",tidm:"TG50",cleanPrice:33.18,yield:.05915,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2051",isin:"GB00BNNGP882",type:"il3",coupon:.125,maturity:"2051-03-22",dmoDate:"2026-10-16",tidm:"TG51",cleanPrice:56.57,yield:.02531,yieldKind:"real",baseRpi:294.11071,indexRatio:1.42964},{name:"1¼% Treasury Gilt 2051",isin:"GB00BLH38158",type:"conventional",coupon:1.25,maturity:"2051-07-31",dmoDate:"2026-10-16",tidm:"T51A",cleanPrice:40.07,yield:.05953,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0¼% Index-linked Treasury Gilt 2052",isin:"GB00B73ZYW09",type:"il3",coupon:.25,maturity:"2052-03-22",dmoDate:"2026-10-16",tidm:"TG52",cleanPrice:57.72,yield:.02525,yieldKind:"real",baseRpi:242.05,indexRatio:1.73712},{name:"3¾% Treasury Gilt 2052",isin:"GB00B6RNH572",type:"conventional",coupon:3.75,maturity:"2052-07-22",dmoDate:"2026-10-16",tidm:"T52",cleanPrice:72.6,yield:.05899,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1½% Green Gilt 2053",isin:"GB00BM8Z2V59",type:"conventional",coupon:1.5,maturity:"2053-07-31",dmoDate:"2026-10-16",tidm:"TG53",cleanPrice:41.405,yield:.05949,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"3¾% Treasury Gilt 2053",isin:"GB00BPCJD997",type:"conventional",coupon:3.75,maturity:"2053-10-22",dmoDate:"2026-10-16",tidm:"T53",cleanPrice:71.74,yield:.05928,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 3/8% Treasury Gilt 2054",isin:"GB00BPSNBB36",type:"conventional",coupon:4.375,maturity:"2054-07-31",dmoDate:"2026-10-16",tidm:"T54",cleanPrice:79.91,yield:.05931,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1 5/8% Treasury Gilt 2054",isin:"GB00BJLR0J16",type:"conventional",coupon:1.625,maturity:"2054-10-22",dmoDate:"2026-10-16",tidm:"TR54",cleanPrice:42.305,yield:.05913,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1¼% Index-linked Treasury Gilt 2054",isin:"GB00BPSNBG80",type:"il3",coupon:1.25,maturity:"2054-11-22",dmoDate:"2026-10-16",tidm:"TG54",cleanPrice:75.3,yield:.0249,yieldKind:"real",baseRpi:378.58065,indexRatio:1.11065},{name:"1¼% Index-linked Treasury Gilt 2055",isin:"GB00B0CNHZ09",type:"il3",coupon:1.25,maturity:"2055-11-22",dmoDate:"2026-10-16",tidm:"TR8F",cleanPrice:75.07,yield:.02469,yieldKind:"real",baseRpi:192.2,indexRatio:2.18767},{name:"4¼% Treasury Gilt 2055",isin:"GB00B06YGN05",type:"conventional",coupon:4.25,maturity:"2055-12-07",dmoDate:"2026-10-16",tidm:"TR4Q",cleanPrice:78.25,yield:.0589,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"5 3/8% Treasury Gilt 2056",isin:"GB00BT7J0241",type:"conventional",coupon:5.375,maturity:"2056-01-31",dmoDate:"2026-10-16",tidm:"T56",cleanPrice:93.81,yield:.05902,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-Linked Treasury Gilt 2056",isin:"GB00BYVP4K94",type:"il3",coupon:.125,maturity:"2056-11-22",dmoDate:"2026-10-16",tidm:"TR56",cleanPrice:51.325,yield:.02422,yieldKind:"real",baseRpi:264.88333,indexRatio:1.58738},{name:"1¾% Treasury Gilt 2057",isin:"GB00BD0XH204",type:"conventional",coupon:1.75,maturity:"2057-07-22",dmoDate:"2026-10-16",tidm:"TG57",cleanPrice:42.24,yield:.05878,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2058",isin:"GB00BP9DLZ64",type:"il3",coupon:.125,maturity:"2058-03-22",dmoDate:"2026-10-16",tidm:"T58",cleanPrice:50.415,yield:.02386,yieldKind:"real",baseRpi:255.8871,indexRatio:1.64319},{name:"4% Treasury Gilt 2060",isin:"GB00B54QLM75",type:"conventional",coupon:4,maturity:"2060-01-22",dmoDate:"2026-10-16",tidm:"TR60",cleanPrice:74.01,yield:.05847,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0½% Treasury Gilt 2061",isin:"GB00BMBL1D50",type:"conventional",coupon:.5,maturity:"2061-10-22",dmoDate:"2026-10-16",tidm:"TG61",cleanPrice:22.735,yield:.05568,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 3/8% Index-linked Treasury Gilt 2062",isin:"GB00B4PTCY75",type:"il3",coupon:.375,maturity:"2062-03-22",dmoDate:"2026-10-16",tidm:"T62",cleanPrice:53.73,yield:.02301,yieldKind:"real",baseRpi:235.82903,indexRatio:1.78295},{name:"4% Treasury Gilt 2063",isin:"GB00BMF9LF76",type:"conventional",coupon:4,maturity:"2063-10-22",dmoDate:"2026-10-16",tidm:"TR63",cleanPrice:73.37,yield:.05826,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"2½% Treasury Gilt 2065",isin:"GB00BYYMZX75",type:"conventional",coupon:2.5,maturity:"2065-07-22",dmoDate:"2026-10-16",tidm:"TG65",cleanPrice:50.49,yield:.0575,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2065",isin:"GB00BD9MZZ71",type:"il3",coupon:.125,maturity:"2065-11-22",dmoDate:"2026-10-16",tidm:"TR65",cleanPrice:46.085,yield:.02194,yieldKind:"real",baseRpi:260.43448,indexRatio:1.6145},{name:"0 1/8% Index-linked Treasury Gilt 2068",isin:"GB00BDX8CX86",type:"il3",coupon:.125,maturity:"2068-03-22",dmoDate:"2026-10-16",tidm:"T68",cleanPrice:45.19,yield:.0213,yieldKind:"real",baseRpi:249.7,indexRatio:1.6839},{name:"3½% Treasury Gilt 2068",isin:"GB00BBJNQY21",type:"conventional",coupon:3.5,maturity:"2068-07-22",dmoDate:"2026-10-16",tidm:"TR68",cleanPrice:65.64,yield:.05731,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1 5/8% Treasury Gilt 2071",isin:"GB00BFMCN652",type:"conventional",coupon:1.625,maturity:"2071-10-22",dmoDate:"2026-10-16",tidm:"TG71",cleanPrice:36.37,yield:.05482,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2073",isin:"GB00BM8Z2W66",type:"il3",coupon:.125,maturity:"2073-03-22",dmoDate:"2026-10-16",tidm:"TG73",cleanPrice:47.6,yield:.018,yieldKind:"real",baseRpi:308.32,indexRatio:1.36375},{name:"1 1/8% Treasury Gilt 2073",isin:"GB00BLBDX619",type:"conventional",coupon:1.125,maturity:"2073-10-22",dmoDate:"2026-10-16",tidm:"TR73",cleanPrice:28.445,yield:.05297,yieldKind:"nominal",baseRpi:null,indexRatio:null}]},q=t=>Number.isFinite(+t)?+t:0,Me=t=>String(t||"").toUpperCase().trim(),Vt=t=>"£"+Math.round(q(t)).toLocaleString("en-GB"),lg=t=>{const e=new Date(String(t).slice(0,10)+"T00:00:00Z");return Number.isNaN(e.getTime())?String(t):e.toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"})},cg=.02,ug=new Set(["CSH2","CASH","MMF","XSTR","ERNS","ERNX"]),dg=new Set((Array.isArray(Kn==null?void 0:Kn.gilts)?Kn.gilts:[]).map(t=>Me(t&&t.tidm)).filter(Boolean));function hg(t){const e=Me(t);return dg.has(e)||/^T[RGNS]?\d{2}[A-Z]?$/.test(e)||/^GB00B/.test(e)}function Ir(t,e){var s,r;if(+(e==null?void 0:e.firstTaxYear)>0)return+e.firstTaxYear;if(+((s=t.timing)==null?void 0:s.firstTaxYear)>0)return+t.timing.firstTaxYear;if(+((r=t.assumptions)==null?void 0:r.firstTaxYear)>0)return+t.assumptions.firstTaxYear;const n=[...Array.isArray(e==null?void 0:e.cashYears)?e.cashYears.map(i=>+i.Y):[],...Array.isArray(e==null?void 0:e.orders)?e.orders.flatMap(i=>Array.isArray(i.taxYears)?i.taxYears.map(Number):[]):[]].filter(i=>i>2e3);return n.length?Math.min(...n):null}function So(t,e=new Date){var o,l,a;const n=t||{},s=(l=(o=n.strategy)==null?void 0:o.r)==null?void 0:l.plan,r=Ir(n,s);if(!(r>0)||we(e)<r)return!1;const i=(a=n.timing)==null?void 0:a.startMonth;return typeof i=="string"&&/^\d{4}-\d{2}$/.test(i)?e.getFullYear()+"-"+String(e.getMonth()+1).padStart(2,"0")>=i:!0}function fg(t,{today:e=new Date,params:n=null,runUpMonthly:s=0}={}){var c,u,d,f,m,g,h,_,E,w,y,p,A;const r=t||{},i=(u=(c=r.strategy)==null?void 0:c.r)==null?void 0:u.plan,o=we(e);if((d=r.strategy)!=null&&d.contract&&i&&Array.isArray(i.orders)){const v=Ir(r,i),b=So(r,e),S=L=>({key:"gilt:"+Me(L.tidm||L.sedol||L.name),wrapper:"SIPP",kind:"gilt",label:L.name,ticker:Me(L.tidm),sedol:L.sedol||null,matures:L.matures||null,units:Math.round(q(L.nominal)),cost:Math.round(q(L.cost)),pays:Math.round(q(L.pays)),taxYears:Array.isArray(L.taxYears)?L.taxYears.slice():[],cleanPrice:q(L.cleanPrice)||null,indexRatio:q(L.indexRatio)||null}),T=i.orders.filter(L=>q(L.pays)>0),R=L=>{const O=L.matures?Date.parse(L.matures):NaN;return Number.isFinite(O)?O<e.getTime():Array.isArray(L.taxYears)&&L.taxYears.length>0&&L.taxYears.every(ne=>+ne<o)},k=n&&n.borrowedFloor||((m=(f=r.strategy)==null?void 0:f.params)==null?void 0:m.borrowedFloor)||((g=r.rotation)==null?void 0:g.borrowedFloor)||null,P=new Set(k&&Array.isArray(k.tidms)?k.tidms.map(Me).filter(Boolean):[]),D=L=>P.has(Me(L.tidm)),I=T.filter(L=>!D(L)),M=I.filter(L=>!R(L)).map(S),N=I.filter(R).map(S),B=T.filter(D).map(S),ue=!!k,oe=Array.isArray(i.cashYears)?i.cashYears:[],pe=oe.filter(L=>+L.Y>=o).map(L=>+L.Y),H=Math.max(0,q(((h=r.assumptions)==null?void 0:h.bridgeCash)??((E=(_=r.strategy)==null?void 0:_.params)==null?void 0:E.bridgeCash))),te=oe.reduce((L,O)=>L+q(O.cost),0),ae=te>0?te:Math.max(0,q(i.cash)-H);let nt=Math.round(ae),ve={months:0,monthly:0,value:0};if(!b&&H>0){const L=Array.isArray(r.timeline)&&r.timeline[0]?r.timeline[0]:null,O=q(s)>0?q(s):L?Math.max(0,(q(L.gross)-q(L.sp)-q(L.other))/12):0,ne=Date.UTC(v||o+1,3,6),Ee=Math.max(0,Math.round((ne-e.getTime())/(30.44*864e5)));ve={months:Ee,monthly:Math.round(O),value:Math.round(Math.min(H,O*Ee))},nt+=ve.value}b&&(Array.isArray(i.years)&&i.years.length?nt=Math.round(i.years.filter(L=>L.from==="cash"&&+L.Y>=o).reduce((L,O)=>L+q(O.need),0)):oe.length&&(nt=Math.round(ae*pe.length/oe.length)));const ln=[];ve.value>0&&ln.push({label:"Run-up: "+ve.months+" month"+(ve.months===1?"":"s")+" × "+Vt(ve.monthly)+" until the ladder pays",amount:ve.value});for(const L of oe){if(b&&+L.Y<o)continue;const O=Array.isArray(r.timeline)?r.timeline.find(Ee=>Ee&&W(+L.Y)===Ee.taxYear):null,ne=O&&q(O.lump)>0?q(O.lump):0;ln.push({label:"Cash year "+W(+L.Y)+(ne>0?" ("+Vt(ne)+" of it paid by a lump sum expected that year)":""),amount:Math.round(q(L.cost))})}const cn={key:"cash:SIPP",wrapper:"SIPP",kind:"cash",label:"Money-market fund / cash (e.g. CSH2)",value:nt,runUp:ve,breakdown:ln,spending:b,yearsLeft:b?pe:oe.map(L=>+L.Y),bridgeCash:Math.round(H)};let Ct="The ladder is bought in the SIPP. The ISA is "+(((w=r.pots)==null?void 0:w.isaPolicy)==="hold"?"held aside and not part of the ladder.":"drawn by its own policy and not part of the ladder.");return H>0&&!b&&(Ct+=ve.value>0?" The run-up is paid from the same cash: "+ve.months+" month"+(ve.months===1?"":"s")+" at about "+Vt(ve.monthly)+" are still to come, so "+Vt(ve.value)+" of the "+Vt(H)+" set aside is in the target; the rest has been spent as designed.":" The "+Vt(H)+" of bridge cash for the run-up has been spent as designed, so it is no longer a target."),b&&(Ct+=" The plan is running (tax year "+W(o)+")"+(N.length?": "+N.length+" rung"+(N.length===1?" has":"s have")+" matured and paid, so "+(N.length===1?"it is":"they are")+" no longer targets":"")+"; the cash years' money is being spent as designed, so cash is reported, not diffed."),B.length&&(Ct+=" The rotation fired"+(k.soldAt?" on "+lg(k.soldAt):"")+": "+B.length+" rung"+(B.length===1?" was":"s were")+" sold and the proceeds bought the equity fund, so "+(B.length===1?"it is no longer a target":"they are no longer targets")+" and the fund is kept."),{kind:"ladder",lines:M,paid:N,sold:B,rotated:ue,cash:cn,running:b,thisTaxYear:o,firstTaxYear:v,note:Ct}}const l=Array.isArray(r.targetMix)&&r.targetMix.length?r.targetMix[0]:null,a=q((p=(y=r.pots)==null?void 0:y.potAtRetirement)==null?void 0:p.sipp)>0?q(r.pots.potAtRetirement.sipp):q((A=r.pots)==null?void 0:A.sipp);return l&&a>0?{kind:"buckets",lines:[{key:"bucket:shares",wrapper:"SIPP",kind:"bucket",bucket:"shares",label:"Shares (world tracker)",value:Math.round(a*l.equity/100),pct:l.equity},{key:"bucket:bonds",wrapper:"SIPP",kind:"bucket",bucket:"bonds",label:"Bonds (gilts / index-linked / global agg)",value:Math.round(a*l.bond/100),pct:l.bond},{key:"bucket:cash",wrapper:"SIPP",kind:"bucket",bucket:"cash",label:"Cash (money-market fund)",value:Math.round(a*l.cash/100),pct:l.cash}],paid:[],sold:[],rotated:!1,cash:null,running:So(r,e),thisTaxYear:o,firstTaxYear:Ir(r,null),note:`A pot strategy: the target is a mix, not a list of funds. Any world tracker, gilt fund or money-market fund fills its bucket; the Stress tester's "Example funds" shows one way.`}:{kind:"none",lines:[],paid:[],sold:[],rotated:!1,cash:null,running:!1,thisTaxYear:o,firstTaxYear:null,note:"No plan document yet — lock the plan first."}}function pg(t){const e=(t||[]).filter(s=>s&&(q(s.value)>0||q(s.units)>0)),n=_r(e.map(s=>({...s,value:q(s.value)})));return e.map(s=>{const r=Me(s.ticker),i=hg(r)||s.kind==="gilt",o=ug.has(r)||Me(s.wrapper)==="CASH"||s.kind==="cash"||s.subClass==="cash"||s.subClass==="moneyMarket",l=n.tagged.find(a=>a.ticker===s.ticker&&a.wrapper===s.wrapper&&Math.abs(q(a.value)-q(s.value))<1);return{ticker:r,name:s.name||"",sedol:s.sedol||null,wrapper:Me(s.wrapper)||"SIPP",value:q(s.value),units:q(s.units)||null,gilt:i,cash:o,bucket:o?"cash":i?"bonds":l?l.bucket:s.subClass?"shares":null}})}function mg(t,e,{tolerance:n=cg}={}){const s=pg(t),r=s.filter(v=>v.wrapper==="SIPP"),i=v=>v.wrapper==="ISA"?"ISA — kept as it is":v.wrapper==="CASH"?"bank / savings cash — outside the pension, kept as it is":"taxable account — kept as it is",o=[],l=[],a=[],c=[],u=[],d=s.filter(v=>v.wrapper!=="SIPP").map(v=>({...v,why:i(v)}));let f=0,m=0,g=0,h=0,_=0,E=null;if(e.kind==="ladder"){const v=new Set,b=I=>{const M=String(I||"").match(/(20\d{2})/);if(M)return+M[1];const N=String(I||"").match(/^T[RGNS]?(\d{2})[A-Z]?$/i);return N?2e3+ +N[1]:null},S=(I,M)=>I.ticker&&M.ticker&&I.ticker===M.ticker||M.sedol&&(Me(I.sedol)===Me(M.sedol)||Me(I.name).includes(Me(M.sedol))),T=(I,M,N)=>I.ticker&&I.ticker.length>=3&&M.label&&Me(M.label).includes(I.ticker)||N&&(b(I.name)===N||b(I.ticker)===N),R=[...e.paid||[],...e.sold||[],...e.lines],k=new Map,P=(I,M)=>{const N=r.filter(B=>!v.has(B)&&B.gilt&&M(B));N.forEach(B=>v.add(B)),k.set(I,N)};for(const I of R)P(I,M=>S(M,I));for(const I of R)if(!k.get(I).length){const M=b(I.matures)||b(I.label)||b(I.ticker);P(I,N=>T(N,I,M))}const D=I=>k.get(I)||[];for(const I of e.paid||[])for(const M of D(I))c.push({...M,key:"matured:"+(M.ticker||I.ticker),label:M.name||M.ticker||I.label,rung:I.label,why:"matured and paid"+(I.taxYears.length?" in "+I.taxYears.map(W).join(", "):"")+" — remove it from your record"});for(const I of e.sold||[])for(const M of D(I))u.push({...M,key:"sold:"+(M.ticker||I.ticker),label:M.name||M.ticker||I.label,rung:I.label,why:"sold by the rotation — remove it from your record"});for(const I of e.lines){const M=D(I),N=I.cleanPrice&&I.indexRatio?I.cleanPrice*I.indexRatio/100:I.units>0?I.cost/I.units:null,B=M.reduce((oe,pe)=>oe+(pe.units!=null?pe.units:N?pe.value/N:0),0),ue=I.units-B;f+=I.cost,m+=Math.min(I.cost,N?B*N:0),g++,I.units>0&&Math.abs(ue)<=n*I.units?a.push({...I,heldUnits:Math.round(B)}):ue>0?o.push({...I,units:Math.round(ue),amount:Math.round(N?ue*N:I.cost*(ue/I.units)),heldUnits:Math.round(B),why:"rung for "+I.taxYears.map(W).join(", ")}):l.push({...I,units:Math.round(-ue),amount:Math.round(N?-ue*N:0),heldUnits:Math.round(B),why:"more than the rung needs"})}h=r.filter(I=>I.cash).reduce((I,M)=>I+M.value,0),_=e.cash?e.cash.value:0,e.cash&&e.cash.spending?E={held:Math.round(h),target:Math.round(_),yearsLeft:Array.isArray(e.cash.yearsLeft)?e.cash.yearsLeft.slice():[]}:e.cash&&(f+=_,m+=Math.min(_,h),_>0&&g++,_>0&&h>=_*(1-n)?a.push({...e.cash,heldValue:Math.round(h),spare:Math.round(Math.max(0,h-_))}):_>h&&o.push({...e.cash,amount:Math.round(_-h),heldValue:Math.round(h),why:"the cash years"}));for(const I of r)!v.has(I)&&!I.cash&&(e.rotated&&!I.gilt?d.push({...I,why:"bought by the rotation — kept"}):l.push({key:"sell:"+(I.ticker||I.name),wrapper:"SIPP",kind:I.gilt?"gilt":"fund",label:I.name||I.ticker,ticker:I.ticker,amount:Math.round(I.value),units:I.units,why:"not in the plan — proceeds fund the ladder"}))}else if(e.kind==="buckets"){const v={shares:0,bonds:0,cash:0,diversifiers:0};for(const b of r)v[b.bucket||"shares"]+=b.value;h=v.cash;for(const b of e.lines){const S=v[b.bucket]||0,T=b.value-S;f+=b.value,m+=Math.min(b.value,S),b.value>0&&g++,b.bucket==="cash"&&(_=b.value),b.value>0&&Math.abs(T)<=n*b.value?a.push({...b,heldValue:Math.round(S)}):T>0?o.push({...b,amount:Math.round(T),heldValue:Math.round(S),why:"bring "+b.bucket+" up to "+b.pct+"% of the pot"}):(b.value>0||S>0)&&l.push({...b,amount:Math.round(-T),heldValue:Math.round(S),why:"bring "+b.bucket+" down to "+b.pct+"% of the pot"})}v.diversifiers>0&&l.push({key:"bucket:diversifiers",wrapper:"SIPP",kind:"bucket",bucket:"diversifiers",label:"Diversifiers",amount:Math.round(v.diversifiers),why:"not in the target mix"})}const w=o.reduce((v,b)=>v+q(b.amount),0),y=l.reduce((v,b)=>v+q(b.amount),0);let p=!1,A;return e.kind==="none"?A="no plan document to read against":o.length?A=o.length+" line"+(o.length===1?"":"s")+" still to buy":l.length?A=l.length+" line"+(l.length===1?"":"s")+" to sell":a.length<g?A=g-a.length+" target line"+(g-a.length===1?"":"s")+" not held":g===0?(p=!0,A=e.kind==="ladder"?"every rung has matured and paid — nothing left to hold":"the target is empty"):(p=!0,A=e.kind==="ladder"?"every rung the plan still needs is held"+(e.cash&&!e.cash.spending?", and the cash years are covered":""):"every bucket is within "+Math.round(n*100)+"% of its target"),{kind:e.kind,buy:o,sell:l,hold:a,keep:d,matured:c,sold:u,cashInfo:E,totals:{buyCost:Math.round(w),sellValue:Math.round(y),shortfall:Math.round(Math.max(0,w-y)),cashHeld:Math.round(h),cashTarget:Math.round(_)},progressPct:f>0?Math.round(100*m/f):p?100:0,complete:p,reason:A}}function gg(t,e={}){const n=[...t.buy.map(i=>({...i,action:"buy"})),...t.sell.map(i=>({...i,action:"sell"}))],s=n.filter(i=>!e[i.key]),r=n.length-s.length;return{pct:n.length?Math.round(100*(t.progressPct/100*0+(n.length-s.length)/n.length)):100,held:t.progressPct,doneCount:r,total:n.length,next:s[0]||null}}function yg(){return{settings:{equityMin:fe.EQUITY_MIN,bondMin:fe.BOND_MIN,cashTarget:fe.CASH_TARGET,duration:fe.DURATION_YEARS,baseSalary:fe.BASE_SALARY,other:0,statePension:12e3,statePensionYear:12,pa:Te.PERSONAL_ALLOWANCE,brl:Te.BASIC_RATE_LIMIT,hrl:Te.HIGHER_RATE_LIMIT,taxMode:"inflates",protectionMult:Ge.PROTECTION_MULTIPLIER,consecutiveLimit:fe.CONSECUTIVE_LIMIT,disableProtection:!1,hodlEnabled:Ge.HODL_ENABLED,hodlValue:Ge.HODL_VALUE,spendingProfile:"flat",equityGlideEnabled:!1,diversifierStart:0,taggedFunds:[]},lastModified:null,checksum:null}}function Ag(t,e=new Date){const n={...yg()};t.settings&&(n.settings={...n.settings,...t.settings},t.settings.pacwMin!==void 0&&t.settings.equityMin===void 0&&(n.settings.equityMin=t.settings.pacwMin),t.settings.cgtMin!==void 0&&t.settings.bondMin===void 0&&(n.settings.bondMin=t.settings.cgtMin),t.settings.csh2Target!==void 0&&t.settings.cashTarget===void 0&&(n.settings.cashTarget=t.settings.csh2Target),n.settings.hodlEnabled===void 0&&(n.settings.hodlEnabled=!1),n.settings.hodlValue===void 0&&(n.settings.hodlValue=25e3));const s=n.settings;if(s.spendingProfile==="declining"){const r=+s.shapeAgeNow||57,i=s.incomeShape==="phases"&&Array.isArray(s.incomeSteps)&&s.incomeSteps.length?s.incomeSteps:[{fromAge:r,amount:+s.baseSalary||0}];s.incomeShape="phases",s.incomeSteps=uc(i,r),s.shapeAgeNow=r,s.targetSchedule=dc(s,r),s.spendingProfile="flat",s.spendingMigratedFrom="declining"}return n.settings=bm(n.settings,t.budget||null,e),n.lastModified=t.lastModified,n.checksum=t.checksum,n}const vg=t=>t===void 0?void 0:JSON.parse(JSON.stringify(t)),_g=t=>!!(t&&t.decisionTool&&en(t.decisionTool.settings));function bg(t){const e=t&&t.stressTool&&t.stressTool.settings;return e&&typeof e=="object"?vg(e):t&&!_g(t)?{...vr(),chargesPct:ea,isaGrowth:ta}:vr()}function Ls(t,{now:e=new Date}={}){const n=bg(t),s=t&&t.budgetTool&&t.budgetTool.settings||lc();return s&&cc(s)&&+s.currentAge>(+n.currentAge||0)&&(n.currentAge=+s.currentAge,n.currentAgeAsOf=s.currentAgeAsOf||n.currentAgeAsOf||null),Ag({settings:n,budget:s||null,lastModified:null,checksum:null},e).settings}function Tg(t,{now:e=new Date}={}){const n=t||{},s=Ls(n,{now:e});return Ym({...n,stressTool:{...n.stressTool||{},settings:s}},e)}function Sg(t=new Date){return t.getFullYear()+"-"+String(t.getMonth()+1).padStart(2,"0")}function Vs(t,e=500){return(Array.isArray(t&&t.decisionTool&&t.decisionTool.history)?t.decisionTool.history:[]).filter(s=>s&&typeof s=="object").slice().sort((s,r)=>String(s.date||"").localeCompare(String(r.date||""))).slice(-e)}function Vl(t,{now:e=new Date}={}){const n=t||{},s=n.planDocument||null,r=Vs(n);let i=null;if(s&&s.strategy&&s.strategy.contract){const c=To(s,s.strategy.id||null);i=c?og(c,{today:e}):null}const o=s&&s.accumulation&&Array.isArray(n.accumulationTool&&n.accumulationTool.history)?n.accumulationTool.history:[],l=on(n.holdings),a=n.decisionTool&&n.decisionTool.taxYears||null;return{today:e,history:r,ladderPos:i,accHistory:o,holdings:l,taxYears:a,ladderInDocument:!!(s&&To(s,s.strategy&&s.strategy.id||null))}}function wg(t,{now:e=new Date}={}){const n=t&&t.planDocument;if(!n)return null;const{ladderInDocument:s,...r}=Vl(t,{now:e});return sg(n,r)}function Ig(t,{now:e=new Date}={}){const n=t||{},s=n.planDocument||null;if(!s)return null;const r=Ls(n,{now:e});let i=0;const o=li(we(e)),l=n.decisionTool&&n.decisionTool.taxYears&&n.decisionTool.taxYears[o];if(i=+(l&&l.expectedMonthly&&l.expectedMonthly.sipp&&l.expectedMonthly.sipp.gross)||0,!i){const m=Vs(n),g=m.length?m[m.length-1]:null;i=g&&(+g.sippDraw||+g.sipp)||0}const a=fg(s,{today:e,params:r.strategyParams||null,runUpMonthly:i}),c=on(n.holdings),u=mg(c.lines||[],a),d=n.transition&&n.transition.done||{},f=gg(u,d);return{target:a,diff:u,prog:f}}const wo=Object.freeze({unknown:["plan","budget","hold","household"],saving:["saving","pot","plan","budget","lock","hold","household"],approaching:["plan","saving","pot","budget","lock","hold","move","household"],"committed-saving":["pot","where","plan","saving","budget","hold","move","household"],"draft-retired":["plan","budget","lock","hold","move","household"],bridge:["month","where","plan","hold","move","budget","household"],running:["month","where","plan","hold","move","budget","household"]}),Eg=Object.freeze(["pot","budget","lock","hold","move","household"]),kg=Object.freeze(["month","where","plan","pot","saving","budget","lock","hold","move","household"]),Io=Object.freeze(["draft-retired","bridge","running"]),Bl=Object.freeze(["saving","approaching","committed-saving"]),Pg=Object.freeze(["P.readonly","P.noAge","P.arrive","P.taxyear","P.month","P.idle","P.pot","P.working","P.recheck","P.stale","P.draft","P.approaching","P.saving"]),Rg=Object.freeze({plan:Object.freeze(["about","income","spend"])});function Mg(t,e){return Fl(t,e).flatMap(n=>(Rg[n.id]||[]).map(s=>({id:s,under:n.id})))}function Fl(t,{locked:e,linked:n,manyPlans:s}){return(wo[t]||wo.unknown).filter(i=>!(i==="lock"&&e)&&!(i==="household"&&!n&&!s)).map(i=>({id:i,optional:Eg.includes(i)&&!(i==="pot"&&t==="committed-saving")}))}const z=t=>t==null||t===""||!Number.isFinite(+t)?null:+t,rt=t=>Array.isArray(t)?t.filter(e=>e&&typeof e=="object"):[],Oe=(t,e)=>({k:t,v:Math.round(z(e)||0),kind:"money"}),Le=(t,e)=>({k:t,v:Math.round(z(e)||0),kind:"count"}),Zs=(t,e)=>({k:t,v:Math.round((z(e)||0)*100)/100,kind:"pct"}),Ve=(t,e)=>({k:t,v:!!e,kind:"yesNo"}),Tt=(t,e)=>({k:t,v:String(e),kind:"choice"}),hn=(t,e)=>({k:t,v:String(e),kind:"text"}),Og=["January","February","March","April","May","June","July","August","September","October","November","December"],Dg=t=>{const e=/^(\d{4})-(\d{2})-(\d{2})/.exec(String(t||""));return e&&+e[2]>=1&&+e[2]<=12?+e[3]+" "+Og[+e[2]-1]+" "+e[1]:String(t||"")},er=(t,e)=>hn(t,Dg(e)),Ng=Object.freeze([{id:"inc.streams",keys:["stress.extraIncomes"],set:t=>rt(t.extraIncomes).some(e=>z(e.annual)>0),facts:t=>rt(t.extraIncomes).filter(e=>z(e.annual)>0).flatMap((e,n)=>[Oe("annual"+n,e.annual),Le("fromAge"+n,e.fromAge),Le("years"+n,e.years)])},{id:"inc.lump-sums",keys:["stress.windfalls","decision.windfalls"],set:t=>rt(t.windfalls).some(e=>z(e.amount)>0),facts:t=>rt(t.windfalls).filter(e=>z(e.amount)>0).flatMap((e,n)=>[Oe("amount"+n,e.amount),Le("atAge"+n,e.atAge??e.fromAge??e.age)])},{id:"inc.extra-spends",keys:["stress.extraWithdrawals"],set:t=>rt(t.extraWithdrawals).some(e=>z(e.amount)>0),facts:t=>rt(t.extraWithdrawals).filter(e=>z(e.amount)>0).flatMap((e,n)=>[Oe("amount"+n,e.amount),Le("atAge"+n,e.atAge??e.fromAge??e.age),Le("years"+n,e.years??1)])},{id:"inc.final-salary-rises",keys:["stress.dbIndexation"],set:t=>z(t.dbAmount)>0&&!!t.dbIndexation&&t.dbIndexation!=="cpi",facts:t=>[Tt("rises",t.dbIndexation||"cpi")]},{id:"inc.state-pension-old",keys:["stress.statePension","stress.statePensionYear","decision.statePension","decision.statePensionYear"],set:t=>!t.spStartDate&&z(t.statePension)>0,facts:t=>[Oe("yearly",t.statePension),Le("fromYear",t.statePensionYear)]},{id:"tax.bands",keys:["stress.pa","stress.brl","stress.hrl"],set:t=>(z(t.pa)??Te.PERSONAL_ALLOWANCE)!==Te.PERSONAL_ALLOWANCE||(z(t.brl)??Te.BASIC_RATE_LIMIT)!==Te.BASIC_RATE_LIMIT||(z(t.hrl)??Te.HIGHER_RATE_LIMIT)!==Te.HIGHER_RATE_LIMIT,facts:t=>[Oe("pa",t.pa??Te.PERSONAL_ALLOWANCE),Oe("brl",t.brl??Te.BASIC_RATE_LIMIT),Oe("hrl",t.hrl??Te.HIGHER_RATE_LIMIT)]},{id:"tax.mode",keys:["stress.taxMode"],set:t=>!!t.taxMode&&t.taxMode!=="inflates",facts:t=>[Tt("mode",t.taxMode||"inflates")]},{id:"tax.tax-free-cash",keys:["stress.accessMethod","decision.accessMethod"],set:(t,e)=>!!(t.accessMethod||e.accessMethod)&&(t.accessMethod||e.accessMethod)!=="drawdown",facts:(t,e)=>[Tt("how",t.accessMethod||e.accessMethod||"drawdown")]},{id:"tax.ufpls-years",keys:["stress.ufplsYears","stress.ufplsThenPcls","decision.ufplsYears","decision.ufplsThenPcls"],set:(t,e)=>z(t.ufplsYears??e.ufplsYears)>0,facts:(t,e)=>[Le("years",t.ufplsYears??e.ufplsYears),Ve("thenRest",t.ufplsThenPcls??e.ufplsThenPcls)]},{id:"tax.band-fill",keys:["stress.bandFillRecycle","decision.bandFillRecycle"],set:(t,e)=>!!(t.bandFillRecycle??e.bandFillRecycle),facts:(t,e)=>[Ve("on",t.bandFillRecycle??e.bandFillRecycle)]},{id:"tax.bed-and-isa",keys:["stress.bedAndIsa","decision.bedAndIsa"],set:(t,e)=>!!(t.bedAndIsa??e.bedAndIsa),facts:(t,e)=>[Ve("on",t.bedAndIsa??e.bedAndIsa)]},{id:"tax.earnings",keys:["stress.relevantEarnings","decision.relevantEarnings"],set:(t,e)=>z(t.relevantEarnings??e.relevantEarnings)>0,facts:(t,e)=>[Oe("yearly",t.relevantEarnings??e.relevantEarnings)]},{id:"prot.cuts",keys:["stress.consecutiveLimit","stress.protectionMult","stress.protectionEscalateMonths","stress.recoveryBuffer","stress.disableProtection","decision.consecutiveLimit","decision.protectionFactor","decision.protectionEscalateMonths","decision.recoveryBuffer","decision.disableProtection"],set:t=>!!t.disableProtection||(z(t.consecutiveLimit)??fe.CONSECUTIVE_LIMIT)!==fe.CONSECUTIVE_LIMIT||(z(t.protectionMult)??Ge.PROTECTION_MULTIPLIER)!==Ge.PROTECTION_MULTIPLIER||(z(t.recoveryBuffer)??fe.RECOVERY_BUFFER)!==fe.RECOVERY_BUFFER||z(t.protectionEscalateMonths)>0,facts:t=>[Ve("off",!!t.disableProtection),Le("after",t.consecutiveLimit??fe.CONSECUTIVE_LIMIT),Zs("cutTo",(z(t.protectionMult)??Ge.PROTECTION_MULTIPLIER)*100),Le("deeperAfter",t.protectionEscalateMonths??0),Oe("buffer",t.recoveryBuffer??fe.RECOVERY_BUFFER)]},{id:"prot.reserve",keys:["stress.hodlEnabled","stress.hodlValue"],set:t=>!!t.hodlEnabled,facts:t=>[Ve("on",!!t.hodlEnabled),Oe("amount",t.hodlValue??Ge.HODL_VALUE)]},{id:"pots.diversifiers",keys:["stress.diversifierStart","decision.diversifierStart"],set:t=>z(t.diversifierStart)>0,facts:t=>[Oe("amount",t.diversifierStart)]},{id:"pots.bond-tent",keys:["stress.equityGlideEnabled","decision.equityGlideEnabled","stress.glideEndgame","decision.glideEndgame"],set:t=>!!t.equityGlideEnabled,facts:t=>[Ve("on",!!t.equityGlideEnabled),Tt("endgame",t.glideEndgame||"hold")]},{id:"pots.isa-use",keys:["stress.isaDrawdownStrategy","decision.isaDrawdownStrategy"],set:t=>!!t.isaDrawdownStrategy&&t.isaDrawdownStrategy!==jt.DRAWDOWN_STRATEGY,facts:t=>[Tt("use",t.isaDrawdownStrategy||jt.DRAWDOWN_STRATEGY)]},{id:"pots.isa-growth",keys:["stress.isaGrowth","stress.isaReturn","stress.isaMin","decision.isaReturn","decision.isaMin"],set:t=>t.isaGrowth==="invested"||z(t.isaMin)>0,facts:t=>[Tt("grows",t.isaGrowth==="invested"?"invested":t.isaGrowth==="cash"?"cash":"fixed"),Zs("fixedRate",(z(t.isaReturn)??jt.RETURN)*100),Oe("floor",t.isaMin??0)]},{id:"pots.charges",keys:["stress.chargesPct"],set:t=>z(t.chargesPct)!=null&&z(t.chargesPct)!==.5,facts:t=>[Zs("yearly",z(t.chargesPct)??0)]},{id:"pots.funds-to-test",keys:["stress.taggedFunds","decision.taggedFunds","stress.subAsset","decision.subAsset"],set:t=>rt(t.taggedFunds).some(e=>z(e.value)>0),facts:t=>rt(t.taggedFunds).filter(e=>z(e.value)>0).flatMap((e,n)=>[hn("name"+n,e.name||e.ticker||""),Oe("value"+n,e.value)])},{id:"draw.cadence",keys:[],set:(t,e,n)=>{const s=n&&n.decisionTool&&(n.decisionTool.cadence||n.decisionTool.settings&&n.decisionTool.settings.cadence);return!!s&&s!=="monthly"},facts:(t,e,n)=>[Tt("how",n&&n.decisionTool&&(n.decisionTool.cadence||n.decisionTool.settings&&n.decisionTool.settings.cadence)||"monthly")]},{id:"timing.stale-draft",keys:["stress.staleDraftDismissedFor"],set:t=>z(t.staleDraftDismissedFor)>0,facts:t=>[Le("year",t.staleDraftDismissedFor)]},{id:"lock.lock",keys:["decision.locked","decision.lockedAt","decision.lockedBy"],set:(t,e)=>!!e.locked,facts:(t,e)=>[Ve("locked",!!e.locked),er("at",e.lockedAt||""),hn("by",e.lockedBy||"")]},{id:"lock.unlock",keys:["decision.unlockedAt","decision.unlockCount"],set:(t,e)=>z(e.unlockCount)>0,facts:(t,e)=>[Le("times",e.unlockCount??0),er("last",e.unlockedAt||"")]},{id:"month.seeded",keys:["decision.seededFrom"],set:(t,e)=>!!e.seededFrom,facts:(t,e)=>[hn("from",e.seededFrom||"")]},{id:"mach.configured",keys:["stress.configured","decision.configured"],set:()=>!1,facts:(t,e)=>[Ve("stress",!!t.configured),Ve("decision",!!e.configured)]},{id:"mach.declining",keys:["stress.spendingProfile","decision.spendingProfile","stress.spendingMigratedFrom","decision.spendingMigratedFrom"],set:t=>t.spendingMigratedFrom==="declining",facts:t=>[Ve("folded",t.spendingMigratedFrom==="declining")]},{id:"mach.old-names",keys:["stress.pacwMin","stress.cgtMin","stress.csh2Target"],set:()=>!1,facts:t=>[Ve("present",t.pacwMin!==void 0||t.cgtMin!==void 0||t.csh2Target!==void 0)]},{id:"mach.risk-mode",keys:["stress.riskMode"],set:()=>!1,facts:t=>[hn("mode",t.riskMode||"")]},{id:"mach.start-date",keys:["decision.startDate"],set:()=>!1,facts:(t,e)=>[er("date",e.startDate||"")]}]);function Eo(t,e,n,{all:s=!1}={}){const r=t||{},i=e||{},o=[];for(const l of Ng){let a=!1,c=[];try{a=!!l.set(r,i,n)}catch{a=!1}if(!(!a&&!s)){try{c=l.facts(r,i,n).filter(u=>u&&(u.kind==="text"||u.kind==="choice"?typeof u.v=="string":!0))}catch{c=[]}o.push({id:l.id,set:a,facts:c})}}return o}const ko={55:{m:[84,91,96],f:[87,93,97]},60:{m:[85,91,96],f:[87,93,97]},65:{m:[85,92,96],f:[88,93,98]},70:{m:[86,92,96],f:[88,94,98]},75:{m:[87,92,97],f:[89,94,98]}},xg={50:0,25:1,10:2};function Cg(t,e="m",n=10){const s=xg[n]??2,r=e==="f"?"f":"m",i=Math.max(55,Math.min(75,t||65)),o=Math.floor(i/5)*5,l=Math.min(75,o+5),a=ko[o][r][s],c=ko[l][r][s],u=l===o?0:(i-o)/(l-o);return Math.round(a+(c-a)*u)}const Fn=["January","February","March","April","May","June","July","August","September","October","November","December"];function xt(t){const e=/^(\d{4})-(\d{2})-(\d{2})$/.exec(String(t||""));if(!e)throw new Error("planRead needs today as YYYY-MM-DD");return new Date(+e[1],+e[2]-1,+e[3],12,0,0,0)}const Bs=t=>{const e=/^(\d{4})-(\d{2})/.exec(String(t||""));return e?{y:+e[1],m:+e[2]}:null},ce=t=>{const e=Bs(t);return e&&e.m>=1&&e.m<=12?Fn[e.m-1]+" "+e.y:""},zt=t=>{const e=Bs(t);return e&&e.m>=1&&e.m<=12?Fn[e.m-1]:""},ie=t=>{const e=/^(\d{4})-(\d{2})-(\d{2})/.exec(String(t||""));return e&&+e[2]>=1&&+e[2]<=12?+e[3]+" "+Fn[+e[2]-1]+" "+e[1]:ce(t)},Lg=(t,e)=>(e.y-t.y)*12+(e.m-t.m),Er=t=>String(t).padStart(2,"0"),Ul=t=>t.getFullYear()+"-"+Er(t.getMonth()+1)+"-"+Er(t.getDate()),Vg=t=>t.getFullYear()+"-"+Er(t.getMonth()+1),be=t=>!!t&&typeof t=="object"&&!Array.isArray(t);function Gl(t){const e=(n,s)=>n==null||n===""||!Number.isFinite(+n)||+n<=0?s:+n;return{pa:e(t&&t.pa,Ys.pa),brl:e(t&&t.brl,Ys.brl),hrl:e(t&&t.hrl,Ys.hrl)}}const je=(t,e)=>fc(Math.max(0,+t||0),e.pa,e.brl,e.hrl),_t=(t,e)=>hc(Math.max(0,+t||0),e);function Bg(t){const e=t&&t.incomeShape==="phases"?Ts(t.incomeSteps):[];return e.length?+e[0].amount:Array.isArray(t&&t.targetSchedule)&&t.targetSchedule.length?+t.targetSchedule[0]||0:+(t&&t.baseSalary)||0}const Q=t=>t==null||t===""||!Number.isFinite(+t)?null:+t,$t=t=>t==null||typeof t=="string"&&t.trim()==="",Fg=t=>!!(t&&t.decisionTool&&t.decisionTool.settings&&t.decisionTool.settings.locked),Po=t=>t&&t.decisionTool&&t.decisionTool.settings&&t.decisionTool.settings.lockedAt||t&&t.planDocument&&t.planDocument.lockedAt||null,Ro=t=>t&&t.planDetails&&typeof t.planDetails.name=="string"&&t.planDetails.name||t&&typeof t.name=="string"&&t.name||"",Mo=t=>t&&t.household&&typeof t.household.partnerScenarioId=="string"&&t.household.partnerScenarioId||null,kr=t=>t===void 0?void 0:JSON.parse(JSON.stringify(t)),Oo=t=>t===void 0?"<absent>":JSON.stringify(t);function di(t,e){return String(e).split(".").reduce((n,s)=>n==null?void 0:n[s],t)}function Ug(t,e,n){const s=String(e).split(".");let r=t;for(let i=0;i<s.length-1;i++)be(r[s[i]])||(r[s[i]]={}),r=r[s[i]];r[s[s.length-1]]=n}function Gg(t,e){const n=String(e).split(".");let s=t;for(let r=0;r<n.length-1;r++){if(!be(s[n[r]]))return;s=s[n[r]]}delete s[n[n.length-1]]}function Yg(t){const e=String(t??"").trim();let n=/^(\d{4})[-/](\d{1,2})$/.exec(e);if(n)return+n[2]>=1&&+n[2]<=12?{y:+n[1],m:+n[2]}:null;if(n=/^(\d{1,2})[-/](\d{4})$/.exec(e),n)return+n[1]>=1&&+n[1]<=12?{y:+n[2],m:+n[1]}:null;if(n=/^([A-Za-z]{3,9})\s+(\d{4})$/.exec(e),n){const s=Fn.findIndex(r=>r.toLowerCase().startsWith(n[1].toLowerCase().slice(0,3))&&r.toLowerCase().startsWith(n[1].toLowerCase()));return s>=0?{y:+n[2],m:s+1}:null}return null}const Do=t=>t.y+"-"+String(t.m).padStart(2,"0");function hi(t,e){try{return Ls(t,{now:e})}catch{return t&&t.stressTool&&t.stressTool.settings||{}}}function Fs(t,e){try{return Dl(t,e)}catch{return{mode:"legacy",firstTaxYear:e.getFullYear()+1,shapeAgeNow:Q(t.shapeAgeNow)||57,currentAge:null,retireAge:null,startMonth:e.getFullYear()+1+"-04",yearsToStart:0,bridgeMonths:0}}}function fi(t,{today:e}){const n=xt(e),s=Fg(t),r=s?t.planDocument:null,i=hi(t,n),o=t&&t.stressTool&&be(t.stressTool.settings)?t.stressTool.settings:{};let l=Fs(i,n),a=Q(i.duration)||35;if(r&&be(r.timing)){const w=r.timing;l={...l,mode:w.mode||l.mode,currentAge:Q(w.currentAge),retireAge:Q(w.retireAge),firstTaxYear:Q(w.firstTaxYear)||l.firstTaxYear,shapeAgeNow:Q(w.shapeAgeNow)||l.shapeAgeNow,startMonth:w.startMonth||l.startMonth},a=Array.isArray(r.timeline)&&r.timeline.length||Q(r.assumptions&&r.assumptions.duration)||a}const c=we(n),u=l.mode==="legacy"?null:r&&be(r.timing)?Q(r.timing.currentAge):Q(i.currentAge),d=r&&be(r.timing)?r.timing.currentAgeAsOf||null:i.currentAgeAsOf||null,f=u==null?null:l.mode==="future"?"age":"yes",m=l.firstTaxYear,g=f==="yes"?m===c?"now":m===c+1?"april":"saved":null,h=l.shapeAgeNow+a-1,_=s?{kind:"locked",at:ie(Po(t))}:{kind:"saved",at:t&&t.lastModified?ie(t.lastModified):null},E=s?_:{kind:"saved",at:d?ie(d):_.at};return{locked:s,lockedOn:s?ie(Po(t)):null,ss:i,stored:o,timing:l,duration:a,thisTY:c,values:{age:u,stopped:f,stopAge:f==="age"?Q(l.retireAge):null,startWhen:g,endAge:h,savedYear:f==="yes"&&g==="saved"?m:null},source:_,ageSource:E}}function Yl(t,{today:e}){const s=fi(t,{today:e}).values,r={};return s.age!=null&&(r.age=String(s.age)),s.stopped&&(r.stopped=s.stopped),s.stopAge!=null&&(r.stopAge=String(s.stopAge)),s.startWhen&&(r.startWhen=s.startWhen),Number.isFinite(s.endAge)&&(r.endAge=String(s.endAge)),r}const Bt=t=>na.find(e=>e.path===t);function tr(t,e){if($t(t))return{error:e.required?"required":null,value:null};const n=String(t).trim();if(!/^\d{1,3}$/.test(n))return{error:"notANumber",value:null};const s=+n;return s<e.min?{error:"tooLow",value:s}:s>e.max?{error:"tooHigh",value:s}:{error:null,value:s}}function $g(t){const e=["now","april"];return t.values.savedYear&&e.push("saved"),e}function $l(t,e,{today:n}){const s=xt(n),r=fi(t,{today:n}),i={...Yl(t,{today:n}),...e||{}},o={},l={},a={age:!0,stopped:!0,endAge:!0,sex:!0,chance:!0,stopAge:!1,stopMonth:!1,startWhen:!1},c=tr(i.age,Bt("age"));c.error?l.age=c.error:o.age=c.value;const u=$t(i.stopped)?null:String(i.stopped);if(u?Bt("stopped").options.includes(u)?o.stopped=u:l.stopped="notAnOption":l.stopped="required",a.stopAge=u==="age",a.stopMonth=u==="month",a.startWhen=u==="yes",a.stopAge){const p=tr(i.stopAge,Bt("stopAge"));p.error?l.stopAge=p.error:o.age!=null&&p.value<o.age?l.stopAge="stop-before-age":o.stopAge=p.value}if(a.stopMonth)if($t(i.stopMonth))l.stopMonth="required";else{const p=Yg(i.stopMonth);p?Do(p)<=Vg(s)?l.stopMonth="month-passed":o.stopMonth=Do(p):l.stopMonth="notAMonth"}const d=$g(r);if(a.startWhen){const p=$t(i.startWhen)?null:String(i.startWhen);p?d.includes(p)?o.startWhen=p:l.startWhen="notAnOption":l.startWhen="required"}for(const p of["sex","chance"]){const A=Bt(p),v=$t(i[p])?A.default:String(i[p]);A.options.includes(v)?o[p]=v:l[p]="notAnOption"}let f=null,m=null,g=null,h=null;if(o.age!=null&&o.stopped&&!l.stopAge&&!l.stopMonth&&!l.startWhen){const p=r.ss,A=r.stored;f={...A};const v=Math.floor(+p.currentAge||0),b=p.currentAgeAsOf||A.currentAgeAsOf||null;f.currentAge=o.age,f.currentAgeAsOf=o.age===v&&b?b:Ul(s);const S=o.stopped==="yes";f.retired=S;let T=null;if(o.stopped==="age"&&(T=o.stopAge),o.stopped==="month"){const[R,k]=o.stopMonth.split("-").map(Number);T=Bn({...f},new Date(R,k,0),s),h=T}f.retireAge=S?null:T,f.firstTaxYear=S?o.startWhen==="now"?r.thisTY:o.startWhen==="april"?r.thisTY+1:r.values.savedYear:null,m=Fs(f,s),f.shapeAgeNow=m.shapeAgeNow,m.mode!=="legacy"&&(f.firstTaxYear=m.firstTaxYear)}const E=m?m.shapeAgeNow+rr-1:Bt("endAge").min,w=tr(i.endAge,Bt("endAge"));w.error?l.endAge=w.error:w.value<E?l.endAge="too-short":o.endAge=w.value,f&&o.endAge!=null&&(g=Math.max(rr,o.endAge-m.shapeAgeNow+1),f.duration=g);const y=Object.keys(l).length===0&&f!==null&&g!==null;return{ok:y,values:o,errors:l,applies:a,offered:d,next:y?f:null,timing:y?m:null,duration:g,stopAgeFromMonth:h,saved:r,minEnd:E}}function jg(t,e,n){if(!(t&&t.budgetTool&&be(t.budgetTool.settings)))return{};const s=e.retired===!1&&+e.retireAge>0?+e.retireAge:n.shapeAgeNow;return{"budgetTool.settings.currentAge":e.currentAge,"budgetTool.settings.currentAgeAsOf":e.currentAgeAsOf,"budgetTool.settings.retired":e.retired,"budgetTool.settings.retirementAge":s}}function jl(t,e,{today:n}){const s=$l(t,e,{today:n});if(!s.ok)return{ok:!1,errors:s.errors,patch:{},previous:{}};if(s.saved.locked)return{ok:!1,errors:{plan:"locked"},patch:{},previous:{}};const r=s.next,i=s.timing,o={"stressTool.settings.currentAge":r.currentAge,"stressTool.settings.currentAgeAsOf":r.currentAgeAsOf,"stressTool.settings.retired":r.retired,"stressTool.settings.retireAge":r.retireAge,"stressTool.settings.firstTaxYear":r.firstTaxYear,"stressTool.settings.shapeAgeNow":r.shapeAgeNow,"stressTool.settings.duration":r.duration,"decisionTool.settings.firstTaxYear":i.firstTaxYear,...jg(t,r,i)},l={},a={};for(const c of pc){if(!(c in o))continue;const u=di(t,c),d=o[c];Oo(u)!==Oo(d)&&(u===void 0&&d===null||(l[c]=kr(d),a[c]=kr(u)))}return{ok:!0,errors:{},patch:l,previous:a}}function Kg(t,e){const n=JSON.parse(JSON.stringify(t));for(const[s,r]of Object.entries(e||{}))r===void 0?Gg(n,s):Ug(n,s,kr(r));return n}function No(t,e,{stopAgeFromMonth:n=null}={}){if(!t||t.mode==="legacy")return[{id:"noAge",slots:{}}];const s=t.shapeAgeNow+e-1,r=[];return t.mode==="future"&&(n!=null?r.push({id:"monthAs",slots:{age:t.retireAge,month:ce(t.startMonth)}}):r.push({id:"stopIn",slots:{month:ce(t.startMonth),age:t.retireAge}})),r.push({id:"firstYear",slots:{year:W(t.firstTaxYear),y:t.firstTaxYear}}),r.push({id:"runs",slots:{years:e,from:t.mode==="future"?ce(t.startMonth):"April "+t.firstTaxYear,endAge:s}}),r.push({id:"stepsFrom",slots:{age:t.shapeAgeNow}}),r}function Wg(t){return[]}function Hg(t,e){const n=t&&t.fromAnswer;if(!be(n)||!be(n.answer)||!Array.isArray(n.people)||!be(n.people[0]))return null;const s=e||{},r=n.people[0],i=be(r.stop)?r.stop:be(n.stop)?n.stop:null,o=i?i.kind==="later":Q(r.ageAtStop)!=null&&Q(r.ageToday)!=null&&r.ageAtStop>r.ageToday,l=Q(r.years)!=null?Q(r.years):Q(n.years),a=[];if(Q(r.ageToday)!=null&&Q(s.currentAge)!==Q(r.ageToday)&&a.push("age"),s.retired===!1!==o&&a.push("stopped"),o&&s.retired===!1&&Q(s.retireAge)!==Q(r.ageAtStop)&&a.push("stopAge"),l!=null&&Q(s.duration)!==l&&a.push("years"),r.statePension===null||be(r.statePension)&&Q(r.statePension.yearly)!=null){const d=r.statePension===null?0:Math.round(Q(r.statePension.yearly)),f=+s.spWeeklyAmount>0&&s.spStartDate?Math.round(+s.spWeeklyAmount*52):0;d!==f&&a.push("statePension")}if((r.finalSalary===null||be(r.finalSalary)&&Q(r.finalSalary.yearly)!=null)&&(r.finalSalary===null?0:Math.round(Q(r.finalSalary.yearly)))!==Math.round(Q(s.dbAmount)||0)&&a.push("finalSalary"),Array.isArray(r.takeHome)&&be(r.takeHome[0])&&Q(r.takeHome[0].perMonth)!=null){const d=Math.round(Q(r.takeHome[0].perMonth)),f=Math.round(je(Bg(s),Gl(s))/12);Math.abs(d-f)>1&&a.push("spend")}if(!a.length)return null;const c=typeof n.savedOn=="string"?n.savedOn:"",u=t.lastModified&&String(t.lastModified)>c?ie(t.lastModified):null;return{workedOutOn:ie(c),changedOn:u,lasted:be(n.answer)?Q(n.answer.lasted):null,diffs:a}}function zg(t,e,{today:n,typed:s=null}={}){const r=(t||[]).filter(y=>y&&y.plan&&typeof y.plan=="object"&&y.plan.id!=null),i=r.find(y=>String(y.plan.id)===String(e))||null;if(!i)return{found:!1,id:String(e||"")};const o=i.plan,l=!!(i.newer||i.failed),a=fi(o,{today:n}),c=!a.locked&&!l,u=Yl(o,{today:n}),d=$l(o,s||{},{today:n}),f={...u,...s||{}},m=na.map(y=>({path:y.path,type:y.type,options:y.type==="choice"?y.path==="startWhen"?d.offered:y.options:null,applies:d.applies[y.path]!==!1,shown:$t(f[y.path])?"":String(f[y.path]),saved:y.path in u?u[y.path]:null,error:d.errors[y.path]||null})),g=d.ok?No(d.timing,d.duration,{stopAgeFromMonth:d.stopAgeFromMonth}):No(a.timing,a.duration);o.planDocument&&o.planDocument.strategy&&o.planDocument.strategy.id||a.ss.strategyId;const h=r.filter(y=>y.plan.id!==o.id&&(y.plan.id===Mo(o)||Mo(y.plan)===o.id)).map(y=>({id:String(y.plan.id),name:Ro(y.plan)}));let _=null;if(d.values.age!=null){const y=Cg(d.values.age,d.values.sex||"m",+(d.values.chance||"10"));_={endAge:y,applied:String(f.endAge||"")===String(y),slots:{age:y,who:d.values.sex==="f"?"women":"men",ageNow:d.values.age,chance:d.values.chance||"10"}}}const E=c&&d.ok?jl(o,s||{},{today:n}):{patch:{},previous:{}},w={years:a.duration,endAge:a.values.endAge};return{found:!0,id:String(o.id),name:Ro(o),locked:a.locked,lockedOn:a.lockedOn,readonly:l,editable:c,source:a.source,ageSource:a.ageSource,thisTY:a.thisTY,yearNow:W(a.thisTY),yearApril:W(a.thisTY+1),yearSaved:a.values.savedYear?W(a.values.savedYear):null,fields:m,errors:d.errors,ok:d.ok,derived:g,notUsed:Wg(),partners:h,suggestion:_,endAgeMin:d.minEnd,minYears:rr,changed:Object.keys(E.patch).length>0,patch:E.patch,previous:E.previous,savedSlots:w,savedLine:d.ok?{id:"runsTo",slots:{endAge:d.values.endAge,years:d.duration}}:null}}const Y=t=>t==null||t===""||!Number.isFinite(+t)?null:+t,C=t=>Math.round(Y(t)||0),bn=t=>t&&t.planDetails&&typeof t.planDetails.name=="string"&&t.planDetails.name||t&&typeof t.name=="string"&&t.name||"",Pr=t=>t&&t.household&&typeof t.household.partnerScenarioId=="string"&&t.household.partnerScenarioId||null,ms=t=>!!(t&&t.decisionTool&&t.decisionTool.settings&&t.decisionTool.settings.locked),Us=t=>t&&t.decisionTool&&t.decisionTool.settings&&t.decisionTool.settings.lockedAt||t&&t.planDocument&&t.planDocument.lockedAt||null,Kl=(t,e)=>t&&t.planDocument&&t.planDocument.strategy&&t.planDocument.strategy.id||e&&e.strategyId||"pots-and-valves",Wl=(t,e)=>Hm.includes(Kl(t,e));function gs(t,e,n=null){const s=t&&t.key;return!s||s==="unknown"?null:s==="committed-saving"?{id:"committed-saving",slots:{month:ce(t.startMonth)||W(t.firstTaxYear)}}:s==="bridge"?{id:Wl(e,n)?"bridge-ladder":"bridge-plan",slots:{month:ce(t.startMonth)||"April "+t.firstTaxYear}}:{id:s,slots:{}}}function ys(t,e){try{return Tg(t,{now:e})}catch{return{key:"unknown",locked:ms(t),retired:!1,timingMode:"legacy",firstTaxYear:null,startMonth:null,beforeStart:!1,hasRecords:!1,hasDocument:!!(t&&t.planDocument),monthsToStart:0,yearsToStart:0}}}function As(t,e){try{return Ls(t,{now:e})}catch{return t&&t.stressTool&&t.stressTool.settings||{}}}function pi(t,e){const n=e.id,s=Pr(e);return t.filter(r=>r.plan.id!==n&&(r.plan.id===s||Pr(r.plan)===n))}function qg(t,{today:e,source:n="account"}={}){const s=xt(e),r=(t||[]).filter(u=>u&&u.plan&&typeof u.plan=="object"&&u.plan.id!=null),i=r.map(u=>{const d=u.plan,f=ys(d,s),m=As(d,s),g=pi(r,d);return{id:String(d.id),name:bn(d),stageKey:f.key,line:gs(f,d,m),locked:ms(d),lockedOn:ms(d)?ie(Us(d)):null,madeOn:d.fromAnswer&&d.fromAnswer.savedOn?ie(d.fromAnswer.savedOn):null,shownAsSaved:!!(u.newer||u.failed),linked:g.length>0,lastModified:typeof d.lastModified=="string"?d.lastModified:""}}),o=(u,d)=>String(d.lastModified).localeCompare(String(u.lastModified));if(n==="window")return{groups:[{id:"window",rows:i.slice().sort((u,d)=>u.linked===d.linked?o(u,d):u.linked?-1:1)}]};const l=i.filter(u=>u.linked).sort(o),a=i.filter(u=>!u.linked).sort(o),c=[];return l.length&&c.push({id:"household",rows:l}),a.length&&c.push({id:"other",rows:a}),{groups:c}}const x=t=>({key:t,kind:"money"}),Ue=t=>({key:t,kind:"count"}),un=t=>({key:t,kind:"age"}),Jg=t=>"£"+String(Math.abs(Math.round(Number(t)||0))).replace(/\B(?=(\d{3})+(?!\d))/g,","),Qg=(t,e)=>typeof t=="string"?t:"fixed"in t?String(t.fixed):t.kind==="money"?Jg(e[t.key]):String(Math.round(Number(e[t.key])||0)),K=(t,e,n)=>({id:t,parts:e,text:e.map(s=>Qg(s,n)).join("")});function re(t,e,n){const s=e?Bs(e):null,r={y:n.getFullYear(),m:n.getMonth()+1},i=!!s&&Lg(s,r)>3;return{kind:t,at:e?String(e).length>7?ie(e):ce(e):null,stale:i}}const U=(t,e,n,s,r={})=>({id:t,slots:r,sentence:K(t,e,n),source:s}),Z=(t,e,n={})=>({id:t,place:e,slots:n}),Rr=(t,e,n={})=>({id:t,href:e,slots:n});function Hl(t){const{plan:e,now:n,ty:s,tyKey:r,mon:i}=t,o=Vs(e),l=o.length?o[o.length-1]:null,a=!!l&&String(l.date).slice(0,7)>=i,c={},u=[],d=!!(e.decisionTool&&e.decisionTool.taxYears&&e.decisionTool.taxYears[r]&&e.decisionTool.taxYears[r].yearSetupComplete);u.push(U(d?"month.yearSetUp":"month.yearNotSetUp",[],c,re("record",null,n),{year:W(s)})),o.slice(-3).reverse().forEach((g,h)=>{c["net"+h]=C(g.monthlyNet),c["tax"+h]=C(g.monthlyTax),u.push(U("month.record",[{fixed:ce(g.date)},": ",x("net"+h)," after tax, ",x("tax"+h)," tax"],c,re("record",g.date,n),{month:ce(g.date)}))});let f;a?(c.net=C(l.monthlyNet),f=K("month.recorded",[ce(i)+" recorded: ",x("net")," after tax"],c)):f=K("month.notYet",[ce(i)+" is not recorded yet"],c);const m=[Z("record","month",{month:zt(i)})];return d||m.push(Z("setUpYear","taxyear",{year:W(s)})),{done:a,result:f,figures:c,lines:u,buttons:m,notes:[],recorded:a,setUp:d}}function Xg(t){const{plan:e,now:n,ss:s}=t,r={},i=[],o=[];if(!e.planDocument)return{done:!1,result:K("where.noDocument",["Not locked: nothing to read against yet"],r),figures:r,lines:i,buttons:[],notes:o};let l=null,a={ladderInDocument:!1};try{l=wg(e,{now:n}),a=Vl(e,{now:n})}catch{l=null}const c=Us(e);if(!l)return{done:!1,result:K("where.noReading",["The plan document could not be read"],r),figures:r,lines:i,buttons:[Z("seeDocument","document")],notes:o};let u;if(l.saving){const d=l.saving;d.pathMissing||d.actual==null||d.expected==null?u=K("where.saverNone",["No pot recorded against the plan’s path yet"],r):(r.actual=C(d.actual),r.expected=C(d.expected),u=K("where.saver",[x("actual")," on "+ce(d.at),"; the plan’s middle line for then is ",x("expected")],r),i.push(U("where.saverPot",[x("actual")],r,re(d.actualSource==="holdings"?"hold":"record",d.recordedAt||d.at,n))),i.push(U("where.saverLine",[x("expected")],r,re("locked",c,n))))}else{const d=l.incomeThisYear||{recorded:0,drawn:0,planned:null};r.months=d.recorded,r.drawn=C(d.drawn);const f=[Ue("months")," month"+(d.recorded===1?"":"s")+" recorded in "+l.taxYear+": ",x("drawn")," taken before tax"];d.planned!=null&&(r.planned=C(d.planned),f.push("; the plan says ",x("planned")," for the year")),u=K("where.retired",f,r),i.push(U("where.taken",[x("drawn")],r,re("record",null,n),{year:l.taxYear})),d.planned!=null&&i.push(U("where.planned",[x("planned")],r,re("locked",c,n),{year:l.taxYear})),l.step&&l.step.amount!=null&&(r.stepNow=C(l.step.amount),i.push(U("where.step",[x("stepNow")," a year before tax"],r,re("locked",c,n),{n:String(l.step.index),of:String(l.step.of)}))),l.pot&&l.pot.actual!=null&&(r.pot=C(l.pot.actual),i.push(U("where.pot",[x("pot")],r,re(l.pot.source==="holdings"?"hold":"record",l.pot.asOf,n))),l.pot.p50!=null&&(r.potMid=C(l.pot.p50),i.push(U("where.potMid",[x("potMid")],r,re("locked",c,n)))))}return l.contract&&!a.ladderInDocument&&o.push("where.ladderNotInDocument"),l.ladder&&typeof l.ladder.monthly=="number"&&l.ladder.monthly>0&&(r.ladderMonthly=C(l.ladder.monthly),i.push(U("where.ladderMonthly",[x("ladderMonthly")," a month before tax"],r,re("locked",c,n)))),{done:!0,result:u,figures:r,lines:i,buttons:[Z("seeDocument","document")],notes:o}}function Zg(t,e,n){if(n&&t.planDocument&&Array.isArray(t.planDocument.steps)&&t.planDocument.steps.length)return t.planDocument.steps.map(i=>({fromAge:+i.fromAge,amount:C(i.amount),taxYear:i.taxYear||null,decline:+i.decline||0,glideToNext:!!i.glideToNext}));const s=Y(e.shapeAgeNow)||null;if(e.incomeShape==="phases"&&Array.isArray(e.incomeSteps)&&e.incomeSteps.length)return e.incomeSteps.filter(i=>i&&Y(i.amount)!=null).map(i=>({fromAge:+i.fromAge,amount:C(i.amount),taxYear:null,decline:+i.decline||0,glideToNext:!!i.glideToNext}));const r=Array.isArray(e.targetSchedule)&&e.targetSchedule.length?C(e.targetSchedule[0]):C(e.baseSalary);return s?[{fromAge:s,amount:r,taxYear:null,decline:0,glideToNext:!1}]:[{fromAge:null,amount:r,taxYear:null,decline:0,glideToNext:!1}]}function ey(t){const{plan:e,ss:n,ds:s,now:r,stage:i,locked:o,readonly:l}=t,a=o?e.planDocument:null,c=Us(e),u={},d=[],f=[],m=Zg(e,n,o),g=m[0]||null,h=o?re("locked",c,r):re("saved",null,r),_=a&&a.timing?a.timing:null,E=_&&_.startMonth||i.startMonth||null,w=_&&_.firstTaxYear||i.firstTaxYear||null,y=Wl(e,n);let p;g&&(u.yearly=g.amount),o&&g?p=i.timingMode==="future"?K("plan.lockedSaver",[x("yearly")," a year before tax from "+(ce(E)||W(w))+" (tax year "+W(w)+")"],u):K(y?"plan.lockedLadder":"plan.lockedPlan",[x("yearly")," a year before tax; your "+(y?"ladder":"plan")+" pays from "+(ce(E)||W(w))+" (tax year "+W(w)+")"],u):i.timingMode==="future"&&Y(n.retireAge)?(u.retireAge=+n.retireAge,p=K("plan.saver",["Stopping work at ",un("retireAge"),", in "+(ce(E)||W(w))],u)):g&&i.key!=="unknown"?p=K("plan.retired",["Retired. ",x("yearly")," a year before tax"],u):g?p=K("plan.noAge",[x("yearly")," a year before tax"],u):p=K("plan.nothing",["No figures yet"],u);const A=[],v=o&&_&&Y(_.currentAge)!=null?_.currentAge:Y(n.currentAge),b=o&&_?_.currentAgeAsOf:n.currentAgeAsOf;v!=null&&(u.ageToday=v,A.push(U("about.age",[un("ageToday")],u,o?h:re("saved",b||null,r),{asOf:b?ie(b):""})));const S=o&&_?_.mode==="retired":n.retired===!0,T=Y(o&&_?_.retireAge:n.retireAge);i.timingMode==="future"&&T!=null?(u.stopAge=T,A.push(U("about.stopAt",[un("stopAge")],u,h,{month:ce(E)}))):(S||i.timingMode==="retired")&&A.push(U("about.retired",[],u,h)),w&&A.push(U("about.firstYear",[],u,h,{year:W(w)}));const R=o&&a?a.timeline&&a.timeline.length||a.assumptions&&a.assumptions.duration||null:Y(n.duration);if(R){u.years=R;const O=_&&Y(_.shapeAgeNow)!=null?_.shapeAgeNow:Y(n.shapeAgeNow);O!=null&&(u.ageEnd=O+R-1),A.push(U("about.runs",[Ue("years")," years"+(O!=null?", to age ":"")].concat(O!=null?[un("ageEnd")]:[]),u,h))}const k=[];m.forEach((O,ne)=>{u["step"+ne]=O.amount;const Ee=[];O.fromAge!=null&&(u["stepAge"+ne]=O.fromAge,Ee.push("From age ",un("stepAge"+ne),": ")),Ee.push(x("step"+ne)," a year before tax"),O.taxYear&&Ee.push(" (tax year "+O.taxYear+")"),O.decline>0?Ee.push(", falling "+String(O.decline)+"% a year"):O.glideToNext&&ne<m.length-1&&Ee.push(", sloping to the next step"),k.push(U("pays.step",Ee,u,h))}),o?f.push({id:"prices",slots:{month:ce(c)||ie(c)}}):f.push({id:"pricesToday",slots:{}});const P=[],D=o&&a&&a.pots?C(a.pots.sipp):Y(n.strategyParams&&n.strategyParams.sippTotal)>0?C(n.strategyParams.sippTotal):C(n.equityMin)+C(n.bondMin)+C(n.cashTarget)+C(n.diversifierStart),I=o&&a&&a.pots?C(a.pots.isa):C(n.isaBalance),M=o&&a&&a.pots?C(a.pots.gia):C(n.taxableStart);if(u.sipp=D,u.isa=I,u.gia=M,P.push(U("pots.pension",[x("sipp")],u,h)),!o)u.shares=C(n.equityMin),u.bonds=C(n.bondMin),u.cash=C(n.cashTarget),P.push(U("pots.split",[x("shares")," shares, ",x("bonds")," bonds, ",x("cash")," cash"],u,h));else if(a&&a.pots&&a.pots.allocation){const O=a.pots.allocation;u.shares=C(O.equityMin),u.bonds=C(O.bondMin),u.cash=C(O.cashTarget),P.push(U("pots.split",[x("shares")," shares, ",x("bonds")," bonds, ",x("cash")," cash"],u,h))}P.push(U("pots.isa",[x("isa")],u,h)),M>0&&P.push(U("pots.gia",[x("gia")],u,h));const N=o&&a&&a.pots?a.pots.potAtRetirement:n.potAtRetirement;N&&(Y(N.sipp)>0||Y(N.isa)>0)&&(u.parSipp=C(N.sipp),u.parIsa=C(N.isa),P.push(U("pots.atStop",[x("parSipp")," pension, ",x("parIsa")," ISA"],u,h)));const B=[],ue=o&&a&&a.assumptions?Y(a.assumptions.spWeeklyAmount):Y(n.spWeeklyAmount),oe=o&&a&&a.assumptions?a.assumptions.spStartDate:n.spStartDate;if(ue>0)u.spWeekly=C(ue),B.push(U("pots.statePension",[x("spWeekly")," a week"],u,h,{from:oe?String(oe):""}));else if(Y(n.statePension)>0){u.spYearly=C(n.statePension);const O=w&&Y(n.statePensionYear)!=null?W(w+C(n.statePensionYear)):"";B.push(U("pots.statePensionOld",[x("spYearly")," a year"],u,h,{year:O}))}else B.push(U("pots.noStatePension",[],u,h));const pe=_&&Y(_.shapeAgeNow)!=null?_.shapeAgeNow:Y(n.shapeAgeNow);if(Y(n.dbAmount)>0){u.db=C(n.dbAmount);const O=Y(n.dbStartAge)>0?C(n.dbStartAge):pe!=null&&Y(n.dbStartYear)!=null?pe+C(n.dbStartYear):null,ne=O!=null?"age "+String(O):Y(n.dbStartYear)!=null&&w?"tax year "+W(w+C(n.dbStartYear)):"";B.push(U("pots.finalSalary",[x("db")," a year"],u,h,{from:ne}))}Y(n.other)>0&&(u.other=C(n.other),B.push(U("pots.other",[x("other")," a year"],u,h))),(Array.isArray(n.extraIncomes)?n.extraIncomes:[]).forEach((O,ne)=>{if(!O||typeof O!="object"||!(Y(O.annual)>0))return;u["stream"+ne]=C(O.annual);const Ee=pe!=null?pe+(Y(O.startYear)||0):"",Gs=O.endYear==null?null:pe!=null?pe+Y(O.endYear):"";B.push(U(Gs==null?"income.streamLife":"income.stream",[x("stream"+ne)," a year"],u,h,{label:O.label||"Income for some years",from:String(Ee),to:Gs==null?"":String(Gs)}))}),(Array.isArray(n.windfalls)?n.windfalls:[]).forEach((O,ne)=>{!O||typeof O!="object"||!(Y(O.amount)>0)||O.year==null||(u["lump"+ne]=C(O.amount),B.push(U("income.lump",[x("lump"+ne)],u,h,{label:O.label||"Lump sum",age:pe!=null?String(pe+Y(O.year)):"",what:["cash","pension","isa"].includes(O.wrapper)?O.wrapper:"cash"})))});const H=[],te=Kl(e,n);H.push(U("way.strategy",[],u,h,{strategy:te}));const ae=o&&a&&a.strategy&&a.strategy.params||n.strategyParams||{};for(const[O,ne]of Object.entries(ae))Y(ne)!=null&&(u["dial."+O]=Y(ne),H.push(U("way.dial",[O==="cashYears"||O==="years"||/Years$|Age$/.test(O)?Ue("dial."+O):x("dial."+O)],u,h,{dial:O})));!o&&n.allocMode&&H.push(U("way.allocMode",[],u,h,{mode:String(n.allocMode)}));const nt=Eo(n,s,e),ve=Eo(n,s,e,{all:!0}),ln=[{id:"about",lines:A,place:"about",sub:"about",href:"#/plan/"+e.id+"/about"},{id:"pays",lines:k,place:"spend",sub:"spend",href:"#/plan/"+e.id+"/spend"},{id:"pots",lines:P,place:"pots"},{id:"income",lines:B,place:"pots",sub:"income",href:"#/plan/"+e.id+"/income"},{id:"way",lines:H,place:"way"}],cn=[];o?cn.push(Z("openDocument","document"),Z("testLocked","test")):l||cn.push(Z("testPlan","test"));const Ct=Array.isArray(e.journey)?e.journey.filter(O=>O&&O.stage).map(O=>({stage:O.stage,on:ie(O.at),arrival:/arrival/i.test(String(O.note||""))})):[],L=Array.isArray(e.planDocumentArchive)?e.planDocumentArchive.length:0;return{done:i.key!=="unknown",result:p,figures:u,lines:d,buttons:cn,notes:f,sections:ln,options:nt,allOptions:ve,journey:Ct,pastVersions:L,lockedOn:o?ie(c):null}}function zl(t){const{plan:e,now:n,mon:s}=t,r={},i=[],o=Array.isArray(e.accumulationTool&&e.accumulationTool.history)?e.accumulationTool.history:[],l=Cl({accHistory:o,today:n}),a=l.source==="record"&&String(l.at)>=s;let c;if(l.source==="record"){r.pension=C(l.pension),l.isa!=null&&(r.isa=C(l.isa));const u=[x("pension")," pension"].concat(l.isa!=null?[", ",x("isa")," ISA"]:[]);i.push(U("pot.latest",u,r,re("record",l.recordedAt||l.at,n),{month:ce(l.at)})),c=a?K("pot.recorded",[x("pension")," recorded for "+ce(s)],r):K("pot.notYet",[zt(s)+"’s pot is not recorded yet"],r)}else c=K("pot.notYet",[zt(s)+"’s pot is not recorded yet"],r);return{done:a,result:c,figures:r,lines:i,buttons:[Z("recordPot","potRecord")],notes:[],recorded:a}}function ty(t){const{plan:e,now:n}=t,s=e.accumulationTool&&e.accumulationTool.settings||{},r={},i=[],o=C(s.netMonthly),l=C(s.employerMonthly),a=C(s.isaMonthly),c=Y(s.escalationPct),u=o>0||l>0||a>0;let d;if(u){r.you=o,r.employer=l;const f=[x("you")," a month from you, ",x("employer")," from your employer"];a>0&&(r.isaMonthly=a,f.push(", ",x("isaMonthly")," into ISAs and savings")),d=K("saving.payIn",f,r),i.push(U("saving.you",[x("you")," a month"],r,re("saved",null,n))),i.push(U("saving.employer",[x("employer")," a month"],r,re("saved",null,n))),a>0&&i.push(U("saving.isa",[x("isaMonthly")," a month"],r,re("saved",null,n))),c>0&&(r.rise=c,i.push(U("saving.rise",[Ue("rise"),"% a year"],r,re("saved",null,n))))}else d=K("saving.none",["Nothing paid in"],r);return{done:u,result:d,figures:r,lines:i,buttons:[Z("changeSaving","saving"),Z("onCourse","onCourse")],notes:["saving.notFrozen"]}}function ny(t){const{plan:e,now:n}=t,s=e.budgetTool&&e.budgetTool.settings||{},r=s.derived||{},i={},o=[],l=C(r.allInComfortableMonthly||r.comfortableMonthlyNet),a=C(r.essentialMonthlyNet),c=Array.isArray(s.lines)?s.lines.filter(f=>f&&Y(f.amount)>0).length:0,u=l>0&&c>0;let d;return u?(i.total=l,i.essentials=a,d=K("budget.total",[x("total")," a month after tax, ",x("essentials")," of it essentials. A guide only"],i),o.push(U("budget.totalLine",[x("total")," a month after tax"],i,re("budget",null,n))),o.push(U("budget.essentialsLine",[x("essentials")," a month after tax"],i,re("budget",null,n)))):d=K("budget.none",["Not worked out. A guide only"],i),{done:u,result:d,figures:i,lines:o,buttons:[Z("changeBudget","budget")],notes:["budget.guide"]}}function sy(t){const e=["lock.what"];return Bl.includes(t.stage.key)&&e.push("lock.saver"),{done:!1,result:K("lock.notLocked",["Not locked"],{}),figures:{},lines:[],buttons:[Z("lockIt","lock")],notes:e}}function ry(t){const{plan:e,now:n}=t,s=on(e.holdings),r=qp(s),i={},o=[],l=r.count>0;let a;if(l){i.pension=C(r.byWrapper.SIPP),i.isa=C(r.byWrapper.ISA);const c=re("hold",s.updatedAt||null,n),u=["Pension ",x("pension"),", ISA ",x("isa")];r.byWrapper.GIA>0&&(i.gia=C(r.byWrapper.GIA),u.push(", other account ",x("gia"))),r.byWrapper.CASH>0&&(i.cash=C(r.byWrapper.CASH),u.push(", cash ",x("cash"))),u.push(s.updatedAt?". Updated "+ie(s.updatedAt):""),a=K("hold.summary",u,i),i.lines=r.count,i.total=C(r.total),o.push(U("hold.total",[x("total")," across ",Ue("lines")," line"+(r.count===1?"":"s")],i,c))}else a=K("hold.none",["Not recorded yet"],i);return{done:l,result:a,figures:i,lines:o,buttons:[Z("changeHold","hold")],notes:[]}}function iy(t){const{plan:e,now:n}=t,s={},r=[];let i=null;try{i=Ig(e,{now:n})}catch{i=null}let o,l=!1;if(!i||!i.target||i.target.kind==="none")o=K("move.notSet",["Set when the plan is locked"],s);else if(i.diff.complete)o=K("move.done",["Done"],s),l=!0;else if(i.target.kind==="ladder"){const a=i.target.lines.length,c=i.diff.hold.filter(u=>Array.isArray(u.taxYears)).length;s.bought=c,s.rungs=a,o=K("move.gilts",[Ue("bought")," of ",Ue("rungs")," gilts bought"],s)}else s.movesDone=i.prog.doneCount,s.moves=i.prog.total,o=K("move.moves",[Ue("movesDone")," of ",Ue("moves")," moves done"],s);return i&&i.diff&&typeof i.diff.progressPct=="number"&&(s.heldPct=i.diff.progressPct,r.push(U("move.held",[Ue("heldPct"),"% of the plan’s mix held"],s,re("hold",on(e.holdings).updatedAt||null,n)))),{done:l,result:o,figures:s,lines:r,buttons:[Z("openMove","move")],notes:["move.optional"]}}function oy(t){const{plan:e,entries:n,now:s}=t,r=pi(n,e),i={},o=[],l=[],a=Pr(e),c=!!a&&!n.some(d=>d.plan.id===a);let u;if(r.length){const d=r[0],f=ys(d.plan,s),m=gs(f,d.plan,As(d.plan,s));u=K("household.with",["With ‘"+bn(d.plan)+"’"],i);for(const h of r){const _=ys(h.plan,s);o.push({id:"household.partner",slots:{name:bn(h.plan)},sentence:K("household.partner",[],i),source:re("saved",null,s),theirLine:gs(_,h.plan,As(h.plan,s)),theirId:String(h.plan.id)}),l.push(Rr("openPartner","#/plan/"+h.plan.id,{name:bn(h.plan)}))}const g=a&&r.some(h=>h.plan.id===a)?String(e.id):String(r[0].plan.id);return l.push({...Z("checkTogether","household"),planId:g}),{done:!0,result:u,figures:i,lines:o,buttons:l,notes:[],theirLine:m}}return c?{done:!1,result:K("household.notInAccount",["Your partner’s plan is not in this account"],i),figures:i,lines:o,buttons:[Z("linkOne","household")],notes:[]}:{done:!1,result:K("household.none",["No partner’s plan is linked"],i),figures:i,lines:o,buttons:[Z("linkOne","household")],notes:[]}}const ay={month:Hl,where:Xg,plan:ey,pot:zl,saving:ty,budget:ny,lock:sy,hold:ry,move:iy,household:oy};function ly(t,e){const{stage:n,readonly:s,plan:r,ss:i,locked:o,mon:l,ty:a,tyKey:c,now:u}=t,d=n.key,f=d==="bridge"||d==="running",m=e.month,g=e.pot,h=Vs(r),_=h.length?String(h[h.length-1].date).slice(0,7):null,E=Array.isArray(r.journey)&&r.journey.some(M=>M&&/arrival/i.test(String(M.note||""))),w=n.startMonth||null,y=n.hasRecords;let p=null;try{p=["saving","approaching","draft-retired","unknown"].includes(d)?Tm(i,{locked:o,hasRecords:y,now:u}):null}catch{p=null}const A=m?m.setUp:!!(r.decisionTool&&r.decisionTool.taxYears&&r.decisionTool.taxYears[c]&&r.decisionTool.taxYears[c].yearSetupComplete),v=m?m.recorded:!!_&&_>=l,b=g?g.recorded:!1,S=o?null:Hg(r,i),T={"P.readonly":()=>s,"P.noAge":()=>d==="unknown","P.arrive":()=>d==="running"&&n.timingMode==="future"&&!!w&&!(_&&_>=w)&&!E,"P.taxyear":()=>f&&!A,"P.month":()=>f&&!v,"P.idle":()=>f,"P.pot":()=>d==="committed-saving"&&!b,"P.working":()=>d==="committed-saving","P.recheck":()=>!!S,"P.stale":()=>!!p,"P.draft":()=>d==="draft-retired","P.approaching":()=>d==="approaching","P.saving":()=>d==="saving"},R=Pg.find(M=>T[M]()),k=(()=>{const M=Bs(l),N=M.m===12?{y:M.y+1,m:1}:{y:M.y,m:M.m+1};return Fn[N.m-1]})(),P={month:ce(l),monthName:zt(l),nextMonth:k,year:W(a),stop:ce(w)||"",savedYear:p?p.savedLabel:""},D="#/plan/"+r.id+"/about",I={"P.readonly":null,"P.noAge":Rr("addAge",D),"P.arrive":Z("record","month",{month:zt(l)}),"P.taxyear":Z("setUpYear","taxyear",{year:W(a)}),"P.month":Z("record","month",{month:zt(l)}),"P.idle":null,"P.pot":Z("recordPot","potRecord"),"P.working":Z("onCourse","onCourse"),"P.recheck":Z("recheck","test"),"P.stale":Rr("updateIt",D),"P.draft":Z("testPlan","test"),"P.approaching":Z("testPlan","test"),"P.saving":Z("onCourse","onCourse")};return{id:R||"P.saving",slots:P,button:R?I[R]:null,answerStale:S}}function cy(t,e,n,{today:s,source:r="account"}={}){const i=xt(s),o=(t||[]).filter(k=>k&&k.plan&&typeof k.plan=="object"&&k.plan.id!=null),l=o.find(k=>String(k.plan.id)===String(e))||null;if(!l)return{found:!1,id:String(e||"")};const a=l.plan,c=!!(l.newer||l.failed),u=ys(a,i),d=As(a,i),f=a.decisionTool&&a.decisionTool.settings||{},m=ms(a),g=pi(o,a),h=we(i),_={plan:a,entries:o,now:i,ss:d,ds:f,stage:u,locked:m,readonly:c,mon:Sg(i),ty:h,tyKey:li(h),source:r},E=Fl(u.key,{locked:m,linked:g.length>0,manyPlans:o.length>1}),w=E.map(k=>k.id),y=n&&kg.includes(n)?n:null,p=y||w[0],A=y&&!w.includes(y)?[...E,{id:y,optional:!0,listed:!1}]:E,v={};for(const k of A)try{v[k.id]=ay[k.id](_)}catch(P){v[k.id]={done:!1,result:K(k.id+".failed",["Could not be read"],{}),figures:{},lines:[],buttons:[],notes:[],error:P&&P.message}}!v.month&&["bridge","running"].includes(u.key)&&(v.month=Hl(_)),!v.pot&&u.key==="committed-saving"&&(v.pot=zl(_));const b=A.map(k=>{const P=v[k.id],D=c?P.buttons.filter(I=>I.href):P.buttons;return{id:k.id,optional:!!k.optional,listed:k.listed!==!1,state:k.id===p?"current":P.done?"done":"open",...P,buttons:D}}),{answerStale:S,...T}=ly(_,v),R=Mg(u.key,{locked:m,linked:g.length>0,manyPlans:o.length>1});return{found:!0,id:String(a.id),name:bn(a),stageKey:u.key,retired:Io.includes(u.key),saver:Bl.includes(u.key),line:gs(u,a,d),locked:m,lockedOn:m?ie(Us(a)):null,readonly:c,source:r,steps:b,subSteps:R,current:p,answerStale:S||null,next:c?{...T,button:null}:T,askLinks:Io.includes(u.key)?["c"]:["a","b"]}}const Ft=t=>!!t&&typeof t=="object"&&!Array.isArray(t),se=t=>t==null||t===""||!Number.isFinite(+t)?null:+t,yt=t=>t==null||typeof t=="string"&&t.trim()==="",uy=t=>!!(t&&t.decisionTool&&t.decisionTool.settings&&t.decisionTool.settings.locked),xo=t=>t&&t.decisionTool&&t.decisionTool.settings&&t.decisionTool.settings.lockedAt||t&&t.planDocument&&t.planDocument.lockedAt||null,Co=t=>t&&t.planDetails&&typeof t.planDetails.name=="string"&&t.planDetails.name||t&&typeof t.name=="string"&&t.name||"",Lo=t=>t&&t.household&&typeof t.household.partnerScenarioId=="string"&&t.household.partnerScenarioId||null,Vo=t=>t===void 0?void 0:JSON.parse(JSON.stringify(t)),ot=t=>t===void 0?"<absent>":JSON.stringify(t),vs=t=>Math.round(t*100)/100,dy=t=>[...new Set(t)],$=t=>"£"+String(Math.abs(Math.round(Number(t)||0))).replace(/\B(?=(\d{3})+(?!\d))/g,","),hy=t=>{const e=Math.abs(Number(t)||0),n=Math.floor(e+1e-9),s=Math.round((e-n)*100);return $(n)+"."+String(s).padStart(2,"0")},fy="Final-salary pension",py=t=>/^\s*final[\s-]?salary(\s+pension)?\s*$/i.test(String(t??"")),Bo=t=>Math.abs(+t-ht.fullStatePensionWeekly)<.005,fn=(t,e)=>Math.round(+t)-Math.round(+e),Pt=(t,e)=>Math.round(+e)+Math.round(+t||0),my=(t,e)=>+t.dbStartAge>0?Math.round(+t.dbStartAge):Pt(+t.dbStartYear||0,e);function ql(t,e){const n=Math.floor(+t.currentAge||0);if(!(n>0))return null;const s=/^\d{4}-\d{2}-\d{2}/.test(String(t.currentAgeAsOf||""))?String(t.currentAgeAsOf).slice(0,10):e,r=yc(Ac(n,s));return vc(s,r-n)}function gy(t,e,n){if(!(se(t.currentAge)>0))return!1;const[s,r,i]=ht.pensionAccess.changesOn.split("-").map(Number),o=new Date(s,r-1,i);if(n.getTime()>=o.getTime())return!1;let l=n;if(e.mode==="future"&&e.startMonth){const[u,d]=String(e.startMonth).split("-").map(Number);u>0&&d>0&&(l=new Date(u,d-1,1))}if(l.getTime()>=o.getTime())return!1;let a=!1;try{a=kl(t)>0}catch{a=!1}if(a=a||se(t.potAtRetirement&&t.potAtRetirement.sipp)>0||se(t.strategyParams&&t.strategyParams.sippTotal)>0,!a)return!1;const c=Bn(t,o,n);return c!=null&&c>=ht.pensionAccess.before&&c<ht.pensionAccess.from}function Mr(t,e,n,{dateText:s,weekly:r,now:i}){const o=s?Cs(String(s)):null;if(r>0&&o){const a=El({...t,spStartDate:s,spWeeklyAmount:r,firstTaxYear:e.firstTaxYear,shapeAgeNow:n},i),c=we(o),u=Pt(a?a.spStartYear:0,n);return{kind:Bo(r)?"full":"forecast",weekly:r,yearly:vs(r*52),date:String(s),dateWords:ie(Ul(o)),fromAge:u,taxYear:c,beforeStart:c<e.firstTaxYear,dated:!0}}if(r>0){const a=_i({...t,shapeAgeNow:n});return{kind:Bo(r)?"full":"forecast",weekly:r,yearly:vs(r*52),date:null,dateWords:null,fromAge:a===999?null:Pt(a,n),taxYear:a===999?null:e.firstTaxYear+a,beforeStart:!1,dated:!1}}const l=se(t.statePension)||0;if(l>0){const a=_i({...t,shapeAgeNow:n});return{kind:"assumed",weekly:null,yearly:l,date:s?String(s):null,dateWords:null,fromAge:a===999?null:Pt(a,n),taxYear:a===999?null:e.firstTaxYear+a,beforeStart:!1,dated:!1}}return{kind:"none",weekly:null,yearly:0,date:s?String(s):null,dateWords:null,fromAge:null,taxYear:null,beforeStart:!1,dated:!1}}function mi(t,{today:e}){const n=xt(e),s=uy(t),r=s?t.planDocument:null,i=hi(t,n),o=t&&t.stressTool&&Ft(t.stressTool.settings)?t.stressTool.settings:{};let l=Fs(i,n),a=se(i.duration)||35;if(r&&Ft(r.timing)){const p=r.timing;l={...l,mode:p.mode||l.mode,firstTaxYear:se(p.firstTaxYear)||l.firstTaxYear,shapeAgeNow:se(p.shapeAgeNow)||l.shapeAgeNow,startMonth:p.startMonth||l.startMonth},a=Array.isArray(r.timeline)&&r.timeline.length||se(r.assumptions&&r.assumptions.duration)||a}const c=l.shapeAgeNow,u=c+a-1,d=s?{kind:"locked",at:ie(xo(t))}:{kind:"saved",at:t&&t.lastModified?ie(t.lastModified):null},f=r&&Ft(r.assumptions)?r.assumptions.spStartDate||null:i.spStartDate||null,m=r&&Ft(r.assumptions)?se(r.assumptions.spWeeklyAmount)||0:se(i.spWeeklyAmount)||0,g=Mr(i,l,c,{dateText:f,weekly:m,now:n}),h=Array.isArray(o.extraIncomes)?o.extraIncomes:Array.isArray(i.extraIncomes)?i.extraIncomes:[],_=Array.isArray(o.windfalls)?o.windfalls:Array.isArray(i.windfalls)?i.windfalls:[],E=[],w=[],y=[];return se(i.dbAmount)>0&&E.push({id:"0",amount:se(i.dbAmount),fromAge:my(i,c),rises:vi.includes(i.dbIndexation)?i.dbIndexation:"lpi5",from:"db",row:null}),h.forEach((p,A)=>{if(!Ft(p)||!(se(p.annual)>0))return;const v={amount:se(p.annual),fromAge:Pt(se(p.startYear)||0,c),rises:vi.includes(p.indexation)?p.indexation:"lpi5",from:"row",row:A};p.endYear==null&&py(p.label)?E.push({...v,id:String(E.length)}):w.push({...v,id:String(w.length),label:typeof p.label=="string"?p.label:"",toAge:p.endYear==null?null:Pt(se(p.endYear)||0,c)})}),_.forEach((p,A)=>{!Ft(p)||!(se(p.amount)>0)||se(p.year)==null||y.push({id:String(y.length),label:typeof p.label=="string"?p.label:"",amount:se(p.amount),atAge:Pt(se(p.year),c),wrapper:mc.includes(p.wrapper)?p.wrapper:"cash",from:"row",row:A})}),{locked:s,lockedOn:s?ie(xo(t)):null,ss:i,stored:o,timing:l,duration:a,ageNow:c,endAge:u,source:d,sp:g,fs:E,other:se(i.other)||0,streams:w,lumps:y,rows:h,wrows:_,note2028:gy(i,l,n)}}function Jl(t,{today:e}){const n=mi(t,{today:e}),s={spKind:n.sp.kind};n.sp.weekly!=null&&(s.spWeekly=String(n.sp.weekly)),n.other>0&&(s.other=String(n.other));for(const r of Nr){s[r+".ids"]=n[r].map(i=>i.id).join(",");for(const i of n[r])for(const o of ir[r].fields){const l=i[o.path];l==null||l===""||(s[`${r}.${i.id}.${o.path}`]=String(l))}}return s}const Fo=t=>sa.find(e=>e.path===t);function yy(t,e){if(yt(t))return{error:e.required?"required":null,value:null};const n=String(t).trim();if(!/^\d{1,3}$/.test(n))return{error:"notANumber",value:null};const s=+n;return s<e.min?{error:"tooLow",value:s}:s>e.max?{error:"tooHigh",value:s}:{error:null,value:s}}function Or(t,e){if(yt(t))return{error:e.required?"required":null,value:null};const n=String(t).replace(/[£,\s]/g,"");if(!/^\d{1,9}(\.\d{1,2})?$/.test(n))return{error:"notANumber",value:null};const s=vs(+n);return s<e.min?{error:"tooLow",value:s}:s>e.max?{error:"tooHigh",value:s}:{error:null,value:s}}function Ay(t,e){if(e.type==="age")return yy(t,e);if(e.type==="money")return Or(t,e);if(e.type==="choice"){const s=yt(t)?e.default:String(t);return e.options.includes(s)?{error:null,value:s}:{error:"notAnOption",value:null}}const n=yt(t)?"":String(t).trim();return e.max&&n.length>e.max?{error:"tooLong",value:null}:{error:null,value:n}}function vy(t){return t.sp.kind==="assumed"?["full","forecast","none","assumed"]:["full","forecast","none"]}function Ql(t,e,{today:n}){const s=xt(n),r=mi(t,{today:n}),i={...Jl(t,{today:n}),...e||{}},o={},l={},a={spKind:!0,spWeekly:!1,other:!0},c=vy(r),u=yt(i.spKind)?null:String(i.spKind);if(u?c.includes(u)?o.spKind=u:l.spKind="notAnOption":l.spKind="required",a.spWeekly=u==="forecast",a.spWeekly){const g=Or(i.spWeekly,Fo("spWeekly"));g.error?l.spWeekly=g.error:o.spWeekly=g.value}else u==="full"&&(o.spWeekly=ht.fullStatePensionWeekly);{const g=Or(i.other,Fo("other"));g.error?l.other=g.error:o.other=g.value==null?0:g.value}const d={};for(const g of Nr){const h=i[g+".ids"],_=dy((yt(h)?[]:String(h).split(",")).map(w=>w.trim()).filter(w=>ra(w))),E=_.map(w=>{const y=r[g].find(b=>b.id===w)||null,p={id:w,saved:y,values:{},fields:[]};for(const b of ir[g].fields){const S=`${g}.${w}.${b.path}`,T=i[S],R=Ay(T,b);p.fields.push({path:S,type:b.type,options:b.options||null,applies:!0,shown:yt(T)?b.type==="choice"?b.default:"":String(T),saved:y&&y[b.path]!=null&&y[b.path]!==""?String(y[b.path]):null,error:R.error}),R.error?l[S]=R.error:p.values[b.path]=R.value}const A=p.values,v=(b,S)=>{l[`${g}.${w}.${b}`]=S;const T=p.fields.find(R=>R.path===`${g}.${w}.${b}`);T&&(T.error=S),delete A[b]};return g==="fs"&&A.fromAge!=null&&A.fromAge>r.endAge&&v("fromAge","afterEnd"),g==="streams"&&A.fromAge!=null&&A.fromAge>r.endAge&&v("fromAge","afterEnd"),g==="streams"&&A.fromAge!=null&&A.toAge!=null&&A.toAge<A.fromAge&&v("toAge","beforeFrom"),g==="lumps"&&A.atAge!=null&&A.atAge<r.ageNow&&v("atAge","beforeStart"),g==="lumps"&&A.atAge!=null&&A.atAge>r.endAge&&v("atAge","afterEnd"),p.ok=ir[g].fields.every(b=>!l[`${g}.${w}.${b.path}`]),p});d[g]={ids:_,cards:E}}let f=r.sp;return u==="none"?(f=Mr(r.ss,r.timing,r.ageNow,{dateText:r.sp.date,weekly:0,now:s}),f={...f,kind:"none",yearly:0}):(u==="full"||u==="forecast")&&o.spWeekly!=null&&(f=Mr(r.ss,r.timing,r.ageNow,{dateText:r.sp.date||ql(r.ss,n),weekly:o.spWeekly,now:s})),{ok:Object.keys(l).length===0,values:o,lists:d,errors:l,applies:a,offered:c,saved:r,sp:f}}const _y={fs:["amount","fromAge","rises"],streams:["label","amount","fromAge","toAge","rises"],lumps:["label","amount","atAge","wrapper"]},Xl=(t,e,n)=>!!e&&_y[n].every(s=>ot(t.values[s]==null?null:t.values[s])===ot(e[s]==null?null:e[s]));function Uo(t,e,n,s){const r=e.values;return t==="lumps"?{...n||{},label:r.label||"",amount:r.amount,year:fn(r.atAge,s),wrapper:r.wrapper}:t==="fs"?{...n||{},label:n&&typeof n.label=="string"&&n.label?n.label:fy,annual:r.amount,startYear:fn(r.fromAge,s),endYear:null,indexation:r.rises}:{...n||{},label:r.label||"",annual:r.amount,startYear:fn(r.fromAge,s),endYear:r.toAge==null?null:fn(r.toAge,s),indexation:r.rises}}function Go(t,e){const n=e.map(r=>({slots:r.slots,k:0,seq:r.placed.map(({card:i,L:o,ageNow:l})=>{const a=i.saved;return a&&a.from==="row"?Xl(i,a,o)?t[a.row]:Uo(o,i,t[a.row],l):Uo(o,i,null,l)})})),s=[];t.forEach((r,i)=>{const o=n.find(l=>l.slots.has(i));o?o.k<o.seq.length&&s.push(o.seq[o.k++]):s.push(r)});for(const r of n)s.push(...r.seq.slice(r.k));return s}function Zl(t,e,{today:n}){const s=Ql(t,e,{today:n});if(!s.ok)return{ok:!1,errors:s.errors,patch:{},previous:{}};if(s.saved.locked)return{ok:!1,errors:{plan:"locked"},patch:{},previous:{}};const r=s.saved,i=r.ageNow,o={},l=s.values.spKind;if(l!=="assumed"&&(l!==r.sp.kind||l==="forecast"&&s.values.spWeekly!==r.sp.weekly)){if(l==="none")o.spWeeklyAmount=0,o.statePension=0;else if(o.spWeeklyAmount=s.values.spWeekly,o.statePension=vs(s.values.spWeekly*52),!r.sp.date){const h=ql(r.ss,n);h&&(o.spStartDate=h)}}s.values.other!==(se(r.ss.other)||0)&&(o.other=s.values.other);const c=s.lists.fs.cards,u=c[0]||null;u?u.saved&&u.saved.from==="db"&&Xl(u,u.saved,"fs")||(o.dbAmount=u.values.amount,o.dbStartYear=fn(u.values.fromAge,i),o.dbStartAge=u.values.fromAge,o.dbIndexation=u.values.rises):se(r.ss.dbAmount)>0&&(o.dbAmount=0);const d=Go(r.rows,[{slots:new Set(r.fs.filter(h=>h.from==="row").map(h=>h.row)),placed:c.slice(1).map(h=>({card:h,L:"fs",ageNow:i}))},{slots:new Set(r.streams.map(h=>h.row)),placed:s.lists.streams.cards.map(h=>({card:h,L:"streams",ageNow:i}))}]);ot(d)!==ot(r.rows)&&(o.extraIncomes=d);const f=Go(r.wrows,[{slots:new Set(r.lumps.map(h=>h.row)),placed:s.lists.lumps.cards.map(h=>({card:h,L:"lumps",ageNow:i}))}]);ot(f)!==ot(r.wrows)&&(o.windfalls=f);const m={},g={};for(const h of gc){const _=h.split(".").pop();if(!(_ in o))continue;const E=di(t,h),w=o[_];ot(E)!==ot(w)&&(E===void 0&&(w===null||w===0)||(m[h]=Vo(w),g[h]=Vo(E)))}return{ok:!0,errors:{},patch:m,previous:g}}const Yo=(t,e,n)=>W(t.firstTaxYear+(n-e)),by=t=>t===1?"1 year":String(t)+" years";function Ty(t){const{sp:e,fs:n,other:s,streams:r,lumps:i,ageNow:o,timing:l}=t,a=[];e.kind==="none"?a.push({id:"sp.none",slots:{}}):e.kind==="assumed"?a.push({id:e.fromAge!=null?"sp.assumed":"sp.assumedNoAge",slots:{yearly:$(e.yearly),age:e.fromAge}}):e.beforeStart?a.push({id:"sp.before",slots:{yearly:$(e.yearly),date:e.dateWords}}):e.fromAge!=null?a.push({id:e.dated?"sp.paid":"sp.noDate",slots:{yearly:$(e.yearly),age:e.fromAge,year:W(e.taxYear)}}):a.push({id:"sp.noDateNoAge",slots:{yearly:$(e.yearly)}}),n.forEach((c,u)=>{c.fromAge<o?a.push({id:"fs.before",slots:{n:u+1,amount:$(c.amount),age:c.fromAge,ageNow:o,rises:c.rises}}):a.push({id:"fs.line",slots:{n:u+1,amount:$(c.amount),age:c.fromAge,year:Yo(l,o,c.fromAge),rises:c.rises}})}),s>0&&a.push({id:"other.line",slots:{amount:$(s)}});for(const c of r){const u=c.label||"Income for some years";c.toAge==null?a.push({id:"stream.life",slots:{label:u,amount:$(c.amount),from:c.fromAge,rises:c.rises}}):a.push({id:"stream.line",slots:{label:u,amount:$(c.amount),from:c.fromAge,to:c.toAge,years:by(c.toAge-c.fromAge+1),rises:c.rises}})}for(const c of i)a.push({id:"lump.line",slots:{label:c.label||"Lump sum",amount:$(c.amount),age:c.atAge,year:Yo(l,o,c.atAge),what:c.wrapper}});return t.note2028&&a.push({id:"drawdown2028",slots:{from:ht.pensionAccess.from,day:"5 April "+ht.pensionAccess.changesOn.slice(0,4)}}),a}function Sy(t){return[]}function wy(t){const e=t.saved,n=s=>t.lists[s].cards.filter(r=>r.ok).map(r=>({...r.values}));return{sp:t.sp,fs:n("fs"),other:t.values.other==null?e.other:t.values.other,streams:n("streams"),lumps:n("lumps"),ageNow:e.ageNow,timing:e.timing,note2028:e.note2028}}function Iy(t,e,{today:n,typed:s=null}={}){const r=(t||[]).filter(p=>p&&p.plan&&typeof p.plan=="object"&&p.plan.id!=null),i=r.find(p=>String(p.plan.id)===String(e))||null;if(!i)return{found:!1,id:String(e||"")};const o=i.plan,l=!!(i.newer||i.failed),a=mi(o,{today:n}),c=!a.locked&&!l,u=Jl(o,{today:n}),d=Ql(o,s||{},{today:n}),f={...u,...s||{}},m=sa.map(p=>({path:p.path,type:p.type,options:p.type==="choice"?p.path==="spKind"?d.offered:p.options:null,applies:d.applies[p.path]!==!1,shown:yt(f[p.path])?"":String(f[p.path]),saved:p.path in u?u[p.path]:null,error:d.errors[p.path]||null})),g={};for(const p of Nr)g[p]={ids:d.lists[p].ids,cards:d.lists[p].cards.map(A=>({id:A.id,saved:!!A.saved,fields:A.fields}))};const h=wy(d),_=Ty(h);o.planDocument&&o.planDocument.strategy&&o.planDocument.strategy.id||a.ss.strategyId;const E=r.filter(p=>p.plan.id!==o.id&&(p.plan.id===Lo(o)||Lo(p.plan)===o.id)).map(p=>({id:String(p.plan.id),name:Co(p.plan)})),w=c&&d.ok?Zl(o,s||{},{today:n}):{patch:{},previous:{}},y=h.sp.kind==="none"?{sp:"none"}:h.sp.kind==="assumed"?{sp:"assumed",yearly:$(h.sp.yearly),age:h.sp.fromAge}:h.sp.fromAge!=null?{sp:"paid",yearly:$(h.sp.yearly),age:h.sp.fromAge}:{sp:"paidNoAge",yearly:$(h.sp.yearly)};return{found:!0,id:String(o.id),name:Co(o),locked:a.locked,lockedOn:a.lockedOn,readonly:l,editable:c,source:a.source,ageNow:a.ageNow,endAge:a.endAge,fullYearly:$(ht.fullStatePensionWeekly*52),spSaved:{kind:a.sp.kind,weekly:a.sp.weekly==null?null:hy(a.sp.weekly),yearly:$(a.sp.yearly),age:a.sp.fromAge,dateWords:a.sp.dateWords},assumed:a.sp.kind==="assumed"?{yearly:$(a.sp.yearly),age:a.sp.fromAge}:null,fields:m,lists:g,errors:d.errors,ok:d.ok,derived:_,notUsed:Sy(),partners:E,changed:Object.keys(w.patch).length>0,patch:w.patch,previous:w.previous,savedLine:d.ok?{id:"income",slots:{...y,fs:h.fs.length,streams:h.streams.length,lumps:h.lumps.length}}:null}}const Et=t=>!!t&&typeof t=="object"&&!Array.isArray(t),me=t=>t==null||t===""||!Number.isFinite(+t)?null:+t,Je=t=>t==null||typeof t=="string"&&t.trim()==="",Ey=t=>!!(t&&t.decisionTool&&t.decisionTool.settings&&t.decisionTool.settings.locked),$o=t=>t&&t.decisionTool&&t.decisionTool.settings&&t.decisionTool.settings.lockedAt||t&&t.planDocument&&t.planDocument.lockedAt||null,jo=t=>t&&t.planDetails&&typeof t.planDetails.name=="string"&&t.planDetails.name||t&&typeof t.name=="string"&&t.name||"",Ko=t=>t&&t.household&&typeof t.household.partnerScenarioId=="string"&&t.household.partnerScenarioId||null,Wo=t=>t===void 0?void 0:JSON.parse(JSON.stringify(t)),_s=t=>t===void 0?"<absent>":JSON.stringify(t),ky=t=>[...new Set(t)],Dr=t=>Math.round(+t||0),bt=(t,e)=>Math.round(je(t,e)/12),bs=(t,e)=>Math.round(_t(t*12,e)),Py=(t,e)=>t.glideToNext&&e?"glides":+t.decline>0?"falls":"level";function gi(t,e,n,s,r){let i=me(t.other)||0;const o=me(t.spWeeklyAmount)||0;if(o>0){let a=null;try{a=El({...t,spWeeklyAmount:o,shapeAgeNow:n,currentAge:me(t.currentAge)||n,firstTaxYear:e.firstTaxYear},r)}catch{a=null}a&&s>=(a.spStartYear??99)&&(i+=o*52)}const l=me(t.dbAmount)||0;l>0&&s>=(me(t.dbStartYear)||0)&&(i+=l);for(const a of Array.isArray(t.extraIncomes)?t.extraIncomes:[])Et(a)&&+a.annual>0&&s>=(+a.startYear||0)&&(a.endYear==null||s<=+a.endYear)&&(i+=+a.annual);return i}function yi(t,e,n,s,r,i,o){return Array.from({length:i+1},(l,a)=>Math.round(Math.max(0,Tn(t,r+a,e),gi(n,s,r,a,o))))}function Ry(t,e,n=0){const s=+t||0,r=o=>Math.max(o,n||0),i=[{fromAge:e,amount:s}];return e<75&&i.push({fromAge:75,amount:Math.round(r(s*.85)/500)*500}),e<85&&i.push({fromAge:85,amount:Math.round(r(s*.7)/500)*500}),i}function My(t,e){const n=t&&t.budgetTool&&Et(t.budgetTool.settings)?t.budgetTool.settings:{},s=Et(n.derived)?n.derived:{},r=Dr(s.allInComfortableMonthly||s.comfortableMonthlyNet),i=Dr(s.essentialMonthlyNet),o=Array.isArray(n.lines)?n.lines.filter(a=>a&&(me(a.amount)>0||me(a.annual)>0)).length:0,l=r>0&&o>0;return{workedOut:l,total:l?r:null,essentials:l&&i>0?i:null,essentialsAnnualNet:l&&me(s.essentialAnnualNet)||0,at:t&&t.lastModified?ie(t.lastModified):null}}function Ai(t,{today:e}){const n=xt(e),s=Ey(t),r=s?t.planDocument:null,i=hi(t,n),o=t&&t.stressTool&&Et(t.stressTool.settings)?t.stressTool.settings:{};let l=Fs(i,n),a=me(i.duration)||35;if(r&&Et(r.timing)){const S=r.timing;l={...l,mode:S.mode||l.mode,firstTaxYear:me(S.firstTaxYear)||l.firstTaxYear,shapeAgeNow:me(S.shapeAgeNow)||l.shapeAgeNow,startMonth:S.startMonth||l.startMonth},a=Array.isArray(r.timeline)&&r.timeline.length||me(r.assumptions&&r.assumptions.duration)||a}const c=l.shapeAgeNow,u=c+a-1,d=Gl(i),f=s?{kind:"locked",at:ie($o(t))}:{kind:"saved",at:t&&t.lastModified?ie(t.lastModified):null};let m=[];if(r&&Array.isArray(r.steps)&&r.steps.length)m=r.steps.map((S,T)=>({fromAge:+S.fromAge,amount:+S.amount,decline:+S.decline||0,glideToNext:!!S.glideToNext,row:T}));else{const S=i.incomeShape==="phases"&&Array.isArray(i.incomeSteps)?i.incomeSteps:[];m=Ts(S.map((R,k)=>Et(R)?{...R,row:k}:null)).map(R=>({fromAge:+R.fromAge,amount:+R.amount,decline:+R.decline||0,glideToNext:!!R.glideToNext,row:R.row}))}const g=m.length===0;g&&(m=[{fromAge:c,amount:Dr(Array.isArray(i.targetSchedule)&&i.targetSchedule.length?i.targetSchedule[0]:i.baseSalary),decline:0,glideToNext:!1,row:null}]);const h=m.map((S,T)=>({...S,then:Py(S,T<m.length-1),fallsPct:+S.decline>0?+S.decline:null,monthly:bt(S.amount,d)})),_={...h[0],id:"first"},E=h.slice(1).map((S,T)=>({...S,id:String(T)})),w=_.amount,y=m.map(S=>({fromAge:S.fromAge,amount:S.amount,decline:S.decline,glideToNext:S.glideToNext})),p=Array.isArray(i.targetSchedule)&&i.targetSchedule.length?i.targetSchedule.map(S=>+S||0):yi(y,w,i,l,c,a,n),A=Array.isArray(o.extraWithdrawals)?o.extraWithdrawals:Array.isArray(i.extraWithdrawals)?i.extraWithdrawals:[],v=[];A.forEach((S,T)=>{if(!Et(S)||!(me(S.amount)>0)||me(S.year)==null)return;const R=Math.round(me(S.year)),k=p[Math.min(Math.max(0,R),p.length-1)]||0,P=Math.round(je(k+me(S.amount),d)-je(k,d));v.push({id:String(v.length),label:typeof S.label=="string"?S.label:"",amount:P,gross:me(S.amount),atAge:c+R,years:Math.max(1,Math.round(me(S.years)||1)),prices:S.indexation==="level"?"fixed":"rise",row:T})});const b=t&&t.planDocument&&t.planDocument.strategy&&t.planDocument.strategy.id||i.strategyId||"pots-and-valves";return{locked:s,lockedOn:s?ie($o(t)):null,ss:i,stored:o,timing:l,duration:a,ageNow:c,endAge:u,bands:d,source:f,flat:g,first:_,steps:E,plainSteps:y,base:w,schedule:p,costs:v,xrows:A,budget:My(t),strategyId:b,now:n}}function ec(t,{today:e}){const n=Ai(t,{today:e}),s={"first.amount":String(n.first.monthly),"first.then":n.first.then};n.first.fallsPct!=null&&(s["first.fallsPct"]=String(n.first.fallsPct)),s["steps.ids"]=n.steps.map(r=>r.id).join(",");for(const r of n.steps)s[`steps.${r.id}.fromAge`]=String(r.fromAge),s[`steps.${r.id}.amount`]=String(r.monthly),s[`steps.${r.id}.then`]=r.then,r.fallsPct!=null&&(s[`steps.${r.id}.fallsPct`]=String(r.fallsPct));s["costs.ids"]=n.costs.map(r=>r.id).join(",");for(const r of n.costs)for(const i of Wn.costs.fields){const o=r[i.path];o==null||o===""||(s[`costs.${r.id}.${i.path}`]=String(o))}return s}function Oy(t,e){if(Je(t))return{error:e.required?"required":null,value:e.default!=null?e.default:null};const n=String(t).trim();if(!/^\d{1,3}$/.test(n))return{error:"notANumber",value:null};const s=+n;return s<e.min?{error:"tooLow",value:s}:s>e.max?{error:"tooHigh",value:s}:{error:null,value:s}}function tc(t,e){if(Je(t))return{error:e.required?"required":null,value:null};const n=String(t).replace(/[£,\s]/g,"");if(!/^\d{1,9}(\.\d{1,2})?$/.test(n))return{error:"notANumber",value:null};const s=Math.round(+n);return s<e.min?{error:"tooLow",value:s}:s>e.max?{error:"tooHigh",value:s}:{error:null,value:s}}function nc(t,e){if(Je(t))return{error:e.required?"required":null,value:null};const n=String(t).replace(/[%\s]/g,"");if(!/^\d{1,2}(\.\d{1,2})?$/.test(n))return{error:"range",value:null};const s=+n;return s<e.min||s>e.max||Math.abs(s/e.step-Math.round(s/e.step))>1e-9?{error:"range",value:s}:{error:null,value:s}}function Ho(t,e){if(e.type==="age"||e.type==="count")return Oy(t,e);if(e.type==="money")return tc(t,e);if(e.type==="percent")return nc(t,e);if(e.type==="choice"){const s=Je(t)?e.default:String(t);return e.options.includes(s)?{error:null,value:s}:{error:"notAnOption",value:null}}const n=Je(t)?"":String(t).trim();return e.max&&n.length>e.max?{error:"tooLong",value:null}:{error:null,value:n}}const nr=t=>ia.find(e=>e.path===t);function sc(t,e,{today:n}){const s=Ai(t,{today:n}),r={...ec(t,{today:n}),...e||{}},i={first:{}},o={},l=s.bands,a=tc(r["first.amount"],nr("first.amount"));a.error?o["first.amount"]=a.error:i.first.amount=a.value;const c=Ho(r["first.then"],nr("first.then"));c.error?o["first.then"]=c.error:i.first.then=c.value;const u={"first.amount":!0,"first.then":!0,"first.fallsPct":i.first.then==="falls"};if(u["first.fallsPct"]){const h=nc(r["first.fallsPct"],nr("first.fallsPct"));h.error?o["first.fallsPct"]=h.error:i.first.fallsPct=h.value}const d={};for(const h of oa){const _=r[h+".ids"],E=ky((Je(_)?[]:String(_).split(",")).map(y=>y.trim()).filter(y=>ra(y))),w=E.map(y=>{const p=s[h].find(S=>S.id===y)||null,A={id:y,saved:p,values:{},fields:[]};for(const S of Wn[h].fields){const T=`${h}.${y}.${S.path}`,R=r[T],k=!S.when||Object.entries(S.when).every(([D,I])=>(Je(r[`${h}.${y}.${D}`])?Wn[h].fields.find(M=>M.path===D).default:String(r[`${h}.${y}.${D}`]))===I),P=k?Ho(R,S):{error:null,value:null};A.fields.push({path:T,type:S.type,options:S.options||null,applies:k,shown:Je(R)?S.type==="choice"||S.default!=null?String(S.default):"":String(R),saved:p&&p[S.path]!=null&&p[S.path]!==""?String(p[S.path]):null,error:P.error}),P.error?o[T]=P.error:k&&(A.values[S.path]=P.value)}const v=A.values,b=(S,T)=>{o[`${h}.${y}.${S}`]=T;const R=A.fields.find(k=>k.path===`${h}.${y}.${S}`);R&&(R.error=T),delete v[S]};return h==="steps"&&v.fromAge!=null&&v.fromAge<=s.first.fromAge&&b("fromAge","beforeStart"),h==="steps"&&v.fromAge!=null&&v.fromAge>s.endAge&&b("fromAge","afterEnd"),h==="costs"&&v.atAge!=null&&v.atAge<s.ageNow&&b("atAge","beforeStart"),h==="costs"&&v.atAge!=null&&v.atAge>s.endAge&&b("atAge","afterEnd"),h==="costs"&&v.atAge!=null&&v.years!=null&&v.years>s.endAge-v.atAge+1&&b("years","tooManyYears"),A});if(h==="steps"){const y=new Map;for(const A of w)A.values.fromAge!=null&&y.set(A.values.fromAge,(y.get(A.values.fromAge)||0)+1);for(const A of w){const v=A.values.fromAge;v==null||y.get(v)<2||(o[`steps.${A.id}.fromAge`]="sameAge",A.fields.find(b=>b.path===`steps.${A.id}.fromAge`).error="sameAge",delete A.values.fromAge)}const p=w.filter(A=>A.values.fromAge!=null).sort((A,v)=>A.values.fromAge-v.values.fromAge).pop();p&&p.values.then==="glides"&&(o[`steps.${p.id}.then`]="glidesLast",p.fields.find(A=>A.path===`steps.${p.id}.then`).error="glidesLast",delete p.values.then),!w.length&&i.first.then==="glides"&&(o["first.then"]="glidesLast",delete i.first.then)}for(const y of w)y.ok=Wn[h].fields.every(p=>!o[`${h}.${y.id}.${p.path}`]);d[h]={ids:E,cards:w}}const f=Object.keys(o).length===0;let m=null,g=null;if(f){const h=(E,w,y)=>({fromAge:w,amount:y&&E.amount===y.monthly?y.amount:bs(E.amount,l),decline:E.then==="falls"?E.fallsPct:0,glideToNext:E.then==="glides"}),_=[h(i.first,s.first.fromAge,s.first),...d.steps.cards.map(E=>h(E.values,E.values.fromAge,E.saved))].sort((E,w)=>E.fromAge-w.fromAge);m=_,g=yi(_,_[0].amount,s.ss,s.timing,s.ageNow,s.duration,s.now)}return{ok:f,values:i,lists:d,errors:o,applies:u,saved:s,shape:m,schedule:g}}const zo=["fromAge","amount","then","fallsPct"],qo=["label","amount","atAge","years","prices"],dn=(t,e,n)=>t.every(s=>_s(e[s]==null?null:e[s])===_s(n[s]==null?null:n[s]));function Jo(t,e,n,s,r=null){const i=r&&t.amount===r.monthly?r.amount:bs(t.amount,s),o=t.then==="falls"?t.fallsPct:0,l=t.then==="glides",a={...n||{},fromAge:e,amount:i};return(o>0||n&&"decline"in n)&&(a.decline=o),(l||n&&"glideToNext"in n)&&(a.glideToNext=l),a}function Dy(t,e,n,s,r){const i=t.atAge-n,o=s[Math.min(Math.max(0,i),s.length-1)]||0,l=Math.round(_t(je(o,r)+t.amount,r)-_t(je(o,r),r));return{...e||{},label:t.label||"",amount:Math.max(1,l),year:i,years:t.years==null?1:t.years,indexation:t.prices==="fixed"?"level":"cpi"}}function rc(t,e,{today:n}){const s=sc(t,e,{today:n});if(!s.ok)return{ok:!1,errors:s.errors,patch:{},previous:{}};if(s.saved.locked)return{ok:!1,errors:{plan:"locked"},patch:{},previous:{}};const r=s.saved,i=r.bands,o={},l=dn(["amount","then","fallsPct"],{amount:s.values.first.amount,then:s.values.first.then,fallsPct:s.values.first.fallsPct==null?null:s.values.first.fallsPct},{amount:r.first.monthly,then:r.first.then,fallsPct:r.first.fallsPct}),a=s.lists.steps.cards,c=a.length===r.steps.length&&a.every((h,_)=>h.saved&&h.saved.id===r.steps[_].id&&dn(zo,{...h.values,fallsPct:h.values.fallsPct==null?null:h.values.fallsPct},{fromAge:h.saved.fromAge,amount:h.saved.monthly,then:h.saved.then,fallsPct:h.saved.fallsPct})),u=Array.isArray(r.ss.incomeSteps)?r.ss.incomeSteps:[];if(!l||!c){const h=(p,A)=>{const v=p.saved;return v&&v.row!=null&&dn(zo,{...p.values,fallsPct:p.values.fallsPct==null?null:p.values.fallsPct},{fromAge:v.fromAge,amount:v.monthly,then:v.then,fallsPct:v.fallsPct})?u[v.row]:Jo(p.values,A,v&&v.row!=null?u[v.row]:null,i,v)},E=[l&&r.first.row!=null?u[r.first.row]:Jo(s.values.first,r.first.fromAge,r.first.row!=null?u[r.first.row]:null,i,r.first),...a.map(p=>h(p,p.values.fromAge))].sort((p,A)=>+p.fromAge-+A.fromAge),w=+E[0].amount,y=yi(E,w,r.ss,r.timing,r.ageNow,r.duration,r.now);o["stressTool.settings.incomeShape"]="phases",o["stressTool.settings.incomeSteps"]=E,o["stressTool.settings.targetSchedule"]=y,o["stressTool.settings.baseSalary"]=w,o["stressTool.settings.spendingProfile"]="flat",o["decisionTool.settings.baseSalary"]=w,o["decisionTool.settings.targetSchedule"]=y}const d=s.lists.costs.cards;if(!(d.length===r.costs.length&&d.every((h,_)=>h.saved&&h.saved.id===r.costs[_].id&&dn(qo,h.values,h.saved)))){const h=o["stressTool.settings.targetSchedule"]||r.schedule,_=new Set(r.costs.map(p=>p.row)),E=d.map(p=>{const A=p.saved;return A&&dn(qo,p.values,A)?r.xrows[A.row]:Dy(p.values,A?r.xrows[A.row]:null,r.ageNow,h,i)}),w=[];let y=0;r.xrows.forEach((p,A)=>{_.has(A)?y<E.length&&w.push(E[y++]):w.push(p)}),w.push(...E.slice(y)),o["stressTool.settings.extraWithdrawals"]=w}const m={},g={};for(const h of bc){if(!(h in o))continue;const _=di(t,h),E=o[h];_s(_)!==_s(E)&&(_===void 0&&h.endsWith(".spendingProfile")&&E==="flat"||(m[h]=Wo(E),g[h]=Wo(_)))}return{ok:!0,errors:{},patch:m,previous:g}}function ic(t,e,n,s){const r=Ts(t);if(!r.length)return[];const i=e+n-1,o=c=>bt(Tn(r,c,r[0].amount),s),l=r.reduce((c,u,d)=>+u.fromAge<=e?d:c,0),a=r.map((c,u)=>({s:c,i:u})).filter(({s:c,i:u})=>u===l||+c.fromAge>e&&+c.fromAge<=i);return a.map(({s:c,i:u},d)=>{const f=Math.max(e,+c.fromAge),m=c.glideToNext&&r[u+1]?"glides":+c.decline>0?"falls":"level",g={fromAge:f,perMonth:o(f),yearly:Math.round(Tn(r,f,r[0].amount)),then:m};if(m==="falls"){g.fallsPct=+c.decline;const h=a[d+1];g.endAge=h?+h.s.fromAge-1:i,g.endPerMonth=o(g.endAge)}else m==="glides"&&(g.endAge=+r[u+1].fromAge,g.endPerMonth=g.endAge<=i?o(g.endAge):bt(+r[u+1].amount,s));return g})}function Ny(t,e,n){const{ageNow:s,duration:r,bands:i,ss:o,timing:l,now:a}=n,c=n.budget.essentials,u=Array.from({length:r},(f,m)=>{const g=e[m]||0,h=bt(g,i),_=Math.min(g,gi(o,l,s,m,a)),E=bt(_,i);return{age:s+m,partnerAge:null,value:h,income:E,pots:Math.max(0,h-E),below:c!=null&&h<c-.005}}),d=u.find(f=>f.below);return{chart:{unit:"perMonth",years:u,essentials:c,layers:!0,couple:!1,gap:null,bands:{goSlow:75,noGo:85},list:ic(t,s,r,i)},below:d?{age:d.age,amount:c}:null}}const xy=(t,e,n)=>W(t.firstTaxYear+(n-e));function Cy(t,e,n,s){const{ageNow:r,timing:i,bands:o,ss:l,now:a,duration:c}=s,u=[];ic(t,r,c,o).forEach((m,g)=>{const h={age:m.fromAge,monthly:$(m.perMonth),yearly:$(m.yearly)};m.then==="falls"?u.push({id:g===0?"first.falls":"step.falls",slots:{...h,pct:String(m.fallsPct),endMonthly:$(m.endPerMonth),endAge:m.endAge}}):m.then==="glides"?u.push({id:g===0?"first.glides":"step.glides",slots:{...h,toMonthly:$(m.endPerMonth),toAge:m.endAge}}):u.push({id:g===0?"first.level":"step.level",slots:h})});const f=Ts(t);for(let m=0;m<c;m++){const g=Tn(f,r+m,f.length?f[0].amount:0),h=gi(l,i,r,m,a);if(h>g+.5){u.push({id:"floor.from",slots:{age:r+m,monthly:$(bt(h,o))}});break}}for(const m of n){const g=m.atAge-r,h=e[Math.min(Math.max(0,g),e.length-1)]||0,_=m.gross!=null?m.gross:Math.round(_t(je(h,o)+m.amount,o)-_t(je(h,o),o));u.push({id:m.years>1?"cost.years":"cost.once",slots:{label:m.label||"One-off cost",net:$(m.amount),age:m.atAge,year:xy(i,r,m.atAge),years:m.years,gross:$(_),prices:m.prices}})}return s.strategyId==="floor-and-flex"&&u.push({id:"ff.note",slots:{}}),u}function Ly(t,e){const n=e.budget.workedOut?Math.round(_t(e.budget.essentialsAnnualNet,e.bands)):0,s=Ry(t,e.ageNow,n).slice(1),r=[{path:"steps.ids",value:s.map((o,l)=>"n"+(l+1)).join(",")}];s.forEach((o,l)=>{const a="n"+(l+1);r.push({path:`steps.${a}.fromAge`,value:String(o.fromAge)},{path:`steps.${a}.amount`,value:String(bt(o.amount,e.bands))},{path:`steps.${a}.then`,value:"level"})});const i=n>0&&s.some((o,l)=>o.amount>Math.round((l===0?.85:.7)*t/500)*500);return{edits:r,age75:e.ageNow<75?75:null,age85:e.ageNow<85?85:null,floor:i?bt(n,e.bands):null}}function Vy(t){return[]}function By(t,e,{today:n,typed:s=null}={}){const r=(t||[]).filter(P=>P&&P.plan&&typeof P.plan=="object"&&P.plan.id!=null),i=r.find(P=>String(P.plan.id)===String(e))||null;if(!i)return{found:!1,id:String(e||"")};const o=i.plan,l=!!(i.newer||i.failed),a=Ai(o,{today:n}),c=!a.locked&&!l,u=ec(o,{today:n}),d=sc(o,s||{},{today:n}),f={...u,...s||{}},m=a.bands,g=ia.map(P=>({path:P.path,type:P.type,options:P.type==="choice"?P.path==="first.then"?_c.filter(D=>D!=="glides"||d.lists.steps.cards.length>0||f["first.then"]==="glides"):P.options:null,applies:d.applies[P.path]!==!1,shown:Je(f[P.path])?P.path==="first.then"?"level":"":String(f[P.path]),saved:P.path in u?u[P.path]:null,error:d.errors[P.path]||null})),h=d.values.first.amount!=null?d.values.first.amount:a.first.monthly,_=d.values.first.amount!=null&&d.values.first.amount!==a.first.monthly?bs(d.values.first.amount,m):a.first.amount,E=(P,D)=>D>0&&P!=null?Math.round(P/D*100):null,w={};for(const P of oa)w[P]={ids:d.lists[P].ids,cards:d.lists[P].cards.map(D=>{const I={};if(P==="steps"&&D.values.amount!=null&&(I.gross=$(D.saved&&D.values.amount===D.saved.monthly?D.saved.amount:bs(D.values.amount,m))),P==="steps"&&D.values.amount!=null&&(I.ofStart=E(D.values.amount,h),I.ofBudget=a.budget.total?E(D.values.amount,a.budget.total):null),P==="steps"){const M=d.lists.steps.cards.filter(N=>N.values.fromAge!=null).sort((N,B)=>N.values.fromAge-B.values.fromAge).pop();I.last=!!M&&M.id===D.id}if(P==="costs"&&D.values.amount!=null&&D.values.atAge!=null){const M=d.schedule||a.schedule,N=D.values.atAge-a.ageNow,B=M[Math.min(Math.max(0,N),M.length-1)]||0;I.gross=$(Math.round(_t(je(B,m)+D.values.amount,m)-_t(je(B,m),m)))}return{id:D.id,saved:!!D.saved,fields:D.fields,...I}})};const y=d.ok?d.shape:a.plainSteps,p=d.ok?d.schedule:a.schedule,A=d.ok?d.lists.costs.cards.map(P=>({...P.values,years:P.values.years==null?1:P.values.years,gross:null})):a.costs,{chart:v,below:b}=Ny(y,p,a),S=Cy(y,p,A,a),T=r.filter(P=>P.plan.id!==o.id&&(P.plan.id===Ko(o)||Ko(P.plan)===o.id)).map(P=>({id:String(P.plan.id),name:jo(P.plan)})),R=c&&d.ok?rc(o,s||{},{today:n}):{patch:{},previous:{}},k=c?Ly(_,a):null;return{found:!0,id:String(o.id),name:jo(o),locked:a.locked,lockedOn:a.lockedOn,readonly:l,editable:c,source:a.source,ageNow:a.ageNow,endAge:a.endAge,startAge:a.first.fromAge,flat:a.flat,firstGross:$(_),firstGrossSaved:$(a.first.amount),firstMonthly:$(h),budget:{workedOut:a.budget.workedOut,total:a.budget.total!=null?$(a.budget.total):null,totalValue:a.budget.total,essentials:a.budget.essentials!=null?$(a.budget.essentials):null,at:a.budget.at},fields:g,lists:w,errors:d.errors,ok:d.ok,derived:S,chart:v,below:b?{age:b.age,amount:$(b.amount)}:null,notUsed:Vy(),floorAndFlex:a.strategyId==="floor-and-flex",partners:T,suggestion:k,changed:Object.keys(R.patch).length>0,patch:R.patch,previous:R.previous,savedLine:d.ok?{id:"spend",slots:{age:a.first.fromAge,monthly:$(h),steps:d.lists.steps.cards.length,costs:d.lists.costs.cards.length}}:null}}const sr="pt_guest_scenarios",Fy=15e3,Uy=new Set(Tc);function Qo(t){for(const e of Object.keys(t))if(!Uy.has(e))throw new Error('planWrite: "'+e+'" is not a declared field path');return t}function Gy(t,{win:e=null,session:n=null,local:s=null,now:r=()=>new Date,fb:i=null,handles:o}){const l=i||{doc:bp,updateDoc:Cp};let a=!1,c=!1,u=null;const d=A=>{a||t.dispatch(A)},f=(A,v)=>d({type:X.PLAN_SAVE_FAILED,planId:A,problem:v}),m=A=>{!e||typeof e.setTimeout!="function"||(u&&e.clearTimeout(u),u=e.setTimeout(()=>{u=null,A()},Fy))};function g(A,v){const b=A.plans,S=b&&Array.isArray(b.list)?b.list.find(R=>R&&R.plan&&String(R.plan.id)===String(v)):null;if(!S)return{problem:"notHere"};if(S.newer||S.failed)return{problem:"readonly"};const T=o()||{};return A.session.kind==="in"&&T.user&&T.db&&b.source==="account"?{kind:"account",entry:S,db:T.db,uid:T.user.uid,reread:T.reread}:A.session.kind==="nobody"&&b.source==="window"?Il(wl(s))?{problem:"usedUp"}:{kind:"window",entry:S}:{problem:"nobody"}}function h(A,v){return en(A&&A.decisionTool&&A.decisionTool.settings)?!0:!!xm(A,v,vr())}async function _(A,v,b){if(A.kind==="account")return await l.updateDoc(l.doc(A.db,"users",A.uid,"scenarios",String(v)),b),!0;let S=null;try{S=n?n.getItem(sr):null}catch{return!1}let T=null;try{T=JSON.parse(S)}catch{T=null}if(!Array.isArray(T))return!1;const R=T.findIndex(P=>P&&String(P.id)===String(v));if(R<0)return!1;T[R]=Kg(T[R],b);const k=JSON.stringify(T);try{return n.setItem(sr,k),n.getItem(sr)===k}catch{return!1}}function E(A){const v=A.route,b=v&&v.screen==="plan"&&(v.step==="income"||v.step==="spend")?v.step:"about";return{step:b,patchOf:b==="income"?Zl:b==="spend"?rc:jl}}async function w(A){let v=t.getState();const{step:b,patchOf:S}=E(v);let T=g(v,A);if(T.problem){f(A,T.problem);return}if(T.kind==="account"){try{await T.reread()}catch{}if(a)return;if(v=t.getState(),T=g(v,A),T.problem){f(A,T.problem);return}}const R=T.entry.plan,k=v.draft.plan&&v.draft.plan.id===String(A)?v.draft.plan:null,P=k?k.values:{};if(en(R.decisionTool&&R.decisionTool.settings)){f(A,"locked");return}const D=S(R,P,{today:v.env.today});if(!D.ok){f(A,D.errors.plan==="locked"?"locked":"problems");return}const I=v.plans.view&&v.plans.view.page&&v.plans.view.page[b]&&v.plans.view.page.forId===String(A)?v.plans.view.page[b]:null,M=I&&I.savedLine?I.savedLine:null;if(!Object.keys(D.patch).length){d({type:X.PLAN_SAVED,planId:A,previous:{},line:M}),m(()=>d({type:X.PLAN_TOAST_CLOSE}));return}const N=Qo({...D.patch,lastModified:r().toISOString()});if(h(R,N)){f(A,"locked");return}let B=!1;try{B=await _(T,A,N)}catch{B=!1}if(!a){if(!B){f(A,T.kind==="window"?"storage":"failed");return}d({type:X.PLAN_SAVED,planId:A,previous:{...D.previous,lastModified:R.lastModified},line:M}),d({type:X.PLANS_READING}),m(()=>d({type:X.PLAN_TOAST_CLOSE}))}}async function y(A,v){const b=t.getState(),S=g(b,A);if(S.problem){f(A,S.problem);return}const T=S.entry.plan,R={};for(const[D,I]of Object.entries(v||{}))R[D]=I===void 0&&S.kind==="account"?null:I;(!("lastModified"in R)||R.lastModified==null)&&(R.lastModified=r().toISOString());const k=Qo(R);if(h(T,Object.fromEntries(Object.entries(k).map(([D,I])=>[D,I===void 0?null:I])))){f(A,"locked");return}let P=!1;try{P=await _(S,A,k)}catch{P=!1}if(!a){if(!P){f(A,S.kind==="window"?"storage":"failed");return}d({type:X.PLAN_UNDO_DONE,planId:A}),d({type:X.PLANS_READING}),m(()=>d({type:X.PLAN_TOAST_CLOSE}))}}const p=t.subscribe((A,v)=>{if(c)return;const b=A.ui.saving;b&&(v.type===X.PLAN_SAVE&&b.kind==="save"?(c=!0,w(b.planId).catch(()=>f(b.planId,"failed")).finally(()=>{c=!1})):v.type===X.PLAN_UNDO&&b.kind==="undo"&&(c=!0,y(b.planId,b.previous).catch(()=>f(b.planId,"failed")).finally(()=>{c=!1})))});return()=>{a=!0,p(),u&&e&&e.clearTimeout(u)}}const Yy="pt_guest_scenarios",$y="pt-preview",jy=60*1e3;function Xo(t,e){const n=[];for(const s of t){if(!s||typeof s!="object"||s.id==null)continue;let r;try{r=lm(s,{now:e})}catch(i){r={scenario:s,newer:!1,error:i}}n.push({plan:r.scenario&&typeof r.scenario=="object"?r.scenario:s,newer:!!r.newer,failed:!!r.error})}return n}function Ky(t){if(!t)return[];let e=null;try{e=t.getItem(Yy)}catch{return[]}if(!e)return[];try{const n=JSON.parse(e);return Array.isArray(n)?n:[]}catch{return[]}}const Zo=t=>String(t.getHours()).padStart(2,"0")+":"+String(t.getMinutes()).padStart(2,"0");function Wy(t){const e=t.plans;if(!e||e.status!=="read")return null;const n=t.env.today,s=qg(e.list,{today:n,source:e.source}).groups,r=t.route;let i=null;if(r&&r.screen==="plan"&&r.planId&&(i={...cy(e.list,r.planId,r.step,{today:n,source:e.source}),forId:r.planId,forStep:r.step||null},r.step==="about"||r.step==="income"||r.step==="spend")){const o=t.draft&&t.draft.plan&&t.draft.plan.id===r.planId?t.draft.plan:null,l=o?o.values:{},a=r.step==="about"?zg:r.step==="income"?Iy:By;i[r.step]={...a(e.list,r.planId,{today:n,typed:l}),draftKey:JSON.stringify(l)}}return{today:n,rows:s,page:i}}function Zy(t,{win:e,local:n=null,session:s=null,now:r=()=>new Date,fb:i=null,fbWrite:o=null}){const l=i||{initializeApp:ma,getAuth:lf,setPersistence:Hd,browserLocalPersistence:$a,onAuthStateChanged:Jd,signOut:Qd,getFirestore:Ap,collection:_p,getDocs:xp,isFirebaseConfigured:Lp},a=[];let c,u=!1;const d=T=>{u||t.dispatch(T)};d({type:X.SESSION_SET,session:{kind:"checking",email:null}});function f(){const T=Xo(Ky(s),r());d({type:X.PLANS_SET,list:T,source:"window",readAt:Zo(r()),usedUp:Il(wl(n))})}let m=null,g=null;if(!l.isFirebaseConfigured())c=null,d({type:X.SESSION_SET,session:{kind:"nobody",email:null}}),f();else{const T=l.initializeApp(vl,$y);m=l.getAuth(T),Promise.resolve(l.setPersistence(m,l.browserLocalPersistence)).catch(()=>{}),g=l.getFirestore(T)}async function h(){if(!c||!g)return;const T=c.uid;try{const R=await l.getDocs(l.collection(g,"users",T,"scenarios")),k=[];if(R.forEach(P=>{k.push({id:P.id,...P.data()})}),u||!c||c.uid!==T)return;d({type:X.PLANS_SET,list:Xo(k,r()),source:"account",readAt:Zo(r())})}catch{u||d({type:X.PLANS_FAILED})}}function _(){c!==void 0&&(c===null?f():c.emailVerified&&h())}function E(){try{n&&n.removeItem(Ic)}catch{}try{s&&s.removeItem(Ec)}catch{}}async function w(){E(),d({type:X.PLANS_CLEAR});try{m&&await l.signOut(m)}catch{}!u&&c&&(c=null,d({type:X.SESSION_SET,session:{kind:"nobody",email:null}}),f())}if(m){const T=l.onAuthStateChanged(m,R=>{if(u)return;const k=c;c=R||null,R?R.emailVerified?(d({type:X.SESSION_SET,session:{kind:"in",email:R.email||null}}),h()):d({type:X.SESSION_SET,session:{kind:"unverified",email:R.email||null}}):(d({type:X.SESSION_SET,session:{kind:"nobody",email:null}}),k&&E(),f())});a.push(()=>{try{T()}catch{}})}let y=null;const p=T=>{const R=T.plans&&T.plans.status==="read"?[T.plans.list,T.route,T.env.today,T.draft&&T.draft.plan]:null;if(!R){y=null;return}if(y&&R.every((P,D)=>P===y[D]))return;y=R;let k=null;try{k=Wy(T)}catch{k={today:T.env.today,rows:[],page:null}}k&&d({type:X.PLANS_VIEW,view:k})};p(t.getState()),a.push(Gy(t,{win:e,session:s,local:n,now:r,fb:o,handles:()=>({db:g,user:c||null,reread:()=>c&&g?h():Promise.resolve()})})),a.push(t.subscribe((T,R)=>{R.type===X.PLANS_READING&&_(),R.type===X.SESSION_OUT&&T.session.signingOut&&w(),p(T)}));const A=()=>d({type:X.PLANS_CLEAR}),v=T=>{T&&T.persisted&&(c!==void 0&&d({type:X.SESSION_SET,session:c?{kind:c.emailVerified?"in":"unverified",email:c.email||null}:{kind:"nobody",email:null}}),_())},b=()=>{e.document&&e.document.visibilityState==="visible"&&t.getState().plans===null&&_()};e.addEventListener("pagehide",A),e.addEventListener("pageshow",v),e.document&&e.document.addEventListener("visibilitychange",b),a.push(()=>{e.removeEventListener("pagehide",A),e.removeEventListener("pageshow",v),e.document&&e.document.removeEventListener("visibilitychange",b)});const S=e.setInterval(()=>{if(!c||!n)return;const T=Sc(n);T&&r().getTime()-T>wc&&w()},jy);return a.push(()=>e.clearInterval(S)),()=>{u=!0,a.splice(0).forEach(T=>T())}}export{$y as APP_NAME,Yy as GUEST_PLANS_KEY,Zy as startPlanSource,Xo as upgradedList,Wy as viewFor,Ky as windowPlans};
