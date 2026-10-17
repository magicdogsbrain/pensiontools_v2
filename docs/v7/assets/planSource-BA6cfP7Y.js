import{f as Sl,aa as Eo,e as Il,ab as ko,b as Vt,S as Ue,D as de,T as be,ac as wl,ad as El,ae as kl,af as Pl,ag as Rl,ah as Po,ai as $r,aj as Dl,ak as Ro,al as ys,am as Zs,an as Ol,ao as jr,ap as Ml,R as ct,aq as Nl,ar as ei,as as xl,o as Cl,h as Ll,at as Q,au as Vl,av as Bl,aw as Fl,ax as Ul,ay as Gl}from"./index-C2fTx27E.js";import{B as Rt,F as Yl,l as $l,S as an,j as jl,G as Kl}from"./SpendingModel-B2FKV7lF.js";var ti={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Do=function(t){const e=[];let n=0;for(let r=0;r<t.length;r++){let s=t.charCodeAt(r);s<128?e[n++]=s:s<2048?(e[n++]=s>>6|192,e[n++]=s&63|128):(s&64512)===55296&&r+1<t.length&&(t.charCodeAt(r+1)&64512)===56320?(s=65536+((s&1023)<<10)+(t.charCodeAt(++r)&1023),e[n++]=s>>18|240,e[n++]=s>>12&63|128,e[n++]=s>>6&63|128,e[n++]=s&63|128):(e[n++]=s>>12|224,e[n++]=s>>6&63|128,e[n++]=s&63|128)}return e},Wl=function(t){const e=[];let n=0,r=0;for(;n<t.length;){const s=t[n++];if(s<128)e[r++]=String.fromCharCode(s);else if(s>191&&s<224){const i=t[n++];e[r++]=String.fromCharCode((s&31)<<6|i&63)}else if(s>239&&s<365){const i=t[n++],o=t[n++],l=t[n++],a=((s&7)<<18|(i&63)<<12|(o&63)<<6|l&63)-65536;e[r++]=String.fromCharCode(55296+(a>>10)),e[r++]=String.fromCharCode(56320+(a&1023))}else{const i=t[n++],o=t[n++];e[r++]=String.fromCharCode((s&15)<<12|(i&63)<<6|o&63)}}return e.join("")},Oo={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<t.length;s+=3){const i=t[s],o=s+1<t.length,l=o?t[s+1]:0,a=s+2<t.length,c=a?t[s+2]:0,u=i>>2,d=(i&3)<<4|l>>4;let h=(l&15)<<2|c>>6,y=c&63;a||(y=64,o||(h=64)),r.push(n[u],n[d],n[h],n[y])}return r.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(Do(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):Wl(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let s=0;s<t.length;){const i=n[t.charAt(s++)],l=s<t.length?n[t.charAt(s)]:0;++s;const c=s<t.length?n[t.charAt(s)]:64;++s;const d=s<t.length?n[t.charAt(s)]:64;if(++s,i==null||l==null||c==null||d==null)throw new Hl;const h=i<<2|l>>4;if(r.push(h),c!==64){const y=l<<4&240|c>>2;if(r.push(y),d!==64){const m=c<<6&192|d;r.push(m)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class Hl extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const zl=function(t){const e=Do(t);return Oo.encodeByteArray(e,!0)},$n=function(t){return zl(t).replace(/\./g,"")},Mo=function(t){try{return Oo.decodeString(t,!0)}catch{}return null};/**
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
 */function ql(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const Jl=()=>ql().__FIREBASE_DEFAULTS__,Ql=()=>{if(typeof process>"u"||typeof ti>"u")return;const t=ti.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},Xl=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&Mo(t[1]);return e&&JSON.parse(e)},_s=()=>{try{return Jl()||Ql()||Xl()}catch{return}},No=t=>{var e,n;return(n=(e=_s())===null||e===void 0?void 0:e.emulatorHosts)===null||n===void 0?void 0:n[t]},Zl=t=>{const e=No(t);if(!e)return;const n=e.lastIndexOf(":");if(n<=0||n+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(n+1),10);return e[0]==="["?[e.substring(1,n-1),r]:[e.substring(0,n),r]},xo=()=>{var t;return(t=_s())===null||t===void 0?void 0:t.config},Co=t=>{var e;return(e=_s())===null||e===void 0?void 0:e[`_${t}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ec{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,r))}}}/**
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
 */function tc(t,e){if(t.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n={alg:"none",type:"JWT"},r=e||"demo-project",s=t.iat||0,i=t.sub||t.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:s,exp:s+3600,auth_time:s,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}}},t);return[$n(JSON.stringify(n)),$n(JSON.stringify(o)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ie(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function nc(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Ie())}function rc(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function sc(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function ic(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function oc(){const t=Ie();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function ac(){try{return typeof indexedDB=="object"}catch{return!1}}function lc(){return new Promise((t,e)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),n||self.indexedDB.deleteDatabase(r),t(!0)},s.onupgradeneeded=()=>{n=!1},s.onerror=()=>{var i;e(((i=s.error)===null||i===void 0?void 0:i.message)||"")}}catch(n){e(n)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cc="FirebaseError";class Xe extends Error{constructor(e,n,r){super(n),this.code=e,this.customData=r,this.name=cc,Object.setPrototypeOf(this,Xe.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,In.prototype.create)}}class In{constructor(e,n,r){this.service=e,this.serviceName=n,this.errors=r}create(e,...n){const r=n[0]||{},s=`${this.service}/${e}`,i=this.errors[e],o=i?uc(i,r):"Error",l=`${this.serviceName}: ${o} (${s}).`;return new Xe(s,l,r)}}function uc(t,e){return t.replace(dc,(n,r)=>{const s=e[r];return s!=null?String(s):`<${r}?>`})}const dc=/\{\$([^}]+)}/g;function hc(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function jn(t,e){if(t===e)return!0;const n=Object.keys(t),r=Object.keys(e);for(const s of n){if(!r.includes(s))return!1;const i=t[s],o=e[s];if(ni(i)&&ni(o)){if(!jn(i,o))return!1}else if(i!==o)return!1}for(const s of r)if(!n.includes(s))return!1;return!0}function ni(t){return t!==null&&typeof t=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wn(t){const e=[];for(const[n,r]of Object.entries(t))Array.isArray(r)?r.forEach(s=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function fc(t,e){const n=new pc(t,e);return n.subscribe.bind(n)}class pc{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,r){let s;if(e===void 0&&n===void 0&&r===void 0)throw new Error("Missing Observer.");mc(e,["next","error","complete"])?s=e:s={next:e,error:n,complete:r},s.next===void 0&&(s.next=Rr),s.error===void 0&&(s.error=Rr),s.complete===void 0&&(s.complete=Rr);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch{}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function mc(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function Rr(){}/**
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
 */function ye(t){return t&&t._delegate?t._delegate:t}class St{constructor(e,n,r){this.name=e,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _t="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gc{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const r=new ec;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:n});s&&r.resolve(s)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){var n;const r=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),s=(n=e==null?void 0:e.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(i){if(s)return null;throw i}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(_c(e))try{this.getOrInitializeService({instanceIdentifier:_t})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(n);try{const i=this.getOrInitializeService({instanceIdentifier:s});r.resolve(i)}catch{}}}}clearInstance(e=_t){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=_t){return this.instances.has(e)}getOptions(e=_t){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[i,o]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(i);r===l&&o.resolve(s)}return s}onInit(e,n){var r;const s=this.normalizeInstanceIdentifier(n),i=(r=this.onInitCallbacks.get(s))!==null&&r!==void 0?r:new Set;i.add(e),this.onInitCallbacks.set(s,i);const o=this.instances.get(s);return o&&e(o,s),()=>{i.delete(e)}}invokeOnInitCallbacks(e,n){const r=this.onInitCallbacks.get(n);if(r)for(const s of r)try{s(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:yc(e),options:n}),this.instances.set(e,r),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=_t){return this.component?this.component.multipleInstances?e:_t:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function yc(t){return t===_t?void 0:t}function _c(t){return t.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tc{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new gc(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var q;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(q||(q={}));const bc={debug:q.DEBUG,verbose:q.VERBOSE,info:q.INFO,warn:q.WARN,error:q.ERROR,silent:q.SILENT},vc=q.INFO,Ac={[q.DEBUG]:"log",[q.VERBOSE]:"log",[q.INFO]:"info",[q.WARN]:"warn",[q.ERROR]:"error"},Sc=(t,e,...n)=>{if(e<t.logLevel)return;const r=new Date().toISOString(),s=Ac[e];if(!s)throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Ts{constructor(e){this.name=e,this._logLevel=vc,this._logHandler=Sc,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in q))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?bc[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,q.DEBUG,...e),this._logHandler(this,q.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,q.VERBOSE,...e),this._logHandler(this,q.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,q.INFO,...e),this._logHandler(this,q.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,q.WARN,...e),this._logHandler(this,q.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,q.ERROR,...e),this._logHandler(this,q.ERROR,...e)}}const Ic=(t,e)=>e.some(n=>t instanceof n);let ri,si;function wc(){return ri||(ri=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Ec(){return si||(si=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Lo=new WeakMap,Kr=new WeakMap,Vo=new WeakMap,Dr=new WeakMap,bs=new WeakMap;function kc(t){const e=new Promise((n,r)=>{const s=()=>{t.removeEventListener("success",i),t.removeEventListener("error",o)},i=()=>{n(ut(t.result)),s()},o=()=>{r(t.error),s()};t.addEventListener("success",i),t.addEventListener("error",o)});return e.then(n=>{n instanceof IDBCursor&&Lo.set(n,t)}).catch(()=>{}),bs.set(e,t),e}function Pc(t){if(Kr.has(t))return;const e=new Promise((n,r)=>{const s=()=>{t.removeEventListener("complete",i),t.removeEventListener("error",o),t.removeEventListener("abort",o)},i=()=>{n(),s()},o=()=>{r(t.error||new DOMException("AbortError","AbortError")),s()};t.addEventListener("complete",i),t.addEventListener("error",o),t.addEventListener("abort",o)});Kr.set(t,e)}let Wr={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return Kr.get(t);if(e==="objectStoreNames")return t.objectStoreNames||Vo.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return ut(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function Rc(t){Wr=t(Wr)}function Dc(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const r=t.call(Or(this),e,...n);return Vo.set(r,e.sort?e.sort():[e]),ut(r)}:Ec().includes(t)?function(...e){return t.apply(Or(this),e),ut(Lo.get(this))}:function(...e){return ut(t.apply(Or(this),e))}}function Oc(t){return typeof t=="function"?Dc(t):(t instanceof IDBTransaction&&Pc(t),Ic(t,wc())?new Proxy(t,Wr):t)}function ut(t){if(t instanceof IDBRequest)return kc(t);if(Dr.has(t))return Dr.get(t);const e=Oc(t);return e!==t&&(Dr.set(t,e),bs.set(e,t)),e}const Or=t=>bs.get(t);function Mc(t,e,{blocked:n,upgrade:r,blocking:s,terminated:i}={}){const o=indexedDB.open(t,e),l=ut(o);return r&&o.addEventListener("upgradeneeded",a=>{r(ut(o.result),a.oldVersion,a.newVersion,ut(o.transaction),a)}),n&&o.addEventListener("blocked",a=>n(a.oldVersion,a.newVersion,a)),l.then(a=>{i&&a.addEventListener("close",()=>i()),s&&a.addEventListener("versionchange",c=>s(c.oldVersion,c.newVersion,c))}).catch(()=>{}),l}const Nc=["get","getKey","getAll","getAllKeys","count"],xc=["put","add","delete","clear"],Mr=new Map;function ii(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(Mr.get(e))return Mr.get(e);const n=e.replace(/FromIndex$/,""),r=e!==n,s=xc.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(s||Nc.includes(n)))return;const i=async function(o,...l){const a=this.transaction(o,s?"readwrite":"readonly");let c=a.store;return r&&(c=c.index(l.shift())),(await Promise.all([c[n](...l),s&&a.done]))[0]};return Mr.set(e,i),i}Rc(t=>({...t,get:(e,n,r)=>ii(e,n)||t.get(e,n,r),has:(e,n)=>!!ii(e,n)||t.has(e,n)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cc{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(Lc(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function Lc(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Hr="@firebase/app",oi="0.10.13";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ze=new Ts("@firebase/app"),Vc="@firebase/app-compat",Bc="@firebase/analytics-compat",Fc="@firebase/analytics",Uc="@firebase/app-check-compat",Gc="@firebase/app-check",Yc="@firebase/auth",$c="@firebase/auth-compat",jc="@firebase/database",Kc="@firebase/data-connect",Wc="@firebase/database-compat",Hc="@firebase/functions",zc="@firebase/functions-compat",qc="@firebase/installations",Jc="@firebase/installations-compat",Qc="@firebase/messaging",Xc="@firebase/messaging-compat",Zc="@firebase/performance",eu="@firebase/performance-compat",tu="@firebase/remote-config",nu="@firebase/remote-config-compat",ru="@firebase/storage",su="@firebase/storage-compat",iu="@firebase/firestore",ou="@firebase/vertexai-preview",au="@firebase/firestore-compat",lu="firebase",cu="10.14.1";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zr="[DEFAULT]",uu={[Hr]:"fire-core",[Vc]:"fire-core-compat",[Fc]:"fire-analytics",[Bc]:"fire-analytics-compat",[Gc]:"fire-app-check",[Uc]:"fire-app-check-compat",[Yc]:"fire-auth",[$c]:"fire-auth-compat",[jc]:"fire-rtdb",[Kc]:"fire-data-connect",[Wc]:"fire-rtdb-compat",[Hc]:"fire-fn",[zc]:"fire-fn-compat",[qc]:"fire-iid",[Jc]:"fire-iid-compat",[Qc]:"fire-fcm",[Xc]:"fire-fcm-compat",[Zc]:"fire-perf",[eu]:"fire-perf-compat",[tu]:"fire-rc",[nu]:"fire-rc-compat",[ru]:"fire-gcs",[su]:"fire-gcs-compat",[iu]:"fire-fst",[au]:"fire-fst-compat",[ou]:"fire-vertex","fire-js":"fire-js",[lu]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kn=new Map,du=new Map,qr=new Map;function ai(t,e){try{t.container.addComponent(e)}catch(n){ze.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function Yt(t){const e=t.name;if(qr.has(e))return ze.debug(`There were multiple attempts to register component ${e}.`),!1;qr.set(e,t);for(const n of Kn.values())ai(n,t);for(const n of du.values())ai(n,t);return!0}function vs(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function lt(t){return t.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hu={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},dt=new In("app","Firebase",hu);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fu{constructor(e,n,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new St("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw dt.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qt=cu;function Bo(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const r=Object.assign({name:zr,automaticDataCollectionEnabled:!1},e),s=r.name;if(typeof s!="string"||!s)throw dt.create("bad-app-name",{appName:String(s)});if(n||(n=xo()),!n)throw dt.create("no-options");const i=Kn.get(s);if(i){if(jn(n,i.options)&&jn(r,i.config))return i;throw dt.create("duplicate-app",{appName:s})}const o=new Tc(s);for(const a of qr.values())o.addComponent(a);const l=new fu(n,r,o);return Kn.set(s,l),l}function Fo(t=zr){const e=Kn.get(t);if(!e&&t===zr&&xo())return Bo();if(!e)throw dt.create("no-app",{appName:t});return e}function ht(t,e,n){var r;let s=(r=uu[t])!==null&&r!==void 0?r:t;n&&(s+=`-${n}`);const i=s.match(/\s|\//),o=e.match(/\s|\//);if(i||o){const l=[`Unable to register library "${s}" with version "${e}":`];i&&l.push(`library name "${s}" contains illegal characters (whitespace or "/")`),i&&o&&l.push("and"),o&&l.push(`version name "${e}" contains illegal characters (whitespace or "/")`),ze.warn(l.join(" "));return}Yt(new St(`${s}-version`,()=>({library:s,version:e}),"VERSION"))}/**
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
 */const pu="firebase-heartbeat-database",mu=1,mn="firebase-heartbeat-store";let Nr=null;function Uo(){return Nr||(Nr=Mc(pu,mu,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(mn)}catch{}}}}).catch(t=>{throw dt.create("idb-open",{originalErrorMessage:t.message})})),Nr}async function gu(t){try{const n=(await Uo()).transaction(mn),r=await n.objectStore(mn).get(Go(t));return await n.done,r}catch(e){if(e instanceof Xe)ze.warn(e.message);else{const n=dt.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});ze.warn(n.message)}}}async function li(t,e){try{const r=(await Uo()).transaction(mn,"readwrite");await r.objectStore(mn).put(e,Go(t)),await r.done}catch(n){if(n instanceof Xe)ze.warn(n.message);else{const r=dt.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});ze.warn(r.message)}}}function Go(t){return`${t.name}!${t.options.appId}`}/**
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
 */const yu=1024,_u=30*24*60*60*1e3;class Tu{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new vu(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,n;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=ci();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)===null||n===void 0?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(o=>o.date===i)?void 0:(this._heartbeatsCache.heartbeats.push({date:i,agent:s}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(o=>{const l=new Date(o.date).valueOf();return Date.now()-l<=_u}),this._storage.overwrite(this._heartbeatsCache))}catch(r){ze.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=ci(),{heartbeatsToSend:r,unsentEntries:s}=bu(this._heartbeatsCache.heartbeats),i=$n(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(n){return ze.warn(n),""}}}function ci(){return new Date().toISOString().substring(0,10)}function bu(t,e=yu){const n=[];let r=t.slice();for(const s of t){const i=n.find(o=>o.agent===s.agent);if(i){if(i.dates.push(s.date),ui(n)>e){i.dates.pop();break}}else if(n.push({agent:s.agent,dates:[s.date]}),ui(n)>e){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class vu{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return ac()?lc().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await gu(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var n;if(await this._canUseIndexedDBPromise){const s=await this.read();return li(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:s.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var n;if(await this._canUseIndexedDBPromise){const s=await this.read();return li(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...e.heartbeats]})}else return}}function ui(t){return $n(JSON.stringify({version:2,heartbeats:t})).length}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Au(t){Yt(new St("platform-logger",e=>new Cc(e),"PRIVATE")),Yt(new St("heartbeat",e=>new Tu(e),"PRIVATE")),ht(Hr,oi,t),ht(Hr,oi,"esm2017"),ht("fire-js","")}Au("");var Su="firebase",Iu="10.14.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ht(Su,Iu,"app");function As(t,e){var n={};for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&e.indexOf(r)<0&&(n[r]=t[r]);if(t!=null&&typeof Object.getOwnPropertySymbols=="function")for(var s=0,r=Object.getOwnPropertySymbols(t);s<r.length;s++)e.indexOf(r[s])<0&&Object.prototype.propertyIsEnumerable.call(t,r[s])&&(n[r[s]]=t[r[s]]);return n}function Yo(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const wu=Yo,$o=new In("auth","Firebase",Yo());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wn=new Ts("@firebase/auth");function Eu(t,...e){Wn.logLevel<=q.WARN&&Wn.warn(`Auth (${qt}): ${t}`,...e)}function Bn(t,...e){Wn.logLevel<=q.ERROR&&Wn.error(`Auth (${qt}): ${t}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qe(t,...e){throw Ss(t,...e)}function Ge(t,...e){return Ss(t,...e)}function jo(t,e,n){const r=Object.assign(Object.assign({},wu()),{[e]:n});return new In("auth","Firebase",r).create(e,{appName:t.name})}function vt(t){return jo(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Ss(t,...e){if(typeof t!="string"){const n=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=t.name),t._errorFactory.create(n,...r)}return $o.create(t,...e)}function L(t,e,...n){if(!t)throw Ss(e,...n)}function je(t){const e="INTERNAL ASSERTION FAILED: "+t;throw Bn(e),new Error(e)}function Je(t,e){t||je(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jr(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.href)||""}function ku(){return di()==="http:"||di()==="https:"}function di(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pu(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(ku()||sc()||"connection"in navigator)?navigator.onLine:!0}function Ru(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class En{constructor(e,n){this.shortDelay=e,this.longDelay=n,Je(n>e,"Short delay should be less than long delay!"),this.isMobile=nc()||ic()}get(){return Pu()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Is(t,e){Je(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ko{static initialize(e,n,r){this.fetchImpl=e,n&&(this.headersImpl=n),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;je("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;je("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;je("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Du={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ou=new En(3e4,6e4);function ws(t,e){return t.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:t.tenantId}):e}async function Jt(t,e,n,r,s={}){return Wo(t,s,async()=>{let i={},o={};r&&(e==="GET"?o=r:i={body:JSON.stringify(r)});const l=wn(Object.assign({key:t.config.apiKey},o)).slice(1),a=await t._getAdditionalHeaders();a["Content-Type"]="application/json",t.languageCode&&(a["X-Firebase-Locale"]=t.languageCode);const c=Object.assign({method:e,headers:a},i);return rc()||(c.referrerPolicy="no-referrer"),Ko.fetch()(Ho(t,t.config.apiHost,n,l),c)})}async function Wo(t,e,n){t._canInitEmulator=!1;const r=Object.assign(Object.assign({},Du),e);try{const s=new Nu(t),i=await Promise.race([n(),s.promise]);s.clearNetworkTimeout();const o=await i.json();if("needConfirmation"in o)throw Mn(t,"account-exists-with-different-credential",o);if(i.ok&&!("errorMessage"in o))return o;{const l=i.ok?o.errorMessage:o.error.message,[a,c]=l.split(" : ");if(a==="FEDERATED_USER_ID_ALREADY_LINKED")throw Mn(t,"credential-already-in-use",o);if(a==="EMAIL_EXISTS")throw Mn(t,"email-already-in-use",o);if(a==="USER_DISABLED")throw Mn(t,"user-disabled",o);const u=r[a]||a.toLowerCase().replace(/[_\s]+/g,"-");if(c)throw jo(t,u,c);qe(t,u)}}catch(s){if(s instanceof Xe)throw s;qe(t,"network-request-failed",{message:String(s)})}}async function Mu(t,e,n,r,s={}){const i=await Jt(t,e,n,r,s);return"mfaPendingCredential"in i&&qe(t,"multi-factor-auth-required",{_serverResponse:i}),i}function Ho(t,e,n,r){const s=`${e}${n}?${r}`;return t.config.emulator?Is(t.config,s):`${t.config.apiScheme}://${s}`}class Nu{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,r)=>{this.timer=setTimeout(()=>r(Ge(this.auth,"network-request-failed")),Ou.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function Mn(t,e,n){const r={appName:t.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const s=Ge(t,e,r);return s.customData._tokenResponse=n,s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function xu(t,e){return Jt(t,"POST","/v1/accounts:delete",e)}async function zo(t,e){return Jt(t,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ln(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function Cu(t,e=!1){const n=ye(t),r=await n.getIdToken(e),s=Es(r);L(s&&s.exp&&s.auth_time&&s.iat,n.auth,"internal-error");const i=typeof s.firebase=="object"?s.firebase:void 0,o=i==null?void 0:i.sign_in_provider;return{claims:s,token:r,authTime:ln(xr(s.auth_time)),issuedAtTime:ln(xr(s.iat)),expirationTime:ln(xr(s.exp)),signInProvider:o||null,signInSecondFactor:(i==null?void 0:i.sign_in_second_factor)||null}}function xr(t){return Number(t)*1e3}function Es(t){const[e,n,r]=t.split(".");if(e===void 0||n===void 0||r===void 0)return Bn("JWT malformed, contained fewer than 3 sections"),null;try{const s=Mo(n);return s?JSON.parse(s):(Bn("Failed to decode base64 JWT payload"),null)}catch(s){return Bn("Caught error parsing JWT payload as JSON",s==null?void 0:s.toString()),null}}function hi(t){const e=Es(t);return L(e,"internal-error"),L(typeof e.exp<"u","internal-error"),L(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function gn(t,e,n=!1){if(n)return e;try{return await e}catch(r){throw r instanceof Xe&&Lu(r)&&t.auth.currentUser===t&&await t.auth.signOut(),r}}function Lu({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vu{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var n;if(e){const r=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),r}else{this.errorBackoff=3e4;const s=((n=this.user.stsTokenManager.expirationTime)!==null&&n!==void 0?n:0)-Date.now()-3e5;return Math.max(0,s)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qr{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=ln(this.lastLoginAt),this.creationTime=ln(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Hn(t){var e;const n=t.auth,r=await t.getIdToken(),s=await gn(t,zo(n,{idToken:r}));L(s==null?void 0:s.users.length,n,"internal-error");const i=s.users[0];t._notifyReloadListener(i);const o=!((e=i.providerUserInfo)===null||e===void 0)&&e.length?qo(i.providerUserInfo):[],l=Fu(t.providerData,o),a=t.isAnonymous,c=!(t.email&&i.passwordHash)&&!(l!=null&&l.length),u=a?c:!1,d={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:l,metadata:new Qr(i.createdAt,i.lastLoginAt),isAnonymous:u};Object.assign(t,d)}async function Bu(t){const e=ye(t);await Hn(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function Fu(t,e){return[...t.filter(r=>!e.some(s=>s.providerId===r.providerId)),...e]}function qo(t){return t.map(e=>{var{providerId:n}=e,r=As(e,["providerId"]);return{providerId:n,uid:r.rawId||"",displayName:r.displayName||null,email:r.email||null,phoneNumber:r.phoneNumber||null,photoURL:r.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Uu(t,e){const n=await Wo(t,{},async()=>{const r=wn({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:i}=t.config,o=Ho(t,s,"/v1/token",`key=${i}`),l=await t._getAdditionalHeaders();return l["Content-Type"]="application/x-www-form-urlencoded",Ko.fetch()(o,{method:"POST",headers:l,body:r})});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function Gu(t,e){return Jt(t,"POST","/v2/accounts:revokeToken",ws(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bt{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){L(e.idToken,"internal-error"),L(typeof e.idToken<"u","internal-error"),L(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):hi(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){L(e.length!==0,"internal-error");const n=hi(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(L(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:r,refreshToken:s,expiresIn:i}=await Uu(e,n);this.updateTokensAndExpiration(r,s,Number(i))}updateTokensAndExpiration(e,n,r){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,n){const{refreshToken:r,accessToken:s,expirationTime:i}=n,o=new Bt;return r&&(L(typeof r=="string","internal-error",{appName:e}),o.refreshToken=r),s&&(L(typeof s=="string","internal-error",{appName:e}),o.accessToken=s),i&&(L(typeof i=="number","internal-error",{appName:e}),o.expirationTime=i),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Bt,this.toJSON())}_performRefresh(){return je("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function et(t,e){L(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class Ke{constructor(e){var{uid:n,auth:r,stsTokenManager:s}=e,i=As(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new Vu(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=n,this.auth=r,this.stsTokenManager=s,this.accessToken=s.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new Qr(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const n=await gn(this,this.stsTokenManager.getToken(this.auth,e));return L(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return Cu(this,e)}reload(){return Bu(this)}_assign(e){this!==e&&(L(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>Object.assign({},n)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new Ke(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return n.metadata._copy(this.metadata),n}_onReload(e){L(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),n&&await Hn(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(lt(this.auth.app))return Promise.reject(vt(this.auth));const e=await this.getIdToken();return await gn(this,xu(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){var r,s,i,o,l,a,c,u;const d=(r=n.displayName)!==null&&r!==void 0?r:void 0,h=(s=n.email)!==null&&s!==void 0?s:void 0,y=(i=n.phoneNumber)!==null&&i!==void 0?i:void 0,m=(o=n.photoURL)!==null&&o!==void 0?o:void 0,p=(l=n.tenantId)!==null&&l!==void 0?l:void 0,T=(a=n._redirectEventId)!==null&&a!==void 0?a:void 0,k=(c=n.createdAt)!==null&&c!==void 0?c:void 0,I=(u=n.lastLoginAt)!==null&&u!==void 0?u:void 0,{uid:g,emailVerified:f,isAnonymous:_,providerData:b,stsTokenManager:v}=n;L(g&&v,e,"internal-error");const D=Bt.fromJSON(this.name,v);L(typeof g=="string",e,"internal-error"),et(d,e.name),et(h,e.name),L(typeof f=="boolean",e,"internal-error"),L(typeof _=="boolean",e,"internal-error"),et(y,e.name),et(m,e.name),et(p,e.name),et(T,e.name),et(k,e.name),et(I,e.name);const A=new Ke({uid:g,auth:e,email:h,emailVerified:f,displayName:d,isAnonymous:_,photoURL:m,phoneNumber:y,tenantId:p,stsTokenManager:D,createdAt:k,lastLoginAt:I});return b&&Array.isArray(b)&&(A.providerData=b.map(P=>Object.assign({},P))),T&&(A._redirectEventId=T),A}static async _fromIdTokenResponse(e,n,r=!1){const s=new Bt;s.updateFromServerResponse(n);const i=new Ke({uid:n.localId,auth:e,stsTokenManager:s,isAnonymous:r});return await Hn(i),i}static async _fromGetAccountInfoResponse(e,n,r){const s=n.users[0];L(s.localId!==void 0,"internal-error");const i=s.providerUserInfo!==void 0?qo(s.providerUserInfo):[],o=!(s.email&&s.passwordHash)&&!(i!=null&&i.length),l=new Bt;l.updateFromIdToken(r);const a=new Ke({uid:s.localId,auth:e,stsTokenManager:l,isAnonymous:o}),c={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:i,metadata:new Qr(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!(i!=null&&i.length)};return Object.assign(a,c),a}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fi=new Map;function We(t){Je(t instanceof Function,"Expected a class definition");let e=fi.get(t);return e?(Je(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,fi.set(t,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jo{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}Jo.type="NONE";const pi=Jo;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fn(t,e,n){return`firebase:${t}:${e}:${n}`}class Ft{constructor(e,n,r){this.persistence=e,this.auth=n,this.userKey=r;const{config:s,name:i}=this.auth;this.fullUserKey=Fn(this.userKey,s.apiKey,i),this.fullPersistenceKey=Fn("persistence",s.apiKey,i),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?Ke._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,r="authUser"){if(!n.length)return new Ft(We(pi),e,r);const s=(await Promise.all(n.map(async c=>{if(await c._isAvailable())return c}))).filter(c=>c);let i=s[0]||We(pi);const o=Fn(r,e.config.apiKey,e.name);let l=null;for(const c of n)try{const u=await c._get(o);if(u){const d=Ke._fromJSON(e,u);c!==i&&(l=d),i=c;break}}catch{}const a=s.filter(c=>c._shouldAllowMigration);return!i._shouldAllowMigration||!a.length?new Ft(i,e,r):(i=a[0],l&&await i._set(o,l.toJSON()),await Promise.all(n.map(async c=>{if(c!==i)try{await c._remove(o)}catch{}})),new Ft(i,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mi(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(ea(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Qo(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(na(e))return"Blackberry";if(ra(e))return"Webos";if(Xo(e))return"Safari";if((e.includes("chrome/")||Zo(e))&&!e.includes("edge/"))return"Chrome";if(ta(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=t.match(n);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function Qo(t=Ie()){return/firefox\//i.test(t)}function Xo(t=Ie()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Zo(t=Ie()){return/crios\//i.test(t)}function ea(t=Ie()){return/iemobile/i.test(t)}function ta(t=Ie()){return/android/i.test(t)}function na(t=Ie()){return/blackberry/i.test(t)}function ra(t=Ie()){return/webos/i.test(t)}function ks(t=Ie()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function Yu(t=Ie()){var e;return ks(t)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function $u(){return oc()&&document.documentMode===10}function sa(t=Ie()){return ks(t)||ta(t)||ra(t)||na(t)||/windows phone/i.test(t)||ea(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ia(t,e=[]){let n;switch(t){case"Browser":n=mi(Ie());break;case"Worker":n=`${mi(Ie())}-${t}`;break;default:n=t}const r=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${qt}/${r}`}/**
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
 */class ju{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const r=i=>new Promise((o,l)=>{try{const a=e(i);o(a)}catch(a){l(a)}});r.onAbort=n,this.queue.push(r);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const r of this.queue)await r(e),r.onAbort&&n.push(r.onAbort)}catch(r){n.reverse();for(const s of n)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
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
 */async function Ku(t,e={}){return Jt(t,"GET","/v2/passwordPolicy",ws(t,e))}/**
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
 */const Wu=6;class Hu{constructor(e){var n,r,s,i;const o=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(n=o.minPasswordLength)!==null&&n!==void 0?n:Wu,o.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=o.maxPasswordLength),o.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=o.containsLowercaseCharacter),o.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=o.containsUppercaseCharacter),o.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=o.containsNumericCharacter),o.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=o.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(s=(r=e.allowedNonAlphanumericCharacters)===null||r===void 0?void 0:r.join(""))!==null&&s!==void 0?s:"",this.forceUpgradeOnSignin=(i=e.forceUpgradeOnSignin)!==null&&i!==void 0?i:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var n,r,s,i,o,l;const a={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,a),this.validatePasswordCharacterOptions(e,a),a.isValid&&(a.isValid=(n=a.meetsMinPasswordLength)!==null&&n!==void 0?n:!0),a.isValid&&(a.isValid=(r=a.meetsMaxPasswordLength)!==null&&r!==void 0?r:!0),a.isValid&&(a.isValid=(s=a.containsLowercaseLetter)!==null&&s!==void 0?s:!0),a.isValid&&(a.isValid=(i=a.containsUppercaseLetter)!==null&&i!==void 0?i:!0),a.isValid&&(a.isValid=(o=a.containsNumericCharacter)!==null&&o!==void 0?o:!0),a.isValid&&(a.isValid=(l=a.containsNonAlphanumericCharacter)!==null&&l!==void 0?l:!0),a}validatePasswordLengthOptions(e,n){const r=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;r&&(n.meetsMinPasswordLength=e.length>=r),s&&(n.meetsMaxPasswordLength=e.length<=s)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let r;for(let s=0;s<e.length;s++)r=e.charAt(s),this.updatePasswordCharacterOptionsStatuses(n,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,n,r,s,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zu{constructor(e,n,r,s){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=r,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new gi(this),this.idTokenSubscription=new gi(this),this.beforeStateQueue=new ju(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=$o,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=s.sdkClientVersion}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=We(n)),this._initializationPromise=this.queue(async()=>{var r,s;if(!this._deleted&&(this.persistenceManager=await Ft.create(this,e),!this._deleted)){if(!((r=this._popupRedirectResolver)===null||r===void 0)&&r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((s=this.currentUser)===null||s===void 0?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await zo(this,{idToken:e}),r=await Ke._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(r)}catch{await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var n;if(lt(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(l=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(l,l))}):this.directlySetCurrentUser(null)}const r=await this.assertedPersistence.getCurrentUser();let s=r,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(n=this.redirectUser)===null||n===void 0?void 0:n._redirectEventId,l=s==null?void 0:s._redirectEventId,a=await this.tryRedirectSignIn(e);(!o||o===l)&&(a!=null&&a.user)&&(s=a.user,i=!0)}if(!s)return this.directlySetCurrentUser(null);if(!s._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(s)}catch(o){s=r,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return s?this.reloadAndSetCurrentUserOrClear(s):this.directlySetCurrentUser(null)}return L(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===s._redirectEventId?this.directlySetCurrentUser(s):this.reloadAndSetCurrentUserOrClear(s)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await Hn(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=Ru()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(lt(this.app))return Promise.reject(vt(this));const n=e?ye(e):null;return n&&L(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&L(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return lt(this.app)?Promise.reject(vt(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return lt(this.app)?Promise.reject(vt(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(We(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await Ku(this),n=new Hu(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new In("auth","Firebase",e())}onAuthStateChanged(e,n,r){return this.registerStateListener(this.authStateSubscription,e,n,r)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,r){return this.registerStateListener(this.idTokenSubscription,e,n,r)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(r.tenantId=this.tenantId),await Gu(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,n){const r=await this.getOrInitRedirectPersistenceManager(n);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&We(e)||this._popupRedirectResolver;L(n,this,"argument-error"),this.redirectPersistenceManager=await Ft.create(this,[We(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,r;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)===null||n===void 0?void 0:n._redirectEventId)===e?this._currentUser:((r=this.redirectUser)===null||r===void 0?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const r=(n=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&n!==void 0?n:null;this.lastNotifiedUid!==r&&(this.lastNotifiedUid=r,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,r,s){if(this._deleted)return()=>{};const i=typeof n=="function"?n:n.next.bind(n);let o=!1;const l=this._isInitialized?Promise.resolve():this._initializationPromise;if(L(l,this,"internal-error"),l.then(()=>{o||i(this.currentUser)}),typeof n=="function"){const a=e.addObserver(n,r,s);return()=>{o=!0,a()}}else{const a=e.addObserver(n);return()=>{o=!0,a()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return L(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=ia(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const n={"X-Client-Version":this.clientVersion};this.app.options.appId&&(n["X-Firebase-gmpid"]=this.app.options.appId);const r=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());r&&(n["X-Firebase-Client"]=r);const s=await this._getAppCheckToken();return s&&(n["X-Firebase-AppCheck"]=s),n}async _getAppCheckToken(){var e;const n=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return n!=null&&n.error&&Eu(`Error while retrieving App Check token: ${n.error}`),n==null?void 0:n.token}}function Ps(t){return ye(t)}class gi{constructor(e){this.auth=e,this.observer=null,this.addObserver=fc(n=>this.observer=n)}get next(){return L(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Rs={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function qu(t){Rs=t}function Ju(t){return Rs.loadJS(t)}function Qu(){return Rs.gapiScript}function Xu(t){return`__${t}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zu(t,e){const n=vs(t,"auth");if(n.isInitialized()){const s=n.getImmediate(),i=n.getOptions();if(jn(i,e??{}))return s;qe(s,"already-initialized")}return n.initialize({options:e})}function ed(t,e){const n=(e==null?void 0:e.persistence)||[],r=(Array.isArray(n)?n:[n]).map(We);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function td(t,e,n){const r=Ps(t);L(r._canInitEmulator,r,"emulator-config-failed"),L(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const s=!1,i=oa(e),{host:o,port:l}=nd(e),a=l===null?"":`:${l}`;r.config.emulator={url:`${i}//${o}${a}/`},r.settings.appVerificationDisabledForTesting=!0,r.emulatorConfig=Object.freeze({host:o,port:l,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:s})}),rd()}function oa(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function nd(t){const e=oa(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(r);if(s){const i=s[1];return{host:i,port:yi(r.substr(i.length+1))}}else{const[i,o]=r.split(":");return{host:i,port:yi(o)}}}function yi(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function rd(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class aa{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return je("not implemented")}_getIdTokenResponse(e){return je("not implemented")}_linkToIdToken(e,n){return je("not implemented")}_getReauthenticationResolver(e){return je("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ut(t,e){return Mu(t,"POST","/v1/accounts:signInWithIdp",ws(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sd="http://localhost";class It extends aa{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new It(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):qe("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:s}=n,i=As(n,["providerId","signInMethod"]);if(!r||!s)return null;const o=new It(r,s);return o.idToken=i.idToken||void 0,o.accessToken=i.accessToken||void 0,o.secret=i.secret,o.nonce=i.nonce,o.pendingToken=i.pendingToken||null,o}_getIdTokenResponse(e){const n=this.buildRequest();return Ut(e,n)}_linkToIdToken(e,n){const r=this.buildRequest();return r.idToken=n,Ut(e,r)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,Ut(e,n)}buildRequest(){const e={requestUri:sd,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=wn(n)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class la{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kn extends la{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class st extends kn{constructor(){super("facebook.com")}static credential(e){return It._fromParams({providerId:st.PROVIDER_ID,signInMethod:st.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return st.credentialFromTaggedObject(e)}static credentialFromError(e){return st.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return st.credential(e.oauthAccessToken)}catch{return null}}}st.FACEBOOK_SIGN_IN_METHOD="facebook.com";st.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class it extends kn{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return It._fromParams({providerId:it.PROVIDER_ID,signInMethod:it.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return it.credentialFromTaggedObject(e)}static credentialFromError(e){return it.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:r}=e;if(!n&&!r)return null;try{return it.credential(n,r)}catch{return null}}}it.GOOGLE_SIGN_IN_METHOD="google.com";it.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ot extends kn{constructor(){super("github.com")}static credential(e){return It._fromParams({providerId:ot.PROVIDER_ID,signInMethod:ot.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return ot.credentialFromTaggedObject(e)}static credentialFromError(e){return ot.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return ot.credential(e.oauthAccessToken)}catch{return null}}}ot.GITHUB_SIGN_IN_METHOD="github.com";ot.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class at extends kn{constructor(){super("twitter.com")}static credential(e,n){return It._fromParams({providerId:at.PROVIDER_ID,signInMethod:at.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return at.credentialFromTaggedObject(e)}static credentialFromError(e){return at.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:r}=e;if(!n||!r)return null;try{return at.credential(n,r)}catch{return null}}}at.TWITTER_SIGN_IN_METHOD="twitter.com";at.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $t{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,r,s=!1){const i=await Ke._fromIdTokenResponse(e,r,s),o=_i(r);return new $t({user:i,providerId:o,_tokenResponse:r,operationType:n})}static async _forOperation(e,n,r){await e._updateTokensIfNecessary(r,!0);const s=_i(r);return new $t({user:e,providerId:s,_tokenResponse:r,operationType:n})}}function _i(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zn extends Xe{constructor(e,n,r,s){var i;super(n.code,n.message),this.operationType=r,this.user=s,Object.setPrototypeOf(this,zn.prototype),this.customData={appName:e.name,tenantId:(i=e.tenantId)!==null&&i!==void 0?i:void 0,_serverResponse:n.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,n,r,s){return new zn(e,n,r,s)}}function ca(t,e,n,r){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(i=>{throw i.code==="auth/multi-factor-auth-required"?zn._fromErrorAndOperation(t,i,e,r):i})}async function id(t,e,n=!1){const r=await gn(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return $t._forOperation(t,"link",r)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function od(t,e,n=!1){const{auth:r}=t;if(lt(r.app))return Promise.reject(vt(r));const s="reauthenticate";try{const i=await gn(t,ca(r,s,e,t),n);L(i.idToken,r,"internal-error");const o=Es(i.idToken);L(o,r,"internal-error");const{sub:l}=o;return L(t.uid===l,r,"user-mismatch"),$t._forOperation(t,s,i)}catch(i){throw(i==null?void 0:i.code)==="auth/user-not-found"&&qe(r,"user-mismatch"),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ad(t,e,n=!1){if(lt(t.app))return Promise.reject(vt(t));const r="signIn",s=await ca(t,r,e),i=await $t._fromIdTokenResponse(t,r,s);return n||await t._updateCurrentUser(i.user),i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ld(t,e){return ye(t).setPersistence(e)}function cd(t,e,n,r){return ye(t).onIdTokenChanged(e,n,r)}function ud(t,e,n){return ye(t).beforeAuthStateChanged(e,n)}function dd(t,e,n,r){return ye(t).onAuthStateChanged(e,n,r)}function hd(t){return ye(t).signOut()}const qn="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ua{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(qn,"1"),this.storage.removeItem(qn),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fd=1e3,pd=10;class da extends ua{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=sa(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const r=this.storage.getItem(n),s=this.localCache[n];r!==s&&e(n,s,r)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((o,l,a)=>{this.notifyListeners(o,a)});return}const r=e.key;n?this.detachListener():this.stopPolling();const s=()=>{const o=this.storage.getItem(r);!n&&this.localCache[r]===o||this.notifyListeners(r,o)},i=this.storage.getItem(r);$u()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(s,pd):s()}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:r}),!0)})},fd)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}da.type="LOCAL";const ha=da;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fa extends ua{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}fa.type="SESSION";const pa=fa;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function md(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dr{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(s=>s.isListeningto(e));if(n)return n;const r=new dr(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:r,eventType:s,data:i}=n.data,o=this.handlersMap[s];if(!(o!=null&&o.size))return;n.ports[0].postMessage({status:"ack",eventId:r,eventType:s});const l=Array.from(o).map(async c=>c(n.origin,i)),a=await md(l);n.ports[0].postMessage({status:"done",eventId:r,eventType:s,response:a})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}dr.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ds(t="",e=10){let n="";for(let r=0;r<e;r++)n+=Math.floor(Math.random()*10);return t+n}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gd{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,r=50){const s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let i,o;return new Promise((l,a)=>{const c=Ds("",20);s.port1.start();const u=setTimeout(()=>{a(new Error("unsupported_event"))},r);o={messageChannel:s,onMessage(d){const h=d;if(h.data.eventId===c)switch(h.data.status){case"ack":clearTimeout(u),i=setTimeout(()=>{a(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),l(h.data.response);break;default:clearTimeout(u),clearTimeout(i),a(new Error("invalid_response"));break}}},this.handlers.add(o),s.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:c,data:n},[s.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ye(){return window}function yd(t){Ye().location.href=t}/**
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
 */function ma(){return typeof Ye().WorkerGlobalScope<"u"&&typeof Ye().importScripts=="function"}async function _d(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function Td(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)===null||t===void 0?void 0:t.controller)||null}function bd(){return ma()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ga="firebaseLocalStorageDb",vd=1,Jn="firebaseLocalStorage",ya="fbase_key";class Pn{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function hr(t,e){return t.transaction([Jn],e?"readwrite":"readonly").objectStore(Jn)}function Ad(){const t=indexedDB.deleteDatabase(ga);return new Pn(t).toPromise()}function Xr(){const t=indexedDB.open(ga,vd);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const r=t.result;try{r.createObjectStore(Jn,{keyPath:ya})}catch(s){n(s)}}),t.addEventListener("success",async()=>{const r=t.result;r.objectStoreNames.contains(Jn)?e(r):(r.close(),await Ad(),e(await Xr()))})})}async function Ti(t,e,n){const r=hr(t,!0).put({[ya]:e,value:n});return new Pn(r).toPromise()}async function Sd(t,e){const n=hr(t,!1).get(e),r=await new Pn(n).toPromise();return r===void 0?null:r.value}function bi(t,e){const n=hr(t,!0).delete(e);return new Pn(n).toPromise()}const Id=800,wd=3;class _a{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await Xr(),this.db)}async _withRetries(e){let n=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(n++>wd)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return ma()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=dr._getInstance(bd()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var e,n;if(this.activeServiceWorker=await _d(),!this.activeServiceWorker)return;this.sender=new gd(this.activeServiceWorker);const r=await this.sender._send("ping",{},800);r&&!((e=r[0])===null||e===void 0)&&e.fulfilled&&!((n=r[0])===null||n===void 0)&&n.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||Td()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await Xr();return await Ti(e,qn,"1"),await bi(e,qn),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(r=>Ti(r,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(r=>Sd(r,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>bi(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(s=>{const i=hr(s,!1).getAll();return new Pn(i).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],r=new Set;if(e.length!==0)for(const{fbase_key:s,value:i}of e)r.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(i)&&(this.notifyListeners(s,i),n.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!r.has(s)&&(this.notifyListeners(s,null),n.push(s));return n}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),Id)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}_a.type="LOCAL";const Ed=_a;new En(3e4,6e4);/**
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
 */function kd(t,e){return e?We(e):(L(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Os extends aa{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Ut(e,this._buildIdpRequest())}_linkToIdToken(e,n){return Ut(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return Ut(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function Pd(t){return ad(t.auth,new Os(t),t.bypassAuthState)}function Rd(t){const{auth:e,user:n}=t;return L(n,e,"internal-error"),od(n,new Os(t),t.bypassAuthState)}async function Dd(t){const{auth:e,user:n}=t;return L(n,e,"internal-error"),id(n,new Os(t),t.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ta{constructor(e,n,r,s,i=!1){this.auth=e,this.resolver=r,this.user=s,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:r,postBody:s,tenantId:i,error:o,type:l}=e;if(o){this.reject(o);return}const a={auth:this.auth,requestUri:n,sessionId:r,tenantId:i||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(l)(a))}catch(c){this.reject(c)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return Pd;case"linkViaPopup":case"linkViaRedirect":return Dd;case"reauthViaPopup":case"reauthViaRedirect":return Rd;default:qe(this.auth,"internal-error")}}resolve(e){Je(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Je(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Od=new En(2e3,1e4);class xt extends Ta{constructor(e,n,r,s,i){super(e,n,s,i),this.provider=r,this.authWindow=null,this.pollId=null,xt.currentPopupAction&&xt.currentPopupAction.cancel(),xt.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return L(e,this.auth,"internal-error"),e}async onExecution(){Je(this.filter.length===1,"Popup operations only handle one event");const e=Ds();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(Ge(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(Ge(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,xt.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,r;if(!((r=(n=this.authWindow)===null||n===void 0?void 0:n.window)===null||r===void 0)&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Ge(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,Od.get())};e()}}xt.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Md="pendingRedirect",Un=new Map;class Nd extends Ta{constructor(e,n,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,r),this.eventId=null}async execute(){let e=Un.get(this.auth._key());if(!e){try{const r=await xd(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(n){e=()=>Promise.reject(n)}Un.set(this.auth._key(),e)}return this.bypassAuthState||Un.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function xd(t,e){const n=Vd(e),r=Ld(t);if(!await r._isAvailable())return!1;const s=await r._get(n)==="true";return await r._remove(n),s}function Cd(t,e){Un.set(t._key(),e)}function Ld(t){return We(t._redirectPersistence)}function Vd(t){return Fn(Md,t.config.apiKey,t.name)}async function Bd(t,e,n=!1){if(lt(t.app))return Promise.reject(vt(t));const r=Ps(t),s=kd(r,e),o=await new Nd(r,s,n).execute();return o&&!n&&(delete o.user._redirectEventId,await r._persistUserIfCurrent(o.user),await r._setRedirectUser(null,e)),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fd=10*60*1e3;class Ud{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(n=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Gd(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var r;if(e.error&&!ba(e)){const s=((r=e.error.code)===null||r===void 0?void 0:r.split("auth/")[1])||"internal-error";n.onError(Ge(this.auth,s))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const r=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Fd&&this.cachedEventUids.clear(),this.cachedEventUids.has(vi(e))}saveEventToCache(e){this.cachedEventUids.add(vi(e)),this.lastProcessedEventTime=Date.now()}}function vi(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function ba({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Gd(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return ba(t);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Yd(t,e={}){return Jt(t,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $d=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,jd=/^https?/;async function Kd(t){if(t.config.emulator)return;const{authorizedDomains:e}=await Yd(t);for(const n of e)try{if(Wd(n))return}catch{}qe(t,"unauthorized-domain")}function Wd(t){const e=Jr(),{protocol:n,hostname:r}=new URL(e);if(t.startsWith("chrome-extension://")){const o=new URL(t);return o.hostname===""&&r===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&o.hostname===r}if(!jd.test(n))return!1;if($d.test(t))return r===t;const s=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(r)}/**
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
 */const Hd=new En(3e4,6e4);function Ai(){const t=Ye().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function zd(t){return new Promise((e,n)=>{var r,s,i;function o(){Ai(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Ai(),n(Ge(t,"network-request-failed"))},timeout:Hd.get()})}if(!((s=(r=Ye().gapi)===null||r===void 0?void 0:r.iframes)===null||s===void 0)&&s.Iframe)e(gapi.iframes.getContext());else if(!((i=Ye().gapi)===null||i===void 0)&&i.load)o();else{const l=Xu("iframefcb");return Ye()[l]=()=>{gapi.load?o():n(Ge(t,"network-request-failed"))},Ju(`${Qu()}?onload=${l}`).catch(a=>n(a))}}).catch(e=>{throw Gn=null,e})}let Gn=null;function qd(t){return Gn=Gn||zd(t),Gn}/**
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
 */const Jd=new En(5e3,15e3),Qd="__/auth/iframe",Xd="emulator/auth/iframe",Zd={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},eh=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function th(t){const e=t.config;L(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?Is(e,Xd):`https://${t.config.authDomain}/${Qd}`,r={apiKey:e.apiKey,appName:t.name,v:qt},s=eh.get(t.config.apiHost);s&&(r.eid=s);const i=t._getFrameworks();return i.length&&(r.fw=i.join(",")),`${n}?${wn(r).slice(1)}`}async function nh(t){const e=await qd(t),n=Ye().gapi;return L(n,t,"internal-error"),e.open({where:document.body,url:th(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Zd,dontclear:!0},r=>new Promise(async(s,i)=>{await r.restyle({setHideOnLeave:!1});const o=Ge(t,"network-request-failed"),l=Ye().setTimeout(()=>{i(o)},Jd.get());function a(){Ye().clearTimeout(l),s(r)}r.ping(a).then(a,()=>{i(o)})}))}/**
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
 */const rh={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},sh=500,ih=600,oh="_blank",ah="http://localhost";class Si{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function lh(t,e,n,r=sh,s=ih){const i=Math.max((window.screen.availHeight-s)/2,0).toString(),o=Math.max((window.screen.availWidth-r)/2,0).toString();let l="";const a=Object.assign(Object.assign({},rh),{width:r.toString(),height:s.toString(),top:i,left:o}),c=Ie().toLowerCase();n&&(l=Zo(c)?oh:n),Qo(c)&&(e=e||ah,a.scrollbars="yes");const u=Object.entries(a).reduce((h,[y,m])=>`${h}${y}=${m},`,"");if(Yu(c)&&l!=="_self")return ch(e||"",l),new Si(null);const d=window.open(e||"",l,u);L(d,t,"popup-blocked");try{d.focus()}catch{}return new Si(d)}function ch(t,e){const n=document.createElement("a");n.href=t,n.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}/**
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
 */const uh="__/auth/handler",dh="emulator/auth/handler",hh=encodeURIComponent("fac");async function Ii(t,e,n,r,s,i){L(t.config.authDomain,t,"auth-domain-config-required"),L(t.config.apiKey,t,"invalid-api-key");const o={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:r,v:qt,eventId:s};if(e instanceof la){e.setDefaultLanguage(t.languageCode),o.providerId=e.providerId||"",hc(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[u,d]of Object.entries({}))o[u]=d}if(e instanceof kn){const u=e.getScopes().filter(d=>d!=="");u.length>0&&(o.scopes=u.join(","))}t.tenantId&&(o.tid=t.tenantId);const l=o;for(const u of Object.keys(l))l[u]===void 0&&delete l[u];const a=await t._getAppCheckToken(),c=a?`#${hh}=${encodeURIComponent(a)}`:"";return`${fh(t)}?${wn(l).slice(1)}${c}`}function fh({config:t}){return t.emulator?Is(t,dh):`https://${t.authDomain}/${uh}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cr="webStorageSupport";class ph{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=pa,this._completeRedirectFn=Bd,this._overrideRedirectResult=Cd}async _openPopup(e,n,r,s){var i;Je((i=this.eventManagers[e._key()])===null||i===void 0?void 0:i.manager,"_initialize() not called before _openPopup()");const o=await Ii(e,n,r,Jr(),s);return lh(e,o,Ds())}async _openRedirect(e,n,r,s){await this._originValidation(e);const i=await Ii(e,n,r,Jr(),s);return yd(i),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:s,promise:i}=this.eventManagers[n];return s?Promise.resolve(s):(Je(i,"If manager is not set, promise should be"),i)}const r=this.initAndGetManager(e);return this.eventManagers[n]={promise:r},r.catch(()=>{delete this.eventManagers[n]}),r}async initAndGetManager(e){const n=await nh(e),r=new Ud(e);return n.register("authEvent",s=>(L(s==null?void 0:s.authEvent,e,"invalid-auth-event"),{status:r.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=n,r}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(Cr,{type:Cr},s=>{var i;const o=(i=s==null?void 0:s[0])===null||i===void 0?void 0:i[Cr];o!==void 0&&n(!!o),qe(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=Kd(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return sa()||Xo()||ks()}}const mh=ph;var wi="@firebase/auth",Ei="1.7.9";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gh{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){L(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yh(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function _h(t){Yt(new St("auth",(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),s=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:o,authDomain:l}=r.options;L(o&&!o.includes(":"),"invalid-api-key",{appName:r.name});const a={apiKey:o,authDomain:l,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:ia(t)},c=new zu(r,s,i,a);return ed(c,n),c},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,r)=>{e.getProvider("auth-internal").initialize()})),Yt(new St("auth-internal",e=>{const n=Ps(e.getProvider("auth").getImmediate());return(r=>new gh(r))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),ht(wi,Ei,yh(t)),ht(wi,Ei,"esm2017")}/**
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
 */const Th=5*60,bh=Co("authIdTokenMaxAge")||Th;let ki=null;const vh=t=>async e=>{const n=e&&await e.getIdTokenResult(),r=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(r&&r>bh)return;const s=n==null?void 0:n.token;ki!==s&&(ki=s,await fetch(t,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function Ah(t=Fo()){const e=vs(t,"auth");if(e.isInitialized())return e.getImmediate();const n=Zu(t,{popupRedirectResolver:mh,persistence:[Ed,ha,pa]}),r=Co("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const i=new URL(r,location.origin);if(location.origin===i.origin){const o=vh(i.toString());ud(n,o,()=>o(n.currentUser)),cd(n,l=>o(l))}}const s=No("auth");return s&&td(n,`http://${s}`),n}function Sh(){var t,e;return(e=(t=document.getElementsByTagName("head"))===null||t===void 0?void 0:t[0])!==null&&e!==void 0?e:document}qu({loadJS(t){return new Promise((e,n)=>{const r=document.createElement("script");r.setAttribute("src",t),r.onload=e,r.onerror=s=>{const i=Ge("internal-error");i.customData=s,n(i)},r.type="text/javascript",r.charset="UTF-8",Sh().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});_h("Browser");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ee{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Ee.UNAUTHENTICATED=new Ee(null),Ee.GOOGLE_CREDENTIALS=new Ee("google-credentials-uid"),Ee.FIRST_PARTY=new Ee("first-party-uid"),Ee.MOCK_USER=new Ee("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Qt="10.14.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jt=new Ts("@firebase/firestore");function Qn(t,...e){if(jt.logLevel<=q.DEBUG){const n=e.map(Ns);jt.debug(`Firestore (${Qt}): ${t}`,...n)}}function Ms(t,...e){if(jt.logLevel<=q.ERROR){const n=e.map(Ns);jt.error(`Firestore (${Qt}): ${t}`,...n)}}function va(t,...e){if(jt.logLevel<=q.WARN){const n=e.map(Ns);jt.warn(`Firestore (${Qt}): ${t}`,...n)}}function Ns(t){if(typeof t=="string")return t;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
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
 */function oe(t="Unexpected state"){const e=`FIRESTORE (${Qt}) INTERNAL ASSERTION FAILED: `+t;throw Ms(e),new Error(e)}function mt(t,e){t||oe()}function fr(t,e){return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pi="ok",Ih="cancelled",cn="unknown",Y="invalid-argument",wh="deadline-exceeded",Eh="not-found",kh="permission-denied",Zr="unauthenticated",Ph="resource-exhausted",Kt="failed-precondition",Rh="aborted",Dh="out-of-range",Aa="unimplemented",Oh="internal",Mh="unavailable";class V extends Xe{constructor(e,n){super(e,n),this.code=e,this.message=n,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sa{constructor(e,n){this.user=n,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class Nh{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,n){e.enqueueRetryable(()=>n(Ee.UNAUTHENTICATED))}shutdown(){}}class xh{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,n){this.changeListener=n,e.enqueueRetryable(()=>n(this.token.user))}shutdown(){this.changeListener=null}}class Ch{constructor(e){this.auth=null,e.onInit(n=>{this.auth=n})}getToken(){return this.auth?this.auth.getToken().then(e=>e?(mt(typeof e.accessToken=="string"),new Sa(e.accessToken,new Ee(this.auth.getUid()))):null):Promise.resolve(null)}invalidateToken(){}start(e,n){}shutdown(){}}class Lh{constructor(e,n,r){this.t=e,this.i=n,this.o=r,this.type="FirstParty",this.user=Ee.FIRST_PARTY,this.u=new Map}l(){return this.o?this.o():null}get headers(){this.u.set("X-Goog-AuthUser",this.t);const e=this.l();return e&&this.u.set("Authorization",e),this.i&&this.u.set("X-Goog-Iam-Authorization-Token",this.i),this.u}}class Vh{constructor(e,n,r){this.t=e,this.i=n,this.o=r}getToken(){return Promise.resolve(new Lh(this.t,this.i,this.o))}start(e,n){e.enqueueRetryable(()=>n(Ee.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class Bh{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class Fh{constructor(e){this.h=e,this.appCheck=null,e.onInit(n=>{this.appCheck=n})}getToken(){return this.appCheck?this.appCheck.getToken().then(e=>e?(mt(typeof e.token=="string"),new Bh(e.token)):null):Promise.resolve(null)}invalidateToken(){}start(e,n){}shutdown(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uh{constructor(e,n,r,s,i,o,l,a,c){this.databaseId=e,this.appId=n,this.persistenceKey=r,this.host=s,this.ssl=i,this.forceLongPolling=o,this.autoDetectLongPolling=l,this.longPollingOptions=a,this.useFetchStreams=c}}class yn{constructor(e,n){this.projectId=e,this.database=n||"(default)"}static empty(){return new yn("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof yn&&e.projectId===this.projectId&&e.database===this.database}}class _n{constructor(e,n,r){n===void 0?n=0:n>e.length&&oe(),r===void 0?r=e.length-n:r>e.length-n&&oe(),this.segments=e,this.offset=n,this.len=r}get length(){return this.len}isEqual(e){return _n.comparator(this,e)===0}child(e){const n=this.segments.slice(this.offset,this.limit());return e instanceof _n?e.forEach(r=>{n.push(r)}):n.push(e),this.construct(n)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}forEach(e){for(let n=this.offset,r=this.limit();n<r;n++)e(this.segments[n])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,n){const r=Math.min(e.length,n.length);for(let s=0;s<r;s++){const i=e.get(s),o=n.get(s);if(i<o)return-1;if(i>o)return 1}return e.length<n.length?-1:e.length>n.length?1:0}}class pe extends _n{construct(e,n,r){return new pe(e,n,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const n=[];for(const r of e){if(r.indexOf("//")>=0)throw new V(Y,`Invalid segment (${r}). Paths must not contain // in them.`);n.push(...r.split("/").filter(s=>s.length>0))}return new pe(n)}static emptyPath(){return new pe([])}}const Gh=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Pe extends _n{construct(e,n,r){return new Pe(e,n,r)}static isValidIdentifier(e){return Gh.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Pe.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new Pe(["__name__"])}static fromServerFormat(e){const n=[];let r="",s=0;const i=()=>{if(r.length===0)throw new V(Y,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);n.push(r),r=""};let o=!1;for(;s<e.length;){const l=e[s];if(l==="\\"){if(s+1===e.length)throw new V(Y,"Path has trailing escape character: "+e);const a=e[s+1];if(a!=="\\"&&a!=="."&&a!=="`")throw new V(Y,"Path has invalid escape sequence: "+e);r+=a,s+=2}else l==="`"?(o=!o,s++):l!=="."||o?(r+=l,s++):(i(),s++)}if(i(),o)throw new V(Y,"Unterminated ` in path: "+e);return new Pe(n)}static emptyPath(){return new Pe([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ae{constructor(e){this.path=e}static fromPath(e){return new Ae(pe.fromString(e))}static fromName(e){return new Ae(pe.fromString(e).popFirst(5))}static empty(){return new Ae(pe.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&pe.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,n){return pe.comparator(e.path,n.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new Ae(new pe(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ia(t,e,n){if(!n)throw new V(Y,`Function ${t}() cannot be called with an empty ${e}.`)}function Ri(t){if(!Ae.isDocumentKey(t))throw new V(Y,`Invalid document reference. Document references must have an even number of segments, but ${t} has ${t.length}.`)}function Di(t){if(Ae.isDocumentKey(t))throw new V(Y,`Invalid collection reference. Collection references must have an odd number of segments, but ${t} has ${t.length}.`)}function xs(t){if(t===void 0)return"undefined";if(t===null)return"null";if(typeof t=="string")return t.length>20&&(t=`${t.substring(0,20)}...`),JSON.stringify(t);if(typeof t=="number"||typeof t=="boolean")return""+t;if(typeof t=="object"){if(t instanceof Array)return"an array";{const e=function(r){return r.constructor?r.constructor.name:null}(t);return e?`a custom ${e} object`:"an object"}}return typeof t=="function"?"a function":oe()}function Cs(t,e){if("_delegate"in t&&(t=t._delegate),!(t instanceof e)){if(e.name===t.constructor.name)throw new V(Y,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=xs(t);throw new V(Y,`Expected type '${e.name}', but it was: ${n}`)}}return t}/**
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
 */function wa(t){const e={};return t.timeoutSeconds!==void 0&&(e.timeoutSeconds=t.timeoutSeconds),e}/**
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
 */let Nn=null;function Yh(){return Nn===null?Nn=function(){return 268435456+Math.round(2147483648*Math.random())}():Nn++,"0x"+Nn.toString(16)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $h(t){return t==null}function Xn(t){return t===0&&1/t==-1/0}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jh={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Oi,U;function Mi(t){if(t===void 0)return Ms("RPC_ERROR","HTTP error has no status"),cn;switch(t){case 200:return Pi;case 400:return Kt;case 401:return Zr;case 403:return kh;case 404:return Eh;case 409:return Rh;case 416:return Dh;case 429:return Ph;case 499:return Ih;case 500:return cn;case 501:return Aa;case 503:return Mh;case 504:return wh;default:return t>=200&&t<300?Pi:t>=400&&t<500?Kt:t>=500&&t<600?Oh:cn}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(U=Oi||(Oi={}))[U.OK=0]="OK",U[U.CANCELLED=1]="CANCELLED",U[U.UNKNOWN=2]="UNKNOWN",U[U.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",U[U.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",U[U.NOT_FOUND=5]="NOT_FOUND",U[U.ALREADY_EXISTS=6]="ALREADY_EXISTS",U[U.PERMISSION_DENIED=7]="PERMISSION_DENIED",U[U.UNAUTHENTICATED=16]="UNAUTHENTICATED",U[U.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",U[U.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",U[U.ABORTED=10]="ABORTED",U[U.OUT_OF_RANGE=11]="OUT_OF_RANGE",U[U.UNIMPLEMENTED=12]="UNIMPLEMENTED",U[U.INTERNAL=13]="INTERNAL",U[U.UNAVAILABLE=14]="UNAVAILABLE",U[U.DATA_LOSS=15]="DATA_LOSS";class Kh extends class{constructor(n){this.databaseInfo=n,this.databaseId=n.databaseId;const r=n.ssl?"https":"http",s=encodeURIComponent(this.databaseId.projectId),i=encodeURIComponent(this.databaseId.database);this.m=r+"://"+n.host,this.A=`projects/${s}/databases/${i}`,this.T=this.databaseId.database==="(default)"?`project_id=${s}`:`project_id=${s}&database_id=${i}`}get R(){return!1}P(n,r,s,i,o){const l=Yh(),a=this.V(n,r.toUriEncodedString());Qn("RestConnection",`Sending RPC '${n}' ${l}:`,a,s);const c={"google-cloud-resource-prefix":this.A,"x-goog-request-params":this.T};return this.I(c,i,o),this.p(n,a,c,s).then(u=>(Qn("RestConnection",`Received RPC '${n}' ${l}: `,u),u),u=>{throw va("RestConnection",`RPC '${n}' ${l} failed with error: `,u,"url: ",a,"request:",s),u})}g(n,r,s,i,o,l){return this.P(n,r,s,i,o)}I(n,r,s){n["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+Qt}(),n["Content-Type"]="text/plain",this.databaseInfo.appId&&(n["X-Firebase-GMPID"]=this.databaseInfo.appId),r&&r.headers.forEach((i,o)=>n[o]=i),s&&s.headers.forEach((i,o)=>n[o]=i)}V(n,r){const s=jh[n];return`${this.m}/v1/${r}:${s}`}terminate(){}}{constructor(e,n){super(e),this.F=n}v(e,n){throw new Error("Not supported by FetchConnection")}async p(e,n,r,s){var i;const o=JSON.stringify(s);let l;try{l=await this.F(n,{method:"POST",headers:r,body:o})}catch(a){const c=a;throw new V(Mi(c.status),"Request failed with error: "+c.statusText)}if(!l.ok){let a=await l.json();Array.isArray(a)&&(a=a[0]);const c=(i=a==null?void 0:a.error)===null||i===void 0?void 0:i.message;throw new V(Mi(l.status),`Request failed with error: ${c??l.statusText}`)}return l.json()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wh(t){const e=typeof self<"u"&&(self.crypto||self.msCrypto),n=new Uint8Array(t);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(n);else for(let r=0;r<t;r++)n[r]=Math.floor(256*Math.random());return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hh{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=Math.floor(256/e.length)*e.length;let r="";for(;r.length<20;){const s=Wh(40);for(let i=0;i<s.length;++i)r.length<20&&s[i]<n&&(r+=e.charAt(s[i]%e.length))}return r}}function ue(t,e){return t<e?-1:t>e?1:0}function Ea(t,e,n){return t.length===e.length&&t.every((r,s)=>n(r,e[s]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ni(t){let e=0;for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e++;return e}function Rn(t,e){for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e(n,t[n])}/**
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
 */class zh extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class Qe{constructor(e){this.binaryString=e}static fromBase64String(e){const n=function(s){try{return atob(s)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new zh("Invalid base64 string: "+i):i}}(e);return new Qe(n)}static fromUint8Array(e){const n=function(s){let i="";for(let o=0;o<s.length;++o)i+=String.fromCharCode(s[o]);return i}(e);return new Qe(n)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(n){return btoa(n)}(this.binaryString)}toUint8Array(){return function(n){const r=new Uint8Array(n.length);for(let s=0;s<n.length;s++)r[s]=n.charCodeAt(s);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return ue(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}Qe.EMPTY_BYTE_STRING=new Qe("");const qh=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function wt(t){if(mt(!!t),typeof t=="string"){let e=0;const n=qh.exec(t);if(mt(!!n),n[1]){let s=n[1];s=(s+"000000000").substr(0,9),e=Number(s)}const r=new Date(t);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:ce(t.seconds),nanos:ce(t.nanos)}}function ce(t){return typeof t=="number"?t:typeof t=="string"?Number(t):0}function Tn(t){return typeof t=="string"?Qe.fromBase64String(t):Qe.fromUint8Array(t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oe{constructor(e,n){if(this.seconds=e,this.nanoseconds=n,n<0)throw new V(Y,"Timestamp nanoseconds out of range: "+n);if(n>=1e9)throw new V(Y,"Timestamp nanoseconds out of range: "+n);if(e<-62135596800)throw new V(Y,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new V(Y,"Timestamp seconds out of range: "+e)}static now(){return Oe.fromMillis(Date.now())}static fromDate(e){return Oe.fromMillis(e.getTime())}static fromMillis(e){const n=Math.floor(e/1e3),r=Math.floor(1e6*(e-1e3*n));return new Oe(n,r)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?ue(this.nanoseconds,e.nanoseconds):ue(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ka(t){var e,n;return((n=(((e=t==null?void 0:t.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||n===void 0?void 0:n.stringValue)==="server_timestamp"}function Pa(t){const e=t.mapValue.fields.__previous_value__;return ka(e)?Pa(e):e}function bn(t){const e=wt(t.mapValue.fields.__local_write_time__.timestampValue);return new Oe(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xn={};function Et(t){return"nullValue"in t?0:"booleanValue"in t?1:"integerValue"in t||"doubleValue"in t?2:"timestampValue"in t?3:"stringValue"in t?5:"bytesValue"in t?6:"referenceValue"in t?7:"geoPointValue"in t?8:"arrayValue"in t?9:"mapValue"in t?ka(t)?4:function(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}(t)?9007199254740991:function(n){var r,s;return((s=(((r=n==null?void 0:n.mapValue)===null||r===void 0?void 0:r.fields)||{}).__type__)===null||s===void 0?void 0:s.stringValue)==="__vector__"}(t)?10:11:oe()}function Zn(t,e){if(t===e)return!0;const n=Et(t);if(n!==Et(e))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return t.booleanValue===e.booleanValue;case 4:return bn(t).isEqual(bn(e));case 3:return function(s,i){if(typeof s.timestampValue=="string"&&typeof i.timestampValue=="string"&&s.timestampValue.length===i.timestampValue.length)return s.timestampValue===i.timestampValue;const o=wt(s.timestampValue),l=wt(i.timestampValue);return o.seconds===l.seconds&&o.nanos===l.nanos}(t,e);case 5:return t.stringValue===e.stringValue;case 6:return function(s,i){return Tn(s.bytesValue).isEqual(Tn(i.bytesValue))}(t,e);case 7:return t.referenceValue===e.referenceValue;case 8:return function(s,i){return ce(s.geoPointValue.latitude)===ce(i.geoPointValue.latitude)&&ce(s.geoPointValue.longitude)===ce(i.geoPointValue.longitude)}(t,e);case 2:return function(s,i){if("integerValue"in s&&"integerValue"in i)return ce(s.integerValue)===ce(i.integerValue);if("doubleValue"in s&&"doubleValue"in i){const o=ce(s.doubleValue),l=ce(i.doubleValue);return o===l?Xn(o)===Xn(l):isNaN(o)&&isNaN(l)}return!1}(t,e);case 9:return Ea(t.arrayValue.values||[],e.arrayValue.values||[],Zn);case 10:case 11:return function(s,i){const o=s.mapValue.fields||{},l=i.mapValue.fields||{};if(Ni(o)!==Ni(l))return!1;for(const a in o)if(o.hasOwnProperty(a)&&(l[a]===void 0||!Zn(o[a],l[a])))return!1;return!0}(t,e);default:return oe()}}function vn(t,e){return(t.values||[]).find(n=>Zn(n,e))!==void 0}function er(t,e){if(t===e)return 0;const n=Et(t),r=Et(e);if(n!==r)return ue(n,r);switch(n){case 0:case 9007199254740991:return 0;case 1:return ue(t.booleanValue,e.booleanValue);case 2:return function(i,o){const l=ce(i.integerValue||i.doubleValue),a=ce(o.integerValue||o.doubleValue);return l<a?-1:l>a?1:l===a?0:isNaN(l)?isNaN(a)?0:-1:1}(t,e);case 3:return xi(t.timestampValue,e.timestampValue);case 4:return xi(bn(t),bn(e));case 5:return ue(t.stringValue,e.stringValue);case 6:return function(i,o){const l=Tn(i),a=Tn(o);return l.compareTo(a)}(t.bytesValue,e.bytesValue);case 7:return function(i,o){const l=i.split("/"),a=o.split("/");for(let c=0;c<l.length&&c<a.length;c++){const u=ue(l[c],a[c]);if(u!==0)return u}return ue(l.length,a.length)}(t.referenceValue,e.referenceValue);case 8:return function(i,o){const l=ue(ce(i.latitude),ce(o.latitude));return l!==0?l:ue(ce(i.longitude),ce(o.longitude))}(t.geoPointValue,e.geoPointValue);case 9:return Ci(t.arrayValue,e.arrayValue);case 10:return function(i,o){var l,a,c,u;const d=i.fields||{},h=o.fields||{},y=(l=d.value)===null||l===void 0?void 0:l.arrayValue,m=(a=h.value)===null||a===void 0?void 0:a.arrayValue,p=ue(((c=y==null?void 0:y.values)===null||c===void 0?void 0:c.length)||0,((u=m==null?void 0:m.values)===null||u===void 0?void 0:u.length)||0);return p!==0?p:Ci(y,m)}(t.mapValue,e.mapValue);case 11:return function(i,o){if(i===xn&&o===xn)return 0;if(i===xn)return 1;if(o===xn)return-1;const l=i.fields||{},a=Object.keys(l),c=o.fields||{},u=Object.keys(c);a.sort(),u.sort();for(let d=0;d<a.length&&d<u.length;++d){const h=ue(a[d],u[d]);if(h!==0)return h;const y=er(l[a[d]],c[u[d]]);if(y!==0)return y}return ue(a.length,u.length)}(t.mapValue,e.mapValue);default:throw oe()}}function xi(t,e){if(typeof t=="string"&&typeof e=="string"&&t.length===e.length)return ue(t,e);const n=wt(t),r=wt(e),s=ue(n.seconds,r.seconds);return s!==0?s:ue(n.nanos,r.nanos)}function Ci(t,e){const n=t.values||[],r=e.values||[];for(let s=0;s<n.length&&s<r.length;++s){const i=er(n[s],r[s]);if(i)return i}return ue(n.length,r.length)}function Ra(t){return!!t&&"arrayValue"in t}function Li(t){return!!t&&"nullValue"in t}function Vi(t){return!!t&&"doubleValue"in t&&isNaN(Number(t.doubleValue))}function Lr(t){return!!t&&"mapValue"in t}function un(t){if(t.geoPointValue)return{geoPointValue:Object.assign({},t.geoPointValue)};if(t.timestampValue&&typeof t.timestampValue=="object")return{timestampValue:Object.assign({},t.timestampValue)};if(t.mapValue){const e={mapValue:{fields:{}}};return Rn(t.mapValue.fields,(n,r)=>e.mapValue.fields[n]=un(r)),e}if(t.arrayValue){const e={arrayValue:{values:[]}};for(let n=0;n<(t.arrayValue.values||[]).length;++n)e.arrayValue.values[n]=un(t.arrayValue.values[n]);return e}return Object.assign({},t)}class Bi{constructor(e,n){this.position=e,this.inclusive=n}}/**
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
 */class Da{}class $e extends Da{constructor(e,n,r){super(),this.field=e,this.op=n,this.value=r}static create(e,n,r){return e.isKeyField()?n==="in"||n==="not-in"?this.createKeyFieldInFilter(e,n,r):new Jh(e,n,r):n==="array-contains"?new Zh(e,r):n==="in"?new ef(e,r):n==="not-in"?new tf(e,r):n==="array-contains-any"?new nf(e,r):new $e(e,n,r)}static createKeyFieldInFilter(e,n,r){return n==="in"?new Qh(e,r):new Xh(e,r)}matches(e){const n=e.data.field(this.field);return this.op==="!="?n!==null&&this.matchesComparison(er(n,this.value)):n!==null&&Et(this.value)===Et(n)&&this.matchesComparison(er(n,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return oe()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class pr extends Da{constructor(e,n){super(),this.filters=e,this.op=n,this.D=null}static create(e,n){return new pr(e,n)}matches(e){return function(r){return r.op==="and"}(this)?this.filters.find(n=>!n.matches(e))===void 0:this.filters.find(n=>n.matches(e))!==void 0}getFlattenedFilters(){return this.D!==null||(this.D=this.filters.reduce((e,n)=>e.concat(n.getFlattenedFilters()),[])),this.D}getFilters(){return Object.assign([],this.filters)}}class Jh extends $e{constructor(e,n,r){super(e,n,r),this.key=Ae.fromName(r.referenceValue)}matches(e){const n=Ae.comparator(e.key,this.key);return this.matchesComparison(n)}}class Qh extends $e{constructor(e,n){super(e,"in",n),this.keys=Oa("in",n)}matches(e){return this.keys.some(n=>n.isEqual(e.key))}}class Xh extends $e{constructor(e,n){super(e,"not-in",n),this.keys=Oa("not-in",n)}matches(e){return!this.keys.some(n=>n.isEqual(e.key))}}function Oa(t,e){var n;return(((n=e.arrayValue)===null||n===void 0?void 0:n.values)||[]).map(r=>Ae.fromName(r.referenceValue))}class Zh extends $e{constructor(e,n){super(e,"array-contains",n)}matches(e){const n=e.data.field(this.field);return Ra(n)&&vn(n.arrayValue,this.value)}}class ef extends $e{constructor(e,n){super(e,"in",n)}matches(e){const n=e.data.field(this.field);return n!==null&&vn(this.value.arrayValue,n)}}class tf extends $e{constructor(e,n){super(e,"not-in",n)}matches(e){if(vn(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const n=e.data.field(this.field);return n!==null&&!vn(this.value.arrayValue,n)}}class nf extends $e{constructor(e,n){super(e,"array-contains-any",n)}matches(e){const n=e.data.field(this.field);return!(!Ra(n)||!n.arrayValue.values)&&n.arrayValue.values.some(r=>vn(this.value.arrayValue,r))}}/**
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
 */class es{constructor(e,n="asc"){this.field=e,this.dir=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Te{constructor(e){this.timestamp=e}static fromTimestamp(e){return new Te(e)}static min(){return new Te(new Oe(0,0))}static max(){return new Te(new Oe(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tr{constructor(e,n){this.comparator=e,this.root=n||ge.EMPTY}insert(e,n){return new tr(this.comparator,this.root.insert(e,n,this.comparator).copy(null,null,ge.BLACK,null,null))}remove(e){return new tr(this.comparator,this.root.remove(e,this.comparator).copy(null,null,ge.BLACK,null,null))}get(e){let n=this.root;for(;!n.isEmpty();){const r=this.comparator(e,n.key);if(r===0)return n.value;r<0?n=n.left:r>0&&(n=n.right)}return null}indexOf(e){let n=0,r=this.root;for(;!r.isEmpty();){const s=this.comparator(e,r.key);if(s===0)return n+r.left.size;s<0?r=r.left:(n+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((n,r)=>(e(n,r),!1))}toString(){const e=[];return this.inorderTraversal((n,r)=>(e.push(`${n}:${r}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Cn(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Cn(this.root,e,this.comparator,!1)}getReverseIterator(){return new Cn(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Cn(this.root,e,this.comparator,!0)}}class Cn{constructor(e,n,r,s){this.isReverse=s,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=n?r(e.key,n):1,n&&s&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const n={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return n}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class ge{constructor(e,n,r,s,i){this.key=e,this.value=n,this.color=r??ge.RED,this.left=s??ge.EMPTY,this.right=i??ge.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,n,r,s,i){return new ge(e??this.key,n??this.value,r??this.color,s??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,n,r){let s=this;const i=r(e,s.key);return s=i<0?s.copy(null,null,null,s.left.insert(e,n,r),null):i===0?s.copy(null,n,null,null,null):s.copy(null,null,null,null,s.right.insert(e,n,r)),s.fixUp()}removeMin(){if(this.left.isEmpty())return ge.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,n){let r,s=this;if(n(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,n),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),n(e,s.key)===0){if(s.right.isEmpty())return ge.EMPTY;r=s.right.min(),s=s.copy(r.key,r.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,n))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,ge.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,ge.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),n=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,n)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw oe();const e=this.left.check();if(e!==this.right.check())throw oe();return e+(this.isRed()?0:1)}}ge.EMPTY=null,ge.RED=!0,ge.BLACK=!1;ge.EMPTY=new class{constructor(){this.size=0}get key(){throw oe()}get value(){throw oe()}get color(){throw oe()}get left(){throw oe()}get right(){throw oe()}copy(e,n,r,s,i){return this}insert(e,n,r){return new ge(e,n)}remove(e,n){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class An{constructor(e){this.comparator=e,this.data=new tr(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((n,r)=>(e(n),!1))}forEachInRange(e,n){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const s=r.getNext();if(this.comparator(s.key,e[1])>=0)return;n(s.key)}}forEachWhile(e,n){let r;for(r=n!==void 0?this.data.getIteratorFrom(n):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const n=this.data.getIteratorFrom(e);return n.hasNext()?n.getNext().key:null}getIterator(){return new Fi(this.data.getIterator())}getIteratorFrom(e){return new Fi(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let n=this;return n.size<e.size&&(n=e,e=this),e.forEach(r=>{n=n.add(r)}),n}isEqual(e){if(!(e instanceof An)||this.size!==e.size)return!1;const n=this.data.getIterator(),r=e.data.getIterator();for(;n.hasNext();){const s=n.getNext().key,i=r.getNext().key;if(this.comparator(s,i)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(n=>{e.push(n)}),e}toString(){const e=[];return this.forEach(n=>e.push(n)),"SortedSet("+e.toString()+")"}copy(e){const n=new An(this.comparator);return n.data=e,n}}class Fi{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sn{constructor(e){this.fields=e,e.sort(Pe.comparator)}static empty(){return new Sn([])}unionWith(e){let n=new An(Pe.comparator);for(const r of this.fields)n=n.add(r);for(const r of e)n=n.add(r);return new Sn(n.toArray())}covers(e){for(const n of this.fields)if(n.isPrefixOf(e))return!0;return!1}isEqual(e){return Ea(this.fields,e.fields,(n,r)=>n.isEqual(r))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Be{constructor(e){this.value=e}static empty(){return new Be({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let n=this.value;for(let r=0;r<e.length-1;++r)if(n=(n.mapValue.fields||{})[e.get(r)],!Lr(n))return null;return n=(n.mapValue.fields||{})[e.lastSegment()],n||null}}set(e,n){this.getFieldsMap(e.popLast())[e.lastSegment()]=un(n)}setAll(e){let n=Pe.emptyPath(),r={},s=[];e.forEach((o,l)=>{if(!n.isImmediateParentOf(l)){const a=this.getFieldsMap(n);this.applyChanges(a,r,s),r={},s=[],n=l.popLast()}o?r[l.lastSegment()]=un(o):s.push(l.lastSegment())});const i=this.getFieldsMap(n);this.applyChanges(i,r,s)}delete(e){const n=this.field(e.popLast());Lr(n)&&n.mapValue.fields&&delete n.mapValue.fields[e.lastSegment()]}isEqual(e){return Zn(this.value,e.value)}getFieldsMap(e){let n=this.value;n.mapValue.fields||(n.mapValue={fields:{}});for(let r=0;r<e.length;++r){let s=n.mapValue.fields[e.get(r)];Lr(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},n.mapValue.fields[e.get(r)]=s),n=s}return n.mapValue.fields}applyChanges(e,n,r){Rn(n,(s,i)=>e[s]=i);for(const s of r)delete e[s]}clone(){return new Be(un(this.value))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nt{constructor(e,n,r,s,i,o,l){this.key=e,this.documentType=n,this.version=r,this.readTime=s,this.createTime=i,this.data=o,this.documentState=l}static newInvalidDocument(e){return new nt(e,0,Te.min(),Te.min(),Te.min(),Be.empty(),0)}static newFoundDocument(e,n,r,s){return new nt(e,1,n,Te.min(),r,s,0)}static newNoDocument(e,n){return new nt(e,2,n,Te.min(),Te.min(),Be.empty(),0)}static newUnknownDocument(e,n){return new nt(e,3,n,Te.min(),Te.min(),Be.empty(),2)}convertToFoundDocument(e,n){return!this.createTime.isEqual(Te.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=n,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Be.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Be.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=Te.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof nt&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new nt(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rf{constructor(e,n=null,r=[],s=[],i=null,o=null,l=null){this.path=e,this.collectionGroup=n,this.orderBy=r,this.filters=s,this.limit=i,this.startAt=o,this.endAt=l,this.C=null}}function Ui(t,e=null,n=[],r=[],s=null,i=null,o=null){return new rf(t,e,n,r,s,i,o)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sf{constructor(e,n=null,r=[],s=[],i=null,o="F",l=null,a=null){this.path=e,this.collectionGroup=n,this.explicitOrderBy=r,this.filters=s,this.limit=i,this.limitType=o,this.startAt=l,this.endAt=a,this.S=null,this.N=null,this.O=null,this.startAt,this.endAt}}function of(t){const e=fr(t);if(e.S===null){e.S=[];const n=new Set;for(const i of e.explicitOrderBy)e.S.push(i),n.add(i.field.canonicalString());const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let l=new An(Pe.comparator);return o.filters.forEach(a=>{a.getFlattenedFilters().forEach(c=>{c.isInequality()&&(l=l.add(c.field))})}),l})(e).forEach(i=>{n.has(i.canonicalString())||i.isKeyField()||e.S.push(new es(i,r))}),n.has(Pe.keyField().canonicalString())||e.S.push(new es(Pe.keyField(),r))}return e.S}function af(t){const e=fr(t);return e.N||(e.N=lf(e,of(t))),e.N}function lf(t,e){if(t.limitType==="F")return Ui(t.path,t.collectionGroup,e,t.filters,t.limit,t.startAt,t.endAt);{e=e.map(s=>{const i=s.dir==="desc"?"asc":"desc";return new es(s.field,i)});const n=t.endAt?new Bi(t.endAt.position,t.endAt.inclusive):null,r=t.startAt?new Bi(t.startAt.position,t.startAt.inclusive):null;return Ui(t.path,t.collectionGroup,e,t.filters,t.limit,n,r)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ma(t,e){if(t.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Xn(e)?"-0":e}}function cf(t,e){return function(r){return typeof r=="number"&&Number.isInteger(r)&&!Xn(r)&&r<=Number.MAX_SAFE_INTEGER&&r>=Number.MIN_SAFE_INTEGER}(e)?function(r){return{integerValue:""+r}}(e):Ma(t,e)}/**
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
 */class mr{constructor(){this._=void 0}}class uf extends mr{}class df extends mr{constructor(e){super(),this.elements=e}}class hf extends mr{constructor(e){super(),this.elements=e}}class ff extends mr{constructor(e,n){super(),this.serializer=e,this.q=n}}class dn{constructor(e,n){this.updateTime=e,this.exists=n}static none(){return new dn}static exists(e){return new dn(void 0,e)}static updateTime(e){return new dn(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}class gr{}class pf extends gr{constructor(e,n,r,s=[]){super(),this.key=e,this.value=n,this.precondition=r,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class Na extends gr{constructor(e,n,r,s,i=[]){super(),this.key=e,this.data=n,this.fieldMask=r,this.precondition=s,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}class mf extends gr{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class gf extends gr{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yf={asc:"ASCENDING",desc:"DESCENDING"},_f={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},Tf={and:"AND",or:"OR"};class bf{constructor(e,n){this.databaseId=e,this.useProto3Json=n}}function ts(t,e){return t.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function vf(t,e){return t.useProto3Json?e.toBase64():e.toUint8Array()}function Af(t,e){return ts(t,e.toTimestamp())}function Gi(t){return mt(!!t),Te.fromTimestamp(function(n){const r=wt(n);return new Oe(r.seconds,r.nanos)}(t))}function Ls(t,e){return ns(t,e).canonicalString()}function ns(t,e){const n=function(s){return new pe(["projects",s.projectId,"databases",s.database])}(t).child("documents");return e===void 0?n:n.child(e)}function rs(t,e){return Ls(t.databaseId,e.path)}function Sf(t,e){const n=function(s){const i=pe.fromString(s);return mt(Ca(i)),i}(e);if(n.get(1)!==t.databaseId.projectId)throw new V(Y,"Tried to deserialize key from different project: "+n.get(1)+" vs "+t.databaseId.projectId);if(n.get(3)!==t.databaseId.database)throw new V(Y,"Tried to deserialize key from different database: "+n.get(3)+" vs "+t.databaseId.database);return new Ae(function(s){return mt(s.length>4&&s.get(4)==="documents"),s.popFirst(5)}(n))}function Yi(t,e,n){return{name:rs(t,e),fields:n.value.mapValue.fields}}function If(t,e){let n;if(e instanceof pf)n={update:Yi(t,e.key,e.value)};else if(e instanceof mf)n={delete:rs(t,e.key)};else if(e instanceof Na)n={update:Yi(t,e.key,e.data),updateMask:Rf(e.fieldMask)};else{if(!(e instanceof gf))return oe();n={verify:rs(t,e.key)}}return e.fieldTransforms.length>0&&(n.updateTransforms=e.fieldTransforms.map(r=>function(i,o){const l=o.transform;if(l instanceof uf)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(l instanceof df)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:l.elements}};if(l instanceof hf)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:l.elements}};if(l instanceof ff)return{fieldPath:o.field.canonicalString(),increment:l.q};throw oe()}(0,r))),e.precondition.isNone||(n.currentDocument=function(s,i){return i.updateTime!==void 0?{updateTime:Af(s,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:oe()}(t,e.precondition)),n}function wf(t,e){const n={structuredQuery:{}},r=e.path;let s;e.collectionGroup!==null?(s=r,n.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(s=r.popLast(),n.structuredQuery.from=[{collectionId:r.lastSegment()}]),n.parent=function(c,u){return Ls(c.databaseId,u)}(t,s);const i=function(c){if(c.length!==0)return xa(pr.create(c,"and"))}(e.filters);i&&(n.structuredQuery.where=i);const o=function(c){if(c.length!==0)return c.map(u=>function(h){return{field:Nt(h.field),direction:Ef(h.dir)}}(u))}(e.orderBy);o&&(n.structuredQuery.orderBy=o);const l=function(c,u){return c.useProto3Json||$h(u)?u:{value:u}}(t,e.limit);return l!==null&&(n.structuredQuery.limit=l),e.startAt&&(n.structuredQuery.startAt=function(c){return{before:c.inclusive,values:c.position}}(e.startAt)),e.endAt&&(n.structuredQuery.endAt=function(c){return{before:!c.inclusive,values:c.position}}(e.endAt)),{B:n,parent:s}}function Ef(t){return yf[t]}function kf(t){return _f[t]}function Pf(t){return Tf[t]}function Nt(t){return{fieldPath:t.canonicalString()}}function xa(t){return t instanceof $e?function(n){if(n.op==="=="){if(Vi(n.value))return{unaryFilter:{field:Nt(n.field),op:"IS_NAN"}};if(Li(n.value))return{unaryFilter:{field:Nt(n.field),op:"IS_NULL"}}}else if(n.op==="!="){if(Vi(n.value))return{unaryFilter:{field:Nt(n.field),op:"IS_NOT_NAN"}};if(Li(n.value))return{unaryFilter:{field:Nt(n.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Nt(n.field),op:kf(n.op),value:n.value}}}(t):t instanceof pr?function(n){const r=n.getFilters().map(s=>xa(s));return r.length===1?r[0]:{compositeFilter:{op:Pf(n.op),filters:r}}}(t):oe()}function Rf(t){const e=[];return t.fields.forEach(n=>e.push(n.canonicalString())),{fieldPaths:e}}function Ca(t){return t.length>=4&&t.get(0)==="projects"&&t.get(2)==="databases"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vs(t){return new bf(t,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Df extends class{}{constructor(e,n,r,s){super(),this.authCredentials=e,this.appCheckCredentials=n,this.connection=r,this.serializer=s,this.Y=!1}Z(){if(this.Y)throw new V(Kt,"The client has already been terminated.")}P(e,n,r,s){return this.Z(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([i,o])=>this.connection.P(e,ns(n,r),s,i,o)).catch(i=>{throw i.name==="FirebaseError"?(i.code===Zr&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new V(cn,i.toString())})}g(e,n,r,s,i){return this.Z(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,l])=>this.connection.g(e,ns(n,r),s,o,l,i)).catch(o=>{throw o.name==="FirebaseError"?(o.code===Zr&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new V(cn,o.toString())})}terminate(){this.Y=!0,this.connection.terminate()}}async function Of(t,e){const n=fr(t),r={writes:e.map(s=>If(n.serializer,s))};await n.P("Commit",n.serializer.databaseId,pe.emptyPath(),r)}async function Mf(t,e){const n=fr(t),{B:r,parent:s}=wf(n.serializer,af(e));return(await n.g("RunQuery",n.serializer.databaseId,s,{structuredQuery:r.structuredQuery})).filter(i=>!!i.document).map(i=>function(l,a,c){const u=Sf(l,a.name),d=Gi(a.updateTime),h=a.createTime?Gi(a.createTime):Te.min(),y=new Be({mapValue:{fields:a.fields}}),m=nt.newFoundDocument(u,d,h,y);return c?m.setHasCommittedMutations():m}(n.serializer,i.document,void 0))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hn=new Map;function La(t){if(t._terminated)throw new V(Kt,"The client has already been terminated.");if(!hn.has(t)){Qn("ComponentProvider","Initializing Datastore");const e=function(i){return new Kh(i,fetch.bind(null))}(function(i,o,l,a){return new Uh(i,o,l,a.host,a.ssl,a.experimentalForceLongPolling,a.experimentalAutoDetectLongPolling,wa(a.experimentalLongPollingOptions),a.useFetchStreams)}(t._databaseId,t.app.options.appId||"",t._persistenceKey,t._freezeSettings())),n=Vs(t._databaseId),r=function(i,o,l,a){return new Df(i,o,l,a)}(t._authCredentials,t._appCheckCredentials,e,n);hn.set(t,r)}return hn.get(t)}class $i{constructor(e){var n,r;if(e.host===void 0){if(e.ssl!==void 0)throw new V(Y,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(n=e.ssl)===null||n===void 0||n;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new V(Y,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}(function(i,o,l,a){if(o===!0&&a===!0)throw new V(Y,`${i} and ${l} cannot be used together.`)})("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=wa((r=e.experimentalLongPollingOptions)!==null&&r!==void 0?r:{}),function(i){if(i.timeoutSeconds!==void 0){if(isNaN(i.timeoutSeconds))throw new V(Y,`invalid long polling timeout: ${i.timeoutSeconds} (must not be NaN)`);if(i.timeoutSeconds<5)throw new V(Y,`invalid long polling timeout: ${i.timeoutSeconds} (minimum allowed value is 5)`);if(i.timeoutSeconds>30)throw new V(Y,`invalid long polling timeout: ${i.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(r,s){return r.timeoutSeconds===s.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class yr{constructor(e,n,r,s){this._authCredentials=e,this._appCheckCredentials=n,this._databaseId=r,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new $i({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new V(Kt,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new V(Kt,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new $i(e),e.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new Nh;switch(r.type){case"firstParty":return new Vh(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new V(Y,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(n){const r=hn.get(n);r&&(Qn("ComponentProvider","Removing Datastore"),hn.delete(n),r.terminate())}(this),Promise.resolve()}}function Nf(t,e){const n=typeof t=="object"?t:Fo(),r=typeof t=="string"?t:e||"(default)",s=vs(n,"firestore/lite").getImmediate({identifier:r});if(!s._initialized){const i=Zl("firestore");i&&xf(s,...i)}return s}function xf(t,e,n,r={}){var s;const i=(t=Cs(t,yr))._getSettings(),o=`${e}:${n}`;if(i.host!=="firestore.googleapis.com"&&i.host!==o&&va("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),t._setSettings(Object.assign(Object.assign({},i),{host:o,ssl:!1})),r.mockUserToken){let l,a;if(typeof r.mockUserToken=="string")l=r.mockUserToken,a=Ee.MOCK_USER;else{l=tc(r.mockUserToken,(s=t._app)===null||s===void 0?void 0:s.options.projectId);const c=r.mockUserToken.sub||r.mockUserToken.user_id;if(!c)throw new V(Y,"mockUserToken must contain 'sub' or 'user_id' field!");a=new Ee(c)}t._authCredentials=new xh(new Sa(l,a))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _r{constructor(e,n,r){this.converter=n,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new _r(this.firestore,e,this._query)}}class xe{constructor(e,n,r){this.converter=n,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new ft(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new xe(this.firestore,e,this._key)}}class ft extends _r{constructor(e,n,r){super(e,n,function(i){return new sf(i)}(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new xe(this.firestore,null,new Ae(e))}withConverter(e){return new ft(this.firestore,e,this._path)}}function Cf(t,e,...n){if(t=ye(t),Ia("collection","path",e),t instanceof yr){const r=pe.fromString(e,...n);return Di(r),new ft(t,null,r)}{if(!(t instanceof xe||t instanceof ft))throw new V(Y,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=t._path.child(pe.fromString(e,...n));return Di(r),new ft(t.firestore,null,r)}}function Lf(t,e,...n){if(t=ye(t),arguments.length===1&&(e=Hh.newId()),Ia("doc","path",e),t instanceof yr){const r=pe.fromString(e,...n);return Ri(r),new xe(t,null,new Ae(r))}{if(!(t instanceof xe||t instanceof ft))throw new V(Y,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=t._path.child(pe.fromString(e,...n));return Ri(r),new xe(t.firestore,t instanceof ft?t.converter:null,new Ae(r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wt{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Wt(Qe.fromBase64String(e))}catch(n){throw new V(Y,"Failed to construct data from Base64 string: "+n)}}static fromUint8Array(e){return new Wt(Qe.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tr{constructor(...e){for(let n=0;n<e.length;++n)if(e[n].length===0)throw new V(Y,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Pe(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bs{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fs{constructor(e,n){if(!isFinite(e)||e<-90||e>90)throw new V(Y,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(n)||n<-180||n>180)throw new V(Y,"Longitude must be a number between -180 and 180, but was: "+n);this._lat=e,this._long=n}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return ue(this._lat,e._lat)||ue(this._long,e._long)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class Us{constructor(e){this._values=(e||[]).map(n=>n)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(r,s){if(r.length!==s.length)return!1;for(let i=0;i<r.length;++i)if(r[i]!==s[i])return!1;return!0}(this._values,e._values)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vf=/^__.*__$/;class Va{constructor(e,n,r){this.data=e,this.fieldMask=n,this.fieldTransforms=r}toMutation(e,n){return new Na(e,this.data,this.fieldMask,n,this.fieldTransforms)}}function Ba(t){switch(t){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw oe()}}class Gs{constructor(e,n,r,s,i,o){this.settings=e,this.databaseId=n,this.serializer=r,this.ignoreUndefinedProperties=s,i===void 0&&this.tt(),this.fieldTransforms=i||[],this.fieldMask=o||[]}get path(){return this.settings.path}get et(){return this.settings.et}rt(e){return new Gs(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}nt(e){var n;const r=(n=this.path)===null||n===void 0?void 0:n.child(e),s=this.rt({path:r,it:!1});return s.st(e),s}ot(e){var n;const r=(n=this.path)===null||n===void 0?void 0:n.child(e),s=this.rt({path:r,it:!1});return s.tt(),s}ut(e){return this.rt({path:void 0,it:!0})}_t(e){return nr(e,this.settings.methodName,this.settings.ct||!1,this.path,this.settings.lt)}contains(e){return this.fieldMask.find(n=>e.isPrefixOf(n))!==void 0||this.fieldTransforms.find(n=>e.isPrefixOf(n.field))!==void 0}tt(){if(this.path)for(let e=0;e<this.path.length;e++)this.st(this.path.get(e))}st(e){if(e.length===0)throw this._t("Document fields must not be empty");if(Ba(this.et)&&Vf.test(e))throw this._t('Document fields cannot begin and end with "__"')}}class Bf{constructor(e,n,r){this.databaseId=e,this.ignoreUndefinedProperties=n,this.serializer=r||Vs(e)}ht(e,n,r,s=!1){return new Gs({et:e,methodName:n,lt:r,path:Pe.emptyPath(),it:!1,ct:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Ff(t){const e=t._freezeSettings(),n=Vs(t._databaseId);return new Bf(t._databaseId,!!e.ignoreUndefinedProperties,n)}class br extends Bs{_toFieldTransform(e){if(e.et!==2)throw e.et===1?e._t(`${this._methodName}() can only appear at the top level of your update data`):e._t(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof br}}function Uf(t,e,n,r){const s=t.ht(1,e,n);Ua("Data must be an object, but it was:",s,r);const i=[],o=Be.empty();Rn(r,(a,c)=>{const u=Ys(e,a,n);c=ye(c);const d=s.ot(u);if(c instanceof br)i.push(u);else{const h=vr(c,d);h!=null&&(i.push(u),o.set(u,h))}});const l=new Sn(i);return new Va(o,l,s.fieldTransforms)}function Gf(t,e,n,r,s,i){const o=t.ht(1,e,n),l=[ji(e,r,n)],a=[s];if(i.length%2!=0)throw new V(Y,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let h=0;h<i.length;h+=2)l.push(ji(e,i[h])),a.push(i[h+1]);const c=[],u=Be.empty();for(let h=l.length-1;h>=0;--h)if(!jf(c,l[h])){const y=l[h];let m=a[h];m=ye(m);const p=o.ot(y);if(m instanceof br)c.push(y);else{const T=vr(m,p);T!=null&&(c.push(y),u.set(y,T))}}const d=new Sn(c);return new Va(u,d,o.fieldTransforms)}function vr(t,e){if(Fa(t=ye(t)))return Ua("Unsupported field value:",e,t),Yf(t,e);if(t instanceof Bs)return function(r,s){if(!Ba(s.et))throw s._t(`${r._methodName}() can only be used with update() and set()`);if(!s.path)throw s._t(`${r._methodName}() is not currently supported inside arrays`);const i=r._toFieldTransform(s);i&&s.fieldTransforms.push(i)}(t,e),null;if(t===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),t instanceof Array){if(e.settings.it&&e.et!==4)throw e._t("Nested arrays are not supported");return function(r,s){const i=[];let o=0;for(const l of r){let a=vr(l,s.ut(o));a==null&&(a={nullValue:"NULL_VALUE"}),i.push(a),o++}return{arrayValue:{values:i}}}(t,e)}return function(r,s){if((r=ye(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return cf(s.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const i=Oe.fromDate(r);return{timestampValue:ts(s.serializer,i)}}if(r instanceof Oe){const i=new Oe(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:ts(s.serializer,i)}}if(r instanceof Fs)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof Wt)return{bytesValue:vf(s.serializer,r._byteString)};if(r instanceof xe){const i=s.databaseId,o=r.firestore._databaseId;if(!o.isEqual(i))throw s._t(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${i.projectId}/${i.database}`);return{referenceValue:Ls(r.firestore._databaseId||s.databaseId,r._key.path)}}if(r instanceof Us)return function(o,l){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:o.toArray().map(a=>{if(typeof a!="number")throw l._t("VectorValues must only contain numeric values.");return Ma(l.serializer,a)})}}}}}}(r,s);throw s._t(`Unsupported field value: ${xs(r)}`)}(t,e)}function Yf(t,e){const n={};return function(s){for(const i in s)if(Object.prototype.hasOwnProperty.call(s,i))return!1;return!0}(t)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Rn(t,(r,s)=>{const i=vr(s,e.nt(r));i!=null&&(n[r]=i)}),{mapValue:{fields:n}}}function Fa(t){return!(typeof t!="object"||t===null||t instanceof Array||t instanceof Date||t instanceof Oe||t instanceof Fs||t instanceof Wt||t instanceof xe||t instanceof Bs||t instanceof Us)}function Ua(t,e,n){if(!Fa(n)||!function(s){return typeof s=="object"&&s!==null&&(Object.getPrototypeOf(s)===Object.prototype||Object.getPrototypeOf(s)===null)}(n)){const r=xs(n);throw r==="an object"?e._t(t+" a custom object"):e._t(t+" "+r)}}function ji(t,e,n){if((e=ye(e))instanceof Tr)return e._internalPath;if(typeof e=="string")return Ys(t,e);throw nr("Field path arguments must be of type string or ",t,!1,void 0,n)}const $f=new RegExp("[~\\*/\\[\\]]");function Ys(t,e,n){if(e.search($f)>=0)throw nr(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,t,!1,void 0,n);try{return new Tr(...e.split("."))._internalPath}catch{throw nr(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,t,!1,void 0,n)}}function nr(t,e,n,r,s){const i=r&&!r.isEmpty(),o=s!==void 0;let l=`Function ${e}() called with invalid data`;n&&(l+=" (via `toFirestore()`)"),l+=". ";let a="";return(i||o)&&(a+=" (found",i&&(a+=` in field ${r}`),o&&(a+=` in document ${s}`),a+=")"),new V(Y,l+t+a)}function jf(t,e){return t.some(n=>n.isEqual(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kf{constructor(e,n,r,s,i){this._firestore=e,this._userDataWriter=n,this._key=r,this._document=s,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new xe(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new Ga(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const n=this._document.data.field(Hf("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n)}}}class Ga extends Kf{data(){return super.data()}}class Wf{constructor(e,n){this._docs=n,this.query=e}get docs(){return[...this._docs]}get size(){return this.docs.length}get empty(){return this.docs.length===0}forEach(e,n){this._docs.forEach(e,n)}}function Hf(t,e){return typeof e=="string"?Ys(t,e):e instanceof Tr?e._internalPath:e._delegate._internalPath}class zf extends class{convertValue(n,r="none"){switch(Et(n)){case 0:return null;case 1:return n.booleanValue;case 2:return ce(n.integerValue||n.doubleValue);case 3:return this.convertTimestamp(n.timestampValue);case 4:return this.convertServerTimestamp(n,r);case 5:return n.stringValue;case 6:return this.convertBytes(Tn(n.bytesValue));case 7:return this.convertReference(n.referenceValue);case 8:return this.convertGeoPoint(n.geoPointValue);case 9:return this.convertArray(n.arrayValue,r);case 11:return this.convertObject(n.mapValue,r);case 10:return this.convertVectorValue(n.mapValue);default:throw oe()}}convertObject(n,r){return this.convertObjectMap(n.fields,r)}convertObjectMap(n,r="none"){const s={};return Rn(n,(i,o)=>{s[i]=this.convertValue(o,r)}),s}convertVectorValue(n){var r,s,i;const o=(i=(s=(r=n.fields)===null||r===void 0?void 0:r.value.arrayValue)===null||s===void 0?void 0:s.values)===null||i===void 0?void 0:i.map(l=>ce(l.doubleValue));return new Us(o)}convertGeoPoint(n){return new Fs(ce(n.latitude),ce(n.longitude))}convertArray(n,r){return(n.values||[]).map(s=>this.convertValue(s,r))}convertServerTimestamp(n,r){switch(r){case"previous":const s=Pa(n);return s==null?null:this.convertValue(s,r);case"estimate":return this.convertTimestamp(bn(n));default:return null}}convertTimestamp(n){const r=wt(n);return new Oe(r.seconds,r.nanos)}convertDocumentKey(n,r){const s=pe.fromString(n);mt(Ca(s));const i=new yn(s.get(1),s.get(3)),o=new Ae(s.popFirst(5));return i.isEqual(r)||Ms(`Document ${o} contains a document reference within a different database (${i.projectId}/${i.database}) which is not supported. It will be treated as a reference in the current database (${r.projectId}/${r.database}) instead.`),o}}{constructor(e){super(),this.firestore=e}convertBytes(e){return new Wt(e)}convertReference(e){const n=this.convertDocumentKey(e,this.firestore._databaseId);return new xe(this.firestore,null,n)}}function qf(t){(function(s){if(s.limitType==="L"&&s.explicitOrderBy.length===0)throw new V(Aa,"limitToLast() queries require specifying at least one orderBy() clause")})((t=Cs(t,_r))._query);const e=La(t.firestore),n=new zf(t.firestore);return Mf(e,t._query).then(r=>{const s=r.map(i=>new Ga(t.firestore,n,i.key,i,t.converter));return t._query.limitType==="L"&&s.reverse(),new Wf(t,s)})}function Jf(t,e,n,...r){const s=Ff((t=Cs(t,xe)).firestore);let i;return i=typeof(e=ye(e))=="string"||e instanceof Tr?Gf(s,"updateDoc",t._key,e,n,r):Uf(s,"updateDoc",t._key,e),Of(La(t.firestore),[i.toMutation(t._key,dn.exists(!0))])}(function(){(function(n){Qt=n})(`${qt}_lite`),Yt(new St("firestore/lite",(e,{instanceIdentifier:n,options:r})=>{const s=e.getProvider("app").getImmediate(),i=new yr(new Ch(e.getProvider("auth-internal")),new Fh(e.getProvider("app-check-internal")),function(l,a){if(!Object.prototype.hasOwnProperty.apply(l.options,["projectId"]))throw new V(Y,'"projectId" not provided in firebase.initializeApp.');return new yn(l.options.projectId,a)}(s,n),s);return r&&i._setSettings(r),i},"PUBLIC").setMultipleInstances(!0)),ht("firestore-lite","4.7.3",""),ht("firestore-lite","4.7.3","esm2017")})();const Ya=Object.freeze({apiKey:"AIzaSyBdbve0H70D-Ch69WlaxEly7PVBFVRB5p0",authDomain:"pensiontools-4b237.firebaseapp.com",projectId:"pensiontools-4b237",storageBucket:"pensiontools-4b237.firebasestorage.app",messagingSenderId:"760877353696",appId:"1:760877353696:web:2d6f7173c8d7fab6fd9e85"});function Qf(){return Ya.apiKey!=="YOUR_API_KEY"}const Xf=3;function Zf(t){const e=t&&typeof t=="object"?t.schemaVersion:void 0;return Number.isInteger(e)&&e>=0?e:0}const ep="6.22.0",$a="pots-and-valves",rr={"pots-and-valves":[],"buckets-in-order":["bucketBand"],"bridge-and-engine":["bridgeAge","cashYears"],"ladder-and-ratchet":["ladderYears","drawAnnual","triggerMode","bandThreshold"],"floor-and-flex":["essentialsAnnual","horizonAge","sleeveRate","treatsRule","ratchet"],"floor-the-schedule":[],"floor-to-age":["floorToAge","borrowedFloor"],"full-il-gilt":["cashYears","bridgeCash"],"gilt-rotation":["cashYears","bridgeCash","rotateCutAge","rotateTrigger","rotateDisarmYears"]},tp=["sippTotal","isaTotal"],$s=t=>Object.prototype.hasOwnProperty.call(rr,t),Ki=t=>!!t&&typeof t=="object"&&!Array.isArray(t),ja=t=>{const e={};for(const[n,r]of Object.entries(t||{}))r!==void 0&&(e[n]=r);return e},np=t=>Array.isArray(t)?t.filter(Boolean).map(e=>ja(e)):[];function Wi(t){return $s(t)?rr[t].slice():[]}function Ka(t){return t===$a?Wi(t):[...Wi(t),...tp]}function rp(t,e){const n=e&&typeof e=="object"?e:{};if(!$s(t))return ja(n);const r={};for(const s of Ka(t))n[s]!==void 0&&(r[s]=n[s]);return r}function sp(t){return t.allocMode||(Array.isArray(t.taggedFunds)&&t.taggedFunds.length?"funds":"risk")}function ip(t){const e=t||{},n=e.strategyId||$a;if(!$s(n)||Ki(e.strategyState)&&Object.keys(e.strategyState).length)return e;const r=Ki(e.strategyParams)?e.strategyParams:{},s=new Set(Ka(n));if(!Object.keys(r).some(o=>r[o]!==void 0&&!s.has(o)))return e;const i={};for(const o of Object.keys(rr))o===n||!rr[o].some(l=>r[l]!==void 0)||(i[o]={strategyParams:rp(o,r),allocMode:sp(e),taggedFunds:np(e.taggedFunds),savedAt:null});return Object.keys(i).length?{...e,strategyState:i}:e}const js=1,op=["typed","paste","imported","none"],ap=["fund","gilt","cash"];function Ne(t){if(t===""||t==null)return null;const e=typeof t=="number"?t:+String(t).replace(/[£$€,\s]/g,"");return Number.isFinite(e)?e:null}const Ln=(t,{upper:e=!1}={})=>{const n=String(t??"").trim();return n?e?n.toUpperCase():n:null};function Wa(t){const e=String(t??"").trim().slice(0,10);return/^\d{4}-\d{2}-\d{2}$/.test(e)?e:null}function Ar(t){const e=String(t??"").trim().toUpperCase();return e==="ISA"||e==="LISA"||e==="S&S ISA"||e==="STOCKS AND SHARES ISA"?"ISA":e==="GIA"||e==="TAXABLE"||e==="DEALING"||e==="GENERAL"||e==="TRADING"?"GIA":e==="CASH"||e==="BANK"||e==="SAVINGS"?"CASH":"SIPP"}function lp(){return{version:js,updatedAt:null,source:"none",offerDismissed:!1,lines:[]}}function cp(t){const e=t&&typeof t=="object"?t:{},n=Ln(e.ticker,{upper:!0}),r=Ln(e.name),s=Ln(e.sedol,{upper:!0});if(!n&&!r&&!s)return null;const i=ap.includes(e.kind)?e.kind:null;return{wrapper:Ar(e.wrapper),ticker:n,name:r,sedol:s,units:Ne(e.units),value:Ne(e.value),ocf:Ne(e.ocf),contribution:Ne(e.contribution),subClass:Ln(e.subClass),kind:i,asOf:Wa(e.asOf)}}function Xt(t){if(Array.isArray(t))return Xt({lines:t});if(!t||typeof t!="object")return lp();const e=(Array.isArray(t.lines)?t.lines:[]).map(cp).filter(Boolean),n=op.includes(t.source)?t.source:e.length?"typed":"none";return{version:js,updatedAt:Wa(t.updatedAt),source:n,offerDismissed:t.offerDismissed===!0,lines:e}}function Zt(t){return Array.isArray(t)?t:t&&typeof t=="object"&&Array.isArray(t.lines)?t.lines:[]}function up(t){const e=Zt(t),n={SIPP:0,ISA:0,GIA:0,CASH:0};let r=0;for(const s of e){const i=Ne(s&&s.value);i!=null&&(r+=i,n[Ar(s.wrapper)]+=i)}return{count:e.length,total:r,byWrapper:n}}const Z=t=>!!t&&typeof t=="object"&&!Array.isArray(t),dp=t=>{if(!Z(t))return!1;const e=Object.getPrototypeOf(t);return e===Object.prototype||e===null};function sr(t){if(Array.isArray(t))return t.map(sr);if(dp(t)){const e={};for(const n of Object.keys(t))e[n]=sr(t[n]);return e}return t}const hp=t=>{const e=t instanceof Date?t:new Date(t??Date.now());return Number.isFinite(e.getTime())?e.toISOString():new Date().toISOString()},Tt=t=>{const e=JSON.stringify(t);return e===void 0?"undefined":e};function fp(t){const e=t&&Z(t.decisionTool)?t.decisionTool:null;return e?Z(e.settings)&&e.settings.locked||Array.isArray(e.history)&&e.history.length?!0:Z(e.taxYears)&&Object.values(e.taxYears).some(n=>n&&n.yearSetupComplete):!1}function Ks(t){const e=t&&Z(t.decisionTool)?t.decisionTool:null;return!!(e&&Z(e.settings)&&e.settings.locked)}const pp=2,Hi=t=>Tt(t&&Z(t.stressTool)?t.stressTool.settings:void 0);function zi(t){const e=t||{},n=Z(e.decisionTool)?e.decisionTool:{},r={planDocument:Tt(e.planDocument),planDocumentArchive:Tt(e.planDocumentArchive),"decisionTool.planOfRecord":Tt(n.planOfRecord),"decisionTool.planOfRecordArchive":Tt(n.planOfRecordArchive),"decisionTool.history":Tt(n.history)};return fp(e)&&(r["decisionTool.settings"]=Tt(n.settings)),r}function mp(t,{now:e}){if(!Z(t.strategy)){const s=typeof t.createdAt=="string"&&t.createdAt?t.createdAt:typeof t.lastModified=="string"&&t.lastModified?t.lastModified:hp(e);t.strategy={id:"pots-and-valves",params:{},lockedAt:s,engineVersion:ep}}const n=Z(t.stressTool)&&Z(t.stressTool.settings)?t.stressTool.settings:null;if(n){for(const[i,o]of[["pacwMin","equityMin"],["cgtMin","bondMin"],["csh2Target","cashTarget"]])n[i]!==void 0&&n[o]===void 0&&(n[o]=n[i]);const s=ip(n);s!==n&&Z(s.strategyState)&&(n.strategyState=sr(s.strategyState))}const r=t.holdings;return(Array.isArray(r)||Z(r)&&r.version!==js)&&(t.holdings={...Z(r)?r:{},...Xt(r)}),t}function gp(t){if(Ks(t))return t;const e=Z(t.stressTool)&&Z(t.stressTool.settings)?t.stressTool.settings:null;return e&&(Sl(e.chargesPct)||(e.chargesPct=Eo)),t}function yp(t){if(Ks(t))return t;const e=Z(t.stressTool)&&Z(t.stressTool.settings)?t.stressTool.settings:null;return e&&(Il(e.isaGrowth)||(e.isaGrowth=ko),_p(t,e)&&(e.isaBalance=0)),t}function _p(t,e){const n=Z(t.fromAnswer)&&Array.isArray(t.fromAnswer.people)&&Z(t.fromAnswer.people[0])?t.fromAnswer.people[0]:null,r=n&&Z(n.savings)?n.savings:null,s=r&&Z(r.atStop)&&typeof r.atStop.middling=="number"?r.atStop.middling:NaN,i=Z(e.potAtRetirement)?e.potAtRetirement:null;return!!r&&r.today===0&&s>0&&e.retired===!1&&!!i&&i.source==="override"&&i.isa===s&&e.isaBalance===s}const Tp=[{to:1,name:"Version stamp; strategy block, renamed Stress keys, per-strategy settings and holdings shape written once",up:mp},{to:2,name:"Fund and platform charges: 0.5% a year written into every unlocked plan; locked plans untouched",up:gp},{to:3,name:'How ISAs and savings grow: "Mostly cash" written into every unlocked plan; locked plans untouched',up:yp}];function bp(t,{now:e=new Date,migrations:n=Tp,target:r=Xf}={}){const s=Zf(t),i={scenario:t,from:s,to:s,changed:!1,error:null,newer:!1};if(!Z(t))return i;if(s>r)return{...i,newer:!0};if(s===r)return i;try{const o=zi(t);let l=sr(t),a=s;for(const d of n){if(!(d.to>a))continue;if(d.to!==a+1)throw new Error("Migration chain has a gap: no step from version "+a+" to "+(a+1));const h=d.to>=pp&&Ks(l)?Hi(l):null,y=d.up(l,{now:e});if(y!==void 0&&(l=y),!Z(l))throw new Error("Migration to version "+d.to+" did not return a plan");if(h!==null&&Hi(l)!==h)throw new Error("Migration to version "+d.to+" changed the Stress settings of a locked plan, which no migration may touch");if(l.schemaVersion=d.to,a=d.to,a===r)break}if(a!==r)throw new Error("Migration chain stops at version "+a+", short of "+r);const c=Object.keys(t).filter(d=>!(d in l));if(c.length)throw new Error("Migration dropped root key(s): "+c.join(", "));const u=zi(l);for(const d of Object.keys(o))if(u[d]!==o[d])throw new Error("Migration changed "+d+", which no migration may touch");return{scenario:l,from:s,to:a,changed:!0,error:null,newer:!1}}catch(o){return{...i,error:o instanceof Error?o:new Error(String(o))}}}const qi=["decisionSettings","stressSettings","name","description","taxYears"],Yn=t=>t&&typeof t=="object"&&!Array.isArray(t);function vp(t,e,n){const r=e.split(".");let s=t;for(let i=0;i<r.length-1;i++){const o=r[i];s[o]=Yn(s[o])?{...s[o]}:{},s=s[o]}s[r[r.length-1]]=n}function Ap(t){if(!t||typeof t!="object")return{scenario:t,migrated:!1};const e=Object.keys(t).filter(a=>a.includes(".")),n=qi.some(a=>a in t);if(!(e.length>0||n))return{scenario:t,migrated:!1};const s={};for(const[a,c]of Object.entries(t))!a.includes(".")&&!qi.includes(a)&&(s[a]=c);for(const a of e)vp(s,a,t[a]);s.isActive=s.isActive??!1,s.enabledTools=s.enabledTools||["stress","decision"];const i=Yn(s.planDetails)?s.planDetails:{};s.planDetails={...i,name:i.name??t.name??"My Plan",description:i.description??t.description??""};const o=Yn(s.decisionTool)?s.decisionTool:{};s.decisionTool={...o,settings:o.settings??t.decisionSettings??{},history:o.history??[],taxYears:o.taxYears??t.taxYears??{}};const l=Yn(s.stressTool)?s.stressTool:{};return s.stressTool={...l,settings:l.settings??t.stressSettings??{}},{scenario:s,migrated:!0}}function Sp(t,{now:e}={}){const n=Ap(t),r=bp(n.scenario,e===void 0?{}:{now:e});return{scenario:r.scenario,write:!r.error&&!r.newer&&(n.migrated||r.changed),from:r.from,to:r.to,newer:r.newer,error:r.error}}const Ip=180,wp="pt_guest_minutes",Ep=t=>{const e=parseFloat(t);return Number.isFinite(e)&&e>0?e:0},kp=(t,e)=>{try{return t.getItem(e)}catch{return null}};function Ha(t){return Ep(kp(t,wp))}function za(t){return t>=Ip}function ss(){return{equityMin:de.EQUITY_MIN,bondMin:de.BOND_MIN,cashTarget:de.CASH_TARGET,duration:de.DURATION_YEARS,baseSalary:de.BASE_SALARY,other:0,statePension:12e3,statePensionYear:12,currentAge:null,currentAgeAsOf:null,retired:null,retireAge:null,firstTaxYear:null,potAtRetirement:null,pa:be.PERSONAL_ALLOWANCE,brl:be.BASIC_RATE_LIMIT,hrl:be.HIGHER_RATE_LIMIT,taxMode:"inflates",protectionMult:Ue.PROTECTION_MULTIPLIER,consecutiveLimit:de.CONSECUTIVE_LIMIT,disableProtection:!1,recoveryBuffer:de.RECOVERY_BUFFER,hodlEnabled:Ue.HODL_ENABLED,hodlValue:Ue.HODL_VALUE,isaBalance:0,isaReturn:Vt.RETURN,isaMin:Vt.MIN,isaDrawdownStrategy:Vt.DRAWDOWN_STRATEGY}}function Sr(t){if(!t)return null;const e={january:0,jan:0,february:1,feb:1,march:2,mar:2,april:3,apr:3,may:4,june:5,jun:5,july:6,jul:6,august:7,aug:7,september:8,sep:8,sept:8,october:9,oct:9,november:10,nov:10,december:11,dec:11},n=t.trim().replace(/\s+/g," ");if(/^\d{4}-\d{2}-\d{2}$/.test(n)){const[s,i,o]=n.split("-").map(Number),l=new Date(s,i-1,o);if(!isNaN(l.getTime()))return l}if(/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(n)){const[s,i,o]=n.split("/").map(Number);return new Date(o,i-1,s)}if(/^\d{1,2}-\d{1,2}-\d{4}$/.test(n)){const[s,i,o]=n.split("-").map(Number);return new Date(o,i-1,s)}let r=n.match(/^(\d{1,2})\s+(\w+)\s+(\d{4})$/i);if(r){const s=parseInt(r[1]),i=e[r[2].toLowerCase()],o=parseInt(r[3]);if(i!==void 0)return new Date(o,i,s)}if(r=n.match(/^(\w+)\s+(\d{1,2})\s+(\d{4})$/i),r){const s=e[r[1].toLowerCase()],i=parseInt(r[2]),o=parseInt(r[3]);if(s!==void 0)return new Date(o,s,i)}if(r=n.match(/^(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})$/i),r){const s=e[r[1].toLowerCase()],i=parseInt(r[2]),o=parseInt(r[3]);if(s!==void 0)return new Date(o,s,i)}if(r=n.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+(\w+),?\s+(\d{4})$/i),r){const s=parseInt(r[1]),i=e[r[2].toLowerCase()],o=parseInt(r[3]);if(i!==void 0)return new Date(o,i,s)}return null}function Ct(t){return Date.UTC(t.getFullYear(),t.getMonth(),t.getDate())/864e5}function Vr(t,e=new Date){const n=+t.currentAge||0;if(!n)return 0;if(t.currentAgeAsOf){const r=Date.parse(t.currentAgeAsOf);if(Number.isFinite(r))return n+Math.max(0,(e.getTime()-r)/(365.25*24*3600*1e3))}return n}function Pp(t,e=new Date){if(!t.spStartDate||!t.spWeeklyAmount)return null;const n=Sr(t.spStartDate);if(!n)return null;const r=365.25*24*60*60*1e3;let s;if(+t.firstTaxYear>0)return s=Math.max(0,(c=>c.getMonth()>3||c.getMonth()===3&&c.getDate()>=6?c.getFullYear():c.getFullYear()-1)(n)-+t.firstTaxYear),{spStartYear:s,spWeeklyAmount:t.spWeeklyAmount,spFirstYearRatio:Rp(t)??1};if(t.shapeAgeNow>0&&t.currentAge>0&&t.shapeAgeNow>Math.floor(Vr(t,e))&&n.getTime()>e.getTime()){let a=0;for(let u=e.getFullYear();u<=n.getFullYear();u++){const d=new Date(u,n.getMonth(),n.getDate());d.getTime()>e.getTime()&&d.getTime()<=n.getTime()&&a++}const c=Math.floor(Vr(t,e))+a;s=Math.max(0,c-t.shapeAgeNow)}else{const a=t.shapeAgeNow>0&&t.currentAge>0?Math.max(0,t.shapeAgeNow-Vr(t,e)):0,c=Math.max(0,(n.getTime()-e.getTime())/r-a);s=Math.floor((Math.round(c*12)+1)/12)}const i=365,o=Ct(n)-Ct(new Date(n.getFullYear(),0,0)),l=(i-o)/i;return{spStartYear:s,spWeeklyAmount:t.spWeeklyAmount,spFirstYearRatio:l}}function Rp(t){if(!t||!t.spStartDate)return null;const e=Sr(t.spStartDate);if(!e)return null;const n=e.getMonth()>3||e.getMonth()===3&&e.getDate()>=6?e.getFullYear():e.getFullYear()-1,r=new Date(n,3,6),s=new Date(n+1,3,6);return Math.max(0,Math.min(1,(Ct(s)-Ct(e))/(Ct(s)-Ct(r))))}function Br(t,e,n="potMid"){if(!Array.isArray(t)||!t.length)return null;const r=Math.max(0,Math.min(t.length-1,e)),s=Math.floor(r),i=r-s,o=t[s],l=t[Math.min(t.length-1,s+1)];if(!o)return null;const a=o[n]??o.potMid,c=(l&&(l[n]??l.potMid))??a;return a+(c-a)*i}function is(t){const e={[Rt.SHARES]:0,[Rt.BONDS]:0,[Rt.DIVERSIFIERS]:0,[Rt.CASH]:0},n={},r=[],s=[];let i=0,o=0;const l=[];for(const a of t){const c=a.mix?{mix:a.mix}:a.ticker&&!a.subClass?Yl.find(u=>u.ticker===String(a.ticker).toUpperCase().trim()):null;if(c&&c.mix&&typeof c.mix=="object"){const u=Object.values(c.mix).reduce((d,h)=>d+(+h||0),0)||1;for(const[d,h]of Object.entries(c.mix))+h>0&&l.push({...a,subClass:d,value:(+a.value||0)*(+h/u),mixOf:a.ticker||null})}else l.push(a)}for(const a of l){const c=+a.value||0,u=a.subClass||(a.ticker?$l[a.ticker]:void 0),d=u?an[u]:null;if(!d){s.push({...a});continue}if(i+=c,r.push({...a,subClass:u,bucket:d.bucket,label:d.label}),(a.wrapper||"").toUpperCase()==="ISA"){o+=c;continue}e[d.bucket]+=c,n[u]=(n[u]||0)+c}return{buckets:e,subClassTotals:n,bondWeights:Ji(n,Rt.BONDS),diversifierWeights:Ji(n,Rt.DIVERSIFIERS),total:i,isaTotal:o,tagged:r,untagged:s}}function Ji(t,e){const n=Object.entries(t).filter(([i])=>an[i].bucket===e),r=n.reduce((i,[,o])=>i+o,0);if(r<=0)return{};const s={};for(const[i,o]of n)s[i]=o/r;return s}function qa(t){const e=t||{};return(+e.equityMin||0)+(+e.bondMin||0)+(+e.cashTarget||0)+(+e.diversifierStart||0)}function Dp(t){const e=t||{},n=e.potAtRetirement,r={sipp:1,isa:1};if(!n||e.retired!==!1)return r;const s=qa(e),i=+e.isaBalance||0;return+n.sipp>0&&s>0&&(r.sipp=+n.sipp/s),+n.isa>0&&i>0&&(r.isa=+n.isa/i),r}const Op=24*3600*1e3;function Se(t){const e=t instanceof Date?t:new Date(t);return e.getMonth()>3||e.getMonth()===3&&e.getDate()>=6?e.getFullYear():e.getFullYear()-1}function z(t){return t+"/"+String(t+1).slice(2)}function Ws(t){return String(t%100).padStart(2,"0")+"/"+String((t+1)%100).padStart(2,"0")}function Mp(t){const e=parseInt(String(t).split("/")[0],10);return Number.isFinite(e)?e<100?2e3+e:e:NaN}function Np(t,e){let n;if(typeof t=="number")n=t;else if(t instanceof Date)n=Se(t);else if(typeof t=="string"&&t.includes("/"))n=Mp(t);else if(typeof t=="string"){const[r,s]=t.split("-").map(Number);n=s>=4?r:r-1}else return NaN;return n-+e}function Ja(t){const e=/^(\d{4})-(\d{2})-(\d{2})$/.exec(typeof t=="string"?t.trim():"");return e?new Date(+e[1],+e[2]-1,+e[3]):new Date(t)}function Qa(t,e=new Date){const n=t||{},r=n.spStartDate?Sr(n.spStartDate):null;if(r)return{month:r.getMonth(),day:r.getDate(),source:"sp"};if(n.currentAgeAsOf){const s=Ja(n.currentAgeAsOf);if(Number.isFinite(s.getTime()))return{month:s.getMonth(),day:s.getDate(),source:"asOf"}}return{month:e.getMonth(),day:e.getDate(),source:"today"}}function Qi(t,e,n){let r=0;for(let s=t.getFullYear();s<=e.getFullYear();s++){const i=new Date(s,n.month,n.day);i.getTime()>t.getTime()&&i.getTime()<=e.getTime()&&r++}return r}function Dn(t,e,n=new Date){const r=t||{},s=Math.floor(+r.currentAge||0);if(!(s>0))return null;let i=r.currentAgeAsOf?Ja(r.currentAgeAsOf):n;Number.isFinite(i.getTime())||(i=n);const o=Qa(r,n),l=e instanceof Date?e:new Date(e);return l.getTime()>=i.getTime()?s+Qi(i,l,o):s-Qi(l,i,o)}function os(t,e,n=new Date){return Dn(t,new Date(e+1,3,5),n)}function ir(t,e,n=new Date){const r=Se(n),s=os(t,r,n);return s==null?null:r+(Math.round(+e)-s)}function as(t,e=new Date){const n=new Date(+t,3,6);return Math.max(0,Math.round((n.getTime()-e.getTime())/(30.44*Op)))}function Xa(t,e=new Date){const[n,r]=String(t||"").split("-").map(Number);return!Number.isFinite(n)||!Number.isFinite(r)?0:Math.max(0,(n-e.getFullYear())*12+(r-1-e.getMonth()))}function xp(t,e,n=new Date){const r=t||{},s=Dn(r,n,n);if(s==null)return null;const i=Qa(r,n);return(new Date(n.getFullYear(),i.month,i.day).getTime()>n.getTime()?n.getFullYear():n.getFullYear()+1)+(Math.round(+e)-(s+1))+"-"+String(i.month+1).padStart(2,"0")}function Za(t,e=null,n=new Date){const r=t||{};if(typeof r.retired=="boolean"&&+r.firstTaxYear>0||!(+r.currentAge>0))return r;const s=Se(n),i=+r.shapeAgeNow||57,l=ir(r,i,n)>s+1,a=r.retired===!0?!0:r.retired===!1||l?!1:e&&typeof e.retired=="boolean"?e.retired:!0;let c=+r.firstTaxYear>0?+r.firstTaxYear:a?s+1:ir(r,+r.retireAge||i,n);return!(+r.firstTaxYear>0)&&!(c>=s)&&(c=s+1),{...r,firstTaxYear:c,retired:a,retireAge:a?null:+r.retireAge||i}}function Cp(t){return t.getFullYear()+"-"+String(t.getMonth()+1).padStart(2,"0")+"-"+String(t.getDate()).padStart(2,"0")}const Lp=["firstTaxYear","retired","retireAge","currentAgeAsOf","legacyFirstTaxYear"];function Vp(t,e=null,n=new Date){const r=Za(t,e,n);return+r.currentAge>0?r.currentAgeAsOf?r:{...r,currentAgeAsOf:Cp(n)}:+r.firstTaxYear>0||+r.legacyFirstTaxYear>0?r:{...r,legacyFirstTaxYear:n.getFullYear()+1}}function el(t,e=new Date){const n=Za(t||{},null,e),r=Se(e),s={currentAge:null,retireAge:null,potScale:{sipp:1,isa:1},startOptions:[r,r+1]};if(!(+n.currentAge>0)){const a=+n.firstTaxYear>0?+n.firstTaxYear:+n.legacyFirstTaxYear>0?+n.legacyFirstTaxYear:e.getFullYear()+1;return{...s,mode:"legacy",firstTaxYear:a,shapeAgeNow:+n.shapeAgeNow||57,yearsToStart:Math.max(0,a-r),startMonth:a+"-04",bridgeMonths:as(a,e)}}const i=Dn(n,e,e);if(n.retired===!1&&+n.retireAge>0){let a=ir(n,+n.retireAge,e);a>=r||(a=r);const c=os(n,a,e),u=xp(n,+n.retireAge,e);return{...s,mode:"future",firstTaxYear:a,shapeAgeNow:c,currentAge:i,retireAge:+n.retireAge,yearsToStart:a-r,startMonth:u,bridgeMonths:Xa(u,e),potScale:Dp(n)}}const o=+n.firstTaxYear>0?+n.firstTaxYear:r+1,l=o+"-04";return{...s,mode:"retired",firstTaxYear:o,shapeAgeNow:os(n,o,e),currentAge:i,yearsToStart:Math.max(0,o-r),startMonth:l,bridgeMonths:as(o,e)}}function Bp(t,{locked:e=!1,hasRecords:n=!1,now:r=new Date}={}){if(e||n)return null;const s=t||{},i=Se(r),o=+s.currentAge>0;let l=0,a="retired";return o&&s.retired===!1&&+s.retireAge>0?(a="future",l=ir(s,+s.retireAge,r)||0):+s.firstTaxYear>0?(l=+s.firstTaxYear,o||(a="legacy")):!o&&+s.legacyFirstTaxYear>0&&(a="legacy",l=+s.legacyFirstTaxYear),!(l>0)||l>=i||+s.staleDraftDismissedFor===l?null:{savedYear:l,savedLabel:z(l),suggestedYear:i,suggestedLabel:z(i),mode:a}}const Fp=Object.freeze({stress:Object.freeze([...Lp,"staleDraftDismissedFor"]),decision:Object.freeze([])}),Up=Object.freeze(["locked","unlockedAt","unlockCount"]),Gp=Object.freeze(["targetSchedule","spendingProfile","spendingMigratedFrom"]),gt=t=>!!t&&typeof t=="object"&&!Array.isArray(t);function Ht(t){return!!(gt(t)&&t.locked)}function ls(t){return Array.isArray(t)?t.map(ls):gt(t)?Object.keys(t).sort().reduce((e,n)=>(t[n]!==void 0&&(e[n]=ls(t[n])),e),{}):t}const zt=t=>t===void 0?"<absent>":JSON.stringify(ls(t));function Yp(t,e){const n=gt(t)?t:{},r=gt(e)?e:{};return[...new Set([...Object.keys(n),...Object.keys(r)])].filter(i=>zt(n[i])!==zt(r[i])).sort()}function $p(t,e){if(!gt(t)||!gt(e)||t.spendingProfile!=="declining"||e.spendingProfile!=="flat"||e.spendingMigratedFrom!=="declining")return!1;const n=t.targetSchedule,r=Array.isArray(n)&&n.length?n.map((s,i)=>Math.round((+s||0)*jl(i,"declining"))):n;return zt(r)===zt(e.targetSchedule)}function jp(t,e){return!Ht(t)||!gt(e)||Ht(e)?!1:!!e.unlockedAt&&(+e.unlockCount||0)>(+t.unlockCount||0)}function Kp(t,e,n){const r=new Set(Fp[t]||[]);return t==="decision"&&jp(e,n)&&Up.forEach(s=>r.add(s)),t==="decision"&&$p(e,n)&&Gp.forEach(s=>r.add(s)),r}function Xi(t,{locked:e,stored:n,next:r}){const s=Kp(t,n,r),i=Yp(n,r).filter(o=>!s.has(o));return i.length?i:null}const Wp=["stressTool","decisionTool","strategy"],Hp=/^(?:stressTool|decisionTool|strategy)$|^(?:stressTool|decisionTool)\.settings(?:\.|$)|^strategy\./;function zp(t){return!!t&&typeof t=="object"&&Object.keys(t).some(e=>Hp.test(e))}function qp(t,e){var r,s;const n=JSON.parse(JSON.stringify({stressTool:t==null?void 0:t.stressTool,decisionTool:t==null?void 0:t.decisionTool,strategy:t==null?void 0:t.strategy}));for(const[i,o]of Object.entries(e||{})){const l=i.split(".");if(!Wp.includes(l[0]))continue;let a=n;for(let c=0;c<l.length-1;c++)gt(a[l[c]])||(a[l[c]]={}),a=a[l[c]];a[l[l.length-1]]=o}return{stress:(r=n.stressTool)==null?void 0:r.settings,decision:(s=n.decisionTool)==null?void 0:s.settings,strategy:n.strategy}}function Jp(t,e,n){var l,a;const r={stress:(l=t==null?void 0:t.stressTool)==null?void 0:l.settings,decision:(a=t==null?void 0:t.decisionTool)==null?void 0:a.settings,strategy:t==null?void 0:t.strategy};if(!Ht(r.decision)||!zp(e))return null;const s=qp(t,e),i=c=>c===void 0?n:c,o=[...(Xi("stress",{locked:!0,stored:i(r.stress),next:i(s.stress)})||[]).map(c=>"stress."+c),...(Xi("decision",{locked:!0,stored:r.decision,next:s.decision})||[]).map(c=>"decision."+c),...zt(r.strategy)!==zt(s.strategy)?["strategy"]:[]];return o.length?o:null}const Zi=.025,kt=3;function ke(t){if(t instanceof Date)return Number.isFinite(t.getTime())?{y:t.getFullYear(),m:t.getMonth()+1}:null;if(t&&typeof t=="object")return Number.isInteger(t.y)&&t.m>=1&&t.m<=12?{y:t.y,m:t.m}:null;const e=/^(\d{4})-(\d{2})/.exec(String(t??""));return e&&+e[2]>=1&&+e[2]<=12?{y:+e[1],m:+e[2]}:null}const cs=(t,e)=>e.y*12+e.m-(t.y*12+t.m),bt=t=>t?t.y+"-"+String(t.m).padStart(2,"0"):null,He=t=>typeof t=="number"&&Number.isFinite(t);function tl(t){const e=t&&t.accumulation;return!e||typeof e!="object"?null:e.version===kt?kt:2}function nl(t){const e=t||{},n=e.accumulation||{};return n.version===kt&&ke(n.asOf)?{at:ke(n.asOf),from:"asOf"}:ke(e.createdAt)?{at:ke(e.createdAt),from:"createdAt"}:ke(e.lockedAt)?{at:ke(e.lockedAt),from:"lockedAt"}:{at:null,from:null}}function Qp(t,e){const n=nl(t).at,r=ke(e);if(tl(t)===kt||!n||!r)return{factor:1,cpi:null,months:n&&r?cs(n,r):0,start:n};const s=cs(n,r);return{factor:Math.pow(1+Zi,s/12),cpi:Zi,months:s,start:n}}function Xp(t){const e=t&&t.accumulation;return!!(e&&e.version===kt&&((+e.isaNow||0)>0||(+e.isaMonthly||0)>0))}function Zp(t,e){const n=t.length,r=Math.max(0,Math.min(n-1,e/12)),s=Math.floor(r),i=r-s,o=t[s],l=t[Math.min(n-1,s+1)],a=c=>{const u=+o.nominal[c],d=+l.nominal[c];return u+(d-u)*i};return{low:a("careful"),expected:a("middling"),high:a("good")}}function em(t,{at:e,pension:n=null,isa:r=null}={}){const s=t&&t.accumulation;if(!s)return null;const i=tl(t),o=Array.isArray(s.path)?s.path:[],l=nl(t).at,a=ke(e),c=l&&a?Math.max(0,cs(l,a)):0,u=Xp(t),d={version:i,start:bt(l),at:bt(a),months:c,pathMissing:!o.length,isaCounted:u,actual:null,pension:He(n)?Math.round(n):null,isa:He(r)?Math.round(r):null,compared:null,prices:null,expected:null,low:null,high:null,band:null,missing:[]};if(!o.length)return d;let h;if(i===kt)h=Zp(o,c);else{const T=o[0].potMix!=null?"potMix":"potMid";h={expected:Br(o,c/12,T),low:Br(o,c/12,"potLow"),high:Br(o,c/12,"potHigh")}}if(d.expected=Math.round(h.expected),d.low=Math.round(h.low),d.high=Math.round(h.high),!He(n))return d.missing.push("pension"),d;if(u&&!He(r))return d.missing.push("isa"),d;const y=n+(u?r:0),m=Qp(t,a||l),p=y/m.factor;return d.actual=Math.round(y),d.compared=Math.round(p),d.prices={factor:m.factor,cpi:m.cpi,start:bt(m.start)},i===kt?d.band=Math.abs(h.high-h.low)<1?"start":p<h.low?"below p10":p<h.expected?"p10–p50":p<=h.high?"p50–p90":"above p90":d.band=p<h.low?"below the cautious line":p<h.expected?"below the locked path":p<=h.high?"on or above the locked path":"above the strong line",d}function tm(t){if(!t||t.isa==null||!He(+t.isa))return null;const e=+t.isa;return e===0&&t.isaEntered!==!0?null:e}function rl({accHistory:t=[],potsToday:e=null,holdingsPension:n=0,holdingsIsa:r=null,holdingsAsOf:s=null,today:i=new Date}={}){const o=(t||[]).filter(l=>l&&ke(l.date)).slice().sort((l,a)=>String(l.date).localeCompare(String(a.date))).pop()||null;if(o){const l=He(+o.sipp)&&o.sipp!=null?+o.sipp:He(+o.total)?+o.total:null;return{source:"record",at:bt(ke(o.date)),recordedAt:o.date,pension:l,isa:tm(o)}}return e!=null&&He(+e)?{source:"today",at:bt(ke(i)),recordedAt:null,pension:+e,isa:null}:n>0?{source:"holdings",at:bt(ke(s)||ke(i)),recordedAt:s||null,pension:n,isa:He(r)?r:null}:{source:null,at:bt(ke(i)),recordedAt:null,pension:null,isa:null}}const nm=5,rm=Object.freeze({saving:{key:"saving",label:"Saving",chip:"saving",leads:["budget","accumulation"],readOnly:[],hidden:[],banner:{text:"You are saving. Set the income you will want (Budget), then check you are on course for it (Accumulation planner). The Stress tester can price the plan on the pots you will have at retirement.",btn:"Open the Accumulation planner",tab:"accumulation"}},approaching:{key:"approaching",label:"Approaching retirement",chip:"approaching",leads:["stress","strategies","accumulation"],readOnly:[],hidden:[],banner:{text:"Within five years of your plan start. Pick the strategy you will retire on and stress-test it — then lock the plan and start moving your holdings into it.",btn:"Open the Stress tester",tab:"stress"}},"committed-saving":{key:"committed-saving",label:"Committed, still saving",chip:"to go",leads:["accumulation"],readOnly:["stress","strategies"],hidden:[],banner:{text:"Your plan is locked and starts in {start}. Keep saving and buying the target portfolio; the Decision tool opens when the plan starts.",btn:"Open the plan document",tab:"decision",sub:"plandoc"}},bridge:{key:"bridge",label:"Retired — run-up to the plan's first tax year",chip:"run-up",leads:["decision"],readOnly:["stress","strategies"],hidden:["accumulation"],banner:{text:"Retired, drawing from your SIPP cash until the plan's first tax year, {start}. Record each month in the Decision tool; the ladder's rungs and the plan's tracks begin in {start}.",btn:"Open the Decision tool",tab:"decision"}},running:{key:"running",label:"Running the plan",chip:"running",leads:["decision"],readOnly:["stress","strategies"],hidden:["accumulation"],banner:null},"draft-retired":{key:"draft-retired",label:"Retired, designing the plan",chip:"retired",leads:["stress","strategies"],readOnly:[],hidden:["accumulation"],banner:{text:"You are retired and the plan is still a draft. Stress-test it, then lock it from the Stress tester's Settings page to write the plan document and start recording months.",btn:"Open the Stress tester",tab:"stress"}},unknown:{key:"unknown",label:"Getting started",chip:"",leads:["budget"],readOnly:[],hidden:[],banner:null}});function sm(t,e=new Date){var b,v,D,A;const n=t||{},r=((b=n.stressTool)==null?void 0:b.settings)||{},i=!!(((v=n.decisionTool)==null?void 0:v.settings)||{}).locked,o=Array.isArray((D=n.decisionTool)==null?void 0:D.history)?n.decisionTool.history:[],l=((A=n.decisionTool)==null?void 0:A.taxYears)||{},a=o.length>0||Object.values(l).some(P=>P&&P.yearSetupComplete),c=!!n.planDocument,u=el(r,e),d=Se(e),h=e.getFullYear()+"-"+String(e.getMonth()+1).padStart(2,"0"),y=u.mode==="future"&&u.startMonth?h<u.startMonth:u.firstTaxYear>d,m=u.mode==="future"&&u.startMonth?Xa(u.startMonth,e):as(u.firstTaxYear,e),p=[];let T;u.mode==="legacy"?(T=i?"running":"unknown",p.push("no age today in the Timing block")):u.mode==="future"?(i?T=y?"committed-saving":"running":T=u.yearsToStart>nm?"saving":"approaching",p.push("retiring at "+u.retireAge+" ("+z(u.firstTaxYear)+")")):(i?T=y?"bridge":"running":T="draft-retired",p.push("already retired; plan starts "+z(u.firstTaxYear))),i&&p.push("plan locked"+(c?" with a plan document":""));const k=rm[T],I=k.leads.slice(),g=k.hidden.slice();["approaching","committed-saving","bridge","draft-retired"].includes(T)&&I.push("transition");const f=z(u.firstTaxYear),_=k.banner?{...k.banner,text:k.banner.text.replace(/\{start\}/g,f)}:null;return{key:T,label:k.label,chip:im(k,m,y),leads:I,readOnly:k.readOnly.slice(),hidden:g,banner:_,locked:i,retired:u.mode==="retired",timingMode:u.mode,firstTaxYear:u.firstTaxYear,startLabel:f,startMonth:u.startMonth||null,yearsToStart:u.yearsToStart,monthsToStart:m,beforeStart:y,hasRecords:a,hasDocument:c,reasons:p}}function im(t,e,n){return t.key==="committed-saving"||t.key==="bridge"?!n||e<=0?t.chip:e>=24?Math.round(e/12)+" years to go":e+" month"+(e===1?"":"s")+" to go":t.chip}const om=.025,Ve=t=>Number.isFinite(+t)?+t:0;function am(t){const e=Zt(t).filter(g=>g&&(Ve(g.value)>0||Ve(g.contribution)>0)),n=is(e.map(g=>({...g,value:Ve(g.value)}))),r={SIPP:0,ISA:0,GIA:0,CASH:0},s={shares:0,bonds:0,diversifiers:0,cash:0},i={};let o=0,l=0,a=0;for(const g of n.tagged){const f=Ve(g.value);if(!(f>0))continue;o+=f;const _=(g.wrapper||"SIPP").toUpperCase();r[_ in r?_:"SIPP"]+=f,s[g.bucket]=(s[g.bucket]||0)+f,i[g.subClass]=(i[g.subClass]||0)+f,l+=f*(Ve(g.ocf)/100);const b=an[g.subClass];a+=f*(b?Ve(b.nominalReturn):0)}const c={};for(const g of Object.keys(s))c[g]=o>0?s[g]/o:0;const u=Object.entries(i).map(([g,f])=>{var _,b;return{key:g,label:((_=an[g])==null?void 0:_.label)||g,bucket:((b=an[g])==null?void 0:b.bucket)||"shares",value:f,weight:o>0?f/o:0}}).sort((g,f)=>f.value-g.value),d=o>0?l/o:0,h=o>0?a/o:0,y=e.filter(g=>Ve(g.contribution)>0),m=is(y.map(g=>({...g,value:Ve(g.contribution)}))),p={shares:0,bonds:0,diversifiers:0,cash:0};let T=0;const k={SIPP:0,ISA:0,GIA:0,CASH:0};for(const g of m.tagged){const f=Ve(g.value);T+=f,p[g.bucket]=(p[g.bucket]||0)+f;const _=(g.wrapper||"SIPP").toUpperCase();k[_ in k?_:"SIPP"]+=f}const I={};for(const g of Object.keys(p))I[g]=T>0?p[g]/T:0;return{total:o,byWrapper:r,buckets:c,bucketValues:s,subClasses:u,weightedOcf:d,expectedNominal:h,expectedReal:h-om-d,contributions:{monthly:T,byBucket:I,byWrapper:k},untagged:n.untagged.map(g=>({ticker:g.ticker||"",name:g.name||"",value:Ve(g.value)}))}}function lm(t){return Zt(t).reduce((e,n)=>e+(n&&(n.wrapper||"SIPP").toUpperCase()==="SIPP"?Ve(n.value):0),0)}const cm=["full-il-gilt","gilt-rotation","floor-the-schedule"],um=.04,dm=["pots-and-valves","buckets-in-order"],hm=["full-il-gilt","gilt-rotation"];function eo(t,{planYear:e=0}={}){var h,y;const n=t||{},r=((h=n.strategy)==null?void 0:h.id)||"pots-and-valves",s=dm.includes(r),i=n.pots||{},o=i.isaPolicy==="hold",l=s||!o,a=(Array.isArray(n.timeline)?n.timeline:[]).filter(m=>m&&+m.y<=e).flatMap(m=>Array.isArray(m.lumpIn)?m.lumpIn:[]);let c=!1,u=!1;for(const m of a){const p=String(m.wrapper||"cash").toLowerCase(),T=+m.amount||0;p==="pension"||p==="sipp"||!(T>0)||(p==="isa"?c=!0:p==="gia"||o?u=!0:(c=!0,T>Kl.ISA_ALLOWANCE&&(u=!0)))}const d=(+i.isa||0)>0;return{strategyId:r,potsStrategy:s,isa:l&&(d||c),gia:(+i.gia||0)>0||u,diversifiers:s&&(+((y=i.allocation)==null?void 0:y.diversifierStart)||0)>0,isaLeftOut:!l&&d}}function Me(t){if(t instanceof Date)return Number.isFinite(t.getTime())?{y:t.getFullYear(),m:t.getMonth()+1}:null;if(t&&typeof t=="object")return Number.isInteger(t.y)&&t.m>=1&&t.m<=12?{y:t.y,m:t.m}:null;const e=/^(\d{4})-(\d{2})/.exec(String(t??""));return e?{y:+e[1],m:+e[2]}:null}const Hs=(t,e)=>e.y*12+e.m-(t.y*12+t.m),zs=(t,e)=>(t.m>=4?t.y:t.y-1)-e,sl=t=>(t.m+8)%12;function fm(t,e,n=null){var u,d;const r=+((u=t==null?void 0:t.assumptions)==null?void 0:u.cpiDecision)>0?+t.assumptions.cpiDecision:um,s=+((d=t==null?void 0:t.timing)==null?void 0:d.firstTaxYear),i=Me(e),o={factor:1,assumed:r,years:[]};if(!i||!Number.isFinite(s))return o;const l=zs(i,s),a=sl(i)/12,c=n&&typeof n=="object"?n:{};for(let h=0;h<=l;h++){const y=h<l?1:a;if(!(y>0))break;const m=Ws(s+h),p=+(c[m]&&c[m].cpi)||0,T=p||r;o.factor*=Math.pow(1+T,y),o.years.push({taxYear:m,cpi:T,entered:!!p,share:y})}return o}function pm(t){const e=(t||[]).filter(s=>s&&Me(s.date)).slice().sort((s,i)=>String(s.date).localeCompare(String(i.date)));if(!e.length)return null;const n=(s,i)=>["equity","bond","cash"].every(o=>Math.abs((+s[o]||0)-(+i[o]||0))<.5);let r=e.length-1;for(;r>0&&n(e[r-1],e[r])&&Hs(Me(e[r-1].date),Me(e[r].date))===1;)r--;return{rec:e[r],idx:r,recs:e}}function fn(t,e){const n=Zt(t).filter(s=>s&&Ar(s.wrapper)===e&&Ne(s.value)!=null);if(!n.length)return null;const r=t&&!Array.isArray(t)&&t.updatedAt||n.map(s=>s.asOf).filter(Boolean).sort().pop()||null;return{value:n.reduce((s,i)=>s+Ne(i.value),0),asOf:r?String(r).slice(0,10):null}}function mm(t){const e=fn(t,"SIPP");if(!e)return null;const n=Zt(t).filter(r=>r&&Ar(r.wrapper)==="SIPP"&&Ne(r.value)!=null).map(r=>({...r,value:Ne(r.value)}));return{value:am(n).bucketValues.diversifiers||0,asOf:e.asOf}}function gm(t,{today:e,history:n,potsToday:r,holdings:s}){const i=f=>eo(t,{planYear:zs(f,+t.timing.firstTaxYear)});if(r!=null){const f=e.toISOString().slice(0,10),_=Me(e);return{source:"today",asOf:f,at:_,pension:Math.round(+r),parts:[{key:"all",value:+r,source:"today",asOf:f}],missing:[],measure:i(_),runUpMonthly:0}}const o=pm(n),l=fn(s,"SIPP"),a=eo(t).diversifiers,c=[],u=[];let d=null,h=null,y=null,m=null;const p=l&&l.value>0?Me(l.asOf):null,T=a&&l&&l.value>0&&(!o||p!=null&&Hs(Me(o.rec.date),p)>=0);if(o&&!T){if(d="record",m=o.rec,y=String(m.date).slice(0,7),h=(+m.equity||0)+(+m.bond||0)+(+m.cash||0),a){const f=mm(s);f?f.value>0&&u.push({key:"diversifiers",value:f.value,source:"holdings",asOf:f.asOf}):c.push("diversifiers")}}else l&&l.value>0&&(d="holdings",h=l.value,y=l.asOf);const k=Me(y)||Me(e),I=i(k);if(d==null)return{source:null,asOf:null,at:k,pension:null,parts:[],missing:["pension"],measure:I,runUpMonthly:0};const g=[{key:"pension",value:h,source:d,asOf:y},...u];if(I.isa){const f=fn(s,"ISA");f?g.push({key:"isa",value:f.value,source:"holdings",asOf:f.asOf}):c.push("isa")}if(I.gia){let f=null;if(m&&Ne(m.gia)!=null)f={value:+m.gia,source:"record",asOf:y};else if(m){const _=o.recs.slice(0,o.idx).reverse().find(b=>Ne(b.gia)!=null);_&&Ne(_.giaBalanceAfter)!=null&&+_.giaBalanceAfter<=1&&(f={value:0,source:"record",asOf:y})}if(!f){const _=fn(s,"GIA");_&&(f={value:_.value,source:"holdings",asOf:_.asOf})}f?g.push({key:"gia",...f}):c.push("gia")}return{source:d,asOf:y,at:k,pension:Math.round(h),parts:g,missing:c,measure:I,runUpMonthly:m&&+m.sipp||0}}function ym(t,e,n=0){const r=(h,y)=>Array.isArray(h)&&y<h.length&&Number.isFinite(+h[y])?+h[y]:null,s=Array.isArray(t==null?void 0:t.p50)?t.p50.length:0;if(!s)return{p10:null,p50:null,p90:null};const i=Math.min(Math.max(0,e),s-1),o=r(t.p50,i),l=r(t.p50,i+1);if(o==null)return{p10:null,p50:null,p90:null};const a=n>0&&l!=null,c=a?o+n*(l-o):o,u=a?(Math.sqrt(i+n)-Math.sqrt(i))/(Math.sqrt(i+1)-Math.sqrt(i)):0,d=h=>{const y=r(h,i);if(y==null)return null;const m=r(h,i+1);if(!a||m==null)return y+(c-o);const p=y-o,T=m-l;return c+p+u*(T-p)};return{p10:d(t.p10),p50:c,p90:d(t.p90)}}function _m(t,e,{today:n,history:r,potsToday:s,holdings:i,taxYears:o}){var C,j,S;const l=+t.timing.firstTaxYear,a=gm(t,{today:n,history:r,potsToday:s,holdings:i}),c=zs(a.at,l);if(t.timing.mode==="future"&&c<0)return null;const u=Math.max(0,c),d=c>=0?sl(a.at)/12:0;let{p10:h,p50:y,p90:m}=ym(e,u,d);const p=y;let T=null;const k=Math.max(0,+((C=t.assumptions)==null?void 0:C.bridgeCash)||0);if(c<0&&k>0){const E=Math.max(0,l*12+4-(a.at.y*12+a.at.m)),x=Math.round(+((j=t.timing)==null?void 0:j.bridgeMonths)||+((S=t.assumptions)==null?void 0:S.bridgeMonths)||0);let F,le;if(x>0)F=k*Math.min(1,E/x),le=k/x;else{const se=Array.isArray(t.timeline)?t.timeline[0]:null;le=a.runUpMonthly>0?a.runUpMonthly:se?Math.max(0,((+se.gross||0)-(+se.sp||0)-(+se.other||0))/12):0,F=Math.min(k,le*E)}F>0&&(T={months:E,of:x>0?x:null,monthly:Math.round(le),value:Math.round(F)},[h,y,m]=[h,y,m].map(se=>se==null?null:se+F))}const I=a.missing.length?null:a.parts.reduce((E,x)=>E+x.value,0),g=fm(t,a.at,o),f=I==null?null:I/g.factor,_=Array.isArray(e.p10)&&Array.isArray(e.p90)&&e.p10.length>1&&e.p10.every((E,x)=>Math.abs((e.p90[x]??E)-E)<1),b=hm.includes(a.measure.strategyId)||_;let v=null,D=null;f!=null&&y!=null&&(b?v="gilts-at-cost":h==null||m==null||Math.abs(y-h)<1?v=(h==null||m==null||Math.abs(m-h)<1)&&(c<0||c===0&&d===0)?"start":"not-open":(v="band",D=f<h?"below p10":f<y?"p10–p50":f<=m?"p50–p90":"above p90"));const A=Me(n),P=a.parts.filter(E=>E.source!=="today"&&Me(E.asOf)&&A&&Hs(Me(E.asOf),A)>3).map(E=>({key:E.key,source:E.source,asOf:E.asOf})),w=E=>E==null?null:Math.round(E);return{actual:w(I),real:w(f),pension:a.pension,parts:a.parts.map(E=>({...E,value:Math.round(E.value)})),missing:a.missing,source:a.source,asOf:a.asOf,planYear:c,monthsIn:Math.round(d*12),prices:{factor:g.factor,assumed:g.assumed,years:g.years.length,entered:g.years.filter(E=>E.entered).length},p10:w(h),p50:w(y),p90:w(m),startP50:T?w(p):null,runUp:T,verdict:v,band:D,flat:_,isaLeftOut:a.measure.isaLeftOut,stale:P}}function Tm(t,{today:e=new Date,history:n=[],potsToday:r=null,ladderPos:s=null,accHistory:i=[],holdings:o=null,taxYears:l=null}={}){var C,j,S,E,x,F,le,se,fe;if(!t||!t.timing)return null;const a=lm(Zt(o)),c=o&&!Array.isArray(o)&&o.updatedAt?o.updatedAt:null;let u=null;if(t.accumulation&&t.timing.mode==="future"){const K=fn(o,"ISA"),ee=rl({accHistory:i,potsToday:r,holdingsPension:a,holdingsIsa:K?K.value:null,holdingsAsOf:c,today:e}),ie=em(t,{at:ee.at,pension:ee.pension,isa:ee.isa}),Ze=new Date(+t.timing.firstTaxYear,3,6);u={monthsToGo:Math.max(0,Math.round((Ze.getTime()-e.getTime())/(30.44*24*3600*1e3))),pathMissing:ie.pathMissing,version:ie.version,expected:ie.expected,low:ie.low,high:ie.high,actual:ie.pathMissing||ie.actual==null?ee.pension==null?null:Math.round(ee.pension):ie.actual,compared:ie.compared,pension:ie.pension,isa:ie.isa,isaCounted:ie.isaCounted,missing:ie.missing,prices:ie.prices,at:ie.at,start:ie.start,actualSource:ee.source,recordedAt:ee.source==="record"?ee.recordedAt:ee.source==="holdings"?c:null,band:ie.band,contributions:t.accumulation.totalMonthly||0,isaMonthly:t.accumulation.isaMonthly||0}}const d=+t.timing.firstTaxYear,h=Np(e,d),y=h<0,m=Math.max(0,h),p=((C=t.timeline)==null?void 0:C.length)||((j=t.assumptions)==null?void 0:j.duration)||35,T=t.timing.shapeAgeNow+h,k=z(Se(e)),I=(t.steps||[]).slice().sort((K,ee)=>K.fromAge-ee.fromAge),g=I.filter(K=>{var ee;return K.fromAge<=Math.max(T,((ee=I[0])==null?void 0:ee.fromAge)??T)}).pop()||I[0]||null,f=I.find(K=>K.fromAge>(g?g.fromAge:T))||null,_=g?Math.round(wl(I.map(K=>({fromAge:K.fromAge,amount:K.amount,decline:K.decline,glideToNext:K.glideToNext})),Math.max(T,g.fromAge),g.amount)):null,b=((S=t.timeline)==null?void 0:S[m])||null,v=String(Se(e)%100).padStart(2,"0")+"/"+String((Se(e)+1)%100).padStart(2,"0"),D=(n||[]).filter(K=>K&&K.taxYear===v),A=D.reduce((K,ee)=>K+(+ee.sipp||0)+(+ee.other||0)+(+ee.state||0),0),P=((F=(x=(E=t.strategy)==null?void 0:E.r)==null?void 0:x.cones)==null?void 0:F.wealth)||null,w=P?_m(t,P,{today:e,history:n,potsToday:r,holdings:o,taxYears:l}):null;return{today:e.toISOString().slice(0,10),planYear:h,planYears:p,bridge:y,taxYear:k,age:T,planStart:z(d),step:g?{amount:_,from:g.fromAge,taxYear:g.taxYear,index:I.indexOf(g)+1,of:I.length,next:f?{fromAge:f.fromAge,amount:f.amount,taxYear:f.taxYear,yearsAway:f.fromAge-T}:null}:null,incomeThisYear:{recorded:D.length,drawn:Math.round(A),planned:b?b.gross:null,perMonth:b?Math.round(b.gross/12):null},pot:w,ladder:s?{phase:s.phase,instruction:s.instruction,monthly:s.monthly,source:s.source,verdict:((le=s.cashCheck)==null?void 0:le.verdict)||null}:null,contract:!!((se=t.strategy)!=null&&se.contract),strategyId:((fe=t.strategy)==null?void 0:fe.id)||"pots-and-valves",saving:u}}function bm(t){const e=t.getMonth(),n=t.getDate();return e>3||e===3&&n>=6?t.getFullYear():t.getFullYear()-1}function vm(t,e){const n=new Date(t+1,3,6);if(e>=n)return 0;const r=new Date(t,3,6),s=e<r?r:e;return Math.max(1,Math.min(12,Math.round((n-s)/(30.44*24*3600*1e3))))}function Am(t,e={}){if(!t||!Array.isArray(t.years)||!t.years.length)return null;const n=e.today||new Date,r=bm(n),s=t.years,i=s[0].Y,o=s[s.length-1].Y,l=s.find(w=>w.Y===r)||null,a=r<i?"before":r>o?"after":"running",c=l?l.need:0,u=l?l.gross:0,d=Math.max(0,u-c),h=vm(r,n),y=e.drawnThisYear||0,m=Math.max(0,c-y),p=h>0?m/h:0,T=[];for(const w of s){if(w.Y<=r)continue;(w.from==="cash"?!0:w.matures?new Date(w.matures)<=n:!1)&&T.push({Y:w.Y,age:w.age,amount:w.need,from:w.from,until:new Date(w.Y,3,6)})}const k=T.reduce((w,C)=>w+C.amount,0),I=(t.orders||[]).filter(w=>new Date(w.matures)>n).sort((w,C)=>w.matures.localeCompare(C.matures)),g=I.length?I[0]:null,f=g?{tidm:g.tidm,name:g.name,matures:g.matures,nominal:g.nominal,pays:g.pays,taxYears:g.taxYears||[],monthsAway:Math.round((new Date(g.matures)-n)/(30.44*24*3600*1e3)),sitsMonths:g.taxYears&&g.taxYears.length?Math.max(0,Math.round((new Date(g.taxYears[0],3,6)-new Date(g.matures))/(30.44*24*3600*1e3))):0}:null,_=m,b=_+k,v=e.cashBalance==null?null:e.cashBalance,D=v==null?null:{balance:v,shouldBeLiquid:_,parkedTotal:k,expectedTotal:b,diff:v-b,verdict:Math.abs(v-b)<Math.max(500,b*.02)?"as expected":v>b?"more cash than the plan needs — park the surplus":"less cash than the plan needs — check the last maturity landed"},A=s[0],P=a==="before"?{Y:A.Y,label:`${A.Y}/${String(A.Y+1).slice(2)}`,age:A.age,gross:A.gross,fromLadder:A.need,statePension:Math.max(0,A.gross-A.need),monthly:A.need/12,source:A.from,startsOn:new Date(A.Y,3,6),cashBucket:t.cash||0,cashYears:s.filter(w=>w.from==="cash").length}:null;return{taxYear:r,taxYearLabel:`${r}/${String(r+1).slice(2)}`,phase:a,upcoming:P,age:l?l.age:null,gross:u,statePension:d,fromLadder:c,source:l?l.from:null,sourceHeld:l?!!l.held:!1,monthsLeft:h,drawnThisYear:y,remaining:m,monthly:p,parked:T,parkedTotal:k,next:f,cashCheck:D,yearsLeft:Math.max(0,o-r),instruction:l?`Instruct the broker to pay ${Sm(p)} a month for the ${h} month${h===1?"":"s"} to 5 April ${r+1}.`:a==="before"?`The ladder starts in ${i}/${String(i+1).slice(2)}.`:"The ladder has paid its last year."}}function Sm(t){return"£"+Math.round(t).toLocaleString("en-GB")}function to(t,e=null){const n=t&&t.strategy&&t.strategy.r?t.strategy.r.plan:null;return!n||!Array.isArray(n.years)||!n.years.length||!Array.isArray(n.orders)||e&&t.strategy.id&&t.strategy.id!==e?null:n}const Vn={gilts:[{name:"0 3/8% Treasury Gilt 2026",isin:"GB00BNNGP668",type:"conventional",coupon:.375,maturity:"2026-10-22",dmoDate:"2026-10-16",tidm:"T26A",cleanPrice:99.96,yield:null,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 1/8% Treasury Gilt 2027",isin:"GB00BL6C7720",type:"conventional",coupon:4.125,maturity:"2027-01-29",dmoDate:"2026-10-16",tidm:"T27A",cleanPrice:99.99,yield:.04185,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"3¾% Treasury Gilt 2027",isin:"GB00BPSNB460",type:"conventional",coupon:3.75,maturity:"2027-03-07",dmoDate:"2026-10-16",tidm:"TS27",cleanPrice:99.82,yield:.04257,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1¼% Treasury Gilt 2027",isin:"GB00BDRHNP05",type:"conventional",coupon:1.25,maturity:"2027-07-22",dmoDate:"2026-10-16",tidm:"TG27",cleanPrice:97.72,yield:.04361,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1¼% Index-linked Treasury Gilt 2027",isin:"GB00B128DH60",type:"il3",coupon:1.25,maturity:"2027-11-22",dmoDate:"2026-10-16",tidm:"T27",cleanPrice:101.77,yield:-.00353,yieldKind:"real",baseRpi:194.06667,indexRatio:2.16663},{name:"4¼% Treasury Gilt 2027",isin:"GB00B16NNR78",type:"conventional",coupon:4.25,maturity:"2027-12-07",dmoDate:"2026-10-16",tidm:"TR27",cleanPrice:99.69,yield:.04579,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Treasury Gilt 2028",isin:"GB00BMBL1G81",type:"conventional",coupon:.125,maturity:"2028-01-31",dmoDate:"2026-10-16",tidm:"TN28",cleanPrice:94.88,yield:.04283,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 3/8% Treasury Gilt 2028",isin:"GB00BSQNRC93",type:"conventional",coupon:4.375,maturity:"2028-03-07",dmoDate:"2026-10-16",tidm:"TE28",cleanPrice:99.58,yield:.04742,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4½% Treasury Gilt 2028",isin:"GB00BMF9LG83",type:"conventional",coupon:4.5,maturity:"2028-06-07",dmoDate:"2026-10-16",tidm:"TS28",cleanPrice:99.63,yield:.04789,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2028",isin:"GB00BZ1NTB69",type:"il3",coupon:.125,maturity:"2028-08-10",dmoDate:"2026-10-16",tidm:"T28",cleanPrice:99.83,yield:.00219,yieldKind:"real",baseRpi:279.23333,indexRatio:1.50581},{name:"1 5/8% Treasury Gilt 2028",isin:"GB00BFX0ZL78",type:"conventional",coupon:1.625,maturity:"2028-10-22",dmoDate:"2026-10-16",tidm:"TG28",cleanPrice:94.17,yield:.04741,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"6% Treasury Stock 2028",isin:"GB0002404191",type:"conventional",coupon:6,maturity:"2028-12-07",dmoDate:"2026-10-16",tidm:"TR28",cleanPrice:102.69,yield:.04718,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0½% Treasury Gilt 2029",isin:"GB00BLPK7227",type:"conventional",coupon:.5,maturity:"2029-01-31",dmoDate:"2026-10-16",tidm:"TG29",cleanPrice:90.98,yield:.04747,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2029",isin:"GB00B3Y1JG82",type:"il3",coupon:.125,maturity:"2029-03-22",dmoDate:"2026-10-16",tidm:"T29",cleanPrice:98.32,yield:.00826,yieldKind:"real",baseRpi:237.42,indexRatio:1.771},{name:"4% Treasury Gilt 2029",isin:"GB00BVP99566",type:"conventional",coupon:4,maturity:"2029-05-22",dmoDate:"2026-10-16",tidm:"T29K",cleanPrice:97.96,yield:.04902,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 1/8% Treasury Gilt 2029",isin:"GB00BQC82B83",type:"conventional",coupon:4.125,maturity:"2029-07-22",dmoDate:"2026-10-16",tidm:"TS29",cleanPrice:98.16,yield:.049,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 7/8% Treasury Gilt 2029",isin:"GB00BJMHB534",type:"conventional",coupon:.875,maturity:"2029-10-22",dmoDate:"2026-10-16",tidm:"TR29",cleanPrice:89.15,yield:.04836,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 3/8% Treasury Gilt 2030",isin:"GB00BSQNRD01",type:"conventional",coupon:4.375,maturity:"2030-03-07",dmoDate:"2026-10-16",tidm:"T30",cleanPrice:98.41,yield:.04948,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 5/8% Treasury Gilt 2030",isin:"GB00BWBR1P52",type:"conventional",coupon:4.625,maturity:"2030-05-22",dmoDate:"2026-10-16",tidm:"T30K",cleanPrice:99.08,yield:.04966,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 1/8% Index-linked Treasury Stock 2030",isin:"GB0008932666",type:"il8",coupon:4.125,maturity:"2030-07-22",dmoDate:"2026-10-16",tidm:"T30I",cleanPrice:342.35,yield:null,yieldKind:"real",baseRpi:135.1,indexRatio:null},{name:"0 3/8% Treasury Gilt 2030",isin:"GB00BL68HH02",type:"conventional",coupon:.375,maturity:"2030-10-22",dmoDate:"2026-10-16",tidm:"TG30",cleanPrice:84.04,yield:.04848,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4¾% Treasury Gilt 2030",isin:"GB00B24FF097",type:"conventional",coupon:4.75,maturity:"2030-12-07",dmoDate:"2026-10-16",tidm:"TR30",cleanPrice:99.7,yield:.04888,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 1/8% Treasury Gilt 2031",isin:"GB00BVP99673",type:"conventional",coupon:4.125,maturity:"2031-03-07",dmoDate:"2026-10-16",tidm:"T31H",cleanPrice:96.86,yield:.04989,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0¼% Treasury Gilt 2031",isin:"GB00BMGR2809",type:"conventional",coupon:.25,maturity:"2031-07-31",dmoDate:"2026-10-16",tidm:"TG31",cleanPrice:80.69,yield:.04871,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2031",isin:"GB00BNNGP551",type:"il3",coupon:.125,maturity:"2031-08-10",dmoDate:"2026-10-16",tidm:"TR31",cleanPrice:95.53,yield:.01083,yieldKind:"real",baseRpi:293.60323,indexRatio:1.43211},{name:"4% Treasury Gilt 2031",isin:"GB00BPSNBF73",type:"conventional",coupon:4,maturity:"2031-10-22",dmoDate:"2026-10-16",tidm:"T31",cleanPrice:95.82,yield:.05012,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1% Treasury Gilt 2032",isin:"GB00BM8Z2T38",type:"conventional",coupon:1,maturity:"2032-01-31",dmoDate:"2026-10-16",tidm:"TG32",cleanPrice:81.73,yield:.0503,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 5/8% Treasury Gilt 2032",isin:"GB00BWGDRG14",type:"conventional",coupon:4.625,maturity:"2032-03-07",dmoDate:"2026-10-16",tidm:"T32H",cleanPrice:98.27,yield:.05056,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4¼% Treasury Stock 2032",isin:"GB0004893086",type:"conventional",coupon:4.25,maturity:"2032-06-07",dmoDate:"2026-10-16",tidm:"TR32",cleanPrice:96.57,yield:.05014,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1¼% Index-linked Treasury Gilt 2032",isin:"GB00B3D4VD98",type:"il3",coupon:1.25,maturity:"2032-11-22",dmoDate:"2026-10-16",tidm:"T32",cleanPrice:99.38,yield:.01361,yieldKind:"real",baseRpi:217.13226,indexRatio:1.93647},{name:"3¼% Treasury Gilt 2033",isin:"GB00BMV7TC88",type:"conventional",coupon:3.25,maturity:"2033-01-31",dmoDate:"2026-10-16",tidm:"TR33",cleanPrice:90.35,yield:.05122,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 1/8% Treasury Gilt 2033",isin:"GB00BVP99780",type:"conventional",coupon:4.125,maturity:"2033-03-07",dmoDate:"2026-10-16",tidm:"T33H",cleanPrice:94.86,yield:.05141,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 7/8% Green Gilt 2033",isin:"GB00BM8Z2S21",type:"conventional",coupon:.875,maturity:"2033-07-31",dmoDate:"2026-10-16",tidm:"TG33",cleanPrice:76.03,yield:.0516,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0¾% Index-linked Treasury Gilt 2033",isin:"GB00BMF9LJ15",type:"il3",coupon:.75,maturity:"2033-11-22",dmoDate:"2026-10-16",tidm:"T33",cleanPrice:94.65,yield:.01554,yieldKind:"real",baseRpi:372.24,indexRatio:1.12957},{name:"4 5/8% Treasury Gilt 2034",isin:"GB00BPJJKN53",type:"conventional",coupon:4.625,maturity:"2034-01-31",dmoDate:"2026-10-16",tidm:"T34",cleanPrice:96.9,yield:.05205,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0¾% Index-linked Treasury Gilt 2034",isin:"GB00B46CGH68",type:"il3",coupon:.75,maturity:"2034-03-22",dmoDate:"2026-10-16",tidm:"TRTQ",cleanPrice:93.56,yield:.01682,yieldKind:"real",baseRpi:232.22903,indexRatio:1.81059},{name:"4¼% Treasury Gilt 2034",isin:"GB00BQC82C90",type:"conventional",coupon:4.25,maturity:"2034-07-31",dmoDate:"2026-10-16",tidm:"TS34",cleanPrice:94.12,yield:.05243,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4½% Treasury Gilt 2034",isin:"GB00B52WS153",type:"conventional",coupon:4.5,maturity:"2034-09-07",dmoDate:"2026-10-16",tidm:"TR34",cleanPrice:95.78,yield:.05223,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"2% Index-linked Treasury Stock 2035",isin:"GB0031790826",type:"il8",coupon:2,maturity:"2035-01-26",dmoDate:"2026-10-16",tidm:"T2IL",cleanPrice:241.88,yield:null,yieldKind:"real",baseRpi:173.6,indexRatio:null},{name:"4½% Treasury Gilt 2035",isin:"GB00BT7J0027",type:"conventional",coupon:4.5,maturity:"2035-03-07",dmoDate:"2026-10-16",tidm:"T35",cleanPrice:95.03,yield:.05308,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 5/8% Treasury Gilt 2035",isin:"GB00BMGR2916",type:"conventional",coupon:.625,maturity:"2035-07-31",dmoDate:"2026-10-16",tidm:"TG35",cleanPrice:67.83,yield:.05308,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1 1/8% Index-linked Treasury Gilt 2035",isin:"GB00BT7HZZ68",type:"il3",coupon:1.125,maturity:"2035-09-22",dmoDate:"2026-10-16",tidm:"TR35",cleanPrice:94.09,yield:.01854,yieldKind:"real",baseRpi:390.88065,indexRatio:1.0757},{name:"4¾% Treasury Gilt 2035",isin:"GB00BTXS1K06",type:"conventional",coupon:4.75,maturity:"2035-10-22",dmoDate:"2026-10-16",tidm:"T35V",cleanPrice:96.21,yield:.05354,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4¼% Treasury Stock 2036",isin:"GB0032452392",type:"conventional",coupon:4.25,maturity:"2036-03-07",dmoDate:"2026-10-16",tidm:"T4Q",cleanPrice:92.34,yield:.05365,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 7/8% Treasury Gilt 2036",isin:"GB00BWBR1N39",type:"conventional",coupon:4.875,maturity:"2036-07-31",dmoDate:"2026-10-16",tidm:"T36N",cleanPrice:96.45,yield:.05416,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2036",isin:"GB00BYZW3J87",type:"il3",coupon:.125,maturity:"2036-11-22",dmoDate:"2026-10-16",tidm:"TG36",cleanPrice:83.13,yield:.01985,yieldKind:"real",baseRpi:260.01935,indexRatio:1.61708},{name:"4 5/8% Green Gilt 2037",isin:"GB00BVP99905",type:"conventional",coupon:4.625,maturity:"2037-03-07",dmoDate:"2026-10-16",tidm:"T37H",cleanPrice:93.96,yield:.05464,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1¾% Treasury Gilt 2037",isin:"GB00BZB26Y51",type:"conventional",coupon:1.75,maturity:"2037-09-07",dmoDate:"2026-10-16",tidm:"TG37",cleanPrice:70.11,yield:.05492,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1 1/8% Index-linked Treasury Gilt 2037",isin:"GB00B1L6W962",type:"il3",coupon:1.125,maturity:"2037-11-22",dmoDate:"2026-10-16",tidm:"TR37",cleanPrice:90.73,yield:.02074,yieldKind:"real",baseRpi:202.24286,indexRatio:2.07904},{name:"3¾% Treasury Gilt 2038",isin:"GB00BQC4R999",type:"conventional",coupon:3.75,maturity:"2038-01-29",dmoDate:"2026-10-16",tidm:"TG38",cleanPrice:85.71,yield:.05537,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1¾% Index-linked Treasury Gilt 2038",isin:"GB00BMY62Z61",type:"il3",coupon:1.75,maturity:"2038-09-22",dmoDate:"2026-10-16",tidm:"T38",cleanPrice:95.955,yield:.02147,yieldKind:"real",baseRpi:397.6,indexRatio:1.05752},{name:"4¾% Treasury Stock 2038",isin:"GB00B00NY175",type:"conventional",coupon:4.75,maturity:"2038-12-07",dmoDate:"2026-10-16",tidm:"TR38",cleanPrice:93.46,yield:.0557,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1 1/8% Treasury Gilt 2039",isin:"GB00BLPK7334",type:"conventional",coupon:1.125,maturity:"2039-01-31",dmoDate:"2026-10-16",tidm:"TR39",cleanPrice:61.29,yield:.05574,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2039",isin:"GB00BLH38265",type:"il3",coupon:.125,maturity:"2039-03-22",dmoDate:"2026-10-16",tidm:"TG39",cleanPrice:77.27,yield:.02241,yieldKind:"real",baseRpi:296.72581,indexRatio:1.41704},{name:"4¼% Treasury Gilt 2039",isin:"GB00B3KJDS62",type:"conventional",coupon:4.25,maturity:"2039-09-07",dmoDate:"2026-10-16",tidm:"T39",cleanPrice:88.21,yield:.05618,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 3/8% Treasury Gilt 2040",isin:"GB00BQC82D08",type:"conventional",coupon:4.375,maturity:"2040-01-31",dmoDate:"2026-10-16",tidm:"TG40",cleanPrice:88.79,yield:.05658,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 5/8% Index-linked Treasury Gilt 2040",isin:"GB00B3LZBF68",type:"il3",coupon:.625,maturity:"2040-03-22",dmoDate:"2026-10-16",tidm:"TR40",cleanPrice:80.98,yield:.02289,yieldKind:"real",baseRpi:216.52258,indexRatio:1.94193},{name:"4¼% Treasury Gilt 2040",isin:"GB00B6460505",type:"conventional",coupon:4.25,maturity:"2040-12-07",dmoDate:"2026-10-16",tidm:"T40",cleanPrice:87.03,yield:.05666,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"5¼% Treasury Gilt 2041",isin:"GB00BVP99897",type:"conventional",coupon:5.25,maturity:"2041-01-31",dmoDate:"2026-10-16",tidm:"T41F",cleanPrice:96.38,yield:.057,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2041",isin:"GB00BGDYHF49",type:"il3",coupon:.125,maturity:"2041-08-10",dmoDate:"2026-10-16",tidm:"T41",cleanPrice:72.76,yield:.02319,yieldKind:"real",baseRpi:280.05484,indexRatio:1.50139},{name:"1¼ % Treasury Gilt 2041",isin:"GB00BJQWYH73",type:"conventional",coupon:1.25,maturity:"2041-10-22",dmoDate:"2026-10-16",tidm:"TG41",cleanPrice:55.98,yield:.05712,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 5/8% Index-linked Treasury Gilt 2042",isin:"GB00B3MYD345",type:"il3",coupon:.625,maturity:"2042-11-22",dmoDate:"2026-10-16",tidm:"T42A",cleanPrice:76.775,yield:.02382,yieldKind:"real",baseRpi:212.46452,indexRatio:1.97902},{name:"4½% Treasury Gilt 2042",isin:"GB00B1VWPJ53",type:"conventional",coupon:4.5,maturity:"2042-12-07",dmoDate:"2026-10-16",tidm:"T42",cleanPrice:87.63,yield:.05761,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4¾% Treasury Gilt 2043",isin:"GB00BPJJKP77",type:"conventional",coupon:4.75,maturity:"2043-10-22",dmoDate:"2026-10-16",tidm:"TR43",cleanPrice:89.32,yield:.05824,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"3¼% Treasury Gilt 2044",isin:"GB00B84Z9V04",type:"conventional",coupon:3.25,maturity:"2044-01-22",dmoDate:"2026-10-16",tidm:"TG44",cleanPrice:72.77,yield:.05842,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2044",isin:"GB00B7RN0G65",type:"il3",coupon:.125,maturity:"2044-03-22",dmoDate:"2026-10-16",tidm:"T44",cleanPrice:67.05,yield:.02476,yieldKind:"real",baseRpi:242.42258,indexRatio:1.73445},{name:"3½% Treasury Gilt 2045",isin:"GB00BN65R313",type:"conventional",coupon:3.5,maturity:"2045-01-22",dmoDate:"2026-10-16",tidm:"T45",cleanPrice:74.54,yield:.05856,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 5/8% Index-linked Treasury Gilt 2045",isin:"GB00BMF9LH90",type:"il3",coupon:.625,maturity:"2045-03-22",dmoDate:"2026-10-16",tidm:"TR45",cleanPrice:72.725,yield:.02493,yieldKind:"real",baseRpi:363.94,indexRatio:1.15533},{name:"0 7/8% Treasury Gilt 2046",isin:"GB00BNNGP775",type:"conventional",coupon:.875,maturity:"2046-01-31",dmoDate:"2026-10-16",tidm:"TG46",cleanPrice:43.22,yield:.0589,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2046",isin:"GB00BYMWG366",type:"il3",coupon:.125,maturity:"2046-03-22",dmoDate:"2026-10-16",tidm:"TR46",cleanPrice:63.525,yield:.02524,yieldKind:"real",baseRpi:257.79,indexRatio:1.63106},{name:"4¼% Treasury Gilt 2046",isin:"GB00B128DP45",type:"conventional",coupon:4.25,maturity:"2046-12-07",dmoDate:"2026-10-16",tidm:"T46",cleanPrice:81.92,yield:.05864,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1½% Treasury Gilt 2047",isin:"GB00BDCHBW80",type:"conventional",coupon:1.5,maturity:"2047-07-22",dmoDate:"2026-10-16",tidm:"TG47",cleanPrice:48.275,yield:.05911,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0¾% Index-linked Treasury Gilt 2047",isin:"GB00B24FFM16",type:"il3",coupon:.75,maturity:"2047-11-22",dmoDate:"2026-10-16",tidm:"T47",cleanPrice:71.575,yield:.02506,yieldKind:"real",baseRpi:207.76667,indexRatio:2.02377},{name:"0 1/8% Index-linked Treasury Gilt 2048",isin:"GB00BZ13DV40",type:"il3",coupon:.125,maturity:"2048-08-10",dmoDate:"2026-10-16",tidm:"TG48",cleanPrice:60.1,yield:.02527,yieldKind:"real",baseRpi:274.79333,indexRatio:1.53014},{name:"1¾% Treasury Gilt 2049",isin:"GB00BFWFPP71",type:"conventional",coupon:1.75,maturity:"2049-01-22",dmoDate:"2026-10-16",tidm:"TG49",cleanPrice:49.52,yield:.05909,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1 7/8% Index-linked Treasury Gilt 2049",isin:"GB00BT7J0134",type:"il3",coupon:1.875,maturity:"2049-09-22",dmoDate:"2026-10-16",tidm:"TR49",cleanPrice:89.32,yield:.02504,yieldKind:"real",baseRpi:391.95806,indexRatio:1.07274},{name:"4¼% Treasury Gilt 2049",isin:"GB00B39R3707",type:"conventional",coupon:4.25,maturity:"2049-12-07",dmoDate:"2026-10-16",tidm:"T49",cleanPrice:80.45,yield:.05878,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0½% Index-linked Treasury Gilt 2050",isin:"GB00B421JZ66",type:"il3",coupon:.5,maturity:"2050-03-22",dmoDate:"2026-10-16",tidm:"TR50",cleanPrice:64.425,yield:.02535,yieldKind:"real",baseRpi:213.4,indexRatio:1.97034},{name:"0 5/8% Treasury Gilt 2050",isin:"GB00BMBL1F74",type:"conventional",coupon:.625,maturity:"2050-10-22",dmoDate:"2026-10-16",tidm:"TG50",cleanPrice:33.18,yield:.05915,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2051",isin:"GB00BNNGP882",type:"il3",coupon:.125,maturity:"2051-03-22",dmoDate:"2026-10-16",tidm:"TG51",cleanPrice:56.57,yield:.02531,yieldKind:"real",baseRpi:294.11071,indexRatio:1.42964},{name:"1¼% Treasury Gilt 2051",isin:"GB00BLH38158",type:"conventional",coupon:1.25,maturity:"2051-07-31",dmoDate:"2026-10-16",tidm:"T51A",cleanPrice:40.07,yield:.05953,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0¼% Index-linked Treasury Gilt 2052",isin:"GB00B73ZYW09",type:"il3",coupon:.25,maturity:"2052-03-22",dmoDate:"2026-10-16",tidm:"TG52",cleanPrice:57.72,yield:.02525,yieldKind:"real",baseRpi:242.05,indexRatio:1.73712},{name:"3¾% Treasury Gilt 2052",isin:"GB00B6RNH572",type:"conventional",coupon:3.75,maturity:"2052-07-22",dmoDate:"2026-10-16",tidm:"T52",cleanPrice:72.6,yield:.05899,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1½% Green Gilt 2053",isin:"GB00BM8Z2V59",type:"conventional",coupon:1.5,maturity:"2053-07-31",dmoDate:"2026-10-16",tidm:"TG53",cleanPrice:41.405,yield:.05949,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"3¾% Treasury Gilt 2053",isin:"GB00BPCJD997",type:"conventional",coupon:3.75,maturity:"2053-10-22",dmoDate:"2026-10-16",tidm:"T53",cleanPrice:71.74,yield:.05928,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 3/8% Treasury Gilt 2054",isin:"GB00BPSNBB36",type:"conventional",coupon:4.375,maturity:"2054-07-31",dmoDate:"2026-10-16",tidm:"T54",cleanPrice:79.91,yield:.05931,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1 5/8% Treasury Gilt 2054",isin:"GB00BJLR0J16",type:"conventional",coupon:1.625,maturity:"2054-10-22",dmoDate:"2026-10-16",tidm:"TR54",cleanPrice:42.305,yield:.05913,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1¼% Index-linked Treasury Gilt 2054",isin:"GB00BPSNBG80",type:"il3",coupon:1.25,maturity:"2054-11-22",dmoDate:"2026-10-16",tidm:"TG54",cleanPrice:75.3,yield:.0249,yieldKind:"real",baseRpi:378.58065,indexRatio:1.11065},{name:"1¼% Index-linked Treasury Gilt 2055",isin:"GB00B0CNHZ09",type:"il3",coupon:1.25,maturity:"2055-11-22",dmoDate:"2026-10-16",tidm:"TR8F",cleanPrice:75.07,yield:.02469,yieldKind:"real",baseRpi:192.2,indexRatio:2.18767},{name:"4¼% Treasury Gilt 2055",isin:"GB00B06YGN05",type:"conventional",coupon:4.25,maturity:"2055-12-07",dmoDate:"2026-10-16",tidm:"TR4Q",cleanPrice:78.25,yield:.0589,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"5 3/8% Treasury Gilt 2056",isin:"GB00BT7J0241",type:"conventional",coupon:5.375,maturity:"2056-01-31",dmoDate:"2026-10-16",tidm:"T56",cleanPrice:93.81,yield:.05902,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-Linked Treasury Gilt 2056",isin:"GB00BYVP4K94",type:"il3",coupon:.125,maturity:"2056-11-22",dmoDate:"2026-10-16",tidm:"TR56",cleanPrice:51.325,yield:.02422,yieldKind:"real",baseRpi:264.88333,indexRatio:1.58738},{name:"1¾% Treasury Gilt 2057",isin:"GB00BD0XH204",type:"conventional",coupon:1.75,maturity:"2057-07-22",dmoDate:"2026-10-16",tidm:"TG57",cleanPrice:42.24,yield:.05878,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2058",isin:"GB00BP9DLZ64",type:"il3",coupon:.125,maturity:"2058-03-22",dmoDate:"2026-10-16",tidm:"T58",cleanPrice:50.415,yield:.02386,yieldKind:"real",baseRpi:255.8871,indexRatio:1.64319},{name:"4% Treasury Gilt 2060",isin:"GB00B54QLM75",type:"conventional",coupon:4,maturity:"2060-01-22",dmoDate:"2026-10-16",tidm:"TR60",cleanPrice:74.01,yield:.05847,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0½% Treasury Gilt 2061",isin:"GB00BMBL1D50",type:"conventional",coupon:.5,maturity:"2061-10-22",dmoDate:"2026-10-16",tidm:"TG61",cleanPrice:22.735,yield:.05568,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 3/8% Index-linked Treasury Gilt 2062",isin:"GB00B4PTCY75",type:"il3",coupon:.375,maturity:"2062-03-22",dmoDate:"2026-10-16",tidm:"T62",cleanPrice:53.73,yield:.02301,yieldKind:"real",baseRpi:235.82903,indexRatio:1.78295},{name:"4% Treasury Gilt 2063",isin:"GB00BMF9LF76",type:"conventional",coupon:4,maturity:"2063-10-22",dmoDate:"2026-10-16",tidm:"TR63",cleanPrice:73.37,yield:.05826,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"2½% Treasury Gilt 2065",isin:"GB00BYYMZX75",type:"conventional",coupon:2.5,maturity:"2065-07-22",dmoDate:"2026-10-16",tidm:"TG65",cleanPrice:50.49,yield:.0575,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2065",isin:"GB00BD9MZZ71",type:"il3",coupon:.125,maturity:"2065-11-22",dmoDate:"2026-10-16",tidm:"TR65",cleanPrice:46.085,yield:.02194,yieldKind:"real",baseRpi:260.43448,indexRatio:1.6145},{name:"0 1/8% Index-linked Treasury Gilt 2068",isin:"GB00BDX8CX86",type:"il3",coupon:.125,maturity:"2068-03-22",dmoDate:"2026-10-16",tidm:"T68",cleanPrice:45.19,yield:.0213,yieldKind:"real",baseRpi:249.7,indexRatio:1.6839},{name:"3½% Treasury Gilt 2068",isin:"GB00BBJNQY21",type:"conventional",coupon:3.5,maturity:"2068-07-22",dmoDate:"2026-10-16",tidm:"TR68",cleanPrice:65.64,yield:.05731,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1 5/8% Treasury Gilt 2071",isin:"GB00BFMCN652",type:"conventional",coupon:1.625,maturity:"2071-10-22",dmoDate:"2026-10-16",tidm:"TG71",cleanPrice:36.37,yield:.05482,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2073",isin:"GB00BM8Z2W66",type:"il3",coupon:.125,maturity:"2073-03-22",dmoDate:"2026-10-16",tidm:"TG73",cleanPrice:47.6,yield:.018,yieldKind:"real",baseRpi:308.32,indexRatio:1.36375},{name:"1 1/8% Treasury Gilt 2073",isin:"GB00BLBDX619",type:"conventional",coupon:1.125,maturity:"2073-10-22",dmoDate:"2026-10-16",tidm:"TR73",cleanPrice:28.445,yield:.05297,yieldKind:"nominal",baseRpi:null,indexRatio:null}]},H=t=>Number.isFinite(+t)?+t:0,Re=t=>String(t||"").toUpperCase().trim(),Dt=t=>"£"+Math.round(H(t)).toLocaleString("en-GB"),Im=t=>{const e=new Date(String(t).slice(0,10)+"T00:00:00Z");return Number.isNaN(e.getTime())?String(t):e.toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"})},wm=.02,Em=new Set(["CSH2","CASH","MMF","XSTR","ERNS","ERNX"]),km=new Set((Array.isArray(Vn==null?void 0:Vn.gilts)?Vn.gilts:[]).map(t=>Re(t&&t.tidm)).filter(Boolean));function Pm(t){const e=Re(t);return km.has(e)||/^T[RGNS]?\d{2}[A-Z]?$/.test(e)||/^GB00B/.test(e)}function us(t,e){var r,s;if(+(e==null?void 0:e.firstTaxYear)>0)return+e.firstTaxYear;if(+((r=t.timing)==null?void 0:r.firstTaxYear)>0)return+t.timing.firstTaxYear;if(+((s=t.assumptions)==null?void 0:s.firstTaxYear)>0)return+t.assumptions.firstTaxYear;const n=[...Array.isArray(e==null?void 0:e.cashYears)?e.cashYears.map(i=>+i.Y):[],...Array.isArray(e==null?void 0:e.orders)?e.orders.flatMap(i=>Array.isArray(i.taxYears)?i.taxYears.map(Number):[]):[]].filter(i=>i>2e3);return n.length?Math.min(...n):null}function no(t,e=new Date){var o,l,a;const n=t||{},r=(l=(o=n.strategy)==null?void 0:o.r)==null?void 0:l.plan,s=us(n,r);if(!(s>0)||Se(e)<s)return!1;const i=(a=n.timing)==null?void 0:a.startMonth;return typeof i=="string"&&/^\d{4}-\d{2}$/.test(i)?e.getFullYear()+"-"+String(e.getMonth()+1).padStart(2,"0")>=i:!0}function Rm(t,{today:e=new Date,params:n=null,runUpMonthly:r=0}={}){var c,u,d,h,y,m,p,T,k,I,g,f,_;const s=t||{},i=(u=(c=s.strategy)==null?void 0:c.r)==null?void 0:u.plan,o=Se(e);if((d=s.strategy)!=null&&d.contract&&i&&Array.isArray(i.orders)){const b=us(s,i),v=no(s,e),D=N=>({key:"gilt:"+Re(N.tidm||N.sedol||N.name),wrapper:"SIPP",kind:"gilt",label:N.name,ticker:Re(N.tidm),sedol:N.sedol||null,matures:N.matures||null,units:Math.round(H(N.nominal)),cost:Math.round(H(N.cost)),pays:Math.round(H(N.pays)),taxYears:Array.isArray(N.taxYears)?N.taxYears.slice():[],cleanPrice:H(N.cleanPrice)||null,indexRatio:H(N.indexRatio)||null}),A=i.orders.filter(N=>H(N.pays)>0),P=N=>{const R=N.matures?Date.parse(N.matures):NaN;return Number.isFinite(R)?R<e.getTime():Array.isArray(N.taxYears)&&N.taxYears.length>0&&N.taxYears.every(te=>+te<o)},w=n&&n.borrowedFloor||((y=(h=s.strategy)==null?void 0:h.params)==null?void 0:y.borrowedFloor)||((m=s.rotation)==null?void 0:m.borrowedFloor)||null,C=new Set(w&&Array.isArray(w.tidms)?w.tidms.map(Re).filter(Boolean):[]),j=N=>C.has(Re(N.tidm)),S=A.filter(N=>!j(N)),E=S.filter(N=>!P(N)).map(D),x=S.filter(P).map(D),F=A.filter(j).map(D),le=!!w,se=Array.isArray(i.cashYears)?i.cashYears:[],fe=se.filter(N=>+N.Y>=o).map(N=>+N.Y),K=Math.max(0,H(((p=s.assumptions)==null?void 0:p.bridgeCash)??((k=(T=s.strategy)==null?void 0:T.params)==null?void 0:k.bridgeCash))),ee=se.reduce((N,R)=>N+H(R.cost),0),ie=ee>0?ee:Math.max(0,H(i.cash)-K);let Ze=Math.round(ie),_e={months:0,monthly:0,value:0};if(!v&&K>0){const N=Array.isArray(s.timeline)&&s.timeline[0]?s.timeline[0]:null,R=H(r)>0?H(r):N?Math.max(0,(H(N.gross)-H(N.sp)-H(N.other))/12):0,te=Date.UTC(b||o+1,3,6),we=Math.max(0,Math.round((te-e.getTime())/(30.44*864e5)));_e={months:we,monthly:Math.round(R),value:Math.round(Math.min(K,R*we))},Ze+=_e.value}v&&(Array.isArray(i.years)&&i.years.length?Ze=Math.round(i.years.filter(N=>N.from==="cash"&&+N.Y>=o).reduce((N,R)=>N+H(R.need),0)):se.length&&(Ze=Math.round(ie*fe.length/se.length)));const tn=[];_e.value>0&&tn.push({label:"Run-up: "+_e.months+" month"+(_e.months===1?"":"s")+" × "+Dt(_e.monthly)+" until the ladder pays",amount:_e.value});for(const N of se){if(v&&+N.Y<o)continue;const R=Array.isArray(s.timeline)?s.timeline.find(we=>we&&z(+N.Y)===we.taxYear):null,te=R&&H(R.lump)>0?H(R.lump):0;tn.push({label:"Cash year "+z(+N.Y)+(te>0?" ("+Dt(te)+" of it paid by a lump sum expected that year)":""),amount:Math.round(H(N.cost))})}const nn={key:"cash:SIPP",wrapper:"SIPP",kind:"cash",label:"Money-market fund / cash (e.g. CSH2)",value:Ze,runUp:_e,breakdown:tn,spending:v,yearsLeft:v?fe:se.map(N=>+N.Y),bridgeCash:Math.round(K)};let Pt="The ladder is bought in the SIPP. The ISA is "+(((I=s.pots)==null?void 0:I.isaPolicy)==="hold"?"held aside and not part of the ladder.":"drawn by its own policy and not part of the ladder.");return K>0&&!v&&(Pt+=_e.value>0?" The run-up is paid from the same cash: "+_e.months+" month"+(_e.months===1?"":"s")+" at about "+Dt(_e.monthly)+" are still to come, so "+Dt(_e.value)+" of the "+Dt(K)+" set aside is in the target; the rest has been spent as designed.":" The "+Dt(K)+" of bridge cash for the run-up has been spent as designed, so it is no longer a target."),v&&(Pt+=" The plan is running (tax year "+z(o)+")"+(x.length?": "+x.length+" rung"+(x.length===1?" has":"s have")+" matured and paid, so "+(x.length===1?"it is":"they are")+" no longer targets":"")+"; the cash years' money is being spent as designed, so cash is reported, not diffed."),F.length&&(Pt+=" The rotation fired"+(w.soldAt?" on "+Im(w.soldAt):"")+": "+F.length+" rung"+(F.length===1?" was":"s were")+" sold and the proceeds bought the equity fund, so "+(F.length===1?"it is no longer a target":"they are no longer targets")+" and the fund is kept."),{kind:"ladder",lines:E,paid:x,sold:F,rotated:le,cash:nn,running:v,thisTaxYear:o,firstTaxYear:b,note:Pt}}const l=Array.isArray(s.targetMix)&&s.targetMix.length?s.targetMix[0]:null,a=H((f=(g=s.pots)==null?void 0:g.potAtRetirement)==null?void 0:f.sipp)>0?H(s.pots.potAtRetirement.sipp):H((_=s.pots)==null?void 0:_.sipp);return l&&a>0?{kind:"buckets",lines:[{key:"bucket:shares",wrapper:"SIPP",kind:"bucket",bucket:"shares",label:"Shares (world tracker)",value:Math.round(a*l.equity/100),pct:l.equity},{key:"bucket:bonds",wrapper:"SIPP",kind:"bucket",bucket:"bonds",label:"Bonds (gilts / index-linked / global agg)",value:Math.round(a*l.bond/100),pct:l.bond},{key:"bucket:cash",wrapper:"SIPP",kind:"bucket",bucket:"cash",label:"Cash (money-market fund)",value:Math.round(a*l.cash/100),pct:l.cash}],paid:[],sold:[],rotated:!1,cash:null,running:no(s,e),thisTaxYear:o,firstTaxYear:us(s,null),note:`A pot strategy: the target is a mix, not a list of funds. Any world tracker, gilt fund or money-market fund fills its bucket; the Stress tester's "Example funds" shows one way.`}:{kind:"none",lines:[],paid:[],sold:[],rotated:!1,cash:null,running:!1,thisTaxYear:o,firstTaxYear:null,note:"No plan document yet — lock the plan first."}}function Dm(t){const e=(t||[]).filter(r=>r&&(H(r.value)>0||H(r.units)>0)),n=is(e.map(r=>({...r,value:H(r.value)})));return e.map(r=>{const s=Re(r.ticker),i=Pm(s)||r.kind==="gilt",o=Em.has(s)||Re(r.wrapper)==="CASH"||r.kind==="cash"||r.subClass==="cash"||r.subClass==="moneyMarket",l=n.tagged.find(a=>a.ticker===r.ticker&&a.wrapper===r.wrapper&&Math.abs(H(a.value)-H(r.value))<1);return{ticker:s,name:r.name||"",sedol:r.sedol||null,wrapper:Re(r.wrapper)||"SIPP",value:H(r.value),units:H(r.units)||null,gilt:i,cash:o,bucket:o?"cash":i?"bonds":l?l.bucket:r.subClass?"shares":null}})}function Om(t,e,{tolerance:n=wm}={}){const r=Dm(t),s=r.filter(b=>b.wrapper==="SIPP"),i=b=>b.wrapper==="ISA"?"ISA — kept as it is":b.wrapper==="CASH"?"bank / savings cash — outside the pension, kept as it is":"taxable account — kept as it is",o=[],l=[],a=[],c=[],u=[],d=r.filter(b=>b.wrapper!=="SIPP").map(b=>({...b,why:i(b)}));let h=0,y=0,m=0,p=0,T=0,k=null;if(e.kind==="ladder"){const b=new Set,v=S=>{const E=String(S||"").match(/(20\d{2})/);if(E)return+E[1];const x=String(S||"").match(/^T[RGNS]?(\d{2})[A-Z]?$/i);return x?2e3+ +x[1]:null},D=(S,E)=>S.ticker&&E.ticker&&S.ticker===E.ticker||E.sedol&&(Re(S.sedol)===Re(E.sedol)||Re(S.name).includes(Re(E.sedol))),A=(S,E,x)=>S.ticker&&S.ticker.length>=3&&E.label&&Re(E.label).includes(S.ticker)||x&&(v(S.name)===x||v(S.ticker)===x),P=[...e.paid||[],...e.sold||[],...e.lines],w=new Map,C=(S,E)=>{const x=s.filter(F=>!b.has(F)&&F.gilt&&E(F));x.forEach(F=>b.add(F)),w.set(S,x)};for(const S of P)C(S,E=>D(E,S));for(const S of P)if(!w.get(S).length){const E=v(S.matures)||v(S.label)||v(S.ticker);C(S,x=>A(x,S,E))}const j=S=>w.get(S)||[];for(const S of e.paid||[])for(const E of j(S))c.push({...E,key:"matured:"+(E.ticker||S.ticker),label:E.name||E.ticker||S.label,rung:S.label,why:"matured and paid"+(S.taxYears.length?" in "+S.taxYears.map(z).join(", "):"")+" — remove it from your record"});for(const S of e.sold||[])for(const E of j(S))u.push({...E,key:"sold:"+(E.ticker||S.ticker),label:E.name||E.ticker||S.label,rung:S.label,why:"sold by the rotation — remove it from your record"});for(const S of e.lines){const E=j(S),x=S.cleanPrice&&S.indexRatio?S.cleanPrice*S.indexRatio/100:S.units>0?S.cost/S.units:null,F=E.reduce((se,fe)=>se+(fe.units!=null?fe.units:x?fe.value/x:0),0),le=S.units-F;h+=S.cost,y+=Math.min(S.cost,x?F*x:0),m++,S.units>0&&Math.abs(le)<=n*S.units?a.push({...S,heldUnits:Math.round(F)}):le>0?o.push({...S,units:Math.round(le),amount:Math.round(x?le*x:S.cost*(le/S.units)),heldUnits:Math.round(F),why:"rung for "+S.taxYears.map(z).join(", ")}):l.push({...S,units:Math.round(-le),amount:Math.round(x?-le*x:0),heldUnits:Math.round(F),why:"more than the rung needs"})}p=s.filter(S=>S.cash).reduce((S,E)=>S+E.value,0),T=e.cash?e.cash.value:0,e.cash&&e.cash.spending?k={held:Math.round(p),target:Math.round(T),yearsLeft:Array.isArray(e.cash.yearsLeft)?e.cash.yearsLeft.slice():[]}:e.cash&&(h+=T,y+=Math.min(T,p),T>0&&m++,T>0&&p>=T*(1-n)?a.push({...e.cash,heldValue:Math.round(p),spare:Math.round(Math.max(0,p-T))}):T>p&&o.push({...e.cash,amount:Math.round(T-p),heldValue:Math.round(p),why:"the cash years"}));for(const S of s)!b.has(S)&&!S.cash&&(e.rotated&&!S.gilt?d.push({...S,why:"bought by the rotation — kept"}):l.push({key:"sell:"+(S.ticker||S.name),wrapper:"SIPP",kind:S.gilt?"gilt":"fund",label:S.name||S.ticker,ticker:S.ticker,amount:Math.round(S.value),units:S.units,why:"not in the plan — proceeds fund the ladder"}))}else if(e.kind==="buckets"){const b={shares:0,bonds:0,cash:0,diversifiers:0};for(const v of s)b[v.bucket||"shares"]+=v.value;p=b.cash;for(const v of e.lines){const D=b[v.bucket]||0,A=v.value-D;h+=v.value,y+=Math.min(v.value,D),v.value>0&&m++,v.bucket==="cash"&&(T=v.value),v.value>0&&Math.abs(A)<=n*v.value?a.push({...v,heldValue:Math.round(D)}):A>0?o.push({...v,amount:Math.round(A),heldValue:Math.round(D),why:"bring "+v.bucket+" up to "+v.pct+"% of the pot"}):(v.value>0||D>0)&&l.push({...v,amount:Math.round(-A),heldValue:Math.round(D),why:"bring "+v.bucket+" down to "+v.pct+"% of the pot"})}b.diversifiers>0&&l.push({key:"bucket:diversifiers",wrapper:"SIPP",kind:"bucket",bucket:"diversifiers",label:"Diversifiers",amount:Math.round(b.diversifiers),why:"not in the target mix"})}const I=o.reduce((b,v)=>b+H(v.amount),0),g=l.reduce((b,v)=>b+H(v.amount),0);let f=!1,_;return e.kind==="none"?_="no plan document to read against":o.length?_=o.length+" line"+(o.length===1?"":"s")+" still to buy":l.length?_=l.length+" line"+(l.length===1?"":"s")+" to sell":a.length<m?_=m-a.length+" target line"+(m-a.length===1?"":"s")+" not held":m===0?(f=!0,_=e.kind==="ladder"?"every rung has matured and paid — nothing left to hold":"the target is empty"):(f=!0,_=e.kind==="ladder"?"every rung the plan still needs is held"+(e.cash&&!e.cash.spending?", and the cash years are covered":""):"every bucket is within "+Math.round(n*100)+"% of its target"),{kind:e.kind,buy:o,sell:l,hold:a,keep:d,matured:c,sold:u,cashInfo:k,totals:{buyCost:Math.round(I),sellValue:Math.round(g),shortfall:Math.round(Math.max(0,I-g)),cashHeld:Math.round(p),cashTarget:Math.round(T)},progressPct:h>0?Math.round(100*y/h):f?100:0,complete:f,reason:_}}function Mm(t,e={}){const n=[...t.buy.map(i=>({...i,action:"buy"})),...t.sell.map(i=>({...i,action:"sell"}))],r=n.filter(i=>!e[i.key]),s=n.length-r.length;return{pct:n.length?Math.round(100*(t.progressPct/100*0+(n.length-r.length)/n.length)):100,held:t.progressPct,doneCount:s,total:n.length,next:r[0]||null}}function Nm(){return{settings:{equityMin:de.EQUITY_MIN,bondMin:de.BOND_MIN,cashTarget:de.CASH_TARGET,duration:de.DURATION_YEARS,baseSalary:de.BASE_SALARY,other:0,statePension:12e3,statePensionYear:12,pa:be.PERSONAL_ALLOWANCE,brl:be.BASIC_RATE_LIMIT,hrl:be.HIGHER_RATE_LIMIT,taxMode:"inflates",protectionMult:Ue.PROTECTION_MULTIPLIER,consecutiveLimit:de.CONSECUTIVE_LIMIT,disableProtection:!1,hodlEnabled:Ue.HODL_ENABLED,hodlValue:Ue.HODL_VALUE,spendingProfile:"flat",equityGlideEnabled:!1,diversifierStart:0,taggedFunds:[]},lastModified:null,checksum:null}}function xm(t,e=new Date){const n={...Nm()};t.settings&&(n.settings={...n.settings,...t.settings},t.settings.pacwMin!==void 0&&t.settings.equityMin===void 0&&(n.settings.equityMin=t.settings.pacwMin),t.settings.cgtMin!==void 0&&t.settings.bondMin===void 0&&(n.settings.bondMin=t.settings.cgtMin),t.settings.csh2Target!==void 0&&t.settings.cashTarget===void 0&&(n.settings.cashTarget=t.settings.csh2Target),n.settings.hodlEnabled===void 0&&(n.settings.hodlEnabled=!1),n.settings.hodlValue===void 0&&(n.settings.hodlValue=25e3));const r=n.settings;if(r.spendingProfile==="declining"){const s=+r.shapeAgeNow||57,i=r.incomeShape==="phases"&&Array.isArray(r.incomeSteps)&&r.incomeSteps.length?r.incomeSteps:[{fromAge:s,amount:+r.baseSalary||0}];r.incomeShape="phases",r.incomeSteps=Pl(i,s),r.shapeAgeNow=s,r.targetSchedule=Rl(r,s),r.spendingProfile="flat",r.spendingMigratedFrom="declining"}return n.settings=Vp(n.settings,t.budget||null,e),n.lastModified=t.lastModified,n.checksum=t.checksum,n}const Cm=t=>t===void 0?void 0:JSON.parse(JSON.stringify(t)),Lm=t=>!!(t&&t.decisionTool&&Ht(t.decisionTool.settings));function Vm(t){const e=t&&t.stressTool&&t.stressTool.settings;return e&&typeof e=="object"?Cm(e):t&&!Lm(t)?{...ss(),chargesPct:Eo,isaGrowth:ko}:ss()}function Ir(t,{now:e=new Date}={}){const n=Vm(t),r=t&&t.budgetTool&&t.budgetTool.settings||El();return r&&kl(r)&&+r.currentAge>(+n.currentAge||0)&&(n.currentAge=+r.currentAge,n.currentAgeAsOf=r.currentAgeAsOf||n.currentAgeAsOf||null),xm({settings:n,budget:r||null,lastModified:null,checksum:null},e).settings}function Bm(t,{now:e=new Date}={}){const n=t||{},r=Ir(n,{now:e});return sm({...n,stressTool:{...n.stressTool||{},settings:r}},e)}function Fm(t=new Date){return t.getFullYear()+"-"+String(t.getMonth()+1).padStart(2,"0")}function wr(t,e=500){return(Array.isArray(t&&t.decisionTool&&t.decisionTool.history)?t.decisionTool.history:[]).filter(r=>r&&typeof r=="object").slice().sort((r,s)=>String(r.date||"").localeCompare(String(s.date||""))).slice(-e)}function il(t,{now:e=new Date}={}){const n=t||{},r=n.planDocument||null,s=wr(n);let i=null;if(r&&r.strategy&&r.strategy.contract){const c=to(r,r.strategy.id||null);i=c?Am(c,{today:e}):null}const o=r&&r.accumulation&&Array.isArray(n.accumulationTool&&n.accumulationTool.history)?n.accumulationTool.history:[],l=Xt(n.holdings),a=n.decisionTool&&n.decisionTool.taxYears||null;return{today:e,history:s,ladderPos:i,accHistory:o,holdings:l,taxYears:a,ladderInDocument:!!(r&&to(r,r.strategy&&r.strategy.id||null))}}function Um(t,{now:e=new Date}={}){const n=t&&t.planDocument;if(!n)return null;const{ladderInDocument:r,...s}=il(t,{now:e});return Tm(n,s)}function Gm(t,{now:e=new Date}={}){const n=t||{},r=n.planDocument||null;if(!r)return null;const s=Ir(n,{now:e});let i=0;const o=Ws(Se(e)),l=n.decisionTool&&n.decisionTool.taxYears&&n.decisionTool.taxYears[o];if(i=+(l&&l.expectedMonthly&&l.expectedMonthly.sipp&&l.expectedMonthly.sipp.gross)||0,!i){const y=wr(n),m=y.length?y[y.length-1]:null;i=m&&(+m.sippDraw||+m.sipp)||0}const a=Rm(r,{today:e,params:s.strategyParams||null,runUpMonthly:i}),c=Xt(n.holdings),u=Om(c.lines||[],a),d=n.transition&&n.transition.done||{},h=Mm(u,d);return{target:a,diff:u,prog:h}}const ro=Object.freeze({unknown:["plan","budget","hold","household"],saving:["saving","pot","plan","budget","lock","hold","household"],approaching:["plan","saving","pot","budget","lock","hold","move","household"],"committed-saving":["pot","where","plan","saving","budget","hold","move","household"],"draft-retired":["plan","budget","lock","hold","move","household"],bridge:["month","where","plan","hold","move","budget","household"],running:["month","where","plan","hold","move","budget","household"]}),Ym=Object.freeze(["pot","budget","lock","hold","move","household"]),$m=Object.freeze(["month","where","plan","pot","saving","budget","lock","hold","move","household"]),so=Object.freeze(["draft-retired","bridge","running"]),ol=Object.freeze(["saving","approaching","committed-saving"]),jm=Object.freeze(["P.readonly","P.noAge","P.arrive","P.taxyear","P.month","P.idle","P.pot","P.working","P.recheck","P.stale","P.draft","P.approaching","P.saving"]),Km=Object.freeze({plan:Object.freeze(["about","income"])});function Wm(t,e){return al(t,e).flatMap(n=>(Km[n.id]||[]).map(r=>({id:r,under:n.id})))}function al(t,{locked:e,linked:n,manyPlans:r}){return(ro[t]||ro.unknown).filter(i=>!(i==="lock"&&e)&&!(i==="household"&&!n&&!r)).map(i=>({id:i,optional:Ym.includes(i)&&!(i==="pot"&&t==="committed-saving")}))}const W=t=>t==null||t===""||!Number.isFinite(+t)?null:+t,tt=t=>Array.isArray(t)?t.filter(e=>e&&typeof e=="object"):[],De=(t,e)=>({k:t,v:Math.round(W(e)||0),kind:"money"}),Ce=(t,e)=>({k:t,v:Math.round(W(e)||0),kind:"count"}),Fr=(t,e)=>({k:t,v:Math.round((W(e)||0)*100)/100,kind:"pct"}),Le=(t,e)=>({k:t,v:!!e,kind:"yesNo"}),yt=(t,e)=>({k:t,v:String(e),kind:"choice"}),sn=(t,e)=>({k:t,v:String(e),kind:"text"}),Hm=["January","February","March","April","May","June","July","August","September","October","November","December"],zm=t=>{const e=/^(\d{4})-(\d{2})-(\d{2})/.exec(String(t||""));return e&&+e[2]>=1&&+e[2]<=12?+e[3]+" "+Hm[+e[2]-1]+" "+e[1]:String(t||"")},Ur=(t,e)=>sn(t,zm(e)),qm=Object.freeze([{id:"inc.streams",keys:["stress.extraIncomes"],set:t=>tt(t.extraIncomes).some(e=>W(e.annual)>0),facts:t=>tt(t.extraIncomes).filter(e=>W(e.annual)>0).flatMap((e,n)=>[De("annual"+n,e.annual),Ce("fromAge"+n,e.fromAge),Ce("years"+n,e.years)])},{id:"inc.lump-sums",keys:["stress.windfalls","decision.windfalls"],set:t=>tt(t.windfalls).some(e=>W(e.amount)>0),facts:t=>tt(t.windfalls).filter(e=>W(e.amount)>0).flatMap((e,n)=>[De("amount"+n,e.amount),Ce("atAge"+n,e.atAge??e.fromAge??e.age)])},{id:"inc.extra-spends",keys:["stress.extraWithdrawals"],set:t=>tt(t.extraWithdrawals).some(e=>W(e.amount)>0),facts:t=>tt(t.extraWithdrawals).filter(e=>W(e.amount)>0).flatMap((e,n)=>[De("amount"+n,e.amount),Ce("atAge"+n,e.atAge??e.fromAge??e.age),Ce("years"+n,e.years??1)])},{id:"inc.final-salary-rises",keys:["stress.dbIndexation"],set:t=>W(t.dbAmount)>0&&!!t.dbIndexation&&t.dbIndexation!=="cpi",facts:t=>[yt("rises",t.dbIndexation||"cpi")]},{id:"inc.state-pension-old",keys:["stress.statePension","stress.statePensionYear","decision.statePension","decision.statePensionYear"],set:t=>!t.spStartDate&&W(t.statePension)>0,facts:t=>[De("yearly",t.statePension),Ce("fromYear",t.statePensionYear)]},{id:"tax.bands",keys:["stress.pa","stress.brl","stress.hrl"],set:t=>(W(t.pa)??be.PERSONAL_ALLOWANCE)!==be.PERSONAL_ALLOWANCE||(W(t.brl)??be.BASIC_RATE_LIMIT)!==be.BASIC_RATE_LIMIT||(W(t.hrl)??be.HIGHER_RATE_LIMIT)!==be.HIGHER_RATE_LIMIT,facts:t=>[De("pa",t.pa??be.PERSONAL_ALLOWANCE),De("brl",t.brl??be.BASIC_RATE_LIMIT),De("hrl",t.hrl??be.HIGHER_RATE_LIMIT)]},{id:"tax.mode",keys:["stress.taxMode"],set:t=>!!t.taxMode&&t.taxMode!=="inflates",facts:t=>[yt("mode",t.taxMode||"inflates")]},{id:"tax.tax-free-cash",keys:["stress.accessMethod","decision.accessMethod"],set:(t,e)=>!!(t.accessMethod||e.accessMethod)&&(t.accessMethod||e.accessMethod)!=="drawdown",facts:(t,e)=>[yt("how",t.accessMethod||e.accessMethod||"drawdown")]},{id:"tax.ufpls-years",keys:["stress.ufplsYears","stress.ufplsThenPcls","decision.ufplsYears","decision.ufplsThenPcls"],set:(t,e)=>W(t.ufplsYears??e.ufplsYears)>0,facts:(t,e)=>[Ce("years",t.ufplsYears??e.ufplsYears),Le("thenRest",t.ufplsThenPcls??e.ufplsThenPcls)]},{id:"tax.band-fill",keys:["stress.bandFillRecycle","decision.bandFillRecycle"],set:(t,e)=>!!(t.bandFillRecycle??e.bandFillRecycle),facts:(t,e)=>[Le("on",t.bandFillRecycle??e.bandFillRecycle)]},{id:"tax.bed-and-isa",keys:["stress.bedAndIsa","decision.bedAndIsa"],set:(t,e)=>!!(t.bedAndIsa??e.bedAndIsa),facts:(t,e)=>[Le("on",t.bedAndIsa??e.bedAndIsa)]},{id:"tax.earnings",keys:["stress.relevantEarnings","decision.relevantEarnings"],set:(t,e)=>W(t.relevantEarnings??e.relevantEarnings)>0,facts:(t,e)=>[De("yearly",t.relevantEarnings??e.relevantEarnings)]},{id:"prot.cuts",keys:["stress.consecutiveLimit","stress.protectionMult","stress.protectionEscalateMonths","stress.recoveryBuffer","stress.disableProtection","decision.consecutiveLimit","decision.protectionFactor","decision.protectionEscalateMonths","decision.recoveryBuffer","decision.disableProtection"],set:t=>!!t.disableProtection||(W(t.consecutiveLimit)??de.CONSECUTIVE_LIMIT)!==de.CONSECUTIVE_LIMIT||(W(t.protectionMult)??Ue.PROTECTION_MULTIPLIER)!==Ue.PROTECTION_MULTIPLIER||(W(t.recoveryBuffer)??de.RECOVERY_BUFFER)!==de.RECOVERY_BUFFER||W(t.protectionEscalateMonths)>0,facts:t=>[Le("off",!!t.disableProtection),Ce("after",t.consecutiveLimit??de.CONSECUTIVE_LIMIT),Fr("cutTo",(W(t.protectionMult)??Ue.PROTECTION_MULTIPLIER)*100),Ce("deeperAfter",t.protectionEscalateMonths??0),De("buffer",t.recoveryBuffer??de.RECOVERY_BUFFER)]},{id:"prot.reserve",keys:["stress.hodlEnabled","stress.hodlValue"],set:t=>!!t.hodlEnabled,facts:t=>[Le("on",!!t.hodlEnabled),De("amount",t.hodlValue??Ue.HODL_VALUE)]},{id:"pots.diversifiers",keys:["stress.diversifierStart","decision.diversifierStart"],set:t=>W(t.diversifierStart)>0,facts:t=>[De("amount",t.diversifierStart)]},{id:"pots.bond-tent",keys:["stress.equityGlideEnabled","decision.equityGlideEnabled","stress.glideEndgame","decision.glideEndgame"],set:t=>!!t.equityGlideEnabled,facts:t=>[Le("on",!!t.equityGlideEnabled),yt("endgame",t.glideEndgame||"hold")]},{id:"pots.isa-use",keys:["stress.isaDrawdownStrategy","decision.isaDrawdownStrategy"],set:t=>!!t.isaDrawdownStrategy&&t.isaDrawdownStrategy!==Vt.DRAWDOWN_STRATEGY,facts:t=>[yt("use",t.isaDrawdownStrategy||Vt.DRAWDOWN_STRATEGY)]},{id:"pots.isa-growth",keys:["stress.isaGrowth","stress.isaReturn","stress.isaMin","decision.isaReturn","decision.isaMin"],set:t=>t.isaGrowth==="invested"||W(t.isaMin)>0,facts:t=>[yt("grows",t.isaGrowth==="invested"?"invested":t.isaGrowth==="cash"?"cash":"fixed"),Fr("fixedRate",(W(t.isaReturn)??Vt.RETURN)*100),De("floor",t.isaMin??0)]},{id:"pots.charges",keys:["stress.chargesPct"],set:t=>W(t.chargesPct)!=null&&W(t.chargesPct)!==.5,facts:t=>[Fr("yearly",W(t.chargesPct)??0)]},{id:"pots.funds-to-test",keys:["stress.taggedFunds","decision.taggedFunds","stress.subAsset","decision.subAsset"],set:t=>tt(t.taggedFunds).some(e=>W(e.value)>0),facts:t=>tt(t.taggedFunds).filter(e=>W(e.value)>0).flatMap((e,n)=>[sn("name"+n,e.name||e.ticker||""),De("value"+n,e.value)])},{id:"draw.cadence",keys:[],set:(t,e,n)=>{const r=n&&n.decisionTool&&(n.decisionTool.cadence||n.decisionTool.settings&&n.decisionTool.settings.cadence);return!!r&&r!=="monthly"},facts:(t,e,n)=>[yt("how",n&&n.decisionTool&&(n.decisionTool.cadence||n.decisionTool.settings&&n.decisionTool.settings.cadence)||"monthly")]},{id:"timing.stale-draft",keys:["stress.staleDraftDismissedFor"],set:t=>W(t.staleDraftDismissedFor)>0,facts:t=>[Ce("year",t.staleDraftDismissedFor)]},{id:"lock.lock",keys:["decision.locked","decision.lockedAt","decision.lockedBy"],set:(t,e)=>!!e.locked,facts:(t,e)=>[Le("locked",!!e.locked),Ur("at",e.lockedAt||""),sn("by",e.lockedBy||"")]},{id:"lock.unlock",keys:["decision.unlockedAt","decision.unlockCount"],set:(t,e)=>W(e.unlockCount)>0,facts:(t,e)=>[Ce("times",e.unlockCount??0),Ur("last",e.unlockedAt||"")]},{id:"month.seeded",keys:["decision.seededFrom"],set:(t,e)=>!!e.seededFrom,facts:(t,e)=>[sn("from",e.seededFrom||"")]},{id:"mach.configured",keys:["stress.configured","decision.configured"],set:()=>!1,facts:(t,e)=>[Le("stress",!!t.configured),Le("decision",!!e.configured)]},{id:"mach.declining",keys:["stress.spendingProfile","decision.spendingProfile","stress.spendingMigratedFrom","decision.spendingMigratedFrom"],set:t=>t.spendingMigratedFrom==="declining",facts:t=>[Le("folded",t.spendingMigratedFrom==="declining")]},{id:"mach.old-names",keys:["stress.pacwMin","stress.cgtMin","stress.csh2Target"],set:()=>!1,facts:t=>[Le("present",t.pacwMin!==void 0||t.cgtMin!==void 0||t.csh2Target!==void 0)]},{id:"mach.risk-mode",keys:["stress.riskMode"],set:()=>!1,facts:t=>[sn("mode",t.riskMode||"")]},{id:"mach.start-date",keys:["decision.startDate"],set:()=>!1,facts:(t,e)=>[Ur("date",e.startDate||"")]}]);function io(t,e,n,{all:r=!1}={}){const s=t||{},i=e||{},o=[];for(const l of qm){let a=!1,c=[];try{a=!!l.set(s,i,n)}catch{a=!1}if(!(!a&&!r)){try{c=l.facts(s,i,n).filter(u=>u&&(u.kind==="text"||u.kind==="choice"?typeof u.v=="string":!0))}catch{c=[]}o.push({id:l.id,set:a,facts:c})}}return o}const oo={55:{m:[84,91,96],f:[87,93,97]},60:{m:[85,91,96],f:[87,93,97]},65:{m:[85,92,96],f:[88,93,98]},70:{m:[86,92,96],f:[88,94,98]},75:{m:[87,92,97],f:[89,94,98]}},Jm={50:0,25:1,10:2};function Qm(t,e="m",n=10){const r=Jm[n]??2,s=e==="f"?"f":"m",i=Math.max(55,Math.min(75,t||65)),o=Math.floor(i/5)*5,l=Math.min(75,o+5),a=oo[o][s][r],c=oo[l][s][r],u=l===o?0:(i-o)/(l-o);return Math.round(a+(c-a)*u)}const On=["January","February","March","April","May","June","July","August","September","October","November","December"];function en(t){const e=/^(\d{4})-(\d{2})-(\d{2})$/.exec(String(t||""));if(!e)throw new Error("planRead needs today as YYYY-MM-DD");return new Date(+e[1],+e[2]-1,+e[3],12,0,0,0)}const Er=t=>{const e=/^(\d{4})-(\d{2})/.exec(String(t||""));return e?{y:+e[1],m:+e[2]}:null},ae=t=>{const e=Er(t);return e&&e.m>=1&&e.m<=12?On[e.m-1]+" "+e.y:""},Gt=t=>{const e=Er(t);return e&&e.m>=1&&e.m<=12?On[e.m-1]:""},he=t=>{const e=/^(\d{4})-(\d{2})-(\d{2})/.exec(String(t||""));return e&&+e[2]>=1&&+e[2]<=12?+e[3]+" "+On[+e[2]-1]+" "+e[1]:ae(t)},Xm=(t,e)=>(e.y-t.y)*12+(e.m-t.m),ds=t=>String(t).padStart(2,"0"),ll=t=>t.getFullYear()+"-"+ds(t.getMonth()+1)+"-"+ds(t.getDate()),Zm=t=>t.getFullYear()+"-"+ds(t.getMonth()+1),ve=t=>!!t&&typeof t=="object"&&!Array.isArray(t),J=t=>t==null||t===""||!Number.isFinite(+t)?null:+t,Lt=t=>t==null||typeof t=="string"&&t.trim()==="",eg=t=>!!(t&&t.decisionTool&&t.decisionTool.settings&&t.decisionTool.settings.locked),ao=t=>t&&t.decisionTool&&t.decisionTool.settings&&t.decisionTool.settings.lockedAt||t&&t.planDocument&&t.planDocument.lockedAt||null,lo=t=>t&&t.planDetails&&typeof t.planDetails.name=="string"&&t.planDetails.name||t&&typeof t.name=="string"&&t.name||"",co=t=>t&&t.household&&typeof t.household.partnerScenarioId=="string"&&t.household.partnerScenarioId||null,hs=t=>t===void 0?void 0:JSON.parse(JSON.stringify(t)),uo=t=>t===void 0?"<absent>":JSON.stringify(t);function cl(t,e){return String(e).split(".").reduce((n,r)=>n==null?void 0:n[r],t)}function tg(t,e,n){const r=String(e).split(".");let s=t;for(let i=0;i<r.length-1;i++)ve(s[r[i]])||(s[r[i]]={}),s=s[r[i]];s[r[r.length-1]]=n}function ng(t,e){const n=String(e).split(".");let r=t;for(let s=0;s<n.length-1;s++){if(!ve(r[n[s]]))return;r=r[n[s]]}delete r[n[n.length-1]]}function rg(t){const e=String(t??"").trim();let n=/^(\d{4})[-/](\d{1,2})$/.exec(e);if(n)return+n[2]>=1&&+n[2]<=12?{y:+n[1],m:+n[2]}:null;if(n=/^(\d{1,2})[-/](\d{4})$/.exec(e),n)return+n[1]>=1&&+n[1]<=12?{y:+n[2],m:+n[1]}:null;if(n=/^([A-Za-z]{3,9})\s+(\d{4})$/.exec(e),n){const r=On.findIndex(s=>s.toLowerCase().startsWith(n[1].toLowerCase().slice(0,3))&&s.toLowerCase().startsWith(n[1].toLowerCase()));return r>=0?{y:+n[2],m:r+1}:null}return null}const ho=t=>t.y+"-"+String(t.m).padStart(2,"0");function ul(t,e){try{return Ir(t,{now:e})}catch{return t&&t.stressTool&&t.stressTool.settings||{}}}function qs(t,e){try{return el(t,e)}catch{return{mode:"legacy",firstTaxYear:e.getFullYear()+1,shapeAgeNow:J(t.shapeAgeNow)||57,currentAge:null,retireAge:null,startMonth:e.getFullYear()+1+"-04",yearsToStart:0,bridgeMonths:0}}}function Js(t,{today:e}){const n=en(e),r=eg(t),s=r?t.planDocument:null,i=ul(t,n),o=t&&t.stressTool&&ve(t.stressTool.settings)?t.stressTool.settings:{};let l=qs(i,n),a=J(i.duration)||35;if(s&&ve(s.timing)){const I=s.timing;l={...l,mode:I.mode||l.mode,currentAge:J(I.currentAge),retireAge:J(I.retireAge),firstTaxYear:J(I.firstTaxYear)||l.firstTaxYear,shapeAgeNow:J(I.shapeAgeNow)||l.shapeAgeNow,startMonth:I.startMonth||l.startMonth},a=Array.isArray(s.timeline)&&s.timeline.length||J(s.assumptions&&s.assumptions.duration)||a}const c=Se(n),u=l.mode==="legacy"?null:s&&ve(s.timing)?J(s.timing.currentAge):J(i.currentAge),d=s&&ve(s.timing)?s.timing.currentAgeAsOf||null:i.currentAgeAsOf||null,h=u==null?null:l.mode==="future"?"age":"yes",y=l.firstTaxYear,m=h==="yes"?y===c?"now":y===c+1?"april":"saved":null,p=l.shapeAgeNow+a-1,T=r?{kind:"locked",at:he(ao(t))}:{kind:"saved",at:t&&t.lastModified?he(t.lastModified):null},k=r?T:{kind:"saved",at:d?he(d):T.at};return{locked:r,lockedOn:r?he(ao(t)):null,ss:i,stored:o,timing:l,duration:a,thisTY:c,values:{age:u,stopped:h,stopAge:h==="age"?J(l.retireAge):null,startWhen:m,endAge:p,savedYear:h==="yes"&&m==="saved"?y:null},source:T,ageSource:k}}function dl(t,{today:e}){const r=Js(t,{today:e}).values,s={};return r.age!=null&&(s.age=String(r.age)),r.stopped&&(s.stopped=r.stopped),r.stopAge!=null&&(s.stopAge=String(r.stopAge)),r.startWhen&&(s.startWhen=r.startWhen),Number.isFinite(r.endAge)&&(s.endAge=String(r.endAge)),s}const Ot=t=>Po.find(e=>e.path===t);function Gr(t,e){if(Lt(t))return{error:e.required?"required":null,value:null};const n=String(t).trim();if(!/^\d{1,3}$/.test(n))return{error:"notANumber",value:null};const r=+n;return r<e.min?{error:"tooLow",value:r}:r>e.max?{error:"tooHigh",value:r}:{error:null,value:r}}function sg(t){const e=["now","april"];return t.values.savedYear&&e.push("saved"),e}function hl(t,e,{today:n}){const r=en(n),s=Js(t,{today:n}),i={...dl(t,{today:n}),...e||{}},o={},l={},a={age:!0,stopped:!0,endAge:!0,sex:!0,chance:!0,stopAge:!1,stopMonth:!1,startWhen:!1},c=Gr(i.age,Ot("age"));c.error?l.age=c.error:o.age=c.value;const u=Lt(i.stopped)?null:String(i.stopped);if(u?Ot("stopped").options.includes(u)?o.stopped=u:l.stopped="notAnOption":l.stopped="required",a.stopAge=u==="age",a.stopMonth=u==="month",a.startWhen=u==="yes",a.stopAge){const f=Gr(i.stopAge,Ot("stopAge"));f.error?l.stopAge=f.error:o.age!=null&&f.value<o.age?l.stopAge="stop-before-age":o.stopAge=f.value}if(a.stopMonth)if(Lt(i.stopMonth))l.stopMonth="required";else{const f=rg(i.stopMonth);f?ho(f)<=Zm(r)?l.stopMonth="month-passed":o.stopMonth=ho(f):l.stopMonth="notAMonth"}const d=sg(s);if(a.startWhen){const f=Lt(i.startWhen)?null:String(i.startWhen);f?d.includes(f)?o.startWhen=f:l.startWhen="notAnOption":l.startWhen="required"}for(const f of["sex","chance"]){const _=Ot(f),b=Lt(i[f])?_.default:String(i[f]);_.options.includes(b)?o[f]=b:l[f]="notAnOption"}let h=null,y=null,m=null,p=null;if(o.age!=null&&o.stopped&&!l.stopAge&&!l.stopMonth&&!l.startWhen){const f=s.ss,_=s.stored;h={..._};const b=Math.floor(+f.currentAge||0),v=f.currentAgeAsOf||_.currentAgeAsOf||null;h.currentAge=o.age,h.currentAgeAsOf=o.age===b&&v?v:ll(r);const D=o.stopped==="yes";h.retired=D;let A=null;if(o.stopped==="age"&&(A=o.stopAge),o.stopped==="month"){const[P,w]=o.stopMonth.split("-").map(Number);A=Dn({...h},new Date(P,w,0),r),p=A}h.retireAge=D?null:A,h.firstTaxYear=D?o.startWhen==="now"?s.thisTY:o.startWhen==="april"?s.thisTY+1:s.values.savedYear:null,y=qs(h,r),h.shapeAgeNow=y.shapeAgeNow,y.mode!=="legacy"&&(h.firstTaxYear=y.firstTaxYear)}const k=y?y.shapeAgeNow+$r-1:Ot("endAge").min,I=Gr(i.endAge,Ot("endAge"));I.error?l.endAge=I.error:I.value<k?l.endAge="too-short":o.endAge=I.value,h&&o.endAge!=null&&(m=Math.max($r,o.endAge-y.shapeAgeNow+1),h.duration=m);const g=Object.keys(l).length===0&&h!==null&&m!==null;return{ok:g,values:o,errors:l,applies:a,offered:d,next:g?h:null,timing:g?y:null,duration:m,stopAgeFromMonth:p,saved:s,minEnd:k}}function ig(t,e,n){if(!(t&&t.budgetTool&&ve(t.budgetTool.settings)))return{};const r=e.retired===!1&&+e.retireAge>0?+e.retireAge:n.shapeAgeNow;return{"budgetTool.settings.currentAge":e.currentAge,"budgetTool.settings.currentAgeAsOf":e.currentAgeAsOf,"budgetTool.settings.retired":e.retired,"budgetTool.settings.retirementAge":r}}function fl(t,e,{today:n}){const r=hl(t,e,{today:n});if(!r.ok)return{ok:!1,errors:r.errors,patch:{},previous:{}};if(r.saved.locked)return{ok:!1,errors:{plan:"locked"},patch:{},previous:{}};const s=r.next,i=r.timing,o={"stressTool.settings.currentAge":s.currentAge,"stressTool.settings.currentAgeAsOf":s.currentAgeAsOf,"stressTool.settings.retired":s.retired,"stressTool.settings.retireAge":s.retireAge,"stressTool.settings.firstTaxYear":s.firstTaxYear,"stressTool.settings.shapeAgeNow":s.shapeAgeNow,"stressTool.settings.duration":s.duration,"decisionTool.settings.firstTaxYear":i.firstTaxYear,...ig(t,s,i)},l={},a={};for(const c of Dl){if(!(c in o))continue;const u=cl(t,c),d=o[c];uo(u)!==uo(d)&&(u===void 0&&d===null||(l[c]=hs(d),a[c]=hs(u)))}return{ok:!0,errors:{},patch:l,previous:a}}function og(t,e){const n=JSON.parse(JSON.stringify(t));for(const[r,s]of Object.entries(e||{}))s===void 0?ng(n,r):tg(n,r,hs(s));return n}function fo(t,e,{stopAgeFromMonth:n=null}={}){if(!t||t.mode==="legacy")return[{id:"noAge",slots:{}}];const r=t.shapeAgeNow+e-1,s=[];return t.mode==="future"&&(n!=null?s.push({id:"monthAs",slots:{age:t.retireAge,month:ae(t.startMonth)}}):s.push({id:"stopIn",slots:{month:ae(t.startMonth),age:t.retireAge}})),s.push({id:"firstYear",slots:{year:z(t.firstTaxYear),y:t.firstTaxYear}}),s.push({id:"runs",slots:{years:e,from:t.mode==="future"?ae(t.startMonth):"April "+t.firstTaxYear,endAge:r}}),s.push({id:"stepsFrom",slots:{age:t.shapeAgeNow}}),s}function ag(t){return[]}function lg(t,e){const n=t&&t.fromAnswer;if(!ve(n)||!ve(n.answer)||!Array.isArray(n.people)||!ve(n.people[0]))return null;const r=e||{},s=n.people[0],i=ve(s.stop)?s.stop:ve(n.stop)?n.stop:null,o=i?i.kind==="later":J(s.ageAtStop)!=null&&J(s.ageToday)!=null&&s.ageAtStop>s.ageToday,l=J(s.years)!=null?J(s.years):J(n.years),a=[];if(J(s.ageToday)!=null&&J(r.currentAge)!==J(s.ageToday)&&a.push("age"),r.retired===!1!==o&&a.push("stopped"),o&&r.retired===!1&&J(r.retireAge)!==J(s.ageAtStop)&&a.push("stopAge"),l!=null&&J(r.duration)!==l&&a.push("years"),s.statePension===null||ve(s.statePension)&&J(s.statePension.yearly)!=null){const d=s.statePension===null?0:Math.round(J(s.statePension.yearly)),h=+r.spWeeklyAmount>0&&r.spStartDate?Math.round(+r.spWeeklyAmount*52):0;d!==h&&a.push("statePension")}if((s.finalSalary===null||ve(s.finalSalary)&&J(s.finalSalary.yearly)!=null)&&(s.finalSalary===null?0:Math.round(J(s.finalSalary.yearly)))!==Math.round(J(r.dbAmount)||0)&&a.push("finalSalary"),!a.length)return null;const c=typeof n.savedOn=="string"?n.savedOn:"",u=t.lastModified&&String(t.lastModified)>c?he(t.lastModified):null;return{workedOutOn:he(c),changedOn:u,lasted:ve(n.answer)?J(n.answer.lasted):null,diffs:a}}function cg(t,e,{today:n,typed:r=null}={}){const s=(t||[]).filter(g=>g&&g.plan&&typeof g.plan=="object"&&g.plan.id!=null),i=s.find(g=>String(g.plan.id)===String(e))||null;if(!i)return{found:!1,id:String(e||"")};const o=i.plan,l=!!(i.newer||i.failed),a=Js(o,{today:n}),c=!a.locked&&!l,u=dl(o,{today:n}),d=hl(o,r||{},{today:n}),h={...u,...r||{}},y=Po.map(g=>({path:g.path,type:g.type,options:g.type==="choice"?g.path==="startWhen"?d.offered:g.options:null,applies:d.applies[g.path]!==!1,shown:Lt(h[g.path])?"":String(h[g.path]),saved:g.path in u?u[g.path]:null,error:d.errors[g.path]||null})),m=d.ok?fo(d.timing,d.duration,{stopAgeFromMonth:d.stopAgeFromMonth}):fo(a.timing,a.duration);o.planDocument&&o.planDocument.strategy&&o.planDocument.strategy.id||a.ss.strategyId;const p=s.filter(g=>g.plan.id!==o.id&&(g.plan.id===co(o)||co(g.plan)===o.id)).map(g=>({id:String(g.plan.id),name:lo(g.plan)}));let T=null;if(d.values.age!=null){const g=Qm(d.values.age,d.values.sex||"m",+(d.values.chance||"10"));T={endAge:g,applied:String(h.endAge||"")===String(g),slots:{age:g,who:d.values.sex==="f"?"women":"men",ageNow:d.values.age,chance:d.values.chance||"10"}}}const k=c&&d.ok?fl(o,r||{},{today:n}):{patch:{},previous:{}},I={years:a.duration,endAge:a.values.endAge};return{found:!0,id:String(o.id),name:lo(o),locked:a.locked,lockedOn:a.lockedOn,readonly:l,editable:c,source:a.source,ageSource:a.ageSource,thisTY:a.thisTY,yearNow:z(a.thisTY),yearApril:z(a.thisTY+1),yearSaved:a.values.savedYear?z(a.values.savedYear):null,fields:y,errors:d.errors,ok:d.ok,derived:m,notUsed:ag(),partners:p,suggestion:T,endAgeMin:d.minEnd,minYears:$r,changed:Object.keys(k.patch).length>0,patch:k.patch,previous:k.previous,savedSlots:I,savedLine:d.ok?{id:"runsTo",slots:{endAge:d.values.endAge,years:d.duration}}:null}}const G=t=>t==null||t===""||!Number.isFinite(+t)?null:+t,M=t=>Math.round(G(t)||0),pn=t=>t&&t.planDetails&&typeof t.planDetails.name=="string"&&t.planDetails.name||t&&typeof t.name=="string"&&t.name||"",fs=t=>t&&t.household&&typeof t.household.partnerScenarioId=="string"&&t.household.partnerScenarioId||null,or=t=>!!(t&&t.decisionTool&&t.decisionTool.settings&&t.decisionTool.settings.locked),kr=t=>t&&t.decisionTool&&t.decisionTool.settings&&t.decisionTool.settings.lockedAt||t&&t.planDocument&&t.planDocument.lockedAt||null,pl=(t,e)=>t&&t.planDocument&&t.planDocument.strategy&&t.planDocument.strategy.id||e&&e.strategyId||"pots-and-valves",ml=(t,e)=>cm.includes(pl(t,e));function ar(t,e,n=null){const r=t&&t.key;return!r||r==="unknown"?null:r==="committed-saving"?{id:"committed-saving",slots:{month:ae(t.startMonth)||z(t.firstTaxYear)}}:r==="bridge"?{id:ml(e,n)?"bridge-ladder":"bridge-plan",slots:{month:ae(t.startMonth)||"April "+t.firstTaxYear}}:{id:r,slots:{}}}function lr(t,e){try{return Bm(t,{now:e})}catch{return{key:"unknown",locked:or(t),retired:!1,timingMode:"legacy",firstTaxYear:null,startMonth:null,beforeStart:!1,hasRecords:!1,hasDocument:!!(t&&t.planDocument),monthsToStart:0,yearsToStart:0}}}function cr(t,e){try{return Ir(t,{now:e})}catch{return t&&t.stressTool&&t.stressTool.settings||{}}}function Qs(t,e){const n=e.id,r=fs(e);return t.filter(s=>s.plan.id!==n&&(s.plan.id===r||fs(s.plan)===n))}function ug(t,{today:e,source:n="account"}={}){const r=en(e),s=(t||[]).filter(u=>u&&u.plan&&typeof u.plan=="object"&&u.plan.id!=null),i=s.map(u=>{const d=u.plan,h=lr(d,r),y=cr(d,r),m=Qs(s,d);return{id:String(d.id),name:pn(d),stageKey:h.key,line:ar(h,d,y),locked:or(d),lockedOn:or(d)?he(kr(d)):null,madeOn:d.fromAnswer&&d.fromAnswer.savedOn?he(d.fromAnswer.savedOn):null,shownAsSaved:!!(u.newer||u.failed),linked:m.length>0,lastModified:typeof d.lastModified=="string"?d.lastModified:""}}),o=(u,d)=>String(d.lastModified).localeCompare(String(u.lastModified));if(n==="window")return{groups:[{id:"window",rows:i.slice().sort((u,d)=>u.linked===d.linked?o(u,d):u.linked?-1:1)}]};const l=i.filter(u=>u.linked).sort(o),a=i.filter(u=>!u.linked).sort(o),c=[];return l.length&&c.push({id:"household",rows:l}),a.length&&c.push({id:"other",rows:a}),{groups:c}}const O=t=>({key:t,kind:"money"}),Fe=t=>({key:t,kind:"count"}),rn=t=>({key:t,kind:"age"}),dg=t=>"£"+String(Math.abs(Math.round(Number(t)||0))).replace(/\B(?=(\d{3})+(?!\d))/g,","),hg=(t,e)=>typeof t=="string"?t:"fixed"in t?String(t.fixed):t.kind==="money"?dg(e[t.key]):String(Math.round(Number(e[t.key])||0)),$=(t,e,n)=>({id:t,parts:e,text:e.map(r=>hg(r,n)).join("")});function re(t,e,n){const r=e?Er(e):null,s={y:n.getFullYear(),m:n.getMonth()+1},i=!!r&&Xm(r,s)>3;return{kind:t,at:e?String(e).length>7?he(e):ae(e):null,stale:i}}const B=(t,e,n,r,s={})=>({id:t,slots:s,sentence:$(t,e,n),source:r}),X=(t,e,n={})=>({id:t,place:e,slots:n}),ps=(t,e,n={})=>({id:t,href:e,slots:n});function gl(t){const{plan:e,now:n,ty:r,tyKey:s,mon:i}=t,o=wr(e),l=o.length?o[o.length-1]:null,a=!!l&&String(l.date).slice(0,7)>=i,c={},u=[],d=!!(e.decisionTool&&e.decisionTool.taxYears&&e.decisionTool.taxYears[s]&&e.decisionTool.taxYears[s].yearSetupComplete);u.push(B(d?"month.yearSetUp":"month.yearNotSetUp",[],c,re("record",null,n),{year:z(r)})),o.slice(-3).reverse().forEach((m,p)=>{c["net"+p]=M(m.monthlyNet),c["tax"+p]=M(m.monthlyTax),u.push(B("month.record",[{fixed:ae(m.date)},": ",O("net"+p)," after tax, ",O("tax"+p)," tax"],c,re("record",m.date,n),{month:ae(m.date)}))});let h;a?(c.net=M(l.monthlyNet),h=$("month.recorded",[ae(i)+" recorded: ",O("net")," after tax"],c)):h=$("month.notYet",[ae(i)+" is not recorded yet"],c);const y=[X("record","month",{month:Gt(i)})];return d||y.push(X("setUpYear","taxyear",{year:z(r)})),{done:a,result:h,figures:c,lines:u,buttons:y,notes:[],recorded:a,setUp:d}}function fg(t){const{plan:e,now:n,ss:r}=t,s={},i=[],o=[];if(!e.planDocument)return{done:!1,result:$("where.noDocument",["Not locked: nothing to read against yet"],s),figures:s,lines:i,buttons:[],notes:o};let l=null,a={ladderInDocument:!1};try{l=Um(e,{now:n}),a=il(e,{now:n})}catch{l=null}const c=kr(e);if(!l)return{done:!1,result:$("where.noReading",["The plan document could not be read"],s),figures:s,lines:i,buttons:[X("seeDocument","document")],notes:o};let u;if(l.saving){const d=l.saving;d.pathMissing||d.actual==null||d.expected==null?u=$("where.saverNone",["No pot recorded against the plan’s path yet"],s):(s.actual=M(d.actual),s.expected=M(d.expected),u=$("where.saver",[O("actual")," on "+ae(d.at),"; the plan’s middle line for then is ",O("expected")],s),i.push(B("where.saverPot",[O("actual")],s,re(d.actualSource==="holdings"?"hold":"record",d.recordedAt||d.at,n))),i.push(B("where.saverLine",[O("expected")],s,re("locked",c,n))))}else{const d=l.incomeThisYear||{recorded:0,drawn:0,planned:null};s.months=d.recorded,s.drawn=M(d.drawn);const h=[Fe("months")," month"+(d.recorded===1?"":"s")+" recorded in "+l.taxYear+": ",O("drawn")," taken before tax"];d.planned!=null&&(s.planned=M(d.planned),h.push("; the plan says ",O("planned")," for the year")),u=$("where.retired",h,s),i.push(B("where.taken",[O("drawn")],s,re("record",null,n),{year:l.taxYear})),d.planned!=null&&i.push(B("where.planned",[O("planned")],s,re("locked",c,n),{year:l.taxYear})),l.step&&l.step.amount!=null&&(s.stepNow=M(l.step.amount),i.push(B("where.step",[O("stepNow")," a year before tax"],s,re("locked",c,n),{n:String(l.step.index),of:String(l.step.of)}))),l.pot&&l.pot.actual!=null&&(s.pot=M(l.pot.actual),i.push(B("where.pot",[O("pot")],s,re(l.pot.source==="holdings"?"hold":"record",l.pot.asOf,n))),l.pot.p50!=null&&(s.potMid=M(l.pot.p50),i.push(B("where.potMid",[O("potMid")],s,re("locked",c,n)))))}return l.contract&&!a.ladderInDocument&&o.push("where.ladderNotInDocument"),l.ladder&&typeof l.ladder.monthly=="number"&&l.ladder.monthly>0&&(s.ladderMonthly=M(l.ladder.monthly),i.push(B("where.ladderMonthly",[O("ladderMonthly")," a month before tax"],s,re("locked",c,n)))),{done:!0,result:u,figures:s,lines:i,buttons:[X("seeDocument","document")],notes:o}}function pg(t,e,n){if(n&&t.planDocument&&Array.isArray(t.planDocument.steps)&&t.planDocument.steps.length)return t.planDocument.steps.map(i=>({fromAge:+i.fromAge,amount:M(i.amount),taxYear:i.taxYear||null,decline:+i.decline||0,glideToNext:!!i.glideToNext}));const r=G(e.shapeAgeNow)||null;if(e.incomeShape==="phases"&&Array.isArray(e.incomeSteps)&&e.incomeSteps.length)return e.incomeSteps.filter(i=>i&&G(i.amount)!=null).map(i=>({fromAge:+i.fromAge,amount:M(i.amount),taxYear:null,decline:+i.decline||0,glideToNext:!!i.glideToNext}));const s=Array.isArray(e.targetSchedule)&&e.targetSchedule.length?M(e.targetSchedule[0]):M(e.baseSalary);return r?[{fromAge:r,amount:s,taxYear:null,decline:0,glideToNext:!1}]:[{fromAge:null,amount:s,taxYear:null,decline:0,glideToNext:!1}]}function mg(t){const{plan:e,ss:n,ds:r,now:s,stage:i,locked:o,readonly:l}=t,a=o?e.planDocument:null,c=kr(e),u={},d=[],h=[],y=pg(e,n,o),m=y[0]||null,p=o?re("locked",c,s):re("saved",null,s),T=a&&a.timing?a.timing:null,k=T&&T.startMonth||i.startMonth||null,I=T&&T.firstTaxYear||i.firstTaxYear||null,g=ml(e,n);let f;m&&(u.yearly=m.amount),o&&m?f=i.timingMode==="future"?$("plan.lockedSaver",[O("yearly")," a year before tax from "+(ae(k)||z(I))+" (tax year "+z(I)+")"],u):$(g?"plan.lockedLadder":"plan.lockedPlan",[O("yearly")," a year before tax; your "+(g?"ladder":"plan")+" pays from "+(ae(k)||z(I))+" (tax year "+z(I)+")"],u):i.timingMode==="future"&&G(n.retireAge)?(u.retireAge=+n.retireAge,f=$("plan.saver",["Stopping work at ",rn("retireAge"),", in "+(ae(k)||z(I))],u)):m&&i.key!=="unknown"?f=$("plan.retired",["Retired. ",O("yearly")," a year before tax"],u):m?f=$("plan.noAge",[O("yearly")," a year before tax"],u):f=$("plan.nothing",["No figures yet"],u);const _=[],b=o&&T&&G(T.currentAge)!=null?T.currentAge:G(n.currentAge),v=o&&T?T.currentAgeAsOf:n.currentAgeAsOf;b!=null&&(u.ageToday=b,_.push(B("about.age",[rn("ageToday")],u,o?p:re("saved",v||null,s),{asOf:v?he(v):""})));const D=o&&T?T.mode==="retired":n.retired===!0,A=G(o&&T?T.retireAge:n.retireAge);i.timingMode==="future"&&A!=null?(u.stopAge=A,_.push(B("about.stopAt",[rn("stopAge")],u,p,{month:ae(k)}))):(D||i.timingMode==="retired")&&_.push(B("about.retired",[],u,p)),I&&_.push(B("about.firstYear",[],u,p,{year:z(I)}));const P=o&&a?a.timeline&&a.timeline.length||a.assumptions&&a.assumptions.duration||null:G(n.duration);if(P){u.years=P;const R=T&&G(T.shapeAgeNow)!=null?T.shapeAgeNow:G(n.shapeAgeNow);R!=null&&(u.ageEnd=R+P-1),_.push(B("about.runs",[Fe("years")," years"+(R!=null?", to age ":"")].concat(R!=null?[rn("ageEnd")]:[]),u,p))}const w=[];y.forEach((R,te)=>{u["step"+te]=R.amount;const we=[];R.fromAge!=null&&(u["stepAge"+te]=R.fromAge,we.push("From age ",rn("stepAge"+te),": ")),we.push(O("step"+te)," a year before tax"),R.taxYear&&we.push(" (tax year "+R.taxYear+")"),R.decline>0?we.push(", falling "+String(R.decline)+"% a year"):R.glideToNext&&te<y.length-1&&we.push(", sloping to the next step"),w.push(B("pays.step",we,u,p))}),o?h.push({id:"prices",slots:{month:ae(c)||he(c)}}):h.push({id:"pricesToday",slots:{}});const C=[],j=o&&a&&a.pots?M(a.pots.sipp):G(n.strategyParams&&n.strategyParams.sippTotal)>0?M(n.strategyParams.sippTotal):M(n.equityMin)+M(n.bondMin)+M(n.cashTarget)+M(n.diversifierStart),S=o&&a&&a.pots?M(a.pots.isa):M(n.isaBalance),E=o&&a&&a.pots?M(a.pots.gia):M(n.taxableStart);if(u.sipp=j,u.isa=S,u.gia=E,C.push(B("pots.pension",[O("sipp")],u,p)),!o)u.shares=M(n.equityMin),u.bonds=M(n.bondMin),u.cash=M(n.cashTarget),C.push(B("pots.split",[O("shares")," shares, ",O("bonds")," bonds, ",O("cash")," cash"],u,p));else if(a&&a.pots&&a.pots.allocation){const R=a.pots.allocation;u.shares=M(R.equityMin),u.bonds=M(R.bondMin),u.cash=M(R.cashTarget),C.push(B("pots.split",[O("shares")," shares, ",O("bonds")," bonds, ",O("cash")," cash"],u,p))}C.push(B("pots.isa",[O("isa")],u,p)),E>0&&C.push(B("pots.gia",[O("gia")],u,p));const x=o&&a&&a.pots?a.pots.potAtRetirement:n.potAtRetirement;x&&(G(x.sipp)>0||G(x.isa)>0)&&(u.parSipp=M(x.sipp),u.parIsa=M(x.isa),C.push(B("pots.atStop",[O("parSipp")," pension, ",O("parIsa")," ISA"],u,p)));const F=[],le=o&&a&&a.assumptions?G(a.assumptions.spWeeklyAmount):G(n.spWeeklyAmount),se=o&&a&&a.assumptions?a.assumptions.spStartDate:n.spStartDate;if(le>0)u.spWeekly=M(le),F.push(B("pots.statePension",[O("spWeekly")," a week"],u,p,{from:se?String(se):""}));else if(G(n.statePension)>0){u.spYearly=M(n.statePension);const R=I&&G(n.statePensionYear)!=null?z(I+M(n.statePensionYear)):"";F.push(B("pots.statePensionOld",[O("spYearly")," a year"],u,p,{year:R}))}else F.push(B("pots.noStatePension",[],u,p));const fe=T&&G(T.shapeAgeNow)!=null?T.shapeAgeNow:G(n.shapeAgeNow);if(G(n.dbAmount)>0){u.db=M(n.dbAmount);const R=G(n.dbStartAge)>0?M(n.dbStartAge):fe!=null&&G(n.dbStartYear)!=null?fe+M(n.dbStartYear):null,te=R!=null?"age "+String(R):G(n.dbStartYear)!=null&&I?"tax year "+z(I+M(n.dbStartYear)):"";F.push(B("pots.finalSalary",[O("db")," a year"],u,p,{from:te}))}G(n.other)>0&&(u.other=M(n.other),F.push(B("pots.other",[O("other")," a year"],u,p))),(Array.isArray(n.extraIncomes)?n.extraIncomes:[]).forEach((R,te)=>{if(!R||typeof R!="object"||!(G(R.annual)>0))return;u["stream"+te]=M(R.annual);const we=fe!=null?fe+(G(R.startYear)||0):"",Pr=R.endYear==null?null:fe!=null?fe+G(R.endYear):"";F.push(B(Pr==null?"income.streamLife":"income.stream",[O("stream"+te)," a year"],u,p,{label:R.label||"Income for some years",from:String(we),to:Pr==null?"":String(Pr)}))}),(Array.isArray(n.windfalls)?n.windfalls:[]).forEach((R,te)=>{!R||typeof R!="object"||!(G(R.amount)>0)||R.year==null||(u["lump"+te]=M(R.amount),F.push(B("income.lump",[O("lump"+te)],u,p,{label:R.label||"Lump sum",age:fe!=null?String(fe+G(R.year)):"",what:["cash","pension","isa"].includes(R.wrapper)?R.wrapper:"cash"})))});const K=[],ee=pl(e,n);K.push(B("way.strategy",[],u,p,{strategy:ee}));const ie=o&&a&&a.strategy&&a.strategy.params||n.strategyParams||{};for(const[R,te]of Object.entries(ie))G(te)!=null&&(u["dial."+R]=G(te),K.push(B("way.dial",[R==="cashYears"||R==="years"||/Years$|Age$/.test(R)?Fe("dial."+R):O("dial."+R)],u,p,{dial:R})));!o&&n.allocMode&&K.push(B("way.allocMode",[],u,p,{mode:String(n.allocMode)}));const Ze=io(n,r,e),_e=io(n,r,e,{all:!0}),tn=[{id:"about",lines:_,place:"about",sub:"about",href:"#/plan/"+e.id+"/about"},{id:"pays",lines:w,place:"spend"},{id:"pots",lines:C,place:"pots"},{id:"income",lines:F,place:"pots",sub:"income",href:"#/plan/"+e.id+"/income"},{id:"way",lines:K,place:"way"}],nn=[];o?nn.push(X("openDocument","document"),X("testLocked","test")):l||nn.push(X("testPlan","test"));const Pt=Array.isArray(e.journey)?e.journey.filter(R=>R&&R.stage).map(R=>({stage:R.stage,on:he(R.at),arrival:/arrival/i.test(String(R.note||""))})):[],N=Array.isArray(e.planDocumentArchive)?e.planDocumentArchive.length:0;return{done:i.key!=="unknown",result:f,figures:u,lines:d,buttons:nn,notes:h,sections:tn,options:Ze,allOptions:_e,journey:Pt,pastVersions:N,lockedOn:o?he(c):null}}function yl(t){const{plan:e,now:n,mon:r}=t,s={},i=[],o=Array.isArray(e.accumulationTool&&e.accumulationTool.history)?e.accumulationTool.history:[],l=rl({accHistory:o,today:n}),a=l.source==="record"&&String(l.at)>=r;let c;if(l.source==="record"){s.pension=M(l.pension),l.isa!=null&&(s.isa=M(l.isa));const u=[O("pension")," pension"].concat(l.isa!=null?[", ",O("isa")," ISA"]:[]);i.push(B("pot.latest",u,s,re("record",l.recordedAt||l.at,n),{month:ae(l.at)})),c=a?$("pot.recorded",[O("pension")," recorded for "+ae(r)],s):$("pot.notYet",[Gt(r)+"’s pot is not recorded yet"],s)}else c=$("pot.notYet",[Gt(r)+"’s pot is not recorded yet"],s);return{done:a,result:c,figures:s,lines:i,buttons:[X("recordPot","potRecord")],notes:[],recorded:a}}function gg(t){const{plan:e,now:n}=t,r=e.accumulationTool&&e.accumulationTool.settings||{},s={},i=[],o=M(r.netMonthly),l=M(r.employerMonthly),a=M(r.isaMonthly),c=G(r.escalationPct),u=o>0||l>0||a>0;let d;if(u){s.you=o,s.employer=l;const h=[O("you")," a month from you, ",O("employer")," from your employer"];a>0&&(s.isaMonthly=a,h.push(", ",O("isaMonthly")," into ISAs and savings")),d=$("saving.payIn",h,s),i.push(B("saving.you",[O("you")," a month"],s,re("saved",null,n))),i.push(B("saving.employer",[O("employer")," a month"],s,re("saved",null,n))),a>0&&i.push(B("saving.isa",[O("isaMonthly")," a month"],s,re("saved",null,n))),c>0&&(s.rise=c,i.push(B("saving.rise",[Fe("rise"),"% a year"],s,re("saved",null,n))))}else d=$("saving.none",["Nothing paid in"],s);return{done:u,result:d,figures:s,lines:i,buttons:[X("changeSaving","saving"),X("onCourse","onCourse")],notes:["saving.notFrozen"]}}function yg(t){const{plan:e,now:n}=t,r=e.budgetTool&&e.budgetTool.settings||{},s=r.derived||{},i={},o=[],l=M(s.allInComfortableMonthly||s.comfortableMonthlyNet),a=M(s.essentialMonthlyNet),c=Array.isArray(r.lines)?r.lines.filter(h=>h&&G(h.amount)>0).length:0,u=l>0&&c>0;let d;return u?(i.total=l,i.essentials=a,d=$("budget.total",[O("total")," a month after tax, ",O("essentials")," of it essentials. A guide only"],i),o.push(B("budget.totalLine",[O("total")," a month after tax"],i,re("budget",null,n))),o.push(B("budget.essentialsLine",[O("essentials")," a month after tax"],i,re("budget",null,n)))):d=$("budget.none",["Not worked out. A guide only"],i),{done:u,result:d,figures:i,lines:o,buttons:[X("changeBudget","budget")],notes:["budget.guide"]}}function _g(t){const e=["lock.what"];return ol.includes(t.stage.key)&&e.push("lock.saver"),{done:!1,result:$("lock.notLocked",["Not locked"],{}),figures:{},lines:[],buttons:[X("lockIt","lock")],notes:e}}function Tg(t){const{plan:e,now:n}=t,r=Xt(e.holdings),s=up(r),i={},o=[],l=s.count>0;let a;if(l){i.pension=M(s.byWrapper.SIPP),i.isa=M(s.byWrapper.ISA);const c=re("hold",r.updatedAt||null,n),u=["Pension ",O("pension"),", ISA ",O("isa")];s.byWrapper.GIA>0&&(i.gia=M(s.byWrapper.GIA),u.push(", other account ",O("gia"))),s.byWrapper.CASH>0&&(i.cash=M(s.byWrapper.CASH),u.push(", cash ",O("cash"))),u.push(r.updatedAt?". Updated "+he(r.updatedAt):""),a=$("hold.summary",u,i),i.lines=s.count,i.total=M(s.total),o.push(B("hold.total",[O("total")," across ",Fe("lines")," line"+(s.count===1?"":"s")],i,c))}else a=$("hold.none",["Not recorded yet"],i);return{done:l,result:a,figures:i,lines:o,buttons:[X("changeHold","hold")],notes:[]}}function bg(t){const{plan:e,now:n}=t,r={},s=[];let i=null;try{i=Gm(e,{now:n})}catch{i=null}let o,l=!1;if(!i||!i.target||i.target.kind==="none")o=$("move.notSet",["Set when the plan is locked"],r);else if(i.diff.complete)o=$("move.done",["Done"],r),l=!0;else if(i.target.kind==="ladder"){const a=i.target.lines.length,c=i.diff.hold.filter(u=>Array.isArray(u.taxYears)).length;r.bought=c,r.rungs=a,o=$("move.gilts",[Fe("bought")," of ",Fe("rungs")," gilts bought"],r)}else r.movesDone=i.prog.doneCount,r.moves=i.prog.total,o=$("move.moves",[Fe("movesDone")," of ",Fe("moves")," moves done"],r);return i&&i.diff&&typeof i.diff.progressPct=="number"&&(r.heldPct=i.diff.progressPct,s.push(B("move.held",[Fe("heldPct"),"% of the plan’s mix held"],r,re("hold",Xt(e.holdings).updatedAt||null,n)))),{done:l,result:o,figures:r,lines:s,buttons:[X("openMove","move")],notes:["move.optional"]}}function vg(t){const{plan:e,entries:n,now:r}=t,s=Qs(n,e),i={},o=[],l=[],a=fs(e),c=!!a&&!n.some(d=>d.plan.id===a);let u;if(s.length){const d=s[0],h=lr(d.plan,r),y=ar(h,d.plan,cr(d.plan,r));u=$("household.with",["With ‘"+pn(d.plan)+"’"],i);for(const p of s){const T=lr(p.plan,r);o.push({id:"household.partner",slots:{name:pn(p.plan)},sentence:$("household.partner",[],i),source:re("saved",null,r),theirLine:ar(T,p.plan,cr(p.plan,r)),theirId:String(p.plan.id)}),l.push(ps("openPartner","#/plan/"+p.plan.id,{name:pn(p.plan)}))}const m=a&&s.some(p=>p.plan.id===a)?String(e.id):String(s[0].plan.id);return l.push({...X("checkTogether","household"),planId:m}),{done:!0,result:u,figures:i,lines:o,buttons:l,notes:[],theirLine:y}}return c?{done:!1,result:$("household.notInAccount",["Your partner’s plan is not in this account"],i),figures:i,lines:o,buttons:[X("linkOne","household")],notes:[]}:{done:!1,result:$("household.none",["No partner’s plan is linked"],i),figures:i,lines:o,buttons:[X("linkOne","household")],notes:[]}}const Ag={month:gl,where:fg,plan:mg,pot:yl,saving:gg,budget:yg,lock:_g,hold:Tg,move:bg,household:vg};function Sg(t,e){const{stage:n,readonly:r,plan:s,ss:i,locked:o,mon:l,ty:a,tyKey:c,now:u}=t,d=n.key,h=d==="bridge"||d==="running",y=e.month,m=e.pot,p=wr(s),T=p.length?String(p[p.length-1].date).slice(0,7):null,k=Array.isArray(s.journey)&&s.journey.some(E=>E&&/arrival/i.test(String(E.note||""))),I=n.startMonth||null,g=n.hasRecords;let f=null;try{f=["saving","approaching","draft-retired","unknown"].includes(d)?Bp(i,{locked:o,hasRecords:g,now:u}):null}catch{f=null}const _=y?y.setUp:!!(s.decisionTool&&s.decisionTool.taxYears&&s.decisionTool.taxYears[c]&&s.decisionTool.taxYears[c].yearSetupComplete),b=y?y.recorded:!!T&&T>=l,v=m?m.recorded:!1,D=o?null:lg(s,i),A={"P.readonly":()=>r,"P.noAge":()=>d==="unknown","P.arrive":()=>d==="running"&&n.timingMode==="future"&&!!I&&!(T&&T>=I)&&!k,"P.taxyear":()=>h&&!_,"P.month":()=>h&&!b,"P.idle":()=>h,"P.pot":()=>d==="committed-saving"&&!v,"P.working":()=>d==="committed-saving","P.recheck":()=>!!D,"P.stale":()=>!!f,"P.draft":()=>d==="draft-retired","P.approaching":()=>d==="approaching","P.saving":()=>d==="saving"},P=jm.find(E=>A[E]()),w=(()=>{const E=Er(l),x=E.m===12?{y:E.y+1,m:1}:{y:E.y,m:E.m+1};return On[x.m-1]})(),C={month:ae(l),monthName:Gt(l),nextMonth:w,year:z(a),stop:ae(I)||"",savedYear:f?f.savedLabel:""},j="#/plan/"+s.id+"/about",S={"P.readonly":null,"P.noAge":ps("addAge",j),"P.arrive":X("record","month",{month:Gt(l)}),"P.taxyear":X("setUpYear","taxyear",{year:z(a)}),"P.month":X("record","month",{month:Gt(l)}),"P.idle":null,"P.pot":X("recordPot","potRecord"),"P.working":X("onCourse","onCourse"),"P.recheck":X("recheck","test"),"P.stale":ps("updateIt",j),"P.draft":X("testPlan","test"),"P.approaching":X("testPlan","test"),"P.saving":X("onCourse","onCourse")};return{id:P||"P.saving",slots:C,button:P?S[P]:null,answerStale:D}}function Ig(t,e,n,{today:r,source:s="account"}={}){const i=en(r),o=(t||[]).filter(w=>w&&w.plan&&typeof w.plan=="object"&&w.plan.id!=null),l=o.find(w=>String(w.plan.id)===String(e))||null;if(!l)return{found:!1,id:String(e||"")};const a=l.plan,c=!!(l.newer||l.failed),u=lr(a,i),d=cr(a,i),h=a.decisionTool&&a.decisionTool.settings||{},y=or(a),m=Qs(o,a),p=Se(i),T={plan:a,entries:o,now:i,ss:d,ds:h,stage:u,locked:y,readonly:c,mon:Fm(i),ty:p,tyKey:Ws(p),source:s},k=al(u.key,{locked:y,linked:m.length>0,manyPlans:o.length>1}),I=k.map(w=>w.id),g=n&&$m.includes(n)?n:null,f=g||I[0],_=g&&!I.includes(g)?[...k,{id:g,optional:!0,listed:!1}]:k,b={};for(const w of _)try{b[w.id]=Ag[w.id](T)}catch(C){b[w.id]={done:!1,result:$(w.id+".failed",["Could not be read"],{}),figures:{},lines:[],buttons:[],notes:[],error:C&&C.message}}!b.month&&["bridge","running"].includes(u.key)&&(b.month=gl(T)),!b.pot&&u.key==="committed-saving"&&(b.pot=yl(T));const v=_.map(w=>{const C=b[w.id],j=c?C.buttons.filter(S=>S.href):C.buttons;return{id:w.id,optional:!!w.optional,listed:w.listed!==!1,state:w.id===f?"current":C.done?"done":"open",...C,buttons:j}}),{answerStale:D,...A}=Sg(T,b),P=Wm(u.key,{locked:y,linked:m.length>0,manyPlans:o.length>1});return{found:!0,id:String(a.id),name:pn(a),stageKey:u.key,retired:so.includes(u.key),saver:ol.includes(u.key),line:ar(u,a,d),locked:y,lockedOn:y?he(kr(a)):null,readonly:c,source:s,steps:v,subSteps:P,current:f,answerStale:D||null,next:c?{...A,button:null}:A,askLinks:so.includes(u.key)?["c"]:["a","b"]}}const Mt=t=>!!t&&typeof t=="object"&&!Array.isArray(t),ne=t=>t==null||t===""||!Number.isFinite(+t)?null:+t,pt=t=>t==null||typeof t=="string"&&t.trim()==="",wg=t=>!!(t&&t.decisionTool&&t.decisionTool.settings&&t.decisionTool.settings.locked),po=t=>t&&t.decisionTool&&t.decisionTool.settings&&t.decisionTool.settings.lockedAt||t&&t.planDocument&&t.planDocument.lockedAt||null,mo=t=>t&&t.planDetails&&typeof t.planDetails.name=="string"&&t.planDetails.name||t&&typeof t.name=="string"&&t.name||"",go=t=>t&&t.household&&typeof t.household.partnerScenarioId=="string"&&t.household.partnerScenarioId||null,yo=t=>t===void 0?void 0:JSON.parse(JSON.stringify(t)),rt=t=>t===void 0?"<absent>":JSON.stringify(t),ur=t=>Math.round(t*100)/100,Eg=t=>[...new Set(t)],me=t=>"£"+String(Math.abs(Math.round(Number(t)||0))).replace(/\B(?=(\d{3})+(?!\d))/g,","),kg=t=>{const e=Math.abs(Number(t)||0),n=Math.floor(e+1e-9),r=Math.round((e-n)*100);return me(n)+"."+String(r).padStart(2,"0")},Pg="Final-salary pension",Rg=t=>/^\s*final[\s-]?salary(\s+pension)?\s*$/i.test(String(t??"")),_o=t=>Math.abs(+t-ct.fullStatePensionWeekly)<.005,on=(t,e)=>Math.round(+t)-Math.round(+e),At=(t,e)=>Math.round(+e)+Math.round(+t||0),Dg=(t,e)=>+t.dbStartAge>0?Math.round(+t.dbStartAge):At(+t.dbStartYear||0,e);function _l(t,e){const n=Math.floor(+t.currentAge||0);if(!(n>0))return null;const r=/^\d{4}-\d{2}-\d{2}/.test(String(t.currentAgeAsOf||""))?String(t.currentAgeAsOf).slice(0,10):e,s=xl(Cl(n,r));return Ll(r,s-n)}function Og(t,e,n){if(!(ne(t.currentAge)>0))return!1;const[r,s,i]=ct.pensionAccess.changesOn.split("-").map(Number),o=new Date(r,s-1,i);if(n.getTime()>=o.getTime())return!1;let l=n;if(e.mode==="future"&&e.startMonth){const[u,d]=String(e.startMonth).split("-").map(Number);u>0&&d>0&&(l=new Date(u,d-1,1))}if(l.getTime()>=o.getTime())return!1;let a=!1;try{a=qa(t)>0}catch{a=!1}if(a=a||ne(t.potAtRetirement&&t.potAtRetirement.sipp)>0||ne(t.strategyParams&&t.strategyParams.sippTotal)>0,!a)return!1;const c=Dn(t,o,n);return c!=null&&c>=ct.pensionAccess.before&&c<ct.pensionAccess.from}function ms(t,e,n,{dateText:r,weekly:s,now:i}){const o=r?Sr(String(r)):null;if(s>0&&o){const a=Pp({...t,spStartDate:r,spWeeklyAmount:s,firstTaxYear:e.firstTaxYear,shapeAgeNow:n},i),c=Se(o),u=At(a?a.spStartYear:0,n);return{kind:_o(s)?"full":"forecast",weekly:s,yearly:ur(s*52),date:String(r),dateWords:he(ll(o)),fromAge:u,taxYear:c,beforeStart:c<e.firstTaxYear,dated:!0}}if(s>0){const a=ei({...t,shapeAgeNow:n});return{kind:_o(s)?"full":"forecast",weekly:s,yearly:ur(s*52),date:null,dateWords:null,fromAge:a===999?null:At(a,n),taxYear:a===999?null:e.firstTaxYear+a,beforeStart:!1,dated:!1}}const l=ne(t.statePension)||0;if(l>0){const a=ei({...t,shapeAgeNow:n});return{kind:"assumed",weekly:null,yearly:l,date:r?String(r):null,dateWords:null,fromAge:a===999?null:At(a,n),taxYear:a===999?null:e.firstTaxYear+a,beforeStart:!1,dated:!1}}return{kind:"none",weekly:null,yearly:0,date:r?String(r):null,dateWords:null,fromAge:null,taxYear:null,beforeStart:!1,dated:!1}}function Xs(t,{today:e}){const n=en(e),r=wg(t),s=r?t.planDocument:null,i=ul(t,n),o=t&&t.stressTool&&Mt(t.stressTool.settings)?t.stressTool.settings:{};let l=qs(i,n),a=ne(i.duration)||35;if(s&&Mt(s.timing)){const f=s.timing;l={...l,mode:f.mode||l.mode,firstTaxYear:ne(f.firstTaxYear)||l.firstTaxYear,shapeAgeNow:ne(f.shapeAgeNow)||l.shapeAgeNow,startMonth:f.startMonth||l.startMonth},a=Array.isArray(s.timeline)&&s.timeline.length||ne(s.assumptions&&s.assumptions.duration)||a}const c=l.shapeAgeNow,u=c+a-1,d=r?{kind:"locked",at:he(po(t))}:{kind:"saved",at:t&&t.lastModified?he(t.lastModified):null},h=s&&Mt(s.assumptions)?s.assumptions.spStartDate||null:i.spStartDate||null,y=s&&Mt(s.assumptions)?ne(s.assumptions.spWeeklyAmount)||0:ne(i.spWeeklyAmount)||0,m=ms(i,l,c,{dateText:h,weekly:y,now:n}),p=Array.isArray(o.extraIncomes)?o.extraIncomes:Array.isArray(i.extraIncomes)?i.extraIncomes:[],T=Array.isArray(o.windfalls)?o.windfalls:Array.isArray(i.windfalls)?i.windfalls:[],k=[],I=[],g=[];return ne(i.dbAmount)>0&&k.push({id:"0",amount:ne(i.dbAmount),fromAge:Dg(i,c),rises:Zs.includes(i.dbIndexation)?i.dbIndexation:"lpi5",from:"db",row:null}),p.forEach((f,_)=>{if(!Mt(f)||!(ne(f.annual)>0))return;const b={amount:ne(f.annual),fromAge:At(ne(f.startYear)||0,c),rises:Zs.includes(f.indexation)?f.indexation:"lpi5",from:"row",row:_};f.endYear==null&&Rg(f.label)?k.push({...b,id:String(k.length)}):I.push({...b,id:String(I.length),label:typeof f.label=="string"?f.label:"",toAge:f.endYear==null?null:At(ne(f.endYear)||0,c)})}),T.forEach((f,_)=>{!Mt(f)||!(ne(f.amount)>0)||ne(f.year)==null||g.push({id:String(g.length),label:typeof f.label=="string"?f.label:"",amount:ne(f.amount),atAge:At(ne(f.year),c),wrapper:Ol.includes(f.wrapper)?f.wrapper:"cash",from:"row",row:_})}),{locked:r,lockedOn:r?he(po(t)):null,ss:i,stored:o,timing:l,duration:a,ageNow:c,endAge:u,source:d,sp:m,fs:k,other:ne(i.other)||0,streams:I,lumps:g,rows:p,wrows:T,note2028:Og(i,l,n)}}function Tl(t,{today:e}){const n=Xs(t,{today:e}),r={spKind:n.sp.kind};n.sp.weekly!=null&&(r.spWeekly=String(n.sp.weekly)),n.other>0&&(r.other=String(n.other));for(const s of ys){r[s+".ids"]=n[s].map(i=>i.id).join(",");for(const i of n[s])for(const o of jr[s].fields){const l=i[o.path];l==null||l===""||(r[`${s}.${i.id}.${o.path}`]=String(l))}}return r}const To=t=>Ro.find(e=>e.path===t);function Mg(t,e){if(pt(t))return{error:e.required?"required":null,value:null};const n=String(t).trim();if(!/^\d{1,3}$/.test(n))return{error:"notANumber",value:null};const r=+n;return r<e.min?{error:"tooLow",value:r}:r>e.max?{error:"tooHigh",value:r}:{error:null,value:r}}function gs(t,e){if(pt(t))return{error:e.required?"required":null,value:null};const n=String(t).replace(/[£,\s]/g,"");if(!/^\d{1,9}(\.\d{1,2})?$/.test(n))return{error:"notANumber",value:null};const r=ur(+n);return r<e.min?{error:"tooLow",value:r}:r>e.max?{error:"tooHigh",value:r}:{error:null,value:r}}function Ng(t,e){if(e.type==="age")return Mg(t,e);if(e.type==="money")return gs(t,e);if(e.type==="choice"){const r=pt(t)?e.default:String(t);return e.options.includes(r)?{error:null,value:r}:{error:"notAnOption",value:null}}const n=pt(t)?"":String(t).trim();return e.max&&n.length>e.max?{error:"tooLong",value:null}:{error:null,value:n}}function xg(t){return t.sp.kind==="assumed"?["full","forecast","none","assumed"]:["full","forecast","none"]}function bl(t,e,{today:n}){const r=en(n),s=Xs(t,{today:n}),i={...Tl(t,{today:n}),...e||{}},o={},l={},a={spKind:!0,spWeekly:!1,other:!0},c=xg(s),u=pt(i.spKind)?null:String(i.spKind);if(u?c.includes(u)?o.spKind=u:l.spKind="notAnOption":l.spKind="required",a.spWeekly=u==="forecast",a.spWeekly){const m=gs(i.spWeekly,To("spWeekly"));m.error?l.spWeekly=m.error:o.spWeekly=m.value}else u==="full"&&(o.spWeekly=ct.fullStatePensionWeekly);{const m=gs(i.other,To("other"));m.error?l.other=m.error:o.other=m.value==null?0:m.value}const d={};for(const m of ys){const p=i[m+".ids"],T=Eg((pt(p)?[]:String(p).split(",")).map(I=>I.trim()).filter(I=>Ml(I))),k=T.map(I=>{const g=s[m].find(v=>v.id===I)||null,f={id:I,saved:g,values:{},fields:[]};for(const v of jr[m].fields){const D=`${m}.${I}.${v.path}`,A=i[D],P=Ng(A,v);f.fields.push({path:D,type:v.type,options:v.options||null,applies:!0,shown:pt(A)?v.type==="choice"?v.default:"":String(A),saved:g&&g[v.path]!=null&&g[v.path]!==""?String(g[v.path]):null,error:P.error}),P.error?l[D]=P.error:f.values[v.path]=P.value}const _=f.values,b=(v,D)=>{l[`${m}.${I}.${v}`]=D;const A=f.fields.find(P=>P.path===`${m}.${I}.${v}`);A&&(A.error=D),delete _[v]};return m==="fs"&&_.fromAge!=null&&_.fromAge>s.endAge&&b("fromAge","afterEnd"),m==="streams"&&_.fromAge!=null&&_.fromAge>s.endAge&&b("fromAge","afterEnd"),m==="streams"&&_.fromAge!=null&&_.toAge!=null&&_.toAge<_.fromAge&&b("toAge","beforeFrom"),m==="lumps"&&_.atAge!=null&&_.atAge<s.ageNow&&b("atAge","beforeStart"),m==="lumps"&&_.atAge!=null&&_.atAge>s.endAge&&b("atAge","afterEnd"),f.ok=jr[m].fields.every(v=>!l[`${m}.${I}.${v.path}`]),f});d[m]={ids:T,cards:k}}let h=s.sp;return u==="none"?(h=ms(s.ss,s.timing,s.ageNow,{dateText:s.sp.date,weekly:0,now:r}),h={...h,kind:"none",yearly:0}):(u==="full"||u==="forecast")&&o.spWeekly!=null&&(h=ms(s.ss,s.timing,s.ageNow,{dateText:s.sp.date||_l(s.ss,n),weekly:o.spWeekly,now:r})),{ok:Object.keys(l).length===0,values:o,lists:d,errors:l,applies:a,offered:c,saved:s,sp:h}}const Cg={fs:["amount","fromAge","rises"],streams:["label","amount","fromAge","toAge","rises"],lumps:["label","amount","atAge","wrapper"]},vl=(t,e,n)=>!!e&&Cg[n].every(r=>rt(t.values[r]==null?null:t.values[r])===rt(e[r]==null?null:e[r]));function bo(t,e,n,r){const s=e.values;return t==="lumps"?{...n||{},label:s.label||"",amount:s.amount,year:on(s.atAge,r),wrapper:s.wrapper}:t==="fs"?{...n||{},label:n&&typeof n.label=="string"&&n.label?n.label:Pg,annual:s.amount,startYear:on(s.fromAge,r),endYear:null,indexation:s.rises}:{...n||{},label:s.label||"",annual:s.amount,startYear:on(s.fromAge,r),endYear:s.toAge==null?null:on(s.toAge,r),indexation:s.rises}}function vo(t,e){const n=e.map(s=>({slots:s.slots,k:0,seq:s.placed.map(({card:i,L:o,ageNow:l})=>{const a=i.saved;return a&&a.from==="row"?vl(i,a,o)?t[a.row]:bo(o,i,t[a.row],l):bo(o,i,null,l)})})),r=[];t.forEach((s,i)=>{const o=n.find(l=>l.slots.has(i));o?o.k<o.seq.length&&r.push(o.seq[o.k++]):r.push(s)});for(const s of n)r.push(...s.seq.slice(s.k));return r}function Al(t,e,{today:n}){const r=bl(t,e,{today:n});if(!r.ok)return{ok:!1,errors:r.errors,patch:{},previous:{}};if(r.saved.locked)return{ok:!1,errors:{plan:"locked"},patch:{},previous:{}};const s=r.saved,i=s.ageNow,o={},l=r.values.spKind;if(l!=="assumed"&&(l!==s.sp.kind||l==="forecast"&&r.values.spWeekly!==s.sp.weekly)){if(l==="none")o.spWeeklyAmount=0,o.statePension=0;else if(o.spWeeklyAmount=r.values.spWeekly,o.statePension=ur(r.values.spWeekly*52),!s.sp.date){const p=_l(s.ss,n);p&&(o.spStartDate=p)}}r.values.other!==(ne(s.ss.other)||0)&&(o.other=r.values.other);const c=r.lists.fs.cards,u=c[0]||null;u?u.saved&&u.saved.from==="db"&&vl(u,u.saved,"fs")||(o.dbAmount=u.values.amount,o.dbStartYear=on(u.values.fromAge,i),o.dbStartAge=u.values.fromAge,o.dbIndexation=u.values.rises):ne(s.ss.dbAmount)>0&&(o.dbAmount=0);const d=vo(s.rows,[{slots:new Set(s.fs.filter(p=>p.from==="row").map(p=>p.row)),placed:c.slice(1).map(p=>({card:p,L:"fs",ageNow:i}))},{slots:new Set(s.streams.map(p=>p.row)),placed:r.lists.streams.cards.map(p=>({card:p,L:"streams",ageNow:i}))}]);rt(d)!==rt(s.rows)&&(o.extraIncomes=d);const h=vo(s.wrows,[{slots:new Set(s.lumps.map(p=>p.row)),placed:r.lists.lumps.cards.map(p=>({card:p,L:"lumps",ageNow:i}))}]);rt(h)!==rt(s.wrows)&&(o.windfalls=h);const y={},m={};for(const p of Nl){const T=p.split(".").pop();if(!(T in o))continue;const k=cl(t,p),I=o[T];rt(k)!==rt(I)&&(k===void 0&&(I===null||I===0)||(y[p]=yo(I),m[p]=yo(k)))}return{ok:!0,errors:{},patch:y,previous:m}}const Ao=(t,e,n)=>z(t.firstTaxYear+(n-e)),Lg=t=>t===1?"1 year":String(t)+" years";function Vg(t){const{sp:e,fs:n,other:r,streams:s,lumps:i,ageNow:o,timing:l}=t,a=[];e.kind==="none"?a.push({id:"sp.none",slots:{}}):e.kind==="assumed"?a.push({id:e.fromAge!=null?"sp.assumed":"sp.assumedNoAge",slots:{yearly:me(e.yearly),age:e.fromAge}}):e.beforeStart?a.push({id:"sp.before",slots:{yearly:me(e.yearly),date:e.dateWords}}):e.fromAge!=null?a.push({id:e.dated?"sp.paid":"sp.noDate",slots:{yearly:me(e.yearly),age:e.fromAge,year:z(e.taxYear)}}):a.push({id:"sp.noDateNoAge",slots:{yearly:me(e.yearly)}}),n.forEach((c,u)=>{c.fromAge<o?a.push({id:"fs.before",slots:{n:u+1,amount:me(c.amount),age:c.fromAge,ageNow:o,rises:c.rises}}):a.push({id:"fs.line",slots:{n:u+1,amount:me(c.amount),age:c.fromAge,year:Ao(l,o,c.fromAge),rises:c.rises}})}),r>0&&a.push({id:"other.line",slots:{amount:me(r)}});for(const c of s){const u=c.label||"Income for some years";c.toAge==null?a.push({id:"stream.life",slots:{label:u,amount:me(c.amount),from:c.fromAge,rises:c.rises}}):a.push({id:"stream.line",slots:{label:u,amount:me(c.amount),from:c.fromAge,to:c.toAge,years:Lg(c.toAge-c.fromAge+1),rises:c.rises}})}for(const c of i)a.push({id:"lump.line",slots:{label:c.label||"Lump sum",amount:me(c.amount),age:c.atAge,year:Ao(l,o,c.atAge),what:c.wrapper}});return t.note2028&&a.push({id:"drawdown2028",slots:{from:ct.pensionAccess.from,day:"5 April "+ct.pensionAccess.changesOn.slice(0,4)}}),a}function Bg(t){return[]}function Fg(t){const e=t.saved,n=r=>t.lists[r].cards.filter(s=>s.ok).map(s=>({...s.values}));return{sp:t.sp,fs:n("fs"),other:t.values.other==null?e.other:t.values.other,streams:n("streams"),lumps:n("lumps"),ageNow:e.ageNow,timing:e.timing,note2028:e.note2028}}function Ug(t,e,{today:n,typed:r=null}={}){const s=(t||[]).filter(f=>f&&f.plan&&typeof f.plan=="object"&&f.plan.id!=null),i=s.find(f=>String(f.plan.id)===String(e))||null;if(!i)return{found:!1,id:String(e||"")};const o=i.plan,l=!!(i.newer||i.failed),a=Xs(o,{today:n}),c=!a.locked&&!l,u=Tl(o,{today:n}),d=bl(o,r||{},{today:n}),h={...u,...r||{}},y=Ro.map(f=>({path:f.path,type:f.type,options:f.type==="choice"?f.path==="spKind"?d.offered:f.options:null,applies:d.applies[f.path]!==!1,shown:pt(h[f.path])?"":String(h[f.path]),saved:f.path in u?u[f.path]:null,error:d.errors[f.path]||null})),m={};for(const f of ys)m[f]={ids:d.lists[f].ids,cards:d.lists[f].cards.map(_=>({id:_.id,saved:!!_.saved,fields:_.fields}))};const p=Fg(d),T=Vg(p);o.planDocument&&o.planDocument.strategy&&o.planDocument.strategy.id||a.ss.strategyId;const k=s.filter(f=>f.plan.id!==o.id&&(f.plan.id===go(o)||go(f.plan)===o.id)).map(f=>({id:String(f.plan.id),name:mo(f.plan)})),I=c&&d.ok?Al(o,r||{},{today:n}):{patch:{},previous:{}},g=p.sp.kind==="none"?{sp:"none"}:p.sp.kind==="assumed"?{sp:"assumed",yearly:me(p.sp.yearly),age:p.sp.fromAge}:p.sp.fromAge!=null?{sp:"paid",yearly:me(p.sp.yearly),age:p.sp.fromAge}:{sp:"paidNoAge",yearly:me(p.sp.yearly)};return{found:!0,id:String(o.id),name:mo(o),locked:a.locked,lockedOn:a.lockedOn,readonly:l,editable:c,source:a.source,ageNow:a.ageNow,endAge:a.endAge,fullYearly:me(ct.fullStatePensionWeekly*52),spSaved:{kind:a.sp.kind,weekly:a.sp.weekly==null?null:kg(a.sp.weekly),yearly:me(a.sp.yearly),age:a.sp.fromAge,dateWords:a.sp.dateWords},assumed:a.sp.kind==="assumed"?{yearly:me(a.sp.yearly),age:a.sp.fromAge}:null,fields:y,lists:m,errors:d.errors,ok:d.ok,derived:T,notUsed:Bg(),partners:k,changed:Object.keys(I.patch).length>0,patch:I.patch,previous:I.previous,savedLine:d.ok?{id:"income",slots:{...g,fs:p.fs.length,streams:p.streams.length,lumps:p.lumps.length}}:null}}const Yr="pt_guest_scenarios",Gg=15e3,Yg=new Set(Vl);function So(t){for(const e of Object.keys(t))if(!Yg.has(e))throw new Error('planWrite: "'+e+'" is not a declared field path');return t}function $g(t,{win:e=null,session:n=null,local:r=null,now:s=()=>new Date,fb:i=null,handles:o}){const l=i||{doc:Lf,updateDoc:Jf};let a=!1,c=!1,u=null;const d=_=>{a||t.dispatch(_)},h=(_,b)=>d({type:Q.PLAN_SAVE_FAILED,planId:_,problem:b}),y=_=>{!e||typeof e.setTimeout!="function"||(u&&e.clearTimeout(u),u=e.setTimeout(()=>{u=null,_()},Gg))};function m(_,b){const v=_.plans,D=v&&Array.isArray(v.list)?v.list.find(P=>P&&P.plan&&String(P.plan.id)===String(b)):null;if(!D)return{problem:"notHere"};if(D.newer||D.failed)return{problem:"readonly"};const A=o()||{};return _.session.kind==="in"&&A.user&&A.db&&v.source==="account"?{kind:"account",entry:D,db:A.db,uid:A.user.uid,reread:A.reread}:_.session.kind==="nobody"&&v.source==="window"?za(Ha(r))?{problem:"usedUp"}:{kind:"window",entry:D}:{problem:"nobody"}}function p(_,b){return Ht(_&&_.decisionTool&&_.decisionTool.settings)?!0:!!Jp(_,b,ss())}async function T(_,b,v){if(_.kind==="account")return await l.updateDoc(l.doc(_.db,"users",_.uid,"scenarios",String(b)),v),!0;let D=null;try{D=n?n.getItem(Yr):null}catch{return!1}let A=null;try{A=JSON.parse(D)}catch{A=null}if(!Array.isArray(A))return!1;const P=A.findIndex(C=>C&&String(C.id)===String(b));if(P<0)return!1;A[P]=og(A[P],v);const w=JSON.stringify(A);try{return n.setItem(Yr,w),n.getItem(Yr)===w}catch{return!1}}function k(_){const b=_.route,v=b&&b.screen==="plan"&&b.step==="income"?"income":"about";return{step:v,patchOf:v==="income"?Al:fl}}async function I(_){let b=t.getState();const{step:v,patchOf:D}=k(b);let A=m(b,_);if(A.problem){h(_,A.problem);return}if(A.kind==="account"){try{await A.reread()}catch{}if(a)return;if(b=t.getState(),A=m(b,_),A.problem){h(_,A.problem);return}}const P=A.entry.plan,w=b.draft.plan&&b.draft.plan.id===String(_)?b.draft.plan:null,C=w?w.values:{};if(Ht(P.decisionTool&&P.decisionTool.settings)){h(_,"locked");return}const j=D(P,C,{today:b.env.today});if(!j.ok){h(_,j.errors.plan==="locked"?"locked":"problems");return}const S=b.plans.view&&b.plans.view.page&&b.plans.view.page[v]&&b.plans.view.page.forId===String(_)?b.plans.view.page[v]:null,E=S&&S.savedLine?S.savedLine:null;if(!Object.keys(j.patch).length){d({type:Q.PLAN_SAVED,planId:_,previous:{},line:E}),y(()=>d({type:Q.PLAN_TOAST_CLOSE}));return}const x=So({...j.patch,lastModified:s().toISOString()});if(p(P,x)){h(_,"locked");return}let F=!1;try{F=await T(A,_,x)}catch{F=!1}if(!a){if(!F){h(_,A.kind==="window"?"storage":"failed");return}d({type:Q.PLAN_SAVED,planId:_,previous:{...j.previous,lastModified:P.lastModified},line:E}),d({type:Q.PLANS_READING}),y(()=>d({type:Q.PLAN_TOAST_CLOSE}))}}async function g(_,b){const v=t.getState(),D=m(v,_);if(D.problem){h(_,D.problem);return}const A=D.entry.plan,P={};for(const[j,S]of Object.entries(b||{}))P[j]=S===void 0&&D.kind==="account"?null:S;(!("lastModified"in P)||P.lastModified==null)&&(P.lastModified=s().toISOString());const w=So(P);if(p(A,Object.fromEntries(Object.entries(w).map(([j,S])=>[j,S===void 0?null:S])))){h(_,"locked");return}let C=!1;try{C=await T(D,_,w)}catch{C=!1}if(!a){if(!C){h(_,D.kind==="window"?"storage":"failed");return}d({type:Q.PLAN_UNDO_DONE,planId:_}),d({type:Q.PLANS_READING}),y(()=>d({type:Q.PLAN_TOAST_CLOSE}))}}const f=t.subscribe((_,b)=>{if(c)return;const v=_.ui.saving;v&&(b.type===Q.PLAN_SAVE&&v.kind==="save"?(c=!0,I(v.planId).catch(()=>h(v.planId,"failed")).finally(()=>{c=!1})):b.type===Q.PLAN_UNDO&&v.kind==="undo"&&(c=!0,g(v.planId,v.previous).catch(()=>h(v.planId,"failed")).finally(()=>{c=!1})))});return()=>{a=!0,f(),u&&e&&e.clearTimeout(u)}}const jg="pt_guest_scenarios",Kg="pt-preview",Wg=60*1e3;function Io(t,e){const n=[];for(const r of t){if(!r||typeof r!="object"||r.id==null)continue;let s;try{s=Sp(r,{now:e})}catch(i){s={scenario:r,newer:!1,error:i}}n.push({plan:s.scenario&&typeof s.scenario=="object"?s.scenario:r,newer:!!s.newer,failed:!!s.error})}return n}function Hg(t){if(!t)return[];let e=null;try{e=t.getItem(jg)}catch{return[]}if(!e)return[];try{const n=JSON.parse(e);return Array.isArray(n)?n:[]}catch{return[]}}const wo=t=>String(t.getHours()).padStart(2,"0")+":"+String(t.getMinutes()).padStart(2,"0");function zg(t){const e=t.plans;if(!e||e.status!=="read")return null;const n=t.env.today,r=ug(e.list,{today:n,source:e.source}).groups,s=t.route;let i=null;if(s&&s.screen==="plan"&&s.planId&&(i={...Ig(e.list,s.planId,s.step,{today:n,source:e.source}),forId:s.planId,forStep:s.step||null},s.step==="about"||s.step==="income")){const o=t.draft&&t.draft.plan&&t.draft.plan.id===s.planId?t.draft.plan:null,l=o?o.values:{},a=s.step==="about"?cg:Ug;i[s.step]={...a(e.list,s.planId,{today:n,typed:l}),draftKey:JSON.stringify(l)}}return{today:n,rows:r,page:i}}function ty(t,{win:e,local:n=null,session:r=null,now:s=()=>new Date,fb:i=null,fbWrite:o=null}){const l=i||{initializeApp:Bo,getAuth:Ah,setPersistence:ld,browserLocalPersistence:ha,onAuthStateChanged:dd,signOut:hd,getFirestore:Nf,collection:Cf,getDocs:qf,isFirebaseConfigured:Qf},a=[];let c,u=!1;const d=A=>{u||t.dispatch(A)};d({type:Q.SESSION_SET,session:{kind:"checking",email:null}});function h(){const A=Io(Hg(r),s());d({type:Q.PLANS_SET,list:A,source:"window",readAt:wo(s()),usedUp:za(Ha(n))})}let y=null,m=null;if(!l.isFirebaseConfigured())c=null,d({type:Q.SESSION_SET,session:{kind:"nobody",email:null}}),h();else{const A=l.initializeApp(Ya,Kg);y=l.getAuth(A),Promise.resolve(l.setPersistence(y,l.browserLocalPersistence)).catch(()=>{}),m=l.getFirestore(A)}async function p(){if(!c||!m)return;const A=c.uid;try{const P=await l.getDocs(l.collection(m,"users",A,"scenarios")),w=[];if(P.forEach(C=>{w.push({id:C.id,...C.data()})}),u||!c||c.uid!==A)return;d({type:Q.PLANS_SET,list:Io(w,s()),source:"account",readAt:wo(s())})}catch{u||d({type:Q.PLANS_FAILED})}}function T(){c!==void 0&&(c===null?h():c.emailVerified&&p())}function k(){try{n&&n.removeItem(Ul)}catch{}try{r&&r.removeItem(Gl)}catch{}}async function I(){k(),d({type:Q.PLANS_CLEAR});try{y&&await l.signOut(y)}catch{}!u&&c&&(c=null,d({type:Q.SESSION_SET,session:{kind:"nobody",email:null}}),h())}if(y){const A=l.onAuthStateChanged(y,P=>{if(u)return;const w=c;c=P||null,P?P.emailVerified?(d({type:Q.SESSION_SET,session:{kind:"in",email:P.email||null}}),p()):d({type:Q.SESSION_SET,session:{kind:"unverified",email:P.email||null}}):(d({type:Q.SESSION_SET,session:{kind:"nobody",email:null}}),w&&k(),h())});a.push(()=>{try{A()}catch{}})}let g=null;const f=A=>{const P=A.plans&&A.plans.status==="read"?[A.plans.list,A.route,A.env.today,A.draft&&A.draft.plan]:null;if(!P){g=null;return}if(g&&P.every((C,j)=>C===g[j]))return;g=P;let w=null;try{w=zg(A)}catch{w={today:A.env.today,rows:[],page:null}}w&&d({type:Q.PLANS_VIEW,view:w})};f(t.getState()),a.push($g(t,{win:e,session:r,local:n,now:s,fb:o,handles:()=>({db:m,user:c||null,reread:()=>c&&m?p():Promise.resolve()})})),a.push(t.subscribe((A,P)=>{P.type===Q.PLANS_READING&&T(),P.type===Q.SESSION_OUT&&A.session.signingOut&&I(),f(A)}));const _=()=>d({type:Q.PLANS_CLEAR}),b=A=>{A&&A.persisted&&(c!==void 0&&d({type:Q.SESSION_SET,session:c?{kind:c.emailVerified?"in":"unverified",email:c.email||null}:{kind:"nobody",email:null}}),T())},v=()=>{e.document&&e.document.visibilityState==="visible"&&t.getState().plans===null&&T()};e.addEventListener("pagehide",_),e.addEventListener("pageshow",b),e.document&&e.document.addEventListener("visibilitychange",v),a.push(()=>{e.removeEventListener("pagehide",_),e.removeEventListener("pageshow",b),e.document&&e.document.removeEventListener("visibilitychange",v)});const D=e.setInterval(()=>{if(!c||!n)return;const A=Bl(n);A&&s().getTime()-A>Fl&&I()},Wg);return a.push(()=>e.clearInterval(D)),()=>{u=!0,a.splice(0).forEach(A=>A())}}export{Kg as APP_NAME,jg as GUEST_PLANS_KEY,ty as startPlanSource,Io as upgradedList,zg as viewFor,Hg as windowPlans};
