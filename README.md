<div align="center">

# 🚢 CargoOptix

### Automated Ship Load Balancing System

*AI-Driven Maritime Container Optimization with Real-Time Stability Validation*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![Final Year Project](https://img.shields.io/badge/project-Final%20Year-orange.svg)]()

> 🧠 **Tech Stack:** Python • NumPy • Pandas • Matplotlib • Py3DBC (Custom Library) • Constraint Optimization • Maritime Physics

---

</div>

## 📋 Overview

CargoOptix is an intelligent cargo placement system designed to optimize container loading on feeder ships while ensuring maritime safety compliance. The system combines **constraint-based optimization** with **naval architecture physics** to generate safe, efficient loading plans that maximize space utilization while maintaining ship stability.

### The Problem We Solve

Traditional maritime cargo operations face critical challenges:
- ❌ Manual planning takes 2-3 hours per ship
- ❌ Suboptimal space utilization (60-70%)
- ❌ Risk of stability violations and capsizing
- ❌ No real-time constraint validation
- ❌ Human error in hazmat separation and weight distribution

### Our Solution

✅ **91% placement success rate** with automated optimization  
✅ **84% slot utilization** - significantly higher than manual methods  
✅ **Real-time stability validation** ensuring GM > safety threshold  
✅ **Constraint enforcement** for hazmat, reefer, and weight limits  
✅ **Minutes instead of hours** for complete loading plans

---

## ✨ Features

### 🎯 Core Capabilities

| Feature | Description |
|---------|-------------|
| **🧮 Physics-Based Validation** | Real-time metacentric height (GM) calculations ensuring ship stability |
| **⚠️ Hazmat Separation** | Enforces minimum 3-position distance between dangerous goods |
| **❄️ Reefer Management** | Allocates refrigerated containers to powered slots only |
| **⚖️ Weight Distribution** | Tier-based weight limits with heavy containers in lower positions |
| **📊 Multi-Strategy Optimization** | Heavy-first, priority-based, and hazmat-first placement strategies |
| **📈 Performance Analytics** | Detailed metrics on utilization, stability margins, and constraint satisfaction |

### 🔬 Technical Innovation

**py3dbc Library** - Our contribution to open-source maritime logistics:
- Extends [py3dbp](https://github.com/jerry800416/3D-bin-packing) with maritime domain expertise
- First library combining 3D bin packing with ship stability physics
- Discrete bay/row/tier slot structure matching real ship geometry
- Constraint validation framework for maritime regulations

---

## 🎬 Demo

### Input
```
Container Manifest (CSV):
- 632 containers (general, reefer, hazmat)
- Varied weights (4-30 tonnes)
- Mixed sizes (20ft, 40ft)

Ship Specifications:
- 7 bays × 14 rows × 7 tiers = 686 slots
- Deadweight: 13,500 tonnes
- GM minimum: 0.3m
```

### Output
```
✅ Placement Performance:
   - 576/632 containers placed (91.14%)
   - 762 TEU loaded
   - 83.97% slot utilization

✅ Stability Analysis:
   - GM: 1.273m (4.2× minimum requirement)
   - KG: 7.427m
   - Status: STABLE ✓
   - Margin: 0.973m above threshold

✅ Constraints Satisfied:
   - All hazmat separated by 3+ positions
   - 41 reefers in powered slots
   - Weight limits enforced per tier
```

---

## 🚀 Installation

### Prerequisites
```bash
# Python 3.8 or higher required
python --version

# Required packages
pip install pandas numpy py3dbp
```

### Clone Repository
```bash
git clone https://github.com/SarthSatpute/cargooptix.git
cd cargooptix
pip install -r requirements.txt
```

### Project Structure
```
cargooptix/
├── py3dbc/                    # Maritime optimization library
│   ├── maritime/
│   │   ├── container.py       # Container classes with cargo types
│   │   ├── ship.py            # Ship structure and slot management
│   │   ├── constraints.py     # Maritime rule enforcement
│   │   └── packer.py          # Optimization algorithm
│   └── physics/
│       └── stability.py       # GM/KG calculations
├── data/
│   ├── generate_datasets.py  # Synthetic data generation
│   └── *.csv                  # Generated scenarios
├── load_scenario.py           # Run optimization on CSV data
├── example_py3dbc.py          # Usage examples
└── README.md
```

---

## 💻 Usage

### Basic Example

```python
from py3dbc.maritime.container import MaritimeContainer
from py3dbc.maritime.ship import ContainerShip
from py3dbc.maritime.packer import MaritimePacker

# Initialize ship
stability_params = {
    'kg_lightship': 6.5,
    'lightship_weight': 3500,
    'kb': 4.2,
    'bm': 4.5,
    'gm_min': 0.3
}

ship = ContainerShip(
    ship_name='FEEDER_01',
    dimensions=(130, 20, 18),
    bays=7, rows=14, tiers=7,
    stability_params=stability_params,
    max_weight=13500
)

# Create containers
containers = [
    MaritimeContainer('GEN001', '20ft', 'general', 22.5, (6.06, 2.44, 2.59)),
    MaritimeContainer('REF001', '20ft', 'reefer', 18.0, (6.06, 2.44, 2.59)),
    MaritimeContainer('HAZ001', '20ft', 'hazmat', 14.5, (6.06, 2.44, 2.59))
]

# Optimize
packer = MaritimePacker(ship, gm_threshold=0.3, hazmat_separation=3)
result = packer.pack(containers, strategy='heavy_first')

print(f"Success: {result['success']}")
print(f"Placement rate: {result['metrics']['placement_rate']}%")
print(f"GM: {result['metrics']['gm']}m")
```

### Load from CSV

```python
from load_scenario import optimize_scenario

# Run optimization on scenario from generated data
result = optimize_scenario(scenario_id=1)
```

### Generate Synthetic Data

```bash
python data/generate_datasets.py
```

Generates:
- `ship_specifications.csv` - Ship parameters
- `container_manifests.csv` - 20 scenarios with 600+ containers each
- `scenario_metadata.csv` - Scenario requirements

---

## 🏗️ Architecture

### System Design

```
┌─────────────────────────────────────────────────┐
│           Input: Container Manifest              │
│    (CSV with dimensions, weights, cargo types)   │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│         MaritimePacker (Optimizer)               │
│  ┌─────────────────────────────────────────┐   │
│  │ 1. Sort containers (heavy_first)         │   │
│  │ 2. For each container:                   │   │
│  │    - Find available slots                │   │
│  │    - Check constraints ──────────────┐   │   │
│  │    - Simulate stability              │   │   │
│  │    - Score valid slots               │   │   │
│  │    - Place in best slot              │   │   │
│  └─────────────────────────────────────────┘   │
└────────────────┬────────────────────────────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
    ▼                         ▼
┌──────────────┐    ┌──────────────────┐
│ Constraint   │    │   Stability      │
│  Checker     │    │  Calculator      │
├──────────────┤    ├──────────────────┤
│ • Weight     │    │ • KG = Σ(w×h)/Σw │
│ • Hazmat     │    │ • GM = KB+BM-KG  │
│ • Reefer     │    │ • Check GM≥min   │
└──────────────┘    └──────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│      Output: Optimized Loading Plan              │
│  • Container-to-slot assignments                 │
│  • Stability metrics (GM, KG)                    │
│  • Utilization statistics                        │
│  • Constraint violations (if any)                │
└─────────────────────────────────────────────────┘
```

### Key Algorithms

**Greedy Placement with Constraint Validation:**
1. Sort containers by strategy (weight/priority/hazmat)
2. For each container, evaluate all available slots
3. Filter slots that satisfy constraints (weight, reefer, hazmat)
4. Simulate stability for each valid slot
5. Score slots based on tier preference, stability margin, centerline proximity
6. Place container in highest-scoring valid slot
7. Update ship state and continue

**Stability Calculation:**
```
KG = (lightship_weight × kg_lightship + Σ(container_weight × z_position)) / total_weight
GM = KB + BM - KG

Where:
- KB: Center of buoyancy (4.2m)
- BM: Metacentric radius (4.5m)
- KG: Center of gravity (calculated)
```

---

## 📊 Results

### Performance Metrics

| Metric | Value | Industry Standard |
|--------|-------|-------------------|
| Placement Success Rate | **91.14%** | 85-90% |
| Slot Utilization | **83.97%** | 60-75% |
| Stability Margin | **+0.973m** | +0.1 to +0.3m |
| Processing Time | **<2 minutes** | 2-3 hours (manual) |

### Scenario Analysis (20 Test Cases)

- Average placement rate: **91.2%**
- All scenarios maintained GM > 0.3m (100% stability success)
- Reefer constraints: Primary cause of failed placements (powered slot shortage)
- Hazmat separation: Successfully enforced in all cases

### Why 9% Fail?

Failed placements occur due to:
1. **Reefer power shortage** - Only 14% of slots have power
2. **Hazmat separation conflicts** - 3-position minimum distance
3. **High utilization** - Limited valid slots at 80%+ capacity

This is realistic and matches commercial system performance.

---

## 🛠️ Technologies Used

| Category | Technologies |
|----------|-------------|
| **Core** | Python 3.8+, NumPy, Pandas |
| **Optimization** | py3dbp (extended), Custom constraint solver |
| **Physics** | Naval architecture formulas (GM calculations) |
| **Data Generation** | Synthetic scenario generator with realistic distributions |
| **Version Control** | Git, GitHub |

---

### Learning Outcomes

- Applied constraint satisfaction in real-world optimization
- Integrated domain-specific physics (naval architecture)
- Extended open-source library with specialized features
- Developed end-to-end system from data generation to optimization
- Demonstrated software engineering practices (OOP, modular design)

---

## 📚 Documentation

- **[API Reference](docs/API.md)** - Complete function documentation
- **[Algorithm Details](docs/ALGORITHM.md)** - Mathematical formulations
- **[Constraint Specifications](docs/CONSTRAINTS.md)** - Maritime rules
- **[Examples](examples/)** - Usage tutorials and test cases

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

Areas for enhancement:
- Genetic algorithm implementation for comparison
- Multi-port discharge sequence optimization
- Crane scheduling integration
- Real-time visualization (3D rendering)
- Machine learning for slot prediction

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Acknowledgments

- Built on [py3dbp](https://github.com/jerry800416/3D-bin-packing) by jerry800416
- Naval architecture formulas from standard maritime engineering texts
- Inspired by real-world port operation challenges

---


<div align="center">

### ⭐ Star this repository if you find it useful!

</div>
