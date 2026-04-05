// src/components/charts/BarChart.jsx
import { Group }      from '@visx/group'
import { BarGroup }   from '@visx/shape'
import { AxisBottom } from '@visx/axis'
import { GridRows }   from '@visx/grid'
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale'

const PERIOD_DATA = {
  '1W': [
    { label: 'Mon', income: 0,    expense: 148  },
    { label: 'Tue', income: 0,    expense: 60   },
    { label: 'Wed', income: 0,    expense: 0    },
    { label: 'Thu', income: 800,  expense: 210  },
    { label: 'Fri', income: 0,    expense: 85   },
    { label: 'Sat', income: 0,    expense: 0    },
    { label: 'Sun', income: 4100, expense: 1200 },
  ],
  '1M': [
    { label: 'Nov', income: 2800, expense: 2100 },
    { label: 'Dec', income: 3200, expense: 2400 },
    { label: 'Jan', income: 3100, expense: 2200 },
    { label: 'Feb', income: 4200, expense: 2900 },
    { label: 'Mar', income: 4900, expense: 3100 },
    { label: 'Apr', income: 4900, expense: 1720 },
  ],
  '3M': [
    { label: 'Oct', income: 2600, expense: 2000 },
    { label: 'Nov', income: 2800, expense: 2100 },
    { label: 'Dec', income: 3200, expense: 2400 },
    { label: 'Jan', income: 3100, expense: 2200 },
    { label: 'Feb', income: 4200, expense: 2900 },
    { label: 'Mar', income: 4900, expense: 3100 },
  ],
  '1Y': [
    { label: 'May', income: 2500, expense: 1900 },
    { label: 'Jul', income: 2900, expense: 2100 },
    { label: 'Sep', income: 3100, expense: 2300 },
    { label: 'Nov', income: 2800, expense: 2100 },
    { label: 'Jan', income: 3100, expense: 2200 },
    { label: 'Apr', income: 4900, expense: 1720 },
  ],
}

const KEYS   = ['income', 'expense']
const COLORS = { income: '#16a34a', expense: '#dc2626' }

export default function BarChart({ period, width = 300 }) {
  const data   = PERIOD_DATA[period] || PERIOD_DATA['1M']
  const height = 120
  const ml = 36, mr = 8, mt = 8, mb = 24
  const iW = width - ml - mr
  const iH = height - mt - mb

  const maxVal = Math.max(...data.flatMap(d => [d.income, d.expense])) * 1.15

  // outer scale — groups (one per month label)
  const xScale = scaleBand({
    domain: data.map(d => d.label),
    range:  [0, iW],
    padding: 0.3,
  })

  // inner scale — income vs expense bars within each group
  const xInner = scaleBand({
    domain: KEYS,
    range:  [0, xScale.bandwidth()],
    padding: 0.15,
  })

  const yScale = scaleLinear({
    domain: [0, maxVal],
    range:  [iH, 0],
    nice:   true,
  })

  const colorScale = scaleOrdinal({
    domain: KEYS,
    range:  KEYS.map(k => COLORS[k]),
  })

  return (
    <svg width={width} height={height}>
      <Group left={ml} top={mt}>

        {/* horizontal grid lines */}
        <GridRows
          scale={yScale}
          width={iW}
          numTicks={3}
          stroke="rgba(0,0,0,0.05)"
          strokeDasharray="3,3"
        />

        {/* y-axis labels */}
        {yScale.ticks(3).map(tick => (
          <text
            key={tick}
            x={-6}
            y={yScale(tick) + 4}
            textAnchor="end"
            fontSize={8}
            fill="#9ca3af"
          >
            {tick >= 1000 ? `$${tick / 1000}k` : `$${tick}`}
          </text>
        ))}

        {/* grouped bars */}
        <BarGroup
          data={data}
          keys={KEYS}
          height={iH}
          x0={d => d.label}
          x0Scale={xScale}
          x1Scale={xInner}
          yScale={yScale}
          color={colorScale}
        >
          {barGroups =>
            barGroups.map(bg => (
              <Group key={bg.index} left={bg.x0}>
                {bg.bars.map(bar => (
                  <rect
                    key={bar.key}
                    x={bar.x}
                    y={bar.y}
                    width={bar.width}
                    height={bar.height}
                    fill={bar.color}
                    rx={2}
                    opacity={bar.key === 'income' ? 0.85 : 0.75}
                  />
                ))}
              </Group>
            ))
          }
        </BarGroup>

        {/* x-axis labels */}
        <AxisBottom
          top={iH}
          scale={xScale}
          hideAxisLine
          hideTicks
          tickLabelProps={() => ({
            fontSize:   8,
            fill:       '#9ca3af',
            textAnchor: 'middle',
            dy:         '0.5em',
          })}
        />

      </Group>
    </svg>
  )
}