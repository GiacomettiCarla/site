/* =========================================================
   DIGITAL GROWTH — Before/after dashboards by niche
   Generates N comparator boxes and wires drag (desktop)
   + Antes/Depois toggle (mobile) for each.
   Metric tuple: [label, value, arrow('up'|'down'), delta, tone('pos'|'neg')]
   ========================================================= */
(function () {
  "use strict";

  const NICHES = [
    {
      niche: "Cabos e informática",
      before: [
        ["Vendas por Produto", "612", "down", "10%", "neg"],
        ["Vendas sem Produto", "248", "down", "6%", "neg"],
        ["ACOS", "8,7%", "up", "19%", "neg"],
        ["Cliques", "16.300", "down", "12%", "neg"],
        ["Receita", "R$ 162.300", "down", "8%", "neg"],
        ["Investimento", "R$ 14.980", "up", "9%", "neg"],
      ],
      after: [
        ["Vendas por Produto", "1.842", "up", "142%", "pos"],
        ["Vendas sem Produto", "760", "up", "198%", "pos"],
        ["ACOS", "3,2%", "down", "41%", "pos"],
        ["Cliques", "38.910", "up", "121%", "pos"],
        ["Receita", "R$ 512.640", "up", "188%", "pos"],
        ["Investimento", "R$ 18.420", "up", "96%", "pos"],
      ],
    },
    {
      niche: "Ferramentas",
      before: [
        ["Vendas por Produto", "906", "down", "12%", "neg"],
        ["Vendas sem Produto", "324", "down", "8%", "neg"],
        ["ACOS", "11,9%", "up", "26%", "neg"],
        ["Cliques", "23.450", "down", "14%", "neg"],
        ["Receita", "R$ 245.380", "down", "9%", "neg"],
        ["Investimento", "R$ 29.210", "up", "7%", "neg"],
      ],
      after: [
        ["Vendas por Produto", "2.511", "up", "177%", "pos"],
        ["Vendas sem Produto", "1.052", "up", "225%", "pos"],
        ["ACOS", "4,18%", "down", "30%", "pos"],
        ["Cliques", "55.827", "up", "138%", "pos"],
        ["Receita", "R$ 856.902", "up", "249%", "pos"],
        ["Investimento", "R$ 35.799,63", "up", "145%", "pos"],
      ],
    },
    {
      niche: "Auto peças",
      before: [
        ["Vendas por Produto", "740", "down", "18%", "neg"],
        ["Vendas sem Produto", "290", "down", "22%", "neg"],
        ["ACOS", "13,4%", "up", "34%", "neg"],
        ["Cliques", "19.870", "down", "19%", "neg"],
        ["Receita", "R$ 268.900", "down", "21%", "neg"],
        ["Investimento", "R$ 38.600", "up", "12%", "neg"],
      ],
      after: [
        ["Vendas por Produto", "3.180", "up", "210%", "pos"],
        ["Vendas sem Produto", "1.440", "up", "264%", "pos"],
        ["ACOS", "5,1%", "down", "28%", "pos"],
        ["Cliques", "61.240", "up", "156%", "pos"],
        ["Receita", "R$ 1.024.500", "up", "287%", "pos"],
        ["Investimento", "R$ 42.300", "up", "132%", "pos"],
      ],
    },
  ];

  const PATH = {
    before: {
      line: "M20,206 C120,200 180,212 280,205 C380,198 450,210 540,206 C650,201 730,213 820,207 C890,203 950,209 980,212",
      dash: "M20,224 C140,220 220,228 320,224 C440,219 520,226 620,223 C740,219 840,226 980,224",
      stroke: "oklch(0.64 0.165 252)", fill: "oklch(0.64 0.165 252)", fillOp: 0.16,
      dashStroke: "rgba(13,18,33,.22)", dates: ["1 jan. 2025 – 31 jan. 2025", "Comparado com: 1 dez. 2024 – 31 dez. 2024"],
      x: ["01 JAN", "16 JAN", "31 JAN"],
    },
    after: {
      line: "M20,210 C120,196 190,184 280,176 C390,164 470,146 560,128 C670,106 750,90 840,76 C900,67 950,60 980,55",
      dash: "M20,222 C140,212 220,200 320,190 C440,178 520,160 620,140 C740,118 840,96 980,74",
      stroke: "oklch(0.62 0.16 162)", fill: "oklch(0.80 0.135 168)", fillOp: 0.22,
      dashStroke: "rgba(13,18,33,.18)", dates: ["1 jan. 2025 – 31 jan. 2025", "Comparado com: 1 dez. 2024 – 31 dez. 2024"],
      x: ["01 JAN", "16 JAN", "31 JAN"],
    },
  };

  function metricCard(m, i) {
    const accent = i === 0 ? " dsh__metric--accent" : "";
    const arrow = m[2] === "up" ? "▲" : "▼";
    const tone = m[4] === "pos" ? "up" : "down";
    return '<div class="dsh__metric' + accent + '"><div class="dsh__metric-label">' + m[0] +
      '</div><div class="dsh__metric-row"><span class="dsh__metric-val">' + m[1] +
      '</span><span class="dsh__delta dsh__delta--' + tone + '">' + arrow + " " + m[3] +
      "</span></div></div>";
  }

  function dashboard(side, metrics, idx) {
    const p = PATH[side];
    const grad = "bnaGrad-" + side + "-" + idx;
    return '' +
      '<div class="dsh dsh--' + side + '">' +
        '<div class="dsh__top"><span class="dsh__title">Métricas</span><div class="dsh__dates">' +
          '<span class="dsh__date">' + p.dates[0] + '</span>' +
          '<span class="dsh__date dsh__date--muted">' + p.dates[1] + '</span>' +
        '</div></div>' +
        '<div class="dsh__metrics">' + metrics.map(metricCard).join("") + '</div>' +
        '<div class="dsh__chart">' +
          '<svg viewBox="0 0 1000 270" preserveAspectRatio="none" role="img" aria-hidden="true">' +
            '<defs><linearGradient id="' + grad + '" x1="0" y1="0" x2="0" y2="1">' +
              '<stop offset="0" stop-color="' + p.fill + '" stop-opacity="' + p.fillOp + '"></stop>' +
              '<stop offset="1" stop-color="' + p.fill + '" stop-opacity="0"></stop>' +
            '</linearGradient></defs>' +
            '<line x1="20" y1="70" x2="980" y2="70" stroke="rgba(13,18,33,.1)" stroke-dasharray="2 7"></line>' +
            '<line x1="20" y1="140" x2="980" y2="140" stroke="rgba(13,18,33,.1)" stroke-dasharray="2 7"></line>' +
            '<line x1="20" y1="210" x2="980" y2="210" stroke="rgba(13,18,33,.1)" stroke-dasharray="2 7"></line>' +
            '<path d="' + p.line + ' L980,250 L20,250 Z" fill="url(#' + grad + ')"></path>' +
            '<path d="' + p.dash + '" fill="none" stroke="' + p.dashStroke + '" stroke-width="2" stroke-dasharray="6 6"></path>' +
            '<path d="' + p.line + '" fill="none" stroke="' + p.stroke + '" stroke-width="3" stroke-linecap="round"></path>' +
          '</svg>' +
          '<div class="dsh__xaxis"><span>' + p.x[0] + '</span><span>' + p.x[1] + '</span><span>' + p.x[2] + '</span></div>' +
        '</div>' +
      '</div>';
  }

  function block(n, idx) {
    return '' +
      '<div class="bna-block">' +
        '<div class="bna__niche"><span class="bna__niche-k">Nicho</span>' +
          '<h3 class="bna__niche-name">' + n.niche + '</h3></div>' +
        '<div class="bna-wrap">' +
          '<div class="bna__head" role="group" aria-label="Alternar entre antes e depois">' +
            '<button class="bna__btn is-active" type="button" data-side="before">Antes da DG</button>' +
            '<button class="bna__btn" type="button" data-side="after">Depois da DG</button>' +
          '</div>' +
          '<figure class="bna" aria-label="Comparativo de ' + n.niche + ' antes e depois da Digital Growth">' +
            '<div class="bna__layer bna__layer--before">' + dashboard("before", n.before, idx) + '</div>' +
            '<div class="bna__layer bna__layer--after">' + dashboard("after", n.after, idx) + '</div>' +
            '<div class="bna__divider"></div>' +
            '<div class="bna__hint">Arraste para comparar</div>' +
            '<button class="bna__handle" type="button" role="slider" tabindex="0" aria-label="Arraste para comparar antes e depois" aria-valuemin="0" aria-valuemax="100" aria-valuenow="52">' +
              '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M9 7l-4 5 4 5M15 7l4 5-4 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>' +
            '</button>' +
          '</figure>' +
        '</div>' +
      '</div>';
  }

  function initBna(bna, withNudge) {
    const handle = bna.querySelector(".bna__handle");
    const wrap = bna.closest(".bna-wrap") || bna.parentElement;
    const btnBefore = wrap.querySelector('[data-side="before"]');
    const btnAfter = wrap.querySelector('[data-side="after"]');
    const isMobile = () => window.matchMedia("(max-width: 760px)").matches;
    let pos = 52, dragging = false, interacted = false, nudgeTimers = [];

    function setActive() {
      const beforeActive = pos >= 50;
      if (btnBefore) btnBefore.classList.toggle("is-active", beforeActive);
      if (btnAfter) btnAfter.classList.toggle("is-active", !beforeActive);
    }
    function setPos(p, allowFull) {
      pos = allowFull ? Math.max(0, Math.min(100, p)) : Math.max(6, Math.min(94, p));
      bna.style.setProperty("--pos", pos + "%");
      if (handle) handle.setAttribute("aria-valuenow", Math.round(pos));
      setActive();
    }
    function fromX(clientX) {
      const r = bna.getBoundingClientRect();
      return ((clientX - r.left) / r.width) * 100;
    }
    function cancelNudge() { nudgeTimers.forEach(clearTimeout); nudgeTimers = []; bna.classList.remove("bna--anim"); }
    function firstInteract() { if (interacted) return; interacted = true; cancelNudge(); bna.classList.add("bna--touched"); }
    function onDown(e) {
      dragging = true; firstInteract();
      bna.classList.remove("bna--anim");
      setPos(fromX(e.clientX));
      if (handle) handle.focus({ preventScroll: true });
      e.preventDefault();
    }
    function onMove(e) { if (dragging) setPos(fromX(e.clientX)); }
    function onUp() { dragging = false; }

    bna.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    if (handle) {
      handle.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") { firstInteract(); setPos(pos - 4); e.preventDefault(); }
        else if (e.key === "ArrowRight") { firstInteract(); setPos(pos + 4); e.preventDefault(); }
      });
    }
    [btnBefore, btnAfter].forEach((b) => {
      if (!b) return;
      b.addEventListener("click", () => {
        firstInteract();
        bna.classList.add("bna--anim");
        const isB = b.dataset.side === "before";
        setPos(isMobile() ? (isB ? 100 : 0) : (isB ? 88 : 12), true);
      });
    });

    setPos(50, true);

    function nudge() {
      if (interacted) return;
      bna.classList.add("bna--anim");
      [[0, 50], [500, 64], [1250, 36], [2000, 50]].forEach(([t, p]) =>
        nudgeTimers.push(setTimeout(() => { if (!interacted) setPos(p); }, t)));
      nudgeTimers.push(setTimeout(() => { if (!interacted) bna.classList.remove("bna--anim"); }, 2700));
    }
    const io = new IntersectionObserver((ents) => {
      ents.forEach((en) => {
        if (en.isIntersecting) { io.disconnect(); if (withNudge) setTimeout(nudge, 550); }
      });
    }, { threshold: 0.45 });
    io.observe(bna);
  }

  function build() {
    const mount = document.getElementById("cases-bna");
    if (!mount) return;
    mount.innerHTML = NICHES.map(block).join("");
    const all = mount.querySelectorAll(".bna");
    all.forEach((bna, i) => initBna(bna, i === 0));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
