
import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import LoanApplicationForm from './LoanApplicationForm';
import PredictionResults from './PredictionResults';
import LoanHistory from './LoanHistory';
import { LoanApplication, PredictionResult } from '../../backend/services/loanPredictor';
import { LoanApi } from '../../backend/api/loanApi';
import { HistoryService } from '../../backend/services/historyService';
import { Button } from '@/components/ui/button';
import { History, FileText } from 'lucide-react';

const LoanPredictor: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [currentApplication, setCurrentApplication] = useState<LoanApplication | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const handleApplicationSubmit = async (application: LoanApplication) => {
    console.log('Submitting loan application:', application);
    
    // Validate the application
    const validation = LoanApi.validateApplication(application);
    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: validation.errors.join(', '),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);
    setCurrentApplication(application);

    try {
      const predictionResult = await LoanApi.submitLoanApplication(application);
      setResult(predictionResult);
      
      // Save to history
      HistoryService.saveToHistory(application, predictionResult);
      
      toast({
        title: "Application Processed",
        description: predictionResult.approved 
          ? "Congratulations! Your loan has been approved." 
          : "We're sorry, but your loan application has been declined.",
        variant: predictionResult.approved ? "default" : "destructive",
      });
    } catch (error) {
      console.error('Error processing application:', error);
      toast({
        title: "Processing Error",
        description: "There was an error processing your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewApplication = () => {
    setResult(null);
    setCurrentApplication(null);
    setShowHistory(false);
  };

  const handleClearHistory = () => {
    toast({
      title: "History Cleared",
      description: "All application history has been cleared.",
    });
  };

  const toggleView = () => {
    setShowHistory(!showHistory);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Bank Loan Approval Predictor
          </h1>
          <p className="text-xl text-gray-600">
            Get instant loan approval predictions powered by advanced algorithms
          </p>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <Button 
            onClick={toggleView}
            variant={showHistory ? "default" : "outline"}
            className="flex items-center gap-2"
          >
            <History className="h-4 w-4" />
            {showHistory ? 'Hide History' : 'View History'}
          </Button>
          
          {(result || showHistory) && (
            <Button
              onClick={handleNewApplication}
              variant={!showHistory && !result ? "default" : "outline"}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              New Application
            </Button>
          )}
        </div>

        {showHistory ? (
          <LoanHistory onClearHistory={handleClearHistory} />
        ) : !result ? (
          <LoanApplicationForm 
            onSubmit={handleApplicationSubmit}
            isLoading={isLoading}
          />
        ) : (
          <div className="space-y-6">
            <PredictionResults result={result} />
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanPredictor;
