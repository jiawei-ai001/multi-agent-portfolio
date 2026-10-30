'use strict';

// These states only drive the public demonstration. No production service is connected.
const state = { mode: 'normal', stage: 0, cards: false, voice: false };
const $ = (selector) => document.querySelector(selector);
const normalCards = [
  ['normal-01.png', '01 · 怎么判断'], ['normal-02.png', '02 · 列表按位置拿'],
  ['normal-03.png', '03 · 字典按名字找'], ['normal-04.png', '04 · 怎么选']
];
const mergedCards = [
  ['merge-01.png', '01 · 什么时候用'], ['merge-02.png', '02 · 写成代码'],
  ['merge-result.png', '03 · 合并后的图'], ['merge-05.png', '05 · 两个方括号'],
  ['merge-06.png', '06 · 这样记']
];
const steps = {
  normal: [['确认稿件', '内容生产助手'], ['审图、试听', '两路并行 · 人工决定'], ['核对交接', '同任务 · 当前版本 · 材料齐'], ['成片验收', '剪辑员 → 人工'], ['完成演示', '查看实际交付']],
  rework: [['定位目标', '同一篇的第 3、4 张'], ['审核合图', '只修改指定部分'], ['核对整组', '六张变五张'], ['成片验收', '完整图组 → 剪辑员'], ['完成演示', '查看返工结果']]
};
const imageButton = (file, caption) => `<button class="image-button" data-image="assets/${file}" data-caption="${caption}" aria-label="放大查看：${caption}"><img src="assets/${file}" alt="${caption}" loading="lazy" width="1920" height="1080"></button>`;
const thumbs = (cards) => cards.map(([file, caption]) => `<div class="asset-item">${imageButton(file, caption)}<small>${caption}</small></div>`).join('');
const action = (label, name, disabled = false) => `<button class="button primary" data-action="${name}"${disabled ? ' disabled' : ''}>${label} <span aria-hidden="true">→</span></button>`;
const checks = (items) => `<div class="check-list">${items.map(([title, body]) => `<div class="check-item"><span class="check-icon" aria-hidden="true">✓</span><div><strong>${title}</strong><p>${body}</p></div></div>`).join('')}</div>`;

function render() {
  const normal = state.mode === 'normal';
  $('#scenario-title').textContent = normal ? '列表和字典怎么选' : '字典中嵌套字典';
  $('#scenario-subtitle').textContent = normal ? '从确认稿件到成片验收' : '定向修改，再交付完整图组';
  $('#stage-number').textContent = `STEP 0${state.stage + 1}`;
  $('#stage-status').textContent = ['准备开始', '等待你的审核', '材料核对', '等待成片验收', '本页演示完成'][state.stage];
  $('#step-list').innerHTML = steps[state.mode].map(([title, subtitle], i) => `<li class="${i === state.stage ? 'current' : i < state.stage ? 'done' : ''}"${i === state.stage ? ' aria-current="step"' : ''}><span class="step-index">${i < state.stage ? '✓' : i + 1}</span><span class="step-copy"><strong>${title}</strong><small>${subtitle}</small></span></li>`).join('');
  document.querySelectorAll('[data-mode]').forEach((button) => {
    const selected = button.dataset.mode === state.mode;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  $('#demo-content').innerHTML = normal ? normalStage() : reworkStage();
  $('#demo-message').textContent = state.stage === 4 ? '演示已完成。所有操作仅在本页生效，没有提交真实任务。' : '预设流程演示 · 图片、音频与视频来自已完成任务';
}

function normalStage() {
  if (state.stage === 0) return `<h3 tabindex="-1">先确认这次要做的内容。</h3><p class="stage-lead">内容生产助手选择已经确认的稿件，再把任务交给图卡员和配音员。</p><div class="manuscript"><div class="manuscript-header"><span class="tag">已确认的样例稿件</span><span>案例 034</span></div><h4>列表和字典怎么选</h4><p>列表按位置拿内容，字典按名字找内容。先看数据之间是什么关系，再决定用哪一种。</p><div class="input-list"><span>✓ 最终讲解稿</span><span>✓ 配音朗读稿</span></div></div><div class="stage-actions">${action('开始演示', 'next')}<span class="hint">使用现成样例，立即进入审图、试听</span></div>`;
  if (state.stage === 1) return `<h3 tabindex="-1">图卡与配音，分别审核。</h3><p class="stage-lead">两路可以同时制作。只有审图和试听都通过，才能交给剪辑。</p><div class="review-grid"><section class="review-panel"><div class="review-head"><h4>Python 图卡员</h4><span class="tag">4 张图卡</span></div><div class="review-thumbs">${normalCards.map(([f, c]) => imageButton(f, c)).join('')}</div><p class="review-caption">检查内容、代码和结果，点击可放大。</p><div class="review-bottom">${state.cards ? '<span class="approve-done">✓ 已在本页模拟审图通过</span>' : '<button class="button secondary" data-action="approve-cards">图卡通过（演示）</button>'}</div></section><section class="review-panel"><div class="review-head"><h4>配音员</h4><span class="tag">完整配音</span></div><div class="voice-visual" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div><audio id="demo-audio" controls preload="none" src="assets/normal-voice.wav" aria-label="列表和字典怎么选真实配音"></audio><p class="review-caption">试听真实文件，检查漏读、卡顿和变形。</p><div class="review-bottom">${state.voice ? '<span class="approve-done">✓ 已在本页模拟试听通过</span>' : '<button class="button secondary" data-action="approve-voice">配音通过（演示）</button>'}</div></section></div><div class="guard-hint${state.cards && state.voice ? ' ready' : ''}">${state.cards && state.voice ? '✓ 两路均已通过，可以进入材料核对。' : state.cards ? '还在等配音通过。图卡通过，不会替代试听。' : state.voice ? '还在等图卡通过。配音通过，不会替代审图。' : '先分别点击两处“通过”。缺少任意一项，剪辑都不会放行。'}</div><div class="stage-actions">${action('核对交接材料', 'next', !state.cards || !state.voice)}</div>`;
  if (state.stage === 2) return `<h3 tabindex="-1">剪辑接收正式材料。</h3><p class="stage-lead">确认是同一篇、当前通过的版本，而且该有的材料已经交齐。</p>${checks([['任务对应', '图卡、完整配音与字幕资料，均属于《列表和字典怎么选》。'], ['版本对应', '使用刚才模拟审核通过的版本，不混入旧候选。'], ['材料齐备', '4 张图卡、完整音频、朗读稿和字幕对应资料齐备。']])}<div class="summary-block">剪辑依据这份交付制作视频，不再翻查配音员内部的生成尝试和旧片段记录。</div><div class="stage-actions">${action('查看已完成的样例成片', 'next')}<span class="hint">直接播放历史成片，不进行实时剪辑</span></div>`;
  if (state.stage === 3) return filmStage('normal');
  return completion('normal');
}

function reworkStage() {
  if (state.stage === 0) return `<h3 tabindex="-1">只改第 3、4 张。</h3><p class="stage-lead">把“取整组信息”和“再取具体价格”放在一张图中。其余四张保留。</p><div class="merge-before"><div>${imageButton('merge-before-03.png', '原第 3 张 · 取整组信息')}<p class="merge-card-label">原第 3 张 · 取整组信息</p></div><div>${imageButton('merge-before-04.png', '原第 4 张 · 取具体价格')}<p class="merge-card-label">原第 4 张 · 取具体价格</p></div></div><div class="preserved-strip">修改范围：两张合为一张。原第 1、2、5、6 张保持不变。</div><div class="stage-actions">${action('演示两图合一', 'next')}<span class="hint">展示真实返工结果，不调用模型</span></div>`;
  if (state.stage === 1) return `<h3 tabindex="-1">审核这一张合并图。</h3><p class="stage-lead">保留两段代码与运行结果，放在同一张图里。底部继续留给字幕。</p><div class="merge-after">${imageButton('merge-result.png', '合并后的正式图 · 取整组信息与再取具体价格')}</div><div class="merge-count"><span>原来 <strong>6</strong> 张</span><span aria-hidden="true">→</span><span>现在 <strong>5</strong> 张</span></div><div class="stage-actions">${action('合图通过（演示）', 'next')}</div>`;
  if (state.stage === 2) return `<h3 tabindex="-1">给剪辑的是完整五张图。</h3><p class="stage-lead">送审时只看修改图；审核后，交给下游的是已经更新的整组材料。</p><div class="asset-strip five">${thumbs(mergedCards)}</div>${checks([['同一任务、当前版本', '采用刚刚通过的合并图，原第 4 张不再单独进入交付。'], ['完整材料清单', '原第 1、2、5、6 张，加合并后的第 3 张，共 5 张；音频和字幕资料同时齐备。']])}<div class="stage-actions">${action('查看返工后的真实成片', 'next')}</div>`;
  if (state.stage === 3) return filmStage('rework');
  return completion('rework');
}

function filmStage(mode) {
  const normal = mode === 'normal';
  return `<h3 tabindex="-1">最后，完整看一遍成片。</h3><p class="stage-lead">检查画面、配音和字幕是否对应，再决定是否通过。发布仍由人完成。</p><video class="demo-film" controls playsinline preload="none" src="assets/${normal ? 'normal' : 'merge'}-film.mp4" poster="assets/${normal ? 'normal-01' : 'merge-result'}.png" aria-label="${normal ? '列表和字典怎么选' : '字典中嵌套字典'}历史成片"></video><p class="fine-print">真实历史成片，${normal ? '约 58 秒。本篇无中途改码或手工修改任务状态。' : '约 1 分 37 秒。本次历史任务有中途修复，之后完成交付与验收。'}</p><div class="stage-actions">${action('成片通过（演示）', 'next')}</div>`;
}

function completion(mode) {
  const normal = mode === 'normal';
  return `<div class="completion-badge" aria-hidden="true">✓</div><h3 tabindex="-1">你走完了${normal ? '一篇内容的协作流程' : '一次两图合一返工'}。</h3><p class="stage-lead">${normal ? '图卡与配音并行，审图、试听都通过后交给剪辑，成片再由人验收。' : '只修改目标图片，保留其余成果；从 6 张变成 5 张后，整组材料重新核对，再交给剪辑。'}</p><div class="summary-block">${normal ? '真实案例 034 已于 2026年10月24日完成成片验收。' : '真实案例 033 已完成合图、5 张正式图卡交付与成片验收；这是修复后完成的案例。'}<br>刚才的按钮只模拟审核，没有改写这些历史记录。</div><div class="stage-actions"><button class="button primary" data-action="other-mode">${normal ? '再体验两图合一' : '体验普通新篇'} →</button><a class="button secondary" href="#results" data-action="view-evidence">查看真实交付文件</a></div>`;
}

function switchMode(mode) {
  Object.assign(state, { mode, stage: 0, cards: false, voice: false });
  render();
}

function setEvidence(mode) {
  const normal = mode === 'normal';
  const title = normal ? '列表和字典怎么选' : '字典中嵌套字典';
  const video = $('#evidence-film');
  video.pause();
  video.src = `assets/${normal ? 'normal' : 'merge'}-film.mp4`;
  video.poster = `assets/${normal ? 'normal-01' : 'merge-result'}.png`;
  video.setAttribute('aria-label', `${title}真实成片`);
  video.load();
  $('#film-label').textContent = normal ? '案例 034 · 普通新篇' : '案例 033 · 合图返工';
  $('#film-duration').textContent = normal ? '成片时长 58 秒' : '成片时长 1 分 37 秒';
  $('#film-download').href = video.getAttribute('src');
  $('#film-download').download = `${title}_真实成片.mp4`;
  $('#evidence-title').textContent = title;
  $('#evidence-summary').textContent = normal ? '四张图卡与完整配音，经审图、试听后交给剪辑，成片再次由人工验收。' : '原第 3、4 张合成一张。整组图卡从六张变成五张，更新后交给剪辑完成视频。';
  const facts = normal ? [['实际结果', '4 张图卡、完整配音、带字幕视频'], ['验收记录', '2026年10月24日，成片已通过'], ['验证范围', '本篇无中途改码或手工修改任务状态']] : [['实际结果', '6 张变 5 张，五张正式图片用于剪辑'], ['验收记录', '成片已交付，人工验收已通过'], ['验证范围', '任务中途有修复，修复后完成交付']];
  $('#evidence-facts').innerHTML = facts.map(([title, body]) => `<div><dt>${title}</dt><dd>${body}</dd></div>`).join('');
  $('#evidence-cards').innerHTML = thumbs(normal ? normalCards : mergedCards);
  $('#evidence-cards').classList.toggle('five', !normal);
  $('#asset-heading').textContent = normal ? '这篇用到的真实图卡' : '合图后交给剪辑的五张正式图卡';
  $('#sample-links').hidden = !normal;
  document.querySelectorAll('[data-evidence]').forEach((button) => {
    const selected = button.dataset.evidence === mode;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
}

const roles = {
  dispatch: ['用户开工、选稿要求，以及已经确认的稿件。', '把同一篇任务分别交给图卡员和配音员。', '篇目明确，最终讲解稿和朗读稿齐备且核对通过。', '多篇候选时请人选择；缺稿时不自行猜写。'],
  cards: ['最终讲解稿，以及明确的图卡任务或返工要求。', '候选图片供审图；通过后交付最新完整图组。', '收到明确任务，所需输入可用。', '只改指定目标；审核由人决定，字幕区保留。'],
  voice: ['配音朗读稿，以及明确的配音任务或时间位置。', '候选音频供试听；通过后交付完整音频和字幕所需资料。', '收到明确任务，所需输入可用；重配先定位当前候选。', '试听由人决定；局部重配后仍交付完整音频。'],
  editor: ['已通过的图组、完整音频、朗读稿及字幕对应资料。', '带字幕的成片和视频附件，交给人验收。', '审图、试听均通过；任务、版本和材料齐备情况核对通过。', '不反查配音内部制作历史；上传发布由人完成。']
};
function setRole(role) {
  $('#role-detail').innerHTML = roles[role].map((body, i) => `<div><h4>${['接收什么', '交付什么', '开工条件', '职责边界'][i]}</h4><p>${body}</p></div>`).join('');
  document.querySelectorAll('[data-role]').forEach((button) => {
    const selected = button.dataset.role === role;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
}
const sop = [
  ['确定任务范围', '确认已有稿件、最终交付物，以及人负责审核与发布的部分。', '输入输出清单、人工负责事项。', '能说清做哪篇、用哪份稿、最后交什么、谁来审核。'],
  ['拆分岗位与开工条件', '逐个写清四个岗位接什么、交什么、什么时候开始。', '岗位分工说明。', '每项输出都有接收方，上游交出的材料足够下游使用。'],
  ['安排并行、等待和交接', '图卡与配音并行；剪辑等待两路通过，核对任务、版本、材料齐备。', '主流程、交接清单、开工条件。', '材料核对通过即可开工，不翻查配音内部制作历史。'],
  ['设置人工审核与返工', '先审图、试听，成片后再验收；返工只改目标部分，交接最新完整材料。', '审核意见、新候选、正式材料清单。', '目标正确、未改部分保留，新旧材料没有混用。'],
  ['测试结果，按证据处理问题', '核对真实文件、送达与人工结果；故障交所属项目修复，保留原版和回退说明。', '测试与交付记录；发生修复时记明范围和结果。', '区分正常通过、修复后通过和未验证项。'],
  ['整理方法，再用下一篇验证', '把已验证的分工、交接和审核做法整理进文档，用下一篇同类内容复核。', 'SOP、使用说明、真实样例。', '同类流程能再次完成；更换业务时重新确认输入、角色和验收要求。']
];
$('#sop-steps').innerHTML = sop.map(([title, task, artifact, done], i) => `<details${i === 0 ? ' open' : ''}><summary><span class="sop-index">0${i + 1}</span><strong>${title}</strong></summary><div class="sop-body"><p>${task}</p><p><strong>留下什么：</strong>${artifact}</p><p><strong>完成条件：</strong>${done}</p></div></details>`).join('');

document.addEventListener('click', (event) => {
  const button = event.target.closest('button, a');
  if (!button) return;
  if (button.dataset.mode) return switchMode(button.dataset.mode);
  if (button.dataset.evidence) return setEvidence(button.dataset.evidence);
  if (button.dataset.role) return setRole(button.dataset.role);
  if (button.dataset.image) {
    $('#dialog-image').src = button.dataset.image;
    $('#dialog-image').alt = button.dataset.caption;
    $('#image-caption').textContent = button.dataset.caption;
    $('#image-dialog').showModal();
    return;
  }
  const command = button.dataset.action;
  if (command === 'close-image') return $('#image-dialog').close();
  if (command === 'reset') return switchMode(state.mode);
  if (command === 'hero-start') return switchMode('normal');
  if (command === 'other-mode') return switchMode(state.mode === 'normal' ? 'rework' : 'normal');
  if (command === 'view-evidence') return setEvidence(state.mode);
  if (command === 'next') {
    if (state.mode === 'normal' && state.stage === 1 && (!state.cards || !state.voice)) return;
    if (state.stage < 4) { state.stage += 1; render(); $('#demo-content h3').focus({ preventScroll: true }); }
  }
  if (command === 'approve-cards' || command === 'approve-voice') {
    state[command === 'approve-cards' ? 'cards' : 'voice'] = true;
    // Keep the actual audio element and playback position while approving either lane.
    button.closest('.review-bottom').innerHTML = `<span class="approve-done">✓ 已在本页模拟${command === 'approve-cards' ? '审图' : '试听'}通过</span>`;
    const ready = state.cards && state.voice;
    const guard = $('.guard-hint');
    guard.classList.toggle('ready', ready);
    guard.textContent = ready ? '✓ 两路均已通过，可以进入材料核对。' : state.cards ? '还在等配音通过。图卡通过，不会替代试听。' : '还在等图卡通过。配音通过，不会替代审图。';
    $('#demo-content [data-action="next"]').disabled = !ready;
    $('#demo-message').textContent = guard.textContent;
    if (ready) $('#demo-content [data-action="next"]').focus({ preventScroll: true });
    else $('#demo-content [data-action^="approve-"]').focus({ preventScroll: true });
  }
});
$('#image-dialog').addEventListener('click', (event) => {
  if (event.target === $('#image-dialog')) $('#image-dialog').close();
});
document.addEventListener('play', (event) => {
  document.querySelectorAll('audio, video').forEach((media) => { if (media !== event.target) media.pause(); });
}, true);
render();
setRole('dispatch');
$('#evidence-cards').innerHTML = thumbs(normalCards);
