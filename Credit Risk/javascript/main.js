/**
 * Credit Risk Intelligence System - Client-Side Interactive Engine
 * 100% Externalized JavaScript: Handles dynamic loan math, preset loading,
 * tab switching, and real-time risk tier evaluation with zero inline scripts.
 */

// Presets data model (USD values)
const BORROWER_PRESETS = {
    prime: {
        name: "Prime Low-Risk Professional",
        amount: 2500,
        duration: 12,
        installmentRate: 2,
        checking: "good",
        savings: "high",
        housing: "Own",
        age: 45,
        riskScore: 8.5
    },
    nearPrime: {
        name: "Near-Prime Borderline Applicant",
        amount: 4500,
        duration: 24,
        installmentRate: 3,
        checking: "mid",
        savings: "mid",
        housing: "Rent",
        age: 32,
        riskScore: 23.4
    },
    subprime: {
        name: "High-Risk Subprime Applicant",
        amount: 6000,
        duration: 36,
        installmentRate: 4,
        checking: "bad",
        savings: "low",
        housing: "Rent",
        age: 22,
        riskScore: 61.2
    }
};

/**
 * Calculates monthly installment payment with annual interest rate.
 * @param {number} principal - Loan amount in USD
 * @param {number} months - Term in months
 * @param {number} annualRate - APR in percent (default 8.5%)
 * @returns {number} Monthly payment in USD
 */
function calculateMonthlyPayment(principal, months, annualRate = 8.5) {
    if (!principal || !months || months <= 0) return 0;
    const monthlyRate = annualRate / 100 / 12;
    const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                    (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(payment);
}

/**
 * Computes decision classification based on risk probability and active threshold.
 * @param {number} riskProb - Default probability (0 to 1)
 * @param {number} activeThreshold - Cost-optimal cutoff
 * @returns {object} Badge and description payload
 */
function evaluateRiskDecision(riskProb, activeThreshold = 0.167) {
    if (riskProb < activeThreshold) {
        return {
            tier: "APPROVE",
            badgeClass: "badge-approve",
            icon: "🟢",
            title: "APPROVE LOAN",
            color: "#34d399",
            description: "Low Default Risk. Applicant risk is within the cost-optimal cutoff. Strong liquidity, high savings, and low debt ratio."
        };
    } else if (riskProb < 0.40) {
        return {
            tier: "REVIEW",
            badgeClass: "badge-review",
            icon: "🟡",
            title: "MANUAL UNDERWRITING REVIEW",
            color: "#fbbf24",
            description: "Borderline Risk. Risk exceeds automated cutoff. Require co-signer, secondary income verification, or collateral pledge."
        };
    } else {
        return {
            tier: "DECLINE",
            badgeClass: "badge-decline",
            icon: "🔴",
            title: "DECLINE CREDIT APPLICATION",
            color: "#f87171",
            description: "Elevated Default Risk. High probability of non-repayment. Risk exceeds bank tolerance under asymmetric loss policy."
        };
    }
}

/**
 * Tab switcher function
 * @param {string} tabId - Target tab identifier
 * @param {HTMLElement} activeBtn - Clicked tab button element
 */
function switchTab(tabId, activeBtn) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    const targetContent = document.getElementById('tab-' + tabId);
    if (targetContent) {
        targetContent.classList.add('active');
    }
}

/**
 * Applies a borrower preset to the input form
 * @param {string} presetKey - Key in BORROWER_PRESETS
 */
function applyPreset(presetKey) {
    const data = BORROWER_PRESETS[presetKey];
    if (!data) return;

    const inpAmt = document.getElementById('inpAmount');
    const inpDur = document.getElementById('inpDuration');
    const inpChk = document.getElementById('inpChecking');
    const inpSav = document.getElementById('inpSavings');
    const inpHous = document.getElementById('inpHousing');
    const inpAge = document.getElementById('inpAge');

    if (inpAmt) inpAmt.value = data.amount;
    if (inpDur) inpDur.value = data.duration;
    if (inpChk) inpChk.value = data.checking;
    if (inpSav) inpSav.value = data.savings;
    if (inpHous) inpHous.value = data.housing;
    if (inpAge) inpAge.value = data.age;

    updateLoanAssessment(data.riskScore);
}

/**
 * Recalculates repayment amount, calibrated risk score, and decision badge
 * @param {number} customScore - Optional predetermined score
 */
function updateLoanAssessment(customScore) {
    const inpAmt = document.getElementById('inpAmount');
    const inpDur = document.getElementById('inpDuration');
    const inpChk = document.getElementById('inpChecking');
    const monthlyDisplay = document.getElementById('monthlyPaymentDisplay');
    const riskDisplay = document.getElementById('riskScoreDisplay');
    const badgeContainer = document.getElementById('decisionBadgeContainer');
    const descEl = document.getElementById('decisionDesc');

    const amt = parseFloat(inpAmt ? inpAmt.value : 2500) || 2500;
    const dur = parseInt(inpDur ? inpDur.value : 12) || 12;
    const monthly = calculateMonthlyPayment(amt, dur);

    if (monthlyDisplay) {
        monthlyDisplay.innerText = `$${monthly.toLocaleString()} / month`;
    }

    let score = customScore;
    if (score === undefined && inpChk) {
        const chk = inpChk.value;
        score = (chk === 'bad') ? 58.0 : (chk === 'mid' ? 24.0 : 8.5);
    } else if (score === undefined) {
        score = 8.5;
    }

    if (riskDisplay) {
        riskDisplay.innerText = `${score.toFixed(1)}%`;
    }

    const evaluation = evaluateRiskDecision(score / 100);

    if (badgeContainer) {
        badgeContainer.innerHTML = `<div class="${evaluation.badgeClass}">${evaluation.icon} RECOMMENDED DECISION: ${evaluation.title}</div>`;
    }

    if (descEl) {
        descEl.innerText = evaluation.description;
        descEl.style.color = evaluation.color;
    }
}

// Bind DOM event listeners automatically when loaded
document.addEventListener('DOMContentLoaded', () => {
    // Tab button click delegation
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabId = btn.getAttribute('data-tab');
            if (tabId) {
                switchTab(tabId, btn);
            }
        });
    });

    // Preset selector change listener
    const presetSelect = document.getElementById('presetSelect');
    if (presetSelect) {
        presetSelect.addEventListener('change', (e) => {
            applyPreset(e.target.value);
        });
    }

    // Input change listeners
    ['inpAmount', 'inpDuration', 'inpAge'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', () => updateLoanAssessment());
        }
    });

    ['inpChecking', 'inpSavings', 'inpHousing'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('change', () => updateLoanAssessment());
        }
    });

    // Initial assessment run
    updateLoanAssessment();
});

// Export globally
if (typeof window !== 'undefined') {
    window.CreditRisk = {
        BORROWER_PRESETS,
        calculateMonthlyPayment,
        evaluateRiskDecision,
        switchTab,
        applyPreset,
        updateLoanAssessment
    };
}
