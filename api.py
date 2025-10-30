from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from load_scenario import load_ship_from_specs, load_scenario_containers
from py3dbc.maritime.packer import MaritimePacker
import pandas as pd
import json

app = FastAPI(title="CargoOptix API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def optimize_scenario_api(scenario_id):
    ship, specs = load_ship_from_specs()
    containers = load_scenario_containers(scenario_id)

    packer = MaritimePacker(ship, gm_threshold=ship.gm_min, hazmat_separation=3)
    result = packer.pack(containers, strategy='heavy_first')

    # ✅ Ship dimensions from ShipHull.tsx:
    # Hull: 60 (length) x 8 (height) x 15 (width)
    # Deck at Y = 4
    # Ship layout: 7 bays x 14 rows x 7 tiers
    
    SHIP_LENGTH = 60.0
    SHIP_WIDTH = 15.0
    DECK_HEIGHT = 4.0
    
    # Calculate spacing to fit containers within ship bounds
    BAY_SPACING = SHIP_LENGTH / 7  # ≈ 8.57 units per bay
    ROW_SPACING = SHIP_WIDTH / 14   # ≈ 1.07 units per row
    TIER_HEIGHT = 2.6               # Standard container height

    return {
        "success": result["success"],
        "scenario_id": scenario_id,
        "metrics": result["metrics"],
        "placed_containers": [
            {
                "id": c.container_id,
                "type": c.cargo_type,
                "size": c.teu_size,
                "weight": c.total_weight,
                "slot": c.assigned_slot.slot_id if c.assigned_slot else None,
                "bay": getattr(c.assigned_slot, 'bay', 0) if c.assigned_slot else 0,
                "row": getattr(c.assigned_slot, 'row', 0) if c.assigned_slot else 0,
                "tier": getattr(c.assigned_slot, 'tier', 0) if c.assigned_slot else 0,
                "position": {
                    # X: Distribute 7 bays across ship length (60 units), centered at 0
                    "x": (getattr(c.assigned_slot, 'bay', 0) - 3) * BAY_SPACING if c.assigned_slot else 0,
                    # Y: Stack containers starting from deck (Y=4), going upward
                    "y": DECK_HEIGHT + 0.5 + (getattr(c.assigned_slot, 'tier', 0) * TIER_HEIGHT) if c.assigned_slot else 0,
                    # Z: Distribute 14 rows across ship width (15 units), centered at 0
                    "z": (getattr(c.assigned_slot, 'row', 0) - 6.5) * ROW_SPACING if c.assigned_slot else 0,
                } if c.assigned_slot else {"x": 0, "y": 0, "z": 0},
            }
            for c in result["placed"]
        ],
        "failed_containers": [
            {
                "id": c.container_id,
                "type": c.cargo_type,
                "weight": c.total_weight,
                "reason": "Constraints not satisfied",
            }
            for c in result["failed"]
        ],
    }

@app.get("/scenarios")
def get_scenario_list():
    metadata = pd.read_csv("scenario_metadata.csv")
    return [
        {
            "id": row["scenario_id"],
            "containers": row["num_containers"],
            "teu": row["actual_teu"],
            "sea_state": row["sea_state"],
            "utilization": row["actual_utilization"],
        }
        for _, row in metadata.iterrows()
    ]

@app.get("/optimize/{scenario_id}")
def optimize_scenario(scenario_id: int):
    return optimize_scenario_api(scenario_id)

@app.get("/")
def root():
    return {"message": "CargoOptix API is running"}