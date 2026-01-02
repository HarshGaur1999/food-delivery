/**
 * Error Logger Utility
 * Provides intelligent error logging with deduplication and throttling
 * to prevent console spam from repeated network errors
 */

interface ErrorLogEntry {
  key: string;
  count: number;
  firstOccurrence: number;
  lastOccurrence: number;
}

class ErrorLogger {
  private errorCache: Map<string, ErrorLogEntry> = new Map();
  private readonly THROTTLE_MS = 5000; // Only log same error once per 5 seconds
  private readonly MAX_CACHE_SIZE = 50;
  private readonly isDev = __DEV__;

  /**
   * Generate a unique key for an error to detect duplicates
   */
  private getErrorKey(error: any, url?: string): string {
    const method = error.config?.method?.toUpperCase() || 'UNKNOWN';
    const errorCode = error.code || 'NO_CODE';
    const status = error.response?.status || 'NO_STATUS';
    const errorUrl = url || error.config?.url || 'UNKNOWN_URL';
    
    // Network errors are considered duplicates if same URL and error code
    if (errorCode === 'ERR_NETWORK' || errorCode === 'ECONNABORTED') {
      return `${method}_${errorCode}_${errorUrl}`;
    }
    
    // HTTP errors are duplicates if same status and URL
    return `${method}_${status}_${errorUrl}`;
  }

  /**
   * Check if error should be logged (throttling logic)
   */
  private shouldLogError(key: string): boolean {
    const now = Date.now();
    const entry = this.errorCache.get(key);

    if (!entry) {
      // First time seeing this error
      this.errorCache.set(key, {
        key,
        count: 1,
        firstOccurrence: now,
        lastOccurrence: now,
      });
      this.cleanupCache();
      return true;
    }

    // Update entry
    entry.count++;
    const timeSinceLastLog = now - entry.lastOccurrence;

    if (timeSinceLastLog >= this.THROTTLE_MS) {
      // Enough time has passed, log again
      entry.lastOccurrence = now;
      return true;
    }

    // Too soon, skip logging
    return false;
  }

  /**
   * Clean up old cache entries to prevent memory leaks
   */
  private cleanupCache(): void {
    if (this.errorCache.size <= this.MAX_CACHE_SIZE) {
      return;
    }

    // Remove oldest entries
    const entries = Array.from(this.errorCache.entries());
    entries.sort((a, b) => a[1].lastOccurrence - b[1].lastOccurrence);
    
    const toRemove = entries.slice(0, entries.length - this.MAX_CACHE_SIZE);
    toRemove.forEach(([key]) => this.errorCache.delete(key));
  }

  /**
   * Log API error in a consolidated, structured format
   */
  logApiError(error: any, context?: { url?: string; baseURL?: string }): void {
    const fullUrl = context?.url || 
      (error.config ? `${error.config.baseURL}${error.config.url}` : 'Unknown URL');
    const errorKey = this.getErrorKey(error, fullUrl);
    const entry = this.errorCache.get(errorKey);

    // Check if we should log this error
    if (!this.shouldLogError(errorKey)) {
      // Silently update count, don't log
      return;
    }

    // Build consolidated error object
    const errorInfo: any = {
      method: error.config?.method?.toUpperCase() || 'UNKNOWN',
      url: fullUrl,
      errorCode: error.code,
      errorName: error.name,
      errorMessage: error.message,
    };

    if (error.response) {
      // HTTP error response
      errorInfo.status = error.response.status;
      errorInfo.statusText = error.response.statusText;
      if (this.isDev && error.response.data) {
        errorInfo.responseData = error.response.data;
      }
    } else if (error.request) {
      // Network error (no response)
      errorInfo.type = 'Network Error';
      errorInfo.details = {
        timeout: context?.baseURL ? undefined : error.config?.timeout,
        baseURL: context?.baseURL || error.config?.baseURL,
      };
      
      if (this.isDev) {
        errorInfo.possibleCauses = [
          'Backend server not running',
          'Wrong IP address/URL in API_CONFIG',
          'Device not on same network as backend',
          'Firewall blocking connection',
          'Timeout exceeded',
        ];
      }
    }

    // Add retry count if available
    if (entry && entry.count > 1) {
      errorInfo.retryCount = entry.count;
      errorInfo.note = `This error occurred ${entry.count} times (throttled logging)`;
    }

    // Log in a single, structured format
    if (this.isDev) {
      console.error('❌ [API Error]', JSON.stringify(errorInfo, null, 2));
    } else {
      // Production: Only log essential info
      console.error('❌ [API Error]', {
        method: errorInfo.method,
        url: errorInfo.url,
        status: errorInfo.status || errorInfo.type,
        retryCount: errorInfo.retryCount || 1,
      });
    }
  }

  /**
   * Clear error cache (useful for testing or reset)
   */
  clearCache(): void {
    this.errorCache.clear();
  }

  /**
   * Get error statistics (useful for debugging)
   */
  getErrorStats(): Record<string, number> {
    const stats: Record<string, number> = {};
    this.errorCache.forEach((entry) => {
      stats[entry.key] = entry.count;
    });
    return stats;
  }
}

// Export singleton instance
export const errorLogger = new ErrorLogger();

