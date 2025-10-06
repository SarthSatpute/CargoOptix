"""
Load and optimize from your synthetic datasets
"""
import pandas as pd
from py3dbc.maritime.container import MaritimeContainer
from py3dbc.maritime.ship import ContainerShip
from py3dbc.maritime.packer import MaritimePacker

def load_ship_from_specs(ship_specs_path='ship_specifications.csv'):
    """Load ship specifications"""
    df = pd.read_csv(ship_specs_path)
    specs = df.iloc[0].to_dict()
    
    stability_params = {
        'kg_lightship': specs['kg_lightship'],
        'lightship_weight': specs['lightship_weight'],
        'kb': specs['kb'],
        'bm': specs['bm'],
        'gm_min': specs['gm_min']
    }
    
    ship = ContainerShip(
        ship_name='FEEDER_01',
        dimensions=(specs['length'], specs['beam'], specs['draft'] * 2),
        bays=7,  # From your generation script
        rows=14,
        tiers=7,
        stability_params=stability_params,
        max_weight=specs['deadweight']
    )
    
    return ship, specs

def load_scenario_containers(scenario_id, manifests_path='container_manifests.csv'):
    """Load containers for specific scenario"""
    df = pd.read_csv(manifests_path)
    scenario_df = df[df['scenario_id'] == scenario_id]
    
    containers = []
    for _, row in scenario_df.iterrows():
        container = MaritimeContainer(
            container_id=row['container_id'],
            teu_size=row['size'],
            cargo_type=row['cargo_type'],
            total_weight=row['total_weight'],
            dimensions=(row['length'], row['width'], row['height']),
            empty_weight=row['empty_weight'],
            destination=row['destination'],
            hazmat_class='Class_3' if row['cargo_type'] == 'hazmat' else None,
            loading_priority=row['loading_priority']
        )
        containers.append(container)
    
    return containers

def optimize_scenario(scenario_id):
    """Run optimization for a specific scenario"""
    print("=" * 80)
    print(f"OPTIMIZING SCENARIO {scenario_id}")
    print("=" * 80)
    
    # Load ship
    ship, ship_specs = load_ship_from_specs()
    print(f"\nShip loaded: {ship.ship_name}")
    print(f"  Capacity: {ship.bays}x{ship.rows}x{ship.tiers} = {len(ship.slots)} slots")
    print(f"  Deadweight: {ship_specs['deadweight']}t")
    print(f"  GM threshold: {ship.gm_min}m")
    
    # Load containers
    containers = load_scenario_containers(scenario_id)
    print(f"\nContainers loaded: {len(containers)}")
    
    cargo_counts = {}
    for c in containers:
        cargo_counts[c.cargo_type] = cargo_counts.get(c.cargo_type, 0) + 1
    
    print(f"  General: {cargo_counts.get('general', 0)}")
    print(f"  Reefer: {cargo_counts.get('reefer', 0)}")
    print(f"  Hazmat: {cargo_counts.get('hazmat', 0)}")
    print(f"  Total weight: {sum(c.total_weight for c in containers):.1f}t")
    print(f"  Total TEU: {sum(c.teu_value for c in containers)}")
    
    # Optimize
    packer = MaritimePacker(ship, gm_threshold=ship.gm_min, hazmat_separation=3)
    result = packer.pack(containers, strategy='heavy_first')
    
    # Results
    print("\n" + "=" * 80)
    print("OPTIMIZATION RESULTS")
    print("=" * 80)
    
    metrics = result['metrics']
    
    print(f"\nPlacement Performance:")
    print(f"  Containers placed: {metrics['placed_containers']}/{metrics['total_containers']}")
    print(f"  Placement rate: {metrics['placement_rate']}%")
    print(f"  Failed: {metrics['failed_containers']}")
    
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
    
    # Save results
    results_df = pd.DataFrame([{
        'scenario_id': scenario_id,
        'placed': metrics['placed_containers'],
        'total': metrics['total_containers'],
        'placement_rate': metrics['placement_rate'],
        'teu_loaded': metrics['total_teu'],
        'utilization': metrics['slot_utilization'],
        'total_weight': metrics['total_weight'],
        'kg': metrics['kg'],
        'gm': metrics['gm'],
        'is_stable': metrics['is_stable'],
        'stability_margin': metrics['stability_margin']
    }])
    
    results_df.to_csv(f'results_scenario_{scenario_id}.csv', index=False)
    print(f"\n✓ Results saved to results_scenario_{scenario_id}.csv")
    
    return result

if __name__ == "__main__":
    # Test with scenario 1
    optimize_scenario(1)