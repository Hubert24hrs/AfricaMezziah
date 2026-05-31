const messaging = () => ({
  requestPermission: async () => 1,
  getToken: async () => 'web-token',
  onMessage: (_handler: unknown) => () => {},
})
export default messaging
