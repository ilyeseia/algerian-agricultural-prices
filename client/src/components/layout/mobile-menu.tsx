interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden" data-testid="overlay-mobile-menu">
      <div className="bg-card w-64 h-full shadow-lg">
        <div className="p-4 border-b border-border">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-foreground" data-testid="text-menu-title">القائمة الرئيسية</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-md transition-colors"
              data-testid="button-close-menu"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
        <nav className="p-4 space-y-3">
          <a href="#" className="block text-foreground hover:text-primary transition-colors" data-testid="link-mobile-dashboard">
            لوحة القيادة
          </a>
          <a href="#" className="block text-muted-foreground hover:text-primary transition-colors" data-testid="link-mobile-prices">
            الأسعار
          </a>
          <a href="#" className="block text-muted-foreground hover:text-primary transition-colors" data-testid="link-mobile-reports">
            التقارير
          </a>
          <a href="#" className="block text-muted-foreground hover:text-primary transition-colors" data-testid="link-mobile-settings">
            الإعدادات
          </a>
        </nav>
      </div>
    </div>
  );
}
