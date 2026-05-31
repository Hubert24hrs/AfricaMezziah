import React, { memo, useCallback, useRef } from 'react'
import { View, Text, TextInput, StyleSheet, TouchableOpacity, TextInputProps } from 'react-native'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import Animated, { useSharedValue, useAnimatedStyle, withSpring, interpolate } from 'react-native-reanimated'
import { useTheme } from '@shared/hooks/useTheme'

interface InputProps<T extends FieldValues> extends TextInputProps {
  control: Control<T>
  name: Path<T>
  label: string
  error?: string
  rightIcon?: string
  onRightIconPress?: () => void
}

function Input<T extends FieldValues>({
  control,
  name,
  label,
  error,
  rightIcon,
  onRightIconPress,
  ...textInputProps
}: InputProps<T>): React.ReactElement {
  const { colors, typography, radius } = useTheme()
  const labelPos = useSharedValue(0)
  const inputRef = useRef<TextInput>(null)

  const handleFocus = useCallback(() => {
    labelPos.value = withSpring(1, { damping: 15 })
  }, [labelPos])

  const handleBlur = useCallback(
    (value: string) => {
      if (!value) labelPos.value = withSpring(0, { damping: 15 })
    },
    [labelPos],
  )

  const labelStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(labelPos.value, [0, 1], [0, -20]) }],
    fontSize: interpolate(labelPos.value, [0, 1], [16, 12]),
    color: error ? colors.error : labelPos.value === 1 ? colors.primary : colors.textMuted,
  }))

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <View style={styles.wrapper}>
          <View
            style={[
              styles.container,
              {
                borderColor: error ? colors.error : labelPos.value === 1 ? colors.primary : colors.border,
                backgroundColor: colors.surface,
                borderRadius: radius.md,
              },
            ]}
          >
            <Animated.Text style={[styles.label, labelStyle]} onPress={() => inputRef.current?.focus()}>
              {label}
            </Animated.Text>
            <TextInput
              ref={inputRef}
              style={[
                styles.input,
                typography.body1,
                { color: colors.textPrimary, paddingRight: rightIcon ? 48 : 16 },
              ]}
              value={value as string}
              onChangeText={onChange}
              onFocus={handleFocus}
              onBlur={() => { onBlur(); handleBlur(value as string) }}
              placeholderTextColor={colors.textMuted}
              {...textInputProps}
            />
            {rightIcon && (
              <TouchableOpacity style={styles.rightIcon} onPress={onRightIconPress}>
                <Text style={styles.rightIconText}>{rightIcon}</Text>
              </TouchableOpacity>
            )}
          </View>
          {error && (
            <Text style={[typography.caption, styles.errorText, { color: colors.error }]}>{error}</Text>
          )}
        </View>
      )}
    />
  )
}

const InputMemo = memo(Input) as typeof Input
export default InputMemo

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  container: {
    height: 56,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    justifyContent: 'center',
    position: 'relative',
  },
  label: {
    position: 'absolute',
    left: 16,
    top: 18,
  },
  input: {
    flex: 1,
    paddingTop: 16,
    paddingBottom: 0,
  },
  rightIcon: { position: 'absolute', right: 16, top: 16 },
  rightIconText: { fontSize: 20 },
  errorText: { marginTop: 4, marginLeft: 4 },
})
