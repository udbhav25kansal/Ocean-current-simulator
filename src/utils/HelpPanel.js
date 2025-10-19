export class HelpPanel {
    constructor() {
        this.createPanel();
        this.isVisible = true;
    }

    createPanel() {
        // Create overlay
        this.overlay = document.createElement('div');
        this.overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.85);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            backdrop-filter: blur(5px);
        `;

        // Create panel
        this.panel = document.createElement('div');
        this.panel.style.cssText = `
            background: linear-gradient(135deg, #1a2332 0%, #0a0e27 100%);
            color: white;
            padding: 40px;
            border-radius: 15px;
            max-width: 600px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            border: 2px solid #4fc3f7;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        `;

        this.panel.innerHTML = `
            <h2 style="color: #4fc3f7; margin: 0 0 20px 0; font-size: 28px;">
                Welcome to Ocean Current Simulator
            </h2>
            <p style="line-height: 1.6; margin-bottom: 20px; color: #b0bec5;">
                This interactive 3D visualization demonstrates how different forcing mechanisms
                affect surface currents in the Strait of Georgia, British Columbia.
            </p>

            <h3 style="color: #81c784; margin: 20px 0 10px 0; font-size: 20px;">
                Controls
            </h3>
            <ul style="line-height: 2; color: #e0e0e0; margin-left: 20px;">
                <li><strong>Mouse Drag:</strong> Rotate view</li>
                <li><strong>Mouse Wheel:</strong> Zoom in/out</li>
                <li><strong>Right Panel:</strong> Adjust forcing parameters</li>
            </ul>

            <h3 style="color: #64b5f6; margin: 20px 0 10px 0; font-size: 20px;">
                Forcing Mechanisms
            </h3>
            <ul style="line-height: 2; color: #e0e0e0; margin-left: 20px;">
                <li><strong style="color: #81c784;">River Discharge:</strong> Fraser River outflow creates a northward plume</li>
                <li><strong style="color: #64b5f6;">Wind:</strong> Surface wind stress drives current with Ekman deflection</li>
                <li><strong style="color: #ffb74d;">Tides:</strong> Periodic along-strait oscillations (~12.4 hour cycle)</li>
            </ul>

            <h3 style="color: #ffd54f; margin: 20px 0 10px 0; font-size: 20px;">
                Visualization
            </h3>
            <ul style="line-height: 2; color: #e0e0e0; margin-left: 20px;">
                <li><strong>Particles:</strong> Colored by speed (blue=slow, red=fast)</li>
                <li><strong>Vectors:</strong> Show direction and magnitude at grid points</li>
                <li><strong>Bottom Left Panel:</strong> Real-time metrics and forcing influence</li>
            </ul>

            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.2); color: #90a4ae; font-size: 14px;">
                This simulator uses physics-based mock data to demonstrate the research framework
                developed for understanding ocean current dynamics in the Strait of Georgia.
            </p>

            <button id="start-btn" style="
                margin-top: 20px;
                padding: 15px 40px;
                background: linear-gradient(135deg, #4fc3f7, #2196f3);
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
                width: 100%;
                transition: transform 0.2s, box-shadow 0.2s;
            ">
                Start Exploring
            </button>
        `;

        this.overlay.appendChild(this.panel);
        document.body.appendChild(this.overlay);

        // Add button hover effect
        const startBtn = document.getElementById('start-btn');
        startBtn.addEventListener('mouseenter', () => {
            startBtn.style.transform = 'translateY(-2px)';
            startBtn.style.boxShadow = '0 5px 20px rgba(79, 195, 247, 0.4)';
        });
        startBtn.addEventListener('mouseleave', () => {
            startBtn.style.transform = 'translateY(0)';
            startBtn.style.boxShadow = 'none';
        });
        startBtn.addEventListener('click', () => this.hide());
    }

    hide() {
        this.overlay.style.display = 'none';
        this.isVisible = false;
    }

    show() {
        this.overlay.style.display = 'flex';
        this.isVisible = true;
    }

    destroy() {
        if (this.overlay && this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
        }
    }
}
