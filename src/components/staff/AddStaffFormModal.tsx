"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormBuilder } from '@/components/settings/FormBuilder'; // Assuming FormBuilder location
import { mockForms, mockStaff } from '@/lib/data'; // Assuming data locations
import type { CustomForm, Staff } from '@/lib/types'; // Assuming types location

interface AddStaffFormModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function AddStaffFormModal({ isOpen, setIsOpen }: AddStaffFormModalProps) {
  const [staffBasicDetailsForm, setStaffBasicDetailsForm] = useState<CustomForm | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching form definition
    const formDefinition = mockForms.find(form => form.id === 'form-staff-basic-details');
    if (formDefinition) {
      setStaffBasicDetailsForm(formDefinition);
    }
    setLoading(false);
  }, []);

  const handleFormSubmit = (formData: any) => {
    // TODO: Implement actual staff creation logic
    console.log('New staff data submitted:', formData);

    // Simulate adding a new staff member
    const newStaff: Staff = {
      id: `staff-${Date.now()}`, // Generate a unique ID
      name: `${formData['field-sbd-3'] || ''} ${formData['field-sbd-6'] || ''}`.trim(), // Combine first and surname
      email: formData['field-sbd-17'] || '', // Use email from form
      role: formData['field-sbd-role'] || 'Support Worker', // Assuming you add a role field or default
      phone: formData['field-sbd-14'] || '', // Use mobile number from form
      avatarUrl: formData['field-sbd-1'] || 'https://placehold.co/100x100.png', // Use uploaded picture or default
      // Map other form fields to Staff type as needed
      personalDetails: {
        dob: formData['field-sbd-9'] ? new Date(formData['field-sbd-9']) : undefined,
        address: `${formData['field-sbd-19'] || ''} ${formData['field-sbd-20'] || ''}, ${formData['field-sbd-21'] || ''}, ${formData['field-sbd-22'] || ''} ${formData['field-sbd-23'] || ''}`.trim(),
      },
      employmentDetails: {
        startDate: formData['field-sbd-29'] ? new Date(formData['field-sbd-29']) : undefined,
        employmentType: formData['field-sbd-31'] || 'Other',
        payRate: parseFloat(formData['field-sbd-pay-rate'] || '0'), // Assuming you add a pay rate field
      },
      groupIds: [], // Assign default groups or add a group selection field
      propertyIds: [], // Assign default properties or add a property selection field
      hrDetails: {
        interviewNotes: '', // Add notes field if needed
        documents: [], // Handle document uploads
      }
    };

    // You would typically add newStaff to your mockStaff array or send to a backend API
    // For now, just logging and closing
    console.log('Simulating adding new staff:', newStaff);
    alert(`Simulating adding staff: ${newStaff.name}`);


    setIsOpen(false); // Close the modal after submission
  };

  if (loading) {
    return null; // Or a loading indicator
  }

  if (!staffBasicDetailsForm) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>
              Could not load the staff basic details form.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add New Staff</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new staff member.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto py-4">
           <FormBuilder form={staffBasicDetailsForm} onSubmit={handleFormSubmit} />
        </div>


        {/* The FormBuilder should handle its own submit button, but if not, you might need one here */}
        {/* <DialogFooter>
          <Button onClick={handleFormSubmit}>Create Staff</Button>
        </DialogFooter> */}

      </DialogContent>
    </Dialog>
  );
}