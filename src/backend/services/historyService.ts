import { LoanApplication, PredictionResult, LoanHistoryItem } from './loanPredictor';

export class HistoryService {
  private static readonly STORAGE_KEY = 'loan_application_history';
  
  static saveToHistory(application: LoanApplication, result: PredictionResult): LoanHistoryItem {
    const historyItem: LoanHistoryItem = {
      id: this.generateId(),
      applicantName: application.applicantName,
      application,
      result,
      timestamp: new Date()
    };
    
    const history = this.getHistory();
    history.unshift(historyItem); // Add to beginning of array
    
    // Keep only last 50 entries
    if (history.length > 50) {
      history.splice(50);
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    console.log('Saved to history:', historyItem);
    
    return historyItem;
  }
  
  static getHistory(): LoanHistoryItem[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      // Convert timestamp strings back to Date objects
      return parsed.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }));
    } catch (error) {
      console.error('Error loading history:', error);
      return [];
    }
  }
  
  static clearHistory(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    console.log('History cleared');
  }
  
  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
