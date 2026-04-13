import {
  Box,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppContext } from '../providers/AppProvider.jsx';
import { DataTable } from '../components/common/DataTable.jsx';
import { ResourceDetails } from '../components/common/ResourceDetails.jsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';
import { Dropdown } from '../components/common/Dropdown.jsx';
import { GetCompositeResourcesUseCase } from '../../domain/usecases/GetCompositeResourcesUseCase.js';
import { GetCompositionsUseCase } from '../../domain/usecases/GetCompositionsUseCase.js';
import { GetCompositeResourceDefinitionsUseCase } from '../../domain/usecases/GetCompositeResourceDefinitionsUseCase.js';
import { getSyncedStatus, getReadyStatus, getResponsiveStatus } from '../utils/resourceStatus.js';

const normalizeResource = (resource, fallbackKind) => ({
  apiVersion: resource.apiVersion || 'apiextensions.crossplane.io/v1',
  kind: resource.kind || fallbackKind,
  name: resource.name,
  namespace: resource.namespace || null,
  plural: resource.plural || null,
});

export const CompositeResourceKind = () => {
  const { kind } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { kubernetesRepository, selectedContext } = useAppContext();
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [navigationHistory, setNavigationHistory] = useState([]);
  const [syncedFilter, setSyncedFilter] = useState('all');
  const [readyFilter, setReadyFilter] = useState('all');
  const [responsiveFilter, setResponsiveFilter] = useState('all');
  const [useAutoHeight, setUseAutoHeight] = useState(false);
  const tableContainerRef = useRef(null);
  const selectedName = searchParams.get('name') || '';
  const selectedNamespace = searchParams.get('namespace') || '';

  const buildResourceSearchParams = (resource) => {
    const nextSearchParams = new URLSearchParams();
    if (resource?.name) {
      nextSearchParams.set('name', resource.name);
    }
    if (resource?.namespace && resource.namespace !== 'undefined') {
      nextSearchParams.set('namespace', resource.namespace);
    }
    return nextSearchParams;
  };

  const updateResourceSearchParams = (resource) => {
    setSearchParams(buildResourceSearchParams(resource));
  };

  const clearResourceSearchParams = () => {
    setSearchParams(new URLSearchParams());
  };

  // Close resource detail when route changes
  useEffect(() => {
    setSelectedResource(null);
    setNavigationHistory([]);
  }, [location.pathname]);

  useEffect(() => {
    const loadResources = async () => {
      if (!selectedContext || !kind) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const contextName = typeof selectedContext === 'string' ? selectedContext : selectedContext.name || selectedContext;
        
        let data = [];
        if (kind === 'Composition') {
          const useCase = new GetCompositionsUseCase(kubernetesRepository);
          const result = await useCase.execute(contextName);
          data = Array.isArray(result) ? result : [];
        } else if (kind === 'CompositeResourceDefinition') {
          const useCase = new GetCompositeResourceDefinitionsUseCase(kubernetesRepository);
          const result = await useCase.execute(contextName);
          data = Array.isArray(result) ? result : [];
        } else {
          // For other composite resource kinds, use GetCompositeResourcesUseCase
          const useCase = new GetCompositeResourcesUseCase(kubernetesRepository);
          const result = await useCase.execute(contextName);
          const allResources = Array.isArray(result) ? result : (result?.items || []);
          data = allResources.filter(r => r.kind === kind);
        }
        
        setResources(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, [selectedContext, kubernetesRepository, kind]);


  useEffect(() => {
    let filtered = resources;
    
    if (kind !== 'Composition' && kind !== 'CompositeResourceDefinition') {
      filtered = filtered.filter(r => {
        const syncedStatus = getSyncedStatus(r.conditions);
        const readyStatus = getReadyStatus(r.conditions);
        const responsiveStatus = getResponsiveStatus(r.conditions);
        
        if (syncedFilter !== 'all') {
          if (syncedFilter === 'synced' && syncedStatus?.text !== 'Synced') return false;
          if (syncedFilter === 'not-synced' && syncedStatus?.text !== 'Not Synced') return false;
          if (syncedFilter === 'none' && syncedStatus !== null) return false;
        }
        
        if (readyFilter !== 'all') {
          if (readyFilter === 'ready' && readyStatus?.text !== 'Ready') return false;
          if (readyFilter === 'not-ready' && readyStatus?.text !== 'Not Ready') return false;
          if (readyFilter === 'none' && readyStatus !== null) return false;
        }
        
        if (responsiveFilter !== 'all') {
          if (responsiveFilter === 'responsive' && responsiveStatus?.text !== 'Responsive') return false;
          if (responsiveFilter === 'not-responsive' && responsiveStatus?.text !== 'Not Responsive') return false;
          if (responsiveFilter === 'none' && responsiveStatus !== null) return false;
        }
        
        return true;
      });
    }
    
    setFilteredResources(filtered);
  }, [resources, syncedFilter, readyFilter, responsiveFilter, kind]);

  useEffect(() => {
    if (!selectedName) {
      setSelectedResource(null);
      setNavigationHistory([]);
      return;
    }

    const matchingResource = resources.find((resource) => {
      if (!resource || resource.kind !== kind || resource.name !== selectedName) {
        return false;
      }

      if (selectedNamespace) {
        return (resource.namespace || '') === selectedNamespace;
      }

      return true;
    });

    if (!matchingResource) {
      setSelectedResource(null);
      setNavigationHistory([]);
      return;
    }

    setNavigationHistory([]);
    setSelectedResource(normalizeResource(matchingResource, kind));
  }, [resources, kind, selectedName, selectedNamespace]);

  useEffect(() => {
    if (!selectedResource || !tableContainerRef.current) {
      setUseAutoHeight(false);
      return;
    }

    const checkTableHeight = () => {
      const container = tableContainerRef.current;
      if (!container) return;
      
      const viewportHeight = window.innerHeight;
      const halfViewport = (viewportHeight - 100) * 0.5; // Account for header
      const tableHeight = container.scrollHeight;
      
      setUseAutoHeight(tableHeight > halfViewport);
    };

    // Check immediately
    checkTableHeight();

    // Check on resize
    const resizeObserver = new ResizeObserver(checkTableHeight);
    resizeObserver.observe(tableContainerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [selectedResource, loading]);

  const renderStatusBadge = (status) => {
    if (!status) {
      return (
        <Text fontSize="xs" color="gray.500" _dark={{ color: 'gray.400' }}>
          -
        </Text>
      );
    }
    return (
      <Box
        as="span"
        display="inline-block"
        px={2}
        py={1}
        borderRadius="md"
        fontSize="xs"
        fontWeight="semibold"
        bg={`${status.color}.100`}
        _dark={{ bg: `${status.color}.800`, color: `${status.color}.100` }}
        color={`${status.color}.800`}
      >
        {status.text}
      </Box>
    );
  };

  const allStatusColumns = [
    {
      header: 'Synced',
      accessor: (row) => {
        if (!row || !row.conditions) return '-';
        const syncedStatus = getSyncedStatus(row.conditions);
        return syncedStatus?.text || '-';
      },
      minWidth: '120px',
      render: (row) => renderStatusBadge(row?.conditions ? getSyncedStatus(row.conditions) : null),
      statusType: 'synced',
    },
    {
      header: 'Ready',
      accessor: (row) => {
        if (!row || !row.conditions) return '-';
        const readyStatus = getReadyStatus(row.conditions);
        return readyStatus?.text || '-';
      },
      minWidth: '120px',
      render: (row) => renderStatusBadge(row?.conditions ? getReadyStatus(row.conditions) : null),
      statusType: 'ready',
    },
    {
      header: 'Responsive',
      accessor: (row) => {
        if (!row || !row.conditions) return '-';
        const responsiveStatus = getResponsiveStatus(row.conditions);
        return responsiveStatus?.text || '-';
      },
      minWidth: '120px',
      render: (row) => renderStatusBadge(row?.conditions ? getResponsiveStatus(row.conditions) : null),
      statusType: 'responsive',
    },
  ];

  const columns = useMemo(() => {
    if (kind === 'Composition') {
      return [
        {
          header: 'Name',
          accessor: 'name',
          minWidth: '200px',
        },
        {
          header: 'Composite Type',
          accessor: 'compositeTypeRef',
          minWidth: '250px',
          render: (row) => {
            if (row.compositeTypeRef) {
              return `${row.compositeTypeRef.apiVersion}/${row.compositeTypeRef.kind}`;
            }
            return '-';
          },
        },
        {
          header: 'Resources',
          accessor: 'resources',
          minWidth: '100px',
          render: (row) => row.resources?.length || 0,
        },
        {
          header: 'Mode',
          accessor: 'mode',
          minWidth: '120px',
        },
        {
          header: 'Created',
          accessor: 'creationTimestamp',
          minWidth: '150px',
          render: (row) => row.creationTimestamp ? new Date(row.creationTimestamp).toLocaleString() : '-',
        },
      ];
    } else if (kind === 'CompositeResourceDefinition') {
      return [
        {
          header: 'Name',
          accessor: 'name',
          minWidth: '200px',
        },
        {
          header: 'Group',
          accessor: 'group',
          minWidth: '200px',
        },
        {
          header: 'Kind',
          accessor: 'names',
          minWidth: '150px',
          render: (row) => row.names?.kind || '-',
        },
        {
          header: 'Created',
          accessor: 'creationTimestamp',
          minWidth: '150px',
          render: (row) => row.creationTimestamp ? new Date(row.creationTimestamp).toLocaleString() : '-',
        },
      ];
    } else {
      const allColumns = [
        {
          header: 'Name',
          accessor: 'name',
          minWidth: '200px',
        },
        {
          header: 'Kind',
          accessor: 'kind',
          minWidth: '200px',
        },
        ...allStatusColumns,
        {
          header: 'Created',
          accessor: 'creationTimestamp',
          minWidth: '150px',
          render: (row) => row.creationTimestamp ? new Date(row.creationTimestamp).toLocaleString() : '-',
        },
      ];

      if (filteredResources.length === 0) {
        return allColumns;
      }

      return allColumns.filter(column => {
        if (!column.statusType) {
          return true;
        }

        const hasData = filteredResources.some(row => {
          if (!row || !row.conditions || !Array.isArray(row.conditions)) return false;
          if (column.statusType === 'synced') {
            return row.conditions.some(c => c.type === 'Synced');
          }
          if (column.statusType === 'ready') {
            return row.conditions.some(c => c.type === 'Ready');
          }
          if (column.statusType === 'responsive') {
            return row.conditions.some(c => c.type === 'Responsive');
          }
          return false;
        });

        return hasData;
      });
    }
  }, [kind, filteredResources]);

  if (loading) {
    return <LoadingSpinner message={`Loading ${kind}...`} />;
  }

  if (error) {
    return (
      <Box>
        <Text fontSize="2xl" fontWeight="bold" mb={6}>{kind}</Text>
        <Box
          p={6}
          bg="red.50"
          _dark={{ bg: 'red.900', borderColor: 'red.700', color: 'red.100' }}
          border="1px"
          borderColor="red.200"
          borderRadius="md"
          color="red.800"
        >
          <Text fontWeight="bold" mb={2}>Error loading {kind}</Text>
          <Text>{error}</Text>
        </Box>
      </Box>
    );
  }

  const handleRowClick = (item) => {
    const clickedResource = normalizeResource(item, kind);

    if (selectedResource && 
        selectedResource.name === clickedResource.name &&
        selectedResource.kind === clickedResource.kind &&
        selectedResource.apiVersion === clickedResource.apiVersion &&
        selectedResource.namespace === clickedResource.namespace &&
        selectedResource.plural === clickedResource.plural) {
      setSelectedResource(null);
      setNavigationHistory([]);
      clearResourceSearchParams();
      return;
    }

    // Clear navigation history when opening from table (not from another resource)
    setNavigationHistory([]);
    setSelectedResource(clickedResource);
    updateResourceSearchParams(clickedResource);
  };

  const handleNavigate = (resource) => {
    const normalizedResource = normalizeResource(resource, kind);

    if (normalizedResource.kind !== kind && normalizedResource.kind?.startsWith('X')) {
      const nextSearchParams = buildResourceSearchParams(normalizedResource);
      navigate({
        pathname: `/composite-resources/${normalizedResource.kind}`,
        search: `?${nextSearchParams.toString()}`,
      });
      return;
    }

    setNavigationHistory(prev => [...prev, selectedResource]);
    setSelectedResource(normalizedResource);

    if (normalizedResource.kind === kind) {
      updateResourceSearchParams(normalizedResource);
    }
  };

  const handleBack = () => {
    if (navigationHistory.length > 0) {
      const previous = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(prev => prev.slice(0, -1));
      setSelectedResource(previous);

      if (previous) {
        updateResourceSearchParams(previous);
      }
    } else {
      setSelectedResource(null);
      clearResourceSearchParams();
    }
  };

  const handleClose = () => {
    setSelectedResource(null);
    setNavigationHistory([]);
    clearResourceSearchParams();
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      position="relative"
    >
      <Text fontSize="2xl" fontWeight="bold" mb={6}>{kind}</Text>

      <Box
        display="flex"
        flexDirection="column"
        gap={4}
      >
        <Box
          ref={tableContainerRef}
          flex={selectedResource ? (useAutoHeight ? '0 0 50%' : '0 0 auto') : '1'}
          display="flex"
          flexDirection="column"
          minH={0}
          maxH={selectedResource && useAutoHeight ? '50vh' : 'none'}
          overflowY={selectedResource && useAutoHeight ? 'auto' : 'visible'}
        >
          <DataTable
              data={filteredResources}
              columns={columns}
              searchableFields={['name']}
              itemsPerPage={20}
              onRowClick={handleRowClick}
              filters={
                kind !== 'Composition' && kind !== 'CompositeResourceDefinition' ? (
                  <>
                    {columns.some(col => col.header === 'Synced') && (
                      <Dropdown
                        minW="140px"
                        placeholder="All Synced"
                        value={syncedFilter}
                        onChange={setSyncedFilter}
                        options={[
                          { value: 'all', label: 'All Synced' },
                          { value: 'synced', label: 'Synced' },
                          { value: 'not-synced', label: 'Not Synced' },
                          { value: 'none', label: 'No Synced Status' }
                        ]}
                      />
                    )}
                    {columns.some(col => col.header === 'Ready') && (
                      <Dropdown
                        minW="140px"
                        placeholder="All Ready"
                        value={readyFilter}
                        onChange={setReadyFilter}
                        options={[
                          { value: 'all', label: 'All Ready' },
                          { value: 'ready', label: 'Ready' },
                          { value: 'not-ready', label: 'Not Ready' },
                          { value: 'none', label: 'No Ready Status' }
                        ]}
                      />
                    )}
                    {columns.some(col => col.header === 'Responsive') && (
                      <Dropdown
                        minW="140px"
                        placeholder="All Responsive"
                        value={responsiveFilter}
                        onChange={setResponsiveFilter}
                        options={[
                          { value: 'all', label: 'All Responsive' },
                          { value: 'responsive', label: 'Responsive' },
                          { value: 'not-responsive', label: 'Not Responsive' },
                          { value: 'none', label: 'No Responsive Status' }
                        ]}
                      />
                    )}
                  </>
                ) : undefined
              }
            />
        </Box>
        
        {selectedResource && (
          <Box
            flex="1"
            display="flex"
            flexDirection="column"
            mb={8}
          >
            <ResourceDetails
                resource={selectedResource}
                onClose={handleClose}
                onNavigate={handleNavigate}
                onBack={navigationHistory.length > 0 ? handleBack : undefined}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};
