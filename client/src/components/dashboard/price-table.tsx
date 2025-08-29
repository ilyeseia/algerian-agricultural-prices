import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { SearchFilters } from "@/types";
import type { PriceWithDetails } from "@shared/schema";

interface PriceTableProps {
  filters: SearchFilters;
}

export default function PriceTable({ filters }: PriceTableProps) {
  const queryParams = new URLSearchParams();
  if (filters.wilayaId) queryParams.append('wilayaId', filters.wilayaId);
  if (filters.marketType) queryParams.append('marketType', filters.marketType);
  if (filters.search) queryParams.append('search', filters.search);

  const { data: prices = [], isLoading, error } = useQuery<PriceWithDetails[]>({
    queryKey: ["/api/prices", queryParams.toString()],
  });

  const formatChangePercentage = (change: string | null) => {
    if (!change || change === "0" || change === "0.00") {
      return { icon: "fas fa-minus", class: "text-muted-foreground", value: "0%" };
    }
    const value = parseFloat(change);
    if (value > 0) {
      return { icon: "fas fa-arrow-up", class: "trend-up", value: `+${value.toFixed(1)}%` };
    }
    return { icon: "fas fa-arrow-down", class: "trend-down", value: `${value.toFixed(1)}%` };
  };

  const getProductIcon = (category: string) => {
    switch (category) {
      case 'vegetables':
        return 'fas fa-carrot text-accent';
      case 'fruits':
        return 'fas fa-apple-alt text-destructive';
      default:
        return 'fas fa-seedling text-primary';
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-sm" data-testid="card-price-table">
        <CardHeader>
          <CardTitle>أسعار المنتجات الحالية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-sm" data-testid="card-price-table">
        <CardContent className="p-6">
          <p className="text-destructive" data-testid="text-prices-error">خطأ في تحميل البيانات</p>
        </CardContent>
      </Card>
    );
  }

  const filteredPrices = prices.filter(price => {
    if (filters.category && price.product.category !== filters.category) return false;
    if (filters.search && !price.product.nameAr.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <Card className="shadow-sm" data-testid="card-price-table">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-lg font-semibold text-foreground" data-testid="text-table-title">
          أسعار المنتجات الحالية
        </CardTitle>
        <p className="text-sm text-muted-foreground" data-testid="text-last-updated">
          آخر تحديث: اليوم الساعة 14:30
        </p>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-right rtl:text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  المنتج
                </th>
                <th className="px-6 py-3 text-right rtl:text-right text-xs font-medium text-muted-foreground uppercase tracking-wider mobile-hide">
                  الولاية
                </th>
                <th className="px-6 py-3 text-right rtl:text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  نوع السوق
                </th>
                <th className="px-6 py-3 text-right rtl:text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  السعر
                </th>
                <th className="px-6 py-3 text-right rtl:text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  التغيير
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {filteredPrices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground" data-testid="text-no-data">
                    لا توجد بيانات متوفرة
                  </td>
                </tr>
              ) : (
                filteredPrices.map((price) => {
                  const change = formatChangePercentage(price.changePercentage);
                  return (
                    <tr key={price.id} className="hover:bg-muted/50 transition-colors" data-testid={`row-price-${price.id}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <i className={`${getProductIcon(price.product.category)} text-lg ml-3 rtl:ml-0 rtl:mr-3`}></i>
                          <div>
                            <div className="text-sm font-medium text-foreground" data-testid={`text-product-name-${price.id}`}>
                              {price.product.nameAr}
                            </div>
                            <div className="text-sm text-muted-foreground" data-testid={`text-product-unit-${price.id}`}>
                              {price.product.unit}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap mobile-hide">
                        <span className="text-sm text-foreground" data-testid={`text-wilaya-${price.id}`}>
                          {price.wilaya.nameAr}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge 
                          variant={price.marketType === 'retail' ? 'default' : 'secondary'}
                          data-testid={`badge-market-type-${price.id}`}
                        >
                          {price.marketType === 'retail' ? 'تجزئة' : 'جملة'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-foreground" data-testid={`text-price-${price.id}`}>
                        {parseFloat(price.price).toFixed(0)} دج
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center text-sm ${change.class}`} data-testid={`text-change-${price.id}`}>
                          <i className={`${change.icon} text-xs ml-1 rtl:ml-0 rtl:mr-1`}></i>
                          <span>{change.value}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {filteredPrices.length > 0 && (
          <div className="px-6 py-4 border-t border-border">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground" data-testid="text-pagination-info">
                عرض 1-{Math.min(filteredPrices.length, 10)} من {filteredPrices.length} منتج
              </p>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <button 
                  className="px-3 py-1 text-sm border border-border rounded hover:bg-muted transition-colors disabled:opacity-50" 
                  disabled
                  data-testid="button-previous"
                >
                  السابق
                </button>
                <span className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded" data-testid="text-current-page">
                  1
                </span>
                <button 
                  className="px-3 py-1 text-sm border border-border rounded hover:bg-muted transition-colors"
                  data-testid="button-next"
                >
                  التالي
                </button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
