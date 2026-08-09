import { RouterProps } from '@solidjs/router'
import type { Component } from 'solid-js'
import AppSnackbar from './components/AppSnackbar'
import { closeSnackbar, snackbar } from './state/AppSnackbar'

const App: Component<RouterProps> = ({ children }) => (
  <>
    {children}
    <AppSnackbar
      message={snackbar().message}
      severity={snackbar().severity}
      onClose={closeSnackbar}
    />
  </>
)

export default App
