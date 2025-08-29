import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function QuickActions() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAddProduct = async () => {
    setIsLoading('add');
    try {
      // TODO: Implement add product modal/form
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast({
        title: "نجح العملية",
        description: "سيتم تنفيذ إضافة منتج جديد لاحقاً",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء العملية",
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
    }
  };

  const handleBulkUpdate = async () => {
    setIsLoading('bulk');
    try {
      // TODO: Implement bulk update functionality
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      toast({
        title: "نجح العملية",
        description: "سيتم تنفيذ التحديث المجمّع لاحقاً",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء العملية",
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
    }
  };

  const handleExportReport = async () => {
    setIsLoading('export');
    try {
      const response = await fetch('/api/export?format=csv');
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'prices_report.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "نجح التصدير",
        description: "تم تصدير التقرير بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ في التصدير",
        description: "حدث خطأ أثناء تصدير التقرير",
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <Card className="shadow-sm" data-testid="card-quick-actions">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground" data-testid="text-quick-actions-title">
          إجراءات سريعة
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Button 
            onClick={handleAddProduct}
            disabled={isLoading === 'add'}
            className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors text-sm"
            data-testid="button-add-product"
          >
            {isLoading === 'add' ? (
              <div className="loading-spinner ml-2 rtl:ml-0 rtl:mr-2"></div>
            ) : (
              <i className="fas fa-plus ml-2 rtl:ml-0 rtl:mr-2"></i>
            )}
            إضافة منتج جديد
          </Button>
          
          <Button 
            onClick={handleBulkUpdate}
            disabled={isLoading === 'bulk'}
            className="w-full bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/90 transition-colors text-sm"
            data-testid="button-bulk-update"
          >
            {isLoading === 'bulk' ? (
              <div className="loading-spinner ml-2 rtl:ml-0 rtl:mr-2"></div>
            ) : (
              <i className="fas fa-edit ml-2 rtl:ml-0 rtl:mr-2"></i>
            )}
            تحديث مجمّع
          </Button>
          
          <Button 
            onClick={handleExportReport}
            disabled={isLoading === 'export'}
            className="w-full bg-accent text-accent-foreground px-4 py-2 rounded-md hover:bg-accent/90 transition-colors text-sm"
            data-testid="button-export-report"
          >
            {isLoading === 'export' ? (
              <div className="loading-spinner ml-2 rtl:ml-0 rtl:mr-2"></div>
            ) : (
              <i className="fas fa-file-export ml-2 rtl:ml-0 rtl:mr-2"></i>
            )}
            تصدير تقرير
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
