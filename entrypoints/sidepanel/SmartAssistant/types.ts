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
  
  
  export interface DemoQuestion {
    question: string;
    answers: ResultItem[];
  }