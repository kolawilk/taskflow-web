/**
 * Taskflow API Client Service
 * Wraps fetch calls to the Taskflow backend at http://localhost:3001
 */

// =============================================================================
// Type Definitions (matching API response from server.ts)
// =============================================================================

/**
 * Generic API response wrapper from server
 */
interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
}

/**
 * Project type matching the database schema (API response)
 */
export interface Project {
  id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

/**
 * Feature type matching the database schema (API response)
 */
export interface Feature {
  id: string
  project_id: string
  title: string
  description: string | null
  created_at: string
  updated_at: string
}

/**
 * Task type matching the database schema (API response)
 */
export interface Task {
  id: string
  feature_id: string
  title: string
  description: string
  acceptance_criteria: string
  stage: string
  assigned_agent: string | null
  priority: string | null
  iteration: number
  branch: string
  feature_branch: string
  feature_title: string
  created_at: string
  updated_at: string
}

/**
 * Task history entry (API response)
 */
export interface TaskHistoryEntry {
  id: string
  task_id: string
  action: string
  agent: string | null
  message: string
  timestamp: string
}

/**
 * Inbox item (API response)
 */
export interface InboxItem {
  id: string
  title: string
  description: string
  status: string
  created_at: string
  updated_at: string
  [key: string]: unknown
}

/**
 * API result with loading state (for React state management)
 */
export interface ApiResult<T> {
  data: T | null
  isLoading: boolean
  error: string | null
}

// =============================================================================
// Configuration
// =============================================================================

// Use Vite environment variable or fallback to localhost
const BASE_URL = (import.meta as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL || 'http://localhost:3001'

// =============================================================================
// API Client Class
// =============================================================================

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl
    console.log(`[ApiClient] Initialized with base URL: ${this.baseUrl}`)
  }

  /**
   * Generic fetch wrapper with comprehensive error handling
   */
  private async fetch<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResult<T>> {
    const url = `${this.baseUrl}${endpoint}`
    console.log(`[ApiClient] ${options?.method || 'GET'} ${url}`)

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      })

      console.log(`[ApiClient] Response status: ${response.status}`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || `HTTP error ${response.status}`
        console.error(`[ApiClient] Error: ${errorMessage}`)
        return {
          data: null,
          isLoading: false,
          error: errorMessage,
        }
      }

      const result: ApiResponse<T> = await response.json()

      if (!result.success) {
        const apiError = result.error || 'Unknown error occurred'
        console.error(`[ApiClient] API error: ${apiError}`)
        return {
          data: null,
          isLoading: false,
          error: apiError,
        }
      }

      console.log(`[ApiClient] Success: received ${Array.isArray(result.data) ? result.data.length : 1} item(s)`)

      return {
        data: result.data,
        isLoading: false,
        error: null,
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Unable to connect to the server. Please check your connection.'
      console.error(`[ApiClient] Network error:`, error)
      return {
        data: null,
        isLoading: false,
        error: errMsg,
      }
    }
  }

  // ===========================================================================
  // API Methods
  // ===========================================================================

  /**
   * Get all projects
   * @returns Promise with projects array, loading state, and error message
   */
  async getProjects(): Promise<ApiResult<Project[]>> {
    console.log('[ApiClient] Fetching all projects')
    return this.fetch<Project[]>('/api/projects')
  }

  /**
   * Get features by project ID
   * @param projectId - The project ID to fetch features for
   * @returns Promise with features array, loading state, and error message
   */
  async getFeaturesByProject(projectId: string): Promise<ApiResult<Feature[]>> {
    console.log(`[ApiClient] Fetching features for project: ${projectId}`)
    if (!projectId) {
      return {
        data: null,
        isLoading: false,
        error: 'Project ID is required',
      }
    }
    return this.fetch<Feature[]>(`/api/projects/${encodeURIComponent(projectId)}/features`)
  }

  /**
   * Get tasks by feature ID
   * @param featureId - The feature ID to fetch tasks for
   * @returns Promise with tasks array, loading state, and error message
   */
  async getTasksByFeature(featureId: string): Promise<ApiResult<Task[]>> {
    console.log(`[ApiClient] Fetching tasks for feature: ${featureId}`)
    if (!featureId) {
      return {
        data: null,
        isLoading: false,
        error: 'Feature ID is required',
      }
    }
    return this.fetch<Task[]>(`/api/features/${encodeURIComponent(featureId)}/tasks`)
  }

  /**
   * Get a single feature by ID
   * @param featureId - The feature ID to fetch
   * @returns Promise with feature or null, loading state, and error message
   */
  async getFeatureById(featureId: string): Promise<ApiResult<Feature | null>> {
    console.log(`[ApiClient] Fetching feature: ${featureId}`)
    if (!featureId) {
      return {
        data: null,
        isLoading: false,
        error: 'Feature ID is required',
      }
    }
    return this.fetch<Feature | null>(`/api/features/${encodeURIComponent(featureId)}`)
  }

  /**
   * Get a single task by ID
   * @param taskId - The task ID to fetch
   * @returns Promise with task or null, loading state, and error message
   */
  async getTaskById(taskId: string): Promise<ApiResult<Task | null>> {
    console.log(`[ApiClient] Fetching task: ${taskId}`)
    if (!taskId) {
      return {
        data: null,
        isLoading: false,
        error: 'Task ID is required',
      }
    }
    return this.fetch<Task | null>(`/api/tasks/${encodeURIComponent(taskId)}`)
  }

  /**
   * Get task history by task ID
   * @param taskId - The task ID to fetch history for
   * @returns Promise with history entries array, loading state, and error message
   */
  async getTaskHistory(taskId: string): Promise<ApiResult<TaskHistoryEntry[]>> {
    console.log(`[ApiClient] Fetching history for task: ${taskId}`)
    if (!taskId) {
      return {
        data: null,
        isLoading: false,
        error: 'Task ID is required',
      }
    }
    return this.fetch<TaskHistoryEntry[]>(`/api/tasks/${encodeURIComponent(taskId)}/history`)
  }

  /**
   * Get inbox items
   * @returns Promise with inbox items array, loading state, and error message
   */
  async getInboxItems(): Promise<ApiResult<InboxItem[]>> {
    console.log('[ApiClient] Fetching inbox items')
    return this.fetch<InboxItem[]>('/api/inbox')
  }
}

// =============================================================================
// Singleton Export
// =============================================================================

export const api = new ApiClient()

// Also export the class for custom instances (e.g., testing with different base URL)
export { ApiClient }
