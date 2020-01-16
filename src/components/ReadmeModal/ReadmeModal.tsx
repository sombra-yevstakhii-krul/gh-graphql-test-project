import React from 'react';
import { Dialog, Box } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import { README_QUERY } from 'queries/repo';
import ReactMarkdown from 'react-markdown';
import { Skeleton } from '@material-ui/lab';

interface PropTypes {
  repoId: string | null;
  open: boolean;
  onClose: () => void;
}

const ReadmeModal: React.FC<PropTypes> = ({ repoId, open, onClose }) => {
  const { data, loading } = useQuery(README_QUERY, {
    variables: { repoId },
    skip: !open || !repoId,
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth={false}>
      <Box px={4} py={2} maxWidth="800px">
        {loading ? (
          <>
            <Skeleton width={100} height={20} />
            <Skeleton width={300} height={16} />
            <Skeleton width={320} height={16} />
            <Skeleton width={290} height={16} />
            <Skeleton width={280} height={16} />
          </>
        ) : (
          <ReactMarkdown
            source={data?.node.object ? data?.node.object.text : '## No README.md file available'}
          />
        )}
      </Box>
    </Dialog>
  );
};

export default ReadmeModal;
