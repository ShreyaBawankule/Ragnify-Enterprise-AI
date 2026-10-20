import sys
from fastapi.testclient import TestClient

try:
    import main
    client = TestClient(main.app)
    
    # 1. Test root
    r_root = client.get("/")
    assert r_root.status_code == 200, f"Root failed: {r_root.status_code}"
    print("1. Root response: OK")
    
    # 2. Test DB
    r_db = client.get("/test-db")
    assert r_db.status_code == 200, f"DB failed: {r_db.status_code}"
    print("2. DB connection: OK")
    
    # 3. Test Applications
    r_apps = client.get("/onboarding/applications")
    assert r_apps.status_code == 200, f"Applications failed: {r_apps.status_code}"
    print(f"3. Applications count: {len(r_apps.json())}")
    
    # 4. Test Documents
    r_docs = client.get("/documents")
    assert r_docs.status_code == 200, f"Documents failed: {r_docs.status_code}"
    print(f"4. Documents count: {len(r_docs.json())}")
    
    # 5. Test Offer Letters
    r_offers = client.get("/offer-letters")
    assert r_offers.status_code == 200, f"Offer letters failed: {r_offers.status_code}"
    print(f"5. Offer letters count: {len(r_offers.json())}")
    
    # 6. Test Certificates
    r_certs = client.get("/certificates")
    assert r_certs.status_code == 200, f"Certificates failed: {r_certs.status_code}"
    print(f"6. Certificates count: {len(r_certs.json())}")

    # 7. Test Tenure
    r_tenure = client.get("/tenure")
    assert r_tenure.status_code == 200, f"Tenure failed: {r_tenure.status_code}"
    print(f"7. Tenure records count: {len(r_tenure.json())}")

    # 8. Test Working Hours
    r_wh = client.get("/working-hours")
    assert r_wh.status_code == 200, f"Working hours failed: {r_wh.status_code}"
    print(f"8. Working hours count: {len(r_wh.json())}")

    # 9. Test Meetings
    r_mtg = client.get("/meeting/history")
    assert r_mtg.status_code == 200, f"Meetings failed: {r_mtg.status_code}"
    print(f"9. Meetings history count: {len(r_mtg.json())}")

    # 10. Test Dashboard
    r_dash = client.get("/dashboard")
    assert r_dash.status_code == 200, f"Dashboard failed: {r_dash.status_code}"
    print(f"10. Dashboard stats: {r_dash.json().get('totalEmployees')} employees, {r_dash.json().get('totalTasks')} tasks")
    
    print("\nALL 10 CORE MODULES FULLY INTEGRATED & OPERATIONAL!")
except Exception as e:
    print("Error during test:", str(e))
    sys.exit(1)
