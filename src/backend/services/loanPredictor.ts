export interface LoanApplication {
  applicantName: string;
  applicantIncome: number;
  coapplicantIncome: number;
  loanAmount: number;
  loanTerm: number; // in months
  creditHistory: number; // 1 for good, 0 for poor
  dependents: number;
  education: 'Graduate' | 'Not Graduate';
  selfEmployed: 'Yes' | 'No';
  propertyArea: 'Urban' | 'Semiurban' | 'Rural';
  maritalStatus: 'Married' | 'Single';
}

export interface PredictionResult {
  approved: boolean;
  confidence: number;
  riskScore: number;
  factors: {
    income: number;
    creditHistory: number;
    loanToIncome: number;
    overall: number;
  };
  recommendations?: string[];
}

export interface LoanHistoryItem {
  id: string;
  applicantName: string;
  application: LoanApplication;
  result: PredictionResult;
  timestamp: Date;
}

export class LoanPredictor {
  // Simplified ML-inspired prediction logic
  static predict(application: LoanApplication): PredictionResult {
    console.log('Processing loan application:', application);
    
    const totalIncome = application.applicantIncome + application.coapplicantIncome;
    const monthlyIncome = totalIncome / 12;
    const loanToIncomeRatio = application.loanAmount / totalIncome;
    const monthlyEMI = this.calculateEMI(application.loanAmount, application.loanTerm);
    const emiToIncomeRatio = monthlyEMI / monthlyIncome;
    
    // Factor calculations (0-100 scale)
    const incomeScore = Math.min(100, (totalIncome / 100000) * 100);
    const creditScore = application.creditHistory * 100;
    const loanToIncomeScore = Math.max(0, 100 - (loanToIncomeRatio * 200));
    const emiAffordabilityScore = Math.max(0, 100 - (emiToIncomeRatio * 200));
    
    // Education and employment bonus
    const educationBonus = application.education === 'Graduate' ? 10 : 0;
    const employmentBonus = application.selfEmployed === 'No' ? 10 : 5;
    
    // Property area impact
    const propertyAreaScore = {
      'Urban': 10,
      'Semiurban': 5,
      'Rural': 0
    }[application.propertyArea];
    
    // Dependents penalty
    const dependentsPenalty = application.dependents * 5;
    
    // Overall score calculation
    const overallScore = Math.max(0, Math.min(100, 
      (incomeScore * 0.3) +
      (creditScore * 0.25) +
      (loanToIncomeScore * 0.2) +
      (emiAffordabilityScore * 0.15) +
      educationBonus +
      employmentBonus +
      propertyAreaScore -
      dependentsPenalty
    ));
    
    const approved = overallScore >= 60;
    const confidence = Math.min(95, Math.max(55, overallScore + (Math.random() * 10 - 5)));
    const riskScore = 100 - overallScore;
    
    const recommendations = this.generateRecommendations(application, overallScore);
    
    return {
      approved,
      confidence: Math.round(confidence),
      riskScore: Math.round(riskScore),
      factors: {
        income: Math.round(incomeScore),
        creditHistory: Math.round(creditScore),
        loanToIncome: Math.round(loanToIncomeScore),
        overall: Math.round(overallScore)
      },
      recommendations
    };
  }
  
  private static calculateEMI(loanAmount: number, termMonths: number, rate: number = 8.5): number {
    const monthlyRate = rate / (12 * 100);
    const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                (Math.pow(1 + monthlyRate, termMonths) - 1);
    return emi;
  }
  
  private static generateRecommendations(app: LoanApplication, score: number): string[] {
    const recommendations: string[] = [];
    
    if (score < 60) {
      if (app.creditHistory === 0) {
        recommendations.push("Improve your credit history by paying bills on time");
      }
      if (app.applicantIncome < 50000) {
        recommendations.push("Consider increasing your income or adding a co-applicant");
      }
      if (app.loanAmount / (app.applicantIncome + app.coapplicantIncome) > 3) {
        recommendations.push("Consider reducing the loan amount");
      }
    } else {
      recommendations.push("Your application looks strong!");
      if (score > 80) {
        recommendations.push("You may qualify for better interest rates");
      }
    }
    
    return recommendations;
  }
}
