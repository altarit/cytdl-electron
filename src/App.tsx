import React from 'react'

import Header from './components/Header/Header'
import MainArea from './components/MainArea/MainArea'

import './App.css'

const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <MainArea />
    </div>
  )
}

export default App
