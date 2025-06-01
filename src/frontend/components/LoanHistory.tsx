
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Calendar, User, DollarSign, Trash2 } from 'lucide-react';
import { LoanHistoryItem } from '../../backend/services/loanPredictor';
import { HistoryService } from '../../backend/services/historyService';

interface LoanHistoryProps {
  onClearHistory: () => void;
}

const LoanHistory: React.FC<LoanHistoryProps> = ({ onClearHistory }) => {
  const [history, setHistory] = React.useState<LoanHistoryItem[]>([]);

  React.useEffect(() => {
    const loadHistory = () => {
      const historyData = HistoryService.getHistory();
      setHistory(historyData);
    };
    
    loadHistory();
    
    // Listen for storage changes to update history in real-time
    const handleStorageChange = () => {
      loadHistory();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleClearHistory = () => {
    HistoryService.clearHistory();
    setHistory([]);
    onClearHistory();
  };

  if (history.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Application History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No loan applications in history yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Application History ({history.length})
          </CardTitle>
          <Button 
            onClick={handleClearHistory}
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear History
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.map((item) => (
            <Card key={item.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-semibold text-lg">{item.applicantName}</span>
                    </div>
                    <Badge 
                      className={item.result.approved 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                      }
                    >
                      {item.result.approved ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 mr-1" />
                      )}
                      {item.result.approved ? 'Approved' : 'Declined'}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(item.timestamp)}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span>Loan Amount: {formatCurrency(item.application.loanAmount)}</span>
                  </div>
                  <div>
                    <span>Income: {formatCurrency(item.application.applicantIncome)}</span>
                  </div>
                  <div>
                    <span>Confidence: {item.result.confidence}%</span>
                  </div>
                </div>
                
                <div className="mt-3 flex gap-4 text-xs text-gray-600">
                  <span>Risk Score: {item.result.riskScore}/100</span>
                  <span>Term: {item.application.loanTerm} months</span>
                  <span>Credit: {item.application.creditHistory ? 'Good' : 'Poor'}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LoanHistory;
