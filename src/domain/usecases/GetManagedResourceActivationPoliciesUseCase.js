export class GetManagedResourceActivationPoliciesUseCase {
  constructor(kubernetesRepository) {
    this.kubernetesRepository = kubernetesRepository;
  }

  async execute(context = null) {
    try {
      const apiVersion = 'apiextensions.crossplane.io/v1alpha1';
      const kind = 'ManagedResourceActivationPolicy';
      const mrapsResult = await this.kubernetesRepository.getResources(apiVersion, kind, null, context);
      const mraps = mrapsResult.items || mrapsResult; // Support both new format and legacy array format
      const mrapsArray = Array.isArray(mraps) ? mraps : [];
      
      return mrapsArray.map(mrap => ({
        name: mrap.metadata?.name || 'unknown',
        namespace: mrap.metadata?.namespace || null,
        uid: mrap.metadata?.uid || '',
        creationTimestamp: mrap.metadata?.creationTimestamp || '',
        labels: mrap.metadata?.labels || {},
        activationPolicy: mrap.spec?.activationPolicy || '',
        managedResourceSelector: mrap.spec?.managedResourceSelector || {},
        spec: mrap.spec || {},
        status: mrap.status || {},
        conditions: mrap.status?.conditions || [],
      }));
    } catch (error) {
      throw new Error(`Failed to get managed resource activation policies: ${error.message}`);
    }
  }
}