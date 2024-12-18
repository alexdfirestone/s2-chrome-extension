// services/api.ts
import { authService, AuthState } from '../../authService';
import { ResultItem } from '../types';

interface QueryResponse {
    results: ResultItem[];
  }
  
  interface GenerateAnswerResponse {
    answer: string;
  }
  
  interface SimilaritySearchResponse {
    pageContent: string;
    metadata: {
      embedding_id: string;
      question_id: string;
      type: string;
      tenant_id: string;
      product: string[];
      role: string[];
      frequency: string | null;
      status: string | null;
      parent_name: string | null;
      last_saved: string | null;
    };
    score: number;
    rank: number;
    questionData: {
      question_id: string;
      text: string;
      answer: string | null;
      answer_block: {
        time: number;
        blocks: Array<{
          id: string;
          data: { text: string };
          type: string;
        }>;
        version: string;
      };
      // ... other questionData fields can be added as needed
    };
  }
  
  interface SimilaritySearchRequest {
    contentToSearch: string;
    k: number;
    offset: number;
    returnAnswer: boolean;
    contentType: string;
    metadata: {
      product_filter: string | null;
      role_filter: string | null;
      frequency_filter: string | null;
      status_filter: string | null;
    };
    searchType: string;
  }
  
  export class AIPromptService {
    private baseUrl: string;
  
    constructor(baseUrl: string = import.meta.env.VITE_ADVISER_GPT_URL || 'https://advisergpt.ai') {
      this.baseUrl = baseUrl;
    }
  
    private async getAuthHeaders(): Promise<HeadersInit> {
      const authState: AuthState = await authService.checkAuthStatus();
      
      if (!authState.isAuthenticated || !authState.user?.access_token) {
        throw new Error('User is not authenticated');
      }
      
      return {
        'Content-Type': 'application/json',
        'access_token': `${authState.user.access_token}`,
        'refresh_token': `${authState.user.refresh_token}`,
      };
    }
  
    async searchSimilar(params: Partial<SimilaritySearchRequest>): Promise<SimilaritySearchResponse[]> {
      try {
        const headers = await this.getAuthHeaders();
        
        const requestBody: SimilaritySearchRequest = {
          contentToSearch: params.contentToSearch || 'default query',
          k: params.k || 5,
          offset: params.offset || 0,
          returnAnswer: params.returnAnswer ?? true,
          contentType: params.contentType || 'BOTH',
          metadata: {
            product_filter: params.metadata?.product_filter ?? null,
            role_filter: params.metadata?.role_filter ?? null,
            frequency_filter: params.metadata?.frequency_filter ?? null,
            status_filter: params.metadata?.status_filter ?? null,
          },
          searchType: params.searchType || 'HYBRID',
        };
  
        const response = await fetch(`${this.baseUrl}/api/rfp/searchHybrid`, {
          method: 'POST',
          headers,
          body: JSON.stringify(requestBody),
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }
  
        const data = await response.json();
        return data.map((item: any, index: number) => ({
          ...item,
          rank: item.rank ?? index,
          metadata: {
            ...item.metadata,
            parent_name: item.metadata?.parent_name ?? null,
            last_saved: item.metadata?.last_saved ?? null,
          }
        }));
      } catch (error) {
        console.error('Error in similarity search:', error);
        throw error;
      }
    }
  
    async queryAI(question: string): Promise<QueryResponse> {
      try {
        const response = await fetch(`${this.baseUrl}/query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ question }),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        return await response.json();
      } catch (error) {
        console.error('Error querying AI:', error);
        throw error;
      }
    }
  
    async generateAnswer(selectedTopics: string[]): Promise<GenerateAnswerResponse> {
      try {
        const response = await fetch(`${this.baseUrl}/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ topics: selectedTopics }),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        return await response.json();
      } catch (error) {
        console.error('Error generating answer:', error);
        throw error;
      }
    }
  
    async loadMoreResponses(params: {
      searchQuery: string;
      currentBatch: number;
      searchMetadata?: {
        product?: string | null;
        role?: string | null;
        frequency?: string | null;
        status?: string | null;
      };
    }): Promise<SimilaritySearchResponse[]> {
      try {
        const headers = await this.getAuthHeaders();
        
        const requestBody: SimilaritySearchRequest = {
          contentToSearch: params.searchQuery.trim() !== "" ? params.searchQuery : "default query",
          k: 5,
          offset: params.currentBatch * 5,
          returnAnswer: true,
          contentType: "BOTH",
          metadata: {
            product_filter: params.searchMetadata?.product ?? null,
            role_filter: params.searchMetadata?.role ?? null,
            frequency_filter: params.searchMetadata?.frequency ?? null,
            status_filter: params.searchMetadata?.status ?? null,
          },
          searchType: "HYBRID",
        };

        const response = await fetch(`${this.baseUrl}/api/rfp/searchHybrid`, {
          method: 'POST',
          headers,
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const startRank = params.currentBatch * 5;
        
        return data.map((item: any, index: number) => ({
          ...item,
          rank: item.rank ?? (startRank + index),
          metadata: {
            ...item.metadata,
            parent_name: item.metadata?.parent_name ?? null,
            last_saved: item.metadata?.last_saved ?? null,
          }
        }));
      } catch (error) {
        console.error('Error loading more responses:', error);
        throw error;
      }
    }
  }