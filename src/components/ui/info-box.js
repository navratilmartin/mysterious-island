const DEFAULT_ANIMATION_DURATION = 3000;

AFRAME.registerComponent("info-box", {
    schema: {
        createOnInit: { type: "boolean", default: false },
        createOnInitText: { type: "string", default: "" },
        duration: { type: "number", default: DEFAULT_ANIMATION_DURATION },
    },

    /** @type {(HTMLElement | null)} */
    app: null,

    /** @type {(HTMLElement | null)} */
    infoBoxEl: null,

    animDuration: DEFAULT_ANIMATION_DURATION,

    init() {
        this.app = document.getElementById("app");
        if (!this.app) {
            console.error("Cannot initialize info-box component: app is not found");
            return;
        }
        this.el.addEventListener("reveal-info-box", (e) => {
            const delay = typeof e.detail.delay === "number" && e.detail.delay >= 0 ? e.detail.delay : 3000;

            setTimeout(() => {
                this.createInfoBox(e.detail.text);
            }, delay);
        });

        if (this.data.createOnInit && this.data.createOnInitText) {
            this.createInfoBox(this.data.createOnInitText);
        }

        if (!this.data.duration) {
            console.warn("Invalid animation duration for info-box. The default is used instead");
            return;
        }

        this.animDuration = this.data.duration;
    },

    /**
     * Creates infobox and adds it to the `#app` (where the scene is rendered).
     * 
     * @param {string} text - infobox text.
     */
    createInfoBox(text) {
        if (this.infoBoxEl) {
            this.app.removeChild(this.infoBoxEl);
        }

        const finalText = typeof text === "string" ? text : "ERROR: invalid infobox text";
        this.infoBoxEl = document.createElement("div");
        this.infoBoxEl.id = "infoBox";
        this.infoBoxEl.textContent = finalText;
        const anim = this.infoBoxEl.animate(
                [
                    { opacity: 0.0 },
                    { opacity: 1.0 },
                ],
                {
                    duration: this.animDuration,
                    fill: "forwards",
                }
        );
        anim.onfinish = () => {
            this.infoBoxEl.animate(
                [
                    { opacity: 1.0 },
                    { opacity: 0.0 },
                ],
                {
                    delay: 2000,
                    duration: this.animDuration,
                    fill: "forwards",
                }
            );
        };
        this.app.appendChild(this.infoBoxEl);
    }
});