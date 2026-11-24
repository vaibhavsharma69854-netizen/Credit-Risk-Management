/**
 * Credit Risk Intelligence & Underwriting System
 * Client-Side Interactive Underwriting Engine with Refined Off-White Palette
 * Deep Dark Obsidian Headings & Highlights (Zero Pure White)
 * All monetary amounts in USD ($)
 */

// Comprehensive Applicant Database & Real UCI Benchmark Records
const BORROWER_PROFILES = {
    sarah: {
        applicantName: "Sarah Jenkins",
        name: "Sarah Jenkins (Software Engineer) — $5,000 Loan • High Savings • Prime 780 FICO",
        amount: 5000,
        duration: 24,
        fico: 780,
        grossIncome: 7500,
        monthlyDebt: 1100,
        checking: "good",
        savings: "high",
        employment: ">= 7 years",
        housing: "Own",
        purpose: "Car (new)",
        history: "Existing credits paid duly till now",
        age: 46
    },
    marcus: {
        applicantName: "Marcus Vance",
        name: "Marcus Vance (Freelancer) — $8,000 Loan • Moderate Savings • Near-Prime 675 FICO",
        amount: 8000,
        duration: 36,
        fico: 675,
        grossIncome: 4800,
        monthlyDebt: 1450,
        checking: "mid",
        savings: "mid",
        employment: "1 <= ... < 4 years",
        housing: "Rent",
        purpose: "Business",
        history: "Delay in paying off in past",
        age: 33
    },
    david: {
        applicantName: "David Miller",
        name: "David Miller (Recent Graduate) — $6,000 Loan • Low Savings • Subprime 570 FICO",
        amount: 6000,
        duration: 36,
        fico: 570,
        grossIncome: 3100,
        monthlyDebt: 1250,
        checking: "overdrawn",
        savings: "low",
        employment: "< 1 year",
        housing: "Rent",
        purpose: "Radio / television",
        history: "Critical account / other credits elsewhere",
        age: 23
    },
    real_104: {
        applicantName: "Applicant #104 (UCI Auto Loan)",
        name: "Applicant #104: Approved Auto Loan (FICO 745, DTI 28%, Safe Reserves)",
        amount: 2427,
        duration: 24,
        fico: 745,
        grossIncome: 6800,
        monthlyDebt: 900,
        checking: "good",
        savings: "high",
        employment: ">= 7 years",
        housing: "Own",
        purpose: "Car (new)",
        history: "Existing credits paid duly till now",
        age: 43
    },
    real_312: {
        applicantName: "Applicant #312 (UCI Commercial Loan)",
        name: "Applicant #312: Defaulted Commercial Loan (FICO 585, Overdrawn, Critical History)",
        amount: 5234,
        duration: 36,
        fico: 585,
        grossIncome: 3400,
        monthlyDebt: 1300,
        checking: "overdrawn",
        savings: "low",
        employment: "1 <= ... < 4 years",
        housing: "Rent",
        purpose: "Business",
        history: "Critical account / other credits elsewhere",
        age: 34
    },
    real_582: {
        applicantName: "Applicant #582 (UCI Equipment Loan)",
        name: "Applicant #582: Equipment Loan (FICO 660, Borderline DTI 41%)",
        amount: 7127,
        duration: 48,
        fico: 660,
        grossIncome: 5100,
        monthlyDebt: 1600,
        checking: "mid",
        savings: "mid",
        employment: "4 <= ... < 7 years",
        housing: "Own",
        purpose: "Radio / television",
        history: "Existing credits paid duly till now",
        age: 39
    },
    real_876: {
        applicantName: "Applicant #876 (UCI Emergency Repair Loan)",
        name: "Applicant #876: Emergency Repair Loan (FICO 530, Zero Cushion, Overdrawn)",
        amount: 3965,
        duration: 18,
        fico: 530,
        grossIncome: 2400,
        monthlyDebt: 1100,
        checking: "overdrawn",
        savings: "low",
        employment: "< 1 year",
        housing: "Rent",
        purpose: "Repairs",
        history: "Delay in paying off in past",
        age: 22
    }
};

// Global Chart Instances
let chartInstances = {};

// History Storage Key & Default Seed Data
const HISTORY_STORAGE_KEY = 'credit_underwriter_history_v1';

const DEFAULT_HISTORY = [
    {
        id: "APP-2026-104",
        date: "2026-11-24 10:15",
        name: "Sarah Jenkins",
        amount: 5000,
        duration: 24,
        apr: 5.99,
        monthlyPayment: 221,
        fico: 780,
        dti: 22.4,
        status: "APPROVE",
        prob: 0.045,
        params: {
            amount: 5000, duration: 24, fico: 780, grossIncome: 7500, monthlyDebt: 1100,
            checking: "good", savings: "high", employment: ">= 7 years", housing: "Own",
            purpose: "Car (new)", history: "Existing credits paid duly till now", age: 46
        }
    },
    {
        id: "APP-2026-312",
        date: "2026-11-23 15:40",
        name: "Marcus Vance",
        amount: 8000,
        duration: 36,
        apr: 10.99,
        monthlyPayment: 262,
        fico: 675,
        dti: 38.2,
        status: "CONDITIONAL",
        prob: 0.158,
        params: {
            amount: 8000, duration: 36, fico: 675, grossIncome: 4800, monthlyDebt: 1450,
            checking: "mid", savings: "mid", employment: "1 <= ... < 4 years", housing: "Rent",
            purpose: "Business", history: "Delay in paying off in past", age: 33
        }
    },
    {
        id: "APP-2026-876",
        date: "2026-11-22 09:20",
        name: "David Miller",
        amount: 6000,
        duration: 36,
        apr: 22.45,
        monthlyPayment: 231,
        fico: 570,
        dti: 48.6,
        status: "DECLINE",
        prob: 0.442,
        params: {
            amount: 6000, duration: 36, fico: 570, grossIncome: 3100, monthlyDebt: 1250,
            checking: "overdrawn", savings: "low", employment: "< 1 year", housing: "Rent",
            purpose: "Radio / television", history: "Critical account / other credits elsewhere", age: 23
        }
    }
];

/**
 * Configure Chart.js Clean Off-White Palette
 */
function configureChartDefaults() {
    if (typeof Chart !== 'undefined') {
        Chart.defaults.color = '#334155';
        Chart.defaults.font.family = "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif";
        Chart.defaults.borderColor = '#e2dfd5';
        Chart.defaults.plugins.legend.labels.usePointStyle = true;
        Chart.defaults.plugins.legend.labels.color = '#0f172a';
        Chart.defaults.plugins.tooltip.backgroundColor = '#0f172a';
        Chart.defaults.plugins.tooltip.titleColor = '#f5f4ef';
        Chart.defaults.plugins.tooltip.bodyColor = '#f5f4ef';
        Chart.defaults.plugins.tooltip.borderColor = '#334155';
        Chart.defaults.plugins.tooltip.borderWidth = 1;
        Chart.defaults.plugins.tooltip.padding = 10;
        Chart.defaults.plugins.tooltip.cornerRadius = 8;
    }
}

/**
 * Risk-Adjusted Annual Percentage Rate (APR) in USD Lending
 */
function calculateRiskBasedApr(fico, dti) {
    let apr = 5.99; // Prime base rate for conforming loans
    
    // Credit Score Tiers
    if (fico >= 760) apr += 0.00;
    else if (fico >= 720) apr += 1.25;
    else if (fico >= 680) apr += 2.80;
    else if (fico >= 640) apr += 4.95;
    else if (fico >= 600) apr += 8.20;
    else apr += 13.50;

    // Debt Burden (DTI) Spread
    if (dti > 50) apr += 3.75;
    else if (dti > 43) apr += 2.20;
    else if (dti > 36) apr += 0.90;

    return Math.min(29.99, Math.max(4.99, apr));
}

/**
 * Fixed Amortization Monthly Payment Formula
 */
function calculateMonthlyPayment(principal, months, annualRate = 7.5) {
    if (months <= 0) return 0;
    const r = (annualRate / 100) / 12;
    if (r === 0) return Math.round(principal / months);
    const payment = (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
    return Math.round(payment);
}

/**
 * Estimated Liquid Reserves based on deposit tier
 */
function getEstimatedSavings(savingsTier) {
    switch (savingsTier) {
        case 'high': return 16500;
        case 'mid': return 4800;
        case 'low': return 450;
        default: return 2000;
    }
}

/**
 * Calibrated Model Default Probability Function
 */
function computeComprehensiveUnderwritingRisk(params) {
    let logit = -1.65; // Base log-odds (corresponds to ~16% base default rate)

    // FICO Score Impact
    if (params.fico >= 750) logit -= 1.15;
    else if (params.fico >= 700) logit -= 0.65;
    else if (params.fico >= 640) logit += 0.15;
    else if (params.fico >= 600) logit += 0.85;
    else logit += 1.65;

    // Debt-to-Income (DTI) Impact
    if (params.dti > 50) logit += 1.35;
    else if (params.dti > 43) logit += 0.75;
    else if (params.dti <= 30) logit -= 0.50;

    // Checking Account Health
    if (params.checking === 'good') logit -= 0.95;
    else if (params.checking === 'mid') logit += 0.10;
    else if (params.checking === 'overdrawn') logit += 1.40;

    // Reserve Liquidity Cushion
    if (params.reserveMonths >= 6.0) logit -= 0.65;
    else if (params.reserveMonths < 1.0) logit += 0.90;

    // Loan Duration & Size
    if (params.duration > 36) logit += 0.40;
    if (params.amount > 10000) logit += 0.35;
    if (params.housing === 'Own') logit -= 0.30;

    // Logistic Sigmoid
    return 1 / (1 + Math.exp(-logit));
}

/**
 * Adjudicates Decision based on Underwriting Thresholds
 */
function adjudicateLoanDecision(prob, dti, fico, reserveMonths, threshold = 0.167) {
    const isModelApprove = prob <= threshold;
    const isDtiPass = dti <= 43.0;
    const isFicoPass = fico >= 620;
    const isReservesPass = reserveMonths >= 2.0;

    if (isModelApprove && isDtiPass && isFicoPass && isReservesPass) {
        return {
            status: "APPROVE",
            title: "APPROVE CREDIT FACILITY",
            badgeClass: "badge-approve",
            icon: "🟢",
            summary: "Prime Conforming Loan.",
            description: "Applicant exceeds all institutional underwriting standards. Fast-track automated loan issuance approved."
        };
    } else if (isModelApprove && (!isDtiPass || !isReservesPass || !isFicoPass)) {
        return {
            status: "CONDITIONAL",
            title: "CONDITIONAL APPROVAL (STIPULATIONS REQUIRED)",
            badgeClass: "badge-conditional",
            icon: "🟡",
            summary: "Conditional Approval.",
            description: "Statistical default risk is manageable, but secondary policy criteria require verification or risk mitigation."
        };
    } else {
        return {
            status: "DECLINE",
            title: "DECLINE CREDIT APPLICATION",
            badgeClass: "badge-decline",
            icon: "🔴",
            summary: "High Default Risk Profile.",
            description: "Calibrated default risk exceeds statutory safety thresholds. Adverse action notice mandated under ECOA."
        };
    }
}

/**
 * Generate Layman-Friendly Plain-English Advice
 */
function generateLaymanAdvice(data) {
    const { status, finalDti, ficoScore, reserveCoverageMonths, monthlyLoanPayment, freeCashFlow, riskApr, durationMonths, loanAmount, applicantName } = data;
    const namePrefix = applicantName ? `<b>${applicantName}</b>: ` : "";

    if (status === "APPROVE") {
        return {
            header: `🎉 Congratulations ${applicantName}! You are fully qualified for this loan.`,
            body: `${namePrefix}Your estimated monthly payment is <b>$${monthlyLoanPayment.toLocaleString()} / mo</b> at a prime <b>${riskApr.toFixed(2)}% APR</b>. Because your debt burden is low (${finalDti.toFixed(1)}% of your income), you will easily keep <b>+$${Math.max(0, freeCashFlow).toLocaleString()} in free cash</b> every month. You are approved to proceed!`
        };
    } else if (status === "CONDITIONAL") {
        let adviceTip = "";
        if (finalDti > 43) {
            const longerTerm = Math.min(60, durationMonths + 12);
            adviceTip = `Your monthly debts take up <b>${finalDti.toFixed(1)}%</b> of your income (banks prefer 43% or lower). <b>Quick Fix:</b> Try extending your loan term to <b>${longerTerm} months</b> or lowering your loan by $1,000 to drop your monthly bill and turn this into a full green approval!`;
        } else if (ficoScore < 620) {
            adviceTip = `Your credit score of <b>${Math.round(ficoScore)}</b> is slightly below the 620 bank benchmark. <b>Quick Fix:</b> Having a family member co-sign with you or paying off a small credit card balance will unlock immediate approval.`;
        } else {
            adviceTip = `Your emergency savings buffer of <b>${reserveCoverageMonths.toFixed(1)} months</b> is a bit slim. Having at least 2 months of living expenses saved up gives the bank 100% confidence to fund your loan.`;
        }
        return {
            header: `💡 Almost there ${applicantName}! Here is how to get fully approved:`,
            body: `${namePrefix}${adviceTip}`
        };
    } else {
        let adviceTip = "";
        if (finalDti > 48) {
            adviceTip = `Your current monthly debt obligations plus this new loan would consume <b>${finalDti.toFixed(1)}%</b> of your monthly earnings, leaving too little margin for everyday life. <b>Recommendation:</b> Request a smaller loan (e.g. $${Math.max(1000, loanAmount - 2000).toLocaleString()}) or choose a longer repayment term to make payments safe and affordable.`;
        } else if (ficoScore < 580) {
            adviceTip = `Your credit score of <b>${Math.round(ficoScore)}</b> is in the high-risk range. <b>Recommendation:</b> Adding a creditworthy co-signer or bringing a 20% cash down payment will dramatically increase your chances of loan funding.`;
        } else {
            adviceTip = `Our AI model calculates a high likelihood of financial stress under these terms. <b>Recommendation:</b> Reducing the borrowed amount or applying after building up 2-3 months of emergency savings will turn this into an approval.`;
        }
        return {
            header: `⚠️ Actionable Underwriting Advice for ${applicantName}:`,
            body: `${namePrefix}${adviceTip}`
        };
    }
}

/**
 * Tab Navigation
 */
function switchTab(tabId, activeBtn) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    const targetTab = document.getElementById(`tab-${tabId}`);
    if (targetTab) targetTab.classList.add('active');
    
    // Find matching tab button if not passed directly
    if (!activeBtn) {
        activeBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    }
    if (activeBtn) activeBtn.classList.add('active');

    // Trigger chart redraw when switching tabs to ensure proper canvas sizing
    setTimeout(() => {
        Object.values(chartInstances).forEach(chart => {
            if (chart && typeof chart.resize === 'function') chart.resize();
        });
    }, 100);
}

/**
 * Apply Profile Preset
 */
function applyProfile(profileKey) {
    const profile = BORROWER_PROFILES[profileKey];
    if (!profile) return;

    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.value = val;
    };

    setVal('inpApplicantName', profile.applicantName || "Sarah Jenkins");
    setVal('inpAmount', profile.amount);
    setVal('inpDuration', profile.duration);
    setVal('inpFico', profile.fico);
    setVal('inpGrossIncome', profile.grossIncome);
    setVal('inpMonthlyDebt', profile.monthlyDebt);
    setVal('inpChecking', profile.checking);
    setVal('inpSavings', profile.savings);
    setVal('inpEmployment', profile.employment);
    setVal('inpHousing', profile.housing);
    setVal('inpPurpose', profile.purpose);
    setVal('inpHistory', profile.history);
    setVal('inpAge', profile.age);

    const appIdEl = document.getElementById('displayAppId');
    if (appIdEl) {
        appIdEl.innerText = `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    updateUnderwriterCalculations();
}

/**
 * Update Interactive Live Charts in Tab 1
 */
function updateUnderwriterCharts(data) {
    if (typeof Chart === 'undefined') return;

    const {
        existingMonthlyDebt,
        monthlyLoanPayment,
        freeCashFlow,
        finalDti,
        loanAmount,
        durationMonths,
        riskApr,
        ficoScore,
        checkingStatus,
        reserveCoverageMonths
    } = data;

    const totalRepayment = monthlyLoanPayment * durationMonths;
    const totalInterest = Math.max(0, totalRepayment - loanAmount);

    // -------------------------------------------------------------
    // Chart 1: Monthly Budget Donut Chart
    // -------------------------------------------------------------
    const budgetCtx = document.getElementById('budgetDonutChart');
    if (budgetCtx) {
        if (!chartInstances.budget) {
            chartInstances.budget = new Chart(budgetCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Existing Debt', 'New Loan Payment', 'Free Pocket Cash'],
                    datasets: [{
                        data: [existingMonthlyDebt, monthlyLoanPayment, Math.max(0, freeCashFlow)],
                        backgroundColor: ['#dc2626', '#0284c7', '#059669'],
                        borderWidth: 2,
                        borderColor: '#faf9f5',
                        hoverOffset: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom' },
                        tooltip: {
                            callbacks: {
                                label: ctx => ` ${ctx.label}: $${ctx.raw.toLocaleString()}`
                            }
                        }
                    },
                    cutout: '65%'
                }
            });
        } else {
            chartInstances.budget.data.datasets[0].data = [
                existingMonthlyDebt,
                monthlyLoanPayment,
                Math.max(0, freeCashFlow)
            ];
            chartInstances.budget.update();
        }
    }

    // -------------------------------------------------------------
    // Chart 2: DTI Benchmark Bar Chart
    // -------------------------------------------------------------
    const dtiCtx = document.getElementById('dtiBenchmarkChart');
    if (dtiCtx) {
        const dtiColor = finalDti <= 36 ? '#059669' : (finalDti <= 43 ? '#d97706' : '#dc2626');
        if (!chartInstances.dti) {
            chartInstances.dti = new Chart(dtiCtx, {
                type: 'bar',
                data: {
                    labels: ['Your DTI', 'Prime Target (36%)', 'Max Ceiling (43%)'],
                    datasets: [{
                        label: 'Debt-to-Income Ratio (%)',
                        data: [parseFloat(finalDti.toFixed(1)), 36.0, 43.0],
                        backgroundColor: [dtiColor, 'rgba(2, 132, 199, 0.35)', 'rgba(220, 38, 38, 0.35)'],
                        borderColor: [dtiColor, '#0284c7', '#dc2626'],
                        borderWidth: 1.5,
                        borderRadius: 6
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            beginAtZero: true,
                            max: Math.max(60, Math.ceil(finalDti + 10)),
                            ticks: { callback: v => `${v}%` }
                        }
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: ctx => ` Ratio: ${ctx.raw}%`
                            }
                        }
                    }
                }
            });
        } else {
            chartInstances.dti.data.datasets[0].data[0] = parseFloat(finalDti.toFixed(1));
            chartInstances.dti.data.datasets[0].backgroundColor[0] = dtiColor;
            chartInstances.dti.data.datasets[0].borderColor[0] = dtiColor;
            chartInstances.dti.options.scales.x.max = Math.max(60, Math.ceil(finalDti + 10));
            chartInstances.dti.update();
        }
    }

    // -------------------------------------------------------------
    // Chart 3: Total Repayment (Principal vs Interest)
    // -------------------------------------------------------------
    const paybackCtx = document.getElementById('loanRepaymentChart');
    if (paybackCtx) {
        if (!chartInstances.payback) {
            chartInstances.payback = new Chart(paybackCtx, {
                type: 'bar',
                data: {
                    labels: ['Principal Borrowed', 'Total Interest Cost'],
                    datasets: [{
                        label: 'Loan Cost Breakdown ($)',
                        data: [loanAmount, totalInterest],
                        backgroundColor: ['#0f172a', '#d97706'],
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { callback: v => `$${v.toLocaleString()}` }
                        }
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: ctx => ` ${ctx.label}: $${ctx.raw.toLocaleString()}`
                            }
                        }
                    }
                }
            });
        } else {
            chartInstances.payback.data.datasets[0].data = [loanAmount, totalInterest];
            chartInstances.payback.update();
        }
    }

    // -------------------------------------------------------------
    // Chart 4: Loan Balance Paydown Schedule (Amortization Curve)
    // -------------------------------------------------------------
    const amortCtx = document.getElementById('amortizationScheduleChart');
    if (amortCtx) {
        // Generate month intervals: 0, and intervals up to durationMonths
        const numPoints = Math.min(durationMonths + 1, 7);
        const step = Math.max(1, Math.floor(durationMonths / (numPoints - 1)));
        const labels = [];
        const balances = [];
        const rMonthly = (riskApr / 100) / 12;

        for (let m = 0; m <= durationMonths; m += step) {
            labels.push(`Mo ${m}`);
            if (m === 0) {
                balances.push(loanAmount);
            } else if (m >= durationMonths) {
                balances.push(0);
            } else {
                if (rMonthly > 0) {
                    const factorTotal = Math.pow(1 + rMonthly, durationMonths);
                    const factorCur = Math.pow(1 + rMonthly, m);
                    const bal = loanAmount * (factorTotal - factorCur) / (factorTotal - 1);
                    balances.push(Math.max(0, Math.round(bal)));
                } else {
                    const bal = loanAmount * (1 - m / durationMonths);
                    balances.push(Math.max(0, Math.round(bal)));
                }
            }
        }
        // Ensure final point is exactly durationMonths
        if (labels[labels.length - 1] !== `Mo ${durationMonths}`) {
            labels.push(`Mo ${durationMonths}`);
            balances.push(0);
        }

        if (!chartInstances.amortization) {
            chartInstances.amortization = new Chart(amortCtx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Remaining Principal Balance ($)',
                        data: balances,
                        borderColor: '#0f172a',
                        backgroundColor: 'rgba(15, 23, 42, 0.08)',
                        fill: true,
                        tension: 0.25,
                        borderWidth: 2.5,
                        pointBackgroundColor: '#0f172a',
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { callback: v => `$${v.toLocaleString()}` }
                        }
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: ctx => ` Balance: $${ctx.raw.toLocaleString()}`
                            }
                        }
                    }
                }
            });
        } else {
            chartInstances.amortization.data.labels = labels;
            chartInstances.amortization.data.datasets[0].data = balances;
            chartInstances.amortization.update();
        }
    }

    // -------------------------------------------------------------
    // Chart 5: Decision Drivers & Model Attribution Chart
    // -------------------------------------------------------------
    const driversCtx = document.getElementById('riskDriversChart');
    if (driversCtx) {
        // Calculate factor impact scores (positive = lowers default risk, negative = increases default risk)
        const ficoImpact = parseFloat(((ficoScore - 670) / 12).toFixed(1));
        const dtiImpact = parseFloat(((36 - finalDti) / 2.5).toFixed(1));
        const checkingImpact = checkingStatus === 'good' ? 14.5 : (checkingStatus === 'mid' ? 1.0 : -22.0);
        const reserveImpact = parseFloat(((reserveCoverageMonths - 2.0) * 5.0).toFixed(1));
        const termImpact = parseFloat(((24 - durationMonths) / 3.0).toFixed(1));

        const driverLabels = [
            'FICO Score Reputation',
            'Debt-to-Income (DTI)',
            'Checking Account Health',
            'Emergency Cash Cushion',
            'Loan Term Length'
        ];
        const driverValues = [ficoImpact, dtiImpact, checkingImpact, reserveImpact, termImpact];
        const driverColors = driverValues.map(v => v >= 0 ? '#059669' : '#dc2626');

        if (!chartInstances.riskDrivers) {
            chartInstances.riskDrivers = new Chart(driversCtx, {
                type: 'bar',
                data: {
                    labels: driverLabels,
                    datasets: [{
                        label: 'Risk Attribution Impact',
                        data: driverValues,
                        backgroundColor: driverColors,
                        borderRadius: 5
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            grid: {
                                color: (ctx) => ctx.tick.value === 0 ? '#0f172a' : '#e2dfd5',
                                lineWidth: (ctx) => ctx.tick.value === 0 ? 1.5 : 1
                            },
                            ticks: {
                                callback: v => v > 0 ? `+${v}` : `${v}`
                            }
                        }
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: ctx => {
                                    const val = ctx.raw;
                                    return val >= 0 
                                        ? ` Protective (+${val}): Lowers Risk` 
                                        : ` Risk Factor (${val}): Increases Risk`;
                                }
                            }
                        }
                    }
                }
            });
        } else {
            chartInstances.riskDrivers.data.datasets[0].data = driverValues;
            chartInstances.riskDrivers.data.datasets[0].backgroundColor = driverColors;
            chartInstances.riskDrivers.update();
        }
    }
}

/**
 * Initialize Static Portfolio, Model, & Fairness Charts
 */
function initDeepTabCharts() {
    if (typeof Chart === 'undefined') return;

    // Portfolio Credit Quality Distribution (Tab 3)
    const pDistCtx = document.getElementById('portfolioDistChart');
    if (pDistCtx && !chartInstances.portfolioDist) {
        chartInstances.portfolioDist = new Chart(pDistCtx, {
            type: 'doughnut',
            data: {
                labels: ['Good Credits (700 Loans • $2.29M)', 'Defaulted Loans (300 Loans • $0.98M)'],
                datasets: [{
                    data: [700, 300],
                    backgroundColor: ['#059669', '#dc2626'],
                    borderWidth: 2,
                    borderColor: '#faf9f5',
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' }
                },
                cutout: '60%'
            }
        });
    }

    // Loan Purpose Distribution (Tab 3)
    const pPurposeCtx = document.getElementById('loanPurposeChart');
    if (pPurposeCtx && !chartInstances.loanPurpose) {
        chartInstances.loanPurpose = new Chart(pPurposeCtx, {
            type: 'bar',
            data: {
                labels: ['Automobiles', 'Consumer Tech', 'Business Loans', 'Education', 'Repairs & Housing'],
                datasets: [{
                    label: 'Loan Count in Benchmark',
                    data: [387, 280, 97, 50, 48],
                    backgroundColor: ['#0f172a', '#2563eb', '#6b21a8', '#d97706', '#059669'],
                    borderRadius: 6
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    // Receiver Operating Characteristic (ROC Curves) (Tab 4)
    const rocCtx = document.getElementById('rocCurvesChart');
    if (rocCtx && !chartInstances.roc) {
        chartInstances.roc = new Chart(rocCtx, {
            type: 'line',
            data: {
                labels: ['0.0', '0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9', '1.0'],
                datasets: [
                    {
                        label: 'Tuned Logistic Regression (AUC = 0.804)',
                        data: [0.0, 0.38, 0.58, 0.71, 0.79, 0.86, 0.91, 0.95, 0.98, 0.99, 1.0],
                        borderColor: '#0f172a',
                        backgroundColor: 'rgba(15, 23, 42, 0.06)',
                        fill: true,
                        tension: 0.35,
                        borderWidth: 2.5
                    },
                    {
                        label: 'Optimized KNN Classifier (AUC = 0.762)',
                        data: [0.0, 0.31, 0.50, 0.64, 0.72, 0.80, 0.87, 0.92, 0.95, 0.98, 1.0],
                        borderColor: '#d97706',
                        borderDash: [5, 5],
                        borderWidth: 2.2,
                        tension: 0.35,
                        fill: false
                    },
                    {
                        label: 'Random Guessing Baseline (AUC = 0.500)',
                        data: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
                        borderColor: '#64748b',
                        borderDash: [2, 4],
                        borderWidth: 1.5,
                        pointRadius: 0,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { title: { display: true, text: 'False Positive Rate (Denied Good %)' } },
                    y: { title: { display: true, text: 'True Positive Rate (Identified Bad %)' }, min: 0, max: 1 }
                }
            }
        });
    }

    // Expected Portfolio Loss Curve (Tab 4)
    const costCtx = document.getElementById('costOptimizationChart');
    if (costCtx && !chartInstances.cost) {
        chartInstances.cost = new Chart(costCtx, {
            type: 'line',
            data: {
                labels: ['5%', '10%', '16.7% (Optimal)', '20%', '30%', '40%', '50% (Standard)'],
                datasets: [{
                    label: 'Total Expected Portfolio Cost ($M)',
                    data: [1.88, 1.54, 1.42, 1.49, 1.76, 2.15, 2.58],
                    borderColor: '#dc2626',
                    backgroundColor: 'rgba(220, 38, 38, 0.08)',
                    fill: true,
                    tension: 0.3,
                    borderWidth: 2.5,
                    pointBackgroundColor: ['#dc2626', '#dc2626', '#059669', '#dc2626', '#dc2626', '#dc2626', '#dc2626'],
                    pointRadius: [4, 4, 8, 4, 4, 4, 4]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        ticks: { callback: v => `$${v}M` }
                    }
                }
            }
        });
    }

    // Disparate Impact Ratio Bar Chart (Tab 5)
    const fairAppCtx = document.getElementById('fairnessApprovalChart');
    if (fairAppCtx && !chartInstances.fairApp) {
        chartInstances.fairApp = new Chart(fairAppCtx, {
            type: 'bar',
            data: {
                labels: ['Age: Young (<25) vs Adult', 'Gender: Female vs Male', 'Origin: Foreign vs Domestic'],
                datasets: [
                    {
                        label: 'Disparate Impact Ratio (%)',
                        data: [84.2, 92.5, 88.0],
                        backgroundColor: '#0f172a',
                        borderRadius: 6
                    },
                    {
                        label: 'EEOC / ECOA Four-Fifths Threshold (80%)',
                        data: [80.0, 80.0, 80.0],
                        type: 'line',
                        borderColor: '#dc2626',
                        borderDash: [6, 6],
                        borderWidth: 2,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { callback: v => `${v}%` }
                    }
                }
            }
        });
    }

    // Demographic Error Rates (Tab 5)
    const demoErrCtx = document.getElementById('demographicErrorChart');
    if (demoErrCtx && !chartInstances.demoErr) {
        chartInstances.demoErr = new Chart(demoErrCtx, {
            type: 'bar',
            data: {
                labels: ['Young (<25)', 'Adult (≥25)', 'Female', 'Male'],
                datasets: [
                    {
                        label: 'False Positive Rate (Denied Good %)',
                        data: [19.2, 14.5, 17.8, 15.1],
                        backgroundColor: '#d97706',
                        borderRadius: 6
                    },
                    {
                        label: 'False Negative Rate (Approved Bad %)',
                        data: [12.1, 10.4, 11.2, 9.8],
                        backgroundColor: '#dc2626',
                        borderRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { callback: v => `${v}%` }
                    }
                }
            }
        });
    }
}

/**
 * Main Underwriting Evaluation Engine
 */
function updateUnderwriterCalculations() {
    const getNum = (id, fallback) => {
        const el = document.getElementById(id);
        return el ? (parseFloat(el.value) || fallback) : fallback;
    };
    const getStr = (id, fallback) => {
        const el = document.getElementById(id);
        return el ? el.value : fallback;
    };

    const applicantName = (getStr('inpApplicantName', 'Sarah Jenkins')).trim() || 'Applicant';
    const loanAmount = getNum('inpAmount', 5000);
    const durationMonths = getNum('inpDuration', 24);
    const ficoScore = getNum('inpFico', 700);
    const grossIncome = getNum('inpGrossIncome', 5000);
    const existingMonthlyDebt = getNum('inpMonthlyDebt', 800);
    const checkingStatus = getStr('inpChecking', 'good');
    const savingsTier = getStr('inpSavings', 'mid');
    const housingStatus = getStr('inpHousing', 'Own');

    // Update live slider badges
    const badgeAmount = document.getElementById('valAmount');
    if (badgeAmount) badgeAmount.innerText = `$${loanAmount.toLocaleString()}`;

    const badgeDuration = document.getElementById('valDuration');
    if (badgeDuration) badgeDuration.innerText = `${durationMonths} Mos (${(durationMonths/12).toFixed(1)} Yrs)`;

    const badgeFico = document.getElementById('valFico');
    if (badgeFico) {
        let tier = "Prime";
        if (ficoScore < 580) tier = "Subprime";
        else if (ficoScore < 670) tier = "Near-Prime";
        else if (ficoScore < 740) tier = "Good";
        badgeFico.innerText = `${Math.round(ficoScore)} (${tier})`;
    }

    const badgeIncome = document.getElementById('valGrossIncome');
    if (badgeIncome) badgeIncome.innerText = `$${grossIncome.toLocaleString()} / mo`;

    const badgeDebt = document.getElementById('valMonthlyDebt');
    if (badgeDebt) badgeDebt.innerText = `$${existingMonthlyDebt.toLocaleString()} / mo`;

    // Financial Calculations
    const tempDtiInitial = (existingMonthlyDebt / Math.max(500, grossIncome)) * 100;
    const riskApr = calculateRiskBasedApr(ficoScore, tempDtiInitial);
    const monthlyLoanPayment = calculateMonthlyPayment(loanAmount, durationMonths, riskApr);
    const totalMonthlyObligations = existingMonthlyDebt + monthlyLoanPayment;
    const finalDti = (totalMonthlyObligations / Math.max(500, grossIncome)) * 100;
    const freeCashFlow = grossIncome - totalMonthlyObligations;
    const estimatedLiquidReserves = getEstimatedSavings(savingsTier);
    const reserveCoverageMonths = totalMonthlyObligations > 0 ? (estimatedLiquidReserves / totalMonthlyObligations) : 12;

    const defaultProb = computeComprehensiveUnderwritingRisk({
        fico: ficoScore,
        dti: finalDti,
        checking: checkingStatus,
        duration: durationMonths,
        housing: housingStatus,
        reserveMonths: reserveCoverageMonths,
        amount: loanAmount
    });

    const activeThreshold = 0.167;
    const adjudication = adjudicateLoanDecision(defaultProb, finalDti, ficoScore, reserveCoverageMonths, activeThreshold);

    // Update DOM Text Elements
    const monthlyDisplay = document.getElementById('monthlyPaymentDisplay');
    if (monthlyDisplay) {
        monthlyDisplay.innerText = `$${monthlyLoanPayment.toLocaleString()} / mo (@ ${riskApr.toFixed(2)}% APR)`;
    }

    const riskDisplay = document.getElementById('riskScoreDisplay');
    if (riskDisplay) {
        riskDisplay.innerText = `${(defaultProb * 100).toFixed(1)}%`;
        if (defaultProb <= activeThreshold) {
            riskDisplay.style.color = "#059669";
        } else if (defaultProb <= 0.35) {
            riskDisplay.style.color = "#d97706";
        } else {
            riskDisplay.style.color = "#dc2626";
        }
    }

    // Animate SVG Speed-Gauge Needle Dial Diagram
    const needleGroup = document.getElementById('gaugeNeedleGroup');
    if (needleGroup) {
        const needleAngle = Math.min(90, Math.max(-90, -90 + (defaultProb / 0.55) * 180));
        needleGroup.style.transform = `rotate(${needleAngle}deg)`;
    }

    const badgeContainer = document.getElementById('decisionBadgeContainer');
    if (badgeContainer) {
        badgeContainer.innerHTML = `<div class="${adjudication.badgeClass}">${adjudication.icon} ${adjudication.title}</div>`;
    }

    const adjApplicantName = document.getElementById('adjudicationApplicantName');
    if (adjApplicantName) {
        adjApplicantName.innerText = applicantName;
    }

    const descEl = document.getElementById('decisionDesc');
    if (descEl) {
        descEl.innerHTML = `<b>${adjudication.summary} for ${applicantName}.</b> ${adjudication.description}`;
    }

    // Dynamic Layman Advisor Card
    const advice = generateLaymanAdvice({
        status: adjudication.status,
        finalDti,
        ficoScore,
        reserveCoverageMonths,
        monthlyLoanPayment,
        freeCashFlow,
        riskApr,
        durationMonths,
        loanAmount,
        applicantName
    });

    const advHeader = document.getElementById('advisorHeader');
    const advBody = document.getElementById('advisorBody');
    const advisorCard = document.querySelector('.advisor-card');

    if (advHeader && advBody) {
        advHeader.innerText = advice.header;
        advBody.innerHTML = advice.body;

        if (advisorCard) {
            if (adjudication.status === 'APPROVE') {
                advisorCard.style.background = '#edf7ed';
                advisorCard.style.borderColor = '#86efac';
                advHeader.style.color = '#14532d';
            } else if (adjudication.status === 'CONDITIONAL') {
                advisorCard.style.background = '#fef5e7';
                advisorCard.style.borderColor = '#fcd34d';
                advHeader.style.color = '#92400e';
            } else {
                advisorCard.style.background = '#fde8e8';
                advisorCard.style.borderColor = '#fca5a5';
                advHeader.style.color = '#991b1b';
            }
        }
    }

    // Ribbon updates
    const dtiValEl = document.getElementById('ribbonDtiVal');
    const dtiPillEl = document.getElementById('ribbonDtiPill');
    if (dtiValEl && dtiPillEl) {
        dtiValEl.innerText = `${finalDti.toFixed(1)}%`;
        if (finalDti <= 36) {
            dtiPillEl.className = "badge-pill pill-good";
            dtiPillEl.innerText = "Safe ≤ 36%";
        } else if (finalDti <= 43) {
            dtiPillEl.className = "badge-pill pill-warn";
            dtiPillEl.innerText = "Acceptable ≤ 43%";
        } else {
            dtiPillEl.className = "badge-pill pill-danger";
            dtiPillEl.innerText = "High > 43%";
        }
    }

    const ficoValEl = document.getElementById('ribbonFicoVal');
    const ficoPillEl = document.getElementById('ribbonFicoPill');
    if (ficoValEl && ficoPillEl) {
        ficoValEl.innerText = `${Math.round(ficoScore)}`;
        if (ficoScore >= 740) {
            ficoPillEl.className = "badge-pill pill-good";
            ficoPillEl.innerText = "Prime Score";
        } else if (ficoScore >= 640) {
            ficoPillEl.className = "badge-pill pill-warn";
            ficoPillEl.innerText = "Standard";
        } else {
            ficoPillEl.className = "badge-pill pill-danger";
            ficoPillEl.innerText = "Subprime";
        }
    }

    const reserveValEl = document.getElementById('ribbonReservesVal');
    const reservePillEl = document.getElementById('ribbonReservesPill');
    if (reserveValEl && reservePillEl) {
        reserveValEl.innerText = `${reserveCoverageMonths.toFixed(1)} mos`;
        if (reserveCoverageMonths >= 3.0) {
            reservePillEl.className = "badge-pill pill-good";
            reservePillEl.innerText = "Strong ≥ 2 mos";
        } else if (reserveCoverageMonths >= 1.5) {
            reservePillEl.className = "badge-pill pill-warn";
            reservePillEl.innerText = "Moderate";
        } else {
            reservePillEl.className = "badge-pill pill-danger";
            reservePillEl.innerText = "Low Cushion";
        }
    }

    const aprValEl = document.getElementById('ribbonAprVal');
    if (aprValEl) aprValEl.innerText = `${riskApr.toFixed(2)}%`;

    const freeCashValEl = document.getElementById('ribbonFreeCashVal');
    const freeCashPillEl = document.getElementById('ribbonFreeCashPill');
    if (freeCashValEl && freeCashPillEl) {
        freeCashValEl.innerText = `$${Math.max(0, freeCashFlow).toLocaleString()}/mo`;
        if (freeCashFlow >= 1500) {
            freeCashPillEl.className = "badge-pill pill-good";
            freeCashPillEl.innerText = "Healthy Cash";
        } else if (freeCashFlow >= 400) {
            freeCashPillEl.className = "badge-pill pill-warn";
            freeCashPillEl.innerText = "Tight Buffer";
        } else {
            freeCashPillEl.className = "badge-pill pill-danger";
            freeCashPillEl.innerText = "Deficit Risk";
        }
    }

    // 4-Point Policy Checklist
    const updateChecklist = (id, isPass, passText, failText) => {
        const item = document.getElementById(id);
        if (item) {
            item.className = `checklist-item ${isPass ? 'pass' : 'fail'}`;
            item.innerHTML = `${isPass ? '✓' : '✗'} ${isPass ? passText : failText}`;
        }
    };

    updateChecklist('chkItemDti', finalDti <= 43.0, "DTI Debt Ceiling (≤ 43% Pass)", `DTI Debt Burden (${finalDti.toFixed(1)}% Exceeds 43%)`);
    updateChecklist('chkItemFico', ficoScore >= 620, "FICO Minimum (620+ Standard Pass)", `FICO Score (${Math.round(ficoScore)} Below 620 Standard)`);
    updateChecklist('chkItemReserves', reserveCoverageMonths >= 2.0, "Emergency Cushion (≥ 2.0 Mos Pass)", `Emergency Cushion (${reserveCoverageMonths.toFixed(1)} Mos Below 2.0)`);
    updateChecklist('chkItemCashFlow', freeCashFlow > 500, "Monthly Free Cash Buffer (Safe)", "Monthly Free Cash Buffer (Tight Budget)");

    // Update Interactive Visual Charts in Real Time
    updateUnderwriterCharts({
        applicantName,
        existingMonthlyDebt,
        monthlyLoanPayment,
        freeCashFlow,
        finalDti,
        loanAmount,
        durationMonths,
        riskApr,
        ficoScore,
        checkingStatus,
        reserveCoverageMonths
    });

    return {
        applicantName,
        loanAmount,
        durationMonths,
        riskApr,
        monthlyLoanPayment,
        ficoScore,
        finalDti,
        defaultProb,
        adjudication
    };
}

// =========================================================
// Application History & Audit Log System
// =========================================================

/**
 * Retrieve History from LocalStorage or initialize with defaults
 */
function getHistory() {
    try {
        const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
    } catch (e) {
        console.warn("Could not read history from localStorage:", e);
    }
    return [...DEFAULT_HISTORY];
}

/**
 * Save History array to LocalStorage
 */
function saveHistory(historyList) {
    try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(historyList));
    } catch (e) {
        console.warn("Could not persist history to localStorage:", e);
    }
}

/**
 * Render History Tables (Quick Table in Tab 1 and Full Table in Tab 2)
 */
function renderHistoryTables() {
    const historyList = getHistory();

    // Update History Count Pill in Tab Bar
    const countPill = document.getElementById('historyTabCount');
    if (countPill) countPill.innerText = historyList.length;

    // Filter values for Tab 2
    const filterInput = document.getElementById('historySearchInput');
    const filterText = filterInput ? filterInput.value.toLowerCase().trim() : "";
    const filterSelect = document.getElementById('historyStatusFilter');
    const filterStatus = filterSelect ? filterSelect.value : "ALL";

    // 1. Render Tab 1 Quick History Table (Last 5 Entries)
    const quickBody = document.getElementById('recentHistoryTableBody');
    if (quickBody) {
        if (historyList.length === 0) {
            quickBody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: var(--text-muted); padding: 16px;">No saved applications yet. Click "Save to History" above to log one!</td></tr>`;
        } else {
            const recentItems = historyList.slice(0, 5);
            quickBody.innerHTML = recentItems.map(item => {
                const statusBadge = getStatusBadgeHtml(item.status);
                return `
                    <tr>
                        <td><code>${item.id}</code></td>
                        <td>${item.date}</td>
                        <td><b>${escapeHtml(item.name)}</b></td>
                        <td>$${item.amount.toLocaleString()}</td>
                        <td>${item.duration}m @ ${item.apr.toFixed(2)}%</td>
                        <td>${Math.round(item.fico)} / ${item.dti.toFixed(1)}%</td>
                        <td>${statusBadge}</td>
                        <td>${(item.prob * 100).toFixed(1)}%</td>
                        <td>
                            <button type="button" class="btn-row-reload" onclick="reloadApplicationFromHistory('${item.id}')">🔄 Load</button>
                        </td>
                    </tr>
                `;
            }).join('');
        }
    }

    // 2. Render Tab 2 Full History Table
    const fullBody = document.getElementById('fullHistoryTableBody');
    const emptyState = document.getElementById('historyEmptyState');
    if (fullBody) {
        const filtered = historyList.filter(item => {
            const matchesText = !filterText || 
                item.name.toLowerCase().includes(filterText) || 
                item.id.toLowerCase().includes(filterText) ||
                item.status.toLowerCase().includes(filterText);
            const matchesStatus = filterStatus === 'ALL' || item.status === filterStatus;
            return matchesText && matchesStatus;
        });

        if (filtered.length === 0) {
            fullBody.innerHTML = '';
            if (emptyState) emptyState.style.display = 'block';
        } else {
            if (emptyState) emptyState.style.display = 'none';
            fullBody.innerHTML = filtered.map(item => {
                const statusBadge = getStatusBadgeHtml(item.status);
                return `
                    <tr>
                        <td><code>${item.id}</code></td>
                        <td>${item.date}</td>
                        <td><b>${escapeHtml(item.name)}</b></td>
                        <td>$${item.amount.toLocaleString()}</td>
                        <td>${item.duration} Mos @ ${item.apr.toFixed(2)}%</td>
                        <td>${Math.round(item.fico)} pts</td>
                        <td>${item.dti.toFixed(1)}%</td>
                        <td>${statusBadge}</td>
                        <td>${(item.prob * 100).toFixed(1)}%</td>
                        <td>$${item.monthlyPayment.toLocaleString()}/mo</td>
                        <td>
                            <button type="button" class="btn-row-reload" onclick="reloadApplicationFromHistory('${item.id}')">🔄 Load</button>
                            <button type="button" class="btn-row-del" onclick="deleteHistoryItem('${item.id}')">🗑️</button>
                        </td>
                    </tr>
                `;
            }).join('');
        }
    }
}

function getStatusBadgeHtml(status) {
    if (status === 'APPROVE') {
        return `<span class="badge-pill pill-good">🟢 Approved</span>`;
    } else if (status === 'CONDITIONAL') {
        return `<span class="badge-pill pill-warn">🟡 Conditional</span>`;
    } else {
        return `<span class="badge-pill pill-danger">🔴 Declined</span>`;
    }
}

function escapeHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * Log Current Underwriter Form State to Application History
 */
function logCurrentApplication() {
    const res = updateUnderwriterCalculations();
    const historyList = getHistory();

    const getVal = (id, fallback) => {
        const el = document.getElementById(id);
        return el ? el.value : fallback;
    };

    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const appId = document.getElementById('displayAppId')?.innerText || `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRecord = {
        id: appId,
        date: dateStr,
        name: res.applicantName,
        amount: res.loanAmount,
        duration: res.durationMonths,
        apr: res.riskApr,
        monthlyPayment: res.monthlyLoanPayment,
        fico: res.ficoScore,
        dti: res.finalDti,
        status: res.adjudication.status,
        prob: res.defaultProb,
        params: {
            applicantName: res.applicantName,
            amount: res.loanAmount,
            duration: res.durationMonths,
            fico: res.ficoScore,
            grossIncome: parseFloat(getVal('inpGrossIncome', 5000)),
            monthlyDebt: parseFloat(getVal('inpMonthlyDebt', 1000)),
            checking: getVal('inpChecking', 'good'),
            savings: getVal('inpSavings', 'mid'),
            employment: getVal('inpEmployment', '>= 7 years'),
            housing: getVal('inpHousing', 'Own'),
            purpose: getVal('inpPurpose', 'Car (new)'),
            history: getVal('inpHistory', 'Existing credits paid duly till now'),
            age: parseInt(getVal('inpAge', 40))
        }
    };

    // Prepend new record
    historyList.unshift(newRecord);
    saveHistory(historyList);
    renderHistoryTables();

    // Show temporary toast confirmation
    const toast = document.getElementById('saveStatusToast');
    if (toast) {
        toast.innerText = `✓ Saved ${res.applicantName} to History!`;
        toast.style.opacity = '1';
        setTimeout(() => {
            toast.style.opacity = '0';
        }, 3000);
    }
}

/**
 * Re-load a Saved Application from History into Tab 1
 */
window.reloadApplicationFromHistory = function(appId) {
    const historyList = getHistory();
    const item = historyList.find(x => x.id === appId);
    if (!item) return;

    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.value = val;
    };

    if (item.params) {
        setVal('inpApplicantName', item.name);
        setVal('inpAmount', item.params.amount);
        setVal('inpDuration', item.params.duration);
        setVal('inpFico', item.params.fico);
        setVal('inpGrossIncome', item.params.grossIncome);
        setVal('inpMonthlyDebt', item.params.monthlyDebt);
        setVal('inpChecking', item.params.checking);
        setVal('inpSavings', item.params.savings);
        setVal('inpEmployment', item.params.employment);
        setVal('inpHousing', item.params.housing);
        setVal('inpPurpose', item.params.purpose);
        setVal('inpHistory', item.params.history);
        setVal('inpAge', item.params.age);
    }

    const appIdEl = document.getElementById('displayAppId');
    if (appIdEl) appIdEl.innerText = item.id;

    // Switch to underwriter tab
    switchTab('underwriter');
    updateUnderwriterCalculations();

    // Smooth scroll to top of underwriter
    window.scrollTo({ top: 120, behavior: 'smooth' });
};

/**
 * Delete a Single Application Record
 */
window.deleteHistoryItem = function(appId) {
    let historyList = getHistory();
    historyList = historyList.filter(x => x.id !== appId);
    saveHistory(historyList);
    renderHistoryTables();
};

/**
 * Clear All History
 */
function clearAllHistory() {
    if (confirm("Are you sure you want to clear all logged loan applications?")) {
        saveHistory([]);
        renderHistoryTables();
    }
}

/**
 * Reset to Default Verified Benchmark Records
 */
function resetDefaultHistory() {
    saveHistory([...DEFAULT_HISTORY]);
    renderHistoryTables();
}

/**
 * Export Application History to CSV File
 */
function exportHistoryCsv() {
    const historyList = getHistory();
    if (historyList.length === 0) {
        alert("No history records available to export.");
        return;
    }

    const headers = ["Reference ID", "Date Time", "Applicant Name", "Loan Amount ($)", "Term (Months)", "Risk APR (%)", "Monthly Payment ($)", "FICO Score", "DTI Ratio (%)", "Verdict", "Default Risk (%)"];
    const rows = historyList.map(item => [
        `"${item.id}"`,
        `"${item.date}"`,
        `"${item.name.replace(/"/g, '""')}"`,
        item.amount,
        item.duration,
        item.apr.toFixed(2),
        item.monthlyPayment,
        Math.round(item.fico),
        item.dti.toFixed(1),
        `"${item.status}"`,
        (item.prob * 100).toFixed(1)
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `loan_underwriting_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Global Initialization
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Chart.js Defaults
    configureChartDefaults();

    // 2. Tab Navigation Listeners
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            switchTab(tabId, btn);
        });
    });

    // 3. Preset Profile Listener
    const profileSelect = document.getElementById('presetSelect');
    if (profileSelect) {
        profileSelect.addEventListener('change', (e) => {
            applyProfile(e.target.value);
        });
    }

    // 4. Form Input Change & Real-Time Slider Listeners
    const inputIds = [
        'inpApplicantName', 'inpAmount', 'inpDuration', 'inpFico', 'inpGrossIncome', 'inpMonthlyDebt',
        'inpChecking', 'inpSavings', 'inpEmployment', 'inpHousing', 'inpPurpose',
        'inpHistory', 'inpAge'
    ];

    inputIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', updateUnderwriterCalculations);
            el.addEventListener('change', updateUnderwriterCalculations);
        }
    });

    // 5. History Action Buttons
    const btnLog1 = document.getElementById('btnLogApplication');
    if (btnLog1) btnLog1.addEventListener('click', logCurrentApplication);

    const btnLog2 = document.getElementById('btnQuickLog');
    if (btnLog2) btnLog2.addEventListener('click', logCurrentApplication);

    const btnGoHist = document.getElementById('btnGoToHistoryTab');
    if (btnGoHist) {
        btnGoHist.addEventListener('click', () => switchTab('history'));
    }

    const btnExport = document.getElementById('btnExportHistoryCsv');
    if (btnExport) btnExport.addEventListener('click', exportHistoryCsv);

    const btnReset = document.getElementById('btnResetDefaultHistory');
    if (btnReset) btnReset.addEventListener('click', resetDefaultHistory);

    const btnClear = document.getElementById('btnClearAllHistory');
    if (btnClear) btnClear.addEventListener('click', clearAllHistory);

    const searchInput = document.getElementById('historySearchInput');
    if (searchInput) searchInput.addEventListener('input', renderHistoryTables);

    const filterSelect = document.getElementById('historyStatusFilter');
    if (filterSelect) filterSelect.addEventListener('change', renderHistoryTables);

    // 6. Initial Calculation, Charts & History Render
    updateUnderwriterCalculations();
    initDeepTabCharts();
    renderHistoryTables();
});
