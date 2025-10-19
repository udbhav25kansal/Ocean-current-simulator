export class DataPanel {
    constructor() {
        this.createPanel();
    }

    createPanel() {
        // Create panel container
        this.panel = document.createElement('div');
        this.panel.id = 'data-panel';
        this.panel.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.75);
            color: white;
            padding: 20px;
            border-radius: 10px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 14px;
            min-width: 300px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(79, 195, 247, 0.3);
            z-index: 100;
        `;

        // Title
        const title = document.createElement('h3');
        title.textContent = 'Current Status';
        title.style.cssText = `
            margin: 0 0 15px 0;
            color: #4fc3f7;
            font-size: 18px;
            border-bottom: 2px solid #4fc3f7;
            padding-bottom: 8px;
        `;
        this.panel.appendChild(title);

        // Data container
        this.dataContainer = document.createElement('div');
        this.panel.appendChild(this.dataContainer);

        // Chart container for forcing influence
        this.chartContainer = document.createElement('div');
        this.chartContainer.style.cssText = `
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
        `;
        this.panel.appendChild(this.chartContainer);

        document.body.appendChild(this.panel);
    }

    update(params, maxVelocity, dominantForcing) {
        // Calculate relative influences
        const influences = this.calculateInfluences(params);

        // Build data display
        let html = `
            <div style="margin-bottom: 10px;">
                <strong>Parameters:</strong>
            </div>
            <div style="margin-left: 10px; line-height: 1.8;">
                <div>River: <span style="color: #81c784;">${params.riverDischarge.toFixed(0)} m³/s</span></div>
                <div>Wind: <span style="color: #64b5f6;">${params.windSpeed.toFixed(1)} m/s @ ${params.windDirection.toFixed(0)}°</span></div>
                <div>Tide: <span style="color: #ffb74d;">${params.tidePhase.toFixed(1)} hrs</span></div>
            </div>
            <div style="margin-top: 15px; margin-bottom: 10px;">
                <strong>Flow Metrics:</strong>
            </div>
            <div style="margin-left: 10px; line-height: 1.8;">
                <div>Max Velocity: <span style="color: #f06292;">${maxVelocity.toFixed(2)} m/s</span></div>
                <div>Dominant Force: <span style="color: #ffd54f; font-weight: bold;">${dominantForcing}</span></div>
            </div>
        `;

        this.dataContainer.innerHTML = html;

        // Update chart
        this.updateChart(influences);
    }

    calculateInfluences(params) {
        // Normalize each forcing mechanism to 0-1 range
        const riverInfluence = Math.min(params.riverDischarge / 10000, 1);
        const windInfluence = Math.min(params.windSpeed / 30, 1);
        const tidalInfluence = Math.abs(Math.sin((params.tidePhase / 12.4) * 2 * Math.PI));

        const total = riverInfluence + windInfluence + tidalInfluence;

        return {
            river: total > 0 ? (riverInfluence / total) * 100 : 0,
            wind: total > 0 ? (windInfluence / total) * 100 : 0,
            tide: total > 0 ? (tidalInfluence / total) * 100 : 0
        };
    }

    updateChart(influences) {
        const chartHTML = `
            <div style="margin-bottom: 8px; font-weight: bold; font-size: 13px;">
                Forcing Influence:
            </div>
            <div style="margin-bottom: 8px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
                    <span>River</span>
                    <span style="color: #81c784;">${influences.river.toFixed(1)}%</span>
                </div>
                <div style="background: rgba(255,255,255,0.1); border-radius: 10px; height: 18px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #66bb6a, #81c784); height: 100%; width: ${influences.river}%; transition: width 0.3s;"></div>
                </div>
            </div>
            <div style="margin-bottom: 8px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
                    <span>Wind</span>
                    <span style="color: #64b5f6;">${influences.wind.toFixed(1)}%</span>
                </div>
                <div style="background: rgba(255,255,255,0.1); border-radius: 10px; height: 18px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #42a5f5, #64b5f6); height: 100%; width: ${influences.wind}%; transition: width 0.3s;"></div>
                </div>
            </div>
            <div style="margin-bottom: 8px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
                    <span>Tides</span>
                    <span style="color: #ffb74d;">${influences.tide.toFixed(1)}%</span>
                </div>
                <div style="background: rgba(255,255,255,0.1); border-radius: 10px; height: 18px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #ffa726, #ffb74d); height: 100%; width: ${influences.tide}%; transition: width 0.3s;"></div>
                </div>
            </div>
        `;

        this.chartContainer.innerHTML = chartHTML;
    }

    setVisible(visible) {
        this.panel.style.display = visible ? 'block' : 'none';
    }

    destroy() {
        if (this.panel && this.panel.parentNode) {
            this.panel.parentNode.removeChild(this.panel);
        }
    }
}
