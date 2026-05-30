import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Sentry.captureException(error, { extra: info })
    console.error('[ErrorBoundary]', error, info)
  }

  retry = () => this.setState({ hasError: false, error: undefined })

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <View style={styles.container}>
          <Text style={styles.emoji}>⚠️</Text>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>{this.state.error?.message}</Text>
          <TouchableOpacity style={styles.button} onPress={this.retry} activeOpacity={0.75}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )
    }
    return this.props.children
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: '#0F0F1A' },
  emoji: { fontSize: 48, marginBottom: 16 },
  title: { color: '#FFFFFF', fontFamily: 'Poppins-SemiBold', fontSize: 20, marginBottom: 8 },
  message: { color: '#B0B0C3', fontFamily: 'Poppins-Regular', fontSize: 14, textAlign: 'center', marginBottom: 24 },
  button: { backgroundColor: '#C9A84C', paddingHorizontal: 32, paddingVertical: 12, borderRadius: 24 },
  buttonText: { color: '#0F0F1A', fontFamily: 'Poppins-SemiBold', fontSize: 16 },
})

export default ErrorBoundary
