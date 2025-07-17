"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Contact } from '@/lib/data/contacts';
import { CustomForm } from '@/lib/types';
import { getAllForms } from '@/lib/data';
import { DynamicFormRenderer } from './DynamicFormRenderer';
import { X, Save, UserPlus, Edit, Printer, Download } from 'lucide-react';

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'add' | 'edit' | 'view';
  contact?: Contact;
  onSave?: (contact: Contact) => void;
  onCancel?: () => void;
  clientName?: string;
}

export function ContactDialog({ 
  open, 
  onOpenChange, 
  mode, 
  contact, 
  onSave, 
  onCancel,
  clientName = "Client"
}: ContactDialogProps) {
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const allForms = getAllForms();
  
  // Get the appropriate form based on mode
  const getForm = (): CustomForm | undefined => {
    switch (mode) {
      case 'add':
        return allForms.find(form => form.id === 'form-contact-add');
      case 'edit':
        return allForms.find(form => form.id === 'form-contact-edit');
      case 'view':
        return allForms.find(form => form.id === 'form-contact-view');
      default:
        return allForms.find(form => form.id === 'form-contact-add');
    }
  };

  const form = getForm();

  const handleFormChange = (data: any) => {
    setFormData(data);
    // Clear validation errors when user starts typing
    setValidationErrors({});
  };

  const validateForm = (): boolean => {
    if (!form) return false;

    const errors: Record<string, string> = {};
    const requiredFields = form.fields.filter(field => field.required);
    
    requiredFields.forEach(field => {
      const value = formData[field.id];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        errors[field.id] = `${field.name} is required`;
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!form) return;

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create contact object
      const newContact: Contact = {
        id: contact?.id || `contact-${Date.now()}`,
        name: formData['contact-name'] || '',
        relationship: formData['contact-relationship'] || '',
        email: formData['contact-email'] || '',
        phone: formData['contact-phone'] || '',
        phone2: formData['contact-phone2'] || undefined,
        note: formData['contact-note'] || undefined,
        newsletter: formData['contact-newsletter'] || false,
        author: 'Current User', // In real app, get from auth context
        createdAt: contact?.createdAt || new Date().toISOString().split('T')[0]
      };

      // Call save handler
      if (onSave) {
        await onSave(newContact);
      }

      // Close dialog
      onOpenChange(false);
      
      // Reset form
      setFormData({});
      setValidationErrors({});
      
    } catch (error) {
      console.error('Error saving contact:', error);
      alert('Error saving contact. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({});
    setValidationErrors({});
    if (onCancel) {
      onCancel();
    }
    onOpenChange(false);
  };

  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const contactData = {
      name: formData['contact-name'] || contact?.name || '',
      relationship: formData['contact-relationship'] || contact?.relationship || '',
      email: formData['contact-email'] || contact?.email || '',
      phone: formData['contact-phone'] || contact?.phone || '',
      phone2: formData['contact-phone2'] || contact?.phone2 || '',
      note: formData['contact-note'] || contact?.note || '',
      newsletter: formData['contact-newsletter'] || contact?.newsletter || false,
      author: contact?.author || 'Current User',
      createdAt: contact?.createdAt || new Date().toISOString().split('T')[0]
    };

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Contact Record - ${contactData.name}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 10px; }
          .contact-info { margin-bottom: 20px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #333; }
          .value { margin-left: 10px; }
          .section { margin-bottom: 30px; }
          .section-title { font-size: 18px; font-weight: bold; color: #2563eb; margin-bottom: 15px; }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Contact Record</h1>
          <p><strong>Client:</strong> ${clientName}</p>
          <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="section">
          <div class="section-title">Contact Information</div>
          <div class="contact-info">
            <div class="field">
              <span class="label">Name:</span>
              <span class="value">${contactData.name}</span>
            </div>
            <div class="field">
              <span class="label">Relationship:</span>
              <span class="value">${contactData.relationship}</span>
            </div>
            <div class="field">
              <span class="label">Email:</span>
              <span class="value">${contactData.email || 'N/A'}</span>
            </div>
            <div class="field">
              <span class="label">Phone:</span>
              <span class="value">${contactData.phone || 'N/A'}</span>
            </div>
            <div class="field">
              <span class="label">Phone 2:</span>
              <span class="value">${contactData.phone2 || 'N/A'}</span>
            </div>
            <div class="field">
              <span class="label">Newsletter:</span>
              <span class="value">${contactData.newsletter ? 'Yes' : 'No'}</span>
            </div>
            ${contactData.note ? `
            <div class="field">
              <span class="label">Notes:</span>
              <span class="value">${contactData.note}</span>
            </div>
            ` : ''}
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Record Details</div>
          <div class="field">
            <span class="label">Created By:</span>
            <span class="value">${contactData.author}</span>
          </div>
          <div class="field">
            <span class="label">Created Date:</span>
            <span class="value">${contactData.createdAt}</span>
          </div>
        </div>
        
        <div class="no-print" style="margin-top: 30px; text-align: center;">
          <button onclick="window.print()">Print</button>
          <button onclick="window.close()">Close</button>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const handleExportPDF = () => {
    // Create a dedicated PDF export window with better styling
    const pdfWindow = window.open('', '_blank');
    if (!pdfWindow) return;

    const contactData = {
      name: formData['contact-name'] || contact?.name || '',
      relationship: formData['contact-relationship'] || contact?.relationship || '',
      email: formData['contact-email'] || contact?.email || '',
      phone: formData['contact-phone'] || contact?.phone || '',
      phone2: formData['contact-phone2'] || contact?.phone2 || '',
      note: formData['contact-note'] || contact?.note || '',
      newsletter: formData['contact-newsletter'] || contact?.newsletter || false,
      author: contact?.author || 'Current User',
      createdAt: contact?.createdAt || new Date().toISOString().split('T')[0]
    };

    const pdfContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Contact Record - ${contactData.name}</title>
        <style>
          @page { margin: 1in; }
          body { 
            font-family: 'Arial', sans-serif; 
            margin: 0; 
            padding: 20px;
            background: white;
            color: #333;
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: 3px solid #2563eb; 
            padding-bottom: 15px; 
          }
          .header h1 { 
            color: #2563eb; 
            margin: 0 0 10px 0;
            font-size: 24px;
          }
          .header p { 
            margin: 5px 0; 
            color: #666;
            font-size: 14px;
          }
          .contact-info { margin-bottom: 25px; }
          .field { 
            margin-bottom: 12px; 
            display: flex;
            align-items: flex-start;
          }
          .label { 
            font-weight: bold; 
            color: #333; 
            min-width: 120px;
            margin-right: 10px;
          }
          .value { 
            flex: 1;
            word-wrap: break-word;
          }
          .section { 
            margin-bottom: 25px; 
            page-break-inside: avoid;
          }
          .section-title { 
            font-size: 16px; 
            font-weight: bold; 
            color: #2563eb; 
            margin-bottom: 12px;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 5px;
          }
          .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #666;
            text-align: center;
          }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Contact Record</h1>
          <p><strong>Client:</strong> ${clientName}</p>
          <p><strong>Generated:</strong> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        </div>
        
        <div class="section">
          <div class="section-title">Contact Information</div>
          <div class="contact-info">
            <div class="field">
              <span class="label">Name:</span>
              <span class="value">${contactData.name}</span>
            </div>
            <div class="field">
              <span class="label">Relationship:</span>
              <span class="value">${contactData.relationship}</span>
            </div>
            <div class="field">
              <span class="label">Email:</span>
              <span class="value">${contactData.email || 'N/A'}</span>
            </div>
            <div class="field">
              <span class="label">Phone:</span>
              <span class="value">${contactData.phone || 'N/A'}</span>
            </div>
            <div class="field">
              <span class="label">Phone 2:</span>
              <span class="value">${contactData.phone2 || 'N/A'}</span>
            </div>
            <div class="field">
              <span class="label">Newsletter:</span>
              <span class="value">${contactData.newsletter ? 'Yes' : 'No'}</span>
            </div>
            ${contactData.note ? `
            <div class="field">
              <span class="label">Notes:</span>
              <span class="value">${contactData.note}</span>
            </div>
            ` : ''}
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Record Details</div>
          <div class="field">
            <span class="label">Created By:</span>
            <span class="value">${contactData.author}</span>
          </div>
          <div class="field">
            <span class="label">Created Date:</span>
            <span class="value">${contactData.createdAt}</span>
          </div>
        </div>
        
        <div class="footer">
          <p>CareNest - Contact Management System</p>
          <p>This document was generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        </div>
        
        <div class="no-print" style="margin-top: 30px; text-align: center;">
          <button onclick="window.print()" style="padding: 10px 20px; margin: 5px; background: #2563eb; color: white; border: none; border-radius: 5px; cursor: pointer;">Print/Save as PDF</button>
          <button onclick="window.close()" style="padding: 10px 20px; margin: 5px; background: #6b7280; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
        </div>
      </body>
      </html>
    `;

    pdfWindow.document.write(pdfContent);
    pdfWindow.document.close();
    
    // Auto-trigger print dialog for PDF export
    setTimeout(() => {
      pdfWindow.print();
    }, 500);
  };

  const getDialogTitle = () => {
    switch (mode) {
      case 'add':
        return 'Add New Contact';
      case 'edit':
        return 'Edit Contact';
      case 'view':
        return 'View Contact';
      default:
        return 'Contact';
    }
  };

  const getDialogIcon = () => {
    switch (mode) {
      case 'add':
        return <UserPlus className="h-5 w-5" />;
      case 'edit':
        return <Edit className="h-5 w-5" />;
      case 'view':
        return <UserPlus className="h-5 w-5" />;
      default:
        return <UserPlus className="h-5 w-5" />;
    }
  };

  // Pre-populate form data for edit and view modes
  React.useEffect(() => {
    if (contact && (mode === 'edit' || mode === 'view')) {
      setFormData({
        'contact-name': contact.name,
        'contact-relationship': contact.relationship,
        'contact-email': contact.email,
        'contact-phone': contact.phone,
        'contact-phone2': contact.phone2 || '',
        'contact-note': contact.note || '',
        'contact-newsletter': contact.newsletter
      });
    } else if (mode === 'add') {
      setFormData({});
    }
    setValidationErrors({});
  }, [contact, mode]);

  if (!form) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {getDialogIcon()}
              <span>Form Not Found</span>
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-8 text-gray-500">
            <p>Contact form configuration not found.</p>
            <p className="text-sm">Please configure the contact form in system settings.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {getDialogIcon()}
            <span>{getDialogTitle()}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <DynamicFormRenderer
            form={form}
            mode={mode === 'view' ? 'view' : 'edit'}
            initialData={formData}
            onChange={handleFormChange}
            clientId="current-client"
            validationErrors={validationErrors}
          />

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-2">
              {mode === 'view' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrint}
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportPDF}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                </>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                {mode === 'view' ? 'Close' : 'Cancel'}
              </Button>
              {mode !== 'view' && (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Saving...' : 'Save Contact'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 