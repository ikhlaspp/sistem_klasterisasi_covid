from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from cluster_logic import calculate_fcm_clusters, calculate_elbow_sse

CLUSTER_CACHE = None
ELBOW_CACHE = None

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://12-7.0.0.1:5173",
    "http://localhost:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/clusters")
def get_clusters():    
    global CLUSTER_CACHE, ELBOW_CACHE
    print(">>> Menerima permintaan di /api/clusters")
    
    elbow_result = None
    if ELBOW_CACHE is not None:
        print("    - Using cached elbow analysis result")
        elbow_result = ELBOW_CACHE
    else:
        print("    - Calculating elbow analysis first")
        elbow_result = calculate_elbow_sse()
        ELBOW_CACHE = elbow_result
        
    if CLUSTER_CACHE is not None:
        print("    - Returning cached cluster result")
        return CLUSTER_CACHE
    
    result = calculate_fcm_clusters(elbow_result=elbow_result)
    CLUSTER_CACHE = result
    print(f"    - Calculated and cached new cluster result with k={result['n_clusters']}")
    return result
@app.get("/api/elbow-analysis")
def get_elbow_analysis(k_min: int = None, k_max: int = None):
    global ELBOW_CACHE, CLUSTER_CACHE
    print(f">>> Menerima permintaan di /api/elbow-analysis dengan k_min={k_min}, k_max={k_max}")
    
    # If k_min or k_max is provided, we need to recalculate
    if k_min is not None or k_max is not None:
        print("    - Parameter k_min atau k_max diberikan, menghitung ulang hasil")
        # Clear the cache
        ELBOW_CACHE = None
        CLUSTER_CACHE = None
    elif ELBOW_CACHE is not None:
        print("    - Returning cached elbow analysis result")
        return ELBOW_CACHE
    
    # Use calculate_elbow_sse with provided parameters
    result = calculate_elbow_sse(k_min=k_min, k_max=k_max)
    ELBOW_CACHE = result
    print("    - Calculated and cached new elbow analysis result")
    return result


@app.get("/api/clear-cache")
def clear_cache():
    global CLUSTER_CACHE, ELBOW_CACHE
    CLUSTER_CACHE = None
    ELBOW_CACHE = None
    return {"status": "Cache has been cleared. Next requests will recalculate results."}


@app.get("/")
def read_root():
    return {"status": "Server back-end berjalan!"}