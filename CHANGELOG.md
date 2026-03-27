# Changelog

# v3.8.0-rc.2 (March 2026)


## Features & Enhancements

- **Handle missing Kubernetes API resources gracefully**  
  - Add `IsMissingKubernetesResourceError` helper to classify missing-resource cases, including the “the server could not find the requested resource” message.
  - Use that helper in Kubernetes resource listing so unsupported APIs return an empty result instead of bubbling up as an error.
  - Update the Kubernetes controller to treat those missing-resource errors as `200 OK` with empty `items`, avoiding the 500 path.
  - Add tests for the new helper and for the controller behavior when `Function` APIs are unavailable.

- **Updated readme**  
  - In the readme file `Helm Repository` address was mistakenly pointing to the old organizarion. This is updated now pointing to the valid address.