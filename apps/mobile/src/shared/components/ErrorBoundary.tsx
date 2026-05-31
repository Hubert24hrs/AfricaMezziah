import React, { Component, ErrorInfo, ReactNode } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import * as Sentry from '@sentry/react-native'
import { colors, typography } from '@shared/theme'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    Sentry.withScope(scope => {
      scope.setExtra('componentStack', info.componentStack)
      Sentry.captureException(error)
    })
  }

  handleReset = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <View style={styles.container}>
          <Text style={styles.emoji}>⚠️</Text>
          <Text style={[typography.h4, { color: colors.textPrimary, textAlign: 'center' }]}>
            Something went wrong
          </Text>
          <Text style={[typography.body2, { color: colors.textSecondary, textAlign: 'center', marginTop: 8 }]}>
            This section encountered an error
          </Text>
          <TouchableOpacity style={styles.btn} onPress={this.handleReset}>
            <Text style={[typography.label, { color: colors.primary }]}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )
    }

    return this.props.children
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: colors.background,
  },
  emoji: { fontSize: 48, marginBottom: 16 },
  btn: { marginTop: 24, padding: 12 },
})

export default ErrorBoundary
