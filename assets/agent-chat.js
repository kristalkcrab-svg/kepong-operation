(function () {
  let history = [];

  const style = document.createElement('style');
  style.textContent = `
    #tc-agent-btn {
      position: fixed; bottom: 20px; right: 20px; width: 56px; height: 56px;
      border-radius: 50%; background: #1a1a2e; color: white; border: none;
      font-size: 24px; cursor: pointer; z-index: 9999; box-shadow: 0 2px 10px rgba(0,0,0,.3);
    }
    #tc-agent-panel {
      position: fixed; bottom: 88px; right: 20px; width: 340px; height: 460px;
      background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,.25);
      display: none; flex-direction: column; z-index: 9999; overflow: hidden;
      font-family: -apple-system, sans-serif;
    }
    #tc-agent-panel.open { display: flex; }
    #tc-agent-header { background: #1a1a2e; color: white; padding: 12px 16px; font-weight: 600; font-size: 14px; }
    #tc-agent-messages { flex: 1; overflow-y: auto; padding: 12px; font-size: 13px; }
    #tc-agent-messages .msg { margin-bottom: 10px; line-height: 1.4; white-space: pre-wrap; }
    #tc-agent-messages .user { text-align: right; color: #1a1a2e; }
    #tc-agent-messages .bot { text-align: left; color: #333; }
    #tc-agent-input-row { display: flex; border-top: 1px solid #eee; }
    #tc-agent-input { flex: 1; border: none; padding: 10px; font-size: 13px; outline: none; }
    #tc-agent-send { border: none; background: #1a1a2e; color: white; padding: 0 16px; cursor: pointer; }
  `;
  document.head.appendChild(style);

  const btn = document.createElement('button');
  btn.id = 'tc-agent-btn';
  btn.textContent = '🦀';
  document.body.appendChild(btn);

  const panel = document.createElement('div');
  panel.id = 'tc-agent-panel';
  panel.innerHTML = `
    <div id="tc-agent-header">TALKCRAB 营运助理</div>
    <div id="tc-agent-messages"></div>
    <div id="tc-agent-input-row">
      <input id="tc-agent-input" placeholder="问数据，或叫我登记支出..." />
      <button id="tc-agent-send">送出</button>
    </div>
  `;
  document.body.appendChild(panel);

  btn.onclick = () => panel.classList.toggle('open');

  const messagesEl = panel.querySelector('#tc-agent-messages');
  const inputEl = panel.querySelector('#tc-agent-input');
  const sendBtn = panel.querySelector('#tc-agent-send');

  function addMsg(text, who) {
    const div = document.createElement('div');
    div.className = `msg ${who}`;
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  async function send() {
    const text = inputEl.value.trim();
    if (!text) return;
    addMsg(text, 'user');
    inputEl.value = '';
    addMsg('...', 'bot');

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      });
      const data = await res.json();
      messagesEl.removeChild(messagesEl.lastChild);
      addMsg(data.reply || '出错了，请再试一次', 'bot');
      history = data.history || history;
    } catch (err) {
      messagesEl.removeChild(messagesEl.lastChild);
      addMsg('连接失败，检查网络', 'bot');
    }
  }

  sendBtn.onclick = send;
  inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
})();
