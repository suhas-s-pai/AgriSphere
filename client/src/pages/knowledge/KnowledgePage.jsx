import React from 'react';
import PlaceholderPage from '../../components/common/PlaceholderPage.jsx';
import { BookOpen } from 'lucide-react';

const KnowledgePage = () => {
  return (
    <PlaceholderPage
      title="Knowledge Hub & Articles"
      subtitle="Curated articles, video tutorials, and modern farming techniques verified by agricultural scientists."
      icon={BookOpen}
      owner="Shravya (Article Content Schema) & Sharayu (Frontend)"
      features={[
        { name: 'Modern Farming Guides', desc: 'Hydroponics, Polyhouse cultivation, Drip fertigation, and Natural farming methods.' },
        { name: 'Kannada & Regional Language Articles', desc: 'Localized farming literature for Karnataka farmers.' },
        { name: 'Video Masterclasses', desc: 'Curated video guides on pruning, grafting, soil preparation, and harvesting.' },
        { name: 'Expert Q&A Forum', desc: 'Ask farming queries and receive answers from agricultural university extension staff.' },
      ]}
    />
  );
};

export default KnowledgePage;

