package services

import "testing"

func TestBuildManagedResourceTargetsFromMRDs(t *testing.T) {
	mrdList := []map[string]interface{}{
		{
			"spec": map[string]interface{}{
				"group": "example.org",
				"versions": []interface{}{
					map[string]interface{}{"name": "v1beta1"},
				},
				"names": map[string]interface{}{
					"plural": "widgets",
					"kind":   "Widget",
				},
			},
		},
		{
			"spec": map[string]interface{}{
				"group":   "sample.io",
				"version": "v1",
				"names": map[string]interface{}{
					"plural": "gadgets",
					"kind":   "Gadget",
				},
			},
		},
		{
			"spec": map[string]interface{}{
				"group": "fallback.io",
				"names": map[string]interface{}{
					"plural": "things",
					"kind":   "Thing",
				},
			},
		},
		{
			"spec": map[string]interface{}{
				"group": "invalid.io",
				"names": map[string]interface{}{
					"kind": "MissingPlural",
				},
			},
		},
	}

	targets := buildManagedResourceTargetsFromMRDs(mrdList)

	if len(targets) != 3 {
		t.Fatalf("expected 3 valid targets, got %d", len(targets))
	}

	if targets[0].apiVersion != "example.org/v1beta1" || targets[0].kind != "Widget" || targets[0].plural != "widgets" {
		t.Fatalf("unexpected first target: %+v", targets[0])
	}

	if targets[1].apiVersion != "sample.io/v1" || targets[1].kind != "Gadget" || targets[1].plural != "gadgets" {
		t.Fatalf("unexpected second target: %+v", targets[1])
	}

	if targets[2].apiVersion != "fallback.io/v1" || targets[2].kind != "Thing" || targets[2].plural != "things" {
		t.Fatalf("unexpected third target: %+v", targets[2])
	}
}

func TestAppendOptionalManagedResourceTargetsIncludesMRDAndMRAP(t *testing.T) {
	base := []managedResourceTarget{{apiVersion: "example.org/v1", kind: "Widget", plural: "widgets"}}
	result := appendOptionalManagedResourceTargets(base)

	if len(result) != 7 {
		t.Fatalf("expected 7 targets total, got %d", len(result))
	}

	mrdCount := 0
	mrapCount := 0
	for _, target := range result {
		if target.kind == "ManagedResourceDefinition" {
			mrdCount++
		}
		if target.kind == "ManagedResourceActivationPolicy" {
			mrapCount++
		}
	}

	if mrdCount != 3 {
		t.Fatalf("expected 3 MRD targets, got %d", mrdCount)
	}

	if mrapCount != 3 {
		t.Fatalf("expected 3 MRAP targets, got %d", mrapCount)
	}
}

func TestDedupeManagedResourcesByUIDAndFallbackKey(t *testing.T) {
	items := []interface{}{
		map[string]interface{}{
			"apiVersion": "example.org/v1",
			"kind":       "Widget",
			"metadata": map[string]interface{}{
				"uid":       "uid-1",
				"name":      "a",
				"namespace": "default",
			},
		},
		map[string]interface{}{
			"apiVersion": "example.org/v1",
			"kind":       "Widget",
			"metadata": map[string]interface{}{
				"uid":       "uid-1",
				"name":      "a-duplicate",
				"namespace": "default",
			},
		},
		map[string]interface{}{
			"apiVersion": "sample.io/v1",
			"kind":       "Gadget",
			"metadata": map[string]interface{}{
				"name":      "b",
				"namespace": "ns1",
			},
		},
		map[string]interface{}{
			"apiVersion": "sample.io/v1",
			"kind":       "Gadget",
			"metadata": map[string]interface{}{
				"name":      "b",
				"namespace": "ns1",
			},
		},
	}

	deduped := dedupeManagedResources(items)
	if len(deduped) != 2 {
		t.Fatalf("expected 2 unique resources, got %d", len(deduped))
	}
}
