# Vpet

一个支持 **休闲陪伴** 与 **学习督导** 的桌面宠物（Desktop Pet）项目。

## 现在就开始：MVP 范围（2~4 周）

> 先做能跑起来的版本，不追求一步到位。

### 功能清单（只做这 6 个）
1. 桌宠常驻桌面（可拖拽、置顶、托盘图标）
2. 点击互动（2~3 个动作 + 2~3 条随机回复）
3. 讲笑话（本地笑话库 + 随机一条）
4. 专注计时（25/5 番茄钟）
5. 学习打卡（记录今天学了什么、学了多久）
6. 温和提醒（到点弹出鼓励，不强打断）

---

## 双模式设计

### 1) 休闲模式 Companion
- 陪聊、讲笑话、轻互动。
- 角色状态（开心/普通/困）影响台词和动作。

### 2) 学习模式 Study Coach
- 每日目标：例如“法语 30 分钟”。
- 专注计时：开始、暂停、结束、完成提醒。
- 复习入口：根据当天记录，生成 3~5 题选择题（后续阶段接入 AI）。

---

## 技术栈（建议）

- 桌面应用：`Tauri + React + TypeScript`
- 本地数据库：`SQLite`
- 状态管理：`Zustand`（或 Redux）
- UI：`Tailwind CSS`（可选）

为什么这样选：
- Tauri 资源占用更低，适合桌宠常驻。
- SQLite 本地优先，离线可用。
- React + TS 生态成熟，上手快。

---

## 目录规划（建议）

```txt
Vpet/
  README.md
  docs/
    architecture.md
    roadmap.md
    prompts.md
  src/
    ui/                # 前端界面
    core/              # 模式调度、提醒策略
    pet/               # 宠物动作/状态机
    study/             # 学习记录、番茄钟
    review/            # 复习出题逻辑
  data/
    jokes.json         # 本地笑话库
```

---

## 最小数据模型（先够用）

### `study_sessions`
- `id` TEXT PRIMARY KEY
- `date` TEXT
- `topic` TEXT
- `minutes` INTEGER
- `note` TEXT

### `focus_sessions`
- `id` TEXT PRIMARY KEY
- `start_time` TEXT
- `end_time` TEXT
- `status` TEXT（done/cancelled）

### `pet_state`
- `id` INTEGER PRIMARY KEY（固定 1）
- `mood` TEXT
- `energy` INTEGER
- `affinity` INTEGER

---

## 里程碑（可执行）

### Milestone A（第 1 周）
- 完成桌宠窗口、拖拽、托盘。
- 完成互动动作（最少 2 个）。
- 接入本地笑话 JSON。

**验收**：可以在桌面持续运行 2 小时，无明显卡顿或崩溃。

### Milestone B（第 2 周）
- 完成番茄钟（开始/暂停/结束）
- 完成学习打卡表单与 SQLite 入库
- 完成提醒通知

**验收**：可连续记录 3 天学习数据。

### Milestone C（第 3~4 周）
- 做“今日复习”页面（先规则出题，不依赖 AI）
- 根据最近学习记录生成 3~5 题选择题

**验收**：当天学习后可立即得到复习题。

---

## AI 接入策略（第二阶段再上）

先把规则系统跑通，再接 AI：
1. 基础版本：固定模板出题（不依赖 LLM）
2. 增强版本：LLM 生成题目 + 答案解释
3. 保护措施：输出过滤、频率限制、失败回退到本地题库

---

## 本周执行清单（直接照做）

- [ ] 选定技术栈（Tauri + React + SQLite）
- [ ] 建立项目目录与模块空文件
- [ ] 做出桌宠窗口和托盘常驻
- [ ] 加入 `jokes.json` 与随机笑话按钮
- [ ] 加入番茄钟与学习打卡
- [ ] 每天记录一次法语学习并验证数据落库


## 语音能力设计（新增）

你提到“助手可以说话/播放音频/接入 AI 语音”，建议分三层做：

### Level 1：本地音频播放（最快上线）
- 能力：播放本地 `mp3/wav`（问候音、完成任务提示音、表情音效）
- 触发：点击互动、番茄钟完成、学习打卡成功
- 价值：实现简单、无网络依赖、马上可感知“会说话”体验

### Level 2：模板 TTS（固定文案转语音）
- 能力：把固定文案（如“该休息了”）转成语音缓存并播放
- 触发：提醒通知、鼓励语
- 价值：语音更自然，不必手工录大量音频

### Level 3：AI 实时语音（动态内容）
- 能力：用户输入 -> LLM 生成回复 -> TTS 合成 -> 自动播放
- 场景：问答、法语跟读、错题讲解
- 价值：真正“能聊天、能讲解”的语音助手

---

## 语音技术方案（建议）

### 播放层（必须先有）
- 前端统一 `AudioPlayer` 模块：
  - `play(fileOrUrl)`
  - `stop()`
  - `setVolume(0~1)`
  - `queue([...])`
- 支持两类来源：
  1. 本地资源（`data/audio/*.mp3`）
  2. 在线 TTS URL（下载后可缓存）

### TTS 层（可切换）
- Provider 接口统一：
  - `speak(text, voice, speed) -> audio_file_path`
- 初期可先做 `MockTTSProvider`（返回本地占位音频）
- 后续接入真实 AI TTS（例如 OpenAI TTS）

### 语音编排层（Voice Orchestrator）
- 决策逻辑：
  - 高优先级（倒计时结束）可打断普通陪聊语音
  - 同类提醒 10~15 分钟内不重复播报
- 状态机：`idle -> generating -> playing -> cooldown`

---

## 数据与配置补充（语音）

### 新增表：`voice_logs`
- `id` TEXT PRIMARY KEY
- `created_at` TEXT
- `source` TEXT（system/assistant/user）
- `text` TEXT
- `voice` TEXT
- `duration_ms` INTEGER
- `status` TEXT（success/failed/skipped）

### 新增设置：`voice_settings`
- `enabled` BOOLEAN
- `volume` REAL
- `voice_style` TEXT（soft/energetic）
- `auto_play` BOOLEAN
- `quiet_hours` TEXT（如 `22:00-08:00`）

---

## 目录规划补充（语音相关）

```txt
src/
  audio/
    player.ts            # 播放器封装
    orchestrator.ts      # 语音调度与优先级
    providers/
      mock.ts
      ai_tts.ts
  prompts/
    voice_templates.ts   # 提醒/鼓励/讲解语音模板

data/
  audio/
    greetings/
    reminders/
    effects/
```

---

## 里程碑更新（加入语音）

### Milestone A（第 1 周）
- 增加音频播放基础能力（本地音效/提示音）
- 设置面板加入音量开关

**验收**：点击互动和番茄钟结束时可稳定播放音频。

### Milestone B（第 2 周）
- 增加模板 TTS（或 Mock Provider）
- 提醒语音接入（学习开始/结束/休息）

**验收**：固定文案可转语音并播放，失败时自动回退提示音。

### Milestone C（第 3~4 周）
- 接入 AI 动态语音（问答 + 学习讲解）
- 增加语音日志与静默时段策略

**验收**：问答回复可在 3~8 秒内播出（网络正常时）。

---

## 本周执行清单（语音版）
- [ ] 建 `AudioPlayer`，支持本地 mp3 播放
- [ ] 准备 5 条基础音频（问候/完成/提醒）
- [ ] 加入“语音开关 + 音量”设置
- [ ] 番茄钟结束触发播报
- [ ] 预留 `TTSProvider` 接口，先用 Mock

如果你同意这版，我们下一步就按 **Milestone A（含语音）** 直接拆成开发任务（我可以继续给你输出任务卡：每个任务包含目标、输入、输出、验收标准）。
