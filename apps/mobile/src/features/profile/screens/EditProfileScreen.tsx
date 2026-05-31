import React, { memo, useCallback } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'
import { useGetMeQuery, useUpdateMeMutation } from '@store/api/userApi'
import Input from '@shared/components/Input'
import Button from '@shared/components/Button'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  birthday: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const EditProfileScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors, typography, spacing } = useTheme()
  const navigation = useNavigation()
  const { data: user } = useGetMeQuery()
  const [updateMe, { isLoading }] = useUpdateMeMutation()

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: user?.name, email: user?.email, phone: user?.phone, birthday: user?.birthday },
  })

  const onSubmit = useCallback(
    async (data: FormData) => {
      await updateMe(data)
      navigation.goBack()
    },
    [updateMe, navigation],
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[typography.body1, { color: colors.primary }]}>←</Text>
        </TouchableOpacity>
        <Text style={[typography.h4, { color: colors.textPrimary }]}>{t('profile.editProfile')}</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: spacing.md }} keyboardShouldPersistTaps="handled">
        <Input control={control} name="name" label="Full Name" error={errors.name?.message} />
        <Input control={control} name="email" label={t('auth.email')} error={errors.email?.message} keyboardType="email-address" autoCapitalize="none" />
        <Input control={control} name="phone" label={t('auth.phone')} error={errors.phone?.message} keyboardType="phone-pad" />
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

export default EditProfileScreen
