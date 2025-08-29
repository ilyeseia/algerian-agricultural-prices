import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatusItem {
  label: string;
  status: 'active' | 'connected' | 'paused';
  color: string;
}

export default function SystemStatus() {
  const statusItems: StatusItem[] = [
    { label: "API الجلب", status: "active", color: "text-success" },
    { label: "قاعدة البيانات", status: "connected", color: "text-success" },
    { label: "التحديث التلقائي", status: "paused", color: "text-warning" }
  ];

  const getStatusText = (status: StatusItem['status']) => {
    switch (status) {
      case 'active':
        return 'نشط';
      case 'connected':
        return 'متصل';
      case 'paused':
        return 'متوقف مؤقتاً';
      default:
        return 'غير معروف';
    }
  };

  return (
    <Card className="shadow-sm" data-testid="card-system-status">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground" data-testid="text-system-status-title">
          حالة النظام
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {statusItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between" data-testid={`item-status-${index}`}>
              <span className="text-sm text-muted-foreground" data-testid={`text-status-label-${index}`}>
                {item.label}
              </span>
              <span className={`flex items-center ${item.color} text-sm`} data-testid={`text-status-value-${index}`}>
                <i className="fas fa-circle text-xs ml-2 rtl:ml-0 rtl:mr-2"></i>
                {getStatusText(item.status)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
