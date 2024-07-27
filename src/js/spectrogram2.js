class Spec3D {
  constructor() {
    this.cxRot = 90;
    this.prevX = 0;
    this.isRendering = false;
  }

  start(source, canvas) {
    this.canvas = canvas;

    // Analyze source
    const audioCtx = new AudioContext();
    if (source.tagName === "AUDIO") {
      source = audioCtx.createMediaElementSource(source); // Create source from audio tag with at least 2 channels
      source.connect(audioCtx.destination); // Route source to destination
    }

    // Analyser
    this.analyser = audioCtx.createAnalyser();
    this.analyser.fftSize = 4096;
    this.analyser.smoothingTimeConstant = 0;
    source.connect(this.analyser);

    // Visualizer
    this.attached();
    this.startRender();
  }

  attached() {
    console.log('spectrogram-3d attached');
    this.onResize();
    this.init();

    window.addEventListener('resize', () => this.onResize());
  }

  stopRender() {
    this.isRendering = false;
  }

  startRender() {
    if (this.isRendering) return;

    this.isRendering = true;
    this.draw();
  }

  init() {
    // Initialize everything
    this.analyserView = new AnalyserView(this.canvas);
    this.analyserView.setAnalyserNode(this.analyser);
    this.analyserView.initByteBuffer();
  }

  onResize() {
    console.log('onResize');
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
  }

  draw() {
    if (!this.isRendering) {
      console.log('stopped draw');
      return;
    }

    this.analyserView.doFrequencyAnalysis();
    requestAnimationFrame(() => this.draw());
  }
}

// Usage
const spec3D = new Spec3D();