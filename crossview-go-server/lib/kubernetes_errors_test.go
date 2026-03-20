package lib

import (
	"fmt"
	"testing"
)

func TestIsMissingKubernetesResourceError(t *testing.T) {
	testCases := []struct {
		name     string
		err      error
		expected bool
	}{
		{
			name:     "nil error",
			err:      nil,
			expected: false,
		},
		{
			name:     "issue wording",
			err:      fmt.Errorf("failed to list resources: the server could not find the requested resource"),
			expected: true,
		},
		{
			name:     "notfound wording",
			err:      fmt.Errorf("failed to list resources: NotFound"),
			expected: true,
		},
		{
			name:     "unrelated error",
			err:      fmt.Errorf("failed to list resources: permission denied"),
			expected: false,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			if actual := IsMissingKubernetesResourceError(tc.err); actual != tc.expected {
				t.Fatalf("expected %t, got %t", tc.expected, actual)
			}
		})
	}
}
