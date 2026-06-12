import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import API_URL from '../config/api'

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)
  const searchRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const searchAll = async () => {
      if (searchTerm.trim().length < 2) {
        setResults([])
        setShowResults(false)
        return
      }

      setLoading(true)
      try {
        const hotelsRes = await fetch(`${API_URL}/api/hotels`)
        const hotelsData = await hotelsRes.json()
        const filteredHotels = hotelsData.success ? hotelsData.hotels.filter(hotel => 
          hotel.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hotel.location?.toLowerCase().includes(searchTerm.toLowerCase())
        ) : []

        
        const guidesRes = await fetch(`${API_URL}/api/guides`)
        const guidesData = await guidesRes.json()
        const filteredGuides = guidesData.success ? guidesData.guides.filter(guide => 
          guide.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          guide.location?.toLowerCase().includes(searchTerm.toLowerCase())
        ) : []

    
        const packagesRes = await fetch(`${API_URL}/api/packages`)
        const packagesData = await packagesRes.json()
        const filteredPackages = packagesData.success ? packagesData.packages.filter(pkg => 
          pkg.destination?.toLowerCase().includes(searchTerm.toLowerCase())
        ) : []

        const allResults = [
          ...filteredHotels.map(item => ({ ...item, type: 'hotel', typeLabel: 'Hotel', link: `/hotels/${item.id}`, displayName: item.name, subtitle: item.location })),
          ...filteredGuides.map(item => ({ ...item, type: 'guide', typeLabel: 'Tour Guide', link: `/guide/${item.id}`, displayName: item.name, subtitle: item.location })),
          ...filteredPackages.map(item => ({ ...item, type: 'package', typeLabel: 'Travel Package', link: `/packages/${item.id}`, displayName: item.destination, subtitle: item.duration }))
        ]
        
        setResults(allResults.slice(0, 8))
        setShowResults(true)
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(searchAll, 300)
    return () => clearTimeout(debounce)
  }, [searchTerm])

  const handleResultClick = (link) => {
    setShowResults(false)
    setSearchTerm('')
    navigate(link)
  }

  const getTypeIcon = (type) => {
    switch(type) {
      case 'hotel': return 'hotel'
      case 'guide': return 'tour'
      case 'package': return 'card_travel'
      default: return 'place'
    }
  }

  return (
    <div className="search" ref={searchRef}>
      <input 
        className="search-input" 
        type="text" 
        placeholder="Search for hotels, tour guides, travel packages..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button className="search-button">
        Search
      </button>

      {showResults && (
        <div className="search-results-dropdown">
          {loading ? (
            <div className="search-loading">Searching...</div>
          ) : results.length === 0 && searchTerm.length >= 2 ? (
            <div className="search-no-results">
              No results found for "{searchTerm}"
            </div>
          ) : (
            results.map((result, index) => (
              <div
                key={`${result.type}-${result.id}-${index}`}
                className="search-result-item"
                onClick={() => handleResultClick(result.link)}
              >
                <div className="search-result-icon">
                  <span className="material-symbols-outlined">{getTypeIcon(result.type)}</span>
                </div>
                <div className="search-result-info">
                  <div className="search-result-title">{result.displayName}</div>
                  <div className="search-result-subtitle">
                    {result.typeLabel} - {result.subtitle}
                  </div>
                </div>
                <div className="search-result-arrow">
                  View Details →
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBar