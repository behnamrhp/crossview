package lib

import (
	"strings"

	apierrors "k8s.io/apimachinery/pkg/api/errors"
	apimeta "k8s.io/apimachinery/pkg/api/meta"
)

// IsMissingKubernetesResourceError returns true when the target API resource is
// not available on the cluster and callers should degrade to an empty result.
func IsMissingKubernetesResourceError(err error) bool {
	if err == nil {
		return false
	}

	if apierrors.IsNotFound(err) || apimeta.IsNoMatchError(err) {
		return true
	}

	message := strings.ToLower(err.Error())

	return strings.Contains(message, "404") ||
		strings.Contains(message, "notfound") ||
		strings.Contains(message, "does not exist") ||
		strings.Contains(message, "the server could not find the requested resource") ||
		strings.Contains(message, "could not find the requested resource")
}
