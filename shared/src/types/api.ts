/**
 * @fileoverview API Types - Unified API response structures
 * @principle KISS - Simple, consistent API contracts
 */

// ==================== STANDARD API RESPONSES ====================

/**
 * Generic API response wrapper
 * Used for ALL API responses to maintain consistency
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  stack?: string; // Only in development
}

// ==================== PAGINATED RESPONSES ====================

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationMeta;
}

// ==================== FILTER & SEARCH ====================

export interface FilterParams {
  search?: string;
  status?: string;
  createdAfter?: string;
  createdBefore?: string;
  [key: string]: any;
}

export interface SearchParams extends PaginationParams, FilterParams {}

// ==================== BULK OPERATIONS ====================

export interface BulkOperationResult<T> {
  successful: T[];
  failed: Array<{
    item: T;
    error: string;
  }>;
  total: number;
  successCount: number;
  failureCount: number;
}

// ==================== FILE UPLOAD ====================

export interface FileUploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

// ==================== VALIDATION ====================

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ValidationErrorResponse extends ApiResponse {
  success: false;
  error: {
    code: 'VALIDATION_ERROR';
    message: string;
    details: {
      errors: ValidationError[];
    };
  };
}
