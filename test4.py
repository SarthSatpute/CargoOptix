"""
Test maritime packer with realistic scenario
"""
from py3dbc.maritime.container import MaritimeContainer
from py3dbc.maritime.ship import ContainerShip
from py3dbc.maritime.packer import MaritimePacker
import random

random.seed(42)

print("=" * 70)
print("Testing MaritimePacker - Realistic Scenario")
print("=" * 70)

# Setup ship
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
    bays=7,
    rows=14,
    tiers=7,
    stability_params=stability_params,
    max_weight=13500
)

print(f"\nShip: {ship.ship_name}")
print(f"Capacity: {ship.bays}x{ship.rows}x{ship.tiers} = {len(ship.slots)} slots")
print(f"GM threshold: {ship.gm_min}m")

# Generate realistic container mix
print("\nGenerating container manifest...")
containers = []

# 20 general cargo containers (varied weights)
for i in range(20):
    weight = random.uniform(10, 24)
    containers.append(MaritimeContainer(
        container_id=f"GEN{i+1:03d}",
        teu_size='20ft',
        cargo_type='general',
        total_weight=round(weight, 1),
        dimensions=(6.06, 2.44, 2.59),
        loading_priority=random.randint(1, 3)
    ))

# 5 reefer containers
for i in range(5):
    weight = random.uniform(15, 22)
    containers.append(MaritimeContainer(
        container_id=f"REF{i+1:03d}",
        teu_size='20ft',
        cargo_type='reefer',
        total_weight=round(weight, 1),
        dimensions=(6.06, 2.44, 2.59),
        loading_priority=1
    ))

# 3 hazmat containers
for i in range(3):
    weight = random.uniform(8, 15)
    containers.append(MaritimeContainer(
        container_id=f"HAZ{i+1:03d}",
        teu_size='20ft',
        cargo_type='hazmat',
        total_weight=round(weight, 1),
        dimensions=(6.06, 2.44, 2.59),
        hazmat_class='Class_3',
        loading_priority=2
    ))

# 5 40ft containers
for i in range(5):
    weight = random.uniform(18, 28)
    containers.append(MaritimeContainer(
        container_id=f"40FT{i+1:03d}",
        teu_size='40ft',
        cargo_type='general',
        total_weight=round(weight, 1),
        dimensions=(12.03, 2.44, 2.59),
        loading_priority=2
    ))

print(f"Total containers: {len(containers)}")
print(f"  General: 25")
print(f"  Reefer: 5")
print(f"  Hazmat: 3")
print(f"  Total weight: {sum(c.total_weight for c in containers):.1f}t")

# Create packer and optimize
print("\n" + "=" * 70)
packer = MaritimePacker(ship, gm_threshold=0.3, hazmat_separation=3)

result = packer.pack(containers, strategy='heavy_first')

# Display results
print("\n" + "=" * 70)
print("OPTIMIZATION RESULTS")
print("=" * 70)

metrics = result['metrics']

print(f"\nPlacement Performance:")
print(f"  Containers placed: {metrics['placed_containers']}/{metrics['total_containers']}")
print(f"  Placement rate: {metrics['placement_rate']}%")
print(f"  Failed containers: {metrics['failed_containers']}")

print(f"\nUtilization:")
print(f"  TEU loaded: {metrics['total_teu']}")
print(f"  Slot utilization: {metrics['slot_utilization']}%")

print(f"\nStability:")
print(f"  Total weight: {metrics['total_weight']}t")
print(f"  KG: {metrics['kg']}m")
print(f"  GM: {metrics['gm']}m")
print(f"  Status: {'✓ STABLE' if metrics['is_stable'] else '✗ UNSTABLE'}")
print(f"  Stability margin: {metrics['stability_margin']}m")

print(f"\nCargo Distribution:")
for cargo_type, count in metrics['cargo_distribution'].items():
    print(f"  {cargo_type}: {count}")

if result['failed']:
    print(f"\nFailed Placements:")
    for container in result['failed']:
        print(f"  - {container.container_id} ({container.cargo_type}, {container.total_weight}t)")

print("\n" + "=" * 70)
print("Packing test complete!")
print("=" * 70)