import { NavLink } from "react-router-dom";

function AppLayout({ children }) {
  return (
    <div className="app-frame">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Exchange Rate Desk home">
          <span className="brand-mark" aria-hidden="true">↗</span>
          <span className="brand-copy">
            <strong>Exchange Desk</strong>
            <small>Currency intelligence</small>
          </span>
        </a>

        <nav className="main-nav" aria-label="Rate sources">
          <NavLink to="/rbi" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
            <span className="nav-index">01</span> RBI archive
          </NavLink>
          <NavLink to="/latest" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
            <span className="nav-index">02</span> Latest rates
          </NavLink>
        </nav>

        <div className="topbar-side">
          <span className="live-dot" />
          <span>Live sources</span>
        </div>
      </header>

      <main className="page-wrap">{children}</main>

      <footer className="site-footer">
        <span>Exchange Desk</span>
        <span>Reference and indicative rates for comparison</span>
      </footer>
    </div>
  );
}

export default AppLayout;
