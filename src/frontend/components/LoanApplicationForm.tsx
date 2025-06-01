import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, DollarSign, User, Home, GraduationCap } from 'lucide-react';
import { LoanApplication } from '../../backend/services/loanPredictor';

interface LoanApplicationFormProps {
  onSubmit: (application: LoanApplication) => void;
  isLoading?: boolean;
}

const LoanApplicationForm: React.FC<LoanApplicationFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<Partial<LoanApplication>>({
    applicantName: '',
    applicantIncome: undefined,
    coapplicantIncome: 0,
    loanAmount: undefined,
    loanTerm: 240,
    creditHistory: undefined,
    dependents: 0,
    education: undefined,
    selfEmployed: undefined,
    propertyArea: undefined,
    maritalStatus: undefined,
  });

  const handleInputChange = (field: keyof LoanApplication, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onSubmit(formData as LoanApplication);
    }
  };

  const isFormValid = () => {
    return formData.applicantName &&
           formData.applicantName.trim().length > 0 &&
           formData.applicantIncome && 
           formData.loanAmount && 
           formData.loanTerm &&
           formData.creditHistory !== undefined &&
           formData.education &&
           formData.selfEmployed &&
           formData.propertyArea &&
           formData.maritalStatus;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
          <DollarSign className="h-6 w-6" />
          Loan Application Form
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-blue-700">
              <User className="h-5 w-5" />
              Personal Information
            </h3>
            
            <div>
              <Label htmlFor="applicantName">Full Name</Label>
              <Input
                id="applicantName"
                type="text"
                placeholder="John Doe"
                value={formData.applicantName || ''}
                onChange={(e) => handleInputChange('applicantName', e.target.value)}
                className="mt-1"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="applicantIncome">Monthly Income (₹)</Label>
                <Input
                  id="applicantIncome"
                  type="number"
                  placeholder="50,000"
                  value={formData.applicantIncome || ''}
                  onChange={(e) => handleInputChange('applicantIncome', Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="coapplicantIncome">Co-applicant Income (₹)</Label>
                <Input
                  id="coapplicantIncome"
                  type="number"
                  placeholder="0"
                  value={formData.coapplicantIncome || ''}
                  onChange={(e) => handleInputChange('coapplicantIncome', Number(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Marital Status</Label>
                <Select onValueChange={(value) => handleInputChange('maritalStatus', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Married">Married</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="dependents">Number of Dependents</Label>
                <Input
                  id="dependents"
                  type="number"
                  min="0"
                  max="10"
                  value={formData.dependents || ''}
                  onChange={(e) => handleInputChange('dependents', Number(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Education & Employment */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-blue-700">
              <GraduationCap className="h-5 w-5" />
              Education & Employment
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Education</Label>
                <Select onValueChange={(value) => handleInputChange('education', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select education" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Graduate">Graduate</SelectItem>
                    <SelectItem value="Not Graduate">Not Graduate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Self Employed</Label>
                <Select onValueChange={(value) => handleInputChange('selfEmployed', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select employment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Loan Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-blue-700">
              <DollarSign className="h-5 w-5" />
              Loan Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="loanAmount">Loan Amount (₹)</Label>
                <Input
                  id="loanAmount"
                  type="number"
                  placeholder="1,000,000"
                  value={formData.loanAmount || ''}
                  onChange={(e) => handleInputChange('loanAmount', Number(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="loanTerm">Loan Term (months)</Label>
                <Select onValueChange={(value) => handleInputChange('loanTerm', Number(value))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="120">10 years (120 months)</SelectItem>
                    <SelectItem value="180">15 years (180 months)</SelectItem>
                    <SelectItem value="240">20 years (240 months)</SelectItem>
                    <SelectItem value="300">25 years (300 months)</SelectItem>
                    <SelectItem value="360">30 years (360 months)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Property & Credit */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-blue-700">
              <Home className="h-5 w-5" />
              Property & Credit
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Property Area</Label>
                <Select onValueChange={(value) => handleInputChange('propertyArea', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Urban">Urban</SelectItem>
                    <SelectItem value="Semiurban">Semi-urban</SelectItem>
                    <SelectItem value="Rural">Rural</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Credit History</Label>
                <RadioGroup 
                  className="flex flex-row space-x-6 mt-2"
                  onValueChange={(value) => handleInputChange('creditHistory', Number(value))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="credit-good" />
                    <Label htmlFor="credit-good">Good</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="0" id="credit-poor" />
                    <Label htmlFor="credit-poor">Poor</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
            disabled={!isFormValid() || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing Application...
              </>
            ) : (
              'Submit Loan Application'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoanApplicationForm;
