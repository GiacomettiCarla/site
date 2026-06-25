/* =========================================================
   DIGITAL GROWTH — Home interactions
   ========================================================= */
(function () {
  "use strict";

  /* ---- Duplicate logo marquee for seamless loop ---- */
  const logoTrack = document.getElementById("logo-track");
  if (logoTrack) {
    logoTrack.innerHTML += logoTrack.innerHTML;
  }

  /* ---- Comparison table icons ---- */
  const icYes = '<svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const icNo = '<svg viewBox="0 0 24 24" fill="none"><path d="M7 7l10 10M17 7L7 17" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/></svg>';
  document.querySelectorAll(".cmp2-ic--yes").forEach((e) => (e.innerHTML = icYes));
  document.querySelectorAll(".cmp2-ic--no").forEach((e) => (e.innerHTML = icNo));

  /* ---- Nav scroll state + scroll progress ---- */
  const nav = document.querySelector(".nav");
  const progress = document.querySelector(".scroll-progress");
  function onScroll() {
    const y = window.scrollY;
    if (nav) nav.classList.toggle("scrolled", y > 24);
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Scroll reveal (manual viewport check + force-show fallback) ----
     Some embedded preview environments freeze CSS transitions at their start
     frame, which would leave opacity:0 content invisible. So: elements above
     the fold are shown instantly, below-fold ones animate on scroll, and a
     safety net force-shows anything still hidden. */
  const revealEls = Array.from(document.querySelectorAll(".reveal, .reveal-stagger"));
  const counters = Array.from(document.querySelectorAll("[data-count]"));
  const countersDone = new WeakSet();

  function inView(el, ratio) {
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const trigger = vh * (ratio == null ? 0.88 : ratio);
    return r.top < trigger && r.bottom > 0;
  }

  function forceShow(el) {
    el.classList.add("in");
    const nodes = el.classList.contains("reveal-stagger") ? [el, ...el.children] : [el];
    nodes.forEach((n) => {
      n.style.transition = "none";
      n.style.opacity = "1";
      n.style.transform = "none";
    });
  }

  function reveal(el) {
    el.classList.add("in");
    const idx = revealEls.indexOf(el);
    if (idx > -1) revealEls.splice(idx, 1);
  }

  function checkReveal() {
    for (let i = revealEls.length - 1; i >= 0; i--) {
      if (inView(revealEls[i])) reveal(revealEls[i]);
    }
    counters.forEach((el) => {
      if (!countersDone.has(el) && inView(el, 0.92)) {
        countersDone.add(el);
        animateCount(el);
      }
    });
  }

  // Above-the-fold: show instantly so nothing flashes blank.
  revealEls.slice().forEach((el) => {
    if (el.getBoundingClientRect().top < (window.innerHeight || 800) * 0.95) {
      forceShow(el);
      const idx = revealEls.indexOf(el);
      if (idx > -1) revealEls.splice(idx, 1);
    }
  });
  counters.forEach((el) => { if (inView(el, 0.99)) { countersDone.add(el); animateCount(el); } });

  window.addEventListener("scroll", checkReveal, { passive: true });
  window.addEventListener("resize", checkReveal);
  window.addEventListener("load", checkReveal);
  checkReveal();
  // safety net: force-show anything still hidden after entrance window.
  setTimeout(() => { revealEls.slice().forEach(forceShow); checkReveal(); }, 1400);

  /* ---- Number counters (setInterval-based; rAF can be paused in previews) ---- */
  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const dur = 1500;
    const start = Date.now();
    const id = setInterval(() => {
      const p = Math.min((Date.now() - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals).replace(".", ",");
      if (p >= 1) {
        el.textContent = target.toFixed(decimals).replace(".", ",");
        clearInterval(id);
      }
    }, 30);
    // hard fallback: guarantee final value lands even if timers are throttled
    setTimeout(() => { el.textContent = target.toFixed(decimals).replace(".", ","); }, dur + 400);
  }

  /* ---- Solution card pointer glow ---- */
  document.querySelectorAll(".sol-card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
    });
  });

  /* ---- FAQ accordion ---- */
  document.querySelectorAll(".faq-item").forEach((item) => {
    const q = item.querySelector(".faq-q");
    const a = item.querySelector(".faq-a");
    q.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach((o) => {
        if (o !== item) {
          o.classList.remove("open");
          o.querySelector(".faq-a").style.maxHeight = null;
        }
      });
      item.classList.toggle("open", !isOpen);
      a.style.maxHeight = isOpen ? null : a.scrollHeight + "px";
    });
  });

  /* ---- Testimonial carousel ---- */
  const track = document.querySelector(".tcar__track");
  if (track) {
    const slides = track.children.length;
    let idx = 0;
    const dotsWrap = document.querySelector(".tcar__dots");
    const prev = document.querySelector('[data-tcar="prev"]');
    const next = document.querySelector('[data-tcar="next"]');
    for (let i = 0; i < slides; i++) {
      const d = document.createElement("span");
      d.className = "tcar__dot" + (i === 0 ? " active" : "");
      d.addEventListener("click", () => go(i));
      dotsWrap.appendChild(d);
    }
    function go(n) {
      idx = (n + slides) % slides;
      track.style.transform = `translateX(-${idx * 100}%)`;
      dotsWrap.querySelectorAll(".tcar__dot").forEach((d, i) => d.classList.toggle("active", i === idx));
    }
    prev.addEventListener("click", () => go(idx - 1));
    next.addEventListener("click", () => go(idx + 1));
    let timer = setInterval(() => go(idx + 1), 7000);
    [prev, next, dotsWrap].forEach((el) =>
      el.addEventListener("click", () => {
        clearInterval(timer);
        timer = setInterval(() => go(idx + 1), 7000);
      })
    );
  }

  /* ---- Video testimonials: hover-to-play + carousel ---- */
  const vScroller = document.getElementById("vcar-scroller");
  if (vScroller) {
    const isTouch = window.matchMedia("(hover: none)").matches;
    vScroller.querySelectorAll(".vcard").forEach((card) => {
      const id = card.getAttribute("data-yt");
      const media = card.querySelector(".vcard__media");
      let frame = null;
      const start = () => {
        if (frame || !id || !media) return;
        frame = document.createElement("iframe");
        frame.src = "https://www.youtube.com/embed/" + id +
          "?autoplay=1&mute=1&controls=0&loop=1&playlist=" + id +
          "&playsinline=1&modestbranding=1&rel=0&disablekb=1";
        frame.setAttribute("allow", "autoplay; encrypted-media");
        frame.setAttribute("title", "Depoimento em vídeo");
        media.appendChild(frame);
        card.classList.add("is-playing");
      };
      const stop = () => {
        if (frame) { frame.remove(); frame = null; }
        card.classList.remove("is-playing");
      };
      if (isTouch) {
        card.addEventListener("click", () => (frame ? stop() : start()));
      } else {
        card.addEventListener("mouseenter", start);
        card.addEventListener("mouseleave", stop);
      }
    });
    const step = (dir) => {
      const c = vScroller.querySelector(".vcard");
      const styles = getComputedStyle(vScroller);
      const gap = parseFloat(styles.columnGap || styles.gap) || 18;
      const w = c ? c.getBoundingClientRect().width + gap : 320;
      vScroller.scrollBy({ left: dir * w * 2, behavior: "smooth" });
    };
    const vp = document.querySelector('[data-vcar="prev"]');
    const vn = document.querySelector('[data-vcar="next"]');
    if (vp) vp.addEventListener("click", () => step(-1));
    if (vn) vn.addEventListener("click", () => step(1));
  }

  /* ---- Before/after comparators are built & wired in cases-bna.js ---- */

  /* ---- Phases timeline: horizontal animated line on desktop, vertical fill on mobile ---- */
  const phasesEl = document.querySelector(".phases");
  if (phasesEl) {
    const rail = phasesEl.querySelector(".phases__rail");
    const fill = phasesEl.querySelector(".phases__rail-fill");
    const dots = [...phasesEl.querySelectorAll(".phase__dot")];
    const phaseCards = [...phasesEl.querySelectorAll(".phase")];
    const isMobile = () => window.matchMedia("(max-width: 560px)").matches;
    const isDesktop = () => window.matchMedia("(min-width: 981px)").matches;
    let firstC = 0, railH = 0;

    function layout() {
      if (!rail || !fill || dots.length < 2) return;
      const pRect = phasesEl.getBoundingClientRect();
      const pLeft = pRect.left + window.scrollX;
      const pTop = pRect.top + window.scrollY;
      const c0 = dots[0].getBoundingClientRect();
      const cN = dots[dots.length - 1].getBoundingClientRect();
      if (isDesktop()) {
        const y = (c0.top + window.scrollY) + c0.height / 2 - pTop;
        const x0 = (c0.left + window.scrollX) + c0.width / 2 - pLeft;
        const xN = (cN.left + window.scrollX) + cN.width / 2 - pLeft;
        rail.style.left = x0 + "px";
        rail.style.top = (y - 1.5) + "px";
        rail.style.width = (xN - x0) + "px";
        rail.style.height = "3px";
        fill.style.height = ""; fill.style.top = ""; // let CSS drive width animation
      } else if (isMobile()) {
        firstC = (c0.top + window.scrollY) + c0.height / 2 - pTop;
        const lastC = (cN.top + window.scrollY) + cN.height / 2 - pTop;
        railH = lastC - firstC;
        rail.style.left = "27px";
        rail.style.top = firstC + "px";
        rail.style.width = "3px";
        rail.style.height = railH + "px";
        fill.style.width = "";
        update();
      }
    }
    function update() {
      if (!rail || !fill || !isMobile() || railH <= 0) return;
      const pTop = phasesEl.getBoundingClientRect().top + window.scrollY;
      const ref = window.scrollY + window.innerHeight * 0.58;
      let prog = (ref - (pTop + firstC)) / railH;
      prog = Math.max(0, Math.min(1, prog));
      fill.style.height = (prog * railH) + "px";
      phaseCards.forEach((ph, i) => {
        const d = dots[i].getBoundingClientRect();
        const dCenter = d.top + window.scrollY + d.height / 2;
        ph.classList.toggle("is-active", ref >= dCenter - 4);
      });
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", layout);
    layout();
    setTimeout(layout, 350);
    window.addEventListener("load", layout);

    // Trigger the desktop line animation only when the section enters view
    function runDesktopSequence() {
      if (!isDesktop() || dots.length < 2) return;
      const rr = rail.getBoundingClientRect();
      const stops = dots.map((d) => {
        const dr = d.getBoundingClientRect();
        return Math.max(0, Math.min(1, ((dr.left + dr.width / 2) - rr.left) / rr.width));
      });
      fill.style.transition = "none";
      fill.style.width = "0%";
      void fill.offsetWidth;
      fill.style.transition = "";
      phaseCards[0].classList.add("is-active");
      let i = 1;
      (function step() {
        if (i >= stops.length) return;
        const idx = i;
        fill.style.width = (stops[idx] * 100) + "%";
        setTimeout(function () { phaseCards[idx].classList.add("is-active"); }, 1000);
        i++;
        setTimeout(step, 1600);
      })();
    }
    const phIO = new IntersectionObserver((ents) => {
      ents.forEach((en) => {
        if (en.isIntersecting) {
          layout();
          phasesEl.classList.add("in-view");
          if (isDesktop()) setTimeout(runDesktopSequence, 220);
          phIO.disconnect();
        }
      });
    }, { threshold: 0.25 });
    phIO.observe(phasesEl);
  }

  /* ---- Mobile: shorter Soluções card descriptions ---- */
  const solCards = document.querySelectorAll(".sol-card");
  if (solCards.length) {
    const brief = [
      "Os 5 formatos de Mercado Ads — Product, Brand, Display, Follow e Vídeo — operados com função definida, verba pela Curva ABC e ajuste de lance nos primeiros dias.",
      "Squad específico por canal (Shopee, Amazon, Magalu), respeitando o algoritmo de cada um, com leitura consolidada num só dashboard.",
      "Google, Meta, TikTok e LinkedIn na mesma metodologia, com CAC contratado por canal e ROAS por funil.",
      "Criação e personalização de lojas em Nuvemshop, Shopify e Tray: UX de conversão, integrações (ERP, gateway, frete) e SEO técnico. +700 lojas em 14 anos.",
      "Matriz BCG + Curva ABC no portfólio inteiro: cada SKU ganha um papel e estratégia de mídia, preço e exposição.",
      "Produção contínua de banners e vídeos para cada canal, sempre testados A/B e otimizados por dado.",
      "Conteúdo para Instagram, TikTok, YouTube e LinkedIn, conectado ao plano de mídia e à recompra.",
      "Plano de evolução de selo e reputação no marketplace + monitoramento de HUB/ERP, checkout e carrinho no site.",
      "Implantação e integração de ERP (Bling, Tiny) com todos os canais — estoque, pedidos e financeiro num fluxo único.",
      "Abertura e estruturação completa em Mercado Livre, Shopee, Amazon e Magalu, com base pronta pra escalar com mídia."
    ];
    const isMobileSol = () => window.matchMedia("(max-width: 560px)").matches;
    solCards.forEach((card) => {
      const p = card.querySelector("p:not(.sol-card__hook)");
      if (p && !p.dataset.full) p.dataset.full = p.textContent;
    });
    function applySol() {
      const m = isMobileSol();
      solCards.forEach((card, i) => {
        const p = card.querySelector("p:not(.sol-card__hook)");
        if (!p) return;
        if (m && brief[i]) p.textContent = brief[i];
        else if (p.dataset.full) p.textContent = p.dataset.full;
      });
    }
    applySol();
    let solT;
    window.addEventListener("resize", () => { clearTimeout(solT); solT = setTimeout(applySol, 150); });
  }

  /* ---- Mobile menu (simple toggle) ---- */
  const burger = document.querySelector(".nav__burger");
  const links = document.querySelector(".nav__links");
  if (burger && nav) {
    burger.addEventListener("click", () => nav.classList.toggle("menu-open"));
  }
  if (links) {
    // On mobile, the "Soluções" trigger should navigate to the section.
    const solBtn = links.querySelector(".nav__link");
    if (solBtn) solBtn.addEventListener("click", (e) => {
      if (window.matchMedia("(max-width: 980px)").matches) {
        e.preventDefault();
        const drop = solBtn.closest(".nav__drop");
        if (drop) drop.classList.toggle("open");
      }
    });
    // Close menu after tapping any link.
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => nav.classList.remove("menu-open"))
    );
  }

  /* ---- Form (demo, prevents reload) ---- */
  const form = document.querySelector("#diag-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = "Recebido — entraremos em contato ✓";
      btn.style.background = "var(--green)";
      btn.style.color = "var(--navy-950)";
      btn.disabled = true;
    });
  }
})();
