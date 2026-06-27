# Vibe Coding 3D 智能车模 Demo

React + Vite + Three.js 网页端 3D 仿真车模课程作业。第一版聚焦中控大屏风格、本地 GLTF 车模展示、鼠标旋转缩放和基础车控按钮。

## 项目目录

```text
.
├── docs/
│   └── vibe-coding-log.md
├── public/
│   └── models/
│       └── nio-et7/
│           └── scene.gltf
├── src/
│   ├── components/
│   │   ├── CarModel.jsx
│   │   ├── ControlsPanel.jsx
│   │   └── SceneCanvas.jsx
│   ├── store/
│   │   └── carState.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## 开发阶段与验收标准

1. MVP 车模与控制台
   - 页面可运行。
   - 白色背景中显示本地 3D 车模，保留模型原本颜色和贴图。
   - 支持鼠标拖动旋转、滚轮缩放。
   - 基础按钮可控制车窗和车灯状态，状态能同步到 3D 车模。

2. 车控交互增强
   - 点击车窗可直接打开或关闭对应车窗。
   - 车窗打开/关闭加入更平滑的动画。
   - 增加更多车控状态，例如车门、后备箱、充电口或氛围灯。

3. 语音控车
   - 接入浏览器 Web Speech API。
   - 识别“打开左前车窗”“关闭所有车窗”“打开车灯”等命令。
   - 页面展示识别文本、执行结果和异常提示。

4. 作业交付
   - README 完整。
   - Vibe Coding 过程记录完整。
   - 完成演示视频录制。
   - 整理可运行代码与说明。

## 运行

```bash
npm install
npm run dev
```

打开终端输出的本地地址，通常是 `http://localhost:5173/`。

## 第一版功能

- 中控大屏风格网页界面。
- 优先加载 `public/models/nio-et7/scene.gltf` 本地车模。
- 如果本地车模缺失，会自动回退到 Three.js 几何体车模，避免页面白屏。
- 鼠标拖动旋转、滚轮缩放查看车模。
- 按钮控制四个车窗打开/关闭。
- 按钮控制前后车灯开关。
- 点击车窗玻璃可切换对应车窗状态。

## 车模资源

当前项目已按以下位置读取车模：

```text
public/models/nio-et7/scene.gltf
public/models/nio-et7/scene.bin
public/models/nio-et7/textures/
```

如果后续换成 Granvia 或其他模型，只需要把 glTF/GLB 资源放到 `public/models/` 下，并在 `src/components/VehicleModel.jsx` 中替换模型路径。

## 后续待办

- 车窗状态切换动画。
- 语音控车命令识别。
- 更细节的车门线、内饰和灯光效果。
- 录制演示视频并补充交付说明。
