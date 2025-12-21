/**
 * React Query type declarations
 */

declare module '@tanstack/react-query' {
  import {Component} from 'react';
  
  export interface UseQueryOptions<TData = any, TError = any> {
    queryKey: any[];
    queryFn: () => Promise<TData>;
    enabled?: boolean;
    refetchInterval?: number;
    retry?: number;
    staleTime?: number;
  }
  
  export interface UseQueryResult<TData = any, TError = any> {
    data: TData | undefined;
    isLoading: boolean;
    isError: boolean;
    error: TError | null;
    refetch: () => void;
    isRefetching: boolean;
  }
  
  export interface UseMutationOptions<TData = any, TError = any, TVariables = any> {
    mutationFn: (variables: TVariables) => Promise<TData>;
    onSuccess?: (data: TData) => void;
    onError?: (error: TError) => void;
  }
  
  export interface UseMutationResult<TData = any, TError = any, TVariables = any> {
    mutate: (variables: TVariables) => void;
    isPending: boolean;
    isError: boolean;
    error: TError | null;
  }
  
  export function useQuery<TData = any, TError = any>(
    options: UseQueryOptions<TData, TError>
  ): UseQueryResult<TData, TError>;
  
  export function useMutation<TData = any, TError = any, TVariables = any>(
    options: UseMutationOptions<TData, TError, TVariables>
  ): UseMutationResult<TData, TError, TVariables>;
  
  export function useQueryClient(): {
    invalidateQueries: (options: {queryKey: any[]}) => void;
  };
  
  export class QueryClient {
    constructor(options?: any);
  }
  
  export class QueryClientProvider extends Component<{client: QueryClient; children?: any}> {}
}


