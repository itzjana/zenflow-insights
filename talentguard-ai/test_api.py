import requests
import sys

BASE = "http://localhost:8000/api"
tests = [
    "overview",
    "watchlist?limit=5",
    "employees?limit=5",
    "employee/167",
    "retention/drafts",
    "evaluation",
    "eda/features",
    "earlywarning/demo?n_employees=10&n_snapshots=2",
]

all_pass = True
for path in tests:
    url = f"{BASE}/{path}"
    try:
        r = requests.get(url, timeout=10)
        status = "PASS" if r.status_code == 200 else "FAIL"
        print(f"{status} {r.status_code}  {path}")
        if r.status_code != 200:
            print(f"   ERROR: {r.text[:300]}")
            all_pass = False
        else:
            data = r.json()
            if "overview" in path:
                print(f"     rows={data['dataset']['rows']}, model={data['model']['name']}, auc={data['metrics']['roc_auc']}")
            elif "watchlist" in path:
                print(f"     count={data['count']}")
            elif "employees" in path and "employee/" not in path:
                print(f"     count={data['count']}")
            elif "employee/167" in path:
                print(f"     risk={data['risk_pct']}%, dept={data['features']['Department']}, explanations={len(data.get('explanations',[]))}")
            elif "retention/drafts" in path:
                print(f"     total_drafts={data['count']}")
            elif "evaluation" in path:
                r0 = data['reports'][-1] if data['reports'] else {}
                print(f"     last_eval_keys={list(r0.keys())[:5]}")
    except Exception as e:
        print(f"FAIL EXCEPTION  {path}: {e}")
        all_pass = False

print()
print("ALL PASS" if all_pass else "SOME TESTS FAILED")
