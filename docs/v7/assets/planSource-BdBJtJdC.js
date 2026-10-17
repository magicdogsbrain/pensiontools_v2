import{f as Ba,aa as qs,e as Fa,ab as Js,b as Rt,S as Ve,D as ue,T as ge,ac as Ua,ad as Ga,ae as Ya,af as ja,ag as $a,ah as Qs,ai as Dr,aj as Ka,ak as J,al as Ha,am as Wa,an as za,ao as qa,ap as Ja}from"./index-BARZ7mBz.js";import{B as At,F as Qa,l as Xa,S as qt,j as Za,G as el}from"./SpendingModel-B2FKV7lF.js";var Ci={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xs=function(t){const e=[];let n=0;for(let r=0;r<t.length;r++){let i=t.charCodeAt(r);i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=i&63|128):(i&64512)===55296&&r+1<t.length&&(t.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(t.charCodeAt(++r)&1023),e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=i&63|128):(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=i&63|128)}return e},tl=function(t){const e=[];let n=0,r=0;for(;n<t.length;){const i=t[n++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){const s=t[n++];e[r++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){const s=t[n++],o=t[n++],a=t[n++],l=((i&7)<<18|(s&63)<<12|(o&63)<<6|a&63)-65536;e[r++]=String.fromCharCode(55296+(l>>10)),e[r++]=String.fromCharCode(56320+(l&1023))}else{const s=t[n++],o=t[n++];e[r++]=String.fromCharCode((i&15)<<12|(s&63)<<6|o&63)}}return e.join("")},Zs={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<t.length;i+=3){const s=t[i],o=i+1<t.length,a=o?t[i+1]:0,l=i+2<t.length,c=l?t[i+2]:0,u=s>>2,d=(s&3)<<4|a>>4;let h=(a&15)<<2|c>>6,m=c&63;l||(m=64,o||(h=64)),r.push(n[u],n[d],n[h],n[m])}return r.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(Xs(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):tl(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<t.length;){const s=n[t.charAt(i++)],a=i<t.length?n[t.charAt(i)]:0;++i;const c=i<t.length?n[t.charAt(i)]:64;++i;const d=i<t.length?n[t.charAt(i)]:64;if(++i,s==null||a==null||c==null||d==null)throw new nl;const h=s<<2|a>>4;if(r.push(h),c!==64){const m=a<<4&240|c>>2;if(r.push(m),d!==64){const g=c<<6&192|d;r.push(g)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class nl extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const rl=function(t){const e=Xs(t);return Zs.encodeByteArray(e,!0)},On=function(t){return rl(t).replace(/\./g,"")},eo=function(t){try{return Zs.decodeString(t,!0)}catch{}return null};/**
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
 */function il(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const sl=()=>il().__FIREBASE_DEFAULTS__,ol=()=>{if(typeof process>"u"||typeof Ci>"u")return;const t=Ci.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},al=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&eo(t[1]);return e&&JSON.parse(e)},ti=()=>{try{return sl()||ol()||al()}catch{return}},to=t=>{var e,n;return(n=(e=ti())===null||e===void 0?void 0:e.emulatorHosts)===null||n===void 0?void 0:n[t]},ll=t=>{const e=to(t);if(!e)return;const n=e.lastIndexOf(":");if(n<=0||n+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(n+1),10);return e[0]==="["?[e.substring(1,n-1),r]:[e.substring(0,n),r]},no=()=>{var t;return(t=ti())===null||t===void 0?void 0:t.config},ro=t=>{var e;return(e=ti())===null||e===void 0?void 0:e[`_${t}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cl{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,r))}}}/**
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
 */function ul(t,e){if(t.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n={alg:"none",type:"JWT"},r=e||"demo-project",i=t.iat||0,s=t.sub||t.user_id;if(!s)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:i,exp:i+3600,auth_time:i,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}}},t);return[On(JSON.stringify(n)),On(JSON.stringify(o)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Te(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function dl(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Te())}function hl(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function fl(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function pl(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function ml(){const t=Te();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function gl(){try{return typeof indexedDB=="object"}catch{return!1}}function yl(){return new Promise((t,e)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),t(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var s;e(((s=i.error)===null||s===void 0?void 0:s.message)||"")}}catch(n){e(n)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _l="FirebaseError";class qe extends Error{constructor(e,n,r){super(n),this.code=e,this.customData=r,this.name=_l,Object.setPrototypeOf(this,qe.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,fn.prototype.create)}}class fn{constructor(e,n,r){this.service=e,this.serviceName=n,this.errors=r}create(e,...n){const r=n[0]||{},i=`${this.service}/${e}`,s=this.errors[e],o=s?Tl(s,r):"Error",a=`${this.serviceName}: ${o} (${i}).`;return new qe(i,a,r)}}function Tl(t,e){return t.replace(vl,(n,r)=>{const i=e[r];return i!=null?String(i):`<${r}?>`})}const vl=/\{\$([^}]+)}/g;function bl(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function Mn(t,e){if(t===e)return!0;const n=Object.keys(t),r=Object.keys(e);for(const i of n){if(!r.includes(i))return!1;const s=t[i],o=e[i];if(xi(s)&&xi(o)){if(!Mn(s,o))return!1}else if(s!==o)return!1}for(const i of r)if(!n.includes(i))return!1;return!0}function xi(t){return t!==null&&typeof t=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pn(t){const e=[];for(const[n,r]of Object.entries(t))Array.isArray(r)?r.forEach(i=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function Al(t,e){const n=new Il(t,e);return n.subscribe.bind(n)}class Il{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,r){let i;if(e===void 0&&n===void 0&&r===void 0)throw new Error("Missing Observer.");Sl(e,["next","error","complete"])?i=e:i={next:e,error:n,complete:r},i.next===void 0&&(i.next=yr),i.error===void 0&&(i.error=yr),i.complete===void 0&&(i.complete=yr);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch{}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Sl(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function yr(){}/**
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
 */function pe(t){return t&&t._delegate?t._delegate:t}class gt{constructor(e,n,r){this.name=e,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const ht="[DEFAULT]";/**
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
 */class wl{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const r=new cl;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:n});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){var n;const r=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),i=(n=e==null?void 0:e.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(s){if(i)return null;throw s}else{if(i)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Pl(e))try{this.getOrInitializeService({instanceIdentifier:ht})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(n);try{const s=this.getOrInitializeService({instanceIdentifier:i});r.resolve(s)}catch{}}}}clearInstance(e=ht){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=ht){return this.instances.has(e)}getOptions(e=ht){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[s,o]of this.instancesDeferred.entries()){const a=this.normalizeInstanceIdentifier(s);r===a&&o.resolve(i)}return i}onInit(e,n){var r;const i=this.normalizeInstanceIdentifier(n),s=(r=this.onInitCallbacks.get(i))!==null&&r!==void 0?r:new Set;s.add(e),this.onInitCallbacks.set(i,s);const o=this.instances.get(i);return o&&e(o,i),()=>{s.delete(e)}}invokeOnInitCallbacks(e,n){const r=this.onInitCallbacks.get(n);if(r)for(const i of r)try{i(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:El(e),options:n}),this.instances.set(e,r),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=ht){return this.component?this.component.multipleInstances?e:ht:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function El(t){return t===ht?void 0:t}function Pl(t){return t.instantiationMode==="EAGER"}/**
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
 */class Rl{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new wl(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var K;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(K||(K={}));const kl={debug:K.DEBUG,verbose:K.VERBOSE,info:K.INFO,warn:K.WARN,error:K.ERROR,silent:K.SILENT},Dl=K.INFO,Ol={[K.DEBUG]:"log",[K.VERBOSE]:"log",[K.INFO]:"info",[K.WARN]:"warn",[K.ERROR]:"error"},Ml=(t,e,...n)=>{if(e<t.logLevel)return;const r=new Date().toISOString(),i=Ol[e];if(!i)throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class ni{constructor(e){this.name=e,this._logLevel=Dl,this._logHandler=Ml,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in K))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?kl[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,K.DEBUG,...e),this._logHandler(this,K.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,K.VERBOSE,...e),this._logHandler(this,K.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,K.INFO,...e),this._logHandler(this,K.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,K.WARN,...e),this._logHandler(this,K.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,K.ERROR,...e),this._logHandler(this,K.ERROR,...e)}}const Nl=(t,e)=>e.some(n=>t instanceof n);let Li,Vi;function Cl(){return Li||(Li=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function xl(){return Vi||(Vi=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const io=new WeakMap,Or=new WeakMap,so=new WeakMap,_r=new WeakMap,ri=new WeakMap;function Ll(t){const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("success",s),t.removeEventListener("error",o)},s=()=>{n(st(t.result)),i()},o=()=>{r(t.error),i()};t.addEventListener("success",s),t.addEventListener("error",o)});return e.then(n=>{n instanceof IDBCursor&&io.set(n,t)}).catch(()=>{}),ri.set(e,t),e}function Vl(t){if(Or.has(t))return;const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("complete",s),t.removeEventListener("error",o),t.removeEventListener("abort",o)},s=()=>{n(),i()},o=()=>{r(t.error||new DOMException("AbortError","AbortError")),i()};t.addEventListener("complete",s),t.addEventListener("error",o),t.addEventListener("abort",o)});Or.set(t,e)}let Mr={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return Or.get(t);if(e==="objectStoreNames")return t.objectStoreNames||so.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return st(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function Bl(t){Mr=t(Mr)}function Fl(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const r=t.call(Tr(this),e,...n);return so.set(r,e.sort?e.sort():[e]),st(r)}:xl().includes(t)?function(...e){return t.apply(Tr(this),e),st(io.get(this))}:function(...e){return st(t.apply(Tr(this),e))}}function Ul(t){return typeof t=="function"?Fl(t):(t instanceof IDBTransaction&&Vl(t),Nl(t,Cl())?new Proxy(t,Mr):t)}function st(t){if(t instanceof IDBRequest)return Ll(t);if(_r.has(t))return _r.get(t);const e=Ul(t);return e!==t&&(_r.set(t,e),ri.set(e,t)),e}const Tr=t=>ri.get(t);function Gl(t,e,{blocked:n,upgrade:r,blocking:i,terminated:s}={}){const o=indexedDB.open(t,e),a=st(o);return r&&o.addEventListener("upgradeneeded",l=>{r(st(o.result),l.oldVersion,l.newVersion,st(o.transaction),l)}),n&&o.addEventListener("blocked",l=>n(l.oldVersion,l.newVersion,l)),a.then(l=>{s&&l.addEventListener("close",()=>s()),i&&l.addEventListener("versionchange",c=>i(c.oldVersion,c.newVersion,c))}).catch(()=>{}),a}const Yl=["get","getKey","getAll","getAllKeys","count"],jl=["put","add","delete","clear"],vr=new Map;function Bi(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(vr.get(e))return vr.get(e);const n=e.replace(/FromIndex$/,""),r=e!==n,i=jl.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||Yl.includes(n)))return;const s=async function(o,...a){const l=this.transaction(o,i?"readwrite":"readonly");let c=l.store;return r&&(c=c.index(a.shift())),(await Promise.all([c[n](...a),i&&l.done]))[0]};return vr.set(e,s),s}Bl(t=>({...t,get:(e,n,r)=>Bi(e,n)||t.get(e,n,r),has:(e,n)=>!!Bi(e,n)||t.has(e,n)}));/**
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
 */class $l{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(Kl(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function Kl(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Nr="@firebase/app",Fi="0.10.13";/**
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
 */const Ke=new ni("@firebase/app"),Hl="@firebase/app-compat",Wl="@firebase/analytics-compat",zl="@firebase/analytics",ql="@firebase/app-check-compat",Jl="@firebase/app-check",Ql="@firebase/auth",Xl="@firebase/auth-compat",Zl="@firebase/database",ec="@firebase/data-connect",tc="@firebase/database-compat",nc="@firebase/functions",rc="@firebase/functions-compat",ic="@firebase/installations",sc="@firebase/installations-compat",oc="@firebase/messaging",ac="@firebase/messaging-compat",lc="@firebase/performance",cc="@firebase/performance-compat",uc="@firebase/remote-config",dc="@firebase/remote-config-compat",hc="@firebase/storage",fc="@firebase/storage-compat",pc="@firebase/firestore",mc="@firebase/vertexai-preview",gc="@firebase/firestore-compat",yc="firebase",_c="10.14.1";/**
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
 */const Cr="[DEFAULT]",Tc={[Nr]:"fire-core",[Hl]:"fire-core-compat",[zl]:"fire-analytics",[Wl]:"fire-analytics-compat",[Jl]:"fire-app-check",[ql]:"fire-app-check-compat",[Ql]:"fire-auth",[Xl]:"fire-auth-compat",[Zl]:"fire-rtdb",[ec]:"fire-data-connect",[tc]:"fire-rtdb-compat",[nc]:"fire-fn",[rc]:"fire-fn-compat",[ic]:"fire-iid",[sc]:"fire-iid-compat",[oc]:"fire-fcm",[ac]:"fire-fcm-compat",[lc]:"fire-perf",[cc]:"fire-perf-compat",[uc]:"fire-rc",[dc]:"fire-rc-compat",[hc]:"fire-gcs",[fc]:"fire-gcs-compat",[pc]:"fire-fst",[gc]:"fire-fst-compat",[mc]:"fire-vertex","fire-js":"fire-js",[yc]:"fire-js-all"};/**
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
 */const Nn=new Map,vc=new Map,xr=new Map;function Ui(t,e){try{t.container.addComponent(e)}catch(n){Ke.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function Nt(t){const e=t.name;if(xr.has(e))return Ke.debug(`There were multiple attempts to register component ${e}.`),!1;xr.set(e,t);for(const n of Nn.values())Ui(n,t);for(const n of vc.values())Ui(n,t);return!0}function ii(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function it(t){return t.settings!==void 0}/**
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
 */const bc={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},ot=new fn("app","Firebase",bc);/**
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
 */class Ac{constructor(e,n,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new gt("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw ot.create("app-deleted",{appName:this._name})}}/**
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
 */const Ut=_c;function oo(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const r=Object.assign({name:Cr,automaticDataCollectionEnabled:!1},e),i=r.name;if(typeof i!="string"||!i)throw ot.create("bad-app-name",{appName:String(i)});if(n||(n=no()),!n)throw ot.create("no-options");const s=Nn.get(i);if(s){if(Mn(n,s.options)&&Mn(r,s.config))return s;throw ot.create("duplicate-app",{appName:i})}const o=new Rl(i);for(const l of xr.values())o.addComponent(l);const a=new Ac(n,r,o);return Nn.set(i,a),a}function ao(t=Cr){const e=Nn.get(t);if(!e&&t===Cr&&no())return oo();if(!e)throw ot.create("no-app",{appName:t});return e}function at(t,e,n){var r;let i=(r=Tc[t])!==null&&r!==void 0?r:t;n&&(i+=`-${n}`);const s=i.match(/\s|\//),o=e.match(/\s|\//);if(s||o){const a=[`Unable to register library "${i}" with version "${e}":`];s&&a.push(`library name "${i}" contains illegal characters (whitespace or "/")`),s&&o&&a.push("and"),o&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Ke.warn(a.join(" "));return}Nt(new gt(`${i}-version`,()=>({library:i,version:e}),"VERSION"))}/**
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
 */const Ic="firebase-heartbeat-database",Sc=1,rn="firebase-heartbeat-store";let br=null;function lo(){return br||(br=Gl(Ic,Sc,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(rn)}catch{}}}}).catch(t=>{throw ot.create("idb-open",{originalErrorMessage:t.message})})),br}async function wc(t){try{const n=(await lo()).transaction(rn),r=await n.objectStore(rn).get(co(t));return await n.done,r}catch(e){if(e instanceof qe)Ke.warn(e.message);else{const n=ot.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Ke.warn(n.message)}}}async function Gi(t,e){try{const r=(await lo()).transaction(rn,"readwrite");await r.objectStore(rn).put(e,co(t)),await r.done}catch(n){if(n instanceof qe)Ke.warn(n.message);else{const r=ot.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});Ke.warn(r.message)}}}function co(t){return`${t.name}!${t.options.appId}`}/**
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
 */const Ec=1024,Pc=30*24*60*60*1e3;class Rc{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new Dc(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,n;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=Yi();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)===null||n===void 0?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(o=>o.date===s)?void 0:(this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(o=>{const a=new Date(o.date).valueOf();return Date.now()-a<=Pc}),this._storage.overwrite(this._heartbeatsCache))}catch(r){Ke.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=Yi(),{heartbeatsToSend:r,unsentEntries:i}=kc(this._heartbeatsCache.heartbeats),s=On(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(n){return Ke.warn(n),""}}}function Yi(){return new Date().toISOString().substring(0,10)}function kc(t,e=Ec){const n=[];let r=t.slice();for(const i of t){const s=n.find(o=>o.agent===i.agent);if(s){if(s.dates.push(i.date),ji(n)>e){s.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),ji(n)>e){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class Dc{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return gl()?yl().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await wc(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var n;if(await this._canUseIndexedDBPromise){const i=await this.read();return Gi(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var n;if(await this._canUseIndexedDBPromise){const i=await this.read();return Gi(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}else return}}function ji(t){return On(JSON.stringify({version:2,heartbeats:t})).length}/**
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
 */function Oc(t){Nt(new gt("platform-logger",e=>new $l(e),"PRIVATE")),Nt(new gt("heartbeat",e=>new Rc(e),"PRIVATE")),at(Nr,Fi,t),at(Nr,Fi,"esm2017"),at("fire-js","")}Oc("");var Mc="firebase",Nc="10.14.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */at(Mc,Nc,"app");function si(t,e){var n={};for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&e.indexOf(r)<0&&(n[r]=t[r]);if(t!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,r=Object.getOwnPropertySymbols(t);i<r.length;i++)e.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(t,r[i])&&(n[r[i]]=t[r[i]]);return n}function uo(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Cc=uo,ho=new fn("auth","Firebase",uo());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cn=new ni("@firebase/auth");function xc(t,...e){Cn.logLevel<=K.WARN&&Cn.warn(`Auth (${Ut}): ${t}`,...e)}function En(t,...e){Cn.logLevel<=K.ERROR&&Cn.error(`Auth (${Ut}): ${t}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function He(t,...e){throw oi(t,...e)}function Be(t,...e){return oi(t,...e)}function fo(t,e,n){const r=Object.assign(Object.assign({},Cc()),{[e]:n});return new fn("auth","Firebase",r).create(e,{appName:t.name})}function mt(t){return fo(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function oi(t,...e){if(typeof t!="string"){const n=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=t.name),t._errorFactory.create(n,...r)}return ho.create(t,...e)}function x(t,e,...n){if(!t)throw oi(e,...n)}function Ge(t){const e="INTERNAL ASSERTION FAILED: "+t;throw En(e),new Error(e)}function We(t,e){t||Ge(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Lr(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.href)||""}function Lc(){return $i()==="http:"||$i()==="https:"}function $i(){var t;return typeof self<"u"&&((t=self.location)===null||t===void 0?void 0:t.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vc(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Lc()||fl()||"connection"in navigator)?navigator.onLine:!0}function Bc(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mn{constructor(e,n){this.shortDelay=e,this.longDelay=n,We(n>e,"Short delay should be less than long delay!"),this.isMobile=dl()||pl()}get(){return Vc()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ai(t,e){We(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class po{static initialize(e,n,r){this.fetchImpl=e,n&&(this.headersImpl=n),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Ge("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Ge("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Ge("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fc={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Uc=new mn(3e4,6e4);function li(t,e){return t.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:t.tenantId}):e}async function Gt(t,e,n,r,i={}){return mo(t,i,async()=>{let s={},o={};r&&(e==="GET"?o=r:s={body:JSON.stringify(r)});const a=pn(Object.assign({key:t.config.apiKey},o)).slice(1),l=await t._getAdditionalHeaders();l["Content-Type"]="application/json",t.languageCode&&(l["X-Firebase-Locale"]=t.languageCode);const c=Object.assign({method:e,headers:l},s);return hl()||(c.referrerPolicy="no-referrer"),po.fetch()(go(t,t.config.apiHost,n,a),c)})}async function mo(t,e,n){t._canInitEmulator=!1;const r=Object.assign(Object.assign({},Fc),e);try{const i=new Yc(t),s=await Promise.race([n(),i.promise]);i.clearNetworkTimeout();const o=await s.json();if("needConfirmation"in o)throw vn(t,"account-exists-with-different-credential",o);if(s.ok&&!("errorMessage"in o))return o;{const a=s.ok?o.errorMessage:o.error.message,[l,c]=a.split(" : ");if(l==="FEDERATED_USER_ID_ALREADY_LINKED")throw vn(t,"credential-already-in-use",o);if(l==="EMAIL_EXISTS")throw vn(t,"email-already-in-use",o);if(l==="USER_DISABLED")throw vn(t,"user-disabled",o);const u=r[l]||l.toLowerCase().replace(/[_\s]+/g,"-");if(c)throw fo(t,u,c);He(t,u)}}catch(i){if(i instanceof qe)throw i;He(t,"network-request-failed",{message:String(i)})}}async function Gc(t,e,n,r,i={}){const s=await Gt(t,e,n,r,i);return"mfaPendingCredential"in s&&He(t,"multi-factor-auth-required",{_serverResponse:s}),s}function go(t,e,n,r){const i=`${e}${n}?${r}`;return t.config.emulator?ai(t.config,i):`${t.config.apiScheme}://${i}`}class Yc{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,r)=>{this.timer=setTimeout(()=>r(Be(this.auth,"network-request-failed")),Uc.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function vn(t,e,n){const r={appName:t.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const i=Be(t,e,r);return i.customData._tokenResponse=n,i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function jc(t,e){return Gt(t,"POST","/v1/accounts:delete",e)}async function yo(t,e){return Gt(t,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jt(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function $c(t,e=!1){const n=pe(t),r=await n.getIdToken(e),i=ci(r);x(i&&i.exp&&i.auth_time&&i.iat,n.auth,"internal-error");const s=typeof i.firebase=="object"?i.firebase:void 0,o=s==null?void 0:s.sign_in_provider;return{claims:i,token:r,authTime:Jt(Ar(i.auth_time)),issuedAtTime:Jt(Ar(i.iat)),expirationTime:Jt(Ar(i.exp)),signInProvider:o||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function Ar(t){return Number(t)*1e3}function ci(t){const[e,n,r]=t.split(".");if(e===void 0||n===void 0||r===void 0)return En("JWT malformed, contained fewer than 3 sections"),null;try{const i=eo(n);return i?JSON.parse(i):(En("Failed to decode base64 JWT payload"),null)}catch(i){return En("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function Ki(t){const e=ci(t);return x(e,"internal-error"),x(typeof e.exp<"u","internal-error"),x(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function sn(t,e,n=!1){if(n)return e;try{return await e}catch(r){throw r instanceof qe&&Kc(r)&&t.auth.currentUser===t&&await t.auth.signOut(),r}}function Kc({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hc{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var n;if(e){const r=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),r}else{this.errorBackoff=3e4;const i=((n=this.user.stsTokenManager.expirationTime)!==null&&n!==void 0?n:0)-Date.now()-3e5;return Math.max(0,i)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vr{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=Jt(this.lastLoginAt),this.creationTime=Jt(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function xn(t){var e;const n=t.auth,r=await t.getIdToken(),i=await sn(t,yo(n,{idToken:r}));x(i==null?void 0:i.users.length,n,"internal-error");const s=i.users[0];t._notifyReloadListener(s);const o=!((e=s.providerUserInfo)===null||e===void 0)&&e.length?_o(s.providerUserInfo):[],a=zc(t.providerData,o),l=t.isAnonymous,c=!(t.email&&s.passwordHash)&&!(a!=null&&a.length),u=l?c:!1,d={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:a,metadata:new Vr(s.createdAt,s.lastLoginAt),isAnonymous:u};Object.assign(t,d)}async function Wc(t){const e=pe(t);await xn(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function zc(t,e){return[...t.filter(r=>!e.some(i=>i.providerId===r.providerId)),...e]}function _o(t){return t.map(e=>{var{providerId:n}=e,r=si(e,["providerId"]);return{providerId:n,uid:r.rawId||"",displayName:r.displayName||null,email:r.email||null,phoneNumber:r.phoneNumber||null,photoURL:r.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function qc(t,e){const n=await mo(t,{},async()=>{const r=pn({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=t.config,o=go(t,i,"/v1/token",`key=${s}`),a=await t._getAdditionalHeaders();return a["Content-Type"]="application/x-www-form-urlencoded",po.fetch()(o,{method:"POST",headers:a,body:r})});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function Jc(t,e){return Gt(t,"POST","/v2/accounts:revokeToken",li(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kt{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){x(e.idToken,"internal-error"),x(typeof e.idToken<"u","internal-error"),x(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Ki(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){x(e.length!==0,"internal-error");const n=Ki(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(x(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:r,refreshToken:i,expiresIn:s}=await qc(e,n);this.updateTokensAndExpiration(r,i,Number(s))}updateTokensAndExpiration(e,n,r){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,n){const{refreshToken:r,accessToken:i,expirationTime:s}=n,o=new kt;return r&&(x(typeof r=="string","internal-error",{appName:e}),o.refreshToken=r),i&&(x(typeof i=="string","internal-error",{appName:e}),o.accessToken=i),s&&(x(typeof s=="number","internal-error",{appName:e}),o.expirationTime=s),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new kt,this.toJSON())}_performRefresh(){return Ge("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qe(t,e){x(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class Ye{constructor(e){var{uid:n,auth:r,stsTokenManager:i}=e,s=si(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new Hc(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=n,this.auth=r,this.stsTokenManager=i,this.accessToken=i.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new Vr(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const n=await sn(this,this.stsTokenManager.getToken(this.auth,e));return x(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return $c(this,e)}reload(){return Wc(this)}_assign(e){this!==e&&(x(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>Object.assign({},n)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new Ye(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return n.metadata._copy(this.metadata),n}_onReload(e){x(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),n&&await xn(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(it(this.auth.app))return Promise.reject(mt(this.auth));const e=await this.getIdToken();return await sn(this,jc(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){var r,i,s,o,a,l,c,u;const d=(r=n.displayName)!==null&&r!==void 0?r:void 0,h=(i=n.email)!==null&&i!==void 0?i:void 0,m=(s=n.phoneNumber)!==null&&s!==void 0?s:void 0,g=(o=n.photoURL)!==null&&o!==void 0?o:void 0,y=(a=n.tenantId)!==null&&a!==void 0?a:void 0,T=(l=n._redirectEventId)!==null&&l!==void 0?l:void 0,P=(c=n.createdAt)!==null&&c!==void 0?c:void 0,E=(u=n.lastLoginAt)!==null&&u!==void 0?u:void 0,{uid:p,emailVerified:f,isAnonymous:I,providerData:_,stsTokenManager:A}=n;x(p&&A,e,"internal-error");const k=kt.fromJSON(this.name,A);x(typeof p=="string",e,"internal-error"),Qe(d,e.name),Qe(h,e.name),x(typeof f=="boolean",e,"internal-error"),x(typeof I=="boolean",e,"internal-error"),Qe(m,e.name),Qe(g,e.name),Qe(y,e.name),Qe(T,e.name),Qe(P,e.name),Qe(E,e.name);const v=new Ye({uid:p,auth:e,email:h,emailVerified:f,displayName:d,isAnonymous:I,photoURL:g,phoneNumber:m,tenantId:y,stsTokenManager:k,createdAt:P,lastLoginAt:E});return _&&Array.isArray(_)&&(v.providerData=_.map(D=>Object.assign({},D))),T&&(v._redirectEventId=T),v}static async _fromIdTokenResponse(e,n,r=!1){const i=new kt;i.updateFromServerResponse(n);const s=new Ye({uid:n.localId,auth:e,stsTokenManager:i,isAnonymous:r});return await xn(s),s}static async _fromGetAccountInfoResponse(e,n,r){const i=n.users[0];x(i.localId!==void 0,"internal-error");const s=i.providerUserInfo!==void 0?_o(i.providerUserInfo):[],o=!(i.email&&i.passwordHash)&&!(s!=null&&s.length),a=new kt;a.updateFromIdToken(r);const l=new Ye({uid:i.localId,auth:e,stsTokenManager:a,isAnonymous:o}),c={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new Vr(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(s!=null&&s.length)};return Object.assign(l,c),l}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hi=new Map;function je(t){We(t instanceof Function,"Expected a class definition");let e=Hi.get(t);return e?(We(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,Hi.set(t,e),e)}/**
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
 */class To{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}To.type="NONE";const Wi=To;/**
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
 */function Pn(t,e,n){return`firebase:${t}:${e}:${n}`}class Dt{constructor(e,n,r){this.persistence=e,this.auth=n,this.userKey=r;const{config:i,name:s}=this.auth;this.fullUserKey=Pn(this.userKey,i.apiKey,s),this.fullPersistenceKey=Pn("persistence",i.apiKey,s),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?Ye._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,r="authUser"){if(!n.length)return new Dt(je(Wi),e,r);const i=(await Promise.all(n.map(async c=>{if(await c._isAvailable())return c}))).filter(c=>c);let s=i[0]||je(Wi);const o=Pn(r,e.config.apiKey,e.name);let a=null;for(const c of n)try{const u=await c._get(o);if(u){const d=Ye._fromJSON(e,u);c!==s&&(a=d),s=c;break}}catch{}const l=i.filter(c=>c._shouldAllowMigration);return!s._shouldAllowMigration||!l.length?new Dt(s,e,r):(s=l[0],a&&await s._set(o,a.toJSON()),await Promise.all(n.map(async c=>{if(c!==s)try{await c._remove(o)}catch{}})),new Dt(s,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zi(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Io(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(vo(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(wo(e))return"Blackberry";if(Eo(e))return"Webos";if(bo(e))return"Safari";if((e.includes("chrome/")||Ao(e))&&!e.includes("edge/"))return"Chrome";if(So(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=t.match(n);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function vo(t=Te()){return/firefox\//i.test(t)}function bo(t=Te()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Ao(t=Te()){return/crios\//i.test(t)}function Io(t=Te()){return/iemobile/i.test(t)}function So(t=Te()){return/android/i.test(t)}function wo(t=Te()){return/blackberry/i.test(t)}function Eo(t=Te()){return/webos/i.test(t)}function ui(t=Te()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function Qc(t=Te()){var e;return ui(t)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function Xc(){return ml()&&document.documentMode===10}function Po(t=Te()){return ui(t)||So(t)||Eo(t)||wo(t)||/windows phone/i.test(t)||Io(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ro(t,e=[]){let n;switch(t){case"Browser":n=zi(Te());break;case"Worker":n=`${zi(Te())}-${t}`;break;default:n=t}const r=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${Ut}/${r}`}/**
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
 */class Zc{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const r=s=>new Promise((o,a)=>{try{const l=e(s);o(l)}catch(l){a(l)}});r.onAbort=n,this.queue.push(r);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const r of this.queue)await r(e),r.onAbort&&n.push(r.onAbort)}catch(r){n.reverse();for(const i of n)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
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
 */async function eu(t,e={}){return Gt(t,"GET","/v2/passwordPolicy",li(t,e))}/**
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
 */const tu=6;class nu{constructor(e){var n,r,i,s;const o=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(n=o.minPasswordLength)!==null&&n!==void 0?n:tu,o.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=o.maxPasswordLength),o.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=o.containsLowercaseCharacter),o.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=o.containsUppercaseCharacter),o.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=o.containsNumericCharacter),o.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=o.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(i=(r=e.allowedNonAlphanumericCharacters)===null||r===void 0?void 0:r.join(""))!==null&&i!==void 0?i:"",this.forceUpgradeOnSignin=(s=e.forceUpgradeOnSignin)!==null&&s!==void 0?s:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var n,r,i,s,o,a;const l={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,l),this.validatePasswordCharacterOptions(e,l),l.isValid&&(l.isValid=(n=l.meetsMinPasswordLength)!==null&&n!==void 0?n:!0),l.isValid&&(l.isValid=(r=l.meetsMaxPasswordLength)!==null&&r!==void 0?r:!0),l.isValid&&(l.isValid=(i=l.containsLowercaseLetter)!==null&&i!==void 0?i:!0),l.isValid&&(l.isValid=(s=l.containsUppercaseLetter)!==null&&s!==void 0?s:!0),l.isValid&&(l.isValid=(o=l.containsNumericCharacter)!==null&&o!==void 0?o:!0),l.isValid&&(l.isValid=(a=l.containsNonAlphanumericCharacter)!==null&&a!==void 0?a:!0),l}validatePasswordLengthOptions(e,n){const r=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;r&&(n.meetsMinPasswordLength=e.length>=r),i&&(n.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let r;for(let i=0;i<e.length;i++)r=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(n,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,n,r,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ru{constructor(e,n,r,i){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=r,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new qi(this),this.idTokenSubscription=new qi(this),this.beforeStateQueue=new Zc(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=ho,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=je(n)),this._initializationPromise=this.queue(async()=>{var r,i;if(!this._deleted&&(this.persistenceManager=await Dt.create(this,e),!this._deleted)){if(!((r=this._popupRedirectResolver)===null||r===void 0)&&r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((i=this.currentUser)===null||i===void 0?void 0:i.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await yo(this,{idToken:e}),r=await Ye._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(r)}catch{await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var n;if(it(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(a=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(a,a))}):this.directlySetCurrentUser(null)}const r=await this.assertedPersistence.getCurrentUser();let i=r,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(n=this.redirectUser)===null||n===void 0?void 0:n._redirectEventId,a=i==null?void 0:i._redirectEventId,l=await this.tryRedirectSignIn(e);(!o||o===a)&&(l!=null&&l.user)&&(i=l.user,s=!0)}if(!i)return this.directlySetCurrentUser(null);if(!i._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(i)}catch(o){i=r,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return i?this.reloadAndSetCurrentUserOrClear(i):this.directlySetCurrentUser(null)}return x(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===i._redirectEventId?this.directlySetCurrentUser(i):this.reloadAndSetCurrentUserOrClear(i)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await xn(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=Bc()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(it(this.app))return Promise.reject(mt(this));const n=e?pe(e):null;return n&&x(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&x(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return it(this.app)?Promise.reject(mt(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return it(this.app)?Promise.reject(mt(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(je(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await eu(this),n=new nu(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new fn("auth","Firebase",e())}onAuthStateChanged(e,n,r){return this.registerStateListener(this.authStateSubscription,e,n,r)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,r){return this.registerStateListener(this.idTokenSubscription,e,n,r)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(r.tenantId=this.tenantId),await Jc(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,n){const r=await this.getOrInitRedirectPersistenceManager(n);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&je(e)||this._popupRedirectResolver;x(n,this,"argument-error"),this.redirectPersistenceManager=await Dt.create(this,[je(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,r;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)===null||n===void 0?void 0:n._redirectEventId)===e?this._currentUser:((r=this.redirectUser)===null||r===void 0?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const r=(n=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&n!==void 0?n:null;this.lastNotifiedUid!==r&&(this.lastNotifiedUid=r,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,r,i){if(this._deleted)return()=>{};const s=typeof n=="function"?n:n.next.bind(n);let o=!1;const a=this._isInitialized?Promise.resolve():this._initializationPromise;if(x(a,this,"internal-error"),a.then(()=>{o||s(this.currentUser)}),typeof n=="function"){const l=e.addObserver(n,r,i);return()=>{o=!0,l()}}else{const l=e.addObserver(n);return()=>{o=!0,l()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return x(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Ro(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const n={"X-Client-Version":this.clientVersion};this.app.options.appId&&(n["X-Firebase-gmpid"]=this.app.options.appId);const r=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());r&&(n["X-Firebase-Client"]=r);const i=await this._getAppCheckToken();return i&&(n["X-Firebase-AppCheck"]=i),n}async _getAppCheckToken(){var e;const n=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return n!=null&&n.error&&xc(`Error while retrieving App Check token: ${n.error}`),n==null?void 0:n.token}}function di(t){return pe(t)}class qi{constructor(e){this.auth=e,this.observer=null,this.addObserver=Al(n=>this.observer=n)}get next(){return x(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let hi={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function iu(t){hi=t}function su(t){return hi.loadJS(t)}function ou(){return hi.gapiScript}function au(t){return`__${t}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lu(t,e){const n=ii(t,"auth");if(n.isInitialized()){const i=n.getImmediate(),s=n.getOptions();if(Mn(s,e??{}))return i;He(i,"already-initialized")}return n.initialize({options:e})}function cu(t,e){const n=(e==null?void 0:e.persistence)||[],r=(Array.isArray(n)?n:[n]).map(je);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function uu(t,e,n){const r=di(t);x(r._canInitEmulator,r,"emulator-config-failed"),x(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const i=!1,s=ko(e),{host:o,port:a}=du(e),l=a===null?"":`:${a}`;r.config.emulator={url:`${s}//${o}${l}/`},r.settings.appVerificationDisabledForTesting=!0,r.emulatorConfig=Object.freeze({host:o,port:a,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})}),hu()}function ko(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function du(t){const e=ko(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const s=i[1];return{host:s,port:Ji(r.substr(s.length+1))}}else{const[s,o]=r.split(":");return{host:s,port:Ji(o)}}}function Ji(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function hu(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Do{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return Ge("not implemented")}_getIdTokenResponse(e){return Ge("not implemented")}_linkToIdToken(e,n){return Ge("not implemented")}_getReauthenticationResolver(e){return Ge("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ot(t,e){return Gc(t,"POST","/v1/accounts:signInWithIdp",li(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fu="http://localhost";class yt extends Do{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new yt(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):He("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:i}=n,s=si(n,["providerId","signInMethod"]);if(!r||!i)return null;const o=new yt(r,i);return o.idToken=s.idToken||void 0,o.accessToken=s.accessToken||void 0,o.secret=s.secret,o.nonce=s.nonce,o.pendingToken=s.pendingToken||null,o}_getIdTokenResponse(e){const n=this.buildRequest();return Ot(e,n)}_linkToIdToken(e,n){const r=this.buildRequest();return r.idToken=n,Ot(e,r)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,Ot(e,n)}buildRequest(){const e={requestUri:fu,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=pn(n)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oo{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
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
 */class gn extends Oo{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class et extends gn{constructor(){super("facebook.com")}static credential(e){return yt._fromParams({providerId:et.PROVIDER_ID,signInMethod:et.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return et.credentialFromTaggedObject(e)}static credentialFromError(e){return et.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return et.credential(e.oauthAccessToken)}catch{return null}}}et.FACEBOOK_SIGN_IN_METHOD="facebook.com";et.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tt extends gn{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return yt._fromParams({providerId:tt.PROVIDER_ID,signInMethod:tt.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return tt.credentialFromTaggedObject(e)}static credentialFromError(e){return tt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:r}=e;if(!n&&!r)return null;try{return tt.credential(n,r)}catch{return null}}}tt.GOOGLE_SIGN_IN_METHOD="google.com";tt.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nt extends gn{constructor(){super("github.com")}static credential(e){return yt._fromParams({providerId:nt.PROVIDER_ID,signInMethod:nt.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return nt.credentialFromTaggedObject(e)}static credentialFromError(e){return nt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return nt.credential(e.oauthAccessToken)}catch{return null}}}nt.GITHUB_SIGN_IN_METHOD="github.com";nt.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rt extends gn{constructor(){super("twitter.com")}static credential(e,n){return yt._fromParams({providerId:rt.PROVIDER_ID,signInMethod:rt.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return rt.credentialFromTaggedObject(e)}static credentialFromError(e){return rt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:r}=e;if(!n||!r)return null;try{return rt.credential(n,r)}catch{return null}}}rt.TWITTER_SIGN_IN_METHOD="twitter.com";rt.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ct{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,r,i=!1){const s=await Ye._fromIdTokenResponse(e,r,i),o=Qi(r);return new Ct({user:s,providerId:o,_tokenResponse:r,operationType:n})}static async _forOperation(e,n,r){await e._updateTokensIfNecessary(r,!0);const i=Qi(r);return new Ct({user:e,providerId:i,_tokenResponse:r,operationType:n})}}function Qi(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ln extends qe{constructor(e,n,r,i){var s;super(n.code,n.message),this.operationType=r,this.user=i,Object.setPrototypeOf(this,Ln.prototype),this.customData={appName:e.name,tenantId:(s=e.tenantId)!==null&&s!==void 0?s:void 0,_serverResponse:n.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,n,r,i){return new Ln(e,n,r,i)}}function Mo(t,e,n,r){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?Ln._fromErrorAndOperation(t,s,e,r):s})}async function pu(t,e,n=!1){const r=await sn(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return Ct._forOperation(t,"link",r)}/**
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
 */async function mu(t,e,n=!1){const{auth:r}=t;if(it(r.app))return Promise.reject(mt(r));const i="reauthenticate";try{const s=await sn(t,Mo(r,i,e,t),n);x(s.idToken,r,"internal-error");const o=ci(s.idToken);x(o,r,"internal-error");const{sub:a}=o;return x(t.uid===a,r,"user-mismatch"),Ct._forOperation(t,i,s)}catch(s){throw(s==null?void 0:s.code)==="auth/user-not-found"&&He(r,"user-mismatch"),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function gu(t,e,n=!1){if(it(t.app))return Promise.reject(mt(t));const r="signIn",i=await Mo(t,r,e),s=await Ct._fromIdTokenResponse(t,r,i);return n||await t._updateCurrentUser(s.user),s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yu(t,e){return pe(t).setPersistence(e)}function _u(t,e,n,r){return pe(t).onIdTokenChanged(e,n,r)}function Tu(t,e,n){return pe(t).beforeAuthStateChanged(e,n)}function vu(t,e,n,r){return pe(t).onAuthStateChanged(e,n,r)}function bu(t){return pe(t).signOut()}const Vn="__sak";/**
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
 */class No{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(Vn,"1"),this.storage.removeItem(Vn),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Au=1e3,Iu=10;class Co extends No{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Po(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const r=this.storage.getItem(n),i=this.localCache[n];r!==i&&e(n,i,r)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((o,a,l)=>{this.notifyListeners(o,l)});return}const r=e.key;n?this.detachListener():this.stopPolling();const i=()=>{const o=this.storage.getItem(r);!n&&this.localCache[r]===o||this.notifyListeners(r,o)},s=this.storage.getItem(r);Xc()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,Iu):i()}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:r}),!0)})},Au)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}Co.type="LOCAL";const xo=Co;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lo extends No{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}Lo.type="SESSION";const Vo=Lo;/**
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
 */function Su(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
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
 */class Xn{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(i=>i.isListeningto(e));if(n)return n;const r=new Xn(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:r,eventType:i,data:s}=n.data,o=this.handlersMap[i];if(!(o!=null&&o.size))return;n.ports[0].postMessage({status:"ack",eventId:r,eventType:i});const a=Array.from(o).map(async c=>c(n.origin,s)),l=await Su(a);n.ports[0].postMessage({status:"done",eventId:r,eventType:i,response:l})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Xn.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fi(t="",e=10){let n="";for(let r=0;r<e;r++)n+=Math.floor(Math.random()*10);return t+n}/**
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
 */class wu{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,r=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,o;return new Promise((a,l)=>{const c=fi("",20);i.port1.start();const u=setTimeout(()=>{l(new Error("unsupported_event"))},r);o={messageChannel:i,onMessage(d){const h=d;if(h.data.eventId===c)switch(h.data.status){case"ack":clearTimeout(u),s=setTimeout(()=>{l(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),a(h.data.response);break;default:clearTimeout(u),clearTimeout(s),l(new Error("invalid_response"));break}}},this.handlers.add(o),i.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:c,data:n},[i.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fe(){return window}function Eu(t){Fe().location.href=t}/**
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
 */function Bo(){return typeof Fe().WorkerGlobalScope<"u"&&typeof Fe().importScripts=="function"}async function Pu(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function Ru(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)===null||t===void 0?void 0:t.controller)||null}function ku(){return Bo()?self:null}/**
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
 */const Fo="firebaseLocalStorageDb",Du=1,Bn="firebaseLocalStorage",Uo="fbase_key";class yn{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function Zn(t,e){return t.transaction([Bn],e?"readwrite":"readonly").objectStore(Bn)}function Ou(){const t=indexedDB.deleteDatabase(Fo);return new yn(t).toPromise()}function Br(){const t=indexedDB.open(Fo,Du);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const r=t.result;try{r.createObjectStore(Bn,{keyPath:Uo})}catch(i){n(i)}}),t.addEventListener("success",async()=>{const r=t.result;r.objectStoreNames.contains(Bn)?e(r):(r.close(),await Ou(),e(await Br()))})})}async function Xi(t,e,n){const r=Zn(t,!0).put({[Uo]:e,value:n});return new yn(r).toPromise()}async function Mu(t,e){const n=Zn(t,!1).get(e),r=await new yn(n).toPromise();return r===void 0?null:r.value}function Zi(t,e){const n=Zn(t,!0).delete(e);return new yn(n).toPromise()}const Nu=800,Cu=3;class Go{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await Br(),this.db)}async _withRetries(e){let n=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(n++>Cu)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return Bo()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Xn._getInstance(ku()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var e,n;if(this.activeServiceWorker=await Pu(),!this.activeServiceWorker)return;this.sender=new wu(this.activeServiceWorker);const r=await this.sender._send("ping",{},800);r&&!((e=r[0])===null||e===void 0)&&e.fulfilled&&!((n=r[0])===null||n===void 0)&&n.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||Ru()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await Br();return await Xi(e,Vn,"1"),await Zi(e,Vn),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(r=>Xi(r,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(r=>Mu(r,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>Zi(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(i=>{const s=Zn(i,!1).getAll();return new yn(s).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],r=new Set;if(e.length!==0)for(const{fbase_key:i,value:s}of e)r.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),n.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!r.has(i)&&(this.notifyListeners(i,null),n.push(i));return n}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),Nu)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}Go.type="LOCAL";const xu=Go;new mn(3e4,6e4);/**
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
 */function Lu(t,e){return e?je(e):(x(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
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
 */class pi extends Do{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Ot(e,this._buildIdpRequest())}_linkToIdToken(e,n){return Ot(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return Ot(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function Vu(t){return gu(t.auth,new pi(t),t.bypassAuthState)}function Bu(t){const{auth:e,user:n}=t;return x(n,e,"internal-error"),mu(n,new pi(t),t.bypassAuthState)}async function Fu(t){const{auth:e,user:n}=t;return x(n,e,"internal-error"),pu(n,new pi(t),t.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yo{constructor(e,n,r,i,s=!1){this.auth=e,this.resolver=r,this.user=i,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:r,postBody:i,tenantId:s,error:o,type:a}=e;if(o){this.reject(o);return}const l={auth:this.auth,requestUri:n,sessionId:r,tenantId:s||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(a)(l))}catch(c){this.reject(c)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return Vu;case"linkViaPopup":case"linkViaRedirect":return Fu;case"reauthViaPopup":case"reauthViaRedirect":return Bu;default:He(this.auth,"internal-error")}}resolve(e){We(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){We(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Uu=new mn(2e3,1e4);class Et extends Yo{constructor(e,n,r,i,s){super(e,n,i,s),this.provider=r,this.authWindow=null,this.pollId=null,Et.currentPopupAction&&Et.currentPopupAction.cancel(),Et.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return x(e,this.auth,"internal-error"),e}async onExecution(){We(this.filter.length===1,"Popup operations only handle one event");const e=fi();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(Be(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(Be(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Et.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,r;if(!((r=(n=this.authWindow)===null||n===void 0?void 0:n.window)===null||r===void 0)&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Be(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,Uu.get())};e()}}Et.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gu="pendingRedirect",Rn=new Map;class Yu extends Yo{constructor(e,n,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,r),this.eventId=null}async execute(){let e=Rn.get(this.auth._key());if(!e){try{const r=await ju(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(n){e=()=>Promise.reject(n)}Rn.set(this.auth._key(),e)}return this.bypassAuthState||Rn.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function ju(t,e){const n=Hu(e),r=Ku(t);if(!await r._isAvailable())return!1;const i=await r._get(n)==="true";return await r._remove(n),i}function $u(t,e){Rn.set(t._key(),e)}function Ku(t){return je(t._redirectPersistence)}function Hu(t){return Pn(Gu,t.config.apiKey,t.name)}async function Wu(t,e,n=!1){if(it(t.app))return Promise.reject(mt(t));const r=di(t),i=Lu(r,e),o=await new Yu(r,i,n).execute();return o&&!n&&(delete o.user._redirectEventId,await r._persistUserIfCurrent(o.user),await r._setRedirectUser(null,e)),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zu=10*60*1e3;class qu{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(n=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Ju(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var r;if(e.error&&!jo(e)){const i=((r=e.error.code)===null||r===void 0?void 0:r.split("auth/")[1])||"internal-error";n.onError(Be(this.auth,i))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const r=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=zu&&this.cachedEventUids.clear(),this.cachedEventUids.has(es(e))}saveEventToCache(e){this.cachedEventUids.add(es(e)),this.lastProcessedEventTime=Date.now()}}function es(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function jo({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Ju(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return jo(t);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Qu(t,e={}){return Gt(t,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xu=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Zu=/^https?/;async function ed(t){if(t.config.emulator)return;const{authorizedDomains:e}=await Qu(t);for(const n of e)try{if(td(n))return}catch{}He(t,"unauthorized-domain")}function td(t){const e=Lr(),{protocol:n,hostname:r}=new URL(e);if(t.startsWith("chrome-extension://")){const o=new URL(t);return o.hostname===""&&r===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&o.hostname===r}if(!Zu.test(n))return!1;if(Xu.test(t))return r===t;const i=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}/**
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
 */const nd=new mn(3e4,6e4);function ts(){const t=Fe().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function rd(t){return new Promise((e,n)=>{var r,i,s;function o(){ts(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{ts(),n(Be(t,"network-request-failed"))},timeout:nd.get()})}if(!((i=(r=Fe().gapi)===null||r===void 0?void 0:r.iframes)===null||i===void 0)&&i.Iframe)e(gapi.iframes.getContext());else if(!((s=Fe().gapi)===null||s===void 0)&&s.load)o();else{const a=au("iframefcb");return Fe()[a]=()=>{gapi.load?o():n(Be(t,"network-request-failed"))},su(`${ou()}?onload=${a}`).catch(l=>n(l))}}).catch(e=>{throw kn=null,e})}let kn=null;function id(t){return kn=kn||rd(t),kn}/**
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
 */const sd=new mn(5e3,15e3),od="__/auth/iframe",ad="emulator/auth/iframe",ld={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},cd=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function ud(t){const e=t.config;x(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?ai(e,ad):`https://${t.config.authDomain}/${od}`,r={apiKey:e.apiKey,appName:t.name,v:Ut},i=cd.get(t.config.apiHost);i&&(r.eid=i);const s=t._getFrameworks();return s.length&&(r.fw=s.join(",")),`${n}?${pn(r).slice(1)}`}async function dd(t){const e=await id(t),n=Fe().gapi;return x(n,t,"internal-error"),e.open({where:document.body,url:ud(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:ld,dontclear:!0},r=>new Promise(async(i,s)=>{await r.restyle({setHideOnLeave:!1});const o=Be(t,"network-request-failed"),a=Fe().setTimeout(()=>{s(o)},sd.get());function l(){Fe().clearTimeout(a),i(r)}r.ping(l).then(l,()=>{s(o)})}))}/**
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
 */const hd={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},fd=500,pd=600,md="_blank",gd="http://localhost";class ns{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function yd(t,e,n,r=fd,i=pd){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),o=Math.max((window.screen.availWidth-r)/2,0).toString();let a="";const l=Object.assign(Object.assign({},hd),{width:r.toString(),height:i.toString(),top:s,left:o}),c=Te().toLowerCase();n&&(a=Ao(c)?md:n),vo(c)&&(e=e||gd,l.scrollbars="yes");const u=Object.entries(l).reduce((h,[m,g])=>`${h}${m}=${g},`,"");if(Qc(c)&&a!=="_self")return _d(e||"",a),new ns(null);const d=window.open(e||"",a,u);x(d,t,"popup-blocked");try{d.focus()}catch{}return new ns(d)}function _d(t,e){const n=document.createElement("a");n.href=t,n.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}/**
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
 */const Td="__/auth/handler",vd="emulator/auth/handler",bd=encodeURIComponent("fac");async function rs(t,e,n,r,i,s){x(t.config.authDomain,t,"auth-domain-config-required"),x(t.config.apiKey,t,"invalid-api-key");const o={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:r,v:Ut,eventId:i};if(e instanceof Oo){e.setDefaultLanguage(t.languageCode),o.providerId=e.providerId||"",bl(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[u,d]of Object.entries({}))o[u]=d}if(e instanceof gn){const u=e.getScopes().filter(d=>d!=="");u.length>0&&(o.scopes=u.join(","))}t.tenantId&&(o.tid=t.tenantId);const a=o;for(const u of Object.keys(a))a[u]===void 0&&delete a[u];const l=await t._getAppCheckToken(),c=l?`#${bd}=${encodeURIComponent(l)}`:"";return`${Ad(t)}?${pn(a).slice(1)}${c}`}function Ad({config:t}){return t.emulator?ai(t,vd):`https://${t.authDomain}/${Td}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ir="webStorageSupport";class Id{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Vo,this._completeRedirectFn=Wu,this._overrideRedirectResult=$u}async _openPopup(e,n,r,i){var s;We((s=this.eventManagers[e._key()])===null||s===void 0?void 0:s.manager,"_initialize() not called before _openPopup()");const o=await rs(e,n,r,Lr(),i);return yd(e,o,fi())}async _openRedirect(e,n,r,i){await this._originValidation(e);const s=await rs(e,n,r,Lr(),i);return Eu(s),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:i,promise:s}=this.eventManagers[n];return i?Promise.resolve(i):(We(s,"If manager is not set, promise should be"),s)}const r=this.initAndGetManager(e);return this.eventManagers[n]={promise:r},r.catch(()=>{delete this.eventManagers[n]}),r}async initAndGetManager(e){const n=await dd(e),r=new qu(e);return n.register("authEvent",i=>(x(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:r.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=n,r}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(Ir,{type:Ir},i=>{var s;const o=(s=i==null?void 0:i[0])===null||s===void 0?void 0:s[Ir];o!==void 0&&n(!!o),He(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=ed(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return Po()||bo()||ui()}}const Sd=Id;var is="@firebase/auth",ss="1.7.9";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wd{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){x(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ed(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function Pd(t){Nt(new gt("auth",(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:o,authDomain:a}=r.options;x(o&&!o.includes(":"),"invalid-api-key",{appName:r.name});const l={apiKey:o,authDomain:a,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Ro(t)},c=new ru(r,i,s,l);return cu(c,n),c},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,r)=>{e.getProvider("auth-internal").initialize()})),Nt(new gt("auth-internal",e=>{const n=di(e.getProvider("auth").getImmediate());return(r=>new wd(r))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),at(is,ss,Ed(t)),at(is,ss,"esm2017")}/**
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
 */const Rd=5*60,kd=ro("authIdTokenMaxAge")||Rd;let os=null;const Dd=t=>async e=>{const n=e&&await e.getIdTokenResult(),r=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(r&&r>kd)return;const i=n==null?void 0:n.token;os!==i&&(os=i,await fetch(t,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function Od(t=ao()){const e=ii(t,"auth");if(e.isInitialized())return e.getImmediate();const n=lu(t,{popupRedirectResolver:Sd,persistence:[xu,xo,Vo]}),r=ro("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(r,location.origin);if(location.origin===s.origin){const o=Dd(s.toString());Tu(n,o,()=>o(n.currentUser)),_u(n,a=>o(a))}}const i=to("auth");return i&&uu(n,`http://${i}`),n}function Md(){var t,e;return(e=(t=document.getElementsByTagName("head"))===null||t===void 0?void 0:t[0])!==null&&e!==void 0?e:document}iu({loadJS(t){return new Promise((e,n)=>{const r=document.createElement("script");r.setAttribute("src",t),r.onload=e,r.onerror=i=>{const s=Be("internal-error");s.customData=i,n(s)},r.type="text/javascript",r.charset="UTF-8",Md().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});Pd("Browser");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ve{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}ve.UNAUTHENTICATED=new ve(null),ve.GOOGLE_CREDENTIALS=new ve("google-credentials-uid"),ve.FIRST_PARTY=new ve("first-party-uid"),ve.MOCK_USER=new ve("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Yt="10.14.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xt=new ni("@firebase/firestore");function Fn(t,...e){if(xt.logLevel<=K.DEBUG){const n=e.map(gi);xt.debug(`Firestore (${Yt}): ${t}`,...n)}}function mi(t,...e){if(xt.logLevel<=K.ERROR){const n=e.map(gi);xt.error(`Firestore (${Yt}): ${t}`,...n)}}function $o(t,...e){if(xt.logLevel<=K.WARN){const n=e.map(gi);xt.warn(`Firestore (${Yt}): ${t}`,...n)}}function gi(t){if(typeof t=="string")return t;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
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
 */function ie(t="Unexpected state"){const e=`FIRESTORE (${Yt}) INTERNAL ASSERTION FAILED: `+t;throw mi(e),new Error(e)}function ct(t,e){t||ie()}function er(t,e){return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const as="ok",Nd="cancelled",Qt="unknown",U="invalid-argument",Cd="deadline-exceeded",xd="not-found",Ld="permission-denied",Fr="unauthenticated",Vd="resource-exhausted",Lt="failed-precondition",Bd="aborted",Fd="out-of-range",Ko="unimplemented",Ud="internal",Gd="unavailable";class L extends qe{constructor(e,n){super(e,n),this.code=e,this.message=n,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ho{constructor(e,n){this.user=n,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class Yd{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,n){e.enqueueRetryable(()=>n(ve.UNAUTHENTICATED))}shutdown(){}}class jd{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,n){this.changeListener=n,e.enqueueRetryable(()=>n(this.token.user))}shutdown(){this.changeListener=null}}class $d{constructor(e){this.auth=null,e.onInit(n=>{this.auth=n})}getToken(){return this.auth?this.auth.getToken().then(e=>e?(ct(typeof e.accessToken=="string"),new Ho(e.accessToken,new ve(this.auth.getUid()))):null):Promise.resolve(null)}invalidateToken(){}start(e,n){}shutdown(){}}class Kd{constructor(e,n,r){this.t=e,this.i=n,this.o=r,this.type="FirstParty",this.user=ve.FIRST_PARTY,this.u=new Map}l(){return this.o?this.o():null}get headers(){this.u.set("X-Goog-AuthUser",this.t);const e=this.l();return e&&this.u.set("Authorization",e),this.i&&this.u.set("X-Goog-Iam-Authorization-Token",this.i),this.u}}class Hd{constructor(e,n,r){this.t=e,this.i=n,this.o=r}getToken(){return Promise.resolve(new Kd(this.t,this.i,this.o))}start(e,n){e.enqueueRetryable(()=>n(ve.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class Wd{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class zd{constructor(e){this.h=e,this.appCheck=null,e.onInit(n=>{this.appCheck=n})}getToken(){return this.appCheck?this.appCheck.getToken().then(e=>e?(ct(typeof e.token=="string"),new Wd(e.token)):null):Promise.resolve(null)}invalidateToken(){}start(e,n){}shutdown(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qd{constructor(e,n,r,i,s,o,a,l,c){this.databaseId=e,this.appId=n,this.persistenceKey=r,this.host=i,this.ssl=s,this.forceLongPolling=o,this.autoDetectLongPolling=a,this.longPollingOptions=l,this.useFetchStreams=c}}class on{constructor(e,n){this.projectId=e,this.database=n||"(default)"}static empty(){return new on("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof on&&e.projectId===this.projectId&&e.database===this.database}}class an{constructor(e,n,r){n===void 0?n=0:n>e.length&&ie(),r===void 0?r=e.length-n:r>e.length-n&&ie(),this.segments=e,this.offset=n,this.len=r}get length(){return this.len}isEqual(e){return an.comparator(this,e)===0}child(e){const n=this.segments.slice(this.offset,this.limit());return e instanceof an?e.forEach(r=>{n.push(r)}):n.push(e),this.construct(n)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}forEach(e){for(let n=this.offset,r=this.limit();n<r;n++)e(this.segments[n])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,n){const r=Math.min(e.length,n.length);for(let i=0;i<r;i++){const s=e.get(i),o=n.get(i);if(s<o)return-1;if(s>o)return 1}return e.length<n.length?-1:e.length>n.length?1:0}}class he extends an{construct(e,n,r){return new he(e,n,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const n=[];for(const r of e){if(r.indexOf("//")>=0)throw new L(U,`Invalid segment (${r}). Paths must not contain // in them.`);n.push(...r.split("/").filter(i=>i.length>0))}return new he(n)}static emptyPath(){return new he([])}}const Jd=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Ae extends an{construct(e,n,r){return new Ae(e,n,r)}static isValidIdentifier(e){return Jd.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Ae.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new Ae(["__name__"])}static fromServerFormat(e){const n=[];let r="",i=0;const s=()=>{if(r.length===0)throw new L(U,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);n.push(r),r=""};let o=!1;for(;i<e.length;){const a=e[i];if(a==="\\"){if(i+1===e.length)throw new L(U,"Path has trailing escape character: "+e);const l=e[i+1];if(l!=="\\"&&l!=="."&&l!=="`")throw new L(U,"Path has invalid escape sequence: "+e);r+=l,i+=2}else a==="`"?(o=!o,i++):a!=="."||o?(r+=a,i++):(s(),i++)}if(s(),o)throw new L(U,"Unterminated ` in path: "+e);return new Ae(n)}static emptyPath(){return new Ae([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ye{constructor(e){this.path=e}static fromPath(e){return new ye(he.fromString(e))}static fromName(e){return new ye(he.fromString(e).popFirst(5))}static empty(){return new ye(he.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&he.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,n){return he.comparator(e.path,n.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new ye(new he(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wo(t,e,n){if(!n)throw new L(U,`Function ${t}() cannot be called with an empty ${e}.`)}function ls(t){if(!ye.isDocumentKey(t))throw new L(U,`Invalid document reference. Document references must have an even number of segments, but ${t} has ${t.length}.`)}function cs(t){if(ye.isDocumentKey(t))throw new L(U,`Invalid collection reference. Collection references must have an odd number of segments, but ${t} has ${t.length}.`)}function yi(t){if(t===void 0)return"undefined";if(t===null)return"null";if(typeof t=="string")return t.length>20&&(t=`${t.substring(0,20)}...`),JSON.stringify(t);if(typeof t=="number"||typeof t=="boolean")return""+t;if(typeof t=="object"){if(t instanceof Array)return"an array";{const e=function(r){return r.constructor?r.constructor.name:null}(t);return e?`a custom ${e} object`:"an object"}}return typeof t=="function"?"a function":ie()}function _i(t,e){if("_delegate"in t&&(t=t._delegate),!(t instanceof e)){if(e.name===t.constructor.name)throw new L(U,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=yi(t);throw new L(U,`Expected type '${e.name}', but it was: ${n}`)}}return t}/**
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
 */function zo(t){const e={};return t.timeoutSeconds!==void 0&&(e.timeoutSeconds=t.timeoutSeconds),e}/**
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
 */let bn=null;function Qd(){return bn===null?bn=function(){return 268435456+Math.round(2147483648*Math.random())}():bn++,"0x"+bn.toString(16)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xd(t){return t==null}function Un(t){return t===0&&1/t==-1/0}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zd={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var us,F;function ds(t){if(t===void 0)return mi("RPC_ERROR","HTTP error has no status"),Qt;switch(t){case 200:return as;case 400:return Lt;case 401:return Fr;case 403:return Ld;case 404:return xd;case 409:return Bd;case 416:return Fd;case 429:return Vd;case 499:return Nd;case 500:return Qt;case 501:return Ko;case 503:return Gd;case 504:return Cd;default:return t>=200&&t<300?as:t>=400&&t<500?Lt:t>=500&&t<600?Ud:Qt}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(F=us||(us={}))[F.OK=0]="OK",F[F.CANCELLED=1]="CANCELLED",F[F.UNKNOWN=2]="UNKNOWN",F[F.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",F[F.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",F[F.NOT_FOUND=5]="NOT_FOUND",F[F.ALREADY_EXISTS=6]="ALREADY_EXISTS",F[F.PERMISSION_DENIED=7]="PERMISSION_DENIED",F[F.UNAUTHENTICATED=16]="UNAUTHENTICATED",F[F.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",F[F.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",F[F.ABORTED=10]="ABORTED",F[F.OUT_OF_RANGE=11]="OUT_OF_RANGE",F[F.UNIMPLEMENTED=12]="UNIMPLEMENTED",F[F.INTERNAL=13]="INTERNAL",F[F.UNAVAILABLE=14]="UNAVAILABLE",F[F.DATA_LOSS=15]="DATA_LOSS";class eh extends class{constructor(n){this.databaseInfo=n,this.databaseId=n.databaseId;const r=n.ssl?"https":"http",i=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.m=r+"://"+n.host,this.A=`projects/${i}/databases/${s}`,this.T=this.databaseId.database==="(default)"?`project_id=${i}`:`project_id=${i}&database_id=${s}`}get R(){return!1}P(n,r,i,s,o){const a=Qd(),l=this.V(n,r.toUriEncodedString());Fn("RestConnection",`Sending RPC '${n}' ${a}:`,l,i);const c={"google-cloud-resource-prefix":this.A,"x-goog-request-params":this.T};return this.I(c,s,o),this.p(n,l,c,i).then(u=>(Fn("RestConnection",`Received RPC '${n}' ${a}: `,u),u),u=>{throw $o("RestConnection",`RPC '${n}' ${a} failed with error: `,u,"url: ",l,"request:",i),u})}g(n,r,i,s,o,a){return this.P(n,r,i,s,o)}I(n,r,i){n["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+Yt}(),n["Content-Type"]="text/plain",this.databaseInfo.appId&&(n["X-Firebase-GMPID"]=this.databaseInfo.appId),r&&r.headers.forEach((s,o)=>n[o]=s),i&&i.headers.forEach((s,o)=>n[o]=s)}V(n,r){const i=Zd[n];return`${this.m}/v1/${r}:${i}`}terminate(){}}{constructor(e,n){super(e),this.F=n}v(e,n){throw new Error("Not supported by FetchConnection")}async p(e,n,r,i){var s;const o=JSON.stringify(i);let a;try{a=await this.F(n,{method:"POST",headers:r,body:o})}catch(l){const c=l;throw new L(ds(c.status),"Request failed with error: "+c.statusText)}if(!a.ok){let l=await a.json();Array.isArray(l)&&(l=l[0]);const c=(s=l==null?void 0:l.error)===null||s===void 0?void 0:s.message;throw new L(ds(a.status),`Request failed with error: ${c??a.statusText}`)}return a.json()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function th(t){const e=typeof self<"u"&&(self.crypto||self.msCrypto),n=new Uint8Array(t);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(n);else for(let r=0;r<t;r++)n[r]=Math.floor(256*Math.random());return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nh{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=Math.floor(256/e.length)*e.length;let r="";for(;r.length<20;){const i=th(40);for(let s=0;s<i.length;++s)r.length<20&&i[s]<n&&(r+=e.charAt(i[s]%e.length))}return r}}function ce(t,e){return t<e?-1:t>e?1:0}function qo(t,e,n){return t.length===e.length&&t.every((r,i)=>n(r,e[i]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hs(t){let e=0;for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e++;return e}function _n(t,e){for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e(n,t[n])}/**
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
 */class rh extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class ze{constructor(e){this.binaryString=e}static fromBase64String(e){const n=function(i){try{return atob(i)}catch(s){throw typeof DOMException<"u"&&s instanceof DOMException?new rh("Invalid base64 string: "+s):s}}(e);return new ze(n)}static fromUint8Array(e){const n=function(i){let s="";for(let o=0;o<i.length;++o)s+=String.fromCharCode(i[o]);return s}(e);return new ze(n)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(n){return btoa(n)}(this.binaryString)}toUint8Array(){return function(n){const r=new Uint8Array(n.length);for(let i=0;i<n.length;i++)r[i]=n.charCodeAt(i);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return ce(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}ze.EMPTY_BYTE_STRING=new ze("");const ih=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function _t(t){if(ct(!!t),typeof t=="string"){let e=0;const n=ih.exec(t);if(ct(!!n),n[1]){let i=n[1];i=(i+"000000000").substr(0,9),e=Number(i)}const r=new Date(t);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:le(t.seconds),nanos:le(t.nanos)}}function le(t){return typeof t=="number"?t:typeof t=="string"?Number(t):0}function ln(t){return typeof t=="string"?ze.fromBase64String(t):ze.fromUint8Array(t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pe{constructor(e,n){if(this.seconds=e,this.nanoseconds=n,n<0)throw new L(U,"Timestamp nanoseconds out of range: "+n);if(n>=1e9)throw new L(U,"Timestamp nanoseconds out of range: "+n);if(e<-62135596800)throw new L(U,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new L(U,"Timestamp seconds out of range: "+e)}static now(){return Pe.fromMillis(Date.now())}static fromDate(e){return Pe.fromMillis(e.getTime())}static fromMillis(e){const n=Math.floor(e/1e3),r=Math.floor(1e6*(e-1e3*n));return new Pe(n,r)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?ce(this.nanoseconds,e.nanoseconds):ce(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jo(t){var e,n;return((n=(((e=t==null?void 0:t.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||n===void 0?void 0:n.stringValue)==="server_timestamp"}function Qo(t){const e=t.mapValue.fields.__previous_value__;return Jo(e)?Qo(e):e}function cn(t){const e=_t(t.mapValue.fields.__local_write_time__.timestampValue);return new Pe(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const An={};function Tt(t){return"nullValue"in t?0:"booleanValue"in t?1:"integerValue"in t||"doubleValue"in t?2:"timestampValue"in t?3:"stringValue"in t?5:"bytesValue"in t?6:"referenceValue"in t?7:"geoPointValue"in t?8:"arrayValue"in t?9:"mapValue"in t?Jo(t)?4:function(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}(t)?9007199254740991:function(n){var r,i;return((i=(((r=n==null?void 0:n.mapValue)===null||r===void 0?void 0:r.fields)||{}).__type__)===null||i===void 0?void 0:i.stringValue)==="__vector__"}(t)?10:11:ie()}function Gn(t,e){if(t===e)return!0;const n=Tt(t);if(n!==Tt(e))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return t.booleanValue===e.booleanValue;case 4:return cn(t).isEqual(cn(e));case 3:return function(i,s){if(typeof i.timestampValue=="string"&&typeof s.timestampValue=="string"&&i.timestampValue.length===s.timestampValue.length)return i.timestampValue===s.timestampValue;const o=_t(i.timestampValue),a=_t(s.timestampValue);return o.seconds===a.seconds&&o.nanos===a.nanos}(t,e);case 5:return t.stringValue===e.stringValue;case 6:return function(i,s){return ln(i.bytesValue).isEqual(ln(s.bytesValue))}(t,e);case 7:return t.referenceValue===e.referenceValue;case 8:return function(i,s){return le(i.geoPointValue.latitude)===le(s.geoPointValue.latitude)&&le(i.geoPointValue.longitude)===le(s.geoPointValue.longitude)}(t,e);case 2:return function(i,s){if("integerValue"in i&&"integerValue"in s)return le(i.integerValue)===le(s.integerValue);if("doubleValue"in i&&"doubleValue"in s){const o=le(i.doubleValue),a=le(s.doubleValue);return o===a?Un(o)===Un(a):isNaN(o)&&isNaN(a)}return!1}(t,e);case 9:return qo(t.arrayValue.values||[],e.arrayValue.values||[],Gn);case 10:case 11:return function(i,s){const o=i.mapValue.fields||{},a=s.mapValue.fields||{};if(hs(o)!==hs(a))return!1;for(const l in o)if(o.hasOwnProperty(l)&&(a[l]===void 0||!Gn(o[l],a[l])))return!1;return!0}(t,e);default:return ie()}}function un(t,e){return(t.values||[]).find(n=>Gn(n,e))!==void 0}function Yn(t,e){if(t===e)return 0;const n=Tt(t),r=Tt(e);if(n!==r)return ce(n,r);switch(n){case 0:case 9007199254740991:return 0;case 1:return ce(t.booleanValue,e.booleanValue);case 2:return function(s,o){const a=le(s.integerValue||s.doubleValue),l=le(o.integerValue||o.doubleValue);return a<l?-1:a>l?1:a===l?0:isNaN(a)?isNaN(l)?0:-1:1}(t,e);case 3:return fs(t.timestampValue,e.timestampValue);case 4:return fs(cn(t),cn(e));case 5:return ce(t.stringValue,e.stringValue);case 6:return function(s,o){const a=ln(s),l=ln(o);return a.compareTo(l)}(t.bytesValue,e.bytesValue);case 7:return function(s,o){const a=s.split("/"),l=o.split("/");for(let c=0;c<a.length&&c<l.length;c++){const u=ce(a[c],l[c]);if(u!==0)return u}return ce(a.length,l.length)}(t.referenceValue,e.referenceValue);case 8:return function(s,o){const a=ce(le(s.latitude),le(o.latitude));return a!==0?a:ce(le(s.longitude),le(o.longitude))}(t.geoPointValue,e.geoPointValue);case 9:return ps(t.arrayValue,e.arrayValue);case 10:return function(s,o){var a,l,c,u;const d=s.fields||{},h=o.fields||{},m=(a=d.value)===null||a===void 0?void 0:a.arrayValue,g=(l=h.value)===null||l===void 0?void 0:l.arrayValue,y=ce(((c=m==null?void 0:m.values)===null||c===void 0?void 0:c.length)||0,((u=g==null?void 0:g.values)===null||u===void 0?void 0:u.length)||0);return y!==0?y:ps(m,g)}(t.mapValue,e.mapValue);case 11:return function(s,o){if(s===An&&o===An)return 0;if(s===An)return 1;if(o===An)return-1;const a=s.fields||{},l=Object.keys(a),c=o.fields||{},u=Object.keys(c);l.sort(),u.sort();for(let d=0;d<l.length&&d<u.length;++d){const h=ce(l[d],u[d]);if(h!==0)return h;const m=Yn(a[l[d]],c[u[d]]);if(m!==0)return m}return ce(l.length,u.length)}(t.mapValue,e.mapValue);default:throw ie()}}function fs(t,e){if(typeof t=="string"&&typeof e=="string"&&t.length===e.length)return ce(t,e);const n=_t(t),r=_t(e),i=ce(n.seconds,r.seconds);return i!==0?i:ce(n.nanos,r.nanos)}function ps(t,e){const n=t.values||[],r=e.values||[];for(let i=0;i<n.length&&i<r.length;++i){const s=Yn(n[i],r[i]);if(s)return s}return ce(n.length,r.length)}function Xo(t){return!!t&&"arrayValue"in t}function ms(t){return!!t&&"nullValue"in t}function gs(t){return!!t&&"doubleValue"in t&&isNaN(Number(t.doubleValue))}function Sr(t){return!!t&&"mapValue"in t}function Xt(t){if(t.geoPointValue)return{geoPointValue:Object.assign({},t.geoPointValue)};if(t.timestampValue&&typeof t.timestampValue=="object")return{timestampValue:Object.assign({},t.timestampValue)};if(t.mapValue){const e={mapValue:{fields:{}}};return _n(t.mapValue.fields,(n,r)=>e.mapValue.fields[n]=Xt(r)),e}if(t.arrayValue){const e={arrayValue:{values:[]}};for(let n=0;n<(t.arrayValue.values||[]).length;++n)e.arrayValue.values[n]=Xt(t.arrayValue.values[n]);return e}return Object.assign({},t)}class ys{constructor(e,n){this.position=e,this.inclusive=n}}/**
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
 */class Zo{}class Ue extends Zo{constructor(e,n,r){super(),this.field=e,this.op=n,this.value=r}static create(e,n,r){return e.isKeyField()?n==="in"||n==="not-in"?this.createKeyFieldInFilter(e,n,r):new sh(e,n,r):n==="array-contains"?new lh(e,r):n==="in"?new ch(e,r):n==="not-in"?new uh(e,r):n==="array-contains-any"?new dh(e,r):new Ue(e,n,r)}static createKeyFieldInFilter(e,n,r){return n==="in"?new oh(e,r):new ah(e,r)}matches(e){const n=e.data.field(this.field);return this.op==="!="?n!==null&&this.matchesComparison(Yn(n,this.value)):n!==null&&Tt(this.value)===Tt(n)&&this.matchesComparison(Yn(n,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return ie()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class tr extends Zo{constructor(e,n){super(),this.filters=e,this.op=n,this.D=null}static create(e,n){return new tr(e,n)}matches(e){return function(r){return r.op==="and"}(this)?this.filters.find(n=>!n.matches(e))===void 0:this.filters.find(n=>n.matches(e))!==void 0}getFlattenedFilters(){return this.D!==null||(this.D=this.filters.reduce((e,n)=>e.concat(n.getFlattenedFilters()),[])),this.D}getFilters(){return Object.assign([],this.filters)}}class sh extends Ue{constructor(e,n,r){super(e,n,r),this.key=ye.fromName(r.referenceValue)}matches(e){const n=ye.comparator(e.key,this.key);return this.matchesComparison(n)}}class oh extends Ue{constructor(e,n){super(e,"in",n),this.keys=ea("in",n)}matches(e){return this.keys.some(n=>n.isEqual(e.key))}}class ah extends Ue{constructor(e,n){super(e,"not-in",n),this.keys=ea("not-in",n)}matches(e){return!this.keys.some(n=>n.isEqual(e.key))}}function ea(t,e){var n;return(((n=e.arrayValue)===null||n===void 0?void 0:n.values)||[]).map(r=>ye.fromName(r.referenceValue))}class lh extends Ue{constructor(e,n){super(e,"array-contains",n)}matches(e){const n=e.data.field(this.field);return Xo(n)&&un(n.arrayValue,this.value)}}class ch extends Ue{constructor(e,n){super(e,"in",n)}matches(e){const n=e.data.field(this.field);return n!==null&&un(this.value.arrayValue,n)}}class uh extends Ue{constructor(e,n){super(e,"not-in",n)}matches(e){if(un(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const n=e.data.field(this.field);return n!==null&&!un(this.value.arrayValue,n)}}class dh extends Ue{constructor(e,n){super(e,"array-contains-any",n)}matches(e){const n=e.data.field(this.field);return!(!Xo(n)||!n.arrayValue.values)&&n.arrayValue.values.some(r=>un(this.value.arrayValue,r))}}/**
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
 */class Ur{constructor(e,n="asc"){this.field=e,this.dir=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class me{constructor(e){this.timestamp=e}static fromTimestamp(e){return new me(e)}static min(){return new me(new Pe(0,0))}static max(){return new me(new Pe(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jn{constructor(e,n){this.comparator=e,this.root=n||fe.EMPTY}insert(e,n){return new jn(this.comparator,this.root.insert(e,n,this.comparator).copy(null,null,fe.BLACK,null,null))}remove(e){return new jn(this.comparator,this.root.remove(e,this.comparator).copy(null,null,fe.BLACK,null,null))}get(e){let n=this.root;for(;!n.isEmpty();){const r=this.comparator(e,n.key);if(r===0)return n.value;r<0?n=n.left:r>0&&(n=n.right)}return null}indexOf(e){let n=0,r=this.root;for(;!r.isEmpty();){const i=this.comparator(e,r.key);if(i===0)return n+r.left.size;i<0?r=r.left:(n+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((n,r)=>(e(n,r),!1))}toString(){const e=[];return this.inorderTraversal((n,r)=>(e.push(`${n}:${r}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new In(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new In(this.root,e,this.comparator,!1)}getReverseIterator(){return new In(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new In(this.root,e,this.comparator,!0)}}class In{constructor(e,n,r,i){this.isReverse=i,this.nodeStack=[];let s=1;for(;!e.isEmpty();)if(s=n?r(e.key,n):1,n&&i&&(s*=-1),s<0)e=this.isReverse?e.left:e.right;else{if(s===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const n={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return n}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class fe{constructor(e,n,r,i,s){this.key=e,this.value=n,this.color=r??fe.RED,this.left=i??fe.EMPTY,this.right=s??fe.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,n,r,i,s){return new fe(e??this.key,n??this.value,r??this.color,i??this.left,s??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,n,r){let i=this;const s=r(e,i.key);return i=s<0?i.copy(null,null,null,i.left.insert(e,n,r),null):s===0?i.copy(null,n,null,null,null):i.copy(null,null,null,null,i.right.insert(e,n,r)),i.fixUp()}removeMin(){if(this.left.isEmpty())return fe.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,n){let r,i=this;if(n(e,i.key)<0)i.left.isEmpty()||i.left.isRed()||i.left.left.isRed()||(i=i.moveRedLeft()),i=i.copy(null,null,null,i.left.remove(e,n),null);else{if(i.left.isRed()&&(i=i.rotateRight()),i.right.isEmpty()||i.right.isRed()||i.right.left.isRed()||(i=i.moveRedRight()),n(e,i.key)===0){if(i.right.isEmpty())return fe.EMPTY;r=i.right.min(),i=i.copy(r.key,r.value,null,null,i.right.removeMin())}i=i.copy(null,null,null,null,i.right.remove(e,n))}return i.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,fe.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,fe.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),n=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,n)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw ie();const e=this.left.check();if(e!==this.right.check())throw ie();return e+(this.isRed()?0:1)}}fe.EMPTY=null,fe.RED=!0,fe.BLACK=!1;fe.EMPTY=new class{constructor(){this.size=0}get key(){throw ie()}get value(){throw ie()}get color(){throw ie()}get left(){throw ie()}get right(){throw ie()}copy(e,n,r,i,s){return this}insert(e,n,r){return new fe(e,n)}remove(e,n){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dn{constructor(e){this.comparator=e,this.data=new jn(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((n,r)=>(e(n),!1))}forEachInRange(e,n){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const i=r.getNext();if(this.comparator(i.key,e[1])>=0)return;n(i.key)}}forEachWhile(e,n){let r;for(r=n!==void 0?this.data.getIteratorFrom(n):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const n=this.data.getIteratorFrom(e);return n.hasNext()?n.getNext().key:null}getIterator(){return new _s(this.data.getIterator())}getIteratorFrom(e){return new _s(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let n=this;return n.size<e.size&&(n=e,e=this),e.forEach(r=>{n=n.add(r)}),n}isEqual(e){if(!(e instanceof dn)||this.size!==e.size)return!1;const n=this.data.getIterator(),r=e.data.getIterator();for(;n.hasNext();){const i=n.getNext().key,s=r.getNext().key;if(this.comparator(i,s)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(n=>{e.push(n)}),e}toString(){const e=[];return this.forEach(n=>e.push(n)),"SortedSet("+e.toString()+")"}copy(e){const n=new dn(this.comparator);return n.data=e,n}}class _s{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hn{constructor(e){this.fields=e,e.sort(Ae.comparator)}static empty(){return new hn([])}unionWith(e){let n=new dn(Ae.comparator);for(const r of this.fields)n=n.add(r);for(const r of e)n=n.add(r);return new hn(n.toArray())}covers(e){for(const n of this.fields)if(n.isPrefixOf(e))return!0;return!1}isEqual(e){return qo(this.fields,e.fields,(n,r)=>n.isEqual(r))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xe{constructor(e){this.value=e}static empty(){return new xe({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let n=this.value;for(let r=0;r<e.length-1;++r)if(n=(n.mapValue.fields||{})[e.get(r)],!Sr(n))return null;return n=(n.mapValue.fields||{})[e.lastSegment()],n||null}}set(e,n){this.getFieldsMap(e.popLast())[e.lastSegment()]=Xt(n)}setAll(e){let n=Ae.emptyPath(),r={},i=[];e.forEach((o,a)=>{if(!n.isImmediateParentOf(a)){const l=this.getFieldsMap(n);this.applyChanges(l,r,i),r={},i=[],n=a.popLast()}o?r[a.lastSegment()]=Xt(o):i.push(a.lastSegment())});const s=this.getFieldsMap(n);this.applyChanges(s,r,i)}delete(e){const n=this.field(e.popLast());Sr(n)&&n.mapValue.fields&&delete n.mapValue.fields[e.lastSegment()]}isEqual(e){return Gn(this.value,e.value)}getFieldsMap(e){let n=this.value;n.mapValue.fields||(n.mapValue={fields:{}});for(let r=0;r<e.length;++r){let i=n.mapValue.fields[e.get(r)];Sr(i)&&i.mapValue.fields||(i={mapValue:{fields:{}}},n.mapValue.fields[e.get(r)]=i),n=i}return n.mapValue.fields}applyChanges(e,n,r){_n(n,(i,s)=>e[i]=s);for(const i of r)delete e[i]}clone(){return new xe(Xt(this.value))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ze{constructor(e,n,r,i,s,o,a){this.key=e,this.documentType=n,this.version=r,this.readTime=i,this.createTime=s,this.data=o,this.documentState=a}static newInvalidDocument(e){return new Ze(e,0,me.min(),me.min(),me.min(),xe.empty(),0)}static newFoundDocument(e,n,r,i){return new Ze(e,1,n,me.min(),r,i,0)}static newNoDocument(e,n){return new Ze(e,2,n,me.min(),me.min(),xe.empty(),0)}static newUnknownDocument(e,n){return new Ze(e,3,n,me.min(),me.min(),xe.empty(),2)}convertToFoundDocument(e,n){return!this.createTime.isEqual(me.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=n,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=xe.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=xe.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=me.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof Ze&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Ze(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class hh{constructor(e,n=null,r=[],i=[],s=null,o=null,a=null){this.path=e,this.collectionGroup=n,this.orderBy=r,this.filters=i,this.limit=s,this.startAt=o,this.endAt=a,this.C=null}}function Ts(t,e=null,n=[],r=[],i=null,s=null,o=null){return new hh(t,e,n,r,i,s,o)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fh{constructor(e,n=null,r=[],i=[],s=null,o="F",a=null,l=null){this.path=e,this.collectionGroup=n,this.explicitOrderBy=r,this.filters=i,this.limit=s,this.limitType=o,this.startAt=a,this.endAt=l,this.S=null,this.N=null,this.O=null,this.startAt,this.endAt}}function ph(t){const e=er(t);if(e.S===null){e.S=[];const n=new Set;for(const s of e.explicitOrderBy)e.S.push(s),n.add(s.field.canonicalString());const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let a=new dn(Ae.comparator);return o.filters.forEach(l=>{l.getFlattenedFilters().forEach(c=>{c.isInequality()&&(a=a.add(c.field))})}),a})(e).forEach(s=>{n.has(s.canonicalString())||s.isKeyField()||e.S.push(new Ur(s,r))}),n.has(Ae.keyField().canonicalString())||e.S.push(new Ur(Ae.keyField(),r))}return e.S}function mh(t){const e=er(t);return e.N||(e.N=gh(e,ph(t))),e.N}function gh(t,e){if(t.limitType==="F")return Ts(t.path,t.collectionGroup,e,t.filters,t.limit,t.startAt,t.endAt);{e=e.map(i=>{const s=i.dir==="desc"?"asc":"desc";return new Ur(i.field,s)});const n=t.endAt?new ys(t.endAt.position,t.endAt.inclusive):null,r=t.startAt?new ys(t.startAt.position,t.startAt.inclusive):null;return Ts(t.path,t.collectionGroup,e,t.filters,t.limit,n,r)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ta(t,e){if(t.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Un(e)?"-0":e}}function yh(t,e){return function(r){return typeof r=="number"&&Number.isInteger(r)&&!Un(r)&&r<=Number.MAX_SAFE_INTEGER&&r>=Number.MIN_SAFE_INTEGER}(e)?function(r){return{integerValue:""+r}}(e):ta(t,e)}/**
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
 */class nr{constructor(){this._=void 0}}class _h extends nr{}class Th extends nr{constructor(e){super(),this.elements=e}}class vh extends nr{constructor(e){super(),this.elements=e}}class bh extends nr{constructor(e,n){super(),this.serializer=e,this.q=n}}class Zt{constructor(e,n){this.updateTime=e,this.exists=n}static none(){return new Zt}static exists(e){return new Zt(void 0,e)}static updateTime(e){return new Zt(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}class rr{}class Ah extends rr{constructor(e,n,r,i=[]){super(),this.key=e,this.value=n,this.precondition=r,this.fieldTransforms=i,this.type=0}getFieldMask(){return null}}class na extends rr{constructor(e,n,r,i,s=[]){super(),this.key=e,this.data=n,this.fieldMask=r,this.precondition=i,this.fieldTransforms=s,this.type=1}getFieldMask(){return this.fieldMask}}class Ih extends rr{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class Sh extends rr{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wh={asc:"ASCENDING",desc:"DESCENDING"},Eh={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},Ph={and:"AND",or:"OR"};class Rh{constructor(e,n){this.databaseId=e,this.useProto3Json=n}}function Gr(t,e){return t.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function kh(t,e){return t.useProto3Json?e.toBase64():e.toUint8Array()}function Dh(t,e){return Gr(t,e.toTimestamp())}function vs(t){return ct(!!t),me.fromTimestamp(function(n){const r=_t(n);return new Pe(r.seconds,r.nanos)}(t))}function Ti(t,e){return Yr(t,e).canonicalString()}function Yr(t,e){const n=function(i){return new he(["projects",i.projectId,"databases",i.database])}(t).child("documents");return e===void 0?n:n.child(e)}function jr(t,e){return Ti(t.databaseId,e.path)}function Oh(t,e){const n=function(i){const s=he.fromString(i);return ct(ia(s)),s}(e);if(n.get(1)!==t.databaseId.projectId)throw new L(U,"Tried to deserialize key from different project: "+n.get(1)+" vs "+t.databaseId.projectId);if(n.get(3)!==t.databaseId.database)throw new L(U,"Tried to deserialize key from different database: "+n.get(3)+" vs "+t.databaseId.database);return new ye(function(i){return ct(i.length>4&&i.get(4)==="documents"),i.popFirst(5)}(n))}function bs(t,e,n){return{name:jr(t,e),fields:n.value.mapValue.fields}}function Mh(t,e){let n;if(e instanceof Ah)n={update:bs(t,e.key,e.value)};else if(e instanceof Ih)n={delete:jr(t,e.key)};else if(e instanceof na)n={update:bs(t,e.key,e.data),updateMask:Vh(e.fieldMask)};else{if(!(e instanceof Sh))return ie();n={verify:jr(t,e.key)}}return e.fieldTransforms.length>0&&(n.updateTransforms=e.fieldTransforms.map(r=>function(s,o){const a=o.transform;if(a instanceof _h)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(a instanceof Th)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:a.elements}};if(a instanceof vh)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:a.elements}};if(a instanceof bh)return{fieldPath:o.field.canonicalString(),increment:a.q};throw ie()}(0,r))),e.precondition.isNone||(n.currentDocument=function(i,s){return s.updateTime!==void 0?{updateTime:Dh(i,s.updateTime)}:s.exists!==void 0?{exists:s.exists}:ie()}(t,e.precondition)),n}function Nh(t,e){const n={structuredQuery:{}},r=e.path;let i;e.collectionGroup!==null?(i=r,n.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(i=r.popLast(),n.structuredQuery.from=[{collectionId:r.lastSegment()}]),n.parent=function(c,u){return Ti(c.databaseId,u)}(t,i);const s=function(c){if(c.length!==0)return ra(tr.create(c,"and"))}(e.filters);s&&(n.structuredQuery.where=s);const o=function(c){if(c.length!==0)return c.map(u=>function(h){return{field:wt(h.field),direction:Ch(h.dir)}}(u))}(e.orderBy);o&&(n.structuredQuery.orderBy=o);const a=function(c,u){return c.useProto3Json||Xd(u)?u:{value:u}}(t,e.limit);return a!==null&&(n.structuredQuery.limit=a),e.startAt&&(n.structuredQuery.startAt=function(c){return{before:c.inclusive,values:c.position}}(e.startAt)),e.endAt&&(n.structuredQuery.endAt=function(c){return{before:!c.inclusive,values:c.position}}(e.endAt)),{B:n,parent:i}}function Ch(t){return wh[t]}function xh(t){return Eh[t]}function Lh(t){return Ph[t]}function wt(t){return{fieldPath:t.canonicalString()}}function ra(t){return t instanceof Ue?function(n){if(n.op==="=="){if(gs(n.value))return{unaryFilter:{field:wt(n.field),op:"IS_NAN"}};if(ms(n.value))return{unaryFilter:{field:wt(n.field),op:"IS_NULL"}}}else if(n.op==="!="){if(gs(n.value))return{unaryFilter:{field:wt(n.field),op:"IS_NOT_NAN"}};if(ms(n.value))return{unaryFilter:{field:wt(n.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:wt(n.field),op:xh(n.op),value:n.value}}}(t):t instanceof tr?function(n){const r=n.getFilters().map(i=>ra(i));return r.length===1?r[0]:{compositeFilter:{op:Lh(n.op),filters:r}}}(t):ie()}function Vh(t){const e=[];return t.fields.forEach(n=>e.push(n.canonicalString())),{fieldPaths:e}}function ia(t){return t.length>=4&&t.get(0)==="projects"&&t.get(2)==="databases"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vi(t){return new Rh(t,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bh extends class{}{constructor(e,n,r,i){super(),this.authCredentials=e,this.appCheckCredentials=n,this.connection=r,this.serializer=i,this.Y=!1}Z(){if(this.Y)throw new L(Lt,"The client has already been terminated.")}P(e,n,r,i){return this.Z(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,o])=>this.connection.P(e,Yr(n,r),i,s,o)).catch(s=>{throw s.name==="FirebaseError"?(s.code===Fr&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),s):new L(Qt,s.toString())})}g(e,n,r,i,s){return this.Z(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,a])=>this.connection.g(e,Yr(n,r),i,o,a,s)).catch(o=>{throw o.name==="FirebaseError"?(o.code===Fr&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new L(Qt,o.toString())})}terminate(){this.Y=!0,this.connection.terminate()}}async function Fh(t,e){const n=er(t),r={writes:e.map(i=>Mh(n.serializer,i))};await n.P("Commit",n.serializer.databaseId,he.emptyPath(),r)}async function Uh(t,e){const n=er(t),{B:r,parent:i}=Nh(n.serializer,mh(e));return(await n.g("RunQuery",n.serializer.databaseId,i,{structuredQuery:r.structuredQuery})).filter(s=>!!s.document).map(s=>function(a,l,c){const u=Oh(a,l.name),d=vs(l.updateTime),h=l.createTime?vs(l.createTime):me.min(),m=new xe({mapValue:{fields:l.fields}}),g=Ze.newFoundDocument(u,d,h,m);return c?g.setHasCommittedMutations():g}(n.serializer,s.document,void 0))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const en=new Map;function sa(t){if(t._terminated)throw new L(Lt,"The client has already been terminated.");if(!en.has(t)){Fn("ComponentProvider","Initializing Datastore");const e=function(s){return new eh(s,fetch.bind(null))}(function(s,o,a,l){return new qd(s,o,a,l.host,l.ssl,l.experimentalForceLongPolling,l.experimentalAutoDetectLongPolling,zo(l.experimentalLongPollingOptions),l.useFetchStreams)}(t._databaseId,t.app.options.appId||"",t._persistenceKey,t._freezeSettings())),n=vi(t._databaseId),r=function(s,o,a,l){return new Bh(s,o,a,l)}(t._authCredentials,t._appCheckCredentials,e,n);en.set(t,r)}return en.get(t)}class As{constructor(e){var n,r;if(e.host===void 0){if(e.ssl!==void 0)throw new L(U,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(n=e.ssl)===null||n===void 0||n;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new L(U,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}(function(s,o,a,l){if(o===!0&&l===!0)throw new L(U,`${s} and ${a} cannot be used together.`)})("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=zo((r=e.experimentalLongPollingOptions)!==null&&r!==void 0?r:{}),function(s){if(s.timeoutSeconds!==void 0){if(isNaN(s.timeoutSeconds))throw new L(U,`invalid long polling timeout: ${s.timeoutSeconds} (must not be NaN)`);if(s.timeoutSeconds<5)throw new L(U,`invalid long polling timeout: ${s.timeoutSeconds} (minimum allowed value is 5)`);if(s.timeoutSeconds>30)throw new L(U,`invalid long polling timeout: ${s.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(r,i){return r.timeoutSeconds===i.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class ir{constructor(e,n,r,i){this._authCredentials=e,this._appCheckCredentials=n,this._databaseId=r,this._app=i,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new As({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new L(Lt,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new L(Lt,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new As(e),e.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new Yd;switch(r.type){case"firstParty":return new Hd(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new L(U,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(n){const r=en.get(n);r&&(Fn("ComponentProvider","Removing Datastore"),en.delete(n),r.terminate())}(this),Promise.resolve()}}function Gh(t,e){const n=typeof t=="object"?t:ao(),r=typeof t=="string"?t:e||"(default)",i=ii(n,"firestore/lite").getImmediate({identifier:r});if(!i._initialized){const s=ll("firestore");s&&Yh(i,...s)}return i}function Yh(t,e,n,r={}){var i;const s=(t=_i(t,ir))._getSettings(),o=`${e}:${n}`;if(s.host!=="firestore.googleapis.com"&&s.host!==o&&$o("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),t._setSettings(Object.assign(Object.assign({},s),{host:o,ssl:!1})),r.mockUserToken){let a,l;if(typeof r.mockUserToken=="string")a=r.mockUserToken,l=ve.MOCK_USER;else{a=ul(r.mockUserToken,(i=t._app)===null||i===void 0?void 0:i.options.projectId);const c=r.mockUserToken.sub||r.mockUserToken.user_id;if(!c)throw new L(U,"mockUserToken must contain 'sub' or 'user_id' field!");l=new ve(c)}t._authCredentials=new jd(new Ho(a,l))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sr{constructor(e,n,r){this.converter=n,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new sr(this.firestore,e,this._query)}}class De{constructor(e,n,r){this.converter=n,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new lt(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new De(this.firestore,e,this._key)}}class lt extends sr{constructor(e,n,r){super(e,n,function(s){return new fh(s)}(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new De(this.firestore,null,new ye(e))}withConverter(e){return new lt(this.firestore,e,this._path)}}function jh(t,e,...n){if(t=pe(t),Wo("collection","path",e),t instanceof ir){const r=he.fromString(e,...n);return cs(r),new lt(t,null,r)}{if(!(t instanceof De||t instanceof lt))throw new L(U,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=t._path.child(he.fromString(e,...n));return cs(r),new lt(t.firestore,null,r)}}function $h(t,e,...n){if(t=pe(t),arguments.length===1&&(e=nh.newId()),Wo("doc","path",e),t instanceof ir){const r=he.fromString(e,...n);return ls(r),new De(t,null,new ye(r))}{if(!(t instanceof De||t instanceof lt))throw new L(U,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=t._path.child(he.fromString(e,...n));return ls(r),new De(t.firestore,t instanceof lt?t.converter:null,new ye(r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vt{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Vt(ze.fromBase64String(e))}catch(n){throw new L(U,"Failed to construct data from Base64 string: "+n)}}static fromUint8Array(e){return new Vt(ze.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class or{constructor(...e){for(let n=0;n<e.length;++n)if(e[n].length===0)throw new L(U,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Ae(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bi{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ai{constructor(e,n){if(!isFinite(e)||e<-90||e>90)throw new L(U,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(n)||n<-180||n>180)throw new L(U,"Longitude must be a number between -180 and 180, but was: "+n);this._lat=e,this._long=n}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return ce(this._lat,e._lat)||ce(this._long,e._long)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 */class Ii{constructor(e){this._values=(e||[]).map(n=>n)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(r,i){if(r.length!==i.length)return!1;for(let s=0;s<r.length;++s)if(r[s]!==i[s])return!1;return!0}(this._values,e._values)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kh=/^__.*__$/;class oa{constructor(e,n,r){this.data=e,this.fieldMask=n,this.fieldTransforms=r}toMutation(e,n){return new na(e,this.data,this.fieldMask,n,this.fieldTransforms)}}function aa(t){switch(t){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw ie()}}class Si{constructor(e,n,r,i,s,o){this.settings=e,this.databaseId=n,this.serializer=r,this.ignoreUndefinedProperties=i,s===void 0&&this.tt(),this.fieldTransforms=s||[],this.fieldMask=o||[]}get path(){return this.settings.path}get et(){return this.settings.et}rt(e){return new Si(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}nt(e){var n;const r=(n=this.path)===null||n===void 0?void 0:n.child(e),i=this.rt({path:r,it:!1});return i.st(e),i}ot(e){var n;const r=(n=this.path)===null||n===void 0?void 0:n.child(e),i=this.rt({path:r,it:!1});return i.tt(),i}ut(e){return this.rt({path:void 0,it:!0})}_t(e){return $n(e,this.settings.methodName,this.settings.ct||!1,this.path,this.settings.lt)}contains(e){return this.fieldMask.find(n=>e.isPrefixOf(n))!==void 0||this.fieldTransforms.find(n=>e.isPrefixOf(n.field))!==void 0}tt(){if(this.path)for(let e=0;e<this.path.length;e++)this.st(this.path.get(e))}st(e){if(e.length===0)throw this._t("Document fields must not be empty");if(aa(this.et)&&Kh.test(e))throw this._t('Document fields cannot begin and end with "__"')}}class Hh{constructor(e,n,r){this.databaseId=e,this.ignoreUndefinedProperties=n,this.serializer=r||vi(e)}ht(e,n,r,i=!1){return new Si({et:e,methodName:n,lt:r,path:Ae.emptyPath(),it:!1,ct:i},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Wh(t){const e=t._freezeSettings(),n=vi(t._databaseId);return new Hh(t._databaseId,!!e.ignoreUndefinedProperties,n)}class ar extends bi{_toFieldTransform(e){if(e.et!==2)throw e.et===1?e._t(`${this._methodName}() can only appear at the top level of your update data`):e._t(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof ar}}function zh(t,e,n,r){const i=t.ht(1,e,n);ca("Data must be an object, but it was:",i,r);const s=[],o=xe.empty();_n(r,(l,c)=>{const u=wi(e,l,n);c=pe(c);const d=i.ot(u);if(c instanceof ar)s.push(u);else{const h=lr(c,d);h!=null&&(s.push(u),o.set(u,h))}});const a=new hn(s);return new oa(o,a,i.fieldTransforms)}function qh(t,e,n,r,i,s){const o=t.ht(1,e,n),a=[Is(e,r,n)],l=[i];if(s.length%2!=0)throw new L(U,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let h=0;h<s.length;h+=2)a.push(Is(e,s[h])),l.push(s[h+1]);const c=[],u=xe.empty();for(let h=a.length-1;h>=0;--h)if(!Xh(c,a[h])){const m=a[h];let g=l[h];g=pe(g);const y=o.ot(m);if(g instanceof ar)c.push(m);else{const T=lr(g,y);T!=null&&(c.push(m),u.set(m,T))}}const d=new hn(c);return new oa(u,d,o.fieldTransforms)}function lr(t,e){if(la(t=pe(t)))return ca("Unsupported field value:",e,t),Jh(t,e);if(t instanceof bi)return function(r,i){if(!aa(i.et))throw i._t(`${r._methodName}() can only be used with update() and set()`);if(!i.path)throw i._t(`${r._methodName}() is not currently supported inside arrays`);const s=r._toFieldTransform(i);s&&i.fieldTransforms.push(s)}(t,e),null;if(t===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),t instanceof Array){if(e.settings.it&&e.et!==4)throw e._t("Nested arrays are not supported");return function(r,i){const s=[];let o=0;for(const a of r){let l=lr(a,i.ut(o));l==null&&(l={nullValue:"NULL_VALUE"}),s.push(l),o++}return{arrayValue:{values:s}}}(t,e)}return function(r,i){if((r=pe(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return yh(i.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const s=Pe.fromDate(r);return{timestampValue:Gr(i.serializer,s)}}if(r instanceof Pe){const s=new Pe(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:Gr(i.serializer,s)}}if(r instanceof Ai)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof Vt)return{bytesValue:kh(i.serializer,r._byteString)};if(r instanceof De){const s=i.databaseId,o=r.firestore._databaseId;if(!o.isEqual(s))throw i._t(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${s.projectId}/${s.database}`);return{referenceValue:Ti(r.firestore._databaseId||i.databaseId,r._key.path)}}if(r instanceof Ii)return function(o,a){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:o.toArray().map(l=>{if(typeof l!="number")throw a._t("VectorValues must only contain numeric values.");return ta(a.serializer,l)})}}}}}}(r,i);throw i._t(`Unsupported field value: ${yi(r)}`)}(t,e)}function Jh(t,e){const n={};return function(i){for(const s in i)if(Object.prototype.hasOwnProperty.call(i,s))return!1;return!0}(t)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):_n(t,(r,i)=>{const s=lr(i,e.nt(r));s!=null&&(n[r]=s)}),{mapValue:{fields:n}}}function la(t){return!(typeof t!="object"||t===null||t instanceof Array||t instanceof Date||t instanceof Pe||t instanceof Ai||t instanceof Vt||t instanceof De||t instanceof bi||t instanceof Ii)}function ca(t,e,n){if(!la(n)||!function(i){return typeof i=="object"&&i!==null&&(Object.getPrototypeOf(i)===Object.prototype||Object.getPrototypeOf(i)===null)}(n)){const r=yi(n);throw r==="an object"?e._t(t+" a custom object"):e._t(t+" "+r)}}function Is(t,e,n){if((e=pe(e))instanceof or)return e._internalPath;if(typeof e=="string")return wi(t,e);throw $n("Field path arguments must be of type string or ",t,!1,void 0,n)}const Qh=new RegExp("[~\\*/\\[\\]]");function wi(t,e,n){if(e.search(Qh)>=0)throw $n(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,t,!1,void 0,n);try{return new or(...e.split("."))._internalPath}catch{throw $n(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,t,!1,void 0,n)}}function $n(t,e,n,r,i){const s=r&&!r.isEmpty(),o=i!==void 0;let a=`Function ${e}() called with invalid data`;n&&(a+=" (via `toFirestore()`)"),a+=". ";let l="";return(s||o)&&(l+=" (found",s&&(l+=` in field ${r}`),o&&(l+=` in document ${i}`),l+=")"),new L(U,a+t+l)}function Xh(t,e){return t.some(n=>n.isEqual(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zh{constructor(e,n,r,i,s){this._firestore=e,this._userDataWriter=n,this._key=r,this._document=i,this._converter=s}get id(){return this._key.path.lastSegment()}get ref(){return new De(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new ua(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const n=this._document.data.field(tf("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n)}}}class ua extends Zh{data(){return super.data()}}class ef{constructor(e,n){this._docs=n,this.query=e}get docs(){return[...this._docs]}get size(){return this.docs.length}get empty(){return this.docs.length===0}forEach(e,n){this._docs.forEach(e,n)}}function tf(t,e){return typeof e=="string"?wi(t,e):e instanceof or?e._internalPath:e._delegate._internalPath}class nf extends class{convertValue(n,r="none"){switch(Tt(n)){case 0:return null;case 1:return n.booleanValue;case 2:return le(n.integerValue||n.doubleValue);case 3:return this.convertTimestamp(n.timestampValue);case 4:return this.convertServerTimestamp(n,r);case 5:return n.stringValue;case 6:return this.convertBytes(ln(n.bytesValue));case 7:return this.convertReference(n.referenceValue);case 8:return this.convertGeoPoint(n.geoPointValue);case 9:return this.convertArray(n.arrayValue,r);case 11:return this.convertObject(n.mapValue,r);case 10:return this.convertVectorValue(n.mapValue);default:throw ie()}}convertObject(n,r){return this.convertObjectMap(n.fields,r)}convertObjectMap(n,r="none"){const i={};return _n(n,(s,o)=>{i[s]=this.convertValue(o,r)}),i}convertVectorValue(n){var r,i,s;const o=(s=(i=(r=n.fields)===null||r===void 0?void 0:r.value.arrayValue)===null||i===void 0?void 0:i.values)===null||s===void 0?void 0:s.map(a=>le(a.doubleValue));return new Ii(o)}convertGeoPoint(n){return new Ai(le(n.latitude),le(n.longitude))}convertArray(n,r){return(n.values||[]).map(i=>this.convertValue(i,r))}convertServerTimestamp(n,r){switch(r){case"previous":const i=Qo(n);return i==null?null:this.convertValue(i,r);case"estimate":return this.convertTimestamp(cn(n));default:return null}}convertTimestamp(n){const r=_t(n);return new Pe(r.seconds,r.nanos)}convertDocumentKey(n,r){const i=he.fromString(n);ct(ia(i));const s=new on(i.get(1),i.get(3)),o=new ye(i.popFirst(5));return s.isEqual(r)||mi(`Document ${o} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${r.projectId}/${r.database}) instead.`),o}}{constructor(e){super(),this.firestore=e}convertBytes(e){return new Vt(e)}convertReference(e){const n=this.convertDocumentKey(e,this.firestore._databaseId);return new De(this.firestore,null,n)}}function rf(t){(function(i){if(i.limitType==="L"&&i.explicitOrderBy.length===0)throw new L(Ko,"limitToLast() queries require specifying at least one orderBy() clause")})((t=_i(t,sr))._query);const e=sa(t.firestore),n=new nf(t.firestore);return Uh(e,t._query).then(r=>{const i=r.map(s=>new ua(t.firestore,n,s.key,s,t.converter));return t._query.limitType==="L"&&i.reverse(),new ef(t,i)})}function sf(t,e,n,...r){const i=Wh((t=_i(t,De)).firestore);let s;return s=typeof(e=pe(e))=="string"||e instanceof or?qh(i,"updateDoc",t._key,e,n,r):zh(i,"updateDoc",t._key,e),Fh(sa(t.firestore),[s.toMutation(t._key,Zt.exists(!0))])}(function(){(function(n){Yt=n})(`${Ut}_lite`),Nt(new gt("firestore/lite",(e,{instanceIdentifier:n,options:r})=>{const i=e.getProvider("app").getImmediate(),s=new ir(new $d(e.getProvider("auth-internal")),new zd(e.getProvider("app-check-internal")),function(a,l){if(!Object.prototype.hasOwnProperty.apply(a.options,["projectId"]))throw new L(U,'"projectId" not provided in firebase.initializeApp.');return new on(a.options.projectId,l)}(i,n),i);return r&&s._setSettings(r),s},"PUBLIC").setMultipleInstances(!0)),at("firestore-lite","4.7.3",""),at("firestore-lite","4.7.3","esm2017")})();const da=Object.freeze({apiKey:"AIzaSyBdbve0H70D-Ch69WlaxEly7PVBFVRB5p0",authDomain:"pensiontools-4b237.firebaseapp.com",projectId:"pensiontools-4b237",storageBucket:"pensiontools-4b237.firebasestorage.app",messagingSenderId:"760877353696",appId:"1:760877353696:web:2d6f7173c8d7fab6fd9e85"});function of(){return da.apiKey!=="YOUR_API_KEY"}const af=3;function lf(t){const e=t&&typeof t=="object"?t.schemaVersion:void 0;return Number.isInteger(e)&&e>=0?e:0}const cf="6.22.0",ha="pots-and-valves",Kn={"pots-and-valves":[],"buckets-in-order":["bucketBand"],"bridge-and-engine":["bridgeAge","cashYears"],"ladder-and-ratchet":["ladderYears","drawAnnual","triggerMode","bandThreshold"],"floor-and-flex":["essentialsAnnual","horizonAge","sleeveRate","treatsRule","ratchet"],"floor-the-schedule":[],"floor-to-age":["floorToAge","borrowedFloor"],"full-il-gilt":["cashYears","bridgeCash"],"gilt-rotation":["cashYears","bridgeCash","rotateCutAge","rotateTrigger","rotateDisarmYears"]},uf=["sippTotal","isaTotal"],Ei=t=>Object.prototype.hasOwnProperty.call(Kn,t),Ss=t=>!!t&&typeof t=="object"&&!Array.isArray(t),fa=t=>{const e={};for(const[n,r]of Object.entries(t||{}))r!==void 0&&(e[n]=r);return e},df=t=>Array.isArray(t)?t.filter(Boolean).map(e=>fa(e)):[];function ws(t){return Ei(t)?Kn[t].slice():[]}function pa(t){return t===ha?ws(t):[...ws(t),...uf]}function hf(t,e){const n=e&&typeof e=="object"?e:{};if(!Ei(t))return fa(n);const r={};for(const i of pa(t))n[i]!==void 0&&(r[i]=n[i]);return r}function ff(t){return t.allocMode||(Array.isArray(t.taggedFunds)&&t.taggedFunds.length?"funds":"risk")}function pf(t){const e=t||{},n=e.strategyId||ha;if(!Ei(n)||Ss(e.strategyState)&&Object.keys(e.strategyState).length)return e;const r=Ss(e.strategyParams)?e.strategyParams:{},i=new Set(pa(n));if(!Object.keys(r).some(o=>r[o]!==void 0&&!i.has(o)))return e;const s={};for(const o of Object.keys(Kn))o===n||!Kn[o].some(a=>r[a]!==void 0)||(s[o]={strategyParams:hf(o,r),allocMode:ff(e),taggedFunds:df(e.taggedFunds),savedAt:null});return Object.keys(s).length?{...e,strategyState:s}:e}const Pi=1,mf=["typed","paste","imported","none"],gf=["fund","gilt","cash"];function ke(t){if(t===""||t==null)return null;const e=typeof t=="number"?t:+String(t).replace(/[£$€,\s]/g,"");return Number.isFinite(e)?e:null}const Sn=(t,{upper:e=!1}={})=>{const n=String(t??"").trim();return n?e?n.toUpperCase():n:null};function ma(t){const e=String(t??"").trim().slice(0,10);return/^\d{4}-\d{2}-\d{2}$/.test(e)?e:null}function cr(t){const e=String(t??"").trim().toUpperCase();return e==="ISA"||e==="LISA"||e==="S&S ISA"||e==="STOCKS AND SHARES ISA"?"ISA":e==="GIA"||e==="TAXABLE"||e==="DEALING"||e==="GENERAL"||e==="TRADING"?"GIA":e==="CASH"||e==="BANK"||e==="SAVINGS"?"CASH":"SIPP"}function yf(){return{version:Pi,updatedAt:null,source:"none",offerDismissed:!1,lines:[]}}function _f(t){const e=t&&typeof t=="object"?t:{},n=Sn(e.ticker,{upper:!0}),r=Sn(e.name),i=Sn(e.sedol,{upper:!0});if(!n&&!r&&!i)return null;const s=gf.includes(e.kind)?e.kind:null;return{wrapper:cr(e.wrapper),ticker:n,name:r,sedol:i,units:ke(e.units),value:ke(e.value),ocf:ke(e.ocf),contribution:ke(e.contribution),subClass:Sn(e.subClass),kind:s,asOf:ma(e.asOf)}}function jt(t){if(Array.isArray(t))return jt({lines:t});if(!t||typeof t!="object")return yf();const e=(Array.isArray(t.lines)?t.lines:[]).map(_f).filter(Boolean),n=mf.includes(t.source)?t.source:e.length?"typed":"none";return{version:Pi,updatedAt:ma(t.updatedAt),source:n,offerDismissed:t.offerDismissed===!0,lines:e}}function $t(t){return Array.isArray(t)?t:t&&typeof t=="object"&&Array.isArray(t.lines)?t.lines:[]}function Tf(t){const e=$t(t),n={SIPP:0,ISA:0,GIA:0,CASH:0};let r=0;for(const i of e){const s=ke(i&&i.value);s!=null&&(r+=s,n[cr(i.wrapper)]+=s)}return{count:e.length,total:r,byWrapper:n}}const X=t=>!!t&&typeof t=="object"&&!Array.isArray(t),vf=t=>{if(!X(t))return!1;const e=Object.getPrototypeOf(t);return e===Object.prototype||e===null};function Hn(t){if(Array.isArray(t))return t.map(Hn);if(vf(t)){const e={};for(const n of Object.keys(t))e[n]=Hn(t[n]);return e}return t}const bf=t=>{const e=t instanceof Date?t:new Date(t??Date.now());return Number.isFinite(e.getTime())?e.toISOString():new Date().toISOString()},ft=t=>{const e=JSON.stringify(t);return e===void 0?"undefined":e};function Af(t){const e=t&&X(t.decisionTool)?t.decisionTool:null;return e?X(e.settings)&&e.settings.locked||Array.isArray(e.history)&&e.history.length?!0:X(e.taxYears)&&Object.values(e.taxYears).some(n=>n&&n.yearSetupComplete):!1}function Ri(t){const e=t&&X(t.decisionTool)?t.decisionTool:null;return!!(e&&X(e.settings)&&e.settings.locked)}const If=2,Es=t=>ft(t&&X(t.stressTool)?t.stressTool.settings:void 0);function Ps(t){const e=t||{},n=X(e.decisionTool)?e.decisionTool:{},r={planDocument:ft(e.planDocument),planDocumentArchive:ft(e.planDocumentArchive),"decisionTool.planOfRecord":ft(n.planOfRecord),"decisionTool.planOfRecordArchive":ft(n.planOfRecordArchive),"decisionTool.history":ft(n.history)};return Af(e)&&(r["decisionTool.settings"]=ft(n.settings)),r}function Sf(t,{now:e}){if(!X(t.strategy)){const i=typeof t.createdAt=="string"&&t.createdAt?t.createdAt:typeof t.lastModified=="string"&&t.lastModified?t.lastModified:bf(e);t.strategy={id:"pots-and-valves",params:{},lockedAt:i,engineVersion:cf}}const n=X(t.stressTool)&&X(t.stressTool.settings)?t.stressTool.settings:null;if(n){for(const[s,o]of[["pacwMin","equityMin"],["cgtMin","bondMin"],["csh2Target","cashTarget"]])n[s]!==void 0&&n[o]===void 0&&(n[o]=n[s]);const i=pf(n);i!==n&&X(i.strategyState)&&(n.strategyState=Hn(i.strategyState))}const r=t.holdings;return(Array.isArray(r)||X(r)&&r.version!==Pi)&&(t.holdings={...X(r)?r:{},...jt(r)}),t}function wf(t){if(Ri(t))return t;const e=X(t.stressTool)&&X(t.stressTool.settings)?t.stressTool.settings:null;return e&&(Ba(e.chargesPct)||(e.chargesPct=qs)),t}function Ef(t){if(Ri(t))return t;const e=X(t.stressTool)&&X(t.stressTool.settings)?t.stressTool.settings:null;return e&&(Fa(e.isaGrowth)||(e.isaGrowth=Js),Pf(t,e)&&(e.isaBalance=0)),t}function Pf(t,e){const n=X(t.fromAnswer)&&Array.isArray(t.fromAnswer.people)&&X(t.fromAnswer.people[0])?t.fromAnswer.people[0]:null,r=n&&X(n.savings)?n.savings:null,i=r&&X(r.atStop)&&typeof r.atStop.middling=="number"?r.atStop.middling:NaN,s=X(e.potAtRetirement)?e.potAtRetirement:null;return!!r&&r.today===0&&i>0&&e.retired===!1&&!!s&&s.source==="override"&&s.isa===i&&e.isaBalance===i}const Rf=[{to:1,name:"Version stamp; strategy block, renamed Stress keys, per-strategy settings and holdings shape written once",up:Sf},{to:2,name:"Fund and platform charges: 0.5% a year written into every unlocked plan; locked plans untouched",up:wf},{to:3,name:'How ISAs and savings grow: "Mostly cash" written into every unlocked plan; locked plans untouched',up:Ef}];function kf(t,{now:e=new Date,migrations:n=Rf,target:r=af}={}){const i=lf(t),s={scenario:t,from:i,to:i,changed:!1,error:null,newer:!1};if(!X(t))return s;if(i>r)return{...s,newer:!0};if(i===r)return s;try{const o=Ps(t);let a=Hn(t),l=i;for(const d of n){if(!(d.to>l))continue;if(d.to!==l+1)throw new Error("Migration chain has a gap: no step from version "+l+" to "+(l+1));const h=d.to>=If&&Ri(a)?Es(a):null,m=d.up(a,{now:e});if(m!==void 0&&(a=m),!X(a))throw new Error("Migration to version "+d.to+" did not return a plan");if(h!==null&&Es(a)!==h)throw new Error("Migration to version "+d.to+" changed the Stress settings of a locked plan, which no migration may touch");if(a.schemaVersion=d.to,l=d.to,l===r)break}if(l!==r)throw new Error("Migration chain stops at version "+l+", short of "+r);const c=Object.keys(t).filter(d=>!(d in a));if(c.length)throw new Error("Migration dropped root key(s): "+c.join(", "));const u=Ps(a);for(const d of Object.keys(o))if(u[d]!==o[d])throw new Error("Migration changed "+d+", which no migration may touch");return{scenario:a,from:i,to:l,changed:!0,error:null,newer:!1}}catch(o){return{...s,error:o instanceof Error?o:new Error(String(o))}}}const Rs=["decisionSettings","stressSettings","name","description","taxYears"],Dn=t=>t&&typeof t=="object"&&!Array.isArray(t);function Df(t,e,n){const r=e.split(".");let i=t;for(let s=0;s<r.length-1;s++){const o=r[s];i[o]=Dn(i[o])?{...i[o]}:{},i=i[o]}i[r[r.length-1]]=n}function Of(t){if(!t||typeof t!="object")return{scenario:t,migrated:!1};const e=Object.keys(t).filter(l=>l.includes(".")),n=Rs.some(l=>l in t);if(!(e.length>0||n))return{scenario:t,migrated:!1};const i={};for(const[l,c]of Object.entries(t))!l.includes(".")&&!Rs.includes(l)&&(i[l]=c);for(const l of e)Df(i,l,t[l]);i.isActive=i.isActive??!1,i.enabledTools=i.enabledTools||["stress","decision"];const s=Dn(i.planDetails)?i.planDetails:{};i.planDetails={...s,name:s.name??t.name??"My Plan",description:s.description??t.description??""};const o=Dn(i.decisionTool)?i.decisionTool:{};i.decisionTool={...o,settings:o.settings??t.decisionSettings??{},history:o.history??[],taxYears:o.taxYears??t.taxYears??{}};const a=Dn(i.stressTool)?i.stressTool:{};return i.stressTool={...a,settings:a.settings??t.stressSettings??{}},{scenario:i,migrated:!0}}function Mf(t,{now:e}={}){const n=Of(t),r=kf(n.scenario,e===void 0?{}:{now:e});return{scenario:r.scenario,write:!r.error&&!r.newer&&(n.migrated||r.changed),from:r.from,to:r.to,newer:r.newer,error:r.error}}const Nf=180,Cf="pt_guest_minutes",xf=t=>{const e=parseFloat(t);return Number.isFinite(e)&&e>0?e:0},Lf=(t,e)=>{try{return t.getItem(e)}catch{return null}};function ga(t){return xf(Lf(t,Cf))}function ya(t){return t>=Nf}function $r(){return{equityMin:ue.EQUITY_MIN,bondMin:ue.BOND_MIN,cashTarget:ue.CASH_TARGET,duration:ue.DURATION_YEARS,baseSalary:ue.BASE_SALARY,other:0,statePension:12e3,statePensionYear:12,currentAge:null,currentAgeAsOf:null,retired:null,retireAge:null,firstTaxYear:null,potAtRetirement:null,pa:ge.PERSONAL_ALLOWANCE,brl:ge.BASIC_RATE_LIMIT,hrl:ge.HIGHER_RATE_LIMIT,taxMode:"inflates",protectionMult:Ve.PROTECTION_MULTIPLIER,consecutiveLimit:ue.CONSECUTIVE_LIMIT,disableProtection:!1,recoveryBuffer:ue.RECOVERY_BUFFER,hodlEnabled:Ve.HODL_ENABLED,hodlValue:Ve.HODL_VALUE,isaBalance:0,isaReturn:Rt.RETURN,isaMin:Rt.MIN,isaDrawdownStrategy:Rt.DRAWDOWN_STRATEGY}}function Vf(t){if(!t)return null;const e={january:0,jan:0,february:1,feb:1,march:2,mar:2,april:3,apr:3,may:4,june:5,jun:5,july:6,jul:6,august:7,aug:7,september:8,sep:8,sept:8,october:9,oct:9,november:10,nov:10,december:11,dec:11},n=t.trim().replace(/\s+/g," ");if(/^\d{4}-\d{2}-\d{2}$/.test(n)){const[i,s,o]=n.split("-").map(Number),a=new Date(i,s-1,o);if(!isNaN(a.getTime()))return a}if(/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(n)){const[i,s,o]=n.split("/").map(Number);return new Date(o,s-1,i)}if(/^\d{1,2}-\d{1,2}-\d{4}$/.test(n)){const[i,s,o]=n.split("-").map(Number);return new Date(o,s-1,i)}let r=n.match(/^(\d{1,2})\s+(\w+)\s+(\d{4})$/i);if(r){const i=parseInt(r[1]),s=e[r[2].toLowerCase()],o=parseInt(r[3]);if(s!==void 0)return new Date(o,s,i)}if(r=n.match(/^(\w+)\s+(\d{1,2})\s+(\d{4})$/i),r){const i=e[r[1].toLowerCase()],s=parseInt(r[2]),o=parseInt(r[3]);if(i!==void 0)return new Date(o,i,s)}if(r=n.match(/^(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})$/i),r){const i=e[r[1].toLowerCase()],s=parseInt(r[2]),o=parseInt(r[3]);if(i!==void 0)return new Date(o,i,s)}if(r=n.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+(\w+),?\s+(\d{4})$/i),r){const i=parseInt(r[1]),s=e[r[2].toLowerCase()],o=parseInt(r[3]);if(s!==void 0)return new Date(o,s,i)}return null}function wr(t,e,n="potMid"){if(!Array.isArray(t)||!t.length)return null;const r=Math.max(0,Math.min(t.length-1,e)),i=Math.floor(r),s=r-i,o=t[i],a=t[Math.min(t.length-1,i+1)];if(!o)return null;const l=o[n]??o.potMid,c=(a&&(a[n]??a.potMid))??l;return l+(c-l)*s}function Kr(t){const e={[At.SHARES]:0,[At.BONDS]:0,[At.DIVERSIFIERS]:0,[At.CASH]:0},n={},r=[],i=[];let s=0,o=0;const a=[];for(const l of t){const c=l.mix?{mix:l.mix}:l.ticker&&!l.subClass?Qa.find(u=>u.ticker===String(l.ticker).toUpperCase().trim()):null;if(c&&c.mix&&typeof c.mix=="object"){const u=Object.values(c.mix).reduce((d,h)=>d+(+h||0),0)||1;for(const[d,h]of Object.entries(c.mix))+h>0&&a.push({...l,subClass:d,value:(+l.value||0)*(+h/u),mixOf:l.ticker||null})}else a.push(l)}for(const l of a){const c=+l.value||0,u=l.subClass||(l.ticker?Xa[l.ticker]:void 0),d=u?qt[u]:null;if(!d){i.push({...l});continue}if(s+=c,r.push({...l,subClass:u,bucket:d.bucket,label:d.label}),(l.wrapper||"").toUpperCase()==="ISA"){o+=c;continue}e[d.bucket]+=c,n[u]=(n[u]||0)+c}return{buckets:e,subClassTotals:n,bondWeights:ks(n,At.BONDS),diversifierWeights:ks(n,At.DIVERSIFIERS),total:s,isaTotal:o,tagged:r,untagged:i}}function ks(t,e){const n=Object.entries(t).filter(([s])=>qt[s].bucket===e),r=n.reduce((s,[,o])=>s+o,0);if(r<=0)return{};const i={};for(const[s,o]of n)i[s]=o/r;return i}function Bf(t){const e=t||{};return(+e.equityMin||0)+(+e.bondMin||0)+(+e.cashTarget||0)+(+e.diversifierStart||0)}function Ff(t){const e=t||{},n=e.potAtRetirement,r={sipp:1,isa:1};if(!n||e.retired!==!1)return r;const i=Bf(e),s=+e.isaBalance||0;return+n.sipp>0&&i>0&&(r.sipp=+n.sipp/i),+n.isa>0&&s>0&&(r.isa=+n.isa/s),r}const Uf=24*3600*1e3;function Se(t){const e=t instanceof Date?t:new Date(t);return e.getMonth()>3||e.getMonth()===3&&e.getDate()>=6?e.getFullYear():e.getFullYear()-1}function W(t){return t+"/"+String(t+1).slice(2)}function ki(t){return String(t%100).padStart(2,"0")+"/"+String((t+1)%100).padStart(2,"0")}function Gf(t){const e=parseInt(String(t).split("/")[0],10);return Number.isFinite(e)?e<100?2e3+e:e:NaN}function Yf(t,e){let n;if(typeof t=="number")n=t;else if(t instanceof Date)n=Se(t);else if(typeof t=="string"&&t.includes("/"))n=Gf(t);else if(typeof t=="string"){const[r,i]=t.split("-").map(Number);n=i>=4?r:r-1}else return NaN;return n-+e}function _a(t){const e=/^(\d{4})-(\d{2})-(\d{2})$/.exec(typeof t=="string"?t.trim():"");return e?new Date(+e[1],+e[2]-1,+e[3]):new Date(t)}function Ta(t,e=new Date){const n=t||{},r=n.spStartDate?Vf(n.spStartDate):null;if(r)return{month:r.getMonth(),day:r.getDate(),source:"sp"};if(n.currentAgeAsOf){const i=_a(n.currentAgeAsOf);if(Number.isFinite(i.getTime()))return{month:i.getMonth(),day:i.getDate(),source:"asOf"}}return{month:e.getMonth(),day:e.getDate(),source:"today"}}function Ds(t,e,n){let r=0;for(let i=t.getFullYear();i<=e.getFullYear();i++){const s=new Date(i,n.month,n.day);s.getTime()>t.getTime()&&s.getTime()<=e.getTime()&&r++}return r}function ur(t,e,n=new Date){const r=t||{},i=Math.floor(+r.currentAge||0);if(!(i>0))return null;let s=r.currentAgeAsOf?_a(r.currentAgeAsOf):n;Number.isFinite(s.getTime())||(s=n);const o=Ta(r,n),a=e instanceof Date?e:new Date(e);return a.getTime()>=s.getTime()?i+Ds(s,a,o):i-Ds(a,s,o)}function Hr(t,e,n=new Date){return ur(t,new Date(e+1,3,5),n)}function Wn(t,e,n=new Date){const r=Se(n),i=Hr(t,r,n);return i==null?null:r+(Math.round(+e)-i)}function Wr(t,e=new Date){const n=new Date(+t,3,6);return Math.max(0,Math.round((n.getTime()-e.getTime())/(30.44*Uf)))}function va(t,e=new Date){const[n,r]=String(t||"").split("-").map(Number);return!Number.isFinite(n)||!Number.isFinite(r)?0:Math.max(0,(n-e.getFullYear())*12+(r-1-e.getMonth()))}function jf(t,e,n=new Date){const r=t||{},i=ur(r,n,n);if(i==null)return null;const s=Ta(r,n);return(new Date(n.getFullYear(),s.month,s.day).getTime()>n.getTime()?n.getFullYear():n.getFullYear()+1)+(Math.round(+e)-(i+1))+"-"+String(s.month+1).padStart(2,"0")}function ba(t,e=null,n=new Date){const r=t||{};if(typeof r.retired=="boolean"&&+r.firstTaxYear>0||!(+r.currentAge>0))return r;const i=Se(n),s=+r.shapeAgeNow||57,a=Wn(r,s,n)>i+1,l=r.retired===!0?!0:r.retired===!1||a?!1:e&&typeof e.retired=="boolean"?e.retired:!0;let c=+r.firstTaxYear>0?+r.firstTaxYear:l?i+1:Wn(r,+r.retireAge||s,n);return!(+r.firstTaxYear>0)&&!(c>=i)&&(c=i+1),{...r,firstTaxYear:c,retired:l,retireAge:l?null:+r.retireAge||s}}function $f(t){return t.getFullYear()+"-"+String(t.getMonth()+1).padStart(2,"0")+"-"+String(t.getDate()).padStart(2,"0")}const Kf=["firstTaxYear","retired","retireAge","currentAgeAsOf","legacyFirstTaxYear"];function Hf(t,e=null,n=new Date){const r=ba(t,e,n);return+r.currentAge>0?r.currentAgeAsOf?r:{...r,currentAgeAsOf:$f(n)}:+r.firstTaxYear>0||+r.legacyFirstTaxYear>0?r:{...r,legacyFirstTaxYear:n.getFullYear()+1}}function Aa(t,e=new Date){const n=ba(t||{},null,e),r=Se(e),i={currentAge:null,retireAge:null,potScale:{sipp:1,isa:1},startOptions:[r,r+1]};if(!(+n.currentAge>0)){const l=+n.firstTaxYear>0?+n.firstTaxYear:+n.legacyFirstTaxYear>0?+n.legacyFirstTaxYear:e.getFullYear()+1;return{...i,mode:"legacy",firstTaxYear:l,shapeAgeNow:+n.shapeAgeNow||57,yearsToStart:Math.max(0,l-r),startMonth:l+"-04",bridgeMonths:Wr(l,e)}}const s=ur(n,e,e);if(n.retired===!1&&+n.retireAge>0){let l=Wn(n,+n.retireAge,e);l>=r||(l=r);const c=Hr(n,l,e),u=jf(n,+n.retireAge,e);return{...i,mode:"future",firstTaxYear:l,shapeAgeNow:c,currentAge:s,retireAge:+n.retireAge,yearsToStart:l-r,startMonth:u,bridgeMonths:va(u,e),potScale:Ff(n)}}const o=+n.firstTaxYear>0?+n.firstTaxYear:r+1,a=o+"-04";return{...i,mode:"retired",firstTaxYear:o,shapeAgeNow:Hr(n,o,e),currentAge:s,yearsToStart:Math.max(0,o-r),startMonth:a,bridgeMonths:Wr(o,e)}}function Wf(t,{locked:e=!1,hasRecords:n=!1,now:r=new Date}={}){if(e||n)return null;const i=t||{},s=Se(r),o=+i.currentAge>0;let a=0,l="retired";return o&&i.retired===!1&&+i.retireAge>0?(l="future",a=Wn(i,+i.retireAge,r)||0):+i.firstTaxYear>0?(a=+i.firstTaxYear,o||(l="legacy")):!o&&+i.legacyFirstTaxYear>0&&(l="legacy",a=+i.legacyFirstTaxYear),!(a>0)||a>=s||+i.staleDraftDismissedFor===a?null:{savedYear:a,savedLabel:W(a),suggestedYear:s,suggestedLabel:W(s),mode:l}}const zf=Object.freeze({stress:Object.freeze([...Kf,"staleDraftDismissedFor"]),decision:Object.freeze([])}),qf=Object.freeze(["locked","unlockedAt","unlockCount"]),Jf=Object.freeze(["targetSchedule","spendingProfile","spendingMigratedFrom"]),ut=t=>!!t&&typeof t=="object"&&!Array.isArray(t);function Bt(t){return!!(ut(t)&&t.locked)}function zr(t){return Array.isArray(t)?t.map(zr):ut(t)?Object.keys(t).sort().reduce((e,n)=>(t[n]!==void 0&&(e[n]=zr(t[n])),e),{}):t}const Ft=t=>t===void 0?"<absent>":JSON.stringify(zr(t));function Qf(t,e){const n=ut(t)?t:{},r=ut(e)?e:{};return[...new Set([...Object.keys(n),...Object.keys(r)])].filter(s=>Ft(n[s])!==Ft(r[s])).sort()}function Xf(t,e){if(!ut(t)||!ut(e)||t.spendingProfile!=="declining"||e.spendingProfile!=="flat"||e.spendingMigratedFrom!=="declining")return!1;const n=t.targetSchedule,r=Array.isArray(n)&&n.length?n.map((i,s)=>Math.round((+i||0)*Za(s,"declining"))):n;return Ft(r)===Ft(e.targetSchedule)}function Zf(t,e){return!Bt(t)||!ut(e)||Bt(e)?!1:!!e.unlockedAt&&(+e.unlockCount||0)>(+t.unlockCount||0)}function ep(t,e,n){const r=new Set(zf[t]||[]);return t==="decision"&&Zf(e,n)&&qf.forEach(i=>r.add(i)),t==="decision"&&Xf(e,n)&&Jf.forEach(i=>r.add(i)),r}function Os(t,{locked:e,stored:n,next:r}){const i=ep(t,n,r),s=Qf(n,r).filter(o=>!i.has(o));return s.length?s:null}const tp=["stressTool","decisionTool","strategy"],np=/^(?:stressTool|decisionTool|strategy)$|^(?:stressTool|decisionTool)\.settings(?:\.|$)|^strategy\./;function rp(t){return!!t&&typeof t=="object"&&Object.keys(t).some(e=>np.test(e))}function ip(t,e){var r,i;const n=JSON.parse(JSON.stringify({stressTool:t==null?void 0:t.stressTool,decisionTool:t==null?void 0:t.decisionTool,strategy:t==null?void 0:t.strategy}));for(const[s,o]of Object.entries(e||{})){const a=s.split(".");if(!tp.includes(a[0]))continue;let l=n;for(let c=0;c<a.length-1;c++)ut(l[a[c]])||(l[a[c]]={}),l=l[a[c]];l[a[a.length-1]]=o}return{stress:(r=n.stressTool)==null?void 0:r.settings,decision:(i=n.decisionTool)==null?void 0:i.settings,strategy:n.strategy}}function sp(t,e,n){var a,l;const r={stress:(a=t==null?void 0:t.stressTool)==null?void 0:a.settings,decision:(l=t==null?void 0:t.decisionTool)==null?void 0:l.settings,strategy:t==null?void 0:t.strategy};if(!Bt(r.decision)||!rp(e))return null;const i=ip(t,e),s=c=>c===void 0?n:c,o=[...(Os("stress",{locked:!0,stored:s(r.stress),next:s(i.stress)})||[]).map(c=>"stress."+c),...(Os("decision",{locked:!0,stored:r.decision,next:i.decision})||[]).map(c=>"decision."+c),...Ft(r.strategy)!==Ft(i.strategy)?["strategy"]:[]];return o.length?o:null}const Ms=.025,vt=3;function be(t){if(t instanceof Date)return Number.isFinite(t.getTime())?{y:t.getFullYear(),m:t.getMonth()+1}:null;if(t&&typeof t=="object")return Number.isInteger(t.y)&&t.m>=1&&t.m<=12?{y:t.y,m:t.m}:null;const e=/^(\d{4})-(\d{2})/.exec(String(t??""));return e&&+e[2]>=1&&+e[2]<=12?{y:+e[1],m:+e[2]}:null}const qr=(t,e)=>e.y*12+e.m-(t.y*12+t.m),pt=t=>t?t.y+"-"+String(t.m).padStart(2,"0"):null,$e=t=>typeof t=="number"&&Number.isFinite(t);function Ia(t){const e=t&&t.accumulation;return!e||typeof e!="object"?null:e.version===vt?vt:2}function Sa(t){const e=t||{},n=e.accumulation||{};return n.version===vt&&be(n.asOf)?{at:be(n.asOf),from:"asOf"}:be(e.createdAt)?{at:be(e.createdAt),from:"createdAt"}:be(e.lockedAt)?{at:be(e.lockedAt),from:"lockedAt"}:{at:null,from:null}}function op(t,e){const n=Sa(t).at,r=be(e);if(Ia(t)===vt||!n||!r)return{factor:1,cpi:null,months:n&&r?qr(n,r):0,start:n};const i=qr(n,r);return{factor:Math.pow(1+Ms,i/12),cpi:Ms,months:i,start:n}}function ap(t){const e=t&&t.accumulation;return!!(e&&e.version===vt&&((+e.isaNow||0)>0||(+e.isaMonthly||0)>0))}function lp(t,e){const n=t.length,r=Math.max(0,Math.min(n-1,e/12)),i=Math.floor(r),s=r-i,o=t[i],a=t[Math.min(n-1,i+1)],l=c=>{const u=+o.nominal[c],d=+a.nominal[c];return u+(d-u)*s};return{low:l("careful"),expected:l("middling"),high:l("good")}}function cp(t,{at:e,pension:n=null,isa:r=null}={}){const i=t&&t.accumulation;if(!i)return null;const s=Ia(t),o=Array.isArray(i.path)?i.path:[],a=Sa(t).at,l=be(e),c=a&&l?Math.max(0,qr(a,l)):0,u=ap(t),d={version:s,start:pt(a),at:pt(l),months:c,pathMissing:!o.length,isaCounted:u,actual:null,pension:$e(n)?Math.round(n):null,isa:$e(r)?Math.round(r):null,compared:null,prices:null,expected:null,low:null,high:null,band:null,missing:[]};if(!o.length)return d;let h;if(s===vt)h=lp(o,c);else{const T=o[0].potMix!=null?"potMix":"potMid";h={expected:wr(o,c/12,T),low:wr(o,c/12,"potLow"),high:wr(o,c/12,"potHigh")}}if(d.expected=Math.round(h.expected),d.low=Math.round(h.low),d.high=Math.round(h.high),!$e(n))return d.missing.push("pension"),d;if(u&&!$e(r))return d.missing.push("isa"),d;const m=n+(u?r:0),g=op(t,l||a),y=m/g.factor;return d.actual=Math.round(m),d.compared=Math.round(y),d.prices={factor:g.factor,cpi:g.cpi,start:pt(g.start)},s===vt?d.band=Math.abs(h.high-h.low)<1?"start":y<h.low?"below p10":y<h.expected?"p10–p50":y<=h.high?"p50–p90":"above p90":d.band=y<h.low?"below the cautious line":y<h.expected?"below the locked path":y<=h.high?"on or above the locked path":"above the strong line",d}function up(t){if(!t||t.isa==null||!$e(+t.isa))return null;const e=+t.isa;return e===0&&t.isaEntered!==!0?null:e}function wa({accHistory:t=[],potsToday:e=null,holdingsPension:n=0,holdingsIsa:r=null,holdingsAsOf:i=null,today:s=new Date}={}){const o=(t||[]).filter(a=>a&&be(a.date)).slice().sort((a,l)=>String(a.date).localeCompare(String(l.date))).pop()||null;if(o){const a=$e(+o.sipp)&&o.sipp!=null?+o.sipp:$e(+o.total)?+o.total:null;return{source:"record",at:pt(be(o.date)),recordedAt:o.date,pension:a,isa:up(o)}}return e!=null&&$e(+e)?{source:"today",at:pt(be(s)),recordedAt:null,pension:+e,isa:null}:n>0?{source:"holdings",at:pt(be(i)||be(s)),recordedAt:i||null,pension:n,isa:$e(r)?r:null}:{source:null,at:pt(be(s)),recordedAt:null,pension:null,isa:null}}const dp=5,hp=Object.freeze({saving:{key:"saving",label:"Saving",chip:"saving",leads:["budget","accumulation"],readOnly:[],hidden:[],banner:{text:"You are saving. Set the income you will want (Budget), then check you are on course for it (Accumulation planner). The Stress tester can price the plan on the pots you will have at retirement.",btn:"Open the Accumulation planner",tab:"accumulation"}},approaching:{key:"approaching",label:"Approaching retirement",chip:"approaching",leads:["stress","strategies","accumulation"],readOnly:[],hidden:[],banner:{text:"Within five years of your plan start. Pick the strategy you will retire on and stress-test it — then lock the plan and start moving your holdings into it.",btn:"Open the Stress tester",tab:"stress"}},"committed-saving":{key:"committed-saving",label:"Committed, still saving",chip:"to go",leads:["accumulation"],readOnly:["stress","strategies"],hidden:[],banner:{text:"Your plan is locked and starts in {start}. Keep saving and buying the target portfolio; the Decision tool opens when the plan starts.",btn:"Open the plan document",tab:"decision",sub:"plandoc"}},bridge:{key:"bridge",label:"Retired — run-up to the plan's first tax year",chip:"run-up",leads:["decision"],readOnly:["stress","strategies"],hidden:["accumulation"],banner:{text:"Retired, drawing from your SIPP cash until the plan's first tax year, {start}. Record each month in the Decision tool; the ladder's rungs and the plan's tracks begin in {start}.",btn:"Open the Decision tool",tab:"decision"}},running:{key:"running",label:"Running the plan",chip:"running",leads:["decision"],readOnly:["stress","strategies"],hidden:["accumulation"],banner:null},"draft-retired":{key:"draft-retired",label:"Retired, designing the plan",chip:"retired",leads:["stress","strategies"],readOnly:[],hidden:["accumulation"],banner:{text:"You are retired and the plan is still a draft. Stress-test it, then lock it from the Stress tester's Settings page to write the plan document and start recording months.",btn:"Open the Stress tester",tab:"stress"}},unknown:{key:"unknown",label:"Getting started",chip:"",leads:["budget"],readOnly:[],hidden:[],banner:null}});function fp(t,e=new Date){var _,A,k,v;const n=t||{},r=((_=n.stressTool)==null?void 0:_.settings)||{},s=!!(((A=n.decisionTool)==null?void 0:A.settings)||{}).locked,o=Array.isArray((k=n.decisionTool)==null?void 0:k.history)?n.decisionTool.history:[],a=((v=n.decisionTool)==null?void 0:v.taxYears)||{},l=o.length>0||Object.values(a).some(D=>D&&D.yearSetupComplete),c=!!n.planDocument,u=Aa(r,e),d=Se(e),h=e.getFullYear()+"-"+String(e.getMonth()+1).padStart(2,"0"),m=u.mode==="future"&&u.startMonth?h<u.startMonth:u.firstTaxYear>d,g=u.mode==="future"&&u.startMonth?va(u.startMonth,e):Wr(u.firstTaxYear,e),y=[];let T;u.mode==="legacy"?(T=s?"running":"unknown",y.push("no age today in the Timing block")):u.mode==="future"?(s?T=m?"committed-saving":"running":T=u.yearsToStart>dp?"saving":"approaching",y.push("retiring at "+u.retireAge+" ("+W(u.firstTaxYear)+")")):(s?T=m?"bridge":"running":T="draft-retired",y.push("already retired; plan starts "+W(u.firstTaxYear))),s&&y.push("plan locked"+(c?" with a plan document":""));const P=hp[T],E=P.leads.slice(),p=P.hidden.slice();["approaching","committed-saving","bridge","draft-retired"].includes(T)&&E.push("transition");const f=W(u.firstTaxYear),I=P.banner?{...P.banner,text:P.banner.text.replace(/\{start\}/g,f)}:null;return{key:T,label:P.label,chip:pp(P,g,m),leads:E,readOnly:P.readOnly.slice(),hidden:p,banner:I,locked:s,retired:u.mode==="retired",timingMode:u.mode,firstTaxYear:u.firstTaxYear,startLabel:f,startMonth:u.startMonth||null,yearsToStart:u.yearsToStart,monthsToStart:g,beforeStart:m,hasRecords:l,hasDocument:c,reasons:y}}function pp(t,e,n){return t.key==="committed-saving"||t.key==="bridge"?!n||e<=0?t.chip:e>=24?Math.round(e/12)+" years to go":e+" month"+(e===1?"":"s")+" to go":t.chip}const mp=.025,Ce=t=>Number.isFinite(+t)?+t:0;function gp(t){const e=$t(t).filter(p=>p&&(Ce(p.value)>0||Ce(p.contribution)>0)),n=Kr(e.map(p=>({...p,value:Ce(p.value)}))),r={SIPP:0,ISA:0,GIA:0,CASH:0},i={shares:0,bonds:0,diversifiers:0,cash:0},s={};let o=0,a=0,l=0;for(const p of n.tagged){const f=Ce(p.value);if(!(f>0))continue;o+=f;const I=(p.wrapper||"SIPP").toUpperCase();r[I in r?I:"SIPP"]+=f,i[p.bucket]=(i[p.bucket]||0)+f,s[p.subClass]=(s[p.subClass]||0)+f,a+=f*(Ce(p.ocf)/100);const _=qt[p.subClass];l+=f*(_?Ce(_.nominalReturn):0)}const c={};for(const p of Object.keys(i))c[p]=o>0?i[p]/o:0;const u=Object.entries(s).map(([p,f])=>{var I,_;return{key:p,label:((I=qt[p])==null?void 0:I.label)||p,bucket:((_=qt[p])==null?void 0:_.bucket)||"shares",value:f,weight:o>0?f/o:0}}).sort((p,f)=>f.value-p.value),d=o>0?a/o:0,h=o>0?l/o:0,m=e.filter(p=>Ce(p.contribution)>0),g=Kr(m.map(p=>({...p,value:Ce(p.contribution)}))),y={shares:0,bonds:0,diversifiers:0,cash:0};let T=0;const P={SIPP:0,ISA:0,GIA:0,CASH:0};for(const p of g.tagged){const f=Ce(p.value);T+=f,y[p.bucket]=(y[p.bucket]||0)+f;const I=(p.wrapper||"SIPP").toUpperCase();P[I in P?I:"SIPP"]+=f}const E={};for(const p of Object.keys(y))E[p]=T>0?y[p]/T:0;return{total:o,byWrapper:r,buckets:c,bucketValues:i,subClasses:u,weightedOcf:d,expectedNominal:h,expectedReal:h-mp-d,contributions:{monthly:T,byBucket:E,byWrapper:P},untagged:n.untagged.map(p=>({ticker:p.ticker||"",name:p.name||"",value:Ce(p.value)}))}}function yp(t){return $t(t).reduce((e,n)=>e+(n&&(n.wrapper||"SIPP").toUpperCase()==="SIPP"?Ce(n.value):0),0)}const _p=["full-il-gilt","gilt-rotation","floor-the-schedule"],Tp=.04,vp=["pots-and-valves","buckets-in-order"],bp=["full-il-gilt","gilt-rotation"];function Ns(t,{planYear:e=0}={}){var h,m;const n=t||{},r=((h=n.strategy)==null?void 0:h.id)||"pots-and-valves",i=vp.includes(r),s=n.pots||{},o=s.isaPolicy==="hold",a=i||!o,l=(Array.isArray(n.timeline)?n.timeline:[]).filter(g=>g&&+g.y<=e).flatMap(g=>Array.isArray(g.lumpIn)?g.lumpIn:[]);let c=!1,u=!1;for(const g of l){const y=String(g.wrapper||"cash").toLowerCase(),T=+g.amount||0;y==="pension"||y==="sipp"||!(T>0)||(y==="isa"?c=!0:y==="gia"||o?u=!0:(c=!0,T>el.ISA_ALLOWANCE&&(u=!0)))}const d=(+s.isa||0)>0;return{strategyId:r,potsStrategy:i,isa:a&&(d||c),gia:(+s.gia||0)>0||u,diversifiers:i&&(+((m=s.allocation)==null?void 0:m.diversifierStart)||0)>0,isaLeftOut:!a&&d}}function Re(t){if(t instanceof Date)return Number.isFinite(t.getTime())?{y:t.getFullYear(),m:t.getMonth()+1}:null;if(t&&typeof t=="object")return Number.isInteger(t.y)&&t.m>=1&&t.m<=12?{y:t.y,m:t.m}:null;const e=/^(\d{4})-(\d{2})/.exec(String(t??""));return e?{y:+e[1],m:+e[2]}:null}const Di=(t,e)=>e.y*12+e.m-(t.y*12+t.m),Oi=(t,e)=>(t.m>=4?t.y:t.y-1)-e,Ea=t=>(t.m+8)%12;function Ap(t,e,n=null){var u,d;const r=+((u=t==null?void 0:t.assumptions)==null?void 0:u.cpiDecision)>0?+t.assumptions.cpiDecision:Tp,i=+((d=t==null?void 0:t.timing)==null?void 0:d.firstTaxYear),s=Re(e),o={factor:1,assumed:r,years:[]};if(!s||!Number.isFinite(i))return o;const a=Oi(s,i),l=Ea(s)/12,c=n&&typeof n=="object"?n:{};for(let h=0;h<=a;h++){const m=h<a?1:l;if(!(m>0))break;const g=ki(i+h),y=+(c[g]&&c[g].cpi)||0,T=y||r;o.factor*=Math.pow(1+T,m),o.years.push({taxYear:g,cpi:T,entered:!!y,share:m})}return o}function Ip(t){const e=(t||[]).filter(i=>i&&Re(i.date)).slice().sort((i,s)=>String(i.date).localeCompare(String(s.date)));if(!e.length)return null;const n=(i,s)=>["equity","bond","cash"].every(o=>Math.abs((+i[o]||0)-(+s[o]||0))<.5);let r=e.length-1;for(;r>0&&n(e[r-1],e[r])&&Di(Re(e[r-1].date),Re(e[r].date))===1;)r--;return{rec:e[r],idx:r,recs:e}}function tn(t,e){const n=$t(t).filter(i=>i&&cr(i.wrapper)===e&&ke(i.value)!=null);if(!n.length)return null;const r=t&&!Array.isArray(t)&&t.updatedAt||n.map(i=>i.asOf).filter(Boolean).sort().pop()||null;return{value:n.reduce((i,s)=>i+ke(s.value),0),asOf:r?String(r).slice(0,10):null}}function Sp(t){const e=tn(t,"SIPP");if(!e)return null;const n=$t(t).filter(r=>r&&cr(r.wrapper)==="SIPP"&&ke(r.value)!=null).map(r=>({...r,value:ke(r.value)}));return{value:gp(n).bucketValues.diversifiers||0,asOf:e.asOf}}function wp(t,{today:e,history:n,potsToday:r,holdings:i}){const s=f=>Ns(t,{planYear:Oi(f,+t.timing.firstTaxYear)});if(r!=null){const f=e.toISOString().slice(0,10),I=Re(e);return{source:"today",asOf:f,at:I,pension:Math.round(+r),parts:[{key:"all",value:+r,source:"today",asOf:f}],missing:[],measure:s(I),runUpMonthly:0}}const o=Ip(n),a=tn(i,"SIPP"),l=Ns(t).diversifiers,c=[],u=[];let d=null,h=null,m=null,g=null;const y=a&&a.value>0?Re(a.asOf):null,T=l&&a&&a.value>0&&(!o||y!=null&&Di(Re(o.rec.date),y)>=0);if(o&&!T){if(d="record",g=o.rec,m=String(g.date).slice(0,7),h=(+g.equity||0)+(+g.bond||0)+(+g.cash||0),l){const f=Sp(i);f?f.value>0&&u.push({key:"diversifiers",value:f.value,source:"holdings",asOf:f.asOf}):c.push("diversifiers")}}else a&&a.value>0&&(d="holdings",h=a.value,m=a.asOf);const P=Re(m)||Re(e),E=s(P);if(d==null)return{source:null,asOf:null,at:P,pension:null,parts:[],missing:["pension"],measure:E,runUpMonthly:0};const p=[{key:"pension",value:h,source:d,asOf:m},...u];if(E.isa){const f=tn(i,"ISA");f?p.push({key:"isa",value:f.value,source:"holdings",asOf:f.asOf}):c.push("isa")}if(E.gia){let f=null;if(g&&ke(g.gia)!=null)f={value:+g.gia,source:"record",asOf:m};else if(g){const I=o.recs.slice(0,o.idx).reverse().find(_=>ke(_.gia)!=null);I&&ke(I.giaBalanceAfter)!=null&&+I.giaBalanceAfter<=1&&(f={value:0,source:"record",asOf:m})}if(!f){const I=tn(i,"GIA");I&&(f={value:I.value,source:"holdings",asOf:I.asOf})}f?p.push({key:"gia",...f}):c.push("gia")}return{source:d,asOf:m,at:P,pension:Math.round(h),parts:p,missing:c,measure:E,runUpMonthly:g&&+g.sipp||0}}function Ep(t,e,n=0){const r=(h,m)=>Array.isArray(h)&&m<h.length&&Number.isFinite(+h[m])?+h[m]:null,i=Array.isArray(t==null?void 0:t.p50)?t.p50.length:0;if(!i)return{p10:null,p50:null,p90:null};const s=Math.min(Math.max(0,e),i-1),o=r(t.p50,s),a=r(t.p50,s+1);if(o==null)return{p10:null,p50:null,p90:null};const l=n>0&&a!=null,c=l?o+n*(a-o):o,u=l?(Math.sqrt(s+n)-Math.sqrt(s))/(Math.sqrt(s+1)-Math.sqrt(s)):0,d=h=>{const m=r(h,s);if(m==null)return null;const g=r(h,s+1);if(!l||g==null)return m+(c-o);const y=m-o,T=g-a;return c+y+u*(T-y)};return{p10:d(t.p10),p50:c,p90:d(t.p90)}}function Pp(t,e,{today:n,history:r,potsToday:i,holdings:s,taxYears:o}){var N,$,b;const a=+t.timing.firstTaxYear,l=wp(t,{today:n,history:r,potsToday:i,holdings:s}),c=Oi(l.at,a);if(t.timing.mode==="future"&&c<0)return null;const u=Math.max(0,c),d=c>=0?Ea(l.at)/12:0;let{p10:h,p50:m,p90:g}=Ep(e,u,d);const y=m;let T=null;const P=Math.max(0,+((N=t.assumptions)==null?void 0:N.bridgeCash)||0);if(c<0&&P>0){const w=Math.max(0,a*12+4-(l.at.y*12+l.at.m)),C=Math.round(+(($=t.timing)==null?void 0:$.bridgeMonths)||+((b=t.assumptions)==null?void 0:b.bridgeMonths)||0);let H,oe;if(C>0)H=P*Math.min(1,w/C),oe=P/C;else{const Z=Array.isArray(t.timeline)?t.timeline[0]:null;oe=l.runUpMonthly>0?l.runUpMonthly:Z?Math.max(0,((+Z.gross||0)-(+Z.sp||0)-(+Z.other||0))/12):0,H=Math.min(P,oe*w)}H>0&&(T={months:w,of:C>0?C:null,monthly:Math.round(oe),value:Math.round(H)},[h,m,g]=[h,m,g].map(Z=>Z==null?null:Z+H))}const E=l.missing.length?null:l.parts.reduce((w,C)=>w+C.value,0),p=Ap(t,l.at,o),f=E==null?null:E/p.factor,I=Array.isArray(e.p10)&&Array.isArray(e.p90)&&e.p10.length>1&&e.p10.every((w,C)=>Math.abs((e.p90[C]??w)-w)<1),_=bp.includes(l.measure.strategyId)||I;let A=null,k=null;f!=null&&m!=null&&(_?A="gilts-at-cost":h==null||g==null||Math.abs(m-h)<1?A=(h==null||g==null||Math.abs(g-h)<1)&&(c<0||c===0&&d===0)?"start":"not-open":(A="band",k=f<h?"below p10":f<m?"p10–p50":f<=g?"p50–p90":"above p90"));const v=Re(n),D=l.parts.filter(w=>w.source!=="today"&&Re(w.asOf)&&v&&Di(Re(w.asOf),v)>3).map(w=>({key:w.key,source:w.source,asOf:w.asOf})),S=w=>w==null?null:Math.round(w);return{actual:S(E),real:S(f),pension:l.pension,parts:l.parts.map(w=>({...w,value:Math.round(w.value)})),missing:l.missing,source:l.source,asOf:l.asOf,planYear:c,monthsIn:Math.round(d*12),prices:{factor:p.factor,assumed:p.assumed,years:p.years.length,entered:p.years.filter(w=>w.entered).length},p10:S(h),p50:S(m),p90:S(g),startP50:T?S(y):null,runUp:T,verdict:A,band:k,flat:I,isaLeftOut:l.measure.isaLeftOut,stale:D}}function Rp(t,{today:e=new Date,history:n=[],potsToday:r=null,ladderPos:i=null,accHistory:s=[],holdings:o=null,taxYears:a=null}={}){var N,$,b,w,C,H,oe,Z,Oe;if(!t||!t.timing)return null;const l=yp($t(o)),c=o&&!Array.isArray(o)&&o.updatedAt?o.updatedAt:null;let u=null;if(t.accumulation&&t.timing.mode==="future"){const z=tn(o,"ISA"),ee=wa({accHistory:s,potsToday:r,holdingsPension:l,holdingsIsa:z?z.value:null,holdingsAsOf:c,today:e}),ne=cp(t,{at:ee.at,pension:ee.pension,isa:ee.isa}),Je=new Date(+t.timing.firstTaxYear,3,6);u={monthsToGo:Math.max(0,Math.round((Je.getTime()-e.getTime())/(30.44*24*3600*1e3))),pathMissing:ne.pathMissing,version:ne.version,expected:ne.expected,low:ne.low,high:ne.high,actual:ne.pathMissing||ne.actual==null?ee.pension==null?null:Math.round(ee.pension):ne.actual,compared:ne.compared,pension:ne.pension,isa:ne.isa,isaCounted:ne.isaCounted,missing:ne.missing,prices:ne.prices,at:ne.at,start:ne.start,actualSource:ee.source,recordedAt:ee.source==="record"?ee.recordedAt:ee.source==="holdings"?c:null,band:ne.band,contributions:t.accumulation.totalMonthly||0,isaMonthly:t.accumulation.isaMonthly||0}}const d=+t.timing.firstTaxYear,h=Yf(e,d),m=h<0,g=Math.max(0,h),y=((N=t.timeline)==null?void 0:N.length)||(($=t.assumptions)==null?void 0:$.duration)||35,T=t.timing.shapeAgeNow+h,P=W(Se(e)),E=(t.steps||[]).slice().sort((z,ee)=>z.fromAge-ee.fromAge),p=E.filter(z=>{var ee;return z.fromAge<=Math.max(T,((ee=E[0])==null?void 0:ee.fromAge)??T)}).pop()||E[0]||null,f=E.find(z=>z.fromAge>(p?p.fromAge:T))||null,I=p?Math.round(Ua(E.map(z=>({fromAge:z.fromAge,amount:z.amount,decline:z.decline,glideToNext:z.glideToNext})),Math.max(T,p.fromAge),p.amount)):null,_=((b=t.timeline)==null?void 0:b[g])||null,A=String(Se(e)%100).padStart(2,"0")+"/"+String((Se(e)+1)%100).padStart(2,"0"),k=(n||[]).filter(z=>z&&z.taxYear===A),v=k.reduce((z,ee)=>z+(+ee.sipp||0)+(+ee.other||0)+(+ee.state||0),0),D=((H=(C=(w=t.strategy)==null?void 0:w.r)==null?void 0:C.cones)==null?void 0:H.wealth)||null,S=D?Pp(t,D,{today:e,history:n,potsToday:r,holdings:o,taxYears:a}):null;return{today:e.toISOString().slice(0,10),planYear:h,planYears:y,bridge:m,taxYear:P,age:T,planStart:W(d),step:p?{amount:I,from:p.fromAge,taxYear:p.taxYear,index:E.indexOf(p)+1,of:E.length,next:f?{fromAge:f.fromAge,amount:f.amount,taxYear:f.taxYear,yearsAway:f.fromAge-T}:null}:null,incomeThisYear:{recorded:k.length,drawn:Math.round(v),planned:_?_.gross:null,perMonth:_?Math.round(_.gross/12):null},pot:S,ladder:i?{phase:i.phase,instruction:i.instruction,monthly:i.monthly,source:i.source,verdict:((oe=i.cashCheck)==null?void 0:oe.verdict)||null}:null,contract:!!((Z=t.strategy)!=null&&Z.contract),strategyId:((Oe=t.strategy)==null?void 0:Oe.id)||"pots-and-valves",saving:u}}function kp(t){const e=t.getMonth(),n=t.getDate();return e>3||e===3&&n>=6?t.getFullYear():t.getFullYear()-1}function Dp(t,e){const n=new Date(t+1,3,6);if(e>=n)return 0;const r=new Date(t,3,6),i=e<r?r:e;return Math.max(1,Math.min(12,Math.round((n-i)/(30.44*24*3600*1e3))))}function Op(t,e={}){if(!t||!Array.isArray(t.years)||!t.years.length)return null;const n=e.today||new Date,r=kp(n),i=t.years,s=i[0].Y,o=i[i.length-1].Y,a=i.find(S=>S.Y===r)||null,l=r<s?"before":r>o?"after":"running",c=a?a.need:0,u=a?a.gross:0,d=Math.max(0,u-c),h=Dp(r,n),m=e.drawnThisYear||0,g=Math.max(0,c-m),y=h>0?g/h:0,T=[];for(const S of i){if(S.Y<=r)continue;(S.from==="cash"?!0:S.matures?new Date(S.matures)<=n:!1)&&T.push({Y:S.Y,age:S.age,amount:S.need,from:S.from,until:new Date(S.Y,3,6)})}const P=T.reduce((S,N)=>S+N.amount,0),E=(t.orders||[]).filter(S=>new Date(S.matures)>n).sort((S,N)=>S.matures.localeCompare(N.matures)),p=E.length?E[0]:null,f=p?{tidm:p.tidm,name:p.name,matures:p.matures,nominal:p.nominal,pays:p.pays,taxYears:p.taxYears||[],monthsAway:Math.round((new Date(p.matures)-n)/(30.44*24*3600*1e3)),sitsMonths:p.taxYears&&p.taxYears.length?Math.max(0,Math.round((new Date(p.taxYears[0],3,6)-new Date(p.matures))/(30.44*24*3600*1e3))):0}:null,I=g,_=I+P,A=e.cashBalance==null?null:e.cashBalance,k=A==null?null:{balance:A,shouldBeLiquid:I,parkedTotal:P,expectedTotal:_,diff:A-_,verdict:Math.abs(A-_)<Math.max(500,_*.02)?"as expected":A>_?"more cash than the plan needs — park the surplus":"less cash than the plan needs — check the last maturity landed"},v=i[0],D=l==="before"?{Y:v.Y,label:`${v.Y}/${String(v.Y+1).slice(2)}`,age:v.age,gross:v.gross,fromLadder:v.need,statePension:Math.max(0,v.gross-v.need),monthly:v.need/12,source:v.from,startsOn:new Date(v.Y,3,6),cashBucket:t.cash||0,cashYears:i.filter(S=>S.from==="cash").length}:null;return{taxYear:r,taxYearLabel:`${r}/${String(r+1).slice(2)}`,phase:l,upcoming:D,age:a?a.age:null,gross:u,statePension:d,fromLadder:c,source:a?a.from:null,sourceHeld:a?!!a.held:!1,monthsLeft:h,drawnThisYear:m,remaining:g,monthly:y,parked:T,parkedTotal:P,next:f,cashCheck:k,yearsLeft:Math.max(0,o-r),instruction:a?`Instruct the broker to pay ${Mp(y)} a month for the ${h} month${h===1?"":"s"} to 5 April ${r+1}.`:l==="before"?`The ladder starts in ${s}/${String(s+1).slice(2)}.`:"The ladder has paid its last year."}}function Mp(t){return"£"+Math.round(t).toLocaleString("en-GB")}function Cs(t,e=null){const n=t&&t.strategy&&t.strategy.r?t.strategy.r.plan:null;return!n||!Array.isArray(n.years)||!n.years.length||!Array.isArray(n.orders)||e&&t.strategy.id&&t.strategy.id!==e?null:n}const wn={gilts:[{name:"0 3/8% Treasury Gilt 2026",isin:"GB00BNNGP668",type:"conventional",coupon:.375,maturity:"2026-10-22",dmoDate:"2026-10-16",tidm:"T26A",cleanPrice:99.96,yield:null,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 1/8% Treasury Gilt 2027",isin:"GB00BL6C7720",type:"conventional",coupon:4.125,maturity:"2027-01-29",dmoDate:"2026-10-16",tidm:"T27A",cleanPrice:99.99,yield:.04185,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"3¾% Treasury Gilt 2027",isin:"GB00BPSNB460",type:"conventional",coupon:3.75,maturity:"2027-03-07",dmoDate:"2026-10-16",tidm:"TS27",cleanPrice:99.82,yield:.04257,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1¼% Treasury Gilt 2027",isin:"GB00BDRHNP05",type:"conventional",coupon:1.25,maturity:"2027-07-22",dmoDate:"2026-10-16",tidm:"TG27",cleanPrice:97.72,yield:.04361,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1¼% Index-linked Treasury Gilt 2027",isin:"GB00B128DH60",type:"il3",coupon:1.25,maturity:"2027-11-22",dmoDate:"2026-10-16",tidm:"T27",cleanPrice:101.77,yield:-.00353,yieldKind:"real",baseRpi:194.06667,indexRatio:2.16663},{name:"4¼% Treasury Gilt 2027",isin:"GB00B16NNR78",type:"conventional",coupon:4.25,maturity:"2027-12-07",dmoDate:"2026-10-16",tidm:"TR27",cleanPrice:99.69,yield:.04579,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Treasury Gilt 2028",isin:"GB00BMBL1G81",type:"conventional",coupon:.125,maturity:"2028-01-31",dmoDate:"2026-10-16",tidm:"TN28",cleanPrice:94.88,yield:.04283,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 3/8% Treasury Gilt 2028",isin:"GB00BSQNRC93",type:"conventional",coupon:4.375,maturity:"2028-03-07",dmoDate:"2026-10-16",tidm:"TE28",cleanPrice:99.58,yield:.04742,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4½% Treasury Gilt 2028",isin:"GB00BMF9LG83",type:"conventional",coupon:4.5,maturity:"2028-06-07",dmoDate:"2026-10-16",tidm:"TS28",cleanPrice:99.63,yield:.04789,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2028",isin:"GB00BZ1NTB69",type:"il3",coupon:.125,maturity:"2028-08-10",dmoDate:"2026-10-16",tidm:"T28",cleanPrice:99.83,yield:.00219,yieldKind:"real",baseRpi:279.23333,indexRatio:1.50581},{name:"1 5/8% Treasury Gilt 2028",isin:"GB00BFX0ZL78",type:"conventional",coupon:1.625,maturity:"2028-10-22",dmoDate:"2026-10-16",tidm:"TG28",cleanPrice:94.17,yield:.04741,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"6% Treasury Stock 2028",isin:"GB0002404191",type:"conventional",coupon:6,maturity:"2028-12-07",dmoDate:"2026-10-16",tidm:"TR28",cleanPrice:102.69,yield:.04718,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0½% Treasury Gilt 2029",isin:"GB00BLPK7227",type:"conventional",coupon:.5,maturity:"2029-01-31",dmoDate:"2026-10-16",tidm:"TG29",cleanPrice:90.98,yield:.04747,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2029",isin:"GB00B3Y1JG82",type:"il3",coupon:.125,maturity:"2029-03-22",dmoDate:"2026-10-16",tidm:"T29",cleanPrice:98.32,yield:.00826,yieldKind:"real",baseRpi:237.42,indexRatio:1.771},{name:"4% Treasury Gilt 2029",isin:"GB00BVP99566",type:"conventional",coupon:4,maturity:"2029-05-22",dmoDate:"2026-10-16",tidm:"T29K",cleanPrice:97.96,yield:.04902,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 1/8% Treasury Gilt 2029",isin:"GB00BQC82B83",type:"conventional",coupon:4.125,maturity:"2029-07-22",dmoDate:"2026-10-16",tidm:"TS29",cleanPrice:98.16,yield:.049,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 7/8% Treasury Gilt 2029",isin:"GB00BJMHB534",type:"conventional",coupon:.875,maturity:"2029-10-22",dmoDate:"2026-10-16",tidm:"TR29",cleanPrice:89.15,yield:.04836,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 3/8% Treasury Gilt 2030",isin:"GB00BSQNRD01",type:"conventional",coupon:4.375,maturity:"2030-03-07",dmoDate:"2026-10-16",tidm:"T30",cleanPrice:98.41,yield:.04948,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 5/8% Treasury Gilt 2030",isin:"GB00BWBR1P52",type:"conventional",coupon:4.625,maturity:"2030-05-22",dmoDate:"2026-10-16",tidm:"T30K",cleanPrice:99.08,yield:.04966,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 1/8% Index-linked Treasury Stock 2030",isin:"GB0008932666",type:"il8",coupon:4.125,maturity:"2030-07-22",dmoDate:"2026-10-16",tidm:"T30I",cleanPrice:342.35,yield:null,yieldKind:"real",baseRpi:135.1,indexRatio:null},{name:"0 3/8% Treasury Gilt 2030",isin:"GB00BL68HH02",type:"conventional",coupon:.375,maturity:"2030-10-22",dmoDate:"2026-10-16",tidm:"TG30",cleanPrice:84.04,yield:.04848,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4¾% Treasury Gilt 2030",isin:"GB00B24FF097",type:"conventional",coupon:4.75,maturity:"2030-12-07",dmoDate:"2026-10-16",tidm:"TR30",cleanPrice:99.7,yield:.04888,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 1/8% Treasury Gilt 2031",isin:"GB00BVP99673",type:"conventional",coupon:4.125,maturity:"2031-03-07",dmoDate:"2026-10-16",tidm:"T31H",cleanPrice:96.86,yield:.04989,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0¼% Treasury Gilt 2031",isin:"GB00BMGR2809",type:"conventional",coupon:.25,maturity:"2031-07-31",dmoDate:"2026-10-16",tidm:"TG31",cleanPrice:80.69,yield:.04871,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2031",isin:"GB00BNNGP551",type:"il3",coupon:.125,maturity:"2031-08-10",dmoDate:"2026-10-16",tidm:"TR31",cleanPrice:95.53,yield:.01083,yieldKind:"real",baseRpi:293.60323,indexRatio:1.43211},{name:"4% Treasury Gilt 2031",isin:"GB00BPSNBF73",type:"conventional",coupon:4,maturity:"2031-10-22",dmoDate:"2026-10-16",tidm:"T31",cleanPrice:95.82,yield:.05012,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1% Treasury Gilt 2032",isin:"GB00BM8Z2T38",type:"conventional",coupon:1,maturity:"2032-01-31",dmoDate:"2026-10-16",tidm:"TG32",cleanPrice:81.73,yield:.0503,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 5/8% Treasury Gilt 2032",isin:"GB00BWGDRG14",type:"conventional",coupon:4.625,maturity:"2032-03-07",dmoDate:"2026-10-16",tidm:"T32H",cleanPrice:98.27,yield:.05056,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4¼% Treasury Stock 2032",isin:"GB0004893086",type:"conventional",coupon:4.25,maturity:"2032-06-07",dmoDate:"2026-10-16",tidm:"TR32",cleanPrice:96.57,yield:.05014,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1¼% Index-linked Treasury Gilt 2032",isin:"GB00B3D4VD98",type:"il3",coupon:1.25,maturity:"2032-11-22",dmoDate:"2026-10-16",tidm:"T32",cleanPrice:99.38,yield:.01361,yieldKind:"real",baseRpi:217.13226,indexRatio:1.93647},{name:"3¼% Treasury Gilt 2033",isin:"GB00BMV7TC88",type:"conventional",coupon:3.25,maturity:"2033-01-31",dmoDate:"2026-10-16",tidm:"TR33",cleanPrice:90.35,yield:.05122,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 1/8% Treasury Gilt 2033",isin:"GB00BVP99780",type:"conventional",coupon:4.125,maturity:"2033-03-07",dmoDate:"2026-10-16",tidm:"T33H",cleanPrice:94.86,yield:.05141,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 7/8% Green Gilt 2033",isin:"GB00BM8Z2S21",type:"conventional",coupon:.875,maturity:"2033-07-31",dmoDate:"2026-10-16",tidm:"TG33",cleanPrice:76.03,yield:.0516,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0¾% Index-linked Treasury Gilt 2033",isin:"GB00BMF9LJ15",type:"il3",coupon:.75,maturity:"2033-11-22",dmoDate:"2026-10-16",tidm:"T33",cleanPrice:94.65,yield:.01554,yieldKind:"real",baseRpi:372.24,indexRatio:1.12957},{name:"4 5/8% Treasury Gilt 2034",isin:"GB00BPJJKN53",type:"conventional",coupon:4.625,maturity:"2034-01-31",dmoDate:"2026-10-16",tidm:"T34",cleanPrice:96.9,yield:.05205,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0¾% Index-linked Treasury Gilt 2034",isin:"GB00B46CGH68",type:"il3",coupon:.75,maturity:"2034-03-22",dmoDate:"2026-10-16",tidm:"TRTQ",cleanPrice:93.56,yield:.01682,yieldKind:"real",baseRpi:232.22903,indexRatio:1.81059},{name:"4¼% Treasury Gilt 2034",isin:"GB00BQC82C90",type:"conventional",coupon:4.25,maturity:"2034-07-31",dmoDate:"2026-10-16",tidm:"TS34",cleanPrice:94.12,yield:.05243,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4½% Treasury Gilt 2034",isin:"GB00B52WS153",type:"conventional",coupon:4.5,maturity:"2034-09-07",dmoDate:"2026-10-16",tidm:"TR34",cleanPrice:95.78,yield:.05223,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"2% Index-linked Treasury Stock 2035",isin:"GB0031790826",type:"il8",coupon:2,maturity:"2035-01-26",dmoDate:"2026-10-16",tidm:"T2IL",cleanPrice:241.88,yield:null,yieldKind:"real",baseRpi:173.6,indexRatio:null},{name:"4½% Treasury Gilt 2035",isin:"GB00BT7J0027",type:"conventional",coupon:4.5,maturity:"2035-03-07",dmoDate:"2026-10-16",tidm:"T35",cleanPrice:95.03,yield:.05308,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 5/8% Treasury Gilt 2035",isin:"GB00BMGR2916",type:"conventional",coupon:.625,maturity:"2035-07-31",dmoDate:"2026-10-16",tidm:"TG35",cleanPrice:67.83,yield:.05308,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1 1/8% Index-linked Treasury Gilt 2035",isin:"GB00BT7HZZ68",type:"il3",coupon:1.125,maturity:"2035-09-22",dmoDate:"2026-10-16",tidm:"TR35",cleanPrice:94.09,yield:.01854,yieldKind:"real",baseRpi:390.88065,indexRatio:1.0757},{name:"4¾% Treasury Gilt 2035",isin:"GB00BTXS1K06",type:"conventional",coupon:4.75,maturity:"2035-10-22",dmoDate:"2026-10-16",tidm:"T35V",cleanPrice:96.21,yield:.05354,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4¼% Treasury Stock 2036",isin:"GB0032452392",type:"conventional",coupon:4.25,maturity:"2036-03-07",dmoDate:"2026-10-16",tidm:"T4Q",cleanPrice:92.34,yield:.05365,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 7/8% Treasury Gilt 2036",isin:"GB00BWBR1N39",type:"conventional",coupon:4.875,maturity:"2036-07-31",dmoDate:"2026-10-16",tidm:"T36N",cleanPrice:96.45,yield:.05416,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2036",isin:"GB00BYZW3J87",type:"il3",coupon:.125,maturity:"2036-11-22",dmoDate:"2026-10-16",tidm:"TG36",cleanPrice:83.13,yield:.01985,yieldKind:"real",baseRpi:260.01935,indexRatio:1.61708},{name:"4 5/8% Green Gilt 2037",isin:"GB00BVP99905",type:"conventional",coupon:4.625,maturity:"2037-03-07",dmoDate:"2026-10-16",tidm:"T37H",cleanPrice:93.96,yield:.05464,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1¾% Treasury Gilt 2037",isin:"GB00BZB26Y51",type:"conventional",coupon:1.75,maturity:"2037-09-07",dmoDate:"2026-10-16",tidm:"TG37",cleanPrice:70.11,yield:.05492,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1 1/8% Index-linked Treasury Gilt 2037",isin:"GB00B1L6W962",type:"il3",coupon:1.125,maturity:"2037-11-22",dmoDate:"2026-10-16",tidm:"TR37",cleanPrice:90.73,yield:.02074,yieldKind:"real",baseRpi:202.24286,indexRatio:2.07904},{name:"3¾% Treasury Gilt 2038",isin:"GB00BQC4R999",type:"conventional",coupon:3.75,maturity:"2038-01-29",dmoDate:"2026-10-16",tidm:"TG38",cleanPrice:85.71,yield:.05537,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1¾% Index-linked Treasury Gilt 2038",isin:"GB00BMY62Z61",type:"il3",coupon:1.75,maturity:"2038-09-22",dmoDate:"2026-10-16",tidm:"T38",cleanPrice:95.955,yield:.02147,yieldKind:"real",baseRpi:397.6,indexRatio:1.05752},{name:"4¾% Treasury Stock 2038",isin:"GB00B00NY175",type:"conventional",coupon:4.75,maturity:"2038-12-07",dmoDate:"2026-10-16",tidm:"TR38",cleanPrice:93.46,yield:.0557,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1 1/8% Treasury Gilt 2039",isin:"GB00BLPK7334",type:"conventional",coupon:1.125,maturity:"2039-01-31",dmoDate:"2026-10-16",tidm:"TR39",cleanPrice:61.29,yield:.05574,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2039",isin:"GB00BLH38265",type:"il3",coupon:.125,maturity:"2039-03-22",dmoDate:"2026-10-16",tidm:"TG39",cleanPrice:77.27,yield:.02241,yieldKind:"real",baseRpi:296.72581,indexRatio:1.41704},{name:"4¼% Treasury Gilt 2039",isin:"GB00B3KJDS62",type:"conventional",coupon:4.25,maturity:"2039-09-07",dmoDate:"2026-10-16",tidm:"T39",cleanPrice:88.21,yield:.05618,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 3/8% Treasury Gilt 2040",isin:"GB00BQC82D08",type:"conventional",coupon:4.375,maturity:"2040-01-31",dmoDate:"2026-10-16",tidm:"TG40",cleanPrice:88.79,yield:.05658,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 5/8% Index-linked Treasury Gilt 2040",isin:"GB00B3LZBF68",type:"il3",coupon:.625,maturity:"2040-03-22",dmoDate:"2026-10-16",tidm:"TR40",cleanPrice:80.98,yield:.02289,yieldKind:"real",baseRpi:216.52258,indexRatio:1.94193},{name:"4¼% Treasury Gilt 2040",isin:"GB00B6460505",type:"conventional",coupon:4.25,maturity:"2040-12-07",dmoDate:"2026-10-16",tidm:"T40",cleanPrice:87.03,yield:.05666,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"5¼% Treasury Gilt 2041",isin:"GB00BVP99897",type:"conventional",coupon:5.25,maturity:"2041-01-31",dmoDate:"2026-10-16",tidm:"T41F",cleanPrice:96.38,yield:.057,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2041",isin:"GB00BGDYHF49",type:"il3",coupon:.125,maturity:"2041-08-10",dmoDate:"2026-10-16",tidm:"T41",cleanPrice:72.76,yield:.02319,yieldKind:"real",baseRpi:280.05484,indexRatio:1.50139},{name:"1¼ % Treasury Gilt 2041",isin:"GB00BJQWYH73",type:"conventional",coupon:1.25,maturity:"2041-10-22",dmoDate:"2026-10-16",tidm:"TG41",cleanPrice:55.98,yield:.05712,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 5/8% Index-linked Treasury Gilt 2042",isin:"GB00B3MYD345",type:"il3",coupon:.625,maturity:"2042-11-22",dmoDate:"2026-10-16",tidm:"T42A",cleanPrice:76.775,yield:.02382,yieldKind:"real",baseRpi:212.46452,indexRatio:1.97902},{name:"4½% Treasury Gilt 2042",isin:"GB00B1VWPJ53",type:"conventional",coupon:4.5,maturity:"2042-12-07",dmoDate:"2026-10-16",tidm:"T42",cleanPrice:87.63,yield:.05761,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4¾% Treasury Gilt 2043",isin:"GB00BPJJKP77",type:"conventional",coupon:4.75,maturity:"2043-10-22",dmoDate:"2026-10-16",tidm:"TR43",cleanPrice:89.32,yield:.05824,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"3¼% Treasury Gilt 2044",isin:"GB00B84Z9V04",type:"conventional",coupon:3.25,maturity:"2044-01-22",dmoDate:"2026-10-16",tidm:"TG44",cleanPrice:72.77,yield:.05842,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2044",isin:"GB00B7RN0G65",type:"il3",coupon:.125,maturity:"2044-03-22",dmoDate:"2026-10-16",tidm:"T44",cleanPrice:67.05,yield:.02476,yieldKind:"real",baseRpi:242.42258,indexRatio:1.73445},{name:"3½% Treasury Gilt 2045",isin:"GB00BN65R313",type:"conventional",coupon:3.5,maturity:"2045-01-22",dmoDate:"2026-10-16",tidm:"T45",cleanPrice:74.54,yield:.05856,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 5/8% Index-linked Treasury Gilt 2045",isin:"GB00BMF9LH90",type:"il3",coupon:.625,maturity:"2045-03-22",dmoDate:"2026-10-16",tidm:"TR45",cleanPrice:72.725,yield:.02493,yieldKind:"real",baseRpi:363.94,indexRatio:1.15533},{name:"0 7/8% Treasury Gilt 2046",isin:"GB00BNNGP775",type:"conventional",coupon:.875,maturity:"2046-01-31",dmoDate:"2026-10-16",tidm:"TG46",cleanPrice:43.22,yield:.0589,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2046",isin:"GB00BYMWG366",type:"il3",coupon:.125,maturity:"2046-03-22",dmoDate:"2026-10-16",tidm:"TR46",cleanPrice:63.525,yield:.02524,yieldKind:"real",baseRpi:257.79,indexRatio:1.63106},{name:"4¼% Treasury Gilt 2046",isin:"GB00B128DP45",type:"conventional",coupon:4.25,maturity:"2046-12-07",dmoDate:"2026-10-16",tidm:"T46",cleanPrice:81.92,yield:.05864,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1½% Treasury Gilt 2047",isin:"GB00BDCHBW80",type:"conventional",coupon:1.5,maturity:"2047-07-22",dmoDate:"2026-10-16",tidm:"TG47",cleanPrice:48.275,yield:.05911,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0¾% Index-linked Treasury Gilt 2047",isin:"GB00B24FFM16",type:"il3",coupon:.75,maturity:"2047-11-22",dmoDate:"2026-10-16",tidm:"T47",cleanPrice:71.575,yield:.02506,yieldKind:"real",baseRpi:207.76667,indexRatio:2.02377},{name:"0 1/8% Index-linked Treasury Gilt 2048",isin:"GB00BZ13DV40",type:"il3",coupon:.125,maturity:"2048-08-10",dmoDate:"2026-10-16",tidm:"TG48",cleanPrice:60.1,yield:.02527,yieldKind:"real",baseRpi:274.79333,indexRatio:1.53014},{name:"1¾% Treasury Gilt 2049",isin:"GB00BFWFPP71",type:"conventional",coupon:1.75,maturity:"2049-01-22",dmoDate:"2026-10-16",tidm:"TG49",cleanPrice:49.52,yield:.05909,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1 7/8% Index-linked Treasury Gilt 2049",isin:"GB00BT7J0134",type:"il3",coupon:1.875,maturity:"2049-09-22",dmoDate:"2026-10-16",tidm:"TR49",cleanPrice:89.32,yield:.02504,yieldKind:"real",baseRpi:391.95806,indexRatio:1.07274},{name:"4¼% Treasury Gilt 2049",isin:"GB00B39R3707",type:"conventional",coupon:4.25,maturity:"2049-12-07",dmoDate:"2026-10-16",tidm:"T49",cleanPrice:80.45,yield:.05878,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0½% Index-linked Treasury Gilt 2050",isin:"GB00B421JZ66",type:"il3",coupon:.5,maturity:"2050-03-22",dmoDate:"2026-10-16",tidm:"TR50",cleanPrice:64.425,yield:.02535,yieldKind:"real",baseRpi:213.4,indexRatio:1.97034},{name:"0 5/8% Treasury Gilt 2050",isin:"GB00BMBL1F74",type:"conventional",coupon:.625,maturity:"2050-10-22",dmoDate:"2026-10-16",tidm:"TG50",cleanPrice:33.18,yield:.05915,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2051",isin:"GB00BNNGP882",type:"il3",coupon:.125,maturity:"2051-03-22",dmoDate:"2026-10-16",tidm:"TG51",cleanPrice:56.57,yield:.02531,yieldKind:"real",baseRpi:294.11071,indexRatio:1.42964},{name:"1¼% Treasury Gilt 2051",isin:"GB00BLH38158",type:"conventional",coupon:1.25,maturity:"2051-07-31",dmoDate:"2026-10-16",tidm:"T51A",cleanPrice:40.07,yield:.05953,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0¼% Index-linked Treasury Gilt 2052",isin:"GB00B73ZYW09",type:"il3",coupon:.25,maturity:"2052-03-22",dmoDate:"2026-10-16",tidm:"TG52",cleanPrice:57.72,yield:.02525,yieldKind:"real",baseRpi:242.05,indexRatio:1.73712},{name:"3¾% Treasury Gilt 2052",isin:"GB00B6RNH572",type:"conventional",coupon:3.75,maturity:"2052-07-22",dmoDate:"2026-10-16",tidm:"T52",cleanPrice:72.6,yield:.05899,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1½% Green Gilt 2053",isin:"GB00BM8Z2V59",type:"conventional",coupon:1.5,maturity:"2053-07-31",dmoDate:"2026-10-16",tidm:"TG53",cleanPrice:41.405,yield:.05949,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"3¾% Treasury Gilt 2053",isin:"GB00BPCJD997",type:"conventional",coupon:3.75,maturity:"2053-10-22",dmoDate:"2026-10-16",tidm:"T53",cleanPrice:71.74,yield:.05928,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"4 3/8% Treasury Gilt 2054",isin:"GB00BPSNBB36",type:"conventional",coupon:4.375,maturity:"2054-07-31",dmoDate:"2026-10-16",tidm:"T54",cleanPrice:79.91,yield:.05931,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1 5/8% Treasury Gilt 2054",isin:"GB00BJLR0J16",type:"conventional",coupon:1.625,maturity:"2054-10-22",dmoDate:"2026-10-16",tidm:"TR54",cleanPrice:42.305,yield:.05913,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1¼% Index-linked Treasury Gilt 2054",isin:"GB00BPSNBG80",type:"il3",coupon:1.25,maturity:"2054-11-22",dmoDate:"2026-10-16",tidm:"TG54",cleanPrice:75.3,yield:.0249,yieldKind:"real",baseRpi:378.58065,indexRatio:1.11065},{name:"1¼% Index-linked Treasury Gilt 2055",isin:"GB00B0CNHZ09",type:"il3",coupon:1.25,maturity:"2055-11-22",dmoDate:"2026-10-16",tidm:"TR8F",cleanPrice:75.07,yield:.02469,yieldKind:"real",baseRpi:192.2,indexRatio:2.18767},{name:"4¼% Treasury Gilt 2055",isin:"GB00B06YGN05",type:"conventional",coupon:4.25,maturity:"2055-12-07",dmoDate:"2026-10-16",tidm:"TR4Q",cleanPrice:78.25,yield:.0589,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"5 3/8% Treasury Gilt 2056",isin:"GB00BT7J0241",type:"conventional",coupon:5.375,maturity:"2056-01-31",dmoDate:"2026-10-16",tidm:"T56",cleanPrice:93.81,yield:.05902,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-Linked Treasury Gilt 2056",isin:"GB00BYVP4K94",type:"il3",coupon:.125,maturity:"2056-11-22",dmoDate:"2026-10-16",tidm:"TR56",cleanPrice:51.325,yield:.02422,yieldKind:"real",baseRpi:264.88333,indexRatio:1.58738},{name:"1¾% Treasury Gilt 2057",isin:"GB00BD0XH204",type:"conventional",coupon:1.75,maturity:"2057-07-22",dmoDate:"2026-10-16",tidm:"TG57",cleanPrice:42.24,yield:.05878,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2058",isin:"GB00BP9DLZ64",type:"il3",coupon:.125,maturity:"2058-03-22",dmoDate:"2026-10-16",tidm:"T58",cleanPrice:50.415,yield:.02386,yieldKind:"real",baseRpi:255.8871,indexRatio:1.64319},{name:"4% Treasury Gilt 2060",isin:"GB00B54QLM75",type:"conventional",coupon:4,maturity:"2060-01-22",dmoDate:"2026-10-16",tidm:"TR60",cleanPrice:74.01,yield:.05847,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0½% Treasury Gilt 2061",isin:"GB00BMBL1D50",type:"conventional",coupon:.5,maturity:"2061-10-22",dmoDate:"2026-10-16",tidm:"TG61",cleanPrice:22.735,yield:.05568,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 3/8% Index-linked Treasury Gilt 2062",isin:"GB00B4PTCY75",type:"il3",coupon:.375,maturity:"2062-03-22",dmoDate:"2026-10-16",tidm:"T62",cleanPrice:53.73,yield:.02301,yieldKind:"real",baseRpi:235.82903,indexRatio:1.78295},{name:"4% Treasury Gilt 2063",isin:"GB00BMF9LF76",type:"conventional",coupon:4,maturity:"2063-10-22",dmoDate:"2026-10-16",tidm:"TR63",cleanPrice:73.37,yield:.05826,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"2½% Treasury Gilt 2065",isin:"GB00BYYMZX75",type:"conventional",coupon:2.5,maturity:"2065-07-22",dmoDate:"2026-10-16",tidm:"TG65",cleanPrice:50.49,yield:.0575,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2065",isin:"GB00BD9MZZ71",type:"il3",coupon:.125,maturity:"2065-11-22",dmoDate:"2026-10-16",tidm:"TR65",cleanPrice:46.085,yield:.02194,yieldKind:"real",baseRpi:260.43448,indexRatio:1.6145},{name:"0 1/8% Index-linked Treasury Gilt 2068",isin:"GB00BDX8CX86",type:"il3",coupon:.125,maturity:"2068-03-22",dmoDate:"2026-10-16",tidm:"T68",cleanPrice:45.19,yield:.0213,yieldKind:"real",baseRpi:249.7,indexRatio:1.6839},{name:"3½% Treasury Gilt 2068",isin:"GB00BBJNQY21",type:"conventional",coupon:3.5,maturity:"2068-07-22",dmoDate:"2026-10-16",tidm:"TR68",cleanPrice:65.64,yield:.05731,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"1 5/8% Treasury Gilt 2071",isin:"GB00BFMCN652",type:"conventional",coupon:1.625,maturity:"2071-10-22",dmoDate:"2026-10-16",tidm:"TG71",cleanPrice:36.37,yield:.05482,yieldKind:"nominal",baseRpi:null,indexRatio:null},{name:"0 1/8% Index-linked Treasury Gilt 2073",isin:"GB00BM8Z2W66",type:"il3",coupon:.125,maturity:"2073-03-22",dmoDate:"2026-10-16",tidm:"TG73",cleanPrice:47.6,yield:.018,yieldKind:"real",baseRpi:308.32,indexRatio:1.36375},{name:"1 1/8% Treasury Gilt 2073",isin:"GB00BLBDX619",type:"conventional",coupon:1.125,maturity:"2073-10-22",dmoDate:"2026-10-16",tidm:"TR73",cleanPrice:28.445,yield:.05297,yieldKind:"nominal",baseRpi:null,indexRatio:null}]},j=t=>Number.isFinite(+t)?+t:0,Ie=t=>String(t||"").toUpperCase().trim(),It=t=>"£"+Math.round(j(t)).toLocaleString("en-GB"),Np=t=>{const e=new Date(String(t).slice(0,10)+"T00:00:00Z");return Number.isNaN(e.getTime())?String(t):e.toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"})},Cp=.02,xp=new Set(["CSH2","CASH","MMF","XSTR","ERNS","ERNX"]),Lp=new Set((Array.isArray(wn==null?void 0:wn.gilts)?wn.gilts:[]).map(t=>Ie(t&&t.tidm)).filter(Boolean));function Vp(t){const e=Ie(t);return Lp.has(e)||/^T[RGNS]?\d{2}[A-Z]?$/.test(e)||/^GB00B/.test(e)}function Jr(t,e){var r,i;if(+(e==null?void 0:e.firstTaxYear)>0)return+e.firstTaxYear;if(+((r=t.timing)==null?void 0:r.firstTaxYear)>0)return+t.timing.firstTaxYear;if(+((i=t.assumptions)==null?void 0:i.firstTaxYear)>0)return+t.assumptions.firstTaxYear;const n=[...Array.isArray(e==null?void 0:e.cashYears)?e.cashYears.map(s=>+s.Y):[],...Array.isArray(e==null?void 0:e.orders)?e.orders.flatMap(s=>Array.isArray(s.taxYears)?s.taxYears.map(Number):[]):[]].filter(s=>s>2e3);return n.length?Math.min(...n):null}function xs(t,e=new Date){var o,a,l;const n=t||{},r=(a=(o=n.strategy)==null?void 0:o.r)==null?void 0:a.plan,i=Jr(n,r);if(!(i>0)||Se(e)<i)return!1;const s=(l=n.timing)==null?void 0:l.startMonth;return typeof s=="string"&&/^\d{4}-\d{2}$/.test(s)?e.getFullYear()+"-"+String(e.getMonth()+1).padStart(2,"0")>=s:!0}function Bp(t,{today:e=new Date,params:n=null,runUpMonthly:r=0}={}){var c,u,d,h,m,g,y,T,P,E,p,f,I;const i=t||{},s=(u=(c=i.strategy)==null?void 0:c.r)==null?void 0:u.plan,o=Se(e);if((d=i.strategy)!=null&&d.contract&&s&&Array.isArray(s.orders)){const _=Jr(i,s),A=xs(i,e),k=R=>({key:"gilt:"+Ie(R.tidm||R.sedol||R.name),wrapper:"SIPP",kind:"gilt",label:R.name,ticker:Ie(R.tidm),sedol:R.sedol||null,matures:R.matures||null,units:Math.round(j(R.nominal)),cost:Math.round(j(R.cost)),pays:Math.round(j(R.pays)),taxYears:Array.isArray(R.taxYears)?R.taxYears.slice():[],cleanPrice:j(R.cleanPrice)||null,indexRatio:j(R.indexRatio)||null}),v=s.orders.filter(R=>j(R.pays)>0),D=R=>{const ae=R.matures?Date.parse(R.matures):NaN;return Number.isFinite(ae)?ae<e.getTime():Array.isArray(R.taxYears)&&R.taxYears.length>0&&R.taxYears.every(bt=>+bt<o)},S=n&&n.borrowedFloor||((m=(h=i.strategy)==null?void 0:h.params)==null?void 0:m.borrowedFloor)||((g=i.rotation)==null?void 0:g.borrowedFloor)||null,N=new Set(S&&Array.isArray(S.tidms)?S.tidms.map(Ie).filter(Boolean):[]),$=R=>N.has(Ie(R.tidm)),b=v.filter(R=>!$(R)),w=b.filter(R=>!D(R)).map(k),C=b.filter(D).map(k),H=v.filter($).map(k),oe=!!S,Z=Array.isArray(s.cashYears)?s.cashYears:[],Oe=Z.filter(R=>+R.Y>=o).map(R=>+R.Y),z=Math.max(0,j(((y=i.assumptions)==null?void 0:y.bridgeCash)??((P=(T=i.strategy)==null?void 0:T.params)==null?void 0:P.bridgeCash))),ee=Z.reduce((R,ae)=>R+j(ae.cost),0),ne=ee>0?ee:Math.max(0,j(s.cash)-z);let Je=Math.round(ne),de={months:0,monthly:0,value:0};if(!A&&z>0){const R=Array.isArray(i.timeline)&&i.timeline[0]?i.timeline[0]:null,ae=j(r)>0?j(r):R?Math.max(0,(j(R.gross)-j(R.sp)-j(R.other))/12):0,bt=Date.UTC(_||o+1,3,6),Ht=Math.max(0,Math.round((bt-e.getTime())/(30.44*864e5)));de={months:Ht,monthly:Math.round(ae),value:Math.round(Math.min(z,ae*Ht))},Je+=de.value}A&&(Array.isArray(s.years)&&s.years.length?Je=Math.round(s.years.filter(R=>R.from==="cash"&&+R.Y>=o).reduce((R,ae)=>R+j(ae.need),0)):Z.length&&(Je=Math.round(ne*Oe.length/Z.length)));const Kt=[];de.value>0&&Kt.push({label:"Run-up: "+de.months+" month"+(de.months===1?"":"s")+" × "+It(de.monthly)+" until the ladder pays",amount:de.value});for(const R of Z){if(A&&+R.Y<o)continue;const ae=Array.isArray(i.timeline)?i.timeline.find(Ht=>Ht&&W(+R.Y)===Ht.taxYear):null,bt=ae&&j(ae.lump)>0?j(ae.lump):0;Kt.push({label:"Cash year "+W(+R.Y)+(bt>0?" ("+It(bt)+" of it paid by a lump sum expected that year)":""),amount:Math.round(j(R.cost))})}const gr={key:"cash:SIPP",wrapper:"SIPP",kind:"cash",label:"Money-market fund / cash (e.g. CSH2)",value:Je,runUp:de,breakdown:Kt,spending:A,yearsLeft:A?Oe:Z.map(R=>+R.Y),bridgeCash:Math.round(z)};let V="The ladder is bought in the SIPP. The ISA is "+(((E=i.pots)==null?void 0:E.isaPolicy)==="hold"?"held aside and not part of the ladder.":"drawn by its own policy and not part of the ladder.");return z>0&&!A&&(V+=de.value>0?" The run-up is paid from the same cash: "+de.months+" month"+(de.months===1?"":"s")+" at about "+It(de.monthly)+" are still to come, so "+It(de.value)+" of the "+It(z)+" set aside is in the target; the rest has been spent as designed.":" The "+It(z)+" of bridge cash for the run-up has been spent as designed, so it is no longer a target."),A&&(V+=" The plan is running (tax year "+W(o)+")"+(C.length?": "+C.length+" rung"+(C.length===1?" has":"s have")+" matured and paid, so "+(C.length===1?"it is":"they are")+" no longer targets":"")+"; the cash years' money is being spent as designed, so cash is reported, not diffed."),H.length&&(V+=" The rotation fired"+(S.soldAt?" on "+Np(S.soldAt):"")+": "+H.length+" rung"+(H.length===1?" was":"s were")+" sold and the proceeds bought the equity fund, so "+(H.length===1?"it is no longer a target":"they are no longer targets")+" and the fund is kept."),{kind:"ladder",lines:w,paid:C,sold:H,rotated:oe,cash:gr,running:A,thisTaxYear:o,firstTaxYear:_,note:V}}const a=Array.isArray(i.targetMix)&&i.targetMix.length?i.targetMix[0]:null,l=j((f=(p=i.pots)==null?void 0:p.potAtRetirement)==null?void 0:f.sipp)>0?j(i.pots.potAtRetirement.sipp):j((I=i.pots)==null?void 0:I.sipp);return a&&l>0?{kind:"buckets",lines:[{key:"bucket:shares",wrapper:"SIPP",kind:"bucket",bucket:"shares",label:"Shares (world tracker)",value:Math.round(l*a.equity/100),pct:a.equity},{key:"bucket:bonds",wrapper:"SIPP",kind:"bucket",bucket:"bonds",label:"Bonds (gilts / index-linked / global agg)",value:Math.round(l*a.bond/100),pct:a.bond},{key:"bucket:cash",wrapper:"SIPP",kind:"bucket",bucket:"cash",label:"Cash (money-market fund)",value:Math.round(l*a.cash/100),pct:a.cash}],paid:[],sold:[],rotated:!1,cash:null,running:xs(i,e),thisTaxYear:o,firstTaxYear:Jr(i,null),note:`A pot strategy: the target is a mix, not a list of funds. Any world tracker, gilt fund or money-market fund fills its bucket; the Stress tester's "Example funds" shows one way.`}:{kind:"none",lines:[],paid:[],sold:[],rotated:!1,cash:null,running:!1,thisTaxYear:o,firstTaxYear:null,note:"No plan document yet — lock the plan first."}}function Fp(t){const e=(t||[]).filter(r=>r&&(j(r.value)>0||j(r.units)>0)),n=Kr(e.map(r=>({...r,value:j(r.value)})));return e.map(r=>{const i=Ie(r.ticker),s=Vp(i)||r.kind==="gilt",o=xp.has(i)||Ie(r.wrapper)==="CASH"||r.kind==="cash"||r.subClass==="cash"||r.subClass==="moneyMarket",a=n.tagged.find(l=>l.ticker===r.ticker&&l.wrapper===r.wrapper&&Math.abs(j(l.value)-j(r.value))<1);return{ticker:i,name:r.name||"",sedol:r.sedol||null,wrapper:Ie(r.wrapper)||"SIPP",value:j(r.value),units:j(r.units)||null,gilt:s,cash:o,bucket:o?"cash":s?"bonds":a?a.bucket:r.subClass?"shares":null}})}function Up(t,e,{tolerance:n=Cp}={}){const r=Fp(t),i=r.filter(_=>_.wrapper==="SIPP"),s=_=>_.wrapper==="ISA"?"ISA — kept as it is":_.wrapper==="CASH"?"bank / savings cash — outside the pension, kept as it is":"taxable account — kept as it is",o=[],a=[],l=[],c=[],u=[],d=r.filter(_=>_.wrapper!=="SIPP").map(_=>({..._,why:s(_)}));let h=0,m=0,g=0,y=0,T=0,P=null;if(e.kind==="ladder"){const _=new Set,A=b=>{const w=String(b||"").match(/(20\d{2})/);if(w)return+w[1];const C=String(b||"").match(/^T[RGNS]?(\d{2})[A-Z]?$/i);return C?2e3+ +C[1]:null},k=(b,w)=>b.ticker&&w.ticker&&b.ticker===w.ticker||w.sedol&&(Ie(b.sedol)===Ie(w.sedol)||Ie(b.name).includes(Ie(w.sedol))),v=(b,w,C)=>b.ticker&&b.ticker.length>=3&&w.label&&Ie(w.label).includes(b.ticker)||C&&(A(b.name)===C||A(b.ticker)===C),D=[...e.paid||[],...e.sold||[],...e.lines],S=new Map,N=(b,w)=>{const C=i.filter(H=>!_.has(H)&&H.gilt&&w(H));C.forEach(H=>_.add(H)),S.set(b,C)};for(const b of D)N(b,w=>k(w,b));for(const b of D)if(!S.get(b).length){const w=A(b.matures)||A(b.label)||A(b.ticker);N(b,C=>v(C,b,w))}const $=b=>S.get(b)||[];for(const b of e.paid||[])for(const w of $(b))c.push({...w,key:"matured:"+(w.ticker||b.ticker),label:w.name||w.ticker||b.label,rung:b.label,why:"matured and paid"+(b.taxYears.length?" in "+b.taxYears.map(W).join(", "):"")+" — remove it from your record"});for(const b of e.sold||[])for(const w of $(b))u.push({...w,key:"sold:"+(w.ticker||b.ticker),label:w.name||w.ticker||b.label,rung:b.label,why:"sold by the rotation — remove it from your record"});for(const b of e.lines){const w=$(b),C=b.cleanPrice&&b.indexRatio?b.cleanPrice*b.indexRatio/100:b.units>0?b.cost/b.units:null,H=w.reduce((Z,Oe)=>Z+(Oe.units!=null?Oe.units:C?Oe.value/C:0),0),oe=b.units-H;h+=b.cost,m+=Math.min(b.cost,C?H*C:0),g++,b.units>0&&Math.abs(oe)<=n*b.units?l.push({...b,heldUnits:Math.round(H)}):oe>0?o.push({...b,units:Math.round(oe),amount:Math.round(C?oe*C:b.cost*(oe/b.units)),heldUnits:Math.round(H),why:"rung for "+b.taxYears.map(W).join(", ")}):a.push({...b,units:Math.round(-oe),amount:Math.round(C?-oe*C:0),heldUnits:Math.round(H),why:"more than the rung needs"})}y=i.filter(b=>b.cash).reduce((b,w)=>b+w.value,0),T=e.cash?e.cash.value:0,e.cash&&e.cash.spending?P={held:Math.round(y),target:Math.round(T),yearsLeft:Array.isArray(e.cash.yearsLeft)?e.cash.yearsLeft.slice():[]}:e.cash&&(h+=T,m+=Math.min(T,y),T>0&&g++,T>0&&y>=T*(1-n)?l.push({...e.cash,heldValue:Math.round(y),spare:Math.round(Math.max(0,y-T))}):T>y&&o.push({...e.cash,amount:Math.round(T-y),heldValue:Math.round(y),why:"the cash years"}));for(const b of i)!_.has(b)&&!b.cash&&(e.rotated&&!b.gilt?d.push({...b,why:"bought by the rotation — kept"}):a.push({key:"sell:"+(b.ticker||b.name),wrapper:"SIPP",kind:b.gilt?"gilt":"fund",label:b.name||b.ticker,ticker:b.ticker,amount:Math.round(b.value),units:b.units,why:"not in the plan — proceeds fund the ladder"}))}else if(e.kind==="buckets"){const _={shares:0,bonds:0,cash:0,diversifiers:0};for(const A of i)_[A.bucket||"shares"]+=A.value;y=_.cash;for(const A of e.lines){const k=_[A.bucket]||0,v=A.value-k;h+=A.value,m+=Math.min(A.value,k),A.value>0&&g++,A.bucket==="cash"&&(T=A.value),A.value>0&&Math.abs(v)<=n*A.value?l.push({...A,heldValue:Math.round(k)}):v>0?o.push({...A,amount:Math.round(v),heldValue:Math.round(k),why:"bring "+A.bucket+" up to "+A.pct+"% of the pot"}):(A.value>0||k>0)&&a.push({...A,amount:Math.round(-v),heldValue:Math.round(k),why:"bring "+A.bucket+" down to "+A.pct+"% of the pot"})}_.diversifiers>0&&a.push({key:"bucket:diversifiers",wrapper:"SIPP",kind:"bucket",bucket:"diversifiers",label:"Diversifiers",amount:Math.round(_.diversifiers),why:"not in the target mix"})}const E=o.reduce((_,A)=>_+j(A.amount),0),p=a.reduce((_,A)=>_+j(A.amount),0);let f=!1,I;return e.kind==="none"?I="no plan document to read against":o.length?I=o.length+" line"+(o.length===1?"":"s")+" still to buy":a.length?I=a.length+" line"+(a.length===1?"":"s")+" to sell":l.length<g?I=g-l.length+" target line"+(g-l.length===1?"":"s")+" not held":g===0?(f=!0,I=e.kind==="ladder"?"every rung has matured and paid — nothing left to hold":"the target is empty"):(f=!0,I=e.kind==="ladder"?"every rung the plan still needs is held"+(e.cash&&!e.cash.spending?", and the cash years are covered":""):"every bucket is within "+Math.round(n*100)+"% of its target"),{kind:e.kind,buy:o,sell:a,hold:l,keep:d,matured:c,sold:u,cashInfo:P,totals:{buyCost:Math.round(E),sellValue:Math.round(p),shortfall:Math.round(Math.max(0,E-p)),cashHeld:Math.round(y),cashTarget:Math.round(T)},progressPct:h>0?Math.round(100*m/h):f?100:0,complete:f,reason:I}}function Gp(t,e={}){const n=[...t.buy.map(s=>({...s,action:"buy"})),...t.sell.map(s=>({...s,action:"sell"}))],r=n.filter(s=>!e[s.key]),i=n.length-r.length;return{pct:n.length?Math.round(100*(t.progressPct/100*0+(n.length-r.length)/n.length)):100,held:t.progressPct,doneCount:i,total:n.length,next:r[0]||null}}function Yp(){return{settings:{equityMin:ue.EQUITY_MIN,bondMin:ue.BOND_MIN,cashTarget:ue.CASH_TARGET,duration:ue.DURATION_YEARS,baseSalary:ue.BASE_SALARY,other:0,statePension:12e3,statePensionYear:12,pa:ge.PERSONAL_ALLOWANCE,brl:ge.BASIC_RATE_LIMIT,hrl:ge.HIGHER_RATE_LIMIT,taxMode:"inflates",protectionMult:Ve.PROTECTION_MULTIPLIER,consecutiveLimit:ue.CONSECUTIVE_LIMIT,disableProtection:!1,hodlEnabled:Ve.HODL_ENABLED,hodlValue:Ve.HODL_VALUE,spendingProfile:"flat",equityGlideEnabled:!1,diversifierStart:0,taggedFunds:[]},lastModified:null,checksum:null}}function jp(t,e=new Date){const n={...Yp()};t.settings&&(n.settings={...n.settings,...t.settings},t.settings.pacwMin!==void 0&&t.settings.equityMin===void 0&&(n.settings.equityMin=t.settings.pacwMin),t.settings.cgtMin!==void 0&&t.settings.bondMin===void 0&&(n.settings.bondMin=t.settings.cgtMin),t.settings.csh2Target!==void 0&&t.settings.cashTarget===void 0&&(n.settings.cashTarget=t.settings.csh2Target),n.settings.hodlEnabled===void 0&&(n.settings.hodlEnabled=!1),n.settings.hodlValue===void 0&&(n.settings.hodlValue=25e3));const r=n.settings;if(r.spendingProfile==="declining"){const i=+r.shapeAgeNow||57,s=r.incomeShape==="phases"&&Array.isArray(r.incomeSteps)&&r.incomeSteps.length?r.incomeSteps:[{fromAge:i,amount:+r.baseSalary||0}];r.incomeShape="phases",r.incomeSteps=ja(s,i),r.shapeAgeNow=i,r.targetSchedule=$a(r,i),r.spendingProfile="flat",r.spendingMigratedFrom="declining"}return n.settings=Hf(n.settings,t.budget||null,e),n.lastModified=t.lastModified,n.checksum=t.checksum,n}const $p=t=>t===void 0?void 0:JSON.parse(JSON.stringify(t)),Kp=t=>!!(t&&t.decisionTool&&Bt(t.decisionTool.settings));function Hp(t){const e=t&&t.stressTool&&t.stressTool.settings;return e&&typeof e=="object"?$p(e):t&&!Kp(t)?{...$r(),chargesPct:qs,isaGrowth:Js}:$r()}function dr(t,{now:e=new Date}={}){const n=Hp(t),r=t&&t.budgetTool&&t.budgetTool.settings||Ga();return r&&Ya(r)&&+r.currentAge>(+n.currentAge||0)&&(n.currentAge=+r.currentAge,n.currentAgeAsOf=r.currentAgeAsOf||n.currentAgeAsOf||null),jp({settings:n,budget:r||null,lastModified:null,checksum:null},e).settings}function Wp(t,{now:e=new Date}={}){const n=t||{},r=dr(n,{now:e});return fp({...n,stressTool:{...n.stressTool||{},settings:r}},e)}function zp(t=new Date){return t.getFullYear()+"-"+String(t.getMonth()+1).padStart(2,"0")}function hr(t,e=500){return(Array.isArray(t&&t.decisionTool&&t.decisionTool.history)?t.decisionTool.history:[]).filter(r=>r&&typeof r=="object").slice().sort((r,i)=>String(r.date||"").localeCompare(String(i.date||""))).slice(-e)}function Pa(t,{now:e=new Date}={}){const n=t||{},r=n.planDocument||null,i=hr(n);let s=null;if(r&&r.strategy&&r.strategy.contract){const c=Cs(r,r.strategy.id||null);s=c?Op(c,{today:e}):null}const o=r&&r.accumulation&&Array.isArray(n.accumulationTool&&n.accumulationTool.history)?n.accumulationTool.history:[],a=jt(n.holdings),l=n.decisionTool&&n.decisionTool.taxYears||null;return{today:e,history:i,ladderPos:s,accHistory:o,holdings:a,taxYears:l,ladderInDocument:!!(r&&Cs(r,r.strategy&&r.strategy.id||null))}}function qp(t,{now:e=new Date}={}){const n=t&&t.planDocument;if(!n)return null;const{ladderInDocument:r,...i}=Pa(t,{now:e});return Rp(n,i)}function Jp(t,{now:e=new Date}={}){const n=t||{},r=n.planDocument||null;if(!r)return null;const i=dr(n,{now:e});let s=0;const o=ki(Se(e)),a=n.decisionTool&&n.decisionTool.taxYears&&n.decisionTool.taxYears[o];if(s=+(a&&a.expectedMonthly&&a.expectedMonthly.sipp&&a.expectedMonthly.sipp.gross)||0,!s){const m=hr(n),g=m.length?m[m.length-1]:null;s=g&&(+g.sippDraw||+g.sipp)||0}const l=Bp(r,{today:e,params:i.strategyParams||null,runUpMonthly:s}),c=jt(n.holdings),u=Up(c.lines||[],l),d=n.transition&&n.transition.done||{},h=Gp(u,d);return{target:l,diff:u,prog:h}}const Ls=Object.freeze({unknown:["plan","budget","hold","household"],saving:["saving","pot","plan","budget","lock","hold","household"],approaching:["plan","saving","pot","budget","lock","hold","move","household"],"committed-saving":["pot","where","plan","saving","budget","hold","move","household"],"draft-retired":["plan","budget","lock","hold","move","household"],bridge:["month","where","plan","hold","move","budget","household"],running:["month","where","plan","hold","move","budget","household"]}),Qp=Object.freeze(["pot","budget","lock","hold","move","household"]),Xp=Object.freeze(["month","where","plan","pot","saving","budget","lock","hold","move","household"]),Vs=Object.freeze(["draft-retired","bridge","running"]),Ra=Object.freeze(["saving","approaching","committed-saving"]),Zp=Object.freeze(["P.readonly","P.noAge","P.arrive","P.taxyear","P.month","P.idle","P.pot","P.working","P.recheck","P.stale","P.draft","P.approaching","P.saving"]),em=Object.freeze({plan:Object.freeze(["about"])});function tm(t,e){return ka(t,e).flatMap(n=>(em[n.id]||[]).map(r=>({id:r,under:n.id})))}function ka(t,{locked:e,linked:n,manyPlans:r}){return(Ls[t]||Ls.unknown).filter(s=>!(s==="lock"&&e)&&!(s==="household"&&!n&&!r)).map(s=>({id:s,optional:Qp.includes(s)&&!(s==="pot"&&t==="committed-saving")}))}const Y=t=>t==null||t===""||!Number.isFinite(+t)?null:+t,Xe=t=>Array.isArray(t)?t.filter(e=>e&&typeof e=="object"):[],we=(t,e)=>({k:t,v:Math.round(Y(e)||0),kind:"money"}),Me=(t,e)=>({k:t,v:Math.round(Y(e)||0),kind:"count"}),Er=(t,e)=>({k:t,v:Math.round((Y(e)||0)*100)/100,kind:"pct"}),Ne=(t,e)=>({k:t,v:!!e,kind:"yesNo"}),dt=(t,e)=>({k:t,v:String(e),kind:"choice"}),zt=(t,e)=>({k:t,v:String(e),kind:"text"}),nm=["January","February","March","April","May","June","July","August","September","October","November","December"],rm=t=>{const e=/^(\d{4})-(\d{2})-(\d{2})/.exec(String(t||""));return e&&+e[2]>=1&&+e[2]<=12?+e[3]+" "+nm[+e[2]-1]+" "+e[1]:String(t||"")},Pr=(t,e)=>zt(t,rm(e)),im=Object.freeze([{id:"inc.streams",keys:["stress.extraIncomes"],set:t=>Xe(t.extraIncomes).some(e=>Y(e.annual)>0),facts:t=>Xe(t.extraIncomes).filter(e=>Y(e.annual)>0).flatMap((e,n)=>[we("annual"+n,e.annual),Me("fromAge"+n,e.fromAge),Me("years"+n,e.years)])},{id:"inc.lump-sums",keys:["stress.windfalls","decision.windfalls"],set:t=>Xe(t.windfalls).some(e=>Y(e.amount)>0),facts:t=>Xe(t.windfalls).filter(e=>Y(e.amount)>0).flatMap((e,n)=>[we("amount"+n,e.amount),Me("atAge"+n,e.atAge??e.fromAge??e.age)])},{id:"inc.extra-spends",keys:["stress.extraWithdrawals"],set:t=>Xe(t.extraWithdrawals).some(e=>Y(e.amount)>0),facts:t=>Xe(t.extraWithdrawals).filter(e=>Y(e.amount)>0).flatMap((e,n)=>[we("amount"+n,e.amount),Me("atAge"+n,e.atAge??e.fromAge??e.age),Me("years"+n,e.years??1)])},{id:"inc.final-salary-rises",keys:["stress.dbIndexation"],set:t=>Y(t.dbAmount)>0&&!!t.dbIndexation&&t.dbIndexation!=="cpi",facts:t=>[dt("rises",t.dbIndexation||"cpi")]},{id:"inc.state-pension-old",keys:["stress.statePension","stress.statePensionYear","decision.statePension","decision.statePensionYear"],set:t=>!t.spStartDate&&Y(t.statePension)>0,facts:t=>[we("yearly",t.statePension),Me("fromYear",t.statePensionYear)]},{id:"tax.bands",keys:["stress.pa","stress.brl","stress.hrl"],set:t=>(Y(t.pa)??ge.PERSONAL_ALLOWANCE)!==ge.PERSONAL_ALLOWANCE||(Y(t.brl)??ge.BASIC_RATE_LIMIT)!==ge.BASIC_RATE_LIMIT||(Y(t.hrl)??ge.HIGHER_RATE_LIMIT)!==ge.HIGHER_RATE_LIMIT,facts:t=>[we("pa",t.pa??ge.PERSONAL_ALLOWANCE),we("brl",t.brl??ge.BASIC_RATE_LIMIT),we("hrl",t.hrl??ge.HIGHER_RATE_LIMIT)]},{id:"tax.mode",keys:["stress.taxMode"],set:t=>!!t.taxMode&&t.taxMode!=="inflates",facts:t=>[dt("mode",t.taxMode||"inflates")]},{id:"tax.tax-free-cash",keys:["stress.accessMethod","decision.accessMethod"],set:(t,e)=>!!(t.accessMethod||e.accessMethod)&&(t.accessMethod||e.accessMethod)!=="drawdown",facts:(t,e)=>[dt("how",t.accessMethod||e.accessMethod||"drawdown")]},{id:"tax.ufpls-years",keys:["stress.ufplsYears","stress.ufplsThenPcls","decision.ufplsYears","decision.ufplsThenPcls"],set:(t,e)=>Y(t.ufplsYears??e.ufplsYears)>0,facts:(t,e)=>[Me("years",t.ufplsYears??e.ufplsYears),Ne("thenRest",t.ufplsThenPcls??e.ufplsThenPcls)]},{id:"tax.band-fill",keys:["stress.bandFillRecycle","decision.bandFillRecycle"],set:(t,e)=>!!(t.bandFillRecycle??e.bandFillRecycle),facts:(t,e)=>[Ne("on",t.bandFillRecycle??e.bandFillRecycle)]},{id:"tax.bed-and-isa",keys:["stress.bedAndIsa","decision.bedAndIsa"],set:(t,e)=>!!(t.bedAndIsa??e.bedAndIsa),facts:(t,e)=>[Ne("on",t.bedAndIsa??e.bedAndIsa)]},{id:"tax.earnings",keys:["stress.relevantEarnings","decision.relevantEarnings"],set:(t,e)=>Y(t.relevantEarnings??e.relevantEarnings)>0,facts:(t,e)=>[we("yearly",t.relevantEarnings??e.relevantEarnings)]},{id:"prot.cuts",keys:["stress.consecutiveLimit","stress.protectionMult","stress.protectionEscalateMonths","stress.recoveryBuffer","stress.disableProtection","decision.consecutiveLimit","decision.protectionFactor","decision.protectionEscalateMonths","decision.recoveryBuffer","decision.disableProtection"],set:t=>!!t.disableProtection||(Y(t.consecutiveLimit)??ue.CONSECUTIVE_LIMIT)!==ue.CONSECUTIVE_LIMIT||(Y(t.protectionMult)??Ve.PROTECTION_MULTIPLIER)!==Ve.PROTECTION_MULTIPLIER||(Y(t.recoveryBuffer)??ue.RECOVERY_BUFFER)!==ue.RECOVERY_BUFFER||Y(t.protectionEscalateMonths)>0,facts:t=>[Ne("off",!!t.disableProtection),Me("after",t.consecutiveLimit??ue.CONSECUTIVE_LIMIT),Er("cutTo",(Y(t.protectionMult)??Ve.PROTECTION_MULTIPLIER)*100),Me("deeperAfter",t.protectionEscalateMonths??0),we("buffer",t.recoveryBuffer??ue.RECOVERY_BUFFER)]},{id:"prot.reserve",keys:["stress.hodlEnabled","stress.hodlValue"],set:t=>!!t.hodlEnabled,facts:t=>[Ne("on",!!t.hodlEnabled),we("amount",t.hodlValue??Ve.HODL_VALUE)]},{id:"pots.diversifiers",keys:["stress.diversifierStart","decision.diversifierStart"],set:t=>Y(t.diversifierStart)>0,facts:t=>[we("amount",t.diversifierStart)]},{id:"pots.bond-tent",keys:["stress.equityGlideEnabled","decision.equityGlideEnabled","stress.glideEndgame","decision.glideEndgame"],set:t=>!!t.equityGlideEnabled,facts:t=>[Ne("on",!!t.equityGlideEnabled),dt("endgame",t.glideEndgame||"hold")]},{id:"pots.isa-use",keys:["stress.isaDrawdownStrategy","decision.isaDrawdownStrategy"],set:t=>!!t.isaDrawdownStrategy&&t.isaDrawdownStrategy!==Rt.DRAWDOWN_STRATEGY,facts:t=>[dt("use",t.isaDrawdownStrategy||Rt.DRAWDOWN_STRATEGY)]},{id:"pots.isa-growth",keys:["stress.isaGrowth","stress.isaReturn","stress.isaMin","decision.isaReturn","decision.isaMin"],set:t=>t.isaGrowth==="invested"||Y(t.isaMin)>0,facts:t=>[dt("grows",t.isaGrowth==="invested"?"invested":t.isaGrowth==="cash"?"cash":"fixed"),Er("fixedRate",(Y(t.isaReturn)??Rt.RETURN)*100),we("floor",t.isaMin??0)]},{id:"pots.charges",keys:["stress.chargesPct"],set:t=>Y(t.chargesPct)!=null&&Y(t.chargesPct)!==.5,facts:t=>[Er("yearly",Y(t.chargesPct)??0)]},{id:"pots.funds-to-test",keys:["stress.taggedFunds","decision.taggedFunds","stress.subAsset","decision.subAsset"],set:t=>Xe(t.taggedFunds).some(e=>Y(e.value)>0),facts:t=>Xe(t.taggedFunds).filter(e=>Y(e.value)>0).flatMap((e,n)=>[zt("name"+n,e.name||e.ticker||""),we("value"+n,e.value)])},{id:"draw.cadence",keys:[],set:(t,e,n)=>{const r=n&&n.decisionTool&&(n.decisionTool.cadence||n.decisionTool.settings&&n.decisionTool.settings.cadence);return!!r&&r!=="monthly"},facts:(t,e,n)=>[dt("how",n&&n.decisionTool&&(n.decisionTool.cadence||n.decisionTool.settings&&n.decisionTool.settings.cadence)||"monthly")]},{id:"timing.stale-draft",keys:["stress.staleDraftDismissedFor"],set:t=>Y(t.staleDraftDismissedFor)>0,facts:t=>[Me("year",t.staleDraftDismissedFor)]},{id:"lock.lock",keys:["decision.locked","decision.lockedAt","decision.lockedBy"],set:(t,e)=>!!e.locked,facts:(t,e)=>[Ne("locked",!!e.locked),Pr("at",e.lockedAt||""),zt("by",e.lockedBy||"")]},{id:"lock.unlock",keys:["decision.unlockedAt","decision.unlockCount"],set:(t,e)=>Y(e.unlockCount)>0,facts:(t,e)=>[Me("times",e.unlockCount??0),Pr("last",e.unlockedAt||"")]},{id:"month.seeded",keys:["decision.seededFrom"],set:(t,e)=>!!e.seededFrom,facts:(t,e)=>[zt("from",e.seededFrom||"")]},{id:"mach.configured",keys:["stress.configured","decision.configured"],set:()=>!1,facts:(t,e)=>[Ne("stress",!!t.configured),Ne("decision",!!e.configured)]},{id:"mach.declining",keys:["stress.spendingProfile","decision.spendingProfile","stress.spendingMigratedFrom","decision.spendingMigratedFrom"],set:t=>t.spendingMigratedFrom==="declining",facts:t=>[Ne("folded",t.spendingMigratedFrom==="declining")]},{id:"mach.old-names",keys:["stress.pacwMin","stress.cgtMin","stress.csh2Target"],set:()=>!1,facts:t=>[Ne("present",t.pacwMin!==void 0||t.cgtMin!==void 0||t.csh2Target!==void 0)]},{id:"mach.risk-mode",keys:["stress.riskMode"],set:()=>!1,facts:t=>[zt("mode",t.riskMode||"")]},{id:"mach.start-date",keys:["decision.startDate"],set:()=>!1,facts:(t,e)=>[Pr("date",e.startDate||"")]}]);function Bs(t,e,n,{all:r=!1}={}){const i=t||{},s=e||{},o=[];for(const a of im){let l=!1,c=[];try{l=!!a.set(i,s,n)}catch{l=!1}if(!(!l&&!r)){try{c=a.facts(i,s,n).filter(u=>u&&(u.kind==="text"||u.kind==="choice"?typeof u.v=="string":!0))}catch{c=[]}o.push({id:a.id,set:l,facts:c})}}return o}const Fs={55:{m:[84,91,96],f:[87,93,97]},60:{m:[85,91,96],f:[87,93,97]},65:{m:[85,92,96],f:[88,93,98]},70:{m:[86,92,96],f:[88,94,98]},75:{m:[87,92,97],f:[89,94,98]}},sm={50:0,25:1,10:2};function om(t,e="m",n=10){const r=sm[n]??2,i=e==="f"?"f":"m",s=Math.max(55,Math.min(75,t||65)),o=Math.floor(s/5)*5,a=Math.min(75,o+5),l=Fs[o][i][r],c=Fs[a][i][r],u=a===o?0:(s-o)/(a-o);return Math.round(l+(c-l)*u)}const Tn=["January","February","March","April","May","June","July","August","September","October","November","December"];function fr(t){const e=/^(\d{4})-(\d{2})-(\d{2})$/.exec(String(t||""));if(!e)throw new Error("planRead needs today as YYYY-MM-DD");return new Date(+e[1],+e[2]-1,+e[3],12,0,0,0)}const pr=t=>{const e=/^(\d{4})-(\d{2})/.exec(String(t||""));return e?{y:+e[1],m:+e[2]}:null},se=t=>{const e=pr(t);return e&&e.m>=1&&e.m<=12?Tn[e.m-1]+" "+e.y:""},Mt=t=>{const e=pr(t);return e&&e.m>=1&&e.m<=12?Tn[e.m-1]:""},_e=t=>{const e=/^(\d{4})-(\d{2})-(\d{2})/.exec(String(t||""));return e&&+e[2]>=1&&+e[2]<=12?+e[3]+" "+Tn[+e[2]-1]+" "+e[1]:se(t)},am=(t,e)=>(e.y-t.y)*12+(e.m-t.m),Qr=t=>String(t).padStart(2,"0"),lm=t=>t.getFullYear()+"-"+Qr(t.getMonth()+1)+"-"+Qr(t.getDate()),cm=t=>t.getFullYear()+"-"+Qr(t.getMonth()+1),Ee=t=>!!t&&typeof t=="object"&&!Array.isArray(t),re=t=>t==null||t===""||!Number.isFinite(+t)?null:+t,Pt=t=>t==null||typeof t=="string"&&t.trim()==="",um=t=>!!(t&&t.decisionTool&&t.decisionTool.settings&&t.decisionTool.settings.locked),Us=t=>t&&t.decisionTool&&t.decisionTool.settings&&t.decisionTool.settings.lockedAt||t&&t.planDocument&&t.planDocument.lockedAt||null,Gs=t=>t&&t.planDetails&&typeof t.planDetails.name=="string"&&t.planDetails.name||t&&typeof t.name=="string"&&t.name||"",Ys=t=>t&&t.household&&typeof t.household.partnerScenarioId=="string"&&t.household.partnerScenarioId||null,Xr=t=>t===void 0?void 0:JSON.parse(JSON.stringify(t)),js=t=>t===void 0?"<absent>":JSON.stringify(t);function dm(t,e){return String(e).split(".").reduce((n,r)=>n==null?void 0:n[r],t)}function hm(t,e,n){const r=String(e).split(".");let i=t;for(let s=0;s<r.length-1;s++)Ee(i[r[s]])||(i[r[s]]={}),i=i[r[s]];i[r[r.length-1]]=n}function fm(t,e){const n=String(e).split(".");let r=t;for(let i=0;i<n.length-1;i++){if(!Ee(r[n[i]]))return;r=r[n[i]]}delete r[n[n.length-1]]}function pm(t){const e=String(t??"").trim();let n=/^(\d{4})[-/](\d{1,2})$/.exec(e);if(n)return+n[2]>=1&&+n[2]<=12?{y:+n[1],m:+n[2]}:null;if(n=/^(\d{1,2})[-/](\d{4})$/.exec(e),n)return+n[1]>=1&&+n[1]<=12?{y:+n[2],m:+n[1]}:null;if(n=/^([A-Za-z]{3,9})\s+(\d{4})$/.exec(e),n){const r=Tn.findIndex(i=>i.toLowerCase().startsWith(n[1].toLowerCase().slice(0,3))&&i.toLowerCase().startsWith(n[1].toLowerCase()));return r>=0?{y:+n[2],m:r+1}:null}return null}const $s=t=>t.y+"-"+String(t.m).padStart(2,"0");function mm(t,e){try{return dr(t,{now:e})}catch{return t&&t.stressTool&&t.stressTool.settings||{}}}function Da(t,e){try{return Aa(t,e)}catch{return{mode:"legacy",firstTaxYear:e.getFullYear()+1,shapeAgeNow:re(t.shapeAgeNow)||57,currentAge:null,retireAge:null,startMonth:e.getFullYear()+1+"-04",yearsToStart:0,bridgeMonths:0}}}function Mi(t,{today:e}){const n=fr(e),r=um(t),i=r?t.planDocument:null,s=mm(t,n),o=t&&t.stressTool&&Ee(t.stressTool.settings)?t.stressTool.settings:{};let a=Da(s,n),l=re(s.duration)||35;if(i&&Ee(i.timing)){const E=i.timing;a={...a,mode:E.mode||a.mode,currentAge:re(E.currentAge),retireAge:re(E.retireAge),firstTaxYear:re(E.firstTaxYear)||a.firstTaxYear,shapeAgeNow:re(E.shapeAgeNow)||a.shapeAgeNow,startMonth:E.startMonth||a.startMonth},l=Array.isArray(i.timeline)&&i.timeline.length||re(i.assumptions&&i.assumptions.duration)||l}const c=Se(n),u=a.mode==="legacy"?null:i&&Ee(i.timing)?re(i.timing.currentAge):re(s.currentAge),d=i&&Ee(i.timing)?i.timing.currentAgeAsOf||null:s.currentAgeAsOf||null,h=u==null?null:a.mode==="future"?"age":"yes",m=a.firstTaxYear,g=h==="yes"?m===c?"now":m===c+1?"april":"saved":null,y=a.shapeAgeNow+l-1,T=r?{kind:"locked",at:_e(Us(t))}:{kind:"saved",at:t&&t.lastModified?_e(t.lastModified):null},P=r?T:{kind:"saved",at:d?_e(d):T.at};return{locked:r,lockedOn:r?_e(Us(t)):null,ss:s,stored:o,timing:a,duration:l,thisTY:c,values:{age:u,stopped:h,stopAge:h==="age"?re(a.retireAge):null,startWhen:g,endAge:y,savedYear:h==="yes"&&g==="saved"?m:null},source:T,ageSource:P}}function Oa(t,{today:e}){const r=Mi(t,{today:e}).values,i={};return r.age!=null&&(i.age=String(r.age)),r.stopped&&(i.stopped=r.stopped),r.stopAge!=null&&(i.stopAge=String(r.stopAge)),r.startWhen&&(i.startWhen=r.startWhen),Number.isFinite(r.endAge)&&(i.endAge=String(r.endAge)),i}const St=t=>Qs.find(e=>e.path===t);function Rr(t,e){if(Pt(t))return{error:e.required?"required":null,value:null};const n=String(t).trim();if(!/^\d{1,3}$/.test(n))return{error:"notANumber",value:null};const r=+n;return r<e.min?{error:"tooLow",value:r}:r>e.max?{error:"tooHigh",value:r}:{error:null,value:r}}function gm(t){const e=["now","april"];return t.values.savedYear&&e.push("saved"),e}function Ma(t,e,{today:n}){const r=fr(n),i=Mi(t,{today:n}),s={...Oa(t,{today:n}),...e||{}},o={},a={},l={age:!0,stopped:!0,endAge:!0,sex:!0,chance:!0,stopAge:!1,stopMonth:!1,startWhen:!1},c=Rr(s.age,St("age"));c.error?a.age=c.error:o.age=c.value;const u=Pt(s.stopped)?null:String(s.stopped);if(u?St("stopped").options.includes(u)?o.stopped=u:a.stopped="notAnOption":a.stopped="required",l.stopAge=u==="age",l.stopMonth=u==="month",l.startWhen=u==="yes",l.stopAge){const f=Rr(s.stopAge,St("stopAge"));f.error?a.stopAge=f.error:o.age!=null&&f.value<o.age?a.stopAge="stop-before-age":o.stopAge=f.value}if(l.stopMonth)if(Pt(s.stopMonth))a.stopMonth="required";else{const f=pm(s.stopMonth);f?$s(f)<=cm(r)?a.stopMonth="month-passed":o.stopMonth=$s(f):a.stopMonth="notAMonth"}const d=gm(i);if(l.startWhen){const f=Pt(s.startWhen)?null:String(s.startWhen);f?d.includes(f)?o.startWhen=f:a.startWhen="notAnOption":a.startWhen="required"}for(const f of["sex","chance"]){const I=St(f),_=Pt(s[f])?I.default:String(s[f]);I.options.includes(_)?o[f]=_:a[f]="notAnOption"}let h=null,m=null,g=null,y=null;if(o.age!=null&&o.stopped&&!a.stopAge&&!a.stopMonth&&!a.startWhen){const f=i.ss,I=i.stored;h={...I};const _=Math.floor(+f.currentAge||0),A=f.currentAgeAsOf||I.currentAgeAsOf||null;h.currentAge=o.age,h.currentAgeAsOf=o.age===_&&A?A:lm(r);const k=o.stopped==="yes";h.retired=k;let v=null;if(o.stopped==="age"&&(v=o.stopAge),o.stopped==="month"){const[D,S]=o.stopMonth.split("-").map(Number);v=ur({...h},new Date(D,S,0),r),y=v}h.retireAge=k?null:v,h.firstTaxYear=k?o.startWhen==="now"?i.thisTY:o.startWhen==="april"?i.thisTY+1:i.values.savedYear:null,m=Da(h,r),h.shapeAgeNow=m.shapeAgeNow,m.mode!=="legacy"&&(h.firstTaxYear=m.firstTaxYear)}const P=m?m.shapeAgeNow+Dr-1:St("endAge").min,E=Rr(s.endAge,St("endAge"));E.error?a.endAge=E.error:E.value<P?a.endAge="too-short":o.endAge=E.value,h&&o.endAge!=null&&(g=Math.max(Dr,o.endAge-m.shapeAgeNow+1),h.duration=g);const p=Object.keys(a).length===0&&h!==null&&g!==null;return{ok:p,values:o,errors:a,applies:l,offered:d,next:p?h:null,timing:p?m:null,duration:g,stopAgeFromMonth:y,saved:i,minEnd:P}}function ym(t,e,n){if(!(t&&t.budgetTool&&Ee(t.budgetTool.settings)))return{};const r=e.retired===!1&&+e.retireAge>0?+e.retireAge:n.shapeAgeNow;return{"budgetTool.settings.currentAge":e.currentAge,"budgetTool.settings.currentAgeAsOf":e.currentAgeAsOf,"budgetTool.settings.retired":e.retired,"budgetTool.settings.retirementAge":r}}function Na(t,e,{today:n}){const r=Ma(t,e,{today:n});if(!r.ok)return{ok:!1,errors:r.errors,patch:{},previous:{}};if(r.saved.locked)return{ok:!1,errors:{plan:"locked"},patch:{},previous:{}};const i=r.next,s=r.timing,o={"stressTool.settings.currentAge":i.currentAge,"stressTool.settings.currentAgeAsOf":i.currentAgeAsOf,"stressTool.settings.retired":i.retired,"stressTool.settings.retireAge":i.retireAge,"stressTool.settings.firstTaxYear":i.firstTaxYear,"stressTool.settings.shapeAgeNow":i.shapeAgeNow,"stressTool.settings.duration":i.duration,"decisionTool.settings.firstTaxYear":s.firstTaxYear,...ym(t,i,s)},a={},l={};for(const c of Ka){if(!(c in o))continue;const u=dm(t,c),d=o[c];js(u)!==js(d)&&(u===void 0&&d===null||(a[c]=Xr(d),l[c]=Xr(u)))}return{ok:!0,errors:{},patch:a,previous:l}}function _m(t,e){const n=JSON.parse(JSON.stringify(t));for(const[r,i]of Object.entries(e||{}))i===void 0?fm(n,r):hm(n,r,Xr(i));return n}function Ks(t,e,{stopAgeFromMonth:n=null}={}){if(!t||t.mode==="legacy")return[{id:"noAge",slots:{}}];const r=t.shapeAgeNow+e-1,i=[];return t.mode==="future"&&(n!=null?i.push({id:"monthAs",slots:{age:t.retireAge,month:se(t.startMonth)}}):i.push({id:"stopIn",slots:{month:se(t.startMonth),age:t.retireAge}})),i.push({id:"firstYear",slots:{year:W(t.firstTaxYear),y:t.firstTaxYear}}),i.push({id:"runs",slots:{years:e,from:t.mode==="future"?se(t.startMonth):"April "+t.firstTaxYear,endAge:r}}),i.push({id:"stepsFrom",slots:{age:t.shapeAgeNow}}),i}function Tm(t){return[]}function vm(t,e){const n=t&&t.fromAnswer;if(!Ee(n)||!Ee(n.answer)||!Array.isArray(n.people)||!Ee(n.people[0]))return null;const r=e||{},i=n.people[0],s=Ee(i.stop)?i.stop:Ee(n.stop)?n.stop:null,o=s?s.kind==="later":re(i.ageAtStop)!=null&&re(i.ageToday)!=null&&i.ageAtStop>i.ageToday,a=re(i.years)!=null?re(i.years):re(n.years),l=[];if(re(i.ageToday)!=null&&re(r.currentAge)!==re(i.ageToday)&&l.push("age"),r.retired===!1!==o&&l.push("stopped"),o&&r.retired===!1&&re(r.retireAge)!==re(i.ageAtStop)&&l.push("stopAge"),a!=null&&re(r.duration)!==a&&l.push("years"),!l.length)return null;const c=typeof n.savedOn=="string"?n.savedOn:"",u=t.lastModified&&String(t.lastModified)>c?_e(t.lastModified):null;return{workedOutOn:_e(c),changedOn:u,lasted:Ee(n.answer)?re(n.answer.lasted):null,diffs:l}}function bm(t,e,{today:n,typed:r=null}={}){const i=(t||[]).filter(p=>p&&p.plan&&typeof p.plan=="object"&&p.plan.id!=null),s=i.find(p=>String(p.plan.id)===String(e))||null;if(!s)return{found:!1,id:String(e||"")};const o=s.plan,a=!!(s.newer||s.failed),l=Mi(o,{today:n}),c=!l.locked&&!a,u=Oa(o,{today:n}),d=Ma(o,r||{},{today:n}),h={...u,...r||{}},m=Qs.map(p=>({path:p.path,type:p.type,options:p.type==="choice"?p.path==="startWhen"?d.offered:p.options:null,applies:d.applies[p.path]!==!1,shown:Pt(h[p.path])?"":String(h[p.path]),saved:p.path in u?u[p.path]:null,error:d.errors[p.path]||null})),g=d.ok?Ks(d.timing,d.duration,{stopAgeFromMonth:d.stopAgeFromMonth}):Ks(l.timing,l.duration);o.planDocument&&o.planDocument.strategy&&o.planDocument.strategy.id||l.ss.strategyId;const y=i.filter(p=>p.plan.id!==o.id&&(p.plan.id===Ys(o)||Ys(p.plan)===o.id)).map(p=>({id:String(p.plan.id),name:Gs(p.plan)}));let T=null;if(d.values.age!=null){const p=om(d.values.age,d.values.sex||"m",+(d.values.chance||"10"));T={endAge:p,applied:String(h.endAge||"")===String(p),slots:{age:p,who:d.values.sex==="f"?"women":"men",ageNow:d.values.age,chance:d.values.chance||"10"}}}const P=c&&d.ok?Na(o,r||{},{today:n}):{patch:{},previous:{}},E={years:l.duration,endAge:l.values.endAge};return{found:!0,id:String(o.id),name:Gs(o),locked:l.locked,lockedOn:l.lockedOn,readonly:a,editable:c,source:l.source,ageSource:l.ageSource,thisTY:l.thisTY,yearNow:W(l.thisTY),yearApril:W(l.thisTY+1),yearSaved:l.values.savedYear?W(l.values.savedYear):null,fields:m,errors:d.errors,ok:d.ok,derived:g,notUsed:Tm(),partners:y,suggestion:T,endAgeMin:d.minEnd,minYears:Dr,changed:Object.keys(P.patch).length>0,patch:P.patch,previous:P.previous,savedSlots:E,savedLine:d.ok?{id:"runsTo",slots:{endAge:d.values.endAge,years:d.duration}}:null}}const q=t=>t==null||t===""||!Number.isFinite(+t)?null:+t,M=t=>Math.round(q(t)||0),nn=t=>t&&t.planDetails&&typeof t.planDetails.name=="string"&&t.planDetails.name||t&&typeof t.name=="string"&&t.name||"",Zr=t=>t&&t.household&&typeof t.household.partnerScenarioId=="string"&&t.household.partnerScenarioId||null,zn=t=>!!(t&&t.decisionTool&&t.decisionTool.settings&&t.decisionTool.settings.locked),mr=t=>t&&t.decisionTool&&t.decisionTool.settings&&t.decisionTool.settings.lockedAt||t&&t.planDocument&&t.planDocument.lockedAt||null,Ca=(t,e)=>t&&t.planDocument&&t.planDocument.strategy&&t.planDocument.strategy.id||e&&e.strategyId||"pots-and-valves",xa=(t,e)=>_p.includes(Ca(t,e));function qn(t,e,n=null){const r=t&&t.key;return!r||r==="unknown"?null:r==="committed-saving"?{id:"committed-saving",slots:{month:se(t.startMonth)||W(t.firstTaxYear)}}:r==="bridge"?{id:xa(e,n)?"bridge-ladder":"bridge-plan",slots:{month:se(t.startMonth)||"April "+t.firstTaxYear}}:{id:r,slots:{}}}function Jn(t,e){try{return Wp(t,{now:e})}catch{return{key:"unknown",locked:zn(t),retired:!1,timingMode:"legacy",firstTaxYear:null,startMonth:null,beforeStart:!1,hasRecords:!1,hasDocument:!!(t&&t.planDocument),monthsToStart:0,yearsToStart:0}}}function Qn(t,e){try{return dr(t,{now:e})}catch{return t&&t.stressTool&&t.stressTool.settings||{}}}function Ni(t,e){const n=e.id,r=Zr(e);return t.filter(i=>i.plan.id!==n&&(i.plan.id===r||Zr(i.plan)===n))}function Am(t,{today:e,source:n="account"}={}){const r=fr(e),i=(t||[]).filter(u=>u&&u.plan&&typeof u.plan=="object"&&u.plan.id!=null),s=i.map(u=>{const d=u.plan,h=Jn(d,r),m=Qn(d,r),g=Ni(i,d);return{id:String(d.id),name:nn(d),stageKey:h.key,line:qn(h,d,m),locked:zn(d),lockedOn:zn(d)?_e(mr(d)):null,madeOn:d.fromAnswer&&d.fromAnswer.savedOn?_e(d.fromAnswer.savedOn):null,shownAsSaved:!!(u.newer||u.failed),linked:g.length>0,lastModified:typeof d.lastModified=="string"?d.lastModified:""}}),o=(u,d)=>String(d.lastModified).localeCompare(String(u.lastModified));if(n==="window")return{groups:[{id:"window",rows:s.slice().sort((u,d)=>u.linked===d.linked?o(u,d):u.linked?-1:1)}]};const a=s.filter(u=>u.linked).sort(o),l=s.filter(u=>!u.linked).sort(o),c=[];return a.length&&c.push({id:"household",rows:a}),l.length&&c.push({id:"other",rows:l}),{groups:c}}const O=t=>({key:t,kind:"money"}),Le=t=>({key:t,kind:"count"}),Wt=t=>({key:t,kind:"age"}),Im=t=>"£"+String(Math.abs(Math.round(Number(t)||0))).replace(/\B(?=(\d{3})+(?!\d))/g,","),Sm=(t,e)=>typeof t=="string"?t:"fixed"in t?String(t.fixed):t.kind==="money"?Im(e[t.key]):String(Math.round(Number(e[t.key])||0)),G=(t,e,n)=>({id:t,parts:e,text:e.map(r=>Sm(r,n)).join("")});function te(t,e,n){const r=e?pr(e):null,i={y:n.getFullYear(),m:n.getMonth()+1},s=!!r&&am(r,i)>3;return{kind:t,at:e?String(e).length>7?_e(e):se(e):null,stale:s}}const B=(t,e,n,r,i={})=>({id:t,slots:i,sentence:G(t,e,n),source:r}),Q=(t,e,n={})=>({id:t,place:e,slots:n}),ei=(t,e,n={})=>({id:t,href:e,slots:n});function La(t){const{plan:e,now:n,ty:r,tyKey:i,mon:s}=t,o=hr(e),a=o.length?o[o.length-1]:null,l=!!a&&String(a.date).slice(0,7)>=s,c={},u=[],d=!!(e.decisionTool&&e.decisionTool.taxYears&&e.decisionTool.taxYears[i]&&e.decisionTool.taxYears[i].yearSetupComplete);u.push(B(d?"month.yearSetUp":"month.yearNotSetUp",[],c,te("record",null,n),{year:W(r)})),o.slice(-3).reverse().forEach((g,y)=>{c["net"+y]=M(g.monthlyNet),c["tax"+y]=M(g.monthlyTax),u.push(B("month.record",[{fixed:se(g.date)},": ",O("net"+y)," after tax, ",O("tax"+y)," tax"],c,te("record",g.date,n),{month:se(g.date)}))});let h;l?(c.net=M(a.monthlyNet),h=G("month.recorded",[se(s)+" recorded: ",O("net")," after tax"],c)):h=G("month.notYet",[se(s)+" is not recorded yet"],c);const m=[Q("record","month",{month:Mt(s)})];return d||m.push(Q("setUpYear","taxyear",{year:W(r)})),{done:l,result:h,figures:c,lines:u,buttons:m,notes:[],recorded:l,setUp:d}}function wm(t){const{plan:e,now:n,ss:r}=t,i={},s=[],o=[];if(!e.planDocument)return{done:!1,result:G("where.noDocument",["Not locked: nothing to read against yet"],i),figures:i,lines:s,buttons:[],notes:o};let a=null,l={ladderInDocument:!1};try{a=qp(e,{now:n}),l=Pa(e,{now:n})}catch{a=null}const c=mr(e);if(!a)return{done:!1,result:G("where.noReading",["The plan document could not be read"],i),figures:i,lines:s,buttons:[Q("seeDocument","document")],notes:o};let u;if(a.saving){const d=a.saving;d.pathMissing||d.actual==null||d.expected==null?u=G("where.saverNone",["No pot recorded against the plan’s path yet"],i):(i.actual=M(d.actual),i.expected=M(d.expected),u=G("where.saver",[O("actual")," on "+se(d.at),"; the plan’s middle line for then is ",O("expected")],i),s.push(B("where.saverPot",[O("actual")],i,te(d.actualSource==="holdings"?"hold":"record",d.recordedAt||d.at,n))),s.push(B("where.saverLine",[O("expected")],i,te("locked",c,n))))}else{const d=a.incomeThisYear||{recorded:0,drawn:0,planned:null};i.months=d.recorded,i.drawn=M(d.drawn);const h=[Le("months")," month"+(d.recorded===1?"":"s")+" recorded in "+a.taxYear+": ",O("drawn")," taken before tax"];d.planned!=null&&(i.planned=M(d.planned),h.push("; the plan says ",O("planned")," for the year")),u=G("where.retired",h,i),s.push(B("where.taken",[O("drawn")],i,te("record",null,n),{year:a.taxYear})),d.planned!=null&&s.push(B("where.planned",[O("planned")],i,te("locked",c,n),{year:a.taxYear})),a.step&&a.step.amount!=null&&(i.stepNow=M(a.step.amount),s.push(B("where.step",[O("stepNow")," a year before tax"],i,te("locked",c,n),{n:String(a.step.index),of:String(a.step.of)}))),a.pot&&a.pot.actual!=null&&(i.pot=M(a.pot.actual),s.push(B("where.pot",[O("pot")],i,te(a.pot.source==="holdings"?"hold":"record",a.pot.asOf,n))),a.pot.p50!=null&&(i.potMid=M(a.pot.p50),s.push(B("where.potMid",[O("potMid")],i,te("locked",c,n)))))}return a.contract&&!l.ladderInDocument&&o.push("where.ladderNotInDocument"),a.ladder&&typeof a.ladder.monthly=="number"&&a.ladder.monthly>0&&(i.ladderMonthly=M(a.ladder.monthly),s.push(B("where.ladderMonthly",[O("ladderMonthly")," a month before tax"],i,te("locked",c,n)))),{done:!0,result:u,figures:i,lines:s,buttons:[Q("seeDocument","document")],notes:o}}function Em(t,e,n){if(n&&t.planDocument&&Array.isArray(t.planDocument.steps)&&t.planDocument.steps.length)return t.planDocument.steps.map(s=>({fromAge:+s.fromAge,amount:M(s.amount),taxYear:s.taxYear||null,decline:+s.decline||0,glideToNext:!!s.glideToNext}));const r=q(e.shapeAgeNow)||null;if(e.incomeShape==="phases"&&Array.isArray(e.incomeSteps)&&e.incomeSteps.length)return e.incomeSteps.filter(s=>s&&q(s.amount)!=null).map(s=>({fromAge:+s.fromAge,amount:M(s.amount),taxYear:null,decline:+s.decline||0,glideToNext:!!s.glideToNext}));const i=Array.isArray(e.targetSchedule)&&e.targetSchedule.length?M(e.targetSchedule[0]):M(e.baseSalary);return r?[{fromAge:r,amount:i,taxYear:null,decline:0,glideToNext:!1}]:[{fromAge:null,amount:i,taxYear:null,decline:0,glideToNext:!1}]}function Pm(t){const{plan:e,ss:n,ds:r,now:i,stage:s,locked:o,readonly:a}=t,l=o?e.planDocument:null,c=mr(e),u={},d=[],h=[],m=Em(e,n,o),g=m[0]||null,y=o?te("locked",c,i):te("saved",null,i),T=l&&l.timing?l.timing:null,P=T&&T.startMonth||s.startMonth||null,E=T&&T.firstTaxYear||s.firstTaxYear||null,p=xa(e,n);let f;g&&(u.yearly=g.amount),o&&g?f=s.timingMode==="future"?G("plan.lockedSaver",[O("yearly")," a year before tax from "+(se(P)||W(E))+" (tax year "+W(E)+")"],u):G(p?"plan.lockedLadder":"plan.lockedPlan",[O("yearly")," a year before tax; your "+(p?"ladder":"plan")+" pays from "+(se(P)||W(E))+" (tax year "+W(E)+")"],u):s.timingMode==="future"&&q(n.retireAge)?(u.retireAge=+n.retireAge,f=G("plan.saver",["Stopping work at ",Wt("retireAge"),", in "+(se(P)||W(E))],u)):g&&s.key!=="unknown"?f=G("plan.retired",["Retired. ",O("yearly")," a year before tax"],u):g?f=G("plan.noAge",[O("yearly")," a year before tax"],u):f=G("plan.nothing",["No figures yet"],u);const I=[],_=o&&T&&q(T.currentAge)!=null?T.currentAge:q(n.currentAge),A=o&&T?T.currentAgeAsOf:n.currentAgeAsOf;_!=null&&(u.ageToday=_,I.push(B("about.age",[Wt("ageToday")],u,o?y:te("saved",A||null,i),{asOf:A?_e(A):""})));const k=o&&T?T.mode==="retired":n.retired===!0,v=q(o&&T?T.retireAge:n.retireAge);s.timingMode==="future"&&v!=null?(u.stopAge=v,I.push(B("about.stopAt",[Wt("stopAge")],u,y,{month:se(P)}))):(k||s.timingMode==="retired")&&I.push(B("about.retired",[],u,y)),E&&I.push(B("about.firstYear",[],u,y,{year:W(E)}));const D=o&&l?l.timeline&&l.timeline.length||l.assumptions&&l.assumptions.duration||null:q(n.duration);if(D){u.years=D;const V=T&&q(T.shapeAgeNow)!=null?T.shapeAgeNow:q(n.shapeAgeNow);V!=null&&(u.ageEnd=V+D-1),I.push(B("about.runs",[Le("years")," years"+(V!=null?", to age ":"")].concat(V!=null?[Wt("ageEnd")]:[]),u,y))}const S=[];m.forEach((V,R)=>{u["step"+R]=V.amount;const ae=[];V.fromAge!=null&&(u["stepAge"+R]=V.fromAge,ae.push("From age ",Wt("stepAge"+R),": ")),ae.push(O("step"+R)," a year before tax"),V.taxYear&&ae.push(" (tax year "+V.taxYear+")"),V.decline>0?ae.push(", falling "+String(V.decline)+"% a year"):V.glideToNext&&R<m.length-1&&ae.push(", sloping to the next step"),S.push(B("pays.step",ae,u,y))}),o?h.push({id:"prices",slots:{month:se(c)||_e(c)}}):h.push({id:"pricesToday",slots:{}});const N=[],$=o&&l&&l.pots?M(l.pots.sipp):q(n.strategyParams&&n.strategyParams.sippTotal)>0?M(n.strategyParams.sippTotal):M(n.equityMin)+M(n.bondMin)+M(n.cashTarget)+M(n.diversifierStart),b=o&&l&&l.pots?M(l.pots.isa):M(n.isaBalance),w=o&&l&&l.pots?M(l.pots.gia):M(n.taxableStart);if(u.sipp=$,u.isa=b,u.gia=w,N.push(B("pots.pension",[O("sipp")],u,y)),!o)u.shares=M(n.equityMin),u.bonds=M(n.bondMin),u.cash=M(n.cashTarget),N.push(B("pots.split",[O("shares")," shares, ",O("bonds")," bonds, ",O("cash")," cash"],u,y));else if(l&&l.pots&&l.pots.allocation){const V=l.pots.allocation;u.shares=M(V.equityMin),u.bonds=M(V.bondMin),u.cash=M(V.cashTarget),N.push(B("pots.split",[O("shares")," shares, ",O("bonds")," bonds, ",O("cash")," cash"],u,y))}N.push(B("pots.isa",[O("isa")],u,y)),w>0&&N.push(B("pots.gia",[O("gia")],u,y));const C=o&&l&&l.pots?l.pots.potAtRetirement:n.potAtRetirement;C&&(q(C.sipp)>0||q(C.isa)>0)&&(u.parSipp=M(C.sipp),u.parIsa=M(C.isa),N.push(B("pots.atStop",[O("parSipp")," pension, ",O("parIsa")," ISA"],u,y)));const H=o&&l&&l.assumptions?q(l.assumptions.spWeeklyAmount):q(n.spWeeklyAmount),oe=o&&l&&l.assumptions?l.assumptions.spStartDate:n.spStartDate;if(H>0)u.spWeekly=M(H),N.push(B("pots.statePension",[O("spWeekly")," a week"],u,y,{from:oe?String(oe):""}));else if(q(n.statePension)>0){u.spYearly=M(n.statePension);const V=E&&q(n.statePensionYear)!=null?W(E+M(n.statePensionYear)):"";N.push(B("pots.statePensionOld",[O("spYearly")," a year"],u,y,{year:V}))}else N.push(B("pots.noStatePension",[],u,y));if(q(n.dbAmount)>0){u.db=M(n.dbAmount);const V=q(n.dbStartAge)!=null?"age "+String(M(n.dbStartAge)):q(n.dbStartYear)!=null&&E?"tax year "+W(E+M(n.dbStartYear)):"";N.push(B("pots.finalSalary",[O("db")," a year"],u,y,{from:V}))}q(n.other)>0&&(u.other=M(n.other),N.push(B("pots.other",[O("other")," a year"],u,y)));const Z=[],Oe=Ca(e,n);Z.push(B("way.strategy",[],u,y,{strategy:Oe}));const z=o&&l&&l.strategy&&l.strategy.params||n.strategyParams||{};for(const[V,R]of Object.entries(z))q(R)!=null&&(u["dial."+V]=q(R),Z.push(B("way.dial",[V==="cashYears"||V==="years"||/Years$|Age$/.test(V)?Le("dial."+V):O("dial."+V)],u,y,{dial:V})));!o&&n.allocMode&&Z.push(B("way.allocMode",[],u,y,{mode:String(n.allocMode)}));const ee=Bs(n,r,e),ne=Bs(n,r,e,{all:!0}),Je=[{id:"about",lines:I,place:"about",sub:"about",href:"#/plan/"+e.id+"/about"},{id:"pays",lines:S,place:"spend"},{id:"pots",lines:N,place:"pots"},{id:"way",lines:Z,place:"way"}],de=[];o?de.push(Q("openDocument","document"),Q("testLocked","test")):a||de.push(Q("testPlan","test"));const Kt=Array.isArray(e.journey)?e.journey.filter(V=>V&&V.stage).map(V=>({stage:V.stage,on:_e(V.at),arrival:/arrival/i.test(String(V.note||""))})):[],gr=Array.isArray(e.planDocumentArchive)?e.planDocumentArchive.length:0;return{done:s.key!=="unknown",result:f,figures:u,lines:d,buttons:de,notes:h,sections:Je,options:ee,allOptions:ne,journey:Kt,pastVersions:gr,lockedOn:o?_e(c):null}}function Va(t){const{plan:e,now:n,mon:r}=t,i={},s=[],o=Array.isArray(e.accumulationTool&&e.accumulationTool.history)?e.accumulationTool.history:[],a=wa({accHistory:o,today:n}),l=a.source==="record"&&String(a.at)>=r;let c;if(a.source==="record"){i.pension=M(a.pension),a.isa!=null&&(i.isa=M(a.isa));const u=[O("pension")," pension"].concat(a.isa!=null?[", ",O("isa")," ISA"]:[]);s.push(B("pot.latest",u,i,te("record",a.recordedAt||a.at,n),{month:se(a.at)})),c=l?G("pot.recorded",[O("pension")," recorded for "+se(r)],i):G("pot.notYet",[Mt(r)+"’s pot is not recorded yet"],i)}else c=G("pot.notYet",[Mt(r)+"’s pot is not recorded yet"],i);return{done:l,result:c,figures:i,lines:s,buttons:[Q("recordPot","potRecord")],notes:[],recorded:l}}function Rm(t){const{plan:e,now:n}=t,r=e.accumulationTool&&e.accumulationTool.settings||{},i={},s=[],o=M(r.netMonthly),a=M(r.employerMonthly),l=M(r.isaMonthly),c=q(r.escalationPct),u=o>0||a>0||l>0;let d;if(u){i.you=o,i.employer=a;const h=[O("you")," a month from you, ",O("employer")," from your employer"];l>0&&(i.isaMonthly=l,h.push(", ",O("isaMonthly")," into ISAs and savings")),d=G("saving.payIn",h,i),s.push(B("saving.you",[O("you")," a month"],i,te("saved",null,n))),s.push(B("saving.employer",[O("employer")," a month"],i,te("saved",null,n))),l>0&&s.push(B("saving.isa",[O("isaMonthly")," a month"],i,te("saved",null,n))),c>0&&(i.rise=c,s.push(B("saving.rise",[Le("rise"),"% a year"],i,te("saved",null,n))))}else d=G("saving.none",["Nothing paid in"],i);return{done:u,result:d,figures:i,lines:s,buttons:[Q("changeSaving","saving"),Q("onCourse","onCourse")],notes:["saving.notFrozen"]}}function km(t){const{plan:e,now:n}=t,r=e.budgetTool&&e.budgetTool.settings||{},i=r.derived||{},s={},o=[],a=M(i.allInComfortableMonthly||i.comfortableMonthlyNet),l=M(i.essentialMonthlyNet),c=Array.isArray(r.lines)?r.lines.filter(h=>h&&q(h.amount)>0).length:0,u=a>0&&c>0;let d;return u?(s.total=a,s.essentials=l,d=G("budget.total",[O("total")," a month after tax, ",O("essentials")," of it essentials. A guide only"],s),o.push(B("budget.totalLine",[O("total")," a month after tax"],s,te("budget",null,n))),o.push(B("budget.essentialsLine",[O("essentials")," a month after tax"],s,te("budget",null,n)))):d=G("budget.none",["Not worked out. A guide only"],s),{done:u,result:d,figures:s,lines:o,buttons:[Q("changeBudget","budget")],notes:["budget.guide"]}}function Dm(t){const e=["lock.what"];return Ra.includes(t.stage.key)&&e.push("lock.saver"),{done:!1,result:G("lock.notLocked",["Not locked"],{}),figures:{},lines:[],buttons:[Q("lockIt","lock")],notes:e}}function Om(t){const{plan:e,now:n}=t,r=jt(e.holdings),i=Tf(r),s={},o=[],a=i.count>0;let l;if(a){s.pension=M(i.byWrapper.SIPP),s.isa=M(i.byWrapper.ISA);const c=te("hold",r.updatedAt||null,n),u=["Pension ",O("pension"),", ISA ",O("isa")];i.byWrapper.GIA>0&&(s.gia=M(i.byWrapper.GIA),u.push(", other account ",O("gia"))),i.byWrapper.CASH>0&&(s.cash=M(i.byWrapper.CASH),u.push(", cash ",O("cash"))),u.push(r.updatedAt?". Updated "+_e(r.updatedAt):""),l=G("hold.summary",u,s),s.lines=i.count,s.total=M(i.total),o.push(B("hold.total",[O("total")," across ",Le("lines")," line"+(i.count===1?"":"s")],s,c))}else l=G("hold.none",["Not recorded yet"],s);return{done:a,result:l,figures:s,lines:o,buttons:[Q("changeHold","hold")],notes:[]}}function Mm(t){const{plan:e,now:n}=t,r={},i=[];let s=null;try{s=Jp(e,{now:n})}catch{s=null}let o,a=!1;if(!s||!s.target||s.target.kind==="none")o=G("move.notSet",["Set when the plan is locked"],r);else if(s.diff.complete)o=G("move.done",["Done"],r),a=!0;else if(s.target.kind==="ladder"){const l=s.target.lines.length,c=s.diff.hold.filter(u=>Array.isArray(u.taxYears)).length;r.bought=c,r.rungs=l,o=G("move.gilts",[Le("bought")," of ",Le("rungs")," gilts bought"],r)}else r.movesDone=s.prog.doneCount,r.moves=s.prog.total,o=G("move.moves",[Le("movesDone")," of ",Le("moves")," moves done"],r);return s&&s.diff&&typeof s.diff.progressPct=="number"&&(r.heldPct=s.diff.progressPct,i.push(B("move.held",[Le("heldPct"),"% of the plan’s mix held"],r,te("hold",jt(e.holdings).updatedAt||null,n)))),{done:a,result:o,figures:r,lines:i,buttons:[Q("openMove","move")],notes:["move.optional"]}}function Nm(t){const{plan:e,entries:n,now:r}=t,i=Ni(n,e),s={},o=[],a=[],l=Zr(e),c=!!l&&!n.some(d=>d.plan.id===l);let u;if(i.length){const d=i[0],h=Jn(d.plan,r),m=qn(h,d.plan,Qn(d.plan,r));u=G("household.with",["With ‘"+nn(d.plan)+"’"],s);for(const y of i){const T=Jn(y.plan,r);o.push({id:"household.partner",slots:{name:nn(y.plan)},sentence:G("household.partner",[],s),source:te("saved",null,r),theirLine:qn(T,y.plan,Qn(y.plan,r)),theirId:String(y.plan.id)}),a.push(ei("openPartner","#/plan/"+y.plan.id,{name:nn(y.plan)}))}const g=l&&i.some(y=>y.plan.id===l)?String(e.id):String(i[0].plan.id);return a.push({...Q("checkTogether","household"),planId:g}),{done:!0,result:u,figures:s,lines:o,buttons:a,notes:[],theirLine:m}}return c?{done:!1,result:G("household.notInAccount",["Your partner’s plan is not in this account"],s),figures:s,lines:o,buttons:[Q("linkOne","household")],notes:[]}:{done:!1,result:G("household.none",["No partner’s plan is linked"],s),figures:s,lines:o,buttons:[Q("linkOne","household")],notes:[]}}const Cm={month:La,where:wm,plan:Pm,pot:Va,saving:Rm,budget:km,lock:Dm,hold:Om,move:Mm,household:Nm};function xm(t,e){const{stage:n,readonly:r,plan:i,ss:s,locked:o,mon:a,ty:l,tyKey:c,now:u}=t,d=n.key,h=d==="bridge"||d==="running",m=e.month,g=e.pot,y=hr(i),T=y.length?String(y[y.length-1].date).slice(0,7):null,P=Array.isArray(i.journey)&&i.journey.some(w=>w&&/arrival/i.test(String(w.note||""))),E=n.startMonth||null,p=n.hasRecords;let f=null;try{f=["saving","approaching","draft-retired","unknown"].includes(d)?Wf(s,{locked:o,hasRecords:p,now:u}):null}catch{f=null}const I=m?m.setUp:!!(i.decisionTool&&i.decisionTool.taxYears&&i.decisionTool.taxYears[c]&&i.decisionTool.taxYears[c].yearSetupComplete),_=m?m.recorded:!!T&&T>=a,A=g?g.recorded:!1,k=o?null:vm(i,s),v={"P.readonly":()=>r,"P.noAge":()=>d==="unknown","P.arrive":()=>d==="running"&&n.timingMode==="future"&&!!E&&!(T&&T>=E)&&!P,"P.taxyear":()=>h&&!I,"P.month":()=>h&&!_,"P.idle":()=>h,"P.pot":()=>d==="committed-saving"&&!A,"P.working":()=>d==="committed-saving","P.recheck":()=>!!k,"P.stale":()=>!!f,"P.draft":()=>d==="draft-retired","P.approaching":()=>d==="approaching","P.saving":()=>d==="saving"},D=Zp.find(w=>v[w]()),S=(()=>{const w=pr(a),C=w.m===12?{y:w.y+1,m:1}:{y:w.y,m:w.m+1};return Tn[C.m-1]})(),N={month:se(a),monthName:Mt(a),nextMonth:S,year:W(l),stop:se(E)||"",savedYear:f?f.savedLabel:""},$="#/plan/"+i.id+"/about",b={"P.readonly":null,"P.noAge":ei("addAge",$),"P.arrive":Q("record","month",{month:Mt(a)}),"P.taxyear":Q("setUpYear","taxyear",{year:W(l)}),"P.month":Q("record","month",{month:Mt(a)}),"P.idle":null,"P.pot":Q("recordPot","potRecord"),"P.working":Q("onCourse","onCourse"),"P.recheck":Q("recheck","test"),"P.stale":ei("updateIt",$),"P.draft":Q("testPlan","test"),"P.approaching":Q("testPlan","test"),"P.saving":Q("onCourse","onCourse")};return{id:D||"P.saving",slots:N,button:D?b[D]:null,answerStale:k}}function Lm(t,e,n,{today:r,source:i="account"}={}){const s=fr(r),o=(t||[]).filter(S=>S&&S.plan&&typeof S.plan=="object"&&S.plan.id!=null),a=o.find(S=>String(S.plan.id)===String(e))||null;if(!a)return{found:!1,id:String(e||"")};const l=a.plan,c=!!(a.newer||a.failed),u=Jn(l,s),d=Qn(l,s),h=l.decisionTool&&l.decisionTool.settings||{},m=zn(l),g=Ni(o,l),y=Se(s),T={plan:l,entries:o,now:s,ss:d,ds:h,stage:u,locked:m,readonly:c,mon:zp(s),ty:y,tyKey:ki(y),source:i},P=ka(u.key,{locked:m,linked:g.length>0,manyPlans:o.length>1}),E=P.map(S=>S.id),p=n&&Xp.includes(n)?n:null,f=p||E[0],I=p&&!E.includes(p)?[...P,{id:p,optional:!0,listed:!1}]:P,_={};for(const S of I)try{_[S.id]=Cm[S.id](T)}catch(N){_[S.id]={done:!1,result:G(S.id+".failed",["Could not be read"],{}),figures:{},lines:[],buttons:[],notes:[],error:N&&N.message}}!_.month&&["bridge","running"].includes(u.key)&&(_.month=La(T)),!_.pot&&u.key==="committed-saving"&&(_.pot=Va(T));const A=I.map(S=>{const N=_[S.id],$=c?N.buttons.filter(b=>b.href):N.buttons;return{id:S.id,optional:!!S.optional,listed:S.listed!==!1,state:S.id===f?"current":N.done?"done":"open",...N,buttons:$}}),{answerStale:k,...v}=xm(T,_),D=tm(u.key,{locked:m,linked:g.length>0,manyPlans:o.length>1});return{found:!0,id:String(l.id),name:nn(l),stageKey:u.key,retired:Vs.includes(u.key),saver:Ra.includes(u.key),line:qn(u,l,d),locked:m,lockedOn:m?_e(mr(l)):null,readonly:c,source:i,steps:A,subSteps:D,current:f,answerStale:k||null,next:c?{...v,button:null}:v,askLinks:Vs.includes(u.key)?["c"]:["a","b"]}}const kr="pt_guest_scenarios",Vm=15e3,Bm=new Set(Ha);function Hs(t){for(const e of Object.keys(t))if(!Bm.has(e))throw new Error('planWrite: "'+e+'" is not a declared field path');return t}function Fm(t,{win:e=null,session:n=null,local:r=null,now:i=()=>new Date,fb:s=null,handles:o}){const a=s||{doc:$h,updateDoc:sf};let l=!1,c=!1,u=null;const d=f=>{l||t.dispatch(f)},h=(f,I)=>d({type:J.PLAN_SAVE_FAILED,planId:f,problem:I}),m=f=>{!e||typeof e.setTimeout!="function"||(u&&e.clearTimeout(u),u=e.setTimeout(()=>{u=null,f()},Vm))};function g(f,I){const _=f.plans,A=_&&Array.isArray(_.list)?_.list.find(v=>v&&v.plan&&String(v.plan.id)===String(I)):null;if(!A)return{problem:"notHere"};if(A.newer||A.failed)return{problem:"readonly"};const k=o()||{};return f.session.kind==="in"&&k.user&&k.db&&_.source==="account"?{kind:"account",entry:A,db:k.db,uid:k.user.uid,reread:k.reread}:f.session.kind==="nobody"&&_.source==="window"?ya(ga(r))?{problem:"usedUp"}:{kind:"window",entry:A}:{problem:"nobody"}}function y(f,I){return Bt(f&&f.decisionTool&&f.decisionTool.settings)?!0:!!sp(f,I,$r())}async function T(f,I,_){if(f.kind==="account")return await a.updateDoc(a.doc(f.db,"users",f.uid,"scenarios",String(I)),_),!0;let A=null;try{A=n?n.getItem(kr):null}catch{return!1}let k=null;try{k=JSON.parse(A)}catch{k=null}if(!Array.isArray(k))return!1;const v=k.findIndex(S=>S&&String(S.id)===String(I));if(v<0)return!1;k[v]=_m(k[v],_);const D=JSON.stringify(k);try{return n.setItem(kr,D),n.getItem(kr)===D}catch{return!1}}async function P(f){let I=t.getState(),_=g(I,f);if(_.problem){h(f,_.problem);return}if(_.kind==="account"){try{await _.reread()}catch{}if(l)return;if(I=t.getState(),_=g(I,f),_.problem){h(f,_.problem);return}}const A=_.entry.plan,k=I.draft.plan&&I.draft.plan.id===String(f)?I.draft.plan:null,v=k?k.values:{};if(Bt(A.decisionTool&&A.decisionTool.settings)){h(f,"locked");return}const D=Na(A,v,{today:I.env.today});if(!D.ok){h(f,D.errors.plan==="locked"?"locked":"problems");return}const S=I.plans.view&&I.plans.view.page&&I.plans.view.page.about&&I.plans.view.page.forId===String(f)?I.plans.view.page.about:null,N=S&&S.savedLine?S.savedLine:null;if(!Object.keys(D.patch).length){d({type:J.PLAN_SAVED,planId:f,previous:{},line:N}),m(()=>d({type:J.PLAN_TOAST_CLOSE}));return}const $=Hs({...D.patch,lastModified:i().toISOString()});if(y(A,$)){h(f,"locked");return}let b=!1;try{b=await T(_,f,$)}catch{b=!1}if(!l){if(!b){h(f,_.kind==="window"?"storage":"failed");return}d({type:J.PLAN_SAVED,planId:f,previous:{...D.previous,lastModified:A.lastModified},line:N}),d({type:J.PLANS_READING}),m(()=>d({type:J.PLAN_TOAST_CLOSE}))}}async function E(f,I){const _=t.getState(),A=g(_,f);if(A.problem){h(f,A.problem);return}const k=A.entry.plan,v={};for(const[N,$]of Object.entries(I||{}))v[N]=$===void 0&&A.kind==="account"?null:$;(!("lastModified"in v)||v.lastModified==null)&&(v.lastModified=i().toISOString());const D=Hs(v);if(y(k,Object.fromEntries(Object.entries(D).map(([N,$])=>[N,$===void 0?null:$])))){h(f,"locked");return}let S=!1;try{S=await T(A,f,D)}catch{S=!1}if(!l){if(!S){h(f,A.kind==="window"?"storage":"failed");return}d({type:J.PLAN_UNDO_DONE,planId:f}),d({type:J.PLANS_READING}),m(()=>d({type:J.PLAN_TOAST_CLOSE}))}}const p=t.subscribe((f,I)=>{if(c)return;const _=f.ui.saving;_&&(I.type===J.PLAN_SAVE&&_.kind==="save"?(c=!0,P(_.planId).catch(()=>h(_.planId,"failed")).finally(()=>{c=!1})):I.type===J.PLAN_UNDO&&_.kind==="undo"&&(c=!0,E(_.planId,_.previous).catch(()=>h(_.planId,"failed")).finally(()=>{c=!1})))});return()=>{l=!0,p(),u&&e&&e.clearTimeout(u)}}const Um="pt_guest_scenarios",Gm="pt-preview",Ym=60*1e3;function Ws(t,e){const n=[];for(const r of t){if(!r||typeof r!="object"||r.id==null)continue;let i;try{i=Mf(r,{now:e})}catch(s){i={scenario:r,newer:!1,error:s}}n.push({plan:i.scenario&&typeof i.scenario=="object"?i.scenario:r,newer:!!i.newer,failed:!!i.error})}return n}function jm(t){if(!t)return[];let e=null;try{e=t.getItem(Um)}catch{return[]}if(!e)return[];try{const n=JSON.parse(e);return Array.isArray(n)?n:[]}catch{return[]}}const zs=t=>String(t.getHours()).padStart(2,"0")+":"+String(t.getMinutes()).padStart(2,"0");function $m(t){const e=t.plans;if(!e||e.status!=="read")return null;const n=t.env.today,r=Am(e.list,{today:n,source:e.source}).groups,i=t.route;let s=null;if(i&&i.screen==="plan"&&i.planId&&(s={...Lm(e.list,i.planId,i.step,{today:n,source:e.source}),forId:i.planId,forStep:i.step||null},i.step==="about")){const o=t.draft&&t.draft.plan&&t.draft.plan.id===i.planId?t.draft.plan:null,a=o?o.values:{};s.about={...bm(e.list,i.planId,{today:n,typed:a}),draftKey:JSON.stringify(a)}}return{today:n,rows:r,page:s}}function Qm(t,{win:e,local:n=null,session:r=null,now:i=()=>new Date,fb:s=null,fbWrite:o=null}){const a=s||{initializeApp:oo,getAuth:Od,setPersistence:yu,browserLocalPersistence:xo,onAuthStateChanged:vu,signOut:bu,getFirestore:Gh,collection:jh,getDocs:rf,isFirebaseConfigured:of},l=[];let c,u=!1;const d=v=>{u||t.dispatch(v)};d({type:J.SESSION_SET,session:{kind:"checking",email:null}});function h(){const v=Ws(jm(r),i());d({type:J.PLANS_SET,list:v,source:"window",readAt:zs(i()),usedUp:ya(ga(n))})}let m=null,g=null;if(!a.isFirebaseConfigured())c=null,d({type:J.SESSION_SET,session:{kind:"nobody",email:null}}),h();else{const v=a.initializeApp(da,Gm);m=a.getAuth(v),Promise.resolve(a.setPersistence(m,a.browserLocalPersistence)).catch(()=>{}),g=a.getFirestore(v)}async function y(){if(!c||!g)return;const v=c.uid;try{const D=await a.getDocs(a.collection(g,"users",v,"scenarios")),S=[];if(D.forEach(N=>{S.push({id:N.id,...N.data()})}),u||!c||c.uid!==v)return;d({type:J.PLANS_SET,list:Ws(S,i()),source:"account",readAt:zs(i())})}catch{u||d({type:J.PLANS_FAILED})}}function T(){c!==void 0&&(c===null?h():c.emailVerified&&y())}function P(){try{n&&n.removeItem(qa)}catch{}try{r&&r.removeItem(Ja)}catch{}}async function E(){P(),d({type:J.PLANS_CLEAR});try{m&&await a.signOut(m)}catch{}!u&&c&&(c=null,d({type:J.SESSION_SET,session:{kind:"nobody",email:null}}),h())}if(m){const v=a.onAuthStateChanged(m,D=>{if(u)return;const S=c;c=D||null,D?D.emailVerified?(d({type:J.SESSION_SET,session:{kind:"in",email:D.email||null}}),y()):d({type:J.SESSION_SET,session:{kind:"unverified",email:D.email||null}}):(d({type:J.SESSION_SET,session:{kind:"nobody",email:null}}),S&&P(),h())});l.push(()=>{try{v()}catch{}})}let p=null;const f=v=>{const D=v.plans&&v.plans.status==="read"?[v.plans.list,v.route,v.env.today,v.draft&&v.draft.plan]:null;if(!D){p=null;return}if(p&&D.every((N,$)=>N===p[$]))return;p=D;let S=null;try{S=$m(v)}catch{S={today:v.env.today,rows:[],page:null}}S&&d({type:J.PLANS_VIEW,view:S})};f(t.getState()),l.push(Fm(t,{win:e,session:r,local:n,now:i,fb:o,handles:()=>({db:g,user:c||null,reread:()=>c&&g?y():Promise.resolve()})})),l.push(t.subscribe((v,D)=>{D.type===J.PLANS_READING&&T(),D.type===J.SESSION_OUT&&v.session.signingOut&&E(),f(v)}));const I=()=>d({type:J.PLANS_CLEAR}),_=v=>{v&&v.persisted&&(c!==void 0&&d({type:J.SESSION_SET,session:c?{kind:c.emailVerified?"in":"unverified",email:c.email||null}:{kind:"nobody",email:null}}),T())},A=()=>{e.document&&e.document.visibilityState==="visible"&&t.getState().plans===null&&T()};e.addEventListener("pagehide",I),e.addEventListener("pageshow",_),e.document&&e.document.addEventListener("visibilitychange",A),l.push(()=>{e.removeEventListener("pagehide",I),e.removeEventListener("pageshow",_),e.document&&e.document.removeEventListener("visibilitychange",A)});const k=e.setInterval(()=>{if(!c||!n)return;const v=Wa(n);v&&i().getTime()-v>za&&E()},Ym);return l.push(()=>e.clearInterval(k)),()=>{u=!0,l.splice(0).forEach(v=>v())}}export{Gm as APP_NAME,Um as GUEST_PLANS_KEY,Qm as startPlanSource,Ws as upgradedList,$m as viewFor,jm as windowPlans};
