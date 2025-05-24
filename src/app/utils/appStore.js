import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import userReducer from './userSlice'

// Persist configuration
const persistConfig = {
  key: 'root', // key for the localStorage key
  storage // storage engine
}
// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, userReducer)

// Configure the store with the persisted reducer
const appStore = configureStore({
  reducer: {
    user: persistedReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types from redux-persist
        ignoredActions: [
          'persist/PERSIST',
          'persist/REGISTER',
          'persist/REHYDRATE'
        ]
      }
    })
})

// Create a persistor object
export const persistor = persistStore(appStore)

export default appStore
