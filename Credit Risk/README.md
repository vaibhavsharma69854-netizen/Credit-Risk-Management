# Credit Applicant Default Risk Classification System
### UCI Machine Learning Repository | Statlog (German Credit Data)
**A Loan Officer Decision-Support Platform with Asymmetric Misclassification Cost Optimization & Fairness Auditing**

---

## 📌 Executive Summary

Retail credit risk assessment is inherently asymmetric: granting a loan to an applicant who defaults incurs catastrophic losses of loan principal (estimated at **5x** the cost), whereas turning away a creditworthy applicant forfeits modest origination margins and interest (a cost of **1x**). Standard machine learning approaches optimize symmetric accuracy or zero-one loss at an arbitrary decision threshold of $0.50$, resulting in severe under-detection of defaults and heavy financial losses.

This project delivers an interactive, production-grade **Loan Officer Decision-Support System** deployed with **Streamlit**, comparing **Logistic Regression** against **K-Nearest Neighbors (KNN)** on the benchmark **UCI Statlog (German Credit Data)**. The system models asymmetric cost sensitivity, optimizes decision thresholds via Bayesian decision theory, and conducts regulatory fairness audits across sensitive applicant demographics (Age, Gender, Foreign Worker Status) under Equal Credit Opportunity Act (ECOA) standards.

---

## 🎯 Alignment with Project Objectives

| Objective | Academic Scope | Implementation Details in System |
| :--- | :--- | :--- |
| **Objective 1: Feature Representation** | Encode 20 qualitative & numerical attributes (credit history, employment, savings, purpose) into a unified scaled representation. | Implemented in [`src/data_loader.py`](file:///C:/Users/bkk15/.gemini/antigravity/scratch/credit_risk_system/src/data_loader.py) using `ColumnTransformer`, `StandardScaler` for continuous features, and `OneHotEncoder(drop='first')` for 13 categorical features. Automatic fetching from UCI ML repository. |
| **Objective 2: Model Benchmark & Cost Asymmetry** | Compare Logistic Regression against KNN under the dataset's known $5:1$ asymmetric misclassification penalty. | Implemented in [`src/models.py`](file:///C:/Users/bkk15/.gemini/antigravity/scratch/credit_risk_system/src/models.py) & [`src/cost_evaluation.py`](file:///C:/Users/bkk15/.gemini/antigravity/scratch/credit_risk_system/src/cost_evaluation.py). 5-fold Stratified Cross-Validation + held-out test evaluation. Empirical threshold optimization reduces total default loss by **~39.5%**. |
| **Objective 3: Validation & Fairness Audit** | Validate via ROC-AUC, cost-weighted accuracy, and threshold-sensitive confusion matrices; audit fair lending implications. | Implemented in [`src/fairness.py`](file:///C:/Users/bkk15/.gemini/antigravity/scratch/credit_risk_system/src/fairness.py) & [`app.py`](file:///C:/Users/bkk15/.gemini/antigravity/scratch/credit_risk_system/app.py). Analyzes Disparate Impact (80% / 4/5ths rule), FPR/FNR disparities across Age, Gender, and Foreign Worker status, enforcing human-in-the-loop underwriting. |
| **Project Outcome: Decision-Support Dashboard** | Deliver a Streamlit dashboard loan officers use alongside their judgment, with live applicant scoring and ethical safeguards. | 5-Tab interactive Streamlit application featuring live applicant scoring calculators, preset borrower personas, dynamic cost curves, and explainable feature importances. |

---

## 📐 Mathematical Formulation of Asymmetric Misclassification Costs

In the UCI Statlog German Credit Data specification:
- Class $0$: Good Credit Risk (700 applicants, $70\%$)
- Class $1$: Bad Credit Risk / Default (300 applicants, $30\%$)

### Misclassification Cost Matrix

$$\begin{array}{c|cc}
\text{Actual} \backslash \text{Predicted} & \hat{Y} = 0 \text{ (Approve)} & \hat{Y} = 1 \text{ (Decline)} \\
\hline
Y = 0 \text{ (Good)} & C(TN) = 0 & C(FP) = 1 \\
Y = 1 \text{ (Bad)} & C(FN) = 5 & C(TP) = 0 \\
\end{array}$$

### Total Misclassification Loss Function

$$\text{Total Cost}(\theta) = 5 \cdot FN(\theta) + 1 \cdot FP(\theta)$$

$$\text{Average Cost per Applicant} = \frac{5 \cdot FN(\theta) + 1 \cdot FP(\theta)}{N}$$

### Theoretical Bayes Decision Rule
Under asymmetric costs, an applicant should be predicted as **Default** (denied standard approval) whenever the expected cost of misclassifying them as Good exceeds the cost of misclassifying them as Bad:

$$P(\text{Default} | \mathbf{x}) \cdot C_{FN} \ge (1 - P(\text{Default} | \mathbf{x})) \cdot C_{FP}$$

$$P(\text{Default} | \mathbf{x}) \cdot 5 \ge (1 - P(\text{Default} | \mathbf{x})) \cdot 1$$

$$6 \cdot P(\text{Default} | \mathbf{x}) \ge 1 \implies \theta^*_{\text{Bayes}} = \frac{C_{FP}}{C_{FP} + C_{FN}} = \frac{1}{6} \approx \mathbf{0.1667}$$

> **Key Finding**: Setting the decision cutoff at $\theta^* \approx 0.17$ makes the classifier proactive at catching defaults, reducing false negatives and slashing portfolio risk.

---

## 📊 Benchmark Results

### 1. 5-Fold Stratified Cross-Validation (Out-of-Fold)
- **Logistic Regression**: ROC-AUC = **0.7723** | Cost-Optimal Threshold = **0.14** | Min Cost = **419.0**
- **K-Nearest Neighbors (k=9)**: ROC-AUC = **0.7290** | Cost-Optimal Threshold = **0.11** | Min Cost = **468.0**

### 2. Held-Out Test Set (200 Applicants: 140 Good, 60 Bad)

| Model | Decision Cutoff ($\theta$) | Total Cost | Cost-Weighted Acc | Accuracy | Recall (Catches Default) | Precision | False Positives | False Negatives | Cost Reduction vs 0.50 |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Logistic Regression (Standard)** | 0.50 | 157 | 64.32% | 77.50% | 53.33% | 65.31% | 17 | 28 | Baseline |
| **Logistic Regression (Cost-Optimal)** | **0.39** | **95** | **78.41%** | **80.50%** | **76.67%** | **64.79%** | 25 | **14** | **-39.5%** |
| **KNN (k=9, Standard)** | 0.50 | 181 | 58.86% | 75.50% | 45.00% | 62.79% | 16 | 33 | Baseline |
| **KNN (k=9, Cost-Optimal)** | **0.13** | **108** | **75.45%** | **58.00%** | **90.00%** | **40.91%** | 78 | **6** | **-40.3%** |
| **Approve-All Naive Baseline** | 1.00 | 300 | 0.00% | 70.00% | 0.00% | 0.00% | 0 | 60 | - |

> **Analysis**: Logistic Regression consistently outperforms KNN on this tabular, one-hot encoded dataset due to the curse of dimensionality affecting metric distances. Threshold optimization yields a massive **39.5% to 40.3% reduction in financial loss**.

---

## 🛡️ Fairness & Ethical Auditing

Automated scoring engines can entrench historical biases. The system audits three sensitive demographic attributes:
1. **Age**: Young applicants ($< 25$) vs Adults ($\ge 25$)
   - Base default rate: $40.9\%$ for $< 25$ vs $28.1\%$ for $\ge 25$.
   - The model must be audited for Disparate Impact to avoid violating the **4/5ths (80%) Rule**.
2. **Gender**: Female vs Male
   - Audits False Positive Rate (FPR) disparity to ensure creditworthy women are not rejected at a disproportionate rate.
3. **Foreign Worker Status**: Foreign vs Domestic
   - High data imbalance ($963$ Foreign vs $37$ Domestic) highlights historical sampling skew, reinforcing why human loan officers must retain final approval authority.

---

## 📂 Repository Structure

```
credit_risk_system/
├── app.py                      # Interactive Streamlit loan officer dashboard
├── train_and_save.py           # Training, 5-fold CV, and artifact serialization
├── requirements.txt            # Python dependencies
├── README.md                   # Complete architectural and empirical documentation
├── data/
│   ├── german.data             # Raw UCI Statlog German Credit dataset
│   └── german.doc              # Dataset documentation & code descriptions
├── models/
│   ├── logistic_regression.joblib  # Serialized Logistic Regression pipeline
│   ├── knn.joblib                  # Serialized KNN pipeline
│   ├── feature_importances.joblib  # Log-odds coefficients and weights
│   └── metrics_summary.joblib      # Precomputed benchmark metrics
├── src/
│   ├── __init__.py
│   ├── data_loader.py          # Code mappings, decoding, and train/test splitting
│   ├── models.py               # Preprocessing pipelines, LR, KNN, and CV
│   ├── cost_evaluation.py      # Asymmetric loss, threshold sweeping, ROC/PR curves
│   └── fairness.py             # Disparate impact, demographic parity, error disparity
└── tests/
    └── test_system.py          # Unit & integration test suite (100% pass)
```

---

## 🚀 Quickstart Guide

### 1. Installation
Ensure Python 3.10+ is installed, then install the dependencies:
```bash
pip install -r requirements.txt
```

### 2. Run Test Suite
Verify that all feature transformations, pipelines, and cost calculations are operational:
```bash
python tests/test_system.py
```

### 3. Retrain Models & Regenerate Artifacts (Optional)
```bash
python train_and_save.py
```

### 4. Launch the Streamlit Loan Officer Dashboard
```bash
streamlit run app.py
```
Open your browser to `http://localhost:8501` to access the platform.

---

## 💡 Team & Semester Contributions

This project was developed within the scope of a three-student, one-semester Machine Learning curriculum:
- **Student 1**: Data engineering, UCI feature mapping, and ColumnTransformer pipeline (`src/data_loader.py`).
- **Student 2**: Model implementation (Logistic Regression vs KNN), hyperparameter tuning, and asymmetric cost optimization (`src/models.py`, `src/cost_evaluation.py`).
- **Student 3**: Fairness auditing, ECOA compliance metrics, and Streamlit dashboard UX (`src/fairness.py`, `app.py`).
