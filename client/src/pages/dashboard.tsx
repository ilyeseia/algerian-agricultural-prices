import { useState } from "react";
import Header from "@/components/layout/header";
import MobileMenu from "@/components/layout/mobile-menu";
import StatisticsCards from "@/components/dashboard/statistics-cards";
import SearchFilters from "@/components/dashboard/search-filters";
import PriceTable from "@/components/dashboard/price-table";
import PriceChart from "@/components/dashboard/price-chart";
import TopProducts from "@/components/dashboard/top-products";
import QuickActions from "@/components/dashboard/quick-actions";
import SystemStatus from "@/components/dashboard/system-status";
import { SearchFilters as SearchFiltersType } from "@/types";

export default function Dashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFiltersType>({
    search: "",
    wilayaId: "",
    category: "",
    marketType: ""
  });

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <StatisticsCards />
        
        <SearchFilters 
          filters={filters} 
          onFiltersChange={setFilters} 
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PriceTable filters={filters} />
          </div>
          
          <div className="space-y-6">
            <PriceChart />
            <TopProducts />
            <QuickActions />
            <SystemStatus />
          </div>
        </div>
      </main>
    </div>
  );
}
