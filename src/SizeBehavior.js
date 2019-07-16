
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status';
import { html } from "@polymer/polymer/polymer-element";

export const SizeBehavior = SuperClass => class extends SuperClass{
    static get properties() {
        return {
            unitarySize: {
                type: Object,
                notify: true
            },

            nameOfContainer: {
                type: String,
                reflectToAttribute: true,
                observer: "onNameSetted"
            }
        }
    }

    static get template() {
        return html`
        <style include="iron-flex iron-flex-alignment">
            :host {
                /* height: 50vh;
                position: absolute;
                width: 50vw; */
                opacity: 0;
            }

            #container{
                position: absolute;
                width: 100%;
                overflow: hidden;
            }

            
        </style>
        ${super.template}
        `
    }

    constructor() {
        super();

    }

    connectedCallback(){
        super.connectedCallback();
        window.addEventListener('resize', () => {
            this.computeSizeOfHost();
            this.evaluateScroll();
        })
        // if(this.nameOfContainer)this.__observeSlot();
        // this.template = this.constructor.templateItem;
    }

    onNameSetted(arg) {
        if(arg) this.__observeSlot();
    }

    /**
     * @observer on slot 
     * each time a child element is added in the 
     */
    __observeSlot(){
        this.__getSizeTemplateVirtual().then((size) => {
            this.unitarySize = size;
        });
    }

    /**
     * function that return size in the dom of a particular object
     * @return {DomRect} 
     */
    __getSizeTemplateVirtual() {
        return new Promise((resolve ,reject) => {
            let size;
            let slotelement = this.querySelector(this.nameOfContainer);
            if(!slotelement) return;
            let observer = new MutationObserver((mutationList) => {
                if(mutationList[0] && mutationList[0].addedNodes) {
                    let slotelement = this.querySelector(this.nameOfContainer);
                    size = slotelement.getBoundingClientRect();
                    this.template = slotelement;
                    this.computeSizeOfHost();
                    // size = mutationList[0].addedNodes[0].getBoundingClientRect();
                    // this.template = mutationList[0].addedNodes[0];
                }
                if(slotelement) observer.disconnect();
                resolve(size);
            });
            observer.observe(this, {childList: true})
           
            this.appendChild(this.content);
        })
    }
    set template(value) {
        let template = document.createElement('template');
        template.content.appendChild(value);
        this._template = template;
        // this._template = value;
    }

    get template() {
        return this._template;
    }

    set content(value) {
        this._content = value;
    }

    get content() {
        return this.template.content.cloneNode(true).firstElementChild;
    }

    computeSizeOfHost() {
        setTimeout(() => {
            const position = this.getBoundingClientRect();
            this.style.position = "absolute";
            this.style.width = `${position.width}px`;
            this.style.height = `${position.height}px`;
            this.style.opacity = 1;
        }, 1000)
    }
}