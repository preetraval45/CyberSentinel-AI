import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/docs/categories');
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/docs/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setSearchResults(data.results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Help Center</h1>
          <p className="text-gray-600">Find answers and get support</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="flex gap-2">
            <Input
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Search Results</h2>
            <div className="space-y-4">
              {searchResults.map((result: any) => (
                <Card key={result.id} className="cursor-pointer hover:shadow-md">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg">{result.title}</h3>
                    <p className="text-gray-600 text-sm">{result.content.substring(0, 150)}...</p>
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-2">
                      {result.category}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="grid md:grid-cols-2 gap-6">
          {categories.map((category: any) => (
            <Card key={category.id} className="cursor-pointer hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex justify-between">
                  {category.name}
                  <span className="text-sm font-normal text-gray-500">
                    {category.count} articles
                  </span>
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}