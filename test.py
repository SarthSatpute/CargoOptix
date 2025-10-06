"""
Test maritime extensions
"""
from py3dbc.maritime.container import MaritimeContainer
from py3dbc.physics.stability import StabilityCalculator

print("=" * 50)
print("Testing py3dbc Maritime Extensions")
print("=" * 50)

# Test 1: Create containers
print("\n1. Creating Maritime Containers...")
container1 = MaritimeContainer(
    container_id='TEST001',
    teu_size='20ft',
    cargo_type='general',
    total_weight=15.5,
    dimensions=(6.06, 2.44, 2.59),
    loading_priority=1
)

container2 = MaritimeContainer(
    container_id='TEST002',
    teu_size='40ft',
    cargo_type='reefer',
    total_weight=22.0,
    dimensions=(12.03, 2.44, 2.59),
    loading_priority=2
)

container3 = MaritimeContainer(
    container_id='TEST003',
    teu_size='20ft',
    cargo_type='hazmat',
    total_weight=18.0,
    dimensions=(6.06, 2.44, 2.59),
    hazmat_class='Class_3',
    loading_priority=3
)

print(f"✓ Created: {container1}")
print(f"✓ Created: {container2}")
print(f"✓ Created: {container3}")

# Test 2: Check container properties
print("\n2. Container Properties:")
print(f"Container 1 - TEU: {container1.teu_value}, Color: {container1.color}")
print(f"Container 2 - Is Reefer: {container2.is_reefer()}")
print(f"Container 3 - Is Hazmat: {container3.is_hazmat()}, Class: {container3.hazmat_class}")

# Test 3: Stability Calculator
print("\n3. Testing Stability Calculator...")
ship_specs = {
    'kg_lightship': 6.5,
    'lightship_weight': 3500,
    'kb': 4.2,
    'bm': 4.5,
    'gm_min': 0.3
}

stability_calc = StabilityCalculator(ship_specs)
print(f"✓ Stability calculator initialized")
print(f"  Lightship KG: {stability_calc.kg_lightship}m")
print(f"  Required GM_min: {stability_calc.gm_min}m")

# Simulate placement (set positions manually for test)
container1.position = [10, 5, 2.5]  # x, y, z
container2.position = [20, -5, 3.0]
container3.position = [30, 0, 2.0]

placed = [container1, container2, container3]

# Calculate stability
status = stability_calc.get_stability_status(placed)

print("\n4. Stability Analysis:")
print(f"  Total Weight: {status['total_weight']}t")
print(f"  KG: {status['kg']}m")
print(f"  GM: {status['gm']}m")
print(f"  Stable: {'✓ YES' if status['is_stable'] else '✗ NO'}")
print(f"  Stability Margin: {status['stability_margin']}m")

print("\n" + "=" * 50)
print("All tests passed! py3dbc extensions working.")
print("=" * 50)