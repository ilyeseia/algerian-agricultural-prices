import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ProductStats } from "@shared/schema";

export default function StatisticsCards() {
  const { data: stats, isLoading, error } = useQuery<ProductStats>({
    queryKey: ["/api/stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <CardContent className="pt-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16 mb-4" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <CardContent className="pt-6">
            <p className="text-destructive" data-testid="text-stats-error">خطأ في تحميل الإحصائيات</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="shadow-sm" data-testid="card-total-products">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground" data-testid="text-total-products-label">
                إجمالي المنتجات
              </p>
              <p className="text-2xl font-bold text-foreground" data-testid="text-total-products-value">
                {stats?.totalProducts || 0}
              </p>
            </div>
            <div className="bg-primary/10 p-3 rounded-full">
              <i className="fas fa-apple-alt text-primary text-xl"></i>
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-success">+12%</span>
            <span className="text-muted-foreground mr-2 rtl:mr-0 rtl:ml-2">من الشهر الماضي</span>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm" data-testid="card-active-wilayas">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground" data-testid="text-active-wilayas-label">
                الولايات النشطة
              </p>
              <p className="text-2xl font-bold text-foreground" data-testid="text-active-wilayas-value">
                {stats?.activeWilayas || 0}
              </p>
            </div>
            <div className="bg-secondary/10 p-3 rounded-full">
              <i className="fas fa-map-marker-alt text-secondary text-xl"></i>
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-success">100%</span>
            <span className="text-muted-foreground mr-2 rtl:mr-0 rtl:ml-2">تغطية كاملة</span>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm" data-testid="card-last-update">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground" data-testid="text-last-update-label">
                آخر تحديث
              </p>
              <p className="text-lg font-semibold text-foreground" data-testid="text-last-update-value">
                {stats?.lastUpdate || "غير متوفر"}
              </p>
            </div>
            <div className="bg-accent/10 p-3 rounded-full">
              <i className="fas fa-clock text-accent text-xl"></i>
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <div className="loading-spinner"></div>
            <span className="text-muted-foreground mr-2 rtl:mr-0 rtl:ml-2">تحديث تلقائي</span>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm" data-testid="card-average-price">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground" data-testid="text-average-price-label">
                متوسط السعر
              </p>
              <p className="text-2xl font-bold text-foreground" data-testid="text-average-price-value">
                {stats?.averagePrice || 0} <span className="text-sm font-normal">دج</span>
              </p>
            </div>
            <div className="bg-success/10 p-3 rounded-full">
              <i className="fas fa-coins text-success text-xl"></i>
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-destructive">-3%</span>
            <span className="text-muted-foreground mr-2 rtl:mr-0 rtl:ml-2">انخفاض طفيف</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
