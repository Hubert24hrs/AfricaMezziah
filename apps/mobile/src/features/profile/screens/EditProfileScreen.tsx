import React, { memo, useCallback, useMemo, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import FastImage from 'react-native-fast-image'
import * as ImagePicker from 'expo-image-picker'
import { useTheme } from '@shared/hooks/useTheme'
import { useGetProfileQuery, useUpdateProfileMutation, useUploadAvatarMutation } from '@store/api/userApi'
import Input from '@shared/components/Input'
import Button from '@shared/components/Button'
import Toast from '@shared/components/Toast'

const profileSchema = z.object({
  name: z.string().min(2, 'Name too short'),
  phone: z.string().min(7, 'Invalid phone'),
  birthday: z.string().optional(),
})

type ProfileForm = z.infer<typeof profileSchema>

/** Edit profile screen with avatar picker, name, phone, birthday */
const EditProfileScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const navigation = useNavigation<any>()
  const { data: profile } = useGetProfileQuery()
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation()
  const [uploadAvatar, { isLoading: isUploading }] = useUploadAvatarMutation()
  const [toast, setToast] = useState<{ msg: string; type: 'error' | 'success' } | null>(null)
  const [avatarUri, setAvatarUri] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name ?? '',
      phone: profile?.phone ?? '',
      birthday: profile?.birthday ?? '',
    },
  })

  const handlePickAvatar = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0]
      setAvatarUri(asset.uri)
      const formData = new FormData()
      formData.append('file', { uri: asset.uri, type: 'image/jpeg', name: 'avatar.jpg' } as unknown as Blob)
      try {
        await uploadAvatar(formData).unwrap()
      } catch {
        setToast({ msg: t('errors.generic'), type: 'error' })
      }
    }
  }, [uploadAvatar, t])

  const onSubmit = useCallback(
    async (data: ProfileForm) => {
      try {
        await updateProfile(data).unwrap()
        setToast({ msg: t('profile.saved'), type: 'success' })
        setTimeout(() => navigation.goBack(), 1000)
      } catch {
        setToast({ msg: t('errors.generic'), type: 'error' })
      }
    },
    [updateProfile, navigation, t],
  )

  const styles = useMemo(() => createStyles(colors), [colors])
  const avatarSrc = avatarUri ?? profile?.avatar

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.75}>
            <Text style={styles.cancelText}>{t('common.cancel')}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('profile.editProfile')}</Text>
          <Button
            title={t('common.save')}
            onPress={handleSubmit(onSubmit)}
            loading={isSaving}
            variant="ghost"
          />
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <TouchableOpacity onPress={handlePickAvatar} activeOpacity={0.75} style={styles.avatarWrap}>
              {avatarSrc ? (
                <FastImage
                  source={{ uri: avatarSrc }}
                  style={styles.avatar}
                  resizeMode={FastImage.resizeMode.cover}
                />
              ) : (
                <View style={[styles.avatarPlaceholder, { backgroundColor: colors.surface }]}>
                  <Text style={styles.avatarPlaceholderText}>
                    {profile?.name?.[0]?.toUpperCase() ?? '?'}
                  </Text>
                </View>
              )}
              <View style={[styles.cameraOverlay, { backgroundColor: colors.primary }]}>
                <Text style={styles.cameraIcon}>📷</Text>
              </View>
            </TouchableOpacity>
            {isUploading && (
              <Text style={[styles.uploadingText, { color: colors.textMuted }]}>
                {t('profile.uploadingPhoto')}
              </Text>
            )}
          </View>

          {/* Email (read-only) */}
          <View style={styles.readonlyField}>
            <Text style={styles.readonlyLabel}>{t('auth.email')}</Text>
            <Text style={styles.readonlyValue}>{profile?.email}</Text>
            <Text style={[styles.verifiedBadge, { color: colors.success }]}>✓ {t('profile.verified')}</Text>
          </View>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('auth.fullName')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.name?.message}
                autoCapitalize="words"
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('auth.phone')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.phone?.message}
                keyboardType="phone-pad"
              />
            )}
          />

          <Controller
            control={control}
            name="birthday"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('profile.birthday')}
                value={value ?? ''}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.birthday?.message}
                placeholder="YYYY-MM-DD"
                keyboardType="numbers-and-punctuation"
              />
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
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    cancelText: { fontFamily: 'Poppins-Medium', fontSize: 15, color: colors.textSecondary },
    headerTitle: { fontFamily: 'Poppins-SemiBold', fontSize: 18, color: colors.textPrimary },
    content: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40, gap: 4 },
    avatarSection: { alignItems: 'center', marginBottom: 28 },
    avatarWrap: { position: 'relative' },
    avatar: { width: 96, height: 96, borderRadius: 48 },
    avatarPlaceholder: {
      width: 96,
      height: 96,
      borderRadius: 48,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarPlaceholderText: {
      fontFamily: 'PlayfairDisplay-Bold',
      fontSize: 36,
      color: colors.primary,
    },
    cameraOverlay: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 30,
      height: 30,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cameraIcon: { fontSize: 16 },
    uploadingText: { fontFamily: 'Poppins-Regular', fontSize: 12, marginTop: 8 },
    readonlyField: {
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      marginBottom: 8,
    },
    readonlyLabel: { fontFamily: 'Poppins-Regular', fontSize: 12, color: colors.textMuted },
    readonlyValue: { fontFamily: 'Poppins-Medium', fontSize: 15, color: colors.textPrimary, marginTop: 2 },
    verifiedBadge: { fontFamily: 'Poppins-Regular', fontSize: 11, marginTop: 2 },
  })

export default EditProfileScreen
