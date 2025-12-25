'use client'

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import appStore, { persistor } from '../app/utils/appStore'

export default function ReduxProvider({ children }) {
  return (
    <Provider store={appStore}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}
