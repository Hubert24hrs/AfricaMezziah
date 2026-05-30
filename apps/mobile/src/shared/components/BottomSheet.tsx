import React, { useCallback, useMemo, forwardRef } from 'react'
import { StyleSheet } from 'react-native'
import RNBottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet'
import { useTheme } from '@shared/hooks/useTheme'

interface BottomSheetProps {
  children: React.ReactNode
  snapPoints?: (string | number)[]
  onClose?: () => void
}

const BottomSheet = forwardRef<RNBottomSheet, BottomSheetProps>(
  ({ children, snapPoints: customSnaps, onClose }, ref) => {
    const { colors } = useTheme()
    const snapPoints = useMemo(() => customSnaps ?? ['50%', '90%'], [customSnaps])

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
      ),
      []
    )

    return (
      <RNBottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.surface }}
        handleIndicatorStyle={{ backgroundColor: colors.textMuted }}
        onClose={onClose}
      >
        <BottomSheetScrollView contentContainerStyle={styles.content}>
          {children}
        </BottomSheetScrollView>
      </RNBottomSheet>
    )
  }
)

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 32 },
})

export default BottomSheet
