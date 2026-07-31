/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=globalThis,e$2=t$1.ShadowRoot&&(void 0===t$1.ShadyCSS||t$1.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$2=Symbol(),o$4=new WeakMap;let n$3 = class n{constructor(t,e,o){if(this._$cssResult$=true,o!==s$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$2&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$4.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$4.set(s,t));}return t}toString(){return this.cssText}};const r$4=t=>new n$3("string"==typeof t?t:t+"",void 0,s$2),i$3=(t,...e)=>{const o=1===t.length?t[0]:e.reduce((e,s,o)=>e+(t=>{if(true===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1],t[0]);return new n$3(o,t,s$2)},S$1=(s,o)=>{if(e$2)s.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of o){const o=document.createElement("style"),n=t$1.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$2=e$2?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$4(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:i$2,defineProperty:e$1,getOwnPropertyDescriptor:h$1,getOwnPropertyNames:r$3,getOwnPropertySymbols:o$3,getPrototypeOf:n$2}=Object,a$1=globalThis,c$1=a$1.trustedTypes,l$1=c$1?c$1.emptyScript:"",p$1=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$1={toAttribute(t,s){switch(s){case Boolean:t=t?l$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$1=(t,s)=>!i$2(t,s),b$1={attribute:true,type:String,converter:u$1,reflect:false,useDefault:false,hasChanged:f$1};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;let y$1 = class y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b$1){if(s.state&&(s.attribute=false),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=true),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e$1(this.prototype,t,h);}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h$1(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i);},configurable:true,enumerable:true}}static getPropertyOptions(t){return this.elementProperties.get(t)??b$1}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$2(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=true,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...r$3(t),...o$3(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$2(s));}else void 0!==s&&i.push(c$2(s));return i}static _$Eu(t,s){const i=s.attribute;return  false===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=false,this.hasUpdated=false,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(true),this._$EO?.forEach(t=>t.hostConnected?.());}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.());}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&true===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u$1).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$1;this._$Em=e;const r=h.fromAttribute(s,t.type);this[e]=r??this._$Ej?.get(e)??r,this._$Em=null;}}requestUpdate(t,s,i,e=false,h){if(void 0!==t){const r=this.constructor;if(false===e&&(h=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??f$1)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,s,i);} false===this.isUpdatePending&&(this._$ES=this._$EP());}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),true!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),true===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t));}async _$EP(){this.isUpdatePending=true;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];true!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e);}}let t=false;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(s)):this._$EM();}catch(s){throw t=false,this._$EM(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=true,this.firstUpdated(t)),this.updated(t);}_$EM(){this._$AL=new Map,this.isUpdatePending=false;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return  true}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM();}updated(t){}firstUpdated(t){}};y$1.elementStyles=[],y$1.shadowRootOptions={mode:"open"},y$1[d$1("elementProperties")]=new Map,y$1[d$1("finalized")]=new Map,p$1?.({ReactiveElement:y$1}),(a$1.reactiveElementVersions??=[]).push("2.1.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,i$1=t=>t,s$1=t.trustedTypes,e=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,h="$lit$",o$2=`lit$${Math.random().toFixed(9).slice(2)}$`,n$1="?"+o$2,r$2=`<${n$1}>`,l=document,c=()=>l.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,d=t=>u(t)||"function"==typeof t?.[Symbol.iterator],f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,x=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),b=x(1),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l.createTreeWalker(l,129);function V(t,i){if(!u(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e?e.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v?"!--"===u[1]?c=_:void 0!==u[1]?c=m:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p):void 0!==u[3]&&(c=p):c===p?">"===u[0]?(c=n??v,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p:'"'===u[3]?$:g):c===$||c===g?c=p:c===_||c===m?c=v:(c=p,n=void 0);const x=c===p&&t[i+1].startsWith("/>")?" ":"";l+=c===v?s+r$2:d>=0?(e.push(a),s.slice(0,d)+h+s.slice(d)+o$2+x):s+o$2+(-2===d?i:x);}return [V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h)){const i=v[a++],s=r.getAttribute(t).split(o$2),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H}),r.removeAttribute(t);}else t.startsWith(o$2)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o$2),i=t.length-1;if(i>0){r.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c());}}}else if(8===r.nodeType)if(r.data===n$1)d.push({type:2,index:l});else {let t=-1;for(;-1!==(t=r.data.indexOf(o$2,t+1));)d.push({type:7,index:l}),t+=o$2.length-1;}l++;}}static createElement(t,i){const s=l.createElement("template");return s.innerHTML=t,s}}function M(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M(t,h._$AS(t,i.values),h,e)),i}class R{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l).importNode(i,true);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new k(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new Z(h,this,t)),this._$AV.push(i),r=s[++n];}o!==r?.index&&(h=P.nextNode(),o++);}return P.currentNode=l,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):d(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new R(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new k(this.O(c()),this.O(c()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(false,true,s);t!==this._$AB;){const s=i$1(t).nextSibling;i$1(t).remove(),t=s;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=M(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class I extends H{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}class L extends H{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A);}}class z extends H{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=M(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t);}}const B=t.litHtmlPolyfillSupport;B?.(S,k),(t.litHtmlVersions??=[]).push("3.3.3");const D=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new k(i.insertBefore(c(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=globalThis;class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=D(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(true);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(false);}render(){return E}}i._$litElement$=true,i["finalized"]=true,s.litElementHydrateSupport?.({LitElement:i});const o$1=s.litElementPolyfillSupport;o$1?.({LitElement:i});(s.litElementVersions??=[]).push("4.2.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const o={attribute:true,type:String,converter:u$1,reflect:false,hasChanged:f$1},r$1=(t=o,e,r)=>{const{kind:n,metadata:i}=r;let s=globalThis.litPropertyMetadata.get(i);if(void 0===s&&globalThis.litPropertyMetadata.set(i,s=new Map),"setter"===n&&((t=Object.create(t)).wrapped=true),s.set(r.name,t),"accessor"===n){const{name:o}=r;return {set(r){const n=e.get.call(this);e.set.call(this,r),this.requestUpdate(o,n,t,true,r);},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===n){const{name:o}=r;return function(r){const n=this[o];e.call(this,r),this.requestUpdate(o,n,t,true,r);}}throw Error("Unsupported decorator location: "+n)};function n(t){return (e,o)=>"object"==typeof o?r$1(t,e,o):((t,e,o)=>{const r=e.hasOwnProperty(o);return e.constructor.createProperty(o,t),r?Object.getOwnPropertyDescriptor(e,o):void 0})(t,e,o)}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function r(r){return n({...r,state:true,attribute:false})}

const DAYS = [
    ["lundi", "L"],
    ["mardi", "Ma"],
    ["mercredi", "Me"],
    ["jeudi", "J"],
    ["vendredi", "V"],
    ["samedi", "S"],
    ["dimanche", "D"],
];
const MODE_DAYS = {
    tous: DAYS.map(([d]) => d),
    semaine: ["lundi", "mardi", "mercredi", "jeudi", "vendredi"],
    weekend: ["samedi", "dimanche"],
};
class SmartwakeCard extends i {
    constructor() {
        super(...arguments);
        this._now = Date.now();
    }
    static getStubConfig() {
        return { entity: "switch.reveil_actif", name: "Réveil" };
    }
    setConfig(config) {
        if (!config.entity || !config.entity.startsWith("switch.")) {
            throw new Error("smartwake-card : « entity » doit être le switch SmartWAKE (switch.<nom>_actif)");
        }
        this._config = {
            show_stats: true,
            show_context: true,
            show_settings: true,
            ...config,
        };
    }
    getCardSize() {
        return 4;
    }
    connectedCallback() {
        super.connectedCallback();
        this._tick = window.setInterval(() => (this._now = Date.now()), 30_000);
    }
    disconnectedCallback() {
        if (this._tick)
            window.clearInterval(this._tick);
        super.disconnectedCallback();
    }
    /* ---------- Résolution des entités ---------- */
    get _base() {
        return this._config.entity
            .replace(/^switch\./, "")
            .replace(/_actif$/, "");
    }
    _st(entityId) {
        return this.hass?.states[entityId];
    }
    _e(domain, suffix) {
        return this._st(`${domain}.${this._base}_${suffix}`);
    }
    /* ---------- Données dérivées ---------- */
    get _statut() {
        return this._e("sensor", "statut")?.state ?? "idle";
    }
    get _isOn() {
        return this._st(this._config.entity)?.state === "on";
    }
    get _heure() {
        const t = this._e("time", "heure")?.state ?? "--:--";
        return t.substring(0, 5);
    }
    _activeDays() {
        const sel = this._e("select", "jours");
        if (!sel)
            return null;
        const attr = sel.attributes.jours_actifs ?? sel.attributes.days;
        if (Array.isArray(attr))
            return attr.map((d) => String(d).toLowerCase());
        const mode = sel.state.toLowerCase();
        return MODE_DAYS[mode] ?? null;
    }
    _countdown() {
        const next = this._e("sensor", "prochain_reveil")?.state;
        if (!next || next === "unknown" || next === "unavailable")
            return null;
        const target = new Date(next).getTime();
        if (isNaN(target))
            return null;
        const d = Math.max(0, Math.round((target - this._now) / 1000));
        const h = Math.floor(d / 3600);
        const m = Math.floor((d % 3600) / 60);
        if (h >= 48)
            return `dans ${Math.round(h / 24)} jours`;
        return h > 0 ? `dans ${h} h ${String(m).padStart(2, "0")} min` : `dans ${m} min`;
    }
    _subtitle() {
        const s = this._statut;
        if (s === "ringing") {
            const n = this._e("sensor", "snooze_count")?.state ?? "0";
            return n !== "0" ? `Snooze utilisés : ${n}` : "Debout !";
        }
        if (s === "snoozed") {
            const min = this._e("number", "snooze_min")?.state;
            return min ? `Re-sonne dans ${parseInt(min)} min` : "Snooze en cours";
        }
        if (s === "prewake")
            return "La maison se prépare";
        if (!this._isOn)
            return "Désactivé";
        const parts = [];
        if (this._e("binary_sensor", "sonne_aujourd_hui")?.state === "on") {
            parts.push("Sonne aujourd'hui");
        }
        else {
            parts.push("Inactif aujourd'hui");
        }
        if (this._e("binary_sensor", "jour_ferie")?.state === "on")
            parts.push("férié");
        if (this._e("binary_sensor", "vacances_scolaires")?.state === "on")
            parts.push("vacances sco");
        return parts.join(" · ");
    }
    /* ---------- Actions ---------- */
    _svc(service) {
        this.hass.callService("smartwake", service, {}, { entity_id: this._config.entity });
    }
    _toggle() {
        this.hass.callService("switch", this._isOn ? "turn_off" : "turn_on", {}, { entity_id: this._config.entity });
    }
    _pressButton(suffix) {
        const btn = this._e("button", suffix);
        if (btn) {
            this.hass.callService("button", "press", {}, { entity_id: btn.entity_id });
        }
    }
    _moreInfo(entityId) {
        if (!entityId)
            return;
        const ev = new CustomEvent("hass-more-info", {
            bubbles: true,
            composed: true,
            detail: { entityId },
        });
        this.dispatchEvent(ev);
    }
    /* ---------- Rendu ---------- */
    render() {
        if (!this._config || !this.hass)
            return b ``;
        if (!this._st(this._config.entity)) {
            return b `<ha-card class="card">
        <div class="err">Entité introuvable : ${this._config.entity}</div>
      </ha-card>`;
        }
        const ringing = this._statut === "ringing";
        return ringing ? this._renderRinging() : this._renderNormal();
    }
    _renderNormal() {
        const on = this._isOn;
        const countdown = this._countdown();
        return b `
      <ha-card class="card ${on ? "" : "dim"}">
        <div class="header">
          <div class="id">
            <div class="badge ${on ? "amber" : "off"}">
              <ha-icon icon="mdi:alarm"></ha-icon>
            </div>
            <div class="titles">
              <div class="name">${this._config.name ?? "SmartWAKE"}</div>
              <div class="sub">${this._subtitle()}</div>
            </div>
          </div>
          <ha-switch .checked=${on} @change=${this._toggle}></ha-switch>
        </div>

        <div
          class="time"
          @click=${() => this._moreInfo(this._e("time", "heure")?.entity_id)}
        >
          <span class="big">${this._heure}</span>
          ${on && countdown ? b `<span class="cd">${countdown}</span>` : A}
        </div>

        ${this._renderDays()}
        ${this._config.show_context ? this._renderChips() : A}
        ${this._renderQuickActions()}
        ${this._config.show_settings ? this._renderFooter() : A}
      </ha-card>
    `;
    }
    _renderDays() {
        const active = this._activeDays();
        const sel = this._e("select", "jours");
        return b `
      <div class="days" @click=${() => this._moreInfo(sel?.entity_id)}>
        ${DAYS.map(([day, label]) => {
            const isOn = active ? active.includes(day) : false;
            return b `<div class="day ${isOn ? "on" : ""}">${label}</div>`;
        })}
        ${!active && sel
            ? b `<span class="mode">${sel.state}</span>`
            : A}
      </div>
    `;
    }
    _renderChips() {
        const chip = (suffix, icon, label) => {
            const ent = this._e("binary_sensor", suffix);
            if (!ent)
                return A;
            const on = ent.state === "on";
            return b `<div
        class="chip ${on ? "teal" : ""}"
        @click=${() => this._moreInfo(ent.entity_id)}
      >
        <ha-icon icon="${icon}"></ha-icon>${label}
      </div>`;
        };
        return b `
      <div class="chips">
        ${chip("jour_ferie", "mdi:calendar-remove", "Férié")}
        ${chip("weekend", "mdi:glass-cocktail", "Weekend")}
        ${chip("vacances_scolaires", "mdi:beach", "Vacances sco")}
      </div>
    `;
    }
    _renderQuickActions() {
        return b `
      <div class="chips">
        <div class="chip act" @click=${() => this._pressButton("sauter_prochain")}>
          <ha-icon icon="mdi:skip-next"></ha-icon>Skip 1×
        </div>
        <div class="chip act" @click=${() => this._pressButton("declencher")}>
          <ha-icon icon="mdi:play"></ha-icon>Test
        </div>
        ${this._config.show_stats ? this._renderStats() : A}
      </div>
    `;
    }
    _renderStats() {
        const n = this._e("sensor", "snooze_count")?.state;
        if (n === undefined)
            return A;
        return b `<div class="chip stat">
      <ha-icon icon="mdi:alarm-snooze"></ha-icon>${n} snooze
    </div>`;
    }
    _renderFooter() {
        const num = (suffix) => {
            const e = this._e("number", suffix);
            return e ? String(parseInt(e.state)) : null;
        };
        const chauffe = num("pre_chauffage_min");
        const aube = num("aube_min");
        const vol = this._e("number", "volume_final")?.state;
        return b `
      <div class="footer">
        <div class="specs">
          ${vol !== undefined
            ? b `<span
                @click=${() => this._moreInfo(this._e("number", "volume_final")?.entity_id)}
                ><ha-icon icon="mdi:music"></ha-icon>${Math.round(parseFloat(vol) * 100)} %</span>`
            : A}
          ${chauffe
            ? b `<span
                @click=${() => this._moreInfo(this._e("number", "pre_chauffage_min")?.entity_id)}
                ><ha-icon icon="mdi:fire"></ha-icon>−${chauffe} min</span>`
            : A}
          ${aube
            ? b `<span
                @click=${() => this._moreInfo(this._e("number", "aube_min")?.entity_id)}
                ><ha-icon icon="mdi:weather-sunset-up"></ha-icon>${aube}
                min</span>`
            : A}
        </div>
        <ha-icon
          class="chev"
          icon="mdi:chevron-right"
          @click=${() => this._moreInfo(this._config.entity)}
        ></ha-icon>
      </div>
    `;
    }
    _renderRinging() {
        const snoozeMin = this._e("number", "snooze_min")?.state;
        const escaladeMin = this._e("number", "escalade_min")?.state;
        return b `
      <ha-card class="card ringing">
        <div class="header">
          <div class="id">
            <div class="badge solid">
              <ha-icon icon="mdi:bell-ring"></ha-icon>
            </div>
            <div class="titles">
              <div class="name ring-name">Ça sonne</div>
              <div class="sub">${this._subtitle()}</div>
            </div>
          </div>
        </div>

        <div class="time"><span class="big">${this._heure}</span></div>

        <div class="actions">
          <button class="btn snooze" @click=${() => this._svc("snooze")}>
            <ha-icon icon="mdi:alarm-snooze"></ha-icon>
            <span>Snooze${snoozeMin ? ` ${parseInt(snoozeMin)} min` : ""}</span>
          </button>
          <button class="btn stop" @click=${() => this._svc("stop")}>
            <ha-icon icon="mdi:alarm-off"></ha-icon>
            <span>Stop</span>
          </button>
        </div>

        ${escaladeMin
            ? b `<div class="footer esc">
              <ha-icon icon="mdi:progress-clock"></ha-icon>
              Escalade après ${parseInt(escaladeMin)} min · lumières 100 % +
              volume max
            </div>`
            : A}
      </ha-card>
    `;
    }
}
/* ---------- Styles ---------- */
SmartwakeCard.styles = i$3 `
    :host {
      --sw-amber: #ef9f27;
      --sw-amber-bg: rgba(239, 159, 39, 0.16);
      --sw-amber-text: #b87514;
      --sw-teal-bg: rgba(29, 158, 117, 0.15);
      --sw-teal-text: var(--success-color, #0f6e56);
      --sw-red-bg: rgba(226, 75, 74, 0.12);
      --sw-red-text: var(--error-color, #a32d2d);
    }
    .card {
      padding: 18px 20px;
      border-radius: var(--ha-card-border-radius, 12px);
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .card.dim .big,
    .card.dim .days,
    .card.dim .chips {
      opacity: 0.55;
    }
    .err {
      color: var(--error-color);
      font-size: 13px;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .id {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }
    .badge {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: none;
    }
    .badge.amber {
      background: var(--sw-amber-bg);
      color: var(--sw-amber);
    }
    .badge.off {
      background: var(--secondary-background-color);
      color: var(--disabled-text-color);
    }
    .badge.solid {
      background: var(--sw-amber);
      color: #fff;
    }
    .badge ha-icon {
      --mdc-icon-size: 20px;
    }
    .titles {
      min-width: 0;
    }
    .name {
      font-size: 13px;
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .ring-name {
      color: var(--sw-amber-text);
    }
    .sub {
      font-size: 12px;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .time {
      display: flex;
      align-items: baseline;
      gap: 10px;
      cursor: pointer;
    }
    .big {
      font-size: 44px;
      font-weight: 600;
      letter-spacing: -1px;
      line-height: 1;
      color: var(--primary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .cd {
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .days {
      display: flex;
      gap: 6px;
      align-items: center;
      cursor: pointer;
    }
    .day {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      background: var(--secondary-background-color);
      color: var(--disabled-text-color);
      transition: background 0.15s ease;
    }
    .day.on {
      background: var(--sw-amber-bg);
      color: var(--sw-amber-text);
      font-weight: 600;
    }
    .mode {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin-left: 4px;
      text-transform: capitalize;
    }
    .chips {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 12px;
      padding: 5px 10px;
      border-radius: 14px;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
      cursor: pointer;
      user-select: none;
    }
    .chip ha-icon {
      --mdc-icon-size: 14px;
    }
    .chip.teal {
      background: var(--sw-teal-bg);
      color: var(--sw-teal-text);
    }
    .chip.act:active {
      transform: scale(0.96);
    }
    .chip.stat {
      cursor: default;
      margin-left: auto;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid var(--divider-color);
      padding-top: 10px;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .specs {
      display: flex;
      gap: 14px;
    }
    .specs span {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      cursor: pointer;
    }
    .specs ha-icon,
    .footer ha-icon {
      --mdc-icon-size: 14px;
    }
    .chev {
      cursor: pointer;
      --mdc-icon-size: 16px;
    }
    /* --- État sonnerie --- */
    .card.ringing {
      border: 2px solid var(--sw-amber);
      animation: sw-pulse 2s infinite;
    }
    @keyframes sw-pulse {
      0%,
      100% {
        box-shadow: 0 0 0 0 rgba(239, 159, 39, 0.35);
      }
      50% {
        box-shadow: 0 0 0 8px rgba(239, 159, 39, 0);
      }
    }
    .actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .btn {
      border: none;
      border-radius: 10px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      transition: transform 0.1s ease;
    }
    .btn:active {
      transform: scale(0.97);
    }
    .btn ha-icon {
      --mdc-icon-size: 24px;
    }
    .btn.snooze {
      background: var(--secondary-background-color);
      color: var(--sw-amber-text);
    }
    .btn.stop {
      background: var(--sw-red-bg);
      color: var(--sw-red-text);
    }
    .footer.esc {
      justify-content: flex-start;
      gap: 6px;
    }
  `;
__decorate([
    n({ attribute: false })
], SmartwakeCard.prototype, "hass", void 0);
__decorate([
    r()
], SmartwakeCard.prototype, "_config", void 0);
__decorate([
    r()
], SmartwakeCard.prototype, "_now", void 0);
customElements.define("smartwake-card", SmartwakeCard);
window.customCards = window.customCards || [];
window.customCards.push({
    type: "smartwake-card",
    name: "SmartWAKE Card",
    description: "Carte réveil pour SmartWAKE : heure, jours, contexte, snooze/stop.",
    preview: true,
});
//# sourceMappingURL=smartwake-card.js.map
