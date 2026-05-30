import React, { memo, useCallback, useMemo } from 'react'
import {
  View,
  Text,
  ScrollView,
  Switch,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import { useAddAddressMutation, useUpdateAddressMutation, Address } from '@store/api/userApi'
import Input from '@shared/components/Input'
import Button from '@shared/components/Button'
import Toast from '@shared/components/Toast'
import { useState } from 'react'

const addressSchema = z.object({
  label: z.string().min(1, 'Label required'),
  line1: z.string().min(1, 'Address required'),
  line2: z.string().optional(),
  city: z.string().min(1, 'City required'),
  state: z.string().min(1, 'State required'),
  country: z.string().min(1, 'Country required'),
  postalCode: z.string().min(1, 'Postal code required'),
  isDefault: z.boolean(),
})

type AddressForm = z.infer<typeof addressSchema>

type AddressRouteParams = {
  Address: { address?: Address }
}

/** Address add/edit form with React Hook Form + Zod */
const AddressScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const navigation = useNavigation<any>()
  const route = useRoute<RouteProp<AddressRouteParams, 'Address'>>()
  const existingAddress = route.params?.address

  const [addAddress, { isLoading: isAdding }] = useAddAddressMutation()
  const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation()
  const [toast, setToast] = useState<{ msg: string; type: 'error' | 'success' } | null>(null)

  const isLoading = isAdding || isUpdating
  const isEdit = !!existingAddress

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: existingAddress?.label ?? '',
      line1: existingAddress?.line1 ?? '',
      line2: existingAddress?.line2 ?? '',
      city: existingAddress?.city ?? '',
      state: existingAddress?.state ?? '',
      country: existingAddress?.country ?? 'Nigeria',
      postalCode: existingAddress?.postalCode ?? '',
      isDefault: existingAddress?.isDefault ?? false,
    },
  })

  const onSubmit = useCallback(
    async (data: AddressForm) => {
      try {
        if (isEdit && existingAddress) {
          await updateAddress({ id: existingAddress.id, ...data }).unwrap()
        } else {
          await addAddress(data).unwrap()
        }
        setToast({ msg: t('addresses.saved'), type: 'success' })
        setTimeout(() => navigation.goBack(), 1000)
      } catch {
        setToast({ msg: t('errors.generic'), type: 'error' })
      }
    },
    [isEdit, existingAddress, addAddress, updateAddress, navigation, t],
  )

  const styles = useMemo(() => createStyles(colors), [colors])

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            {isEdit ? t('addresses.editAddress') : t('addresses.addAddress')}
          </Text>
          <Button
            title={t('common.save')}
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            variant="ghost"
          />
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Controller
            control={control}
            name="label"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('addresses.label')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.label?.message}
                placeholder={t('addresses.labelPlaceholder')}
              />
            )}
          />
          <Controller
            control={control}
            name="line1"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('addresses.line1')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.line1?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="line2"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('addresses.line2')}
                value={value ?? ''}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.line2?.message}
              />
            )}
          />
          <View style={styles.row}>
            <View style={styles.half}>
              <Controller
                control={control}
                name="city"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label={t('addresses.city')}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.city?.message}
                  />
                )}
              />
            </View>
            <View style={styles.half}>
              <Controller
                control={control}
                name="state"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label={t('addresses.state')}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.state?.message}
                  />
                )}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.half}>
              <Controller
                control={control}
                name="country"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label={t('addresses.country')}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.country?.message}
                  />
                )}
              />
            </View>
            <View style={styles.half}>
              <Controller
                control={control}
                name="postalCode"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label={t('addresses.postalCode')}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.postalCode?.message}
                    keyboardType="number-pad"
                  />
                )}
              />
            </View>
          </View>

          <Controller
            control={control}
            name="isDefault"
            render={({ field: { onChange, value } }) => (
              <View style={styles.switchRow}>
                <Text style={[styles.switchLabel, { color: colors.textPrimary }]}>
                  {t('addresses.setAsDefault')}
                </Text>
                <Switch
                  value={value}
                  onValueChange={onChange}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.textPrimary}
                />
              </View>
            )}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {toast && <Toast message={toast.msg} type={toast.type} onDismiss={() => setToast(null)} />}
    </SafeAreaView>
  )
})

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    flex: { flex: 1 },
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: { fontFamily: 'Poppins-SemiBold', fontSize: 18, color: colors.textPrimary },
    content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40, gap: 4 },
    row: { flexDirection: 'row', gap: 12 },
    half: { flex: 1 },
    switchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      marginTop: 8,
    },
    switchLabel: { fontFamily: 'Poppins-Medium', fontSize: 15 },
  })

export default AddressScreen
