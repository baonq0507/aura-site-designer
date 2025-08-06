import VIPLevels from "@/components/VIPLevels";

const VipLevelsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-secondary/30 p-4 border-b border-primary/20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-playfair font-bold text-foreground tracking-wide text-center">
            VIP MEMBERSHIP LEVELS
          </h1>
          <p className="text-center text-muted-foreground mt-2">
            Khám phá các cấp độ VIP và ưu đãi đặc biệt
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <VIPLevels />
        
        {/* Additional VIP Benefits Section */}
        <div className="mt-8 space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-playfair font-bold text-foreground mb-4">
              ƯU ĐÃI VIP
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-card rounded-lg p-4 shadow-elegant border border-border">
              <h3 className="font-semibold text-foreground mb-2">Hoa hồng cao</h3>
              <p className="text-sm text-muted-foreground">
                Nhận tỷ lệ hoa hồng cao hơn khi nâng cấp VIP
              </p>
            </div>
            
            <div className="bg-white dark:bg-card rounded-lg p-4 shadow-elegant border border-border">
              <h3 className="font-semibold text-foreground mb-2">Ưu tiên hỗ trợ</h3>
              <p className="text-sm text-muted-foreground">
                Được ưu tiên hỗ trợ từ đội ngũ chăm sóc khách hàng
              </p>
            </div>
            
            <div className="bg-white dark:bg-card rounded-lg p-4 shadow-elegant border border-border">
              <h3 className="font-semibold text-foreground mb-2">Sản phẩm độc quyền</h3>
              <p className="text-sm text-muted-foreground">
                Tiếp cận sản phẩm và dịch vụ dành riêng cho VIP
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VipLevelsPage;