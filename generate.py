import pandas as pd
import numpy as np
import random
import math

# -----------------------------
# Parameters
# -----------------------------
random_seed = 42
np.random.seed(random_seed)
random.seed(random_seed)

# Ship specifications
SHIP_SPECS = {
    'length': 130,  # meters
    'beam': 20,     # meters
    'draft': 8,     # meters
    'teu_capacity': 900,
    'deadweight': 13500,  # tonnes
    'lightship_weight': 3500,  # tonnes
    'kg_lightship': 6.5,  # meters above keel
    'gm_min': 0.3,   # minimum metacentric height
    'kb': 4.2,       # center of buoyancy above keel
    'bm': 4.5        # metacentric radius
}

# Ship slot geometry
NUM_BAYS = 7
NUM_ROWS = 14
NUM_TIERS = 7
BAY_LENGTH = 12.5  # meters per bay
ROW_WIDTH = 2.44   # standard container width

# Container specifications
CONTAINER_SPECS = {
    '20ft': {'length': 6.06, 'width': 2.44, 'height': 2.59, 'empty_weight': 2.3, 'max_cargo': 21.7, 'teu': 1},
    '40ft': {'length': 12.03, 'width': 2.44, 'height': 2.59, 'empty_weight': 3.75, 'max_cargo': 26.25, 'teu': 2}
}

# Weight distribution profiles
WEIGHT_PROFILES = {
    '20ft': {
        'light': (2.3 + 2, 2.3 + 8, 0.40),    # empty + (2-8t cargo), 40%
        'medium': (2.3 + 8, 2.3 + 16, 0.45),  # empty + (8-16t cargo), 45%
        'heavy': (2.3 + 16, 2.3 + 21.7, 0.15) # empty + (16-21.7t cargo), 15%
    },
    '40ft': {
        'light': (3.75 + 4, 3.75 + 12, 0.35),   # 35%
        'medium': (3.75 + 12, 3.75 + 20, 0.50), # 50%
        'heavy': (3.75 + 20, 3.75 + 26.25, 0.15) # 15%
    }
}

# Cargo categories with realistic distributions
CARGO_CATEGORIES = {
    'general': 0.75,
    'reefer': 0.15,
    'hazmat': 0.10
}

# -----------------------------
# Core Functions
# -----------------------------

def generate_ship_slots():
    """Generate all available slots with coordinates and constraints"""
    slots = []
    slot_id = 1
    
    for bay in range(1, NUM_BAYS + 1):
        for row in range(1, NUM_ROWS + 1):
            for tier in range(1, NUM_TIERS + 1):
                # Calculate slot center coordinates
                x_pos = (bay - 1) * BAY_LENGTH + (BAY_LENGTH / 2)  # longitudinal
                y_pos = -(SHIP_SPECS['beam']/2) + (row - 1) * ROW_WIDTH + (ROW_WIDTH / 2)  # transverse
                z_pos = (tier - 1) * CONTAINER_SPECS['20ft']['height'] + (CONTAINER_SPECS['20ft']['height'] / 2)  # vertical
                
                # Calculate maximum stack weight (decreases with height)
                max_stack_weight = 150 - (tier - 1) * 15  # tonnes
                max_tier_weight = 30  # tonnes per container
                
                # Reefer slots (assume 15% of slots have power)
                is_reefer_slot = (slot_id % 7 == 0)  # roughly 14% reefer slots
                
                slots.append({
                    'slot_id': f"B{bay:02d}R{row:02d}T{tier:02d}",
                    'bay': bay,
                    'row': row, 
                    'tier': tier,
                    'x_pos': round(x_pos, 2),
                    'y_pos': round(y_pos, 2), 
                    'z_pos': round(z_pos, 2),
                    'max_stack_weight': max_stack_weight,
                    'max_tier_weight': max_tier_weight,
                    'is_reefer_slot': is_reefer_slot,
                    'occupied': False
                })
                slot_id += 1
    
    return pd.DataFrame(slots)

def generate_weight_from_profile(container_size):
    """Generate realistic container weight based on distribution profiles"""
    profiles = WEIGHT_PROFILES[container_size]
    
    # Choose weight category based on probabilities
    rand = random.random()
    if rand < profiles['light'][2]:
        category = 'light'
    elif rand < profiles['light'][2] + profiles['medium'][2]:
        category = 'medium'  
    else:
        category = 'heavy'
    
    min_weight, max_weight, _ = profiles[category]
    return round(random.uniform(min_weight, max_weight), 2), category

def generate_container_manifest(num_containers, scenario_id):
    """Generate realistic container manifest without slot assignments"""
    containers = []
    
    # Determine container size mix (70% 20ft, 30% 40ft)
    container_sizes = ['20ft'] * 70 + ['40ft'] * 30
    
    for i in range(num_containers):
        container_size = random.choice(container_sizes)
        weight, weight_category = generate_weight_from_profile(container_size)
        
        # Assign cargo category
        cargo_type = np.random.choice(
            list(CARGO_CATEGORIES.keys()),
            p=list(CARGO_CATEGORIES.values())
        )
        
        # Special constraints
        loading_priority = random.randint(1, 5)  # 1=high, 5=low
        
        containers.append({
            'scenario_id': scenario_id,
            'container_id': f"S{scenario_id:03d}C{i+1:04d}",
            'size': container_size,
            'teu': CONTAINER_SPECS[container_size]['teu'],
            'length': CONTAINER_SPECS[container_size]['length'],
            'width': CONTAINER_SPECS[container_size]['width'], 
            'height': CONTAINER_SPECS[container_size]['height'],
            'empty_weight': CONTAINER_SPECS[container_size]['empty_weight'],
            'total_weight': weight,
            'cargo_weight': round(weight - CONTAINER_SPECS[container_size]['empty_weight'], 2),
            'weight_category': weight_category,
            'cargo_type': cargo_type,
            'loading_priority': loading_priority,
            'destination': 'PORT_B',  # single destination for now
        })
    
    return pd.DataFrame(containers)

def calculate_scenario_constraints(utilization, sea_state):
    """Calculate scenario-specific parameters"""
    total_teu = SHIP_SPECS['teu_capacity']
    target_teu = int(total_teu * utilization)
    
    # Sea state affects stability requirements
    sea_state_factors = {
        'calm': {'gm_multiplier': 1.0, 'perturbation_stddev': 0.1},
        'moderate': {'gm_multiplier': 1.2, 'perturbation_stddev': 0.3},
        'rough': {'gm_multiplier': 1.5, 'perturbation_stddev': 0.5}
    }
    
    factor = sea_state_factors[sea_state]
    required_gm = SHIP_SPECS['gm_min'] * factor['gm_multiplier']
    
    return {
        'target_teu': target_teu,
        'required_gm': round(required_gm, 3),
        'perturbation_stddev': factor['perturbation_stddev']
    }

def generate_scenarios(num_scenarios=10): 
    """Generate multiple loading scenarios"""
    scenarios = []
    sea_states = ['calm', 'moderate', 'rough']
    
    for scenario_id in range(1, num_scenarios + 1):
        # Random scenario parameters
        utilization = random.uniform(0.75, 0.95)
        sea_state = random.choice(sea_states)
        
        # Calculate constraints
        constraints = calculate_scenario_constraints(utilization, sea_state)
        
        # Generate container manifest
        # Estimate containers needed (accounting for 40ft = 2 TEU)
        estimated_containers = int(constraints['target_teu'] * 0.8)  # rough estimate
        
        containers_df = generate_container_manifest(estimated_containers, scenario_id)
        
        # Calculate actual TEU from generated containers
        actual_teu = containers_df['teu'].sum()
        
        scenario_meta = {
            'scenario_id': scenario_id,
            'sea_state': sea_state,
            'target_utilization': round(utilization, 3),
            'target_teu': constraints['target_teu'],
            'actual_teu': actual_teu,
            'actual_utilization': round(actual_teu / SHIP_SPECS['teu_capacity'], 3),
            'required_gm': constraints['required_gm'],
            'perturbation_stddev': constraints['perturbation_stddev'],
            'num_containers': len(containers_df),
            'total_weight': containers_df['total_weight'].sum(),
            'avg_container_weight': round(containers_df['total_weight'].mean(), 2)
        }
        
        scenarios.append({
            'meta': scenario_meta,
            'containers': containers_df
        })
    
    return scenarios

def export_datasets():
    """Generate and export all datasets"""
    print("Generating CargoOptix realistic datasets...")
    
    # Generate ship slots (static)
    slots_df = generate_ship_slots()
    slots_df.to_csv('ship_slots.csv', index=False)
    print(f"✓ Ship slots generated: {len(slots_df)} slots")
    
    # Generate scenarios
    scenarios = generate_scenarios(20)  # 20 different scenarios
    
    # Export scenario metadata
    meta_list = [scenario['meta'] for scenario in scenarios]
    meta_df = pd.DataFrame(meta_list)
    meta_df.to_csv('scenario_metadata.csv', index=False)
    print(f"✓ Scenario metadata generated: {len(meta_df)} scenarios")
    
    # Export all container manifests
    all_containers = []
    for scenario in scenarios:
        all_containers.extend(scenario['containers'].to_dict('records'))
    
    containers_df = pd.DataFrame(all_containers)
    containers_df.to_csv('container_manifests.csv', index=False)
    print(f"✓ Container manifests generated: {len(containers_df)} containers")
    
    # Export ship specifications
    ship_df = pd.DataFrame([SHIP_SPECS])
    ship_df.to_csv('ship_specifications.csv', index=False)
    print("✓ Ship specifications exported")
    
    # Summary statistics
    print("\n" + "="*50)
    print("DATASET SUMMARY")
    print("="*50)
    print(f"Ship capacity: {SHIP_SPECS['teu_capacity']} TEU")
    print(f"Total available slots: {len(slots_df)}")
    print(f"Scenarios generated: {len(scenarios)}")
    print(f"Average containers per scenario: {len(containers_df) // len(scenarios)}")
    print(f"Weight range: {containers_df['total_weight'].min():.1f} - {containers_df['total_weight'].max():.1f} tonnes")
    print(f"Cargo type distribution:")
    for cargo_type, count in containers_df['cargo_type'].value_counts().items():
        print(f"  {cargo_type}: {count} ({count/len(containers_df)*100:.1f}%)")
    
    return {
        'slots': slots_df,
        'scenarios': meta_df, 
        'containers': containers_df,
        'ship_specs': ship_df
    }

# -----------------------------
# Execute
# -----------------------------
if __name__ == "__main__":
    datasets = export_datasets()