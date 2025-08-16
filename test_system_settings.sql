-- Test system_settings table
SELECT * FROM system_settings WHERE key = 'system_status';

-- Insert test data if table doesn't exist
INSERT INTO system_settings (key, value, description) 
VALUES (
    'system_status', 
    '{"is_enabled": true, "maintenance_message": "Hệ thống đang hoạt động bình thường"}',
    'Trạng thái hoạt động của hệ thống'
) ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();

-- Check result
SELECT * FROM system_settings WHERE key = 'system_status';
