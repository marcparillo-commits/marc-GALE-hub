import { useState } from 'react'
import Header from './components/Header.jsx'
import Sidebar from './components/Sidebar.jsx'
import ClientPortfolio from './components/ClientPortfolio.jsx'
import MarketingTrends from './components/MarketingTrends.jsx'
import VerticalIntelligence from './components/VerticalIntelligence.jsx'
import OpportunityRadar from './components/OpportunityRadar.jsx'

export default function App() {
  const [activeTab, setActiveTab] = useState('clients')
  const [selectedClient, setSelectedClient] = useState(null)

  return (
    <div className="app">
      <Header />
      <div className="app-body">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="main-content">
          {activeTab === 'clients' && (
            <ClientPortfolio selectedClient={selectedClient} setSelectedClient={setSelectedClient} />
          )}
          {activeTab === 'trends' && <MarketingTrends />}
          {activeTab === 'verticals' && <VerticalIntelligence />}
          {activeTab === 'radar' && <OpportunityRadar />}
        </main>
      </div>
    </div>
  )
}
