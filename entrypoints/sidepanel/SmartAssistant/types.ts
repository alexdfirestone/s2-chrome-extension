export interface Metadata {
    parent_name: string | null;
    last_saved: string | null;
    product?: string | string[];
    role?: string | string[];
    frequency?: string;
    status?: string;
  }
  
  export interface ResultItem {
    id: string;
    title: string;
    content: string;
    score: number;
    rank: number;
    metadata: Metadata;
    answer_block: any;
  }

  interface SelectedChip {
    id: string;
    content: string;
    answer_block: any;
    metadata: {
      parent_name: string;
      last_saved?: string;
    };
    score: number;
  }
  
  export type AnswerGenerationModel = "o1-preview" | "o1-mini" | "gpt-4o" | "gpt-4o-mini" | "claude-3-5-sonnet-20241022" | "o1-preview";

  export type TablePrompt = "getTable2SystemPrompt"; // Add more table prompts as needed
  export type TextPrompt = "getText2UserPrompt" | "getText3UserPrompt" | "getText4UserPrompt"; // Add more text prompts as needed


  export interface PromptOption {
    table: TablePrompt; // Type for table options
    text: TextPrompt;   // Type for text options
  }

  export interface ModelOption {
    id: number
    value: AnswerGenerationModel;
    label: string;
    caption: string;
    prompt: PromptOption
  }



  export interface SimilaritySearchResponse {
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
  
  export interface SimilaritySearchRequest {
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