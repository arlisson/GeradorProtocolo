document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("protocol-form");
  const resultBox = document.getElementById("result");
  const feedbackBox = document.getElementById("feedback");
  const protoEl = document.getElementById("proto");
  const generatedAtEl = document.getElementById("generated-at");
  const msgEl = document.getElementById("msg");

  const btnClear = document.getElementById("btn-clear");
  const btnCopyProto = document.getElementById("btn-copy-proto");
  const btnCopyMsg = document.getElementById("btn-copy-msg");

  initMobileSidebar(document.getElementById("mobile-menu-btn"));
  initTheme(document.getElementById("theme-toggle"));

  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    const now = new Date();
    const protocol = generateProtocol(now);
    const data = {
      protocol,
      generatedAt: formatDateTime(now),
    };

    if (protoEl) protoEl.textContent = data.protocol;
    if (generatedAtEl) generatedAtEl.textContent = data.generatedAt;
    if (msgEl) msgEl.value = buildMessage(data);
    if (resultBox) resultBox.hidden = false;

    showFeedback("Protocolo gerado com sucesso.");
  });

  btnClear?.addEventListener("click", () => {
    form?.reset();
    if (protoEl) protoEl.textContent = "";
    if (generatedAtEl) generatedAtEl.textContent = "";
    if (msgEl) msgEl.value = "";
    if (resultBox) resultBox.hidden = true;
    hideFeedback();
  });

  btnCopyProto?.addEventListener("click", async () => {
    const text = protoEl?.textContent || "";
    if (!text) return;
    await copyText(text, "Protocolo copiado.");
  });

  btnCopyMsg?.addEventListener("click", async () => {
    const text = msgEl?.value || "";
    if (!text) return;
    await copyText(text, "Mensagem copiada.");
  });

  async function copyText(text, successMessage) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        fallbackCopy(text);
      }
      showFeedback(successMessage);
    } catch {
      showFeedback("Não foi possível copiar automaticamente. Selecione o texto e copie manualmente.", true);
    }
  }

  function showFeedback(message, isError = false) {
    if (!feedbackBox) return;
    feedbackBox.textContent = message;
    feedbackBox.classList.toggle("error", isError);
    feedbackBox.hidden = false;
  }

  function hideFeedback() {
    if (!feedbackBox) return;
    feedbackBox.textContent = "";
    feedbackBox.classList.remove("error");
    feedbackBox.hidden = true;
  }
});

function generateProtocol(date) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yy = String(date.getFullYear()).slice(-2);
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  const ms = String(date.getMilliseconds()).padStart(3, "0");

  return `${dd}${mm}${yy}${hh}${mi}${ss}${ms}`;
}

function buildMessage(data) {
  return [
    `Seu atendimento foi registrado sob o protocolo ${data.protocol}.`,
    "Guarde este número para confirmar a autenticidade em novos contatos.",
  ].filter(Boolean).join("\n");
}

function formatDateTime(date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(date);
}

function fallbackCopy(text) {
  const temp = document.createElement("textarea");
  temp.value = text;
  temp.setAttribute("readonly", "");
  temp.style.position = "fixed";
  temp.style.left = "-9999px";
  temp.style.top = "0";
  document.body.appendChild(temp);
  temp.focus();
  temp.select();

  try {
    document.execCommand("copy");
  } finally {
    document.body.removeChild(temp);
  }
}

function initMobileSidebar(menuBtn) {
  if (!menuBtn) return;

  menuBtn.addEventListener("click", () => {
    document.body.classList.toggle("sidebar-open");
  });

  document.addEventListener("click", (event) => {
    if (!document.body.classList.contains("sidebar-open")) return;

    const sidebar = document.querySelector(".sidebar");
    if (!sidebar?.contains(event.target) && !menuBtn.contains(event.target)) {
      document.body.classList.remove("sidebar-open");
    }
  });
}

function initTheme(themeToggle) {
  if (!themeToggle) return;

  const savedTheme = localStorage.getItem("protocol-theme");
  const isLight = savedTheme === "light";

  document.body.classList.toggle("light-mode", isLight);
  updateThemeIcon(themeToggle);

  themeToggle.addEventListener("click", () => {
    const nowLight = document.body.classList.toggle("light-mode");
    localStorage.setItem("protocol-theme", nowLight ? "light" : "dark");
    updateThemeIcon(themeToggle);
  });
}

function updateThemeIcon(btn) {
  const icon = btn.querySelector("i");
  const text = btn.querySelector("span");
  const isLight = document.body.classList.contains("light-mode");

  if (icon) icon.className = isLight ? "ph ph-moon" : "ph ph-sun";
  if (text) text.textContent = isLight ? "Modo escuro" : "Modo claro";
}
