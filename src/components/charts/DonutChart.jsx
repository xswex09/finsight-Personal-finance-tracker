// src/components/charts/DonutChart.jsx
import { Pie } from '@visx/shape'
import { Group } from '@visx/group'

const CAT_COLORS = {
  Housing:   '#2563eb',
  Food:      '#d97706',
  Transport: '#7c3aed',
  Shopping:  '#dc2626',
  Health:    '#0d9488',
}

export default function DonutChart({ transactions, size = 86 }) {
  // compute spending per category from real tx data
  const cats = {}
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => { cats[t.cat] = (cats[t.cat] || 0) + t.amt })

  const data = Object.entries(cats)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, value]) => ({ cat, value }))

  const cx          = size / 2
  const cy          = size / 2
  const outerRadius = size / 2 - 2
  const innerRadius = outerRadius * 0.62   // donut cutout

  // empty state — grey ring if no expense data
  if (!data.length) {
    return (
      <svg width={size} height={size}>
        <circle
          cx={cx} cy={cy}
          r={outerRadius}
          fill="none"
          stroke="#f0f1f6"
          strokeWidth={outerRadius - innerRadius}
        />
      </svg>
    )
  }

  return (
    <svg width={size} height={size}>
      <Group top={cy} left={cx}>
        <Pie
          data={data}
          pieValue={d => d.value}
          outerRadius={outerRadius}
          innerRadius={innerRadius}
          padAngle={0.025}
        >
          {pie =>
            pie.arcs.map(arc => (
              <path
                key={arc.data.cat}
                d={pie.path(arc)}
                fill={CAT_COLORS[arc.data.cat] || '#9ca3af'}
              />
            ))
          }
        </Pie>
      </Group>
    </svg>
  )
}