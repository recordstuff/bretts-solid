import { RouterProps } from '@solidjs/router'
import type { Component } from 'solid-js'

const App: Component<RouterProps> = ({ children }) => (
  <>
    {children}
  </>
)

export default App
