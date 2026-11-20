function PageHeading({ tone = "indigo", eyebrow, title, description, source, sourceMark }) {
  const teal = tone === "teal";

  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">
          <span className={`eyebrow-bar${teal ? " eyebrow-bar-teal" : ""}`} /> {eyebrow}
        </div>
        <h1>{title}</h1>
        <p className="heading-copy">{description}</p>
      </div>
      <div className={`source-pill${teal ? " source-pill-teal" : ""}`}>
        <span className={`source-emblem${teal ? " source-emblem-teal" : ""}`}>{sourceMark}</span> {source}
      </div>
    </div>
  );
}

export default PageHeading;
