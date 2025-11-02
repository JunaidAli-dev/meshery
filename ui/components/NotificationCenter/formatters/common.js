import React from 'react';
import { Typography } from '@sistent/sistent';
import { Launch as LaunchIcon } from '@mui/icons-material';
import { TextWithLinks } from '../../DataFormatter';
import Link from 'next/link';
import { useRouter } from 'next/router';

export const TitleLink = ({ href, target, children, download, onClick, ...props }) => {
  const router = useRouter();

  // For external links, new tab, or download links, use regular anchor tag
  if (target === '_blank' || href?.startsWith('http') || download) {
    return (
      <a
        href={href}
        target={target || '_blank'}
        rel="noopener noreferrer"
        style={{ color: 'inherit' }}
        download={download}
        {...props}
      >
        <Typography
          variant="h5"
          style={{
            textDecorationLine: 'underline',
            cursor: 'pointer',
            marginBottom: '0.5rem',
            fontWeight: 'bolder !important',
            textTransform: 'uppercase',
            fontSize: '0.9rem',
          }}
        >
          {children}
          <sup>
            <LaunchIcon style={{ width: '16px', height: '16px' }} />
          </sup>
        </Typography>
      </a>
    );
  }

  // For internal navigation with onClick handler (like modal close)
  const handleClick = (e) => {
    if (onClick && typeof onClick === 'function') {
      e.preventDefault();
      onClick(e);

      setTimeout(() => {
        // Make sure href has proper search params
        router.push(href);
      }, 50);
    }
  };

  return (
    <Link href={href} style={{ color: 'inherit', textDecoration: 'none' }} passHref>
      <Typography
        variant="h5"
        onClick={handleClick}
        style={{
          textDecorationLine: 'underline',
          cursor: 'pointer',
          marginBottom: '0.5rem',
          fontWeight: 'bolder !important',
          textTransform: 'uppercase',
          fontSize: '0.9rem',
        }}
      >
        {children}
      </Typography>
    </Link>
  );
};

export const EmptyState = ({ event }) => {
  return (
    <Typography
      variant="body1"
      style={{
        marginBlock: '0.5rem',
      }}
    >
      {' '}
      {
        <TextWithLinks
          variant="body1"
          style={{
            wordWrap: 'break-word',
          }}
          text={event.description || ''}
        ></TextWithLinks>
      }{' '}
    </Typography>
  );
};

export const DataToFileLink = ({ data }) => {
  // convert the trace to a file
  const dataString = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
  const file = new File([dataString], 'trace.txt', { type: 'text/plain' });

  return (
    <TitleLink href={URL.createObjectURL(file)} download="trace.txt">
      Download Trace
    </TitleLink>
  );
};
