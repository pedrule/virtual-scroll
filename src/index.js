import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import {ScrollVirtualBehavior} from './ScrollVirtualBehavior';
import {InstanceBehavior} from './InstanceBehavior';

import '@polymer/iron-flex-layout/iron-flex-layout';
import '@polymer/iron-flex-layout/iron-flex-layout-classes';

export class PedruleVirtualScroll extends InstanceBehavior(ScrollVirtualBehavior(PolymerElement)) {
    static get properties() {
        return {

            _height: {
                type: Number,
                computed: '__setHeight(items, unitarySize)',
                observer: '__heightChanged'
            },

            width: {
                type: Number,
                reflectToAttribute: true,
                observer: '__widthChanged'
            },

            items: {
                type: Array,
                observer: '__itemsChanged',
                value: []
            },
        }
    }

    /**
     * function that computed total size of element by factorizacion of unitarySize of an item and total count of items through 
     * length of items array
     * @param {Array} items 
     * @param {Number} unitarySize 
     */
    __setHeight(items, unitarySize) {
        return items && unitarySize ? unitarySize.height*items.length : false;
    }

    /**
     * retrieve new value of height property and assign it to css style of element
     * @observer
     * @param {Number} arg 
     */
    __heightChanged(arg, prev) {
        if(arg != undefined && arg !== prev){ 
            this.$.container.style.height = `${arg}px`;
            // this.__resetInstances();
            this.__evaluateScroll();
        }
    }

    /**
     * retrieve new value of width property and assign it to each instances of instances array property
     * @observer
     * @param {Number} arg 
     */
    __widthChanged(arg) {
        this.instances.forEach(item => item.style.width = `${arg}px`);
        this.$.container.style.width = `${arg}px`;
    }

    __itemsChanged(arg) {
        this.__resetInstances();
        if (arg) this.instances.forEach((instance, index) => (instance.item = arg[index]));
    }

    static get templateItem() {
        return html`
            <div style="height: 65px; background: tan;position: absolute">Ceci est un test</div>
        `
    }
}
customElements.define('pedrule-virtual-scroll', PedruleVirtualScroll);