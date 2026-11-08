/* Parda hisob-kitobi — server va brauzerda bir xil ishlaydi.
 *
 * Har bir deraza uchun:
 *   tayyor balandlik = balandlik − poldan bo'shliq
 *   kesish balandligi = tayyor balandlik + tepa zapas + past zapas
 *   burma eni        = karniz uzunligi × fason koeffitsienti
 *   chet zapas       = qanotlar soni × 2 × yon zapas
 *
 *   Agar mato balandligi (rulon eni) tayyor balandlik + tepa zapasga yetsa
 *   (pastki chet fabrika qirrasi bilan qoladi):
 *     metr = burma eni + chet zapas            (butun, tikuvsiz)
 *   Aks holda mato tik bo'laklarga kesiladi:
 *     bo'laklar = ceil((burma eni + chet zapas) / rulon eni)
 *     metr = bo'laklar × kesish balandligi    (tikuv bilan)
 *
 *   Rimskiy kabi tekis fasonlarda koeffitsient 1 ga yaqin bo'ladi.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.PardaCalc = factory();
})(typeof self !== "undefined" ? self : this, function () {
  const up = (x, step = 0.1) => Math.ceil(x / step - 1e-9) * step;
  const r2 = (x) => Math.round(x * 100) / 100;

  function layer(win, L, product, style, s) {
    const W = Number(win.width) || 0;
    const H = Number(win.height) || 0;
    const panels = Math.max(1, Number(win.panels) || 2);
    const coef = style ? Number(style.coefficient) || 1 : Number(s.default_coefficient) || 2;
    const rollH = product && Number(product.roll_height) ? Number(product.roll_height) : Number(s.default_roll_height) || 2.8;

    const finished = Math.max(0, H - (Number(s.floor_gap_cm) || 0) / 100);
    const cutH = finished + ((Number(s.hem_top_cm) || 0) + (Number(s.hem_bottom_cm) || 0)) / 100;
    const gathered = W * coef;
    const sides = (panels * 2 * (Number(s.side_cm) || 0)) / 100;
    const need = gathered + sides;

    const wholeH = finished + (Number(s.hem_top_cm) || 0) / 100;
    let meters, method, drops = 0;
    if (rollH + 1e-9 >= wholeH) {
      meters = need;
      method = "whole";
    } else {
      drops = Math.ceil(need / rollH - 1e-9);
      meters = drops * cutH;
      method = "drops";
    }
    meters = r2(up(meters * (1 + (Number(s.reserve_pct) || 0) / 100)));

    const price = product ? Number(product.price) || 0 : 0;
    const sewing = style ? Number(style.sewing_price) || 0 : 0;
    const sewingUnits = style && style.sewing_unit === "karniz" ? W : meters;
    const fabricCost = Math.round(meters * price);
    const sewingCost = Math.round(sewingUnits * sewing);

    return {
      kind: L.kind,
      product_id: product ? product.id : null,
      style_id: style ? style.id : null,
      coefficient: coef,
      roll_height: rollH,
      cut_height: r2(cutH),
      gathered: r2(gathered),
      method,
      drops,
      meters,
      price,
      fabric_cost: fabricCost,
      sewing_cost: sewingCost,
      total: fabricCost + sewingCost,
      priced: !!product && price > 0,
    };
  }

  /* windows: [{name, width, height, panels, layers:[{kind, product_id, style_id}]}]
   * catalog: {products:{id:obj}, styles:{id:obj}}  settings: obj */
  function calculate(windows, catalog, settings) {
    const s = settings || {};
    const out = { windows: [], total: 0, meters: {}, complete: true };
    (windows || []).forEach((w, i) => {
      const rows = (w.layers || []).filter((l) => l && l.kind).map((L) => {
        const p = L.product_id ? catalog.products[L.product_id] : null;
        const st = L.style_id ? catalog.styles[L.style_id] : null;
        const res = layer(w, L, p, st, s);
        out.meters[L.kind] = r2((out.meters[L.kind] || 0) + res.meters);
        if (!res.priced) out.complete = false;
        return res;
      });
      const total = rows.reduce((a, r) => a + r.total, 0);
      out.total += total;
      out.windows.push({ name: w.name || `#${i + 1}`, width: Number(w.width), height: Number(w.height), panels: Number(w.panels) || 2, layers: rows, total });
    });
    return out;
  }

  return { calculate };
});
