# /// script
# requires-python = ">=3.11"
# dependencies = ["numpy", "scikit-learn", "statsmodels", "ruptures", "rapidfuzz", "igraph", "leidenalg", "Unidecode"]
# ///
"""Reproducible illustrative data, not measurements from professional projects.

Run: uv run --script scripts/generate_explainer_fixtures.py [--check]
The adjacent uv lock pins the numerical tools. No Python runs on the website.
"""

import json
import math
import random
import sys
from pathlib import Path

import igraph as ig
import leidenalg
from scipy.stats import norm
from message_normalization import normalize_message
import numpy as np
import ruptures as rpt
from rapidfuzz.fuzz import partial_ratio
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from statsmodels.tsa.seasonal import STL

SEED = 20261025
rng = np.random.default_rng(SEED)
ig.set_random_number_generator(random.Random(SEED))

# Four categorical populations, represented as individual observations for fitting.
rule_groups = [
    {"history": "Short", "debt": "High", "count": 120, "affected": 42},
    {"history": "Short", "debt": "Low", "count": 280, "affected": 10},
    {"history": "Established", "debt": "High", "count": 240, "affected": 6},
    {"history": "Established", "debt": "Low", "count": 360, "affected": 6},
]
features, targets, rule_records = [], [], []
for group_index, g in enumerate(rule_groups):
    for i in range(g["count"]):
        error = i < g["affected"]
        # Additional inspected attributes vary among approved and declined records in each leaf.
        local = i if error else i - g["affected"]
        n_label = g["affected"] if error else g["count"] - g["affected"]
        multipliers = [v for v in [1, 5, 7, 11, 13, 17, 19, 23] if math.gcd(v, n_label) == 1]
        extra = [int(((local * multipliers[j % len(multipliers)] + j) % n_label) < n_label / 2) for j in range(4)]
        row = [int(g["history"] == "Short"), int(g["debt"] == "High"), *extra]
        decision = "Declined" if error else "Approved"
        rule_records.append({"id": len(rule_records), "group": group_index, "features": row,
                             "decision": decision})
        features.append(row)
        targets.append(int(decision == "Declined"))
tree = DecisionTreeClassifier(max_depth=2, random_state=SEED).fit(features, targets).tree_
tree_nodes = []
for i in range(tree.node_count):
    tree_nodes.append({"feature": int(tree.feature[i]), "left": int(tree.children_left[i]),
                       "right": int(tree.children_right[i]), "count": int(tree.n_node_samples[i]),
                       "impurity": float(tree.impurity[i])})

# Candidate split scores use the same individual observations as the fitted tree.
def weighted_gini(indices, feature):
    total = len(indices)
    result = 0.0
    for value in (0, 1):
        subset = [i for i in indices if features[i][feature] == value]
        if subset:
            p = sum(targets[i] for i in subset) / len(subset)
            result += len(subset) / total * 2 * p * (1 - p)
    return result
split_comparisons = [{"feature": name, "weightedGini": weighted_gini(list(range(len(targets))), index)}
                     for index, name in enumerate(["Credit history", "Debt burden", "Income stability", "Loan size", "Employment tenure", "Savings"])]

# A genuine fitted example model; inference on the site uses these coefficients.
x = rng.normal(size=(500, 2))
true_p = 1 / (1 + np.exp(-(-0.4 + x @ np.array([1.1, 0.7]))))
y = rng.binomial(1, true_p)
model = LogisticRegression(C=1, solver="lbfgs", random_state=SEED).fit(x, y)
candidate_x = np.array([[-1.2, -0.6], [0.9, 0.6], [0.1, 1.4], [1.6, -0.5], [-0.5, 0.5], [0.6, -1.1]])
ranking = {"intercept": float(model.intercept_[0]), "coefficients": model.coef_[0].tolist(),
           "featureNames": ["Historical responsiveness", "Recent activity"],
           "candidates": [{"id": chr(65+i), "features": row.tolist(), "relevance": rel,
                           "probability": float(model.predict_proba([row])[0, 1])}
                          for i, (row, rel) in enumerate(zip(candidate_x, [0.96, 0.86, 0.78, 0.68, 0.9, 0.61]))]}

# Actual robust STL decomposition and PELT segmentation of the deseasonalized series.
tt = np.arange(120)
observed = 3 + 1.4*np.sin(2*np.pi*tt/12) + np.where(tt >= 40, 2, 0) - np.where(tt >= 82, 1.6, 0) + rng.normal(0, .3, 120)
decomposition = STL(observed, period=12, robust=True).fit()
deseasoned = observed - decomposition.seasonal
segments = []
for penalty in [8, 100]:
    ends = rpt.Pelt(model="l2", min_size=8, jump=1).fit(deseasoned).predict(pen=penalty)
    starts = [0] + ends[:-1]
    segments.append({"penalty": penalty, "ends": ends,
                     "means": [float(deseasoned[a:b].mean()) for a,b in zip(starts, ends)]})
temporal = {"observed": observed.tolist(), "seasonal": decomposition.seasonal.tolist(),
            "deseasoned": deseasoned.tolist(), "segments": segments}

# Neutral binary attributes, each with a value/complement distribution.
# Formulae mirror the source implementation: smoothed Z, positive KL,
# 90% information selection and baseline-surprisal weighting.
feature_names = ["AI", "Programming", "Design", "Photography", "Gaming", "Cooking"]
reference = np.array([.12,.15,.18,.10,.14,.08])
proportions = np.array([
 [.65,.68,.18,.10,.14,.08], [.60,.64,.18,.10,.14,.08],
 [.12,.58,.18,.10,.54,.08], [.12,.15,.68,.64,.14,.08],
 [.12,.15,.62,.60,.14,.08], [.12,.15,.58,.55,.34,.08],
 [.12,.15,.18,.10,.14,.75]])
n_reference, n_changed = 10000, 1000
z_threshold = float(norm.ppf(1-.05/(2*len(reference))))
signatures, evidence, screening = [], [], []
for row in proportions:
    candidates, tested = [], []
    for j,(base, changed) in enumerate(zip(reference,row)):
        pz=(round(base*n_reference)+1)/(n_reference+2)
        qz=(round(changed*n_changed)+1)/(n_changed+2)
        z=(qz-pz)/np.sqrt(pz*(1-pz)/n_changed)
        kl=changed*np.log2(changed/base)
        tested.append({"index":j,"z":float(z),"passes":bool(z>=z_threshold and kl>0)})
        if z>=z_threshold and kl>0:
            candidates.append({"index":j,"reference":float(base),"observed":float(changed),"z":float(z),"kl":float(kl),"weight":float(-np.log2(base))})
    candidates.sort(key=lambda v:-v["kl"])
    total=sum(v["kl"] for v in candidates); running=0.; selected=[]
    for item in candidates:
        if running >= .9*total: break
        selected.append(item); running+=item["kl"]
    vector=[0.]*len(reference)
    for item in selected: vector[item["index"]]=item["weight"]
    signatures.append(vector); evidence.append(selected); screening.append(tested)
vectors=np.array(signatures)
similarity=(vectors@vectors.T)/np.outer(np.linalg.norm(vectors,axis=1),np.linalg.norm(vectors,axis=1))
edges=[(a,b) for a in range(7) for b in range(a+1,7) if similarity[a,b]>=.05]
graph=ig.Graph(n=7,edges=edges)
weights=[float(similarity[a,b]) for a,b in edges]
presets=[]
for gamma in [.1,.5]:
    partition=leidenalg.find_partition(graph,leidenalg.CPMVertexPartition,weights=weights,resolution_parameter=gamma,seed=42)
    labels={v:i for i,v in enumerate(dict.fromkeys(partition.membership))}
    membership=[labels[v] for v in partition.membership]
    communities=[[i for i,v in enumerate(membership) if v==g] for g in sorted(set(membership))]
    groups=[g for g in communities if len(g)>1]; singletons=[g[0] for g in communities if len(g)==1]
    presets.append({"gamma":gamma,"membership":membership,"groups":groups,"singletons":singletons})
graph_data={"features":feature_names,"reference":reference.tolist(),"observed":proportions.tolist(),"vectors":vectors.tolist(),"evidence":evidence,"screening":screening,"similarity":similarity.tolist(),"edges":edges,"edgeCutoff":.05,"zThreshold":z_threshold,"referenceCount":n_reference,"observedCount":n_changed,"presets":presets,
 "authoredSplit":{"proposed":[[0,1,2,3,4,5]],"groups":[[0,1,2],[3,4,5]],"singletons":[6]}}

# Snapshot of the verified normalization pipeline, with neutral illustrative inputs.
templates=["Could not open document at /documents/notes.txt", "Document saved with missing title", "Image could not be exported"]
queries=["FILE_OPEN_ERROR could not open document", "Could not open document at /documents/report.txt", "Could not open document from /documents/report.txt", "Document opened successfully from /documents/report.txt"]
canonical=[normalize_message(v) for v in templates]
vectorizer=TfidfVectorizer(analyzer="char",ngram_range=(3,7)).fit(canonical)
matrix=vectorizer.transform(canonical)
retrieval=[]
for i,query in enumerate(queries):
    q=normalize_message(query)
    scores=(matrix@vectorizer.transform([q]).T).toarray().ravel()
    best=int(scores.argmax()); fuzzy=float(partial_ratio(q,canonical[best]))
    exact=q in canonical; known="file_open_error" in query.lower()
    accepted=known or exact or (scores[best]>=.82 and fuzzy>=90) or (scores[best]>=.92 and fuzzy>=85)
    retrieval.append({"query":query,"canonical":q,"template":templates[best],"canonicalTemplate":canonical[best],"similarity":float(scores[best]),"fuzzy":fuzzy,"exact":exact,"known":known,"accepted":bool(accepted),"pattern":"P1" if known or exact or accepted else "P4","route":"identifier" if known else "exact" if exact else "verified" if accepted else "new"})

# Paired correctness records. Reported scores use either identical or changed samples.
def agent_case(changed):
    cells = [(True, True, 760 if changed else 780),
             (True, False, 40 if changed else 20),
             (False, True, 50 if changed else 120),
             (False, False, 150 if changed else 80)]
    records = [{"id": i, "baseline": a, "candidate": b}
               for i, (a, b) in enumerate((a, b) for a, b, n in cells for _ in range(n))]
    reported_records = [{"id": 1000 + i, "candidate": i < 900} for i in range(1000)] if changed else [{"id": r["id"], "candidate": r["candidate"]} for r in records]
    n = len(records)
    baseline = sum(r["baseline"] for r in records)
    candidate = sum(r["candidate"] for r in records)
    discordant = sum(r["baseline"] != r["candidate"] for r in records)
    gain = (candidate - baseline) / n
    se = ((discordant / n - gain ** 2) / n) ** .5
    return {"changed": changed, "records": records, "reportedRecords": reported_records,
            "metadata": {"baselinePopulation": "eval-v1", "candidatePopulation": "eval-v2" if changed else "eval-v1"},
            "reported": {"count": n, "baselineCorrect": baseline, "candidateCorrect": sum(r["candidate"] for r in reported_records)},
            "matched": {"count": n, "baselineCorrect": baseline, "candidateCorrect": candidate,
                        "discordant": discordant, "gain": gain, "interval": [gain - 1.96 * se, gain + 1.96 * se]}}
agents = [agent_case(False), agent_case(True)]

data = {"agents": agents, "seed": SEED, "rules": {"groups": rule_groups, "records": rule_records, "nodes": tree_nodes, "splitComparisons": split_comparisons}, "ranking": ranking,
        "temporal": temporal, "graph": graph_data, "retrieval": retrieval}

def rounded(value):
    if isinstance(value, float):
        return round(value, 8)
    if isinstance(value, list):
        return [rounded(v) for v in value]
    if isinstance(value, dict):
        return {k: rounded(v) for k,v in value.items()}
    return value

out = Path(__file__).resolve().parents[1] / "src/data/explainer-fixtures.json"
content = json.dumps(rounded(data), separators=(",", ":")) + "\n"
if "--check" in sys.argv:
    if out.read_text() != content:
        sys.exit("Fixtures differ. Regenerate them with the locked toolchain.")
    print("Fixtures match the locked generator.")
else:
    out.write_text(content)
    print(f"Wrote {out.name}: {len(content):,} bytes")
