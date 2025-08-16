-- Tạo bảng system_settings để quản lý trạng thái hệ thống
CREATE TABLE IF NOT EXISTS public.system_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tạo RLS policies
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Chỉ admin mới có thể đọc/ghi system_settings
CREATE POLICY "Admin can manage system settings" ON public.system_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Chỉ admin mới có thể đọc system_settings (cho user thường)
CREATE POLICY "Users can read system settings" ON public.system_settings
    FOR SELECT USING (true);

-- Insert dữ liệu mặc định
INSERT INTO public.system_settings (key, value, description) 
VALUES (
    'system_status', 
    '{"is_enabled": true, "maintenance_message": "Hệ thống đã ngừng hoạt động, vui lòng quay lại vào ngày hôm sau"}',
    'Trạng thái hoạt động của hệ thống'
) ON CONFLICT (key) DO NOTHING;

-- Tạo function để cập nhật updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tạo trigger cho updated_at
CREATE TRIGGER handle_system_settings_updated_at
    BEFORE UPDATE ON public.system_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
