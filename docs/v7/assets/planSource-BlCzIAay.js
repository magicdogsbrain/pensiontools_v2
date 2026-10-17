import{f as Oo,aa as is,e as Mo,ab as rs,b as bt,S as De,D as oe,T as pe,ac as No,ad as Co,ae as xo,af as Lo,ag as Bo,ah as he,ai as Vo,aj as Fo,ak as Go,al as Uo}from"./index-N2RCw4C_.js";import{B as yt,F as Yo,k as jo,S as Ut,G as $o}from"./SubAssetReturns-CjMH1XNk.js";var Qi={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ss=function(t){const e=[];let n=0;for(let i=0;i<t.length;i++){let r=t.charCodeAt(i);r<128?e[n++]=r:r<2048?(e[n++]=r>>6|192,e[n++]=r&63|128):(r&64512)===55296&&i+1<t.length&&(t.charCodeAt(i+1)&64512)===56320?(r=65536+((r&1023)<<10)+(t.charCodeAt(++i)&1023),e[n++]=r>>18|240,e[n++]=r>>12&63|128,e[n++]=r>>6&63|128,e[n++]=r&63|128):(e[n++]=r>>12|224,e[n++]=r>>6&63|128,e[n++]=r&63|128)}return e},Ko=function(t){const e=[];let n=0,i=0;for(;n<t.length;){const r=t[n++];if(r<128)e[i++]=String.fromCharCode(r);else if(r>191&&r<224){const s=t[n++];e[i++]=String.fromCharCode((r&31)<<6|s&63)}else if(r>239&&r<365){const s=t[n++],o=t[n++],l=t[n++],a=((r&7)<<18|(s&63)<<12|(o&63)<<6|l&63)-65536;e[i++]=String.fromCharCode(55296+(a>>10)),e[i++]=String.fromCharCode(56320+(a&1023))}else{const s=t[n++],o=t[n++];e[i++]=String.fromCharCode((r&15)<<12|(s&63)<<6|o&63)}}return e.join("")},os={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,i=[];for(let r=0;r<t.length;r+=3){const s=t[r],o=r+1<t.length,l=o?t[r+1]:0,a=r+2<t.length,u=a?t[r+2]:0,c=s>>2,d=(s&3)<<4|l>>4;let h=(l&15)<<2|u>>6,f=u&63;a||(f=64,o||(h=64)),i.push(n[c],n[d],n[h],n[f])}return i.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(ss(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):Ko(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,i=[];for(let r=0;r<t.length;){const s=n[t.charAt(r++)],l=r<t.length?n[t.charAt(r)]:0;++r;const u=r<t.length?n[t.charAt(r)]:64;++r;const d=r<t.length?n[t.charAt(r)]:64;if(++r,s==null||l==null||u==null||d==null)throw new Ho;const h=s<<2|l>>4;if(i.push(h),u!==64){const f=l<<4&240|u>>2;if(i.push(f),d!==64){const m=u<<6&192|d;i.push(m)}}}return i},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class Ho extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Wo=function(t){const e=ss(t);return os.encodeByteArray(e,!0)},_n=function(t){return Wo(t).replace(/\./g,"")},as=function(t){try{return os.decodeString(t,!0)}catch{}return null};/**
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
 */function zo(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const qo=()=>zo().__FIREBASE_DEFAULTS__,Jo=()=>{if(typeof process>"u"||typeof Qi>"u")return;const t=Qi.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},Qo=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&as(t[1]);return e&&JSON.parse(e)},Ai=()=>{try{return qo()||Jo()||Qo()}catch{return}},ls=t=>{var e,n;return(n=(e=Ai())===null||e===void 0?void 0:e.emulatorHosts)===null||n===void 0?void 0:n[t]},Xo=t=>{const e=ls(t);if(!e)return;const n=e.lastIndexOf(":");if(n<=0||n+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const i=parseInt(e.substring(n+1),10);return e[0]==="["?[e.substring(1,n-1),i]:[e.substring(0,n),i]},cs=()=>{var t;return(t=Ai())===null||t===void 0?void 0:t.config},us=t=>{var e;return(e=Ai())===null||e===void 0?void 0:e[`_${t}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zo{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,i)=>{n?this.reject(n):this.resolve(i),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,i))}}}/**
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
 */function ea(t,e){if(t.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n={alg:"none",type:"JWT"},i=e||"demo-project",r=t.iat||0,s=t.sub||t.user_id;if(!s)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${i}`,aud:i,iat:r,exp:r+3600,auth_time:r,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}}},t);return[_n(JSON.stringify(n)),_n(JSON.stringify(o)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function me(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function ta(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(me())}function na(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function ia(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function ra(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function sa(){const t=me();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function oa(){try{return typeof indexedDB=="object"}catch{return!1}}function aa(){return new Promise((t,e)=>{try{let n=!0;const i="validate-browser-context-for-indexeddb-analytics-module",r=self.indexedDB.open(i);r.onsuccess=()=>{r.result.close(),n||self.indexedDB.deleteDatabase(i),t(!0)},r.onupgradeneeded=()=>{n=!1},r.onerror=()=>{var s;e(((s=r.error)===null||s===void 0?void 0:s.message)||"")}}catch(n){e(n)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const la="FirebaseError";class He extends Error{constructor(e,n,i){super(n),this.code=e,this.customData=i,this.name=la,Object.setPrototypeOf(this,He.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,tn.prototype.create)}}class tn{constructor(e,n,i){this.service=e,this.serviceName=n,this.errors=i}create(e,...n){const i=n[0]||{},r=`${this.service}/${e}`,s=this.errors[e],o=s?ca(s,i):"Error",l=`${this.serviceName}: ${o} (${r}).`;return new He(r,l,i)}}function ca(t,e){return t.replace(ua,(n,i)=>{const r=e[i];return r!=null?String(r):`<${i}?>`})}const ua=/\{\$([^}]+)}/g;function da(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function vn(t,e){if(t===e)return!0;const n=Object.keys(t),i=Object.keys(e);for(const r of n){if(!i.includes(r))return!1;const s=t[r],o=e[r];if(Xi(s)&&Xi(o)){if(!vn(s,o))return!1}else if(s!==o)return!1}for(const r of i)if(!n.includes(r))return!1;return!0}function Xi(t){return t!==null&&typeof t=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nn(t){const e=[];for(const[n,i]of Object.entries(t))Array.isArray(i)?i.forEach(r=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(r))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(i));return e.length?"&"+e.join("&"):""}function ha(t,e){const n=new pa(t,e);return n.subscribe.bind(n)}class pa{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(i=>{this.error(i)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,i){let r;if(e===void 0&&n===void 0&&i===void 0)throw new Error("Missing Observer.");fa(e,["next","error","complete"])?r=e:r={next:e,error:n,complete:i},r.next===void 0&&(r.next=qn),r.error===void 0&&(r.error=qn),r.complete===void 0&&(r.complete=qn);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?r.error(this.finalError):r.complete()}catch{}}),this.observers.push(r),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch{}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function fa(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function qn(){}/**
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
 */function Ne(t){return t&&t._delegate?t._delegate:t}class dt{constructor(e,n,i){this.name=e,this.instanceFactory=n,this.type=i,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const at="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ma{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const i=new Zo;if(this.instancesDeferred.set(n,i),this.isInitialized(n)||this.shouldAutoInitialize())try{const r=this.getOrInitializeService({instanceIdentifier:n});r&&i.resolve(r)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){var n;const i=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(n=e==null?void 0:e.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(i)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:i})}catch(s){if(r)return null;throw s}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(ya(e))try{this.getOrInitializeService({instanceIdentifier:at})}catch{}for(const[n,i]of this.instancesDeferred.entries()){const r=this.normalizeInstanceIdentifier(n);try{const s=this.getOrInitializeService({instanceIdentifier:r});i.resolve(s)}catch{}}}}clearInstance(e=at){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=at){return this.instances.has(e)}getOptions(e=at){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,i=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(i))throw Error(`${this.name}(${i}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const r=this.getOrInitializeService({instanceIdentifier:i,options:n});for(const[s,o]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(s);i===l&&o.resolve(r)}return r}onInit(e,n){var i;const r=this.normalizeInstanceIdentifier(n),s=(i=this.onInitCallbacks.get(r))!==null&&i!==void 0?i:new Set;s.add(e),this.onInitCallbacks.set(r,s);const o=this.instances.get(r);return o&&e(o,r),()=>{s.delete(e)}}invokeOnInitCallbacks(e,n){const i=this.onInitCallbacks.get(n);if(i)for(const r of i)try{r(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let i=this.instances.get(e);if(!i&&this.component&&(i=this.component.instanceFactory(this.container,{instanceIdentifier:ga(e),options:n}),this.instances.set(e,i),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(i,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,i)}catch{}return i||null}normalizeInstanceIdentifier(e=at){return this.component?this.component.multipleInstances?e:at:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function ga(t){return t===at?void 0:t}function ya(t){return t.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _a{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new ma(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var j;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(j||(j={}));const va={debug:j.DEBUG,verbose:j.VERBOSE,info:j.INFO,warn:j.WARN,error:j.ERROR,silent:j.SILENT},Ta=j.INFO,ba={[j.DEBUG]:"log",[j.VERBOSE]:"log",[j.INFO]:"info",[j.WARN]:"warn",[j.ERROR]:"error"},Ia=(t,e,...n)=>{if(e<t.logLevel)return;const i=new Date().toISOString(),r=ba[e];if(!r)throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Si{constructor(e){this.name=e,this._logLevel=Ta,this._logHandler=Ia,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in j))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?va[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,j.DEBUG,...e),this._logHandler(this,j.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,j.VERBOSE,...e),this._logHandler(this,j.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,j.INFO,...e),this._logHandler(this,j.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,j.WARN,...e),this._logHandler(this,j.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,j.ERROR,...e),this._logHandler(this,j.ERROR,...e)}}const Aa=(t,e)=>e.some(n=>t instanceof n);let Zi,er;function Sa(){return Zi||(Zi=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function wa(){return er||(er=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const ds=new WeakMap,oi=new WeakMap,hs=new WeakMap,Jn=new WeakMap,wi=new WeakMap;function Ea(t){const e=new Promise((n,i)=>{const r=()=>{t.removeEventListener("success",s),t.removeEventListener("error",o)},s=()=>{n(nt(t.result)),r()},o=()=>{i(t.error),r()};t.addEventListener("success",s),t.addEventListener("error",o)});return e.then(n=>{n instanceof IDBCursor&&ds.set(n,t)}).catch(()=>{}),wi.set(e,t),e}function Ra(t){if(oi.has(t))return;const e=new Promise((n,i)=>{const r=()=>{t.removeEventListener("complete",s),t.removeEventListener("error",o),t.removeEventListener("abort",o)},s=()=>{n(),r()},o=()=>{i(t.error||new DOMException("AbortError","AbortError")),r()};t.addEventListener("complete",s),t.addEventListener("error",o),t.addEventListener("abort",o)});oi.set(t,e)}let ai={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return oi.get(t);if(e==="objectStoreNames")return t.objectStoreNames||hs.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return nt(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function Pa(t){ai=t(ai)}function ka(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const i=t.call(Qn(this),e,...n);return hs.set(i,e.sort?e.sort():[e]),nt(i)}:wa().includes(t)?function(...e){return t.apply(Qn(this),e),nt(ds.get(this))}:function(...e){return nt(t.apply(Qn(this),e))}}function Da(t){return typeof t=="function"?ka(t):(t instanceof IDBTransaction&&Ra(t),Aa(t,Sa())?new Proxy(t,ai):t)}function nt(t){if(t instanceof IDBRequest)return Ea(t);if(Jn.has(t))return Jn.get(t);const e=Da(t);return e!==t&&(Jn.set(t,e),wi.set(e,t)),e}const Qn=t=>wi.get(t);function Oa(t,e,{blocked:n,upgrade:i,blocking:r,terminated:s}={}){const o=indexedDB.open(t,e),l=nt(o);return i&&o.addEventListener("upgradeneeded",a=>{i(nt(o.result),a.oldVersion,a.newVersion,nt(o.transaction),a)}),n&&o.addEventListener("blocked",a=>n(a.oldVersion,a.newVersion,a)),l.then(a=>{s&&a.addEventListener("close",()=>s()),r&&a.addEventListener("versionchange",u=>r(u.oldVersion,u.newVersion,u))}).catch(()=>{}),l}const Ma=["get","getKey","getAll","getAllKeys","count"],Na=["put","add","delete","clear"],Xn=new Map;function tr(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(Xn.get(e))return Xn.get(e);const n=e.replace(/FromIndex$/,""),i=e!==n,r=Na.includes(n);if(!(n in(i?IDBIndex:IDBObjectStore).prototype)||!(r||Ma.includes(n)))return;const s=async function(o,...l){const a=this.transaction(o,r?"readwrite":"readonly");let u=a.store;return i&&(u=u.index(l.shift())),(await Promise.all([u[n](...l),r&&a.done]))[0]};return Xn.set(e,s),s}Pa(t=>({...t,get:(e,n,i)=>tr(e,n)||t.get(e,n,i),has:(e,n)=>!!tr(e,n)||t.has(e,n)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ca{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(xa(n)){const i=n.getImmediate();return`${i.library}/${i.version}`}else return null}).filter(n=>n).join(" ")}}function xa(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const li="@firebase/app",nr="0.10.13";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ye=new Si("@firebase/app"),La="@firebase/app-compat",Ba="@firebase/analytics-compat",Va="@firebase/analytics",Fa="@firebase/app-check-compat",Ga="@firebase/app-check",Ua="@firebase/auth",Ya="@firebase/auth-compat",ja="@firebase/database",$a="@firebase/data-connect",Ka="@firebase/database-compat",Ha="@firebase/functions",Wa="@firebase/functions-compat",za="@firebase/installations",qa="@firebase/installations-compat",Ja="@firebase/messaging",Qa="@firebase/messaging-compat",Xa="@firebase/performance",Za="@firebase/performance-compat",el="@firebase/remote-config",tl="@firebase/remote-config-compat",nl="@firebase/storage",il="@firebase/storage-compat",rl="@firebase/firestore",sl="@firebase/vertexai-preview",ol="@firebase/firestore-compat",al="firebase",ll="10.14.1";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ci="[DEFAULT]",cl={[li]:"fire-core",[La]:"fire-core-compat",[Va]:"fire-analytics",[Ba]:"fire-analytics-compat",[Ga]:"fire-app-check",[Fa]:"fire-app-check-compat",[Ua]:"fire-auth",[Ya]:"fire-auth-compat",[ja]:"fire-rtdb",[$a]:"fire-data-connect",[Ka]:"fire-rtdb-compat",[Ha]:"fire-fn",[Wa]:"fire-fn-compat",[za]:"fire-iid",[qa]:"fire-iid-compat",[Ja]:"fire-fcm",[Qa]:"fire-fcm-compat",[Xa]:"fire-perf",[Za]:"fire-perf-compat",[el]:"fire-rc",[tl]:"fire-rc-compat",[nl]:"fire-gcs",[il]:"fire-gcs-compat",[rl]:"fire-fst",[ol]:"fire-fst-compat",[sl]:"fire-vertex","fire-js":"fire-js",[al]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tn=new Map,ul=new Map,ui=new Map;function ir(t,e){try{t.container.addComponent(e)}catch(n){Ye.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function Rt(t){const e=t.name;if(ui.has(e))return Ye.debug(`There were multiple attempts to register component ${e}.`),!1;ui.set(e,t);for(const n of Tn.values())ir(n,t);for(const n of ul.values())ir(n,t);return!0}function Ei(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function tt(t){return t.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dl={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},it=new tn("app","Firebase",dl);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hl{constructor(e,n,i){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=i,this.container.addComponent(new dt("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw it.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ot=ll;function ps(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const i=Object.assign({name:ci,automaticDataCollectionEnabled:!1},e),r=i.name;if(typeof r!="string"||!r)throw it.create("bad-app-name",{appName:String(r)});if(n||(n=cs()),!n)throw it.create("no-options");const s=Tn.get(r);if(s){if(vn(n,s.options)&&vn(i,s.config))return s;throw it.create("duplicate-app",{appName:r})}const o=new _a(r);for(const a of ui.values())o.addComponent(a);const l=new hl(n,i,o);return Tn.set(r,l),l}function fs(t=ci){const e=Tn.get(t);if(!e&&t===ci&&cs())return ps();if(!e)throw it.create("no-app",{appName:t});return e}function rt(t,e,n){var i;let r=(i=cl[t])!==null&&i!==void 0?i:t;n&&(r+=`-${n}`);const s=r.match(/\s|\//),o=e.match(/\s|\//);if(s||o){const l=[`Unable to register library "${r}" with version "${e}":`];s&&l.push(`library name "${r}" contains illegal characters (whitespace or "/")`),s&&o&&l.push("and"),o&&l.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Ye.warn(l.join(" "));return}Rt(new dt(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
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
 */const pl="firebase-heartbeat-database",fl=1,zt="firebase-heartbeat-store";let Zn=null;function ms(){return Zn||(Zn=Oa(pl,fl,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(zt)}catch{}}}}).catch(t=>{throw it.create("idb-open",{originalErrorMessage:t.message})})),Zn}async function ml(t){try{const n=(await ms()).transaction(zt),i=await n.objectStore(zt).get(gs(t));return await n.done,i}catch(e){if(e instanceof He)Ye.warn(e.message);else{const n=it.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Ye.warn(n.message)}}}async function rr(t,e){try{const i=(await ms()).transaction(zt,"readwrite");await i.objectStore(zt).put(e,gs(t)),await i.done}catch(n){if(n instanceof He)Ye.warn(n.message);else{const i=it.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});Ye.warn(i.message)}}}function gs(t){return`${t.name}!${t.options.appId}`}/**
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
 */const gl=1024,yl=30*24*60*60*1e3;class _l{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new Tl(n),this._heartbeatsCachePromise=this._storage.read().then(i=>(this._heartbeatsCache=i,i))}async triggerHeartbeat(){var e,n;try{const r=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=sr();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)===null||n===void 0?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(o=>o.date===s)?void 0:(this._heartbeatsCache.heartbeats.push({date:s,agent:r}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(o=>{const l=new Date(o.date).valueOf();return Date.now()-l<=yl}),this._storage.overwrite(this._heartbeatsCache))}catch(i){Ye.warn(i)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=sr(),{heartbeatsToSend:i,unsentEntries:r}=vl(this._heartbeatsCache.heartbeats),s=_n(JSON.stringify({version:2,heartbeats:i}));return this._heartbeatsCache.lastSentHeartbeatDate=n,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(n){return Ye.warn(n),""}}}function sr(){return new Date().toISOString().substring(0,10)}function vl(t,e=gl){const n=[];let i=t.slice();for(const r of t){const s=n.find(o=>o.agent===r.agent);if(s){if(s.dates.push(r.date),or(n)>e){s.dates.pop();break}}else if(n.push({agent:r.agent,dates:[r.date]}),or(n)>e){n.pop();break}i=i.slice(1)}return{heartbeatsToSend:n,unsentEntries:i}}class Tl{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return oa()?aa().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await ml(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var n;if(await this._canUseIndexedDBPromise){const r=await this.read();return rr(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var n;if(await this._canUseIndexedDBPromise){const r=await this.read();return rr(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function or(t){return _n(JSON.stringify({version:2,heartbeats:t})).length}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bl(t){Rt(new dt("platform-logger",e=>new Ca(e),"PRIVATE")),Rt(new dt("heartbeat",e=>new _l(e),"PRIVATE")),rt(li,nr,t),rt(li,nr,"esm2017"),rt("fire-js","")}bl("");var Il="firebase",Al="10.14.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */rt(Il,Al,"app");function Ri(t,e){var n={};for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&e.indexOf(i)<0&&(n[i]=t[i]);if(t!=null&&typeof Object.getOwnPropertySymbols=="function")for(var r=0,i=Object.getOwnPropertySymbols(t);r<i.length;r++)e.indexOf(i[r])<0&&Object.prototype.propertyIsEnumerable.call(t,i[r])&&(n[i[r]]=t[i[r]]);return n}function ys(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Sl=ys,_s=new tn("auth","Firebase",ys());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bn=new Si("@firebase/auth");function wl(t,...e){bn.logLevel<=j.WARN&&bn.warn(`Auth (${Ot}): ${t}`,...e)}function pn(t,...e){bn.logLevel<=j.ERROR&&bn.error(`Auth (${Ot}): ${t}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function je(t,...e){throw Pi(t,...e)}function Oe(t,...e){return Pi(t,...e)}function vs(t,e,n){const i=Object.assign(Object.assign({},Sl()),{[e]:n});return new tn("auth","Firebase",i).create(e,{appName:t.name})}function ut(t){return vs(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Pi(t,...e){if(typeof t!="string"){const n=e[0],i=[...e.slice(1)];return i[0]&&(i[0].appName=t.name),t._errorFactory.create(n,...i)}return _s.create(t,...e)}function M(t,e,...n){if(!t)throw Pi(e,...n)}function Le(t){const e="INTERNAL ASSERTION FAILED: "+t;throw pn(e),new Error(e)}function $e(t,e){t||Le(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function di(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.href)||""}function El(){return ar()==="http:"||ar()==="https:"}function ar(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rl(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(El()||ia()||"connection"in navigator)?navigator.onLine:!0}function Pl(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rn{constructor(e,n){this.shortDelay=e,this.longDelay=n,$e(n>e,"Short delay should be less than long delay!"),this.isMobile=ta()||ra()}get(){return Rl()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ki(t,e){$e(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ts{static initialize(e,n,i){this.fetchImpl=e,n&&(this.headersImpl=n),i&&(this.responseImpl=i)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Le("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Le("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Le("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kl={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dl=new rn(3e4,6e4);function Di(t,e){return t.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:t.tenantId}):e}async function Mt(t,e,n,i,r={}){return bs(t,r,async()=>{let s={},o={};i&&(e==="GET"?o=i:s={body:JSON.stringify(i)});const l=nn(Object.assign({key:t.config.apiKey},o)).slice(1),a=await t._getAdditionalHeaders();a["Content-Type"]="application/json",t.languageCode&&(a["X-Firebase-Locale"]=t.languageCode);const u=Object.assign({method:e,headers:a},s);return na()||(u.referrerPolicy="no-referrer"),Ts.fetch()(Is(t,t.config.apiHost,n,l),u)})}async function bs(t,e,n){t._canInitEmulator=!1;const i=Object.assign(Object.assign({},kl),e);try{const r=new Ml(t),s=await Promise.race([n(),r.promise]);r.clearNetworkTimeout();const o=await s.json();if("needConfirmation"in o)throw an(t,"account-exists-with-different-credential",o);if(s.ok&&!("errorMessage"in o))return o;{const l=s.ok?o.errorMessage:o.error.message,[a,u]=l.split(" : ");if(a==="FEDERATED_USER_ID_ALREADY_LINKED")throw an(t,"credential-already-in-use",o);if(a==="EMAIL_EXISTS")throw an(t,"email-already-in-use",o);if(a==="USER_DISABLED")throw an(t,"user-disabled",o);const c=i[a]||a.toLowerCase().replace(/[_\s]+/g,"-");if(u)throw vs(t,c,u);je(t,c)}}catch(r){if(r instanceof He)throw r;je(t,"network-request-failed",{message:String(r)})}}async function Ol(t,e,n,i,r={}){const s=await Mt(t,e,n,i,r);return"mfaPendingCredential"in s&&je(t,"multi-factor-auth-required",{_serverResponse:s}),s}function Is(t,e,n,i){const r=`${e}${n}?${i}`;return t.config.emulator?ki(t.config,r):`${t.config.apiScheme}://${r}`}class Ml{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,i)=>{this.timer=setTimeout(()=>i(Oe(this.auth,"network-request-failed")),Dl.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function an(t,e,n){const i={appName:t.name};n.email&&(i.email=n.email),n.phoneNumber&&(i.phoneNumber=n.phoneNumber);const r=Oe(t,e,i);return r.customData._tokenResponse=n,r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Nl(t,e){return Mt(t,"POST","/v1/accounts:delete",e)}async function As(t,e){return Mt(t,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yt(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function Cl(t,e=!1){const n=Ne(t),i=await n.getIdToken(e),r=Oi(i);M(r&&r.exp&&r.auth_time&&r.iat,n.auth,"internal-error");const s=typeof r.firebase=="object"?r.firebase:void 0,o=s==null?void 0:s.sign_in_provider;return{claims:r,token:i,authTime:Yt(ei(r.auth_time)),issuedAtTime:Yt(ei(r.iat)),expirationTime:Yt(ei(r.exp)),signInProvider:o||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function ei(t){return Number(t)*1e3}function Oi(t){const[e,n,i]=t.split(".");if(e===void 0||n===void 0||i===void 0)return pn("JWT malformed, contained fewer than 3 sections"),null;try{const r=as(n);return r?JSON.parse(r):(pn("Failed to decode base64 JWT payload"),null)}catch(r){return pn("Caught error parsing JWT payload as JSON",r==null?void 0:r.toString()),null}}function lr(t){const e=Oi(t);return M(e,"internal-error"),M(typeof e.exp<"u","internal-error"),M(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function qt(t,e,n=!1){if(n)return e;try{return await e}catch(i){throw i instanceof He&&xl(i)&&t.auth.currentUser===t&&await t.auth.signOut(),i}}function xl({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ll{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var n;if(e){const i=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),i}else{this.errorBackoff=3e4;const r=((n=this.user.stsTokenManager.expirationTime)!==null&&n!==void 0?n:0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hi{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=Yt(this.lastLoginAt),this.creationTime=Yt(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function In(t){var e;const n=t.auth,i=await t.getIdToken(),r=await qt(t,As(n,{idToken:i}));M(r==null?void 0:r.users.length,n,"internal-error");const s=r.users[0];t._notifyReloadListener(s);const o=!((e=s.providerUserInfo)===null||e===void 0)&&e.length?Ss(s.providerUserInfo):[],l=Vl(t.providerData,o),a=t.isAnonymous,u=!(t.email&&s.passwordHash)&&!(l!=null&&l.length),c=a?u:!1,d={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:l,metadata:new hi(s.createdAt,s.lastLoginAt),isAnonymous:c};Object.assign(t,d)}async function Bl(t){const e=Ne(t);await In(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function Vl(t,e){return[...t.filter(i=>!e.some(r=>r.providerId===i.providerId)),...e]}function Ss(t){return t.map(e=>{var{providerId:n}=e,i=Ri(e,["providerId"]);return{providerId:n,uid:i.rawId||"",displayName:i.displayName||null,email:i.email||null,phoneNumber:i.phoneNumber||null,photoURL:i.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Fl(t,e){const n=await bs(t,{},async()=>{const i=nn({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:r,apiKey:s}=t.config,o=Is(t,r,"/v1/token",`key=${s}`),l=await t._getAdditionalHeaders();return l["Content-Type"]="application/x-www-form-urlencoded",Ts.fetch()(o,{method:"POST",headers:l,body:i})});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function Gl(t,e){return Mt(t,"POST","/v2/accounts:revokeToken",Di(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class It{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){M(e.idToken,"internal-error"),M(typeof e.idToken<"u","internal-error"),M(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):lr(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){M(e.length!==0,"internal-error");const n=lr(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(M(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:i,refreshToken:r,expiresIn:s}=await Fl(e,n);this.updateTokensAndExpiration(i,r,Number(s))}updateTokensAndExpiration(e,n,i){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+i*1e3}static fromJSON(e,n){const{refreshToken:i,accessToken:r,expirationTime:s}=n,o=new It;return i&&(M(typeof i=="string","internal-error",{appName:e}),o.refreshToken=i),r&&(M(typeof r=="string","internal-error",{appName:e}),o.accessToken=r),s&&(M(typeof s=="number","internal-error",{appName:e}),o.expirationTime=s),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new It,this.toJSON())}_performRefresh(){return Le("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ze(t,e){M(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class Be{constructor(e){var{uid:n,auth:i,stsTokenManager:r}=e,s=Ri(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new Ll(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=n,this.auth=i,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new hi(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const n=await qt(this,this.stsTokenManager.getToken(this.auth,e));return M(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return Cl(this,e)}reload(){return Bl(this)}_assign(e){this!==e&&(M(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>Object.assign({},n)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new Be(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return n.metadata._copy(this.metadata),n}_onReload(e){M(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let i=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),i=!0),n&&await In(this),await this.auth._persistUserIfCurrent(this),i&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(tt(this.auth.app))return Promise.reject(ut(this.auth));const e=await this.getIdToken();return await qt(this,Nl(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){var i,r,s,o,l,a,u,c;const d=(i=n.displayName)!==null&&i!==void 0?i:void 0,h=(r=n.email)!==null&&r!==void 0?r:void 0,f=(s=n.phoneNumber)!==null&&s!==void 0?s:void 0,m=(o=n.photoURL)!==null&&o!==void 0?o:void 0,p=(l=n.tenantId)!==null&&l!==void 0?l:void 0,y=(a=n._redirectEventId)!==null&&a!==void 0?a:void 0,O=(u=n.createdAt)!==null&&u!==void 0?u:void 0,E=(c=n.lastLoginAt)!==null&&c!==void 0?c:void 0,{uid:g,emailVerified:v,isAnonymous:R,providerData:b,stsTokenManager:I}=n;M(g&&I,e,"internal-error");const S=It.fromJSON(this.name,I);M(typeof g=="string",e,"internal-error"),ze(d,e.name),ze(h,e.name),M(typeof v=="boolean",e,"internal-error"),M(typeof R=="boolean",e,"internal-error"),ze(f,e.name),ze(m,e.name),ze(p,e.name),ze(y,e.name),ze(O,e.name),ze(E,e.name);const T=new Be({uid:g,auth:e,email:h,emailVerified:v,displayName:d,isAnonymous:R,photoURL:m,phoneNumber:f,tenantId:p,stsTokenManager:S,createdAt:O,lastLoginAt:E});return b&&Array.isArray(b)&&(T.providerData=b.map(C=>Object.assign({},C))),y&&(T._redirectEventId=y),T}static async _fromIdTokenResponse(e,n,i=!1){const r=new It;r.updateFromServerResponse(n);const s=new Be({uid:n.localId,auth:e,stsTokenManager:r,isAnonymous:i});return await In(s),s}static async _fromGetAccountInfoResponse(e,n,i){const r=n.users[0];M(r.localId!==void 0,"internal-error");const s=r.providerUserInfo!==void 0?Ss(r.providerUserInfo):[],o=!(r.email&&r.passwordHash)&&!(s!=null&&s.length),l=new It;l.updateFromIdToken(i);const a=new Be({uid:r.localId,auth:e,stsTokenManager:l,isAnonymous:o}),u={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:s,metadata:new hi(r.createdAt,r.lastLoginAt),isAnonymous:!(r.email&&r.passwordHash)&&!(s!=null&&s.length)};return Object.assign(a,u),a}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cr=new Map;function Ve(t){$e(t instanceof Function,"Expected a class definition");let e=cr.get(t);return e?($e(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,cr.set(t,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ws{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}ws.type="NONE";const ur=ws;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fn(t,e,n){return`firebase:${t}:${e}:${n}`}class At{constructor(e,n,i){this.persistence=e,this.auth=n,this.userKey=i;const{config:r,name:s}=this.auth;this.fullUserKey=fn(this.userKey,r.apiKey,s),this.fullPersistenceKey=fn("persistence",r.apiKey,s),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?Be._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,i="authUser"){if(!n.length)return new At(Ve(ur),e,i);const r=(await Promise.all(n.map(async u=>{if(await u._isAvailable())return u}))).filter(u=>u);let s=r[0]||Ve(ur);const o=fn(i,e.config.apiKey,e.name);let l=null;for(const u of n)try{const c=await u._get(o);if(c){const d=Be._fromJSON(e,c);u!==s&&(l=d),s=u;break}}catch{}const a=r.filter(u=>u._shouldAllowMigration);return!s._shouldAllowMigration||!a.length?new At(s,e,i):(s=a[0],l&&await s._set(o,l.toJSON()),await Promise.all(n.map(async u=>{if(u!==s)try{await u._remove(o)}catch{}})),new At(s,e,i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dr(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(ks(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Es(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Os(e))return"Blackberry";if(Ms(e))return"Webos";if(Rs(e))return"Safari";if((e.includes("chrome/")||Ps(e))&&!e.includes("edge/"))return"Chrome";if(Ds(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,i=t.match(n);if((i==null?void 0:i.length)===2)return i[1]}return"Other"}function Es(t=me()){return/firefox\//i.test(t)}function Rs(t=me()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Ps(t=me()){return/crios\//i.test(t)}function ks(t=me()){return/iemobile/i.test(t)}function Ds(t=me()){return/android/i.test(t)}function Os(t=me()){return/blackberry/i.test(t)}function Ms(t=me()){return/webos/i.test(t)}function Mi(t=me()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function Ul(t=me()){var e;return Mi(t)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function Yl(){return sa()&&document.documentMode===10}function Ns(t=me()){return Mi(t)||Ds(t)||Ms(t)||Os(t)||/windows phone/i.test(t)||ks(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Cs(t,e=[]){let n;switch(t){case"Browser":n=dr(me());break;case"Worker":n=`${dr(me())}-${t}`;break;default:n=t}const i=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${Ot}/${i}`}/**
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
 */class jl{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const i=s=>new Promise((o,l)=>{try{const a=e(s);o(a)}catch(a){l(a)}});i.onAbort=n,this.queue.push(i);const r=this.queue.length-1;return()=>{this.queue[r]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const i of this.queue)await i(e),i.onAbort&&n.push(i.onAbort)}catch(i){n.reverse();for(const r of n)try{r()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:i==null?void 0:i.message})}}}/**
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
 */async function $l(t,e={}){return Mt(t,"GET","/v2/passwordPolicy",Di(t,e))}/**
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
 */const Kl=6;class Hl{constructor(e){var n,i,r,s;const o=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(n=o.minPasswordLength)!==null&&n!==void 0?n:Kl,o.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=o.maxPasswordLength),o.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=o.containsLowercaseCharacter),o.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=o.containsUppercaseCharacter),o.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=o.containsNumericCharacter),o.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=o.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(r=(i=e.allowedNonAlphanumericCharacters)===null||i===void 0?void 0:i.join(""))!==null&&r!==void 0?r:"",this.forceUpgradeOnSignin=(s=e.forceUpgradeOnSignin)!==null&&s!==void 0?s:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var n,i,r,s,o,l;const a={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,a),this.validatePasswordCharacterOptions(e,a),a.isValid&&(a.isValid=(n=a.meetsMinPasswordLength)!==null&&n!==void 0?n:!0),a.isValid&&(a.isValid=(i=a.meetsMaxPasswordLength)!==null&&i!==void 0?i:!0),a.isValid&&(a.isValid=(r=a.containsLowercaseLetter)!==null&&r!==void 0?r:!0),a.isValid&&(a.isValid=(s=a.containsUppercaseLetter)!==null&&s!==void 0?s:!0),a.isValid&&(a.isValid=(o=a.containsNumericCharacter)!==null&&o!==void 0?o:!0),a.isValid&&(a.isValid=(l=a.containsNonAlphanumericCharacter)!==null&&l!==void 0?l:!0),a}validatePasswordLengthOptions(e,n){const i=this.customStrengthOptions.minPasswordLength,r=this.customStrengthOptions.maxPasswordLength;i&&(n.meetsMinPasswordLength=e.length>=i),r&&(n.meetsMaxPasswordLength=e.length<=r)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let i;for(let r=0;r<e.length;r++)i=e.charAt(r),this.updatePasswordCharacterOptionsStatuses(n,i>="a"&&i<="z",i>="A"&&i<="Z",i>="0"&&i<="9",this.allowedNonAlphanumericCharacters.includes(i))}updatePasswordCharacterOptionsStatuses(e,n,i,r,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=i)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=r)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wl{constructor(e,n,i,r){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=i,this.config=r,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new hr(this),this.idTokenSubscription=new hr(this),this.beforeStateQueue=new jl(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=_s,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=r.sdkClientVersion}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=Ve(n)),this._initializationPromise=this.queue(async()=>{var i,r;if(!this._deleted&&(this.persistenceManager=await At.create(this,e),!this._deleted)){if(!((i=this._popupRedirectResolver)===null||i===void 0)&&i._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((r=this.currentUser)===null||r===void 0?void 0:r.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await As(this,{idToken:e}),i=await Be._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(i)}catch{await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var n;if(tt(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(l=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(l,l))}):this.directlySetCurrentUser(null)}const i=await this.assertedPersistence.getCurrentUser();let r=i,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(n=this.redirectUser)===null||n===void 0?void 0:n._redirectEventId,l=r==null?void 0:r._redirectEventId,a=await this.tryRedirectSignIn(e);(!o||o===l)&&(a!=null&&a.user)&&(r=a.user,s=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(r)}catch(o){r=i,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return M(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await In(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=Pl()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(tt(this.app))return Promise.reject(ut(this));const n=e?Ne(e):null;return n&&M(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&M(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return tt(this.app)?Promise.reject(ut(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return tt(this.app)?Promise.reject(ut(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Ve(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await $l(this),n=new Hl(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new tn("auth","Firebase",e())}onAuthStateChanged(e,n,i){return this.registerStateListener(this.authStateSubscription,e,n,i)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,i){return this.registerStateListener(this.idTokenSubscription,e,n,i)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const i=this.onAuthStateChanged(()=>{i(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),i={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(i.tenantId=this.tenantId),await Gl(this,i)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,n){const i=await this.getOrInitRedirectPersistenceManager(n);return e===null?i.removeCurrentUser():i.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&Ve(e)||this._popupRedirectResolver;M(n,this,"argument-error"),this.redirectPersistenceManager=await At.create(this,[Ve(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,i;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)===null||n===void 0?void 0:n._redirectEventId)===e?this._currentUser:((i=this.redirectUser)===null||i===void 0?void 0:i._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const i=(n=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&n!==void 0?n:null;this.lastNotifiedUid!==i&&(this.lastNotifiedUid=i,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,i,r){if(this._deleted)return()=>{};const s=typeof n=="function"?n:n.next.bind(n);let o=!1;const l=this._isInitialized?Promise.resolve():this._initializationPromise;if(M(l,this,"internal-error"),l.then(()=>{o||s(this.currentUser)}),typeof n=="function"){const a=e.addObserver(n,i,r);return()=>{o=!0,a()}}else{const a=e.addObserver(n);return()=>{o=!0,a()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return M(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Cs(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const n={"X-Client-Version":this.clientVersion};this.app.options.appId&&(n["X-Firebase-gmpid"]=this.app.options.appId);const i=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());i&&(n["X-Firebase-Client"]=i);const r=await this._getAppCheckToken();return r&&(n["X-Firebase-AppCheck"]=r),n}async _getAppCheckToken(){var e;const n=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return n!=null&&n.error&&wl(`Error while retrieving App Check token: ${n.error}`),n==null?void 0:n.token}}function Ni(t){return Ne(t)}class hr{constructor(e){this.auth=e,this.observer=null,this.addObserver=ha(n=>this.observer=n)}get next(){return M(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ci={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function zl(t){Ci=t}function ql(t){return Ci.loadJS(t)}function Jl(){return Ci.gapiScript}function Ql(t){return`__${t}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xl(t,e){const n=Ei(t,"auth");if(n.isInitialized()){const r=n.getImmediate(),s=n.getOptions();if(vn(s,e??{}))return r;je(r,"already-initialized")}return n.initialize({options:e})}function Zl(t,e){const n=(e==null?void 0:e.persistence)||[],i=(Array.isArray(n)?n:[n]).map(Ve);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(i,e==null?void 0:e.popupRedirectResolver)}function ec(t,e,n){const i=Ni(t);M(i._canInitEmulator,i,"emulator-config-failed"),M(/^https?:\/\//.test(e),i,"invalid-emulator-scheme");const r=!1,s=xs(e),{host:o,port:l}=tc(e),a=l===null?"":`:${l}`;i.config.emulator={url:`${s}//${o}${a}/`},i.settings.appVerificationDisabledForTesting=!0,i.emulatorConfig=Object.freeze({host:o,port:l,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:r})}),nc()}function xs(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function tc(t){const e=xs(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const i=n[2].split("@").pop()||"",r=/^(\[[^\]]+\])(:|$)/.exec(i);if(r){const s=r[1];return{host:s,port:pr(i.substr(s.length+1))}}else{const[s,o]=i.split(":");return{host:s,port:pr(o)}}}function pr(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function nc(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ls{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return Le("not implemented")}_getIdTokenResponse(e){return Le("not implemented")}_linkToIdToken(e,n){return Le("not implemented")}_getReauthenticationResolver(e){return Le("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function St(t,e){return Ol(t,"POST","/v1/accounts:signInWithIdp",Di(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ic="http://localhost";class ht extends Ls{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new ht(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):je("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:i,signInMethod:r}=n,s=Ri(n,["providerId","signInMethod"]);if(!i||!r)return null;const o=new ht(i,r);return o.idToken=s.idToken||void 0,o.accessToken=s.accessToken||void 0,o.secret=s.secret,o.nonce=s.nonce,o.pendingToken=s.pendingToken||null,o}_getIdTokenResponse(e){const n=this.buildRequest();return St(e,n)}_linkToIdToken(e,n){const i=this.buildRequest();return i.idToken=n,St(e,i)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,St(e,n)}buildRequest(){const e={requestUri:ic,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=nn(n)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bs{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sn extends Bs{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qe extends sn{constructor(){super("facebook.com")}static credential(e){return ht._fromParams({providerId:Qe.PROVIDER_ID,signInMethod:Qe.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Qe.credentialFromTaggedObject(e)}static credentialFromError(e){return Qe.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Qe.credential(e.oauthAccessToken)}catch{return null}}}Qe.FACEBOOK_SIGN_IN_METHOD="facebook.com";Qe.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xe extends sn{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return ht._fromParams({providerId:Xe.PROVIDER_ID,signInMethod:Xe.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return Xe.credentialFromTaggedObject(e)}static credentialFromError(e){return Xe.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:i}=e;if(!n&&!i)return null;try{return Xe.credential(n,i)}catch{return null}}}Xe.GOOGLE_SIGN_IN_METHOD="google.com";Xe.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ze extends sn{constructor(){super("github.com")}static credential(e){return ht._fromParams({providerId:Ze.PROVIDER_ID,signInMethod:Ze.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Ze.credentialFromTaggedObject(e)}static credentialFromError(e){return Ze.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Ze.credential(e.oauthAccessToken)}catch{return null}}}Ze.GITHUB_SIGN_IN_METHOD="github.com";Ze.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class et extends sn{constructor(){super("twitter.com")}static credential(e,n){return ht._fromParams({providerId:et.PROVIDER_ID,signInMethod:et.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return et.credentialFromTaggedObject(e)}static credentialFromError(e){return et.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:i}=e;if(!n||!i)return null;try{return et.credential(n,i)}catch{return null}}}et.TWITTER_SIGN_IN_METHOD="twitter.com";et.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pt{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,i,r=!1){const s=await Be._fromIdTokenResponse(e,i,r),o=fr(i);return new Pt({user:s,providerId:o,_tokenResponse:i,operationType:n})}static async _forOperation(e,n,i){await e._updateTokensIfNecessary(i,!0);const r=fr(i);return new Pt({user:e,providerId:r,_tokenResponse:i,operationType:n})}}function fr(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class An extends He{constructor(e,n,i,r){var s;super(n.code,n.message),this.operationType=i,this.user=r,Object.setPrototypeOf(this,An.prototype),this.customData={appName:e.name,tenantId:(s=e.tenantId)!==null&&s!==void 0?s:void 0,_serverResponse:n.customData._serverResponse,operationType:i}}static _fromErrorAndOperation(e,n,i,r){return new An(e,n,i,r)}}function Vs(t,e,n,i){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?An._fromErrorAndOperation(t,s,e,i):s})}async function rc(t,e,n=!1){const i=await qt(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return Pt._forOperation(t,"link",i)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function sc(t,e,n=!1){const{auth:i}=t;if(tt(i.app))return Promise.reject(ut(i));const r="reauthenticate";try{const s=await qt(t,Vs(i,r,e,t),n);M(s.idToken,i,"internal-error");const o=Oi(s.idToken);M(o,i,"internal-error");const{sub:l}=o;return M(t.uid===l,i,"user-mismatch"),Pt._forOperation(t,r,s)}catch(s){throw(s==null?void 0:s.code)==="auth/user-not-found"&&je(i,"user-mismatch"),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function oc(t,e,n=!1){if(tt(t.app))return Promise.reject(ut(t));const i="signIn",r=await Vs(t,i,e),s=await Pt._fromIdTokenResponse(t,i,r);return n||await t._updateCurrentUser(s.user),s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ac(t,e){return Ne(t).setPersistence(e)}function lc(t,e,n,i){return Ne(t).onIdTokenChanged(e,n,i)}function cc(t,e,n){return Ne(t).beforeAuthStateChanged(e,n)}function uc(t,e,n,i){return Ne(t).onAuthStateChanged(e,n,i)}function dc(t){return Ne(t).signOut()}const Sn="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fs{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(Sn,"1"),this.storage.removeItem(Sn),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hc=1e3,pc=10;class Gs extends Fs{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Ns(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const i=this.storage.getItem(n),r=this.localCache[n];i!==r&&e(n,r,i)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((o,l,a)=>{this.notifyListeners(o,a)});return}const i=e.key;n?this.detachListener():this.stopPolling();const r=()=>{const o=this.storage.getItem(i);!n&&this.localCache[i]===o||this.notifyListeners(i,o)},s=this.storage.getItem(i);Yl()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(r,pc):r()}notifyListeners(e,n){this.localCache[e]=n;const i=this.listeners[e];if(i)for(const r of Array.from(i))r(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,i)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:i}),!0)})},hc)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}Gs.type="LOCAL";const Us=Gs;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ys extends Fs{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}Ys.type="SESSION";const js=Ys;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fc(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fn{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(r=>r.isListeningto(e));if(n)return n;const i=new Fn(e);return this.receivers.push(i),i}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:i,eventType:r,data:s}=n.data,o=this.handlersMap[r];if(!(o!=null&&o.size))return;n.ports[0].postMessage({status:"ack",eventId:i,eventType:r});const l=Array.from(o).map(async u=>u(n.origin,s)),a=await fc(l);n.ports[0].postMessage({status:"done",eventId:i,eventType:r,response:a})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Fn.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xi(t="",e=10){let n="";for(let i=0;i<e;i++)n+=Math.floor(Math.random()*10);return t+n}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mc{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,i=50){const r=typeof MessageChannel<"u"?new MessageChannel:null;if(!r)throw new Error("connection_unavailable");let s,o;return new Promise((l,a)=>{const u=xi("",20);r.port1.start();const c=setTimeout(()=>{a(new Error("unsupported_event"))},i);o={messageChannel:r,onMessage(d){const h=d;if(h.data.eventId===u)switch(h.data.status){case"ack":clearTimeout(c),s=setTimeout(()=>{a(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),l(h.data.response);break;default:clearTimeout(c),clearTimeout(s),a(new Error("invalid_response"));break}}},this.handlers.add(o),r.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:u,data:n},[r.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Me(){return window}function gc(t){Me().location.href=t}/**
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
 */function $s(){return typeof Me().WorkerGlobalScope<"u"&&typeof Me().importScripts=="function"}async function yc(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function _c(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)===null||t===void 0?void 0:t.controller)||null}function vc(){return $s()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ks="firebaseLocalStorageDb",Tc=1,wn="firebaseLocalStorage",Hs="fbase_key";class on{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function Gn(t,e){return t.transaction([wn],e?"readwrite":"readonly").objectStore(wn)}function bc(){const t=indexedDB.deleteDatabase(Ks);return new on(t).toPromise()}function pi(){const t=indexedDB.open(Ks,Tc);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const i=t.result;try{i.createObjectStore(wn,{keyPath:Hs})}catch(r){n(r)}}),t.addEventListener("success",async()=>{const i=t.result;i.objectStoreNames.contains(wn)?e(i):(i.close(),await bc(),e(await pi()))})})}async function mr(t,e,n){const i=Gn(t,!0).put({[Hs]:e,value:n});return new on(i).toPromise()}async function Ic(t,e){const n=Gn(t,!1).get(e),i=await new on(n).toPromise();return i===void 0?null:i.value}function gr(t,e){const n=Gn(t,!0).delete(e);return new on(n).toPromise()}const Ac=800,Sc=3;class Ws{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await pi(),this.db)}async _withRetries(e){let n=0;for(;;)try{const i=await this._openDb();return await e(i)}catch(i){if(n++>Sc)throw i;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return $s()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Fn._getInstance(vc()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var e,n;if(this.activeServiceWorker=await yc(),!this.activeServiceWorker)return;this.sender=new mc(this.activeServiceWorker);const i=await this.sender._send("ping",{},800);i&&!((e=i[0])===null||e===void 0)&&e.fulfilled&&!((n=i[0])===null||n===void 0)&&n.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||_c()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await pi();return await mr(e,Sn,"1"),await gr(e,Sn),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(i=>mr(i,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(i=>Ic(i,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>gr(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(r=>{const s=Gn(r,!1).getAll();return new on(s).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],i=new Set;if(e.length!==0)for(const{fbase_key:r,value:s}of e)i.add(r),JSON.stringify(this.localCache[r])!==JSON.stringify(s)&&(this.notifyListeners(r,s),n.push(r));for(const r of Object.keys(this.localCache))this.localCache[r]&&!i.has(r)&&(this.notifyListeners(r,null),n.push(r));return n}notifyListeners(e,n){this.localCache[e]=n;const i=this.listeners[e];if(i)for(const r of Array.from(i))r(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),Ac)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}Ws.type="LOCAL";const wc=Ws;new rn(3e4,6e4);/**
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
 */function Ec(t,e){return e?Ve(e):(M(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Li extends Ls{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return St(e,this._buildIdpRequest())}_linkToIdToken(e,n){return St(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return St(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function Rc(t){return oc(t.auth,new Li(t),t.bypassAuthState)}function Pc(t){const{auth:e,user:n}=t;return M(n,e,"internal-error"),sc(n,new Li(t),t.bypassAuthState)}async function kc(t){const{auth:e,user:n}=t;return M(n,e,"internal-error"),rc(n,new Li(t),t.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zs{constructor(e,n,i,r,s=!1){this.auth=e,this.resolver=i,this.user=r,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(i){this.reject(i)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:i,postBody:r,tenantId:s,error:o,type:l}=e;if(o){this.reject(o);return}const a={auth:this.auth,requestUri:n,sessionId:i,tenantId:s||void 0,postBody:r||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(l)(a))}catch(u){this.reject(u)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return Rc;case"linkViaPopup":case"linkViaRedirect":return kc;case"reauthViaPopup":case"reauthViaRedirect":return Pc;default:je(this.auth,"internal-error")}}resolve(e){$e(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){$e(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dc=new rn(2e3,1e4);class Tt extends zs{constructor(e,n,i,r,s){super(e,n,r,s),this.provider=i,this.authWindow=null,this.pollId=null,Tt.currentPopupAction&&Tt.currentPopupAction.cancel(),Tt.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return M(e,this.auth,"internal-error"),e}async onExecution(){$e(this.filter.length===1,"Popup operations only handle one event");const e=xi();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(Oe(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(Oe(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Tt.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,i;if(!((i=(n=this.authWindow)===null||n===void 0?void 0:n.window)===null||i===void 0)&&i.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Oe(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,Dc.get())};e()}}Tt.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Oc="pendingRedirect",mn=new Map;class Mc extends zs{constructor(e,n,i=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,i),this.eventId=null}async execute(){let e=mn.get(this.auth._key());if(!e){try{const i=await Nc(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(i)}catch(n){e=()=>Promise.reject(n)}mn.set(this.auth._key(),e)}return this.bypassAuthState||mn.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Nc(t,e){const n=Lc(e),i=xc(t);if(!await i._isAvailable())return!1;const r=await i._get(n)==="true";return await i._remove(n),r}function Cc(t,e){mn.set(t._key(),e)}function xc(t){return Ve(t._redirectPersistence)}function Lc(t){return fn(Oc,t.config.apiKey,t.name)}async function Bc(t,e,n=!1){if(tt(t.app))return Promise.reject(ut(t));const i=Ni(t),r=Ec(i,e),o=await new Mc(i,r,n).execute();return o&&!n&&(delete o.user._redirectEventId,await i._persistUserIfCurrent(o.user),await i._setRedirectUser(null,e)),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vc=10*60*1e3;class Fc{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(i=>{this.isEventForConsumer(e,i)&&(n=!0,this.sendToConsumer(e,i),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Gc(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var i;if(e.error&&!qs(e)){const r=((i=e.error.code)===null||i===void 0?void 0:i.split("auth/")[1])||"internal-error";n.onError(Oe(this.auth,r))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const i=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&i}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Vc&&this.cachedEventUids.clear(),this.cachedEventUids.has(yr(e))}saveEventToCache(e){this.cachedEventUids.add(yr(e)),this.lastProcessedEventTime=Date.now()}}function yr(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function qs({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Gc(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return qs(t);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Uc(t,e={}){return Mt(t,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yc=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,jc=/^https?/;async function $c(t){if(t.config.emulator)return;const{authorizedDomains:e}=await Uc(t);for(const n of e)try{if(Kc(n))return}catch{}je(t,"unauthorized-domain")}function Kc(t){const e=di(),{protocol:n,hostname:i}=new URL(e);if(t.startsWith("chrome-extension://")){const o=new URL(t);return o.hostname===""&&i===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&o.hostname===i}if(!jc.test(n))return!1;if(Yc.test(t))return i===t;const r=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+r+"|"+r+")$","i").test(i)}/**
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
 */const Hc=new rn(3e4,6e4);function _r(){const t=Me().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function Wc(t){return new Promise((e,n)=>{var i,r,s;function o(){_r(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{_r(),n(Oe(t,"network-request-failed"))},timeout:Hc.get()})}if(!((r=(i=Me().gapi)===null||i===void 0?void 0:i.iframes)===null||r===void 0)&&r.Iframe)e(gapi.iframes.getContext());else if(!((s=Me().gapi)===null||s===void 0)&&s.load)o();else{const l=Ql("iframefcb");return Me()[l]=()=>{gapi.load?o():n(Oe(t,"network-request-failed"))},ql(`${Jl()}?onload=${l}`).catch(a=>n(a))}}).catch(e=>{throw gn=null,e})}let gn=null;function zc(t){return gn=gn||Wc(t),gn}/**
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
 */const qc=new rn(5e3,15e3),Jc="__/auth/iframe",Qc="emulator/auth/iframe",Xc={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Zc=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function eu(t){const e=t.config;M(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?ki(e,Qc):`https://${t.config.authDomain}/${Jc}`,i={apiKey:e.apiKey,appName:t.name,v:Ot},r=Zc.get(t.config.apiHost);r&&(i.eid=r);const s=t._getFrameworks();return s.length&&(i.fw=s.join(",")),`${n}?${nn(i).slice(1)}`}async function tu(t){const e=await zc(t),n=Me().gapi;return M(n,t,"internal-error"),e.open({where:document.body,url:eu(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Xc,dontclear:!0},i=>new Promise(async(r,s)=>{await i.restyle({setHideOnLeave:!1});const o=Oe(t,"network-request-failed"),l=Me().setTimeout(()=>{s(o)},qc.get());function a(){Me().clearTimeout(l),r(i)}i.ping(a).then(a,()=>{s(o)})}))}/**
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
 */const nu={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},iu=500,ru=600,su="_blank",ou="http://localhost";class vr{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function au(t,e,n,i=iu,r=ru){const s=Math.max((window.screen.availHeight-r)/2,0).toString(),o=Math.max((window.screen.availWidth-i)/2,0).toString();let l="";const a=Object.assign(Object.assign({},nu),{width:i.toString(),height:r.toString(),top:s,left:o}),u=me().toLowerCase();n&&(l=Ps(u)?su:n),Es(u)&&(e=e||ou,a.scrollbars="yes");const c=Object.entries(a).reduce((h,[f,m])=>`${h}${f}=${m},`,"");if(Ul(u)&&l!=="_self")return lu(e||"",l),new vr(null);const d=window.open(e||"",l,c);M(d,t,"popup-blocked");try{d.focus()}catch{}return new vr(d)}function lu(t,e){const n=document.createElement("a");n.href=t,n.target=e;const i=document.createEvent("MouseEvent");i.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(i)}/**
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
 */const cu="__/auth/handler",uu="emulator/auth/handler",du=encodeURIComponent("fac");async function Tr(t,e,n,i,r,s){M(t.config.authDomain,t,"auth-domain-config-required"),M(t.config.apiKey,t,"invalid-api-key");const o={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:i,v:Ot,eventId:r};if(e instanceof Bs){e.setDefaultLanguage(t.languageCode),o.providerId=e.providerId||"",da(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[c,d]of Object.entries({}))o[c]=d}if(e instanceof sn){const c=e.getScopes().filter(d=>d!=="");c.length>0&&(o.scopes=c.join(","))}t.tenantId&&(o.tid=t.tenantId);const l=o;for(const c of Object.keys(l))l[c]===void 0&&delete l[c];const a=await t._getAppCheckToken(),u=a?`#${du}=${encodeURIComponent(a)}`:"";return`${hu(t)}?${nn(l).slice(1)}${u}`}function hu({config:t}){return t.emulator?ki(t,uu):`https://${t.authDomain}/${cu}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ti="webStorageSupport";class pu{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=js,this._completeRedirectFn=Bc,this._overrideRedirectResult=Cc}async _openPopup(e,n,i,r){var s;$e((s=this.eventManagers[e._key()])===null||s===void 0?void 0:s.manager,"_initialize() not called before _openPopup()");const o=await Tr(e,n,i,di(),r);return au(e,o,xi())}async _openRedirect(e,n,i,r){await this._originValidation(e);const s=await Tr(e,n,i,di(),r);return gc(s),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:r,promise:s}=this.eventManagers[n];return r?Promise.resolve(r):($e(s,"If manager is not set, promise should be"),s)}const i=this.initAndGetManager(e);return this.eventManagers[n]={promise:i},i.catch(()=>{delete this.eventManagers[n]}),i}async initAndGetManager(e){const n=await tu(e),i=new Fc(e);return n.register("authEvent",r=>(M(r==null?void 0:r.authEvent,e,"invalid-auth-event"),{status:i.onEvent(r.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:i},this.iframes[e._key()]=n,i}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(ti,{type:ti},r=>{var s;const o=(s=r==null?void 0:r[0])===null||s===void 0?void 0:s[ti];o!==void 0&&n(!!o),je(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=$c(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return Ns()||Rs()||Mi()}}const fu=pu;var br="@firebase/auth",Ir="1.7.9";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mu{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(i=>{e((i==null?void 0:i.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){M(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gu(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function yu(t){Rt(new dt("auth",(e,{options:n})=>{const i=e.getProvider("app").getImmediate(),r=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:o,authDomain:l}=i.options;M(o&&!o.includes(":"),"invalid-api-key",{appName:i.name});const a={apiKey:o,authDomain:l,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Cs(t)},u=new Wl(i,r,s,a);return Zl(u,n),u},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,i)=>{e.getProvider("auth-internal").initialize()})),Rt(new dt("auth-internal",e=>{const n=Ni(e.getProvider("auth").getImmediate());return(i=>new mu(i))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),rt(br,Ir,gu(t)),rt(br,Ir,"esm2017")}/**
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
 */const _u=5*60,vu=us("authIdTokenMaxAge")||_u;let Ar=null;const Tu=t=>async e=>{const n=e&&await e.getIdTokenResult(),i=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(i&&i>vu)return;const r=n==null?void 0:n.token;Ar!==r&&(Ar=r,await fetch(t,{method:r?"POST":"DELETE",headers:r?{Authorization:`Bearer ${r}`}:{}}))};function bu(t=fs()){const e=Ei(t,"auth");if(e.isInitialized())return e.getImmediate();const n=Xl(t,{popupRedirectResolver:fu,persistence:[wc,Us,js]}),i=us("authTokenSyncURL");if(i&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(i,location.origin);if(location.origin===s.origin){const o=Tu(s.toString());cc(n,o,()=>o(n.currentUser)),lc(n,l=>o(l))}}const r=ls("auth");return r&&ec(n,`http://${r}`),n}function Iu(){var t,e;return(e=(t=document.getElementsByTagName("head"))===null||t===void 0?void 0:t[0])!==null&&e!==void 0?e:document}zl({loadJS(t){return new Promise((e,n)=>{const i=document.createElement("script");i.setAttribute("src",t),i.onload=e,i.onerror=r=>{const s=Oe("internal-error");s.customData=r,n(s)},i.type="text/javascript",i.charset="UTF-8",Iu().appendChild(i)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});yu("Browser");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ge{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}ge.UNAUTHENTICATED=new ge(null),ge.GOOGLE_CREDENTIALS=new ge("google-credentials-uid"),ge.FIRST_PARTY=new ge("first-party-uid"),ge.MOCK_USER=new ge("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Nt="10.14.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kt=new Si("@firebase/firestore");function En(t,...e){if(kt.logLevel<=j.DEBUG){const n=e.map(Vi);kt.debug(`Firestore (${Nt}): ${t}`,...n)}}function Bi(t,...e){if(kt.logLevel<=j.ERROR){const n=e.map(Vi);kt.error(`Firestore (${Nt}): ${t}`,...n)}}function Js(t,...e){if(kt.logLevel<=j.WARN){const n=e.map(Vi);kt.warn(`Firestore (${Nt}): ${t}`,...n)}}function Vi(t){if(typeof t=="string")return t;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
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
 */function le(t="Unexpected state"){const e=`FIRESTORE (${Nt}) INTERNAL ASSERTION FAILED: `+t;throw Bi(e),new Error(e)}function st(t,e){t||le()}function Fi(t,e){return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sr="ok",Au="cancelled",jt="unknown",$="invalid-argument",Su="deadline-exceeded",wu="not-found",Eu="permission-denied",fi="unauthenticated",Ru="resource-exhausted",Dt="failed-precondition",Pu="aborted",ku="out-of-range",Qs="unimplemented",Du="internal",Ou="unavailable";class B extends He{constructor(e,n){super(e,n),this.code=e,this.message=n,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xs{constructor(e,n){this.user=n,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class Mu{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,n){e.enqueueRetryable(()=>n(ge.UNAUTHENTICATED))}shutdown(){}}class Nu{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,n){this.changeListener=n,e.enqueueRetryable(()=>n(this.token.user))}shutdown(){this.changeListener=null}}class Cu{constructor(e){this.auth=null,e.onInit(n=>{this.auth=n})}getToken(){return this.auth?this.auth.getToken().then(e=>e?(st(typeof e.accessToken=="string"),new Xs(e.accessToken,new ge(this.auth.getUid()))):null):Promise.resolve(null)}invalidateToken(){}start(e,n){}shutdown(){}}class xu{constructor(e,n,i){this.t=e,this.i=n,this.o=i,this.type="FirstParty",this.user=ge.FIRST_PARTY,this.u=new Map}l(){return this.o?this.o():null}get headers(){this.u.set("X-Goog-AuthUser",this.t);const e=this.l();return e&&this.u.set("Authorization",e),this.i&&this.u.set("X-Goog-Iam-Authorization-Token",this.i),this.u}}class Lu{constructor(e,n,i){this.t=e,this.i=n,this.o=i}getToken(){return Promise.resolve(new xu(this.t,this.i,this.o))}start(e,n){e.enqueueRetryable(()=>n(ge.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class Bu{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class Vu{constructor(e){this.h=e,this.appCheck=null,e.onInit(n=>{this.appCheck=n})}getToken(){return this.appCheck?this.appCheck.getToken().then(e=>e?(st(typeof e.token=="string"),new Bu(e.token)):null):Promise.resolve(null)}invalidateToken(){}start(e,n){}shutdown(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fu{constructor(e,n,i,r,s,o,l,a,u){this.databaseId=e,this.appId=n,this.persistenceKey=i,this.host=r,this.ssl=s,this.forceLongPolling=o,this.autoDetectLongPolling=l,this.longPollingOptions=a,this.useFetchStreams=u}}class Jt{constructor(e,n){this.projectId=e,this.database=n||"(default)"}static empty(){return new Jt("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof Jt&&e.projectId===this.projectId&&e.database===this.database}}class Qt{constructor(e,n,i){n===void 0?n=0:n>e.length&&le(),i===void 0?i=e.length-n:i>e.length-n&&le(),this.segments=e,this.offset=n,this.len=i}get length(){return this.len}isEqual(e){return Qt.comparator(this,e)===0}child(e){const n=this.segments.slice(this.offset,this.limit());return e instanceof Qt?e.forEach(i=>{n.push(i)}):n.push(e),this.construct(n)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}forEach(e){for(let n=this.offset,i=this.limit();n<i;n++)e(this.segments[n])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,n){const i=Math.min(e.length,n.length);for(let r=0;r<i;r++){const s=e.get(r),o=n.get(r);if(s<o)return-1;if(s>o)return 1}return e.length<n.length?-1:e.length>n.length?1:0}}class fe extends Qt{construct(e,n,i){return new fe(e,n,i)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const n=[];for(const i of e){if(i.indexOf("//")>=0)throw new B($,`Invalid segment (${i}). Paths must not contain // in them.`);n.push(...i.split("/").filter(r=>r.length>0))}return new fe(n)}static emptyPath(){return new fe([])}}const Gu=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Pe extends Qt{construct(e,n,i){return new Pe(e,n,i)}static isValidIdentifier(e){return Gu.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Pe.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new Pe(["__name__"])}static fromServerFormat(e){const n=[];let i="",r=0;const s=()=>{if(i.length===0)throw new B($,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);n.push(i),i=""};let o=!1;for(;r<e.length;){const l=e[r];if(l==="\\"){if(r+1===e.length)throw new B($,"Path has trailing escape character: "+e);const a=e[r+1];if(a!=="\\"&&a!=="."&&a!=="`")throw new B($,"Path has invalid escape sequence: "+e);i+=a,r+=2}else l==="`"?(o=!o,r++):l!=="."||o?(i+=l,r++):(s(),r++)}if(s(),o)throw new B($,"Unterminated ` in path: "+e);return new Pe(n)}static emptyPath(){return new Pe([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ie{constructor(e){this.path=e}static fromPath(e){return new Ie(fe.fromString(e))}static fromName(e){return new Ie(fe.fromString(e).popFirst(5))}static empty(){return new Ie(fe.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&fe.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,n){return fe.comparator(e.path,n.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new Ie(new fe(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Uu(t,e,n){if(!n)throw new B($,`Function ${t}() cannot be called with an empty ${e}.`)}function wr(t){if(Ie.isDocumentKey(t))throw new B($,`Invalid collection reference. Collection references must have an odd number of segments, but ${t} has ${t.length}.`)}function Yu(t){if(t===void 0)return"undefined";if(t===null)return"null";if(typeof t=="string")return t.length>20&&(t=`${t.substring(0,20)}...`),JSON.stringify(t);if(typeof t=="number"||typeof t=="boolean")return""+t;if(typeof t=="object"){if(t instanceof Array)return"an array";{const e=function(i){return i.constructor?i.constructor.name:null}(t);return e?`a custom ${e} object`:"an object"}}return typeof t=="function"?"a function":le()}function Zs(t,e){if("_delegate"in t&&(t=t._delegate),!(t instanceof e)){if(e.name===t.constructor.name)throw new B($,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=Yu(t);throw new B($,`Expected type '${e.name}', but it was: ${n}`)}}return t}/**
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
 */function eo(t){const e={};return t.timeoutSeconds!==void 0&&(e.timeoutSeconds=t.timeoutSeconds),e}/**
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
 */let ln=null;function ju(){return ln===null?ln=function(){return 268435456+Math.round(2147483648*Math.random())}():ln++,"0x"+ln.toString(16)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $u(t){return t==null}function Er(t){return t===0&&1/t==-1/0}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ku={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Rr,F;function Pr(t){if(t===void 0)return Bi("RPC_ERROR","HTTP error has no status"),jt;switch(t){case 200:return Sr;case 400:return Dt;case 401:return fi;case 403:return Eu;case 404:return wu;case 409:return Pu;case 416:return ku;case 429:return Ru;case 499:return Au;case 500:return jt;case 501:return Qs;case 503:return Ou;case 504:return Su;default:return t>=200&&t<300?Sr:t>=400&&t<500?Dt:t>=500&&t<600?Du:jt}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(F=Rr||(Rr={}))[F.OK=0]="OK",F[F.CANCELLED=1]="CANCELLED",F[F.UNKNOWN=2]="UNKNOWN",F[F.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",F[F.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",F[F.NOT_FOUND=5]="NOT_FOUND",F[F.ALREADY_EXISTS=6]="ALREADY_EXISTS",F[F.PERMISSION_DENIED=7]="PERMISSION_DENIED",F[F.UNAUTHENTICATED=16]="UNAUTHENTICATED",F[F.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",F[F.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",F[F.ABORTED=10]="ABORTED",F[F.OUT_OF_RANGE=11]="OUT_OF_RANGE",F[F.UNIMPLEMENTED=12]="UNIMPLEMENTED",F[F.INTERNAL=13]="INTERNAL",F[F.UNAVAILABLE=14]="UNAVAILABLE",F[F.DATA_LOSS=15]="DATA_LOSS";class Hu extends class{constructor(n){this.databaseInfo=n,this.databaseId=n.databaseId;const i=n.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.m=i+"://"+n.host,this.A=`projects/${r}/databases/${s}`,this.T=this.databaseId.database==="(default)"?`project_id=${r}`:`project_id=${r}&database_id=${s}`}get R(){return!1}P(n,i,r,s,o){const l=ju(),a=this.V(n,i.toUriEncodedString());En("RestConnection",`Sending RPC '${n}' ${l}:`,a,r);const u={"google-cloud-resource-prefix":this.A,"x-goog-request-params":this.T};return this.I(u,s,o),this.p(n,a,u,r).then(c=>(En("RestConnection",`Received RPC '${n}' ${l}: `,c),c),c=>{throw Js("RestConnection",`RPC '${n}' ${l} failed with error: `,c,"url: ",a,"request:",r),c})}g(n,i,r,s,o,l){return this.P(n,i,r,s,o)}I(n,i,r){n["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+Nt}(),n["Content-Type"]="text/plain",this.databaseInfo.appId&&(n["X-Firebase-GMPID"]=this.databaseInfo.appId),i&&i.headers.forEach((s,o)=>n[o]=s),r&&r.headers.forEach((s,o)=>n[o]=s)}V(n,i){const r=Ku[n];return`${this.m}/v1/${i}:${r}`}terminate(){}}{constructor(e,n){super(e),this.F=n}v(e,n){throw new Error("Not supported by FetchConnection")}async p(e,n,i,r){var s;const o=JSON.stringify(r);let l;try{l=await this.F(n,{method:"POST",headers:i,body:o})}catch(a){const u=a;throw new B(Pr(u.status),"Request failed with error: "+u.statusText)}if(!l.ok){let a=await l.json();Array.isArray(a)&&(a=a[0]);const u=(s=a==null?void 0:a.error)===null||s===void 0?void 0:s.message;throw new B(Pr(l.status),`Request failed with error: ${u??l.statusText}`)}return l.json()}}function se(t,e){return t<e?-1:t>e?1:0}function Wu(t,e,n){return t.length===e.length&&t.every((i,r)=>n(i,e[r]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kr(t){let e=0;for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e++;return e}function Gi(t,e){for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e(n,t[n])}/**
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
 */class zu extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class Ke{constructor(e){this.binaryString=e}static fromBase64String(e){const n=function(r){try{return atob(r)}catch(s){throw typeof DOMException<"u"&&s instanceof DOMException?new zu("Invalid base64 string: "+s):s}}(e);return new Ke(n)}static fromUint8Array(e){const n=function(r){let s="";for(let o=0;o<r.length;++o)s+=String.fromCharCode(r[o]);return s}(e);return new Ke(n)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(n){return btoa(n)}(this.binaryString)}toUint8Array(){return function(n){const i=new Uint8Array(n.length);for(let r=0;r<n.length;r++)i[r]=n.charCodeAt(r);return i}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return se(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}Ke.EMPTY_BYTE_STRING=new Ke("");const qu=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function pt(t){if(st(!!t),typeof t=="string"){let e=0;const n=qu.exec(t);if(st(!!n),n[1]){let r=n[1];r=(r+"000000000").substr(0,9),e=Number(r)}const i=new Date(t);return{seconds:Math.floor(i.getTime()/1e3),nanos:e}}return{seconds:re(t.seconds),nanos:re(t.nanos)}}function re(t){return typeof t=="number"?t:typeof t=="string"?Number(t):0}function Xt(t){return typeof t=="string"?Ke.fromBase64String(t):Ke.fromUint8Array(t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ue{constructor(e,n){if(this.seconds=e,this.nanoseconds=n,n<0)throw new B($,"Timestamp nanoseconds out of range: "+n);if(n>=1e9)throw new B($,"Timestamp nanoseconds out of range: "+n);if(e<-62135596800)throw new B($,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new B($,"Timestamp seconds out of range: "+e)}static now(){return Ue.fromMillis(Date.now())}static fromDate(e){return Ue.fromMillis(e.getTime())}static fromMillis(e){const n=Math.floor(e/1e3),i=Math.floor(1e6*(e-1e3*n));return new Ue(n,i)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?se(this.nanoseconds,e.nanoseconds):se(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function to(t){var e,n;return((n=(((e=t==null?void 0:t.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||n===void 0?void 0:n.stringValue)==="server_timestamp"}function no(t){const e=t.mapValue.fields.__previous_value__;return to(e)?no(e):e}function Zt(t){const e=pt(t.mapValue.fields.__local_write_time__.timestampValue);return new Ue(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cn={};function ft(t){return"nullValue"in t?0:"booleanValue"in t?1:"integerValue"in t||"doubleValue"in t?2:"timestampValue"in t?3:"stringValue"in t?5:"bytesValue"in t?6:"referenceValue"in t?7:"geoPointValue"in t?8:"arrayValue"in t?9:"mapValue"in t?to(t)?4:function(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}(t)?9007199254740991:function(n){var i,r;return((r=(((i=n==null?void 0:n.mapValue)===null||i===void 0?void 0:i.fields)||{}).__type__)===null||r===void 0?void 0:r.stringValue)==="__vector__"}(t)?10:11:le()}function Rn(t,e){if(t===e)return!0;const n=ft(t);if(n!==ft(e))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return t.booleanValue===e.booleanValue;case 4:return Zt(t).isEqual(Zt(e));case 3:return function(r,s){if(typeof r.timestampValue=="string"&&typeof s.timestampValue=="string"&&r.timestampValue.length===s.timestampValue.length)return r.timestampValue===s.timestampValue;const o=pt(r.timestampValue),l=pt(s.timestampValue);return o.seconds===l.seconds&&o.nanos===l.nanos}(t,e);case 5:return t.stringValue===e.stringValue;case 6:return function(r,s){return Xt(r.bytesValue).isEqual(Xt(s.bytesValue))}(t,e);case 7:return t.referenceValue===e.referenceValue;case 8:return function(r,s){return re(r.geoPointValue.latitude)===re(s.geoPointValue.latitude)&&re(r.geoPointValue.longitude)===re(s.geoPointValue.longitude)}(t,e);case 2:return function(r,s){if("integerValue"in r&&"integerValue"in s)return re(r.integerValue)===re(s.integerValue);if("doubleValue"in r&&"doubleValue"in s){const o=re(r.doubleValue),l=re(s.doubleValue);return o===l?Er(o)===Er(l):isNaN(o)&&isNaN(l)}return!1}(t,e);case 9:return Wu(t.arrayValue.values||[],e.arrayValue.values||[],Rn);case 10:case 11:return function(r,s){const o=r.mapValue.fields||{},l=s.mapValue.fields||{};if(kr(o)!==kr(l))return!1;for(const a in o)if(o.hasOwnProperty(a)&&(l[a]===void 0||!Rn(o[a],l[a])))return!1;return!0}(t,e);default:return le()}}function en(t,e){return(t.values||[]).find(n=>Rn(n,e))!==void 0}function Pn(t,e){if(t===e)return 0;const n=ft(t),i=ft(e);if(n!==i)return se(n,i);switch(n){case 0:case 9007199254740991:return 0;case 1:return se(t.booleanValue,e.booleanValue);case 2:return function(s,o){const l=re(s.integerValue||s.doubleValue),a=re(o.integerValue||o.doubleValue);return l<a?-1:l>a?1:l===a?0:isNaN(l)?isNaN(a)?0:-1:1}(t,e);case 3:return Dr(t.timestampValue,e.timestampValue);case 4:return Dr(Zt(t),Zt(e));case 5:return se(t.stringValue,e.stringValue);case 6:return function(s,o){const l=Xt(s),a=Xt(o);return l.compareTo(a)}(t.bytesValue,e.bytesValue);case 7:return function(s,o){const l=s.split("/"),a=o.split("/");for(let u=0;u<l.length&&u<a.length;u++){const c=se(l[u],a[u]);if(c!==0)return c}return se(l.length,a.length)}(t.referenceValue,e.referenceValue);case 8:return function(s,o){const l=se(re(s.latitude),re(o.latitude));return l!==0?l:se(re(s.longitude),re(o.longitude))}(t.geoPointValue,e.geoPointValue);case 9:return Or(t.arrayValue,e.arrayValue);case 10:return function(s,o){var l,a,u,c;const d=s.fields||{},h=o.fields||{},f=(l=d.value)===null||l===void 0?void 0:l.arrayValue,m=(a=h.value)===null||a===void 0?void 0:a.arrayValue,p=se(((u=f==null?void 0:f.values)===null||u===void 0?void 0:u.length)||0,((c=m==null?void 0:m.values)===null||c===void 0?void 0:c.length)||0);return p!==0?p:Or(f,m)}(t.mapValue,e.mapValue);case 11:return function(s,o){if(s===cn&&o===cn)return 0;if(s===cn)return 1;if(o===cn)return-1;const l=s.fields||{},a=Object.keys(l),u=o.fields||{},c=Object.keys(u);a.sort(),c.sort();for(let d=0;d<a.length&&d<c.length;++d){const h=se(a[d],c[d]);if(h!==0)return h;const f=Pn(l[a[d]],u[c[d]]);if(f!==0)return f}return se(a.length,c.length)}(t.mapValue,e.mapValue);default:throw le()}}function Dr(t,e){if(typeof t=="string"&&typeof e=="string"&&t.length===e.length)return se(t,e);const n=pt(t),i=pt(e),r=se(n.seconds,i.seconds);return r!==0?r:se(n.nanos,i.nanos)}function Or(t,e){const n=t.values||[],i=e.values||[];for(let r=0;r<n.length&&r<i.length;++r){const s=Pn(n[r],i[r]);if(s)return s}return se(n.length,i.length)}function io(t){return!!t&&"arrayValue"in t}function Mr(t){return!!t&&"nullValue"in t}function Nr(t){return!!t&&"doubleValue"in t&&isNaN(Number(t.doubleValue))}function ni(t){return!!t&&"mapValue"in t}function $t(t){if(t.geoPointValue)return{geoPointValue:Object.assign({},t.geoPointValue)};if(t.timestampValue&&typeof t.timestampValue=="object")return{timestampValue:Object.assign({},t.timestampValue)};if(t.mapValue){const e={mapValue:{fields:{}}};return Gi(t.mapValue.fields,(n,i)=>e.mapValue.fields[n]=$t(i)),e}if(t.arrayValue){const e={arrayValue:{values:[]}};for(let n=0;n<(t.arrayValue.values||[]).length;++n)e.arrayValue.values[n]=$t(t.arrayValue.values[n]);return e}return Object.assign({},t)}class Cr{constructor(e,n){this.position=e,this.inclusive=n}}/**
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
 */class ro{}class Ce extends ro{constructor(e,n,i){super(),this.field=e,this.op=n,this.value=i}static create(e,n,i){return e.isKeyField()?n==="in"||n==="not-in"?this.createKeyFieldInFilter(e,n,i):new Ju(e,n,i):n==="array-contains"?new Zu(e,i):n==="in"?new ed(e,i):n==="not-in"?new td(e,i):n==="array-contains-any"?new nd(e,i):new Ce(e,n,i)}static createKeyFieldInFilter(e,n,i){return n==="in"?new Qu(e,i):new Xu(e,i)}matches(e){const n=e.data.field(this.field);return this.op==="!="?n!==null&&this.matchesComparison(Pn(n,this.value)):n!==null&&ft(this.value)===ft(n)&&this.matchesComparison(Pn(n,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return le()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Un extends ro{constructor(e,n){super(),this.filters=e,this.op=n,this.D=null}static create(e,n){return new Un(e,n)}matches(e){return function(i){return i.op==="and"}(this)?this.filters.find(n=>!n.matches(e))===void 0:this.filters.find(n=>n.matches(e))!==void 0}getFlattenedFilters(){return this.D!==null||(this.D=this.filters.reduce((e,n)=>e.concat(n.getFlattenedFilters()),[])),this.D}getFilters(){return Object.assign([],this.filters)}}class Ju extends Ce{constructor(e,n,i){super(e,n,i),this.key=Ie.fromName(i.referenceValue)}matches(e){const n=Ie.comparator(e.key,this.key);return this.matchesComparison(n)}}class Qu extends Ce{constructor(e,n){super(e,"in",n),this.keys=so("in",n)}matches(e){return this.keys.some(n=>n.isEqual(e.key))}}class Xu extends Ce{constructor(e,n){super(e,"not-in",n),this.keys=so("not-in",n)}matches(e){return!this.keys.some(n=>n.isEqual(e.key))}}function so(t,e){var n;return(((n=e.arrayValue)===null||n===void 0?void 0:n.values)||[]).map(i=>Ie.fromName(i.referenceValue))}class Zu extends Ce{constructor(e,n){super(e,"array-contains",n)}matches(e){const n=e.data.field(this.field);return io(n)&&en(n.arrayValue,this.value)}}class ed extends Ce{constructor(e,n){super(e,"in",n)}matches(e){const n=e.data.field(this.field);return n!==null&&en(this.value.arrayValue,n)}}class td extends Ce{constructor(e,n){super(e,"not-in",n)}matches(e){if(en(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const n=e.data.field(this.field);return n!==null&&!en(this.value.arrayValue,n)}}class nd extends Ce{constructor(e,n){super(e,"array-contains-any",n)}matches(e){const n=e.data.field(this.field);return!(!io(n)||!n.arrayValue.values)&&n.arrayValue.values.some(i=>en(this.value.arrayValue,i))}}/**
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
 */class mi{constructor(e,n="asc"){this.field=e,this.dir=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class de{constructor(e){this.timestamp=e}static fromTimestamp(e){return new de(e)}static min(){return new de(new Ue(0,0))}static max(){return new de(new Ue(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kn{constructor(e,n){this.comparator=e,this.root=n||ue.EMPTY}insert(e,n){return new kn(this.comparator,this.root.insert(e,n,this.comparator).copy(null,null,ue.BLACK,null,null))}remove(e){return new kn(this.comparator,this.root.remove(e,this.comparator).copy(null,null,ue.BLACK,null,null))}get(e){let n=this.root;for(;!n.isEmpty();){const i=this.comparator(e,n.key);if(i===0)return n.value;i<0?n=n.left:i>0&&(n=n.right)}return null}indexOf(e){let n=0,i=this.root;for(;!i.isEmpty();){const r=this.comparator(e,i.key);if(r===0)return n+i.left.size;r<0?i=i.left:(n+=i.left.size+1,i=i.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((n,i)=>(e(n,i),!1))}toString(){const e=[];return this.inorderTraversal((n,i)=>(e.push(`${n}:${i}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new un(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new un(this.root,e,this.comparator,!1)}getReverseIterator(){return new un(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new un(this.root,e,this.comparator,!0)}}class un{constructor(e,n,i,r){this.isReverse=r,this.nodeStack=[];let s=1;for(;!e.isEmpty();)if(s=n?i(e.key,n):1,n&&r&&(s*=-1),s<0)e=this.isReverse?e.left:e.right;else{if(s===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const n={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return n}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class ue{constructor(e,n,i,r,s){this.key=e,this.value=n,this.color=i??ue.RED,this.left=r??ue.EMPTY,this.right=s??ue.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,n,i,r,s){return new ue(e??this.key,n??this.value,i??this.color,r??this.left,s??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,n,i){let r=this;const s=i(e,r.key);return r=s<0?r.copy(null,null,null,r.left.insert(e,n,i),null):s===0?r.copy(null,n,null,null,null):r.copy(null,null,null,null,r.right.insert(e,n,i)),r.fixUp()}removeMin(){if(this.left.isEmpty())return ue.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,n){let i,r=this;if(n(e,r.key)<0)r.left.isEmpty()||r.left.isRed()||r.left.left.isRed()||(r=r.moveRedLeft()),r=r.copy(null,null,null,r.left.remove(e,n),null);else{if(r.left.isRed()&&(r=r.rotateRight()),r.right.isEmpty()||r.right.isRed()||r.right.left.isRed()||(r=r.moveRedRight()),n(e,r.key)===0){if(r.right.isEmpty())return ue.EMPTY;i=r.right.min(),r=r.copy(i.key,i.value,null,null,r.right.removeMin())}r=r.copy(null,null,null,null,r.right.remove(e,n))}return r.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,ue.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,ue.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),n=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,n)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw le();const e=this.left.check();if(e!==this.right.check())throw le();return e+(this.isRed()?0:1)}}ue.EMPTY=null,ue.RED=!0,ue.BLACK=!1;ue.EMPTY=new class{constructor(){this.size=0}get key(){throw le()}get value(){throw le()}get color(){throw le()}get left(){throw le()}get right(){throw le()}copy(e,n,i,r,s){return this}insert(e,n,i){return new ue(e,n)}remove(e,n){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dn{constructor(e){this.comparator=e,this.data=new kn(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((n,i)=>(e(n),!1))}forEachInRange(e,n){const i=this.data.getIteratorFrom(e[0]);for(;i.hasNext();){const r=i.getNext();if(this.comparator(r.key,e[1])>=0)return;n(r.key)}}forEachWhile(e,n){let i;for(i=n!==void 0?this.data.getIteratorFrom(n):this.data.getIterator();i.hasNext();)if(!e(i.getNext().key))return}firstAfterOrEqual(e){const n=this.data.getIteratorFrom(e);return n.hasNext()?n.getNext().key:null}getIterator(){return new xr(this.data.getIterator())}getIteratorFrom(e){return new xr(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let n=this;return n.size<e.size&&(n=e,e=this),e.forEach(i=>{n=n.add(i)}),n}isEqual(e){if(!(e instanceof Dn)||this.size!==e.size)return!1;const n=this.data.getIterator(),i=e.data.getIterator();for(;n.hasNext();){const r=n.getNext().key,s=i.getNext().key;if(this.comparator(r,s)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(n=>{e.push(n)}),e}toString(){const e=[];return this.forEach(n=>e.push(n)),"SortedSet("+e.toString()+")"}copy(e){const n=new Dn(this.comparator);return n.data=e,n}}class xr{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xe{constructor(e){this.value=e}static empty(){return new xe({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let n=this.value;for(let i=0;i<e.length-1;++i)if(n=(n.mapValue.fields||{})[e.get(i)],!ni(n))return null;return n=(n.mapValue.fields||{})[e.lastSegment()],n||null}}set(e,n){this.getFieldsMap(e.popLast())[e.lastSegment()]=$t(n)}setAll(e){let n=Pe.emptyPath(),i={},r=[];e.forEach((o,l)=>{if(!n.isImmediateParentOf(l)){const a=this.getFieldsMap(n);this.applyChanges(a,i,r),i={},r=[],n=l.popLast()}o?i[l.lastSegment()]=$t(o):r.push(l.lastSegment())});const s=this.getFieldsMap(n);this.applyChanges(s,i,r)}delete(e){const n=this.field(e.popLast());ni(n)&&n.mapValue.fields&&delete n.mapValue.fields[e.lastSegment()]}isEqual(e){return Rn(this.value,e.value)}getFieldsMap(e){let n=this.value;n.mapValue.fields||(n.mapValue={fields:{}});for(let i=0;i<e.length;++i){let r=n.mapValue.fields[e.get(i)];ni(r)&&r.mapValue.fields||(r={mapValue:{fields:{}}},n.mapValue.fields[e.get(i)]=r),n=r}return n.mapValue.fields}applyChanges(e,n,i){Gi(n,(r,s)=>e[r]=s);for(const r of i)delete e[r]}clone(){return new xe($t(this.value))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Je{constructor(e,n,i,r,s,o,l){this.key=e,this.documentType=n,this.version=i,this.readTime=r,this.createTime=s,this.data=o,this.documentState=l}static newInvalidDocument(e){return new Je(e,0,de.min(),de.min(),de.min(),xe.empty(),0)}static newFoundDocument(e,n,i,r){return new Je(e,1,n,de.min(),i,r,0)}static newNoDocument(e,n){return new Je(e,2,n,de.min(),de.min(),xe.empty(),0)}static newUnknownDocument(e,n){return new Je(e,3,n,de.min(),de.min(),xe.empty(),2)}convertToFoundDocument(e,n){return!this.createTime.isEqual(de.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=n,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=xe.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=xe.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=de.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof Je&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Je(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class id{constructor(e,n=null,i=[],r=[],s=null,o=null,l=null){this.path=e,this.collectionGroup=n,this.orderBy=i,this.filters=r,this.limit=s,this.startAt=o,this.endAt=l,this.C=null}}function Lr(t,e=null,n=[],i=[],r=null,s=null,o=null){return new id(t,e,n,i,r,s,o)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rd{constructor(e,n=null,i=[],r=[],s=null,o="F",l=null,a=null){this.path=e,this.collectionGroup=n,this.explicitOrderBy=i,this.filters=r,this.limit=s,this.limitType=o,this.startAt=l,this.endAt=a,this.S=null,this.N=null,this.O=null,this.startAt,this.endAt}}function sd(t){const e=Fi(t);if(e.S===null){e.S=[];const n=new Set;for(const s of e.explicitOrderBy)e.S.push(s),n.add(s.field.canonicalString());const i=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let l=new Dn(Pe.comparator);return o.filters.forEach(a=>{a.getFlattenedFilters().forEach(u=>{u.isInequality()&&(l=l.add(u.field))})}),l})(e).forEach(s=>{n.has(s.canonicalString())||s.isKeyField()||e.S.push(new mi(s,i))}),n.has(Pe.keyField().canonicalString())||e.S.push(new mi(Pe.keyField(),i))}return e.S}function od(t){const e=Fi(t);return e.N||(e.N=ad(e,sd(t))),e.N}function ad(t,e){if(t.limitType==="F")return Lr(t.path,t.collectionGroup,e,t.filters,t.limit,t.startAt,t.endAt);{e=e.map(r=>{const s=r.dir==="desc"?"asc":"desc";return new mi(r.field,s)});const n=t.endAt?new Cr(t.endAt.position,t.endAt.inclusive):null,i=t.startAt?new Cr(t.startAt.position,t.startAt.inclusive):null;return Lr(t.path,t.collectionGroup,e,t.filters,t.limit,n,i)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ld={asc:"ASCENDING",desc:"DESCENDING"},cd={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},ud={and:"AND",or:"OR"};class dd{constructor(e,n){this.databaseId=e,this.useProto3Json=n}}function Br(t){return st(!!t),de.fromTimestamp(function(n){const i=pt(n);return new Ue(i.seconds,i.nanos)}(t))}function hd(t,e){return gi(t,e).canonicalString()}function gi(t,e){const n=function(r){return new fe(["projects",r.projectId,"databases",r.database])}(t).child("documents");return e===void 0?n:n.child(e)}function pd(t,e){const n=function(r){const s=fe.fromString(r);return st(ao(s)),s}(e);if(n.get(1)!==t.databaseId.projectId)throw new B($,"Tried to deserialize key from different project: "+n.get(1)+" vs "+t.databaseId.projectId);if(n.get(3)!==t.databaseId.database)throw new B($,"Tried to deserialize key from different database: "+n.get(3)+" vs "+t.databaseId.database);return new Ie(function(r){return st(r.length>4&&r.get(4)==="documents"),r.popFirst(5)}(n))}function fd(t,e){const n={structuredQuery:{}},i=e.path;let r;e.collectionGroup!==null?(r=i,n.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(r=i.popLast(),n.structuredQuery.from=[{collectionId:i.lastSegment()}]),n.parent=function(u,c){return hd(u.databaseId,c)}(t,r);const s=function(u){if(u.length!==0)return oo(Un.create(u,"and"))}(e.filters);s&&(n.structuredQuery.where=s);const o=function(u){if(u.length!==0)return u.map(c=>function(h){return{field:vt(h.field),direction:md(h.dir)}}(c))}(e.orderBy);o&&(n.structuredQuery.orderBy=o);const l=function(u,c){return u.useProto3Json||$u(c)?c:{value:c}}(t,e.limit);return l!==null&&(n.structuredQuery.limit=l),e.startAt&&(n.structuredQuery.startAt=function(u){return{before:u.inclusive,values:u.position}}(e.startAt)),e.endAt&&(n.structuredQuery.endAt=function(u){return{before:!u.inclusive,values:u.position}}(e.endAt)),{B:n,parent:r}}function md(t){return ld[t]}function gd(t){return cd[t]}function yd(t){return ud[t]}function vt(t){return{fieldPath:t.canonicalString()}}function oo(t){return t instanceof Ce?function(n){if(n.op==="=="){if(Nr(n.value))return{unaryFilter:{field:vt(n.field),op:"IS_NAN"}};if(Mr(n.value))return{unaryFilter:{field:vt(n.field),op:"IS_NULL"}}}else if(n.op==="!="){if(Nr(n.value))return{unaryFilter:{field:vt(n.field),op:"IS_NOT_NAN"}};if(Mr(n.value))return{unaryFilter:{field:vt(n.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:vt(n.field),op:gd(n.op),value:n.value}}}(t):t instanceof Un?function(n){const i=n.getFilters().map(r=>oo(r));return i.length===1?i[0]:{compositeFilter:{op:yd(n.op),filters:i}}}(t):le()}function ao(t){return t.length>=4&&t.get(0)==="projects"&&t.get(2)==="databases"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _d(t){return new dd(t,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vd extends class{}{constructor(e,n,i,r){super(),this.authCredentials=e,this.appCheckCredentials=n,this.connection=i,this.serializer=r,this.Y=!1}Z(){if(this.Y)throw new B(Dt,"The client has already been terminated.")}P(e,n,i,r){return this.Z(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,o])=>this.connection.P(e,gi(n,i),r,s,o)).catch(s=>{throw s.name==="FirebaseError"?(s.code===fi&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),s):new B(jt,s.toString())})}g(e,n,i,r,s){return this.Z(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,l])=>this.connection.g(e,gi(n,i),r,o,l,s)).catch(o=>{throw o.name==="FirebaseError"?(o.code===fi&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new B(jt,o.toString())})}terminate(){this.Y=!0,this.connection.terminate()}}async function Td(t,e){const n=Fi(t),{B:i,parent:r}=fd(n.serializer,od(e));return(await n.g("RunQuery",n.serializer.databaseId,r,{structuredQuery:i.structuredQuery})).filter(s=>!!s.document).map(s=>function(l,a,u){const c=pd(l,a.name),d=Br(a.updateTime),h=a.createTime?Br(a.createTime):de.min(),f=new xe({mapValue:{fields:a.fields}}),m=Je.newFoundDocument(c,d,h,f);return u?m.setHasCommittedMutations():m}(n.serializer,s.document,void 0))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kt=new Map;function bd(t){if(t._terminated)throw new B(Dt,"The client has already been terminated.");if(!Kt.has(t)){En("ComponentProvider","Initializing Datastore");const e=function(s){return new Hu(s,fetch.bind(null))}(function(s,o,l,a){return new Fu(s,o,l,a.host,a.ssl,a.experimentalForceLongPolling,a.experimentalAutoDetectLongPolling,eo(a.experimentalLongPollingOptions),a.useFetchStreams)}(t._databaseId,t.app.options.appId||"",t._persistenceKey,t._freezeSettings())),n=_d(t._databaseId),i=function(s,o,l,a){return new vd(s,o,l,a)}(t._authCredentials,t._appCheckCredentials,e,n);Kt.set(t,i)}return Kt.get(t)}class Vr{constructor(e){var n,i;if(e.host===void 0){if(e.ssl!==void 0)throw new B($,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(n=e.ssl)===null||n===void 0||n;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new B($,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}(function(s,o,l,a){if(o===!0&&a===!0)throw new B($,`${s} and ${l} cannot be used together.`)})("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=eo((i=e.experimentalLongPollingOptions)!==null&&i!==void 0?i:{}),function(s){if(s.timeoutSeconds!==void 0){if(isNaN(s.timeoutSeconds))throw new B($,`invalid long polling timeout: ${s.timeoutSeconds} (must not be NaN)`);if(s.timeoutSeconds<5)throw new B($,`invalid long polling timeout: ${s.timeoutSeconds} (minimum allowed value is 5)`);if(s.timeoutSeconds>30)throw new B($,`invalid long polling timeout: ${s.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(i,r){return i.timeoutSeconds===r.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Ui{constructor(e,n,i,r){this._authCredentials=e,this._appCheckCredentials=n,this._databaseId=i,this._app=r,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Vr({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new B(Dt,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new B(Dt,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Vr(e),e.credentials!==void 0&&(this._authCredentials=function(i){if(!i)return new Mu;switch(i.type){case"firstParty":return new Lu(i.sessionIndex||"0",i.iamToken||null,i.authTokenFactory||null);case"provider":return i.client;default:throw new B($,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(n){const i=Kt.get(n);i&&(En("ComponentProvider","Removing Datastore"),Kt.delete(n),i.terminate())}(this),Promise.resolve()}}function Id(t,e){const n=typeof t=="object"?t:fs(),i=typeof t=="string"?t:e||"(default)",r=Ei(n,"firestore/lite").getImmediate({identifier:i});if(!r._initialized){const s=Xo("firestore");s&&Ad(r,...s)}return r}function Ad(t,e,n,i={}){var r;const s=(t=Zs(t,Ui))._getSettings(),o=`${e}:${n}`;if(s.host!=="firestore.googleapis.com"&&s.host!==o&&Js("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),t._setSettings(Object.assign(Object.assign({},s),{host:o,ssl:!1})),i.mockUserToken){let l,a;if(typeof i.mockUserToken=="string")l=i.mockUserToken,a=ge.MOCK_USER;else{l=ea(i.mockUserToken,(r=t._app)===null||r===void 0?void 0:r.options.projectId);const u=i.mockUserToken.sub||i.mockUserToken.user_id;if(!u)throw new B($,"mockUserToken must contain 'sub' or 'user_id' field!");a=new ge(u)}t._authCredentials=new Nu(new Xs(l,a))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yn{constructor(e,n,i){this.converter=n,this._query=i,this.type="query",this.firestore=e}withConverter(e){return new Yn(this.firestore,e,this._query)}}class Ct{constructor(e,n,i){this.converter=n,this._key=i,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new wt(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new Ct(this.firestore,e,this._key)}}class wt extends Yn{constructor(e,n,i){super(e,n,function(s){return new rd(s)}(i)),this._path=i,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new Ct(this.firestore,null,new Ie(e))}withConverter(e){return new wt(this.firestore,e,this._path)}}function Sd(t,e,...n){if(t=Ne(t),Uu("collection","path",e),t instanceof Ui){const i=fe.fromString(e,...n);return wr(i),new wt(t,null,i)}{if(!(t instanceof Ct||t instanceof wt))throw new B($,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const i=t._path.child(fe.fromString(e,...n));return wr(i),new wt(t.firestore,null,i)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class On{constructor(e){this._byteString=e}static fromBase64String(e){try{return new On(Ke.fromBase64String(e))}catch(n){throw new B($,"Failed to construct data from Base64 string: "+n)}}static fromUint8Array(e){return new On(Ke.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lo{constructor(...e){for(let n=0;n<e.length;++n)if(e[n].length===0)throw new B($,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Pe(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wd{constructor(e,n){if(!isFinite(e)||e<-90||e>90)throw new B($,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(n)||n<-180||n>180)throw new B($,"Longitude must be a number between -180 and 180, but was: "+n);this._lat=e,this._long=n}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return se(this._lat,e._lat)||se(this._long,e._long)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class Ed{constructor(e){this._values=(e||[]).map(n=>n)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(i,r){if(i.length!==r.length)return!1;for(let s=0;s<i.length;++s)if(i[s]!==r[s])return!1;return!0}(this._values,e._values)}}const Rd=new RegExp("[~\\*/\\[\\]]");function Pd(t,e,n){if(e.search(Rd)>=0)throw Fr(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,t);try{return new lo(...e.split("."))._internalPath}catch{throw Fr(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,t)}}function Fr(t,e,n,i,r){let s=`Function ${e}() called with invalid data`;s+=". ";let o="";return new B($,s+t+o)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kd{constructor(e,n,i,r,s){this._firestore=e,this._userDataWriter=n,this._key=i,this._document=r,this._converter=s}get id(){return this._key.path.lastSegment()}get ref(){return new Ct(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new co(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const n=this._document.data.field(Od("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n)}}}class co extends kd{data(){return super.data()}}class Dd{constructor(e,n){this._docs=n,this.query=e}get docs(){return[...this._docs]}get size(){return this.docs.length}get empty(){return this.docs.length===0}forEach(e,n){this._docs.forEach(e,n)}}function Od(t,e){return typeof e=="string"?Pd(t,e):e instanceof lo?e._internalPath:e._delegate._internalPath}class Md extends class{convertValue(n,i="none"){switch(ft(n)){case 0:return null;case 1:return n.booleanValue;case 2:return re(n.integerValue||n.doubleValue);case 3:return this.convertTimestamp(n.timestampValue);case 4:return this.convertServerTimestamp(n,i);case 5:return n.stringValue;case 6:return this.convertBytes(Xt(n.bytesValue));case 7:return this.convertReference(n.referenceValue);case 8:return this.convertGeoPoint(n.geoPointValue);case 9:return this.convertArray(n.arrayValue,i);case 11:return this.convertObject(n.mapValue,i);case 10:return this.convertVectorValue(n.mapValue);default:throw le()}}convertObject(n,i){return this.convertObjectMap(n.fields,i)}convertObjectMap(n,i="none"){const r={};return Gi(n,(s,o)=>{r[s]=this.convertValue(o,i)}),r}convertVectorValue(n){var i,r,s;const o=(s=(r=(i=n.fields)===null||i===void 0?void 0:i.value.arrayValue)===null||r===void 0?void 0:r.values)===null||s===void 0?void 0:s.map(l=>re(l.doubleValue));return new Ed(o)}convertGeoPoint(n){return new wd(re(n.latitude),re(n.longitude))}convertArray(n,i){return(n.values||[]).map(r=>this.convertValue(r,i))}convertServerTimestamp(n,i){switch(i){case"previous":const r=no(n);return r==null?null:this.convertValue(r,i);case"estimate":return this.convertTimestamp(Zt(n));default:return null}}convertTimestamp(n){const i=pt(n);return new Ue(i.seconds,i.nanos)}convertDocumentKey(n,i){const r=fe.fromString(n);st(ao(r));const s=new Jt(r.get(1),r.get(3)),o=new Ie(r.popFirst(5));return s.isEqual(i)||Bi(`Document ${o} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${i.projectId}/${i.database}) instead.`),o}}{constructor(e){super(),this.firestore=e}convertBytes(e){return new On(e)}convertReference(e){const n=this.convertDocumentKey(e,this.firestore._databaseId);return new Ct(this.firestore,null,n)}}function Nd(t){(function(r){if(r.limitType==="L"&&r.explicitOrderBy.length===0)throw new B(Qs,"limitToLast() queries require specifying at least one orderBy() clause")})((t=Zs(t,Yn))._query);const e=bd(t.firestore),n=new Md(t.firestore);return Td(e,t._query).then(i=>{const r=i.map(s=>new co(t.firestore,n,s.key,s,t.converter));return t._query.limitType==="L"&&r.reverse(),new Dd(t,r)})}(function(){(function(n){Nt=n})(`${Ot}_lite`),Rt(new dt("firestore/lite",(e,{instanceIdentifier:n,options:i})=>{const r=e.getProvider("app").getImmediate(),s=new Ui(new Cu(e.getProvider("auth-internal")),new Vu(e.getProvider("app-check-internal")),function(l,a){if(!Object.prototype.hasOwnProperty.apply(l.options,["projectId"]))throw new B($,'"projectId" not provided in firebase.initializeApp.');return new Jt(l.options.projectId,a)}(r,n),r);return i&&s._setSettings(i),s},"PUBLIC").setMultipleInstances(!0)),rt("firestore-lite","4.7.3",""),rt("firestore-lite","4.7.3","esm2017")})();const uo=Object.freeze({apiKey:"AIzaSyBdbve0H70D-Ch69WlaxEly7PVBFVRB5p0",authDomain:"pensiontools-4b237.firebaseapp.com",projectId:"pensiontools-4b237",storageBucket:"pensiontools-4b237.firebasestorage.app",messagingSenderId:"760877353696",appId:"1:760877353696:web:2d6f7173c8d7fab6fd9e85"});function Cd(){return uo.apiKey!=="YOUR_API_KEY"}const xd=3;function Ld(t){const e=t&&typeof t=="object"?t.schemaVersion:void 0;return Number.isInteger(e)&&e>=0?e:0}const Bd="6.22.0",ho="pots-and-valves",Mn={"pots-and-valves":[],"buckets-in-order":["bucketBand"],"bridge-and-engine":["bridgeAge","cashYears"],"ladder-and-ratchet":["ladderYears","drawAnnual","triggerMode","bandThreshold"],"floor-and-flex":["essentialsAnnual","horizonAge","sleeveRate","treatsRule","ratchet"],"floor-the-schedule":[],"floor-to-age":["floorToAge","borrowedFloor"],"full-il-gilt":["cashYears","bridgeCash"],"gilt-rotation":["cashYears","bridgeCash","rotateCutAge","rotateTrigger","rotateDisarmYears"]},Vd=["sippTotal","isaTotal"],Yi=t=>Object.prototype.hasOwnProperty.call(Mn,t),Gr=t=>!!t&&typeof t=="object"&&!Array.isArray(t),po=t=>{const e={};for(const[n,i]of Object.entries(t||{}))i!==void 0&&(e[n]=i);return e},Fd=t=>Array.isArray(t)?t.filter(Boolean).map(e=>po(e)):[];function Ur(t){return Yi(t)?Mn[t].slice():[]}function fo(t){return t===ho?Ur(t):[...Ur(t),...Vd]}function Gd(t,e){const n=e&&typeof e=="object"?e:{};if(!Yi(t))return po(n);const i={};for(const r of fo(t))n[r]!==void 0&&(i[r]=n[r]);return i}function Ud(t){return t.allocMode||(Array.isArray(t.taggedFunds)&&t.taggedFunds.length?"funds":"risk")}function Yd(t){const e=t||{},n=e.strategyId||ho;if(!Yi(n)||Gr(e.strategyState)&&Object.keys(e.strategyState).length)return e;const i=Gr(e.strategyParams)?e.strategyParams:{},r=new Set(fo(n));if(!Object.keys(i).some(o=>i[o]!==void 0&&!r.has(o)))return e;const s={};for(const o of Object.keys(Mn))o===n||!Mn[o].some(l=>i[l]!==void 0)||(s[o]={strategyParams:Gd(o,i),allocMode:Ud(e),taggedFunds:Fd(e.taggedFunds),savedAt:null});return Object.keys(s).length?{...e,strategyState:s}:e}const ji=1,jd=["typed","paste","imported","none"],$d=["fund","gilt","cash"];function Ae(t){if(t===""||t==null)return null;const e=typeof t=="number"?t:+String(t).replace(/[£$€,\s]/g,"");return Number.isFinite(e)?e:null}const dn=(t,{upper:e=!1}={})=>{const n=String(t??"").trim();return n?e?n.toUpperCase():n:null};function mo(t){const e=String(t??"").trim().slice(0,10);return/^\d{4}-\d{2}-\d{2}$/.test(e)?e:null}function jn(t){const e=String(t??"").trim().toUpperCase();return e==="ISA"||e==="LISA"||e==="S&S ISA"||e==="STOCKS AND SHARES ISA"?"ISA":e==="GIA"||e==="TAXABLE"||e==="DEALING"||e==="GENERAL"||e==="TRADING"?"GIA":e==="CASH"||e==="BANK"||e==="SAVINGS"?"CASH":"SIPP"}function Kd(){return{version:ji,updatedAt:null,source:"none",offerDismissed:!1,lines:[]}}function Hd(t){const e=t&&typeof t=="object"?t:{},n=dn(e.ticker,{upper:!0}),i=dn(e.name),r=dn(e.sedol,{upper:!0});if(!n&&!i&&!r)return null;const s=$d.includes(e.kind)?e.kind:null;return{wrapper:jn(e.wrapper),ticker:n,name:i,sedol:r,units:Ae(e.units),value:Ae(e.value),ocf:Ae(e.ocf),contribution:Ae(e.contribution),subClass:dn(e.subClass),kind:s,asOf:mo(e.asOf)}}function xt(t){if(Array.isArray(t))return xt({lines:t});if(!t||typeof t!="object")return Kd();const e=(Array.isArray(t.lines)?t.lines:[]).map(Hd).filter(Boolean),n=jd.includes(t.source)?t.source:e.length?"typed":"none";return{version:ji,updatedAt:mo(t.updatedAt),source:n,offerDismissed:t.offerDismissed===!0,lines:e}}function Lt(t){return Array.isArray(t)?t:t&&typeof t=="object"&&Array.isArray(t.lines)?t.lines:[]}function Wd(t){const e=Lt(t),n={SIPP:0,ISA:0,GIA:0,CASH:0};let i=0;for(const r of e){const s=Ae(r&&r.value);s!=null&&(i+=s,n[jn(r.wrapper)]+=s)}return{count:e.length,total:i,byWrapper:n}}const J=t=>!!t&&typeof t=="object"&&!Array.isArray(t),zd=t=>{if(!J(t))return!1;const e=Object.getPrototypeOf(t);return e===Object.prototype||e===null};function Nn(t){if(Array.isArray(t))return t.map(Nn);if(zd(t)){const e={};for(const n of Object.keys(t))e[n]=Nn(t[n]);return e}return t}const qd=t=>{const e=t instanceof Date?t:new Date(t??Date.now());return Number.isFinite(e.getTime())?e.toISOString():new Date().toISOString()},lt=t=>{const e=JSON.stringify(t);return e===void 0?"undefined":e};function Jd(t){const e=t&&J(t.decisionTool)?t.decisionTool:null;return e?J(e.settings)&&e.settings.locked||Array.isArray(e.history)&&e.history.length?!0:J(e.taxYears)&&Object.values(e.taxYears).some(n=>n&&n.yearSetupComplete):!1}function $i(t){const e=t&&J(t.decisionTool)?t.decisionTool:null;return!!(e&&J(e.settings)&&e.settings.locked)}const Qd=2,Yr=t=>lt(t&&J(t.stressTool)?t.stressTool.settings:void 0);function jr(t){const e=t||{},n=J(e.decisionTool)?e.decisionTool:{},i={planDocument:lt(e.planDocument),planDocumentArchive:lt(e.planDocumentArchive),"decisionTool.planOfRecord":lt(n.planOfRecord),"decisionTool.planOfRecordArchive":lt(n.planOfRecordArchive),"decisionTool.history":lt(n.history)};return Jd(e)&&(i["decisionTool.settings"]=lt(n.settings)),i}function Xd(t,{now:e}){if(!J(t.strategy)){const r=typeof t.createdAt=="string"&&t.createdAt?t.createdAt:typeof t.lastModified=="string"&&t.lastModified?t.lastModified:qd(e);t.strategy={id:"pots-and-valves",params:{},lockedAt:r,engineVersion:Bd}}const n=J(t.stressTool)&&J(t.stressTool.settings)?t.stressTool.settings:null;if(n){for(const[s,o]of[["pacwMin","equityMin"],["cgtMin","bondMin"],["csh2Target","cashTarget"]])n[s]!==void 0&&n[o]===void 0&&(n[o]=n[s]);const r=Yd(n);r!==n&&J(r.strategyState)&&(n.strategyState=Nn(r.strategyState))}const i=t.holdings;return(Array.isArray(i)||J(i)&&i.version!==ji)&&(t.holdings={...J(i)?i:{},...xt(i)}),t}function Zd(t){if($i(t))return t;const e=J(t.stressTool)&&J(t.stressTool.settings)?t.stressTool.settings:null;return e&&(Oo(e.chargesPct)||(e.chargesPct=is)),t}function eh(t){if($i(t))return t;const e=J(t.stressTool)&&J(t.stressTool.settings)?t.stressTool.settings:null;return e&&(Mo(e.isaGrowth)||(e.isaGrowth=rs),th(t,e)&&(e.isaBalance=0)),t}function th(t,e){const n=J(t.fromAnswer)&&Array.isArray(t.fromAnswer.people)&&J(t.fromAnswer.people[0])?t.fromAnswer.people[0]:null,i=n&&J(n.savings)?n.savings:null,r=i&&J(i.atStop)&&typeof i.atStop.middling=="number"?i.atStop.middling:NaN,s=J(e.potAtRetirement)?e.potAtRetirement:null;return!!i&&i.today===0&&r>0&&e.retired===!1&&!!s&&s.source==="override"&&s.isa===r&&e.isaBalance===r}const nh=[{to:1,name:"Version stamp; strategy block, renamed Stress keys, per-strategy settings and holdings shape written once",up:Xd},{to:2,name:"Fund and platform charges: 0.5% a year written into every unlocked plan; locked plans untouched",up:Zd},{to:3,name:'How ISAs and savings grow: "Mostly cash" written into every unlocked plan; locked plans untouched',up:eh}];function ih(t,{now:e=new Date,migrations:n=nh,target:i=xd}={}){const r=Ld(t),s={scenario:t,from:r,to:r,changed:!1,error:null,newer:!1};if(!J(t))return s;if(r>i)return{...s,newer:!0};if(r===i)return s;try{const o=jr(t);let l=Nn(t),a=r;for(const d of n){if(!(d.to>a))continue;if(d.to!==a+1)throw new Error("Migration chain has a gap: no step from version "+a+" to "+(a+1));const h=d.to>=Qd&&$i(l)?Yr(l):null,f=d.up(l,{now:e});if(f!==void 0&&(l=f),!J(l))throw new Error("Migration to version "+d.to+" did not return a plan");if(h!==null&&Yr(l)!==h)throw new Error("Migration to version "+d.to+" changed the Stress settings of a locked plan, which no migration may touch");if(l.schemaVersion=d.to,a=d.to,a===i)break}if(a!==i)throw new Error("Migration chain stops at version "+a+", short of "+i);const u=Object.keys(t).filter(d=>!(d in l));if(u.length)throw new Error("Migration dropped root key(s): "+u.join(", "));const c=jr(l);for(const d of Object.keys(o))if(c[d]!==o[d])throw new Error("Migration changed "+d+", which no migration may touch");return{scenario:l,from:r,to:a,changed:!0,error:null,newer:!1}}catch(o){return{...s,error:o instanceof Error?o:new Error(String(o))}}}const $r=["decisionSettings","stressSettings","name","description","taxYears"],yn=t=>t&&typeof t=="object"&&!Array.isArray(t);function rh(t,e,n){const i=e.split(".");let r=t;for(let s=0;s<i.length-1;s++){const o=i[s];r[o]=yn(r[o])?{...r[o]}:{},r=r[o]}r[i[i.length-1]]=n}function sh(t){if(!t||typeof t!="object")return{scenario:t,migrated:!1};const e=Object.keys(t).filter(a=>a.includes(".")),n=$r.some(a=>a in t);if(!(e.length>0||n))return{scenario:t,migrated:!1};const r={};for(const[a,u]of Object.entries(t))!a.includes(".")&&!$r.includes(a)&&(r[a]=u);for(const a of e)rh(r,a,t[a]);r.isActive=r.isActive??!1,r.enabledTools=r.enabledTools||["stress","decision"];const s=yn(r.planDetails)?r.planDetails:{};r.planDetails={...s,name:s.name??t.name??"My Plan",description:s.description??t.description??""};const o=yn(r.decisionTool)?r.decisionTool:{};r.decisionTool={...o,settings:o.settings??t.decisionSettings??{},history:o.history??[],taxYears:o.taxYears??t.taxYears??{}};const l=yn(r.stressTool)?r.stressTool:{};return r.stressTool={...l,settings:l.settings??t.stressSettings??{}},{scenario:r,migrated:!0}}function oh(t,{now:e}={}){const n=sh(t),i=ih(n.scenario,e===void 0?{}:{now:e});return{scenario:i.scenario,write:!i.error&&!i.newer&&(n.migrated||i.changed),from:i.from,to:i.to,newer:i.newer,error:i.error}}const ah=180,lh="pt_guest_minutes",ch=t=>{const e=parseFloat(t);return Number.isFinite(e)&&e>0?e:0},uh=(t,e)=>{try{return t.getItem(e)}catch{return null}};function dh(t){return ch(uh(t,lh))}function hh(t){return t>=ah}function Kr(){return{equityMin:oe.EQUITY_MIN,bondMin:oe.BOND_MIN,cashTarget:oe.CASH_TARGET,duration:oe.DURATION_YEARS,baseSalary:oe.BASE_SALARY,other:0,statePension:12e3,statePensionYear:12,currentAge:null,currentAgeAsOf:null,retired:null,retireAge:null,firstTaxYear:null,potAtRetirement:null,pa:pe.PERSONAL_ALLOWANCE,brl:pe.BASIC_RATE_LIMIT,hrl:pe.HIGHER_RATE_LIMIT,taxMode:"inflates",protectionMult:De.PROTECTION_MULTIPLIER,consecutiveLimit:oe.CONSECUTIVE_LIMIT,disableProtection:!1,recoveryBuffer:oe.RECOVERY_BUFFER,hodlEnabled:De.HODL_ENABLED,hodlValue:De.HODL_VALUE,isaBalance:0,isaReturn:bt.RETURN,isaMin:bt.MIN,isaDrawdownStrategy:bt.DRAWDOWN_STRATEGY}}function ph(t){if(!t)return null;const e={january:0,jan:0,february:1,feb:1,march:2,mar:2,april:3,apr:3,may:4,june:5,jun:5,july:6,jul:6,august:7,aug:7,september:8,sep:8,sept:8,october:9,oct:9,november:10,nov:10,december:11,dec:11},n=t.trim().replace(/\s+/g," ");if(/^\d{4}-\d{2}-\d{2}$/.test(n)){const[r,s,o]=n.split("-").map(Number),l=new Date(r,s-1,o);if(!isNaN(l.getTime()))return l}if(/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(n)){const[r,s,o]=n.split("/").map(Number);return new Date(o,s-1,r)}if(/^\d{1,2}-\d{1,2}-\d{4}$/.test(n)){const[r,s,o]=n.split("-").map(Number);return new Date(o,s-1,r)}let i=n.match(/^(\d{1,2})\s+(\w+)\s+(\d{4})$/i);if(i){const r=parseInt(i[1]),s=e[i[2].toLowerCase()],o=parseInt(i[3]);if(s!==void 0)return new Date(o,s,r)}if(i=n.match(/^(\w+)\s+(\d{1,2})\s+(\d{4})$/i),i){const r=e[i[1].toLowerCase()],s=parseInt(i[2]),o=parseInt(i[3]);if(r!==void 0)return new Date(o,r,s)}if(i=n.match(/^(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})$/i),i){const r=e[i[1].toLowerCase()],s=parseInt(i[2]),o=parseInt(i[3]);if(r!==void 0)return new Date(o,r,s)}if(i=n.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+(\w+),?\s+(\d{4})$/i),i){const r=parseInt(i[1]),s=e[i[2].toLowerCase()],o=parseInt(i[3]);if(s!==void 0)return new Date(o,s,r)}return null}function ii(t,e,n="potMid"){if(!Array.isArray(t)||!t.length)return null;const i=Math.max(0,Math.min(t.length-1,e)),r=Math.floor(i),s=i-r,o=t[r],l=t[Math.min(t.length-1,r+1)];if(!o)return null;const a=o[n]??o.potMid,u=(l&&(l[n]??l.potMid))??a;return a+(u-a)*s}function yi(t){const e={[yt.SHARES]:0,[yt.BONDS]:0,[yt.DIVERSIFIERS]:0,[yt.CASH]:0},n={},i=[],r=[];let s=0,o=0;const l=[];for(const a of t){const u=a.mix?{mix:a.mix}:a.ticker&&!a.subClass?Yo.find(c=>c.ticker===String(a.ticker).toUpperCase().trim()):null;if(u&&u.mix&&typeof u.mix=="object"){const c=Object.values(u.mix).reduce((d,h)=>d+(+h||0),0)||1;for(const[d,h]of Object.entries(u.mix))+h>0&&l.push({...a,subClass:d,value:(+a.value||0)*(+h/c),mixOf:a.ticker||null})}else l.push(a)}for(const a of l){const u=+a.value||0,c=a.subClass||(a.ticker?jo[a.ticker]:void 0),d=c?Ut[c]:null;if(!d){r.push({...a});continue}if(s+=u,i.push({...a,subClass:c,bucket:d.bucket,label:d.label}),(a.wrapper||"").toUpperCase()==="ISA"){o+=u;continue}e[d.bucket]+=u,n[c]=(n[c]||0)+u}return{buckets:e,subClassTotals:n,bondWeights:Hr(n,yt.BONDS),diversifierWeights:Hr(n,yt.DIVERSIFIERS),total:s,isaTotal:o,tagged:i,untagged:r}}function Hr(t,e){const n=Object.entries(t).filter(([s])=>Ut[s].bucket===e),i=n.reduce((s,[,o])=>s+o,0);if(i<=0)return{};const r={};for(const[s,o]of n)r[s]=o/i;return r}function fh(t){const e=t||{};return(+e.equityMin||0)+(+e.bondMin||0)+(+e.cashTarget||0)+(+e.diversifierStart||0)}function mh(t){const e=t||{},n=e.potAtRetirement,i={sipp:1,isa:1};if(!n||e.retired!==!1)return i;const r=fh(e),s=+e.isaBalance||0;return+n.sipp>0&&r>0&&(i.sipp=+n.sipp/r),+n.isa>0&&s>0&&(i.isa=+n.isa/s),i}const gh=24*3600*1e3;function Te(t){const e=t instanceof Date?t:new Date(t);return e.getMonth()>3||e.getMonth()===3&&e.getDate()>=6?e.getFullYear():e.getFullYear()-1}function q(t){return t+"/"+String(t+1).slice(2)}function Ki(t){return String(t%100).padStart(2,"0")+"/"+String((t+1)%100).padStart(2,"0")}function yh(t){const e=parseInt(String(t).split("/")[0],10);return Number.isFinite(e)?e<100?2e3+e:e:NaN}function _h(t,e){let n;if(typeof t=="number")n=t;else if(t instanceof Date)n=Te(t);else if(typeof t=="string"&&t.includes("/"))n=yh(t);else if(typeof t=="string"){const[i,r]=t.split("-").map(Number);n=r>=4?i:i-1}else return NaN;return n-+e}function go(t){const e=/^(\d{4})-(\d{2})-(\d{2})$/.exec(typeof t=="string"?t.trim():"");return e?new Date(+e[1],+e[2]-1,+e[3]):new Date(t)}function yo(t,e=new Date){const n=t||{},i=n.spStartDate?ph(n.spStartDate):null;if(i)return{month:i.getMonth(),day:i.getDate(),source:"sp"};if(n.currentAgeAsOf){const r=go(n.currentAgeAsOf);if(Number.isFinite(r.getTime()))return{month:r.getMonth(),day:r.getDate(),source:"asOf"}}return{month:e.getMonth(),day:e.getDate(),source:"today"}}function Wr(t,e,n){let i=0;for(let r=t.getFullYear();r<=e.getFullYear();r++){const s=new Date(r,n.month,n.day);s.getTime()>t.getTime()&&s.getTime()<=e.getTime()&&i++}return i}function Hi(t,e,n=new Date){const i=t||{},r=Math.floor(+i.currentAge||0);if(!(r>0))return null;let s=i.currentAgeAsOf?go(i.currentAgeAsOf):n;Number.isFinite(s.getTime())||(s=n);const o=yo(i,n),l=e instanceof Date?e:new Date(e);return l.getTime()>=s.getTime()?r+Wr(s,l,o):r-Wr(l,s,o)}function _i(t,e,n=new Date){return Hi(t,new Date(e+1,3,5),n)}function Cn(t,e,n=new Date){const i=Te(n),r=_i(t,i,n);return r==null?null:i+(Math.round(+e)-r)}function vi(t,e=new Date){const n=new Date(+t,3,6);return Math.max(0,Math.round((n.getTime()-e.getTime())/(30.44*gh)))}function _o(t,e=new Date){const[n,i]=String(t||"").split("-").map(Number);return!Number.isFinite(n)||!Number.isFinite(i)?0:Math.max(0,(n-e.getFullYear())*12+(i-1-e.getMonth()))}function vh(t,e,n=new Date){const i=t||{},r=Hi(i,n,n);if(r==null)return null;const s=yo(i,n);return(new Date(n.getFullYear(),s.month,s.day).getTime()>n.getTime()?n.getFullYear():n.getFullYear()+1)+(Math.round(+e)-(r+1))+"-"+String(s.month+1).padStart(2,"0")}function vo(t,e=null,n=new Date){const i=t||{};if(typeof i.retired=="boolean"&&+i.firstTaxYear>0||!(+i.currentAge>0))return i;const r=Te(n),s=+i.shapeAgeNow||57,l=Cn(i,s,n)>r+1,a=i.retired===!0?!0:i.retired===!1||l?!1:e&&typeof e.retired=="boolean"?e.retired:!0;let u=+i.firstTaxYear>0?+i.firstTaxYear:a?r+1:Cn(i,+i.retireAge||s,n);return!(+i.firstTaxYear>0)&&!(u>=r)&&(u=r+1),{...i,firstTaxYear:u,retired:a,retireAge:a?null:+i.retireAge||s}}function Th(t){return t.getFullYear()+"-"+String(t.getMonth()+1).padStart(2,"0")+"-"+String(t.getDate()).padStart(2,"0")}function bh(t,e=null,n=new Date){const i=vo(t,e,n);return+i.currentAge>0?i.currentAgeAsOf?i:{...i,currentAgeAsOf:Th(n)}:+i.firstTaxYear>0||+i.legacyFirstTaxYear>0?i:{...i,legacyFirstTaxYear:n.getFullYear()+1}}function Ih(t,e=new Date){const n=vo(t||{},null,e),i=Te(e),r={currentAge:null,retireAge:null,potScale:{sipp:1,isa:1},startOptions:[i,i+1]};if(!(+n.currentAge>0)){const a=+n.firstTaxYear>0?+n.firstTaxYear:+n.legacyFirstTaxYear>0?+n.legacyFirstTaxYear:e.getFullYear()+1;return{...r,mode:"legacy",firstTaxYear:a,shapeAgeNow:+n.shapeAgeNow||57,yearsToStart:Math.max(0,a-i),startMonth:a+"-04",bridgeMonths:vi(a,e)}}const s=Hi(n,e,e);if(n.retired===!1&&+n.retireAge>0){let a=Cn(n,+n.retireAge,e);a>=i||(a=i);const u=_i(n,a,e),c=vh(n,+n.retireAge,e);return{...r,mode:"future",firstTaxYear:a,shapeAgeNow:u,currentAge:s,retireAge:+n.retireAge,yearsToStart:a-i,startMonth:c,bridgeMonths:_o(c,e),potScale:mh(n)}}const o=+n.firstTaxYear>0?+n.firstTaxYear:i+1,l=o+"-04";return{...r,mode:"retired",firstTaxYear:o,shapeAgeNow:_i(n,o,e),currentAge:s,yearsToStart:Math.max(0,o-i),startMonth:l,bridgeMonths:vi(o,e)}}function Ah(t,{locked:e=!1,hasRecords:n=!1,now:i=new Date}={}){if(e||n)return null;const r=t||{},s=Te(i),o=+r.currentAge>0;let l=0,a="retired";return o&&r.retired===!1&&+r.retireAge>0?(a="future",l=Cn(r,+r.retireAge,i)||0):+r.firstTaxYear>0?(l=+r.firstTaxYear,o||(a="legacy")):!o&&+r.legacyFirstTaxYear>0&&(a="legacy",l=+r.legacyFirstTaxYear),!(l>0)||l>=s||+r.staleDraftDismissedFor===l?null:{savedYear:l,savedLabel:q(l),suggestedYear:s,suggestedLabel:q(s),mode:a}}const Sh=t=>!!t&&typeof t=="object"&&!Array.isArray(t);function wh(t){return!!(Sh(t)&&t.locked)}const zr=.025,mt=3;function ye(t){if(t instanceof Date)return Number.isFinite(t.getTime())?{y:t.getFullYear(),m:t.getMonth()+1}:null;if(t&&typeof t=="object")return Number.isInteger(t.y)&&t.m>=1&&t.m<=12?{y:t.y,m:t.m}:null;const e=/^(\d{4})-(\d{2})/.exec(String(t??""));return e&&+e[2]>=1&&+e[2]<=12?{y:+e[1],m:+e[2]}:null}const Ti=(t,e)=>e.y*12+e.m-(t.y*12+t.m),ct=t=>t?t.y+"-"+String(t.m).padStart(2,"0"):null,Fe=t=>typeof t=="number"&&Number.isFinite(t);function To(t){const e=t&&t.accumulation;return!e||typeof e!="object"?null:e.version===mt?mt:2}function bo(t){const e=t||{},n=e.accumulation||{};return n.version===mt&&ye(n.asOf)?{at:ye(n.asOf),from:"asOf"}:ye(e.createdAt)?{at:ye(e.createdAt),from:"createdAt"}:ye(e.lockedAt)?{at:ye(e.lockedAt),from:"lockedAt"}:{at:null,from:null}}function Eh(t,e){const n=bo(t).at,i=ye(e);if(To(t)===mt||!n||!i)return{factor:1,cpi:null,months:n&&i?Ti(n,i):0,start:n};const r=Ti(n,i);return{factor:Math.pow(1+zr,r/12),cpi:zr,months:r,start:n}}function Rh(t){const e=t&&t.accumulation;return!!(e&&e.version===mt&&((+e.isaNow||0)>0||(+e.isaMonthly||0)>0))}function Ph(t,e){const n=t.length,i=Math.max(0,Math.min(n-1,e/12)),r=Math.floor(i),s=i-r,o=t[r],l=t[Math.min(n-1,r+1)],a=u=>{const c=+o.nominal[u],d=+l.nominal[u];return c+(d-c)*s};return{low:a("careful"),expected:a("middling"),high:a("good")}}function kh(t,{at:e,pension:n=null,isa:i=null}={}){const r=t&&t.accumulation;if(!r)return null;const s=To(t),o=Array.isArray(r.path)?r.path:[],l=bo(t).at,a=ye(e),u=l&&a?Math.max(0,Ti(l,a)):0,c=Rh(t),d={version:s,start:ct(l),at:ct(a),months:u,pathMissing:!o.length,isaCounted:c,actual:null,pension:Fe(n)?Math.round(n):null,isa:Fe(i)?Math.round(i):null,compared:null,prices:null,expected:null,low:null,high:null,band:null,missing:[]};if(!o.length)return d;let h;if(s===mt)h=Ph(o,u);else{const y=o[0].potMix!=null?"potMix":"potMid";h={expected:ii(o,u/12,y),low:ii(o,u/12,"potLow"),high:ii(o,u/12,"potHigh")}}if(d.expected=Math.round(h.expected),d.low=Math.round(h.low),d.high=Math.round(h.high),!Fe(n))return d.missing.push("pension"),d;if(c&&!Fe(i))return d.missing.push("isa"),d;const f=n+(c?i:0),m=Eh(t,a||l),p=f/m.factor;return d.actual=Math.round(f),d.compared=Math.round(p),d.prices={factor:m.factor,cpi:m.cpi,start:ct(m.start)},s===mt?d.band=Math.abs(h.high-h.low)<1?"start":p<h.low?"below p10":p<h.expected?"p10–p50":p<=h.high?"p50–p90":"above p90":d.band=p<h.low?"below the cautious line":p<h.expected?"below the locked path":p<=h.high?"on or above the locked path":"above the strong line",d}function Dh(t){if(!t||t.isa==null||!Fe(+t.isa))return null;const e=+t.isa;return e===0&&t.isaEntered!==!0?null:e}function Io({accHistory:t=[],potsToday:e=null,holdingsPension:n=0,holdingsIsa:i=null,holdingsAsOf:r=null,today:s=new Date}={}){const o=(t||[]).filter(l=>l&&ye(l.date)).slice().sort((l,a)=>String(l.date).localeCompare(String(a.date))).pop()||null;if(o){const l=Fe(+o.sipp)&&o.sipp!=null?+o.sipp:Fe(+o.total)?+o.total:null;return{source:"record",at:ct(ye(o.date)),recordedAt:o.date,pension:l,isa:Dh(o)}}return e!=null&&Fe(+e)?{source:"today",at:ct(ye(s)),recordedAt:null,pension:+e,isa:null}:n>0?{source:"holdings",at:ct(ye(r)||ye(s)),recordedAt:r||null,pension:n,isa:Fe(i)?i:null}:{source:null,at:ct(ye(s)),recordedAt:null,pension:null,isa:null}}const Oh=5,Mh=Object.freeze({saving:{key:"saving",label:"Saving",chip:"saving",leads:["budget","accumulation"],readOnly:[],hidden:[],banner:{text:"You are saving. Set the income you will want (Budget), then check you are on course for it (Accumulation planner). The Stress tester can price the plan on the pots you will have at retirement.",btn:"Open the Accumulation planner",tab:"accumulation"}},approaching:{key:"approaching",label:"Approaching retirement",chip:"approaching",leads:["stress","strategies","accumulation"],readOnly:[],hidden:[],banner:{text:"Within five years of your plan start. Pick the strategy you will retire on and stress-test it — then lock the plan and start moving your holdings into it.",btn:"Open the Stress tester",tab:"stress"}},"committed-saving":{key:"committed-saving",label:"Committed, still saving",chip:"to go",leads:["accumulation"],readOnly:["stress","strategies"],hidden:[],banner:{text:"Your plan is locked and starts in {start}. Keep saving and buying the target portfolio; the Decision tool opens when the plan starts.",btn:"Open the plan document",tab:"decision",sub:"plandoc"}},bridge:{key:"bridge",label:"Retired — run-up to the plan's first tax year",chip:"run-up",leads:["decision"],readOnly:["stress","strategies"],hidden:["accumulation"],banner:{text:"Retired, drawing from your SIPP cash until the plan's first tax year, {start}. Record each month in the Decision tool; the ladder's rungs and the plan's tracks begin in {start}.",btn:"Open the Decision tool",tab:"decision"}},running:{key:"running",label:"Running the plan",chip:"running",leads:["decision"],readOnly:["stress","strategies"],hidden:["accumulation"],banner:null},"draft-retired":{key:"draft-retired",label:"Retired, designing the plan",chip:"retired",leads:["stress","strategies"],readOnly:[],hidden:["accumulation"],banner:{text:"You are retired and the plan is still a draft. Stress-test it, then lock it from the Stress tester's Settings page to write the plan document and start recording months.",btn:"Open the Stress tester",tab:"stress"}},unknown:{key:"unknown",label:"Getting started",chip:"",leads:["budget"],readOnly:[],hidden:[],banner:null}});function Nh(t,e=new Date){var b,I,S,T;const n=t||{},i=((b=n.stressTool)==null?void 0:b.settings)||{},s=!!(((I=n.decisionTool)==null?void 0:I.settings)||{}).locked,o=Array.isArray((S=n.decisionTool)==null?void 0:S.history)?n.decisionTool.history:[],l=((T=n.decisionTool)==null?void 0:T.taxYears)||{},a=o.length>0||Object.values(l).some(C=>C&&C.yearSetupComplete),u=!!n.planDocument,c=Ih(i,e),d=Te(e),h=e.getFullYear()+"-"+String(e.getMonth()+1).padStart(2,"0"),f=c.mode==="future"&&c.startMonth?h<c.startMonth:c.firstTaxYear>d,m=c.mode==="future"&&c.startMonth?_o(c.startMonth,e):vi(c.firstTaxYear,e),p=[];let y;c.mode==="legacy"?(y=s?"running":"unknown",p.push("no age today in the Timing block")):c.mode==="future"?(s?y=f?"committed-saving":"running":y=c.yearsToStart>Oh?"saving":"approaching",p.push("retiring at "+c.retireAge+" ("+q(c.firstTaxYear)+")")):(s?y=f?"bridge":"running":y="draft-retired",p.push("already retired; plan starts "+q(c.firstTaxYear))),s&&p.push("plan locked"+(u?" with a plan document":""));const O=Mh[y],E=O.leads.slice(),g=O.hidden.slice();["approaching","committed-saving","bridge","draft-retired"].includes(y)&&E.push("transition");const v=q(c.firstTaxYear),R=O.banner?{...O.banner,text:O.banner.text.replace(/\{start\}/g,v)}:null;return{key:y,label:O.label,chip:Ch(O,m,f),leads:E,readOnly:O.readOnly.slice(),hidden:g,banner:R,locked:s,retired:c.mode==="retired",timingMode:c.mode,firstTaxYear:c.firstTaxYear,startLabel:v,startMonth:c.startMonth||null,yearsToStart:c.yearsToStart,monthsToStart:m,beforeStart:f,hasRecords:a,hasDocument:u,reasons:p}}function Ch(t,e,n){return t.key==="committed-saving"||t.key==="bridge"?!n||e<=0?t.chip:e>=24?Math.round(e/12)+" years to go":e+" month"+(e===1?"":"s")+" to go":t.chip}const xh=.025,Re=t=>Number.isFinite(+t)?+t:0;function Lh(t){const e=Lt(t).filter(g=>g&&(Re(g.value)>0||Re(g.contribution)>0)),n=yi(e.map(g=>({...g,value:Re(g.value)}))),i={SIPP:0,ISA:0,GIA:0,CASH:0},r={shares:0,bonds:0,diversifiers:0,cash:0},s={};let o=0,l=0,a=0;for(const g of n.tagged){const v=Re(g.value);if(!(v>0))continue;o+=v;const R=(g.wrapper||"SIPP").toUpperCase();i[R in i?R:"SIPP"]+=v,r[g.bucket]=(r[g.bucket]||0)+v,s[g.subClass]=(s[g.subClass]||0)+v,l+=v*(Re(g.ocf)/100);const b=Ut[g.subClass];a+=v*(b?Re(b.nominalReturn):0)}const u={};for(const g of Object.keys(r))u[g]=o>0?r[g]/o:0;const c=Object.entries(s).map(([g,v])=>{var R,b;return{key:g,label:((R=Ut[g])==null?void 0:R.label)||g,bucket:((b=Ut[g])==null?void 0:b.bucket)||"shares",value:v,weight:o>0?v/o:0}}).sort((g,v)=>v.value-g.value),d=o>0?l/o:0,h=o>0?a/o:0,f=e.filter(g=>Re(g.contribution)>0),m=yi(f.map(g=>({...g,value:Re(g.contribution)}))),p={shares:0,bonds:0,diversifiers:0,cash:0};let y=0;const O={SIPP:0,ISA:0,GIA:0,CASH:0};for(const g of m.tagged){const v=Re(g.value);y+=v,p[g.bucket]=(p[g.bucket]||0)+v;const R=(g.wrapper||"SIPP").toUpperCase();O[R in O?R:"SIPP"]+=v}const E={};for(const g of Object.keys(p))E[g]=y>0?p[g]/y:0;return{total:o,byWrapper:i,buckets:u,bucketValues:r,subClasses:c,weightedOcf:d,expectedNominal:h,expectedReal:h-xh-d,contributions:{monthly:y,byBucket:E,byWrapper:O},untagged:n.untagged.map(g=>({ticker:g.ticker||"",name:g.name||"",value:Re(g.value)}))}}function Bh(t){return Lt(t).reduce((e,n)=>e+(n&&(n.wrapper||"SIPP").toUpperCase()==="SIPP"?Re(n.value):0),0)}const Vh=["full-il-gilt","gilt-rotation","floor-the-schedule"],Fh=.04,Gh=["pots-and-valves","buckets-in-order"],Uh=["full-il-gilt","gilt-rotation"];function qr(t,{planYear:e=0}={}){var h,f;const n=t||{},i=((h=n.strategy)==null?void 0:h.id)||"pots-and-valves",r=Gh.includes(i),s=n.pots||{},o=s.isaPolicy==="hold",l=r||!o,a=(Array.isArray(n.timeline)?n.timeline:[]).filter(m=>m&&+m.y<=e).flatMap(m=>Array.isArray(m.lumpIn)?m.lumpIn:[]);let u=!1,c=!1;for(const m of a){const p=String(m.wrapper||"cash").toLowerCase(),y=+m.amount||0;p==="pension"||p==="sipp"||!(y>0)||(p==="isa"?u=!0:p==="gia"||o?c=!0:(u=!0,y>$o.ISA_ALLOWANCE&&(c=!0)))}const d=(+s.isa||0)>0;return{strategyId:i,potsStrategy:r,isa:l&&(d||u),gia:(+s.gia||0)>0||c,diversifiers:r&&(+((f=s.allocation)==null?void 0:f.diversifierStart)||0)>0,isaLeftOut:!l&&d}}function be(t){if(t instanceof Date)return Number.isFinite(t.getTime())?{y:t.getFullYear(),m:t.getMonth()+1}:null;if(t&&typeof t=="object")return Number.isInteger(t.y)&&t.m>=1&&t.m<=12?{y:t.y,m:t.m}:null;const e=/^(\d{4})-(\d{2})/.exec(String(t??""));return e?{y:+e[1],m:+e[2]}:null}const Wi=(t,e)=>e.y*12+e.m-(t.y*12+t.m),zi=(t,e)=>(t.m>=4?t.y:t.y-1)-e,Ao=t=>(t.m+8)%12;function Yh(t,e,n=null){var c,d;const i=+((c=t==null?void 0:t.assumptions)==null?void 0:c.cpiDecision)>0?+t.assumptions.cpiDecision:Fh,r=+((d=t==null?void 0:t.timing)==null?void 0:d.firstTaxYear),s=be(e),o={factor:1,assumed:i,years:[]};if(!s||!Number.isFinite(r))return o;const l=zi(s,r),a=Ao(s)/12,u=n&&typeof n=="object"?n:{};for(let h=0;h<=l;h++){const f=h<l?1:a;if(!(f>0))break;const m=Ki(r+h),p=+(u[m]&&u[m].cpi)||0,y=p||i;o.factor*=Math.pow(1+y,f),o.years.push({taxYear:m,cpi:y,entered:!!p,share:f})}return o}function jh(t){const e=(t||[]).filter(r=>r&&be(r.date)).slice().sort((r,s)=>String(r.date).localeCompare(String(s.date)));if(!e.length)return null;const n=(r,s)=>["equity","bond","cash"].every(o=>Math.abs((+r[o]||0)-(+s[o]||0))<.5);let i=e.length-1;for(;i>0&&n(e[i-1],e[i])&&Wi(be(e[i-1].date),be(e[i].date))===1;)i--;return{rec:e[i],idx:i,recs:e}}function Ht(t,e){const n=Lt(t).filter(r=>r&&jn(r.wrapper)===e&&Ae(r.value)!=null);if(!n.length)return null;const i=t&&!Array.isArray(t)&&t.updatedAt||n.map(r=>r.asOf).filter(Boolean).sort().pop()||null;return{value:n.reduce((r,s)=>r+Ae(s.value),0),asOf:i?String(i).slice(0,10):null}}function $h(t){const e=Ht(t,"SIPP");if(!e)return null;const n=Lt(t).filter(i=>i&&jn(i.wrapper)==="SIPP"&&Ae(i.value)!=null).map(i=>({...i,value:Ae(i.value)}));return{value:Lh(n).bucketValues.diversifiers||0,asOf:e.asOf}}function Kh(t,{today:e,history:n,potsToday:i,holdings:r}){const s=v=>qr(t,{planYear:zi(v,+t.timing.firstTaxYear)});if(i!=null){const v=e.toISOString().slice(0,10),R=be(e);return{source:"today",asOf:v,at:R,pension:Math.round(+i),parts:[{key:"all",value:+i,source:"today",asOf:v}],missing:[],measure:s(R),runUpMonthly:0}}const o=jh(n),l=Ht(r,"SIPP"),a=qr(t).diversifiers,u=[],c=[];let d=null,h=null,f=null,m=null;const p=l&&l.value>0?be(l.asOf):null,y=a&&l&&l.value>0&&(!o||p!=null&&Wi(be(o.rec.date),p)>=0);if(o&&!y){if(d="record",m=o.rec,f=String(m.date).slice(0,7),h=(+m.equity||0)+(+m.bond||0)+(+m.cash||0),a){const v=$h(r);v?v.value>0&&c.push({key:"diversifiers",value:v.value,source:"holdings",asOf:v.asOf}):u.push("diversifiers")}}else l&&l.value>0&&(d="holdings",h=l.value,f=l.asOf);const O=be(f)||be(e),E=s(O);if(d==null)return{source:null,asOf:null,at:O,pension:null,parts:[],missing:["pension"],measure:E,runUpMonthly:0};const g=[{key:"pension",value:h,source:d,asOf:f},...c];if(E.isa){const v=Ht(r,"ISA");v?g.push({key:"isa",value:v.value,source:"holdings",asOf:v.asOf}):u.push("isa")}if(E.gia){let v=null;if(m&&Ae(m.gia)!=null)v={value:+m.gia,source:"record",asOf:f};else if(m){const R=o.recs.slice(0,o.idx).reverse().find(b=>Ae(b.gia)!=null);R&&Ae(R.giaBalanceAfter)!=null&&+R.giaBalanceAfter<=1&&(v={value:0,source:"record",asOf:f})}if(!v){const R=Ht(r,"GIA");R&&(v={value:R.value,source:"holdings",asOf:R.asOf})}v?g.push({key:"gia",...v}):u.push("gia")}return{source:d,asOf:f,at:O,pension:Math.round(h),parts:g,missing:u,measure:E,runUpMonthly:m&&+m.sipp||0}}function Hh(t,e,n=0){const i=(h,f)=>Array.isArray(h)&&f<h.length&&Number.isFinite(+h[f])?+h[f]:null,r=Array.isArray(t==null?void 0:t.p50)?t.p50.length:0;if(!r)return{p10:null,p50:null,p90:null};const s=Math.min(Math.max(0,e),r-1),o=i(t.p50,s),l=i(t.p50,s+1);if(o==null)return{p10:null,p50:null,p90:null};const a=n>0&&l!=null,u=a?o+n*(l-o):o,c=a?(Math.sqrt(s+n)-Math.sqrt(s))/(Math.sqrt(s+1)-Math.sqrt(s)):0,d=h=>{const f=i(h,s);if(f==null)return null;const m=i(h,s+1);if(!a||m==null)return f+(u-o);const p=f-o,y=m-l;return u+p+c*(y-p)};return{p10:d(t.p10),p50:u,p90:d(t.p90)}}function Wh(t,e,{today:n,history:i,potsToday:r,holdings:s,taxYears:o}){var V,Q,_;const l=+t.timing.firstTaxYear,a=Kh(t,{today:n,history:i,potsToday:r,holdings:s}),u=zi(a.at,l);if(t.timing.mode==="future"&&u<0)return null;const c=Math.max(0,u),d=u>=0?Ao(a.at)/12:0;let{p10:h,p50:f,p90:m}=Hh(e,c,d);const p=f;let y=null;const O=Math.max(0,+((V=t.assumptions)==null?void 0:V.bridgeCash)||0);if(u<0&&O>0){const A=Math.max(0,l*12+4-(a.at.y*12+a.at.m)),N=Math.round(+((Q=t.timing)==null?void 0:Q.bridgeMonths)||+((_=t.assumptions)==null?void 0:_.bridgeMonths)||0);let K,ne;if(N>0)K=O*Math.min(1,A/N),ne=O/N;else{const X=Array.isArray(t.timeline)?t.timeline[0]:null;ne=a.runUpMonthly>0?a.runUpMonthly:X?Math.max(0,((+X.gross||0)-(+X.sp||0)-(+X.other||0))/12):0,K=Math.min(O,ne*A)}K>0&&(y={months:A,of:N>0?N:null,monthly:Math.round(ne),value:Math.round(K)},[h,f,m]=[h,f,m].map(X=>X==null?null:X+K))}const E=a.missing.length?null:a.parts.reduce((A,N)=>A+N.value,0),g=Yh(t,a.at,o),v=E==null?null:E/g.factor,R=Array.isArray(e.p10)&&Array.isArray(e.p90)&&e.p10.length>1&&e.p10.every((A,N)=>Math.abs((e.p90[N]??A)-A)<1),b=Uh.includes(a.measure.strategyId)||R;let I=null,S=null;v!=null&&f!=null&&(b?I="gilts-at-cost":h==null||m==null||Math.abs(f-h)<1?I=(h==null||m==null||Math.abs(m-h)<1)&&(u<0||u===0&&d===0)?"start":"not-open":(I="band",S=v<h?"below p10":v<f?"p10–p50":v<=m?"p50–p90":"above p90"));const T=be(n),C=a.parts.filter(A=>A.source!=="today"&&be(A.asOf)&&T&&Wi(be(A.asOf),T)>3).map(A=>({key:A.key,source:A.source,asOf:A.asOf})),D=A=>A==null?null:Math.round(A);return{actual:D(E),real:D(v),pension:a.pension,parts:a.parts.map(A=>({...A,value:Math.round(A.value)})),missing:a.missing,source:a.source,asOf:a.asOf,planYear:u,monthsIn:Math.round(d*12),prices:{factor:g.factor,assumed:g.assumed,years:g.years.length,entered:g.years.filter(A=>A.entered).length},p10:D(h),p50:D(f),p90:D(m),startP50:y?D(p):null,runUp:y,verdict:I,band:S,flat:R,isaLeftOut:a.measure.isaLeftOut,stale:C}}function zh(t,{today:e=new Date,history:n=[],potsToday:i=null,ladderPos:r=null,accHistory:s=[],holdings:o=null,taxYears:l=null}={}){var V,Q,_,A,N,K,ne,X,Se;if(!t||!t.timing)return null;const a=Bh(Lt(o)),u=o&&!Array.isArray(o)&&o.updatedAt?o.updatedAt:null;let c=null;if(t.accumulation&&t.timing.mode==="future"){const H=Ht(o,"ISA"),Z=Io({accHistory:s,potsToday:i,holdingsPension:a,holdingsIsa:H?H.value:null,holdingsAsOf:u,today:e}),te=kh(t,{at:Z.at,pension:Z.pension,isa:Z.isa}),We=new Date(+t.timing.firstTaxYear,3,6);c={monthsToGo:Math.max(0,Math.round((We.getTime()-e.getTime())/(30.44*24*3600*1e3))),pathMissing:te.pathMissing,version:te.version,expected:te.expected,low:te.low,high:te.high,actual:te.pathMissing||te.actual==null?Z.pension==null?null:Math.round(Z.pension):te.actual,compared:te.compared,pension:te.pension,isa:te.isa,isaCounted:te.isaCounted,missing:te.missing,prices:te.prices,at:te.at,start:te.start,actualSource:Z.source,recordedAt:Z.source==="record"?Z.recordedAt:Z.source==="holdings"?u:null,band:te.band,contributions:t.accumulation.totalMonthly||0,isaMonthly:t.accumulation.isaMonthly||0}}const d=+t.timing.firstTaxYear,h=_h(e,d),f=h<0,m=Math.max(0,h),p=((V=t.timeline)==null?void 0:V.length)||((Q=t.assumptions)==null?void 0:Q.duration)||35,y=t.timing.shapeAgeNow+h,O=q(Te(e)),E=(t.steps||[]).slice().sort((H,Z)=>H.fromAge-Z.fromAge),g=E.filter(H=>{var Z;return H.fromAge<=Math.max(y,((Z=E[0])==null?void 0:Z.fromAge)??y)}).pop()||E[0]||null,v=E.find(H=>H.fromAge>(g?g.fromAge:y))||null,R=g?Math.round(No(E.map(H=>({fromAge:H.fromAge,amount:H.amount,decline:H.decline,glideToNext:H.glideToNext})),Math.max(y,g.fromAge),g.amount)):null,b=((_=t.timeline)==null?void 0:_[m])||null,I=String(Te(e)%100).padStart(2,"0")+"/"+String((Te(e)+1)%100).padStart(2,"0"),S=(n||[]).filter(H=>H&&H.taxYear===I),T=S.reduce((H,Z)=>H+(+Z.sipp||0)+(+Z.other||0)+(+Z.state||0),0),C=((K=(N=(A=t.strategy)==null?void 0:A.r)==null?void 0:N.cones)==null?void 0:K.wealth)||null,D=C?Wh(t,C,{today:e,history:n,potsToday:i,holdings:o,taxYears:l}):null;return{today:e.toISOString().slice(0,10),planYear:h,planYears:p,bridge:f,taxYear:O,age:y,planStart:q(d),step:g?{amount:R,from:g.fromAge,taxYear:g.taxYear,index:E.indexOf(g)+1,of:E.length,next:v?{fromAge:v.fromAge,amount:v.amount,taxYear:v.taxYear,yearsAway:v.fromAge-y}:null}:null,incomeThisYear:{recorded:S.length,drawn:Math.round(T),planned:b?b.gross:null,perMonth:b?Math.round(b.gross/12):null},pot:D,ladder:r?{phase:r.phase,instruction:r.instruction,monthly:r.monthly,source:r.source,verdict:((ne=r.cashCheck)==null?void 0:ne.verdict)||null}:null,contract:!!((X=t.strategy)!=null&&X.contract),strategyId:((Se=t.strategy)==null?void 0:Se.id)||"pots-and-valves",saving:c}}function qh(t){const e=t.getMonth(),n=t.getDate();return e>3||e===3&&n>=6?t.getFullYear():t.getFullYear()-1}function Jh(t,e){const n=new Date(t+1,3,6);if(e>=n)return 0;const i=new Date(t,3,6),r=e<i?i:e;return Math.max(1,Math.min(12,Math.round((n-r)/(30.44*24*3600*1e3))))}function Qh(t,e={}){if(!t||!Array.isArray(t.years)||!t.years.length)return null;const n=e.today||new Date,i=qh(n),r=t.years,s=r[0].Y,o=r[r.length-1].Y,l=r.find(D=>D.Y===i)||null,a=i<s?"before":i>o?"after":"running",u=l?l.need:0,c=l?l.gross:0,d=Math.max(0,c-u),h=Jh(i,n),f=e.drawnThisYear||0,m=Math.max(0,u-f),p=h>0?m/h:0,y=[];for(const D of r){if(D.Y<=i)continue;(D.from==="cash"?!0:D.matures?new Date(D.matures)<=n:!1)&&y.push({Y:D.Y,age:D.age,amount:D.need,from:D.from,until:new Date(D.Y,3,6)})}const O=y.reduce((D,V)=>D+V.amount,0),E=(t.orders||[]).filter(D=>new Date(D.matures)>n).sort((D,V)=>D.matures.localeCompare(V.matures)),g=E.length?E[0]:null,v=g?{tidm:g.tidm,name:g.name,matures:g.matures,nominal:g.nominal,pays:g.pays,taxYears:g.taxYears||[],monthsAway:Math.round((new Date(g.matures)-n)/(30.44*24*3600*1e3)),sitsMonths:g.taxYears&&g.taxYears.length?Math.max(0,Math.round((new Date(g.taxYears[0],3,6)-new Date(g.matures))/(30.44*24*3600*1e3))):0}:null,R=m,b=R+O,I=e.cashBalance==null?null:e.cashBalance,S=I==null?null:{balance:I,shouldBeLiquid:R,parkedTotal:O,expectedTotal:b,diff:I-b,verdict:Math.abs(I-b)<Math.max(500,b*.02)?"as expected":I>b?"more cash than the plan needs — park the surplus":"less cash than the plan needs — check the last maturity landed"},T=r[0],C=a==="before"?{Y:T.Y,label:`${T.Y}/${String(T.Y+1).slice(2)}`,age:T.age,gross:T.gross,fromLadder:T.need,statePension:Math.max(0,T.gross-T.need),monthly:T.need/12,source:T.from,startsOn:new Date(T.Y,3,6),cashBucket:t.cash||0,cashYears:r.filter(D=>D.from==="cash").length}:null;return{taxYear:i,taxYearLabel:`${i}/${String(i+1).slice(2)}`,phase:a,upcoming:C,age:l?l.age:null,gross:c,statePension:d,fromLadder:u,source:l?l.from:null,sourceHeld:l?!!l.held:!1,monthsLeft:h,drawnThisYear:f,remaining:m,monthly:p,parked:y,parkedTotal:O,next:v,cashCheck:S,yearsLeft:Math.max(0,o-i),instruction:l?`Instruct the broker to pay ${Xh(p)} a month for the ${h} month${h===1?"":"s"} to 5 April ${i+1}.`:a==="before"?`The ladder starts in ${s}/${String(s+1).slice(2)}.`:"The ladder has paid its last year."}}function Xh(t){return"£"+Math.round(t).toLocaleString("en-GB")}function Jr(t,e=null){const n=t&&t.strategy&&t.strategy.r?t.strategy.r.plan:null;return!n||!Array.isArray(n.years)||!n.years.length||!Array.isArray(n.orders)||e&&t.strategy.id&&t.strategy.id!==e?null:n}const hn={gilts:[{name:"0 3/8% Treasury Gilt 2026",isin:"GB00BNNGP668",type:"conventional",coupon:.375,maturity:"2026-10-22",dmoDate:"2026-10-16",tidm:"T26A",cleanPrice:99.96,yield:null,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 1/8% Treasury Gilt 2027",isin:"GB00BL6C7720",type:"conventional",coupon:4.125,maturity:"2027-01-29",dmoDate:"2026-10-16",tidm:"T27A",cleanPrice:99.99,yield:.04185,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"3¾% Treasury Gilt 2027",isin:"GB00BPSNB460",type:"conventional",coupon:3.75,maturity:"2027-03-07",dmoDate:"2026-10-16",tidm:"TS27",cleanPrice:99.82,yield:.04257,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1¼% Treasury Gilt 2027",isin:"GB00BDRHNP05",type:"conventional",coupon:1.25,maturity:"2027-07-22",dmoDate:"2026-10-16",tidm:"TG27",cleanPrice:97.72,yield:.04361,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1¼% Index-linked Treasury Gilt 2027",isin:"GB00B128DH60",type:"il3",coupon:1.25,maturity:"2027-11-22",dmoDate:"2026-10-16",tidm:"T27",cleanPrice:101.77,yield:-.00353,yieldKind:"real",baseRpi:194.06667,indexRatio:2.16663},{name:"4¼% Treasury Gilt 2027",isin:"GB00B16NNR78",type:"conventional",coupon:4.25,maturity:"2027-12-07",dmoDate:"2026-10-16",tidm:"TR27",cleanPrice:99.69,yield:.04579,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Treasury Gilt 2028",isin:"GB00BMBL1G81",type:"conventional",coupon:.125,maturity:"2028-01-31",dmoDate:"2026-10-16",tidm:"TN28",cleanPrice:94.88,yield:.04283,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 3/8% Treasury Gilt 2028",isin:"GB00BSQNRC93",type:"conventional",coupon:4.375,maturity:"2028-03-07",dmoDate:"2026-10-16",tidm:"TE28",cleanPrice:99.58,yield:.04742,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4½% Treasury Gilt 2028",isin:"GB00BMF9LG83",type:"conventional",coupon:4.5,maturity:"2028-06-07",dmoDate:"2026-10-16",tidm:"TS28",cleanPrice:99.63,yield:.04789,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2028",isin:"GB00BZ1NTB69",type:"il3",coupon:.125,maturity:"2028-08-10",dmoDate:"2026-10-16",tidm:"T28",cleanPrice:99.83,yield:.00219,yieldKind:"real",baseRpi:279.23333,indexRatio:1.50581},{name:"1 5/8% Treasury Gilt 2028",isin:"GB00BFX0ZL78",type:"conventional",coupon:1.625,maturity:"2028-10-22",dmoDate:"2026-10-16",tidm:"TG28",cleanPrice:94.17,yield:.04741,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"6% Treasury Stock 2028",isin:"GB0002404191",type:"conventional",coupon:6,maturity:"2028-12-07",dmoDate:"2026-10-16",tidm:"TR28",cleanPrice:102.69,yield:.04718,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0½% Treasury Gilt 2029",isin:"GB00BLPK7227",type:"conventional",coupon:.5,maturity:"2029-01-31",dmoDate:"2026-10-16",tidm:"TG29",cleanPrice:90.98,yield:.04747,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2029",isin:"GB00B3Y1JG82",type:"il3",coupon:.125,maturity:"2029-03-22",dmoDate:"2026-10-16",tidm:"T29",cleanPrice:98.32,yield:.00826,yieldKind:"real",baseRpi:237.42,indexRatio:1.771},{name:"4% Treasury Gilt 2029",isin:"GB00BVP99566",type:"conventional",coupon:4,maturity:"2029-05-22",dmoDate:"2026-10-16",tidm:"T29K",cleanPrice:97.96,yield:.04902,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 1/8% Treasury Gilt 2029",isin:"GB00BQC82B83",type:"conventional",coupon:4.125,maturity:"2029-07-22",dmoDate:"2026-10-16",tidm:"TS29",cleanPrice:98.16,yield:.049,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 7/8% Treasury Gilt 2029",isin:"GB00BJMHB534",type:"conventional",coupon:.875,maturity:"2029-10-22",dmoDate:"2026-10-16",tidm:"TR29",cleanPrice:89.15,yield:.04836,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 3/8% Treasury Gilt 2030",isin:"GB00BSQNRD01",type:"conventional",coupon:4.375,maturity:"2030-03-07",dmoDate:"2026-10-16",tidm:"T30",cleanPrice:98.41,yield:.04948,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 5/8% Treasury Gilt 2030",isin:"GB00BWBR1P52",type:"conventional",coupon:4.625,maturity:"2030-05-22",dmoDate:"2026-10-16",tidm:"T30K",cleanPrice:99.08,yield:.04966,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 1/8% Index-linked Treasury Stock 2030",isin:"GB0008932666",type:"il8",coupon:4.125,maturity:"2030-07-22",dmoDate:"2026-10-16",tidm:"T30I",cleanPrice:342.35,yield:null,yieldKind:"real",baseRpi:135.1,indexRatio:null},{name:"0 3/8% Treasury Gilt 2030",isin:"GB00BL68HH02",type:"conventional",coupon:.375,maturity:"2030-10-22",dmoDate:"2026-10-16",tidm:"TG30",cleanPrice:84.04,yield:.04848,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4¾% Treasury Gilt 2030",isin:"GB00B24FF097",type:"conventional",coupon:4.75,maturity:"2030-12-07",dmoDate:"2026-10-16",tidm:"TR30",cleanPrice:99.7,yield:.04888,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 1/8% Treasury Gilt 2031",isin:"GB00BVP99673",type:"conventional",coupon:4.125,maturity:"2031-03-07",dmoDate:"2026-10-16",tidm:"T31H",cleanPrice:96.86,yield:.04989,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0¼% Treasury Gilt 2031",isin:"GB00BMGR2809",type:"conventional",coupon:.25,maturity:"2031-07-31",dmoDate:"2026-10-16",tidm:"TG31",cleanPrice:80.69,yield:.04871,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2031",isin:"GB00BNNGP551",type:"il3",coupon:.125,maturity:"2031-08-10",dmoDate:"2026-10-16",tidm:"TR31",cleanPrice:95.53,yield:.01083,yieldKind:"real",baseRpi:293.60323,indexRatio:1.43211},{name:"4% Treasury Gilt 2031",isin:"GB00BPSNBF73",type:"conventional",coupon:4,maturity:"2031-10-22",dmoDate:"2026-10-16",tidm:"T31",cleanPrice:95.82,yield:.05012,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1% Treasury Gilt 2032",isin:"GB00BM8Z2T38",type:"conventional",coupon:1,maturity:"2032-01-31",dmoDate:"2026-10-16",tidm:"TG32",cleanPrice:81.73,yield:.0503,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 5/8% Treasury Gilt 2032",isin:"GB00BWGDRG14",type:"conventional",coupon:4.625,maturity:"2032-03-07",dmoDate:"2026-10-16",tidm:"T32H",cleanPrice:98.27,yield:.05056,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4¼% Treasury Stock 2032",isin:"GB0004893086",type:"conventional",coupon:4.25,maturity:"2032-06-07",dmoDate:"2026-10-16",tidm:"TR32",cleanPrice:96.57,yield:.05014,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1¼% Index-linked Treasury Gilt 2032",isin:"GB00B3D4VD98",type:"il3",coupon:1.25,maturity:"2032-11-22",dmoDate:"2026-10-16",tidm:"T32",cleanPrice:99.38,yield:.01361,yieldKind:"real",baseRpi:217.13226,indexRatio:1.93647},{name:"3¼% Treasury Gilt 2033",isin:"GB00BMV7TC88",type:"conventional",coupon:3.25,maturity:"2033-01-31",dmoDate:"2026-10-16",tidm:"TR33",cleanPrice:90.35,yield:.05122,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 1/8% Treasury Gilt 2033",isin:"GB00BVP99780",type:"conventional",coupon:4.125,maturity:"2033-03-07",dmoDate:"2026-10-16",tidm:"T33H",cleanPrice:94.86,yield:.05141,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 7/8% Green Gilt 2033",isin:"GB00BM8Z2S21",type:"conventional",coupon:.875,maturity:"2033-07-31",dmoDate:"2026-10-16",tidm:"TG33",cleanPrice:76.03,yield:.0516,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0¾% Index-linked Treasury Gilt 2033",isin:"GB00BMF9LJ15",type:"il3",coupon:.75,maturity:"2033-11-22",dmoDate:"2026-10-16",tidm:"T33",cleanPrice:94.65,yield:.01554,yieldKind:"real",baseRpi:372.24,indexRatio:1.12957},{name:"4 5/8% Treasury Gilt 2034",isin:"GB00BPJJKN53",type:"conventional",coupon:4.625,maturity:"2034-01-31",dmoDate:"2026-10-16",tidm:"T34",cleanPrice:96.9,yield:.05205,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0¾% Index-linked Treasury Gilt 2034",isin:"GB00B46CGH68",type:"il3",coupon:.75,maturity:"2034-03-22",dmoDate:"2026-10-16",tidm:"TRTQ",cleanPrice:93.56,yield:.01682,yieldKind:"real",baseRpi:232.22903,indexRatio:1.81059},{name:"4¼% Treasury Gilt 2034",isin:"GB00BQC82C90",type:"conventional",coupon:4.25,maturity:"2034-07-31",dmoDate:"2026-10-16",tidm:"TS34",cleanPrice:94.12,yield:.05243,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4½% Treasury Gilt 2034",isin:"GB00B52WS153",type:"conventional",coupon:4.5,maturity:"2034-09-07",dmoDate:"2026-10-16",tidm:"TR34",cleanPrice:95.78,yield:.05223,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"2% Index-linked Treasury Stock 2035",isin:"GB0031790826",type:"il8",coupon:2,maturity:"2035-01-26",dmoDate:"2026-10-16",tidm:"T2IL",cleanPrice:241.88,yield:null,yieldKind:"real",baseRpi:173.6,indexRatio:null},{name:"4½% Treasury Gilt 2035",isin:"GB00BT7J0027",type:"conventional",coupon:4.5,maturity:"2035-03-07",dmoDate:"2026-10-16",tidm:"T35",cleanPrice:95.03,yield:.05308,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 5/8% Treasury Gilt 2035",isin:"GB00BMGR2916",type:"conventional",coupon:.625,maturity:"2035-07-31",dmoDate:"2026-10-16",tidm:"TG35",cleanPrice:67.83,yield:.05308,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1 1/8% Index-linked Treasury Gilt 2035",isin:"GB00BT7HZZ68",type:"il3",coupon:1.125,maturity:"2035-09-22",dmoDate:"2026-10-16",tidm:"TR35",cleanPrice:94.09,yield:.01854,yieldKind:"real",baseRpi:390.88065,indexRatio:1.0757},{name:"4¾% Treasury Gilt 2035",isin:"GB00BTXS1K06",type:"conventional",coupon:4.75,maturity:"2035-10-22",dmoDate:"2026-10-16",tidm:"T35V",cleanPrice:96.21,yield:.05354,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4¼% Treasury Stock 2036",isin:"GB0032452392",type:"conventional",coupon:4.25,maturity:"2036-03-07",dmoDate:"2026-10-16",tidm:"T4Q",cleanPrice:92.34,yield:.05365,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 7/8% Treasury Gilt 2036",isin:"GB00BWBR1N39",type:"conventional",coupon:4.875,maturity:"2036-07-31",dmoDate:"2026-10-16",tidm:"T36N",cleanPrice:96.45,yield:.05416,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2036",isin:"GB00BYZW3J87",type:"il3",coupon:.125,maturity:"2036-11-22",dmoDate:"2026-10-16",tidm:"TG36",cleanPrice:83.13,yield:.01985,yieldKind:"real",baseRpi:260.01935,indexRatio:1.61708},{name:"4 5/8% Green Gilt 2037",isin:"GB00BVP99905",type:"conventional",coupon:4.625,maturity:"2037-03-07",dmoDate:"2026-10-16",tidm:"T37H",cleanPrice:93.96,yield:.05464,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1¾% Treasury Gilt 2037",isin:"GB00BZB26Y51",type:"conventional",coupon:1.75,maturity:"2037-09-07",dmoDate:"2026-10-16",tidm:"TG37",cleanPrice:70.11,yield:.05492,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1 1/8% Index-linked Treasury Gilt 2037",isin:"GB00B1L6W962",type:"il3",coupon:1.125,maturity:"2037-11-22",dmoDate:"2026-10-16",tidm:"TR37",cleanPrice:90.73,yield:.02074,yieldKind:"real",baseRpi:202.24286,indexRatio:2.07904},{name:"3¾% Treasury Gilt 2038",isin:"GB00BQC4R999",type:"conventional",coupon:3.75,maturity:"2038-01-29",dmoDate:"2026-10-16",tidm:"TG38",cleanPrice:85.71,yield:.05537,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1¾% Index-linked Treasury Gilt 2038",isin:"GB00BMY62Z61",type:"il3",coupon:1.75,maturity:"2038-09-22",dmoDate:"2026-10-16",tidm:"T38",cleanPrice:95.955,yield:.02147,yieldKind:"real",baseRpi:397.6,indexRatio:1.05752},{name:"4¾% Treasury Stock 2038",isin:"GB00B00NY175",type:"conventional",coupon:4.75,maturity:"2038-12-07",dmoDate:"2026-10-16",tidm:"TR38",cleanPrice:93.46,yield:.0557,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1 1/8% Treasury Gilt 2039",isin:"GB00BLPK7334",type:"conventional",coupon:1.125,maturity:"2039-01-31",dmoDate:"2026-10-16",tidm:"TR39",cleanPrice:61.29,yield:.05574,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2039",isin:"GB00BLH38265",type:"il3",coupon:.125,maturity:"2039-03-22",dmoDate:"2026-10-16",tidm:"TG39",cleanPrice:77.27,yield:.02241,yieldKind:"real",baseRpi:296.72581,indexRatio:1.41704},{name:"4¼% Treasury Gilt 2039",isin:"GB00B3KJDS62",type:"conventional",coupon:4.25,maturity:"2039-09-07",dmoDate:"2026-10-16",tidm:"T39",cleanPrice:88.21,yield:.05618,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 3/8% Treasury Gilt 2040",isin:"GB00BQC82D08",type:"conventional",coupon:4.375,maturity:"2040-01-31",dmoDate:"2026-10-16",tidm:"TG40",cleanPrice:88.79,yield:.05658,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 5/8% Index-linked Treasury Gilt 2040",isin:"GB00B3LZBF68",type:"il3",coupon:.625,maturity:"2040-03-22",dmoDate:"2026-10-16",tidm:"TR40",cleanPrice:80.98,yield:.02289,yieldKind:"real",baseRpi:216.52258,indexRatio:1.94193},{name:"4¼% Treasury Gilt 2040",isin:"GB00B6460505",type:"conventional",coupon:4.25,maturity:"2040-12-07",dmoDate:"2026-10-16",tidm:"T40",cleanPrice:87.03,yield:.05666,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"5¼% Treasury Gilt 2041",isin:"GB00BVP99897",type:"conventional",coupon:5.25,maturity:"2041-01-31",dmoDate:"2026-10-16",tidm:"T41F",cleanPrice:96.38,yield:.057,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2041",isin:"GB00BGDYHF49",type:"il3",coupon:.125,maturity:"2041-08-10",dmoDate:"2026-10-16",tidm:"T41",cleanPrice:72.76,yield:.02319,yieldKind:"real",baseRpi:280.05484,indexRatio:1.50139},{name:"1¼ % Treasury Gilt 2041",isin:"GB00BJQWYH73",type:"conventional",coupon:1.25,maturity:"2041-10-22",dmoDate:"2026-10-16",tidm:"TG41",cleanPrice:55.98,yield:.05712,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 5/8% Index-linked Treasury Gilt 2042",isin:"GB00B3MYD345",type:"il3",coupon:.625,maturity:"2042-11-22",dmoDate:"2026-10-16",tidm:"T42A",cleanPrice:76.775,yield:.02382,yieldKind:"real",baseRpi:212.46452,indexRatio:1.97902},{name:"4½% Treasury Gilt 2042",isin:"GB00B1VWPJ53",type:"conventional",coupon:4.5,maturity:"2042-12-07",dmoDate:"2026-10-16",tidm:"T42",cleanPrice:87.63,yield:.05761,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4¾% Treasury Gilt 2043",isin:"GB00BPJJKP77",type:"conventional",coupon:4.75,maturity:"2043-10-22",dmoDate:"2026-10-16",tidm:"TR43",cleanPrice:89.32,yield:.05824,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"3¼% Treasury Gilt 2044",isin:"GB00B84Z9V04",type:"conventional",coupon:3.25,maturity:"2044-01-22",dmoDate:"2026-10-16",tidm:"TG44",cleanPrice:72.77,yield:.05842,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2044",isin:"GB00B7RN0G65",type:"il3",coupon:.125,maturity:"2044-03-22",dmoDate:"2026-10-16",tidm:"T44",cleanPrice:67.05,yield:.02476,yieldKind:"real",baseRpi:242.42258,indexRatio:1.73445},{name:"3½% Treasury Gilt 2045",isin:"GB00BN65R313",type:"conventional",coupon:3.5,maturity:"2045-01-22",dmoDate:"2026-10-16",tidm:"T45",cleanPrice:74.54,yield:.05856,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 5/8% Index-linked Treasury Gilt 2045",isin:"GB00BMF9LH90",type:"il3",coupon:.625,maturity:"2045-03-22",dmoDate:"2026-10-16",tidm:"TR45",cleanPrice:72.725,yield:.02493,yieldKind:"real",baseRpi:363.94,indexRatio:1.15533},{name:"0 7/8% Treasury Gilt 2046",isin:"GB00BNNGP775",type:"conventional",coupon:.875,maturity:"2046-01-31",dmoDate:"2026-10-16",tidm:"TG46",cleanPrice:43.22,yield:.0589,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2046",isin:"GB00BYMWG366",type:"il3",coupon:.125,maturity:"2046-03-22",dmoDate:"2026-10-16",tidm:"TR46",cleanPrice:63.525,yield:.02524,yieldKind:"real",baseRpi:257.79,indexRatio:1.63106},{name:"4¼% Treasury Gilt 2046",isin:"GB00B128DP45",type:"conventional",coupon:4.25,maturity:"2046-12-07",dmoDate:"2026-10-16",tidm:"T46",cleanPrice:81.92,yield:.05864,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1½% Treasury Gilt 2047",isin:"GB00BDCHBW80",type:"conventional",coupon:1.5,maturity:"2047-07-22",dmoDate:"2026-10-16",tidm:"TG47",cleanPrice:48.275,yield:.05911,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0¾% Index-linked Treasury Gilt 2047",isin:"GB00B24FFM16",type:"il3",coupon:.75,maturity:"2047-11-22",dmoDate:"2026-10-16",tidm:"T47",cleanPrice:71.575,yield:.02506,yieldKind:"real",baseRpi:207.76667,indexRatio:2.02377},{name:"0 1/8% Index-linked Treasury Gilt 2048",isin:"GB00BZ13DV40",type:"il3",coupon:.125,maturity:"2048-08-10",dmoDate:"2026-10-16",tidm:"TG48",cleanPrice:60.1,yield:.02527,yieldKind:"real",baseRpi:274.79333,indexRatio:1.53014},{name:"1¾% Treasury Gilt 2049",isin:"GB00BFWFPP71",type:"conventional",coupon:1.75,maturity:"2049-01-22",dmoDate:"2026-10-16",tidm:"TG49",cleanPrice:49.52,yield:.05909,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1 7/8% Index-linked Treasury Gilt 2049",isin:"GB00BT7J0134",type:"il3",coupon:1.875,maturity:"2049-09-22",dmoDate:"2026-10-16",tidm:"TR49",cleanPrice:89.32,yield:.02504,yieldKind:"real",baseRpi:391.95806,indexRatio:1.07274},{name:"4¼% Treasury Gilt 2049",isin:"GB00B39R3707",type:"conventional",coupon:4.25,maturity:"2049-12-07",dmoDate:"2026-10-16",tidm:"T49",cleanPrice:80.45,yield:.05878,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0½% Index-linked Treasury Gilt 2050",isin:"GB00B421JZ66",type:"il3",coupon:.5,maturity:"2050-03-22",dmoDate:"2026-10-16",tidm:"TR50",cleanPrice:64.425,yield:.02535,yieldKind:"real",baseRpi:213.4,indexRatio:1.97034},{name:"0 5/8% Treasury Gilt 2050",isin:"GB00BMBL1F74",type:"conventional",coupon:.625,maturity:"2050-10-22",dmoDate:"2026-10-16",tidm:"TG50",cleanPrice:33.18,yield:.05915,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2051",isin:"GB00BNNGP882",type:"il3",coupon:.125,maturity:"2051-03-22",dmoDate:"2026-10-16",tidm:"TG51",cleanPrice:56.57,yield:.02531,yieldKind:"real",baseRpi:294.11071,indexRatio:1.42964},{name:"1¼% Treasury Gilt 2051",isin:"GB00BLH38158",type:"conventional",coupon:1.25,maturity:"2051-07-31",dmoDate:"2026-10-16",tidm:"T51A",cleanPrice:40.07,yield:.05953,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0¼% Index-linked Treasury Gilt 2052",isin:"GB00B73ZYW09",type:"il3",coupon:.25,maturity:"2052-03-22",dmoDate:"2026-10-16",tidm:"TG52",cleanPrice:57.72,yield:.02525,yieldKind:"real",baseRpi:242.05,indexRatio:1.73712},{name:"3¾% Treasury Gilt 2052",isin:"GB00B6RNH572",type:"conventional",coupon:3.75,maturity:"2052-07-22",dmoDate:"2026-10-16",tidm:"T52",cleanPrice:72.6,yield:.05899,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1½% Green Gilt 2053",isin:"GB00BM8Z2V59",type:"conventional",coupon:1.5,maturity:"2053-07-31",dmoDate:"2026-10-16",tidm:"TG53",cleanPrice:41.405,yield:.05949,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"3¾% Treasury Gilt 2053",isin:"GB00BPCJD997",type:"conventional",coupon:3.75,maturity:"2053-10-22",dmoDate:"2026-10-16",tidm:"T53",cleanPrice:71.74,yield:.05928,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 3/8% Treasury Gilt 2054",isin:"GB00BPSNBB36",type:"conventional",coupon:4.375,maturity:"2054-07-31",dmoDate:"2026-10-16",tidm:"T54",cleanPrice:79.91,yield:.05931,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1 5/8% Treasury Gilt 2054",isin:"GB00BJLR0J16",type:"conventional",coupon:1.625,maturity:"2054-10-22",dmoDate:"2026-10-16",tidm:"TR54",cleanPrice:42.305,yield:.05913,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1¼% Index-linked Treasury Gilt 2054",isin:"GB00BPSNBG80",type:"il3",coupon:1.25,maturity:"2054-11-22",dmoDate:"2026-10-16",tidm:"TG54",cleanPrice:75.3,yield:.0249,yieldKind:"real",baseRpi:378.58065,indexRatio:1.11065},{name:"1¼% Index-linked Treasury Gilt 2055",isin:"GB00B0CNHZ09",type:"il3",coupon:1.25,maturity:"2055-11-22",dmoDate:"2026-10-16",tidm:"TR8F",cleanPrice:75.07,yield:.02469,yieldKind:"real",baseRpi:192.2,indexRatio:2.18767},{name:"4¼% Treasury Gilt 2055",isin:"GB00B06YGN05",type:"conventional",coupon:4.25,maturity:"2055-12-07",dmoDate:"2026-10-16",tidm:"TR4Q",cleanPrice:78.25,yield:.0589,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"5 3/8% Treasury Gilt 2056",isin:"GB00BT7J0241",type:"conventional",coupon:5.375,maturity:"2056-01-31",dmoDate:"2026-10-16",tidm:"T56",cleanPrice:93.81,yield:.05902,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-Linked Treasury Gilt 2056",isin:"GB00BYVP4K94",type:"il3",coupon:.125,maturity:"2056-11-22",dmoDate:"2026-10-16",tidm:"TR56",cleanPrice:51.325,yield:.02422,yieldKind:"real",baseRpi:264.88333,indexRatio:1.58738},{name:"1¾% Treasury Gilt 2057",isin:"GB00BD0XH204",type:"conventional",coupon:1.75,maturity:"2057-07-22",dmoDate:"2026-10-16",tidm:"TG57",cleanPrice:42.24,yield:.05878,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2058",isin:"GB00BP9DLZ64",type:"il3",coupon:.125,maturity:"2058-03-22",dmoDate:"2026-10-16",tidm:"T58",cleanPrice:50.415,yield:.02386,yieldKind:"real",baseRpi:255.8871,indexRatio:1.64319},{name:"4% Treasury Gilt 2060",isin:"GB00B54QLM75",type:"conventional",coupon:4,maturity:"2060-01-22",dmoDate:"2026-10-16",tidm:"TR60",cleanPrice:74.01,yield:.05847,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0½% Treasury Gilt 2061",isin:"GB00BMBL1D50",type:"conventional",coupon:.5,maturity:"2061-10-22",dmoDate:"2026-10-16",tidm:"TG61",cleanPrice:22.735,yield:.05568,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 3/8% Index-linked Treasury Gilt 2062",isin:"GB00B4PTCY75",type:"il3",coupon:.375,maturity:"2062-03-22",dmoDate:"2026-10-16",tidm:"T62",cleanPrice:53.73,yield:.02301,yieldKind:"real",baseRpi:235.82903,indexRatio:1.78295},{name:"4% Treasury Gilt 2063",isin:"GB00BMF9LF76",type:"conventional",coupon:4,maturity:"2063-10-22",dmoDate:"2026-10-16",tidm:"TR63",cleanPrice:73.37,yield:.05826,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"2½% Treasury Gilt 2065",isin:"GB00BYYMZX75",type:"conventional",coupon:2.5,maturity:"2065-07-22",dmoDate:"2026-10-16",tidm:"TG65",cleanPrice:50.49,yield:.0575,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2065",isin:"GB00BD9MZZ71",type:"il3",coupon:.125,maturity:"2065-11-22",dmoDate:"2026-10-16",tidm:"TR65",cleanPrice:46.085,yield:.02194,yieldKind:"real",baseRpi:260.43448,indexRatio:1.6145},{name:"0 1/8% Index-linked Treasury Gilt 2068",isin:"GB00BDX8CX86",type:"il3",coupon:.125,maturity:"2068-03-22",dmoDate:"2026-10-16",tidm:"T68",cleanPrice:45.19,yield:.0213,yieldKind:"real",baseRpi:249.7,indexRatio:1.6839},{name:"3½% Treasury Gilt 2068",isin:"GB00BBJNQY21",type:"conventional",coupon:3.5,maturity:"2068-07-22",dmoDate:"2026-10-16",tidm:"TR68",cleanPrice:65.64,yield:.05731,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1 5/8% Treasury Gilt 2071",isin:"GB00BFMCN652",type:"conventional",coupon:1.625,maturity:"2071-10-22",dmoDate:"2026-10-16",tidm:"TG71",cleanPrice:36.37,yield:.05482,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2073",isin:"GB00BM8Z2W66",type:"il3",coupon:.125,maturity:"2073-03-22",dmoDate:"2026-10-16",tidm:"TG73",cleanPrice:47.6,yield:.018,yieldKind:"real",baseRpi:308.32,indexRatio:1.36375},{name:"1 1/8% Treasury Gilt 2073",isin:"GB00BLBDX619",type:"conventional",coupon:1.125,maturity:"2073-10-22",dmoDate:"2026-10-16",tidm:"TR73",cleanPrice:28.445,yield:.05297,yieldKind:"nominal",baseRpi:null,indexRatio:null}]},Y=t=>Number.isFinite(+t)?+t:0,_e=t=>String(t||"").toUpperCase().trim(),_t=t=>"£"+Math.round(Y(t)).toLocaleString("en-GB"),Zh=t=>{const e=new Date(String(t).slice(0,10)+"T00:00:00Z");return Number.isNaN(e.getTime())?String(t):e.toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"})},ep=.02,tp=new Set(["CSH2","CASH","MMF","XSTR","ERNS","ERNX"]),np=new Set((Array.isArray(hn==null?void 0:hn.gilts)?hn.gilts:[]).map(t=>_e(t&&t.tidm)).filter(Boolean));function ip(t){const e=_e(t);return np.has(e)||/^T[RGNS]?\d{2}[A-Z]?$/.test(e)||/^GB00B/.test(e)}function bi(t,e){var i,r;if(+(e==null?void 0:e.firstTaxYear)>0)return+e.firstTaxYear;if(+((i=t.timing)==null?void 0:i.firstTaxYear)>0)return+t.timing.firstTaxYear;if(+((r=t.assumptions)==null?void 0:r.firstTaxYear)>0)return+t.assumptions.firstTaxYear;const n=[...Array.isArray(e==null?void 0:e.cashYears)?e.cashYears.map(s=>+s.Y):[],...Array.isArray(e==null?void 0:e.orders)?e.orders.flatMap(s=>Array.isArray(s.taxYears)?s.taxYears.map(Number):[]):[]].filter(s=>s>2e3);return n.length?Math.min(...n):null}function Qr(t,e=new Date){var o,l,a;const n=t||{},i=(l=(o=n.strategy)==null?void 0:o.r)==null?void 0:l.plan,r=bi(n,i);if(!(r>0)||Te(e)<r)return!1;const s=(a=n.timing)==null?void 0:a.startMonth;return typeof s=="string"&&/^\d{4}-\d{2}$/.test(s)?e.getFullYear()+"-"+String(e.getMonth()+1).padStart(2,"0")>=s:!0}function rp(t,{today:e=new Date,params:n=null,runUpMonthly:i=0}={}){var u,c,d,h,f,m,p,y,O,E,g,v,R;const r=t||{},s=(c=(u=r.strategy)==null?void 0:u.r)==null?void 0:c.plan,o=Te(e);if((d=r.strategy)!=null&&d.contract&&s&&Array.isArray(s.orders)){const b=bi(r,s),I=Qr(r,e),S=w=>({key:"gilt:"+_e(w.tidm||w.sedol||w.name),wrapper:"SIPP",kind:"gilt",label:w.name,ticker:_e(w.tidm),sedol:w.sedol||null,matures:w.matures||null,units:Math.round(Y(w.nominal)),cost:Math.round(Y(w.cost)),pays:Math.round(Y(w.pays)),taxYears:Array.isArray(w.taxYears)?w.taxYears.slice():[],cleanPrice:Y(w.cleanPrice)||null,indexRatio:Y(w.indexRatio)||null}),T=s.orders.filter(w=>Y(w.pays)>0),C=w=>{const ie=w.matures?Date.parse(w.matures):NaN;return Number.isFinite(ie)?ie<e.getTime():Array.isArray(w.taxYears)&&w.taxYears.length>0&&w.taxYears.every(gt=>+gt<o)},D=n&&n.borrowedFloor||((f=(h=r.strategy)==null?void 0:h.params)==null?void 0:f.borrowedFloor)||((m=r.rotation)==null?void 0:m.borrowedFloor)||null,V=new Set(D&&Array.isArray(D.tidms)?D.tidms.map(_e).filter(Boolean):[]),Q=w=>V.has(_e(w.tidm)),_=T.filter(w=>!Q(w)),A=_.filter(w=>!C(w)).map(S),N=_.filter(C).map(S),K=T.filter(Q).map(S),ne=!!D,X=Array.isArray(s.cashYears)?s.cashYears:[],Se=X.filter(w=>+w.Y>=o).map(w=>+w.Y),H=Math.max(0,Y(((p=r.assumptions)==null?void 0:p.bridgeCash)??((O=(y=r.strategy)==null?void 0:y.params)==null?void 0:O.bridgeCash))),Z=X.reduce((w,ie)=>w+Y(ie.cost),0),te=Z>0?Z:Math.max(0,Y(s.cash)-H);let We=Math.round(te),ae={months:0,monthly:0,value:0};if(!I&&H>0){const w=Array.isArray(r.timeline)&&r.timeline[0]?r.timeline[0]:null,ie=Y(i)>0?Y(i):w?Math.max(0,(Y(w.gross)-Y(w.sp)-Y(w.other))/12):0,gt=Date.UTC(b||o+1,3,6),Vt=Math.max(0,Math.round((gt-e.getTime())/(30.44*864e5)));ae={months:Vt,monthly:Math.round(ie),value:Math.round(Math.min(H,ie*Vt))},We+=ae.value}I&&(Array.isArray(s.years)&&s.years.length?We=Math.round(s.years.filter(w=>w.from==="cash"&&+w.Y>=o).reduce((w,ie)=>w+Y(ie.need),0)):X.length&&(We=Math.round(te*Se.length/X.length)));const Bt=[];ae.value>0&&Bt.push({label:"Run-up: "+ae.months+" month"+(ae.months===1?"":"s")+" × "+_t(ae.monthly)+" until the ladder pays",amount:ae.value});for(const w of X){if(I&&+w.Y<o)continue;const ie=Array.isArray(r.timeline)?r.timeline.find(Vt=>Vt&&q(+w.Y)===Vt.taxYear):null,gt=ie&&Y(ie.lump)>0?Y(ie.lump):0;Bt.push({label:"Cash year "+q(+w.Y)+(gt>0?" ("+_t(gt)+" of it paid by a lump sum expected that year)":""),amount:Math.round(Y(w.cost))})}const zn={key:"cash:SIPP",wrapper:"SIPP",kind:"cash",label:"Money-market fund / cash (e.g. CSH2)",value:We,runUp:ae,breakdown:Bt,spending:I,yearsLeft:I?Se:X.map(w=>+w.Y),bridgeCash:Math.round(H)};let x="The ladder is bought in the SIPP. The ISA is "+(((E=r.pots)==null?void 0:E.isaPolicy)==="hold"?"held aside and not part of the ladder.":"drawn by its own policy and not part of the ladder.");return H>0&&!I&&(x+=ae.value>0?" The run-up is paid from the same cash: "+ae.months+" month"+(ae.months===1?"":"s")+" at about "+_t(ae.monthly)+" are still to come, so "+_t(ae.value)+" of the "+_t(H)+" set aside is in the target; the rest has been spent as designed.":" The "+_t(H)+" of bridge cash for the run-up has been spent as designed, so it is no longer a target."),I&&(x+=" The plan is running (tax year "+q(o)+")"+(N.length?": "+N.length+" rung"+(N.length===1?" has":"s have")+" matured and paid, so "+(N.length===1?"it is":"they are")+" no longer targets":"")+"; the cash years' money is being spent as designed, so cash is reported, not diffed."),K.length&&(x+=" The rotation fired"+(D.soldAt?" on "+Zh(D.soldAt):"")+": "+K.length+" rung"+(K.length===1?" was":"s were")+" sold and the proceeds bought the equity fund, so "+(K.length===1?"it is no longer a target":"they are no longer targets")+" and the fund is kept."),{kind:"ladder",lines:A,paid:N,sold:K,rotated:ne,cash:zn,running:I,thisTaxYear:o,firstTaxYear:b,note:x}}const l=Array.isArray(r.targetMix)&&r.targetMix.length?r.targetMix[0]:null,a=Y((v=(g=r.pots)==null?void 0:g.potAtRetirement)==null?void 0:v.sipp)>0?Y(r.pots.potAtRetirement.sipp):Y((R=r.pots)==null?void 0:R.sipp);return l&&a>0?{kind:"buckets",lines:[{key:"bucket:shares",wrapper:"SIPP",kind:"bucket",bucket:"shares",label:"Shares (world tracker)",value:Math.round(a*l.equity/100),pct:l.equity},{key:"bucket:bonds",wrapper:"SIPP",kind:"bucket",bucket:"bonds",label:"Bonds (gilts / index-linked / global agg)",value:Math.round(a*l.bond/100),pct:l.bond},{key:"bucket:cash",wrapper:"SIPP",kind:"bucket",bucket:"cash",label:"Cash (money-market fund)",value:Math.round(a*l.cash/100),pct:l.cash}],paid:[],sold:[],rotated:!1,cash:null,running:Qr(r,e),thisTaxYear:o,firstTaxYear:bi(r,null),note:`A pot strategy: the target is a mix, not a list of funds. Any world tracker, gilt fund or money-market fund fills its bucket; the Stress tester's "Example funds" shows one way.`}:{kind:"none",lines:[],paid:[],sold:[],rotated:!1,cash:null,running:!1,thisTaxYear:o,firstTaxYear:null,note:"No plan document yet — lock the plan first."}}function sp(t){const e=(t||[]).filter(i=>i&&(Y(i.value)>0||Y(i.units)>0)),n=yi(e.map(i=>({...i,value:Y(i.value)})));return e.map(i=>{const r=_e(i.ticker),s=ip(r)||i.kind==="gilt",o=tp.has(r)||_e(i.wrapper)==="CASH"||i.kind==="cash"||i.subClass==="cash"||i.subClass==="moneyMarket",l=n.tagged.find(a=>a.ticker===i.ticker&&a.wrapper===i.wrapper&&Math.abs(Y(a.value)-Y(i.value))<1);return{ticker:r,name:i.name||"",sedol:i.sedol||null,wrapper:_e(i.wrapper)||"SIPP",value:Y(i.value),units:Y(i.units)||null,gilt:s,cash:o,bucket:o?"cash":s?"bonds":l?l.bucket:i.subClass?"shares":null}})}function op(t,e,{tolerance:n=ep}={}){const i=sp(t),r=i.filter(b=>b.wrapper==="SIPP"),s=b=>b.wrapper==="ISA"?"ISA — kept as it is":b.wrapper==="CASH"?"bank / savings cash — outside the pension, kept as it is":"taxable account — kept as it is",o=[],l=[],a=[],u=[],c=[],d=i.filter(b=>b.wrapper!=="SIPP").map(b=>({...b,why:s(b)}));let h=0,f=0,m=0,p=0,y=0,O=null;if(e.kind==="ladder"){const b=new Set,I=_=>{const A=String(_||"").match(/(20\d{2})/);if(A)return+A[1];const N=String(_||"").match(/^T[RGNS]?(\d{2})[A-Z]?$/i);return N?2e3+ +N[1]:null},S=(_,A)=>_.ticker&&A.ticker&&_.ticker===A.ticker||A.sedol&&(_e(_.sedol)===_e(A.sedol)||_e(_.name).includes(_e(A.sedol))),T=(_,A,N)=>_.ticker&&_.ticker.length>=3&&A.label&&_e(A.label).includes(_.ticker)||N&&(I(_.name)===N||I(_.ticker)===N),C=[...e.paid||[],...e.sold||[],...e.lines],D=new Map,V=(_,A)=>{const N=r.filter(K=>!b.has(K)&&K.gilt&&A(K));N.forEach(K=>b.add(K)),D.set(_,N)};for(const _ of C)V(_,A=>S(A,_));for(const _ of C)if(!D.get(_).length){const A=I(_.matures)||I(_.label)||I(_.ticker);V(_,N=>T(N,_,A))}const Q=_=>D.get(_)||[];for(const _ of e.paid||[])for(const A of Q(_))u.push({...A,key:"matured:"+(A.ticker||_.ticker),label:A.name||A.ticker||_.label,rung:_.label,why:"matured and paid"+(_.taxYears.length?" in "+_.taxYears.map(q).join(", "):"")+" — remove it from your record"});for(const _ of e.sold||[])for(const A of Q(_))c.push({...A,key:"sold:"+(A.ticker||_.ticker),label:A.name||A.ticker||_.label,rung:_.label,why:"sold by the rotation — remove it from your record"});for(const _ of e.lines){const A=Q(_),N=_.cleanPrice&&_.indexRatio?_.cleanPrice*_.indexRatio/100:_.units>0?_.cost/_.units:null,K=A.reduce((X,Se)=>X+(Se.units!=null?Se.units:N?Se.value/N:0),0),ne=_.units-K;h+=_.cost,f+=Math.min(_.cost,N?K*N:0),m++,_.units>0&&Math.abs(ne)<=n*_.units?a.push({..._,heldUnits:Math.round(K)}):ne>0?o.push({..._,units:Math.round(ne),amount:Math.round(N?ne*N:_.cost*(ne/_.units)),heldUnits:Math.round(K),why:"rung for "+_.taxYears.map(q).join(", ")}):l.push({..._,units:Math.round(-ne),amount:Math.round(N?-ne*N:0),heldUnits:Math.round(K),why:"more than the rung needs"})}p=r.filter(_=>_.cash).reduce((_,A)=>_+A.value,0),y=e.cash?e.cash.value:0,e.cash&&e.cash.spending?O={held:Math.round(p),target:Math.round(y),yearsLeft:Array.isArray(e.cash.yearsLeft)?e.cash.yearsLeft.slice():[]}:e.cash&&(h+=y,f+=Math.min(y,p),y>0&&m++,y>0&&p>=y*(1-n)?a.push({...e.cash,heldValue:Math.round(p),spare:Math.round(Math.max(0,p-y))}):y>p&&o.push({...e.cash,amount:Math.round(y-p),heldValue:Math.round(p),why:"the cash years"}));for(const _ of r)!b.has(_)&&!_.cash&&(e.rotated&&!_.gilt?d.push({..._,why:"bought by the rotation — kept"}):l.push({key:"sell:"+(_.ticker||_.name),wrapper:"SIPP",kind:_.gilt?"gilt":"fund",label:_.name||_.ticker,ticker:_.ticker,amount:Math.round(_.value),units:_.units,why:"not in the plan — proceeds fund the ladder"}))}else if(e.kind==="buckets"){const b={shares:0,bonds:0,cash:0,diversifiers:0};for(const I of r)b[I.bucket||"shares"]+=I.value;p=b.cash;for(const I of e.lines){const S=b[I.bucket]||0,T=I.value-S;h+=I.value,f+=Math.min(I.value,S),I.value>0&&m++,I.bucket==="cash"&&(y=I.value),I.value>0&&Math.abs(T)<=n*I.value?a.push({...I,heldValue:Math.round(S)}):T>0?o.push({...I,amount:Math.round(T),heldValue:Math.round(S),why:"bring "+I.bucket+" up to "+I.pct+"% of the pot"}):(I.value>0||S>0)&&l.push({...I,amount:Math.round(-T),heldValue:Math.round(S),why:"bring "+I.bucket+" down to "+I.pct+"% of the pot"})}b.diversifiers>0&&l.push({key:"bucket:diversifiers",wrapper:"SIPP",kind:"bucket",bucket:"diversifiers",label:"Diversifiers",amount:Math.round(b.diversifiers),why:"not in the target mix"})}const E=o.reduce((b,I)=>b+Y(I.amount),0),g=l.reduce((b,I)=>b+Y(I.amount),0);let v=!1,R;return e.kind==="none"?R="no plan document to read against":o.length?R=o.length+" line"+(o.length===1?"":"s")+" still to buy":l.length?R=l.length+" line"+(l.length===1?"":"s")+" to sell":a.length<m?R=m-a.length+" target line"+(m-a.length===1?"":"s")+" not held":m===0?(v=!0,R=e.kind==="ladder"?"every rung has matured and paid — nothing left to hold":"the target is empty"):(v=!0,R=e.kind==="ladder"?"every rung the plan still needs is held"+(e.cash&&!e.cash.spending?", and the cash years are covered":""):"every bucket is within "+Math.round(n*100)+"% of its target"),{kind:e.kind,buy:o,sell:l,hold:a,keep:d,matured:u,sold:c,cashInfo:O,totals:{buyCost:Math.round(E),sellValue:Math.round(g),shortfall:Math.round(Math.max(0,E-g)),cashHeld:Math.round(p),cashTarget:Math.round(y)},progressPct:h>0?Math.round(100*f/h):v?100:0,complete:v,reason:R}}function ap(t,e={}){const n=[...t.buy.map(s=>({...s,action:"buy"})),...t.sell.map(s=>({...s,action:"sell"}))],i=n.filter(s=>!e[s.key]),r=n.length-i.length;return{pct:n.length?Math.round(100*(t.progressPct/100*0+(n.length-i.length)/n.length)):100,held:t.progressPct,doneCount:r,total:n.length,next:i[0]||null}}function lp(){return{settings:{equityMin:oe.EQUITY_MIN,bondMin:oe.BOND_MIN,cashTarget:oe.CASH_TARGET,duration:oe.DURATION_YEARS,baseSalary:oe.BASE_SALARY,other:0,statePension:12e3,statePensionYear:12,pa:pe.PERSONAL_ALLOWANCE,brl:pe.BASIC_RATE_LIMIT,hrl:pe.HIGHER_RATE_LIMIT,taxMode:"inflates",protectionMult:De.PROTECTION_MULTIPLIER,consecutiveLimit:oe.CONSECUTIVE_LIMIT,disableProtection:!1,hodlEnabled:De.HODL_ENABLED,hodlValue:De.HODL_VALUE,spendingProfile:"flat",equityGlideEnabled:!1,diversifierStart:0,taggedFunds:[]},lastModified:null,checksum:null}}function cp(t,e=new Date){const n={...lp()};t.settings&&(n.settings={...n.settings,...t.settings},t.settings.pacwMin!==void 0&&t.settings.equityMin===void 0&&(n.settings.equityMin=t.settings.pacwMin),t.settings.cgtMin!==void 0&&t.settings.bondMin===void 0&&(n.settings.bondMin=t.settings.cgtMin),t.settings.csh2Target!==void 0&&t.settings.cashTarget===void 0&&(n.settings.cashTarget=t.settings.csh2Target),n.settings.hodlEnabled===void 0&&(n.settings.hodlEnabled=!1),n.settings.hodlValue===void 0&&(n.settings.hodlValue=25e3));const i=n.settings;if(i.spendingProfile==="declining"){const r=+i.shapeAgeNow||57,s=i.incomeShape==="phases"&&Array.isArray(i.incomeSteps)&&i.incomeSteps.length?i.incomeSteps:[{fromAge:r,amount:+i.baseSalary||0}];i.incomeShape="phases",i.incomeSteps=Lo(s,r),i.shapeAgeNow=r,i.targetSchedule=Bo(i,r),i.spendingProfile="flat",i.spendingMigratedFrom="declining"}return n.settings=bh(n.settings,t.budget||null,e),n.lastModified=t.lastModified,n.checksum=t.checksum,n}const up=t=>t===void 0?void 0:JSON.parse(JSON.stringify(t)),dp=t=>!!(t&&t.decisionTool&&wh(t.decisionTool.settings));function hp(t){const e=t&&t.stressTool&&t.stressTool.settings;return e&&typeof e=="object"?up(e):t&&!dp(t)?{...Kr(),chargesPct:is,isaGrowth:rs}:Kr()}function qi(t,{now:e=new Date}={}){const n=hp(t),i=t&&t.budgetTool&&t.budgetTool.settings||Co();return i&&xo(i)&&+i.currentAge>(+n.currentAge||0)&&(n.currentAge=+i.currentAge,n.currentAgeAsOf=i.currentAgeAsOf||n.currentAgeAsOf||null),cp({settings:n,budget:i||null,lastModified:null,checksum:null},e).settings}function pp(t,{now:e=new Date}={}){const n=t||{},i=qi(n,{now:e});return Nh({...n,stressTool:{...n.stressTool||{},settings:i}},e)}function fp(t=new Date){return t.getFullYear()+"-"+String(t.getMonth()+1).padStart(2,"0")}function $n(t,e=500){return(Array.isArray(t&&t.decisionTool&&t.decisionTool.history)?t.decisionTool.history:[]).filter(i=>i&&typeof i=="object").slice().sort((i,r)=>String(i.date||"").localeCompare(String(r.date||""))).slice(-e)}function So(t,{now:e=new Date}={}){const n=t||{},i=n.planDocument||null,r=$n(n);let s=null;if(i&&i.strategy&&i.strategy.contract){const u=Jr(i,i.strategy.id||null);s=u?Qh(u,{today:e}):null}const o=i&&i.accumulation&&Array.isArray(n.accumulationTool&&n.accumulationTool.history)?n.accumulationTool.history:[],l=xt(n.holdings),a=n.decisionTool&&n.decisionTool.taxYears||null;return{today:e,history:r,ladderPos:s,accHistory:o,holdings:l,taxYears:a,ladderInDocument:!!(i&&Jr(i,i.strategy&&i.strategy.id||null))}}function mp(t,{now:e=new Date}={}){const n=t&&t.planDocument;if(!n)return null;const{ladderInDocument:i,...r}=So(t,{now:e});return zh(n,r)}function gp(t,{now:e=new Date}={}){const n=t||{},i=n.planDocument||null;if(!i)return null;const r=qi(n,{now:e});let s=0;const o=Ki(Te(e)),l=n.decisionTool&&n.decisionTool.taxYears&&n.decisionTool.taxYears[o];if(s=+(l&&l.expectedMonthly&&l.expectedMonthly.sipp&&l.expectedMonthly.sipp.gross)||0,!s){const f=$n(n),m=f.length?f[f.length-1]:null;s=m&&(+m.sippDraw||+m.sipp)||0}const a=rp(i,{today:e,params:r.strategyParams||null,runUpMonthly:s}),u=xt(n.holdings),c=op(u.lines||[],a),d=n.transition&&n.transition.done||{},h=ap(c,d);return{target:a,diff:c,prog:h}}const Xr=Object.freeze({unknown:["plan","budget","hold","household"],saving:["saving","pot","plan","budget","lock","hold","household"],approaching:["plan","saving","pot","budget","lock","hold","move","household"],"committed-saving":["pot","where","plan","saving","budget","hold","move","household"],"draft-retired":["plan","budget","lock","hold","move","household"],bridge:["month","where","plan","hold","move","budget","household"],running:["month","where","plan","hold","move","budget","household"]}),yp=Object.freeze(["pot","budget","lock","hold","move","household"]),_p=Object.freeze(["month","where","plan","pot","saving","budget","lock","hold","move","household"]),Zr=Object.freeze(["draft-retired","bridge","running"]),wo=Object.freeze(["saving","approaching","committed-saving"]),vp=Object.freeze(["P.readonly","P.noAge","P.arrive","P.taxyear","P.month","P.idle","P.pot","P.working","P.stale","P.draft","P.approaching","P.saving"]);function Tp(t,{locked:e,linked:n,manyPlans:i}){return(Xr[t]||Xr.unknown).filter(s=>!(s==="lock"&&e)&&!(s==="household"&&!n&&!i)).map(s=>({id:s,optional:yp.includes(s)&&!(s==="pot"&&t==="committed-saving")}))}const U=t=>t==null||t===""||!Number.isFinite(+t)?null:+t,qe=t=>Array.isArray(t)?t.filter(e=>e&&typeof e=="object"):[],ve=(t,e)=>({k:t,v:Math.round(U(e)||0),kind:"money"}),we=(t,e)=>({k:t,v:Math.round(U(e)||0),kind:"count"}),ri=(t,e)=>({k:t,v:Math.round((U(e)||0)*100)/100,kind:"pct"}),Ee=(t,e)=>({k:t,v:!!e,kind:"yesNo"}),ot=(t,e)=>({k:t,v:String(e),kind:"choice"}),Gt=(t,e)=>({k:t,v:String(e),kind:"text"}),bp=["January","February","March","April","May","June","July","August","September","October","November","December"],Ip=t=>{const e=/^(\d{4})-(\d{2})-(\d{2})/.exec(String(t||""));return e&&+e[2]>=1&&+e[2]<=12?+e[3]+" "+bp[+e[2]-1]+" "+e[1]:String(t||"")},si=(t,e)=>Gt(t,Ip(e)),Ap=Object.freeze([{id:"inc.streams",keys:["stress.extraIncomes"],set:t=>qe(t.extraIncomes).some(e=>U(e.annual)>0),facts:t=>qe(t.extraIncomes).filter(e=>U(e.annual)>0).flatMap((e,n)=>[ve("annual"+n,e.annual),we("fromAge"+n,e.fromAge),we("years"+n,e.years)])},{id:"inc.lump-sums",keys:["stress.windfalls","decision.windfalls"],set:t=>qe(t.windfalls).some(e=>U(e.amount)>0),facts:t=>qe(t.windfalls).filter(e=>U(e.amount)>0).flatMap((e,n)=>[ve("amount"+n,e.amount),we("atAge"+n,e.atAge??e.fromAge??e.age)])},{id:"inc.extra-spends",keys:["stress.extraWithdrawals"],set:t=>qe(t.extraWithdrawals).some(e=>U(e.amount)>0),facts:t=>qe(t.extraWithdrawals).filter(e=>U(e.amount)>0).flatMap((e,n)=>[ve("amount"+n,e.amount),we("atAge"+n,e.atAge??e.fromAge??e.age),we("years"+n,e.years??1)])},{id:"inc.final-salary-rises",keys:["stress.dbIndexation"],set:t=>U(t.dbAmount)>0&&!!t.dbIndexation&&t.dbIndexation!=="cpi",facts:t=>[ot("rises",t.dbIndexation||"cpi")]},{id:"inc.state-pension-old",keys:["stress.statePension","stress.statePensionYear","decision.statePension","decision.statePensionYear"],set:t=>!t.spStartDate&&U(t.statePension)>0,facts:t=>[ve("yearly",t.statePension),we("fromYear",t.statePensionYear)]},{id:"tax.bands",keys:["stress.pa","stress.brl","stress.hrl"],set:t=>(U(t.pa)??pe.PERSONAL_ALLOWANCE)!==pe.PERSONAL_ALLOWANCE||(U(t.brl)??pe.BASIC_RATE_LIMIT)!==pe.BASIC_RATE_LIMIT||(U(t.hrl)??pe.HIGHER_RATE_LIMIT)!==pe.HIGHER_RATE_LIMIT,facts:t=>[ve("pa",t.pa??pe.PERSONAL_ALLOWANCE),ve("brl",t.brl??pe.BASIC_RATE_LIMIT),ve("hrl",t.hrl??pe.HIGHER_RATE_LIMIT)]},{id:"tax.mode",keys:["stress.taxMode"],set:t=>!!t.taxMode&&t.taxMode!=="inflates",facts:t=>[ot("mode",t.taxMode||"inflates")]},{id:"tax.tax-free-cash",keys:["stress.accessMethod","decision.accessMethod"],set:(t,e)=>!!(t.accessMethod||e.accessMethod)&&(t.accessMethod||e.accessMethod)!=="drawdown",facts:(t,e)=>[ot("how",t.accessMethod||e.accessMethod||"drawdown")]},{id:"tax.ufpls-years",keys:["stress.ufplsYears","stress.ufplsThenPcls","decision.ufplsYears","decision.ufplsThenPcls"],set:(t,e)=>U(t.ufplsYears??e.ufplsYears)>0,facts:(t,e)=>[we("years",t.ufplsYears??e.ufplsYears),Ee("thenRest",t.ufplsThenPcls??e.ufplsThenPcls)]},{id:"tax.band-fill",keys:["stress.bandFillRecycle","decision.bandFillRecycle"],set:(t,e)=>!!(t.bandFillRecycle??e.bandFillRecycle),facts:(t,e)=>[Ee("on",t.bandFillRecycle??e.bandFillRecycle)]},{id:"tax.bed-and-isa",keys:["stress.bedAndIsa","decision.bedAndIsa"],set:(t,e)=>!!(t.bedAndIsa??e.bedAndIsa),facts:(t,e)=>[Ee("on",t.bedAndIsa??e.bedAndIsa)]},{id:"tax.earnings",keys:["stress.relevantEarnings","decision.relevantEarnings"],set:(t,e)=>U(t.relevantEarnings??e.relevantEarnings)>0,facts:(t,e)=>[ve("yearly",t.relevantEarnings??e.relevantEarnings)]},{id:"prot.cuts",keys:["stress.consecutiveLimit","stress.protectionMult","stress.protectionEscalateMonths","stress.recoveryBuffer","stress.disableProtection","decision.consecutiveLimit","decision.protectionFactor","decision.protectionEscalateMonths","decision.recoveryBuffer","decision.disableProtection"],set:t=>!!t.disableProtection||(U(t.consecutiveLimit)??oe.CONSECUTIVE_LIMIT)!==oe.CONSECUTIVE_LIMIT||(U(t.protectionMult)??De.PROTECTION_MULTIPLIER)!==De.PROTECTION_MULTIPLIER||(U(t.recoveryBuffer)??oe.RECOVERY_BUFFER)!==oe.RECOVERY_BUFFER||U(t.protectionEscalateMonths)>0,facts:t=>[Ee("off",!!t.disableProtection),we("after",t.consecutiveLimit??oe.CONSECUTIVE_LIMIT),ri("cutTo",(U(t.protectionMult)??De.PROTECTION_MULTIPLIER)*100),we("deeperAfter",t.protectionEscalateMonths??0),ve("buffer",t.recoveryBuffer??oe.RECOVERY_BUFFER)]},{id:"prot.reserve",keys:["stress.hodlEnabled","stress.hodlValue"],set:t=>!!t.hodlEnabled,facts:t=>[Ee("on",!!t.hodlEnabled),ve("amount",t.hodlValue??De.HODL_VALUE)]},{id:"pots.diversifiers",keys:["stress.diversifierStart","decision.diversifierStart"],set:t=>U(t.diversifierStart)>0,facts:t=>[ve("amount",t.diversifierStart)]},{id:"pots.bond-tent",keys:["stress.equityGlideEnabled","decision.equityGlideEnabled","stress.glideEndgame","decision.glideEndgame"],set:t=>!!t.equityGlideEnabled,facts:t=>[Ee("on",!!t.equityGlideEnabled),ot("endgame",t.glideEndgame||"hold")]},{id:"pots.isa-use",keys:["stress.isaDrawdownStrategy","decision.isaDrawdownStrategy"],set:t=>!!t.isaDrawdownStrategy&&t.isaDrawdownStrategy!==bt.DRAWDOWN_STRATEGY,facts:t=>[ot("use",t.isaDrawdownStrategy||bt.DRAWDOWN_STRATEGY)]},{id:"pots.isa-growth",keys:["stress.isaGrowth","stress.isaReturn","stress.isaMin","decision.isaReturn","decision.isaMin"],set:t=>t.isaGrowth==="invested"||U(t.isaMin)>0,facts:t=>[ot("grows",t.isaGrowth==="invested"?"invested":t.isaGrowth==="cash"?"cash":"fixed"),ri("fixedRate",(U(t.isaReturn)??bt.RETURN)*100),ve("floor",t.isaMin??0)]},{id:"pots.charges",keys:["stress.chargesPct"],set:t=>U(t.chargesPct)!=null&&U(t.chargesPct)!==.5,facts:t=>[ri("yearly",U(t.chargesPct)??0)]},{id:"pots.funds-to-test",keys:["stress.taggedFunds","decision.taggedFunds","stress.subAsset","decision.subAsset"],set:t=>qe(t.taggedFunds).some(e=>U(e.value)>0),facts:t=>qe(t.taggedFunds).filter(e=>U(e.value)>0).flatMap((e,n)=>[Gt("name"+n,e.name||e.ticker||""),ve("value"+n,e.value)])},{id:"draw.cadence",keys:[],set:(t,e,n)=>{const i=n&&n.decisionTool&&(n.decisionTool.cadence||n.decisionTool.settings&&n.decisionTool.settings.cadence);return!!i&&i!=="monthly"},facts:(t,e,n)=>[ot("how",n&&n.decisionTool&&(n.decisionTool.cadence||n.decisionTool.settings&&n.decisionTool.settings.cadence)||"monthly")]},{id:"timing.stale-draft",keys:["stress.staleDraftDismissedFor"],set:t=>U(t.staleDraftDismissedFor)>0,facts:t=>[we("year",t.staleDraftDismissedFor)]},{id:"lock.lock",keys:["decision.locked","decision.lockedAt","decision.lockedBy"],set:(t,e)=>!!e.locked,facts:(t,e)=>[Ee("locked",!!e.locked),si("at",e.lockedAt||""),Gt("by",e.lockedBy||"")]},{id:"lock.unlock",keys:["decision.unlockedAt","decision.unlockCount"],set:(t,e)=>U(e.unlockCount)>0,facts:(t,e)=>[we("times",e.unlockCount??0),si("last",e.unlockedAt||"")]},{id:"month.seeded",keys:["decision.seededFrom"],set:(t,e)=>!!e.seededFrom,facts:(t,e)=>[Gt("from",e.seededFrom||"")]},{id:"mach.configured",keys:["stress.configured","decision.configured"],set:()=>!1,facts:(t,e)=>[Ee("stress",!!t.configured),Ee("decision",!!e.configured)]},{id:"mach.declining",keys:["stress.spendingProfile","decision.spendingProfile","stress.spendingMigratedFrom","decision.spendingMigratedFrom"],set:t=>t.spendingMigratedFrom==="declining",facts:t=>[Ee("folded",t.spendingMigratedFrom==="declining")]},{id:"mach.old-names",keys:["stress.pacwMin","stress.cgtMin","stress.csh2Target"],set:()=>!1,facts:t=>[Ee("present",t.pacwMin!==void 0||t.cgtMin!==void 0||t.csh2Target!==void 0)]},{id:"mach.risk-mode",keys:["stress.riskMode"],set:()=>!1,facts:t=>[Gt("mode",t.riskMode||"")]},{id:"mach.start-date",keys:["decision.startDate"],set:()=>!1,facts:(t,e)=>[si("date",e.startDate||"")]}]);function es(t,e,n,{all:i=!1}={}){const r=t||{},s=e||{},o=[];for(const l of Ap){let a=!1,u=[];try{a=!!l.set(r,s,n)}catch{a=!1}if(!(!a&&!i)){try{u=l.facts(r,s,n).filter(c=>c&&(c.kind==="text"||c.kind==="choice"?typeof c.v=="string":!0))}catch{u=[]}o.push({id:l.id,set:a,facts:u})}}return o}const Kn=["January","February","March","April","May","June","July","August","September","October","November","December"];function Eo(t){const e=/^(\d{4})-(\d{2})-(\d{2})$/.exec(String(t||""));if(!e)throw new Error("planRead needs today as YYYY-MM-DD");return new Date(+e[1],+e[2]-1,+e[3],12,0,0,0)}const Hn=t=>{const e=/^(\d{4})-(\d{2})/.exec(String(t||""));return e?{y:+e[1],m:+e[2]}:null},ce=t=>{const e=Hn(t);return e&&e.m>=1&&e.m<=12?Kn[e.m-1]+" "+e.y:""},Et=t=>{const e=Hn(t);return e&&e.m>=1&&e.m<=12?Kn[e.m-1]:""},Ge=t=>{const e=/^(\d{4})-(\d{2})-(\d{2})/.exec(String(t||""));return e&&+e[2]>=1&&+e[2]<=12?+e[3]+" "+Kn[+e[2]-1]+" "+e[1]:ce(t)},Sp=(t,e)=>(e.y-t.y)*12+(e.m-t.m),z=t=>t==null||t===""||!Number.isFinite(+t)?null:+t,k=t=>Math.round(z(t)||0),Wt=t=>t&&t.planDetails&&typeof t.planDetails.name=="string"&&t.planDetails.name||t&&typeof t.name=="string"&&t.name||"",Ii=t=>t&&t.household&&typeof t.household.partnerScenarioId=="string"&&t.household.partnerScenarioId||null,xn=t=>!!(t&&t.decisionTool&&t.decisionTool.settings&&t.decisionTool.settings.locked),Wn=t=>t&&t.decisionTool&&t.decisionTool.settings&&t.decisionTool.settings.lockedAt||t&&t.planDocument&&t.planDocument.lockedAt||null,Ro=(t,e)=>t&&t.planDocument&&t.planDocument.strategy&&t.planDocument.strategy.id||e&&e.strategyId||"pots-and-valves",Po=(t,e)=>Vh.includes(Ro(t,e));function Ln(t,e,n=null){const i=t&&t.key;return!i||i==="unknown"?null:i==="committed-saving"?{id:"committed-saving",slots:{month:ce(t.startMonth)||q(t.firstTaxYear)}}:i==="bridge"?{id:Po(e,n)?"bridge-ladder":"bridge-plan",slots:{month:ce(t.startMonth)||"April "+t.firstTaxYear}}:{id:i,slots:{}}}function Bn(t,e){try{return pp(t,{now:e})}catch{return{key:"unknown",locked:xn(t),retired:!1,timingMode:"legacy",firstTaxYear:null,startMonth:null,beforeStart:!1,hasRecords:!1,hasDocument:!!(t&&t.planDocument),monthsToStart:0,yearsToStart:0}}}function Vn(t,e){try{return qi(t,{now:e})}catch{return t&&t.stressTool&&t.stressTool.settings||{}}}function Ji(t,e){const n=e.id,i=Ii(e);return t.filter(r=>r.plan.id!==n&&(r.plan.id===i||Ii(r.plan)===n))}function wp(t,{today:e,source:n="account"}={}){const i=Eo(e),r=(t||[]).filter(c=>c&&c.plan&&typeof c.plan=="object"&&c.plan.id!=null),s=r.map(c=>{const d=c.plan,h=Bn(d,i),f=Vn(d,i),m=Ji(r,d);return{id:String(d.id),name:Wt(d),stageKey:h.key,line:Ln(h,d,f),locked:xn(d),lockedOn:xn(d)?Ge(Wn(d)):null,madeOn:d.fromAnswer&&d.fromAnswer.savedOn?Ge(d.fromAnswer.savedOn):null,shownAsSaved:!!(c.newer||c.failed),linked:m.length>0,lastModified:typeof d.lastModified=="string"?d.lastModified:""}}),o=(c,d)=>String(d.lastModified).localeCompare(String(c.lastModified));if(n==="window")return{groups:[{id:"window",rows:s.slice().sort((c,d)=>c.linked===d.linked?o(c,d):c.linked?-1:1)}]};const l=s.filter(c=>c.linked).sort(o),a=s.filter(c=>!c.linked).sort(o),u=[];return l.length&&u.push({id:"household",rows:l}),a.length&&u.push({id:"other",rows:a}),{groups:u}}const P=t=>({key:t,kind:"money"}),ke=t=>({key:t,kind:"count"}),Ft=t=>({key:t,kind:"age"}),Ep=t=>"£"+String(Math.abs(Math.round(Number(t)||0))).replace(/\B(?=(\d{3})+(?!\d))/g,","),Rp=(t,e)=>typeof t=="string"?t:"fixed"in t?String(t.fixed):t.kind==="money"?Ep(e[t.key]):String(Math.round(Number(e[t.key])||0)),G=(t,e,n)=>({id:t,parts:e,text:e.map(i=>Rp(i,n)).join("")});function ee(t,e,n){const i=e?Hn(e):null,r={y:n.getFullYear(),m:n.getMonth()+1},s=!!i&&Sp(i,r)>3;return{kind:t,at:e?String(e).length>7?Ge(e):ce(e):null,stale:s}}const L=(t,e,n,i,r={})=>({id:t,slots:r,sentence:G(t,e,n),source:i}),W=(t,e,n={})=>({id:t,place:e,slots:n}),Pp=(t,e,n={})=>({id:t,href:e,slots:n});function ko(t){const{plan:e,now:n,ty:i,tyKey:r,mon:s}=t,o=$n(e),l=o.length?o[o.length-1]:null,a=!!l&&String(l.date).slice(0,7)>=s,u={},c=[],d=!!(e.decisionTool&&e.decisionTool.taxYears&&e.decisionTool.taxYears[r]&&e.decisionTool.taxYears[r].yearSetupComplete);c.push(L(d?"month.yearSetUp":"month.yearNotSetUp",[],u,ee("record",null,n),{year:q(i)})),o.slice(-3).reverse().forEach((m,p)=>{u["net"+p]=k(m.monthlyNet),u["tax"+p]=k(m.monthlyTax),c.push(L("month.record",[{fixed:ce(m.date)},": ",P("net"+p)," after tax, ",P("tax"+p)," tax"],u,ee("record",m.date,n),{month:ce(m.date)}))});let h;a?(u.net=k(l.monthlyNet),h=G("month.recorded",[ce(s)+" recorded: ",P("net")," after tax"],u)):h=G("month.notYet",[ce(s)+" is not recorded yet"],u);const f=[W("record","month",{month:Et(s)})];return d||f.push(W("setUpYear","taxyear",{year:q(i)})),{done:a,result:h,figures:u,lines:c,buttons:f,notes:[],recorded:a,setUp:d}}function kp(t){const{plan:e,now:n,ss:i}=t,r={},s=[],o=[];if(!e.planDocument)return{done:!1,result:G("where.noDocument",["Not locked: nothing to read against yet"],r),figures:r,lines:s,buttons:[],notes:o};let l=null,a={ladderInDocument:!1};try{l=mp(e,{now:n}),a=So(e,{now:n})}catch{l=null}const u=Wn(e);if(!l)return{done:!1,result:G("where.noReading",["The plan document could not be read"],r),figures:r,lines:s,buttons:[W("seeDocument","document")],notes:o};let c;if(l.saving){const d=l.saving;d.pathMissing||d.actual==null||d.expected==null?c=G("where.saverNone",["No pot recorded against the plan’s path yet"],r):(r.actual=k(d.actual),r.expected=k(d.expected),c=G("where.saver",[P("actual")," on "+ce(d.at),"; the plan’s middle line for then is ",P("expected")],r),s.push(L("where.saverPot",[P("actual")],r,ee(d.actualSource==="holdings"?"hold":"record",d.recordedAt||d.at,n))),s.push(L("where.saverLine",[P("expected")],r,ee("locked",u,n))))}else{const d=l.incomeThisYear||{recorded:0,drawn:0,planned:null};r.months=d.recorded,r.drawn=k(d.drawn);const h=[ke("months")," month"+(d.recorded===1?"":"s")+" recorded in "+l.taxYear+": ",P("drawn")," taken before tax"];d.planned!=null&&(r.planned=k(d.planned),h.push("; the plan says ",P("planned")," for the year")),c=G("where.retired",h,r),s.push(L("where.taken",[P("drawn")],r,ee("record",null,n),{year:l.taxYear})),d.planned!=null&&s.push(L("where.planned",[P("planned")],r,ee("locked",u,n),{year:l.taxYear})),l.step&&l.step.amount!=null&&(r.stepNow=k(l.step.amount),s.push(L("where.step",[P("stepNow")," a year before tax"],r,ee("locked",u,n),{n:String(l.step.index),of:String(l.step.of)}))),l.pot&&l.pot.actual!=null&&(r.pot=k(l.pot.actual),s.push(L("where.pot",[P("pot")],r,ee(l.pot.source==="holdings"?"hold":"record",l.pot.asOf,n))),l.pot.p50!=null&&(r.potMid=k(l.pot.p50),s.push(L("where.potMid",[P("potMid")],r,ee("locked",u,n)))))}return l.contract&&!a.ladderInDocument&&o.push("where.ladderNotInDocument"),l.ladder&&typeof l.ladder.monthly=="number"&&l.ladder.monthly>0&&(r.ladderMonthly=k(l.ladder.monthly),s.push(L("where.ladderMonthly",[P("ladderMonthly")," a month before tax"],r,ee("locked",u,n)))),{done:!0,result:c,figures:r,lines:s,buttons:[W("seeDocument","document")],notes:o}}function Dp(t,e,n){if(n&&t.planDocument&&Array.isArray(t.planDocument.steps)&&t.planDocument.steps.length)return t.planDocument.steps.map(s=>({fromAge:+s.fromAge,amount:k(s.amount),taxYear:s.taxYear||null,decline:+s.decline||0,glideToNext:!!s.glideToNext}));const i=z(e.shapeAgeNow)||null;if(e.incomeShape==="phases"&&Array.isArray(e.incomeSteps)&&e.incomeSteps.length)return e.incomeSteps.filter(s=>s&&z(s.amount)!=null).map(s=>({fromAge:+s.fromAge,amount:k(s.amount),taxYear:null,decline:+s.decline||0,glideToNext:!!s.glideToNext}));const r=Array.isArray(e.targetSchedule)&&e.targetSchedule.length?k(e.targetSchedule[0]):k(e.baseSalary);return i?[{fromAge:i,amount:r,taxYear:null,decline:0,glideToNext:!1}]:[{fromAge:null,amount:r,taxYear:null,decline:0,glideToNext:!1}]}function Op(t){const{plan:e,ss:n,ds:i,now:r,stage:s,locked:o,readonly:l}=t,a=o?e.planDocument:null,u=Wn(e),c={},d=[],h=[],f=Dp(e,n,o),m=f[0]||null,p=o?ee("locked",u,r):ee("saved",null,r),y=a&&a.timing?a.timing:null,O=y&&y.startMonth||s.startMonth||null,E=y&&y.firstTaxYear||s.firstTaxYear||null,g=Po(e,n);let v;m&&(c.yearly=m.amount),o&&m?v=s.timingMode==="future"?G("plan.lockedSaver",[P("yearly")," a year before tax from "+(ce(O)||q(E))+" (tax year "+q(E)+")"],c):G(g?"plan.lockedLadder":"plan.lockedPlan",[P("yearly")," a year before tax; your "+(g?"ladder":"plan")+" pays from "+(ce(O)||q(E))+" (tax year "+q(E)+")"],c):s.timingMode==="future"&&z(n.retireAge)?(c.retireAge=+n.retireAge,v=G("plan.saver",["Stopping work at ",Ft("retireAge"),", in "+(ce(O)||q(E))],c)):m&&s.key!=="unknown"?v=G("plan.retired",["Retired. ",P("yearly")," a year before tax"],c):m?v=G("plan.noAge",[P("yearly")," a year before tax"],c):v=G("plan.nothing",["No figures yet"],c);const R=[],b=o&&y&&z(y.currentAge)!=null?y.currentAge:z(n.currentAge),I=o&&y?y.currentAgeAsOf:n.currentAgeAsOf;b!=null&&(c.ageToday=b,R.push(L("about.age",[Ft("ageToday")],c,o?p:ee("saved",I||null,r),{asOf:I?Ge(I):""})));const S=o&&y?y.mode==="retired":n.retired===!0,T=z(o&&y?y.retireAge:n.retireAge);s.timingMode==="future"&&T!=null?(c.stopAge=T,R.push(L("about.stopAt",[Ft("stopAge")],c,p,{month:ce(O)}))):(S||s.timingMode==="retired")&&R.push(L("about.retired",[],c,p)),E&&R.push(L("about.firstYear",[],c,p,{year:q(E)}));const C=o&&a?a.timeline&&a.timeline.length||a.assumptions&&a.assumptions.duration||null:z(n.duration);if(C){c.years=C;const x=y&&z(y.shapeAgeNow)!=null?y.shapeAgeNow:z(n.shapeAgeNow);x!=null&&(c.ageEnd=x+C),R.push(L("about.runs",[ke("years")," years"+(x!=null?", to age ":"")].concat(x!=null?[Ft("ageEnd")]:[]),c,p))}const D=[];f.forEach((x,w)=>{c["step"+w]=x.amount;const ie=[];x.fromAge!=null&&(c["stepAge"+w]=x.fromAge,ie.push("From age ",Ft("stepAge"+w),": ")),ie.push(P("step"+w)," a year before tax"),x.taxYear&&ie.push(" (tax year "+x.taxYear+")"),x.decline>0?ie.push(", falling "+String(x.decline)+"% a year"):x.glideToNext&&w<f.length-1&&ie.push(", sloping to the next step"),D.push(L("pays.step",ie,c,p))}),o?h.push({id:"prices",slots:{month:ce(u)||Ge(u)}}):h.push({id:"pricesToday",slots:{}});const V=[],Q=o&&a&&a.pots?k(a.pots.sipp):z(n.strategyParams&&n.strategyParams.sippTotal)>0?k(n.strategyParams.sippTotal):k(n.equityMin)+k(n.bondMin)+k(n.cashTarget)+k(n.diversifierStart),_=o&&a&&a.pots?k(a.pots.isa):k(n.isaBalance),A=o&&a&&a.pots?k(a.pots.gia):k(n.taxableStart);if(c.sipp=Q,c.isa=_,c.gia=A,V.push(L("pots.pension",[P("sipp")],c,p)),!o)c.shares=k(n.equityMin),c.bonds=k(n.bondMin),c.cash=k(n.cashTarget),V.push(L("pots.split",[P("shares")," shares, ",P("bonds")," bonds, ",P("cash")," cash"],c,p));else if(a&&a.pots&&a.pots.allocation){const x=a.pots.allocation;c.shares=k(x.equityMin),c.bonds=k(x.bondMin),c.cash=k(x.cashTarget),V.push(L("pots.split",[P("shares")," shares, ",P("bonds")," bonds, ",P("cash")," cash"],c,p))}V.push(L("pots.isa",[P("isa")],c,p)),A>0&&V.push(L("pots.gia",[P("gia")],c,p));const N=o&&a&&a.pots?a.pots.potAtRetirement:n.potAtRetirement;N&&(z(N.sipp)>0||z(N.isa)>0)&&(c.parSipp=k(N.sipp),c.parIsa=k(N.isa),V.push(L("pots.atStop",[P("parSipp")," pension, ",P("parIsa")," ISA"],c,p)));const K=o&&a&&a.assumptions?z(a.assumptions.spWeeklyAmount):z(n.spWeeklyAmount),ne=o&&a&&a.assumptions?a.assumptions.spStartDate:n.spStartDate;if(K>0)c.spWeekly=k(K),V.push(L("pots.statePension",[P("spWeekly")," a week"],c,p,{from:ne?String(ne):""}));else if(z(n.statePension)>0){c.spYearly=k(n.statePension);const x=E&&z(n.statePensionYear)!=null?q(E+k(n.statePensionYear)):"";V.push(L("pots.statePensionOld",[P("spYearly")," a year"],c,p,{year:x}))}else V.push(L("pots.noStatePension",[],c,p));if(z(n.dbAmount)>0){c.db=k(n.dbAmount);const x=z(n.dbStartAge)!=null?"age "+String(k(n.dbStartAge)):z(n.dbStartYear)!=null&&E?"tax year "+q(E+k(n.dbStartYear)):"";V.push(L("pots.finalSalary",[P("db")," a year"],c,p,{from:x}))}z(n.other)>0&&(c.other=k(n.other),V.push(L("pots.other",[P("other")," a year"],c,p)));const X=[],Se=Ro(e,n);X.push(L("way.strategy",[],c,p,{strategy:Se}));const H=o&&a&&a.strategy&&a.strategy.params||n.strategyParams||{};for(const[x,w]of Object.entries(H))z(w)!=null&&(c["dial."+x]=z(w),X.push(L("way.dial",[x==="cashYears"||x==="years"||/Years$|Age$/.test(x)?ke("dial."+x):P("dial."+x)],c,p,{dial:x})));!o&&n.allocMode&&X.push(L("way.allocMode",[],c,p,{mode:String(n.allocMode)}));const Z=es(n,i,e),te=es(n,i,e,{all:!0}),We=[{id:"about",lines:R,place:"about"},{id:"pays",lines:D,place:"spend"},{id:"pots",lines:V,place:"pots"},{id:"way",lines:X,place:"way"}],ae=[];o?ae.push(W("openDocument","document"),W("testLocked","test")):l||ae.push(W("testPlan","test"));const Bt=Array.isArray(e.journey)?e.journey.filter(x=>x&&x.stage).map(x=>({stage:x.stage,on:Ge(x.at),arrival:/arrival/i.test(String(x.note||""))})):[],zn=Array.isArray(e.planDocumentArchive)?e.planDocumentArchive.length:0;return{done:s.key!=="unknown",result:v,figures:c,lines:d,buttons:ae,notes:h,sections:We,options:Z,allOptions:te,journey:Bt,pastVersions:zn,lockedOn:o?Ge(u):null}}function Do(t){const{plan:e,now:n,mon:i}=t,r={},s=[],o=Array.isArray(e.accumulationTool&&e.accumulationTool.history)?e.accumulationTool.history:[],l=Io({accHistory:o,today:n}),a=l.source==="record"&&String(l.at)>=i;let u;if(l.source==="record"){r.pension=k(l.pension),l.isa!=null&&(r.isa=k(l.isa));const c=[P("pension")," pension"].concat(l.isa!=null?[", ",P("isa")," ISA"]:[]);s.push(L("pot.latest",c,r,ee("record",l.recordedAt||l.at,n),{month:ce(l.at)})),u=a?G("pot.recorded",[P("pension")," recorded for "+ce(i)],r):G("pot.notYet",[Et(i)+"’s pot is not recorded yet"],r)}else u=G("pot.notYet",[Et(i)+"’s pot is not recorded yet"],r);return{done:a,result:u,figures:r,lines:s,buttons:[W("recordPot","potRecord")],notes:[],recorded:a}}function Mp(t){const{plan:e,now:n}=t,i=e.accumulationTool&&e.accumulationTool.settings||{},r={},s=[],o=k(i.netMonthly),l=k(i.employerMonthly),a=k(i.isaMonthly),u=z(i.escalationPct),c=o>0||l>0||a>0;let d;if(c){r.you=o,r.employer=l;const h=[P("you")," a month from you, ",P("employer")," from your employer"];a>0&&(r.isaMonthly=a,h.push(", ",P("isaMonthly")," into ISAs and savings")),d=G("saving.payIn",h,r),s.push(L("saving.you",[P("you")," a month"],r,ee("saved",null,n))),s.push(L("saving.employer",[P("employer")," a month"],r,ee("saved",null,n))),a>0&&s.push(L("saving.isa",[P("isaMonthly")," a month"],r,ee("saved",null,n))),u>0&&(r.rise=u,s.push(L("saving.rise",[ke("rise"),"% a year"],r,ee("saved",null,n))))}else d=G("saving.none",["Nothing paid in"],r);return{done:c,result:d,figures:r,lines:s,buttons:[W("changeSaving","saving"),W("onCourse","onCourse")],notes:["saving.notFrozen"]}}function Np(t){const{plan:e,now:n}=t,i=e.budgetTool&&e.budgetTool.settings||{},r=i.derived||{},s={},o=[],l=k(r.allInComfortableMonthly||r.comfortableMonthlyNet),a=k(r.essentialMonthlyNet),u=Array.isArray(i.lines)?i.lines.filter(h=>h&&z(h.amount)>0).length:0,c=l>0&&u>0;let d;return c?(s.total=l,s.essentials=a,d=G("budget.total",[P("total")," a month after tax, ",P("essentials")," of it essentials. A guide only"],s),o.push(L("budget.totalLine",[P("total")," a month after tax"],s,ee("budget",null,n))),o.push(L("budget.essentialsLine",[P("essentials")," a month after tax"],s,ee("budget",null,n)))):d=G("budget.none",["Not worked out. A guide only"],s),{done:c,result:d,figures:s,lines:o,buttons:[W("changeBudget","budget")],notes:["budget.guide"]}}function Cp(t){const e=["lock.what"];return wo.includes(t.stage.key)&&e.push("lock.saver"),{done:!1,result:G("lock.notLocked",["Not locked"],{}),figures:{},lines:[],buttons:[W("lockIt","lock")],notes:e}}function xp(t){const{plan:e,now:n}=t,i=xt(e.holdings),r=Wd(i),s={},o=[],l=r.count>0;let a;if(l){s.pension=k(r.byWrapper.SIPP),s.isa=k(r.byWrapper.ISA);const u=ee("hold",i.updatedAt||null,n),c=["Pension ",P("pension"),", ISA ",P("isa")];r.byWrapper.GIA>0&&(s.gia=k(r.byWrapper.GIA),c.push(", other account ",P("gia"))),r.byWrapper.CASH>0&&(s.cash=k(r.byWrapper.CASH),c.push(", cash ",P("cash"))),c.push(i.updatedAt?". Updated "+Ge(i.updatedAt):""),a=G("hold.summary",c,s),s.lines=r.count,s.total=k(r.total),o.push(L("hold.total",[P("total")," across ",ke("lines")," line"+(r.count===1?"":"s")],s,u))}else a=G("hold.none",["Not recorded yet"],s);return{done:l,result:a,figures:s,lines:o,buttons:[W("changeHold","hold")],notes:[]}}function Lp(t){const{plan:e,now:n}=t,i={},r=[];let s=null;try{s=gp(e,{now:n})}catch{s=null}let o,l=!1;if(!s||!s.target||s.target.kind==="none")o=G("move.notSet",["Set when the plan is locked"],i);else if(s.diff.complete)o=G("move.done",["Done"],i),l=!0;else if(s.target.kind==="ladder"){const a=s.target.lines.length,u=s.diff.hold.filter(c=>Array.isArray(c.taxYears)).length;i.bought=u,i.rungs=a,o=G("move.gilts",[ke("bought")," of ",ke("rungs")," gilts bought"],i)}else i.movesDone=s.prog.doneCount,i.moves=s.prog.total,o=G("move.moves",[ke("movesDone")," of ",ke("moves")," moves done"],i);return s&&s.diff&&typeof s.diff.progressPct=="number"&&(i.heldPct=s.diff.progressPct,r.push(L("move.held",[ke("heldPct"),"% of the plan’s mix held"],i,ee("hold",xt(e.holdings).updatedAt||null,n)))),{done:l,result:o,figures:i,lines:r,buttons:[W("openMove","move")],notes:["move.optional"]}}function Bp(t){const{plan:e,entries:n,now:i}=t,r=Ji(n,e),s={},o=[],l=[],a=Ii(e),u=!!a&&!n.some(d=>d.plan.id===a);let c;if(r.length){const d=r[0],h=Bn(d.plan,i),f=Ln(h,d.plan,Vn(d.plan,i));c=G("household.with",["With ‘"+Wt(d.plan)+"’"],s);for(const p of r){const y=Bn(p.plan,i);o.push({id:"household.partner",slots:{name:Wt(p.plan)},sentence:G("household.partner",[],s),source:ee("saved",null,i),theirLine:Ln(y,p.plan,Vn(p.plan,i)),theirId:String(p.plan.id)}),l.push(Pp("openPartner","#/plan/"+p.plan.id,{name:Wt(p.plan)}))}const m=a&&r.some(p=>p.plan.id===a)?String(e.id):String(r[0].plan.id);return l.push({...W("checkTogether","household"),planId:m}),{done:!0,result:c,figures:s,lines:o,buttons:l,notes:[],theirLine:f}}return u?{done:!1,result:G("household.notInAccount",["Your partner’s plan is not in this account"],s),figures:s,lines:o,buttons:[W("linkOne","household")],notes:[]}:{done:!1,result:G("household.none",["No partner’s plan is linked"],s),figures:s,lines:o,buttons:[W("linkOne","household")],notes:[]}}const Vp={month:ko,where:kp,plan:Op,pot:Do,saving:Mp,budget:Np,lock:Cp,hold:xp,move:Lp,household:Bp};function Fp(t,e){const{stage:n,readonly:i,plan:r,ss:s,locked:o,mon:l,ty:a,tyKey:u,now:c}=t,d=n.key,h=d==="bridge"||d==="running",f=e.month,m=e.pot,p=$n(r),y=p.length?String(p[p.length-1].date).slice(0,7):null,O=Array.isArray(r.journey)&&r.journey.some(Q=>Q&&/arrival/i.test(String(Q.note||""))),E=n.startMonth||null,g=n.hasRecords;let v=null;try{v=["saving","approaching","draft-retired","unknown"].includes(d)?Ah(s,{locked:o,hasRecords:g,now:c}):null}catch{v=null}const R=f?f.setUp:!!(r.decisionTool&&r.decisionTool.taxYears&&r.decisionTool.taxYears[u]&&r.decisionTool.taxYears[u].yearSetupComplete),b=f?f.recorded:!!y&&y>=l,I=m?m.recorded:!1,S={"P.readonly":()=>i,"P.noAge":()=>d==="unknown","P.arrive":()=>d==="running"&&n.timingMode==="future"&&!!E&&!(y&&y>=E)&&!O,"P.taxyear":()=>h&&!R,"P.month":()=>h&&!b,"P.idle":()=>h,"P.pot":()=>d==="committed-saving"&&!I,"P.working":()=>d==="committed-saving","P.stale":()=>!!v,"P.draft":()=>d==="draft-retired","P.approaching":()=>d==="approaching","P.saving":()=>d==="saving"},T=vp.find(Q=>S[Q]()),C=(()=>{const Q=Hn(l),_=Q.m===12?{y:Q.y+1,m:1}:{y:Q.y,m:Q.m+1};return Kn[_.m-1]})(),D={month:ce(l),monthName:Et(l),nextMonth:C,year:q(a),stop:ce(E)||"",savedYear:v?v.savedLabel:""},V={"P.readonly":null,"P.noAge":W("addAge","about"),"P.arrive":W("record","month",{month:Et(l)}),"P.taxyear":W("setUpYear","taxyear",{year:q(a)}),"P.month":W("record","month",{month:Et(l)}),"P.idle":null,"P.pot":W("recordPot","potRecord"),"P.working":W("onCourse","onCourse"),"P.stale":W("updateIt","about"),"P.draft":W("testPlan","test"),"P.approaching":W("testPlan","test"),"P.saving":W("onCourse","onCourse")};return{id:T||"P.saving",slots:D,button:T?V[T]:null}}function Gp(t,e,n,{today:i,source:r="account"}={}){const s=Eo(i),o=(t||[]).filter(T=>T&&T.plan&&typeof T.plan=="object"&&T.plan.id!=null),l=o.find(T=>String(T.plan.id)===String(e))||null;if(!l)return{found:!1,id:String(e||"")};const a=l.plan,u=!!(l.newer||l.failed),c=Bn(a,s),d=Vn(a,s),h=a.decisionTool&&a.decisionTool.settings||{},f=xn(a),m=Ji(o,a),p=Te(s),y={plan:a,entries:o,now:s,ss:d,ds:h,stage:c,locked:f,readonly:u,mon:fp(s),ty:p,tyKey:Ki(p),source:r},O=Tp(c.key,{locked:f,linked:m.length>0,manyPlans:o.length>1}),E=O.map(T=>T.id),g=n&&_p.includes(n)?n:null,v=g||E[0],R=g&&!E.includes(g)?[...O,{id:g,optional:!0,listed:!1}]:O,b={};for(const T of R)try{b[T.id]=Vp[T.id](y)}catch(C){b[T.id]={done:!1,result:G(T.id+".failed",["Could not be read"],{}),figures:{},lines:[],buttons:[],notes:[],error:C&&C.message}}!b.month&&["bridge","running"].includes(c.key)&&(b.month=ko(y)),!b.pot&&c.key==="committed-saving"&&(b.pot=Do(y));const I=R.map(T=>{const C=b[T.id],D=u?C.buttons.filter(V=>V.href):C.buttons;return{id:T.id,optional:!!T.optional,listed:T.listed!==!1,state:T.id===v?"current":C.done?"done":"open",...C,buttons:D}}),S=Fp(y,b);return{found:!0,id:String(a.id),name:Wt(a),stageKey:c.key,retired:Zr.includes(c.key),saver:wo.includes(c.key),line:Ln(c,a,d),locked:f,lockedOn:f?Ge(Wn(a)):null,readonly:u,source:r,steps:I,current:v,next:u?{...S,button:null}:S,askLinks:Zr.includes(c.key)?["c"]:["a","b"]}}const Up="pt_guest_scenarios",Yp="pt-preview",jp=60*1e3;function ts(t,e){const n=[];for(const i of t){if(!i||typeof i!="object"||i.id==null)continue;let r;try{r=oh(i,{now:e})}catch(s){r={scenario:i,newer:!1,error:s}}n.push({plan:r.scenario&&typeof r.scenario=="object"?r.scenario:i,newer:!!r.newer,failed:!!r.error})}return n}function $p(t){if(!t)return[];let e=null;try{e=t.getItem(Up)}catch{return[]}if(!e)return[];try{const n=JSON.parse(e);return Array.isArray(n)?n:[]}catch{return[]}}const ns=t=>String(t.getHours()).padStart(2,"0")+":"+String(t.getMinutes()).padStart(2,"0");function Kp(t){const e=t.plans;if(!e||e.status!=="read")return null;const n=t.env.today,i=wp(e.list,{today:n,source:e.source}).groups,r=t.route;let s=null;return r&&r.screen==="plan"&&r.planId&&(s={...Gp(e.list,r.planId,r.step,{today:n,source:e.source}),forId:r.planId,forStep:r.step||null}),{today:n,rows:i,page:s}}function Xp(t,{win:e,local:n=null,session:i=null,now:r=()=>new Date,fb:s=null}){const o=s||{initializeApp:ps,getAuth:bu,setPersistence:ac,browserLocalPersistence:Us,onAuthStateChanged:uc,signOut:dc,getFirestore:Id,collection:Sd,getDocs:Nd,isFirebaseConfigured:Cd},l=[];let a,u=!1;const c=S=>{u||t.dispatch(S)};c({type:he.SESSION_SET,session:{kind:"checking",email:null}});function d(){const S=ts($p(i),r());c({type:he.PLANS_SET,list:S,source:"window",readAt:ns(r()),usedUp:hh(dh(n))})}let h=null,f=null;if(!o.isFirebaseConfigured())a=null,c({type:he.SESSION_SET,session:{kind:"nobody",email:null}}),d();else{const S=o.initializeApp(uo,Yp);h=o.getAuth(S),Promise.resolve(o.setPersistence(h,o.browserLocalPersistence)).catch(()=>{}),f=o.getFirestore(S)}async function m(){if(!a||!f)return;const S=a.uid;try{const T=await o.getDocs(o.collection(f,"users",S,"scenarios")),C=[];if(T.forEach(D=>{C.push({id:D.id,...D.data()})}),u||!a||a.uid!==S)return;c({type:he.PLANS_SET,list:ts(C,r()),source:"account",readAt:ns(r())})}catch{u||c({type:he.PLANS_FAILED})}}function p(){a!==void 0&&(a===null?d():a.emailVerified&&m())}function y(){try{n&&n.removeItem(Go)}catch{}try{i&&i.removeItem(Uo)}catch{}}async function O(){y(),c({type:he.PLANS_CLEAR});try{h&&await o.signOut(h)}catch{}!u&&a&&(a=null,c({type:he.SESSION_SET,session:{kind:"nobody",email:null}}),d())}if(h){const S=o.onAuthStateChanged(h,T=>{if(u)return;const C=a;a=T||null,T?T.emailVerified?(c({type:he.SESSION_SET,session:{kind:"in",email:T.email||null}}),m()):c({type:he.SESSION_SET,session:{kind:"unverified",email:T.email||null}}):(c({type:he.SESSION_SET,session:{kind:"nobody",email:null}}),C&&y(),d())});l.push(()=>{try{S()}catch{}})}let E=null;const g=S=>{const T=S.plans&&S.plans.status==="read"?[S.plans.list,S.route,S.env.today]:null;if(!T){E=null;return}if(E&&T.every((D,V)=>D===E[V]))return;E=T;let C=null;try{C=Kp(S)}catch{C={today:S.env.today,rows:[],page:null}}C&&c({type:he.PLANS_VIEW,view:C})};g(t.getState()),l.push(t.subscribe((S,T)=>{T.type===he.PLANS_READING&&p(),T.type===he.SESSION_OUT&&S.session.signingOut&&O(),g(S)}));const v=()=>c({type:he.PLANS_CLEAR}),R=S=>{S&&S.persisted&&(a!==void 0&&c({type:he.SESSION_SET,session:a?{kind:a.emailVerified?"in":"unverified",email:a.email||null}:{kind:"nobody",email:null}}),p())},b=()=>{e.document&&e.document.visibilityState==="visible"&&t.getState().plans===null&&p()};e.addEventListener("pagehide",v),e.addEventListener("pageshow",R),e.document&&e.document.addEventListener("visibilitychange",b),l.push(()=>{e.removeEventListener("pagehide",v),e.removeEventListener("pageshow",R),e.document&&e.document.removeEventListener("visibilitychange",b)});const I=e.setInterval(()=>{if(!a||!n)return;const S=Vo(n);S&&r().getTime()-S>Fo&&O()},jp);return l.push(()=>e.clearInterval(I)),()=>{u=!0,l.splice(0).forEach(S=>S())}}export{Yp as APP_NAME,Up as GUEST_PLANS_KEY,Xp as startPlanSource,ts as upgradedList,Kp as viewFor,$p as windowPlans};
