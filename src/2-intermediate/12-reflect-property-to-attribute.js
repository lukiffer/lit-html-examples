import { LitElement, html } from '@polymer/lit-element';

class ReflectPropertyToAttribute extends LitElement {

  static get properties() {
    return {
      count: Number,
      message: String,
    };
  }

  constructor() {
    super();

    this.message = 'Hello world';
    this.count = 0;

    // Update count every 2sec to mock property changes
    setInterval(() => {
      this.count += 1;
    }, 2000);
  }

  /**
   * Sometimes it's useful to reflect js property values back to html attributes.
   * This can be done from the _propertiesChanged callback, which contains all
   * property change information.
   */
  _propertiesChanged(props, changedProps, oldProps) {
    // Make sure to call super, as this callback is used by LitElement as well.
    super._propertiesChanged(props, changedProps, oldProps);

    // In this case we are iterating over all properties and reflecting them.
    Object.keys(this.constructor.properties).forEach((key) => {

      // Only update if property changed
      if (key in changedProps) {
        const value = changedProps[key];

        if (value !== undefined) {
          this.setAttribute(key, value);
        } else {
          // Values are stringified as attributes. We don't like to see undefined
          // in the DOM, so we remove the attribute.
          this.removeAttribute(key);
        }
      }
    });

    // Instead of reflect all properties all the time, you could implement a separate property
    // to control which properties are reflected:

    // this._reflectedProperties.forEach((key) => {
    //   ... same as above
    // });
  }

  _render({ message, count }) {
    return html`
      <style>
        /* When attributes are reflected to attributes, they can be used from CSS. */
        :host([count$="0"]),
        :host([count$="2"]),
        :host([count$="4"]),
        :host([count$="6"]),
        :host([count$="8"]) {
          font-weight: bold;
        }
      </style>

      ${message}
    `;
  }

}

customElements.define('x-reflect-property-to-attribute', ReflectPropertyToAttribute);