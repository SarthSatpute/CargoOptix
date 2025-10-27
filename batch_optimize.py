"""
Run all 20 scenarios and collect aggregate statistics
"""
import pandas as pd
from load_scenario import optimize_scenario
import time

print("="*80)
print("BATCH OPTIMIZATION - ALL 20 SCENARIOS")
print("="*80)

all_results = []
start_time = time.time()

for scenario_id in range(1, 21):
    print(f"\n[{scenario_id}/20] Processing Scenario {scenario_id}...")
    
    try:
        result = optimize_scenario(scenario_id)
        metrics = result['metrics']
        metrics['scenario_id'] = scenario_id
        all_results.append(metrics)
        
        print(f"  ✓ Placed: {metrics['placed_containers']}/{metrics['total_containers']}")
        print(f"  ✓ GM: {metrics['gm']}m")
        
    except Exception as e:
        print(f"  ✗ Error: {e}")
        continue

# Save detailed results
results_df = pd.DataFrame(all_results)
results_df.to_csv('batch_results_all_scenarios.csv', index=False)

# Generate summary statistics
print("\n" + "="*80)
print("AGGREGATE ANALYSIS")
print("="*80)

print(f"\nScenarios completed: {len(results_df)}/20")

print(f"\n📊 PLACEMENT PERFORMANCE:")
print(f"  Average placement rate: {results_df['placement_rate'].mean():.2f}%")
print(f"  Best: {results_df['placement_rate'].max():.2f}%")
print(f"  Worst: {results_df['placement_rate'].min():.2f}%")
print(f"  Std deviation: {results_df['placement_rate'].std():.2f}%")

print(f"\n📦 UTILIZATION:")
print(f"  Average slot utilization: {results_df['slot_utilization'].mean():.2f}%")
print(f"  Average TEU loaded: {results_df['total_teu'].mean():.0f}")

print(f"\n⚓ STABILITY:")
print(f"  Average GM: {results_df['gm'].mean():.3f}m")
print(f"  Minimum GM: {results_df['gm'].min():.3f}m")
print(f"  All stable: {results_df['is_stable'].all()}")
print(f"  Average margin: {results_df['stability_margin'].mean():.3f}m")

print(f"\n⚖️ WEIGHT:")
print(f"  Average loaded: {results_df['total_weight'].mean():.1f}t")
print(f"  Maximum loaded: {results_df['total_weight'].max():.1f}t")

print(f"\n⏱️ PERFORMANCE:")
print(f"  Total time: {time.time() - start_time:.1f} seconds")
print(f"  Avg per scenario: {(time.time() - start_time)/len(results_df):.1f} seconds")

print(f"\n✅ Results saved to 'batch_results_all_scenarios.csv'")