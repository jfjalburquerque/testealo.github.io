/* Test gratuito de captación (landing SEO).
 * Widget vanilla JS: carga preguntas del endpoint público, corrige en cliente,
 * muestra explicación y una pantalla de resultado con CTA a la app.
 * No requiere registro ni login.
 */
(function () {
  "use strict";

  var API_BASE =
    window.TESTEALO_API_BASE ||
    (location.hostname === "localhost" || location.hostname === "127.0.0.1"
      ? "http://localhost:5000"
      : "https://api.testealo.net");

  var STORE = {
    ios: "https://apps.apple.com/us/app/testealo/id6759055279",
    android: "https://play.google.com/store/apps/details?id=com.testealo",
    web: "https://app.testealo.net",
  };

  /* ---------- UTM / atribución ---------- */
  var UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

  function captureUtms() {
    try {
      var params = new URLSearchParams(location.search);
      var found = {};
      UTM_KEYS.forEach(function (k) {
        if (params.get(k)) found[k] = params.get(k);
      });
      if (Object.keys(found).length) {
        localStorage.setItem("testealo_utms", JSON.stringify(found));
      }
    } catch (e) {}
  }

  function storedUtms() {
    try {
      return JSON.parse(localStorage.getItem("testealo_utms") || "{}");
    } catch (e) {
      return {};
    }
  }

  function appendUtms(url, extra) {
    var utms = storedUtms();
    if (extra) Object.keys(extra).forEach(function (k) { utms[k] = extra[k]; });
    var keys = Object.keys(utms);
    if (!keys.length) return url;
    var sep = url.indexOf("?") === -1 ? "?" : "&";
    return url + sep + keys.map(function (k) {
      return encodeURIComponent(k) + "=" + encodeURIComponent(utms[k]);
    }).join("&");
  }

  /* ---------- Analítica (GA4 vía gtag) ---------- */
  function track(event, params) {
    try {
      if (typeof window.gtag === "function") window.gtag("event", event, params || {});
    } catch (e) {}
    if (window.TESTEALO_DEBUG) console.log("[track]", event, params || {});
  }

  /* ---------- Utilidades DOM ---------- */
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function esc(s) {
    var d = document.createElement("div");
    d.textContent = s == null ? "" : String(s);
    return d.innerHTML;
  }

  /* ---------- Widget ---------- */
  function FreeTest(root) {
    this.root = root;
    this.slug = root.getAttribute("data-slug");
    this.label = root.getAttribute("data-label") || "tu oposición";
    this.questions = [];
    this.index = 0;
    this.score = 0;
    this.topicErrors = {};
    this.topicTotals = {};
  }

  FreeTest.prototype.renderStart = function () {
    var self = this;
    this.root.innerHTML = "";
    var card = el("div", "ft-card ft-start");
    card.appendChild(el("div", "ft-kicker", "Test gratuito · sin registro"));
    card.appendChild(el("h2", "ft-h2", "Pon a prueba tu nivel de <em>" + esc(this.label) + "</em>"));
    card.appendChild(el("p", "ft-p", "10 preguntas reales. Corrección al instante con explicación. Descubre en 3 minutos qué temas llevas peor."));
    var btn = el("button", "ft-btn ft-btn-primary", "Empezar test →");
    btn.addEventListener("click", function () { self.start(); });
    card.appendChild(btn);
    this.root.appendChild(card);
    track("landing_test_ready", { slug: this.slug });
  };

  FreeTest.prototype.start = function () {
    var self = this;
    track("free_test_started", { slug: this.slug, oposicion: this.label });
    this.root.innerHTML = "";
    var loading = el("div", "ft-card ft-loading", '<div class="ft-spinner"></div><p class="ft-p">Cargando preguntas…</p>');
    this.root.appendChild(loading);

    fetch(API_BASE + "/api/v1/public/free-test/" + encodeURIComponent(this.slug) + "?count=10")
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (data) {
        self.questions = data.questions || [];
        if (self.label === "tu oposición" && data.label) self.label = data.label;
        if (!self.questions.length) throw new Error("empty");
        self.index = 0;
        self.score = 0;
        self.topicErrors = {};
        self.topicTotals = {};
        self.renderQuestion();
      })
      .catch(function () {
        self.root.innerHTML = "";
        var err = el("div", "ft-card", '<p class="ft-p">No hemos podido cargar el test ahora mismo.</p>');
        var retry = el("button", "ft-btn ft-btn-primary", "Reintentar");
        retry.addEventListener("click", function () { self.start(); });
        err.appendChild(retry);
        self.root.appendChild(err);
      });
  };

  FreeTest.prototype.renderQuestion = function () {
    var self = this;
    var q = this.questions[this.index];
    var total = this.questions.length;
    this.root.innerHTML = "";

    var card = el("div", "ft-card");
    var pct = Math.round((this.index / total) * 100);
    card.appendChild(el("div", "ft-progress", '<span style="width:' + pct + '%"></span>'));
    card.appendChild(el("div", "ft-qmeta", "Pregunta " + (this.index + 1) + " de " + total + " · " + esc(q.topic_title || this.label)));
    card.appendChild(el("h3", "ft-question", esc(q.text)));

    var opts = el("div", "ft-options");
    (q.answers || []).forEach(function (a) {
      var b = el("button", "ft-option", esc(a.text));
      b.addEventListener("click", function () { self.answer(q, a, opts, card); });
      opts.appendChild(b);
    });
    card.appendChild(opts);
    this.root.appendChild(card);
    this.root.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  FreeTest.prototype.answer = function (q, chosen, opts, card) {
    var self = this;
    var topic = q.topic_title || this.label;
    this.topicTotals[topic] = (this.topicTotals[topic] || 0) + 1;

    var correct = !!chosen.is_correct;
    if (correct) this.score++;
    else this.topicErrors[topic] = (this.topicErrors[topic] || 0) + 1;

    var buttons = opts.querySelectorAll(".ft-option");
    q.answers.forEach(function (a, i) {
      var b = buttons[i];
      b.disabled = true;
      if (a.is_correct) b.classList.add("ft-correct");
      if (a === chosen && !correct) b.classList.add("ft-wrong");
    });

    track("free_test_question_answered", {
      slug: this.slug,
      question_index: this.index + 1,
      correct: correct,
    });

    if (q.reference) {
      card.appendChild(el("div", "ft-explain", "<strong>Explicación:</strong> " + esc(q.reference)));
    }

    var next = el("button", "ft-btn ft-btn-primary ft-next",
      this.index + 1 < this.questions.length ? "Siguiente →" : "Ver resultado →");
    next.addEventListener("click", function () {
      self.index++;
      if (self.index < self.questions.length) self.renderQuestion();
      else self.renderResult();
    });
    card.appendChild(next);
  };

  FreeTest.prototype.weakestTopic = function () {
    var worst = null, max = 0;
    var self = this;
    Object.keys(this.topicErrors).forEach(function (t) {
      if (self.topicErrors[t] > max) { max = self.topicErrors[t]; worst = t; }
    });
    return worst;
  };

  FreeTest.prototype.renderResult = function () {
    var self = this;
    var total = this.questions.length;
    var weak = this.weakestTopic();
    this.root.innerHTML = "";

    track("free_test_completed", {
      slug: this.slug,
      score: this.score,
      total: total,
      weakest_topic: weak || "",
    });

    var card = el("div", "ft-card ft-result");
    card.appendChild(el("div", "ft-kicker", "Tu resultado"));
    card.appendChild(el("div", "ft-score", this.score + "<span>/" + total + "</span>"));
    var msg = weak
      ? "Tu punto débil es <em>" + esc(weak) + "</em>. En Testéalo puedes repasar solo esas preguntas hasta dominarlas."
      : "¡Gran resultado! En Testéalo puedes seguir practicando y compararte con otros opositores.";
    card.appendChild(el("p", "ft-p", msg));

    var cta = el("p", "ft-p ft-cta-text", "Descarga Testéalo para guardar tus errores, repetirlos y medir tu progreso por tema.");
    card.appendChild(cta);

    var stores = el("div", "ft-stores");
    stores.appendChild(this.storeLink("android", "Google Play"));
    stores.appendChild(this.storeLink("ios", "App Store"));
    stores.appendChild(this.storeLink("web", "Web App"));
    card.appendChild(stores);

    var actions = el("div", "ft-result-actions");
    var share = el("button", "ft-btn ft-btn-secondary", "Compartir resultado");
    share.addEventListener("click", function () { self.shareResult(weak); });
    actions.appendChild(share);
    var again = el("button", "ft-btn ft-btn-ghost", "Repetir test");
    again.addEventListener("click", function () { self.start(); });
    actions.appendChild(again);
    card.appendChild(actions);

    this.root.appendChild(card);
    this.root.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  FreeTest.prototype.storeLink = function (kind, label) {
    var self = this;
    var utms = storedUtms();
    var a = el("a", "ft-store", label);
    // Preservamos la atribución de entrada (utm_source/campaign) y añadimos la
    // oposición en utm_content para saber qué landing generó la instalación.
    a.href = appendUtms(STORE[kind], {
      utm_source: utms.utm_source || "landing",
      utm_medium: "free_test",
      utm_campaign: utms.utm_campaign || this.slug,
      utm_content: this.slug,
    });
    a.target = "_blank";
    a.rel = "noopener";
    a.addEventListener("click", function () {
      track("store_link_clicked", { slug: self.slug, store: kind });
    });
    return a;
  };

  /* ---------- Compartir resultado (imagen de marca) ---------- */
  FreeTest.prototype.shareResult = function (weak) {
    var self = this;
    var blob = drawResultImage(this.score, this.questions.length, this.label, weak);
    var shareUrl = appendUtms("https://testealo.net/", {
      utm_source: "share",
      utm_medium: "free_test_result",
      utm_campaign: this.slug,
    });
    var text = "He conseguido " + this.score + "/" + this.questions.length +
      " en el test de " + this.label + " de Testéalo. ¿Puedes superarme? " + shareUrl;

    track("result_shared", { slug: this.slug, score: this.score });

    if (blob && navigator.canShare) {
      var file = new File([blob], "testealo-resultado.png", { type: "image/png" });
      if (navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], text: text }).catch(function () {});
        return;
      }
    }
    if (navigator.share) {
      navigator.share({ text: text }).catch(function () {});
      return;
    }
    // Fallback: descargar imagen + copiar enlace
    if (blob) {
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "testealo-resultado.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    }
    try {
      navigator.clipboard.writeText(text);
      alert("Imagen descargada y enlace copiado. ¡Compártelo!");
    } catch (e) {}
  };

  /* Dibuja una imagen 1080x1920 (formato Stories) con marca Testéalo. */
  function drawResultImage(score, total, label, weak) {
    try {
      var W = 1080, H = 1920;
      var c = document.createElement("canvas");
      c.width = W; c.height = H;
      var ctx = c.getContext("2d");

      // Fondo oscuro con halo amarillo
      ctx.fillStyle = "#1E1F23";
      ctx.fillRect(0, 0, W, H);
      var grad = ctx.createRadialGradient(W * 0.7, H * 0.32, 60, W * 0.7, H * 0.32, 700);
      grad.addColorStop(0, "rgba(245,184,0,0.22)");
      grad.addColorStop(1, "rgba(245,184,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      ctx.textAlign = "center";

      // Wordmark
      ctx.fillStyle = "#F5B800";
      ctx.font = "800 64px Nunito, Arial, sans-serif";
      ctx.fillText("Testéalo", W / 2, 220);

      // Oposición
      ctx.fillStyle = "#8A8B95";
      ctx.font = "600 40px Nunito, Arial, sans-serif";
      wrapText(ctx, label.toUpperCase(), W / 2, 320, W - 200, 52);

      // Score grande
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "900 340px Nunito, Arial, sans-serif";
      ctx.fillText(String(score), W / 2, 900);
      ctx.fillStyle = "#8A8B95";
      ctx.font = "800 120px Nunito, Arial, sans-serif";
      ctx.fillText("/ " + total, W / 2, 1030);

      // Mensaje
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "700 52px Nunito, Arial, sans-serif";
      var line = weak ? "Mi punto débil: " + weak : "¡Test superado!";
      wrapText(ctx, line, W / 2, 1220, W - 160, 64);

      // CTA
      ctx.fillStyle = "#F5B800";
      ctx.font = "800 60px Nunito, Arial, sans-serif";
      ctx.fillText("¿Puedes superarme?", W / 2, 1560);
      ctx.fillStyle = "#8A8B95";
      ctx.font = "600 42px Nunito, Arial, sans-serif";
      ctx.fillText("testealo.net", W / 2, 1700);

      return dataURLtoBlob(c.toDataURL("image/png"));
    } catch (e) {
      return null;
    }
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    var words = String(text).split(" ");
    var line = "", lines = [];
    for (var i = 0; i < words.length; i++) {
      var test = line ? line + " " + words[i] : words[i];
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = words[i];
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    for (var j = 0; j < lines.length; j++) {
      ctx.fillText(lines[j], x, y + j * lineHeight);
    }
  }

  function dataURLtoBlob(dataURL) {
    var parts = dataURL.split(",");
    var mime = parts[0].match(/:(.*?);/)[1];
    var bin = atob(parts[1]);
    var arr = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return new Blob([arr], { type: mime });
  }

  /* ---------- Init ---------- */
  function init() {
    captureUtms();
    track("landing_page_view", { page_path: location.pathname });
    var root = document.getElementById("free-test");
    if (!root) return;
    new FreeTest(root).renderStart();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
