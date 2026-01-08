/**
 * @label Language Selector Component
 * @description UI component for selecting source and target languages
 */

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { 
  getPopularLanguages, 
  getLanguagesByRegion, 
  getLanguageByCode,
  type Language 
} from '../lib/language-support';

interface LanguageSelectorProps {
  value?: string;
  onChange: (language: string) => void;
  label?: string;
  placeholder?: string;
  showDetectOption?: boolean;
  className?: string;
}

export function LanguageSelector({
  value,
  onChange,
  label = 'Language',
  placeholder = 'Select language',
  showDetectOption = false,
  className = ''
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'popular' | 'all'>('popular');

  const popularLanguages = getPopularLanguages();
  const allLanguagesByRegion = getLanguagesByRegion();
  const selectedLanguage = value ? getLanguageByCode(value) : null;

  // Filter languages based on search
  const filterLanguages = (languages: Language[]) => {
    if (!searchQuery) return languages;
    const query = searchQuery.toLowerCase();
    return languages.filter(
      lang =>
        lang.name.toLowerCase().includes(query) ||
        lang.nativeName.toLowerCase().includes(query) ||
        lang.code.toLowerCase().includes(query)
    );
  };

  const handleSelect = (code: string) => {
    onChange(code);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}

      {/* Selector Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4" />
          <span>
            {showDetectOption && value === 'auto' ? (
              'Auto-detect'
            ) : selectedLanguage ? (
              `${selectedLanguage.nativeName} (${selectedLanguage.name})`
            ) : (
              placeholder
            )}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-[400px] overflow-hidden">
          {/* Search Bar */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <input
              type="text"
              placeholder="Search languages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              type="button"
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                selectedTab === 'popular'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
              onClick={() => setSelectedTab('popular')}
            >
              Popular
            </button>
            <button
              type="button"
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                selectedTab === 'all'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
              onClick={() => setSelectedTab('all')}
            >
              All Languages
            </button>
          </div>

          {/* Language List */}
          <div className="overflow-y-auto max-h-[300px]">
            {showDetectOption && selectedTab === 'popular' && !searchQuery && (
              <button
                type="button"
                className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between ${
                  value === 'auto' ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
                onClick={() => handleSelect('auto')}
              >
                <span className="text-sm">
                  <span className="font-medium">Auto-detect</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-2">(Automatic)</span>
                </span>
                {value === 'auto' && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
              </button>
            )}

            {selectedTab === 'popular' && (
              <div>
                {filterLanguages(popularLanguages).map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between ${
                      value === lang.code ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                    onClick={() => handleSelect(lang.code)}
                  >
                    <span className="text-sm">
                      <span className="font-medium">{lang.nativeName}</span>
                      <span className="text-gray-500 dark:text-gray-400 ml-2">({lang.name})</span>
                    </span>
                    {value === lang.code && (
                      <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {selectedTab === 'all' && (
              <div>
                {Object.entries(allLanguagesByRegion).map(([region, languages]) => {
                  const filtered = filterLanguages(languages);
                  if (filtered.length === 0) return null;

                  return (
                    <div key={region}>
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900">
                        {region}
                      </div>
                      {filtered.map((lang) => (
                        <button
                          key={lang.code}
                          type="button"
                          className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between ${
                            value === lang.code ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                          }`}
                          onClick={() => handleSelect(lang.code)}
                        >
                          <span className="text-sm">
                            <span className="font-medium">{lang.nativeName}</span>
                            <span className="text-gray-500 dark:text-gray-400 ml-2">
                              ({lang.name})
                            </span>
                          </span>
                          {value === lang.code && (
                            <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          )}
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

interface LanguageSelectorPairProps {
  sourceLanguage?: string;
  targetLanguage?: string;
  onSourceChange: (language: string) => void;
  onTargetChange: (language: string) => void;
  className?: string;
}

/**
 * Dual language selector for source and target languages
 */
export function LanguageSelectorPair({
  sourceLanguage,
  targetLanguage,
  onSourceChange,
  onTargetChange,
  className = ''
}: LanguageSelectorPairProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      <LanguageSelector
        value={sourceLanguage}
        onChange={onSourceChange}
        label="Video Language"
        placeholder="Auto-detect"
        showDetectOption
      />
      <LanguageSelector
        value={targetLanguage}
        onChange={onTargetChange}
        label="Summary Language"
        placeholder="Same as video"
      />
    </div>
  );
}
