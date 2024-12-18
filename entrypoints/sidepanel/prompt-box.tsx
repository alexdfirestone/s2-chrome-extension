'use client'

import { useState } from 'react'
import { Send, Loader2, X, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { ScrollArea } from '@radix-ui/react-scroll-area'

export function AiPromptBox() {
  const [query, setQuery] = useState('')
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<Array<{ title: string; content: string }>>([])
  const [selectedChips, setSelectedChips] = useState<string[]>([])
  const [generatedAnswer, setGeneratedAnswer] = useState('')

  const demoData = [
    {
      question: "What does our company do?",
      answers: [
        {
          title: "Core Business",
          content: "Our company, TechInnovate Solutions, specializes in developing cutting-edge software solutions for businesses across various industries."
        },
        {
          title: "Services",
          content: "We offer custom software development, cloud migration services, AI and machine learning integration, and cybersecurity consulting."
        }
      ]
    },
    {
      question: "How long has the company been in business?",
      answers: [
        {
          title: "Company History",
          content: "TechInnovate Solutions was founded in 2005 by a group of tech enthusiasts with a vision to transform the digital landscape."
        },
        {
          title: "Growth",
          content: "Over the past 18 years, we've grown from a small startup to a global company with offices in 5 countries and over 1000 employees."
        }
      ]
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    setCurrentQuestion(query)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setResults(demoData[0].answers)
    } catch (error) {
      console.error('Error querying AI:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setQuery(question)
    handleSubmit({ preventDefault: () => {} } as React.FormEvent)
  }

  const handleAddChip = (title: string) => {
    if (!selectedChips.includes(title)) {
      setSelectedChips([...selectedChips, title])
    }
  }

  const handleRemoveChip = (title: string) => {
    setSelectedChips(selectedChips.filter(chip => chip !== title))
  }

  const handleGenerateAnswer = async () => {
    setIsLoading(true)
    try {
      // Simulate API call to generate answer
      await new Promise(resolve => setTimeout(resolve, 1500))
      const generatedText = `Based on the selected topics (${selectedChips.join(', ')}), 
        here's a comprehensive answer: TechInnovate Solutions, founded in 2005, 
        is a leader in custom software development, cloud migration, AI integration, 
        and cybersecurity. With a team of over 1000 experts across 5 countries, 
        we combine cutting-edge technology with creative problem-solving to deliver 
        tailored solutions that drive real value for our clients.`
      setGeneratedAnswer(generatedText)
    } catch (error) {
      console.error('Error generating answer:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setQuery('')
    setCurrentQuestion('')
    setResults([])
    setSelectedChips([])
    setGeneratedAnswer('')
  }

  return (
    <div className="flex flex-col h-full">
      {currentQuestion && (
        <div className="bg-primary text-primary-foreground p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-lg font-semibold truncate flex-1 mr-2">{currentQuestion}</h2>
          <Button variant="secondary" size="sm" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      )}
      <div className="flex-1 overflow-hidden flex flex-col">
        {!currentQuestion ? (
          <div className="flex-1 overflow-hidden flex flex-col items-center justify-center p-6 space-y-8">
            <div className="w-full max-w-2xl">
              <div className="grid grid-cols-1 gap-4">
                {demoData.map((item, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestedQuestion(item.question)}
                    className="text-left h-auto whitespace-normal p-4"
                  >
                    {item.question}
                  </Button>
                ))}
              </div>
            </div>
            <form onSubmit={handleSubmit} className="flex space-x-2 p-4 w-full max-w-2xl">
              <Input
                type="text"
                placeholder="Ask about TechInnovate..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="p-4 border-b flex flex-col space-y-4">
              {generatedAnswer && (
                <Card>
                  <CardHeader>
                    <CardTitle>Generated Answer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{generatedAnswer}</p>
                  </CardContent>
                </Card>
              )}
              <div className="flex flex-wrap gap-2">
                {selectedChips.map((chip, index) => (
                  <div key={index} className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm flex items-center justify-between w-full max-w-xs">
                    <span className="truncate flex-1">{chip}</span>
                    <button
                      onClick={() => handleRemoveChip(chip)}
                      className="ml-2 focus:outline-none"
                      aria-label={`Remove ${chip}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <Button 
                onClick={handleGenerateAnswer} 
                disabled={isLoading || selectedChips.length === 0}
                className="w-full"
              >
                Generate Answer
              </Button>
            </div>
            <ScrollArea className="flex-1 p-4">
              {results.map((result, index) => (
                <Card key={index} className="mb-4">
                  <CardHeader>
                    <CardTitle>{result.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{result.content}</p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleAddChip(result.title)}
                    >
                      Select for Answer
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  )
}

