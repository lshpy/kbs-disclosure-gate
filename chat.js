// 검증이 대화창: 소개·증빙 제출·공시 게이트 어디서나 오른쪽 아래에 뜬다.
// 답은 Apps Script 중계(API)가 만든다. 키는 서버에만 있고 이 파일에는 없다.
(() => {
  const API = 'https://script.google.com/macros/s/AKfycbxBRN3a0u50TdrP1I7FvG_yWXa0PhFblTNJQCFiv6ys3nnOt_JQw0BvhnxIJVtUBKgK/exec';  // Apps Script 웹 앱 /exec 주소. 비어 있으면 Studio 작은 창으로 대신 연다
  const STUDIO = 'https://studio.upstage.ai/coworkers/cw_jbr4Yjmhg3eYMs6f4MnhxT/chat';  // Studio가 iframe을 막아 페이지 안에 넣을 수는 없음
  const css = `
#gjfab{position:fixed;right:20px;bottom:20px;z-index:50;background:#0b6e4f;color:#fff;border:0;border-radius:999px;padding:12px 18px;font:600 15px Pretendard,-apple-system,"Apple SD Gothic Neo",sans-serif;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.2)}
#gj{position:fixed;right:20px;bottom:20px;z-index:51;width:360px;max-width:calc(100vw - 24px);height:480px;max-height:calc(100vh - 40px);background:#fff;color:#16201c;border:1px solid #dfe5e2;border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,.18);display:none;flex-direction:column;font:14px/1.55 Pretendard,-apple-system,"Apple SD Gothic Neo",sans-serif;text-align:left}
#gj.on{display:flex}
#gj .gjh{padding:10px 14px;border-bottom:1px solid #dfe5e2;display:flex;align-items:center;gap:10px}
#gj .gjh b{flex:1;font-size:15px}
#gj .gjh button{background:none;border:0;color:#5d6b65;font:inherit;font-size:13px;cursor:pointer;padding:0}
#gjlog{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px}
#gjlog div{max-width:88%;padding:8px 11px;border-radius:10px;white-space:pre-wrap;word-break:break-word}
#gjlog .u{align-self:flex-end;background:#0b6e4f;color:#fff}
#gjlog .a{align-self:flex-start;background:#f6f8f7}
#gj form{display:flex;gap:6px;padding:10px;border-top:1px solid #dfe5e2;margin:0}
#gj input{flex:1;min-width:0;font:inherit;padding:8px 10px;border:1px solid #dfe5e2;border-radius:7px;background:#fff;color:inherit}
#gj form button{background:#0b6e4f;color:#fff;border:0;border-radius:7px;padding:8px 14px;font:inherit;cursor:pointer}`;
  document.head.append(Object.assign(document.createElement('style'), { textContent: css }));
  document.body.insertAdjacentHTML('beforeend', `
<button id="gjfab" type="button">검증이에게 묻기</button>
<div id="gj" role="dialog" aria-label="검증이 대화">
  <div class="gjh"><b>검증이</b><button type="button" id="gjstudio" title="Upstage Studio에서 열기">Studio ↗</button><button type="button" id="gjclose">닫기</button></div>
  <div id="gjlog" aria-live="polite"></div>
  <form><input maxlength="300" placeholder="판정 결과나 제출 방법을 물어보세요" aria-label="질문"><button>보내기</button></form>
</div>`);
  const $ = s => document.querySelector(s), log = $('#gjlog'), input = $('#gj input');
  let hist = [];
  const studio = () => window.open(STUDIO, 'geomjeungi', `popup,width=440,height=${Math.min(760, screen.availHeight)},left=${screen.availWidth - 460},top=40`);
  const say = (cls, text) => { const d = document.createElement('div'); d.className = cls; d.textContent = text; log.append(d); log.scrollTop = log.scrollHeight; return d; };
  async function send(q) {
    say('u', q); const wait = say('a', '…');
    try {
      const r = await (await fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'ask', set: window.GJ_SET ? window.GJ_SET() : null, q, history: hist }) })).json();
      wait.textContent = r.ok ? r.answer : r.error;
      if (r.ok) hist.push({ role: 'user', content: q }, { role: 'assistant', content: r.answer });
    } catch (e) { wait.textContent = '연결하지 못했습니다. 위의 Studio ↗ 로 열어 주세요.'; }
    log.scrollTop = log.scrollHeight;
  }
  function open(q) {
    if (!API) { if (q) navigator.clipboard.writeText(q).catch(() => {}); return studio(); }
    $('#gj').classList.add('on'); $('#gjfab').style.display = 'none';
    if (!log.children.length) say('a', '안녕하세요, 검증이입니다. 8개 법인의 판정 결과와 증빙 제출 방법을 안내해 드립니다.');
    if (q) send(q);
    input.focus();
  }
  $('#gjfab').onclick = () => open();
  $('#gjclose').onclick = () => { $('#gj').classList.remove('on'); $('#gjfab').style.display = ''; };
  $('#gjstudio').onclick = studio;
  $('#gj form').onsubmit = e => { e.preventDefault(); const q = input.value.trim(); if (!q) return; input.value = ''; send(q); };
  window.GJ = { open };
})();
