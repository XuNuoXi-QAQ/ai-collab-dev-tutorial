"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => LuopanIntegratedPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian5 = require("obsidian");

// src/types.ts
var DEFAULT_SETTINGS = {
  showTopMarker: true,
  showSectorDividers: true,
  sectorOpacity: 0.65,
  // 默认较高透明度
  textColor: "#ffffff",
  // 默认白色文字
  customSectorColor: ""
  // 默认空，即使用各自逻辑
};
var DEFAULT_DATA = {
  layers: [
    { name: "\u4E24\u4EEA", items: ["\u9634", "\u9633"] },
    { name: "\u56DB\u8C61", items: ["\u8001\u9633", "\u5C11\u9634", "\u5C11\u9633", "\u8001\u9634"] },
    { name: "\u516B\u5366", items: ["\u2630", "\u2634", "\u2635", "\u2636", "\u2637", "\u2633", "\u2632", "\u2631"] }
  ],
  centerText: "",
  baseRadius: 100,
  radiusStep: 45,
  _format: "simple"
};

// src/parser.ts
function parseSimpleFormat(source) {
  const lines = source.split(/\r?\n/);
  const layers = [];
  const regex = /^\s*([\p{L}\p{N}]+)\s*:\s*\[(.*)\]\s*$/u;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === "") continue;
    const match = trimmed.match(regex);
    if (!match) continue;
    const name = match[1];
    const itemsStr = match[2];
    const items = itemsStr.split(",").map((s) => s.trim()).filter((s) => s !== "");
    if (items.length > 0) {
      layers.push({ name, items });
    }
  }
  if (layers.length === 0) return null;
  return { ...DEFAULT_DATA, layers, _format: "simple" };
}
function parseJSONFormat(source) {
  try {
    const data = JSON.parse(source.trim());
    if (!data.layers || !Array.isArray(data.layers)) return null;
    return { ...DEFAULT_DATA, ...data, _format: "json" };
  } catch (e) {
    return null;
  }
}
function parseLuopanCode(source) {
  const trimmed = source.trim();
  if (trimmed.startsWith("{")) {
    return parseJSONFormat(trimmed);
  } else {
    return parseSimpleFormat(trimmed);
  }
}
function serializeLuopanData(data, format = data._format || "json") {
  if (format === "simple") {
    const lines = data.layers.map((layer) => {
      const itemsStr = layer.items.join(", ");
      return `${layer.name}: [${itemsStr}]`;
    });
    return lines.join("\n");
  } else {
    const output = {
      layers: data.layers,
      centerText: data.centerText,
      baseRadius: data.baseRadius,
      radiusStep: data.radiusStep
    };
    return JSON.stringify(output, null, 2);
  }
}
async function updateCodeBlock(file, oldSource, newData, plugin) {
  const format = newData._format || "json";
  const newSource = serializeLuopanData(newData, format);
  const content = await plugin.app.vault.read(file);
  const updated = content.replace(`\`\`\`luopan
${oldSource}
\`\`\``, `\`\`\`luopan
${newSource}
\`\`\``);
  if (updated !== content) {
    await plugin.app.vault.modify(file, updated);
  }
}
function extractFromFrontmatter(frontmatter) {
  const layerNames = ["\u4E24\u4EEA", "\u56DB\u8C61", "\u4E94\u884C", "\u516B\u5366", "\u5929\u5E72", "\u5730\u652F", "\u8282\u6C14", "\u516D\u5341\u56DB\u5366"];
  const layers = [];
  for (const name of layerNames) {
    const items = frontmatter[name];
    if (Array.isArray(items) && items.length > 0) {
      layers.push({ name, items: items.map(String) });
    }
  }
  if (layers.length === 0) return null;
  return { ...DEFAULT_DATA, layers, _format: "simple" };
}

// src/constants.ts
var LAYER_COLORS = {
  "\u4E24\u4EEA": "#FFD966",
  "\u56DB\u8C61": "#FFB347",
  "\u4E94\u884C": "#A5D6A5",
  "\u516B\u5366": "#7FB4FF",
  "\u5929\u5E72": "#CC99FF",
  "\u5730\u652F": "#99CCFF",
  "\u8282\u6C14": "#66CCCC",
  "24\u8282\u6C14": "#66CCCC",
  "\u516D\u5341\u56DB\u5366": "#FFA07A"
};

// src/modals.ts
var import_obsidian = require("obsidian");
var EditTextModal = class extends import_obsidian.Modal {
  constructor(app, current, resolve) {
    super(app);
    __publicField(this, "current");
    __publicField(this, "resolve");
    __publicField(this, "inputEl");
    this.current = current;
    this.resolve = resolve;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.createEl("h3", { text: "\u7F16\u8F91\u7F57\u76D8\u6587\u5B57" });
    this.inputEl = contentEl.createEl("input", { value: this.current });
    this.inputEl.style.width = "100%";
    const buttonDiv = contentEl.createDiv({ cls: "modal-button-container" });
    const saveBtn = buttonDiv.createEl("button", { text: "\u4FDD\u5B58" });
    saveBtn.addEventListener("click", () => {
      this.resolve(this.inputEl.value);
      this.close();
    });
    const cancelBtn = buttonDiv.createEl("button", { text: "\u53D6\u6D88" });
    cancelBtn.addEventListener("click", () => {
      this.resolve(null);
      this.close();
    });
  }
  onClose() {
    this.contentEl.empty();
  }
};

// src/renderer.ts
var import_obsidian2 = require("obsidian");

// src/base-renderer.ts
var BaseRotatableCanvas = class {
  constructor(container) {
    __publicField(this, "canvas");
    __publicField(this, "ctx");
    __publicField(this, "container");
    __publicField(this, "width", 800);
    __publicField(this, "height", 800);
    __publicField(this, "centerX", 400);
    __publicField(this, "centerY", 400);
    // 整体旋转
    __publicField(this, "rotation", 0);
    // 拖拽状态
    __publicField(this, "isDragging", false);
    __publicField(this, "isLayerRotating", false);
    __publicField(this, "rotatingDepthOrIdx", -1);
    // depth (sunburst) 或 layerIdx (luopan)
    __publicField(this, "lastMouseAngle", 0);
    __publicField(this, "lastMoveAngle", 0);
    __publicField(this, "lastMoveTime", 0);
    __publicField(this, "velocity", 0);
    __publicField(this, "friction", 0.98);
    __publicField(this, "inertiaId", null);
    // 每层独立旋转偏移（弧度），子类可自定义 key 类型（number）
    __publicField(this, "layerRotations", /* @__PURE__ */ new Map());
    this.container = container;
  }
  // 子类可重写以处理 Shift+拖拽开始前的判断，返回 true 表示已处理（不会进行整体旋转）
  handleShiftDragStart(angle, radius, e) {
    return false;
  }
  // 子类可重写：Shift+拖拽移动
  handleShiftDragMove(angle, e) {
  }
  // 子类可重写：Shift+拖拽结束
  handleShiftDragEnd() {
  }
  // 初始化 Canvas 和按钮（子类调用）
  initCanvas(extraClassName, hasControls = true) {
    this.container.empty();
    const wrapper = this.container.createDiv({ cls: extraClassName });
    this.canvas = wrapper.createEl("canvas", {
      cls: `${extraClassName}-canvas`,
      attr: { width: this.width, height: this.height }
    });
    this.ctx = this.canvas.getContext("2d");
    if (hasControls) {
      const controls = wrapper.createDiv({ cls: "luopan-controls" });
      const resetBtn = controls.createEl("button", { text: "\u91CD\u7F6E\u89D2\u5EA6" });
      resetBtn.addEventListener("click", () => {
        this.stopInertia();
        this.rotation = 0;
        this.layerRotations.clear();
        this.velocity = 0;
        this.draw();
      });
    }
  }
  // 鼠标坐标转换
  getMouseAngle(e) {
    const rect = this.canvas.getBoundingClientRect();
    const sx = this.canvas.width / rect.width;
    const sy = this.canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * sx - this.centerX;
    const my = (e.clientY - rect.top) * sy - this.centerY;
    return Math.atan2(my, mx);
  }
  getMouseRadius(e) {
    const rect = this.canvas.getBoundingClientRect();
    const sx = this.canvas.width / rect.width;
    const sy = this.canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * sx - this.centerX;
    const my = (e.clientY - rect.top) * sy - this.centerY;
    return Math.hypot(mx, my);
  }
  // 事件绑定
  bindEvents() {
    const onMouseDown = (e) => {
      this.stopInertia();
      const angle = this.getMouseAngle(e);
      const radius = this.getMouseRadius(e);
      if (e.shiftKey && this.handleShiftDragStart(angle, radius, e)) {
        this.isLayerRotating = true;
        this.lastMouseAngle = angle;
        this.canvas.style.cursor = "ew-resize";
        e.preventDefault();
        return;
      }
      this.isDragging = true;
      this.lastMouseAngle = angle;
      this.lastMoveAngle = angle;
      this.lastMoveTime = performance.now();
      this.canvas.style.cursor = "grabbing";
      e.preventDefault();
    };
    const onMouseMove = (e) => {
      if (this.isLayerRotating) {
        const newAngle2 = this.getMouseAngle(e);
        const delta2 = newAngle2 - this.lastMouseAngle;
        this.handleShiftDragMove(newAngle2, e);
        this.lastMouseAngle = newAngle2;
        return;
      }
      if (!this.isDragging) return;
      const newAngle = this.getMouseAngle(e);
      const delta = newAngle - this.lastMouseAngle;
      this.rotation += delta;
      this.lastMouseAngle = newAngle;
      this.draw();
      const now = performance.now();
      const dt = Math.min(0.1, (now - this.lastMoveTime) / 1e3);
      if (dt > 0.01) {
        this.velocity = (newAngle - this.lastMoveAngle) / dt;
        this.lastMoveAngle = newAngle;
        this.lastMoveTime = now;
      }
    };
    const onMouseUp = () => {
      if (this.isLayerRotating) {
        this.isLayerRotating = false;
        this.canvas.style.cursor = "grab";
        this.handleShiftDragEnd();
        return;
      }
      if (!this.isDragging) return;
      this.isDragging = false;
      this.canvas.style.cursor = "grab";
      if (Math.abs(this.velocity) > 0.05) {
        this.startInertia();
      } else {
        this.velocity = 0;
      }
    };
    const onDblClick = (e) => {
      this.handleDblClick(e);
    };
    this.canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    this.canvas.addEventListener("dblclick", onDblClick);
  }
  // 惯性动画
  startInertia() {
    if (this.inertiaId) cancelAnimationFrame(this.inertiaId);
    let lastTime = performance.now();
    const step = (now) => {
      const dt = Math.min(0.033, (now - lastTime) / 1e3);
      if (dt <= 0) {
        this.inertiaId = requestAnimationFrame(step);
        return;
      }
      this.velocity *= Math.pow(this.friction, dt * 60);
      this.rotation += this.velocity * dt;
      this.draw();
      lastTime = now;
      if (Math.abs(this.velocity) < 5e-3) {
        this.velocity = 0;
        this.inertiaId = null;
        return;
      }
      this.inertiaId = requestAnimationFrame(step);
    };
    this.inertiaId = requestAnimationFrame(step);
  }
  stopInertia() {
    if (this.inertiaId) {
      cancelAnimationFrame(this.inertiaId);
      this.inertiaId = null;
    }
    this.velocity = 0;
  }
  destroy() {
    this.stopInertia();
  }
};

// src/renderer.ts
var LuopanRenderer = class extends BaseRotatableCanvas {
  constructor(container, data, file, oldSource, onDataChange, plugin, showTopMarker, showSectorDividers) {
    super(container);
    __publicField(this, "data");
    __publicField(this, "layers");
    __publicField(this, "textZones", []);
    __publicField(this, "file");
    __publicField(this, "oldSource");
    __publicField(this, "plugin");
    __publicField(this, "onDataChange");
    __publicField(this, "showTopMarker");
    __publicField(this, "showSectorDividers");
    __publicField(this, "hoveredSector", null);
    this.data = data;
    this.file = file;
    this.oldSource = oldSource;
    this.onDataChange = onDataChange;
    this.plugin = plugin;
    this.showTopMarker = showTopMarker;
    this.showSectorDividers = showSectorDividers;
    this.computeLayout();
    this.initCanvas("luopan-container");
    this.bindEvents();
    this.canvas.addEventListener("mousemove", this.onMouseMoveHover.bind(this));
    this.canvas.addEventListener("click", this.onClick.bind(this));
    this.draw();
  }
  computeLayout() {
    const base = this.data.baseRadius || 100;
    const step = this.data.radiusStep || 45;
    this.layers = this.data.layers.map((layer, idx) => {
      const radius = base + idx * step;
      const fontSize = layer.fontSize || (layer.items.length > 16 ? 16 : layer.items.length > 8 ? 20 : 24);
      const color = layer.color || LAYER_COLORS[layer.name] || "#CCCCCC";
      return { ...layer, radius, fontSize, color };
    });
  }
  getLayerIndex(radius) {
    for (let li = 0; li < this.layers.length; li++) {
      const inner = li === 0 ? 70 : this.layers[li - 1].radius;
      const outer = this.layers[li].radius;
      if (radius >= inner && radius <= outer) return li;
    }
    return null;
  }
  handleShiftDragStart(angle, radius, e) {
    const li = this.getLayerIndex(radius);
    if (li !== null) {
      this.rotatingDepthOrIdx = li;
      return true;
    }
    return false;
  }
  handleShiftDragMove(angle, e) {
    const li = this.rotatingDepthOrIdx;
    const currentOffset = this.layerRotations.get(li) || 0;
    const delta = angle - this.lastMouseAngle;
    this.layerRotations.set(li, currentOffset + delta);
    this.draw();
  }
  async handleShiftDragEnd() {
    const li = this.rotatingDepthOrIdx;
    const layer = this.layers[li];
    const items = layer.items;
    if (items.length > 1) {
      const anglePerItem = 2 * Math.PI / items.length;
      const offset = this.layerRotations.get(li) || 0;
      const steps = Math.round(offset / anglePerItem);
      if (steps !== 0) {
        const normalizedSteps = (steps % items.length + items.length) % items.length;
        const moved = items.splice(0, normalizedSteps);
        items.push(...moved);
        this.layerRotations.set(li, offset - steps * anglePerItem);
        await updateCodeBlock(this.file, this.oldSource, this.data, this.plugin);
        this.oldSource = serializeLuopanData(this.data, this.data._format);
        this.draw();
      }
    }
    this.rotatingDepthOrIdx = -1;
  }
  draw() {
    var _a, _b;
    if (!this.ctx) return;
    const settings = this.plugin.settings;
    const opacity = settings.sectorOpacity;
    const globalTextColor = settings.textColor || void 0;
    const customFill = settings.customSectorColor || void 0;
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = "#1e1e2f";
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.save();
    this.ctx.translate(this.centerX, this.centerY);
    this.ctx.rotate(this.rotation);
    this.ctx.translate(-this.centerX, -this.centerY);
    if (this.showSectorDividers) {
      for (let li = 0; li < this.layers.length; li++) {
        const layer = this.layers[li];
        const count = layer.items.length;
        if (count === 0) continue;
        const angleStep = 360 / count;
        const layerOffset = this.layerRotations.get(li) || 0;
        for (let i = 0; i < count; i++) {
          const ang = i * angleStep + layerOffset * 180 / Math.PI;
          const rad = ang * Math.PI / 180;
          const startRadius = layer.radius - 10;
          const endRadius = layer.radius + 5;
          const x1 = this.centerX + startRadius * Math.cos(rad);
          const y1 = this.centerY + startRadius * Math.sin(rad);
          const x2 = this.centerX + endRadius * Math.cos(rad);
          const y2 = this.centerY + endRadius * Math.sin(rad);
          this.ctx.beginPath();
          this.ctx.moveTo(x1, y1);
          this.ctx.lineTo(x2, y2);
          this.ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
          this.ctx.lineWidth = 1.5;
          this.ctx.stroke();
        }
      }
    }
    for (let li = 0; li < this.layers.length; li++) {
      const layer = this.layers[li];
      const items = layer.items;
      const count = items.length;
      if (count === 0) continue;
      const angleStep = 360 / count;
      const layerOffset = this.layerRotations.get(li) || 0;
      for (let i = 0; i < count; i++) {
        const startAngle = i * angleStep + layerOffset * 180 / Math.PI;
        const endAngle = startAngle + angleStep;
        const innerRadius = li === 0 ? 70 : this.layers[li - 1].radius;
        const outerRadius = layer.radius;
        this.ctx.beginPath();
        this.ctx.moveTo(
          this.centerX + innerRadius * Math.cos(startAngle * Math.PI / 180),
          this.centerY + innerRadius * Math.sin(startAngle * Math.PI / 180)
        );
        this.ctx.arc(this.centerX, this.centerY, outerRadius, startAngle * Math.PI / 180, endAngle * Math.PI / 180);
        this.ctx.arc(this.centerX, this.centerY, innerRadius, endAngle * Math.PI / 180, startAngle * Math.PI / 180, true);
        this.ctx.closePath();
        const isHovered = ((_a = this.hoveredSector) == null ? void 0 : _a.layerIdx) === li && ((_b = this.hoveredSector) == null ? void 0 : _b.itemIdx) === i;
        if (isHovered) {
          this.ctx.fillStyle = this.lightenColor(layer.color, 30);
          this.ctx.strokeStyle = "#ffffff";
          this.ctx.lineWidth = 2.5;
        } else {
          this.ctx.fillStyle = customFill || layer.color;
          this.ctx.strokeStyle = "#ffffff33";
          this.ctx.lineWidth = 1.5;
        }
        this.ctx.globalAlpha = opacity;
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
        this.ctx.stroke();
      }
    }
    this.drawTaiji(this.centerX, this.centerY, 70);
    this.ctx.restore();
    this.textZones = [];
    for (let li = 0; li < this.layers.length; li++) {
      const layer = this.layers[li];
      const items = layer.items;
      const count = items.length;
      if (count === 0) continue;
      const angleStep = 360 / count;
      const layerOffset = this.layerRotations.get(li) || 0;
      for (let i = 0; i < count; i++) {
        let text = items[i];
        const linkMatch = text.match(/\[\[([^\]]+)\]\]/);
        let displayText = text;
        let linkTarget = null;
        if (linkMatch) {
          displayText = linkMatch[1];
          linkTarget = linkMatch[1];
        }
        const startAng = i * angleStep + layerOffset * 180 / Math.PI;
        const midAngle = startAng + angleStep / 2;
        const rad = midAngle * Math.PI / 180;
        const innerRadius = li === 0 ? 70 : this.layers[li - 1].radius;
        const outerRadius = layer.radius;
        const midRadius = (innerRadius + outerRadius) / 2;
        const worldX = this.centerX + midRadius * Math.cos(rad);
        const worldY = this.centerY + midRadius * Math.sin(rad);
        const cosR = Math.cos(this.rotation);
        const sinR = Math.sin(this.rotation);
        const dx = worldX - this.centerX;
        const dy = worldY - this.centerY;
        const screenX = this.centerX + dx * cosR - dy * sinR;
        const screenY = this.centerY + dx * sinR + dy * cosR;
        const screenAngle = midAngle + this.rotation * 180 / Math.PI + 90;
        this.ctx.save();
        this.ctx.translate(screenX, screenY);
        this.ctx.rotate(screenAngle * Math.PI / 180);
        this.ctx.font = `bold ${layer.fontSize}px "Segoe UI", "Microsoft YaHei", sans-serif`;
        this.ctx.fillStyle = globalTextColor || layer.color;
        this.ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
        this.ctx.shadowBlur = 2;
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(displayText, 0, 0);
        this.ctx.shadowColor = "transparent";
        this.ctx.restore();
        this.textZones.push({
          x: screenX,
          y: screenY,
          layerIdx: li,
          itemIdx: i,
          text,
          link: linkTarget || void 0
        });
      }
    }
    if (this.data.centerText) {
      this.ctx.font = 'bold 28px "Segoe UI", "Microsoft YaHei", sans-serif';
      this.ctx.fillStyle = "#FFFFFF";
      this.ctx.shadowColor = "rgba(0,0,0,0.5)";
      this.ctx.shadowBlur = 3;
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.fillText(this.data.centerText, this.centerX, this.centerY);
      this.ctx.shadowColor = "transparent";
    }
    if (this.showTopMarker) {
      const topY = this.centerY - (this.data.baseRadius + this.data.radiusStep * this.layers.length + 30);
      this.ctx.beginPath();
      this.ctx.moveTo(this.centerX, this.centerY);
      this.ctx.lineTo(this.centerX, topY);
      this.ctx.strokeStyle = "#FF8888";
      this.ctx.lineWidth = 1.5;
      this.ctx.stroke();
    }
  }
  drawTaiji(cx, cy, r) {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    this.ctx.fillStyle = "#000";
    this.ctx.fill();
    this.ctx.strokeStyle = "#fff";
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2);
    this.ctx.fillStyle = "#fff";
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(cx, cy - r / 2, r / 2, 0, 2 * Math.PI);
    this.ctx.fillStyle = "#fff";
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(cx, cy + r / 2, r / 2, 0, 2 * Math.PI);
    this.ctx.fillStyle = "#000";
    this.ctx.fill();
    const eyeR = r / 12;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy - r / 2, eyeR, 0, 2 * Math.PI);
    this.ctx.fillStyle = "#000";
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(cx, cy - r / 2, eyeR / 2, 0, 2 * Math.PI);
    this.ctx.fillStyle = "#fff";
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(cx, cy + r / 2, eyeR, 0, 2 * Math.PI);
    this.ctx.fillStyle = "#fff";
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(cx, cy + r / 2, eyeR / 2, 0, 2 * Math.PI);
    this.ctx.fillStyle = "#000";
    this.ctx.fill();
    this.ctx.restore();
  }
  lightenColor(color, percent) {
    if (color.startsWith("#")) {
      let hex = color.slice(1);
      if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
      const num = parseInt(hex, 16);
      let r = (num >> 16) + percent;
      let g = (num >> 8 & 255) + percent;
      let b = (num & 255) + percent;
      r = Math.min(255, Math.max(0, r));
      g = Math.min(255, Math.max(0, g));
      b = Math.min(255, Math.max(0, b));
      return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, "0")}`;
    }
    return color;
  }
  onMouseMoveHover(e) {
    const rect = this.canvas.getBoundingClientRect();
    const sx = this.canvas.width / rect.width;
    const sy = this.canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * sx;
    const my = (e.clientY - rect.top) * sy;
    const rawAngle = Math.atan2(my - this.centerY, mx - this.centerX);
    const radius = Math.hypot(mx - this.centerX, my - this.centerY);
    const li = this.getLayerIndex(radius);
    if (li === null) {
      this.hoveredSector = null;
      this.draw();
      return;
    }
    const layer = this.layers[li];
    const count = layer.items.length;
    if (count === 0) {
      this.hoveredSector = null;
      this.draw();
      return;
    }
    let effectiveAngle = rawAngle - this.rotation;
    const layerOffsetRad = this.layerRotations.get(li) || 0;
    effectiveAngle -= layerOffsetRad;
    effectiveAngle = (effectiveAngle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    const angleStep = 2 * Math.PI / count;
    const idx = Math.floor(effectiveAngle / angleStep);
    if (idx >= 0 && idx < count) {
      if (!this.hoveredSector || this.hoveredSector.layerIdx !== li || this.hoveredSector.itemIdx !== idx) {
        this.hoveredSector = { layerIdx: li, itemIdx: idx };
        this.draw();
      }
    } else {
      if (this.hoveredSector) {
        this.hoveredSector = null;
        this.draw();
      }
    }
  }
  onClick(e) {
    if (!e.ctrlKey && !e.metaKey) return;
    if (this.hoveredSector) {
      const zone = this.textZones.find((z) => z.layerIdx === this.hoveredSector.layerIdx && z.itemIdx === this.hoveredSector.itemIdx);
      if (zone) {
        if (zone.link) {
          const linkFile = this.plugin.app.metadataCache.getFirstLinkpathDest(zone.link, this.file.path);
          if (linkFile) {
            this.plugin.app.workspace.openLinkText(zone.link, this.file.path);
          } else {
            new import_obsidian2.Notice(`\u672A\u627E\u5230\u7B14\u8BB0: ${zone.link}`);
          }
        } else {
          this.openNoteByTitle(zone.text);
        }
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }
  openNoteByTitle(title) {
    const cleanTitle = title.replace(/^\[\[|\]\]$/g, "");
    const file = this.plugin.app.metadataCache.getFirstLinkpathDest(cleanTitle, "");
    if (file) {
      this.plugin.app.workspace.openLinkText(cleanTitle, "", false);
    } else {
      new import_obsidian2.Notice(`\u672A\u627E\u5230\u6807\u9898\u4E3A\u201C${cleanTitle}\u201D\u7684\u7B14\u8BB0`);
    }
  }
  async handleDblClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const sx = this.canvas.width / rect.width;
    const sy = this.canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * sx;
    const my = (e.clientY - rect.top) * sy;
    let minDist = 20;
    let hit = null;
    for (const zone of this.textZones) {
      const dx = zone.x - mx, dy = zone.y - my;
      const dist = Math.hypot(dx, dy);
      if (dist < minDist) {
        minDist = dist;
        hit = zone;
      }
    }
    if (hit) {
      const newText = await this.promptForText(hit.text);
      if (newText !== null && newText !== hit.text) {
        this.data.layers[hit.layerIdx].items[hit.itemIdx] = newText;
        await updateCodeBlock(this.file, this.oldSource, this.data, this.plugin);
        this.oldSource = serializeLuopanData(this.data, this.data._format);
        this.onDataChange(this.data);
        this.computeLayout();
        this.draw();
      }
    } else {
      for (const zone of this.textZones) {
        if (zone.link) {
          const dx = zone.x - mx, dy = zone.y - my;
          if (Math.hypot(dx, dy) < 15) {
            const linkFile = this.plugin.app.metadataCache.getFirstLinkpathDest(zone.link, this.file.path);
            if (linkFile) {
              this.plugin.app.workspace.openLinkText(linkFile.path, this.file.path);
            } else {
              new import_obsidian2.Notice(`\u672A\u627E\u5230\u7B14\u8BB0: ${zone.link}`);
            }
            break;
          }
        }
      }
    }
  }
  promptForText(current) {
    return new Promise((resolve) => {
      const modal = new EditTextModal(this.plugin.app, current, resolve);
      modal.open();
    });
  }
  destroy() {
    super.destroy();
    this.canvas.removeEventListener("mousemove", this.onMouseMoveHover);
  }
};

// src/settings.ts
var import_obsidian3 = require("obsidian");
var LuopanSettingTab = class extends import_obsidian3.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    __publicField(this, "plugin");
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "\u7F57\u76D8\u4E0E\u65ED\u65E5\u56FE\u8BBE\u7F6E" });
    new import_obsidian3.Setting(containerEl).setName("\u663E\u793A\u9876\u90E8\u53C2\u8003\u523B\u7EBF").setDesc("\u4ECE\u5706\u5FC3\u5230\u6B63\u4E0A\u65B9\u7ED8\u5236\u4E00\u6761\u7EC6\u7EBF\uFF08\u4E0D\u968F\u7F57\u76D8\u65CB\u8F6C\uFF09").addToggle((toggle) => toggle.setValue(this.plugin.settings.showTopMarker).onChange(async (value) => {
      this.plugin.settings.showTopMarker = value;
      await this.plugin.saveSettings();
      this.plugin.refreshAllRenderers();
    }));
    new import_obsidian3.Setting(containerEl).setName("\u663E\u793A\u6247\u533A\u5206\u754C\u7EBF").setDesc("\u5728\u6BCF\u4E2A\u6247\u533A\u4E4B\u95F4\u7ED8\u5236\u5F88\u865A\u7684\u534A\u900F\u660E\u5F84\u5411\u7EC6\u7EBF").addToggle((toggle) => toggle.setValue(this.plugin.settings.showSectorDividers).onChange(async (value) => {
      this.plugin.settings.showSectorDividers = value;
      await this.plugin.saveSettings();
      this.plugin.refreshAllRenderers();
    }));
    new import_obsidian3.Setting(containerEl).setName("\u6247\u533A\u4E0D\u900F\u660E\u5EA6").setDesc("\u6570\u503C\u8D8A\u4F4E\u8D8A\u900F\u660E").addSlider((slider) => slider.setLimits(0.1, 1, 0.05).setValue(this.plugin.settings.sectorOpacity).onChange(async (value) => {
      this.plugin.settings.sectorOpacity = value;
      await this.plugin.saveSettings();
      this.plugin.refreshAllRenderers();
    }));
    new import_obsidian3.Setting(containerEl).setName("\u6587\u5B57\u989C\u8272").setDesc("\u6240\u6709\u76D8\u9762\u6587\u5B57\u7684\u5168\u5C40\u989C\u8272").addColorPicker((picker) => picker.setValue(this.plugin.settings.textColor).onChange(async (value) => {
      this.plugin.settings.textColor = value;
      await this.plugin.saveSettings();
      this.plugin.refreshAllRenderers();
    }));
    new import_obsidian3.Setting(containerEl).setName("\u81EA\u5B9A\u4E49\u76D8\u9762\u989C\u8272").setDesc("\u8986\u76D6\u9ED8\u8BA4\u914D\u8272\uFF0C\u7559\u7A7A\u5219\u4F7F\u7528\u539F\u59CB\u989C\u8272").addColorPicker((picker) => picker.setValue(this.plugin.settings.customSectorColor || "").onChange(async (value) => {
      this.plugin.settings.customSectorColor = value;
      await this.plugin.saveSettings();
      this.plugin.refreshAllRenderers();
    }));
  }
};

// src/sunburst.ts
var import_obsidian4 = require("obsidian");
function buildHeadingTree(headings) {
  const roots = [];
  const stack = [];
  for (const h of headings) {
    const node = {
      text: h.text,
      level: h.level,
      children: [],
      rawLine: h.raw,
      file: h.file,
      line: h.line
    };
    while (stack.length > 0 && stack[stack.length - 1].level >= h.level) {
      stack.pop();
    }
    if (stack.length === 0) {
      roots.push(node);
    } else {
      stack[stack.length - 1].children.push(node);
    }
    stack.push(node);
  }
  return roots;
}
var SunburstRenderer = class extends BaseRotatableCanvas {
  constructor(container, noteData, plugin) {
    super(container);
    __publicField(this, "roots");
    __publicField(this, "maxDepth");
    __publicField(this, "textZones", []);
    __publicField(this, "plugin");
    // 用于 Shift+拖拽时保存扇区信息
    __publicField(this, "dragTarget", null);
    this.plugin = plugin;
    this.roots = noteData.map((data) => ({
      text: data.noteName,
      level: 0,
      children: buildHeadingTree(data.headings)
    }));
    const maxLevel = Math.max(0, ...noteData.flatMap((d) => d.headings.map((h) => h.level)));
    this.maxDepth = maxLevel + 1;
    this.initCanvas("sunburst-container");
    this.bindEvents();
    this.draw();
  }
  // 获取深度（根据半径）
  getDepth(radius) {
    const totalRadius = 350;
    const radiusStep = totalRadius / this.maxDepth;
    return Math.floor(radius / radiusStep);
  }
  // 命中测试
  hitTest(angle, radius, depth) {
    if (depth < 0 || depth > this.maxDepth) return null;
    const totalRadius = 350;
    const radiusStep = totalRadius / this.maxDepth;
    const innerRadius = depth * radiusStep;
    const outerRadius = innerRadius + radiusStep;
    if (radius < innerRadius || radius > outerRadius) return null;
    const searchParent = (nodes, startAngle2, endAngle2, currentDepth) => {
      if (currentDepth === depth - 1) {
        return { parentChildren: nodes, startAngle: startAngle2, endAngle: endAngle2 };
      }
      const layerOffset2 = this.layerRotations.get(currentDepth) || 0;
      const adjustedStart2 = startAngle2 + layerOffset2;
      const adjustedEnd2 = endAngle2 + layerOffset2;
      const totalAngle2 = adjustedEnd2 - adjustedStart2;
      const anglePerNode2 = totalAngle2 / nodes.length;
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const childStart = adjustedStart2 + i * anglePerNode2;
        const childEnd = childStart + anglePerNode2;
        if (node.children.length > 0 && currentDepth < depth - 1) {
          const result = searchParent(node.children, childStart, childEnd, currentDepth + 1);
          if (result) return result;
        }
      }
      return null;
    };
    if (depth === 0) {
      const layerOffset2 = this.layerRotations.get(0) || 0;
      const adjustedStart2 = layerOffset2;
      const adjustedEnd2 = 2 * Math.PI + layerOffset2;
      const totalAngle2 = adjustedEnd2 - adjustedStart2;
      const anglePerNode2 = totalAngle2 / this.roots.length;
      const localAngle2 = ((angle - adjustedStart2) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
      const index2 = Math.floor(localAngle2 / anglePerNode2);
      if (index2 >= 0 && index2 < this.roots.length) {
        return { depth: 0, parentChildren: this.roots, originalIndex: index2, node: this.roots[index2] };
      }
      return null;
    }
    const parentResult = searchParent(this.roots, 0, 2 * Math.PI, 0);
    if (!parentResult) return null;
    const { parentChildren, startAngle, endAngle } = parentResult;
    const layerOffset = this.layerRotations.get(depth) || 0;
    const adjustedStart = startAngle + layerOffset;
    const adjustedEnd = endAngle + layerOffset;
    const totalAngle = adjustedEnd - adjustedStart;
    const anglePerNode = totalAngle / parentChildren.length;
    const localAngle = ((angle - adjustedStart) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    const index = Math.floor(localAngle / anglePerNode);
    if (index >= 0 && index < parentChildren.length) {
      return { depth, parentChildren, originalIndex: index, node: parentChildren[index] };
    }
    return null;
  }
  // Shift+拖拽开始
  handleShiftDragStart(angle, radius, e) {
    const depth = this.getDepth(radius);
    const hit = this.hitTest(angle, radius, depth);
    if (hit && depth > 0) {
      this.rotatingDepthOrIdx = depth;
      this.dragTarget = hit;
      return true;
    }
    return false;
  }
  // Shift+拖拽移动
  handleShiftDragMove(angle, e) {
    const depth = this.rotatingDepthOrIdx;
    const currentOffset = this.layerRotations.get(depth) || 0;
    const delta = angle - this.lastMouseAngle;
    this.layerRotations.set(depth, currentOffset + delta);
    this.draw();
  }
  // Shift+拖拽结束：循环移位该层
  handleShiftDragEnd() {
    const depth = this.rotatingDepthOrIdx;
    if (this.dragTarget && this.dragTarget.parentChildren.length > 1) {
      const parentChildren = this.dragTarget.parentChildren;
      const anglePerNode = 2 * Math.PI / parentChildren.length;
      const offset = this.layerRotations.get(depth) || 0;
      const steps = Math.round(offset / anglePerNode);
      if (steps !== 0) {
        const normalizedSteps = (steps % parentChildren.length + parentChildren.length) % parentChildren.length;
        const moved = parentChildren.splice(0, normalizedSteps);
        parentChildren.push(...moved);
        this.layerRotations.set(depth, offset - steps * anglePerNode);
        this.draw();
      }
    }
    this.dragTarget = null;
    this.rotatingDepthOrIdx = -1;
  }
  // 绘制
  draw() {
    if (!this.ctx || this.roots.length === 0) return;
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = "#1e1e2f";
    this.ctx.fillRect(0, 0, this.width, this.height);
    const totalRadius = 350;
    const radiusStep = totalRadius / this.maxDepth;
    this.ctx.save();
    this.ctx.translate(this.centerX, this.centerY);
    this.ctx.rotate(this.rotation);
    this.ctx.translate(-this.centerX, -this.centerY);
    this.textZones = [];
    this.drawArc(this.roots, 0, 2 * Math.PI, 0, radiusStep);
    this.ctx.restore();
  }
  // 递归绘制弧
  drawArc(nodes, startAngle, endAngle, depth, radiusStep) {
    if (nodes.length === 0) return;
    const innerRadius = depth * radiusStep;
    const outerRadius = innerRadius + radiusStep;
    const totalAngle = endAngle - startAngle;
    const layerOffset = this.layerRotations.get(depth) || 0;
    const adjustedStart = startAngle + layerOffset;
    const adjustedEnd = endAngle + layerOffset;
    const anglePerNode = totalAngle / nodes.length;
    const themeColors = this.getThemeColors();
    const style = getComputedStyle(document.body);
    const bgColor = style.getPropertyValue("--background-primary").trim() || "#1e1e2f";
    const textColor = style.getPropertyValue("--text-normal").trim() || "#ffffff";
    nodes.forEach((node, i) => {
      const a1 = adjustedStart + i * anglePerNode;
      const a2 = a1 + anglePerNode;
      this.ctx.beginPath();
      this.ctx.arc(this.centerX, this.centerY, outerRadius, a1, a2);
      this.ctx.arc(this.centerX, this.centerY, innerRadius, a2, a1, true);
      this.ctx.closePath();
      const colorIndex = depth % themeColors.length;
      const fillColor = themeColors[colorIndex];
      if (depth === 0) {
        this.ctx.fillStyle = fillColor;
        this.ctx.globalAlpha = 0.9;
      } else {
        this.ctx.fillStyle = fillColor;
        this.ctx.globalAlpha = 0.75;
      }
      this.ctx.fill();
      this.ctx.globalAlpha = 1;
      this.ctx.strokeStyle = bgColor;
      this.ctx.lineWidth = 1.5;
      this.ctx.stroke();
      if (anglePerNode > 0.05 && outerRadius - innerRadius > 12) {
        const midAngle = (a1 + a2) / 2;
        const midRadius = (innerRadius + outerRadius) / 2;
        const worldX = this.centerX + midRadius * Math.cos(midAngle);
        const worldY = this.centerY + midRadius * Math.sin(midAngle);
        const cosR = Math.cos(this.rotation);
        const sinR = Math.sin(this.rotation);
        const dx = worldX - this.centerX;
        const dy = worldY - this.centerY;
        const screenX = this.centerX + dx * cosR - dy * sinR;
        const screenY = this.centerY + dx * sinR + dy * cosR;
        this.ctx.save();
        this.ctx.translate(worldX, worldY);
        this.ctx.rotate(midAngle + Math.PI / 2);
        this.ctx.font = 'bold 12px "Microsoft YaHei", SimHei, sans-serif';
        this.ctx.fillStyle = textColor;
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(node.text.substring(0, 8), 0, 0);
        this.ctx.restore();
        this.textZones.push({ x: screenX, y: screenY, depth, index: i, node });
      }
      if (node.children.length > 0) {
        this.drawArc(node.children, a1, a2, depth + 1, radiusStep);
      }
    });
  }
  // 获取主题色数组
  getThemeColors() {
    const style = getComputedStyle(document.body);
    const accent = style.getPropertyValue("--interactive-accent").trim() || "#7f6df2";
    const textAccent = style.getPropertyValue("--text-accent").trim() || accent;
    const bg1 = style.getPropertyValue("--background-primary").trim() || "#1e1e2f";
    const bg2 = style.getPropertyValue("--background-secondary").trim() || "#252532";
    return [
      accent,
      textAccent,
      this.adjustColor(accent, 0.8),
      this.adjustColor(textAccent, 1.2),
      this.adjustColor(bg2, 1.3),
      this.adjustColor(bg1, 1.5)
    ];
  }
  adjustColor(color, factor) {
    const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (rgbMatch) {
      let r = Math.min(255, Math.round(parseInt(rgbMatch[1]) * factor));
      let g = Math.min(255, Math.round(parseInt(rgbMatch[2]) * factor));
      let b = Math.min(255, Math.round(parseInt(rgbMatch[3]) * factor));
      return `rgb(${r}, ${g}, ${b})`;
    }
    return color;
  }
  // 双击编辑标题
  async handleDblClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const sx = this.canvas.width / rect.width;
    const sy = this.canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * sx;
    const my = (e.clientY - rect.top) * sy;
    let hit = null;
    let minDist = 20;
    for (const zone of this.textZones) {
      const dx = zone.x - mx, dy = zone.y - my;
      const dist = Math.hypot(dx, dy);
      if (dist < minDist) {
        minDist = dist;
        hit = zone;
      }
    }
    if (hit && hit.node.file && hit.node.line !== void 0) {
      const node = hit.node;
      const newText = await this.promptForText(node.text);
      if (newText !== null && newText !== node.text) {
        node.text = newText;
        const prefix = "#".repeat(node.level);
        const newRaw = `${prefix} ${newText}`;
        await this.updateHeadingInFile(node.file, node.line, newRaw);
        node.rawLine = newRaw;
        this.draw();
      }
    }
  }
  async updateHeadingInFile(file, line, newRaw) {
    const content = await this.plugin.app.vault.read(file);
    const lines = content.split("\n");
    if (line < 0 || line >= lines.length) {
      new import_obsidian4.Notice("\u884C\u53F7\u65E0\u6548\uFF0C\u65E0\u6CD5\u66F4\u65B0");
      return;
    }
    lines[line] = newRaw;
    const newContent = lines.join("\n");
    await this.plugin.app.vault.modify(file, newContent);
    new import_obsidian4.Notice("\u6807\u9898\u5DF2\u66F4\u65B0");
  }
  promptForText(current) {
    return new Promise((resolve) => {
      const modal = new EditTextModal(this.plugin.app, current, resolve);
      modal.open();
    });
  }
};
async function getHeadingsFromFile(file, plugin) {
  const cache = plugin.app.metadataCache.getFileCache(file);
  const lines = (await plugin.app.vault.read(file)).split("\n");
  if (!(cache == null ? void 0 : cache.headings)) return [];
  return cache.headings.map((h) => ({
    level: h.level,
    text: h.heading,
    line: h.position.start.line,
    raw: lines[h.position.start.line],
    file
  }));
}

// src/main.ts
var LuopanIntegratedPlugin = class extends import_obsidian5.Plugin {
  constructor() {
    super(...arguments);
    __publicField(this, "settings");
    __publicField(this, "activeRenderers", /* @__PURE__ */ new Set());
  }
  async onload() {
    await this.loadSettings();
    this.addSettingTab(new LuopanSettingTab(this.app, this));
    this.registerMarkdownCodeBlockProcessor("luopan", async (source, el, ctx) => {
      const lines = source.trim().split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
      if (lines.length === 0) {
        el.createEl("div", { text: "\u7A7A\u4EE3\u7801\u5757" });
        return;
      }
      const firstLine = lines[0].toLowerCase();
      if (firstLine === "sun" || firstLine === "sunburst") {
        const noteLinks = [];
        for (let i = 1; i < lines.length; i++) {
          const match = lines[i].match(/^\[\[(.+)\]\]$/);
          if (match) noteLinks.push(match[1]);
        }
        if (noteLinks.length === 0) {
          const abstractFile = this.app.vault.getAbstractFileByPath(ctx.sourcePath);
          if (abstractFile instanceof import_obsidian5.TFile) noteLinks.push(abstractFile.basename);
        }
        const allHeadings = [];
        for (const link of noteLinks) {
          const file2 = this.app.metadataCache.getFirstLinkpathDest(link, ctx.sourcePath);
          if (file2 instanceof import_obsidian5.TFile) {
            const headings = await getHeadingsFromFile(file2, this);
            allHeadings.push({ noteName: file2.basename, headings });
          } else {
            new import_obsidian5.Notice(`\u672A\u627E\u5230\u7B14\u8BB0: ${link}`);
          }
        }
        if (allHeadings.length === 0) {
          el.createEl("div", { text: "\u6CA1\u6709\u6709\u6548\u7684\u7B14\u8BB0" });
          return;
        }
        const renderer2 = new SunburstRenderer(el, allHeadings, this);
        const child2 = new import_obsidian5.MarkdownRenderChild(el);
        child2.onunload = () => renderer2.destroy();
        ctx.addChild(child2);
        return;
      }
      const data = parseLuopanCode(source);
      if (!data) {
        el.createEl("div", { text: "\u65E0\u6548\u7684\u7F57\u76D8\u6570\u636E\u683C\u5F0F" });
        return;
      }
      const file = this.app.vault.getAbstractFileByPath(ctx.sourcePath);
      if (!(file instanceof import_obsidian5.TFile)) return;
      const renderer = new LuopanRenderer(
        el,
        data,
        file,
        source,
        () => {
        },
        this,
        this.settings.showTopMarker,
        this.settings.showSectorDividers
      );
      this.activeRenderers.add(renderer);
      const child = new import_obsidian5.MarkdownRenderChild(el);
      child.onunload = () => {
        renderer.destroy();
        this.activeRenderers.delete(renderer);
      };
      ctx.addChild(child);
    });
    this.registerMarkdownPostProcessor(async (el, ctx) => {
      const links = el.querySelectorAll("a.internal-link");
      Array.from(links).forEach((link) => {
        var _a;
        if (link.textContent !== "\u7F57\u76D8") return;
        const targetPath = link.getAttribute("data-href") || link.getAttribute("href");
        if (!targetPath) return;
        const targetFile = this.app.metadataCache.getFirstLinkpathDest(targetPath, ctx.sourcePath);
        if (!targetFile) return;
        const cache = this.app.metadataCache.getFileCache(targetFile);
        const frontmatter = cache == null ? void 0 : cache.frontmatter;
        if (!frontmatter) return;
        const data = extractFromFrontmatter(frontmatter);
        if (!data) return;
        const container = document.createElement("div");
        new LuopanRenderer(
          container,
          data,
          targetFile,
          "",
          () => {
          },
          this,
          this.settings.showTopMarker,
          this.settings.showSectorDividers
        );
        (_a = link.parentNode) == null ? void 0 : _a.replaceChild(container, link);
      });
    });
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  refreshAllRenderers() {
    this.activeRenderers.forEach((renderer) => {
      renderer.showTopMarker = this.settings.showTopMarker;
      renderer.showSectorDividers = this.settings.showSectorDividers;
      renderer.draw();
    });
  }
  onunload() {
    this.activeRenderers.forEach((r) => r.destroy());
    this.activeRenderers.clear();
  }
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL21haW4udHMiLCAic3JjL3R5cGVzLnRzIiwgInNyYy9wYXJzZXIudHMiLCAic3JjL2NvbnN0YW50cy50cyIsICJzcmMvbW9kYWxzLnRzIiwgInNyYy9yZW5kZXJlci50cyIsICJzcmMvYmFzZS1yZW5kZXJlci50cyIsICJzcmMvc2V0dGluZ3MudHMiLCAic3JjL3N1bmJ1cnN0LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQge1xyXG4gICAgUGx1Z2luLFxyXG4gICAgVEZpbGUsXHJcbiAgICBOb3RpY2UsXHJcbiAgICBNYXJrZG93blJlbmRlckNoaWxkXHJcbn0gZnJvbSAnb2JzaWRpYW4nO1xyXG5pbXBvcnQgeyBMdW9wYW5TZXR0aW5ncywgREVGQVVMVF9TRVRUSU5HUyB9IGZyb20gJy4vdHlwZXMnO1xyXG5pbXBvcnQgeyBwYXJzZUx1b3BhbkNvZGUsIGV4dHJhY3RGcm9tRnJvbnRtYXR0ZXIgfSBmcm9tICcuL3BhcnNlcic7XHJcbmltcG9ydCB7IEx1b3BhblJlbmRlcmVyIH0gZnJvbSAnLi9yZW5kZXJlcic7XHJcbmltcG9ydCB7IEx1b3BhblNldHRpbmdUYWIgfSBmcm9tICcuL3NldHRpbmdzJztcclxuaW1wb3J0IHsgU3VuYnVyc3RSZW5kZXJlciwgZ2V0SGVhZGluZ3NGcm9tRmlsZSB9IGZyb20gJy4vc3VuYnVyc3QnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTHVvcGFuSW50ZWdyYXRlZFBsdWdpbiBleHRlbmRzIFBsdWdpbiB7XHJcbiAgICBzZXR0aW5ncyE6IEx1b3BhblNldHRpbmdzO1xyXG4gICAgcHJpdmF0ZSBhY3RpdmVSZW5kZXJlcnM6IFNldDxMdW9wYW5SZW5kZXJlcj4gPSBuZXcgU2V0KCk7XHJcblxyXG4gICAgYXN5bmMgb25sb2FkKCkge1xyXG4gICAgICAgIGF3YWl0IHRoaXMubG9hZFNldHRpbmdzKCk7XHJcbiAgICAgICAgdGhpcy5hZGRTZXR0aW5nVGFiKG5ldyBMdW9wYW5TZXR0aW5nVGFiKHRoaXMuYXBwLCB0aGlzKSk7XHJcblxyXG4gICAgICAgIC8vIFx1N0VERlx1NEUwMFx1NTkwNFx1NzQwNiBsdW9wYW4gXHU0RUUzXHU3ODAxXHU1NzU3XHVGRjFBXHU2NTJGXHU2MzAxXHU2NjZFXHU5MDFBXHU3RjU3XHU3NkQ4XHU1NDhDIHN1bmJ1cnN0IFx1NkEyMVx1NUYwRlxyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJNYXJrZG93bkNvZGVCbG9ja1Byb2Nlc3NvcignbHVvcGFuJywgYXN5bmMgKHNvdXJjZSwgZWwsIGN0eCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBsaW5lcyA9IHNvdXJjZS50cmltKCkuc3BsaXQoL1xccj9cXG4vKS5tYXAobCA9PiBsLnRyaW0oKSkuZmlsdGVyKGwgPT4gbC5sZW5ndGggPiAwKTtcclxuICAgICAgICAgICAgaWYgKGxpbmVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgZWwuY3JlYXRlRWwoJ2RpdicsIHsgdGV4dDogJ1x1N0E3QVx1NEVFM1x1NzgwMVx1NTc1NycgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGZpcnN0TGluZSA9IGxpbmVzWzBdLnRvTG93ZXJDYXNlKCk7XHJcblxyXG4gICAgICAgICAgICAvLyBcdTg5RTZcdTUzRDFcdThCQ0RcdTY1MkZcdTYzMDEgc3VuIFx1NjIxNiBzdW5idXJzdFxyXG4gICAgICAgICAgICBpZiAoZmlyc3RMaW5lID09PSAnc3VuJyB8fCBmaXJzdExpbmUgPT09ICdzdW5idXJzdCcpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vdGVMaW5rczogc3RyaW5nW10gPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBtYXRjaCA9IGxpbmVzW2ldLm1hdGNoKC9eXFxbXFxbKC4rKVxcXVxcXSQvKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobWF0Y2gpIG5vdGVMaW5rcy5wdXNoKG1hdGNoWzFdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChub3RlTGlua3MubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWJzdHJhY3RGaWxlID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKGN0eC5zb3VyY2VQYXRoKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYWJzdHJhY3RGaWxlIGluc3RhbmNlb2YgVEZpbGUpIG5vdGVMaW5rcy5wdXNoKGFic3RyYWN0RmlsZS5iYXNlbmFtZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgYWxsSGVhZGluZ3M6IHsgbm90ZU5hbWU6IHN0cmluZzsgaGVhZGluZ3M6IEF3YWl0ZWQ8UmV0dXJuVHlwZTx0eXBlb2YgZ2V0SGVhZGluZ3NGcm9tRmlsZT4+IH1bXSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBsaW5rIG9mIG5vdGVMaW5rcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldEZpcnN0TGlua3BhdGhEZXN0KGxpbmssIGN0eC5zb3VyY2VQYXRoKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZmlsZSBpbnN0YW5jZW9mIFRGaWxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGhlYWRpbmdzID0gYXdhaXQgZ2V0SGVhZGluZ3NGcm9tRmlsZShmaWxlLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWxsSGVhZGluZ3MucHVzaCh7IG5vdGVOYW1lOiBmaWxlLmJhc2VuYW1lLCBoZWFkaW5ncyB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgTm90aWNlKGBcdTY3MkFcdTYyN0VcdTUyMzBcdTdCMTRcdThCQjA6ICR7bGlua31gKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGFsbEhlYWRpbmdzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsLmNyZWF0ZUVsKCdkaXYnLCB7IHRleHQ6ICdcdTZDQTFcdTY3MDlcdTY3MDlcdTY1NDhcdTc2ODRcdTdCMTRcdThCQjAnIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCByZW5kZXJlciA9IG5ldyBTdW5idXJzdFJlbmRlcmVyKGVsLCBhbGxIZWFkaW5ncywgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjaGlsZCA9IG5ldyBNYXJrZG93blJlbmRlckNoaWxkKGVsKTtcclxuICAgICAgICAgICAgICAgIGNoaWxkLm9udW5sb2FkID0gKCkgPT4gcmVuZGVyZXIuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgY3R4LmFkZENoaWxkKGNoaWxkKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gLS0tIFx1NjY2RVx1OTAxQVx1N0Y1N1x1NzZEOFx1NkEyMVx1NUYwRiAtLS1cclxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHBhcnNlTHVvcGFuQ29kZShzb3VyY2UpO1xyXG4gICAgICAgICAgICBpZiAoIWRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGVsLmNyZWF0ZUVsKCdkaXYnLCB7IHRleHQ6ICdcdTY1RTBcdTY1NDhcdTc2ODRcdTdGNTdcdTc2RDhcdTY1NzBcdTYzNkVcdTY4M0NcdTVGMEYnIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoY3R4LnNvdXJjZVBhdGgpO1xyXG4gICAgICAgICAgICBpZiAoIShmaWxlIGluc3RhbmNlb2YgVEZpbGUpKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBjb25zdCByZW5kZXJlciA9IG5ldyBMdW9wYW5SZW5kZXJlcihcclxuICAgICAgICAgICAgICAgIGVsLCBkYXRhLCBmaWxlLCBzb3VyY2UsXHJcbiAgICAgICAgICAgICAgICAoKSA9PiB7IH0sXHJcbiAgICAgICAgICAgICAgICB0aGlzLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5zaG93VG9wTWFya2VyLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5zaG93U2VjdG9yRGl2aWRlcnNcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgdGhpcy5hY3RpdmVSZW5kZXJlcnMuYWRkKHJlbmRlcmVyKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkID0gbmV3IE1hcmtkb3duUmVuZGVyQ2hpbGQoZWwpO1xyXG4gICAgICAgICAgICBjaGlsZC5vbnVubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlbmRlcmVyLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZlUmVuZGVyZXJzLmRlbGV0ZShyZW5kZXJlcik7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGN0eC5hZGRDaGlsZChjaGlsZCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIFx1NTE4NVx1ODA1NFx1N0Y1N1x1NzZEOFx1OTRGRVx1NjNBNSBbW1x1N0IxNFx1OEJCMFx1NTQwRHxcdTdGNTdcdTc2RDhdXVxyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJNYXJrZG93blBvc3RQcm9jZXNzb3IoYXN5bmMgKGVsLCBjdHgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbGlua3MgPSBlbC5xdWVyeVNlbGVjdG9yQWxsKCdhLmludGVybmFsLWxpbmsnKTtcclxuICAgICAgICAgICAgQXJyYXkuZnJvbShsaW5rcykuZm9yRWFjaChsaW5rID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChsaW5rLnRleHRDb250ZW50ICE9PSAnXHU3RjU3XHU3NkQ4JykgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0UGF0aCA9IGxpbmsuZ2V0QXR0cmlidXRlKCdkYXRhLWhyZWYnKSB8fCBsaW5rLmdldEF0dHJpYnV0ZSgnaHJlZicpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0YXJnZXRQYXRoKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXRGaWxlID0gdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRGaXJzdExpbmtwYXRoRGVzdCh0YXJnZXRQYXRoLCBjdHguc291cmNlUGF0aCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRhcmdldEZpbGUpIHJldHVybjtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNhY2hlID0gdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRGaWxlQ2FjaGUodGFyZ2V0RmlsZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBmcm9udG1hdHRlciA9IGNhY2hlPy5mcm9udG1hdHRlcjtcclxuICAgICAgICAgICAgICAgIGlmICghZnJvbnRtYXR0ZXIpIHJldHVybjtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBleHRyYWN0RnJvbUZyb250bWF0dGVyKGZyb250bWF0dGVyKTtcclxuICAgICAgICAgICAgICAgIGlmICghZGF0YSkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgICAgICBuZXcgTHVvcGFuUmVuZGVyZXIoXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyLCBkYXRhLCB0YXJnZXRGaWxlLCAnJyxcclxuICAgICAgICAgICAgICAgICAgICAoKSA9PiB7IH0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcyxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldHRpbmdzLnNob3dUb3BNYXJrZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5zaG93U2VjdG9yRGl2aWRlcnNcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICBsaW5rLnBhcmVudE5vZGU/LnJlcGxhY2VDaGlsZChjb250YWluZXIsIGxpbmspO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBsb2FkU2V0dGluZ3MoKSB7XHJcbiAgICAgICAgdGhpcy5zZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfU0VUVElOR1MsIGF3YWl0IHRoaXMubG9hZERhdGEoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgc2F2ZVNldHRpbmdzKCkge1xyXG4gICAgICAgIGF3YWl0IHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVmcmVzaEFsbFJlbmRlcmVycygpIHtcclxuICAgICAgICB0aGlzLmFjdGl2ZVJlbmRlcmVycy5mb3JFYWNoKHJlbmRlcmVyID0+IHtcclxuICAgICAgICAgICAgcmVuZGVyZXIuc2hvd1RvcE1hcmtlciA9IHRoaXMuc2V0dGluZ3Muc2hvd1RvcE1hcmtlcjtcclxuICAgICAgICAgICAgcmVuZGVyZXIuc2hvd1NlY3RvckRpdmlkZXJzID0gdGhpcy5zZXR0aW5ncy5zaG93U2VjdG9yRGl2aWRlcnM7XHJcbiAgICAgICAgICAgIHJlbmRlcmVyLmRyYXcoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBvbnVubG9hZCgpIHtcclxuICAgICAgICB0aGlzLmFjdGl2ZVJlbmRlcmVycy5mb3JFYWNoKHIgPT4gci5kZXN0cm95KCkpO1xyXG4gICAgICAgIHRoaXMuYWN0aXZlUmVuZGVyZXJzLmNsZWFyKCk7XHJcbiAgICB9XHJcbn0iLCAiZXhwb3J0IGludGVyZmFjZSBMdW9wYW5TZXR0aW5ncyB7XHJcbiAgICBzaG93VG9wTWFya2VyOiBib29sZWFuO1xyXG4gICAgc2hvd1NlY3RvckRpdmlkZXJzOiBib29sZWFuO1xyXG4gICAgLy8gXHU2NUIwXHU1ODlFXHVGRjFBXHU2MjQ3XHU1MzNBXHU1ODZCXHU1MTQ1XHU0RTBEXHU5MDBGXHU2NjBFXHU1RUE2ICgwLTEpXHJcbiAgICBzZWN0b3JPcGFjaXR5OiBudW1iZXI7XHJcbiAgICAvLyBcdTY1QjBcdTU4OUVcdUZGMUFcdTY1ODdcdTVCNTdcdTk4OUNcdTgyNzJcdUZGMDhcdTY1MkZcdTYzMDEgaGV4IFx1NjIxNiBjc3MgXHU5ODlDXHU4MjcyXHU1QjU3XHU3QjI2XHU0RTMyXHVGRjA5XHJcbiAgICB0ZXh0Q29sb3I6IHN0cmluZztcclxuICAgIC8vIFx1NjVCMFx1NTg5RVx1RkYxQVx1ODFFQVx1NUI5QVx1NEU0OVx1NzZEOFx1OTc2Mlx1OTg5Q1x1ODI3Mlx1RkYwOFx1ODJFNVx1NEUzQVx1N0E3QVx1RkYwQ1x1NTIxOVx1NEY3Rlx1NzUyOFx1NTZGRVx1NUM0Mlx1ODFFQVx1NUUyNlx1NzY4NFx1OTg5Q1x1ODI3Mlx1NjIxNlx1NEUzQlx1OTg5OFx1ODI3Mlx1RkYwOVxyXG4gICAgY3VzdG9tU2VjdG9yQ29sb3I6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IERFRkFVTFRfU0VUVElOR1M6IEx1b3BhblNldHRpbmdzID0ge1xyXG4gICAgc2hvd1RvcE1hcmtlcjogdHJ1ZSxcclxuICAgIHNob3dTZWN0b3JEaXZpZGVyczogdHJ1ZSxcclxuICAgIHNlY3Rvck9wYWNpdHk6IDAuNjUsICAgICAgICAgICAgLy8gXHU5RUQ4XHU4QkE0XHU4RjgzXHU5QUQ4XHU5MDBGXHU2NjBFXHU1RUE2XHJcbiAgICB0ZXh0Q29sb3I6ICcjZmZmZmZmJywgICAgICAgICAgIC8vIFx1OUVEOFx1OEJBNFx1NzY3RFx1ODI3Mlx1NjU4N1x1NUI1N1xyXG4gICAgY3VzdG9tU2VjdG9yQ29sb3I6ICcnLCAgICAgICAgICAvLyBcdTlFRDhcdThCQTRcdTdBN0FcdUZGMENcdTUzNzNcdTRGN0ZcdTc1MjhcdTU0MDRcdTgxRUFcdTkwM0JcdThGOTFcclxufTtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTHVvcGFuTGF5ZXIge1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgaXRlbXM6IHN0cmluZ1tdO1xyXG4gICAgY29sb3I/OiBzdHJpbmc7XHJcbiAgICByYWRpdXM/OiBudW1iZXI7XHJcbiAgICBmb250U2l6ZT86IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBMdW9wYW5EYXRhIHtcclxuICAgIGxheWVyczogTHVvcGFuTGF5ZXJbXTtcclxuICAgIGNlbnRlclRleHQ/OiBzdHJpbmc7XHJcbiAgICBiYXNlUmFkaXVzPzogbnVtYmVyO1xyXG4gICAgcmFkaXVzU3RlcD86IG51bWJlcjtcclxuICAgIF9mb3JtYXQ/OiAnc2ltcGxlJyB8ICdqc29uJztcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IERFRkFVTFRfREFUQTogTHVvcGFuRGF0YSA9IHtcclxuICAgIGxheWVyczogW1xyXG4gICAgICAgIHsgbmFtZTogXCJcdTRFMjRcdTRFRUFcIiwgaXRlbXM6IFtcIlx1OTYzNFwiLCBcIlx1OTYzM1wiXSB9LFxyXG4gICAgICAgIHsgbmFtZTogXCJcdTU2REJcdThDNjFcIiwgaXRlbXM6IFtcIlx1ODAwMVx1OTYzM1wiLCBcIlx1NUMxMVx1OTYzNFwiLCBcIlx1NUMxMVx1OTYzM1wiLCBcIlx1ODAwMVx1OTYzNFwiXSB9LFxyXG4gICAgICAgIHsgbmFtZTogXCJcdTUxNkJcdTUzNjZcIiwgaXRlbXM6IFtcIlx1MjYzMFwiLCBcIlx1MjYzNFwiLCBcIlx1MjYzNVwiLCBcIlx1MjYzNlwiLCBcIlx1MjYzN1wiLCBcIlx1MjYzM1wiLCBcIlx1MjYzMlwiLCBcIlx1MjYzMVwiXSB9XHJcbiAgICBdLFxyXG4gICAgY2VudGVyVGV4dDogXCJcIixcclxuICAgIGJhc2VSYWRpdXM6IDEwMCxcclxuICAgIHJhZGl1c1N0ZXA6IDQ1LFxyXG4gICAgX2Zvcm1hdDogJ3NpbXBsZSdcclxufTsiLCAiaW1wb3J0IHsgTHVvcGFuRGF0YSwgREVGQVVMVF9EQVRBIH0gZnJvbSAnLi90eXBlcyc7XHJcbmltcG9ydCB7IFBsdWdpbiwgVEZpbGUgfSBmcm9tICdvYnNpZGlhbic7XHJcblxyXG4vLyBcdTdCODBcdTUzNTVcdTY4M0NcdTVGMEZcdTg5RTNcdTY3OTBcclxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlU2ltcGxlRm9ybWF0KHNvdXJjZTogc3RyaW5nKTogTHVvcGFuRGF0YSB8IG51bGwge1xyXG4gICAgY29uc3QgbGluZXMgPSBzb3VyY2Uuc3BsaXQoL1xccj9cXG4vKTtcclxuICAgIGNvbnN0IGxheWVycyA9IFtdO1xyXG4gICAgY29uc3QgcmVnZXggPSAvXlxccyooW1xccHtMfVxccHtOfV0rKVxccyo6XFxzKlxcWyguKilcXF1cXHMqJC91O1xyXG4gICAgZm9yIChjb25zdCBsaW5lIG9mIGxpbmVzKSB7XHJcbiAgICAgICAgY29uc3QgdHJpbW1lZCA9IGxpbmUudHJpbSgpO1xyXG4gICAgICAgIGlmICh0cmltbWVkID09PSAnJykgY29udGludWU7XHJcbiAgICAgICAgY29uc3QgbWF0Y2ggPSB0cmltbWVkLm1hdGNoKHJlZ2V4KTtcclxuICAgICAgICBpZiAoIW1hdGNoKSBjb250aW51ZTtcclxuICAgICAgICBjb25zdCBuYW1lID0gbWF0Y2hbMV07XHJcbiAgICAgICAgY29uc3QgaXRlbXNTdHIgPSBtYXRjaFsyXTtcclxuICAgICAgICBjb25zdCBpdGVtcyA9IGl0ZW1zU3RyLnNwbGl0KCcsJykubWFwKHMgPT4gcy50cmltKCkpLmZpbHRlcihzID0+IHMgIT09ICcnKTtcclxuICAgICAgICBpZiAoaXRlbXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBsYXllcnMucHVzaCh7IG5hbWUsIGl0ZW1zIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChsYXllcnMubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcclxuICAgIHJldHVybiB7IC4uLkRFRkFVTFRfREFUQSwgbGF5ZXJzLCBfZm9ybWF0OiAnc2ltcGxlJyB9O1xyXG59XHJcblxyXG4vLyBKU09OXHU2ODNDXHU1RjBGXHU4OUUzXHU2NzkwXHJcbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUpTT05Gb3JtYXQoc291cmNlOiBzdHJpbmcpOiBMdW9wYW5EYXRhIHwgbnVsbCB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKHNvdXJjZS50cmltKCkpO1xyXG4gICAgICAgIGlmICghZGF0YS5sYXllcnMgfHwgIUFycmF5LmlzQXJyYXkoZGF0YS5sYXllcnMpKSByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4geyAuLi5ERUZBVUxUX0RBVEEsIC4uLmRhdGEsIF9mb3JtYXQ6ICdqc29uJyB9O1xyXG4gICAgfSBjYXRjaCB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIFx1ODFFQVx1NTJBOFx1NTIyNFx1NjVBRFx1NjgzQ1x1NUYwRlx1ODlFM1x1Njc5MFxyXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VMdW9wYW5Db2RlKHNvdXJjZTogc3RyaW5nKTogTHVvcGFuRGF0YSB8IG51bGwge1xyXG4gICAgY29uc3QgdHJpbW1lZCA9IHNvdXJjZS50cmltKCk7XHJcbiAgICBpZiAodHJpbW1lZC5zdGFydHNXaXRoKCd7JykpIHtcclxuICAgICAgICByZXR1cm4gcGFyc2VKU09ORm9ybWF0KHRyaW1tZWQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gcGFyc2VTaW1wbGVGb3JtYXQodHJpbW1lZCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIFx1NUU4Rlx1NTIxN1x1NTMxNlx1RkYwOFx1OEY5M1x1NTFGQVx1N0I4MFx1NTM1NVx1NjIxNkpTT05cdTY4M0NcdTVGMEZcdUZGMDlcclxuZXhwb3J0IGZ1bmN0aW9uIHNlcmlhbGl6ZUx1b3BhbkRhdGEoZGF0YTogTHVvcGFuRGF0YSwgZm9ybWF0OiAnc2ltcGxlJyB8ICdqc29uJyA9IGRhdGEuX2Zvcm1hdCB8fCAnanNvbicpOiBzdHJpbmcge1xyXG4gICAgaWYgKGZvcm1hdCA9PT0gJ3NpbXBsZScpIHtcclxuICAgICAgICBjb25zdCBsaW5lcyA9IGRhdGEubGF5ZXJzLm1hcChsYXllciA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1zU3RyID0gbGF5ZXIuaXRlbXMuam9pbignLCAnKTtcclxuICAgICAgICAgICAgcmV0dXJuIGAke2xheWVyLm5hbWV9OiBbJHtpdGVtc1N0cn1dYDtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gbGluZXMuam9pbignXFxuJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IG91dHB1dCA9IHtcclxuICAgICAgICAgICAgbGF5ZXJzOiBkYXRhLmxheWVycyxcclxuICAgICAgICAgICAgY2VudGVyVGV4dDogZGF0YS5jZW50ZXJUZXh0LFxyXG4gICAgICAgICAgICBiYXNlUmFkaXVzOiBkYXRhLmJhc2VSYWRpdXMsXHJcbiAgICAgICAgICAgIHJhZGl1c1N0ZXA6IGRhdGEucmFkaXVzU3RlcFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG91dHB1dCwgbnVsbCwgMik7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIFx1NjZGNFx1NjVCMFx1N0IxNFx1OEJCMFx1NEUyRFx1NzY4NFx1NEVFM1x1NzgwMVx1NTc1N1x1NTE4NVx1NUJCOVxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlQ29kZUJsb2NrKGZpbGU6IFRGaWxlLCBvbGRTb3VyY2U6IHN0cmluZywgbmV3RGF0YTogTHVvcGFuRGF0YSwgcGx1Z2luOiBQbHVnaW4pIHtcclxuICAgIGNvbnN0IGZvcm1hdCA9IG5ld0RhdGEuX2Zvcm1hdCB8fCAnanNvbic7XHJcbiAgICBjb25zdCBuZXdTb3VyY2UgPSBzZXJpYWxpemVMdW9wYW5EYXRhKG5ld0RhdGEsIGZvcm1hdCk7XHJcbiAgICBjb25zdCBjb250ZW50ID0gYXdhaXQgcGx1Z2luLmFwcC52YXVsdC5yZWFkKGZpbGUpO1xyXG4gICAgY29uc3QgdXBkYXRlZCA9IGNvbnRlbnQucmVwbGFjZShgXFxgXFxgXFxgbHVvcGFuXFxuJHtvbGRTb3VyY2V9XFxuXFxgXFxgXFxgYCwgYFxcYFxcYFxcYGx1b3BhblxcbiR7bmV3U291cmNlfVxcblxcYFxcYFxcYGApO1xyXG4gICAgaWYgKHVwZGF0ZWQgIT09IGNvbnRlbnQpIHtcclxuICAgICAgICBhd2FpdCBwbHVnaW4uYXBwLnZhdWx0Lm1vZGlmeShmaWxlLCB1cGRhdGVkKTtcclxuICAgIH1cclxufVxyXG5cclxuLy8gXHU2OEMwXHU2N0U1XHU2NjJGXHU1NDI2XHU0RTNBXHU3RjU3XHU3NkQ4XHU3QjE0XHU4QkIwXHVGRjA4XHU5MDFBXHU4RkM3ZnJvbnRtYXR0ZXJcdUZGMDlcclxuZXhwb3J0IGZ1bmN0aW9uIGlzTHVvcGFuTm90ZShmaWxlOiBURmlsZSwgcGx1Z2luOiBQbHVnaW4pOiBib29sZWFuIHtcclxuICAgIGNvbnN0IGNhY2hlID0gcGx1Z2luLmFwcC5tZXRhZGF0YUNhY2hlLmdldEZpbGVDYWNoZShmaWxlKTtcclxuICAgIGNvbnN0IGZtID0gY2FjaGU/LmZyb250bWF0dGVyO1xyXG4gICAgaWYgKCFmbSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgcmV0dXJuIGZtWyd0eXBlJ10gPT09ICdsdW9wYW4nIHx8IGZtWydcdTY4M0NcdTVGMEYnXSA9PT0gJ2x1b3Bhbic7XHJcbn1cclxuXHJcbi8vIFx1NEVDRWZyb250bWF0dGVyXHU4OUUzXHU2NzkwXHU3RjU3XHU3NkQ4XHU2NTcwXHU2MzZFXHJcbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0RnJvbUZyb250bWF0dGVyKGZyb250bWF0dGVyOiBhbnkpOiBMdW9wYW5EYXRhIHwgbnVsbCB7XHJcbiAgICBjb25zdCBsYXllck5hbWVzID0gW1wiXHU0RTI0XHU0RUVBXCIsIFwiXHU1NkRCXHU4QzYxXCIsIFwiXHU0RTk0XHU4ODRDXCIsIFwiXHU1MTZCXHU1MzY2XCIsIFwiXHU1OTI5XHU1RTcyXCIsIFwiXHU1NzMwXHU2NTJGXCIsIFwiXHU4MjgyXHU2QzE0XCIsIFwiXHU1MTZEXHU1MzQxXHU1NkRCXHU1MzY2XCJdO1xyXG4gICAgY29uc3QgbGF5ZXJzID0gW107XHJcbiAgICBmb3IgKGNvbnN0IG5hbWUgb2YgbGF5ZXJOYW1lcykge1xyXG4gICAgICAgIGNvbnN0IGl0ZW1zID0gZnJvbnRtYXR0ZXJbbmFtZV07XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaXRlbXMpICYmIGl0ZW1zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgbGF5ZXJzLnB1c2goeyBuYW1lLCBpdGVtczogaXRlbXMubWFwKFN0cmluZykgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKGxheWVycy5sZW5ndGggPT09IDApIHJldHVybiBudWxsO1xyXG4gICAgcmV0dXJuIHsgLi4uREVGQVVMVF9EQVRBLCBsYXllcnMsIF9mb3JtYXQ6ICdzaW1wbGUnIH07XHJcbn0iLCAiLy8gXHU1NkZFXHU1QzQyXHU5RUQ4XHU4QkE0XHU5ODlDXHU4MjcyXHJcbmV4cG9ydCBjb25zdCBMQVlFUl9DT0xPUlM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XHJcbiAgICBcIlx1NEUyNFx1NEVFQVwiOiBcIiNGRkQ5NjZcIiwgXCJcdTU2REJcdThDNjFcIjogXCIjRkZCMzQ3XCIsIFwiXHU0RTk0XHU4ODRDXCI6IFwiI0E1RDZBNVwiLFxyXG4gICAgXCJcdTUxNkJcdTUzNjZcIjogXCIjN0ZCNEZGXCIsIFwiXHU1OTI5XHU1RTcyXCI6IFwiI0NDOTlGRlwiLCBcIlx1NTczMFx1NjUyRlwiOiBcIiM5OUNDRkZcIixcclxuICAgIFwiXHU4MjgyXHU2QzE0XCI6IFwiIzY2Q0NDQ1wiLCBcIjI0XHU4MjgyXHU2QzE0XCI6IFwiIzY2Q0NDQ1wiLCBcIlx1NTE2RFx1NTM0MVx1NTZEQlx1NTM2NlwiOiBcIiNGRkEwN0FcIlxyXG59OyIsICJpbXBvcnQgeyBBcHAsIE1vZGFsIH0gZnJvbSAnb2JzaWRpYW4nO1xyXG5cclxuZXhwb3J0IGNsYXNzIEVkaXRUZXh0TW9kYWwgZXh0ZW5kcyBNb2RhbCB7XHJcbiAgICBwcml2YXRlIGN1cnJlbnQ6IHN0cmluZztcclxuICAgIHByaXZhdGUgcmVzb2x2ZTogKHZhbHVlOiBzdHJpbmcgfCBudWxsKSA9PiB2b2lkO1xyXG4gICAgcHJpdmF0ZSBpbnB1dEVsITogSFRNTElucHV0RWxlbWVudDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgY3VycmVudDogc3RyaW5nLCByZXNvbHZlOiAodmFsdWU6IHN0cmluZyB8IG51bGwpID0+IHZvaWQpIHtcclxuICAgICAgICBzdXBlcihhcHApO1xyXG4gICAgICAgIHRoaXMuY3VycmVudCA9IGN1cnJlbnQ7XHJcbiAgICAgICAgdGhpcy5yZXNvbHZlID0gcmVzb2x2ZTtcclxuICAgIH1cclxuXHJcbiAgICBvbk9wZW4oKSB7XHJcbiAgICAgICAgY29uc3QgeyBjb250ZW50RWwgfSA9IHRoaXM7XHJcbiAgICAgICAgY29udGVudEVsLmNyZWF0ZUVsKCdoMycsIHsgdGV4dDogJ1x1N0YxNlx1OEY5MVx1N0Y1N1x1NzZEOFx1NjU4N1x1NUI1NycgfSk7XHJcbiAgICAgICAgdGhpcy5pbnB1dEVsID0gY29udGVudEVsLmNyZWF0ZUVsKCdpbnB1dCcsIHsgdmFsdWU6IHRoaXMuY3VycmVudCB9KTtcclxuICAgICAgICB0aGlzLmlucHV0RWwuc3R5bGUud2lkdGggPSAnMTAwJSc7XHJcbiAgICAgICAgY29uc3QgYnV0dG9uRGl2ID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogJ21vZGFsLWJ1dHRvbi1jb250YWluZXInIH0pO1xyXG4gICAgICAgIGNvbnN0IHNhdmVCdG4gPSBidXR0b25EaXYuY3JlYXRlRWwoJ2J1dHRvbicsIHsgdGV4dDogJ1x1NEZERFx1NUI1OCcgfSk7XHJcbiAgICAgICAgc2F2ZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5yZXNvbHZlKHRoaXMuaW5wdXRFbC52YWx1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb25zdCBjYW5jZWxCdG4gPSBidXR0b25EaXYuY3JlYXRlRWwoJ2J1dHRvbicsIHsgdGV4dDogJ1x1NTNENlx1NkQ4OCcgfSk7XHJcbiAgICAgICAgY2FuY2VsQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnJlc29sdmUobnVsbCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBvbkNsb3NlKCkge1xyXG4gICAgICAgIHRoaXMuY29udGVudEVsLmVtcHR5KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBJbnB1dE1vZGFsIGV4dGVuZHMgTW9kYWwge1xyXG4gICAgcHJpdmF0ZSBwcm9tcHQ6IHN0cmluZztcclxuICAgIHByaXZhdGUgZGVmYXVsdFZhbHVlOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIHJlc29sdmU6ICh2YWx1ZTogc3RyaW5nIHwgbnVsbCkgPT4gdm9pZDtcclxuICAgIHByaXZhdGUgaW5wdXRFbCE6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHByb21wdDogc3RyaW5nLCBkZWZhdWx0VmFsdWU6IHN0cmluZywgcmVzb2x2ZTogKHZhbHVlOiBzdHJpbmcgfCBudWxsKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgc3VwZXIoYXBwKTtcclxuICAgICAgICB0aGlzLnByb21wdCA9IHByb21wdDtcclxuICAgICAgICB0aGlzLmRlZmF1bHRWYWx1ZSA9IGRlZmF1bHRWYWx1ZTtcclxuICAgICAgICB0aGlzLnJlc29sdmUgPSByZXNvbHZlO1xyXG4gICAgfVxyXG5cclxuICAgIG9uT3BlbigpIHtcclxuICAgICAgICBjb25zdCB7IGNvbnRlbnRFbCB9ID0gdGhpcztcclxuICAgICAgICBjb250ZW50RWwuY3JlYXRlRWwoJ2gzJywgeyB0ZXh0OiB0aGlzLnByb21wdCB9KTtcclxuICAgICAgICB0aGlzLmlucHV0RWwgPSBjb250ZW50RWwuY3JlYXRlRWwoJ2lucHV0JywgeyB0eXBlOiAndGV4dCcsIHZhbHVlOiB0aGlzLmRlZmF1bHRWYWx1ZSB9KTtcclxuICAgICAgICB0aGlzLmlucHV0RWwuc3R5bGUud2lkdGggPSAnMTAwJSc7XHJcbiAgICAgICAgY29uc3QgYnV0dG9uRGl2ID0gY29udGVudEVsLmNyZWF0ZURpdih7IHN0eWxlOiAnbWFyZ2luLXRvcDogMWVtOyBkaXNwbGF5OiBmbGV4OyBnYXA6IDFlbTsnIH0pO1xyXG4gICAgICAgIGNvbnN0IG9rQnRuID0gYnV0dG9uRGl2LmNyZWF0ZUVsKCdidXR0b24nLCB7IHRleHQ6ICdcdTc4NkVcdTVCOUEnIH0pO1xyXG4gICAgICAgIG9rQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnJlc29sdmUodGhpcy5pbnB1dEVsLnZhbHVlKTtcclxuICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnN0IGNhbmNlbEJ0biA9IGJ1dHRvbkRpdi5jcmVhdGVFbCgnYnV0dG9uJywgeyB0ZXh0OiAnXHU1M0Q2XHU2RDg4JyB9KTtcclxuICAgICAgICBjYW5jZWxCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZShudWxsKTtcclxuICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIG9uQ2xvc2UoKSB7IHRoaXMuY29udGVudEVsLmVtcHR5KCk7IH1cclxufSIsICIvLyBzcmMvcmVuZGVyZXIudHNcclxuaW1wb3J0IHsgTHVvcGFuRGF0YSwgTHVvcGFuTGF5ZXIgfSBmcm9tICcuL3R5cGVzJztcclxuaW1wb3J0IHsgTEFZRVJfQ09MT1JTIH0gZnJvbSAnLi9jb25zdGFudHMnO1xyXG5pbXBvcnQgeyB1cGRhdGVDb2RlQmxvY2ssIHNlcmlhbGl6ZUx1b3BhbkRhdGEgfSBmcm9tICcuL3BhcnNlcic7XHJcbmltcG9ydCB7IEVkaXRUZXh0TW9kYWwgfSBmcm9tICcuL21vZGFscyc7XHJcbmltcG9ydCB7IFBsdWdpbiwgVEZpbGUsIE5vdGljZSB9IGZyb20gJ29ic2lkaWFuJztcclxuaW1wb3J0IHsgQmFzZVJvdGF0YWJsZUNhbnZhcyB9IGZyb20gJy4vYmFzZS1yZW5kZXJlcic7XHJcblxyXG5leHBvcnQgY2xhc3MgTHVvcGFuUmVuZGVyZXIgZXh0ZW5kcyBCYXNlUm90YXRhYmxlQ2FudmFzIHtcclxuICAgIHByaXZhdGUgZGF0YTogTHVvcGFuRGF0YTtcclxuICAgIHByaXZhdGUgbGF5ZXJzITogKEx1b3BhbkxheWVyICYgeyByYWRpdXM6IG51bWJlcjsgZm9udFNpemU6IG51bWJlcjsgY29sb3I6IHN0cmluZyB9KVtdO1xyXG4gICAgcHJpdmF0ZSB0ZXh0Wm9uZXM6IHtcclxuICAgICAgICB4OiBudW1iZXI7IHk6IG51bWJlcjsgbGF5ZXJJZHg6IG51bWJlcjsgaXRlbUlkeDogbnVtYmVyOyB0ZXh0OiBzdHJpbmc7IGxpbms/OiBzdHJpbmc7XHJcbiAgICB9W10gPSBbXTtcclxuICAgIHByaXZhdGUgZmlsZTogVEZpbGU7XHJcbiAgICBwcml2YXRlIG9sZFNvdXJjZTogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBwbHVnaW46IFBsdWdpbjtcclxuICAgIHByaXZhdGUgb25EYXRhQ2hhbmdlOiAobmV3RGF0YTogTHVvcGFuRGF0YSkgPT4gdm9pZDtcclxuXHJcbiAgICBwdWJsaWMgc2hvd1RvcE1hcmtlcjogYm9vbGVhbjtcclxuICAgIHB1YmxpYyBzaG93U2VjdG9yRGl2aWRlcnM6IGJvb2xlYW47XHJcblxyXG4gICAgcHJpdmF0ZSBob3ZlcmVkU2VjdG9yOiB7IGxheWVySWR4OiBudW1iZXI7IGl0ZW1JZHg6IG51bWJlciB9IHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgY29udGFpbmVyOiBIVE1MRWxlbWVudCxcclxuICAgICAgICBkYXRhOiBMdW9wYW5EYXRhLFxyXG4gICAgICAgIGZpbGU6IFRGaWxlLFxyXG4gICAgICAgIG9sZFNvdXJjZTogc3RyaW5nLFxyXG4gICAgICAgIG9uRGF0YUNoYW5nZTogKG5ld0RhdGE6IEx1b3BhbkRhdGEpID0+IHZvaWQsXHJcbiAgICAgICAgcGx1Z2luOiBQbHVnaW4sXHJcbiAgICAgICAgc2hvd1RvcE1hcmtlcjogYm9vbGVhbixcclxuICAgICAgICBzaG93U2VjdG9yRGl2aWRlcnM6IGJvb2xlYW5cclxuICAgICkge1xyXG4gICAgICAgIHN1cGVyKGNvbnRhaW5lcik7XHJcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcclxuICAgICAgICB0aGlzLmZpbGUgPSBmaWxlO1xyXG4gICAgICAgIHRoaXMub2xkU291cmNlID0gb2xkU291cmNlO1xyXG4gICAgICAgIHRoaXMub25EYXRhQ2hhbmdlID0gb25EYXRhQ2hhbmdlO1xyXG4gICAgICAgIHRoaXMucGx1Z2luID0gcGx1Z2luO1xyXG4gICAgICAgIHRoaXMuc2hvd1RvcE1hcmtlciA9IHNob3dUb3BNYXJrZXI7XHJcbiAgICAgICAgdGhpcy5zaG93U2VjdG9yRGl2aWRlcnMgPSBzaG93U2VjdG9yRGl2aWRlcnM7XHJcbiAgICAgICAgdGhpcy5jb21wdXRlTGF5b3V0KCk7XHJcbiAgICAgICAgdGhpcy5pbml0Q2FudmFzKCdsdW9wYW4tY29udGFpbmVyJyk7XHJcbiAgICAgICAgdGhpcy5iaW5kRXZlbnRzKCk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5vbk1vdXNlTW92ZUhvdmVyLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vbkNsaWNrLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMuZHJhdygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY29tcHV0ZUxheW91dCgpIHtcclxuICAgICAgICBjb25zdCBiYXNlID0gdGhpcy5kYXRhLmJhc2VSYWRpdXMgfHwgMTAwO1xyXG4gICAgICAgIGNvbnN0IHN0ZXAgPSB0aGlzLmRhdGEucmFkaXVzU3RlcCB8fCA0NTtcclxuICAgICAgICB0aGlzLmxheWVycyA9IHRoaXMuZGF0YS5sYXllcnMubWFwKChsYXllciwgaWR4KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJhZGl1cyA9IGJhc2UgKyBpZHggKiBzdGVwO1xyXG4gICAgICAgICAgICBjb25zdCBmb250U2l6ZSA9IGxheWVyLmZvbnRTaXplIHx8XHJcbiAgICAgICAgICAgICAgICAobGF5ZXIuaXRlbXMubGVuZ3RoID4gMTYgPyAxNiA6IGxheWVyLml0ZW1zLmxlbmd0aCA+IDggPyAyMCA6IDI0KTtcclxuICAgICAgICAgICAgY29uc3QgY29sb3IgPSBsYXllci5jb2xvciB8fCBMQVlFUl9DT0xPUlNbbGF5ZXIubmFtZV0gfHwgJyNDQ0NDQ0MnO1xyXG4gICAgICAgICAgICByZXR1cm4geyAuLi5sYXllciwgcmFkaXVzLCBmb250U2l6ZSwgY29sb3IgfTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldExheWVySW5kZXgocmFkaXVzOiBudW1iZXIpOiBudW1iZXIgfCBudWxsIHtcclxuICAgICAgICBmb3IgKGxldCBsaSA9IDA7IGxpIDwgdGhpcy5sYXllcnMubGVuZ3RoOyBsaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGlubmVyID0gbGkgPT09IDAgPyA3MCA6IHRoaXMubGF5ZXJzW2xpIC0gMV0ucmFkaXVzO1xyXG4gICAgICAgICAgICBjb25zdCBvdXRlciA9IHRoaXMubGF5ZXJzW2xpXS5yYWRpdXM7XHJcbiAgICAgICAgICAgIGlmIChyYWRpdXMgPj0gaW5uZXIgJiYgcmFkaXVzIDw9IG91dGVyKSByZXR1cm4gbGk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBoYW5kbGVTaGlmdERyYWdTdGFydChhbmdsZTogbnVtYmVyLCByYWRpdXM6IG51bWJlciwgZTogTW91c2VFdmVudCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGNvbnN0IGxpID0gdGhpcy5nZXRMYXllckluZGV4KHJhZGl1cyk7XHJcbiAgICAgICAgaWYgKGxpICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm90YXRpbmdEZXB0aE9ySWR4ID0gbGk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGhhbmRsZVNoaWZ0RHJhZ01vdmUoYW5nbGU6IG51bWJlciwgZTogTW91c2VFdmVudCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGxpID0gdGhpcy5yb3RhdGluZ0RlcHRoT3JJZHg7XHJcbiAgICAgICAgY29uc3QgY3VycmVudE9mZnNldCA9IHRoaXMubGF5ZXJSb3RhdGlvbnMuZ2V0KGxpKSB8fCAwO1xyXG4gICAgICAgIGNvbnN0IGRlbHRhID0gYW5nbGUgLSB0aGlzLmxhc3RNb3VzZUFuZ2xlO1xyXG4gICAgICAgIHRoaXMubGF5ZXJSb3RhdGlvbnMuc2V0KGxpLCBjdXJyZW50T2Zmc2V0ICsgZGVsdGEpO1xyXG4gICAgICAgIHRoaXMuZHJhdygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBhc3luYyBoYW5kbGVTaGlmdERyYWdFbmQoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgY29uc3QgbGkgPSB0aGlzLnJvdGF0aW5nRGVwdGhPcklkeDtcclxuICAgICAgICBjb25zdCBsYXllciA9IHRoaXMubGF5ZXJzW2xpXTtcclxuICAgICAgICBjb25zdCBpdGVtcyA9IGxheWVyLml0ZW1zO1xyXG4gICAgICAgIGlmIChpdGVtcy5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGFuZ2xlUGVySXRlbSA9ICgyICogTWF0aC5QSSkgLyBpdGVtcy5sZW5ndGg7XHJcbiAgICAgICAgICAgIGNvbnN0IG9mZnNldCA9IHRoaXMubGF5ZXJSb3RhdGlvbnMuZ2V0KGxpKSB8fCAwO1xyXG4gICAgICAgICAgICBjb25zdCBzdGVwcyA9IE1hdGgucm91bmQob2Zmc2V0IC8gYW5nbGVQZXJJdGVtKTtcclxuICAgICAgICAgICAgaWYgKHN0ZXBzICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBub3JtYWxpemVkU3RlcHMgPSAoKHN0ZXBzICUgaXRlbXMubGVuZ3RoKSArIGl0ZW1zLmxlbmd0aCkgJSBpdGVtcy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBtb3ZlZCA9IGl0ZW1zLnNwbGljZSgwLCBub3JtYWxpemVkU3RlcHMpO1xyXG4gICAgICAgICAgICAgICAgaXRlbXMucHVzaCguLi5tb3ZlZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxheWVyUm90YXRpb25zLnNldChsaSwgb2Zmc2V0IC0gc3RlcHMgKiBhbmdsZVBlckl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgdXBkYXRlQ29kZUJsb2NrKHRoaXMuZmlsZSwgdGhpcy5vbGRTb3VyY2UsIHRoaXMuZGF0YSwgdGhpcy5wbHVnaW4pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbGRTb3VyY2UgPSBzZXJpYWxpemVMdW9wYW5EYXRhKHRoaXMuZGF0YSwgdGhpcy5kYXRhLl9mb3JtYXQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5yb3RhdGluZ0RlcHRoT3JJZHggPSAtMTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZHJhdygpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY3R4KSByZXR1cm47XHJcbiAgICAgICAgLy8gLS0tLSBcdThCRkJcdTUzRDZcdTUxNjhcdTVDNDBcdTg5QzZcdTg5QzlcdThCQkVcdTdGNkUgLS0tLVxyXG4gICAgICAgIGNvbnN0IHNldHRpbmdzID0gdGhpcy5wbHVnaW4uc2V0dGluZ3M7XHJcbiAgICAgICAgY29uc3Qgb3BhY2l0eSA9IHNldHRpbmdzLnNlY3Rvck9wYWNpdHk7XHJcbiAgICAgICAgY29uc3QgZ2xvYmFsVGV4dENvbG9yID0gc2V0dGluZ3MudGV4dENvbG9yIHx8IHVuZGVmaW5lZDtcclxuICAgICAgICBjb25zdCBjdXN0b21GaWxsID0gc2V0dGluZ3MuY3VzdG9tU2VjdG9yQ29sb3IgfHwgdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG4gICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9ICcjMWUxZTJmJztcclxuICAgICAgICB0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcblxyXG4gICAgICAgIC8vIC0tLS0gXHU3QjJDXHU0RTAwXHU5NjM2XHU2QkI1XHVGRjFBXHU1NzI4XHU2NUNCXHU4RjZDXHU1NzUwXHU2ODA3XHU3Q0ZCXHU1MTg1XHU3RUQ4XHU1MjM2XHU2MjQ3XHU1MzNBIC0tLS1cclxuICAgICAgICB0aGlzLmN0eC5zYXZlKCk7XHJcbiAgICAgICAgdGhpcy5jdHgudHJhbnNsYXRlKHRoaXMuY2VudGVyWCwgdGhpcy5jZW50ZXJZKTtcclxuICAgICAgICB0aGlzLmN0eC5yb3RhdGUodGhpcy5yb3RhdGlvbik7XHJcbiAgICAgICAgdGhpcy5jdHgudHJhbnNsYXRlKC10aGlzLmNlbnRlclgsIC10aGlzLmNlbnRlclkpO1xyXG5cclxuICAgICAgICAvLyBcdTYyNDdcdTUzM0FcdTUyMDZcdTUyNzJcdTdFQkZcclxuICAgICAgICBpZiAodGhpcy5zaG93U2VjdG9yRGl2aWRlcnMpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgbGkgPSAwOyBsaSA8IHRoaXMubGF5ZXJzLmxlbmd0aDsgbGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbGF5ZXIgPSB0aGlzLmxheWVyc1tsaV07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb3VudCA9IGxheWVyLml0ZW1zLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIGlmIChjb3VudCA9PT0gMCkgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhbmdsZVN0ZXAgPSAzNjAgLyBjb3VudDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxheWVyT2Zmc2V0ID0gdGhpcy5sYXllclJvdGF0aW9ucy5nZXQobGkpIHx8IDA7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbmcgPSBpICogYW5nbGVTdGVwICsgKGxheWVyT2Zmc2V0ICogMTgwKSAvIE1hdGguUEk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmFkID0gKGFuZyAqIE1hdGguUEkpIC8gMTgwO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0YXJ0UmFkaXVzID0gbGF5ZXIucmFkaXVzIC0gMTA7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZW5kUmFkaXVzID0gbGF5ZXIucmFkaXVzICsgNTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB4MSA9IHRoaXMuY2VudGVyWCArIHN0YXJ0UmFkaXVzICogTWF0aC5jb3MocmFkKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB5MSA9IHRoaXMuY2VudGVyWSArIHN0YXJ0UmFkaXVzICogTWF0aC5zaW4ocmFkKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB4MiA9IHRoaXMuY2VudGVyWCArIGVuZFJhZGl1cyAqIE1hdGguY29zKHJhZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeTIgPSB0aGlzLmNlbnRlclkgKyBlbmRSYWRpdXMgKiBNYXRoLnNpbihyYWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3R4Lm1vdmVUbyh4MSwgeTEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3R4LmxpbmVUbyh4MiwgeTIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMC41KSc7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdHgubGluZVdpZHRoID0gMS41O1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3R4LnN0cm9rZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBcdTdFRDhcdTUyMzZcdTYyNDdcdTUzM0FcclxuICAgICAgICBmb3IgKGxldCBsaSA9IDA7IGxpIDwgdGhpcy5sYXllcnMubGVuZ3RoOyBsaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxheWVyID0gdGhpcy5sYXllcnNbbGldO1xyXG4gICAgICAgICAgICBjb25zdCBpdGVtcyA9IGxheWVyLml0ZW1zO1xyXG4gICAgICAgICAgICBjb25zdCBjb3VudCA9IGl0ZW1zLmxlbmd0aDtcclxuICAgICAgICAgICAgaWYgKGNvdW50ID09PSAwKSBjb250aW51ZTtcclxuICAgICAgICAgICAgY29uc3QgYW5nbGVTdGVwID0gMzYwIC8gY291bnQ7XHJcbiAgICAgICAgICAgIGNvbnN0IGxheWVyT2Zmc2V0ID0gdGhpcy5sYXllclJvdGF0aW9ucy5nZXQobGkpIHx8IDA7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXJ0QW5nbGUgPSBpICogYW5nbGVTdGVwICsgKGxheWVyT2Zmc2V0ICogMTgwKSAvIE1hdGguUEk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlbmRBbmdsZSA9IHN0YXJ0QW5nbGUgKyBhbmdsZVN0ZXA7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbm5lclJhZGl1cyA9IGxpID09PSAwID8gNzAgOiB0aGlzLmxheWVyc1tsaSAtIDFdLnJhZGl1cztcclxuICAgICAgICAgICAgICAgIGNvbnN0IG91dGVyUmFkaXVzID0gbGF5ZXIucmFkaXVzO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdHgubW92ZVRvKHRoaXMuY2VudGVyWCArIGlubmVyUmFkaXVzICogTWF0aC5jb3Moc3RhcnRBbmdsZSAqIE1hdGguUEkgLyAxODApLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2VudGVyWSArIGlubmVyUmFkaXVzICogTWF0aC5zaW4oc3RhcnRBbmdsZSAqIE1hdGguUEkgLyAxODApKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3R4LmFyYyh0aGlzLmNlbnRlclgsIHRoaXMuY2VudGVyWSwgb3V0ZXJSYWRpdXMsIHN0YXJ0QW5nbGUgKiBNYXRoLlBJIC8gMTgwLCBlbmRBbmdsZSAqIE1hdGguUEkgLyAxODApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdHguYXJjKHRoaXMuY2VudGVyWCwgdGhpcy5jZW50ZXJZLCBpbm5lclJhZGl1cywgZW5kQW5nbGUgKiBNYXRoLlBJIC8gMTgwLCBzdGFydEFuZ2xlICogTWF0aC5QSSAvIDE4MCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN0eC5jbG9zZVBhdGgoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBpc0hvdmVyZWQgPSB0aGlzLmhvdmVyZWRTZWN0b3I/LmxheWVySWR4ID09PSBsaSAmJiB0aGlzLmhvdmVyZWRTZWN0b3I/Lml0ZW1JZHggPT09IGk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNIb3ZlcmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gXHU2MEFDXHU1MDVDXHU5QUQ4XHU0RUFFXHU0RjlEXHU3MTM2XHU0RjdGXHU3NTI4XHU0RUFFXHU1MzE2XHU5ODlDXHU4MjcyXHVGRjBDXHU0RTBEXHU1M0Q3XHU4MUVBXHU1QjlBXHU0RTQ5XHU5ODlDXHU4MjcyXHU1RjcxXHU1NENEXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gdGhpcy5saWdodGVuQ29sb3IobGF5ZXIuY29sb3IsIDMwKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9ICcjZmZmZmZmJztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmN0eC5saW5lV2lkdGggPSAyLjU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFx1NUU5NFx1NzUyOFx1ODFFQVx1NUI5QVx1NEU0OVx1OTg5Q1x1ODI3Mlx1NjIxNlx1NTZGRVx1NUM0Mlx1OTg5Q1x1ODI3MlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IGN1c3RvbUZpbGwgfHwgbGF5ZXIuY29sb3I7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSAnI2ZmZmZmZjMzJztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmN0eC5saW5lV2lkdGggPSAxLjU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN0eC5nbG9iYWxBbHBoYSA9IG9wYWNpdHk7ICAvLyBcdTRGN0ZcdTc1MjhcdThCQkVcdTdGNkVcdTc2ODRcdTRFMERcdTkwMEZcdTY2MEVcdTVFQTZcclxuICAgICAgICAgICAgICAgIHRoaXMuY3R4LmZpbGwoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3R4Lmdsb2JhbEFscGhhID0gMS4wO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZHJhd1RhaWppKHRoaXMuY2VudGVyWCwgdGhpcy5jZW50ZXJZLCA3MCk7XHJcbiAgICAgICAgdGhpcy5jdHgucmVzdG9yZSgpO1xyXG5cclxuICAgICAgICAvLyAtLS0tIFx1N0IyQ1x1NEU4Q1x1OTYzNlx1NkJCNVx1RkYxQVx1NTcyOFx1NUM0Rlx1NUU1NVx1NTc1MFx1NjgwN1x1N0VEOFx1NTIzNlx1NjU4N1x1NUI1N1x1RkYwOFx1NjI0N1x1NTMzQVx1NEUyRFx1NUZDM1x1RkYwOSAtLS0tXHJcbiAgICAgICAgdGhpcy50ZXh0Wm9uZXMgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBsaSA9IDA7IGxpIDwgdGhpcy5sYXllcnMubGVuZ3RoOyBsaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxheWVyID0gdGhpcy5sYXllcnNbbGldO1xyXG4gICAgICAgICAgICBjb25zdCBpdGVtcyA9IGxheWVyLml0ZW1zO1xyXG4gICAgICAgICAgICBjb25zdCBjb3VudCA9IGl0ZW1zLmxlbmd0aDtcclxuICAgICAgICAgICAgaWYgKGNvdW50ID09PSAwKSBjb250aW51ZTtcclxuICAgICAgICAgICAgY29uc3QgYW5nbGVTdGVwID0gMzYwIC8gY291bnQ7XHJcbiAgICAgICAgICAgIGNvbnN0IGxheWVyT2Zmc2V0ID0gdGhpcy5sYXllclJvdGF0aW9ucy5nZXQobGkpIHx8IDA7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCB0ZXh0ID0gaXRlbXNbaV07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsaW5rTWF0Y2ggPSB0ZXh0Lm1hdGNoKC9cXFtcXFsoW15cXF1dKylcXF1cXF0vKTtcclxuICAgICAgICAgICAgICAgIGxldCBkaXNwbGF5VGV4dCA9IHRleHQ7XHJcbiAgICAgICAgICAgICAgICBsZXQgbGlua1RhcmdldCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICBpZiAobGlua01hdGNoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheVRleHQgPSBsaW5rTWF0Y2hbMV07XHJcbiAgICAgICAgICAgICAgICAgICAgbGlua1RhcmdldCA9IGxpbmtNYXRjaFsxXTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBzdGFydEFuZyA9IGkgKiBhbmdsZVN0ZXAgKyAobGF5ZXJPZmZzZXQgKiAxODApIC8gTWF0aC5QSTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG1pZEFuZ2xlID0gc3RhcnRBbmcgKyBhbmdsZVN0ZXAgLyAyOyAgICAgICAgICAvLyBcdTYyNDdcdTUzM0FcdTRFMkRcdTVGQzNcdTg5RDJcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJhZCA9IG1pZEFuZ2xlICogTWF0aC5QSSAvIDE4MDtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbm5lclJhZGl1cyA9IGxpID09PSAwID8gNzAgOiB0aGlzLmxheWVyc1tsaSAtIDFdLnJhZGl1cztcclxuICAgICAgICAgICAgICAgIGNvbnN0IG91dGVyUmFkaXVzID0gbGF5ZXIucmFkaXVzO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbWlkUmFkaXVzID0gKGlubmVyUmFkaXVzICsgb3V0ZXJSYWRpdXMpIC8gMjsgIC8vIFx1NUY4NFx1NTQxMVx1NEUyRFx1OTVGNFx1NEY0RFx1N0Y2RVxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHdvcmxkWCA9IHRoaXMuY2VudGVyWCArIG1pZFJhZGl1cyAqIE1hdGguY29zKHJhZCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB3b3JsZFkgPSB0aGlzLmNlbnRlclkgKyBtaWRSYWRpdXMgKiBNYXRoLnNpbihyYWQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvc1IgPSBNYXRoLmNvcyh0aGlzLnJvdGF0aW9uKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNpblIgPSBNYXRoLnNpbih0aGlzLnJvdGF0aW9uKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGR4ID0gd29ybGRYIC0gdGhpcy5jZW50ZXJYO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZHkgPSB3b3JsZFkgLSB0aGlzLmNlbnRlclk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzY3JlZW5YID0gdGhpcy5jZW50ZXJYICsgZHggKiBjb3NSIC0gZHkgKiBzaW5SO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2NyZWVuWSA9IHRoaXMuY2VudGVyWSArIGR4ICogc2luUiArIGR5ICogY29zUjtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBzY3JlZW5BbmdsZSA9IG1pZEFuZ2xlICsgKHRoaXMucm90YXRpb24gKiAxODApIC8gTWF0aC5QSSArIDkwO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3R4LnRyYW5zbGF0ZShzY3JlZW5YLCBzY3JlZW5ZKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3R4LnJvdGF0ZSgoc2NyZWVuQW5nbGUgKiBNYXRoLlBJKSAvIDE4MCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN0eC5mb250ID0gYGJvbGQgJHtsYXllci5mb250U2l6ZX1weCBcIlNlZ29lIFVJXCIsIFwiTWljcm9zb2Z0IFlhSGVpXCIsIHNhbnMtc2VyaWZgO1xyXG4gICAgICAgICAgICAgICAgLy8gXHU2NTg3XHU1QjU3XHU5ODlDXHU4MjcyXHVGRjFBXHU0RjE4XHU1MTQ4XHU0RjdGXHU3NTI4XHU1MTY4XHU1QzQwXHU4QkJFXHU3RjZFXHVGRjBDXHU1NDI2XHU1MjE5XHU1NkRFXHU5MDAwXHU1MjMwXHU1NkZFXHU1QzQyXHU5ODlDXHU4MjcyXHJcbiAgICAgICAgICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBnbG9iYWxUZXh0Q29sb3IgfHwgbGF5ZXIuY29sb3I7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN0eC5zaGFkb3dDb2xvciA9ICdyZ2JhKDAsIDAsIDAsIDAuNiknO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdHguc2hhZG93Qmx1ciA9IDI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN0eC50ZXh0QWxpZ24gPSAnY2VudGVyJztcclxuICAgICAgICAgICAgICAgIHRoaXMuY3R4LnRleHRCYXNlbGluZSA9ICdtaWRkbGUnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdHguZmlsbFRleHQoZGlzcGxheVRleHQsIDAsIDApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdHguc2hhZG93Q29sb3IgPSAndHJhbnNwYXJlbnQnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdHgucmVzdG9yZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMudGV4dFpvbmVzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIHg6IHNjcmVlblgsIHk6IHNjcmVlblksIGxheWVySWR4OiBsaSwgaXRlbUlkeDogaSxcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiB0ZXh0LCBsaW5rOiBsaW5rVGFyZ2V0IHx8IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFx1NEUyRFx1NUZDM1x1NjU4N1x1NUI1N1xyXG4gICAgICAgIGlmICh0aGlzLmRhdGEuY2VudGVyVGV4dCkge1xyXG4gICAgICAgICAgICB0aGlzLmN0eC5mb250ID0gJ2JvbGQgMjhweCBcIlNlZ29lIFVJXCIsIFwiTWljcm9zb2Z0IFlhSGVpXCIsIHNhbnMtc2VyaWYnO1xyXG4gICAgICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSAnI0ZGRkZGRic7XHJcbiAgICAgICAgICAgIHRoaXMuY3R4LnNoYWRvd0NvbG9yID0gJ3JnYmEoMCwwLDAsMC41KSc7XHJcbiAgICAgICAgICAgIHRoaXMuY3R4LnNoYWRvd0JsdXIgPSAzO1xyXG4gICAgICAgICAgICB0aGlzLmN0eC50ZXh0QWxpZ24gPSAnY2VudGVyJztcclxuICAgICAgICAgICAgdGhpcy5jdHgudGV4dEJhc2VsaW5lID0gJ21pZGRsZSc7XHJcbiAgICAgICAgICAgIHRoaXMuY3R4LmZpbGxUZXh0KHRoaXMuZGF0YS5jZW50ZXJUZXh0LCB0aGlzLmNlbnRlclgsIHRoaXMuY2VudGVyWSk7XHJcbiAgICAgICAgICAgIHRoaXMuY3R4LnNoYWRvd0NvbG9yID0gJ3RyYW5zcGFyZW50JztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFx1OTg3Nlx1OTBFOFx1NTNDMlx1ODAwM1x1NTIzQlx1N0VCRlxyXG4gICAgICAgIGlmICh0aGlzLnNob3dUb3BNYXJrZXIpIHtcclxuICAgICAgICAgICAgY29uc3QgdG9wWSA9IHRoaXMuY2VudGVyWSAtICh0aGlzLmRhdGEuYmFzZVJhZGl1cyEgKyB0aGlzLmRhdGEucmFkaXVzU3RlcCEgKiB0aGlzLmxheWVycy5sZW5ndGggKyAzMCk7XHJcbiAgICAgICAgICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICB0aGlzLmN0eC5tb3ZlVG8odGhpcy5jZW50ZXJYLCB0aGlzLmNlbnRlclkpO1xyXG4gICAgICAgICAgICB0aGlzLmN0eC5saW5lVG8odGhpcy5jZW50ZXJYLCB0b3BZKTtcclxuICAgICAgICAgICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSAnI0ZGODg4OCc7XHJcbiAgICAgICAgICAgIHRoaXMuY3R4LmxpbmVXaWR0aCA9IDEuNTtcclxuICAgICAgICAgICAgdGhpcy5jdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZHJhd1RhaWppKGN4OiBudW1iZXIsIGN5OiBudW1iZXIsIHI6IG51bWJlcikge1xyXG4gICAgICAgIC8vIFx1NTkyQVx1Njc4MVx1NTZGRVx1N0VEOFx1NTIzNlx1NEZERFx1NjMwMVx1NEUwRFx1NTNEOFxyXG4gICAgICAgIHRoaXMuY3R4LnNhdmUoKTtcclxuICAgICAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICB0aGlzLmN0eC5hcmMoY3gsIGN5LCByLCAwLCAyICogTWF0aC5QSSk7XHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gJyMwMDAnO1xyXG4gICAgICAgIHRoaXMuY3R4LmZpbGwoKTtcclxuICAgICAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9ICcjZmZmJztcclxuICAgICAgICB0aGlzLmN0eC5saW5lV2lkdGggPSAyO1xyXG4gICAgICAgIHRoaXMuY3R4LnN0cm9rZSgpO1xyXG5cclxuICAgICAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICB0aGlzLmN0eC5hcmMoY3gsIGN5LCByLCAtTWF0aC5QSSAvIDIsIE1hdGguUEkgLyAyKTtcclxuICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSAnI2ZmZic7XHJcbiAgICAgICAgdGhpcy5jdHguZmlsbCgpO1xyXG5cclxuICAgICAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICB0aGlzLmN0eC5hcmMoY3gsIGN5IC0gciAvIDIsIHIgLyAyLCAwLCAyICogTWF0aC5QSSk7XHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gJyNmZmYnO1xyXG4gICAgICAgIHRoaXMuY3R4LmZpbGwoKTtcclxuXHJcbiAgICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgdGhpcy5jdHguYXJjKGN4LCBjeSArIHIgLyAyLCByIC8gMiwgMCwgMiAqIE1hdGguUEkpO1xyXG4gICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9ICcjMDAwJztcclxuICAgICAgICB0aGlzLmN0eC5maWxsKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGV5ZVIgPSByIC8gMTI7XHJcbiAgICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgdGhpcy5jdHguYXJjKGN4LCBjeSAtIHIgLyAyLCBleWVSLCAwLCAyICogTWF0aC5QSSk7XHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gJyMwMDAnO1xyXG4gICAgICAgIHRoaXMuY3R4LmZpbGwoKTtcclxuICAgICAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICB0aGlzLmN0eC5hcmMoY3gsIGN5IC0gciAvIDIsIGV5ZVIgLyAyLCAwLCAyICogTWF0aC5QSSk7XHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gJyNmZmYnO1xyXG4gICAgICAgIHRoaXMuY3R4LmZpbGwoKTtcclxuXHJcbiAgICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgdGhpcy5jdHguYXJjKGN4LCBjeSArIHIgLyAyLCBleWVSLCAwLCAyICogTWF0aC5QSSk7XHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gJyNmZmYnO1xyXG4gICAgICAgIHRoaXMuY3R4LmZpbGwoKTtcclxuICAgICAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICB0aGlzLmN0eC5hcmMoY3gsIGN5ICsgciAvIDIsIGV5ZVIgLyAyLCAwLCAyICogTWF0aC5QSSk7XHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gJyMwMDAnO1xyXG4gICAgICAgIHRoaXMuY3R4LmZpbGwoKTtcclxuXHJcbiAgICAgICAgdGhpcy5jdHgucmVzdG9yZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbGlnaHRlbkNvbG9yKGNvbG9yOiBzdHJpbmcsIHBlcmNlbnQ6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKGNvbG9yLnN0YXJ0c1dpdGgoJyMnKSkge1xyXG4gICAgICAgICAgICBsZXQgaGV4ID0gY29sb3Iuc2xpY2UoMSk7XHJcbiAgICAgICAgICAgIGlmIChoZXgubGVuZ3RoID09PSAzKSBoZXggPSBoZXguc3BsaXQoJycpLm1hcChjID0+IGMgKyBjKS5qb2luKCcnKTtcclxuICAgICAgICAgICAgY29uc3QgbnVtID0gcGFyc2VJbnQoaGV4LCAxNik7XHJcbiAgICAgICAgICAgIGxldCByID0gKG51bSA+PiAxNikgKyBwZXJjZW50O1xyXG4gICAgICAgICAgICBsZXQgZyA9ICgobnVtID4+IDgpICYgMHgwMEZGKSArIHBlcmNlbnQ7XHJcbiAgICAgICAgICAgIGxldCBiID0gKG51bSAmIDB4MDAwMEZGKSArIHBlcmNlbnQ7XHJcbiAgICAgICAgICAgIHIgPSBNYXRoLm1pbigyNTUsIE1hdGgubWF4KDAsIHIpKTtcclxuICAgICAgICAgICAgZyA9IE1hdGgubWluKDI1NSwgTWF0aC5tYXgoMCwgZykpO1xyXG4gICAgICAgICAgICBiID0gTWF0aC5taW4oMjU1LCBNYXRoLm1heCgwLCBiKSk7XHJcbiAgICAgICAgICAgIHJldHVybiBgIyR7KHIgPDwgMTYgfCBnIDw8IDggfCBiKS50b1N0cmluZygxNikucGFkU3RhcnQoNiwgJzAnKX1gO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY29sb3I7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvbk1vdXNlTW92ZUhvdmVyKGU6IE1vdXNlRXZlbnQpIHtcclxuICAgICAgICBjb25zdCByZWN0ID0gdGhpcy5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgY29uc3Qgc3ggPSB0aGlzLmNhbnZhcy53aWR0aCAvIHJlY3Qud2lkdGg7XHJcbiAgICAgICAgY29uc3Qgc3kgPSB0aGlzLmNhbnZhcy5oZWlnaHQgLyByZWN0LmhlaWdodDtcclxuICAgICAgICBjb25zdCBteCA9IChlLmNsaWVudFggLSByZWN0LmxlZnQpICogc3g7XHJcbiAgICAgICAgY29uc3QgbXkgPSAoZS5jbGllbnRZIC0gcmVjdC50b3ApICogc3k7XHJcblxyXG4gICAgICAgIGNvbnN0IHJhd0FuZ2xlID0gTWF0aC5hdGFuMihteSAtIHRoaXMuY2VudGVyWSwgbXggLSB0aGlzLmNlbnRlclgpO1xyXG4gICAgICAgIGNvbnN0IHJhZGl1cyA9IE1hdGguaHlwb3QobXggLSB0aGlzLmNlbnRlclgsIG15IC0gdGhpcy5jZW50ZXJZKTtcclxuICAgICAgICBjb25zdCBsaSA9IHRoaXMuZ2V0TGF5ZXJJbmRleChyYWRpdXMpO1xyXG4gICAgICAgIGlmIChsaSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmhvdmVyZWRTZWN0b3IgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLmRyYXcoKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgbGF5ZXIgPSB0aGlzLmxheWVyc1tsaV07XHJcbiAgICAgICAgY29uc3QgY291bnQgPSBsYXllci5pdGVtcy5sZW5ndGg7XHJcbiAgICAgICAgaWYgKGNvdW50ID09PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaG92ZXJlZFNlY3RvciA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhdygpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgZWZmZWN0aXZlQW5nbGUgPSByYXdBbmdsZSAtIHRoaXMucm90YXRpb247XHJcbiAgICAgICAgY29uc3QgbGF5ZXJPZmZzZXRSYWQgPSB0aGlzLmxheWVyUm90YXRpb25zLmdldChsaSkgfHwgMDtcclxuICAgICAgICBlZmZlY3RpdmVBbmdsZSAtPSBsYXllck9mZnNldFJhZDtcclxuICAgICAgICBlZmZlY3RpdmVBbmdsZSA9ICgoZWZmZWN0aXZlQW5nbGUgJSAoMiAqIE1hdGguUEkpKSArIDIgKiBNYXRoLlBJKSAlICgyICogTWF0aC5QSSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGFuZ2xlU3RlcCA9ICgyICogTWF0aC5QSSkgLyBjb3VudDtcclxuICAgICAgICBjb25zdCBpZHggPSBNYXRoLmZsb29yKGVmZmVjdGl2ZUFuZ2xlIC8gYW5nbGVTdGVwKTtcclxuXHJcbiAgICAgICAgaWYgKGlkeCA+PSAwICYmIGlkeCA8IGNvdW50KSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5ob3ZlcmVkU2VjdG9yIHx8IHRoaXMuaG92ZXJlZFNlY3Rvci5sYXllcklkeCAhPT0gbGkgfHwgdGhpcy5ob3ZlcmVkU2VjdG9yLml0ZW1JZHggIT09IGlkeCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ob3ZlcmVkU2VjdG9yID0geyBsYXllcklkeDogbGksIGl0ZW1JZHg6IGlkeCB9O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5ob3ZlcmVkU2VjdG9yKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhvdmVyZWRTZWN0b3IgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvbkNsaWNrKGU6IE1vdXNlRXZlbnQpIHtcclxuICAgICAgICBpZiAoIWUuY3RybEtleSAmJiAhZS5tZXRhS2V5KSByZXR1cm47XHJcbiAgICAgICAgaWYgKHRoaXMuaG92ZXJlZFNlY3Rvcikge1xyXG4gICAgICAgICAgICBjb25zdCB6b25lID0gdGhpcy50ZXh0Wm9uZXMuZmluZCh6ID0+IHoubGF5ZXJJZHggPT09IHRoaXMuaG92ZXJlZFNlY3RvciEubGF5ZXJJZHggJiYgei5pdGVtSWR4ID09PSB0aGlzLmhvdmVyZWRTZWN0b3IhLml0ZW1JZHgpO1xyXG4gICAgICAgICAgICBpZiAoem9uZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHpvbmUubGluaykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxpbmtGaWxlID0gdGhpcy5wbHVnaW4uYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Rmlyc3RMaW5rcGF0aERlc3Qoem9uZS5saW5rLCB0aGlzLmZpbGUucGF0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpbmtGaWxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmFwcC53b3Jrc3BhY2Uub3BlbkxpbmtUZXh0KHpvbmUubGluaywgdGhpcy5maWxlLnBhdGgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UoYFx1NjcyQVx1NjI3RVx1NTIzMFx1N0IxNFx1OEJCMDogJHt6b25lLmxpbmt9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wZW5Ob3RlQnlUaXRsZSh6b25lLnRleHQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9wZW5Ob3RlQnlUaXRsZSh0aXRsZTogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgY2xlYW5UaXRsZSA9IHRpdGxlLnJlcGxhY2UoL15cXFtcXFt8XFxdXFxdJC9nLCAnJyk7XHJcbiAgICAgICAgY29uc3QgZmlsZSA9IHRoaXMucGx1Z2luLmFwcC5tZXRhZGF0YUNhY2hlLmdldEZpcnN0TGlua3BhdGhEZXN0KGNsZWFuVGl0bGUsICcnKTtcclxuICAgICAgICBpZiAoZmlsZSkge1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5hcHAud29ya3NwYWNlLm9wZW5MaW5rVGV4dChjbGVhblRpdGxlLCAnJywgZmFsc2UpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG5ldyBOb3RpY2UoYFx1NjcyQVx1NjI3RVx1NTIzMFx1NjgwN1x1OTg5OFx1NEUzQVx1MjAxQyR7Y2xlYW5UaXRsZX1cdTIwMURcdTc2ODRcdTdCMTRcdThCQjBgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGFzeW5jIGhhbmRsZURibENsaWNrKGU6IE1vdXNlRXZlbnQpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBjb25zdCByZWN0ID0gdGhpcy5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgY29uc3Qgc3ggPSB0aGlzLmNhbnZhcy53aWR0aCAvIHJlY3Qud2lkdGg7XHJcbiAgICAgICAgY29uc3Qgc3kgPSB0aGlzLmNhbnZhcy5oZWlnaHQgLyByZWN0LmhlaWdodDtcclxuICAgICAgICBjb25zdCBteCA9IChlLmNsaWVudFggLSByZWN0LmxlZnQpICogc3g7XHJcbiAgICAgICAgY29uc3QgbXkgPSAoZS5jbGllbnRZIC0gcmVjdC50b3ApICogc3k7XHJcbiAgICAgICAgbGV0IG1pbkRpc3QgPSAyMDtcclxuICAgICAgICBsZXQgaGl0ID0gbnVsbDtcclxuICAgICAgICBmb3IgKGNvbnN0IHpvbmUgb2YgdGhpcy50ZXh0Wm9uZXMpIHtcclxuICAgICAgICAgICAgY29uc3QgZHggPSB6b25lLnggLSBteCwgZHkgPSB6b25lLnkgLSBteTtcclxuICAgICAgICAgICAgY29uc3QgZGlzdCA9IE1hdGguaHlwb3QoZHgsIGR5KTtcclxuICAgICAgICAgICAgaWYgKGRpc3QgPCBtaW5EaXN0KSB7XHJcbiAgICAgICAgICAgICAgICBtaW5EaXN0ID0gZGlzdDtcclxuICAgICAgICAgICAgICAgIGhpdCA9IHpvbmU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGhpdCkge1xyXG4gICAgICAgICAgICBjb25zdCBuZXdUZXh0ID0gYXdhaXQgdGhpcy5wcm9tcHRGb3JUZXh0KGhpdC50ZXh0KTtcclxuICAgICAgICAgICAgaWYgKG5ld1RleHQgIT09IG51bGwgJiYgbmV3VGV4dCAhPT0gaGl0LnRleHQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5sYXllcnNbaGl0LmxheWVySWR4XS5pdGVtc1toaXQuaXRlbUlkeF0gPSBuZXdUZXh0O1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgdXBkYXRlQ29kZUJsb2NrKHRoaXMuZmlsZSwgdGhpcy5vbGRTb3VyY2UsIHRoaXMuZGF0YSwgdGhpcy5wbHVnaW4pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbGRTb3VyY2UgPSBzZXJpYWxpemVMdW9wYW5EYXRhKHRoaXMuZGF0YSwgdGhpcy5kYXRhLl9mb3JtYXQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbkRhdGFDaGFuZ2UodGhpcy5kYXRhKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29tcHV0ZUxheW91dCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHpvbmUgb2YgdGhpcy50ZXh0Wm9uZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmICh6b25lLmxpbmspIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkeCA9IHpvbmUueCAtIG14LCBkeSA9IHpvbmUueSAtIG15O1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChNYXRoLmh5cG90KGR4LCBkeSkgPCAxNSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsaW5rRmlsZSA9IHRoaXMucGx1Z2luLmFwcC5tZXRhZGF0YUNhY2hlLmdldEZpcnN0TGlua3BhdGhEZXN0KHpvbmUubGluaywgdGhpcy5maWxlLnBhdGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobGlua0ZpbGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmFwcC53b3Jrc3BhY2Uub3BlbkxpbmtUZXh0KGxpbmtGaWxlLnBhdGgsIHRoaXMuZmlsZS5wYXRoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UoYFx1NjcyQVx1NjI3RVx1NTIzMFx1N0IxNFx1OEJCMDogJHt6b25lLmxpbmt9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcHJvbXB0Rm9yVGV4dChjdXJyZW50OiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbW9kYWwgPSBuZXcgRWRpdFRleHRNb2RhbCh0aGlzLnBsdWdpbi5hcHAsIGN1cnJlbnQsIHJlc29sdmUpO1xyXG4gICAgICAgICAgICBtb2RhbC5vcGVuKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3koKSB7XHJcbiAgICAgICAgc3VwZXIuZGVzdHJveSgpO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMub25Nb3VzZU1vdmVIb3Zlcik7XHJcbiAgICB9XHJcbn0iLCAiaW1wb3J0IHsgTm90aWNlIH0gZnJvbSAnb2JzaWRpYW4nO1xyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEJhc2VSb3RhdGFibGVDYW52YXMge1xyXG4gICAgcHJvdGVjdGVkIGNhbnZhcyE6IEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgcHJvdGVjdGVkIGN0eCE6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuICAgIHByb3RlY3RlZCBjb250YWluZXI6IEhUTUxFbGVtZW50O1xyXG4gICAgcHJvdGVjdGVkIHdpZHRoID0gODAwO1xyXG4gICAgcHJvdGVjdGVkIGhlaWdodCA9IDgwMDtcclxuICAgIHByb3RlY3RlZCBjZW50ZXJYID0gNDAwO1xyXG4gICAgcHJvdGVjdGVkIGNlbnRlclkgPSA0MDA7XHJcblxyXG4gICAgLy8gXHU2NTc0XHU0RjUzXHU2NUNCXHU4RjZDXHJcbiAgICBwcm90ZWN0ZWQgcm90YXRpb24gPSAwO1xyXG5cclxuICAgIC8vIFx1NjJENlx1NjJGRFx1NzJCNlx1NjAwMVxyXG4gICAgcHJvdGVjdGVkIGlzRHJhZ2dpbmcgPSBmYWxzZTtcclxuICAgIHByb3RlY3RlZCBpc0xheWVyUm90YXRpbmcgPSBmYWxzZTtcclxuICAgIHByb3RlY3RlZCByb3RhdGluZ0RlcHRoT3JJZHg6IG51bWJlciA9IC0xOyAvLyBkZXB0aCAoc3VuYnVyc3QpIFx1NjIxNiBsYXllcklkeCAobHVvcGFuKVxyXG5cclxuICAgIHByb3RlY3RlZCBsYXN0TW91c2VBbmdsZSA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgbGFzdE1vdmVBbmdsZSA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgbGFzdE1vdmVUaW1lID0gMDtcclxuICAgIHByb3RlY3RlZCB2ZWxvY2l0eSA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgZnJpY3Rpb24gPSAwLjk4O1xyXG4gICAgcHJvdGVjdGVkIGluZXJ0aWFJZDogbnVtYmVyIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgLy8gXHU2QkNGXHU1QzQyXHU3MkVDXHU3QUNCXHU2NUNCXHU4RjZDXHU1MDRGXHU3OUZCXHVGRjA4XHU1RjI3XHU1RUE2XHVGRjA5XHVGRjBDXHU1QjUwXHU3QzdCXHU1M0VGXHU4MUVBXHU1QjlBXHU0RTQ5IGtleSBcdTdDN0JcdTU3OEJcdUZGMDhudW1iZXJcdUZGMDlcclxuICAgIHByb3RlY3RlZCBsYXllclJvdGF0aW9uczogTWFwPG51bWJlciwgbnVtYmVyPiA9IG5ldyBNYXAoKTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXI6IEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gXHU3NTMxXHU1QjUwXHU3QzdCXHU1QjlFXHU3M0IwXHU1MTc3XHU0RjUzXHU3RUQ4XHU1MjM2XHJcbiAgICBhYnN0cmFjdCBkcmF3KCk6IHZvaWQ7XHJcblxyXG4gICAgLy8gXHU1QjUwXHU3QzdCXHU1M0VGXHU5MUNEXHU1MTk5XHU0RUU1XHU1OTA0XHU3NDA2IFNoaWZ0K1x1NjJENlx1NjJGRFx1NUYwMFx1NTlDQlx1NTI0RFx1NzY4NFx1NTIyNFx1NjVBRFx1RkYwQ1x1OEZENFx1NTZERSB0cnVlIFx1ODg2OFx1NzkzQVx1NURGMlx1NTkwNFx1NzQwNlx1RkYwOFx1NEUwRFx1NEYxQVx1OEZEQlx1ODg0Q1x1NjU3NFx1NEY1M1x1NjVDQlx1OEY2Q1x1RkYwOVxyXG4gICAgcHJvdGVjdGVkIGhhbmRsZVNoaWZ0RHJhZ1N0YXJ0KGFuZ2xlOiBudW1iZXIsIHJhZGl1czogbnVtYmVyLCBlOiBNb3VzZUV2ZW50KTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFx1NUI1MFx1N0M3Qlx1NTNFRlx1OTFDRFx1NTE5OVx1RkYxQVNoaWZ0K1x1NjJENlx1NjJGRFx1NzlGQlx1NTJBOFxyXG4gICAgcHJvdGVjdGVkIGhhbmRsZVNoaWZ0RHJhZ01vdmUoYW5nbGU6IG51bWJlciwgZTogTW91c2VFdmVudCk6IHZvaWQgeyB9XHJcblxyXG4gICAgLy8gXHU1QjUwXHU3QzdCXHU1M0VGXHU5MUNEXHU1MTk5XHVGRjFBU2hpZnQrXHU2MkQ2XHU2MkZEXHU3RUQzXHU2NzVGXHJcbiAgICBwcm90ZWN0ZWQgaGFuZGxlU2hpZnREcmFnRW5kKCk6IHZvaWQgeyB9XHJcblxyXG4gICAgLy8gXHU1QjUwXHU3QzdCXHU1M0VGXHU5MUNEXHU1MTk5XHVGRjFBXHU1M0NDXHU1MUZCXHU1OTA0XHU3NDA2XHJcbiAgICBwcm90ZWN0ZWQgYWJzdHJhY3QgaGFuZGxlRGJsQ2xpY2soZTogTW91c2VFdmVudCk6IHZvaWQ7XHJcblxyXG4gICAgLy8gXHU1MjFEXHU1OUNCXHU1MzE2IENhbnZhcyBcdTU0OENcdTYzMDlcdTk0QUVcdUZGMDhcdTVCNTBcdTdDN0JcdThDMDNcdTc1MjhcdUZGMDlcclxuICAgIHByb3RlY3RlZCBpbml0Q2FudmFzKGV4dHJhQ2xhc3NOYW1lOiBzdHJpbmcsIGhhc0NvbnRyb2xzID0gdHJ1ZSkge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmVtcHR5KCk7XHJcbiAgICAgICAgY29uc3Qgd3JhcHBlciA9IHRoaXMuY29udGFpbmVyLmNyZWF0ZURpdih7IGNsczogZXh0cmFDbGFzc05hbWUgfSk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSB3cmFwcGVyLmNyZWF0ZUVsKCdjYW52YXMnLCB7XHJcbiAgICAgICAgICAgIGNsczogYCR7ZXh0cmFDbGFzc05hbWV9LWNhbnZhc2AsXHJcbiAgICAgICAgICAgIGF0dHI6IHsgd2lkdGg6IHRoaXMud2lkdGgsIGhlaWdodDogdGhpcy5oZWlnaHQgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKSE7XHJcblxyXG4gICAgICAgIGlmIChoYXNDb250cm9scykge1xyXG4gICAgICAgICAgICBjb25zdCBjb250cm9scyA9IHdyYXBwZXIuY3JlYXRlRGl2KHsgY2xzOiAnbHVvcGFuLWNvbnRyb2xzJyB9KTtcclxuICAgICAgICAgICAgY29uc3QgcmVzZXRCdG4gPSBjb250cm9scy5jcmVhdGVFbCgnYnV0dG9uJywgeyB0ZXh0OiAnXHU5MUNEXHU3RjZFXHU4OUQyXHU1RUE2JyB9KTtcclxuICAgICAgICAgICAgcmVzZXRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3BJbmVydGlhKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvdGF0aW9uID0gMDtcclxuICAgICAgICAgICAgICAgIHRoaXMubGF5ZXJSb3RhdGlvbnMuY2xlYXIoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudmVsb2NpdHkgPSAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBcdTlGMjBcdTY4MDdcdTU3NTBcdTY4MDdcdThGNkNcdTYzNjJcclxuICAgIHByb3RlY3RlZCBnZXRNb3VzZUFuZ2xlKGU6IE1vdXNlRXZlbnQpOiBudW1iZXIge1xyXG4gICAgICAgIGNvbnN0IHJlY3QgPSB0aGlzLmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICBjb25zdCBzeCA9IHRoaXMuY2FudmFzLndpZHRoIC8gcmVjdC53aWR0aDtcclxuICAgICAgICBjb25zdCBzeSA9IHRoaXMuY2FudmFzLmhlaWdodCAvIHJlY3QuaGVpZ2h0O1xyXG4gICAgICAgIGNvbnN0IG14ID0gKGUuY2xpZW50WCAtIHJlY3QubGVmdCkgKiBzeCAtIHRoaXMuY2VudGVyWDtcclxuICAgICAgICBjb25zdCBteSA9IChlLmNsaWVudFkgLSByZWN0LnRvcCkgKiBzeSAtIHRoaXMuY2VudGVyWTtcclxuICAgICAgICByZXR1cm4gTWF0aC5hdGFuMihteSwgbXgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBnZXRNb3VzZVJhZGl1cyhlOiBNb3VzZUV2ZW50KTogbnVtYmVyIHtcclxuICAgICAgICBjb25zdCByZWN0ID0gdGhpcy5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgY29uc3Qgc3ggPSB0aGlzLmNhbnZhcy53aWR0aCAvIHJlY3Qud2lkdGg7XHJcbiAgICAgICAgY29uc3Qgc3kgPSB0aGlzLmNhbnZhcy5oZWlnaHQgLyByZWN0LmhlaWdodDtcclxuICAgICAgICBjb25zdCBteCA9IChlLmNsaWVudFggLSByZWN0LmxlZnQpICogc3ggLSB0aGlzLmNlbnRlclg7XHJcbiAgICAgICAgY29uc3QgbXkgPSAoZS5jbGllbnRZIC0gcmVjdC50b3ApICogc3kgLSB0aGlzLmNlbnRlclk7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguaHlwb3QobXgsIG15KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBcdTRFOEJcdTRFRjZcdTdFRDFcdTVCOUFcclxuICAgIHByb3RlY3RlZCBiaW5kRXZlbnRzKCkge1xyXG4gICAgICAgIGNvbnN0IG9uTW91c2VEb3duID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5zdG9wSW5lcnRpYSgpO1xyXG4gICAgICAgICAgICBjb25zdCBhbmdsZSA9IHRoaXMuZ2V0TW91c2VBbmdsZShlKTtcclxuICAgICAgICAgICAgY29uc3QgcmFkaXVzID0gdGhpcy5nZXRNb3VzZVJhZGl1cyhlKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChlLnNoaWZ0S2V5ICYmIHRoaXMuaGFuZGxlU2hpZnREcmFnU3RhcnQoYW5nbGUsIHJhZGl1cywgZSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXNMYXllclJvdGF0aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdE1vdXNlQW5nbGUgPSBhbmdsZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLmN1cnNvciA9ICdldy1yZXNpemUnO1xyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBcdTY1NzRcdTRGNTNcdTY1Q0JcdThGNkNcclxuICAgICAgICAgICAgdGhpcy5pc0RyYWdnaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5sYXN0TW91c2VBbmdsZSA9IGFuZ2xlO1xyXG4gICAgICAgICAgICB0aGlzLmxhc3RNb3ZlQW5nbGUgPSBhbmdsZTtcclxuICAgICAgICAgICAgdGhpcy5sYXN0TW92ZVRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuICAgICAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUuY3Vyc29yID0gJ2dyYWJiaW5nJztcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IG9uTW91c2VNb3ZlID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNMYXllclJvdGF0aW5nKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdBbmdsZSA9IHRoaXMuZ2V0TW91c2VBbmdsZShlKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRlbHRhID0gbmV3QW5nbGUgLSB0aGlzLmxhc3RNb3VzZUFuZ2xlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVTaGlmdERyYWdNb3ZlKG5ld0FuZ2xlLCBlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdE1vdXNlQW5nbGUgPSBuZXdBbmdsZTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLmlzRHJhZ2dpbmcpIHJldHVybjtcclxuICAgICAgICAgICAgY29uc3QgbmV3QW5nbGUgPSB0aGlzLmdldE1vdXNlQW5nbGUoZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGRlbHRhID0gbmV3QW5nbGUgLSB0aGlzLmxhc3RNb3VzZUFuZ2xlO1xyXG4gICAgICAgICAgICB0aGlzLnJvdGF0aW9uICs9IGRlbHRhO1xyXG4gICAgICAgICAgICB0aGlzLmxhc3RNb3VzZUFuZ2xlID0gbmV3QW5nbGU7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhdygpO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgbm93ID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGR0ID0gTWF0aC5taW4oMC4xLCAobm93IC0gdGhpcy5sYXN0TW92ZVRpbWUpIC8gMTAwMCk7XHJcbiAgICAgICAgICAgIGlmIChkdCA+IDAuMDEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmVsb2NpdHkgPSAobmV3QW5nbGUgLSB0aGlzLmxhc3RNb3ZlQW5nbGUpIC8gZHQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RNb3ZlQW5nbGUgPSBuZXdBbmdsZTtcclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdE1vdmVUaW1lID0gbm93O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3Qgb25Nb3VzZVVwID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0xheWVyUm90YXRpbmcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXNMYXllclJvdGF0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZS5jdXJzb3IgPSAnZ3JhYic7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVNoaWZ0RHJhZ0VuZCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNEcmFnZ2luZykgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmlzRHJhZ2dpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUuY3Vyc29yID0gJ2dyYWInO1xyXG4gICAgICAgICAgICBpZiAoTWF0aC5hYnModGhpcy52ZWxvY2l0eSkgPiAwLjA1KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0SW5lcnRpYSgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52ZWxvY2l0eSA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBvbkRibENsaWNrID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5oYW5kbGVEYmxDbGljayhlKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbk1vdXNlRG93bik7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uTW91c2VNb3ZlKTtcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTW91c2VVcCk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignZGJsY2xpY2snLCBvbkRibENsaWNrKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBcdTYwRUZcdTYwMjdcdTUyQThcdTc1M0JcclxuICAgIHByb3RlY3RlZCBzdGFydEluZXJ0aWEoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaW5lcnRpYUlkKSBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLmluZXJ0aWFJZCk7XHJcbiAgICAgICAgbGV0IGxhc3RUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcbiAgICAgICAgY29uc3Qgc3RlcCA9IChub3c6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBkdCA9IE1hdGgubWluKDAuMDMzLCAobm93IC0gbGFzdFRpbWUpIC8gMTAwMCk7XHJcbiAgICAgICAgICAgIGlmIChkdCA8PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmluZXJ0aWFJZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnZlbG9jaXR5ICo9IE1hdGgucG93KHRoaXMuZnJpY3Rpb24sIGR0ICogNjApO1xyXG4gICAgICAgICAgICB0aGlzLnJvdGF0aW9uICs9IHRoaXMudmVsb2NpdHkgKiBkdDtcclxuICAgICAgICAgICAgdGhpcy5kcmF3KCk7XHJcbiAgICAgICAgICAgIGxhc3RUaW1lID0gbm93O1xyXG4gICAgICAgICAgICBpZiAoTWF0aC5hYnModGhpcy52ZWxvY2l0eSkgPCAwLjAwNSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52ZWxvY2l0eSA9IDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmluZXJ0aWFJZCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5pbmVydGlhSWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmluZXJ0aWFJZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgc3RvcEluZXJ0aWEoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaW5lcnRpYUlkKSB7XHJcbiAgICAgICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuaW5lcnRpYUlkKTtcclxuICAgICAgICAgICAgdGhpcy5pbmVydGlhSWQgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnZlbG9jaXR5ID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVzdHJveSgpIHtcclxuICAgICAgICB0aGlzLnN0b3BJbmVydGlhKCk7XHJcbiAgICB9XHJcbn0iLCAiLy8gc3JjL3NldHRpbmdzLnRzXHJcbmltcG9ydCB7IEFwcCwgUGx1Z2luU2V0dGluZ1RhYiwgU2V0dGluZyB9IGZyb20gJ29ic2lkaWFuJztcclxuaW1wb3J0IHR5cGUgTHVvcGFuSW50ZWdyYXRlZFBsdWdpbiBmcm9tICcuL21haW4nO1xyXG5cclxuZXhwb3J0IGNsYXNzIEx1b3BhblNldHRpbmdUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcclxuICAgIHBsdWdpbjogTHVvcGFuSW50ZWdyYXRlZFBsdWdpbjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcGx1Z2luOiBMdW9wYW5JbnRlZ3JhdGVkUGx1Z2luKSB7XHJcbiAgICAgICAgc3VwZXIoYXBwLCBwbHVnaW4pO1xyXG4gICAgICAgIHRoaXMucGx1Z2luID0gcGx1Z2luO1xyXG4gICAgfVxyXG5cclxuICAgIGRpc3BsYXkoKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgeyBjb250YWluZXJFbCB9ID0gdGhpcztcclxuICAgICAgICBjb250YWluZXJFbC5lbXB0eSgpO1xyXG4gICAgICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKCdoMicsIHsgdGV4dDogJ1x1N0Y1N1x1NzZEOFx1NEUwRVx1NjVFRFx1NjVFNVx1NTZGRVx1OEJCRVx1N0Y2RScgfSk7XHJcblxyXG4gICAgICAgIC8vIFx1OTg3Nlx1OTBFOFx1NTNDMlx1ODAwM1x1NTIzQlx1N0VCRlxyXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG4gICAgICAgICAgICAuc2V0TmFtZSgnXHU2NjNFXHU3OTNBXHU5ODc2XHU5MEU4XHU1M0MyXHU4MDAzXHU1MjNCXHU3RUJGJylcclxuICAgICAgICAgICAgLnNldERlc2MoJ1x1NEVDRVx1NTcwNlx1NUZDM1x1NTIzMFx1NkI2M1x1NEUwQVx1NjVCOVx1N0VEOFx1NTIzNlx1NEUwMFx1Njc2MVx1N0VDNlx1N0VCRlx1RkYwOFx1NEUwRFx1OTY4Rlx1N0Y1N1x1NzZEOFx1NjVDQlx1OEY2Q1x1RkYwOScpXHJcbiAgICAgICAgICAgIC5hZGRUb2dnbGUodG9nZ2xlID0+IHRvZ2dsZVxyXG4gICAgICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnNob3dUb3BNYXJrZXIpXHJcbiAgICAgICAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd1RvcE1hcmtlciA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2hBbGxSZW5kZXJlcnMoKTtcclxuICAgICAgICAgICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgLy8gXHU2MjQ3XHU1MzNBXHU1MjA2XHU1MjcyXHU3RUJGXHJcbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcbiAgICAgICAgICAgIC5zZXROYW1lKCdcdTY2M0VcdTc5M0FcdTYyNDdcdTUzM0FcdTUyMDZcdTc1NENcdTdFQkYnKVxyXG4gICAgICAgICAgICAuc2V0RGVzYygnXHU1NzI4XHU2QkNGXHU0RTJBXHU2MjQ3XHU1MzNBXHU0RTRCXHU5NUY0XHU3RUQ4XHU1MjM2XHU1Rjg4XHU4NjVBXHU3Njg0XHU1MzRBXHU5MDBGXHU2NjBFXHU1Rjg0XHU1NDExXHU3RUM2XHU3RUJGJylcclxuICAgICAgICAgICAgLmFkZFRvZ2dsZSh0b2dnbGUgPT4gdG9nZ2xlXHJcbiAgICAgICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd1NlY3RvckRpdmlkZXJzKVxyXG4gICAgICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnNob3dTZWN0b3JEaXZpZGVycyA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2hBbGxSZW5kZXJlcnMoKTtcclxuICAgICAgICAgICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgLy8gXHU2MjQ3XHU1MzNBXHU0RTBEXHU5MDBGXHU2NjBFXHU1RUE2XHJcbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcbiAgICAgICAgICAgIC5zZXROYW1lKCdcdTYyNDdcdTUzM0FcdTRFMERcdTkwMEZcdTY2MEVcdTVFQTYnKVxyXG4gICAgICAgICAgICAuc2V0RGVzYygnXHU2NTcwXHU1MDNDXHU4RDhBXHU0RjRFXHU4RDhBXHU5MDBGXHU2NjBFJylcclxuICAgICAgICAgICAgLmFkZFNsaWRlcihzbGlkZXIgPT4gc2xpZGVyXHJcbiAgICAgICAgICAgICAgICAuc2V0TGltaXRzKDAuMSwgMS4wLCAwLjA1KVxyXG4gICAgICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnNlY3Rvck9wYWNpdHkpXHJcbiAgICAgICAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2VjdG9yT3BhY2l0eSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2hBbGxSZW5kZXJlcnMoKTtcclxuICAgICAgICAgICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgLy8gXHU2NTg3XHU1QjU3XHU5ODlDXHU4MjcyXHVGRjA4XHU4QzAzXHU4MjcyXHU2NzdGXHVGRjA5XHJcbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcbiAgICAgICAgICAgIC5zZXROYW1lKCdcdTY1ODdcdTVCNTdcdTk4OUNcdTgyNzInKVxyXG4gICAgICAgICAgICAuc2V0RGVzYygnXHU2MjQwXHU2NzA5XHU3NkQ4XHU5NzYyXHU2NTg3XHU1QjU3XHU3Njg0XHU1MTY4XHU1QzQwXHU5ODlDXHU4MjcyJylcclxuICAgICAgICAgICAgLmFkZENvbG9yUGlja2VyKHBpY2tlciA9PiBwaWNrZXJcclxuICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy50ZXh0Q29sb3IpXHJcbiAgICAgICAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MudGV4dENvbG9yID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaEFsbFJlbmRlcmVycygpO1xyXG4gICAgICAgICAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICAvLyBcdTgxRUFcdTVCOUFcdTRFNDlcdTc2RDhcdTk3NjJcdTk4OUNcdTgyNzJcdUZGMDhcdThDMDNcdTgyNzJcdTY3N0ZcdUZGMDlcclxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuICAgICAgICAgICAgLnNldE5hbWUoJ1x1ODFFQVx1NUI5QVx1NEU0OVx1NzZEOFx1OTc2Mlx1OTg5Q1x1ODI3MicpXHJcbiAgICAgICAgICAgIC5zZXREZXNjKCdcdTg5ODZcdTc2RDZcdTlFRDhcdThCQTRcdTkxNERcdTgyNzJcdUZGMENcdTc1NTlcdTdBN0FcdTUyMTlcdTRGN0ZcdTc1MjhcdTUzOUZcdTU5Q0JcdTk4OUNcdTgyNzInKVxyXG4gICAgICAgICAgICAuYWRkQ29sb3JQaWNrZXIocGlja2VyID0+IHBpY2tlclxyXG4gICAgICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmN1c3RvbVNlY3RvckNvbG9yIHx8ICcnKSAvLyBcdTdBN0FcdTVCNTdcdTdCMjZcdTRFMzJcdTg4NjhcdTc5M0FcdTRFMERcdTg5ODZcdTc2RDZcclxuICAgICAgICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jdXN0b21TZWN0b3JDb2xvciA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2hBbGxSZW5kZXJlcnMoKTtcclxuICAgICAgICAgICAgICAgIH0pKTtcclxuICAgIH1cclxufSIsICJpbXBvcnQgeyBURmlsZSwgTm90aWNlIH0gZnJvbSAnb2JzaWRpYW4nO1xyXG5pbXBvcnQgeyBFZGl0VGV4dE1vZGFsIH0gZnJvbSAnLi9tb2RhbHMnO1xyXG5pbXBvcnQgeyBCYXNlUm90YXRhYmxlQ2FudmFzIH0gZnJvbSAnLi9iYXNlLXJlbmRlcmVyJztcclxuaW1wb3J0IHR5cGUgTHVvcGFuSW50ZWdyYXRlZFBsdWdpbiBmcm9tICcuL21haW4nO1xyXG5cclxuLy8gLS0tLS0tLS0tLSBcdTdDN0JcdTU3OEJcdTVCOUFcdTRFNDkgLS0tLS0tLS0tLVxyXG5pbnRlcmZhY2UgSGVhZGluZ05vZGUge1xyXG4gICAgdGV4dDogc3RyaW5nO1xyXG4gICAgbGV2ZWw6IG51bWJlcjtcclxuICAgIGNoaWxkcmVuOiBIZWFkaW5nTm9kZVtdO1xyXG4gICAgcmF3TGluZT86IHN0cmluZztcclxuICAgIGZpbGU/OiBURmlsZTtcclxuICAgIGxpbmU/OiBudW1iZXI7XHJcbn1cclxuXHJcbmludGVyZmFjZSBIZWFkaW5nUmF3IHtcclxuICAgIGxldmVsOiBudW1iZXI7XHJcbiAgICB0ZXh0OiBzdHJpbmc7XHJcbiAgICBsaW5lOiBudW1iZXI7XHJcbiAgICByYXc6IHN0cmluZztcclxuICAgIGZpbGU6IFRGaWxlO1xyXG59XHJcblxyXG4vLyAtLS0tLS0tLS0tIFx1Njc4NFx1NUVGQVx1NjgwN1x1OTg5OFx1NjgxMSAtLS0tLS0tLS0tXHJcbmZ1bmN0aW9uIGJ1aWxkSGVhZGluZ1RyZWUoaGVhZGluZ3M6IEhlYWRpbmdSYXdbXSk6IEhlYWRpbmdOb2RlW10ge1xyXG4gICAgY29uc3Qgcm9vdHM6IEhlYWRpbmdOb2RlW10gPSBbXTtcclxuICAgIGNvbnN0IHN0YWNrOiBIZWFkaW5nTm9kZVtdID0gW107XHJcbiAgICBmb3IgKGNvbnN0IGggb2YgaGVhZGluZ3MpIHtcclxuICAgICAgICBjb25zdCBub2RlOiBIZWFkaW5nTm9kZSA9IHtcclxuICAgICAgICAgICAgdGV4dDogaC50ZXh0LFxyXG4gICAgICAgICAgICBsZXZlbDogaC5sZXZlbCxcclxuICAgICAgICAgICAgY2hpbGRyZW46IFtdLFxyXG4gICAgICAgICAgICByYXdMaW5lOiBoLnJhdyxcclxuICAgICAgICAgICAgZmlsZTogaC5maWxlLFxyXG4gICAgICAgICAgICBsaW5lOiBoLmxpbmUsXHJcbiAgICAgICAgfTtcclxuICAgICAgICB3aGlsZSAoc3RhY2subGVuZ3RoID4gMCAmJiBzdGFja1tzdGFjay5sZW5ndGggLSAxXS5sZXZlbCA+PSBoLmxldmVsKSB7XHJcbiAgICAgICAgICAgIHN0YWNrLnBvcCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc3RhY2subGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJvb3RzLnB1c2gobm9kZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc3RhY2tbc3RhY2subGVuZ3RoIC0gMV0uY2hpbGRyZW4ucHVzaChub2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc3RhY2sucHVzaChub2RlKTtcclxuICAgIH1cclxuICAgIHJldHVybiByb290cztcclxufVxyXG5cclxuLy8gLS0tLS0tLS0tLSBcdTY1RURcdTY1RTVcdTU2RkVcdTZFMzJcdTY3RDNcdTU2NjggLS0tLS0tLS0tLVxyXG5leHBvcnQgY2xhc3MgU3VuYnVyc3RSZW5kZXJlciBleHRlbmRzIEJhc2VSb3RhdGFibGVDYW52YXMge1xyXG4gICAgcHJpdmF0ZSByb290czogSGVhZGluZ05vZGVbXTtcclxuICAgIHByaXZhdGUgbWF4RGVwdGg6IG51bWJlcjtcclxuICAgIHByaXZhdGUgdGV4dFpvbmVzOiB7XHJcbiAgICAgICAgeDogbnVtYmVyOyB5OiBudW1iZXI7IGRlcHRoOiBudW1iZXI7IGluZGV4OiBudW1iZXI7IG5vZGU6IEhlYWRpbmdOb2RlO1xyXG4gICAgfVtdID0gW107XHJcbiAgICBwcml2YXRlIHBsdWdpbjogTHVvcGFuSW50ZWdyYXRlZFBsdWdpbjtcclxuICAgIC8vIFx1NzUyOFx1NEU4RSBTaGlmdCtcdTYyRDZcdTYyRkRcdTY1RjZcdTRGRERcdTVCNThcdTYyNDdcdTUzM0FcdTRGRTFcdTYwNkZcclxuICAgIHByaXZhdGUgZHJhZ1RhcmdldDoge1xyXG4gICAgICAgIGRlcHRoOiBudW1iZXI7XHJcbiAgICAgICAgcGFyZW50Q2hpbGRyZW46IEhlYWRpbmdOb2RlW107XHJcbiAgICAgICAgb3JpZ2luYWxJbmRleDogbnVtYmVyO1xyXG4gICAgICAgIG5vZGU6IEhlYWRpbmdOb2RlO1xyXG4gICAgfSB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsXHJcbiAgICAgICAgbm90ZURhdGE6IHsgbm90ZU5hbWU6IHN0cmluZzsgaGVhZGluZ3M6IEhlYWRpbmdSYXdbXSB9W10sXHJcbiAgICAgICAgcGx1Z2luOiBMdW9wYW5JbnRlZ3JhdGVkUGx1Z2luLFxyXG4gICAgKSB7XHJcbiAgICAgICAgc3VwZXIoY29udGFpbmVyKTtcclxuICAgICAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcclxuICAgICAgICAvLyBcdTRFM0FcdTZCQ0ZcdTRFMkFcdTdCMTRcdThCQjBcdTUyMUJcdTVFRkFcdTg2NUFcdTYyREZcdTY4MzlcdTgyODJcdTcwQjlcdUZGMDhcdTZERjFcdTVFQTYwXHVGRjA5XHJcbiAgICAgICAgdGhpcy5yb290cyA9IG5vdGVEYXRhLm1hcChkYXRhID0+ICh7XHJcbiAgICAgICAgICAgIHRleHQ6IGRhdGEubm90ZU5hbWUsXHJcbiAgICAgICAgICAgIGxldmVsOiAwLFxyXG4gICAgICAgICAgICBjaGlsZHJlbjogYnVpbGRIZWFkaW5nVHJlZShkYXRhLmhlYWRpbmdzKSxcclxuICAgICAgICB9KSk7XHJcbiAgICAgICAgY29uc3QgbWF4TGV2ZWwgPSBNYXRoLm1heCgwLCAuLi5ub3RlRGF0YS5mbGF0TWFwKGQgPT4gZC5oZWFkaW5ncy5tYXAoaCA9PiBoLmxldmVsKSkpO1xyXG4gICAgICAgIHRoaXMubWF4RGVwdGggPSBtYXhMZXZlbCArIDE7XHJcbiAgICAgICAgdGhpcy5pbml0Q2FudmFzKCdzdW5idXJzdC1jb250YWluZXInKTtcclxuICAgICAgICB0aGlzLmJpbmRFdmVudHMoKTtcclxuICAgICAgICB0aGlzLmRyYXcoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBcdTgzQjdcdTUzRDZcdTZERjFcdTVFQTZcdUZGMDhcdTY4MzlcdTYzNkVcdTUzNEFcdTVGODRcdUZGMDlcclxuICAgIHByaXZhdGUgZ2V0RGVwdGgocmFkaXVzOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIGNvbnN0IHRvdGFsUmFkaXVzID0gMzUwO1xyXG4gICAgICAgIGNvbnN0IHJhZGl1c1N0ZXAgPSB0b3RhbFJhZGl1cyAvIHRoaXMubWF4RGVwdGg7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IocmFkaXVzIC8gcmFkaXVzU3RlcCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gXHU1NDdEXHU0RTJEXHU2RDRCXHU4QkQ1XHJcbiAgICBwcml2YXRlIGhpdFRlc3QoYW5nbGU6IG51bWJlciwgcmFkaXVzOiBudW1iZXIsIGRlcHRoOiBudW1iZXIpOiB7XHJcbiAgICAgICAgZGVwdGg6IG51bWJlcjtcclxuICAgICAgICBwYXJlbnRDaGlsZHJlbjogSGVhZGluZ05vZGVbXTtcclxuICAgICAgICBvcmlnaW5hbEluZGV4OiBudW1iZXI7XHJcbiAgICAgICAgbm9kZTogSGVhZGluZ05vZGU7XHJcbiAgICB9IHwgbnVsbCB7XHJcbiAgICAgICAgaWYgKGRlcHRoIDwgMCB8fCBkZXB0aCA+IHRoaXMubWF4RGVwdGgpIHJldHVybiBudWxsO1xyXG4gICAgICAgIGNvbnN0IHRvdGFsUmFkaXVzID0gMzUwO1xyXG4gICAgICAgIGNvbnN0IHJhZGl1c1N0ZXAgPSB0b3RhbFJhZGl1cyAvIHRoaXMubWF4RGVwdGg7XHJcbiAgICAgICAgY29uc3QgaW5uZXJSYWRpdXMgPSBkZXB0aCAqIHJhZGl1c1N0ZXA7XHJcbiAgICAgICAgY29uc3Qgb3V0ZXJSYWRpdXMgPSBpbm5lclJhZGl1cyArIHJhZGl1c1N0ZXA7XHJcbiAgICAgICAgaWYgKHJhZGl1cyA8IGlubmVyUmFkaXVzIHx8IHJhZGl1cyA+IG91dGVyUmFkaXVzKSByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgY29uc3Qgc2VhcmNoUGFyZW50ID0gKFxyXG4gICAgICAgICAgICBub2RlczogSGVhZGluZ05vZGVbXSxcclxuICAgICAgICAgICAgc3RhcnRBbmdsZTogbnVtYmVyLFxyXG4gICAgICAgICAgICBlbmRBbmdsZTogbnVtYmVyLFxyXG4gICAgICAgICAgICBjdXJyZW50RGVwdGg6IG51bWJlclxyXG4gICAgICAgICk6IHsgcGFyZW50Q2hpbGRyZW46IEhlYWRpbmdOb2RlW107IHN0YXJ0QW5nbGU6IG51bWJlcjsgZW5kQW5nbGU6IG51bWJlciB9IHwgbnVsbCA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50RGVwdGggPT09IGRlcHRoIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgcGFyZW50Q2hpbGRyZW46IG5vZGVzLCBzdGFydEFuZ2xlLCBlbmRBbmdsZSB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGxheWVyT2Zmc2V0ID0gdGhpcy5sYXllclJvdGF0aW9ucy5nZXQoY3VycmVudERlcHRoKSB8fCAwO1xyXG4gICAgICAgICAgICBjb25zdCBhZGp1c3RlZFN0YXJ0ID0gc3RhcnRBbmdsZSArIGxheWVyT2Zmc2V0O1xyXG4gICAgICAgICAgICBjb25zdCBhZGp1c3RlZEVuZCA9IGVuZEFuZ2xlICsgbGF5ZXJPZmZzZXQ7XHJcbiAgICAgICAgICAgIGNvbnN0IHRvdGFsQW5nbGUgPSBhZGp1c3RlZEVuZCAtIGFkanVzdGVkU3RhcnQ7XHJcbiAgICAgICAgICAgIGNvbnN0IGFuZ2xlUGVyTm9kZSA9IHRvdGFsQW5nbGUgLyBub2Rlcy5sZW5ndGg7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBub2Rlc1tpXTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkU3RhcnQgPSBhZGp1c3RlZFN0YXJ0ICsgaSAqIGFuZ2xlUGVyTm9kZTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkRW5kID0gY2hpbGRTdGFydCArIGFuZ2xlUGVyTm9kZTtcclxuICAgICAgICAgICAgICAgIGlmIChub2RlLmNoaWxkcmVuLmxlbmd0aCA+IDAgJiYgY3VycmVudERlcHRoIDwgZGVwdGggLSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gc2VhcmNoUGFyZW50KG5vZGUuY2hpbGRyZW4sIGNoaWxkU3RhcnQsIGNoaWxkRW5kLCBjdXJyZW50RGVwdGggKyAxKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0KSByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmIChkZXB0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBjb25zdCBsYXllck9mZnNldCA9IHRoaXMubGF5ZXJSb3RhdGlvbnMuZ2V0KDApIHx8IDA7XHJcbiAgICAgICAgICAgIGNvbnN0IGFkanVzdGVkU3RhcnQgPSBsYXllck9mZnNldDtcclxuICAgICAgICAgICAgY29uc3QgYWRqdXN0ZWRFbmQgPSAyICogTWF0aC5QSSArIGxheWVyT2Zmc2V0O1xyXG4gICAgICAgICAgICBjb25zdCB0b3RhbEFuZ2xlID0gYWRqdXN0ZWRFbmQgLSBhZGp1c3RlZFN0YXJ0O1xyXG4gICAgICAgICAgICBjb25zdCBhbmdsZVBlck5vZGUgPSB0b3RhbEFuZ2xlIC8gdGhpcy5yb290cy5sZW5ndGg7XHJcbiAgICAgICAgICAgIGNvbnN0IGxvY2FsQW5nbGUgPSAoKGFuZ2xlIC0gYWRqdXN0ZWRTdGFydCkgJSAoMiAqIE1hdGguUEkpICsgMiAqIE1hdGguUEkpICUgKDIgKiBNYXRoLlBJKTtcclxuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBNYXRoLmZsb29yKGxvY2FsQW5nbGUgLyBhbmdsZVBlck5vZGUpO1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggPj0gMCAmJiBpbmRleCA8IHRoaXMucm9vdHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geyBkZXB0aDogMCwgcGFyZW50Q2hpbGRyZW46IHRoaXMucm9vdHMsIG9yaWdpbmFsSW5kZXg6IGluZGV4LCBub2RlOiB0aGlzLnJvb3RzW2luZGV4XSB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcGFyZW50UmVzdWx0ID0gc2VhcmNoUGFyZW50KHRoaXMucm9vdHMsIDAsIDIgKiBNYXRoLlBJLCAwKTtcclxuICAgICAgICBpZiAoIXBhcmVudFJlc3VsdCkgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICAgIGNvbnN0IHsgcGFyZW50Q2hpbGRyZW4sIHN0YXJ0QW5nbGUsIGVuZEFuZ2xlIH0gPSBwYXJlbnRSZXN1bHQ7XHJcbiAgICAgICAgY29uc3QgbGF5ZXJPZmZzZXQgPSB0aGlzLmxheWVyUm90YXRpb25zLmdldChkZXB0aCkgfHwgMDtcclxuICAgICAgICBjb25zdCBhZGp1c3RlZFN0YXJ0ID0gc3RhcnRBbmdsZSArIGxheWVyT2Zmc2V0O1xyXG4gICAgICAgIGNvbnN0IGFkanVzdGVkRW5kID0gZW5kQW5nbGUgKyBsYXllck9mZnNldDtcclxuICAgICAgICBjb25zdCB0b3RhbEFuZ2xlID0gYWRqdXN0ZWRFbmQgLSBhZGp1c3RlZFN0YXJ0O1xyXG4gICAgICAgIGNvbnN0IGFuZ2xlUGVyTm9kZSA9IHRvdGFsQW5nbGUgLyBwYXJlbnRDaGlsZHJlbi5sZW5ndGg7XHJcbiAgICAgICAgY29uc3QgbG9jYWxBbmdsZSA9ICgoYW5nbGUgLSBhZGp1c3RlZFN0YXJ0KSAlICgyICogTWF0aC5QSSkgKyAyICogTWF0aC5QSSkgJSAoMiAqIE1hdGguUEkpO1xyXG4gICAgICAgIGNvbnN0IGluZGV4ID0gTWF0aC5mbG9vcihsb2NhbEFuZ2xlIC8gYW5nbGVQZXJOb2RlKTtcclxuICAgICAgICBpZiAoaW5kZXggPj0gMCAmJiBpbmRleCA8IHBhcmVudENoaWxkcmVuLmxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4geyBkZXB0aCwgcGFyZW50Q2hpbGRyZW4sIG9yaWdpbmFsSW5kZXg6IGluZGV4LCBub2RlOiBwYXJlbnRDaGlsZHJlbltpbmRleF0gfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gU2hpZnQrXHU2MkQ2XHU2MkZEXHU1RjAwXHU1OUNCXHJcbiAgICBwcm90ZWN0ZWQgaGFuZGxlU2hpZnREcmFnU3RhcnQoYW5nbGU6IG51bWJlciwgcmFkaXVzOiBudW1iZXIsIGU6IE1vdXNlRXZlbnQpOiBib29sZWFuIHtcclxuICAgICAgICBjb25zdCBkZXB0aCA9IHRoaXMuZ2V0RGVwdGgocmFkaXVzKTtcclxuICAgICAgICBjb25zdCBoaXQgPSB0aGlzLmhpdFRlc3QoYW5nbGUsIHJhZGl1cywgZGVwdGgpO1xyXG4gICAgICAgIGlmIChoaXQgJiYgZGVwdGggPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm90YXRpbmdEZXB0aE9ySWR4ID0gZGVwdGg7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhZ1RhcmdldCA9IGhpdDtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBTaGlmdCtcdTYyRDZcdTYyRkRcdTc5RkJcdTUyQThcclxuICAgIHByb3RlY3RlZCBoYW5kbGVTaGlmdERyYWdNb3ZlKGFuZ2xlOiBudW1iZXIsIGU6IE1vdXNlRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBkZXB0aCA9IHRoaXMucm90YXRpbmdEZXB0aE9ySWR4O1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRPZmZzZXQgPSB0aGlzLmxheWVyUm90YXRpb25zLmdldChkZXB0aCkgfHwgMDtcclxuICAgICAgICBjb25zdCBkZWx0YSA9IGFuZ2xlIC0gdGhpcy5sYXN0TW91c2VBbmdsZTtcclxuICAgICAgICB0aGlzLmxheWVyUm90YXRpb25zLnNldChkZXB0aCwgY3VycmVudE9mZnNldCArIGRlbHRhKTtcclxuICAgICAgICB0aGlzLmRyYXcoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBTaGlmdCtcdTYyRDZcdTYyRkRcdTdFRDNcdTY3NUZcdUZGMUFcdTVGQUFcdTczQUZcdTc5RkJcdTRGNERcdThCRTVcdTVDNDJcclxuICAgIHByb3RlY3RlZCBoYW5kbGVTaGlmdERyYWdFbmQoKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgZGVwdGggPSB0aGlzLnJvdGF0aW5nRGVwdGhPcklkeDtcclxuICAgICAgICBpZiAodGhpcy5kcmFnVGFyZ2V0ICYmIHRoaXMuZHJhZ1RhcmdldC5wYXJlbnRDaGlsZHJlbi5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhcmVudENoaWxkcmVuID0gdGhpcy5kcmFnVGFyZ2V0LnBhcmVudENoaWxkcmVuO1xyXG4gICAgICAgICAgICBjb25zdCBhbmdsZVBlck5vZGUgPSAoMiAqIE1hdGguUEkpIC8gcGFyZW50Q2hpbGRyZW4ubGVuZ3RoO1xyXG4gICAgICAgICAgICBjb25zdCBvZmZzZXQgPSB0aGlzLmxheWVyUm90YXRpb25zLmdldChkZXB0aCkgfHwgMDtcclxuICAgICAgICAgICAgY29uc3Qgc3RlcHMgPSBNYXRoLnJvdW5kKG9mZnNldCAvIGFuZ2xlUGVyTm9kZSk7XHJcbiAgICAgICAgICAgIGlmIChzdGVwcyAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgbm9ybWFsaXplZFN0ZXBzID0gKChzdGVwcyAlIHBhcmVudENoaWxkcmVuLmxlbmd0aCkgKyBwYXJlbnRDaGlsZHJlbi5sZW5ndGgpICUgcGFyZW50Q2hpbGRyZW4ubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbW92ZWQgPSBwYXJlbnRDaGlsZHJlbi5zcGxpY2UoMCwgbm9ybWFsaXplZFN0ZXBzKTtcclxuICAgICAgICAgICAgICAgIHBhcmVudENoaWxkcmVuLnB1c2goLi4ubW92ZWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXllclJvdGF0aW9ucy5zZXQoZGVwdGgsIG9mZnNldCAtIHN0ZXBzICogYW5nbGVQZXJOb2RlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHJhdygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZHJhZ1RhcmdldCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5yb3RhdGluZ0RlcHRoT3JJZHggPSAtMTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBcdTdFRDhcdTUyMzZcclxuICAgIHB1YmxpYyBkcmF3KCkge1xyXG4gICAgICAgIGlmICghdGhpcy5jdHggfHwgdGhpcy5yb290cy5sZW5ndGggPT09IDApIHJldHVybjtcclxuICAgICAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG4gICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9ICcjMWUxZTJmJztcclxuICAgICAgICB0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHRvdGFsUmFkaXVzID0gMzUwO1xyXG4gICAgICAgIGNvbnN0IHJhZGl1c1N0ZXAgPSB0b3RhbFJhZGl1cyAvIHRoaXMubWF4RGVwdGg7XHJcblxyXG4gICAgICAgIHRoaXMuY3R4LnNhdmUoKTtcclxuICAgICAgICB0aGlzLmN0eC50cmFuc2xhdGUodGhpcy5jZW50ZXJYLCB0aGlzLmNlbnRlclkpO1xyXG4gICAgICAgIHRoaXMuY3R4LnJvdGF0ZSh0aGlzLnJvdGF0aW9uKTtcclxuICAgICAgICB0aGlzLmN0eC50cmFuc2xhdGUoLXRoaXMuY2VudGVyWCwgLXRoaXMuY2VudGVyWSk7XHJcblxyXG4gICAgICAgIHRoaXMudGV4dFpvbmVzID0gW107XHJcbiAgICAgICAgdGhpcy5kcmF3QXJjKHRoaXMucm9vdHMsIDAsIDIgKiBNYXRoLlBJLCAwLCByYWRpdXNTdGVwKTtcclxuICAgICAgICB0aGlzLmN0eC5yZXN0b3JlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gXHU5MDEyXHU1RjUyXHU3RUQ4XHU1MjM2XHU1RjI3XHJcbiAgICBwcml2YXRlIGRyYXdBcmMoXHJcbiAgICAgICAgbm9kZXM6IEhlYWRpbmdOb2RlW10sXHJcbiAgICAgICAgc3RhcnRBbmdsZTogbnVtYmVyLFxyXG4gICAgICAgIGVuZEFuZ2xlOiBudW1iZXIsXHJcbiAgICAgICAgZGVwdGg6IG51bWJlcixcclxuICAgICAgICByYWRpdXNTdGVwOiBudW1iZXIsXHJcbiAgICApIHtcclxuICAgICAgICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSByZXR1cm47XHJcbiAgICAgICAgY29uc3QgaW5uZXJSYWRpdXMgPSBkZXB0aCAqIHJhZGl1c1N0ZXA7XHJcbiAgICAgICAgY29uc3Qgb3V0ZXJSYWRpdXMgPSBpbm5lclJhZGl1cyArIHJhZGl1c1N0ZXA7XHJcbiAgICAgICAgY29uc3QgdG90YWxBbmdsZSA9IGVuZEFuZ2xlIC0gc3RhcnRBbmdsZTtcclxuICAgICAgICBjb25zdCBsYXllck9mZnNldCA9IHRoaXMubGF5ZXJSb3RhdGlvbnMuZ2V0KGRlcHRoKSB8fCAwO1xyXG4gICAgICAgIGNvbnN0IGFkanVzdGVkU3RhcnQgPSBzdGFydEFuZ2xlICsgbGF5ZXJPZmZzZXQ7XHJcbiAgICAgICAgY29uc3QgYWRqdXN0ZWRFbmQgPSBlbmRBbmdsZSArIGxheWVyT2Zmc2V0O1xyXG4gICAgICAgIGNvbnN0IGFuZ2xlUGVyTm9kZSA9IHRvdGFsQW5nbGUgLyBub2Rlcy5sZW5ndGg7XHJcblxyXG4gICAgICAgIGNvbnN0IHRoZW1lQ29sb3JzID0gdGhpcy5nZXRUaGVtZUNvbG9ycygpO1xyXG4gICAgICAgIGNvbnN0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShkb2N1bWVudC5ib2R5KTtcclxuICAgICAgICBjb25zdCBiZ0NvbG9yID0gc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgnLS1iYWNrZ3JvdW5kLXByaW1hcnknKS50cmltKCkgfHwgJyMxZTFlMmYnO1xyXG4gICAgICAgIGNvbnN0IHRleHRDb2xvciA9IHN0eWxlLmdldFByb3BlcnR5VmFsdWUoJy0tdGV4dC1ub3JtYWwnKS50cmltKCkgfHwgJyNmZmZmZmYnO1xyXG5cclxuICAgICAgICBub2Rlcy5mb3JFYWNoKChub2RlLCBpKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGExID0gYWRqdXN0ZWRTdGFydCArIGkgKiBhbmdsZVBlck5vZGU7XHJcbiAgICAgICAgICAgIGNvbnN0IGEyID0gYTEgKyBhbmdsZVBlck5vZGU7XHJcblxyXG4gICAgICAgICAgICAvLyBcdTdFRDhcdTUyMzZcdTYyNDdcdTVGNjJcclxuICAgICAgICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIHRoaXMuY3R4LmFyYyh0aGlzLmNlbnRlclgsIHRoaXMuY2VudGVyWSwgb3V0ZXJSYWRpdXMsIGExLCBhMik7XHJcbiAgICAgICAgICAgIHRoaXMuY3R4LmFyYyh0aGlzLmNlbnRlclgsIHRoaXMuY2VudGVyWSwgaW5uZXJSYWRpdXMsIGEyLCBhMSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuY3R4LmNsb3NlUGF0aCgpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgY29sb3JJbmRleCA9IGRlcHRoICUgdGhlbWVDb2xvcnMubGVuZ3RoO1xyXG4gICAgICAgICAgICBjb25zdCBmaWxsQ29sb3IgPSB0aGVtZUNvbG9yc1tjb2xvckluZGV4XTtcclxuXHJcbiAgICAgICAgICAgIGlmIChkZXB0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gZmlsbENvbG9yO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdHguZ2xvYmFsQWxwaGEgPSAwLjk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBmaWxsQ29sb3I7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN0eC5nbG9iYWxBbHBoYSA9IDAuNzU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuY3R4LmZpbGwoKTtcclxuICAgICAgICAgICAgdGhpcy5jdHguZ2xvYmFsQWxwaGEgPSAxLjA7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IGJnQ29sb3I7XHJcbiAgICAgICAgICAgIHRoaXMuY3R4LmxpbmVXaWR0aCA9IDEuNTtcclxuICAgICAgICAgICAgdGhpcy5jdHguc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoYW5nbGVQZXJOb2RlID4gMC4wNSAmJiBvdXRlclJhZGl1cyAtIGlubmVyUmFkaXVzID4gMTIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG1pZEFuZ2xlID0gKGExICsgYTIpIC8gMjtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG1pZFJhZGl1cyA9IChpbm5lclJhZGl1cyArIG91dGVyUmFkaXVzKSAvIDI7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB3b3JsZFggPSB0aGlzLmNlbnRlclggKyBtaWRSYWRpdXMgKiBNYXRoLmNvcyhtaWRBbmdsZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB3b3JsZFkgPSB0aGlzLmNlbnRlclkgKyBtaWRSYWRpdXMgKiBNYXRoLnNpbihtaWRBbmdsZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgY29zUiA9IE1hdGguY29zKHRoaXMucm90YXRpb24pO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2luUiA9IE1hdGguc2luKHRoaXMucm90YXRpb24pO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZHggPSB3b3JsZFggLSB0aGlzLmNlbnRlclg7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkeSA9IHdvcmxkWSAtIHRoaXMuY2VudGVyWTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNjcmVlblggPSB0aGlzLmNlbnRlclggKyBkeCAqIGNvc1IgLSBkeSAqIHNpblI7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzY3JlZW5ZID0gdGhpcy5jZW50ZXJZICsgZHggKiBzaW5SICsgZHkgKiBjb3NSO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuY3R4LnNhdmUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3R4LnRyYW5zbGF0ZSh3b3JsZFgsIHdvcmxkWSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN0eC5yb3RhdGUobWlkQW5nbGUgKyBNYXRoLlBJIC8gMik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN0eC5mb250ID0gJ2JvbGQgMTJweCBcIk1pY3Jvc29mdCBZYUhlaVwiLCBTaW1IZWksIHNhbnMtc2VyaWYnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gdGV4dENvbG9yO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdHgudGV4dEFsaWduID0gJ2NlbnRlcic7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN0eC50ZXh0QmFzZWxpbmUgPSAnbWlkZGxlJztcclxuICAgICAgICAgICAgICAgIHRoaXMuY3R4LmZpbGxUZXh0KG5vZGUudGV4dC5zdWJzdHJpbmcoMCwgOCksIDAsIDApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdHgucmVzdG9yZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMudGV4dFpvbmVzLnB1c2goeyB4OiBzY3JlZW5YLCB5OiBzY3JlZW5ZLCBkZXB0aCwgaW5kZXg6IGksIG5vZGUgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChub2RlLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHJhd0FyYyhub2RlLmNoaWxkcmVuLCBhMSwgYTIsIGRlcHRoICsgMSwgcmFkaXVzU3RlcCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBcdTgzQjdcdTUzRDZcdTRFM0JcdTk4OThcdTgyNzJcdTY1NzBcdTdFQzRcclxuICAgIHByaXZhdGUgZ2V0VGhlbWVDb2xvcnMoKTogc3RyaW5nW10ge1xyXG4gICAgICAgIGNvbnN0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShkb2N1bWVudC5ib2R5KTtcclxuICAgICAgICBjb25zdCBhY2NlbnQgPSBzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCctLWludGVyYWN0aXZlLWFjY2VudCcpLnRyaW0oKSB8fCAnIzdmNmRmMic7XHJcbiAgICAgICAgY29uc3QgdGV4dEFjY2VudCA9IHN0eWxlLmdldFByb3BlcnR5VmFsdWUoJy0tdGV4dC1hY2NlbnQnKS50cmltKCkgfHwgYWNjZW50O1xyXG4gICAgICAgIGNvbnN0IGJnMSA9IHN0eWxlLmdldFByb3BlcnR5VmFsdWUoJy0tYmFja2dyb3VuZC1wcmltYXJ5JykudHJpbSgpIHx8ICcjMWUxZTJmJztcclxuICAgICAgICBjb25zdCBiZzIgPSBzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCctLWJhY2tncm91bmQtc2Vjb25kYXJ5JykudHJpbSgpIHx8ICcjMjUyNTMyJztcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBhY2NlbnQsXHJcbiAgICAgICAgICAgIHRleHRBY2NlbnQsXHJcbiAgICAgICAgICAgIHRoaXMuYWRqdXN0Q29sb3IoYWNjZW50LCAwLjgpLFxyXG4gICAgICAgICAgICB0aGlzLmFkanVzdENvbG9yKHRleHRBY2NlbnQsIDEuMiksXHJcbiAgICAgICAgICAgIHRoaXMuYWRqdXN0Q29sb3IoYmcyLCAxLjMpLFxyXG4gICAgICAgICAgICB0aGlzLmFkanVzdENvbG9yKGJnMSwgMS41KSxcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYWRqdXN0Q29sb3IoY29sb3I6IHN0cmluZywgZmFjdG9yOiBudW1iZXIpOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IHJnYk1hdGNoID0gY29sb3IubWF0Y2goL3JnYmE/XFwoKFxcZCspLFxccyooXFxkKyksXFxzKihcXGQrKS8pO1xyXG4gICAgICAgIGlmIChyZ2JNYXRjaCkge1xyXG4gICAgICAgICAgICBsZXQgciA9IE1hdGgubWluKDI1NSwgTWF0aC5yb3VuZChwYXJzZUludChyZ2JNYXRjaFsxXSkgKiBmYWN0b3IpKTtcclxuICAgICAgICAgICAgbGV0IGcgPSBNYXRoLm1pbigyNTUsIE1hdGgucm91bmQocGFyc2VJbnQocmdiTWF0Y2hbMl0pICogZmFjdG9yKSk7XHJcbiAgICAgICAgICAgIGxldCBiID0gTWF0aC5taW4oMjU1LCBNYXRoLnJvdW5kKHBhcnNlSW50KHJnYk1hdGNoWzNdKSAqIGZhY3RvcikpO1xyXG4gICAgICAgICAgICByZXR1cm4gYHJnYigke3J9LCAke2d9LCAke2J9KWA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjb2xvcjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBcdTUzQ0NcdTUxRkJcdTdGMTZcdThGOTFcdTY4MDdcdTk4OThcclxuICAgIHByb3RlY3RlZCBhc3luYyBoYW5kbGVEYmxDbGljayhlOiBNb3VzZUV2ZW50KTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgY29uc3QgcmVjdCA9IHRoaXMuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgIGNvbnN0IHN4ID0gdGhpcy5jYW52YXMud2lkdGggLyByZWN0LndpZHRoO1xyXG4gICAgICAgIGNvbnN0IHN5ID0gdGhpcy5jYW52YXMuaGVpZ2h0IC8gcmVjdC5oZWlnaHQ7XHJcbiAgICAgICAgY29uc3QgbXggPSAoZS5jbGllbnRYIC0gcmVjdC5sZWZ0KSAqIHN4O1xyXG4gICAgICAgIGNvbnN0IG15ID0gKGUuY2xpZW50WSAtIHJlY3QudG9wKSAqIHN5O1xyXG5cclxuICAgICAgICBsZXQgaGl0OiB7IHg6IG51bWJlcjsgeTogbnVtYmVyOyBkZXB0aDogbnVtYmVyOyBpbmRleDogbnVtYmVyOyBub2RlOiBIZWFkaW5nTm9kZSB9IHwgbnVsbCA9IG51bGw7XHJcbiAgICAgICAgbGV0IG1pbkRpc3QgPSAyMDtcclxuICAgICAgICBmb3IgKGNvbnN0IHpvbmUgb2YgdGhpcy50ZXh0Wm9uZXMpIHtcclxuICAgICAgICAgICAgY29uc3QgZHggPSB6b25lLnggLSBteCwgZHkgPSB6b25lLnkgLSBteTtcclxuICAgICAgICAgICAgY29uc3QgZGlzdCA9IE1hdGguaHlwb3QoZHgsIGR5KTtcclxuICAgICAgICAgICAgaWYgKGRpc3QgPCBtaW5EaXN0KSB7XHJcbiAgICAgICAgICAgICAgICBtaW5EaXN0ID0gZGlzdDtcclxuICAgICAgICAgICAgICAgIGhpdCA9IHpvbmU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGhpdCAmJiBoaXQubm9kZS5maWxlICYmIGhpdC5ub2RlLmxpbmUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBjb25zdCBub2RlID0gaGl0Lm5vZGU7XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld1RleHQgPSBhd2FpdCB0aGlzLnByb21wdEZvclRleHQobm9kZS50ZXh0KTtcclxuICAgICAgICAgICAgaWYgKG5ld1RleHQgIT09IG51bGwgJiYgbmV3VGV4dCAhPT0gbm9kZS50ZXh0KSB7XHJcbiAgICAgICAgICAgICAgICBub2RlLnRleHQgPSBuZXdUZXh0O1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcHJlZml4ID0gJyMnLnJlcGVhdChub2RlLmxldmVsKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1JhdyA9IGAke3ByZWZpeH0gJHtuZXdUZXh0fWA7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnVwZGF0ZUhlYWRpbmdJbkZpbGUobm9kZS5maWxlISwgbm9kZS5saW5lISwgbmV3UmF3KTtcclxuICAgICAgICAgICAgICAgIG5vZGUucmF3TGluZSA9IG5ld1JhdztcclxuICAgICAgICAgICAgICAgIHRoaXMuZHJhdygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYXN5bmMgdXBkYXRlSGVhZGluZ0luRmlsZShmaWxlOiBURmlsZSwgbGluZTogbnVtYmVyLCBuZXdSYXc6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCB0aGlzLnBsdWdpbi5hcHAudmF1bHQucmVhZChmaWxlKTtcclxuICAgICAgICBjb25zdCBsaW5lcyA9IGNvbnRlbnQuc3BsaXQoJ1xcbicpO1xyXG4gICAgICAgIGlmIChsaW5lIDwgMCB8fCBsaW5lID49IGxpbmVzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBuZXcgTm90aWNlKCdcdTg4NENcdTUzRjdcdTY1RTBcdTY1NDhcdUZGMENcdTY1RTBcdTZDRDVcdTY2RjRcdTY1QjAnKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsaW5lc1tsaW5lXSA9IG5ld1JhdztcclxuICAgICAgICBjb25zdCBuZXdDb250ZW50ID0gbGluZXMuam9pbignXFxuJyk7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uYXBwLnZhdWx0Lm1vZGlmeShmaWxlLCBuZXdDb250ZW50KTtcclxuICAgICAgICBuZXcgTm90aWNlKCdcdTY4MDdcdTk4OThcdTVERjJcdTY2RjRcdTY1QjAnKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHByb21wdEZvclRleHQoY3VycmVudDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG1vZGFsID0gbmV3IEVkaXRUZXh0TW9kYWwodGhpcy5wbHVnaW4uYXBwLCBjdXJyZW50LCByZXNvbHZlKTtcclxuICAgICAgICAgICAgbW9kYWwub3BlbigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyBcdTgzQjdcdTUzRDZcdTY1ODdcdTRFRjZcdTY4MDdcdTk4OThcdTg4NENcdUZGMDhcdTY0M0FcdTVFMjZcdTY1ODdcdTRFRjZcdTVGMTVcdTc1MjhcdUZGMDlcclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEhlYWRpbmdzRnJvbUZpbGUoXHJcbiAgICBmaWxlOiBURmlsZSxcclxuICAgIHBsdWdpbjogTHVvcGFuSW50ZWdyYXRlZFBsdWdpblxyXG4pOiBQcm9taXNlPEhlYWRpbmdSYXdbXT4ge1xyXG4gICAgY29uc3QgY2FjaGUgPSBwbHVnaW4uYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0RmlsZUNhY2hlKGZpbGUpO1xyXG4gICAgY29uc3QgbGluZXMgPSAoYXdhaXQgcGx1Z2luLmFwcC52YXVsdC5yZWFkKGZpbGUpKS5zcGxpdCgnXFxuJyk7XHJcbiAgICBpZiAoIWNhY2hlPy5oZWFkaW5ncykgcmV0dXJuIFtdO1xyXG4gICAgcmV0dXJuIGNhY2hlLmhlYWRpbmdzLm1hcChoID0+ICh7XHJcbiAgICAgICAgbGV2ZWw6IGgubGV2ZWwsXHJcbiAgICAgICAgdGV4dDogaC5oZWFkaW5nLFxyXG4gICAgICAgIGxpbmU6IGgucG9zaXRpb24uc3RhcnQubGluZSxcclxuICAgICAgICByYXc6IGxpbmVzW2gucG9zaXRpb24uc3RhcnQubGluZV0sXHJcbiAgICAgICAgZmlsZTogZmlsZSxcclxuICAgIH0pKTtcclxufSJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFBQUEsbUJBS087OztBQ01BLElBQU0sbUJBQW1DO0FBQUEsRUFDNUMsZUFBZTtBQUFBLEVBQ2Ysb0JBQW9CO0FBQUEsRUFDcEIsZUFBZTtBQUFBO0FBQUEsRUFDZixXQUFXO0FBQUE7QUFBQSxFQUNYLG1CQUFtQjtBQUFBO0FBQ3ZCO0FBa0JPLElBQU0sZUFBMkI7QUFBQSxFQUNwQyxRQUFRO0FBQUEsSUFDSixFQUFFLE1BQU0sZ0JBQU0sT0FBTyxDQUFDLFVBQUssUUFBRyxFQUFFO0FBQUEsSUFDaEMsRUFBRSxNQUFNLGdCQUFNLE9BQU8sQ0FBQyxnQkFBTSxnQkFBTSxnQkFBTSxjQUFJLEVBQUU7QUFBQSxJQUM5QyxFQUFFLE1BQU0sZ0JBQU0sT0FBTyxDQUFDLFVBQUssVUFBSyxVQUFLLFVBQUssVUFBSyxVQUFLLFVBQUssUUFBRyxFQUFFO0FBQUEsRUFDbEU7QUFBQSxFQUNBLFlBQVk7QUFBQSxFQUNaLFlBQVk7QUFBQSxFQUNaLFlBQVk7QUFBQSxFQUNaLFNBQVM7QUFDYjs7O0FDekNPLFNBQVMsa0JBQWtCLFFBQW1DO0FBQ2pFLFFBQU0sUUFBUSxPQUFPLE1BQU0sT0FBTztBQUNsQyxRQUFNLFNBQVMsQ0FBQztBQUNoQixRQUFNLFFBQVE7QUFDZCxhQUFXLFFBQVEsT0FBTztBQUN0QixVQUFNLFVBQVUsS0FBSyxLQUFLO0FBQzFCLFFBQUksWUFBWSxHQUFJO0FBQ3BCLFVBQU0sUUFBUSxRQUFRLE1BQU0sS0FBSztBQUNqQyxRQUFJLENBQUMsTUFBTztBQUNaLFVBQU0sT0FBTyxNQUFNLENBQUM7QUFDcEIsVUFBTSxXQUFXLE1BQU0sQ0FBQztBQUN4QixVQUFNLFFBQVEsU0FBUyxNQUFNLEdBQUcsRUFBRSxJQUFJLE9BQUssRUFBRSxLQUFLLENBQUMsRUFBRSxPQUFPLE9BQUssTUFBTSxFQUFFO0FBQ3pFLFFBQUksTUFBTSxTQUFTLEdBQUc7QUFDbEIsYUFBTyxLQUFLLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFBQSxJQUMvQjtBQUFBLEVBQ0o7QUFDQSxNQUFJLE9BQU8sV0FBVyxFQUFHLFFBQU87QUFDaEMsU0FBTyxFQUFFLEdBQUcsY0FBYyxRQUFRLFNBQVMsU0FBUztBQUN4RDtBQUdPLFNBQVMsZ0JBQWdCLFFBQW1DO0FBQy9ELE1BQUk7QUFDQSxVQUFNLE9BQU8sS0FBSyxNQUFNLE9BQU8sS0FBSyxDQUFDO0FBQ3JDLFFBQUksQ0FBQyxLQUFLLFVBQVUsQ0FBQyxNQUFNLFFBQVEsS0FBSyxNQUFNLEVBQUcsUUFBTztBQUN4RCxXQUFPLEVBQUUsR0FBRyxjQUFjLEdBQUcsTUFBTSxTQUFTLE9BQU87QUFBQSxFQUN2RCxTQUFRO0FBQ0osV0FBTztBQUFBLEVBQ1g7QUFDSjtBQUdPLFNBQVMsZ0JBQWdCLFFBQW1DO0FBQy9ELFFBQU0sVUFBVSxPQUFPLEtBQUs7QUFDNUIsTUFBSSxRQUFRLFdBQVcsR0FBRyxHQUFHO0FBQ3pCLFdBQU8sZ0JBQWdCLE9BQU87QUFBQSxFQUNsQyxPQUFPO0FBQ0gsV0FBTyxrQkFBa0IsT0FBTztBQUFBLEVBQ3BDO0FBQ0o7QUFHTyxTQUFTLG9CQUFvQixNQUFrQixTQUE0QixLQUFLLFdBQVcsUUFBZ0I7QUFDOUcsTUFBSSxXQUFXLFVBQVU7QUFDckIsVUFBTSxRQUFRLEtBQUssT0FBTyxJQUFJLFdBQVM7QUFDbkMsWUFBTSxXQUFXLE1BQU0sTUFBTSxLQUFLLElBQUk7QUFDdEMsYUFBTyxHQUFHLE1BQU0sSUFBSSxNQUFNLFFBQVE7QUFBQSxJQUN0QyxDQUFDO0FBQ0QsV0FBTyxNQUFNLEtBQUssSUFBSTtBQUFBLEVBQzFCLE9BQU87QUFDSCxVQUFNLFNBQVM7QUFBQSxNQUNYLFFBQVEsS0FBSztBQUFBLE1BQ2IsWUFBWSxLQUFLO0FBQUEsTUFDakIsWUFBWSxLQUFLO0FBQUEsTUFDakIsWUFBWSxLQUFLO0FBQUEsSUFDckI7QUFDQSxXQUFPLEtBQUssVUFBVSxRQUFRLE1BQU0sQ0FBQztBQUFBLEVBQ3pDO0FBQ0o7QUFHQSxlQUFzQixnQkFBZ0IsTUFBYSxXQUFtQixTQUFxQixRQUFnQjtBQUN2RyxRQUFNLFNBQVMsUUFBUSxXQUFXO0FBQ2xDLFFBQU0sWUFBWSxvQkFBb0IsU0FBUyxNQUFNO0FBQ3JELFFBQU0sVUFBVSxNQUFNLE9BQU8sSUFBSSxNQUFNLEtBQUssSUFBSTtBQUNoRCxRQUFNLFVBQVUsUUFBUSxRQUFRO0FBQUEsRUFBaUIsU0FBUztBQUFBLFNBQVk7QUFBQSxFQUFpQixTQUFTO0FBQUEsT0FBVTtBQUMxRyxNQUFJLFlBQVksU0FBUztBQUNyQixVQUFNLE9BQU8sSUFBSSxNQUFNLE9BQU8sTUFBTSxPQUFPO0FBQUEsRUFDL0M7QUFDSjtBQVdPLFNBQVMsdUJBQXVCLGFBQXFDO0FBQ3hFLFFBQU0sYUFBYSxDQUFDLGdCQUFNLGdCQUFNLGdCQUFNLGdCQUFNLGdCQUFNLGdCQUFNLGdCQUFNLDBCQUFNO0FBQ3BFLFFBQU0sU0FBUyxDQUFDO0FBQ2hCLGFBQVcsUUFBUSxZQUFZO0FBQzNCLFVBQU0sUUFBUSxZQUFZLElBQUk7QUFDOUIsUUFBSSxNQUFNLFFBQVEsS0FBSyxLQUFLLE1BQU0sU0FBUyxHQUFHO0FBQzFDLGFBQU8sS0FBSyxFQUFFLE1BQU0sT0FBTyxNQUFNLElBQUksTUFBTSxFQUFFLENBQUM7QUFBQSxJQUNsRDtBQUFBLEVBQ0o7QUFDQSxNQUFJLE9BQU8sV0FBVyxFQUFHLFFBQU87QUFDaEMsU0FBTyxFQUFFLEdBQUcsY0FBYyxRQUFRLFNBQVMsU0FBUztBQUN4RDs7O0FDOUZPLElBQU0sZUFBdUM7QUFBQSxFQUNoRCxnQkFBTTtBQUFBLEVBQVcsZ0JBQU07QUFBQSxFQUFXLGdCQUFNO0FBQUEsRUFDeEMsZ0JBQU07QUFBQSxFQUFXLGdCQUFNO0FBQUEsRUFBVyxnQkFBTTtBQUFBLEVBQ3hDLGdCQUFNO0FBQUEsRUFBVyxrQkFBUTtBQUFBLEVBQVcsNEJBQVE7QUFDaEQ7OztBQ0xBLHNCQUEyQjtBQUVwQixJQUFNLGdCQUFOLGNBQTRCLHNCQUFNO0FBQUEsRUFLckMsWUFBWSxLQUFVLFNBQWlCLFNBQXlDO0FBQzVFLFVBQU0sR0FBRztBQUxiLHdCQUFRO0FBQ1Isd0JBQVE7QUFDUix3QkFBUTtBQUlKLFNBQUssVUFBVTtBQUNmLFNBQUssVUFBVTtBQUFBLEVBQ25CO0FBQUEsRUFFQSxTQUFTO0FBQ0wsVUFBTSxFQUFFLFVBQVUsSUFBSTtBQUN0QixjQUFVLFNBQVMsTUFBTSxFQUFFLE1BQU0sdUNBQVMsQ0FBQztBQUMzQyxTQUFLLFVBQVUsVUFBVSxTQUFTLFNBQVMsRUFBRSxPQUFPLEtBQUssUUFBUSxDQUFDO0FBQ2xFLFNBQUssUUFBUSxNQUFNLFFBQVE7QUFDM0IsVUFBTSxZQUFZLFVBQVUsVUFBVSxFQUFFLEtBQUsseUJBQXlCLENBQUM7QUFDdkUsVUFBTSxVQUFVLFVBQVUsU0FBUyxVQUFVLEVBQUUsTUFBTSxlQUFLLENBQUM7QUFDM0QsWUFBUSxpQkFBaUIsU0FBUyxNQUFNO0FBQ3BDLFdBQUssUUFBUSxLQUFLLFFBQVEsS0FBSztBQUMvQixXQUFLLE1BQU07QUFBQSxJQUNmLENBQUM7QUFDRCxVQUFNLFlBQVksVUFBVSxTQUFTLFVBQVUsRUFBRSxNQUFNLGVBQUssQ0FBQztBQUM3RCxjQUFVLGlCQUFpQixTQUFTLE1BQU07QUFDdEMsV0FBSyxRQUFRLElBQUk7QUFDakIsV0FBSyxNQUFNO0FBQUEsSUFDZixDQUFDO0FBQUEsRUFDTDtBQUFBLEVBRUEsVUFBVTtBQUNOLFNBQUssVUFBVSxNQUFNO0FBQUEsRUFDekI7QUFDSjs7O0FDN0JBLElBQUFDLG1CQUFzQzs7O0FDSC9CLElBQWUsc0JBQWYsTUFBbUM7QUFBQSxFQTJCdEMsWUFBWSxXQUF3QjtBQTFCcEMsd0JBQVU7QUFDVix3QkFBVTtBQUNWLHdCQUFVO0FBQ1Ysd0JBQVUsU0FBUTtBQUNsQix3QkFBVSxVQUFTO0FBQ25CLHdCQUFVLFdBQVU7QUFDcEIsd0JBQVUsV0FBVTtBQUdwQjtBQUFBLHdCQUFVLFlBQVc7QUFHckI7QUFBQSx3QkFBVSxjQUFhO0FBQ3ZCLHdCQUFVLG1CQUFrQjtBQUM1Qix3QkFBVSxzQkFBNkI7QUFFdkM7QUFBQSx3QkFBVSxrQkFBaUI7QUFDM0Isd0JBQVUsaUJBQWdCO0FBQzFCLHdCQUFVLGdCQUFlO0FBQ3pCLHdCQUFVLFlBQVc7QUFDckIsd0JBQVUsWUFBVztBQUNyQix3QkFBVSxhQUEyQjtBQUdyQztBQUFBLHdCQUFVLGtCQUFzQyxvQkFBSSxJQUFJO0FBR3BELFNBQUssWUFBWTtBQUFBLEVBQ3JCO0FBQUE7QUFBQSxFQU1VLHFCQUFxQixPQUFlLFFBQWdCLEdBQXdCO0FBQ2xGLFdBQU87QUFBQSxFQUNYO0FBQUE7QUFBQSxFQUdVLG9CQUFvQixPQUFlLEdBQXFCO0FBQUEsRUFBRTtBQUFBO0FBQUEsRUFHMUQscUJBQTJCO0FBQUEsRUFBRTtBQUFBO0FBQUEsRUFNN0IsV0FBVyxnQkFBd0IsY0FBYyxNQUFNO0FBQzdELFNBQUssVUFBVSxNQUFNO0FBQ3JCLFVBQU0sVUFBVSxLQUFLLFVBQVUsVUFBVSxFQUFFLEtBQUssZUFBZSxDQUFDO0FBQ2hFLFNBQUssU0FBUyxRQUFRLFNBQVMsVUFBVTtBQUFBLE1BQ3JDLEtBQUssR0FBRyxjQUFjO0FBQUEsTUFDdEIsTUFBTSxFQUFFLE9BQU8sS0FBSyxPQUFPLFFBQVEsS0FBSyxPQUFPO0FBQUEsSUFDbkQsQ0FBQztBQUNELFNBQUssTUFBTSxLQUFLLE9BQU8sV0FBVyxJQUFJO0FBRXRDLFFBQUksYUFBYTtBQUNiLFlBQU0sV0FBVyxRQUFRLFVBQVUsRUFBRSxLQUFLLGtCQUFrQixDQUFDO0FBQzdELFlBQU0sV0FBVyxTQUFTLFNBQVMsVUFBVSxFQUFFLE1BQU0sMkJBQU8sQ0FBQztBQUM3RCxlQUFTLGlCQUFpQixTQUFTLE1BQU07QUFDckMsYUFBSyxZQUFZO0FBQ2pCLGFBQUssV0FBVztBQUNoQixhQUFLLGVBQWUsTUFBTTtBQUMxQixhQUFLLFdBQVc7QUFDaEIsYUFBSyxLQUFLO0FBQUEsTUFDZCxDQUFDO0FBQUEsSUFDTDtBQUFBLEVBQ0o7QUFBQTtBQUFBLEVBR1UsY0FBYyxHQUF1QjtBQUMzQyxVQUFNLE9BQU8sS0FBSyxPQUFPLHNCQUFzQjtBQUMvQyxVQUFNLEtBQUssS0FBSyxPQUFPLFFBQVEsS0FBSztBQUNwQyxVQUFNLEtBQUssS0FBSyxPQUFPLFNBQVMsS0FBSztBQUNyQyxVQUFNLE1BQU0sRUFBRSxVQUFVLEtBQUssUUFBUSxLQUFLLEtBQUs7QUFDL0MsVUFBTSxNQUFNLEVBQUUsVUFBVSxLQUFLLE9BQU8sS0FBSyxLQUFLO0FBQzlDLFdBQU8sS0FBSyxNQUFNLElBQUksRUFBRTtBQUFBLEVBQzVCO0FBQUEsRUFFVSxlQUFlLEdBQXVCO0FBQzVDLFVBQU0sT0FBTyxLQUFLLE9BQU8sc0JBQXNCO0FBQy9DLFVBQU0sS0FBSyxLQUFLLE9BQU8sUUFBUSxLQUFLO0FBQ3BDLFVBQU0sS0FBSyxLQUFLLE9BQU8sU0FBUyxLQUFLO0FBQ3JDLFVBQU0sTUFBTSxFQUFFLFVBQVUsS0FBSyxRQUFRLEtBQUssS0FBSztBQUMvQyxVQUFNLE1BQU0sRUFBRSxVQUFVLEtBQUssT0FBTyxLQUFLLEtBQUs7QUFDOUMsV0FBTyxLQUFLLE1BQU0sSUFBSSxFQUFFO0FBQUEsRUFDNUI7QUFBQTtBQUFBLEVBR1UsYUFBYTtBQUNuQixVQUFNLGNBQWMsQ0FBQyxNQUFrQjtBQUNuQyxXQUFLLFlBQVk7QUFDakIsWUFBTSxRQUFRLEtBQUssY0FBYyxDQUFDO0FBQ2xDLFlBQU0sU0FBUyxLQUFLLGVBQWUsQ0FBQztBQUVwQyxVQUFJLEVBQUUsWUFBWSxLQUFLLHFCQUFxQixPQUFPLFFBQVEsQ0FBQyxHQUFHO0FBQzNELGFBQUssa0JBQWtCO0FBQ3ZCLGFBQUssaUJBQWlCO0FBQ3RCLGFBQUssT0FBTyxNQUFNLFNBQVM7QUFDM0IsVUFBRSxlQUFlO0FBQ2pCO0FBQUEsTUFDSjtBQUdBLFdBQUssYUFBYTtBQUNsQixXQUFLLGlCQUFpQjtBQUN0QixXQUFLLGdCQUFnQjtBQUNyQixXQUFLLGVBQWUsWUFBWSxJQUFJO0FBQ3BDLFdBQUssT0FBTyxNQUFNLFNBQVM7QUFDM0IsUUFBRSxlQUFlO0FBQUEsSUFDckI7QUFFQSxVQUFNLGNBQWMsQ0FBQyxNQUFrQjtBQUNuQyxVQUFJLEtBQUssaUJBQWlCO0FBQ3RCLGNBQU1DLFlBQVcsS0FBSyxjQUFjLENBQUM7QUFDckMsY0FBTUMsU0FBUUQsWUFBVyxLQUFLO0FBQzlCLGFBQUssb0JBQW9CQSxXQUFVLENBQUM7QUFDcEMsYUFBSyxpQkFBaUJBO0FBQ3RCO0FBQUEsTUFDSjtBQUVBLFVBQUksQ0FBQyxLQUFLLFdBQVk7QUFDdEIsWUFBTSxXQUFXLEtBQUssY0FBYyxDQUFDO0FBQ3JDLFlBQU0sUUFBUSxXQUFXLEtBQUs7QUFDOUIsV0FBSyxZQUFZO0FBQ2pCLFdBQUssaUJBQWlCO0FBQ3RCLFdBQUssS0FBSztBQUVWLFlBQU0sTUFBTSxZQUFZLElBQUk7QUFDNUIsWUFBTSxLQUFLLEtBQUssSUFBSSxNQUFNLE1BQU0sS0FBSyxnQkFBZ0IsR0FBSTtBQUN6RCxVQUFJLEtBQUssTUFBTTtBQUNYLGFBQUssWUFBWSxXQUFXLEtBQUssaUJBQWlCO0FBQ2xELGFBQUssZ0JBQWdCO0FBQ3JCLGFBQUssZUFBZTtBQUFBLE1BQ3hCO0FBQUEsSUFDSjtBQUVBLFVBQU0sWUFBWSxNQUFNO0FBQ3BCLFVBQUksS0FBSyxpQkFBaUI7QUFDdEIsYUFBSyxrQkFBa0I7QUFDdkIsYUFBSyxPQUFPLE1BQU0sU0FBUztBQUMzQixhQUFLLG1CQUFtQjtBQUN4QjtBQUFBLE1BQ0o7QUFFQSxVQUFJLENBQUMsS0FBSyxXQUFZO0FBQ3RCLFdBQUssYUFBYTtBQUNsQixXQUFLLE9BQU8sTUFBTSxTQUFTO0FBQzNCLFVBQUksS0FBSyxJQUFJLEtBQUssUUFBUSxJQUFJLE1BQU07QUFDaEMsYUFBSyxhQUFhO0FBQUEsTUFDdEIsT0FBTztBQUNILGFBQUssV0FBVztBQUFBLE1BQ3BCO0FBQUEsSUFDSjtBQUVBLFVBQU0sYUFBYSxDQUFDLE1BQWtCO0FBQ2xDLFdBQUssZUFBZSxDQUFDO0FBQUEsSUFDekI7QUFFQSxTQUFLLE9BQU8saUJBQWlCLGFBQWEsV0FBVztBQUNyRCxXQUFPLGlCQUFpQixhQUFhLFdBQVc7QUFDaEQsV0FBTyxpQkFBaUIsV0FBVyxTQUFTO0FBQzVDLFNBQUssT0FBTyxpQkFBaUIsWUFBWSxVQUFVO0FBQUEsRUFDdkQ7QUFBQTtBQUFBLEVBR1UsZUFBZTtBQUNyQixRQUFJLEtBQUssVUFBVyxzQkFBcUIsS0FBSyxTQUFTO0FBQ3ZELFFBQUksV0FBVyxZQUFZLElBQUk7QUFDL0IsVUFBTSxPQUFPLENBQUMsUUFBZ0I7QUFDMUIsWUFBTSxLQUFLLEtBQUssSUFBSSxRQUFRLE1BQU0sWUFBWSxHQUFJO0FBQ2xELFVBQUksTUFBTSxHQUFHO0FBQ1QsYUFBSyxZQUFZLHNCQUFzQixJQUFJO0FBQzNDO0FBQUEsTUFDSjtBQUNBLFdBQUssWUFBWSxLQUFLLElBQUksS0FBSyxVQUFVLEtBQUssRUFBRTtBQUNoRCxXQUFLLFlBQVksS0FBSyxXQUFXO0FBQ2pDLFdBQUssS0FBSztBQUNWLGlCQUFXO0FBQ1gsVUFBSSxLQUFLLElBQUksS0FBSyxRQUFRLElBQUksTUFBTztBQUNqQyxhQUFLLFdBQVc7QUFDaEIsYUFBSyxZQUFZO0FBQ2pCO0FBQUEsTUFDSjtBQUNBLFdBQUssWUFBWSxzQkFBc0IsSUFBSTtBQUFBLElBQy9DO0FBQ0EsU0FBSyxZQUFZLHNCQUFzQixJQUFJO0FBQUEsRUFDL0M7QUFBQSxFQUVVLGNBQWM7QUFDcEIsUUFBSSxLQUFLLFdBQVc7QUFDaEIsMkJBQXFCLEtBQUssU0FBUztBQUNuQyxXQUFLLFlBQVk7QUFBQSxJQUNyQjtBQUNBLFNBQUssV0FBVztBQUFBLEVBQ3BCO0FBQUEsRUFFTyxVQUFVO0FBQ2IsU0FBSyxZQUFZO0FBQUEsRUFDckI7QUFDSjs7O0FEcE1PLElBQU0saUJBQU4sY0FBNkIsb0JBQW9CO0FBQUEsRUFnQnBELFlBQ0ksV0FDQSxNQUNBLE1BQ0EsV0FDQSxjQUNBLFFBQ0EsZUFDQSxvQkFDRjtBQUNFLFVBQU0sU0FBUztBQXpCbkIsd0JBQVE7QUFDUix3QkFBUTtBQUNSLHdCQUFRLGFBRUYsQ0FBQztBQUNQLHdCQUFRO0FBQ1Isd0JBQVE7QUFDUix3QkFBUTtBQUNSLHdCQUFRO0FBRVIsd0JBQU87QUFDUCx3QkFBTztBQUVQLHdCQUFRLGlCQUE4RDtBQWFsRSxTQUFLLE9BQU87QUFDWixTQUFLLE9BQU87QUFDWixTQUFLLFlBQVk7QUFDakIsU0FBSyxlQUFlO0FBQ3BCLFNBQUssU0FBUztBQUNkLFNBQUssZ0JBQWdCO0FBQ3JCLFNBQUsscUJBQXFCO0FBQzFCLFNBQUssY0FBYztBQUNuQixTQUFLLFdBQVcsa0JBQWtCO0FBQ2xDLFNBQUssV0FBVztBQUNoQixTQUFLLE9BQU8saUJBQWlCLGFBQWEsS0FBSyxpQkFBaUIsS0FBSyxJQUFJLENBQUM7QUFDMUUsU0FBSyxPQUFPLGlCQUFpQixTQUFTLEtBQUssUUFBUSxLQUFLLElBQUksQ0FBQztBQUM3RCxTQUFLLEtBQUs7QUFBQSxFQUNkO0FBQUEsRUFFUSxnQkFBZ0I7QUFDcEIsVUFBTSxPQUFPLEtBQUssS0FBSyxjQUFjO0FBQ3JDLFVBQU0sT0FBTyxLQUFLLEtBQUssY0FBYztBQUNyQyxTQUFLLFNBQVMsS0FBSyxLQUFLLE9BQU8sSUFBSSxDQUFDLE9BQU8sUUFBUTtBQUMvQyxZQUFNLFNBQVMsT0FBTyxNQUFNO0FBQzVCLFlBQU0sV0FBVyxNQUFNLGFBQ2xCLE1BQU0sTUFBTSxTQUFTLEtBQUssS0FBSyxNQUFNLE1BQU0sU0FBUyxJQUFJLEtBQUs7QUFDbEUsWUFBTSxRQUFRLE1BQU0sU0FBUyxhQUFhLE1BQU0sSUFBSSxLQUFLO0FBQ3pELGFBQU8sRUFBRSxHQUFHLE9BQU8sUUFBUSxVQUFVLE1BQU07QUFBQSxJQUMvQyxDQUFDO0FBQUEsRUFDTDtBQUFBLEVBRVEsY0FBYyxRQUErQjtBQUNqRCxhQUFTLEtBQUssR0FBRyxLQUFLLEtBQUssT0FBTyxRQUFRLE1BQU07QUFDNUMsWUFBTSxRQUFRLE9BQU8sSUFBSSxLQUFLLEtBQUssT0FBTyxLQUFLLENBQUMsRUFBRTtBQUNsRCxZQUFNLFFBQVEsS0FBSyxPQUFPLEVBQUUsRUFBRTtBQUM5QixVQUFJLFVBQVUsU0FBUyxVQUFVLE1BQU8sUUFBTztBQUFBLElBQ25EO0FBQ0EsV0FBTztBQUFBLEVBQ1g7QUFBQSxFQUVVLHFCQUFxQixPQUFlLFFBQWdCLEdBQXdCO0FBQ2xGLFVBQU0sS0FBSyxLQUFLLGNBQWMsTUFBTTtBQUNwQyxRQUFJLE9BQU8sTUFBTTtBQUNiLFdBQUsscUJBQXFCO0FBQzFCLGFBQU87QUFBQSxJQUNYO0FBQ0EsV0FBTztBQUFBLEVBQ1g7QUFBQSxFQUVVLG9CQUFvQixPQUFlLEdBQXFCO0FBQzlELFVBQU0sS0FBSyxLQUFLO0FBQ2hCLFVBQU0sZ0JBQWdCLEtBQUssZUFBZSxJQUFJLEVBQUUsS0FBSztBQUNyRCxVQUFNLFFBQVEsUUFBUSxLQUFLO0FBQzNCLFNBQUssZUFBZSxJQUFJLElBQUksZ0JBQWdCLEtBQUs7QUFDakQsU0FBSyxLQUFLO0FBQUEsRUFDZDtBQUFBLEVBRUEsTUFBZ0IscUJBQW9DO0FBQ2hELFVBQU0sS0FBSyxLQUFLO0FBQ2hCLFVBQU0sUUFBUSxLQUFLLE9BQU8sRUFBRTtBQUM1QixVQUFNLFFBQVEsTUFBTTtBQUNwQixRQUFJLE1BQU0sU0FBUyxHQUFHO0FBQ2xCLFlBQU0sZUFBZ0IsSUFBSSxLQUFLLEtBQU0sTUFBTTtBQUMzQyxZQUFNLFNBQVMsS0FBSyxlQUFlLElBQUksRUFBRSxLQUFLO0FBQzlDLFlBQU0sUUFBUSxLQUFLLE1BQU0sU0FBUyxZQUFZO0FBQzlDLFVBQUksVUFBVSxHQUFHO0FBQ2IsY0FBTSxtQkFBb0IsUUFBUSxNQUFNLFNBQVUsTUFBTSxVQUFVLE1BQU07QUFDeEUsY0FBTSxRQUFRLE1BQU0sT0FBTyxHQUFHLGVBQWU7QUFDN0MsY0FBTSxLQUFLLEdBQUcsS0FBSztBQUNuQixhQUFLLGVBQWUsSUFBSSxJQUFJLFNBQVMsUUFBUSxZQUFZO0FBQ3pELGNBQU0sZ0JBQWdCLEtBQUssTUFBTSxLQUFLLFdBQVcsS0FBSyxNQUFNLEtBQUssTUFBTTtBQUN2RSxhQUFLLFlBQVksb0JBQW9CLEtBQUssTUFBTSxLQUFLLEtBQUssT0FBTztBQUNqRSxhQUFLLEtBQUs7QUFBQSxNQUNkO0FBQUEsSUFDSjtBQUNBLFNBQUsscUJBQXFCO0FBQUEsRUFDOUI7QUFBQSxFQUVPLE9BQU87QUE3R2xCO0FBOEdRLFFBQUksQ0FBQyxLQUFLLElBQUs7QUFFZixVQUFNLFdBQVcsS0FBSyxPQUFPO0FBQzdCLFVBQU0sVUFBVSxTQUFTO0FBQ3pCLFVBQU0sa0JBQWtCLFNBQVMsYUFBYTtBQUM5QyxVQUFNLGFBQWEsU0FBUyxxQkFBcUI7QUFFakQsU0FBSyxJQUFJLFVBQVUsR0FBRyxHQUFHLEtBQUssT0FBTyxLQUFLLE1BQU07QUFDaEQsU0FBSyxJQUFJLFlBQVk7QUFDckIsU0FBSyxJQUFJLFNBQVMsR0FBRyxHQUFHLEtBQUssT0FBTyxLQUFLLE1BQU07QUFHL0MsU0FBSyxJQUFJLEtBQUs7QUFDZCxTQUFLLElBQUksVUFBVSxLQUFLLFNBQVMsS0FBSyxPQUFPO0FBQzdDLFNBQUssSUFBSSxPQUFPLEtBQUssUUFBUTtBQUM3QixTQUFLLElBQUksVUFBVSxDQUFDLEtBQUssU0FBUyxDQUFDLEtBQUssT0FBTztBQUcvQyxRQUFJLEtBQUssb0JBQW9CO0FBQ3pCLGVBQVMsS0FBSyxHQUFHLEtBQUssS0FBSyxPQUFPLFFBQVEsTUFBTTtBQUM1QyxjQUFNLFFBQVEsS0FBSyxPQUFPLEVBQUU7QUFDNUIsY0FBTSxRQUFRLE1BQU0sTUFBTTtBQUMxQixZQUFJLFVBQVUsRUFBRztBQUNqQixjQUFNLFlBQVksTUFBTTtBQUN4QixjQUFNLGNBQWMsS0FBSyxlQUFlLElBQUksRUFBRSxLQUFLO0FBQ25ELGlCQUFTLElBQUksR0FBRyxJQUFJLE9BQU8sS0FBSztBQUM1QixnQkFBTSxNQUFNLElBQUksWUFBYSxjQUFjLE1BQU8sS0FBSztBQUN2RCxnQkFBTSxNQUFPLE1BQU0sS0FBSyxLQUFNO0FBQzlCLGdCQUFNLGNBQWMsTUFBTSxTQUFTO0FBQ25DLGdCQUFNLFlBQVksTUFBTSxTQUFTO0FBQ2pDLGdCQUFNLEtBQUssS0FBSyxVQUFVLGNBQWMsS0FBSyxJQUFJLEdBQUc7QUFDcEQsZ0JBQU0sS0FBSyxLQUFLLFVBQVUsY0FBYyxLQUFLLElBQUksR0FBRztBQUNwRCxnQkFBTSxLQUFLLEtBQUssVUFBVSxZQUFZLEtBQUssSUFBSSxHQUFHO0FBQ2xELGdCQUFNLEtBQUssS0FBSyxVQUFVLFlBQVksS0FBSyxJQUFJLEdBQUc7QUFDbEQsZUFBSyxJQUFJLFVBQVU7QUFDbkIsZUFBSyxJQUFJLE9BQU8sSUFBSSxFQUFFO0FBQ3RCLGVBQUssSUFBSSxPQUFPLElBQUksRUFBRTtBQUN0QixlQUFLLElBQUksY0FBYztBQUN2QixlQUFLLElBQUksWUFBWTtBQUNyQixlQUFLLElBQUksT0FBTztBQUFBLFFBQ3BCO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFHQSxhQUFTLEtBQUssR0FBRyxLQUFLLEtBQUssT0FBTyxRQUFRLE1BQU07QUFDNUMsWUFBTSxRQUFRLEtBQUssT0FBTyxFQUFFO0FBQzVCLFlBQU0sUUFBUSxNQUFNO0FBQ3BCLFlBQU0sUUFBUSxNQUFNO0FBQ3BCLFVBQUksVUFBVSxFQUFHO0FBQ2pCLFlBQU0sWUFBWSxNQUFNO0FBQ3hCLFlBQU0sY0FBYyxLQUFLLGVBQWUsSUFBSSxFQUFFLEtBQUs7QUFFbkQsZUFBUyxJQUFJLEdBQUcsSUFBSSxPQUFPLEtBQUs7QUFDNUIsY0FBTSxhQUFhLElBQUksWUFBYSxjQUFjLE1BQU8sS0FBSztBQUM5RCxjQUFNLFdBQVcsYUFBYTtBQUM5QixjQUFNLGNBQWMsT0FBTyxJQUFJLEtBQUssS0FBSyxPQUFPLEtBQUssQ0FBQyxFQUFFO0FBQ3hELGNBQU0sY0FBYyxNQUFNO0FBRTFCLGFBQUssSUFBSSxVQUFVO0FBQ25CLGFBQUssSUFBSTtBQUFBLFVBQU8sS0FBSyxVQUFVLGNBQWMsS0FBSyxJQUFJLGFBQWEsS0FBSyxLQUFLLEdBQUc7QUFBQSxVQUM1RSxLQUFLLFVBQVUsY0FBYyxLQUFLLElBQUksYUFBYSxLQUFLLEtBQUssR0FBRztBQUFBLFFBQUM7QUFDckUsYUFBSyxJQUFJLElBQUksS0FBSyxTQUFTLEtBQUssU0FBUyxhQUFhLGFBQWEsS0FBSyxLQUFLLEtBQUssV0FBVyxLQUFLLEtBQUssR0FBRztBQUMxRyxhQUFLLElBQUksSUFBSSxLQUFLLFNBQVMsS0FBSyxTQUFTLGFBQWEsV0FBVyxLQUFLLEtBQUssS0FBSyxhQUFhLEtBQUssS0FBSyxLQUFLLElBQUk7QUFDaEgsYUFBSyxJQUFJLFVBQVU7QUFFbkIsY0FBTSxjQUFZLFVBQUssa0JBQUwsbUJBQW9CLGNBQWEsUUFBTSxVQUFLLGtCQUFMLG1CQUFvQixhQUFZO0FBQ3pGLFlBQUksV0FBVztBQUVYLGVBQUssSUFBSSxZQUFZLEtBQUssYUFBYSxNQUFNLE9BQU8sRUFBRTtBQUN0RCxlQUFLLElBQUksY0FBYztBQUN2QixlQUFLLElBQUksWUFBWTtBQUFBLFFBQ3pCLE9BQU87QUFFSCxlQUFLLElBQUksWUFBWSxjQUFjLE1BQU07QUFDekMsZUFBSyxJQUFJLGNBQWM7QUFDdkIsZUFBSyxJQUFJLFlBQVk7QUFBQSxRQUN6QjtBQUNBLGFBQUssSUFBSSxjQUFjO0FBQ3ZCLGFBQUssSUFBSSxLQUFLO0FBQ2QsYUFBSyxJQUFJLGNBQWM7QUFDdkIsYUFBSyxJQUFJLE9BQU87QUFBQSxNQUNwQjtBQUFBLElBQ0o7QUFFQSxTQUFLLFVBQVUsS0FBSyxTQUFTLEtBQUssU0FBUyxFQUFFO0FBQzdDLFNBQUssSUFBSSxRQUFRO0FBR2pCLFNBQUssWUFBWSxDQUFDO0FBQ2xCLGFBQVMsS0FBSyxHQUFHLEtBQUssS0FBSyxPQUFPLFFBQVEsTUFBTTtBQUM1QyxZQUFNLFFBQVEsS0FBSyxPQUFPLEVBQUU7QUFDNUIsWUFBTSxRQUFRLE1BQU07QUFDcEIsWUFBTSxRQUFRLE1BQU07QUFDcEIsVUFBSSxVQUFVLEVBQUc7QUFDakIsWUFBTSxZQUFZLE1BQU07QUFDeEIsWUFBTSxjQUFjLEtBQUssZUFBZSxJQUFJLEVBQUUsS0FBSztBQUVuRCxlQUFTLElBQUksR0FBRyxJQUFJLE9BQU8sS0FBSztBQUM1QixZQUFJLE9BQU8sTUFBTSxDQUFDO0FBQ2xCLGNBQU0sWUFBWSxLQUFLLE1BQU0sa0JBQWtCO0FBQy9DLFlBQUksY0FBYztBQUNsQixZQUFJLGFBQWE7QUFDakIsWUFBSSxXQUFXO0FBQ1gsd0JBQWMsVUFBVSxDQUFDO0FBQ3pCLHVCQUFhLFVBQVUsQ0FBQztBQUFBLFFBQzVCO0FBRUEsY0FBTSxXQUFXLElBQUksWUFBYSxjQUFjLE1BQU8sS0FBSztBQUM1RCxjQUFNLFdBQVcsV0FBVyxZQUFZO0FBQ3hDLGNBQU0sTUFBTSxXQUFXLEtBQUssS0FBSztBQUVqQyxjQUFNLGNBQWMsT0FBTyxJQUFJLEtBQUssS0FBSyxPQUFPLEtBQUssQ0FBQyxFQUFFO0FBQ3hELGNBQU0sY0FBYyxNQUFNO0FBQzFCLGNBQU0sYUFBYSxjQUFjLGVBQWU7QUFFaEQsY0FBTSxTQUFTLEtBQUssVUFBVSxZQUFZLEtBQUssSUFBSSxHQUFHO0FBQ3RELGNBQU0sU0FBUyxLQUFLLFVBQVUsWUFBWSxLQUFLLElBQUksR0FBRztBQUV0RCxjQUFNLE9BQU8sS0FBSyxJQUFJLEtBQUssUUFBUTtBQUNuQyxjQUFNLE9BQU8sS0FBSyxJQUFJLEtBQUssUUFBUTtBQUNuQyxjQUFNLEtBQUssU0FBUyxLQUFLO0FBQ3pCLGNBQU0sS0FBSyxTQUFTLEtBQUs7QUFDekIsY0FBTSxVQUFVLEtBQUssVUFBVSxLQUFLLE9BQU8sS0FBSztBQUNoRCxjQUFNLFVBQVUsS0FBSyxVQUFVLEtBQUssT0FBTyxLQUFLO0FBRWhELGNBQU0sY0FBYyxXQUFZLEtBQUssV0FBVyxNQUFPLEtBQUssS0FBSztBQUVqRSxhQUFLLElBQUksS0FBSztBQUNkLGFBQUssSUFBSSxVQUFVLFNBQVMsT0FBTztBQUNuQyxhQUFLLElBQUksT0FBUSxjQUFjLEtBQUssS0FBTSxHQUFHO0FBQzdDLGFBQUssSUFBSSxPQUFPLFFBQVEsTUFBTSxRQUFRO0FBRXRDLGFBQUssSUFBSSxZQUFZLG1CQUFtQixNQUFNO0FBQzlDLGFBQUssSUFBSSxjQUFjO0FBQ3ZCLGFBQUssSUFBSSxhQUFhO0FBQ3RCLGFBQUssSUFBSSxZQUFZO0FBQ3JCLGFBQUssSUFBSSxlQUFlO0FBQ3hCLGFBQUssSUFBSSxTQUFTLGFBQWEsR0FBRyxDQUFDO0FBQ25DLGFBQUssSUFBSSxjQUFjO0FBQ3ZCLGFBQUssSUFBSSxRQUFRO0FBRWpCLGFBQUssVUFBVSxLQUFLO0FBQUEsVUFDaEIsR0FBRztBQUFBLFVBQVMsR0FBRztBQUFBLFVBQVMsVUFBVTtBQUFBLFVBQUksU0FBUztBQUFBLFVBQy9DO0FBQUEsVUFBWSxNQUFNLGNBQWM7QUFBQSxRQUNwQyxDQUFDO0FBQUEsTUFDTDtBQUFBLElBQ0o7QUFHQSxRQUFJLEtBQUssS0FBSyxZQUFZO0FBQ3RCLFdBQUssSUFBSSxPQUFPO0FBQ2hCLFdBQUssSUFBSSxZQUFZO0FBQ3JCLFdBQUssSUFBSSxjQUFjO0FBQ3ZCLFdBQUssSUFBSSxhQUFhO0FBQ3RCLFdBQUssSUFBSSxZQUFZO0FBQ3JCLFdBQUssSUFBSSxlQUFlO0FBQ3hCLFdBQUssSUFBSSxTQUFTLEtBQUssS0FBSyxZQUFZLEtBQUssU0FBUyxLQUFLLE9BQU87QUFDbEUsV0FBSyxJQUFJLGNBQWM7QUFBQSxJQUMzQjtBQUdBLFFBQUksS0FBSyxlQUFlO0FBQ3BCLFlBQU0sT0FBTyxLQUFLLFdBQVcsS0FBSyxLQUFLLGFBQWMsS0FBSyxLQUFLLGFBQWMsS0FBSyxPQUFPLFNBQVM7QUFDbEcsV0FBSyxJQUFJLFVBQVU7QUFDbkIsV0FBSyxJQUFJLE9BQU8sS0FBSyxTQUFTLEtBQUssT0FBTztBQUMxQyxXQUFLLElBQUksT0FBTyxLQUFLLFNBQVMsSUFBSTtBQUNsQyxXQUFLLElBQUksY0FBYztBQUN2QixXQUFLLElBQUksWUFBWTtBQUNyQixXQUFLLElBQUksT0FBTztBQUFBLElBQ3BCO0FBQUEsRUFDSjtBQUFBLEVBRVEsVUFBVSxJQUFZLElBQVksR0FBVztBQUVqRCxTQUFLLElBQUksS0FBSztBQUNkLFNBQUssSUFBSSxVQUFVO0FBQ25CLFNBQUssSUFBSSxJQUFJLElBQUksSUFBSSxHQUFHLEdBQUcsSUFBSSxLQUFLLEVBQUU7QUFDdEMsU0FBSyxJQUFJLFlBQVk7QUFDckIsU0FBSyxJQUFJLEtBQUs7QUFDZCxTQUFLLElBQUksY0FBYztBQUN2QixTQUFLLElBQUksWUFBWTtBQUNyQixTQUFLLElBQUksT0FBTztBQUVoQixTQUFLLElBQUksVUFBVTtBQUNuQixTQUFLLElBQUksSUFBSSxJQUFJLElBQUksR0FBRyxDQUFDLEtBQUssS0FBSyxHQUFHLEtBQUssS0FBSyxDQUFDO0FBQ2pELFNBQUssSUFBSSxZQUFZO0FBQ3JCLFNBQUssSUFBSSxLQUFLO0FBRWQsU0FBSyxJQUFJLFVBQVU7QUFDbkIsU0FBSyxJQUFJLElBQUksSUFBSSxLQUFLLElBQUksR0FBRyxJQUFJLEdBQUcsR0FBRyxJQUFJLEtBQUssRUFBRTtBQUNsRCxTQUFLLElBQUksWUFBWTtBQUNyQixTQUFLLElBQUksS0FBSztBQUVkLFNBQUssSUFBSSxVQUFVO0FBQ25CLFNBQUssSUFBSSxJQUFJLElBQUksS0FBSyxJQUFJLEdBQUcsSUFBSSxHQUFHLEdBQUcsSUFBSSxLQUFLLEVBQUU7QUFDbEQsU0FBSyxJQUFJLFlBQVk7QUFDckIsU0FBSyxJQUFJLEtBQUs7QUFFZCxVQUFNLE9BQU8sSUFBSTtBQUNqQixTQUFLLElBQUksVUFBVTtBQUNuQixTQUFLLElBQUksSUFBSSxJQUFJLEtBQUssSUFBSSxHQUFHLE1BQU0sR0FBRyxJQUFJLEtBQUssRUFBRTtBQUNqRCxTQUFLLElBQUksWUFBWTtBQUNyQixTQUFLLElBQUksS0FBSztBQUNkLFNBQUssSUFBSSxVQUFVO0FBQ25CLFNBQUssSUFBSSxJQUFJLElBQUksS0FBSyxJQUFJLEdBQUcsT0FBTyxHQUFHLEdBQUcsSUFBSSxLQUFLLEVBQUU7QUFDckQsU0FBSyxJQUFJLFlBQVk7QUFDckIsU0FBSyxJQUFJLEtBQUs7QUFFZCxTQUFLLElBQUksVUFBVTtBQUNuQixTQUFLLElBQUksSUFBSSxJQUFJLEtBQUssSUFBSSxHQUFHLE1BQU0sR0FBRyxJQUFJLEtBQUssRUFBRTtBQUNqRCxTQUFLLElBQUksWUFBWTtBQUNyQixTQUFLLElBQUksS0FBSztBQUNkLFNBQUssSUFBSSxVQUFVO0FBQ25CLFNBQUssSUFBSSxJQUFJLElBQUksS0FBSyxJQUFJLEdBQUcsT0FBTyxHQUFHLEdBQUcsSUFBSSxLQUFLLEVBQUU7QUFDckQsU0FBSyxJQUFJLFlBQVk7QUFDckIsU0FBSyxJQUFJLEtBQUs7QUFFZCxTQUFLLElBQUksUUFBUTtBQUFBLEVBQ3JCO0FBQUEsRUFFUSxhQUFhLE9BQWUsU0FBeUI7QUFDekQsUUFBSSxNQUFNLFdBQVcsR0FBRyxHQUFHO0FBQ3ZCLFVBQUksTUFBTSxNQUFNLE1BQU0sQ0FBQztBQUN2QixVQUFJLElBQUksV0FBVyxFQUFHLE9BQU0sSUFBSSxNQUFNLEVBQUUsRUFBRSxJQUFJLE9BQUssSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFO0FBQ2pFLFlBQU0sTUFBTSxTQUFTLEtBQUssRUFBRTtBQUM1QixVQUFJLEtBQUssT0FBTyxNQUFNO0FBQ3RCLFVBQUksS0FBTSxPQUFPLElBQUssT0FBVTtBQUNoQyxVQUFJLEtBQUssTUFBTSxPQUFZO0FBQzNCLFVBQUksS0FBSyxJQUFJLEtBQUssS0FBSyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0FBQ2hDLFVBQUksS0FBSyxJQUFJLEtBQUssS0FBSyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0FBQ2hDLFVBQUksS0FBSyxJQUFJLEtBQUssS0FBSyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0FBQ2hDLGFBQU8sS0FBSyxLQUFLLEtBQUssS0FBSyxJQUFJLEdBQUcsU0FBUyxFQUFFLEVBQUUsU0FBUyxHQUFHLEdBQUcsQ0FBQztBQUFBLElBQ25FO0FBQ0EsV0FBTztBQUFBLEVBQ1g7QUFBQSxFQUVRLGlCQUFpQixHQUFlO0FBQ3BDLFVBQU0sT0FBTyxLQUFLLE9BQU8sc0JBQXNCO0FBQy9DLFVBQU0sS0FBSyxLQUFLLE9BQU8sUUFBUSxLQUFLO0FBQ3BDLFVBQU0sS0FBSyxLQUFLLE9BQU8sU0FBUyxLQUFLO0FBQ3JDLFVBQU0sTUFBTSxFQUFFLFVBQVUsS0FBSyxRQUFRO0FBQ3JDLFVBQU0sTUFBTSxFQUFFLFVBQVUsS0FBSyxPQUFPO0FBRXBDLFVBQU0sV0FBVyxLQUFLLE1BQU0sS0FBSyxLQUFLLFNBQVMsS0FBSyxLQUFLLE9BQU87QUFDaEUsVUFBTSxTQUFTLEtBQUssTUFBTSxLQUFLLEtBQUssU0FBUyxLQUFLLEtBQUssT0FBTztBQUM5RCxVQUFNLEtBQUssS0FBSyxjQUFjLE1BQU07QUFDcEMsUUFBSSxPQUFPLE1BQU07QUFDYixXQUFLLGdCQUFnQjtBQUNyQixXQUFLLEtBQUs7QUFDVjtBQUFBLElBQ0o7QUFFQSxVQUFNLFFBQVEsS0FBSyxPQUFPLEVBQUU7QUFDNUIsVUFBTSxRQUFRLE1BQU0sTUFBTTtBQUMxQixRQUFJLFVBQVUsR0FBRztBQUNiLFdBQUssZ0JBQWdCO0FBQ3JCLFdBQUssS0FBSztBQUNWO0FBQUEsSUFDSjtBQUVBLFFBQUksaUJBQWlCLFdBQVcsS0FBSztBQUNyQyxVQUFNLGlCQUFpQixLQUFLLGVBQWUsSUFBSSxFQUFFLEtBQUs7QUFDdEQsc0JBQWtCO0FBQ2xCLHNCQUFtQixrQkFBa0IsSUFBSSxLQUFLLE1BQU8sSUFBSSxLQUFLLE9BQU8sSUFBSSxLQUFLO0FBRTlFLFVBQU0sWUFBYSxJQUFJLEtBQUssS0FBTTtBQUNsQyxVQUFNLE1BQU0sS0FBSyxNQUFNLGlCQUFpQixTQUFTO0FBRWpELFFBQUksT0FBTyxLQUFLLE1BQU0sT0FBTztBQUN6QixVQUFJLENBQUMsS0FBSyxpQkFBaUIsS0FBSyxjQUFjLGFBQWEsTUFBTSxLQUFLLGNBQWMsWUFBWSxLQUFLO0FBQ2pHLGFBQUssZ0JBQWdCLEVBQUUsVUFBVSxJQUFJLFNBQVMsSUFBSTtBQUNsRCxhQUFLLEtBQUs7QUFBQSxNQUNkO0FBQUEsSUFDSixPQUFPO0FBQ0gsVUFBSSxLQUFLLGVBQWU7QUFDcEIsYUFBSyxnQkFBZ0I7QUFDckIsYUFBSyxLQUFLO0FBQUEsTUFDZDtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQUEsRUFFUSxRQUFRLEdBQWU7QUFDM0IsUUFBSSxDQUFDLEVBQUUsV0FBVyxDQUFDLEVBQUUsUUFBUztBQUM5QixRQUFJLEtBQUssZUFBZTtBQUNwQixZQUFNLE9BQU8sS0FBSyxVQUFVLEtBQUssT0FBSyxFQUFFLGFBQWEsS0FBSyxjQUFlLFlBQVksRUFBRSxZQUFZLEtBQUssY0FBZSxPQUFPO0FBQzlILFVBQUksTUFBTTtBQUNOLFlBQUksS0FBSyxNQUFNO0FBQ1gsZ0JBQU0sV0FBVyxLQUFLLE9BQU8sSUFBSSxjQUFjLHFCQUFxQixLQUFLLE1BQU0sS0FBSyxLQUFLLElBQUk7QUFDN0YsY0FBSSxVQUFVO0FBQ1YsaUJBQUssT0FBTyxJQUFJLFVBQVUsYUFBYSxLQUFLLE1BQU0sS0FBSyxLQUFLLElBQUk7QUFBQSxVQUNwRSxPQUFPO0FBQ0gsZ0JBQUksd0JBQU8sbUNBQVUsS0FBSyxJQUFJLEVBQUU7QUFBQSxVQUNwQztBQUFBLFFBQ0osT0FBTztBQUNILGVBQUssZ0JBQWdCLEtBQUssSUFBSTtBQUFBLFFBQ2xDO0FBQ0EsVUFBRSxlQUFlO0FBQ2pCLFVBQUUsZ0JBQWdCO0FBQUEsTUFDdEI7QUFBQSxJQUNKO0FBQUEsRUFDSjtBQUFBLEVBRVEsZ0JBQWdCLE9BQWU7QUFDbkMsVUFBTSxhQUFhLE1BQU0sUUFBUSxnQkFBZ0IsRUFBRTtBQUNuRCxVQUFNLE9BQU8sS0FBSyxPQUFPLElBQUksY0FBYyxxQkFBcUIsWUFBWSxFQUFFO0FBQzlFLFFBQUksTUFBTTtBQUNOLFdBQUssT0FBTyxJQUFJLFVBQVUsYUFBYSxZQUFZLElBQUksS0FBSztBQUFBLElBQ2hFLE9BQU87QUFDSCxVQUFJLHdCQUFPLDZDQUFVLFVBQVUsMEJBQU07QUFBQSxJQUN6QztBQUFBLEVBQ0o7QUFBQSxFQUVBLE1BQWdCLGVBQWUsR0FBOEI7QUFDekQsVUFBTSxPQUFPLEtBQUssT0FBTyxzQkFBc0I7QUFDL0MsVUFBTSxLQUFLLEtBQUssT0FBTyxRQUFRLEtBQUs7QUFDcEMsVUFBTSxLQUFLLEtBQUssT0FBTyxTQUFTLEtBQUs7QUFDckMsVUFBTSxNQUFNLEVBQUUsVUFBVSxLQUFLLFFBQVE7QUFDckMsVUFBTSxNQUFNLEVBQUUsVUFBVSxLQUFLLE9BQU87QUFDcEMsUUFBSSxVQUFVO0FBQ2QsUUFBSSxNQUFNO0FBQ1YsZUFBVyxRQUFRLEtBQUssV0FBVztBQUMvQixZQUFNLEtBQUssS0FBSyxJQUFJLElBQUksS0FBSyxLQUFLLElBQUk7QUFDdEMsWUFBTSxPQUFPLEtBQUssTUFBTSxJQUFJLEVBQUU7QUFDOUIsVUFBSSxPQUFPLFNBQVM7QUFDaEIsa0JBQVU7QUFDVixjQUFNO0FBQUEsTUFDVjtBQUFBLElBQ0o7QUFDQSxRQUFJLEtBQUs7QUFDTCxZQUFNLFVBQVUsTUFBTSxLQUFLLGNBQWMsSUFBSSxJQUFJO0FBQ2pELFVBQUksWUFBWSxRQUFRLFlBQVksSUFBSSxNQUFNO0FBQzFDLGFBQUssS0FBSyxPQUFPLElBQUksUUFBUSxFQUFFLE1BQU0sSUFBSSxPQUFPLElBQUk7QUFDcEQsY0FBTSxnQkFBZ0IsS0FBSyxNQUFNLEtBQUssV0FBVyxLQUFLLE1BQU0sS0FBSyxNQUFNO0FBQ3ZFLGFBQUssWUFBWSxvQkFBb0IsS0FBSyxNQUFNLEtBQUssS0FBSyxPQUFPO0FBQ2pFLGFBQUssYUFBYSxLQUFLLElBQUk7QUFDM0IsYUFBSyxjQUFjO0FBQ25CLGFBQUssS0FBSztBQUFBLE1BQ2Q7QUFBQSxJQUNKLE9BQU87QUFDSCxpQkFBVyxRQUFRLEtBQUssV0FBVztBQUMvQixZQUFJLEtBQUssTUFBTTtBQUNYLGdCQUFNLEtBQUssS0FBSyxJQUFJLElBQUksS0FBSyxLQUFLLElBQUk7QUFDdEMsY0FBSSxLQUFLLE1BQU0sSUFBSSxFQUFFLElBQUksSUFBSTtBQUN6QixrQkFBTSxXQUFXLEtBQUssT0FBTyxJQUFJLGNBQWMscUJBQXFCLEtBQUssTUFBTSxLQUFLLEtBQUssSUFBSTtBQUM3RixnQkFBSSxVQUFVO0FBQ1YsbUJBQUssT0FBTyxJQUFJLFVBQVUsYUFBYSxTQUFTLE1BQU0sS0FBSyxLQUFLLElBQUk7QUFBQSxZQUN4RSxPQUFPO0FBQ0gsa0JBQUksd0JBQU8sbUNBQVUsS0FBSyxJQUFJLEVBQUU7QUFBQSxZQUNwQztBQUNBO0FBQUEsVUFDSjtBQUFBLFFBQ0o7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLEVBQ0o7QUFBQSxFQUVRLGNBQWMsU0FBeUM7QUFDM0QsV0FBTyxJQUFJLFFBQVEsQ0FBQyxZQUFZO0FBQzVCLFlBQU0sUUFBUSxJQUFJLGNBQWMsS0FBSyxPQUFPLEtBQUssU0FBUyxPQUFPO0FBQ2pFLFlBQU0sS0FBSztBQUFBLElBQ2YsQ0FBQztBQUFBLEVBQ0w7QUFBQSxFQUVPLFVBQVU7QUFDYixVQUFNLFFBQVE7QUFDZCxTQUFLLE9BQU8sb0JBQW9CLGFBQWEsS0FBSyxnQkFBZ0I7QUFBQSxFQUN0RTtBQUNKOzs7QUU3ZEEsSUFBQUUsbUJBQStDO0FBR3hDLElBQU0sbUJBQU4sY0FBK0Isa0NBQWlCO0FBQUEsRUFHbkQsWUFBWSxLQUFVLFFBQWdDO0FBQ2xELFVBQU0sS0FBSyxNQUFNO0FBSHJCO0FBSUksU0FBSyxTQUFTO0FBQUEsRUFDbEI7QUFBQSxFQUVBLFVBQWdCO0FBQ1osVUFBTSxFQUFFLFlBQVksSUFBSTtBQUN4QixnQkFBWSxNQUFNO0FBQ2xCLGdCQUFZLFNBQVMsTUFBTSxFQUFFLE1BQU0sbURBQVcsQ0FBQztBQUcvQyxRQUFJLHlCQUFRLFdBQVcsRUFDbEIsUUFBUSxrREFBVSxFQUNsQixRQUFRLGdJQUF1QixFQUMvQixVQUFVLFlBQVUsT0FDaEIsU0FBUyxLQUFLLE9BQU8sU0FBUyxhQUFhLEVBQzNDLFNBQVMsT0FBTyxVQUFVO0FBQ3ZCLFdBQUssT0FBTyxTQUFTLGdCQUFnQjtBQUNyQyxZQUFNLEtBQUssT0FBTyxhQUFhO0FBQy9CLFdBQUssT0FBTyxvQkFBb0I7QUFBQSxJQUNwQyxDQUFDLENBQUM7QUFHVixRQUFJLHlCQUFRLFdBQVcsRUFDbEIsUUFBUSw0Q0FBUyxFQUNqQixRQUFRLG9IQUFxQixFQUM3QixVQUFVLFlBQVUsT0FDaEIsU0FBUyxLQUFLLE9BQU8sU0FBUyxrQkFBa0IsRUFDaEQsU0FBUyxPQUFPLFVBQVU7QUFDdkIsV0FBSyxPQUFPLFNBQVMscUJBQXFCO0FBQzFDLFlBQU0sS0FBSyxPQUFPLGFBQWE7QUFDL0IsV0FBSyxPQUFPLG9CQUFvQjtBQUFBLElBQ3BDLENBQUMsQ0FBQztBQUdWLFFBQUkseUJBQVEsV0FBVyxFQUNsQixRQUFRLHNDQUFRLEVBQ2hCLFFBQVEsNENBQVMsRUFDakIsVUFBVSxZQUFVLE9BQ2hCLFVBQVUsS0FBSyxHQUFLLElBQUksRUFDeEIsU0FBUyxLQUFLLE9BQU8sU0FBUyxhQUFhLEVBQzNDLFNBQVMsT0FBTyxVQUFVO0FBQ3ZCLFdBQUssT0FBTyxTQUFTLGdCQUFnQjtBQUNyQyxZQUFNLEtBQUssT0FBTyxhQUFhO0FBQy9CLFdBQUssT0FBTyxvQkFBb0I7QUFBQSxJQUNwQyxDQUFDLENBQUM7QUFHVixRQUFJLHlCQUFRLFdBQVcsRUFDbEIsUUFBUSwwQkFBTSxFQUNkLFFBQVEsb0VBQWEsRUFDckIsZUFBZSxZQUFVLE9BQ3JCLFNBQVMsS0FBSyxPQUFPLFNBQVMsU0FBUyxFQUN2QyxTQUFTLE9BQU8sVUFBVTtBQUN2QixXQUFLLE9BQU8sU0FBUyxZQUFZO0FBQ2pDLFlBQU0sS0FBSyxPQUFPLGFBQWE7QUFDL0IsV0FBSyxPQUFPLG9CQUFvQjtBQUFBLElBQ3BDLENBQUMsQ0FBQztBQUdWLFFBQUkseUJBQVEsV0FBVyxFQUNsQixRQUFRLDRDQUFTLEVBQ2pCLFFBQVEsa0dBQWtCLEVBQzFCLGVBQWUsWUFBVSxPQUNyQixTQUFTLEtBQUssT0FBTyxTQUFTLHFCQUFxQixFQUFFLEVBQ3JELFNBQVMsT0FBTyxVQUFVO0FBQ3ZCLFdBQUssT0FBTyxTQUFTLG9CQUFvQjtBQUN6QyxZQUFNLEtBQUssT0FBTyxhQUFhO0FBQy9CLFdBQUssT0FBTyxvQkFBb0I7QUFBQSxJQUNwQyxDQUFDLENBQUM7QUFBQSxFQUNkO0FBQ0o7OztBQzlFQSxJQUFBQyxtQkFBOEI7QUF3QjlCLFNBQVMsaUJBQWlCLFVBQXVDO0FBQzdELFFBQU0sUUFBdUIsQ0FBQztBQUM5QixRQUFNLFFBQXVCLENBQUM7QUFDOUIsYUFBVyxLQUFLLFVBQVU7QUFDdEIsVUFBTSxPQUFvQjtBQUFBLE1BQ3RCLE1BQU0sRUFBRTtBQUFBLE1BQ1IsT0FBTyxFQUFFO0FBQUEsTUFDVCxVQUFVLENBQUM7QUFBQSxNQUNYLFNBQVMsRUFBRTtBQUFBLE1BQ1gsTUFBTSxFQUFFO0FBQUEsTUFDUixNQUFNLEVBQUU7QUFBQSxJQUNaO0FBQ0EsV0FBTyxNQUFNLFNBQVMsS0FBSyxNQUFNLE1BQU0sU0FBUyxDQUFDLEVBQUUsU0FBUyxFQUFFLE9BQU87QUFDakUsWUFBTSxJQUFJO0FBQUEsSUFDZDtBQUNBLFFBQUksTUFBTSxXQUFXLEdBQUc7QUFDcEIsWUFBTSxLQUFLLElBQUk7QUFBQSxJQUNuQixPQUFPO0FBQ0gsWUFBTSxNQUFNLFNBQVMsQ0FBQyxFQUFFLFNBQVMsS0FBSyxJQUFJO0FBQUEsSUFDOUM7QUFDQSxVQUFNLEtBQUssSUFBSTtBQUFBLEVBQ25CO0FBQ0EsU0FBTztBQUNYO0FBR08sSUFBTSxtQkFBTixjQUErQixvQkFBb0I7QUFBQSxFQWV0RCxZQUNJLFdBQ0EsVUFDQSxRQUNGO0FBQ0UsVUFBTSxTQUFTO0FBbkJuQix3QkFBUTtBQUNSLHdCQUFRO0FBQ1Isd0JBQVEsYUFFRixDQUFDO0FBQ1Asd0JBQVE7QUFFUjtBQUFBLHdCQUFRLGNBS0c7QUFRUCxTQUFLLFNBQVM7QUFFZCxTQUFLLFFBQVEsU0FBUyxJQUFJLFdBQVM7QUFBQSxNQUMvQixNQUFNLEtBQUs7QUFBQSxNQUNYLE9BQU87QUFBQSxNQUNQLFVBQVUsaUJBQWlCLEtBQUssUUFBUTtBQUFBLElBQzVDLEVBQUU7QUFDRixVQUFNLFdBQVcsS0FBSyxJQUFJLEdBQUcsR0FBRyxTQUFTLFFBQVEsT0FBSyxFQUFFLFNBQVMsSUFBSSxPQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDbkYsU0FBSyxXQUFXLFdBQVc7QUFDM0IsU0FBSyxXQUFXLG9CQUFvQjtBQUNwQyxTQUFLLFdBQVc7QUFDaEIsU0FBSyxLQUFLO0FBQUEsRUFDZDtBQUFBO0FBQUEsRUFHUSxTQUFTLFFBQXdCO0FBQ3JDLFVBQU0sY0FBYztBQUNwQixVQUFNLGFBQWEsY0FBYyxLQUFLO0FBQ3RDLFdBQU8sS0FBSyxNQUFNLFNBQVMsVUFBVTtBQUFBLEVBQ3pDO0FBQUE7QUFBQSxFQUdRLFFBQVEsT0FBZSxRQUFnQixPQUt0QztBQUNMLFFBQUksUUFBUSxLQUFLLFFBQVEsS0FBSyxTQUFVLFFBQU87QUFDL0MsVUFBTSxjQUFjO0FBQ3BCLFVBQU0sYUFBYSxjQUFjLEtBQUs7QUFDdEMsVUFBTSxjQUFjLFFBQVE7QUFDNUIsVUFBTSxjQUFjLGNBQWM7QUFDbEMsUUFBSSxTQUFTLGVBQWUsU0FBUyxZQUFhLFFBQU87QUFFekQsVUFBTSxlQUFlLENBQ2pCLE9BQ0FDLGFBQ0FDLFdBQ0EsaUJBQ2lGO0FBQ2pGLFVBQUksaUJBQWlCLFFBQVEsR0FBRztBQUM1QixlQUFPLEVBQUUsZ0JBQWdCLE9BQU8sWUFBQUQsYUFBWSxVQUFBQyxVQUFTO0FBQUEsTUFDekQ7QUFDQSxZQUFNQyxlQUFjLEtBQUssZUFBZSxJQUFJLFlBQVksS0FBSztBQUM3RCxZQUFNQyxpQkFBZ0JILGNBQWFFO0FBQ25DLFlBQU1FLGVBQWNILFlBQVdDO0FBQy9CLFlBQU1HLGNBQWFELGVBQWNEO0FBQ2pDLFlBQU1HLGdCQUFlRCxjQUFhLE1BQU07QUFDeEMsZUFBUyxJQUFJLEdBQUcsSUFBSSxNQUFNLFFBQVEsS0FBSztBQUNuQyxjQUFNLE9BQU8sTUFBTSxDQUFDO0FBQ3BCLGNBQU0sYUFBYUYsaUJBQWdCLElBQUlHO0FBQ3ZDLGNBQU0sV0FBVyxhQUFhQTtBQUM5QixZQUFJLEtBQUssU0FBUyxTQUFTLEtBQUssZUFBZSxRQUFRLEdBQUc7QUFDdEQsZ0JBQU0sU0FBUyxhQUFhLEtBQUssVUFBVSxZQUFZLFVBQVUsZUFBZSxDQUFDO0FBQ2pGLGNBQUksT0FBUSxRQUFPO0FBQUEsUUFDdkI7QUFBQSxNQUNKO0FBQ0EsYUFBTztBQUFBLElBQ1g7QUFFQSxRQUFJLFVBQVUsR0FBRztBQUNiLFlBQU1KLGVBQWMsS0FBSyxlQUFlLElBQUksQ0FBQyxLQUFLO0FBQ2xELFlBQU1DLGlCQUFnQkQ7QUFDdEIsWUFBTUUsZUFBYyxJQUFJLEtBQUssS0FBS0Y7QUFDbEMsWUFBTUcsY0FBYUQsZUFBY0Q7QUFDakMsWUFBTUcsZ0JBQWVELGNBQWEsS0FBSyxNQUFNO0FBQzdDLFlBQU1FLGdCQUFlLFFBQVFKLG1CQUFrQixJQUFJLEtBQUssTUFBTSxJQUFJLEtBQUssT0FBTyxJQUFJLEtBQUs7QUFDdkYsWUFBTUssU0FBUSxLQUFLLE1BQU1ELGNBQWFELGFBQVk7QUFDbEQsVUFBSUUsVUFBUyxLQUFLQSxTQUFRLEtBQUssTUFBTSxRQUFRO0FBQ3pDLGVBQU8sRUFBRSxPQUFPLEdBQUcsZ0JBQWdCLEtBQUssT0FBTyxlQUFlQSxRQUFPLE1BQU0sS0FBSyxNQUFNQSxNQUFLLEVBQUU7QUFBQSxNQUNqRztBQUNBLGFBQU87QUFBQSxJQUNYO0FBRUEsVUFBTSxlQUFlLGFBQWEsS0FBSyxPQUFPLEdBQUcsSUFBSSxLQUFLLElBQUksQ0FBQztBQUMvRCxRQUFJLENBQUMsYUFBYyxRQUFPO0FBRTFCLFVBQU0sRUFBRSxnQkFBZ0IsWUFBWSxTQUFTLElBQUk7QUFDakQsVUFBTSxjQUFjLEtBQUssZUFBZSxJQUFJLEtBQUssS0FBSztBQUN0RCxVQUFNLGdCQUFnQixhQUFhO0FBQ25DLFVBQU0sY0FBYyxXQUFXO0FBQy9CLFVBQU0sYUFBYSxjQUFjO0FBQ2pDLFVBQU0sZUFBZSxhQUFhLGVBQWU7QUFDakQsVUFBTSxlQUFlLFFBQVEsa0JBQWtCLElBQUksS0FBSyxNQUFNLElBQUksS0FBSyxPQUFPLElBQUksS0FBSztBQUN2RixVQUFNLFFBQVEsS0FBSyxNQUFNLGFBQWEsWUFBWTtBQUNsRCxRQUFJLFNBQVMsS0FBSyxRQUFRLGVBQWUsUUFBUTtBQUM3QyxhQUFPLEVBQUUsT0FBTyxnQkFBZ0IsZUFBZSxPQUFPLE1BQU0sZUFBZSxLQUFLLEVBQUU7QUFBQSxJQUN0RjtBQUNBLFdBQU87QUFBQSxFQUNYO0FBQUE7QUFBQSxFQUdVLHFCQUFxQixPQUFlLFFBQWdCLEdBQXdCO0FBQ2xGLFVBQU0sUUFBUSxLQUFLLFNBQVMsTUFBTTtBQUNsQyxVQUFNLE1BQU0sS0FBSyxRQUFRLE9BQU8sUUFBUSxLQUFLO0FBQzdDLFFBQUksT0FBTyxRQUFRLEdBQUc7QUFDbEIsV0FBSyxxQkFBcUI7QUFDMUIsV0FBSyxhQUFhO0FBQ2xCLGFBQU87QUFBQSxJQUNYO0FBQ0EsV0FBTztBQUFBLEVBQ1g7QUFBQTtBQUFBLEVBR1Usb0JBQW9CLE9BQWUsR0FBcUI7QUFDOUQsVUFBTSxRQUFRLEtBQUs7QUFDbkIsVUFBTSxnQkFBZ0IsS0FBSyxlQUFlLElBQUksS0FBSyxLQUFLO0FBQ3hELFVBQU0sUUFBUSxRQUFRLEtBQUs7QUFDM0IsU0FBSyxlQUFlLElBQUksT0FBTyxnQkFBZ0IsS0FBSztBQUNwRCxTQUFLLEtBQUs7QUFBQSxFQUNkO0FBQUE7QUFBQSxFQUdVLHFCQUEyQjtBQUNqQyxVQUFNLFFBQVEsS0FBSztBQUNuQixRQUFJLEtBQUssY0FBYyxLQUFLLFdBQVcsZUFBZSxTQUFTLEdBQUc7QUFDOUQsWUFBTSxpQkFBaUIsS0FBSyxXQUFXO0FBQ3ZDLFlBQU0sZUFBZ0IsSUFBSSxLQUFLLEtBQU0sZUFBZTtBQUNwRCxZQUFNLFNBQVMsS0FBSyxlQUFlLElBQUksS0FBSyxLQUFLO0FBQ2pELFlBQU0sUUFBUSxLQUFLLE1BQU0sU0FBUyxZQUFZO0FBQzlDLFVBQUksVUFBVSxHQUFHO0FBQ2IsY0FBTSxtQkFBb0IsUUFBUSxlQUFlLFNBQVUsZUFBZSxVQUFVLGVBQWU7QUFDbkcsY0FBTSxRQUFRLGVBQWUsT0FBTyxHQUFHLGVBQWU7QUFDdEQsdUJBQWUsS0FBSyxHQUFHLEtBQUs7QUFDNUIsYUFBSyxlQUFlLElBQUksT0FBTyxTQUFTLFFBQVEsWUFBWTtBQUM1RCxhQUFLLEtBQUs7QUFBQSxNQUNkO0FBQUEsSUFDSjtBQUNBLFNBQUssYUFBYTtBQUNsQixTQUFLLHFCQUFxQjtBQUFBLEVBQzlCO0FBQUE7QUFBQSxFQUdPLE9BQU87QUFDVixRQUFJLENBQUMsS0FBSyxPQUFPLEtBQUssTUFBTSxXQUFXLEVBQUc7QUFDMUMsU0FBSyxJQUFJLFVBQVUsR0FBRyxHQUFHLEtBQUssT0FBTyxLQUFLLE1BQU07QUFDaEQsU0FBSyxJQUFJLFlBQVk7QUFDckIsU0FBSyxJQUFJLFNBQVMsR0FBRyxHQUFHLEtBQUssT0FBTyxLQUFLLE1BQU07QUFFL0MsVUFBTSxjQUFjO0FBQ3BCLFVBQU0sYUFBYSxjQUFjLEtBQUs7QUFFdEMsU0FBSyxJQUFJLEtBQUs7QUFDZCxTQUFLLElBQUksVUFBVSxLQUFLLFNBQVMsS0FBSyxPQUFPO0FBQzdDLFNBQUssSUFBSSxPQUFPLEtBQUssUUFBUTtBQUM3QixTQUFLLElBQUksVUFBVSxDQUFDLEtBQUssU0FBUyxDQUFDLEtBQUssT0FBTztBQUUvQyxTQUFLLFlBQVksQ0FBQztBQUNsQixTQUFLLFFBQVEsS0FBSyxPQUFPLEdBQUcsSUFBSSxLQUFLLElBQUksR0FBRyxVQUFVO0FBQ3RELFNBQUssSUFBSSxRQUFRO0FBQUEsRUFDckI7QUFBQTtBQUFBLEVBR1EsUUFDSixPQUNBLFlBQ0EsVUFDQSxPQUNBLFlBQ0Y7QUFDRSxRQUFJLE1BQU0sV0FBVyxFQUFHO0FBQ3hCLFVBQU0sY0FBYyxRQUFRO0FBQzVCLFVBQU0sY0FBYyxjQUFjO0FBQ2xDLFVBQU0sYUFBYSxXQUFXO0FBQzlCLFVBQU0sY0FBYyxLQUFLLGVBQWUsSUFBSSxLQUFLLEtBQUs7QUFDdEQsVUFBTSxnQkFBZ0IsYUFBYTtBQUNuQyxVQUFNLGNBQWMsV0FBVztBQUMvQixVQUFNLGVBQWUsYUFBYSxNQUFNO0FBRXhDLFVBQU0sY0FBYyxLQUFLLGVBQWU7QUFDeEMsVUFBTSxRQUFRLGlCQUFpQixTQUFTLElBQUk7QUFDNUMsVUFBTSxVQUFVLE1BQU0saUJBQWlCLHNCQUFzQixFQUFFLEtBQUssS0FBSztBQUN6RSxVQUFNLFlBQVksTUFBTSxpQkFBaUIsZUFBZSxFQUFFLEtBQUssS0FBSztBQUVwRSxVQUFNLFFBQVEsQ0FBQyxNQUFNLE1BQU07QUFDdkIsWUFBTSxLQUFLLGdCQUFnQixJQUFJO0FBQy9CLFlBQU0sS0FBSyxLQUFLO0FBR2hCLFdBQUssSUFBSSxVQUFVO0FBQ25CLFdBQUssSUFBSSxJQUFJLEtBQUssU0FBUyxLQUFLLFNBQVMsYUFBYSxJQUFJLEVBQUU7QUFDNUQsV0FBSyxJQUFJLElBQUksS0FBSyxTQUFTLEtBQUssU0FBUyxhQUFhLElBQUksSUFBSSxJQUFJO0FBQ2xFLFdBQUssSUFBSSxVQUFVO0FBRW5CLFlBQU0sYUFBYSxRQUFRLFlBQVk7QUFDdkMsWUFBTSxZQUFZLFlBQVksVUFBVTtBQUV4QyxVQUFJLFVBQVUsR0FBRztBQUNiLGFBQUssSUFBSSxZQUFZO0FBQ3JCLGFBQUssSUFBSSxjQUFjO0FBQUEsTUFDM0IsT0FBTztBQUNILGFBQUssSUFBSSxZQUFZO0FBQ3JCLGFBQUssSUFBSSxjQUFjO0FBQUEsTUFDM0I7QUFFQSxXQUFLLElBQUksS0FBSztBQUNkLFdBQUssSUFBSSxjQUFjO0FBRXZCLFdBQUssSUFBSSxjQUFjO0FBQ3ZCLFdBQUssSUFBSSxZQUFZO0FBQ3JCLFdBQUssSUFBSSxPQUFPO0FBRWhCLFVBQUksZUFBZSxRQUFRLGNBQWMsY0FBYyxJQUFJO0FBQ3ZELGNBQU0sWUFBWSxLQUFLLE1BQU07QUFDN0IsY0FBTSxhQUFhLGNBQWMsZUFBZTtBQUNoRCxjQUFNLFNBQVMsS0FBSyxVQUFVLFlBQVksS0FBSyxJQUFJLFFBQVE7QUFDM0QsY0FBTSxTQUFTLEtBQUssVUFBVSxZQUFZLEtBQUssSUFBSSxRQUFRO0FBRTNELGNBQU0sT0FBTyxLQUFLLElBQUksS0FBSyxRQUFRO0FBQ25DLGNBQU0sT0FBTyxLQUFLLElBQUksS0FBSyxRQUFRO0FBQ25DLGNBQU0sS0FBSyxTQUFTLEtBQUs7QUFDekIsY0FBTSxLQUFLLFNBQVMsS0FBSztBQUN6QixjQUFNLFVBQVUsS0FBSyxVQUFVLEtBQUssT0FBTyxLQUFLO0FBQ2hELGNBQU0sVUFBVSxLQUFLLFVBQVUsS0FBSyxPQUFPLEtBQUs7QUFFaEQsYUFBSyxJQUFJLEtBQUs7QUFDZCxhQUFLLElBQUksVUFBVSxRQUFRLE1BQU07QUFDakMsYUFBSyxJQUFJLE9BQU8sV0FBVyxLQUFLLEtBQUssQ0FBQztBQUN0QyxhQUFLLElBQUksT0FBTztBQUNoQixhQUFLLElBQUksWUFBWTtBQUNyQixhQUFLLElBQUksWUFBWTtBQUNyQixhQUFLLElBQUksZUFBZTtBQUN4QixhQUFLLElBQUksU0FBUyxLQUFLLEtBQUssVUFBVSxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDakQsYUFBSyxJQUFJLFFBQVE7QUFFakIsYUFBSyxVQUFVLEtBQUssRUFBRSxHQUFHLFNBQVMsR0FBRyxTQUFTLE9BQU8sT0FBTyxHQUFHLEtBQUssQ0FBQztBQUFBLE1BQ3pFO0FBRUEsVUFBSSxLQUFLLFNBQVMsU0FBUyxHQUFHO0FBQzFCLGFBQUssUUFBUSxLQUFLLFVBQVUsSUFBSSxJQUFJLFFBQVEsR0FBRyxVQUFVO0FBQUEsTUFDN0Q7QUFBQSxJQUNKLENBQUM7QUFBQSxFQUNMO0FBQUE7QUFBQSxFQUdRLGlCQUEyQjtBQUMvQixVQUFNLFFBQVEsaUJBQWlCLFNBQVMsSUFBSTtBQUM1QyxVQUFNLFNBQVMsTUFBTSxpQkFBaUIsc0JBQXNCLEVBQUUsS0FBSyxLQUFLO0FBQ3hFLFVBQU0sYUFBYSxNQUFNLGlCQUFpQixlQUFlLEVBQUUsS0FBSyxLQUFLO0FBQ3JFLFVBQU0sTUFBTSxNQUFNLGlCQUFpQixzQkFBc0IsRUFBRSxLQUFLLEtBQUs7QUFDckUsVUFBTSxNQUFNLE1BQU0saUJBQWlCLHdCQUF3QixFQUFFLEtBQUssS0FBSztBQUN2RSxXQUFPO0FBQUEsTUFDSDtBQUFBLE1BQ0E7QUFBQSxNQUNBLEtBQUssWUFBWSxRQUFRLEdBQUc7QUFBQSxNQUM1QixLQUFLLFlBQVksWUFBWSxHQUFHO0FBQUEsTUFDaEMsS0FBSyxZQUFZLEtBQUssR0FBRztBQUFBLE1BQ3pCLEtBQUssWUFBWSxLQUFLLEdBQUc7QUFBQSxJQUM3QjtBQUFBLEVBQ0o7QUFBQSxFQUVRLFlBQVksT0FBZSxRQUF3QjtBQUN2RCxVQUFNLFdBQVcsTUFBTSxNQUFNLGdDQUFnQztBQUM3RCxRQUFJLFVBQVU7QUFDVixVQUFJLElBQUksS0FBSyxJQUFJLEtBQUssS0FBSyxNQUFNLFNBQVMsU0FBUyxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUM7QUFDaEUsVUFBSSxJQUFJLEtBQUssSUFBSSxLQUFLLEtBQUssTUFBTSxTQUFTLFNBQVMsQ0FBQyxDQUFDLElBQUksTUFBTSxDQUFDO0FBQ2hFLFVBQUksSUFBSSxLQUFLLElBQUksS0FBSyxLQUFLLE1BQU0sU0FBUyxTQUFTLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQztBQUNoRSxhQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO0FBQUEsSUFDL0I7QUFDQSxXQUFPO0FBQUEsRUFDWDtBQUFBO0FBQUEsRUFHQSxNQUFnQixlQUFlLEdBQThCO0FBQ3pELFVBQU0sT0FBTyxLQUFLLE9BQU8sc0JBQXNCO0FBQy9DLFVBQU0sS0FBSyxLQUFLLE9BQU8sUUFBUSxLQUFLO0FBQ3BDLFVBQU0sS0FBSyxLQUFLLE9BQU8sU0FBUyxLQUFLO0FBQ3JDLFVBQU0sTUFBTSxFQUFFLFVBQVUsS0FBSyxRQUFRO0FBQ3JDLFVBQU0sTUFBTSxFQUFFLFVBQVUsS0FBSyxPQUFPO0FBRXBDLFFBQUksTUFBd0Y7QUFDNUYsUUFBSSxVQUFVO0FBQ2QsZUFBVyxRQUFRLEtBQUssV0FBVztBQUMvQixZQUFNLEtBQUssS0FBSyxJQUFJLElBQUksS0FBSyxLQUFLLElBQUk7QUFDdEMsWUFBTSxPQUFPLEtBQUssTUFBTSxJQUFJLEVBQUU7QUFDOUIsVUFBSSxPQUFPLFNBQVM7QUFDaEIsa0JBQVU7QUFDVixjQUFNO0FBQUEsTUFDVjtBQUFBLElBQ0o7QUFDQSxRQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsSUFBSSxLQUFLLFNBQVMsUUFBVztBQUNyRCxZQUFNLE9BQU8sSUFBSTtBQUNqQixZQUFNLFVBQVUsTUFBTSxLQUFLLGNBQWMsS0FBSyxJQUFJO0FBQ2xELFVBQUksWUFBWSxRQUFRLFlBQVksS0FBSyxNQUFNO0FBQzNDLGFBQUssT0FBTztBQUNaLGNBQU0sU0FBUyxJQUFJLE9BQU8sS0FBSyxLQUFLO0FBQ3BDLGNBQU0sU0FBUyxHQUFHLE1BQU0sSUFBSSxPQUFPO0FBQ25DLGNBQU0sS0FBSyxvQkFBb0IsS0FBSyxNQUFPLEtBQUssTUFBTyxNQUFNO0FBQzdELGFBQUssVUFBVTtBQUNmLGFBQUssS0FBSztBQUFBLE1BQ2Q7QUFBQSxJQUNKO0FBQUEsRUFDSjtBQUFBLEVBRUEsTUFBYyxvQkFBb0IsTUFBYSxNQUFjLFFBQWdCO0FBQ3pFLFVBQU0sVUFBVSxNQUFNLEtBQUssT0FBTyxJQUFJLE1BQU0sS0FBSyxJQUFJO0FBQ3JELFVBQU0sUUFBUSxRQUFRLE1BQU0sSUFBSTtBQUNoQyxRQUFJLE9BQU8sS0FBSyxRQUFRLE1BQU0sUUFBUTtBQUNsQyxVQUFJLHdCQUFPLHdEQUFXO0FBQ3RCO0FBQUEsSUFDSjtBQUNBLFVBQU0sSUFBSSxJQUFJO0FBQ2QsVUFBTSxhQUFhLE1BQU0sS0FBSyxJQUFJO0FBQ2xDLFVBQU0sS0FBSyxPQUFPLElBQUksTUFBTSxPQUFPLE1BQU0sVUFBVTtBQUNuRCxRQUFJLHdCQUFPLGdDQUFPO0FBQUEsRUFDdEI7QUFBQSxFQUVRLGNBQWMsU0FBeUM7QUFDM0QsV0FBTyxJQUFJLFFBQVEsQ0FBQyxZQUFZO0FBQzVCLFlBQU0sUUFBUSxJQUFJLGNBQWMsS0FBSyxPQUFPLEtBQUssU0FBUyxPQUFPO0FBQ2pFLFlBQU0sS0FBSztBQUFBLElBQ2YsQ0FBQztBQUFBLEVBQ0w7QUFDSjtBQUdBLGVBQXNCLG9CQUNsQixNQUNBLFFBQ3FCO0FBQ3JCLFFBQU0sUUFBUSxPQUFPLElBQUksY0FBYyxhQUFhLElBQUk7QUFDeEQsUUFBTSxTQUFTLE1BQU0sT0FBTyxJQUFJLE1BQU0sS0FBSyxJQUFJLEdBQUcsTUFBTSxJQUFJO0FBQzVELE1BQUksRUFBQywrQkFBTyxVQUFVLFFBQU8sQ0FBQztBQUM5QixTQUFPLE1BQU0sU0FBUyxJQUFJLFFBQU07QUFBQSxJQUM1QixPQUFPLEVBQUU7QUFBQSxJQUNULE1BQU0sRUFBRTtBQUFBLElBQ1IsTUFBTSxFQUFFLFNBQVMsTUFBTTtBQUFBLElBQ3ZCLEtBQUssTUFBTSxFQUFFLFNBQVMsTUFBTSxJQUFJO0FBQUEsSUFDaEM7QUFBQSxFQUNKLEVBQUU7QUFDTjs7O0FSdFlBLElBQXFCLHlCQUFyQixjQUFvRCx3QkFBTztBQUFBLEVBQTNEO0FBQUE7QUFDSTtBQUNBLHdCQUFRLG1CQUF1QyxvQkFBSSxJQUFJO0FBQUE7QUFBQSxFQUV2RCxNQUFNLFNBQVM7QUFDWCxVQUFNLEtBQUssYUFBYTtBQUN4QixTQUFLLGNBQWMsSUFBSSxpQkFBaUIsS0FBSyxLQUFLLElBQUksQ0FBQztBQUd2RCxTQUFLLG1DQUFtQyxVQUFVLE9BQU8sUUFBUSxJQUFJLFFBQVE7QUFDekUsWUFBTSxRQUFRLE9BQU8sS0FBSyxFQUFFLE1BQU0sT0FBTyxFQUFFLElBQUksT0FBSyxFQUFFLEtBQUssQ0FBQyxFQUFFLE9BQU8sT0FBSyxFQUFFLFNBQVMsQ0FBQztBQUN0RixVQUFJLE1BQU0sV0FBVyxHQUFHO0FBQ3BCLFdBQUcsU0FBUyxPQUFPLEVBQUUsTUFBTSwyQkFBTyxDQUFDO0FBQ25DO0FBQUEsTUFDSjtBQUVBLFlBQU0sWUFBWSxNQUFNLENBQUMsRUFBRSxZQUFZO0FBR3ZDLFVBQUksY0FBYyxTQUFTLGNBQWMsWUFBWTtBQUNqRCxjQUFNLFlBQXNCLENBQUM7QUFDN0IsaUJBQVMsSUFBSSxHQUFHLElBQUksTUFBTSxRQUFRLEtBQUs7QUFDbkMsZ0JBQU0sUUFBUSxNQUFNLENBQUMsRUFBRSxNQUFNLGdCQUFnQjtBQUM3QyxjQUFJLE1BQU8sV0FBVSxLQUFLLE1BQU0sQ0FBQyxDQUFDO0FBQUEsUUFDdEM7QUFDQSxZQUFJLFVBQVUsV0FBVyxHQUFHO0FBQ3hCLGdCQUFNLGVBQWUsS0FBSyxJQUFJLE1BQU0sc0JBQXNCLElBQUksVUFBVTtBQUN4RSxjQUFJLHdCQUF3Qix1QkFBTyxXQUFVLEtBQUssYUFBYSxRQUFRO0FBQUEsUUFDM0U7QUFFQSxjQUFNLGNBQWlHLENBQUM7QUFDeEcsbUJBQVcsUUFBUSxXQUFXO0FBQzFCLGdCQUFNQyxRQUFPLEtBQUssSUFBSSxjQUFjLHFCQUFxQixNQUFNLElBQUksVUFBVTtBQUM3RSxjQUFJQSxpQkFBZ0Isd0JBQU87QUFDdkIsa0JBQU0sV0FBVyxNQUFNLG9CQUFvQkEsT0FBTSxJQUFJO0FBQ3JELHdCQUFZLEtBQUssRUFBRSxVQUFVQSxNQUFLLFVBQVUsU0FBUyxDQUFDO0FBQUEsVUFDMUQsT0FBTztBQUNILGdCQUFJLHdCQUFPLG1DQUFVLElBQUksRUFBRTtBQUFBLFVBQy9CO0FBQUEsUUFDSjtBQUVBLFlBQUksWUFBWSxXQUFXLEdBQUc7QUFDMUIsYUFBRyxTQUFTLE9BQU8sRUFBRSxNQUFNLDZDQUFVLENBQUM7QUFDdEM7QUFBQSxRQUNKO0FBRUEsY0FBTUMsWUFBVyxJQUFJLGlCQUFpQixJQUFJLGFBQWEsSUFBSTtBQUMzRCxjQUFNQyxTQUFRLElBQUkscUNBQW9CLEVBQUU7QUFDeEMsUUFBQUEsT0FBTSxXQUFXLE1BQU1ELFVBQVMsUUFBUTtBQUN4QyxZQUFJLFNBQVNDLE1BQUs7QUFDbEI7QUFBQSxNQUNKO0FBR0EsWUFBTSxPQUFPLGdCQUFnQixNQUFNO0FBQ25DLFVBQUksQ0FBQyxNQUFNO0FBQ1AsV0FBRyxTQUFTLE9BQU8sRUFBRSxNQUFNLHlEQUFZLENBQUM7QUFDeEM7QUFBQSxNQUNKO0FBQ0EsWUFBTSxPQUFPLEtBQUssSUFBSSxNQUFNLHNCQUFzQixJQUFJLFVBQVU7QUFDaEUsVUFBSSxFQUFFLGdCQUFnQix3QkFBUTtBQUU5QixZQUFNLFdBQVcsSUFBSTtBQUFBLFFBQ2pCO0FBQUEsUUFBSTtBQUFBLFFBQU07QUFBQSxRQUFNO0FBQUEsUUFDaEIsTUFBTTtBQUFBLFFBQUU7QUFBQSxRQUNSO0FBQUEsUUFDQSxLQUFLLFNBQVM7QUFBQSxRQUNkLEtBQUssU0FBUztBQUFBLE1BQ2xCO0FBQ0EsV0FBSyxnQkFBZ0IsSUFBSSxRQUFRO0FBRWpDLFlBQU0sUUFBUSxJQUFJLHFDQUFvQixFQUFFO0FBQ3hDLFlBQU0sV0FBVyxNQUFNO0FBQ25CLGlCQUFTLFFBQVE7QUFDakIsYUFBSyxnQkFBZ0IsT0FBTyxRQUFRO0FBQUEsTUFDeEM7QUFDQSxVQUFJLFNBQVMsS0FBSztBQUFBLElBQ3RCLENBQUM7QUFHRCxTQUFLLDhCQUE4QixPQUFPLElBQUksUUFBUTtBQUNsRCxZQUFNLFFBQVEsR0FBRyxpQkFBaUIsaUJBQWlCO0FBQ25ELFlBQU0sS0FBSyxLQUFLLEVBQUUsUUFBUSxVQUFRO0FBOUY5QztBQStGZ0IsWUFBSSxLQUFLLGdCQUFnQixlQUFNO0FBQy9CLGNBQU0sYUFBYSxLQUFLLGFBQWEsV0FBVyxLQUFLLEtBQUssYUFBYSxNQUFNO0FBQzdFLFlBQUksQ0FBQyxXQUFZO0FBQ2pCLGNBQU0sYUFBYSxLQUFLLElBQUksY0FBYyxxQkFBcUIsWUFBWSxJQUFJLFVBQVU7QUFDekYsWUFBSSxDQUFDLFdBQVk7QUFDakIsY0FBTSxRQUFRLEtBQUssSUFBSSxjQUFjLGFBQWEsVUFBVTtBQUM1RCxjQUFNLGNBQWMsK0JBQU87QUFDM0IsWUFBSSxDQUFDLFlBQWE7QUFDbEIsY0FBTSxPQUFPLHVCQUF1QixXQUFXO0FBQy9DLFlBQUksQ0FBQyxLQUFNO0FBQ1gsY0FBTSxZQUFZLFNBQVMsY0FBYyxLQUFLO0FBQzlDLFlBQUk7QUFBQSxVQUNBO0FBQUEsVUFBVztBQUFBLFVBQU07QUFBQSxVQUFZO0FBQUEsVUFDN0IsTUFBTTtBQUFBLFVBQUU7QUFBQSxVQUNSO0FBQUEsVUFDQSxLQUFLLFNBQVM7QUFBQSxVQUNkLEtBQUssU0FBUztBQUFBLFFBQ2xCO0FBQ0EsbUJBQUssZUFBTCxtQkFBaUIsYUFBYSxXQUFXO0FBQUEsTUFDN0MsQ0FBQztBQUFBLElBQ0wsQ0FBQztBQUFBLEVBQ0w7QUFBQSxFQUVBLE1BQU0sZUFBZTtBQUNqQixTQUFLLFdBQVcsT0FBTyxPQUFPLENBQUMsR0FBRyxrQkFBa0IsTUFBTSxLQUFLLFNBQVMsQ0FBQztBQUFBLEVBQzdFO0FBQUEsRUFFQSxNQUFNLGVBQWU7QUFDakIsVUFBTSxLQUFLLFNBQVMsS0FBSyxRQUFRO0FBQUEsRUFDckM7QUFBQSxFQUVBLHNCQUFzQjtBQUNsQixTQUFLLGdCQUFnQixRQUFRLGNBQVk7QUFDckMsZUFBUyxnQkFBZ0IsS0FBSyxTQUFTO0FBQ3ZDLGVBQVMscUJBQXFCLEtBQUssU0FBUztBQUM1QyxlQUFTLEtBQUs7QUFBQSxJQUNsQixDQUFDO0FBQUEsRUFDTDtBQUFBLEVBRUEsV0FBVztBQUNQLFNBQUssZ0JBQWdCLFFBQVEsT0FBSyxFQUFFLFFBQVEsQ0FBQztBQUM3QyxTQUFLLGdCQUFnQixNQUFNO0FBQUEsRUFDL0I7QUFDSjsiLAogICJuYW1lcyI6IFsiaW1wb3J0X29ic2lkaWFuIiwgImltcG9ydF9vYnNpZGlhbiIsICJuZXdBbmdsZSIsICJkZWx0YSIsICJpbXBvcnRfb2JzaWRpYW4iLCAiaW1wb3J0X29ic2lkaWFuIiwgInN0YXJ0QW5nbGUiLCAiZW5kQW5nbGUiLCAibGF5ZXJPZmZzZXQiLCAiYWRqdXN0ZWRTdGFydCIsICJhZGp1c3RlZEVuZCIsICJ0b3RhbEFuZ2xlIiwgImFuZ2xlUGVyTm9kZSIsICJsb2NhbEFuZ2xlIiwgImluZGV4IiwgImZpbGUiLCAicmVuZGVyZXIiLCAiY2hpbGQiXQp9Cg==
