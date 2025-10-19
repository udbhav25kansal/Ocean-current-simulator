export class TimelineControl {
    constructor(buoyDataLoader, onTimeChange) {
        this.buoyDataLoader = buoyDataLoader;
        this.onTimeChange = onTimeChange;
        this.createControls();
    }

    createControls() {
        // Main container
        this.container = document.createElement('div');
        this.container.id = 'timeline-control';
        this.container.style.cssText = `
            position: absolute;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.75);
            color: white;
            padding: 20px;
            border-radius: 10px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 14px;
            min-width: 400px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(79, 195, 247, 0.3);
            z-index: 100;
        `;

        // Title
        const title = document.createElement('h3');
        title.textContent = 'Timeline Playback';
        title.style.cssText = `
            margin: 0 0 15px 0;
            color: #4fc3f7;
            font-size: 18px;
            border-bottom: 2px solid #4fc3f7;
            padding-bottom: 8px;
        `;
        this.container.appendChild(title);

        // Current time display
        this.timeDisplay = document.createElement('div');
        this.timeDisplay.style.cssText = `
            margin-bottom: 15px;
            font-size: 16px;
            font-weight: bold;
            color: #81c784;
            text-align: center;
        `;
        this.container.appendChild(this.timeDisplay);

        // Timeline slider
        const sliderContainer = document.createElement('div');
        sliderContainer.style.cssText = 'margin-bottom: 15px;';

        this.slider = document.createElement('input');
        this.slider.type = 'range';
        this.slider.min = '0';
        this.slider.max = String(this.buoyDataLoader.getTotalRecords() - 1);
        this.slider.value = '0';
        this.slider.style.cssText = `
            width: 100%;
            height: 8px;
            border-radius: 5px;
            background: linear-gradient(90deg, #4fc3f7, #81c784);
            outline: none;
            cursor: pointer;
        `;
        this.slider.addEventListener('input', (e) => {
            const index = parseInt(e.target.value);
            this.onTimeChange(index);
            this.updateDisplay(index);
        });
        sliderContainer.appendChild(this.slider);
        this.container.appendChild(sliderContainer);

        // Date range display
        const stats = this.buoyDataLoader.getStats();
        const dateRange = document.createElement('div');
        dateRange.style.cssText = `
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            color: #aaa;
            margin-bottom: 15px;
        `;
        dateRange.innerHTML = `
            <span>${this.formatDate(stats.timeRange.start)}</span>
            <span>${this.formatDate(stats.timeRange.end)}</span>
        `;
        this.container.appendChild(dateRange);

        // Playback controls
        const controlsRow = document.createElement('div');
        controlsRow.style.cssText = `
            display: flex;
            gap: 10px;
            align-items: center;
            justify-content: center;
            margin-bottom: 15px;
        `;

        // Play/Pause button
        this.playButton = this.createButton('▶ Play', () => this.togglePlayback());
        controlsRow.appendChild(this.playButton);

        // Step backward
        const stepBackButton = this.createButton('◀', () => this.stepBackward());
        stepBackButton.style.width = '40px';
        controlsRow.appendChild(stepBackButton);

        // Step forward
        const stepForwardButton = this.createButton('▶', () => this.stepForward());
        stepForwardButton.style.width = '40px';
        controlsRow.appendChild(stepForwardButton);

        // Reset button
        const resetButton = this.createButton('⟲ Reset', () => this.reset());
        controlsRow.appendChild(resetButton);

        this.container.appendChild(controlsRow);

        // Speed control
        const speedContainer = document.createElement('div');
        speedContainer.style.cssText = 'margin-bottom: 10px;';

        const speedLabel = document.createElement('div');
        speedLabel.style.cssText = 'margin-bottom: 8px; font-size: 13px; color: #ccc;';
        speedLabel.textContent = 'Playback Speed:';
        speedContainer.appendChild(speedLabel);

        const speedButtons = document.createElement('div');
        speedButtons.style.cssText = 'display: flex; gap: 8px; justify-content: center;';

        ['0.5x', '1x', '2x', '5x', '10x'].forEach(speed => {
            const btn = this.createButton(speed, () => this.setSpeed(parseFloat(speed)));
            btn.style.flex = '1';
            btn.style.fontSize = '12px';
            if (speed === '1x') {
                btn.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
            }
            speedButtons.appendChild(btn);
        });

        speedContainer.appendChild(speedButtons);
        this.container.appendChild(speedContainer);

        // Info display
        this.infoDisplay = document.createElement('div');
        this.infoDisplay.style.cssText = `
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            font-size: 12px;
            line-height: 1.6;
            color: #ddd;
        `;
        this.container.appendChild(this.infoDisplay);

        // Add to DOM
        document.body.appendChild(this.container);

        // Initialize display
        this.updateDisplay(0);
        this.isPlaying = false;
        this.playbackSpeed = 1.0;
    }

    createButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.cssText = `
            padding: 8px 16px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 13px;
            font-weight: bold;
            transition: all 0.3s;
        `;
        button.addEventListener('mouseover', () => {
            button.style.transform = 'scale(1.05)';
            button.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
        });
        button.addEventListener('mouseout', () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = 'none';
        });
        button.addEventListener('click', onClick);
        return button;
    }

    updateDisplay(index) {
        const record = this.buoyDataLoader.getRecordByIndex(index);
        if (!record) return;

        // Update time display
        this.timeDisplay.textContent = this.formatDateTime(record.timestamp);

        // Update slider
        this.slider.value = String(index);

        // Update info display
        this.infoDisplay.innerHTML = `
            <div><strong>Record:</strong> ${index + 1} / ${this.buoyDataLoader.getTotalRecords()}</div>
            <div><strong>Progress:</strong> ${((index / this.buoyDataLoader.getTotalRecords()) * 100).toFixed(1)}%</div>
        `;
    }

    togglePlayback() {
        this.isPlaying = !this.isPlaying;
        this.playButton.textContent = this.isPlaying ? '⏸ Pause' : '▶ Play';

        // Notify parent (will be handled by params in main.js)
        if (window.simulator && window.simulator.params) {
            window.simulator.params.isPlaying = this.isPlaying;
        }
    }

    stepForward() {
        const currentIndex = parseInt(this.slider.value);
        const nextIndex = Math.min(currentIndex + 1, this.buoyDataLoader.getTotalRecords() - 1);
        this.slider.value = String(nextIndex);
        this.onTimeChange(nextIndex);
        this.updateDisplay(nextIndex);
    }

    stepBackward() {
        const currentIndex = parseInt(this.slider.value);
        const prevIndex = Math.max(currentIndex - 1, 0);
        this.slider.value = String(prevIndex);
        this.onTimeChange(prevIndex);
        this.updateDisplay(prevIndex);
    }

    reset() {
        this.slider.value = '0';
        this.onTimeChange(0);
        this.updateDisplay(0);
        if (this.isPlaying) {
            this.togglePlayback();
        }
    }

    setSpeed(speed) {
        this.playbackSpeed = speed;

        // Update button styles
        const speedButtons = this.container.querySelectorAll('button');
        speedButtons.forEach(btn => {
            if (btn.textContent === `${speed}x`) {
                btn.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
            } else if (btn.textContent.includes('x') && !btn.textContent.includes('Play') && !btn.textContent.includes('Pause')) {
                btn.style.background = 'linear-gradient(135deg, #4fc3f7, #3a7bd5)';
            }
        });

        // Notify parent
        if (window.simulator && window.simulator.params) {
            window.simulator.params.playbackSpeed = speed;
        }
    }

    formatDate(date) {
        if (!date) return 'N/A';
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    formatDateTime(date) {
        if (!date) return 'N/A';
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}
