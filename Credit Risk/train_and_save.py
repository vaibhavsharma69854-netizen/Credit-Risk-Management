"""
Training and Evaluation Script for Credit Applicant Default Risk Classification System.
Trains Logistic Regression and KNN, executes 5-fold cross-validation,
evaluates cost-sensitive metrics, and saves serialized models.
"""

import sys
from pathlib import Path

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from src.models import train_and_evaluate_all, save_trained_artifacts


def main():
    print("======================================================================")
    print("  CREDIT APPLICANT DEFAULT RISK CLASSIFICATION SYSTEM")
    print("  Dataset: Statlog (German Credit Data) | Asymmetric Misclassification Cost (5:1)")
    print("======================================================================\n")

    print("[1/3] Loading dataset, preprocessing features, and splitting 80/20...")
    results = train_and_evaluate_all(random_state=42)

    print("\n[2/3] Evaluating Models under Cost Asymmetry (Cost: FN=5, FP=1)...")
    tm = results['test_metrics']
    cv_lr = results['cv_lr']
    cv_knn = results['cv_knn']

    print("\n--- 5-Fold Cross-Validation (Out-Of-Fold) ---")
    print(f"Logistic Regression: ROC-AUC = {cv_lr['roc_auc']:.4f} | Min Cost = {cv_lr['min_cost']:.1f} (Optimal Threshold = {cv_lr['best_threshold']:.2f})")
    print(f"K-Nearest Neighbors: ROC-AUC = {cv_knn['roc_auc']:.4f} | Min Cost = {cv_knn['min_cost']:.1f} (Optimal Threshold = {cv_knn['best_threshold']:.2f})")

    print("\n--- Held-Out Test Set Performance (200 Applicants: 140 Good, 60 Bad) ---")
    print("Model                | Thresh | Cost | Cost-Weighted Acc | Std Acc | Precision | Recall | F1-Score | FP | FN")
    print("-" * 105)

    lr_05 = tm['lr_05']
    lr_opt = tm['lr_opt']
    knn_05 = tm['knn_05']
    knn_opt = tm['knn_opt']

    print(f"Logistic Regression  | 0.50   | {lr_05['total_cost']:4.0f} | {lr_05['cost_weighted_accuracy']*100:15.2f}% | {lr_05['standard_accuracy']*100:6.2f}% | {lr_05['precision']*100:8.2f}% | {lr_05['recall']*100:5.2f}% | {lr_05['f1_score']:7.3f}  | {lr_05['fp']:2d} | {lr_05['fn']:2d}")
    print(f"Logistic Regression* | {tm['best_th_lr']:.2f}   | {lr_opt['total_cost']:4.0f} | {lr_opt['cost_weighted_accuracy']*100:15.2f}% | {lr_opt['standard_accuracy']*100:6.2f}% | {lr_opt['precision']*100:8.2f}% | {lr_opt['recall']*100:5.2f}% | {lr_opt['f1_score']:7.3f}  | {lr_opt['fp']:2d} | {lr_opt['fn']:2d}")
    print(f"KNN (k=9, distance)  | 0.50   | {knn_05['total_cost']:4.0f} | {knn_05['cost_weighted_accuracy']*100:15.2f}% | {knn_05['standard_accuracy']*100:6.2f}% | {knn_05['precision']*100:8.2f}% | {knn_05['recall']*100:5.2f}% | {knn_05['f1_score']:7.3f}  | {knn_05['fp']:2d} | {knn_05['fn']:2d}")
    print(f"KNN* (k=9, distance) | {tm['best_th_knn']:.2f}   | {knn_opt['total_cost']:4.0f} | {knn_opt['cost_weighted_accuracy']*100:15.2f}% | {knn_opt['standard_accuracy']*100:6.2f}% | {knn_opt['precision']*100:8.2f}% | {knn_opt['recall']*100:5.2f}% | {knn_opt['f1_score']:7.3f}  | {knn_opt['fp']:2d} | {knn_opt['fn']:2d}")
    print("(* denotes cost-optimal decision threshold minimizing 5*FN + 1*FP)")

    print(f"\nCost Savings from Threshold Tuning:")
    cost_diff_lr = lr_05['total_cost'] - lr_opt['total_cost']
    pct_diff_lr = (cost_diff_lr / lr_05['total_cost']) * 100
    print(f"  - Logistic Regression: Saved {cost_diff_lr:.0f} cost units ({pct_diff_lr:.1f}% cost reduction)")

    cost_diff_knn = knn_05['total_cost'] - knn_opt['total_cost']
    pct_diff_knn = (cost_diff_knn / knn_05['total_cost']) * 100
    print(f"  - K-Nearest Neighbors: Saved {cost_diff_knn:.0f} cost units ({pct_diff_knn:.1f}% cost reduction)")

    print("\n[3/3] Saving trained models and evaluation summaries...")
    save_trained_artifacts(results)

    print("\nTraining and validation complete!")


if __name__ == "__main__":
    main()
