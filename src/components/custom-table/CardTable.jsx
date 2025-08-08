import React from 'react';
import { Card, Box, Typography, Divider, Grid } from '@mui/material';
import { formatDateOnly, FormatDateTime } from 'components/MiniComponents';

const CardTable = ({ data = [], headings = [] }) => {
  // Separate action headings from content headings
  const actionHeadings = headings.filter((heading) => heading.render && heading.type === 'button');
  const contentHeadings = headings.filter((heading) => heading.type !== 'button');

  // Function to render cell content based on heading type
  const renderCellContent = (heading, row) => {
    switch (heading.type) {
      case 'date':
        return FormatDateTime(row[heading.id]);
      case 'dateOnly':
        return formatDateOnly(row[heading.id]);
      case 'boolean':
        return row[heading.id] ? 'Yes' : 'No';
      default:
        return row[heading.id] ?? 'NA';
    }
    // switch (heading.type) {
    //   case 'date':
    //   case 'dateOnly':
    //     return new Date(row[heading.id]).toLocaleDateString();
    //   case 'boolean':
    //     return row[heading.id] ? 'Yes' : 'No';
    //   default:
    //     return row[heading.id] ?? 'NA';
    // }
  };

  return (
    <Box sx={{ width: '100%', py: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {data.map((row, rowIndex) => (
          <Card
            key={rowIndex}
            sx={{
              boxShadow: 1,
              transition: 'box-shadow 0.3s ease-in-out',
              '&:hover': {
                boxShadow: 3,
              },
            }}
          >
            {actionHeadings.length > 0 && (
              <Box
                sx={{
                  p: 2,
                  pb: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Sr No : {rowIndex + 1}
                  </Typography>
                </Box>
                {actionHeadings.map((heading) => (
                  <Box key={heading.id}>{heading.render(row, rowIndex)}</Box>
                ))}
              </Box>
            )}

            <Box sx={{ px: 2, py: 0 }}>
              {contentHeadings.map((heading, headingIndex) => (
                <Box key={heading.id}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      py: 1,
                      columnGap: 1.2,
                    }}
                  >
                    <Grid item xs={3}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        sx={{
                          fontWeight: 600,
                          wordBreak: 'break-word',
                          hyphens: 'auto',
                          WebkitHyphens: 'auto',
                          msHyphens: 'auto',
                          overflowWrap: 'break-word',
                          width: '100%',
                        }}
                      >
                        {heading.label}
                      </Typography>
                    </Grid>
                    <Grid item sm={0.1}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        sx={{ fontWeight: 600 }}
                      >
                        :
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography
                        variant="body1"
                        align={heading.align || 'left'}
                        sx={{
                          fontSize: '12px',
                          wordBreak: 'break-word',
                        }}
                      >
                        {renderCellContent(heading, row)}
                      </Typography>
                    </Grid>
                  </Box>
                  {headingIndex < contentHeadings.length - 1 && <Divider sx={{ my: 0.5 }} />}
                </Box>
              ))}
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default CardTable;
