import { memo, useMemo } from 'react';
import {
  getLanguageDisplayName,
  getFileIconUrl,
  getExtensionFromLanguage,
  type CodeViewerLanguage,
  type CodeViewerTheme,
} from '@ngeenx/nx-code-viewer-utils';

interface CodeHeaderProps {
  language?: CodeViewerLanguage;
  title?: string;
  theme?: CodeViewerTheme;
  fileExtension?: string;
}

export const CodeHeader = memo(function CodeHeader({
  language = 'plaintext',
  title = '',
  theme = 'dark',
  fileExtension = '',
}: CodeHeaderProps) {
  const displayText = useMemo(() => title || getLanguageDisplayName(language), [title, language]);

  const iconUrl = useMemo(() => {
    if (fileExtension) return getFileIconUrl(fileExtension);
    const langExt = getExtensionFromLanguage(language);
    return langExt ? getFileIconUrl(langExt) : null;
  }, [fileExtension, language]);

  return (
    <div className="nx-code-header">
      <header className={theme}>
        <div className="title-container">
          {iconUrl && <img src={iconUrl} className="file-icon" alt={title} />}
          <span className="title">{displayText}</span>
        </div>
      </header>
    </div>
  );
});
