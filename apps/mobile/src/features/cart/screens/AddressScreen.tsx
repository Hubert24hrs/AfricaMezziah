import React, { memo, useCallback } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import { useAddAddressMutation } from '@store/api/userApi'
import Input from '@shared/components/Input'
import Button from '@shared/components/Button'

const schema = z.object({
  label: z.string().min(1),
  line1: z.string().min(5),
  line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  country: z.string().min(2),
  postalCode: z.string().min(3),
})

type FormData = z.infer<typeof schema>

const AddressScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors, typography, spacing } = useTheme()
  const navigation = useNavigation()
  const [addAddress, { isLoading }] = useAddAddressMutation()

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = useCallback(
    async (data: FormData) => {
      await addAddress({ ...data, isDefault: false })
      navigation.goBack()
    },
    [addAddress, navigation],
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[typography.body1, { color: colors.primary }]}>←</Text>
        </TouchableOpacity>
        <Text style={[typography.h4, { color: colors.textPrimary }]}>{t('settings.addAddress')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.md }} keyboardShouldPersistTaps="handled">
        <Input control={control} name="label" label="Label (e.g. Home, Office)" error={errors.label?.message} />
        <Input control={control} name="line1" label="Street Address" error={errors.line1?.message} />
        <Input control={control} name="line2" label="Apartment, Suite (optional)" error={errors.line2?.message} />
        <Input control={control} name="city" label="City" error={errors.city?.message} />
        <Input control={control} name="state" label="State / Province" error={errors.state?.message} />
        <Input control={control} name="country" label="Country" error={errors.country?.message} />
        <Input control={control} name="postalCode" label="Postal Code" error={errors.postalCode?.message} />
        <Button label={t('common.save')} onPress={handleSubmit(onSubmit)} loading={isLoading} variant="primary" style={styles.btn} />
      </ScrollView>
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  btn: { marginTop: 8 },
})

export default AddressScreen
