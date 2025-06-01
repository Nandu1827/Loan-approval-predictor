
import { LoanApplication, LoanPredictor, PredictionResult } from '../services/loanPredictor';

export class LoanApi {
  // Simulate API delay
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  static async submitLoanApplication(application: LoanApplication): Promise<PredictionResult> {
    console.log('API: Processing loan application...');
    
    // Simulate API processing time
    await this.delay(1500);
    
    try {
      const result = LoanPredictor.predict(application);
      console.log('API: Prediction completed:', result);
      return result;
    } catch (error) {
      console.error('API: Error processing application:', error);
      throw new Error('Failed to process loan application');
    }
  }
  
  static validateApplication(application: Partial<LoanApplication>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!application.applicantName || application.applicantName.trim().length === 0) {
      errors.push('Applicant name is required');
    }
    
    if (!application.applicantIncome || application.applicantIncome <= 0) {
      errors.push('Applicant income must be greater than 0');
    }
    
    if (!application.loanAmount || application.loanAmount <= 0) {
      errors.push('Loan amount must be greater than 0');
    }
    
    if (!application.loanTerm || application.loanTerm <= 0) {
      errors.push('Loan term must be greater than 0');
    }
    
    if (application.dependents === undefined || application.dependents < 0) {
      errors.push('Number of dependents must be 0 or greater');
    }
    
    if (application.creditHistory === undefined) {
      errors.push('Credit history is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
