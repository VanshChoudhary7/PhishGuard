'use client'
import { useState } from 'react'

export default function PhishingChecker() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCheck = async () => {
    if (!url.trim()) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('http://localhost:5000/api/check-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError('❌ Could not connect to server. Make sure backend is running.')
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center gap-6 p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">🛡️ PhishGuard</h1>
      <p className="text-gray-500">Enter a URL to check if it is phishing or legitimate</p>

      <div className="flex gap-2 w-full">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
          placeholder="https://example.com"
          className="flex-1 border rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleCheck}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
        >
          {loading ? 'Checking...' : 'Check'}
        </button>
      </div>

      {error && (
        <div className="w-full p-4 bg-red-50 border border-red-300 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {result && (
        <div className={`w-full p-6 rounded-lg border-2 ${
          result.result === 'phishing'
            ? 'border-red-500 bg-red-50'
            : 'border-green-500 bg-green-50'
        }`}>
          <p className="text-2xl font-bold mb-2">
            {result.result === 'phishing' ? '🚨 Phishing Detected!' : '✅ Looks Legitimate'}
          </p>
          <p className="text-sm text-gray-600 break-all">
            <span className="font-medium">URL:</span> {result.url}
          </p>
          {result.confidence && (
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">Confidence:</span> {result.confidence}%
            </p>
          )}
          <p className="text-xs text-gray-400 mt-2">
            Checked via: {result.source === 'ml_model' ? '🤖 ML Model' : '📂 Dataset'}
          </p>
        </div>
      )}
    </div>
  )
}