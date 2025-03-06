import withPWA from 'next-pwa'

const config = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true
  //   disable: process.env.NODE_ENV === 'development'
})({})

export default config
