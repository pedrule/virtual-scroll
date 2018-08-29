
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status';
import { html } from "@polymer/polymer/polymer-element";

export const SizeBehavior = SuperClass => class extends SuperClass{
    static get properties() {
        return {
            unitarySize: {
                type: Object,
                notify: true
            }
        }
    }

    static get template() {
        return html`
        <style include="iron-flex iron-flex-alignment">
            :host{
                height: 50vh;
                position: absolute;
                width: 50vw;
            }

            #container{
                position: absolute;
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
        this.template = this.constructor.templateItem;
        this.__observeSlot();
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
            // let content = this.template.content.cloneNode(true);
            // content = content.firstElementChild;
            let observer = new MutationObserver((mutationList) => {
                if(mutationList[0] && mutationList[0].addedNodes)size = mutationList[0].addedNodes[0].getBoundingClientRect();
                observer.disconnect();
                // this.removeChild(this.content);
                resolve(size);
            });
            observer.observe(this, {childList: true})
            this.appendChild(this.content);
        })
    }
    set template(value) {
        // let template = document.createElement('template');
        // template.content.appendChild(value);
        // this._template = template;
        this._template = value;
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
}