"use client";

import { useEffect, useState } from 'react';
import { mockForms } from '@/lib/data'; // Assuming mockForms is in src/lib/data.ts
import type { CustomForm } from '@/lib/types';
import { FormBuilder } from '@/components/settings/FormBuilder'; // Assuming FormBuilder is in src/components/settings/FormBuilder.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';


export default function StaffBasicDetailsPage() {
  const [staffBasicDetailsForm, setStaffBasicDetailsForm] = useState<CustomForm | null>(null);

  useEffect(() => {
    // Find the 'Staff Basic Details' form definition
    const formDefinition = mockForms.find(form => form.id === 'form-staff-basic-details');
    if (formDefinition) {
      setStaffBasicDetailsForm(formDefinition);
    }
  }, []);

  const handleFormSubmit = (formData: any) => {
    // TODO: Implement logic to create a new staff member with formData
    console.log('Form submitted with data:', formData);
    alert('Staff member creation not yet implemented. Data logged to console.');
    // You would typically send this data to your backend or data handling layer
  };

  if (!staffBasicDetailsForm) {
    return <div>Loading form...</div>; // Or a loading spinner component
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>{staffBasicDetailsForm.name}</CardTitle>
          <CardDescription>Fill in the details to create a new staff member.</CardDescription>
        </CardHeader>
        <CardContent>
          <FormBuilder
            form={staffBasicDetailsForm}
            onSubmit={handleFormSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}