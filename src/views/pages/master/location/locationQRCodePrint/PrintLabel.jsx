import React, { forwardRef } from 'react';
import { Paper, Grid, Typography, Box, Stack } from '@mui/material';
import { QRCodeCanvas } from 'qrcode.react';
import { Image } from 'components/MiniComponents';
import { BrandLogo } from 'config/icons';
const PaperMainLayout = ({ children }) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        mt: 0.8,
        display: 'flex',
        alignItems: 'center',
        p: 0.5,
        height: '180px',
        width: '380px',
      }}
    >
      {children}
    </Paper>
  );
};

const PrintLabel = forwardRef((props, ref) => {
  const { printData } = props;

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {Array.isArray(printData) ? (
        printData.map((data, index) => (
          <React.Fragment key={index}>
            {index % 3 === 0 && index !== 0 && <div style={{ pageBreakAfter: 'always' }} />}
            <PaperMainLayout>
              {/* Render data for each item */}
              <RenderData printData={data} />
            </PaperMainLayout>
          </React.Fragment>
        ))
      ) : (
        <PaperMainLayout>
          {/* Render data for the single object */}
          <RenderData printData={printData} />
        </PaperMainLayout>
      )}
    </div>
  );
});

// Extracted component for rendering data
const RenderData = ({ printData }) => {
  const data = [
    { label: 'Location Name', labelData: `${printData?.loc_name ?? ''}` },
    // { label: 'Location Code', labelData: `${printData?.loc_code ?? ''}` },
    { label: 'Location Type', labelData: `${printData?.place_of_location ?? ''}` },
    { label: 'Location Description', labelData: `${printData?.loc_description}` },
  ];
  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  const OtherLabelData = () => {
    return (
      <Stack px={0.5} spacing={0.5} textAlign="center">
        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1, fontSize: '0.9rem' }}>
          {`${printData?.loc_code}`}
        </Typography>
        <Typography variant="body2" align="center" sx={{ fontWeight: 'bold', fontSize: '0.6rem' }}>
          Orson Holding Company Ltd
        </Typography>
      </Stack>
    );
  };
  return (
    <Grid container alignItems="center" justifyContent="space-between" sx={{ userSelect: 'none' }}>
      <Grid
        component={Paper}
        variant="outlined"
        item
        xs={7.9}
        sx={{
          p: 1,
          height: '170px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box sx={{ mb: 0, display: 'flex', justifyContent: 'flex-start' }}>
          <Image image={BrandLogo} alt="JSW_Logo" width="80" />
        </Box>
        <Box width="100%">
          {data.map((item, index) => (
            <Box display="flex" columnGap={1} key={index}>
              <Box flexGrow={1} sx={{ width: '40%' }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.6rem' }}>
                  {item.label}
                  {''}
                </Typography>
              </Box>
              <Box sx={{ width: '1%' }}>:</Box>
              <Box flexGrow={1} sx={{ width: '45%' }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '0.6rem',
                  }}
                >
                  {truncateText(item.labelData, 22)}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Grid>
      <Grid
        item
        component={Paper}
        variant="outlined"
        xs={4}
        sx={{
          height: '170px',
          width: '100%',
          display: 'flex',
          gap: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <QRCodeCanvas value={`${printData?.loc_code}`} size={90} mt={1} />
        <OtherLabelData />
      </Grid>
    </Grid>
  );
};
export default PrintLabel;
