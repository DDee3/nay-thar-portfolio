from flask import Blueprint, Flask, abort, jsonify, render_template

PROFILE = {
    "name": "Nay Thar Htet",
    "role": "Python Developer — AI Integrations & Full-Stack",
    "education": "Bachelor of Information Technology (James Cook University Singapore)",
    "pitch": "I build Python backends, multi-model AI pipelines, and practical web tools that solve real operational problems.",
    "email": "naythar3111@gmail.com",
    "github": "https://github.com/NayTharHtet",
    "linkedin": "https://www.linkedin.com/in/nay-thar-htet-73b5702ba/",
    "site_url": "https://naytharhtet-portfolio.fly.dev",
    "about_sentences": [
        "I am a Python developer with a Bachelor of Information Technology from James Cook University Singapore, focused on backend systems and practical AI integrations.",
        "Most of my work lives in Flask, REST APIs, and multi-model LLM pipelines that combine fast cloud inference (Groq, Gemini, DeepSeek) with locally hosted Qwen models running on Ollama.",
        "On the frontend, I am comfortable building clean interfaces with HTML, Tailwind CSS, and JavaScript, and I am actively learning Next.js to round out my full-stack toolkit.",
        "I care about shipping software that stays fast, keeps user data isolated, and solves concrete problems without unnecessary complexity.",
    ],
}

PROJECTS = {
    "seller-hub": {
        "slug": "seller-hub",
        "title": "Seller Hub",
        "type": "SaaS Web App for Online Sellers",
        "Tagline": "Private multi-tenant dashboard for inventory, order fulfillment, shipment tracking, and net profit calculation.",
        "image": "/static/img/seller-hub.jpg",
        "image_alt": "Seller Hub dashboard preview showing order fulfillment status and profit metrics",
        "problem": (
            "Small online sellers often track inventory, courier shipments, and margins across scattered "
            "spreadsheets. That makes it hard to see real net profit per order or keep store records cleanly separated."
        ),
        "what_i_built": (
            "I built a multi-tenant web dashboard where each seller logs in to a private workspace to manage product "
            "catalog items, order statuses, courier shipments, and per-order net profit. Every database query is scoped "
            "to the authenticated seller account so merchants only ever see their own store data."
        ),
        "stack": "Python, Flask, PostgreSQL (Supabase), Next.js (in progress), Tailwind CSS, REST APIs",
        "what_i_learned": (
            "Enforcing strict per-seller row isolation at the query and authentication layer early prevents cross-tenant "
            "data leaks as reporting features grow."
        ),
        "live_url": "https://sellerhub-tawny.vercel.app/",
        "live_label": "Live Web App ↗",
        "github_url": "https://github.com/DDee3/sellerhub",
    },
    "stock-prediction-platform": {
        "slug": "stock-prediction-platform",
        "title": "Prophet",
        "type": "AI Stock Analyzer",
        "Tagline": "A multi-engine financial intelligence web dashboard that synthesizes deterministic quantitative indicators with multi-LLM qualitative market sentiment.",
        "image": "/static/img/prophet-forecast.png",
        "image_alt": "Prophet dashboard showing aggregated AI verdict and candlestick price chart",
        "images": [
            {
                "url": "/static/img/prophet-landing.png",
                "alt": "Prophet landing and search interface with ticker watchlist",
                "caption": "Search & Watchlist View: Real-time S&P 500 search bar, quick ticker pills, and engine status",
            },
            {
                "url": "/static/img/prophet-forecast.png",
                "alt": "Prophet stock analysis view with aggregated AI verdict and candlestick chart",
                "caption": "Forecast & Consensus View: Multi-model consensus score, signal strength, and technical candlestick charting",
            },
        ],
        "problem_heading": "Project Overview & System Scope",
        "problem": (
            "Prophet is a multi-engine financial intelligence web dashboard that synthesizes deterministic "
            "quantitative indicators with multi-LLM qualitative market sentiment.\n\n"
            "System Scope: Prophet operates strictly as a read-only analytical synthesis generator. "
            "The application processes market inputs, runs algorithmic feature evaluations, and computes "
            "directional signals and data insights. It intentionally excludes broker execution hooks, automated "
            "trade dispatching, and automated portfolio management routines, maintaining an explicit boundary "
            "between high-dimension market intelligence and execution risk."
        ),
        "built_heading": "Architecture & Key Engineering Features",
        "what_i_built": (
            "• ETL & Market Data Ingestion Pipeline: Constructed an automated extraction script in Python using Requests "
            "and Pandas to scrape, sanitize, and structure real-time S&P 500 constituent listings directly from Wikipedia tabular data. "
            "Normalized ticker metadata and historical market series into unified dataframes for fast mathematical vectorization.\n\n"
            "• Quantitative Signal & ML Classification Pipeline: Implemented an XGBoost classification model to evaluate structured "
            "feature matrices derived from technical indicators, including Relative Strength Index (RSI), Simple Moving Averages (SMA 20, SMA 50), "
            "and volume flow variations. Calculated technical divergence metrics alongside algorithmic model confidence scores to deliver "
            "baseline quantitative indicators before prompting language models.\n\n"
            "• Multi-Cloud LLM Consensus Engine: Designed a multi-provider routing layer dispatching parallel analytical prompts to Google "
            "Generative AI (Gemini), Groq (LLaMA 3.3 70B), and OpenRouter. Enforced standardized JSON output schemas across all cloud endpoints, "
            "parsing and aggregating heterogeneous model reasoning into a single consensus directional signal.\n\n"
            "• State Management & User Configuration Engine: Built a lightweight, schema-enforced JSON backend engine managing account lifecycles "
            "and authentication boundaries. Persists real-time stock watchlists (e.g., active tracking of tickers like AAPL) alongside user visual "
            "preferences, including theme configurations (Dark/Light mode) and chart rendering preferences (Candlestick vs. Linear views)."
        ),
        "stack": "Python, Flask, Pandas, XGBoost, Groq API, Google Generative AI, OpenRouter, Qwen 3.5 (Local/Ollama), Tailwind CSS",
        "learned_heading": "Architecture & Engineering Constraints",
        "what_i_learned": (
            "1. Privacy-First Edge Deployment Concept (Local Qwen Integration)\n"
            "• Engineering Context: In addition to cloud LLMs, the platform integrates an offline edge node running Qwen 3.5 (Uncensored 4B) "
            "locally via an on-premise inference runner (Ollama / llama.cpp).\n"
            "• Design Trade-Off & Enterprise Rationale: In institutional finance, proprietary trading parameters and sensitive client portfolios "
            "cannot be transmitted over public third-party APIs. Incorporating a dedicated local model establishes a proof-of-concept for hybrid "
            "edge/cloud architectures—where public data routes to high-throughput cloud models while sensitive reasoning remains strictly on local "
            "compute hardware.\n"
            "• Public Environment Isolation: When tested over public demo deployments, the local edge node will report as disconnected. This is "
            "an intentional hardware isolation boundary demonstrating real-world zero-trust segmentation between publicly accessible web clients "
            "and protected private hardware.\n\n"
            "2. Cost-Optimized API Routing & Multi-Model Consensus (Free-Tier Resiliency)\n"
            "• Engineering Context: Commercial financial analytics suites depend on expensive Bloomberg/Refinitiv terminals and high-cost "
            "proprietary model subscriptions. Prophet was architected to achieve resilient, high-density analysis exclusively using free-tier API "
            "quotas and standardized technical indicators.\n"
            "• Design Trade-Off & Enterprise Rationale: The primary engineering challenge was not maximizing raw compute spending, but designing "
            "fault-tolerant API orchestrations: handling rate limits, managing variable latency across providers, and implementing fallback routines "
            "without service degradation.\n"
            "• Non-Financial-Advice Boundary: Because the system operates on free-tier rate envelopes and historical technical indicators, outputs "
            "are framed strictly as experimental research signals rather than financial advice. This constraint validates the core system objective: "
            "achieving robust, multi-model consensus and low-latency API aggregation at zero cloud compute cost."
        ),
        "live_url": "https://prophet-zpmp.onrender.com/",
        "live_label": "Live Web App ↗",
        "github_url": "https://github.com/DDee3/Prophet",
    },
    "spray-log": {
        "slug": "spray-log",
        "title": "Spray Log",
        "type": "HEALTH UTILITY WEB APP",
        "Tagline": "A mobile-optimized, zero-dependency habit tracking web app using LocalStorage and the Web Vibrate API for frictionless logging.",
        "image": "/static/img/spray-log.svg",
        "image_alt": "Spray Log mobile interface showing a large log button and recent usage history.",
        "problem": (
            "Remembering medication or nasal spray dosage timing often leads to missed or duplicated doses, "
            "while standard tracking apps are bloated with login walls, ads, and slow load times."
        ),
        "what_i_built": (
            "I built a mobile-first, zero-dependency habit tracking web application that allows users to record "
            "doses in a single tap with physical haptic vibration feedback via the Web Vibrate API. All logs are stored "
            "client-side in browser LocalStorage with relative timestamps, undo support, and exportable history."
        ),
        "stack": "HTML5, CSS3, Vanilla JavaScript, Web Storage API (LocalStorage), Web Vibration API",
        "what_i_learned": (
            "Prioritizing zero dependencies and offline-first client storage creates an instantaneous, resilient "
            "mobile user experience with zero cloud infrastructure overhead."
        ),
        "live_url": "https://jolly-biscotti-56e901.netlify.app",
        "live_label": "Live Web App ↗",
        "github_url": None,
    },
}

portfolio_bp = Blueprint("portfolio", __name__)


@portfolio_bp.app_context_processor
def inject_globals():
    return {"profile": PROFILE, "projects": list(PROJECTS.values())}


@portfolio_bp.route("/")
def index():
    return render_template("index.html", page_title=f"{PROFILE['name']} — {PROFILE['role']}")


@portfolio_bp.route("/projects")
def projects():
    return render_template("projects.html", page_title=f"Projects — {PROFILE['name']}")


@portfolio_bp.route("/projects/<slug>")
def project_detail(slug: str):
    # Fallback alias for legacy slug from previous iterations
    if slug == "local-llm-gateway":
        slug = "spray-log"

    project = PROJECTS.get(slug)
    if not project:
        abort(404)

    return render_template(
        "project_detail.html",
        project=project,
        page_title=f"{project['title']} — {PROFILE['name']}",
    )


@portfolio_bp.route("/about")
def about():
    return render_template("about.html", page_title=f"About — {PROFILE['name']}")


@portfolio_bp.route("/contact")
def contact():
    return render_template("contact.html", page_title=f"Contact — {PROFILE['name']}")


@portfolio_bp.route("/healthz")
def healthz():
    return jsonify({"status": "ok", "service": "nay-thar-htet-portfolio"}), 200


app = Flask(__name__)
app.register_blueprint(portfolio_bp)


@app.errorhandler(404)
def not_found(_):
    return render_template("index.html", page_title=f"{PROFILE['name']} — Not Found"), 404


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)