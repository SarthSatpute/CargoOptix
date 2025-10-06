"""
Test ContainerShip class
"""
from py3dbc.maritime.container import MaritimeContainer
from py3dbc.maritime.ship import ContainerShip

print("=" * 60)
print("Testing ContainerShip Class")
print("=" * 60)

# Create ship
print("\n1. Creating Container Ship...")
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

print(f"✓ {ship}")
print(f"  Total slots: {len(ship.slots)}")
print(f"  Available slots: {len(ship.get_available_slots())}")

# Check slot structure
print("\n2. Checking Slot Structure...")
sample_slot = ship.get_slot(1, 1, 1)
print(f"  Sample slot: {sample_slot.slot_id}")
print(f"  Position: ({sample_slot.x_pos}, {sample_slot.y_pos}, {sample_slot.z_pos})")
print(f"  Reefer slot: {sample_slot.is_reefer_slot}")
print(f"  Max tier weight: {sample_slot.max_tier_weight}t")

# Create containers
print("\n3. Creating Containers...")
containers = [
    MaritimeContainer('C001', '20ft', 'general', 15.0, (6.06, 2.44, 2.59)),
    MaritimeContainer('C002', '20ft', 'reefer', 18.0, (6.06, 2.44, 2.59)),
    MaritimeContainer('C003', '40ft', 'general', 24.0, (12.03, 2.44, 2.59)),
    MaritimeContainer('C004', '20ft', 'hazmat', 12.0, (6.06, 2.44, 2.59), hazmat_class='Class_3')
]

for c in containers:
    print(f"  ✓ {c}")

# Place containers manually
print("\n4. Placing Containers in Slots...")
placements = [
    (containers[0], ship.get_slot(1, 1, 1)),
    (containers[1], ship.get_slot(1, 2, 1)),  # Reefer needs powered slot
    (containers[2], ship.get_slot(2, 1, 1)),
    (containers[3], ship.get_slot(3, 1, 1))
]

for container, slot in placements:
    if slot.can_place(container):
        success = ship.place_container_in_slot(container, slot)
        if success:
            print(f"  ✓ Placed {container.container_id} in {slot.slot_id}")
        else:
            print(f"  ✗ Failed to place {container.container_id}")
    else:
        print(f"  ✗ Slot {slot.slot_id} cannot accept {container.container_id}")

# Check stability
print("\n5. Stability Analysis...")
stability = ship.calculate_current_stability()
print(f"  Total weight: {stability['total_weight']}t")
print(f"  KG: {stability['kg']}m")
print(f"  GM: {stability['gm']}m")
print(f"  Stable: {'✓ YES' if stability['is_stable'] else '✗ NO'}")

# Summary
print("\n6. Ship Summary...")
summary = ship.get_summary()
print(f"  Utilization: {summary['utilization']}%")
print(f"  Occupied slots: {summary['occupied_slots']}/{summary['total_slots']}")
print(f"  Containers by type: {summary['containers_by_type']}")

print("\n" + "=" * 60)
print("ContainerShip class working correctly!")
print("=" * 60)