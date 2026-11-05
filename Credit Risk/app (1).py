"""
Streamlit Web Application: Credit Applicant Default Risk Classification System
UCI Machine Learning Repository | Statlog (German Credit Data)

A Modern Loan Officer Decision-Support Platform comparing Logistic Regression against KNN
under Asymmetric Misclassification Costs with Dynamic Portfolio Analytics & ECOA Fairness Auditing.
All monetary metrics in US Dollars ($).
"""

from builtins import sorted
import sys
from pathlib import Path
from streamlit.runtime import exists
from streamlit.web import cli as stcli

# Auto-launch via Streamlit CLI if executed directly with `python app.py`
if not exists():
    sys.argv = ["streamlit", "run", str(Path(__file__).resolve())]
    sys.exit(stcli.main())

# Set project root in path
PROJECT_ROOT = Path(__file__).resolve().parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from importlib import import_module

_data_loader = import_module("src.data_loader")
load_processed_dataset = _data_loader.load_processed_dataset
CODE_MAPPINGS = _data_loader.CODE_MAPPINGS
NUMERICAL_FEATURES = _data_loader.NUMERICAL_FEATURES
CATEGORICAL_FEATURES = _data_loader.CATEGORICAL_FEATURES
_models = import_module("src.models")
train_and_evaluate_all = _models.train_and_evaluate_all
get_feature_importances = _models.get_feature_importances

_cost_evaluation = import_module("src.cost_evaluation")
compute_cost_metrics = _cost_evaluation.compute_cost_metrics
sweep_thresholds = _cost_evaluation.sweep_thresholds
find_optimal_threshold = _cost_evaluation.find_optimal_threshold
compute_roc_pr_curves = _cost_evaluation.compute_roc_pr_curves

_fairness = import_module("src.fairness")
compute_group_metrics = _fairness.compute_group_metrics
compute_fairness_summary = _fairness.compute_fairness_summary

# ---------------------------------------------------------
# Page Configuration & Executive Styling
# ---------------------------------------------------------
st.set_page_config(
    page_title="Credit Risk Intelligence System",
    page_icon="🏦",
    layout="wide",
    initial_sidebar_state="expanded"
)

# USD Value Mappings for Display
USD_CHECKING_MAP = {
    '< 0 DM (Overdrawn)': '< $0 (Overdrawn)',
    '0 <= ... < 200 DM': '$0 to $200',
    '>= 200 DM / Salary >= 1yr': '≥ $200 / Steady Salary',
    'no checking account': 'No Checking Account'
}
REV_CHECKING_MAP = {v: k for k, v in USD_CHECKING_MAP.items()}

USD_SAVINGS_MAP = {
    '< 100 DM': '< $100',
    '100 <= ... < 500 DM': '$100 to $500',
    '500 <= ... < 1000 DM': '$500 to $1,000',
    '>= 1000 DM': '≥ $1,000',
    'Unknown / no savings account': 'No / Unknown Savings'
}
REV_SAVINGS_MAP = {v: k for k, v in USD_SAVINGS_MAP.items()}

# Clean Fintech CSS
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Inter', sans-serif;
    }
    
    .main-header {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        padding: 22px 28px;
        border-radius: 12px;
        color: #ffffff;
        margin-bottom: 20px;
        border: 1px solid #334155;
        box-shadow: 0 4px 14px rgba(0,0,0,0.15);
    }
    .main-header h1 {
        color: #f8fafc;
        margin: 0;
        font-size: 1.85rem;
        font-weight: 700;
        letter-spacing: -0.02em;
    }
    .main-header p {
        color: #94a3b8;
        margin: 6px 0 0 0;
        font-size: 0.95rem;
    }
    
    .kpi-card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        padding: 16px 18px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        margin-bottom: 12px;
    }
    .kpi-card h4 {
        margin: 0;
        font-size: 0.82rem;
        text-transform: uppercase;
        color: #64748b;
        letter-spacing: 0.05em;
    }
    .kpi-card .value {
        font-size: 1.55rem;
        font-weight: 700;
        color: #0f172a;
        margin-top: 4px;
    }
    .kpi-card .sub {
        font-size: 0.8rem;
        color: #64748b;
        margin-top: 2px;
    }

    .badge-approve {
        background: #ecfdf5;
        color: #065f46;
        padding: 12px 18px;
        border-radius: 8px;
        font-weight: 700;
        font-size: 1.05rem;
        border: 1px solid #a7f3d0;
        text-align: center;
    }
    .badge-review {
        background: #fffbeb;
        color: #92400e;
        padding: 12px 18px;
        border-radius: 8px;
        font-weight: 700;
        font-size: 1.05rem;
        border: 1px solid #fde68a;
        text-align: center;
    }
    .badge-decline {
        background: #fef2f2;
        color: #991b1b;
        padding: 12px 18px;
        border-radius: 8px;
        font-weight: 700;
        font-size: 1.05rem;
        border: 1px solid #fecaca;
        text-align: center;
    }

    .stTabs [data-baseweb="tab-list"] {
        gap: 6px;
    }
    .stTabs [data-baseweb="tab"] {
        padding: 8px 16px;
        font-weight: 600;
        border-radius: 6px;
        font-size: 0.92rem;
    }
</style>
""", unsafe_allow_html=True)


# ---------------------------------------------------------
# Data & Model Caching
# ---------------------------------------------------------
@st.cache_data
def get_cached_dataset():
    """Loads and formats the German Credit dataset with USD currency labels."""
    df = load_processed_dataset(decode_labels=True)
    df['checking_status_usd'] = df['checking_status'].map(USD_CHECKING_MAP).fillna(df['checking_status'])
    df['savings_status_usd'] = df['savings_status'].map(USD_SAVINGS_MAP).fillna(df['savings_status'])
    return df


@st.cache_resource
def get_trained_models():
    """Trains and caches Logistic Regression and KNN pipelines."""
    return train_and_evaluate_all(random_state=42)


df_credit = get_cached_dataset()
results = get_trained_models()

lr_model = results['lr_model']
knn_model = results['knn_model']
test_data = results['test_data']
y_test = test_data['y_test'].values
y_prob_lr = test_data['y_test_probs_lr']
y_prob_knn = test_data['y_test_probs_knn']
test_df = test_data['test_df']
feature_importances = results['feature_importances']


# ---------------------------------------------------------
# Sidebar: Credit Economics & Cost Parameters
# ---------------------------------------------------------
st.sidebar.markdown("### 🏦 Credit Risk Parameters")
st.sidebar.caption("All financial evaluations in US Dollars ($)")

cost_fn_dollars = st.sidebar.slider(
    "Default Loss Penalty (FN in $)",
    min_value=1000,
    max_value=10000,
    value=5000,
    step=500,
    help="Direct financial loss of loan principal & recovery costs when a defaulted applicant is approved."
)

cost_fp_dollars = st.sidebar.slider(
    "Lost Margin Opportunity (FP in $)",
    min_value=250,
    max_value=3000,
    value=1000,
    step=250,
    help="Foregone net interest margin when a creditworthy applicant is denied."
)

# Normalized cost units for model evaluation
cost_fn_unit = cost_fn_dollars / 1000.0
cost_fp_unit = cost_fp_dollars / 1000.0

bayes_threshold = cost_fp_unit / (cost_fp_unit + cost_fn_unit)
st.sidebar.info(
    f"**Bayes Optimal Cutoff:** `{bayes_threshold:.3f}`  \n"
    f"$\\theta^* = \\frac{{C_{{FP}}}}{{C_{{FP}} + C_{{FN}}}} = \\frac{{{cost_fp_dollars:,}}}{{{cost_fp_dollars + cost_fn_dollars:,}}}$"
)

# Empirical best cutoff on test partition
best_th_lr, min_cost_lr, _ = find_optimal_threshold(y_test, y_prob_lr, cost_fn=cost_fn_unit, cost_fp=cost_fp_unit)

st.sidebar.markdown("---")
st.sidebar.markdown("### 🎯 Decision Policy")
threshold_mode = st.sidebar.radio(
    "Active Cutoff Strategy:",
    ["Cost-Optimal Cutoff (Empirical)", "Theoretical Bayes Threshold", "Conventional (0.50)", "Custom Slider"],
    index=0
)

if threshold_mode == "Cost-Optimal Cutoff (Empirical)":
    active_threshold = best_th_lr
elif threshold_mode == "Theoretical Bayes Threshold":
    active_threshold = bayes_threshold
elif threshold_mode == "Conventional (0.50)":
    active_threshold = 0.50
else:
    active_threshold = st.sidebar.slider("Custom Cutoff", 0.05, 0.95, float(best_th_lr), 0.01)

st.sidebar.metric(
    label="Active Approval Cutoff (θ)",
    value=f"{active_threshold:.3f}",
    delta=f"Defaults flag if Risk ≥ {active_threshold*100:.1f}%"
)


# ---------------------------------------------------------
# Top Navigation Header
# ---------------------------------------------------------
st.markdown("""
<div class="main-header">
    <h1>🏦 Credit Risk Intelligence & Underwriting System</h1>
    <p>Retail Loan Decision Engine • Cost-Sensitive Machine Learning • All Figures in USD ($)</p>
</div>
""", unsafe_allow_html=True)

tab1, tab2, tab3, tab4, tab5 = st.tabs([
    "📈 Executive Dashboard",
    "🔍 Dynamic Portfolio Explorer",
    "⚖️ Model Performance & Economics",
    "💳 Live Loan Underwriter",
    "🛡️ Fairness & ECOA Audit"
])


# =========================================================
# TAB 1: EXECUTIVE DASHBOARD
# =========================================================
with tab1:
    st.markdown("### Executive Portfolio & Economic Summary")
    
    # Core Portfolio Stats
    total_loans = len(df_credit)
    total_volume = df_credit['credit_amount'].sum()
    avg_loan = df_credit['credit_amount'].mean()
    def_rate = (df_credit['default'].sum() / total_loans) * 100
    
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.markdown(f"""
        <div class="kpi-card">
            <h4>Total Portfolio Volume</h4>
            <div class="value">${total_volume:,.0f}</div>
            <div class="sub">{total_loans:,} Active Applications</div>
        </div>
        """, unsafe_allow_html=True)
    with col2:
        st.markdown(f"""
        <div class="kpi-card">
            <h4>Average Loan Size</h4>
            <div class="value">${avg_loan:,.0f}</div>
            <div class="sub">Range: ${df_credit['credit_amount'].min():,} - ${df_credit['credit_amount'].max():,}</div>
        </div>
        """, unsafe_allow_html=True)
    with col3:
        st.markdown(f"""
        <div class="kpi-card">
            <h4>Historic Default Rate</h4>
            <div class="value">{def_rate:.1f}%</div>
            <div class="sub">{int(df_credit['default'].sum())} Defaults / {total_loans - int(df_credit['default'].sum())} Good</div>
        </div>
        """, unsafe_allow_html=True)
    with col4:
        st.markdown(f"""
        <div class="kpi-card">
            <h4>Cost Asymmetry Ratio</h4>
            <div class="value">${cost_fn_dollars:,} : ${cost_fp_dollars:,}</div>
            <div class="sub">{cost_fn_dollars/cost_fp_dollars:.1f}x Penalty on Default</div>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("---")
    
    c_left, c_right = st.columns([1.1, 1.3])
    
    with c_left:
        st.markdown("#### The Cost Matrix in US Dollars")
        st.markdown("Credit approval mistakes have asymmetric costs. A missed default is far more damaging than a lost applicant:")
        
        cost_display_df = pd.DataFrame(
            [
                ["$0 (Correctly Approved)", f"-${cost_fp_dollars:,} (Foregone Interest Margin)"],
                [f"-${cost_fn_dollars:,} (Principal & Recovery Loss)", "$0 (Correctly Declined)"]
            ],
            index=["Actual Good Applicant", "Actual Default (Bad Risk)"],
            columns=["Predicted Good (Approve)", "Predicted Bad (Decline)"]
        )
        st.dataframe(cost_display_df, use_container_width=True)
        st.caption("Under standard 0.50 cutoff, banks suffer excessive defaults. Cost-optimal cutoff shifts to minimize net financial loss.")

    with c_right:
        st.markdown("#### 3-Tier Loan Officer Underwriting Workflow")
        st.markdown(f"""
        1. **Automated Clean Approval ($P(\\text{{Default}}) < {active_threshold*100:.1f}\\%$)**:
           - Fast-track credit lines. High savings reserves, stable employment, verified credit history.
        2. **Manual Underwriting Tier (${active_threshold*100:.1f}\\% \\le P(\\text{{Default}}) < 40.0\\%$)**:
           - Borderline zone. Loan officer reviews supplementary cash flows, requires co-signer or pledged collateral.
        3. **Adverse Action / Decline ($P(\\text{{Default}}) \\ge 40.0\\%$)**:
           - Exceeds risk tolerance. Prevents capital loss and complies with fair lending record-keeping.
        """)


# =========================================================
# TAB 2: DYNAMIC PORTFOLIO EXPLORER (FULLY REACTIVE)
# =========================================================
with tab2:
    st.markdown("### Interactive Portfolio Cohort Explorer")
    st.caption("Change any filter below — all KPIs, risk distributions, and charts update immediately in real time.")

    # Reactive Filters
    f1, f2, f3 = st.columns(3)
    with f1:
        purpose_opts = sorted(df_credit['purpose'].unique())
        selected_purposes = st.multiselect(
            "Filter by Loan Purpose:",
            options=purpose_opts,
            default=purpose_opts[:4]
        )
    with f2:
        checking_opts = sorted(df_credit['checking_status_usd'].unique())
        selected_checking = st.multiselect(
            "Filter by Checking Account Status ($):",
            options=checking_opts,
            default=checking_opts
        )
    with f3:
        max_amount_filter = st.slider(
            "Max Loan Amount ($):",
            min_value=1000,
            max_value=20000,
            value=20000,
            step=1000
        )

    # Reactive Filtering Execution
    active_df = df_credit[
        (df_credit['purpose'].isin(selected_purposes)) &
        (df_credit['checking_status_usd'].isin(selected_checking)) &
        (df_credit['credit_amount'] <= max_amount_filter)
    ]

    if active_df.empty:
        st.warning("⚠️ No applicants match the selected criteria. Please expand your filters above.")
    else:
        # Reactive Cohort KPIs
        cohort_count = len(active_df)
        cohort_volume = active_df['credit_amount'].sum()
        cohort_avg = active_df['credit_amount'].mean()
        cohort_defaults = int(active_df['default'].sum())
        cohort_def_rate = (cohort_defaults / cohort_count) * 100

        k1, k2, k3, k4 = st.columns(4)
        k1.metric("Selected Cohort Size", f"{cohort_count:,} applicants")
        k2.metric("Total Loan Exposure", f"${cohort_volume:,.0f}")
        k3.metric("Average Loan Amount", f"${cohort_avg:,.0f}")
        k4.metric("Cohort Default Rate", f"{cohort_def_rate:.1f}%", delta=f"{cohort_def_rate - def_rate:+.1f}% vs baseline", delta_color="inverse")

        st.markdown("#### Cohort Risk Factor Breakdown")
        g1, g2 = st.columns(2)

        with g1:
            # Checking Status vs Default Rate (USD)
            chk_grp = active_df.groupby('checking_status_usd')['default'].agg(['count', 'mean']).reset_index()
            chk_grp['Default Rate (%)'] = chk_grp['mean'] * 100
            fig_chk = px.bar(
                chk_grp,
                x='checking_status_usd',
                y='Default Rate (%)',
                color='Default Rate (%)',
                color_continuous_scale='Reds',
                title="Default Rate by Checking Status ($)",
                labels={'checking_status_usd': 'Checking Balance Tier ($)'}
            )
            fig_chk.update_layout(xaxis_tickangle=-20, height=330, margin=dict(l=20, r=20, t=40, b=40))
            st.plotly_chart(fig_chk, use_container_width=True)

        with g2:
            # Loan Amount vs Duration Scatter (USD)
            fig_scatter = px.scatter(
                active_df,
                x='duration_months',
                y='credit_amount',
                color='risk_label',
                color_discrete_map={'Good Risk (Non-Default)': '#10b981', 'Bad Risk (Default)': '#ef4444'},
                title="Loan Amount ($) vs Term (Months) by Risk",
                labels={'duration_months': 'Duration (Months)', 'credit_amount': 'Loan Amount ($)'},
                opacity=0.75
            )
            fig_scatter.update_layout(height=330, margin=dict(l=20, r=20, t=40, b=40))
            st.plotly_chart(fig_scatter, use_container_width=True)

        g3, g4 = st.columns(2)
        with g3:
            # Credit History vs Default Rate
            hist_grp = active_df.groupby('credit_history')['default'].agg(['count', 'mean']).reset_index()
            hist_grp['Default Rate (%)'] = hist_grp['mean'] * 100
            fig_hist = px.bar(
                hist_grp,
                x='credit_history',
                y='Default Rate (%)',
                color='Default Rate (%)',
                color_continuous_scale='Blues',
                title="Default Rate by Prior Credit History",
                labels={'credit_history': 'Credit History'}
            )
            fig_hist.update_layout(xaxis_tickangle=-25, height=330, margin=dict(l=20, r=20, t=40, b=60))
            st.plotly_chart(fig_hist, use_container_width=True)

        with g4:
            # Age Distribution by Risk
            fig_age = px.histogram(
                active_df,
                x='age',
                color='risk_label',
                barmode='overlay',
                nbins=25,
                color_discrete_map={'Good Risk (Non-Default)': '#10b981', 'Bad Risk (Default)': '#ef4444'},
                title="Applicant Age Distribution by Risk Status",
                labels={'age': 'Age (Years)'}
            )
            fig_age.update_layout(height=330, margin=dict(l=20, r=20, t=40, b=40))
            st.plotly_chart(fig_age, use_container_width=True)

        with st.expander("📄 View Filtered Portfolio Data Table", expanded=False):
            display_cols = ['checking_status_usd', 'savings_status_usd', 'duration_months', 'credit_amount', 'purpose', 'credit_history', 'age', 'risk_label']
            st.dataframe(active_df[display_cols].rename(columns={'checking_status_usd': 'Checking Status ($)', 'savings_status_usd': 'Savings Status ($)', 'credit_amount': 'Loan Amount ($)'}), use_container_width=True)


# =========================================================
# TAB 3: MODEL BENCHMARK & COST SENSITIVITY
# =========================================================
with tab3:
    st.markdown("### Model Benchmark: Logistic Regression vs KNN (N=200 Test Set)")
    st.caption(f"Financial exposure calculated under FN Loss = ${cost_fn_dollars:,} and FP Loss = ${cost_fp_dollars:,}.")

    # Compute metrics dynamically
    m_lr_active = compute_cost_metrics(y_test, y_prob_lr, threshold=active_threshold, cost_fn=cost_fn_unit, cost_fp=cost_fp_unit)
    m_knn_active = compute_cost_metrics(y_test, y_prob_knn, threshold=active_threshold, cost_fn=cost_fn_unit, cost_fp=cost_fp_unit)
    m_lr_05 = compute_cost_metrics(y_test, y_prob_lr, threshold=0.50, cost_fn=cost_fn_unit, cost_fp=cost_fp_unit)
    
    curves_lr = compute_roc_pr_curves(y_test, y_prob_lr)
    curves_knn = compute_roc_pr_curves(y_test, y_prob_knn)

    lr_dollar_cost = m_lr_active['total_cost'] * 1000
    lr_dollar_savings = (m_lr_05['total_cost'] - m_lr_active['total_cost']) * 1000

    b1, b2, b3, b4 = st.columns(4)
    b1.metric("Logistic Regression ROC-AUC", f"{curves_lr['roc_auc']:.3f}")
    b2.metric("KNN (k=9) ROC-AUC", f"{curves_knn['roc_auc']:.3f}", delta=f"{curves_knn['roc_auc'] - curves_lr['roc_auc']:.3f}")
    b3.metric("LR Total Portfolio Loss ($)", f"${lr_dollar_cost:,.0f}", delta=f"-${lr_dollar_savings:,.0f} vs 0.50 cutoff", delta_color="inverse")
    b4.metric("Active Approval Rate", f"{m_lr_active['approval_rate']*100:.1f}%")

    # Performance Comparison Table in Dollars
    st.markdown("#### Performance Summary Table @ Active Policy")
    benchmark_df = pd.DataFrame([
        {
            'Classifier': 'Logistic Regression (Active Policy)',
            'Cutoff (θ)': f"{active_threshold:.3f}",
            'Total Expected Loss ($)': f"${m_lr_active['total_cost']*1000:,.0f}",
            'Default Catch Rate (Recall)': f"{m_lr_active['recall']*100:.1f}%",
            'Missed Defaults (FN)': m_lr_active['fn'],
            'Missed Def. Loss ($)': f"${m_lr_active['fn']*cost_fn_dollars:,.0f}",
            'Unjust Rejections (FP)': m_lr_active['fp'],
            'Approval Rate': f"{m_lr_active['approval_rate']*100:.1f}%"
        },
        {
            'Classifier': 'K-Nearest Neighbors (k=9)',
            'Cutoff (θ)': f"{active_threshold:.3f}",
            'Total Expected Loss ($)': f"${m_knn_active['total_cost']*1000:,.0f}",
            'Default Catch Rate (Recall)': f"{m_knn_active['recall']*100:.1f}%",
            'Missed Defaults (FN)': m_knn_active['fn'],
            'Missed Def. Loss ($)': f"${m_knn_active['fn']*cost_fn_dollars:,.0f}",
            'Unjust Rejections (FP)': m_knn_active['fp'],
            'Approval Rate': f"{m_knn_active['approval_rate']*100:.1f}%"
        },
        {
            'Classifier': 'Logistic Regression (Baseline 0.50)',
            'Cutoff (θ)': "0.500",
            'Total Expected Loss ($)': f"${m_lr_05['total_cost']*1000:,.0f}",
            'Default Catch Rate (Recall)': f"{m_lr_05['recall']*100:.1f}%",
            'Missed Defaults (FN)': m_lr_05['fn'],
            'Missed Def. Loss ($)': f"${m_lr_05['fn']*cost_fn_dollars:,.0f}",
            'Unjust Rejections (FP)': m_lr_05['fp'],
            'Approval Rate': f"{m_lr_05['approval_rate']*100:.1f}%"
        }
    ])
    st.dataframe(benchmark_df, use_container_width=True)

    # Cost Sensitivity Curve
    st.markdown("#### Portfolio Loss ($) vs Decision Cutoff (θ)")
    sweep_lr = sweep_thresholds(y_test, y_prob_lr, cost_fn=cost_fn_unit, cost_fp=cost_fp_unit)
    sweep_knn = sweep_thresholds(y_test, y_prob_knn, cost_fn=cost_fn_unit, cost_fp=cost_fp_unit)

    fig_cost = go.Figure()
    fig_cost.add_trace(go.Scatter(
        x=sweep_lr['threshold'], y=sweep_lr['total_cost'] * 1000,
        mode='lines', name='Logistic Regression Loss ($)', line=dict(color='#2563eb', width=3)
    ))
    fig_cost.add_trace(go.Scatter(
        x=sweep_knn['threshold'], y=sweep_knn['total_cost'] * 1000,
        mode='lines', name='KNN Loss ($)', line=dict(color='#f97316', width=2.5, dash='dash')
    ))
    fig_cost.add_vline(x=active_threshold, line_dash="dot", line_color="#dc2626", annotation_text=f"Active ({active_threshold:.2f})")
    fig_cost.add_vline(x=bayes_threshold, line_dash="dashdot", line_color="#059669", annotation_text=f"Bayes ({bayes_threshold:.2f})")
    
    fig_cost.update_layout(
        xaxis_title="Decision Cutoff Threshold (θ)",
        yaxis_title="Total Financial Loss ($)",
        height=360,
        margin=dict(l=40, r=40, t=40, b=40)
    )
    st.plotly_chart(fig_cost, use_container_width=True)

    # Side-by-side Confusion Matrices
    cm1, cm2 = st.columns(2)
    with cm1:
        fig_cm_lr = px.imshow(
            [[m_lr_active['tn'], m_lr_active['fp']], [m_lr_active['fn'], m_lr_active['tp']]],
            text_auto=True,
            x=['Predicted Good', 'Predicted Bad'],
            y=['Actual Good', 'Actual Bad'],
            color_continuous_scale='Blues',
            title=f"LR Confusion Matrix (θ = {active_threshold:.2f})"
        )
        fig_cm_lr.update_layout(height=300, margin=dict(l=20, r=20, t=40, b=20))
        st.plotly_chart(fig_cm_lr, use_container_width=True)

    with cm2:
        fig_roc = go.Figure()
        fig_roc.add_trace(go.Scatter(x=curves_lr['fpr'], y=curves_lr['tpr'], mode='lines', name=f"LR (AUC={curves_lr['roc_auc']:.2f})", line=dict(color='#2563eb', width=2.5)))
        fig_roc.add_trace(go.Scatter(x=curves_knn['fpr'], y=curves_knn['tpr'], mode='lines', name=f"KNN (AUC={curves_knn['roc_auc']:.2f})", line=dict(color='#f97316', width=2.5, dash='dash')))
        fig_roc.add_trace(go.Scatter(x=[0, 1], y=[0, 1], mode='lines', line=dict(color='gray', dash='dot'), showlegend=False))
        fig_roc.update_layout(title="ROC Curves", xaxis_title="False Positive Rate", yaxis_title="Recall", height=300, margin=dict(l=20, r=20, t=40, b=20))
        st.plotly_chart(fig_roc, use_container_width=True)


# =========================================================
# TAB 4: LIVE LOAN UNDERWRITER
# =========================================================
with tab4:
    st.markdown("### Interactive Credit Applicant Underwriting")
    st.caption("Test prospective applicants or load credit presets. Live model inference updates in real time with US Dollar parameters.")

    preset_name = st.selectbox(
        "Load Borrower Preset Profile:",
        [
            "Prime Low-Risk Professional ($2,500 Loan, ≥ $200 Checking, Owns Real Estate)",
            "Near-Prime Borderline Applicant ($4,500 Loan, $0-$200 Checking, Renting)",
            "High-Risk Subprime Applicant ($6,000 Loan, Overdrawn Checking, Critical History)",
            "Custom Applicant Profile"
        ]
    )

    if "Prime" in preset_name:
        p_vals = {
            'checking_usd': '≥ $200 / Steady Salary',
            'duration': 12,
            'history': 'Existing credits paid duly till now',
            'purpose': 'Car (new)',
            'amount': 2500,
            'savings_usd': '≥ $1,000',
            'employment': '>= 7 years',
            'installment_rate': 2,
            'personal': 'Male : married/widowed',
            'debtors': 'None',
            'residence': 4,
            'property': 'Real estate',
            'age': 45,
            'other_plans': 'None',
            'housing': 'Own',
            'existing_credits': 2,
            'job': 'Management / self-employed / highly qualified',
            'dependents': 2,
            'telephone': 'Yes (registered in name)',
            'foreign': 'Yes'
        }
    elif "Near-Prime" in preset_name:
        p_vals = {
            'checking_usd': '$0 to $200',
            'duration': 24,
            'history': 'Delay in paying off in past',
            'purpose': 'Business',
            'amount': 4500,
            'savings_usd': '$100 to $500',
            'employment': '1 <= ... < 4 years',
            'installment_rate': 3,
            'personal': 'Female : divorced/separated/married',
            'debtors': 'None',
            'residence': 2,
            'property': 'Building society / life insurance',
            'age': 32,
            'other_plans': 'Bank',
            'housing': 'Rent',
            'existing_credits': 1,
            'job': 'Skilled employee / official',
            'dependents': 1,
            'telephone': 'Yes (registered in name)',
            'foreign': 'Yes'
        }
    elif "High-Risk" in preset_name:
        p_vals = {
            'checking_usd': '< $0 (Overdrawn)',
            'duration': 36,
            'history': 'Critical account / other credits elsewhere',
            'purpose': 'Radio / television',
            'amount': 6000,
            'savings_usd': '< $100',
            'employment': '< 1 year',
            'installment_rate': 4,
            'personal': 'Male : single',
            'debtors': 'None',
            'residence': 1,
            'property': 'Unknown / no property',
            'age': 22,
            'other_plans': 'Stores',
            'housing': 'Rent',
            'existing_credits': 1,
            'job': 'Unskilled resident',
            'dependents': 1,
            'telephone': 'None',
            'foreign': 'Yes'
        }
    else:
        p_vals = {
            'checking_usd': '$0 to $200',
            'duration': 18,
            'history': 'Existing credits paid duly till now',
            'purpose': 'Car (used)',
            'amount': 3000,
            'savings_usd': '< $100',
            'employment': '1 <= ... < 4 years',
            'installment_rate': 3,
            'personal': 'Male : single',
            'debtors': 'None',
            'residence': 2,
            'property': 'Car or other',
            'age': 30,
            'other_plans': 'None',
            'housing': 'Own',
            'existing_credits': 1,
            'job': 'Skilled employee / official',
            'dependents': 1,
            'telephone': 'None',
            'foreign': 'Yes'
        }

    # Underwriting Form Inputs
    st.markdown("#### 1. Financial & Loan Terms")
    u1, u2, u3 = st.columns(3)
    with u1:
        in_checking_usd = st.selectbox("Checking Account Balance ($)", list(USD_CHECKING_MAP.values()), index=list(USD_CHECKING_MAP.values()).index(p_vals['checking_usd']))
        in_savings_usd = st.selectbox("Savings Account Balance ($)", list(USD_SAVINGS_MAP.values()), index=list(USD_SAVINGS_MAP.values()).index(p_vals['savings_usd']))
        in_employment = st.selectbox("Employment Duration", list(CODE_MAPPINGS['employment_since'].values()), index=list(CODE_MAPPINGS['employment_since'].values()).index(p_vals['employment']))
    with u2:
        in_amount = st.slider("Loan Amount ($)", 250, 20000, int(p_vals['amount']), 250, format="$%d")
        in_duration = st.slider("Loan Term (Months)", 4, 72, int(p_vals['duration']), 1)
        in_installment = st.slider("Installment Rate (% of Net Income)", 1, 4, int(p_vals['installment_rate']), 1)
    with u3:
        in_purpose = st.selectbox("Loan Purpose", list(CODE_MAPPINGS['purpose'].values()), index=list(CODE_MAPPINGS['purpose'].values()).index(p_vals['purpose']))
        in_history = st.selectbox("Credit History", list(CODE_MAPPINGS['credit_history'].values()), index=list(CODE_MAPPINGS['credit_history'].values()).index(p_vals['history']))
        in_housing = st.selectbox("Housing Status", list(CODE_MAPPINGS['housing'].values()), index=list(CODE_MAPPINGS['housing'].values()).index(p_vals['housing']))

    st.markdown("#### 2. Demographics & Collateral")
    d1, d2, d3 = st.columns(3)
    with d1:
        in_age = st.slider("Applicant Age", 18, 75, int(p_vals['age']), 1)
        in_personal = st.selectbox("Marital Status & Gender", list(CODE_MAPPINGS['personal_status_sex'].values()), index=list(CODE_MAPPINGS['personal_status_sex'].values()).index(p_vals['personal']))
    with d2:
        in_property = st.selectbox("Property & Assets", list(CODE_MAPPINGS['property'].values()), index=list(CODE_MAPPINGS['property'].values()).index(p_vals['property']))
        in_debtors = st.selectbox("Guarantors / Co-signers", list(CODE_MAPPINGS['other_debtors'].values()), index=list(CODE_MAPPINGS['other_debtors'].values()).index(p_vals['debtors']))
    with d3:
        in_credits = st.slider("Existing Credits at This Bank", 1, 4, int(p_vals['existing_credits']), 1)
        in_foreign = st.selectbox("Foreign Worker Status", list(CODE_MAPPINGS['foreign_worker'].values()), index=list(CODE_MAPPINGS['foreign_worker'].values()).index(p_vals['foreign']))

    # Map USD labels back to original format expected by the model pipeline
    in_checking_raw = REV_CHECKING_MAP.get(in_checking_usd, in_checking_usd)
    in_savings_raw = REV_SAVINGS_MAP.get(in_savings_usd, in_savings_usd)

    applicant_data = {
        'checking_status': in_checking_raw,
        'duration_months': in_duration,
        'credit_history': in_history,
        'purpose': in_purpose,
        'credit_amount': in_amount,
        'savings_status': in_savings_raw,
        'employment_since': in_employment,
        'installment_rate': in_installment,
        'personal_status_sex': in_personal,
        'other_debtors': in_debtors,
        'residence_since': p_vals['residence'],
        'property': in_property,
        'age': in_age,
        'other_installment_plans': p_vals['other_plans'],
        'housing': in_housing,
        'existing_credits': in_credits,
        'job': p_vals['job'],
        'num_dependents': p_vals['dependents'],
        'telephone': p_vals['telephone'],
        'foreign_worker': in_foreign
    }
    app_df = pd.DataFrame([applicant_data])

    # Model Inference
    prob_lr = float(lr_model.predict_proba(app_df)[0, 1])
    prob_knn = float(knn_model.predict_proba(app_df)[0, 1])
    monthly_est = in_amount / in_duration

    st.markdown("---")
    st.markdown("### Real-Time Decision Recommendation")

    r1, r2 = st.columns([1, 1.2])

    with r1:
        fig_gauge = go.Figure(go.Indicator(
            mode="gauge+number",
            value=prob_lr * 100,
            domain={'x': [0, 1], 'y': [0, 1]},
            title={'text': "Default Risk Score (%)", 'font': {'size': 18}},
            number={'suffix': "%", 'font': {'size': 26, 'color': '#0f172a'}},
            gauge={
                'axis': {'range': [0, 100], 'tickwidth': 1},
                'bar': {'color': "#1e293b", 'thickness': 0.28},
                'bgcolor': "white",
                'steps': [
                    {'range': [0, active_threshold * 100], 'color': "#bbf7d0"},
                    {'range': [active_threshold * 100, 40], 'color': "#fef08a"},
                    {'range': [40, 100], 'color': "#fecaca"}
                ],
                'threshold': {
                    'line': {'color': "red", 'width': 4},
                    'thickness': 0.75,
                    'value': active_threshold * 100
                }
            }
        ))
        fig_gauge.update_layout(height=240, margin=dict(l=20, r=20, t=30, b=20))
        st.plotly_chart(fig_gauge, use_container_width=True)

    with r2:
        st.markdown(f"**Requested Loan:** `${in_amount:,}` over `{in_duration} months` (~`${monthly_est:,.0f}/mo`)")
        st.markdown(f"**Logistic Regression Default Risk:** `{prob_lr*100:.1f}%` (Cutoff: `{active_threshold*100:.1f}%`)")
        st.markdown(f"**KNN Classifier Risk:** `{prob_knn*100:.1f}%`")

        if prob_lr < active_threshold:
            st.markdown("""
            <div class="badge-approve">🟢 RECOMMENDED DECISION: APPROVE LOAN</div>
            <p style="margin-top: 8px; color: #065f46; font-size: 0.9rem;">
                <b>Low Default Risk.</b> Applicant risk is within the cost-optimal cutoff. Strong liquidity, reserves, and low financial exposure.
            </p>
            """, unsafe_allow_html=True)
        elif prob_lr < 0.40:
            st.markdown("""
            <div class="badge-review">🟡 RECOMMENDED DECISION: MANUAL UNDERWRITING REVIEW</div>
            <p style="margin-top: 8px; color: #92400e; font-size: 0.9rem;">
                <b>Borderline Risk.</b> Default probability exceeds automated approval threshold. Require co-signer, secondary income verification, or collateral pledge.
            </p>
            """, unsafe_allow_html=True)
        else:
            st.markdown("""
            <div class="badge-decline">🔴 RECOMMENDED DECISION: DECLINE CREDIT APPLICATION</div>
            <p style="margin-top: 8px; color: #991b1b; font-size: 0.9rem;">
                <b>Elevated Default Risk.</b> High likelihood of non-repayment. Risk exceeds bank tolerance under ${0:,} asymmetric loss policy.
            </p>
            """.format(cost_fn_dollars), unsafe_allow_html=True)

    # Top Influential Risk Drivers
    st.markdown("#### Primary Decision Drivers (Model Attribution)")
    top_drivers = feature_importances.head(8).copy()
    top_drivers['Direction'] = top_drivers['Coefficient'].apply(lambda x: 'Increases Risk (Default)' if x > 0 else 'Protective (Lowers Risk)')
    fig_imp = px.bar(
        top_drivers,
        x='Coefficient',
        y='Feature',
        orientation='h',
        color='Direction',
        color_discrete_map={'Increases Risk (Default)': '#ef4444', 'Protective (Lowers Risk)': '#10b981'},
        title="Key Factors Influencing Credit Assessment"
    )
    fig_imp.update_layout(yaxis={'categoryorder': 'total ascending'}, height=280, margin=dict(l=20, r=20, t=35, b=20))
    st.plotly_chart(fig_imp, use_container_width=True)


# =========================================================
# TAB 5: FAIRNESS & ECOA AUDIT
# =========================================================
with tab5:
    st.markdown("### Fair Lending & ECOA Demographic Audit")
    st.caption("Auditing Equal Credit Opportunity Act compliance and evaluating disparate impact across protected demographic classes.")

    subgroup_choice = st.selectbox(
        "Select Demographic Attribute to Audit:",
        ["Age Group (< 25 Young vs ≥ 25 Adult)", "Gender (Female vs Male)", "Foreign Worker Status (Foreign vs Domestic)"]
    )

    if "Age" in subgroup_choice:
        group_col = test_df['age_group']
        ref_g = 'Adult (>= 25)'
        prot_g = 'Young (< 25)'
    elif "Gender" in subgroup_choice:
        group_col = test_df['gender']
        ref_g = 'Male'
        prot_g = 'Female'
    else:
        group_col = test_df['foreign_worker_status']
        ref_g = 'Domestic Worker'
        prot_g = 'Foreign Worker'

    # Compute Group Metrics
    grp_df = compute_group_metrics(y_test, y_prob_lr, group_col, threshold=active_threshold)
    fairness_res = compute_fairness_summary(grp_df, ref_g, prot_g)
    
    di_ratio = fairness_res.get('disparate_impact_ratio', 0.0)
    passed_80 = fairness_res.get('passes_80_rule', False)

    fa1, fa2, fa3 = st.columns(3)
    fa1.metric("Disparate Impact Ratio", f"{di_ratio:.2f}", delta="Meets 80% Rule" if passed_80 else "Adverse Impact Warning", delta_color="normal" if passed_80 else "inverse")
    fa2.metric(f"Approval Rate: {ref_g}", f"{fairness_res.get('reference_approval_rate', 0):.1f}%")
    fa3.metric(f"Approval Rate: {prot_g}", f"{fairness_res.get('protected_approval_rate', 0):.1f}%")

    if not passed_80:
        st.warning(f"⚠️ **Adverse Impact Alert**: The approval rate for **{prot_g}** is {di_ratio*100:.1f}% of the reference group (below the 80% statutory threshold). Human review required to prevent systemic denial of credit.")
    else:
        st.success(f"✅ **Compliant**: Disparate impact ratio of {di_ratio:.2f} satisfies the 4/5ths (80%) regulatory threshold.")

    # Error Rate Disparity Chart
    st.markdown("#### Error Rate Distribution Across Groups")
    e_col1, e_col2 = st.columns(2)
    with e_col1:
        fig_fpr = px.bar(
            grp_df,
            x='Subgroup',
            y='False Positive Rate (FPR) %',
            color='Subgroup',
            title="False Positive Rate (Creditworthy Applicants Denied %)"
        )
        fig_fpr.update_layout(height=290, margin=dict(l=20, r=20, t=35, b=20))
        st.plotly_chart(fig_fpr, use_container_width=True)

    with e_col2:
        fig_fnr = px.bar(
            grp_df,
            x='Subgroup',
            y='False Negative Rate (FNR) %',
            color='Subgroup',
            title="False Negative Rate (Defaulted Applicants Approved %)"
        )
        fig_fnr.update_layout(height=290, margin=dict(l=20, r=20, t=35, b=20))
        st.plotly_chart(fig_fnr, use_container_width=True)

    with st.expander("📋 Detailed Subgroup Audit Table", expanded=False):
        st.dataframe(grp_df, use_container_width=True)
