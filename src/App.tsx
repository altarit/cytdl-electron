import React from 'react'

import Footer from './components/Footer'
import FormatSelector from './components/FormatSelector'
import Header from './components/Header'
import MainArea from './components/MainArea'
import popupsStore from './stores/popupsStore'
import { debug } from './utils/logger'

import './App.css'

const handleClick = () => {
  popupsStore.closeAllPopups()
}

const App: React.FC = () => {
  debug('App.render')

  return (
    <div className="App" onClick={handleClick}>
      <Header />
      <MainArea />
      <Footer />
      <FormatSelector />
    </div>
  )
}

export default App
