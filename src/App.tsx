import { useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CloudSun,
  Droplets,
  Leaf,
  Menu,
  MessageCircle,
  Search,
  ShieldCheck,
  Sprout,
  ThermometerSun,
  X,
} from "lucide-react";

type NavigationItem = {
  label: string;
  icon: typeof Leaf;
  active?: boolean;
};

const navigation: NavigationItem[] = [
  { label: "Overview", icon: Leaf, active: true },
  { label: "Crop diagnosis", icon: Search },
  { label: "Recommendations", icon: Sprout },
  { label: "AgriChat", icon: MessageCircle },
  { label: "Farm log", icon: CalendarDays },
];

const checklist = [
  { label: "Inspect tomato plot", detail: "High humidity window", tone: "warning" },
  { label: "Apply neem solution", detail: "Before 6:00 PM today", tone: "good" },
  { label: "Record soil reading", detail: "Due tomorrow", tone: "neutral" },
];

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Overview");

  const selectItem = (label: string) => {
    setActiveItem(label);
    setMobileMenuOpen(false);
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenuOpen ? "sidebar-open" : ""}`}>
        <div className="brand-row">
          <div className="brand-mark" aria-hidden="true">
            <Sprout size={22} strokeWidth={2.4} />
          </div>
          <div>
            <p className="brand-name">AgriSmart</p>
            <p className="brand-caption">Field intelligence</p>
          </div>
          <button
            className="icon-button close-menu"
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-section">
          <p className="eyebrow sidebar-label">Workspace</p>
          <nav aria-label="Primary navigation">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = item.label === activeItem;
              return (
                <button
                  className={`nav-item ${isActive ? "nav-item-active" : ""}`}
                  key={item.label}
                  type="button"
                  onClick={() => selectItem(item.label)}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                  {item.label === "Crop diagnosis" && <span className="nav-badge">2</span>}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="sidebar-bottom">
          <div className="season-card">
            <div className="season-icon"><CloudSun size={18} /></div>
            <div>
              <p className="season-label">Kharif season</p>
              <p className="season-value">Day 42 of 120</p>
            </div>
          </div>
          <div className="profile-row">
            <div className="avatar">AK</div>
            <div>
              <p className="profile-name">Aarav’s farm</p>
              <p className="profile-location">Nashik, Maharashtra</p>
            </div>
            <ChevronRight size={16} className="muted-icon" />
          </div>
        </div>
      </aside>

      {mobileMenuOpen && (
        <button
          className="scrim"
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <main className="main-content">
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            type="button"
            aria-label="Open navigation"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={22} />
          </button>
          <div>
            <p className="topbar-kicker">Wednesday, 30 September 2026</p>
            <h1>{activeItem === "Overview" ? "Good morning, Aarav" : activeItem}</h1>
          </div>
          <button className="weather-pill" type="button">
            <CloudSun size={18} />
            <span><strong>28°C</strong> · Partly cloudy</span>
            <ChevronRight size={16} />
          </button>
        </header>

        <div className="content-wrap">
          <section className="welcome-card">
            <div>
              <p className="eyebrow light-eyebrow">Today on your farm</p>
              <h2>Small actions today.<br /><em>Stronger harvests tomorrow.</em></h2>
              <p className="welcome-copy">Your plots are looking healthy. We found three actions that can protect this week’s growth.</p>
              <button className="primary-button" type="button">
                View today&apos;s plan <ArrowRight size={17} />
              </button>
            </div>
            <div className="welcome-illustration" aria-hidden="true">
              <div className="sun-disc" />
              <div className="hill hill-back" />
              <div className="hill hill-front" />
              <div className="plant plant-one"><span /><span /><span /></div>
              <div className="plant plant-two"><span /><span /><span /></div>
              <div className="plant plant-three"><span /><span /><span /></div>
            </div>
          </section>

          <section className="stats-grid" aria-label="Farm overview">
            <article className="stat-card">
              <div className="stat-icon green-icon"><Sprout size={20} /></div>
              <div><p className="stat-label">Active plots</p><p className="stat-value">4 <span>plots</span></p></div>
              <p className="stat-trend trend-up">↑ 1 this season</p>
            </article>
            <article className="stat-card">
              <div className="stat-icon blue-icon"><Droplets size={20} /></div>
              <div><p className="stat-label">Soil moisture</p><p className="stat-value">64<span>%</span></p></div>
              <p className="stat-trend trend-good">In healthy range</p>
            </article>
            <article className="stat-card">
              <div className="stat-icon amber-icon"><ThermometerSun size={20} /></div>
              <div><p className="stat-label">Weather risk</p><p className="stat-value">Low</p></div>
              <p className="stat-trend trend-neutral">Next 7 days</p>
            </article>
          </section>

          <div className="section-heading">
            <div><p className="eyebrow">Your field plan</p><h2>Keep the season moving</h2></div>
            <button className="text-button" type="button">Open farm log <ArrowRight size={16} /></button>
          </div>

          <section className="dashboard-grid">
            <article className="panel action-panel">
              <div className="panel-heading"><div><h3>Recommended actions</h3><p>Prioritized for your plots</p></div><span className="count-badge">3 today</span></div>
              <div className="checklist">
                {checklist.map((item, index) => (
                  <button className="checklist-item" type="button" key={item.label}>
                    <span className={`check-circle ${item.tone}`} aria-hidden="true">
                      {index === 1 && <CheckCircle2 size={16} />}
                    </span>
                    <span className="check-text"><strong>{item.label}</strong><small>{item.detail}</small></span>
                    <ChevronRight size={17} className="muted-icon" />
                  </button>
                ))}
              </div>
              <button className="panel-footer-link" type="button">See all activities <ArrowRight size={16} /></button>
            </article>

            <article className="panel plot-panel">
              <div className="panel-heading"><div><h3>Plot health</h3><p>Based on your latest entries</p></div><button className="more-button" type="button">•••</button></div>
              <div className="plot-list">
                <PlotRow name="North field" crop="Tomato · 1.2 acres" score="92" tone="strong" />
                <PlotRow name="River edge" crop="Onion · 0.8 acres" score="84" tone="good" />
                <PlotRow name="Orchard patch" crop="Grapes · 2.1 acres" score="71" tone="watch" />
              </div>
              <button className="panel-footer-link" type="button">Manage plots <ArrowRight size={16} /></button>
            </article>
          </section>

          <section className="insight-banner">
            <div className="insight-icon"><ShieldCheck size={21} /></div>
            <div><p className="eyebrow">AgriSmart insight</p><p className="insight-text">Humidity will rise tonight. Finishing your tomato inspection before sunset can help catch early signs of fungal stress.</p></div>
            <button className="insight-action" type="button" onClick={() => selectItem("Crop diagnosis")}>Check a crop <ArrowRight size={16} /></button>
          </section>
        </div>
      </main>
    </div>
  );
}

function PlotRow({ name, crop, score, tone }: { name: string; crop: string; score: string; tone: "strong" | "good" | "watch" }) {
  return (
    <div className="plot-row">
      <div className="plot-plant"><Leaf size={17} /></div>
      <div className="plot-copy"><strong>{name}</strong><small>{crop}</small></div>
      <div className="score-wrap"><span className={`health-score ${tone}`}>{score}</span><span className="score-label">health</span></div>
    </div>
  );
}

export default App;