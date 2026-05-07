import type { OrderStatus } from '@/types';

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  pending: { bg: '#FEF3C7', text: '#92400E', dot: '#D97706' },
  processing: { bg: '#DBEAFE', text: '#1E3A8A', dot: '#2563EB' },
  shipped: { bg: '#CFFAFE', text: '#164E63', dot: '#0891B2' },
  delivered: { bg: '#DCFCE7', text: '#14532D', dot: '#16A34A' },
  cancelled: { bg: '#FEE2E2', text: '#7F1D1D', dot: '#E8321C' },
  active: { bg: '#DCFCE7', text: '#14532D', dot: '#16A34A' },
  inactive: { bg: '#F3F4F6', text: '#4B5563', dot: '#9CA3AF' },
  suspended: { bg: '#FEE2E2', text: '#7F1D1D', dot: '#E8321C' },
  approved: { bg: '#DCFCE7', text: '#14532D', dot: '#16A34A' },
  rejected: { bg: '#FEE2E2', text: '#7F1D1D', dot: '#E8321C' },
};

interface StatusChipProps {
  status: OrderStatus | 'active' | 'inactive' | 'suspended' | 'approved' | 'rejected' | 'pending';
}

export default function StatusChip({ status }: StatusChipProps) {
  const config = statusConfig[status] || statusConfig.inactive;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 font-mono text-xs capitalize"
      style={{
        backgroundColor: config.bg,
        color: config.text,
        borderRadius: '999px',
      }}
    >
      <span
        className="inline-block rounded-full"
        style={{
          width: 6,
          height: 6,
          backgroundColor: config.dot,
        }}
      />
      {status}
    </span>
  );
}
