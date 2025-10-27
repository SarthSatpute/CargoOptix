"""
Simple API interface for CargoOptix UI
Clean functions that frontend can call
"""
from load_scenario import load_ship_from_specs, load_scenario_containers
from py3dbc.maritime.packer import MaritimePacker
import pandas as pd
import json

def optimize_scenario_api(scenario_id):
    """
    Main API function - optimizes a scenario
    
    Args:
        scenario_id: int (1-20)
        
    Returns:
        dict with all results formatted for UI
    """
    # Load data
    ship, specs = load_ship_from_specs()
    containers = load_scenario_containers(scenario_id)
    
    # Optimize
    packer = MaritimePacker(ship, gm_threshold=ship.gm_min, hazmat_separation=3)
    result = packer.pack(containers, strategy='heavy_first')
    
    # Format response for UI
    return {
        'success': result['success'],
        'scenario_id': scenario_id,
        'metrics': {
            'placement_rate': result['metrics']['placement_rate'],
            'placed_count': result['metrics']['placed_containers'],
            'total_count': result['metrics']['total_containers'],
            'failed_count': result['metrics']['failed_containers'],
            'slot_utilization': result['metrics']['slot_utilization'],
            'teu_loaded': result['metrics']['total_teu'],
            'total_weight': result['metrics']['total_weight'],
            'kg': result['metrics']['kg'],
            'gm': result['metrics']['gm'],
            'is_stable': result['metrics']['is_stable'],
            'stability_margin': result['metrics']['stability_margin'],
            'cargo_distribution': result['metrics']['cargo_distribution']
        },
        'placed_containers': [
            {
                'id': c.container_id,
                'type': c.cargo_type,
                'size': c.teu_size,
                'weight': c.total_weight,
                'slot': c.assigned_slot.slot_id if c.assigned_slot else None,
                'bay': c.bay if c.bay else None,
                'row': c.row if c.row else None,
                'tier': c.tier if c.tier else None,
                'position': {
                    'x': c.assigned_slot.x_pos if c.assigned_slot else None,
                    'y': c.assigned_slot.y_pos if c.assigned_slot else None,
                    'z': c.assigned_slot.z_pos if c.assigned_slot else None
                }
            }
            for c in result['placed']
        ],
        'failed_containers': [
            {
                'id': c.container_id,
                'type': c.cargo_type,
                'weight': c.total_weight,
                'reason': 'Constraints not satisfied'
            }
            for c in result['failed']
        ]
    }

def get_scenario_list():
    """
    Get list of available demo scenarios
    
    Returns:
        list of scenario metadata
    """
    metadata = pd.read_csv('scenario_metadata.csv')
    
    return [
        {
            'id': row['scenario_id'],
            'containers': row['num_containers'],
            'teu': row['actual_teu'],
            'sea_state': row['sea_state'],
            'utilization': row['actual_utilization']
        }
        for _, row in metadata.iterrows()
    ]

def export_results_json(scenario_id, output_file='result.json'):
    """
    Export results as JSON file
    
    Args:
        scenario_id: scenario to export
        output_file: filename to save
    """
    result = optimize_scenario_api(scenario_id)
    
    with open(output_file, 'w') as f:
        json.dump(result, f, indent=2)
    
    return output_file

# Test the API
if __name__ == "__main__":
    print("Testing CargoOptix API...")
    
    # Test scenario optimization
    result = optimize_scenario_api(1)
    print(f"\n✓ API returned: {result['metrics']['placed_count']} placed")
    
    # Test scenario list
    scenarios = get_scenario_list()
    print(f"✓ Available scenarios: {len(scenarios)}")
    
    # Test export
    export_results_json(1, 'test_export.json')
    print("✓ Export successful")