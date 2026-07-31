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
const t=globalThis,i$1=t=>t,s$1=t.trustedTypes,e=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,h="$lit$",o$2=`lit$${Math.random().toFixed(9).slice(2)}$`,n$1="?"+o$2,r$2=`<${n$1}>`,l=document,c=()=>l.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,d=t=>u(t)||"function"==typeof t?.[Symbol.iterator],f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,x=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),b=x(1),w=x(2),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l.createTreeWalker(l,129);function V(t,i){if(!u(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e?e.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v?"!--"===u[1]?c=_:void 0!==u[1]?c=m:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p):void 0!==u[3]&&(c=p):c===p?">"===u[0]?(c=n??v,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p:'"'===u[3]?$:g):c===$||c===g?c=p:c===_||c===m?c=v:(c=p,n=void 0);const x=c===p&&t[i+1].startsWith("/>")?" ":"";l+=c===v?s+r$2:d>=0?(e.push(a),s.slice(0,d)+h+s.slice(d)+o$2+x):s+o$2+(-2===d?i:x);}return [V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h)){const i=v[a++],s=r.getAttribute(t).split(o$2),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H}),r.removeAttribute(t);}else t.startsWith(o$2)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o$2),i=t.length-1;if(i>0){r.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c());}}}else if(8===r.nodeType)if(r.data===n$1)d.push({type:2,index:l});else {let t=-1;for(;-1!==(t=r.data.indexOf(o$2,t+1));)d.push({type:7,index:l}),t+=o$2.length-1;}l++;}}static createElement(t,i){const s=l.createElement("template");return s.innerHTML=t,s}}function M(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M(t,h._$AS(t,i.values),h,e)),i}class R{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l).importNode(i,true);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new k(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new Z(h,this,t)),this._$AV.push(i),r=s[++n];}o!==r?.index&&(h=P.nextNode(),o++);}return P.currentNode=l,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):d(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new R(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new k(this.O(c()),this.O(c()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(false,true,s);t!==this._$AB;){const s=i$1(t).nextSibling;i$1(t).remove(),t=s;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=M(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class I extends H{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}class L extends H{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A);}}class z extends H{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=M(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t);}}const B=t.litHtmlPolyfillSupport;B?.(S,k),(t.litHtmlVersions??=[]).push("3.3.3");const D=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new k(i.insertBefore(c(),t),t,void 0,s??{});}return h._$AI(t),h};

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
/* Options réelles du select : tous | semaine | weekend | personnalise */
const MODE_DAYS = {
    tous: DAYS.map(([d]) => d),
    semaine: ["lundi", "mardi", "mercredi", "jeudi", "vendredi"],
    weekend: ["samedi", "dimanche"],
};
const MODE_LABEL = {
    tous: "Tous les jours",
    semaine: "Lundi au vendredi",
    weekend: "Samedi et dimanche",
    personnalise: "Personnalisé",
};
/* Valeurs réelles du sensor de statut (device_class enum) */
const STATUS_LABEL = {
    prewake: "La maison se prépare"};
const RING_R = 19;
const RING_C = 2 * Math.PI * RING_R;
class SmartwakeCard extends i {
    constructor() {
        super(...arguments);
        this._now = Date.now();
        this._open = false;
        this._tickMs = 0;
    }
    static getStubConfig() {
        return { entity: "switch.reveil_actif", name: "Réveil" };
    }
    /* Éditeur visuel dans l'UI Lovelace */
    static getConfigElement() {
        return document.createElement("smartwake-card-editor");
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
        return 5;
    }
    connectedCallback() {
        super.connectedCallback();
        this._startTick(30_000);
    }
    disconnectedCallback() {
        if (this._tick)
            window.clearInterval(this._tick);
        this._tick = undefined;
        this._tickMs = 0;
        super.disconnectedCallback();
    }
    _startTick(ms) {
        if (this._tick)
            window.clearInterval(this._tick);
        this._tickMs = ms;
        this._tick = window.setInterval(() => (this._now = Date.now()), ms);
    }
    /* Rafraîchissement accéléré pendant le prewake pour une progression fluide */
    updated() {
        if (!this._config || !this.hass || !this._tick)
            return;
        const wanted = this._statut === "prewake" ? 5_000 : 30_000;
        if (wanted !== this._tickMs)
            this._startTick(wanted);
    }
    /* ---------- Résolution des entités ---------- */
    get _base() {
        return this._config.entity.replace(/^switch\./, "").replace(/_actif$/, "");
    }
    _st(entityId) {
        return this.hass?.states[entityId];
    }
    _e(domain, suffix) {
        return this._st(`${domain}.${this._base}_${suffix}`);
    }
    _num(suffix) {
        const e = this._e("number", suffix);
        if (!e)
            return null;
        const v = parseFloat(e.state);
        return isNaN(v) ? null : v;
    }
    _isOnBs(suffix) {
        return this._e("binary_sensor", suffix)?.state === "on";
    }
    /* ---------- Données dérivées ---------- */
    get _statut() {
        return this._e("sensor", "statut")?.state ?? "inactif";
    }
    get _isOn() {
        return this._st(this._config.entity)?.state === "on";
    }
    /* Heure de référence configurée (time.heure) */
    get _heureConfig() {
        const t = this._e("time", "heure")?.state ?? "--:--";
        return t.substring(0, 5);
    }
    /* Heure réellement planifiée, déduite de sensor.prochain_reveil.
     * Peut différer de time.heure dans trois cas gérés par l'intégration :
     * mode_heure = par_jour, agenda adaptatif, phase de sommeil. */
    get _heureEffective() {
        const ts = this._nextTs();
        if (ts === null)
            return null;
        const d = new Date(ts);
        return (String(d.getHours()).padStart(2, "0") +
            ":" +
            String(d.getMinutes()).padStart(2, "0"));
    }
    /* L'heure affichée est celle qui sonnera réellement */
    get _heure() {
        return this._heureEffective ?? this._heureConfig;
    }
    get _heureAjustee() {
        const eff = this._heureEffective;
        return eff !== null && eff !== this._heureConfig;
    }
    _activeDays() {
        const sel = this._e("select", "jours");
        if (!sel)
            return null;
        return MODE_DAYS[sel.state.toLowerCase()] ?? null;
    }
    _nextTs() {
        const next = this._e("sensor", "prochain_reveil")?.state;
        if (!next || next === "unknown" || next === "unavailable")
            return null;
        const t = new Date(next).getTime();
        return isNaN(t) ? null : t;
    }
    _countdown() {
        const target = this._nextTs();
        if (target === null)
            return null;
        const d = Math.max(0, Math.round((target - this._now) / 1000));
        const h = Math.floor(d / 3600);
        const m = Math.floor((d % 3600) / 60);
        if (h >= 48)
            return `dans ${Math.round(h / 24)} jours`;
        return h > 0
            ? `dans ${h} h ${String(m).padStart(2, "0")} min`
            : `dans ${m} min`;
    }
    /* Le prewake démarre à H − max(pré-chauffage, aube) — cf. coordinator */
    _prewake() {
        if (this._statut !== "prewake")
            return null;
        const target = this._nextTs();
        if (target === null)
            return null;
        const total = Math.max(this._num("aube_min") ?? 0, this._num("pre_chauffage_min") ?? 0);
        if (total <= 0)
            return null;
        const start = target - total * 60_000;
        const span = target - start;
        const pct = Math.min(1, Math.max(0, (this._now - start) / span));
        const reste = Math.max(0, Math.ceil((target - this._now) / 60_000));
        return { pct, reste, total };
    }
    _snoozeInfo() {
        const used = parseInt(this._e("sensor", "snooze_utilises")?.state ?? "0");
        return { used: isNaN(used) ? 0 : used, max: this._num("max_snooze") };
    }
    _subtitle() {
        const s = this._statut;
        if (s === "ringing") {
            const { used, max } = this._snoozeInfo();
            if (used > 0)
                return `Snooze ${used}${max !== null ? `/${max}` : ""} utilisé${used > 1 ? "s" : ""}`;
            return "Debout !";
        }
        if (s === "snoozed") {
            const min = this._num("snooze_min");
            return min !== null ? `Re-sonne dans ${min} min` : "Snooze en cours";
        }
        if (s === "prewake") {
            const p = this._prewake();
            return p ? `Préparation · ${p.reste} min avant sonnerie` : STATUS_LABEL.prewake;
        }
        if (!this._isOn || s === "inactif")
            return "Désactivé";
        const parts = [];
        parts.push(this._isOnBs("sonne_aujourd_hui") ? "Sonne aujourd'hui" : "Inactif aujourd'hui");
        if (this._isOnBs("jour_ferie"))
            parts.push("férié");
        if (this._isOnBs("vacances_scolaires"))
            parts.push("vacances sco");
        return parts.join(" · ");
    }
    /* ---------- Actions ---------- */
    _svc(service) {
        this.hass.callService("smartwake", service, {
            entity_id: [this._config.entity],
        });
    }
    _toggle() {
        this.hass.callService("switch", this._isOn ? "turn_off" : "turn_on", {
            entity_id: this._config.entity,
        });
    }
    /* ---------- Écritures ---------- */
    _setHeure(value) {
        const ent = this._e("time", "heure");
        if (!ent || !/^\d{2}:\d{2}/.test(value))
            return;
        this.hass.callService("time", "set_value", {
            entity_id: ent.entity_id,
            time: value.length === 5 ? `${value}:00` : value,
        });
    }
    /* Décale l'heure de référence de N minutes (peut être négatif) */
    _shiftHeure(deltaMin) {
        const cur = this._heureConfig;
        const [h, m] = cur.split(":").map((n) => parseInt(n));
        if (isNaN(h) || isNaN(m))
            return;
        let total = (h * 60 + m + deltaMin) % 1440;
        if (total < 0)
            total += 1440;
        const nh = String(Math.floor(total / 60)).padStart(2, "0");
        const nm = String(total % 60).padStart(2, "0");
        this._setHeure(`${nh}:${nm}`);
    }
    _setJours(mode) {
        const ent = this._e("select", "jours");
        if (!ent)
            return;
        this.hass.callService("select", "select_option", {
            entity_id: ent.entity_id,
            option: mode,
        });
    }
    _setNumber(suffix, value) {
        const ent = this._e("number", suffix);
        if (!ent)
            return;
        const min = parseFloat(ent.attributes.min ?? "0");
        const max = parseFloat(ent.attributes.max ?? "100");
        const clamped = Math.min(max, Math.max(min, value));
        this.hass.callService("number", "set_value", {
            entity_id: ent.entity_id,
            value: clamped,
        });
    }
    _stepNumber(suffix, dir) {
        const ent = this._e("number", suffix);
        const cur = this._num(suffix);
        if (!ent || cur === null)
            return;
        const step = parseFloat(ent.attributes.step ?? "1") || 1;
        const next = cur + dir * step;
        /* Évite les artefacts de flottants sur les steps à 0.01 */
        this._setNumber(suffix, Math.round(next * 100) / 100);
    }
    _moreInfo(entityId) {
        if (!entityId)
            return;
        this.dispatchEvent(new CustomEvent("hass-more-info", {
            bubbles: true,
            composed: true,
            detail: { entityId },
        }));
    }
    /* ---------- Rendu ---------- */
    render() {
        if (!this._config || !this.hass)
            return b ``;
        if (!this._st(this._config.entity)) {
            return b `<ha-card class="card">
        <div class="err">
          <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
          Entité introuvable : ${this._config.entity}
        </div>
      </ha-card>`;
        }
        return this._statut === "ringing" ? this._renderRinging() : this._renderNormal();
    }
    _renderNormal() {
        const on = this._isOn;
        const statut = this._statut;
        const prewake = this._prewake();
        const countdown = this._countdown();
        return b `
      <ha-card class="card ${on ? "" : "dim"} ${statut === "prewake" ? "prewake" : ""}">
        <div class="header">
          <div class="id">
            <div class="badge-wrap">
              <div class="badge ${on ? (statut === "snoozed" ? "snooze" : "amber") : "off"}">
                <ha-icon
                  icon=${statut === "snoozed" ? "mdi:alarm-snooze" : on ? "mdi:alarm" : "mdi:alarm-off"}
                ></ha-icon>
              </div>
              ${prewake ? this._renderRing(prewake.pct) : A}
            </div>
            <div class="titles">
              <div class="name">${this._config.name ?? "SmartWAKE"}</div>
              <div class="sub">${this._subtitle()}</div>
            </div>
          </div>
          <ha-switch .checked=${on} @change=${this._toggle}></ha-switch>
        </div>

        <div class="time" @click=${() => this._moreInfo(this._e("time", "heure")?.entity_id)}>
          <span class="big">${this._heure}</span>
          <div class="time-meta">
            ${on && countdown ? b `<span class="cd">${countdown}</span>` : A}
            ${on && this._heureAjustee
            ? b `<span
                  class="adj"
                  title="L'heure planifiée diffère de l'heure de référence (${this
                ._heureConfig}) : heures par jour, agenda adaptatif ou phase de sommeil."
                >
                  <ha-icon icon="mdi:calendar-sync"></ha-icon>ajustée depuis
                  ${this._heureConfig}
                </span>`
            : A}
          </div>
        </div>

        ${prewake ? this._renderPrewakeBar(prewake) : A}
        ${this._renderDays()}
        ${this._config.show_context ? this._renderChips() : A}
        ${this._renderQuickActions()}
        ${this._config.show_settings ? this._renderFooter() : A}
        ${this._config.show_stats ? this._renderStats() : A}
      </ha-card>
    `;
    }
    _renderRing(pct) {
        return b `
      <svg class="ring" viewBox="0 0 44 44" aria-hidden="true">
        ${w `
          <circle class="ring-bg" cx="22" cy="22" r=${RING_R}></circle>
          <circle
            class="ring-fg"
            cx="22" cy="22" r=${RING_R}
            stroke-dasharray=${RING_C}
            stroke-dashoffset=${RING_C * (1 - pct)}
          ></circle>
        `}
      </svg>
    `;
    }
    _renderPrewakeBar(p) {
        const aube = this._num("aube_min");
        const chauffe = this._num("pre_chauffage_min");
        const legend = [];
        if (aube)
            legend.push(`aube ${aube} min`);
        if (chauffe)
            legend.push(`chauffe ${chauffe} min`);
        return b `
      <div class="prewake-block">
        <div class="bar"><div class="bar-fill" style="width:${(p.pct * 100).toFixed(1)}%"></div></div>
        <div class="bar-legend">
          <span>${Math.round(p.pct * 100)} % · ${p.reste} min restantes</span>
          ${legend.length ? b `<span>${legend.join(" · ")}</span>` : A}
        </div>
      </div>
    `;
    }
    _renderDays() {
        const sel = this._e("select", "jours");
        const active = this._activeDays();
        const mode = sel?.state.toLowerCase() ?? "";
        return b `
      <div class="days" @click=${() => this._moreInfo(sel?.entity_id)}>
        ${DAYS.map(([day, label]) => b `<div class="day ${active?.includes(day) ? "on" : ""}">${label}</div>`)}
        ${!active && sel
            ? b `<span class="mode">${MODE_LABEL[mode] ?? sel.state}</span>`
            : A}
      </div>
    `;
    }
    _renderChips() {
        const chip = (suffix, icon, label) => {
            const ent = this._e("binary_sensor", suffix);
            if (!ent)
                return A;
            return b `<div
        class="chip ${ent.state === "on" ? "teal" : ""}"
        @click=${() => this._moreInfo(ent.entity_id)}
      >
        <ha-icon icon=${icon}></ha-icon>${label}
      </div>`;
        };
        return b `
      <div class="chips">
        ${chip("jour_ferie", "mdi:calendar-remove", "Férié")}
        ${chip("weekend", "mdi:calendar-weekend", "Weekend")}
        ${chip("vacances_scolaires", "mdi:school", "Vacances sco")}
        ${chip("reveil_en_cours", "mdi:alarm-bell", "En cours")}
      </div>
    `;
    }
    _renderQuickActions() {
        const { used, max } = this._snoozeInfo();
        return b `
      <div class="chips">
        <div class="chip act" @click=${() => this._svc("sauter_prochain")}>
          <ha-icon icon="mdi:skip-next"></ha-icon>Skip 1×
        </div>
        <div class="chip act" @click=${() => this._svc("declencher")}>
          <ha-icon icon="mdi:bell-ring"></ha-icon>Test
        </div>
        <div class="chip act" @click=${() => this._svc("reset")}>
          <ha-icon icon="mdi:restart"></ha-icon>Reset
        </div>
        ${used > 0
            ? b `<div class="chip stat-chip">
              <ha-icon icon="mdi:alarm-snooze"></ha-icon>${used}${max !== null ? `/${max}` : ""}
            </div>`
            : A}
      </div>
    `;
    }
    _renderFooter() {
        const spec = (suffix, icon, fmt) => {
            const v = this._num(suffix);
            if (v === null)
                return A;
            return b `<span @click=${() => this._moreInfo(this._e("number", suffix)?.entity_id)}>
        <ha-icon icon=${icon}></ha-icon>${fmt(v)}
      </span>`;
        };
        return b `
      <div class="footer">
        <div class="specs">
          ${spec("volume_final", "mdi:volume-high", (v) => `${Math.round(v * 100)} %`)}
          ${spec("luminosite_max", "mdi:brightness-5", (v) => `${Math.round((v / 255) * 100)} %`)}
          ${spec("pre_chauffage_min", "mdi:radiator", (v) => `−${v} min`)}
          ${spec("aube_min", "mdi:weather-sunset-up", (v) => `${v} min`)}
          ${spec("cafe_avant_min", "mdi:coffee", (v) => `${v} min`)}
        </div>
        <ha-icon
          class="chev ${this._open ? "open" : ""}"
          icon="mdi:chevron-down"
          title="Régler"
          @click=${() => (this._open = !this._open)}
        ></ha-icon>
      </div>
      ${this._open ? this._renderSettings() : A}
    `;
    }
    /* Panneau de réglages éditable */
    _renderSettings() {
        const sel = this._e("select", "jours");
        const mode = sel?.state.toLowerCase() ?? "";
        const stepper = (suffix, label, fmt) => {
            const v = this._num(suffix);
            if (v === null)
                return A;
            const ent = this._e("number", suffix);
            const min = parseFloat(ent.attributes.min ?? "0");
            const max = parseFloat(ent.attributes.max ?? "100");
            return b `
        <div class="row">
          <span class="row-label" @click=${() => this._moreInfo(ent.entity_id)}>${label}</span>
          <div class="stepper">
            <button ?disabled=${v <= min} @click=${() => this._stepNumber(suffix, -1)}>
              <ha-icon icon="mdi:minus"></ha-icon>
            </button>
            <span class="row-val">${fmt(v)}</span>
            <button ?disabled=${v >= max} @click=${() => this._stepNumber(suffix, 1)}>
              <ha-icon icon="mdi:plus"></ha-icon>
            </button>
          </div>
        </div>
      `;
        };
        return b `
      <div class="settings">
        <div class="row">
          <span class="row-label">
            ${this._heureAjustee ? "Heure de référence" : "Heure"}
          </span>
          <div class="stepper">
            <button @click=${() => this._shiftHeure(-5)}><ha-icon icon="mdi:minus"></ha-icon></button>
            <input
              class="time-input"
              type="time"
              .value=${this._heureConfig}
              @change=${(e) => this._setHeure(e.target.value)}
            />
            <button @click=${() => this._shiftHeure(5)}><ha-icon icon="mdi:plus"></ha-icon></button>
          </div>
        </div>
        ${this._heureAjustee
            ? b `<div class="hint">
              Le prochain réveil est planifié à ${this._heureEffective}. Les heures
              par jour, l'agenda adaptatif et la phase de sommeil se configurent
              dans les options de l'intégration.
            </div>`
            : A}

        ${sel
            ? b `<div class="row wrap">
              <span class="row-label">Jours</span>
              <div class="modes">
                ${["tous", "semaine", "weekend", "personnalise"].map((m) => b `<button
                    class="mode-btn ${mode === m ? "sel" : ""}"
                    @click=${() => this._setJours(m)}
                  >
                    ${MODE_LABEL[m]}
                  </button>`)}
              </div>
            </div>`
            : A}

        ${stepper("snooze_min", "Durée snooze", (v) => `${v} min`)}
        ${stepper("max_snooze", "Snooze max", (v) => `${v}`)}
        ${stepper("aube_min", "Aube", (v) => `${v} min`)}
        ${stepper("pre_chauffage_min", "Pré-chauffage", (v) => `${v} min`)}
        ${stepper("duree_eclairage_min", "Durée éclairage", (v) => `${v} min`)}
        ${stepper("luminosite_max", "Luminosité max", (v) => `${Math.round((v / 255) * 100)} %`)}
        ${stepper("escalade_min", "Escalade", (v) => `${v} min`)}
        ${stepper("volume_initial", "Volume initial", (v) => `${Math.round(v * 100)} %`)}
        ${stepper("volume_final", "Volume final", (v) => `${Math.round(v * 100)} %`)}
        ${stepper("cafe_avant_min", "Café avant", (v) => `${v} min`)}

        <div class="row">
          <span class="row-label">Fiche complète</span>
          <button class="mode-btn" @click=${() => this._moreInfo(this._config.entity)}>
            Ouvrir
          </button>
        </div>
      </div>
    `;
    }
    _renderStats() {
        const cell = (suffix, label) => {
            const e = this._e("sensor", suffix);
            if (!e)
                return A;
            return b `<div class="stat" @click=${() => this._moreInfo(e.entity_id)}>
        <div class="stat-v">${e.state}</div>
        <div class="stat-l">${label}</div>
      </div>`;
        };
        const dernier = this._e("sensor", "dernier_reveil");
        let dernierTxt = null;
        if (dernier && !["unknown", "unavailable", ""].includes(dernier.state)) {
            const d = new Date(dernier.state);
            if (!isNaN(d.getTime())) {
                dernierTxt =
                    d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }) +
                        " à " +
                        d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
            }
        }
        return b `
      <div class="stats">
        ${cell("declenchements_total", "Réveils")}
        ${cell("snoozes_total", "Snoozes")}
        ${cell("stops_total", "Stops")}
      </div>
      ${dernierTxt
            ? b `<div class="last" @click=${() => this._moreInfo(dernier?.entity_id)}>
            <ha-icon icon="mdi:history"></ha-icon>Dernier réveil : ${dernierTxt}
          </div>`
            : A}
    `;
    }
    _renderRinging() {
        const snoozeMin = this._num("snooze_min");
        const escaladeMin = this._num("escalade_min");
        const { used, max } = this._snoozeInfo();
        const snoozeLeft = max === null ? null : Math.max(0, max - used);
        const canSnooze = snoozeLeft === null || snoozeLeft > 0;
        return b `
      <ha-card class="card ringing">
        <div class="header">
          <div class="id">
            <div class="badge-wrap">
              <div class="badge solid"><ha-icon icon="mdi:bell-ring"></ha-icon></div>
            </div>
            <div class="titles">
              <div class="name ring-name">Ça sonne</div>
              <div class="sub">${this._subtitle()}</div>
            </div>
          </div>
        </div>

        <div class="time"><span class="big">${this._heure}</span></div>

        <div class="actions">
          <button class="btn snooze" ?disabled=${!canSnooze} @click=${() => this._svc("snooze")}>
            <ha-icon icon="mdi:alarm-snooze"></ha-icon>
            <span>
              ${canSnooze
            ? `Snooze${snoozeMin !== null ? ` ${snoozeMin} min` : ""}`
            : "Plus de snooze"}
            </span>
          </button>
          <button class="btn stop" @click=${() => this._svc("stop")}>
            <ha-icon icon="mdi:alarm-off"></ha-icon>
            <span>Stop</span>
          </button>
        </div>

        ${snoozeLeft !== null && canSnooze
            ? b `<div class="ring-hint">${snoozeLeft} snooze${snoozeLeft > 1 ? "s" : ""} restant${snoozeLeft > 1 ? "s" : ""}</div>`
            : A}

        ${escaladeMin !== null
            ? b `<div class="footer esc">
              <ha-icon icon="mdi:progress-clock"></ha-icon>
              Escalade après ${escaladeMin} min · lumières + volume max
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
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--error-color);
      font-size: 13px;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .id {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }
    .badge-wrap {
      position: relative;
      width: 36px;
      height: 36px;
      flex: none;
    }
    .badge {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .badge.amber {
      background: var(--sw-amber-bg);
      color: var(--sw-amber);
    }
    .badge.snooze {
      background: var(--sw-teal-bg);
      color: var(--sw-teal-text);
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
    /* Anneau de progression prewake */
    .ring {
      position: absolute;
      inset: -4px;
      width: 44px;
      height: 44px;
      transform: rotate(-90deg);
      pointer-events: none;
    }
    .ring circle {
      fill: none;
      stroke-width: 3;
    }
    .ring-bg {
      stroke: var(--sw-amber-bg);
    }
    .ring-fg {
      stroke: var(--sw-amber);
      stroke-linecap: round;
      transition: stroke-dashoffset 0.6s linear;
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
    .time-meta {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }
    .adj {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      color: var(--sw-amber-text);
      cursor: help;
    }
    .adj ha-icon {
      --mdc-icon-size: 13px;
    }
    /* Barre de progression prewake */
    .prewake-block {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .bar {
      height: 6px;
      border-radius: 3px;
      background: var(--secondary-background-color);
      overflow: hidden;
    }
    .bar-fill {
      height: 100%;
      border-radius: 3px;
      background: var(--sw-amber);
      transition: width 0.6s linear;
    }
    .bar-legend {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      font-size: 11px;
      color: var(--secondary-text-color);
    }
    .days {
      display: flex;
      gap: 6px;
      align-items: center;
      flex-wrap: wrap;
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
    .chip.stat-chip {
      cursor: default;
      margin-left: auto;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      border-top: 1px solid var(--divider-color);
      padding-top: 10px;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .specs {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    .specs span {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      cursor: pointer;
    }
    .specs ha-icon,
    .footer ha-icon,
    .last ha-icon {
      --mdc-icon-size: 14px;
    }
    .chev {
      cursor: pointer;
      --mdc-icon-size: 18px;
      flex: none;
      transition: transform 0.2s ease;
    }
    .chev.open {
      transform: rotate(180deg);
      color: var(--sw-amber);
    }
    /* Panneau de réglages */
    .settings {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 4px 0 2px;
      animation: sw-slide 0.18s ease;
    }
    @keyframes sw-slide {
      from {
        opacity: 0;
        transform: translateY(-4px);
      }
      to {
        opacity: 1;
        transform: none;
      }
    }
    .row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      min-height: 34px;
    }
    .row.wrap {
      flex-wrap: wrap;
    }
    .row-label {
      font-size: 12px;
      color: var(--secondary-text-color);
      cursor: pointer;
    }
    .stepper {
      display: inline-flex;
      align-items: center;
      gap: 2px;
    }
    .stepper button,
    .mode-btn {
      border: none;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      font-family: inherit;
      cursor: pointer;
      border-radius: 8px;
    }
    .stepper button {
      width: 28px;
      height: 28px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .stepper button ha-icon {
      --mdc-icon-size: 16px;
    }
    .stepper button:active {
      background: var(--sw-amber-bg);
    }
    .stepper button[disabled] {
      opacity: 0.35;
      cursor: not-allowed;
    }
    .row-val {
      min-width: 58px;
      text-align: center;
      font-size: 13px;
      font-weight: 600;
      font-variant-numeric: tabular-nums;
      color: var(--primary-text-color);
    }
    .time-input {
      border: none;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      font-family: inherit;
      font-size: 15px;
      font-weight: 600;
      font-variant-numeric: tabular-nums;
      border-radius: 8px;
      padding: 4px 6px;
      text-align: center;
      width: 84px;
    }
    .modes {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
    }
    .mode-btn {
      font-size: 11px;
      padding: 6px 9px;
      color: var(--secondary-text-color);
    }
    .mode-btn.sel {
      background: var(--sw-amber-bg);
      color: var(--sw-amber-text);
      font-weight: 600;
    }
    .hint {
      font-size: 11px;
      line-height: 1.35;
      color: var(--secondary-text-color);
      padding: 2px 0 6px;
    }
    /* Statistiques */
    .stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      border-top: 1px solid var(--divider-color);
      padding-top: 10px;
    }
    .stat {
      text-align: center;
      padding: 6px 4px;
      border-radius: 10px;
      background: var(--secondary-background-color);
      cursor: pointer;
    }
    .stat-v {
      font-size: 17px;
      font-weight: 600;
      color: var(--primary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .stat-l {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      color: var(--secondary-text-color);
    }
    .last {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 11px;
      color: var(--secondary-text-color);
      cursor: pointer;
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
    .card.prewake {
      border-left: 3px solid var(--sw-amber);
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
    .btn[disabled] {
      opacity: 0.45;
      cursor: not-allowed;
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
    .ring-hint {
      text-align: center;
      font-size: 11px;
      color: var(--secondary-text-color);
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
__decorate([
    r()
], SmartwakeCard.prototype, "_open", void 0);
customElements.define("smartwake-card", SmartwakeCard);
/* ---------------------------------------------------------------
 * Éditeur visuel de configuration
 * ------------------------------------------------------------- */
const EDITOR_SCHEMA = [
    {
        name: "entity",
        required: true,
        selector: { entity: { integration: "smartwake", domain: "switch" } },
    },
    { name: "name", selector: { text: {} } },
    {
        type: "grid",
        name: "",
        schema: [
            { name: "show_context", selector: { boolean: {} } },
            { name: "show_settings", selector: { boolean: {} } },
            { name: "show_stats", selector: { boolean: {} } },
        ],
    },
];
const EDITOR_LABELS = {
    entity: "Réveil (switch SmartWAKE)",
    name: "Nom affiché",
    show_context: "Chips contextuelles",
    show_settings: "Réglages",
    show_stats: "Statistiques",
};
const EDITOR_HELPERS = {
    name: "Laisser vide pour utiliser « SmartWAKE »",
    show_context: "Férié, weekend, vacances scolaires, réveil en cours",
    show_settings: "Footer et panneau d'édition des paramètres",
    show_stats: "Compteurs cumulés et date du dernier réveil",
};
class SmartwakeCardEditor extends i {
    constructor() {
        super(...arguments);
        this._label = (schema) => EDITOR_LABELS[schema.name] ?? schema.name;
        this._helper = (schema) => EDITOR_HELPERS[schema.name] ?? "";
    }
    setConfig(config) {
        this._config = {
            show_stats: true,
            show_context: true,
            show_settings: true,
            ...config,
        };
    }
    _valueChanged(ev) {
        ev.stopPropagation();
        const config = { ...ev.detail.value };
        /* Un nom vide doit disparaître de la config plutôt que d'être stocké */
        if (config.name === "")
            delete config.name;
        this.dispatchEvent(new CustomEvent("config-changed", {
            detail: { config },
            bubbles: true,
            composed: true,
        }));
    }
    render() {
        if (!this.hass || !this._config)
            return b ``;
        return b `
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${EDITOR_SCHEMA}
        .computeLabel=${this._label}
        .computeHelper=${this._helper}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
    }
}
SmartwakeCardEditor.styles = i$3 `
    ha-form {
      display: block;
    }
  `;
__decorate([
    n({ attribute: false })
], SmartwakeCardEditor.prototype, "hass", void 0);
__decorate([
    r()
], SmartwakeCardEditor.prototype, "_config", void 0);
customElements.define("smartwake-card-editor", SmartwakeCardEditor);
window.customCards = window.customCards || [];
window.customCards.push({
    type: "smartwake-card",
    name: "SmartWAKE Card",
    description: "Carte réveil pour SmartWAKE : heure, jours, contexte, progression du pré-réveil, snooze/stop.",
    preview: true,
});
//# sourceMappingURL=smartwake-card.js.map
