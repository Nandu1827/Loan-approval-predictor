
export class LoanCalculations {
  static calculateEMI(principal: number, rate: number, tenure: number): number {
    const monthlyRate = rate / (12 * 100);
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
                (Math.pow(1 + monthlyRate, tenure) - 1);
    return Math.round(emi);
  }
  
  static calculateTotalInterest(principal: number, rate: number, tenure: number): number {
    const emi = this.calculateEMI(principal, rate, tenure);
    return (emi * tenure) - principal;
  }
  
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  }
  
  static calculateAffordability(income: number, emi: number): {
    ratio: number;
    affordable: boolean;
    recommendation: string;
  } {
    const ratio = (emi / income) * 100;
    const affordable = ratio <= 40; // Standard 40% rule
    
    let recommendation = '';
    if (ratio <= 30) {
      recommendation = 'Excellent affordability';
    } else if (ratio <= 40) {
      recommendation = 'Good affordability';
    } else if (ratio <= 50) {
      recommendation = 'Moderate risk - consider reducing loan amount';
    } else {
      recommendation = 'High risk - loan amount too high for income';
    }
    
    return { ratio: Math.round(ratio), affordable, recommendation };
  }
}
