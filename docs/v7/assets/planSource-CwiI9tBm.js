import{h as fr,ad as pa,f as Ic,ae as ma,c as mt,S as je,D as ye,af as ue,ag as kn,ah as kc,ai as Ec,aj as Pc,ak as Rc,al as ga,am as pr,an as Mc,g as Oc,ao as Dc,ap as Js,aq as Rs,ar as ya,as as Yr,at as Pi,au as Nc,av as mr,aw as ba,R as gt,ax as xc,ay as Ri,az as Cc,q as Lc,j as Vc,aA as Aa,aB as Bc,aC as va,aD as Xn,aE as Fc,aF as $r,F as Qs,aG as Uc,aH as Gc,aI as Yc,aJ as X,aK as $c,aL as jc,aM as Kc,aN as Wc,aO as Hc}from"./index-BqyqadbV.js";import{B as Ut,F as qc,l as zc,S as bn,j as Jc,G as Qc}from"./SpendingModel-B2FKV7lF.js";var Mi={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ta=function(t){const e=[];let n=0;for(let s=0;s<t.length;s++){let r=t.charCodeAt(s);r<128?e[n++]=r:r<2048?(e[n++]=r>>6|192,e[n++]=r&63|128):(r&64512)===55296&&s+1<t.length&&(t.charCodeAt(s+1)&64512)===56320?(r=65536+((r&1023)<<10)+(t.charCodeAt(++s)&1023),e[n++]=r>>18|240,e[n++]=r>>12&63|128,e[n++]=r>>6&63|128,e[n++]=r&63|128):(e[n++]=r>>12|224,e[n++]=r>>6&63|128,e[n++]=r&63|128)}return e},Xc=function(t){const e=[];let n=0,s=0;for(;n<t.length;){const r=t[n++];if(r<128)e[s++]=String.fromCharCode(r);else if(r>191&&r<224){const i=t[n++];e[s++]=String.fromCharCode((r&31)<<6|i&63)}else if(r>239&&r<365){const i=t[n++],o=t[n++],l=t[n++],a=((r&7)<<18|(i&63)<<12|(o&63)<<6|l&63)-65536;e[s++]=String.fromCharCode(55296+(a>>10)),e[s++]=String.fromCharCode(56320+(a&1023))}else{const i=t[n++],o=t[n++];e[s++]=String.fromCharCode((r&15)<<12|(i&63)<<6|o&63)}}return e.join("")},_a={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let r=0;r<t.length;r+=3){const i=t[r],o=r+1<t.length,l=o?t[r+1]:0,a=r+2<t.length,c=a?t[r+2]:0,u=i>>2,d=(i&3)<<4|l>>4;let p=(l&15)<<2|c>>6,m=c&63;a||(m=64,o||(p=64)),s.push(n[u],n[d],n[p],n[m])}return s.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(Ta(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):Xc(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let r=0;r<t.length;){const i=n[t.charAt(r++)],l=r<t.length?n[t.charAt(r)]:0;++r;const c=r<t.length?n[t.charAt(r)]:64;++r;const d=r<t.length?n[t.charAt(r)]:64;if(++r,i==null||l==null||c==null||d==null)throw new Zc;const p=i<<2|l>>4;if(s.push(p),c!==64){const m=l<<4&240|c>>2;if(s.push(m),d!==64){const g=c<<6&192|d;s.push(g)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class Zc extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const eu=function(t){const e=Ta(t);return _a.encodeByteArray(e,!0)},rs=function(t){return eu(t).replace(/\./g,"")},Sa=function(t){try{return _a.decodeString(t,!0)}catch{}return null};/**
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
 */function tu(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const nu=()=>tu().__FIREBASE_DEFAULTS__,su=()=>{if(typeof process>"u"||typeof Mi>"u")return;const t=Mi.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},ru=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&Sa(t[1]);return e&&JSON.parse(e)},jr=()=>{try{return nu()||su()||ru()}catch{return}},wa=t=>{var e,n;return(n=(e=jr())===null||e===void 0?void 0:e.emulatorHosts)===null||n===void 0?void 0:n[t]},iu=t=>{const e=wa(t);if(!e)return;const n=e.lastIndexOf(":");if(n<=0||n+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const s=parseInt(e.substring(n+1),10);return e[0]==="["?[e.substring(1,n-1),s]:[e.substring(0,n),s]},Ia=()=>{var t;return(t=jr())===null||t===void 0?void 0:t.config},ka=t=>{var e;return(e=jr())===null||e===void 0?void 0:e[`_${t}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ou{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,s)=>{n?this.reject(n):this.resolve(s),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,s))}}}/**
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
 */function au(t,e){if(t.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n={alg:"none",type:"JWT"},s=e||"demo-project",r=t.iat||0,i=t.sub||t.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${s}`,aud:s,iat:r,exp:r+3600,auth_time:r,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}}},t);return[rs(JSON.stringify(n)),rs(JSON.stringify(o)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pe(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function lu(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Pe())}function cu(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function uu(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function du(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function hu(){const t=Pe();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function fu(){try{return typeof indexedDB=="object"}catch{return!1}}function pu(){return new Promise((t,e)=>{try{let n=!0;const s="validate-browser-context-for-indexeddb-analytics-module",r=self.indexedDB.open(s);r.onsuccess=()=>{r.result.close(),n||self.indexedDB.deleteDatabase(s),t(!0)},r.onupgradeneeded=()=>{n=!1},r.onerror=()=>{var i;e(((i=r.error)===null||i===void 0?void 0:i.message)||"")}}catch(n){e(n)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mu="FirebaseError";class rt extends Error{constructor(e,n,s){super(n),this.code=e,this.customData=s,this.name=mu,Object.setPrototypeOf(this,rt.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Ln.prototype.create)}}class Ln{constructor(e,n,s){this.service=e,this.serviceName=n,this.errors=s}create(e,...n){const s=n[0]||{},r=`${this.service}/${e}`,i=this.errors[e],o=i?gu(i,s):"Error",l=`${this.serviceName}: ${o} (${r}).`;return new rt(r,l,s)}}function gu(t,e){return t.replace(yu,(n,s)=>{const r=e[s];return r!=null?String(r):`<${s}?>`})}const yu=/\{\$([^}]+)}/g;function bu(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function is(t,e){if(t===e)return!0;const n=Object.keys(t),s=Object.keys(e);for(const r of n){if(!s.includes(r))return!1;const i=t[r],o=e[r];if(Oi(i)&&Oi(o)){if(!is(i,o))return!1}else if(i!==o)return!1}for(const r of s)if(!n.includes(r))return!1;return!0}function Oi(t){return t!==null&&typeof t=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vn(t){const e=[];for(const[n,s]of Object.entries(t))Array.isArray(s)?s.forEach(r=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(r))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(s));return e.length?"&"+e.join("&"):""}function Au(t,e){const n=new vu(t,e);return n.subscribe.bind(n)}class vu{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(s=>{this.error(s)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,s){let r;if(e===void 0&&n===void 0&&s===void 0)throw new Error("Missing Observer.");Tu(e,["next","error","complete"])?r=e:r={next:e,error:n,complete:s},r.next===void 0&&(r.next=Xs),r.error===void 0&&(r.error=Xs),r.complete===void 0&&(r.complete=Xs);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?r.error(this.finalError):r.complete()}catch{}}),this.observers.push(r),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch{}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Tu(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function Xs(){}/**
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
 */function _e(t){return t&&t._delegate?t._delegate:t}class xt{constructor(e,n,s){this.name=e,this.instanceFactory=n,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pt="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _u{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const s=new ou;if(this.instancesDeferred.set(n,s),this.isInitialized(n)||this.shouldAutoInitialize())try{const r=this.getOrInitializeService({instanceIdentifier:n});r&&s.resolve(r)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){var n;const s=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(n=e==null?void 0:e.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(s)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:s})}catch(i){if(r)return null;throw i}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(wu(e))try{this.getOrInitializeService({instanceIdentifier:Pt})}catch{}for(const[n,s]of this.instancesDeferred.entries()){const r=this.normalizeInstanceIdentifier(n);try{const i=this.getOrInitializeService({instanceIdentifier:r});s.resolve(i)}catch{}}}}clearInstance(e=Pt){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Pt){return this.instances.has(e)}getOptions(e=Pt){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,s=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const r=this.getOrInitializeService({instanceIdentifier:s,options:n});for(const[i,o]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(i);s===l&&o.resolve(r)}return r}onInit(e,n){var s;const r=this.normalizeInstanceIdentifier(n),i=(s=this.onInitCallbacks.get(r))!==null&&s!==void 0?s:new Set;i.add(e),this.onInitCallbacks.set(r,i);const o=this.instances.get(r);return o&&e(o,r),()=>{i.delete(e)}}invokeOnInitCallbacks(e,n){const s=this.onInitCallbacks.get(n);if(s)for(const r of s)try{r(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let s=this.instances.get(e);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:Su(e),options:n}),this.instances.set(e,s),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(s,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,s)}catch{}return s||null}normalizeInstanceIdentifier(e=Pt){return this.component?this.component.multipleInstances?e:Pt:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Su(t){return t===Pt?void 0:t}function wu(t){return t.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Iu{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new _u(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Q;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(Q||(Q={}));const ku={debug:Q.DEBUG,verbose:Q.VERBOSE,info:Q.INFO,warn:Q.WARN,error:Q.ERROR,silent:Q.SILENT},Eu=Q.INFO,Pu={[Q.DEBUG]:"log",[Q.VERBOSE]:"log",[Q.INFO]:"info",[Q.WARN]:"warn",[Q.ERROR]:"error"},Ru=(t,e,...n)=>{if(e<t.logLevel)return;const s=new Date().toISOString(),r=Pu[e];if(!r)throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Kr{constructor(e){this.name=e,this._logLevel=Eu,this._logHandler=Ru,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in Q))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?ku[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,Q.DEBUG,...e),this._logHandler(this,Q.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,Q.VERBOSE,...e),this._logHandler(this,Q.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,Q.INFO,...e),this._logHandler(this,Q.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,Q.WARN,...e),this._logHandler(this,Q.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,Q.ERROR,...e),this._logHandler(this,Q.ERROR,...e)}}const Mu=(t,e)=>e.some(n=>t instanceof n);let Di,Ni;function Ou(){return Di||(Di=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Du(){return Ni||(Ni=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Ea=new WeakMap,gr=new WeakMap,Pa=new WeakMap,Zs=new WeakMap,Wr=new WeakMap;function Nu(t){const e=new Promise((n,s)=>{const r=()=>{t.removeEventListener("success",i),t.removeEventListener("error",o)},i=()=>{n(yt(t.result)),r()},o=()=>{s(t.error),r()};t.addEventListener("success",i),t.addEventListener("error",o)});return e.then(n=>{n instanceof IDBCursor&&Ea.set(n,t)}).catch(()=>{}),Wr.set(e,t),e}function xu(t){if(gr.has(t))return;const e=new Promise((n,s)=>{const r=()=>{t.removeEventListener("complete",i),t.removeEventListener("error",o),t.removeEventListener("abort",o)},i=()=>{n(),r()},o=()=>{s(t.error||new DOMException("AbortError","AbortError")),r()};t.addEventListener("complete",i),t.addEventListener("error",o),t.addEventListener("abort",o)});gr.set(t,e)}let yr={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return gr.get(t);if(e==="objectStoreNames")return t.objectStoreNames||Pa.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return yt(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function Cu(t){yr=t(yr)}function Lu(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const s=t.call(er(this),e,...n);return Pa.set(s,e.sort?e.sort():[e]),yt(s)}:Du().includes(t)?function(...e){return t.apply(er(this),e),yt(Ea.get(this))}:function(...e){return yt(t.apply(er(this),e))}}function Vu(t){return typeof t=="function"?Lu(t):(t instanceof IDBTransaction&&xu(t),Mu(t,Ou())?new Proxy(t,yr):t)}function yt(t){if(t instanceof IDBRequest)return Nu(t);if(Zs.has(t))return Zs.get(t);const e=Vu(t);return e!==t&&(Zs.set(t,e),Wr.set(e,t)),e}const er=t=>Wr.get(t);function Bu(t,e,{blocked:n,upgrade:s,blocking:r,terminated:i}={}){const o=indexedDB.open(t,e),l=yt(o);return s&&o.addEventListener("upgradeneeded",a=>{s(yt(o.result),a.oldVersion,a.newVersion,yt(o.transaction),a)}),n&&o.addEventListener("blocked",a=>n(a.oldVersion,a.newVersion,a)),l.then(a=>{i&&a.addEventListener("close",()=>i()),r&&a.addEventListener("versionchange",c=>r(c.oldVersion,c.newVersion,c))}).catch(()=>{}),l}const Fu=["get","getKey","getAll","getAllKeys","count"],Uu=["put","add","delete","clear"],tr=new Map;function xi(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(tr.get(e))return tr.get(e);const n=e.replace(/FromIndex$/,""),s=e!==n,r=Uu.includes(n);if(!(n in(s?IDBIndex:IDBObjectStore).prototype)||!(r||Fu.includes(n)))return;const i=async function(o,...l){const a=this.transaction(o,r?"readwrite":"readonly");let c=a.store;return s&&(c=c.index(l.shift())),(await Promise.all([c[n](...l),r&&a.done]))[0]};return tr.set(e,i),i}Cu(t=>({...t,get:(e,n,s)=>xi(e,n)||t.get(e,n,s),has:(e,n)=>!!xi(e,n)||t.has(e,n)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gu{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(Yu(n)){const s=n.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(n=>n).join(" ")}}function Yu(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const br="@firebase/app",Ci="0.10.13";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const et=new Kr("@firebase/app"),$u="@firebase/app-compat",ju="@firebase/analytics-compat",Ku="@firebase/analytics",Wu="@firebase/app-check-compat",Hu="@firebase/app-check",qu="@firebase/auth",zu="@firebase/auth-compat",Ju="@firebase/database",Qu="@firebase/data-connect",Xu="@firebase/database-compat",Zu="@firebase/functions",ed="@firebase/functions-compat",td="@firebase/installations",nd="@firebase/installations-compat",sd="@firebase/messaging",rd="@firebase/messaging-compat",id="@firebase/performance",od="@firebase/performance-compat",ad="@firebase/remote-config",ld="@firebase/remote-config-compat",cd="@firebase/storage",ud="@firebase/storage-compat",dd="@firebase/firestore",hd="@firebase/vertexai-preview",fd="@firebase/firestore-compat",pd="firebase",md="10.14.1";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ar="[DEFAULT]",gd={[br]:"fire-core",[$u]:"fire-core-compat",[Ku]:"fire-analytics",[ju]:"fire-analytics-compat",[Hu]:"fire-app-check",[Wu]:"fire-app-check-compat",[qu]:"fire-auth",[zu]:"fire-auth-compat",[Ju]:"fire-rtdb",[Qu]:"fire-data-connect",[Xu]:"fire-rtdb-compat",[Zu]:"fire-fn",[ed]:"fire-fn-compat",[td]:"fire-iid",[nd]:"fire-iid-compat",[sd]:"fire-fcm",[rd]:"fire-fcm-compat",[id]:"fire-perf",[od]:"fire-perf-compat",[ad]:"fire-rc",[ld]:"fire-rc-compat",[cd]:"fire-gcs",[ud]:"fire-gcs-compat",[dd]:"fire-fst",[fd]:"fire-fst-compat",[hd]:"fire-vertex","fire-js":"fire-js",[pd]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const os=new Map,yd=new Map,vr=new Map;function Li(t,e){try{t.container.addComponent(e)}catch(n){et.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function Xt(t){const e=t.name;if(vr.has(e))return et.debug(`There were multiple attempts to register component ${e}.`),!1;vr.set(e,t);for(const n of os.values())Li(n,t);for(const n of yd.values())Li(n,t);return!0}function Hr(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function pt(t){return t.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bd={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},bt=new Ln("app","Firebase",bd);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ad{constructor(e,n,s){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new xt("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw bt.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const an=md;function Ra(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const s=Object.assign({name:Ar,automaticDataCollectionEnabled:!1},e),r=s.name;if(typeof r!="string"||!r)throw bt.create("bad-app-name",{appName:String(r)});if(n||(n=Ia()),!n)throw bt.create("no-options");const i=os.get(r);if(i){if(is(n,i.options)&&is(s,i.config))return i;throw bt.create("duplicate-app",{appName:r})}const o=new Iu(r);for(const a of vr.values())o.addComponent(a);const l=new Ad(n,s,o);return os.set(r,l),l}function Ma(t=Ar){const e=os.get(t);if(!e&&t===Ar&&Ia())return Ra();if(!e)throw bt.create("no-app",{appName:t});return e}function At(t,e,n){var s;let r=(s=gd[t])!==null&&s!==void 0?s:t;n&&(r+=`-${n}`);const i=r.match(/\s|\//),o=e.match(/\s|\//);if(i||o){const l=[`Unable to register library "${r}" with version "${e}":`];i&&l.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&o&&l.push("and"),o&&l.push(`version name "${e}" contains illegal characters (whitespace or "/")`),et.warn(l.join(" "));return}Xt(new xt(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
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
 */const vd="firebase-heartbeat-database",Td=1,En="firebase-heartbeat-store";let nr=null;function Oa(){return nr||(nr=Bu(vd,Td,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(En)}catch{}}}}).catch(t=>{throw bt.create("idb-open",{originalErrorMessage:t.message})})),nr}async function _d(t){try{const n=(await Oa()).transaction(En),s=await n.objectStore(En).get(Da(t));return await n.done,s}catch(e){if(e instanceof rt)et.warn(e.message);else{const n=bt.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});et.warn(n.message)}}}async function Vi(t,e){try{const s=(await Oa()).transaction(En,"readwrite");await s.objectStore(En).put(e,Da(t)),await s.done}catch(n){if(n instanceof rt)et.warn(n.message);else{const s=bt.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});et.warn(s.message)}}}function Da(t){return`${t.name}!${t.options.appId}`}/**
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
 */const Sd=1024,wd=30*24*60*60*1e3;class Id{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new Ed(n),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){var e,n;try{const r=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=Bi();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)===null||n===void 0?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(o=>o.date===i)?void 0:(this._heartbeatsCache.heartbeats.push({date:i,agent:r}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(o=>{const l=new Date(o.date).valueOf();return Date.now()-l<=wd}),this._storage.overwrite(this._heartbeatsCache))}catch(s){et.warn(s)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=Bi(),{heartbeatsToSend:s,unsentEntries:r}=kd(this._heartbeatsCache.heartbeats),i=rs(JSON.stringify({version:2,heartbeats:s}));return this._heartbeatsCache.lastSentHeartbeatDate=n,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(n){return et.warn(n),""}}}function Bi(){return new Date().toISOString().substring(0,10)}function kd(t,e=Sd){const n=[];let s=t.slice();for(const r of t){const i=n.find(o=>o.agent===r.agent);if(i){if(i.dates.push(r.date),Fi(n)>e){i.dates.pop();break}}else if(n.push({agent:r.agent,dates:[r.date]}),Fi(n)>e){n.pop();break}s=s.slice(1)}return{heartbeatsToSend:n,unsentEntries:s}}class Ed{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return fu()?pu().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await _d(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var n;if(await this._canUseIndexedDBPromise){const r=await this.read();return Vi(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var n;if(await this._canUseIndexedDBPromise){const r=await this.read();return Vi(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function Fi(t){return rs(JSON.stringify({version:2,heartbeats:t})).length}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pd(t){Xt(new xt("platform-logger",e=>new Gu(e),"PRIVATE")),Xt(new xt("heartbeat",e=>new Id(e),"PRIVATE")),At(br,Ci,t),At(br,Ci,"esm2017"),At("fire-js","")}Pd("");var Rd="firebase",Md="10.14.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */At(Rd,Md,"app");function qr(t,e){var n={};for(var s in t)Object.prototype.hasOwnProperty.call(t,s)&&e.indexOf(s)<0&&(n[s]=t[s]);if(t!=null&&typeof Object.getOwnPropertySymbols=="function")for(var r=0,s=Object.getOwnPropertySymbols(t);r<s.length;r++)e.indexOf(s[r])<0&&Object.prototype.propertyIsEnumerable.call(t,s[r])&&(n[s[r]]=t[s[r]]);return n}function Na(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Od=Na,xa=new Ln("auth","Firebase",Na());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const as=new Kr("@firebase/auth");function Dd(t,...e){as.logLevel<=Q.WARN&&as.warn(`Auth (${an}): ${t}`,...e)}function Zn(t,...e){as.logLevel<=Q.ERROR&&as.error(`Auth (${an}): ${t}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tt(t,...e){throw zr(t,...e)}function Ke(t,...e){return zr(t,...e)}function Ca(t,e,n){const s=Object.assign(Object.assign({},Od()),{[e]:n});return new Ln("auth","Firebase",s).create(e,{appName:t.name})}function Dt(t){return Ca(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function zr(t,...e){if(typeof t!="string"){const n=e[0],s=[...e.slice(1)];return s[0]&&(s[0].appName=t.name),t._errorFactory.create(n,...s)}return xa.create(t,...e)}function B(t,e,...n){if(!t)throw zr(e,...n)}function ze(t){const e="INTERNAL ASSERTION FAILED: "+t;throw Zn(e),new Error(e)}function nt(t,e){t||ze(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Tr(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.href)||""}function Nd(){return Ui()==="http:"||Ui()==="https:"}function Ui(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xd(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Nd()||uu()||"connection"in navigator)?navigator.onLine:!0}function Cd(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bn{constructor(e,n){this.shortDelay=e,this.longDelay=n,nt(n>e,"Short delay should be less than long delay!"),this.isMobile=lu()||du()}get(){return xd()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jr(t,e){nt(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class La{static initialize(e,n,s){this.fetchImpl=e,n&&(this.headersImpl=n),s&&(this.responseImpl=s)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;ze("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;ze("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;ze("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ld={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vd=new Bn(3e4,6e4);function Qr(t,e){return t.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:t.tenantId}):e}async function ln(t,e,n,s,r={}){return Va(t,r,async()=>{let i={},o={};s&&(e==="GET"?o=s:i={body:JSON.stringify(s)});const l=Vn(Object.assign({key:t.config.apiKey},o)).slice(1),a=await t._getAdditionalHeaders();a["Content-Type"]="application/json",t.languageCode&&(a["X-Firebase-Locale"]=t.languageCode);const c=Object.assign({method:e,headers:a},i);return cu()||(c.referrerPolicy="no-referrer"),La.fetch()(Ba(t,t.config.apiHost,n,l),c)})}async function Va(t,e,n){t._canInitEmulator=!1;const s=Object.assign(Object.assign({},Ld),e);try{const r=new Fd(t),i=await Promise.race([n(),r.promise]);r.clearNetworkTimeout();const o=await i.json();if("needConfirmation"in o)throw Kn(t,"account-exists-with-different-credential",o);if(i.ok&&!("errorMessage"in o))return o;{const l=i.ok?o.errorMessage:o.error.message,[a,c]=l.split(" : ");if(a==="FEDERATED_USER_ID_ALREADY_LINKED")throw Kn(t,"credential-already-in-use",o);if(a==="EMAIL_EXISTS")throw Kn(t,"email-already-in-use",o);if(a==="USER_DISABLED")throw Kn(t,"user-disabled",o);const u=s[a]||a.toLowerCase().replace(/[_\s]+/g,"-");if(c)throw Ca(t,u,c);tt(t,u)}}catch(r){if(r instanceof rt)throw r;tt(t,"network-request-failed",{message:String(r)})}}async function Bd(t,e,n,s,r={}){const i=await ln(t,e,n,s,r);return"mfaPendingCredential"in i&&tt(t,"multi-factor-auth-required",{_serverResponse:i}),i}function Ba(t,e,n,s){const r=`${e}${n}?${s}`;return t.config.emulator?Jr(t.config,r):`${t.config.apiScheme}://${r}`}class Fd{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,s)=>{this.timer=setTimeout(()=>s(Ke(this.auth,"network-request-failed")),Vd.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function Kn(t,e,n){const s={appName:t.name};n.email&&(s.email=n.email),n.phoneNumber&&(s.phoneNumber=n.phoneNumber);const r=Ke(t,e,s);return r.customData._tokenResponse=n,r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ud(t,e){return ln(t,"POST","/v1/accounts:delete",e)}async function Fa(t,e){return ln(t,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function An(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function Gd(t,e=!1){const n=_e(t),s=await n.getIdToken(e),r=Xr(s);B(r&&r.exp&&r.auth_time&&r.iat,n.auth,"internal-error");const i=typeof r.firebase=="object"?r.firebase:void 0,o=i==null?void 0:i.sign_in_provider;return{claims:r,token:s,authTime:An(sr(r.auth_time)),issuedAtTime:An(sr(r.iat)),expirationTime:An(sr(r.exp)),signInProvider:o||null,signInSecondFactor:(i==null?void 0:i.sign_in_second_factor)||null}}function sr(t){return Number(t)*1e3}function Xr(t){const[e,n,s]=t.split(".");if(e===void 0||n===void 0||s===void 0)return Zn("JWT malformed, contained fewer than 3 sections"),null;try{const r=Sa(n);return r?JSON.parse(r):(Zn("Failed to decode base64 JWT payload"),null)}catch(r){return Zn("Caught error parsing JWT payload as JSON",r==null?void 0:r.toString()),null}}function Gi(t){const e=Xr(t);return B(e,"internal-error"),B(typeof e.exp<"u","internal-error"),B(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Pn(t,e,n=!1){if(n)return e;try{return await e}catch(s){throw s instanceof rt&&Yd(s)&&t.auth.currentUser===t&&await t.auth.signOut(),s}}function Yd({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $d{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var n;if(e){const s=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),s}else{this.errorBackoff=3e4;const r=((n=this.user.stsTokenManager.expirationTime)!==null&&n!==void 0?n:0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _r{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=An(this.lastLoginAt),this.creationTime=An(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ls(t){var e;const n=t.auth,s=await t.getIdToken(),r=await Pn(t,Fa(n,{idToken:s}));B(r==null?void 0:r.users.length,n,"internal-error");const i=r.users[0];t._notifyReloadListener(i);const o=!((e=i.providerUserInfo)===null||e===void 0)&&e.length?Ua(i.providerUserInfo):[],l=Kd(t.providerData,o),a=t.isAnonymous,c=!(t.email&&i.passwordHash)&&!(l!=null&&l.length),u=a?c:!1,d={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:l,metadata:new _r(i.createdAt,i.lastLoginAt),isAnonymous:u};Object.assign(t,d)}async function jd(t){const e=_e(t);await ls(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function Kd(t,e){return[...t.filter(s=>!e.some(r=>r.providerId===s.providerId)),...e]}function Ua(t){return t.map(e=>{var{providerId:n}=e,s=qr(e,["providerId"]);return{providerId:n,uid:s.rawId||"",displayName:s.displayName||null,email:s.email||null,phoneNumber:s.phoneNumber||null,photoURL:s.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Wd(t,e){const n=await Va(t,{},async()=>{const s=Vn({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:r,apiKey:i}=t.config,o=Ba(t,r,"/v1/token",`key=${i}`),l=await t._getAdditionalHeaders();return l["Content-Type"]="application/x-www-form-urlencoded",La.fetch()(o,{method:"POST",headers:l,body:s})});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function Hd(t,e){return ln(t,"POST","/v2/accounts:revokeToken",Qr(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qt{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){B(e.idToken,"internal-error"),B(typeof e.idToken<"u","internal-error"),B(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Gi(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){B(e.length!==0,"internal-error");const n=Gi(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(B(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:s,refreshToken:r,expiresIn:i}=await Wd(e,n);this.updateTokensAndExpiration(s,r,Number(i))}updateTokensAndExpiration(e,n,s){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+s*1e3}static fromJSON(e,n){const{refreshToken:s,accessToken:r,expirationTime:i}=n,o=new qt;return s&&(B(typeof s=="string","internal-error",{appName:e}),o.refreshToken=s),r&&(B(typeof r=="string","internal-error",{appName:e}),o.accessToken=r),i&&(B(typeof i=="number","internal-error",{appName:e}),o.expirationTime=i),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new qt,this.toJSON())}_performRefresh(){return ze("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ot(t,e){B(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class Je{constructor(e){var{uid:n,auth:s,stsTokenManager:r}=e,i=qr(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new $d(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=n,this.auth=s,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new _r(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const n=await Pn(this,this.stsTokenManager.getToken(this.auth,e));return B(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return Gd(this,e)}reload(){return jd(this)}_assign(e){this!==e&&(B(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>Object.assign({},n)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new Je(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return n.metadata._copy(this.metadata),n}_onReload(e){B(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let s=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),s=!0),n&&await ls(this),await this.auth._persistUserIfCurrent(this),s&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(pt(this.auth.app))return Promise.reject(Dt(this.auth));const e=await this.getIdToken();return await Pn(this,Ud(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){var s,r,i,o,l,a,c,u;const d=(s=n.displayName)!==null&&s!==void 0?s:void 0,p=(r=n.email)!==null&&r!==void 0?r:void 0,m=(i=n.phoneNumber)!==null&&i!==void 0?i:void 0,g=(o=n.photoURL)!==null&&o!==void 0?o:void 0,f=(l=n.tenantId)!==null&&l!==void 0?l:void 0,v=(a=n._redirectEventId)!==null&&a!==void 0?a:void 0,I=(c=n.createdAt)!==null&&c!==void 0?c:void 0,S=(u=n.lastLoginAt)!==null&&u!==void 0?u:void 0,{uid:y,emailVerified:h,isAnonymous:b,providerData:A,stsTokenManager:T}=n;B(y&&T,e,"internal-error");const w=qt.fromJSON(this.name,T);B(typeof y=="string",e,"internal-error"),ot(d,e.name),ot(p,e.name),B(typeof h=="boolean",e,"internal-error"),B(typeof b=="boolean",e,"internal-error"),ot(m,e.name),ot(g,e.name),ot(f,e.name),ot(v,e.name),ot(I,e.name),ot(S,e.name);const _=new Je({uid:y,auth:e,email:p,emailVerified:h,displayName:d,isAnonymous:b,photoURL:g,phoneNumber:m,tenantId:f,stsTokenManager:w,createdAt:I,lastLoginAt:S});return A&&Array.isArray(A)&&(_.providerData=A.map(P=>Object.assign({},P))),v&&(_._redirectEventId=v),_}static async _fromIdTokenResponse(e,n,s=!1){const r=new qt;r.updateFromServerResponse(n);const i=new Je({uid:n.localId,auth:e,stsTokenManager:r,isAnonymous:s});return await ls(i),i}static async _fromGetAccountInfoResponse(e,n,s){const r=n.users[0];B(r.localId!==void 0,"internal-error");const i=r.providerUserInfo!==void 0?Ua(r.providerUserInfo):[],o=!(r.email&&r.passwordHash)&&!(i!=null&&i.length),l=new qt;l.updateFromIdToken(s);const a=new Je({uid:r.localId,auth:e,stsTokenManager:l,isAnonymous:o}),c={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:i,metadata:new _r(r.createdAt,r.lastLoginAt),isAnonymous:!(r.email&&r.passwordHash)&&!(i!=null&&i.length)};return Object.assign(a,c),a}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yi=new Map;function Qe(t){nt(t instanceof Function,"Expected a class definition");let e=Yi.get(t);return e?(nt(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,Yi.set(t,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ga{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}Ga.type="NONE";const $i=Ga;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function es(t,e,n){return`firebase:${t}:${e}:${n}`}class zt{constructor(e,n,s){this.persistence=e,this.auth=n,this.userKey=s;const{config:r,name:i}=this.auth;this.fullUserKey=es(this.userKey,r.apiKey,i),this.fullPersistenceKey=es("persistence",r.apiKey,i),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?Je._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,s="authUser"){if(!n.length)return new zt(Qe($i),e,s);const r=(await Promise.all(n.map(async c=>{if(await c._isAvailable())return c}))).filter(c=>c);let i=r[0]||Qe($i);const o=es(s,e.config.apiKey,e.name);let l=null;for(const c of n)try{const u=await c._get(o);if(u){const d=Je._fromJSON(e,u);c!==i&&(l=d),i=c;break}}catch{}const a=r.filter(c=>c._shouldAllowMigration);return!i._shouldAllowMigration||!a.length?new zt(i,e,s):(i=a[0],l&&await i._set(o,l.toJSON()),await Promise.all(n.map(async c=>{if(c!==i)try{await c._remove(o)}catch{}})),new zt(i,e,s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ji(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Ka(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Ya(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Ha(e))return"Blackberry";if(qa(e))return"Webos";if($a(e))return"Safari";if((e.includes("chrome/")||ja(e))&&!e.includes("edge/"))return"Chrome";if(Wa(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,s=t.match(n);if((s==null?void 0:s.length)===2)return s[1]}return"Other"}function Ya(t=Pe()){return/firefox\//i.test(t)}function $a(t=Pe()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function ja(t=Pe()){return/crios\//i.test(t)}function Ka(t=Pe()){return/iemobile/i.test(t)}function Wa(t=Pe()){return/android/i.test(t)}function Ha(t=Pe()){return/blackberry/i.test(t)}function qa(t=Pe()){return/webos/i.test(t)}function Zr(t=Pe()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function qd(t=Pe()){var e;return Zr(t)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function zd(){return hu()&&document.documentMode===10}function za(t=Pe()){return Zr(t)||Wa(t)||qa(t)||Ha(t)||/windows phone/i.test(t)||Ka(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ja(t,e=[]){let n;switch(t){case"Browser":n=ji(Pe());break;case"Worker":n=`${ji(Pe())}-${t}`;break;default:n=t}const s=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${an}/${s}`}/**
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
 */class Jd{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const s=i=>new Promise((o,l)=>{try{const a=e(i);o(a)}catch(a){l(a)}});s.onAbort=n,this.queue.push(s);const r=this.queue.length-1;return()=>{this.queue[r]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const s of this.queue)await s(e),s.onAbort&&n.push(s.onAbort)}catch(s){n.reverse();for(const r of n)try{r()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:s==null?void 0:s.message})}}}/**
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
 */async function Qd(t,e={}){return ln(t,"GET","/v2/passwordPolicy",Qr(t,e))}/**
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
 */const Xd=6;class Zd{constructor(e){var n,s,r,i;const o=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(n=o.minPasswordLength)!==null&&n!==void 0?n:Xd,o.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=o.maxPasswordLength),o.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=o.containsLowercaseCharacter),o.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=o.containsUppercaseCharacter),o.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=o.containsNumericCharacter),o.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=o.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(r=(s=e.allowedNonAlphanumericCharacters)===null||s===void 0?void 0:s.join(""))!==null&&r!==void 0?r:"",this.forceUpgradeOnSignin=(i=e.forceUpgradeOnSignin)!==null&&i!==void 0?i:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var n,s,r,i,o,l;const a={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,a),this.validatePasswordCharacterOptions(e,a),a.isValid&&(a.isValid=(n=a.meetsMinPasswordLength)!==null&&n!==void 0?n:!0),a.isValid&&(a.isValid=(s=a.meetsMaxPasswordLength)!==null&&s!==void 0?s:!0),a.isValid&&(a.isValid=(r=a.containsLowercaseLetter)!==null&&r!==void 0?r:!0),a.isValid&&(a.isValid=(i=a.containsUppercaseLetter)!==null&&i!==void 0?i:!0),a.isValid&&(a.isValid=(o=a.containsNumericCharacter)!==null&&o!==void 0?o:!0),a.isValid&&(a.isValid=(l=a.containsNonAlphanumericCharacter)!==null&&l!==void 0?l:!0),a}validatePasswordLengthOptions(e,n){const s=this.customStrengthOptions.minPasswordLength,r=this.customStrengthOptions.maxPasswordLength;s&&(n.meetsMinPasswordLength=e.length>=s),r&&(n.meetsMaxPasswordLength=e.length<=r)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let s;for(let r=0;r<e.length;r++)s=e.charAt(r),this.updatePasswordCharacterOptionsStatuses(n,s>="a"&&s<="z",s>="A"&&s<="Z",s>="0"&&s<="9",this.allowedNonAlphanumericCharacters.includes(s))}updatePasswordCharacterOptionsStatuses(e,n,s,r,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=s)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=r)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eh{constructor(e,n,s,r){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=s,this.config=r,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Ki(this),this.idTokenSubscription=new Ki(this),this.beforeStateQueue=new Jd(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=xa,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=r.sdkClientVersion}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=Qe(n)),this._initializationPromise=this.queue(async()=>{var s,r;if(!this._deleted&&(this.persistenceManager=await zt.create(this,e),!this._deleted)){if(!((s=this._popupRedirectResolver)===null||s===void 0)&&s._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((r=this.currentUser)===null||r===void 0?void 0:r.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await Fa(this,{idToken:e}),s=await Je._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(s)}catch{await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var n;if(pt(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(l=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(l,l))}):this.directlySetCurrentUser(null)}const s=await this.assertedPersistence.getCurrentUser();let r=s,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(n=this.redirectUser)===null||n===void 0?void 0:n._redirectEventId,l=r==null?void 0:r._redirectEventId,a=await this.tryRedirectSignIn(e);(!o||o===l)&&(a!=null&&a.user)&&(r=a.user,i=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(r)}catch(o){r=s,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return B(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await ls(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=Cd()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(pt(this.app))return Promise.reject(Dt(this));const n=e?_e(e):null;return n&&B(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&B(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return pt(this.app)?Promise.reject(Dt(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return pt(this.app)?Promise.reject(Dt(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Qe(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await Qd(this),n=new Zd(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new Ln("auth","Firebase",e())}onAuthStateChanged(e,n,s){return this.registerStateListener(this.authStateSubscription,e,n,s)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,s){return this.registerStateListener(this.idTokenSubscription,e,n,s)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const s=this.onAuthStateChanged(()=>{s(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),s={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(s.tenantId=this.tenantId),await Hd(this,s)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,n){const s=await this.getOrInitRedirectPersistenceManager(n);return e===null?s.removeCurrentUser():s.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&Qe(e)||this._popupRedirectResolver;B(n,this,"argument-error"),this.redirectPersistenceManager=await zt.create(this,[Qe(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,s;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)===null||n===void 0?void 0:n._redirectEventId)===e?this._currentUser:((s=this.redirectUser)===null||s===void 0?void 0:s._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const s=(n=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&n!==void 0?n:null;this.lastNotifiedUid!==s&&(this.lastNotifiedUid=s,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,s,r){if(this._deleted)return()=>{};const i=typeof n=="function"?n:n.next.bind(n);let o=!1;const l=this._isInitialized?Promise.resolve():this._initializationPromise;if(B(l,this,"internal-error"),l.then(()=>{o||i(this.currentUser)}),typeof n=="function"){const a=e.addObserver(n,s,r);return()=>{o=!0,a()}}else{const a=e.addObserver(n);return()=>{o=!0,a()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return B(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Ja(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const n={"X-Client-Version":this.clientVersion};this.app.options.appId&&(n["X-Firebase-gmpid"]=this.app.options.appId);const s=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());s&&(n["X-Firebase-Client"]=s);const r=await this._getAppCheckToken();return r&&(n["X-Firebase-AppCheck"]=r),n}async _getAppCheckToken(){var e;const n=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return n!=null&&n.error&&Dd(`Error while retrieving App Check token: ${n.error}`),n==null?void 0:n.token}}function ei(t){return _e(t)}class Ki{constructor(e){this.auth=e,this.observer=null,this.addObserver=Au(n=>this.observer=n)}get next(){return B(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ti={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function th(t){ti=t}function nh(t){return ti.loadJS(t)}function sh(){return ti.gapiScript}function rh(t){return`__${t}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ih(t,e){const n=Hr(t,"auth");if(n.isInitialized()){const r=n.getImmediate(),i=n.getOptions();if(is(i,e??{}))return r;tt(r,"already-initialized")}return n.initialize({options:e})}function oh(t,e){const n=(e==null?void 0:e.persistence)||[],s=(Array.isArray(n)?n:[n]).map(Qe);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(s,e==null?void 0:e.popupRedirectResolver)}function ah(t,e,n){const s=ei(t);B(s._canInitEmulator,s,"emulator-config-failed"),B(/^https?:\/\//.test(e),s,"invalid-emulator-scheme");const r=!1,i=Qa(e),{host:o,port:l}=lh(e),a=l===null?"":`:${l}`;s.config.emulator={url:`${i}//${o}${a}/`},s.settings.appVerificationDisabledForTesting=!0,s.emulatorConfig=Object.freeze({host:o,port:l,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:r})}),ch()}function Qa(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function lh(t){const e=Qa(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const s=n[2].split("@").pop()||"",r=/^(\[[^\]]+\])(:|$)/.exec(s);if(r){const i=r[1];return{host:i,port:Wi(s.substr(i.length+1))}}else{const[i,o]=s.split(":");return{host:i,port:Wi(o)}}}function Wi(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function ch(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xa{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return ze("not implemented")}_getIdTokenResponse(e){return ze("not implemented")}_linkToIdToken(e,n){return ze("not implemented")}_getReauthenticationResolver(e){return ze("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Jt(t,e){return Bd(t,"POST","/v1/accounts:signInWithIdp",Qr(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uh="http://localhost";class Ct extends Xa{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new Ct(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):tt("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:s,signInMethod:r}=n,i=qr(n,["providerId","signInMethod"]);if(!s||!r)return null;const o=new Ct(s,r);return o.idToken=i.idToken||void 0,o.accessToken=i.accessToken||void 0,o.secret=i.secret,o.nonce=i.nonce,o.pendingToken=i.pendingToken||null,o}_getIdTokenResponse(e){const n=this.buildRequest();return Jt(e,n)}_linkToIdToken(e,n){const s=this.buildRequest();return s.idToken=n,Jt(e,s)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,Jt(e,n)}buildRequest(){const e={requestUri:uh,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=Vn(n)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Za{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fn extends Za{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ut extends Fn{constructor(){super("facebook.com")}static credential(e){return Ct._fromParams({providerId:ut.PROVIDER_ID,signInMethod:ut.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return ut.credentialFromTaggedObject(e)}static credentialFromError(e){return ut.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return ut.credential(e.oauthAccessToken)}catch{return null}}}ut.FACEBOOK_SIGN_IN_METHOD="facebook.com";ut.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dt extends Fn{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return Ct._fromParams({providerId:dt.PROVIDER_ID,signInMethod:dt.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return dt.credentialFromTaggedObject(e)}static credentialFromError(e){return dt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:s}=e;if(!n&&!s)return null;try{return dt.credential(n,s)}catch{return null}}}dt.GOOGLE_SIGN_IN_METHOD="google.com";dt.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ht extends Fn{constructor(){super("github.com")}static credential(e){return Ct._fromParams({providerId:ht.PROVIDER_ID,signInMethod:ht.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return ht.credentialFromTaggedObject(e)}static credentialFromError(e){return ht.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return ht.credential(e.oauthAccessToken)}catch{return null}}}ht.GITHUB_SIGN_IN_METHOD="github.com";ht.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ft extends Fn{constructor(){super("twitter.com")}static credential(e,n){return Ct._fromParams({providerId:ft.PROVIDER_ID,signInMethod:ft.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return ft.credentialFromTaggedObject(e)}static credentialFromError(e){return ft.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:s}=e;if(!n||!s)return null;try{return ft.credential(n,s)}catch{return null}}}ft.TWITTER_SIGN_IN_METHOD="twitter.com";ft.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zt{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,s,r=!1){const i=await Je._fromIdTokenResponse(e,s,r),o=Hi(s);return new Zt({user:i,providerId:o,_tokenResponse:s,operationType:n})}static async _forOperation(e,n,s){await e._updateTokensIfNecessary(s,!0);const r=Hi(s);return new Zt({user:e,providerId:r,_tokenResponse:s,operationType:n})}}function Hi(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cs extends rt{constructor(e,n,s,r){var i;super(n.code,n.message),this.operationType=s,this.user=r,Object.setPrototypeOf(this,cs.prototype),this.customData={appName:e.name,tenantId:(i=e.tenantId)!==null&&i!==void 0?i:void 0,_serverResponse:n.customData._serverResponse,operationType:s}}static _fromErrorAndOperation(e,n,s,r){return new cs(e,n,s,r)}}function el(t,e,n,s){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(i=>{throw i.code==="auth/multi-factor-auth-required"?cs._fromErrorAndOperation(t,i,e,s):i})}async function dh(t,e,n=!1){const s=await Pn(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return Zt._forOperation(t,"link",s)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function hh(t,e,n=!1){const{auth:s}=t;if(pt(s.app))return Promise.reject(Dt(s));const r="reauthenticate";try{const i=await Pn(t,el(s,r,e,t),n);B(i.idToken,s,"internal-error");const o=Xr(i.idToken);B(o,s,"internal-error");const{sub:l}=o;return B(t.uid===l,s,"user-mismatch"),Zt._forOperation(t,r,i)}catch(i){throw(i==null?void 0:i.code)==="auth/user-not-found"&&tt(s,"user-mismatch"),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function fh(t,e,n=!1){if(pt(t.app))return Promise.reject(Dt(t));const s="signIn",r=await el(t,s,e),i=await Zt._fromIdTokenResponse(t,s,r);return n||await t._updateCurrentUser(i.user),i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ph(t,e){return _e(t).setPersistence(e)}function mh(t,e,n,s){return _e(t).onIdTokenChanged(e,n,s)}function gh(t,e,n){return _e(t).beforeAuthStateChanged(e,n)}function yh(t,e,n,s){return _e(t).onAuthStateChanged(e,n,s)}function bh(t){return _e(t).signOut()}const us="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tl{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(us,"1"),this.storage.removeItem(us),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ah=1e3,vh=10;class nl extends tl{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=za(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const s=this.storage.getItem(n),r=this.localCache[n];s!==r&&e(n,r,s)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((o,l,a)=>{this.notifyListeners(o,a)});return}const s=e.key;n?this.detachListener():this.stopPolling();const r=()=>{const o=this.storage.getItem(s);!n&&this.localCache[s]===o||this.notifyListeners(s,o)},i=this.storage.getItem(s);zd()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(r,vh):r()}notifyListeners(e,n){this.localCache[e]=n;const s=this.listeners[e];if(s)for(const r of Array.from(s))r(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,s)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:s}),!0)})},Ah)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}nl.type="LOCAL";const sl=nl;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rl extends tl{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}rl.type="SESSION";const il=rl;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Th(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ms{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(r=>r.isListeningto(e));if(n)return n;const s=new Ms(e);return this.receivers.push(s),s}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:s,eventType:r,data:i}=n.data,o=this.handlersMap[r];if(!(o!=null&&o.size))return;n.ports[0].postMessage({status:"ack",eventId:s,eventType:r});const l=Array.from(o).map(async c=>c(n.origin,i)),a=await Th(l);n.ports[0].postMessage({status:"done",eventId:s,eventType:r,response:a})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Ms.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ni(t="",e=10){let n="";for(let s=0;s<e;s++)n+=Math.floor(Math.random()*10);return t+n}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _h{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,s=50){const r=typeof MessageChannel<"u"?new MessageChannel:null;if(!r)throw new Error("connection_unavailable");let i,o;return new Promise((l,a)=>{const c=ni("",20);r.port1.start();const u=setTimeout(()=>{a(new Error("unsupported_event"))},s);o={messageChannel:r,onMessage(d){const p=d;if(p.data.eventId===c)switch(p.data.status){case"ack":clearTimeout(u),i=setTimeout(()=>{a(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),l(p.data.response);break;default:clearTimeout(u),clearTimeout(i),a(new Error("invalid_response"));break}}},this.handlers.add(o),r.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:c,data:n},[r.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function We(){return window}function Sh(t){We().location.href=t}/**
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
 */function ol(){return typeof We().WorkerGlobalScope<"u"&&typeof We().importScripts=="function"}async function wh(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function Ih(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)===null||t===void 0?void 0:t.controller)||null}function kh(){return ol()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const al="firebaseLocalStorageDb",Eh=1,ds="firebaseLocalStorage",ll="fbase_key";class Un{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function Os(t,e){return t.transaction([ds],e?"readwrite":"readonly").objectStore(ds)}function Ph(){const t=indexedDB.deleteDatabase(al);return new Un(t).toPromise()}function Sr(){const t=indexedDB.open(al,Eh);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const s=t.result;try{s.createObjectStore(ds,{keyPath:ll})}catch(r){n(r)}}),t.addEventListener("success",async()=>{const s=t.result;s.objectStoreNames.contains(ds)?e(s):(s.close(),await Ph(),e(await Sr()))})})}async function qi(t,e,n){const s=Os(t,!0).put({[ll]:e,value:n});return new Un(s).toPromise()}async function Rh(t,e){const n=Os(t,!1).get(e),s=await new Un(n).toPromise();return s===void 0?null:s.value}function zi(t,e){const n=Os(t,!0).delete(e);return new Un(n).toPromise()}const Mh=800,Oh=3;class cl{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await Sr(),this.db)}async _withRetries(e){let n=0;for(;;)try{const s=await this._openDb();return await e(s)}catch(s){if(n++>Oh)throw s;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return ol()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Ms._getInstance(kh()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var e,n;if(this.activeServiceWorker=await wh(),!this.activeServiceWorker)return;this.sender=new _h(this.activeServiceWorker);const s=await this.sender._send("ping",{},800);s&&!((e=s[0])===null||e===void 0)&&e.fulfilled&&!((n=s[0])===null||n===void 0)&&n.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||Ih()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await Sr();return await qi(e,us,"1"),await zi(e,us),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(s=>qi(s,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(s=>Rh(s,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>zi(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(r=>{const i=Os(r,!1).getAll();return new Un(i).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],s=new Set;if(e.length!==0)for(const{fbase_key:r,value:i}of e)s.add(r),JSON.stringify(this.localCache[r])!==JSON.stringify(i)&&(this.notifyListeners(r,i),n.push(r));for(const r of Object.keys(this.localCache))this.localCache[r]&&!s.has(r)&&(this.notifyListeners(r,null),n.push(r));return n}notifyListeners(e,n){this.localCache[e]=n;const s=this.listeners[e];if(s)for(const r of Array.from(s))r(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),Mh)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}cl.type="LOCAL";const Dh=cl;new Bn(3e4,6e4);/**
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
 */function Nh(t,e){return e?Qe(e):(B(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class si extends Xa{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Jt(e,this._buildIdpRequest())}_linkToIdToken(e,n){return Jt(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return Jt(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function xh(t){return fh(t.auth,new si(t),t.bypassAuthState)}function Ch(t){const{auth:e,user:n}=t;return B(n,e,"internal-error"),hh(n,new si(t),t.bypassAuthState)}async function Lh(t){const{auth:e,user:n}=t;return B(n,e,"internal-error"),dh(n,new si(t),t.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ul{constructor(e,n,s,r,i=!1){this.auth=e,this.resolver=s,this.user=r,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(s){this.reject(s)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:s,postBody:r,tenantId:i,error:o,type:l}=e;if(o){this.reject(o);return}const a={auth:this.auth,requestUri:n,sessionId:s,tenantId:i||void 0,postBody:r||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(l)(a))}catch(c){this.reject(c)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return xh;case"linkViaPopup":case"linkViaRedirect":return Lh;case"reauthViaPopup":case"reauthViaRedirect":return Ch;default:tt(this.auth,"internal-error")}}resolve(e){nt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){nt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vh=new Bn(2e3,1e4);class Kt extends ul{constructor(e,n,s,r,i){super(e,n,r,i),this.provider=s,this.authWindow=null,this.pollId=null,Kt.currentPopupAction&&Kt.currentPopupAction.cancel(),Kt.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return B(e,this.auth,"internal-error"),e}async onExecution(){nt(this.filter.length===1,"Popup operations only handle one event");const e=ni();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(Ke(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(Ke(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Kt.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,s;if(!((s=(n=this.authWindow)===null||n===void 0?void 0:n.window)===null||s===void 0)&&s.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Ke(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,Vh.get())};e()}}Kt.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bh="pendingRedirect",ts=new Map;class Fh extends ul{constructor(e,n,s=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,s),this.eventId=null}async execute(){let e=ts.get(this.auth._key());if(!e){try{const s=await Uh(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(s)}catch(n){e=()=>Promise.reject(n)}ts.set(this.auth._key(),e)}return this.bypassAuthState||ts.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Uh(t,e){const n=$h(e),s=Yh(t);if(!await s._isAvailable())return!1;const r=await s._get(n)==="true";return await s._remove(n),r}function Gh(t,e){ts.set(t._key(),e)}function Yh(t){return Qe(t._redirectPersistence)}function $h(t){return es(Bh,t.config.apiKey,t.name)}async function jh(t,e,n=!1){if(pt(t.app))return Promise.reject(Dt(t));const s=ei(t),r=Nh(s,e),o=await new Fh(s,r,n).execute();return o&&!n&&(delete o.user._redirectEventId,await s._persistUserIfCurrent(o.user),await s._setRedirectUser(null,e)),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kh=10*60*1e3;class Wh{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(s=>{this.isEventForConsumer(e,s)&&(n=!0,this.sendToConsumer(e,s),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Hh(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var s;if(e.error&&!dl(e)){const r=((s=e.error.code)===null||s===void 0?void 0:s.split("auth/")[1])||"internal-error";n.onError(Ke(this.auth,r))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const s=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&s}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Kh&&this.cachedEventUids.clear(),this.cachedEventUids.has(Ji(e))}saveEventToCache(e){this.cachedEventUids.add(Ji(e)),this.lastProcessedEventTime=Date.now()}}function Ji(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function dl({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Hh(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return dl(t);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function qh(t,e={}){return ln(t,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zh=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Jh=/^https?/;async function Qh(t){if(t.config.emulator)return;const{authorizedDomains:e}=await qh(t);for(const n of e)try{if(Xh(n))return}catch{}tt(t,"unauthorized-domain")}function Xh(t){const e=Tr(),{protocol:n,hostname:s}=new URL(e);if(t.startsWith("chrome-extension://")){const o=new URL(t);return o.hostname===""&&s===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&o.hostname===s}if(!Jh.test(n))return!1;if(zh.test(t))return s===t;const r=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+r+"|"+r+")$","i").test(s)}/**
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
 */const Zh=new Bn(3e4,6e4);function Qi(){const t=We().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function ef(t){return new Promise((e,n)=>{var s,r,i;function o(){Qi(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Qi(),n(Ke(t,"network-request-failed"))},timeout:Zh.get()})}if(!((r=(s=We().gapi)===null||s===void 0?void 0:s.iframes)===null||r===void 0)&&r.Iframe)e(gapi.iframes.getContext());else if(!((i=We().gapi)===null||i===void 0)&&i.load)o();else{const l=rh("iframefcb");return We()[l]=()=>{gapi.load?o():n(Ke(t,"network-request-failed"))},nh(`${sh()}?onload=${l}`).catch(a=>n(a))}}).catch(e=>{throw ns=null,e})}let ns=null;function tf(t){return ns=ns||ef(t),ns}/**
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
 */const nf=new Bn(5e3,15e3),sf="__/auth/iframe",rf="emulator/auth/iframe",of={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},af=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function lf(t){const e=t.config;B(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?Jr(e,rf):`https://${t.config.authDomain}/${sf}`,s={apiKey:e.apiKey,appName:t.name,v:an},r=af.get(t.config.apiHost);r&&(s.eid=r);const i=t._getFrameworks();return i.length&&(s.fw=i.join(",")),`${n}?${Vn(s).slice(1)}`}async function cf(t){const e=await tf(t),n=We().gapi;return B(n,t,"internal-error"),e.open({where:document.body,url:lf(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:of,dontclear:!0},s=>new Promise(async(r,i)=>{await s.restyle({setHideOnLeave:!1});const o=Ke(t,"network-request-failed"),l=We().setTimeout(()=>{i(o)},nf.get());function a(){We().clearTimeout(l),r(s)}s.ping(a).then(a,()=>{i(o)})}))}/**
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
 */const uf={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},df=500,hf=600,ff="_blank",pf="http://localhost";class Xi{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function mf(t,e,n,s=df,r=hf){const i=Math.max((window.screen.availHeight-r)/2,0).toString(),o=Math.max((window.screen.availWidth-s)/2,0).toString();let l="";const a=Object.assign(Object.assign({},uf),{width:s.toString(),height:r.toString(),top:i,left:o}),c=Pe().toLowerCase();n&&(l=ja(c)?ff:n),Ya(c)&&(e=e||pf,a.scrollbars="yes");const u=Object.entries(a).reduce((p,[m,g])=>`${p}${m}=${g},`,"");if(qd(c)&&l!=="_self")return gf(e||"",l),new Xi(null);const d=window.open(e||"",l,u);B(d,t,"popup-blocked");try{d.focus()}catch{}return new Xi(d)}function gf(t,e){const n=document.createElement("a");n.href=t,n.target=e;const s=document.createEvent("MouseEvent");s.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(s)}/**
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
 */const yf="__/auth/handler",bf="emulator/auth/handler",Af=encodeURIComponent("fac");async function Zi(t,e,n,s,r,i){B(t.config.authDomain,t,"auth-domain-config-required"),B(t.config.apiKey,t,"invalid-api-key");const o={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:s,v:an,eventId:r};if(e instanceof Za){e.setDefaultLanguage(t.languageCode),o.providerId=e.providerId||"",bu(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[u,d]of Object.entries({}))o[u]=d}if(e instanceof Fn){const u=e.getScopes().filter(d=>d!=="");u.length>0&&(o.scopes=u.join(","))}t.tenantId&&(o.tid=t.tenantId);const l=o;for(const u of Object.keys(l))l[u]===void 0&&delete l[u];const a=await t._getAppCheckToken(),c=a?`#${Af}=${encodeURIComponent(a)}`:"";return`${vf(t)}?${Vn(l).slice(1)}${c}`}function vf({config:t}){return t.emulator?Jr(t,bf):`https://${t.authDomain}/${yf}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rr="webStorageSupport";class Tf{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=il,this._completeRedirectFn=jh,this._overrideRedirectResult=Gh}async _openPopup(e,n,s,r){var i;nt((i=this.eventManagers[e._key()])===null||i===void 0?void 0:i.manager,"_initialize() not called before _openPopup()");const o=await Zi(e,n,s,Tr(),r);return mf(e,o,ni())}async _openRedirect(e,n,s,r){await this._originValidation(e);const i=await Zi(e,n,s,Tr(),r);return Sh(i),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:r,promise:i}=this.eventManagers[n];return r?Promise.resolve(r):(nt(i,"If manager is not set, promise should be"),i)}const s=this.initAndGetManager(e);return this.eventManagers[n]={promise:s},s.catch(()=>{delete this.eventManagers[n]}),s}async initAndGetManager(e){const n=await cf(e),s=new Wh(e);return n.register("authEvent",r=>(B(r==null?void 0:r.authEvent,e,"invalid-auth-event"),{status:s.onEvent(r.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:s},this.iframes[e._key()]=n,s}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(rr,{type:rr},r=>{var i;const o=(i=r==null?void 0:r[0])===null||i===void 0?void 0:i[rr];o!==void 0&&n(!!o),tt(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=Qh(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return za()||$a()||Zr()}}const _f=Tf;var eo="@firebase/auth",to="1.7.9";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sf{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(s=>{e((s==null?void 0:s.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){B(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wf(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function If(t){Xt(new xt("auth",(e,{options:n})=>{const s=e.getProvider("app").getImmediate(),r=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:o,authDomain:l}=s.options;B(o&&!o.includes(":"),"invalid-api-key",{appName:s.name});const a={apiKey:o,authDomain:l,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Ja(t)},c=new eh(s,r,i,a);return oh(c,n),c},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,s)=>{e.getProvider("auth-internal").initialize()})),Xt(new xt("auth-internal",e=>{const n=ei(e.getProvider("auth").getImmediate());return(s=>new Sf(s))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),At(eo,to,wf(t)),At(eo,to,"esm2017")}/**
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
 */const kf=5*60,Ef=ka("authIdTokenMaxAge")||kf;let no=null;const Pf=t=>async e=>{const n=e&&await e.getIdTokenResult(),s=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(s&&s>Ef)return;const r=n==null?void 0:n.token;no!==r&&(no=r,await fetch(t,{method:r?"POST":"DELETE",headers:r?{Authorization:`Bearer ${r}`}:{}}))};function Rf(t=Ma()){const e=Hr(t,"auth");if(e.isInitialized())return e.getImmediate();const n=ih(t,{popupRedirectResolver:_f,persistence:[Dh,sl,il]}),s=ka("authTokenSyncURL");if(s&&typeof isSecureContext=="boolean"&&isSecureContext){const i=new URL(s,location.origin);if(location.origin===i.origin){const o=Pf(i.toString());gh(n,o,()=>o(n.currentUser)),mh(n,l=>o(l))}}const r=wa("auth");return r&&ah(n,`http://${r}`),n}function Mf(){var t,e;return(e=(t=document.getElementsByTagName("head"))===null||t===void 0?void 0:t[0])!==null&&e!==void 0?e:document}th({loadJS(t){return new Promise((e,n)=>{const s=document.createElement("script");s.setAttribute("src",t),s.onload=e,s.onerror=r=>{const i=Ke("internal-error");i.customData=r,n(i)},s.type="text/javascript",s.charset="UTF-8",Mf().appendChild(s)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});If("Browser");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Me{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Me.UNAUTHENTICATED=new Me(null),Me.GOOGLE_CREDENTIALS=new Me("google-credentials-uid"),Me.FIRST_PARTY=new Me("first-party-uid"),Me.MOCK_USER=new Me("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let cn="10.14.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const en=new Kr("@firebase/firestore");function hs(t,...e){if(en.logLevel<=Q.DEBUG){const n=e.map(ii);en.debug(`Firestore (${cn}): ${t}`,...n)}}function ri(t,...e){if(en.logLevel<=Q.ERROR){const n=e.map(ii);en.error(`Firestore (${cn}): ${t}`,...n)}}function hl(t,...e){if(en.logLevel<=Q.WARN){const n=e.map(ii);en.warn(`Firestore (${cn}): ${t}`,...n)}}function ii(t){if(typeof t=="string")return t;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
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
 */function ce(t="Unexpected state"){const e=`FIRESTORE (${cn}) INTERNAL ASSERTION FAILED: `+t;throw ri(e),new Error(e)}function _t(t,e){t||ce()}function Ds(t,e){return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const so="ok",Of="cancelled",vn="unknown",K="invalid-argument",Df="deadline-exceeded",Nf="not-found",xf="permission-denied",wr="unauthenticated",Cf="resource-exhausted",tn="failed-precondition",Lf="aborted",Vf="out-of-range",fl="unimplemented",Bf="internal",Ff="unavailable";class U extends rt{constructor(e,n){super(e,n),this.code=e,this.message=n,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pl{constructor(e,n){this.user=n,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class Uf{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,n){e.enqueueRetryable(()=>n(Me.UNAUTHENTICATED))}shutdown(){}}class Gf{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,n){this.changeListener=n,e.enqueueRetryable(()=>n(this.token.user))}shutdown(){this.changeListener=null}}class Yf{constructor(e){this.auth=null,e.onInit(n=>{this.auth=n})}getToken(){return this.auth?this.auth.getToken().then(e=>e?(_t(typeof e.accessToken=="string"),new pl(e.accessToken,new Me(this.auth.getUid()))):null):Promise.resolve(null)}invalidateToken(){}start(e,n){}shutdown(){}}class $f{constructor(e,n,s){this.t=e,this.i=n,this.o=s,this.type="FirstParty",this.user=Me.FIRST_PARTY,this.u=new Map}l(){return this.o?this.o():null}get headers(){this.u.set("X-Goog-AuthUser",this.t);const e=this.l();return e&&this.u.set("Authorization",e),this.i&&this.u.set("X-Goog-Iam-Authorization-Token",this.i),this.u}}class jf{constructor(e,n,s){this.t=e,this.i=n,this.o=s}getToken(){return Promise.resolve(new $f(this.t,this.i,this.o))}start(e,n){e.enqueueRetryable(()=>n(Me.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class Kf{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class Wf{constructor(e){this.h=e,this.appCheck=null,e.onInit(n=>{this.appCheck=n})}getToken(){return this.appCheck?this.appCheck.getToken().then(e=>e?(_t(typeof e.token=="string"),new Kf(e.token)):null):Promise.resolve(null)}invalidateToken(){}start(e,n){}shutdown(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hf{constructor(e,n,s,r,i,o,l,a,c){this.databaseId=e,this.appId=n,this.persistenceKey=s,this.host=r,this.ssl=i,this.forceLongPolling=o,this.autoDetectLongPolling=l,this.longPollingOptions=a,this.useFetchStreams=c}}class Rn{constructor(e,n){this.projectId=e,this.database=n||"(default)"}static empty(){return new Rn("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof Rn&&e.projectId===this.projectId&&e.database===this.database}}class Mn{constructor(e,n,s){n===void 0?n=0:n>e.length&&ce(),s===void 0?s=e.length-n:s>e.length-n&&ce(),this.segments=e,this.offset=n,this.len=s}get length(){return this.len}isEqual(e){return Mn.comparator(this,e)===0}child(e){const n=this.segments.slice(this.offset,this.limit());return e instanceof Mn?e.forEach(s=>{n.push(s)}):n.push(e),this.construct(n)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}forEach(e){for(let n=this.offset,s=this.limit();n<s;n++)e(this.segments[n])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,n){const s=Math.min(e.length,n.length);for(let r=0;r<s;r++){const i=e.get(r),o=n.get(r);if(i<o)return-1;if(i>o)return 1}return e.length<n.length?-1:e.length>n.length?1:0}}class ve extends Mn{construct(e,n,s){return new ve(e,n,s)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const n=[];for(const s of e){if(s.indexOf("//")>=0)throw new U(K,`Invalid segment (${s}). Paths must not contain // in them.`);n.push(...s.split("/").filter(r=>r.length>0))}return new ve(n)}static emptyPath(){return new ve([])}}const qf=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class De extends Mn{construct(e,n,s){return new De(e,n,s)}static isValidIdentifier(e){return qf.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),De.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new De(["__name__"])}static fromServerFormat(e){const n=[];let s="",r=0;const i=()=>{if(s.length===0)throw new U(K,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);n.push(s),s=""};let o=!1;for(;r<e.length;){const l=e[r];if(l==="\\"){if(r+1===e.length)throw new U(K,"Path has trailing escape character: "+e);const a=e[r+1];if(a!=="\\"&&a!=="."&&a!=="`")throw new U(K,"Path has invalid escape sequence: "+e);s+=a,r+=2}else l==="`"?(o=!o,r++):l!=="."||o?(s+=l,r++):(i(),r++)}if(i(),o)throw new U(K,"Unterminated ` in path: "+e);return new De(n)}static emptyPath(){return new De([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ke{constructor(e){this.path=e}static fromPath(e){return new ke(ve.fromString(e))}static fromName(e){return new ke(ve.fromString(e).popFirst(5))}static empty(){return new ke(ve.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&ve.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,n){return ve.comparator(e.path,n.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new ke(new ve(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ml(t,e,n){if(!n)throw new U(K,`Function ${t}() cannot be called with an empty ${e}.`)}function ro(t){if(!ke.isDocumentKey(t))throw new U(K,`Invalid document reference. Document references must have an even number of segments, but ${t} has ${t.length}.`)}function io(t){if(ke.isDocumentKey(t))throw new U(K,`Invalid collection reference. Collection references must have an odd number of segments, but ${t} has ${t.length}.`)}function oi(t){if(t===void 0)return"undefined";if(t===null)return"null";if(typeof t=="string")return t.length>20&&(t=`${t.substring(0,20)}...`),JSON.stringify(t);if(typeof t=="number"||typeof t=="boolean")return""+t;if(typeof t=="object"){if(t instanceof Array)return"an array";{const e=function(s){return s.constructor?s.constructor.name:null}(t);return e?`a custom ${e} object`:"an object"}}return typeof t=="function"?"a function":ce()}function ai(t,e){if("_delegate"in t&&(t=t._delegate),!(t instanceof e)){if(e.name===t.constructor.name)throw new U(K,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=oi(t);throw new U(K,`Expected type '${e.name}', but it was: ${n}`)}}return t}/**
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
 */function gl(t){const e={};return t.timeoutSeconds!==void 0&&(e.timeoutSeconds=t.timeoutSeconds),e}/**
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
 */let Wn=null;function zf(){return Wn===null?Wn=function(){return 268435456+Math.round(2147483648*Math.random())}():Wn++,"0x"+Wn.toString(16)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jf(t){return t==null}function fs(t){return t===0&&1/t==-1/0}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qf={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var oo,$;function ao(t){if(t===void 0)return ri("RPC_ERROR","HTTP error has no status"),vn;switch(t){case 200:return so;case 400:return tn;case 401:return wr;case 403:return xf;case 404:return Nf;case 409:return Lf;case 416:return Vf;case 429:return Cf;case 499:return Of;case 500:return vn;case 501:return fl;case 503:return Ff;case 504:return Df;default:return t>=200&&t<300?so:t>=400&&t<500?tn:t>=500&&t<600?Bf:vn}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */($=oo||(oo={}))[$.OK=0]="OK",$[$.CANCELLED=1]="CANCELLED",$[$.UNKNOWN=2]="UNKNOWN",$[$.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",$[$.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",$[$.NOT_FOUND=5]="NOT_FOUND",$[$.ALREADY_EXISTS=6]="ALREADY_EXISTS",$[$.PERMISSION_DENIED=7]="PERMISSION_DENIED",$[$.UNAUTHENTICATED=16]="UNAUTHENTICATED",$[$.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",$[$.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",$[$.ABORTED=10]="ABORTED",$[$.OUT_OF_RANGE=11]="OUT_OF_RANGE",$[$.UNIMPLEMENTED=12]="UNIMPLEMENTED",$[$.INTERNAL=13]="INTERNAL",$[$.UNAVAILABLE=14]="UNAVAILABLE",$[$.DATA_LOSS=15]="DATA_LOSS";class Xf extends class{constructor(n){this.databaseInfo=n,this.databaseId=n.databaseId;const s=n.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),i=encodeURIComponent(this.databaseId.database);this.m=s+"://"+n.host,this.A=`projects/${r}/databases/${i}`,this.T=this.databaseId.database==="(default)"?`project_id=${r}`:`project_id=${r}&database_id=${i}`}get R(){return!1}P(n,s,r,i,o){const l=zf(),a=this.V(n,s.toUriEncodedString());hs("RestConnection",`Sending RPC '${n}' ${l}:`,a,r);const c={"google-cloud-resource-prefix":this.A,"x-goog-request-params":this.T};return this.I(c,i,o),this.p(n,a,c,r).then(u=>(hs("RestConnection",`Received RPC '${n}' ${l}: `,u),u),u=>{throw hl("RestConnection",`RPC '${n}' ${l} failed with error: `,u,"url: ",a,"request:",r),u})}g(n,s,r,i,o,l){return this.P(n,s,r,i,o)}I(n,s,r){n["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+cn}(),n["Content-Type"]="text/plain",this.databaseInfo.appId&&(n["X-Firebase-GMPID"]=this.databaseInfo.appId),s&&s.headers.forEach((i,o)=>n[o]=i),r&&r.headers.forEach((i,o)=>n[o]=i)}V(n,s){const r=Qf[n];return`${this.m}/v1/${s}:${r}`}terminate(){}}{constructor(e,n){super(e),this.F=n}v(e,n){throw new Error("Not supported by FetchConnection")}async p(e,n,s,r){var i;const o=JSON.stringify(r);let l;try{l=await this.F(n,{method:"POST",headers:s,body:o})}catch(a){const c=a;throw new U(ao(c.status),"Request failed with error: "+c.statusText)}if(!l.ok){let a=await l.json();Array.isArray(a)&&(a=a[0]);const c=(i=a==null?void 0:a.error)===null||i===void 0?void 0:i.message;throw new U(ao(l.status),`Request failed with error: ${c??l.statusText}`)}return l.json()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zf(t){const e=typeof self<"u"&&(self.crypto||self.msCrypto),n=new Uint8Array(t);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(n);else for(let s=0;s<t;s++)n[s]=Math.floor(256*Math.random());return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ep{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=Math.floor(256/e.length)*e.length;let s="";for(;s.length<20;){const r=Zf(40);for(let i=0;i<r.length;++i)s.length<20&&r[i]<n&&(s+=e.charAt(r[i]%e.length))}return s}}function ge(t,e){return t<e?-1:t>e?1:0}function yl(t,e,n){return t.length===e.length&&t.every((s,r)=>n(s,e[r]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lo(t){let e=0;for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e++;return e}function Gn(t,e){for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e(n,t[n])}/**
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
 */class tp extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class st{constructor(e){this.binaryString=e}static fromBase64String(e){const n=function(r){try{return atob(r)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new tp("Invalid base64 string: "+i):i}}(e);return new st(n)}static fromUint8Array(e){const n=function(r){let i="";for(let o=0;o<r.length;++o)i+=String.fromCharCode(r[o]);return i}(e);return new st(n)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(n){return btoa(n)}(this.binaryString)}toUint8Array(){return function(n){const s=new Uint8Array(n.length);for(let r=0;r<n.length;r++)s[r]=n.charCodeAt(r);return s}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return ge(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}st.EMPTY_BYTE_STRING=new st("");const np=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Lt(t){if(_t(!!t),typeof t=="string"){let e=0;const n=np.exec(t);if(_t(!!n),n[1]){let r=n[1];r=(r+"000000000").substr(0,9),e=Number(r)}const s=new Date(t);return{seconds:Math.floor(s.getTime()/1e3),nanos:e}}return{seconds:fe(t.seconds),nanos:fe(t.nanos)}}function fe(t){return typeof t=="number"?t:typeof t=="string"?Number(t):0}function On(t){return typeof t=="string"?st.fromBase64String(t):st.fromUint8Array(t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ce{constructor(e,n){if(this.seconds=e,this.nanoseconds=n,n<0)throw new U(K,"Timestamp nanoseconds out of range: "+n);if(n>=1e9)throw new U(K,"Timestamp nanoseconds out of range: "+n);if(e<-62135596800)throw new U(K,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new U(K,"Timestamp seconds out of range: "+e)}static now(){return Ce.fromMillis(Date.now())}static fromDate(e){return Ce.fromMillis(e.getTime())}static fromMillis(e){const n=Math.floor(e/1e3),s=Math.floor(1e6*(e-1e3*n));return new Ce(n,s)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?ge(this.nanoseconds,e.nanoseconds):ge(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bl(t){var e,n;return((n=(((e=t==null?void 0:t.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||n===void 0?void 0:n.stringValue)==="server_timestamp"}function Al(t){const e=t.mapValue.fields.__previous_value__;return bl(e)?Al(e):e}function Dn(t){const e=Lt(t.mapValue.fields.__local_write_time__.timestampValue);return new Ce(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hn={};function Vt(t){return"nullValue"in t?0:"booleanValue"in t?1:"integerValue"in t||"doubleValue"in t?2:"timestampValue"in t?3:"stringValue"in t?5:"bytesValue"in t?6:"referenceValue"in t?7:"geoPointValue"in t?8:"arrayValue"in t?9:"mapValue"in t?bl(t)?4:function(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}(t)?9007199254740991:function(n){var s,r;return((r=(((s=n==null?void 0:n.mapValue)===null||s===void 0?void 0:s.fields)||{}).__type__)===null||r===void 0?void 0:r.stringValue)==="__vector__"}(t)?10:11:ce()}function ps(t,e){if(t===e)return!0;const n=Vt(t);if(n!==Vt(e))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return t.booleanValue===e.booleanValue;case 4:return Dn(t).isEqual(Dn(e));case 3:return function(r,i){if(typeof r.timestampValue=="string"&&typeof i.timestampValue=="string"&&r.timestampValue.length===i.timestampValue.length)return r.timestampValue===i.timestampValue;const o=Lt(r.timestampValue),l=Lt(i.timestampValue);return o.seconds===l.seconds&&o.nanos===l.nanos}(t,e);case 5:return t.stringValue===e.stringValue;case 6:return function(r,i){return On(r.bytesValue).isEqual(On(i.bytesValue))}(t,e);case 7:return t.referenceValue===e.referenceValue;case 8:return function(r,i){return fe(r.geoPointValue.latitude)===fe(i.geoPointValue.latitude)&&fe(r.geoPointValue.longitude)===fe(i.geoPointValue.longitude)}(t,e);case 2:return function(r,i){if("integerValue"in r&&"integerValue"in i)return fe(r.integerValue)===fe(i.integerValue);if("doubleValue"in r&&"doubleValue"in i){const o=fe(r.doubleValue),l=fe(i.doubleValue);return o===l?fs(o)===fs(l):isNaN(o)&&isNaN(l)}return!1}(t,e);case 9:return yl(t.arrayValue.values||[],e.arrayValue.values||[],ps);case 10:case 11:return function(r,i){const o=r.mapValue.fields||{},l=i.mapValue.fields||{};if(lo(o)!==lo(l))return!1;for(const a in o)if(o.hasOwnProperty(a)&&(l[a]===void 0||!ps(o[a],l[a])))return!1;return!0}(t,e);default:return ce()}}function Nn(t,e){return(t.values||[]).find(n=>ps(n,e))!==void 0}function ms(t,e){if(t===e)return 0;const n=Vt(t),s=Vt(e);if(n!==s)return ge(n,s);switch(n){case 0:case 9007199254740991:return 0;case 1:return ge(t.booleanValue,e.booleanValue);case 2:return function(i,o){const l=fe(i.integerValue||i.doubleValue),a=fe(o.integerValue||o.doubleValue);return l<a?-1:l>a?1:l===a?0:isNaN(l)?isNaN(a)?0:-1:1}(t,e);case 3:return co(t.timestampValue,e.timestampValue);case 4:return co(Dn(t),Dn(e));case 5:return ge(t.stringValue,e.stringValue);case 6:return function(i,o){const l=On(i),a=On(o);return l.compareTo(a)}(t.bytesValue,e.bytesValue);case 7:return function(i,o){const l=i.split("/"),a=o.split("/");for(let c=0;c<l.length&&c<a.length;c++){const u=ge(l[c],a[c]);if(u!==0)return u}return ge(l.length,a.length)}(t.referenceValue,e.referenceValue);case 8:return function(i,o){const l=ge(fe(i.latitude),fe(o.latitude));return l!==0?l:ge(fe(i.longitude),fe(o.longitude))}(t.geoPointValue,e.geoPointValue);case 9:return uo(t.arrayValue,e.arrayValue);case 10:return function(i,o){var l,a,c,u;const d=i.fields||{},p=o.fields||{},m=(l=d.value)===null||l===void 0?void 0:l.arrayValue,g=(a=p.value)===null||a===void 0?void 0:a.arrayValue,f=ge(((c=m==null?void 0:m.values)===null||c===void 0?void 0:c.length)||0,((u=g==null?void 0:g.values)===null||u===void 0?void 0:u.length)||0);return f!==0?f:uo(m,g)}(t.mapValue,e.mapValue);case 11:return function(i,o){if(i===Hn&&o===Hn)return 0;if(i===Hn)return 1;if(o===Hn)return-1;const l=i.fields||{},a=Object.keys(l),c=o.fields||{},u=Object.keys(c);a.sort(),u.sort();for(let d=0;d<a.length&&d<u.length;++d){const p=ge(a[d],u[d]);if(p!==0)return p;const m=ms(l[a[d]],c[u[d]]);if(m!==0)return m}return ge(a.length,u.length)}(t.mapValue,e.mapValue);default:throw ce()}}function co(t,e){if(typeof t=="string"&&typeof e=="string"&&t.length===e.length)return ge(t,e);const n=Lt(t),s=Lt(e),r=ge(n.seconds,s.seconds);return r!==0?r:ge(n.nanos,s.nanos)}function uo(t,e){const n=t.values||[],s=e.values||[];for(let r=0;r<n.length&&r<s.length;++r){const i=ms(n[r],s[r]);if(i)return i}return ge(n.length,s.length)}function vl(t){return!!t&&"arrayValue"in t}function ho(t){return!!t&&"nullValue"in t}function fo(t){return!!t&&"doubleValue"in t&&isNaN(Number(t.doubleValue))}function ir(t){return!!t&&"mapValue"in t}function Tn(t){if(t.geoPointValue)return{geoPointValue:Object.assign({},t.geoPointValue)};if(t.timestampValue&&typeof t.timestampValue=="object")return{timestampValue:Object.assign({},t.timestampValue)};if(t.mapValue){const e={mapValue:{fields:{}}};return Gn(t.mapValue.fields,(n,s)=>e.mapValue.fields[n]=Tn(s)),e}if(t.arrayValue){const e={arrayValue:{values:[]}};for(let n=0;n<(t.arrayValue.values||[]).length;++n)e.arrayValue.values[n]=Tn(t.arrayValue.values[n]);return e}return Object.assign({},t)}class po{constructor(e,n){this.position=e,this.inclusive=n}}/**
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
 */class Tl{}class qe extends Tl{constructor(e,n,s){super(),this.field=e,this.op=n,this.value=s}static create(e,n,s){return e.isKeyField()?n==="in"||n==="not-in"?this.createKeyFieldInFilter(e,n,s):new sp(e,n,s):n==="array-contains"?new op(e,s):n==="in"?new ap(e,s):n==="not-in"?new lp(e,s):n==="array-contains-any"?new cp(e,s):new qe(e,n,s)}static createKeyFieldInFilter(e,n,s){return n==="in"?new rp(e,s):new ip(e,s)}matches(e){const n=e.data.field(this.field);return this.op==="!="?n!==null&&this.matchesComparison(ms(n,this.value)):n!==null&&Vt(this.value)===Vt(n)&&this.matchesComparison(ms(n,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return ce()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Ns extends Tl{constructor(e,n){super(),this.filters=e,this.op=n,this.D=null}static create(e,n){return new Ns(e,n)}matches(e){return function(s){return s.op==="and"}(this)?this.filters.find(n=>!n.matches(e))===void 0:this.filters.find(n=>n.matches(e))!==void 0}getFlattenedFilters(){return this.D!==null||(this.D=this.filters.reduce((e,n)=>e.concat(n.getFlattenedFilters()),[])),this.D}getFilters(){return Object.assign([],this.filters)}}class sp extends qe{constructor(e,n,s){super(e,n,s),this.key=ke.fromName(s.referenceValue)}matches(e){const n=ke.comparator(e.key,this.key);return this.matchesComparison(n)}}class rp extends qe{constructor(e,n){super(e,"in",n),this.keys=_l("in",n)}matches(e){return this.keys.some(n=>n.isEqual(e.key))}}class ip extends qe{constructor(e,n){super(e,"not-in",n),this.keys=_l("not-in",n)}matches(e){return!this.keys.some(n=>n.isEqual(e.key))}}function _l(t,e){var n;return(((n=e.arrayValue)===null||n===void 0?void 0:n.values)||[]).map(s=>ke.fromName(s.referenceValue))}class op extends qe{constructor(e,n){super(e,"array-contains",n)}matches(e){const n=e.data.field(this.field);return vl(n)&&Nn(n.arrayValue,this.value)}}class ap extends qe{constructor(e,n){super(e,"in",n)}matches(e){const n=e.data.field(this.field);return n!==null&&Nn(this.value.arrayValue,n)}}class lp extends qe{constructor(e,n){super(e,"not-in",n)}matches(e){if(Nn(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const n=e.data.field(this.field);return n!==null&&!Nn(this.value.arrayValue,n)}}class cp extends qe{constructor(e,n){super(e,"array-contains-any",n)}matches(e){const n=e.data.field(this.field);return!(!vl(n)||!n.arrayValue.values)&&n.arrayValue.values.some(s=>Nn(this.value.arrayValue,s))}}/**
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
 */class Ir{constructor(e,n="asc"){this.field=e,this.dir=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class we{constructor(e){this.timestamp=e}static fromTimestamp(e){return new we(e)}static min(){return new we(new Ce(0,0))}static max(){return new we(new Ce(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gs{constructor(e,n){this.comparator=e,this.root=n||Te.EMPTY}insert(e,n){return new gs(this.comparator,this.root.insert(e,n,this.comparator).copy(null,null,Te.BLACK,null,null))}remove(e){return new gs(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Te.BLACK,null,null))}get(e){let n=this.root;for(;!n.isEmpty();){const s=this.comparator(e,n.key);if(s===0)return n.value;s<0?n=n.left:s>0&&(n=n.right)}return null}indexOf(e){let n=0,s=this.root;for(;!s.isEmpty();){const r=this.comparator(e,s.key);if(r===0)return n+s.left.size;r<0?s=s.left:(n+=s.left.size+1,s=s.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((n,s)=>(e(n,s),!1))}toString(){const e=[];return this.inorderTraversal((n,s)=>(e.push(`${n}:${s}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new qn(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new qn(this.root,e,this.comparator,!1)}getReverseIterator(){return new qn(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new qn(this.root,e,this.comparator,!0)}}class qn{constructor(e,n,s,r){this.isReverse=r,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=n?s(e.key,n):1,n&&r&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const n={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return n}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class Te{constructor(e,n,s,r,i){this.key=e,this.value=n,this.color=s??Te.RED,this.left=r??Te.EMPTY,this.right=i??Te.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,n,s,r,i){return new Te(e??this.key,n??this.value,s??this.color,r??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,n,s){let r=this;const i=s(e,r.key);return r=i<0?r.copy(null,null,null,r.left.insert(e,n,s),null):i===0?r.copy(null,n,null,null,null):r.copy(null,null,null,null,r.right.insert(e,n,s)),r.fixUp()}removeMin(){if(this.left.isEmpty())return Te.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,n){let s,r=this;if(n(e,r.key)<0)r.left.isEmpty()||r.left.isRed()||r.left.left.isRed()||(r=r.moveRedLeft()),r=r.copy(null,null,null,r.left.remove(e,n),null);else{if(r.left.isRed()&&(r=r.rotateRight()),r.right.isEmpty()||r.right.isRed()||r.right.left.isRed()||(r=r.moveRedRight()),n(e,r.key)===0){if(r.right.isEmpty())return Te.EMPTY;s=r.right.min(),r=r.copy(s.key,s.value,null,null,r.right.removeMin())}r=r.copy(null,null,null,null,r.right.remove(e,n))}return r.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Te.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Te.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),n=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,n)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw ce();const e=this.left.check();if(e!==this.right.check())throw ce();return e+(this.isRed()?0:1)}}Te.EMPTY=null,Te.RED=!0,Te.BLACK=!1;Te.EMPTY=new class{constructor(){this.size=0}get key(){throw ce()}get value(){throw ce()}get color(){throw ce()}get left(){throw ce()}get right(){throw ce()}copy(e,n,s,r,i){return this}insert(e,n,s){return new Te(e,n)}remove(e,n){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xn{constructor(e){this.comparator=e,this.data=new gs(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((n,s)=>(e(n),!1))}forEachInRange(e,n){const s=this.data.getIteratorFrom(e[0]);for(;s.hasNext();){const r=s.getNext();if(this.comparator(r.key,e[1])>=0)return;n(r.key)}}forEachWhile(e,n){let s;for(s=n!==void 0?this.data.getIteratorFrom(n):this.data.getIterator();s.hasNext();)if(!e(s.getNext().key))return}firstAfterOrEqual(e){const n=this.data.getIteratorFrom(e);return n.hasNext()?n.getNext().key:null}getIterator(){return new mo(this.data.getIterator())}getIteratorFrom(e){return new mo(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let n=this;return n.size<e.size&&(n=e,e=this),e.forEach(s=>{n=n.add(s)}),n}isEqual(e){if(!(e instanceof xn)||this.size!==e.size)return!1;const n=this.data.getIterator(),s=e.data.getIterator();for(;n.hasNext();){const r=n.getNext().key,i=s.getNext().key;if(this.comparator(r,i)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(n=>{e.push(n)}),e}toString(){const e=[];return this.forEach(n=>e.push(n)),"SortedSet("+e.toString()+")"}copy(e){const n=new xn(this.comparator);return n.data=e,n}}class mo{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cn{constructor(e){this.fields=e,e.sort(De.comparator)}static empty(){return new Cn([])}unionWith(e){let n=new xn(De.comparator);for(const s of this.fields)n=n.add(s);for(const s of e)n=n.add(s);return new Cn(n.toArray())}covers(e){for(const n of this.fields)if(n.isPrefixOf(e))return!0;return!1}isEqual(e){return yl(this.fields,e.fields,(n,s)=>n.isEqual(s))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ye{constructor(e){this.value=e}static empty(){return new Ye({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let n=this.value;for(let s=0;s<e.length-1;++s)if(n=(n.mapValue.fields||{})[e.get(s)],!ir(n))return null;return n=(n.mapValue.fields||{})[e.lastSegment()],n||null}}set(e,n){this.getFieldsMap(e.popLast())[e.lastSegment()]=Tn(n)}setAll(e){let n=De.emptyPath(),s={},r=[];e.forEach((o,l)=>{if(!n.isImmediateParentOf(l)){const a=this.getFieldsMap(n);this.applyChanges(a,s,r),s={},r=[],n=l.popLast()}o?s[l.lastSegment()]=Tn(o):r.push(l.lastSegment())});const i=this.getFieldsMap(n);this.applyChanges(i,s,r)}delete(e){const n=this.field(e.popLast());ir(n)&&n.mapValue.fields&&delete n.mapValue.fields[e.lastSegment()]}isEqual(e){return ps(this.value,e.value)}getFieldsMap(e){let n=this.value;n.mapValue.fields||(n.mapValue={fields:{}});for(let s=0;s<e.length;++s){let r=n.mapValue.fields[e.get(s)];ir(r)&&r.mapValue.fields||(r={mapValue:{fields:{}}},n.mapValue.fields[e.get(s)]=r),n=r}return n.mapValue.fields}applyChanges(e,n,s){Gn(n,(r,i)=>e[r]=i);for(const r of s)delete e[r]}clone(){return new Ye(Tn(this.value))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lt{constructor(e,n,s,r,i,o,l){this.key=e,this.documentType=n,this.version=s,this.readTime=r,this.createTime=i,this.data=o,this.documentState=l}static newInvalidDocument(e){return new lt(e,0,we.min(),we.min(),we.min(),Ye.empty(),0)}static newFoundDocument(e,n,s,r){return new lt(e,1,n,we.min(),s,r,0)}static newNoDocument(e,n){return new lt(e,2,n,we.min(),we.min(),Ye.empty(),0)}static newUnknownDocument(e,n){return new lt(e,3,n,we.min(),we.min(),Ye.empty(),2)}convertToFoundDocument(e,n){return!this.createTime.isEqual(we.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=n,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Ye.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Ye.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=we.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof lt&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new lt(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class up{constructor(e,n=null,s=[],r=[],i=null,o=null,l=null){this.path=e,this.collectionGroup=n,this.orderBy=s,this.filters=r,this.limit=i,this.startAt=o,this.endAt=l,this.C=null}}function go(t,e=null,n=[],s=[],r=null,i=null,o=null){return new up(t,e,n,s,r,i,o)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dp{constructor(e,n=null,s=[],r=[],i=null,o="F",l=null,a=null){this.path=e,this.collectionGroup=n,this.explicitOrderBy=s,this.filters=r,this.limit=i,this.limitType=o,this.startAt=l,this.endAt=a,this.S=null,this.N=null,this.O=null,this.startAt,this.endAt}}function hp(t){const e=Ds(t);if(e.S===null){e.S=[];const n=new Set;for(const i of e.explicitOrderBy)e.S.push(i),n.add(i.field.canonicalString());const s=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let l=new xn(De.comparator);return o.filters.forEach(a=>{a.getFlattenedFilters().forEach(c=>{c.isInequality()&&(l=l.add(c.field))})}),l})(e).forEach(i=>{n.has(i.canonicalString())||i.isKeyField()||e.S.push(new Ir(i,s))}),n.has(De.keyField().canonicalString())||e.S.push(new Ir(De.keyField(),s))}return e.S}function fp(t){const e=Ds(t);return e.N||(e.N=pp(e,hp(t))),e.N}function pp(t,e){if(t.limitType==="F")return go(t.path,t.collectionGroup,e,t.filters,t.limit,t.startAt,t.endAt);{e=e.map(r=>{const i=r.dir==="desc"?"asc":"desc";return new Ir(r.field,i)});const n=t.endAt?new po(t.endAt.position,t.endAt.inclusive):null,s=t.startAt?new po(t.startAt.position,t.startAt.inclusive):null;return go(t.path,t.collectionGroup,e,t.filters,t.limit,n,s)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sl(t,e){if(t.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:fs(e)?"-0":e}}function mp(t,e){return function(s){return typeof s=="number"&&Number.isInteger(s)&&!fs(s)&&s<=Number.MAX_SAFE_INTEGER&&s>=Number.MIN_SAFE_INTEGER}(e)?function(s){return{integerValue:""+s}}(e):Sl(t,e)}/**
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
 */class xs{constructor(){this._=void 0}}class gp extends xs{}class yp extends xs{constructor(e){super(),this.elements=e}}class bp extends xs{constructor(e){super(),this.elements=e}}class Ap extends xs{constructor(e,n){super(),this.serializer=e,this.q=n}}class _n{constructor(e,n){this.updateTime=e,this.exists=n}static none(){return new _n}static exists(e){return new _n(void 0,e)}static updateTime(e){return new _n(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}class Cs{}class vp extends Cs{constructor(e,n,s,r=[]){super(),this.key=e,this.value=n,this.precondition=s,this.fieldTransforms=r,this.type=0}getFieldMask(){return null}}class wl extends Cs{constructor(e,n,s,r,i=[]){super(),this.key=e,this.data=n,this.fieldMask=s,this.precondition=r,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}class Tp extends Cs{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class _p extends Cs{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sp={asc:"ASCENDING",desc:"DESCENDING"},wp={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},Ip={and:"AND",or:"OR"};class kp{constructor(e,n){this.databaseId=e,this.useProto3Json=n}}function kr(t,e){return t.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Ep(t,e){return t.useProto3Json?e.toBase64():e.toUint8Array()}function Pp(t,e){return kr(t,e.toTimestamp())}function yo(t){return _t(!!t),we.fromTimestamp(function(n){const s=Lt(n);return new Ce(s.seconds,s.nanos)}(t))}function li(t,e){return Er(t,e).canonicalString()}function Er(t,e){const n=function(r){return new ve(["projects",r.projectId,"databases",r.database])}(t).child("documents");return e===void 0?n:n.child(e)}function Pr(t,e){return li(t.databaseId,e.path)}function Rp(t,e){const n=function(r){const i=ve.fromString(r);return _t(kl(i)),i}(e);if(n.get(1)!==t.databaseId.projectId)throw new U(K,"Tried to deserialize key from different project: "+n.get(1)+" vs "+t.databaseId.projectId);if(n.get(3)!==t.databaseId.database)throw new U(K,"Tried to deserialize key from different database: "+n.get(3)+" vs "+t.databaseId.database);return new ke(function(r){return _t(r.length>4&&r.get(4)==="documents"),r.popFirst(5)}(n))}function bo(t,e,n){return{name:Pr(t,e),fields:n.value.mapValue.fields}}function Mp(t,e){let n;if(e instanceof vp)n={update:bo(t,e.key,e.value)};else if(e instanceof Tp)n={delete:Pr(t,e.key)};else if(e instanceof wl)n={update:bo(t,e.key,e.data),updateMask:Cp(e.fieldMask)};else{if(!(e instanceof _p))return ce();n={verify:Pr(t,e.key)}}return e.fieldTransforms.length>0&&(n.updateTransforms=e.fieldTransforms.map(s=>function(i,o){const l=o.transform;if(l instanceof gp)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(l instanceof yp)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:l.elements}};if(l instanceof bp)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:l.elements}};if(l instanceof Ap)return{fieldPath:o.field.canonicalString(),increment:l.q};throw ce()}(0,s))),e.precondition.isNone||(n.currentDocument=function(r,i){return i.updateTime!==void 0?{updateTime:Pp(r,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:ce()}(t,e.precondition)),n}function Op(t,e){const n={structuredQuery:{}},s=e.path;let r;e.collectionGroup!==null?(r=s,n.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(r=s.popLast(),n.structuredQuery.from=[{collectionId:s.lastSegment()}]),n.parent=function(c,u){return li(c.databaseId,u)}(t,r);const i=function(c){if(c.length!==0)return Il(Ns.create(c,"and"))}(e.filters);i&&(n.structuredQuery.where=i);const o=function(c){if(c.length!==0)return c.map(u=>function(p){return{field:jt(p.field),direction:Dp(p.dir)}}(u))}(e.orderBy);o&&(n.structuredQuery.orderBy=o);const l=function(c,u){return c.useProto3Json||Jf(u)?u:{value:u}}(t,e.limit);return l!==null&&(n.structuredQuery.limit=l),e.startAt&&(n.structuredQuery.startAt=function(c){return{before:c.inclusive,values:c.position}}(e.startAt)),e.endAt&&(n.structuredQuery.endAt=function(c){return{before:!c.inclusive,values:c.position}}(e.endAt)),{B:n,parent:r}}function Dp(t){return Sp[t]}function Np(t){return wp[t]}function xp(t){return Ip[t]}function jt(t){return{fieldPath:t.canonicalString()}}function Il(t){return t instanceof qe?function(n){if(n.op==="=="){if(fo(n.value))return{unaryFilter:{field:jt(n.field),op:"IS_NAN"}};if(ho(n.value))return{unaryFilter:{field:jt(n.field),op:"IS_NULL"}}}else if(n.op==="!="){if(fo(n.value))return{unaryFilter:{field:jt(n.field),op:"IS_NOT_NAN"}};if(ho(n.value))return{unaryFilter:{field:jt(n.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:jt(n.field),op:Np(n.op),value:n.value}}}(t):t instanceof Ns?function(n){const s=n.getFilters().map(r=>Il(r));return s.length===1?s[0]:{compositeFilter:{op:xp(n.op),filters:s}}}(t):ce()}function Cp(t){const e=[];return t.fields.forEach(n=>e.push(n.canonicalString())),{fieldPaths:e}}function kl(t){return t.length>=4&&t.get(0)==="projects"&&t.get(2)==="databases"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ci(t){return new kp(t,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lp extends class{}{constructor(e,n,s,r){super(),this.authCredentials=e,this.appCheckCredentials=n,this.connection=s,this.serializer=r,this.Y=!1}Z(){if(this.Y)throw new U(tn,"The client has already been terminated.")}P(e,n,s,r){return this.Z(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([i,o])=>this.connection.P(e,Er(n,s),r,i,o)).catch(i=>{throw i.name==="FirebaseError"?(i.code===wr&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new U(vn,i.toString())})}g(e,n,s,r,i){return this.Z(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,l])=>this.connection.g(e,Er(n,s),r,o,l,i)).catch(o=>{throw o.name==="FirebaseError"?(o.code===wr&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new U(vn,o.toString())})}terminate(){this.Y=!0,this.connection.terminate()}}async function Vp(t,e){const n=Ds(t),s={writes:e.map(r=>Mp(n.serializer,r))};await n.P("Commit",n.serializer.databaseId,ve.emptyPath(),s)}async function Bp(t,e){const n=Ds(t),{B:s,parent:r}=Op(n.serializer,fp(e));return(await n.g("RunQuery",n.serializer.databaseId,r,{structuredQuery:s.structuredQuery})).filter(i=>!!i.document).map(i=>function(l,a,c){const u=Rp(l,a.name),d=yo(a.updateTime),p=a.createTime?yo(a.createTime):we.min(),m=new Ye({mapValue:{fields:a.fields}}),g=lt.newFoundDocument(u,d,p,m);return c?g.setHasCommittedMutations():g}(n.serializer,i.document,void 0))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sn=new Map;function El(t){if(t._terminated)throw new U(tn,"The client has already been terminated.");if(!Sn.has(t)){hs("ComponentProvider","Initializing Datastore");const e=function(i){return new Xf(i,fetch.bind(null))}(function(i,o,l,a){return new Hf(i,o,l,a.host,a.ssl,a.experimentalForceLongPolling,a.experimentalAutoDetectLongPolling,gl(a.experimentalLongPollingOptions),a.useFetchStreams)}(t._databaseId,t.app.options.appId||"",t._persistenceKey,t._freezeSettings())),n=ci(t._databaseId),s=function(i,o,l,a){return new Lp(i,o,l,a)}(t._authCredentials,t._appCheckCredentials,e,n);Sn.set(t,s)}return Sn.get(t)}class Ao{constructor(e){var n,s;if(e.host===void 0){if(e.ssl!==void 0)throw new U(K,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(n=e.ssl)===null||n===void 0||n;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new U(K,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}(function(i,o,l,a){if(o===!0&&a===!0)throw new U(K,`${i} and ${l} cannot be used together.`)})("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=gl((s=e.experimentalLongPollingOptions)!==null&&s!==void 0?s:{}),function(i){if(i.timeoutSeconds!==void 0){if(isNaN(i.timeoutSeconds))throw new U(K,`invalid long polling timeout: ${i.timeoutSeconds} (must not be NaN)`);if(i.timeoutSeconds<5)throw new U(K,`invalid long polling timeout: ${i.timeoutSeconds} (minimum allowed value is 5)`);if(i.timeoutSeconds>30)throw new U(K,`invalid long polling timeout: ${i.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(s,r){return s.timeoutSeconds===r.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Ls{constructor(e,n,s,r){this._authCredentials=e,this._appCheckCredentials=n,this._databaseId=s,this._app=r,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Ao({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new U(tn,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new U(tn,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Ao(e),e.credentials!==void 0&&(this._authCredentials=function(s){if(!s)return new Uf;switch(s.type){case"firstParty":return new jf(s.sessionIndex||"0",s.iamToken||null,s.authTokenFactory||null);case"provider":return s.client;default:throw new U(K,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(n){const s=Sn.get(n);s&&(hs("ComponentProvider","Removing Datastore"),Sn.delete(n),s.terminate())}(this),Promise.resolve()}}function Fp(t,e){const n=typeof t=="object"?t:Ma(),s=typeof t=="string"?t:e||"(default)",r=Hr(n,"firestore/lite").getImmediate({identifier:s});if(!r._initialized){const i=iu("firestore");i&&Up(r,...i)}return r}function Up(t,e,n,s={}){var r;const i=(t=ai(t,Ls))._getSettings(),o=`${e}:${n}`;if(i.host!=="firestore.googleapis.com"&&i.host!==o&&hl("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),t._setSettings(Object.assign(Object.assign({},i),{host:o,ssl:!1})),s.mockUserToken){let l,a;if(typeof s.mockUserToken=="string")l=s.mockUserToken,a=Me.MOCK_USER;else{l=au(s.mockUserToken,(r=t._app)===null||r===void 0?void 0:r.options.projectId);const c=s.mockUserToken.sub||s.mockUserToken.user_id;if(!c)throw new U(K,"mockUserToken must contain 'sub' or 'user_id' field!");a=new Me(c)}t._authCredentials=new Gf(new pl(l,a))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vs{constructor(e,n,s){this.converter=n,this._query=s,this.type="query",this.firestore=e}withConverter(e){return new Vs(this.firestore,e,this._query)}}class Be{constructor(e,n,s){this.converter=n,this._key=s,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new vt(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new Be(this.firestore,e,this._key)}}class vt extends Vs{constructor(e,n,s){super(e,n,function(i){return new dp(i)}(s)),this._path=s,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new Be(this.firestore,null,new ke(e))}withConverter(e){return new vt(this.firestore,e,this._path)}}function Gp(t,e,...n){if(t=_e(t),ml("collection","path",e),t instanceof Ls){const s=ve.fromString(e,...n);return io(s),new vt(t,null,s)}{if(!(t instanceof Be||t instanceof vt))throw new U(K,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=t._path.child(ve.fromString(e,...n));return io(s),new vt(t.firestore,null,s)}}function Yp(t,e,...n){if(t=_e(t),arguments.length===1&&(e=ep.newId()),ml("doc","path",e),t instanceof Ls){const s=ve.fromString(e,...n);return ro(s),new Be(t,null,new ke(s))}{if(!(t instanceof Be||t instanceof vt))throw new U(K,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=t._path.child(ve.fromString(e,...n));return ro(s),new Be(t.firestore,t instanceof vt?t.converter:null,new ke(s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nn{constructor(e){this._byteString=e}static fromBase64String(e){try{return new nn(st.fromBase64String(e))}catch(n){throw new U(K,"Failed to construct data from Base64 string: "+n)}}static fromUint8Array(e){return new nn(st.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bs{constructor(...e){for(let n=0;n<e.length;++n)if(e[n].length===0)throw new U(K,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new De(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ui{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class di{constructor(e,n){if(!isFinite(e)||e<-90||e>90)throw new U(K,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(n)||n<-180||n>180)throw new U(K,"Longitude must be a number between -180 and 180, but was: "+n);this._lat=e,this._long=n}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return ge(this._lat,e._lat)||ge(this._long,e._long)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class hi{constructor(e){this._values=(e||[]).map(n=>n)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(s,r){if(s.length!==r.length)return!1;for(let i=0;i<s.length;++i)if(s[i]!==r[i])return!1;return!0}(this._values,e._values)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $p=/^__.*__$/;class Pl{constructor(e,n,s){this.data=e,this.fieldMask=n,this.fieldTransforms=s}toMutation(e,n){return new wl(e,this.data,this.fieldMask,n,this.fieldTransforms)}}function Rl(t){switch(t){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw ce()}}class fi{constructor(e,n,s,r,i,o){this.settings=e,this.databaseId=n,this.serializer=s,this.ignoreUndefinedProperties=r,i===void 0&&this.tt(),this.fieldTransforms=i||[],this.fieldMask=o||[]}get path(){return this.settings.path}get et(){return this.settings.et}rt(e){return new fi(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}nt(e){var n;const s=(n=this.path)===null||n===void 0?void 0:n.child(e),r=this.rt({path:s,it:!1});return r.st(e),r}ot(e){var n;const s=(n=this.path)===null||n===void 0?void 0:n.child(e),r=this.rt({path:s,it:!1});return r.tt(),r}ut(e){return this.rt({path:void 0,it:!0})}_t(e){return ys(e,this.settings.methodName,this.settings.ct||!1,this.path,this.settings.lt)}contains(e){return this.fieldMask.find(n=>e.isPrefixOf(n))!==void 0||this.fieldTransforms.find(n=>e.isPrefixOf(n.field))!==void 0}tt(){if(this.path)for(let e=0;e<this.path.length;e++)this.st(this.path.get(e))}st(e){if(e.length===0)throw this._t("Document fields must not be empty");if(Rl(this.et)&&$p.test(e))throw this._t('Document fields cannot begin and end with "__"')}}class jp{constructor(e,n,s){this.databaseId=e,this.ignoreUndefinedProperties=n,this.serializer=s||ci(e)}ht(e,n,s,r=!1){return new fi({et:e,methodName:n,lt:s,path:De.emptyPath(),it:!1,ct:r},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Kp(t){const e=t._freezeSettings(),n=ci(t._databaseId);return new jp(t._databaseId,!!e.ignoreUndefinedProperties,n)}class Fs extends ui{_toFieldTransform(e){if(e.et!==2)throw e.et===1?e._t(`${this._methodName}() can only appear at the top level of your update data`):e._t(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof Fs}}function Wp(t,e,n,s){const r=t.ht(1,e,n);Ol("Data must be an object, but it was:",r,s);const i=[],o=Ye.empty();Gn(s,(a,c)=>{const u=pi(e,a,n);c=_e(c);const d=r.ot(u);if(c instanceof Fs)i.push(u);else{const p=Us(c,d);p!=null&&(i.push(u),o.set(u,p))}});const l=new Cn(i);return new Pl(o,l,r.fieldTransforms)}function Hp(t,e,n,s,r,i){const o=t.ht(1,e,n),l=[vo(e,s,n)],a=[r];if(i.length%2!=0)throw new U(K,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let p=0;p<i.length;p+=2)l.push(vo(e,i[p])),a.push(i[p+1]);const c=[],u=Ye.empty();for(let p=l.length-1;p>=0;--p)if(!Jp(c,l[p])){const m=l[p];let g=a[p];g=_e(g);const f=o.ot(m);if(g instanceof Fs)c.push(m);else{const v=Us(g,f);v!=null&&(c.push(m),u.set(m,v))}}const d=new Cn(c);return new Pl(u,d,o.fieldTransforms)}function Us(t,e){if(Ml(t=_e(t)))return Ol("Unsupported field value:",e,t),qp(t,e);if(t instanceof ui)return function(s,r){if(!Rl(r.et))throw r._t(`${s._methodName}() can only be used with update() and set()`);if(!r.path)throw r._t(`${s._methodName}() is not currently supported inside arrays`);const i=s._toFieldTransform(r);i&&r.fieldTransforms.push(i)}(t,e),null;if(t===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),t instanceof Array){if(e.settings.it&&e.et!==4)throw e._t("Nested arrays are not supported");return function(s,r){const i=[];let o=0;for(const l of s){let a=Us(l,r.ut(o));a==null&&(a={nullValue:"NULL_VALUE"}),i.push(a),o++}return{arrayValue:{values:i}}}(t,e)}return function(s,r){if((s=_e(s))===null)return{nullValue:"NULL_VALUE"};if(typeof s=="number")return mp(r.serializer,s);if(typeof s=="boolean")return{booleanValue:s};if(typeof s=="string")return{stringValue:s};if(s instanceof Date){const i=Ce.fromDate(s);return{timestampValue:kr(r.serializer,i)}}if(s instanceof Ce){const i=new Ce(s.seconds,1e3*Math.floor(s.nanoseconds/1e3));return{timestampValue:kr(r.serializer,i)}}if(s instanceof di)return{geoPointValue:{latitude:s.latitude,longitude:s.longitude}};if(s instanceof nn)return{bytesValue:Ep(r.serializer,s._byteString)};if(s instanceof Be){const i=r.databaseId,o=s.firestore._databaseId;if(!o.isEqual(i))throw r._t(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${i.projectId}/${i.database}`);return{referenceValue:li(s.firestore._databaseId||r.databaseId,s._key.path)}}if(s instanceof hi)return function(o,l){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:o.toArray().map(a=>{if(typeof a!="number")throw l._t("VectorValues must only contain numeric values.");return Sl(l.serializer,a)})}}}}}}(s,r);throw r._t(`Unsupported field value: ${oi(s)}`)}(t,e)}function qp(t,e){const n={};return function(r){for(const i in r)if(Object.prototype.hasOwnProperty.call(r,i))return!1;return!0}(t)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Gn(t,(s,r)=>{const i=Us(r,e.nt(s));i!=null&&(n[s]=i)}),{mapValue:{fields:n}}}function Ml(t){return!(typeof t!="object"||t===null||t instanceof Array||t instanceof Date||t instanceof Ce||t instanceof di||t instanceof nn||t instanceof Be||t instanceof ui||t instanceof hi)}function Ol(t,e,n){if(!Ml(n)||!function(r){return typeof r=="object"&&r!==null&&(Object.getPrototypeOf(r)===Object.prototype||Object.getPrototypeOf(r)===null)}(n)){const s=oi(n);throw s==="an object"?e._t(t+" a custom object"):e._t(t+" "+s)}}function vo(t,e,n){if((e=_e(e))instanceof Bs)return e._internalPath;if(typeof e=="string")return pi(t,e);throw ys("Field path arguments must be of type string or ",t,!1,void 0,n)}const zp=new RegExp("[~\\*/\\[\\]]");function pi(t,e,n){if(e.search(zp)>=0)throw ys(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,t,!1,void 0,n);try{return new Bs(...e.split("."))._internalPath}catch{throw ys(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,t,!1,void 0,n)}}function ys(t,e,n,s,r){const i=s&&!s.isEmpty(),o=r!==void 0;let l=`Function ${e}() called with invalid data`;n&&(l+=" (via `toFirestore()`)"),l+=". ";let a="";return(i||o)&&(a+=" (found",i&&(a+=` in field ${s}`),o&&(a+=` in document ${r}`),a+=")"),new U(K,l+t+a)}function Jp(t,e){return t.some(n=>n.isEqual(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qp{constructor(e,n,s,r,i){this._firestore=e,this._userDataWriter=n,this._key=s,this._document=r,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new Be(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new Dl(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const n=this._document.data.field(Zp("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n)}}}class Dl extends Qp{data(){return super.data()}}class Xp{constructor(e,n){this._docs=n,this.query=e}get docs(){return[...this._docs]}get size(){return this.docs.length}get empty(){return this.docs.length===0}forEach(e,n){this._docs.forEach(e,n)}}function Zp(t,e){return typeof e=="string"?pi(t,e):e instanceof Bs?e._internalPath:e._delegate._internalPath}class em extends class{convertValue(n,s="none"){switch(Vt(n)){case 0:return null;case 1:return n.booleanValue;case 2:return fe(n.integerValue||n.doubleValue);case 3:return this.convertTimestamp(n.timestampValue);case 4:return this.convertServerTimestamp(n,s);case 5:return n.stringValue;case 6:return this.convertBytes(On(n.bytesValue));case 7:return this.convertReference(n.referenceValue);case 8:return this.convertGeoPoint(n.geoPointValue);case 9:return this.convertArray(n.arrayValue,s);case 11:return this.convertObject(n.mapValue,s);case 10:return this.convertVectorValue(n.mapValue);default:throw ce()}}convertObject(n,s){return this.convertObjectMap(n.fields,s)}convertObjectMap(n,s="none"){const r={};return Gn(n,(i,o)=>{r[i]=this.convertValue(o,s)}),r}convertVectorValue(n){var s,r,i;const o=(i=(r=(s=n.fields)===null||s===void 0?void 0:s.value.arrayValue)===null||r===void 0?void 0:r.values)===null||i===void 0?void 0:i.map(l=>fe(l.doubleValue));return new hi(o)}convertGeoPoint(n){return new di(fe(n.latitude),fe(n.longitude))}convertArray(n,s){return(n.values||[]).map(r=>this.convertValue(r,s))}convertServerTimestamp(n,s){switch(s){case"previous":const r=Al(n);return r==null?null:this.convertValue(r,s);case"estimate":return this.convertTimestamp(Dn(n));default:return null}}convertTimestamp(n){const s=Lt(n);return new Ce(s.seconds,s.nanos)}convertDocumentKey(n,s){const r=ve.fromString(n);_t(kl(r));const i=new Rn(r.get(1),r.get(3)),o=new ke(r.popFirst(5));return i.isEqual(s)||ri(`Document ${o} contains a document reference within a different database (${i.projectId}/${i.database}) which is not supported. It will be treated as a reference in the current database (${s.projectId}/${s.database}) instead.`),o}}{constructor(e){super(),this.firestore=e}convertBytes(e){return new nn(e)}convertReference(e){const n=this.convertDocumentKey(e,this.firestore._databaseId);return new Be(this.firestore,null,n)}}function tm(t){(function(r){if(r.limitType==="L"&&r.explicitOrderBy.length===0)throw new U(fl,"limitToLast() queries require specifying at least one orderBy() clause")})((t=ai(t,Vs))._query);const e=El(t.firestore),n=new em(t.firestore);return Bp(e,t._query).then(s=>{const r=s.map(i=>new Dl(t.firestore,n,i.key,i,t.converter));return t._query.limitType==="L"&&r.reverse(),new Xp(t,r)})}function nm(t,e,n,...s){const r=Kp((t=ai(t,Be)).firestore);let i;return i=typeof(e=_e(e))=="string"||e instanceof Bs?Hp(r,"updateDoc",t._key,e,n,s):Wp(r,"updateDoc",t._key,e),Vp(El(t.firestore),[i.toMutation(t._key,_n.exists(!0))])}(function(){(function(n){cn=n})(`${an}_lite`),Xt(new xt("firestore/lite",(e,{instanceIdentifier:n,options:s})=>{const r=e.getProvider("app").getImmediate(),i=new Ls(new Yf(e.getProvider("auth-internal")),new Wf(e.getProvider("app-check-internal")),function(l,a){if(!Object.prototype.hasOwnProperty.apply(l.options,["projectId"]))throw new U(K,'"projectId" not provided in firebase.initializeApp.');return new Rn(l.options.projectId,a)}(r,n),r);return s&&i._setSettings(s),i},"PUBLIC").setMultipleInstances(!0)),At("firestore-lite","4.7.3",""),At("firestore-lite","4.7.3","esm2017")})();const Nl=Object.freeze({apiKey:"AIzaSyBdbve0H70D-Ch69WlaxEly7PVBFVRB5p0",authDomain:"pensiontools-4b237.firebaseapp.com",projectId:"pensiontools-4b237",storageBucket:"pensiontools-4b237.firebasestorage.app",messagingSenderId:"760877353696",appId:"1:760877353696:web:2d6f7173c8d7fab6fd9e85"});function sm(){return Nl.apiKey!=="YOUR_API_KEY"}const rm=3;function im(t){const e=t&&typeof t=="object"?t.schemaVersion:void 0;return Number.isInteger(e)&&e>=0?e:0}const om="6.22.0",xl="pots-and-valves",bs={"pots-and-valves":[],"buckets-in-order":["bucketBand"],"bridge-and-engine":["bridgeAge","cashYears"],"ladder-and-ratchet":["ladderYears","drawAnnual","triggerMode","bandThreshold"],"floor-and-flex":["essentialsAnnual","horizonAge","sleeveRate","treatsRule","ratchet"],"floor-the-schedule":[],"floor-to-age":["floorToAge","borrowedFloor"],"full-il-gilt":["cashYears","bridgeCash"],"gilt-rotation":["cashYears","bridgeCash","rotateCutAge","rotateTrigger","rotateDisarmYears"]},am=["sippTotal","isaTotal"],mi=t=>Object.prototype.hasOwnProperty.call(bs,t),To=t=>!!t&&typeof t=="object"&&!Array.isArray(t),Cl=t=>{const e={};for(const[n,s]of Object.entries(t||{}))s!==void 0&&(e[n]=s);return e},lm=t=>Array.isArray(t)?t.filter(Boolean).map(e=>Cl(e)):[];function _o(t){return mi(t)?bs[t].slice():[]}function Ll(t){return t===xl?_o(t):[..._o(t),...am]}function cm(t,e){const n=e&&typeof e=="object"?e:{};if(!mi(t))return Cl(n);const s={};for(const r of Ll(t))n[r]!==void 0&&(s[r]=n[r]);return s}function um(t){return t.allocMode||(Array.isArray(t.taggedFunds)&&t.taggedFunds.length?"funds":"risk")}function dm(t){const e=t||{},n=e.strategyId||xl;if(!mi(n)||To(e.strategyState)&&Object.keys(e.strategyState).length)return e;const s=To(e.strategyParams)?e.strategyParams:{},r=new Set(Ll(n));if(!Object.keys(s).some(o=>s[o]!==void 0&&!r.has(o)))return e;const i={};for(const o of Object.keys(bs))o===n||!bs[o].some(l=>s[l]!==void 0)||(i[o]={strategyParams:cm(o,s),allocMode:um(e),taggedFunds:lm(e.taggedFunds),savedAt:null});return Object.keys(i).length?{...e,strategyState:i}:e}const gi=1,hm=["typed","paste","imported","none"],fm=["fund","gilt","cash"];function Ve(t){if(t===""||t==null)return null;const e=typeof t=="number"?t:+String(t).replace(/[£$€,\s]/g,"");return Number.isFinite(e)?e:null}const zn=(t,{upper:e=!1}={})=>{const n=String(t??"").trim();return n?e?n.toUpperCase():n:null};function Vl(t){const e=String(t??"").trim().slice(0,10);return/^\d{4}-\d{2}-\d{2}$/.test(e)?e:null}function Gs(t){const e=String(t??"").trim().toUpperCase();return e==="ISA"||e==="LISA"||e==="S&S ISA"||e==="STOCKS AND SHARES ISA"?"ISA":e==="GIA"||e==="TAXABLE"||e==="DEALING"||e==="GENERAL"||e==="TRADING"?"GIA":e==="CASH"||e==="BANK"||e==="SAVINGS"?"CASH":"SIPP"}function pm(){return{version:gi,updatedAt:null,source:"none",offerDismissed:!1,lines:[]}}function mm(t){const e=t&&typeof t=="object"?t:{},n=zn(e.ticker,{upper:!0}),s=zn(e.name),r=zn(e.sedol,{upper:!0});if(!n&&!s&&!r)return null;const i=fm.includes(e.kind)?e.kind:null;return{wrapper:Gs(e.wrapper),ticker:n,name:s,sedol:r,units:Ve(e.units),value:Ve(e.value),ocf:Ve(e.ocf),contribution:Ve(e.contribution),subClass:zn(e.subClass),kind:i,asOf:Vl(e.asOf)}}function un(t){if(Array.isArray(t))return un({lines:t});if(!t||typeof t!="object")return pm();const e=(Array.isArray(t.lines)?t.lines:[]).map(mm).filter(Boolean),n=hm.includes(t.source)?t.source:e.length?"typed":"none";return{version:gi,updatedAt:Vl(t.updatedAt),source:n,offerDismissed:t.offerDismissed===!0,lines:e}}function dn(t){return Array.isArray(t)?t:t&&typeof t=="object"&&Array.isArray(t.lines)?t.lines:[]}function gm(t){const e=dn(t),n={SIPP:0,ISA:0,GIA:0,CASH:0};let s=0;for(const r of e){const i=Ve(r&&r.value);i!=null&&(s+=i,n[Gs(r.wrapper)]+=i)}return{count:e.length,total:s,byWrapper:n}}const te=t=>!!t&&typeof t=="object"&&!Array.isArray(t),ym=t=>{if(!te(t))return!1;const e=Object.getPrototypeOf(t);return e===Object.prototype||e===null};function As(t){if(Array.isArray(t))return t.map(As);if(ym(t)){const e={};for(const n of Object.keys(t))e[n]=As(t[n]);return e}return t}const bm=t=>{const e=t instanceof Date?t:new Date(t??Date.now());return Number.isFinite(e.getTime())?e.toISOString():new Date().toISOString()},Rt=t=>{const e=JSON.stringify(t);return e===void 0?"undefined":e};function Am(t){const e=t&&te(t.decisionTool)?t.decisionTool:null;return e?te(e.settings)&&e.settings.locked||Array.isArray(e.history)&&e.history.length?!0:te(e.taxYears)&&Object.values(e.taxYears).some(n=>n&&n.yearSetupComplete):!1}function yi(t){const e=t&&te(t.decisionTool)?t.decisionTool:null;return!!(e&&te(e.settings)&&e.settings.locked)}const vm=2,So=t=>Rt(t&&te(t.stressTool)?t.stressTool.settings:void 0);function wo(t){const e=t||{},n=te(e.decisionTool)?e.decisionTool:{},s={planDocument:Rt(e.planDocument),planDocumentArchive:Rt(e.planDocumentArchive),"decisionTool.planOfRecord":Rt(n.planOfRecord),"decisionTool.planOfRecordArchive":Rt(n.planOfRecordArchive),"decisionTool.history":Rt(n.history)};return Am(e)&&(s["decisionTool.settings"]=Rt(n.settings)),s}function Tm(t,{now:e}){if(!te(t.strategy)){const r=typeof t.createdAt=="string"&&t.createdAt?t.createdAt:typeof t.lastModified=="string"&&t.lastModified?t.lastModified:bm(e);t.strategy={id:"pots-and-valves",params:{},lockedAt:r,engineVersion:om}}const n=te(t.stressTool)&&te(t.stressTool.settings)?t.stressTool.settings:null;if(n){for(const[i,o]of[["pacwMin","equityMin"],["cgtMin","bondMin"],["csh2Target","cashTarget"]])n[i]!==void 0&&n[o]===void 0&&(n[o]=n[i]);const r=dm(n);r!==n&&te(r.strategyState)&&(n.strategyState=As(r.strategyState))}const s=t.holdings;return(Array.isArray(s)||te(s)&&s.version!==gi)&&(t.holdings={...te(s)?s:{},...un(s)}),t}function _m(t){if(yi(t))return t;const e=te(t.stressTool)&&te(t.stressTool.settings)?t.stressTool.settings:null;return e&&(fr(e.chargesPct)||(e.chargesPct=pa)),t}function Sm(t){if(yi(t))return t;const e=te(t.stressTool)&&te(t.stressTool.settings)?t.stressTool.settings:null;return e&&(Ic(e.isaGrowth)||(e.isaGrowth=ma),wm(t,e)&&(e.isaBalance=0)),t}function wm(t,e){const n=te(t.fromAnswer)&&Array.isArray(t.fromAnswer.people)&&te(t.fromAnswer.people[0])?t.fromAnswer.people[0]:null,s=n&&te(n.savings)?n.savings:null,r=s&&te(s.atStop)&&typeof s.atStop.middling=="number"?s.atStop.middling:NaN,i=te(e.potAtRetirement)?e.potAtRetirement:null;return!!s&&s.today===0&&r>0&&e.retired===!1&&!!i&&i.source==="override"&&i.isa===r&&e.isaBalance===r}const Im=[{to:1,name:"Version stamp; strategy block, renamed Stress keys, per-strategy settings and holdings shape written once",up:Tm},{to:2,name:"Fund and platform charges: 0.5% a year written into every unlocked plan; locked plans untouched",up:_m},{to:3,name:'How ISAs and savings grow: "Mostly cash" written into every unlocked plan; locked plans untouched',up:Sm}];function km(t,{now:e=new Date,migrations:n=Im,target:s=rm}={}){const r=im(t),i={scenario:t,from:r,to:r,changed:!1,error:null,newer:!1};if(!te(t))return i;if(r>s)return{...i,newer:!0};if(r===s)return i;try{const o=wo(t);let l=As(t),a=r;for(const d of n){if(!(d.to>a))continue;if(d.to!==a+1)throw new Error("Migration chain has a gap: no step from version "+a+" to "+(a+1));const p=d.to>=vm&&yi(l)?So(l):null,m=d.up(l,{now:e});if(m!==void 0&&(l=m),!te(l))throw new Error("Migration to version "+d.to+" did not return a plan");if(p!==null&&So(l)!==p)throw new Error("Migration to version "+d.to+" changed the Stress settings of a locked plan, which no migration may touch");if(l.schemaVersion=d.to,a=d.to,a===s)break}if(a!==s)throw new Error("Migration chain stops at version "+a+", short of "+s);const c=Object.keys(t).filter(d=>!(d in l));if(c.length)throw new Error("Migration dropped root key(s): "+c.join(", "));const u=wo(l);for(const d of Object.keys(o))if(u[d]!==o[d])throw new Error("Migration changed "+d+", which no migration may touch");return{scenario:l,from:r,to:a,changed:!0,error:null,newer:!1}}catch(o){return{...i,error:o instanceof Error?o:new Error(String(o))}}}const Io=["decisionSettings","stressSettings","name","description","taxYears"],ss=t=>t&&typeof t=="object"&&!Array.isArray(t);function Em(t,e,n){const s=e.split(".");let r=t;for(let i=0;i<s.length-1;i++){const o=s[i];r[o]=ss(r[o])?{...r[o]}:{},r=r[o]}r[s[s.length-1]]=n}function Pm(t){if(!t||typeof t!="object")return{scenario:t,migrated:!1};const e=Object.keys(t).filter(a=>a.includes(".")),n=Io.some(a=>a in t);if(!(e.length>0||n))return{scenario:t,migrated:!1};const r={};for(const[a,c]of Object.entries(t))!a.includes(".")&&!Io.includes(a)&&(r[a]=c);for(const a of e)Em(r,a,t[a]);r.isActive=r.isActive??!1,r.enabledTools=r.enabledTools||["stress","decision"];const i=ss(r.planDetails)?r.planDetails:{};r.planDetails={...i,name:i.name??t.name??"My Plan",description:i.description??t.description??""};const o=ss(r.decisionTool)?r.decisionTool:{};r.decisionTool={...o,settings:o.settings??t.decisionSettings??{},history:o.history??[],taxYears:o.taxYears??t.taxYears??{}};const l=ss(r.stressTool)?r.stressTool:{};return r.stressTool={...l,settings:l.settings??t.stressSettings??{}},{scenario:r,migrated:!0}}function Rm(t,{now:e}={}){const n=Pm(t),s=km(n.scenario,e===void 0?{}:{now:e});return{scenario:s.scenario,write:!s.error&&!s.newer&&(n.migrated||s.changed),from:s.from,to:s.to,newer:s.newer,error:s.error}}const Mm=180,Om="pt_guest_minutes",Dm=t=>{const e=parseFloat(t);return Number.isFinite(e)&&e>0?e:0},Nm=(t,e)=>{try{return t.getItem(e)}catch{return null}};function Bl(t){return Dm(Nm(t,Om))}function Fl(t){return t>=Mm}function Rr(){return{equityMin:ye.EQUITY_MIN,bondMin:ye.BOND_MIN,cashTarget:ye.CASH_TARGET,duration:ye.DURATION_YEARS,baseSalary:ye.BASE_SALARY,other:0,statePension:12e3,statePensionYear:12,currentAge:null,currentAgeAsOf:null,retired:null,retireAge:null,firstTaxYear:null,potAtRetirement:null,pa:ue.PERSONAL_ALLOWANCE,brl:ue.BASIC_RATE_LIMIT,hrl:ue.HIGHER_RATE_LIMIT,taxMode:"inflates",protectionMult:je.PROTECTION_MULTIPLIER,consecutiveLimit:ye.CONSECUTIVE_LIMIT,disableProtection:!1,recoveryBuffer:ye.RECOVERY_BUFFER,hodlEnabled:je.HODL_ENABLED,hodlValue:je.HODL_VALUE,isaBalance:0,isaReturn:mt.RETURN,isaMin:mt.MIN,isaDrawdownStrategy:mt.DRAWDOWN_STRATEGY}}function Ys(t){if(!t)return null;const e={january:0,jan:0,february:1,feb:1,march:2,mar:2,april:3,apr:3,may:4,june:5,jun:5,july:6,jul:6,august:7,aug:7,september:8,sep:8,sept:8,october:9,oct:9,november:10,nov:10,december:11,dec:11},n=t.trim().replace(/\s+/g," ");if(/^\d{4}-\d{2}-\d{2}$/.test(n)){const[r,i,o]=n.split("-").map(Number),l=new Date(r,i-1,o);if(!isNaN(l.getTime()))return l}if(/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(n)){const[r,i,o]=n.split("/").map(Number);return new Date(o,i-1,r)}if(/^\d{1,2}-\d{1,2}-\d{4}$/.test(n)){const[r,i,o]=n.split("-").map(Number);return new Date(o,i-1,r)}let s=n.match(/^(\d{1,2})\s+(\w+)\s+(\d{4})$/i);if(s){const r=parseInt(s[1]),i=e[s[2].toLowerCase()],o=parseInt(s[3]);if(i!==void 0)return new Date(o,i,r)}if(s=n.match(/^(\w+)\s+(\d{1,2})\s+(\d{4})$/i),s){const r=e[s[1].toLowerCase()],i=parseInt(s[2]),o=parseInt(s[3]);if(r!==void 0)return new Date(o,r,i)}if(s=n.match(/^(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})$/i),s){const r=e[s[1].toLowerCase()],i=parseInt(s[2]),o=parseInt(s[3]);if(r!==void 0)return new Date(o,r,i)}if(s=n.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+(\w+),?\s+(\d{4})$/i),s){const r=parseInt(s[1]),i=e[s[2].toLowerCase()],o=parseInt(s[3]);if(i!==void 0)return new Date(o,i,r)}return null}function Wt(t){return Date.UTC(t.getFullYear(),t.getMonth(),t.getDate())/864e5}function or(t,e=new Date){const n=+t.currentAge||0;if(!n)return 0;if(t.currentAgeAsOf){const s=Date.parse(t.currentAgeAsOf);if(Number.isFinite(s))return n+Math.max(0,(e.getTime()-s)/(365.25*24*3600*1e3))}return n}function Ul(t,e=new Date){if(!t.spStartDate||!t.spWeeklyAmount)return null;const n=Ys(t.spStartDate);if(!n)return null;const s=365.25*24*60*60*1e3;let r;if(+t.firstTaxYear>0)return r=Math.max(0,(c=>c.getMonth()>3||c.getMonth()===3&&c.getDate()>=6?c.getFullYear():c.getFullYear()-1)(n)-+t.firstTaxYear),{spStartYear:r,spWeeklyAmount:t.spWeeklyAmount,spFirstYearRatio:xm(t)??1};if(t.shapeAgeNow>0&&t.currentAge>0&&t.shapeAgeNow>Math.floor(or(t,e))&&n.getTime()>e.getTime()){let a=0;for(let u=e.getFullYear();u<=n.getFullYear();u++){const d=new Date(u,n.getMonth(),n.getDate());d.getTime()>e.getTime()&&d.getTime()<=n.getTime()&&a++}const c=Math.floor(or(t,e))+a;r=Math.max(0,c-t.shapeAgeNow)}else{const a=t.shapeAgeNow>0&&t.currentAge>0?Math.max(0,t.shapeAgeNow-or(t,e)):0,c=Math.max(0,(n.getTime()-e.getTime())/s-a);r=Math.floor((Math.round(c*12)+1)/12)}const i=365,o=Wt(n)-Wt(new Date(n.getFullYear(),0,0)),l=(i-o)/i;return{spStartYear:r,spWeeklyAmount:t.spWeeklyAmount,spFirstYearRatio:l}}function xm(t){if(!t||!t.spStartDate)return null;const e=Ys(t.spStartDate);if(!e)return null;const n=e.getMonth()>3||e.getMonth()===3&&e.getDate()>=6?e.getFullYear():e.getFullYear()-1,s=new Date(n,3,6),r=new Date(n+1,3,6);return Math.max(0,Math.min(1,(Wt(r)-Wt(e))/(Wt(r)-Wt(s))))}function ar(t,e,n="potMid"){if(!Array.isArray(t)||!t.length)return null;const s=Math.max(0,Math.min(t.length-1,e)),r=Math.floor(s),i=s-r,o=t[r],l=t[Math.min(t.length-1,r+1)];if(!o)return null;const a=o[n]??o.potMid,c=(l&&(l[n]??l.potMid))??a;return a+(c-a)*i}function vs(t){const e={[Ut.SHARES]:0,[Ut.BONDS]:0,[Ut.DIVERSIFIERS]:0,[Ut.CASH]:0},n={},s=[],r=[];let i=0,o=0;const l=[];for(const a of t){const c=a.mix?{mix:a.mix}:a.ticker&&!a.subClass?qc.find(u=>u.ticker===String(a.ticker).toUpperCase().trim()):null;if(c&&c.mix&&typeof c.mix=="object"){const u=Object.values(c.mix).reduce((d,p)=>d+(+p||0),0)||1;for(const[d,p]of Object.entries(c.mix))+p>0&&l.push({...a,subClass:d,value:(+a.value||0)*(+p/u),mixOf:a.ticker||null})}else l.push(a)}for(const a of l){const c=+a.value||0,u=a.subClass||(a.ticker?zc[a.ticker]:void 0),d=u?bn[u]:null;if(!d){r.push({...a});continue}if(i+=c,s.push({...a,subClass:u,bucket:d.bucket,label:d.label}),(a.wrapper||"").toUpperCase()==="ISA"){o+=c;continue}e[d.bucket]+=c,n[u]=(n[u]||0)+c}return{buckets:e,subClassTotals:n,bondWeights:ko(n,Ut.BONDS),diversifierWeights:ko(n,Ut.DIVERSIFIERS),total:i,isaTotal:o,tagged:s,untagged:r}}function ko(t,e){const n=Object.entries(t).filter(([i])=>bn[i].bucket===e),s=n.reduce((i,[,o])=>i+o,0);if(s<=0)return{};const r={};for(const[i,o]of n)r[i]=o/s;return r}function Cm(t){const e=(t||[]).filter(r=>r&&(r.wrapper||"").toUpperCase()==="ISA"&&+r.value>0);if(!e.length)return null;const n=vs(e.map(r=>({...r,wrapper:"SIPP"})));if(!(n.total>0))return null;const s={shares:n.buckets.shares/n.total,bonds:n.buckets.bonds/n.total,diversifiers:n.buckets.diversifiers/n.total,cash:n.buckets.cash/n.total};return Object.keys(n.bondWeights).length&&(s.bondWeights=n.bondWeights),Object.keys(n.diversifierWeights).length&&(s.diversifierWeights=n.diversifierWeights),s}function Lm(t){try{return Cm(t&&t.taggedFunds)!=null}catch{return!1}}function Gl(t){const e=t||{};return(+e.equityMin||0)+(+e.bondMin||0)+(+e.cashTarget||0)+(+e.diversifierStart||0)}function Vm(t){const e=t||{},n=e.potAtRetirement,s={sipp:1,isa:1};if(!n||e.retired!==!1)return s;const r=Gl(e),i=+e.isaBalance||0;return+n.sipp>0&&r>0&&(s.sipp=+n.sipp/r),+n.isa>0&&i>0&&(s.isa=+n.isa/i),s}const Bm=24*3600*1e3;function Ee(t){const e=t instanceof Date?t:new Date(t);return e.getMonth()>3||e.getMonth()===3&&e.getDate()>=6?e.getFullYear():e.getFullYear()-1}function H(t){return t+"/"+String(t+1).slice(2)}function bi(t){return String(t%100).padStart(2,"0")+"/"+String((t+1)%100).padStart(2,"0")}function Fm(t){const e=parseInt(String(t).split("/")[0],10);return Number.isFinite(e)?e<100?2e3+e:e:NaN}function Um(t,e){let n;if(typeof t=="number")n=t;else if(t instanceof Date)n=Ee(t);else if(typeof t=="string"&&t.includes("/"))n=Fm(t);else if(typeof t=="string"){const[s,r]=t.split("-").map(Number);n=r>=4?s:s-1}else return NaN;return n-+e}function Yl(t){const e=/^(\d{4})-(\d{2})-(\d{2})$/.exec(typeof t=="string"?t.trim():"");return e?new Date(+e[1],+e[2]-1,+e[3]):new Date(t)}function $l(t,e=new Date){const n=t||{},s=n.spStartDate?Ys(n.spStartDate):null;if(s)return{month:s.getMonth(),day:s.getDate(),source:"sp"};if(n.currentAgeAsOf){const r=Yl(n.currentAgeAsOf);if(Number.isFinite(r.getTime()))return{month:r.getMonth(),day:r.getDate(),source:"asOf"}}return{month:e.getMonth(),day:e.getDate(),source:"today"}}function Eo(t,e,n){let s=0;for(let r=t.getFullYear();r<=e.getFullYear();r++){const i=new Date(r,n.month,n.day);i.getTime()>t.getTime()&&i.getTime()<=e.getTime()&&s++}return s}function Yn(t,e,n=new Date){const s=t||{},r=Math.floor(+s.currentAge||0);if(!(r>0))return null;let i=s.currentAgeAsOf?Yl(s.currentAgeAsOf):n;Number.isFinite(i.getTime())||(i=n);const o=$l(s,n),l=e instanceof Date?e:new Date(e);return l.getTime()>=i.getTime()?r+Eo(i,l,o):r-Eo(l,i,o)}function Mr(t,e,n=new Date){return Yn(t,new Date(e+1,3,5),n)}function Ts(t,e,n=new Date){const s=Ee(n),r=Mr(t,s,n);return r==null?null:s+(Math.round(+e)-r)}function Or(t,e=new Date){const n=new Date(+t,3,6);return Math.max(0,Math.round((n.getTime()-e.getTime())/(30.44*Bm)))}function jl(t,e=new Date){const[n,s]=String(t||"").split("-").map(Number);return!Number.isFinite(n)||!Number.isFinite(s)?0:Math.max(0,(n-e.getFullYear())*12+(s-1-e.getMonth()))}function Gm(t,e,n=new Date){const s=t||{},r=Yn(s,n,n);if(r==null)return null;const i=$l(s,n);return(new Date(n.getFullYear(),i.month,i.day).getTime()>n.getTime()?n.getFullYear():n.getFullYear()+1)+(Math.round(+e)-(r+1))+"-"+String(i.month+1).padStart(2,"0")}function Kl(t,e=null,n=new Date){const s=t||{};if(typeof s.retired=="boolean"&&+s.firstTaxYear>0||!(+s.currentAge>0))return s;const r=Ee(n),i=+s.shapeAgeNow||57,l=Ts(s,i,n)>r+1,a=s.retired===!0?!0:s.retired===!1||l?!1:e&&typeof e.retired=="boolean"?e.retired:!0;let c=+s.firstTaxYear>0?+s.firstTaxYear:a?r+1:Ts(s,+s.retireAge||i,n);return!(+s.firstTaxYear>0)&&!(c>=r)&&(c=r+1),{...s,firstTaxYear:c,retired:a,retireAge:a?null:+s.retireAge||i}}function Ym(t){return t.getFullYear()+"-"+String(t.getMonth()+1).padStart(2,"0")+"-"+String(t.getDate()).padStart(2,"0")}const $m=["firstTaxYear","retired","retireAge","currentAgeAsOf","legacyFirstTaxYear"];function jm(t,e=null,n=new Date){const s=Kl(t,e,n);return+s.currentAge>0?s.currentAgeAsOf?s:{...s,currentAgeAsOf:Ym(n)}:+s.firstTaxYear>0||+s.legacyFirstTaxYear>0?s:{...s,legacyFirstTaxYear:n.getFullYear()+1}}function Wl(t,e=new Date){const n=Kl(t||{},null,e),s=Ee(e),r={currentAge:null,retireAge:null,potScale:{sipp:1,isa:1},startOptions:[s,s+1]};if(!(+n.currentAge>0)){const a=+n.firstTaxYear>0?+n.firstTaxYear:+n.legacyFirstTaxYear>0?+n.legacyFirstTaxYear:e.getFullYear()+1;return{...r,mode:"legacy",firstTaxYear:a,shapeAgeNow:+n.shapeAgeNow||57,yearsToStart:Math.max(0,a-s),startMonth:a+"-04",bridgeMonths:Or(a,e)}}const i=Yn(n,e,e);if(n.retired===!1&&+n.retireAge>0){let a=Ts(n,+n.retireAge,e);a>=s||(a=s);const c=Mr(n,a,e),u=Gm(n,+n.retireAge,e);return{...r,mode:"future",firstTaxYear:a,shapeAgeNow:c,currentAge:i,retireAge:+n.retireAge,yearsToStart:a-s,startMonth:u,bridgeMonths:jl(u,e),potScale:Vm(n)}}const o=+n.firstTaxYear>0?+n.firstTaxYear:s+1,l=o+"-04";return{...r,mode:"retired",firstTaxYear:o,shapeAgeNow:Mr(n,o,e),currentAge:i,yearsToStart:Math.max(0,o-s),startMonth:l,bridgeMonths:Or(o,e)}}function Km(t,{locked:e=!1,hasRecords:n=!1,now:s=new Date}={}){if(e||n)return null;const r=t||{},i=Ee(s),o=+r.currentAge>0;let l=0,a="retired";return o&&r.retired===!1&&+r.retireAge>0?(a="future",l=Ts(r,+r.retireAge,s)||0):+r.firstTaxYear>0?(l=+r.firstTaxYear,o||(a="legacy")):!o&&+r.legacyFirstTaxYear>0&&(a="legacy",l=+r.legacyFirstTaxYear),!(l>0)||l>=i||+r.staleDraftDismissedFor===l?null:{savedYear:l,savedLabel:H(l),suggestedYear:i,suggestedLabel:H(i),mode:a}}const Wm=Object.freeze({stress:Object.freeze([...$m,"staleDraftDismissedFor"]),decision:Object.freeze([])}),Hm=Object.freeze(["locked","unlockedAt","unlockCount"]),qm=Object.freeze(["targetSchedule","spendingProfile","spendingMigratedFrom"]),St=t=>!!t&&typeof t=="object"&&!Array.isArray(t);function sn(t){return!!(St(t)&&t.locked)}function Dr(t){return Array.isArray(t)?t.map(Dr):St(t)?Object.keys(t).sort().reduce((e,n)=>(t[n]!==void 0&&(e[n]=Dr(t[n])),e),{}):t}const rn=t=>t===void 0?"<absent>":JSON.stringify(Dr(t));function zm(t,e){const n=St(t)?t:{},s=St(e)?e:{};return[...new Set([...Object.keys(n),...Object.keys(s)])].filter(i=>rn(n[i])!==rn(s[i])).sort()}function Jm(t,e){if(!St(t)||!St(e)||t.spendingProfile!=="declining"||e.spendingProfile!=="flat"||e.spendingMigratedFrom!=="declining")return!1;const n=t.targetSchedule,s=Array.isArray(n)&&n.length?n.map((r,i)=>Math.round((+r||0)*Jc(i,"declining"))):n;return rn(s)===rn(e.targetSchedule)}function Qm(t,e){return!sn(t)||!St(e)||sn(e)?!1:!!e.unlockedAt&&(+e.unlockCount||0)>(+t.unlockCount||0)}function Xm(t,e,n){const s=new Set(Wm[t]||[]);return t==="decision"&&Qm(e,n)&&Hm.forEach(r=>s.add(r)),t==="decision"&&Jm(e,n)&&qm.forEach(r=>s.add(r)),s}function Po(t,{locked:e,stored:n,next:s}){const r=Xm(t,n,s),i=zm(n,s).filter(o=>!r.has(o));return i.length?i:null}const Zm=["stressTool","decisionTool","strategy"],eg=/^(?:stressTool|decisionTool|strategy)$|^(?:stressTool|decisionTool)\.settings(?:\.|$)|^strategy\./;function tg(t){return!!t&&typeof t=="object"&&Object.keys(t).some(e=>eg.test(e))}function ng(t,e){var s,r;const n=JSON.parse(JSON.stringify({stressTool:t==null?void 0:t.stressTool,decisionTool:t==null?void 0:t.decisionTool,strategy:t==null?void 0:t.strategy}));for(const[i,o]of Object.entries(e||{})){const l=i.split(".");if(!Zm.includes(l[0]))continue;let a=n;for(let c=0;c<l.length-1;c++)St(a[l[c]])||(a[l[c]]={}),a=a[l[c]];a[l[l.length-1]]=o}return{stress:(s=n.stressTool)==null?void 0:s.settings,decision:(r=n.decisionTool)==null?void 0:r.settings,strategy:n.strategy}}function sg(t,e,n){var l,a;const s={stress:(l=t==null?void 0:t.stressTool)==null?void 0:l.settings,decision:(a=t==null?void 0:t.decisionTool)==null?void 0:a.settings,strategy:t==null?void 0:t.strategy};if(!sn(s.decision)||!tg(e))return null;const r=ng(t,e),i=c=>c===void 0?n:c,o=[...(Po("stress",{locked:!0,stored:i(s.stress),next:i(r.stress)})||[]).map(c=>"stress."+c),...(Po("decision",{locked:!0,stored:s.decision,next:r.decision})||[]).map(c=>"decision."+c),...rn(s.strategy)!==rn(r.strategy)?["strategy"]:[]];return o.length?o:null}const Ro=.025,Bt=3;function Oe(t){if(t instanceof Date)return Number.isFinite(t.getTime())?{y:t.getFullYear(),m:t.getMonth()+1}:null;if(t&&typeof t=="object")return Number.isInteger(t.y)&&t.m>=1&&t.m<=12?{y:t.y,m:t.m}:null;const e=/^(\d{4})-(\d{2})/.exec(String(t??""));return e&&+e[2]>=1&&+e[2]<=12?{y:+e[1],m:+e[2]}:null}const Nr=(t,e)=>e.y*12+e.m-(t.y*12+t.m),Mt=t=>t?t.y+"-"+String(t.m).padStart(2,"0"):null,Xe=t=>typeof t=="number"&&Number.isFinite(t);function Hl(t){const e=t&&t.accumulation;return!e||typeof e!="object"?null:e.version===Bt?Bt:2}function ql(t){const e=t||{},n=e.accumulation||{};return n.version===Bt&&Oe(n.asOf)?{at:Oe(n.asOf),from:"asOf"}:Oe(e.createdAt)?{at:Oe(e.createdAt),from:"createdAt"}:Oe(e.lockedAt)?{at:Oe(e.lockedAt),from:"lockedAt"}:{at:null,from:null}}function rg(t,e){const n=ql(t).at,s=Oe(e);if(Hl(t)===Bt||!n||!s)return{factor:1,cpi:null,months:n&&s?Nr(n,s):0,start:n};const r=Nr(n,s);return{factor:Math.pow(1+Ro,r/12),cpi:Ro,months:r,start:n}}function ig(t){const e=t&&t.accumulation;return!!(e&&e.version===Bt&&((+e.isaNow||0)>0||(+e.isaMonthly||0)>0))}function og(t,e){const n=t.length,s=Math.max(0,Math.min(n-1,e/12)),r=Math.floor(s),i=s-r,o=t[r],l=t[Math.min(n-1,r+1)],a=c=>{const u=+o.nominal[c],d=+l.nominal[c];return u+(d-u)*i};return{low:a("careful"),expected:a("middling"),high:a("good")}}function ag(t,{at:e,pension:n=null,isa:s=null}={}){const r=t&&t.accumulation;if(!r)return null;const i=Hl(t),o=Array.isArray(r.path)?r.path:[],l=ql(t).at,a=Oe(e),c=l&&a?Math.max(0,Nr(l,a)):0,u=ig(t),d={version:i,start:Mt(l),at:Mt(a),months:c,pathMissing:!o.length,isaCounted:u,actual:null,pension:Xe(n)?Math.round(n):null,isa:Xe(s)?Math.round(s):null,compared:null,prices:null,expected:null,low:null,high:null,band:null,missing:[]};if(!o.length)return d;let p;if(i===Bt)p=og(o,c);else{const v=o[0].potMix!=null?"potMix":"potMid";p={expected:ar(o,c/12,v),low:ar(o,c/12,"potLow"),high:ar(o,c/12,"potHigh")}}if(d.expected=Math.round(p.expected),d.low=Math.round(p.low),d.high=Math.round(p.high),!Xe(n))return d.missing.push("pension"),d;if(u&&!Xe(s))return d.missing.push("isa"),d;const m=n+(u?s:0),g=rg(t,a||l),f=m/g.factor;return d.actual=Math.round(m),d.compared=Math.round(f),d.prices={factor:g.factor,cpi:g.cpi,start:Mt(g.start)},i===Bt?d.band=Math.abs(p.high-p.low)<1?"start":f<p.low?"below p10":f<p.expected?"p10–p50":f<=p.high?"p50–p90":"above p90":d.band=f<p.low?"below the cautious line":f<p.expected?"below the locked path":f<=p.high?"on or above the locked path":"above the strong line",d}function lg(t){if(!t||t.isa==null||!Xe(+t.isa))return null;const e=+t.isa;return e===0&&t.isaEntered!==!0?null:e}function zl({accHistory:t=[],potsToday:e=null,holdingsPension:n=0,holdingsIsa:s=null,holdingsAsOf:r=null,today:i=new Date}={}){const o=(t||[]).filter(l=>l&&Oe(l.date)).slice().sort((l,a)=>String(l.date).localeCompare(String(a.date))).pop()||null;if(o){const l=Xe(+o.sipp)&&o.sipp!=null?+o.sipp:Xe(+o.total)?+o.total:null;return{source:"record",at:Mt(Oe(o.date)),recordedAt:o.date,pension:l,isa:lg(o)}}return e!=null&&Xe(+e)?{source:"today",at:Mt(Oe(i)),recordedAt:null,pension:+e,isa:null}:n>0?{source:"holdings",at:Mt(Oe(r)||Oe(i)),recordedAt:r||null,pension:n,isa:Xe(s)?s:null}:{source:null,at:Mt(Oe(i)),recordedAt:null,pension:null,isa:null}}const cg=5,ug=Object.freeze({saving:{key:"saving",label:"Saving",chip:"saving",leads:["budget","accumulation"],readOnly:[],hidden:[],banner:{text:"You are saving. Set the income you will want (Budget), then check you are on course for it (Accumulation planner). The Stress tester can price the plan on the pots you will have at retirement.",btn:"Open the Accumulation planner",tab:"accumulation"}},approaching:{key:"approaching",label:"Approaching retirement",chip:"approaching",leads:["stress","strategies","accumulation"],readOnly:[],hidden:[],banner:{text:"Within five years of your plan start. Pick the strategy you will retire on and stress-test it — then lock the plan and start moving your holdings into it.",btn:"Open the Stress tester",tab:"stress"}},"committed-saving":{key:"committed-saving",label:"Committed, still saving",chip:"to go",leads:["accumulation"],readOnly:["stress","strategies"],hidden:[],banner:{text:"Your plan is locked and starts in {start}. Keep saving and buying the target portfolio; the Decision tool opens when the plan starts.",btn:"Open the plan document",tab:"decision",sub:"plandoc"}},bridge:{key:"bridge",label:"Retired — run-up to the plan's first tax year",chip:"run-up",leads:["decision"],readOnly:["stress","strategies"],hidden:["accumulation"],banner:{text:"Retired, drawing from your SIPP cash until the plan's first tax year, {start}. Record each month in the Decision tool; the ladder's rungs and the plan's tracks begin in {start}.",btn:"Open the Decision tool",tab:"decision"}},running:{key:"running",label:"Running the plan",chip:"running",leads:["decision"],readOnly:["stress","strategies"],hidden:["accumulation"],banner:null},"draft-retired":{key:"draft-retired",label:"Retired, designing the plan",chip:"retired",leads:["stress","strategies"],readOnly:[],hidden:["accumulation"],banner:{text:"You are retired and the plan is still a draft. Stress-test it, then lock it from the Stress tester's Settings page to write the plan document and start recording months.",btn:"Open the Stress tester",tab:"stress"}},unknown:{key:"unknown",label:"Getting started",chip:"",leads:["budget"],readOnly:[],hidden:[],banner:null}});function dg(t,e=new Date){var A,T,w,_;const n=t||{},s=((A=n.stressTool)==null?void 0:A.settings)||{},i=!!(((T=n.decisionTool)==null?void 0:T.settings)||{}).locked,o=Array.isArray((w=n.decisionTool)==null?void 0:w.history)?n.decisionTool.history:[],l=((_=n.decisionTool)==null?void 0:_.taxYears)||{},a=o.length>0||Object.values(l).some(P=>P&&P.yearSetupComplete),c=!!n.planDocument,u=Wl(s,e),d=Ee(e),p=e.getFullYear()+"-"+String(e.getMonth()+1).padStart(2,"0"),m=u.mode==="future"&&u.startMonth?p<u.startMonth:u.firstTaxYear>d,g=u.mode==="future"&&u.startMonth?jl(u.startMonth,e):Or(u.firstTaxYear,e),f=[];let v;u.mode==="legacy"?(v=i?"running":"unknown",f.push("no age today in the Timing block")):u.mode==="future"?(i?v=m?"committed-saving":"running":v=u.yearsToStart>cg?"saving":"approaching",f.push("retiring at "+u.retireAge+" ("+H(u.firstTaxYear)+")")):(i?v=m?"bridge":"running":v="draft-retired",f.push("already retired; plan starts "+H(u.firstTaxYear))),i&&f.push("plan locked"+(c?" with a plan document":""));const I=ug[v],S=I.leads.slice(),y=I.hidden.slice();["approaching","committed-saving","bridge","draft-retired"].includes(v)&&S.push("transition");const h=H(u.firstTaxYear),b=I.banner?{...I.banner,text:I.banner.text.replace(/\{start\}/g,h)}:null;return{key:v,label:I.label,chip:hg(I,g,m),leads:S,readOnly:I.readOnly.slice(),hidden:y,banner:b,locked:i,retired:u.mode==="retired",timingMode:u.mode,firstTaxYear:u.firstTaxYear,startLabel:h,startMonth:u.startMonth||null,yearsToStart:u.yearsToStart,monthsToStart:g,beforeStart:m,hasRecords:a,hasDocument:c,reasons:f}}function hg(t,e,n){return t.key==="committed-saving"||t.key==="bridge"?!n||e<=0?t.chip:e>=24?Math.round(e/12)+" years to go":e+" month"+(e===1?"":"s")+" to go":t.chip}const fg=.025,Ge=t=>Number.isFinite(+t)?+t:0;function pg(t){const e=dn(t).filter(y=>y&&(Ge(y.value)>0||Ge(y.contribution)>0)),n=vs(e.map(y=>({...y,value:Ge(y.value)}))),s={SIPP:0,ISA:0,GIA:0,CASH:0},r={shares:0,bonds:0,diversifiers:0,cash:0},i={};let o=0,l=0,a=0;for(const y of n.tagged){const h=Ge(y.value);if(!(h>0))continue;o+=h;const b=(y.wrapper||"SIPP").toUpperCase();s[b in s?b:"SIPP"]+=h,r[y.bucket]=(r[y.bucket]||0)+h,i[y.subClass]=(i[y.subClass]||0)+h,l+=h*(Ge(y.ocf)/100);const A=bn[y.subClass];a+=h*(A?Ge(A.nominalReturn):0)}const c={};for(const y of Object.keys(r))c[y]=o>0?r[y]/o:0;const u=Object.entries(i).map(([y,h])=>{var b,A;return{key:y,label:((b=bn[y])==null?void 0:b.label)||y,bucket:((A=bn[y])==null?void 0:A.bucket)||"shares",value:h,weight:o>0?h/o:0}}).sort((y,h)=>h.value-y.value),d=o>0?l/o:0,p=o>0?a/o:0,m=e.filter(y=>Ge(y.contribution)>0),g=vs(m.map(y=>({...y,value:Ge(y.contribution)}))),f={shares:0,bonds:0,diversifiers:0,cash:0};let v=0;const I={SIPP:0,ISA:0,GIA:0,CASH:0};for(const y of g.tagged){const h=Ge(y.value);v+=h,f[y.bucket]=(f[y.bucket]||0)+h;const b=(y.wrapper||"SIPP").toUpperCase();I[b in I?b:"SIPP"]+=h}const S={};for(const y of Object.keys(f))S[y]=v>0?f[y]/v:0;return{total:o,byWrapper:s,buckets:c,bucketValues:r,subClasses:u,weightedOcf:d,expectedNominal:p,expectedReal:p-fg-d,contributions:{monthly:v,byBucket:S,byWrapper:I},untagged:n.untagged.map(y=>({ticker:y.ticker||"",name:y.name||"",value:Ge(y.value)}))}}function mg(t){return dn(t).reduce((e,n)=>e+(n&&(n.wrapper||"SIPP").toUpperCase()==="SIPP"?Ge(n.value):0),0)}const gg=["full-il-gilt","gilt-rotation","floor-the-schedule"],yg=.04,bg=["pots-and-valves","buckets-in-order"],Ag=["full-il-gilt","gilt-rotation"];function Mo(t,{planYear:e=0}={}){var p,m;const n=t||{},s=((p=n.strategy)==null?void 0:p.id)||"pots-and-valves",r=bg.includes(s),i=n.pots||{},o=i.isaPolicy==="hold",l=r||!o,a=(Array.isArray(n.timeline)?n.timeline:[]).filter(g=>g&&+g.y<=e).flatMap(g=>Array.isArray(g.lumpIn)?g.lumpIn:[]);let c=!1,u=!1;for(const g of a){const f=String(g.wrapper||"cash").toLowerCase(),v=+g.amount||0;f==="pension"||f==="sipp"||!(v>0)||(f==="isa"?c=!0:f==="gia"||o?u=!0:(c=!0,v>Qc.ISA_ALLOWANCE&&(u=!0)))}const d=(+i.isa||0)>0;return{strategyId:s,potsStrategy:r,isa:l&&(d||c),gia:(+i.gia||0)>0||u,diversifiers:r&&(+((m=i.allocation)==null?void 0:m.diversifierStart)||0)>0,isaLeftOut:!l&&d}}function Le(t){if(t instanceof Date)return Number.isFinite(t.getTime())?{y:t.getFullYear(),m:t.getMonth()+1}:null;if(t&&typeof t=="object")return Number.isInteger(t.y)&&t.m>=1&&t.m<=12?{y:t.y,m:t.m}:null;const e=/^(\d{4})-(\d{2})/.exec(String(t??""));return e?{y:+e[1],m:+e[2]}:null}const Ai=(t,e)=>e.y*12+e.m-(t.y*12+t.m),vi=(t,e)=>(t.m>=4?t.y:t.y-1)-e,Jl=t=>(t.m+8)%12;function vg(t,e,n=null){var u,d;const s=+((u=t==null?void 0:t.assumptions)==null?void 0:u.cpiDecision)>0?+t.assumptions.cpiDecision:yg,r=+((d=t==null?void 0:t.timing)==null?void 0:d.firstTaxYear),i=Le(e),o={factor:1,assumed:s,years:[]};if(!i||!Number.isFinite(r))return o;const l=vi(i,r),a=Jl(i)/12,c=n&&typeof n=="object"?n:{};for(let p=0;p<=l;p++){const m=p<l?1:a;if(!(m>0))break;const g=bi(r+p),f=+(c[g]&&c[g].cpi)||0,v=f||s;o.factor*=Math.pow(1+v,m),o.years.push({taxYear:g,cpi:v,entered:!!f,share:m})}return o}function Tg(t){const e=(t||[]).filter(r=>r&&Le(r.date)).slice().sort((r,i)=>String(r.date).localeCompare(String(i.date)));if(!e.length)return null;const n=(r,i)=>["equity","bond","cash"].every(o=>Math.abs((+r[o]||0)-(+i[o]||0))<.5);let s=e.length-1;for(;s>0&&n(e[s-1],e[s])&&Ai(Le(e[s-1].date),Le(e[s].date))===1;)s--;return{rec:e[s],idx:s,recs:e}}function wn(t,e){const n=dn(t).filter(r=>r&&Gs(r.wrapper)===e&&Ve(r.value)!=null);if(!n.length)return null;const s=t&&!Array.isArray(t)&&t.updatedAt||n.map(r=>r.asOf).filter(Boolean).sort().pop()||null;return{value:n.reduce((r,i)=>r+Ve(i.value),0),asOf:s?String(s).slice(0,10):null}}function _g(t){const e=wn(t,"SIPP");if(!e)return null;const n=dn(t).filter(s=>s&&Gs(s.wrapper)==="SIPP"&&Ve(s.value)!=null).map(s=>({...s,value:Ve(s.value)}));return{value:pg(n).bucketValues.diversifiers||0,asOf:e.asOf}}function Sg(t,{today:e,history:n,potsToday:s,holdings:r}){const i=h=>Mo(t,{planYear:vi(h,+t.timing.firstTaxYear)});if(s!=null){const h=e.toISOString().slice(0,10),b=Le(e);return{source:"today",asOf:h,at:b,pension:Math.round(+s),parts:[{key:"all",value:+s,source:"today",asOf:h}],missing:[],measure:i(b),runUpMonthly:0}}const o=Tg(n),l=wn(r,"SIPP"),a=Mo(t).diversifiers,c=[],u=[];let d=null,p=null,m=null,g=null;const f=l&&l.value>0?Le(l.asOf):null,v=a&&l&&l.value>0&&(!o||f!=null&&Ai(Le(o.rec.date),f)>=0);if(o&&!v){if(d="record",g=o.rec,m=String(g.date).slice(0,7),p=(+g.equity||0)+(+g.bond||0)+(+g.cash||0),a){const h=_g(r);h?h.value>0&&u.push({key:"diversifiers",value:h.value,source:"holdings",asOf:h.asOf}):c.push("diversifiers")}}else l&&l.value>0&&(d="holdings",p=l.value,m=l.asOf);const I=Le(m)||Le(e),S=i(I);if(d==null)return{source:null,asOf:null,at:I,pension:null,parts:[],missing:["pension"],measure:S,runUpMonthly:0};const y=[{key:"pension",value:p,source:d,asOf:m},...u];if(S.isa){const h=wn(r,"ISA");h?y.push({key:"isa",value:h.value,source:"holdings",asOf:h.asOf}):c.push("isa")}if(S.gia){let h=null;if(g&&Ve(g.gia)!=null)h={value:+g.gia,source:"record",asOf:m};else if(g){const b=o.recs.slice(0,o.idx).reverse().find(A=>Ve(A.gia)!=null);b&&Ve(b.giaBalanceAfter)!=null&&+b.giaBalanceAfter<=1&&(h={value:0,source:"record",asOf:m})}if(!h){const b=wn(r,"GIA");b&&(h={value:b.value,source:"holdings",asOf:b.asOf})}h?y.push({key:"gia",...h}):c.push("gia")}return{source:d,asOf:m,at:I,pension:Math.round(p),parts:y,missing:c,measure:S,runUpMonthly:g&&+g.sipp||0}}function wg(t,e,n=0){const s=(p,m)=>Array.isArray(p)&&m<p.length&&Number.isFinite(+p[m])?+p[m]:null,r=Array.isArray(t==null?void 0:t.p50)?t.p50.length:0;if(!r)return{p10:null,p50:null,p90:null};const i=Math.min(Math.max(0,e),r-1),o=s(t.p50,i),l=s(t.p50,i+1);if(o==null)return{p10:null,p50:null,p90:null};const a=n>0&&l!=null,c=a?o+n*(l-o):o,u=a?(Math.sqrt(i+n)-Math.sqrt(i))/(Math.sqrt(i+1)-Math.sqrt(i)):0,d=p=>{const m=s(p,i);if(m==null)return null;const g=s(p,i+1);if(!a||g==null)return m+(c-o);const f=m-o,v=g-l;return c+f+u*(v-f)};return{p10:d(t.p10),p50:c,p90:d(t.p90)}}function Ig(t,e,{today:n,history:s,potsToday:r,holdings:i,taxYears:o}){var R,D,k;const l=+t.timing.firstTaxYear,a=Sg(t,{today:n,history:s,potsToday:r,holdings:i}),c=vi(a.at,l);if(t.timing.mode==="future"&&c<0)return null;const u=Math.max(0,c),d=c>=0?Jl(a.at)/12:0;let{p10:p,p50:m,p90:g}=wg(e,u,d);const f=m;let v=null;const I=Math.max(0,+((R=t.assumptions)==null?void 0:R.bridgeCash)||0);if(c<0&&I>0){const M=Math.max(0,l*12+4-(a.at.y*12+a.at.m)),x=Math.round(+((D=t.timing)==null?void 0:D.bridgeMonths)||+((k=t.assumptions)==null?void 0:k.bridgeMonths)||0);let F,he;if(x>0)F=I*Math.min(1,M/x),he=I/x;else{const ae=Array.isArray(t.timeline)?t.timeline[0]:null;he=a.runUpMonthly>0?a.runUpMonthly:ae?Math.max(0,((+ae.gross||0)-(+ae.sp||0)-(+ae.other||0))/12):0,F=Math.min(I,he*M)}F>0&&(v={months:M,of:x>0?x:null,monthly:Math.round(he),value:Math.round(F)},[p,m,g]=[p,m,g].map(ae=>ae==null?null:ae+F))}const S=a.missing.length?null:a.parts.reduce((M,x)=>M+x.value,0),y=vg(t,a.at,o),h=S==null?null:S/y.factor,b=Array.isArray(e.p10)&&Array.isArray(e.p90)&&e.p10.length>1&&e.p10.every((M,x)=>Math.abs((e.p90[x]??M)-M)<1),A=Ag.includes(a.measure.strategyId)||b;let T=null,w=null;h!=null&&m!=null&&(A?T="gilts-at-cost":p==null||g==null||Math.abs(m-p)<1?T=(p==null||g==null||Math.abs(g-p)<1)&&(c<0||c===0&&d===0)?"start":"not-open":(T="band",w=h<p?"below p10":h<m?"p10–p50":h<=g?"p50–p90":"above p90"));const _=Le(n),P=a.parts.filter(M=>M.source!=="today"&&Le(M.asOf)&&_&&Ai(Le(M.asOf),_)>3).map(M=>({key:M.key,source:M.source,asOf:M.asOf})),E=M=>M==null?null:Math.round(M);return{actual:E(S),real:E(h),pension:a.pension,parts:a.parts.map(M=>({...M,value:Math.round(M.value)})),missing:a.missing,source:a.source,asOf:a.asOf,planYear:c,monthsIn:Math.round(d*12),prices:{factor:y.factor,assumed:y.assumed,years:y.years.length,entered:y.years.filter(M=>M.entered).length},p10:E(p),p50:E(m),p90:E(g),startP50:v?E(f):null,runUp:v,verdict:T,band:w,flat:b,isaLeftOut:a.measure.isaLeftOut,stale:P}}function kg(t,{today:e=new Date,history:n=[],potsToday:s=null,ladderPos:r=null,accHistory:i=[],holdings:o=null,taxYears:l=null}={}){var R,D,k,M,x,F,he,ae,be;if(!t||!t.timing)return null;const a=mg(dn(o)),c=o&&!Array.isArray(o)&&o.updatedAt?o.updatedAt:null;let u=null;if(t.accumulation&&t.timing.mode==="future"){const q=wn(o,"ISA"),se=zl({accHistory:i,potsToday:s,holdingsPension:a,holdingsIsa:q?q.value:null,holdingsAsOf:c,today:e}),le=ag(t,{at:se.at,pension:se.pension,isa:se.isa}),it=new Date(+t.timing.firstTaxYear,3,6);u={monthsToGo:Math.max(0,Math.round((it.getTime()-e.getTime())/(30.44*24*3600*1e3))),pathMissing:le.pathMissing,version:le.version,expected:le.expected,low:le.low,high:le.high,actual:le.pathMissing||le.actual==null?se.pension==null?null:Math.round(se.pension):le.actual,compared:le.compared,pension:le.pension,isa:le.isa,isaCounted:le.isaCounted,missing:le.missing,prices:le.prices,at:le.at,start:le.start,actualSource:se.source,recordedAt:se.source==="record"?se.recordedAt:se.source==="holdings"?c:null,band:le.band,contributions:t.accumulation.totalMonthly||0,isaMonthly:t.accumulation.isaMonthly||0}}const d=+t.timing.firstTaxYear,p=Um(e,d),m=p<0,g=Math.max(0,p),f=((R=t.timeline)==null?void 0:R.length)||((D=t.assumptions)==null?void 0:D.duration)||35,v=t.timing.shapeAgeNow+p,I=H(Ee(e)),S=(t.steps||[]).slice().sort((q,se)=>q.fromAge-se.fromAge),y=S.filter(q=>{var se;return q.fromAge<=Math.max(v,((se=S[0])==null?void 0:se.fromAge)??v)}).pop()||S[0]||null,h=S.find(q=>q.fromAge>(y?y.fromAge:v))||null,b=y?Math.round(kn(S.map(q=>({fromAge:q.fromAge,amount:q.amount,decline:q.decline,glideToNext:q.glideToNext})),Math.max(v,y.fromAge),y.amount)):null,A=((k=t.timeline)==null?void 0:k[g])||null,T=String(Ee(e)%100).padStart(2,"0")+"/"+String((Ee(e)+1)%100).padStart(2,"0"),w=(n||[]).filter(q=>q&&q.taxYear===T),_=w.reduce((q,se)=>q+(+se.sipp||0)+(+se.other||0)+(+se.state||0),0),P=((F=(x=(M=t.strategy)==null?void 0:M.r)==null?void 0:x.cones)==null?void 0:F.wealth)||null,E=P?Ig(t,P,{today:e,history:n,potsToday:s,holdings:o,taxYears:l}):null;return{today:e.toISOString().slice(0,10),planYear:p,planYears:f,bridge:m,taxYear:I,age:v,planStart:H(d),step:y?{amount:b,from:y.fromAge,taxYear:y.taxYear,index:S.indexOf(y)+1,of:S.length,next:h?{fromAge:h.fromAge,amount:h.amount,taxYear:h.taxYear,yearsAway:h.fromAge-v}:null}:null,incomeThisYear:{recorded:w.length,drawn:Math.round(_),planned:A?A.gross:null,perMonth:A?Math.round(A.gross/12):null},pot:E,ladder:r?{phase:r.phase,instruction:r.instruction,monthly:r.monthly,source:r.source,verdict:((he=r.cashCheck)==null?void 0:he.verdict)||null}:null,contract:!!((ae=t.strategy)!=null&&ae.contract),strategyId:((be=t.strategy)==null?void 0:be.id)||"pots-and-valves",saving:u}}function Eg(t){const e=t.getMonth(),n=t.getDate();return e>3||e===3&&n>=6?t.getFullYear():t.getFullYear()-1}function Pg(t,e){const n=new Date(t+1,3,6);if(e>=n)return 0;const s=new Date(t,3,6),r=e<s?s:e;return Math.max(1,Math.min(12,Math.round((n-r)/(30.44*24*3600*1e3))))}function Rg(t,e={}){if(!t||!Array.isArray(t.years)||!t.years.length)return null;const n=e.today||new Date,s=Eg(n),r=t.years,i=r[0].Y,o=r[r.length-1].Y,l=r.find(E=>E.Y===s)||null,a=s<i?"before":s>o?"after":"running",c=l?l.need:0,u=l?l.gross:0,d=Math.max(0,u-c),p=Pg(s,n),m=e.drawnThisYear||0,g=Math.max(0,c-m),f=p>0?g/p:0,v=[];for(const E of r){if(E.Y<=s)continue;(E.from==="cash"?!0:E.matures?new Date(E.matures)<=n:!1)&&v.push({Y:E.Y,age:E.age,amount:E.need,from:E.from,until:new Date(E.Y,3,6)})}const I=v.reduce((E,R)=>E+R.amount,0),S=(t.orders||[]).filter(E=>new Date(E.matures)>n).sort((E,R)=>E.matures.localeCompare(R.matures)),y=S.length?S[0]:null,h=y?{tidm:y.tidm,name:y.name,matures:y.matures,nominal:y.nominal,pays:y.pays,taxYears:y.taxYears||[],monthsAway:Math.round((new Date(y.matures)-n)/(30.44*24*3600*1e3)),sitsMonths:y.taxYears&&y.taxYears.length?Math.max(0,Math.round((new Date(y.taxYears[0],3,6)-new Date(y.matures))/(30.44*24*3600*1e3))):0}:null,b=g,A=b+I,T=e.cashBalance==null?null:e.cashBalance,w=T==null?null:{balance:T,shouldBeLiquid:b,parkedTotal:I,expectedTotal:A,diff:T-A,verdict:Math.abs(T-A)<Math.max(500,A*.02)?"as expected":T>A?"more cash than the plan needs — park the surplus":"less cash than the plan needs — check the last maturity landed"},_=r[0],P=a==="before"?{Y:_.Y,label:`${_.Y}/${String(_.Y+1).slice(2)}`,age:_.age,gross:_.gross,fromLadder:_.need,statePension:Math.max(0,_.gross-_.need),monthly:_.need/12,source:_.from,startsOn:new Date(_.Y,3,6),cashBucket:t.cash||0,cashYears:r.filter(E=>E.from==="cash").length}:null;return{taxYear:s,taxYearLabel:`${s}/${String(s+1).slice(2)}`,phase:a,upcoming:P,age:l?l.age:null,gross:u,statePension:d,fromLadder:c,source:l?l.from:null,sourceHeld:l?!!l.held:!1,monthsLeft:p,drawnThisYear:m,remaining:g,monthly:f,parked:v,parkedTotal:I,next:h,cashCheck:w,yearsLeft:Math.max(0,o-s),instruction:l?`Instruct the broker to pay ${Mg(f)} a month for the ${p} month${p===1?"":"s"} to 5 April ${s+1}.`:a==="before"?`The ladder starts in ${i}/${String(i+1).slice(2)}.`:"The ladder has paid its last year."}}function Mg(t){return"£"+Math.round(t).toLocaleString("en-GB")}function Oo(t,e=null){const n=t&&t.strategy&&t.strategy.r?t.strategy.r.plan:null;return!n||!Array.isArray(n.years)||!n.years.length||!Array.isArray(n.orders)||e&&t.strategy.id&&t.strategy.id!==e?null:n}const Jn={gilts:[{name:"0 3/8% Treasury Gilt 2026",isin:"GB00BNNGP668",type:"conventional",coupon:.375,maturity:"2026-10-22",dmoDate:"2026-10-16",tidm:"T26A",cleanPrice:99.96,yield:null,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 1/8% Treasury Gilt 2027",isin:"GB00BL6C7720",type:"conventional",coupon:4.125,maturity:"2027-01-29",dmoDate:"2026-10-16",tidm:"T27A",cleanPrice:99.99,yield:.04185,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"3¾% Treasury Gilt 2027",isin:"GB00BPSNB460",type:"conventional",coupon:3.75,maturity:"2027-03-07",dmoDate:"2026-10-16",tidm:"TS27",cleanPrice:99.82,yield:.04257,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1¼% Treasury Gilt 2027",isin:"GB00BDRHNP05",type:"conventional",coupon:1.25,maturity:"2027-07-22",dmoDate:"2026-10-16",tidm:"TG27",cleanPrice:97.72,yield:.04361,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1¼% Index-linked Treasury Gilt 2027",isin:"GB00B128DH60",type:"il3",coupon:1.25,maturity:"2027-11-22",dmoDate:"2026-10-16",tidm:"T27",cleanPrice:101.77,yield:-.00353,yieldKind:"real",baseRpi:194.06667,indexRatio:2.16663},{name:"4¼% Treasury Gilt 2027",isin:"GB00B16NNR78",type:"conventional",coupon:4.25,maturity:"2027-12-07",dmoDate:"2026-10-16",tidm:"TR27",cleanPrice:99.69,yield:.04579,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Treasury Gilt 2028",isin:"GB00BMBL1G81",type:"conventional",coupon:.125,maturity:"2028-01-31",dmoDate:"2026-10-16",tidm:"TN28",cleanPrice:94.88,yield:.04283,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 3/8% Treasury Gilt 2028",isin:"GB00BSQNRC93",type:"conventional",coupon:4.375,maturity:"2028-03-07",dmoDate:"2026-10-16",tidm:"TE28",cleanPrice:99.58,yield:.04742,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4½% Treasury Gilt 2028",isin:"GB00BMF9LG83",type:"conventional",coupon:4.5,maturity:"2028-06-07",dmoDate:"2026-10-16",tidm:"TS28",cleanPrice:99.63,yield:.04789,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2028",isin:"GB00BZ1NTB69",type:"il3",coupon:.125,maturity:"2028-08-10",dmoDate:"2026-10-16",tidm:"T28",cleanPrice:99.83,yield:.00219,yieldKind:"real",baseRpi:279.23333,indexRatio:1.50581},{name:"1 5/8% Treasury Gilt 2028",isin:"GB00BFX0ZL78",type:"conventional",coupon:1.625,maturity:"2028-10-22",dmoDate:"2026-10-16",tidm:"TG28",cleanPrice:94.17,yield:.04741,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"6% Treasury Stock 2028",isin:"GB0002404191",type:"conventional",coupon:6,maturity:"2028-12-07",dmoDate:"2026-10-16",tidm:"TR28",cleanPrice:102.69,yield:.04718,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0½% Treasury Gilt 2029",isin:"GB00BLPK7227",type:"conventional",coupon:.5,maturity:"2029-01-31",dmoDate:"2026-10-16",tidm:"TG29",cleanPrice:90.98,yield:.04747,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2029",isin:"GB00B3Y1JG82",type:"il3",coupon:.125,maturity:"2029-03-22",dmoDate:"2026-10-16",tidm:"T29",cleanPrice:98.32,yield:.00826,yieldKind:"real",baseRpi:237.42,indexRatio:1.771},{name:"4% Treasury Gilt 2029",isin:"GB00BVP99566",type:"conventional",coupon:4,maturity:"2029-05-22",dmoDate:"2026-10-16",tidm:"T29K",cleanPrice:97.96,yield:.04902,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 1/8% Treasury Gilt 2029",isin:"GB00BQC82B83",type:"conventional",coupon:4.125,maturity:"2029-07-22",dmoDate:"2026-10-16",tidm:"TS29",cleanPrice:98.16,yield:.049,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 7/8% Treasury Gilt 2029",isin:"GB00BJMHB534",type:"conventional",coupon:.875,maturity:"2029-10-22",dmoDate:"2026-10-16",tidm:"TR29",cleanPrice:89.15,yield:.04836,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 3/8% Treasury Gilt 2030",isin:"GB00BSQNRD01",type:"conventional",coupon:4.375,maturity:"2030-03-07",dmoDate:"2026-10-16",tidm:"T30",cleanPrice:98.41,yield:.04948,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 5/8% Treasury Gilt 2030",isin:"GB00BWBR1P52",type:"conventional",coupon:4.625,maturity:"2030-05-22",dmoDate:"2026-10-16",tidm:"T30K",cleanPrice:99.08,yield:.04966,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 1/8% Index-linked Treasury Stock 2030",isin:"GB0008932666",type:"il8",coupon:4.125,maturity:"2030-07-22",dmoDate:"2026-10-16",tidm:"T30I",cleanPrice:342.35,yield:null,yieldKind:"real",baseRpi:135.1,indexRatio:null},{name:"0 3/8% Treasury Gilt 2030",isin:"GB00BL68HH02",type:"conventional",coupon:.375,maturity:"2030-10-22",dmoDate:"2026-10-16",tidm:"TG30",cleanPrice:84.04,yield:.04848,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4¾% Treasury Gilt 2030",isin:"GB00B24FF097",type:"conventional",coupon:4.75,maturity:"2030-12-07",dmoDate:"2026-10-16",tidm:"TR30",cleanPrice:99.7,yield:.04888,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 1/8% Treasury Gilt 2031",isin:"GB00BVP99673",type:"conventional",coupon:4.125,maturity:"2031-03-07",dmoDate:"2026-10-16",tidm:"T31H",cleanPrice:96.86,yield:.04989,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0¼% Treasury Gilt 2031",isin:"GB00BMGR2809",type:"conventional",coupon:.25,maturity:"2031-07-31",dmoDate:"2026-10-16",tidm:"TG31",cleanPrice:80.69,yield:.04871,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2031",isin:"GB00BNNGP551",type:"il3",coupon:.125,maturity:"2031-08-10",dmoDate:"2026-10-16",tidm:"TR31",cleanPrice:95.53,yield:.01083,yieldKind:"real",baseRpi:293.60323,indexRatio:1.43211},{name:"4% Treasury Gilt 2031",isin:"GB00BPSNBF73",type:"conventional",coupon:4,maturity:"2031-10-22",dmoDate:"2026-10-16",tidm:"T31",cleanPrice:95.82,yield:.05012,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1% Treasury Gilt 2032",isin:"GB00BM8Z2T38",type:"conventional",coupon:1,maturity:"2032-01-31",dmoDate:"2026-10-16",tidm:"TG32",cleanPrice:81.73,yield:.0503,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 5/8% Treasury Gilt 2032",isin:"GB00BWGDRG14",type:"conventional",coupon:4.625,maturity:"2032-03-07",dmoDate:"2026-10-16",tidm:"T32H",cleanPrice:98.27,yield:.05056,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4¼% Treasury Stock 2032",isin:"GB0004893086",type:"conventional",coupon:4.25,maturity:"2032-06-07",dmoDate:"2026-10-16",tidm:"TR32",cleanPrice:96.57,yield:.05014,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1¼% Index-linked Treasury Gilt 2032",isin:"GB00B3D4VD98",type:"il3",coupon:1.25,maturity:"2032-11-22",dmoDate:"2026-10-16",tidm:"T32",cleanPrice:99.38,yield:.01361,yieldKind:"real",baseRpi:217.13226,indexRatio:1.93647},{name:"3¼% Treasury Gilt 2033",isin:"GB00BMV7TC88",type:"conventional",coupon:3.25,maturity:"2033-01-31",dmoDate:"2026-10-16",tidm:"TR33",cleanPrice:90.35,yield:.05122,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 1/8% Treasury Gilt 2033",isin:"GB00BVP99780",type:"conventional",coupon:4.125,maturity:"2033-03-07",dmoDate:"2026-10-16",tidm:"T33H",cleanPrice:94.86,yield:.05141,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 7/8% Green Gilt 2033",isin:"GB00BM8Z2S21",type:"conventional",coupon:.875,maturity:"2033-07-31",dmoDate:"2026-10-16",tidm:"TG33",cleanPrice:76.03,yield:.0516,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0¾% Index-linked Treasury Gilt 2033",isin:"GB00BMF9LJ15",type:"il3",coupon:.75,maturity:"2033-11-22",dmoDate:"2026-10-16",tidm:"T33",cleanPrice:94.65,yield:.01554,yieldKind:"real",baseRpi:372.24,indexRatio:1.12957},{name:"4 5/8% Treasury Gilt 2034",isin:"GB00BPJJKN53",type:"conventional",coupon:4.625,maturity:"2034-01-31",dmoDate:"2026-10-16",tidm:"T34",cleanPrice:96.9,yield:.05205,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0¾% Index-linked Treasury Gilt 2034",isin:"GB00B46CGH68",type:"il3",coupon:.75,maturity:"2034-03-22",dmoDate:"2026-10-16",tidm:"TRTQ",cleanPrice:93.56,yield:.01682,yieldKind:"real",baseRpi:232.22903,indexRatio:1.81059},{name:"4¼% Treasury Gilt 2034",isin:"GB00BQC82C90",type:"conventional",coupon:4.25,maturity:"2034-07-31",dmoDate:"2026-10-16",tidm:"TS34",cleanPrice:94.12,yield:.05243,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4½% Treasury Gilt 2034",isin:"GB00B52WS153",type:"conventional",coupon:4.5,maturity:"2034-09-07",dmoDate:"2026-10-16",tidm:"TR34",cleanPrice:95.78,yield:.05223,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"2% Index-linked Treasury Stock 2035",isin:"GB0031790826",type:"il8",coupon:2,maturity:"2035-01-26",dmoDate:"2026-10-16",tidm:"T2IL",cleanPrice:241.88,yield:null,yieldKind:"real",baseRpi:173.6,indexRatio:null},{name:"4½% Treasury Gilt 2035",isin:"GB00BT7J0027",type:"conventional",coupon:4.5,maturity:"2035-03-07",dmoDate:"2026-10-16",tidm:"T35",cleanPrice:95.03,yield:.05308,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 5/8% Treasury Gilt 2035",isin:"GB00BMGR2916",type:"conventional",coupon:.625,maturity:"2035-07-31",dmoDate:"2026-10-16",tidm:"TG35",cleanPrice:67.83,yield:.05308,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1 1/8% Index-linked Treasury Gilt 2035",isin:"GB00BT7HZZ68",type:"il3",coupon:1.125,maturity:"2035-09-22",dmoDate:"2026-10-16",tidm:"TR35",cleanPrice:94.09,yield:.01854,yieldKind:"real",baseRpi:390.88065,indexRatio:1.0757},{name:"4¾% Treasury Gilt 2035",isin:"GB00BTXS1K06",type:"conventional",coupon:4.75,maturity:"2035-10-22",dmoDate:"2026-10-16",tidm:"T35V",cleanPrice:96.21,yield:.05354,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4¼% Treasury Stock 2036",isin:"GB0032452392",type:"conventional",coupon:4.25,maturity:"2036-03-07",dmoDate:"2026-10-16",tidm:"T4Q",cleanPrice:92.34,yield:.05365,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 7/8% Treasury Gilt 2036",isin:"GB00BWBR1N39",type:"conventional",coupon:4.875,maturity:"2036-07-31",dmoDate:"2026-10-16",tidm:"T36N",cleanPrice:96.45,yield:.05416,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2036",isin:"GB00BYZW3J87",type:"il3",coupon:.125,maturity:"2036-11-22",dmoDate:"2026-10-16",tidm:"TG36",cleanPrice:83.13,yield:.01985,yieldKind:"real",baseRpi:260.01935,indexRatio:1.61708},{name:"4 5/8% Green Gilt 2037",isin:"GB00BVP99905",type:"conventional",coupon:4.625,maturity:"2037-03-07",dmoDate:"2026-10-16",tidm:"T37H",cleanPrice:93.96,yield:.05464,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1¾% Treasury Gilt 2037",isin:"GB00BZB26Y51",type:"conventional",coupon:1.75,maturity:"2037-09-07",dmoDate:"2026-10-16",tidm:"TG37",cleanPrice:70.11,yield:.05492,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1 1/8% Index-linked Treasury Gilt 2037",isin:"GB00B1L6W962",type:"il3",coupon:1.125,maturity:"2037-11-22",dmoDate:"2026-10-16",tidm:"TR37",cleanPrice:90.73,yield:.02074,yieldKind:"real",baseRpi:202.24286,indexRatio:2.07904},{name:"3¾% Treasury Gilt 2038",isin:"GB00BQC4R999",type:"conventional",coupon:3.75,maturity:"2038-01-29",dmoDate:"2026-10-16",tidm:"TG38",cleanPrice:85.71,yield:.05537,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1¾% Index-linked Treasury Gilt 2038",isin:"GB00BMY62Z61",type:"il3",coupon:1.75,maturity:"2038-09-22",dmoDate:"2026-10-16",tidm:"T38",cleanPrice:95.955,yield:.02147,yieldKind:"real",baseRpi:397.6,indexRatio:1.05752},{name:"4¾% Treasury Stock 2038",isin:"GB00B00NY175",type:"conventional",coupon:4.75,maturity:"2038-12-07",dmoDate:"2026-10-16",tidm:"TR38",cleanPrice:93.46,yield:.0557,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1 1/8% Treasury Gilt 2039",isin:"GB00BLPK7334",type:"conventional",coupon:1.125,maturity:"2039-01-31",dmoDate:"2026-10-16",tidm:"TR39",cleanPrice:61.29,yield:.05574,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2039",isin:"GB00BLH38265",type:"il3",coupon:.125,maturity:"2039-03-22",dmoDate:"2026-10-16",tidm:"TG39",cleanPrice:77.27,yield:.02241,yieldKind:"real",baseRpi:296.72581,indexRatio:1.41704},{name:"4¼% Treasury Gilt 2039",isin:"GB00B3KJDS62",type:"conventional",coupon:4.25,maturity:"2039-09-07",dmoDate:"2026-10-16",tidm:"T39",cleanPrice:88.21,yield:.05618,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 3/8% Treasury Gilt 2040",isin:"GB00BQC82D08",type:"conventional",coupon:4.375,maturity:"2040-01-31",dmoDate:"2026-10-16",tidm:"TG40",cleanPrice:88.79,yield:.05658,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 5/8% Index-linked Treasury Gilt 2040",isin:"GB00B3LZBF68",type:"il3",coupon:.625,maturity:"2040-03-22",dmoDate:"2026-10-16",tidm:"TR40",cleanPrice:80.98,yield:.02289,yieldKind:"real",baseRpi:216.52258,indexRatio:1.94193},{name:"4¼% Treasury Gilt 2040",isin:"GB00B6460505",type:"conventional",coupon:4.25,maturity:"2040-12-07",dmoDate:"2026-10-16",tidm:"T40",cleanPrice:87.03,yield:.05666,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"5¼% Treasury Gilt 2041",isin:"GB00BVP99897",type:"conventional",coupon:5.25,maturity:"2041-01-31",dmoDate:"2026-10-16",tidm:"T41F",cleanPrice:96.38,yield:.057,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2041",isin:"GB00BGDYHF49",type:"il3",coupon:.125,maturity:"2041-08-10",dmoDate:"2026-10-16",tidm:"T41",cleanPrice:72.76,yield:.02319,yieldKind:"real",baseRpi:280.05484,indexRatio:1.50139},{name:"1¼ % Treasury Gilt 2041",isin:"GB00BJQWYH73",type:"conventional",coupon:1.25,maturity:"2041-10-22",dmoDate:"2026-10-16",tidm:"TG41",cleanPrice:55.98,yield:.05712,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 5/8% Index-linked Treasury Gilt 2042",isin:"GB00B3MYD345",type:"il3",coupon:.625,maturity:"2042-11-22",dmoDate:"2026-10-16",tidm:"T42A",cleanPrice:76.775,yield:.02382,yieldKind:"real",baseRpi:212.46452,indexRatio:1.97902},{name:"4½% Treasury Gilt 2042",isin:"GB00B1VWPJ53",type:"conventional",coupon:4.5,maturity:"2042-12-07",dmoDate:"2026-10-16",tidm:"T42",cleanPrice:87.63,yield:.05761,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4¾% Treasury Gilt 2043",isin:"GB00BPJJKP77",type:"conventional",coupon:4.75,maturity:"2043-10-22",dmoDate:"2026-10-16",tidm:"TR43",cleanPrice:89.32,yield:.05824,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"3¼% Treasury Gilt 2044",isin:"GB00B84Z9V04",type:"conventional",coupon:3.25,maturity:"2044-01-22",dmoDate:"2026-10-16",tidm:"TG44",cleanPrice:72.77,yield:.05842,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2044",isin:"GB00B7RN0G65",type:"il3",coupon:.125,maturity:"2044-03-22",dmoDate:"2026-10-16",tidm:"T44",cleanPrice:67.05,yield:.02476,yieldKind:"real",baseRpi:242.42258,indexRatio:1.73445},{name:"3½% Treasury Gilt 2045",isin:"GB00BN65R313",type:"conventional",coupon:3.5,maturity:"2045-01-22",dmoDate:"2026-10-16",tidm:"T45",cleanPrice:74.54,yield:.05856,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 5/8% Index-linked Treasury Gilt 2045",isin:"GB00BMF9LH90",type:"il3",coupon:.625,maturity:"2045-03-22",dmoDate:"2026-10-16",tidm:"TR45",cleanPrice:72.725,yield:.02493,yieldKind:"real",baseRpi:363.94,indexRatio:1.15533},{name:"0 7/8% Treasury Gilt 2046",isin:"GB00BNNGP775",type:"conventional",coupon:.875,maturity:"2046-01-31",dmoDate:"2026-10-16",tidm:"TG46",cleanPrice:43.22,yield:.0589,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2046",isin:"GB00BYMWG366",type:"il3",coupon:.125,maturity:"2046-03-22",dmoDate:"2026-10-16",tidm:"TR46",cleanPrice:63.525,yield:.02524,yieldKind:"real",baseRpi:257.79,indexRatio:1.63106},{name:"4¼% Treasury Gilt 2046",isin:"GB00B128DP45",type:"conventional",coupon:4.25,maturity:"2046-12-07",dmoDate:"2026-10-16",tidm:"T46",cleanPrice:81.92,yield:.05864,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1½% Treasury Gilt 2047",isin:"GB00BDCHBW80",type:"conventional",coupon:1.5,maturity:"2047-07-22",dmoDate:"2026-10-16",tidm:"TG47",cleanPrice:48.275,yield:.05911,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0¾% Index-linked Treasury Gilt 2047",isin:"GB00B24FFM16",type:"il3",coupon:.75,maturity:"2047-11-22",dmoDate:"2026-10-16",tidm:"T47",cleanPrice:71.575,yield:.02506,yieldKind:"real",baseRpi:207.76667,indexRatio:2.02377},{name:"0 1/8% Index-linked Treasury Gilt 2048",isin:"GB00BZ13DV40",type:"il3",coupon:.125,maturity:"2048-08-10",dmoDate:"2026-10-16",tidm:"TG48",cleanPrice:60.1,yield:.02527,yieldKind:"real",baseRpi:274.79333,indexRatio:1.53014},{name:"1¾% Treasury Gilt 2049",isin:"GB00BFWFPP71",type:"conventional",coupon:1.75,maturity:"2049-01-22",dmoDate:"2026-10-16",tidm:"TG49",cleanPrice:49.52,yield:.05909,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1 7/8% Index-linked Treasury Gilt 2049",isin:"GB00BT7J0134",type:"il3",coupon:1.875,maturity:"2049-09-22",dmoDate:"2026-10-16",tidm:"TR49",cleanPrice:89.32,yield:.02504,yieldKind:"real",baseRpi:391.95806,indexRatio:1.07274},{name:"4¼% Treasury Gilt 2049",isin:"GB00B39R3707",type:"conventional",coupon:4.25,maturity:"2049-12-07",dmoDate:"2026-10-16",tidm:"T49",cleanPrice:80.45,yield:.05878,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0½% Index-linked Treasury Gilt 2050",isin:"GB00B421JZ66",type:"il3",coupon:.5,maturity:"2050-03-22",dmoDate:"2026-10-16",tidm:"TR50",cleanPrice:64.425,yield:.02535,yieldKind:"real",baseRpi:213.4,indexRatio:1.97034},{name:"0 5/8% Treasury Gilt 2050",isin:"GB00BMBL1F74",type:"conventional",coupon:.625,maturity:"2050-10-22",dmoDate:"2026-10-16",tidm:"TG50",cleanPrice:33.18,yield:.05915,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2051",isin:"GB00BNNGP882",type:"il3",coupon:.125,maturity:"2051-03-22",dmoDate:"2026-10-16",tidm:"TG51",cleanPrice:56.57,yield:.02531,yieldKind:"real",baseRpi:294.11071,indexRatio:1.42964},{name:"1¼% Treasury Gilt 2051",isin:"GB00BLH38158",type:"conventional",coupon:1.25,maturity:"2051-07-31",dmoDate:"2026-10-16",tidm:"T51A",cleanPrice:40.07,yield:.05953,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0¼% Index-linked Treasury Gilt 2052",isin:"GB00B73ZYW09",type:"il3",coupon:.25,maturity:"2052-03-22",dmoDate:"2026-10-16",tidm:"TG52",cleanPrice:57.72,yield:.02525,yieldKind:"real",baseRpi:242.05,indexRatio:1.73712},{name:"3¾% Treasury Gilt 2052",isin:"GB00B6RNH572",type:"conventional",coupon:3.75,maturity:"2052-07-22",dmoDate:"2026-10-16",tidm:"T52",cleanPrice:72.6,yield:.05899,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1½% Green Gilt 2053",isin:"GB00BM8Z2V59",type:"conventional",coupon:1.5,maturity:"2053-07-31",dmoDate:"2026-10-16",tidm:"TG53",cleanPrice:41.405,yield:.05949,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"3¾% Treasury Gilt 2053",isin:"GB00BPCJD997",type:"conventional",coupon:3.75,maturity:"2053-10-22",dmoDate:"2026-10-16",tidm:"T53",cleanPrice:71.74,yield:.05928,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 3/8% Treasury Gilt 2054",isin:"GB00BPSNBB36",type:"conventional",coupon:4.375,maturity:"2054-07-31",dmoDate:"2026-10-16",tidm:"T54",cleanPrice:79.91,yield:.05931,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1 5/8% Treasury Gilt 2054",isin:"GB00BJLR0J16",type:"conventional",coupon:1.625,maturity:"2054-10-22",dmoDate:"2026-10-16",tidm:"TR54",cleanPrice:42.305,yield:.05913,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1¼% Index-linked Treasury Gilt 2054",isin:"GB00BPSNBG80",type:"il3",coupon:1.25,maturity:"2054-11-22",dmoDate:"2026-10-16",tidm:"TG54",cleanPrice:75.3,yield:.0249,yieldKind:"real",baseRpi:378.58065,indexRatio:1.11065},{name:"1¼% Index-linked Treasury Gilt 2055",isin:"GB00B0CNHZ09",type:"il3",coupon:1.25,maturity:"2055-11-22",dmoDate:"2026-10-16",tidm:"TR8F",cleanPrice:75.07,yield:.02469,yieldKind:"real",baseRpi:192.2,indexRatio:2.18767},{name:"4¼% Treasury Gilt 2055",isin:"GB00B06YGN05",type:"conventional",coupon:4.25,maturity:"2055-12-07",dmoDate:"2026-10-16",tidm:"TR4Q",cleanPrice:78.25,yield:.0589,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"5 3/8% Treasury Gilt 2056",isin:"GB00BT7J0241",type:"conventional",coupon:5.375,maturity:"2056-01-31",dmoDate:"2026-10-16",tidm:"T56",cleanPrice:93.81,yield:.05902,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-Linked Treasury Gilt 2056",isin:"GB00BYVP4K94",type:"il3",coupon:.125,maturity:"2056-11-22",dmoDate:"2026-10-16",tidm:"TR56",cleanPrice:51.325,yield:.02422,yieldKind:"real",baseRpi:264.88333,indexRatio:1.58738},{name:"1¾% Treasury Gilt 2057",isin:"GB00BD0XH204",type:"conventional",coupon:1.75,maturity:"2057-07-22",dmoDate:"2026-10-16",tidm:"TG57",cleanPrice:42.24,yield:.05878,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2058",isin:"GB00BP9DLZ64",type:"il3",coupon:.125,maturity:"2058-03-22",dmoDate:"2026-10-16",tidm:"T58",cleanPrice:50.415,yield:.02386,yieldKind:"real",baseRpi:255.8871,indexRatio:1.64319},{name:"4% Treasury Gilt 2060",isin:"GB00B54QLM75",type:"conventional",coupon:4,maturity:"2060-01-22",dmoDate:"2026-10-16",tidm:"TR60",cleanPrice:74.01,yield:.05847,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0½% Treasury Gilt 2061",isin:"GB00BMBL1D50",type:"conventional",coupon:.5,maturity:"2061-10-22",dmoDate:"2026-10-16",tidm:"TG61",cleanPrice:22.735,yield:.05568,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 3/8% Index-linked Treasury Gilt 2062",isin:"GB00B4PTCY75",type:"il3",coupon:.375,maturity:"2062-03-22",dmoDate:"2026-10-16",tidm:"T62",cleanPrice:53.73,yield:.02301,yieldKind:"real",baseRpi:235.82903,indexRatio:1.78295},{name:"4% Treasury Gilt 2063",isin:"GB00BMF9LF76",type:"conventional",coupon:4,maturity:"2063-10-22",dmoDate:"2026-10-16",tidm:"TR63",cleanPrice:73.37,yield:.05826,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"2½% Treasury Gilt 2065",isin:"GB00BYYMZX75",type:"conventional",coupon:2.5,maturity:"2065-07-22",dmoDate:"2026-10-16",tidm:"TG65",cleanPrice:50.49,yield:.0575,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2065",isin:"GB00BD9MZZ71",type:"il3",coupon:.125,maturity:"2065-11-22",dmoDate:"2026-10-16",tidm:"TR65",cleanPrice:46.085,yield:.02194,yieldKind:"real",baseRpi:260.43448,indexRatio:1.6145},{name:"0 1/8% Index-linked Treasury Gilt 2068",isin:"GB00BDX8CX86",type:"il3",coupon:.125,maturity:"2068-03-22",dmoDate:"2026-10-16",tidm:"T68",cleanPrice:45.19,yield:.0213,yieldKind:"real",baseRpi:249.7,indexRatio:1.6839},{name:"3½% Treasury Gilt 2068",isin:"GB00BBJNQY21",type:"conventional",coupon:3.5,maturity:"2068-07-22",dmoDate:"2026-10-16",tidm:"TR68",cleanPrice:65.64,yield:.05731,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1 5/8% Treasury Gilt 2071",isin:"GB00BFMCN652",type:"conventional",coupon:1.625,maturity:"2071-10-22",dmoDate:"2026-10-16",tidm:"TG71",cleanPrice:36.37,yield:.05482,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2073",isin:"GB00BM8Z2W66",type:"il3",coupon:.125,maturity:"2073-03-22",dmoDate:"2026-10-16",tidm:"TG73",cleanPrice:47.6,yield:.018,yieldKind:"real",baseRpi:308.32,indexRatio:1.36375},{name:"1 1/8% Treasury Gilt 2073",isin:"GB00BLBDX619",type:"conventional",coupon:1.125,maturity:"2073-10-22",dmoDate:"2026-10-16",tidm:"TR73",cleanPrice:28.445,yield:.05297,yieldKind:"nominal",baseRpi:null,indexRatio:null}]},J=t=>Number.isFinite(+t)?+t:0,Ne=t=>String(t||"").toUpperCase().trim(),Gt=t=>"£"+Math.round(J(t)).toLocaleString("en-GB"),Og=t=>{const e=new Date(String(t).slice(0,10)+"T00:00:00Z");return Number.isNaN(e.getTime())?String(t):e.toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"})},Dg=.02,Ng=new Set(["CSH2","CASH","MMF","XSTR","ERNS","ERNX"]),xg=new Set((Array.isArray(Jn==null?void 0:Jn.gilts)?Jn.gilts:[]).map(t=>Ne(t&&t.tidm)).filter(Boolean));function Cg(t){const e=Ne(t);return xg.has(e)||/^T[RGNS]?\d{2}[A-Z]?$/.test(e)||/^GB00B/.test(e)}function xr(t,e){var s,r;if(+(e==null?void 0:e.firstTaxYear)>0)return+e.firstTaxYear;if(+((s=t.timing)==null?void 0:s.firstTaxYear)>0)return+t.timing.firstTaxYear;if(+((r=t.assumptions)==null?void 0:r.firstTaxYear)>0)return+t.assumptions.firstTaxYear;const n=[...Array.isArray(e==null?void 0:e.cashYears)?e.cashYears.map(i=>+i.Y):[],...Array.isArray(e==null?void 0:e.orders)?e.orders.flatMap(i=>Array.isArray(i.taxYears)?i.taxYears.map(Number):[]):[]].filter(i=>i>2e3);return n.length?Math.min(...n):null}function Do(t,e=new Date){var o,l,a;const n=t||{},s=(l=(o=n.strategy)==null?void 0:o.r)==null?void 0:l.plan,r=xr(n,s);if(!(r>0)||Ee(e)<r)return!1;const i=(a=n.timing)==null?void 0:a.startMonth;return typeof i=="string"&&/^\d{4}-\d{2}$/.test(i)?e.getFullYear()+"-"+String(e.getMonth()+1).padStart(2,"0")>=i:!0}function Lg(t,{today:e=new Date,params:n=null,runUpMonthly:s=0}={}){var c,u,d,p,m,g,f,v,I,S,y,h,b;const r=t||{},i=(u=(c=r.strategy)==null?void 0:c.r)==null?void 0:u.plan,o=Ee(e);if((d=r.strategy)!=null&&d.contract&&i&&Array.isArray(i.orders)){const A=xr(r,i),T=Do(r,e),w=V=>({key:"gilt:"+Ne(V.tidm||V.sedol||V.name),wrapper:"SIPP",kind:"gilt",label:V.name,ticker:Ne(V.tidm),sedol:V.sedol||null,matures:V.matures||null,units:Math.round(J(V.nominal)),cost:Math.round(J(V.cost)),pays:Math.round(J(V.pays)),taxYears:Array.isArray(V.taxYears)?V.taxYears.slice():[],cleanPrice:J(V.cleanPrice)||null,indexRatio:J(V.indexRatio)||null}),_=i.orders.filter(V=>J(V.pays)>0),P=V=>{const O=V.matures?Date.parse(V.matures):NaN;return Number.isFinite(O)?O<e.getTime():Array.isArray(V.taxYears)&&V.taxYears.length>0&&V.taxYears.every(re=>+re<o)},E=n&&n.borrowedFloor||((m=(p=r.strategy)==null?void 0:p.params)==null?void 0:m.borrowedFloor)||((g=r.rotation)==null?void 0:g.borrowedFloor)||null,R=new Set(E&&Array.isArray(E.tidms)?E.tidms.map(Ne).filter(Boolean):[]),D=V=>R.has(Ne(V.tidm)),k=_.filter(V=>!D(V)),M=k.filter(V=>!P(V)).map(w),x=k.filter(P).map(w),F=_.filter(D).map(w),he=!!E,ae=Array.isArray(i.cashYears)?i.cashYears:[],be=ae.filter(V=>+V.Y>=o).map(V=>+V.Y),q=Math.max(0,J(((f=r.assumptions)==null?void 0:f.bridgeCash)??((I=(v=r.strategy)==null?void 0:v.params)==null?void 0:I.bridgeCash))),se=ae.reduce((V,O)=>V+J(O.cost),0),le=se>0?se:Math.max(0,J(i.cash)-q);let it=Math.round(le),Se={months:0,monthly:0,value:0};if(!T&&q>0){const V=Array.isArray(r.timeline)&&r.timeline[0]?r.timeline[0]:null,O=J(s)>0?J(s):V?Math.max(0,(J(V.gross)-J(V.sp)-J(V.other))/12):0,re=Date.UTC(A||o+1,3,6),Re=Math.max(0,Math.round((re-e.getTime())/(30.44*864e5)));Se={months:Re,monthly:Math.round(O),value:Math.round(Math.min(q,O*Re))},it+=Se.value}T&&(Array.isArray(i.years)&&i.years.length?it=Math.round(i.years.filter(V=>V.from==="cash"&&+V.Y>=o).reduce((V,O)=>V+J(O.need),0)):ae.length&&(it=Math.round(le*be.length/ae.length)));const hn=[];Se.value>0&&hn.push({label:"Run-up: "+Se.months+" month"+(Se.months===1?"":"s")+" × "+Gt(Se.monthly)+" until the ladder pays",amount:Se.value});for(const V of ae){if(T&&+V.Y<o)continue;const O=Array.isArray(r.timeline)?r.timeline.find(Re=>Re&&H(+V.Y)===Re.taxYear):null,re=O&&J(O.lump)>0?J(O.lump):0;hn.push({label:"Cash year "+H(+V.Y)+(re>0?" ("+Gt(re)+" of it paid by a lump sum expected that year)":""),amount:Math.round(J(V.cost))})}const fn={key:"cash:SIPP",wrapper:"SIPP",kind:"cash",label:"Money-market fund / cash (e.g. CSH2)",value:it,runUp:Se,breakdown:hn,spending:T,yearsLeft:T?be:ae.map(V=>+V.Y),bridgeCash:Math.round(q)};let Ft="The ladder is bought in the SIPP. The ISA is "+(((S=r.pots)==null?void 0:S.isaPolicy)==="hold"?"held aside and not part of the ladder.":"drawn by its own policy and not part of the ladder.");return q>0&&!T&&(Ft+=Se.value>0?" The run-up is paid from the same cash: "+Se.months+" month"+(Se.months===1?"":"s")+" at about "+Gt(Se.monthly)+" are still to come, so "+Gt(Se.value)+" of the "+Gt(q)+" set aside is in the target; the rest has been spent as designed.":" The "+Gt(q)+" of bridge cash for the run-up has been spent as designed, so it is no longer a target."),T&&(Ft+=" The plan is running (tax year "+H(o)+")"+(x.length?": "+x.length+" rung"+(x.length===1?" has":"s have")+" matured and paid, so "+(x.length===1?"it is":"they are")+" no longer targets":"")+"; the cash years' money is being spent as designed, so cash is reported, not diffed."),F.length&&(Ft+=" The rotation fired"+(E.soldAt?" on "+Og(E.soldAt):"")+": "+F.length+" rung"+(F.length===1?" was":"s were")+" sold and the proceeds bought the equity fund, so "+(F.length===1?"it is no longer a target":"they are no longer targets")+" and the fund is kept."),{kind:"ladder",lines:M,paid:x,sold:F,rotated:he,cash:fn,running:T,thisTaxYear:o,firstTaxYear:A,note:Ft}}const l=Array.isArray(r.targetMix)&&r.targetMix.length?r.targetMix[0]:null,a=J((h=(y=r.pots)==null?void 0:y.potAtRetirement)==null?void 0:h.sipp)>0?J(r.pots.potAtRetirement.sipp):J((b=r.pots)==null?void 0:b.sipp);return l&&a>0?{kind:"buckets",lines:[{key:"bucket:shares",wrapper:"SIPP",kind:"bucket",bucket:"shares",label:"Shares (world tracker)",value:Math.round(a*l.equity/100),pct:l.equity},{key:"bucket:bonds",wrapper:"SIPP",kind:"bucket",bucket:"bonds",label:"Bonds (gilts / index-linked / global agg)",value:Math.round(a*l.bond/100),pct:l.bond},{key:"bucket:cash",wrapper:"SIPP",kind:"bucket",bucket:"cash",label:"Cash (money-market fund)",value:Math.round(a*l.cash/100),pct:l.cash}],paid:[],sold:[],rotated:!1,cash:null,running:Do(r,e),thisTaxYear:o,firstTaxYear:xr(r,null),note:`A pot strategy: the target is a mix, not a list of funds. Any world tracker, gilt fund or money-market fund fills its bucket; the Stress tester's "Example funds" shows one way.`}:{kind:"none",lines:[],paid:[],sold:[],rotated:!1,cash:null,running:!1,thisTaxYear:o,firstTaxYear:null,note:"No plan document yet — lock the plan first."}}function Vg(t){const e=(t||[]).filter(s=>s&&(J(s.value)>0||J(s.units)>0)),n=vs(e.map(s=>({...s,value:J(s.value)})));return e.map(s=>{const r=Ne(s.ticker),i=Cg(r)||s.kind==="gilt",o=Ng.has(r)||Ne(s.wrapper)==="CASH"||s.kind==="cash"||s.subClass==="cash"||s.subClass==="moneyMarket",l=n.tagged.find(a=>a.ticker===s.ticker&&a.wrapper===s.wrapper&&Math.abs(J(a.value)-J(s.value))<1);return{ticker:r,name:s.name||"",sedol:s.sedol||null,wrapper:Ne(s.wrapper)||"SIPP",value:J(s.value),units:J(s.units)||null,gilt:i,cash:o,bucket:o?"cash":i?"bonds":l?l.bucket:s.subClass?"shares":null}})}function Bg(t,e,{tolerance:n=Dg}={}){const s=Vg(t),r=s.filter(A=>A.wrapper==="SIPP"),i=A=>A.wrapper==="ISA"?"ISA — kept as it is":A.wrapper==="CASH"?"bank / savings cash — outside the pension, kept as it is":"taxable account — kept as it is",o=[],l=[],a=[],c=[],u=[],d=s.filter(A=>A.wrapper!=="SIPP").map(A=>({...A,why:i(A)}));let p=0,m=0,g=0,f=0,v=0,I=null;if(e.kind==="ladder"){const A=new Set,T=k=>{const M=String(k||"").match(/(20\d{2})/);if(M)return+M[1];const x=String(k||"").match(/^T[RGNS]?(\d{2})[A-Z]?$/i);return x?2e3+ +x[1]:null},w=(k,M)=>k.ticker&&M.ticker&&k.ticker===M.ticker||M.sedol&&(Ne(k.sedol)===Ne(M.sedol)||Ne(k.name).includes(Ne(M.sedol))),_=(k,M,x)=>k.ticker&&k.ticker.length>=3&&M.label&&Ne(M.label).includes(k.ticker)||x&&(T(k.name)===x||T(k.ticker)===x),P=[...e.paid||[],...e.sold||[],...e.lines],E=new Map,R=(k,M)=>{const x=r.filter(F=>!A.has(F)&&F.gilt&&M(F));x.forEach(F=>A.add(F)),E.set(k,x)};for(const k of P)R(k,M=>w(M,k));for(const k of P)if(!E.get(k).length){const M=T(k.matures)||T(k.label)||T(k.ticker);R(k,x=>_(x,k,M))}const D=k=>E.get(k)||[];for(const k of e.paid||[])for(const M of D(k))c.push({...M,key:"matured:"+(M.ticker||k.ticker),label:M.name||M.ticker||k.label,rung:k.label,why:"matured and paid"+(k.taxYears.length?" in "+k.taxYears.map(H).join(", "):"")+" — remove it from your record"});for(const k of e.sold||[])for(const M of D(k))u.push({...M,key:"sold:"+(M.ticker||k.ticker),label:M.name||M.ticker||k.label,rung:k.label,why:"sold by the rotation — remove it from your record"});for(const k of e.lines){const M=D(k),x=k.cleanPrice&&k.indexRatio?k.cleanPrice*k.indexRatio/100:k.units>0?k.cost/k.units:null,F=M.reduce((ae,be)=>ae+(be.units!=null?be.units:x?be.value/x:0),0),he=k.units-F;p+=k.cost,m+=Math.min(k.cost,x?F*x:0),g++,k.units>0&&Math.abs(he)<=n*k.units?a.push({...k,heldUnits:Math.round(F)}):he>0?o.push({...k,units:Math.round(he),amount:Math.round(x?he*x:k.cost*(he/k.units)),heldUnits:Math.round(F),why:"rung for "+k.taxYears.map(H).join(", ")}):l.push({...k,units:Math.round(-he),amount:Math.round(x?-he*x:0),heldUnits:Math.round(F),why:"more than the rung needs"})}f=r.filter(k=>k.cash).reduce((k,M)=>k+M.value,0),v=e.cash?e.cash.value:0,e.cash&&e.cash.spending?I={held:Math.round(f),target:Math.round(v),yearsLeft:Array.isArray(e.cash.yearsLeft)?e.cash.yearsLeft.slice():[]}:e.cash&&(p+=v,m+=Math.min(v,f),v>0&&g++,v>0&&f>=v*(1-n)?a.push({...e.cash,heldValue:Math.round(f),spare:Math.round(Math.max(0,f-v))}):v>f&&o.push({...e.cash,amount:Math.round(v-f),heldValue:Math.round(f),why:"the cash years"}));for(const k of r)!A.has(k)&&!k.cash&&(e.rotated&&!k.gilt?d.push({...k,why:"bought by the rotation — kept"}):l.push({key:"sell:"+(k.ticker||k.name),wrapper:"SIPP",kind:k.gilt?"gilt":"fund",label:k.name||k.ticker,ticker:k.ticker,amount:Math.round(k.value),units:k.units,why:"not in the plan — proceeds fund the ladder"}))}else if(e.kind==="buckets"){const A={shares:0,bonds:0,cash:0,diversifiers:0};for(const T of r)A[T.bucket||"shares"]+=T.value;f=A.cash;for(const T of e.lines){const w=A[T.bucket]||0,_=T.value-w;p+=T.value,m+=Math.min(T.value,w),T.value>0&&g++,T.bucket==="cash"&&(v=T.value),T.value>0&&Math.abs(_)<=n*T.value?a.push({...T,heldValue:Math.round(w)}):_>0?o.push({...T,amount:Math.round(_),heldValue:Math.round(w),why:"bring "+T.bucket+" up to "+T.pct+"% of the pot"}):(T.value>0||w>0)&&l.push({...T,amount:Math.round(-_),heldValue:Math.round(w),why:"bring "+T.bucket+" down to "+T.pct+"% of the pot"})}A.diversifiers>0&&l.push({key:"bucket:diversifiers",wrapper:"SIPP",kind:"bucket",bucket:"diversifiers",label:"Diversifiers",amount:Math.round(A.diversifiers),why:"not in the target mix"})}const S=o.reduce((A,T)=>A+J(T.amount),0),y=l.reduce((A,T)=>A+J(T.amount),0);let h=!1,b;return e.kind==="none"?b="no plan document to read against":o.length?b=o.length+" line"+(o.length===1?"":"s")+" still to buy":l.length?b=l.length+" line"+(l.length===1?"":"s")+" to sell":a.length<g?b=g-a.length+" target line"+(g-a.length===1?"":"s")+" not held":g===0?(h=!0,b=e.kind==="ladder"?"every rung has matured and paid — nothing left to hold":"the target is empty"):(h=!0,b=e.kind==="ladder"?"every rung the plan still needs is held"+(e.cash&&!e.cash.spending?", and the cash years are covered":""):"every bucket is within "+Math.round(n*100)+"% of its target"),{kind:e.kind,buy:o,sell:l,hold:a,keep:d,matured:c,sold:u,cashInfo:I,totals:{buyCost:Math.round(S),sellValue:Math.round(y),shortfall:Math.round(Math.max(0,S-y)),cashHeld:Math.round(f),cashTarget:Math.round(v)},progressPct:p>0?Math.round(100*m/p):h?100:0,complete:h,reason:b}}function Fg(t,e={}){const n=[...t.buy.map(i=>({...i,action:"buy"})),...t.sell.map(i=>({...i,action:"sell"}))],s=n.filter(i=>!e[i.key]),r=n.length-s.length;return{pct:n.length?Math.round(100*(t.progressPct/100*0+(n.length-s.length)/n.length)):100,held:t.progressPct,doneCount:r,total:n.length,next:s[0]||null}}function Ug(){return{settings:{equityMin:ye.EQUITY_MIN,bondMin:ye.BOND_MIN,cashTarget:ye.CASH_TARGET,duration:ye.DURATION_YEARS,baseSalary:ye.BASE_SALARY,other:0,statePension:12e3,statePensionYear:12,pa:ue.PERSONAL_ALLOWANCE,brl:ue.BASIC_RATE_LIMIT,hrl:ue.HIGHER_RATE_LIMIT,taxMode:"inflates",protectionMult:je.PROTECTION_MULTIPLIER,consecutiveLimit:ye.CONSECUTIVE_LIMIT,disableProtection:!1,hodlEnabled:je.HODL_ENABLED,hodlValue:je.HODL_VALUE,spendingProfile:"flat",equityGlideEnabled:!1,diversifierStart:0,taggedFunds:[]},lastModified:null,checksum:null}}function Gg(t,e=new Date){const n={...Ug()};t.settings&&(n.settings={...n.settings,...t.settings},t.settings.pacwMin!==void 0&&t.settings.equityMin===void 0&&(n.settings.equityMin=t.settings.pacwMin),t.settings.cgtMin!==void 0&&t.settings.bondMin===void 0&&(n.settings.bondMin=t.settings.cgtMin),t.settings.csh2Target!==void 0&&t.settings.cashTarget===void 0&&(n.settings.cashTarget=t.settings.csh2Target),n.settings.hodlEnabled===void 0&&(n.settings.hodlEnabled=!1),n.settings.hodlValue===void 0&&(n.settings.hodlValue=25e3));const s=n.settings;if(s.spendingProfile==="declining"){const r=+s.shapeAgeNow||57,i=s.incomeShape==="phases"&&Array.isArray(s.incomeSteps)&&s.incomeSteps.length?s.incomeSteps:[{fromAge:r,amount:+s.baseSalary||0}];s.incomeShape="phases",s.incomeSteps=Pc(i,r),s.shapeAgeNow=r,s.targetSchedule=Rc(s,r),s.spendingProfile="flat",s.spendingMigratedFrom="declining"}return n.settings=jm(n.settings,t.budget||null,e),n.lastModified=t.lastModified,n.checksum=t.checksum,n}const Yg=t=>t===void 0?void 0:JSON.parse(JSON.stringify(t)),$g=t=>!!(t&&t.decisionTool&&sn(t.decisionTool.settings));function jg(t){const e=t&&t.stressTool&&t.stressTool.settings;return e&&typeof e=="object"?Yg(e):t&&!$g(t)?{...Rr(),chargesPct:pa,isaGrowth:ma}:Rr()}function $s(t,{now:e=new Date}={}){const n=jg(t),s=t&&t.budgetTool&&t.budgetTool.settings||kc();return s&&Ec(s)&&+s.currentAge>(+n.currentAge||0)&&(n.currentAge=+s.currentAge,n.currentAgeAsOf=s.currentAgeAsOf||n.currentAgeAsOf||null),Gg({settings:n,budget:s||null,lastModified:null,checksum:null},e).settings}function Kg(t,{now:e=new Date}={}){const n=t||{},s=$s(n,{now:e});return dg({...n,stressTool:{...n.stressTool||{},settings:s}},e)}function Wg(t=new Date){return t.getFullYear()+"-"+String(t.getMonth()+1).padStart(2,"0")}function js(t,e=500){return(Array.isArray(t&&t.decisionTool&&t.decisionTool.history)?t.decisionTool.history:[]).filter(s=>s&&typeof s=="object").slice().sort((s,r)=>String(s.date||"").localeCompare(String(r.date||""))).slice(-e)}function Ql(t,{now:e=new Date}={}){const n=t||{},s=n.planDocument||null,r=js(n);let i=null;if(s&&s.strategy&&s.strategy.contract){const c=Oo(s,s.strategy.id||null);i=c?Rg(c,{today:e}):null}const o=s&&s.accumulation&&Array.isArray(n.accumulationTool&&n.accumulationTool.history)?n.accumulationTool.history:[],l=un(n.holdings),a=n.decisionTool&&n.decisionTool.taxYears||null;return{today:e,history:r,ladderPos:i,accHistory:o,holdings:l,taxYears:a,ladderInDocument:!!(s&&Oo(s,s.strategy&&s.strategy.id||null))}}function Hg(t,{now:e=new Date}={}){const n=t&&t.planDocument;if(!n)return null;const{ladderInDocument:s,...r}=Ql(t,{now:e});return kg(n,r)}function qg(t,{now:e=new Date}={}){const n=t||{},s=n.planDocument||null;if(!s)return null;const r=$s(n,{now:e});let i=0;const o=bi(Ee(e)),l=n.decisionTool&&n.decisionTool.taxYears&&n.decisionTool.taxYears[o];if(i=+(l&&l.expectedMonthly&&l.expectedMonthly.sipp&&l.expectedMonthly.sipp.gross)||0,!i){const m=js(n),g=m.length?m[m.length-1]:null;i=g&&(+g.sippDraw||+g.sipp)||0}const a=Lg(s,{today:e,params:r.strategyParams||null,runUpMonthly:i}),c=un(n.holdings),u=Bg(c.lines||[],a),d=n.transition&&n.transition.done||{},p=Fg(u,d);return{target:a,diff:u,prog:p}}const No=Object.freeze({unknown:["plan","budget","hold","household"],saving:["saving","pot","plan","budget","lock","hold","household"],approaching:["plan","saving","pot","budget","lock","hold","move","household"],"committed-saving":["pot","where","plan","saving","budget","hold","move","household"],"draft-retired":["plan","budget","lock","hold","move","household"],bridge:["month","where","plan","hold","move","budget","household"],running:["month","where","plan","hold","move","budget","household"]}),zg=Object.freeze(["pot","budget","lock","hold","move","household"]),Jg=Object.freeze(["month","where","plan","pot","saving","budget","lock","hold","move","household"]),xo=Object.freeze(["draft-retired","bridge","running"]),Xl=Object.freeze(["saving","approaching","committed-saving"]),Qg=Object.freeze(["P.readonly","P.noAge","P.arrive","P.taxyear","P.month","P.idle","P.pot","P.working","P.recheck","P.stale","P.draft","P.approaching","P.saving"]),Xg=Object.freeze({plan:Object.freeze(["about","income","spend","pots"])});function Zg(t,e){return Zl(t,e).flatMap(n=>(Xg[n.id]||[]).map(s=>({id:s,under:n.id})))}function Zl(t,{locked:e,linked:n,manyPlans:s}){return(No[t]||No.unknown).filter(i=>!(i==="lock"&&e)&&!(i==="household"&&!n&&!s)).map(i=>({id:i,optional:zg.includes(i)&&!(i==="pot"&&t==="committed-saving")}))}const z=t=>t==null||t===""||!Number.isFinite(+t)?null:+t,at=t=>Array.isArray(t)?t.filter(e=>e&&typeof e=="object"):[],xe=(t,e)=>({k:t,v:Math.round(z(e)||0),kind:"money"}),Fe=(t,e)=>({k:t,v:Math.round(z(e)||0),kind:"count"}),lr=(t,e)=>({k:t,v:Math.round((z(e)||0)*100)/100,kind:"pct"}),Ue=(t,e)=>({k:t,v:!!e,kind:"yesNo"}),Et=(t,e)=>({k:t,v:String(e),kind:"choice"}),gn=(t,e)=>({k:t,v:String(e),kind:"text"}),ey=["January","February","March","April","May","June","July","August","September","October","November","December"],ty=t=>{const e=/^(\d{4})-(\d{2})-(\d{2})/.exec(String(t||""));return e&&+e[2]>=1&&+e[2]<=12?+e[3]+" "+ey[+e[2]-1]+" "+e[1]:String(t||"")},cr=(t,e)=>gn(t,ty(e)),ny=Object.freeze([{id:"inc.streams",keys:["stress.extraIncomes"],set:t=>at(t.extraIncomes).some(e=>z(e.annual)>0),facts:t=>at(t.extraIncomes).filter(e=>z(e.annual)>0).flatMap((e,n)=>[xe("annual"+n,e.annual),Fe("fromAge"+n,e.fromAge),Fe("years"+n,e.years)])},{id:"inc.lump-sums",keys:["stress.windfalls","decision.windfalls"],set:t=>at(t.windfalls).some(e=>z(e.amount)>0),facts:t=>at(t.windfalls).filter(e=>z(e.amount)>0).flatMap((e,n)=>[xe("amount"+n,e.amount),Fe("atAge"+n,e.atAge??e.fromAge??e.age)])},{id:"inc.extra-spends",keys:["stress.extraWithdrawals"],set:t=>at(t.extraWithdrawals).some(e=>z(e.amount)>0),facts:t=>at(t.extraWithdrawals).filter(e=>z(e.amount)>0).flatMap((e,n)=>[xe("amount"+n,e.amount),Fe("atAge"+n,e.atAge??e.fromAge??e.age),Fe("years"+n,e.years??1)])},{id:"inc.final-salary-rises",keys:["stress.dbIndexation"],set:t=>z(t.dbAmount)>0&&!!t.dbIndexation&&t.dbIndexation!=="cpi",facts:t=>[Et("rises",t.dbIndexation||"cpi")]},{id:"inc.state-pension-old",keys:["stress.statePension","stress.statePensionYear","decision.statePension","decision.statePensionYear"],set:t=>!t.spStartDate&&z(t.statePension)>0,facts:t=>[xe("yearly",t.statePension),Fe("fromYear",t.statePensionYear)]},{id:"tax.bands",keys:["stress.pa","stress.brl","stress.hrl"],set:t=>(z(t.pa)??ue.PERSONAL_ALLOWANCE)!==ue.PERSONAL_ALLOWANCE||(z(t.brl)??ue.BASIC_RATE_LIMIT)!==ue.BASIC_RATE_LIMIT||(z(t.hrl)??ue.HIGHER_RATE_LIMIT)!==ue.HIGHER_RATE_LIMIT,facts:t=>[xe("pa",t.pa??ue.PERSONAL_ALLOWANCE),xe("brl",t.brl??ue.BASIC_RATE_LIMIT),xe("hrl",t.hrl??ue.HIGHER_RATE_LIMIT)]},{id:"tax.mode",keys:["stress.taxMode"],set:t=>!!t.taxMode&&t.taxMode!=="inflates",facts:t=>[Et("mode",t.taxMode||"inflates")]},{id:"tax.tax-free-cash",keys:["stress.accessMethod","decision.accessMethod"],set:(t,e)=>!!(t.accessMethod||e.accessMethod)&&(t.accessMethod||e.accessMethod)!=="drawdown",facts:(t,e)=>[Et("how",t.accessMethod||e.accessMethod||"drawdown")]},{id:"tax.ufpls-years",keys:["stress.ufplsYears","stress.ufplsThenPcls","decision.ufplsYears","decision.ufplsThenPcls"],set:(t,e)=>z(t.ufplsYears??e.ufplsYears)>0,facts:(t,e)=>[Fe("years",t.ufplsYears??e.ufplsYears),Ue("thenRest",t.ufplsThenPcls??e.ufplsThenPcls)]},{id:"tax.band-fill",keys:["stress.bandFillRecycle","decision.bandFillRecycle"],set:(t,e)=>!!(t.bandFillRecycle??e.bandFillRecycle),facts:(t,e)=>[Ue("on",t.bandFillRecycle??e.bandFillRecycle)]},{id:"tax.bed-and-isa",keys:["stress.bedAndIsa","decision.bedAndIsa"],set:(t,e)=>!!(t.bedAndIsa??e.bedAndIsa),facts:(t,e)=>[Ue("on",t.bedAndIsa??e.bedAndIsa)]},{id:"tax.earnings",keys:["stress.relevantEarnings","decision.relevantEarnings"],set:(t,e)=>z(t.relevantEarnings??e.relevantEarnings)>0,facts:(t,e)=>[xe("yearly",t.relevantEarnings??e.relevantEarnings)]},{id:"prot.cuts",keys:["stress.consecutiveLimit","stress.protectionMult","stress.protectionEscalateMonths","stress.recoveryBuffer","stress.disableProtection","decision.consecutiveLimit","decision.protectionFactor","decision.protectionEscalateMonths","decision.recoveryBuffer","decision.disableProtection"],set:t=>!!t.disableProtection||(z(t.consecutiveLimit)??ye.CONSECUTIVE_LIMIT)!==ye.CONSECUTIVE_LIMIT||(z(t.protectionMult)??je.PROTECTION_MULTIPLIER)!==je.PROTECTION_MULTIPLIER||(z(t.recoveryBuffer)??ye.RECOVERY_BUFFER)!==ye.RECOVERY_BUFFER||z(t.protectionEscalateMonths)>0,facts:t=>[Ue("off",!!t.disableProtection),Fe("after",t.consecutiveLimit??ye.CONSECUTIVE_LIMIT),lr("cutTo",(z(t.protectionMult)??je.PROTECTION_MULTIPLIER)*100),Fe("deeperAfter",t.protectionEscalateMonths??0),xe("buffer",t.recoveryBuffer??ye.RECOVERY_BUFFER)]},{id:"prot.reserve",keys:["stress.hodlEnabled","stress.hodlValue"],set:t=>!!t.hodlEnabled,facts:t=>[Ue("on",!!t.hodlEnabled),xe("amount",t.hodlValue??je.HODL_VALUE)]},{id:"pots.diversifiers",keys:["stress.diversifierStart","decision.diversifierStart"],set:t=>z(t.diversifierStart)>0,facts:t=>[xe("amount",t.diversifierStart)]},{id:"pots.bond-tent",keys:["stress.equityGlideEnabled","decision.equityGlideEnabled","stress.glideEndgame","decision.glideEndgame"],set:t=>!!t.equityGlideEnabled,facts:t=>[Ue("on",!!t.equityGlideEnabled),Et("endgame",t.glideEndgame||"hold")]},{id:"pots.isa-use",keys:["stress.isaDrawdownStrategy","decision.isaDrawdownStrategy"],set:t=>!!t.isaDrawdownStrategy&&t.isaDrawdownStrategy!==mt.DRAWDOWN_STRATEGY,facts:t=>[Et("use",t.isaDrawdownStrategy||mt.DRAWDOWN_STRATEGY)]},{id:"pots.isa-growth",keys:["stress.isaGrowth","stress.isaReturn","stress.isaMin","decision.isaReturn","decision.isaMin"],set:t=>t.isaGrowth==="invested"||z(t.isaMin)>0,facts:t=>[Et("grows",t.isaGrowth==="invested"?"invested":t.isaGrowth==="cash"?"cash":"fixed"),lr("fixedRate",(z(t.isaReturn)??mt.RETURN)*100),xe("floor",t.isaMin??0)]},{id:"pots.charges",keys:["stress.chargesPct"],set:t=>z(t.chargesPct)!=null&&z(t.chargesPct)!==.5,facts:t=>[lr("yearly",z(t.chargesPct)??0)]},{id:"pots.funds-to-test",keys:["stress.taggedFunds","decision.taggedFunds","stress.subAsset","decision.subAsset"],set:t=>at(t.taggedFunds).some(e=>z(e.value)>0),facts:t=>at(t.taggedFunds).filter(e=>z(e.value)>0).flatMap((e,n)=>[gn("name"+n,e.name||e.ticker||""),xe("value"+n,e.value)])},{id:"draw.cadence",keys:[],set:(t,e,n)=>{const s=n&&n.decisionTool&&(n.decisionTool.cadence||n.decisionTool.settings&&n.decisionTool.settings.cadence);return!!s&&s!=="monthly"},facts:(t,e,n)=>[Et("how",n&&n.decisionTool&&(n.decisionTool.cadence||n.decisionTool.settings&&n.decisionTool.settings.cadence)||"monthly")]},{id:"timing.stale-draft",keys:["stress.staleDraftDismissedFor"],set:t=>z(t.staleDraftDismissedFor)>0,facts:t=>[Fe("year",t.staleDraftDismissedFor)]},{id:"lock.lock",keys:["decision.locked","decision.lockedAt","decision.lockedBy"],set:(t,e)=>!!e.locked,facts:(t,e)=>[Ue("locked",!!e.locked),cr("at",e.lockedAt||""),gn("by",e.lockedBy||"")]},{id:"lock.unlock",keys:["decision.unlockedAt","decision.unlockCount"],set:(t,e)=>z(e.unlockCount)>0,facts:(t,e)=>[Fe("times",e.unlockCount??0),cr("last",e.unlockedAt||"")]},{id:"month.seeded",keys:["decision.seededFrom"],set:(t,e)=>!!e.seededFrom,facts:(t,e)=>[gn("from",e.seededFrom||"")]},{id:"mach.configured",keys:["stress.configured","decision.configured"],set:()=>!1,facts:(t,e)=>[Ue("stress",!!t.configured),Ue("decision",!!e.configured)]},{id:"mach.declining",keys:["stress.spendingProfile","decision.spendingProfile","stress.spendingMigratedFrom","decision.spendingMigratedFrom"],set:t=>t.spendingMigratedFrom==="declining",facts:t=>[Ue("folded",t.spendingMigratedFrom==="declining")]},{id:"mach.old-names",keys:["stress.pacwMin","stress.cgtMin","stress.csh2Target"],set:()=>!1,facts:t=>[Ue("present",t.pacwMin!==void 0||t.cgtMin!==void 0||t.csh2Target!==void 0)]},{id:"mach.risk-mode",keys:["stress.riskMode"],set:()=>!1,facts:t=>[gn("mode",t.riskMode||"")]},{id:"mach.start-date",keys:["decision.startDate"],set:()=>!1,facts:(t,e)=>[cr("date",e.startDate||"")]}]);function Co(t,e,n,{all:s=!1}={}){const r=t||{},i=e||{},o=[];for(const l of ny){let a=!1,c=[];try{a=!!l.set(r,i,n)}catch{a=!1}if(!(!a&&!s)){try{c=l.facts(r,i,n).filter(u=>u&&(u.kind==="text"||u.kind==="choice"?typeof u.v=="string":!0))}catch{c=[]}o.push({id:l.id,set:a,facts:c})}}return o}const Lo={55:{m:[84,91,96],f:[87,93,97]},60:{m:[85,91,96],f:[87,93,97]},65:{m:[85,92,96],f:[88,93,98]},70:{m:[86,92,96],f:[88,94,98]},75:{m:[87,92,97],f:[89,94,98]}},sy={50:0,25:1,10:2};function ry(t,e="m",n=10){const s=sy[n]??2,r=e==="f"?"f":"m",i=Math.max(55,Math.min(75,t||65)),o=Math.floor(i/5)*5,l=Math.min(75,o+5),a=Lo[o][r][s],c=Lo[l][r][s],u=l===o?0:(i-o)/(l-o);return Math.round(a+(c-a)*u)}const $n=["January","February","March","April","May","June","July","August","September","October","November","December"];function kt(t){const e=/^(\d{4})-(\d{2})-(\d{2})$/.exec(String(t||""));if(!e)throw new Error("planRead needs today as YYYY-MM-DD");return new Date(+e[1],+e[2]-1,+e[3],12,0,0,0)}const Ks=t=>{const e=/^(\d{4})-(\d{2})/.exec(String(t||""));return e?{y:+e[1],m:+e[2]}:null},de=t=>{const e=Ks(t);return e&&e.m>=1&&e.m<=12?$n[e.m-1]+" "+e.y:""},Qt=t=>{const e=Ks(t);return e&&e.m>=1&&e.m<=12?$n[e.m-1]:""},ee=t=>{const e=/^(\d{4})-(\d{2})-(\d{2})/.exec(String(t||""));return e&&+e[2]>=1&&+e[2]<=12?+e[3]+" "+$n[+e[2]-1]+" "+e[1]:de(t)},iy=(t,e)=>(e.y-t.y)*12+(e.m-t.m),Cr=t=>String(t).padStart(2,"0"),ec=t=>t.getFullYear()+"-"+Cr(t.getMonth()+1)+"-"+Cr(t.getDate()),oy=t=>t.getFullYear()+"-"+Cr(t.getMonth()+1),me=t=>!!t&&typeof t=="object"&&!Array.isArray(t);function tc(t){const e=(n,s)=>n==null||n===""||!Number.isFinite(+n)||+n<=0?s:+n;return{pa:e(t&&t.pa,Js.pa),brl:e(t&&t.brl,Js.brl),hrl:e(t&&t.hrl,Js.hrl)}}const He=(t,e)=>Oc(Math.max(0,+t||0),e.pa,e.brl,e.hrl),wt=(t,e)=>Mc(Math.max(0,+t||0),e);function ay(t){const e=t&&t.incomeShape==="phases"?Rs(t.incomeSteps):[];return e.length?+e[0].amount:Array.isArray(t&&t.targetSchedule)&&t.targetSchedule.length?+t.targetSchedule[0]||0:+(t&&t.baseSalary)||0}const Y=t=>t==null||t===""||!Number.isFinite(+t)?null:+t,Ht=t=>t==null||typeof t=="string"&&t.trim()==="",ly=t=>!!(t&&t.decisionTool&&t.decisionTool.settings&&t.decisionTool.settings.locked),Vo=t=>t&&t.decisionTool&&t.decisionTool.settings&&t.decisionTool.settings.lockedAt||t&&t.planDocument&&t.planDocument.lockedAt||null,Bo=t=>t&&t.planDetails&&typeof t.planDetails.name=="string"&&t.planDetails.name||t&&typeof t.name=="string"&&t.name||"",Fo=t=>t&&t.household&&typeof t.household.partnerScenarioId=="string"&&t.household.partnerScenarioId||null,Lr=t=>t===void 0?void 0:JSON.parse(JSON.stringify(t)),Uo=t=>t===void 0?"<absent>":JSON.stringify(t);function Ws(t,e){return String(e).split(".").reduce((n,s)=>n==null?void 0:n[s],t)}function cy(t,e,n){const s=String(e).split(".");let r=t;for(let i=0;i<s.length-1;i++)me(r[s[i]])||(r[s[i]]={}),r=r[s[i]];r[s[s.length-1]]=n}function uy(t,e){const n=String(e).split(".");let s=t;for(let r=0;r<n.length-1;r++){if(!me(s[n[r]]))return;s=s[n[r]]}delete s[n[n.length-1]]}function dy(t){const e=String(t??"").trim();let n=/^(\d{4})[-/](\d{1,2})$/.exec(e);if(n)return+n[2]>=1&&+n[2]<=12?{y:+n[1],m:+n[2]}:null;if(n=/^(\d{1,2})[-/](\d{4})$/.exec(e),n)return+n[1]>=1&&+n[1]<=12?{y:+n[2],m:+n[1]}:null;if(n=/^([A-Za-z]{3,9})\s+(\d{4})$/.exec(e),n){const s=$n.findIndex(r=>r.toLowerCase().startsWith(n[1].toLowerCase().slice(0,3))&&r.toLowerCase().startsWith(n[1].toLowerCase()));return s>=0?{y:+n[2],m:s+1}:null}return null}const Go=t=>t.y+"-"+String(t.m).padStart(2,"0");function Hs(t,e){try{return $s(t,{now:e})}catch{return t&&t.stressTool&&t.stressTool.settings||{}}}function jn(t,e){try{return Wl(t,e)}catch{return{mode:"legacy",firstTaxYear:e.getFullYear()+1,shapeAgeNow:Y(t.shapeAgeNow)||57,currentAge:null,retireAge:null,startMonth:e.getFullYear()+1+"-04",yearsToStart:0,bridgeMonths:0}}}function Ti(t,{today:e}){const n=kt(e),s=ly(t),r=s?t.planDocument:null,i=Hs(t,n),o=t&&t.stressTool&&me(t.stressTool.settings)?t.stressTool.settings:{};let l=jn(i,n),a=Y(i.duration)||35;if(r&&me(r.timing)){const S=r.timing;l={...l,mode:S.mode||l.mode,currentAge:Y(S.currentAge),retireAge:Y(S.retireAge),firstTaxYear:Y(S.firstTaxYear)||l.firstTaxYear,shapeAgeNow:Y(S.shapeAgeNow)||l.shapeAgeNow,startMonth:S.startMonth||l.startMonth},a=Array.isArray(r.timeline)&&r.timeline.length||Y(r.assumptions&&r.assumptions.duration)||a}const c=Ee(n),u=l.mode==="legacy"?null:r&&me(r.timing)?Y(r.timing.currentAge):Y(i.currentAge),d=r&&me(r.timing)?r.timing.currentAgeAsOf||null:i.currentAgeAsOf||null,p=u==null?null:l.mode==="future"?"age":"yes",m=l.firstTaxYear,g=p==="yes"?m===c?"now":m===c+1?"april":"saved":null,f=l.shapeAgeNow+a-1,v=s?{kind:"locked",at:ee(Vo(t))}:{kind:"saved",at:t&&t.lastModified?ee(t.lastModified):null},I=s?v:{kind:"saved",at:d?ee(d):v.at};return{locked:s,lockedOn:s?ee(Vo(t)):null,ss:i,stored:o,timing:l,duration:a,thisTY:c,values:{age:u,stopped:p,stopAge:p==="age"?Y(l.retireAge):null,startWhen:g,endAge:f,savedYear:p==="yes"&&g==="saved"?m:null},source:v,ageSource:I}}function nc(t,{today:e}){const s=Ti(t,{today:e}).values,r={};return s.age!=null&&(r.age=String(s.age)),s.stopped&&(r.stopped=s.stopped),s.stopAge!=null&&(r.stopAge=String(s.stopAge)),s.startWhen&&(r.startWhen=s.startWhen),Number.isFinite(s.endAge)&&(r.endAge=String(s.endAge)),r}const Yt=t=>ga.find(e=>e.path===t);function ur(t,e){if(Ht(t))return{error:e.required?"required":null,value:null};const n=String(t).trim();if(!/^\d{1,3}$/.test(n))return{error:"notANumber",value:null};const s=+n;return s<e.min?{error:"tooLow",value:s}:s>e.max?{error:"tooHigh",value:s}:{error:null,value:s}}function hy(t){const e=["now","april"];return t.values.savedYear&&e.push("saved"),e}function sc(t,e,{today:n}){const s=kt(n),r=Ti(t,{today:n}),i={...nc(t,{today:n}),...e||{}},o={},l={},a={age:!0,stopped:!0,endAge:!0,sex:!0,chance:!0,stopAge:!1,stopMonth:!1,startWhen:!1},c=ur(i.age,Yt("age"));c.error?l.age=c.error:o.age=c.value;const u=Ht(i.stopped)?null:String(i.stopped);if(u?Yt("stopped").options.includes(u)?o.stopped=u:l.stopped="notAnOption":l.stopped="required",a.stopAge=u==="age",a.stopMonth=u==="month",a.startWhen=u==="yes",a.stopAge){const h=ur(i.stopAge,Yt("stopAge"));h.error?l.stopAge=h.error:o.age!=null&&h.value<o.age?l.stopAge="stop-before-age":o.stopAge=h.value}if(a.stopMonth)if(Ht(i.stopMonth))l.stopMonth="required";else{const h=dy(i.stopMonth);h?Go(h)<=oy(s)?l.stopMonth="month-passed":o.stopMonth=Go(h):l.stopMonth="notAMonth"}const d=hy(r);if(a.startWhen){const h=Ht(i.startWhen)?null:String(i.startWhen);h?d.includes(h)?o.startWhen=h:l.startWhen="notAnOption":l.startWhen="required"}for(const h of["sex","chance"]){const b=Yt(h),A=Ht(i[h])?b.default:String(i[h]);b.options.includes(A)?o[h]=A:l[h]="notAnOption"}let p=null,m=null,g=null,f=null;if(o.age!=null&&o.stopped&&!l.stopAge&&!l.stopMonth&&!l.startWhen){const h=r.ss,b=r.stored;p={...b};const A=Math.floor(+h.currentAge||0),T=h.currentAgeAsOf||b.currentAgeAsOf||null;p.currentAge=o.age,p.currentAgeAsOf=o.age===A&&T?T:ec(s);const w=o.stopped==="yes";p.retired=w;let _=null;if(o.stopped==="age"&&(_=o.stopAge),o.stopped==="month"){const[P,E]=o.stopMonth.split("-").map(Number);_=Yn({...p},new Date(P,E,0),s),f=_}p.retireAge=w?null:_,p.firstTaxYear=w?o.startWhen==="now"?r.thisTY:o.startWhen==="april"?r.thisTY+1:r.values.savedYear:null,m=jn(p,s),p.shapeAgeNow=m.shapeAgeNow,m.mode!=="legacy"&&(p.firstTaxYear=m.firstTaxYear)}const I=m?m.shapeAgeNow+pr-1:Yt("endAge").min,S=ur(i.endAge,Yt("endAge"));S.error?l.endAge=S.error:S.value<I?l.endAge="too-short":o.endAge=S.value,p&&o.endAge!=null&&(g=Math.max(pr,o.endAge-m.shapeAgeNow+1),p.duration=g);const y=Object.keys(l).length===0&&p!==null&&g!==null;return{ok:y,values:o,errors:l,applies:a,offered:d,next:y?p:null,timing:y?m:null,duration:g,stopAgeFromMonth:f,saved:r,minEnd:I}}function fy(t,e,n){if(!(t&&t.budgetTool&&me(t.budgetTool.settings)))return{};const s=e.retired===!1&&+e.retireAge>0?+e.retireAge:n.shapeAgeNow;return{"budgetTool.settings.currentAge":e.currentAge,"budgetTool.settings.currentAgeAsOf":e.currentAgeAsOf,"budgetTool.settings.retired":e.retired,"budgetTool.settings.retirementAge":s}}function rc(t,e,{today:n}){const s=sc(t,e,{today:n});if(!s.ok)return{ok:!1,errors:s.errors,patch:{},previous:{}};if(s.saved.locked)return{ok:!1,errors:{plan:"locked"},patch:{},previous:{}};const r=s.next,i=s.timing,o={"stressTool.settings.currentAge":r.currentAge,"stressTool.settings.currentAgeAsOf":r.currentAgeAsOf,"stressTool.settings.retired":r.retired,"stressTool.settings.retireAge":r.retireAge,"stressTool.settings.firstTaxYear":r.firstTaxYear,"stressTool.settings.shapeAgeNow":r.shapeAgeNow,"stressTool.settings.duration":r.duration,"decisionTool.settings.firstTaxYear":i.firstTaxYear,...fy(t,r,i)},l={},a={};for(const c of Dc){if(!(c in o))continue;const u=Ws(t,c),d=o[c];Uo(u)!==Uo(d)&&(u===void 0&&d===null||(l[c]=Lr(d),a[c]=Lr(u)))}return{ok:!0,errors:{},patch:l,previous:a}}function py(t,e){const n=JSON.parse(JSON.stringify(t));for(const[s,r]of Object.entries(e||{}))r===void 0?uy(n,s):cy(n,s,Lr(r));return n}function Yo(t,e,{stopAgeFromMonth:n=null}={}){if(!t||t.mode==="legacy")return[{id:"noAge",slots:{}}];const s=t.shapeAgeNow+e-1,r=[];return t.mode==="future"&&(n!=null?r.push({id:"monthAs",slots:{age:t.retireAge,month:de(t.startMonth)}}):r.push({id:"stopIn",slots:{month:de(t.startMonth),age:t.retireAge}})),r.push({id:"firstYear",slots:{year:H(t.firstTaxYear),y:t.firstTaxYear}}),r.push({id:"runs",slots:{years:e,from:t.mode==="future"?de(t.startMonth):"April "+t.firstTaxYear,endAge:s}}),r.push({id:"stepsFrom",slots:{age:t.shapeAgeNow}}),r}function my(t){return[]}function gy(t,e){const n=t&&t.fromAnswer;if(!me(n)||!me(n.answer)||!Array.isArray(n.people)||!me(n.people[0]))return null;const s=e||{},r=n.people[0],i=me(r.stop)?r.stop:me(n.stop)?n.stop:null,o=i?i.kind==="later":Y(r.ageAtStop)!=null&&Y(r.ageToday)!=null&&r.ageAtStop>r.ageToday,l=Y(r.years)!=null?Y(r.years):Y(n.years),a=[];if(Y(r.ageToday)!=null&&Y(s.currentAge)!==Y(r.ageToday)&&a.push("age"),s.retired===!1!==o&&a.push("stopped"),o&&s.retired===!1&&Y(s.retireAge)!==Y(r.ageAtStop)&&a.push("stopAge"),l!=null&&Y(s.duration)!==l&&a.push("years"),r.statePension===null||me(r.statePension)&&Y(r.statePension.yearly)!=null){const d=r.statePension===null?0:Math.round(Y(r.statePension.yearly)),p=+s.spWeeklyAmount>0&&s.spStartDate?Math.round(+s.spWeeklyAmount*52):0;d!==p&&a.push("statePension")}if((r.finalSalary===null||me(r.finalSalary)&&Y(r.finalSalary.yearly)!=null)&&(r.finalSalary===null?0:Math.round(Y(r.finalSalary.yearly)))!==Math.round(Y(s.dbAmount)||0)&&a.push("finalSalary"),Array.isArray(r.takeHome)&&me(r.takeHome[0])&&Y(r.takeHome[0].perMonth)!=null){const d=Math.round(Y(r.takeHome[0].perMonth)),p=Math.round(He(ay(s),tc(s))/12);Math.abs(d-p)>1&&a.push("spend")}if(me(r.pension)&&Y(r.pension.today)!=null){const d=me(r.pension.atStop)?Y(r.pension.atStop.middling):null,p=o&&!(Y(r.pension.today)>0)&&d!=null?d:Y(r.pension.today),m=(Y(s.equityMin)||0)+(Y(s.bondMin)||0)+(Y(s.cashTarget)||0)+(Y(s.diversifierStart)||0);Math.round(p)!==Math.round(m)&&a.push("pension")}if(me(r.savings)&&Y(r.savings.today)!=null&&Math.round(Y(r.savings.today))!==Math.round(Y(s.isaBalance)||0)&&a.push("isa"),!a.length)return null;const c=typeof n.savedOn=="string"?n.savedOn:"",u=t.lastModified&&String(t.lastModified)>c?ee(t.lastModified):null;return{workedOutOn:ee(c),changedOn:u,lasted:me(n.answer)?Y(n.answer.lasted):null,diffs:a}}function yy(t,e,{today:n,typed:s=null}={}){const r=(t||[]).filter(y=>y&&y.plan&&typeof y.plan=="object"&&y.plan.id!=null),i=r.find(y=>String(y.plan.id)===String(e))||null;if(!i)return{found:!1,id:String(e||"")};const o=i.plan,l=!!(i.newer||i.failed),a=Ti(o,{today:n}),c=!a.locked&&!l,u=nc(o,{today:n}),d=sc(o,s||{},{today:n}),p={...u,...s||{}},m=ga.map(y=>({path:y.path,type:y.type,options:y.type==="choice"?y.path==="startWhen"?d.offered:y.options:null,applies:d.applies[y.path]!==!1,shown:Ht(p[y.path])?"":String(p[y.path]),saved:y.path in u?u[y.path]:null,error:d.errors[y.path]||null})),g=d.ok?Yo(d.timing,d.duration,{stopAgeFromMonth:d.stopAgeFromMonth}):Yo(a.timing,a.duration);o.planDocument&&o.planDocument.strategy&&o.planDocument.strategy.id||a.ss.strategyId;const f=r.filter(y=>y.plan.id!==o.id&&(y.plan.id===Fo(o)||Fo(y.plan)===o.id)).map(y=>({id:String(y.plan.id),name:Bo(y.plan)}));let v=null;if(d.values.age!=null){const y=ry(d.values.age,d.values.sex||"m",+(d.values.chance||"10"));v={endAge:y,applied:String(p.endAge||"")===String(y),slots:{age:y,who:d.values.sex==="f"?"women":"men",ageNow:d.values.age,chance:d.values.chance||"10"}}}const I=c&&d.ok?rc(o,s||{},{today:n}):{patch:{},previous:{}},S={years:a.duration,endAge:a.values.endAge};return{found:!0,id:String(o.id),name:Bo(o),locked:a.locked,lockedOn:a.lockedOn,readonly:l,editable:c,source:a.source,ageSource:a.ageSource,thisTY:a.thisTY,yearNow:H(a.thisTY),yearApril:H(a.thisTY+1),yearSaved:a.values.savedYear?H(a.values.savedYear):null,fields:m,errors:d.errors,ok:d.ok,derived:g,notUsed:my(),partners:f,suggestion:v,endAgeMin:d.minEnd,minYears:pr,changed:Object.keys(I.patch).length>0,patch:I.patch,previous:I.previous,savedSlots:S,savedLine:d.ok?{id:"runsTo",slots:{endAge:d.values.endAge,years:d.duration}}:null}}const j=t=>t==null||t===""||!Number.isFinite(+t)?null:+t,L=t=>Math.round(j(t)||0),In=t=>t&&t.planDetails&&typeof t.planDetails.name=="string"&&t.planDetails.name||t&&typeof t.name=="string"&&t.name||"",Vr=t=>t&&t.household&&typeof t.household.partnerScenarioId=="string"&&t.household.partnerScenarioId||null,_s=t=>!!(t&&t.decisionTool&&t.decisionTool.settings&&t.decisionTool.settings.locked),qs=t=>t&&t.decisionTool&&t.decisionTool.settings&&t.decisionTool.settings.lockedAt||t&&t.planDocument&&t.planDocument.lockedAt||null,ic=(t,e)=>t&&t.planDocument&&t.planDocument.strategy&&t.planDocument.strategy.id||e&&e.strategyId||"pots-and-valves",oc=(t,e)=>gg.includes(ic(t,e));function Ss(t,e,n=null){const s=t&&t.key;return!s||s==="unknown"?null:s==="committed-saving"?{id:"committed-saving",slots:{month:de(t.startMonth)||H(t.firstTaxYear)}}:s==="bridge"?{id:oc(e,n)?"bridge-ladder":"bridge-plan",slots:{month:de(t.startMonth)||"April "+t.firstTaxYear}}:{id:s,slots:{}}}function ws(t,e){try{return Kg(t,{now:e})}catch{return{key:"unknown",locked:_s(t),retired:!1,timingMode:"legacy",firstTaxYear:null,startMonth:null,beforeStart:!1,hasRecords:!1,hasDocument:!!(t&&t.planDocument),monthsToStart:0,yearsToStart:0}}}function Is(t,e){try{return $s(t,{now:e})}catch{return t&&t.stressTool&&t.stressTool.settings||{}}}function _i(t,e){const n=e.id,s=Vr(e);return t.filter(r=>r.plan.id!==n&&(r.plan.id===s||Vr(r.plan)===n))}function by(t,{today:e,source:n="account"}={}){const s=kt(e),r=(t||[]).filter(u=>u&&u.plan&&typeof u.plan=="object"&&u.plan.id!=null),i=r.map(u=>{const d=u.plan,p=ws(d,s),m=Is(d,s),g=_i(r,d);return{id:String(d.id),name:In(d),stageKey:p.key,line:Ss(p,d,m),locked:_s(d),lockedOn:_s(d)?ee(qs(d)):null,madeOn:d.fromAnswer&&d.fromAnswer.savedOn?ee(d.fromAnswer.savedOn):null,shownAsSaved:!!(u.newer||u.failed),linked:g.length>0,lastModified:typeof d.lastModified=="string"?d.lastModified:""}}),o=(u,d)=>String(d.lastModified).localeCompare(String(u.lastModified));if(n==="window")return{groups:[{id:"window",rows:i.slice().sort((u,d)=>u.linked===d.linked?o(u,d):u.linked?-1:1)}]};const l=i.filter(u=>u.linked).sort(o),a=i.filter(u=>!u.linked).sort(o),c=[];return l.length&&c.push({id:"household",rows:l}),a.length&&c.push({id:"other",rows:a}),{groups:c}}const C=t=>({key:t,kind:"money"}),$e=t=>({key:t,kind:"count"}),pn=t=>({key:t,kind:"age"}),Ay=t=>"£"+String(Math.abs(Math.round(Number(t)||0))).replace(/\B(?=(\d{3})+(?!\d))/g,","),vy=(t,e)=>typeof t=="string"?t:"fixed"in t?String(t.fixed):t.kind==="money"?Ay(e[t.key]):String(Math.round(Number(e[t.key])||0)),W=(t,e,n)=>({id:t,parts:e,text:e.map(s=>vy(s,n)).join("")});function oe(t,e,n){const s=e?Ks(e):null,r={y:n.getFullYear(),m:n.getMonth()+1},i=!!s&&iy(s,r)>3;return{kind:t,at:e?String(e).length>7?ee(e):de(e):null,stale:i}}const G=(t,e,n,s,r={})=>({id:t,slots:r,sentence:W(t,e,n),source:s}),Z=(t,e,n={})=>({id:t,place:e,slots:n}),Br=(t,e,n={})=>({id:t,href:e,slots:n});function ac(t){const{plan:e,now:n,ty:s,tyKey:r,mon:i}=t,o=js(e),l=o.length?o[o.length-1]:null,a=!!l&&String(l.date).slice(0,7)>=i,c={},u=[],d=!!(e.decisionTool&&e.decisionTool.taxYears&&e.decisionTool.taxYears[r]&&e.decisionTool.taxYears[r].yearSetupComplete);u.push(G(d?"month.yearSetUp":"month.yearNotSetUp",[],c,oe("record",null,n),{year:H(s)})),o.slice(-3).reverse().forEach((g,f)=>{c["net"+f]=L(g.monthlyNet),c["tax"+f]=L(g.monthlyTax),u.push(G("month.record",[{fixed:de(g.date)},": ",C("net"+f)," after tax, ",C("tax"+f)," tax"],c,oe("record",g.date,n),{month:de(g.date)}))});let p;a?(c.net=L(l.monthlyNet),p=W("month.recorded",[de(i)+" recorded: ",C("net")," after tax"],c)):p=W("month.notYet",[de(i)+" is not recorded yet"],c);const m=[Z("record","month",{month:Qt(i)})];return d||m.push(Z("setUpYear","taxyear",{year:H(s)})),{done:a,result:p,figures:c,lines:u,buttons:m,notes:[],recorded:a,setUp:d}}function Ty(t){const{plan:e,now:n,ss:s}=t,r={},i=[],o=[];if(!e.planDocument)return{done:!1,result:W("where.noDocument",["Not locked: nothing to read against yet"],r),figures:r,lines:i,buttons:[],notes:o};let l=null,a={ladderInDocument:!1};try{l=Hg(e,{now:n}),a=Ql(e,{now:n})}catch{l=null}const c=qs(e);if(!l)return{done:!1,result:W("where.noReading",["The plan document could not be read"],r),figures:r,lines:i,buttons:[Z("seeDocument","document")],notes:o};let u;if(l.saving){const d=l.saving;d.pathMissing||d.actual==null||d.expected==null?u=W("where.saverNone",["No pot recorded against the plan’s path yet"],r):(r.actual=L(d.actual),r.expected=L(d.expected),u=W("where.saver",[C("actual")," on "+de(d.at),"; the plan’s middle line for then is ",C("expected")],r),i.push(G("where.saverPot",[C("actual")],r,oe(d.actualSource==="holdings"?"hold":"record",d.recordedAt||d.at,n))),i.push(G("where.saverLine",[C("expected")],r,oe("locked",c,n))))}else{const d=l.incomeThisYear||{recorded:0,drawn:0,planned:null};r.months=d.recorded,r.drawn=L(d.drawn);const p=[$e("months")," month"+(d.recorded===1?"":"s")+" recorded in "+l.taxYear+": ",C("drawn")," taken before tax"];d.planned!=null&&(r.planned=L(d.planned),p.push("; the plan says ",C("planned")," for the year")),u=W("where.retired",p,r),i.push(G("where.taken",[C("drawn")],r,oe("record",null,n),{year:l.taxYear})),d.planned!=null&&i.push(G("where.planned",[C("planned")],r,oe("locked",c,n),{year:l.taxYear})),l.step&&l.step.amount!=null&&(r.stepNow=L(l.step.amount),i.push(G("where.step",[C("stepNow")," a year before tax"],r,oe("locked",c,n),{n:String(l.step.index),of:String(l.step.of)}))),l.pot&&l.pot.actual!=null&&(r.pot=L(l.pot.actual),i.push(G("where.pot",[C("pot")],r,oe(l.pot.source==="holdings"?"hold":"record",l.pot.asOf,n))),l.pot.p50!=null&&(r.potMid=L(l.pot.p50),i.push(G("where.potMid",[C("potMid")],r,oe("locked",c,n)))))}return l.contract&&!a.ladderInDocument&&o.push("where.ladderNotInDocument"),l.ladder&&typeof l.ladder.monthly=="number"&&l.ladder.monthly>0&&(r.ladderMonthly=L(l.ladder.monthly),i.push(G("where.ladderMonthly",[C("ladderMonthly")," a month before tax"],r,oe("locked",c,n)))),{done:!0,result:u,figures:r,lines:i,buttons:[Z("seeDocument","document")],notes:o}}function _y(t,e,n){if(n&&t.planDocument&&Array.isArray(t.planDocument.steps)&&t.planDocument.steps.length)return t.planDocument.steps.map(i=>({fromAge:+i.fromAge,amount:L(i.amount),taxYear:i.taxYear||null,decline:+i.decline||0,glideToNext:!!i.glideToNext}));const s=j(e.shapeAgeNow)||null;if(e.incomeShape==="phases"&&Array.isArray(e.incomeSteps)&&e.incomeSteps.length)return e.incomeSteps.filter(i=>i&&j(i.amount)!=null).map(i=>({fromAge:+i.fromAge,amount:L(i.amount),taxYear:null,decline:+i.decline||0,glideToNext:!!i.glideToNext}));const r=Array.isArray(e.targetSchedule)&&e.targetSchedule.length?L(e.targetSchedule[0]):L(e.baseSalary);return s?[{fromAge:s,amount:r,taxYear:null,decline:0,glideToNext:!1}]:[{fromAge:null,amount:r,taxYear:null,decline:0,glideToNext:!1}]}function Sy(t){const{plan:e,ss:n,ds:s,now:r,stage:i,locked:o,readonly:l}=t,a=o?e.planDocument:null,c=qs(e),u={},d=[],p=[],m=_y(e,n,o),g=m[0]||null,f=o?oe("locked",c,r):oe("saved",null,r),v=a&&a.timing?a.timing:null,I=v&&v.startMonth||i.startMonth||null,S=v&&v.firstTaxYear||i.firstTaxYear||null,y=oc(e,n);let h;g&&(u.yearly=g.amount),o&&g?h=i.timingMode==="future"?W("plan.lockedSaver",[C("yearly")," a year before tax from "+(de(I)||H(S))+" (tax year "+H(S)+")"],u):W(y?"plan.lockedLadder":"plan.lockedPlan",[C("yearly")," a year before tax; your "+(y?"ladder":"plan")+" pays from "+(de(I)||H(S))+" (tax year "+H(S)+")"],u):i.timingMode==="future"&&j(n.retireAge)?(u.retireAge=+n.retireAge,h=W("plan.saver",["Stopping work at ",pn("retireAge"),", in "+(de(I)||H(S))],u)):g&&i.key!=="unknown"?h=W("plan.retired",["Retired. ",C("yearly")," a year before tax"],u):g?h=W("plan.noAge",[C("yearly")," a year before tax"],u):h=W("plan.nothing",["No figures yet"],u);const b=[],A=o&&v&&j(v.currentAge)!=null?v.currentAge:j(n.currentAge),T=o&&v?v.currentAgeAsOf:n.currentAgeAsOf;A!=null&&(u.ageToday=A,b.push(G("about.age",[pn("ageToday")],u,o?f:oe("saved",T||null,r),{asOf:T?ee(T):""})));const w=o&&v?v.mode==="retired":n.retired===!0,_=j(o&&v?v.retireAge:n.retireAge);i.timingMode==="future"&&_!=null?(u.stopAge=_,b.push(G("about.stopAt",[pn("stopAge")],u,f,{month:de(I)}))):(w||i.timingMode==="retired")&&b.push(G("about.retired",[],u,f)),S&&b.push(G("about.firstYear",[],u,f,{year:H(S)}));const P=o&&a?a.timeline&&a.timeline.length||a.assumptions&&a.assumptions.duration||null:j(n.duration);if(P){u.years=P;const O=v&&j(v.shapeAgeNow)!=null?v.shapeAgeNow:j(n.shapeAgeNow);O!=null&&(u.ageEnd=O+P-1),b.push(G("about.runs",[$e("years")," years"+(O!=null?", to age ":"")].concat(O!=null?[pn("ageEnd")]:[]),u,f))}const E=[];m.forEach((O,re)=>{u["step"+re]=O.amount;const Re=[];O.fromAge!=null&&(u["stepAge"+re]=O.fromAge,Re.push("From age ",pn("stepAge"+re),": ")),Re.push(C("step"+re)," a year before tax"),O.taxYear&&Re.push(" (tax year "+O.taxYear+")"),O.decline>0?Re.push(", falling "+String(O.decline)+"% a year"):O.glideToNext&&re<m.length-1&&Re.push(", sloping to the next step"),E.push(G("pays.step",Re,u,f))}),o?p.push({id:"prices",slots:{month:de(c)||ee(c)}}):p.push({id:"pricesToday",slots:{}});const R=[],D=o&&a&&a.pots?L(a.pots.sipp):j(n.strategyParams&&n.strategyParams.sippTotal)>0?L(n.strategyParams.sippTotal):L(n.equityMin)+L(n.bondMin)+L(n.cashTarget)+L(n.diversifierStart),k=o&&a&&a.pots?L(a.pots.isa):L(n.isaBalance),M=o&&a&&a.pots?L(a.pots.gia):L(n.taxableStart);if(u.sipp=D,u.isa=k,u.gia=M,R.push(G("pots.pension",[C("sipp")],u,f)),!o)u.shares=L(n.equityMin),u.bonds=L(n.bondMin),u.cash=L(n.cashTarget),R.push(G("pots.split",[C("shares")," shares, ",C("bonds")," bonds, ",C("cash")," cash"],u,f));else if(a&&a.pots&&a.pots.allocation){const O=a.pots.allocation;u.shares=L(O.equityMin),u.bonds=L(O.bondMin),u.cash=L(O.cashTarget),R.push(G("pots.split",[C("shares")," shares, ",C("bonds")," bonds, ",C("cash")," cash"],u,f))}R.push(G("pots.isa",[C("isa")],u,f)),M>0&&R.push(G("pots.gia",[C("gia")],u,f));const x=o&&a&&a.pots?a.pots.potAtRetirement:n.potAtRetirement;x&&(j(x.sipp)>0||j(x.isa)>0)&&(u.parSipp=L(x.sipp),u.parIsa=L(x.isa),R.push(G("pots.atStop",[C("parSipp")," pension, ",C("parIsa")," ISA"],u,f)));const F=[],he=o&&a&&a.assumptions?j(a.assumptions.spWeeklyAmount):j(n.spWeeklyAmount),ae=o&&a&&a.assumptions?a.assumptions.spStartDate:n.spStartDate;if(he>0)u.spWeekly=L(he),F.push(G("pots.statePension",[C("spWeekly")," a week"],u,f,{from:ae?String(ae):""}));else if(j(n.statePension)>0){u.spYearly=L(n.statePension);const O=S&&j(n.statePensionYear)!=null?H(S+L(n.statePensionYear)):"";F.push(G("pots.statePensionOld",[C("spYearly")," a year"],u,f,{year:O}))}else F.push(G("pots.noStatePension",[],u,f));const be=v&&j(v.shapeAgeNow)!=null?v.shapeAgeNow:j(n.shapeAgeNow);if(j(n.dbAmount)>0){u.db=L(n.dbAmount);const O=j(n.dbStartAge)>0?L(n.dbStartAge):be!=null&&j(n.dbStartYear)!=null?be+L(n.dbStartYear):null,re=O!=null?"age "+String(O):j(n.dbStartYear)!=null&&S?"tax year "+H(S+L(n.dbStartYear)):"";F.push(G("pots.finalSalary",[C("db")," a year"],u,f,{from:re}))}j(n.other)>0&&(u.other=L(n.other),F.push(G("pots.other",[C("other")," a year"],u,f))),(Array.isArray(n.extraIncomes)?n.extraIncomes:[]).forEach((O,re)=>{if(!O||typeof O!="object"||!(j(O.annual)>0))return;u["stream"+re]=L(O.annual);const Re=be!=null?be+(j(O.startYear)||0):"",zs=O.endYear==null?null:be!=null?be+j(O.endYear):"";F.push(G(zs==null?"income.streamLife":"income.stream",[C("stream"+re)," a year"],u,f,{label:O.label||"Income for some years",from:String(Re),to:zs==null?"":String(zs)}))}),(Array.isArray(n.windfalls)?n.windfalls:[]).forEach((O,re)=>{!O||typeof O!="object"||!(j(O.amount)>0)||O.year==null||(u["lump"+re]=L(O.amount),F.push(G("income.lump",[C("lump"+re)],u,f,{label:O.label||"Lump sum",age:be!=null?String(be+j(O.year)):"",what:["cash","pension","isa"].includes(O.wrapper)?O.wrapper:"cash"})))});const q=[],se=ic(e,n);q.push(G("way.strategy",[],u,f,{strategy:se}));const le=o&&a&&a.strategy&&a.strategy.params||n.strategyParams||{};for(const[O,re]of Object.entries(le))j(re)!=null&&(u["dial."+O]=j(re),q.push(G("way.dial",[O==="cashYears"||O==="years"||/Years$|Age$/.test(O)?$e("dial."+O):C("dial."+O)],u,f,{dial:O})));!o&&n.allocMode&&q.push(G("way.allocMode",[],u,f,{mode:String(n.allocMode)}));const it=Co(n,s,e),Se=Co(n,s,e,{all:!0}),hn=[{id:"about",lines:b,place:"about",sub:"about",href:"#/plan/"+e.id+"/about"},{id:"pays",lines:E,place:"spend",sub:"spend",href:"#/plan/"+e.id+"/spend"},{id:"pots",lines:R,place:"pots",sub:"pots",href:"#/plan/"+e.id+"/pots"},{id:"income",lines:F,place:"pots",sub:"income",href:"#/plan/"+e.id+"/income"},{id:"way",lines:q,place:"way"}],fn=[];o?fn.push(Z("openDocument","document"),Z("testLocked","test")):l||fn.push(Z("testPlan","test"));const Ft=Array.isArray(e.journey)?e.journey.filter(O=>O&&O.stage).map(O=>({stage:O.stage,on:ee(O.at),arrival:/arrival/i.test(String(O.note||""))})):[],V=Array.isArray(e.planDocumentArchive)?e.planDocumentArchive.length:0;return{done:i.key!=="unknown",result:h,figures:u,lines:d,buttons:fn,notes:p,sections:hn,options:it,allOptions:Se,journey:Ft,pastVersions:V,lockedOn:o?ee(c):null}}function lc(t){const{plan:e,now:n,mon:s}=t,r={},i=[],o=Array.isArray(e.accumulationTool&&e.accumulationTool.history)?e.accumulationTool.history:[],l=zl({accHistory:o,today:n}),a=l.source==="record"&&String(l.at)>=s;let c;if(l.source==="record"){r.pension=L(l.pension),l.isa!=null&&(r.isa=L(l.isa));const u=[C("pension")," pension"].concat(l.isa!=null?[", ",C("isa")," ISA"]:[]);i.push(G("pot.latest",u,r,oe("record",l.recordedAt||l.at,n),{month:de(l.at)})),c=a?W("pot.recorded",[C("pension")," recorded for "+de(s)],r):W("pot.notYet",[Qt(s)+"’s pot is not recorded yet"],r)}else c=W("pot.notYet",[Qt(s)+"’s pot is not recorded yet"],r);return{done:a,result:c,figures:r,lines:i,buttons:[Z("recordPot","potRecord")],notes:[],recorded:a}}function wy(t){const{plan:e,now:n}=t,s=e.accumulationTool&&e.accumulationTool.settings||{},r={},i=[],o=L(s.netMonthly),l=L(s.employerMonthly),a=L(s.isaMonthly),c=j(s.escalationPct),u=o>0||l>0||a>0;let d;if(u){r.you=o,r.employer=l;const p=[C("you")," a month from you, ",C("employer")," from your employer"];a>0&&(r.isaMonthly=a,p.push(", ",C("isaMonthly")," into ISAs and savings")),d=W("saving.payIn",p,r),i.push(G("saving.you",[C("you")," a month"],r,oe("saved",null,n))),i.push(G("saving.employer",[C("employer")," a month"],r,oe("saved",null,n))),a>0&&i.push(G("saving.isa",[C("isaMonthly")," a month"],r,oe("saved",null,n))),c>0&&(r.rise=c,i.push(G("saving.rise",[$e("rise"),"% a year"],r,oe("saved",null,n))))}else d=W("saving.none",["Nothing paid in"],r);return{done:u,result:d,figures:r,lines:i,buttons:[Z("changeSaving","saving"),Z("onCourse","onCourse")],notes:["saving.notFrozen"]}}function Iy(t){const{plan:e,now:n}=t,s=e.budgetTool&&e.budgetTool.settings||{},r=s.derived||{},i={},o=[],l=L(r.allInComfortableMonthly||r.comfortableMonthlyNet),a=L(r.essentialMonthlyNet),c=Array.isArray(s.lines)?s.lines.filter(p=>p&&j(p.amount)>0).length:0,u=l>0&&c>0;let d;return u?(i.total=l,i.essentials=a,d=W("budget.total",[C("total")," a month after tax, ",C("essentials")," of it essentials. A guide only"],i),o.push(G("budget.totalLine",[C("total")," a month after tax"],i,oe("budget",null,n))),o.push(G("budget.essentialsLine",[C("essentials")," a month after tax"],i,oe("budget",null,n)))):d=W("budget.none",["Not worked out. A guide only"],i),{done:u,result:d,figures:i,lines:o,buttons:[Z("changeBudget","budget")],notes:["budget.guide"]}}function ky(t){const e=["lock.what"];return Xl.includes(t.stage.key)&&e.push("lock.saver"),{done:!1,result:W("lock.notLocked",["Not locked"],{}),figures:{},lines:[],buttons:[Z("lockIt","lock")],notes:e}}function Ey(t){const{plan:e,now:n}=t,s=un(e.holdings),r=gm(s),i={},o=[],l=r.count>0;let a;if(l){i.pension=L(r.byWrapper.SIPP),i.isa=L(r.byWrapper.ISA);const c=oe("hold",s.updatedAt||null,n),u=["Pension ",C("pension"),", ISA ",C("isa")];r.byWrapper.GIA>0&&(i.gia=L(r.byWrapper.GIA),u.push(", other account ",C("gia"))),r.byWrapper.CASH>0&&(i.cash=L(r.byWrapper.CASH),u.push(", cash ",C("cash"))),u.push(s.updatedAt?". Updated "+ee(s.updatedAt):""),a=W("hold.summary",u,i),i.lines=r.count,i.total=L(r.total),o.push(G("hold.total",[C("total")," across ",$e("lines")," line"+(r.count===1?"":"s")],i,c))}else a=W("hold.none",["Not recorded yet"],i);return{done:l,result:a,figures:i,lines:o,buttons:[Z("changeHold","hold")],notes:[]}}function Py(t){const{plan:e,now:n}=t,s={},r=[];let i=null;try{i=qg(e,{now:n})}catch{i=null}let o,l=!1;if(!i||!i.target||i.target.kind==="none")o=W("move.notSet",["Set when the plan is locked"],s);else if(i.diff.complete)o=W("move.done",["Done"],s),l=!0;else if(i.target.kind==="ladder"){const a=i.target.lines.length,c=i.diff.hold.filter(u=>Array.isArray(u.taxYears)).length;s.bought=c,s.rungs=a,o=W("move.gilts",[$e("bought")," of ",$e("rungs")," gilts bought"],s)}else s.movesDone=i.prog.doneCount,s.moves=i.prog.total,o=W("move.moves",[$e("movesDone")," of ",$e("moves")," moves done"],s);return i&&i.diff&&typeof i.diff.progressPct=="number"&&(s.heldPct=i.diff.progressPct,r.push(G("move.held",[$e("heldPct"),"% of the plan’s mix held"],s,oe("hold",un(e.holdings).updatedAt||null,n)))),{done:l,result:o,figures:s,lines:r,buttons:[Z("openMove","move")],notes:["move.optional"]}}function Ry(t){const{plan:e,entries:n,now:s}=t,r=_i(n,e),i={},o=[],l=[],a=Vr(e),c=!!a&&!n.some(d=>d.plan.id===a);let u;if(r.length){const d=r[0],p=ws(d.plan,s),m=Ss(p,d.plan,Is(d.plan,s));u=W("household.with",["With ‘"+In(d.plan)+"’"],i);for(const f of r){const v=ws(f.plan,s);o.push({id:"household.partner",slots:{name:In(f.plan)},sentence:W("household.partner",[],i),source:oe("saved",null,s),theirLine:Ss(v,f.plan,Is(f.plan,s)),theirId:String(f.plan.id)}),l.push(Br("openPartner","#/plan/"+f.plan.id,{name:In(f.plan)}))}const g=a&&r.some(f=>f.plan.id===a)?String(e.id):String(r[0].plan.id);return l.push({...Z("checkTogether","household"),planId:g}),{done:!0,result:u,figures:i,lines:o,buttons:l,notes:[],theirLine:m}}return c?{done:!1,result:W("household.notInAccount",["Your partner’s plan is not in this account"],i),figures:i,lines:o,buttons:[Z("linkOne","household")],notes:[]}:{done:!1,result:W("household.none",["No partner’s plan is linked"],i),figures:i,lines:o,buttons:[Z("linkOne","household")],notes:[]}}const My={month:ac,where:Ty,plan:Sy,pot:lc,saving:wy,budget:Iy,lock:ky,hold:Ey,move:Py,household:Ry};function Oy(t,e){const{stage:n,readonly:s,plan:r,ss:i,locked:o,mon:l,ty:a,tyKey:c,now:u}=t,d=n.key,p=d==="bridge"||d==="running",m=e.month,g=e.pot,f=js(r),v=f.length?String(f[f.length-1].date).slice(0,7):null,I=Array.isArray(r.journey)&&r.journey.some(M=>M&&/arrival/i.test(String(M.note||""))),S=n.startMonth||null,y=n.hasRecords;let h=null;try{h=["saving","approaching","draft-retired","unknown"].includes(d)?Km(i,{locked:o,hasRecords:y,now:u}):null}catch{h=null}const b=m?m.setUp:!!(r.decisionTool&&r.decisionTool.taxYears&&r.decisionTool.taxYears[c]&&r.decisionTool.taxYears[c].yearSetupComplete),A=m?m.recorded:!!v&&v>=l,T=g?g.recorded:!1,w=o?null:gy(r,i),_={"P.readonly":()=>s,"P.noAge":()=>d==="unknown","P.arrive":()=>d==="running"&&n.timingMode==="future"&&!!S&&!(v&&v>=S)&&!I,"P.taxyear":()=>p&&!b,"P.month":()=>p&&!A,"P.idle":()=>p,"P.pot":()=>d==="committed-saving"&&!T,"P.working":()=>d==="committed-saving","P.recheck":()=>!!w,"P.stale":()=>!!h,"P.draft":()=>d==="draft-retired","P.approaching":()=>d==="approaching","P.saving":()=>d==="saving"},P=Qg.find(M=>_[M]()),E=(()=>{const M=Ks(l),x=M.m===12?{y:M.y+1,m:1}:{y:M.y,m:M.m+1};return $n[x.m-1]})(),R={month:de(l),monthName:Qt(l),nextMonth:E,year:H(a),stop:de(S)||"",savedYear:h?h.savedLabel:""},D="#/plan/"+r.id+"/about",k={"P.readonly":null,"P.noAge":Br("addAge",D),"P.arrive":Z("record","month",{month:Qt(l)}),"P.taxyear":Z("setUpYear","taxyear",{year:H(a)}),"P.month":Z("record","month",{month:Qt(l)}),"P.idle":null,"P.pot":Z("recordPot","potRecord"),"P.working":Z("onCourse","onCourse"),"P.recheck":Z("recheck","test"),"P.stale":Br("updateIt",D),"P.draft":Z("testPlan","test"),"P.approaching":Z("testPlan","test"),"P.saving":Z("onCourse","onCourse")};return{id:P||"P.saving",slots:R,button:P?k[P]:null,answerStale:w}}function Dy(t,e,n,{today:s,source:r="account"}={}){const i=kt(s),o=(t||[]).filter(E=>E&&E.plan&&typeof E.plan=="object"&&E.plan.id!=null),l=o.find(E=>String(E.plan.id)===String(e))||null;if(!l)return{found:!1,id:String(e||"")};const a=l.plan,c=!!(l.newer||l.failed),u=ws(a,i),d=Is(a,i),p=a.decisionTool&&a.decisionTool.settings||{},m=_s(a),g=_i(o,a),f=Ee(i),v={plan:a,entries:o,now:i,ss:d,ds:p,stage:u,locked:m,readonly:c,mon:Wg(i),ty:f,tyKey:bi(f),source:r},I=Zl(u.key,{locked:m,linked:g.length>0,manyPlans:o.length>1}),S=I.map(E=>E.id),y=n&&Jg.includes(n)?n:null,h=y||S[0],b=y&&!S.includes(y)?[...I,{id:y,optional:!0,listed:!1}]:I,A={};for(const E of b)try{A[E.id]=My[E.id](v)}catch(R){A[E.id]={done:!1,result:W(E.id+".failed",["Could not be read"],{}),figures:{},lines:[],buttons:[],notes:[],error:R&&R.message}}!A.month&&["bridge","running"].includes(u.key)&&(A.month=ac(v)),!A.pot&&u.key==="committed-saving"&&(A.pot=lc(v));const T=b.map(E=>{const R=A[E.id],D=c?R.buttons.filter(k=>k.href):R.buttons;return{id:E.id,optional:!!E.optional,listed:E.listed!==!1,state:E.id===h?"current":R.done?"done":"open",...R,buttons:D}}),{answerStale:w,..._}=Oy(v,A),P=Zg(u.key,{locked:m,linked:g.length>0,manyPlans:o.length>1});return{found:!0,id:String(a.id),name:In(a),stageKey:u.key,retired:xo.includes(u.key),saver:Xl.includes(u.key),line:Ss(u,a,d),locked:m,lockedOn:m?ee(qs(a)):null,readonly:c,source:r,steps:T,subSteps:P,current:h,answerStale:w||null,next:c?{..._,button:null}:_,askLinks:xo.includes(u.key)?["c"]:["a","b"]}}const $t=t=>!!t&&typeof t=="object"&&!Array.isArray(t),ie=t=>t==null||t===""||!Number.isFinite(+t)?null:+t,Tt=t=>t==null||typeof t=="string"&&t.trim()==="",Ny=t=>!!(t&&t.decisionTool&&t.decisionTool.settings&&t.decisionTool.settings.locked),$o=t=>t&&t.decisionTool&&t.decisionTool.settings&&t.decisionTool.settings.lockedAt||t&&t.planDocument&&t.planDocument.lockedAt||null,jo=t=>t&&t.planDetails&&typeof t.planDetails.name=="string"&&t.planDetails.name||t&&typeof t.name=="string"&&t.name||"",Ko=t=>t&&t.household&&typeof t.household.partnerScenarioId=="string"&&t.household.partnerScenarioId||null,Wo=t=>t===void 0?void 0:JSON.parse(JSON.stringify(t)),ct=t=>t===void 0?"<absent>":JSON.stringify(t),ks=t=>Math.round(t*100)/100,xy=t=>[...new Set(t)],N=t=>"£"+String(Math.abs(Math.round(Number(t)||0))).replace(/\B(?=(\d{3})+(?!\d))/g,","),Cy=t=>{const e=Math.abs(Number(t)||0),n=Math.floor(e+1e-9),s=Math.round((e-n)*100);return N(n)+"."+String(s).padStart(2,"0")},Ly="Final-salary pension",Vy=t=>/^\s*final[\s-]?salary(\s+pension)?\s*$/i.test(String(t??"")),Ho=t=>Math.abs(+t-gt.fullStatePensionWeekly)<.005,yn=(t,e)=>Math.round(+t)-Math.round(+e),Nt=(t,e)=>Math.round(+e)+Math.round(+t||0),By=(t,e)=>+t.dbStartAge>0?Math.round(+t.dbStartAge):Nt(+t.dbStartYear||0,e);function cc(t,e){const n=Math.floor(+t.currentAge||0);if(!(n>0))return null;const s=/^\d{4}-\d{2}-\d{2}/.test(String(t.currentAgeAsOf||""))?String(t.currentAgeAsOf).slice(0,10):e,r=Cc(Lc(n,s));return Vc(s,r-n)}function Fy(t,e,n){if(!(ie(t.currentAge)>0))return!1;const[s,r,i]=gt.pensionAccess.changesOn.split("-").map(Number),o=new Date(s,r-1,i);if(n.getTime()>=o.getTime())return!1;let l=n;if(e.mode==="future"&&e.startMonth){const[u,d]=String(e.startMonth).split("-").map(Number);u>0&&d>0&&(l=new Date(u,d-1,1))}if(l.getTime()>=o.getTime())return!1;let a=!1;try{a=Gl(t)>0}catch{a=!1}if(a=a||ie(t.potAtRetirement&&t.potAtRetirement.sipp)>0||ie(t.strategyParams&&t.strategyParams.sippTotal)>0,!a)return!1;const c=Yn(t,o,n);return c!=null&&c>=gt.pensionAccess.before&&c<gt.pensionAccess.from}function Fr(t,e,n,{dateText:s,weekly:r,now:i}){const o=s?Ys(String(s)):null;if(r>0&&o){const a=Ul({...t,spStartDate:s,spWeeklyAmount:r,firstTaxYear:e.firstTaxYear,shapeAgeNow:n},i),c=Ee(o),u=Nt(a?a.spStartYear:0,n);return{kind:Ho(r)?"full":"forecast",weekly:r,yearly:ks(r*52),date:String(s),dateWords:ee(ec(o)),fromAge:u,taxYear:c,beforeStart:c<e.firstTaxYear,dated:!0}}if(r>0){const a=Ri({...t,shapeAgeNow:n});return{kind:Ho(r)?"full":"forecast",weekly:r,yearly:ks(r*52),date:null,dateWords:null,fromAge:a===999?null:Nt(a,n),taxYear:a===999?null:e.firstTaxYear+a,beforeStart:!1,dated:!1}}const l=ie(t.statePension)||0;if(l>0){const a=Ri({...t,shapeAgeNow:n});return{kind:"assumed",weekly:null,yearly:l,date:s?String(s):null,dateWords:null,fromAge:a===999?null:Nt(a,n),taxYear:a===999?null:e.firstTaxYear+a,beforeStart:!1,dated:!1}}return{kind:"none",weekly:null,yearly:0,date:s?String(s):null,dateWords:null,fromAge:null,taxYear:null,beforeStart:!1,dated:!1}}function Si(t,{today:e}){const n=kt(e),s=Ny(t),r=s?t.planDocument:null,i=Hs(t,n),o=t&&t.stressTool&&$t(t.stressTool.settings)?t.stressTool.settings:{};let l=jn(i,n),a=ie(i.duration)||35;if(r&&$t(r.timing)){const h=r.timing;l={...l,mode:h.mode||l.mode,firstTaxYear:ie(h.firstTaxYear)||l.firstTaxYear,shapeAgeNow:ie(h.shapeAgeNow)||l.shapeAgeNow,startMonth:h.startMonth||l.startMonth},a=Array.isArray(r.timeline)&&r.timeline.length||ie(r.assumptions&&r.assumptions.duration)||a}const c=l.shapeAgeNow,u=c+a-1,d=s?{kind:"locked",at:ee($o(t))}:{kind:"saved",at:t&&t.lastModified?ee(t.lastModified):null},p=r&&$t(r.assumptions)?r.assumptions.spStartDate||null:i.spStartDate||null,m=r&&$t(r.assumptions)?ie(r.assumptions.spWeeklyAmount)||0:ie(i.spWeeklyAmount)||0,g=Fr(i,l,c,{dateText:p,weekly:m,now:n}),f=Array.isArray(o.extraIncomes)?o.extraIncomes:Array.isArray(i.extraIncomes)?i.extraIncomes:[],v=Array.isArray(o.windfalls)?o.windfalls:Array.isArray(i.windfalls)?i.windfalls:[],I=[],S=[],y=[];return ie(i.dbAmount)>0&&I.push({id:"0",amount:ie(i.dbAmount),fromAge:By(i,c),rises:Pi.includes(i.dbIndexation)?i.dbIndexation:"lpi5",from:"db",row:null}),f.forEach((h,b)=>{if(!$t(h)||!(ie(h.annual)>0))return;const A={amount:ie(h.annual),fromAge:Nt(ie(h.startYear)||0,c),rises:Pi.includes(h.indexation)?h.indexation:"lpi5",from:"row",row:b};h.endYear==null&&Vy(h.label)?I.push({...A,id:String(I.length)}):S.push({...A,id:String(S.length),label:typeof h.label=="string"?h.label:"",toAge:h.endYear==null?null:Nt(ie(h.endYear)||0,c)})}),v.forEach((h,b)=>{!$t(h)||!(ie(h.amount)>0)||ie(h.year)==null||y.push({id:String(y.length),label:typeof h.label=="string"?h.label:"",amount:ie(h.amount),atAge:Nt(ie(h.year),c),wrapper:Nc.includes(h.wrapper)?h.wrapper:"cash",from:"row",row:b})}),{locked:s,lockedOn:s?ee($o(t)):null,ss:i,stored:o,timing:l,duration:a,ageNow:c,endAge:u,source:d,sp:g,fs:I,other:ie(i.other)||0,streams:S,lumps:y,rows:f,wrows:v,note2028:Fy(i,l,n)}}function uc(t,{today:e}){const n=Si(t,{today:e}),s={spKind:n.sp.kind};n.sp.weekly!=null&&(s.spWeekly=String(n.sp.weekly)),n.other>0&&(s.other=String(n.other));for(const r of Yr){s[r+".ids"]=n[r].map(i=>i.id).join(",");for(const i of n[r])for(const o of mr[r].fields){const l=i[o.path];l==null||l===""||(s[`${r}.${i.id}.${o.path}`]=String(l))}}return s}const qo=t=>ya.find(e=>e.path===t);function Uy(t,e){if(Tt(t))return{error:e.required?"required":null,value:null};const n=String(t).trim();if(!/^\d{1,3}$/.test(n))return{error:"notANumber",value:null};const s=+n;return s<e.min?{error:"tooLow",value:s}:s>e.max?{error:"tooHigh",value:s}:{error:null,value:s}}function Ur(t,e){if(Tt(t))return{error:e.required?"required":null,value:null};const n=String(t).replace(/[£,\s]/g,"");if(!/^\d{1,9}(\.\d{1,2})?$/.test(n))return{error:"notANumber",value:null};const s=ks(+n);return s<e.min?{error:"tooLow",value:s}:s>e.max?{error:"tooHigh",value:s}:{error:null,value:s}}function Gy(t,e){if(e.type==="age")return Uy(t,e);if(e.type==="money")return Ur(t,e);if(e.type==="choice"){const s=Tt(t)?e.default:String(t);return e.options.includes(s)?{error:null,value:s}:{error:"notAnOption",value:null}}const n=Tt(t)?"":String(t).trim();return e.max&&n.length>e.max?{error:"tooLong",value:null}:{error:null,value:n}}function Yy(t){return t.sp.kind==="assumed"?["full","forecast","none","assumed"]:["full","forecast","none"]}function dc(t,e,{today:n}){const s=kt(n),r=Si(t,{today:n}),i={...uc(t,{today:n}),...e||{}},o={},l={},a={spKind:!0,spWeekly:!1,other:!0},c=Yy(r),u=Tt(i.spKind)?null:String(i.spKind);if(u?c.includes(u)?o.spKind=u:l.spKind="notAnOption":l.spKind="required",a.spWeekly=u==="forecast",a.spWeekly){const g=Ur(i.spWeekly,qo("spWeekly"));g.error?l.spWeekly=g.error:o.spWeekly=g.value}else u==="full"&&(o.spWeekly=gt.fullStatePensionWeekly);{const g=Ur(i.other,qo("other"));g.error?l.other=g.error:o.other=g.value==null?0:g.value}const d={};for(const g of Yr){const f=i[g+".ids"],v=xy((Tt(f)?[]:String(f).split(",")).map(S=>S.trim()).filter(S=>ba(S))),I=v.map(S=>{const y=r[g].find(T=>T.id===S)||null,h={id:S,saved:y,values:{},fields:[]};for(const T of mr[g].fields){const w=`${g}.${S}.${T.path}`,_=i[w],P=Gy(_,T);h.fields.push({path:w,type:T.type,options:T.options||null,applies:!0,shown:Tt(_)?T.type==="choice"?T.default:"":String(_),saved:y&&y[T.path]!=null&&y[T.path]!==""?String(y[T.path]):null,error:P.error}),P.error?l[w]=P.error:h.values[T.path]=P.value}const b=h.values,A=(T,w)=>{l[`${g}.${S}.${T}`]=w;const _=h.fields.find(P=>P.path===`${g}.${S}.${T}`);_&&(_.error=w),delete b[T]};return g==="fs"&&b.fromAge!=null&&b.fromAge>r.endAge&&A("fromAge","afterEnd"),g==="streams"&&b.fromAge!=null&&b.fromAge>r.endAge&&A("fromAge","afterEnd"),g==="streams"&&b.fromAge!=null&&b.toAge!=null&&b.toAge<b.fromAge&&A("toAge","beforeFrom"),g==="lumps"&&b.atAge!=null&&b.atAge<r.ageNow&&A("atAge","beforeStart"),g==="lumps"&&b.atAge!=null&&b.atAge>r.endAge&&A("atAge","afterEnd"),h.ok=mr[g].fields.every(T=>!l[`${g}.${S}.${T.path}`]),h});d[g]={ids:v,cards:I}}let p=r.sp;return u==="none"?(p=Fr(r.ss,r.timing,r.ageNow,{dateText:r.sp.date,weekly:0,now:s}),p={...p,kind:"none",yearly:0}):(u==="full"||u==="forecast")&&o.spWeekly!=null&&(p=Fr(r.ss,r.timing,r.ageNow,{dateText:r.sp.date||cc(r.ss,n),weekly:o.spWeekly,now:s})),{ok:Object.keys(l).length===0,values:o,lists:d,errors:l,applies:a,offered:c,saved:r,sp:p}}const $y={fs:["amount","fromAge","rises"],streams:["label","amount","fromAge","toAge","rises"],lumps:["label","amount","atAge","wrapper"]},hc=(t,e,n)=>!!e&&$y[n].every(s=>ct(t.values[s]==null?null:t.values[s])===ct(e[s]==null?null:e[s]));function zo(t,e,n,s){const r=e.values;return t==="lumps"?{...n||{},label:r.label||"",amount:r.amount,year:yn(r.atAge,s),wrapper:r.wrapper}:t==="fs"?{...n||{},label:n&&typeof n.label=="string"&&n.label?n.label:Ly,annual:r.amount,startYear:yn(r.fromAge,s),endYear:null,indexation:r.rises}:{...n||{},label:r.label||"",annual:r.amount,startYear:yn(r.fromAge,s),endYear:r.toAge==null?null:yn(r.toAge,s),indexation:r.rises}}function Jo(t,e){const n=e.map(r=>({slots:r.slots,k:0,seq:r.placed.map(({card:i,L:o,ageNow:l})=>{const a=i.saved;return a&&a.from==="row"?hc(i,a,o)?t[a.row]:zo(o,i,t[a.row],l):zo(o,i,null,l)})})),s=[];t.forEach((r,i)=>{const o=n.find(l=>l.slots.has(i));o?o.k<o.seq.length&&s.push(o.seq[o.k++]):s.push(r)});for(const r of n)s.push(...r.seq.slice(r.k));return s}function fc(t,e,{today:n}){const s=dc(t,e,{today:n});if(!s.ok)return{ok:!1,errors:s.errors,patch:{},previous:{}};if(s.saved.locked)return{ok:!1,errors:{plan:"locked"},patch:{},previous:{}};const r=s.saved,i=r.ageNow,o={},l=s.values.spKind;if(l!=="assumed"&&(l!==r.sp.kind||l==="forecast"&&s.values.spWeekly!==r.sp.weekly)){if(l==="none")o.spWeeklyAmount=0,o.statePension=0;else if(o.spWeeklyAmount=s.values.spWeekly,o.statePension=ks(s.values.spWeekly*52),!r.sp.date){const f=cc(r.ss,n);f&&(o.spStartDate=f)}}s.values.other!==(ie(r.ss.other)||0)&&(o.other=s.values.other);const c=s.lists.fs.cards,u=c[0]||null;u?u.saved&&u.saved.from==="db"&&hc(u,u.saved,"fs")||(o.dbAmount=u.values.amount,o.dbStartYear=yn(u.values.fromAge,i),o.dbStartAge=u.values.fromAge,o.dbIndexation=u.values.rises):ie(r.ss.dbAmount)>0&&(o.dbAmount=0);const d=Jo(r.rows,[{slots:new Set(r.fs.filter(f=>f.from==="row").map(f=>f.row)),placed:c.slice(1).map(f=>({card:f,L:"fs",ageNow:i}))},{slots:new Set(r.streams.map(f=>f.row)),placed:s.lists.streams.cards.map(f=>({card:f,L:"streams",ageNow:i}))}]);ct(d)!==ct(r.rows)&&(o.extraIncomes=d);const p=Jo(r.wrows,[{slots:new Set(r.lumps.map(f=>f.row)),placed:s.lists.lumps.cards.map(f=>({card:f,L:"lumps",ageNow:i}))}]);ct(p)!==ct(r.wrows)&&(o.windfalls=p);const m={},g={};for(const f of xc){const v=f.split(".").pop();if(!(v in o))continue;const I=Ws(t,f),S=o[v];ct(I)!==ct(S)&&(I===void 0&&(S===null||S===0)||(m[f]=Wo(S),g[f]=Wo(I)))}return{ok:!0,errors:{},patch:m,previous:g}}const Qo=(t,e,n)=>H(t.firstTaxYear+(n-e)),jy=t=>t===1?"1 year":String(t)+" years";function Ky(t){const{sp:e,fs:n,other:s,streams:r,lumps:i,ageNow:o,timing:l}=t,a=[];e.kind==="none"?a.push({id:"sp.none",slots:{}}):e.kind==="assumed"?a.push({id:e.fromAge!=null?"sp.assumed":"sp.assumedNoAge",slots:{yearly:N(e.yearly),age:e.fromAge}}):e.beforeStart?a.push({id:"sp.before",slots:{yearly:N(e.yearly),date:e.dateWords}}):e.fromAge!=null?a.push({id:e.dated?"sp.paid":"sp.noDate",slots:{yearly:N(e.yearly),age:e.fromAge,year:H(e.taxYear)}}):a.push({id:"sp.noDateNoAge",slots:{yearly:N(e.yearly)}}),n.forEach((c,u)=>{c.fromAge<o?a.push({id:"fs.before",slots:{n:u+1,amount:N(c.amount),age:c.fromAge,ageNow:o,rises:c.rises}}):a.push({id:"fs.line",slots:{n:u+1,amount:N(c.amount),age:c.fromAge,year:Qo(l,o,c.fromAge),rises:c.rises}})}),s>0&&a.push({id:"other.line",slots:{amount:N(s)}});for(const c of r){const u=c.label||"Income for some years";c.toAge==null?a.push({id:"stream.life",slots:{label:u,amount:N(c.amount),from:c.fromAge,rises:c.rises}}):a.push({id:"stream.line",slots:{label:u,amount:N(c.amount),from:c.fromAge,to:c.toAge,years:jy(c.toAge-c.fromAge+1),rises:c.rises}})}for(const c of i)a.push({id:"lump.line",slots:{label:c.label||"Lump sum",amount:N(c.amount),age:c.atAge,year:Qo(l,o,c.atAge),what:c.wrapper}});return t.note2028&&a.push({id:"drawdown2028",slots:{from:gt.pensionAccess.from,day:"5 April "+gt.pensionAccess.changesOn.slice(0,4)}}),a}function Wy(t){return[]}function Hy(t){const e=t.saved,n=s=>t.lists[s].cards.filter(r=>r.ok).map(r=>({...r.values}));return{sp:t.sp,fs:n("fs"),other:t.values.other==null?e.other:t.values.other,streams:n("streams"),lumps:n("lumps"),ageNow:e.ageNow,timing:e.timing,note2028:e.note2028}}function qy(t,e,{today:n,typed:s=null}={}){const r=(t||[]).filter(h=>h&&h.plan&&typeof h.plan=="object"&&h.plan.id!=null),i=r.find(h=>String(h.plan.id)===String(e))||null;if(!i)return{found:!1,id:String(e||"")};const o=i.plan,l=!!(i.newer||i.failed),a=Si(o,{today:n}),c=!a.locked&&!l,u=uc(o,{today:n}),d=dc(o,s||{},{today:n}),p={...u,...s||{}},m=ya.map(h=>({path:h.path,type:h.type,options:h.type==="choice"?h.path==="spKind"?d.offered:h.options:null,applies:d.applies[h.path]!==!1,shown:Tt(p[h.path])?"":String(p[h.path]),saved:h.path in u?u[h.path]:null,error:d.errors[h.path]||null})),g={};for(const h of Yr)g[h]={ids:d.lists[h].ids,cards:d.lists[h].cards.map(b=>({id:b.id,saved:!!b.saved,fields:b.fields}))};const f=Hy(d),v=Ky(f);o.planDocument&&o.planDocument.strategy&&o.planDocument.strategy.id||a.ss.strategyId;const I=r.filter(h=>h.plan.id!==o.id&&(h.plan.id===Ko(o)||Ko(h.plan)===o.id)).map(h=>({id:String(h.plan.id),name:jo(h.plan)})),S=c&&d.ok?fc(o,s||{},{today:n}):{patch:{},previous:{}},y=f.sp.kind==="none"?{sp:"none"}:f.sp.kind==="assumed"?{sp:"assumed",yearly:N(f.sp.yearly),age:f.sp.fromAge}:f.sp.fromAge!=null?{sp:"paid",yearly:N(f.sp.yearly),age:f.sp.fromAge}:{sp:"paidNoAge",yearly:N(f.sp.yearly)};return{found:!0,id:String(o.id),name:jo(o),locked:a.locked,lockedOn:a.lockedOn,readonly:l,editable:c,source:a.source,ageNow:a.ageNow,endAge:a.endAge,fullYearly:N(gt.fullStatePensionWeekly*52),spSaved:{kind:a.sp.kind,weekly:a.sp.weekly==null?null:Cy(a.sp.weekly),yearly:N(a.sp.yearly),age:a.sp.fromAge,dateWords:a.sp.dateWords},assumed:a.sp.kind==="assumed"?{yearly:N(a.sp.yearly),age:a.sp.fromAge}:null,fields:m,lists:g,errors:d.errors,ok:d.ok,derived:v,notUsed:Wy(),partners:I,changed:Object.keys(S.patch).length>0,patch:S.patch,previous:S.previous,savedLine:d.ok?{id:"income",slots:{...y,fs:f.fs.length,streams:f.streams.length,lumps:f.lumps.length}}:null}}const Ot=t=>!!t&&typeof t=="object"&&!Array.isArray(t),Ae=t=>t==null||t===""||!Number.isFinite(+t)?null:+t,Ze=t=>t==null||typeof t=="string"&&t.trim()==="",zy=t=>!!(t&&t.decisionTool&&t.decisionTool.settings&&t.decisionTool.settings.locked),Xo=t=>t&&t.decisionTool&&t.decisionTool.settings&&t.decisionTool.settings.lockedAt||t&&t.planDocument&&t.planDocument.lockedAt||null,Zo=t=>t&&t.planDetails&&typeof t.planDetails.name=="string"&&t.planDetails.name||t&&typeof t.name=="string"&&t.name||"",ea=t=>t&&t.household&&typeof t.household.partnerScenarioId=="string"&&t.household.partnerScenarioId||null,ta=t=>t===void 0?void 0:JSON.parse(JSON.stringify(t)),Es=t=>t===void 0?"<absent>":JSON.stringify(t),Jy=t=>[...new Set(t)],Gr=t=>Math.round(+t||0),It=(t,e)=>Math.round(He(t,e)/12),Ps=(t,e)=>Math.round(wt(t*12,e)),Qy=(t,e)=>t.glideToNext&&e?"glides":+t.decline>0?"falls":"level";function wi(t,e,n,s,r){let i=Ae(t.other)||0;const o=Ae(t.spWeeklyAmount)||0;if(o>0){let a=null;try{a=Ul({...t,spWeeklyAmount:o,shapeAgeNow:n,currentAge:Ae(t.currentAge)||n,firstTaxYear:e.firstTaxYear},r)}catch{a=null}a&&s>=(a.spStartYear??99)&&(i+=o*52)}const l=Ae(t.dbAmount)||0;l>0&&s>=(Ae(t.dbStartYear)||0)&&(i+=l);for(const a of Array.isArray(t.extraIncomes)?t.extraIncomes:[])Ot(a)&&+a.annual>0&&s>=(+a.startYear||0)&&(a.endYear==null||s<=+a.endYear)&&(i+=+a.annual);return i}function Ii(t,e,n,s,r,i,o){return Array.from({length:i+1},(l,a)=>Math.round(Math.max(0,kn(t,r+a,e),wi(n,s,r,a,o))))}function Xy(t,e,n=0){const s=+t||0,r=o=>Math.max(o,n||0),i=[{fromAge:e,amount:s}];return e<75&&i.push({fromAge:75,amount:Math.round(r(s*.85)/500)*500}),e<85&&i.push({fromAge:85,amount:Math.round(r(s*.7)/500)*500}),i}function Zy(t,e){const n=t&&t.budgetTool&&Ot(t.budgetTool.settings)?t.budgetTool.settings:{},s=Ot(n.derived)?n.derived:{},r=Gr(s.allInComfortableMonthly||s.comfortableMonthlyNet),i=Gr(s.essentialMonthlyNet),o=Array.isArray(n.lines)?n.lines.filter(a=>a&&(Ae(a.amount)>0||Ae(a.annual)>0)).length:0,l=r>0&&o>0;return{workedOut:l,total:l?r:null,essentials:l&&i>0?i:null,essentialsAnnualNet:l&&Ae(s.essentialAnnualNet)||0,at:t&&t.lastModified?ee(t.lastModified):null}}function ki(t,{today:e}){const n=kt(e),s=zy(t),r=s?t.planDocument:null,i=Hs(t,n),o=t&&t.stressTool&&Ot(t.stressTool.settings)?t.stressTool.settings:{};let l=jn(i,n),a=Ae(i.duration)||35;if(r&&Ot(r.timing)){const w=r.timing;l={...l,mode:w.mode||l.mode,firstTaxYear:Ae(w.firstTaxYear)||l.firstTaxYear,shapeAgeNow:Ae(w.shapeAgeNow)||l.shapeAgeNow,startMonth:w.startMonth||l.startMonth},a=Array.isArray(r.timeline)&&r.timeline.length||Ae(r.assumptions&&r.assumptions.duration)||a}const c=l.shapeAgeNow,u=c+a-1,d=tc(i),p=s?{kind:"locked",at:ee(Xo(t))}:{kind:"saved",at:t&&t.lastModified?ee(t.lastModified):null};let m=[];if(r&&Array.isArray(r.steps)&&r.steps.length)m=r.steps.map((w,_)=>({fromAge:+w.fromAge,amount:+w.amount,decline:+w.decline||0,glideToNext:!!w.glideToNext,row:_}));else{const w=i.incomeShape==="phases"&&Array.isArray(i.incomeSteps)?i.incomeSteps:[];m=Rs(w.map((P,E)=>Ot(P)?{...P,row:E}:null)).map(P=>({fromAge:+P.fromAge,amount:+P.amount,decline:+P.decline||0,glideToNext:!!P.glideToNext,row:P.row}))}const g=m.length===0;g&&(m=[{fromAge:c,amount:Gr(Array.isArray(i.targetSchedule)&&i.targetSchedule.length?i.targetSchedule[0]:i.baseSalary),decline:0,glideToNext:!1,row:null}]);const f=m.map((w,_)=>({...w,then:Qy(w,_<m.length-1),fallsPct:+w.decline>0?+w.decline:null,monthly:It(w.amount,d)})),v={...f[0],id:"first"},I=f.slice(1).map((w,_)=>({...w,id:String(_)})),S=v.amount,y=m.map(w=>({fromAge:w.fromAge,amount:w.amount,decline:w.decline,glideToNext:w.glideToNext})),h=Array.isArray(i.targetSchedule)&&i.targetSchedule.length?i.targetSchedule.map(w=>+w||0):Ii(y,S,i,l,c,a,n),b=Array.isArray(o.extraWithdrawals)?o.extraWithdrawals:Array.isArray(i.extraWithdrawals)?i.extraWithdrawals:[],A=[];b.forEach((w,_)=>{if(!Ot(w)||!(Ae(w.amount)>0)||Ae(w.year)==null)return;const P=Math.round(Ae(w.year)),E=h[Math.min(Math.max(0,P),h.length-1)]||0,R=Math.round(He(E+Ae(w.amount),d)-He(E,d));A.push({id:String(A.length),label:typeof w.label=="string"?w.label:"",amount:R,gross:Ae(w.amount),atAge:c+P,years:Math.max(1,Math.round(Ae(w.years)||1)),prices:w.indexation==="level"?"fixed":"rise",row:_})});const T=t&&t.planDocument&&t.planDocument.strategy&&t.planDocument.strategy.id||i.strategyId||"pots-and-valves";return{locked:s,lockedOn:s?ee(Xo(t)):null,ss:i,stored:o,timing:l,duration:a,ageNow:c,endAge:u,bands:d,source:p,flat:g,first:v,steps:I,plainSteps:y,base:S,schedule:h,costs:A,xrows:b,budget:Zy(t),strategyId:T,now:n}}function pc(t,{today:e}){const n=ki(t,{today:e}),s={"first.amount":String(n.first.monthly),"first.then":n.first.then};n.first.fallsPct!=null&&(s["first.fallsPct"]=String(n.first.fallsPct)),s["steps.ids"]=n.steps.map(r=>r.id).join(",");for(const r of n.steps)s[`steps.${r.id}.fromAge`]=String(r.fromAge),s[`steps.${r.id}.amount`]=String(r.monthly),s[`steps.${r.id}.then`]=r.then,r.fallsPct!=null&&(s[`steps.${r.id}.fallsPct`]=String(r.fallsPct));s["costs.ids"]=n.costs.map(r=>r.id).join(",");for(const r of n.costs)for(const i of Xn.costs.fields){const o=r[i.path];o==null||o===""||(s[`costs.${r.id}.${i.path}`]=String(o))}return s}function e0(t,e){if(Ze(t))return{error:e.required?"required":null,value:e.default!=null?e.default:null};const n=String(t).trim();if(!/^\d{1,3}$/.test(n))return{error:"notANumber",value:null};const s=+n;return s<e.min?{error:"tooLow",value:s}:s>e.max?{error:"tooHigh",value:s}:{error:null,value:s}}function mc(t,e){if(Ze(t))return{error:e.required?"required":null,value:null};const n=String(t).replace(/[£,\s]/g,"");if(!/^\d{1,9}(\.\d{1,2})?$/.test(n))return{error:"notANumber",value:null};const s=Math.round(+n);return s<e.min?{error:"tooLow",value:s}:s>e.max?{error:"tooHigh",value:s}:{error:null,value:s}}function gc(t,e){if(Ze(t))return{error:e.required?"required":null,value:null};const n=String(t).replace(/[%\s]/g,"");if(!/^\d{1,2}(\.\d{1,2})?$/.test(n))return{error:"range",value:null};const s=+n;return s<e.min||s>e.max||Math.abs(s/e.step-Math.round(s/e.step))>1e-9?{error:"range",value:s}:{error:null,value:s}}function na(t,e){if(e.type==="age"||e.type==="count")return e0(t,e);if(e.type==="money")return mc(t,e);if(e.type==="percent")return gc(t,e);if(e.type==="choice"){const s=Ze(t)?e.default:String(t);return e.options.includes(s)?{error:null,value:s}:{error:"notAnOption",value:null}}const n=Ze(t)?"":String(t).trim();return e.max&&n.length>e.max?{error:"tooLong",value:null}:{error:null,value:n}}const dr=t=>Aa.find(e=>e.path===t);function yc(t,e,{today:n}){const s=ki(t,{today:n}),r={...pc(t,{today:n}),...e||{}},i={first:{}},o={},l=s.bands,a=mc(r["first.amount"],dr("first.amount"));a.error?o["first.amount"]=a.error:i.first.amount=a.value;const c=na(r["first.then"],dr("first.then"));c.error?o["first.then"]=c.error:i.first.then=c.value;const u={"first.amount":!0,"first.then":!0,"first.fallsPct":i.first.then==="falls"};if(u["first.fallsPct"]){const f=gc(r["first.fallsPct"],dr("first.fallsPct"));f.error?o["first.fallsPct"]=f.error:i.first.fallsPct=f.value}const d={};for(const f of va){const v=r[f+".ids"],I=Jy((Ze(v)?[]:String(v).split(",")).map(y=>y.trim()).filter(y=>ba(y))),S=I.map(y=>{const h=s[f].find(w=>w.id===y)||null,b={id:y,saved:h,values:{},fields:[]};for(const w of Xn[f].fields){const _=`${f}.${y}.${w.path}`,P=r[_],E=!w.when||Object.entries(w.when).every(([D,k])=>(Ze(r[`${f}.${y}.${D}`])?Xn[f].fields.find(M=>M.path===D).default:String(r[`${f}.${y}.${D}`]))===k),R=E?na(P,w):{error:null,value:null};b.fields.push({path:_,type:w.type,options:w.options||null,applies:E,shown:Ze(P)?w.type==="choice"||w.default!=null?String(w.default):"":String(P),saved:h&&h[w.path]!=null&&h[w.path]!==""?String(h[w.path]):null,error:R.error}),R.error?o[_]=R.error:E&&(b.values[w.path]=R.value)}const A=b.values,T=(w,_)=>{o[`${f}.${y}.${w}`]=_;const P=b.fields.find(E=>E.path===`${f}.${y}.${w}`);P&&(P.error=_),delete A[w]};return f==="steps"&&A.fromAge!=null&&A.fromAge<=s.first.fromAge&&T("fromAge","beforeStart"),f==="steps"&&A.fromAge!=null&&A.fromAge>s.endAge&&T("fromAge","afterEnd"),f==="costs"&&A.atAge!=null&&A.atAge<s.ageNow&&T("atAge","beforeStart"),f==="costs"&&A.atAge!=null&&A.atAge>s.endAge&&T("atAge","afterEnd"),f==="costs"&&A.atAge!=null&&A.years!=null&&A.years>s.endAge-A.atAge+1&&T("years","tooManyYears"),b});if(f==="steps"){const y=new Map;for(const b of S)b.values.fromAge!=null&&y.set(b.values.fromAge,(y.get(b.values.fromAge)||0)+1);for(const b of S){const A=b.values.fromAge;A==null||y.get(A)<2||(o[`steps.${b.id}.fromAge`]="sameAge",b.fields.find(T=>T.path===`steps.${b.id}.fromAge`).error="sameAge",delete b.values.fromAge)}const h=S.filter(b=>b.values.fromAge!=null).sort((b,A)=>b.values.fromAge-A.values.fromAge).pop();h&&h.values.then==="glides"&&(o[`steps.${h.id}.then`]="glidesLast",h.fields.find(b=>b.path===`steps.${h.id}.then`).error="glidesLast",delete h.values.then),!S.length&&i.first.then==="glides"&&(o["first.then"]="glidesLast",delete i.first.then)}for(const y of S)y.ok=Xn[f].fields.every(h=>!o[`${f}.${y.id}.${h.path}`]);d[f]={ids:I,cards:S}}const p=Object.keys(o).length===0;let m=null,g=null;if(p){const f=(I,S,y)=>({fromAge:S,amount:y&&I.amount===y.monthly?y.amount:Ps(I.amount,l),decline:I.then==="falls"?I.fallsPct:0,glideToNext:I.then==="glides"}),v=[f(i.first,s.first.fromAge,s.first),...d.steps.cards.map(I=>f(I.values,I.values.fromAge,I.saved))].sort((I,S)=>I.fromAge-S.fromAge);m=v,g=Ii(v,v[0].amount,s.ss,s.timing,s.ageNow,s.duration,s.now)}return{ok:p,values:i,lists:d,errors:o,applies:u,saved:s,shape:m,schedule:g}}const sa=["fromAge","amount","then","fallsPct"],ra=["label","amount","atAge","years","prices"],mn=(t,e,n)=>t.every(s=>Es(e[s]==null?null:e[s])===Es(n[s]==null?null:n[s]));function ia(t,e,n,s,r=null){const i=r&&t.amount===r.monthly?r.amount:Ps(t.amount,s),o=t.then==="falls"?t.fallsPct:0,l=t.then==="glides",a={...n||{},fromAge:e,amount:i};return(o>0||n&&"decline"in n)&&(a.decline=o),(l||n&&"glideToNext"in n)&&(a.glideToNext=l),a}function t0(t,e,n,s,r){const i=t.atAge-n,o=s[Math.min(Math.max(0,i),s.length-1)]||0,l=Math.round(wt(He(o,r)+t.amount,r)-wt(He(o,r),r));return{...e||{},label:t.label||"",amount:Math.max(1,l),year:i,years:t.years==null?1:t.years,indexation:t.prices==="fixed"?"level":"cpi"}}function bc(t,e,{today:n}){const s=yc(t,e,{today:n});if(!s.ok)return{ok:!1,errors:s.errors,patch:{},previous:{}};if(s.saved.locked)return{ok:!1,errors:{plan:"locked"},patch:{},previous:{}};const r=s.saved,i=r.bands,o={},l=mn(["amount","then","fallsPct"],{amount:s.values.first.amount,then:s.values.first.then,fallsPct:s.values.first.fallsPct==null?null:s.values.first.fallsPct},{amount:r.first.monthly,then:r.first.then,fallsPct:r.first.fallsPct}),a=s.lists.steps.cards,c=a.length===r.steps.length&&a.every((f,v)=>f.saved&&f.saved.id===r.steps[v].id&&mn(sa,{...f.values,fallsPct:f.values.fallsPct==null?null:f.values.fallsPct},{fromAge:f.saved.fromAge,amount:f.saved.monthly,then:f.saved.then,fallsPct:f.saved.fallsPct})),u=Array.isArray(r.ss.incomeSteps)?r.ss.incomeSteps:[];if(!l||!c){const f=(h,b)=>{const A=h.saved;return A&&A.row!=null&&mn(sa,{...h.values,fallsPct:h.values.fallsPct==null?null:h.values.fallsPct},{fromAge:A.fromAge,amount:A.monthly,then:A.then,fallsPct:A.fallsPct})?u[A.row]:ia(h.values,b,A&&A.row!=null?u[A.row]:null,i,A)},I=[l&&r.first.row!=null?u[r.first.row]:ia(s.values.first,r.first.fromAge,r.first.row!=null?u[r.first.row]:null,i,r.first),...a.map(h=>f(h,h.values.fromAge))].sort((h,b)=>+h.fromAge-+b.fromAge),S=+I[0].amount,y=Ii(I,S,r.ss,r.timing,r.ageNow,r.duration,r.now);o["stressTool.settings.incomeShape"]="phases",o["stressTool.settings.incomeSteps"]=I,o["stressTool.settings.targetSchedule"]=y,o["stressTool.settings.baseSalary"]=S,o["stressTool.settings.spendingProfile"]="flat",o["decisionTool.settings.baseSalary"]=S,o["decisionTool.settings.targetSchedule"]=y}const d=s.lists.costs.cards;if(!(d.length===r.costs.length&&d.every((f,v)=>f.saved&&f.saved.id===r.costs[v].id&&mn(ra,f.values,f.saved)))){const f=o["stressTool.settings.targetSchedule"]||r.schedule,v=new Set(r.costs.map(h=>h.row)),I=d.map(h=>{const b=h.saved;return b&&mn(ra,h.values,b)?r.xrows[b.row]:t0(h.values,b?r.xrows[b.row]:null,r.ageNow,f,i)}),S=[];let y=0;r.xrows.forEach((h,b)=>{v.has(b)?y<I.length&&S.push(I[y++]):S.push(h)}),S.push(...I.slice(y)),o["stressTool.settings.extraWithdrawals"]=S}const m={},g={};for(const f of Fc){if(!(f in o))continue;const v=Ws(t,f),I=o[f];Es(v)!==Es(I)&&(v===void 0&&f.endsWith(".spendingProfile")&&I==="flat"||(m[f]=ta(I),g[f]=ta(v)))}return{ok:!0,errors:{},patch:m,previous:g}}function Ac(t,e,n,s){const r=Rs(t);if(!r.length)return[];const i=e+n-1,o=c=>It(kn(r,c,r[0].amount),s),l=r.reduce((c,u,d)=>+u.fromAge<=e?d:c,0),a=r.map((c,u)=>({s:c,i:u})).filter(({s:c,i:u})=>u===l||+c.fromAge>e&&+c.fromAge<=i);return a.map(({s:c,i:u},d)=>{const p=Math.max(e,+c.fromAge),m=c.glideToNext&&r[u+1]?"glides":+c.decline>0?"falls":"level",g={fromAge:p,perMonth:o(p),yearly:Math.round(kn(r,p,r[0].amount)),then:m};if(m==="falls"){g.fallsPct=+c.decline;const f=a[d+1];g.endAge=f?+f.s.fromAge-1:i,g.endPerMonth=o(g.endAge)}else m==="glides"&&(g.endAge=+r[u+1].fromAge,g.endPerMonth=g.endAge<=i?o(g.endAge):It(+r[u+1].amount,s));return g})}function n0(t,e,n){const{ageNow:s,duration:r,bands:i,ss:o,timing:l,now:a}=n,c=n.budget.essentials,u=Array.from({length:r},(p,m)=>{const g=e[m]||0,f=It(g,i),v=Math.min(g,wi(o,l,s,m,a)),I=It(v,i);return{age:s+m,partnerAge:null,value:f,income:I,pots:Math.max(0,f-I),below:c!=null&&f<c-.005}}),d=u.find(p=>p.below);return{chart:{unit:"perMonth",years:u,essentials:c,layers:!0,couple:!1,gap:null,bands:{goSlow:75,noGo:85},list:Ac(t,s,r,i)},below:d?{age:d.age,amount:c}:null}}const s0=(t,e,n)=>H(t.firstTaxYear+(n-e));function r0(t,e,n,s){const{ageNow:r,timing:i,bands:o,ss:l,now:a,duration:c}=s,u=[];Ac(t,r,c,o).forEach((m,g)=>{const f={age:m.fromAge,monthly:N(m.perMonth),yearly:N(m.yearly)};m.then==="falls"?u.push({id:g===0?"first.falls":"step.falls",slots:{...f,pct:String(m.fallsPct),endMonthly:N(m.endPerMonth),endAge:m.endAge}}):m.then==="glides"?u.push({id:g===0?"first.glides":"step.glides",slots:{...f,toMonthly:N(m.endPerMonth),toAge:m.endAge}}):u.push({id:g===0?"first.level":"step.level",slots:f})});const p=Rs(t);for(let m=0;m<c;m++){const g=kn(p,r+m,p.length?p[0].amount:0),f=wi(l,i,r,m,a);if(f>g+.5){u.push({id:"floor.from",slots:{age:r+m,monthly:N(It(f,o))}});break}}for(const m of n){const g=m.atAge-r,f=e[Math.min(Math.max(0,g),e.length-1)]||0,v=m.gross!=null?m.gross:Math.round(wt(He(f,o)+m.amount,o)-wt(He(f,o),o));u.push({id:m.years>1?"cost.years":"cost.once",slots:{label:m.label||"One-off cost",net:N(m.amount),age:m.atAge,year:s0(i,r,m.atAge),years:m.years,gross:N(v),prices:m.prices}})}return s.strategyId==="floor-and-flex"&&u.push({id:"ff.note",slots:{}}),u}function i0(t,e){const n=e.budget.workedOut?Math.round(wt(e.budget.essentialsAnnualNet,e.bands)):0,s=Xy(t,e.ageNow,n).slice(1),r=[{path:"steps.ids",value:s.map((o,l)=>"n"+(l+1)).join(",")}];s.forEach((o,l)=>{const a="n"+(l+1);r.push({path:`steps.${a}.fromAge`,value:String(o.fromAge)},{path:`steps.${a}.amount`,value:String(It(o.amount,e.bands))},{path:`steps.${a}.then`,value:"level"})});const i=n>0&&s.some((o,l)=>o.amount>Math.round((l===0?.85:.7)*t/500)*500);return{edits:r,age75:e.ageNow<75?75:null,age85:e.ageNow<85?85:null,floor:i?It(n,e.bands):null}}function o0(t){return[]}function a0(t,e,{today:n,typed:s=null}={}){const r=(t||[]).filter(R=>R&&R.plan&&typeof R.plan=="object"&&R.plan.id!=null),i=r.find(R=>String(R.plan.id)===String(e))||null;if(!i)return{found:!1,id:String(e||"")};const o=i.plan,l=!!(i.newer||i.failed),a=ki(o,{today:n}),c=!a.locked&&!l,u=pc(o,{today:n}),d=yc(o,s||{},{today:n}),p={...u,...s||{}},m=a.bands,g=Aa.map(R=>({path:R.path,type:R.type,options:R.type==="choice"?R.path==="first.then"?Bc.filter(D=>D!=="glides"||d.lists.steps.cards.length>0||p["first.then"]==="glides"):R.options:null,applies:d.applies[R.path]!==!1,shown:Ze(p[R.path])?R.path==="first.then"?"level":"":String(p[R.path]),saved:R.path in u?u[R.path]:null,error:d.errors[R.path]||null})),f=d.values.first.amount!=null?d.values.first.amount:a.first.monthly,v=d.values.first.amount!=null&&d.values.first.amount!==a.first.monthly?Ps(d.values.first.amount,m):a.first.amount,I=(R,D)=>D>0&&R!=null?Math.round(R/D*100):null,S={};for(const R of va)S[R]={ids:d.lists[R].ids,cards:d.lists[R].cards.map(D=>{const k={};if(R==="steps"&&D.values.amount!=null&&(k.gross=N(D.saved&&D.values.amount===D.saved.monthly?D.saved.amount:Ps(D.values.amount,m))),R==="steps"&&D.values.amount!=null&&(k.ofStart=I(D.values.amount,f),k.ofBudget=a.budget.total?I(D.values.amount,a.budget.total):null),R==="steps"){const M=d.lists.steps.cards.filter(x=>x.values.fromAge!=null).sort((x,F)=>x.values.fromAge-F.values.fromAge).pop();k.last=!!M&&M.id===D.id}if(R==="costs"&&D.values.amount!=null&&D.values.atAge!=null){const M=d.schedule||a.schedule,x=D.values.atAge-a.ageNow,F=M[Math.min(Math.max(0,x),M.length-1)]||0;k.gross=N(Math.round(wt(He(F,m)+D.values.amount,m)-wt(He(F,m),m)))}return{id:D.id,saved:!!D.saved,fields:D.fields,...k}})};const y=d.ok?d.shape:a.plainSteps,h=d.ok?d.schedule:a.schedule,b=d.ok?d.lists.costs.cards.map(R=>({...R.values,years:R.values.years==null?1:R.values.years,gross:null})):a.costs,{chart:A,below:T}=n0(y,h,a),w=r0(y,h,b,a),_=r.filter(R=>R.plan.id!==o.id&&(R.plan.id===ea(o)||ea(R.plan)===o.id)).map(R=>({id:String(R.plan.id),name:Zo(R.plan)})),P=c&&d.ok?bc(o,s||{},{today:n}):{patch:{},previous:{}},E=c?i0(v,a):null;return{found:!0,id:String(o.id),name:Zo(o),locked:a.locked,lockedOn:a.lockedOn,readonly:l,editable:c,source:a.source,ageNow:a.ageNow,endAge:a.endAge,startAge:a.first.fromAge,flat:a.flat,firstGross:N(v),firstGrossSaved:N(a.first.amount),firstMonthly:N(f),budget:{workedOut:a.budget.workedOut,total:a.budget.total!=null?N(a.budget.total):null,totalValue:a.budget.total,essentials:a.budget.essentials!=null?N(a.budget.essentials):null,at:a.budget.at},fields:g,lists:S,errors:d.errors,ok:d.ok,derived:w,chart:A,below:T?{age:T.age,amount:N(T.amount)}:null,notUsed:o0(),floorAndFlex:a.strategyId==="floor-and-flex",partners:_,suggestion:E,changed:Object.keys(P.patch).length>0,patch:P.patch,previous:P.previous,savedLine:d.ok?{id:"spend",slots:{age:a.first.fromAge,monthly:N(f),steps:d.lists.steps.cards.length,costs:d.lists.costs.cards.length}}:null}}const Ie=t=>!!t&&typeof t=="object"&&!Array.isArray(t),pe=t=>t==null||t===""||!Number.isFinite(+t)?null:+t,on=t=>t==null||typeof t=="string"&&t.trim()==="",l0=t=>!!(t&&t.decisionTool&&t.decisionTool.settings&&t.decisionTool.settings.locked),oa=t=>t&&t.decisionTool&&t.decisionTool.settings&&t.decisionTool.settings.lockedAt||t&&t.planDocument&&t.planDocument.lockedAt||null,aa=t=>t&&t.planDetails&&typeof t.planDetails.name=="string"&&t.planDetails.name||t&&typeof t.name=="string"&&t.name||"",la=t=>t&&t.household&&typeof t.household.partnerScenarioId=="string"&&t.household.partnerScenarioId||null,ca=t=>t===void 0?void 0:JSON.parse(JSON.stringify(t)),Qn=t=>t===void 0?"<absent>":JSON.stringify(t),ne=t=>Math.round(+t||0),c0=Object.freeze(["ladder-and-ratchet","floor-and-flex","floor-the-schedule","floor-to-age","full-il-gilt","bridge-and-engine","gilt-rotation"]),vc=t=>c0.includes(t),u0=Object.freeze({equity:.5,bond:.4,cash:.1,div:0}),ua=Object.freeze({"stressTool.settings.diversifierStart":0,"stressTool.settings.potAtRetirement":null,"stressTool.settings.isaBalance":0,"stressTool.settings.isaDrawdownStrategy":mt.DRAWDOWN_STRATEGY,"stressTool.settings.taxableStart":0,"stressTool.settings.taxableMix":"equity","stressTool.settings.giaTaxBand":"basic","stressTool.settings.relevantEarnings":0,"stressTool.settings.bedAndIsa":!0,"stressTool.settings.chargesPct":0,"stressTool.settings.pa":ue.PERSONAL_ALLOWANCE,"stressTool.settings.brl":ue.BASIC_RATE_LIMIT,"stressTool.settings.hrl":ue.HIGHER_RATE_LIMIT,"stressTool.settings.taxMode":"inflates","stressTool.settings.accessMethod":"drawdown","stressTool.settings.ufplsYears":null,"stressTool.settings.ufplsThenPcls":!1,"stressTool.settings.bandFillRecycle":!1});function d0(t){const e=ne(t.equity),n=ne(t.bond),s=ne(t.cash),r=ne(t.div),i=e+n+s+r;return i>0?{equity:e/i,bond:n/i,cash:s/i,div:r/i}:{...u0}}function Tc(t,e){const n=ne(t),s=Math.round(n*e.equity),r=Math.round(n*e.bond),i=e.div>0?Math.round(n*e.div):0;return{equity:s,bond:r,div:i,cash:n-s-r-i}}function h0(t){const e=t&&Ie(t.fromAnswer)&&Array.isArray(t.fromAnswer.people)&&Ie(t.fromAnswer.people[0])?t.fromAnswer.people[0]:null;if(!e||!Ie(e.pension)||!Ie(e.pension.atStop)||!Ie(e.savings)||!Ie(e.savings.atStop))return null;const n=pe(e.pension.atStop.middling),s=pe(e.pension.atStop.careful),r=pe(e.savings.atStop.middling),i=pe(e.savings.atStop.careful);return n==null||s==null?null:{sipp:ne(n),sippBad:ne(s),isa:ne(r),isaBad:ne(i)}}function Ei(t,{today:e}){const n=kt(e),s=l0(t),r=s?t.planDocument:null,i=Hs(t,n),o=t&&t.stressTool&&Ie(t.stressTool.settings)?t.stressTool.settings:{};let l=jn(i,n);r&&Ie(r.timing)&&(l={...l,mode:r.timing.mode||l.mode});const a=r&&Ie(r.pots)?r.pots:null,c=r&&Ie(r.assumptions)?r.assumptions:null,u=a&&Ie(a.allocation)?a.allocation:i,d={equity:ne(u.equityMin),bond:ne(u.bondMin),cash:ne(u.cashTarget),div:ne(u.diversifierStart)},p=a&&pe(a.sipp)!=null?ne(a.sipp):d.equity+d.bond+d.cash+d.div,m=i.retired===!1&&l.mode==="future",g=r&&r.strategy&&r.strategy.id||i.strategyId||"pots-and-valves",f=vc(g),v=r&&r.strategy&&Ie(r.strategy.params)?r.strategy.params:Ie(i.strategyParams)?i.strategyParams:{},I=f&&pe(v.sippTotal)>0?{sipp:ne(v.sippTotal),isa:ne(v.isaTotal)}:null,S=(a&&Ie(a.allocation)?a.allocation.allocMode:i.allocMode)==="funds",y=a?Ie(a.potAtRetirement)?a.potAtRetirement:null:Ie(i.potAtRetirement)?i.potAtRetirement:null,h=y&&y.source==="override"?y:null,b=Qs(o)!=null,A=c&&"isaGrowth"in c?Qs(c)||null:Qs(i)||null,T=c&&"isaFromFunds"in c?!!c.isaFromFunds:Lm(i),w=fr(o.chargesPct),_=c&&fr(c.chargesPct)?c.chargesPct:Uc(i),P={pa:pe(c&&c.pa)??pe(i.pa)??ue.PERSONAL_ALLOWANCE,brl:pe(c&&c.brl)??pe(i.brl)??ue.BASIC_RATE_LIMIT,hrl:pe(c&&c.hrl)??pe(i.hrl)??ue.HIGHER_RATE_LIMIT},E=s?{kind:"locked",at:ee(oa(t))}:{kind:"saved",at:t&&t.lastModified?ee(t.lastModified):null},R={pension:p,pots:d,shares:d0(d),stopSipp:h&&pe(h.sipp)>0?ne(h.sipp):null,stopIsa:h&&pe(h.isa)>0?ne(h.isa):null,isa:a&&pe(a.isa)!=null?ne(a.isa):ne(i.isaBalance),isaGrowth:A,isaUse:a&&a.isaPolicy||i.isaDrawdownStrategy||mt.DRAWDOWN_STRATEGY,taxable:a&&pe(a.gia)!=null?ne(a.gia):ne(i.taxableStart),taxableMix:a&&a.taxableMix||(typeof i.taxableMix=="string"?i.taxableMix:i.taxableMix?"balanced":"equity"),giaBand:i.giaTaxBand||"basic",earnings:ne(i.relevantEarnings),bedAndIsa:i.bedAndIsa!==!1?"yes":"no",charges:_,pa:P.pa,brl:P.brl,hrl:P.hrl,taxMode:c&&c.taxMode||i.taxMode||"inflates",taxFree:i.accessMethod==="ufpls"?"ufpls":"drawdown",ufplsYears:pe(i.ufplsYears)>0?ne(i.ufplsYears):null,ufplsThenIsa:i.ufplsThenPcls?"yes":"no",bandFill:i.bandFillRecycle?"yes":"no"};return{locked:s,lockedOn:s?ee(oa(t)):null,ss:i,stored:o,timing:l,later:m,strategyId:g,bought:f,pinned:I,fundsMode:S,par:y,hasIsaGrowthKey:b,isaFunds:T,hasChargesKey:w,answer:m?h0(t):null,source:E,values:R,now:n}}function _c(t,{today:e}){const n=Ei(t,{today:e}),s=n.values,r={pension:String(s.pension),isa:String(s.isa),isaUse:s.isaUse,taxable:String(s.taxable),taxableMix:s.taxableMix,giaBand:s.giaBand,earnings:String(s.earnings),bedAndIsa:s.bedAndIsa,pa:String(s.pa),brl:String(s.brl),hrl:String(s.hrl),taxMode:s.taxMode,taxFree:s.taxFree,ufplsThenIsa:s.ufplsThenIsa,bandFill:s.bandFill};return s.stopSipp!=null&&(r.stopSipp=String(s.stopSipp)),s.stopIsa!=null&&(r.stopIsa=String(s.stopIsa)),s.isaGrowth&&(r.isaGrowth=s.isaGrowth),(n.hasChargesKey||!n.locked)&&(r.charges=String(s.charges)),s.ufplsYears!=null&&(r.ufplsYears=String(s.ufplsYears)),r}function f0(t,e){if(on(t))return{error:e.required?"required":null,value:e.default!=null?e.default:null};const n=String(t).replace(/[£,\s]/g,"");if(!/^\d{1,9}(\.\d{1,2})?$/.test(n))return{error:"notANumber",value:null};const s=Math.round(+n);return s<e.min?{error:"tooLow",value:s}:s>e.max?{error:"tooHigh",value:s}:{error:null,value:s}}function p0(t,e){if(on(t))return{error:e.required?"required":null,value:null};const n=String(t).trim();if(!/^\d{1,3}$/.test(n))return{error:"notANumber",value:null};const s=+n;return s<e.min?{error:"tooLow",value:s}:s>e.max?{error:"tooHigh",value:s}:{error:null,value:s}}function m0(t,e){if(on(t))return{error:e.required?"required":null,value:null};const n=String(t).replace(/[%\s]/g,"");if(!/^\d{1,2}(\.\d+)?$/.test(n))return{error:"notANumber",value:null};const s=+n;return s<e.min||s>e.max?{error:"range",value:s}:{error:null,value:Yc(s)}}function g0(t,e){if(e.type==="money")return f0(t,e);if(e.type==="count")return p0(t,e);if(e.type==="percent")return m0(t,e);if(on(t)&&e.required&&e.default==null)return{error:"required",value:null};const n=on(t)?e.default:String(t);return e.options.includes(n)?{error:null,value:n}:{error:"notAnOption",value:null}}const y0=t=>$r.find(e=>e.path===t);function Sc(t,e,{today:n}){const s=Ei(t,{today:n}),r={..._c(t,{today:n}),...e||{}},i={},o={},l={},a=d=>{const p=y0(d),m=g0(r[d],p);return m.error?o[d]=m.error:i[d]=m.value,m};for(const d of $r)l[d.path]=!0;l.pension=!s.fundsMode,l.pension&&a("pension"),l.stopSipp=s.later,l.stopIsa=s.later,s.later&&(a("stopSipp"),a("stopIsa")),a("isa"),l.isaGrowth=(s.hasIsaGrowthKey||!s.locked)&&!s.isaFunds,l.isaGrowth&&a("isaGrowth"),a("isaUse");const c=a("taxable"),u=c.error?s.values.taxable:c.value||0;return l.taxableMix=u>0,l.giaBand=u>0,l.taxableMix&&(a("taxableMix"),a("giaBand")),a("earnings"),l.bedAndIsa=(i.isaUse||s.values.isaUse)!=="hold",l.bedAndIsa&&a("bedAndIsa"),l.charges=s.hasChargesKey||!s.locked,l.charges&&a("charges"),a("pa"),a("brl"),a("hrl"),i.pa!=null&&i.brl!=null&&i.brl<=i.pa&&(o.brl="belowAllowance",delete i.brl),i.brl!=null&&i.hrl!=null&&i.hrl<=i.brl&&(o.hrl="belowBasic",delete i.hrl),a("taxMode"),a("taxFree"),l.ufplsYears=i.taxFree==="ufpls",l.ufplsThenIsa=i.taxFree==="ufpls",l.ufplsYears&&(a("ufplsYears"),a("ufplsThenIsa")),a("bandFill"),{ok:Object.keys(o).length===0,values:i,errors:o,applies:l,saved:s}}function wc(t,e,{today:n}){const s=Sc(t,e,{today:n});if(!s.ok)return{ok:!1,errors:s.errors,patch:{},previous:{}};if(s.saved.locked)return{ok:!1,errors:{plan:"locked"},patch:{},previous:{}};const r=s.saved,i=s.values,o=r.values,l={},a="stressTool.settings.";if(s.applies.pension&&i.pension!==o.pension){const d=Tc(i.pension,o.shares);l[a+"equityMin"]=d.equity,l[a+"bondMin"]=d.bond,l[a+"cashTarget"]=d.cash,o.pots.div>0&&(l[a+"diversifierStart"]=d.div)}if(r.later){const d=i.stopSipp||null,p=i.stopIsa||null;d||p?l[a+"potAtRetirement"]={sipp:d,isa:p,source:"override"}:r.par&&r.par.source==="override"&&(l[a+"potAtRetirement"]=null)}l[a+"isaBalance"]=i.isa||0,s.applies.isaGrowth&&(l[a+"isaGrowth"]=i.isaGrowth),l[a+"isaDrawdownStrategy"]=i.isaUse,l[a+"taxableStart"]=i.taxable||0,s.applies.taxableMix&&(l[a+"taxableMix"]=i.taxableMix,l[a+"giaTaxBand"]=i.giaBand),l[a+"relevantEarnings"]=i.earnings||0,s.applies.bedAndIsa&&(l[a+"bedAndIsa"]=i.bedAndIsa==="yes"),s.applies.charges&&(l[a+"chargesPct"]=i.charges),l[a+"pa"]=i.pa,l[a+"brl"]=i.brl,l[a+"hrl"]=i.hrl,l[a+"taxMode"]=i.taxMode,l[a+"accessMethod"]=i.taxFree,s.applies.ufplsYears&&(l[a+"ufplsYears"]=i.ufplsYears||null,l[a+"ufplsThenPcls"]=i.ufplsThenIsa==="yes"),l[a+"bandFillRecycle"]=i.bandFill==="yes";const c={},u={};for(const d of Gc){if(!(d in l))continue;const p=Ws(t,d),m=l[d];Qn(p)!==Qn(m)&&(p===void 0&&d in ua&&Qn(ua[d])===Qn(m)||(c[d]=ca(m),u[d]=ca(p)))}return{ok:!0,errors:{},patch:c,previous:u}}function b0(t){return vc(t)?["taxFree","ufplsYears","ufplsThenIsa","bandFill","earnings","bedAndIsa"]:[]}function A0(t,e,{stopBlanked:n=!1}={}){const s=[],r=e.fundsMode?e.values.pension:t.pension;if(s.push(t.taxable>0?{id:"pots.todayTaxable",slots:{pension:N(r),isa:N(t.isa),taxable:N(t.taxable)}}:{id:"pots.today",slots:{pension:N(r),isa:N(t.isa)}}),e.fundsMode)s.push({id:"pots.fromFunds",slots:{pension:N(e.values.pension)}});else{const i=r===e.values.pension?e.values.pots:Tc(r,e.values.shares);s.push({id:"pots.split",slots:{shares:N(i.equity),bonds:N(i.bond),cash:N(i.cash),div:i.div>0?", "+N(i.div)+" diversifiers":""}})}return e.pinned&&s.push({id:"pots.pinned",slots:{pension:N(e.pinned.sipp),isa:N(e.pinned.isa)}}),e.later&&(t.stopSipp||t.stopIsa?s.push({id:"stop.typed",slots:{sipp:t.stopSipp?N(t.stopSipp):"none typed",isa:t.stopIsa?N(t.stopIsa):"none typed"}}):n?s.push({id:"stop.blanked",slots:{}}):e.par&&e.par.source!=="override"&&(pe(e.par.sipp)>0||pe(e.par.isa)>0)?s.push({id:"stop.projection",slots:{sipp:N(e.par.sipp),isa:N(e.par.isa)}}):e.answer||s.push({id:"stop.none",slots:{}}),e.answer&&s.push({id:"stop.answer",slots:{sipp:N(e.answer.sipp),sippBad:N(e.answer.sippBad),isa:N(e.answer.isa),isaBad:N(e.answer.isaBad)}})),e.isaFunds?s.push({id:"isa.funds",slots:{}}):t.isaGrowth?s.push({id:t.isaGrowth==="invested"?"isa.invested":"isa.cash",slots:{}}):s.push({id:"isa.fixed",slots:{}}),s.push({id:"isa.use."+t.isaUse,slots:{}}),e.locked&&!e.hasChargesKey?s.push({id:"charges.locked",slots:{}}):t.charges>0?s.push({id:"charges.some",slots:{pct:String(t.charges)}}):s.push({id:"charges.none",slots:{}}),s.push({id:"tax.bands",slots:{pa:N(t.pa),brl:N(t.brl),hrl:N(t.hrl),mode:t.taxMode}}),t.taxFree==="ufpls"?s.push({id:"tax.free.ufpls",slots:{years:t.ufplsYears!=null?String(t.ufplsYears):"",then:t.ufplsThenIsa}}):s.push({id:"tax.free.drawdown",slots:{}}),t.bandFill==="yes"&&s.push({id:"tax.bandFill",slots:{}}),s.push({id:"tax.saves",slots:{}}),s}function v0(t,e,{today:n,typed:s=null}={}){const r=(t||[]).filter(h=>h&&h.plan&&typeof h.plan=="object"&&h.plan.id!=null),i=r.find(h=>String(h.plan.id)===String(e))||null;if(!i)return{found:!1,id:String(e||"")};const o=i.plan,l=!!(i.newer||i.failed),a=Ei(o,{today:n}),c=!a.locked&&!l,u=_c(o,{today:n}),d=Sc(o,s||{},{today:n}),p={...u,...s||{}},m=$r.map(h=>({path:h.path,type:h.type,options:h.type==="choice"?h.options:null,applies:d.applies[h.path]!==!1,shown:on(p[h.path])?h.type==="choice"&&h.default!=null?h.default:"":String(p[h.path]),saved:h.path in u?u[h.path]:null,error:d.errors[h.path]||null})),g=d.ok?{...a.values,...d.values}:a.values,f=d.ok&&a.later&&!d.values.stopSipp&&!d.values.stopIsa&&!!a.par&&a.par.source==="override",v=A0(g,a,{stopBlanked:f}),I={};a.bought&&(I.isaGrowth="isaGrowthBought"),a.pinned&&(I.pension="pinned",I.isa="pinned"),a.isaFunds&&(I.isaGrowth="isaFunds"),a.locked&&!a.hasChargesKey&&(I.charges="chargesLocked"),a.locked&&!a.hasIsaGrowthKey&&!a.isaFunds&&(I.isaGrowth="isaGrowthLocked");const S=r.filter(h=>h.plan.id!==o.id&&(h.plan.id===la(o)||la(h.plan)===o.id)).map(h=>({id:String(h.plan.id),name:aa(h.plan)})),y=c&&d.ok?wc(o,s||{},{today:n}):{patch:{},previous:{}};return{found:!0,id:String(o.id),name:aa(o),locked:a.locked,lockedOn:a.lockedOn,readonly:l,editable:c,source:a.source,later:a.later,bought:a.bought,fundsMode:a.fundsMode,fields:m,errors:d.errors,ok:d.ok,derived:v,notUsed:b0(a.strategyId),useNotes:I,partners:S,changed:Object.keys(y.patch).length>0,patch:y.patch,previous:y.previous,savedLine:d.ok?{id:"pots",slots:{pension:N(a.fundsMode?a.values.pension:d.values.pension),isa:N(d.values.isa||0),charges:String(d.applies.charges?d.values.charges:a.values.charges)}}:null}}const hr="pt_guest_scenarios",T0=15e3,_0=new Set($c);function da(t){for(const e of Object.keys(t))if(!_0.has(e))throw new Error('planWrite: "'+e+'" is not a declared field path');return t}function S0(t,{win:e=null,session:n=null,local:s=null,now:r=()=>new Date,fb:i=null,handles:o}){const l=i||{doc:Yp,updateDoc:nm};let a=!1,c=!1,u=null;const d=b=>{a||t.dispatch(b)},p=(b,A)=>d({type:X.PLAN_SAVE_FAILED,planId:b,problem:A}),m=b=>{!e||typeof e.setTimeout!="function"||(u&&e.clearTimeout(u),u=e.setTimeout(()=>{u=null,b()},T0))};function g(b,A){const T=b.plans,w=T&&Array.isArray(T.list)?T.list.find(P=>P&&P.plan&&String(P.plan.id)===String(A)):null;if(!w)return{problem:"notHere"};if(w.newer||w.failed)return{problem:"readonly"};const _=o()||{};return b.session.kind==="in"&&_.user&&_.db&&T.source==="account"?{kind:"account",entry:w,db:_.db,uid:_.user.uid,reread:_.reread}:b.session.kind==="nobody"&&T.source==="window"?Fl(Bl(s))?{problem:"usedUp"}:{kind:"window",entry:w}:{problem:"nobody"}}function f(b,A){return sn(b&&b.decisionTool&&b.decisionTool.settings)?!0:!!sg(b,A,Rr())}async function v(b,A,T){if(b.kind==="account")return await l.updateDoc(l.doc(b.db,"users",b.uid,"scenarios",String(A)),T),!0;let w=null;try{w=n?n.getItem(hr):null}catch{return!1}let _=null;try{_=JSON.parse(w)}catch{_=null}if(!Array.isArray(_))return!1;const P=_.findIndex(R=>R&&String(R.id)===String(A));if(P<0)return!1;_[P]=py(_[P],T);const E=JSON.stringify(_);try{return n.setItem(hr,E),n.getItem(hr)===E}catch{return!1}}function I(b){const A=b.route,T=A&&A.screen==="plan"&&(A.step==="income"||A.step==="spend"||A.step==="pots")?A.step:"about";return{step:T,patchOf:T==="income"?fc:T==="spend"?bc:T==="pots"?wc:rc}}async function S(b){let A=t.getState();const{step:T,patchOf:w}=I(A);let _=g(A,b);if(_.problem){p(b,_.problem);return}if(_.kind==="account"){try{await _.reread()}catch{}if(a)return;if(A=t.getState(),_=g(A,b),_.problem){p(b,_.problem);return}}const P=_.entry.plan,E=A.draft.plan&&A.draft.plan.id===String(b)?A.draft.plan:null,R=E?E.values:{};if(sn(P.decisionTool&&P.decisionTool.settings)){p(b,"locked");return}const D=w(P,R,{today:A.env.today});if(!D.ok){p(b,D.errors.plan==="locked"?"locked":"problems");return}const k=A.plans.view&&A.plans.view.page&&A.plans.view.page[T]&&A.plans.view.page.forId===String(b)?A.plans.view.page[T]:null,M=k&&k.savedLine?k.savedLine:null;if(!Object.keys(D.patch).length){d({type:X.PLAN_SAVED,planId:b,previous:{},line:M}),m(()=>d({type:X.PLAN_TOAST_CLOSE}));return}const x=da({...D.patch,lastModified:r().toISOString()});if(f(P,x)){p(b,"locked");return}let F=!1;try{F=await v(_,b,x)}catch{F=!1}if(!a){if(!F){p(b,_.kind==="window"?"storage":"failed");return}d({type:X.PLAN_SAVED,planId:b,previous:{...D.previous,lastModified:P.lastModified},line:M}),d({type:X.PLANS_READING}),m(()=>d({type:X.PLAN_TOAST_CLOSE}))}}async function y(b,A){const T=t.getState(),w=g(T,b);if(w.problem){p(b,w.problem);return}const _=w.entry.plan,P={};for(const[D,k]of Object.entries(A||{}))P[D]=k===void 0&&w.kind==="account"?null:k;(!("lastModified"in P)||P.lastModified==null)&&(P.lastModified=r().toISOString());const E=da(P);if(f(_,Object.fromEntries(Object.entries(E).map(([D,k])=>[D,k===void 0?null:k])))){p(b,"locked");return}let R=!1;try{R=await v(w,b,E)}catch{R=!1}if(!a){if(!R){p(b,w.kind==="window"?"storage":"failed");return}d({type:X.PLAN_UNDO_DONE,planId:b}),d({type:X.PLANS_READING}),m(()=>d({type:X.PLAN_TOAST_CLOSE}))}}const h=t.subscribe((b,A)=>{if(c)return;const T=b.ui.saving;T&&(A.type===X.PLAN_SAVE&&T.kind==="save"?(c=!0,S(T.planId).catch(()=>p(T.planId,"failed")).finally(()=>{c=!1})):A.type===X.PLAN_UNDO&&T.kind==="undo"&&(c=!0,y(T.planId,T.previous).catch(()=>p(T.planId,"failed")).finally(()=>{c=!1})))});return()=>{a=!0,h(),u&&e&&e.clearTimeout(u)}}const w0="pt_guest_scenarios",I0="pt-preview",k0=60*1e3;function ha(t,e){const n=[];for(const s of t){if(!s||typeof s!="object"||s.id==null)continue;let r;try{r=Rm(s,{now:e})}catch(i){r={scenario:s,newer:!1,error:i}}n.push({plan:r.scenario&&typeof r.scenario=="object"?r.scenario:s,newer:!!r.newer,failed:!!r.error})}return n}function E0(t){if(!t)return[];let e=null;try{e=t.getItem(w0)}catch{return[]}if(!e)return[];try{const n=JSON.parse(e);return Array.isArray(n)?n:[]}catch{return[]}}const fa=t=>String(t.getHours()).padStart(2,"0")+":"+String(t.getMinutes()).padStart(2,"0");function P0(t){const e=t.plans;if(!e||e.status!=="read")return null;const n=t.env.today,s=by(e.list,{today:n,source:e.source}).groups,r=t.route;let i=null;if(r&&r.screen==="plan"&&r.planId&&(i={...Dy(e.list,r.planId,r.step,{today:n,source:e.source}),forId:r.planId,forStep:r.step||null},r.step==="about"||r.step==="income"||r.step==="spend"||r.step==="pots")){const o=t.draft&&t.draft.plan&&t.draft.plan.id===r.planId?t.draft.plan:null,l=o?o.values:{},a=r.step==="about"?yy:r.step==="income"?qy:r.step==="spend"?a0:v0;i[r.step]={...a(e.list,r.planId,{today:n,typed:l}),draftKey:JSON.stringify(l)}}return{today:n,rows:s,page:i}}function C0(t,{win:e,local:n=null,session:s=null,now:r=()=>new Date,fb:i=null,fbWrite:o=null}){const l=i||{initializeApp:Ra,getAuth:Rf,setPersistence:ph,browserLocalPersistence:sl,onAuthStateChanged:yh,signOut:bh,getFirestore:Fp,collection:Gp,getDocs:tm,isFirebaseConfigured:sm},a=[];let c,u=!1;const d=_=>{u||t.dispatch(_)};d({type:X.SESSION_SET,session:{kind:"checking",email:null}});function p(){const _=ha(E0(s),r());d({type:X.PLANS_SET,list:_,source:"window",readAt:fa(r()),usedUp:Fl(Bl(n))})}let m=null,g=null;if(!l.isFirebaseConfigured())c=null,d({type:X.SESSION_SET,session:{kind:"nobody",email:null}}),p();else{const _=l.initializeApp(Nl,I0);m=l.getAuth(_),Promise.resolve(l.setPersistence(m,l.browserLocalPersistence)).catch(()=>{}),g=l.getFirestore(_)}async function f(){if(!c||!g)return;const _=c.uid;try{const P=await l.getDocs(l.collection(g,"users",_,"scenarios")),E=[];if(P.forEach(R=>{E.push({id:R.id,...R.data()})}),u||!c||c.uid!==_)return;d({type:X.PLANS_SET,list:ha(E,r()),source:"account",readAt:fa(r())})}catch{u||d({type:X.PLANS_FAILED})}}function v(){c!==void 0&&(c===null?p():c.emailVerified&&f())}function I(){try{n&&n.removeItem(Wc)}catch{}try{s&&s.removeItem(Hc)}catch{}}async function S(){I(),d({type:X.PLANS_CLEAR});try{m&&await l.signOut(m)}catch{}!u&&c&&(c=null,d({type:X.SESSION_SET,session:{kind:"nobody",email:null}}),p())}if(m){const _=l.onAuthStateChanged(m,P=>{if(u)return;const E=c;c=P||null,P?P.emailVerified?(d({type:X.SESSION_SET,session:{kind:"in",email:P.email||null}}),f()):d({type:X.SESSION_SET,session:{kind:"unverified",email:P.email||null}}):(d({type:X.SESSION_SET,session:{kind:"nobody",email:null}}),E&&I(),p())});a.push(()=>{try{_()}catch{}})}let y=null;const h=_=>{const P=_.plans&&_.plans.status==="read"?[_.plans.list,_.route,_.env.today,_.draft&&_.draft.plan]:null;if(!P){y=null;return}if(y&&P.every((R,D)=>R===y[D]))return;y=P;let E=null;try{E=P0(_)}catch{E={today:_.env.today,rows:[],page:null}}E&&d({type:X.PLANS_VIEW,view:E})};h(t.getState()),a.push(S0(t,{win:e,session:s,local:n,now:r,fb:o,handles:()=>({db:g,user:c||null,reread:()=>c&&g?f():Promise.resolve()})})),a.push(t.subscribe((_,P)=>{P.type===X.PLANS_READING&&v(),P.type===X.SESSION_OUT&&_.session.signingOut&&S(),h(_)}));const b=()=>d({type:X.PLANS_CLEAR}),A=_=>{_&&_.persisted&&(c!==void 0&&d({type:X.SESSION_SET,session:c?{kind:c.emailVerified?"in":"unverified",email:c.email||null}:{kind:"nobody",email:null}}),v())},T=()=>{e.document&&e.document.visibilityState==="visible"&&t.getState().plans===null&&v()};e.addEventListener("pagehide",b),e.addEventListener("pageshow",A),e.document&&e.document.addEventListener("visibilitychange",T),a.push(()=>{e.removeEventListener("pagehide",b),e.removeEventListener("pageshow",A),e.document&&e.document.removeEventListener("visibilitychange",T)});const w=e.setInterval(()=>{if(!c||!n)return;const _=jc(n);_&&r().getTime()-_>Kc&&S()},k0);return a.push(()=>e.clearInterval(w)),()=>{u=!0,a.splice(0).forEach(_=>_())}}export{I0 as APP_NAME,w0 as GUEST_PLANS_KEY,C0 as startPlanSource,ha as upgradedList,P0 as viewFor,E0 as windowPlans};
