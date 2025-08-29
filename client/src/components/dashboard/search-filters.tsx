import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { SearchFilters } from "@/types";
import type { Wilaya } from "@shared/schema";

interface SearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

export default function SearchFilters({ filters, onFiltersChange }: SearchFiltersProps) {
  const { data: wilayas = [] } = useQuery<Wilaya[]>({
    queryKey: ["/api/wilayas"],
  });

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    const filterValue = value === "all" ? "" : value;
    onFiltersChange({ ...filters, [key]: filterValue });
  };

  const handleSearch = () => {
    // Trigger search - filters are already updated via handleFilterChange
    console.log('Search triggered with filters:', filters);
  };

  return (
    <Card className="shadow-sm mb-8" data-testid="card-search-filters">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <div className="flex-1 w-full lg:w-auto">
            <div className="relative">
              <i className="fas fa-search absolute right-3 rtl:right-auto rtl:left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
              <Input
                type="text"
                placeholder="البحث عن منتج..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10"
                data-testid="input-search"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            <Select value={filters.wilayaId || "all"} onValueChange={(value) => handleFilterChange('wilayaId', value)}>
              <SelectTrigger className="w-48" data-testid="select-wilaya">
                <SelectValue placeholder="جميع الولايات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الولايات</SelectItem>
                {wilayas.map((wilaya) => (
                  <SelectItem key={wilaya.id} value={wilaya.id}>
                    {wilaya.nameAr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filters.category || "all"} onValueChange={(value) => handleFilterChange('category', value)}>
              <SelectTrigger className="w-40" data-testid="select-category">
                <SelectValue placeholder="جميع الفئات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفئات</SelectItem>
                <SelectItem value="vegetables">خضروات</SelectItem>
                <SelectItem value="fruits">فواكه</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filters.marketType || "all"} onValueChange={(value) => handleFilterChange('marketType', value)}>
              <SelectTrigger className="w-40" data-testid="select-market-type">
                <SelectValue placeholder="نوع السوق" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">نوع السوق</SelectItem>
                <SelectItem value="wholesale">جملة</SelectItem>
                <SelectItem value="retail">تجزئة</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              onClick={handleSearch}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              data-testid="button-apply-filter"
            >
              <i className="fas fa-filter"></i>
              تطبيق الفلتر
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
