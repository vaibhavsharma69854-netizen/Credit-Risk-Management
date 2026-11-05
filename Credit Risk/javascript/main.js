/**
 * Credit Risk Intelligence System - Client-Side Interactive Engine
 * Handles dynamic loan repayments, risk tier transitions, and preset switching.
 */

// Presets data model (USD values)
const BORROWER_PRESETS = {
    prime: {
        name: "Prime Low-Risk Professional",
        amount: 2500,
        duration: 12,
        installmentRate: 2,
        checking: "≥ $200 / Steady Salary",
        savings: "≥ $1,000",
        history: "Existing credits paid duly till now",
        housing: "Own",
        riskScore: 8.5
    },
    nearPrime: {
        name: "Near-Prime Borderline Applicant",
        amount: 4500,
        duration: 24,
        installmentRate: 3,
        checking: "$0 to $200",
        savings: "$100 to $500",
        history: "Delay in paying off in past",
        housing: "Rent",
        riskScore: 23.4
    },
    subprime: {
        name: "High-Risk Subprime Applicant",
        amount: 6000,
        duration: 36,
        installmentRate: 4,
        checking: "< $0 (Overdrawn)",
        savings: "< $100",
        history: "Critical account / other credits elsewhere",
        housing: "Rent",
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
            description: "Low Default Risk. Applicant risk is within the cost-optimal cutoff. Strong liquidity and verified repayment capacity."
        };
    } else if (riskProb < 0.40) {
        return {
            tier: "REVIEW",
            badgeClass: "badge-review",
            icon: "🟡",
            title: "MANUAL UNDERWRITING REVIEW",
            description: "Borderline Risk. Risk exceeds automated cutoff. Require co-signer, secondary income verification, or collateral pledge."
        };
    } else {
        return {
            tier: "DECLINE",
            badgeClass: "badge-decline",
            icon: "🔴",
            title: "DECLINE CREDIT APPLICATION",
            description: "Elevated Default Risk. High probability of non-repayment. Risk exceeds bank tolerance under asymmetric loss policy."
        };
    }
}

// Export for module or global use
if (typeof window !== 'undefined') {
    window.CreditRisk = {
        BORROWER_PRESETS,
        calculateMonthlyPayment,
        evaluateRiskDecision
    };
}
