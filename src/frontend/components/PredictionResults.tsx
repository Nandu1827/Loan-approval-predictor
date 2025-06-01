import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { PredictionResult } from '../../backend/services/loanPredictor';

interface PredictionResultsProps {
  result: PredictionResult;
}

const PredictionResults: React.FC<PredictionResultsProps> = ({ result }) => {
  const getStatusIcon = () => {
    if (result.approved) {
      return <CheckCircle className="h-8 w-8 text-green-500" />;
    }
    return <XCircle className="h-8 w-8 text-red-500" />;
  };

  const getStatusColor = () => {
    return result.approved ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
  };

  const getRiskColor = () => {
    if (result.riskScore <= 30) return 'text-green-600';
    if (result.riskScore <= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskBadgeColor = () => {
    if (result.riskScore <= 30) return 'bg-green-100 text-green-800';
    if (result.riskScore <= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Main Result Card */}
      <Card className={`${getStatusColor()} border-2`}>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {getStatusIcon()}
          </div>
          <CardTitle className="text-2xl font-bold">
            {result.approved ? 'Loan Approved!' : 'Loan Application Declined'}
          </CardTitle>
          <p className="text-lg text-gray-600">
            Confidence: {result.confidence}%
          </p>
        </CardHeader>
      </Card>

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Risk Score</span>
              <Badge className={getRiskBadgeColor()}>
                {result.riskScore}/100
              </Badge>
            </div>
            <Progress value={result.riskScore} className="h-3" />
            <p className={`text-sm font-medium ${getRiskColor()}`}>
              {result.riskScore <= 30 && 'Low Risk - Excellent candidate'}
              {result.riskScore > 30 && result.riskScore <= 60 && 'Moderate Risk - Good candidate with some concerns'}
              {result.riskScore > 60 && 'High Risk - Significant concerns identified'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Factor Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Factor Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Income Score</span>
                  <span className="text-sm text-gray-600">{result.factors.income}/100</span>
                </div>
                <Progress value={result.factors.income} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Credit History</span>
                  <span className="text-sm text-gray-600">{result.factors.creditHistory}/100</span>
                </div>
                <Progress value={result.factors.creditHistory} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Loan-to-Income Ratio</span>
                  <span className="text-sm text-gray-600">{result.factors.loanToIncome}/100</span>
                </div>
                <Progress value={result.factors.loanToIncome} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium font-bold">Overall Score</span>
                  <span className="text-sm font-bold text-blue-600">{result.factors.overall}/100</span>
                </div>
                <Progress value={result.factors.overall} className="h-3" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {result.recommendations && result.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-gray-700">{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PredictionResults;
