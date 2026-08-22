import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-gifted-charts';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { FilterSectionButton } from '../Components/FilterSectionButton';
import { TextComponent } from '../Components/TextComponent';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../utils/responsive';
import {
  useMonthlyExpenseChart,
  useWeeklyExpenseChart,
} from '../../utils/commonHooks';
import { COLORS, RADIUS, SHADOWS, SPACING, STRINGS } from '../Constants';
import { formatCurrency } from '../../utils/currency';
import { useTheme } from '../../context/themeContext';

const chartFilters = [STRINGS.statistics.weekly, STRINGS.statistics.monthly];
const graphFilters = [STRINGS.statistics.outflow, STRINGS.statistics.inflow];

export const StatisticsScreen = () => {
  const { colors } = useTheme();
  const [selectedRange, setSelectedRange] = useState<string>(
    STRINGS.statistics.weekly,
  );
  const [graphSelect, setGraphSelect] = useState<string>(
    STRINGS.statistics.outflow,
  );
  const weekly = useWeeklyExpenseChart();
  const monthly = useMonthlyExpenseChart();

  const activeData = selectedRange === STRINGS.statistics.weekly ? weekly : monthly;
  const chartData =
    graphSelect === STRINGS.statistics.outflow
      ? activeData.data
      : activeData.data2;

  const stats = useMemo(() => {
    const outflow = activeData.data.reduce((sum, item) => sum + item.value, 0);
    const inflow = activeData.data2.reduce((sum, item) => sum + item.value, 0);
    return { outflow, inflow };
  }, [activeData.data, activeData.data2]);

  const selectedTotal = graphSelect === STRINGS.statistics.outflow
    ? stats.outflow
    : stats.inflow;
  const hasChartData = chartData.some(item => item.value > 0);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.surfaceMuted }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <View style={styles.hero}>
          <View style={styles.heroTopRow}>
            <View style={styles.heroCopy}>
              <TextComponent
                value={STRINGS.statistics.title}
                size="GMedium"
                variant="bold"
              />
              <TextComponent
                value={STRINGS.statistics.subtitle}
                size="ExtraSmall"
                color="#D4ECE8"
              />
            </View>
            <View style={styles.heroBadge}>
              <FontAwesome6
                name="chart-line"
                iconStyle="solid"
                size={18}
                color={COLORS.brandStrong}
              />
            </View>
          </View>

          <View style={styles.summaryRow}>
            <SummaryPill
              label={STRINGS.statistics.outflowLabel}
              value={stats.outflow}
              color="#FFB89B"
            />
            <SummaryPill
              label={STRINGS.statistics.inflowLabel}
              value={stats.inflow}
              color="#8DE2B9"
            />
          </View>
        </View>

        <View style={[styles.filterCard, { backgroundColor: colors.surface }]}>
          <View style={styles.filterHeader}>
            <TextComponent
              value={STRINGS.statistics.summaryTitle}
              size="Small"
              variant="bold"
              color={COLORS.textPrimary}
            />
            <TextComponent
              value={STRINGS.statistics.chartHint}
              size="ExtraSmall"
              color={COLORS.textSecondary}
            />
          </View>
          <View style={styles.filterRow}>
            {chartFilters.map(item => (
              <FilterSectionButton
                key={item}
                selectedValue={selectedRange}
                value={item}
                onPress={setSelectedRange}
              />
            ))}
          </View>
          <View style={styles.filterRow}>
            {graphFilters.map(item => (
              <FilterSectionButton
                key={item}
                selectedValue={graphSelect}
                value={item}
                onPress={setGraphSelect}
              />
            ))}
          </View>
        </View>

        <View style={[styles.chartCard, { backgroundColor: colors.surface }]}>
          <View style={styles.chartHeader}>
            <View>
              <TextComponent
                value={
                  graphSelect === STRINGS.statistics.outflow
                    ? STRINGS.statistics.outflowLabel
                    : STRINGS.statistics.inflowLabel
                }
                size="Small"
                variant="bold"
                color={COLORS.textPrimary}
              />
              <TextComponent
                value={
                  selectedRange === STRINGS.statistics.weekly
                    ? STRINGS.statistics.weeklyTrend
                    : STRINGS.statistics.monthlyTrend
                }
                size="ExtraSmall"
                color={COLORS.textSecondary}
              />
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.info }]} />
              <TextComponent
                value={graphSelect}
                size="ExtraSmall"
                color={COLORS.textMuted}
              />
            </View>
          </View>

          <View style={styles.chartTotal}>
            <TextComponent value={STRINGS.statistics.totalForPeriod} size="ExtraSmall" color={COLORS.textSecondary} />
            <TextComponent value={formatCurrency(selectedTotal)} size="MMedium" variant="bold" color={COLORS.brandStrong} />
          </View>
          {hasChartData ? (
            <LineChart
              data={chartData}
              width={widthPercentageToDP(82)}
              height={heightPercentageToDP(30)}
              curved
              areaChart
              isAnimated
              animationDuration={900}
              hideRules
              hideDataPoints={false}
              dataPointsColor1={COLORS.brandStrong}
              color1={COLORS.brandStrong}
              startFillColor1={COLORS.brandLight}
              endFillColor1={COLORS.surface}
              startOpacity1={0.95}
              endOpacity1={0.15}
              yAxisTextStyle={{ color: COLORS.textMuted }}
              xAxisLabelTextStyle={{ color: COLORS.textMuted }}
              xAxisColor={COLORS.border}
              yAxisColor={COLORS.border}
              rulesColor={COLORS.border}
              focusEnabled
              showTextOnFocus
              textColor1={COLORS.brandStrong}
              initialSpacing={10}
              spacing={40}
            />
          ) : (
            <View style={styles.emptyChart}>
              <View style={styles.emptyChartIcon}>
                <FontAwesome6 name="chart-line" iconStyle="solid" size={20} color={COLORS.info} />
              </View>
              <TextComponent value={STRINGS.statistics.noDataTitle} size="Small" variant="bold" />
              <TextComponent value={STRINGS.statistics.noDataSubtitle} size="ExtraSmall" color={COLORS.textSecondary} style={styles.emptyChartCopy} />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

type SummaryPillProps = {
  label: string;
  value: number;
  color: string;
};

const SummaryPill: React.FC<SummaryPillProps> = ({ label, value, color }) => (
  <View style={styles.summaryPill}>
    <View style={[styles.summaryChip, { backgroundColor: color }]} />
    <View style={{ flex: 1 }}>
      <TextComponent
        value={label}
        size="ExtraSmall"
        color={COLORS.textSecondary}
      />
      <TextComponent
        value={`₹ ${value.toFixed(2)}`}
        size="Small"
        variant="bold"
        color={COLORS.textPrimary}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.surfaceMuted,
  },
  container: {
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  hero: {
    backgroundColor: COLORS.brandStrong,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    gap: SPACING.lg,
    ...SHADOWS.card,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  heroCopy: {
    flex: 1,
    gap: SPACING.xs,
  },
  heroBadge: {
    width: 46,
    height: 46,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  summaryPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  summaryChip: {
    width: 12,
    height: 12,
    borderRadius: RADIUS.pill,
  },
  filterCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    gap: SPACING.md,
    ...SHADOWS.card,
  },
  filterHeader: {
    gap: 4,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  chartCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    gap: SPACING.md,
    ...SHADOWS.card,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chartTotal: { gap: 3, marginTop: -4 },
  emptyChart: { minHeight: heightPercentageToDP(26), alignItems: 'center', justifyContent: 'center', gap: SPACING.xs, paddingHorizontal: SPACING.xl },
  emptyChartIcon: { width: 48, height: 48, borderRadius: RADIUS.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.brandLight },
  emptyChartCopy: { textAlign: 'center' },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: RADIUS.pill,
  },
});
