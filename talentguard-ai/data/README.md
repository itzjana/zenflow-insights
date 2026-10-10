# data/README.md – Dataset instructions

## IBM HR Analytics Employee Attrition Dataset

TalentGuard AI uses the publicly available IBM HR Analytics dataset for
benchmarking. **This repository does not include any employee data.**

### How to obtain the dataset

1. Visit [Kaggle – IBM HR Analytics](https://www.kaggle.com/datasets/pavansubhasht/ibm-hr-analytics-attrition-dataset)
2. Download `WA_Fn-UseC_-HR-Employee-Attrition.csv`
3. Place it in this `data/` directory

### Update the data path (optional)

If you save the CSV elsewhere, update `DATA_PATH` in
`src/talentguard/config.py`:

```python
DATA_PATH = Path("/your/custom/path/to/attrition.csv")
```

### Dataset facts

| Property | Value |
|----------|-------|
| Rows | 1,470 |
| Columns | 35 |
| Target | `Attrition` (Yes / No) |
| Positive class prevalence | ≈ 16.1% |
| Source | IBM (synthetic benchmark) |

### Important disclaimer

The IBM dataset is a **synthetic benchmark sample**, not a live
representation of any real company. Do not claim that model outputs are
validated predictions for a specific company without local data and
independent validation.
