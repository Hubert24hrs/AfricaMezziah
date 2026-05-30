import React, { memo, useCallback, useMemo } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@shared/hooks/useTheme'

const APP_VERSION = '1.0.0'

const SOCIAL_LINKS = [
  { name: 'Instagram', icon: '📸', url: 'https://instagram.com/africamezziah' },
  { name: 'Twitter', icon: '🐦', url: 'https://twitter.com/africamezziah' },
  { name: 'Facebook', icon: '📘', url: 'https://facebook.com/africamezziah' },
]

/** About screen — app version, description, social links, legal links */
const AboutScreen: React.FC = memo(() => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const navigation = useNavigation<any>()

  const handleOpenURL = useCallback((url: string) => {
    Linking.openURL(url).catch(() => {})
  }, [])

  const handleRateApp = useCallback(() => {
    // Open App Store / Play Store review page
    const storeUrl =
      'market://details?id=com.africamezziah.app' // Android fallback
    Linking.openURL(storeUrl).catch(() => {})
  }, [])

  const styles = useMemo(() => createStyles(colors), [colors])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.75}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('about.title')}</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Logo + Brand */}
        <View style={styles.brandSection}>
          <View style={[styles.logoCircle, { backgroundColor: colors.surface }]}>
            <Text style={styles.logoText}>AM</Text>
          </View>
          <Text style={styles.brandName}>Africa Mezziah</Text>
          <Text style={[styles.tagline, { color: colors.primary }]}>
            {t('about.tagline')}
          </Text>
          <Text style={[styles.version, { color: colors.textMuted }]}>
            {t('about.version')} {APP_VERSION}
          </Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {t('about.description')}
          </Text>
        </View>

        {/* Social Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('about.followUs')}</Text>
          <View style={styles.socialRow}>
            {SOCIAL_LINKS.map(link => (
              <TouchableOpacity
                key={link.name}
                style={[styles.socialBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => handleOpenURL(link.url)}
                activeOpacity={0.75}
              >
                <Text style={styles.socialIcon}>{link.icon}</Text>
                <Text style={[styles.socialName, { color: colors.textSecondary }]}>{link.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Rate App */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.rateBtn, { backgroundColor: 'rgba(201,168,76,0.1)', borderColor: colors.primary }]}
            onPress={handleRateApp}
            activeOpacity={0.75}
          >
            <Text style={styles.rateStar}>⭐</Text>
            <Text style={[styles.rateText, { color: colors.primary }]}>{t('about.rateApp')}</Text>
          </TouchableOpacity>
        </View>

        {/* Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('about.legal')}</Text>
          {[
            { key: 'terms', label: t('about.termsOfService'), url: 'https://africamezziah.com/terms' },
            { key: 'privacy', label: t('about.privacyPolicy'), url: 'https://africamezziah.com/privacy' },
          ].map(link => (
            <TouchableOpacity
              key={link.key}
              style={[styles.linkRow, { borderBottomColor: colors.border }]}
              onPress={() => handleOpenURL(link.url)}
              activeOpacity={0.75}
            >
              <Text style={[styles.linkText, { color: colors.textPrimary }]}>{link.label}</Text>
              <Text style={[styles.chevron, { color: colors.textMuted }]}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Copyright */}
        <View style={styles.copyrightSection}>
          <Text style={[styles.copyright, { color: colors.textMuted }]}>
            © {new Date().getFullYear()} Africa Mezziah. {t('about.allRightsReserved')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
})

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
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
    backText: { fontFamily: 'Poppins-Medium', fontSize: 22, color: colors.textSecondary },
    headerTitle: { fontFamily: 'Poppins-SemiBold', fontSize: 18, color: colors.textPrimary },
    scroll: { flex: 1 },
    brandSection: {
      alignItems: 'center',
      paddingVertical: 36,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    logoCircle: {
      width: 88,
      height: 88,
      borderRadius: 44,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
      borderWidth: 2,
      borderColor: colors.primary,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 10,
      elevation: 10,
    },
    logoText: { fontFamily: 'PlayfairDisplay-Bold', fontSize: 28, color: colors.primary },
    brandName: { fontFamily: 'PlayfairDisplay-Bold', fontSize: 26, color: colors.textPrimary, marginBottom: 4 },
    tagline: { fontFamily: 'Poppins-Regular', fontSize: 13, textAlign: 'center', marginBottom: 8 },
    version: { fontFamily: 'Inter-Regular', fontSize: 12 },
    section: { paddingHorizontal: 20, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: colors.border },
    sectionTitle: { fontFamily: 'Poppins-SemiBold', fontSize: 16, color: colors.textPrimary, marginBottom: 14 },
    description: { fontFamily: 'Poppins-Regular', fontSize: 14, lineHeight: 22 },
    socialRow: { flexDirection: 'row', gap: 12 },
    socialBtn: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 14,
      borderRadius: 12,
      borderWidth: 1,
      gap: 6,
    },
    socialIcon: { fontSize: 24 },
    socialName: { fontFamily: 'Poppins-Medium', fontSize: 12 },
    rateBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      borderRadius: 12,
      borderWidth: 1.5,
      gap: 10,
    },
    rateStar: { fontSize: 22 },
    rateText: { fontFamily: 'Poppins-SemiBold', fontSize: 15 },
    linkRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      borderBottomWidth: 1,
    },
    linkText: { flex: 1, fontFamily: 'Poppins-Medium', fontSize: 15 },
    chevron: { fontSize: 22 },
    copyrightSection: { paddingHorizontal: 20, paddingVertical: 24, alignItems: 'center' },
    copyright: { fontFamily: 'Inter-Regular', fontSize: 12, textAlign: 'center' },
  })

export default AboutScreen
