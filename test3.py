"""
Test maritime constraints
"""
from py3dbc.maritime.container import MaritimeContainer
from py3dbc.maritime.ship import ContainerShip
from py3dbc.maritime.constraints import MaritimeConstraintChecker

print("=" * 60)
print("Testing Maritime Constraints")
print("=" * 60)

# Setup ship
stability_params = {
    'kg_lightship': 6.5,
    'lightship_weight': 3500,
    'kb': 4.2,
    'bm': 4.5,
    'gm_min': 0.3
}

ship = ContainerShip(
    ship_name='TEST_SHIP',
    dimensions=(130, 20, 18),
    bays=7,
    rows=14,
    tiers=7,
    stability_params=stability_params,
    max_weight=13500
)

# Create constraint checker
checker = MaritimeConstraintChecker(hazmat_separation=3)

print("\n1. Testing Weight Constraints...")
heavy_container = MaritimeContainer('HEAVY', '40ft', 'general', 35.0, (12.03, 2.44, 2.59))
slot = ship.get_slot(1, 1, 1)

can_place, reason = checker.check_weight_limit(heavy_container, slot)
print(f"  Heavy container (35t): {'✓ OK' if can_place else '✗ REJECTED'} - {reason}")

normal_container = MaritimeContainer('NORMAL', '20ft', 'general', 15.0, (6.06, 2.44, 2.59))
can_place, reason = checker.check_weight_limit(normal_container, slot)
print(f"  Normal container (15t): {'✓ OK' if can_place else '✗ REJECTED'} - {reason}")

print("\n2. Testing Reefer Constraints...")
reefer = MaritimeContainer('REEFER01', '20ft', 'reefer', 18.0, (6.06, 2.44, 2.59))
powered_slot = ship.get_slot(1, 1, 1)  # This is a reefer slot
unpowered_slot = ship.get_slot(1, 2, 1)  # This is not

can_place, reason = checker.check_reefer_power(reefer, powered_slot)
print(f"  Reefer in powered slot: {'✓ OK' if can_place else '✗ REJECTED'} - {reason}")

can_place, reason = checker.check_reefer_power(reefer, unpowered_slot)
print(f"  Reefer in unpowered slot: {'✓ OK' if can_place else '✗ REJECTED'} - {reason}")

print("\n3. Testing Hazmat Separation...")
hazmat1 = MaritimeContainer('HAZ01', '20ft', 'hazmat', 12.0, (6.06, 2.44, 2.59), hazmat_class='Class_3')
hazmat2 = MaritimeContainer('HAZ02', '20ft', 'hazmat', 14.0, (6.06, 2.44, 2.59), hazmat_class='Class_3')

# Place first hazmat
slot1 = ship.get_slot(1, 1, 1)
ship.place_container_in_slot(hazmat1, slot1)
print(f"  ✓ Placed {hazmat1.container_id} in {slot1.slot_id}")

# Try placing second hazmat too close (distance = 1)
slot2_close = ship.get_slot(1, 1, 2)
can_place, reason = checker.check_hazmat_separation_constraint(hazmat2, slot2_close, ship)
print(f"  Hazmat at distance=1: {'✓ OK' if can_place else '✗ REJECTED'} - {reason}")

# Try placing second hazmat at distance = 2
slot2_medium = ship.get_slot(1, 2, 2)
can_place, reason = checker.check_hazmat_separation_constraint(hazmat2, slot2_medium, ship)
print(f"  Hazmat at distance=2: {'✓ OK' if can_place else '✗ REJECTED'} - {reason}")

# Try placing second hazmat far enough (distance = 3)
slot2_far = ship.get_slot(2, 3, 1)
can_place, reason = checker.check_hazmat_separation_constraint(hazmat2, slot2_far, ship)
print(f"  Hazmat at distance=3: {'✓ OK' if can_place else '✗ REJECTED'} - {reason}")

print("\n4. Testing Stability Validation...")
test_container = MaritimeContainer('TEST', '20ft', 'general', 20.0, (6.06, 2.44, 2.59))
test_slot = ship.get_slot(3, 3, 5)  # Higher tier

is_stable, gm = checker.validate_stability_after_placement(
    test_container, test_slot, ship, gm_threshold=0.3
)
print(f"  Stability after placement: {'✓ STABLE' if is_stable else '✗ UNSTABLE'}")
print(f"  Predicted GM: {gm}m (required: 0.3m)")

print("\n5. Testing Complete Constraint Check...")
test_container2 = MaritimeContainer('FINAL', '20ft', 'general', 16.0, (6.06, 2.44, 2.59))
test_slot2 = ship.get_slot(4, 4, 2)

can_place, reason = checker.check_all_constraints(test_container2, test_slot2, ship)
print(f"  All constraints: {'✓ PASS' if can_place else '✗ FAIL'} - {reason}")

print("\n" + "=" * 60)
print("Constraint checking system working!")
print("=" * 60)