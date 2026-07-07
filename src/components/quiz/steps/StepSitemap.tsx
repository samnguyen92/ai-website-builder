"use client";

const EXAMPLE_PAGES = [
  "Homepage","About Us","Services","Products","Contact",
  "FAQ","Blog","Pricing","Case Studies / Work","Portfolio",
  "Shop","Booking / Consultation",
];

interface Props {
  pageCount: number;
  pagesDescription: string;
  onPageCountChange: (n: number) => void;
  onPagesDescriptionChange: (s: string) => void;
}

export function StepSitemap({ pageCount, pagesDescription, onPageCountChange, onPagesDescriptionChange }: Props) {
  const addTag = (page: string) => {
    const ex = pagesDescription.trim();
    onPagesDescriptionChange(ex ? `${ex}, ${page}` : page);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <h2 className="q-heading">Which pages do you need?</h2>
      <p className="q-subtitle">
        Tell us how many pages you want and list the pages you have in mind.
        Don&apos;t worry if you are not sure — Align can help refine the sitemap later.
      </p>

      {/* Page count stepper */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ color: "rgba(255,255,255,0.60)", fontSize: 16 }}>Number of Pages</span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 9999,
            padding: "10px 20px",
          }}
        >
          <button
            type="button"
            id="page-count-minus"
            onClick={() => onPageCountChange(Math.max(1, pageCount - 1))}
            style={{ color: "rgba(255,255,255,0.60)", fontSize: 20, background: "none", border: "none", cursor: "pointer", lineHeight: 1 }}
          >−</button>
          <span style={{ color: "white", fontWeight: 600, minWidth: 20, textAlign: "center" }}>{pageCount}</span>
          <button
            type="button"
            id="page-count-plus"
            onClick={() => onPageCountChange(Math.min(20, pageCount + 1))}
            style={{ color: "rgba(255,255,255,0.60)", fontSize: 20, background: "none", border: "none", cursor: "pointer", lineHeight: 1 }}
          >+</button>
        </div>
      </div>

      <textarea
        id="pages-description"
        className="q-input"
        style={{ minHeight: 128 }}
        value={pagesDescription}
        onChange={(e) => onPagesDescriptionChange(e.target.value)}
        placeholder="List the pages you need (Not sure what pages you need? You can write a rough list)"
      />

      <div>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 10 }}>Try these examples:</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {EXAMPLE_PAGES.map((page) => (
            <button key={page} type="button" className="q-tag" onClick={() => addTag(page)}>{page}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
