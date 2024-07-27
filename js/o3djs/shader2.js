/**
 * @fileoverview This file contains a class which assists with the
 * loading of GLSL shaders.
 */

class ShaderUtils {
  /**
   * Loads a shader from vertex and fragment programs specified in
   * "script" nodes in the HTML page.
   * @param {WebGLRenderingContext} gl The WebGLRenderingContext
   *     into which the shader will be loaded.
   * @param {string} vertexScriptName The name of the HTML Script node
   *     containing the vertex program.
   * @param {string} fragmentScriptName The name of the HTML Script node
   *     containing the fragment program.
   * @return {Shader | null} A Shader object or null if not found.
   */
  static loadFromScriptNodes(gl, vertexScriptName, fragmentScriptName) {
    const vertexScript = document.getElementById(vertexScriptName);
    const fragmentScript = document.getElementById(fragmentScriptName);
    if (!vertexScript || !fragmentScript) return null;

    return new Shader(gl, vertexScript.text, fragmentScript.text);
  }

  /**
   * Loads text from an external file synchronously.
   * @param {string} url The url of the external file.
   * @return {string} The loaded text.
   * @throws {Error} If the request fails.
   */
  static loadTextFileSynchronous(url) {
    const error = `loadTextFileSynchronous failed to load url "${url}"`;
    const request = new XMLHttpRequest();

    if (request.overrideMimeType) {
      request.overrideMimeType('text/plain');
    }

    request.open('GET', url, false);
    request.send(null);

    if (request.readyState !== 4) {
      throw new Error(error);
    }

    return request.responseText;
  }

  /**
   * Loads shaders from URLs and creates a Shader object.
   * @param {WebGLRenderingContext} gl The WebGLRenderingContext.
   * @param {string} vertexURL The URL of the vertex shader.
   * @param {string} fragmentURL The URL of the fragment shader.
   * @return {Shader | null} A Shader object or null if not found.
   */
  static loadFromURL(gl, vertexURL, fragmentURL) {
    const vertexText = ShaderUtils.loadTextFileSynchronous(vertexURL);
    const fragmentText = ShaderUtils.loadTextFileSynchronous(fragmentURL);

    if (!vertexText || !fragmentText) return null;

    return new Shader(gl, vertexText, fragmentText);
  }

  /**
   * Converts GLSL names to JavaScript names.
   * @param {string} name The GLSL name.
   * @return {string} The JavaScript name.
   * @private
   */
  static glslNameToJs(name) {
    return name.replace(/_(.)/g, (_, p1) => p1.toUpperCase());
  }
}

class Shader {
  /**
   * Creates a new Shader object, loading and linking the given vertex
   * and fragment shaders into a program.
   * @param {WebGLRenderingContext} gl The WebGLRenderingContext.
   * @param {string} vertex The vertex shader.
   * @param {string} fragment The fragment shader.
   */
  constructor(gl, vertex, fragment) {
    this.gl = gl;
    this.program = this.gl.createProgram();

    const vs = this.loadShader(this.gl.VERTEX_SHADER, vertex);
    if (!vs) return;

    this.gl.attachShader(this.program, vs);
    this.gl.deleteShader(vs);

    const fs = this.loadShader(this.gl.FRAGMENT_SHADER, fragment);
    if (!fs) return;

    this.gl.attachShader(this.program, fs);
    this.gl.deleteShader(fs);

    this.gl.linkProgram(this.program);
    this.gl.useProgram(this.program);

    // Check the link status
    const linked = this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS);
    if (!linked) {
      const infoLog = this.gl.getProgramInfoLog(this.program);
      console.error(`Error linking program:\n${infoLog}`);
      this.gl.deleteProgram(this.program);
      this.program = null;
      return;
    }

    // Find uniforms and attributes
    const re = /(uniform|attribute)\s+\S+\s+(\S+)\s*;/g;
    let match;
    while ((match = re.exec(`${vertex}\n${fragment}`)) !== null) {
      const [_, type, glslName] = match;
      const jsName = ShaderUtils.glslNameToJs(glslName);
      if (type === 'uniform') {
        this[`${jsName}Loc`] = this.getUniform(glslName);
      } else if (type === 'attribute') {
        this[`${jsName}Loc`] = this.getAttribute(glslName);
      }
    }
  }

  /**
   * Binds the shader's program.
   */
  bind() {
    this.gl.useProgram(this.program);
  }

  /**
   * Helper for loading a shader.
   * @param {number} type The type of shader (VERTEX_SHADER or FRAGMENT_SHADER).
   * @param {string} shaderSrc The shader source code.
   * @return {WebGLShader | null} The compiled shader or null if failed.
   * @private
   */
  loadShader(type, shaderSrc) {
    const shader = this.gl.createShader(type);
    if (!shader) return null;

    this.gl.shaderSource(shader, shaderSrc);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const infoLog = this.gl.getShaderInfoLog(shader);
      console.error(`Error compiling shader:\n${infoLog}`);
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  /**
   * Helper for looking up an attribute's location.
   * @param {string} name The attribute name.
   * @return {number} The attribute location.
   * @private
   */
  getAttribute(name) {
    return this.gl.getAttribLocation(this.program, name);
  }

  /**
   * Helper for looking up a uniform's location.
   * @param {string} name The uniform name.
   * @return {WebGLUniformLocation | null} The uniform location or null if not found.
   * @private
   */
  getUniform(name) {
    return this.gl.getUniformLocation(this.program, name);
  }
}
