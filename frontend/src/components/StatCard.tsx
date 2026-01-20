'use client';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: {
        value: string;
        isPositive: boolean;
    };
    subtitle?: string;
}

/**
 * Premium Stat Card Component
 * Glassmorphism design with gradient icons
 */
export default function StatCard({ title, value, icon, trend, subtitle }: StatCardProps) {
    return (
        <div className="stat-card">
            <div className="stat-card-header">
                <div className="stat-icon-wrapper">
                    <div className="stat-icon">{icon}</div>
                </div>
                {trend && (
                    <div className={`stat-trend ${trend.isPositive ? 'positive' : 'negative'}`}>
                        <span className="trend-arrow">{trend.isPositive ? '↗' : '↘'}</span>
                        <span className="trend-value">{trend.value}</span>
                    </div>
                )}
            </div>

            <div className="stat-content">
                <h3 className="stat-title">{title}</h3>
                <p className="stat-value">{value}</p>
                {subtitle && <p className="stat-subtitle">{subtitle}</p>}
            </div>

            <style jsx>{`
        .stat-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 1.5rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0, 212, 255, 0.05), rgba(217, 70, 239, 0.05));
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          border-color: rgba(0, 212, 255, 0.3);
          box-shadow: 0 16px 48px rgba(0, 212, 255, 0.12);
        }

        .stat-card:hover::before {
          opacity: 1;
        }

        .stat-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
          position: relative;
          z-index: 1;
        }

        .stat-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(0, 212, 255, 0.15), rgba(0, 255, 242, 0.15));
          border: 1px solid rgba(0, 212, 255, 0.2);
          position: relative;
        }

        .stat-icon-wrapper::after {
          content: '';
          position: absolute;
          inset: -2px;
          background: linear-gradient(135deg, #00d4ff, #00fff2);
          border-radius: 14px;
          opacity: 0;
          filter: blur(8px);
          transition: opacity 0.4s ease;
          z-index: -1;
        }

        .stat-card:hover .stat-icon-wrapper::after {
          opacity: 0.3;
        }

        .stat-icon {
          color: #00d4ff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-trend {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.375rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.3px;
        }

        .stat-trend.positive {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.2);
        }

        .stat-trend.negative {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .trend-arrow {
          font-size: 0.875rem;
        }

        .stat-content {
          position: relative;
          z-index: 1;
        }

        .stat-title {
          font-size: 0.875rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 0.5rem;
        }

        .stat-value {
          font-size: 2.25rem;
          font-weight: 700;
          color: #ffffff;
          line-height: 1;
          margin-bottom: 0.25rem;
        }

        .stat-subtitle {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.4);
          margin-top: 0.5rem;
        }
      `}</style>
        </div>
    );
}
