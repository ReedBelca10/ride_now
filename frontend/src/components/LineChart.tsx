'use client';

import styles from './LineChart.module.css';

interface DataPoint {
    month: string;
    value: number;
}

interface LineChartProps {
    data: DataPoint[];
    title: string;
    color: 'cyan' | 'purple';
    trend?: string;
    subtitle?: string;
}

/**
 * Premium Line Chart Component
 * SVG-based smooth line chart with gradients
 */
export default function LineChart({ data, title, color, trend, subtitle }: LineChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className={`${styles.chartContainer} ${styles[color]}`}>
                <div className={styles.chartHeader}>
                    <h3 className={styles.chartTitle}>{title}</h3>
                    {subtitle && <p className={styles.chartSubtitle}>{subtitle}</p>}
                </div>
                <div className={styles.chartEmpty}>Aucune donnée disponible</div>
            </div>
        );
    }

    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue || 1;

    const width = 600;
    const height = 200;
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    // Generate SVG path
    const points = data.map((point, index) => {
        const x = padding + (index / (data.length - 1)) * chartWidth;
        const y = padding + chartHeight - ((point.value - minValue) / range) * chartHeight;
        return { x, y };
    });

    const pathD = points.reduce((path, point, index) => {
        if (index === 0) {
            return `M ${point.x} ${point.y}`;
        }
        const prevPoint = points[index - 1];
        const cpx1 = prevPoint.x + (point.x - prevPoint.x) / 3;
        const cpx2 = prevPoint.x + (2 * (point.x - prevPoint.x)) / 3;
        return `${path} C ${cpx1} ${prevPoint.y}, ${cpx2} ${point.y}, ${point.x} ${point.y}`;
    }, '');

    // Area path for gradient fill
    const areaPathD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${padding} ${height - padding} Z`;

    return (
        <div className={`${styles.chartContainer} ${styles[color]}`}>
            <div className={styles.chartHeader}>
                <div>
                    <h3 className={styles.chartTitle}>{title}</h3>
                    {subtitle && <p className={styles.chartSubtitle}>{subtitle}</p>}
                </div>
                {trend && (
                    <div className={styles.chartTrend}>
                        <span className={styles.trendIcon}>↗</span>
                        <span className={styles.trendText}>{trend}</span>
                    </div>
                )}
            </div>

            <svg
                className={styles.chartSvg}
                viewBox={`0 0 ${width} ${height}`}
                preserveAspectRatio="xMidYMid meet"
            >
                <defs>
                    <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={color === 'cyan' ? '#00d4ff' : '#d946ef'} stopOpacity="0.4" />
                        <stop offset="100%" stopColor={color === 'cyan' ? '#00d4ff' : '#d946ef'} stopOpacity="0.01" />
                    </linearGradient>
                    <linearGradient id={`line-gradient-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={color === 'cyan' ? '#00d4ff' : '#d946ef'} />
                        <stop offset="100%" stopColor={color === 'cyan' ? '#00fff2' : '#a855f7'} />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map((i) => (
                    <line
                        key={i}
                        x1={padding}
                        y1={padding + (chartHeight / 4) * i}
                        x2={width - padding}
                        y2={padding + (chartHeight / 4) * i}
                        stroke="rgba(255, 255, 255, 0.05)"
                        strokeWidth="1"
                    />
                ))}

                {/* Area fill */}
                <path
                    d={areaPathD}
                    fill={`url(#gradient-${color})`}
                    className={styles.chartArea}
                />

                {/* Line */}
                <path
                    d={pathD}
                    fill="none"
                    stroke={`url(#line-gradient-${color})`}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow)"
                    className={styles.chartLine}
                />

                {/* Data points */}
                {points.map((point, index) => (
                    <g key={index}>
                        <circle
                            cx={point.x}
                            cy={point.y}
                            r="5"
                            fill={color === 'cyan' ? '#00d4ff' : '#d946ef'}
                            className={styles.chartPoint}
                        />
                        <circle
                            cx={point.x}
                            cy={point.y}
                            r="3"
                            fill="#0a0a0a"
                        />
                    </g>
                ))}
            </svg>
        </div>
    );
}
