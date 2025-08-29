import { Button } from "@/components/ui/button";

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const handleExportData = async () => {
    try {
      const response = await fetch("/api/export?format=csv");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'prices.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50" data-testid="header-main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <i className="fas fa-seedling text-primary text-2xl" data-testid="icon-logo"></i>
            <h1 className="text-xl font-bold text-foreground font-arabic" data-testid="text-app-title">
              منصة أسعار الخضر والفواكه
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
            <a href="#" className="text-foreground hover:text-primary transition-colors" data-testid="link-dashboard">
              لوحة القيادة
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-prices">
              الأسعار
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-reports">
              التقارير
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-settings">
              الإعدادات
            </a>
            <Button 
              onClick={handleExportData}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              data-testid="button-export"
            >
              <i className="fas fa-download ml-2 rtl:ml-0 rtl:mr-2"></i>
              تصدير البيانات
            </Button>
          </nav>
          
          <button 
            className="md:hidden p-2 rounded-md text-foreground hover:bg-muted transition-colors"
            onClick={onMenuToggle}
            data-testid="button-mobile-menu"
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </div>
    </header>
  );
}
