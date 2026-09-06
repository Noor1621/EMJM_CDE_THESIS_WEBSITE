// Vanilla fallback for the Multi-Year Snow Variability Tool on the static export.
(function () {
  function init() {
    var root = document.querySelector('[data-yeartool]');
    if (!root) return;
    var dataEl = root.querySelector('[data-yeartool-data]');
    if (!dataEl) return;
    var data = JSON.parse(dataEl.textContent);
    var dsSel = root.querySelector('[data-yeartool-dataset]');
    var lSel = root.querySelector('[data-yeartool-left]');
    var rSel = root.querySelector('[data-yeartool-right]');
    var swap = root.querySelector('[data-yeartool-swap]');
    var cmp = root.querySelector('[data-compare-root]');
    if (!cmp) return;
    var after = cmp.querySelector('[data-compare-after]');
    var clip = cmp.querySelector('[data-compare-clip]');
    var before = cmp.querySelector('[data-compare-before]');
    var bl = cmp.querySelector('[data-compare-before-label]');
    var al = cmp.querySelector('[data-compare-after-label]');
    var handle = cmp.querySelector('[data-compare-handle]');
    var cap = root.querySelector('[data-compare-caption]');
    var intro = root.querySelector('[data-yeartool-caption]');
    var pos = 50;
    var dragging = false;

    function setPos(p) {
      pos = Math.max(0.5, Math.min(99.5, p));
      clip.style.width = pos + '%';
      before.style.width = (100 / pos) * 100 + '%';
      handle.style.left = pos + '%';
    }
    function fromX(x) {
      var r = cmp.getBoundingClientRect();
      setPos(((x - r.left) / r.width) * 100);
    }
    function render() {
      var ds = data[dsSel.value];
      if (!ds) return;
      var L = lSel.value, R = rSel.value;
      before.src = ds.maps[L];
      after.src = ds.maps[R];
      bl.textContent = ds.label + ' \u00b7 ' + L;
      al.textContent = ds.label + ' \u00b7 ' + R;
      if (intro) intro.textContent = ds.caption + ' Drag the slider to compare any two years from 2018\u20132025.';
      if (cap) cap.textContent = ds.label + ' \u2014 ' + L + ' (left) vs ' + R + ' (right).';
      root.querySelectorAll('[data-yeartool-thumb-img]').forEach(function (img) {
        img.src = ds.maps[img.getAttribute('data-yeartool-thumb-img')];
      });
      root.querySelectorAll('[data-yeartool-thumb]').forEach(function (b) {
        var y = b.getAttribute('data-yeartool-thumb');
        var active = y === L || y === R;
        b.style.borderColor = active ? 'var(--color-thesis-accent-glow)' : 'var(--color-thesis-line)';
        b.style.boxShadow = active ? '0 0 0 2px var(--color-thesis-accent)' : '';
      });
      setPos(pos);
    }

    dsSel.value = Object.keys(data)[0];
    lSel.value = lSel.options[0].value;
    rSel.value = rSel.options[rSel.options.length - 1].value;

    dsSel.addEventListener('change', render);
    lSel.addEventListener('change', render);
    rSel.addEventListener('change', render);
    if (swap) swap.addEventListener('click', function () {
      var t = lSel.value; lSel.value = rSel.value; rSel.value = t; render();
    });
    root.querySelectorAll('[data-yeartool-thumb]').forEach(function (b) {
      b.addEventListener('click', function () {
        rSel.value = b.getAttribute('data-yeartool-thumb');
        render();
      });
    });

    cmp.addEventListener('mousedown', function (e) { dragging = true; fromX(e.clientX); e.preventDefault(); });
    cmp.addEventListener('touchstart', function (e) { dragging = true; fromX(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('mousemove', function (e) { if (dragging) fromX(e.clientX); });
    window.addEventListener('touchmove', function (e) { if (dragging) fromX(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('mouseup', function () { dragging = false; });
    window.addEventListener('touchend', function () { dragging = false; });

    render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
