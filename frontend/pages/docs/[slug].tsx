import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent } from '@/components/ui/card';

export default function DocumentPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchDocument(slug as string);
    }
  }, [slug]);

  const fetchDocument = async (docSlug: string) => {
    try {
      const response = await fetch(`/api/docs/${docSlug}`);
      if (response.ok) {
        const data = await response.json();
        setDocument(data);
      } else {
        router.push('/help');
      }
    } catch (error) {
      console.error('Error fetching document:', error);
      router.push('/help');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Document not found</h1>
          <p className="text-gray-600">The requested document could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">{document.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Category: {document.category}</span>
            <span>Updated: {new Date(document.updated_at).toLocaleDateString()}</span>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="prose max-w-none">
              <ReactMarkdown>{document.content}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}