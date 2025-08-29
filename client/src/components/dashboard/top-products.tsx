import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@shared/schema";

type TopProduct = Product & { 
  avgPrice: number; 
  changePercentage: number; 
  marketCount: number;
};

export default function TopProducts() {
  const { data: topProducts = [], isLoading, error } = useQuery<TopProduct[]>({
    queryKey: ["/api/top-products"],
  });

  const getProductIcon = (category: string) => {
    switch (category) {
      case 'vegetables':
        return 'fas fa-carrot text-primary';
      case 'fruits':
        return 'fas fa-apple-alt text-accent';
      default:
        return 'fas fa-seedling text-primary';
    }
  };

  const formatChange = (change: number) => {
    if (change === 0) return { class: "text-muted-foreground", value: "0%" };
    if (change > 0) return { class: "trend-up", value: `+${change.toFixed(1)}%` };
    return { class: "trend-down", value: `${change.toFixed(1)}%` };
  };

  if (isLoading) {
    return (
      <Card className="shadow-sm" data-testid="card-top-products">
        <CardHeader>
          <CardTitle>المنتجات الأكثر تداولاً</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Skeleton className="h-6 w-6 mr-3" />
                  <div>
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
                <div>
                  <Skeleton className="h-4 w-12 mb-1" />
                  <Skeleton className="h-3 w-8" />
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
      <Card className="shadow-sm" data-testid="card-top-products">
        <CardHeader>
          <CardTitle>المنتجات الأكثر تداولاً</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive" data-testid="text-top-products-error">خطأ في تحميل البيانات</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm" data-testid="card-top-products">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground" data-testid="text-top-products-title">
          المنتجات الأكثر تداولاً
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topProducts.length === 0 ? (
            <p className="text-muted-foreground text-center py-4" data-testid="text-no-top-products">
              لا توجد بيانات متوفرة
            </p>
          ) : (
            topProducts.map((product) => {
              const change = formatChange(product.changePercentage);
              return (
                <div key={product.id} className="flex items-center justify-between" data-testid={`item-top-product-${product.id}`}>
                  <div className="flex items-center">
                    <i className={`${getProductIcon(product.category)} text-lg ml-3 rtl:ml-0 rtl:mr-3`}></i>
                    <div>
                      <p className="text-sm font-medium text-foreground" data-testid={`text-product-name-${product.id}`}>
                        {product.nameAr}
                      </p>
                      <p className="text-xs text-muted-foreground" data-testid={`text-market-count-${product.id}`}>
                        {product.marketCount} سوق
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground" data-testid={`text-avg-price-${product.id}`}>
                      {product.avgPrice} دج
                    </p>
                    <span className={`text-xs ${change.class}`} data-testid={`text-change-${product.id}`}>
                      {change.value}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
