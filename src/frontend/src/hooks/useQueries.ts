import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

// Placeholder for future backend queries
export function useBackendData() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['backend-data'],
    queryFn: async () => {
      if (!actor) return null;
      // Backend queries will be added here when needed
      return null;
    },
    enabled: !!actor && !isFetching,
  });
}
