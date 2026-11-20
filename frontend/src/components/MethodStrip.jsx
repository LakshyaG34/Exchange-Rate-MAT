function MethodStrip({ tone = "indigo", icon, title, description, meta }) {
  const teal = tone === "teal";

  return (
    <div className={`method-strip${teal ? " method-strip-teal" : ""}`}>
      <div className={`method-icon ${teal ? "method-icon-teal" : "method-icon-indigo"}`}>{icon}</div>
      <div className="method-text">
        <strong>{title}</strong>
        <span>{description}</span>
      </div>
      <div className="method-meta">
        <span className={`method-dot${teal ? " method-dot-teal" : ""}`} /> {meta}
      </div>
    </div>
  );
}

export default MethodStrip;
