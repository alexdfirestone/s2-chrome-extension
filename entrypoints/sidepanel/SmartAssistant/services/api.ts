// services/api.ts
import { authService, AuthState } from '../../authService';
import { ResultItem } from '../types';
import { PromptOption } from '../types';
import { getTenantID } from '@/supabase/getTenant';
import { createSupabaseClient } from '@/supabase/client';
import { SimilaritySearchRequest, SimilaritySearchResponse } from '../types';
import { SupabaseAuthClient } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient';

  
  
  export class AIPromptService {
    private baseUrl: string;
    private supabase: any
    private tenantId?: string;
  
    constructor(baseUrl: string = import.meta.env.VITE_ADVISER_GPT_URL || 'https://advisergpt.ai') {
      this.baseUrl = baseUrl;
      this.initialize();
    }
  
    private async initialize() {
      this.supabase = createSupabaseClient()
      this.tenantId = await getTenantID(this.supabase);
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
  
    async generateAnswer(params: {
      rfp_id: string;
      question: string;
      similarResponses: string[];
      additionalContext: string;
      answerGenerationModel: string;
      responseType: string;
      answerGenerationSettings: any;
      prompt: PromptOption;
      currentAnswerBlock: any;
      isFollowUp: boolean;
    }): Promise<any> {
      try {
        console.log(params)
        const headers = await this.getAuthHeaders();
        const response = await fetch(`${this.baseUrl}/api/rfp/generate`, {
          method: 'POST',
          headers,
          body: JSON.stringify(params),
        });

        if (!response.ok) throw new Error('Failed to generate RFP response');
        console.log(response.body, 'response')

        return response.body?.getReader();
      } catch (error) {
        console.error("Error generating RFP response:", error);
        throw error;
      }
    }
  
    async modifyAnswer(params: {
      rfp_id: string;
      question: string;
      similarResponses: string[];
      additionalContext: string;
      answerGenerationModel: string;
      responseType: string;
      answerGenerationSettings: any;
      prompt: string;
      isFollowUp: boolean;
      currentContent: string;
      shortcutType: string;
      customPrompt?: string;
    }): Promise<any> {
      try {
        const headers = await this.getAuthHeaders();
        const response = await fetch(`${this.baseUrl}/api/rfp/generate`, {
          method: 'POST',
          headers,
          body: JSON.stringify(params),
        });

        if (!response.ok) throw new Error('Failed to generate RFP response');
        return response.body?.getReader();
      } catch (error) {
        console.error('Error modifying answer:', error);
        throw error;
      }
    }
  
    async createQuestion(questionText: string): Promise<any> {
      try {
        this.tenantId = await getTenantID(this.supabase);
        const headers = await this.getAuthHeaders();
        const response = await fetch(`${this.baseUrl}/api/rfp/questions`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            action: 'CREATE',
            data: {
              text: questionText,
              tenant_id: this.tenantId
            }
          }),
        });

        if (!response.ok) throw new Error('Failed to create question');
        return response.json();
      } catch (error) {
        console.error('Error creating question:', error);
        throw error;
      }
    }
  }