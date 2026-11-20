function Notice({ title, message }) {
  return (
    <div className="notice notice-error">
      <strong>{title}</strong>
      <span>{message}</span>
    </div>
  );
}

export default Notice;
