import React, { memo, useCallback, forwardRef, useMemo } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import RNBottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet'
import { useTheme } from '@shared/hooks/useTheme'

interface BottomSheetProps {
  children: React.ReactNode
  title?: string
  snapPoints?: (string | number)[]
}

export type BottomSheetRef = RNBottomSheet

const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(
  ({ children, title, snapPoints: propSnapPoints }, ref) => {
    const { colors, typography, radius } = useTheme()
    const snapPoints = useMemo(() => propSnapPoints ?? ['50%', '90%'], [propSnapPoints])

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
      ),
      [],
    )

    return (
      <RNBottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: colors.textMuted, width: 40 }}
        backgroundStyle={{ backgroundColor: colors.surface }}
        style={{ borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl }}
      >
        {title && (
          <View style={styles.header}>
            <Text style={[typography.h4, { color: colors.textPrimary }]}>{title}</Text>
          </View>
        )}
        {children}
      </RNBottomSheet>
    )
  },
)

const styles = StyleSheet.create({
  header: { paddingHorizontal: 24, paddingVertical: 16 },
})

export default memo(BottomSheet)
